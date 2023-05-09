import { Modal, Button, TextField } from "@shopify/polaris";
import mountWithPolaris from "../../testHelper";

import {CreateCustomerModal} from "./CreateCustomerModal";

describe("<CreateCustomerModal />", () => {
  const defaultProps = {
    open: false,
    onClose: jest.fn(),
    onPixelCreate: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders a <Modal /> with the correct props", () => {
    const wrapper = mountWithPolaris(
      <CreateCustomerModal {...defaultProps} open />
    );

    expect(wrapper).toContainReactComponent(Modal, {
      title: "Create a New Customer",
    });

    expect(wrapper).toContainReactComponent(Button, {
      children: "Create",
      disabled: true, // Button should be disabled if no name or location is entered
    });

    expect(wrapper).toContainReactComponent(Button, {
      children: "Cancel",
    });

    expect(wrapper).toContainReactComponent(TextField, {
      label: "Name",
    });

    expect(wrapper).toContainReactComponent(TextField, {
      label: "Location",
    });
  });

  it("enables the Create button when a name and location are entered", () => {
    const wrapper = mountWithPolaris(
      <CreateCustomerModal {...defaultProps} open />
    );

    wrapper
      .find(TextField, { label: "Name" })!
      .trigger("onChange", "New Customer");

    wrapper
      .find(TextField, { label: "Location" })!
      .trigger("onChange", "New Location");

    expect(wrapper).toContainReactComponent(Button, {
      children: "Create",
      disabled: false, // Button should be enabled when a name and location are entered
    });
  });

  it("calls the onClose function when the Cancel button is clicked", () => {
    const onClose = jest.fn();
    const wrapper = mountWithPolaris(
      <CreateCustomerModal {...defaultProps} onClose={onClose} open />
    );

    wrapper.find(Button, { children: "Cancel" })!.trigger("onClick");

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls the onPixelCreate and onClose functions when the Create button is clicked", () => {
    const onClose = jest.fn();
    const onPixelCreate = jest.fn();
    const wrapper = mountWithPolaris(
      <CreateCustomerModal
        {...defaultProps}
        onClose={onClose}
        onPixelCreate={onPixelCreate}
        open
      />
    );

    wrapper
      .find(TextField, { label: "Name" })!
      .trigger("onChange", "New Customer");

    wrapper
      .find(TextField, { label: "Location" })!
      .trigger("onChange", "New Location");

    wrapper.find(Button, { children: "Create" })!.trigger("onClick");

    expect(onPixelCreate).toHaveBeenCalledTimes(1);
    expect(onPixelCreate).toHaveBeenCalledWith("New Customer", "New Location");
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
