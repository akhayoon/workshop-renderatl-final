import { LegacyCard, ResourceList } from "@shopify/polaris";
import {RowItem} from "./RowItem/RowItem";

interface Props {
  items: Item[];
  filterControl: React.ReactNode;
  onDeleteItem: (id: string) => void;
}

interface Item {
  id: string;
  url: string;
  name: string;
  location: string;
}

export function CustomerList({ items, filterControl, onDeleteItem }: Props) {
  return (
    <LegacyCard>
      <ResourceList
        resourceName={{ singular: "customer", plural: "customers" }}
        items={items}
        renderItem={(item) => (
          <RowItem
            item={item}
            onDeleteItem={onDeleteItem}
            key={item.id}
          />
        )}
        filterControl={filterControl}
      />
    </LegacyCard>
  );
}
