import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
export async function ask(question) {
    const readline = createInterface({ input, output });
    try {
        return (await readline.question(question)).trim();
    }
    finally {
        readline.close();
    }
}
export async function askSecret(question) {
    if (!input.isTTY || !output.isTTY || !input.setRawMode) {
        return ask(`${question} `);
    }
    output.write(question);
    input.setRawMode(true);
    input.resume();
    return new Promise((resolve) => {
        let value = '';
        const onData = (chunk) => {
            const text = chunk.toString('utf8');
            for (const char of text) {
                if (char === '\u0003') {
                    input.setRawMode?.(false);
                    input.pause();
                    input.off('data', onData);
                    output.write('\n');
                    process.exitCode = 130;
                    resolve('');
                    return;
                }
                if (char === '\r' || char === '\n') {
                    input.setRawMode?.(false);
                    input.pause();
                    input.off('data', onData);
                    output.write('\n');
                    resolve(value.trim());
                    return;
                }
                if (char === '\u007f' || char === '\b') {
                    if (value.length) {
                        value = value.slice(0, -1);
                        output.write('\b \b');
                    }
                    continue;
                }
                // Ignore non-printable control characters (like \u0016 from Ctrl+V)
                if (char.charCodeAt(0) < 32) {
                    continue;
                }
                value += char;
                output.write('*');
            }
        };
        input.on('data', onData);
    });
}
export function info(message) {
    console.log(message);
}
export function success(message) {
    console.log(`✓ ${message}`);
}
export function warning(message) {
    console.error(`! ${message}`);
}
export function error(message) {
    console.error(`✗ ${message}`);
}
export function table(rows) {
    if (!rows.length)
        return;
    const columns = Object.keys(rows[0]);
    const widths = columns.map((column) => Math.max(column.length, ...rows.map((row) => row[column].length)));
    console.log(columns.map((column, index) => column.padEnd(widths[index])).join('  '));
    console.log(widths.map((width) => '-'.repeat(width)).join('  '));
    for (const row of rows) {
        console.log(columns.map((column, index) => row[column].padEnd(widths[index])).join('  '));
    }
}
//# sourceMappingURL=terminal_ui.js.map