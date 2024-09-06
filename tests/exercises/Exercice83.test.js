// Exercice Exercice83
//

const { isLanguageDiverse } = require("../exercices/Exercice83");

describe("Exercice 83: isLanguageDiverse", () => {
  it("should return true for [{ firstName: 'Daniel', lastName: 'J.', country: 'Aruba', continent: 'Americas', age: 42, language: 'Python' }, 38, { firstName: 'Kseniya', lastName: 'T.', country: 'Belarus', continent: 'Europe', age: 22, language: 'Ruby' }, { firstName: 'Jayden', lastName: 'P.', country: 'Jamaica', continent: 'Americas', age: 18, language: 'JavaScript' }, { firstName: 'Joao', lastName: 'D.', country: 'Portugal', continent: 'Europe', age: 25, language: 'JavaScript' }]", () => {
    expect(
      isLanguageDiverse([
        {
          firstName: "Daniel",
          lastName: "J.",
          country: "Aruba",
          continent: "Americas",
          age: 42,
          language: "Python",
        },
        38,
        {
          firstName: "Kseniya",
          lastName: "T.",
          country: "Belarus",
          continent: "Europe",
          age: 22,
          language: "Ruby",
        },
        {
          firstName: "Jayden",
          lastName: "P.",
          country: "Jamaica",
          continent: "Americas",
          age: 18,
          language: "JavaScript",
        },
        {
          firstName: "Joao",
          lastName: "D.",
          country: "Portugal",
          continent: "Europe",
          age: 25,
          language: "JavaScript",
        },
      ]),
    ).toBe(true);
  });
});

