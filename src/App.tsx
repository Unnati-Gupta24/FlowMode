import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthGuard from "./components/AuthGuard"; 
import PomodoroPage from "./pages/PomorodoPage";
import NotesPage from "./pages/NotesPage";
import HabitsPage from "./pages/HabitsPage";
import AuthPage from "./pages/AuthPage";
import { useStore } from "./store/store";
import { supabase } from "./lib/supabase";

interface User {
  id: string;
  email: string;
}

const App: React.FC = () => {
  const { setUser, setLoading } = useStore();

  useEffect(() => {
    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email! });
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email! });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, [setUser, setLoading]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<AuthGuard />}>
          <Route index path="/" element={<PomodoroPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="habits" element={<HabitsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
