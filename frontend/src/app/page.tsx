"use client";

import { useState } from "react";
import { Activity, Info, X, User } from "lucide-react";
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
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);

  const toggleService = (service: string) => {
    setActiveServices(prev => 
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const handleExport = async () => {
    try {
      // Changed from http://127.0.0.1:8000/api/... to /api/... for Docker networking proxy
      const res = await fetch(`/api/v1/demand/heatmap?city=${city}`);
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
    <div className="min-h-screen bg-[#020b14] relative overflow-hidden font-sans text-slate-200">
      
      {/* HEADER (Transparent, Floating) */}
      <header className="absolute top-0 left-0 right-0 z-50 flex justify-between items-start p-6 pointer-events-none">
        
        {/* Left: Branding */}
        <div className="flex items-center gap-4 bg-[#020b14]/80 backdrop-blur-md py-3 px-5 rounded-2xl border border-teal-500/20 pointer-events-auto shadow-lg shrink-0">
          <Activity className="text-teal-400 w-6 h-6" />
          <div className="flex flex-col">
            <span className="text-[9px] font-bold tracking-[0.25em] text-slate-400 uppercase">
              Infocreon Internship
            </span>
            <h1 className="text-sm font-bold text-white tracking-wide">
              Home Healthcare Platform
            </h1>
          </div>
        </div>

        {/* Center: Live Diagnostics (Shifted Left) */}
        <div className="hidden xl:flex flex-1 justify-start ml-8 pointer-events-auto">
          <KPIStrip city={city} />
        </div>

        {/* Right: Metadata Button & Popup */}
        <div className="relative pointer-events-auto shrink-0">
          <button 
            onClick={() => setShowMetadata(!showMetadata)}
            className="p-3 bg-[#020b14]/80 backdrop-blur-md rounded-full border border-teal-500/20 hover:bg-teal-500/20 transition-colors focus:outline-none"
          >
            <Info className="w-5 h-5 text-teal-400" />
          </button>
          
          {showMetadata && (
            <div className="absolute top-full right-0 mt-4 w-[380px] bg-[#061220] border border-slate-800 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-4 overflow-hidden">
              <div className="p-5 border-b border-slate-800 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0a1b2e] flex items-center justify-center border border-slate-700">
                    <User className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white leading-tight">Developer Signature</h2>
                    <p className="text-xs text-slate-400">Verified project author details</p>
                  </div>
                </div>
                <button onClick={() => setShowMetadata(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-5 flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-slate-800/50 pb-3">
                  <span className="text-[11px] tracking-[0.15em] text-slate-400 uppercase">Architect</span>
                  <span className="text-sm text-white font-medium uppercase">MARIAM BYJU</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800/50 pb-3">
                  <span className="text-[11px] tracking-[0.15em] text-slate-400 uppercase">Batch</span>
                  <span className="text-sm text-white">Batch 5 Interns</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800/50 pb-3">
                  <span className="text-[11px] tracking-[0.15em] text-slate-400 uppercase">POC ID</span>
                  <span className="text-sm text-white font-medium">06</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800/50 pb-3">
                  <span className="text-[11px] tracking-[0.15em] text-slate-400 uppercase">GitHub</span>
                  <span className="text-sm text-white">expertcoder69</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800/50 pb-3">
                  <span className="text-[11px] tracking-[0.15em] text-slate-400 uppercase">Stack</span>
                  <span className="text-sm text-white text-right">Next.js, FastAPI, Tailwind CSS</span>
                </div>
              </div>

              <div className="bg-[#040d17] p-4 text-center border-t border-slate-800">
                <span className="text-[11px] text-slate-500">© 2026 Infocreon Internship</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* FLOATING LEGEND (Node Taxonomy) */}
      <div className="absolute bottom-8 left-6 z-40 bg-[#020b14]/80 backdrop-blur-md border border-teal-500/20 rounded-xl p-5 shadow-2xl pointer-events-auto">
        <h3 className="text-[10px] font-bold text-teal-500 uppercase tracking-widest mb-4">Node Taxonomy</h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#ef4444] shadow-[0_0_8px_#ef4444]"></div>
            <span className="text-xs text-slate-300"><strong>Critical Demand</strong> (High Urgency)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]"></div>
            <span className="text-xs text-slate-300"><strong>Standard Demand</strong> (Routine Care)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full border border-[#2dd4bf] bg-[#0f766e] shadow-[0_0_8px_#2dd4bf]"></div>
            <span className="text-xs text-slate-300"><strong>Active Caregiver</strong> (Supply Node)</span>
          </div>
        </div>
      </div>

      {/* 100% FULL SCREEN MAP STAGE */}
      <main className="absolute inset-0 z-0">
        <MapWrapper 
          city={city} 
          activeServices={activeServices} 
          onNodeSelect={() => setIsPanelOpen(true)} 
        />
      </main>

      {/* SLIDE-OVER INTELLIGENCE PANEL */}
      <aside className={`absolute top-0 right-0 h-full w-full max-w-[450px] bg-[#020b14]/95 backdrop-blur-2xl border-l border-teal-500/20 shadow-2xl z-40 transform transition-transform duration-500 ease-in-out flex flex-col ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="p-6 border-b border-teal-500/20 flex justify-between items-center bg-[#020b14]">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div>
            Intelligence Panel
          </h2>
          <button onClick={() => setIsPanelOpen(false)} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 custom-scrollbar">

          <div className="space-y-3">
             <h3 className="text-xs font-bold text-teal-500 uppercase tracking-wider">Predictive Analytics</h3>
             <AnalyticsCharts city={city} />
          </div>

          <div className="space-y-3 pb-8">
            <h3 className="text-xs font-bold text-teal-500 uppercase tracking-wider">Control Parameters</h3>
            <div className="bg-slate-900/40 border border-teal-500/20 rounded-xl p-5 flex flex-col gap-5">
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-slate-400 font-mono tracking-widest">SELECT REGION</label>
                <select 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-[#020b14] border border-teal-500/30 text-white text-sm rounded-lg p-2.5 outline-none focus:border-teal-400 transition-colors"
                >
                  <option value="Abu_Dhabi">Abu Dhabi</option>
                  <option value="Dubai">Dubai</option>
                  <option value="Riyadh">Riyadh</option>
                  <option value="Jeddah">Jeddah</option>
                </select>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-slate-400 font-mono tracking-widest">SERVICE TIER ROUTING</label>
                <div className="flex flex-col gap-3 text-sm text-slate-300 mt-1">
                  {["Post-Op Care", "Elderly Assistance", "Chronic Disease Mgmt", "Medication Admin"].map(svc => (
                    <label key={svc} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={activeServices.includes(svc)}
                        onChange={() => toggleService(svc)}
                        className="w-4 h-4 rounded border-teal-500/30 text-teal-400 focus:ring-teal-400/50 bg-[#020b14] transition-all"
                      /> 
                      <span className="group-hover:text-teal-300 transition-colors">{svc}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleExport}
                className="mt-2 w-full bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 hover:border-teal-400 transition-all py-3 rounded-lg text-xs font-bold tracking-widest"
              >
                EXPORT RAW DATA
              </button>
            </div>
          </div>

        </div>
      </aside>
    </div>
  );
}