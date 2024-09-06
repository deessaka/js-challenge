// Exercice Exercice29

const encode = require("../exercices/Exercice29");
const decode = require("../exercices/Exercice29");

describe("Exercice 29", () => {
  it("should encode the message", () => {
    expect(encode("Ala has a cat")).toEqual("Gug hgs g cgt");
    expect(encode("Ala has a cat")).toEqual("Gug hgs g cgt");
    expect(decode("Gug hgs g cgt")).toEqual("Ala has a cat");
    expect(encode("ABCD")).toEqual("GBCE");
    expect(encode("gaderypoluki")).toEqual("agedyropulik");
  });
});

