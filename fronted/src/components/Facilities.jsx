// import { useAuth0 } from '@auth0/auth0-react';
// import { Box, Button, factory, Group, NumberInput } from '@mantine/core'
// import { useForm } from '@mantine/form';
// import React, { useContext } from 'react'
// import UserDetailContext from '../context/userDetailContext';
// import useProperties from '../hooks/useProperties';
// import { useMutation } from 'react-query';
// import { toast } from 'react-toastify';
// import { createResidency } from '../utils/api.js';

// const Facilities = ({prevStep,
//     propertyDetails,
//     setPropertyDetails,
//     setOpened,
//     setActiveStep,
// }) => {
//     const  form = useForm({
//         initialValues: {
//             bedrooms: propertyDetails.facilities.bedrooms,
//             parkings: propertyDetails.facilities.parkings,
//             bathrooms: propertyDetails.facilities.bathrooms,
//         },
//         validate:{
//             bedrooms: (value) => value < 1 ? "Must have at least one bedroom":null,
//             bathrooms: (value) => value < 1 ? "Must have at least one bathroom" :null,
//         },
//     });


//     const { bedrooms, parkings, bathrooms } = form.values;

//     const handleSubmit = () =>{
//         const { hasErrors } =  form.validate();
//         if (!hasErrors) {
//             setPropertyDetails((prev) => ({...prev, facilities: {bedrooms, parkings, bathrooms},
//             }));
//             mutate();
//         }
//     };


//     //Upload


//     const {user} = useAuth0();
//     const {userDetails: {token}} = useContext(UserDetailContext);
//     const {refetch: refetchProperties} = useProperties();


//     const {mutate, isLoading} = useMutation({
//         mutationFn:() =>
//             createResidency({
//                 ...propertyDetails,
//                 facilities:{bedrooms, parkings, bathrooms},   
//             },
//         token, user?.email
//        ),
//        onError:({response})=>
//         toast.error(response.data.message, {position:"bottom-right"}),
//        onSettled:()=>{
//         toast.success("Added Successfully", {
//             position:"bottom-right"
//         });
//         setPropertyDetails({
//             title:"",
//             description:"",
//             price:0,
//             country:"",
//             city:"",
//             address:"",
//             image:null,
//             facilities:{bedrooms:0, parkings:0, bathrooms:0},
//             userEmail: user?.email,  //Ensure user email included in property details.
//         });
//         setOpened(false);
//         setActiveStep(0);
//         refetchProperties();
//        },
//     });


//   return (
//   <Box maw={"30%"} mx="auto" my={"sm"}>
//     <form action="" onSubmit={(e)=>{
//         e.preventDefault()
//         handleSubmit();
//     }}
//     >
//         <NumberInput
//         withAsterisk
//         label="No of Bedrooms"
//         min={0}
//         {...form.getInputProps("bedrooms")}
//         />
//         <NumberInput
//         label="No of Parkings"
//         min={0}
//         {...form.getInputProps("parkings")}
//         />
//         <NumberInput
//         withAsterisk
//         label="No of Bathrooms"
//         min={0}
//         {...form.getInputProps("bathrooms")}
//         />

//        <Group position="center" mt="xl0">
//         <Button variant="default" onClick={prevStep}>Back
//         </Button>
//         <Button type="submit" color="green" disabled={isLoading}>{isLoading ?  "Submitting" : " Add Property"}
//         </Button>
//        </Group>
//     </form>
//   </Box>
//   );
// };

// export default Facilities;


// import React, { useState } from "react";
// import { Box, Button, Group, NumberInput, TextInput } from "@mantine/core";
// import { useMutation } from "@tanstack/react-query";
// import { createResidency } from "../utils/api.js";
// import { toast } from "react-toastify";

// const Facilities = ({ prevStep, nextStep, propertyDetails, setPropertyDetails, token, user }) => {
//     const [facilities, setFacilities] = useState({
//         bedrooms: propertyDetails?.facilities?.bedrooms || 0,
//         bathrooms: propertyDetails?.facilities?.bathrooms || 0,
//         parkings: propertyDetails?.facilities?.parkings || 0,
//     });

//     const handleFacilityChange = (key, value) => {
//         setFacilities((prev) => ({ ...prev, [key]: value }));
//     };

//     const { mutate, isLoading } = useMutation({
//         mutationFn: async () => {
//             try {
//                 console.log("Sending Data:", propertyDetails, facilities);

//                 const response = await createResidency(
//                     { ...propertyDetails, facilities },
//                     token,
//                     user?.email
//                 );

//                 console.log("Response:", response);
//                 return response;
//             } catch (error) {
//                 console.error("API Error:", error.response?.data || error.message);
//                 toast.error(error.response?.data?.message || "Server Error", { position: "bottom-right" });
//                 throw error;
//             }
//         },
//     });

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         setPropertyDetails((prev) => ({ ...prev, facilities }));

//         mutate();
//     };

//     return (
//         <Box maw="50%" mx="auto" my="md">
//             <form onSubmit={handleSubmit}>
//                 <NumberInput
//                     label="Bedrooms"
//                     min={0}
//                     value={facilities.bedrooms}
//                     onChange={(value) => handleFacilityChange("bedrooms", value)}
//                 />
//                 <NumberInput
//                     label="Bathrooms"
//                     min={0}
//                     value={facilities.bathrooms}
//                     onChange={(value) => handleFacilityChange("bathrooms", value)}
//                 />
//                 <NumberInput
//                     label="Parking Spaces"
//                     min={0}
//                     value={facilities.parkings}
//                     onChange={(value) => handleFacilityChange("parkings", value)}
//                 />

//                 <Group position="center" mt="xl">
//                     <Button variant="default" onClick={prevStep}>
//                         Back
//                     </Button>
//                     <Button type="submit" disabled={isLoading}>
//                         {isLoading ? "Submitting..." : "Submit"}
//                     </Button>
//                 </Group>
//             </form>
//         </Box>
//     );
// };

// export default Facilities;



import React, { useState } from "react";
import { Box, Button, Group, NumberInput, TextInput } from "@mantine/core";
import { createResidency } from "../utils/api.js";
import { toast } from "react-toastify";
import { useAuth0 } from "@auth0/auth0-react";
import UserDetailContext from '../context/userDetailContext.jsx';

const Facilities = ({ propertyDetails, setPropertyDetails, nextStep }) => {
  const [facilities, setFacilities] = useState({
    bedrooms: 1,
    bathrooms: 1,
    parking: 1,
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth0();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      console.log("🔑 Retrieved Token:", token);
      await createResidency(
        { ...propertyDetails, facilities },
        token,
        user?.email
      );

      toast.success("Residency created successfully");
      nextStep();
    } catch (error) {
      toast.error("Error creating residency: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maw={"50%"} max="auto" my={"md"}>
      <form onSubmit={handleSubmit}>
        <NumberInput
          label="Bedrooms"
          value={facilities.bedrooms}
          onChange={(value) => setFacilities({ ...facilities, bedrooms: value })}
        />
        <NumberInput
          label="Bathrooms"
          value={facilities.bathrooms}
          onChange={(value) => setFacilities({ ...facilities, bathrooms: value })}
        />
        <NumberInput
          label="Parking"
          value={facilities.parking}
          onChange={(value) => setFacilities({ ...facilities, parking: value })}
        />
        
        <Group position="center" mt="xl">
          <Button variant="default">Back</Button>
          <Button type="submit" loading={loading}>
            Submit
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default Facilities;
