import React from 'react';
import { useMemo } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import markerIcon from '../../assets/images/marker.svg';

const Map = () => {
    const mapContainerStyle = {
        width: "100%",
        height: "150px",
      };
      
  const center = useMemo(() => ({ lat: 47.019430799737535, lng: 28.840935034970492 }), []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAVuXXT-aBrrbnDT7AfNiYJK0Kj_nQn1VA",
  });

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps";

  return (
    <GoogleMap zoom={13.4} center={center} mapContainerStyle={mapContainerStyle}>
      <MarkerF position={center} 
        label={{
          text: "Vintage Room",
          color: "#ff3d00",
          fontSize: "13px",
          fontWeight: "bold",
        }}
        icon={{
          url: markerIcon,
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: { x: 25, y: 50 },
          labelOrigin: { x: 17, y: 40 }
        }} 
      />
    </GoogleMap>
  );
}

export default Map;

