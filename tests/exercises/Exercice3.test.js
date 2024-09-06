// Exercice Exercice3

const removeChar = require("../exercices/Exercice3");

describe("Exercice 3", () => {
  it("Nous devons supprimer le premier et le dernier caractère d'une chaîne", () => {
    expect(removeChar("Ceci est une phrase")).toBe("eci est une phras");

    expect(removeChar("Ceci est une phrase.")).toBe("eci est une phrase.");

    expect(removeChar("Ceci est une phrase !")).toBe("eci est une phrase !");
  });
});

