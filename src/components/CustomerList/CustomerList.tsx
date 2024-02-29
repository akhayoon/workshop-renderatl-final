import { useContext, useState, useCallback, ReactNode } from "react";
import { LegacyCard, ResourceList, TextField, Icon } from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
import { RowItem } from "./components/RowItem";
import { DeleteModal } from "./components/DeleteModal";
import ItemsContext from "../../context/ItemsContext";
import { ItemsState } from "../../types";
import iconWrapper from "../../utilities/iconWrapper";

interface CustomerListProps {
  onCannotDeletePrimary: () => void;
}

export function CustomerList({ onCannotDeletePrimary }: CustomerListProps) {
  const { items, removeItem } = useContext(ItemsContext) as ItemsState;
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const filterControl = (
    <TextField
      label=""
      placeholder="Filter customers"
      onChange={handleSearch}
      value={searchValue}
      autoComplete="off"
      prefix={<Icon source={iconWrapper(SearchIcon)} />}
    />
  );

  const handleDeleteClick = useCallback((id: string) => {
    setDeleteItemId(id);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteItemId) {
      const itemToDelete = items.find((item) => item.id === deleteItemId);

      itemToDelete?.isPrimary
        ? onCannotDeletePrimary()
        : removeItem(deleteItemId);
    }
    setDeleteItemId(null);
  }, [deleteItemId, removeItem]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteItemId(null);
  }, []);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <LegacyCard>
        <ResourceList
          resourceName={{ singular: "customer", plural: "customers" }}
          items={filteredItems}
          renderItem={(item) => (
            <RowItem
              item={item}
              onDeleteItem={handleDeleteClick}
              key={item.id}
            />
          )}
          filterControl={filterControl}
        />
      </LegacyCard>

      {deleteItemId && (
        <DeleteModal
          open={!!deleteItemId}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </>
  );
}
