import React, { useContext, useEffect, useRef } from 'react';
import UserDetailContext from '../context/userDetailContext.jsx';
import { useQuery } from 'react-query';
import { getAllBookings } from '../utils/api';
import { useAuth0 } from "@auth0/auth0-react";

const useBookings = () => {
    const { userDetails, setUserDetails } = useContext(UserDetailContext);
    const queryRef = useRef();
    const { user, isAuthenticated } = useAuth0();

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["allBookings", user?.email],
        queryFn: async () => {
            if (!isAuthenticated || !user?.email || !userDetails?.token) {
                return [];
            }
            return await getAllBookings(user?.email, userDetails?.token);
        },
        onSuccess: (data) => {
            if (isAuthenticated && user?.email) {
                setUserDetails((prev) => ({
                    ...prev,
                    bookings: Array.isArray(data) ? data : [],
                }));
            }
        },
        enabled: isAuthenticated && !!user?.email && !!userDetails?.token,
        staleTime: 30000,
        cacheTime: 60000,
        refetchOnWindowFocus: false
    });

    queryRef.current = refetch;

    useEffect(() => {
        if (queryRef.current && userDetails?.token && isAuthenticated) {
            queryRef.current();
        }
    }, [userDetails?.token, isAuthenticated]);

    return { data: isAuthenticated ? data : [], isError, isLoading, refetch };
};

export default useBookings;



// import { useContext, useEffect, useRef } from "react";
// import UserDetailContext from "../context/userDetailContext";
// import { useQuery } from "react-query";
// import { getAllBookings } from "../utils/api";

// const useBookings = () => {
//   const { userDetails, setUserDetails } = useContext(UserDetailContext);
//   const queryRef = useRef();
//   const userEmail = userDetails?.email;
//   const userToken = userDetails?.token;

//   const { data = [], isLoading, isError, refetch } = useQuery({
//     queryKey: ["allBookings", userEmail],
//     queryFn: () => getAllBookings(userEmail, userToken),
//     onSuccess: (bookingsData) => {
//       setUserDetails((prev) => ({
//         ...prev,
//         bookings: bookingsData || [], // ✅ Ensure bookings is always an array
//       }));
//     },
//     enabled: !!userEmail,
//     staleTime: 30000,
//   });

//   console.log("User Details in Context:", userDetails);
//   console.log("Fetched Bookings:", data);

//   queryRef.current = refetch;

//   useEffect(() => {
//     if (queryRef.current) {
//       queryRef.current();
//     }
//   }, [userToken]);

//   return { data, isError, isLoading, refetch };
// };

// export default useBookings;


