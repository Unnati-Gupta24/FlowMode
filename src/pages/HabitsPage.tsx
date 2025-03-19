import React from "react";
import { BarChart, Clock, CheckCircle } from "lucide-react";
import { useStore } from "../store/store";
import CyberpunkLayout from "../components/CyberpunkLayout";

const HabitsPage: React.FC = () => {
  const { habitLogs } = useStore();

  const today = new Date().toISOString().split("T")[0];
  const todayStats = habitLogs.find((log) => log.date === today) || {
    focusMinutes: 0,
    completedSessions: 0,
  };

  const last7Days = [...Array(7)]
    .map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const log = habitLogs.find((l) => l.date === dateStr);
      return {
        date: dateStr,
        focusMinutes: log?.focusMinutes || 0,
        completedSessions: log?.completedSessions || 0,
      };
    })
    .reverse();

  return (
    <div className="relative min-h-screen">
      <CyberpunkLayout className="absolute inset-0 z-0" />
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto+Mono:wght@400;500&display=swap');
            .orbitron { font-family: 'Orbitron', sans-serif; }
            .roboto-mono { font-family: 'Roboto Mono', monospace; }
          `}
        </style>
        <div className="w-full max-w-4xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0a0a2f]/70 border border-[#4f9ecf] shadow-lg p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-[#4f9ecf] orbitron">
                  Today's Focus Time
                </h3>
                <Clock className="h-6 w-6 text-[#ff2a6d]" />
              </div>
              <p className="mt-2 text-3xl font-bold text-[#ff2a6d] roboto-mono">
                {todayStats.focusMinutes} mins
              </p>
            </div>
            {/* Repeat similar styling for other cards */}
          </div>
          <div className="bg-[#0a0a2f]/70 border border-[#4f9ecf] shadow-lg p-6 rounded-lg">
            <h3 className="text-lg font-medium text-[#4f9ecf] orbitron mb-4">
              Last 7 Days
            </h3>
            <div className="h-64 flex items-end justify-between">
              {last7Days.map((day) => (
                <div
                  key={day.date}
                  className="flex flex-col items-center w-1/7"
                >
                  <div
                    className="w-full bg-[#ff2a6d]/50 rounded-t"
                    style={{
                      height: `${(day.focusMinutes / 120) * 100}%`,
                      minHeight: "4px",
                    }}
                  />
                  <p className="mt-2 text-sm text-[#4f9ecf] roboto-mono">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitsPage;
