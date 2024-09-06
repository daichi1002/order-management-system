"use client";
import { ErrorMessage } from "@/components/layout/Error";
import { LoadingSpinner } from "@/components/layout/Loading";
import { Pagination } from "@/components/layout/Pagenation";
import { OrderCancelDialog } from "@/components/OrderCancelDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useDailyClosing } from "@/hooks/useDailyClosing";
import { useOrder } from "@/hooks/useOrder";
import { withErrorHandling } from "@/lib/toast-utils";
import { formatDateTime, getTodayDate } from "@/lib/utils";
import { useMemo, useState } from "react";

export default function OrderListPage() {
  const { orders, getOrderLoading, getOrderError, cancelOrder } = useOrder();
  const { toast } = useToast();
  const handleCancelOrder = withErrorHandling(
    (id: string) => cancelOrder(id),
    "注文が正常にキャンセルされました。",
    "注文のキャンセルに失敗しました。もう一度お試しください。",
    toast
  );

  const today = useMemo(() => new Date().toISOString(), []);
  const { useIsSalesConfirmed } = useDailyClosing();
  const { data: salesConfirmedData, loading: salesConfirmedLoading } =
    useIsSalesConfirmed(today);

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const sortedOrders = [...orders].sort(
    (a, b) => parseInt(b.id, 10) - parseInt(a.id, 10)
  );

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (getOrderLoading || salesConfirmedLoading) return <LoadingSpinner />;
  if (getOrderError) return <ErrorMessage />;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            注文履歴 ({getTodayDate()})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>注文ID</TableHead>
                <TableHead>注文内容</TableHead>
                <TableHead>番号札</TableHead>
                <TableHead>合計</TableHead>
                <TableHead>注文時間</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    <ul className="space-y-1">
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.name} x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>{order.ticketNumber}</TableCell>
                  <TableCell>¥{order.totalAmount}</TableCell>
                  <TableCell>
                    {formatDateTime(order.createdAt, "HH:mm:ss")}
                  </TableCell>
                  <TableCell>
                    {!salesConfirmedData?.isSalesConfirmed && (
                      <OrderCancelDialog
                        order={{
                          id: order.id,
                          ticketNumber: order.ticketNumber,
                          totalAmount: order.totalAmount,
                          items: order.items,
                          createdAt: order.createdAt,
                        }}
                        onConfirm={handleCancelOrder}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
