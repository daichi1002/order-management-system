import { Menu } from "./menu"
import { Order } from "./order"

export interface OrderItem {
    id: number
    order: Order
    menu: Menu
    quantity: number
    price: number
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
}