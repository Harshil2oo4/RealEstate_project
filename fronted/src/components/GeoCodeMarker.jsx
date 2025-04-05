// import React, { useEffect, useState } from 'react'
// import { Marker, Popup, useMap } from 'react-leaflet'
// import icon from 'leaflet/dist/images/marker-icon.png';
// import L from 'leaflet'; 
// import "leaflet/dist/leaflet.css";
// import iconShadow from 'leaflet/dist/images/marker-shadow.png';
// import * as ELG from 'esri-leaflet-geocoder';

// let DefaultIcon = L.icon({
//     iconUrl: icon,
//     shadowUrl: iconShadow,
// })
// L.Marker.prototype.options.icon = DefaultIcon

// const GeoCodeMarker = ({address}) => {

//     const map = useMap();
//     const [position,setPosition] = useState([60,19]);

//     useEffect(()=>{
//         ELG.geocode().text(address).run((err,results,response)=>{
//             if(results?.results?.lenght > 0){
//                 const{lat,lng} = results?.results[0].lating
//                 setPosition([lat,lng])
//                 map.flyTo([lat,lng],6)
//             }
//         })
//     },[address])

//   return (
//     <Marker position={position} icon={DefaultIcon}>
//         <Popup />
//     </Marker>
//   );
// };

// export default GeoCodeMarker;

import React, { useEffect, useState } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import * as ELG from "esri-leaflet-geocoder";

// Set default Leaflet marker icon
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const GeoCodeMarker = ({ address }) => {
  const map = useMap();
  const [position, setPosition] = useState([51.505, -0.09]); // Default to London

  useEffect(() => {
    if (!address) return; // Prevents running when address is empty

    ELG.geocode()
      .text(address)
      .run((error, response) => {
        if (error) {
          console.error("Geocoding Error:", error);
          return;
        }

        console.log("Geocoding Response:", response);

        if (response?.results?.length > 0) {
          const { lat, lng } = response.results[0].latlng; // Fixed typo from `lating`
          setPosition([lat, lng]); // Update position
          map.flyTo([lat, lng], 13); // Zoom to the found location
        } else {
          console.warn("No results found for address:", address);
        }
      });
  }, [address, map]); // Ensure `map` is included in dependencies

  return (
    <Marker position={position} icon={DefaultIcon}>
      <Popup>{address || "Location not found"}</Popup>
    </Marker>
  );
};

export default GeoCodeMarker;








// 2.44.00  completes map