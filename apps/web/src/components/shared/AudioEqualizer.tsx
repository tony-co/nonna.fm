import React from "react";

interface AudioEqualizerProps {
  className?: string;
}

// Create a client-only version of the component
const AudioEqualizerClient = ({ className = "" }: AudioEqualizerProps): React.ReactElement => {
  const totalBars = 32;

  // Define indigo color shades from Tailwind's palette
  const indigoShades = [
    "#312e81", // indigo-900
    "#3730a3", // indigo-800
    "#4338ca", // indigo-700
    "#4f46e5", // indigo-600
    "#6366f1", // indigo-500
    "#818cf8", // indigo-400
    "#a5b4fc", // indigo-300
    "#c7d2fe", // indigo-200
    "#e0e7ff", // indigo-100
  ];

  // Helper function to format numbers consistently
  const formatNumber = (num: number): number => {
    return Number(num.toFixed(4));
  };

  // Generate base animation parameters with smoother transitions
  const baseAnimationParams = Array.from({ length: totalBars }).map((_, i) => {
    const positionFactor = i / totalBars;

    // Create position-based speed variation (faster in middle, slower at edges)
    const positionBasedSpeed = 1.8 - Math.sin(positionFactor * Math.PI) * 0.6;

    // Add slight randomness (±0.2s) to make it more natural
    const randomVariation = Math.sin(i * 0.7) * 0.2;

    // Combine position-based speed with slight randomness
    const duration = formatNumber(positionBasedSpeed + randomVariation);

    // Create smooth wave pattern for delays
    const delay = formatNumber((Math.sin(i * 0.4) + 1) / 2);

    return {
      delay,
      duration,
    };
  });

  // Smooth the animation parameters to create more natural transitions
  const smoothedParams = baseAnimationParams.map((param, i) => {
    // Get neighboring bars' parameters
    const prevParams = i > 0 ? baseAnimationParams[i - 1] : param;
    const nextParams = i < totalBars - 1 ? baseAnimationParams[i + 1] : param;

    // Apply weighted average for smoother transitions
    return {
      delay: formatNumber((prevParams.delay + param.delay * 2 + nextParams.delay) / 4),
      duration: formatNumber((prevParams.duration + param.duration * 2 + nextParams.duration) / 4),
    };
  });

  return (
    <div
      className={`relative mx-auto h-16 w-full max-w-[400px] ${className}`}
      style={{
        contain: "paint layout style",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
    >
      {/* Generate bars using Array.from */}
      {Array.from({ length: totalBars }).map((_, i) => {
        const positionFactor = formatNumber(i / totalBars);

        // Create a smoother intensity curve
        const intensity = formatNumber(
          (Math.sin(positionFactor * Math.PI) * Math.sin(positionFactor * Math.PI * 2) * 0.8 +
            0.2) **
            1.2
        );

        // Use smoothed parameters for animations
        const animParams = smoothedParams[i];

        // Calculate color index based on position
        const colorIndex = Math.floor((i / totalBars) * indigoShades.length);
        const color = indigoShades[colorIndex];

        // Calculate height with smoother variations
        const baseHeight = 12;
        const maxRandomHeight = 24;
        const heightVariation = formatNumber(
          Math.sin(i * 0.3) * maxRandomHeight * 0.5 + maxRandomHeight * 0.5
        );
        const finalHeight = formatNumber(baseHeight + heightVariation);

        const left = `${formatNumber((i / totalBars) * 100)}%`;
        const scaleY = formatNumber(0.2 + intensity * 0.8);

        return (
          <div
            key={`equalizer-bar-${i}`}
            className="absolute bottom-0 w-[10px] transform-gpu opacity-80"
            style={{
              left,
              height: `${finalHeight}px`,
              animation: `equalizer-bar ${animParams.duration}s infinite ease-in-out alternate`,
              animationDelay: `${animParams.delay}s`,
              transformOrigin: "bottom",
              transform: `translateZ(0) scaleY(${scaleY})`,
              willChange: "transform",
            }}
          >
            <div
              className="h-full w-full transform-gpu rounded-xl"
              style={{
                backgroundColor: color,
                boxShadow: `0 0 10px ${color}40`,
                transform: "translateZ(0)",
              }}
            />
          </div>
        );
      })}

      <style jsx>{`
        @keyframes equalizer-bar {
          0%,
          100% {
            transform: translateZ(0) scaleY(0.3);
          }
          50% {
            transform: translateZ(0) scaleY(1);
          }
        }

        /* Performance optimizations */
        [class*="animate-"] {
          will-change: transform;
          backface-visibility: hidden;
          perspective: 1000;
          transform-style: preserve-3d;
        }

        @media (prefers-reduced-motion: reduce) {
          .group,
          .group *,
          [class*="animate-"] {
            animation: none !important;
            transition: none !important;
            transform: none !important;
          }
        }

        /* Add transform-gpu class for hardware acceleration */
        .transform-gpu {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000;
        }
      `}</style>
    </div>
  );
};

// Create a wrapper component that uses dynamic import for client-side only rendering
export function AudioEqualizer(props: AudioEqualizerProps): React.ReactElement {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Return a placeholder with the same dimensions to prevent layout shift
    return <div className={`relative mx-auto h-16 w-full max-w-[400px] ${props.className}`} />;
  }

  return <AudioEqualizerClient {...props} />;
}
