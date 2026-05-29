export const MAX_STOCK = 300;

export interface StockItem {
  quantity: number;
  units?: number;
}

export function itemUnits(item: StockItem) {
  return item.quantity * (item.units ?? 1);
}

export function totalUnits(items: StockItem[]) {
  return items.reduce((sum, item) => sum + itemUnits(item), 0);
}

export function remainingUnits(items: StockItem[]) {
  return Math.max(0, MAX_STOCK - totalUnits(items));
}
