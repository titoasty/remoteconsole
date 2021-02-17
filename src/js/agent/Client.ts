import { io, Socket } from 'socket.io-client';
import Signal from 'util/Signal';

export default class Client {
    readonly channelID: string;
    private socket: Socket | undefined;
    onReady = new Signal<[]>();
    onEval = new Signal<[string]>();

    constructor(channelID: string) {
        this.channelID = channelID;
    }

    connect(url: string) {
        const socket = io(url);
        this.socket = socket;

        socket.on('connect', () => {
            // wait for ready
            socket.on('ready', () => {
                this.onReady.emit();
            });

            socket.on('eval', (text: string) => {
                this.onEval.emit(text);
            });

            socket.emit('chan_out', this.channelID, navigator.userAgent);
        });
    }

    console(type: string, ...args: any[]) {
        this.emit('console', type, args.map(Client.toArg));
    }

    eval(obj: any) {
        this.emit('eval', Client.toArg(obj));
    }

    exception(msg: string, lineno: number, colno: number, stack: string) {
        this.emit(
            'exception',
            Client.toArg(msg, {
                lineno,
                colno,
                stack,
            })
        );
    }

    fetch(url: string, options: any) {
        this.emit('fetch', 'send', url, Client.toArg(options));
    }

    fetchOk(url: string, status: number, type: string) {
        this.emit('fetch', 'ok', url, status, type);
    }

    fetchNOk(url: string, status: number, statusText: string) {
        this.emit('fetch', 'nok', url, status, statusText);
    }

    fetchError(url: string, msg: string) {
        this.emit('fetch', 'error', url, msg);
    }

    xhrOpen(url: string, method: string) {
        this.emit('xhr', 'open', url, method);
    }

    xhrStatus(url: string, status: number) {
        this.emit('xhr', 'status', url, status);
    }

    emit(id: string, ...args: any[]) {
        this.socket?.emit(id, ...args);
    }

    // safe transform to argument, dealing with null & undefined
    static toArg(arg: any, data: any = undefined): ClientArg {
        return {
            isNull: arg === null,
            isUndefined: arg === undefined,
            type: typeof arg,
            json: JSON.stringify(arg),
            data,
        };
    }
}
