!function(e){var t={};function n(i){if(t[i])return t[i].exports;var r=t[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(i,r,function(t){return e[t]}.bind(null,r));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=56)}({16:function(e,t){!function(e,t){for(var n in t)e[n]=t[n]}(t,function(e){var t={};function n(i){if(t[i])return t[i].exports;var r=t[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(i,r,function(t){return e[t]}.bind(null,r));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s="./js/runtime.js")}({"./js/core/runtime/index.ts":
/*!**********************************!*\
  !*** ./js/core/runtime/index.ts ***!
  \**********************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.createTextNode=t.createElement=t.insertBefore=t.appendChild=t.addEventListener=t.setText=t.setAttribute=t.removeAllSibling=t.entryStatement=t.nextEntrySibling=t.nextIfSibling=t.setNodes=t.nextNodes=t.nextSibling=t.nextChild=t.observable=t.runInAction=t.action=t.autorun=t.prevent=void 0;const i=n(/*! ../../obb/js/obb */"./js/obb/js/obb.ts");Object.defineProperty(t,"observable",{enumerable:!0,get:function(){return i.observable}}),Object.defineProperty(t,"action",{enumerable:!0,get:function(){return i.action}}),Object.defineProperty(t,"runInAction",{enumerable:!0,get:function(){return i.runInAction}});const r=n(/*! ./siblings */"./js/core/runtime/siblings.ts"),o=n(/*! ./polyfill */"./js/core/runtime/polyfill.ts");function s(e){return i.sandbox(e,1)()}function l(e,t){return new i.Subscriber(e,t?i.SUBSCRIBE_OPTION.PREVENT_COLLECT:i.SUBSCRIBE_OPTION.DEFAULT).mount().res}function u(e){return e.removeAllSibling()}function c(e){return e.nextSibling()}function a(e,t){return e.nextSibling().setNodes(t)}function f(e,t,n,i){let o=e instanceof Array?new r.NodeList(e):new r.Children(e);return void 0!==t&&(n?l((function(){o.setNodes(t())}),i):o.setNodes(t)),o}function d(e,t,n,i){i?e[t]=n:e.setAttribute(t,n)}function h(e,t){e.data=t}function p(e,...t){e.addEventListener(...t)}function b(e,t){e.appendChild(t)}function g(e,t,n){e.insertBefore(t,n)}function v(e){return document.createElement(e)}function x(e){return document.createTextNode(e)}function y(e,t){e.setNodes(t)}Object.defineProperty(t,"entryStatement",{enumerable:!0,get:function(){return o.entryStatement}}),Object.defineProperty(t,"nextIfSibling",{enumerable:!0,get:function(){return o.nextIfSibling}}),Object.defineProperty(t,"nextEntrySibling",{enumerable:!0,get:function(){return o.nextEntrySibling}}),t.prevent=s,t.autorun=l,t.removeAllSibling=u,t.nextSibling=c,t.nextNodes=a,t.nextChild=f,t.setAttribute=d,t.setText=h,t.addEventListener=p,t.appendChild=b,t.insertBefore=g,t.createElement=v,t.createTextNode=x,t.setNodes=y;let _={prevent:s,autorun:l,action:i.action,runInAction:i.runInAction,observable:i.observable,nextChild:f,nextSibling:c,nextNodes:a,setNodes:y,nextIfSibling:o.nextIfSibling,nextEntrySibling:o.nextEntrySibling,entryStatement:o.entryStatement,removeAllSibling:u,setAttribute:d,setText:h,addEventListener:p,appendChild:b,insertBefore:g,createElement:v,createTextNode:x};"object"==typeof window&&(window._webx=_),t.default=_},"./js/core/runtime/polyfill.ts":
/*!*************************************!*\
  !*** ./js/core/runtime/polyfill.ts ***!
  \*************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.nextEntrySibling=t.nextIfSibling=t.entryStatement=void 0;const i=n(/*! ../../obb/js/obb */"./js/obb/js/obb.ts");t.entryStatement=function(e,t){if(!e)return;let n=Object.keys(e),i=Object.values(e);for(let r=0,o=n.length;r<o;r++)t(i[r],n[r],r,e)},t.nextIfSibling=function(e,t,n,r){let o,s=i.Subscriber.PARENT;i.watch(t,(function(t,l){let u;o&&!t==!l||(u=t?n:r,o&&(o.unmount(),e.removeAllSibling()),o=u&&new i.Subscriber(u),o&&o.mount(s))}),!0)},t.nextEntrySibling=function(e,t,n){let r,o;e&&(e.removeAllSibling(),r=e.siblings);let s,l,u,c,a,f,d=[],h=[],p=[],b=[];function g(e,t,n,i){s[i]=e,l[i]=t,u[i]=n,c[i]=i}function v(e,t){if(0===e&&1===t)return d.shift(),h.shift(),p.shift(),void b.shift();d.splice(e,t),h.splice(e,t),p.splice(e,t),b.splice(e,t)}const x=i.action((function(t,n,i,r){let o=d[t],s=o[0];g(o,n,i,r),b[t]!==r&&(e&&o[2].moveTo(r),s.i=r),p[t]!==i&&(s.k=i),h[t]!==n&&(s.v=n)}));function y(t){let n=d[t];n[1].parent=m.parent,n[1].unmount(),e&&n[2].destory(),v(t,1)}function _(t,s,l){let u=i.observable({v:t,k:s,i:l,t:o}),c=e&&r.length,a=new i.Subscriber((function(){n(u)}),i.SUBSCRIBE_OPTION.PREVENT_COLLECT).mount(m.parent);a.parent=m;let f=e&&r[c];g([u,a,f],t,s,l),e&&f.moveTo(l)}let m=new i.Subscriber((function(){let e,t=m.brokens,n=t.map(e=>e.accu);if(o=S(),a=[],f=[],null!=o){let e=i.Observer.TO_OB(o);if(e){let t=e.target;e.collect(i.MASK_ITERATE,1);for(let n in t)e.collect(n,2),a.push(n),f.push(i.observable(t[n]))}else a=Object.keys(o),f=Object.values(o)}s=[],l=[],u=[],c=[];let r,g,E,O=0,w=f.length;for(;O<w;)if(g=f.shift(),E=a.shift(),h.length&&(r=h.indexOf(g),r<0?(r=p.indexOf(E),r>=0?(e=h[r],e&&"object"==typeof e&&f.includes(e)&&(r=-1)):f.includes(h[0])||(r=0)):b[r]!==O&&p[r]!==E&&"object"!=typeof g&&(e=a.indexOf(p[r]),e>=0&&f[e]===h[r]&&(r=f.includes(h[0])?-1:0)),r>=0)){for(e=r,x(r++,g,E,O++);f.length&&r<h.length&&f[0]===h[r];)x(r++,f.shift(),a.shift(),O++);v(e,r-e)}else _(g,E,O++);for(;h.length;)y(0);d=s,h=l,p=u,b=c;for(let e,i=0;i<t.length;i++)e=t[i],e.accu!==n[i]||void 0===e.parent||e.is_run||e.update()})),S=i.computed(t,m);m.mount()}},"./js/core/runtime/siblings.ts":
/*!*************************************!*\
  !*** ./js/core/runtime/siblings.ts ***!
  \*************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.NodeList=t.Children=t.Sibling=void 0;const i=n(/*! ../../obb/js/obb */"./js/obb/js/obb.ts"),r=new WeakMap;class o{constructor(e,t){this.target=e,this.prev=t,this.nodes=[],this.siblings=[],(t||(this.prev=t=r.get(e)))&&(t.next&&(t.next.prev=this,this.next=t.next),t.next=this),r.set(e,this)}setNodes(e){if(!this.target)return;let t=this.nodes,n=t.length,i=n&&t.slice();n&&this.removeAllNodes(),this.addNodes(e,i)}moveTo(e){let t=this.index,n=this.parent;if(t===e)return;let i=n.siblings;i.splice(t,1);let r=this.firstSibling(),o=this.lastSibling(),s=r.prev,l=o.next;s&&(s.next=l),l&&(l.prev=s);let u=i[e]||n.lastSibling().next,c=u&&u.firstNode(),a=u?u.prev:n.lastSibling();c?this.insertBefore(c):this.appendTo(),a&&(a.next=r),u&&(u.prev=o),r.prev=a,o.next=u,e=Math.min(e,i.length),i.splice(e,0,this);for(let n=Math.min(t,e),r=Math.max(t,e);n<=r;n++)i[n].index=n}firstNode(){let e=this.nodes;return e.length?e[0]:this.next&&this.next.firstNode()}firstSibling(){return this}lastSibling(){let e=this.siblings[this.siblings.length-1];return e?e.lastSibling():this}nextSibling(){if(!this.target)return this;let e=new this.constructor(this.target,this.lastSibling()),t=this.siblings;return e.parent=this,e.index=t.length,t.push(e),e}removeAllSibling(){let e=this.siblings;for(let t=e.length-1;t>=0;t--)this.removeSibling(e[t])}removeSibling(e){let t=this.siblings,n=e.index;if(t[n]===e){let i=e.prev,r=e.lastSibling(),o=r.next;for(e.prev=null,r.next=null,i&&(i.next=o),o&&(o.prev=i),e.setNodes(null),t.splice(n,1);n<t.length;)t[n++].index-=1;e.removeAllSibling(),e.target=null}}destory(){this.parent.removeSibling(this)}}t.Sibling=o;t.Children=class extends o{constructor(){super(...arguments),this.insertBefore=e=>{let t=e.parentElement;for(let n of this.nodes)t.insertBefore(n,e);for(let t of this.siblings)t.insertBefore(e)}}appendTo(){for(let e of this.nodes)this.target.appendChild(e);for(let e of this.siblings)e.appendTo()}removeAllNodes(){for(let e of this.nodes){let t=e.parentElement;t&&t.removeChild(e)}this.nodes.length=0}addNodes(e,t){if(null==e)return;let n,i=this.nodes;switch(!0){case e instanceof Node:i.push(n=e);break;case e instanceof Array:for(let n of e)this.addNodes(n,t);return;default:t&&t.length&&t[0].nodeType===Node.TEXT_NODE?_webx.setText(n=t.shift(),e):n=_webx.createTextNode(e),i.push(n)}let r=this.next&&this.next.firstNode();r?_webx.insertBefore(this.target,n,r):_webx.appendChild(this.target,n)}};t.NodeList=class extends o{constructor(e,t){super(e,t),this.insertBefore=e=>{let t=this.target,n=this.raw,i=this.nodes;if(i.length){let r=n.indexOf(e);t.splice(n.indexOf(i[0]),i.length);for(let e of i)t.splice(r,0,e)}for(let t of this.siblings)t.insertBefore(e)},this.raw=i.Observer.TO_RAW(e)}setNodes(e){let t=i.Subscriber.PARENT,n=t.option;t.option=n|i.SUBSCRIBE_OPTION.PREVENT_COLLECT,super.setNodes(e),t.option=n}moveTo(e){let t=i.Subscriber.PARENT,n=t.option;t.option=n|i.SUBSCRIBE_OPTION.PREVENT_COLLECT,super.moveTo(e),t.option=n}removeSibling(e){let t=i.Subscriber.PARENT,n=t.option;t.option=n|i.SUBSCRIBE_OPTION.PREVENT_COLLECT,super.removeSibling(e),t.option=n}appendTo(){let e=this.target,t=this.raw,n=this.nodes;if(n.length){e.splice(t.indexOf(n[0]),n.length);for(let t of n)e.push(t)}for(let e of this.siblings)e.appendTo()}removeAllNodes(){let e=this.target,t=this.raw;for(let n of this.nodes)e.splice(t.indexOf(n),1);this.nodes.length=0}addNodes(e,t){if(null==e)return;let n,i=this.nodes;switch(!0){case e instanceof Node:i.push(n=e);break;case e instanceof Array:for(let n of e)this.addNodes(n,t);return;default:t&&t.length&&t[0].nodeType===Node.TEXT_NODE?_webx.setText(n=t.shift(),e):n=_webx.createTextNode(e),i.push(n)}let r=this.next&&this.next.firstNode(),o=this.target,s=this.raw;r?o.splice(s.indexOf(r),0,n):o.push(n)}}},"./js/obb/js/obb.ts":
/*!**************************!*\
  !*** ./js/obb/js/obb.ts ***!
  \**************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){"use strict";(function(e){var n;Object.defineProperty(t,"__esModule",{value:!0}),t.MASK_UNDEFINED=t.MASK_ITERATE=t.reaction=t.watch=t.computed=t.SUBSCRIBE_OPTION=t.transacts=t.runInSandbox=t.sandbox=t.runInAction=t.action=t.runInAtom=t.atom=t.autorun=t.observable=t.Subscriber=t.Observer=void 0,function(e){e[e.DEFAULT=0]="DEFAULT",e[e.PREVENT_COLLECT=1]="PREVENT_COLLECT",e[e.COMPUTED=2]="COMPUTED"}(n||(n={})),t.SUBSCRIBE_OPTION=n;const i="object"==typeof window?window:e,r=[],o=[],s=[],l=[],u=new WeakMap,c=[],a=["iterate"];t.MASK_ITERATE=a;const f=["undefined"];t.MASK_UNDEFINED=f;class d{constructor(e){switch(this.target=e,this.refmap=new Map,this.ownmap=new Map,this._has=e=>e in this.target,this._val=e=>this.target[e],this._del=e=>delete this.target[e],this._set=(e,t)=>this.target[e]=t,this._proxy_handler={get:(e,t)=>{let n=e[t];return"__proto__"!==t&&(n=S(n),this.collect(t)),n},set:(e,t,n)=>{let i=e[t],r=u.get(n),o=r?r.target:n,s=e.hasOwnProperty(t),l=T(i,o);return l&&s||v(()=>{e[t]=o,s||(this.notify(t,!1,1),this.notify(a,a,1)),l||this.notify(t,i)}),!0},ownKeys:e=>(this.collect(a,1),p(e)),has:(e,t)=>(this.collect(t,1),t in e),deleteProperty:(e,t)=>v(()=>(e.hasOwnProperty(t)&&(this.notify(t,e[t]),this.notify(t,!0,1),this.notify(a,a,1)),delete e[t]))},!0){case e instanceof WeakSet:case e instanceof WeakMap:case e instanceof Map:case e instanceof Set:!function(e){var t;let n=e.target,i=n.__proto__,r=new d({}),o=(null===(t=Object.getOwnPropertyDescriptor(i,"size"))||void 0===t?void 0:t.get.bind(n))||function(){},s=n instanceof Map||n instanceof WeakMap;e.release=function(){return r.release(),e.release()},r._has=i.has.bind(n),r._val=s?function(e){return i.get.call(n,e)}:function(e){return i.has.call(n,e)?e:f};function l(e){return r.collect(e[0]),[e[0],S(e[1])]}function c(e){return r.collect(e[0]),S(e[1])}r._del=function(e){return i.delete.call(n,e)},r._set=i.set?function(e,t){return i.set.call(n,e,t)}:function(e,t){return i.add.call(n,e)};let h=Object.assign({get:e=>(r.collect(e),S(i.get.call(n,e))),set(e,t){let o=u.get(e);o&&(e=o.target);let s=i.has.call(n,e),l=s?i.get.call(n,e):f;return s&&T(l,t)||v(()=>{i.set.call(n,e,t),s||(r.notify(e,!1,1),r.notify(a,a,1)),r.notify(e,l)}),this},add(t){return i.has.call(n,t)||v(()=>{let s=o();i.add.call(n,t),void 0!==s&&e.notify("size",s,6),r.notify(t,!1,1),r.notify(t,f),r.notify(a,a,1)}),this},delete(t){let s=i.get,l=s?s.call(n,t):t,u=o(),c=i.delete.call(n,t);return c&&v(()=>{r.notify(t,l),r.notify(t,!0,1),r.notify(a,a,1),void 0!==u&&e.notify("size",u,6)}),c},clear(){let t=o();t&&v(()=>{i.forEach.call(n,(e,t)=>{r.notify(t,e),r.notify(t,!0,1)}),r.notify(a,a,1),e.notify("size",t,6),i.clear.call(n)})},forEach:(e,...t)=>(r.collect(a,1),i.forEach.call(n,(function(t,...n){e(S(t),...n)}),...t)),has:e=>(r.collect(e,1),i.has.call(n,e)),size:o},[["keys",e=>e[0]],["entries",l],["values",c],[Symbol.iterator,s?l:c]].reduce((function(e,[t,o]){let s=i.entries;return s&&(e[t]=function(){r.collect(a,1);let e=s.call(n),t=e.next.bind(e);return e.next=function(){let{done:e,value:n}=t();return e||(n=o(n)),{done:e,value:n}},e}),e}),{})),b={},g=p(i);for(let e of g){let t=h[e],n=Object.getOwnPropertyDescriptor(i,e);t&&(void 0!==n.value?n.value=t:n.get=t),b[e]=n}n.__proto__=Object.create(n.__proto__.__proto__,b)}(this);break;case e[Symbol.iterator]:case e instanceof Array:!function(e){let t=e.target,n=t.__proto__,i=e._proxy_handler.set;t.__proto__=Object.create(n,Array.prototype.concat.call(["push","pop","shift","unshift","splice","sort","reverse"].map((function(e){const t=n[e];return t&&[e,function(){let e=arguments;return v(()=>t.apply(this,e))}]})),["values",Symbol.iterator].map((function(i){return n[i]&&[i,function(){e.collect(a,1);let n=0,i=e.proxy;return{next(){let r,o=n>=t.length;return o||(e.collect(n),r=i[n++]),{done:o,value:r}}}}]}))).reduce((function(e,t){return t&&(e[t[0]]={value:t[1]}),e}),{})),e._proxy_handler.set=function(n,r,o){let s=t.length;return v((function(){let l=i(n,r,o);return t.length!==s&&e.notify("length",s,10),l}))}}(this)}this.proxy=new Proxy(e,this._proxy_handler),u.set(this.proxy,this),u.set(e,this)}static TO_RAW(e){let t=u.get(e);return t?t.target:e}static TO_OB(e){return u.get(e)}collect(e,t=2){let i=r[0];if(i&&!(i.option&n.PREVENT_COLLECT)){let n=this._map(t),r=n.get(e);r||n.set(e,r=new Set),i.depend(r)}}release(){for(let e of[this.refmap,this.ownmap])e.forEach(e=>{e.forEach(t=>t.undepend(e))}),e.clear()}notify(e,t,n=2){let i=[this,e,t,n];c.length&&c[0][0].push(i);let r=this._map(n).get(e);if(r&&r.size)if(l.length)r.forEach(e=>e.addRecord(i));else{let e,t=Number.MAX_SAFE_INTEGER;r.forEach(n=>{e.push(n),t>n.depth&&(t=n.depth)}),w(e,t)}}_map(e){return 2&e?this.refmap:this.ownmap}}t.Observer=d;class h{constructor(e,t=n.DEFAULT){this.fn=e,this.option=t,this.depth=0,this.children=[],this._deps=new Set,this.is_run=!1,this.brokens=[],this.accu=0}static get PARENT(){return r[0]}undepend(e){this._deps.delete(e),e.delete(this)}depend(e){this._deps.add(e),e.add(this),this.option&n.COMPUTED&&this.parent&&void 0!==this.parent.parent&&this.parent.depend(e)}clear(e){if(this._deps.forEach(e=>e.delete(this)),this._deps.clear(),!e)for(let e of this.children)e.clear(),e.parent=void 0;this.children.length=0}unmount(e){if(this.clear(e),!e){let e=this.parent&&this.parent.children;if(e&&e.splice(e.indexOf(this),1),this._sandbox){let e=this._sandbox[1].indexOf(this);e>=0&&this._sandbox[1].splice(e,1)}}this._sandbox=void 0,this.parent=void 0}mount(e){if(void 0!==this.parent)return new h(this.fn).mount(e);if(this.parent=e||r[0],this.parent){if(void 0===this.parent.parent)return this.parent=void 0,this;this.depth=this.parent.depth+1}else this.parent=null;return c.length&&(this._sandbox=c[0],this._sandbox[1].push(this)),this.parent&&this.parent.children.push(this),this._run(),this}update(){return this.clear(),this._run()}addRecord(e){let t=l[0][0],i=s.indexOf(this);i<0||o[i][0]<t?(o.unshift([t,[e]]),s.unshift(this)):o[i][1].push(e),this.option&n.COMPUTED&&this.parent&&void 0!==this.parent.parent&&this.parent.addRecord(e)}_run(){this.is_run=!0,r.unshift(this),this.accu+=1;try{return this.res=this.fn()}catch(e){throw e}finally{r.shift(),this.is_run=!1,this.brokens.length=0}}}function p(e){return Array.prototype.concat.call(Object.getOwnPropertySymbols(e),Object.getOwnPropertyNames(e))}function b(e,t,...n){!function(e){let t,n=l[0];void 0===e?e=n?2&n[1]:1:"number"!=typeof e&&(t=e.hook,e=e.option);l.unshift([l.length,e,t])}(e);try{return t(...n)}catch(e){throw e}finally{!function(){let e=[],t=Number.MAX_SAFE_INTEGER,n=l.shift(),i=n[0],r=n[2];if(0!==l.length&&(16&n[1]||2&n[1]&&2&l[0][1]))return;for(;s.length&&o[0][0]>=i;){let n=s.shift(),i=o.shift();if(e.indexOf(n)<0&&O(i[1])){let i;for(;(i=s.lastIndexOf(n))>=0;)s.splice(i,1),o.splice(i,1);t=Math.min(t,n.depth),e.unshift(n)}}r&&r(e),e.length&&(8&n[1]?x((function(){w(e,t)})):w(e,t))}()}}t.Subscriber=h,t.transacts=b,t.atom=function(e){return b.bind(null,e,2)};const g=b.bind(null,2);t.runInAtom=g;const v=b.bind(null,18);t.action=function(e){return b.bind(null,1,e)};const x=b.bind(null,1);t.runInAction=x,t.sandbox=function(e,t=7){return _.bind(null,t,e)};const y=_.bind(null,7);function _(e,t,...i){let o=c[0],s=r[0],l=s&&s.option,u=4&e||!o?[]:o[1],a=u.length,f=4&e||!o?[]:o[0];s&&(s.option=1&e?l|n.PREVENT_COLLECT:l&~n.PREVENT_COLLECT),c.unshift([f,u,e|(o&&4&o[2])]);try{return t(...i)}catch(e){throw e}finally{if(c.shift(),4&e&&function(e){let t=[];O(e,(function(e){let n=e[0],i=e[1],r=e[3];if(1&r)n._del(i);else if(4&~r){if(8&r)return void t.push(e);n._set(i,e[2])}}));for(let e of t)e[0]._set(e[1],e[2])}(f),2&e){for(let e=u.length-1;e>=a;e--){let t=u[e];t.unmount(t.parent!==s)}u.length=a}else o&&4&e&&Array.prototype.push.apply(o[1],u);s&&(s.option=l)}}t.runInSandbox=y,t.autorun=function(e){let t=new h(e);return t.mount(),function(){t.unmount()}};const m=new Set([Object,Array,Map,Set,WeakMap,WeakSet]);function S(e){if(e&&"object"==typeof e){let t=u.get(e);if(t)e=t.proxy;else{let t=e.constructor;(m.has(t)||i[t.name]!==t)&&(e=new d(e).proxy)}}return e}function E(e,t,n){let i=[],r=new h((function(){if(i.unshift(e()),i.length>1){let[e,n]=i;T(e,n)||t(e,n)}else 1===i.length&&n&&t(i[0]);i.length=1}));return r.mount(),function(){r.unmount()}}function O(e,t){let n=new Map,i=!1;for(let r of e){let e=r[0],o=r[1],s=n.get(e);if(s){if(s.has(o))continue;s.add(o)}else n.set(e,new Set([o]));if(!T(1!==r[3]?e._val(o):e._has(o),r[2])){if(!t)return!0;-1===t(r)&&s.delete(o),i=!0}}return i}function w(e,t=0){let i=c[0],r=i&&4&i[2]&&i[1];const o=function(e){return!r||r.indexOf(e)>=0};let s,l;e:for(let i=e.length-1;i>=0;i--)if(s=e[i],s.option&n.COMPUTED)e.splice(i,1),s.update();else{for(;(s=s.parent)&&s.depth>=t&&!s.is_run&&o(s);)if(l=e.indexOf(s),l>=0){e[l].brokens.unshift(e[i]),e.splice(i,1);continue e}s=e[i],!s.is_run&&o(s)||e.splice(i,1)}for(let t=0;t<e.length;t++)s=e[t],void 0!==s.parent&&s.update()}function T(e,t){return e===t||e!=e&&t!=t}t.observable=S,t.computed=function(e,t=null){let i,r=0,o=new h((function(){(r^=1)&&(i=e())}),n.COMPUTED);return o.parent=t,function(){return r||o.update(),i}},t.watch=E,t.reaction=function(e,t){return E(e,(function(e,n){T(e,n)||t(e)}))}}).call(this,n(/*! ./../../../node_modules/webpack/buildin/global.js */"./node_modules/webpack/buildin/global.js"))},"./js/runtime.js":
