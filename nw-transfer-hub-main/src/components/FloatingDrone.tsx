import { useEffect, useState } from "react";

interface FloatingDroneProps {
  position: { top?: string; left?: string; bottom?: string; right?: string };
  delay?: number;
  size?: "small" | "medium" | "large";
  variant?: "quad" | "racing" | "mini";
  sidebarCollapsed?: boolean;
}

export const FloatingDrone = ({ position, delay = 0, size = "medium", variant = "quad", sidebarCollapsed = false }: FloatingDroneProps) => {
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const droneId = `drone-${variant}-${size}-${delay}`;
  
  const sizeMap = {
    small: { width: 80, height: 70, scale: 0.7 },
    medium: { width: 120, height: 100, scale: 1 },
    large: { width: 160, height: 140, scale: 1.3 }
  };
  
  const dimensions = sizeMap[size];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const drone = document.getElementById(droneId);
      if (!drone) return;

      const rect = drone.getBoundingClientRect();
      const droneCenterX = rect.left + rect.width / 2;
      const droneCenterY = rect.top + rect.height / 2;

      const angle = Math.atan2(e.clientY - droneCenterY, e.clientX - droneCenterX);
      const distance = Math.min(3, Math.sqrt(Math.pow(e.clientX - droneCenterX, 2) + Math.pow(e.clientY - droneCenterY, 2)) / 100);

      setEyePosition({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [droneId]);

  const renderQuadDrone = () => (
    <svg width={dimensions.width} height={dimensions.height} viewBox="0 0 120 100" className="animate-[float_6s_ease-in-out_infinite]">
        {/* Propeller arms */}
        <line x1="30" y1="40" x2="10" y2="30" stroke="#9ca3af" strokeWidth="3" strokeLinecap="round" />
        <line x1="90" y1="40" x2="110" y2="30" stroke="#9ca3af" strokeWidth="3" strokeLinecap="round" />
        <line x1="30" y1="60" x2="10" y2="70" stroke="#9ca3af" strokeWidth="3" strokeLinecap="round" />
        <line x1="90" y1="60" x2="110" y2="70" stroke="#9ca3af" strokeWidth="3" strokeLinecap="round" />

        {/* Propellers with spinning animation */}
        <g className="animate-spin origin-[10px_30px]" style={{ animationDuration: "2s" }}>
          <ellipse cx="10" cy="30" rx="8" ry="3" fill="#9ca3af" opacity="0.6" />
          <ellipse cx="10" cy="30" rx="3" ry="8" fill="#9ca3af" opacity="0.6" />
        </g>
        <g className="animate-spin origin-[110px_30px]" style={{ animationDuration: "2.2s" }}>
          <ellipse cx="110" cy="30" rx="8" ry="3" fill="#9ca3af" opacity="0.6" />
          <ellipse cx="110" cy="30" rx="3" ry="8" fill="#9ca3af" opacity="0.6" />
        </g>
        <g className="animate-spin origin-[10px_70px]" style={{ animationDuration: "1.9s" }}>
          <ellipse cx="10" cy="70" rx="8" ry="3" fill="#9ca3af" opacity="0.6" />
          <ellipse cx="10" cy="70" rx="3" ry="8" fill="#9ca3af" opacity="0.6" />
        </g>
        <g className="animate-spin origin-[110px_70px]" style={{ animationDuration: "2.1s" }}>
          <ellipse cx="110" cy="70" rx="8" ry="3" fill="#9ca3af" opacity="0.6" />
          <ellipse cx="110" cy="70" rx="3" ry="8" fill="#9ca3af" opacity="0.6" />
        </g>

        {/* Main body */}
        <rect x="35" y="35" width="50" height="30" rx="8" fill="#d1d5db" />
        
        {/* Landing gear */}
        <line x1="45" y1="65" x2="45" y2="75" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
        <line x1="75" y1="65" x2="75" y2="75" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
        <circle cx="45" cy="76" r="2" fill="#9ca3af" />
        <circle cx="75" cy="76" r="2" fill="#9ca3af" />

        {/* Camera/sensor */}
        <circle cx="60" cy="65" r="4" fill="#9ca3af" opacity="0.8" />
        <circle cx="60" cy="65" r="2" fill="#6b7280" />

        {/* Cute eyes */}
        <g>
          {/* Left eye */}
          <ellipse cx="50" cy="48" rx="6" ry="7" fill="white" />
          <circle 
            cx={50 + eyePosition.x} 
            cy={48 + eyePosition.y} 
            r="3" 
            fill="#374151" 
          />
          <circle 
            cx={50 + eyePosition.x + 1} 
            cy={48 + eyePosition.y - 1} 
            r="1.5" 
            fill="white" 
          />

          {/* Right eye */}
          <ellipse cx="70" cy="48" rx="6" ry="7" fill="white" />
          <circle 
            cx={70 + eyePosition.x} 
            cy={48 + eyePosition.y} 
            r="3" 
            fill="#374151" 
          />
          <circle 
            cx={70 + eyePosition.x + 1} 
            cy={48 + eyePosition.y - 1} 
            r="1.5" 
            fill="white" 
          />
        </g>

        {/* Smile */}
        <path
          d="M 52 54 Q 60 58 68 54"
          stroke="#9ca3af"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
  );

  const renderRacingDrone = () => (
    <svg width={dimensions.width} height={dimensions.height} viewBox="0 0 120 100" className="animate-[float_6s_ease-in-out_infinite]">
      {/* Slim racing arms */}
      <line x1="60" y1="45" x2="20" y2="25" stroke="#9ca3af" strokeWidth="4" strokeLinecap="round" />
      <line x1="60" y1="45" x2="100" y2="25" stroke="#9ca3af" strokeWidth="4" strokeLinecap="round" />
      <line x1="60" y1="55" x2="20" y2="75" stroke="#9ca3af" strokeWidth="4" strokeLinecap="round" />
      <line x1="60" y1="55" x2="100" y2="75" stroke="#9ca3af" strokeWidth="4" strokeLinecap="round" />

      {/* Racing propellers */}
      <g className="animate-spin origin-[20px_25px]" style={{ animationDuration: "1.5s" }}>
        <ellipse cx="20" cy="25" rx="10" ry="3" fill="#9ca3af" opacity="0.7" />
        <ellipse cx="20" cy="25" rx="3" ry="10" fill="#9ca3af" opacity="0.7" />
      </g>
      <g className="animate-spin origin-[100px_25px]" style={{ animationDuration: "1.6s" }}>
        <ellipse cx="100" cy="25" rx="10" ry="3" fill="#9ca3af" opacity="0.7" />
        <ellipse cx="100" cy="25" rx="3" ry="10" fill="#9ca3af" opacity="0.7" />
      </g>
      <g className="animate-spin origin-[20px_75px]" style={{ animationDuration: "1.4s" }}>
        <ellipse cx="20" cy="75" rx="10" ry="3" fill="#9ca3af" opacity="0.7" />
        <ellipse cx="20" cy="75" rx="3" ry="10" fill="#9ca3af" opacity="0.7" />
      </g>
      <g className="animate-spin origin-[100px_75px]" style={{ animationDuration: "1.55s" }}>
        <ellipse cx="100" cy="75" rx="10" ry="3" fill="#9ca3af" opacity="0.7" />
        <ellipse cx="100" cy="75" rx="3" ry="10" fill="#9ca3af" opacity="0.7" />
      </g>

      {/* Aerodynamic racing body */}
      <ellipse cx="60" cy="50" rx="25" ry="15" fill="#d1d5db" />
      <rect x="50" y="40" width="20" height="20" rx="3" fill="#b9bdc4" />
      
      {/* Camera mount */}
      <circle cx="60" cy="62" r="5" fill="#9ca3af" opacity="0.8" />
      <circle cx="60" cy="62" r="3" fill="#6b7280" />

      {/* Aggressive eyes */}
      <g>
        <ellipse cx="53" cy="48" rx="5" ry="6" fill="white" transform="rotate(-10 53 48)" />
        <circle cx={53 + eyePosition.x * 0.8} cy={48 + eyePosition.y * 0.8} r="2.5" fill="#374151" />
        <circle cx={53 + eyePosition.x * 0.8 + 0.8} cy={48 + eyePosition.y * 0.8 - 0.8} r="1" fill="white" />

        <ellipse cx="67" cy="48" rx="5" ry="6" fill="white" transform="rotate(10 67 48)" />
        <circle cx={67 + eyePosition.x * 0.8} cy={48 + eyePosition.y * 0.8} r="2.5" fill="#374151" />
        <circle cx={67 + eyePosition.x * 0.8 + 0.8} cy={48 + eyePosition.y * 0.8 - 0.8} r="1" fill="white" />
      </g>

      {/* Antenna */}
      <line x1="60" y1="35" x2="60" y2="25" stroke="#9ca3af" strokeWidth="2" />
      <circle cx="60" cy="23" r="2" fill="#d1d5db" />
    </svg>
  );

  const renderMiniDrone = () => (
    <svg width={dimensions.width} height={dimensions.height} viewBox="0 0 120 100" className="animate-[float_6s_ease-in-out_infinite]">
      {/* Compact arms */}
      <line x1="45" y1="45" x2="25" y2="35" stroke="#9ca3af" strokeWidth="3" />
      <line x1="75" y1="45" x2="95" y2="35" stroke="#9ca3af" strokeWidth="3" />
      <line x1="45" y1="55" x2="25" y2="65" stroke="#9ca3af" strokeWidth="3" />
      <line x1="75" y1="55" x2="95" y2="65" stroke="#9ca3af" strokeWidth="3" />

      {/* Small propellers */}
      <g className="animate-spin origin-[25px_35px]" style={{ animationDuration: "1.8s" }}>
        <ellipse cx="25" cy="35" rx="7" ry="2.5" fill="#9ca3af" opacity="0.6" />
        <ellipse cx="25" cy="35" rx="2.5" ry="7" fill="#9ca3af" opacity="0.6" />
      </g>
      <g className="animate-spin origin-[95px_35px]" style={{ animationDuration: "1.9s" }}>
        <ellipse cx="95" cy="35" rx="7" ry="2.5" fill="#9ca3af" opacity="0.6" />
        <ellipse cx="95" cy="35" rx="2.5" ry="7" fill="#9ca3af" opacity="0.6" />
      </g>
      <g className="animate-spin origin-[25px_65px]" style={{ animationDuration: "1.7s" }}>
        <ellipse cx="25" cy="65" rx="7" ry="2.5" fill="#9ca3af" opacity="0.6" />
        <ellipse cx="25" cy="65" rx="2.5" ry="7" fill="#9ca3af" opacity="0.6" />
      </g>
      <g className="animate-spin origin-[95px_65px]" style={{ animationDuration: "1.85s" }}>
        <ellipse cx="95" cy="65" rx="7" ry="2.5" fill="#9ca3af" opacity="0.6" />
        <ellipse cx="95" cy="65" rx="2.5" ry="7" fill="#9ca3af" opacity="0.6" />
      </g>

      {/* Round compact body */}
      <circle cx="60" cy="50" r="18" fill="#d1d5db" />
      <circle cx="60" cy="50" r="12" fill="#b9bdc4" />

      {/* Tiny camera */}
      <circle cx="60" cy="62" r="3" fill="#9ca3af" opacity="0.8" />
      <circle cx="60" cy="62" r="1.5" fill="#6b7280" />

      {/* Cute big eyes */}
      <g>
        <ellipse cx="54" cy="48" rx="5" ry="6" fill="white" />
        <circle cx={54 + eyePosition.x} cy={48 + eyePosition.y} r="2.5" fill="#374151" />
        <circle cx={54 + eyePosition.x + 1} cy={48 + eyePosition.y - 1} r="1.2" fill="white" />

        <ellipse cx="66" cy="48" rx="5" ry="6" fill="white" />
        <circle cx={66 + eyePosition.x} cy={48 + eyePosition.y} r="2.5" fill="#374151" />
        <circle cx={66 + eyePosition.x + 1} cy={48 + eyePosition.y - 1} r="1.2" fill="white" />
      </g>

      {/* Happy smile */}
      <path d="M 52 54 Q 60 57 68 54" stroke="#9ca3af" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );

  const droneVariants = {
    quad: renderQuadDrone,
    racing: renderRacingDrone,
    mini: renderMiniDrone,
  };

  // Ajustar posição baseado no estado do sidebar
  const getAdjustedPosition = () => {
    const adjustedPos: React.CSSProperties = {
      animationDelay: `${delay}s`,
    };

    // Se tem posição bottom e left, ajustar left baseado no sidebar
    if (position.bottom) {
      adjustedPos.bottom = position.bottom;
    }
    if (position.top) {
      adjustedPos.top = position.top;
    }
    if (position.left) {
      // Ajustar left quando sidebar colapsa/expande
      const leftValue = parseInt(position.left);
      const sidebarWidth = sidebarCollapsed ? 56 : 240; // w-14 = 56px, w-60 = 240px
      adjustedPos.left = `${leftValue + sidebarWidth}px`;
      adjustedPos.transition = "left 0.3s ease-in-out";
    }
    if (position.right) {
      adjustedPos.right = position.right;
    }

    return adjustedPos;
  };

  return (
    <div
      id={droneId}
      className="fixed pointer-events-none opacity-30 hover:opacity-50 transition-opacity"
      style={{
        ...getAdjustedPosition(),
        zIndex: 0,
      }}
    >
      {droneVariants[variant]()}
    </div>
  );
};
