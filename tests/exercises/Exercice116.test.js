function Node(data, next = null) { this.data = data; this.next = next; }
function __arrayToList(arr) { let head = null; for (let i = arr.length - 1; i >= 0; i--) head = new Node(arr[i], head); return head; }
describe('Exercice 116', () => {
  it("cas fixe 1", () => {
    expect(length(null)).toBe(0);
  });
  it("cas fixe 2", () => {
    expect(length(__arrayToList([1, 2, 3]))).toBe(3);
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(head) {
  let n = 0
  while (head) { n++; head = head.next }
  return n
}
    for (let __i = 0; __i < 20; __i++) {
      const __arr = Array.from({length: rndInt(0,12)}, () => rndInt(0,99)); const head = __arrayToList(__arr);
      expect(length(head)).toEqual(__reference(head));
    }
  });
});
