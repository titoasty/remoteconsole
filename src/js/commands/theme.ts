import storage from 'util/storage';
import * as Console from 'components/Console';
import * as commands from 'commands';

export default function () {
    const themes = ['light', 'dark'];

    function exec(theme: string) {
        if (themes.indexOf(theme) < 0) {
            Console.addLine('text', `May be try "${commands.prefix}theme dark" or "${commands.prefix}theme light"`);
            return;
        }

        storage.set('theme', theme);

        themes.forEach((t) => document.documentElement.classList.remove('theme_' + t));
        document.documentElement.classList.add('theme_' + theme);
    }

    return {
        exec,
        desc: 'dark|light',
    };
}
