import Client from './Client';
// import './tests';

const serverURL = new URL(process.env.SERVER_URL);
const origConsole: any = {};

function bindConsole(client: Client) {
    function bindConsoleFn(name: string) {
        // @ts-ignore
        const consoleFn = console[name];
        origConsole[name] = consoleFn;

        // @ts-ignore
        console[name] = (...args: any[]) => {
            client.console(name, ...args);
            consoleFn(...args);
        };
    }

    bindConsoleFn('log');
    bindConsoleFn('warn');
    bindConsoleFn('error');
    bindConsoleFn('info');
    bindConsoleFn('debug');
}

function bindGlobalError(client: Client) {
    // window.onerror = function (msg, url, line, col, error) {
    //     socket.emit('console', 'error', [toArg(msg)]);
    // };

    window.addEventListener('error', (evt: ErrorEvent) => {
        origConsole.log(evt);
        origConsole.log(evt.message);
        client.exception(evt.message, evt.lineno, evt.colno, evt.error?.stack);
        // console.error(`${evt.message} (${evt.filename}, line ${evt.lineno})`, evt.stack);
    });
}

function bindFetch(client: Client) {
    const origFetch = window.fetch;

    window.fetch = function (url: string, options: any) {
        return new Promise(async (resolve, reject) => {
            client.fetch(url, options);

            try {
                origFetch(url, options)
                    .then((res) => {
                        if (res.ok) {
                            client.fetchOk(url, res.status, res.type);
                        } else {
                            client.fetchNOk(url, res.status, res.statusText);
                        }
                        resolve(res);
                    })
                    .catch((err) => {
                        client.fetchError(url, err.message);
                        reject(err);
                    });
            } catch (err) {
                console.log('err:', err);
            }
        });
    };
}

function bindXHR(client: Client) {
    // @ts-ignore
    XMLHttpRequest.prototype._orig_open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (...args: any[]) {
        // @ts-ignore
        this._orig_open(...args);

        const method = args[0];
        const url = args[1];

        // ignore calls to remoteconsole server
        if (url.indexOf(serverURL.hostname) >= 0) {
            return;
        }

        client.xhrOpen(url, method);

        this.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                client.xhrStatus(url, this.status);
            }
        });
    };
}

// get channel id
const ATTRIBUTE_NAME = 'data-remoteconsole-channel';
const channelID = document.querySelector(`[${ATTRIBUTE_NAME}]`)?.getAttribute(ATTRIBUTE_NAME) || '';

const client = new Client(channelID);
client.onReady.add(() => {
    console.log('ready', channelID);
    bindConsole(client);
    bindGlobalError(client);
    bindFetch(client);
    bindXHR(client);
});

client.onEval.add((text: string) => {
    try {
        client.eval(eval(text));
    } catch (err) {
        client.exception('Exception: ' + err.message, err.lineno, err.colno, err.stack);
    }
});

client.connect(process.env.SERVER_URL);
