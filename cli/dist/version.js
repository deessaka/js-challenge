import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
export const UNKNOWN_VERSION = 'unknown';
export async function readCliVersion() {
    const currentDirectory = dirname(fileURLToPath(import.meta.url));
    const packagePath = join(currentDirectory, '..', 'package.json');
    try {
        const content = await readFile(packagePath, 'utf8');
        const parsed = JSON.parse(content);
        return typeof parsed.version === 'string' && parsed.version.trim()
            ? parsed.version.trim()
            : UNKNOWN_VERSION;
    }
    catch {
        return UNKNOWN_VERSION;
    }
}
//# sourceMappingURL=version.js.map