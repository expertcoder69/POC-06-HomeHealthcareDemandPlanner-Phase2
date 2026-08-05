"use client";

import { useState } from "react";
import { Activity } from "lucide-react";
import MapWrapper from "@/components/map/MapWrapper";
import KPIStrip from "@/components/dashboard/KPIStrip";
import AnalyticsCharts from "@/components/charts/AnalyticsCharts";

export default function Dashboard() {
  const [city, setCity] = useState("Abu_Dhabi");
  const [activeServices, setActiveServices] = useState<string[]>([
    "Post-Op Care", 
    "Elderly Assistance", 
    "Chronic Disease Mgmt", 
    "Medication Admin"
  ]);

  const toggleService = (service: string) => {
    setActiveServices(prev => 
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const handleExport = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/demand/heatmap?city=${city}`);
      const data = await res.json();
      
      const csvContent = "data:text/csv;charset=utf-8," 
        + "ID,Latitude,Longitude,Urgency,Service,WaitTime\n"
        + data.map((row: any) => 
            `${row.id},${row.location.lat},${row.location.lng},${row.urgency},${row.service_type},${row.wait_time_mins}`
          ).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `demand_export_${city}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 gap-4">
      <header className="flex justify-between items-center bg-gray-900/50 p-4 rounded-xl border border-gray-800 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-3">
          <Activity className="text-cyan-400 w-6 h-6" />
          <h1 className="text-xl font-bold tracking-tight text-white">
            Home Healthcare <span className="text-cyan-400">Demand Planner</span>
          </h1>
        </div>
        <div className="text-sm text-gray-400 font-mono">
          STATUS: <span className="text-emerald-400 animate-pulse">LIVE</span> | GULF REGION
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row gap-4 h-[calc(100vh-100px)]">
        <section className="flex-[7] flex flex-col gap-4 min-h-[600px] lg:min-h-0">
          <KPIStrip city={city} />
          <div className="flex-1 flex flex-col xl:flex-row gap-4 min-h-0">
            <div className="flex-[6] bg-gray-900/20 rounded-xl border border-gray-800 relative shadow-lg overflow-hidden min-h-[300px]">
              <MapWrapper city={city} activeServices={activeServices} />
            </div>
            <div className="flex-[4] min-w-[300px]">
              <AnalyticsCharts city={city} />
            </div>
          </div>
        </section>

        <aside className="flex-[3] flex flex-col gap-4 min-h-[600px] lg:min-h-0">
          <div className="flex-1 bg-gray-900/40 rounded-xl border border-gray-800 p-6 flex flex-col gap-6 shadow-lg overflow-y-auto">
            
            <div>
              <h2 className="text-sm font-bold text-cyan-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400"></div> Why This Matters
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                As Gulf populations age, home care demand is surging. This dashboard makes the supply-demand gap visible, turning abstract wait times into actionable geospatial data for capacity planners.
              </p>
            </div>

            <div>
              <h2 className="text-sm font-bold text-cyan-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400"></div> Control Panel
              </h2>
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 flex flex-col gap-4">
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-gray-400 font-mono">SELECT CITY</label>
                  <select 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)}
                    className="bg-gray-950 border border-gray-700 text-white text-sm rounded p-2 outline-none focus:border-cyan-400 transition-colors"
                  >
                    <option value="Abu_Dhabi">Abu Dhabi</option>
                    <option value="Dubai">Dubai</option>
                    <option value="Riyadh">Riyadh</option>
                    <option value="Jeddah">Jeddah</option>
                  </select>
                </div>
                
                <div className="flex flex-col gap-2 mt-2">
                  <label className="text-xs text-gray-400 font-mono">SERVICE TIER FILTER</label>
                  <div className="flex flex-col gap-2 text-sm text-gray-300">
                    {["Post-Op Care", "Elderly Assistance", "Chronic Disease Mgmt", "Medication Admin"].map(svc => (
                      <label key={svc} className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={activeServices.includes(svc)}
                          onChange={() => toggleService(svc)}
                          className="accent-cyan-400"
                        /> 
                        {svc}
                      </label>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleExport}
                  className="mt-4 w-full bg-gray-800 hover:bg-gray-700 text-cyan-400 border border-gray-700 hover:border-cyan-400 transition-colors py-2 rounded text-sm font-bold tracking-wider"
                >
                  EXPORT DATA
                </button>
              </div>
            </div>

          </div>
        </aside>
      </main>
    </div>
  );
}