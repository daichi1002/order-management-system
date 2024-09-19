import { Order } from "@/lib/graphql/graphql";
import { formatDateTime } from "@/lib/utils";
import React from "react";
import { OrderCancelDialog } from "../layout/OrderCancelDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface OrderTableProps {
  orders: Order[];
  onCancelOrder: (id: string) => void;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  onCancelOrder,
}) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>時間</TableHead>
        <TableHead>メニュー</TableHead>
        <TableHead>金額</TableHead>
        <TableHead>操作</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {orders.map((order) => (
        <TableRow key={order.id}>
          <TableCell>{formatDateTime(order.createdAt, "HH:mm:ss")}</TableCell>
          <TableCell>
            {order.items.map((item, index) => (
              <div key={index}>
                {item.name} x {item.quantity}
              </div>
            ))}
          </TableCell>
          <TableCell>¥{order.totalAmount.toLocaleString()}</TableCell>
          <TableCell>
            <OrderCancelDialog order={order} onConfirm={onCancelOrder} />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
