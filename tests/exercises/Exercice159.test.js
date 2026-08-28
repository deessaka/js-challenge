function __toMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}
function __toTimeStr(mins) {
  const h = Math.floor(mins / 60), m = mins % 60;
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
}
function __randomSchedule() {
  const meetings = [];
  let cursor = 9 * 60 + rndInt(0, 60);
  const count = rndInt(0, 3);
  for (let i = 0; i < count && cursor < 18 * 60; i++) {
    const start = cursor + rndInt(0, 30);
    const end = Math.min(19 * 60, start + rndInt(15, 90));
    if (start >= end) break;
    meetings.push([__toTimeStr(start), __toTimeStr(end)]);
    cursor = end + rndInt(0, 30);
  }
  return meetings;
}

describe('Exercice 159', () => {
  it('cas fixe (corrigé : la donnée source omettait 2 des 3 réunions de C)', () => {
    // Note contrat: l'exemple original de l'énoncé ne liste qu'une réunion pour la
    // personne C (17:45-19:00) alors que le texte en décrit 3 (11:30-12:15, 15:00-16:30,
    // 17:45-19:00). Le tableau ci-dessous reconstitue la version complète, cohérente
    // avec le résultat attendu "12:15" donné par l'énoncé.
    const schedules = [
      [['09:00', '11:30'], ['13:30', '16:00'], ['16:00', '17:30'], ['17:45', '19:00']],
      [['09:15', '12:00'], ['14:00', '16:30'], ['17:00', '17:30']],
      [['11:30', '12:15'], ['15:00', '16:30'], ['17:45', '19:00']],
    ];
    expect(getStartTime(schedules, 60)).toBe('12:15');
  });

  it('tests aléatoires vs recherche de créneau libre calculée directement', () => {
    for (let __i = 0; __i < 20; __i++) {
      const schedules = Array.from({ length: rndInt(1, 4) }, () => __randomSchedule());
      const duration = rndInt(15, 90);

      const busy = [];
      for (const person of schedules) for (const [s, e] of person) busy.push([__toMinutes(s), __toMinutes(e)]);
      busy.sort((a, b) => a[0] - b[0]);
      const merged = [];
      for (const [s, e] of busy) {
        if (merged.length && s <= merged[merged.length - 1][1]) merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], e);
        else merged.push([s, e]);
      }
      let cursor = 9 * 60, expected = null;
      for (const [s, e] of merged) {
        if (s - cursor >= duration) { expected = __toTimeStr(cursor); break; }
        cursor = Math.max(cursor, e);
      }
      if (expected === null && 19 * 60 - cursor >= duration) expected = __toTimeStr(cursor);

      expect(getStartTime(schedules, duration)).toEqual(expected);
    }
  });
});
