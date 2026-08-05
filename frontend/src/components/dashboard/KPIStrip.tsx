"use client";

import { useEffect, useState } from "react";
import { Users, Activity, Clock, HeartPulse } from "lucide-react";

export default function KPIStrip({ city }: { city: string }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/v1/analytics/kpis?city=${city}`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Error fetching KPIs:", err));
  }, [city]); // <-- Re-fetch when city changes

  if (!data) return <div className="h-24 flex items-center justify-center text-cyan-400 animate-pulse font-mono">LOADING KPIs...</div>;

  return (
    <div className="grid grid-cols-4 gap-4 h-24">
      <div className="bg-gray-900/60 rounded-xl border border-gray-800 p-4 flex flex-col justify-between shadow-lg">
        <div className="flex justify-between items-center text-gray-400">
          <span className="text-xs font-bold uppercase tracking-wider">Active Requests</span>
          <Activity className="w-4 h-4 text-amber-500" />
        </div>
        <div className="text-2xl font-bold text-white">{data.total_requests}</div>
      </div>
      <div className="bg-gray-900/60 rounded-xl border border-gray-800 p-4 flex flex-col justify-between shadow-lg">
        <div className="flex justify-between items-center text-gray-400">
          <span className="text-xs font-bold uppercase tracking-wider">Caregivers Deployed</span>
          <Users className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="text-2xl font-bold text-white">{data.active_caregivers}</div>
      </div>
      <div className="bg-gray-900/60 rounded-xl border border-gray-800 p-4 flex flex-col justify-between shadow-lg">
        <div className="flex justify-between items-center text-gray-400">
          <span className="text-xs font-bold uppercase tracking-wider">Staffing Ratio</span>
          <HeartPulse className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-bold text-white">{data.caregiver_ratio} <span className="text-sm text-gray-500 font-normal">pts/staff</span></div>
      </div>
      <div className="bg-gray-900/60 rounded-xl border border-gray-800 p-4 flex flex-col justify-between shadow-lg">
        <div className="flex justify-between items-center text-gray-400">
          <span className="text-xs font-bold uppercase tracking-wider">Avg Wait Time</span>
          <Clock className="w-4 h-4 text-red-400" />
        </div>
        <div className="text-2xl font-bold text-white">{data.average_wait_time} <span className="text-sm text-gray-500 font-normal">mins</span></div>
      </div>
    </div>
  );
}