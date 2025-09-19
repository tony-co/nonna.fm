import type { FC, SVGProps } from "react";
import { Heart } from "lucide-react";

/**
 * LikedSongsIcon renders a heart icon used for Liked Songs artwork and UI elements.
 * Accepts all standard SVG props for flexibility.
 */
export const LikedSongsIcon: FC<SVGProps<SVGSVGElement>> = ({ className = "", ...props }) => (
  <Heart className={className} fill="currentColor" aria-hidden="true" {...props} />
);
