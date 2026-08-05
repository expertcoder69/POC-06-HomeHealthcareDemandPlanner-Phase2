"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from "recharts";

const trendData = [
  { time: "08:00", volume: 45 }, { time: "10:00", volume: 80 }, { time: "12:00", volume: 120 },
  { time: "14:00", volume: 150 }, { time: "16:00", volume: 110 }, { time: "18:00", volume: 60 },
];

export default function AnalyticsCharts({ city }: { city: string }) {
  const [waitData, setWaitData] = useState<any[]>([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/v1/analytics/wait-times?city=${city}`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((d: any) => ({
          zone: d.zone,
          avgWait: Math.round(d.wait_times.reduce((a: number, b: number) => a + b, 0) / d.wait_times.length),
        }));
        setWaitData(formatted);
      })
      .catch((err) => console.error("Error fetching wait times:", err));
  }, [city]); // <-- Re-fetch when city changes

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex-1 bg-gray-900/60 rounded-xl border border-gray-800 p-4 flex flex-col shadow-lg">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Visit Volume Trend (Today)</h3>
        <div className="flex-1 min-h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="time" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', fontSize: '12px' }} itemStyle={{ color: '#22d3ee' }} />
              <Area type="monotone" dataKey="volume" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="flex-1 bg-gray-900/60 rounded-xl border border-gray-800 p-4 flex flex-col shadow-lg">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Avg Wait Time by Zone (mins)</h3>
        <div className="flex-1 min-h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={waitData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
              <XAxis type="number" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis dataKey="zone" type="category" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: '#1f2937' }} contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', fontSize: '12px' }} />
              <Bar dataKey="avgWait" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}