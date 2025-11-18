import { greet } from "./utils";

describe("greet function", () => {
  test("should return greeting with name", () => {
    const result = greet("World");
    expect(result).toBe("WORLD");
  });

  test("should handle empty string", () => {
    const result = greet("");
    expect(result).toBe("");
  });

  test("should handle special characters", () => {
    const result = greet("Тест");
    expect(result).toBe("ТЕСТ");
  });
});
