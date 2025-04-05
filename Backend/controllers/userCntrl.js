import asyncHandler from 'express-async-handler';
import { prisma } from "../config/prismaConfig.js";
import fs from 'fs';
import path from 'path';



// create user register
export const createUser = asyncHandler(async(req,res)=>{
    console.log("creating a User")

    let{email} = req.body

    // console.log(email)   
    const userExists = await prisma.user.findUnique({where:{email:email}})
    if(!userExists){
        const user = await prisma.user.create({
            data: {
                ...req.body,
                createdAt: new Date()
            }
        });
        res.send({
            message:"user registered successfully",
            user:user,
        });
    }else res.status(201).send({message:"User Already registered"});
});



//======================To book a visit to residency=========================================================

export const bookVisit = asyncHandler(async (req, res) => {
    const { email, date } = req.body;
    const { id } = req.params;

    if (!email || !date || !id) {
        return res.status(400).json({ message: "Email, date, and residency ID are required" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { bookedVisit: true }, // Correct field name
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isAlreadyBooked = user.bookedVisit?.some((visit) => visit.id === id);
        if (isAlreadyBooked) {
            return res.status(400).json({ message: "This residency is already booked by you" });
        }

        await prisma.user.update({
            where: { email },
            data: {
                bookedVisit: { push: { id, date } }, // Correct field name
            },
        });

        res.status(200).json({ message: "Your visit is booked successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: "An error occurred while booking the visit",
            error: err.message,
        });
    }
});




// ===================================================================================================================

export const allBookings = asyncHandler(async(req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { bookedVisit: true }  // Match the schema field name
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ bookedVisits: user.bookedVisit });
    } catch (err) {
        console.error("Error fetching bookings:", err);
        res.status(500).json({ 
            message: "Failed to fetch bookings",
            error: err.message 
        });
    }
});

// export const allBookings = async (req, res) => {
//     try {
//       const email = req.query.email;  // Get email from query parameters
//       if (!email) {
//         return res.status(400).json({ error: "Email is required" });
//       }
  
//       const user = await User.findOne({ email });
//       if (!user) {
//         return res.status(404).json({ error: "User not found" });
//       }
  
//       res.status(200).json({ bookedVisits: user.bookedVisits });
//     } catch (error) {
//       console.error("Error fetching bookings:", error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   };




//   import User from "../models/User.js"; // Ensure User model is imported

// export const allBookings = async (req, res) => {
//   try {
//     const { email } = req.query; // Get email from query parameters

//     if (!email) {
//       return res.status(400).json({ error: "Email is required" });
//     }

//     const user = await User.findOne({ email }); // Use correct model reference

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.status(200).json({ bookedVisits: user.bookedVisits });
//   } catch (error) {
//     console.error("Error fetching bookings:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// ==================================================================================
// ==================================================================================
//======================Cancel Bookings================================================
// ==================================================================================
// ===============================================================================

export const cancelBooking = asyncHandler(async(req,res)=>{
    const {email} = req.body
    const {id} = req.params
    try{
       const user = await prisma.user.findUnique({
        where: {email:email},
        select: {bookedVisit:true},
       });

       const index = user.bookedVisit.findIndex((visit)=> visit.id === id);

    if(index === -1){
        res.status(404).json({Message: "Booking Not Found"})
    }else{
        user.bookedVisit.splice(index,1)
        await prisma.user.update({
            where: {email},
            data : {
                bookedVisit: user.bookedVisit,
            },
        });
        res.send("Booking Cancled Successfully")
    }
    }catch(err){
        throw new Error(err.message)
    }
});




// ==================================================================================
// ==================================================================================
//======================TO Favourites================================================
// ==================================================================================

