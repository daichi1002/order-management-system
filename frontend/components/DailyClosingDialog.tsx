import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getTodayDate } from "@/lib/utils";
import { useState } from "react";

export default function DailyClosingDialog({
  totalAmount,
  totalOrders,
  onConfirm,
}: {
  totalAmount: number;
  totalOrders: number;
  onConfirm: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>売上確定</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>売上を確定しますか？</DialogTitle>
          <DialogDescription>
            以下の売上を確定します。この操作は取り消せません。
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <p>
            <strong>日付:</strong> {getTodayDate()}
          </p>
          <p>
            <strong>売上金額:</strong> ¥{totalAmount.toLocaleString()}
          </p>
          <p>
            <strong>注文数:</strong> {totalOrders}件
          </p>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            キャンセル
          </Button>
          <Button onClick={handleConfirm}>確定する</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
