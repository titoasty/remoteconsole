import * as React from 'preact';

export function joinClassNames(...args: string[]) {
    return args.filter((arg) => !!arg && arg.trim().length > 0).join(' ');
}

export function parseNewlines(text: string) {
    return text.replace(/\\n/g, '\n');
}

export function splitNewlines(text, cb = (part, idx) => <div key={idx}>{part}</div>) {
    return text.split('\n').map((part, idx) => cb(part, idx));
}
