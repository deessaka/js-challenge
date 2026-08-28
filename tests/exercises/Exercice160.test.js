// The spec allows "if there are several possible routes, choose one" — so random tests
// validate PROPERTIES of the returned path (valid edges, correct endpoints, minimal total
// time) rather than requiring one exact canonical array, since more than one shortest
// path can legitimately exist.
function __dijkstra(numberOfIntersections, roads, start, finish) {
  const adj = Array.from({ length: numberOfIntersections }, () => []);
  for (const r of roads) adj[r.from].push([r.to, r.drivingTime]);
  const dist = new Array(numberOfIntersections).fill(Infinity);
  const prev = new Array(numberOfIntersections).fill(null);
  dist[start] = 0;
  const visited = new Array(numberOfIntersections).fill(false);
  for (let iter = 0; iter < numberOfIntersections; iter++) {
    let u = -1, best = Infinity;
    for (let i = 0; i < numberOfIntersections; i++) if (!visited[i] && dist[i] < best) { best = dist[i]; u = i; }
    if (u === -1) break;
    visited[u] = true;
    for (const [v, w] of adj[u]) if (dist[u] + w < dist[v]) { dist[v] = dist[u] + w; prev[v] = u; }
  }
  if (dist[finish] === Infinity) return null;
  const path = [];
  let cur = finish;
  while (cur !== null) { path.unshift(cur); cur = prev[cur]; }
  return { path, time: dist[finish] };
}
function __pathTime(roads, path) {
  const edgeTime = {};
  for (const r of roads) edgeTime[`${r.from}->${r.to}`] = r.drivingTime;
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const key = `${path[i]}->${path[i + 1]}`;
    if (!(key in edgeTime)) return null; // not a valid edge
    total += edgeTime[key];
  }
  return total;
}

describe('Exercice 160', () => {
  it('cas fixe : la carte de l’énoncé (temps minimal 14, un chemin valide)', () => {
    const roads = [
      { from: 0, to: 1, drivingTime: 5 },
      { from: 0, to: 2, drivingTime: 10 },
      { from: 1, to: 2, drivingTime: 10 },
      { from: 1, to: 3, drivingTime: 2 },
      { from: 2, to: 3, drivingTime: 2 },
      { from: 2, to: 4, drivingTime: 5 },
      { from: 3, to: 2, drivingTime: 2 },
      { from: 3, to: 4, drivingTime: 10 },
    ];
    const result = navigate(5, roads, 0, 4);
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toBe(0);
    expect(result[result.length - 1]).toBe(4);
    expect(__pathTime(roads, result)).toBe(14);
  });

  it('cas fixe : aucun itinéraire possible', () => {
    const roads = [{ from: 0, to: 1, drivingTime: 5 }];
    expect(navigate(2, roads, 1, 0)).toBeNull();
  });

  it('tests aléatoires vs plus court chemin calculé directement (Dijkstra)', () => {
    for (let __i = 0; __i < 20; __i++) {
      const n = rndInt(3, 8);
      const roads = [];
      for (let a = 0; a < n; a++) {
        for (let b = 0; b < n; b++) {
          if (a !== b && Math.random() < 0.35) roads.push({ from: a, to: b, drivingTime: rndInt(1, 15) });
        }
      }
      const start = rndInt(0, n - 1);
      let finish = rndInt(0, n - 1);
      const ref = __dijkstra(n, roads, start, finish);
      const result = navigate(n, roads, start, finish);

      if (ref === null) {
        expect(result).toBeNull();
      } else {
        expect(Array.isArray(result)).toBe(true);
        expect(result[0]).toBe(start);
        expect(result[result.length - 1]).toBe(finish);
        expect(__pathTime(roads, result)).toBe(ref.time);
      }
    }
  });
});
