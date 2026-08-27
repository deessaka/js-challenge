describe('Exercice 112', () => {
  it("cas fixe 1", () => {
    expect(dataTypes("You are number 1")).toEqual(["string","string","string","number"]);
  });
  it("cas fixe 2", () => {
    expect(dataTypes("Youarenumber1")).toEqual(["string","number"]);
  });
  it("cas fixe 3", () => {
    expect(dataTypes("123gjet")).toEqual(["number","string"]);
  });
  it("cas fixe 4", () => {
    expect(dataTypes("truestring1")).toEqual(["boolean","string","number"]);
  });
  it("cas fixe 5", () => {
    expect(dataTypes("FalsetruefalseABCDEFGHIJKLMNOPQabcdefghijklmnwxyz0123456789false")).toEqual(["boolean","boolean","boolean","string","number","boolean"]);
  });
});
