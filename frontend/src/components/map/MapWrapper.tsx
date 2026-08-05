"use client";

import dynamic from "next/dynamic";

const DemandMap = dynamic(() => import("./DemandMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-900/20 text-cyan-400 font-mono text-sm animate-pulse">
      INITIALIZING GEOSPATIAL ENGINE...
    </div>
  ),
});

export default function MapWrapper({ city, activeServices }: { city: string, activeServices: string[] }) {
  return <DemandMap city={city} activeServices={activeServices} />;
}