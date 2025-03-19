import React, { useState, useEffect, useRef, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Timer, User, Lock, Power, Shield, ChevronRight } from "lucide-react";
import { useStore } from "../store/store";

const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { signIn, signUp } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    (location.state as { from?: { pathname: string } } | undefined)?.from
      ?.pathname || "/";

  // Clock Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    let rotation = 0;
    const clockRadius = Math.min(canvas.width, canvas.height) * 0.4;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);

      // Outer circle with neon glow
      ctx.beginPath();
      ctx.arc(0, 0, clockRadius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(79, 158, 207, 0.8)";
      ctx.lineWidth = 4;
      ctx.shadowBlur = 20;
      ctx.shadowColor = "rgba(79, 158, 207, 0.6)";
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Grid lines
      const gridCount = 12;
      ctx.strokeStyle = "rgba(255, 42, 109, 0.3)";
      ctx.lineWidth = 1;

      for (let i = 0; i < gridCount; i++) {
        const angle = (i / gridCount) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(
          Math.cos(angle) * clockRadius * 1.2,
          Math.sin(angle) * clockRadius * 1.2
        );
        ctx.stroke();
      }

      ctx.rotate(rotation);

      // Inner circle with purple glow
      ctx.beginPath();
      ctx.arc(0, 0, clockRadius * 0.8, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(124, 77, 255, 0.8)";
      ctx.lineWidth = 3;
      ctx.shadowBlur = 15;
      ctx.shadowColor = "rgba(124, 77, 255, 0.5)";
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Ticking markers
      for (let i = 0; i < 60; i++) {
        const angle = (i / 60) * Math.PI * 2;
        const length = i % 5 === 0 ? 20 : 8;

        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(clockRadius * 0.85, 0);
        ctx.lineTo(clockRadius * 0.85 - length, 0);
        ctx.strokeStyle =
          i % 5 === 0 ? "rgba(255, 42, 109, 1)" : "rgba(79, 158, 207, 0.6)";
        ctx.lineWidth = i % 5 === 0 ? 4 : 2;
        ctx.stroke();
        ctx.restore();
      }

      // Clock hands
      const date = new Date();
      const hours = date.getHours() % 12;
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();

      ctx.save();
      ctx.rotate((hours * Math.PI) / 6 + (minutes * Math.PI) / (6 * 60));
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(clockRadius * 0.5, 0);
      ctx.strokeStyle = "rgba(255, 42, 109, 1)";
      ctx.lineWidth = 5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(255, 42, 109, 0.8)";
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.rotate((minutes * Math.PI) / 30);
      ctx.beginPath();
      ctx.moveTo(-15, 0);
      ctx.lineTo(clockRadius * 0.7, 0);
      ctx.strokeStyle = "rgba(79, 158, 207, 1)";
      ctx.lineWidth = 4;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(79, 158, 207, 0.8)";
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.rotate((seconds * Math.PI) / 30);
      ctx.beginPath();
      ctx.moveTo(-20, 0);
      ctx.lineTo(clockRadius * 0.8, 0);
      ctx.strokeStyle = "rgba(124, 77, 255, 1)";
      ctx.lineWidth = 3;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(124, 77, 255, 0.8)";
      ctx.stroke();
      ctx.restore();

      // Center dot
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 42, 109, 1)";
      ctx.shadowBlur = 15;
      ctx.shadowColor = "rgba(255, 42, 109, 0.8)";
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      ctx.restore();

      rotation += 0.002;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

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
    <div className="relative min-h-screen bg-[#0a0a1f] overflow-hidden">
      {/* Clock Animation Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      />
      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-10 scanline"></div>
      {/* Noise Texture */}
      <div
        className="fixed inset-0 pointer-events-none z-10 opacity-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          backgroundSize: "150px",
        }}
      ></div>

      {/* Login Form */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto+Mono:wght@400;500&display=swap');
            .orbitron { font-family: 'Orbitron', sans-serif; }
            .roboto-mono { font-family: 'Roboto Mono', monospace; }
            .glitch {
              animation: glitch 1s linear infinite;
            }
            @keyframes glitch {
              2%, 64% { transform: translate(2px, 0) skew(0deg); }
              4%, 60% { transform: translate(-2px, 0) skew(0deg); }
              62% { transform: translate(0, 0) skew(5deg); }
            }
            .neon-glow {
              text-shadow: 0 0 5px var(--color-cyber-blue), 0 0 10px var(--color-cyber-pink), 0 0 15px var(--color-cyber-purple);
            }
          `}
        </style>
        <div className="w-full max-w-md p-6 bg-[var(--color-cyber-dark)]/80 border-2 border-[var(--color-cyber-blue)] rounded-none shadow-[0_0_20px_rgba(79,158,207,0.5)] backdrop-blur-md">
          <div className="text-center mb-8">
            <div className="w-28 h-28 rounded-full bg-[var(--color-cyber-darkest)] border-4 border-[var(--color-cyber-pink)] flex items-center justify-center mx-auto animate-[pulse_2s_infinite]">
              <Timer className="h-14 w-14 text-[var(--color-cyber-pink)]" />
            </div>
            <h2 className="mt-6 text-5xl font-bold orbitron text-white glitch neon-glow">
              {isSignUp ? "INITIALIZE" : "ACCESS"}
            </h2>
            <p className="mt-3 text-md text-[var(--color-cyber-blue)] roboto-mono italic">
              {isSignUp ? "Forge new credentials" : "Unlock the system core"}
            </p>
          </div>
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-md font-medium text-[var(--color-cyber-blue)] roboto-mono neon-glow"
              >
                IDENTITY CODE
              </label>
              <div className="mt-2 relative">
                <User
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--color-cyber-blue)]"
                  size={20}
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
                  className="cyber-input pl-12 w-full text-lg roboto-mono bg-[var(--color-cyber-darker)] border-[var(--color-cyber-purple)] hover:shadow-[0_0_15px_rgba(124,77,255,0.5)] transition-all duration-300"
                  placeholder="Enter your code"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-md font-medium text-[var(--color-cyber-blue)] roboto-mono neon-glow"
              >
                ACCESS KEY
              </label>
              <div className="mt-2 relative">
                <Lock
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--color-cyber-blue)]"
                  size={20}
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
                  className="cyber-input pl-12 w-full text-lg roboto-mono bg-[var(--color-cyber-darker)] border-[var(--color-cyber-purple)] hover:shadow-[0_0_15px_rgba(124,77,255,0.5)] transition-all duration-300"
                  placeholder="Enter your key"
                />
              </div>
            </div>
            {error && (
              <div className="text-[var(--color-cyber-pink)] text-md flex items-center gap-3 roboto-mono animate-[shake_0.5s_ease-in-out]">
                <Shield className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}
            <button
              type="submit"
              className="cyber-button w-full flex items-center justify-center gap-3 text-lg orbitron py-3 bg-gradient-to-r from-[var(--color-cyber-blue)] to-[var(--color-cyber-pink)] hover:from-[var(--color-cyber-pink)] hover:to-[var(--color-cyber-purple)] transition-all duration-500 shadow-[0_0_20px_rgba(255,42,109,0.7)]"
            >
              <Power className="h-5 w-5" />
              {isSignUp ? "DEPLOY" : "INFILTRATE"}
              <ChevronRight className="h-5 w-5" />
            </button>
          </form>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="mt-8 w-full text-center text-md text-[var(--color-cyber-blue)] roboto-mono hover:text-[var(--color-cyber-pink)] hover:shadow-[0_0_10px_rgba(255,42,109,0.5)] transition-all duration-300"
          >
            {isSignUp ? ">> ACCESS EXISTING CORE" : ">> CREATE NEW CORE"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
