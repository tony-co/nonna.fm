import Image from "next/image";

type ArtworkType = "liked" | "album" | "playlist";

interface ArtworkImageProps {
  src?: string | null;
  alt: string;
  size: number;
  type?: ArtworkType;
  className?: string;
  objectFit?: "cover" | "contain";
}

const FALLBACK_CONFIGS = {
  liked: {
    bgColor: "bg-red-100 dark:bg-red-900/30",
    iconColor: "text-red-500",
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  album: {
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-500",
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm4 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" />
      </svg>
    ),
  },
  playlist: {
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    iconColor: "text-indigo-500",
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 4a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1zm0 4a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1zm1 3a1 1 0 100 2h14a1 1 0 100-2H3z" />
      </svg>
    ),
  },
};

export const ArtworkImage: React.FC<ArtworkImageProps> = ({
  src,
  alt,
  size,
  type = "playlist",
  className = "",
  objectFit = "cover",
}) => {
  const baseClassName =
    "relative overflow-hidden rounded-md shadow-sm transition-transform duration-200 group-hover:scale-105";
  const finalClassName = `${baseClassName} ${className}`;

  if (!src) {
    const fallback = FALLBACK_CONFIGS[type];
    return (
      <div
        style={{ width: size, height: size }}
        className={`flex items-center justify-center ${fallback.bgColor} ${finalClassName}`}
      >
        <div className={fallback.iconColor}>{fallback.icon}</div>
      </div>
    );
  }

  return (
    <div style={{ width: size, height: size }} className={finalClassName}>
      <Image src={src} alt={alt} fill className={`object-${objectFit}`} sizes={`${size}px`} />
    </div>
  );
};
