import React, { useContext, useState } from "react";
import Searchbar from "../components/Searchbar";
// import {PROPERTIES} from '../constant/data.jsx'
import Item from "../components/Item";
import useProperties from "../hooks/useProperties.jsx";
// import { PuffLoader } from "react-spinner";
import '../constant/data.jsx'
import UserDetailContext from "../context/userDetailContext.jsx";

const Booking = () => {
  const { data, isError, isLoading } = useProperties();
  // console.log(data)
  const [filter, setFilter] =  useState("");
  const {userDetails: {bookings}} = useContext(UserDetailContext)
  

  // if (isError) {
  //   return (
  //     <div>
  //       <span>Error While Fetching Data</span>
  //     </div>
  //   );
  // }
  // if (isLoading) {
  //   return (
  //     <div className="h-64 flexCenter">
  //       <PuffLoader
  //         height="80"
  //         width="80"
  //         radius={1}
  //         color="#555"
  //         aria-Label="puff-loading"
  //       />
  //     </div>
  //   );
  // }

  return (
    <main className="max-pad-container my-[99px]">
      <div className="max-pad-container py-10 xl:py22 bg-primary rounded-3xl">
        <div>
          <Searchbar filter={filter} setFilter={setFilter} />
          {/* container */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-10">
            {/* {data.map((property) => (
              <Item key={property.title} property={property} />
            ))} */}
            {Array.isArray(data) && data.length > 0 ? (
  data
    .filter((property) =>
      Array.isArray(bookings) &&
      bookings.map((booking) => booking.id).includes(property.id)
    )
    .filter((property) =>
      property.title.toLowerCase().includes(filter.toLowerCase()) ||
      property.city.toLowerCase().includes(filter.toLowerCase()) ||
      property.country.toLowerCase().includes(filter.toLowerCase())
    )
    .map((property) => (
      <Item key={property.title} property={property} />
    ))
) : (
  <p>No properties found or still loading...</p>
)}

          </div>
        </div>
      </div>
    </main>
  );
};

export default Booking;

// import React, { useContext, useState } from "react";
// import Searchbar from "../components/Searchbar";
// import Item from "../components/Item";
// import useProperties from "../hooks/useProperties.jsx";
// import { PuffLoader } from "react-spinners"; // ✅ Fixed typo in spinner import
// import UserDetailContext from "../context/userDetailContext.js";

// const Booking = () => {
//   const { data = [], isError, isLoading } = useProperties();
//   const [filter, setFilter] = useState("");
//   const { userDetails } = useContext(UserDetailContext);
  
//   // ✅ Ensure bookings is an array (avoid "undefined" error)
//   const bookings = userDetails?.bookings ?? [];

//   return (
//     <main className="max-pad-container my-[99px]">
//       <div className="max-pad-container py-10 xl:py22 bg-primary rounded-3xl">
//         <Searchbar filter={filter} setFilter={setFilter} />
//         <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-10">
//           {Array.isArray(data) && data.length > 0 ? (
//             data
//               .filter((property) => 
//                 bookings.some((booking) => booking.id === property.id) // ✅ Fixed include → includes
//               )
//               .filter((property) =>
//                 property.title.toLowerCase().includes(filter.toLowerCase()) ||
//                 property.city.toLowerCase().includes(filter.toLowerCase()) ||
//                 property.country.toLowerCase().includes(filter.toLowerCase())
//               )
//               .map((property) => (
//                 <Item key={property.title} property={property} />
//               ))
//           ) : (
//             <p>No properties found or still loading...</p>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// };

// export default Booking;
