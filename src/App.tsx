import React, { useState, useCallback } from "react";
import { Layout, Page, FooterHelp, Link } from "@shopify/polaris";
import { GlobeMajor } from "@shopify/polaris-icons";
import TinyMCEEditor from "./components/TinyMCEEditor";

export default function App() {
  return (
    <Page title="Polaris">
      <Layout>
        <Layout.Section>
          <TinyMCEEditor />
        </Layout.Section>

        <Layout.Section>
          <FooterHelp>
            For more details on Polaris, visit our{" "}
            <Link url="https://polaris.shopify.com">style guide</Link>.
          </FooterHelp>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
