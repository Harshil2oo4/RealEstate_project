// import asyncHandler from "express-async-handler";
// import { prisma } from "../config/prismaConfig.js";

// export const createResidency = asyncHandler(async (req, res) => {
//   const {
//     title,
//     description,
//     price,
//     address,
//     country,
//     city,
//     facilities,
//     image,
//     userEmail,
//   } = req.body.data || req.body ;

//   try {
//     // Validate user existence
//     const user = await prisma.user.findUnique({
//       where: { email: userEmail },
//     });

//     if (!user) {
//       return res
//         .status(400)
//         .json({ message: "User with the provided email does not exist." });
//     }

//     // Create residency
//     const residency = await prisma.residency.create({
//       data: {
//         title,
//         description,
//         price,
//         address,
//         country,
//         city,
//         facilities,
//         image,
//         owner: { connect: { email: userEmail } },
//       },
//     });

//     res.send({message: "Residency created successfully",residency});
//    } catch (err) {
//     if(err.code === "P2002"){
//         throw new Error("A Residency with address already there");
//     }
//     throw new Error(err.message);
//    }
// });

import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

export const createResidency = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        price,
        address,
        country,
        city,
        facilities,
        image,
        userEmail,
    } = req.body;

    try {
        // Validate user existence
        const user = await prisma.user.findUnique({
            where: { email: userEmail },
        });

        if (!user) {
            return res.status(400).json({ message: "User with the provided email does not exist." });
        }

        // Create residency
        const residency = await prisma.residency.create({
            data: {
                title,
                description,
                price,
                address,
                country,
                city,
                facilities,
                image: image || "",
                owner: { connect: { email: userEmail } },
            },
        });

        res.status(201).json({ message: "Residency created successfully", residency });
    } catch (err) {
        if (err.code === "P2002") {
            return res.status(400).json({ message: "A Residency with this address already exists." });
        }
        res.status(500).json({ message: err.message });
    }
});




export const getAllResidencies = asyncHandler(async (req, res) => {
    try {
        const residencies = await prisma.residency.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json(residencies);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch residencies", error: error.message });
    }
});



//get a residency by id

// export const getResidency = asyncHandler(async (req, res) => {
//        const {id} = req.params;
//        try {
//         const  residency = await prisma.residency.findUnique({
//             where:{ id },
//         });

//         res.send(residency);
//        } catch (err) {
//         throw new Error(err.message);
//        }
// });

//or 

export const getResidency = asyncHandler(async (req, res) => {
    console.log("get id")
    const { id } = req.params;

    try {
        const residency = await prisma.residency.findUnique({
            where: { id: id }, // Ensures `id` is parsed as an integer
        });

        if (!residency) {
            return res.status(404).json({ message: "Residency not found" });
        }

        res.status(200).json(residency);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch residency", error: error.message });
    }
});

export const deleteResidency = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        // First check if the residency exists
        const existingResidency = await prisma.residency.findUnique({
            where: { id: id }
        });

        if (!existingResidency) {
            return res.status(404).json({ message: "Residency not found" });
        }

        // Delete the residency
        const residency = await prisma.residency.delete({
            where: { id: id }
        });

        res.status(200).json({ 
            message: "Residency deleted successfully", 
            residency 
        });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ 
            message: "Failed to delete residency", 
            error: error.message 
        });
    }
});

export const updateResidency = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    console.log('Updating residency:', {
        id,
        updateData
    });

    try {
        // First check if the residency exists
        const existingResidency = await prisma.residency.findUnique({
            where: { id: id }
        });

        if (!existingResidency) {
            console.log('Residency not found:', id);
            return res.status(404).json({ message: "Residency not found" });
        }

        // Update the residency
        const updatedResidency = await prisma.residency.update({
            where: { id: id },
            data: {
                title: updateData.title,
                description: updateData.description,
                price: parseFloat(updateData.price),
                address: updateData.address,
                city: updateData.city,
                country: updateData.country,
                image: updateData.image
            }
        });

        res.status(200).json({
            message: "Residency updated successfully",
            residency: updatedResidency
        });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({
            message: "Failed to update residency",
            error: error.message
        });
    }
});

