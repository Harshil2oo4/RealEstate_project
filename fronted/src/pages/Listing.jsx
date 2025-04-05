  // import React, { useState } from "react";
  // import Searchbar from "../components/Searchbar";
  // // import {PROPERTIES} from '../constant/data.jsx'
  // import Item from "../components/Item";
  // import useProperties from "../hooks/useProperties.jsx";
  // import { PuffLoader } from "react-spinner";
  // import '../constant/data.jsx'

  // const Listing = () => {
  //   const { data=[], isError, isLoading } = useProperties();
  //   // console.log(data)
  //   const [filter, setFilter] =  useState("")

  //   // if (isError) {
  //   //   return (
  //   //     <div>
  //   //       <span>Error While Fetching Data</span>
  //   //     </div>
  //   //   );
  //   // }
  //   // if (isLoading) {
  //   //   return (
  //   //     <div className="h-64 flexCenter">
  //   //       <PuffLoader
  //   //         height="80"
  //   //         width="80"
  //   //         radius={1}
  //   //         color="#555"
  //   //         aria-Label="puff-loading"
  //   //       />
  //   //     </div>
  //   //   );
  //   // }

  //   return (
  //     <main className="max-pad-container my-[99px]">
  //       <div className="max-pad-container py-10 xl:py22 bg-primary rounded-3xl">
  //         <div>
  //           <Searchbar filter={filter} setFilter={setFilter} />
  //           {/* container */}
  //           <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-10">
  //             {/* {data.map((property) => (
  //               <Item key={property.title} property={property} />
  //             ))} */}
  //              {Array.isArray(data) && data.length > 0 ? (
  //           data.filter((property)=>
  //             property.title.toLowerCase().include(filter.toLowerCase()) ||
  //             property.city.toLowerCase().include(filter.toLowerCase()) ||
  //             property.country.toLowerCase().include(filter.toLowerCase())
  //            )
  //              .map((property) => (
  //             <Item key={property.title} property={property} />
  //           ))
  //         ) : (
  //           <p>No properties found or still loading...</p>
  //         )}
  //           </div>
  //         </div>
  //       </div>
  //     </main>
  //   );
  // };

  // export default Listing;

  import React, { useState } from "react";
  import Searchbar from "../components/Searchbar";
  import Item from "../components/Item";
  import useProperties from "../hooks/useProperties.jsx";
  // import { PuffLoader } from "react-spinners"; // Fixed typo in import
  import "../constant/data.jsx"; // Make sure this file exists and is correctly imported
  
  const Listing = () => {
    const { data = [], isError, isLoading } = useProperties();
    const [filter, setFilter] = useState("");
  
    // Handle errors
    if (isError) {
      return (
        <div>
          <span>Error While Fetching Data</span>
        </div>
      );
    }
  
    // Show loading state
    // if (isLoading) {
    //   return (
    //     <div className="h-64 flexCenter">
    //       <PuffLoader color="#555" />
    //     </div>
    //   );
    // }
  
    return (
      <main className="max-pad-container my-[99px]">
        <div className="max-pad-container py-10 xl:py22 bg-primary rounded-3xl">
          <div>
            <Searchbar filter={filter} setFilter={setFilter} />
            {/* Property List */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-10">
              {Array.isArray(data) && data.length > 0 ? (
                data
                  .filter((property) => {
                    const title = property?.title || "";
                    const city = property?.city || "";
                    const country = property?.country || "";
                    const lowerFilter = filter.toLowerCase();
  
                    return (
                      title.toLowerCase().includes(lowerFilter) ||
                      city.toLowerCase().includes(lowerFilter) ||
                      country.toLowerCase().includes(lowerFilter)
                    );
                  })
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
  
  export default Listing;
  
  


