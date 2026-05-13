var Ns = Object.defineProperty;
var Ds = (e, n, t) => n in e ? Ns(e, n, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[n] = t;
var mn = (e, n, t) => Ds(e, typeof n != "symbol" ? n + "" : n, t);
import { ipcMain as C, BrowserWindow as X, shell as Is, session as Fs, BrowserView as Us, app as We, Menu as Bs } from "electron";
import B from "node:path";
import { fileURLToPath as zs } from "node:url";
import De from "util";
import te, { Readable as qs } from "stream";
import ko, { resolve as ya } from "path";
import Xt from "http";
import Yt from "https";
import Zt from "url";
import $s from "fs";
import _o from "crypto";
import Eo from "http2";
import Ms from "assert";
import So from "tty";
import Hs from "os";
import Se from "zlib";
import { EventEmitter as Ws } from "events";
import Rn from "node:fs";
import Ks from "better-sqlite3";
import Gs from "node:http";
import Qt from "node:crypto";
function Js(e, n, t) {
  C.on("window-minimize", (o) => {
    const s = o.sender, i = X.fromWebContents(s);
    i == null || i.minimize();
  }), C.on("window-maximize", (o) => {
    const s = o.sender, i = X.fromWebContents(s);
    i != null && i.isMaximized() ? i.unmaximize() : i == null || i.maximize();
  }), C.on("window-close", (o) => {
    const s = o.sender, i = X.fromWebContents(s);
    i && (i.hide(), i.close());
  }), C.on("window-zoom-in", (o) => {
    const s = o.sender, i = s.getZoomLevel();
    s.setZoomLevel(i + 0.5);
  }), C.on("window-zoom-out", (o) => {
    const s = o.sender, i = s.getZoomLevel();
    s.setZoomLevel(i - 0.5);
  }), C.on("window-zoom-reset", (o) => {
    o.sender.setZoomLevel(0);
  }), C.on("renderer-log", (o, s) => {
    console.log("[renderer-log]", s);
  });
  let a = null;
  C.handle("open-confirm", async (o, s) => {
    const i = X.fromWebContents(o.sender) || void 0, r = new URLSearchParams();
    Object.entries(s).forEach(([l, c]) => {
      r.append(l, String(c));
    });
    const p = new X({
      width: 500,
      height: 240,
      frame: !1,
      resizable: !1,
      parent: i,
      modal: !0,
      show: !1,
      webPreferences: {
        preload: B.join(e, "preload.mjs")
      }
    });
    return n ? p.loadURL(
      `${n}#/confirm?${r.toString()}`
    ) : p.loadFile(B.join(t, "index.html"), {
      hash: `/confirm?${r.toString()}`
    }), p.once("ready-to-show", () => {
      p.show();
    }), new Promise((l) => {
      a = l, p.on("closed", () => {
        a && (a(!1), a = null);
      });
    });
  }), C.on("confirm-result", (o, s) => {
    a && (a(s), a = null);
    const i = X.fromWebContents(o.sender);
    i == null || i.close();
  }), C.on("open-settings", (o) => {
    const s = X.fromWebContents(o.sender) || void 0, i = new X({
      width: 900,
      height: 600,
      frame: !1,
      parent: s,
      modal: !0,
      webPreferences: {
        preload: B.join(e, "preload.mjs")
      }
    });
    n ? i.loadURL(`${n}#/settings/interface`) : i.loadFile(B.join(t, "index.html"), {
      hash: "/settings/interface"
    });
  }), C.on("theme-changed", (o, s) => {
    X.getAllWindows().forEach((i) => {
      i.webContents.send("on-theme-changed", s);
    });
  }), C.on("language-changed", (o, s) => {
    X.getAllWindows().forEach((i) => {
      i.webContents.send("on-language-changed", s);
    });
  }), C.on("open-external", (o, s) => {
    Is.openExternal(s);
  });
}
function Ro(e, n) {
  return function() {
    return e.apply(n, arguments);
  };
}
const { toString: Vs } = Object.prototype, { getPrototypeOf: Nn } = Object, { iterator: Dn, toStringTag: Ao } = Symbol, In = /* @__PURE__ */ ((e) => (n) => {
  const t = Vs.call(n);
  return e[t] || (e[t] = t.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null)), ve = (e) => (e = e.toLowerCase(), (n) => In(n) === e), Fn = (e) => (n) => typeof n === e, { isArray: Xe } = Array, Ke = Fn("undefined");
function on(e) {
  return e !== null && !Ke(e) && e.constructor !== null && !Ke(e.constructor) && ce(e.constructor.isBuffer) && e.constructor.isBuffer(e);
}
const To = ve("ArrayBuffer");
function Xs(e) {
  let n;
  return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? n = ArrayBuffer.isView(e) : n = e && e.buffer && To(e.buffer), n;
}
const Ys = Fn("string"), ce = Fn("function"), Co = Fn("number"), sn = (e) => e !== null && typeof e == "object", Zs = (e) => e === !0 || e === !1, wn = (e) => {
  if (In(e) !== "object")
    return !1;
  const n = Nn(e);
  return (n === null || n === Object.prototype || Object.getPrototypeOf(n) === null) && !(Ao in e) && !(Dn in e);
}, Qs = (e) => {
  if (!sn(e) || on(e))
    return !1;
  try {
    return Object.keys(e).length === 0 && Object.getPrototypeOf(e) === Object.prototype;
  } catch {
    return !1;
  }
}, ei = ve("Date"), ni = ve("File"), ti = (e) => !!(e && typeof e.uri < "u"), ai = (e) => e && typeof e.getParts < "u", oi = ve("Blob"), si = ve("FileList"), ii = (e) => sn(e) && ce(e.pipe);
function ri() {
  return typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
}
const wa = ri(), ka = typeof wa.FormData < "u" ? wa.FormData : void 0, ci = (e) => {
  if (!e) return !1;
  if (ka && e instanceof ka) return !0;
  const n = Nn(e);
  if (!n || n === Object.prototype || !ce(e.append)) return !1;
  const t = In(e);
  return t === "formdata" || // detect form-data instance
  t === "object" && ce(e.toString) && e.toString() === "[object FormData]";
}, pi = ve("URLSearchParams"), [li, ui, di, mi] = [
  "ReadableStream",
  "Request",
  "Response",
  "Headers"
].map(ve), fi = (e) => e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function rn(e, n, { allOwnKeys: t = !1 } = {}) {
  if (e === null || typeof e > "u")
    return;
  let a, o;
  if (typeof e != "object" && (e = [e]), Xe(e))
    for (a = 0, o = e.length; a < o; a++)
      n.call(null, e[a], a, e);
  else {
    if (on(e))
      return;
    const s = t ? Object.getOwnPropertyNames(e) : Object.keys(e), i = s.length;
    let r;
    for (a = 0; a < i; a++)
      r = s[a], n.call(null, e[r], r, e);
  }
}
function Oo(e, n) {
  if (on(e))
    return null;
  n = n.toLowerCase();
  const t = Object.keys(e);
  let a = t.length, o;
  for (; a-- > 0; )
    if (o = t[a], n === o.toLowerCase())
      return o;
  return null;
}
const Ae = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, jo = (e) => !Ke(e) && e !== Ae;
function Ct(...e) {
  const { caseless: n, skipUndefined: t } = jo(this) && this || {}, a = {}, o = (s, i) => {
    if (i === "__proto__" || i === "constructor" || i === "prototype")
      return;
    const r = n && Oo(a, i) || i, p = Ot(a, r) ? a[r] : void 0;
    wn(p) && wn(s) ? a[r] = Ct(p, s) : wn(s) ? a[r] = Ct({}, s) : Xe(s) ? a[r] = s.slice() : (!t || !Ke(s)) && (a[r] = s);
  };
  for (let s = 0, i = e.length; s < i; s++)
    e[s] && rn(e[s], o);
  return a;
}
const xi = (e, n, t, { allOwnKeys: a } = {}) => (rn(
  n,
  (o, s) => {
    t && ce(o) ? Object.defineProperty(e, s, {
      // Null-proto descriptor so a polluted Object.prototype.get cannot
      // hijack defineProperty's accessor-vs-data resolution.
      __proto__: null,
      value: Ro(o, t),
      writable: !0,
      enumerable: !0,
      configurable: !0
    }) : Object.defineProperty(e, s, {
      __proto__: null,
      value: o,
      writable: !0,
      enumerable: !0,
      configurable: !0
    });
  },
  { allOwnKeys: a }
), e), hi = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e), vi = (e, n, t, a) => {
  e.prototype = Object.create(n.prototype, a), Object.defineProperty(e.prototype, "constructor", {
    __proto__: null,
    value: e,
    writable: !0,
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e, "super", {
    __proto__: null,
    value: n.prototype
  }), t && Object.assign(e.prototype, t);
}, bi = (e, n, t, a) => {
  let o, s, i;
  const r = {};
  if (n = n || {}, e == null) return n;
  do {
    for (o = Object.getOwnPropertyNames(e), s = o.length; s-- > 0; )
      i = o[s], (!a || a(i, e, n)) && !r[i] && (n[i] = e[i], r[i] = !0);
    e = t !== !1 && Nn(e);
  } while (e && (!t || t(e, n)) && e !== Object.prototype);
  return n;
}, gi = (e, n, t) => {
  e = String(e), (t === void 0 || t > e.length) && (t = e.length), t -= n.length;
  const a = e.indexOf(n, t);
  return a !== -1 && a === t;
}, yi = (e) => {
  if (!e) return null;
  if (Xe(e)) return e;
  let n = e.length;
  if (!Co(n)) return null;
  const t = new Array(n);
  for (; n-- > 0; )
    t[n] = e[n];
  return t;
}, wi = /* @__PURE__ */ ((e) => (n) => e && n instanceof e)(typeof Uint8Array < "u" && Nn(Uint8Array)), ki = (e, n) => {
  const a = (e && e[Dn]).call(e);
  let o;
  for (; (o = a.next()) && !o.done; ) {
    const s = o.value;
    n.call(e, s[0], s[1]);
  }
}, _i = (e, n) => {
  let t;
  const a = [];
  for (; (t = e.exec(n)) !== null; )
    a.push(t);
  return a;
}, Ei = ve("HTMLFormElement"), Si = (e) => e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function(t, a, o) {
  return a.toUpperCase() + o;
}), Ot = (({ hasOwnProperty: e }) => (n, t) => e.call(n, t))(Object.prototype), Ri = ve("RegExp"), Po = (e, n) => {
  const t = Object.getOwnPropertyDescriptors(e), a = {};
  rn(t, (o, s) => {
    let i;
    (i = n(o, s, e)) !== !1 && (a[s] = i || o);
  }), Object.defineProperties(e, a);
}, Ai = (e) => {
  Po(e, (n, t) => {
    if (ce(e) && ["arguments", "caller", "callee"].includes(t))
      return !1;
    const a = e[t];
    if (ce(a)) {
      if (n.enumerable = !1, "writable" in n) {
        n.writable = !1;
        return;
      }
      n.set || (n.set = () => {
        throw Error("Can not rewrite read-only method '" + t + "'");
      });
    }
  });
}, Ti = (e, n) => {
  const t = {}, a = (o) => {
    o.forEach((s) => {
      t[s] = !0;
    });
  };
  return Xe(e) ? a(e) : a(String(e).split(n)), t;
}, Ci = () => {
}, Oi = (e, n) => e != null && Number.isFinite(e = +e) ? e : n;
function ji(e) {
  return !!(e && ce(e.append) && e[Ao] === "FormData" && e[Dn]);
}
const Pi = (e) => {
  const n = new Array(10), t = (a, o) => {
    if (sn(a)) {
      if (n.indexOf(a) >= 0)
        return;
      if (on(a))
        return a;
      if (!("toJSON" in a)) {
        n[o] = a;
        const s = Xe(a) ? [] : {};
        return rn(a, (i, r) => {
          const p = t(i, o + 1);
          !Ke(p) && (s[r] = p);
        }), n[o] = void 0, s;
      }
    }
    return a;
  };
  return t(e, 0);
}, Li = ve("AsyncFunction"), Ni = (e) => e && (sn(e) || ce(e)) && ce(e.then) && ce(e.catch), Lo = ((e, n) => e ? setImmediate : n ? ((t, a) => (Ae.addEventListener(
  "message",
  ({ source: o, data: s }) => {
    o === Ae && s === t && a.length && a.shift()();
  },
  !1
), (o) => {
  a.push(o), Ae.postMessage(t, "*");
}))(`axios@${Math.random()}`, []) : (t) => setTimeout(t))(typeof setImmediate == "function", ce(Ae.postMessage)), Di = typeof queueMicrotask < "u" ? queueMicrotask.bind(Ae) : typeof process < "u" && process.nextTick || Lo, Ii = (e) => e != null && ce(e[Dn]), m = {
  isArray: Xe,
  isArrayBuffer: To,
  isBuffer: on,
  isFormData: ci,
  isArrayBufferView: Xs,
  isString: Ys,
  isNumber: Co,
  isBoolean: Zs,
  isObject: sn,
  isPlainObject: wn,
  isEmptyObject: Qs,
  isReadableStream: li,
  isRequest: ui,
  isResponse: di,
  isHeaders: mi,
  isUndefined: Ke,
  isDate: ei,
  isFile: ni,
  isReactNativeBlob: ti,
  isReactNative: ai,
  isBlob: oi,
  isRegExp: Ri,
  isFunction: ce,
  isStream: ii,
  isURLSearchParams: pi,
  isTypedArray: wi,
  isFileList: si,
  forEach: rn,
  merge: Ct,
  extend: xi,
  trim: fi,
  stripBOM: hi,
  inherits: vi,
  toFlatObject: bi,
  kindOf: In,
  kindOfTest: ve,
  endsWith: gi,
  toArray: yi,
  forEachEntry: ki,
  matchAll: _i,
  isHTMLForm: Ei,
  hasOwnProperty: Ot,
  hasOwnProp: Ot,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors: Po,
  freezeMethods: Ai,
  toObjectSet: Ti,
  toCamelCase: Si,
  noop: Ci,
  toFiniteNumber: Oi,
  findKey: Oo,
  global: Ae,
  isContextDefined: jo,
  isSpecCompliantForm: ji,
  toJSONObject: Pi,
  isAsyncFn: Li,
  isThenable: Ni,
  setImmediate: Lo,
  asap: Di,
  isIterable: Ii
}, Fi = m.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]), Ui = (e) => {
  const n = {};
  let t, a, o;
  return e && e.split(`
`).forEach(function(i) {
    o = i.indexOf(":"), t = i.substring(0, o).trim().toLowerCase(), a = i.substring(o + 1).trim(), !(!t || n[t] && Fi[t]) && (t === "set-cookie" ? n[t] ? n[t].push(a) : n[t] = [a] : n[t] = n[t] ? n[t] + ", " + a : a);
  }), n;
}, _a = Symbol("internals"), Bi = /[^\x09\x20-\x7E\x80-\xFF]/g;
function zi(e) {
  let n = 0, t = e.length;
  for (; n < t; ) {
    const a = e.charCodeAt(n);
    if (a !== 9 && a !== 32)
      break;
    n += 1;
  }
  for (; t > n; ) {
    const a = e.charCodeAt(t - 1);
    if (a !== 9 && a !== 32)
      break;
    t -= 1;
  }
  return n === 0 && t === e.length ? e : e.slice(n, t);
}
function Ye(e) {
  return e && String(e).trim().toLowerCase();
}
function qi(e) {
  return zi(e.replace(Bi, ""));
}
function kn(e) {
  return e === !1 || e == null ? e : m.isArray(e) ? e.map(kn) : qi(String(e));
}
function $i(e) {
  const n = /* @__PURE__ */ Object.create(null), t = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let a;
  for (; a = t.exec(e); )
    n[a[1]] = a[2];
  return n;
}
const Mi = (e) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());
function Xn(e, n, t, a, o) {
  if (m.isFunction(a))
    return a.call(this, n, t);
  if (o && (n = t), !!m.isString(n)) {
    if (m.isString(a))
      return n.indexOf(a) !== -1;
    if (m.isRegExp(a))
      return a.test(n);
  }
}
function Hi(e) {
  return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (n, t, a) => t.toUpperCase() + a);
}
function Wi(e, n) {
  const t = m.toCamelCase(" " + n);
  ["get", "set", "has"].forEach((a) => {
    Object.defineProperty(e, a + t, {
      // Null-proto descriptor so a polluted Object.prototype.get cannot turn
      // this data descriptor into an accessor descriptor on the way in.
      __proto__: null,
      value: function(o, s, i) {
        return this[a].call(this, n, o, s, i);
      },
      configurable: !0
    });
  });
}
let Q = class {
  constructor(n) {
    n && this.set(n);
  }
  set(n, t, a) {
    const o = this;
    function s(r, p, l) {
      const c = Ye(p);
      if (!c)
        throw new Error("header name must be a non-empty string");
      const u = m.findKey(o, c);
      (!u || o[u] === void 0 || l === !0 || l === void 0 && o[u] !== !1) && (o[u || p] = kn(r));
    }
    const i = (r, p) => m.forEach(r, (l, c) => s(l, c, p));
    if (m.isPlainObject(n) || n instanceof this.constructor)
      i(n, t);
    else if (m.isString(n) && (n = n.trim()) && !Mi(n))
      i(Ui(n), t);
    else if (m.isObject(n) && m.isIterable(n)) {
      let r = {}, p, l;
      for (const c of n) {
        if (!m.isArray(c))
          throw TypeError("Object iterator must return a key-value pair");
        r[l = c[0]] = (p = r[l]) ? m.isArray(p) ? [...p, c[1]] : [p, c[1]] : c[1];
      }
      i(r, t);
    } else
      n != null && s(t, n, a);
    return this;
  }
  get(n, t) {
    if (n = Ye(n), n) {
      const a = m.findKey(this, n);
      if (a) {
        const o = this[a];
        if (!t)
          return o;
        if (t === !0)
          return $i(o);
        if (m.isFunction(t))
          return t.call(this, o, a);
        if (m.isRegExp(t))
          return t.exec(o);
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(n, t) {
    if (n = Ye(n), n) {
      const a = m.findKey(this, n);
      return !!(a && this[a] !== void 0 && (!t || Xn(this, this[a], a, t)));
    }
    return !1;
  }
  delete(n, t) {
    const a = this;
    let o = !1;
    function s(i) {
      if (i = Ye(i), i) {
        const r = m.findKey(a, i);
        r && (!t || Xn(a, a[r], r, t)) && (delete a[r], o = !0);
      }
    }
    return m.isArray(n) ? n.forEach(s) : s(n), o;
  }
  clear(n) {
    const t = Object.keys(this);
    let a = t.length, o = !1;
    for (; a--; ) {
      const s = t[a];
      (!n || Xn(this, this[s], s, n, !0)) && (delete this[s], o = !0);
    }
    return o;
  }
  normalize(n) {
    const t = this, a = {};
    return m.forEach(this, (o, s) => {
      const i = m.findKey(a, s);
      if (i) {
        t[i] = kn(o), delete t[s];
        return;
      }
      const r = n ? Hi(s) : String(s).trim();
      r !== s && delete t[s], t[r] = kn(o), a[r] = !0;
    }), this;
  }
  concat(...n) {
    return this.constructor.concat(this, ...n);
  }
  toJSON(n) {
    const t = /* @__PURE__ */ Object.create(null);
    return m.forEach(this, (a, o) => {
      a != null && a !== !1 && (t[o] = n && m.isArray(a) ? a.join(", ") : a);
    }), t;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([n, t]) => n + ": " + t).join(`
`);
  }
  getSetCookie() {
    return this.get("set-cookie") || [];
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(n) {
    return n instanceof this ? n : new this(n);
  }
  static concat(n, ...t) {
    const a = new this(n);
    return t.forEach((o) => a.set(o)), a;
  }
  static accessor(n) {
    const a = (this[_a] = this[_a] = {
      accessors: {}
    }).accessors, o = this.prototype;
    function s(i) {
      const r = Ye(i);
      a[r] || (Wi(o, i), a[r] = !0);
    }
    return m.isArray(n) ? n.forEach(s) : s(n), this;
  }
};
Q.accessor([
  "Content-Type",
  "Content-Length",
  "Accept",
  "Accept-Encoding",
  "User-Agent",
  "Authorization"
]);
m.reduceDescriptors(Q.prototype, ({ value: e }, n) => {
  let t = n[0].toUpperCase() + n.slice(1);
  return {
    get: () => e,
    set(a) {
      this[t] = a;
    }
  };
});
m.freezeMethods(Q);
const Ki = "[REDACTED ****]";
function Gi(e) {
  if (m.hasOwnProp(e, "toJSON"))
    return !0;
  let n = Object.getPrototypeOf(e);
  for (; n && n !== Object.prototype; ) {
    if (m.hasOwnProp(n, "toJSON"))
      return !0;
    n = Object.getPrototypeOf(n);
  }
  return !1;
}
function Ji(e, n) {
  const t = new Set(n.map((s) => String(s).toLowerCase())), a = [], o = (s) => {
    if (s === null || typeof s != "object" || m.isBuffer(s)) return s;
    if (a.indexOf(s) !== -1) return;
    s instanceof Q && (s = s.toJSON()), a.push(s);
    let i;
    if (m.isArray(s))
      i = [], s.forEach((r, p) => {
        const l = o(r);
        m.isUndefined(l) || (i[p] = l);
      });
    else {
      if (!m.isPlainObject(s) && Gi(s))
        return a.pop(), s;
      i = /* @__PURE__ */ Object.create(null);
      for (const [r, p] of Object.entries(s)) {
        const l = t.has(r.toLowerCase()) ? Ki : o(p);
        m.isUndefined(l) || (i[r] = l);
      }
    }
    return a.pop(), i;
  };
  return o(e);
}
let g = class No extends Error {
  static from(n, t, a, o, s, i) {
    const r = new No(n.message, t || n.code, a, o, s);
    return r.cause = n, r.name = n.name, n.status != null && r.status == null && (r.status = n.status), i && Object.assign(r, i), r;
  }
  /**
   * Create an Error with the specified message, config, error code, request and response.
   *
   * @param {string} message The error message.
   * @param {string} [code] The error code (for example, 'ECONNABORTED').
   * @param {Object} [config] The config.
   * @param {Object} [request] The request.
   * @param {Object} [response] The response.
   *
   * @returns {Error} The created error.
   */
  constructor(n, t, a, o, s) {
    super(n), Object.defineProperty(this, "message", {
      // Null-proto descriptor so a polluted Object.prototype.get cannot turn
      // this data descriptor into an accessor descriptor on the way in.
      __proto__: null,
      value: n,
      enumerable: !0,
      writable: !0,
      configurable: !0
    }), this.name = "AxiosError", this.isAxiosError = !0, t && (this.code = t), a && (this.config = a), o && (this.request = o), s && (this.response = s, this.status = s.status);
  }
  toJSON() {
    const n = this.config, t = n && m.hasOwnProp(n, "redact") ? n.redact : void 0, a = m.isArray(t) && t.length > 0 ? Ji(n, t) : m.toJSONObject(n);
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: a,
      code: this.code,
      status: this.status
    };
  }
};
g.ERR_BAD_OPTION_VALUE = "ERR_BAD_OPTION_VALUE";
g.ERR_BAD_OPTION = "ERR_BAD_OPTION";
g.ECONNABORTED = "ECONNABORTED";
g.ETIMEDOUT = "ETIMEDOUT";
g.ECONNREFUSED = "ECONNREFUSED";
g.ERR_NETWORK = "ERR_NETWORK";
g.ERR_FR_TOO_MANY_REDIRECTS = "ERR_FR_TOO_MANY_REDIRECTS";
g.ERR_DEPRECATED = "ERR_DEPRECATED";
g.ERR_BAD_RESPONSE = "ERR_BAD_RESPONSE";
g.ERR_BAD_REQUEST = "ERR_BAD_REQUEST";
g.ERR_CANCELED = "ERR_CANCELED";
g.ERR_NOT_SUPPORT = "ERR_NOT_SUPPORT";
g.ERR_INVALID_URL = "ERR_INVALID_URL";
g.ERR_FORM_DATA_DEPTH_EXCEEDED = "ERR_FORM_DATA_DEPTH_EXCEEDED";
function Do(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Io = te.Stream, Vi = De, Xi = be;
function be() {
  this.source = null, this.dataSize = 0, this.maxDataSize = 1024 * 1024, this.pauseStream = !0, this._maxDataSizeExceeded = !1, this._released = !1, this._bufferedEvents = [];
}
Vi.inherits(be, Io);
be.create = function(e, n) {
  var t = new this();
  n = n || {};
  for (var a in n)
    t[a] = n[a];
  t.source = e;
  var o = e.emit;
  return e.emit = function() {
    return t._handleEmit(arguments), o.apply(e, arguments);
  }, e.on("error", function() {
  }), t.pauseStream && e.pause(), t;
};
Object.defineProperty(be.prototype, "readable", {
  configurable: !0,
  enumerable: !0,
  get: function() {
    return this.source.readable;
  }
});
be.prototype.setEncoding = function() {
  return this.source.setEncoding.apply(this.source, arguments);
};
be.prototype.resume = function() {
  this._released || this.release(), this.source.resume();
};
be.prototype.pause = function() {
  this.source.pause();
};
be.prototype.release = function() {
  this._released = !0, this._bufferedEvents.forEach((function(e) {
    this.emit.apply(this, e);
  }).bind(this)), this._bufferedEvents = [];
};
be.prototype.pipe = function() {
  var e = Io.prototype.pipe.apply(this, arguments);
  return this.resume(), e;
};
be.prototype._handleEmit = function(e) {
  if (this._released) {
    this.emit.apply(this, e);
    return;
  }
  e[0] === "data" && (this.dataSize += e[1].length, this._checkIfMaxDataSizeExceeded()), this._bufferedEvents.push(e);
};
be.prototype._checkIfMaxDataSizeExceeded = function() {
  if (!this._maxDataSizeExceeded && !(this.dataSize <= this.maxDataSize)) {
    this._maxDataSizeExceeded = !0;
    var e = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
    this.emit("error", new Error(e));
  }
};
var Yi = De, Fo = te.Stream, Ea = Xi, Zi = W;
function W() {
  this.writable = !1, this.readable = !0, this.dataSize = 0, this.maxDataSize = 2 * 1024 * 1024, this.pauseStreams = !0, this._released = !1, this._streams = [], this._currentStream = null, this._insideLoop = !1, this._pendingNext = !1;
}
Yi.inherits(W, Fo);
W.create = function(e) {
  var n = new this();
  e = e || {};
  for (var t in e)
    n[t] = e[t];
  return n;
};
W.isStreamLike = function(e) {
  return typeof e != "function" && typeof e != "string" && typeof e != "boolean" && typeof e != "number" && !Buffer.isBuffer(e);
};
W.prototype.append = function(e) {
  var n = W.isStreamLike(e);
  if (n) {
    if (!(e instanceof Ea)) {
      var t = Ea.create(e, {
        maxDataSize: 1 / 0,
        pauseStream: this.pauseStreams
      });
      e.on("data", this._checkDataSize.bind(this)), e = t;
    }
    this._handleErrors(e), this.pauseStreams && e.pause();
  }
  return this._streams.push(e), this;
};
W.prototype.pipe = function(e, n) {
  return Fo.prototype.pipe.call(this, e, n), this.resume(), e;
};
W.prototype._getNext = function() {
  if (this._currentStream = null, this._insideLoop) {
    this._pendingNext = !0;
    return;
  }
  this._insideLoop = !0;
  try {
    do
      this._pendingNext = !1, this._realGetNext();
    while (this._pendingNext);
  } finally {
    this._insideLoop = !1;
  }
};
W.prototype._realGetNext = function() {
  var e = this._streams.shift();
  if (typeof e > "u") {
    this.end();
    return;
  }
  if (typeof e != "function") {
    this._pipeNext(e);
    return;
  }
  var n = e;
  n((function(t) {
    var a = W.isStreamLike(t);
    a && (t.on("data", this._checkDataSize.bind(this)), this._handleErrors(t)), this._pipeNext(t);
  }).bind(this));
};
W.prototype._pipeNext = function(e) {
  this._currentStream = e;
  var n = W.isStreamLike(e);
  if (n) {
    e.on("end", this._getNext.bind(this)), e.pipe(this, { end: !1 });
    return;
  }
  var t = e;
  this.write(t), this._getNext();
};
W.prototype._handleErrors = function(e) {
  var n = this;
  e.on("error", function(t) {
    n._emitError(t);
  });
};
W.prototype.write = function(e) {
  this.emit("data", e);
};
W.prototype.pause = function() {
  this.pauseStreams && (this.pauseStreams && this._currentStream && typeof this._currentStream.pause == "function" && this._currentStream.pause(), this.emit("pause"));
};
W.prototype.resume = function() {
  this._released || (this._released = !0, this.writable = !0, this._getNext()), this.pauseStreams && this._currentStream && typeof this._currentStream.resume == "function" && this._currentStream.resume(), this.emit("resume");
};
W.prototype.end = function() {
  this._reset(), this.emit("end");
};
W.prototype.destroy = function() {
  this._reset(), this.emit("close");
};
W.prototype._reset = function() {
  this.writable = !1, this._streams = [], this._currentStream = null;
};
W.prototype._checkDataSize = function() {
  if (this._updateDataSize(), !(this.dataSize <= this.maxDataSize)) {
    var e = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
    this._emitError(new Error(e));
  }
};
W.prototype._updateDataSize = function() {
  this.dataSize = 0;
  var e = this;
  this._streams.forEach(function(n) {
    n.dataSize && (e.dataSize += n.dataSize);
  }), this._currentStream && this._currentStream.dataSize && (this.dataSize += this._currentStream.dataSize);
};
W.prototype._emitError = function(e) {
  this._reset(), this.emit("error", e);
};
var Uo = {};
const Qi = {
  "application/1d-interleaved-parityfec": {
    source: "iana"
  },
  "application/3gpdash-qoe-report+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/3gpp-ims+xml": {
    source: "iana",
    compressible: !0
  },
  "application/3gpphal+json": {
    source: "iana",
    compressible: !0
  },
  "application/3gpphalforms+json": {
    source: "iana",
    compressible: !0
  },
  "application/a2l": {
    source: "iana"
  },
  "application/ace+cbor": {
    source: "iana"
  },
  "application/activemessage": {
    source: "iana"
  },
  "application/activity+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-costmap+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-costmapfilter+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-directory+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-endpointcost+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-endpointcostparams+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-endpointprop+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-endpointpropparams+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-error+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-networkmap+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-networkmapfilter+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-updatestreamcontrol+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-updatestreamparams+json": {
    source: "iana",
    compressible: !0
  },
  "application/aml": {
    source: "iana"
  },
  "application/andrew-inset": {
    source: "iana",
    extensions: [
      "ez"
    ]
  },
  "application/applefile": {
    source: "iana"
  },
  "application/applixware": {
    source: "apache",
    extensions: [
      "aw"
    ]
  },
  "application/at+jwt": {
    source: "iana"
  },
  "application/atf": {
    source: "iana"
  },
  "application/atfx": {
    source: "iana"
  },
  "application/atom+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "atom"
    ]
  },
  "application/atomcat+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "atomcat"
    ]
  },
  "application/atomdeleted+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "atomdeleted"
    ]
  },
  "application/atomicmail": {
    source: "iana"
  },
  "application/atomsvc+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "atomsvc"
    ]
  },
  "application/atsc-dwd+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "dwd"
    ]
  },
  "application/atsc-dynamic-event-message": {
    source: "iana"
  },
  "application/atsc-held+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "held"
    ]
  },
  "application/atsc-rdt+json": {
    source: "iana",
    compressible: !0
  },
  "application/atsc-rsat+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rsat"
    ]
  },
  "application/atxml": {
    source: "iana"
  },
  "application/auth-policy+xml": {
    source: "iana",
    compressible: !0
  },
  "application/bacnet-xdd+zip": {
    source: "iana",
    compressible: !1
  },
  "application/batch-smtp": {
    source: "iana"
  },
  "application/bdoc": {
    compressible: !1,
    extensions: [
      "bdoc"
    ]
  },
  "application/beep+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/calendar+json": {
    source: "iana",
    compressible: !0
  },
  "application/calendar+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xcs"
    ]
  },
  "application/call-completion": {
    source: "iana"
  },
  "application/cals-1840": {
    source: "iana"
  },
  "application/captive+json": {
    source: "iana",
    compressible: !0
  },
  "application/cbor": {
    source: "iana"
  },
  "application/cbor-seq": {
    source: "iana"
  },
  "application/cccex": {
    source: "iana"
  },
  "application/ccmp+xml": {
    source: "iana",
    compressible: !0
  },
  "application/ccxml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "ccxml"
    ]
  },
  "application/cdfx+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "cdfx"
    ]
  },
  "application/cdmi-capability": {
    source: "iana",
    extensions: [
      "cdmia"
    ]
  },
  "application/cdmi-container": {
    source: "iana",
    extensions: [
      "cdmic"
    ]
  },
  "application/cdmi-domain": {
    source: "iana",
    extensions: [
      "cdmid"
    ]
  },
  "application/cdmi-object": {
    source: "iana",
    extensions: [
      "cdmio"
    ]
  },
  "application/cdmi-queue": {
    source: "iana",
    extensions: [
      "cdmiq"
    ]
  },
  "application/cdni": {
    source: "iana"
  },
  "application/cea": {
    source: "iana"
  },
  "application/cea-2018+xml": {
    source: "iana",
    compressible: !0
  },
  "application/cellml+xml": {
    source: "iana",
    compressible: !0
  },
  "application/cfw": {
    source: "iana"
  },
  "application/city+json": {
    source: "iana",
    compressible: !0
  },
  "application/clr": {
    source: "iana"
  },
  "application/clue+xml": {
    source: "iana",
    compressible: !0
  },
  "application/clue_info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/cms": {
    source: "iana"
  },
  "application/cnrp+xml": {
    source: "iana",
    compressible: !0
  },
  "application/coap-group+json": {
    source: "iana",
    compressible: !0
  },
  "application/coap-payload": {
    source: "iana"
  },
  "application/commonground": {
    source: "iana"
  },
  "application/conference-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/cose": {
    source: "iana"
  },
  "application/cose-key": {
    source: "iana"
  },
  "application/cose-key-set": {
    source: "iana"
  },
  "application/cpl+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "cpl"
    ]
  },
  "application/csrattrs": {
    source: "iana"
  },
  "application/csta+xml": {
    source: "iana",
    compressible: !0
  },
  "application/cstadata+xml": {
    source: "iana",
    compressible: !0
  },
  "application/csvm+json": {
    source: "iana",
    compressible: !0
  },
  "application/cu-seeme": {
    source: "apache",
    extensions: [
      "cu"
    ]
  },
  "application/cwt": {
    source: "iana"
  },
  "application/cybercash": {
    source: "iana"
  },
  "application/dart": {
    compressible: !0
  },
  "application/dash+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mpd"
    ]
  },
  "application/dash-patch+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mpp"
    ]
  },
  "application/dashdelta": {
    source: "iana"
  },
  "application/davmount+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "davmount"
    ]
  },
  "application/dca-rft": {
    source: "iana"
  },
  "application/dcd": {
    source: "iana"
  },
  "application/dec-dx": {
    source: "iana"
  },
  "application/dialog-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/dicom": {
    source: "iana"
  },
  "application/dicom+json": {
    source: "iana",
    compressible: !0
  },
  "application/dicom+xml": {
    source: "iana",
    compressible: !0
  },
  "application/dii": {
    source: "iana"
  },
  "application/dit": {
    source: "iana"
  },
  "application/dns": {
    source: "iana"
  },
  "application/dns+json": {
    source: "iana",
    compressible: !0
  },
  "application/dns-message": {
    source: "iana"
  },
  "application/docbook+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "dbk"
    ]
  },
  "application/dots+cbor": {
    source: "iana"
  },
  "application/dskpp+xml": {
    source: "iana",
    compressible: !0
  },
  "application/dssc+der": {
    source: "iana",
    extensions: [
      "dssc"
    ]
  },
  "application/dssc+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xdssc"
    ]
  },
  "application/dvcs": {
    source: "iana"
  },
  "application/ecmascript": {
    source: "iana",
    compressible: !0,
    extensions: [
      "es",
      "ecma"
    ]
  },
  "application/edi-consent": {
    source: "iana"
  },
  "application/edi-x12": {
    source: "iana",
    compressible: !1
  },
  "application/edifact": {
    source: "iana",
    compressible: !1
  },
  "application/efi": {
    source: "iana"
  },
  "application/elm+json": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/elm+xml": {
    source: "iana",
    compressible: !0
  },
  "application/emergencycalldata.cap+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/emergencycalldata.comment+xml": {
    source: "iana",
    compressible: !0
  },
  "application/emergencycalldata.control+xml": {
    source: "iana",
    compressible: !0
  },
  "application/emergencycalldata.deviceinfo+xml": {
    source: "iana",
    compressible: !0
  },
  "application/emergencycalldata.ecall.msd": {
    source: "iana"
  },
  "application/emergencycalldata.providerinfo+xml": {
    source: "iana",
    compressible: !0
  },
  "application/emergencycalldata.serviceinfo+xml": {
    source: "iana",
    compressible: !0
  },
  "application/emergencycalldata.subscriberinfo+xml": {
    source: "iana",
    compressible: !0
  },
  "application/emergencycalldata.veds+xml": {
    source: "iana",
    compressible: !0
  },
  "application/emma+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "emma"
    ]
  },
  "application/emotionml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "emotionml"
    ]
  },
  "application/encaprtp": {
    source: "iana"
  },
  "application/epp+xml": {
    source: "iana",
    compressible: !0
  },
  "application/epub+zip": {
    source: "iana",
    compressible: !1,
    extensions: [
      "epub"
    ]
  },
  "application/eshop": {
    source: "iana"
  },
  "application/exi": {
    source: "iana",
    extensions: [
      "exi"
    ]
  },
  "application/expect-ct-report+json": {
    source: "iana",
    compressible: !0
  },
  "application/express": {
    source: "iana",
    extensions: [
      "exp"
    ]
  },
  "application/fastinfoset": {
    source: "iana"
  },
  "application/fastsoap": {
    source: "iana"
  },
  "application/fdt+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "fdt"
    ]
  },
  "application/fhir+json": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/fhir+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/fido.trusted-apps+json": {
    compressible: !0
  },
  "application/fits": {
    source: "iana"
  },
  "application/flexfec": {
    source: "iana"
  },
  "application/font-sfnt": {
    source: "iana"
  },
  "application/font-tdpfr": {
    source: "iana",
    extensions: [
      "pfr"
    ]
  },
  "application/font-woff": {
    source: "iana",
    compressible: !1
  },
  "application/framework-attributes+xml": {
    source: "iana",
    compressible: !0
  },
  "application/geo+json": {
    source: "iana",
    compressible: !0,
    extensions: [
      "geojson"
    ]
  },
  "application/geo+json-seq": {
    source: "iana"
  },
  "application/geopackage+sqlite3": {
    source: "iana"
  },
  "application/geoxacml+xml": {
    source: "iana",
    compressible: !0
  },
  "application/gltf-buffer": {
    source: "iana"
  },
  "application/gml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "gml"
    ]
  },
  "application/gpx+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "gpx"
    ]
  },
  "application/gxf": {
    source: "apache",
    extensions: [
      "gxf"
    ]
  },
  "application/gzip": {
    source: "iana",
    compressible: !1,
    extensions: [
      "gz"
    ]
  },
  "application/h224": {
    source: "iana"
  },
  "application/held+xml": {
    source: "iana",
    compressible: !0
  },
  "application/hjson": {
    extensions: [
      "hjson"
    ]
  },
  "application/http": {
    source: "iana"
  },
  "application/hyperstudio": {
    source: "iana",
    extensions: [
      "stk"
    ]
  },
  "application/ibe-key-request+xml": {
    source: "iana",
    compressible: !0
  },
  "application/ibe-pkg-reply+xml": {
    source: "iana",
    compressible: !0
  },
  "application/ibe-pp-data": {
    source: "iana"
  },
  "application/iges": {
    source: "iana"
  },
  "application/im-iscomposing+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/index": {
    source: "iana"
  },
  "application/index.cmd": {
    source: "iana"
  },
  "application/index.obj": {
    source: "iana"
  },
  "application/index.response": {
    source: "iana"
  },
  "application/index.vnd": {
    source: "iana"
  },
  "application/inkml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "ink",
      "inkml"
    ]
  },
  "application/iotp": {
    source: "iana"
  },
  "application/ipfix": {
    source: "iana",
    extensions: [
      "ipfix"
    ]
  },
  "application/ipp": {
    source: "iana"
  },
  "application/isup": {
    source: "iana"
  },
  "application/its+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "its"
    ]
  },
  "application/java-archive": {
    source: "apache",
    compressible: !1,
    extensions: [
      "jar",
      "war",
      "ear"
    ]
  },
  "application/java-serialized-object": {
    source: "apache",
    compressible: !1,
    extensions: [
      "ser"
    ]
  },
  "application/java-vm": {
    source: "apache",
    compressible: !1,
    extensions: [
      "class"
    ]
  },
  "application/javascript": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0,
    extensions: [
      "js",
      "mjs"
    ]
  },
  "application/jf2feed+json": {
    source: "iana",
    compressible: !0
  },
  "application/jose": {
    source: "iana"
  },
  "application/jose+json": {
    source: "iana",
    compressible: !0
  },
  "application/jrd+json": {
    source: "iana",
    compressible: !0
  },
  "application/jscalendar+json": {
    source: "iana",
    compressible: !0
  },
  "application/json": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0,
    extensions: [
      "json",
      "map"
    ]
  },
  "application/json-patch+json": {
    source: "iana",
    compressible: !0
  },
  "application/json-seq": {
    source: "iana"
  },
  "application/json5": {
    extensions: [
      "json5"
    ]
  },
  "application/jsonml+json": {
    source: "apache",
    compressible: !0,
    extensions: [
      "jsonml"
    ]
  },
  "application/jwk+json": {
    source: "iana",
    compressible: !0
  },
  "application/jwk-set+json": {
    source: "iana",
    compressible: !0
  },
  "application/jwt": {
    source: "iana"
  },
  "application/kpml-request+xml": {
    source: "iana",
    compressible: !0
  },
  "application/kpml-response+xml": {
    source: "iana",
    compressible: !0
  },
  "application/ld+json": {
    source: "iana",
    compressible: !0,
    extensions: [
      "jsonld"
    ]
  },
  "application/lgr+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "lgr"
    ]
  },
  "application/link-format": {
    source: "iana"
  },
  "application/load-control+xml": {
    source: "iana",
    compressible: !0
  },
  "application/lost+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "lostxml"
    ]
  },
  "application/lostsync+xml": {
    source: "iana",
    compressible: !0
  },
  "application/lpf+zip": {
    source: "iana",
    compressible: !1
  },
  "application/lxf": {
    source: "iana"
  },
  "application/mac-binhex40": {
    source: "iana",
    extensions: [
      "hqx"
    ]
  },
  "application/mac-compactpro": {
    source: "apache",
    extensions: [
      "cpt"
    ]
  },
  "application/macwriteii": {
    source: "iana"
  },
  "application/mads+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mads"
    ]
  },
  "application/manifest+json": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0,
    extensions: [
      "webmanifest"
    ]
  },
  "application/marc": {
    source: "iana",
    extensions: [
      "mrc"
    ]
  },
  "application/marcxml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mrcx"
    ]
  },
  "application/mathematica": {
    source: "iana",
    extensions: [
      "ma",
      "nb",
      "mb"
    ]
  },
  "application/mathml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mathml"
    ]
  },
  "application/mathml-content+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mathml-presentation+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-associated-procedure-description+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-deregister+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-envelope+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-msk+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-msk-response+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-protection-description+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-reception-report+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-register+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-register-response+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-schedule+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-user-service-description+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbox": {
    source: "iana",
    extensions: [
      "mbox"
    ]
  },
  "application/media-policy-dataset+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mpf"
    ]
  },
  "application/media_control+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mediaservercontrol+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mscml"
    ]
  },
  "application/merge-patch+json": {
    source: "iana",
    compressible: !0
  },
  "application/metalink+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "metalink"
    ]
  },
  "application/metalink4+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "meta4"
    ]
  },
  "application/mets+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mets"
    ]
  },
  "application/mf4": {
    source: "iana"
  },
  "application/mikey": {
    source: "iana"
  },
  "application/mipc": {
    source: "iana"
  },
  "application/missing-blocks+cbor-seq": {
    source: "iana"
  },
  "application/mmt-aei+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "maei"
    ]
  },
  "application/mmt-usd+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "musd"
    ]
  },
  "application/mods+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mods"
    ]
  },
  "application/moss-keys": {
    source: "iana"
  },
  "application/moss-signature": {
    source: "iana"
  },
  "application/mosskey-data": {
    source: "iana"
  },
  "application/mosskey-request": {
    source: "iana"
  },
  "application/mp21": {
    source: "iana",
    extensions: [
      "m21",
      "mp21"
    ]
  },
  "application/mp4": {
    source: "iana",
    extensions: [
      "mp4s",
      "m4p"
    ]
  },
  "application/mpeg4-generic": {
    source: "iana"
  },
  "application/mpeg4-iod": {
    source: "iana"
  },
  "application/mpeg4-iod-xmt": {
    source: "iana"
  },
  "application/mrb-consumer+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mrb-publish+xml": {
    source: "iana",
    compressible: !0
  },
  "application/msc-ivr+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/msc-mixer+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/msword": {
    source: "iana",
    compressible: !1,
    extensions: [
      "doc",
      "dot"
    ]
  },
  "application/mud+json": {
    source: "iana",
    compressible: !0
  },
  "application/multipart-core": {
    source: "iana"
  },
  "application/mxf": {
    source: "iana",
    extensions: [
      "mxf"
    ]
  },
  "application/n-quads": {
    source: "iana",
    extensions: [
      "nq"
    ]
  },
  "application/n-triples": {
    source: "iana",
    extensions: [
      "nt"
    ]
  },
  "application/nasdata": {
    source: "iana"
  },
  "application/news-checkgroups": {
    source: "iana",
    charset: "US-ASCII"
  },
  "application/news-groupinfo": {
    source: "iana",
    charset: "US-ASCII"
  },
  "application/news-transmission": {
    source: "iana"
  },
  "application/nlsml+xml": {
    source: "iana",
    compressible: !0
  },
  "application/node": {
    source: "iana",
    extensions: [
      "cjs"
    ]
  },
  "application/nss": {
    source: "iana"
  },
  "application/oauth-authz-req+jwt": {
    source: "iana"
  },
  "application/oblivious-dns-message": {
    source: "iana"
  },
  "application/ocsp-request": {
    source: "iana"
  },
  "application/ocsp-response": {
    source: "iana"
  },
  "application/octet-stream": {
    source: "iana",
    compressible: !1,
    extensions: [
      "bin",
      "dms",
      "lrf",
      "mar",
      "so",
      "dist",
      "distz",
      "pkg",
      "bpk",
      "dump",
      "elc",
      "deploy",
      "exe",
      "dll",
      "deb",
      "dmg",
      "iso",
      "img",
      "msi",
      "msp",
      "msm",
      "buffer"
    ]
  },
  "application/oda": {
    source: "iana",
    extensions: [
      "oda"
    ]
  },
  "application/odm+xml": {
    source: "iana",
    compressible: !0
  },
  "application/odx": {
    source: "iana"
  },
  "application/oebps-package+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "opf"
    ]
  },
  "application/ogg": {
    source: "iana",
    compressible: !1,
    extensions: [
      "ogx"
    ]
  },
  "application/omdoc+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "omdoc"
    ]
  },
  "application/onenote": {
    source: "apache",
    extensions: [
      "onetoc",
      "onetoc2",
      "onetmp",
      "onepkg"
    ]
  },
  "application/opc-nodeset+xml": {
    source: "iana",
    compressible: !0
  },
  "application/oscore": {
    source: "iana"
  },
  "application/oxps": {
    source: "iana",
    extensions: [
      "oxps"
    ]
  },
  "application/p21": {
    source: "iana"
  },
  "application/p21+zip": {
    source: "iana",
    compressible: !1
  },
  "application/p2p-overlay+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "relo"
    ]
  },
  "application/parityfec": {
    source: "iana"
  },
  "application/passport": {
    source: "iana"
  },
  "application/patch-ops-error+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xer"
    ]
  },
  "application/pdf": {
    source: "iana",
    compressible: !1,
    extensions: [
      "pdf"
    ]
  },
  "application/pdx": {
    source: "iana"
  },
  "application/pem-certificate-chain": {
    source: "iana"
  },
  "application/pgp-encrypted": {
    source: "iana",
    compressible: !1,
    extensions: [
      "pgp"
    ]
  },
  "application/pgp-keys": {
    source: "iana",
    extensions: [
      "asc"
    ]
  },
  "application/pgp-signature": {
    source: "iana",
    extensions: [
      "asc",
      "sig"
    ]
  },
  "application/pics-rules": {
    source: "apache",
    extensions: [
      "prf"
    ]
  },
  "application/pidf+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/pidf-diff+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/pkcs10": {
    source: "iana",
    extensions: [
      "p10"
    ]
  },
  "application/pkcs12": {
    source: "iana"
  },
  "application/pkcs7-mime": {
    source: "iana",
    extensions: [
      "p7m",
      "p7c"
    ]
  },
  "application/pkcs7-signature": {
    source: "iana",
    extensions: [
      "p7s"
    ]
  },
  "application/pkcs8": {
    source: "iana",
    extensions: [
      "p8"
    ]
  },
  "application/pkcs8-encrypted": {
    source: "iana"
  },
  "application/pkix-attr-cert": {
    source: "iana",
    extensions: [
      "ac"
    ]
  },
  "application/pkix-cert": {
    source: "iana",
    extensions: [
      "cer"
    ]
  },
  "application/pkix-crl": {
    source: "iana",
    extensions: [
      "crl"
    ]
  },
  "application/pkix-pkipath": {
    source: "iana",
    extensions: [
      "pkipath"
    ]
  },
  "application/pkixcmp": {
    source: "iana",
    extensions: [
      "pki"
    ]
  },
  "application/pls+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "pls"
    ]
  },
  "application/poc-settings+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/postscript": {
    source: "iana",
    compressible: !0,
    extensions: [
      "ai",
      "eps",
      "ps"
    ]
  },
  "application/ppsp-tracker+json": {
    source: "iana",
    compressible: !0
  },
  "application/problem+json": {
    source: "iana",
    compressible: !0
  },
  "application/problem+xml": {
    source: "iana",
    compressible: !0
  },
  "application/provenance+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "provx"
    ]
  },
  "application/prs.alvestrand.titrax-sheet": {
    source: "iana"
  },
  "application/prs.cww": {
    source: "iana",
    extensions: [
      "cww"
    ]
  },
  "application/prs.cyn": {
    source: "iana",
    charset: "7-BIT"
  },
  "application/prs.hpub+zip": {
    source: "iana",
    compressible: !1
  },
  "application/prs.nprend": {
    source: "iana"
  },
  "application/prs.plucker": {
    source: "iana"
  },
  "application/prs.rdf-xml-crypt": {
    source: "iana"
  },
  "application/prs.xsf+xml": {
    source: "iana",
    compressible: !0
  },
  "application/pskc+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "pskcxml"
    ]
  },
  "application/pvd+json": {
    source: "iana",
    compressible: !0
  },
  "application/qsig": {
    source: "iana"
  },
  "application/raml+yaml": {
    compressible: !0,
    extensions: [
      "raml"
    ]
  },
  "application/raptorfec": {
    source: "iana"
  },
  "application/rdap+json": {
    source: "iana",
    compressible: !0
  },
  "application/rdf+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rdf",
      "owl"
    ]
  },
  "application/reginfo+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rif"
    ]
  },
  "application/relax-ng-compact-syntax": {
    source: "iana",
    extensions: [
      "rnc"
    ]
  },
  "application/remote-printing": {
    source: "iana"
  },
  "application/reputon+json": {
    source: "iana",
    compressible: !0
  },
  "application/resource-lists+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rl"
    ]
  },
  "application/resource-lists-diff+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rld"
    ]
  },
  "application/rfc+xml": {
    source: "iana",
    compressible: !0
  },
  "application/riscos": {
    source: "iana"
  },
  "application/rlmi+xml": {
    source: "iana",
    compressible: !0
  },
  "application/rls-services+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rs"
    ]
  },
  "application/route-apd+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rapd"
    ]
  },
  "application/route-s-tsid+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "sls"
    ]
  },
  "application/route-usd+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rusd"
    ]
  },
  "application/rpki-ghostbusters": {
    source: "iana",
    extensions: [
      "gbr"
    ]
  },
  "application/rpki-manifest": {
    source: "iana",
    extensions: [
      "mft"
    ]
  },
  "application/rpki-publication": {
    source: "iana"
  },
  "application/rpki-roa": {
    source: "iana",
    extensions: [
      "roa"
    ]
  },
  "application/rpki-updown": {
    source: "iana"
  },
  "application/rsd+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "rsd"
    ]
  },
  "application/rss+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "rss"
    ]
  },
  "application/rtf": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rtf"
    ]
  },
  "application/rtploopback": {
    source: "iana"
  },
  "application/rtx": {
    source: "iana"
  },
  "application/samlassertion+xml": {
    source: "iana",
    compressible: !0
  },
  "application/samlmetadata+xml": {
    source: "iana",
    compressible: !0
  },
  "application/sarif+json": {
    source: "iana",
    compressible: !0
  },
  "application/sarif-external-properties+json": {
    source: "iana",
    compressible: !0
  },
  "application/sbe": {
    source: "iana"
  },
  "application/sbml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "sbml"
    ]
  },
  "application/scaip+xml": {
    source: "iana",
    compressible: !0
  },
  "application/scim+json": {
    source: "iana",
    compressible: !0
  },
  "application/scvp-cv-request": {
    source: "iana",
    extensions: [
      "scq"
    ]
  },
  "application/scvp-cv-response": {
    source: "iana",
    extensions: [
      "scs"
    ]
  },
  "application/scvp-vp-request": {
    source: "iana",
    extensions: [
      "spq"
    ]
  },
  "application/scvp-vp-response": {
    source: "iana",
    extensions: [
      "spp"
    ]
  },
  "application/sdp": {
    source: "iana",
    extensions: [
      "sdp"
    ]
  },
  "application/secevent+jwt": {
    source: "iana"
  },
  "application/senml+cbor": {
    source: "iana"
  },
  "application/senml+json": {
    source: "iana",
    compressible: !0
  },
  "application/senml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "senmlx"
    ]
  },
  "application/senml-etch+cbor": {
    source: "iana"
  },
  "application/senml-etch+json": {
    source: "iana",
    compressible: !0
  },
  "application/senml-exi": {
    source: "iana"
  },
  "application/sensml+cbor": {
    source: "iana"
  },
  "application/sensml+json": {
    source: "iana",
    compressible: !0
  },
  "application/sensml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "sensmlx"
    ]
  },
  "application/sensml-exi": {
    source: "iana"
  },
  "application/sep+xml": {
    source: "iana",
    compressible: !0
  },
  "application/sep-exi": {
    source: "iana"
  },
  "application/session-info": {
    source: "iana"
  },
  "application/set-payment": {
    source: "iana"
  },
  "application/set-payment-initiation": {
    source: "iana",
    extensions: [
      "setpay"
    ]
  },
  "application/set-registration": {
    source: "iana"
  },
  "application/set-registration-initiation": {
    source: "iana",
    extensions: [
      "setreg"
    ]
  },
  "application/sgml": {
    source: "iana"
  },
  "application/sgml-open-catalog": {
    source: "iana"
  },
  "application/shf+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "shf"
    ]
  },
  "application/sieve": {
    source: "iana",
    extensions: [
      "siv",
      "sieve"
    ]
  },
  "application/simple-filter+xml": {
    source: "iana",
    compressible: !0
  },
  "application/simple-message-summary": {
    source: "iana"
  },
  "application/simplesymbolcontainer": {
    source: "iana"
  },
  "application/sipc": {
    source: "iana"
  },
  "application/slate": {
    source: "iana"
  },
  "application/smil": {
    source: "iana"
  },
  "application/smil+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "smi",
      "smil"
    ]
  },
  "application/smpte336m": {
    source: "iana"
  },
  "application/soap+fastinfoset": {
    source: "iana"
  },
  "application/soap+xml": {
    source: "iana",
    compressible: !0
  },
  "application/sparql-query": {
    source: "iana",
    extensions: [
      "rq"
    ]
  },
  "application/sparql-results+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "srx"
    ]
  },
  "application/spdx+json": {
    source: "iana",
    compressible: !0
  },
  "application/spirits-event+xml": {
    source: "iana",
    compressible: !0
  },
  "application/sql": {
    source: "iana"
  },
  "application/srgs": {
    source: "iana",
    extensions: [
      "gram"
    ]
  },
  "application/srgs+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "grxml"
    ]
  },
  "application/sru+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "sru"
    ]
  },
  "application/ssdl+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "ssdl"
    ]
  },
  "application/ssml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "ssml"
    ]
  },
  "application/stix+json": {
    source: "iana",
    compressible: !0
  },
  "application/swid+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "swidtag"
    ]
  },
  "application/tamp-apex-update": {
    source: "iana"
  },
  "application/tamp-apex-update-confirm": {
    source: "iana"
  },
  "application/tamp-community-update": {
    source: "iana"
  },
  "application/tamp-community-update-confirm": {
    source: "iana"
  },
  "application/tamp-error": {
    source: "iana"
  },
  "application/tamp-sequence-adjust": {
    source: "iana"
  },
  "application/tamp-sequence-adjust-confirm": {
    source: "iana"
  },
  "application/tamp-status-query": {
    source: "iana"
  },
  "application/tamp-status-response": {
    source: "iana"
  },
  "application/tamp-update": {
    source: "iana"
  },
  "application/tamp-update-confirm": {
    source: "iana"
  },
  "application/tar": {
    compressible: !0
  },
  "application/taxii+json": {
    source: "iana",
    compressible: !0
  },
  "application/td+json": {
    source: "iana",
    compressible: !0
  },
  "application/tei+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "tei",
      "teicorpus"
    ]
  },
  "application/tetra_isi": {
    source: "iana"
  },
  "application/thraud+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "tfi"
    ]
  },
  "application/timestamp-query": {
    source: "iana"
  },
  "application/timestamp-reply": {
    source: "iana"
  },
  "application/timestamped-data": {
    source: "iana",
    extensions: [
      "tsd"
    ]
  },
  "application/tlsrpt+gzip": {
    source: "iana"
  },
  "application/tlsrpt+json": {
    source: "iana",
    compressible: !0
  },
  "application/tnauthlist": {
    source: "iana"
  },
  "application/token-introspection+jwt": {
    source: "iana"
  },
  "application/toml": {
    compressible: !0,
    extensions: [
      "toml"
    ]
  },
  "application/trickle-ice-sdpfrag": {
    source: "iana"
  },
  "application/trig": {
    source: "iana",
    extensions: [
      "trig"
    ]
  },
  "application/ttml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "ttml"
    ]
  },
  "application/tve-trigger": {
    source: "iana"
  },
  "application/tzif": {
    source: "iana"
  },
  "application/tzif-leap": {
    source: "iana"
  },
  "application/ubjson": {
    compressible: !1,
    extensions: [
      "ubj"
    ]
  },
  "application/ulpfec": {
    source: "iana"
  },
  "application/urc-grpsheet+xml": {
    source: "iana",
    compressible: !0
  },
  "application/urc-ressheet+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rsheet"
    ]
  },
  "application/urc-targetdesc+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "td"
    ]
  },
  "application/urc-uisocketdesc+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vcard+json": {
    source: "iana",
    compressible: !0
  },
  "application/vcard+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vemmi": {
    source: "iana"
  },
  "application/vividence.scriptfile": {
    source: "apache"
  },
  "application/vnd.1000minds.decision-model+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "1km"
    ]
  },
  "application/vnd.3gpp-prose+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp-prose-pc3ch+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp-v2x-local-service-information": {
    source: "iana"
  },
  "application/vnd.3gpp.5gnas": {
    source: "iana"
  },
  "application/vnd.3gpp.access-transfer-events+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.bsf+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.gmop+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.gtpc": {
    source: "iana"
  },
  "application/vnd.3gpp.interworking-data": {
    source: "iana"
  },
  "application/vnd.3gpp.lpp": {
    source: "iana"
  },
  "application/vnd.3gpp.mc-signalling-ear": {
    source: "iana"
  },
  "application/vnd.3gpp.mcdata-affiliation-command+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcdata-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcdata-payload": {
    source: "iana"
  },
  "application/vnd.3gpp.mcdata-service-config+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcdata-signalling": {
    source: "iana"
  },
  "application/vnd.3gpp.mcdata-ue-config+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcdata-user-profile+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcptt-affiliation-command+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcptt-floor-request+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcptt-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcptt-location-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcptt-mbms-usage-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcptt-service-config+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcptt-signed+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcptt-ue-config+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcptt-ue-init-config+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcptt-user-profile+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcvideo-affiliation-command+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcvideo-affiliation-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcvideo-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcvideo-location-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcvideo-mbms-usage-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcvideo-service-config+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcvideo-transmission-request+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcvideo-ue-config+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcvideo-user-profile+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mid-call+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.ngap": {
    source: "iana"
  },
  "application/vnd.3gpp.pfcp": {
    source: "iana"
  },
  "application/vnd.3gpp.pic-bw-large": {
    source: "iana",
    extensions: [
      "plb"
    ]
  },
  "application/vnd.3gpp.pic-bw-small": {
    source: "iana",
    extensions: [
      "psb"
    ]
  },
  "application/vnd.3gpp.pic-bw-var": {
    source: "iana",
    extensions: [
      "pvb"
    ]
  },
  "application/vnd.3gpp.s1ap": {
    source: "iana"
  },
  "application/vnd.3gpp.sms": {
    source: "iana"
  },
  "application/vnd.3gpp.sms+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.srvcc-ext+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.srvcc-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.state-and-event-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.ussd+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp2.bcmcsinfo+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp2.sms": {
    source: "iana"
  },
  "application/vnd.3gpp2.tcap": {
    source: "iana",
    extensions: [
      "tcap"
    ]
  },
  "application/vnd.3lightssoftware.imagescal": {
    source: "iana"
  },
  "application/vnd.3m.post-it-notes": {
    source: "iana",
    extensions: [
      "pwn"
    ]
  },
  "application/vnd.accpac.simply.aso": {
    source: "iana",
    extensions: [
      "aso"
    ]
  },
  "application/vnd.accpac.simply.imp": {
    source: "iana",
    extensions: [
      "imp"
    ]
  },
  "application/vnd.acucobol": {
    source: "iana",
    extensions: [
      "acu"
    ]
  },
  "application/vnd.acucorp": {
    source: "iana",
    extensions: [
      "atc",
      "acutc"
    ]
  },
  "application/vnd.adobe.air-application-installer-package+zip": {
    source: "apache",
    compressible: !1,
    extensions: [
      "air"
    ]
  },
  "application/vnd.adobe.flash.movie": {
    source: "iana"
  },
  "application/vnd.adobe.formscentral.fcdt": {
    source: "iana",
    extensions: [
      "fcdt"
    ]
  },
  "application/vnd.adobe.fxp": {
    source: "iana",
    extensions: [
      "fxp",
      "fxpl"
    ]
  },
  "application/vnd.adobe.partial-upload": {
    source: "iana"
  },
  "application/vnd.adobe.xdp+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xdp"
    ]
  },
  "application/vnd.adobe.xfdf": {
    source: "iana",
    extensions: [
      "xfdf"
    ]
  },
  "application/vnd.aether.imp": {
    source: "iana"
  },
  "application/vnd.afpc.afplinedata": {
    source: "iana"
  },
  "application/vnd.afpc.afplinedata-pagedef": {
    source: "iana"
  },
  "application/vnd.afpc.cmoca-cmresource": {
    source: "iana"
  },
  "application/vnd.afpc.foca-charset": {
    source: "iana"
  },
  "application/vnd.afpc.foca-codedfont": {
    source: "iana"
  },
  "application/vnd.afpc.foca-codepage": {
    source: "iana"
  },
  "application/vnd.afpc.modca": {
    source: "iana"
  },
  "application/vnd.afpc.modca-cmtable": {
    source: "iana"
  },
  "application/vnd.afpc.modca-formdef": {
    source: "iana"
  },
  "application/vnd.afpc.modca-mediummap": {
    source: "iana"
  },
  "application/vnd.afpc.modca-objectcontainer": {
    source: "iana"
  },
  "application/vnd.afpc.modca-overlay": {
    source: "iana"
  },
  "application/vnd.afpc.modca-pagesegment": {
    source: "iana"
  },
  "application/vnd.age": {
    source: "iana",
    extensions: [
      "age"
    ]
  },
  "application/vnd.ah-barcode": {
    source: "iana"
  },
  "application/vnd.ahead.space": {
    source: "iana",
    extensions: [
      "ahead"
    ]
  },
  "application/vnd.airzip.filesecure.azf": {
    source: "iana",
    extensions: [
      "azf"
    ]
  },
  "application/vnd.airzip.filesecure.azs": {
    source: "iana",
    extensions: [
      "azs"
    ]
  },
  "application/vnd.amadeus+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.amazon.ebook": {
    source: "apache",
    extensions: [
      "azw"
    ]
  },
  "application/vnd.amazon.mobi8-ebook": {
    source: "iana"
  },
  "application/vnd.americandynamics.acc": {
    source: "iana",
    extensions: [
      "acc"
    ]
  },
  "application/vnd.amiga.ami": {
    source: "iana",
    extensions: [
      "ami"
    ]
  },
  "application/vnd.amundsen.maze+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.android.ota": {
    source: "iana"
  },
  "application/vnd.android.package-archive": {
    source: "apache",
    compressible: !1,
    extensions: [
      "apk"
    ]
  },
  "application/vnd.anki": {
    source: "iana"
  },
  "application/vnd.anser-web-certificate-issue-initiation": {
    source: "iana",
    extensions: [
      "cii"
    ]
  },
  "application/vnd.anser-web-funds-transfer-initiation": {
    source: "apache",
    extensions: [
      "fti"
    ]
  },
  "application/vnd.antix.game-component": {
    source: "iana",
    extensions: [
      "atx"
    ]
  },
  "application/vnd.apache.arrow.file": {
    source: "iana"
  },
  "application/vnd.apache.arrow.stream": {
    source: "iana"
  },
  "application/vnd.apache.thrift.binary": {
    source: "iana"
  },
  "application/vnd.apache.thrift.compact": {
    source: "iana"
  },
  "application/vnd.apache.thrift.json": {
    source: "iana"
  },
  "application/vnd.api+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.aplextor.warrp+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.apothekende.reservation+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.apple.installer+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mpkg"
    ]
  },
  "application/vnd.apple.keynote": {
    source: "iana",
    extensions: [
      "key"
    ]
  },
  "application/vnd.apple.mpegurl": {
    source: "iana",
    extensions: [
      "m3u8"
    ]
  },
  "application/vnd.apple.numbers": {
    source: "iana",
    extensions: [
      "numbers"
    ]
  },
  "application/vnd.apple.pages": {
    source: "iana",
    extensions: [
      "pages"
    ]
  },
  "application/vnd.apple.pkpass": {
    compressible: !1,
    extensions: [
      "pkpass"
    ]
  },
  "application/vnd.arastra.swi": {
    source: "iana"
  },
  "application/vnd.aristanetworks.swi": {
    source: "iana",
    extensions: [
      "swi"
    ]
  },
  "application/vnd.artisan+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.artsquare": {
    source: "iana"
  },
  "application/vnd.astraea-software.iota": {
    source: "iana",
    extensions: [
      "iota"
    ]
  },
  "application/vnd.audiograph": {
    source: "iana",
    extensions: [
      "aep"
    ]
  },
  "application/vnd.autopackage": {
    source: "iana"
  },
  "application/vnd.avalon+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.avistar+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.balsamiq.bmml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "bmml"
    ]
  },
  "application/vnd.balsamiq.bmpr": {
    source: "iana"
  },
  "application/vnd.banana-accounting": {
    source: "iana"
  },
  "application/vnd.bbf.usp.error": {
    source: "iana"
  },
  "application/vnd.bbf.usp.msg": {
    source: "iana"
  },
  "application/vnd.bbf.usp.msg+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.bekitzur-stech+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.bint.med-content": {
    source: "iana"
  },
  "application/vnd.biopax.rdf+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.blink-idb-value-wrapper": {
    source: "iana"
  },
  "application/vnd.blueice.multipass": {
    source: "iana",
    extensions: [
      "mpm"
    ]
  },
  "application/vnd.bluetooth.ep.oob": {
    source: "iana"
  },
  "application/vnd.bluetooth.le.oob": {
    source: "iana"
  },
  "application/vnd.bmi": {
    source: "iana",
    extensions: [
      "bmi"
    ]
  },
  "application/vnd.bpf": {
    source: "iana"
  },
  "application/vnd.bpf3": {
    source: "iana"
  },
  "application/vnd.businessobjects": {
    source: "iana",
    extensions: [
      "rep"
    ]
  },
  "application/vnd.byu.uapi+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.cab-jscript": {
    source: "iana"
  },
  "application/vnd.canon-cpdl": {
    source: "iana"
  },
  "application/vnd.canon-lips": {
    source: "iana"
  },
  "application/vnd.capasystems-pg+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.cendio.thinlinc.clientconf": {
    source: "iana"
  },
  "application/vnd.century-systems.tcp_stream": {
    source: "iana"
  },
  "application/vnd.chemdraw+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "cdxml"
    ]
  },
  "application/vnd.chess-pgn": {
    source: "iana"
  },
  "application/vnd.chipnuts.karaoke-mmd": {
    source: "iana",
    extensions: [
      "mmd"
    ]
  },
  "application/vnd.ciedi": {
    source: "iana"
  },
  "application/vnd.cinderella": {
    source: "iana",
    extensions: [
      "cdy"
    ]
  },
  "application/vnd.cirpack.isdn-ext": {
    source: "iana"
  },
  "application/vnd.citationstyles.style+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "csl"
    ]
  },
  "application/vnd.claymore": {
    source: "iana",
    extensions: [
      "cla"
    ]
  },
  "application/vnd.cloanto.rp9": {
    source: "iana",
    extensions: [
      "rp9"
    ]
  },
  "application/vnd.clonk.c4group": {
    source: "iana",
    extensions: [
      "c4g",
      "c4d",
      "c4f",
      "c4p",
      "c4u"
    ]
  },
  "application/vnd.cluetrust.cartomobile-config": {
    source: "iana",
    extensions: [
      "c11amc"
    ]
  },
  "application/vnd.cluetrust.cartomobile-config-pkg": {
    source: "iana",
    extensions: [
      "c11amz"
    ]
  },
  "application/vnd.coffeescript": {
    source: "iana"
  },
  "application/vnd.collabio.xodocuments.document": {
    source: "iana"
  },
  "application/vnd.collabio.xodocuments.document-template": {
    source: "iana"
  },
  "application/vnd.collabio.xodocuments.presentation": {
    source: "iana"
  },
  "application/vnd.collabio.xodocuments.presentation-template": {
    source: "iana"
  },
  "application/vnd.collabio.xodocuments.spreadsheet": {
    source: "iana"
  },
  "application/vnd.collabio.xodocuments.spreadsheet-template": {
    source: "iana"
  },
  "application/vnd.collection+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.collection.doc+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.collection.next+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.comicbook+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.comicbook-rar": {
    source: "iana"
  },
  "application/vnd.commerce-battelle": {
    source: "iana"
  },
  "application/vnd.commonspace": {
    source: "iana",
    extensions: [
      "csp"
    ]
  },
  "application/vnd.contact.cmsg": {
    source: "iana",
    extensions: [
      "cdbcmsg"
    ]
  },
  "application/vnd.coreos.ignition+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.cosmocaller": {
    source: "iana",
    extensions: [
      "cmc"
    ]
  },
  "application/vnd.crick.clicker": {
    source: "iana",
    extensions: [
      "clkx"
    ]
  },
  "application/vnd.crick.clicker.keyboard": {
    source: "iana",
    extensions: [
      "clkk"
    ]
  },
  "application/vnd.crick.clicker.palette": {
    source: "iana",
    extensions: [
      "clkp"
    ]
  },
  "application/vnd.crick.clicker.template": {
    source: "iana",
    extensions: [
      "clkt"
    ]
  },
  "application/vnd.crick.clicker.wordbank": {
    source: "iana",
    extensions: [
      "clkw"
    ]
  },
  "application/vnd.criticaltools.wbs+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "wbs"
    ]
  },
  "application/vnd.cryptii.pipe+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.crypto-shade-file": {
    source: "iana"
  },
  "application/vnd.cryptomator.encrypted": {
    source: "iana"
  },
  "application/vnd.cryptomator.vault": {
    source: "iana"
  },
  "application/vnd.ctc-posml": {
    source: "iana",
    extensions: [
      "pml"
    ]
  },
  "application/vnd.ctct.ws+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.cups-pdf": {
    source: "iana"
  },
  "application/vnd.cups-postscript": {
    source: "iana"
  },
  "application/vnd.cups-ppd": {
    source: "iana",
    extensions: [
      "ppd"
    ]
  },
  "application/vnd.cups-raster": {
    source: "iana"
  },
  "application/vnd.cups-raw": {
    source: "iana"
  },
  "application/vnd.curl": {
    source: "iana"
  },
  "application/vnd.curl.car": {
    source: "apache",
    extensions: [
      "car"
    ]
  },
  "application/vnd.curl.pcurl": {
    source: "apache",
    extensions: [
      "pcurl"
    ]
  },
  "application/vnd.cyan.dean.root+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.cybank": {
    source: "iana"
  },
  "application/vnd.cyclonedx+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.cyclonedx+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.d2l.coursepackage1p0+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.d3m-dataset": {
    source: "iana"
  },
  "application/vnd.d3m-problem": {
    source: "iana"
  },
  "application/vnd.dart": {
    source: "iana",
    compressible: !0,
    extensions: [
      "dart"
    ]
  },
  "application/vnd.data-vision.rdz": {
    source: "iana",
    extensions: [
      "rdz"
    ]
  },
  "application/vnd.datapackage+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dataresource+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dbf": {
    source: "iana",
    extensions: [
      "dbf"
    ]
  },
  "application/vnd.debian.binary-package": {
    source: "iana"
  },
  "application/vnd.dece.data": {
    source: "iana",
    extensions: [
      "uvf",
      "uvvf",
      "uvd",
      "uvvd"
    ]
  },
  "application/vnd.dece.ttml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "uvt",
      "uvvt"
    ]
  },
  "application/vnd.dece.unspecified": {
    source: "iana",
    extensions: [
      "uvx",
      "uvvx"
    ]
  },
  "application/vnd.dece.zip": {
    source: "iana",
    extensions: [
      "uvz",
      "uvvz"
    ]
  },
  "application/vnd.denovo.fcselayout-link": {
    source: "iana",
    extensions: [
      "fe_launch"
    ]
  },
  "application/vnd.desmume.movie": {
    source: "iana"
  },
  "application/vnd.dir-bi.plate-dl-nosuffix": {
    source: "iana"
  },
  "application/vnd.dm.delegation+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dna": {
    source: "iana",
    extensions: [
      "dna"
    ]
  },
  "application/vnd.document+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dolby.mlp": {
    source: "apache",
    extensions: [
      "mlp"
    ]
  },
  "application/vnd.dolby.mobile.1": {
    source: "iana"
  },
  "application/vnd.dolby.mobile.2": {
    source: "iana"
  },
  "application/vnd.doremir.scorecloud-binary-document": {
    source: "iana"
  },
  "application/vnd.dpgraph": {
    source: "iana",
    extensions: [
      "dpg"
    ]
  },
  "application/vnd.dreamfactory": {
    source: "iana",
    extensions: [
      "dfac"
    ]
  },
  "application/vnd.drive+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ds-keypoint": {
    source: "apache",
    extensions: [
      "kpxx"
    ]
  },
  "application/vnd.dtg.local": {
    source: "iana"
  },
  "application/vnd.dtg.local.flash": {
    source: "iana"
  },
  "application/vnd.dtg.local.html": {
    source: "iana"
  },
  "application/vnd.dvb.ait": {
    source: "iana",
    extensions: [
      "ait"
    ]
  },
  "application/vnd.dvb.dvbisl+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dvb.dvbj": {
    source: "iana"
  },
  "application/vnd.dvb.esgcontainer": {
    source: "iana"
  },
  "application/vnd.dvb.ipdcdftnotifaccess": {
    source: "iana"
  },
  "application/vnd.dvb.ipdcesgaccess": {
    source: "iana"
  },
  "application/vnd.dvb.ipdcesgaccess2": {
    source: "iana"
  },
  "application/vnd.dvb.ipdcesgpdd": {
    source: "iana"
  },
  "application/vnd.dvb.ipdcroaming": {
    source: "iana"
  },
  "application/vnd.dvb.iptv.alfec-base": {
    source: "iana"
  },
  "application/vnd.dvb.iptv.alfec-enhancement": {
    source: "iana"
  },
  "application/vnd.dvb.notif-aggregate-root+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dvb.notif-container+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dvb.notif-generic+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dvb.notif-ia-msglist+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dvb.notif-ia-registration-request+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dvb.notif-ia-registration-response+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dvb.notif-init+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dvb.pfr": {
    source: "iana"
  },
  "application/vnd.dvb.service": {
    source: "iana",
    extensions: [
      "svc"
    ]
  },
  "application/vnd.dxr": {
    source: "iana"
  },
  "application/vnd.dynageo": {
    source: "iana",
    extensions: [
      "geo"
    ]
  },
  "application/vnd.dzr": {
    source: "iana"
  },
  "application/vnd.easykaraoke.cdgdownload": {
    source: "iana"
  },
  "application/vnd.ecdis-update": {
    source: "iana"
  },
  "application/vnd.ecip.rlp": {
    source: "iana"
  },
  "application/vnd.eclipse.ditto+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ecowin.chart": {
    source: "iana",
    extensions: [
      "mag"
    ]
  },
  "application/vnd.ecowin.filerequest": {
    source: "iana"
  },
  "application/vnd.ecowin.fileupdate": {
    source: "iana"
  },
  "application/vnd.ecowin.series": {
    source: "iana"
  },
  "application/vnd.ecowin.seriesrequest": {
    source: "iana"
  },
  "application/vnd.ecowin.seriesupdate": {
    source: "iana"
  },
  "application/vnd.efi.img": {
    source: "iana"
  },
  "application/vnd.efi.iso": {
    source: "iana"
  },
  "application/vnd.emclient.accessrequest+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.enliven": {
    source: "iana",
    extensions: [
      "nml"
    ]
  },
  "application/vnd.enphase.envoy": {
    source: "iana"
  },
  "application/vnd.eprints.data+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.epson.esf": {
    source: "iana",
    extensions: [
      "esf"
    ]
  },
  "application/vnd.epson.msf": {
    source: "iana",
    extensions: [
      "msf"
    ]
  },
  "application/vnd.epson.quickanime": {
    source: "iana",
    extensions: [
      "qam"
    ]
  },
  "application/vnd.epson.salt": {
    source: "iana",
    extensions: [
      "slt"
    ]
  },
  "application/vnd.epson.ssf": {
    source: "iana",
    extensions: [
      "ssf"
    ]
  },
  "application/vnd.ericsson.quickcall": {
    source: "iana"
  },
  "application/vnd.espass-espass+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.eszigno3+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "es3",
      "et3"
    ]
  },
  "application/vnd.etsi.aoc+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.asic-e+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.etsi.asic-s+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.etsi.cug+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.iptvcommand+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.iptvdiscovery+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.iptvprofile+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.iptvsad-bc+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.iptvsad-cod+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.iptvsad-npvr+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.iptvservice+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.iptvsync+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.iptvueprofile+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.mcid+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.mheg5": {
    source: "iana"
  },
  "application/vnd.etsi.overload-control-policy-dataset+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.pstn+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.sci+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.simservs+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.timestamp-token": {
    source: "iana"
  },
  "application/vnd.etsi.tsl+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.tsl.der": {
    source: "iana"
  },
  "application/vnd.eu.kasparian.car+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.eudora.data": {
    source: "iana"
  },
  "application/vnd.evolv.ecig.profile": {
    source: "iana"
  },
  "application/vnd.evolv.ecig.settings": {
    source: "iana"
  },
  "application/vnd.evolv.ecig.theme": {
    source: "iana"
  },
  "application/vnd.exstream-empower+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.exstream-package": {
    source: "iana"
  },
  "application/vnd.ezpix-album": {
    source: "iana",
    extensions: [
      "ez2"
    ]
  },
  "application/vnd.ezpix-package": {
    source: "iana",
    extensions: [
      "ez3"
    ]
  },
  "application/vnd.f-secure.mobile": {
    source: "iana"
  },
  "application/vnd.familysearch.gedcom+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.fastcopy-disk-image": {
    source: "iana"
  },
  "application/vnd.fdf": {
    source: "iana",
    extensions: [
      "fdf"
    ]
  },
  "application/vnd.fdsn.mseed": {
    source: "iana",
    extensions: [
      "mseed"
    ]
  },
  "application/vnd.fdsn.seed": {
    source: "iana",
    extensions: [
      "seed",
      "dataless"
    ]
  },
  "application/vnd.ffsns": {
    source: "iana"
  },
  "application/vnd.ficlab.flb+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.filmit.zfc": {
    source: "iana"
  },
  "application/vnd.fints": {
    source: "iana"
  },
  "application/vnd.firemonkeys.cloudcell": {
    source: "iana"
  },
  "application/vnd.flographit": {
    source: "iana",
    extensions: [
      "gph"
    ]
  },
  "application/vnd.fluxtime.clip": {
    source: "iana",
    extensions: [
      "ftc"
    ]
  },
  "application/vnd.font-fontforge-sfd": {
    source: "iana"
  },
  "application/vnd.framemaker": {
    source: "iana",
    extensions: [
      "fm",
      "frame",
      "maker",
      "book"
    ]
  },
  "application/vnd.frogans.fnc": {
    source: "iana",
    extensions: [
      "fnc"
    ]
  },
  "application/vnd.frogans.ltf": {
    source: "iana",
    extensions: [
      "ltf"
    ]
  },
  "application/vnd.fsc.weblaunch": {
    source: "iana",
    extensions: [
      "fsc"
    ]
  },
  "application/vnd.fujifilm.fb.docuworks": {
    source: "iana"
  },
  "application/vnd.fujifilm.fb.docuworks.binder": {
    source: "iana"
  },
  "application/vnd.fujifilm.fb.docuworks.container": {
    source: "iana"
  },
  "application/vnd.fujifilm.fb.jfi+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.fujitsu.oasys": {
    source: "iana",
    extensions: [
      "oas"
    ]
  },
  "application/vnd.fujitsu.oasys2": {
    source: "iana",
    extensions: [
      "oa2"
    ]
  },
  "application/vnd.fujitsu.oasys3": {
    source: "iana",
    extensions: [
      "oa3"
    ]
  },
  "application/vnd.fujitsu.oasysgp": {
    source: "iana",
    extensions: [
      "fg5"
    ]
  },
  "application/vnd.fujitsu.oasysprs": {
    source: "iana",
    extensions: [
      "bh2"
    ]
  },
  "application/vnd.fujixerox.art-ex": {
    source: "iana"
  },
  "application/vnd.fujixerox.art4": {
    source: "iana"
  },
  "application/vnd.fujixerox.ddd": {
    source: "iana",
    extensions: [
      "ddd"
    ]
  },
  "application/vnd.fujixerox.docuworks": {
    source: "iana",
    extensions: [
      "xdw"
    ]
  },
  "application/vnd.fujixerox.docuworks.binder": {
    source: "iana",
    extensions: [
      "xbd"
    ]
  },
  "application/vnd.fujixerox.docuworks.container": {
    source: "iana"
  },
  "application/vnd.fujixerox.hbpl": {
    source: "iana"
  },
  "application/vnd.fut-misnet": {
    source: "iana"
  },
  "application/vnd.futoin+cbor": {
    source: "iana"
  },
  "application/vnd.futoin+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.fuzzysheet": {
    source: "iana",
    extensions: [
      "fzs"
    ]
  },
  "application/vnd.genomatix.tuxedo": {
    source: "iana",
    extensions: [
      "txd"
    ]
  },
  "application/vnd.gentics.grd+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.geo+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.geocube+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.geogebra.file": {
    source: "iana",
    extensions: [
      "ggb"
    ]
  },
  "application/vnd.geogebra.slides": {
    source: "iana"
  },
  "application/vnd.geogebra.tool": {
    source: "iana",
    extensions: [
      "ggt"
    ]
  },
  "application/vnd.geometry-explorer": {
    source: "iana",
    extensions: [
      "gex",
      "gre"
    ]
  },
  "application/vnd.geonext": {
    source: "iana",
    extensions: [
      "gxt"
    ]
  },
  "application/vnd.geoplan": {
    source: "iana",
    extensions: [
      "g2w"
    ]
  },
  "application/vnd.geospace": {
    source: "iana",
    extensions: [
      "g3w"
    ]
  },
  "application/vnd.gerber": {
    source: "iana"
  },
  "application/vnd.globalplatform.card-content-mgt": {
    source: "iana"
  },
  "application/vnd.globalplatform.card-content-mgt-response": {
    source: "iana"
  },
  "application/vnd.gmx": {
    source: "iana",
    extensions: [
      "gmx"
    ]
  },
  "application/vnd.google-apps.document": {
    compressible: !1,
    extensions: [
      "gdoc"
    ]
  },
  "application/vnd.google-apps.presentation": {
    compressible: !1,
    extensions: [
      "gslides"
    ]
  },
  "application/vnd.google-apps.spreadsheet": {
    compressible: !1,
    extensions: [
      "gsheet"
    ]
  },
  "application/vnd.google-earth.kml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "kml"
    ]
  },
  "application/vnd.google-earth.kmz": {
    source: "iana",
    compressible: !1,
    extensions: [
      "kmz"
    ]
  },
  "application/vnd.gov.sk.e-form+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.gov.sk.e-form+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.gov.sk.xmldatacontainer+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.grafeq": {
    source: "iana",
    extensions: [
      "gqf",
      "gqs"
    ]
  },
  "application/vnd.gridmp": {
    source: "iana"
  },
  "application/vnd.groove-account": {
    source: "iana",
    extensions: [
      "gac"
    ]
  },
  "application/vnd.groove-help": {
    source: "iana",
    extensions: [
      "ghf"
    ]
  },
  "application/vnd.groove-identity-message": {
    source: "iana",
    extensions: [
      "gim"
    ]
  },
  "application/vnd.groove-injector": {
    source: "iana",
    extensions: [
      "grv"
    ]
  },
  "application/vnd.groove-tool-message": {
    source: "iana",
    extensions: [
      "gtm"
    ]
  },
  "application/vnd.groove-tool-template": {
    source: "iana",
    extensions: [
      "tpl"
    ]
  },
  "application/vnd.groove-vcard": {
    source: "iana",
    extensions: [
      "vcg"
    ]
  },
  "application/vnd.hal+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.hal+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "hal"
    ]
  },
  "application/vnd.handheld-entertainment+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "zmm"
    ]
  },
  "application/vnd.hbci": {
    source: "iana",
    extensions: [
      "hbci"
    ]
  },
  "application/vnd.hc+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.hcl-bireports": {
    source: "iana"
  },
  "application/vnd.hdt": {
    source: "iana"
  },
  "application/vnd.heroku+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.hhe.lesson-player": {
    source: "iana",
    extensions: [
      "les"
    ]
  },
  "application/vnd.hl7cda+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/vnd.hl7v2+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/vnd.hp-hpgl": {
    source: "iana",
    extensions: [
      "hpgl"
    ]
  },
  "application/vnd.hp-hpid": {
    source: "iana",
    extensions: [
      "hpid"
    ]
  },
  "application/vnd.hp-hps": {
    source: "iana",
    extensions: [
      "hps"
    ]
  },
  "application/vnd.hp-jlyt": {
    source: "iana",
    extensions: [
      "jlt"
    ]
  },
  "application/vnd.hp-pcl": {
    source: "iana",
    extensions: [
      "pcl"
    ]
  },
  "application/vnd.hp-pclxl": {
    source: "iana",
    extensions: [
      "pclxl"
    ]
  },
  "application/vnd.httphone": {
    source: "iana"
  },
  "application/vnd.hydrostatix.sof-data": {
    source: "iana",
    extensions: [
      "sfd-hdstx"
    ]
  },
  "application/vnd.hyper+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.hyper-item+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.hyperdrive+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.hzn-3d-crossword": {
    source: "iana"
  },
  "application/vnd.ibm.afplinedata": {
    source: "iana"
  },
  "application/vnd.ibm.electronic-media": {
    source: "iana"
  },
  "application/vnd.ibm.minipay": {
    source: "iana",
    extensions: [
      "mpy"
    ]
  },
  "application/vnd.ibm.modcap": {
    source: "iana",
    extensions: [
      "afp",
      "listafp",
      "list3820"
    ]
  },
  "application/vnd.ibm.rights-management": {
    source: "iana",
    extensions: [
      "irm"
    ]
  },
  "application/vnd.ibm.secure-container": {
    source: "iana",
    extensions: [
      "sc"
    ]
  },
  "application/vnd.iccprofile": {
    source: "iana",
    extensions: [
      "icc",
      "icm"
    ]
  },
  "application/vnd.ieee.1905": {
    source: "iana"
  },
  "application/vnd.igloader": {
    source: "iana",
    extensions: [
      "igl"
    ]
  },
  "application/vnd.imagemeter.folder+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.imagemeter.image+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.immervision-ivp": {
    source: "iana",
    extensions: [
      "ivp"
    ]
  },
  "application/vnd.immervision-ivu": {
    source: "iana",
    extensions: [
      "ivu"
    ]
  },
  "application/vnd.ims.imsccv1p1": {
    source: "iana"
  },
  "application/vnd.ims.imsccv1p2": {
    source: "iana"
  },
  "application/vnd.ims.imsccv1p3": {
    source: "iana"
  },
  "application/vnd.ims.lis.v2.result+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ims.lti.v2.toolconsumerprofile+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ims.lti.v2.toolproxy+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ims.lti.v2.toolproxy.id+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ims.lti.v2.toolsettings+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ims.lti.v2.toolsettings.simple+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.informedcontrol.rms+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.informix-visionary": {
    source: "iana"
  },
  "application/vnd.infotech.project": {
    source: "iana"
  },
  "application/vnd.infotech.project+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.innopath.wamp.notification": {
    source: "iana"
  },
  "application/vnd.insors.igm": {
    source: "iana",
    extensions: [
      "igm"
    ]
  },
  "application/vnd.intercon.formnet": {
    source: "iana",
    extensions: [
      "xpw",
      "xpx"
    ]
  },
  "application/vnd.intergeo": {
    source: "iana",
    extensions: [
      "i2g"
    ]
  },
  "application/vnd.intertrust.digibox": {
    source: "iana"
  },
  "application/vnd.intertrust.nncp": {
    source: "iana"
  },
  "application/vnd.intu.qbo": {
    source: "iana",
    extensions: [
      "qbo"
    ]
  },
  "application/vnd.intu.qfx": {
    source: "iana",
    extensions: [
      "qfx"
    ]
  },
  "application/vnd.iptc.g2.catalogitem+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.iptc.g2.conceptitem+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.iptc.g2.knowledgeitem+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.iptc.g2.newsitem+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.iptc.g2.newsmessage+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.iptc.g2.packageitem+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.iptc.g2.planningitem+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ipunplugged.rcprofile": {
    source: "iana",
    extensions: [
      "rcprofile"
    ]
  },
  "application/vnd.irepository.package+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "irp"
    ]
  },
  "application/vnd.is-xpr": {
    source: "iana",
    extensions: [
      "xpr"
    ]
  },
  "application/vnd.isac.fcs": {
    source: "iana",
    extensions: [
      "fcs"
    ]
  },
  "application/vnd.iso11783-10+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.jam": {
    source: "iana",
    extensions: [
      "jam"
    ]
  },
  "application/vnd.japannet-directory-service": {
    source: "iana"
  },
  "application/vnd.japannet-jpnstore-wakeup": {
    source: "iana"
  },
  "application/vnd.japannet-payment-wakeup": {
    source: "iana"
  },
  "application/vnd.japannet-registration": {
    source: "iana"
  },
  "application/vnd.japannet-registration-wakeup": {
    source: "iana"
  },
  "application/vnd.japannet-setstore-wakeup": {
    source: "iana"
  },
  "application/vnd.japannet-verification": {
    source: "iana"
  },
  "application/vnd.japannet-verification-wakeup": {
    source: "iana"
  },
  "application/vnd.jcp.javame.midlet-rms": {
    source: "iana",
    extensions: [
      "rms"
    ]
  },
  "application/vnd.jisp": {
    source: "iana",
    extensions: [
      "jisp"
    ]
  },
  "application/vnd.joost.joda-archive": {
    source: "iana",
    extensions: [
      "joda"
    ]
  },
  "application/vnd.jsk.isdn-ngn": {
    source: "iana"
  },
  "application/vnd.kahootz": {
    source: "iana",
    extensions: [
      "ktz",
      "ktr"
    ]
  },
  "application/vnd.kde.karbon": {
    source: "iana",
    extensions: [
      "karbon"
    ]
  },
  "application/vnd.kde.kchart": {
    source: "iana",
    extensions: [
      "chrt"
    ]
  },
  "application/vnd.kde.kformula": {
    source: "iana",
    extensions: [
      "kfo"
    ]
  },
  "application/vnd.kde.kivio": {
    source: "iana",
    extensions: [
      "flw"
    ]
  },
  "application/vnd.kde.kontour": {
    source: "iana",
    extensions: [
      "kon"
    ]
  },
  "application/vnd.kde.kpresenter": {
    source: "iana",
    extensions: [
      "kpr",
      "kpt"
    ]
  },
  "application/vnd.kde.kspread": {
    source: "iana",
    extensions: [
      "ksp"
    ]
  },
  "application/vnd.kde.kword": {
    source: "iana",
    extensions: [
      "kwd",
      "kwt"
    ]
  },
  "application/vnd.kenameaapp": {
    source: "iana",
    extensions: [
      "htke"
    ]
  },
  "application/vnd.kidspiration": {
    source: "iana",
    extensions: [
      "kia"
    ]
  },
  "application/vnd.kinar": {
    source: "iana",
    extensions: [
      "kne",
      "knp"
    ]
  },
  "application/vnd.koan": {
    source: "iana",
    extensions: [
      "skp",
      "skd",
      "skt",
      "skm"
    ]
  },
  "application/vnd.kodak-descriptor": {
    source: "iana",
    extensions: [
      "sse"
    ]
  },
  "application/vnd.las": {
    source: "iana"
  },
  "application/vnd.las.las+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.las.las+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "lasxml"
    ]
  },
  "application/vnd.laszip": {
    source: "iana"
  },
  "application/vnd.leap+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.liberty-request+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.llamagraphics.life-balance.desktop": {
    source: "iana",
    extensions: [
      "lbd"
    ]
  },
  "application/vnd.llamagraphics.life-balance.exchange+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "lbe"
    ]
  },
  "application/vnd.logipipe.circuit+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.loom": {
    source: "iana"
  },
  "application/vnd.lotus-1-2-3": {
    source: "iana",
    extensions: [
      "123"
    ]
  },
  "application/vnd.lotus-approach": {
    source: "iana",
    extensions: [
      "apr"
    ]
  },
  "application/vnd.lotus-freelance": {
    source: "iana",
    extensions: [
      "pre"
    ]
  },
  "application/vnd.lotus-notes": {
    source: "iana",
    extensions: [
      "nsf"
    ]
  },
  "application/vnd.lotus-organizer": {
    source: "iana",
    extensions: [
      "org"
    ]
  },
  "application/vnd.lotus-screencam": {
    source: "iana",
    extensions: [
      "scm"
    ]
  },
  "application/vnd.lotus-wordpro": {
    source: "iana",
    extensions: [
      "lwp"
    ]
  },
  "application/vnd.macports.portpkg": {
    source: "iana",
    extensions: [
      "portpkg"
    ]
  },
  "application/vnd.mapbox-vector-tile": {
    source: "iana",
    extensions: [
      "mvt"
    ]
  },
  "application/vnd.marlin.drm.actiontoken+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.marlin.drm.conftoken+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.marlin.drm.license+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.marlin.drm.mdcf": {
    source: "iana"
  },
  "application/vnd.mason+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.maxar.archive.3tz+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.maxmind.maxmind-db": {
    source: "iana"
  },
  "application/vnd.mcd": {
    source: "iana",
    extensions: [
      "mcd"
    ]
  },
  "application/vnd.medcalcdata": {
    source: "iana",
    extensions: [
      "mc1"
    ]
  },
  "application/vnd.mediastation.cdkey": {
    source: "iana",
    extensions: [
      "cdkey"
    ]
  },
  "application/vnd.meridian-slingshot": {
    source: "iana"
  },
  "application/vnd.mfer": {
    source: "iana",
    extensions: [
      "mwf"
    ]
  },
  "application/vnd.mfmp": {
    source: "iana",
    extensions: [
      "mfm"
    ]
  },
  "application/vnd.micro+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.micrografx.flo": {
    source: "iana",
    extensions: [
      "flo"
    ]
  },
  "application/vnd.micrografx.igx": {
    source: "iana",
    extensions: [
      "igx"
    ]
  },
  "application/vnd.microsoft.portable-executable": {
    source: "iana"
  },
  "application/vnd.microsoft.windows.thumbnail-cache": {
    source: "iana"
  },
  "application/vnd.miele+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.mif": {
    source: "iana",
    extensions: [
      "mif"
    ]
  },
  "application/vnd.minisoft-hp3000-save": {
    source: "iana"
  },
  "application/vnd.mitsubishi.misty-guard.trustweb": {
    source: "iana"
  },
  "application/vnd.mobius.daf": {
    source: "iana",
    extensions: [
      "daf"
    ]
  },
  "application/vnd.mobius.dis": {
    source: "iana",
    extensions: [
      "dis"
    ]
  },
  "application/vnd.mobius.mbk": {
    source: "iana",
    extensions: [
      "mbk"
    ]
  },
  "application/vnd.mobius.mqy": {
    source: "iana",
    extensions: [
      "mqy"
    ]
  },
  "application/vnd.mobius.msl": {
    source: "iana",
    extensions: [
      "msl"
    ]
  },
  "application/vnd.mobius.plc": {
    source: "iana",
    extensions: [
      "plc"
    ]
  },
  "application/vnd.mobius.txf": {
    source: "iana",
    extensions: [
      "txf"
    ]
  },
  "application/vnd.mophun.application": {
    source: "iana",
    extensions: [
      "mpn"
    ]
  },
  "application/vnd.mophun.certificate": {
    source: "iana",
    extensions: [
      "mpc"
    ]
  },
  "application/vnd.motorola.flexsuite": {
    source: "iana"
  },
  "application/vnd.motorola.flexsuite.adsi": {
    source: "iana"
  },
  "application/vnd.motorola.flexsuite.fis": {
    source: "iana"
  },
  "application/vnd.motorola.flexsuite.gotap": {
    source: "iana"
  },
  "application/vnd.motorola.flexsuite.kmr": {
    source: "iana"
  },
  "application/vnd.motorola.flexsuite.ttc": {
    source: "iana"
  },
  "application/vnd.motorola.flexsuite.wem": {
    source: "iana"
  },
  "application/vnd.motorola.iprm": {
    source: "iana"
  },
  "application/vnd.mozilla.xul+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xul"
    ]
  },
  "application/vnd.ms-3mfdocument": {
    source: "iana"
  },
  "application/vnd.ms-artgalry": {
    source: "iana",
    extensions: [
      "cil"
    ]
  },
  "application/vnd.ms-asf": {
    source: "iana"
  },
  "application/vnd.ms-cab-compressed": {
    source: "iana",
    extensions: [
      "cab"
    ]
  },
  "application/vnd.ms-color.iccprofile": {
    source: "apache"
  },
  "application/vnd.ms-excel": {
    source: "iana",
    compressible: !1,
    extensions: [
      "xls",
      "xlm",
      "xla",
      "xlc",
      "xlt",
      "xlw"
    ]
  },
  "application/vnd.ms-excel.addin.macroenabled.12": {
    source: "iana",
    extensions: [
      "xlam"
    ]
  },
  "application/vnd.ms-excel.sheet.binary.macroenabled.12": {
    source: "iana",
    extensions: [
      "xlsb"
    ]
  },
  "application/vnd.ms-excel.sheet.macroenabled.12": {
    source: "iana",
    extensions: [
      "xlsm"
    ]
  },
  "application/vnd.ms-excel.template.macroenabled.12": {
    source: "iana",
    extensions: [
      "xltm"
    ]
  },
  "application/vnd.ms-fontobject": {
    source: "iana",
    compressible: !0,
    extensions: [
      "eot"
    ]
  },
  "application/vnd.ms-htmlhelp": {
    source: "iana",
    extensions: [
      "chm"
    ]
  },
  "application/vnd.ms-ims": {
    source: "iana",
    extensions: [
      "ims"
    ]
  },
  "application/vnd.ms-lrm": {
    source: "iana",
    extensions: [
      "lrm"
    ]
  },
  "application/vnd.ms-office.activex+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ms-officetheme": {
    source: "iana",
    extensions: [
      "thmx"
    ]
  },
  "application/vnd.ms-opentype": {
    source: "apache",
    compressible: !0
  },
  "application/vnd.ms-outlook": {
    compressible: !1,
    extensions: [
      "msg"
    ]
  },
  "application/vnd.ms-package.obfuscated-opentype": {
    source: "apache"
  },
  "application/vnd.ms-pki.seccat": {
    source: "apache",
    extensions: [
      "cat"
    ]
  },
  "application/vnd.ms-pki.stl": {
    source: "apache",
    extensions: [
      "stl"
    ]
  },
  "application/vnd.ms-playready.initiator+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ms-powerpoint": {
    source: "iana",
    compressible: !1,
    extensions: [
      "ppt",
      "pps",
      "pot"
    ]
  },
  "application/vnd.ms-powerpoint.addin.macroenabled.12": {
    source: "iana",
    extensions: [
      "ppam"
    ]
  },
  "application/vnd.ms-powerpoint.presentation.macroenabled.12": {
    source: "iana",
    extensions: [
      "pptm"
    ]
  },
  "application/vnd.ms-powerpoint.slide.macroenabled.12": {
    source: "iana",
    extensions: [
      "sldm"
    ]
  },
  "application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
    source: "iana",
    extensions: [
      "ppsm"
    ]
  },
  "application/vnd.ms-powerpoint.template.macroenabled.12": {
    source: "iana",
    extensions: [
      "potm"
    ]
  },
  "application/vnd.ms-printdevicecapabilities+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ms-printing.printticket+xml": {
    source: "apache",
    compressible: !0
  },
  "application/vnd.ms-printschematicket+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ms-project": {
    source: "iana",
    extensions: [
      "mpp",
      "mpt"
    ]
  },
  "application/vnd.ms-tnef": {
    source: "iana"
  },
  "application/vnd.ms-windows.devicepairing": {
    source: "iana"
  },
  "application/vnd.ms-windows.nwprinting.oob": {
    source: "iana"
  },
  "application/vnd.ms-windows.printerpairing": {
    source: "iana"
  },
  "application/vnd.ms-windows.wsd.oob": {
    source: "iana"
  },
  "application/vnd.ms-wmdrm.lic-chlg-req": {
    source: "iana"
  },
  "application/vnd.ms-wmdrm.lic-resp": {
    source: "iana"
  },
  "application/vnd.ms-wmdrm.meter-chlg-req": {
    source: "iana"
  },
  "application/vnd.ms-wmdrm.meter-resp": {
    source: "iana"
  },
  "application/vnd.ms-word.document.macroenabled.12": {
    source: "iana",
    extensions: [
      "docm"
    ]
  },
  "application/vnd.ms-word.template.macroenabled.12": {
    source: "iana",
    extensions: [
      "dotm"
    ]
  },
  "application/vnd.ms-works": {
    source: "iana",
    extensions: [
      "wps",
      "wks",
      "wcm",
      "wdb"
    ]
  },
  "application/vnd.ms-wpl": {
    source: "iana",
    extensions: [
      "wpl"
    ]
  },
  "application/vnd.ms-xpsdocument": {
    source: "iana",
    compressible: !1,
    extensions: [
      "xps"
    ]
  },
  "application/vnd.msa-disk-image": {
    source: "iana"
  },
  "application/vnd.mseq": {
    source: "iana",
    extensions: [
      "mseq"
    ]
  },
  "application/vnd.msign": {
    source: "iana"
  },
  "application/vnd.multiad.creator": {
    source: "iana"
  },
  "application/vnd.multiad.creator.cif": {
    source: "iana"
  },
  "application/vnd.music-niff": {
    source: "iana"
  },
  "application/vnd.musician": {
    source: "iana",
    extensions: [
      "mus"
    ]
  },
  "application/vnd.muvee.style": {
    source: "iana",
    extensions: [
      "msty"
    ]
  },
  "application/vnd.mynfc": {
    source: "iana",
    extensions: [
      "taglet"
    ]
  },
  "application/vnd.nacamar.ybrid+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ncd.control": {
    source: "iana"
  },
  "application/vnd.ncd.reference": {
    source: "iana"
  },
  "application/vnd.nearst.inv+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.nebumind.line": {
    source: "iana"
  },
  "application/vnd.nervana": {
    source: "iana"
  },
  "application/vnd.netfpx": {
    source: "iana"
  },
  "application/vnd.neurolanguage.nlu": {
    source: "iana",
    extensions: [
      "nlu"
    ]
  },
  "application/vnd.nimn": {
    source: "iana"
  },
  "application/vnd.nintendo.nitro.rom": {
    source: "iana"
  },
  "application/vnd.nintendo.snes.rom": {
    source: "iana"
  },
  "application/vnd.nitf": {
    source: "iana",
    extensions: [
      "ntf",
      "nitf"
    ]
  },
  "application/vnd.noblenet-directory": {
    source: "iana",
    extensions: [
      "nnd"
    ]
  },
  "application/vnd.noblenet-sealer": {
    source: "iana",
    extensions: [
      "nns"
    ]
  },
  "application/vnd.noblenet-web": {
    source: "iana",
    extensions: [
      "nnw"
    ]
  },
  "application/vnd.nokia.catalogs": {
    source: "iana"
  },
  "application/vnd.nokia.conml+wbxml": {
    source: "iana"
  },
  "application/vnd.nokia.conml+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.nokia.iptv.config+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.nokia.isds-radio-presets": {
    source: "iana"
  },
  "application/vnd.nokia.landmark+wbxml": {
    source: "iana"
  },
  "application/vnd.nokia.landmark+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.nokia.landmarkcollection+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.nokia.n-gage.ac+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "ac"
    ]
  },
  "application/vnd.nokia.n-gage.data": {
    source: "iana",
    extensions: [
      "ngdat"
    ]
  },
  "application/vnd.nokia.n-gage.symbian.install": {
    source: "iana",
    extensions: [
      "n-gage"
    ]
  },
  "application/vnd.nokia.ncd": {
    source: "iana"
  },
  "application/vnd.nokia.pcd+wbxml": {
    source: "iana"
  },
  "application/vnd.nokia.pcd+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.nokia.radio-preset": {
    source: "iana",
    extensions: [
      "rpst"
    ]
  },
  "application/vnd.nokia.radio-presets": {
    source: "iana",
    extensions: [
      "rpss"
    ]
  },
  "application/vnd.novadigm.edm": {
    source: "iana",
    extensions: [
      "edm"
    ]
  },
  "application/vnd.novadigm.edx": {
    source: "iana",
    extensions: [
      "edx"
    ]
  },
  "application/vnd.novadigm.ext": {
    source: "iana",
    extensions: [
      "ext"
    ]
  },
  "application/vnd.ntt-local.content-share": {
    source: "iana"
  },
  "application/vnd.ntt-local.file-transfer": {
    source: "iana"
  },
  "application/vnd.ntt-local.ogw_remote-access": {
    source: "iana"
  },
  "application/vnd.ntt-local.sip-ta_remote": {
    source: "iana"
  },
  "application/vnd.ntt-local.sip-ta_tcp_stream": {
    source: "iana"
  },
  "application/vnd.oasis.opendocument.chart": {
    source: "iana",
    extensions: [
      "odc"
    ]
  },
  "application/vnd.oasis.opendocument.chart-template": {
    source: "iana",
    extensions: [
      "otc"
    ]
  },
  "application/vnd.oasis.opendocument.database": {
    source: "iana",
    extensions: [
      "odb"
    ]
  },
  "application/vnd.oasis.opendocument.formula": {
    source: "iana",
    extensions: [
      "odf"
    ]
  },
  "application/vnd.oasis.opendocument.formula-template": {
    source: "iana",
    extensions: [
      "odft"
    ]
  },
  "application/vnd.oasis.opendocument.graphics": {
    source: "iana",
    compressible: !1,
    extensions: [
      "odg"
    ]
  },
  "application/vnd.oasis.opendocument.graphics-template": {
    source: "iana",
    extensions: [
      "otg"
    ]
  },
  "application/vnd.oasis.opendocument.image": {
    source: "iana",
    extensions: [
      "odi"
    ]
  },
  "application/vnd.oasis.opendocument.image-template": {
    source: "iana",
    extensions: [
      "oti"
    ]
  },
  "application/vnd.oasis.opendocument.presentation": {
    source: "iana",
    compressible: !1,
    extensions: [
      "odp"
    ]
  },
  "application/vnd.oasis.opendocument.presentation-template": {
    source: "iana",
    extensions: [
      "otp"
    ]
  },
  "application/vnd.oasis.opendocument.spreadsheet": {
    source: "iana",
    compressible: !1,
    extensions: [
      "ods"
    ]
  },
  "application/vnd.oasis.opendocument.spreadsheet-template": {
    source: "iana",
    extensions: [
      "ots"
    ]
  },
  "application/vnd.oasis.opendocument.text": {
    source: "iana",
    compressible: !1,
    extensions: [
      "odt"
    ]
  },
  "application/vnd.oasis.opendocument.text-master": {
    source: "iana",
    extensions: [
      "odm"
    ]
  },
  "application/vnd.oasis.opendocument.text-template": {
    source: "iana",
    extensions: [
      "ott"
    ]
  },
  "application/vnd.oasis.opendocument.text-web": {
    source: "iana",
    extensions: [
      "oth"
    ]
  },
  "application/vnd.obn": {
    source: "iana"
  },
  "application/vnd.ocf+cbor": {
    source: "iana"
  },
  "application/vnd.oci.image.manifest.v1+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oftn.l10n+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oipf.contentaccessdownload+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oipf.contentaccessstreaming+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oipf.cspg-hexbinary": {
    source: "iana"
  },
  "application/vnd.oipf.dae.svg+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oipf.dae.xhtml+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oipf.mippvcontrolmessage+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oipf.pae.gem": {
    source: "iana"
  },
  "application/vnd.oipf.spdiscovery+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oipf.spdlist+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oipf.ueprofile+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oipf.userprofile+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.olpc-sugar": {
    source: "iana",
    extensions: [
      "xo"
    ]
  },
  "application/vnd.oma-scws-config": {
    source: "iana"
  },
  "application/vnd.oma-scws-http-request": {
    source: "iana"
  },
  "application/vnd.oma-scws-http-response": {
    source: "iana"
  },
  "application/vnd.oma.bcast.associated-procedure-parameter+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.bcast.drm-trigger+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.bcast.imd+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.bcast.ltkm": {
    source: "iana"
  },
  "application/vnd.oma.bcast.notification+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.bcast.provisioningtrigger": {
    source: "iana"
  },
  "application/vnd.oma.bcast.sgboot": {
    source: "iana"
  },
  "application/vnd.oma.bcast.sgdd+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.bcast.sgdu": {
    source: "iana"
  },
  "application/vnd.oma.bcast.simple-symbol-container": {
    source: "iana"
  },
  "application/vnd.oma.bcast.smartcard-trigger+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.bcast.sprov+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.bcast.stkm": {
    source: "iana"
  },
  "application/vnd.oma.cab-address-book+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.cab-feature-handler+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.cab-pcc+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.cab-subs-invite+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.cab-user-prefs+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.dcd": {
    source: "iana"
  },
  "application/vnd.oma.dcdc": {
    source: "iana"
  },
  "application/vnd.oma.dd2+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "dd2"
    ]
  },
  "application/vnd.oma.drm.risd+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.group-usage-list+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.lwm2m+cbor": {
    source: "iana"
  },
  "application/vnd.oma.lwm2m+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.lwm2m+tlv": {
    source: "iana"
  },
  "application/vnd.oma.pal+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.poc.detailed-progress-report+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.poc.final-report+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.poc.groups+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.poc.invocation-descriptor+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.poc.optimized-progress-report+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.push": {
    source: "iana"
  },
  "application/vnd.oma.scidm.messages+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.xcap-directory+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.omads-email+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/vnd.omads-file+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/vnd.omads-folder+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/vnd.omaloc-supl-init": {
    source: "iana"
  },
  "application/vnd.onepager": {
    source: "iana"
  },
  "application/vnd.onepagertamp": {
    source: "iana"
  },
  "application/vnd.onepagertamx": {
    source: "iana"
  },
  "application/vnd.onepagertat": {
    source: "iana"
  },
  "application/vnd.onepagertatp": {
    source: "iana"
  },
  "application/vnd.onepagertatx": {
    source: "iana"
  },
  "application/vnd.openblox.game+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "obgx"
    ]
  },
  "application/vnd.openblox.game-binary": {
    source: "iana"
  },
  "application/vnd.openeye.oeb": {
    source: "iana"
  },
  "application/vnd.openofficeorg.extension": {
    source: "apache",
    extensions: [
      "oxt"
    ]
  },
  "application/vnd.openstreetmap.data+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "osm"
    ]
  },
  "application/vnd.opentimestamps.ots": {
    source: "iana"
  },
  "application/vnd.openxmlformats-officedocument.custom-properties+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.drawing+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.extended-properties+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
    source: "iana",
    compressible: !1,
    extensions: [
      "pptx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slide": {
    source: "iana",
    extensions: [
      "sldx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
    source: "iana",
    extensions: [
      "ppsx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.template": {
    source: "iana",
    extensions: [
      "potx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
    source: "iana",
    compressible: !1,
    extensions: [
      "xlsx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
    source: "iana",
    extensions: [
      "xltx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.theme+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.themeoverride+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.vmldrawing": {
    source: "iana"
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    source: "iana",
    compressible: !1,
    extensions: [
      "docx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
    source: "iana",
    extensions: [
      "dotx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-package.core-properties+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-package.relationships+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oracle.resource+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.orange.indata": {
    source: "iana"
  },
  "application/vnd.osa.netdeploy": {
    source: "iana"
  },
  "application/vnd.osgeo.mapguide.package": {
    source: "iana",
    extensions: [
      "mgp"
    ]
  },
  "application/vnd.osgi.bundle": {
    source: "iana"
  },
  "application/vnd.osgi.dp": {
    source: "iana",
    extensions: [
      "dp"
    ]
  },
  "application/vnd.osgi.subsystem": {
    source: "iana",
    extensions: [
      "esa"
    ]
  },
  "application/vnd.otps.ct-kip+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oxli.countgraph": {
    source: "iana"
  },
  "application/vnd.pagerduty+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.palm": {
    source: "iana",
    extensions: [
      "pdb",
      "pqa",
      "oprc"
    ]
  },
  "application/vnd.panoply": {
    source: "iana"
  },
  "application/vnd.paos.xml": {
    source: "iana"
  },
  "application/vnd.patentdive": {
    source: "iana"
  },
  "application/vnd.patientecommsdoc": {
    source: "iana"
  },
  "application/vnd.pawaafile": {
    source: "iana",
    extensions: [
      "paw"
    ]
  },
  "application/vnd.pcos": {
    source: "iana"
  },
  "application/vnd.pg.format": {
    source: "iana",
    extensions: [
      "str"
    ]
  },
  "application/vnd.pg.osasli": {
    source: "iana",
    extensions: [
      "ei6"
    ]
  },
  "application/vnd.piaccess.application-licence": {
    source: "iana"
  },
  "application/vnd.picsel": {
    source: "iana",
    extensions: [
      "efif"
    ]
  },
  "application/vnd.pmi.widget": {
    source: "iana",
    extensions: [
      "wg"
    ]
  },
  "application/vnd.poc.group-advertisement+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.pocketlearn": {
    source: "iana",
    extensions: [
      "plf"
    ]
  },
  "application/vnd.powerbuilder6": {
    source: "iana",
    extensions: [
      "pbd"
    ]
  },
  "application/vnd.powerbuilder6-s": {
    source: "iana"
  },
  "application/vnd.powerbuilder7": {
    source: "iana"
  },
  "application/vnd.powerbuilder7-s": {
    source: "iana"
  },
  "application/vnd.powerbuilder75": {
    source: "iana"
  },
  "application/vnd.powerbuilder75-s": {
    source: "iana"
  },
  "application/vnd.preminet": {
    source: "iana"
  },
  "application/vnd.previewsystems.box": {
    source: "iana",
    extensions: [
      "box"
    ]
  },
  "application/vnd.proteus.magazine": {
    source: "iana",
    extensions: [
      "mgz"
    ]
  },
  "application/vnd.psfs": {
    source: "iana"
  },
  "application/vnd.publishare-delta-tree": {
    source: "iana",
    extensions: [
      "qps"
    ]
  },
  "application/vnd.pvi.ptid1": {
    source: "iana",
    extensions: [
      "ptid"
    ]
  },
  "application/vnd.pwg-multiplexed": {
    source: "iana"
  },
  "application/vnd.pwg-xhtml-print+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.qualcomm.brew-app-res": {
    source: "iana"
  },
  "application/vnd.quarantainenet": {
    source: "iana"
  },
  "application/vnd.quark.quarkxpress": {
    source: "iana",
    extensions: [
      "qxd",
      "qxt",
      "qwd",
      "qwt",
      "qxl",
      "qxb"
    ]
  },
  "application/vnd.quobject-quoxdocument": {
    source: "iana"
  },
  "application/vnd.radisys.moml+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-audit+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-audit-conf+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-audit-conn+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-audit-dialog+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-audit-stream+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-conf+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-dialog+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-dialog-base+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-dialog-fax-detect+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-dialog-group+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-dialog-speech+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-dialog-transform+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.rainstor.data": {
    source: "iana"
  },
  "application/vnd.rapid": {
    source: "iana"
  },
  "application/vnd.rar": {
    source: "iana",
    extensions: [
      "rar"
    ]
  },
  "application/vnd.realvnc.bed": {
    source: "iana",
    extensions: [
      "bed"
    ]
  },
  "application/vnd.recordare.musicxml": {
    source: "iana",
    extensions: [
      "mxl"
    ]
  },
  "application/vnd.recordare.musicxml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "musicxml"
    ]
  },
  "application/vnd.renlearn.rlprint": {
    source: "iana"
  },
  "application/vnd.resilient.logic": {
    source: "iana"
  },
  "application/vnd.restful+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.rig.cryptonote": {
    source: "iana",
    extensions: [
      "cryptonote"
    ]
  },
  "application/vnd.rim.cod": {
    source: "apache",
    extensions: [
      "cod"
    ]
  },
  "application/vnd.rn-realmedia": {
    source: "apache",
    extensions: [
      "rm"
    ]
  },
  "application/vnd.rn-realmedia-vbr": {
    source: "apache",
    extensions: [
      "rmvb"
    ]
  },
  "application/vnd.route66.link66+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "link66"
    ]
  },
  "application/vnd.rs-274x": {
    source: "iana"
  },
  "application/vnd.ruckus.download": {
    source: "iana"
  },
  "application/vnd.s3sms": {
    source: "iana"
  },
  "application/vnd.sailingtracker.track": {
    source: "iana",
    extensions: [
      "st"
    ]
  },
  "application/vnd.sar": {
    source: "iana"
  },
  "application/vnd.sbm.cid": {
    source: "iana"
  },
  "application/vnd.sbm.mid2": {
    source: "iana"
  },
  "application/vnd.scribus": {
    source: "iana"
  },
  "application/vnd.sealed.3df": {
    source: "iana"
  },
  "application/vnd.sealed.csf": {
    source: "iana"
  },
  "application/vnd.sealed.doc": {
    source: "iana"
  },
  "application/vnd.sealed.eml": {
    source: "iana"
  },
  "application/vnd.sealed.mht": {
    source: "iana"
  },
  "application/vnd.sealed.net": {
    source: "iana"
  },
  "application/vnd.sealed.ppt": {
    source: "iana"
  },
  "application/vnd.sealed.tiff": {
    source: "iana"
  },
  "application/vnd.sealed.xls": {
    source: "iana"
  },
  "application/vnd.sealedmedia.softseal.html": {
    source: "iana"
  },
  "application/vnd.sealedmedia.softseal.pdf": {
    source: "iana"
  },
  "application/vnd.seemail": {
    source: "iana",
    extensions: [
      "see"
    ]
  },
  "application/vnd.seis+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.sema": {
    source: "iana",
    extensions: [
      "sema"
    ]
  },
  "application/vnd.semd": {
    source: "iana",
    extensions: [
      "semd"
    ]
  },
  "application/vnd.semf": {
    source: "iana",
    extensions: [
      "semf"
    ]
  },
  "application/vnd.shade-save-file": {
    source: "iana"
  },
  "application/vnd.shana.informed.formdata": {
    source: "iana",
    extensions: [
      "ifm"
    ]
  },
  "application/vnd.shana.informed.formtemplate": {
    source: "iana",
    extensions: [
      "itp"
    ]
  },
  "application/vnd.shana.informed.interchange": {
    source: "iana",
    extensions: [
      "iif"
    ]
  },
  "application/vnd.shana.informed.package": {
    source: "iana",
    extensions: [
      "ipk"
    ]
  },
  "application/vnd.shootproof+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.shopkick+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.shp": {
    source: "iana"
  },
  "application/vnd.shx": {
    source: "iana"
  },
  "application/vnd.sigrok.session": {
    source: "iana"
  },
  "application/vnd.simtech-mindmapper": {
    source: "iana",
    extensions: [
      "twd",
      "twds"
    ]
  },
  "application/vnd.siren+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.smaf": {
    source: "iana",
    extensions: [
      "mmf"
    ]
  },
  "application/vnd.smart.notebook": {
    source: "iana"
  },
  "application/vnd.smart.teacher": {
    source: "iana",
    extensions: [
      "teacher"
    ]
  },
  "application/vnd.snesdev-page-table": {
    source: "iana"
  },
  "application/vnd.software602.filler.form+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "fo"
    ]
  },
  "application/vnd.software602.filler.form-xml-zip": {
    source: "iana"
  },
  "application/vnd.solent.sdkm+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "sdkm",
      "sdkd"
    ]
  },
  "application/vnd.spotfire.dxp": {
    source: "iana",
    extensions: [
      "dxp"
    ]
  },
  "application/vnd.spotfire.sfs": {
    source: "iana",
    extensions: [
      "sfs"
    ]
  },
  "application/vnd.sqlite3": {
    source: "iana"
  },
  "application/vnd.sss-cod": {
    source: "iana"
  },
  "application/vnd.sss-dtf": {
    source: "iana"
  },
  "application/vnd.sss-ntf": {
    source: "iana"
  },
  "application/vnd.stardivision.calc": {
    source: "apache",
    extensions: [
      "sdc"
    ]
  },
  "application/vnd.stardivision.draw": {
    source: "apache",
    extensions: [
      "sda"
    ]
  },
  "application/vnd.stardivision.impress": {
    source: "apache",
    extensions: [
      "sdd"
    ]
  },
  "application/vnd.stardivision.math": {
    source: "apache",
    extensions: [
      "smf"
    ]
  },
  "application/vnd.stardivision.writer": {
    source: "apache",
    extensions: [
      "sdw",
      "vor"
    ]
  },
  "application/vnd.stardivision.writer-global": {
    source: "apache",
    extensions: [
      "sgl"
    ]
  },
  "application/vnd.stepmania.package": {
    source: "iana",
    extensions: [
      "smzip"
    ]
  },
  "application/vnd.stepmania.stepchart": {
    source: "iana",
    extensions: [
      "sm"
    ]
  },
  "application/vnd.street-stream": {
    source: "iana"
  },
  "application/vnd.sun.wadl+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "wadl"
    ]
  },
  "application/vnd.sun.xml.calc": {
    source: "apache",
    extensions: [
      "sxc"
    ]
  },
  "application/vnd.sun.xml.calc.template": {
    source: "apache",
    extensions: [
      "stc"
    ]
  },
  "application/vnd.sun.xml.draw": {
    source: "apache",
    extensions: [
      "sxd"
    ]
  },
  "application/vnd.sun.xml.draw.template": {
    source: "apache",
    extensions: [
      "std"
    ]
  },
  "application/vnd.sun.xml.impress": {
    source: "apache",
    extensions: [
      "sxi"
    ]
  },
  "application/vnd.sun.xml.impress.template": {
    source: "apache",
    extensions: [
      "sti"
    ]
  },
  "application/vnd.sun.xml.math": {
    source: "apache",
    extensions: [
      "sxm"
    ]
  },
  "application/vnd.sun.xml.writer": {
    source: "apache",
    extensions: [
      "sxw"
    ]
  },
  "application/vnd.sun.xml.writer.global": {
    source: "apache",
    extensions: [
      "sxg"
    ]
  },
  "application/vnd.sun.xml.writer.template": {
    source: "apache",
    extensions: [
      "stw"
    ]
  },
  "application/vnd.sus-calendar": {
    source: "iana",
    extensions: [
      "sus",
      "susp"
    ]
  },
  "application/vnd.svd": {
    source: "iana",
    extensions: [
      "svd"
    ]
  },
  "application/vnd.swiftview-ics": {
    source: "iana"
  },
  "application/vnd.sycle+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.syft+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.symbian.install": {
    source: "apache",
    extensions: [
      "sis",
      "sisx"
    ]
  },
  "application/vnd.syncml+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0,
    extensions: [
      "xsm"
    ]
  },
  "application/vnd.syncml.dm+wbxml": {
    source: "iana",
    charset: "UTF-8",
    extensions: [
      "bdm"
    ]
  },
  "application/vnd.syncml.dm+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0,
    extensions: [
      "xdm"
    ]
  },
  "application/vnd.syncml.dm.notification": {
    source: "iana"
  },
  "application/vnd.syncml.dmddf+wbxml": {
    source: "iana"
  },
  "application/vnd.syncml.dmddf+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0,
    extensions: [
      "ddf"
    ]
  },
  "application/vnd.syncml.dmtnds+wbxml": {
    source: "iana"
  },
  "application/vnd.syncml.dmtnds+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/vnd.syncml.ds.notification": {
    source: "iana"
  },
  "application/vnd.tableschema+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.tao.intent-module-archive": {
    source: "iana",
    extensions: [
      "tao"
    ]
  },
  "application/vnd.tcpdump.pcap": {
    source: "iana",
    extensions: [
      "pcap",
      "cap",
      "dmp"
    ]
  },
  "application/vnd.think-cell.ppttc+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.tmd.mediaflex.api+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.tml": {
    source: "iana"
  },
  "application/vnd.tmobile-livetv": {
    source: "iana",
    extensions: [
      "tmo"
    ]
  },
  "application/vnd.tri.onesource": {
    source: "iana"
  },
  "application/vnd.trid.tpt": {
    source: "iana",
    extensions: [
      "tpt"
    ]
  },
  "application/vnd.triscape.mxs": {
    source: "iana",
    extensions: [
      "mxs"
    ]
  },
  "application/vnd.trueapp": {
    source: "iana",
    extensions: [
      "tra"
    ]
  },
  "application/vnd.truedoc": {
    source: "iana"
  },
  "application/vnd.ubisoft.webplayer": {
    source: "iana"
  },
  "application/vnd.ufdl": {
    source: "iana",
    extensions: [
      "ufd",
      "ufdl"
    ]
  },
  "application/vnd.uiq.theme": {
    source: "iana",
    extensions: [
      "utz"
    ]
  },
  "application/vnd.umajin": {
    source: "iana",
    extensions: [
      "umj"
    ]
  },
  "application/vnd.unity": {
    source: "iana",
    extensions: [
      "unityweb"
    ]
  },
  "application/vnd.uoml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "uoml"
    ]
  },
  "application/vnd.uplanet.alert": {
    source: "iana"
  },
  "application/vnd.uplanet.alert-wbxml": {
    source: "iana"
  },
  "application/vnd.uplanet.bearer-choice": {
    source: "iana"
  },
  "application/vnd.uplanet.bearer-choice-wbxml": {
    source: "iana"
  },
  "application/vnd.uplanet.cacheop": {
    source: "iana"
  },
  "application/vnd.uplanet.cacheop-wbxml": {
    source: "iana"
  },
  "application/vnd.uplanet.channel": {
    source: "iana"
  },
  "application/vnd.uplanet.channel-wbxml": {
    source: "iana"
  },
  "application/vnd.uplanet.list": {
    source: "iana"
  },
  "application/vnd.uplanet.list-wbxml": {
    source: "iana"
  },
  "application/vnd.uplanet.listcmd": {
    source: "iana"
  },
  "application/vnd.uplanet.listcmd-wbxml": {
    source: "iana"
  },
  "application/vnd.uplanet.signal": {
    source: "iana"
  },
  "application/vnd.uri-map": {
    source: "iana"
  },
  "application/vnd.valve.source.material": {
    source: "iana"
  },
  "application/vnd.vcx": {
    source: "iana",
    extensions: [
      "vcx"
    ]
  },
  "application/vnd.vd-study": {
    source: "iana"
  },
  "application/vnd.vectorworks": {
    source: "iana"
  },
  "application/vnd.vel+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.verimatrix.vcas": {
    source: "iana"
  },
  "application/vnd.veritone.aion+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.veryant.thin": {
    source: "iana"
  },
  "application/vnd.ves.encrypted": {
    source: "iana"
  },
  "application/vnd.vidsoft.vidconference": {
    source: "iana"
  },
  "application/vnd.visio": {
    source: "iana",
    extensions: [
      "vsd",
      "vst",
      "vss",
      "vsw"
    ]
  },
  "application/vnd.visionary": {
    source: "iana",
    extensions: [
      "vis"
    ]
  },
  "application/vnd.vividence.scriptfile": {
    source: "iana"
  },
  "application/vnd.vsf": {
    source: "iana",
    extensions: [
      "vsf"
    ]
  },
  "application/vnd.wap.sic": {
    source: "iana"
  },
  "application/vnd.wap.slc": {
    source: "iana"
  },
  "application/vnd.wap.wbxml": {
    source: "iana",
    charset: "UTF-8",
    extensions: [
      "wbxml"
    ]
  },
  "application/vnd.wap.wmlc": {
    source: "iana",
    extensions: [
      "wmlc"
    ]
  },
  "application/vnd.wap.wmlscriptc": {
    source: "iana",
    extensions: [
      "wmlsc"
    ]
  },
  "application/vnd.webturbo": {
    source: "iana",
    extensions: [
      "wtb"
    ]
  },
  "application/vnd.wfa.dpp": {
    source: "iana"
  },
  "application/vnd.wfa.p2p": {
    source: "iana"
  },
  "application/vnd.wfa.wsc": {
    source: "iana"
  },
  "application/vnd.windows.devicepairing": {
    source: "iana"
  },
  "application/vnd.wmc": {
    source: "iana"
  },
  "application/vnd.wmf.bootstrap": {
    source: "iana"
  },
  "application/vnd.wolfram.mathematica": {
    source: "iana"
  },
  "application/vnd.wolfram.mathematica.package": {
    source: "iana"
  },
  "application/vnd.wolfram.player": {
    source: "iana",
    extensions: [
      "nbp"
    ]
  },
  "application/vnd.wordperfect": {
    source: "iana",
    extensions: [
      "wpd"
    ]
  },
  "application/vnd.wqd": {
    source: "iana",
    extensions: [
      "wqd"
    ]
  },
  "application/vnd.wrq-hp3000-labelled": {
    source: "iana"
  },
  "application/vnd.wt.stf": {
    source: "iana",
    extensions: [
      "stf"
    ]
  },
  "application/vnd.wv.csp+wbxml": {
    source: "iana"
  },
  "application/vnd.wv.csp+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.wv.ssp+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.xacml+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.xara": {
    source: "iana",
    extensions: [
      "xar"
    ]
  },
  "application/vnd.xfdl": {
    source: "iana",
    extensions: [
      "xfdl"
    ]
  },
  "application/vnd.xfdl.webform": {
    source: "iana"
  },
  "application/vnd.xmi+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.xmpie.cpkg": {
    source: "iana"
  },
  "application/vnd.xmpie.dpkg": {
    source: "iana"
  },
  "application/vnd.xmpie.plan": {
    source: "iana"
  },
  "application/vnd.xmpie.ppkg": {
    source: "iana"
  },
  "application/vnd.xmpie.xlim": {
    source: "iana"
  },
  "application/vnd.yamaha.hv-dic": {
    source: "iana",
    extensions: [
      "hvd"
    ]
  },
  "application/vnd.yamaha.hv-script": {
    source: "iana",
    extensions: [
      "hvs"
    ]
  },
  "application/vnd.yamaha.hv-voice": {
    source: "iana",
    extensions: [
      "hvp"
    ]
  },
  "application/vnd.yamaha.openscoreformat": {
    source: "iana",
    extensions: [
      "osf"
    ]
  },
  "application/vnd.yamaha.openscoreformat.osfpvg+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "osfpvg"
    ]
  },
  "application/vnd.yamaha.remote-setup": {
    source: "iana"
  },
  "application/vnd.yamaha.smaf-audio": {
    source: "iana",
    extensions: [
      "saf"
    ]
  },
  "application/vnd.yamaha.smaf-phrase": {
    source: "iana",
    extensions: [
      "spf"
    ]
  },
  "application/vnd.yamaha.through-ngn": {
    source: "iana"
  },
  "application/vnd.yamaha.tunnel-udpencap": {
    source: "iana"
  },
  "application/vnd.yaoweme": {
    source: "iana"
  },
  "application/vnd.yellowriver-custom-menu": {
    source: "iana",
    extensions: [
      "cmp"
    ]
  },
  "application/vnd.youtube.yt": {
    source: "iana"
  },
  "application/vnd.zul": {
    source: "iana",
    extensions: [
      "zir",
      "zirz"
    ]
  },
  "application/vnd.zzazz.deck+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "zaz"
    ]
  },
  "application/voicexml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "vxml"
    ]
  },
  "application/voucher-cms+json": {
    source: "iana",
    compressible: !0
  },
  "application/vq-rtcpxr": {
    source: "iana"
  },
  "application/wasm": {
    source: "iana",
    compressible: !0,
    extensions: [
      "wasm"
    ]
  },
  "application/watcherinfo+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "wif"
    ]
  },
  "application/webpush-options+json": {
    source: "iana",
    compressible: !0
  },
  "application/whoispp-query": {
    source: "iana"
  },
  "application/whoispp-response": {
    source: "iana"
  },
  "application/widget": {
    source: "iana",
    extensions: [
      "wgt"
    ]
  },
  "application/winhlp": {
    source: "apache",
    extensions: [
      "hlp"
    ]
  },
  "application/wita": {
    source: "iana"
  },
  "application/wordperfect5.1": {
    source: "iana"
  },
  "application/wsdl+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "wsdl"
    ]
  },
  "application/wspolicy+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "wspolicy"
    ]
  },
  "application/x-7z-compressed": {
    source: "apache",
    compressible: !1,
    extensions: [
      "7z"
    ]
  },
  "application/x-abiword": {
    source: "apache",
    extensions: [
      "abw"
    ]
  },
  "application/x-ace-compressed": {
    source: "apache",
    extensions: [
      "ace"
    ]
  },
  "application/x-amf": {
    source: "apache"
  },
  "application/x-apple-diskimage": {
    source: "apache",
    extensions: [
      "dmg"
    ]
  },
  "application/x-arj": {
    compressible: !1,
    extensions: [
      "arj"
    ]
  },
  "application/x-authorware-bin": {
    source: "apache",
    extensions: [
      "aab",
      "x32",
      "u32",
      "vox"
    ]
  },
  "application/x-authorware-map": {
    source: "apache",
    extensions: [
      "aam"
    ]
  },
  "application/x-authorware-seg": {
    source: "apache",
    extensions: [
      "aas"
    ]
  },
  "application/x-bcpio": {
    source: "apache",
    extensions: [
      "bcpio"
    ]
  },
  "application/x-bdoc": {
    compressible: !1,
    extensions: [
      "bdoc"
    ]
  },
  "application/x-bittorrent": {
    source: "apache",
    extensions: [
      "torrent"
    ]
  },
  "application/x-blorb": {
    source: "apache",
    extensions: [
      "blb",
      "blorb"
    ]
  },
  "application/x-bzip": {
    source: "apache",
    compressible: !1,
    extensions: [
      "bz"
    ]
  },
  "application/x-bzip2": {
    source: "apache",
    compressible: !1,
    extensions: [
      "bz2",
      "boz"
    ]
  },
  "application/x-cbr": {
    source: "apache",
    extensions: [
      "cbr",
      "cba",
      "cbt",
      "cbz",
      "cb7"
    ]
  },
  "application/x-cdlink": {
    source: "apache",
    extensions: [
      "vcd"
    ]
  },
  "application/x-cfs-compressed": {
    source: "apache",
    extensions: [
      "cfs"
    ]
  },
  "application/x-chat": {
    source: "apache",
    extensions: [
      "chat"
    ]
  },
  "application/x-chess-pgn": {
    source: "apache",
    extensions: [
      "pgn"
    ]
  },
  "application/x-chrome-extension": {
    extensions: [
      "crx"
    ]
  },
  "application/x-cocoa": {
    source: "nginx",
    extensions: [
      "cco"
    ]
  },
  "application/x-compress": {
    source: "apache"
  },
  "application/x-conference": {
    source: "apache",
    extensions: [
      "nsc"
    ]
  },
  "application/x-cpio": {
    source: "apache",
    extensions: [
      "cpio"
    ]
  },
  "application/x-csh": {
    source: "apache",
    extensions: [
      "csh"
    ]
  },
  "application/x-deb": {
    compressible: !1
  },
  "application/x-debian-package": {
    source: "apache",
    extensions: [
      "deb",
      "udeb"
    ]
  },
  "application/x-dgc-compressed": {
    source: "apache",
    extensions: [
      "dgc"
    ]
  },
  "application/x-director": {
    source: "apache",
    extensions: [
      "dir",
      "dcr",
      "dxr",
      "cst",
      "cct",
      "cxt",
      "w3d",
      "fgd",
      "swa"
    ]
  },
  "application/x-doom": {
    source: "apache",
    extensions: [
      "wad"
    ]
  },
  "application/x-dtbncx+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "ncx"
    ]
  },
  "application/x-dtbook+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "dtb"
    ]
  },
  "application/x-dtbresource+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "res"
    ]
  },
  "application/x-dvi": {
    source: "apache",
    compressible: !1,
    extensions: [
      "dvi"
    ]
  },
  "application/x-envoy": {
    source: "apache",
    extensions: [
      "evy"
    ]
  },
  "application/x-eva": {
    source: "apache",
    extensions: [
      "eva"
    ]
  },
  "application/x-font-bdf": {
    source: "apache",
    extensions: [
      "bdf"
    ]
  },
  "application/x-font-dos": {
    source: "apache"
  },
  "application/x-font-framemaker": {
    source: "apache"
  },
  "application/x-font-ghostscript": {
    source: "apache",
    extensions: [
      "gsf"
    ]
  },
  "application/x-font-libgrx": {
    source: "apache"
  },
  "application/x-font-linux-psf": {
    source: "apache",
    extensions: [
      "psf"
    ]
  },
  "application/x-font-pcf": {
    source: "apache",
    extensions: [
      "pcf"
    ]
  },
  "application/x-font-snf": {
    source: "apache",
    extensions: [
      "snf"
    ]
  },
  "application/x-font-speedo": {
    source: "apache"
  },
  "application/x-font-sunos-news": {
    source: "apache"
  },
  "application/x-font-type1": {
    source: "apache",
    extensions: [
      "pfa",
      "pfb",
      "pfm",
      "afm"
    ]
  },
  "application/x-font-vfont": {
    source: "apache"
  },
  "application/x-freearc": {
    source: "apache",
    extensions: [
      "arc"
    ]
  },
  "application/x-futuresplash": {
    source: "apache",
    extensions: [
      "spl"
    ]
  },
  "application/x-gca-compressed": {
    source: "apache",
    extensions: [
      "gca"
    ]
  },
  "application/x-glulx": {
    source: "apache",
    extensions: [
      "ulx"
    ]
  },
  "application/x-gnumeric": {
    source: "apache",
    extensions: [
      "gnumeric"
    ]
  },
  "application/x-gramps-xml": {
    source: "apache",
    extensions: [
      "gramps"
    ]
  },
  "application/x-gtar": {
    source: "apache",
    extensions: [
      "gtar"
    ]
  },
  "application/x-gzip": {
    source: "apache"
  },
  "application/x-hdf": {
    source: "apache",
    extensions: [
      "hdf"
    ]
  },
  "application/x-httpd-php": {
    compressible: !0,
    extensions: [
      "php"
    ]
  },
  "application/x-install-instructions": {
    source: "apache",
    extensions: [
      "install"
    ]
  },
  "application/x-iso9660-image": {
    source: "apache",
    extensions: [
      "iso"
    ]
  },
  "application/x-iwork-keynote-sffkey": {
    extensions: [
      "key"
    ]
  },
  "application/x-iwork-numbers-sffnumbers": {
    extensions: [
      "numbers"
    ]
  },
  "application/x-iwork-pages-sffpages": {
    extensions: [
      "pages"
    ]
  },
  "application/x-java-archive-diff": {
    source: "nginx",
    extensions: [
      "jardiff"
    ]
  },
  "application/x-java-jnlp-file": {
    source: "apache",
    compressible: !1,
    extensions: [
      "jnlp"
    ]
  },
  "application/x-javascript": {
    compressible: !0
  },
  "application/x-keepass2": {
    extensions: [
      "kdbx"
    ]
  },
  "application/x-latex": {
    source: "apache",
    compressible: !1,
    extensions: [
      "latex"
    ]
  },
  "application/x-lua-bytecode": {
    extensions: [
      "luac"
    ]
  },
  "application/x-lzh-compressed": {
    source: "apache",
    extensions: [
      "lzh",
      "lha"
    ]
  },
  "application/x-makeself": {
    source: "nginx",
    extensions: [
      "run"
    ]
  },
  "application/x-mie": {
    source: "apache",
    extensions: [
      "mie"
    ]
  },
  "application/x-mobipocket-ebook": {
    source: "apache",
    extensions: [
      "prc",
      "mobi"
    ]
  },
  "application/x-mpegurl": {
    compressible: !1
  },
  "application/x-ms-application": {
    source: "apache",
    extensions: [
      "application"
    ]
  },
  "application/x-ms-shortcut": {
    source: "apache",
    extensions: [
      "lnk"
    ]
  },
  "application/x-ms-wmd": {
    source: "apache",
    extensions: [
      "wmd"
    ]
  },
  "application/x-ms-wmz": {
    source: "apache",
    extensions: [
      "wmz"
    ]
  },
  "application/x-ms-xbap": {
    source: "apache",
    extensions: [
      "xbap"
    ]
  },
  "application/x-msaccess": {
    source: "apache",
    extensions: [
      "mdb"
    ]
  },
  "application/x-msbinder": {
    source: "apache",
    extensions: [
      "obd"
    ]
  },
  "application/x-mscardfile": {
    source: "apache",
    extensions: [
      "crd"
    ]
  },
  "application/x-msclip": {
    source: "apache",
    extensions: [
      "clp"
    ]
  },
  "application/x-msdos-program": {
    extensions: [
      "exe"
    ]
  },
  "application/x-msdownload": {
    source: "apache",
    extensions: [
      "exe",
      "dll",
      "com",
      "bat",
      "msi"
    ]
  },
  "application/x-msmediaview": {
    source: "apache",
    extensions: [
      "mvb",
      "m13",
      "m14"
    ]
  },
  "application/x-msmetafile": {
    source: "apache",
    extensions: [
      "wmf",
      "wmz",
      "emf",
      "emz"
    ]
  },
  "application/x-msmoney": {
    source: "apache",
    extensions: [
      "mny"
    ]
  },
  "application/x-mspublisher": {
    source: "apache",
    extensions: [
      "pub"
    ]
  },
  "application/x-msschedule": {
    source: "apache",
    extensions: [
      "scd"
    ]
  },
  "application/x-msterminal": {
    source: "apache",
    extensions: [
      "trm"
    ]
  },
  "application/x-mswrite": {
    source: "apache",
    extensions: [
      "wri"
    ]
  },
  "application/x-netcdf": {
    source: "apache",
    extensions: [
      "nc",
      "cdf"
    ]
  },
  "application/x-ns-proxy-autoconfig": {
    compressible: !0,
    extensions: [
      "pac"
    ]
  },
  "application/x-nzb": {
    source: "apache",
    extensions: [
      "nzb"
    ]
  },
  "application/x-perl": {
    source: "nginx",
    extensions: [
      "pl",
      "pm"
    ]
  },
  "application/x-pilot": {
    source: "nginx",
    extensions: [
      "prc",
      "pdb"
    ]
  },
  "application/x-pkcs12": {
    source: "apache",
    compressible: !1,
    extensions: [
      "p12",
      "pfx"
    ]
  },
  "application/x-pkcs7-certificates": {
    source: "apache",
    extensions: [
      "p7b",
      "spc"
    ]
  },
  "application/x-pkcs7-certreqresp": {
    source: "apache",
    extensions: [
      "p7r"
    ]
  },
  "application/x-pki-message": {
    source: "iana"
  },
  "application/x-rar-compressed": {
    source: "apache",
    compressible: !1,
    extensions: [
      "rar"
    ]
  },
  "application/x-redhat-package-manager": {
    source: "nginx",
    extensions: [
      "rpm"
    ]
  },
  "application/x-research-info-systems": {
    source: "apache",
    extensions: [
      "ris"
    ]
  },
  "application/x-sea": {
    source: "nginx",
    extensions: [
      "sea"
    ]
  },
  "application/x-sh": {
    source: "apache",
    compressible: !0,
    extensions: [
      "sh"
    ]
  },
  "application/x-shar": {
    source: "apache",
    extensions: [
      "shar"
    ]
  },
  "application/x-shockwave-flash": {
    source: "apache",
    compressible: !1,
    extensions: [
      "swf"
    ]
  },
  "application/x-silverlight-app": {
    source: "apache",
    extensions: [
      "xap"
    ]
  },
  "application/x-sql": {
    source: "apache",
    extensions: [
      "sql"
    ]
  },
  "application/x-stuffit": {
    source: "apache",
    compressible: !1,
    extensions: [
      "sit"
    ]
  },
  "application/x-stuffitx": {
    source: "apache",
    extensions: [
      "sitx"
    ]
  },
  "application/x-subrip": {
    source: "apache",
    extensions: [
      "srt"
    ]
  },
  "application/x-sv4cpio": {
    source: "apache",
    extensions: [
      "sv4cpio"
    ]
  },
  "application/x-sv4crc": {
    source: "apache",
    extensions: [
      "sv4crc"
    ]
  },
  "application/x-t3vm-image": {
    source: "apache",
    extensions: [
      "t3"
    ]
  },
  "application/x-tads": {
    source: "apache",
    extensions: [
      "gam"
    ]
  },
  "application/x-tar": {
    source: "apache",
    compressible: !0,
    extensions: [
      "tar"
    ]
  },
  "application/x-tcl": {
    source: "apache",
    extensions: [
      "tcl",
      "tk"
    ]
  },
  "application/x-tex": {
    source: "apache",
    extensions: [
      "tex"
    ]
  },
  "application/x-tex-tfm": {
    source: "apache",
    extensions: [
      "tfm"
    ]
  },
  "application/x-texinfo": {
    source: "apache",
    extensions: [
      "texinfo",
      "texi"
    ]
  },
  "application/x-tgif": {
    source: "apache",
    extensions: [
      "obj"
    ]
  },
  "application/x-ustar": {
    source: "apache",
    extensions: [
      "ustar"
    ]
  },
  "application/x-virtualbox-hdd": {
    compressible: !0,
    extensions: [
      "hdd"
    ]
  },
  "application/x-virtualbox-ova": {
    compressible: !0,
    extensions: [
      "ova"
    ]
  },
  "application/x-virtualbox-ovf": {
    compressible: !0,
    extensions: [
      "ovf"
    ]
  },
  "application/x-virtualbox-vbox": {
    compressible: !0,
    extensions: [
      "vbox"
    ]
  },
  "application/x-virtualbox-vbox-extpack": {
    compressible: !1,
    extensions: [
      "vbox-extpack"
    ]
  },
  "application/x-virtualbox-vdi": {
    compressible: !0,
    extensions: [
      "vdi"
    ]
  },
  "application/x-virtualbox-vhd": {
    compressible: !0,
    extensions: [
      "vhd"
    ]
  },
  "application/x-virtualbox-vmdk": {
    compressible: !0,
    extensions: [
      "vmdk"
    ]
  },
  "application/x-wais-source": {
    source: "apache",
    extensions: [
      "src"
    ]
  },
  "application/x-web-app-manifest+json": {
    compressible: !0,
    extensions: [
      "webapp"
    ]
  },
  "application/x-www-form-urlencoded": {
    source: "iana",
    compressible: !0
  },
  "application/x-x509-ca-cert": {
    source: "iana",
    extensions: [
      "der",
      "crt",
      "pem"
    ]
  },
  "application/x-x509-ca-ra-cert": {
    source: "iana"
  },
  "application/x-x509-next-ca-cert": {
    source: "iana"
  },
  "application/x-xfig": {
    source: "apache",
    extensions: [
      "fig"
    ]
  },
  "application/x-xliff+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "xlf"
    ]
  },
  "application/x-xpinstall": {
    source: "apache",
    compressible: !1,
    extensions: [
      "xpi"
    ]
  },
  "application/x-xz": {
    source: "apache",
    extensions: [
      "xz"
    ]
  },
  "application/x-zmachine": {
    source: "apache",
    extensions: [
      "z1",
      "z2",
      "z3",
      "z4",
      "z5",
      "z6",
      "z7",
      "z8"
    ]
  },
  "application/x400-bp": {
    source: "iana"
  },
  "application/xacml+xml": {
    source: "iana",
    compressible: !0
  },
  "application/xaml+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "xaml"
    ]
  },
  "application/xcap-att+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xav"
    ]
  },
  "application/xcap-caps+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xca"
    ]
  },
  "application/xcap-diff+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xdf"
    ]
  },
  "application/xcap-el+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xel"
    ]
  },
  "application/xcap-error+xml": {
    source: "iana",
    compressible: !0
  },
  "application/xcap-ns+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xns"
    ]
  },
  "application/xcon-conference-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/xcon-conference-info-diff+xml": {
    source: "iana",
    compressible: !0
  },
  "application/xenc+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xenc"
    ]
  },
  "application/xhtml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xhtml",
      "xht"
    ]
  },
  "application/xhtml-voice+xml": {
    source: "apache",
    compressible: !0
  },
  "application/xliff+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xlf"
    ]
  },
  "application/xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xml",
      "xsl",
      "xsd",
      "rng"
    ]
  },
  "application/xml-dtd": {
    source: "iana",
    compressible: !0,
    extensions: [
      "dtd"
    ]
  },
  "application/xml-external-parsed-entity": {
    source: "iana"
  },
  "application/xml-patch+xml": {
    source: "iana",
    compressible: !0
  },
  "application/xmpp+xml": {
    source: "iana",
    compressible: !0
  },
  "application/xop+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xop"
    ]
  },
  "application/xproc+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "xpl"
    ]
  },
  "application/xslt+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xsl",
      "xslt"
    ]
  },
  "application/xspf+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "xspf"
    ]
  },
  "application/xv+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mxml",
      "xhvml",
      "xvml",
      "xvm"
    ]
  },
  "application/yang": {
    source: "iana",
    extensions: [
      "yang"
    ]
  },
  "application/yang-data+json": {
    source: "iana",
    compressible: !0
  },
  "application/yang-data+xml": {
    source: "iana",
    compressible: !0
  },
  "application/yang-patch+json": {
    source: "iana",
    compressible: !0
  },
  "application/yang-patch+xml": {
    source: "iana",
    compressible: !0
  },
  "application/yin+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "yin"
    ]
  },
  "application/zip": {
    source: "iana",
    compressible: !1,
    extensions: [
      "zip"
    ]
  },
  "application/zlib": {
    source: "iana"
  },
  "application/zstd": {
    source: "iana"
  },
  "audio/1d-interleaved-parityfec": {
    source: "iana"
  },
  "audio/32kadpcm": {
    source: "iana"
  },
  "audio/3gpp": {
    source: "iana",
    compressible: !1,
    extensions: [
      "3gpp"
    ]
  },
  "audio/3gpp2": {
    source: "iana"
  },
  "audio/aac": {
    source: "iana"
  },
  "audio/ac3": {
    source: "iana"
  },
  "audio/adpcm": {
    source: "apache",
    extensions: [
      "adp"
    ]
  },
  "audio/amr": {
    source: "iana",
    extensions: [
      "amr"
    ]
  },
  "audio/amr-wb": {
    source: "iana"
  },
  "audio/amr-wb+": {
    source: "iana"
  },
  "audio/aptx": {
    source: "iana"
  },
  "audio/asc": {
    source: "iana"
  },
  "audio/atrac-advanced-lossless": {
    source: "iana"
  },
  "audio/atrac-x": {
    source: "iana"
  },
  "audio/atrac3": {
    source: "iana"
  },
  "audio/basic": {
    source: "iana",
    compressible: !1,
    extensions: [
      "au",
      "snd"
    ]
  },
  "audio/bv16": {
    source: "iana"
  },
  "audio/bv32": {
    source: "iana"
  },
  "audio/clearmode": {
    source: "iana"
  },
  "audio/cn": {
    source: "iana"
  },
  "audio/dat12": {
    source: "iana"
  },
  "audio/dls": {
    source: "iana"
  },
  "audio/dsr-es201108": {
    source: "iana"
  },
  "audio/dsr-es202050": {
    source: "iana"
  },
  "audio/dsr-es202211": {
    source: "iana"
  },
  "audio/dsr-es202212": {
    source: "iana"
  },
  "audio/dv": {
    source: "iana"
  },
  "audio/dvi4": {
    source: "iana"
  },
  "audio/eac3": {
    source: "iana"
  },
  "audio/encaprtp": {
    source: "iana"
  },
  "audio/evrc": {
    source: "iana"
  },
  "audio/evrc-qcp": {
    source: "iana"
  },
  "audio/evrc0": {
    source: "iana"
  },
  "audio/evrc1": {
    source: "iana"
  },
  "audio/evrcb": {
    source: "iana"
  },
  "audio/evrcb0": {
    source: "iana"
  },
  "audio/evrcb1": {
    source: "iana"
  },
  "audio/evrcnw": {
    source: "iana"
  },
  "audio/evrcnw0": {
    source: "iana"
  },
  "audio/evrcnw1": {
    source: "iana"
  },
  "audio/evrcwb": {
    source: "iana"
  },
  "audio/evrcwb0": {
    source: "iana"
  },
  "audio/evrcwb1": {
    source: "iana"
  },
  "audio/evs": {
    source: "iana"
  },
  "audio/flexfec": {
    source: "iana"
  },
  "audio/fwdred": {
    source: "iana"
  },
  "audio/g711-0": {
    source: "iana"
  },
  "audio/g719": {
    source: "iana"
  },
  "audio/g722": {
    source: "iana"
  },
  "audio/g7221": {
    source: "iana"
  },
  "audio/g723": {
    source: "iana"
  },
  "audio/g726-16": {
    source: "iana"
  },
  "audio/g726-24": {
    source: "iana"
  },
  "audio/g726-32": {
    source: "iana"
  },
  "audio/g726-40": {
    source: "iana"
  },
  "audio/g728": {
    source: "iana"
  },
  "audio/g729": {
    source: "iana"
  },
  "audio/g7291": {
    source: "iana"
  },
  "audio/g729d": {
    source: "iana"
  },
  "audio/g729e": {
    source: "iana"
  },
  "audio/gsm": {
    source: "iana"
  },
  "audio/gsm-efr": {
    source: "iana"
  },
  "audio/gsm-hr-08": {
    source: "iana"
  },
  "audio/ilbc": {
    source: "iana"
  },
  "audio/ip-mr_v2.5": {
    source: "iana"
  },
  "audio/isac": {
    source: "apache"
  },
  "audio/l16": {
    source: "iana"
  },
  "audio/l20": {
    source: "iana"
  },
  "audio/l24": {
    source: "iana",
    compressible: !1
  },
  "audio/l8": {
    source: "iana"
  },
  "audio/lpc": {
    source: "iana"
  },
  "audio/melp": {
    source: "iana"
  },
  "audio/melp1200": {
    source: "iana"
  },
  "audio/melp2400": {
    source: "iana"
  },
  "audio/melp600": {
    source: "iana"
  },
  "audio/mhas": {
    source: "iana"
  },
  "audio/midi": {
    source: "apache",
    extensions: [
      "mid",
      "midi",
      "kar",
      "rmi"
    ]
  },
  "audio/mobile-xmf": {
    source: "iana",
    extensions: [
      "mxmf"
    ]
  },
  "audio/mp3": {
    compressible: !1,
    extensions: [
      "mp3"
    ]
  },
  "audio/mp4": {
    source: "iana",
    compressible: !1,
    extensions: [
      "m4a",
      "mp4a"
    ]
  },
  "audio/mp4a-latm": {
    source: "iana"
  },
  "audio/mpa": {
    source: "iana"
  },
  "audio/mpa-robust": {
    source: "iana"
  },
  "audio/mpeg": {
    source: "iana",
    compressible: !1,
    extensions: [
      "mpga",
      "mp2",
      "mp2a",
      "mp3",
      "m2a",
      "m3a"
    ]
  },
  "audio/mpeg4-generic": {
    source: "iana"
  },
  "audio/musepack": {
    source: "apache"
  },
  "audio/ogg": {
    source: "iana",
    compressible: !1,
    extensions: [
      "oga",
      "ogg",
      "spx",
      "opus"
    ]
  },
  "audio/opus": {
    source: "iana"
  },
  "audio/parityfec": {
    source: "iana"
  },
  "audio/pcma": {
    source: "iana"
  },
  "audio/pcma-wb": {
    source: "iana"
  },
  "audio/pcmu": {
    source: "iana"
  },
  "audio/pcmu-wb": {
    source: "iana"
  },
  "audio/prs.sid": {
    source: "iana"
  },
  "audio/qcelp": {
    source: "iana"
  },
  "audio/raptorfec": {
    source: "iana"
  },
  "audio/red": {
    source: "iana"
  },
  "audio/rtp-enc-aescm128": {
    source: "iana"
  },
  "audio/rtp-midi": {
    source: "iana"
  },
  "audio/rtploopback": {
    source: "iana"
  },
  "audio/rtx": {
    source: "iana"
  },
  "audio/s3m": {
    source: "apache",
    extensions: [
      "s3m"
    ]
  },
  "audio/scip": {
    source: "iana"
  },
  "audio/silk": {
    source: "apache",
    extensions: [
      "sil"
    ]
  },
  "audio/smv": {
    source: "iana"
  },
  "audio/smv-qcp": {
    source: "iana"
  },
  "audio/smv0": {
    source: "iana"
  },
  "audio/sofa": {
    source: "iana"
  },
  "audio/sp-midi": {
    source: "iana"
  },
  "audio/speex": {
    source: "iana"
  },
  "audio/t140c": {
    source: "iana"
  },
  "audio/t38": {
    source: "iana"
  },
  "audio/telephone-event": {
    source: "iana"
  },
  "audio/tetra_acelp": {
    source: "iana"
  },
  "audio/tetra_acelp_bb": {
    source: "iana"
  },
  "audio/tone": {
    source: "iana"
  },
  "audio/tsvcis": {
    source: "iana"
  },
  "audio/uemclip": {
    source: "iana"
  },
  "audio/ulpfec": {
    source: "iana"
  },
  "audio/usac": {
    source: "iana"
  },
  "audio/vdvi": {
    source: "iana"
  },
  "audio/vmr-wb": {
    source: "iana"
  },
  "audio/vnd.3gpp.iufp": {
    source: "iana"
  },
  "audio/vnd.4sb": {
    source: "iana"
  },
  "audio/vnd.audiokoz": {
    source: "iana"
  },
  "audio/vnd.celp": {
    source: "iana"
  },
  "audio/vnd.cisco.nse": {
    source: "iana"
  },
  "audio/vnd.cmles.radio-events": {
    source: "iana"
  },
  "audio/vnd.cns.anp1": {
    source: "iana"
  },
  "audio/vnd.cns.inf1": {
    source: "iana"
  },
  "audio/vnd.dece.audio": {
    source: "iana",
    extensions: [
      "uva",
      "uvva"
    ]
  },
  "audio/vnd.digital-winds": {
    source: "iana",
    extensions: [
      "eol"
    ]
  },
  "audio/vnd.dlna.adts": {
    source: "iana"
  },
  "audio/vnd.dolby.heaac.1": {
    source: "iana"
  },
  "audio/vnd.dolby.heaac.2": {
    source: "iana"
  },
  "audio/vnd.dolby.mlp": {
    source: "iana"
  },
  "audio/vnd.dolby.mps": {
    source: "iana"
  },
  "audio/vnd.dolby.pl2": {
    source: "iana"
  },
  "audio/vnd.dolby.pl2x": {
    source: "iana"
  },
  "audio/vnd.dolby.pl2z": {
    source: "iana"
  },
  "audio/vnd.dolby.pulse.1": {
    source: "iana"
  },
  "audio/vnd.dra": {
    source: "iana",
    extensions: [
      "dra"
    ]
  },
  "audio/vnd.dts": {
    source: "iana",
    extensions: [
      "dts"
    ]
  },
  "audio/vnd.dts.hd": {
    source: "iana",
    extensions: [
      "dtshd"
    ]
  },
  "audio/vnd.dts.uhd": {
    source: "iana"
  },
  "audio/vnd.dvb.file": {
    source: "iana"
  },
  "audio/vnd.everad.plj": {
    source: "iana"
  },
  "audio/vnd.hns.audio": {
    source: "iana"
  },
  "audio/vnd.lucent.voice": {
    source: "iana",
    extensions: [
      "lvp"
    ]
  },
  "audio/vnd.ms-playready.media.pya": {
    source: "iana",
    extensions: [
      "pya"
    ]
  },
  "audio/vnd.nokia.mobile-xmf": {
    source: "iana"
  },
  "audio/vnd.nortel.vbk": {
    source: "iana"
  },
  "audio/vnd.nuera.ecelp4800": {
    source: "iana",
    extensions: [
      "ecelp4800"
    ]
  },
  "audio/vnd.nuera.ecelp7470": {
    source: "iana",
    extensions: [
      "ecelp7470"
    ]
  },
  "audio/vnd.nuera.ecelp9600": {
    source: "iana",
    extensions: [
      "ecelp9600"
    ]
  },
  "audio/vnd.octel.sbc": {
    source: "iana"
  },
  "audio/vnd.presonus.multitrack": {
    source: "iana"
  },
  "audio/vnd.qcelp": {
    source: "iana"
  },
  "audio/vnd.rhetorex.32kadpcm": {
    source: "iana"
  },
  "audio/vnd.rip": {
    source: "iana",
    extensions: [
      "rip"
    ]
  },
  "audio/vnd.rn-realaudio": {
    compressible: !1
  },
  "audio/vnd.sealedmedia.softseal.mpeg": {
    source: "iana"
  },
  "audio/vnd.vmx.cvsd": {
    source: "iana"
  },
  "audio/vnd.wave": {
    compressible: !1
  },
  "audio/vorbis": {
    source: "iana",
    compressible: !1
  },
  "audio/vorbis-config": {
    source: "iana"
  },
  "audio/wav": {
    compressible: !1,
    extensions: [
      "wav"
    ]
  },
  "audio/wave": {
    compressible: !1,
    extensions: [
      "wav"
    ]
  },
  "audio/webm": {
    source: "apache",
    compressible: !1,
    extensions: [
      "weba"
    ]
  },
  "audio/x-aac": {
    source: "apache",
    compressible: !1,
    extensions: [
      "aac"
    ]
  },
  "audio/x-aiff": {
    source: "apache",
    extensions: [
      "aif",
      "aiff",
      "aifc"
    ]
  },
  "audio/x-caf": {
    source: "apache",
    compressible: !1,
    extensions: [
      "caf"
    ]
  },
  "audio/x-flac": {
    source: "apache",
    extensions: [
      "flac"
    ]
  },
  "audio/x-m4a": {
    source: "nginx",
    extensions: [
      "m4a"
    ]
  },
  "audio/x-matroska": {
    source: "apache",
    extensions: [
      "mka"
    ]
  },
  "audio/x-mpegurl": {
    source: "apache",
    extensions: [
      "m3u"
    ]
  },
  "audio/x-ms-wax": {
    source: "apache",
    extensions: [
      "wax"
    ]
  },
  "audio/x-ms-wma": {
    source: "apache",
    extensions: [
      "wma"
    ]
  },
  "audio/x-pn-realaudio": {
    source: "apache",
    extensions: [
      "ram",
      "ra"
    ]
  },
  "audio/x-pn-realaudio-plugin": {
    source: "apache",
    extensions: [
      "rmp"
    ]
  },
  "audio/x-realaudio": {
    source: "nginx",
    extensions: [
      "ra"
    ]
  },
  "audio/x-tta": {
    source: "apache"
  },
  "audio/x-wav": {
    source: "apache",
    extensions: [
      "wav"
    ]
  },
  "audio/xm": {
    source: "apache",
    extensions: [
      "xm"
    ]
  },
  "chemical/x-cdx": {
    source: "apache",
    extensions: [
      "cdx"
    ]
  },
  "chemical/x-cif": {
    source: "apache",
    extensions: [
      "cif"
    ]
  },
  "chemical/x-cmdf": {
    source: "apache",
    extensions: [
      "cmdf"
    ]
  },
  "chemical/x-cml": {
    source: "apache",
    extensions: [
      "cml"
    ]
  },
  "chemical/x-csml": {
    source: "apache",
    extensions: [
      "csml"
    ]
  },
  "chemical/x-pdb": {
    source: "apache"
  },
  "chemical/x-xyz": {
    source: "apache",
    extensions: [
      "xyz"
    ]
  },
  "font/collection": {
    source: "iana",
    extensions: [
      "ttc"
    ]
  },
  "font/otf": {
    source: "iana",
    compressible: !0,
    extensions: [
      "otf"
    ]
  },
  "font/sfnt": {
    source: "iana"
  },
  "font/ttf": {
    source: "iana",
    compressible: !0,
    extensions: [
      "ttf"
    ]
  },
  "font/woff": {
    source: "iana",
    extensions: [
      "woff"
    ]
  },
  "font/woff2": {
    source: "iana",
    extensions: [
      "woff2"
    ]
  },
  "image/aces": {
    source: "iana",
    extensions: [
      "exr"
    ]
  },
  "image/apng": {
    compressible: !1,
    extensions: [
      "apng"
    ]
  },
  "image/avci": {
    source: "iana",
    extensions: [
      "avci"
    ]
  },
  "image/avcs": {
    source: "iana",
    extensions: [
      "avcs"
    ]
  },
  "image/avif": {
    source: "iana",
    compressible: !1,
    extensions: [
      "avif"
    ]
  },
  "image/bmp": {
    source: "iana",
    compressible: !0,
    extensions: [
      "bmp"
    ]
  },
  "image/cgm": {
    source: "iana",
    extensions: [
      "cgm"
    ]
  },
  "image/dicom-rle": {
    source: "iana",
    extensions: [
      "drle"
    ]
  },
  "image/emf": {
    source: "iana",
    extensions: [
      "emf"
    ]
  },
  "image/fits": {
    source: "iana",
    extensions: [
      "fits"
    ]
  },
  "image/g3fax": {
    source: "iana",
    extensions: [
      "g3"
    ]
  },
  "image/gif": {
    source: "iana",
    compressible: !1,
    extensions: [
      "gif"
    ]
  },
  "image/heic": {
    source: "iana",
    extensions: [
      "heic"
    ]
  },
  "image/heic-sequence": {
    source: "iana",
    extensions: [
      "heics"
    ]
  },
  "image/heif": {
    source: "iana",
    extensions: [
      "heif"
    ]
  },
  "image/heif-sequence": {
    source: "iana",
    extensions: [
      "heifs"
    ]
  },
  "image/hej2k": {
    source: "iana",
    extensions: [
      "hej2"
    ]
  },
  "image/hsj2": {
    source: "iana",
    extensions: [
      "hsj2"
    ]
  },
  "image/ief": {
    source: "iana",
    extensions: [
      "ief"
    ]
  },
  "image/jls": {
    source: "iana",
    extensions: [
      "jls"
    ]
  },
  "image/jp2": {
    source: "iana",
    compressible: !1,
    extensions: [
      "jp2",
      "jpg2"
    ]
  },
  "image/jpeg": {
    source: "iana",
    compressible: !1,
    extensions: [
      "jpeg",
      "jpg",
      "jpe"
    ]
  },
  "image/jph": {
    source: "iana",
    extensions: [
      "jph"
    ]
  },
  "image/jphc": {
    source: "iana",
    extensions: [
      "jhc"
    ]
  },
  "image/jpm": {
    source: "iana",
    compressible: !1,
    extensions: [
      "jpm"
    ]
  },
  "image/jpx": {
    source: "iana",
    compressible: !1,
    extensions: [
      "jpx",
      "jpf"
    ]
  },
  "image/jxr": {
    source: "iana",
    extensions: [
      "jxr"
    ]
  },
  "image/jxra": {
    source: "iana",
    extensions: [
      "jxra"
    ]
  },
  "image/jxrs": {
    source: "iana",
    extensions: [
      "jxrs"
    ]
  },
  "image/jxs": {
    source: "iana",
    extensions: [
      "jxs"
    ]
  },
  "image/jxsc": {
    source: "iana",
    extensions: [
      "jxsc"
    ]
  },
  "image/jxsi": {
    source: "iana",
    extensions: [
      "jxsi"
    ]
  },
  "image/jxss": {
    source: "iana",
    extensions: [
      "jxss"
    ]
  },
  "image/ktx": {
    source: "iana",
    extensions: [
      "ktx"
    ]
  },
  "image/ktx2": {
    source: "iana",
    extensions: [
      "ktx2"
    ]
  },
  "image/naplps": {
    source: "iana"
  },
  "image/pjpeg": {
    compressible: !1
  },
  "image/png": {
    source: "iana",
    compressible: !1,
    extensions: [
      "png"
    ]
  },
  "image/prs.btif": {
    source: "iana",
    extensions: [
      "btif"
    ]
  },
  "image/prs.pti": {
    source: "iana",
    extensions: [
      "pti"
    ]
  },
  "image/pwg-raster": {
    source: "iana"
  },
  "image/sgi": {
    source: "apache",
    extensions: [
      "sgi"
    ]
  },
  "image/svg+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "svg",
      "svgz"
    ]
  },
  "image/t38": {
    source: "iana",
    extensions: [
      "t38"
    ]
  },
  "image/tiff": {
    source: "iana",
    compressible: !1,
    extensions: [
      "tif",
      "tiff"
    ]
  },
  "image/tiff-fx": {
    source: "iana",
    extensions: [
      "tfx"
    ]
  },
  "image/vnd.adobe.photoshop": {
    source: "iana",
    compressible: !0,
    extensions: [
      "psd"
    ]
  },
  "image/vnd.airzip.accelerator.azv": {
    source: "iana",
    extensions: [
      "azv"
    ]
  },
  "image/vnd.cns.inf2": {
    source: "iana"
  },
  "image/vnd.dece.graphic": {
    source: "iana",
    extensions: [
      "uvi",
      "uvvi",
      "uvg",
      "uvvg"
    ]
  },
  "image/vnd.djvu": {
    source: "iana",
    extensions: [
      "djvu",
      "djv"
    ]
  },
  "image/vnd.dvb.subtitle": {
    source: "iana",
    extensions: [
      "sub"
    ]
  },
  "image/vnd.dwg": {
    source: "iana",
    extensions: [
      "dwg"
    ]
  },
  "image/vnd.dxf": {
    source: "iana",
    extensions: [
      "dxf"
    ]
  },
  "image/vnd.fastbidsheet": {
    source: "iana",
    extensions: [
      "fbs"
    ]
  },
  "image/vnd.fpx": {
    source: "iana",
    extensions: [
      "fpx"
    ]
  },
  "image/vnd.fst": {
    source: "iana",
    extensions: [
      "fst"
    ]
  },
  "image/vnd.fujixerox.edmics-mmr": {
    source: "iana",
    extensions: [
      "mmr"
    ]
  },
  "image/vnd.fujixerox.edmics-rlc": {
    source: "iana",
    extensions: [
      "rlc"
    ]
  },
  "image/vnd.globalgraphics.pgb": {
    source: "iana"
  },
  "image/vnd.microsoft.icon": {
    source: "iana",
    compressible: !0,
    extensions: [
      "ico"
    ]
  },
  "image/vnd.mix": {
    source: "iana"
  },
  "image/vnd.mozilla.apng": {
    source: "iana"
  },
  "image/vnd.ms-dds": {
    compressible: !0,
    extensions: [
      "dds"
    ]
  },
  "image/vnd.ms-modi": {
    source: "iana",
    extensions: [
      "mdi"
    ]
  },
  "image/vnd.ms-photo": {
    source: "apache",
    extensions: [
      "wdp"
    ]
  },
  "image/vnd.net-fpx": {
    source: "iana",
    extensions: [
      "npx"
    ]
  },
  "image/vnd.pco.b16": {
    source: "iana",
    extensions: [
      "b16"
    ]
  },
  "image/vnd.radiance": {
    source: "iana"
  },
  "image/vnd.sealed.png": {
    source: "iana"
  },
  "image/vnd.sealedmedia.softseal.gif": {
    source: "iana"
  },
  "image/vnd.sealedmedia.softseal.jpg": {
    source: "iana"
  },
  "image/vnd.svf": {
    source: "iana"
  },
  "image/vnd.tencent.tap": {
    source: "iana",
    extensions: [
      "tap"
    ]
  },
  "image/vnd.valve.source.texture": {
    source: "iana",
    extensions: [
      "vtf"
    ]
  },
  "image/vnd.wap.wbmp": {
    source: "iana",
    extensions: [
      "wbmp"
    ]
  },
  "image/vnd.xiff": {
    source: "iana",
    extensions: [
      "xif"
    ]
  },
  "image/vnd.zbrush.pcx": {
    source: "iana",
    extensions: [
      "pcx"
    ]
  },
  "image/webp": {
    source: "apache",
    extensions: [
      "webp"
    ]
  },
  "image/wmf": {
    source: "iana",
    extensions: [
      "wmf"
    ]
  },
  "image/x-3ds": {
    source: "apache",
    extensions: [
      "3ds"
    ]
  },
  "image/x-cmu-raster": {
    source: "apache",
    extensions: [
      "ras"
    ]
  },
  "image/x-cmx": {
    source: "apache",
    extensions: [
      "cmx"
    ]
  },
  "image/x-freehand": {
    source: "apache",
    extensions: [
      "fh",
      "fhc",
      "fh4",
      "fh5",
      "fh7"
    ]
  },
  "image/x-icon": {
    source: "apache",
    compressible: !0,
    extensions: [
      "ico"
    ]
  },
  "image/x-jng": {
    source: "nginx",
    extensions: [
      "jng"
    ]
  },
  "image/x-mrsid-image": {
    source: "apache",
    extensions: [
      "sid"
    ]
  },
  "image/x-ms-bmp": {
    source: "nginx",
    compressible: !0,
    extensions: [
      "bmp"
    ]
  },
  "image/x-pcx": {
    source: "apache",
    extensions: [
      "pcx"
    ]
  },
  "image/x-pict": {
    source: "apache",
    extensions: [
      "pic",
      "pct"
    ]
  },
  "image/x-portable-anymap": {
    source: "apache",
    extensions: [
      "pnm"
    ]
  },
  "image/x-portable-bitmap": {
    source: "apache",
    extensions: [
      "pbm"
    ]
  },
  "image/x-portable-graymap": {
    source: "apache",
    extensions: [
      "pgm"
    ]
  },
  "image/x-portable-pixmap": {
    source: "apache",
    extensions: [
      "ppm"
    ]
  },
  "image/x-rgb": {
    source: "apache",
    extensions: [
      "rgb"
    ]
  },
  "image/x-tga": {
    source: "apache",
    extensions: [
      "tga"
    ]
  },
  "image/x-xbitmap": {
    source: "apache",
    extensions: [
      "xbm"
    ]
  },
  "image/x-xcf": {
    compressible: !1
  },
  "image/x-xpixmap": {
    source: "apache",
    extensions: [
      "xpm"
    ]
  },
  "image/x-xwindowdump": {
    source: "apache",
    extensions: [
      "xwd"
    ]
  },
  "message/cpim": {
    source: "iana"
  },
  "message/delivery-status": {
    source: "iana"
  },
  "message/disposition-notification": {
    source: "iana",
    extensions: [
      "disposition-notification"
    ]
  },
  "message/external-body": {
    source: "iana"
  },
  "message/feedback-report": {
    source: "iana"
  },
  "message/global": {
    source: "iana",
    extensions: [
      "u8msg"
    ]
  },
  "message/global-delivery-status": {
    source: "iana",
    extensions: [
      "u8dsn"
    ]
  },
  "message/global-disposition-notification": {
    source: "iana",
    extensions: [
      "u8mdn"
    ]
  },
  "message/global-headers": {
    source: "iana",
    extensions: [
      "u8hdr"
    ]
  },
  "message/http": {
    source: "iana",
    compressible: !1
  },
  "message/imdn+xml": {
    source: "iana",
    compressible: !0
  },
  "message/news": {
    source: "iana"
  },
  "message/partial": {
    source: "iana",
    compressible: !1
  },
  "message/rfc822": {
    source: "iana",
    compressible: !0,
    extensions: [
      "eml",
      "mime"
    ]
  },
  "message/s-http": {
    source: "iana"
  },
  "message/sip": {
    source: "iana"
  },
  "message/sipfrag": {
    source: "iana"
  },
  "message/tracking-status": {
    source: "iana"
  },
  "message/vnd.si.simp": {
    source: "iana"
  },
  "message/vnd.wfa.wsc": {
    source: "iana",
    extensions: [
      "wsc"
    ]
  },
  "model/3mf": {
    source: "iana",
    extensions: [
      "3mf"
    ]
  },
  "model/e57": {
    source: "iana"
  },
  "model/gltf+json": {
    source: "iana",
    compressible: !0,
    extensions: [
      "gltf"
    ]
  },
  "model/gltf-binary": {
    source: "iana",
    compressible: !0,
    extensions: [
      "glb"
    ]
  },
  "model/iges": {
    source: "iana",
    compressible: !1,
    extensions: [
      "igs",
      "iges"
    ]
  },
  "model/mesh": {
    source: "iana",
    compressible: !1,
    extensions: [
      "msh",
      "mesh",
      "silo"
    ]
  },
  "model/mtl": {
    source: "iana",
    extensions: [
      "mtl"
    ]
  },
  "model/obj": {
    source: "iana",
    extensions: [
      "obj"
    ]
  },
  "model/step": {
    source: "iana"
  },
  "model/step+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "stpx"
    ]
  },
  "model/step+zip": {
    source: "iana",
    compressible: !1,
    extensions: [
      "stpz"
    ]
  },
  "model/step-xml+zip": {
    source: "iana",
    compressible: !1,
    extensions: [
      "stpxz"
    ]
  },
  "model/stl": {
    source: "iana",
    extensions: [
      "stl"
    ]
  },
  "model/vnd.collada+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "dae"
    ]
  },
  "model/vnd.dwf": {
    source: "iana",
    extensions: [
      "dwf"
    ]
  },
  "model/vnd.flatland.3dml": {
    source: "iana"
  },
  "model/vnd.gdl": {
    source: "iana",
    extensions: [
      "gdl"
    ]
  },
  "model/vnd.gs-gdl": {
    source: "apache"
  },
  "model/vnd.gs.gdl": {
    source: "iana"
  },
  "model/vnd.gtw": {
    source: "iana",
    extensions: [
      "gtw"
    ]
  },
  "model/vnd.moml+xml": {
    source: "iana",
    compressible: !0
  },
  "model/vnd.mts": {
    source: "iana",
    extensions: [
      "mts"
    ]
  },
  "model/vnd.opengex": {
    source: "iana",
    extensions: [
      "ogex"
    ]
  },
  "model/vnd.parasolid.transmit.binary": {
    source: "iana",
    extensions: [
      "x_b"
    ]
  },
  "model/vnd.parasolid.transmit.text": {
    source: "iana",
    extensions: [
      "x_t"
    ]
  },
  "model/vnd.pytha.pyox": {
    source: "iana"
  },
  "model/vnd.rosette.annotated-data-model": {
    source: "iana"
  },
  "model/vnd.sap.vds": {
    source: "iana",
    extensions: [
      "vds"
    ]
  },
  "model/vnd.usdz+zip": {
    source: "iana",
    compressible: !1,
    extensions: [
      "usdz"
    ]
  },
  "model/vnd.valve.source.compiled-map": {
    source: "iana",
    extensions: [
      "bsp"
    ]
  },
  "model/vnd.vtu": {
    source: "iana",
    extensions: [
      "vtu"
    ]
  },
  "model/vrml": {
    source: "iana",
    compressible: !1,
    extensions: [
      "wrl",
      "vrml"
    ]
  },
  "model/x3d+binary": {
    source: "apache",
    compressible: !1,
    extensions: [
      "x3db",
      "x3dbz"
    ]
  },
  "model/x3d+fastinfoset": {
    source: "iana",
    extensions: [
      "x3db"
    ]
  },
  "model/x3d+vrml": {
    source: "apache",
    compressible: !1,
    extensions: [
      "x3dv",
      "x3dvz"
    ]
  },
  "model/x3d+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "x3d",
      "x3dz"
    ]
  },
  "model/x3d-vrml": {
    source: "iana",
    extensions: [
      "x3dv"
    ]
  },
  "multipart/alternative": {
    source: "iana",
    compressible: !1
  },
  "multipart/appledouble": {
    source: "iana"
  },
  "multipart/byteranges": {
    source: "iana"
  },
  "multipart/digest": {
    source: "iana"
  },
  "multipart/encrypted": {
    source: "iana",
    compressible: !1
  },
  "multipart/form-data": {
    source: "iana",
    compressible: !1
  },
  "multipart/header-set": {
    source: "iana"
  },
  "multipart/mixed": {
    source: "iana"
  },
  "multipart/multilingual": {
    source: "iana"
  },
  "multipart/parallel": {
    source: "iana"
  },
  "multipart/related": {
    source: "iana",
    compressible: !1
  },
  "multipart/report": {
    source: "iana"
  },
  "multipart/signed": {
    source: "iana",
    compressible: !1
  },
  "multipart/vnd.bint.med-plus": {
    source: "iana"
  },
  "multipart/voice-message": {
    source: "iana"
  },
  "multipart/x-mixed-replace": {
    source: "iana"
  },
  "text/1d-interleaved-parityfec": {
    source: "iana"
  },
  "text/cache-manifest": {
    source: "iana",
    compressible: !0,
    extensions: [
      "appcache",
      "manifest"
    ]
  },
  "text/calendar": {
    source: "iana",
    extensions: [
      "ics",
      "ifb"
    ]
  },
  "text/calender": {
    compressible: !0
  },
  "text/cmd": {
    compressible: !0
  },
  "text/coffeescript": {
    extensions: [
      "coffee",
      "litcoffee"
    ]
  },
  "text/cql": {
    source: "iana"
  },
  "text/cql-expression": {
    source: "iana"
  },
  "text/cql-identifier": {
    source: "iana"
  },
  "text/css": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0,
    extensions: [
      "css"
    ]
  },
  "text/csv": {
    source: "iana",
    compressible: !0,
    extensions: [
      "csv"
    ]
  },
  "text/csv-schema": {
    source: "iana"
  },
  "text/directory": {
    source: "iana"
  },
  "text/dns": {
    source: "iana"
  },
  "text/ecmascript": {
    source: "iana"
  },
  "text/encaprtp": {
    source: "iana"
  },
  "text/enriched": {
    source: "iana"
  },
  "text/fhirpath": {
    source: "iana"
  },
  "text/flexfec": {
    source: "iana"
  },
  "text/fwdred": {
    source: "iana"
  },
  "text/gff3": {
    source: "iana"
  },
  "text/grammar-ref-list": {
    source: "iana"
  },
  "text/html": {
    source: "iana",
    compressible: !0,
    extensions: [
      "html",
      "htm",
      "shtml"
    ]
  },
  "text/jade": {
    extensions: [
      "jade"
    ]
  },
  "text/javascript": {
    source: "iana",
    compressible: !0
  },
  "text/jcr-cnd": {
    source: "iana"
  },
  "text/jsx": {
    compressible: !0,
    extensions: [
      "jsx"
    ]
  },
  "text/less": {
    compressible: !0,
    extensions: [
      "less"
    ]
  },
  "text/markdown": {
    source: "iana",
    compressible: !0,
    extensions: [
      "markdown",
      "md"
    ]
  },
  "text/mathml": {
    source: "nginx",
    extensions: [
      "mml"
    ]
  },
  "text/mdx": {
    compressible: !0,
    extensions: [
      "mdx"
    ]
  },
  "text/mizar": {
    source: "iana"
  },
  "text/n3": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0,
    extensions: [
      "n3"
    ]
  },
  "text/parameters": {
    source: "iana",
    charset: "UTF-8"
  },
  "text/parityfec": {
    source: "iana"
  },
  "text/plain": {
    source: "iana",
    compressible: !0,
    extensions: [
      "txt",
      "text",
      "conf",
      "def",
      "list",
      "log",
      "in",
      "ini"
    ]
  },
  "text/provenance-notation": {
    source: "iana",
    charset: "UTF-8"
  },
  "text/prs.fallenstein.rst": {
    source: "iana"
  },
  "text/prs.lines.tag": {
    source: "iana",
    extensions: [
      "dsc"
    ]
  },
  "text/prs.prop.logic": {
    source: "iana"
  },
  "text/raptorfec": {
    source: "iana"
  },
  "text/red": {
    source: "iana"
  },
  "text/rfc822-headers": {
    source: "iana"
  },
  "text/richtext": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rtx"
    ]
  },
  "text/rtf": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rtf"
    ]
  },
  "text/rtp-enc-aescm128": {
    source: "iana"
  },
  "text/rtploopback": {
    source: "iana"
  },
  "text/rtx": {
    source: "iana"
  },
  "text/sgml": {
    source: "iana",
    extensions: [
      "sgml",
      "sgm"
    ]
  },
  "text/shaclc": {
    source: "iana"
  },
  "text/shex": {
    source: "iana",
    extensions: [
      "shex"
    ]
  },
  "text/slim": {
    extensions: [
      "slim",
      "slm"
    ]
  },
  "text/spdx": {
    source: "iana",
    extensions: [
      "spdx"
    ]
  },
  "text/strings": {
    source: "iana"
  },
  "text/stylus": {
    extensions: [
      "stylus",
      "styl"
    ]
  },
  "text/t140": {
    source: "iana"
  },
  "text/tab-separated-values": {
    source: "iana",
    compressible: !0,
    extensions: [
      "tsv"
    ]
  },
  "text/troff": {
    source: "iana",
    extensions: [
      "t",
      "tr",
      "roff",
      "man",
      "me",
      "ms"
    ]
  },
  "text/turtle": {
    source: "iana",
    charset: "UTF-8",
    extensions: [
      "ttl"
    ]
  },
  "text/ulpfec": {
    source: "iana"
  },
  "text/uri-list": {
    source: "iana",
    compressible: !0,
    extensions: [
      "uri",
      "uris",
      "urls"
    ]
  },
  "text/vcard": {
    source: "iana",
    compressible: !0,
    extensions: [
      "vcard"
    ]
  },
  "text/vnd.a": {
    source: "iana"
  },
  "text/vnd.abc": {
    source: "iana"
  },
  "text/vnd.ascii-art": {
    source: "iana"
  },
  "text/vnd.curl": {
    source: "iana",
    extensions: [
      "curl"
    ]
  },
  "text/vnd.curl.dcurl": {
    source: "apache",
    extensions: [
      "dcurl"
    ]
  },
  "text/vnd.curl.mcurl": {
    source: "apache",
    extensions: [
      "mcurl"
    ]
  },
  "text/vnd.curl.scurl": {
    source: "apache",
    extensions: [
      "scurl"
    ]
  },
  "text/vnd.debian.copyright": {
    source: "iana",
    charset: "UTF-8"
  },
  "text/vnd.dmclientscript": {
    source: "iana"
  },
  "text/vnd.dvb.subtitle": {
    source: "iana",
    extensions: [
      "sub"
    ]
  },
  "text/vnd.esmertec.theme-descriptor": {
    source: "iana",
    charset: "UTF-8"
  },
  "text/vnd.familysearch.gedcom": {
    source: "iana",
    extensions: [
      "ged"
    ]
  },
  "text/vnd.ficlab.flt": {
    source: "iana"
  },
  "text/vnd.fly": {
    source: "iana",
    extensions: [
      "fly"
    ]
  },
  "text/vnd.fmi.flexstor": {
    source: "iana",
    extensions: [
      "flx"
    ]
  },
  "text/vnd.gml": {
    source: "iana"
  },
  "text/vnd.graphviz": {
    source: "iana",
    extensions: [
      "gv"
    ]
  },
  "text/vnd.hans": {
    source: "iana"
  },
  "text/vnd.hgl": {
    source: "iana"
  },
  "text/vnd.in3d.3dml": {
    source: "iana",
    extensions: [
      "3dml"
    ]
  },
  "text/vnd.in3d.spot": {
    source: "iana",
    extensions: [
      "spot"
    ]
  },
  "text/vnd.iptc.newsml": {
    source: "iana"
  },
  "text/vnd.iptc.nitf": {
    source: "iana"
  },
  "text/vnd.latex-z": {
    source: "iana"
  },
  "text/vnd.motorola.reflex": {
    source: "iana"
  },
  "text/vnd.ms-mediapackage": {
    source: "iana"
  },
  "text/vnd.net2phone.commcenter.command": {
    source: "iana"
  },
  "text/vnd.radisys.msml-basic-layout": {
    source: "iana"
  },
  "text/vnd.senx.warpscript": {
    source: "iana"
  },
  "text/vnd.si.uricatalogue": {
    source: "iana"
  },
  "text/vnd.sosi": {
    source: "iana"
  },
  "text/vnd.sun.j2me.app-descriptor": {
    source: "iana",
    charset: "UTF-8",
    extensions: [
      "jad"
    ]
  },
  "text/vnd.trolltech.linguist": {
    source: "iana",
    charset: "UTF-8"
  },
  "text/vnd.wap.si": {
    source: "iana"
  },
  "text/vnd.wap.sl": {
    source: "iana"
  },
  "text/vnd.wap.wml": {
    source: "iana",
    extensions: [
      "wml"
    ]
  },
  "text/vnd.wap.wmlscript": {
    source: "iana",
    extensions: [
      "wmls"
    ]
  },
  "text/vtt": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0,
    extensions: [
      "vtt"
    ]
  },
  "text/x-asm": {
    source: "apache",
    extensions: [
      "s",
      "asm"
    ]
  },
  "text/x-c": {
    source: "apache",
    extensions: [
      "c",
      "cc",
      "cxx",
      "cpp",
      "h",
      "hh",
      "dic"
    ]
  },
  "text/x-component": {
    source: "nginx",
    extensions: [
      "htc"
    ]
  },
  "text/x-fortran": {
    source: "apache",
    extensions: [
      "f",
      "for",
      "f77",
      "f90"
    ]
  },
  "text/x-gwt-rpc": {
    compressible: !0
  },
  "text/x-handlebars-template": {
    extensions: [
      "hbs"
    ]
  },
  "text/x-java-source": {
    source: "apache",
    extensions: [
      "java"
    ]
  },
  "text/x-jquery-tmpl": {
    compressible: !0
  },
  "text/x-lua": {
    extensions: [
      "lua"
    ]
  },
  "text/x-markdown": {
    compressible: !0,
    extensions: [
      "mkd"
    ]
  },
  "text/x-nfo": {
    source: "apache",
    extensions: [
      "nfo"
    ]
  },
  "text/x-opml": {
    source: "apache",
    extensions: [
      "opml"
    ]
  },
  "text/x-org": {
    compressible: !0,
    extensions: [
      "org"
    ]
  },
  "text/x-pascal": {
    source: "apache",
    extensions: [
      "p",
      "pas"
    ]
  },
  "text/x-processing": {
    compressible: !0,
    extensions: [
      "pde"
    ]
  },
  "text/x-sass": {
    extensions: [
      "sass"
    ]
  },
  "text/x-scss": {
    extensions: [
      "scss"
    ]
  },
  "text/x-setext": {
    source: "apache",
    extensions: [
      "etx"
    ]
  },
  "text/x-sfv": {
    source: "apache",
    extensions: [
      "sfv"
    ]
  },
  "text/x-suse-ymp": {
    compressible: !0,
    extensions: [
      "ymp"
    ]
  },
  "text/x-uuencode": {
    source: "apache",
    extensions: [
      "uu"
    ]
  },
  "text/x-vcalendar": {
    source: "apache",
    extensions: [
      "vcs"
    ]
  },
  "text/x-vcard": {
    source: "apache",
    extensions: [
      "vcf"
    ]
  },
  "text/xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xml"
    ]
  },
  "text/xml-external-parsed-entity": {
    source: "iana"
  },
  "text/yaml": {
    compressible: !0,
    extensions: [
      "yaml",
      "yml"
    ]
  },
  "video/1d-interleaved-parityfec": {
    source: "iana"
  },
  "video/3gpp": {
    source: "iana",
    extensions: [
      "3gp",
      "3gpp"
    ]
  },
  "video/3gpp-tt": {
    source: "iana"
  },
  "video/3gpp2": {
    source: "iana",
    extensions: [
      "3g2"
    ]
  },
  "video/av1": {
    source: "iana"
  },
  "video/bmpeg": {
    source: "iana"
  },
  "video/bt656": {
    source: "iana"
  },
  "video/celb": {
    source: "iana"
  },
  "video/dv": {
    source: "iana"
  },
  "video/encaprtp": {
    source: "iana"
  },
  "video/ffv1": {
    source: "iana"
  },
  "video/flexfec": {
    source: "iana"
  },
  "video/h261": {
    source: "iana",
    extensions: [
      "h261"
    ]
  },
  "video/h263": {
    source: "iana",
    extensions: [
      "h263"
    ]
  },
  "video/h263-1998": {
    source: "iana"
  },
  "video/h263-2000": {
    source: "iana"
  },
  "video/h264": {
    source: "iana",
    extensions: [
      "h264"
    ]
  },
  "video/h264-rcdo": {
    source: "iana"
  },
  "video/h264-svc": {
    source: "iana"
  },
  "video/h265": {
    source: "iana"
  },
  "video/iso.segment": {
    source: "iana",
    extensions: [
      "m4s"
    ]
  },
  "video/jpeg": {
    source: "iana",
    extensions: [
      "jpgv"
    ]
  },
  "video/jpeg2000": {
    source: "iana"
  },
  "video/jpm": {
    source: "apache",
    extensions: [
      "jpm",
      "jpgm"
    ]
  },
  "video/jxsv": {
    source: "iana"
  },
  "video/mj2": {
    source: "iana",
    extensions: [
      "mj2",
      "mjp2"
    ]
  },
  "video/mp1s": {
    source: "iana"
  },
  "video/mp2p": {
    source: "iana"
  },
  "video/mp2t": {
    source: "iana",
    extensions: [
      "ts"
    ]
  },
  "video/mp4": {
    source: "iana",
    compressible: !1,
    extensions: [
      "mp4",
      "mp4v",
      "mpg4"
    ]
  },
  "video/mp4v-es": {
    source: "iana"
  },
  "video/mpeg": {
    source: "iana",
    compressible: !1,
    extensions: [
      "mpeg",
      "mpg",
      "mpe",
      "m1v",
      "m2v"
    ]
  },
  "video/mpeg4-generic": {
    source: "iana"
  },
  "video/mpv": {
    source: "iana"
  },
  "video/nv": {
    source: "iana"
  },
  "video/ogg": {
    source: "iana",
    compressible: !1,
    extensions: [
      "ogv"
    ]
  },
  "video/parityfec": {
    source: "iana"
  },
  "video/pointer": {
    source: "iana"
  },
  "video/quicktime": {
    source: "iana",
    compressible: !1,
    extensions: [
      "qt",
      "mov"
    ]
  },
  "video/raptorfec": {
    source: "iana"
  },
  "video/raw": {
    source: "iana"
  },
  "video/rtp-enc-aescm128": {
    source: "iana"
  },
  "video/rtploopback": {
    source: "iana"
  },
  "video/rtx": {
    source: "iana"
  },
  "video/scip": {
    source: "iana"
  },
  "video/smpte291": {
    source: "iana"
  },
  "video/smpte292m": {
    source: "iana"
  },
  "video/ulpfec": {
    source: "iana"
  },
  "video/vc1": {
    source: "iana"
  },
  "video/vc2": {
    source: "iana"
  },
  "video/vnd.cctv": {
    source: "iana"
  },
  "video/vnd.dece.hd": {
    source: "iana",
    extensions: [
      "uvh",
      "uvvh"
    ]
  },
  "video/vnd.dece.mobile": {
    source: "iana",
    extensions: [
      "uvm",
      "uvvm"
    ]
  },
  "video/vnd.dece.mp4": {
    source: "iana"
  },
  "video/vnd.dece.pd": {
    source: "iana",
    extensions: [
      "uvp",
      "uvvp"
    ]
  },
  "video/vnd.dece.sd": {
    source: "iana",
    extensions: [
      "uvs",
      "uvvs"
    ]
  },
  "video/vnd.dece.video": {
    source: "iana",
    extensions: [
      "uvv",
      "uvvv"
    ]
  },
  "video/vnd.directv.mpeg": {
    source: "iana"
  },
  "video/vnd.directv.mpeg-tts": {
    source: "iana"
  },
  "video/vnd.dlna.mpeg-tts": {
    source: "iana"
  },
  "video/vnd.dvb.file": {
    source: "iana",
    extensions: [
      "dvb"
    ]
  },
  "video/vnd.fvt": {
    source: "iana",
    extensions: [
      "fvt"
    ]
  },
  "video/vnd.hns.video": {
    source: "iana"
  },
  "video/vnd.iptvforum.1dparityfec-1010": {
    source: "iana"
  },
  "video/vnd.iptvforum.1dparityfec-2005": {
    source: "iana"
  },
  "video/vnd.iptvforum.2dparityfec-1010": {
    source: "iana"
  },
  "video/vnd.iptvforum.2dparityfec-2005": {
    source: "iana"
  },
  "video/vnd.iptvforum.ttsavc": {
    source: "iana"
  },
  "video/vnd.iptvforum.ttsmpeg2": {
    source: "iana"
  },
  "video/vnd.motorola.video": {
    source: "iana"
  },
  "video/vnd.motorola.videop": {
    source: "iana"
  },
  "video/vnd.mpegurl": {
    source: "iana",
    extensions: [
      "mxu",
      "m4u"
    ]
  },
  "video/vnd.ms-playready.media.pyv": {
    source: "iana",
    extensions: [
      "pyv"
    ]
  },
  "video/vnd.nokia.interleaved-multimedia": {
    source: "iana"
  },
  "video/vnd.nokia.mp4vr": {
    source: "iana"
  },
  "video/vnd.nokia.videovoip": {
    source: "iana"
  },
  "video/vnd.objectvideo": {
    source: "iana"
  },
  "video/vnd.radgamettools.bink": {
    source: "iana"
  },
  "video/vnd.radgamettools.smacker": {
    source: "iana"
  },
  "video/vnd.sealed.mpeg1": {
    source: "iana"
  },
  "video/vnd.sealed.mpeg4": {
    source: "iana"
  },
  "video/vnd.sealed.swf": {
    source: "iana"
  },
  "video/vnd.sealedmedia.softseal.mov": {
    source: "iana"
  },
  "video/vnd.uvvu.mp4": {
    source: "iana",
    extensions: [
      "uvu",
      "uvvu"
    ]
  },
  "video/vnd.vivo": {
    source: "iana",
    extensions: [
      "viv"
    ]
  },
  "video/vnd.youtube.yt": {
    source: "iana"
  },
  "video/vp8": {
    source: "iana"
  },
  "video/vp9": {
    source: "iana"
  },
  "video/webm": {
    source: "apache",
    compressible: !1,
    extensions: [
      "webm"
    ]
  },
  "video/x-f4v": {
    source: "apache",
    extensions: [
      "f4v"
    ]
  },
  "video/x-fli": {
    source: "apache",
    extensions: [
      "fli"
    ]
  },
  "video/x-flv": {
    source: "apache",
    compressible: !1,
    extensions: [
      "flv"
    ]
  },
  "video/x-m4v": {
    source: "apache",
    extensions: [
      "m4v"
    ]
  },
  "video/x-matroska": {
    source: "apache",
    compressible: !1,
    extensions: [
      "mkv",
      "mk3d",
      "mks"
    ]
  },
  "video/x-mng": {
    source: "apache",
    extensions: [
      "mng"
    ]
  },
  "video/x-ms-asf": {
    source: "apache",
    extensions: [
      "asf",
      "asx"
    ]
  },
  "video/x-ms-vob": {
    source: "apache",
    extensions: [
      "vob"
    ]
  },
  "video/x-ms-wm": {
    source: "apache",
    extensions: [
      "wm"
    ]
  },
  "video/x-ms-wmv": {
    source: "apache",
    compressible: !1,
    extensions: [
      "wmv"
    ]
  },
  "video/x-ms-wmx": {
    source: "apache",
    extensions: [
      "wmx"
    ]
  },
  "video/x-ms-wvx": {
    source: "apache",
    extensions: [
      "wvx"
    ]
  },
  "video/x-msvideo": {
    source: "apache",
    extensions: [
      "avi"
    ]
  },
  "video/x-sgi-movie": {
    source: "apache",
    extensions: [
      "movie"
    ]
  },
  "video/x-smv": {
    source: "apache",
    extensions: [
      "smv"
    ]
  },
  "x-conference/x-cooltalk": {
    source: "apache",
    extensions: [
      "ice"
    ]
  },
  "x-shader/x-fragment": {
    compressible: !0
  },
  "x-shader/x-vertex": {
    compressible: !0
  }
};
/*!
 * mime-db
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015-2022 Douglas Christopher Wilson
 * MIT Licensed
 */
var er = Qi;
/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
(function(e) {
  var n = er, t = ko.extname, a = /^\s*([^;\s]*)(?:;|\s|$)/, o = /^text\//i;
  e.charset = s, e.charsets = { lookup: s }, e.contentType = i, e.extension = r, e.extensions = /* @__PURE__ */ Object.create(null), e.lookup = p, e.types = /* @__PURE__ */ Object.create(null), l(e.extensions, e.types);
  function s(c) {
    if (!c || typeof c != "string")
      return !1;
    var u = a.exec(c), d = u && n[u[1].toLowerCase()];
    return d && d.charset ? d.charset : u && o.test(u[1]) ? "UTF-8" : !1;
  }
  function i(c) {
    if (!c || typeof c != "string")
      return !1;
    var u = c.indexOf("/") === -1 ? e.lookup(c) : c;
    if (!u)
      return !1;
    if (u.indexOf("charset") === -1) {
      var d = e.charset(u);
      d && (u += "; charset=" + d.toLowerCase());
    }
    return u;
  }
  function r(c) {
    if (!c || typeof c != "string")
      return !1;
    var u = a.exec(c), d = u && e.extensions[u[1].toLowerCase()];
    return !d || !d.length ? !1 : d[0];
  }
  function p(c) {
    if (!c || typeof c != "string")
      return !1;
    var u = t("x." + c).toLowerCase().substr(1);
    return u && e.types[u] || !1;
  }
  function l(c, u) {
    var d = ["nginx", "apache", void 0, "iana"];
    Object.keys(n).forEach(function(b) {
      var x = n[b], v = x.extensions;
      if (!(!v || !v.length)) {
        c[b] = v;
        for (var h = 0; h < v.length; h++) {
          var w = v[h];
          if (u[w]) {
            var _ = d.indexOf(n[u[w]].source), k = d.indexOf(x.source);
            if (u[w] !== "application/octet-stream" && (_ > k || _ === k && u[w].substr(0, 12) === "application/"))
              continue;
          }
          u[w] = b;
        }
      }
    });
  }
})(Uo);
var nr = tr;
function tr(e) {
  var n = typeof setImmediate == "function" ? setImmediate : typeof process == "object" && typeof process.nextTick == "function" ? process.nextTick : null;
  n ? n(e) : setTimeout(e, 0);
}
var Sa = nr, Bo = ar;
function ar(e) {
  var n = !1;
  return Sa(function() {
    n = !0;
  }), function(a, o) {
    n ? e(a, o) : Sa(function() {
      e(a, o);
    });
  };
}
var zo = or;
function or(e) {
  Object.keys(e.jobs).forEach(sr.bind(e)), e.jobs = {};
}
function sr(e) {
  typeof this.jobs[e] == "function" && this.jobs[e]();
}
var Ra = Bo, ir = zo, qo = rr;
function rr(e, n, t, a) {
  var o = t.keyedList ? t.keyedList[t.index] : t.index;
  t.jobs[o] = cr(n, o, e[o], function(s, i) {
    o in t.jobs && (delete t.jobs[o], s ? ir(t) : t.results[o] = i, a(s, t.results));
  });
}
function cr(e, n, t, a) {
  var o;
  return e.length == 2 ? o = e(t, Ra(a)) : o = e(t, n, Ra(a)), o;
}
var $o = pr;
function pr(e, n) {
  var t = !Array.isArray(e), a = {
    index: 0,
    keyedList: t || n ? Object.keys(e) : null,
    jobs: {},
    results: t ? {} : [],
    size: t ? Object.keys(e).length : e.length
  };
  return n && a.keyedList.sort(t ? n : function(o, s) {
    return n(e[o], e[s]);
  }), a;
}
var lr = zo, ur = Bo, Mo = dr;
function dr(e) {
  Object.keys(this.jobs).length && (this.index = this.size, lr(this), ur(e)(null, this.results));
}
var mr = qo, fr = $o, xr = Mo, hr = vr;
function vr(e, n, t) {
  for (var a = fr(e); a.index < (a.keyedList || e).length; )
    mr(e, n, a, function(o, s) {
      if (o) {
        t(o, s);
        return;
      }
      if (Object.keys(a.jobs).length === 0) {
        t(null, a.results);
        return;
      }
    }), a.index++;
  return xr.bind(a, t);
}
var Un = { exports: {} }, Aa = qo, br = $o, gr = Mo;
Un.exports = yr;
Un.exports.ascending = Ho;
Un.exports.descending = wr;
function yr(e, n, t, a) {
  var o = br(e, t);
  return Aa(e, n, o, function s(i, r) {
    if (i) {
      a(i, r);
      return;
    }
    if (o.index++, o.index < (o.keyedList || e).length) {
      Aa(e, n, o, s);
      return;
    }
    a(null, o.results);
  }), gr.bind(o, a);
}
function Ho(e, n) {
  return e < n ? -1 : e > n ? 1 : 0;
}
function wr(e, n) {
  return -1 * Ho(e, n);
}
var Wo = Un.exports, kr = Wo, _r = Er;
function Er(e, n, t) {
  return kr(e, n, null, t);
}
var Sr = {
  parallel: hr,
  serial: _r,
  serialOrdered: Wo
}, Ko = Object, Rr = Error, Ar = EvalError, Tr = RangeError, Cr = ReferenceError, Or = SyntaxError, Yn, Ta;
function ea() {
  return Ta || (Ta = 1, Yn = TypeError), Yn;
}
var jr = URIError, Pr = Math.abs, Lr = Math.floor, Nr = Math.max, Dr = Math.min, Ir = Math.pow, Fr = Math.round, Ur = Number.isNaN || function(n) {
  return n !== n;
}, Br = Ur, zr = function(n) {
  return Br(n) || n === 0 ? n : n < 0 ? -1 : 1;
}, qr = Object.getOwnPropertyDescriptor, _n = qr;
if (_n)
  try {
    _n([], "length");
  } catch {
    _n = null;
  }
var Go = _n, En = Object.defineProperty || !1;
if (En)
  try {
    En({}, "a", { value: 1 });
  } catch {
    En = !1;
  }
var $r = En, Zn, Ca;
function Jo() {
  return Ca || (Ca = 1, Zn = function() {
    if (typeof Symbol != "function" || typeof Object.getOwnPropertySymbols != "function")
      return !1;
    if (typeof Symbol.iterator == "symbol")
      return !0;
    var n = {}, t = Symbol("test"), a = Object(t);
    if (typeof t == "string" || Object.prototype.toString.call(t) !== "[object Symbol]" || Object.prototype.toString.call(a) !== "[object Symbol]")
      return !1;
    var o = 42;
    n[t] = o;
    for (var s in n)
      return !1;
    if (typeof Object.keys == "function" && Object.keys(n).length !== 0 || typeof Object.getOwnPropertyNames == "function" && Object.getOwnPropertyNames(n).length !== 0)
      return !1;
    var i = Object.getOwnPropertySymbols(n);
    if (i.length !== 1 || i[0] !== t || !Object.prototype.propertyIsEnumerable.call(n, t))
      return !1;
    if (typeof Object.getOwnPropertyDescriptor == "function") {
      var r = (
        /** @type {PropertyDescriptor} */
        Object.getOwnPropertyDescriptor(n, t)
      );
      if (r.value !== o || r.enumerable !== !0)
        return !1;
    }
    return !0;
  }), Zn;
}
var Qn, Oa;
function Mr() {
  if (Oa) return Qn;
  Oa = 1;
  var e = typeof Symbol < "u" && Symbol, n = Jo();
  return Qn = function() {
    return typeof e != "function" || typeof Symbol != "function" || typeof e("foo") != "symbol" || typeof Symbol("bar") != "symbol" ? !1 : n();
  }, Qn;
}
var et, ja;
function Vo() {
  return ja || (ja = 1, et = typeof Reflect < "u" && Reflect.getPrototypeOf || null), et;
}
var nt, Pa;
function Xo() {
  if (Pa) return nt;
  Pa = 1;
  var e = Ko;
  return nt = e.getPrototypeOf || null, nt;
}
var Hr = "Function.prototype.bind called on incompatible ", Wr = Object.prototype.toString, Kr = Math.max, Gr = "[object Function]", La = function(n, t) {
  for (var a = [], o = 0; o < n.length; o += 1)
    a[o] = n[o];
  for (var s = 0; s < t.length; s += 1)
    a[s + n.length] = t[s];
  return a;
}, Jr = function(n, t) {
  for (var a = [], o = t, s = 0; o < n.length; o += 1, s += 1)
    a[s] = n[o];
  return a;
}, Vr = function(e, n) {
  for (var t = "", a = 0; a < e.length; a += 1)
    t += e[a], a + 1 < e.length && (t += n);
  return t;
}, Xr = function(n) {
  var t = this;
  if (typeof t != "function" || Wr.apply(t) !== Gr)
    throw new TypeError(Hr + t);
  for (var a = Jr(arguments, 1), o, s = function() {
    if (this instanceof o) {
      var c = t.apply(
        this,
        La(a, arguments)
      );
      return Object(c) === c ? c : this;
    }
    return t.apply(
      n,
      La(a, arguments)
    );
  }, i = Kr(0, t.length - a.length), r = [], p = 0; p < i; p++)
    r[p] = "$" + p;
  if (o = Function("binder", "return function (" + Vr(r, ",") + "){ return binder.apply(this,arguments); }")(s), t.prototype) {
    var l = function() {
    };
    l.prototype = t.prototype, o.prototype = new l(), l.prototype = null;
  }
  return o;
}, Yr = Xr, Bn = Function.prototype.bind || Yr, tt, Na;
function na() {
  return Na || (Na = 1, tt = Function.prototype.call), tt;
}
var at, Da;
function Yo() {
  return Da || (Da = 1, at = Function.prototype.apply), at;
}
var ot, Ia;
function Zr() {
  return Ia || (Ia = 1, ot = typeof Reflect < "u" && Reflect && Reflect.apply), ot;
}
var st, Fa;
function Qr() {
  if (Fa) return st;
  Fa = 1;
  var e = Bn, n = Yo(), t = na(), a = Zr();
  return st = a || e.call(t, n), st;
}
var it, Ua;
function ec() {
  if (Ua) return it;
  Ua = 1;
  var e = Bn, n = ea(), t = na(), a = Qr();
  return it = function(s) {
    if (s.length < 1 || typeof s[0] != "function")
      throw new n("a function is required");
    return a(e, t, s);
  }, it;
}
var rt, Ba;
function nc() {
  if (Ba) return rt;
  Ba = 1;
  var e = ec(), n = Go, t;
  try {
    t = /** @type {{ __proto__?: typeof Array.prototype }} */
    [].__proto__ === Array.prototype;
  } catch (i) {
    if (!i || typeof i != "object" || !("code" in i) || i.code !== "ERR_PROTO_ACCESS")
      throw i;
  }
  var a = !!t && n && n(
    Object.prototype,
    /** @type {keyof typeof Object.prototype} */
    "__proto__"
  ), o = Object, s = o.getPrototypeOf;
  return rt = a && typeof a.get == "function" ? e([a.get]) : typeof s == "function" ? (
    /** @type {import('./get')} */
    function(r) {
      return s(r == null ? r : o(r));
    }
  ) : !1, rt;
}
var ct, za;
function tc() {
  if (za) return ct;
  za = 1;
  var e = Vo(), n = Xo(), t = nc();
  return ct = e ? function(o) {
    return e(o);
  } : n ? function(o) {
    if (!o || typeof o != "object" && typeof o != "function")
      throw new TypeError("getProto: not an object");
    return n(o);
  } : t ? function(o) {
    return t(o);
  } : null, ct;
}
var ac = Function.prototype.call, oc = Object.prototype.hasOwnProperty, sc = Bn, ta = sc.call(ac, oc), T, ic = Ko, rc = Rr, cc = Ar, pc = Tr, lc = Cr, Ge = Or, Me = ea(), uc = jr, dc = Pr, mc = Lr, fc = Nr, xc = Dr, hc = Ir, vc = Fr, bc = zr, Zo = Function, pt = function(e) {
  try {
    return Zo('"use strict"; return (' + e + ").constructor;")();
  } catch {
  }
}, en = Go, gc = $r, lt = function() {
  throw new Me();
}, yc = en ? function() {
  try {
    return arguments.callee, lt;
  } catch {
    try {
      return en(arguments, "callee").get;
    } catch {
      return lt;
    }
  }
}() : lt, Fe = Mr()(), Z = tc(), wc = Xo(), kc = Vo(), Qo = Yo(), cn = na(), ze = {}, _c = typeof Uint8Array > "u" || !Z ? T : Z(Uint8Array), Ce = {
  __proto__: null,
  "%AggregateError%": typeof AggregateError > "u" ? T : AggregateError,
  "%Array%": Array,
  "%ArrayBuffer%": typeof ArrayBuffer > "u" ? T : ArrayBuffer,
  "%ArrayIteratorPrototype%": Fe && Z ? Z([][Symbol.iterator]()) : T,
  "%AsyncFromSyncIteratorPrototype%": T,
  "%AsyncFunction%": ze,
  "%AsyncGenerator%": ze,
  "%AsyncGeneratorFunction%": ze,
  "%AsyncIteratorPrototype%": ze,
  "%Atomics%": typeof Atomics > "u" ? T : Atomics,
  "%BigInt%": typeof BigInt > "u" ? T : BigInt,
  "%BigInt64Array%": typeof BigInt64Array > "u" ? T : BigInt64Array,
  "%BigUint64Array%": typeof BigUint64Array > "u" ? T : BigUint64Array,
  "%Boolean%": Boolean,
  "%DataView%": typeof DataView > "u" ? T : DataView,
  "%Date%": Date,
  "%decodeURI%": decodeURI,
  "%decodeURIComponent%": decodeURIComponent,
  "%encodeURI%": encodeURI,
  "%encodeURIComponent%": encodeURIComponent,
  "%Error%": rc,
  "%eval%": eval,
  // eslint-disable-line no-eval
  "%EvalError%": cc,
  "%Float16Array%": typeof Float16Array > "u" ? T : Float16Array,
  "%Float32Array%": typeof Float32Array > "u" ? T : Float32Array,
  "%Float64Array%": typeof Float64Array > "u" ? T : Float64Array,
  "%FinalizationRegistry%": typeof FinalizationRegistry > "u" ? T : FinalizationRegistry,
  "%Function%": Zo,
  "%GeneratorFunction%": ze,
  "%Int8Array%": typeof Int8Array > "u" ? T : Int8Array,
  "%Int16Array%": typeof Int16Array > "u" ? T : Int16Array,
  "%Int32Array%": typeof Int32Array > "u" ? T : Int32Array,
  "%isFinite%": isFinite,
  "%isNaN%": isNaN,
  "%IteratorPrototype%": Fe && Z ? Z(Z([][Symbol.iterator]())) : T,
  "%JSON%": typeof JSON == "object" ? JSON : T,
  "%Map%": typeof Map > "u" ? T : Map,
  "%MapIteratorPrototype%": typeof Map > "u" || !Fe || !Z ? T : Z((/* @__PURE__ */ new Map())[Symbol.iterator]()),
  "%Math%": Math,
  "%Number%": Number,
  "%Object%": ic,
  "%Object.getOwnPropertyDescriptor%": en,
  "%parseFloat%": parseFloat,
  "%parseInt%": parseInt,
  "%Promise%": typeof Promise > "u" ? T : Promise,
  "%Proxy%": typeof Proxy > "u" ? T : Proxy,
  "%RangeError%": pc,
  "%ReferenceError%": lc,
  "%Reflect%": typeof Reflect > "u" ? T : Reflect,
  "%RegExp%": RegExp,
  "%Set%": typeof Set > "u" ? T : Set,
  "%SetIteratorPrototype%": typeof Set > "u" || !Fe || !Z ? T : Z((/* @__PURE__ */ new Set())[Symbol.iterator]()),
  "%SharedArrayBuffer%": typeof SharedArrayBuffer > "u" ? T : SharedArrayBuffer,
  "%String%": String,
  "%StringIteratorPrototype%": Fe && Z ? Z(""[Symbol.iterator]()) : T,
  "%Symbol%": Fe ? Symbol : T,
  "%SyntaxError%": Ge,
  "%ThrowTypeError%": yc,
  "%TypedArray%": _c,
  "%TypeError%": Me,
  "%Uint8Array%": typeof Uint8Array > "u" ? T : Uint8Array,
  "%Uint8ClampedArray%": typeof Uint8ClampedArray > "u" ? T : Uint8ClampedArray,
  "%Uint16Array%": typeof Uint16Array > "u" ? T : Uint16Array,
  "%Uint32Array%": typeof Uint32Array > "u" ? T : Uint32Array,
  "%URIError%": uc,
  "%WeakMap%": typeof WeakMap > "u" ? T : WeakMap,
  "%WeakRef%": typeof WeakRef > "u" ? T : WeakRef,
  "%WeakSet%": typeof WeakSet > "u" ? T : WeakSet,
  "%Function.prototype.call%": cn,
  "%Function.prototype.apply%": Qo,
  "%Object.defineProperty%": gc,
  "%Object.getPrototypeOf%": wc,
  "%Math.abs%": dc,
  "%Math.floor%": mc,
  "%Math.max%": fc,
  "%Math.min%": xc,
  "%Math.pow%": hc,
  "%Math.round%": vc,
  "%Math.sign%": bc,
  "%Reflect.getPrototypeOf%": kc
};
if (Z)
  try {
    null.error;
  } catch (e) {
    var Ec = Z(Z(e));
    Ce["%Error.prototype%"] = Ec;
  }
var Sc = function e(n) {
  var t;
  if (n === "%AsyncFunction%")
    t = pt("async function () {}");
  else if (n === "%GeneratorFunction%")
    t = pt("function* () {}");
  else if (n === "%AsyncGeneratorFunction%")
    t = pt("async function* () {}");
  else if (n === "%AsyncGenerator%") {
    var a = e("%AsyncGeneratorFunction%");
    a && (t = a.prototype);
  } else if (n === "%AsyncIteratorPrototype%") {
    var o = e("%AsyncGenerator%");
    o && Z && (t = Z(o.prototype));
  }
  return Ce[n] = t, t;
}, qa = {
  __proto__: null,
  "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
  "%ArrayPrototype%": ["Array", "prototype"],
  "%ArrayProto_entries%": ["Array", "prototype", "entries"],
  "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
  "%ArrayProto_keys%": ["Array", "prototype", "keys"],
  "%ArrayProto_values%": ["Array", "prototype", "values"],
  "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
  "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
  "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
  "%BooleanPrototype%": ["Boolean", "prototype"],
  "%DataViewPrototype%": ["DataView", "prototype"],
  "%DatePrototype%": ["Date", "prototype"],
  "%ErrorPrototype%": ["Error", "prototype"],
  "%EvalErrorPrototype%": ["EvalError", "prototype"],
  "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
  "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
  "%FunctionPrototype%": ["Function", "prototype"],
  "%Generator%": ["GeneratorFunction", "prototype"],
  "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
  "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
  "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
  "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
  "%JSONParse%": ["JSON", "parse"],
  "%JSONStringify%": ["JSON", "stringify"],
  "%MapPrototype%": ["Map", "prototype"],
  "%NumberPrototype%": ["Number", "prototype"],
  "%ObjectPrototype%": ["Object", "prototype"],
  "%ObjProto_toString%": ["Object", "prototype", "toString"],
  "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
  "%PromisePrototype%": ["Promise", "prototype"],
  "%PromiseProto_then%": ["Promise", "prototype", "then"],
  "%Promise_all%": ["Promise", "all"],
  "%Promise_reject%": ["Promise", "reject"],
  "%Promise_resolve%": ["Promise", "resolve"],
  "%RangeErrorPrototype%": ["RangeError", "prototype"],
  "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
  "%RegExpPrototype%": ["RegExp", "prototype"],
  "%SetPrototype%": ["Set", "prototype"],
  "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
  "%StringPrototype%": ["String", "prototype"],
  "%SymbolPrototype%": ["Symbol", "prototype"],
  "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
  "%TypedArrayPrototype%": ["TypedArray", "prototype"],
  "%TypeErrorPrototype%": ["TypeError", "prototype"],
  "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
  "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
  "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
  "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
  "%URIErrorPrototype%": ["URIError", "prototype"],
  "%WeakMapPrototype%": ["WeakMap", "prototype"],
  "%WeakSetPrototype%": ["WeakSet", "prototype"]
}, pn = Bn, An = ta, Rc = pn.call(cn, Array.prototype.concat), Ac = pn.call(Qo, Array.prototype.splice), $a = pn.call(cn, String.prototype.replace), Tn = pn.call(cn, String.prototype.slice), Tc = pn.call(cn, RegExp.prototype.exec), Cc = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, Oc = /\\(\\)?/g, jc = function(n) {
  var t = Tn(n, 0, 1), a = Tn(n, -1);
  if (t === "%" && a !== "%")
    throw new Ge("invalid intrinsic syntax, expected closing `%`");
  if (a === "%" && t !== "%")
    throw new Ge("invalid intrinsic syntax, expected opening `%`");
  var o = [];
  return $a(n, Cc, function(s, i, r, p) {
    o[o.length] = r ? $a(p, Oc, "$1") : i || s;
  }), o;
}, Pc = function(n, t) {
  var a = n, o;
  if (An(qa, a) && (o = qa[a], a = "%" + o[0] + "%"), An(Ce, a)) {
    var s = Ce[a];
    if (s === ze && (s = Sc(a)), typeof s > "u" && !t)
      throw new Me("intrinsic " + n + " exists, but is not available. Please file an issue!");
    return {
      alias: o,
      name: a,
      value: s
    };
  }
  throw new Ge("intrinsic " + n + " does not exist!");
}, Lc = function(n, t) {
  if (typeof n != "string" || n.length === 0)
    throw new Me("intrinsic name must be a non-empty string");
  if (arguments.length > 1 && typeof t != "boolean")
    throw new Me('"allowMissing" argument must be a boolean');
  if (Tc(/^%?[^%]*%?$/, n) === null)
    throw new Ge("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
  var a = jc(n), o = a.length > 0 ? a[0] : "", s = Pc("%" + o + "%", t), i = s.name, r = s.value, p = !1, l = s.alias;
  l && (o = l[0], Ac(a, Rc([0, 1], l)));
  for (var c = 1, u = !0; c < a.length; c += 1) {
    var d = a[c], f = Tn(d, 0, 1), b = Tn(d, -1);
    if ((f === '"' || f === "'" || f === "`" || b === '"' || b === "'" || b === "`") && f !== b)
      throw new Ge("property names with quotes must have matching quotes");
    if ((d === "constructor" || !u) && (p = !0), o += "." + d, i = "%" + o + "%", An(Ce, i))
      r = Ce[i];
    else if (r != null) {
      if (!(d in r)) {
        if (!t)
          throw new Me("base intrinsic for " + n + " exists, but the property is not available.");
        return;
      }
      if (en && c + 1 >= a.length) {
        var x = en(r, d);
        u = !!x, u && "get" in x && !("originalValue" in x.get) ? r = x.get : r = r[d];
      } else
        u = An(r, d), r = r[d];
      u && !p && (Ce[i] = r);
    }
  }
  return r;
}, ut, Ma;
function Nc() {
  if (Ma) return ut;
  Ma = 1;
  var e = Jo();
  return ut = function() {
    return e() && !!Symbol.toStringTag;
  }, ut;
}
var Dc = Lc, Ha = Dc("%Object.defineProperty%", !0), Ic = Nc()(), Fc = ta, Uc = ea(), fn = Ic ? Symbol.toStringTag : null, Bc = function(n, t) {
  var a = arguments.length > 2 && !!arguments[2] && arguments[2].force, o = arguments.length > 2 && !!arguments[2] && arguments[2].nonConfigurable;
  if (typeof a < "u" && typeof a != "boolean" || typeof o < "u" && typeof o != "boolean")
    throw new Uc("if provided, the `overrideIfSet` and `nonConfigurable` options must be booleans");
  fn && (a || !Fc(n, fn)) && (Ha ? Ha(n, fn, {
    configurable: !o,
    enumerable: !1,
    value: t,
    writable: !1
  }) : n[fn] = t);
}, zc = function(e, n) {
  return Object.keys(n).forEach(function(t) {
    e[t] = e[t] || n[t];
  }), e;
}, aa = Zi, qc = De, dt = ko, $c = Xt, Mc = Yt, Hc = Zt.parse, Wc = $s, Kc = te.Stream, Gc = _o, mt = Uo, Jc = Sr, Vc = Bc, Re = ta, jt = zc;
function N(e) {
  if (!(this instanceof N))
    return new N(e);
  this._overheadLength = 0, this._valueLength = 0, this._valuesToMeasure = [], aa.call(this), e = e || {};
  for (var n in e)
    this[n] = e[n];
}
qc.inherits(N, aa);
N.LINE_BREAK = `\r
`;
N.DEFAULT_CONTENT_TYPE = "application/octet-stream";
N.prototype.append = function(e, n, t) {
  t = t || {}, typeof t == "string" && (t = { filename: t });
  var a = aa.prototype.append.bind(this);
  if ((typeof n == "number" || n == null) && (n = String(n)), Array.isArray(n)) {
    this._error(new Error("Arrays are not supported."));
    return;
  }
  var o = this._multiPartHeader(e, n, t), s = this._multiPartFooter();
  a(o), a(n), a(s), this._trackLength(o, n, t);
};
N.prototype._trackLength = function(e, n, t) {
  var a = 0;
  t.knownLength != null ? a += Number(t.knownLength) : Buffer.isBuffer(n) ? a = n.length : typeof n == "string" && (a = Buffer.byteLength(n)), this._valueLength += a, this._overheadLength += Buffer.byteLength(e) + N.LINE_BREAK.length, !(!n || !n.path && !(n.readable && Re(n, "httpVersion")) && !(n instanceof Kc)) && (t.knownLength || this._valuesToMeasure.push(n));
};
N.prototype._lengthRetriever = function(e, n) {
  Re(e, "fd") ? e.end != null && e.end != 1 / 0 && e.start != null ? n(null, e.end + 1 - (e.start ? e.start : 0)) : Wc.stat(e.path, function(t, a) {
    if (t) {
      n(t);
      return;
    }
    var o = a.size - (e.start ? e.start : 0);
    n(null, o);
  }) : Re(e, "httpVersion") ? n(null, Number(e.headers["content-length"])) : Re(e, "httpModule") ? (e.on("response", function(t) {
    e.pause(), n(null, Number(t.headers["content-length"]));
  }), e.resume()) : n("Unknown stream");
};
N.prototype._multiPartHeader = function(e, n, t) {
  if (typeof t.header == "string")
    return t.header;
  var a = this._getContentDisposition(n, t), o = this._getContentType(n, t), s = "", i = {
    // add custom disposition as third element or keep it two elements if not
    "Content-Disposition": ["form-data", 'name="' + e + '"'].concat(a || []),
    // if no content type. allow it to be empty array
    "Content-Type": [].concat(o || [])
  };
  typeof t.header == "object" && jt(i, t.header);
  var r;
  for (var p in i)
    if (Re(i, p)) {
      if (r = i[p], r == null)
        continue;
      Array.isArray(r) || (r = [r]), r.length && (s += p + ": " + r.join("; ") + N.LINE_BREAK);
    }
  return "--" + this.getBoundary() + N.LINE_BREAK + s + N.LINE_BREAK;
};
N.prototype._getContentDisposition = function(e, n) {
  var t;
  if (typeof n.filepath == "string" ? t = dt.normalize(n.filepath).replace(/\\/g, "/") : n.filename || e && (e.name || e.path) ? t = dt.basename(n.filename || e && (e.name || e.path)) : e && e.readable && Re(e, "httpVersion") && (t = dt.basename(e.client._httpMessage.path || "")), t)
    return 'filename="' + t + '"';
};
N.prototype._getContentType = function(e, n) {
  var t = n.contentType;
  return !t && e && e.name && (t = mt.lookup(e.name)), !t && e && e.path && (t = mt.lookup(e.path)), !t && e && e.readable && Re(e, "httpVersion") && (t = e.headers["content-type"]), !t && (n.filepath || n.filename) && (t = mt.lookup(n.filepath || n.filename)), !t && e && typeof e == "object" && (t = N.DEFAULT_CONTENT_TYPE), t;
};
N.prototype._multiPartFooter = function() {
  return (function(e) {
    var n = N.LINE_BREAK, t = this._streams.length === 0;
    t && (n += this._lastBoundary()), e(n);
  }).bind(this);
};
N.prototype._lastBoundary = function() {
  return "--" + this.getBoundary() + "--" + N.LINE_BREAK;
};
N.prototype.getHeaders = function(e) {
  var n, t = {
    "content-type": "multipart/form-data; boundary=" + this.getBoundary()
  };
  for (n in e)
    Re(e, n) && (t[n.toLowerCase()] = e[n]);
  return t;
};
N.prototype.setBoundary = function(e) {
  if (typeof e != "string")
    throw new TypeError("FormData boundary must be a string");
  this._boundary = e;
};
N.prototype.getBoundary = function() {
  return this._boundary || this._generateBoundary(), this._boundary;
};
N.prototype.getBuffer = function() {
  for (var e = new Buffer.alloc(0), n = this.getBoundary(), t = 0, a = this._streams.length; t < a; t++)
    typeof this._streams[t] != "function" && (Buffer.isBuffer(this._streams[t]) ? e = Buffer.concat([e, this._streams[t]]) : e = Buffer.concat([e, Buffer.from(this._streams[t])]), (typeof this._streams[t] != "string" || this._streams[t].substring(2, n.length + 2) !== n) && (e = Buffer.concat([e, Buffer.from(N.LINE_BREAK)])));
  return Buffer.concat([e, Buffer.from(this._lastBoundary())]);
};
N.prototype._generateBoundary = function() {
  this._boundary = "--------------------------" + Gc.randomBytes(12).toString("hex");
};
N.prototype.getLengthSync = function() {
  var e = this._overheadLength + this._valueLength;
  return this._streams.length && (e += this._lastBoundary().length), this.hasKnownLength() || this._error(new Error("Cannot calculate proper length in synchronous way.")), e;
};
N.prototype.hasKnownLength = function() {
  var e = !0;
  return this._valuesToMeasure.length && (e = !1), e;
};
N.prototype.getLength = function(e) {
  var n = this._overheadLength + this._valueLength;
  if (this._streams.length && (n += this._lastBoundary().length), !this._valuesToMeasure.length) {
    process.nextTick(e.bind(this, null, n));
    return;
  }
  Jc.parallel(this._valuesToMeasure, this._lengthRetriever, function(t, a) {
    if (t) {
      e(t);
      return;
    }
    a.forEach(function(o) {
      n += o;
    }), e(null, n);
  });
};
N.prototype.submit = function(e, n) {
  var t, a, o = { method: "post" };
  return typeof e == "string" ? (e = Hc(e), a = jt({
    port: e.port,
    path: e.pathname,
    host: e.hostname,
    protocol: e.protocol
  }, o)) : (a = jt(e, o), a.port || (a.port = a.protocol === "https:" ? 443 : 80)), a.headers = this.getHeaders(e.headers), a.protocol === "https:" ? t = Mc.request(a) : t = $c.request(a), this.getLength((function(s, i) {
    if (s && s !== "Unknown stream") {
      this._error(s);
      return;
    }
    if (i && t.setHeader("Content-Length", i), this.pipe(t), n) {
      var r, p = function(l, c) {
        return t.removeListener("error", p), t.removeListener("response", r), n.call(this, l, c);
      };
      r = p.bind(this, null), t.on("error", p), t.on("response", r);
    }
  }).bind(this)), t;
};
N.prototype._error = function(e) {
  this.error || (this.error = e, this.pause(), this.emit("error", e));
};
N.prototype.toString = function() {
  return "[object FormData]";
};
Vc(N.prototype, "FormData");
var Xc = N;
const oa = /* @__PURE__ */ Do(Xc);
function Pt(e) {
  return m.isPlainObject(e) || m.isArray(e);
}
function es(e) {
  return m.endsWith(e, "[]") ? e.slice(0, -2) : e;
}
function ft(e, n, t) {
  return e ? e.concat(n).map(function(o, s) {
    return o = es(o), !t && s ? "[" + o + "]" : o;
  }).join(t ? "." : "") : n;
}
function Yc(e) {
  return m.isArray(e) && !e.some(Pt);
}
const Zc = m.toFlatObject(m, {}, null, function(n) {
  return /^is[A-Z]/.test(n);
});
function zn(e, n, t) {
  if (!m.isObject(e))
    throw new TypeError("target must be an object");
  n = n || new (oa || FormData)(), t = m.toFlatObject(
    t,
    {
      metaTokens: !0,
      dots: !1,
      indexes: !1
    },
    !1,
    function(v, h) {
      return !m.isUndefined(h[v]);
    }
  );
  const a = t.metaTokens, o = t.visitor || u, s = t.dots, i = t.indexes, r = t.Blob || typeof Blob < "u" && Blob, p = t.maxDepth === void 0 ? 100 : t.maxDepth, l = r && m.isSpecCompliantForm(n);
  if (!m.isFunction(o))
    throw new TypeError("visitor must be a function");
  function c(x) {
    if (x === null) return "";
    if (m.isDate(x))
      return x.toISOString();
    if (m.isBoolean(x))
      return x.toString();
    if (!l && m.isBlob(x))
      throw new g("Blob is not supported. Use a Buffer instead.");
    return m.isArrayBuffer(x) || m.isTypedArray(x) ? l && typeof Blob == "function" ? new Blob([x]) : Buffer.from(x) : x;
  }
  function u(x, v, h) {
    let w = x;
    if (m.isReactNative(n) && m.isReactNativeBlob(x))
      return n.append(ft(h, v, s), c(x)), !1;
    if (x && !h && typeof x == "object") {
      if (m.endsWith(v, "{}"))
        v = a ? v : v.slice(0, -2), x = JSON.stringify(x);
      else if (m.isArray(x) && Yc(x) || (m.isFileList(x) || m.endsWith(v, "[]")) && (w = m.toArray(x)))
        return v = es(v), w.forEach(function(k, S) {
          !(m.isUndefined(k) || k === null) && n.append(
            // eslint-disable-next-line no-nested-ternary
            i === !0 ? ft([v], S, s) : i === null ? v : v + "[]",
            c(k)
          );
        }), !1;
    }
    return Pt(x) ? !0 : (n.append(ft(h, v, s), c(x)), !1);
  }
  const d = [], f = Object.assign(Zc, {
    defaultVisitor: u,
    convertValue: c,
    isVisitable: Pt
  });
  function b(x, v, h = 0) {
    if (!m.isUndefined(x)) {
      if (h > p)
        throw new g(
          "Object is too deeply nested (" + h + " levels). Max depth: " + p,
          g.ERR_FORM_DATA_DEPTH_EXCEEDED
        );
      if (d.indexOf(x) !== -1)
        throw Error("Circular reference detected in " + v.join("."));
      d.push(x), m.forEach(x, function(_, k) {
        (!(m.isUndefined(_) || _ === null) && o.call(n, _, m.isString(k) ? k.trim() : k, v, f)) === !0 && b(_, v ? v.concat(k) : [k], h + 1);
      }), d.pop();
    }
  }
  if (!m.isObject(e))
    throw new TypeError("data must be an object");
  return b(e), n;
}
function Wa(e) {
  const n = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+"
  };
  return encodeURIComponent(e).replace(/[!'()~]|%20/g, function(a) {
    return n[a];
  });
}
function ns(e, n) {
  this._pairs = [], e && zn(e, this, n);
}
const ts = ns.prototype;
ts.append = function(n, t) {
  this._pairs.push([n, t]);
};
ts.toString = function(n) {
  const t = n ? function(a) {
    return n.call(this, a, Wa);
  } : Wa;
  return this._pairs.map(function(o) {
    return t(o[0]) + "=" + t(o[1]);
  }, "").join("&");
};
function Qc(e) {
  return encodeURIComponent(e).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
}
function sa(e, n, t) {
  if (!n)
    return e;
  const a = t && t.encode || Qc, o = m.isFunction(t) ? {
    serialize: t
  } : t, s = o && o.serialize;
  let i;
  if (s ? i = s(n, o) : i = m.isURLSearchParams(n) ? n.toString() : new ns(n, o).toString(a), i) {
    const r = e.indexOf("#");
    r !== -1 && (e = e.slice(0, r)), e += (e.indexOf("?") === -1 ? "?" : "&") + i;
  }
  return e;
}
class Ka {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   * @param {Object} options The options for the interceptor, synchronous and runWhen
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(n, t, a) {
    return this.handlers.push({
      fulfilled: n,
      rejected: t,
      synchronous: a ? a.synchronous : !1,
      runWhen: a ? a.runWhen : null
    }), this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {void}
   */
  eject(n) {
    this.handlers[n] && (this.handlers[n] = null);
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    this.handlers && (this.handlers = []);
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(n) {
    m.forEach(this.handlers, function(a) {
      a !== null && n(a);
    });
  }
}
const qn = {
  silentJSONParsing: !0,
  forcedJSONParsing: !0,
  clarifyTimeoutError: !1,
  legacyInterceptorReqResOrdering: !0
}, ep = Zt.URLSearchParams, xt = "abcdefghijklmnopqrstuvwxyz", Ga = "0123456789", as = {
  DIGIT: Ga,
  ALPHA: xt,
  ALPHA_DIGIT: xt + xt.toUpperCase() + Ga
}, np = (e = 16, n = as.ALPHA_DIGIT) => {
  let t = "";
  const { length: a } = n, o = new Uint32Array(e);
  _o.randomFillSync(o);
  for (let s = 0; s < e; s++)
    t += n[o[s] % a];
  return t;
}, tp = {
  isNode: !0,
  classes: {
    URLSearchParams: ep,
    FormData: oa,
    Blob: typeof Blob < "u" && Blob || null
  },
  ALPHABET: as,
  generateString: np,
  protocols: ["http", "https", "file", "data"]
}, ia = typeof window < "u" && typeof document < "u", Lt = typeof navigator == "object" && navigator || void 0, ap = ia && (!Lt || ["ReactNative", "NativeScript", "NS"].indexOf(Lt.product) < 0), op = typeof WorkerGlobalScope < "u" && // eslint-disable-next-line no-undef
self instanceof WorkerGlobalScope && typeof self.importScripts == "function", sp = ia && window.location.href || "http://localhost", ip = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  hasBrowserEnv: ia,
  hasStandardBrowserEnv: ap,
  hasStandardBrowserWebWorkerEnv: op,
  navigator: Lt,
  origin: sp
}, Symbol.toStringTag, { value: "Module" })), H = {
  ...ip,
  ...tp
};
function rp(e, n) {
  return zn(e, new H.classes.URLSearchParams(), {
    visitor: function(t, a, o, s) {
      return H.isNode && m.isBuffer(t) ? (this.append(a, t.toString("base64")), !1) : s.defaultVisitor.apply(this, arguments);
    },
    ...n
  });
}
function cp(e) {
  return m.matchAll(/\w+|\[(\w*)]/g, e).map((n) => n[0] === "[]" ? "" : n[1] || n[0]);
}
function pp(e) {
  const n = {}, t = Object.keys(e);
  let a;
  const o = t.length;
  let s;
  for (a = 0; a < o; a++)
    s = t[a], n[s] = e[s];
  return n;
}
function os(e) {
  function n(t, a, o, s) {
    let i = t[s++];
    if (i === "__proto__") return !0;
    const r = Number.isFinite(+i), p = s >= t.length;
    return i = !i && m.isArray(o) ? o.length : i, p ? (m.hasOwnProp(o, i) ? o[i] = m.isArray(o[i]) ? o[i].concat(a) : [o[i], a] : o[i] = a, !r) : ((!o[i] || !m.isObject(o[i])) && (o[i] = []), n(t, a, o[i], s) && m.isArray(o[i]) && (o[i] = pp(o[i])), !r);
  }
  if (m.isFormData(e) && m.isFunction(e.entries)) {
    const t = {};
    return m.forEachEntry(e, (a, o) => {
      n(cp(a), o, t, 0);
    }), t;
  }
  return null;
}
const Ue = (e, n) => e != null && m.hasOwnProp(e, n) ? e[n] : void 0;
function lp(e, n, t) {
  if (m.isString(e))
    try {
      return (n || JSON.parse)(e), m.trim(e);
    } catch (a) {
      if (a.name !== "SyntaxError")
        throw a;
    }
  return (t || JSON.stringify)(e);
}
const ln = {
  transitional: qn,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [
    function(n, t) {
      const a = t.getContentType() || "", o = a.indexOf("application/json") > -1, s = m.isObject(n);
      if (s && m.isHTMLForm(n) && (n = new FormData(n)), m.isFormData(n))
        return o ? JSON.stringify(os(n)) : n;
      if (m.isArrayBuffer(n) || m.isBuffer(n) || m.isStream(n) || m.isFile(n) || m.isBlob(n) || m.isReadableStream(n))
        return n;
      if (m.isArrayBufferView(n))
        return n.buffer;
      if (m.isURLSearchParams(n))
        return t.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), n.toString();
      let r;
      if (s) {
        const p = Ue(this, "formSerializer");
        if (a.indexOf("application/x-www-form-urlencoded") > -1)
          return rp(n, p).toString();
        if ((r = m.isFileList(n)) || a.indexOf("multipart/form-data") > -1) {
          const l = Ue(this, "env"), c = l && l.FormData;
          return zn(
            r ? { "files[]": n } : n,
            c && new c(),
            p
          );
        }
      }
      return s || o ? (t.setContentType("application/json", !1), lp(n)) : n;
    }
  ],
  transformResponse: [
    function(n) {
      const t = Ue(this, "transitional") || ln.transitional, a = t && t.forcedJSONParsing, o = Ue(this, "responseType"), s = o === "json";
      if (m.isResponse(n) || m.isReadableStream(n))
        return n;
      if (n && m.isString(n) && (a && !o || s)) {
        const r = !(t && t.silentJSONParsing) && s;
        try {
          return JSON.parse(n, Ue(this, "parseReviver"));
        } catch (p) {
          if (r)
            throw p.name === "SyntaxError" ? g.from(p, g.ERR_BAD_RESPONSE, this, null, Ue(this, "response")) : p;
        }
      }
      return n;
    }
  ],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: H.classes.FormData,
    Blob: H.classes.Blob
  },
  validateStatus: function(n) {
    return n >= 200 && n < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": void 0
    }
  }
};
m.forEach(["delete", "get", "head", "post", "put", "patch", "query"], (e) => {
  ln.headers[e] = {};
});
function ht(e, n) {
  const t = this || ln, a = n || t, o = Q.from(a.headers);
  let s = a.data;
  return m.forEach(e, function(r) {
    s = r.call(t, s, o.normalize(), n ? n.status : void 0);
  }), o.normalize(), s;
}
function ss(e) {
  return !!(e && e.__CANCEL__);
}
let Pe = class extends g {
  /**
   * A `CanceledError` is an object that is thrown when an operation is canceled.
   *
   * @param {string=} message The message.
   * @param {Object=} config The config.
   * @param {Object=} request The request.
   *
   * @returns {CanceledError} The created error.
   */
  constructor(n, t, a) {
    super(n ?? "canceled", g.ERR_CANCELED, t, a), this.name = "CanceledError", this.__CANCEL__ = !0;
  }
};
function qe(e, n, t) {
  const a = t.config.validateStatus;
  !t.status || !a || a(t.status) ? e(t) : n(new g(
    "Request failed with status code " + t.status,
    t.status >= 400 && t.status < 500 ? g.ERR_BAD_REQUEST : g.ERR_BAD_RESPONSE,
    t.config,
    t.request,
    t
  ));
}
function up(e) {
  return typeof e != "string" ? !1 : /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
}
function dp(e, n) {
  return n ? e.replace(/\/?\/$/, "") + "/" + n.replace(/^\/+/, "") : e;
}
function ra(e, n, t) {
  let a = !up(n);
  return e && (a || t === !1) ? dp(e, n) : n;
}
var mp = {
  ftp: 21,
  gopher: 70,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443
};
function fp(e) {
  try {
    return new URL(e);
  } catch {
    return null;
  }
}
function xp(e) {
  var n = (typeof e == "string" ? fp(e) : e) || {}, t = n.protocol, a = n.host, o = n.port;
  if (typeof a != "string" || !a || typeof t != "string" || (t = t.split(":", 1)[0], a = a.replace(/:\d*$/, ""), o = parseInt(o) || mp[t] || 0, !hp(a, o)))
    return "";
  var s = Nt(t + "_proxy") || Nt("all_proxy");
  return s && s.indexOf("://") === -1 && (s = t + "://" + s), s;
}
function hp(e, n) {
  var t = Nt("no_proxy").toLowerCase();
  return t ? t === "*" ? !1 : t.split(/[,\s]/).every(function(a) {
    if (!a)
      return !0;
    var o = a.match(/^(.+):(\d+)$/), s = o ? o[1] : a, i = o ? parseInt(o[2]) : 0;
    return i && i !== n ? !0 : /^[.*]/.test(s) ? (s.charAt(0) === "*" && (s = s.slice(1)), !e.endsWith(s)) : e !== s;
  }) : !0;
}
function Nt(e) {
  return process.env[e.toLowerCase()] || process.env[e.toUpperCase()] || "";
}
var ca = { exports: {} }, xn = { exports: {} }, hn = { exports: {} }, vt, Ja;
function vp() {
  if (Ja) return vt;
  Ja = 1;
  var e = 1e3, n = e * 60, t = n * 60, a = t * 24, o = a * 7, s = a * 365.25;
  vt = function(c, u) {
    u = u || {};
    var d = typeof c;
    if (d === "string" && c.length > 0)
      return i(c);
    if (d === "number" && isFinite(c))
      return u.long ? p(c) : r(c);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(c)
    );
  };
  function i(c) {
    if (c = String(c), !(c.length > 100)) {
      var u = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        c
      );
      if (u) {
        var d = parseFloat(u[1]), f = (u[2] || "ms").toLowerCase();
        switch (f) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return d * s;
          case "weeks":
          case "week":
          case "w":
            return d * o;
          case "days":
          case "day":
          case "d":
            return d * a;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return d * t;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return d * n;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return d * e;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return d;
          default:
            return;
        }
      }
    }
  }
  function r(c) {
    var u = Math.abs(c);
    return u >= a ? Math.round(c / a) + "d" : u >= t ? Math.round(c / t) + "h" : u >= n ? Math.round(c / n) + "m" : u >= e ? Math.round(c / e) + "s" : c + "ms";
  }
  function p(c) {
    var u = Math.abs(c);
    return u >= a ? l(c, u, a, "day") : u >= t ? l(c, u, t, "hour") : u >= n ? l(c, u, n, "minute") : u >= e ? l(c, u, e, "second") : c + " ms";
  }
  function l(c, u, d, f) {
    var b = u >= d * 1.5;
    return Math.round(c / d) + " " + f + (b ? "s" : "");
  }
  return vt;
}
var bt, Va;
function is() {
  if (Va) return bt;
  Va = 1;
  function e(n) {
    a.debug = a, a.default = a, a.coerce = l, a.disable = r, a.enable = s, a.enabled = p, a.humanize = vp(), a.destroy = c, Object.keys(n).forEach((u) => {
      a[u] = n[u];
    }), a.names = [], a.skips = [], a.formatters = {};
    function t(u) {
      let d = 0;
      for (let f = 0; f < u.length; f++)
        d = (d << 5) - d + u.charCodeAt(f), d |= 0;
      return a.colors[Math.abs(d) % a.colors.length];
    }
    a.selectColor = t;
    function a(u) {
      let d, f = null, b, x;
      function v(...h) {
        if (!v.enabled)
          return;
        const w = v, _ = Number(/* @__PURE__ */ new Date()), k = _ - (d || _);
        w.diff = k, w.prev = d, w.curr = _, d = _, h[0] = a.coerce(h[0]), typeof h[0] != "string" && h.unshift("%O");
        let S = 0;
        h[0] = h[0].replace(/%([a-zA-Z%])/g, (j, D) => {
          if (j === "%%")
            return "%";
          S++;
          const q = a.formatters[D];
          if (typeof q == "function") {
            const A = h[S];
            j = q.call(w, A), h.splice(S, 1), S--;
          }
          return j;
        }), a.formatArgs.call(w, h), (w.log || a.log).apply(w, h);
      }
      return v.namespace = u, v.useColors = a.useColors(), v.color = a.selectColor(u), v.extend = o, v.destroy = a.destroy, Object.defineProperty(v, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => f !== null ? f : (b !== a.namespaces && (b = a.namespaces, x = a.enabled(u)), x),
        set: (h) => {
          f = h;
        }
      }), typeof a.init == "function" && a.init(v), v;
    }
    function o(u, d) {
      const f = a(this.namespace + (typeof d > "u" ? ":" : d) + u);
      return f.log = this.log, f;
    }
    function s(u) {
      a.save(u), a.namespaces = u, a.names = [], a.skips = [];
      const d = (typeof u == "string" ? u : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const f of d)
        f[0] === "-" ? a.skips.push(f.slice(1)) : a.names.push(f);
    }
    function i(u, d) {
      let f = 0, b = 0, x = -1, v = 0;
      for (; f < u.length; )
        if (b < d.length && (d[b] === u[f] || d[b] === "*"))
          d[b] === "*" ? (x = b, v = f, b++) : (f++, b++);
        else if (x !== -1)
          b = x + 1, v++, f = v;
        else
          return !1;
      for (; b < d.length && d[b] === "*"; )
        b++;
      return b === d.length;
    }
    function r() {
      const u = [
        ...a.names,
        ...a.skips.map((d) => "-" + d)
      ].join(",");
      return a.enable(""), u;
    }
    function p(u) {
      for (const d of a.skips)
        if (i(u, d))
          return !1;
      for (const d of a.names)
        if (i(u, d))
          return !0;
      return !1;
    }
    function l(u) {
      return u instanceof Error ? u.stack || u.message : u;
    }
    function c() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return a.enable(a.load()), a;
  }
  return bt = e, bt;
}
var Xa;
function bp() {
  return Xa || (Xa = 1, function(e, n) {
    n.formatArgs = a, n.save = o, n.load = s, n.useColors = t, n.storage = i(), n.destroy = /* @__PURE__ */ (() => {
      let p = !1;
      return () => {
        p || (p = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), n.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function t() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let p;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (p = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(p[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function a(p) {
      if (p[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + p[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !this.useColors)
        return;
      const l = "color: " + this.color;
      p.splice(1, 0, l, "color: inherit");
      let c = 0, u = 0;
      p[0].replace(/%[a-zA-Z%]/g, (d) => {
        d !== "%%" && (c++, d === "%c" && (u = c));
      }), p.splice(u, 0, l);
    }
    n.log = console.debug || console.log || (() => {
    });
    function o(p) {
      try {
        p ? n.storage.setItem("debug", p) : n.storage.removeItem("debug");
      } catch {
      }
    }
    function s() {
      let p;
      try {
        p = n.storage.getItem("debug") || n.storage.getItem("DEBUG");
      } catch {
      }
      return !p && typeof process < "u" && "env" in process && (p = process.env.DEBUG), p;
    }
    function i() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = is()(n);
    const { formatters: r } = e.exports;
    r.j = function(p) {
      try {
        return JSON.stringify(p);
      } catch (l) {
        return "[UnexpectedJSONParseError]: " + l.message;
      }
    };
  }(hn, hn.exports)), hn.exports;
}
var vn = { exports: {} }, gt, Ya;
function gp() {
  return Ya || (Ya = 1, gt = (e, n = process.argv) => {
    const t = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", a = n.indexOf(t + e), o = n.indexOf("--");
    return a !== -1 && (o === -1 || a < o);
  }), gt;
}
var yt, Za;
function yp() {
  if (Za) return yt;
  Za = 1;
  const e = Hs, n = So, t = gp(), { env: a } = process;
  let o;
  t("no-color") || t("no-colors") || t("color=false") || t("color=never") ? o = 0 : (t("color") || t("colors") || t("color=true") || t("color=always")) && (o = 1), "FORCE_COLOR" in a && (a.FORCE_COLOR === "true" ? o = 1 : a.FORCE_COLOR === "false" ? o = 0 : o = a.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(a.FORCE_COLOR, 10), 3));
  function s(p) {
    return p === 0 ? !1 : {
      level: p,
      hasBasic: !0,
      has256: p >= 2,
      has16m: p >= 3
    };
  }
  function i(p, l) {
    if (o === 0)
      return 0;
    if (t("color=16m") || t("color=full") || t("color=truecolor"))
      return 3;
    if (t("color=256"))
      return 2;
    if (p && !l && o === void 0)
      return 0;
    const c = o || 0;
    if (a.TERM === "dumb")
      return c;
    if (process.platform === "win32") {
      const u = e.release().split(".");
      return Number(u[0]) >= 10 && Number(u[2]) >= 10586 ? Number(u[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in a)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((u) => u in a) || a.CI_NAME === "codeship" ? 1 : c;
    if ("TEAMCITY_VERSION" in a)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(a.TEAMCITY_VERSION) ? 1 : 0;
    if (a.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in a) {
      const u = parseInt((a.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (a.TERM_PROGRAM) {
        case "iTerm.app":
          return u >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(a.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(a.TERM) || "COLORTERM" in a ? 1 : c;
  }
  function r(p) {
    const l = i(p, p && p.isTTY);
    return s(l);
  }
  return yt = {
    supportsColor: r,
    stdout: s(i(!0, n.isatty(1))),
    stderr: s(i(!0, n.isatty(2)))
  }, yt;
}
var Qa;
function wp() {
  return Qa || (Qa = 1, function(e, n) {
    const t = So, a = De;
    n.init = c, n.log = r, n.formatArgs = s, n.save = p, n.load = l, n.useColors = o, n.destroy = a.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), n.colors = [6, 2, 3, 4, 5, 1];
    try {
      const d = yp();
      d && (d.stderr || d).level >= 2 && (n.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    n.inspectOpts = Object.keys(process.env).filter((d) => /^debug_/i.test(d)).reduce((d, f) => {
      const b = f.substring(6).toLowerCase().replace(/_([a-z])/g, (v, h) => h.toUpperCase());
      let x = process.env[f];
      return /^(yes|on|true|enabled)$/i.test(x) ? x = !0 : /^(no|off|false|disabled)$/i.test(x) ? x = !1 : x === "null" ? x = null : x = Number(x), d[b] = x, d;
    }, {});
    function o() {
      return "colors" in n.inspectOpts ? !!n.inspectOpts.colors : t.isatty(process.stderr.fd);
    }
    function s(d) {
      const { namespace: f, useColors: b } = this;
      if (b) {
        const x = this.color, v = "\x1B[3" + (x < 8 ? x : "8;5;" + x), h = `  ${v};1m${f} \x1B[0m`;
        d[0] = h + d[0].split(`
`).join(`
` + h), d.push(v + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        d[0] = i() + f + " " + d[0];
    }
    function i() {
      return n.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function r(...d) {
      return process.stderr.write(a.formatWithOptions(n.inspectOpts, ...d) + `
`);
    }
    function p(d) {
      d ? process.env.DEBUG = d : delete process.env.DEBUG;
    }
    function l() {
      return process.env.DEBUG;
    }
    function c(d) {
      d.inspectOpts = {};
      const f = Object.keys(n.inspectOpts);
      for (let b = 0; b < f.length; b++)
        d.inspectOpts[f[b]] = n.inspectOpts[f[b]];
    }
    e.exports = is()(n);
    const { formatters: u } = e.exports;
    u.o = function(d) {
      return this.inspectOpts.colors = this.useColors, a.inspect(d, this.inspectOpts).split(`
`).map((f) => f.trim()).join(" ");
    }, u.O = function(d) {
      return this.inspectOpts.colors = this.useColors, a.inspect(d, this.inspectOpts);
    };
  }(vn, vn.exports)), vn.exports;
}
var eo;
function kp() {
  return eo || (eo = 1, typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? xn.exports = bp() : xn.exports = wp()), xn.exports;
}
var Ze, _p = function() {
  if (!Ze) {
    try {
      Ze = kp()("follow-redirects");
    } catch {
    }
    typeof Ze != "function" && (Ze = function() {
    });
  }
  Ze.apply(null, arguments);
}, un = Zt, nn = un.URL, Ep = Xt, Sp = Yt, pa = te.Writable, la = Ms, rs = _p;
(function() {
  var n = typeof process < "u", t = typeof window < "u" && typeof document < "u", a = Le(Error.captureStackTrace);
  !n && (t || !a) && console.warn("The follow-redirects package should be excluded from browser builds.");
})();
var ua = !1;
try {
  la(new nn(""));
} catch (e) {
  ua = e.code === "ERR_INVALID_URL";
}
var Rp = [
  "Authorization",
  "Proxy-Authorization",
  "Cookie"
], Ap = [
  "auth",
  "host",
  "hostname",
  "href",
  "path",
  "pathname",
  "port",
  "protocol",
  "query",
  "search",
  "hash"
], da = ["abort", "aborted", "connect", "error", "socket", "timeout"], ma = /* @__PURE__ */ Object.create(null);
da.forEach(function(e) {
  ma[e] = function(n, t, a) {
    this._redirectable.emit(e, n, t, a);
  };
});
var Dt = dn(
  "ERR_INVALID_URL",
  "Invalid URL",
  TypeError
), It = dn(
  "ERR_FR_REDIRECTION_FAILURE",
  "Redirected request failed"
), Tp = dn(
  "ERR_FR_TOO_MANY_REDIRECTS",
  "Maximum number of redirects exceeded",
  It
), Cp = dn(
  "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
  "Request body larger than maxBodyLength limit"
), Op = dn(
  "ERR_STREAM_WRITE_AFTER_END",
  "write after end"
), jp = pa.prototype.destroy || ps;
function pe(e, n) {
  pa.call(this), this._sanitizeOptions(e), this._options = e, this._ended = !1, this._ending = !1, this._redirectCount = 0, this._redirects = [], this._requestBodyLength = 0, this._requestBodyBuffers = [], n && this.on("response", n);
  var t = this;
  this._onNativeResponse = function(a) {
    try {
      t._processResponse(a);
    } catch (o) {
      t.emit("error", o instanceof It ? o : new It({ cause: o }));
    }
  }, this._headerFilter = new RegExp("^(?:" + Rp.concat(e.sensitiveHeaders).map(Fp).join("|") + ")$", "i"), this._performRequest();
}
pe.prototype = Object.create(pa.prototype);
pe.prototype.abort = function() {
  xa(this._currentRequest), this._currentRequest.abort(), this.emit("abort");
};
pe.prototype.destroy = function(e) {
  return xa(this._currentRequest, e), jp.call(this, e), this;
};
pe.prototype.write = function(e, n, t) {
  if (this._ending)
    throw new Op();
  if (!Oe(e) && !Dp(e))
    throw new TypeError("data should be a string, Buffer or Uint8Array");
  if (Le(n) && (t = n, n = null), e.length === 0) {
    t && t();
    return;
  }
  this._requestBodyLength + e.length <= this._options.maxBodyLength ? (this._requestBodyLength += e.length, this._requestBodyBuffers.push({ data: e, encoding: n }), this._currentRequest.write(e, n, t)) : (this.emit("error", new Cp()), this.abort());
};
pe.prototype.end = function(e, n, t) {
  if (Le(e) ? (t = e, e = n = null) : Le(n) && (t = n, n = null), !e)
    this._ended = this._ending = !0, this._currentRequest.end(null, null, t);
  else {
    var a = this, o = this._currentRequest;
    this.write(e, n, function() {
      a._ended = !0, o.end(null, null, t);
    }), this._ending = !0;
  }
};
pe.prototype.setHeader = function(e, n) {
  this._options.headers[e] = n, this._currentRequest.setHeader(e, n);
};
pe.prototype.removeHeader = function(e) {
  delete this._options.headers[e], this._currentRequest.removeHeader(e);
};
pe.prototype.setTimeout = function(e, n) {
  var t = this;
  function a(i) {
    i.setTimeout(e), i.removeListener("timeout", i.destroy), i.addListener("timeout", i.destroy);
  }
  function o(i) {
    t._timeout && clearTimeout(t._timeout), t._timeout = setTimeout(function() {
      t.emit("timeout"), s();
    }, e), a(i);
  }
  function s() {
    t._timeout && (clearTimeout(t._timeout), t._timeout = null), t.removeListener("abort", s), t.removeListener("error", s), t.removeListener("response", s), t.removeListener("close", s), n && t.removeListener("timeout", n), t.socket || t._currentRequest.removeListener("socket", o);
  }
  return n && this.on("timeout", n), this.socket ? o(this.socket) : this._currentRequest.once("socket", o), this.on("socket", a), this.on("abort", s), this.on("error", s), this.on("response", s), this.on("close", s), this;
};
[
  "flushHeaders",
  "getHeader",
  "setNoDelay",
  "setSocketKeepAlive"
].forEach(function(e) {
  pe.prototype[e] = function(n, t) {
    return this._currentRequest[e](n, t);
  };
});
["aborted", "connection", "socket"].forEach(function(e) {
  Object.defineProperty(pe.prototype, e, {
    get: function() {
      return this._currentRequest[e];
    }
  });
});
pe.prototype._sanitizeOptions = function(e) {
  if (e.headers || (e.headers = {}), Np(e.sensitiveHeaders) || (e.sensitiveHeaders = []), e.host && (e.hostname || (e.hostname = e.host), delete e.host), !e.pathname && e.path) {
    var n = e.path.indexOf("?");
    n < 0 ? e.pathname = e.path : (e.pathname = e.path.substring(0, n), e.search = e.path.substring(n));
  }
};
pe.prototype._performRequest = function() {
  var e = this._options.protocol, n = this._options.nativeProtocols[e];
  if (!n)
    throw new TypeError("Unsupported protocol " + e);
  if (this._options.agents) {
    var t = e.slice(0, -1);
    this._options.agent = this._options.agents[t];
  }
  var a = this._currentRequest = n.request(this._options, this._onNativeResponse);
  a._redirectable = this;
  for (var o of da)
    a.on(o, ma[o]);
  if (this._currentUrl = /^\//.test(this._options.path) ? un.format(this._options) : (
    // When making a request to a proxy, […]
    // a client MUST send the target URI in absolute-form […].
    this._options.path
  ), this._isRedirect) {
    var s = 0, i = this, r = this._requestBodyBuffers;
    (function p(l) {
      if (a === i._currentRequest)
        if (l)
          i.emit("error", l);
        else if (s < r.length) {
          var c = r[s++];
          a.finished || a.write(c.data, c.encoding, p);
        } else i._ended && a.end();
    })();
  }
};
pe.prototype._processResponse = function(e) {
  var n = e.statusCode;
  this._options.trackRedirects && this._redirects.push({
    url: this._currentUrl,
    headers: e.headers,
    statusCode: n
  });
  var t = e.headers.location;
  if (!t || this._options.followRedirects === !1 || n < 300 || n >= 400) {
    e.responseUrl = this._currentUrl, e.redirects = this._redirects, this.emit("response", e), this._requestBodyBuffers = [];
    return;
  }
  if (xa(this._currentRequest), e.destroy(), ++this._redirectCount > this._options.maxRedirects)
    throw new Tp();
  var a, o = this._options.beforeRedirect;
  o && (a = Object.assign({
    // The Host header was set by nativeProtocol.request
    Host: e.req.getHeader("host")
  }, this._options.headers));
  var s = this._options.method;
  ((n === 301 || n === 302) && this._options.method === "POST" || // RFC7231§6.4.4: The 303 (See Other) status code indicates that
  // the server is redirecting the user agent to a different resource […]
  // A user agent can perform a retrieval request targeting that URI
  // (a GET or HEAD request if using HTTP) […]
  n === 303 && !/^(?:GET|HEAD)$/.test(this._options.method)) && (this._options.method = "GET", this._requestBodyBuffers = [], wt(/^content-/i, this._options.headers));
  var i = wt(/^host$/i, this._options.headers), r = fa(this._currentUrl), p = i || r.host, l = /^\w+:/.test(t) ? this._currentUrl : un.format(Object.assign(r, { host: p })), c = Pp(t, l);
  if (rs("redirecting to", c.href), this._isRedirect = !0, Ft(c, this._options), (c.protocol !== r.protocol && c.protocol !== "https:" || c.host !== p && !Lp(c.host, p)) && wt(this._headerFilter, this._options.headers), Le(o)) {
    var u = {
      headers: e.headers,
      statusCode: n
    }, d = {
      url: l,
      method: s,
      headers: a
    };
    o(this._options, u, d), this._sanitizeOptions(this._options);
  }
  this._performRequest();
};
function cs(e) {
  var n = {
    maxRedirects: 21,
    maxBodyLength: 10485760
  }, t = {};
  return Object.keys(e).forEach(function(a) {
    var o = a + ":", s = t[o] = e[a], i = n[a] = Object.create(s);
    function r(l, c, u) {
      return Ip(l) ? l = Ft(l) : Oe(l) ? l = Ft(fa(l)) : (u = c, c = ls(l), l = { protocol: o }), Le(c) && (u = c, c = null), c = Object.assign({
        maxRedirects: n.maxRedirects,
        maxBodyLength: n.maxBodyLength
      }, l, c), c.nativeProtocols = t, !Oe(c.host) && !Oe(c.hostname) && (c.hostname = "::1"), la.equal(c.protocol, o, "protocol mismatch"), rs("options", c), new pe(c, u);
    }
    function p(l, c, u) {
      var d = i.request(l, c, u);
      return d.end(), d;
    }
    Object.defineProperties(i, {
      request: { value: r, configurable: !0, enumerable: !0, writable: !0 },
      get: { value: p, configurable: !0, enumerable: !0, writable: !0 }
    });
  }), n;
}
function ps() {
}
function fa(e) {
  var n;
  if (ua)
    n = new nn(e);
  else if (n = ls(un.parse(e)), !Oe(n.protocol))
    throw new Dt({ input: e });
  return n;
}
function Pp(e, n) {
  return ua ? new nn(e, n) : fa(un.resolve(n, e));
}
function ls(e) {
  if (/^\[/.test(e.hostname) && !/^\[[:0-9a-f]+\]$/i.test(e.hostname))
    throw new Dt({ input: e.href || e });
  if (/^\[/.test(e.host) && !/^\[[:0-9a-f]+\](:\d+)?$/i.test(e.host))
    throw new Dt({ input: e.href || e });
  return e;
}
function Ft(e, n) {
  var t = n || {};
  for (var a of Ap)
    t[a] = e[a];
  return t.hostname.startsWith("[") && (t.hostname = t.hostname.slice(1, -1)), t.port !== "" && (t.port = Number(t.port)), t.path = t.search ? t.pathname + t.search : t.pathname, t;
}
function wt(e, n) {
  var t;
  for (var a in n)
    e.test(a) && (t = n[a], delete n[a]);
  return t === null || typeof t > "u" ? void 0 : String(t).trim();
}
function dn(e, n, t) {
  function a(o) {
    Le(Error.captureStackTrace) && Error.captureStackTrace(this, this.constructor), Object.assign(this, o || {}), this.code = e, this.message = this.cause ? n + ": " + this.cause.message : n;
  }
  return a.prototype = new (t || Error)(), Object.defineProperties(a.prototype, {
    constructor: {
      value: a,
      enumerable: !1
    },
    name: {
      value: "Error [" + e + "]",
      enumerable: !1
    }
  }), a;
}
function xa(e, n) {
  for (var t of da)
    e.removeListener(t, ma[t]);
  e.on("error", ps), e.destroy(n);
}
function Lp(e, n) {
  la(Oe(e) && Oe(n));
  var t = e.length - n.length - 1;
  return t > 0 && e[t] === "." && e.endsWith(n);
}
function Np(e) {
  return e instanceof Array;
}
function Oe(e) {
  return typeof e == "string" || e instanceof String;
}
function Le(e) {
  return typeof e == "function";
}
function Dp(e) {
  return typeof e == "object" && "length" in e;
}
function Ip(e) {
  return nn && e instanceof nn;
}
function Fp(e) {
  return e.replace(/[\]\\/()*+?.$]/g, "\\$&");
}
ca.exports = cs({ http: Ep, https: Sp });
ca.exports.wrap = cs;
var Up = ca.exports;
const Bp = /* @__PURE__ */ Do(Up), tn = "1.16.0";
function us(e) {
  const n = /^([-+\w]{1,25}):(?:\/\/)?/.exec(e);
  return n && n[1] || "";
}
const zp = /^(?:([^;]+);)?(?:[^;]+;)?(base64|),([\s\S]*)$/;
function qp(e, n, t) {
  const a = t && t.Blob || H.classes.Blob, o = us(e);
  if (n === void 0 && a && (n = !0), o === "data") {
    e = o.length ? e.slice(o.length + 1) : e;
    const s = zp.exec(e);
    if (!s)
      throw new g("Invalid URL", g.ERR_INVALID_URL);
    const i = s[1], r = s[2], p = s[3], l = Buffer.from(decodeURIComponent(p), r ? "base64" : "utf8");
    if (n) {
      if (!a)
        throw new g("Blob is not supported", g.ERR_NOT_SUPPORT);
      return new a([l], { type: i });
    }
    return l;
  }
  throw new g("Unsupported protocol " + o, g.ERR_NOT_SUPPORT);
}
const kt = Symbol("internals");
class no extends te.Transform {
  constructor(n) {
    n = m.toFlatObject(
      n,
      {
        maxRate: 0,
        chunkSize: 64 * 1024,
        minChunkSize: 100,
        timeWindow: 500,
        ticksRate: 2,
        samplesCount: 15
      },
      null,
      (a, o) => !m.isUndefined(o[a])
    ), super({
      readableHighWaterMark: n.chunkSize
    });
    const t = this[kt] = {
      timeWindow: n.timeWindow,
      chunkSize: n.chunkSize,
      maxRate: n.maxRate,
      minChunkSize: n.minChunkSize,
      bytesSeen: 0,
      isCaptured: !1,
      notifiedBytesLoaded: 0,
      ts: Date.now(),
      bytes: 0,
      onReadCallback: null
    };
    this.on("newListener", (a) => {
      a === "progress" && (t.isCaptured || (t.isCaptured = !0));
    });
  }
  _read(n) {
    const t = this[kt];
    return t.onReadCallback && t.onReadCallback(), super._read(n);
  }
  _transform(n, t, a) {
    const o = this[kt], s = o.maxRate, i = this.readableHighWaterMark, r = o.timeWindow, p = 1e3 / r, l = s / p, c = o.minChunkSize !== !1 ? Math.max(o.minChunkSize, l * 0.01) : 0, u = (f, b) => {
      const x = Buffer.byteLength(f);
      o.bytesSeen += x, o.bytes += x, o.isCaptured && this.emit("progress", o.bytesSeen), this.push(f) ? process.nextTick(b) : o.onReadCallback = () => {
        o.onReadCallback = null, process.nextTick(b);
      };
    }, d = (f, b) => {
      const x = Buffer.byteLength(f);
      let v = null, h = i, w, _ = 0;
      if (s) {
        const k = Date.now();
        (!o.ts || (_ = k - o.ts) >= r) && (o.ts = k, w = l - o.bytes, o.bytes = w < 0 ? -w : 0, _ = 0), w = l - o.bytes;
      }
      if (s) {
        if (w <= 0)
          return setTimeout(() => {
            b(null, f);
          }, r - _);
        w < h && (h = w);
      }
      h && x > h && x - h > c && (v = f.subarray(h), f = f.subarray(0, h)), u(
        f,
        v ? () => {
          process.nextTick(b, null, v);
        } : b
      );
    };
    d(n, function f(b, x) {
      if (b)
        return a(b);
      x ? d(x, f) : a(null);
    });
  }
}
const { asyncIterator: to } = Symbol, ds = async function* (e) {
  e.stream ? yield* e.stream() : e.arrayBuffer ? yield await e.arrayBuffer() : e[to] ? yield* e[to]() : yield e;
}, $p = H.ALPHABET.ALPHA_DIGIT + "-_", an = typeof TextEncoder == "function" ? new TextEncoder() : new De.TextEncoder(), Te = `\r
`, Mp = an.encode(Te), Hp = 2;
class Wp {
  constructor(n, t) {
    const { escapeName: a } = this.constructor, o = m.isString(t);
    let s = `Content-Disposition: form-data; name="${a(n)}"${!o && t.name ? `; filename="${a(t.name)}"` : ""}${Te}`;
    if (o)
      t = an.encode(String(t).replace(/\r?\n|\r\n?/g, Te));
    else {
      const i = String(t.type || "application/octet-stream").replace(/[\r\n]/g, "");
      s += `Content-Type: ${i}${Te}`;
    }
    this.headers = an.encode(s + Te), this.contentLength = o ? t.byteLength : t.size, this.size = this.headers.byteLength + this.contentLength + Hp, this.name = n, this.value = t;
  }
  async *encode() {
    yield this.headers;
    const { value: n } = this;
    m.isTypedArray(n) ? yield n : yield* ds(n), yield Mp;
  }
  static escapeName(n) {
    return String(n).replace(
      /[\r\n"]/g,
      (t) => ({
        "\r": "%0D",
        "\n": "%0A",
        '"': "%22"
      })[t]
    );
  }
}
const Kp = (e, n, t) => {
  const {
    tag: a = "form-data-boundary",
    size: o = 25,
    boundary: s = a + "-" + H.generateString(o, $p)
  } = t || {};
  if (!m.isFormData(e))
    throw TypeError("FormData instance required");
  if (s.length < 1 || s.length > 70)
    throw Error("boundary must be 1-70 characters long");
  const i = an.encode("--" + s + Te), r = an.encode("--" + s + "--" + Te);
  let p = r.byteLength;
  const l = Array.from(e.entries()).map(([u, d]) => {
    const f = new Wp(u, d);
    return p += f.size, f;
  });
  p += i.byteLength * l.length, p = m.toFiniteNumber(p);
  const c = {
    "Content-Type": `multipart/form-data; boundary=${s}`
  };
  return Number.isFinite(p) && (c["Content-Length"] = p), n && n(c), qs.from(
    async function* () {
      for (const u of l)
        yield i, yield* u.encode();
      yield r;
    }()
  );
};
class Gp extends te.Transform {
  __transform(n, t, a) {
    this.push(n), a();
  }
  _transform(n, t, a) {
    if (n.length !== 0 && (this._transform = this.__transform, n[0] !== 120)) {
      const o = Buffer.alloc(2);
      o[0] = 120, o[1] = 156, this.push(o, t);
    }
    this.__transform(n, t, a);
  }
}
const Jp = (e, n) => m.isAsyncFn(e) ? function(...t) {
  const a = t.pop();
  e.apply(this, t).then((o) => {
    try {
      n ? a(null, ...n(o)) : a(null, o);
    } catch (s) {
      a(s);
    }
  }, a);
} : e, Vp = /* @__PURE__ */ new Set(["localhost"]), ms = (e) => {
  const n = e.split(".");
  return n.length !== 4 || n[0] !== "127" ? !1 : n.every((t) => /^\d+$/.test(t) && Number(t) >= 0 && Number(t) <= 255);
}, Xp = (e) => {
  if (e === "::1") return !0;
  const n = e.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
  if (n) return ms(n[1]);
  const t = e.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i);
  if (t) {
    const o = parseInt(t[1], 16);
    return o >= 32512 && o <= 32767;
  }
  const a = e.split(":");
  if (a.length === 8) {
    for (let o = 0; o < 7; o++)
      if (!/^0+$/.test(a[o])) return !1;
    return /^0*1$/.test(a[7]);
  }
  return !1;
}, ao = (e) => e ? Vp.has(e) || ms(e) ? !0 : Xp(e) : !1, Yp = {
  http: 80,
  https: 443,
  ws: 80,
  wss: 443,
  ftp: 21
}, Zp = (e) => {
  let n = e, t = 0;
  if (n.charAt(0) === "[") {
    const s = n.indexOf("]");
    if (s !== -1) {
      const i = n.slice(1, s), r = n.slice(s + 1);
      return r.charAt(0) === ":" && /^\d+$/.test(r.slice(1)) && (t = Number.parseInt(r.slice(1), 10)), [i, t];
    }
  }
  const a = n.indexOf(":"), o = n.lastIndexOf(":");
  return a !== -1 && a === o && /^\d+$/.test(n.slice(o + 1)) && (t = Number.parseInt(n.slice(o + 1), 10), n = n.slice(0, o)), [n, t];
}, Qp = /^(?:::|(?:0{1,4}:){1,4}:|(?:0{1,4}:){5})ffff:(\d+\.\d+\.\d+\.\d+)$/i, el = /^(?:::|(?:0{1,4}:){1,4}:|(?:0{1,4}:){5})ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i, nl = (e) => {
  if (typeof e != "string" || e.indexOf(":") === -1) return e;
  const n = e.match(Qp);
  if (n) return n[1];
  const t = e.match(el);
  if (t) {
    const a = parseInt(t[1], 16), o = parseInt(t[2], 16);
    return `${a >> 8}.${a & 255}.${o >> 8}.${o & 255}`;
  }
  return e;
}, oo = (e) => e && (e.charAt(0) === "[" && e.charAt(e.length - 1) === "]" && (e = e.slice(1, -1)), nl(e.replace(/\.+$/, "")));
function tl(e) {
  let n;
  try {
    n = new URL(e);
  } catch {
    return !1;
  }
  const t = (process.env.no_proxy || process.env.NO_PROXY || "").toLowerCase();
  if (!t)
    return !1;
  if (t === "*")
    return !0;
  const a = Number.parseInt(n.port, 10) || Yp[n.protocol.split(":", 1)[0]] || 0, o = oo(n.hostname.toLowerCase());
  return t.split(/[\s,]+/).some((s) => {
    if (!s)
      return !1;
    let [i, r] = Zp(s);
    return i = oo(i), !i || r && r !== a ? !1 : (i.charAt(0) === "*" && (i = i.slice(1)), i.charAt(0) === "." ? o.endsWith(i) : o === i || ao(o) && ao(i));
  });
}
function al(e, n) {
  e = e || 10;
  const t = new Array(e), a = new Array(e);
  let o = 0, s = 0, i;
  return n = n !== void 0 ? n : 1e3, function(p) {
    const l = Date.now(), c = a[s];
    i || (i = l), t[o] = p, a[o] = l;
    let u = s, d = 0;
    for (; u !== o; )
      d += t[u++], u = u % e;
    if (o = (o + 1) % e, o === s && (s = (s + 1) % e), l - i < n)
      return;
    const f = c && l - c;
    return f ? Math.round(d * 1e3 / f) : void 0;
  };
}
function ol(e, n) {
  let t = 0, a = 1e3 / n, o, s;
  const i = (l, c = Date.now()) => {
    t = c, o = null, s && (clearTimeout(s), s = null), e(...l);
  };
  return [(...l) => {
    const c = Date.now(), u = c - t;
    u >= a ? i(l, c) : (o = l, s || (s = setTimeout(() => {
      s = null, i(o);
    }, a - u)));
  }, () => o && i(o)];
}
const Je = (e, n, t = 3) => {
  let a = 0;
  const o = al(50, 250);
  return ol((s) => {
    const i = s.loaded, r = s.lengthComputable ? s.total : void 0, p = r != null ? Math.min(i, r) : i, l = Math.max(0, p - a), c = o(l);
    a = Math.max(a, p);
    const u = {
      loaded: p,
      total: r,
      progress: r ? p / r : void 0,
      bytes: l,
      rate: c || void 0,
      estimated: c && r ? (r - p) / c : void 0,
      event: s,
      lengthComputable: r != null,
      [n ? "download" : "upload"]: !0
    };
    e(u);
  }, t);
}, Cn = (e, n) => {
  const t = e != null;
  return [
    (a) => n[0]({
      lengthComputable: t,
      total: e,
      loaded: a
    }),
    n[1]
  ];
}, On = (e) => (...n) => m.asap(() => e(...n));
function fs(e) {
  if (!e || typeof e != "string" || !e.startsWith("data:")) return 0;
  const n = e.indexOf(",");
  if (n < 0) return 0;
  const t = e.slice(5, n), a = e.slice(n + 1);
  if (/;base64/i.test(t)) {
    let i = a.length;
    const r = a.length;
    for (let f = 0; f < r; f++)
      if (a.charCodeAt(f) === 37 && f + 2 < r) {
        const b = a.charCodeAt(f + 1), x = a.charCodeAt(f + 2);
        (b >= 48 && b <= 57 || b >= 65 && b <= 70 || b >= 97 && b <= 102) && (x >= 48 && x <= 57 || x >= 65 && x <= 70 || x >= 97 && x <= 102) && (i -= 2, f += 2);
      }
    let p = 0, l = r - 1;
    const c = (f) => f >= 2 && a.charCodeAt(f - 2) === 37 && // '%'
    a.charCodeAt(f - 1) === 51 && // '3'
    (a.charCodeAt(f) === 68 || a.charCodeAt(f) === 100);
    l >= 0 && (a.charCodeAt(l) === 61 ? (p++, l--) : c(l) && (p++, l -= 3)), p === 1 && l >= 0 && (a.charCodeAt(l) === 61 || c(l)) && p++;
    const d = Math.floor(i / 4) * 3 - (p || 0);
    return d > 0 ? d : 0;
  }
  if (typeof Buffer < "u" && typeof Buffer.byteLength == "function")
    return Buffer.byteLength(a, "utf8");
  let s = 0;
  for (let i = 0, r = a.length; i < r; i++) {
    const p = a.charCodeAt(i);
    if (p < 128)
      s += 1;
    else if (p < 2048)
      s += 2;
    else if (p >= 55296 && p <= 56319 && i + 1 < r) {
      const l = a.charCodeAt(i + 1);
      l >= 56320 && l <= 57343 ? (s += 4, i++) : s += 3;
    } else
      s += 3;
  }
  return s;
}
const so = {
  flush: Se.constants.Z_SYNC_FLUSH,
  finishFlush: Se.constants.Z_SYNC_FLUSH
}, sl = {
  flush: Se.constants.BROTLI_OPERATION_FLUSH,
  finishFlush: Se.constants.BROTLI_OPERATION_FLUSH
}, io = m.isFunction(Se.createBrotliDecompress), { http: il, https: rl } = Bp, cl = /https:?/, pl = ["content-type", "content-length"];
function ll(e, n, t) {
  if (t !== "content-only") {
    e.set(n);
    return;
  }
  Object.entries(n).forEach(([a, o]) => {
    pl.includes(a.toLowerCase()) && e.set(a, o);
  });
}
const ro = Symbol("axios.http.socketListener"), bn = Symbol("axios.http.currentReq"), co = H.protocols.map((e) => e + ":"), po = (e) => {
  if (!m.isString(e))
    return e;
  try {
    return decodeURIComponent(e);
  } catch {
    return e;
  }
}, lo = (e, [n, t]) => (e.on("end", t).on("error", t), n);
class ul {
  constructor() {
    this.sessions = /* @__PURE__ */ Object.create(null);
  }
  getSession(n, t) {
    t = Object.assign(
      {
        sessionTimeout: 1e3
      },
      t
    );
    let a = this.sessions[n];
    if (a) {
      let c = a.length;
      for (let u = 0; u < c; u++) {
        const [d, f] = a[u];
        if (!d.destroyed && !d.closed && De.isDeepStrictEqual(f, t))
          return d;
      }
    }
    const o = Eo.connect(n, t);
    let s;
    const i = () => {
      if (s)
        return;
      s = !0;
      let c = a, u = c.length, d = u;
      for (; d--; )
        if (c[d][0] === o) {
          u === 1 ? delete this.sessions[n] : c.splice(d, 1), o.closed || o.close();
          return;
        }
    }, r = o.request, { sessionTimeout: p } = t;
    if (p != null) {
      let c, u = 0;
      o.request = function() {
        const d = r.apply(this, arguments);
        return u++, c && (clearTimeout(c), c = null), d.once("close", () => {
          --u || (c = setTimeout(() => {
            c = null, i();
          }, p));
        }), d;
      };
    }
    o.once("close", i);
    let l = [o, t];
    return a ? a.push(l) : a = this.sessions[n] = [l], o;
  }
}
const dl = new ul();
function ml(e, n, t) {
  e.beforeRedirects.proxy && e.beforeRedirects.proxy(e), e.beforeRedirects.config && e.beforeRedirects.config(e, n, t);
}
function xs(e, n, t, a) {
  let o = n;
  if (!o && o !== !1) {
    const s = xp(t);
    s && (tl(t) || (o = new URL(s)));
  }
  if (a && e.headers)
    for (const s of Object.keys(e.headers))
      s.toLowerCase() === "proxy-authorization" && delete e.headers[s];
  if (o) {
    const s = o instanceof URL, i = (f) => s || m.hasOwnProp(o, f) ? o[f] : void 0, r = i("username"), p = i("password");
    let l = m.hasOwnProp(o, "auth") ? o.auth : void 0;
    if (r && (l = (r || "") + ":" + (p || "")), l) {
      const f = typeof l == "object", b = f && m.hasOwnProp(l, "username") ? l.username : void 0, x = f && m.hasOwnProp(l, "password") ? l.password : void 0;
      if (!!(b || x))
        l = (b || "") + ":" + (x || "");
      else if (f)
        throw new g("Invalid proxy authorization", g.ERR_BAD_OPTION, { proxy: o });
      const h = Buffer.from(l, "utf8").toString("base64");
      e.headers["Proxy-Authorization"] = "Basic " + h;
    }
    let c = !1;
    for (const f of Object.keys(e.headers))
      if (f.toLowerCase() === "host") {
        c = !0;
        break;
      }
    c || (e.headers.host = e.hostname + (e.port ? ":" + e.port : ""));
    const u = i("hostname") || i("host");
    e.hostname = u, e.host = u, e.port = i("port"), e.path = t;
    const d = i("protocol");
    d && (e.protocol = d.includes(":") ? d : `${d}:`);
  }
  e.beforeRedirects.proxy = function(i) {
    xs(i, n, i.href, !0);
  };
}
const fl = typeof process < "u" && m.kindOf(process) === "process", xl = (e) => new Promise((n, t) => {
  let a, o;
  const s = (p, l) => {
    o || (o = !0, a && a(p, l));
  }, i = (p) => {
    s(p), n(p);
  }, r = (p) => {
    s(p, !0), t(p);
  };
  e(i, r, (p) => a = p).catch(r);
}), hl = ({ address: e, family: n }) => {
  if (!m.isString(e))
    throw TypeError("address must be a string");
  return {
    address: e,
    family: n || (e.indexOf(".") < 0 ? 6 : 4)
  };
}, uo = (e, n) => hl(m.isObject(e) ? e : { address: e, family: n }), vl = {
  request(e, n) {
    const t = e.protocol + "//" + e.hostname + ":" + (e.port || (e.protocol === "https:" ? 443 : 80)), { http2Options: a, headers: o } = e, s = dl.getSession(t, a), { HTTP2_HEADER_SCHEME: i, HTTP2_HEADER_METHOD: r, HTTP2_HEADER_PATH: p, HTTP2_HEADER_STATUS: l } = Eo.constants, c = {
      [i]: e.protocol.replace(":", ""),
      [r]: e.method,
      [p]: e.path
    };
    m.forEach(o, (d, f) => {
      f.charAt(0) !== ":" && (c[f] = d);
    });
    const u = s.request(c);
    return u.once("response", (d) => {
      const f = u;
      d = Object.assign({}, d);
      const b = d[l];
      delete d[l], f.headers = d, f.statusCode = +b, n(f);
    }), u;
  }
}, bl = fl && function(n) {
  return xl(async function(a, o, s) {
    const i = (E) => m.hasOwnProp(n, E) ? n[E] : void 0;
    let r = i("data"), p = i("lookup"), l = i("family"), c = i("httpVersion");
    c === void 0 && (c = 1);
    let u = i("http2Options");
    const d = i("responseType"), f = i("responseEncoding"), b = n.method.toUpperCase();
    let x, v = !1, h, w;
    if (c = +c, Number.isNaN(c))
      throw TypeError(`Invalid protocol version: '${n.httpVersion}' is not a number`);
    if (c !== 1 && c !== 2)
      throw TypeError(`Unsupported protocol version '${c}'`);
    const _ = c === 2;
    if (p) {
      const E = Jp(p, (y) => m.isArray(y) ? y : [y]);
      p = (y, P, z) => {
        E(y, P, (L, J, ne) => {
          if (L)
            return z(L);
          const I = m.isArray(J) ? J.map((we) => uo(we)) : [uo(J, ne)];
          P.all ? z(L, I) : z(L, I[0].address, I[0].family);
        });
      };
    }
    const k = new Ws();
    function S(E) {
      try {
        k.emit(
          "abort",
          !E || E.type ? new Pe(null, n, h) : E
        );
      } catch (y) {
        console.warn("emit error", y);
      }
    }
    function R() {
      w && (clearTimeout(w), w = null);
    }
    function j() {
      let E = n.timeout ? "timeout of " + n.timeout + "ms exceeded" : "timeout exceeded";
      const y = n.transitional || qn;
      return n.timeoutErrorMessage && (E = n.timeoutErrorMessage), new g(
        E,
        y.clarifyTimeoutError ? g.ETIMEDOUT : g.ECONNABORTED,
        n,
        h
      );
    }
    k.once("abort", o);
    const D = () => {
      R(), n.cancelToken && n.cancelToken.unsubscribe(S), n.signal && n.signal.removeEventListener("abort", S), k.removeAllListeners();
    };
    (n.cancelToken || n.signal) && (n.cancelToken && n.cancelToken.subscribe(S), n.signal && (n.signal.aborted ? S() : n.signal.addEventListener("abort", S))), s((E, y) => {
      if (x = !0, R(), y) {
        v = !0, D();
        return;
      }
      const { data: P } = E;
      if (P instanceof te.Readable || P instanceof te.Duplex) {
        const z = te.finished(P, () => {
          z(), D();
        });
      } else
        D();
    });
    const q = ra(n.baseURL, n.url, n.allowAbsoluteUrls), A = new URL(q, H.hasBrowserEnv ? H.origin : void 0), ae = A.protocol || co[0];
    if (ae === "data:") {
      if (n.maxContentLength > -1) {
        const y = String(n.url || q || "");
        if (fs(y) > n.maxContentLength)
          return o(
            new g(
              "maxContentLength size of " + n.maxContentLength + " exceeded",
              g.ERR_BAD_RESPONSE,
              n
            )
          );
      }
      let E;
      if (b !== "GET")
        return qe(a, o, {
          status: 405,
          statusText: "method not allowed",
          headers: {},
          config: n
        });
      try {
        E = qp(n.url, d === "blob", {
          Blob: n.env && n.env.Blob
        });
      } catch (y) {
        throw g.from(y, g.ERR_BAD_REQUEST, n);
      }
      return d === "text" ? (E = E.toString(f), (!f || f === "utf8") && (E = m.stripBOM(E))) : d === "stream" && (E = te.Readable.from(E)), qe(a, o, {
        data: E,
        status: 200,
        statusText: "OK",
        headers: new Q(),
        config: n
      });
    }
    if (co.indexOf(ae) === -1)
      return o(
        new g("Unsupported protocol " + ae, g.ERR_BAD_REQUEST, n)
      );
    const K = Q.from(n.headers).normalize();
    K.set("User-Agent", "axios/" + tn, !1);
    const { onUploadProgress: _e, onDownloadProgress: ee } = n, xe = n.maxRate;
    let oe, de;
    if (m.isSpecCompliantForm(r)) {
      const E = K.getContentType(/boundary=([-_\w\d]{10,70})/i);
      r = Kp(
        r,
        (y) => {
          K.set(y);
        },
        {
          tag: `axios-${tn}-boundary`,
          boundary: E && E[1] || void 0
        }
      );
    } else if (m.isFormData(r) && m.isFunction(r.getHeaders) && r.getHeaders !== Object.prototype.getHeaders) {
      if (ll(K, r.getHeaders(), i("formDataHeaderPolicy")), !K.hasContentLength())
        try {
          const E = await De.promisify(r.getLength).call(r);
          Number.isFinite(E) && E >= 0 && K.setContentLength(E);
        } catch {
        }
    } else if (m.isBlob(r) || m.isFile(r))
      r.size && K.setContentType(r.type || "application/octet-stream"), K.setContentLength(r.size || 0), r = te.Readable.from(ds(r));
    else if (r && !m.isStream(r)) {
      if (!Buffer.isBuffer(r)) if (m.isArrayBuffer(r))
        r = Buffer.from(new Uint8Array(r));
      else if (m.isString(r))
        r = Buffer.from(r, "utf-8");
      else
        return o(
          new g(
            "Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream",
            g.ERR_BAD_REQUEST,
            n
          )
        );
      if (K.setContentLength(r.length, !1), n.maxBodyLength > -1 && r.length > n.maxBodyLength)
        return o(
          new g(
            "Request body larger than maxBodyLength limit",
            g.ERR_BAD_REQUEST,
            n
          )
        );
    }
    const ye = m.toFiniteNumber(K.getContentLength());
    m.isArray(xe) ? (oe = xe[0], de = xe[1]) : oe = de = xe, r && (_e || oe) && (m.isStream(r) || (r = te.Readable.from(r, { objectMode: !1 })), r = te.pipeline(
      [
        r,
        new no({
          maxRate: m.toFiniteNumber(oe)
        })
      ],
      m.noop
    ), _e && r.on(
      "progress",
      lo(
        r,
        Cn(
          ye,
          Je(On(_e), !1, 3)
        )
      )
    ));
    let V;
    const $ = i("auth");
    if ($) {
      const E = $.username || "", y = $.password || "";
      V = E + ":" + y;
    }
    if (!V && A.username) {
      const E = po(A.username), y = po(A.password);
      V = E + ":" + y;
    }
    V && K.delete("authorization");
    let re;
    try {
      re = sa(
        A.pathname + A.search,
        n.params,
        n.paramsSerializer
      ).replace(/^\?/, "");
    } catch (E) {
      const y = new Error(E.message);
      return y.config = n, y.url = n.url, y.exists = !0, o(y);
    }
    K.set(
      "Accept-Encoding",
      "gzip, compress, deflate" + (io ? ", br" : ""),
      !1
    );
    const G = Object.assign(/* @__PURE__ */ Object.create(null), {
      path: re,
      method: b,
      headers: K.toJSON(),
      agents: { http: n.httpAgent, https: n.httpsAgent },
      auth: V,
      protocol: ae,
      family: l,
      beforeRedirect: ml,
      beforeRedirects: /* @__PURE__ */ Object.create(null),
      http2Options: u
    });
    if (!m.isUndefined(p) && (G.lookup = p), n.socketPath) {
      if (typeof n.socketPath != "string")
        return o(
          new g("socketPath must be a string", g.ERR_BAD_OPTION_VALUE, n)
        );
      if (n.allowedSocketPaths != null) {
        const E = Array.isArray(n.allowedSocketPaths) ? n.allowedSocketPaths : [n.allowedSocketPaths], y = ya(n.socketPath);
        if (!E.some(
          (z) => typeof z == "string" && ya(z) === y
        ))
          return o(
            new g(
              `socketPath "${n.socketPath}" is not permitted by allowedSocketPaths`,
              g.ERR_BAD_OPTION_VALUE,
              n
            )
          );
      }
      G.socketPath = n.socketPath;
    } else
      G.hostname = A.hostname.startsWith("[") ? A.hostname.slice(1, -1) : A.hostname, G.port = A.port, xs(
        G,
        n.proxy,
        ae + "//" + A.hostname + (A.port ? ":" + A.port : "") + G.path
      );
    let U, se = !1;
    const Y = cl.test(G.protocol);
    if (G.agent = Y ? n.httpsAgent : n.httpAgent, _)
      U = vl;
    else {
      const E = i("transport");
      if (E)
        U = E;
      else if (n.maxRedirects === 0)
        U = Y ? Yt : Xt, se = !0;
      else {
        n.maxRedirects && (G.maxRedirects = n.maxRedirects);
        const y = i("beforeRedirect");
        y && (G.beforeRedirects.config = y), U = Y ? rl : il;
      }
    }
    n.maxBodyLength > -1 ? G.maxBodyLength = n.maxBodyLength : G.maxBodyLength = 1 / 0, G.insecureHTTPParser = !!i("insecureHTTPParser"), h = U.request(G, function(y) {
      if (R(), h.destroyed) return;
      const P = [y], z = m.toFiniteNumber(y.headers["content-length"]);
      if (ee || de) {
        const I = new no({
          maxRate: m.toFiniteNumber(de)
        });
        ee && I.on(
          "progress",
          lo(
            I,
            Cn(
              z,
              Je(On(ee), !0, 3)
            )
          )
        ), P.push(I);
      }
      let L = y;
      const J = y.req || h;
      if (n.decompress !== !1 && y.headers["content-encoding"])
        switch ((b === "HEAD" || y.statusCode === 204) && delete y.headers["content-encoding"], (y.headers["content-encoding"] || "").toLowerCase()) {
          case "gzip":
          case "x-gzip":
          case "compress":
          case "x-compress":
            P.push(Se.createUnzip(so)), delete y.headers["content-encoding"];
            break;
          case "deflate":
            P.push(new Gp()), P.push(Se.createUnzip(so)), delete y.headers["content-encoding"];
            break;
          case "br":
            io && (P.push(Se.createBrotliDecompress(sl)), delete y.headers["content-encoding"]);
        }
      L = P.length > 1 ? te.pipeline(P, m.noop) : P[0];
      const ne = {
        status: y.statusCode,
        statusText: y.statusMessage,
        headers: new Q(y.headers),
        config: n,
        request: J
      };
      if (d === "stream") {
        if (n.maxContentLength > -1) {
          const I = n.maxContentLength, we = L;
          async function* Ee() {
            let M = 0;
            for await (const Ie of we) {
              if (M += Ie.length, M > I)
                throw new g(
                  "maxContentLength size of " + I + " exceeded",
                  g.ERR_BAD_RESPONSE,
                  n,
                  J
                );
              yield Ie;
            }
          }
          L = te.Readable.from(Ee(), {
            objectMode: !1
          });
        }
        ne.data = L, qe(a, o, ne);
      } else {
        const I = [];
        let we = 0;
        L.on("data", function(M) {
          I.push(M), we += M.length, n.maxContentLength > -1 && we > n.maxContentLength && (v = !0, L.destroy(), S(
            new g(
              "maxContentLength size of " + n.maxContentLength + " exceeded",
              g.ERR_BAD_RESPONSE,
              n,
              J
            )
          ));
        }), L.on("aborted", function() {
          if (v)
            return;
          const M = new g(
            "stream has been aborted",
            g.ERR_BAD_RESPONSE,
            n,
            J,
            ne
          );
          L.destroy(M), o(M);
        }), L.on("error", function(M) {
          v || o(g.from(M, null, n, J, ne));
        }), L.on("end", function() {
          try {
            let M = I.length === 1 ? I[0] : Buffer.concat(I);
            d !== "arraybuffer" && (M = M.toString(f), (!f || f === "utf8") && (M = m.stripBOM(M))), ne.data = M;
          } catch (M) {
            return o(g.from(M, null, n, ne.request, ne));
          }
          qe(a, o, ne);
        });
      }
      k.once("abort", (I) => {
        L.destroyed || (L.emit("error", I), L.destroy());
      });
    }), k.once("abort", (E) => {
      h.close ? h.close() : h.destroy(E);
    }), h.on("error", function(y) {
      o(g.from(y, null, n, h));
    });
    const he = /* @__PURE__ */ new Set();
    if (h.on("socket", function(y) {
      y.setKeepAlive(!0, 1e3 * 60), y[ro] || (y.on("error", function(z) {
        const L = y[bn];
        L && !L.destroyed && L.destroy(z);
      }), y[ro] = !0), y[bn] = h, he.add(y);
    }), h.once("close", function() {
      R();
      for (const y of he)
        y[bn] === h && (y[bn] = null);
      he.clear();
    }), n.timeout) {
      const E = parseInt(n.timeout, 10);
      if (Number.isNaN(E)) {
        S(
          new g(
            "error trying to parse `config.timeout` to int",
            g.ERR_BAD_OPTION_VALUE,
            n,
            h
          )
        );
        return;
      }
      const y = function() {
        x || S(j());
      };
      se && E > 0 && (w = setTimeout(y, E)), h.setTimeout(E, y);
    } else
      h.setTimeout(0);
    if (m.isStream(r)) {
      let E = !1, y = !1;
      r.on("end", () => {
        E = !0;
      }), r.once("error", (z) => {
        y = !0, h.destroy(z);
      }), r.on("close", () => {
        !E && !y && S(new Pe("Request stream has been aborted", n, h));
      });
      let P = r;
      if (n.maxBodyLength > -1 && n.maxRedirects === 0) {
        const z = n.maxBodyLength;
        let L = 0;
        P = te.pipeline(
          [
            r,
            new te.Transform({
              transform(J, ne, I) {
                if (L += J.length, L > z)
                  return I(
                    new g(
                      "Request body larger than maxBodyLength limit",
                      g.ERR_BAD_REQUEST,
                      n,
                      h
                    )
                  );
                I(null, J);
              }
            })
          ],
          m.noop
        ), P.on("error", (J) => {
          h.destroyed || h.destroy(J);
        });
      }
      P.pipe(h);
    } else
      r && h.write(r), h.end();
  });
}, gl = H.hasStandardBrowserEnv ? /* @__PURE__ */ ((e, n) => (t) => (t = new URL(t, H.origin), e.protocol === t.protocol && e.host === t.host && (n || e.port === t.port)))(
  new URL(H.origin),
  H.navigator && /(msie|trident)/i.test(H.navigator.userAgent)
) : () => !0, yl = H.hasStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  {
    write(e, n, t, a, o, s, i) {
      if (typeof document > "u") return;
      const r = [`${e}=${encodeURIComponent(n)}`];
      m.isNumber(t) && r.push(`expires=${new Date(t).toUTCString()}`), m.isString(a) && r.push(`path=${a}`), m.isString(o) && r.push(`domain=${o}`), s === !0 && r.push("secure"), m.isString(i) && r.push(`SameSite=${i}`), document.cookie = r.join("; ");
    },
    read(e) {
      if (typeof document > "u") return null;
      const n = document.cookie.split(";");
      for (let t = 0; t < n.length; t++) {
        const a = n[t].replace(/^\s+/, ""), o = a.indexOf("=");
        if (o !== -1 && a.slice(0, o) === e)
          return decodeURIComponent(a.slice(o + 1));
      }
      return null;
    },
    remove(e) {
      this.write(e, "", Date.now() - 864e5, "/");
    }
  }
) : (
  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {
    },
    read() {
      return null;
    },
    remove() {
    }
  }
), mo = (e) => e instanceof Q ? { ...e } : e;
function Ne(e, n) {
  n = n || {};
  const t = /* @__PURE__ */ Object.create(null);
  Object.defineProperty(t, "hasOwnProperty", {
    // Null-proto descriptor so a polluted Object.prototype.get cannot turn
    // this data descriptor into an accessor descriptor on the way in.
    __proto__: null,
    value: Object.prototype.hasOwnProperty,
    enumerable: !1,
    writable: !0,
    configurable: !0
  });
  function a(l, c, u, d) {
    return m.isPlainObject(l) && m.isPlainObject(c) ? m.merge.call({ caseless: d }, l, c) : m.isPlainObject(c) ? m.merge({}, c) : m.isArray(c) ? c.slice() : c;
  }
  function o(l, c, u, d) {
    if (m.isUndefined(c)) {
      if (!m.isUndefined(l))
        return a(void 0, l, u, d);
    } else return a(l, c, u, d);
  }
  function s(l, c) {
    if (!m.isUndefined(c))
      return a(void 0, c);
  }
  function i(l, c) {
    if (m.isUndefined(c)) {
      if (!m.isUndefined(l))
        return a(void 0, l);
    } else return a(void 0, c);
  }
  function r(l, c, u) {
    if (m.hasOwnProp(n, u))
      return a(l, c);
    if (m.hasOwnProp(e, u))
      return a(void 0, l);
  }
  const p = {
    url: s,
    method: s,
    data: s,
    baseURL: i,
    transformRequest: i,
    transformResponse: i,
    paramsSerializer: i,
    timeout: i,
    timeoutMessage: i,
    withCredentials: i,
    withXSRFToken: i,
    adapter: i,
    responseType: i,
    xsrfCookieName: i,
    xsrfHeaderName: i,
    onUploadProgress: i,
    onDownloadProgress: i,
    decompress: i,
    maxContentLength: i,
    maxBodyLength: i,
    beforeRedirect: i,
    transport: i,
    httpAgent: i,
    httpsAgent: i,
    cancelToken: i,
    socketPath: i,
    allowedSocketPaths: i,
    responseEncoding: i,
    validateStatus: r,
    headers: (l, c, u) => o(mo(l), mo(c), u, !0)
  };
  return m.forEach(Object.keys({ ...e, ...n }), function(c) {
    if (c === "__proto__" || c === "constructor" || c === "prototype") return;
    const u = m.hasOwnProp(p, c) ? p[c] : o, d = m.hasOwnProp(e, c) ? e[c] : void 0, f = m.hasOwnProp(n, c) ? n[c] : void 0, b = u(d, f, c);
    m.isUndefined(b) && u !== r || (t[c] = b);
  }), t;
}
const wl = ["content-type", "content-length"];
function kl(e, n, t) {
  if (t !== "content-only") {
    e.set(n);
    return;
  }
  Object.entries(n).forEach(([a, o]) => {
    wl.includes(a.toLowerCase()) && e.set(a, o);
  });
}
const _l = (e) => encodeURIComponent(e).replace(
  /%([0-9A-F]{2})/gi,
  (n, t) => String.fromCharCode(parseInt(t, 16))
), hs = (e) => {
  const n = Ne({}, e), t = (d) => m.hasOwnProp(n, d) ? n[d] : void 0, a = t("data");
  let o = t("withXSRFToken");
  const s = t("xsrfHeaderName"), i = t("xsrfCookieName");
  let r = t("headers");
  const p = t("auth"), l = t("baseURL"), c = t("allowAbsoluteUrls"), u = t("url");
  if (n.headers = r = Q.from(r), n.url = sa(
    ra(l, u, c),
    e.params,
    e.paramsSerializer
  ), p && r.set(
    "Authorization",
    "Basic " + btoa((p.username || "") + ":" + (p.password ? _l(p.password) : ""))
  ), m.isFormData(a) && (H.hasStandardBrowserEnv || H.hasStandardBrowserWebWorkerEnv ? r.setContentType(void 0) : m.isFunction(a.getHeaders) && kl(r, a.getHeaders(), t("formDataHeaderPolicy"))), H.hasStandardBrowserEnv && (m.isFunction(o) && (o = o(n)), o === !0 || o == null && gl(n.url))) {
    const f = s && i && yl.read(i);
    f && r.set(s, f);
  }
  return n;
}, El = typeof XMLHttpRequest < "u", Sl = El && function(e) {
  return new Promise(function(t, a) {
    const o = hs(e);
    let s = o.data;
    const i = Q.from(o.headers).normalize();
    let { responseType: r, onUploadProgress: p, onDownloadProgress: l } = o, c, u, d, f, b;
    function x() {
      f && f(), b && b(), o.cancelToken && o.cancelToken.unsubscribe(c), o.signal && o.signal.removeEventListener("abort", c);
    }
    let v = new XMLHttpRequest();
    v.open(o.method.toUpperCase(), o.url, !0), v.timeout = o.timeout;
    function h() {
      if (!v)
        return;
      const _ = Q.from(
        "getAllResponseHeaders" in v && v.getAllResponseHeaders()
      ), S = {
        data: !r || r === "text" || r === "json" ? v.responseText : v.response,
        status: v.status,
        statusText: v.statusText,
        headers: _,
        config: e,
        request: v
      };
      qe(
        function(j) {
          t(j), x();
        },
        function(j) {
          a(j), x();
        },
        S
      ), v = null;
    }
    "onloadend" in v ? v.onloadend = h : v.onreadystatechange = function() {
      !v || v.readyState !== 4 || v.status === 0 && !(v.responseURL && v.responseURL.startsWith("file:")) || setTimeout(h);
    }, v.onabort = function() {
      v && (a(new g("Request aborted", g.ECONNABORTED, e, v)), x(), v = null);
    }, v.onerror = function(k) {
      const S = k && k.message ? k.message : "Network Error", R = new g(S, g.ERR_NETWORK, e, v);
      R.event = k || null, a(R), x(), v = null;
    }, v.ontimeout = function() {
      let k = o.timeout ? "timeout of " + o.timeout + "ms exceeded" : "timeout exceeded";
      const S = o.transitional || qn;
      o.timeoutErrorMessage && (k = o.timeoutErrorMessage), a(
        new g(
          k,
          S.clarifyTimeoutError ? g.ETIMEDOUT : g.ECONNABORTED,
          e,
          v
        )
      ), x(), v = null;
    }, s === void 0 && i.setContentType(null), "setRequestHeader" in v && m.forEach(i.toJSON(), function(k, S) {
      v.setRequestHeader(S, k);
    }), m.isUndefined(o.withCredentials) || (v.withCredentials = !!o.withCredentials), r && r !== "json" && (v.responseType = o.responseType), l && ([d, b] = Je(l, !0), v.addEventListener("progress", d)), p && v.upload && ([u, f] = Je(p), v.upload.addEventListener("progress", u), v.upload.addEventListener("loadend", f)), (o.cancelToken || o.signal) && (c = (_) => {
      v && (a(!_ || _.type ? new Pe(null, e, v) : _), v.abort(), x(), v = null);
    }, o.cancelToken && o.cancelToken.subscribe(c), o.signal && (o.signal.aborted ? c() : o.signal.addEventListener("abort", c)));
    const w = us(o.url);
    if (w && !H.protocols.includes(w)) {
      a(
        new g(
          "Unsupported protocol " + w + ":",
          g.ERR_BAD_REQUEST,
          e
        )
      );
      return;
    }
    v.send(s || null);
  });
}, Rl = (e, n) => {
  const { length: t } = e = e ? e.filter(Boolean) : [];
  if (n || t) {
    let a = new AbortController(), o;
    const s = function(l) {
      if (!o) {
        o = !0, r();
        const c = l instanceof Error ? l : this.reason;
        a.abort(
          c instanceof g ? c : new Pe(c instanceof Error ? c.message : c)
        );
      }
    };
    let i = n && setTimeout(() => {
      i = null, s(new g(`timeout of ${n}ms exceeded`, g.ETIMEDOUT));
    }, n);
    const r = () => {
      e && (i && clearTimeout(i), i = null, e.forEach((l) => {
        l.unsubscribe ? l.unsubscribe(s) : l.removeEventListener("abort", s);
      }), e = null);
    };
    e.forEach((l) => l.addEventListener("abort", s));
    const { signal: p } = a;
    return p.unsubscribe = () => m.asap(r), p;
  }
}, Al = function* (e, n) {
  let t = e.byteLength;
  if (t < n) {
    yield e;
    return;
  }
  let a = 0, o;
  for (; a < t; )
    o = a + n, yield e.slice(a, o), a = o;
}, Tl = async function* (e, n) {
  for await (const t of Cl(e))
    yield* Al(t, n);
}, Cl = async function* (e) {
  if (e[Symbol.asyncIterator]) {
    yield* e;
    return;
  }
  const n = e.getReader();
  try {
    for (; ; ) {
      const { done: t, value: a } = await n.read();
      if (t)
        break;
      yield a;
    }
  } finally {
    await n.cancel();
  }
}, fo = (e, n, t, a) => {
  const o = Tl(e, n);
  let s = 0, i, r = (p) => {
    i || (i = !0, a && a(p));
  };
  return new ReadableStream(
    {
      async pull(p) {
        try {
          const { done: l, value: c } = await o.next();
          if (l) {
            r(), p.close();
            return;
          }
          let u = c.byteLength;
          if (t) {
            let d = s += u;
            t(d);
          }
          p.enqueue(new Uint8Array(c));
        } catch (l) {
          throw r(l), l;
        }
      },
      cancel(p) {
        return r(p), o.return();
      }
    },
    {
      highWaterMark: 2
    }
  );
}, xo = 64 * 1024, { isFunction: gn } = m, ho = (e, ...n) => {
  try {
    return !!e(...n);
  } catch {
    return !1;
  }
}, Ol = (e) => {
  const n = m.global ?? globalThis, { ReadableStream: t, TextEncoder: a } = n;
  e = m.merge.call(
    {
      skipUndefined: !0
    },
    {
      Request: n.Request,
      Response: n.Response
    },
    e
  );
  const { fetch: o, Request: s, Response: i } = e, r = o ? gn(o) : typeof fetch == "function", p = gn(s), l = gn(i);
  if (!r)
    return !1;
  const c = r && gn(t), u = r && (typeof a == "function" ? /* @__PURE__ */ ((h) => (w) => h.encode(w))(new a()) : async (h) => new Uint8Array(await new s(h).arrayBuffer())), d = p && c && ho(() => {
    let h = !1;
    const w = new s(H.origin, {
      body: new t(),
      method: "POST",
      get duplex() {
        return h = !0, "half";
      }
    }), _ = w.headers.has("Content-Type");
    return w.body != null && w.body.cancel(), h && !_;
  }), f = l && c && ho(() => m.isReadableStream(new i("").body)), b = {
    stream: f && ((h) => h.body)
  };
  r && ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((h) => {
    !b[h] && (b[h] = (w, _) => {
      let k = w && w[h];
      if (k)
        return k.call(w);
      throw new g(
        `Response type '${h}' is not supported`,
        g.ERR_NOT_SUPPORT,
        _
      );
    });
  });
  const x = async (h) => {
    if (h == null)
      return 0;
    if (m.isBlob(h))
      return h.size;
    if (m.isSpecCompliantForm(h))
      return (await new s(H.origin, {
        method: "POST",
        body: h
      }).arrayBuffer()).byteLength;
    if (m.isArrayBufferView(h) || m.isArrayBuffer(h))
      return h.byteLength;
    if (m.isURLSearchParams(h) && (h = h + ""), m.isString(h))
      return (await u(h)).byteLength;
  }, v = async (h, w) => {
    const _ = m.toFiniteNumber(h.getContentLength());
    return _ ?? x(w);
  };
  return async (h) => {
    let {
      url: w,
      method: _,
      data: k,
      signal: S,
      cancelToken: R,
      timeout: j,
      onDownloadProgress: D,
      onUploadProgress: q,
      responseType: A,
      headers: ae,
      withCredentials: K = "same-origin",
      fetchOptions: _e,
      maxContentLength: ee,
      maxBodyLength: xe
    } = hs(h);
    const oe = m.isNumber(ee) && ee > -1, de = m.isNumber(xe) && xe > -1;
    let ye = o || fetch;
    A = A ? (A + "").toLowerCase() : "text";
    let V = Rl(
      [S, R && R.toAbortSignal()],
      j
    ), $ = null;
    const re = V && V.unsubscribe && (() => {
      V.unsubscribe();
    });
    let G;
    try {
      if (oe && typeof w == "string" && w.startsWith("data:") && fs(w) > ee)
        throw new g(
          "maxContentLength size of " + ee + " exceeded",
          g.ERR_BAD_RESPONSE,
          h,
          $
        );
      if (de && _ !== "get" && _ !== "head") {
        const y = await v(ae, k);
        if (typeof y == "number" && isFinite(y) && y > xe)
          throw new g(
            "Request body larger than maxBodyLength limit",
            g.ERR_BAD_REQUEST,
            h,
            $
          );
      }
      if (q && d && _ !== "get" && _ !== "head" && (G = await v(ae, k)) !== 0) {
        let y = new s(w, {
          method: "POST",
          body: k,
          duplex: "half"
        }), P;
        if (m.isFormData(k) && (P = y.headers.get("content-type")) && ae.setContentType(P), y.body) {
          const [z, L] = Cn(
            G,
            Je(On(q))
          );
          k = fo(y.body, xo, z, L);
        }
      }
      m.isString(K) || (K = K ? "include" : "omit");
      const U = p && "credentials" in s.prototype;
      if (m.isFormData(k)) {
        const y = ae.getContentType();
        y && /^multipart\/form-data/i.test(y) && !/boundary=/i.test(y) && ae.delete("content-type");
      }
      ae.set("User-Agent", "axios/" + tn, !1);
      const se = {
        ..._e,
        signal: V,
        method: _.toUpperCase(),
        headers: ae.normalize().toJSON(),
        body: k,
        duplex: "half",
        credentials: U ? K : void 0
      };
      $ = p && new s(w, se);
      let Y = await (p ? ye($, _e) : ye(w, se));
      if (oe) {
        const y = m.toFiniteNumber(Y.headers.get("content-length"));
        if (y != null && y > ee)
          throw new g(
            "maxContentLength size of " + ee + " exceeded",
            g.ERR_BAD_RESPONSE,
            h,
            $
          );
      }
      const he = f && (A === "stream" || A === "response");
      if (f && Y.body && (D || oe || he && re)) {
        const y = {};
        ["status", "statusText", "headers"].forEach((I) => {
          y[I] = Y[I];
        });
        const P = m.toFiniteNumber(Y.headers.get("content-length")), [z, L] = D && Cn(
          P,
          Je(On(D), !0)
        ) || [];
        let J = 0;
        const ne = (I) => {
          if (oe && (J = I, J > ee))
            throw new g(
              "maxContentLength size of " + ee + " exceeded",
              g.ERR_BAD_RESPONSE,
              h,
              $
            );
          z && z(I);
        };
        Y = new i(
          fo(Y.body, xo, ne, () => {
            L && L(), re && re();
          }),
          y
        );
      }
      A = A || "text";
      let E = await b[m.findKey(b, A) || "text"](
        Y,
        h
      );
      if (oe && !f && !he) {
        let y;
        if (E != null && (typeof E.byteLength == "number" ? y = E.byteLength : typeof E.size == "number" ? y = E.size : typeof E == "string" && (y = typeof a == "function" ? new a().encode(E).byteLength : E.length)), typeof y == "number" && y > ee)
          throw new g(
            "maxContentLength size of " + ee + " exceeded",
            g.ERR_BAD_RESPONSE,
            h,
            $
          );
      }
      return !he && re && re(), await new Promise((y, P) => {
        qe(y, P, {
          data: E,
          headers: Q.from(Y.headers),
          status: Y.status,
          statusText: Y.statusText,
          config: h,
          request: $
        });
      });
    } catch (U) {
      if (re && re(), V && V.aborted && V.reason instanceof g) {
        const se = V.reason;
        throw se.config = h, $ && (se.request = $), U !== se && (se.cause = U), se;
      }
      throw U && U.name === "TypeError" && /Load failed|fetch/i.test(U.message) ? Object.assign(
        new g(
          "Network Error",
          g.ERR_NETWORK,
          h,
          $,
          U && U.response
        ),
        {
          cause: U.cause || U
        }
      ) : g.from(U, U && U.code, h, $, U && U.response);
    }
  };
}, jl = /* @__PURE__ */ new Map(), vs = (e) => {
  let n = e && e.env || {};
  const { fetch: t, Request: a, Response: o } = n, s = [a, o, t];
  let i = s.length, r = i, p, l, c = jl;
  for (; r--; )
    p = s[r], l = c.get(p), l === void 0 && c.set(p, l = r ? /* @__PURE__ */ new Map() : Ol(n)), c = l;
  return l;
};
vs();
const ha = {
  http: bl,
  xhr: Sl,
  fetch: {
    get: vs
  }
};
m.forEach(ha, (e, n) => {
  if (e) {
    try {
      Object.defineProperty(e, "name", { __proto__: null, value: n });
    } catch {
    }
    Object.defineProperty(e, "adapterName", { __proto__: null, value: n });
  }
});
const vo = (e) => `- ${e}`, Pl = (e) => m.isFunction(e) || e === null || e === !1;
function Ll(e, n) {
  e = m.isArray(e) ? e : [e];
  const { length: t } = e;
  let a, o;
  const s = {};
  for (let i = 0; i < t; i++) {
    a = e[i];
    let r;
    if (o = a, !Pl(a) && (o = ha[(r = String(a)).toLowerCase()], o === void 0))
      throw new g(`Unknown adapter '${r}'`);
    if (o && (m.isFunction(o) || (o = o.get(n))))
      break;
    s[r || "#" + i] = o;
  }
  if (!o) {
    const i = Object.entries(s).map(
      ([p, l]) => `adapter ${p} ` + (l === !1 ? "is not supported by the environment" : "is not available in the build")
    );
    let r = t ? i.length > 1 ? `since :
` + i.map(vo).join(`
`) : " " + vo(i[0]) : "as no adapter specified";
    throw new g(
      "There is no suitable adapter to dispatch the request " + r,
      "ERR_NOT_SUPPORT"
    );
  }
  return o;
}
const bs = {
  /**
   * Resolve an adapter from a list of adapter names or functions.
   * @type {Function}
   */
  getAdapter: Ll,
  /**
   * Exposes all known adapters
   * @type {Object<string, Function|Object>}
   */
  adapters: ha
};
function _t(e) {
  if (e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted)
    throw new Pe(null, e);
}
function bo(e) {
  return _t(e), e.headers = Q.from(e.headers), e.data = ht.call(e, e.transformRequest), ["post", "put", "patch"].indexOf(e.method) !== -1 && e.headers.setContentType("application/x-www-form-urlencoded", !1), bs.getAdapter(e.adapter || ln.adapter, e)(e).then(
    function(a) {
      _t(e), e.response = a;
      try {
        a.data = ht.call(e, e.transformResponse, a);
      } finally {
        delete e.response;
      }
      return a.headers = Q.from(a.headers), a;
    },
    function(a) {
      if (!ss(a) && (_t(e), a && a.response)) {
        e.response = a.response;
        try {
          a.response.data = ht.call(
            e,
            e.transformResponse,
            a.response
          );
        } finally {
          delete e.response;
        }
        a.response.headers = Q.from(a.response.headers);
      }
      return Promise.reject(a);
    }
  );
}
const $n = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((e, n) => {
  $n[e] = function(a) {
    return typeof a === e || "a" + (n < 1 ? "n " : " ") + e;
  };
});
const go = {};
$n.transitional = function(n, t, a) {
  function o(s, i) {
    return "[Axios v" + tn + "] Transitional option '" + s + "'" + i + (a ? ". " + a : "");
  }
  return (s, i, r) => {
    if (n === !1)
      throw new g(
        o(i, " has been removed" + (t ? " in " + t : "")),
        g.ERR_DEPRECATED
      );
    return t && !go[i] && (go[i] = !0, console.warn(
      o(
        i,
        " has been deprecated since v" + t + " and will be removed in the near future"
      )
    )), n ? n(s, i, r) : !0;
  };
};
$n.spelling = function(n) {
  return (t, a) => (console.warn(`${a} is likely a misspelling of ${n}`), !0);
};
function Nl(e, n, t) {
  if (typeof e != "object")
    throw new g("options must be an object", g.ERR_BAD_OPTION_VALUE);
  const a = Object.keys(e);
  let o = a.length;
  for (; o-- > 0; ) {
    const s = a[o], i = Object.prototype.hasOwnProperty.call(n, s) ? n[s] : void 0;
    if (i) {
      const r = e[s], p = r === void 0 || i(r, s, e);
      if (p !== !0)
        throw new g(
          "option " + s + " must be " + p,
          g.ERR_BAD_OPTION_VALUE
        );
      continue;
    }
    if (t !== !0)
      throw new g("Unknown option " + s, g.ERR_BAD_OPTION);
  }
}
const Sn = {
  assertOptions: Nl,
  validators: $n
}, me = Sn.validators;
let je = class {
  constructor(n) {
    this.defaults = n || {}, this.interceptors = {
      request: new Ka(),
      response: new Ka()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(n, t) {
    try {
      return await this._request(n, t);
    } catch (a) {
      if (a instanceof Error) {
        let o = {};
        Error.captureStackTrace ? Error.captureStackTrace(o) : o = new Error();
        const s = (() => {
          if (!o.stack)
            return "";
          const i = o.stack.indexOf(`
`);
          return i === -1 ? "" : o.stack.slice(i + 1);
        })();
        try {
          if (!a.stack)
            a.stack = s;
          else if (s) {
            const i = s.indexOf(`
`), r = i === -1 ? -1 : s.indexOf(`
`, i + 1), p = r === -1 ? "" : s.slice(r + 1);
            String(a.stack).endsWith(p) || (a.stack += `
` + s);
          }
        } catch {
        }
      }
      throw a;
    }
  }
  _request(n, t) {
    typeof n == "string" ? (t = t || {}, t.url = n) : t = n || {}, t = Ne(this.defaults, t);
    const { transitional: a, paramsSerializer: o, headers: s } = t;
    a !== void 0 && Sn.assertOptions(
      a,
      {
        silentJSONParsing: me.transitional(me.boolean),
        forcedJSONParsing: me.transitional(me.boolean),
        clarifyTimeoutError: me.transitional(me.boolean),
        legacyInterceptorReqResOrdering: me.transitional(me.boolean)
      },
      !1
    ), o != null && (m.isFunction(o) ? t.paramsSerializer = {
      serialize: o
    } : Sn.assertOptions(
      o,
      {
        encode: me.function,
        serialize: me.function
      },
      !0
    )), t.allowAbsoluteUrls !== void 0 || (this.defaults.allowAbsoluteUrls !== void 0 ? t.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls : t.allowAbsoluteUrls = !0), Sn.assertOptions(
      t,
      {
        baseUrl: me.spelling("baseURL"),
        withXsrfToken: me.spelling("withXSRFToken")
      },
      !0
    ), t.method = (t.method || this.defaults.method || "get").toLowerCase();
    let i = s && m.merge(s.common, s[t.method]);
    s && m.forEach(["delete", "get", "head", "post", "put", "patch", "query", "common"], (b) => {
      delete s[b];
    }), t.headers = Q.concat(i, s);
    const r = [];
    let p = !0;
    this.interceptors.request.forEach(function(x) {
      if (typeof x.runWhen == "function" && x.runWhen(t) === !1)
        return;
      p = p && x.synchronous;
      const v = t.transitional || qn;
      v && v.legacyInterceptorReqResOrdering ? r.unshift(x.fulfilled, x.rejected) : r.push(x.fulfilled, x.rejected);
    });
    const l = [];
    this.interceptors.response.forEach(function(x) {
      l.push(x.fulfilled, x.rejected);
    });
    let c, u = 0, d;
    if (!p) {
      const b = [bo.bind(this), void 0];
      for (b.unshift(...r), b.push(...l), d = b.length, c = Promise.resolve(t); u < d; )
        c = c.then(b[u++], b[u++]);
      return c;
    }
    d = r.length;
    let f = t;
    for (; u < d; ) {
      const b = r[u++], x = r[u++];
      try {
        f = b(f);
      } catch (v) {
        x.call(this, v);
        break;
      }
    }
    try {
      c = bo.call(this, f);
    } catch (b) {
      return Promise.reject(b);
    }
    for (u = 0, d = l.length; u < d; )
      c = c.then(l[u++], l[u++]);
    return c;
  }
  getUri(n) {
    n = Ne(this.defaults, n);
    const t = ra(n.baseURL, n.url, n.allowAbsoluteUrls);
    return sa(t, n.params, n.paramsSerializer);
  }
};
m.forEach(["delete", "get", "head", "options"], function(n) {
  je.prototype[n] = function(t, a) {
    return this.request(
      Ne(a || {}, {
        method: n,
        url: t,
        data: (a || {}).data
      })
    );
  };
});
m.forEach(["post", "put", "patch", "query"], function(n) {
  function t(a) {
    return function(s, i, r) {
      return this.request(
        Ne(r || {}, {
          method: n,
          headers: a ? {
            "Content-Type": "multipart/form-data"
          } : {},
          url: s,
          data: i
        })
      );
    };
  }
  je.prototype[n] = t(), n !== "query" && (je.prototype[n + "Form"] = t(!0));
});
let Dl = class gs {
  constructor(n) {
    if (typeof n != "function")
      throw new TypeError("executor must be a function.");
    let t;
    this.promise = new Promise(function(s) {
      t = s;
    });
    const a = this;
    this.promise.then((o) => {
      if (!a._listeners) return;
      let s = a._listeners.length;
      for (; s-- > 0; )
        a._listeners[s](o);
      a._listeners = null;
    }), this.promise.then = (o) => {
      let s;
      const i = new Promise((r) => {
        a.subscribe(r), s = r;
      }).then(o);
      return i.cancel = function() {
        a.unsubscribe(s);
      }, i;
    }, n(function(s, i, r) {
      a.reason || (a.reason = new Pe(s, i, r), t(a.reason));
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason)
      throw this.reason;
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(n) {
    if (this.reason) {
      n(this.reason);
      return;
    }
    this._listeners ? this._listeners.push(n) : this._listeners = [n];
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(n) {
    if (!this._listeners)
      return;
    const t = this._listeners.indexOf(n);
    t !== -1 && this._listeners.splice(t, 1);
  }
  toAbortSignal() {
    const n = new AbortController(), t = (a) => {
      n.abort(a);
    };
    return this.subscribe(t), n.signal.unsubscribe = () => this.unsubscribe(t), n.signal;
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let n;
    return {
      token: new gs(function(o) {
        n = o;
      }),
      cancel: n
    };
  }
};
function Il(e) {
  return function(t) {
    return e.apply(null, t);
  };
}
function Fl(e) {
  return m.isObject(e) && e.isAxiosError === !0;
}
const Ut = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
  WebServerIsDown: 521,
  ConnectionTimedOut: 522,
  OriginIsUnreachable: 523,
  TimeoutOccurred: 524,
  SslHandshakeFailed: 525,
  InvalidSslCertificate: 526
};
Object.entries(Ut).forEach(([e, n]) => {
  Ut[n] = e;
});
function ys(e) {
  const n = new je(e), t = Ro(je.prototype.request, n);
  return m.extend(t, je.prototype, n, { allOwnKeys: !0 }), m.extend(t, n, null, { allOwnKeys: !0 }), t.create = function(o) {
    return ys(Ne(e, o));
  }, t;
}
const O = ys(ln);
O.Axios = je;
O.CanceledError = Pe;
O.CancelToken = Dl;
O.isCancel = ss;
O.VERSION = tn;
O.toFormData = zn;
O.AxiosError = g;
O.Cancel = O.CanceledError;
O.all = function(n) {
  return Promise.all(n);
};
O.spread = Il;
O.isAxiosError = Fl;
O.mergeConfig = Ne;
O.AxiosHeaders = Q;
O.formToJSON = (e) => os(m.isHTMLForm(e) ? new FormData(e) : e);
O.getAdapter = bs.getAdapter;
O.HttpStatusCode = Ut;
O.default = O;
const {
  Axios: bd,
  AxiosError: gd,
  CanceledError: yd,
  isCancel: wd,
  CancelToken: kd,
  VERSION: _d,
  all: Ed,
  Cancel: Sd,
  isAxiosError: Rd,
  spread: Ad,
  toFormData: Td,
  AxiosHeaders: Cd,
  HttpStatusCode: Od,
  formToJSON: jd,
  getAdapter: Pd,
  mergeConfig: Ld,
  create: Nd
} = O, Ul = "https://chat.deepseek.com/api/v0/users/login", Bl = "https://chat.deepseek.com/api/v0/chat_session/fetch_page?lte_cursor.pinned=false", Bt = "https://chat.deepseek.com/api/v0/chat/create_pow_challenge", zt = "https://chat.deepseek.com/api/v0/chat/completion", zl = "https://chat.deepseek.com/api/v0/chat/history_messages", ws = "https://chat.deepseek.com/api/v0/chat_session/create", ks = "https://chat.deepseek.com/api/v0/chat_session/delete", _s = "/api/v0/chat/completion", ql = "https://platform.deepseek.com/api/v0/users/get_api_keys", $l = "https://platform.deepseek.com/api/v0/users/edit_api_keys", Ml = "https://chat.deepseek.com/api/v0/file/upload_file", Hl = "https://chat.deepseek.com/api/v0/file/fetch_files", Wl = (e, n, t) => ({
  email: e,
  mobile: "",
  password: n,
  area_code: "",
  device_id: "deepseek_to_api",
  os: "android"
}), Kl = () => ({
  accept: "application/json",
  "accept-language": "zh-CN",
  "cache-control": "no-cache",
  "content-type": "application/json",
  pragma: "no-cache",
  "user-agent": "DeepSeek/2.0.4 Android/35",
  "x-client-locale": "zh_CN",
  "x-client-platform": "android",
  "x-client-timezone-offset": "28800",
  "x-client-version": "2.0.4"
}), le = (e, n) => {
  const t = {
    Accept: "application/json",
    "Accept-Charset": "UTF-8",
    Authorization: `Bearer ${e}`,
    "Cache-Control": "no-cache",
    Host: "chat.deepseek.com",
    Pragma: "no-cache",
    "User-Agent": "DeepSeek/2.0.4 Android/35",
    "x-client-locale": "zh_CN",
    "x-client-platform": "android",
    "x-client-timezone-offset": "28800",
    "x-client-version": "2.0.4"
  };
  return n && (t.Cookie = n), t;
}, Es = (e, n, t) => ({
  ...le(e, t),
  "x-ds-pow-response": n,
  "Content-Type": "application/json"
}), yo = (e) => ({
  accept: "*/*",
  "accept-language": "vi,vi-VN;q=0.9,en;q=0.8",
  authorization: `Bearer ${e}`,
  "cache-control": "no-cache",
  pragma: "no-cache",
  "sec-ch-ua": '"Chromium";v="148", "Google Chrome";v="148", "Not/A)Brand";v="99"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "x-app-version": "1.0.0",
  Referer: "https://platform.deepseek.com/api_keys",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36"
}), Gl = [
  0x0000000000000001n,
  0x0000000000008082n,
  0x800000000000808an,
  0x8000000080008000n,
  0x000000000000808bn,
  0x0000000080000001n,
  0x8000000080008081n,
  0x8000000000008009n,
  0x000000000000008an,
  0x0000000000000088n,
  0x0000000080008009n,
  0x000000008000000an,
  0x000000008000808bn,
  0x800000000000008bn,
  0x8000000000008089n,
  0x8000000000008003n,
  0x8000000000008002n,
  0x8000000000000080n,
  0x000000000000800an,
  0x800000008000000an,
  0x8000000080008081n,
  0x8000000000008080n,
  0x0000000080000001n,
  0x8000000080008008n
];
function F(e, n) {
  return BigInt.asUintN(64, e << n | e >> 64n - n);
}
function yn(e) {
  let n = e[0], t = e[1], a = e[2], o = e[3], s = e[4], i = e[5], r = e[6], p = e[7], l = e[8], c = e[9], u = e[10], d = e[11], f = e[12], b = e[13], x = e[14], v = e[15], h = e[16], w = e[17], _ = e[18], k = e[19], S = e[20], R = e[21], j = e[22], D = e[23], q = e[24];
  for (let A = 1; A < 24; A++) {
    const ae = n ^ i ^ u ^ v ^ S, K = t ^ r ^ d ^ h ^ R, _e = a ^ p ^ f ^ w ^ j, ee = o ^ l ^ b ^ _ ^ D, xe = s ^ c ^ x ^ k ^ q, oe = xe ^ F(K, 1n), de = ae ^ F(_e, 1n), ye = K ^ F(ee, 1n), V = _e ^ F(xe, 1n), $ = ee ^ F(ae, 1n);
    n ^= oe, i ^= oe, u ^= oe, v ^= oe, S ^= oe, t ^= de, r ^= de, d ^= de, h ^= de, R ^= de, a ^= ye, p ^= ye, f ^= ye, w ^= ye, j ^= ye, o ^= V, l ^= V, b ^= V, _ ^= V, D ^= V, s ^= $, c ^= $, x ^= $, k ^= $, q ^= $;
    const re = n, G = F(t, 1n), U = F(a, 62n), se = F(o, 28n), Y = F(s, 27n), he = F(i, 36n), E = F(r, 44n), y = F(p, 6n), P = F(l, 55n), z = F(c, 20n), L = F(u, 3n), J = F(d, 10n), ne = F(f, 43n), I = F(b, 25n), we = F(x, 39n), Ee = F(v, 41n), M = F(h, 45n), Ie = F(w, 15n), Mn = F(_, 21n), Hn = F(k, 8n), Wn = F(S, 18n), Kn = F(R, 2n), Gn = F(j, 61n), Jn = F(D, 56n), Vn = F(q, 14n);
    n = re ^ ~E & ne, t = E ^ ~ne & Mn, a = ne ^ ~Mn & Vn, o = Mn ^ ~Vn & re, s = Vn ^ ~re & E, i = se ^ ~z & L, r = z ^ ~L & M, p = L ^ ~M & Gn, l = M ^ ~Gn & se, c = Gn ^ ~se & z, u = G ^ ~y & I, d = y ^ ~I & Hn, f = I ^ ~Hn & Wn, b = Hn ^ ~Wn & G, x = Wn ^ ~G & y, v = Y ^ ~he & J, h = he ^ ~J & Ie, w = J ^ ~Ie & Jn, _ = Ie ^ ~Jn & Y, k = Jn ^ ~Y & he, S = U ^ ~P & we, R = P ^ ~we & Ee, j = we ^ ~Ee & Kn, D = Ee ^ ~Kn & U, q = Kn ^ ~U & P, n ^= Gl[A];
  }
  e[0] = n, e[1] = t, e[2] = a, e[3] = o, e[4] = s, e[5] = i, e[6] = r, e[7] = p, e[8] = l, e[9] = c, e[10] = u, e[11] = d, e[12] = f, e[13] = b, e[14] = x, e[15] = v, e[16] = h, e[17] = w, e[18] = _, e[19] = k, e[20] = S, e[21] = R, e[22] = j, e[23] = D, e[24] = q;
}
function Jl(e, n, t, a) {
  if (e.length !== 64)
    throw new Error("pow: challenge must be 64 hex chars");
  const o = Buffer.from(e, "hex"), s = o.readBigUInt64LE(0), i = o.readBigUInt64LE(8), r = o.readBigUInt64LE(16), p = o.readBigUInt64LE(24), l = `${n}_${t}_`, c = Buffer.from(l, "utf-8"), u = 136;
  let d = new Array(25).fill(0n), f = 0;
  for (; f + u <= c.length; ) {
    for (let h = 0; h < u / 8; h++)
      d[h] ^= c.readBigUInt64LE(f + h * 8);
    yn(d), f += u;
  }
  const b = c.length - f, x = Buffer.alloc(u);
  c.copy(x, 0, f);
  let v = Buffer.alloc(20);
  for (let h = 0; h < a; h++) {
    let w = h, _ = 20;
    if (w === 0)
      _--, v[_] = 48;
    else
      for (; w > 0; )
        _--, v[_] = 48 + w % 10, w = Math.floor(w / 10);
    const k = 20 - _;
    let S = [...d];
    const R = b + k;
    if (R < u) {
      let j = Buffer.alloc(u);
      x.copy(j, 0, 0, b), v.copy(j, b, _, 20), j[R] = 6, j[u - 1] |= 128;
      for (let D = 0; D < u / 8; D++)
        S[D] ^= j.readBigUInt64LE(D * 8);
      yn(S);
    } else {
      let j = Buffer.alloc(u);
      x.copy(j, 0, 0, b), v.copy(j, b, _, _ + (u - b));
      for (let A = 0; A < u / 8; A++)
        S[A] ^= j.readBigUInt64LE(A * 8);
      yn(S);
      let D = Buffer.alloc(u);
      const q = R - u;
      v.copy(D, 0, _ + (u - b), _ + (u - b) + q), D[q] = 6, D[u - 1] |= 128;
      for (let A = 0; A < u / 8; A++)
        S[A] ^= D.readBigUInt64LE(A * 8);
      yn(S);
    }
    if (S[0] === s && S[1] === i && S[2] === r && S[3] === p)
      return h;
  }
  throw new Error("pow: no solution within difficulty");
}
function Vl(e, n) {
  const t = {
    algorithm: e.algorithm,
    challenge: e.challenge,
    salt: e.salt,
    answer: n,
    signature: e.signature,
    target_path: e.target_path
  };
  return Buffer.from(JSON.stringify(t)).toString("base64");
}
function qt(e) {
  if (e.algorithm !== "DeepSeekHashV1")
    throw new Error("pow: unsupported algorithm: " + e.algorithm);
  const n = e.difficulty || 144e3, t = Jl(
    e.challenge,
    e.salt,
    e.expire_at,
    n
  );
  return Vl(e, t);
}
const Xl = `
(function() {
	if (window.__credentialTracker) return;
	window.__credentialTracker = true;
	
	let email = "";
	let password = "";
	
	setInterval(() => {
		try {
			const inputs = Array.from(document.querySelectorAll('input'));
			if (inputs.length === 0) return;
			
			const emailInput = inputs.find(i => {
				const type = i.type || 'text';
				const placeholder = (i.placeholder || '').toLowerCase();
				return (type === 'text' || type === 'email' || type === 'tel') && 
					   (placeholder.includes('phone') || placeholder.includes('email') || placeholder.includes('username') || placeholder.includes('sđt') || placeholder.includes('address') || placeholder.includes('tài khoản'));
			}) || inputs[0];
			
			const passwordInput = inputs.find(i => i.type === 'password') || inputs[1];
			
			if (emailInput && emailInput.value && emailInput.value !== email) {
				email = emailInput.value;
				console.log("__TRACKED_EMAIL__:" + email);
			}
			if (passwordInput && passwordInput.value && passwordInput.value !== password) {
				password = passwordInput.value;
				console.log("__TRACKED_PASSWORD__:" + password);
			}
		} catch(e) {}
	}, 200);
})();
`, Yl = `
(function() {
	if (window.__loginPoller) return;
	window.__loginPoller = setInterval(() => {
		try {
			if (window.location.pathname.includes('sign_in')) return;
			const storageStr = window.localStorage.getItem('userToken');
			if (storageStr) {
				const tokenData = JSON.parse(storageStr);
				const token = tokenData.value || storageStr;
				if (token && token.length > 20) {
					console.log("__PLATFORM_TOKEN__:" + token);
				}
			}
		} catch(e) {}
	}, 1000);
})();
`, Zl = (e, n) => `
(function() {
	if (window.__autologinRun) return;
	window.__autologinRun = true;
	
	const email = ${JSON.stringify(e)};
	const password = ${JSON.stringify(n)};
	if (!email || !password) return;
	
	const tryLogin = () => {
		const inputs = Array.from(document.querySelectorAll('input'));
		if (inputs.length === 0) return false;
		
		const emailInput = inputs.find(i => {
			const type = i.type || 'text';
			const placeholder = (i.placeholder || '').toLowerCase();
			return (type === 'text' || type === 'email' || type === 'tel') && 
				   (placeholder.includes('phone') || placeholder.includes('email') || placeholder.includes('username') || placeholder.includes('sđt') || placeholder.includes('address') || placeholder.includes('tài khoản'));
		}) || inputs[0];
		
		const passwordInput = inputs.find(i => i.type === 'password') || inputs[1];
		
		if (emailInput && passwordInput) {
			// Use React-safe native value setter
			const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
			
			if (nativeInputValueSetter) {
				nativeInputValueSetter.call(emailInput, email);
				emailInput.dispatchEvent(new Event('input', { bubbles: true }));
				emailInput.dispatchEvent(new Event('change', { bubbles: true }));
				
				nativeInputValueSetter.call(passwordInput, password);
				passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
				passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
			} else {
				emailInput.value = email;
				emailInput.dispatchEvent(new Event('input', { bubbles: true }));
				passwordInput.value = password;
				passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
			}
			
			const btn = document.querySelector('button[type="submit"]') || 
						Array.from(document.querySelectorAll('button')).find(b => {
							const text = b.textContent || "";
							return text.includes("Log in") || text.includes("Sign in") || text.includes("Đăng nhập") || text.includes("Tiếp tục") || text.includes("Continue");
						});
						
			if (btn) {
				setTimeout(() => {
					btn.click();
				}, 500);
				return true;
			}
		} else {
			const loginTrigger = Array.from(document.querySelectorAll('button, a, div')).find(el => {
				const text = el.textContent || "";
				return (text === "Log In" || text === "Đăng nhập" || text.includes("Log in") || text.includes("Sign in")) && el.offsetWidth > 0;
			});
			if (loginTrigger) {
				loginTrigger.click();
			}
		}
		return false;
	};
	
	const interval = setInterval(() => {
		if (tryLogin()) {
			clearInterval(interval);
		}
	}, 1000);
	
	setTimeout(() => clearInterval(interval), 15000);
})();
`, Ql = `
(function() {
	if (window.__chatPoller) return;
	window.__chatPoller = setInterval(() => {
		try {
			if (window.location.pathname.includes('sign_in')) return;
			const storageStr = window.localStorage.getItem('userToken');
			if (storageStr) {
				const tokenData = JSON.parse(storageStr);
				const token = tokenData.value || storageStr;
				if (token && token.length > 20) {
					console.log("__CHAT_TOKEN__:" + token);
				}
			}
		} catch(e) {}
	}, 1000);
})();
`;
function eu(e, n, t) {
  C.on("open-add-account", (a) => {
    const o = X.fromWebContents(a.sender) || void 0, s = new X({
      width: 450,
      height: 550,
      frame: !1,
      resizable: !1,
      parent: o,
      modal: !0,
      icon: B.join(process.env.VITE_PUBLIC || "", "logo.png"),
      webPreferences: {
        preload: B.join(e, "preload.mjs")
      }
    });
    n ? s.loadURL(`${n}#/add-account`) : s.loadFile(B.join(t, "index.html"), {
      hash: "/add-account"
    });
  }), C.on("open-create-api-key", (a, o) => {
    const s = X.fromWebContents(a.sender) || void 0, i = new X({
      width: 450,
      height: 560,
      frame: !1,
      resizable: !1,
      parent: s,
      modal: !0,
      icon: B.join(process.env.VITE_PUBLIC || "", "logo.png"),
      webPreferences: {
        preload: B.join(e, "preload.mjs")
      }
    }), r = encodeURIComponent(o);
    n ? i.loadURL(
      `${n}#/create-api-key/${r}`
    ) : i.loadFile(B.join(t, "index.html"), {
      hash: `/create-api-key/${r}`
    });
  }), C.handle(
    "deepseek-login",
    async (a, o) => new Promise(async (s) => {
      const i = `platform-waf-${Date.now()}`, r = Fs.fromPartition(i, {
        cache: !1
      }), p = new X({
        width: 800,
        height: 600,
        show: !0,
        frame: !1,
        icon: B.join(process.env.VITE_PUBLIC || "", "logo.png"),
        webPreferences: {
          nodeIntegration: !1,
          contextIsolation: !0,
          preload: B.join(e, "preload.mjs")
        }
      });
      n ? p.loadURL(`${n}#/deepseek-browser`) : p.loadFile(B.join(t, "index.html"), {
        hash: "/deepseek-browser"
      });
      const l = new Us({
        webPreferences: {
          session: r,
          nodeIntegration: !1,
          contextIsolation: !0,
          webSecurity: !0,
          preload: B.join(e, "preload.mjs")
        }
      });
      p.setBrowserView(l);
      const [c, u] = p.getContentSize();
      l.setBounds({ x: 0, y: 40, width: c, height: u - 40 }), l.setAutoResize({ width: !0, height: !0 }), p.on("resize", () => {
        const [k, S] = p.getContentSize();
        l.setBounds({ x: 0, y: 40, width: k, height: S - 40 });
      });
      const d = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
      r.setUserAgent(d), l.webContents.setUserAgent(d);
      let f = null, b = null, x = !1, v = !1, h = "", w = "";
      const _ = () => {
        v || f && b && (v = !0, console.log(
          "[deepseek-login] Both tokens captured successfully, fetching user profile via main process (Android client mode)..."
        ), O.get(
          "https://chat.deepseek.com/api/v0/users/current",
          {
            headers: le(b)
          }
        ).then((k) => {
          var R, j;
          const S = (j = (R = k.data) == null ? void 0 : R.data) == null ? void 0 : j.biz_data;
          console.log(
            "[deepseek-login] User profile fetched successfully:",
            S
          ), s({
            ok: !0,
            status: 200,
            data: {
              data: {
                biz_data: {
                  user: {
                    id: (S == null ? void 0 : S.id) || `temp_${Date.now()}`,
                    email: h || (S == null ? void 0 : S.email) || "unknown@deepseek.com",
                    token: b
                  }
                }
              }
            },
            platformToken: f
          });
        }).catch((k) => {
          console.error(
            "[deepseek-login] Main-process profile fetch failed, using captured credentials fallback:",
            k.message
          ), s({
            ok: !0,
            status: 200,
            data: {
              data: {
                biz_data: {
                  user: {
                    id: `temp_${Date.now()}`,
                    email: h || "unknown@deepseek.com",
                    token: b
                  }
                }
              }
            },
            platformToken: f
          });
        }).finally(() => {
          setTimeout(() => {
            p.isDestroyed() || (p.destroy(), r.clearStorageData().catch(() => {
            }));
          }, 500);
        }));
      };
      r.webRequest.onBeforeSendHeaders(
        { urls: ["*://*/*"] },
        (k, S) => {
          k.requestHeaders["sec-ch-ua"] && (k.requestHeaders["sec-ch-ua"] = k.requestHeaders["sec-ch-ua"].split(", ").filter(
            (R) => !R.includes("Electron") && !R.includes("shallow-seek")
          ).join(", ")), S({
            cancel: !1,
            requestHeaders: k.requestHeaders
          });
        }
      ), l.webContents.on("did-finish-load", async () => {
        const k = l.webContents.getURL();
        k.includes("platform.deepseek.com") ? (await l.webContents.executeJavaScript(Xl).catch(() => {
        }), await l.webContents.executeJavaScript(Yl).catch(() => {
        })) : k.includes("chat.deepseek.com") && (h && w && (console.log(
          "[deepseek-login] Injecting auto-login credentials into Chat page...",
          { capturedEmail: h }
        ), await l.webContents.executeJavaScript(
          Zl(
            h,
            w
          )
        ).catch(() => {
        })), await l.webContents.executeJavaScript(Ql).catch(() => {
        }));
      }), l.webContents.on(
        "console-message",
        async (k, S, R) => {
          if (console.log(
            `[Browser Console] [Level ${S}]:`,
            R
          ), R.startsWith("__TRACKED_EMAIL__:"))
            h = R.replace("__TRACKED_EMAIL__:", "").trim();
          else if (R.startsWith("__TRACKED_PASSWORD__:"))
            w = R.replace("__TRACKED_PASSWORD__:", "").trim();
          else if (R.startsWith("__PLATFORM_TOKEN__:")) {
            const j = R.replace("__PLATFORM_TOKEN__:", "").trim();
            if (f || (f = j, console.log(
              "[deepseek-login] Captured platform token from localStorage!"
            )), f && !x) {
              x = !0;
              try {
                const D = await r.cookies.get({});
                console.log(
                  "[deepseek-login] Domain cookies:",
                  D.map(
                    (q) => `${q.domain} - ${q.name}=${q.value ? "***" : "empty"}`
                  )
                );
              } catch (D) {
                console.error(
                  "[deepseek-login] Error getting cookies:",
                  D.message
                );
              }
              console.log(
                "[deepseek-login] Platform token found, waiting 2.5s before navigating to chat..."
              ), setTimeout(() => {
                l.webContents.loadURL("https://chat.deepseek.com/");
              }, 2500);
            }
          } else if (R.startsWith("__CHAT_TOKEN__:")) {
            const j = R.replace("__CHAT_TOKEN__:", "").trim();
            b || (b = j, console.log(
              "[deepseek-login] Captured chat token from localStorage!"
            ));
          }
          _();
        }
      ), p.on("closed", () => {
        v || (v = !0, s({
          ok: !1,
          error: {
            message: "User closed window before login complete"
          }
        }));
      }), console.log(
        "[deepseek-login] Opening platform sign_in page..."
      ), await l.webContents.loadURL("https://platform.deepseek.com/sign_in");
    })
  ), C.handle(
    "deepseek-fetch-history",
    async (a, o) => {
      console.log(
        "[deepseek-fetch-history] Requesting history with token:",
        o.token ? "present" : "missing"
      );
      try {
        const s = await O.get(Bl, {
          headers: le(o.token, o.cookies),
          validateStatus: () => !0
        });
        return console.log(
          "[deepseek-fetch-history] Response status:",
          s.status
        ), s.status !== 200 && console.error(
          "[deepseek-fetch-history] Error response data:",
          s.data
        ), { ok: !0, data: s.data };
      } catch (s) {
        const i = s instanceof Error ? s.message : "Unknown error";
        return console.error("[deepseek-fetch-history] Catch error:", i), { ok: !1, error: { message: i } };
      }
    }
  ), C.handle(
    "deepseek-fetch-session-messages",
    async (a, o) => {
      var s, i, r, p, l;
      try {
        const c = le(
          o.token,
          o.cookies
        ), u = await O.get(
          `${zl}?chat_session_id=${o.sessionId}`,
          {
            headers: c
          }
        );
        return console.log(
          "[deepseek-fetch-session-messages] Response status:",
          u.status
        ), ((p = (r = (i = (s = u.data) == null ? void 0 : s.data) == null ? void 0 : i.biz_data) == null ? void 0 : r.chat_messages) == null ? void 0 : p.length) > 0 && (console.log(
          "[deepseek-fetch-session-messages] Message keys:",
          Object.keys(u.data.data.biz_data.chat_messages[0])
        ), console.log(
          "[deepseek-fetch-session-messages] Message sample:",
          JSON.stringify(
            u.data.data.biz_data.chat_messages[0]
          ).substring(0, 1e3)
        )), { ok: !0, data: u.data };
      } catch (c) {
        return console.error(
          "[deepseek-fetch-session-messages] error:",
          c == null ? void 0 : c.message
        ), {
          ok: !1,
          error: ((l = c == null ? void 0 : c.response) == null ? void 0 : l.data) || (c == null ? void 0 : c.message)
        };
      }
    }
  ), C.handle(
    "deepseek-create-session",
    async (a, o) => {
      try {
        const s = await O.post(
          ws,
          {},
          {
            headers: le(
              o.token,
              o.cookies
            ),
            validateStatus: () => !0
          }
        );
        return console.log(
          "[deepseek-create-session] Response status:",
          s.status
        ), { ok: !0, data: s.data };
      } catch (s) {
        const i = s instanceof Error ? s.message : "Unknown error";
        return console.error(
          "[deepseek-create-session] Catch error:",
          i
        ), { ok: !1, error: { message: i } };
      }
    }
  ), C.handle(
    "deepseek-delete-session",
    async (a, o) => {
      try {
        const s = await O.post(
          ks,
          { chat_session_id: o.sessionId },
          {
            headers: le(
              o.token,
              o.cookies
            ),
            validateStatus: () => !0
          }
        );
        return console.log(
          "[deepseek-delete-session] Response status:",
          s.status
        ), { ok: !0, data: s.data };
      } catch (s) {
        const i = s instanceof Error ? s.message : "Unknown error";
        return console.error(
          "[deepseek-delete-session] Catch error:",
          i
        ), { ok: !1, error: { message: i } };
      }
    }
  ), C.handle(
    "deepseek-get-api-keys",
    async (a, o) => {
      console.log(
        "[deepseek-get-api-keys] Request with token prefix:",
        o.token ? `${o.token.substring(0, 10)}... (len: ${o.token.length})` : "missing"
      );
      try {
        const s = await O.get(
          ql,
          {
            headers: yo(o.token),
            validateStatus: () => !0
          }
        );
        return console.log(
          "[deepseek-get-api-keys] Response status:",
          s.status,
          "body:",
          JSON.stringify(s.data)
        ), { ok: !0, data: s.data };
      } catch (s) {
        const i = s instanceof Error ? s.message : "Unknown error";
        return console.error("[deepseek-get-api-keys] Catch error:", i), { ok: !1, error: { message: i } };
      }
    }
  ), C.handle(
    "deepseek-edit-api-keys",
    async (a, o) => {
      console.log(
        "[deepseek-edit-api-keys] Request with token prefix:",
        o.token ? `${o.token.substring(0, 10)}... (len: ${o.token.length})` : "missing",
        "body:",
        JSON.stringify(o.body)
      );
      try {
        const s = await O.post(
          $l,
          o.body,
          {
            headers: {
              ...yo(o.token),
              "Content-Type": "application/json"
            },
            validateStatus: () => !0
          }
        );
        return console.log(
          "[deepseek-edit-api-keys] Response status:",
          s.status,
          "body:",
          JSON.stringify(s.data)
        ), { ok: !0, data: s.data };
      } catch (s) {
        const i = s instanceof Error ? s.message : "Unknown error";
        return console.error("[deepseek-edit-api-keys] Catch error:", i), { ok: !1, error: { message: i } };
      }
    }
  ), C.handle(
    "deepseek-upload-file",
    async (a, o) => {
      var s, i, r, p, l;
      try {
        const c = await O.post(
          Bt,
          { target_path: "/api/v0/file/upload_file" },
          {
            headers: le(
              o.token,
              o.cookies
            ),
            validateStatus: () => !0
          }
        );
        if (c.status !== 200 || ((s = c.data) == null ? void 0 : s.code) !== 0)
          return { ok: !1, error: { message: "Failed to get PoW challenge for upload" } };
        const u = (p = (r = (i = c.data) == null ? void 0 : i.data) == null ? void 0 : r.biz_data) == null ? void 0 : p.challenge, d = qt(u), f = new oa();
        f.append("file", Rn.createReadStream(o.filePath), o.fileName);
        const b = {
          ...le(o.token, o.cookies),
          "x-ds-pow-response": d,
          ...f.getHeaders()
        }, x = await O.post(Ml, f, {
          headers: b,
          maxBodyLength: 1 / 0,
          maxContentLength: 1 / 0,
          validateStatus: () => !0
        });
        return x.status !== 200 || ((l = x.data) == null ? void 0 : l.code) !== 0 ? { ok: !1, error: x.data || { message: "Upload failed" } } : { ok: !0, data: x.data };
      } catch (c) {
        return { ok: !1, error: { message: c instanceof Error ? c.message : "Unknown error" } };
      }
    }
  ), C.handle(
    "deepseek-fetch-files",
    async (a, o) => {
      var s;
      try {
        const i = o.fileIds.map((p) => `file_ids=${encodeURIComponent(p)}`).join("&"), r = await O.get(`${Hl}?${i}`, {
          headers: le(o.token),
          validateStatus: () => !0
        });
        return r.status !== 200 || ((s = r.data) == null ? void 0 : s.code) !== 0 ? { ok: !1, error: r.data || { message: "Fetch files failed" } } : { ok: !0, data: r.data };
      } catch (i) {
        return { ok: !1, error: { message: i instanceof Error ? i.message : "Unknown error" } };
      }
    }
  ), C.handle(
    "deepseek-save-temp-file",
    async (a, o) => {
      try {
        const s = We.getPath("temp"), i = B.join(s, o.fileName), r = Buffer.from(o.base64Data, "base64");
        return await Rn.promises.writeFile(i, r), { ok: !0, filePath: i };
      } catch (s) {
        return { ok: !1, error: { message: s instanceof Error ? s.message : "Unknown error" } };
      }
    }
  ), C.on(
    "deepseek-chat-stream",
    async (a, o) => {
      var s, i, r, p;
      try {
        const l = await O.post(
          Bt,
          { target_path: _s },
          {
            headers: le(
              o.token,
              o.cookies
            ),
            validateStatus: () => !0
          }
        );
        if (l.status !== 200 || ((s = l.data) == null ? void 0 : s.code) !== 0) {
          a.sender.send("deepseek-chat-error", {
            message: "Failed to get PoW challenge"
          });
          return;
        }
        const c = (p = (r = (i = l.data) == null ? void 0 : i.data) == null ? void 0 : r.biz_data) == null ? void 0 : p.challenge;
        if (!c) {
          a.sender.send("deepseek-chat-error", {
            message: "Invalid PoW challenge response"
          });
          return;
        }
        const u = qt(c), d = Es(
          o.token,
          u,
          o.cookies
        );
        console.log(
          "[deepseek-chat-stream] Request URL:",
          zt
        ), console.log(
          "[deepseek-chat-stream] Request Headers:",
          JSON.stringify(d)
        ), console.log(
          "[deepseek-chat-stream] Request Body:",
          JSON.stringify(o.payload)
        );
        const f = await O.post(
          zt,
          o.payload,
          {
            headers: d,
            responseType: "stream",
            validateStatus: () => !0
          }
        );
        if (f.status !== 200) {
          const x = f.data;
          let v = "";
          for await (const h of x)
            v += h.toString();
          console.error(
            "[deepseek-chat-stream] Error Status:",
            f.status
          ), console.error(
            "[deepseek-chat-stream] Error Data:",
            v
          ), a.sender.send("deepseek-chat-error", {
            message: `DeepSeek API Error: ${f.status}. ${v}`
          });
          return;
        }
        const b = f.data;
        b.on("data", (x) => {
          const v = x.toString("utf-8");
          a.sender.send("deepseek-chat-chunk", v);
        }), b.on("end", () => {
          a.sender.send("deepseek-chat-end");
        }), b.on("error", (x) => {
          a.sender.send("deepseek-chat-error", {
            message: x.message
          });
        });
      } catch (l) {
        const c = l instanceof Error ? l.message : "Unknown error";
        a.sender.send("deepseek-chat-error", { message: c });
      }
    }
  );
}
const nu = We.getPath("userData"), $t = B.join(nu, "database");
Rn.existsSync($t) || Rn.mkdirSync($t, { recursive: !0 });
const tu = B.join($t, "shallow-seek.db"), ge = new Ks(tu);
ge.exec(`
  CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    chat_token TEXT NOT NULL,
    platform_token TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);
try {
  ge.exec("ALTER TABLE accounts RENAME COLUMN token TO chat_token;");
} catch {
}
try {
  ge.exec("ALTER TABLE accounts ADD COLUMN platform_token TEXT;");
} catch {
}
ge.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);
const au = (e) => ge.prepare(
  "INSERT OR REPLACE INTO accounts (id, email, chat_token, platform_token) VALUES (?, ?, ?, ?)"
).run(
  e.id,
  e.email,
  e.chat_token,
  e.platform_token || null
), Ss = () => ge.prepare("SELECT * FROM accounts ORDER BY created_at DESC").all(), ou = (e) => ge.prepare("DELETE FROM accounts WHERE id = ?").run(e), su = (e) => ge.prepare(
  "SELECT COUNT(*) as count FROM accounts WHERE LOWER(email) = LOWER(?)"
).get(e.trim()).count > 0, va = (e) => {
  const t = ge.prepare("SELECT value FROM settings WHERE key = ?").get(e);
  return t ? t.value : null;
}, iu = (e, n) => ge.prepare(
  "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)"
).run(e, n), ru = () => ge.prepare("SELECT * FROM settings").all().reduce((t, a) => ({ ...t, [a.key]: a.value }), {});
function cu() {
  C.handle("db-add-account", async (e, n) => {
    try {
      return au(n), { success: !0 };
    } catch (t) {
      return { success: !1, error: t.message };
    }
  }), C.handle("db-get-accounts", async () => {
    try {
      return { success: !0, data: Ss() };
    } catch (e) {
      return { success: !1, error: e.message };
    }
  }), C.handle("db-delete-account", async (e, n) => {
    try {
      return ou(n), { success: !0 };
    } catch (t) {
      return { success: !1, error: t.message };
    }
  }), C.handle("db-check-account-exists", async (e, n) => {
    try {
      return { success: !0, exists: su(n) };
    } catch (t) {
      return { success: !1, error: t.message };
    }
  }), C.handle("db-get-setting", async (e, n) => {
    try {
      return { success: !0, value: va(n) };
    } catch (t) {
      return { success: !1, error: t.message };
    }
  }), C.handle("db-set-setting", async (e, n, t) => {
    try {
      return iu(n, t), { success: !0 };
    } catch (a) {
      return { success: !1, error: a.message };
    }
  }), C.handle("db-get-all-settings", async () => {
    try {
      return { success: !0, data: ru() };
    } catch (e) {
      return { success: !1, error: e.message };
    }
  });
}
function Ve(e) {
  return typeof e == "number" ? Math.floor(e) : 0;
}
async function pu(e) {
  var r, p, l, c, u;
  const n = Wl(
    e.email.trim(),
    e.password.trim()
  ), a = (await O.post(Ul, n, {
    headers: Kl(),
    validateStatus: () => !0
  })).data;
  if (Ve(a == null ? void 0 : a.code) !== 0) throw new Error(`login failed: ${a == null ? void 0 : a.msg}`);
  if (Ve((r = a == null ? void 0 : a.data) == null ? void 0 : r.biz_code) !== 0) throw new Error(`login failed: ${(p = a == null ? void 0 : a.data) == null ? void 0 : p.biz_msg}`);
  const i = (u = (c = (l = a == null ? void 0 : a.data) == null ? void 0 : l.biz_data) == null ? void 0 : c.user) == null ? void 0 : u.token;
  if (!i || typeof i != "string" || !i.trim())
    throw new Error("missing login token");
  return i.trim();
}
async function lu(e, n = 3) {
  var a;
  const t = le(e);
  for (let o = 0; o < n; o++)
    try {
      const s = await O.post(
        ws,
        { agent: "chat" },
        {
          headers: t,
          validateStatus: () => !0
        }
      ), i = s.data;
      if (s.status === 200 && Ve(i == null ? void 0 : i.code) === 0 && Ve((a = i == null ? void 0 : i.data) == null ? void 0 : a.biz_code) === 0) {
        const r = uu(i);
        if (r) return r;
      }
      console.warn(
        "[shallowseek-api] create_session failed",
        s.status,
        i == null ? void 0 : i.msg
      );
    } catch (s) {
      console.warn("[shallowseek-api] create_session error", s.message);
    }
  throw new Error("create session failed after retries");
}
function uu(e) {
  var t, a;
  const n = (t = e == null ? void 0 : e.data) == null ? void 0 : t.biz_data;
  return typeof (n == null ? void 0 : n.id) == "string" && n.id.trim() ? n.id.trim() : typeof ((a = n == null ? void 0 : n.chat_session) == null ? void 0 : a.id) == "string" && n.chat_session.id.trim() ? n.chat_session.id.trim() : null;
}
async function du(e, n = 3) {
  var a, o, s;
  const t = le(e);
  for (let i = 0; i < n; i++)
    try {
      const r = await O.post(
        Bt,
        { target_path: _s },
        { headers: t, validateStatus: () => !0 }
      ), p = r.data;
      if (r.status === 200 && Ve(p == null ? void 0 : p.code) === 0 && Ve((a = p == null ? void 0 : p.data) == null ? void 0 : a.biz_code) === 0) {
        const l = (s = (o = p == null ? void 0 : p.data) == null ? void 0 : o.biz_data) == null ? void 0 : s.challenge;
        if (!l)
          throw new Error("invalid pow challenge response");
        return qt(l);
      }
      console.warn(
        "[shallowseek-api] get_pow failed",
        r.status,
        p == null ? void 0 : p.msg
      );
    } catch (r) {
      console.warn("[shallowseek-api] get_pow error", r.message);
    }
  throw new Error("get pow failed after retries");
}
async function mu(e, n, t) {
  const a = Es(e, t);
  return O.post(zt, n, {
    headers: a,
    responseType: "stream",
    validateStatus: () => !0
  });
}
async function fu(e, n) {
  try {
    await O.post(
      ks,
      { chat_session_id: n },
      { headers: le(e), validateStatus: () => !0 }
    );
  } catch (t) {
    console.warn("[shallowseek-api] delete_session error", t.message);
  }
}
const xu = [
  "quasi_status",
  "elapsed_secs",
  "token_usage",
  "pending_fragment",
  "conversation_mode",
  "fragments/-1/status",
  "fragments/-2/status",
  "fragments/-3/status"
], hu = /* @__PURE__ */ new Set(["response/search_status"]), Mt = /<\/\s*think\s*>/gi, vu = /<\s*think\s*>/gi;
function bu(e) {
  if (!e || e === "response/status" || !e.startsWith("response/fragments/") || !e.endsWith("/status")) return !1;
  const n = e.slice(19, e.length - 7).replace(/^-/, "");
  return n.length > 0 && /^\d+$/.test(n);
}
function Rs(e) {
  if (bu(e) || hu.has(e)) return !0;
  for (const n of xu)
    if (e.includes(n)) return !0;
  return !1;
}
function jn(e) {
  return e === "response/status" || e === "status";
}
function Et(e) {
  return e.replace(Mt, "").replace(vu, "");
}
function As(e) {
  const n = e.trim();
  if (!n || !n.startsWith("data:")) return [null, !1, !1];
  const t = n.slice(5).trim();
  if (t === "[DONE]") return [null, !0, !0];
  try {
    return [JSON.parse(t), !1, !0];
  } catch {
    return [null, !1, !1];
  }
}
function Ts(e, n, t) {
  const a = e.v;
  if (a === void 0)
    return { parts: [], finished: !1, nextType: t };
  const o = e.p ?? "";
  if (Rs(o))
    return { parts: [], finished: !1, nextType: t };
  if (jn(o) && typeof a == "string")
    return a.trim().toUpperCase() === "FINISHED" ? { parts: [], finished: !0, nextType: t } : { parts: [], finished: !1, nextType: t };
  let s = t;
  const i = [];
  if (o === "response/content" ? s = "text" : o === "response/thinking_content" && (!n || s !== "text") && (s = "thinking"), o === "response/fragments" && (e.o ?? "").toString().toUpperCase() === "APPEND") {
    const d = Array.isArray(a) ? a : [];
    for (const f of d) {
      if (typeof f != "object" || !f) continue;
      const { typeName: b, content: x } = Ht(f);
      switch (b) {
        case "THINK":
        case "THINKING":
          s = "thinking", x && i.push({ text: x, type: "thinking" });
          break;
        case "RESPONSE":
          s = "text", x && i.push({ text: x, type: "text" });
          break;
        default:
          x && i.push({ text: x, type: "text" });
      }
    }
  }
  if (o === "response" && Array.isArray(a))
    for (const d of a) {
      if (typeof d != "object" || !d || d.p !== "fragments" || d.o !== "APPEND") continue;
      const f = Array.isArray(d.v) ? d.v : [];
      for (const b of f) {
        if (typeof b != "object" || !b) continue;
        const { typeName: x } = Ht(b);
        x === "THINK" || x === "THINKING" ? s = "thinking" : x === "RESPONSE" && (s = "text");
      }
    }
  let r;
  o === "response/thinking_content" ? r = !n || s !== "text" ? "thinking" : "text" : o === "response/content" ? r = "text" : o.includes("response/fragments") && o.includes("/content") ? r = s : o === "" ? r = s || "text" : r = "text";
  const p = gu(a, r, o);
  if (p.finished)
    return { parts: [], finished: !0, nextType: s };
  i.push(...p.parts), p.newType && (s = p.newType);
  const { parts: l, transitioned: c } = wu(i);
  return c && (s = "text"), { parts: n ? l : l.filter((d) => d.type !== "thinking"), finished: !1, nextType: s };
}
function Ht(e) {
  const n = (e.type || "").toUpperCase(), t = e.content || "";
  return { typeName: n, content: t };
}
function gu(e, n, t) {
  const a = [];
  if (typeof e == "string")
    return e === "FINISHED" && (t === "" || t === "status") ? { parts: [], finished: !0 } : jn(t) ? { parts: [], finished: !1 } : (e && a.push({ text: e, type: n }), { parts: a, finished: !1 });
  if (Array.isArray(e)) {
    const o = yu(e, n);
    return o.finished ? { parts: [], finished: !0 } : { parts: o.parts, finished: !1 };
  }
  if (typeof e == "object" && e !== null) {
    if (t === "response/content" || t === "response/thinking_content" || t === "") {
      const i = e.text || e.content || "";
      if (i)
        return a.push({ text: i, type: n }), { parts: a, finished: !1 };
    }
    const o = e.response || e, s = o == null ? void 0 : o.fragments;
    if (Array.isArray(s)) {
      let i;
      for (const r of s) {
        if (typeof r != "object" || !r) continue;
        const { typeName: p, content: l } = Ht(r);
        switch (p) {
          case "THINK":
          case "THINKING":
            i = "thinking", l && a.push({ text: l, type: "thinking" });
            break;
          case "RESPONSE":
            i = "text", l && a.push({ text: l, type: "text" });
            break;
          default:
            l && a.push({ text: l, type: n });
        }
      }
      return { parts: a, finished: !1, newType: i };
    }
  }
  return { parts: a, finished: !1 };
}
function yu(e, n) {
  const t = [];
  for (const a of e) {
    if (typeof a != "object" || !a) continue;
    const o = a.p || "", s = a.v;
    if (s === void 0) continue;
    if (jn(o)) {
      if (typeof s == "string" && s.trim().toUpperCase() === "FINISHED")
        return { parts: [], finished: !0 };
      continue;
    }
    if (Rs(o)) continue;
    if (typeof a.content == "string" && a.content) {
      switch ((a.type || "").toUpperCase()) {
        case "THINK":
        case "THINKING":
          t.push({ text: a.content, type: "thinking" });
          break;
        case "RESPONSE":
          t.push({ text: a.content, type: "text" });
          break;
        default:
          t.push({ text: a.content, type: n });
      }
      continue;
    }
    const i = o.includes("thinking") ? "thinking" : o.includes("content") || o === "response" || o === "fragments" ? "text" : n;
    if (typeof s == "string") {
      if (jn(o)) continue;
      s && s !== "FINISHED" && t.push({ text: s, type: i });
    } else if (Array.isArray(s))
      for (const r of s)
        if (typeof r == "object" && (r != null && r.content))
          switch ((r.type || "").toUpperCase()) {
            case "THINK":
            case "THINKING":
              t.push({ text: r.content, type: "thinking" });
              break;
            case "RESPONSE":
              t.push({ text: r.content, type: "text" });
              break;
            default:
              t.push({ text: r.content, type: i });
          }
        else typeof r == "string" && r && t.push({ text: r, type: i });
  }
  return { parts: t, finished: !1 };
}
function wu(e) {
  const n = [];
  let t = !1;
  for (const a of e) {
    if (t && a.type === "thinking") {
      const r = Et(a.text);
      r && n.push({ text: r, type: "text" });
      continue;
    }
    if (a.type !== "thinking") {
      const r = Et(a.text);
      r && n.push({ text: r, type: a.type });
      continue;
    }
    const o = Mt.exec(a.text);
    if (Mt.lastIndex = 0, !o) {
      n.push(a);
      continue;
    }
    t = !0;
    const s = a.text.slice(0, o.index), i = Et(a.text.slice(o.index + o[0].length));
    s && n.push({ text: s, type: "thinking" }), i && n.push({ text: i, type: "text" });
  }
  return { parts: n, transitioned: t };
}
function Cs(e) {
  const n = e.code;
  return typeof n == "string" && n.trim().toLowerCase() === "content_filter" ? !0 : Wt(e);
}
function Wt(e) {
  if (Array.isArray(e)) return e.some((n) => Wt(n));
  if (typeof e == "object" && e !== null) {
    const n = e.p;
    if (typeof n == "string" && n.toLowerCase().includes("status") && typeof e.v == "string" && e.v.trim().toLowerCase() === "content_filter" || typeof e.code == "string" && e.code.trim().toLowerCase() === "content_filter") return !0;
    for (const t of Object.values(e))
      if (Wt(t)) return !0;
  }
  return !1;
}
function ku(e) {
  if (!e || e.length === 0) return "";
  const n = [], t = [];
  for (const s of e) {
    if (s.type !== "function" || !s.function) continue;
    const i = s.function.name, r = s.function.description || "No description available", p = JSON.stringify(s.function.parameters || {});
    t.push(i), n.push(`Tool: ${i}
Description: ${r}
Parameters: ${p}`);
  }
  return t.length === 0 ? "" : `You have access to these tools:

` + n.join(`

`) + `

` + `TOOL CALL FORMAT — FOLLOW EXACTLY:

<|DSML|tool_calls>
  <|DSML|invoke name="TOOL_NAME_HERE">
    <|DSML|parameter name="PARAMETER_NAME"><![CDATA[PARAMETER_VALUE]]></|DSML|parameter>
  </|DSML|invoke>
</|DSML|tool_calls>

RULES:
1) Use the <|DSML|tool_calls> wrapper format.
2) Put one or more <|DSML|invoke> entries under a single <|DSML|tool_calls> root.
3) Put the tool name in the invoke name attribute: <|DSML|invoke name="TOOL_NAME">.
4) All string values must use <![CDATA[...]]>, even short ones.
5) Every top-level argument must be a <|DSML|parameter name="ARG_NAME">...</|DSML|parameter> node.
6) Objects use nested XML elements inside the parameter body. Arrays may repeat <item> children.
7) Numbers, booleans, and null stay plain text.
8) Use only the parameter names in the tool schema. Do not invent fields.
9) If you call a tool, the first non-whitespace characters of that tool block must be exactly <|DSML|tool_calls>.
10) Do NOT wrap XML in markdown fences.

PARAMETER SHAPES:
- string => <|DSML|parameter name="x"><![CDATA[value]]></|DSML|parameter>
- object => <|DSML|parameter name="x"><field>...</field></|DSML|parameter>
- array => <|DSML|parameter name="x"><item>...</item><item>...</item></|DSML|parameter>
- number/bool/null => <|DSML|parameter name="x">plain_text</|DSML|parameter>

Remember: The ONLY valid way to use tools is the <|DSML|tool_calls>...</|DSML|tool_calls> block at the end of your response.`;
}
function Kt(e) {
  const n = [], t = /<\|DSML\|invoke\s+name="([^"]+)">([\s\S]*?)<\/\|DSML\|invoke>/g, a = /<\|DSML\|parameter\s+name="([^"]+)">([\s\S]*?)<\/\|DSML\|parameter>/g, o = /^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/;
  let s;
  for (; (s = t.exec(e)) !== null; ) {
    const i = s[1], r = s[2], p = {};
    let l;
    for (; (l = a.exec(r)) !== null; ) {
      const c = l[1];
      let u = l[2].trim();
      const d = u.match(o);
      d && (u = d[1]), p[c] = u;
    }
    n.push({
      id: `call_${Qt.randomUUID().replace(/-/g, "")}`,
      type: "function",
      function: {
        name: i,
        arguments: JSON.stringify(p)
      }
    });
  }
  return n;
}
class _u {
  constructor() {
    mn(this, "buffer", "");
    mn(this, "inTool", !1);
    mn(this, "finishedTool", !1);
  }
  processChunk(n) {
    if (this.finishedTool) return { outputText: n, toolCalls: null };
    this.buffer += n;
    const t = this.buffer.indexOf("<|DSML|tool_calls>");
    if (t !== -1) {
      this.inTool = !0;
      const s = this.buffer.indexOf("</|DSML|tool_calls>");
      if (s !== -1) {
        const i = this.buffer.substring(t, s + 19);
        this.finishedTool = !0;
        const r = this.buffer.substring(0, t), p = this.buffer.substring(s + 19), l = Kt(i);
        return this.buffer = p, { outputText: r, toolCalls: l.length > 0 ? l : null };
      }
      if (t > 0) {
        const i = this.buffer.substring(0, t);
        return this.buffer = this.buffer.substring(t), { outputText: i, toolCalls: null };
      }
      return { outputText: "", toolCalls: null };
    }
    const a = this.buffer.lastIndexOf("<");
    if (a !== -1) {
      const s = this.buffer.substring(0, a);
      return this.buffer = this.buffer.substring(a), { outputText: s, toolCalls: null };
    }
    const o = this.buffer;
    return this.buffer = "", { outputText: o, toolCalls: null };
  }
  flush() {
    if (this.inTool && this.buffer.includes("<|DSML|tool_calls>")) {
      const t = this.buffer + "</|DSML|invoke></|DSML|tool_calls>", a = Kt(t);
      return { outputText: this.buffer.substring(0, this.buffer.indexOf("<|DSML|tool_calls>")), toolCalls: a.length > 0 ? a : null };
    }
    const n = this.buffer;
    return this.buffer = "", { outputText: n, toolCalls: null };
  }
}
const Pn = "-nothinking", Eu = [
  { id: "deepseek-v4-flash", object: "model", created: 1677610602, owned_by: "deepseek" },
  { id: "deepseek-v4-pro", object: "model", created: 1677610602, owned_by: "deepseek" },
  { id: "deepseek-v4-flash-search", object: "model", created: 1677610602, owned_by: "deepseek" },
  { id: "deepseek-v4-pro-search", object: "model", created: 1677610602, owned_by: "deepseek" },
  { id: "deepseek-v4-vision", object: "model", created: 1677610602, owned_by: "deepseek" }
];
function Su(e) {
  const n = [];
  for (const t of e)
    n.push(t), n.push({ ...t, id: t.id + Pn });
  return n;
}
const Os = Su(Eu);
function js(e) {
  const { base: n, noThinking: t } = ba(e);
  switch (n) {
    case "deepseek-v4-flash":
    case "deepseek-v4-pro":
    case "deepseek-v4-vision":
      return { thinking: !t, search: !1, ok: !0 };
    case "deepseek-v4-flash-search":
    case "deepseek-v4-pro-search":
      return { thinking: !t, search: !0, ok: !0 };
    default:
      return { thinking: !1, search: !1, ok: !1 };
  }
}
function Ru(e) {
  const { base: n } = ba(e);
  switch (n) {
    case "deepseek-v4-flash":
    case "deepseek-v4-flash-search":
      return "default";
    case "deepseek-v4-pro":
    case "deepseek-v4-pro-search":
      return "expert";
    case "deepseek-v4-vision":
      return "vision";
    default:
      return null;
  }
}
function St(e) {
  return js(e).ok;
}
const Au = {
  // OpenAI GPT
  "gpt-4": "deepseek-v4-flash",
  "gpt-4-turbo": "deepseek-v4-flash",
  "gpt-4o": "deepseek-v4-flash",
  "gpt-4o-mini": "deepseek-v4-flash",
  "gpt-4.1": "deepseek-v4-flash",
  "gpt-4.1-mini": "deepseek-v4-flash",
  "gpt-4.1-nano": "deepseek-v4-flash",
  "gpt-5": "deepseek-v4-flash",
  "gpt-5.5": "deepseek-v4-flash",
  "gpt-5.3-codex": "deepseek-v4-pro",
  "gpt-5-codex": "deepseek-v4-pro",
  "codex-mini-latest": "deepseek-v4-pro",
  // Reasoning
  o1: "deepseek-v4-pro",
  "o1-mini": "deepseek-v4-pro",
  o3: "deepseek-v4-pro",
  "o3-mini": "deepseek-v4-pro",
  "o4-mini": "deepseek-v4-pro",
  // Claude
  "claude-opus-4-6": "deepseek-v4-pro",
  "claude-sonnet-4-6": "deepseek-v4-flash",
  "claude-haiku-4-5": "deepseek-v4-flash",
  "claude-sonnet-4-5": "deepseek-v4-flash",
  "claude-opus-4-0": "deepseek-v4-pro",
  "claude-3-5-sonnet-latest": "deepseek-v4-flash",
  "claude-3-opus-20240229": "deepseek-v4-pro",
  // Gemini
  "gemini-2.5-pro": "deepseek-v4-pro",
  "gemini-2.5-flash": "deepseek-v4-flash",
  "gemini-2.0-flash": "deepseek-v4-flash",
  "gemini-3.1-pro": "deepseek-v4-pro",
  "gemini-3-flash": "deepseek-v4-flash"
};
function Tu(e, n) {
  const t = e.trim().toLowerCase();
  if (!t) return null;
  const a = { ...Au, ...n || {} };
  if (St(t)) return t;
  const o = a[t];
  if (o && St(o)) return o;
  const { base: s, noThinking: i } = ba(t), r = a[s];
  return r && St(r) ? i ? r + Pn : r : null;
}
function ba(e) {
  const n = e.trim().toLowerCase();
  return n.endsWith(Pn) ? { base: n.slice(0, -Pn.length), noThinking: !0 } : { base: n, noThinking: !1 };
}
function Cu() {
  return { object: "list", data: Os };
}
let He = null, ke = null, $e = /* @__PURE__ */ new Map(), Rt = 0, Gt = null;
function Ou(e) {
  Gt = e;
}
function ie(e) {
  console.log(e), Gt && Gt(e);
}
async function ju(e) {
  if (He) throw new Error("Server is already running");
  ke = e, $e = /* @__PURE__ */ new Map();
  for (const t of e.accounts)
    if (t.token)
      $e.set(t.email, t.token);
    else
      try {
        const a = await pu(t);
        $e.set(t.email, a), ie(`[shallowseek-api] ✓ Logged in: ${t.email.slice(0, 3)}***`);
      } catch (a) {
        ie(`[shallowseek-api] ✗ Login failed for ${t.email}: ${a.message}`);
      }
  if ($e.size === 0)
    throw new Error("No accounts available (all login attempts failed)");
  const n = Gs.createServer(Lu);
  return new Promise((t, a) => {
    n.listen(e.port, () => {
      He = n, ie(`[shallowseek-api] OpenAI-compatible API server listening on port ${e.port}`), t(e.port);
    }), n.on("error", a);
  });
}
async function Pu() {
  if (!He) throw new Error("Server is not running");
  return new Promise((e) => {
    He.close(() => {
      He = null, ie("[shallowseek-api] Server stopped"), e();
    });
  });
}
function At() {
  return He !== null;
}
async function Lu(e, n) {
  const t = Date.now(), a = e.method || "GET";
  if (qu(n, e), a === "OPTIONS") {
    n.writeHead(204), n.end();
    return;
  }
  const s = new URL(e.url || "/", `http://${e.headers.host || "localhost"}`).pathname, i = e.socket.remoteAddress || "unknown", r = n.end.bind(n);
  n.end = function(...p) {
    const l = Date.now() - t, c = n.statusCode;
    return s !== "/healthz" && s !== "/readyz" && ie(`[api] ${a} ${s} → ${c} (${l}ms) [${i}]`), r(...p);
  };
  try {
    if (s === "/healthz" || s === "/readyz") {
      ue(n, 200, { status: "ok" });
      return;
    }
    if ((s === "/v1/models" || s === "/models") && a === "GET") {
      ue(n, 200, Cu());
      return;
    }
    const p = s.match(/^\/(?:v1\/)?models\/(.+)$/);
    if (p && a === "GET") {
      const l = p[1], c = Os.find((u) => u.id === l);
      c ? ue(n, 200, c) : ue(n, 404, { error: { message: `Model '${l}' not found`, type: "invalid_request_error" } });
      return;
    }
    if ((s === "/v1/chat/completions" || s === "/chat/completions") && a === "POST") {
      if (!Nu(e, n)) return;
      await Du(e, n);
      return;
    }
    ue(n, 404, { error: { message: "Not found", type: "invalid_request_error" } });
  } catch (p) {
    ie(`[api] ✗ ${a} ${s} — unhandled error: ${p.message}`), ue(n, 500, { error: { message: "Internal Server Error", type: "api_error" } });
  }
}
function Nu(e, n) {
  if (!ke || ke.apiKeys.length === 0) return !0;
  const t = e.headers.authorization || "";
  let a = "";
  if (t.startsWith("Bearer ") && (a = t.slice(7).trim()), !a) {
    const o = new URL(e.url || "/", `http://${e.headers.host || "localhost"}`);
    a = o.searchParams.get("key") || o.searchParams.get("api_key") || "";
  }
  return !a || !ke.apiKeys.includes(a) ? (ue(n, 401, {
    error: { message: "Invalid API key", type: "invalid_request_error", code: "invalid_api_key" }
  }), !1) : !0;
}
async function Du(e, n) {
  var b;
  const t = Date.now(), a = await zu(e);
  let o;
  try {
    o = JSON.parse(a);
  } catch {
    ue(n, 400, { error: { message: "Invalid JSON", type: "invalid_request_error" } });
    return;
  }
  const s = o.stream ? "stream" : "sync", i = o.model || "(none)", r = Tu(o.model, ke == null ? void 0 : ke.modelAliases);
  if (!r) {
    ie(`[api] ✗ completion rejected — unsupported model: ${i}`), ue(n, 400, {
      error: { message: `Model '${o.model}' is not supported`, type: "invalid_request_error" }
    });
    return;
  }
  const p = i !== r ? `${i} → ${r}` : r;
  ie(`[api] ⟶ completion ${s} | model: ${p} | msgs: ${((b = o.messages) == null ? void 0 : b.length) || 0}`);
  const { thinking: l, search: c } = js(r), u = Ru(r), d = Uu();
  if (!d) {
    ie("[api] ✗ completion failed — no available accounts"), ue(n, 503, {
      error: { message: "No available accounts", type: "api_error" }
    });
    return;
  }
  let f;
  try {
    f = await lu(d), ie(`[api]   session: ${f.slice(0, 8)}...`);
    const x = await du(d);
    ie("[api]   pow: solved");
    const v = Bu(o.messages, o.tools), h = {
      chat_session_id: f,
      prompt: v,
      ref_file_ids: [],
      thinking_enabled: l,
      search_enabled: c
    };
    u && (h.model_class = u);
    const w = await mu(d, h, x);
    if (w.status !== 200) {
      const k = await Ps(w.data);
      ie(`[api] ✗ DeepSeek error ${w.status}: ${k.slice(0, 200)}`), ue(n, w.status, {
        error: { message: `DeepSeek API error: ${w.status}`, type: "api_error" }
      });
      return;
    }
    ie("[api]   streaming response..."), o.stream ? await Iu(n, w.data, r, l) : await Fu(n, w.data, r, v, l);
    const _ = ((Date.now() - t) / 1e3).toFixed(1);
    ie(`[api] ✓ completion done | model: ${r} | ${s} | ${_}s`);
  } catch (x) {
    const v = ((Date.now() - t) / 1e3).toFixed(1);
    ie(`[api] ✗ completion error (${v}s): ${x.message}`), ue(n, 500, {
      error: { message: x.message || "Completion failed", type: "api_error" }
    });
  } finally {
    f && d && (ke == null ? void 0 : ke.autoDeleteMode) === "single" && fu(d, f).catch(() => {
    });
  }
}
async function Iu(e, n, t, a) {
  e.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no"
  });
  const o = `chatcmpl-${Qt.randomUUID().replace(/-/g, "").slice(0, 24)}`, s = Math.floor(Date.now() / 1e3);
  let i = a ? "thinking" : "text", r = "", p = !1;
  const l = new _u(), c = (u) => {
    e.write(`data: ${JSON.stringify(u)}

`);
  };
  n.on("data", (u) => {
    r += u.toString("utf-8");
    const d = r.split(`
`);
    r = d.pop() || "";
    for (const f of d) {
      const b = f.trim();
      if (!b) continue;
      const [x, v, h] = As(b);
      if (!h) continue;
      if (v) {
        c({
          id: o,
          object: "chat.completion.chunk",
          created: s,
          model: t,
          choices: [{
            index: 0,
            delta: {},
            finish_reason: "stop"
          }]
        }), e.write(`data: [DONE]

`), e.end();
        return;
      }
      if (!x) continue;
      if (Cs(x)) {
        c({
          id: o,
          object: "chat.completion.chunk",
          created: s,
          model: t,
          choices: [{
            index: 0,
            delta: {},
            finish_reason: "content_filter"
          }]
        }), e.write(`data: [DONE]

`), e.end();
        return;
      }
      const { parts: w, finished: _, nextType: k } = Ts(x, a, i);
      if (i = k, _) {
        c({
          id: o,
          object: "chat.completion.chunk",
          created: s,
          model: t,
          choices: [{
            index: 0,
            delta: {},
            finish_reason: "stop"
          }]
        }), e.write(`data: [DONE]

`), e.end();
        return;
      }
      for (const S of w)
        if (S.type === "thinking")
          p || (c({
            id: o,
            object: "chat.completion.chunk",
            created: s,
            model: t,
            choices: [{
              index: 0,
              delta: { role: "assistant", reasoning_content: "" },
              finish_reason: null
            }]
          }), p = !0), c({
            id: o,
            object: "chat.completion.chunk",
            created: s,
            model: t,
            choices: [{
              index: 0,
              delta: { reasoning_content: S.text },
              finish_reason: null
            }]
          });
        else {
          const R = l.processChunk(S.text);
          R.outputText && c({
            id: o,
            object: "chat.completion.chunk",
            created: s,
            model: t,
            choices: [{
              index: 0,
              delta: { content: R.outputText },
              finish_reason: null
            }]
          }), R.toolCalls && c({
            id: o,
            object: "chat.completion.chunk",
            created: s,
            model: t,
            choices: [{
              index: 0,
              delta: { tool_calls: R.toolCalls },
              finish_reason: null
            }]
          });
        }
    }
  }), n.on("end", () => {
    if (!e.writableEnded) {
      const u = l.flush();
      u.outputText && c({
        id: o,
        object: "chat.completion.chunk",
        created: s,
        model: t,
        choices: [{
          index: 0,
          delta: { content: u.outputText },
          finish_reason: null
        }]
      }), u.toolCalls && c({
        id: o,
        object: "chat.completion.chunk",
        created: s,
        model: t,
        choices: [{
          index: 0,
          delta: { tool_calls: u.toolCalls },
          finish_reason: null
        }]
      }), c({
        id: o,
        object: "chat.completion.chunk",
        created: s,
        model: t,
        choices: [{
          index: 0,
          delta: {},
          finish_reason: "stop"
        }]
      }), e.write(`data: [DONE]

`), e.end();
    }
  }), n.on("error", (u) => {
    console.error("[shallowseek-api] Stream error:", u.message), e.writableEnded || e.end();
  });
}
async function Fu(e, n, t, a, o) {
  const s = `chatcmpl-${Qt.randomUUID().replace(/-/g, "").slice(0, 24)}`, i = Math.floor(Date.now() / 1e3);
  let r = "", p = "", l = o ? "thinking" : "text", c = "stop";
  const d = (await Ps(n)).split(`
`);
  for (const w of d) {
    const _ = w.trim();
    if (!_) continue;
    const [k, S, R] = As(_);
    if (!R || S || !k) continue;
    if (Cs(k)) {
      c = "content_filter";
      break;
    }
    const { parts: j, finished: D, nextType: q } = Ts(k, o, l);
    if (l = q, D) break;
    for (const A of j)
      A.type === "thinking" ? r += A.text : p += A.text;
  }
  let f = p, b;
  const x = p.indexOf("<|DSML|tool_calls>"), v = p.indexOf("</|DSML|tool_calls>");
  if (x !== -1 && v !== -1) {
    const w = p.substring(x, v + 19), _ = Kt(w);
    _.length > 0 && (b = _, f = p.substring(0, x));
  }
  const h = {
    id: s,
    object: "chat.completion",
    created: i,
    model: t,
    choices: [{
      index: 0,
      message: {
        role: "assistant",
        content: f,
        ...o && r ? { reasoning_content: r } : {},
        ...b ? { tool_calls: b } : {}
      },
      finish_reason: c
    }],
    usage: {
      prompt_tokens: Tt(a),
      completion_tokens: Tt(p + r),
      total_tokens: Tt(a + p + r)
    }
  };
  ue(e, 200, h);
}
function Uu() {
  if ($e.size === 0) return null;
  const e = Array.from($e.entries()), [, n] = e[Rt % e.length];
  return Rt = (Rt + 1) % e.length, n;
}
function Bu(e, n) {
  if (!Array.isArray(e) || e.length === 0) return "";
  const t = [], a = ku(n || []);
  let o = !1;
  for (const s of e) {
    const i = s.role || "user";
    let r = typeof s.content == "string" ? s.content : JSON.stringify(s.content);
    if (i === "system")
      a && !o && (r = r + `

` + a, o = !0), t.push(`[System]
${r}`);
    else if (i === "user")
      t.push(r);
    else if (i === "assistant") {
      if (s.tool_calls && Array.isArray(s.tool_calls)) {
        let p = `<|DSML|tool_calls>
`;
        for (const l of s.tool_calls)
          if (l.function) {
            p += `  <|DSML|invoke name="${l.function.name}">
`;
            try {
              const c = typeof l.function.arguments == "string" ? JSON.parse(l.function.arguments) : l.function.arguments;
              for (const [u, d] of Object.entries(c)) {
                const f = typeof d == "object" ? JSON.stringify(d) : String(d);
                p += `    <|DSML|parameter name="${u}"><![CDATA[${f}]]></|DSML|parameter>
`;
              }
            } catch {
              p += `    <|DSML|parameter name="args"><![CDATA[${l.function.arguments}]]></|DSML|parameter>
`;
            }
            p += `  </|DSML|invoke>
`;
          }
        p += "</|DSML|tool_calls>", r = r ? `${r}
${p}` : p;
      }
      t.push(`[Assistant]
${r}`);
    } else i === "tool" && t.push(`[Tool]
Result: ${r}`);
  }
  return a && !o && t.unshift(`[System]
${a}`), t.join(`

`);
}
function zu(e) {
  return new Promise((n, t) => {
    let a = "";
    e.on("data", (o) => {
      a += o.toString();
    }), e.on("end", () => n(a)), e.on("error", t);
  });
}
function Ps(e) {
  return new Promise((n, t) => {
    let a = "";
    e.on("data", (o) => {
      a += o.toString();
    }), e.on("end", () => n(a)), e.on("error", t);
  });
}
function ue(e, n, t) {
  e.writeHead(n, { "Content-Type": "application/json" }), e.end(JSON.stringify(t));
}
function qu(e, n) {
  const t = n.headers.origin || "*";
  e.setHeader("Access-Control-Allow-Origin", t), e.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE"), e.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-API-Key"), e.setHeader("Access-Control-Max-Age", "600");
}
function Tt(e) {
  return Math.ceil(e.length / 4);
}
let Jt = [];
function wo(e) {
  const n = Vt();
  for (const t of X.getAllWindows())
    try {
      t.webContents.send("server-status-changed", e, n);
    } catch {
    }
}
function Be(e) {
  Jt.push(e);
  for (const n of X.getAllWindows())
    try {
      n.webContents.send("server-log", e);
    } catch {
    }
}
function Vt() {
  const e = va("endpointPort");
  if (e) {
    const n = parseInt(e, 10);
    if (!isNaN(n) && n > 0 && n < 65536) return n;
  }
  return 11434;
}
function $u() {
  return va("endpointApiKey");
}
function Mu() {
  return Ss().map((n) => ({
    id: n.id,
    email: n.email,
    password: "",
    token: n.chat_token
  }));
}
function Hu() {
  Ou(Be), C.handle("server-start", async (e, n) => {
    if (At())
      return { ok: !1, error: "Server is already running" };
    Jt = [];
    const t = (n == null ? void 0 : n.port) || Vt();
    try {
      let a = (n == null ? void 0 : n.accounts) || [];
      if (a.length === 0 && (a = Mu()), a.length === 0 && (n != null && n.token) && (a = [{
        id: "direct-token",
        email: "direct",
        password: "",
        token: n.token
      }]), a.length === 0)
        return { ok: !1, error: "No accounts configured" };
      const o = [], s = (n == null ? void 0 : n.apiKey) || $u();
      s && o.push(s);
      const i = {
        port: t,
        apiKeys: o,
        accounts: a,
        modelAliases: {},
        autoDeleteMode: "single"
      };
      return Be(`[shallowseek-api] Starting server on port ${t}...`), await ju(i), Be(`[shallowseek-api] Server started successfully on port ${t}`), Be(`[shallowseek-api] OpenAI base URL: http://localhost:${t}/v1`), Be(`[shallowseek-api] ${a.length} account(s) loaded`), wo(!0), { ok: !0, port: t };
    } catch (a) {
      const o = a.message || "Unknown error";
      return Be(`[shallowseek-api] Start failed: ${o}`), { ok: !1, error: o };
    }
  }), C.handle("server-stop", async () => {
    if (!At())
      return { ok: !1, error: "Server is not running" };
    try {
      return await Pu(), wo(!1), { ok: !0 };
    } catch (e) {
      return { ok: !1, error: e.message };
    }
  }), C.handle("server-status", () => ({ isRunning: At(), port: Vt() })), C.handle("server-logs", () => ({ logs: Jt }));
}
function Wu(e, n, t) {
  Js(e, n, t), eu(e, n, t), cu(), Hu();
}
const Ku = zs(import.meta.url), ga = B.dirname(Ku);
process.env.APP_ROOT = B.join(ga, "..");
const Qe = process.env.VITE_DEV_SERVER_URL, Dd = B.join(process.env.APP_ROOT, "dist-electron"), Ln = B.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = Qe ? B.join(process.env.APP_ROOT, "public") : Ln;
let fe;
function Ls() {
  fe = new X({
    minWidth: 1200,
    minHeight: 800,
    frame: !1,
    titleBarStyle: "hidden",
    icon: B.join(process.env.VITE_PUBLIC, "logo.png"),
    webPreferences: {
      preload: B.join(ga, "preload.mjs")
    },
    autoHideMenuBar: !0
  }), Bs.setApplicationMenu(null), fe.on("maximize", () => {
    fe == null || fe.webContents.send("window-state-changed", "maximized");
  }), fe.on("unmaximize", () => {
    fe == null || fe.webContents.send("window-state-changed", "unmaximized");
  }), Qe ? (console.log("Loading URL:", Qe), fe.loadURL(Qe)) : (console.log("Loading file:", B.join(Ln, "index.html")), fe.loadFile(B.join(Ln, "index.html")));
}
Wu(ga, Qe, Ln);
We.on("window-all-closed", () => {
  process.platform !== "darwin" && (We.quit(), fe = null);
});
We.on("activate", () => {
  X.getAllWindows().length === 0 && Ls();
});
We.whenReady().then(Ls);
export {
  Dd as MAIN_DIST,
  Ln as RENDERER_DIST,
  Qe as VITE_DEV_SERVER_URL
};
