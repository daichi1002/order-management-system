import { Button } from "@/components/ui/button";
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
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface Order {
  id: number;
  date: string;
  amount: number;
  customerName: string;
}

const maxVisiblePages = 5;
const halfVisiblePages = Math.floor(maxVisiblePages / 2);

const MonthlySummary: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [selectedDate, setSelectedDate] = useState<string>("all");
  const [dailySales, setDailySales] = useState<{ [key: string]: number }>({});
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 月を変更する関数
  const handlePreviousMonth = () => {
    const newMonth = format(
      subMonths(parse(selectedMonth, "yyyy-MM", new Date()), 1),
      "yyyy-MM"
    );
    setSelectedMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = format(
      addMonths(parse(selectedMonth, "yyyy-MM", new Date()), 1),
      "yyyy-MM"
    );
    setSelectedMonth(newMonth);
  };
  // ページ初期化時に今日の日付を selectedDate にセット
  useEffect(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    setSelectedDate(today);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      const dummyOrders: Order[] = [];
      const [year, month] = selectedMonth.split("-");
      const daysInMonth = new Date(Number(year), Number(month), 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        for (let i = 0; i < 50; i++) {
          dummyOrders.push({
            id: dummyOrders.length + 1,
            date: `${selectedMonth}-${day.toString().padStart(2, "0")}`,
            amount: Math.floor(Math.random() * 10000) + 1000,
            customerName: `顧客${dummyOrders.length + 1}`,
          });
        }
      }
      setOrders(dummyOrders);
    };

    fetchOrders();
  }, [selectedMonth]);

  useEffect(() => {
    const salesData = orders.reduce((acc, order) => {
      const date = order.date.slice(0, 10);
      acc[date] = (acc[date] || 0) + order.amount;
      return acc;
    }, {} as { [key: string]: number });

    setDailySales(salesData);
  }, [orders]);

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setIsEditDialogOpen(true);
  };

  const handleDeleteOrder = (orderId: number) => {
    setOrders(orders.filter((order) => order.id !== orderId));
  };

  const handleSaveEdit = () => {
    if (editingOrder) {
      setOrders(
        orders.map((order) =>
          order.id === editingOrder.id ? editingOrder : order
        )
      );
      setIsEditDialogOpen(false);
      setEditingOrder(null);
    }
  };

  const filteredOrders =
    selectedDate === "all"
      ? orders
      : orders.filter((order) => order.date === selectedDate);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
              className={`p-4 border rounded-lg text-center ${
                isToday(day) ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedDate(dateString)}
            >
              <div>{dayOfMonth}</div>
              <div className="text-red-400">{sales.toLocaleString()}円</div>
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
  const averageOrderValue =
    totalOrderCount > 0 ? totalMonthlySales / totalOrderCount : 0;
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  平均注文金額
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ¥
                  {averageOrderValue.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
          {renderCalendar()}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">注文一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>日付</TableHead>
                <TableHead>顧客名</TableHead>
                <TableHead>金額</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.amount.toLocaleString()}円</TableCell>
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
              <Input
                type="text"
                value={editingOrder.customerName}
                onChange={(e) =>
                  setEditingOrder({
                    ...editingOrder,
                    customerName: e.target.value,
                  })
                }
                placeholder="顧客名"
              />
              <Input
                type="number"
                value={editingOrder.amount}
                onChange={(e) =>
                  setEditingOrder({
                    ...editingOrder,
                    amount: Number(e.target.value),
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
