// Exercice Exercice40
//
const kookaCounter = require("../Exercice40");

describe("kookaCounter", () => {
  it("should return the number of kookaburras", () => {
    expect(kookaCounter("")).toBe(0);
    expect(kookaCounter("hahahahaha")).toBe(1);
    expect(kookaCounter("hahahahahaHaHaHa")).toBe(2);
    expect(kookaCounter("HaHaHahahaHaHa")).toBe(3);
  });
});

