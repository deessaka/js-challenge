// Exercice Exercice68
//
const { like } = require("../exercices/Exercice68");

describe("Exercice 68", () => {
  it("should return 'no one likes this' for []", () => {
    expect(like([])).toBe("no one likes this");
  });

  it("should return 'Peter likes this' for ['Peter']", () => {
    expect(like(["Peter"])).toBe("Peter likes this");
  });

  it("should return 'Jacob and Alex like this' for ['Jacob', 'Alex']", () => {
    expect(like(["Jacob", "Alex"])).toBe("Jacob and Alex like this");
  });

  it("should return 'Max, John and Mark like this' for ['Max', 'John', 'Mark']", () => {
    expect(like(["Max", "John", "Mark"])).toBe("Max, John and Mark like this");
  });

  it("should return 'Alex, Jacob and 2 others like this' for ['Alex', 'Jacob', 'Mark', 'Max']", () => {
    expect(like(["Alex", "Jacob", "Mark", "Max"])).toBe(
      "Alex, Jacob and 2 others like this",
    );
  });
});

