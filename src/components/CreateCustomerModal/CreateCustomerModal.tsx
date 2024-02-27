import { useCallback } from "react";
import { Modal, TextField } from "@shopify/polaris";

interface CreateCustomerModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateCustomerModal(props: CreateCustomerModalProps) {
  const { open, onClose } = props;

  const closeModal = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Modal
      open={open}
      onClose={closeModal}
      title="Create a New Customer"
      primaryAction={{
        content: "Create",
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: closeModal,
        },
      ]}
    >
      <Modal.Section>
        <TextField label="Name" autoComplete="off" />
      </Modal.Section>
    </Modal>
  );
}
