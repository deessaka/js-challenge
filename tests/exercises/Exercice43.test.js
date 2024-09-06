// Exercice Exercice43

const removeTattoos = require("../Exercice43");

describe("removeTattoos", () => {
  it("should return the skin scan with the tattoos removed", () => {
    expect(removeTattoos(["X", "X", "X", "X"])).toEqual(["*", "*", "*", "*"]);
    expect(removeTattoos(["X", "X", "A", "X"])).toEqual(["*", "*", "*", "*"]);
    expect(removeTattoos(["*", "X", "X", "X"])).toEqual(["*", "*", "*", "*"]);
    expect(removeTattoos(["X", "X", "X", "*"])).toEqual(["*", "*", "*", "*"]);
    expect(removeTattoos(["*", "*", "*", "*"])).toEqual(["*", "*", "*", "*"]);
  });
});

