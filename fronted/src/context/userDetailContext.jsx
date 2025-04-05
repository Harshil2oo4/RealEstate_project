import React, { createContext, useState } from "react";

const UserDetailContext = createContext();

export const UserDetailProvider = ({ children }) => {
    const [userDetails, setUserDetails] = useState({
        token: null,
        email: null,
        favourites: [],
        bookings: []
    });

    return (
        <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
            {children}
        </UserDetailContext.Provider>
    );
};

export default UserDetailContext;


// import { createContext, useState } from "react";

// const UserDetailContext = createContext();

// export default UserDetailContext;

// export const UserDetailProvider = ({ children }) => {
//     const [userDetails, setUserDetails] = useState({});

//     return (
//         <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
//             {children}
//         </UserDetailContext.Provider>
//     );
// };

