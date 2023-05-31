import type { RefObject } from "react";
import { useCallback, useContext } from "react";
import { Item, ItemsState } from "../../types";
import {
  Modal,
  TextField,
  Form,
  FormLayout,
  VerticalStack,
} from "@shopify/polaris";
import { useForm, useField, submitSuccess } from "@shopify/react-form";
import ItemsContext from "../../context/ItemsContext";

interface CreateCustomerModalProps {
  open: boolean;
  activator?: RefObject<HTMLElement>;
  onClose: () => void;
}

interface CustomError extends Error {
  message: string;
}

export function CreateCustomerModal(props: CreateCustomerModalProps) {
  const { open, onClose, activator } = props;
  const { addItem } = useContext(ItemsContext) as ItemsState;

  const { submit, fields, submitting, dirty, reset, submitErrors, makeClean } =
    useForm({
      fields: {
        name: useField(""),
        location: useField(""),
      },
      onSubmit: async () => {
        const { name, location } = fields;

        if (!name.value || !location.value) {
          return {
            status: "fail",
            errors: [{ message: "Please enter a value for both fields." }],
          };
        }

        try {
          const newItem: Item = {
            id: Date.now().toString(),
            isPrimary: false,
            url: "#",
            name: name.value,
            location: location.value,
          };

          addItem(newItem);
          closeModal();
          return submitSuccess();
        } catch (error) {
          const customError = error as CustomError;
          return {
            status: "fail",
            errors: [{ message: customError?.message }],
          };
        }
      },
    });

  const closeModal = useCallback(() => {
    if (submitting) return;

    onClose();
    reset();
  }, [submitting, onClose, reset, makeClean]);

  return (
    <Modal
      open={open}
      activator={activator}
      onClose={closeModal}
      title="Create a New Customer"
      primaryAction={{
        content: "Create",
        onAction: submit,
        loading: submitting,
        disabled: !dirty || !fields.name.value || !fields.location.value,
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: closeModal,
          disabled: submitting,
        },
      ]}
    >
      <Modal.Section>
        <div>
          <Form onSubmit={submit}>
            <FormLayout>
              <TextField label="Name" autoComplete="off" {...fields.name} />
              <TextField
                label="Location"
                autoComplete="off"
                {...fields.location}
              />
              {submitErrors.length > 0 && (
                <VerticalStack gap="3">
                  {submitErrors[0]?.message ?? "There was an error."}
                </VerticalStack>
              )}
            </FormLayout>
          </Form>
        </div>
      </Modal.Section>
    </Modal>
  );
}
