export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  userId: string;
}

export interface PomodoroSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
}

export interface HabitLog {
  date: string;
  focusMinutes: number;
  completedSessions: number;
  userId: string;
}

export interface KittenState {
  name: string;
  health: number;
  isAlive: boolean;
  focusStreak: number;
}

export interface Quote {
  text: string;
  author: string;
}

export interface User {
  id: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}
