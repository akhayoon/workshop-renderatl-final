# React Testing Workshop Instructions

Welcome to the React Testing Workshop! In this session, we will walk you through setting up a project and learning how to test in React using Shopify's Polaris and React Testing libraries. Please follow the instructions below to set up your environment.

## Prerequisites

- Node.js and npm (or yarn) installed on your computer. If you don't have them installed, please follow the instructions on the [official Node.js website](https://nodejs.org/en/download/).

## Setup

### 1. Clone the repository

First, you need to clone the repository from GitHub

```bash
git clone https://github.com/akhayoon/workshop-renderatl-final.git
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

In this part of the workshop, we will learn how to test the `CreateCustomerModal` component. This component is located in its own file called `CreateCustomerModal`. We will be using the `@shopify/react-form` library and testing a custom hook with a mock implementation that uses the provider.

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

The line `expect(addItemMock.mock.calls[0][0]).toMatchObject({` is an assertion that checks if the addItemMock function was called with the expected object. The addItemMock.mock.calls property is an array that contains all the calls made to the addItemMock function. Each element in the array is another array that contains the arguments passed to the function during that specific call.

In this case, we are interested in the first call to the addItemMock function, so we access it using `addItemMock.mock.calls[0]`. Since we want to check the first argument passed to the function during this call, we use [0] again to access it.

Finally, we use the toMatchObject Jest matcher to compare the actual argument with the expected object. If the actual argument contains all the properties and values specified in the expected object, the test will pass.

### Going back to App.test.tsx to test full scenarios of the modal

Now we're going to test that closing the modal or submitting creates our desired behaviour

First let's add this test inside `App.test.tsx`

Make sure to import `TextField` from polaris

```typescript
 it("opening the CreateCustomerModal, filling in the info and closing the modal resets it", () => {
    const wrapper = mountWithPolaris(
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

    wrapper.act(() => {
      wrapper.find(Modal)!.triggerKeypath('secondaryActions[0].onAction');
    });

    wrapper.act(() => {
      wrapper.find(Page)!.triggerKeypath('primaryAction.onAction');
    });

    // Check that text fields are empty
    expect(
      wrapper.find(TextField, { label: "Name" })!.prop("value")
    ).toBe("");
    expect(
      wrapper.find(TextField, { label: "Location" })!.prop("value")
    ).toBe("");
  });
```

Next, let's make sure that submitting the form with proper data adds a new row

Before you add the test case below, let's make sure we have all the imports and setup necessary

```typescript
import { Modal, Page, FooterHelp, Link, TextField, Button} from "@shopify/polaris";

import { ItemsProvider } from "./context/ItemsContext";
import {RowItem} from './components/CustomerList/components/RowItem';

const mountComponentWithItemsProvider = (
  children: React.ReactElement,
) =>
  mountWithPolaris(
    <ItemsProvider>{children}</ItemsProvider>
  );
```

Now add the following test case

```typescript
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
```



## Testing CustomerList Component

In this part of the workshop, we will learn how to test the `CustomerList` component. This component is located in its own file called `CustomerList.tsx`. It uses a Polaris component called a `ResourceList` to give us a simpler table like capability

### Testing with mock data

```typescript
import {
  ResourceList,
  Modal,
  ResourceItem,
  TextField,
  EmptySearchResult,
} from "@shopify/polaris";
import mountWithPolaris from "../../testHelper";
import { RowItem } from "./components/RowItem/";
import { CustomerList } from "./CustomerList";
import { ItemsProvider } from "../../context/ItemsContext";

const initialItems = [
  {
    id: "100",
    isPrimary: true,
    url: "#",
    name: "Mae Jemison",
    location: "Decatur, USA",
  },
  {
    id: "200",
    isPrimary: false,
    url: "#",
    name: "Ellen Ochoa",
    location: "Los Angeles, USA",
  },
];

const mountComponentWithItemsProvider = (children: React.ReactElement) =>
  mountWithPolaris(<ItemsProvider>{children}</ItemsProvider>);

describe("<CustomerList />", () => {
  const defaultProps = {
    onCannotDeletePrimary: () => {}
  };

  it("renders ResourceList with as many rows as our mock data provides", () => {
    const wrapper = mountComponentWithItemsProvider(<CustomerList {...defaultProps} />);
    expect(wrapper).toContainReactComponent(ResourceList);

    const rowItems = wrapper.findAll(RowItem);
    expect(rowItems).toHaveLength(initialItems.length);
  });
});
```

### Testing the delete functionality

Let's make sure our delete button is working. We can't delete the first item, but let's make sure the delete itself works without
worrying about any edge cases yet

```typescript
  it("opens a modal when the delete button is clicked and removes the item from the list", async () => {
    const wrapper = mountComponentWithItemsProvider(<CustomerList {...defaultProps} />);

    const firstRowItem = wrapper.findAll(RowItem)[1];
    wrapper.act(() => {
      firstRowItem?.triggerKeypath("shortcutActions[0].onAction");
    });

    wrapper.act(() => {
      wrapper.find(Modal)?.triggerKeypath("primaryAction.onAction");
    });

    const rowItems = wrapper.findAll(RowItem);
    expect(rowItems).toHaveLength(initialItems.length - 1);
  });
```

Notice how this didn't work. Let's use the `debug()` function to help us see why.

Let's add it under the variable firstRowItem

```typescript
  const firstRowItem = wrapper.findAll(RowItem)[1];
  console.log(firstRowItem.debug());
```

The results of this tree make it a bit more clear why this is not working

```typescript
<RowItem item={{"id": "200", "isPrimary": false, "location": "Los Angeles, USA", "name": "Ellen Ochoa", "url": "#"}} onDeleteItem={[Function anonymous]}>
  <ResourceItem id="Ellen Ochoa" url="#" accessibilityLabel="Ellen Ochoa" persistActions media={<Avatar customer={true} name="Ellen Ochoa" size="medium" />} shortcutActions={[{"content": "Delete", "destructive": true, "onAction": [Function handleDeleteButton]}]}>
```

We need to be explicit here on what component has the `shortCutActions` key path that we can trigger. And here it shows that it's not on the `<RowItem />` component, but on the `<ResourceItem />` itself!

Replace the following line
```typescript
const firstRowItem = wrapper.findAll(RowItem)[1];
```

with this line and you should see all green again!
with
```typescript
const firstRowItem = wrapper.findAll(ResourceItem)[1];
```

## Testing the search functionality

### Testing simlple filtering
The search here is a simple filter. So let's add the following test case

```typescript
  it("filters the list of items based on the search query", async () => {
    const wrapper = mountComponentWithItemsProvider(<CustomerList {...defaultProps} />);

    const searchField = wrapper.find(TextField);
    wrapper.act(() => searchField?.trigger("onChange", "Mae"));

    const rowItems = wrapper.findAll(RowItem);
    expect(rowItems).toHaveLength(1);
    expect(rowItems[0].props.item.name).toEqual("Mae Jemison");
  });
```

You can see here that we're expecting only a specific row to show, which are the results.

### Testing the empty state

```typescript
  it("shows empty results if no items found in serach", async () => {
    const wrapper = mountComponentWithItemsProvider(<CustomerList {...defaultProps} />);

    const searchField = wrapper.find(TextField);
    wrapper.act(() => searchField?.trigger("onChange", "testing this"));

    const rowItems = wrapper.findAll(RowItem);
    expect(rowItems).toHaveLength(0);
    expect(wrapper).toContainReactComponent(EmptySearchResult);
  });
```

## Let's test our hook

### Testing the functionality of a hook

Before you copy over this code, note how we test the hook in isolation using renderHook. This way, we don't need to render a component to test it.

But because we're using `@testing-library/react-hooks` for demonstration purposes, we have to silence a console.error regarding a React version mismatch

```typescript
import { renderHook, act } from "@testing-library/react-hooks";
import { useItems, Item } from "./useItems";

describe("useItems", () => {
  let originalConsoleError: Console['error'];

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = () => {};
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it("adds and removes items correctly", () => {
    const { result } = renderHook(() => useItems());

    // Test initial state
    expect(result.current.items.length).toBe(2);

    // Test addItem
    const newItem: Item = {
      id: "300",
      isPrimary: false,
      url: "#",
      name: "Sally Ride",
      location: "Los Angeles, USA",
    };

    act(() => {
      result.current.addItem(newItem);
    });

    expect(result.current.items.length).toBe(3);
    expect(result.current.items[2]).toEqual(newItem);

    // Test removeItem
    act(() => {
      result.current.removeItem("200");
    });

    expect(result.current.items.length).toBe(2);
    expect(result.current.items.find((item) => item.id === "200")).toBeUndefined();
  });
});
```

## For completion, let's test the DeleteModal component

let's add a file called `DeleteModal.test.tsx` and add the following code

```typescript
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
```

## Let's test RowItem similary

Create a file called `RowItem.test.tsx`

```typescript
import { Badge, ResourceItem } from "@shopify/polaris";
import mountWithPolaris from "../../../../testHelper";
import { RowItem } from "./RowItem";

const customerItem = {
  id: "100",
  isPrimary: true,
  url: "#",
  name: "Mae Jemison",
  location: "Decatur, USA",
};

describe("<RowItem />", () => {
  const defaultProps = {
    item: customerItem,
    onDeleteItem: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDeleteItem = jest.fn();

    const wrapper = mountWithPolaris(
      <RowItem {...defaultProps} onDeleteItem={onDeleteItem} />
    );

    wrapper.act(() => {
      wrapper.find(ResourceItem)?.triggerKeypath("shortcutActions[0].onAction");
    });

    expect(onDeleteItem).toHaveBeenCalled()
  });

  it("renders a page when customer isPrimary", () => {
    const wrapper = mountWithPolaris(
      <RowItem {...defaultProps} />
    );

    expect(wrapper).toContainReactComponent(Badge);
  });
});
```
