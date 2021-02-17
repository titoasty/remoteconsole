import * as Console from 'components/Console';
import * as commands from 'commands';

export default function () {
    function exec() {
        let descs = [];

        const cmds = commands.getCommands();
        for (const name in cmds) {
            const cmd = cmds[name];

            descs.push(`${commands.prefix}${name} ${cmd.desc}`);
        }

        Console.addLine('text', descs.join('\n'));
    }

    return {
        exec,
        desc: '',
    };
}
