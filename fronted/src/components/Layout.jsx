import React, { useContext, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import UserDetailContext from '../context/userDetailContext.jsx';
import { useMutation } from 'react-query';
import { createUser } from "../utils/api";
import useBookings from '../hooks/useBookings';
import useFavourites from '../hooks/useFavourites';
import { toast } from 'react-toastify';

const Layout = () => {
    const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
    const { setUserDetails } = useContext(UserDetailContext);

    // Always call hooks at the top level
    const { data: favData } = useFavourites();
    const { data: bookingsData } = useBookings();

    const { mutate } = useMutation({
        mutationKey: [user?.email],
        mutationFn: (token) => createUser(user?.email, token),
    });

    useEffect(() => {
        const getTokenAndRegister = async () => {
            try {
                if (!isAuthenticated || !user?.email) return;

                const token = await getAccessTokenSilently({
                    authorizationParams: {
                        audience: "http://localhost:8000",
                        scope: "openid profile email",
                    },
                });

                setUserDetails((prev) => ({
                    ...prev,
                    token,
                    email: user?.email,
                }));

                mutate(token);
            } catch (error) {
                console.error("Error in getTokenAndRegister:", error);
                toast.error("Authentication failed. Please try again.");
            }
        };

        getTokenAndRegister();
    }, [isAuthenticated, user?.email]);

    return (
        <>
            <div>
                <Header />
                <Outlet />
            </div>
            <Footer />
        </>
    );
};

export default Layout;
