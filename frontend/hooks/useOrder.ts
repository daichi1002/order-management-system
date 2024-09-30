"use client";
import {
  Menu,
  Order,
  OrderInput,
  OrderItemInput,
  useCancelOrderMutation,
  useCreateOrderMutation,
  useGetOrdersQuery,
} from "@/lib/graphql/graphql";
import { useTodaySalesStore } from "@/store/salesStore";
import { useEffect, useState } from "react";
import { useSales } from "./useSales";

export const useOrder = () => {
  const [createOrder] = useCreateOrderMutation();
  const [deleteOrder] = useCancelOrderMutation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [newOrder, setNewOrder] = useState<OrderInput>(initializeNewOrder());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // dateTimeの初期値を設定
  const [dateTime, setDateTime] = useState<string>(new Date().toISOString());
  const { addSale, incrementOrderCount, decrementOrderCount, subtractSale } =
    useTodaySalesStore();
  const { refleshSales } = useSales(new Date().toISOString().slice(0, 7));

  // Helper function to initialize newOrder state
  function initializeNewOrder(): OrderInput {
    return {
      items: [],
      totalAmount: 0,
      createdAt: new Date().toLocaleString(),
    };
  }

  const updateOrderItems = (
    updatedItems: OrderItemInput[],
    updatedTotalAmount: number
  ) => {
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    }));
  };

  const updateItemQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedItems = newOrder.items.map((item, i) =>
      i === index ? { ...item, quantity: newQuantity } : item
    );

    const updatedTotalAmount = updatedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    updateOrderItems(updatedItems, updatedTotalAmount);
    setErrorMessage(null);
  };

  const addToOrder = (item: Menu) => {
    const existingItemIndex = newOrder.items.findIndex(
      (orderItem) => orderItem.menu.id === item.id
    );

    if (existingItemIndex !== -1) {
      updateItemQuantity(
        existingItemIndex,
        newOrder.items[existingItemIndex].quantity + 1
      );
    } else {
      const updatedItems = [
        ...newOrder.items,
        { menu: item, quantity: 1, price: item.price },
      ];
      const updatedTotalAmount = updatedItems.reduce(
        (total, orderItem) => total + orderItem.price * orderItem.quantity,
        0
      );
      updateOrderItems(updatedItems, updatedTotalAmount);
    }

    setErrorMessage(null);
  };

  const removeFromOrder = (index: number) => {
    const updatedItems = [...newOrder.items];
    const removedItem = updatedItems.splice(index, 1)[0];
    const updatedTotalAmount =
      newOrder.totalAmount - removedItem.price * removedItem.quantity;

    updateOrderItems(updatedItems, updatedTotalAmount);
    setErrorMessage(null);
  };

  const placeOrder = async (): Promise<OrderInput | null> => {
    if (newOrder.items.length === 0) {
      throw new Error("注文を追加してください。");
    }

    try {
      const result = await createOrder({
        variables: {
          input: {
            createdAt: new Date().toISOString(),
            items: newOrder.items,
            totalAmount: newOrder.totalAmount,
          },
        },
      });

      if (result.data?.createOrder) {
        await refreshOrders();
        setNewOrder(initializeNewOrder());
        setErrorMessage(null);
        addSale(newOrder.totalAmount);
        incrementOrderCount();
        return newOrder;
      } else {
        console.error("Unexpected response format:", result.data);
        throw new Error("注文の処理中にエラーが発生しました。");
      }
    } catch (error) {
      console.error(error);
      throw new Error("注文の送信に失敗しました。");
    }
  };
  const cancelOrder = async (id: string) => {
    try {
      const result = await deleteOrder({ variables: { id, dateTime } });
      if (result.data?.cancelOrder) {
        const cancelledOrder = orders.find((order) => order.id === id);
        if (cancelledOrder) {
          subtractSale(cancelledOrder.totalAmount);
          decrementOrderCount();
          await refleshSales();
        }
        await refreshOrders();
      } else {
        throw new Error("注文のキャンセルに失敗しました");
      }
    } catch (error) {
      console.error(error);
      throw new Error("注文のキャンセルに失敗しました。");
    }
  };

  const {
    data: getOrdersData,
    loading: getOrderLoading,
    error: getOrderError,
    refetch: refreshOrders,
  } = useGetOrdersQuery({ variables: { dateTime: dateTime } });

  useEffect(() => {
    if (!getOrderLoading && !getOrderError && getOrdersData?.getOrders) {
      setOrders(getOrdersData.getOrders);
    }
  }, [getOrdersData, getOrderLoading, getOrderError]);

  const updateDateTime = (newDateTime: string) => {
    setDateTime(newDateTime);
    refreshOrders({ dateTime: newDateTime });
  };

  return {
    orders,
    newOrder,
    errorMessage,
    addToOrder,
    removeFromOrder,
    updateItemQuantity,
    placeOrder,
    cancelOrder,
    getOrderLoading,
    getOrderError,
    updateDateTime,
  };
};
