describe('Exercice 140', () => {
  it("cas fixe 1", () => {
    expect(trapWater([1,0,2,1,0,1,3,2,1,2,1])).toBe(6);
  });
  it("cas fixe 2", () => {
    expect(trapWater([10,0,10])).toBe(10);
  });
  it("cas fixe 3", () => {
    expect(trapWater([0,10,0])).toBe(0);
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(heights) {
  let left = 0, right = heights.length - 1, leftMax = 0, rightMax = 0, total = 0
  while (left < right) {
    if (heights[left] <= heights[right]) {
      leftMax = Math.max(leftMax, heights[left]); total += leftMax - heights[left]; left++
    } else {
      rightMax = Math.max(rightMax, heights[right]); total += rightMax - heights[right]; right--
    }
  }
  return total
}
    for (let __i = 0; __i < 25; __i++) {
      const heights = Array.from({length: rndInt(0,15)}, () => rndInt(0,10));
      expect(trapWater(heights)).toEqual(__reference(heights));
    }
  });
});
