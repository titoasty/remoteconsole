// import chalk from 'chalk';
import figures from 'figures';

const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

const types = {
    verbose: {
        badge: figures.bullet,
        color: 'cyan',
    },
    debug: {
        badge: figures.bullet,
        color: 'green',
    },
    info: {
        badge: figures.info,
        // badge: 'i',
        color: 'blue',
    },
    warn: {
        badge: figures.warning,
        color: 'yellow',
    },
    error: {
        badge: figures.cross,
        color: 'red',
    },
    success: {
        badge: figures.tick,
        color: 'green',
    },
    awaiting: {
        badge: figures.ellipsis,
        color: 'blue',
    },
};

const browserColors = {
    gray: '#808080',
    green: '#00AA00',
    blue: '#0000AA',
    red: '#AA0000',
    yellow: '#AAAA00',
    cyan: '#00AAAA',
};

function browserColor(color, style = '') {
    let str = `font-family:"Lucida Console",Monaco,monospace; color: ${browserColors[color] || '#000'};`;

    if (style.indexOf('underline') >= 0) {
        str += 'text-decoration:underline;';
    }

    return str;
}

let enabled = true;

// spaces
const maxSpaces = Object.keys(types)
    .map((level) => level.length)
    .reduce((max, len) => Math.max(max, len));

function missingSpaces(level) {
    let spaces = '';
    for (let i = level.length; i < maxSpaces; i++) spaces += ' ';
    return spaces;
}

// stringify
function stringify(obj: any) {
    const cache = [];

    return JSON.stringify(
        obj,
        function (key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // duplicate reference found, discard key
                    return;
                }

                // store value in our collection
                cache.push(value);
            }

            return value;
        },
        4
    );
}

// date
function getDate() {
    const now = new Date();
    const year = now.getFullYear();
    let month: number | string = now.getMonth() + 1;
    if (month < 10) month = '0' + month;
    let day: number | string = now.getDate();
    if (day < 10) day = '0' + day;
    let hours: number | string = now.getHours();
    if (hours < 10) hours = '0' + hours;
    let minutes: number | string = now.getMinutes();
    if (minutes < 10) minutes = '0' + minutes;
    let seconds: number | string = now.getSeconds();
    if (seconds < 10) seconds = '0' + seconds;

    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
}

let allowedLevels = Object.keys(types);

// function logConsole(str) {
//     console.log(str);
// }

// log
function log(level, ...args: any) {
    if (!enabled) return;

    if (allowedLevels.indexOf(level) < 0) return;

    const body = args
        .map((arg) => {
            if (arg == null) return 'null';
            if (typeof arg === 'undefined') return 'undefined';
            if (typeof arg === 'object') {
                if (arg.stack) return arg.stack;

                return stringify(arg);
            }

            return arg.toString();
        })
        .join(' ');

    const type = types[level] || types.info;

    if (isBrowser) {
        const str = '%c' + getDate() + ' %c' + figures.pointerSmall + ' %c' + type.badge + ' %c' + level + '%c' + missingSpaces(level) + ' ' + body;
        console.log(str, browserColor('gray'), browserColor('gray'), browserColor(type.color), browserColor(type.color, 'underline'), 'text-decoration:none;');
    }

    // if (isNode) {
    //     const str = chalk.gray(getDate()) + ' ' + chalk.gray(figures.pointerSmall) + ' ' + chalk[type.color](type.badge) + ' ' + chalk.underline[type.color](level) + missingSpaces(level) + ' ' + body;
    //     logConsole(str);
    // }

    // console[type].apply(console[type], args);
}

// exposed levels
const verbose = log.bind(null, 'verbose');
const debug = log.bind(null, 'debug');
const info = log.bind(null, 'info');
const warn = log.bind(null, 'warn');
const error = log.bind(null, 'error');

function setEnabled(e: boolean) {
    enabled = e;
}

function setLevels(allowed: string[]) {
    allowedLevels = allowed;
}

export default {
    verbose,
    debug,
    info,
    warn,
    error,
    setEnabled,
    setLevels,
};
