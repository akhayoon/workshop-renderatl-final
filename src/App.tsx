import "./styles.css";
import { useState, useCallback } from "react";
import {
  Layout,
  Page,
  FooterHelp,
  LegacyCard,
  Text,
} from "@shopify/polaris";
import { CreateCustomerModal } from "./components/CreateCustomerModal";

export default function App() {
  const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false);

  const primaryAction = {
    content: "New Customer",
    onAction: () => setShowCreateCustomerModal(true),
  };

  const secondaryActions = [
    {
      content: "Explore",
      url: "https://apps.shopify.com/collections/pixels",
      external: true,
    },
  ];

  const handleCloseModal = useCallback(
    () => setShowCreateCustomerModal(false),
    [setShowCreateCustomerModal]
  );

  return (
    <Page
      title="Polaris"
      primaryAction={primaryAction}
      secondaryActions={secondaryActions}
    >
      <Layout>
        <Layout.Section>
          <LegacyCard title="Online store dashboard" sectioned>
            <p>View a summary of your online store’s performance.</p>
          </LegacyCard>
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
  );
}
