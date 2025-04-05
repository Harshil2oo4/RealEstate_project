import React, { useContext, useState, useMemo } from "react";
import Searchbar from "../components/Searchbar";
import Item from "../components/Item";
import useProperties from "../hooks/useProperties.jsx";
// import PuffLoader from "react-spinner";
import UserDetailContext from "../context/userDetailContext.jsx";

const Favourites = () => {
  const { data = [], isError, isLoading } = useProperties();
  const [filter, setFilter] = useState("");
  const { userDetails } = useContext(UserDetailContext);
  const favourites = userDetails?.favourites || [];

  // Memoized filtering for better performance
  const filteredProperties = useMemo(() => {
    return data
      .filter((property) => favourites.includes(property.id)) // Filter by favourite properties
      .filter((property) =>
        property.title.toLowerCase().includes(filter.toLowerCase()) ||
        property.city.toLowerCase().includes(filter.toLowerCase()) ||
        property.country.toLowerCase().includes(filter.toLowerCase())
      );
  }, [data, favourites, filter]);

  return (
    <main className="max-pad-container my-[99px]">
      <div className="max-pad-container py-10 xl:py-22 bg-primary rounded-3xl">
        <div>
          <Searchbar filter={filter} setFilter={setFilter} />

          {/* Show Loading Spinner */}
          {isLoading && (
            <div className="h-64 flexCenter">
              {/* <PuffLoader height={80} width={80} radius={1} color="#555" aria-label="puff-loading" /> */}
            </div>
          )}

          {/* Show Error Message */}
          {isError && (
            <div>
              <span className="text-red-500">Error While Fetching Data</span>
            </div>
          )}

          {/* Show No Favourites Message */}
          {!isLoading && !isError && favourites.length === 0 && (
            <p className="text-center text-gray-500 mt-10">No favourites added yet.</p>
          )}

          {/* Property List */}
          {!isLoading && !isError && favourites.length > 0 && (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-10">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((property) => <Item key={property.id} property={property} />)
              ) : (
                <p className="text-center text-gray-500 col-span-full">
                  No properties match your search.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Favourites;

// import React, { useContext, useState, useMemo } from "react";
// import Searchbar from "../components/Searchbar";
// import Item from "../components/Item";
// import useProperties from "../hooks/useProperties.jsx";
// import { PuffLoader } from "react-spinners";
// import UserDetailContext from "../context/userDetailContext.js";

// const Favourites = () => {
//   const { data = [], isError, isLoading } = useProperties();
//   const [filter, setFilter] = useState("");
  
//   // Memoize favourites to avoid unnecessary recalculations
//   const { userDetails } = useContext(UserDetailContext);
//   const favouriteIds = useMemo(() => userDetails?.favourites || [], [userDetails]);

//   // Memoized filtering for better performance
//   const filteredProperties = useMemo(() => {
//     return data
//       .filter((property) => favouriteIds.includes(property.id)) // Filter by favourite properties
//       .filter((property) =>
//         property.title.toLowerCase().includes(filter.toLowerCase()) ||
//         property.city.toLowerCase().includes(filter.toLowerCase()) ||
//         property.country.toLowerCase().includes(filter.toLowerCase())
//       );
//   }, [data, favouriteIds, filter]);

//   return (
//     <main className="max-pad-container my-[99px]">
//       <div className="max-pad-container py-10 xl:py-22 bg-primary rounded-3xl">
//         <div>
//           {/* Searchbar */}
//           <Searchbar filter={filter} setFilter={setFilter} />

//           {/* Show Loading Spinner */}
//           {isLoading && (
//             <div className="h-64 flexCenter" aria-live="polite">
//               <PuffLoader height={80} width={80} radius={1} color="#555" aria-label="Loading..." />
//             </div>
//           )}

//           {/* Show Error Message */}
//           {isError && (
//             <div aria-live="polite">
//               <span className="text-red-500">Error While Fetching Data</span>
//             </div>
//           )}

//           {/* Show No Favourites Message */}
//           {!isLoading && !isError && favouriteIds.length === 0 && data.length > 0 && (
//             <p className="text-center text-gray-500 mt-10">
//               No favourites added yet.
//             </p>
//           )}

//           {/* Property List */}
//           {!isLoading && !isError && (
//             <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-10">
//               {filteredProperties.length > 0 ? (
//                 filteredProperties.map((property) => (
//                   <Item key={property.id} property={property} />
//                 ))
//               ) : (
//                 <p className="text-center text-gray-500 col-span-full">
//                   No properties match your search.
//                 </p>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// };

// export default Favourites;
