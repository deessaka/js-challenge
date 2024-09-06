// Exercice Exercice59

const { which_note, black_or_white_key } = require("../exercices/Exercice59");

describe("Exercice 59", () => {
  it("should return 'A' for 1", () => {
    expect(which_note(1)).toBe("A");
  });

  it("should return 'G#' for 12", () => {
    expect(which_note(12)).toBe("G#");
  });

  it("should return 'D' for 42", () => {
    expect(which_note(42)).toBe("D");
  });

  it("should return 'G#' for 100", () => {
    expect(which_note(100)).toBe("G#");
  });

  it("should return 'F' for 2017", () => {
    expect(which_note(2017)).toBe("F");
  });

  it("should return 'white' for 1", () => {
    expect(black_or_white_key(1)).toBe("white");
  });

  it("should return 'black' for 12", () => {
    expect(black_or_white_key(12)).toBe("black");
  });

  it("should return 'white' for 42", () => {
    expect(black_or_white_key(42)).toBe("white");
  });

  it("should return 'black' for 100", () => {
    expect(black_or_white_key(100)).toBe("black");
  });

  it("should return 'white' for 2017", () => {
    expect(black_or_white_key(2017)).toBe("white");
  });
});

