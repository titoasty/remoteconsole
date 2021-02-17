import * as React from 'preact';
import { useCallback, useRef, useEffect } from 'preact/hooks';
import styles from './styles.module.scss';

import { joinClassNames, splitNewlines, parseNewlines } from 'util/reactutil';
import LineException from './LineException';
import LineDefault from './LineDefault';
import LineHTML from './LineHTML';
import { copyToClipboard } from 'util/miscutil';

import SvgEval from './images/svg-eval';
import SvgReturn from './images/svg-return';
import SvgWarn from './images/svg-warn';
import SvgError from './images/svg-error';
import SvgInfo from './images/svg-info';
import SvgSuccess from './images/svg-success';

interface ConsoleLineProps {
    line: Line;
}

const Components = {
    exception: LineException,
    default: LineDefault,
    html: LineHTML,
};

export default function ({ line }: ConsoleLineProps) {
    const Component = Components[line.type] || Components.default;
    const copyRef = useRef<() => string>();

    const copy = useCallback(() => {
        copyToClipboard(copyRef.current());
    }, [line]);

    return (
        <div className={joinClassNames(styles.line, styles['line_' + line.type])}>
            <Component line={line} copyRef={copyRef} />
            <div className={styles.buttons}>
                <button className={styles.btn_copy} title="Copy" onClick={copy}></button>
            </div>
            <div className={styles.line_icon}>
                {line.type === 'eval' && <SvgEval />}
                {line.type === 'return' && <SvgReturn />}
                {line.type === 'warn' && <SvgWarn />}
                {line.type === 'error' && <SvgError />}
                {line.type === 'info' && <SvgInfo />}
                {line.type === 'success' && <SvgSuccess />}
                {line.type === 'exception' && <SvgError />}
            </div>
        </div>
    );
}
