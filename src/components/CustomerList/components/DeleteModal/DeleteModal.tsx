import { Modal, VerticalStack } from "@shopify/polaris";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteModal({ open, onClose, onConfirm }: Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete Item"
      primaryAction={{
        content: "Delete",
        destructive: true,
        onAction: onConfirm,
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: onClose,
        },
      ]}
    >
      <Modal.Section>
        <VerticalStack gap="5">
          <p>Are you sure you want to delete this item?</p>
        </VerticalStack>
      </Modal.Section>
    </Modal>
  );
}
