(self.webpackChunktodo_app=self.webpackChunktodo_app||[]).push([[8592],{7997:(t,e,n)=>{"use strict";n.d(e,{c:()=>o});var r=n(2322),s=n(3320),i=n(5043);const o=(t,e)=>{let n,o;const a=(t,r,s)=>{if("undefined"==typeof document)return;const i=document.elementFromPoint(t,r);i&&e(i)?i!==n&&(l(),c(i,s)):l()},c=(t,e)=>{n=t,o||(o=n);const s=n;(0,r.c)(()=>s.classList.add("ion-activated")),e()},l=(t=!1)=>{if(!n)return;const e=n;(0,r.c)(()=>e.classList.remove("ion-activated")),t&&o!==n&&n.click(),n=void 0};return(0,i.createGesture)({el:t,gestureName:"buttonActiveDrag",threshold:0,onStart:t=>a(t.currentX,t.currentY,s.a),onMove:t=>a(t.currentX,t.currentY,s.b),onEnd:()=>{l(!0),(0,s.h)(),o=void 0}})}},4068:(t,e,n)=>{"use strict";n.d(e,{g:()=>r});const r=(t,e,n,r,o)=>i(t[1],e[1],n[1],r[1],o).map(i=>s(t[0],e[0],n[0],r[0],i)),s=(t,e,n,r,s)=>s*(3*e*Math.pow(s-1,2)+s*(-3*n*s+3*n+r*s))-t*Math.pow(s-1,3),i=(t,e,n,r,s)=>o((r-=s)-3*(n-=s)+3*(e-=s)-(t-=s),3*n-6*e+3*t,3*e-3*t,t).filter(t=>t>=0&&t<=1),o=(t,e,n,r)=>{if(0===t)return((t,e,n)=>{const r=e*e-4*t*n;return r<0?[]:[(-e+Math.sqrt(r))/(2*t),(-e-Math.sqrt(r))/(2*t)]})(e,n,r);const s=(3*(n/=t)-(e/=t)*e)/3,i=(2*e*e*e-9*e*n+27*(r/=t))/27;if(0===s)return[Math.pow(-i,1/3)];if(0===i)return[Math.sqrt(-s),-Math.sqrt(-s)];const o=Math.pow(i/2,2)+Math.pow(s/3,3);if(0===o)return[Math.pow(i/2,.5)-e/3];if(o>0)return[Math.pow(-i/2+Math.sqrt(o),1/3)-Math.pow(i/2+Math.sqrt(o),1/3)-e/3];const a=Math.sqrt(Math.pow(-s/3,3)),c=Math.acos(-i/(2*Math.sqrt(Math.pow(-s/3,3)))),l=2*Math.pow(a,1/3);return[l*Math.cos(c/3)-e/3,l*Math.cos((c+2*Math.PI)/3)-e/3,l*Math.cos((c+4*Math.PI)/3)-e/3]}},9498:(t,e,n)=>{"use strict";n.d(e,{a:()=>s,d:()=>i});var r=n(1843);const s=async(t,e,n,s,i)=>{if(t)return t.attachViewToDom(e,n,i,s);if("string"!=typeof n&&!(n instanceof HTMLElement))throw new Error("framework delegate is missing");const o="string"==typeof n?e.ownerDocument&&e.ownerDocument.createElement(n):n;return s&&s.forEach(t=>o.classList.add(t)),i&&Object.assign(o,i),e.appendChild(o),await new Promise(t=>(0,r.c)(o,t)),o},i=(t,e)=>{if(e){if(t)return t.removeViewFromDom(e.parentElement,e);e.remove()}return Promise.resolve()}},3320:(t,e,n)=>{"use strict";n.d(e,{a:()=>i,b:()=>o,c:()=>s,d:()=>c,h:()=>a});const r={getEngine(){const t=window;return t.TapticEngine||t.Capacitor&&t.Capacitor.isPluginAvailable("Haptics")&&t.Capacitor.Plugins.Haptics},available(){return!!this.getEngine()},isCordova:()=>!!window.TapticEngine,isCapacitor:()=>!!window.Capacitor,impact(t){const e=this.getEngine();if(!e)return;const n=this.isCapacitor()?t.style.toUpperCase():t.style;e.impact({style:n})},notification(t){const e=this.getEngine();if(!e)return;const n=this.isCapacitor()?t.style.toUpperCase():t.style;e.notification({style:n})},selection(){this.impact({style:"light"})},selectionStart(){const t=this.getEngine();t&&(this.isCapacitor()?t.selectionStart():t.gestureSelectionStart())},selectionChanged(){const t=this.getEngine();t&&(this.isCapacitor()?t.selectionChanged():t.gestureSelectionChanged())},selectionEnd(){const t=this.getEngine();t&&(this.isCapacitor()?t.selectionEnd():t.gestureSelectionEnd())}},s=()=>{r.selection()},i=()=>{r.selectionStart()},o=()=>{r.selectionChanged()},a=()=>{r.selectionEnd()},c=t=>{r.impact(t)}},7942:(t,e,n)=>{"use strict";n.d(e,{s:()=>r});const r=t=>{try{if(t instanceof class{constructor(t){this.value=t}})return t.value;if(!o()||"string"!=typeof t||""===t)return t;const e=document.createDocumentFragment(),n=document.createElement("div");e.appendChild(n),n.innerHTML=t,c.forEach(t=>{const n=e.querySelectorAll(t);for(let r=n.length-1;r>=0;r--){const t=n[r];t.parentNode?t.parentNode.removeChild(t):e.removeChild(t);const o=i(t);for(let e=0;e<o.length;e++)s(o[e])}});const r=i(e);for(let t=0;t<r.length;t++)s(r[t]);const a=document.createElement("div");a.appendChild(e);const l=a.querySelector("div");return null!==l?l.innerHTML:a.innerHTML}catch(e){return console.error(e),""}},s=t=>{if(t.nodeType&&1!==t.nodeType)return;for(let n=t.attributes.length-1;n>=0;n--){const e=t.attributes.item(n),r=e.name;if(!a.includes(r.toLowerCase())){t.removeAttribute(r);continue}const s=e.value;null!=s&&s.toLowerCase().includes("javascript:")&&t.removeAttribute(r)}const e=i(t);for(let n=0;n<e.length;n++)s(e[n])},i=t=>null!=t.children?t.children:t.childNodes,o=()=>{const t=window,e=t&&t.Ionic&&t.Ionic.config;return!e||(e.get?e.get("sanitizerEnabled",!0):!0===e.sanitizerEnabled||void 0===e.sanitizerEnabled)},a=["class","id","href","src","name","slot"],c=["script","style","iframe","meta","link","object","embed"]},9926:(t,e,n)=>{"use strict";n.d(e,{S:()=>r});const r={bubbles:{dur:1e3,circles:9,fn:(t,e,n)=>{const r=t*e/n-t+"ms",s=2*Math.PI*e/n;return{r:5,style:{top:9*Math.sin(s)+"px",left:9*Math.cos(s)+"px","animation-delay":r}}}},circles:{dur:1e3,circles:8,fn:(t,e,n)=>{const r=e/n,s=t*r-t+"ms",i=2*Math.PI*r;return{r:5,style:{top:9*Math.sin(i)+"px",left:9*Math.cos(i)+"px","animation-delay":s}}}},circular:{dur:1400,elmDuration:!0,circles:1,fn:()=>({r:20,cx:48,cy:48,fill:"none",viewBox:"24 24 48 48",transform:"translate(0,0)",style:{}})},crescent:{dur:750,circles:1,fn:()=>({r:26,style:{}})},dots:{dur:750,circles:3,fn:(t,e)=>({r:6,style:{left:9-9*e+"px","animation-delay":-110*e+"ms"}})},lines:{dur:1e3,lines:12,fn:(t,e,n)=>({y1:17,y2:29,style:{transform:`rotate(${30*e+(e<6?180:-180)}deg)`,"animation-delay":t*e/n-t+"ms"}})},"lines-small":{dur:1e3,lines:12,fn:(t,e,n)=>({y1:12,y2:20,style:{transform:`rotate(${30*e+(e<6?180:-180)}deg)`,"animation-delay":t*e/n-t+"ms"}})}}},4843:(t,e,n)=>{"use strict";n.d(e,{c:()=>s,g:()=>i,h:()=>r,o:()=>a});const r=(t,e)=>null!==e.closest(t),s=(t,e)=>"string"==typeof t&&t.length>0?Object.assign({"ion-color":!0,[`ion-color-${t}`]:!0},e):e,i=t=>{const e={};return(t=>void 0!==t?(Array.isArray(t)?t:t.split(" ")).filter(t=>null!=t).map(t=>t.trim()).filter(t=>""!==t):[])(t).forEach(t=>e[t]=!0),e},o=/^[a-z][a-z0-9+\-.]*:/,a=async(t,e,n,r)=>{if(null!=t&&"#"!==t[0]&&!o.test(t)){const s=document.querySelector("ion-router");if(s)return null!=e&&e.preventDefault(),s.push(t,n,r)}return!1}}}]);