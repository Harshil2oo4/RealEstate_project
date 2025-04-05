// import React, { useContext, useState } from 'react'
// import {Modal,Button} from "@mantine/core";
// import {DatePicker} from "@mantine/dates";
// import { useMutation } from 'react-query';
// import UserDetailContext from '../context/userDetailContext';
// import { bookVisit } from '../utils/api';
// import { toast } from 'react-toastify';
// import dayjs from 'dayjs';

// const BookingModal = ({opened, setOpened, email, propertyId}) => {

//     const [value,setValue] = useState(null);
//     const {
//       userDetails:{token},
//       setUserDetails} = useContext(UserDetailContext);
//     // console.log('Token:',token);
//     const handleBookingSuccess =()=>{
//       toast.success("Your Visit Booked successfully",{ position:"bottom-right"});
//     };
//     setUserDetails((prev)=>({
//       ...prev,
//       bookings: [
//         ...prev.bookings,
//         {
//           id: propertyId,date :dayjs(value).format('DD/MM/YYYY')
//         }
//       ]
//     }))


//     const {mutate, isLoading} = useMutation({
//         mutationFn:()=>bookVisit(value, propertyId, email, token),
//         onSuccess:()=>handleBookingSuccess(),
//         onError:({response})=>toast.error(response.data.message),
//         onSettled:()=>setOpened(false)
//     });

//   return (
//     <Modal
//     opened = {opened}
//     setOpened={setOpened}
//     title="Select Your date to Visit"
//     centered
//     onClose={()=>setOpened(false)}>
//        <div className="flexCenter flex-col gap-4">
//          <DatePicker value={value} onChange={setValue} minDate={new Date()} />
//          <Button disabled={!value} onClick={()=> mutate()}>Book Visit</Button>
//        </div>
//     </Modal>
//   )
// }
// export default BookingModal;

///////////////////////////////////gpt/////////////////////////////////////

import React, { useContext, useState } from 'react';
import { Modal, Button } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useMutation } from 'react-query';
import UserDetailContext from '../context/userDetailContext.jsx';
import { bookVisit } from '../utils/api';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const BookingModal = ({ opened, setOpened, email, propertyId }) => {
    const [value, setValue] = useState(null);
    const { userDetails: { token }, setUserDetails } = useContext(UserDetailContext);

    const handleBookingSuccess = () => {
        toast.success("Your visit has been booked successfully", { position: "bottom-right" });
        setUserDetails((prev) => ({
            ...prev,
            bookings: [
                ...prev.bookings,
                {
                    id: propertyId,
                    date: dayjs(value).format('DD/MM/YYYY')
                }
            ]
        }));
    };

    const { mutate, isLoading } = useMutation({
        mutationFn: () => bookVisit(value, propertyId, email, token),
        onSuccess: () => handleBookingSuccess(),
        onError: ({ response }) => toast.error(response?.data?.message || "Something went wrong"),
        onSettled: () => setOpened(false)
    });

    return (
        <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            title="Select Your Date to Visit"
            centered
        >
            <div className="flexCenter flex-col gap-4">
                <DatePicker 
                    value={value} 
                    onChange={setValue} 
                    minDate={new Date()} 
                />
                <Button 
                    disabled={!value || isLoading} 
                    loading={isLoading}
                    onClick={() => mutate()}
                >
                    Book Visit
                </Button>
            </div>
        </Modal>
    );
};

export default BookingModal;
























///////////////////////////////////////////////////////////////////////////////////////

// const BookingModal = ({ opened, setOpened, email, propertyId }) => {
//   const [value, setValue] = useState(null);
//   const { userDetails } = useContext(UserDetailContext);
//   const token = userDetails?.token;

//   console.log("Token from context:", token);

//   const { mutate, isLoading } = useMutation({
//     mutationFn: () => {
//       if (!token) {
//         console.error("Token is missing. Please log in again.");
//         toast.error("Please log in to book a visit.");
//         return;
//       }
//       if (!value) {
//         console.error("Date is missing.");
//         toast.error("Please select a date.");
//         return;
//       }
//       return bookVisit(value, propertyId, email, token);
//     },
//   });

//   return (
//     <Modal
//       opened={opened}
//       setOpened={setOpened}
//       title="Select Your date to Visit"
//       centered
//       onClose={() => setOpened(false)}
//     >
//       <div className="flexCenter flex-col gap-4">
//         <DatePicker value={value} onChange={setValue} minDate={new Date()} />
//         <Button disabled={!value || !token} onClick={() => mutate()}>
//           Book Visit
//         </Button>
//       </div>
//     </Modal>
//   );
// };

