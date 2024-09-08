"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrder } from "@/hooks/useOrder";
import { Order } from "@/lib/graphql/graphql";
import { formatDateTime } from "@/lib/utils";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isToday,
  parse,
  startOfMonth,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const maxVisiblePages = 5;
const halfVisiblePages = Math.floor(maxVisiblePages / 2);

const MonthlySummary: React.FC = () => {
  const { orders, updateDateTime } = useOrder();
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [dailySales, setDailySales] = useState<{ [key: string]: number }>({});
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const orderListRef = useRef<HTMLDivElement>(null);

  // ページ初期化時に今日の日付を selectedDate にセット
  useEffect(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    setSelectedDate(today);
  }, []);

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setIsEditDialogOpen(true);
  };

  const handleDeleteOrder = (orderId: string) => {
    // setOrders(orders.filter((order) => order.id !== orderId));
  };

  const handleSaveEdit = () => {
    if (editingOrder) {
      // setOrders(
      //   orders.map((order) =>
      //     order.id === editingOrder.id ? editingOrder : order
      //   )
      // );
      setIsEditDialogOpen(false);
      setEditingOrder(null);
    }
  };

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const scrollToOrderList = () => {
    if (orderListRef.current) {
      orderListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDateClick = (dateString: string) => {
    updateDateTime(new Date(Date.parse(dateString)).toISOString());
    setSelectedDate(dateString);
    setCurrentPage(1);
    scrollToOrderList();
  };

  const renderCalendar = () => {
    const monthStart = parse(selectedMonth, "yyyy-MM", new Date());
    const days = eachDayOfInterval({
      start: startOfMonth(monthStart),
      end: endOfMonth(monthStart),
    });

    const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

    const firstDayOfMonth = startOfMonth(monthStart);
    const startDayIndex = firstDayOfMonth.getDay(); // 0: 日曜日, 1: 月曜日, ...

    const calendarDays = Array.from({ length: startDayIndex }, (_, index) => (
      <div key={`empty-${index}`} className="empty-cell"></div>
    ));

    return (
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day) => (
          <div key={day} className="font-bold text-center">
            {day}
          </div>
        ))}
        {calendarDays}
        {days.map((day) => {
          const dateString = format(day, "yyyy-MM-dd");
          const dayOfMonth = format(day, "d");
          const sales = dailySales[dateString] || 0;

          return (
            <div
              key={dateString}
              className={`p-4 border rounded-lg text-center cursor-pointer ${
                isToday(day) ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
              onClick={() => handleDateClick(dateString)}
            >
              <div>{dayOfMonth}</div>
              <div className="text-red-400">¥{sales.toLocaleString()}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const totalMonthlySales = Object.values(dailySales).reduce(
    (total, sales) => total + sales,
    0
  );

  const totalOrderCount = orders.length;
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">月間売上サマリー</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const newMonth = format(
                  subMonths(parse(selectedMonth, "yyyy-MM", new Date()), 1),
                  "yyyy-MM"
                );
                setSelectedMonth(newMonth);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-40"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const newMonth = format(
                  addMonths(parse(selectedMonth, "yyyy-MM", new Date()), 1),
                  "yyyy-MM"
                );
                setSelectedMonth(newMonth);
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">総売上</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ¥{totalMonthlySales.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">注文数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalOrderCount}件</div>
              </CardContent>
            </Card>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>時間</TableHead>
                <TableHead>メニュー</TableHead>
                <TableHead>金額</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    {formatDateTime(order.createdAt, "HH:mm:ss")}
                  </TableCell>
                  <TableCell>
                    {order.items.map((item, index) => (
                      <div>
                        {item.name} x {item.quantity}
                      </div>
                    ))}
                  </TableCell>
                  {/* <TableCell>{order.items}</TableCell> */}
                  <TableCell>¥{order.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleEditOrder(order)}
                      className="mr-2"
                    >
                      編集
                    </Button>
                    <Button
                      onClick={() => handleDeleteOrder(order.id)}
                      variant="destructive"
                    >
                      削除
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
                    (index >= currentPage - halfVisiblePages &&
                      index <= currentPage + halfVisiblePages)
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
                    (index === currentPage - halfVisiblePages - 1 &&
                      index > 0) ||
                    (index === currentPage + halfVisiblePages + 1 &&
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>注文編集</DialogTitle>
          </DialogHeader>
          {editingOrder && (
            <div className="space-y-4">
              {/* <Input
                type="text"
                value={editingOrder.customerName}
                onChange={(e) =>
                  setEditingOrder({
                    ...editingOrder,
                    customerName: e.target.value,
                  })
                }
                placeholder="顧客名"
              /> */}
              <Input
                type="number"
                value={editingOrder.totalAmount}
                onChange={(e) =>
                  setEditingOrder({
                    ...editingOrder,
                    totalAmount: Number(e.target.value),
                  })
                }
                placeholder="金額"
              />
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleSaveEdit}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MonthlySummary;
