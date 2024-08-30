import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

interface OrderCancelDialogProps {
  order: {
    id: string;
    ticketNumber: number;
    totalAmount: number;
    items: { name: string; quantity: number }[];
    createdAt: string;
  };
  onConfirm: (orderId: string) => void;
}

export function OrderCancelDialog({
  order,
  onConfirm,
}: OrderCancelDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm(order.id);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600">
          キャンセル
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>注文をキャンセルしますか？</DialogTitle>
          <DialogDescription>
            以下の注文をキャンセルします。この操作は取り消せません。
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <p>
            <strong>注文ID:</strong> {order.id}
          </p>
          <p>
            <strong>注文内容:</strong>
          </p>
          <ul>
            {order.items.map((item, index) => (
              <li key={index}>
                {item.name} x {item.quantity}
              </li>
            ))}
          </ul>
          <p>
            <strong>番号札:</strong> {order.ticketNumber}
          </p>
          <p>
            <strong>合計金額:</strong> ¥{order.totalAmount}
          </p>
          <p>
            <strong>注文日時:</strong>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
            onClick={() => setIsOpen(false)}
          >
            いいえ
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            onClick={handleConfirm}
          >
            はい、キャンセルします
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
