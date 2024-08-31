import { Order } from "@/lib/graphql/graphql";
import { formatDateTime } from "@/lib/utils";

export default function DailyClosingOrderList({
    orders,
    currentPage,
    ordersPerPage,
  }: {
    orders: Order[];
    currentPage: number;
    ordersPerPage: number;
  }) {
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    const displayedOrders = orders.slice(startIndex, endIndex);
  
    return (
      <div className="bg-muted rounded-lg p-4">
        <div className="grid grid-cols-[80px_1fr_100px] gap-4 border-b pb-4 mb-4 last:mb-0 last:border-b-0">
          <div className="text-muted-foreground text-sm">時間</div>
          <div className="text-muted-foreground text-sm">商品</div>
          <div className="text-muted-foreground text-sm text-right">金額</div>
        </div>
        {displayedOrders.map((order, index) => (
          <div
            key={index}
            className="grid grid-cols-[80px_1fr_100px] gap-4 border-b pb-4 mb-4 last:mb-0 last:border-b-0"
          >
            <div className="font-medium">
              {formatDateTime(order.createdAt, "HH:mm")}
            </div>
            <div>
              {order.items.map((item, idx) => (
                <div key={idx}>
                  {item.name} x {item.quantity}
                </div>
              ))}
            </div>
            <div className="font-medium text-right">
              ¥{order.totalAmount.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    );
  }