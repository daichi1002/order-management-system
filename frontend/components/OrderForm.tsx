import { OrderItemInput } from "@/lib/graphql/graphql";
import React from "react";

interface OrderFormProps {
  newOrder: {
    items: OrderItemInput[];
    totalAmount: number;
    ticketNumber: number;
  };
  errorMessage: string | null;
  removeFromOrder: (index: number) => void;
  handleTicketNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeOrder: () => Promise<void>;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  newOrder,
  errorMessage,
  removeFromOrder,
  handleTicketNumberChange,
  placeOrder,
}) => {
  const handlePlaceOrder = async () => {
    try {
      await placeOrder();
    } catch (error) {}
  };

  return (
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
              value={newOrder.ticketNumber || ""}
              onChange={handleTicketNumberChange}
              className="w-full border rounded-md px-4 py-2"
              placeholder="番号札を入力してください"
            />
          </div>
          <ul className="space-y-4">
            {newOrder.items.map((item, index) => (
              <li key={index} className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">{item.menu.name}</h3>
                  <p className="text-gray-500">
                    ¥{item.price} x {item.quantity}
                  </p>
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
            <p className="text-lg font-bold">合計: ¥{newOrder.totalAmount}</p>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              onClick={handlePlaceOrder}
            >
              注文する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
