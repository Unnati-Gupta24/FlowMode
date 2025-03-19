import React, { useState, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Timer, User, Lock, Power, Shield, ChevronRight } from "lucide-react";
import { useStore } from "../store/store";
import CyberpunkLayout from "../components/CyberpunkLayout";

interface CyberpunkLayoutProps {
  className?: string;
}

const CyberpunkBackground: React.FC<CyberpunkLayoutProps> = CyberpunkLayout;

const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { signIn, signUp } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    (location.state as { from?: { pathname: string } } | undefined)?.from
      ?.pathname || "/";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
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
    <div className="relative min-h-screen">
      <CyberpunkBackground className="absolute inset-0 z-0" />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto+Mono:wght@400;500&display=swap');
            .orbitron { font-family: 'Orbitron', sans-serif; }
            .roboto-mono { font-family: 'Roboto Mono', monospace; }
          `}
        </style>
        <div className="w-full max-w-md p-4">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-[var(--color-cyber-darkest)] border-2 border-[var(--color-cyber-blue)] flex items-center justify-center mx-auto">
              <Timer className="h-12 w-12 text-[var(--color-cyber-pink)]" />
            </div>
            <h2 className="mt-6 text-4xl font-bold orbitron text-white">
              {isSignUp ? "INITIALIZE SYSTEM" : "SYSTEM ACCESS"}
            </h2>
            <p className="mt-2 text-sm text-[var(--color-cyber-blue)] roboto-mono">
              {isSignUp
                ? "Creating new security credentials"
                : "Enter security credentials to proceed"}
            </p>
          </div>
          <div className="mt-8">
            <div className="bg-[var(--color-cyber-dark)]/70 border border-[var(--color-cyber-blue)] shadow-lg shadow-[var(--color-cyber-blue)]/20 backdrop-blur-sm p-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[var(--color-cyber-blue)] roboto-mono"
                  >
                    IDENTITY CODE
                  </label>
                  <div className="mt-1 relative">
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-cyber-blue)]"
                      size={16}
                    />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                      }
                      className="cyber-input pl-10 w-full"
                      placeholder="Enter your identity code"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[var(--color-cyber-blue)] roboto-mono"
                  >
                    ACCESS KEY
                  </label>
                  <div className="mt-1 relative">
                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-cyber-blue)]"
                      size={16}
                    />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPassword(e.target.value)
                      }
                      className="cyber-input pl-10 w-full"
                      placeholder="Enter your access key"
                    />
                  </div>
                </div>
                {error && (
                  <div className="text-[var(--color-cyber-pink)] text-sm flex items-center gap-2 roboto-mono">
                    <Shield className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}
                <button
                  type="submit"
                  className="cyber-button w-full flex items-center justify-center gap-2"
                >
                  <Power className="h-4 w-4" />
                  {isSignUp ? "INITIALIZE" : "ACCESS SYSTEM"}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </form>
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="mt-6 w-full text-center text-sm text-[var(--color-cyber-blue)] roboto-mono hover:text-[var(--color-cyber-pink)]"
                style={{ textShadow: "0 0 8px rgba(255, 42, 109, 0.6)" }} // Replaced invalid Tailwind hover:text-shadow
              >
                {isSignUp
                  ? ">> RETURN TO ACCESS PORTAL"
                  : ">> REQUEST NEW IDENTITY"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
