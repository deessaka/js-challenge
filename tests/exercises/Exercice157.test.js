function __advance(node) {
  return typeof node.getNext === 'function' ? node.getNext() : node.next;
}
function __buildLoopyList(tailLen, loopLen) {
  const nodes = [];
  for (let i = 0; i < tailLen + loopLen; i++) nodes.push({ next: null });
  for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
  nodes[nodes.length - 1].next = nodes[tailLen];
  return nodes[0];
}

describe('Exercice 157', () => {
  it('cas fixe : queue de 3, boucle de 11', () => {
    expect(loopSize(__buildLoopyList(3, 11))).toBe(11);
  });

  it('tests aléatoires', () => {
    for (let __i = 0; __i < 20; __i++) {
      const tailLen = rndInt(0, 6);
      const loopLen = rndInt(1, 10);
      expect(loopSize(__buildLoopyList(tailLen, loopLen))).toBe(loopLen);
    }
  });
});
