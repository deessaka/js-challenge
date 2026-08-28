function __levenshtein(a, b) {
  const dp = [];
  for (let i = 0; i <= a.length; i++) dp.push([i]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

describe('Exercice 158', () => {
  it('cas fixes', () => {
    const fruits = new Dictionary(['cherry', 'pineapple', 'melon', 'strawberry', 'raspberry']);
    expect(fruits.findMostSimilar('strawbery')).toBe('strawberry');
    expect(fruits.findMostSimilar('berry')).toBe('cherry');

    const things = new Dictionary(['stars', 'mars', 'wars', 'codec', 'codewars']);
    expect(things.findMostSimilar('coddwars')).toBe('codewars');

    const languages = new Dictionary(['javascript', 'java', 'ruby', 'php', 'python', 'coffeescript']);
    expect(languages.findMostSimilar('heaven')).toBe('java');
  });

  it('tests aléatoires vs distance de Levenshtein calculée directement', () => {
    const __pool = ['apple', 'orange', 'banana', 'grape', 'melon', 'cherry', 'peach', 'plum', 'kiwi', 'mango'];
    for (let __i = 0; __i < 15; __i++) {
      const words = shuffle(__pool).slice(0, rndInt(3, 6));
      const dict = new Dictionary(words);
      const target = pick(words).slice(0, rndInt(2, 5)) + pick(['a', 'b', 'x']);
      const result = dict.findMostSimilar(target);
      const resultDist = __levenshtein(target, result);
      const minDist = Math.min(...words.map((w) => __levenshtein(target, w)));
      expect(resultDist).toBe(minDist);
    }
  });
});