export const toFav = asyncHandler(async(req,res)=>{
    const {email} = req.body;
    const {rid} = req.params;

    try{
        const user = await prisma.user.findUnique({
            where:{email},
            select:{favResidenciesID:true}
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const updatedUser = await prisma.user.update({
            where: { email },
            data: {
                favResidenciesID: user.favResidenciesID.includes(rid)
                    ? { set: user.favResidenciesID.filter((id) => id !== rid) }
                    : { push: rid }
            }
        });

        const message = user.favResidenciesID.includes(rid)
            ? "Removed from Favourites"
            : "Added to Favourites";

        res.status(200).json({
            message,
            user: updatedUser
        });
    } catch(err){
        console.error("Error in toFav:", err);
        res.status(500).json({
            message: "Failed to update favorites",
            error: err.message
        });
    }
});


// ==================================================================================
// ==================================================================================
//======================Get AllFavourites============================================
// ==================================================================================


export const getAllFav = asyncHandler(async(req,res)=>{
    const {email} = req.body
    try{
        const favResd = await prisma.user.findUnique({
             where:{email},
             select:{favResidenciesID:true}
        })

        res.status(200).send(favResd)
    }catch(err){
        throw new Error(err.message)
    }
});

// export const getAllFav = async (req, res) => {
//     const email = req.query.email;  // Get email from query parameters
//     if (!email) {
//       return res.status(400).json({ error: "Email is required" });
//     }  
//     try {
//       const user = await user.findOne({ email });
//       if (!user) {
//         return res.status(404).json({ error: "User not found" });
//       }
  
//       res.status(200).json({ favResidenciesID: user.favResidenciesID });
//     } catch (error) {
//       console.error("Error fetching favorites:", error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   };
  
  
  
// Add this new controller function
export const isAdmin = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    // Get admin emails from environment variable
    const adminEmails = process.env.ADMIN_EMAILS
      ? process.env.ADMIN_EMAILS.split(',').map(email => email.trim())
      : [];

    // Check if the email is in the admin list
    const isAdmin = adminEmails.includes(email);

    res.status(200).json({ isAdmin });
  } catch (error) {
    console.error("Error in isAdmin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
  
  
export const updateUser = asyncHandler(async (req, res) => {
  try {
    const { email, name, image, banner } = req.body;
    console.log('Received update request for email:', email);
    console.log('Update includes banner:', !!banner);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log('User not found:', email);
      return res.status(404).json({ message: "User not found" });
    }

    // Process banner if provided
    let processedBanner = banner;
    if (banner && banner.length > 1000000) { // If banner is larger than ~1MB
      console.log('Banner is too large, compressing...');
      // Keep the banner but log the size
      console.log('Original banner size:', banner.length);
    }

    try {
      // Update user with processed data
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          name: name || user.name,
          image: image || user.image,
          banner: processedBanner
        }
      });

      console.log('User updated successfully:', email);

      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser
      });
    } catch (dbError) {
      console.error('Database update error:', dbError);
      throw dbError;
    }
  } catch (error) {
    console.error("Error in updateUser:", error);
    console.error("Error stack:", error.stack);
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ 
      message: "Internal server error",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});
  
  
// Get all users with admin status
export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    // Get all users from database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bookedVisit: true,
        favResidenciesID: true,
        ownedResidencies: {
          select: {
            id: true
          }
        }
      }
    });

    // Get admin emails from environment variable
    const adminEmails = process.env.ADMIN_EMAILS
      ? process.env.ADMIN_EMAILS.split(',').map(email => email.trim())
      : [];

    // Add admin status and format user data
    const usersWithAdminStatus = users.map(user => ({
      ...user,
      isAdmin: adminEmails.includes(user.email),
      totalBookings: user.bookedVisit?.length || 0,
      totalFavorites: user.favResidenciesID?.length || 0,
      totalProperties: user.ownedResidencies?.length || 0,
      createdAt: new Date().toISOString() // Default to current date if not set
    }));

    res.status(200).json(usersWithAdminStatus);
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
  
  
// Update user's admin status
export const updateAdminStatus = asyncHandler(async (req, res) => {
  try {
    const { targetEmail, makeAdmin } = req.body;
    
    if (!targetEmail) {
      return res.status(400).json({ error: "Target email is required" });
    }

    // Get current admin emails
    let adminEmails = process.env.ADMIN_EMAILS
      ? process.env.ADMIN_EMAILS.split(',').map(email => email.trim())
      : [];

    if (makeAdmin) {
      // Add new admin if not already in the list
      if (!adminEmails.includes(targetEmail)) {
        adminEmails.push(targetEmail);
      }
    } else {
      // Prevent removing the main admin
      if (targetEmail === 'priyanklathiya5@gmail.com') {
        return res.status(403).json({ 
          error: "Cannot remove privileges from the main administrator"
        });
      }
      // Remove admin
      adminEmails = adminEmails.filter(email => email !== targetEmail);
    }

    // Update the environment variable
    process.env.ADMIN_EMAILS = adminEmails.join(',');

    // Write to .env file
    try {
      const envPath = path.join(process.cwd(), '.env');
      let envContent = await fs.promises.readFile(envPath, 'utf-8');
      
      // Split content into lines and find ADMIN_EMAILS line
      const envLines = envContent.split('\n');
      const adminEmailsLineIndex = envLines.findIndex(line => 
        line.trim().startsWith('ADMIN_EMAILS=')
      );

      // Update or add the ADMIN_EMAILS line
      const newLine = `ADMIN_EMAILS=${adminEmails.join(',')}`;
      if (adminEmailsLineIndex !== -1) {
        envLines[adminEmailsLineIndex] = newLine;
      } else {
        envLines.push(newLine);
      }

      // Write back to file
      await fs.promises.writeFile(envPath, envLines.join('\n'));

      res.status(200).json({ 
        message: makeAdmin ? 'User promoted to admin' : 'Admin privileges removed',
        isAdmin: makeAdmin,
        adminEmails
      });
    } catch (fileError) {
      console.error("Error updating .env file:", fileError);
      // Even if file update fails, we'll still return success since the runtime variable was updated
      res.status(200).json({ 
        message: makeAdmin ? 'User promoted to admin (temporary)' : 'Admin privileges removed (temporary)',
        isAdmin: makeAdmin,
        warning: "Changes will be lost on server restart",
        adminEmails
      });
    }
  } catch (error) {
    console.error("Error in updateAdminStatus:", error);
    res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
});
  
  
  