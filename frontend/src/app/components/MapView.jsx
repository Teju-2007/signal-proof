// MapView.jsx
"use client";

import { useEffect, useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";

export default function MapView({ score }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // Dynamically load maplibre-gl on the client side only
    import("maplibre-gl").then((maplibregl) => {
      const defaultCoords = [80.648, 16.5062];

      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: "https://demotiles.maplibre.org/style.json",
        center: defaultCoords,
        zoom: 12,
      });

      if (typeof window !== "undefined" && "geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLng = position.coords.longitude;
            const userLat = position.coords.latitude;
            if (map.current) {
              map.current.flyTo({ center: [userLng, userLat], zoom: 13 });
              new maplibregl.Marker({ color: "#10B981" })
                .setLngLat([userLng, userLat])
                .setPopup(new maplibregl.Popup().setHTML("<b>Your Location</b>"))
                .addTo(map.current);
            }
          },
          (error) => console.log("Geolocation fallback to default area:", error)
        );
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return <div ref={mapContainer} className="w-full h-64 rounded-xl border border-slate-800 overflow-hidden" />;
}