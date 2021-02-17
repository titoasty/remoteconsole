import * as React from 'preact';
import { useEffect, useRef, useCallback, useState } from 'preact/hooks';
import styles from './styles.module.scss';
import { joinClassNames } from 'util/reactutil';
import CmdHistory from './CmdHistory';
import autosize from 'autosize';

import SvgSend from './images/svg-send';

function getCaret(el: any) {
    if (el.selectionStart) {
        return el.selectionStart;
        //@ts-ignore
    } else if (document.selection) {
        el.focus();
        //@ts-ignore
        const r = document.selection.createRange();
        if (r == null) {
            return 0;
        }
        const re = el.createTextRange(),
            rc = re.duplicate();
        re.moveToBookmark(r.getBookmark());
        rc.setEndPoint('EndToStart', re);
        return rc.text.length;
    }

    return 0;
}

interface ConsoleInputProps {
    onSubmit: (text: string) => void;
    className?: string;
}

export default function ({ onSubmit, className }: ConsoleInputProps) {
    const textareaRef = useRef<HTMLTextAreaElement>();
    const [cmdHistory] = useState(new CmdHistory());

    function updateTextareaHeight() {
        // const nbLines = (textareaRef.current.value.match(/\n/g) || '').length + 1;
        // textareaRef.current.setAttribute('rows', nbLines + '');
        autosize.update(textareaRef.current);
    }

    function updateInputFromHistory() {
        textareaRef.current.value = cmdHistory.current();
        updateTextareaHeight();
    }

    const submit = useCallback(() => {
        if (textareaRef.current.value.trim().length <= 0) return;

        onSubmit(textareaRef.current.value);
        cmdHistory.push();
        updateInputFromHistory();

        // clear text
        textareaRef.current.value = '';
    }, [textareaRef.current]);

    useEffect(() => {
        const $textarea = textareaRef.current;

        // enter
        function onKeyPress(evt: any) {
            if (evt.keyCode !== 13) return;

            const text = evt.target.value;
            const caret = getCaret(this);

            // shift-enter
            if (evt.shiftKey) {
                // split text
                evt.target.value = text.substring(0, caret) + '\n' + text.substring(caret, text.length);

                // reposition caret
                evt.target.setSelectionRange(caret + 1, caret + 1);
                onInput();
            } else {
                submit();
            }

            evt.stopPropagation();
            evt.preventDefault();
        }

        // up/down
        function onKeyDown(evt: any) {
            if (evt.keyCode === 38 && cmdHistory.up()) {
                updateInputFromHistory();
                evt.stopPropagation();
                evt.preventDefault();
            } else if (evt.keyCode === 40 && cmdHistory.down()) {
                updateInputFromHistory();
                evt.stopPropagation();
                evt.preventDefault();
            }
        }

        $textarea.addEventListener('keypress', onKeyPress, false);
        $textarea.addEventListener('keydown', onKeyDown, false);

        autosize($textarea);

        return () => {
            $textarea.removeEventListener('keypress', onKeyPress, false);
            $textarea.removeEventListener('keydown', onKeyDown, false);

            autosize.destroy($textarea);
        };
    }, []);

    const onInput = useCallback(() => {
        if (!textareaRef.current) return;

        updateTextareaHeight();
        cmdHistory.update(textareaRef.current.value);
    }, [cmdHistory, textareaRef.current]);

    return (
        <div className={joinClassNames(styles.consoleinput, className)}>
            <textarea autofocus spellcheck={false} className={styles.input} ref={textareaRef} onInput={onInput} />
            <div className={styles.btnSend} onClick={submit}>
                <SvgSend />
            </div>
        </div>
    );
}
