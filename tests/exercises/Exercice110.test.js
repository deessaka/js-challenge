// Exercice Exercice110
const cutCancerCells = require("../exercices/Exercice110");

describe("Exercice 110", () => {
  it("should return the correct result", () => {
    const result = cutCancerCells("acb");
    expect(result).toEqual("ab");
  });

  it("should return the correct result", () => {
    const result = cutCancerCells("aCb");
    expect(result).toEqual("");
  });

  it("should return the correct result", () => {
    const result = cutCancerCells("acCb");
    expect(result).toEqual("a");
  });

  it("should return the correct result", () => {
    const result = cutCancerCells("acCcb");
    expect(result).toEqual("ab");
  });

  it("should return the correct result", () => {
    const result = cutCancerCells("ab");
    expect(result).toEqual("ab");
  });

  it("should return the correct result", () => {
    const result = cutCancerCells("aCZ");
    expect(result).toEqual("Z");
  });

  it("should return the correct result", () => {
    const result = cutCancerCells("BCE");
    expect(result).toEqual("BE");
  });

  it("should return the correct result", () => {
    const result = cutCancerCells("sjCmwOqC");
    expect(result).toEqual("swO");
  });
});

