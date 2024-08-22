/**
 * v0 by Vercel.
 * @see https://v0.dev/t/jwmn1I9vIZq
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button";

export default function Component() {
  return (
    <div className="bg-background text-foreground p-6 md:p-8 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">本日の売上</h1>
          <div className="text-sm text-muted-foreground">2023年8月20日</div>
        </div>
        <div className="bg-card rounded-lg border border-gray-300 p-6 md:p-8 lg:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-lg font-medium mb-2">本日の売上合計</h2>
              <div className="text-4xl font-bold">¥345,678</div>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">注文一覧</h2>
            <div className="bg-muted rounded-lg p-4">
              <div className="grid grid-cols-[80px_1fr_100px] gap-4 border-b pb-4 mb-4 last:mb-0 last:border-b-0">
                <div className="text-muted-foreground text-sm">時間</div>
                <div className="text-muted-foreground text-sm">商品</div>
                <div className="text-muted-foreground text-sm text-right">
                  金額
                </div>
              </div>
              <div className="grid grid-cols-[80px_1fr_100px] gap-4 border-b pb-4 mb-4 last:mb-0 last:border-b-0">
                <div className="font-medium">11:00</div>
                <div>
                  <div>ラーメン x 2</div>
                  <div>餃子 x 1</div>
                </div>
                <div className="font-medium text-right">¥2,000</div>
              </div>
              <div className="grid grid-cols-[80px_1fr_100px] gap-4 border-b pb-4 mb-4 last:mb-0 last:border-b-0">
                <div className="font-medium">11:30</div>
                <div>
                  <div>焼き鳥 x 3</div>
                  <div>ビール x 2</div>
                </div>
                <div className="font-medium text-right">¥3,500</div>
              </div>
              <div className="grid grid-cols-[80px_1fr_100px] gap-4 border-b pb-4 mb-4 last:mb-0 last:border-b-0">
                <div className="font-medium">12:00</div>
                <div>
                  <div>カレー x 1</div>
                  <div>ソフトドリンク x 1</div>
                </div>
                <div className="font-medium text-right">¥1,200</div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">合計: ¥345,678</div>
            <div className="flex gap-4">
              <Button>売上確定</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
