import * as React from 'preact';

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

    return <div dangerouslySetInnerHTML={{ __html: parseNewlines(line.text || '').replace('\n', '<br/>') }}></div>;
}
