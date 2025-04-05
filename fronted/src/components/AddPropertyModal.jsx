// import React, { useState } from 'react';
// import {Container, Modal, Stepper} from "@mantine/core";
// import AddLocation from './AddLocation';
// import { useAuth0 } from '@auth0/auth0-react';
// import UploadImage from './UploadImage';
// import Facilities from './Facilities';
// import BasicDetails from './BasicDetails';

// const AddPropertyModal = ({opened, setOpened}) => {

//     const [active,setActive] = useState(0);
//     const {user} = useAuth0();
//     const [propertyDetails, setPropertyDetails] = useState({
//         title:"",
//         description:"",
//         price:"",
//         country:"",
//         city:"",
//         address:"",
//         image:null,
//         facilities:{
//             bedroom:0,
//             parking:0,
//             bathroom:0,
//         },
//        useEmail:user?.email,
//     });

//     const nextStep = ()=>{
//         setActive((current)=>(current < 4 ? current + 1 : current));
//     };
//     const prevStep = ()=>{
//         setActive((current)=>(current > 0 ? current - 1 : current));
//     };

//   return (
//     <Modal
//     opened={opened}
//     onClose={()=> setOpened(false)}
//     closeOnClickOutside
//     size={"90rem"}
//     >
//      <Container h={"34rem"} w={"100%"}>
//      <>
//       <Stepper 
//       active={active} 
//       onStepClick={setActive} 
//       allowNextStepsSelect={false}
//       >
//         <Stepper.Step label="Location" description="Address">
//         <AddLocation
//         nextS tep={nextStep}
//         propertyDetails={propertyDetails}
//         setPropertyDetails={setPropertyDetails}
//         />
//         </Stepper.Step>
//         <Stepper.Step label="Image" description="Upload Image">
//         <UploadImage
//         prevStep={prevStep}
//         nextStep={nextStep}
//         propertyDetails={propertyDetails}
//         setPropertyDetails={setPropertyDetails}
//         />
//         </Stepper.Step>
//         <Stepper.Step label="Basics" description="Details">
//         <BasicDetails
//         prevStep={prevStep}
//         nextStep={nextStep}
//         propertyDetails={propertyDetails}
//         setPropertyDetails={setPropertyDetails}
//         />
//         </Stepper.Step>
//         <Stepper.Step>
//           <Facilities />
//         </Stepper.Step>
//         <Stepper.Completed>
//           Completed, click back button to get to previous step
//         </Stepper.Completed>
//       </Stepper>
//     </>
//         </Container>    
//     </Modal>
//   )
// }

// export default AddPropertyModal;


import React, { useState } from "react";
import { Container, Modal, Stepper } from "@mantine/core";
import AddLocation from "./AddLocation";
import { useAuth0 } from "@auth0/auth0-react";
import UploadImage from "./UploadImage";
import Facilities from "./Facilities";
import BasicDetails from "./BasicDetails";

const AddPropertyModal = ({ opened, setOpened }) => {
  const [active, setActive] = useState(0);
  const { user } = useAuth0();

  const [propertyDetails, setPropertyDetails] = useState({
    title: "",
    description: "",
    price: "",
    country: "",
    city: "",
    address: "",
    image: null,
    facilities: {
      bedroom: 0,
      parking: 0,
      bathroom: 0,
    },
    userEmail: user?.email,
  });

  const nextStep = () => {
    setActive((current) => (current < 4 ? current + 1 : current));
  };

  const prevStep = () => {
    setActive((current) => (current > 0 ? current - 1 : current));
  };

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      closeOnClickOutside
      size={"90rem"}
    >
      <Container h={"34rem"} w={"100%"}>
        <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false}>
          <Stepper.Step label="Location" description="Address">
            <AddLocation
              nextStep={nextStep} // ✅ Fixed (No space in `nextStep`)
              propertyDetails={propertyDetails}
              setPropertyDetails={setPropertyDetails}
            />
          </Stepper.Step>
          <Stepper.Step label="Image" description="Upload Image">
            <UploadImage
              prevStep={prevStep}
              nextStep={nextStep}
              propertyDetails={propertyDetails}
              setPropertyDetails={setPropertyDetails}
            />
          </Stepper.Step>
          <Stepper.Step label="Basics" description="Details">
            <BasicDetails
              prevStep={prevStep}
              nextStep={nextStep}
              propertyDetails={propertyDetails}
              setPropertyDetails={setPropertyDetails}
            />
          </Stepper.Step>
          <Stepper.Step>
            <Facilities
              propertyDetails={propertyDetails}
              setPropertyDetails={setPropertyDetails}
              nextStep={nextStep}
            />
          </Stepper.Step>
          <Stepper.Completed>
            Completed, click back button to get to the previous step
          </Stepper.Completed>
        </Stepper>
      </Container>
    </Modal>
  );
};

export default AddPropertyModal;
