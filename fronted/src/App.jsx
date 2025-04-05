// import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Listing from "./pages/Listing";
import Booking from "./pages/Booking";
import Favourites from "./pages/Favourites";
import './index.css';
import { Suspense } from "react";
import Layout from "./components/Layout";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import { ReactQueryDevtools } from "react-query/devtools";
import 'react-toastify/dist/ReactToastify.css';
import Property from "./pages/Property";
import { UserDetailProvider } from "./context/userDetailContext.jsx";
import BlogDetails from "./pages/BlogDetails";
import Terms from "./components/terms";
import Admin from "./pages/Admin";
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { Toaster } from 'react-hot-toast';
import Profile from "./pages/Profile";

export default function App() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                refetchOnMount: false,
                retry: 1
            }
        }
    });

    return (
        <MantineProvider>
            <UserDetailProvider>
                <QueryClientProvider client={queryClient}>
                    <Toaster position="top-center" />
                    <BrowserRouter>
                        <Suspense fallback={<div>Loading...</div>}>
                            <Routes>
                                <Route element={<Layout />}>
                                    {/* <Route path="/dashboard" element={<Dashboard />}>
                                       <Route path="users" element={<Users />} />
                                       <Route path="properties" element={<Properties />} />
                                       <Route path="analytics" element={<Analytics />} />
                                    </Route> */}
                                    <Route path="/" element={<Home />} />
                                    <Route path="/listing">
                                        <Route index element={<Listing />} />
                                        <Route path=":PropertyId" element={<Property />} />
                                    </Route>
                                    {/* <Route path="/update-profile" element={<UpdateProfile />} /> */}
                                    <Route path="/bookings" element={<Booking />} />
                                    <Route path="/favourites" element={<Favourites />} />
                                    {/* <Route path="/" element={<Home />} /> */}
                                    {/* <Route path="/dashboard/analytics" element={<Analytics />} />
                                    <Route path="/dashboard/users" element={<Users />} />
                                    <Route path="/dashboard/properties" element={<Properties />} />
                                    <Route path="/dashboard" element={<Dashboard />} /> */}
                                    <Route path="/terms" element={<Terms />} />
                                    <Route path="/blog/:id" element={<BlogDetails />} />
                                    <Route path="/admin" element={<Admin />} />
                                    <Route path="/profile" element={<Profile />} />
                                </Route>
                            </Routes>
                        </Suspense>
                    </BrowserRouter>
                    <ToastContainer />
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
            </UserDetailProvider>
        </MantineProvider>
    );
}
