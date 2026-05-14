"use client";

import { useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import SyllabusSidebar from "@/app/components/SyllabusSidebar";

export default function SyllabusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar — slides in/out */}
      <div
        className={`transition-all duration-300 ease-in-out flex-shrink-0 overflow-hidden ${
          sidebarOpen ? "w-72" : "w-0"
        }`}
      >
        <SyllabusSidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Toggle button */}
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="mb-4 p-2 rounded-md hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeftOpen className="h-5 w-5" />
            )}
          </button>

          {children}
        </div>
      </main>
    </div>
  );
}
