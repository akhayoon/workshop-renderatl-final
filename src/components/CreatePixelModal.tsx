import React, { useCallback } from "react";
import {
  Modal,
  TextField,
  Form,
  FormLayout,
  TextContainer,
} from "@shopify/polaris";
import { useForm, useField, submitSuccess } from "@shopify/react-form";

interface CreatePixelModalProps {
  open: boolean;
  onClose: () => void;
  onPixelCreate: (name: string, location: string) => void;
}

export default function CreatePixelModal(props: CreatePixelModalProps) {
  const { open, onClose, onPixelCreate } = props;

  const { submit, fields, submitting, dirty, reset, submitErrors } = useForm({
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
        onPixelCreate(name.value, location.value);
        closeModal();
        return submitSuccess();
      } catch (error: any) {
        return {
          status: "fail",
          errors: [{ message: error.message }],
        };
      }
    },
  });

  const closeModal = useCallback(() => {
    if (submitting) return;

    onClose();
    reset();
  }, [submitting, onClose, reset]);

  return (
    <Modal
      open={open}
      onClose={closeModal}
      title="Create a New Pixel"
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
              <TextField
                label="Pixel Name"
                autoComplete="off"
                {...fields.name}
              />
              <TextField
                label="Pixel Location"
                autoComplete="off"
                {...fields.location}
              />
              {submitErrors && (
                <TextContainer>
                  {submitErrors[0]?.message ?? "There was an error."}
                </TextContainer>
              )}
            </FormLayout>
          </Form>
        </div>
      </Modal.Section>
    </Modal>
  );
}
