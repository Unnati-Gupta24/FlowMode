import { create } from "zustand";
import { Note, PomodoroSettings, HabitLog, KittenState, User } from "../types";
import { supabase } from "../lib/supabase";

interface Store {
  notes: Note[];
  settings: PomodoroSettings;
  habitLogs: HabitLog[];
  kitten: KittenState;
  user: User | null;
  loading: boolean;
  addNote: (note: Note) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  updateSettings: (settings: Partial<PomodoroSettings>) => void;
  addHabitLog: (log: HabitLog) => void;
  updateKitten: (update: Partial<KittenState>) => void;
  resetKitten: (name: string) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
  notes: [],
  settings: {
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
  },
  habitLogs: [],
  kitten: {
    name: "Whiskers",
    health: 100,
    isAlive: true,
    focusStreak: 0,
  },
  user: null,
  loading: true,
  addNote: async (note) => {
    const { data, error } = await supabase
      .from("notes")
      .insert([{ ...note, user_id: get().user?.id }]);

    if (!error && data) {
      set((state) => ({ notes: [...state.notes, note] }));
    }
  },
  updateNote: async (id, updatedNote) => {
    const { error } = await supabase
      .from("notes")
      .update(updatedNote)
      .eq("id", id)
      .eq("user_id", get().user?.id);

    if (!error) {
      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === id ? { ...note, ...updatedNote } : note
        ),
      }));
    }
  },
  deleteNote: async (id) => {
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id)
      .eq("user_id", get().user?.id);

    if (!error) {
      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
      }));
    }
  },
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),
  addHabitLog: async (log) => {
    const { data, error } = await supabase
      .from("habit_logs")
      .insert([{ ...log, user_id: get().user?.id }]);

    if (!error && data) {
      set((state) => ({
        habitLogs: [...state.habitLogs, log],
      }));
    }
  },
  updateKitten: (update) =>
    set((state) => ({
      kitten: { ...state.kitten, ...update },
    })),
  resetKitten: (name) =>
    set(() => ({
      kitten: {
        name,
        health: 100,
        isAlive: true,
        focusStreak: 0,
      },
    })),
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    if (data.user) {
      set({ user: { id: data.user.id, email: data.user.email! } });
    }
  },
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (data.user) {
      set({ user: { id: data.user.id, email: data.user.email! } });
    }
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null });
  },
}));
