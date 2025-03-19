import React, { useState, useEffect, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Timer, User, Lock, Power, Shield, ChevronRight } from "lucide-react";
import { useStore } from "../store/store";
import CyberpunkLayout from "../components/CyberpunkLayout";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signIn, signUp } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [glitchText, setGlitchText] = useState(false);

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchText(true);
      setTimeout(() => setGlitchText(false), 200);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Authentication failed. Try again."
      );
    }
  };

  return (
    <CyberpunkLayout>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto+Mono:wght@400;500&display=swap');
          .orbitron { font-family: 'Orbitron', sans-serif; }
          .roboto-mono { font-family: 'Roboto Mono', monospace; }
        `}
      </style>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-[#0a0a1f] border-2 border-[#4f9ecf] flex items-center justify-center mx-auto">
              <Timer className="h-12 w-12 text-[#ff2a6d]" />
            </div>

            <h2
              className={`mt-6 text-4xl font-bold orbitron ${
                glitchText ? "text-[#ff2a6d]" : "text-white"
              }`}
            >
              {isSignUp ? "INITIALIZE SYSTEM" : "SYSTEM ACCESS"}
            </h2>

            <p className="mt-2 text-sm text-[#4f9ecf] roboto-mono">
              {isSignUp
                ? "Creating new security credentials"
                : "Enter security credentials to proceed"}
            </p>
          </div>

          <div className="mt-8">
            <div className="bg-[#0a0a2f]/70 border border-[#4f9ecf] shadow-lg shadow-[#4f9ecf]/20 backdrop-blur-sm p-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#4f9ecf] roboto-mono"
                  >
                    IDENTITY CODE
                  </label>
                  <div className="mt-1 relative">
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4f9ecf]"
                      size={16}
                    />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-4 py-3 bg-[#12122A] text-white border border-[#4f9ecf] focus:ring-2 focus:ring-[#ff2a6d] outline-none roboto-mono placeholder-gray-500"
                      placeholder="Enter your identity code"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#4f9ecf] roboto-mono"
                  >
                    ACCESS KEY
                  </label>
                  <div className="mt-1 relative">
                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4f9ecf]"
                      size={16}
                    />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-4 py-3 bg-[#12122A] text-white border border-[#4f9ecf] focus:ring-2 focus:ring-[#ff2a6d] outline-none roboto-mono placeholder-gray-500"
                      placeholder="Enter your access key"
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-[#ff2a6d] text-sm flex items-center gap-2 roboto-mono">
                    <Shield className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#12122A] border border-[#4f9ecf] py-3 text-white font-medium orbitron flex items-center justify-center gap-2 hover:bg-gradient-to-r hover:from-[#4f9ecf] hover:to-[#ff2a6d]"
                >
                  <Power className="h-4 w-4" />
                  {isSignUp ? "INITIALIZE" : "ACCESS SYSTEM"}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </form>

              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="mt-6 w-full text-center text-sm text-[#4f9ecf] roboto-mono hover:text-[#ff2a6d] hover:text-shadow-[0_0_8px_rgba(255,42,109,0.6)]"
              >
                {isSignUp
                  ? ">> RETURN TO ACCESS PORTAL"
                  : ">> REQUEST NEW IDENTITY"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </CyberpunkLayout>
  );
}
