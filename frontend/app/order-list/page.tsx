"use client";
import { ErrorMessage } from "@/components/layout/Error";
import { LoadingSpinner } from "@/components/layout/Loading";
import { Pagination } from "@/components/layout/Pagenation";
import { OrderCancelDialog } from "@/components/OrderCancelDialog";
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
    <div className="container mx-auto px-4 text-lg">
      <h2 className="text-2xl font-bold mt-8 mb-2">
        注文履歴 ({getTodayDate()})
      </h2>
      <div className="bg-white rounded-lg shadow-md overflow-x-auto mb-0">
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="bg-muted">
              <th className="px-4 py-2 text-center">注文ID</th>
              <th className="px-4 py-2 text-center">注文内容</th>
              <th className="px-4 py-2 text-center">番号札</th>
              <th className="px-4 py-2 text-center">合計</th>
              <th className="px-4 py-2 text-center">注文時間</th>
              <th className="px-4 py-2 text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.id} className={`border-b bg-white`}>
                <td className="px-4 py-2 text-center">{order.id}</td>
                <td className="px-4 py-2 text-center">
                  <ul className="space-y-1">
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.name} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2 text-center">{order.ticketNumber}</td>
                <td className="px-4 py-2 text-center">¥{order.totalAmount}</td>
                <td className="px-4 py-2 text-center">
                  {formatDateTime(order.createdAt, "HH:mm:ss")}
                </td>
                <td className="px-4 py-2 text-center">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bg-muted">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
