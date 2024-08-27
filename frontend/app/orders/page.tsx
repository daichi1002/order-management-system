"use client";
import { ErrorMessage } from "@/components/layout/Error";
import { LoadingSpinner } from "@/components/layout/Loading";
import { MenuList } from "@/components/MenuList";
import { OrderForm } from "@/components/OrderForm";
import { OrderList } from "@/components/OrderList";
import { useMenu } from "@/hooks/useMenu";
import { useOrder } from "@/hooks/useOrder";

export default function OrderPage() {
  const { menu, loading, error } = useMenu();
  const orderHook = useOrder();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage />;

  return (
    <div className="container mx-auto px-4 py-8 text-lg  grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="order-2 md:order-1 md:col-span-2">
        <MenuList menu={menu} addToOrder={orderHook.addToOrder} />
        <OrderList
          orders={orderHook.orders}
          cancelOrder={orderHook.cancelOrder}
        />
      </div>
      <div className="order-1 md:order-2">
        <OrderForm
          newOrder={orderHook.newOrder}
          errorMessage={orderHook.errorMessage}
          removeFromOrder={orderHook.removeFromOrder}
          handleTicketNumberChange={orderHook.handleTicketNumberChange}
          placeOrder={orderHook.placeOrder}
        />
      </div>
    </div>
  );
}
