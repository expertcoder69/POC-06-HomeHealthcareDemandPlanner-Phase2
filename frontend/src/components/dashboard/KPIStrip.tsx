"use client";

import { useEffect, useState } from "react";
import { Users, Activity, Clock, HeartPulse } from "lucide-react";

export default function KPIStrip({ city }: { city: string }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Changed from http://127.0.0.1:8000/api/... to /api/... for Docker networking proxy
    fetch(`/api/v1/analytics/kpis?city=${city}`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Error fetching KPIs:", err));
  }, [city]);

  if (!data) return <div className="h-14 flex items-center justify-center text-teal-400 animate-pulse font-mono text-xs tracking-widest">LOADING TELEMETRY...</div>;

  return (
    <div className="flex gap-3 items-center">
      
      {/* KPI Card 1 */}
      <div className="bg-[#020b14]/80 backdrop-blur-md rounded-xl border border-teal-500/20 py-2.5 px-4 flex items-center gap-4 shadow-lg min-w-[160px]">
        <div className="p-2 bg-teal-500/10 rounded-lg">
          <Activity className="w-5 h-5 text-teal-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold text-white leading-none">{data.total_requests}</span>
          <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase mt-1">Active Requests</span>
        </div>
      </div>
      
      {/* KPI Card 2 */}
      <div className="bg-[#020b14]/80 backdrop-blur-md rounded-xl border border-teal-500/20 py-2.5 px-4 flex items-center gap-4 shadow-lg min-w-[160px]">
        <div className="p-2 bg-teal-500/10 rounded-lg">
          <Users className="w-5 h-5 text-teal-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold text-white leading-none">{data.active_caregivers}</span>
          <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase mt-1">Deployed Staff</span>
        </div>
      </div>

      {/* KPI Card 3 */}
      <div className="bg-[#020b14]/80 backdrop-blur-md rounded-xl border border-teal-500/20 py-2.5 px-4 flex items-center gap-4 shadow-lg min-w-[160px]">
        <div className="p-2 bg-teal-500/10 rounded-lg">
          <HeartPulse className="w-5 h-5 text-teal-400" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-white leading-none">{data.caregiver_ratio}</span>
            <span className="text-[10px] text-teal-400 font-mono">pts/stf</span>
          </div>
          <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase mt-1">Staffing Ratio</span>
        </div>
      </div>

      {/* KPI Card 4 */}
      <div className="bg-[#020b14]/80 backdrop-blur-md rounded-xl border border-teal-500/20 py-2.5 px-4 flex items-center gap-4 shadow-lg min-w-[160px]">
        <div className="p-2 bg-teal-500/10 rounded-lg">
          <Clock className="w-5 h-5 text-teal-400" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-white leading-none">{data.average_wait_time}</span>
            <span className="text-[10px] text-teal-400 font-mono">mins</span>
          </div>
          <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase mt-1">Avg Wait Time</span>
        </div>
      </div>

    </div>
  );
}