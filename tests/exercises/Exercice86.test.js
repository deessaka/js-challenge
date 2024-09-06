// Exercice Exercice86
//
const spinWords = require("../exercices/Exercice86");

describe("Exercice86: spinWords", () => {
  it("should return 'Hey wollef sroirraw' for 'Hey fellow warriors'", () => {
    expect(spinWords("Hey fellow warriors")).toBe("Hey wollef sroirraw");
  });
  it("should return 'This is a test' for 'This is a test'", () => {
    expect(spinWords("This is a test")).toBe("This is a test");
  });
  it("should return 'This is rehtona test' for 'This is another test'", () => {
    expect(spinWords("This is another test")).toBe("This is rehtona test");
  });
});

