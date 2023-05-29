import { mount } from "@shopify/react-testing";
import { PolarisTestProvider } from "@shopify/polaris";

const matchMediaPolyfill = (mediaQuery: any) => {
  return {
    media: mediaQuery,
    matches: false,
    addListener: () => {},
    removeListener: () => {},
  };
};

window.matchMedia = window.matchMedia || matchMediaPolyfill;

function mountWithPolaris(component:  JSX.Element) {
  return mount(<PolarisTestProvider>{component}</PolarisTestProvider>)
}
export default mountWithPolaris;


