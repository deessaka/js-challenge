// Exercice Exercice80
//
const { encode } = require("../exercices/Exercice80");

describe("Exercice 80", () => {
  it("should return '(((' for 'din'", () => {
    expect(encode("din")).toBe("(((");
  });

  it("should return '()()()' for 'recede'", () => {
    expect(encode("recede")).toBe("(())()");
  });

  it("should return ')())())' for 'Success'", () => {
    expect(encode("Success")).toBe(")())()");
  });

  it("should return '))((' for '( @'", () => {
    expect(encode("( @")).toBe("))((");
  });
});

