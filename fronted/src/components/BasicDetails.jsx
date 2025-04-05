// import React from 'react'
// import {
//     Box,
//     Button,
//     Group,
//     NumberInput,
//     TextInput,
//     Textarea,
// } from '@mantine/core';


// import {useForm} from "@mantine/form";
// import { validateString } from "../utils/common.js";
// const BasicDetails = ({
//     prevStep,
//     nextStep,
//     propertyDetails,
//     setPropertyDetails,
// }) => {

//     const form = useForm({
//         initialValues: {
//             title: propertyDetails.title,
//             description: propertyDetails.description,
//             price: propertyDetails.price,
//         },
//         validate:{
//             title: (value) => validateString(value),
//             description: (value) => validateString(value),
//             price: (value) => (value < 999 ? "Must be minimum 999 dollars" : null),
//         },
//     });

//     const {title, description, price} = form.values;
//     const handlesubmit = () =>{
//         const {hasErrors} = form.validate();
//         if (!hasErrors) {
//             setPropertyDetails((prev)=>({ ...prev, title ,description, price}));
//             nextStep();
//         }
//     };
//   return (
//     <Box maw={"50%"} max="auto" my={"md"}>
//         <form onSubmit={(e)=>{
//             e.preventDefault();
//             handlesubmit();
//         }}>
//             <TextInput 
//             withAsterisk
//             label="Title"
//             placeholder="Property Name"
//             {...form.getInputProps("title")}
//             />
//             <Textarea
//             withAsterisk
//             label="Description"
//             placeholder="Property Description"
//             {...form.getInputProps("description")}
//             />
//             <NumberInput
//             withAsterisk
//             label="Price"
//             placeholder="Price"
//             min={0}
//             {...form.getInputProps("price")}
//             />

//             <Group position="center" mt="xl">
//                 <Button variant="default" onClick={prevStep}>Back</Button>
//                 <Button type="submit">Next</Button>
//             </Group>
//         </form>
//     </Box>
//   );
// };

// export default BasicDetails;



import React from 'react';
import { Box, Button, Group, NumberInput, TextInput, Textarea } from '@mantine/core';
import { useForm } from "@mantine/form";
import { validateString } from "../utils/common.js";

const BasicDetails = ({ prevStep, nextStep, propertyDetails, setPropertyDetails }) => {
    const form = useForm({
        initialValues: {
            title: propertyDetails?.title || "",
            description: propertyDetails?.description || "",
            price: propertyDetails?.price || 999, // ✅ Default to 999 to avoid validation issues
        },
        validate: {
            title: (value) => validateString(value),
            description: (value) => validateString(value),
            price: (value) => (value < 999 ? "Must be minimum ₹999" : null),
        },
    });

    const { title, description, price } = form.values;

    const handleSubmit = () => {
        const { hasErrors } = form.validate();
        if (!hasErrors) {
            setPropertyDetails((prev) => ({ ...prev, title, description, price }));
            nextStep();
        }
    };

    return (
        <Box maw={"50%"} mx="auto" my={"md"}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <TextInput withAsterisk label="Title" placeholder="Property Name" {...form.getInputProps("title")} />
                <Textarea withAsterisk label="Description" placeholder="Property Description" {...form.getInputProps("description")} />
                <NumberInput withAsterisk label="Price" placeholder="Price" min={999} {...form.getInputProps("price")} />

                <Group position="center" mt="xl">
                    <Button variant="default" onClick={prevStep}>
                        Back
                    </Button>
                    <Button type="submit">Next</Button>
                </Group>
            </form>
        </Box>
    );
};

export default BasicDetails;
