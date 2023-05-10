import {
  LegacyCard,
  ResourceList,
  Modal,
  ResourceItem,
  TextField,
  EmptySearchResult
} from "@shopify/polaris";
import mountWithPolaris from "../../testHelper";
import {RowItem} from "./components/RowItem/";
import {CustomerList} from "./CustomerList";
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
    const wrapper = mountComponentWithItemsProvider(<CustomerList />);
    expect(wrapper).toContainReactComponent(LegacyCard);
    expect(wrapper).toContainReactComponent(ResourceList);

    const rowItems = wrapper.findAll(RowItem);
    expect(rowItems).toHaveLength(initialItems.length);
  });

  it("opens a modal when the delete button is clicked and removes the item from the list", async () => {
    const wrapper = mountComponentWithItemsProvider(<CustomerList />);

    // Find the second (deletable) RowItem and its shortcutActions prop
    /* USE THIS AS AN OPPORTUNITY TO DEBUG? */
    // wrapper.findAll(ResourceItem) vs wrapper.findAll(RowItem)
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

  it("filters the list of items based on the search query", async () => {
    const wrapper = mountComponentWithItemsProvider(
      <CustomerList />
    );

    const searchField = wrapper.find(TextField);
    wrapper.act(() => searchField?.trigger('onChange', 'Mae'));

    const rowItems = wrapper.findAll(RowItem);
    expect(rowItems).toHaveLength(1);
    expect(rowItems[0].props.item.name).toEqual("Mae Jemison");
  });

  it("shows empty results if no items found in serach", async () => {
    const wrapper = mountComponentWithItemsProvider(
      <CustomerList />
    );

    const searchField = wrapper.find(TextField);
    wrapper.act(() => searchField?.trigger('onChange', 'testing this'));

    const rowItems = wrapper.findAll(RowItem);
    expect(rowItems).toHaveLength(0);
    expect(wrapper).toContainReactComponent(EmptySearchResult)
  });
});
