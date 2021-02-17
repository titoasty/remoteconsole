import * as React from 'preact';
import styles from './styles.module.scss';

import { parseNewlines, splitNewlines } from 'util/reactutil';
import { useEffect } from 'preact/hooks';

interface LineDefaultProps {
    line: Line;
    copyRef: React.RefObject<() => string>;
}

export default function ({ line, copyRef }: LineDefaultProps) {
    useEffect(() => {
        copyRef.current = () => line.text;
    }, [line]);

    return (
        <div className={styles.line}>
            {line.data?.title && <b className={styles.title}>{line.data.title}</b>}
            {splitNewlines(parseNewlines(line.text || ''))}
        </div>
    );
}
