import { createContext, ReactNode } from "react";
import { useItems } from "../hooks/useItems";
import { ItemsState } from "../types";

const ItemsContext = createContext<ItemsState | null>(null);

interface ItemsProviderProps {
  children: ReactNode;
}

export const ItemsProvider: React.FC<ItemsProviderProps> = ({ children }) => {
  const itemsState = useItems();
  return (
    <ItemsContext.Provider value={itemsState}>{children}</ItemsContext.Provider>
  );
};

export default ItemsContext;
