import * as Console from 'components/Console';

export default function () {
    function exec() {
        Console.clear();
    }

    return {
        exec,
        desc: '',
    };
}
