import { Modal, Button } from "@shopify/polaris";
import mountWithPolaris from "../../../../testHelper";
import { DeleteModal } from "./DeleteModal";

describe("<DeleteModal />", () => {
  const defaultProps = {
    open: false,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("calls the onClose function when the Cancel button is clicked", () => {
    const onClose = jest.fn();
    const wrapper = mountWithPolaris(
      <DeleteModal {...defaultProps} onClose={onClose} open />
    );

    wrapper.find(Button, { children: "Cancel" })!.trigger("onClick");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls the onConfirm function when the Delete button is clicked", () => {
    const onConfirm = jest.fn();
    const wrapper = mountWithPolaris(
      <DeleteModal {...defaultProps} onConfirm={onConfirm} open />
    );

    wrapper.find(Button, { children: "Delete" })!.trigger("onClick");
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls the onClose function when the Modal is closed", () => {
    const onClose = jest.fn();
    const wrapper = mountWithPolaris(
      <DeleteModal {...defaultProps} onClose={onClose} open />
    );

    wrapper.find(Modal)!.trigger("onClose");
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
