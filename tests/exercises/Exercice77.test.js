// Exercice Exercice77
//
const { trumpDetector } = require("../exercices/Exercice77");

describe("Exercice 77", () => {
  it("should return 0 for 'I will build a huge wall'", () => {
    expect(trumpDetector("I will build a huge wall")).toBe(0);
  });

  it("should return 4 for 'HUUUUUGEEEE WAAAAAALL'", () => {
    expect(trumpDetector("HUUUUUGEEEE WAAAAAALL")).toBe(4);
  });

  it("should return 2.5 for 'MEXICAAAAAAAANS GOOOO HOOOMEEEE'", () => {
    expect(trumpDetector("MEXICAAAAAAAANS GOOOO HOOOMEEEE")).toBe(2.5);
  });

  it("should return 1.89 for 'America NUUUUUKEEEE Oooobaaaamaaaaa'", () => {
    expect(trumpDetector("America NUUUUUKEEEE Oooobaaaamaaaaa")).toBe(1.89);
  });

  it("should return 1.56 for 'listen migrants: IIII KIIIDD YOOOUUU NOOOOOOTTT'", () => {
    expect(
      trumpDetector("listen migrants: IIII KIIIDD YOOOUUU NOOOOOOTTT"),
    ).toBe(1.56);
  });

  it("should return 1.56 for 'listen migrants: IIII KIIIDD YOOOUUU NOOOOOOTTT'", () => {
    expect(
      trumpDetector("listen migrants: IIII KIIIDD YOOOUUU NOOOOOOTTT"),
    ).toBe(1.56);
  });

  it("should return 0 for 'I will build a huge wall'", () => {
    expect(trumpDetector("I will build a huge wall")).toBe(0);
  });
});

