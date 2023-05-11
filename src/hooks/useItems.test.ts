import { renderHook, act } from "@testing-library/react-hooks";
import { useItems, Item } from "./useItems";

describe("useItems", () => {
  let originalConsoleError: Console['error'];

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = () => {};
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it("adds and removes items correctly", () => {
    const { result } = renderHook(() => useItems());

    // Test initial state
    expect(result.current.items.length).toBe(2);

    // Test addItem
    const newItem: Item = {
      id: "300",
      isPrimary: false,
      url: "#",
      name: "Sally Ride",
      location: "Los Angeles, USA",
    };

    act(() => {
      result.current.addItem(newItem);
    });

    expect(result.current.items.length).toBe(3);
    expect(result.current.items[2]).toEqual(newItem);

    // Test removeItem
    act(() => {
      result.current.removeItem("200");
    });

    expect(result.current.items.length).toBe(2);
    expect(result.current.items.find((item) => item.id === "200")).toBeUndefined();
  });
});
