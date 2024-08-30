import { Order } from "@/lib/graphql/graphql";
import { formatDateTime } from "@/lib/utils";
import React, { useState } from "react";
import { Pagination } from "./layout/Pagenation";
import { OrderCancelDialog } from "./OrderCancelDialog";

// 今日の日付を取得するユーティリティ関数
const getTodayDate = () => {
  const today = new Date();
  return `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
};

interface OrderListProps {
  orders: Order[];
  cancelOrder: (id: string) => void;
}

export const OrderList: React.FC<OrderListProps> = ({
  orders,
  cancelOrder,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 7;
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

  return (
    <div>
      <h2 className="text-2xl font-bold mt-8 mb-2">
        注文一覧 ({getTodayDate()})
      </h2>
      <div className="bg-white rounded-lg shadow-md overflow-x-auto mb-0">
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-center">注文ID</th>
              <th className="px-4 py-2 text-center">注文内容</th>
              <th className="px-4 py-2 text-center">番号札</th>
              <th className="px-4 py-2 text-center">合計</th>
              <th className="px-4 py-2 text-center">注文時間</th>{" "}
              <th className="px-4 py-2 text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.id} className={`border-b bg-yellow-100`}>
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
                  <OrderCancelDialog
                    order={{
                      id: order.id,
                      ticketNumber: order.ticketNumber,
                      totalAmount: order.totalAmount,
                      items: order.items,
                      createdAt: order.createdAt,
                    }}
                    onConfirm={cancelOrder}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bg-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};
