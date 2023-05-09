export interface Item {
  id: string;
  isPrimary: boolean;
  url: string;
  name: string;
  location: string;
}

export interface ItemsState {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
}
