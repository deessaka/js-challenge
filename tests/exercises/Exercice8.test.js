// Exercice Exercice8

const calculateTip = require("../exercices/Exercice8");

describe("Exercice 8", () => {
  it("pourboire", () => {
    expect(calculateTip(20, "ExcellEnt")).toBe(4);
    expect(calculateTip(26.95, "goOd")).toBe(3);
    expect(calculateTip(20, "hi")).toBe("Rating not recognised");
  });
});

