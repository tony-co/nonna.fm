import { useEffect, useState } from "react";

const listeners = new Map<Element, (isVisible: boolean) => void>();
let observer: IntersectionObserver | undefined;

export function useIsVisible(ref: React.RefObject<HTMLElement | null>): boolean {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }
    observer ??= new IntersectionObserver(entries => {
      for (const entry of entries) listeners.get(entry.target)?.(entry.isIntersecting);
    });
    listeners.set(element, setIsVisible);
    observer.observe(element);
    return () => {
      observer?.unobserve(element);
      listeners.delete(element);
      if (listeners.size === 0) {
        observer?.disconnect();
        observer = undefined;
      }
    };
  }, [ref]);
  return isVisible;
}
