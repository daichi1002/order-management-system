"use client";

import { fetchMenu } from "@/api/api";
import { Menu } from "@/types/menu";
import { useEffect, useState } from "react";

type Order = {
  id: number;
  items: Menu[];
  total: number;
  createdAt: string;
  ticketNumber: string;
};

export default function Component() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menu, setMenu] = useState<Menu[]>([]);
  const [newOrder, setNewOrder] = useState<Order>({
    id: orders.length + 1,
    items: [],
    total: 0,
    ticketNumber: "",
    createdAt: new Date().toLocaleString(),
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const data = await fetchMenu(); // api.tsのfetchMenuを呼び出す
        setMenu(data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };

    loadMenu();
  }, []);

  const addToOrder = (item: Menu) => {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { ...item }],
      total: newOrder.total + item.price,
    });
    setErrorMessage(null); // アイテム追加時にエラーメッセージをクリア
  };

  const removeFromOrder = (index: number) => {
    const updatedItems = [...newOrder.items];
    const removedItem = updatedItems.splice(index, 1)[0];
    setNewOrder({
      ...newOrder,
      items: updatedItems,
      total: newOrder.total - removedItem.price,
    });
    setErrorMessage(""); // アイテム削除時にエラーメッセージをクリア
  };

  const placeOrder = () => {
    if (!newOrder.ticketNumber) {
      setErrorMessage("番号札を入力してください。");
      return;
    }

    if (newOrder.items.length === 0) {
      setErrorMessage("注文を追加してください。");
      return;
    }

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
      createdAt: new Date().toLocaleString(),
    });
    setErrorMessage(null); // 注文成功時にエラーメッセージをクリア
  };

  const cancelOrder = (id: number) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  const handleTicketNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewOrder({
      ...newOrder,
      ticketNumber: e.target.value,
    });
    setErrorMessage(null); // 番号札変更時にエラーメッセージをクリア
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
              {errorMessage && (
                <p className="text-red-500 font-bold">{errorMessage}</p>
              )}
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
                          {item.name} ({item.price}円)
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-2 text-center">
                    {order.ticketNumber}
                  </td>
                  <td className="px-4 py-2 text-center">{order.total}円</td>
                  <td className="px-4 py-2 text-center">{order.createdAt}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
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
}
