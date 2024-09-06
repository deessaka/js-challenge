// Exercice Exercice87
//
const shoppingListCost = require("../exercices/Exercice87");

describe("Exercice87: shoppingListCost", () => {
  it("should return 73.25 for [['Chocolate', 3],['Apples', 8],['Orange Juice', 15],['Pears',1]]", () => {
    expect(
      shoppingListCost([
        ["Chocolate", 3],
        ["Apples", 8],
        ["Orange Juice", 15],
        ["Pears", 1],
      ]),
    ).toBe(73.25);
  });
  it("should return 55.2 for [['Sweetcorn', 12],['Pears', 6],['Apples', 5]]", () => {
    expect(
      shoppingListCost([
        ["Sweetcorn", 12],
        ["Pears", 6],
        ["Apples", 5],
      ]),
    ).toBe(55.2);
  });
  it("should return 98.4 for [['Pears', 4],['Chocolate', 87],['Sweetcorn', 3]]", () => {
    expect(
      shoppingListCost([
        ["Pears", 4],
        ["Chocolate", 87],
        ["Sweetcorn", 3],
      ]),
    ).toBe(98.4);
  });
  it("should return 135 for [['Orange Juice', 100]]", () => {
    expect(shoppingListCost([["Orange Juice", 100]])).toBe(135);
  });
});

