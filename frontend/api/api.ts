import { Menu } from "@/types/menu";

export const fetchMenu = async (): Promise<Menu[]> => {
    const response = await fetch("http://localhost:8080/menus");
    if (!response.ok) {
      throw new Error("メニューの取得に失敗しました");
    }
    return response.json();
  };