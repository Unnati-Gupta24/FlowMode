import React from "react";
import { BarChart, Clock, CheckCircle } from "lucide-react";
import { useStore } from "../store/store";

export default function HabitsPage() {
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Today's Focus Time
            </h3>
            <Clock className="h-6 w-6 text-indigo-600" />
          </div>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {todayStats.focusMinutes} mins
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Sessions Completed
            </h3>
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {todayStats.completedSessions}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Weekly Average
            </h3>
            <BarChart className="h-6 w-6 text-blue-600" />
          </div>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {Math.round(
              last7Days.reduce((acc, day) => acc + day.focusMinutes, 0) / 7
            )}{" "}
            mins
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Last 7 Days</h3>
        <div className="h-64">
          <div className="h-full flex items-end justify-between">
            {last7Days.map((day) => (
              <div key={day.date} className="flex flex-col items-center w-1/7">
                <div
                  className="w-full bg-indigo-200 rounded-t"
                  style={{
                    height: `${(day.focusMinutes / 120) * 100}%`,
                    minHeight: "4px",
                  }}
                />
                <p className="mt-2 text-sm text-gray-600">
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
  );
}
