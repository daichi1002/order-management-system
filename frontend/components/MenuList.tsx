import { Menu } from "@/lib/graphql/graphql";

interface MenuListProps {
  menu: Menu[];
  addToOrder: (item: Menu) => void;
}

export const MenuList: React.FC<MenuListProps> = ({ menu, addToOrder }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">メニュー</h2>
    <ul className="grid grid-cols-4 gap-4">
      {menu.map((item) => (
        <li
          key={item.id}
          className={`bg-white rounded-lg shadow-md p-4 ${"cursor-pointer hover:bg-gray-100"}`}
          onClick={() => addToOrder && addToOrder(item)}
        >
          <h3 className="text-lg font-bold">{item.name}</h3>
          <p className="text-gray-500">¥{item.price}</p>
        </li>
      ))}
    </ul>
  </div>
);
