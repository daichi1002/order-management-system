"use client"

import { useGetMenusQuery } from "@/lib/graphql/graphql";

export const useMenu =() => {
  const { data, loading, error } = useGetMenusQuery();
  return { menu: data?.getMenus || [], loading, error };
}