import { addLines } from 'components/Console';
import { getRemoteConsole } from 'pages/App';

export default function () {
    function exec() {
        const channelID = getRemoteConsole().channelID;

        addLines([
            {
                type: 'info',
                text: `<script data-remoteconsole-channel="${channelID}" src="${window.location.protocol + '//' + window.location.hostname}/agent.js"></script>`,
            },
        ]);
    }

    return {
        exec,
        desc: 'display <script> tag to include',
    };
}
