import Link from "next/link";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Header = () => {
  return (
    <header className="flex items-center h-16 px-6 border-b bg-card">
      <nav className="flex items-center gap-6 text-lg font-medium">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold"
          prefetch={false}
        >
          {/* <MenuIcon className="w-6 h-6" /> */}
          <span>ひなたぼっこ</span>
        </Link>
        {/* <Link href="/" className="text-primary-foreground" prefetch={false}>
          ダッシュボード
        </Link> */}
        <Link href="/orders" className="text-muted-foreground" prefetch={false}>
          注文
        </Link>
        <Link
          href="/order-list"
          className="text-muted-foreground"
          prefetch={false}
        >
          注文履歴
        </Link>
        <Link href="/sales" className="text-muted-foreground" prefetch={false}>
          売上管理
        </Link>
      </nav>
      <div className="ml-auto flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <img
                src="/placeholder-user.jpg"
                width={36}
                height={36}
                alt="アバター"
                className="rounded-full"
                style={{ aspectRatio: "36/36", objectFit: "cover" }}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>管理者</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>設定</DropdownMenuItem>
            <DropdownMenuItem>サポート</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>ログアウト</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
