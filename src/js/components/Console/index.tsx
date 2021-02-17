import * as React from 'preact';
import styles from './styles.module.scss';
import ConsoleInput from 'components/ConsoleInput';
import { useRef, useEffect, useCallback } from 'preact/hooks';
import ConsoleLine from 'components/ConsoleLine';
import useForceUpdate from 'hooks/useForceUpdate';

let lines = [];

interface ConsoleProps {
    onSubmit: (text: string) => void;
}

export function clear() {
    lines = [];
    _forceUpdate();
}

// dirty, but a shared state was messing with reflow
let _forceUpdate;
export function addLine(type: string, text: string, data?: any) {
    lines = [
        ...lines,
        {
            type,
            text,
            data,
        },
    ];
    _forceUpdate();
}

export function addLines(newLines: Line[]) {
    lines = [...lines, ...newLines];
    _forceUpdate();
}

export default function ({ onSubmit }: ConsoleProps) {
    const consoleWrapperRef = useRef<HTMLDivElement>();
    const forceUpdate = useForceUpdate();
    _forceUpdate = forceUpdate;

    useEffect(() => {
        if (!consoleWrapperRef.current) return;

        consoleWrapperRef.current.scrollTop = consoleWrapperRef.current.scrollHeight;
    });

    return (
        <div className={styles.consoleWrapper} ref={consoleWrapperRef}>
            <div className={styles.console}>
                {lines.map((line) => (
                    <ConsoleLine line={line} />
                ))}
                <ConsoleInput onSubmit={onSubmit} />
            </div>
        </div>
    );
}
