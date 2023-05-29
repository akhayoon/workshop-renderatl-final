# workshop-renderatl
# Workshop Instructions

Welcome to the React Testing Workshop! In this session, we will walk you through setting up a project and learning how to test in React using Shopify's Polaris and React Testing libraries. Please follow the instructions below to set up your environment.

## Prerequisites

- Node.js and npm (or yarn) installed on your computer. If you don't have them installed, please follow the instructions on the [official Node.js website](https://nodejs.org/en/download/).

## Setup

### 1. Clone the repository

First, you need to clone the repository from GitHub. Make sure you clone the correct branch (`walkthrough`). You can do this by running the following command in your terminal or command prompt:

```bash
git clone -b walkthrough https://github.com/akhayoon/workshop-renderatl-final.git
```

### 2. Install dependencies

Navigate to the project directory and run the following command to install the required dependencies:

```bash
yarn install
```

## Running the project

To run the project, execute the following command in the project directory:

```bash
yarn start
```

This will start the development server. Open your browser and go to [http://localhost:3000](http://localhost:3000) to view the project.

## Running tests

To run tests, open a different terminal in the project directory and run the following command:

```bash
yarn test
```

Press `a` to run all tests.


## Testing Links

In this part of the workshop, we will learn how to test links in a React application. We will use two test cases as examples:

### Test Case 1: Redirect to Polaris style guide when clicking on footer

```typescript
it("redirect to Polaris style guide when clicking on footer", () => {
  const wrapper = mountWithPolaris(
    <App />
  );

  const footer = wrapper.find(FooterHelp);

  expect(footer?.find(Link)).toHaveReactProps({
    url: 'https://polaris.shopify.com',
  });
});
```

### Test Case 2: Open link in a new window when clicking on secondary actions

```typescript
it("opens link in new window when clicking on secondary actions", () => {
  const mockWindowOpen = jest.fn();
  window.open = mockWindowOpen;

  const spy = jest.spyOn(window, 'open');
  const wrapper = mountWithPolaris(
    <App />
  );

  const secondaryActions = wrapper
  .find(Page)!
  .prop('secondaryActions') as MenuActionDescriptor[];

  expect(secondaryActions).not.toBeNull();
  const getSupportLink = secondaryActions?.[0]

  window.open(getSupportLink.url, '_blank');
  const expectedUrl = 'https://apps.shopify.com/collections/pixels';

  expect(spy).toHaveBeenCalledWith(expectedUrl, '_blank');
});
```

In these test cases, we are using Jest and Shopify React Testing Library to test the behavior of links in our React application. The first test case checks if the footer link redirects to the Polaris style guide, while the second test case verifies that the secondary action link opens in a new window.





