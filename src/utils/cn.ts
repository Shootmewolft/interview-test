import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines and merges CSS class names using clsx and tailwind-merge.
 *
 * This utility function takes multiple class value inputs, combines them using clsx,
 * and then merges conflicting Tailwind CSS classes using twMerge to ensure
 * proper class precedence and avoid duplicate utility classes.
 *
 * @param inputs - Variable number of class values that can be strings, objects, arrays, or conditional classes
 * @returns A string of merged and deduplicated CSS class names
 *
 * @example
 * cn('px-2 py-1', 'px-4') // Returns: 'py-1 px-4'
 * cn('text-red-500', { 'text-blue-500': true }) // Returns: 'text-blue-500'
 * cn(['bg-white', 'text-black'], 'bg-gray-100') // Returns: 'text-black bg-gray-100'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
