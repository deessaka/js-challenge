// Exercice Exercice74
//
const { typist } = require("../exercices/Exercice74");

describe("Exercice 74", () => {
  it("should return 1 for 'a'", () => {
    expect(typist("a")).toBe(1);
  });

  it("should return 2 for 'aa'", () => {
    expect(typist("aa")).toBe(2);
  });

  it("should return 2 for 'A'", () => {
    expect(typist("A")).toBe(2);
  });

  it("should return 3 for 'AA'", () => {
    expect(typist("AA")).toBe(3);
  });

  it("should return 3 for 'aA'", () => {
    expect(typist("aA")).toBe(3);
  });

  it("should return 4 for 'Aa'", () => {
    expect(typist("Aa")).toBe(4);
  });

  it("should return 31 for 'BeiJingDaXueDongMen'", () => {
    expect(typist("BeiJingDaXueDongMen")).toBe(31);
  });

  it("should return 21 for 'AAAaaaBBBbbbABAB'", () => {
    expect(typist("AAAaaaBBBbbbABAB")).toBe(21);
  });

  it("should return 18 for 'AmericanRAILWAY'", () => {
    expect(typist("AmericanRAILWAY")).toBe(18);
  });

  it("should return 12 for 'AaAaAa'", () => {
    expect(typist("AaAaAa")).toBe(12);
  });

  it("should return 11 for 'DFjfkdaB'", () => {
    expect(typist("DFjfkdaB")).toBe(11);
  });
});

