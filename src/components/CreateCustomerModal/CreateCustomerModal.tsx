import { useCallback } from "react";
import {
  Modal,
} from "@shopify/polaris";

interface CreateCustomerModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateCustomerModal(props: CreateCustomerModalProps) {
  const { open, onClose} = props;

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
        <div>
        </div>
      </Modal.Section>
    </Modal>
  );
}
