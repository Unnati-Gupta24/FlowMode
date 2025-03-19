import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Timer, BookOpen, BarChart2, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "../store/store";

export default function Layout() {
  const location = useLocation();
  const { signOut } = useStore();

  const navItems = [
    { path: "/", icon: Timer, label: "Pomodoro" },
    { path: "/notes", icon: BookOpen, label: "Notes" },
    { path: "/habits", icon: BarChart2, label: "Habits" },
  ];

  return (
    <div className="min-h-screen bg-cyber-darkest text-white">
      <div className="scanline" />
      <nav className="bg-cyber-dark border-b-2 border-cyber-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Timer className="h-8 w-8 text-cyber-pink" />
              <span className="cyber-text text-xl">MINDSHARE</span>
            </Link>

            <div className="flex items-center space-x-8">
              {navItems.map(({ path, icon: Icon, label }) => (
                <Link key={path} to={path} className="relative group">
                  <div className="flex items-center space-x-2 px-3 py-2">
                    <Icon
                      className={`h-5 w-5 ${
                        location.pathname === path
                          ? "text-cyber-pink"
                          : "text-cyber-blue"
                      }`}
                    />
                    <span
                      className={`${
                        location.pathname === path
                          ? "text-cyber-pink"
                          : "text-cyber-blue"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {location.pathname === path && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyber-pink"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              ))}
              <button
                onClick={() => signOut()}
                className="cyber-button flex items-center space-x-2"
              >
                <LogOut className="h-5 w-5" />
                <span>Exit</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="cyber-grid max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
