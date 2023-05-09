import "./styles.css";
import React, { useState, useCallback } from "react";
import {
  Layout,
  Page,
  FooterHelp,
  TextField,
  Icon,
  Banner,
} from "@shopify/polaris";
import { GlobeMajor, SearchMinor } from "@shopify/polaris-icons";
import { CreateCustomerModal } from "./components/CreateCustomerModal";
import { CustomerList } from "./components/CustomerList";
import { ItemsProvider } from "./context/ItemsContext";

const iconWrapper = (
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
) => {
  return () => <Icon />;
};

export default function App() {
  const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [showBanner, setShowBanner] = useState(true);

  const handleBannerDismiss = () => {
    setShowBanner(false);
  };

  const handleCloseModal = useCallback(
    () => setShowCreateCustomerModal(false),
    [setShowCreateCustomerModal]
  );

  const primaryAction = {
    content: "New Customer",
    onAction: () => setShowCreateCustomerModal(true),
  };

  const secondaryActions = [
    {
      content: "Explore",
      icon: iconWrapper(GlobeMajor),
      url: "https://apps.shopify.com/collections/pixels",
      external: true,
    },
  ];

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

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
    <ItemsProvider>
      <Page
        title="Polaris"
        primaryAction={primaryAction}
        secondaryActions={secondaryActions}
      >
        <Layout>
          <Layout.Section>
            {showBanner && (
              <Banner
                title="This record cannot be deleted"
                status="critical"
                onDismiss={handleBannerDismiss}
              >
                <p>Make sure you know how these changes affect your store.</p>
              </Banner>
            )}
          </Layout.Section>
          <Layout.Section>
            <CustomerList filterControl={filterControl} />
          </Layout.Section>

          <Layout.Section>
            <FooterHelp>
              For more details on Polaris, visit our{" "}
              <a href="https://polaris.shopify.com">style guide</a>.
            </FooterHelp>
          </Layout.Section>
        </Layout>

        <CreateCustomerModal
          open={showCreateCustomerModal}
          onClose={handleCloseModal}
        />
      </Page>
    </ItemsProvider>
  );
}
