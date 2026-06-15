"use client";

export function HexGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="hex-pattern"
            width="56"
            height="100"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(1)"
          >
            {/* Hexagon shape drawn with polygon paths */}
            <path
              d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <path
              d="M28 0L56 16L56 50L28 66L0 50L0 16Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </pattern>

          {/* Animated scanline overlay */}
          <linearGradient id="scanline-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="45%" stopColor="rgba(0, 255, 178, 0.06)" />
            <stop offset="50%" stopColor="rgba(0, 255, 178, 0.12)" />
            <stop offset="55%" stopColor="rgba(0, 255, 178, 0.06)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Hex grid */}
        <rect width="100%" height="100%" fill="url(#hex-pattern)" className="text-exile-accent" />

        {/* Animated scanline sweep */}
        <rect
          width="100%"
          height="200%"
          fill="url(#scanline-grad)"
          className="animate-scanline"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            from="0 -100%"
            to="0 100%"
            dur="8s"
            repeatCount="indefinite"
          />
        </rect>
      </svg>

      {/* Subtle horizontal scanlines */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 178, 0.1) 2px, rgba(0, 255, 178, 0.1) 4px)",
        }}
      />
    </div>
  );
}
