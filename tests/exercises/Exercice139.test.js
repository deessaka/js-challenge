// Limited scope: the source spec gives no worked example for Network.prototype.process's
// exact bit-packing (camera ID position, up/down/left/right bit order, sign convention).
// Only the unambiguous constructor/initial-state contract is tested here; process()
// behavior needs a human-authored worked example before it can be safely graded.
describe('Exercice 139', () => {
  it('état initial des caméras', () => {
    const net = new Network(4);
    expect(net.cameras.length).toBe(4);
    for (const cam of net.cameras) {
      expect(cam.horizontal).toBe(0);
      expect(cam.vertical).toBe(-30);
    }
  });
});
