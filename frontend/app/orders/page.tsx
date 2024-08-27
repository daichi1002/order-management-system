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
    <div className="container mx-auto px-4 py-8 text-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <MenuList menu={menu} addToOrder={orderHook.addToOrder} />
        <OrderForm
          newOrder={orderHook.newOrder}
          errorMessage={orderHook.errorMessage}
          removeFromOrder={orderHook.removeFromOrder}
          handleTicketNumberChange={orderHook.handleTicketNumberChange}
          placeOrder={orderHook.placeOrder}
        />
      </div>
      <OrderList
        orders={orderHook.orders}
        cancelOrder={orderHook.cancelOrder}
      />
    </div>
  );
}
