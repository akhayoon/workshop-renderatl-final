import { useState, useCallback } from "react";

export interface Item {
  id: string;
  isPrimary: boolean;
  url: string;
  name: string;
  location: string;
}

const initialItems: Item[] = [
  {
    id: "100",
    isPrimary: true,
    url: "#",
    name: "Mae Jemison",
    location: "Decatur, USA",
  },
  {
    id: "200",
    isPrimary: false,
    url: "#",
    name: "Ellen Ochoa",
    location: "Los Angeles, USA",
  },
];

export const useItems = () => {
  const [items, setItems] = useState(initialItems);

  const addItem = useCallback((item: Item) => {
    setItems((prevItems: Item[]): Item[] => [...prevItems, item]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }, []);

  return {
    items,
    setItems,
    addItem,
    removeItem,
  };
};
