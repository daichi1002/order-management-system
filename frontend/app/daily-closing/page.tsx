// "use client";
// import DailyClosingDialog from "@/components/DailyClosingDialog";
// import DailyClosingOrderList from "@/components/DailyClosingOrderList";
// import { ErrorMessage } from "@/components/layout/Error";
// import { LoadingSpinner } from "@/components/layout/Loading";
// import { Pagination } from "@/components/layout/Pagenation";
// import { useToast } from "@/components/ui/use-toast";
// import { useDailyClosing } from "@/hooks/useDailyClosing";
// import { useOrder } from "@/hooks/useOrder";
// import { withErrorHandling } from "@/lib/toast-utils";
// import { getTodayDate } from "@/lib/utils";
// import { useMemo, useState } from "react";

// export default function DailyClosing() {
//   const { orders, getOrderLoading, getOrderError } = useOrder();
//   const { createData, useIsSalesConfirmed } = useDailyClosing();
//   const { toast } = useToast();
//   const [currentPage, setCurrentPage] = useState(1);
//   const ordersPerPage = 10;

//   const today = useMemo(() => new Date().toISOString(), []); // メモ化して再レンダリング時に日付が変わらないようにする

//   const {
//     data: salesConfirmedData,
//     loading: salesConfirmedLoading,
//     error: salesConfirmedError,
//     refetch: refetchSalesConfirmed,
//   } = useIsSalesConfirmed(today);

//   if (getOrderLoading || salesConfirmedLoading) return <LoadingSpinner />;
//   if (getOrderError || salesConfirmedError) return <ErrorMessage />;

//   const totalAmount = orders.reduce(
//     (total, order) => total + order.totalAmount,
//     0
//   );
//   const totalOrders = orders.length;
//   const totalPages = Math.ceil(totalOrders / ordersPerPage);

//   const handleSalesConfirmation = withErrorHandling(
//     async () => {
//       await createData(today, totalAmount, totalOrders);
//       await refetchSalesConfirmed();
//     },
//     "売上が確定しました。",
//     "売上の確定に失敗しました。もう一度お試しください。",
//     toast
//   );

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const isClosingConfirmed = salesConfirmedData?.isSalesConfirmed;

//   return (
//     <div className="bg-background text-foreground p-6 md:p-8 lg:p-10">
//       <div className="max-w-4xl mx-auto">
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-2xl font-bold">本日の売上</h1>
//           <div className="text-sm text-muted-foreground">{getTodayDate()}</div>
//         </div>
//         <div className="bg-card rounded-lg border border-gray-300 p-6 md:p-8 lg:p-10">
//           <TotalAmount totalAmount={totalAmount} totalOrders={totalOrders} />
//           <div className="mb-8">
//             <h2 className="text-lg font-medium mb-4">注文一覧</h2>
//             <DailyClosingOrderList
//               orders={orders}
//               currentPage={currentPage}
//               ordersPerPage={ordersPerPage}
//             />
//             <div className="mt-4">
//               <Pagination
//                 currentPage={currentPage}
//                 totalPages={totalPages}
//                 onPageChange={handlePageChange}
//               />
//             </div>
//           </div>
//           <div className="flex justify-end">
//             {!isClosingConfirmed ? (
//               <DailyClosingDialog
//                 totalAmount={totalAmount}
//                 totalOrders={totalOrders}
//                 onConfirm={handleSalesConfirmation}
//               />
//             ) : (
//               <div className="text-green-600 font-bold">
//                 売上が確定されました。
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import DailyClosingDialog from "@/components/DailyClosingDialog";
import DailyClosingOrderList from "@/components/DailyClosingOrderList";
import { ErrorMessage } from "@/components/layout/Error";
import { LoadingSpinner } from "@/components/layout/Loading";
import { Pagination } from "@/components/layout/Pagenation";
import MonthlySummary from "@/components/MonthlyReport";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useDailyClosing } from "@/hooks/useDailyClosing";
import { useOrder } from "@/hooks/useOrder";
import { withErrorHandling } from "@/lib/toast-utils";
import { getTodayDate } from "@/lib/utils";
import { useMemo, useState } from "react";

const OrderManagementSystem = () => {
  const { orders, getOrderLoading, getOrderError } = useOrder();

  const { createData, useIsSalesConfirmed } = useDailyClosing();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const today = useMemo(() => new Date().toISOString(), []); // メモ化して再レンダリング時に日付が変わらないようにする

  const {
    data: salesConfirmedData,
    loading: salesConfirmedLoading,
    error: salesConfirmedError,
    refetch: refetchSalesConfirmed,
  } = useIsSalesConfirmed(today);

  if (getOrderLoading || salesConfirmedLoading) return <LoadingSpinner />;
  if (getOrderError || salesConfirmedError) return <ErrorMessage />;

  const totalAmount = orders.reduce(
    (total, order) => total + order.totalAmount,
    0
  );
  const totalOrders = orders.length;
  const totalPages = Math.ceil(totalOrders / ordersPerPage);

  const handleSalesConfirmation = withErrorHandling(
    async () => {
      await createData(today, totalAmount, totalOrders);
      await refetchSalesConfirmed();
    },
    "売上が確定しました。",
    "売上の確定に失敗しました。もう一度お試しください。",
    toast
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const isClosingConfirmed = salesConfirmedData?.isSalesConfirmed;

  return (
    <Tabs defaultValue="daily" className="w-full">
      <TabsList>
        <TabsTrigger value="daily">日締め</TabsTrigger>
        <TabsTrigger value="monthly">月締め</TabsTrigger>
      </TabsList>

      <TabsContent value="daily">
        <div className="bg-background text-foreground p-6 md:p-8 lg:p-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">本日の売上</h1>
              <div className="text-sm text-muted-foreground">
                {getTodayDate()}
              </div>
            </div>
            <div className="bg-card rounded-lg border border-gray-300 p-6 md:p-8 lg:p-10">
              <TotalAmount
                totalAmount={totalAmount}
                totalOrders={totalOrders}
              />
              <div className="mb-8">
                <h2 className="text-lg font-medium mb-4">注文一覧</h2>
                <DailyClosingOrderList
                  orders={orders}
                  currentPage={currentPage}
                  ordersPerPage={ordersPerPage}
                />
                <div className="mt-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                {!isClosingConfirmed ? (
                  <DailyClosingDialog
                    totalAmount={totalAmount}
                    totalOrders={totalOrders}
                    onConfirm={handleSalesConfirmation}
                  />
                ) : (
                  <div className="text-green-600 font-bold">
                    売上が確定されました。
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="monthly">
        <MonthlySummary />
      </TabsContent>
    </Tabs>
  );
};

export default OrderManagementSystem;

// TotalAmountコンポーネント
function TotalAmount({
  totalAmount,
  totalOrders,
}: {
  totalAmount: number;
  totalOrders: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div>
        <h2 className="text-lg font-medium mb-2">売上金額</h2>
        <div className="text-4xl font-bold">
          ¥{totalAmount.toLocaleString()}
        </div>
      </div>
      <div>
        <h2 className="text-lg font-medium mb-2">注文数</h2>
        <div className="text-4xl font-bold">{totalOrders}件</div>
      </div>
    </div>
  );
}
