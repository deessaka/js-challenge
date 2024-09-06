// Exercice Exercice92
//
const countSmileys = require("../exercices/Exercice92");

describe("Exercice92: countSmileys", () => {
  it("should return 2 for [':)', ';(', ';}', ':-D']", () => {
    expect(countSmileys([":)", ";(", ";}", ":-D"])).toBe(2);
  });
  it("should return 3 for [';D', ':-(', ':-)', ';~)']", () => {
    expect(countSmileys([";D", ":-(", ":-)", ";~)"])).toBe(3);
  });
  it("should return 1 for [';]', ':[', ';*', ':$', ';-D']", () => {
    expect(countSmileys([";]", ":[", ";*", ":$", ";-D"])).toBe(1);
  });
});

