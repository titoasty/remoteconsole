import * as React from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import styles from './styles.module.scss';

import { splitNewlines, parseNewlines } from 'util/reactutil';

interface LineExceptionProps {
    line: Line;
    copyRef: React.RefObject<() => string>;
}

export default function ({ line, copyRef }: LineExceptionProps) {
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        copyRef.current = () => line.text + '\n' + line.data.stack;
    }, [line]);

    const toggle = useCallback(() => {
        setShowContent(!showContent);
    }, [showContent]);

    return (
        <div>
            <div className={styles.title} onClick={toggle}>
                {line.data?.title && <b>{line.data.title}</b>}
                {splitNewlines(parseNewlines(line.text || ''))}
            </div>
            {showContent && (
                <div className={styles.content}>
                    <br />
                    {splitNewlines(line.data.stack)}
                </div>
            )}
        </div>
    );
}
