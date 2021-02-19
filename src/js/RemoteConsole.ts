import { io, Socket } from 'socket.io-client';
import Signal from 'util/Signal';

export default class RemoteConsole {
    socket: Socket;
    private _channelID: string;
    onReady = new Signal<[string]>();
    onAgentReady = new Signal<[string]>();
    onAgentClose = new Signal<[string]>();
    onConsole = new Signal<[string, ClientArg[]]>();
    onEval = new Signal<[ClientArg]>();
    onException = new Signal<[ClientArg]>();
    onFetch = new Signal<[string, any]>();
    onFetchOk = new Signal<[string, number, string]>();
    onFetchNOk = new Signal<[string, number, string]>();
    onFetchError = new Signal<[string, string]>();
    onXHROpen = new Signal<[string, string]>();
    onXHRStatus = new Signal<[string, number]>();

    constructor(url: string) {
        this.socket = io(url);

        this.socket.on('connect', () => {
            this.socket.on('ready', (channelID: string) => {
                this._channelID = channelID;
                this.onReady.emit(channelID);
            });

            this.socket.on('agent_ready', (userAgent: string) => {
                this.onAgentReady.emit(userAgent);
            });

            this.socket.on('agent_close', (userAgent: string) => {
                this.onAgentClose.emit(userAgent);
            });

            this.socket.on('console', (type: string, args: ClientArg[]) => {
                this.onConsole.emit(type, args);
            });

            this.socket.on('eval', (res: Line) => {
                this.onEval.emit(res);
            });

            this.socket.on('exception', (res: any) => {
                this.onException.emit(res);
            });

            this.socket.on('fetch', (type: string, url: string, ...args: any[]) => {
                switch (type) {
                    case 'send':
                        this.onFetch.emit(url, args[0]);
                        break;
                    case 'ok':
                        this.onFetchOk.emit(url, args[0], args[1]);
                        break;
                    case 'nok':
                        this.onFetchNOk.emit(url, args[0], args[1]);
                        break;
                    case 'error':
                        this.onFetchError.emit(url, args[0]);
                        break;
                }
            });

            this.socket.on('xhr', (type: string, url: string, ...args: any[]) => {
                switch (type) {
                    case 'open':
                        this.onXHROpen.emit(url, args[0]);
                        break;
                    case 'status':
                        this.onXHRStatus.emit(url, args[0]);
                        break;
                }
            });

            this.socket.emit('chan_in');
        });
    }

    eval(text: string) {
        this.socket.emit('eval', text);
    }

    get channelID() {
        return this._channelID;
    }
}
