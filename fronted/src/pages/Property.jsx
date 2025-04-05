import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useLocation } from "react-router-dom";
import { getProperty, removeBooking } from "../utils/api";
import { MdOutlineBathtub, MdOutlineBed, MdOutlineGarage } from 'react-icons/md';
import HeartBtn from "../components/HeartBtn.jsx";
import { FaLocationDot } from "react-icons/fa6";
import { IoArrowBack, IoArrowForward } from 'react-icons/io5';
import Map from "../components/Map.jsx";
import useAuthCheck from "../hooks/useAuthCheck.jsx";
import { useAuth0 } from "@auth0/auth0-react";
import BookingModal from "../components/BookingModal.jsx";
import UserDetailContext from "../context/userDetailContext.jsx";
import { Button } from "@mantine/core";
import { toast } from "react-toastify";

const Property = () => {
  const { pathname } = useLocation();
  const id = pathname.split("/").slice(-1)[0];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const queryClient = useQueryClient();

  // Use a unique query key for each property
  const { data, isLoading, isError } = useQuery(
    ["property", id],  // Include id in query key
    () => getProperty(id),
    {
      refetchOnWindowFocus: false,
      cacheTime: 0, // Disable caching to always fetch fresh data
      staleTime: 0, // Consider data stale immediately
    }
  );

  const [modalOpened, setModalOpened] = useState(false);
  const { validateLogin } = useAuthCheck();
  const { user } = useAuth0();

  const {
    userDetails: { token, bookings },
    setUserDetails } = useContext(UserDetailContext);

  // Reset image index when property changes
  React.useEffect(() => {
    setCurrentImageIndex(0);
  }, [id]);

  // Get all available images
  const allImages = React.useMemo(() => {
    if (!data) return [];
    return Array.isArray(data.images) && data.images.length > 0
      ? data.images
      : data.image
        ? [data.image]
        : [];
  }, [data]);

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const { mutate: cancelBooking, isLoading: cancelling } = useMutation({
    mutationFn: () => removeBooking(id, user?.email, token),
    onSuccess: () => {
      setUserDetails((prev) => ({
        ...prev,
        bookings: prev.bookings.filter((booking) => booking?.id !== id),
      }));
      toast.success("Booking cancelled successfully!", { position: "bottom-right" });
      // Invalidate the property query to refetch fresh data
      queryClient.invalidateQueries(["property", id]);
    },
  });

  if (isLoading) {
    return (
      <div className="h-64 flexCenter">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-64 flexCenter text-red-500">
        Error loading property details. Please try again.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-64 flexCenter text-gray-500">
        Property not found
      </div>
    );
  }

  return (
    <section className="max-padd-container my-[90px]">
      <div className="pb-2 relative">
        <div className="relative h-[27rem] w-full">
          {allImages.length > 0 ? (
            <>
              <img
                src={allImages[currentImageIndex]}
                alt={data?.title}
                className="rounded-xl h-full w-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/800x600?text=No+Image';
                }}
              />
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
                  >
                    <IoArrowBack className="text-gray-700" size={24} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
                  >
                    <IoArrowForward className="text-gray-700" size={24} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {allImages.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gray-50 rounded-xl flex items-center justify-center">
              <span className="text-gray-400">No Image Available</span>
            </div>
          )}
          {/* like btn */}
          <div className='absolute top-4 right-6'>
            <HeartBtn id={id} />
          </div>
        </div>
      </div>
      {/* container */}
      <div className="xl:flexBetween gap-8">
        {/* leftside */}
        <div className="flex-1">
          <h5 className="bold-16 my-1 text-secondary">{data?.city}</h5>
          <div className="flexBetween">
            <h4 className="medium-18 line-clamp-1">{data?.title}</h4>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 items-center">
                <div className="bold-20">₹{data?.price}.00</div>
                <div className="text-orange-500">
                  <span className="text-sm">Negotiable</span>
                </div>
              </div>
            </div>
          </div>
          {/* info */}
          <div className='flex gap-x-4 py-2'>
            <div className='flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]'><MdOutlineBed /> {data?.facilities?.bedrooms || 0}</div>
            <div className='flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]'><MdOutlineBathtub /> {data?.facilities?.bathrooms || 0}</div>
            <div className='flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]'><MdOutlineGarage /> {data?.facilities?.parkings || 0}</div>
            <div className='flexCenter gap-x-2 pr-4 font-[500]'>400 sq ft</div>
          </div>
          <p className="pt-2 mb-4">{data?.description}</p>
          <div className="flexStart gap-x-2 my-9">
            <FaLocationDot />
            <div>
              {data?.address} {data?.city} {data?.country}
            </div>
          </div>
          <div className='flexBetween'>
            {bookings?.map((booking) => booking.id).includes(id) ? (
              <>
                <Button
                  onClick={() => cancelBooking()}
                  variant="outline"
                  w={"100%"}
                  color="red"
                  disabled={cancelling}
                >
                  Cancel Booking
                </Button>
                <p className="text-red-500 medium-15 ml-3">
                  You've already booked visit for {bookings?.filter((booking) => booking?.id === id)[0].date}
                </p>
              </>
            ) : (
              <button
                onClick={() => {
                  validateLogin() && setModalOpened(true);
                }}
                className='btn-secondary rounded-xl !py-[7px] !px-5 shadow-sm w-full'
              >
                Book The Visit
              </button>
            )}

            <BookingModal
              opened={modalOpened}
              setOpened={setModalOpened}
              propertyId={id}
              email={user?.email}
            />
          </div>
        </div>
        {/* rightside */}
        <div className="flex-1">
          <Map address={data?.address} city={data?.city} country={data?.country} />
        </div>
      </div>
    </section>
  );
};

export default Property;
