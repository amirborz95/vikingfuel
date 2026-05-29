'use client';

import { useEffect, useState } from 'react';

export interface InventoryState {
  remainingUnits: number;
  maxStock: number;
  soldUnits: number;
}

let cachedInventory: InventoryState | null = null;
let inventoryPromise: Promise<InventoryState | null> | null = null;

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryState | null>(cachedInventory);

  useEffect(() => {
    if (cachedInventory) {
      setInventory(cachedInventory);
      return;
    }

    if (!inventoryPromise) {
      inventoryPromise = fetch('/api/inventory')
        .then(async (response) => {
          if (!response.ok) {
            throw new Error('Failed to load inventory');
          }
          const data = (await response.json()) as InventoryState;
          cachedInventory = data;
          return data;
        })
        .catch(() => null);
    }

    inventoryPromise.then((data) => {
      if (data) {
        setInventory(data);
      }
    });
  }, []);

  return inventory;
}
