import React, { useContext, useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import useAuthCheck from "../hooks/useAuthCheck";
import { useMutation } from "react-query";
import { useAuth0 } from "@auth0/auth0-react";
import UserDetailContext from "../context/userDetailContext";
import { checkFavourites, updateFavourites } from "../utils/common";
import { tofav } from "../utils/api";
import { toast } from "react-toastify";

const HeartBtn = ({ id }) => {
    const [heartColor, setHeartColor] = useState("white");
    const { validateLogin } = useAuthCheck();
    const { user, getAccessTokenSilently } = useAuth0();
    const {
        userDetails: { favourites, token },
        setUserDetails,
    } = useContext(UserDetailContext);

    useEffect(() => {
        setHeartColor(checkFavourites(id, favourites));
    }, [favourites, id]);

    const { mutate } = useMutation({
        mutationFn: async () => {
            try {
                // Get a fresh token
                const currentToken = token || await getAccessTokenSilently({
                    authorizationParams: {
                        audience: "http://localhost:8000",
                        scope: "openid profile email",
                    },
                });
                
                if (!currentToken) {
                    throw new Error("No authentication token available");
                }

                return await tofav(id, user?.email, currentToken);
            } catch (error) {
                console.error("Error in mutation:", error);
                throw error;
            }
        },
        onSuccess: (data) => {
            setUserDetails((prev) => ({
                ...prev,
                favourites: updateFavourites(id, prev.favourites),
            }));
            toast.success(data.message || "Successfully updated favorites");
        },
        onError: (error) => {
            console.error("Error toggling favorite:", error);
            toast.error(error.message || "Failed to update favorites");
            if (error.message?.includes("Please login")) {
                validateLogin();
            }
        },
    });

    const handleLike = async () => {
        if (validateLogin()) {
            try {
                mutate();
            } catch (error) {
                console.error("Error in handleLike:", error);
                toast.error("Failed to update favorites");
            }
        }
    };

    return (
        <div
            className="relative cursor-pointer"
            onClick={(e) => {
                e.stopPropagation();
                handleLike();
            }}
        >
            <AiFillHeart size={24} color={heartColor} />
        </div>
    );
};

export default HeartBtn;
