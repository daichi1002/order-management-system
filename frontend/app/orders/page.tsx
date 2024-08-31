"use client";
import { ErrorMessage } from "@/components/layout/Error";
import { LoadingSpinner } from "@/components/layout/Loading";
import { MenuList } from "@/components/MenuList";
import { OrderForm } from "@/components/OrderForm";
import { OrderList } from "@/components/OrderList";
import { useToast } from "@/components/ui/use-toast";
import { useDailyClosing } from "@/hooks/useDailyClosing";
import { useMenu } from "@/hooks/useMenu";
import { useOrder } from "@/hooks/useOrder";
import { withErrorHandling } from "@/lib/toast-utils";
import { useMemo } from "react";

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

  const today = useMemo(() => new Date().toISOString(), []);
  const { useIsSalesConfirmed } = useDailyClosing();
  const { data: salesConfirmedData, loading: salesConfirmedLoading } =
    useIsSalesConfirmed(today);

  if (menuLoading || getOrderLoading || salesConfirmedLoading)
    return <LoadingSpinner />;
  if (menuError || getOrderError) return <ErrorMessage />;

  const isClosingConfirmed = salesConfirmedData?.isSalesConfirmed;

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
        <MenuList
          menu={menu}
          addToOrder={isClosingConfirmed ? undefined : addToOrder}
        />
        <OrderList
          orders={orders}
          cancelOrder={isClosingConfirmed ? undefined : handleCancelOrder}
        />
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
