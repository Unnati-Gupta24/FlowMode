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

interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  isWork: boolean;
  sessions: number;
}

const PomodoroPage: React.FC = () => {
  const { settings, addHabitLog, kitten, updateKitten, resetKitten } =
    useStore();
  const [timerState, setTimerState] = useState<TimerState>({
    timeLeft: settings.workDuration * 60,
    isRunning: false,
    isWork: true,
    sessions: 0,
  });
  const [quote, setQuote] = useState(motivationalQuotes[0]);
  const [showKittenWarning, setShowKittenWarning] = useState<boolean>(false);

  const getRandomQuote = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setQuote(motivationalQuotes[randomIndex]);
  }, []);

  useEffect(() => {
    getRandomQuote();
  }, [timerState.sessions, getRandomQuote]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timerState.isRunning && timerState.timeLeft > 0) {
      interval = setInterval(() => {
        setTimerState((prev) => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (timerState.timeLeft === 0) {
      if (timerState.isWork) {
        setTimerState((prev) => ({ ...prev, sessions: prev.sessions + 1 }));
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

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    timerState.isRunning,
    timerState.timeLeft,
    settings,
    kitten.health,
    kitten.focusStreak,
    updateKitten,
    addHabitLog,
  ]);

  const handleSessionComplete = (): void => {
    const nextState = { ...timerState, isRunning: false };

    if (timerState.isWork) {
      if (timerState.sessions + 1 >= settings.sessionsBeforeLongBreak) {
        nextState.timeLeft = settings.longBreakDuration * 60;
        nextState.sessions = 0;
      } else {
        nextState.timeLeft = settings.breakDuration * 60;
      }
      nextState.isWork = false;
    } else {
      nextState.timeLeft = settings.workDuration * 60;
      nextState.isWork = true;
    }

    setTimerState(nextState);
    getRandomQuote();
  };

  const handleQuit = (): void => {
    if (timerState.isWork && timerState.isRunning) {
      setShowKittenWarning(true);
      return;
    }
    resetTimer();
  };

  const confirmQuit = (): void => {
    updateKitten({
      health: Math.max(0, kitten.health - 25),
      focusStreak: 0,
      isAlive: kitten.health > 25,
    });
    setShowKittenWarning(false);
    resetTimer();
  };

  const resetTimer = (): void => {
    setTimerState({
      timeLeft: settings.workDuration * 60,
      isRunning: false,
      isWork: true,
      sessions: 0,
    });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (!kitten.isAlive) {
    return (
      <div className="max-w-xl w-full mx-auto text-center p-4">
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto+Mono:wght@400;500&display=swap');
            .orbitron { font-family: 'Orbitron', sans-serif; }
            .roboto-mono { font-family: 'Roboto Mono', monospace; }
          `}
        </style>
        <div className="bg-[var(--color-cyber-dark)]/70 border border-[var(--color-cyber-blue)] shadow-lg p-8 rounded-2xl">
          <h1 className="text-4xl font-bold text-[var(--color-cyber-pink)] orbitron mb-8">
            Oh no! Your kitten didn't make it! 😢
          </h1>
          <p className="text-[var(--color-cyber-blue)] roboto-mono mb-8">
            Your lack of focus was too much for the little one to handle...
          </p>
          <button
            onClick={() => resetKitten("Whiskers")}
            className="cyber-button flex items-center mx-auto"
          >
            Adopt a New Kitten
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl w-full mx-auto text-center p-4">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto+Mono:wght@400;500&display=swap');
          .orbitron { font-family: 'Orbitron', sans-serif; }
          .roboto-mono { font-family: 'Roboto Mono', monospace; }
        `}
      </style>
      <div className="bg-[var(--color-cyber-dark)]/70 border border-[var(--color-cyber-blue)] shadow-lg p-8 rounded-2xl mb-8">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1615789591457-74a63395c990?w=200&h=200&fit=crop"
              alt="Kitten"
              className="w-32 h-32 rounded-full object-cover border-4 border-[var(--color-cyber-blue)]"
            />
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[var(--color-cyber-darker)] px-3 py-1 rounded-full shadow-sm border border-[var(--color-cyber-pink)]">
              <div className="flex items-center space-x-1">
                <Heart
                  className="w-4 h-4 text-[var(--color-cyber-pink)]"
                  fill="currentColor"
                />
                <span className="text-sm font-medium text-[var(--color-cyber-blue)] roboto-mono">
                  {kitten.health}%
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-sm text-[var(--color-cyber-blue)] roboto-mono mb-6">
          <p className="font-medium orbitron">{kitten.name}</p>
          <p>Focus Streak: {kitten.focusStreak} sessions</p>
        </div>
        <h1 className="text-4xl font-bold text-white orbitron mb-8">
          {timerState.isWork ? "Focus Time" : "Break Time"}
        </h1>
        <div className="text-7xl font-bold text-[var(--color-cyber-pink)] roboto-mono mb-8">
          {formatTime(timerState.timeLeft)}
        </div>
        <div className="mb-8 px-8">
          <blockquote className="italic text-[var(--color-cyber-purple)] roboto-mono">
            "{quote.text}"
            <footer className="text-sm mt-2">- {quote.author}</footer>
          </blockquote>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() =>
              setTimerState((prev) => ({ ...prev, isRunning: !prev.isRunning }))
            }
            className="cyber-button flex items-center"
          >
            {timerState.isRunning ? (
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
            className="cyber-button flex items-center"
          >
            <RotateCcw className="h-5 w-5 mr-2" /> Give Up
          </button>
        </div>
      </div>
      <div className="bg-[var(--color-cyber-dark)]/70 border border-[var(--color-cyber-blue)] shadow-lg p-4 rounded-lg">
        <div className="flex items-center justify-between text-sm text-[var(--color-cyber-blue)] roboto-mono">
          <span>Sessions completed: {timerState.sessions}</span>
          <button className="flex items-center text-[var(--color-cyber-pink)] hover:text-[var(--color-cyber-pink)]/80 orbitron">
            <Settings className="h-4 w-4 mr-1" /> Settings
          </button>
        </div>
      </div>

      {showKittenWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-30">
          <div className="bg-[var(--color-cyber-dark)]/70 border border-[var(--color-cyber-blue)] rounded-lg p-6 max-w-md">
            <div className="flex items-center mb-4 text-[var(--color-cyber-pink)] orbitron">
              <AlertOctagon className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-medium">Warning!</h3>
            </div>
            <p className="text-[var(--color-cyber-blue)] roboto-mono mb-6">
              If you give up now, {kitten.name} will lose 25% health! Are you
              sure you want to abandon your focus session?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowKittenWarning(false)}
                className="px-4 py-2 text-[var(--color-cyber-blue)] hover:text-[var(--color-cyber-purple)] roboto-mono"
              >
                Keep Going
              </button>
              <button onClick={confirmQuit} className="cyber-button">
                Give Up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PomodoroPage;
