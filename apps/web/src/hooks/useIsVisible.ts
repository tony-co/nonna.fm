import { useEffect, useState } from "react";

/**
 * A hook that uses the Intersection Observer API to detect when an element becomes visible in the viewport.
 * This is particularly useful for implementing lazy loading of images and other content.
 *
 * @param ref - A React ref object pointing to the element to observe
 * @returns boolean - Whether the element is currently visible in the viewport
 */
export const useIsVisible = (ref: React.RefObject<HTMLElement | null>): boolean => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isIntersecting;
};
