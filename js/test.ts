
import list, { element } from '../test/index.webx';

document.body.appendChild(element);


setInterval(function () {
    list.push({ name: Math.random().toString(36).slice(2) });
}, 2000);