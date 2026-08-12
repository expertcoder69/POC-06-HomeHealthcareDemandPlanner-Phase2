"use client";

import dynamic from "next/dynamic";

const DemandMap = dynamic(() => import("./DemandMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-[#020b14] text-teal-400 font-mono text-sm animate-pulse">
      INITIALIZING GEOSPATIAL ENGINE...
    </div>
  ),
});

export default function MapWrapper({ city, activeServices, onNodeSelect }: { city: string, activeServices: string[], onNodeSelect: () => void }) {
  return <DemandMap city={city} activeServices={activeServices} onNodeSelect={onNodeSelect} />;
}