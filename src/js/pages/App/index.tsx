import * as React from 'preact';
import styles from './styles.module.scss';

import Console, { addLine, addLines } from 'components/Console';
import { useEffect, useCallback } from 'preact/hooks';
import RemoteConsole from 'RemoteConsole';
import * as commands from 'commands';

function toString(arg: ClientArg) {
    if (arg.isUndefined) return 'undefined';
    if (arg.isNull) return 'null';
    if (arg.type === 'string') return JSON.parse(arg.json);
    if (arg.type === 'function') return '*function*';

    return arg.json;
}

function toObj(arg: ClientArg) {
    if (arg.isNull) return null;
    if (arg.isUndefined) return undefined;
    if (!arg.json) return arg.json;
    return JSON.parse(arg.json);
}

function getTypeFromHttpStatus(status: number) {
    switch (status.toString().charAt(0)) {
        case '1':
            return 'info';
        case '2':
            return 'success';
        case '3':
            return 'warn';
        case '4':
        case '5':
        default:
            return 'error';
    }
}

let remoteConsole: RemoteConsole;
export function getRemoteConsole() {
    return remoteConsole;
}

export default function () {
    function onSubmit(text: string) {
        if (!commands.exec(text)) {
            addLine('eval', text);
            remoteConsole.eval(text);
        }
    }

    useEffect(() => {
        addLines([
            {
                type: 'html',
                text: `Remote Console ${process.env.VERSION}\nType <b>/help</b> to show commands`,
            },
        ]);

        // @ts-ignore
        remoteConsole = new RemoteConsole(process.env.SERVER_URL);

        remoteConsole.onReady.add((channelID) => {
            console.log('channelID', channelID);
            addLines([
                {
                    type: 'html',
                    text: '<i>Add the following line inside the head of your html file:</i>',
                },
                {
                    type: 'info',
                    text: `<script data-remoteconsole-channel="${channelID}" src="${window.location.protocol + '//' + window.location.hostname}/agent.js"></script>`,
                },
            ]);
        });

        remoteConsole.onAgentReady.add((userAgent: string) => {
            addLines([
                {
                    type: 'success',
                    text: userAgent,
                    data: {
                        title: 'AGENT READY',
                    },
                },
            ]);
        });

        remoteConsole.onAgentClose.add((userAgent: string) => {
            addLines([
                {
                    type: 'error',
                    text: userAgent,
                    data: {
                        title: 'AGENT DISCONNECTED',
                    },
                },
            ]);
        });

        remoteConsole.onConsole.add((type: string, args: ClientArg[]) => {
            console.log(...args.map(toObj));
            console[type](...args.map(toObj));

            addLine(type, args.map(toString).join(' '));
        });

        remoteConsole.onEval.add((res: ClientArg) => {
            addLine('return', toString(res));
        });

        remoteConsole.onException.add((res: ClientArg) => {
            addLine('exception', JSON.parse(res.json), res.data);
        });

        remoteConsole.onFetch.add((url: string, options: any) => {
            const hasOptions = !options.isUndefined && !options.isNull;

            addLine('info', url + (hasOptions ? ' ' + toString(options) : ''), {
                title: 'FETCH',
            });
        });

        remoteConsole.onFetchOk.add((url: string, status: number, type: string) => {
            addLine(getTypeFromHttpStatus(status), `${url} (status: ${status}, type: ${type})`, {
                title: 'FETCH',
            });
        });

        remoteConsole.onFetchNOk.add((url: string, status: number, statusText: string) => {
            addLine(getTypeFromHttpStatus(status), `${url} (status: ${status}, message: ${statusText})`, {
                title: 'FETCH',
            });
        });

        remoteConsole.onFetchError.add((url: string, msg: string) => {
            addLine('error', `${url} (${msg})`, {
                title: 'FETCH',
            });
        });

        remoteConsole.onXHROpen.add((url: string, method: string) => {
            addLine('info', `${method} ${url}`, {
                title: 'XHR',
            });
        });

        remoteConsole.onXHRStatus.add((url: string, status: number) => {
            addLine(getTypeFromHttpStatus(status), `${url}, status: ${status}`, {
                title: 'XHR',
            });
        });

        // fetch('https://httpstat.us/500')
    }, []);

    return (
        <div className={styles.app}>
            <Console onSubmit={onSubmit} />
        </div>
    );
}
