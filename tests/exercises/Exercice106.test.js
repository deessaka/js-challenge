// Exercice Exercice106
const mazeRunner = require("../exercices/Exercice106");

describe("Exercice 106", () => {
  const maze = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 3],
    [1, 0, 1, 0, 1, 0, 1],
    [0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 2, 1, 0, 1, 0, 1],
  ];

  it("should return the correct result", () => {
    const result = mazeRunner(maze, [
      "N",
      "N",
      "N",
      "N",
      "N",
      "E",
      "E",
      "E",
      "E",
      "E",
    ]);
    expect(result).toBe("Finish");
  });

  it("should return the correct result", () => {
    const result = mazeRunner(maze, ["N", "N", "N", "W", "W"]);
    expect(result).toBe("Dead");
  });

  it("should return the correct result", () => {
    const result = mazeRunner(maze, ["N", "E", "E", "E", "E"]);
    expect(result).toBe("Lost");
  });
});

