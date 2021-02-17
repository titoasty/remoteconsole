import storage from 'util/storage';
import { useState } from 'preact/hooks';

let _setTheme;
export function set(name: string) {
    for (const clazz of Array.from(document.documentElement.classList)) {
        if (clazz.startsWith('theme_')) document.documentElement.classList.remove(clazz);
    }

    document.documentElement.classList.add('theme_' + name);

    _setTheme(name);
}

export default function () {
    const [theme, setTheme] = useState(storage.get('theme', 'light'));
    _setTheme = setTheme;

    return theme;
}
