!function(t){var e={};function n(i){if(e[i])return e[i].exports;var r=e[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(i,r,function(e){return t[e]}.bind(null,r));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=59)}({16:function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.createComponent=e.createTextNode=e.createElement=e.insertBefore=e.appendChild=e.removeNode=e.addEventListener=e.setText=e.setAttribute=e.removeAllSibling=e.entryStatement=e.nextEntrySibling=e.nextIfSibling=e.setNodes=e.nextNodes=e.nextSibling=e.nextChild=e.observable=e.runInAction=e.action=e.autorun=e.prevent=void 0;const i=n(6);Object.defineProperty(e,"observable",{enumerable:!0,get:function(){return i.observable}}),Object.defineProperty(e,"action",{enumerable:!0,get:function(){return i.action}}),Object.defineProperty(e,"runInAction",{enumerable:!0,get:function(){return i.runInAction}});const r=n(18),o=n(19);function s(t){return i.sandbox(t,1)()}function l(t,e){return new i.Subscriber(t,e?i.SUBSCRIBE_OPTION.PREVENT_COLLECT:i.SUBSCRIBE_OPTION.DEFAULT).mount().res}function u(t){return t.removeAllSibling()}function c(t){return t.nextSibling()}function a(t,e,n){let i=t.nextSibling();n?l((function(){let t=e();t instanceof Array?l((function(){i.setNodes(t)})):i.setNodes(t)}),!0):i.setNodes(e)}function f(t,e,n,i){let o=t instanceof Array?new r.NodeList(t):new r.Children(t);return void 0!==e&&(n?l((function(){let t=e();t instanceof Array?l((function(){o.setNodes(t)})):o.setNodes(t)}),i):o.setNodes(e)),o}function h(t,e,n,i){i?t[e]=n:t.setAttribute(e,n)}function d(t,e){t.data!==e&&(t.data=e)}function p(t,...e){t.addEventListener(...e)}function b(t){let e=t.parentElement;e&&e.removeChild(t)}function g(t,e){t.appendChild(e)}function _(t,e,n){t.insertBefore(e,n)}function x(t){return document.createElement(t)}function v(t){return document.createTextNode(t)}function y(t,e){t.setNodes(e)}function m(t,e,n){switch(!0){case e&&n&&!0:return function(){let r=i.observable({children:[]});e(r);let o=t(r);if(null!=o)return i.runInAction((function(){n(r.children)})),o};case n&&!0:return function(){let e=i.observable({children:[]}),r=t(e);if(null!=r)return i.runInAction((function(){n(e.children)})),r};case e&&!0:return function(){let n=i.observable({});return e(n),t(n)};default:return function(){return t(i.observable({}))}}}Object.defineProperty(e,"entryStatement",{enumerable:!0,get:function(){return o.entryStatement}}),Object.defineProperty(e,"nextIfSibling",{enumerable:!0,get:function(){return o.nextIfSibling}}),Object.defineProperty(e,"nextEntrySibling",{enumerable:!0,get:function(){return o.nextEntrySibling}}),e.prevent=s,e.autorun=l,e.removeAllSibling=u,e.nextSibling=c,e.nextNodes=a,e.nextChild=f,e.setAttribute=h,e.setText=d,e.addEventListener=p,e.removeNode=b,e.appendChild=g,e.insertBefore=_,e.createElement=x,e.createTextNode=v,e.setNodes=y,e.createComponent=m;let S={prevent:s,autorun:l,action:i.action,runInAction:i.runInAction,observable:i.observable,nextChild:f,nextSibling:c,nextNodes:a,setNodes:y,nextIfSibling:o.nextIfSibling,nextEntrySibling:o.nextEntrySibling,entryStatement:o.entryStatement,removeAllSibling:u,setAttribute:h,setText:d,addEventListener:p,removeNode:b,appendChild:g,insertBefore:_,createElement:x,createTextNode:v,createComponent:m};("object"==typeof window?window:t)._webx=S,e.default=S}).call(this,n(2))},18:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.NodeList=e.Children=e.Sibling=void 0;const i=n(6),r=new WeakMap;class o{constructor(t,e){this.target=t,this.prev=e,this.nodes=[],this.siblings=[],(e||(this.prev=e=r.get(t)))&&(e.next&&(e.next.prev=this,this.next=e.next),e.next=this),r.set(t,this)}moveTo(t){let e=this.index,n=this.parent;if(e===t)return;let i=n.siblings;i.splice(e,1);let r=this.firstSibling(),o=this.lastSibling(),s=r.prev,l=o.next;s&&(s.next=l),l&&(l.prev=s);let u=i[t]||n.lastSibling().next,c=u&&u.firstNode(),a=u?u.prev:n.lastSibling();c?this.insertBefore(c):this.appendTo(),a&&(a.next=r),u&&(u.prev=o),r.prev=a,o.next=u,t=Math.min(t,i.length),i.splice(t,0,this);for(let n=Math.min(e,t),r=Math.max(e,t);n<=r;n++)i[n].index=n}firstNode(){let t=this.nodes;return t.length?t[0]:this.next&&this.next.firstNode()}firstSibling(){return this}lastSibling(){let t=this.siblings[this.siblings.length-1];return t?t.lastSibling():this}nextSibling(){if(!this.target)return this;let t=new this.constructor(this.target,this.lastSibling()),e=this.siblings;return t.parent=this,t.index=e.length,e.push(t),t}removeAllSibling(){let t=this.siblings;for(let e=t.length-1;e>=0;e--)this.removeSibling(t[e])}removeSibling(t){let e=this.siblings,n=t.index;if(e[n]===t){let i=t.prev,r=t.lastSibling(),o=r.next;for(t.prev=null,r.next=null,i&&(i.next=o),o&&(o.prev=i),t.setNodes(null),e.splice(n,1);n<e.length;)e[n++].index-=1;t.removeAllSibling(),t.target=null}}destory(){this.parent.removeSibling(this)}}function s(t){let e=[];return function t(n){n instanceof Array?n.forEach(t):null!=n&&e.push(n)}(t),e}e.Sibling=o;e.Children=class extends o{constructor(){super(...arguments),this.insertBefore=t=>{let e=t.parentElement;for(let n of this.nodes)e.insertBefore(n,t);for(let e of this.siblings)e.insertBefore(t)}}setNodes(t){if(!this.target)return;let e=this.target,n=s(t),i=this.nodes,r=[],o=this.next&&this.next.firstNode();function l(){for(let t=r.length;t<i.length;t++){let e=i[t];r.includes(e)||_webx.removeNode(e)}}n.length?function t(){let s=r.length,u=n.shift(),c=i[s];u instanceof Node||(s<i.length&&c.nodeType===Node.TEXT_NODE?(_webx.setText(c,u),u=c):u=_webx.createTextNode(u));s<i.length&&(c===u||n.includes(c)||r.includes(c)||_webx.removeNode(c));r.push(u),n.length?t():l(),o?o.previousSibling!==u&&_webx.insertBefore(e,u,o):_webx.appendChild(e,u);o=u}():l(),this.nodes=r}appendTo(){for(let t of this.nodes)this.target.appendChild(t);for(let t of this.siblings)t.appendTo()}};e.NodeList=class extends o{constructor(t,e){super(t,e),this.insertBefore=t=>{let e=this.target,n=this.raw,i=this.nodes;if(i.length){e.splice(n.indexOf(i[0]),i.length);let r=n.indexOf(t);e.splice(r,0,...i)}for(let e of this.siblings)e.insertBefore(t)},this.raw=i.Observer.TO_RAW(t)}setNodes(t){if(!this.target)return;let e,n,i=s(t),r=this.nodes,o=[],l=0;for(;i.length;)n=i.shift(),n instanceof Node||(l<r.length&&(e=r[l]).nodeType===Node.TEXT_NODE?(_webx.getText(e)!=n&&_webx.setText(e,n),n=e):n=_webx.createTextNode(n)),o.push(n),l+=1;let u=this.target,c=this.raw;if(r.length)u.splice(c.indexOf(r[0]),r.length,...o);else{let t=this.next&&this.next.firstNode();t?u.splice(c.indexOf(t),0,...o):u.push(...o)}this.nodes=o}appendTo(){let t=this.target,e=this.raw,n=this.nodes;if(n.length){t.splice(e.indexOf(n[0]),n.length);for(let e of n)t.push(e)}for(let t of this.siblings)t.appendTo()}removeAllNodes(){let t=this.target,e=this.raw,n=this.nodes;n.length&&(t.splice(e.indexOf(n[0]),n.length),n.length=0)}}},19:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.nextEntrySibling=e.nextIfSibling=e.entryStatement=void 0;const i=n(6);e.entryStatement=function(t,e){if(!t)return;let n=Object.keys(t),i=Object.values(t);for(let r=0,o=n.length;r<o;r++)e(i[r],n[r],r,t)},e.nextIfSibling=function(t,e,n,r){let o,s=i.Subscriber.PARENT;i.watch(e,(function(e,l){let u;o&&!e==!l||(u=e?n:r,o&&(o.unmount(),t.removeAllSibling()),o=u&&new i.Subscriber(u),o&&o.mount(s))}),!0)},e.nextEntrySibling=function(t,e,n){let r,o;t&&(t.removeAllSibling(),r=t.siblings);let s,l,u,c,a,f,h=[],d=[],p=[],b=[];function g(t,e,n,i){s[i]=t,l[i]=e,u[i]=n,c[i]=i}function _(t,e){if(0===t&&1===e)return h.shift(),d.shift(),p.shift(),void b.shift();h.splice(t,e),d.splice(t,e),p.splice(t,e),b.splice(t,e)}const x=i.action((function(e,n,i,r){let o=h[e],s=o[0];g(o,n,i,r),b[e]!==r&&(t&&o[2].moveTo(r),s.i=r),p[e]!==i&&(s.k=i),d[e]!==n&&(s.v=n)}));function v(e){let n=h[e];n[1].parent=m.parent,n[1].unmount(),t&&n[2].destory(),_(e,1)}function y(e,s,l){let u=i.observable({v:e,k:s,i:l,t:o}),c=t&&r.length,a=new i.Subscriber((function(){n(u)}),i.SUBSCRIBE_OPTION.PREVENT_COLLECT).mount(m.parent);a.parent=m;let f=t&&r[c];g([u,a,f],e,s,l),t&&f.moveTo(l)}let m=new i.Subscriber((function(){let t,e=m.brokens,n=e.map(t=>t.accu);if(o=S(),a=[],f=[],null!=o){let t=i.Observer.TO_OB(o);if(t){let e=t.target;t.collect(i.MASK_ITERATE,1);for(let n in e)t.collect(n,2),a.push(n),f.push(i.observable(e[n]))}else a=Object.keys(o),f=Object.values(o)}s=[],l=[],u=[],c=[];let r,g,O,E=0,T=f.length;for(;E<T;)if(g=f.shift(),O=a.shift(),d.length&&(r=d.indexOf(g),r<0?(r=p.indexOf(O),r>=0?(t=d[r],t&&"object"==typeof t&&f.includes(t)&&(r=-1)):f.includes(d[0])||(r=0)):b[r]!==E&&p[r]!==O&&"object"!=typeof g&&(t=a.indexOf(p[r]),t>=0&&f[t]===d[r]&&(r=f.includes(d[0])?-1:0)),r>=0)){for(t=r,x(r++,g,O,E++);f.length&&r<d.length&&f[0]===d[r];)x(r++,f.shift(),a.shift(),E++);_(t,r-t)}else y(g,O,E++);for(;d.length;)v(0);h=s,d=l,p=u,b=c;for(let t,i=0;i<e.length;i++)t=e[i],t.accu!==n[i]||void 0===t.parent||t.is_run||t.update()})),S=i.computed(e,m);m.mount()}},2:function(t,e){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(t){"object"==typeof window&&(n=window)}t.exports=n},59:function(t,e,n){"use strict";n.r(e);var i=n(16);for(var r in i)["default"].indexOf(r)<0&&function(t){n.d(e,t,(function(){return i[t]}))}(r)},6:function(t,e,n){"use strict";(function(t){var n;Object.defineProperty(e,"__esModule",{value:!0}),e.MASK_UNDEFINED=e.MASK_ITERATE=e.reaction=e.watch=e.computed=e.SUBSCRIBE_OPTION=e.transacts=e.runInSandbox=e.sandbox=e.runInAction=e.action=e.runInAtom=e.atom=e.autorun=e.observable=e.Subscriber=e.Observer=void 0,function(t){t[t.DEFAULT=0]="DEFAULT",t[t.PREVENT_COLLECT=1]="PREVENT_COLLECT",t[t.COMPUTED=2]="COMPUTED"}(n||(n={})),e.SUBSCRIBE_OPTION=n;const i="object"==typeof window?window:t,r=[],o=[],s=[],l=[],u=new WeakMap,c=[],a=["iterate"];e.MASK_ITERATE=a;const f=["undefined"];e.MASK_UNDEFINED=f;class h{constructor(t){switch(this.target=t,this.refmap=new Map,this.ownmap=new Map,this._has=t=>t in this.target,this._val=t=>this.target[t],this._del=t=>delete this.target[t],this._set=(t,e)=>this.target[t]=e,this._proxy_handler={get:(t,e)=>{let n=t[e];return"__proto__"!==e&&(n=w(n),this.collect(e)),n},set:(t,e,n)=>{let i=t[e],r=u.get(n),o=r?r.target:n,s=t.hasOwnProperty(e),l=M(i,o);return l&&s||x(()=>{t[e]=o,s||(this.notify(e,!1,1),this.notify(a,a,1)),l||this.notify(e,i)}),!0},ownKeys:t=>(this.collect(a,1),p(t)),has:(t,e)=>(this.collect(e,1),e in t),deleteProperty:(t,e)=>x(()=>(t.hasOwnProperty(e)&&(this.notify(e,t[e]),this.notify(e,!0,1),this.notify(a,a,1)),delete t[e]))},!0){case t instanceof WeakSet:case t instanceof WeakMap:case t instanceof Map:case t instanceof Set:!function(t){var e;let n=t.target,i=n.__proto__,r=new h({}),o=(null===(e=Object.getOwnPropertyDescriptor(i,"size"))||void 0===e?void 0:e.get.bind(n))||function(){},s=n instanceof Map||n instanceof WeakMap;t.release=function(){return r.release(),t.release()},r._has=i.has.bind(n),r._val=s?function(t){return i.get.call(n,t)}:function(t){return i.has.call(n,t)?t:f};function l(t){return r.collect(t[0]),[t[0],w(t[1])]}function c(t){return r.collect(t[0]),w(t[1])}r._del=function(t){return i.delete.call(n,t)},r._set=i.set?function(t,e){return i.set.call(n,t,e)}:function(t,e){return i.add.call(n,t)};let d=Object.assign({get:t=>(r.collect(t),w(i.get.call(n,t))),set(t,e){let o=u.get(t);o&&(t=o.target);let s=i.has.call(n,t),l=s?i.get.call(n,t):f;return s&&M(l,e)||x(()=>{i.set.call(n,t,e),s||(r.notify(t,!1,1),r.notify(a,a,1)),r.notify(t,l)}),this},add(e){return i.has.call(n,e)||x(()=>{let s=o();i.add.call(n,e),void 0!==s&&t.notify("size",s,6),r.notify(e,!1,1),r.notify(e,f),r.notify(a,a,1)}),this},delete(e){let s=i.get,l=s?s.call(n,e):e,u=o(),c=i.delete.call(n,e);return c&&x(()=>{r.notify(e,l),r.notify(e,!0,1),r.notify(a,a,1),void 0!==u&&t.notify("size",u,6)}),c},clear(){let e=o();e&&x(()=>{i.forEach.call(n,(t,e)=>{r.notify(e,t),r.notify(e,!0,1)}),r.notify(a,a,1),t.notify("size",e,6),i.clear.call(n)})},forEach:(t,...e)=>(r.collect(a,1),i.forEach.call(n,(function(e,...n){t(w(e),...n)}),...e)),has:t=>(r.collect(t,1),i.has.call(n,t)),size:o},[["keys",t=>t[0]],["entries",l],["values",c],[Symbol.iterator,s?l:c]].reduce((function(t,[e,o]){let s=i.entries;return s&&(t[e]=function(){r.collect(a,1);let t=s.call(n),e=t.next.bind(t);return t.next=function(){let{done:t,value:n}=e();return t||(n=o(n)),{done:t,value:n}},t}),t}),{})),b={},g=p(i);for(let t of g){let e=d[t],n=Object.getOwnPropertyDescriptor(i,t);e&&(void 0!==n.value?n.value=e:n.get=e),b[t]=n}n.__proto__=Object.create(n.__proto__.__proto__,b)}(this);break;case t[Symbol.iterator]:case t instanceof Array:!function(t){let e=t.target,n=e.__proto__;e.__proto__=Object.create(n,Array.prototype.concat.call(["push","pop","shift","unshift","splice","sort","reverse"].map((function(t){const e=n[t];return e&&[t,function(){let t=arguments;return x(()=>e.apply(this,t))}]})),["values",Symbol.iterator].map((function(i){return n[i]&&[i,function(){t.collect(a,1);let n=0,i=t.proxy;return{next(){let r,o=n>=e.length;return o||(t.collect(n),r=i[n++]),{done:o,value:r}}}}]}))).reduce((function(t,e){return e&&(t[e[0]]={value:e[1]}),t}),{}));let i=t._proxy_handler.set;t._proxy_handler.set=function(n,r,o){let s=e.length;return x((function(){let l=i(n,r,o);return e.length!==s&&"length"!==r&&t.notify("length",s,10),l}))}}(this)}this.proxy=new Proxy(t,this._proxy_handler),u.set(this.proxy,this),u.set(t,this)}static TO_RAW(t){let e=u.get(t);return e?e.target:t}static TO_OB(t){return u.get(t)}collect(t,e=2){let i=r[0];if(i&&!(i.option&n.PREVENT_COLLECT)){let n=this._map(e),r=n.get(t);r||n.set(t,r=new Set),i.depend(r)}}release(){for(let t of[this.refmap,this.ownmap])t.forEach(t=>{t.forEach(e=>e.undepend(t))}),t.clear()}notify(t,e,n=2){let i=[this,t,e,n];c.length&&c[0][0].push(i);let r=this._map(n).get(t);if(r&&r.size)if(l.length)r.forEach(t=>t.addRecord(i));else{let t,e=Number.MAX_SAFE_INTEGER;r.forEach(n=>{t.push(n),e>n.depth&&(e=n.depth)}),C(t,e)}}_map(t){return 2&t?this.refmap:this.ownmap}}e.Observer=h;class d{constructor(t,e=n.DEFAULT){this.fn=t,this.option=e,this.depth=0,this.children=[],this._deps=new Set,this._once={},this.is_run=!1,this.brokens=[],this.accu=0}static get PARENT(){return r[0]}undepend(t){this._deps.delete(t),t.delete(this)}depend(t){this._deps.add(t),t.add(this),this.option&n.COMPUTED&&this.parent&&void 0!==this.parent.parent&&this.parent.depend(t)}clear(t){if(this._deps.forEach(t=>t.delete(this)),this._deps.clear(),!t)for(let t of this.children)t.emit("unmount"),t.clear(),t.parent=void 0;this.children.length=0}once(t,e){let n=this._once;(n[t]||(n[t]=[])).push(e)}emit(t){let e=this._once,n=e[t];if(n){for(let t of n)t();delete e[t]}}unmount(t){if(this.emit("unmount"),this.clear(t),!t){let t=this.parent&&this.parent.children;if(t&&t.splice(t.indexOf(this),1),this._sandbox){let t=this._sandbox[1].indexOf(this);t>=0&&this._sandbox[1].splice(t,1)}}this._sandbox=void 0,this.parent=void 0}mount(t){if(void 0!==this.parent)return new d(this.fn).mount(t);if(this.parent=t||r[0],this.parent){if(void 0===this.parent.parent)return this.parent=void 0,this;this.depth=this.parent.depth+1}else this.parent=null;return c.length&&(this._sandbox=c[0],this._sandbox[1].push(this)),this.parent&&this.parent.children.push(this),this._run(),this}update(){return this.clear(),this._run()}addRecord(t){let e=s.indexOf(this);e<0||o[e][0]<l.length?(o.unshift([l.length,[t]]),s.unshift(this)):o[e][1].push(t),this.option&n.COMPUTED&&this.parent&&void 0!==this.parent.parent&&this.parent.addRecord(t)}_run(){this.is_run=!0,r.unshift(this),this.accu+=1;try{return this.res=this.fn()}catch(t){throw t}finally{r.shift(),this.is_run=!1,this.brokens.length=0}}}function p(t){return Array.prototype.concat.call(Object.getOwnPropertySymbols(t),Object.getOwnPropertyNames(t))}function b(t,e,...n){!function(t){let e=l[0];void 0===t&&(t=e?2&e[0]:1);l.unshift([t])}(t);try{return e(...n)}catch(t){throw t}finally{!function(){let t=[],e=Number.MAX_SAFE_INTEGER,n=l.length,i=l.shift();if(n>1&&(16&i[0]||2&i[0]&&2&l[0][0])){let t=[],e=[];for(;s.length&&o[0][0]>=n;){let i=s.shift(),r=o.shift(),l=s.indexOf(i);l<0||o[l][0]>=n?(t.push([n-1,r[1]]),e.push(i)):o[l][1].push(...r[1])}return void(e.length&&(o.unshift(...t),s.unshift(...e)))}for(;s.length&&o[0][0]>=n;){let n=s.shift(),i=o.shift();if(t.indexOf(n)<0&&P(i[1])){let i;for(;(i=s.lastIndexOf(n))>=0;)s.splice(i,1),o.splice(i,1);e=Math.min(e,n.depth),t.unshift(n)}}t.length&&(8&i[0]?y((function(){C(t,e)})):C(t,e))}()}}function g(t){return b.bind(null,t,2)}e.Subscriber=d,e.transacts=b,e.atom=g;const _=b.bind(null,2);e.runInAtom=_;const x=b.bind(null,18);function v(t){return b.bind(null,1,t)}e.action=v;const y=b.bind(null,1);function m(t,e=7){return O.bind(null,e,t)}e.runInAction=y,e.sandbox=m;const S=O.bind(null,7);function O(t,e,...i){let o=c[0],s=r[0],l=s&&s.option,u=4&t||!o?[]:o[1],a=u.length,f=4&t||!o?[]:o[0];s&&(s.option=1&t?l|n.PREVENT_COLLECT:l&~n.PREVENT_COLLECT),c.unshift([f,u,t|(o&&4&o[2])]);try{return e(...i)}catch(t){throw t}finally{if(c.shift(),4&t&&function(t){let e=[];P(t,(function(t){let n=t[0],i=t[1],r=t[3];if(1&r)n._del(i);else if(4&~r){if(8&r)return void e.push(t);n._set(i,t[2])}}));for(let t of e)t[0]._set(t[1],t[2])}(f),2&t){for(let t=u.length-1;t>=a;t--){let e=u[t];e.unmount(e.parent!==s)}u.length=a}else o&&4&t&&Array.prototype.push.apply(o[1],u);s&&(s.option=l)}}function E(t){let e=new d(t);return e.mount(),function(){e.unmount()}}e.runInSandbox=S,e.autorun=E;const T=new Set([Object,Array,Map,Set,WeakMap,WeakSet]);function w(t){if(t&&"object"==typeof t){let e=u.get(t);if(e)t=e.proxy;else{let e=t.constructor;(T.has(e)||i[e.name]!==e)&&(t=new h(t).proxy)}}return t}function N(t,e=null){let i,r=0,o=new d((function(){(r^=1)&&(i=t())}),n.COMPUTED);return o.parent=e,function(){return r||o.update(),i}}function A(t,e,n){let i=[],r=new d((function(){if(i.unshift(t()),i.length>1){let[t,n]=i;M(t,n)||e(t,n)}else 1===i.length&&n&&e(i[0]);i.length=1}));return r.mount(),function(){r.unmount()}}function I(t,e){return A(t,(function(t,n){M(t,n)||e(t)}))}function P(t,e){let n=new Map,i=!1;for(let r of t){let t=r[0],o=r[1],s=n.get(t);if(s){if(s.has(o))continue;s.add(o)}else n.set(t,new Set([o]));if(!M(1!==r[3]?t._val(o):t._has(o),r[2])){if(!e)return!0;-1===e(r)&&s.delete(o),i=!0}}return i}function C(t,e=0){let i=c[0],r=i&&4&i[2]&&i[1];const o=function(t){return!r||r.indexOf(t)>=0};let s,l;t:for(let i=t.length-1;i>=0;i--)if(s=t[i],s.option&n.COMPUTED)t.splice(i,1),s.update();else{for(;(s=s.parent)&&s.depth>=e&&!s.is_run&&o(s);)if(l=t.indexOf(s),l>=0){t[l].brokens.unshift(t[i]),t.splice(i,1);continue t}s=t[i],!s.is_run&&o(s)||t.splice(i,1)}for(let e=0;e<t.length;e++)s=t[e],void 0!==s.parent&&s.update()}function M(t,e){return t===e||t!=t&&e!=e}e.observable=w,e.computed=N,e.watch=A,e.reaction=I;let j={Observer:h,Subscriber:d,observable:w,autorun:E,atom:g,runInAtom:_,action:v,runInAction:y,sandbox:m,runInSandbox:S,transacts:b,SUBSCRIBE_OPTION:n,computed:N,watch:A,reaction:I,MASK_ITERATE:a,MASK_UNDEFINED:f};i._obb=j}).call(this,n(2))}});
//# sourceMappingURL=runtime.js.map