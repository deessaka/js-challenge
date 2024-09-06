// Exercice Exercice22

const isValidCreditCard = require("../exercices/Exercice22");

describe("Exercice 22", () => {
  it("should return true for a valid credit card", () => {
    expect(isValidCreditCard("02/21")).toBe(true);
    expect(isValidCreditCard("02/21")).toBe(true);
    expect(isValidCreditCard("02 2021")).toBe(true);
    expect(isValidCreditCard("02-2021")).toBe(true);
  });

  it("should return false for an invalid credit card", () => {
    expect(isValidCreditCard("02/20")).toBe(false);
    expect(isValidCreditCard("02/20")).toBe(false);
    expect(isValidCreditCard("03/21")).toBe(false);
    expect(isValidCreditCard("02-2020")).toBe(false);
  });
});

