import { type FC, useEffect, useState } from "react";

interface CircularProgressProps {
  progress: number; // 0 to 100
  size?: number;
  onComplete?: () => void;
}

export const CircularProgress: FC<CircularProgressProps> = ({
  progress,
  size = 24,
  onComplete,
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const normalizedProgress = Math.min(Math.max(progress, 0), 100) / 100;
  const offset = circumference - normalizedProgress * circumference;

  useEffect(() => {
    let successTimer: NodeJS.Timeout;

    if (progress >= 100) {
      // Show success state immediately when progress is complete
      setShowSuccess(true);
      setIsVisible(true);

      // Keep success state visible for 1 second
      successTimer = setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
        setIsVisible(false);
      }, 1000);
    } else {
      setShowSuccess(false);
      setIsVisible(true);
    }

    return () => {
      if (successTimer) clearTimeout(successTimer);
    };
  }, [progress, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
      data-progress={Math.round(progress)}
    >
      <div className="rounded-full bg-black/30 p-1">
        <svg
          width={size}
          height={size}
          className="rotate-[-90deg] transform"
          role="img"
          aria-label={`Progress ${Math.round(progress)}%`}
        >
          <title>Progress {Math.round(progress)}%</title>
          <circle
            className="text-zinc-600/30"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className={`transition-all duration-300 ease-in-out ${
              showSuccess ? "text-emerald-500" : "text-white"
            }`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
      </div>
    </div>
  );
};
