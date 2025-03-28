import React, { useRef, useEffect } from "react";
import type { JSX } from "react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  closeOnBackdropClick?: boolean;
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
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-md dark:bg-black/60"
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={dialogRef}
        className="dark:bg-[var(--color-indigo-990)]/80 animate-in fade-in mx-4 mt-[10vh] flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl duration-200 dark:border-indigo-950"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus:ring-indigo-400"
            aria-label="Close dialog"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-6 text-gray-700 dark:text-gray-200">{children}</div>
      </div>
    </div>
  );
}
