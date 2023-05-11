import { ResourceItem, Text, Avatar, Badge, HorizontalStack } from "@shopify/polaris";
import {Item} from '../../../../types';

interface Props {
  item: Item;
  onDeleteItem: (id: string) => void
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
      <HorizontalStack wrap={false} gap="4">
        <Text variant="bodyMd" fontWeight="bold" as="h3">
          {name}
        </Text>
        {isPrimary && (
          <Badge status="info" progress="complete">
            Primary
          </Badge>
        )}
      </HorizontalStack>
      <div>{location}</div>
    </ResourceItem>
  );
}
