import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateTime = (
  dateString: string,
  format: string = "YYYY/MM/DD HH:mm:ss"
): string => {
  const date = new Date(dateString);

  // JSTに変換
  const jstOffset = 9 * 60; // 日本時間のオフセット（分）
  const localTime = date.getTime();
  const jstTime = new Date(localTime + jstOffset * 60 * 1000);

  // フォーマット用の各部分
  const year = jstTime.getUTCFullYear();
  const month = String(jstTime.getUTCMonth() + 1).padStart(2, "0");
  const day = String(jstTime.getUTCDate()).padStart(2, "0");
  const hours = String(jstTime.getUTCHours()).padStart(2, "0");
  const minutes = String(jstTime.getUTCMinutes()).padStart(2, "0");
  const seconds = String(jstTime.getUTCSeconds()).padStart(2, "0");

  // フォーマットに応じて日時を作成
  return format
    .replace("YYYY", year.toString())
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
};

// 今日の日付を取得するユーティリティ関数
export const getTodayDate = () => {
  const today = new Date();
  return `${today.getFullYear()}年${
    today.getMonth() + 1
  }月${today.getDate()}日`;
};

export const getInitialSelectedMonth = (): string =>
  new Date().toISOString().slice(0, 7);
export const getInitialSelectedDate = (): string =>
  format(new Date(), "yyyy年MM月dd日");
