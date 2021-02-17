import * as Console from 'components/Console';

// @ts-ignore
const context = require.context('.', true, /\.(ts)$/);

const commands = {};

context.keys().forEach((filename: string) => {
    let name = filename.substr(0, filename.lastIndexOf('.'));
    name = name.substr(name.lastIndexOf('/') + 1);

    // ignore index file
    if (name === 'index') return;

    commands[name] = context(filename).default();
});

export const prefix = '/';

export function getCommands() {
    return commands;
}

export function exec(text: string): boolean {
    text = text.trim();
    if (!text.startsWith(prefix)) return false;

    // split parameters
    let res = text.match(/(?:[^\s"']+|['"][^'"]*["'])+/g);

    // trim quotes
    res = res.map((arg) => {
        if (arg.startsWith('"') && arg.endsWith('"')) return arg.substring(1, arg.length - 1);
        if (arg.startsWith("'") && arg.endsWith("'")) return arg.substring(1, arg.length - 1);
        return arg;
    });

    if (res.length <= 0) return false;

    const name = res[0].substring(prefix.length);
    const command = commands[name];

    if (command) {
        command.exec(...res.slice(1));
    } else {
        Console.addLine('error', 'Unknown console command: ' + res[0]);
    }

    return true;
}
