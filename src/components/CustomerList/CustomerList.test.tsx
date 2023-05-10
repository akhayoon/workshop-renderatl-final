import {
  LegacyCard,
  ResourceList,
  Modal,
  Button,
  ResourceItem
} from "@shopify/polaris";
import mountWithPolaris from "../../testHelper";
import {RowItem} from "./components/RowItem/";
import {CustomerList} from "./CustomerList";

import { ItemsProvider } from "../../context/ItemsContext";
import {Item} from "../../hooks/useItems";

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

const defaultProps = {
  items: initialItems,
  filterControl: null,
  onDeleteItem: jest.fn(),
};

const mountComponentWithItemsProvider = (
  children: React.ReactElement,
) =>
  mountWithPolaris(
    <ItemsProvider>{children}</ItemsProvider>
  );

describe('<CustomerList />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without any errors', () => {
    const wrapper = mountComponentWithItemsProvider(<CustomerList filterControl={null} />);
    expect(wrapper).toContainReactComponent(LegacyCard);
    expect(wrapper).toContainReactComponent(ResourceList);

    const rowItems = wrapper.findAll(RowItem);
    expect(rowItems).toHaveLength(initialItems.length);
  });

  it("opens a modal when the delete button is clicked and removes the item from the list", async () => {
    const wrapper = mountComponentWithItemsProvider(<CustomerList filterControl={null} />);

    // Find the second (deletable) RowItem and its shortcutActions prop
    const firstRowItem = wrapper.findAll(ResourceItem)[1];
    wrapper.act(() => {
      firstRowItem?.triggerKeypath('shortcutActions[0].onAction');
    })

    wrapper.act(() => {
      wrapper.find(Modal)?.triggerKeypath('primaryAction.onAction')
    });

    const rowItems = wrapper.findAll(RowItem);
    expect(rowItems).toHaveLength(initialItems.length - 1);
  });

  // it('opens a modal when the delete button is clicked and removes the item from the list', () => {
  //   const wrapper = mountComponentWithItemsProvider(<CustomerList filterControl={null} />);

  //   // Find the first RowItem.
  //   const firstRowItem = wrapper.find(RowItem);
  //   const deleteButton = firstRowItem?.find(Button, { children: 'Delete' });

  //   // Click on the delete button.
  //   wrapper.act(() => {
  //     firstRowItem?.trigger('onDeleteItem');
  //   });

  //   /* USE THIS AS AN OPPORTUNITY TO DEBUG? */
  //   // firstRowItem?.find('button') vs firstRowItem?.find(Button)

  //   console.log(deleteButton);

  //   wrapper.find(Modal)!.triggerKeypath('primaryAction.onAction');
  //   // expect(defaultProps.onDeleteItem).toHaveBeenCalledTimes(1);

  //   // // Check that onDeleteItem function is called with specific id, and item deleted.
  //   // defaultProps.onDeleteItem.mock.calls[0][0](itemIdToDelete);
  //   // expect(defaultProps.onDeleteItem).toHaveBeenCalledWith(itemIdToDelete);

  //   const rowItems = wrapper.findAll(RowItem);
  //   expect(rowItems).toHaveLength(initialItems.length - 1);
  // });

  // it('displays the empty state when there are no items', () => {
  //   const wrapper = mountWithPolaris(<CustomerList {...defaultProps} dataTestId="customer-list" />);
  //   wrapper.setProps({ items: [] });

  //   expect(wrapper).toContainReactComponent(ResourceList, {
  //     resourceName: { singular: "customer", plural: "customers" },
  //     items: [],
  //   });
  // });

  // Add the setup for the search filtering test here.
});
