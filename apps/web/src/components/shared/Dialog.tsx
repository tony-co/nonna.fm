import { useTranslations } from "next-intl";
import type React from "react";
import type { JSX } from "react";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  closeOnBackdropClick?: boolean;
  // maxWidthClass prop removed as sizing is now handled directly in the className for Tailwind v4
}

/**
 * A reusable modal dialog component with light/dark theme support using Tailwind's indigo color scheme
 *
 * @param isOpen - Controls whether the dialog is visible
 * @param onClose - Function to call when the dialog should close
 * @param title - The title displayed in the dialog header
 * @param children - Content to render inside the dialog
 * @param closeOnBackdropClick - Whether clicking outside the dialog should close it (defaults to true)
 */
export default function Dialog({
  isOpen,
  onClose,
  title,
  children,
  closeOnBackdropClick = true,
}: DialogProps): JSX.Element | null {
  const dialogRef = useRef<HTMLDivElement>(null);
  const tAccessibility = useTranslations("Accessibility");

  // Handle clicking outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (
        closeOnBackdropClick &&
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    // Handle escape key press to close
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        onClose();
      }
    }

    // Only add the event listeners if the dialog is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, closeOnBackdropClick]);

  // Prevent scrolling when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      // Use a very light black overlay (10% opacity) with minimal blur for a subtle, modern effect in both light and dark mode
      className="fixed inset-0 isolate z-[9999] flex items-center justify-center bg-black/10 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={dialogRef}
        // Dialog box: fullscreen on mobile, modal on sm+
        // Use flex-col so header stays fixed and content scrolls if needed
        // Increased dark mode background opacity from 80% to 95% for better readability
        className="dark:bg-[var(--color-indigo-990)]/95 lg:dark:bg-[var(--color-indigo-990)]/95 mx-0 flex h-full max-h-none w-full max-w-none flex-col rounded-none border-none bg-white p-0 shadow-none lg:mx-4 lg:h-auto lg:max-h-[85vh] lg:max-w-2xl lg:rounded-xl lg:border lg:border-gray-200 lg:bg-white lg:p-0 lg:shadow"
      >
        {/* Dialog header: matches Header height and close button on mobile */}
        <div className="flex h-14 items-center justify-between border-b border-gray-100 px-4 py-0 lg:h-16 lg:px-6 dark:border-gray-800">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            // On mobile: match menu button (rounded-full, p-2, size-6). On desktop: original style.
            className="rounded-full p-0 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 lg:rounded-lg lg:p-1 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus:ring-indigo-400"
            aria-label={tAccessibility("closeDialog")}
          >
            <X className="size-6 lg:h-5 lg:w-5" />
          </button>
        </div>
        {/*
          Content area is now flex-1 and scrollable, with max height minus header (64px).
          This ensures content never overflows the modal and scrolls if too tall.
        */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 text-gray-700 lg:max-h-[calc(85vh-64px)] dark:text-gray-200">
          {children}
        </div>
      </div>
    </div>
  );
}
