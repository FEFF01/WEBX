
import list, { component, style } from '../test/index.webx';

document.head.appendChild(style);
document.body.appendChild(component);


setInterval(function () {
    list.push({ name: Math.random().toString(36).slice(2) });
}, 2000);