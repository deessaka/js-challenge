function TreeNode(value, left, right) { this.value = value; this.left = left; this.right = right; }
function __randomTree(depth) {
  if (depth <= 0 || Math.random() < 0.3) return null;
  const left = __randomTree(depth - 1);
  const right = __randomTree(depth - 1);
  return new TreeNode(rndInt(-20, 20), left, right);
}
function __refMaxSum(node) {
  if (!node.left && !node.right) return node.value;
  const l = node.left ? __refMaxSum(node.left) : -Infinity;
  const r = node.right ? __refMaxSum(node.right) : -Infinity;
  return node.value + Math.max(l, r);
}
describe('Exercice 117', () => {
  it("cas fixe 1", () => {
    expect(maxSum(new TreeNode(17, new TreeNode(3, new TreeNode(2, null, null), null), new TreeNode(-10, new TreeNode(16, null, null), new TreeNode(1, new TreeNode(13, null, null), null))))).toBe(23);
  });
  it("cas fixe 2", () => {
    expect(maxSum(new TreeNode(5, new TreeNode(-22, new TreeNode(9, null, null), new TreeNode(50, null, null)), new TreeNode(11, new TreeNode(9, null, null), new TreeNode(2, null, null))))).toBe(33);
  });
  it("tests aléatoires (arbres binaires aléatoires)", () => {
    for (let __i = 0; __i < 25; __i++) {
      let tree;
      do { tree = __randomTree(4); } while (!tree);
      expect(maxSum(tree)).toBe(__refMaxSum(tree));
    }
  });
});
