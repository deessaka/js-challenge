function __approx(a, b, eps = 1e-6) {
  return Math.abs(a - b) < eps;
}
function __vecApprox(v, i, j, k, eps = 1e-6) {
  return __approx(v.i, i, eps) && __approx(v.j, j, eps) && __approx(v.k, k, eps);
}

describe('Exercice 141', () => {
  it('constructeur et getMagnitude', () => {
    const v = new Vector(6, 10, -3);
    expect(__approx(v.getMagnitude(), 12.041594578792296)).toBeTruthy();
  });

  it('vecteurs unitaires statiques getI/getJ/getK', () => {
    const i = Vector.getI(), j = Vector.getJ(), k = Vector.getK();
    expect(__vecApprox(i, 1, 0, 0)).toBeTruthy();
    expect(__vecApprox(j, 0, 1, 0)).toBeTruthy();
    expect(__vecApprox(k, 0, 0, 1)).toBeTruthy();
  });

  it('add', () => {
    const v = new Vector(3, 7 / 2, -3 / 2);
    const s = v.add(new Vector(-27, 3, 4));
    expect(__vecApprox(s, -24, 6.5, 2.5)).toBeTruthy();
  });

  it('multiplyByScalar', () => {
    const v = new Vector(1 / 3, 177 / 27, -99);
    const e = v.multiplyByScalar(-3 / 7);
    expect(__vecApprox(e, -0.14285714285714285, -2.8095238095238093, 42.42857142857142)).toBeTruthy();
  });

  it('dot', () => {
    const v = new Vector(-99 / 71, 22 / 23, 45);
    expect(__approx(v.dot(new Vector(-5, 4, 7)), 325.7979179, 1e-4)).toBeTruthy();
  });

  it('cross', () => {
    const a = new Vector(2, 1, 3);
    const b = new Vector(4, 6, 5);
    expect(__vecApprox(a.cross(b), -13, 2, 8)).toBeTruthy();
  });

  it('isParallelTo', () => {
    const a = new Vector(1045 / 23, -666 / 37, 15);
    const b = new Vector(161.3385037, -59124 / 925, 9854 / 185);
    expect(a.isParallelTo(b)).toBe(true);
    expect(b.isParallelTo(a)).toBe(true);
    const c = new Vector(-3, 0, 5);
    const d = new Vector(-12, 1, 20);
    expect(c.isParallelTo(d)).toBe(false);
  });

  it('isPerpendicularTo', () => {
    const a = new Vector(3, 4, 7);
    const b = new Vector(1 / 3, 2, -9 / 7);
    expect(a.isPerpendicularTo(b)).toBe(true);
    const c = new Vector(1, 3, 5);
    const d = new Vector(-2, -7, 4.4);
    expect(c.isPerpendicularTo(d)).toBe(false);
  });

  it('normalize', () => {
    const v = new Vector(-1, -1, 1);
    const u = v.normalize();
    expect(__vecApprox(u, -0.5773502691896258, -0.5773502691896258, 0.5773502691896258)).toBeTruthy();
  });

  it('isNormalized', () => {
    const a = new Vector(-1 / Math.sqrt(2), 0, 1 / Math.sqrt(2));
    const b = new Vector(1, 1, 1);
    expect(a.isNormalized()).toBe(true);
    expect(b.isNormalized()).toBe(false);
  });

  it('tests aléatoires (identités algébriques)', () => {
    for (let __i = 0; __i < 25; __i++) {
      const a = new Vector(rndInt(-20, 20), rndInt(-20, 20), rndInt(-20, 20));
      const b = new Vector(rndInt(-20, 20), rndInt(-20, 20), rndInt(-20, 20));

      // dot is commutative
      expect(__approx(a.dot(b), b.dot(a))).toBeTruthy();
      // add is component-wise
      expect(__vecApprox(a.add(b), a.i + b.i, a.j + b.j, a.k + b.k)).toBeTruthy();
      // cross(a, b) is perpendicular to both a and b (unless a or b is the zero vector)
      const cr = a.cross(b);
      expect(__approx(cr.dot(a), 0, 1e-6)).toBeTruthy();
      expect(__approx(cr.dot(b), 0, 1e-6)).toBeTruthy();
      // a vector is always parallel to itself
      expect(a.isParallelTo(a)).toBe(true);
      // multiplyByScalar scales the magnitude linearly
      const scaled = a.multiplyByScalar(2);
      expect(__approx(scaled.getMagnitude(), a.getMagnitude() * 2)).toBeTruthy();
      // normalize() always yields a unit vector (skip the zero vector, undefined)
      if (a.getMagnitude() > 0) {
        expect(a.normalize().isNormalized()).toBe(true);
      }
    }
  });
});
