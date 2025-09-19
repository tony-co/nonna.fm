import type { FC, SVGProps } from "react";

/**
 * LikedSongsIcon renders a heart SVG used for Liked Songs artwork and UI elements.
 * Accepts all standard SVG props for flexibility.
 */
export const LikedSongsIcon: FC<SVGProps<SVGSVGElement>> = ({ className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M12.001 4.529c2.349-2.532 6.15-2.532 8.498 0 2.349 2.532 2.349 6.64 0 9.172l-7.071 7.627a1.25 1.25 0 01-1.854 0l-7.071-7.627c-2.349-2.532-2.349-6.64 0-9.172 2.348-2.532 6.149-2.532 8.498 0z"
      clipRule="evenodd"
    />
  </svg>
);
