import { Modal, Button, TextField } from "@shopify/polaris";
import mountWithPolaris from "../../testHelper";

import {CreateCustomerModal} from "./CreateCustomerModal";
import { ItemsProvider } from "../../context/ItemsContext";
import { useItems } from "../../hooks/useItems";

jest.mock("../../hooks/useItems", () => ({
  ...jest.requireActual("../../hooks/useItems"),
  useItems: jest.fn()
}));


const mountComponentWithItemsProvider = (
  children: React.ReactElement,
) =>
  mountWithPolaris(
    <ItemsProvider>{children}</ItemsProvider>
  );

describe("<CreateCustomerModal />", () => {
  const defaultProps = {
    open: false,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    (useItems as jest.Mock).mockImplementation(() => ({ addItem: jest.fn() }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders a <Modal /> with the correct props", () => {
    const wrapper = mountComponentWithItemsProvider(<CreateCustomerModal {...defaultProps} open />);

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
    const wrapper = mountComponentWithItemsProvider(<CreateCustomerModal {...defaultProps} open />);

    wrapper.act(() => {
      wrapper
      .find(TextField, { label: "Name" })!
      .trigger("onChange", "New Customer");
    });

    wrapper.act(() => {
      wrapper
      .find(TextField, { label: "Location" })!
      .trigger("onChange", "New Location");
    });

    expect(wrapper).toContainReactComponent(Button, {
      children: "Create",
      disabled: false, // Button should be enabled when a name and location are entered
    });
  });

  it("calls the onClose function when the Cancel button is clicked", () => {
    const onClose = jest.fn();
    const wrapper = mountComponentWithItemsProvider(<CreateCustomerModal {...defaultProps} onClose={onClose} open />);

    wrapper.act(() => {
      wrapper
      wrapper.find(Button, { children: "Cancel" })!.trigger("onClick");
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls the onPixelCreate and onClose functions when the Create button is clicked", () => {
    const onClose = jest.fn();
    const addItemMock = jest.fn();

    // Update the mock implementation of useItems for this test case
    (useItems as jest.Mock).mockImplementation(() => ({ addItem: addItemMock }));
    const wrapper = mountComponentWithItemsProvider(<CreateCustomerModal {...defaultProps} onClose={onClose} open />);

    wrapper.act(() => {
      wrapper
      .find(TextField, { label: "Name" })!
      .trigger("onChange", "New Customer");
    });

    wrapper.act(() => {
      wrapper
      .find(TextField, { label: "Location" })!
      .trigger("onChange", "New Location");
    });

    wrapper.find(Button, { children: "Create" })!.trigger("onClick");

    expect(addItemMock).toHaveBeenCalledTimes(1);
    expect(addItemMock.mock.calls[0][0]).toMatchObject({
      isPrimary: false,
      url: "#",
      name: "New Customer",
      location: "New Location",
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
