import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Don't show error toast for auth errors
            return Promise.reject(error);
        }
        toast.error(error.response?.data?.message || "Something went wrong");
        return Promise.reject(error);
    }
);

export const getAllProperties = async () => {
    try {
        const response = await api.get(`/residency/allresd`);
        return response.data;
    } catch (error) {
        toast.error("Something went wrong");
        throw error;
    }
};

export const getProperty = async (id) => {
    try {
        const response = await api.get(`/residency/${id}`);
        return response.data;
    } catch (error) {
        toast.error("Something went wrong");
        throw error;
    }
};

export const createUser = async (email, token) => {
    try {
        await api.post(`/user/register`, { email }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        toast.error("Something went wrong, please try again");
        throw error;
    }
};

export const bookVisit = async (date, propertyId, email, token) => {
    if (!token) {
        throw new Error("Token is missing. Please log in again.");
    }
    
    try {
        const response = await api.post(
            `/user/bookVisit/${propertyId}`,
            { date, email },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error booking visit:", error);
        if (error.response?.status === 401) {
            throw new Error("Authentication failed. Please log in again.");
        }
        throw error;
    }
};

export const removeBooking = async (id, email, token) => {
    try {
        await api.post(`/user/removeBookings/${id}`, { email }, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        toast.error("Something went wrong, try again please");
        throw error;
    }
};

export const tofav = async (id, email, token) => {
    try {
        if (!token) {
            throw new Error("Please login to add to favorites");
        }
        if (!email) {
            throw new Error("Email is required");
        }

        const response = await api.post(
            `/user/toFav/${id}`,
            { email },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error adding to favorites:", error);
        if (error.response?.status === 401) {
            throw new Error("Please login again to continue");
        }
        throw error.response?.data || error;
    }
};

export const getAllFav = async (email, token) => {
    if (!email || !token) {
        throw new Error("Email and token are required");
    }

    try {
        const res = await api.post(
            `/user/allFav`,
            { email },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );

        return res.data?.favResidenciesID || [];
    } catch (error) {
        console.error("Error fetching favorites:", error);
        if (error.response?.status === 401) {
            throw new Error("Please login again to continue");
        }
        throw error;
    }
};

export const getAllBookings = async (email, token) => {
    if (!token) {
        throw new Error("Token is missing. Please log in again.");
    }
    
    try {
        const res = await api.post(
            `/user/allBookings`,
            { email },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res.data?.bookedVisits || [];
    } catch (error) {
        console.error("Error fetching bookings:", error);
        if (error.response?.status === 401) {
            throw new Error("Authentication failed. Please log in again.");
        }
        throw error;
    }
};

export const createResidency = async (data, token, userEmail) => {
    const requestData = { ...data, userEmail };

    try {
        const response = await api.post(`/residency/create`, requestData, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        throw error;
    }
};

export const deleteProperty = async (id, token) => {
    try {
        const response = await api.delete(`/residency/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        toast.error("Failed to delete property");
        throw error;
    }
};

export const updateProperty = async (id, data, token) => {
    try {
        console.log('Making update request:', {
            id,
            data
        });
        
        const response = await api.put(`/residency/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('Update error full details:', {
            error: error.response?.data || error.message,
            status: error.response?.status,
            statusText: error.response?.statusText
        });
        toast.error("Failed to update property");
        throw error;
    }
};
