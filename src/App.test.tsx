import { Modal, Page, FooterHelp, Link} from "@shopify/polaris";
import type {MenuActionDescriptor} from '@shopify/polaris';

import mountWithPolaris from "./testHelper";
import App from './App';

describe("<App />", () => {
 it('renders a Page component', () => {
  const wrapper = mountWithPolaris(<App />);
  expect(wrapper).toContainReactComponent(Page)
 })
});

