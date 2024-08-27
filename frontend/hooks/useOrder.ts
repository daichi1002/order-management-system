"use client"
import { Menu, Order, useCreateOrderMutation } from "@/lib/graphql/graphql";
import { toJSTDate } from "@/lib/utils";
import { useState } from "react";

export const useOrder = () => {
  const [createOrder] = useCreateOrderMutation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [newOrder, setNewOrder] = useState<Omit<Order, "id">>({
    items: [],
    totalAmount: 0,
    ticketNumber: 0,
    createdAt: new Date().toLocaleString(),
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const addToOrder = (item: Menu) => {
    const existingItem = newOrder.items.find(
        (orderItem) => orderItem.menu.id === item.id
      );
  
      if (existingItem) {
        setNewOrder({
          ...newOrder,
          items: newOrder.items.map((orderItem) =>
            orderItem.menu.id === item.id
              ? {
                  ...orderItem,
                  quantity: orderItem.quantity + 1,
                }
              : orderItem
          ),
          totalAmount: newOrder.totalAmount + item.price,
        });
      } else {
        setNewOrder({
          ...newOrder,
          items: [
            ...newOrder.items,
            { menu: item, quantity: 1, price: item.price },
          ],
          totalAmount: newOrder.totalAmount + item.price,
        });
      }
      setErrorMessage(null);
  };

  const removeFromOrder = (index: number) => {
    const updatedItems = [...newOrder.items];
    const removedItem = updatedItems.splice(index, 1)[0];
    setNewOrder({
      ...newOrder,
      items: updatedItems,
      totalAmount:
        newOrder.totalAmount - removedItem.price * removedItem.quantity,
    });
    setErrorMessage(null);
  };

  const placeOrder = async () => {
    if (!newOrder.ticketNumber) {
        setErrorMessage("番号札を入力してください。");
        return;
      }
  
      if (newOrder.items.length === 0) {
        setErrorMessage("注文を追加してください。");
        return;
      }
      try {
        const result = await createOrder({
          variables: {
            input: {
              createdAt: toJSTDate(new Date()),
              items: newOrder.items,
              ticketNumber: newOrder.ticketNumber,
              totalAmount: newOrder.totalAmount,
            },
          },
        });
        if (result.data && typeof result.data.createOrder === "number") {
          setOrders((prevOrders) => [
            ...prevOrders,
            {
              ...newOrder,
              id: result.data!.createOrder,
            },
          ]);
        } else {
          console.error("Unexpected response format:", result.data);
          setErrorMessage("注文の処理中にエラーが発生しました。");
        }
  
        setNewOrder({
          items: [],
          totalAmount: 0,
          ticketNumber: 0,
          createdAt: new Date().toLocaleString(),
        });
        setErrorMessage(null);
      } catch (error) {
        console.log(error);
        setErrorMessage("注文の送信に失敗しました。");
      }
  };

  const cancelOrder = (id: number) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  const handleTicketNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ticketNumber = parseInt(e.target.value, 10);

    if (!isNaN(ticketNumber)) {
      setNewOrder({
        ...newOrder,
        ticketNumber: ticketNumber,
      });
      setErrorMessage(null);
    } else {
      setNewOrder({
        ...newOrder,
        ticketNumber: 0, // ここで適切なデフォルト値を設定するか、エラーメッセージを表示することも可能です
      });
      setErrorMessage("有効な番号を入力してください。");
    }
  };

  return {
    orders,
    newOrder,
    errorMessage,
    addToOrder,
    removeFromOrder,
    placeOrder,
    cancelOrder,
    handleTicketNumberChange,
  };
};