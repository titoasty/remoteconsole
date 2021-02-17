import * as Console from 'components/Console';

export default function () {
    function exec() {
        const str = `Made by <a href="https://github.com/titoasty" target="_blank">nico-boo</a>`; // - <a href="#" target="_blank">donate</a>`;
        Console.addLine('html', str);
    }

    return {
        exec,
        desc: '',
    };
}
