"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";

const CITY_COORDS: Record<string, [number, number]> = {
  "Riyadh": [24.7136, 46.6753],
  "Jeddah": [21.5433, 39.1925],
  "Abu_Dhabi": [24.4539, 54.3773],
  "Dubai": [25.2048, 55.2708]
};

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 11, { animate: true });
  }, [center, map]);
  return null;
}

export default function DemandMap({ city, activeServices, onNodeSelect }: { city: string, activeServices: string[], onNodeSelect: () => void }) {
  const [requests, setRequests] = useState<any[]>([]);
  const [caregivers, setCaregivers] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, cgRes] = await Promise.all([
          // Changed from http://127.0.0.1:8000/api/... to /api/... for Docker networking proxy
          fetch(`/api/v1/demand/heatmap?city=${city}`),
          fetch(`/api/v1/caregivers/locations?city=${city}`)
        ]);
        setRequests(await reqRes.json());
        setCaregivers(await cgRes.json());
      } catch (error) {
        console.error("Failed to fetch map data:", error);
      }
    };
    fetchData();
  }, [city]);

  const filteredRequests = useMemo(() => {
    return requests.filter(req => activeServices.includes(req.service_type));
  }, [requests, activeServices]);

  const center = CITY_COORDS[city] || CITY_COORDS["Abu_Dhabi"];

  return (
    <div className="h-full w-full relative">
      <MapContainer center={center} zoom={11} style={{ height: "100%", width: "100%" }} zoomControl={false}>
        <MapUpdater center={center} />
        
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {filteredRequests.map((req) => (
          <CircleMarker
            key={req.id}
            center={[req.location.lat, req.location.lng]}
            radius={req.urgency === "High" ? 6 : 4}
            eventHandlers={{ click: onNodeSelect }}
            pathOptions={{ 
              color: req.urgency === "High" ? "#ef4444" : "#f59e0b",
              fillColor: req.urgency === "High" ? "#ef4444" : "#f59e0b",
              fillOpacity: 0.6, weight: 1
            }}
          >
            <Tooltip className="bg-[#020b14] text-white border-teal-500/30">
              <div className="font-mono text-xs">
                <strong className="text-teal-400">{req.id}</strong><br/>
                Service: {req.service_type}<br/>
                Urgency: {req.urgency}<br/>
                Wait: {req.wait_time_mins} mins
              </div>
            </Tooltip>
          </CircleMarker>
        ))}

        {caregivers.map((cg) => (
          <CircleMarker
            key={cg.id}
            center={[cg.location.lat, cg.location.lng]}
            radius={8}
            eventHandlers={{ click: onNodeSelect }}
            pathOptions={{ color: "#2dd4bf", fillColor: "#0f766e", fillOpacity: 0.8, weight: 2 }}
          >
            <Tooltip className="bg-[#020b14] text-white border-teal-500/30">
              <div className="font-mono text-xs">
                <strong className="text-teal-400">{cg.name}</strong><br/>
                Status: {cg.status}<br/>
                Specialty: {cg.specialty}
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}