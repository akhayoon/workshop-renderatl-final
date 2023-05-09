import {ResourceItem, Text, Avatar } from "@shopify/polaris";

export function RowItem({ item, onDeleteItem }: any) {
  const { name, location } = item;

  const handleDeleteButton = () => {
    onDeleteItem(item.id);
  };

  const shortcutActions = [{ content: "Delete", destructive: true, onAction: handleDeleteButton}]
  const media = <Avatar customer size="medium" name={name} />;

  return (
    <ResourceItem
      id={name}
      url="#"
      accessibilityLabel={name}
      persistActions
      media={media}
      shortcutActions={shortcutActions}
    >
      <Text variant="bodyMd" fontWeight="bold" as="h3">
        {name}
      </Text>
      <div>{location}</div>
    </ResourceItem>
  );
}
