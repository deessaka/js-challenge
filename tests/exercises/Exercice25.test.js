// Exercice Exercice25

const DNAStrand = require("../exercices/Exercice25");

describe("Exercice 25", () => {
  it("should return the complementary DNA strand", () => {
    expect(DNAStrand("ATTGC")).toBe("TAACG");
    expect(DNAStrand("GTAT")).toBe("CATA");
  });
});

