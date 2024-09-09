"use client";

import { useGetMonthlySalesDataQuery } from "@/lib/graphql/graphql";
import { useTodaySalesStore } from "@/store/salesStore";
import { useEffect, useState } from "react";

export const useSales = (selectedMonth: string) => {
  const {
    data,
    loading,
    error,
    refetch: refleshSales,
  } = useGetMonthlySalesDataQuery({
    variables: { month: selectedMonth },
  });
  const [dailySales, setDailySales] = useState<{ [key: string]: number }>({});
  const [monthlySummary, setMonthlySummary] = useState<{
    totalSales: number;
    totalOrders: number;
  }>({ totalSales: 0, totalOrders: 0 });

  const { sales: todaySales, orderCount: todayOrderCount } =
    useTodaySalesStore();

  useEffect(() => {
    if (data) {
      const salesMap = data.getMonthlySalesData.dailySales.reduce(
        (
          acc: { [key: string]: number },
          sale: { date: string; sales: number }
        ) => {
          acc[sale.date] = sale.sales;
          return acc;
        },
        {}
      );

      const today = new Date().toISOString().split("T")[0];
      if (salesMap[today] === undefined) {
        salesMap[today] = todaySales;
      } else {
        salesMap[today] += todaySales;
      }

      setDailySales(salesMap);
      setMonthlySummary({
        totalSales:
          data.getMonthlySalesData.monthlySummary.totalSales + todaySales,
        totalOrders:
          data.getMonthlySalesData.monthlySummary.totalOrders + todayOrderCount,
      });
    }
  }, [data]);

  return {
    dailySales,
    monthlySummary,
    loading,
    error,
    refleshSales,
  };
};
