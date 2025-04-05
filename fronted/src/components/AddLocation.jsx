

// import React from 'react';
// import { useForm } from "@mantine/form";
// import { validateString } from '../utils/common';
// import useCountries from '../hooks/useCountries';
// import { Button, Group, Select, TextInput } from '@mantine/core'; // Ensure Mantine is properly imported
// import Map from './Map';

// const AddLocation = ({ propertyDetails, setPropertyDetails, nextStep }) => {
//     const { getAll } = useCountries();

//     const form = useForm({
//         initialValues: {
//             country: propertyDetails?.country || '',
//             city: propertyDetails?.city || '',
//             address: propertyDetails?.address || '',
//         },
//         validate: {
//             country: (value) => validateString(value),
//             city: (value) => validateString(value),
//             address: (value) => validateString(value),
//         },
//     });
    
//     const {country, city, address} = form.values;

//     const handleSubmit = () =>{
//         const {hasErrors} = form.validate();
//         if(!hasErrors){
//             setPropertyDetails((prev)=> ({...prev, country, city, address}));
//             nextStep();
//         }
//     }
//     return (
//         <form 
//         onSubmit={(e)=>{
//             e.preventDefault();
//             handleSubmit();
//         }}
//         >
//             <div className="flexCenter">
//             {/* Left Section */}
//             <div>
//                 {/* Input Field */}
//                 <div  className="flexCenter flex-1">
//                     <Select
//                         label="Country"
//                         withAsterisk
//                         placeholder="Select a country"
//                         searchable={true} // Ensure this is correctly passed
//                         clearable
//                         data={getAll()} // Ensure `getAll()` returns an array of objects [{ value: 'US', label: 'United States' }]
//                         {...form.getInputProps("country")}
//                     />
//                     <TextInput
//                     w={"100%"}
//                     withAsterisk
//                     label="City"
//                     placeholder="City"
//                     data={getAll()} // Ensure `getAll()` returns an array of objects [{ value: 'US', label: 'United States' }]
//                     {...form.getInputProps("city")}
//                     />
//                     <TextInput
//                     w={"100%"}
//                     withAsterisk
//                     label="Address"
//                     placeholder="Address"
//                     data={getAll()} // Ensure `getAll()` returns an array of objects [{ value: 'US', label: 'United States' }]
//                     {...form.getInputProps("address")}
//                     />
//                 </div>
//             </div>
//             {/* Right Section (Add more fields if needed) */}
//             <div  className="flex-1">
//                 <Map address={address} city={city} country={country} />
//             </div>
//         </div>
//         <Group justify="center" mt="xl">
//                 <Button type="submit">Next step</Button>
//               </Group>
//      </form>
//     );
// };

// export default AddLocation;
  


import React from "react";
import { useForm } from "@mantine/form";
import { validateString } from "../utils/common";
import useCountries from "../hooks/useCountries";
import { Button, Group, Select, TextInput } from "@mantine/core";
import Map from "./Map";

const AddLocation = ({ propertyDetails, setPropertyDetails, nextStep }) => {
  const { getAll } = useCountries();

  const form = useForm({
    initialValues: {
      country: propertyDetails?.country || "",
      city: propertyDetails?.city || "",
      address: propertyDetails?.address || "",
    },
    validate: {
      country: (value) => validateString(value),
      city: (value) => validateString(value),
      address: (value) => validateString(value),
    },
  });

  const { country, city, address } = form.values;

  const handleSubmit = () => {
    const { hasErrors } = form.validate();
    if (!hasErrors) {
      setPropertyDetails((prev) => ({ ...prev, country, city, address }));
      if (typeof nextStep === "function") {
        nextStep(); // ✅ Ensure `nextStep` is a function before calling
      } else {
        console.error("nextStep is not a function!", nextStep);
      }
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div className="flexCenter">
        {/* Left Section */}
        <div className="flexCenter flex-1">
          <div className="flexCenter flex-col gap-4">
            <Select
              label="Country"
              withAsterisk
              placeholder="Select a country"
              searchable
              clearable
              data={getAll()}
              {...form.getInputProps("country")}
            />
            <TextInput
              w={"100%"}
              withAsterisk
              label="City"
              placeholder="City"
              {...form.getInputProps("city")}
            />
            <TextInput
              w={"100%"}
              withAsterisk
              label="Address"
              placeholder="Address"
              {...form.getInputProps("address")}
            />
          </div>
        </div>
        {/* Right Section */}
        <div className="flex-1">
          <Map address={address} city={city} country={country} />
        </div>
      </div>
      <Group justify="center" mt="xl">
        <Button type="submit">Next step</Button>
      </Group>
    </form>
  );
};

export default AddLocation;
