import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CyberpunkLayout from "./components/CyberpunkLayout";
import AuthGuard from "./components/AuthGuard";
import PomodoroPage from "./pages/PomorodoPage";
import NotesPage from "./pages/NotesPage";
import HabitsPage from "./pages/HabitsPage";
import AuthPage from "./pages/AuthPage";
import { useStore } from "./store/store";
import { supabase } from "./lib/supabase";

function App() {
  const { setUser, setLoading } = useStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email! });
      }
      setLoading(false);
    });

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

    return () => subscription.unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/"
          element={
            <AuthGuard>
              <CyberpunkLayout />
            </AuthGuard>
          }
        >
          <Route index element={<PomodoroPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="habits" element={<HabitsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
