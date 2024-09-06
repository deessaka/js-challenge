// Exercice Exercice69
//
const { sortAnimal } = require("../exercices/Exercice69");

describe("Exercice 69", () => {
  it("should return [{ name: 'Snake', numberOfLegs: 0 }, { name: 'Bird', numberOfLegs: 2 }, { name: 'Human', numberOfLegs: 2 }, { name: 'Cat', numberOfLegs: 4 }, { name: 'Dog', numberOfLegs: 4 }, { name: 'Pig', numberOfLegs: 4 }] for [{ name: 'Cat', numberOfLegs: 4 }, { name: 'Snake', numberOfLegs: 0 }, { name: 'Dog', numberOfLegs: 4 }, { name: 'Pig', numberOfLegs: 4 }, { name: 'Human', numberOfLegs: 2 }, { name: 'Bird', numberOfLegs: 2 }]", () => {
    expect(
      sortAnimal([
        { name: "Cat", numberOfLegs: 4 },
        { name: "Snake", numberOfLegs: 0 },
        { name: "Dog", numberOfLegs: 4 },
        { name: "Pig", numberOfLegs: 4 },
        { name: "Human", numberOfLegs: 2 },
        { name: "Bird", numberOfLegs: 2 },
      ]),
    ).toEqual([
      { name: "Snake", numberOfLegs: 0 },
      { name: "Bird", numberOfLegs: 2 },
      { name: "Human", numberOfLegs: 2 },
      { name: "Cat", numberOfLegs: 4 },
      { name: "Dog", numberOfLegs: 4 },
      { name: "Pig", numberOfLegs: 4 },
    ]);
  });
});

