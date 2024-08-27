import { Order } from "@/lib/graphql/graphql";
import React from "react";

interface OrderListProps {
  orders: Order[];
  cancelOrder: (id: number) => void;
}

export const OrderList: React.FC<OrderListProps> = ({
  orders,
  cancelOrder,
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mt-8 mb-4">注文一覧</h2>
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-center">注文ID</th>
              <th className="px-4 py-2 text-center">注文内容</th>
              <th className="px-4 py-2 text-center">番号札</th>
              <th className="px-4 py-2 text-center">合計</th>
              <th className="px-4 py-2 text-center">注文日時</th>
              <th className="px-4 py-2 text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            {orders
              .sort((a, b) => b.id - a.id)
              .map((order) => (
                <tr key={order.id} className={`border-b bg-yellow-100`}>
                  <td className="px-4 py-2 text-center">{order.id}</td>
                  <td className="px-4 py-2 text-center">
                    <ul className="space-y-1">
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.menu.name} x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-2 text-center">
                    {order.ticketNumber}
                  </td>
                  <td className="px-4 py-2 text-center">
                    ¥{order.totalAmount}
                  </td>
                  <td className="px-4 py-2 text-center">{order.createdAt}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                      onClick={() => cancelOrder(order.id)}
                    >
                      キャンセル
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
