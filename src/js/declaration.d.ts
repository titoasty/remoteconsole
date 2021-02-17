// declaration.d.ts
declare module '*.scss';
declare module '*.module';
declare module '!!*';
declare module '*.glsl';
declare module '*.png';
declare module '*.svg';

interface Window {}

interface ClientArg {
    isUndefined?: boolean;
    isNull?: boolean;
    type: string;
    json?: string;
    raw?: any;
    data?: any;
}

interface Line {
    type: string;
    text?: string;
    data?: any;
}