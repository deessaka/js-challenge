// Exercice Exercice98
//
const parseHTMLColor = require("../exercices/Exercice98");

describe("Exercice 98", () => {
  it("should return the correct RGB values", () => {
    expect(parseHTMLColor("#80FFA0")).toEqual({ r: 128, g: 255, b: 160 });
    expect(parseHTMLColor("#3B7")).toEqual({ r: 51, g: 187, b: 119 });
    expect(parseHTMLColor("LimeGreen")).toEqual({ r: 50, g: 205, b: 50 });
  });
});

