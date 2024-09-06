// Exercice Exercice49
//
const mobileKeyboard = require("../Exercice49");

describe("mobileKeyboard", () => {
  it("should return the number of keys", () => {
    expect(mobileKeyboard("123")).toEqual(3);
    expect(mobileKeyboard("abc")).toEqual(9);
    expect(mobileKeyboard("codewars")).toEqual(26);
  });
});

