function parseCoord(coord) {
  const m = coord.match(/(\d+)\D+(\d+)\D+([\d.]+)\D*([NSEW])/);
  const [, deg, min, sec, dir] = m;
  let dec = Number(deg) + Number(min) / 60 + Number(sec) / 3600;
  if (dir === 'S' || dir === 'W') dec = -dec;
  return dec;
}
describe('Exercice 161', () => {
  it("cas fixe 1", () => {
    expect(distance("48° 12' 30\" N", "16° 22' 23\" E", "23° 33' 0\" S", "46° 38' 0\" W")).toBe(10130);
  });
  it("cas fixe 2", () => {
    expect(distance("48° 12' 30\" N", "16° 22' 23\" E", "58° 18' 0\" N", "134° 25' 0\" W")).toBe(7870);
  });
  it("cas fixe 3", () => {
    expect(distance("48° 12' 30\" N", "16° 22' 23\" E", "48° 12' 30\" N", "16° 22' 23\" E")).toBe(0);
  });
});
