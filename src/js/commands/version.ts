import * as Console from 'components/Console';

export default function () {
    function exec() {
        Console.addLine('text', process.env.VERSION);
    }

    return {
        exec,
        desc: '',
    };
}
