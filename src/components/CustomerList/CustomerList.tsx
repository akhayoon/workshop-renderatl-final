import React, { useContext, useState, useCallback } from "react";
import { LegacyCard, ResourceList } from "@shopify/polaris";
import { RowItem } from "./components/RowItem";
import { DeleteModal } from "./components/DeleteModal";
import ItemsContext from "../../context/ItemsContext";
import { ItemsState } from "../../types";


interface Props {
  filterControl: React.ReactNode;
}

export function CustomerList({ filterControl }: Props) {
  const { items, removeItem } = useContext(ItemsContext) as ItemsState;;
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  const handleDeleteClick = useCallback((id: string) => {
    setDeleteItemId(id);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteItemId) {
      removeItem(deleteItemId); // Use removeItem from the context
    }
    setDeleteItemId(null);
  }, [deleteItemId, removeItem]); // Add removeItem to dependencies

  const handleDeleteCancel = useCallback(() => {
    setDeleteItemId(null);
  }, []);

  return (
    <>
      <LegacyCard>
        <ResourceList
          resourceName={{ singular: "customer", plural: "customers" }}
          items={items}
          renderItem={(item) => (
            <RowItem item={item} onDeleteItem={handleDeleteClick} key={item.id} />
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
