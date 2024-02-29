import {
  ResourceItem,
  Text,
  Avatar,
  Badge,
  BlockStack,
  InlineStack,
} from "@shopify/polaris";
import { Item } from "../../../../types";

interface Props {
  item: Item;
  onDeleteItem: (id: string) => void;
}

export function RowItem({ item, onDeleteItem }: Props) {
  const { name, location, isPrimary } = item;

  const handleDeleteButton = () => {
    onDeleteItem(item.id);
  };

  const shortcutActions = [
    {
      content: "Delete",
      destructive: true,
      onAction: handleDeleteButton,
    },
  ];
  const media = <Avatar customer size="md" name={name} />;

  return (
    <ResourceItem
      id={name}
      url="#"
      accessibilityLabel={name}
      persistActions
      media={media}
      shortcutActions={shortcutActions}
    >
      <BlockStack gap="200">
        <InlineStack gap="200">
          <Text variant="bodyMd" fontWeight="bold" as="h3">
            {name}
          </Text>
          {isPrimary && <Badge tone="info">Primary</Badge>}
        </InlineStack>
        <div>{location}</div>
      </BlockStack>
    </ResourceItem>
  );
}
