import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Autocomplete,
  DirectionsRenderer,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const center = { lat: 48.8584, lng: 2.2945 };

function ViewInMapPage() {
  const { location } = useParams();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AlzaSyNHaGT1jk3_6_BEQWJUVgsY6m8dUCYcJmk",
    libraries: ["places"],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const [directionsResponse, setDirectionsResponse] = useState<any>(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [origin, setOrigin] = useState("X3R2+PW Badulla, Sri Lanka");
  const [destination, setDestination] = useState(location || "");
  const [loading, setLoading] = useState(false);
  console.log("map", map);
  useEffect(() => {
    if (isLoaded) {
      calculateRoute();
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader border-t-transparent border-blue-500" />
        <p className="ml-4 text-gray-500">Loading map...</p>
      </div>
    );
  }

  async function calculateRoute() {
    if (!origin || !destination) return;
    try {
      setLoading(true);
      const directionsService = new google.maps.DirectionsService();
      const results = await directionsService.route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      });
      setDirectionsResponse(results);
      setDistance(results.routes[0]?.legs[0]?.distance?.text || "");
      setDuration(results.routes[0]?.legs[0]?.duration?.text || "");
    } catch (error) {
      console.error("Error calculating route", error);
    } finally {
      setLoading(false);
    }
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    setOrigin("");
    setDestination("");
  }

  return (
    <div className="relative flex flex-col items-center h-screen w-screen">
      <div className="absolute top-0 left-0 w-full h-full">
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(mapInstance) => setMap(mapInstance)}
        >
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </div>

      <Card className="p-6 rounded-lg m-4 bg-white shadow-lg w-full max-w-lg z-10">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Autocomplete>
              <Input
                type="text"
                placeholder="Origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full"
              />
            </Autocomplete>
            <Autocomplete>
              <Input
                type="text"
                placeholder="Destination"
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                }}
                className="w-full"
              />
            </Autocomplete>
          </div>
          <div className="flex gap-2 justify-between">
            <Button
              onClick={calculateRoute}
              className="bg-blue-500 hover:bg-blue-600 text-white w-full"
              disabled={loading}
            >
              {loading ? "Calculating..." : "Calculate Route"}
            </Button>
            <Button
              onClick={clearRoute}
              className="bg-red-500 hover:bg-red-600 text-white w-full"
            >
              Clear Route
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-md text-gray-700">Distance: {distance || "N/A"}</p>
          <p className="text-md text-gray-700">Duration: {duration || "N/A"}</p>
        </div>
      </Card>

      <style>{`
        .loader {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          width: 24px;
          height: 24px;
          border-top-color: #3498db;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default ViewInMapPage;
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import axios from "axios";
// import { useState } from "react";
// import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";

// const sriLankaCenter = { lat: 7.8731, lng: 80.7718 };

// function ViewInMapPage() {
//   const [origin, setOrigin] = useState("Badulla, Sri Lanka");
//   const [destination, setDestination] = useState("Pattiyakumbura, Sri Lanka");
//   const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
//   const [distance, setDistance] = useState("");
//   const [duration, setDuration] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Function to geocode location name (using OpenCage API)
//   async function geocodeLocation(location: string) {
//     const response = await axios.get(
//       `https://api.opencagedata.com/geocode/v1/json`,
//       {
//         params: {
//           q: location,
//           key: import.meta.env.VITE_OPENCAGE_API_KEY, // Make sure to set the OpenCage API key in your .env file
//         },
//       }
//     );
//     const { lat, lng } = response.data.results[0].geometry;
//     return { lat, lng };
//   }

//   // Function to calculate the route using OpenRouteService
//   async function calculateRoute() {
//     if (!origin || !destination) return;
//     setLoading(true);
//     try {
//       // Geocode the origin and destination locations
//       const originCoords = await geocodeLocation(origin);
//       const destinationCoords = await geocodeLocation(destination);

//       // Call OpenRouteService API to get the route
//       const response = await axios.get(
//         "https://api.openrouteservice.org/v2/directions/driving-car",
//         {
//           params: {
//             api_key: import.meta.env.VITE_ORS_API_KEY, // Use the key here
//             start: `${originCoords.lng},${originCoords.lat}`, // Correct start format
//             end: `${destinationCoords.lng},${destinationCoords.lat}`, // Correct end format
//           },
//           headers: {
//             Accept: "application/json",
//           },
//         }
//       );

//       // Process the route data
//       const coords = response.data.features[0].geometry.coordinates;
//       const latLngs: [number, number][] = coords.map(
//         ([lng, lat]: [number, number]) => [lat, lng]
//       );

//       // Extract summary information
//       const summary = response.data.features[0].properties.summary;
//       setDistance((summary.distance / 1000).toFixed(2) + " km");
//       setDuration((summary.duration / 60).toFixed(0) + " mins");

//       // Set the route coordinates to display on the map
//       setRouteCoords(latLngs);
//     } catch (error) {
//       console.error("Route error", error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   // Function to clear the route
//   function clearRoute() {
//     setRouteCoords([]);
//     setDistance("");
//     setDuration("");
//   }

//   return (
//     <div className="relative flex flex-col items-center h-screen w-screen">
//       <MapContainer
//         center={sriLankaCenter}
//         zoom={8}
//         style={{ height: "100%", width: "100%" }}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://osm.org/copyright">OSM</a>'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         {routeCoords.length > 0 && (
//           <Polyline positions={routeCoords} color="blue" />
//         )}
//         {routeCoords.length > 0 && (
//           <>
//             <Marker position={routeCoords[0]} />
//             <Marker position={routeCoords[routeCoords.length - 1]} />
//           </>
//         )}
//       </MapContainer>

//       <Card className="p-6 rounded-lg m-4 bg-white shadow-lg w-full max-w-lg z-10 absolute top-5">
//         <div className="flex flex-col gap-4">
//           <div className="flex gap-2">
//             <Input
//               value={origin}
//               onChange={(e) => setOrigin(e.target.value)}
//               placeholder="Origin"
//               className="w-full"
//             />
//             <Input
//               value={destination}
//               onChange={(e) => setDestination(e.target.value)}
//               placeholder="Destination"
//               className="w-full"
//             />
//           </div>
//           <div className="flex gap-2 justify-between">
//             <Button
//               onClick={calculateRoute}
//               className="bg-blue-500 text-white w-full"
//               disabled={loading}
//             >
//               {loading ? "Calculating..." : "Calculate Route"}
//             </Button>
//             <Button
//               onClick={clearRoute}
//               className="bg-red-500 text-white w-full"
//             >
//               Clear
//             </Button>
//           </div>
//           <div className="mt-2 text-gray-800">
//             <p>Distance: {distance || "N/A"}</p>
//             <p>Duration: {duration || "N/A"}</p>
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// }

// export default ViewInMapPage;
