import "@shopify/react-testing/matchers";

Object.defineProperty(window, "scroll", {
  value: jest.fn(),
  writable: true,
});
