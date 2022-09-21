import { testFunc } from "./sample";

describe("testFunc", () => {
  test("success /w normal call", () => {
    const result = testFunc(1, 2);

    expect(result).toBe(3);
  });
});
