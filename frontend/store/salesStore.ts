import { create } from 'zustand'

interface TodaySalesState {
  sales: number
  orderCount: number
  addSale: (amount: number) => void
  subtractSale: (amount: number) => void
  incrementOrderCount: () => void
  decrementOrderCount: () => void
  resetDaily: () => void
}

export const useTodaySalesStore = create<TodaySalesState>((set) => ({
  sales: 0,
  orderCount: 0,
  addSale: (amount) => set((state) => ({ sales: state.sales + amount })),
  subtractSale: (amount) => set((state) => ({ sales: Math.max(0, state.sales - amount) })),
  incrementOrderCount: () => set((state) => ({ orderCount: state.orderCount + 1 })),
  decrementOrderCount: () => set((state) => ({ orderCount: Math.max(0, state.orderCount - 1) })),
  resetDaily: () => set({ sales: 0, orderCount: 0 }),
}))