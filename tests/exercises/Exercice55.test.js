// Exercice Exercice55

const { order } = require("../exercices/Exercice55");

describe("Exercice 55", () => {
  it('should return "Thi1s is2 3a T4est" for "is2 Thi1s T4est 3a"', () => {
    expect(order("is2 Thi1s T4est 3a")).toBe("Thi1s is2 3a T4est");
  });

  it('should return "Fo1r the2 g3ood 4of th5e pe6ople" for "4of Fo1r pe6ople g3ood th5e the2"', () => {
    expect(order("4of Fo1r pe6ople g3ood th5e the2")).toBe(
      "Fo1r the2 g3ood 4of th5e pe6ople",
    );
  });

  it('should return "" for ""', () => {
    expect(order("")).toBe("");
  });
});

