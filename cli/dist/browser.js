import { spawn } from 'node:child_process';
export function openBrowser(url) {
    const command = process.platform === 'win32'
        ? 'explorer.exe'
        : process.platform === 'darwin'
            ? 'open'
            : 'xdg-open';
    try {
        const child = spawn(command, [url], {
            detached: true,
            stdio: 'ignore',
            shell: false,
        });
        child.unref();
        return true;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=browser.js.map