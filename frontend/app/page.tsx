"use client";
import { ErrorMessage } from "@/components/layout/Error";
import { LoadingSpinner } from "@/components/layout/Loading";
import { MenuList } from "@/components/orders/MenuList";
import { OrderForm } from "@/components/orders/OrderForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useMenu } from "@/hooks/useMenu";
import { useOrder } from "@/hooks/useOrder";
import useBluetoothPrinter from "@/hooks/usePrinter";
import { withErrorHandling } from "@/lib/toast-utils";
import { AlertTriangle, Printer } from "lucide-react";

export default function OrderPage() {
  const { menu, loading: menuLoading, error: menuError } = useMenu();
  const {
    newOrder,
    addToOrder,
    removeFromOrder,
    updateItemQuantity,
    placeOrder,
  } = useOrder();
  const {
    isConnected,
    error: printerError,
    connectToPrinter,
    printReceipt,
  } = useBluetoothPrinter();
  const { toast } = useToast();

  if (menuLoading) return <LoadingSpinner />;
  if (menuError) return <ErrorMessage />;

  const handlePlaceOrder = withErrorHandling(
    async () => {
      const order = await placeOrder();
      if (order && isConnected) {
        // 注文が成功した場合、レシートを印刷
        await printReceipt(
          `${order.items
            .map(
              (item) => `${item.menu.name}: ${item.quantity}x ${item.price}円`
            )
            .join("\n")}\n合計: ${order.totalAmount}円`
        );
      }
    },
    "注文が正常に作成されました。",
    "注文の作成に失敗しました。もう一度お試しください。",
    toast
  );

  return (
    <div className="container mx-auto px-4 py-8 text-lg grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="order-2 md:order-1 md:col-span-2">
        <MenuList menu={menu} addToOrder={addToOrder} />
      </div>
      <div className="order-1 md:order-2">
        <div className="mb-4">
          {isConnected ? (
            <Alert>
              <Printer className="h-4 w-4" />
              <AlertDescription>プリンターに接続されています</AlertDescription>
            </Alert>
          ) : (
            <Button onClick={connectToPrinter} variant="outline">
              <Printer className="mr-2 h-4 w-4" /> プリンターに接続
            </Button>
          )}
          {printerError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{printerError}</AlertDescription>
            </Alert>
          )}
        </div>
        <OrderForm
          newOrder={newOrder}
          removeFromOrder={removeFromOrder}
          updateItemQuantity={updateItemQuantity}
          placeOrder={handlePlaceOrder}
        />
      </div>
    </div>
  );
}
