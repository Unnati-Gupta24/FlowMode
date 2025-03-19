import React, { useState, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Heart,
  AlertOctagon,
} from "lucide-react";
import { useStore } from "../store/store";
import { motivationalQuotes } from "../data/quotes";

export default function PomodoroPage() {
  const { settings, addHabitLog, kitten, updateKitten, resetKitten } =
    useStore();
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const [sessions, setSessions] = useState(0);
  const [quote, setQuote] = useState(motivationalQuotes[0]);
  const [showKittenWarning, setShowKittenWarning] = useState(false);

  const getRandomQuote = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setQuote(motivationalQuotes[randomIndex]);
  }, []);

  useEffect(() => {
    getRandomQuote();
  }, [sessions]);

  useEffect(() => {
    let interval: number;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (isWork) {
        setSessions((s) => s + 1);
        updateKitten({
          health: Math.min(kitten.health + 10, 100),
          focusStreak: kitten.focusStreak + 1,
        });
        addHabitLog({
          date: new Date().toISOString().split("T")[0],
          focusMinutes: settings.workDuration,
          completedSessions: 1,
        });
      }
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    if (isWork) {
      if (sessions + 1 >= settings.sessionsBeforeLongBreak) {
        setTimeLeft(settings.longBreakDuration * 60);
        setSessions(0);
      } else {
        setTimeLeft(settings.breakDuration * 60);
      }
      setIsWork(false);
    } else {
      setTimeLeft(settings.workDuration * 60);
      setIsWork(true);
    }
    getRandomQuote();
  };

  const handleQuit = () => {
    if (isWork && isRunning) {
      setShowKittenWarning(true);
      return;
    }
    resetTimer();
  };

  const confirmQuit = () => {
    updateKitten({
      health: Math.max(0, kitten.health - 25),
      focusStreak: 0,
      isAlive: kitten.health > 25,
    });
    setShowKittenWarning(false);
    resetTimer();
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(settings.workDuration * 60);
    setIsWork(true);
    setSessions(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (!kitten.isAlive) {
    return (
      <div className="max-w-xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-8">
            Oh no! Your kitten didn't make it! 😢
          </h1>
          <p className="text-gray-600 mb-8">
            Your lack of focus was too much for the little one to handle...
          </p>
          <button
            onClick={() => resetKitten("Whiskers")}
            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 mx-auto"
          >
            Adopt a New Kitten
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto text-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1615789591457-74a63395c990?w=200&h=200&fit=crop"
              alt="Kitten"
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100"
            />
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-sm">
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4 text-red-500" fill="currentColor" />
                <span className="text-sm font-medium">{kitten.health}%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-600 mb-6">
          <p className="font-medium">{kitten.name}</p>
          <p>Focus Streak: {kitten.focusStreak} sessions</p>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          {isWork ? "Focus Time" : "Break Time"}
        </h1>
        <div className="text-7xl font-bold text-indigo-600 mb-8">
          {formatTime(timeLeft)}
        </div>
        <div className="mb-8 px-8">
          <blockquote className="italic text-gray-600">
            "{quote.text}"
            <footer className="text-sm mt-2">- {quote.author}</footer>
          </blockquote>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {isRunning ? (
              <>
                <Pause className="h-5 w-5 mr-2" /> Pause
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" /> Start
              </>
            )}
          </button>
          <button
            onClick={handleQuit}
            className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <RotateCcw className="h-5 w-5 mr-2" /> Give Up
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Sessions completed: {sessions}</span>
          <button className="flex items-center text-indigo-600 hover:text-indigo-700">
            <Settings className="h-4 w-4 mr-1" /> Settings
          </button>
        </div>
      </div>

      {showKittenWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <div className="flex items-center mb-4 text-red-600">
              <AlertOctagon className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-medium">Warning!</h3>
            </div>
            <p className="text-gray-600 mb-6">
              If you give up now, {kitten.name} will lose 25% health! Are you
              sure you want to abandon your focus session?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowKittenWarning(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Keep Going
              </button>
              <button
                onClick={confirmQuit}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Give Up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
