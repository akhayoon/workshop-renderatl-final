import { Modal, Button, TextField, Page } from "@shopify/polaris";
import type {MenuActionDescriptor} from '@shopify/polaris';
import { ItemsProvider } from "./context/ItemsContext";
import {RowItem} from './components/CustomerList/components/RowItem';

import mountWithPolaris from "./testHelper";
import App from './App';

const mountComponentWithItemsProvider = (
  children: React.ReactElement,
) =>
  mountWithPolaris(
    <ItemsProvider>{children}</ItemsProvider>
  );

describe("<App />", () => {
  let originalConsoleError: Console['error'];

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = () => {};
  });

  afterEach(() => {
    console.error = originalConsoleError;
    jest.clearAllMocks();

  });

  it("opens the CreateCustomerModal when the New Pixel button is clicked", () => {
    const wrapper = mountWithPolaris(
      <App />
    );

    wrapper.find(Page)!.triggerKeypath('primaryAction.onAction');

    expect(wrapper.find(Modal)).toHaveReactProps({open: true});
  });

  it("creates new item in CustomerList after the CreateCustomerModal is submitted", () => {
    const wrapper = mountComponentWithItemsProvider(
      <App />
    );

    wrapper.act(() => {
      wrapper.find(Page)!.triggerKeypath('primaryAction.onAction');
    });

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

    const rowItems = wrapper.findAll(RowItem);
    expect(rowItems).toHaveLength(3);
  });

  it("opens link in new window when clicking on secondary actions", async () => {
    const spy = jest.spyOn(window, 'open');
    const wrapper = mountWithPolaris(
      <App />
    );

    const secondaryActions = wrapper
    .find(Page)!
    .prop('secondaryActions') as MenuActionDescriptor[];

  expect(secondaryActions).not.toBeNull();
  const getSupportLink = secondaryActions?.[0]

  window.open(getSupportLink.url, '_blank');
  const expectedUrl = 'https://apps.shopify.com/collections/pixels';

  expect(spy).toHaveBeenCalledWith(expectedUrl, '_blank');
  });
});
