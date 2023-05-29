# workshop-renderatl
# Workshop Instructions

Welcome to the React Testing Workshop! In this session, we will walk you through setting up a project and learning how to test in React using Shopify's Polaris and React Testing libraries. Please follow the instructions below to set up your environment.

## Prerequisites

- Node.js and npm (or yarn) installed on your computer. If you don't have them installed, please follow the instructions on the [official Node.js website](https://nodejs.org/en/download/).

## Setup

### 1. Clone the repository

First, you need to clone the repository from GitHub. Make sure you clone the correct branch (`walkthrough`). You can do this by running the following command in your terminal or command prompt:

```bash
git clone -b walkthrough https://github.com/akhayoon/workshop-renderatl-final.git
```

### 2. Install dependencies

Navigate to the project directory and run the following command to install the required dependencies:

```bash
yarn install
```

## Running the project

To run the project, execute the following command in the project directory:

```bash
yarn start
```

This will start the development server. Open your browser and go to [http://localhost:3000](http://localhost:3000) to view the project.

## Running tests

To run tests, open a different terminal in the project directory and run the following command:

```bash
yarn test
```

Press `a` to run all tests.


## Testing Links

In this part of the workshop, we will learn how to test links in a React application. We will use two test cases as examples:

### Test Case 1: Redirect to Polaris style guide when clicking on footer

```typescript
it("redirect to Polaris style guide when clicking on footer", () => {
  const wrapper = mountWithPolaris(
    <App />
  );

  const footer = wrapper.find(FooterHelp);

  expect(footer?.find(Link)).toHaveReactProps({
    url: 'https://polaris.shopify.com',
  });
});
```

### Test Case 2: Open link in a new window when clicking on secondary actions

```typescript
it("opens link in new window when clicking on secondary actions", () => {
  const mockWindowOpen = jest.fn();
  window.open = mockWindowOpen;

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
```

In these test cases, we are using Jest and Shopify's React Testing library to test the behavior of links in our React application. The first test case checks if the footer link redirects to the Polaris style guide, while the second test case verifies that the secondary action link opens in a new window.

## Testing Modals

In this part of the workshop, we will learn how to test modals in a React application. We will start with a test case for opening a modal when a button is clicked.

### Test Case: Open the CreateCustomerModal when the New Pixel button is clicked

Add the following test case to your `App.test.tsx` file:

```typescript
it("opens the CreateCustomerModal when the New Pixel button is clicked", () => {
  const wrapper = mountWithPolaris(
    <App />
  );

  wrapper.find(Page)!.triggerKeypath('primaryAction.onAction');

  expect(wrapper.find(Modal)).toHaveReactProps({open: true});
});
```

### Test Case 2: Check the modal is closed when cancel is clicked or the close button

Add the following test case to your `App.test.tsx` file:

```typescript
  it("closes the CreateCustomerModal when the New Pixel button is clicked and then closed using the secondary button", () => {
    const wrapper = mountWithPolaris(
      <App />
    );

    wrapper.find(Page)!.triggerKeypath('primaryAction.onAction');

    wrapper.act(() => {
      wrapper.find(Modal)?.triggerKeypath('secondaryActions[0].onAction');
    })

    expect(wrapper.find(Modal)).toHaveReactProps({open: false});
  });

  it("closes the CreateCustomerModal when the New Pixel button is clicked and then closed using the onClose button", () => {
    const wrapper = mountWithPolaris(
      <App />
    );

    wrapper.find(Page)!.triggerKeypath('primaryAction.onAction');

    wrapper.act(() => {
      wrapper.find(Modal)?.trigger('onClose');
    })

    expect(wrapper.find(Modal)).toHaveReactProps({open: false});
  });
```

## Testing CreateCustomerModal Component

In this part of the workshop, we will learn how to test the `CreateCustomerModal` component. This component is located in its own file called `CreateCustomerModal.test.tsx`. We will be using the `@shopify/react-form` library and testing a custom hook with a mock implementation that uses the provider.

### Basic Modal Tests

First, let's test the basic functionality of the modal component. Add the following test cases to your `CreateCustomerModal.test.tsx` file:

```typescript
import { Modal, Button, TextField } from "@shopify/polaris";
import mountWithPolaris from "../../testHelper";

import {CreateCustomerModal} from "./CreateCustomerModal";
import { ItemsProvider } from "../../context/ItemsContext";

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
});
```

These test cases check if the `Modal` component renders with the correct components and buttons. Not that entirely useful. But notice this code

```typescript
  import { ItemsProvider } from "../../context/ItemsContext";

  const mountComponentWithItemsProvider = (
    children: React.ReactElement,
  ) =>
  mountWithPolaris(
    <ItemsProvider>{children}</ItemsProvider>
  );
```

Since we need the React Context used in this component. We need to use that in our tests since the provider is on a higher level component.

### Testing that the form is working

Now, let's test that the form is working properly by adding 2 new tests cases

```typescript
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
```

```typescript
  it("calls the onClose function when the Cancel button is clicked", () => {
    const onClose = jest.fn();
    const wrapper = mountComponentWithItemsProvider(<CreateCustomerModal {...defaultProps} onClose={onClose} open />);

    wrapper.act(() => {
      wrapper
      wrapper.find(Button, { children: "Cancel" })!.trigger("onClick");
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
```

### Testing that requires mocking a hook

First add the following imports and starter code

```typescript
import { useItems } from "../../hooks/useItems";

jest.mock("../../hooks/useItems", () => ({
  ...jest.requireActual("../../hooks/useItems"),
  useItems: jest.fn()
}));
```

Now add this code inside the describe block
```typescript
  beforeEach(() => {
    (useItems as jest.Mock).mockImplementation(() => ({ addItem: jest.fn() }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
```

Now add the following test case

```typescript
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
```






