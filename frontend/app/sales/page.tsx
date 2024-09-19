"use client";
import { toast } from "@/components/ui/use-toast";
import { withErrorHandling } from "@/lib/toast-utils";
import { getInitialSelectedDate, getInitialSelectedMonth } from "@/lib/utils";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  parse,
  startOfMonth,
} from "date-fns";
import React, { useEffect, useRef, useState } from "react";

// コンポーネントのインポート
import { ErrorMessage } from "@/components/layout/Error";
import { LoadingSpinner } from "@/components/layout/Loading";
import { CalendarDay } from "@/components/sales/CalendarDay";
import { MonthSelector } from "@/components/sales/MonthSelector";
import { OrderTable } from "@/components/sales/OrderTable";
import { SummaryCard } from "@/components/sales/SummaryCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// カスタムフックのインポート
import { useOrder } from "@/hooks/useOrder";
import { useSales } from "@/hooks/useSales";

// 定数
const MAX_VISIBLE_PAGES = 5;
const HALF_VISIBLE_PAGES = Math.floor(MAX_VISIBLE_PAGES / 2);
const WEEK_DAYS = ["日", "月", "火", "水", "木", "金", "土"];

// メインコンポーネント
const MonthlySummary: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    getInitialSelectedMonth()
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    getInitialSelectedDate()
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { orders, cancelOrder, updateDateTime } = useOrder();
  const { dailySales, monthlySummary, loading, error } =
    useSales(selectedMonth);

  const orderListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedDate(getInitialSelectedDate());
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage />;

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const scrollToOrderList = () => {
    orderListRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDateClick = (dateString: string) => {
    updateDateTime(new Date(Date.parse(dateString)).toISOString());
    setSelectedDate(dateString);
    setCurrentPage(1);
    scrollToOrderList();
  };

  const handleCancelOrder = withErrorHandling(
    (id: string) => cancelOrder(id),
    "注文が正常にキャンセルされました。",
    "注文のキャンセルに失敗しました。もう一度お試しください。",
    toast
  );

  const renderCalendar = () => {
    const monthStart = parse(selectedMonth, "yyyy-MM", new Date());
    const days = eachDayOfInterval({
      start: startOfMonth(monthStart),
      end: endOfMonth(monthStart),
    });

    const firstDayOfMonth = startOfMonth(monthStart);
    const startDayIndex = firstDayOfMonth.getDay();

    const calendarDays = Array.from({ length: startDayIndex }, (_, index) => (
      <div key={`empty-${index}`} className="empty-cell"></div>
    ));

    return (
      <div className="grid grid-cols-7 gap-4">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="font-bold text-center">
            {day}
          </div>
        ))}
        {calendarDays}
        {days.map((day) => (
          <CalendarDay
            key={format(day, "yyyy-MM-dd")}
            day={day}
            sales={dailySales[format(day, "yyyy-MM-dd")] || 0}
            onDateClick={handleDateClick}
            isSelected={selectedDate === format(day, "yyyy-MM-dd")}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">月間売上</CardTitle>
          <MonthSelector
            selectedMonth={selectedMonth}
            onMonthChange={(newDate: Date) =>
              setSelectedMonth(format(newDate, "yyyy-MM"))
            }
          />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <SummaryCard
              title="総売上"
              value={`¥${monthlySummary.totalSales.toLocaleString()}`}
            />
            <SummaryCard
              title="注文数"
              value={`${monthlySummary.totalOrders}件`}
            />
          </div>
          {renderCalendar()}
        </CardContent>
      </Card>

      <Card ref={orderListRef}>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            注文一覧 ({selectedDate})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OrderTable
            orders={paginatedOrders}
            onCancelOrder={handleCancelOrder}
          />
          <div className="mt-4 flex justify-between items-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((prev) => Math.max(1, prev - 1));
                    }}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => {
                  if (
                    index === 0 ||
                    index === totalPages - 1 ||
                    (index >= currentPage - HALF_VISIBLE_PAGES &&
                      index <= currentPage + HALF_VISIBLE_PAGES)
                  ) {
                    return (
                      <PaginationItem key={index}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === index + 1}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(index + 1);
                          }}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    (index === currentPage - HALF_VISIBLE_PAGES - 1 &&
                      index > 0) ||
                    (index === currentPage + HALF_VISIBLE_PAGES + 1 &&
                      index < totalPages - 1)
                  ) {
                    return (
                      <PaginationItem key={index}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                })}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            <Select
              value={String(itemsPerPage)}
              onValueChange={(value) => setItemsPerPage(Number(value))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="表示件数" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10件</SelectItem>
                <SelectItem value="20">20件</SelectItem>
                <SelectItem value="50">50件</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlySummary;
