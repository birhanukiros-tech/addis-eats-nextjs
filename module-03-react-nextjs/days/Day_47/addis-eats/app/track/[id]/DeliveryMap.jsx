"use client";

import * as L from "leaflet";
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Demo courier location — not live GPS.
const COURIER = [8.9950, 38.7896];

function createLocationIcon(color) {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 46px;
        height: 46px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 3px 10px rgba(0,0,0,0.35);
      ">
        <svg xmlns="http://www.w3.org/2000/svg"
          width="27" height="27" viewBox="0 0 24 24"
          fill="none" stroke="white" stroke-width="2.5"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/>
          <circle cx="12" cy="10" r="2.5"/>
        </svg>
      </div>
    `,
    iconSize: [46, 46],
    iconAnchor: [23, 23],
    popupAnchor: [0, -23],
  });
}

const courierIcon = createLocationIcon("#ef4444");
const deliveryIcon = createLocationIcon("#b91c1c");

function FitMapToMarkers({ deliveryPosition }) {
  const map = useMap();

  useEffect(() => {
    if (!deliveryPosition) return;

    const bounds = L.latLngBounds([
      COURIER,
      deliveryPosition,
    ]);

    map.fitBounds(bounds, {
      padding: [45, 45],
      maxZoom: 14,
    });
  }, [map, deliveryPosition]);

  return null;
}

export default function DeliveryMap({ address }) {
  const [deliveryPosition, setDeliveryPosition] = useState(null);
  const [locationStatus, setLocationStatus] = useState("loading");
  const [matchedAddress, setMatchedAddress] = useState("");

  useEffect(() => {
    const cleanAddress =
      typeof address === "string" ? address.trim() : "";

    if (!cleanAddress) {
      setDeliveryPosition(null);
      setLocationStatus("missing");
      setMatchedAddress("");
      return;
    }

    const controller = new AbortController();

    async function findDeliveryLocation() {
      setDeliveryPosition(null);
      setMatchedAddress("");
      setLocationStatus("loading");

      try {
        const parts = cleanAddress
          .split(",")
          .map((part) => part.trim())
          .filter(Boolean);

        // Try the complete address first, then broader address terms.
        const queries = [
          `${cleanAddress}, Addis Ababa, Ethiopia`,
          cleanAddress,
          ...parts.slice(1).map((part, index) =>
            [
              ...parts.slice(index + 1),
              "Addis Ababa",
              "Ethiopia",
            ].join(", ")
          ),
        ];

        const uniqueQueries = [...new Set(queries)];

        for (const searchText of uniqueQueries) {
          const url = new URL(
            "https://photon.komoot.io/api/"
          );

          url.searchParams.set("q", searchText);
          url.searchParams.set("limit", "5");
          url.searchParams.set("lat", "8.9806");
          url.searchParams.set("lon", "38.7578");

          const response = await fetch(url.toString(), {
            signal: controller.signal,
          });

          if (!response.ok) continue;

          const data = await response.json();

          const feature = data.features?.find((item) => {
            const coordinates =
              item.geometry?.coordinates;

            const countryCode = String(
              item.properties?.countrycode || ""
            ).toUpperCase();

            return (
              coordinates?.length >= 2 &&
              Number.isFinite(Number(coordinates[0])) &&
              Number.isFinite(Number(coordinates[1])) &&
              (!countryCode || countryCode === "ET")
            );
          });

          if (!feature) continue;

          // Geocoder: [longitude, latitude].
          // Leaflet: [latitude, longitude].
          setDeliveryPosition([
            Number(feature.geometry.coordinates[1]),
            Number(feature.geometry.coordinates[0]),
          ]);

          setMatchedAddress(
            feature.properties?.name ||
              feature.properties?.label ||
              searchText
          );

          setLocationStatus("success");
          return;
        }

        setLocationStatus("error");
      } catch (error) {
        if (error.name !== "AbortError") {
          setLocationStatus("error");
        }
      }
    }

    // Run the search.
    findDeliveryLocation();

    // Cancel the old search if the address changes
    // or this component unmounts.
    return () => controller.abort();
  }, [address]);

  return (
    <section className="space-y-3">
      <div className="h-80 overflow-hidden rounded-2xl border border-[#E8DDD8]">
        <MapContainer
          center={COURIER}
          zoom={13}
          scrollWheelZoom={false}
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <Marker
            position={COURIER}
            icon={courierIcon}
          >
            <Tooltip permanent direction="top" offset={[0, -22]}>
             Addis Eats
            </Tooltip>

            <Popup>
              <strong>Addis Eats Courier</strong>
              <br />
              Demo location only; not live GPS.
            </Popup>
          </Marker>

          {deliveryPosition && (
            <>
              <Marker
                position={deliveryPosition}
                icon={deliveryIcon}
              >
                <Tooltip permanent direction="top" offset={[0, -22]}>
                  Your Delivery
                </Tooltip>

                <Popup>
                  <strong>Your delivery destination</strong>
                  <br />
                  {matchedAddress}
                </Popup>
              </Marker>

              <FitMapToMarkers
                deliveryPosition={deliveryPosition}
              />
            </>
          )}
        </MapContainer>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-[#444]">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          Addis Eats Courier (demo)
        </span>

        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-800" />
          Delivery destination
        </span>
      </div>

      <p role="status" className="text-sm text-[#666]">
        {locationStatus === "loading" &&
          "Finding your delivery address on the map..."}

        {locationStatus === "success" &&
          `Map location found: ${matchedAddress}. Check that it matches your address.`}

        {locationStatus === "error" &&
          "We couldn't find that address. Try adding a nearby landmark or area in Addis Ababa."}

        {locationStatus === "missing" &&
          "This order doesn't contain a delivery address."}
      </p>

      <p className="text-xs text-[#666]">
        Location lookup uses Photon and OpenStreetMap data.
        A matching place may be approximate rather than the
        exact building.
      </p>
    </section>
  );
}