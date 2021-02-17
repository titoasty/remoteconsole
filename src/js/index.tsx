import * as React from 'preact';
import App from 'pages/App';
import storage from 'util/storage';

React.render(<App />, document.getElementById('app'));

document.documentElement.classList.add('theme_' + storage.get('theme', 'light'));

// `(function(){var s=document.createElement("script");s.src="https://remotejs.com/agent/agent.js";s.setAttribute("data-consolejs-channel","807b9d8d-6ce4-d67c-e4be-7e0c2345d767");document.head.appendChild(s);})()`
// `<script data-consolejs-channel="807b9d8d-6ce4-d67c-e4be-7e0c2345d767" src="https://remotejs.com/agent/agent.js"></script>`
// `javascript:(function(){var s=document.createElement("script");s.src="https://remotejs.com/agent/agent.js";s.setAttribute("data-consolejs-channel","807b9d8d-6ce4-d67c-e4be-7e0c2345d767");document.head.appendChild(s);})();`
