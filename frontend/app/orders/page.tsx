"use client";
import { ErrorMessage } from "@/components/layout/Error";
import { LoadingSpinner } from "@/components/layout/Loading";
import { MenuList } from "@/components/orders/MenuList";
import { OrderForm } from "@/components/orders/OrderForm";
import { useToast } from "@/components/ui/use-toast";
import { useMenu } from "@/hooks/useMenu";
import { useOrder } from "@/hooks/useOrder";
import { withErrorHandling } from "@/lib/toast-utils";
import { useMemo } from "react";

export default function OrderPage() {
  const { menu, loading: menuLoading, error: menuError } = useMenu();
  const {
    newOrder,
    errorMessage,
    addToOrder,
    removeFromOrder,
    handleTicketNumberChange,
    placeOrder,
    getOrderLoading,
    getOrderError,
  } = useOrder();
  const { toast } = useToast();

  const today = useMemo(() => new Date().toISOString(), []);

  if (menuLoading || getOrderLoading) return <LoadingSpinner />;
  if (menuError || getOrderError) return <ErrorMessage />;

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
