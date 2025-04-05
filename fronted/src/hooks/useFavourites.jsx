import { useContext, useEffect, useRef } from "react";
import UserDetailContext from "../context/userDetailContext.jsx";
import { useQuery } from "react-query";
import { getAllFav } from "../utils/api";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";

const useFavourites = () => {
    const { userDetails, setUserDetails } = useContext(UserDetailContext);
    const queryRef = useRef();
    const { user, isAuthenticated } = useAuth0();

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["allFavourites", user?.email],
        queryFn: async () => {
            if (!isAuthenticated || !user?.email || !userDetails?.token) {
                return [];
            }
            return await getAllFav(user.email, userDetails.token);
        },
        onSuccess: (data) => {
            if (isAuthenticated && user?.email) {
                setUserDetails((prev) => ({
                    ...prev,
                    favourites: Array.isArray(data) ? data : []
                }));
            }
        },
        onError: (error) => {
            console.error("Error fetching favorites:", error);
            toast.error("Failed to fetch favorites");
            return [];
        },
        enabled: isAuthenticated && !!user?.email && !!userDetails?.token,
        staleTime: 30000,
        cacheTime: 60000,
        refetchOnWindowFocus: false
    });

    useEffect(() => {
        if (queryRef.current && userDetails?.token && isAuthenticated) {
            queryRef.current();
        }
    }, [userDetails?.token, isAuthenticated]);

    return {
        data: isAuthenticated ? (Array.isArray(data) ? data : []) : [],
        isError,
        isLoading,
        refetch
    };
};

export default useFavourites;


// import { useQuery } from "@tanstack/react-query";
// import { useContext } from "react";
// import { UserDetailContext } from "../context/userDetailContext.js";
// import { getAllFav } from "../utils/api.js";

// const useFavourites = () => {
//     const { userDetails, setUserDetails } = useContext(UserDetailContext);

//     // 🔹 Ensure email is always a string
//     const email = userDetails?.user?.email || "";

//     // 🔹 Debugging logs
//     console.log("User Details in Context:", userDetails);
//     console.log("Extracted Email:", email);
//     console.log("Token:", userDetails?.token);

//     const { data, isLoading, isError, refetch } = useQuery({
//         queryKey: ["allFavourites", email],
//         queryFn: async () => {
//             if (!email) {
//                 console.warn("❌ Skipping query: Email is missing");
//                 return []; // Return empty array to prevent errors
//             }
//             return getAllFav(email, userDetails.token);
//         },
//         enabled: !!email, // ✅ Only run query if email exists
//         onSuccess: (data) => {
//             setUserDetails((prev) => ({
//                 ...prev,
//                 Favourites: data
//             }));
//         },
//         staleTime: 30000
//     });

//     return { data, isLoading, isError, refetch };
// };

// export default useFavourites;
