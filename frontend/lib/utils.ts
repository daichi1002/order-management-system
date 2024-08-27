import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toJSTDate(date: Date) {
  // UTC日時を日本時間に変換する
  const jstOffset = 9 * 60; // JSTはUTC+9時間
  const dateObj = new Date(date);
  const jstDate = new Date(dateObj.getTime() + jstOffset * 60 * 1000);
  return jstDate.toISOString(); // ISO 8601形式で出力
}