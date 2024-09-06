// Exercice Exercice14

const getCount = require("../exercices/Exercice14");

describe("Exercice 14", () => {
  it("getCount", () => {
    expect(
      getCount([
        {
          FirstName: "Noah",
          lastName: "M.",
          pays: "Suisse",
          continent: "Europe",
          age: 19,
          langue: "C",
          Repas: "végétarien",
        },
        {
          FirstName: "Anna",
          lastName: "R.",
          pays: "Liechtenstein",
          continent: "Europe",
          age: 52,
          langue: "JavaScript",
          Repas: "standard",
        },
        {
          FirstName: "Ramona",
          lastName: "R.",
          pays: "Paraguay",
          continent: "Amériques",
          age: 29,
          langue: "Ruby",
          Repas: "vegan",
        },
        {
          FirstName: "George",
          lastName: "B.",
          pays: "Angleterre",
          continent: "Europe",
          age: 81,
          langue: "C",
          Repas: "végétarien",
        },
      ]),
    ).toEqual({ Végétarien: 2, standard: 1, vegan: 1 });
  });
});

