import { OrderItemInput } from "@/lib/graphql/graphql";
import { Trash2 } from "lucide-react";
import React from "react";

interface OrderFormProps {
  newOrder: {
    items: OrderItemInput[];
    totalAmount: number;
  };
  removeFromOrder: (index: number) => void;
  updateItemQuantity: (index: number, newQuantity: number) => void;
  placeOrder: () => Promise<void>;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  newOrder,
  removeFromOrder,
  updateItemQuantity,
  placeOrder,
}) => {
  const handlePlaceOrder = async () => {
    try {
      await placeOrder();
    } catch (error) {}
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">注文一覧</h2>
      <div className="bg-white rounded-lg shadow-md p-4">
        <ul className="space-y-4">
          {newOrder.items.map((item, index) => (
            <li key={index} className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">{item.menu.name}</h3>
                <p className="text-gray-500">¥{item.price}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out"
                  onClick={() => updateItemQuantity(index, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="text-lg font-bold">{item.quantity}</span>
                <button
                  className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out"
                  onClick={() => updateItemQuantity(index, item.quantity + 1)}
                >
                  +
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition duration-150 ease-in-out ml-2"
                  onClick={() => removeFromOrder(index)}
                >
                  <Trash2 className="inline-block w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex justify-between items-center mt-4">
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
  );
};
