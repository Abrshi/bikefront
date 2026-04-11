"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { axiosbaseurl } from "@/axios/axios";
import { useRouter } from "next/navigation";

export default function Map() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);
  const watchIdRef = useRef(null);
  const router = useRouter();

  // 🚀 Fetch nearby stations (UPDATED ENDPOINT)
  const fetchNearbyStations = async (lat, lng) => {
    try {
      const res = await axiosbaseurl.get(
        `/map/nearby?lat=${lat}&lng=${lng}&radius=5`
      );
      console.log("Nearby stations response:", res); 
      return res.data;
    } catch (err) {
      console.error("Nearby stations error:", err);
      return [];
    }
  };

  // 🚗 Get route (OSRM)
  const getRoute = async (userLng, userLat, stationLng, stationLat) => {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/cycling/${userLng},${userLat};${stationLng},${stationLat}?overview=full&geometries=geojson`
    );
    const data = await res.json();
    return data.routes[0];
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { longitude, latitude } = position.coords;

      // 🗺️ INIT MAP
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: [
                "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
                "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
                "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
              ],
              tileSize: 256,
            },
          },
          layers: [
            {
              id: "osm-tiles",
              type: "raster",
              source: "osm",
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        },
        center: [longitude, latitude],
        zoom: 14,
      });

      mapRef.current = map;

      // 🔵 USER MARKER
      const userEl = document.createElement("div");
      userEl.style.width = "14px";
      userEl.style.height = "14px";
      userEl.style.backgroundColor = "blue";
      userEl.style.borderRadius = "50%";
      userEl.style.border = "2px solid white";

      const userMarker = new maplibregl.Marker({ element: userEl })
        .setLngLat([longitude, latitude])
        .addTo(map);

      userMarkerRef.current = userMarker;

      // 🚀 FETCH STATIONS
      const nearby = await fetchNearbyStations(latitude, longitude);
      if (!nearby.length) return;

      // 🧠 BEST STATION (SMART)
      let bestStation =
        nearby.find((s) => s.available_bikes > 0) || nearby[0];

      // 📍 ADD STATIONS
      nearby.forEach((station) => {
        const el = document.createElement("div");

        el.style.backgroundImage =
          station.available_bikes > 0
            ? "url('/blue.png')"
            : "url('/green.png')";

        el.style.width = "70px";
        el.style.height = "70px";
        el.style.backgroundSize = "contain";
        el.style.backgroundRepeat = "no-repeat";
        el.style.cursor = "pointer";

        el.addEventListener("click", () => {
          router.push(`/station/${station.id}`);
        });

        new maplibregl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([station.longitude, station.latitude])
          .setPopup(
            new maplibregl.Popup().setText(
              `${station.area_name}
🚲 ${station.available_bikes} bikes
📏 ${station.distance.toFixed(2)} km`
            )
          )
          .addTo(map);
      });

      // 🚗 INITIAL ROUTE
      const routeData = await getRoute(
        longitude,
        latitude,
        bestStation.longitude,
        bestStation.latitude
      );

      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: routeData.geometry,
        },
      });

      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#007bff",
          "line-width": 4,
        },
      });

      // 🟢 LIVE TRACKING
      watchIdRef.current = navigator.geolocation.watchPosition(
        async (pos) => {
          const { longitude, latitude } = pos.coords;

          // move user marker
          userMarkerRef.current.setLngLat([longitude, latitude]);

          // smooth camera follow (no zoom change)
          map.easeTo({
            center: [longitude, latitude],
            duration: 800,
          });

          // 🔄 update route live
          if (bestStation && map.getSource("route")) {
            const newRoute = await getRoute(
              longitude,
              latitude,
              bestStation.longitude,
              bestStation.latitude
            );

            map.getSource("route").setData({
              type: "Feature",
              geometry: newRoute.geometry,
            });
          }
        },
        (err) => console.error("Tracking error:", err),
        {
          enableHighAccuracy: true,
        }
      );
    });

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      mapRef.current?.remove();
    };
  }, []);

  return <div ref={mapContainer} style={{ width: "100%", height: "500px" }} />;
}