import { clsx, type ClassValue } from "clsx"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { twMerge } from "tailwind-merge"

dayjs.extend(relativeTime)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 *
 * @returns -
 */
export function since(date: Parameters<typeof dayjs>[0]) {
  return dayjs(date).fromNow()
}

export function generateRandomNumber() {
  return Math.floor(Math.random() * 999999) + 1
}
