"use client";
import { ErrorMessage } from "@/components/layout/Error";
import { LoadingSpinner } from "@/components/layout/Loading";
import { MenuList } from "@/components/MenuList";
import { OrderForm } from "@/components/OrderForm";
import { OrderList } from "@/components/OrderList";
import { useToast } from "@/components/ui/use-toast";
import { useMenu } from "@/hooks/useMenu";
import { useOrder } from "@/hooks/useOrder";

const successToastStyle = { background: "rgb(34 197 94)", color: "#fff" };

const showToast = (toast: any, message: string, isSuccess: boolean) => {
  toast({
    description: message,
    duration: isSuccess ? 3000 : 5000,
    ...(isSuccess ? { style: successToastStyle } : { variant: "destructive" }),
  });
};

const withErrorHandling =
  <T extends (...args: any[]) => Promise<void>>(
    action: T,
    successMessage: string,
    errorMessage: string,
    toast: any
  ) =>
  async (...args: Parameters<T>) => {
    try {
      await action(...args);
      showToast(toast, successMessage, true);
    } catch (error) {
      console.error(`Error: ${errorMessage}`, error);
      showToast(toast, errorMessage, false);
    }
  };

export default function OrderPage() {
  const { menu, loading: menuLoading, error: menuError } = useMenu();
  const {
    orders,
    newOrder,
    errorMessage,
    addToOrder,
    removeFromOrder,
    handleTicketNumberChange,
    placeOrder,
    cancelOrder,
    getOrderLoading,
    getOrderError,
  } = useOrder();
  const { toast } = useToast();

  if (menuLoading || getOrderLoading) return <LoadingSpinner />;
  if (menuError || getOrderError) return <ErrorMessage />;

  const handleCancelOrder = withErrorHandling(
    (id: string) => cancelOrder(id),
    "注文が正常にキャンセルされました。",
    "注文のキャンセルに失敗しました。もう一度お試しください。",
    toast
  );

  const handlePlaceOrder = withErrorHandling(
    placeOrder,
    "注文が正常に作成されました。",
    "注文の作成に失敗しました。もう一度お試しください。",
    toast
  );

  return (
    <div className="container mx-auto px-4 py-8 text-lg grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="order-2 md:order-1 md:col-span-2">
        <MenuList menu={menu} addToOrder={addToOrder} />
        <OrderList orders={orders} cancelOrder={handleCancelOrder} />
      </div>
      <div className="order-1 md:order-2">
        <OrderForm
          newOrder={newOrder}
          errorMessage={errorMessage}
          removeFromOrder={removeFromOrder}
          handleTicketNumberChange={handleTicketNumberChange}
          placeOrder={handlePlaceOrder}
        />
      </div>
    </div>
  );
}
