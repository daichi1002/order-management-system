/**
 * v0 by Vercel.
 * @see https://v0.dev/t/36QbPRwMTcc
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";

import { useState } from "react";

type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: number;
  items: OrderItem[];
  status: string;
  total: number;
  createdAt: string;
  ticketNumber: string;
};

export default function Component() {
  const [orders, setOrders] = useState([
    {
      id: 4,
      items: [
        { name: "ステーキ", quantity: 1, price: 2000 },
        { name: "ワイン", quantity: 1, price: 800 },
      ],
      status: "completed",
      total: 2800,
      createdAt: "2023-05-01 12:37",
      ticketNumber: "101112",
    },
    {
      id: 3,
      items: [{ name: "ラーメン", quantity: 1, price: 900 }],
      status: "delivered",
      total: 900,
      createdAt: "2023-05-01 12:36",
      ticketNumber: "789",
    },
    {
      id: 2,
      items: [
        { name: "ピザ", quantity: 1, price: 1500 },
        { name: "サラダ", quantity: 1, price: 600 },
      ],
      status: "cooking",
      total: 2100,
      createdAt: "2023-05-01 12:35",
      ticketNumber: "456",
    },
    {
      id: 1,
      items: [
        { name: "ハンバーガー", quantity: 2, price: 800 },
        { name: "フライドポテト", quantity: 1, price: 400 },
      ],
      status: "new",
      total: 2000,
      createdAt: "2023-05-01 12:34",
      ticketNumber: "123",
    },
  ]);
  const [menu, setMenu] = useState([
    { name: "ハンバーガー", price: 800, quantity: 1 },
    { name: "フライドポテト", price: 400, quantity: 1 },
    { name: "ピザ", price: 1500, quantity: 1 },
    { name: "サラダ", price: 600, quantity: 1 },
    { name: "ラーメン", price: 900, quantity: 1 },
    { name: "ステーキ", price: 2000, quantity: 1 },
    { name: "ワイン", price: 800, quantity: 1 },
  ]);

  const [newOrder, setNewOrder] = useState<Order>({
    id: orders.length + 1,
    items: [],
    total: 0,
    ticketNumber: "",
    status: "new",
    createdAt: new Date().toLocaleString(),
  });

  const addToOrder = (item: OrderItem) => {
    const existingItem = newOrder.items.find(
      (orderItem) => orderItem.name === item.name
    );

    if (existingItem) {
      existingItem.quantity += 1;
      setNewOrder({
        ...newOrder,
        items: [...newOrder.items],
        total: newOrder.total + item.price,
      });
    } else {
      setNewOrder({
        ...newOrder,
        items: [...newOrder.items, { ...item, quantity: 1 }],
        total: newOrder.total + item.price,
      });
    }
  };

  const removeFromOrder = (index: number) => {
    const updatedItems = [...newOrder.items];
    const removedItem = updatedItems.splice(index, 1)[0];
    setNewOrder({
      ...newOrder,
      items: updatedItems,
      total: newOrder.total - removedItem.price * removedItem.quantity,
    });
  };

  const placeOrder = () => {
    setOrders([
      ...orders,
      {
        ...newOrder,
        id: orders.length + 1,
      },
    ]);
    setNewOrder({
      id: orders.length + 2,
      items: [],
      total: 0,
      ticketNumber: "",
      status: "new",
      createdAt: new Date().toLocaleString(),
    });
  };

  const cancelOrder = (id: number) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  const handleTicketNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewOrder({
      ...newOrder,
      ticketNumber: e.target.value,
    });
  };
  return (
    <div className="container mx-auto px-4 py-8 text-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">メニュー</h2>
          <ul className="grid grid-cols-2 gap-4">
            {menu.map((item) => (
              <li
                key={item.name}
                className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-100"
                onClick={() => addToOrder(item)}
              >
                <h3 className="text-lg font-bold">{item.name}</h3>
                <p className="text-gray-500">¥{item.price}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">新しい注文</h2>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="ticket-number" className="block font-bold mb-2">
                  番号札
                </label>
                <input
                  id="ticket-number"
                  type="text"
                  value={newOrder.ticketNumber}
                  onChange={handleTicketNumberChange}
                  className="w-full border rounded-md px-4 py-2"
                  placeholder="番号札を入力してください"
                />
              </div>
              <ul className="space-y-4">
                {newOrder.items.map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold">{item.name}</h3>
                      <p className="text-gray-500">¥{item.price}</p>
                    </div>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                      onClick={() => removeFromOrder(index)}
                    >
                      削除
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold">合計: ¥{newOrder.total}</p>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  onClick={placeOrder}
                >
                  注文する
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
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
              .sort((a, b) => b.id - a.id) // ここで降順にソート
              .map((order) => (
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
                  <td className="px-4 py-2 text-center">
                    {order.ticketNumber}
                  </td>
                  <td className="px-4 py-2 text-center">¥{order.total}</td>
                  <td className="px-4 py-2 text-center">{order.createdAt}</td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                        onClick={() => cancelOrder(order.id)}
                      >
                        キャンセル
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
