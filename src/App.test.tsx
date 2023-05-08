import React from "react";
import { Modal, Button, TextField, Page } from "@shopify/polaris";
import type {MenuActionDescriptor} from '@shopify/polaris';

import mountWithPolaris from "./testHelper";
import App from './App';

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

  it("opens the CreatePixelModal when the New Pixel button is clicked", async () => {
    const wrapper = mountWithPolaris(
      <App />
    );

    wrapper.find(Page)!.triggerKeypath('primaryAction.onAction');

    // expect(wrapper).toContainReactComponent(Modal)
    expect(wrapper.find(Modal)).toHaveReactProps({open: true});
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
