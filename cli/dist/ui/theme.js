export const COLORS = {
    primary: '#7aa2f7',
    secondary: '#bb9af7',
    cyan: '#7dcfff',
    success: '#9ece6a',
    warning: '#e0af68',
    error: '#f7768e',
    text: '#c0caf5',
    textMuted: '#565f89',
    textDim: '#414868',
    border: '#3b4261',
    borderFocus: '#7aa2f7',
};
export function sanitizeDescription(raw) {
    return raw
        .replace(/Le 2\s*[\r\n]+\s*e\s*[\r\n]+\s*nombre/gi, 'Le 2ème nombre')
        .replace(/Le 2\s*e\s*nombre/gi, 'Le 2ème nombre')
        .replace(/1\s*ere/gi, '1ère')
        .replace(/(\d+)\s*[\r\n]+\s*e\b/gi, '$1ème')
        .replace(/[\r\n]+\s*\d{1,3}\s*[\r\n]+/g, '\n')
        .replace(/[\uF0E0\u2709\uE000-\uF8FF]/g, '➔')
        .replace(//g, '➔')
        .replace(/\s*->\s*/g, ' ➔ ');
}
export function inferStarterCode(challenge) {
    if (challenge.starterCode &&
        challenge.starterCode.trim() &&
        !challenge.starterCode.includes("console.log('Hello')")) {
        return challenge.starterCode;
    }
    const desc = challenge.description || '';
    const sanitized = sanitizeDescription(desc);
    const exampleMatch = sanitized.match(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(([^)]*)\)\s*(?:[➔→\uF0E0]|===|->)/);
    if (exampleMatch) {
        const fnName = exampleMatch[1];
        const rawArgs = exampleMatch[2].trim();
        let params = 'input';
        if (fnName.toLowerCase() === 'number' && challenge.number === 1) {
            params = 'busStops';
        }
        else if (rawArgs.includes(',')) {
            const count = rawArgs.split(',').length;
            params = ['a', 'b', 'c', 'd', 'e'].slice(0, Math.min(5, count)).join(', ');
        }
        else if (rawArgs.startsWith('"') || rawArgs.startsWith("'")) {
            params = 'str';
        }
        else if (rawArgs.startsWith('[')) {
            params = 'arr';
        }
        else if (/^\d+$/.test(rawArgs)) {
            params = 'num';
        }
        return `// #${challenge.number} — ${challenge.title}\n\nfunction ${fnName}(${params}) {\n  // Votre solution ici\n  \n}\n`;
    }
    const generalMatch = sanitized.match(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(([^)]*)\)/);
    const stopWords = ['et', 'ou', 'le', 'la', 'un', 'une', 'des', 'les', 'pour', 'dans', 'avec', 'par', 'sur', 'bus'];
    if (generalMatch && !stopWords.includes(generalMatch[1].toLowerCase())) {
        const fnName = generalMatch[1];
        return `// #${challenge.number} — ${challenge.title}\n\nfunction ${fnName}(input) {\n  // Votre solution ici\n  \n}\n`;
    }
    return `// #${challenge.number} — ${challenge.title}\n\nfunction solution(input) {\n  // Votre solution ici\n  \n}\n`;
}
//# sourceMappingURL=theme.js.map