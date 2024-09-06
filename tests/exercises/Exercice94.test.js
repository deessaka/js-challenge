// Exercice Exercice94
//
const getMichaelLastName = require("../exercices/Exercice94");

describe("Exercice94: getMichaelLastName", () => {
  it("should return ['Jordan','Johnson','Green','Wood'] for 'Michael, how are you? - Cool, how is John Williamns and Michael Jordan? I don't know but Michael Johnson is fine. Michael do you still score points with LeBron James, Michael Green AKA Star and Michael Wood?'", () => {
    expect(
      getMichaelLastName(
        "Michael, how are you? - Cool, how is John Williamns and Michael Jordan? I don't know but Michael Johnson is fine. Michael do you still score points with LeBron James, Michael Green AKA Star and Michael Wood?",
      ),
    ).toEqual(["Jordan", "Johnson", "Green", "Wood"]);
  });
});