/*!***********************!*\
  !*** ./js/runtime.js ***!
  \***********************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module exports are unknown */function(e,t,n){"use strict";n.r(t);var i=n(/*! ./core/runtime */"./js/core/runtime/index.ts");for(var r in i)["default"].indexOf(r)<0&&function(e){n.d(t,e,(function(){return i[e]}))}(r)},"./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(e){"object"==typeof window&&(n=window)}e.exports=n}}))},56:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=n(58);document.head.appendChild(i.style),document.body.appendChild(i.component),setInterval((function(){i.default.push({name:Math.random().toString(36).slice(2)})}),2e3)},58:function(e,t,n){"use strict";n.r(t),n.d(t,"style",(function(){return m})),n.d(t,"component",(function(){return T}));var i=n(16),r=n.n(i);window._webx=r.a;var o=window._webx,s=o.setAttribute,l=o.addEventListener,u=(o.setNodes,o.nextNodes),c=o.createElement,a=(o.createTextNode,o.runInAction,o.autorun),f=(o.action,o.prevent,o.observable),d=o.nextChild,h=o.nextSibling,p=o.nextIfSibling,b=o.nextEntrySibling;o.removeAllSibling,o.entryStatement;var g=function e(t){let n=f({});return t.children,n.A="",a((function(){var i=c("ul");d(i,"\r\n        "),d(i,a((function(){var e=c("input");return a((function(){s(e,"value",n.A,1)})),l(e,"input",(function(){n.A=e.value})),s(e,"placeholder","name"),e}),1)),d(i,"\r\n        "),d(i,a((function(){var e=c("button");return d(e,"add"),s(e,"onclick",(function(){t.list.unshift({name:n.A}),n.A=""}),1),e}),1)),d(i,"\r\n        ");{let n=d(i);{let i=h(n);b(i,(function(){return t.list}),(function(t){u(i,a((function(){var n=c("li");d(n,"\r\n                "),d(n,(function(){return t.v.name}),1),d(n,"\r\n                ");{let i=d(n);{let n=h(i);p(n,(function(){return t.v.nodes}),(function(){let i=h(n);u(i,a((function(){var n=f({children:[]});n.children;return a((function(){n.list=t.v.nodes})),e(n)}),1))}),(function(){let e=h(n);u(e,a((function(){var e=c("button");return d(e,"+"),s(e,"onclick",(function(){t.v.nodes=[]}),1),e}),1))}))}}return d(n,"\r\n            "),n}),1))}))}}return d(i,"\r\n    "),s(i,"class","my-component"),i}),1)};window._webx=r.a;var v=window._webx,x=(v.setAttribute,v.addEventListener,v.setNodes,v.nextNodes,v.createElement),y=(v.createTextNode,v.runInAction,v.autorun),_=(v.action,v.prevent,v.observable,v.nextChild);v.nextSibling,v.nextIfSibling,v.nextEntrySibling,v.removeAllSibling,v.entryStatement;var m=y((function(){var e=x("style");return _(e,"\r.my-component button{\rcolor:"),_(e,"#ea0"),_(e,";\r}"),e}),1);window._webx=r.a;var S=window._webx,E=(S.setAttribute,S.addEventListener,S.setNodes,S.nextNodes,S.createElement,S.createTextNode,S.runInAction,S.autorun),O=(S.action,S.prevent,S.observable);S.nextChild,S.nextSibling,S.nextIfSibling,S.nextEntrySibling,S.removeAllSibling,S.entryStatement;let w=O({});w.A=[{name:"aaa"},{name:"bbb",nodes:[{name:"ccc"}]}];const T=E((function(){var e=O({children:[]});e.children;return E((function(){e.list=w.A})),g(e)}),1);t.default=w.A}});
//# sourceMappingURL=test.js.map