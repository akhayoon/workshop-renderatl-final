import "./styles.css";
import { useState, useCallback } from "react";
import {
  Layout,
  Page,
  FooterHelp,
  Banner,
  Link
} from "@shopify/polaris";
import { GlobeMajor } from "@shopify/polaris-icons";
import { CreateCustomerModal } from "./components/CreateCustomerModal";
import { CustomerList } from "./components/CustomerList";
import { ItemsProvider } from "./context/ItemsContext";
import iconWrapper from "./utilities/iconWrapper"

export default function App() {
  const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

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

  const handleBannerDismiss = () => {
    setShowBanner(false);
  };

  const handleCloseModal = useCallback(
    () => setShowCreateCustomerModal(false),
    [setShowCreateCustomerModal]
  );

  const handleCannotDeletePrimary = useCallback(() => {
    setShowBanner(true);
  }, []);

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
            <CustomerList onCannotDeletePrimary={handleCannotDeletePrimary} />
          </Layout.Section>

          <Layout.Section>
            <FooterHelp>
              For more details on Polaris, visit our{" "}
              <Link url="https://polaris.shopify.com">style guide</Link>.
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
