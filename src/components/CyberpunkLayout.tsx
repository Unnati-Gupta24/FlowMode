import React, { useEffect, useRef, ReactNode } from "react";
import { motion } from "framer-motion";

interface CyberpunkLayoutProps {
  children: ReactNode;
}

const CyberpunkLayout: React.FC<CyberpunkLayoutProps> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    // Set canvas dimensions
    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Clock animation
    let rotation = 0;
    const clockRadius = Math.min(canvas.width, canvas.height) * 0.4;

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Translate to center of canvas
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);

      // Draw outer circle
      ctx.beginPath();
      ctx.arc(0, 0, clockRadius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(79, 158, 207, 0.2)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw grid lines
      const gridCount = 12;
      ctx.strokeStyle = "rgba(255, 42, 109, 0.15)";
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

      // Draw rotating elements
      ctx.rotate(rotation);

      // Inner circle
      ctx.beginPath();
      ctx.arc(0, 0, clockRadius * 0.8, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(124, 77, 255, 0.2)";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw ticking markers
      for (let i = 0; i < 60; i++) {
        const angle = (i / 60) * Math.PI * 2;
        const length = i % 5 === 0 ? 15 : 5;

        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(clockRadius * 0.85, 0);
        ctx.lineTo(clockRadius * 0.85 - length, 0);
        ctx.strokeStyle =
          i % 5 === 0 ? "rgba(255, 42, 109, 0.6)" : "rgba(79, 158, 207, 0.4)";
        ctx.lineWidth = i % 5 === 0 ? 3 : 1;
        ctx.stroke();
        ctx.restore();
      }

      // Draw hands
      const date = new Date();
      const hours = date.getHours() % 12;
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();

      // Hour hand
      ctx.save();
      ctx.rotate((hours * Math.PI) / 6 + (minutes * Math.PI) / (6 * 60));
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(clockRadius * 0.5, 0);
      ctx.strokeStyle = "rgba(255, 42, 109, 0.8)";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();

      // Minute hand
      ctx.save();
      ctx.rotate((minutes * Math.PI) / 30);
      ctx.beginPath();
      ctx.moveTo(-15, 0);
      ctx.lineTo(clockRadius * 0.7, 0);
      ctx.strokeStyle = "rgba(79, 158, 207, 0.8)";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();

      // Second hand
      ctx.save();
      ctx.rotate((seconds * Math.PI) / 30);
      ctx.beginPath();
      ctx.moveTo(-20, 0);
      ctx.lineTo(clockRadius * 0.8, 0);
      ctx.strokeStyle = "rgba(124, 77, 255, 0.9)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Center dot
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 42, 109, 0.8)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      ctx.restore();

      // Update rotation
      rotation += 0.002;

      // Request next frame
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a1f] overflow-hidden relative">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      />

      {/* Scanlines */}
      <div className="scanline fixed inset-0 pointer-events-none z-10"></div>

      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-10 opacity-5"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          backgroundSize: "150px",
        }}
      ></div>

      {/* Content container */}
      <div className="relative z-20">{children}</div>
    </div>
  );
};

export default CyberpunkLayout;
