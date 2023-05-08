import "./styles.css";
import React, { useState, useCallback } from "react";
import {
  Layout,
  Page,
  FooterHelp,
  TextField,
  Icon,
  ResourceList,
} from "@shopify/polaris";
import { GlobeMajor, SearchMinor } from "@shopify/polaris-icons";
import CreatePixelModal from "./components/CreatePixelModal";
import RowItem from "./components/RowItem";

const iconWrapper = (
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
) => {
  return () => <Icon />;
};

const initialItems = [
  {
    id: "100",
    url: "#",
    name: "Mae Jemison",
    location: "Decatur, USA",
  },
  {
    id: "200",
    url: "#",
    name: "Ellen Ochoa",
    location: "Los Angeles, USA",
  },
];

export default function App() {
  const [showCreatePixelModal, setShowCreatePixelModal] = useState(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [items, setItems] = useState(initialItems);

  const handleCloseModal = useCallback(
    () => setShowCreatePixelModal(false),
    [setShowCreatePixelModal]
  );

  const primaryAction = {
    content: "New Pixel",
    onAction: () => setShowCreatePixelModal(true),
  };

  const secondaryActions = [
    {
      content: "Explore",
      icon: iconWrapper(GlobeMajor),
      url: "https://apps.shopify.com/collections/pixels",
      external: true,
    },
  ];

  const handlePixelCreate = useCallback(
    (name: string, location: string) => {
      const id = Math.max(...items.map((item) => +item.id)) + 1;
      const newPixel = {
        id: id.toString(),
        url: "#",
        name: name,
        location: location,
      };
      setItems((items) => [...items, newPixel]);
      handleCloseModal();
    },
    [handleCloseModal, items]
  );

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
    const filteredItems = initialItems.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setItems(filteredItems);
  }, [initialItems]);

  const handleDelete = useCallback(
    (id: string) => {
      setItems((items) => items.filter((item) => item.id !== id));
    },
    [items]
  );

  const filterControl = (
    <TextField
      label=""
      placeholder="Filter customers"
      onChange={handleSearch}
      value={searchValue}
      autoComplete="off"
      prefix={<Icon source={SearchMinor as any} />}
    />
  );

  return (
    <Page
      title="Polaris"
      primaryAction={primaryAction}
      secondaryActions={secondaryActions}
    >
      <Layout>
        <Layout.Section>
          <ResourceList
            resourceName={{ singular: "customer", plural: "customers" }}
            items={items}
            renderItem={(item) => (
              <RowItem item={item} onDeleteItem={handleDelete} />
            )}
            filterControl={filterControl}
          />
        </Layout.Section>

        <Layout.Section>
          <FooterHelp>
            For more details on Polaris, visit our{" "}
            <a href="https://polaris.shopify.com">style guide</a>.
          </FooterHelp>
        </Layout.Section>
      </Layout>

      <CreatePixelModal
        open={showCreatePixelModal}
        onClose={handleCloseModal}
        onPixelCreate={handlePixelCreate}
      />
    </Page>
  );
}
