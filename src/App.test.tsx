import { Modal, Page} from "@shopify/polaris";

import mountWithPolaris from "./testHelper";
import App from './App';

describe("<App />", () => {
  it("opens the CreateCustomerModal when the New Pixel button is clicked", () => {
    const wrapper = mountWithPolaris(
      <App />
    );

    wrapper.find(Page)!.triggerKeypath('primaryAction.onAction');

    expect(wrapper.find(Modal));
  });
});
