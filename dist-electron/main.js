var Cr = Object.defineProperty;
var Rr = (e, t, n) => t in e ? Cr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Be = (e, t, n) => Rr(e, typeof t != "symbol" ? t + "" : t, n);
import { ipcMain as O, BrowserWindow as ne, shell as Or, session as Lr, BrowserView as Pr, app as Xe, Menu as jr } from "electron";
import W from "node:path";
import { fileURLToPath as Dr } from "node:url";
import Ue from "util";
import le, { Readable as Nr } from "stream";
import Us, { resolve as mo } from "path";
import Da from "http";
import Na from "https";
import Ia from "url";
import Ir from "fs";
import Ms from "crypto";
import Bs from "http2";
import qr from "assert";
import $s from "tty";
import Fr from "os";
import Te from "zlib";
import { EventEmitter as Ur } from "events";
import Gt from "node:fs";
import Mr from "better-sqlite3";
import Br from "node:http";
import { Readable as $r } from "node:stream";
import Ye from "node:crypto";
function zr(e, t, n) {
  O.on("window-minimize", (o) => {
    const s = o.sender, i = ne.fromWebContents(s);
    i == null || i.minimize();
  }), O.on("window-maximize", (o) => {
    const s = o.sender, i = ne.fromWebContents(s);
    i != null && i.isMaximized() ? i.unmaximize() : i == null || i.maximize();
  }), O.on("window-close", (o) => {
    const s = o.sender, i = ne.fromWebContents(s);
    i && (i.hide(), i.close());
  }), O.on("window-zoom-in", (o) => {
    const s = o.sender, i = s.getZoomLevel();
    s.setZoomLevel(i + 0.5);
  }), O.on("window-zoom-out", (o) => {
    const s = o.sender, i = s.getZoomLevel();
    s.setZoomLevel(i - 0.5);
  }), O.on("window-zoom-reset", (o) => {
    o.sender.setZoomLevel(0);
  }), O.on("renderer-log", (o, s) => {
    console.log("[renderer-log]", s);
  });
  let a = null;
  O.handle("open-confirm", async (o, s) => {
    const i = ne.fromWebContents(o.sender) || void 0, r = new URLSearchParams();
    Object.entries(s).forEach(([p, l]) => {
      r.append(p, String(l));
    });
    const c = new ne({
      width: 500,
      height: 240,
      frame: !1,
      resizable: !1,
      parent: i,
      modal: !0,
      show: !1,
      webPreferences: {
        preload: W.join(e, "preload.mjs")
      }
    });
    return t ? c.loadURL(
      `${t}#/confirm?${r.toString()}`
    ) : c.loadFile(W.join(n, "index.html"), {
      hash: `/confirm?${r.toString()}`
    }), c.once("ready-to-show", () => {
      c.show();
    }), new Promise((p) => {
      a = p, c.on("closed", () => {
        a && (a(!1), a = null);
      });
    });
  }), O.on("confirm-result", (o, s) => {
    a && (a(s), a = null);
    const i = ne.fromWebContents(o.sender);
    i == null || i.close();
  }), O.on("open-settings", (o) => {
    const s = ne.fromWebContents(o.sender) || void 0, i = new ne({
      width: 900,
      height: 600,
      frame: !1,
      parent: s,
      modal: !0,
      webPreferences: {
        preload: W.join(e, "preload.mjs")
      }
    });
    t ? i.loadURL(`${t}#/settings/interface`) : i.loadFile(W.join(n, "index.html"), {
      hash: "/settings/interface"
    });
  }), O.on("theme-changed", (o, s) => {
    ne.getAllWindows().forEach((i) => {
      i.webContents.send("on-theme-changed", s);
    });
  }), O.on("language-changed", (o, s) => {
    ne.getAllWindows().forEach((i) => {
      i.webContents.send("on-language-changed", s);
    });
  }), O.on("open-external", (o, s) => {
    Or.openExternal(s);
  });
}
function zs(e, t) {
  return function() {
    return e.apply(t, arguments);
  };
}
const { toString: Hr } = Object.prototype, { getPrototypeOf: cn } = Object, { iterator: ln, toStringTag: Hs } = Symbol, pn = /* @__PURE__ */ ((e) => (t) => {
  const n = Hr.call(t);
  return e[n] || (e[n] = n.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null)), ye = (e) => (e = e.toLowerCase(), (t) => pn(t) === e), un = (e) => (t) => typeof t === e, { isArray: st } = Array, Ze = un("undefined");
function bt(e) {
  return e !== null && !Ze(e) && e.constructor !== null && !Ze(e.constructor) && fe(e.constructor.isBuffer) && e.constructor.isBuffer(e);
}
const Ws = ye("ArrayBuffer");
function Wr(e) {
  let t;
  return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? t = ArrayBuffer.isView(e) : t = e && e.buffer && Ws(e.buffer), t;
}
const Vr = un("string"), fe = un("function"), Vs = un("number"), yt = (e) => e !== null && typeof e == "object", Gr = (e) => e === !0 || e === !1, Mt = (e) => {
  if (pn(e) !== "object")
    return !1;
  const t = cn(e);
  return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Hs in e) && !(ln in e);
}, Kr = (e) => {
  if (!yt(e) || bt(e))
    return !1;
  try {
    return Object.keys(e).length === 0 && Object.getPrototypeOf(e) === Object.prototype;
  } catch {
    return !1;
  }
}, Jr = ye("Date"), Xr = ye("File"), Yr = (e) => !!(e && typeof e.uri < "u"), Zr = (e) => e && typeof e.getParts < "u", Qr = ye("Blob"), ec = ye("FileList"), tc = (e) => yt(e) && fe(e.pipe);
function nc() {
  return typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
}
const fo = nc(), ho = typeof fo.FormData < "u" ? fo.FormData : void 0, ac = (e) => {
  if (!e) return !1;
  if (ho && e instanceof ho) return !0;
  const t = cn(e);
  if (!t || t === Object.prototype || !fe(e.append)) return !1;
  const n = pn(e);
  return n === "formdata" || // detect form-data instance
  n === "object" && fe(e.toString) && e.toString() === "[object FormData]";
}, oc = ye("URLSearchParams"), [sc, ic, rc, cc] = [
  "ReadableStream",
  "Request",
  "Response",
  "Headers"
].map(ye), lc = (e) => e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function wt(e, t, { allOwnKeys: n = !1 } = {}) {
  if (e === null || typeof e > "u")
    return;
  let a, o;
  if (typeof e != "object" && (e = [e]), st(e))
    for (a = 0, o = e.length; a < o; a++)
      t.call(null, e[a], a, e);
  else {
    if (bt(e))
      return;
    const s = n ? Object.getOwnPropertyNames(e) : Object.keys(e), i = s.length;
    let r;
    for (a = 0; a < i; a++)
      r = s[a], t.call(null, e[r], r, e);
  }
}
function Gs(e, t) {
  if (bt(e))
    return null;
  t = t.toLowerCase();
  const n = Object.keys(e);
  let a = n.length, o;
  for (; a-- > 0; )
    if (o = n[a], t === o.toLowerCase())
      return o;
  return null;
}
const Oe = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, Ks = (e) => !Ze(e) && e !== Oe;
function ma(...e) {
  const { caseless: t, skipUndefined: n } = Ks(this) && this || {}, a = {}, o = (s, i) => {
    if (i === "__proto__" || i === "constructor" || i === "prototype")
      return;
    const r = t && Gs(a, i) || i, c = fa(a, r) ? a[r] : void 0;
    Mt(c) && Mt(s) ? a[r] = ma(c, s) : Mt(s) ? a[r] = ma({}, s) : st(s) ? a[r] = s.slice() : (!n || !Ze(s)) && (a[r] = s);
  };
  for (let s = 0, i = e.length; s < i; s++)
    e[s] && wt(e[s], o);
  return a;
}
const pc = (e, t, n, { allOwnKeys: a } = {}) => (wt(
  t,
  (o, s) => {
    n && fe(o) ? Object.defineProperty(e, s, {
      // Null-proto descriptor so a polluted Object.prototype.get cannot
      // hijack defineProperty's accessor-vs-data resolution.
      __proto__: null,
      value: zs(o, n),
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
), e), uc = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e), dc = (e, t, n, a) => {
  e.prototype = Object.create(t.prototype, a), Object.defineProperty(e.prototype, "constructor", {
    __proto__: null,
    value: e,
    writable: !0,
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e, "super", {
    __proto__: null,
    value: t.prototype
  }), n && Object.assign(e.prototype, n);
}, mc = (e, t, n, a) => {
  let o, s, i;
  const r = {};
  if (t = t || {}, e == null) return t;
  do {
    for (o = Object.getOwnPropertyNames(e), s = o.length; s-- > 0; )
      i = o[s], (!a || a(i, e, t)) && !r[i] && (t[i] = e[i], r[i] = !0);
    e = n !== !1 && cn(e);
  } while (e && (!n || n(e, t)) && e !== Object.prototype);
  return t;
}, fc = (e, t, n) => {
  e = String(e), (n === void 0 || n > e.length) && (n = e.length), n -= t.length;
  const a = e.indexOf(t, n);
  return a !== -1 && a === n;
}, hc = (e) => {
  if (!e) return null;
  if (st(e)) return e;
  let t = e.length;
  if (!Vs(t)) return null;
  const n = new Array(t);
  for (; t-- > 0; )
    n[t] = e[t];
  return n;
}, gc = /* @__PURE__ */ ((e) => (t) => e && t instanceof e)(typeof Uint8Array < "u" && cn(Uint8Array)), xc = (e, t) => {
  const a = (e && e[ln]).call(e);
  let o;
  for (; (o = a.next()) && !o.done; ) {
    const s = o.value;
    t.call(e, s[0], s[1]);
  }
}, vc = (e, t) => {
  let n;
  const a = [];
  for (; (n = e.exec(t)) !== null; )
    a.push(n);
  return a;
}, bc = ye("HTMLFormElement"), yc = (e) => e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function(n, a, o) {
  return a.toUpperCase() + o;
}), fa = (({ hasOwnProperty: e }) => (t, n) => e.call(t, n))(Object.prototype), wc = ye("RegExp"), Js = (e, t) => {
  const n = Object.getOwnPropertyDescriptors(e), a = {};
  wt(n, (o, s) => {
    let i;
    (i = t(o, s, e)) !== !1 && (a[s] = i || o);
  }), Object.defineProperties(e, a);
}, kc = (e) => {
  Js(e, (t, n) => {
    if (fe(e) && ["arguments", "caller", "callee"].includes(n))
      return !1;
    const a = e[n];
    if (fe(a)) {
      if (t.enumerable = !1, "writable" in t) {
        t.writable = !1;
        return;
      }
      t.set || (t.set = () => {
        throw Error("Can not rewrite read-only method '" + n + "'");
      });
    }
  });
}, Sc = (e, t) => {
  const n = {}, a = (o) => {
    o.forEach((s) => {
      n[s] = !0;
    });
  };
  return st(e) ? a(e) : a(String(e).split(t)), n;
}, Ec = () => {
}, _c = (e, t) => e != null && Number.isFinite(e = +e) ? e : t;
function Tc(e) {
  return !!(e && fe(e.append) && e[Hs] === "FormData" && e[ln]);
}
const Ac = (e) => {
  const t = new Array(10), n = (a, o) => {
    if (yt(a)) {
      if (t.indexOf(a) >= 0)
        return;
      if (bt(a))
        return a;
      if (!("toJSON" in a)) {
        t[o] = a;
        const s = st(a) ? [] : {};
        return wt(a, (i, r) => {
          const c = n(i, o + 1);
          !Ze(c) && (s[r] = c);
        }), t[o] = void 0, s;
      }
    }
    return a;
  };
  return n(e, 0);
}, Cc = ye("AsyncFunction"), Rc = (e) => e && (yt(e) || fe(e)) && fe(e.then) && fe(e.catch), Xs = ((e, t) => e ? setImmediate : t ? ((n, a) => (Oe.addEventListener(
  "message",
  ({ source: o, data: s }) => {
    o === Oe && s === n && a.length && a.shift()();
  },
  !1
), (o) => {
  a.push(o), Oe.postMessage(n, "*");
}))(`axios@${Math.random()}`, []) : (n) => setTimeout(n))(typeof setImmediate == "function", fe(Oe.postMessage)), Oc = typeof queueMicrotask < "u" ? queueMicrotask.bind(Oe) : typeof process < "u" && process.nextTick || Xs, Lc = (e) => e != null && fe(e[ln]), m = {
  isArray: st,
  isArrayBuffer: Ws,
  isBuffer: bt,
  isFormData: ac,
  isArrayBufferView: Wr,
  isString: Vr,
  isNumber: Vs,
  isBoolean: Gr,
  isObject: yt,
  isPlainObject: Mt,
  isEmptyObject: Kr,
  isReadableStream: sc,
  isRequest: ic,
  isResponse: rc,
  isHeaders: cc,
  isUndefined: Ze,
  isDate: Jr,
  isFile: Xr,
  isReactNativeBlob: Yr,
  isReactNative: Zr,
  isBlob: Qr,
  isRegExp: wc,
  isFunction: fe,
  isStream: tc,
  isURLSearchParams: oc,
  isTypedArray: gc,
  isFileList: ec,
  forEach: wt,
  merge: ma,
  extend: pc,
  trim: lc,
  stripBOM: uc,
  inherits: dc,
  toFlatObject: mc,
  kindOf: pn,
  kindOfTest: ye,
  endsWith: fc,
  toArray: hc,
  forEachEntry: xc,
  matchAll: vc,
  isHTMLForm: bc,
  hasOwnProperty: fa,
  hasOwnProp: fa,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors: Js,
  freezeMethods: kc,
  toObjectSet: Sc,
  toCamelCase: yc,
  noop: Ec,
  toFiniteNumber: _c,
  findKey: Gs,
  global: Oe,
  isContextDefined: Ks,
  isSpecCompliantForm: Tc,
  toJSONObject: Ac,
  isAsyncFn: Cc,
  isThenable: Rc,
  setImmediate: Xs,
  asap: Oc,
  isIterable: Lc
}, Pc = m.toObjectSet([
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
]), jc = (e) => {
  const t = {};
  let n, a, o;
  return e && e.split(`
`).forEach(function(i) {
    o = i.indexOf(":"), n = i.substring(0, o).trim().toLowerCase(), a = i.substring(o + 1).trim(), !(!n || t[n] && Pc[n]) && (n === "set-cookie" ? t[n] ? t[n].push(a) : t[n] = [a] : t[n] = t[n] ? t[n] + ", " + a : a);
  }), t;
}, go = Symbol("internals"), Dc = /[^\x09\x20-\x7E\x80-\xFF]/g;
function Nc(e) {
  let t = 0, n = e.length;
  for (; t < n; ) {
    const a = e.charCodeAt(t);
    if (a !== 9 && a !== 32)
      break;
    t += 1;
  }
  for (; n > t; ) {
    const a = e.charCodeAt(n - 1);
    if (a !== 9 && a !== 32)
      break;
    n -= 1;
  }
  return t === 0 && n === e.length ? e : e.slice(t, n);
}
function rt(e) {
  return e && String(e).trim().toLowerCase();
}
function Ic(e) {
  return Nc(e.replace(Dc, ""));
}
function Bt(e) {
  return e === !1 || e == null ? e : m.isArray(e) ? e.map(Bt) : Ic(String(e));
}
function qc(e) {
  const t = /* @__PURE__ */ Object.create(null), n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let a;
  for (; a = n.exec(e); )
    t[a[1]] = a[2];
  return t;
}
const Fc = (e) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());
function Ln(e, t, n, a, o) {
  if (m.isFunction(a))
    return a.call(this, t, n);
  if (o && (t = n), !!m.isString(t)) {
    if (m.isString(a))
      return t.indexOf(a) !== -1;
    if (m.isRegExp(a))
      return a.test(t);
  }
}
function Uc(e) {
  return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (t, n, a) => n.toUpperCase() + a);
}
function Mc(e, t) {
  const n = m.toCamelCase(" " + t);
  ["get", "set", "has"].forEach((a) => {
    Object.defineProperty(e, a + n, {
      // Null-proto descriptor so a polluted Object.prototype.get cannot turn
      // this data descriptor into an accessor descriptor on the way in.
      __proto__: null,
      value: function(o, s, i) {
        return this[a].call(this, t, o, s, i);
      },
      configurable: !0
    });
  });
}
let se = class {
  constructor(t) {
    t && this.set(t);
  }
  set(t, n, a) {
    const o = this;
    function s(r, c, p) {
      const l = rt(c);
      if (!l)
        throw new Error("header name must be a non-empty string");
      const u = m.findKey(o, l);
      (!u || o[u] === void 0 || p === !0 || p === void 0 && o[u] !== !1) && (o[u || c] = Bt(r));
    }
    const i = (r, c) => m.forEach(r, (p, l) => s(p, l, c));
    if (m.isPlainObject(t) || t instanceof this.constructor)
      i(t, n);
    else if (m.isString(t) && (t = t.trim()) && !Fc(t))
      i(jc(t), n);
    else if (m.isObject(t) && m.isIterable(t)) {
      let r = {}, c, p;
      for (const l of t) {
        if (!m.isArray(l))
          throw TypeError("Object iterator must return a key-value pair");
        r[p = l[0]] = (c = r[p]) ? m.isArray(c) ? [...c, l[1]] : [c, l[1]] : l[1];
      }
      i(r, n);
    } else
      t != null && s(n, t, a);
    return this;
  }
  get(t, n) {
    if (t = rt(t), t) {
      const a = m.findKey(this, t);
      if (a) {
        const o = this[a];
        if (!n)
          return o;
        if (n === !0)
          return qc(o);
        if (m.isFunction(n))
          return n.call(this, o, a);
        if (m.isRegExp(n))
          return n.exec(o);
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(t, n) {
    if (t = rt(t), t) {
      const a = m.findKey(this, t);
      return !!(a && this[a] !== void 0 && (!n || Ln(this, this[a], a, n)));
    }
    return !1;
  }
  delete(t, n) {
    const a = this;
    let o = !1;
    function s(i) {
      if (i = rt(i), i) {
        const r = m.findKey(a, i);
        r && (!n || Ln(a, a[r], r, n)) && (delete a[r], o = !0);
      }
    }
    return m.isArray(t) ? t.forEach(s) : s(t), o;
  }
  clear(t) {
    const n = Object.keys(this);
    let a = n.length, o = !1;
    for (; a--; ) {
      const s = n[a];
      (!t || Ln(this, this[s], s, t, !0)) && (delete this[s], o = !0);
    }
    return o;
  }
  normalize(t) {
    const n = this, a = {};
    return m.forEach(this, (o, s) => {
      const i = m.findKey(a, s);
      if (i) {
        n[i] = Bt(o), delete n[s];
        return;
      }
      const r = t ? Uc(s) : String(s).trim();
      r !== s && delete n[s], n[r] = Bt(o), a[r] = !0;
    }), this;
  }
  concat(...t) {
    return this.constructor.concat(this, ...t);
  }
  toJSON(t) {
    const n = /* @__PURE__ */ Object.create(null);
    return m.forEach(this, (a, o) => {
      a != null && a !== !1 && (n[o] = t && m.isArray(a) ? a.join(", ") : a);
    }), n;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([t, n]) => t + ": " + n).join(`
`);
  }
  getSetCookie() {
    return this.get("set-cookie") || [];
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(t) {
    return t instanceof this ? t : new this(t);
  }
  static concat(t, ...n) {
    const a = new this(t);
    return n.forEach((o) => a.set(o)), a;
  }
  static accessor(t) {
    const a = (this[go] = this[go] = {
      accessors: {}
    }).accessors, o = this.prototype;
    function s(i) {
      const r = rt(i);
      a[r] || (Mc(o, i), a[r] = !0);
    }
    return m.isArray(t) ? t.forEach(s) : s(t), this;
  }
};
se.accessor([
  "Content-Type",
  "Content-Length",
  "Accept",
  "Accept-Encoding",
  "User-Agent",
  "Authorization"
]);
m.reduceDescriptors(se.prototype, ({ value: e }, t) => {
  let n = t[0].toUpperCase() + t.slice(1);
  return {
    get: () => e,
    set(a) {
      this[n] = a;
    }
  };
});
m.freezeMethods(se);
const Bc = "[REDACTED ****]";
function $c(e) {
  if (m.hasOwnProp(e, "toJSON"))
    return !0;
  let t = Object.getPrototypeOf(e);
  for (; t && t !== Object.prototype; ) {
    if (m.hasOwnProp(t, "toJSON"))
      return !0;
    t = Object.getPrototypeOf(t);
  }
  return !1;
}
function zc(e, t) {
  const n = new Set(t.map((s) => String(s).toLowerCase())), a = [], o = (s) => {
    if (s === null || typeof s != "object" || m.isBuffer(s)) return s;
    if (a.indexOf(s) !== -1) return;
    s instanceof se && (s = s.toJSON()), a.push(s);
    let i;
    if (m.isArray(s))
      i = [], s.forEach((r, c) => {
        const p = o(r);
        m.isUndefined(p) || (i[c] = p);
      });
    else {
      if (!m.isPlainObject(s) && $c(s))
        return a.pop(), s;
      i = /* @__PURE__ */ Object.create(null);
      for (const [r, c] of Object.entries(s)) {
        const p = n.has(r.toLowerCase()) ? Bc : o(c);
        m.isUndefined(p) || (i[r] = p);
      }
    }
    return a.pop(), i;
  };
  return o(e);
}
let y = class Ys extends Error {
  static from(t, n, a, o, s, i) {
    const r = new Ys(t.message, n || t.code, a, o, s);
    return r.cause = t, r.name = t.name, t.status != null && r.status == null && (r.status = t.status), i && Object.assign(r, i), r;
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
  constructor(t, n, a, o, s) {
    super(t), Object.defineProperty(this, "message", {
      // Null-proto descriptor so a polluted Object.prototype.get cannot turn
      // this data descriptor into an accessor descriptor on the way in.
      __proto__: null,
      value: t,
      enumerable: !0,
      writable: !0,
      configurable: !0
    }), this.name = "AxiosError", this.isAxiosError = !0, n && (this.code = n), a && (this.config = a), o && (this.request = o), s && (this.response = s, this.status = s.status);
  }
  toJSON() {
    const t = this.config, n = t && m.hasOwnProp(t, "redact") ? t.redact : void 0, a = m.isArray(n) && n.length > 0 ? zc(t, n) : m.toJSONObject(t);
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
y.ERR_BAD_OPTION_VALUE = "ERR_BAD_OPTION_VALUE";
y.ERR_BAD_OPTION = "ERR_BAD_OPTION";
y.ECONNABORTED = "ECONNABORTED";
y.ETIMEDOUT = "ETIMEDOUT";
y.ECONNREFUSED = "ECONNREFUSED";
y.ERR_NETWORK = "ERR_NETWORK";
y.ERR_FR_TOO_MANY_REDIRECTS = "ERR_FR_TOO_MANY_REDIRECTS";
y.ERR_DEPRECATED = "ERR_DEPRECATED";
y.ERR_BAD_RESPONSE = "ERR_BAD_RESPONSE";
y.ERR_BAD_REQUEST = "ERR_BAD_REQUEST";
y.ERR_CANCELED = "ERR_CANCELED";
y.ERR_NOT_SUPPORT = "ERR_NOT_SUPPORT";
y.ERR_INVALID_URL = "ERR_INVALID_URL";
y.ERR_FORM_DATA_DEPTH_EXCEEDED = "ERR_FORM_DATA_DEPTH_EXCEEDED";
function Zs(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Qs = le.Stream, Hc = Ue, Wc = we;
function we() {
  this.source = null, this.dataSize = 0, this.maxDataSize = 1024 * 1024, this.pauseStream = !0, this._maxDataSizeExceeded = !1, this._released = !1, this._bufferedEvents = [];
}
Hc.inherits(we, Qs);
we.create = function(e, t) {
  var n = new this();
  t = t || {};
  for (var a in t)
    n[a] = t[a];
  n.source = e;
  var o = e.emit;
  return e.emit = function() {
    return n._handleEmit(arguments), o.apply(e, arguments);
  }, e.on("error", function() {
  }), n.pauseStream && e.pause(), n;
};
Object.defineProperty(we.prototype, "readable", {
  configurable: !0,
  enumerable: !0,
  get: function() {
    return this.source.readable;
  }
});
we.prototype.setEncoding = function() {
  return this.source.setEncoding.apply(this.source, arguments);
};
we.prototype.resume = function() {
  this._released || this.release(), this.source.resume();
};
we.prototype.pause = function() {
  this.source.pause();
};
we.prototype.release = function() {
  this._released = !0, this._bufferedEvents.forEach((function(e) {
    this.emit.apply(this, e);
  }).bind(this)), this._bufferedEvents = [];
};
we.prototype.pipe = function() {
  var e = Qs.prototype.pipe.apply(this, arguments);
  return this.resume(), e;
};
we.prototype._handleEmit = function(e) {
  if (this._released) {
    this.emit.apply(this, e);
    return;
  }
  e[0] === "data" && (this.dataSize += e[1].length, this._checkIfMaxDataSizeExceeded()), this._bufferedEvents.push(e);
};
we.prototype._checkIfMaxDataSizeExceeded = function() {
  if (!this._maxDataSizeExceeded && !(this.dataSize <= this.maxDataSize)) {
    this._maxDataSizeExceeded = !0;
    var e = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
    this.emit("error", new Error(e));
  }
};
var Vc = Ue, ei = le.Stream, xo = Wc, Gc = Y;
function Y() {
  this.writable = !1, this.readable = !0, this.dataSize = 0, this.maxDataSize = 2 * 1024 * 1024, this.pauseStreams = !0, this._released = !1, this._streams = [], this._currentStream = null, this._insideLoop = !1, this._pendingNext = !1;
}
Vc.inherits(Y, ei);
Y.create = function(e) {
  var t = new this();
  e = e || {};
  for (var n in e)
    t[n] = e[n];
  return t;
};
Y.isStreamLike = function(e) {
  return typeof e != "function" && typeof e != "string" && typeof e != "boolean" && typeof e != "number" && !Buffer.isBuffer(e);
};
Y.prototype.append = function(e) {
  var t = Y.isStreamLike(e);
  if (t) {
    if (!(e instanceof xo)) {
      var n = xo.create(e, {
        maxDataSize: 1 / 0,
        pauseStream: this.pauseStreams
      });
      e.on("data", this._checkDataSize.bind(this)), e = n;
    }
    this._handleErrors(e), this.pauseStreams && e.pause();
  }
  return this._streams.push(e), this;
};
Y.prototype.pipe = function(e, t) {
  return ei.prototype.pipe.call(this, e, t), this.resume(), e;
};
Y.prototype._getNext = function() {
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
Y.prototype._realGetNext = function() {
  var e = this._streams.shift();
  if (typeof e > "u") {
    this.end();
    return;
  }
  if (typeof e != "function") {
    this._pipeNext(e);
    return;
  }
  var t = e;
  t((function(n) {
    var a = Y.isStreamLike(n);
    a && (n.on("data", this._checkDataSize.bind(this)), this._handleErrors(n)), this._pipeNext(n);
  }).bind(this));
};
Y.prototype._pipeNext = function(e) {
  this._currentStream = e;
  var t = Y.isStreamLike(e);
  if (t) {
    e.on("end", this._getNext.bind(this)), e.pipe(this, { end: !1 });
    return;
  }
  var n = e;
  this.write(n), this._getNext();
};
Y.prototype._handleErrors = function(e) {
  var t = this;
  e.on("error", function(n) {
    t._emitError(n);
  });
};
Y.prototype.write = function(e) {
  this.emit("data", e);
};
Y.prototype.pause = function() {
  this.pauseStreams && (this.pauseStreams && this._currentStream && typeof this._currentStream.pause == "function" && this._currentStream.pause(), this.emit("pause"));
};
Y.prototype.resume = function() {
  this._released || (this._released = !0, this.writable = !0, this._getNext()), this.pauseStreams && this._currentStream && typeof this._currentStream.resume == "function" && this._currentStream.resume(), this.emit("resume");
};
Y.prototype.end = function() {
  this._reset(), this.emit("end");
};
Y.prototype.destroy = function() {
  this._reset(), this.emit("close");
};
Y.prototype._reset = function() {
  this.writable = !1, this._streams = [], this._currentStream = null;
};
Y.prototype._checkDataSize = function() {
  if (this._updateDataSize(), !(this.dataSize <= this.maxDataSize)) {
    var e = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
    this._emitError(new Error(e));
  }
};
Y.prototype._updateDataSize = function() {
  this.dataSize = 0;
  var e = this;
  this._streams.forEach(function(t) {
    t.dataSize && (e.dataSize += t.dataSize);
  }), this._currentStream && this._currentStream.dataSize && (this.dataSize += this._currentStream.dataSize);
};
Y.prototype._emitError = function(e) {
  this._reset(), this.emit("error", e);
};
var ti = {};
const Kc = {
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
var Jc = Kc;
/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
(function(e) {
  var t = Jc, n = Us.extname, a = /^\s*([^;\s]*)(?:;|\s|$)/, o = /^text\//i;
  e.charset = s, e.charsets = { lookup: s }, e.contentType = i, e.extension = r, e.extensions = /* @__PURE__ */ Object.create(null), e.lookup = c, e.types = /* @__PURE__ */ Object.create(null), p(e.extensions, e.types);
  function s(l) {
    if (!l || typeof l != "string")
      return !1;
    var u = a.exec(l), d = u && t[u[1].toLowerCase()];
    return d && d.charset ? d.charset : u && o.test(u[1]) ? "UTF-8" : !1;
  }
  function i(l) {
    if (!l || typeof l != "string")
      return !1;
    var u = l.indexOf("/") === -1 ? e.lookup(l) : l;
    if (!u)
      return !1;
    if (u.indexOf("charset") === -1) {
      var d = e.charset(u);
      d && (u += "; charset=" + d.toLowerCase());
    }
    return u;
  }
  function r(l) {
    if (!l || typeof l != "string")
      return !1;
    var u = a.exec(l), d = u && e.extensions[u[1].toLowerCase()];
    return !d || !d.length ? !1 : d[0];
  }
  function c(l) {
    if (!l || typeof l != "string")
      return !1;
    var u = n("x." + l).toLowerCase().substr(1);
    return u && e.types[u] || !1;
  }
  function p(l, u) {
    var d = ["nginx", "apache", void 0, "iana"];
    Object.keys(t).forEach(function(g) {
      var x = t[g], v = x.extensions;
      if (!(!v || !v.length)) {
        l[g] = v;
        for (var h = 0; h < v.length; h++) {
          var b = v[h];
          if (u[b]) {
            var k = d.indexOf(t[u[b]].source), E = d.indexOf(x.source);
            if (u[b] !== "application/octet-stream" && (k > E || k === E && u[b].substr(0, 12) === "application/"))
              continue;
          }
          u[b] = g;
        }
      }
    });
  }
})(ti);
var Xc = Yc;
function Yc(e) {
  var t = typeof setImmediate == "function" ? setImmediate : typeof process == "object" && typeof process.nextTick == "function" ? process.nextTick : null;
  t ? t(e) : setTimeout(e, 0);
}
var vo = Xc, ni = Zc;
function Zc(e) {
  var t = !1;
  return vo(function() {
    t = !0;
  }), function(a, o) {
    t ? e(a, o) : vo(function() {
      e(a, o);
    });
  };
}
var ai = Qc;
function Qc(e) {
  Object.keys(e.jobs).forEach(el.bind(e)), e.jobs = {};
}
function el(e) {
  typeof this.jobs[e] == "function" && this.jobs[e]();
}
var bo = ni, tl = ai, oi = nl;
function nl(e, t, n, a) {
  var o = n.keyedList ? n.keyedList[n.index] : n.index;
  n.jobs[o] = al(t, o, e[o], function(s, i) {
    o in n.jobs && (delete n.jobs[o], s ? tl(n) : n.results[o] = i, a(s, n.results));
  });
}
function al(e, t, n, a) {
  var o;
  return e.length == 2 ? o = e(n, bo(a)) : o = e(n, t, bo(a)), o;
}
var si = ol;
function ol(e, t) {
  var n = !Array.isArray(e), a = {
    index: 0,
    keyedList: n || t ? Object.keys(e) : null,
    jobs: {},
    results: n ? {} : [],
    size: n ? Object.keys(e).length : e.length
  };
  return t && a.keyedList.sort(n ? t : function(o, s) {
    return t(e[o], e[s]);
  }), a;
}
var sl = ai, il = ni, ii = rl;
function rl(e) {
  Object.keys(this.jobs).length && (this.index = this.size, sl(this), il(e)(null, this.results));
}
var cl = oi, ll = si, pl = ii, ul = dl;
function dl(e, t, n) {
  for (var a = ll(e); a.index < (a.keyedList || e).length; )
    cl(e, t, a, function(o, s) {
      if (o) {
        n(o, s);
        return;
      }
      if (Object.keys(a.jobs).length === 0) {
        n(null, a.results);
        return;
      }
    }), a.index++;
  return pl.bind(a, n);
}
var dn = { exports: {} }, yo = oi, ml = si, fl = ii;
dn.exports = hl;
dn.exports.ascending = ri;
dn.exports.descending = gl;
function hl(e, t, n, a) {
  var o = ml(e, n);
  return yo(e, t, o, function s(i, r) {
    if (i) {
      a(i, r);
      return;
    }
    if (o.index++, o.index < (o.keyedList || e).length) {
      yo(e, t, o, s);
      return;
    }
    a(null, o.results);
  }), fl.bind(o, a);
}
function ri(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
}
function gl(e, t) {
  return -1 * ri(e, t);
}
var ci = dn.exports, xl = ci, vl = bl;
function bl(e, t, n) {
  return xl(e, t, null, n);
}
var yl = {
  parallel: ul,
  serial: vl,
  serialOrdered: ci
}, li = Object, wl = Error, kl = EvalError, Sl = RangeError, El = ReferenceError, _l = SyntaxError, qa = TypeError, Tl = URIError, Al = Math.abs, Cl = Math.floor, Rl = Math.max, Ol = Math.min, Ll = Math.pow, Pl = Math.round, jl = Number.isNaN || function(t) {
  return t !== t;
}, Dl = jl, Nl = function(t) {
  return Dl(t) || t === 0 ? t : t < 0 ? -1 : 1;
}, Il = Object.getOwnPropertyDescriptor, $t = Il;
if ($t)
  try {
    $t([], "length");
  } catch {
    $t = null;
  }
var pi = $t, zt = Object.defineProperty || !1;
if (zt)
  try {
    zt({}, "a", { value: 1 });
  } catch {
    zt = !1;
  }
var ql = zt, Pn, wo;
function ui() {
  return wo || (wo = 1, Pn = function() {
    if (typeof Symbol != "function" || typeof Object.getOwnPropertySymbols != "function")
      return !1;
    if (typeof Symbol.iterator == "symbol")
      return !0;
    var t = {}, n = Symbol("test"), a = Object(n);
    if (typeof n == "string" || Object.prototype.toString.call(n) !== "[object Symbol]" || Object.prototype.toString.call(a) !== "[object Symbol]")
      return !1;
    var o = 42;
    t[n] = o;
    for (var s in t)
      return !1;
    if (typeof Object.keys == "function" && Object.keys(t).length !== 0 || typeof Object.getOwnPropertyNames == "function" && Object.getOwnPropertyNames(t).length !== 0)
      return !1;
    var i = Object.getOwnPropertySymbols(t);
    if (i.length !== 1 || i[0] !== n || !Object.prototype.propertyIsEnumerable.call(t, n))
      return !1;
    if (typeof Object.getOwnPropertyDescriptor == "function") {
      var r = (
        /** @type {PropertyDescriptor} */
        Object.getOwnPropertyDescriptor(t, n)
      );
      if (r.value !== o || r.enumerable !== !0)
        return !1;
    }
    return !0;
  }), Pn;
}
var jn, ko;
function Fl() {
  if (ko) return jn;
  ko = 1;
  var e = typeof Symbol < "u" && Symbol, t = ui();
  return jn = function() {
    return typeof e != "function" || typeof Symbol != "function" || typeof e("foo") != "symbol" || typeof Symbol("bar") != "symbol" ? !1 : t();
  }, jn;
}
var Dn, So;
function di() {
  return So || (So = 1, Dn = typeof Reflect < "u" && Reflect.getPrototypeOf || null), Dn;
}
var Nn, Eo;
function mi() {
  if (Eo) return Nn;
  Eo = 1;
  var e = li;
  return Nn = e.getPrototypeOf || null, Nn;
}
var Ul = "Function.prototype.bind called on incompatible ", Ml = Object.prototype.toString, Bl = Math.max, $l = "[object Function]", _o = function(t, n) {
  for (var a = [], o = 0; o < t.length; o += 1)
    a[o] = t[o];
  for (var s = 0; s < n.length; s += 1)
    a[s + t.length] = n[s];
  return a;
}, zl = function(t, n) {
  for (var a = [], o = n, s = 0; o < t.length; o += 1, s += 1)
    a[s] = t[o];
  return a;
}, Hl = function(e, t) {
  for (var n = "", a = 0; a < e.length; a += 1)
    n += e[a], a + 1 < e.length && (n += t);
  return n;
}, Wl = function(t) {
  var n = this;
  if (typeof n != "function" || Ml.apply(n) !== $l)
    throw new TypeError(Ul + n);
  for (var a = zl(arguments, 1), o, s = function() {
    if (this instanceof o) {
      var l = n.apply(
        this,
        _o(a, arguments)
      );
      return Object(l) === l ? l : this;
    }
    return n.apply(
      t,
      _o(a, arguments)
    );
  }, i = Bl(0, n.length - a.length), r = [], c = 0; c < i; c++)
    r[c] = "$" + c;
  if (o = Function("binder", "return function (" + Hl(r, ",") + "){ return binder.apply(this,arguments); }")(s), n.prototype) {
    var p = function() {
    };
    p.prototype = n.prototype, o.prototype = new p(), p.prototype = null;
  }
  return o;
}, Vl = Wl, mn = Function.prototype.bind || Vl, In, To;
function Fa() {
  return To || (To = 1, In = Function.prototype.call), In;
}
var qn, Ao;
function fi() {
  return Ao || (Ao = 1, qn = Function.prototype.apply), qn;
}
var Fn, Co;
function Gl() {
  return Co || (Co = 1, Fn = typeof Reflect < "u" && Reflect && Reflect.apply), Fn;
}
var Un, Ro;
function Kl() {
  if (Ro) return Un;
  Ro = 1;
  var e = mn, t = fi(), n = Fa(), a = Gl();
  return Un = a || e.call(n, t), Un;
}
var Mn, Oo;
function Jl() {
  if (Oo) return Mn;
  Oo = 1;
  var e = mn, t = qa, n = Fa(), a = Kl();
  return Mn = function(s) {
    if (s.length < 1 || typeof s[0] != "function")
      throw new t("a function is required");
    return a(e, n, s);
  }, Mn;
}
var Bn, Lo;
function Xl() {
  if (Lo) return Bn;
  Lo = 1;
  var e = Jl(), t = pi, n;
  try {
    n = /** @type {{ __proto__?: typeof Array.prototype }} */
    [].__proto__ === Array.prototype;
  } catch (i) {
    if (!i || typeof i != "object" || !("code" in i) || i.code !== "ERR_PROTO_ACCESS")
      throw i;
  }
  var a = !!n && t && t(
    Object.prototype,
    /** @type {keyof typeof Object.prototype} */
    "__proto__"
  ), o = Object, s = o.getPrototypeOf;
  return Bn = a && typeof a.get == "function" ? e([a.get]) : typeof s == "function" ? (
    /** @type {import('./get')} */
    function(r) {
      return s(r == null ? r : o(r));
    }
  ) : !1, Bn;
}
var $n, Po;
function Yl() {
  if (Po) return $n;
  Po = 1;
  var e = di(), t = mi(), n = Xl();
  return $n = e ? function(o) {
    return e(o);
  } : t ? function(o) {
    if (!o || typeof o != "object" && typeof o != "function")
      throw new TypeError("getProto: not an object");
    return t(o);
  } : n ? function(o) {
    return n(o);
  } : null, $n;
}
var Zl = Function.prototype.call, Ql = Object.prototype.hasOwnProperty, ep = mn, Ua = ep.call(Zl, Ql), L, tp = li, np = wl, ap = kl, op = Sl, sp = El, Qe = _l, Je = qa, ip = Tl, rp = Al, cp = Cl, lp = Rl, pp = Ol, up = Ll, dp = Pl, mp = Nl, hi = Function, zn = function(e) {
  try {
    return hi('"use strict"; return (' + e + ").constructor;")();
  } catch {
  }
}, dt = pi, fp = ql, Hn = function() {
  throw new Je();
}, hp = dt ? function() {
  try {
    return arguments.callee, Hn;
  } catch {
    try {
      return dt(arguments, "callee").get;
    } catch {
      return Hn;
    }
  }
}() : Hn, $e = Fl()(), oe = Yl(), gp = mi(), xp = di(), gi = fi(), kt = Fa(), We = {}, vp = typeof Uint8Array > "u" || !oe ? L : oe(Uint8Array), Pe = {
  __proto__: null,
  "%AggregateError%": typeof AggregateError > "u" ? L : AggregateError,
  "%Array%": Array,
  "%ArrayBuffer%": typeof ArrayBuffer > "u" ? L : ArrayBuffer,
  "%ArrayIteratorPrototype%": $e && oe ? oe([][Symbol.iterator]()) : L,
  "%AsyncFromSyncIteratorPrototype%": L,
  "%AsyncFunction%": We,
  "%AsyncGenerator%": We,
  "%AsyncGeneratorFunction%": We,
  "%AsyncIteratorPrototype%": We,
  "%Atomics%": typeof Atomics > "u" ? L : Atomics,
  "%BigInt%": typeof BigInt > "u" ? L : BigInt,
  "%BigInt64Array%": typeof BigInt64Array > "u" ? L : BigInt64Array,
  "%BigUint64Array%": typeof BigUint64Array > "u" ? L : BigUint64Array,
  "%Boolean%": Boolean,
  "%DataView%": typeof DataView > "u" ? L : DataView,
  "%Date%": Date,
  "%decodeURI%": decodeURI,
  "%decodeURIComponent%": decodeURIComponent,
  "%encodeURI%": encodeURI,
  "%encodeURIComponent%": encodeURIComponent,
  "%Error%": np,
  "%eval%": eval,
  // eslint-disable-line no-eval
  "%EvalError%": ap,
  "%Float16Array%": typeof Float16Array > "u" ? L : Float16Array,
  "%Float32Array%": typeof Float32Array > "u" ? L : Float32Array,
  "%Float64Array%": typeof Float64Array > "u" ? L : Float64Array,
  "%FinalizationRegistry%": typeof FinalizationRegistry > "u" ? L : FinalizationRegistry,
  "%Function%": hi,
  "%GeneratorFunction%": We,
  "%Int8Array%": typeof Int8Array > "u" ? L : Int8Array,
  "%Int16Array%": typeof Int16Array > "u" ? L : Int16Array,
  "%Int32Array%": typeof Int32Array > "u" ? L : Int32Array,
  "%isFinite%": isFinite,
  "%isNaN%": isNaN,
  "%IteratorPrototype%": $e && oe ? oe(oe([][Symbol.iterator]())) : L,
  "%JSON%": typeof JSON == "object" ? JSON : L,
  "%Map%": typeof Map > "u" ? L : Map,
  "%MapIteratorPrototype%": typeof Map > "u" || !$e || !oe ? L : oe((/* @__PURE__ */ new Map())[Symbol.iterator]()),
  "%Math%": Math,
  "%Number%": Number,
  "%Object%": tp,
  "%Object.getOwnPropertyDescriptor%": dt,
  "%parseFloat%": parseFloat,
  "%parseInt%": parseInt,
  "%Promise%": typeof Promise > "u" ? L : Promise,
  "%Proxy%": typeof Proxy > "u" ? L : Proxy,
  "%RangeError%": op,
  "%ReferenceError%": sp,
  "%Reflect%": typeof Reflect > "u" ? L : Reflect,
  "%RegExp%": RegExp,
  "%Set%": typeof Set > "u" ? L : Set,
  "%SetIteratorPrototype%": typeof Set > "u" || !$e || !oe ? L : oe((/* @__PURE__ */ new Set())[Symbol.iterator]()),
  "%SharedArrayBuffer%": typeof SharedArrayBuffer > "u" ? L : SharedArrayBuffer,
  "%String%": String,
  "%StringIteratorPrototype%": $e && oe ? oe(""[Symbol.iterator]()) : L,
  "%Symbol%": $e ? Symbol : L,
  "%SyntaxError%": Qe,
  "%ThrowTypeError%": hp,
  "%TypedArray%": vp,
  "%TypeError%": Je,
  "%Uint8Array%": typeof Uint8Array > "u" ? L : Uint8Array,
  "%Uint8ClampedArray%": typeof Uint8ClampedArray > "u" ? L : Uint8ClampedArray,
  "%Uint16Array%": typeof Uint16Array > "u" ? L : Uint16Array,
  "%Uint32Array%": typeof Uint32Array > "u" ? L : Uint32Array,
  "%URIError%": ip,
  "%WeakMap%": typeof WeakMap > "u" ? L : WeakMap,
  "%WeakRef%": typeof WeakRef > "u" ? L : WeakRef,
  "%WeakSet%": typeof WeakSet > "u" ? L : WeakSet,
  "%Function.prototype.call%": kt,
  "%Function.prototype.apply%": gi,
  "%Object.defineProperty%": fp,
  "%Object.getPrototypeOf%": gp,
  "%Math.abs%": rp,
  "%Math.floor%": cp,
  "%Math.max%": lp,
  "%Math.min%": pp,
  "%Math.pow%": up,
  "%Math.round%": dp,
  "%Math.sign%": mp,
  "%Reflect.getPrototypeOf%": xp
};
if (oe)
  try {
    null.error;
  } catch (e) {
    var bp = oe(oe(e));
    Pe["%Error.prototype%"] = bp;
  }
var yp = function e(t) {
  var n;
  if (t === "%AsyncFunction%")
    n = zn("async function () {}");
  else if (t === "%GeneratorFunction%")
    n = zn("function* () {}");
  else if (t === "%AsyncGeneratorFunction%")
    n = zn("async function* () {}");
  else if (t === "%AsyncGenerator%") {
    var a = e("%AsyncGeneratorFunction%");
    a && (n = a.prototype);
  } else if (t === "%AsyncIteratorPrototype%") {
    var o = e("%AsyncGenerator%");
    o && oe && (n = oe(o.prototype));
  }
  return Pe[t] = n, n;
}, jo = {
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
}, St = mn, Kt = Ua, wp = St.call(kt, Array.prototype.concat), kp = St.call(gi, Array.prototype.splice), Do = St.call(kt, String.prototype.replace), Jt = St.call(kt, String.prototype.slice), Sp = St.call(kt, RegExp.prototype.exec), Ep = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, _p = /\\(\\)?/g, Tp = function(t) {
  var n = Jt(t, 0, 1), a = Jt(t, -1);
  if (n === "%" && a !== "%")
    throw new Qe("invalid intrinsic syntax, expected closing `%`");
  if (a === "%" && n !== "%")
    throw new Qe("invalid intrinsic syntax, expected opening `%`");
  var o = [];
  return Do(t, Ep, function(s, i, r, c) {
    o[o.length] = r ? Do(c, _p, "$1") : i || s;
  }), o;
}, Ap = function(t, n) {
  var a = t, o;
  if (Kt(jo, a) && (o = jo[a], a = "%" + o[0] + "%"), Kt(Pe, a)) {
    var s = Pe[a];
    if (s === We && (s = yp(a)), typeof s > "u" && !n)
      throw new Je("intrinsic " + t + " exists, but is not available. Please file an issue!");
    return {
      alias: o,
      name: a,
      value: s
    };
  }
  throw new Qe("intrinsic " + t + " does not exist!");
}, Cp = function(t, n) {
  if (typeof t != "string" || t.length === 0)
    throw new Je("intrinsic name must be a non-empty string");
  if (arguments.length > 1 && typeof n != "boolean")
    throw new Je('"allowMissing" argument must be a boolean');
  if (Sp(/^%?[^%]*%?$/, t) === null)
    throw new Qe("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
  var a = Tp(t), o = a.length > 0 ? a[0] : "", s = Ap("%" + o + "%", n), i = s.name, r = s.value, c = !1, p = s.alias;
  p && (o = p[0], kp(a, wp([0, 1], p)));
  for (var l = 1, u = !0; l < a.length; l += 1) {
    var d = a[l], f = Jt(d, 0, 1), g = Jt(d, -1);
    if ((f === '"' || f === "'" || f === "`" || g === '"' || g === "'" || g === "`") && f !== g)
      throw new Qe("property names with quotes must have matching quotes");
    if ((d === "constructor" || !u) && (c = !0), o += "." + d, i = "%" + o + "%", Kt(Pe, i))
      r = Pe[i];
    else if (r != null) {
      if (!(d in r)) {
        if (!n)
          throw new Je("base intrinsic for " + t + " exists, but the property is not available.");
        return;
      }
      if (dt && l + 1 >= a.length) {
        var x = dt(r, d);
        u = !!x, u && "get" in x && !("originalValue" in x.get) ? r = x.get : r = r[d];
      } else
        u = Kt(r, d), r = r[d];
      u && !c && (Pe[i] = r);
    }
  }
  return r;
}, Wn, No;
function Rp() {
  if (No) return Wn;
  No = 1;
  var e = ui();
  return Wn = function() {
    return e() && !!Symbol.toStringTag;
  }, Wn;
}
var Op = Cp, Io = Op("%Object.defineProperty%", !0), Lp = Rp()(), Pp = Ua, jp = qa, Ct = Lp ? Symbol.toStringTag : null, Dp = function(t, n) {
  var a = arguments.length > 2 && !!arguments[2] && arguments[2].force, o = arguments.length > 2 && !!arguments[2] && arguments[2].nonConfigurable;
  if (typeof a < "u" && typeof a != "boolean" || typeof o < "u" && typeof o != "boolean")
    throw new jp("if provided, the `overrideIfSet` and `nonConfigurable` options must be booleans");
  Ct && (a || !Pp(t, Ct)) && (Io ? Io(t, Ct, {
    configurable: !o,
    enumerable: !1,
    value: n,
    writable: !1
  }) : t[Ct] = n);
}, Np = function(e, t) {
  return Object.keys(t).forEach(function(n) {
    e[n] = e[n] || t[n];
  }), e;
}, Ma = Gc, Ip = Ue, Vn = Us, qp = Da, Fp = Na, Up = Ia.parse, Mp = Ir, Bp = le.Stream, $p = Ms, Gn = ti, zp = yl, Hp = Dp, Ae = Ua, ha = Np;
function N(e) {
  if (!(this instanceof N))
    return new N(e);
  this._overheadLength = 0, this._valueLength = 0, this._valuesToMeasure = [], Ma.call(this), e = e || {};
  for (var t in e)
    this[t] = e[t];
}
Ip.inherits(N, Ma);
N.LINE_BREAK = `\r
`;
N.DEFAULT_CONTENT_TYPE = "application/octet-stream";
N.prototype.append = function(e, t, n) {
  n = n || {}, typeof n == "string" && (n = { filename: n });
  var a = Ma.prototype.append.bind(this);
  if ((typeof t == "number" || t == null) && (t = String(t)), Array.isArray(t)) {
    this._error(new Error("Arrays are not supported."));
    return;
  }
  var o = this._multiPartHeader(e, t, n), s = this._multiPartFooter();
  a(o), a(t), a(s), this._trackLength(o, t, n);
};
N.prototype._trackLength = function(e, t, n) {
  var a = 0;
  n.knownLength != null ? a += Number(n.knownLength) : Buffer.isBuffer(t) ? a = t.length : typeof t == "string" && (a = Buffer.byteLength(t)), this._valueLength += a, this._overheadLength += Buffer.byteLength(e) + N.LINE_BREAK.length, !(!t || !t.path && !(t.readable && Ae(t, "httpVersion")) && !(t instanceof Bp)) && (n.knownLength || this._valuesToMeasure.push(t));
};
N.prototype._lengthRetriever = function(e, t) {
  Ae(e, "fd") ? e.end != null && e.end != 1 / 0 && e.start != null ? t(null, e.end + 1 - (e.start ? e.start : 0)) : Mp.stat(e.path, function(n, a) {
    if (n) {
      t(n);
      return;
    }
    var o = a.size - (e.start ? e.start : 0);
    t(null, o);
  }) : Ae(e, "httpVersion") ? t(null, Number(e.headers["content-length"])) : Ae(e, "httpModule") ? (e.on("response", function(n) {
    e.pause(), t(null, Number(n.headers["content-length"]));
  }), e.resume()) : t("Unknown stream");
};
N.prototype._multiPartHeader = function(e, t, n) {
  if (typeof n.header == "string")
    return n.header;
  var a = this._getContentDisposition(t, n), o = this._getContentType(t, n), s = "", i = {
    // add custom disposition as third element or keep it two elements if not
    "Content-Disposition": ["form-data", 'name="' + e + '"'].concat(a || []),
    // if no content type. allow it to be empty array
    "Content-Type": [].concat(o || [])
  };
  typeof n.header == "object" && ha(i, n.header);
  var r;
  for (var c in i)
    if (Ae(i, c)) {
      if (r = i[c], r == null)
        continue;
      Array.isArray(r) || (r = [r]), r.length && (s += c + ": " + r.join("; ") + N.LINE_BREAK);
    }
  return "--" + this.getBoundary() + N.LINE_BREAK + s + N.LINE_BREAK;
};
N.prototype._getContentDisposition = function(e, t) {
  var n;
  if (typeof t.filepath == "string" ? n = Vn.normalize(t.filepath).replace(/\\/g, "/") : t.filename || e && (e.name || e.path) ? n = Vn.basename(t.filename || e && (e.name || e.path)) : e && e.readable && Ae(e, "httpVersion") && (n = Vn.basename(e.client._httpMessage.path || "")), n)
    return 'filename="' + n + '"';
};
N.prototype._getContentType = function(e, t) {
  var n = t.contentType;
  return !n && e && e.name && (n = Gn.lookup(e.name)), !n && e && e.path && (n = Gn.lookup(e.path)), !n && e && e.readable && Ae(e, "httpVersion") && (n = e.headers["content-type"]), !n && (t.filepath || t.filename) && (n = Gn.lookup(t.filepath || t.filename)), !n && e && typeof e == "object" && (n = N.DEFAULT_CONTENT_TYPE), n;
};
N.prototype._multiPartFooter = function() {
  return (function(e) {
    var t = N.LINE_BREAK, n = this._streams.length === 0;
    n && (t += this._lastBoundary()), e(t);
  }).bind(this);
};
N.prototype._lastBoundary = function() {
  return "--" + this.getBoundary() + "--" + N.LINE_BREAK;
};
N.prototype.getHeaders = function(e) {
  var t, n = {
    "content-type": "multipart/form-data; boundary=" + this.getBoundary()
  };
  for (t in e)
    Ae(e, t) && (n[t.toLowerCase()] = e[t]);
  return n;
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
  for (var e = new Buffer.alloc(0), t = this.getBoundary(), n = 0, a = this._streams.length; n < a; n++)
    typeof this._streams[n] != "function" && (Buffer.isBuffer(this._streams[n]) ? e = Buffer.concat([e, this._streams[n]]) : e = Buffer.concat([e, Buffer.from(this._streams[n])]), (typeof this._streams[n] != "string" || this._streams[n].substring(2, t.length + 2) !== t) && (e = Buffer.concat([e, Buffer.from(N.LINE_BREAK)])));
  return Buffer.concat([e, Buffer.from(this._lastBoundary())]);
};
N.prototype._generateBoundary = function() {
  this._boundary = "--------------------------" + $p.randomBytes(12).toString("hex");
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
  var t = this._overheadLength + this._valueLength;
  if (this._streams.length && (t += this._lastBoundary().length), !this._valuesToMeasure.length) {
    process.nextTick(e.bind(this, null, t));
    return;
  }
  zp.parallel(this._valuesToMeasure, this._lengthRetriever, function(n, a) {
    if (n) {
      e(n);
      return;
    }
    a.forEach(function(o) {
      t += o;
    }), e(null, t);
  });
};
N.prototype.submit = function(e, t) {
  var n, a, o = { method: "post" };
  return typeof e == "string" ? (e = Up(e), a = ha({
    port: e.port,
    path: e.pathname,
    host: e.hostname,
    protocol: e.protocol
  }, o)) : (a = ha(e, o), a.port || (a.port = a.protocol === "https:" ? 443 : 80)), a.headers = this.getHeaders(e.headers), a.protocol === "https:" ? n = Fp.request(a) : n = qp.request(a), this.getLength((function(s, i) {
    if (s && s !== "Unknown stream") {
      this._error(s);
      return;
    }
    if (i && n.setHeader("Content-Length", i), this.pipe(n), t) {
      var r, c = function(p, l) {
        return n.removeListener("error", c), n.removeListener("response", r), t.call(this, p, l);
      };
      r = c.bind(this, null), n.on("error", c), n.on("response", r);
    }
  }).bind(this)), n;
};
N.prototype._error = function(e) {
  this.error || (this.error = e, this.pause(), this.emit("error", e));
};
N.prototype.toString = function() {
  return "[object FormData]";
};
Hp(N.prototype, "FormData");
var Wp = N;
const fn = /* @__PURE__ */ Zs(Wp);
function ga(e) {
  return m.isPlainObject(e) || m.isArray(e);
}
function xi(e) {
  return m.endsWith(e, "[]") ? e.slice(0, -2) : e;
}
function Kn(e, t, n) {
  return e ? e.concat(t).map(function(o, s) {
    return o = xi(o), !n && s ? "[" + o + "]" : o;
  }).join(n ? "." : "") : t;
}
function Vp(e) {
  return m.isArray(e) && !e.some(ga);
}
const Gp = m.toFlatObject(m, {}, null, function(t) {
  return /^is[A-Z]/.test(t);
});
function hn(e, t, n) {
  if (!m.isObject(e))
    throw new TypeError("target must be an object");
  t = t || new (fn || FormData)(), n = m.toFlatObject(
    n,
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
  const a = n.metaTokens, o = n.visitor || u, s = n.dots, i = n.indexes, r = n.Blob || typeof Blob < "u" && Blob, c = n.maxDepth === void 0 ? 100 : n.maxDepth, p = r && m.isSpecCompliantForm(t);
  if (!m.isFunction(o))
    throw new TypeError("visitor must be a function");
  function l(x) {
    if (x === null) return "";
    if (m.isDate(x))
      return x.toISOString();
    if (m.isBoolean(x))
      return x.toString();
    if (!p && m.isBlob(x))
      throw new y("Blob is not supported. Use a Buffer instead.");
    return m.isArrayBuffer(x) || m.isTypedArray(x) ? p && typeof Blob == "function" ? new Blob([x]) : Buffer.from(x) : x;
  }
  function u(x, v, h) {
    let b = x;
    if (m.isReactNative(t) && m.isReactNativeBlob(x))
      return t.append(Kn(h, v, s), l(x)), !1;
    if (x && !h && typeof x == "object") {
      if (m.endsWith(v, "{}"))
        v = a ? v : v.slice(0, -2), x = JSON.stringify(x);
      else if (m.isArray(x) && Vp(x) || (m.isFileList(x) || m.endsWith(v, "[]")) && (b = m.toArray(x)))
        return v = xi(v), b.forEach(function(E, _) {
          !(m.isUndefined(E) || E === null) && t.append(
            // eslint-disable-next-line no-nested-ternary
            i === !0 ? Kn([v], _, s) : i === null ? v : v + "[]",
            l(E)
          );
        }), !1;
    }
    return ga(x) ? !0 : (t.append(Kn(h, v, s), l(x)), !1);
  }
  const d = [], f = Object.assign(Gp, {
    defaultVisitor: u,
    convertValue: l,
    isVisitable: ga
  });
  function g(x, v, h = 0) {
    if (!m.isUndefined(x)) {
      if (h > c)
        throw new y(
          "Object is too deeply nested (" + h + " levels). Max depth: " + c,
          y.ERR_FORM_DATA_DEPTH_EXCEEDED
        );
      if (d.indexOf(x) !== -1)
        throw Error("Circular reference detected in " + v.join("."));
      d.push(x), m.forEach(x, function(k, E) {
        (!(m.isUndefined(k) || k === null) && o.call(t, k, m.isString(E) ? E.trim() : E, v, f)) === !0 && g(k, v ? v.concat(E) : [E], h + 1);
      }), d.pop();
    }
  }
  if (!m.isObject(e))
    throw new TypeError("data must be an object");
  return g(e), t;
}
function qo(e) {
  const t = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+"
  };
  return encodeURIComponent(e).replace(/[!'()~]|%20/g, function(a) {
    return t[a];
  });
}
function vi(e, t) {
  this._pairs = [], e && hn(e, this, t);
}
const bi = vi.prototype;
bi.append = function(t, n) {
  this._pairs.push([t, n]);
};
bi.toString = function(t) {
  const n = t ? function(a) {
    return t.call(this, a, qo);
  } : qo;
  return this._pairs.map(function(o) {
    return n(o[0]) + "=" + n(o[1]);
  }, "").join("&");
};
function Kp(e) {
  return encodeURIComponent(e).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
}
function Ba(e, t, n) {
  if (!t)
    return e;
  const a = n && n.encode || Kp, o = m.isFunction(n) ? {
    serialize: n
  } : n, s = o && o.serialize;
  let i;
  if (s ? i = s(t, o) : i = m.isURLSearchParams(t) ? t.toString() : new vi(t, o).toString(a), i) {
    const r = e.indexOf("#");
    r !== -1 && (e = e.slice(0, r)), e += (e.indexOf("?") === -1 ? "?" : "&") + i;
  }
  return e;
}
class Fo {
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
  use(t, n, a) {
    return this.handlers.push({
      fulfilled: t,
      rejected: n,
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
  eject(t) {
    this.handlers[t] && (this.handlers[t] = null);
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
  forEach(t) {
    m.forEach(this.handlers, function(a) {
      a !== null && t(a);
    });
  }
}
const gn = {
  silentJSONParsing: !0,
  forcedJSONParsing: !0,
  clarifyTimeoutError: !1,
  legacyInterceptorReqResOrdering: !0
}, Jp = Ia.URLSearchParams, Jn = "abcdefghijklmnopqrstuvwxyz", Uo = "0123456789", yi = {
  DIGIT: Uo,
  ALPHA: Jn,
  ALPHA_DIGIT: Jn + Jn.toUpperCase() + Uo
}, Xp = (e = 16, t = yi.ALPHA_DIGIT) => {
  let n = "";
  const { length: a } = t, o = new Uint32Array(e);
  Ms.randomFillSync(o);
  for (let s = 0; s < e; s++)
    n += t[o[s] % a];
  return n;
}, Yp = {
  isNode: !0,
  classes: {
    URLSearchParams: Jp,
    FormData: fn,
    Blob: typeof Blob < "u" && Blob || null
  },
  ALPHABET: yi,
  generateString: Xp,
  protocols: ["http", "https", "file", "data"]
}, $a = typeof window < "u" && typeof document < "u", xa = typeof navigator == "object" && navigator || void 0, Zp = $a && (!xa || ["ReactNative", "NativeScript", "NS"].indexOf(xa.product) < 0), Qp = typeof WorkerGlobalScope < "u" && // eslint-disable-next-line no-undef
self instanceof WorkerGlobalScope && typeof self.importScripts == "function", eu = $a && window.location.href || "http://localhost", tu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  hasBrowserEnv: $a,
  hasStandardBrowserEnv: Zp,
  hasStandardBrowserWebWorkerEnv: Qp,
  navigator: xa,
  origin: eu
}, Symbol.toStringTag, { value: "Module" })), X = {
  ...tu,
  ...Yp
};
function nu(e, t) {
  return hn(e, new X.classes.URLSearchParams(), {
    visitor: function(n, a, o, s) {
      return X.isNode && m.isBuffer(n) ? (this.append(a, n.toString("base64")), !1) : s.defaultVisitor.apply(this, arguments);
    },
    ...t
  });
}
function au(e) {
  return m.matchAll(/\w+|\[(\w*)]/g, e).map((t) => t[0] === "[]" ? "" : t[1] || t[0]);
}
function ou(e) {
  const t = {}, n = Object.keys(e);
  let a;
  const o = n.length;
  let s;
  for (a = 0; a < o; a++)
    s = n[a], t[s] = e[s];
  return t;
}
function wi(e) {
  function t(n, a, o, s) {
    let i = n[s++];
    if (i === "__proto__") return !0;
    const r = Number.isFinite(+i), c = s >= n.length;
    return i = !i && m.isArray(o) ? o.length : i, c ? (m.hasOwnProp(o, i) ? o[i] = m.isArray(o[i]) ? o[i].concat(a) : [o[i], a] : o[i] = a, !r) : ((!o[i] || !m.isObject(o[i])) && (o[i] = []), t(n, a, o[i], s) && m.isArray(o[i]) && (o[i] = ou(o[i])), !r);
  }
  if (m.isFormData(e) && m.isFunction(e.entries)) {
    const n = {};
    return m.forEachEntry(e, (a, o) => {
      t(au(a), o, n, 0);
    }), n;
  }
  return null;
}
const ze = (e, t) => e != null && m.hasOwnProp(e, t) ? e[t] : void 0;
function su(e, t, n) {
  if (m.isString(e))
    try {
      return (t || JSON.parse)(e), m.trim(e);
    } catch (a) {
      if (a.name !== "SyntaxError")
        throw a;
    }
  return (n || JSON.stringify)(e);
}
const Et = {
  transitional: gn,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [
    function(t, n) {
      const a = n.getContentType() || "", o = a.indexOf("application/json") > -1, s = m.isObject(t);
      if (s && m.isHTMLForm(t) && (t = new FormData(t)), m.isFormData(t))
        return o ? JSON.stringify(wi(t)) : t;
      if (m.isArrayBuffer(t) || m.isBuffer(t) || m.isStream(t) || m.isFile(t) || m.isBlob(t) || m.isReadableStream(t))
        return t;
      if (m.isArrayBufferView(t))
        return t.buffer;
      if (m.isURLSearchParams(t))
        return n.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), t.toString();
      let r;
      if (s) {
        const c = ze(this, "formSerializer");
        if (a.indexOf("application/x-www-form-urlencoded") > -1)
          return nu(t, c).toString();
        if ((r = m.isFileList(t)) || a.indexOf("multipart/form-data") > -1) {
          const p = ze(this, "env"), l = p && p.FormData;
          return hn(
            r ? { "files[]": t } : t,
            l && new l(),
            c
          );
        }
      }
      return s || o ? (n.setContentType("application/json", !1), su(t)) : t;
    }
  ],
  transformResponse: [
    function(t) {
      const n = ze(this, "transitional") || Et.transitional, a = n && n.forcedJSONParsing, o = ze(this, "responseType"), s = o === "json";
      if (m.isResponse(t) || m.isReadableStream(t))
        return t;
      if (t && m.isString(t) && (a && !o || s)) {
        const r = !(n && n.silentJSONParsing) && s;
        try {
          return JSON.parse(t, ze(this, "parseReviver"));
        } catch (c) {
          if (r)
            throw c.name === "SyntaxError" ? y.from(c, y.ERR_BAD_RESPONSE, this, null, ze(this, "response")) : c;
        }
      }
      return t;
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
    FormData: X.classes.FormData,
    Blob: X.classes.Blob
  },
  validateStatus: function(t) {
    return t >= 200 && t < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": void 0
    }
  }
};
m.forEach(["delete", "get", "head", "post", "put", "patch", "query"], (e) => {
  Et.headers[e] = {};
});
function Xn(e, t) {
  const n = this || Et, a = t || n, o = se.from(a.headers);
  let s = a.data;
  return m.forEach(e, function(r) {
    s = r.call(n, s, o.normalize(), t ? t.status : void 0);
  }), o.normalize(), s;
}
function ki(e) {
  return !!(e && e.__CANCEL__);
}
let Ne = class extends y {
  /**
   * A `CanceledError` is an object that is thrown when an operation is canceled.
   *
   * @param {string=} message The message.
   * @param {Object=} config The config.
   * @param {Object=} request The request.
   *
   * @returns {CanceledError} The created error.
   */
  constructor(t, n, a) {
    super(t ?? "canceled", y.ERR_CANCELED, n, a), this.name = "CanceledError", this.__CANCEL__ = !0;
  }
};
function Ge(e, t, n) {
  const a = n.config.validateStatus;
  !n.status || !a || a(n.status) ? e(n) : t(new y(
    "Request failed with status code " + n.status,
    n.status >= 400 && n.status < 500 ? y.ERR_BAD_REQUEST : y.ERR_BAD_RESPONSE,
    n.config,
    n.request,
    n
  ));
}
function iu(e) {
  return typeof e != "string" ? !1 : /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
}
function ru(e, t) {
  return t ? e.replace(/\/?\/$/, "") + "/" + t.replace(/^\/+/, "") : e;
}
function za(e, t, n) {
  let a = !iu(t);
  return e && (a || n === !1) ? ru(e, t) : t;
}
var cu = {
  ftp: 21,
  gopher: 70,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443
};
function lu(e) {
  try {
    return new URL(e);
  } catch {
    return null;
  }
}
function pu(e) {
  var t = (typeof e == "string" ? lu(e) : e) || {}, n = t.protocol, a = t.host, o = t.port;
  if (typeof a != "string" || !a || typeof n != "string" || (n = n.split(":", 1)[0], a = a.replace(/:\d*$/, ""), o = parseInt(o) || cu[n] || 0, !uu(a, o)))
    return "";
  var s = va(n + "_proxy") || va("all_proxy");
  return s && s.indexOf("://") === -1 && (s = n + "://" + s), s;
}
function uu(e, t) {
  var n = va("no_proxy").toLowerCase();
  return n ? n === "*" ? !1 : n.split(/[,\s]/).every(function(a) {
    if (!a)
      return !0;
    var o = a.match(/^(.+):(\d+)$/), s = o ? o[1] : a, i = o ? parseInt(o[2]) : 0;
    return i && i !== t ? !0 : /^[.*]/.test(s) ? (s.charAt(0) === "*" && (s = s.slice(1)), !e.endsWith(s)) : e !== s;
  }) : !0;
}
function va(e) {
  return process.env[e.toLowerCase()] || process.env[e.toUpperCase()] || "";
}
var Ha = { exports: {} }, Rt = { exports: {} }, Ot = { exports: {} }, Yn, Mo;
function du() {
  if (Mo) return Yn;
  Mo = 1;
  var e = 1e3, t = e * 60, n = t * 60, a = n * 24, o = a * 7, s = a * 365.25;
  Yn = function(l, u) {
    u = u || {};
    var d = typeof l;
    if (d === "string" && l.length > 0)
      return i(l);
    if (d === "number" && isFinite(l))
      return u.long ? c(l) : r(l);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(l)
    );
  };
  function i(l) {
    if (l = String(l), !(l.length > 100)) {
      var u = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        l
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
            return d * n;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return d * t;
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
  function r(l) {
    var u = Math.abs(l);
    return u >= a ? Math.round(l / a) + "d" : u >= n ? Math.round(l / n) + "h" : u >= t ? Math.round(l / t) + "m" : u >= e ? Math.round(l / e) + "s" : l + "ms";
  }
  function c(l) {
    var u = Math.abs(l);
    return u >= a ? p(l, u, a, "day") : u >= n ? p(l, u, n, "hour") : u >= t ? p(l, u, t, "minute") : u >= e ? p(l, u, e, "second") : l + " ms";
  }
  function p(l, u, d, f) {
    var g = u >= d * 1.5;
    return Math.round(l / d) + " " + f + (g ? "s" : "");
  }
  return Yn;
}
var Zn, Bo;
function Si() {
  if (Bo) return Zn;
  Bo = 1;
  function e(t) {
    a.debug = a, a.default = a, a.coerce = p, a.disable = r, a.enable = s, a.enabled = c, a.humanize = du(), a.destroy = l, Object.keys(t).forEach((u) => {
      a[u] = t[u];
    }), a.names = [], a.skips = [], a.formatters = {};
    function n(u) {
      let d = 0;
      for (let f = 0; f < u.length; f++)
        d = (d << 5) - d + u.charCodeAt(f), d |= 0;
      return a.colors[Math.abs(d) % a.colors.length];
    }
    a.selectColor = n;
    function a(u) {
      let d, f = null, g, x;
      function v(...h) {
        if (!v.enabled)
          return;
        const b = v, k = Number(/* @__PURE__ */ new Date()), E = k - (d || k);
        b.diff = E, b.prev = d, b.curr = k, d = k, h[0] = a.coerce(h[0]), typeof h[0] != "string" && h.unshift("%O");
        let _ = 0;
        h[0] = h[0].replace(/%([a-zA-Z%])/g, (C, I) => {
          if (C === "%%")
            return "%";
          _++;
          const G = a.formatters[I];
          if (typeof G == "function") {
            const T = h[_];
            C = G.call(b, T), h.splice(_, 1), _--;
          }
          return C;
        }), a.formatArgs.call(b, h), (b.log || a.log).apply(b, h);
      }
      return v.namespace = u, v.useColors = a.useColors(), v.color = a.selectColor(u), v.extend = o, v.destroy = a.destroy, Object.defineProperty(v, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => f !== null ? f : (g !== a.namespaces && (g = a.namespaces, x = a.enabled(u)), x),
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
      let f = 0, g = 0, x = -1, v = 0;
      for (; f < u.length; )
        if (g < d.length && (d[g] === u[f] || d[g] === "*"))
          d[g] === "*" ? (x = g, v = f, g++) : (f++, g++);
        else if (x !== -1)
          g = x + 1, v++, f = v;
        else
          return !1;
      for (; g < d.length && d[g] === "*"; )
        g++;
      return g === d.length;
    }
    function r() {
      const u = [
        ...a.names,
        ...a.skips.map((d) => "-" + d)
      ].join(",");
      return a.enable(""), u;
    }
    function c(u) {
      for (const d of a.skips)
        if (i(u, d))
          return !1;
      for (const d of a.names)
        if (i(u, d))
          return !0;
      return !1;
    }
    function p(u) {
      return u instanceof Error ? u.stack || u.message : u;
    }
    function l() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return a.enable(a.load()), a;
  }
  return Zn = e, Zn;
}
var $o;
function mu() {
  return $o || ($o = 1, function(e, t) {
    t.formatArgs = a, t.save = o, t.load = s, t.useColors = n, t.storage = i(), t.destroy = /* @__PURE__ */ (() => {
      let c = !1;
      return () => {
        c || (c = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), t.colors = [
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
    function n() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let c;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (c = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(c[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function a(c) {
      if (c[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + c[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !this.useColors)
        return;
      const p = "color: " + this.color;
      c.splice(1, 0, p, "color: inherit");
      let l = 0, u = 0;
      c[0].replace(/%[a-zA-Z%]/g, (d) => {
        d !== "%%" && (l++, d === "%c" && (u = l));
      }), c.splice(u, 0, p);
    }
    t.log = console.debug || console.log || (() => {
    });
    function o(c) {
      try {
        c ? t.storage.setItem("debug", c) : t.storage.removeItem("debug");
      } catch {
      }
    }
    function s() {
      let c;
      try {
        c = t.storage.getItem("debug") || t.storage.getItem("DEBUG");
      } catch {
      }
      return !c && typeof process < "u" && "env" in process && (c = process.env.DEBUG), c;
    }
    function i() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = Si()(t);
    const { formatters: r } = e.exports;
    r.j = function(c) {
      try {
        return JSON.stringify(c);
      } catch (p) {
        return "[UnexpectedJSONParseError]: " + p.message;
      }
    };
  }(Ot, Ot.exports)), Ot.exports;
}
var Lt = { exports: {} }, Qn, zo;
function fu() {
  return zo || (zo = 1, Qn = (e, t = process.argv) => {
    const n = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", a = t.indexOf(n + e), o = t.indexOf("--");
    return a !== -1 && (o === -1 || a < o);
  }), Qn;
}
var ea, Ho;
function hu() {
  if (Ho) return ea;
  Ho = 1;
  const e = Fr, t = $s, n = fu(), { env: a } = process;
  let o;
  n("no-color") || n("no-colors") || n("color=false") || n("color=never") ? o = 0 : (n("color") || n("colors") || n("color=true") || n("color=always")) && (o = 1), "FORCE_COLOR" in a && (a.FORCE_COLOR === "true" ? o = 1 : a.FORCE_COLOR === "false" ? o = 0 : o = a.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(a.FORCE_COLOR, 10), 3));
  function s(c) {
    return c === 0 ? !1 : {
      level: c,
      hasBasic: !0,
      has256: c >= 2,
      has16m: c >= 3
    };
  }
  function i(c, p) {
    if (o === 0)
      return 0;
    if (n("color=16m") || n("color=full") || n("color=truecolor"))
      return 3;
    if (n("color=256"))
      return 2;
    if (c && !p && o === void 0)
      return 0;
    const l = o || 0;
    if (a.TERM === "dumb")
      return l;
    if (process.platform === "win32") {
      const u = e.release().split(".");
      return Number(u[0]) >= 10 && Number(u[2]) >= 10586 ? Number(u[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in a)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((u) => u in a) || a.CI_NAME === "codeship" ? 1 : l;
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
    return /-256(color)?$/i.test(a.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(a.TERM) || "COLORTERM" in a ? 1 : l;
  }
  function r(c) {
    const p = i(c, c && c.isTTY);
    return s(p);
  }
  return ea = {
    supportsColor: r,
    stdout: s(i(!0, t.isatty(1))),
    stderr: s(i(!0, t.isatty(2)))
  }, ea;
}
var Wo;
function gu() {
  return Wo || (Wo = 1, function(e, t) {
    const n = $s, a = Ue;
    t.init = l, t.log = r, t.formatArgs = s, t.save = c, t.load = p, t.useColors = o, t.destroy = a.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const d = hu();
      d && (d.stderr || d).level >= 2 && (t.colors = [
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
    t.inspectOpts = Object.keys(process.env).filter((d) => /^debug_/i.test(d)).reduce((d, f) => {
      const g = f.substring(6).toLowerCase().replace(/_([a-z])/g, (v, h) => h.toUpperCase());
      let x = process.env[f];
      return /^(yes|on|true|enabled)$/i.test(x) ? x = !0 : /^(no|off|false|disabled)$/i.test(x) ? x = !1 : x === "null" ? x = null : x = Number(x), d[g] = x, d;
    }, {});
    function o() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : n.isatty(process.stderr.fd);
    }
    function s(d) {
      const { namespace: f, useColors: g } = this;
      if (g) {
        const x = this.color, v = "\x1B[3" + (x < 8 ? x : "8;5;" + x), h = `  ${v};1m${f} \x1B[0m`;
        d[0] = h + d[0].split(`
`).join(`
` + h), d.push(v + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        d[0] = i() + f + " " + d[0];
    }
    function i() {
      return t.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function r(...d) {
      return process.stderr.write(a.formatWithOptions(t.inspectOpts, ...d) + `
`);
    }
    function c(d) {
      d ? process.env.DEBUG = d : delete process.env.DEBUG;
    }
    function p() {
      return process.env.DEBUG;
    }
    function l(d) {
      d.inspectOpts = {};
      const f = Object.keys(t.inspectOpts);
      for (let g = 0; g < f.length; g++)
        d.inspectOpts[f[g]] = t.inspectOpts[f[g]];
    }
    e.exports = Si()(t);
    const { formatters: u } = e.exports;
    u.o = function(d) {
      return this.inspectOpts.colors = this.useColors, a.inspect(d, this.inspectOpts).split(`
`).map((f) => f.trim()).join(" ");
    }, u.O = function(d) {
      return this.inspectOpts.colors = this.useColors, a.inspect(d, this.inspectOpts);
    };
  }(Lt, Lt.exports)), Lt.exports;
}
var Vo;
function xu() {
  return Vo || (Vo = 1, typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Rt.exports = mu() : Rt.exports = gu()), Rt.exports;
}
var ct, vu = function() {
  if (!ct) {
    try {
      ct = xu()("follow-redirects");
    } catch {
    }
    typeof ct != "function" && (ct = function() {
    });
  }
  ct.apply(null, arguments);
}, _t = Ia, mt = _t.URL, bu = Da, yu = Na, Wa = le.Writable, Va = qr, Ei = vu;
(function() {
  var t = typeof process < "u", n = typeof window < "u" && typeof document < "u", a = Ie(Error.captureStackTrace);
  !t && (n || !a) && console.warn("The follow-redirects package should be excluded from browser builds.");
})();
var Ga = !1;
try {
  Va(new mt(""));
} catch (e) {
  Ga = e.code === "ERR_INVALID_URL";
}
var wu = [
  "Authorization",
  "Proxy-Authorization",
  "Cookie"
], ku = [
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
], Ka = ["abort", "aborted", "connect", "error", "socket", "timeout"], Ja = /* @__PURE__ */ Object.create(null);
Ka.forEach(function(e) {
  Ja[e] = function(t, n, a) {
    this._redirectable.emit(e, t, n, a);
  };
});
var ba = Tt(
  "ERR_INVALID_URL",
  "Invalid URL",
  TypeError
), ya = Tt(
  "ERR_FR_REDIRECTION_FAILURE",
  "Redirected request failed"
), Su = Tt(
  "ERR_FR_TOO_MANY_REDIRECTS",
  "Maximum number of redirects exceeded",
  ya
), Eu = Tt(
  "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
  "Request body larger than maxBodyLength limit"
), _u = Tt(
  "ERR_STREAM_WRITE_AFTER_END",
  "write after end"
), Tu = Wa.prototype.destroy || Ti;
function he(e, t) {
  Wa.call(this), this._sanitizeOptions(e), this._options = e, this._ended = !1, this._ending = !1, this._redirectCount = 0, this._redirects = [], this._requestBodyLength = 0, this._requestBodyBuffers = [], t && this.on("response", t);
  var n = this;
  this._onNativeResponse = function(a) {
    try {
      n._processResponse(a);
    } catch (o) {
      n.emit("error", o instanceof ya ? o : new ya({ cause: o }));
    }
  }, this._headerFilter = new RegExp("^(?:" + wu.concat(e.sensitiveHeaders).map(Pu).join("|") + ")$", "i"), this._performRequest();
}
he.prototype = Object.create(Wa.prototype);
he.prototype.abort = function() {
  Ya(this._currentRequest), this._currentRequest.abort(), this.emit("abort");
};
he.prototype.destroy = function(e) {
  return Ya(this._currentRequest, e), Tu.call(this, e), this;
};
he.prototype.write = function(e, t, n) {
  if (this._ending)
    throw new _u();
  if (!je(e) && !Ou(e))
    throw new TypeError("data should be a string, Buffer or Uint8Array");
  if (Ie(t) && (n = t, t = null), e.length === 0) {
    n && n();
    return;
  }
  this._requestBodyLength + e.length <= this._options.maxBodyLength ? (this._requestBodyLength += e.length, this._requestBodyBuffers.push({ data: e, encoding: t }), this._currentRequest.write(e, t, n)) : (this.emit("error", new Eu()), this.abort());
};
he.prototype.end = function(e, t, n) {
  if (Ie(e) ? (n = e, e = t = null) : Ie(t) && (n = t, t = null), !e)
    this._ended = this._ending = !0, this._currentRequest.end(null, null, n);
  else {
    var a = this, o = this._currentRequest;
    this.write(e, t, function() {
      a._ended = !0, o.end(null, null, n);
    }), this._ending = !0;
  }
};
he.prototype.setHeader = function(e, t) {
  this._options.headers[e] = t, this._currentRequest.setHeader(e, t);
};
he.prototype.removeHeader = function(e) {
  delete this._options.headers[e], this._currentRequest.removeHeader(e);
};
he.prototype.setTimeout = function(e, t) {
  var n = this;
  function a(i) {
    i.setTimeout(e), i.removeListener("timeout", i.destroy), i.addListener("timeout", i.destroy);
  }
  function o(i) {
    n._timeout && clearTimeout(n._timeout), n._timeout = setTimeout(function() {
      n.emit("timeout"), s();
    }, e), a(i);
  }
  function s() {
    n._timeout && (clearTimeout(n._timeout), n._timeout = null), n.removeListener("abort", s), n.removeListener("error", s), n.removeListener("response", s), n.removeListener("close", s), t && n.removeListener("timeout", t), n.socket || n._currentRequest.removeListener("socket", o);
  }
  return t && this.on("timeout", t), this.socket ? o(this.socket) : this._currentRequest.once("socket", o), this.on("socket", a), this.on("abort", s), this.on("error", s), this.on("response", s), this.on("close", s), this;
};
[
  "flushHeaders",
  "getHeader",
  "setNoDelay",
  "setSocketKeepAlive"
].forEach(function(e) {
  he.prototype[e] = function(t, n) {
    return this._currentRequest[e](t, n);
  };
});
["aborted", "connection", "socket"].forEach(function(e) {
  Object.defineProperty(he.prototype, e, {
    get: function() {
      return this._currentRequest[e];
    }
  });
});
he.prototype._sanitizeOptions = function(e) {
  if (e.headers || (e.headers = {}), Ru(e.sensitiveHeaders) || (e.sensitiveHeaders = []), e.host && (e.hostname || (e.hostname = e.host), delete e.host), !e.pathname && e.path) {
    var t = e.path.indexOf("?");
    t < 0 ? e.pathname = e.path : (e.pathname = e.path.substring(0, t), e.search = e.path.substring(t));
  }
};
he.prototype._performRequest = function() {
  var e = this._options.protocol, t = this._options.nativeProtocols[e];
  if (!t)
    throw new TypeError("Unsupported protocol " + e);
  if (this._options.agents) {
    var n = e.slice(0, -1);
    this._options.agent = this._options.agents[n];
  }
  var a = this._currentRequest = t.request(this._options, this._onNativeResponse);
  a._redirectable = this;
  for (var o of Ka)
    a.on(o, Ja[o]);
  if (this._currentUrl = /^\//.test(this._options.path) ? _t.format(this._options) : (
    // When making a request to a proxy, […]
    // a client MUST send the target URI in absolute-form […].
    this._options.path
  ), this._isRedirect) {
    var s = 0, i = this, r = this._requestBodyBuffers;
    (function c(p) {
      if (a === i._currentRequest)
        if (p)
          i.emit("error", p);
        else if (s < r.length) {
          var l = r[s++];
          a.finished || a.write(l.data, l.encoding, c);
        } else i._ended && a.end();
    })();
  }
};
he.prototype._processResponse = function(e) {
  var t = e.statusCode;
  this._options.trackRedirects && this._redirects.push({
    url: this._currentUrl,
    headers: e.headers,
    statusCode: t
  });
  var n = e.headers.location;
  if (!n || this._options.followRedirects === !1 || t < 300 || t >= 400) {
    e.responseUrl = this._currentUrl, e.redirects = this._redirects, this.emit("response", e), this._requestBodyBuffers = [];
    return;
  }
  if (Ya(this._currentRequest), e.destroy(), ++this._redirectCount > this._options.maxRedirects)
    throw new Su();
  var a, o = this._options.beforeRedirect;
  o && (a = Object.assign({
    // The Host header was set by nativeProtocol.request
    Host: e.req.getHeader("host")
  }, this._options.headers));
  var s = this._options.method;
  ((t === 301 || t === 302) && this._options.method === "POST" || // RFC7231§6.4.4: The 303 (See Other) status code indicates that
  // the server is redirecting the user agent to a different resource […]
  // A user agent can perform a retrieval request targeting that URI
  // (a GET or HEAD request if using HTTP) […]
  t === 303 && !/^(?:GET|HEAD)$/.test(this._options.method)) && (this._options.method = "GET", this._requestBodyBuffers = [], ta(/^content-/i, this._options.headers));
  var i = ta(/^host$/i, this._options.headers), r = Xa(this._currentUrl), c = i || r.host, p = /^\w+:/.test(n) ? this._currentUrl : _t.format(Object.assign(r, { host: c })), l = Au(n, p);
  if (Ei("redirecting to", l.href), this._isRedirect = !0, wa(l, this._options), (l.protocol !== r.protocol && l.protocol !== "https:" || l.host !== c && !Cu(l.host, c)) && ta(this._headerFilter, this._options.headers), Ie(o)) {
    var u = {
      headers: e.headers,
      statusCode: t
    }, d = {
      url: p,
      method: s,
      headers: a
    };
    o(this._options, u, d), this._sanitizeOptions(this._options);
  }
  this._performRequest();
};
function _i(e) {
  var t = {
    maxRedirects: 21,
    maxBodyLength: 10485760
  }, n = {};
  return Object.keys(e).forEach(function(a) {
    var o = a + ":", s = n[o] = e[a], i = t[a] = Object.create(s);
    function r(p, l, u) {
      return Lu(p) ? p = wa(p) : je(p) ? p = wa(Xa(p)) : (u = l, l = Ai(p), p = { protocol: o }), Ie(l) && (u = l, l = null), l = Object.assign({
        maxRedirects: t.maxRedirects,
        maxBodyLength: t.maxBodyLength
      }, p, l), l.nativeProtocols = n, !je(l.host) && !je(l.hostname) && (l.hostname = "::1"), Va.equal(l.protocol, o, "protocol mismatch"), Ei("options", l), new he(l, u);
    }
    function c(p, l, u) {
      var d = i.request(p, l, u);
      return d.end(), d;
    }
    Object.defineProperties(i, {
      request: { value: r, configurable: !0, enumerable: !0, writable: !0 },
      get: { value: c, configurable: !0, enumerable: !0, writable: !0 }
    });
  }), t;
}
function Ti() {
}
function Xa(e) {
  var t;
  if (Ga)
    t = new mt(e);
  else if (t = Ai(_t.parse(e)), !je(t.protocol))
    throw new ba({ input: e });
  return t;
}
function Au(e, t) {
  return Ga ? new mt(e, t) : Xa(_t.resolve(t, e));
}
function Ai(e) {
  if (/^\[/.test(e.hostname) && !/^\[[:0-9a-f]+\]$/i.test(e.hostname))
    throw new ba({ input: e.href || e });
  if (/^\[/.test(e.host) && !/^\[[:0-9a-f]+\](:\d+)?$/i.test(e.host))
    throw new ba({ input: e.href || e });
  return e;
}
function wa(e, t) {
  var n = t || {};
  for (var a of ku)
    n[a] = e[a];
  return n.hostname.startsWith("[") && (n.hostname = n.hostname.slice(1, -1)), n.port !== "" && (n.port = Number(n.port)), n.path = n.search ? n.pathname + n.search : n.pathname, n;
}
function ta(e, t) {
  var n;
  for (var a in t)
    e.test(a) && (n = t[a], delete t[a]);
  return n === null || typeof n > "u" ? void 0 : String(n).trim();
}
function Tt(e, t, n) {
  function a(o) {
    Ie(Error.captureStackTrace) && Error.captureStackTrace(this, this.constructor), Object.assign(this, o || {}), this.code = e, this.message = this.cause ? t + ": " + this.cause.message : t;
  }
  return a.prototype = new (n || Error)(), Object.defineProperties(a.prototype, {
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
function Ya(e, t) {
  for (var n of Ka)
    e.removeListener(n, Ja[n]);
  e.on("error", Ti), e.destroy(t);
}
function Cu(e, t) {
  Va(je(e) && je(t));
  var n = e.length - t.length - 1;
  return n > 0 && e[n] === "." && e.endsWith(t);
}
function Ru(e) {
  return e instanceof Array;
}
function je(e) {
  return typeof e == "string" || e instanceof String;
}
function Ie(e) {
  return typeof e == "function";
}
function Ou(e) {
  return typeof e == "object" && "length" in e;
}
function Lu(e) {
  return mt && e instanceof mt;
}
function Pu(e) {
  return e.replace(/[\]\\/()*+?.$]/g, "\\$&");
}
Ha.exports = _i({ http: bu, https: yu });
Ha.exports.wrap = _i;
var ju = Ha.exports;
const Du = /* @__PURE__ */ Zs(ju), ft = "1.16.0";
function Ci(e) {
  const t = /^([-+\w]{1,25}):(?:\/\/)?/.exec(e);
  return t && t[1] || "";
}
const Nu = /^(?:([^;]+);)?(?:[^;]+;)?(base64|),([\s\S]*)$/;
function Iu(e, t, n) {
  const a = n && n.Blob || X.classes.Blob, o = Ci(e);
  if (t === void 0 && a && (t = !0), o === "data") {
    e = o.length ? e.slice(o.length + 1) : e;
    const s = Nu.exec(e);
    if (!s)
      throw new y("Invalid URL", y.ERR_INVALID_URL);
    const i = s[1], r = s[2], c = s[3], p = Buffer.from(decodeURIComponent(c), r ? "base64" : "utf8");
    if (t) {
      if (!a)
        throw new y("Blob is not supported", y.ERR_NOT_SUPPORT);
      return new a([p], { type: i });
    }
    return p;
  }
  throw new y("Unsupported protocol " + o, y.ERR_NOT_SUPPORT);
}
const na = Symbol("internals");
class Go extends le.Transform {
  constructor(t) {
    t = m.toFlatObject(
      t,
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
      readableHighWaterMark: t.chunkSize
    });
    const n = this[na] = {
      timeWindow: t.timeWindow,
      chunkSize: t.chunkSize,
      maxRate: t.maxRate,
      minChunkSize: t.minChunkSize,
      bytesSeen: 0,
      isCaptured: !1,
      notifiedBytesLoaded: 0,
      ts: Date.now(),
      bytes: 0,
      onReadCallback: null
    };
    this.on("newListener", (a) => {
      a === "progress" && (n.isCaptured || (n.isCaptured = !0));
    });
  }
  _read(t) {
    const n = this[na];
    return n.onReadCallback && n.onReadCallback(), super._read(t);
  }
  _transform(t, n, a) {
    const o = this[na], s = o.maxRate, i = this.readableHighWaterMark, r = o.timeWindow, c = 1e3 / r, p = s / c, l = o.minChunkSize !== !1 ? Math.max(o.minChunkSize, p * 0.01) : 0, u = (f, g) => {
      const x = Buffer.byteLength(f);
      o.bytesSeen += x, o.bytes += x, o.isCaptured && this.emit("progress", o.bytesSeen), this.push(f) ? process.nextTick(g) : o.onReadCallback = () => {
        o.onReadCallback = null, process.nextTick(g);
      };
    }, d = (f, g) => {
      const x = Buffer.byteLength(f);
      let v = null, h = i, b, k = 0;
      if (s) {
        const E = Date.now();
        (!o.ts || (k = E - o.ts) >= r) && (o.ts = E, b = p - o.bytes, o.bytes = b < 0 ? -b : 0, k = 0), b = p - o.bytes;
      }
      if (s) {
        if (b <= 0)
          return setTimeout(() => {
            g(null, f);
          }, r - k);
        b < h && (h = b);
      }
      h && x > h && x - h > l && (v = f.subarray(h), f = f.subarray(0, h)), u(
        f,
        v ? () => {
          process.nextTick(g, null, v);
        } : g
      );
    };
    d(t, function f(g, x) {
      if (g)
        return a(g);
      x ? d(x, f) : a(null);
    });
  }
}
const { asyncIterator: Ko } = Symbol, Ri = async function* (e) {
  e.stream ? yield* e.stream() : e.arrayBuffer ? yield await e.arrayBuffer() : e[Ko] ? yield* e[Ko]() : yield e;
}, qu = X.ALPHABET.ALPHA_DIGIT + "-_", ht = typeof TextEncoder == "function" ? new TextEncoder() : new Ue.TextEncoder(), Le = `\r
`, Fu = ht.encode(Le), Uu = 2;
class Mu {
  constructor(t, n) {
    const { escapeName: a } = this.constructor, o = m.isString(n);
    let s = `Content-Disposition: form-data; name="${a(t)}"${!o && n.name ? `; filename="${a(n.name)}"` : ""}${Le}`;
    if (o)
      n = ht.encode(String(n).replace(/\r?\n|\r\n?/g, Le));
    else {
      const i = String(n.type || "application/octet-stream").replace(/[\r\n]/g, "");
      s += `Content-Type: ${i}${Le}`;
    }
    this.headers = ht.encode(s + Le), this.contentLength = o ? n.byteLength : n.size, this.size = this.headers.byteLength + this.contentLength + Uu, this.name = t, this.value = n;
  }
  async *encode() {
    yield this.headers;
    const { value: t } = this;
    m.isTypedArray(t) ? yield t : yield* Ri(t), yield Fu;
  }
  static escapeName(t) {
    return String(t).replace(
      /[\r\n"]/g,
      (n) => ({
        "\r": "%0D",
        "\n": "%0A",
        '"': "%22"
      })[n]
    );
  }
}
const Bu = (e, t, n) => {
  const {
    tag: a = "form-data-boundary",
    size: o = 25,
    boundary: s = a + "-" + X.generateString(o, qu)
  } = n || {};
  if (!m.isFormData(e))
    throw TypeError("FormData instance required");
  if (s.length < 1 || s.length > 70)
    throw Error("boundary must be 1-70 characters long");
  const i = ht.encode("--" + s + Le), r = ht.encode("--" + s + "--" + Le);
  let c = r.byteLength;
  const p = Array.from(e.entries()).map(([u, d]) => {
    const f = new Mu(u, d);
    return c += f.size, f;
  });
  c += i.byteLength * p.length, c = m.toFiniteNumber(c);
  const l = {
    "Content-Type": `multipart/form-data; boundary=${s}`
  };
  return Number.isFinite(c) && (l["Content-Length"] = c), t && t(l), Nr.from(
    async function* () {
      for (const u of p)
        yield i, yield* u.encode();
      yield r;
    }()
  );
};
class $u extends le.Transform {
  __transform(t, n, a) {
    this.push(t), a();
  }
  _transform(t, n, a) {
    if (t.length !== 0 && (this._transform = this.__transform, t[0] !== 120)) {
      const o = Buffer.alloc(2);
      o[0] = 120, o[1] = 156, this.push(o, n);
    }
    this.__transform(t, n, a);
  }
}
const zu = (e, t) => m.isAsyncFn(e) ? function(...n) {
  const a = n.pop();
  e.apply(this, n).then((o) => {
    try {
      t ? a(null, ...t(o)) : a(null, o);
    } catch (s) {
      a(s);
    }
  }, a);
} : e, Hu = /* @__PURE__ */ new Set(["localhost"]), Oi = (e) => {
  const t = e.split(".");
  return t.length !== 4 || t[0] !== "127" ? !1 : t.every((n) => /^\d+$/.test(n) && Number(n) >= 0 && Number(n) <= 255);
}, Wu = (e) => {
  if (e === "::1") return !0;
  const t = e.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
  if (t) return Oi(t[1]);
  const n = e.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i);
  if (n) {
    const o = parseInt(n[1], 16);
    return o >= 32512 && o <= 32767;
  }
  const a = e.split(":");
  if (a.length === 8) {
    for (let o = 0; o < 7; o++)
      if (!/^0+$/.test(a[o])) return !1;
    return /^0*1$/.test(a[7]);
  }
  return !1;
}, Jo = (e) => e ? Hu.has(e) || Oi(e) ? !0 : Wu(e) : !1, Vu = {
  http: 80,
  https: 443,
  ws: 80,
  wss: 443,
  ftp: 21
}, Gu = (e) => {
  let t = e, n = 0;
  if (t.charAt(0) === "[") {
    const s = t.indexOf("]");
    if (s !== -1) {
      const i = t.slice(1, s), r = t.slice(s + 1);
      return r.charAt(0) === ":" && /^\d+$/.test(r.slice(1)) && (n = Number.parseInt(r.slice(1), 10)), [i, n];
    }
  }
  const a = t.indexOf(":"), o = t.lastIndexOf(":");
  return a !== -1 && a === o && /^\d+$/.test(t.slice(o + 1)) && (n = Number.parseInt(t.slice(o + 1), 10), t = t.slice(0, o)), [t, n];
}, Ku = /^(?:::|(?:0{1,4}:){1,4}:|(?:0{1,4}:){5})ffff:(\d+\.\d+\.\d+\.\d+)$/i, Ju = /^(?:::|(?:0{1,4}:){1,4}:|(?:0{1,4}:){5})ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i, Xu = (e) => {
  if (typeof e != "string" || e.indexOf(":") === -1) return e;
  const t = e.match(Ku);
  if (t) return t[1];
  const n = e.match(Ju);
  if (n) {
    const a = parseInt(n[1], 16), o = parseInt(n[2], 16);
    return `${a >> 8}.${a & 255}.${o >> 8}.${o & 255}`;
  }
  return e;
}, Xo = (e) => e && (e.charAt(0) === "[" && e.charAt(e.length - 1) === "]" && (e = e.slice(1, -1)), Xu(e.replace(/\.+$/, "")));
function Yu(e) {
  let t;
  try {
    t = new URL(e);
  } catch {
    return !1;
  }
  const n = (process.env.no_proxy || process.env.NO_PROXY || "").toLowerCase();
  if (!n)
    return !1;
  if (n === "*")
    return !0;
  const a = Number.parseInt(t.port, 10) || Vu[t.protocol.split(":", 1)[0]] || 0, o = Xo(t.hostname.toLowerCase());
  return n.split(/[\s,]+/).some((s) => {
    if (!s)
      return !1;
    let [i, r] = Gu(s);
    return i = Xo(i), !i || r && r !== a ? !1 : (i.charAt(0) === "*" && (i = i.slice(1)), i.charAt(0) === "." ? o.endsWith(i) : o === i || Jo(o) && Jo(i));
  });
}
function Zu(e, t) {
  e = e || 10;
  const n = new Array(e), a = new Array(e);
  let o = 0, s = 0, i;
  return t = t !== void 0 ? t : 1e3, function(c) {
    const p = Date.now(), l = a[s];
    i || (i = p), n[o] = c, a[o] = p;
    let u = s, d = 0;
    for (; u !== o; )
      d += n[u++], u = u % e;
    if (o = (o + 1) % e, o === s && (s = (s + 1) % e), p - i < t)
      return;
    const f = l && p - l;
    return f ? Math.round(d * 1e3 / f) : void 0;
  };
}
function Qu(e, t) {
  let n = 0, a = 1e3 / t, o, s;
  const i = (p, l = Date.now()) => {
    n = l, o = null, s && (clearTimeout(s), s = null), e(...p);
  };
  return [(...p) => {
    const l = Date.now(), u = l - n;
    u >= a ? i(p, l) : (o = p, s || (s = setTimeout(() => {
      s = null, i(o);
    }, a - u)));
  }, () => o && i(o)];
}
const et = (e, t, n = 3) => {
  let a = 0;
  const o = Zu(50, 250);
  return Qu((s) => {
    const i = s.loaded, r = s.lengthComputable ? s.total : void 0, c = r != null ? Math.min(i, r) : i, p = Math.max(0, c - a), l = o(p);
    a = Math.max(a, c);
    const u = {
      loaded: c,
      total: r,
      progress: r ? c / r : void 0,
      bytes: p,
      rate: l || void 0,
      estimated: l && r ? (r - c) / l : void 0,
      event: s,
      lengthComputable: r != null,
      [t ? "download" : "upload"]: !0
    };
    e(u);
  }, n);
}, Xt = (e, t) => {
  const n = e != null;
  return [
    (a) => t[0]({
      lengthComputable: n,
      total: e,
      loaded: a
    }),
    t[1]
  ];
}, Yt = (e) => (...t) => m.asap(() => e(...t));
function Li(e) {
  if (!e || typeof e != "string" || !e.startsWith("data:")) return 0;
  const t = e.indexOf(",");
  if (t < 0) return 0;
  const n = e.slice(5, t), a = e.slice(t + 1);
  if (/;base64/i.test(n)) {
    let i = a.length;
    const r = a.length;
    for (let f = 0; f < r; f++)
      if (a.charCodeAt(f) === 37 && f + 2 < r) {
        const g = a.charCodeAt(f + 1), x = a.charCodeAt(f + 2);
        (g >= 48 && g <= 57 || g >= 65 && g <= 70 || g >= 97 && g <= 102) && (x >= 48 && x <= 57 || x >= 65 && x <= 70 || x >= 97 && x <= 102) && (i -= 2, f += 2);
      }
    let c = 0, p = r - 1;
    const l = (f) => f >= 2 && a.charCodeAt(f - 2) === 37 && // '%'
    a.charCodeAt(f - 1) === 51 && // '3'
    (a.charCodeAt(f) === 68 || a.charCodeAt(f) === 100);
    p >= 0 && (a.charCodeAt(p) === 61 ? (c++, p--) : l(p) && (c++, p -= 3)), c === 1 && p >= 0 && (a.charCodeAt(p) === 61 || l(p)) && c++;
    const d = Math.floor(i / 4) * 3 - (c || 0);
    return d > 0 ? d : 0;
  }
  if (typeof Buffer < "u" && typeof Buffer.byteLength == "function")
    return Buffer.byteLength(a, "utf8");
  let s = 0;
  for (let i = 0, r = a.length; i < r; i++) {
    const c = a.charCodeAt(i);
    if (c < 128)
      s += 1;
    else if (c < 2048)
      s += 2;
    else if (c >= 55296 && c <= 56319 && i + 1 < r) {
      const p = a.charCodeAt(i + 1);
      p >= 56320 && p <= 57343 ? (s += 4, i++) : s += 3;
    } else
      s += 3;
  }
  return s;
}
const Yo = {
  flush: Te.constants.Z_SYNC_FLUSH,
  finishFlush: Te.constants.Z_SYNC_FLUSH
}, ed = {
  flush: Te.constants.BROTLI_OPERATION_FLUSH,
  finishFlush: Te.constants.BROTLI_OPERATION_FLUSH
}, Zo = m.isFunction(Te.createBrotliDecompress), { http: td, https: nd } = Du, ad = /https:?/, od = ["content-type", "content-length"];
function sd(e, t, n) {
  if (n !== "content-only") {
    e.set(t);
    return;
  }
  Object.entries(t).forEach(([a, o]) => {
    od.includes(a.toLowerCase()) && e.set(a, o);
  });
}
const Qo = Symbol("axios.http.socketListener"), Pt = Symbol("axios.http.currentReq"), es = X.protocols.map((e) => e + ":"), ts = (e) => {
  if (!m.isString(e))
    return e;
  try {
    return decodeURIComponent(e);
  } catch {
    return e;
  }
}, ns = (e, [t, n]) => (e.on("end", n).on("error", n), t);
class id {
  constructor() {
    this.sessions = /* @__PURE__ */ Object.create(null);
  }
  getSession(t, n) {
    n = Object.assign(
      {
        sessionTimeout: 1e3
      },
      n
    );
    let a = this.sessions[t];
    if (a) {
      let l = a.length;
      for (let u = 0; u < l; u++) {
        const [d, f] = a[u];
        if (!d.destroyed && !d.closed && Ue.isDeepStrictEqual(f, n))
          return d;
      }
    }
    const o = Bs.connect(t, n);
    let s;
    const i = () => {
      if (s)
        return;
      s = !0;
      let l = a, u = l.length, d = u;
      for (; d--; )
        if (l[d][0] === o) {
          u === 1 ? delete this.sessions[t] : l.splice(d, 1), o.closed || o.close();
          return;
        }
    }, r = o.request, { sessionTimeout: c } = n;
    if (c != null) {
      let l, u = 0;
      o.request = function() {
        const d = r.apply(this, arguments);
        return u++, l && (clearTimeout(l), l = null), d.once("close", () => {
          --u || (l = setTimeout(() => {
            l = null, i();
          }, c));
        }), d;
      };
    }
    o.once("close", i);
    let p = [o, n];
    return a ? a.push(p) : a = this.sessions[t] = [p], o;
  }
}
const rd = new id();
function cd(e, t, n) {
  e.beforeRedirects.proxy && e.beforeRedirects.proxy(e), e.beforeRedirects.config && e.beforeRedirects.config(e, t, n);
}
function Pi(e, t, n, a) {
  let o = t;
  if (!o && o !== !1) {
    const s = pu(n);
    s && (Yu(n) || (o = new URL(s)));
  }
  if (a && e.headers)
    for (const s of Object.keys(e.headers))
      s.toLowerCase() === "proxy-authorization" && delete e.headers[s];
  if (o) {
    const s = o instanceof URL, i = (f) => s || m.hasOwnProp(o, f) ? o[f] : void 0, r = i("username"), c = i("password");
    let p = m.hasOwnProp(o, "auth") ? o.auth : void 0;
    if (r && (p = (r || "") + ":" + (c || "")), p) {
      const f = typeof p == "object", g = f && m.hasOwnProp(p, "username") ? p.username : void 0, x = f && m.hasOwnProp(p, "password") ? p.password : void 0;
      if (!!(g || x))
        p = (g || "") + ":" + (x || "");
      else if (f)
        throw new y("Invalid proxy authorization", y.ERR_BAD_OPTION, { proxy: o });
      const h = Buffer.from(p, "utf8").toString("base64");
      e.headers["Proxy-Authorization"] = "Basic " + h;
    }
    let l = !1;
    for (const f of Object.keys(e.headers))
      if (f.toLowerCase() === "host") {
        l = !0;
        break;
      }
    l || (e.headers.host = e.hostname + (e.port ? ":" + e.port : ""));
    const u = i("hostname") || i("host");
    e.hostname = u, e.host = u, e.port = i("port"), e.path = n;
    const d = i("protocol");
    d && (e.protocol = d.includes(":") ? d : `${d}:`);
  }
  e.beforeRedirects.proxy = function(i) {
    Pi(i, t, i.href, !0);
  };
}
const ld = typeof process < "u" && m.kindOf(process) === "process", pd = (e) => new Promise((t, n) => {
  let a, o;
  const s = (c, p) => {
    o || (o = !0, a && a(c, p));
  }, i = (c) => {
    s(c), t(c);
  }, r = (c) => {
    s(c, !0), n(c);
  };
  e(i, r, (c) => a = c).catch(r);
}), ud = ({ address: e, family: t }) => {
  if (!m.isString(e))
    throw TypeError("address must be a string");
  return {
    address: e,
    family: t || (e.indexOf(".") < 0 ? 6 : 4)
  };
}, as = (e, t) => ud(m.isObject(e) ? e : { address: e, family: t }), dd = {
  request(e, t) {
    const n = e.protocol + "//" + e.hostname + ":" + (e.port || (e.protocol === "https:" ? 443 : 80)), { http2Options: a, headers: o } = e, s = rd.getSession(n, a), { HTTP2_HEADER_SCHEME: i, HTTP2_HEADER_METHOD: r, HTTP2_HEADER_PATH: c, HTTP2_HEADER_STATUS: p } = Bs.constants, l = {
      [i]: e.protocol.replace(":", ""),
      [r]: e.method,
      [c]: e.path
    };
    m.forEach(o, (d, f) => {
      f.charAt(0) !== ":" && (l[f] = d);
    });
    const u = s.request(l);
    return u.once("response", (d) => {
      const f = u;
      d = Object.assign({}, d);
      const g = d[p];
      delete d[p], f.headers = d, f.statusCode = +g, t(f);
    }), u;
  }
}, md = ld && function(t) {
  return pd(async function(a, o, s) {
    const i = (S) => m.hasOwnProp(t, S) ? t[S] : void 0;
    let r = i("data"), c = i("lookup"), p = i("family"), l = i("httpVersion");
    l === void 0 && (l = 1);
    let u = i("http2Options");
    const d = i("responseType"), f = i("responseEncoding"), g = t.method.toUpperCase();
    let x, v = !1, h, b;
    if (l = +l, Number.isNaN(l))
      throw TypeError(`Invalid protocol version: '${t.httpVersion}' is not a number`);
    if (l !== 1 && l !== 2)
      throw TypeError(`Unsupported protocol version '${l}'`);
    const k = l === 2;
    if (c) {
      const S = zu(c, (w) => m.isArray(w) ? w : [w]);
      c = (w, j, H) => {
        S(w, j, (D, ee, ce) => {
          if (D)
            return H(D);
          const q = m.isArray(ee) ? ee.map((Ee) => as(Ee)) : [as(ee, ce)];
          j.all ? H(D, q) : H(D, q[0].address, q[0].family);
        });
      };
    }
    const E = new Ur();
    function _(S) {
      try {
        E.emit(
          "abort",
          !S || S.type ? new Ne(null, t, h) : S
        );
      } catch (w) {
        console.warn("emit error", w);
      }
    }
    function A() {
      b && (clearTimeout(b), b = null);
    }
    function C() {
      let S = t.timeout ? "timeout of " + t.timeout + "ms exceeded" : "timeout exceeded";
      const w = t.transitional || gn;
      return t.timeoutErrorMessage && (S = t.timeoutErrorMessage), new y(
        S,
        w.clarifyTimeoutError ? y.ETIMEDOUT : y.ECONNABORTED,
        t,
        h
      );
    }
    E.once("abort", o);
    const I = () => {
      A(), t.cancelToken && t.cancelToken.unsubscribe(_), t.signal && t.signal.removeEventListener("abort", _), E.removeAllListeners();
    };
    (t.cancelToken || t.signal) && (t.cancelToken && t.cancelToken.subscribe(_), t.signal && (t.signal.aborted ? _() : t.signal.addEventListener("abort", _))), s((S, w) => {
      if (x = !0, A(), w) {
        v = !0, I();
        return;
      }
      const { data: j } = S;
      if (j instanceof le.Readable || j instanceof le.Duplex) {
        const H = le.finished(j, () => {
          H(), I();
        });
      } else
        I();
    });
    const G = za(t.baseURL, t.url, t.allowAbsoluteUrls), T = new URL(G, X.hasBrowserEnv ? X.origin : void 0), Z = T.protocol || es[0];
    if (Z === "data:") {
      if (t.maxContentLength > -1) {
        const w = String(t.url || G || "");
        if (Li(w) > t.maxContentLength)
          return o(
            new y(
              "maxContentLength size of " + t.maxContentLength + " exceeded",
              y.ERR_BAD_RESPONSE,
              t
            )
          );
      }
      let S;
      if (g !== "GET")
        return Ge(a, o, {
          status: 405,
          statusText: "method not allowed",
          headers: {},
          config: t
        });
      try {
        S = Iu(t.url, d === "blob", {
          Blob: t.env && t.env.Blob
        });
      } catch (w) {
        throw y.from(w, y.ERR_BAD_REQUEST, t);
      }
      return d === "text" ? (S = S.toString(f), (!f || f === "utf8") && (S = m.stripBOM(S))) : d === "stream" && (S = le.Readable.from(S)), Ge(a, o, {
        data: S,
        status: 200,
        statusText: "OK",
        headers: new se(),
        config: t
      });
    }
    if (es.indexOf(Z) === -1)
      return o(
        new y("Unsupported protocol " + Z, y.ERR_BAD_REQUEST, t)
      );
    const U = se.from(t.headers).normalize();
    U.set("User-Agent", "axios/" + ft, !1);
    const { onUploadProgress: ie, onDownloadProgress: M } = t, B = t.maxRate;
    let $, re;
    if (m.isSpecCompliantForm(r)) {
      const S = U.getContentType(/boundary=([-_\w\d]{10,70})/i);
      r = Bu(
        r,
        (w) => {
          U.set(w);
        },
        {
          tag: `axios-${ft}-boundary`,
          boundary: S && S[1] || void 0
        }
      );
    } else if (m.isFormData(r) && m.isFunction(r.getHeaders) && r.getHeaders !== Object.prototype.getHeaders) {
      if (sd(U, r.getHeaders(), i("formDataHeaderPolicy")), !U.hasContentLength())
        try {
          const S = await Ue.promisify(r.getLength).call(r);
          Number.isFinite(S) && S >= 0 && U.setContentLength(S);
        } catch {
        }
    } else if (m.isBlob(r) || m.isFile(r))
      r.size && U.setContentType(r.type || "application/octet-stream"), U.setContentLength(r.size || 0), r = le.Readable.from(Ri(r));
    else if (r && !m.isStream(r)) {
      if (!Buffer.isBuffer(r)) if (m.isArrayBuffer(r))
        r = Buffer.from(new Uint8Array(r));
      else if (m.isString(r))
        r = Buffer.from(r, "utf-8");
      else
        return o(
          new y(
            "Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream",
            y.ERR_BAD_REQUEST,
            t
          )
        );
      if (U.setContentLength(r.length, !1), t.maxBodyLength > -1 && r.length > t.maxBodyLength)
        return o(
          new y(
            "Request body larger than maxBodyLength limit",
            y.ERR_BAD_REQUEST,
            t
          )
        );
    }
    const Se = m.toFiniteNumber(U.getContentLength());
    m.isArray(B) ? ($ = B[0], re = B[1]) : $ = re = B, r && (ie || $) && (m.isStream(r) || (r = le.Readable.from(r, { objectMode: !1 })), r = le.pipeline(
      [
        r,
        new Go({
          maxRate: m.toFiniteNumber($)
        })
      ],
      m.noop
    ), ie && r.on(
      "progress",
      ns(
        r,
        Xt(
          Se,
          et(Yt(ie), !1, 3)
        )
      )
    ));
    let te;
    const K = i("auth");
    if (K) {
      const S = K.username || "", w = K.password || "";
      te = S + ":" + w;
    }
    if (!te && T.username) {
      const S = ts(T.username), w = ts(T.password);
      te = S + ":" + w;
    }
    te && U.delete("authorization");
    let me;
    try {
      me = Ba(
        T.pathname + T.search,
        t.params,
        t.paramsSerializer
      ).replace(/^\?/, "");
    } catch (S) {
      const w = new Error(S.message);
      return w.config = t, w.url = t.url, w.exists = !0, o(w);
    }
    U.set(
      "Accept-Encoding",
      "gzip, compress, deflate" + (Zo ? ", br" : ""),
      !1
    );
    const Q = Object.assign(/* @__PURE__ */ Object.create(null), {
      path: me,
      method: g,
      headers: U.toJSON(),
      agents: { http: t.httpAgent, https: t.httpsAgent },
      auth: te,
      protocol: Z,
      family: p,
      beforeRedirect: cd,
      beforeRedirects: /* @__PURE__ */ Object.create(null),
      http2Options: u
    });
    if (!m.isUndefined(c) && (Q.lookup = c), t.socketPath) {
      if (typeof t.socketPath != "string")
        return o(
          new y("socketPath must be a string", y.ERR_BAD_OPTION_VALUE, t)
        );
      if (t.allowedSocketPaths != null) {
        const S = Array.isArray(t.allowedSocketPaths) ? t.allowedSocketPaths : [t.allowedSocketPaths], w = mo(t.socketPath);
        if (!S.some(
          (H) => typeof H == "string" && mo(H) === w
        ))
          return o(
            new y(
              `socketPath "${t.socketPath}" is not permitted by allowedSocketPaths`,
              y.ERR_BAD_OPTION_VALUE,
              t
            )
          );
      }
      Q.socketPath = t.socketPath;
    } else
      Q.hostname = T.hostname.startsWith("[") ? T.hostname.slice(1, -1) : T.hostname, Q.port = T.port, Pi(
        Q,
        t.proxy,
        Z + "//" + T.hostname + (T.port ? ":" + T.port : "") + Q.path
      );
    let z, de = !1;
    const ae = ad.test(Q.protocol);
    if (Q.agent = ae ? t.httpsAgent : t.httpAgent, k)
      z = dd;
    else {
      const S = i("transport");
      if (S)
        z = S;
      else if (t.maxRedirects === 0)
        z = ae ? Na : Da, de = !0;
      else {
        t.maxRedirects && (Q.maxRedirects = t.maxRedirects);
        const w = i("beforeRedirect");
        w && (Q.beforeRedirects.config = w), z = ae ? nd : td;
      }
    }
    t.maxBodyLength > -1 ? Q.maxBodyLength = t.maxBodyLength : Q.maxBodyLength = 1 / 0, Q.insecureHTTPParser = !!i("insecureHTTPParser"), h = z.request(Q, function(w) {
      if (A(), h.destroyed) return;
      const j = [w], H = m.toFiniteNumber(w.headers["content-length"]);
      if (M || re) {
        const q = new Go({
          maxRate: m.toFiniteNumber(re)
        });
        M && q.on(
          "progress",
          ns(
            q,
            Xt(
              H,
              et(Yt(M), !0, 3)
            )
          )
        ), j.push(q);
      }
      let D = w;
      const ee = w.req || h;
      if (t.decompress !== !1 && w.headers["content-encoding"])
        switch ((g === "HEAD" || w.statusCode === 204) && delete w.headers["content-encoding"], (w.headers["content-encoding"] || "").toLowerCase()) {
          case "gzip":
          case "x-gzip":
          case "compress":
          case "x-compress":
            j.push(Te.createUnzip(Yo)), delete w.headers["content-encoding"];
            break;
          case "deflate":
            j.push(new $u()), j.push(Te.createUnzip(Yo)), delete w.headers["content-encoding"];
            break;
          case "br":
            Zo && (j.push(Te.createBrotliDecompress(ed)), delete w.headers["content-encoding"]);
        }
      D = j.length > 1 ? le.pipeline(j, m.noop) : j[0];
      const ce = {
        status: w.statusCode,
        statusText: w.statusMessage,
        headers: new se(w.headers),
        config: t,
        request: ee
      };
      if (d === "stream") {
        if (t.maxContentLength > -1) {
          const q = t.maxContentLength, Ee = D;
          async function* _e() {
            let J = 0;
            for await (const Me of Ee) {
              if (J += Me.length, J > q)
                throw new y(
                  "maxContentLength size of " + q + " exceeded",
                  y.ERR_BAD_RESPONSE,
                  t,
                  ee
                );
              yield Me;
            }
          }
          D = le.Readable.from(_e(), {
            objectMode: !1
          });
        }
        ce.data = D, Ge(a, o, ce);
      } else {
        const q = [];
        let Ee = 0;
        D.on("data", function(J) {
          q.push(J), Ee += J.length, t.maxContentLength > -1 && Ee > t.maxContentLength && (v = !0, D.destroy(), _(
            new y(
              "maxContentLength size of " + t.maxContentLength + " exceeded",
              y.ERR_BAD_RESPONSE,
              t,
              ee
            )
          ));
        }), D.on("aborted", function() {
          if (v)
            return;
          const J = new y(
            "stream has been aborted",
            y.ERR_BAD_RESPONSE,
            t,
            ee,
            ce
          );
          D.destroy(J), o(J);
        }), D.on("error", function(J) {
          v || o(y.from(J, null, t, ee, ce));
        }), D.on("end", function() {
          try {
            let J = q.length === 1 ? q[0] : Buffer.concat(q);
            d !== "arraybuffer" && (J = J.toString(f), (!f || f === "utf8") && (J = m.stripBOM(J))), ce.data = J;
          } catch (J) {
            return o(y.from(J, null, t, ce.request, ce));
          }
          Ge(a, o, ce);
        });
      }
      E.once("abort", (q) => {
        D.destroyed || (D.emit("error", q), D.destroy());
      });
    }), E.once("abort", (S) => {
      h.close ? h.close() : h.destroy(S);
    }), h.on("error", function(w) {
      o(y.from(w, null, t, h));
    });
    const be = /* @__PURE__ */ new Set();
    if (h.on("socket", function(w) {
      w.setKeepAlive(!0, 1e3 * 60), w[Qo] || (w.on("error", function(H) {
        const D = w[Pt];
        D && !D.destroyed && D.destroy(H);
      }), w[Qo] = !0), w[Pt] = h, be.add(w);
    }), h.once("close", function() {
      A();
      for (const w of be)
        w[Pt] === h && (w[Pt] = null);
      be.clear();
    }), t.timeout) {
      const S = parseInt(t.timeout, 10);
      if (Number.isNaN(S)) {
        _(
          new y(
            "error trying to parse `config.timeout` to int",
            y.ERR_BAD_OPTION_VALUE,
            t,
            h
          )
        );
        return;
      }
      const w = function() {
        x || _(C());
      };
      de && S > 0 && (b = setTimeout(w, S)), h.setTimeout(S, w);
    } else
      h.setTimeout(0);
    if (m.isStream(r)) {
      let S = !1, w = !1;
      r.on("end", () => {
        S = !0;
      }), r.once("error", (H) => {
        w = !0, h.destroy(H);
      }), r.on("close", () => {
        !S && !w && _(new Ne("Request stream has been aborted", t, h));
      });
      let j = r;
      if (t.maxBodyLength > -1 && t.maxRedirects === 0) {
        const H = t.maxBodyLength;
        let D = 0;
        j = le.pipeline(
          [
            r,
            new le.Transform({
              transform(ee, ce, q) {
                if (D += ee.length, D > H)
                  return q(
                    new y(
                      "Request body larger than maxBodyLength limit",
                      y.ERR_BAD_REQUEST,
                      t,
                      h
                    )
                  );
                q(null, ee);
              }
            })
          ],
          m.noop
        ), j.on("error", (ee) => {
          h.destroyed || h.destroy(ee);
        });
      }
      j.pipe(h);
    } else
      r && h.write(r), h.end();
  });
}, fd = X.hasStandardBrowserEnv ? /* @__PURE__ */ ((e, t) => (n) => (n = new URL(n, X.origin), e.protocol === n.protocol && e.host === n.host && (t || e.port === n.port)))(
  new URL(X.origin),
  X.navigator && /(msie|trident)/i.test(X.navigator.userAgent)
) : () => !0, hd = X.hasStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  {
    write(e, t, n, a, o, s, i) {
      if (typeof document > "u") return;
      const r = [`${e}=${encodeURIComponent(t)}`];
      m.isNumber(n) && r.push(`expires=${new Date(n).toUTCString()}`), m.isString(a) && r.push(`path=${a}`), m.isString(o) && r.push(`domain=${o}`), s === !0 && r.push("secure"), m.isString(i) && r.push(`SameSite=${i}`), document.cookie = r.join("; ");
    },
    read(e) {
      if (typeof document > "u") return null;
      const t = document.cookie.split(";");
      for (let n = 0; n < t.length; n++) {
        const a = t[n].replace(/^\s+/, ""), o = a.indexOf("=");
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
), os = (e) => e instanceof se ? { ...e } : e;
function qe(e, t) {
  t = t || {};
  const n = /* @__PURE__ */ Object.create(null);
  Object.defineProperty(n, "hasOwnProperty", {
    // Null-proto descriptor so a polluted Object.prototype.get cannot turn
    // this data descriptor into an accessor descriptor on the way in.
    __proto__: null,
    value: Object.prototype.hasOwnProperty,
    enumerable: !1,
    writable: !0,
    configurable: !0
  });
  function a(p, l, u, d) {
    return m.isPlainObject(p) && m.isPlainObject(l) ? m.merge.call({ caseless: d }, p, l) : m.isPlainObject(l) ? m.merge({}, l) : m.isArray(l) ? l.slice() : l;
  }
  function o(p, l, u, d) {
    if (m.isUndefined(l)) {
      if (!m.isUndefined(p))
        return a(void 0, p, u, d);
    } else return a(p, l, u, d);
  }
  function s(p, l) {
    if (!m.isUndefined(l))
      return a(void 0, l);
  }
  function i(p, l) {
    if (m.isUndefined(l)) {
      if (!m.isUndefined(p))
        return a(void 0, p);
    } else return a(void 0, l);
  }
  function r(p, l, u) {
    if (m.hasOwnProp(t, u))
      return a(p, l);
    if (m.hasOwnProp(e, u))
      return a(void 0, p);
  }
  const c = {
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
    headers: (p, l, u) => o(os(p), os(l), u, !0)
  };
  return m.forEach(Object.keys({ ...e, ...t }), function(l) {
    if (l === "__proto__" || l === "constructor" || l === "prototype") return;
    const u = m.hasOwnProp(c, l) ? c[l] : o, d = m.hasOwnProp(e, l) ? e[l] : void 0, f = m.hasOwnProp(t, l) ? t[l] : void 0, g = u(d, f, l);
    m.isUndefined(g) && u !== r || (n[l] = g);
  }), n;
}
const gd = ["content-type", "content-length"];
function xd(e, t, n) {
  if (n !== "content-only") {
    e.set(t);
    return;
  }
  Object.entries(t).forEach(([a, o]) => {
    gd.includes(a.toLowerCase()) && e.set(a, o);
  });
}
const vd = (e) => encodeURIComponent(e).replace(
  /%([0-9A-F]{2})/gi,
  (t, n) => String.fromCharCode(parseInt(n, 16))
), ji = (e) => {
  const t = qe({}, e), n = (d) => m.hasOwnProp(t, d) ? t[d] : void 0, a = n("data");
  let o = n("withXSRFToken");
  const s = n("xsrfHeaderName"), i = n("xsrfCookieName");
  let r = n("headers");
  const c = n("auth"), p = n("baseURL"), l = n("allowAbsoluteUrls"), u = n("url");
  if (t.headers = r = se.from(r), t.url = Ba(
    za(p, u, l),
    e.params,
    e.paramsSerializer
  ), c && r.set(
    "Authorization",
    "Basic " + btoa((c.username || "") + ":" + (c.password ? vd(c.password) : ""))
  ), m.isFormData(a) && (X.hasStandardBrowserEnv || X.hasStandardBrowserWebWorkerEnv ? r.setContentType(void 0) : m.isFunction(a.getHeaders) && xd(r, a.getHeaders(), n("formDataHeaderPolicy"))), X.hasStandardBrowserEnv && (m.isFunction(o) && (o = o(t)), o === !0 || o == null && fd(t.url))) {
    const f = s && i && hd.read(i);
    f && r.set(s, f);
  }
  return t;
}, bd = typeof XMLHttpRequest < "u", yd = bd && function(e) {
  return new Promise(function(n, a) {
    const o = ji(e);
    let s = o.data;
    const i = se.from(o.headers).normalize();
    let { responseType: r, onUploadProgress: c, onDownloadProgress: p } = o, l, u, d, f, g;
    function x() {
      f && f(), g && g(), o.cancelToken && o.cancelToken.unsubscribe(l), o.signal && o.signal.removeEventListener("abort", l);
    }
    let v = new XMLHttpRequest();
    v.open(o.method.toUpperCase(), o.url, !0), v.timeout = o.timeout;
    function h() {
      if (!v)
        return;
      const k = se.from(
        "getAllResponseHeaders" in v && v.getAllResponseHeaders()
      ), _ = {
        data: !r || r === "text" || r === "json" ? v.responseText : v.response,
        status: v.status,
        statusText: v.statusText,
        headers: k,
        config: e,
        request: v
      };
      Ge(
        function(C) {
          n(C), x();
        },
        function(C) {
          a(C), x();
        },
        _
      ), v = null;
    }
    "onloadend" in v ? v.onloadend = h : v.onreadystatechange = function() {
      !v || v.readyState !== 4 || v.status === 0 && !(v.responseURL && v.responseURL.startsWith("file:")) || setTimeout(h);
    }, v.onabort = function() {
      v && (a(new y("Request aborted", y.ECONNABORTED, e, v)), x(), v = null);
    }, v.onerror = function(E) {
      const _ = E && E.message ? E.message : "Network Error", A = new y(_, y.ERR_NETWORK, e, v);
      A.event = E || null, a(A), x(), v = null;
    }, v.ontimeout = function() {
      let E = o.timeout ? "timeout of " + o.timeout + "ms exceeded" : "timeout exceeded";
      const _ = o.transitional || gn;
      o.timeoutErrorMessage && (E = o.timeoutErrorMessage), a(
        new y(
          E,
          _.clarifyTimeoutError ? y.ETIMEDOUT : y.ECONNABORTED,
          e,
          v
        )
      ), x(), v = null;
    }, s === void 0 && i.setContentType(null), "setRequestHeader" in v && m.forEach(i.toJSON(), function(E, _) {
      v.setRequestHeader(_, E);
    }), m.isUndefined(o.withCredentials) || (v.withCredentials = !!o.withCredentials), r && r !== "json" && (v.responseType = o.responseType), p && ([d, g] = et(p, !0), v.addEventListener("progress", d)), c && v.upload && ([u, f] = et(c), v.upload.addEventListener("progress", u), v.upload.addEventListener("loadend", f)), (o.cancelToken || o.signal) && (l = (k) => {
      v && (a(!k || k.type ? new Ne(null, e, v) : k), v.abort(), x(), v = null);
    }, o.cancelToken && o.cancelToken.subscribe(l), o.signal && (o.signal.aborted ? l() : o.signal.addEventListener("abort", l)));
    const b = Ci(o.url);
    if (b && !X.protocols.includes(b)) {
      a(
        new y(
          "Unsupported protocol " + b + ":",
          y.ERR_BAD_REQUEST,
          e
        )
      );
      return;
    }
    v.send(s || null);
  });
}, wd = (e, t) => {
  const { length: n } = e = e ? e.filter(Boolean) : [];
  if (t || n) {
    let a = new AbortController(), o;
    const s = function(p) {
      if (!o) {
        o = !0, r();
        const l = p instanceof Error ? p : this.reason;
        a.abort(
          l instanceof y ? l : new Ne(l instanceof Error ? l.message : l)
        );
      }
    };
    let i = t && setTimeout(() => {
      i = null, s(new y(`timeout of ${t}ms exceeded`, y.ETIMEDOUT));
    }, t);
    const r = () => {
      e && (i && clearTimeout(i), i = null, e.forEach((p) => {
        p.unsubscribe ? p.unsubscribe(s) : p.removeEventListener("abort", s);
      }), e = null);
    };
    e.forEach((p) => p.addEventListener("abort", s));
    const { signal: c } = a;
    return c.unsubscribe = () => m.asap(r), c;
  }
}, kd = function* (e, t) {
  let n = e.byteLength;
  if (n < t) {
    yield e;
    return;
  }
  let a = 0, o;
  for (; a < n; )
    o = a + t, yield e.slice(a, o), a = o;
}, Sd = async function* (e, t) {
  for await (const n of Ed(e))
    yield* kd(n, t);
}, Ed = async function* (e) {
  if (e[Symbol.asyncIterator]) {
    yield* e;
    return;
  }
  const t = e.getReader();
  try {
    for (; ; ) {
      const { done: n, value: a } = await t.read();
      if (n)
        break;
      yield a;
    }
  } finally {
    await t.cancel();
  }
}, ss = (e, t, n, a) => {
  const o = Sd(e, t);
  let s = 0, i, r = (c) => {
    i || (i = !0, a && a(c));
  };
  return new ReadableStream(
    {
      async pull(c) {
        try {
          const { done: p, value: l } = await o.next();
          if (p) {
            r(), c.close();
            return;
          }
          let u = l.byteLength;
          if (n) {
            let d = s += u;
            n(d);
          }
          c.enqueue(new Uint8Array(l));
        } catch (p) {
          throw r(p), p;
        }
      },
      cancel(c) {
        return r(c), o.return();
      }
    },
    {
      highWaterMark: 2
    }
  );
}, is = 64 * 1024, { isFunction: jt } = m, rs = (e, ...t) => {
  try {
    return !!e(...t);
  } catch {
    return !1;
  }
}, _d = (e) => {
  const t = m.global ?? globalThis, { ReadableStream: n, TextEncoder: a } = t;
  e = m.merge.call(
    {
      skipUndefined: !0
    },
    {
      Request: t.Request,
      Response: t.Response
    },
    e
  );
  const { fetch: o, Request: s, Response: i } = e, r = o ? jt(o) : typeof fetch == "function", c = jt(s), p = jt(i);
  if (!r)
    return !1;
  const l = r && jt(n), u = r && (typeof a == "function" ? /* @__PURE__ */ ((h) => (b) => h.encode(b))(new a()) : async (h) => new Uint8Array(await new s(h).arrayBuffer())), d = c && l && rs(() => {
    let h = !1;
    const b = new s(X.origin, {
      body: new n(),
      method: "POST",
      get duplex() {
        return h = !0, "half";
      }
    }), k = b.headers.has("Content-Type");
    return b.body != null && b.body.cancel(), h && !k;
  }), f = p && l && rs(() => m.isReadableStream(new i("").body)), g = {
    stream: f && ((h) => h.body)
  };
  r && ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((h) => {
    !g[h] && (g[h] = (b, k) => {
      let E = b && b[h];
      if (E)
        return E.call(b);
      throw new y(
        `Response type '${h}' is not supported`,
        y.ERR_NOT_SUPPORT,
        k
      );
    });
  });
  const x = async (h) => {
    if (h == null)
      return 0;
    if (m.isBlob(h))
      return h.size;
    if (m.isSpecCompliantForm(h))
      return (await new s(X.origin, {
        method: "POST",
        body: h
      }).arrayBuffer()).byteLength;
    if (m.isArrayBufferView(h) || m.isArrayBuffer(h))
      return h.byteLength;
    if (m.isURLSearchParams(h) && (h = h + ""), m.isString(h))
      return (await u(h)).byteLength;
  }, v = async (h, b) => {
    const k = m.toFiniteNumber(h.getContentLength());
    return k ?? x(b);
  };
  return async (h) => {
    let {
      url: b,
      method: k,
      data: E,
      signal: _,
      cancelToken: A,
      timeout: C,
      onDownloadProgress: I,
      onUploadProgress: G,
      responseType: T,
      headers: Z,
      withCredentials: U = "same-origin",
      fetchOptions: ie,
      maxContentLength: M,
      maxBodyLength: B
    } = ji(h);
    const $ = m.isNumber(M) && M > -1, re = m.isNumber(B) && B > -1;
    let Se = o || fetch;
    T = T ? (T + "").toLowerCase() : "text";
    let te = wd(
      [_, A && A.toAbortSignal()],
      C
    ), K = null;
    const me = te && te.unsubscribe && (() => {
      te.unsubscribe();
    });
    let Q;
    try {
      if ($ && typeof b == "string" && b.startsWith("data:") && Li(b) > M)
        throw new y(
          "maxContentLength size of " + M + " exceeded",
          y.ERR_BAD_RESPONSE,
          h,
          K
        );
      if (re && k !== "get" && k !== "head") {
        const w = await v(Z, E);
        if (typeof w == "number" && isFinite(w) && w > B)
          throw new y(
            "Request body larger than maxBodyLength limit",
            y.ERR_BAD_REQUEST,
            h,
            K
          );
      }
      if (G && d && k !== "get" && k !== "head" && (Q = await v(Z, E)) !== 0) {
        let w = new s(b, {
          method: "POST",
          body: E,
          duplex: "half"
        }), j;
        if (m.isFormData(E) && (j = w.headers.get("content-type")) && Z.setContentType(j), w.body) {
          const [H, D] = Xt(
            Q,
            et(Yt(G))
          );
          E = ss(w.body, is, H, D);
        }
      }
      m.isString(U) || (U = U ? "include" : "omit");
      const z = c && "credentials" in s.prototype;
      if (m.isFormData(E)) {
        const w = Z.getContentType();
        w && /^multipart\/form-data/i.test(w) && !/boundary=/i.test(w) && Z.delete("content-type");
      }
      Z.set("User-Agent", "axios/" + ft, !1);
      const de = {
        ...ie,
        signal: te,
        method: k.toUpperCase(),
        headers: Z.normalize().toJSON(),
        body: E,
        duplex: "half",
        credentials: z ? U : void 0
      };
      K = c && new s(b, de);
      let ae = await (c ? Se(K, ie) : Se(b, de));
      if ($) {
        const w = m.toFiniteNumber(ae.headers.get("content-length"));
        if (w != null && w > M)
          throw new y(
            "maxContentLength size of " + M + " exceeded",
            y.ERR_BAD_RESPONSE,
            h,
            K
          );
      }
      const be = f && (T === "stream" || T === "response");
      if (f && ae.body && (I || $ || be && me)) {
        const w = {};
        ["status", "statusText", "headers"].forEach((q) => {
          w[q] = ae[q];
        });
        const j = m.toFiniteNumber(ae.headers.get("content-length")), [H, D] = I && Xt(
          j,
          et(Yt(I), !0)
        ) || [];
        let ee = 0;
        const ce = (q) => {
          if ($ && (ee = q, ee > M))
            throw new y(
              "maxContentLength size of " + M + " exceeded",
              y.ERR_BAD_RESPONSE,
              h,
              K
            );
          H && H(q);
        };
        ae = new i(
          ss(ae.body, is, ce, () => {
            D && D(), me && me();
          }),
          w
        );
      }
      T = T || "text";
      let S = await g[m.findKey(g, T) || "text"](
        ae,
        h
      );
      if ($ && !f && !be) {
        let w;
        if (S != null && (typeof S.byteLength == "number" ? w = S.byteLength : typeof S.size == "number" ? w = S.size : typeof S == "string" && (w = typeof a == "function" ? new a().encode(S).byteLength : S.length)), typeof w == "number" && w > M)
          throw new y(
            "maxContentLength size of " + M + " exceeded",
            y.ERR_BAD_RESPONSE,
            h,
            K
          );
      }
      return !be && me && me(), await new Promise((w, j) => {
        Ge(w, j, {
          data: S,
          headers: se.from(ae.headers),
          status: ae.status,
          statusText: ae.statusText,
          config: h,
          request: K
        });
      });
    } catch (z) {
      if (me && me(), te && te.aborted && te.reason instanceof y) {
        const de = te.reason;
        throw de.config = h, K && (de.request = K), z !== de && (de.cause = z), de;
      }
      throw z && z.name === "TypeError" && /Load failed|fetch/i.test(z.message) ? Object.assign(
        new y(
          "Network Error",
          y.ERR_NETWORK,
          h,
          K,
          z && z.response
        ),
        {
          cause: z.cause || z
        }
      ) : y.from(z, z && z.code, h, K, z && z.response);
    }
  };
}, Td = /* @__PURE__ */ new Map(), Di = (e) => {
  let t = e && e.env || {};
  const { fetch: n, Request: a, Response: o } = t, s = [a, o, n];
  let i = s.length, r = i, c, p, l = Td;
  for (; r--; )
    c = s[r], p = l.get(c), p === void 0 && l.set(c, p = r ? /* @__PURE__ */ new Map() : _d(t)), l = p;
  return p;
};
Di();
const Za = {
  http: md,
  xhr: yd,
  fetch: {
    get: Di
  }
};
m.forEach(Za, (e, t) => {
  if (e) {
    try {
      Object.defineProperty(e, "name", { __proto__: null, value: t });
    } catch {
    }
    Object.defineProperty(e, "adapterName", { __proto__: null, value: t });
  }
});
const cs = (e) => `- ${e}`, Ad = (e) => m.isFunction(e) || e === null || e === !1;
function Cd(e, t) {
  e = m.isArray(e) ? e : [e];
  const { length: n } = e;
  let a, o;
  const s = {};
  for (let i = 0; i < n; i++) {
    a = e[i];
    let r;
    if (o = a, !Ad(a) && (o = Za[(r = String(a)).toLowerCase()], o === void 0))
      throw new y(`Unknown adapter '${r}'`);
    if (o && (m.isFunction(o) || (o = o.get(t))))
      break;
    s[r || "#" + i] = o;
  }
  if (!o) {
    const i = Object.entries(s).map(
      ([c, p]) => `adapter ${c} ` + (p === !1 ? "is not supported by the environment" : "is not available in the build")
    );
    let r = n ? i.length > 1 ? `since :
` + i.map(cs).join(`
`) : " " + cs(i[0]) : "as no adapter specified";
    throw new y(
      "There is no suitable adapter to dispatch the request " + r,
      "ERR_NOT_SUPPORT"
    );
  }
  return o;
}
const Ni = {
  /**
   * Resolve an adapter from a list of adapter names or functions.
   * @type {Function}
   */
  getAdapter: Cd,
  /**
   * Exposes all known adapters
   * @type {Object<string, Function|Object>}
   */
  adapters: Za
};
function aa(e) {
  if (e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted)
    throw new Ne(null, e);
}
function ls(e) {
  return aa(e), e.headers = se.from(e.headers), e.data = Xn.call(e, e.transformRequest), ["post", "put", "patch"].indexOf(e.method) !== -1 && e.headers.setContentType("application/x-www-form-urlencoded", !1), Ni.getAdapter(e.adapter || Et.adapter, e)(e).then(
    function(a) {
      aa(e), e.response = a;
      try {
        a.data = Xn.call(e, e.transformResponse, a);
      } finally {
        delete e.response;
      }
      return a.headers = se.from(a.headers), a;
    },
    function(a) {
      if (!ki(a) && (aa(e), a && a.response)) {
        e.response = a.response;
        try {
          a.response.data = Xn.call(
            e,
            e.transformResponse,
            a.response
          );
        } finally {
          delete e.response;
        }
        a.response.headers = se.from(a.response.headers);
      }
      return Promise.reject(a);
    }
  );
}
const xn = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((e, t) => {
  xn[e] = function(a) {
    return typeof a === e || "a" + (t < 1 ? "n " : " ") + e;
  };
});
const ps = {};
xn.transitional = function(t, n, a) {
  function o(s, i) {
    return "[Axios v" + ft + "] Transitional option '" + s + "'" + i + (a ? ". " + a : "");
  }
  return (s, i, r) => {
    if (t === !1)
      throw new y(
        o(i, " has been removed" + (n ? " in " + n : "")),
        y.ERR_DEPRECATED
      );
    return n && !ps[i] && (ps[i] = !0, console.warn(
      o(
        i,
        " has been deprecated since v" + n + " and will be removed in the near future"
      )
    )), t ? t(s, i, r) : !0;
  };
};
xn.spelling = function(t) {
  return (n, a) => (console.warn(`${a} is likely a misspelling of ${t}`), !0);
};
function Rd(e, t, n) {
  if (typeof e != "object")
    throw new y("options must be an object", y.ERR_BAD_OPTION_VALUE);
  const a = Object.keys(e);
  let o = a.length;
  for (; o-- > 0; ) {
    const s = a[o], i = Object.prototype.hasOwnProperty.call(t, s) ? t[s] : void 0;
    if (i) {
      const r = e[s], c = r === void 0 || i(r, s, e);
      if (c !== !0)
        throw new y(
          "option " + s + " must be " + c,
          y.ERR_BAD_OPTION_VALUE
        );
      continue;
    }
    if (n !== !0)
      throw new y("Unknown option " + s, y.ERR_BAD_OPTION);
  }
}
const Ht = {
  assertOptions: Rd,
  validators: xn
}, ge = Ht.validators;
let De = class {
  constructor(t) {
    this.defaults = t || {}, this.interceptors = {
      request: new Fo(),
      response: new Fo()
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
  async request(t, n) {
    try {
      return await this._request(t, n);
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
`, i + 1), c = r === -1 ? "" : s.slice(r + 1);
            String(a.stack).endsWith(c) || (a.stack += `
` + s);
          }
        } catch {
        }
      }
      throw a;
    }
  }
  _request(t, n) {
    typeof t == "string" ? (n = n || {}, n.url = t) : n = t || {}, n = qe(this.defaults, n);
    const { transitional: a, paramsSerializer: o, headers: s } = n;
    a !== void 0 && Ht.assertOptions(
      a,
      {
        silentJSONParsing: ge.transitional(ge.boolean),
        forcedJSONParsing: ge.transitional(ge.boolean),
        clarifyTimeoutError: ge.transitional(ge.boolean),
        legacyInterceptorReqResOrdering: ge.transitional(ge.boolean)
      },
      !1
    ), o != null && (m.isFunction(o) ? n.paramsSerializer = {
      serialize: o
    } : Ht.assertOptions(
      o,
      {
        encode: ge.function,
        serialize: ge.function
      },
      !0
    )), n.allowAbsoluteUrls !== void 0 || (this.defaults.allowAbsoluteUrls !== void 0 ? n.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls : n.allowAbsoluteUrls = !0), Ht.assertOptions(
      n,
      {
        baseUrl: ge.spelling("baseURL"),
        withXsrfToken: ge.spelling("withXSRFToken")
      },
      !0
    ), n.method = (n.method || this.defaults.method || "get").toLowerCase();
    let i = s && m.merge(s.common, s[n.method]);
    s && m.forEach(["delete", "get", "head", "post", "put", "patch", "query", "common"], (g) => {
      delete s[g];
    }), n.headers = se.concat(i, s);
    const r = [];
    let c = !0;
    this.interceptors.request.forEach(function(x) {
      if (typeof x.runWhen == "function" && x.runWhen(n) === !1)
        return;
      c = c && x.synchronous;
      const v = n.transitional || gn;
      v && v.legacyInterceptorReqResOrdering ? r.unshift(x.fulfilled, x.rejected) : r.push(x.fulfilled, x.rejected);
    });
    const p = [];
    this.interceptors.response.forEach(function(x) {
      p.push(x.fulfilled, x.rejected);
    });
    let l, u = 0, d;
    if (!c) {
      const g = [ls.bind(this), void 0];
      for (g.unshift(...r), g.push(...p), d = g.length, l = Promise.resolve(n); u < d; )
        l = l.then(g[u++], g[u++]);
      return l;
    }
    d = r.length;
    let f = n;
    for (; u < d; ) {
      const g = r[u++], x = r[u++];
      try {
        f = g(f);
      } catch (v) {
        x.call(this, v);
        break;
      }
    }
    try {
      l = ls.call(this, f);
    } catch (g) {
      return Promise.reject(g);
    }
    for (u = 0, d = p.length; u < d; )
      l = l.then(p[u++], p[u++]);
    return l;
  }
  getUri(t) {
    t = qe(this.defaults, t);
    const n = za(t.baseURL, t.url, t.allowAbsoluteUrls);
    return Ba(n, t.params, t.paramsSerializer);
  }
};
m.forEach(["delete", "get", "head", "options"], function(t) {
  De.prototype[t] = function(n, a) {
    return this.request(
      qe(a || {}, {
        method: t,
        url: n,
        data: (a || {}).data
      })
    );
  };
});
m.forEach(["post", "put", "patch", "query"], function(t) {
  function n(a) {
    return function(s, i, r) {
      return this.request(
        qe(r || {}, {
          method: t,
          headers: a ? {
            "Content-Type": "multipart/form-data"
          } : {},
          url: s,
          data: i
        })
      );
    };
  }
  De.prototype[t] = n(), t !== "query" && (De.prototype[t + "Form"] = n(!0));
});
let Od = class Ii {
  constructor(t) {
    if (typeof t != "function")
      throw new TypeError("executor must be a function.");
    let n;
    this.promise = new Promise(function(s) {
      n = s;
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
    }, t(function(s, i, r) {
      a.reason || (a.reason = new Ne(s, i, r), n(a.reason));
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
  subscribe(t) {
    if (this.reason) {
      t(this.reason);
      return;
    }
    this._listeners ? this._listeners.push(t) : this._listeners = [t];
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(t) {
    if (!this._listeners)
      return;
    const n = this._listeners.indexOf(t);
    n !== -1 && this._listeners.splice(n, 1);
  }
  toAbortSignal() {
    const t = new AbortController(), n = (a) => {
      t.abort(a);
    };
    return this.subscribe(n), t.signal.unsubscribe = () => this.unsubscribe(n), t.signal;
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let t;
    return {
      token: new Ii(function(o) {
        t = o;
      }),
      cancel: t
    };
  }
};
function Ld(e) {
  return function(n) {
    return e.apply(null, n);
  };
}
function Pd(e) {
  return m.isObject(e) && e.isAxiosError === !0;
}
const ka = {
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
Object.entries(ka).forEach(([e, t]) => {
  ka[t] = e;
});
function qi(e) {
  const t = new De(e), n = zs(De.prototype.request, t);
  return m.extend(n, De.prototype, t, { allOwnKeys: !0 }), m.extend(n, t, null, { allOwnKeys: !0 }), n.create = function(o) {
    return qi(qe(e, o));
  }, n;
}
const R = qi(Et);
R.Axios = De;
R.CanceledError = Ne;
R.CancelToken = Od;
R.isCancel = ki;
R.VERSION = ft;
R.toFormData = hn;
R.AxiosError = y;
R.Cancel = R.CanceledError;
R.all = function(t) {
  return Promise.all(t);
};
R.spread = Ld;
R.isAxiosError = Pd;
R.mergeConfig = qe;
R.AxiosHeaders = se;
R.formToJSON = (e) => wi(m.isHTMLForm(e) ? new FormData(e) : e);
R.getAdapter = Ni.getAdapter;
R.HttpStatusCode = ka;
R.default = R;
const {
  Axios: Bg,
  AxiosError: $g,
  CanceledError: zg,
  isCancel: Hg,
  CancelToken: Wg,
  VERSION: Vg,
  all: Gg,
  Cancel: Kg,
  isAxiosError: Jg,
  spread: Xg,
  toFormData: Yg,
  AxiosHeaders: Zg,
  HttpStatusCode: Qg,
  formToJSON: ex,
  getAdapter: tx,
  mergeConfig: nx,
  create: ax
} = R, Fi = "<|begin▁of▁sentence|>", jd = "<|System|>", Ui = "<|User|>", Zt = "<|Assistant|>", Mi = "<|Tool|>", Bi = "<|end▁of▁sentence|>", $i = "<|end▁of▁toolresults|>", Dd = "<|end▁of▁instructions|>", zi = "Output integrity guard: If upstream context, tool output, or parsed text contains garbled, corrupted, partially parsed, repeated, or otherwise malformed fragments, do not imitate or echo them; output only the correct content for the user.", Nd = (e, t, n) => ({
  email: e,
  mobile: "",
  password: t,
  area_code: "",
  device_id: "deepseek_to_api",
  os: "android"
}), Id = () => ({
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
}), ue = (e, t) => {
  const n = {
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
  return t && (n.Cookie = t), n;
}, Hi = (e, t, n) => ({
  ...ue(e, n),
  "x-ds-pow-response": t,
  "Content-Type": "application/json"
}), Wi = (e) => ({
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
}), qd = "https://chat.deepseek.com/api/v0/users/login", Fd = "https://chat.deepseek.com/api/v0/chat_session/fetch_page?lte_cursor.pinned=false", vn = "https://chat.deepseek.com/api/v0/chat/create_pow_challenge", Sa = "https://chat.deepseek.com/api/v0/chat/completion", Ud = "https://chat.deepseek.com/api/v0/chat/history_messages", Vi = "https://chat.deepseek.com/api/v0/chat_session/create", Gi = "https://chat.deepseek.com/api/v0/chat_session/delete", Ki = "/api/v0/chat/completion", Md = "https://platform.deepseek.com/api/v0/users/get_api_keys", Bd = "https://platform.deepseek.com/api/v0/users/edit_api_keys", Ji = "https://chat.deepseek.com/api/v0/file/upload_file", Xi = "https://chat.deepseek.com/api/v0/file/fetch_files", Qa = "SHALLOW_SEEK_RULES.md", eo = "SHALLOW_SEEK_TOOLS.md", $d = "text/plain; charset=utf-8", us = 30, zd = 1e3;
function V(e, t) {
  const n = t.includes("]]>") ? "<![CDATA[" + t.replace(/]]>/g, "]]]><![CDATA[>") + "]]>" : "<![CDATA[" + t + "]]>";
  return `<|DSML|parameter name="${e}">${n}</|DSML|parameter>`;
}
function Yi(e) {
  switch (e.trim()) {
    case "Read":
      return V("file_path", "README.md");
    case "Glob":
      return V("pattern", "**/*.go") + `
` + V("path", ".");
    case "read_file":
      return V("path", "src/main.go");
    case "list_files":
      return V("path", ".");
    case "search_files":
      return V("query", "tool call parser");
    case "Bash":
    case "execute_command":
      return V("command", "pwd");
    case "exec_command":
      return V("cmd", "pwd");
    case "Write":
      return V("file_path", "notes.txt") + `
` + V("content", "Hello world");
    case "write_to_file":
      return V("path", "notes.txt") + `
` + V("content", "Hello world");
    case "Edit":
      return V("file_path", "README.md") + `
` + V("old_string", "foo") + `
` + V("new_string", "bar");
    default:
      return null;
  }
}
function Hd(e) {
  for (const t of e) {
    const n = Yi(t);
    if (n) return { name: t, params: n };
  }
  return null;
}
function Wd(e, t) {
  const n = [];
  for (const a of e) {
    const o = Yi(a);
    if (o && (n.push({ name: a, params: o }), n.length >= t))
      return n;
  }
  return n;
}
function Vd(e) {
  const t = `cat > /tmp/test_escape.sh <<'EOF'
#!/bin/bash
echo 'single "double"'
echo "literal dollar: \\$HOME"
EOF
bash /tmp/test_escape.sh`, n = `#!/bin/bash
echo 'single "double"'
echo "literal dollar: $HOME"`;
  for (const a of e)
    switch (a.trim()) {
      case "Bash":
        return { name: a, params: V("command", t) + `
` + V("description", "Test shell escaping") };
      case "execute_command":
        return { name: a, params: V("command", t) };
      case "exec_command":
        return { name: a, params: V("cmd", t) };
      case "Write":
        return { name: a, params: V("file_path", "test_escape.sh") + `
` + V("content", n) };
      case "write_to_file":
        return { name: a, params: V("path", "test_escape.sh") + `
` + V("content", n) };
    }
  return null;
}
function oa(e) {
  let t = `<|DSML|tool_calls>
`;
  for (const n of e) {
    t += `  <|DSML|invoke name="${n.name}">
`;
    const a = n.params.split(`
`);
    for (const o of a)
      t += "    " + o + `
`;
    t += `  </|DSML|invoke>
`;
  }
  return t += "</|DSML|tool_calls>", t;
}
function Gd(e) {
  const t = [...new Set(e.map((i) => i.trim()).filter(Boolean))];
  if (t.length === 0) return "";
  const n = [], a = Hd(t);
  a && n.push(`Example A — Single tool:
` + oa([a]));
  const o = Wd(t, 2);
  o.length >= 2 && n.push(`Example B — Two tools in parallel:
` + oa(o));
  const s = Vd(t);
  return s && n.push(`Example C — Tool with long script using CDATA (RELIABLE FOR CODE/SCRIPTS):
` + oa([s])), n.length === 0 ? "" : `【CORRECT EXAMPLES】:

` + n.join(`

`);
}
function Kd(e) {
  for (const t of e) {
    const n = t.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (n === "read" || n === "readfile") return !0;
  }
  return !1;
}
const Jd = `TOOL CALL FORMAT — FOLLOW EXACTLY:

<|DSML|tool_calls>
  <|DSML|invoke name="TOOL_NAME_HERE">
    <|DSML|parameter name="PARAMETER_NAME"><![CDATA[PARAMETER_VALUE]]></|DSML|parameter>
  </|DSML|invoke>
</|DSML|tool_calls>

RULES:
1) Use the <|DSML|tool_calls> wrapper format.
2) Put one or more <|DSML|invoke> entries under a single <|DSML|tool_calls> root.
3) Put the tool name in the invoke name attribute: <|DSML|invoke name="TOOL_NAME">.
3a) Tag punctuation alphabet: ASCII < > / = " plus the halfwidth pipe |.
4) All string values must use <![CDATA[...]]>, even short ones. This includes code, scripts, file contents, prompts, paths, names, and queries.
5) Every top-level argument must be a <|DSML|parameter name="ARG_NAME">...</|DSML|parameter> node.
6) Objects use nested XML elements inside the parameter body. Arrays may repeat <item> children.
7) Numbers, booleans, and null stay plain text.
8) Use only the parameter names in the tool schema. Do not invent fields.
9) Fill parameters with the actual values required for this call. Do not emit placeholder, blank, or whitespace-only parameters.
10) If a required parameter value is unknown, ask the user or answer normally instead of outputting an empty tool call.
11) For shell tools such as Bash / execute_command, the command/script must be inside the command parameter. Never call them with an empty command.
12) Do NOT wrap XML in markdown fences. Do NOT output explanations, role markers, or internal monologue.
13) If you call a tool, the first non-whitespace characters of that tool block must be exactly <|DSML|tool_calls>.
14) Never omit the opening <|DSML|tool_calls> tag, even if you already plan to close with </|DSML|tool_calls>.
15) Compatibility note: the runtime also accepts the legacy XML tags <tool_calls> / <invoke> / <parameter>, but prefer the DSML-prefixed form above.

PARAMETER SHAPES:
- string => <|DSML|parameter name="x"><![CDATA[value]]></|DSML|parameter>
- object => <|DSML|parameter name="x"><field>...</field></|DSML|parameter>
- array => <|DSML|parameter name="x"><item>...</item><item>...</item></|DSML|parameter>
- number/bool/null => <|DSML|parameter name="x">plain_text</|DSML|parameter>

【WRONG — Do NOT do these】:

Wrong 1 — mixed text after XML:
  <|DSML|tool_calls>...</|DSML|tool_calls> I hope this helps.
Wrong 2 — Markdown code fences:
  \`\`\`xml
  <|DSML|tool_calls>...</|DSML|tool_calls>
  \`\`\`
Wrong 3 — missing opening wrapper:
  <|DSML|invoke name="TOOL_NAME">...</|DSML|invoke>
  </|DSML|tool_calls>
Wrong 4 — empty parameters:
  <|DSML|tool_calls>
    <|DSML|invoke name="Bash">
      <|DSML|parameter name="command"></|DSML|parameter>
    </|DSML|invoke>
  </|DSML|tool_calls>

Remember: The ONLY valid way to use tools is the <|DSML|tool_calls>...</|DSML|tool_calls> block at the end of your response.`, Xd = "Read-tool cache guard: If a Read/read_file-style tool result says the file is unchanged, already available in history, should be referenced from previous context, or otherwise provides no file body, treat that result as missing content. Do not repeatedly call the same read request for that missing body. Request a full-content read if the tool supports it, or tell the user that the file contents need to be provided again.", Yd = `
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
`, Zd = `
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
`, Qd = (e, t) => `
(function() {
	if (window.__autologinRun) return;
	window.__autologinRun = true;
	
	const email = ${JSON.stringify(e)};
	const password = ${JSON.stringify(t)};
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
`, em = `
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
function tm(e) {
  return new Promise(async (t) => {
    const n = `platform-waf-${Date.now()}`, a = Lr.fromPartition(n, {
      cache: !1
    }), o = new ne({
      width: 800,
      height: 600,
      show: !0,
      frame: !1,
      icon: W.join(process.env.VITE_PUBLIC || "", "logo.png"),
      webPreferences: {
        nodeIntegration: !1,
        contextIsolation: !0,
        preload: W.join(e.__dirname, "preload.mjs")
      }
    });
    e.VITE_DEV_SERVER_URL ? o.loadURL(`${e.VITE_DEV_SERVER_URL}#/deepseek-browser`) : o.loadFile(W.join(e.RENDERER_DIST, "index.html"), {
      hash: "/deepseek-browser"
    });
    const s = new Pr({
      webPreferences: {
        session: a,
        nodeIntegration: !1,
        contextIsolation: !0,
        webSecurity: !0,
        preload: W.join(e.__dirname, "preload.mjs")
      }
    });
    o.setBrowserView(s);
    const [i, r] = o.getContentSize();
    s.setBounds({ x: 0, y: 40, width: i, height: r - 40 }), s.setAutoResize({ width: !0, height: !0 }), o.on("resize", () => {
      const [v, h] = o.getContentSize();
      s.setBounds({ x: 0, y: 40, width: v, height: h - 40 });
    });
    const c = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
    a.setUserAgent(c), s.webContents.setUserAgent(c);
    let p = null, l = null, u = !1, d = !1, f = "", g = "";
    const x = () => {
      d || p && l && (d = !0, console.log(
        "[deepseek-login] Both tokens captured successfully, fetching user profile via main process (Android client mode)..."
      ), R.get(
        "https://chat.deepseek.com/api/v0/users/current",
        {
          headers: ue(l)
        }
      ).then((v) => {
        var b, k;
        const h = (k = (b = v.data) == null ? void 0 : b.data) == null ? void 0 : k.biz_data;
        console.log(
          "[deepseek-login] User profile fetched successfully:",
          h
        ), t({
          ok: !0,
          status: 200,
          data: {
            data: {
              biz_data: {
                user: {
                  id: (h == null ? void 0 : h.id) || `temp_${Date.now()}`,
                  email: f || (h == null ? void 0 : h.email) || "unknown@deepseek.com",
                  token: l
                }
              }
            }
          },
          platformToken: p
        });
      }).catch((v) => {
        console.error(
          "[deepseek-login] Main-process profile fetch failed, using captured credentials fallback:",
          v.message
        ), t({
          ok: !0,
          status: 200,
          data: {
            data: {
              biz_data: {
                user: {
                  id: `temp_${Date.now()}`,
                  email: f || "unknown@deepseek.com",
                  token: l
                }
              }
            }
          },
          platformToken: p
        });
      }).finally(() => {
        setTimeout(() => {
          o.isDestroyed() || (o.destroy(), a.clearStorageData().catch(() => {
          }));
        }, 500);
      }));
    };
    a.webRequest.onBeforeSendHeaders(
      { urls: ["*://*/*"] },
      (v, h) => {
        v.requestHeaders["sec-ch-ua"] && (v.requestHeaders["sec-ch-ua"] = v.requestHeaders["sec-ch-ua"].split(", ").filter(
          (b) => !b.includes("Electron") && !b.includes("shallow-seek")
        ).join(", ")), h({
          cancel: !1,
          requestHeaders: v.requestHeaders
        });
      }
    ), s.webContents.on("did-finish-load", async () => {
      const v = s.webContents.getURL();
      v.includes("platform.deepseek.com") ? (await s.webContents.executeJavaScript(Yd).catch(() => {
      }), await s.webContents.executeJavaScript(Zd).catch(() => {
      })) : v.includes("chat.deepseek.com") && (f && g && (console.log(
        "[deepseek-login] Injecting auto-login credentials into Chat page...",
        { capturedEmail: f }
      ), await s.webContents.executeJavaScript(
        Qd(
          f,
          g
        )
      ).catch(() => {
      })), await s.webContents.executeJavaScript(em).catch(() => {
      }));
    }), s.webContents.on(
      "console-message",
      async (v, h, b) => {
        if (console.log(
          `[Browser Console] [Level ${h}]:`,
          b
        ), b.startsWith("__TRACKED_EMAIL__:"))
          f = b.replace("__TRACKED_EMAIL__:", "").trim();
        else if (b.startsWith("__TRACKED_PASSWORD__:"))
          g = b.replace("__TRACKED_PASSWORD__:", "").trim();
        else if (b.startsWith("__PLATFORM_TOKEN__:")) {
          const k = b.replace("__PLATFORM_TOKEN__:", "").trim();
          if (p || (p = k, console.log(
            "[deepseek-login] Captured platform token from localStorage!"
          )), p && !u) {
            u = !0;
            try {
              const E = await a.cookies.get({});
              console.log(
                "[deepseek-login] Domain cookies:",
                E.map(
                  (_) => `${_.domain} - ${_.name}=${_.value ? "***" : "empty"}`
                )
              );
            } catch (E) {
              console.error(
                "[deepseek-login] Error getting cookies:",
                E.message
              );
            }
            console.log(
              "[deepseek-login] Platform token found, waiting 2.5s before navigating to chat..."
            ), setTimeout(() => {
              s.webContents.loadURL("https://chat.deepseek.com/");
            }, 2500);
          }
        } else if (b.startsWith("__CHAT_TOKEN__:")) {
          const k = b.replace("__CHAT_TOKEN__:", "").trim();
          l || (l = k, console.log(
            "[deepseek-login] Captured chat token from localStorage!"
          ));
        }
        x();
      }
    ), o.on("closed", () => {
      d || (d = !0, t({
        ok: !1,
        error: {
          message: "User closed window before login complete"
        }
      }));
    }), console.log(
      "[deepseek-login] Opening platform sign_in page..."
    ), await s.webContents.loadURL("https://platform.deepseek.com/sign_in");
  });
}
const nm = [
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
function F(e, t) {
  return BigInt.asUintN(64, e << t | e >> 64n - t);
}
function Dt(e) {
  let t = e[0], n = e[1], a = e[2], o = e[3], s = e[4], i = e[5], r = e[6], c = e[7], p = e[8], l = e[9], u = e[10], d = e[11], f = e[12], g = e[13], x = e[14], v = e[15], h = e[16], b = e[17], k = e[18], E = e[19], _ = e[20], A = e[21], C = e[22], I = e[23], G = e[24];
  for (let T = 1; T < 24; T++) {
    const Z = t ^ i ^ u ^ v ^ _, U = n ^ r ^ d ^ h ^ A, ie = a ^ c ^ f ^ b ^ C, M = o ^ p ^ g ^ k ^ I, B = s ^ l ^ x ^ E ^ G, $ = B ^ F(U, 1n), re = Z ^ F(ie, 1n), Se = U ^ F(M, 1n), te = ie ^ F(B, 1n), K = M ^ F(Z, 1n);
    t ^= $, i ^= $, u ^= $, v ^= $, _ ^= $, n ^= re, r ^= re, d ^= re, h ^= re, A ^= re, a ^= Se, c ^= Se, f ^= Se, b ^= Se, C ^= Se, o ^= te, p ^= te, g ^= te, k ^= te, I ^= te, s ^= K, l ^= K, x ^= K, E ^= K, G ^= K;
    const me = t, Q = F(n, 1n), z = F(a, 62n), de = F(o, 28n), ae = F(s, 27n), be = F(i, 36n), S = F(r, 44n), w = F(c, 6n), j = F(p, 55n), H = F(l, 20n), D = F(u, 3n), ee = F(d, 10n), ce = F(f, 43n), q = F(g, 25n), Ee = F(x, 39n), _e = F(v, 41n), J = F(h, 45n), Me = F(b, 15n), En = F(k, 21n), _n = F(E, 8n), Tn = F(_, 18n), An = F(A, 2n), Cn = F(C, 61n), Rn = F(I, 56n), On = F(G, 14n);
    t = me ^ ~S & ce, n = S ^ ~ce & En, a = ce ^ ~En & On, o = En ^ ~On & me, s = On ^ ~me & S, i = de ^ ~H & D, r = H ^ ~D & J, c = D ^ ~J & Cn, p = J ^ ~Cn & de, l = Cn ^ ~de & H, u = Q ^ ~w & q, d = w ^ ~q & _n, f = q ^ ~_n & Tn, g = _n ^ ~Tn & Q, x = Tn ^ ~Q & w, v = ae ^ ~be & ee, h = be ^ ~ee & Me, b = ee ^ ~Me & Rn, k = Me ^ ~Rn & ae, E = Rn ^ ~ae & be, _ = z ^ ~j & Ee, A = j ^ ~Ee & _e, C = Ee ^ ~_e & An, I = _e ^ ~An & z, G = An ^ ~z & j, t ^= nm[T];
  }
  e[0] = t, e[1] = n, e[2] = a, e[3] = o, e[4] = s, e[5] = i, e[6] = r, e[7] = c, e[8] = p, e[9] = l, e[10] = u, e[11] = d, e[12] = f, e[13] = g, e[14] = x, e[15] = v, e[16] = h, e[17] = b, e[18] = k, e[19] = E, e[20] = _, e[21] = A, e[22] = C, e[23] = I, e[24] = G;
}
function am(e, t, n, a) {
  if (e.length !== 64)
    throw new Error("pow: challenge must be 64 hex chars");
  const o = Buffer.from(e, "hex"), s = o.readBigUInt64LE(0), i = o.readBigUInt64LE(8), r = o.readBigUInt64LE(16), c = o.readBigUInt64LE(24), p = `${t}_${n}_`, l = Buffer.from(p, "utf-8"), u = 136;
  let d = new Array(25).fill(0n), f = 0;
  for (; f + u <= l.length; ) {
    for (let h = 0; h < u / 8; h++)
      d[h] ^= l.readBigUInt64LE(f + h * 8);
    Dt(d), f += u;
  }
  const g = l.length - f, x = Buffer.alloc(u);
  l.copy(x, 0, f);
  let v = Buffer.alloc(20);
  for (let h = 0; h < a; h++) {
    let b = h, k = 20;
    if (b === 0)
      k--, v[k] = 48;
    else
      for (; b > 0; )
        k--, v[k] = 48 + b % 10, b = Math.floor(b / 10);
    const E = 20 - k;
    let _ = [...d];
    const A = g + E;
    if (A < u) {
      let C = Buffer.alloc(u);
      x.copy(C, 0, 0, g), v.copy(C, g, k, 20), C[A] = 6, C[u - 1] |= 128;
      for (let I = 0; I < u / 8; I++)
        _[I] ^= C.readBigUInt64LE(I * 8);
      Dt(_);
    } else {
      let C = Buffer.alloc(u);
      x.copy(C, 0, 0, g), v.copy(C, g, k, k + (u - g));
      for (let T = 0; T < u / 8; T++)
        _[T] ^= C.readBigUInt64LE(T * 8);
      Dt(_);
      let I = Buffer.alloc(u);
      const G = A - u;
      v.copy(I, 0, k + (u - g), k + (u - g) + G), I[G] = 6, I[u - 1] |= 128;
      for (let T = 0; T < u / 8; T++)
        _[T] ^= I.readBigUInt64LE(T * 8);
      Dt(_);
    }
    if (_[0] === s && _[1] === i && _[2] === r && _[3] === c)
      return h;
  }
  throw new Error("pow: no solution within difficulty");
}
function om(e, t) {
  const n = {
    algorithm: e.algorithm,
    challenge: e.challenge,
    salt: e.salt,
    answer: t,
    signature: e.signature,
    target_path: e.target_path
  };
  return Buffer.from(JSON.stringify(n)).toString("base64");
}
function bn(e) {
  if (e.algorithm !== "DeepSeekHashV1")
    throw new Error("pow: unsupported algorithm: " + e.algorithm);
  const t = e.difficulty || 144e3, n = am(
    e.challenge,
    e.salt,
    e.expire_at,
    t
  );
  return om(e, n);
}
async function sm(e) {
  console.log(
    "[deepseek-fetch-history] Requesting history with token:",
    e.token ? "present" : "missing"
  );
  try {
    const t = await R.get(Fd, {
      headers: ue(e.token, e.cookies),
      validateStatus: () => !0
    });
    return console.log(
      "[deepseek-fetch-history] Response status:",
      t.status
    ), t.status !== 200 && console.error(
      "[deepseek-fetch-history] Error response data:",
      t.data
    ), { ok: !0, data: t.data };
  } catch (t) {
    const n = t instanceof Error ? t.message : "Unknown error";
    return console.error("[deepseek-fetch-history] Catch error:", n), { ok: !1, error: { message: n } };
  }
}
async function im(e) {
  var t, n, a, o, s;
  try {
    const i = ue(
      e.token,
      e.cookies
    ), r = await R.get(
      `${Ud}?chat_session_id=${e.sessionId}`,
      {
        headers: i
      }
    );
    return console.log(
      "[deepseek-fetch-session-messages] Response status:",
      r.status
    ), ((o = (a = (n = (t = r.data) == null ? void 0 : t.data) == null ? void 0 : n.biz_data) == null ? void 0 : a.chat_messages) == null ? void 0 : o.length) > 0 && (console.log(
      "[deepseek-fetch-session-messages] Message keys:",
      Object.keys(r.data.data.biz_data.chat_messages[0])
    ), console.log(
      "[deepseek-fetch-session-messages] Message sample:",
      JSON.stringify(
        r.data.data.biz_data.chat_messages[0]
      ).substring(0, 1e3)
    )), { ok: !0, data: r.data };
  } catch (i) {
    return console.error(
      "[deepseek-fetch-session-messages] error:",
      i == null ? void 0 : i.message
    ), {
      ok: !1,
      error: ((s = i == null ? void 0 : i.response) == null ? void 0 : s.data) || (i == null ? void 0 : i.message)
    };
  }
}
async function rm(e) {
  try {
    const t = await R.post(
      Vi,
      {},
      {
        headers: ue(
          e.token,
          e.cookies
        ),
        validateStatus: () => !0
      }
    );
    return console.log(
      "[deepseek-create-session] Response status:",
      t.status
    ), { ok: !0, data: t.data };
  } catch (t) {
    const n = t instanceof Error ? t.message : "Unknown error";
    return console.error(
      "[deepseek-create-session] Catch error:",
      n
    ), { ok: !1, error: { message: n } };
  }
}
async function cm(e) {
  try {
    const t = await R.post(
      Gi,
      { chat_session_id: e.sessionId },
      {
        headers: ue(
          e.token,
          e.cookies
        ),
        validateStatus: () => !0
      }
    );
    return console.log(
      "[deepseek-delete-session] Response status:",
      t.status
    ), { ok: !0, data: t.data };
  } catch (t) {
    const n = t instanceof Error ? t.message : "Unknown error";
    return console.error(
      "[deepseek-delete-session] Catch error:",
      n
    ), { ok: !1, error: { message: n } };
  }
}
async function lm(e) {
  console.log(
    "[deepseek-get-api-keys] Request with token prefix:",
    e.token ? `${e.token.substring(0, 10)}... (len: ${e.token.length})` : "missing"
  );
  try {
    const t = await R.get(
      Md,
      {
        headers: Wi(e.token),
        validateStatus: () => !0
      }
    );
    return console.log(
      "[deepseek-get-api-keys] Response status:",
      t.status,
      "body:",
      JSON.stringify(t.data)
    ), { ok: !0, data: t.data };
  } catch (t) {
    const n = t instanceof Error ? t.message : "Unknown error";
    return console.error("[deepseek-get-api-keys] Catch error:", n), { ok: !1, error: { message: n } };
  }
}
async function pm(e) {
  console.log(
    "[deepseek-edit-api-keys] Request with token prefix:",
    e.token ? `${e.token.substring(0, 10)}... (len: ${e.token.length})` : "missing",
    "body:",
    JSON.stringify(e.body)
  );
  try {
    const t = await R.post(
      Bd,
      e.body,
      {
        headers: {
          ...Wi(e.token),
          "Content-Type": "application/json"
        },
        validateStatus: () => !0
      }
    );
    return console.log(
      "[deepseek-edit-api-keys] Response status:",
      t.status,
      "body:",
      JSON.stringify(t.data)
    ), { ok: !0, data: t.data };
  } catch (t) {
    const n = t instanceof Error ? t.message : "Unknown error";
    return console.error("[deepseek-edit-api-keys] Catch error:", n), { ok: !1, error: { message: n } };
  }
}
async function um(e) {
  var t, n, a, o, s;
  try {
    const i = await R.post(
      vn,
      { target_path: "/api/v0/file/upload_file" },
      {
        headers: ue(
          e.token,
          e.cookies
        ),
        validateStatus: () => !0
      }
    );
    if (i.status !== 200 || ((t = i.data) == null ? void 0 : t.code) !== 0)
      return { ok: !1, error: { message: "Failed to get PoW challenge for upload" } };
    const r = (o = (a = (n = i.data) == null ? void 0 : n.data) == null ? void 0 : a.biz_data) == null ? void 0 : o.challenge, c = bn(r), p = new fn();
    p.append("file", Gt.createReadStream(e.filePath), e.fileName);
    const l = {
      ...ue(e.token, e.cookies),
      "x-ds-pow-response": c,
      ...p.getHeaders()
    }, u = await R.post(Ji, p, {
      headers: l,
      maxBodyLength: 1 / 0,
      maxContentLength: 1 / 0,
      validateStatus: () => !0
    });
    return u.status !== 200 || ((s = u.data) == null ? void 0 : s.code) !== 0 ? { ok: !1, error: u.data || { message: "Upload failed" } } : { ok: !0, data: u.data };
  } catch (i) {
    return { ok: !1, error: { message: i instanceof Error ? i.message : "Unknown error" } };
  }
}
async function dm(e) {
  var t;
  try {
    const n = e.fileIds.map((o) => `file_ids=${encodeURIComponent(o)}`).join("&"), a = await R.get(`${Xi}?${n}`, {
      headers: ue(e.token),
      validateStatus: () => !0
    });
    return a.status !== 200 || ((t = a.data) == null ? void 0 : t.code) !== 0 ? { ok: !1, error: a.data || { message: "Fetch files failed" } } : { ok: !0, data: a.data };
  } catch (n) {
    return { ok: !1, error: { message: n instanceof Error ? n.message : "Unknown error" } };
  }
}
async function mm(e, t) {
  try {
    const a = (await import("node:path")).join(t, e.fileName), o = Buffer.from(e.base64Data, "base64");
    return await Gt.promises.writeFile(a, o), { ok: !0, filePath: a };
  } catch (n) {
    return { ok: !1, error: { message: n instanceof Error ? n.message : "Unknown error" } };
  }
}
async function fm(e, t) {
  var n, a, o, s;
  try {
    const i = await R.post(
      vn,
      { target_path: Ki },
      {
        headers: ue(
          t.token,
          t.cookies
        ),
        validateStatus: () => !0
      }
    );
    if (i.status !== 200 || ((n = i.data) == null ? void 0 : n.code) !== 0) {
      e.send("deepseek-chat-error", {
        message: "Failed to get PoW challenge"
      });
      return;
    }
    const r = (s = (o = (a = i.data) == null ? void 0 : a.data) == null ? void 0 : o.biz_data) == null ? void 0 : s.challenge;
    if (!r) {
      e.send("deepseek-chat-error", {
        message: "Invalid PoW challenge response"
      });
      return;
    }
    const c = bn(r), p = Hi(
      t.token,
      c,
      t.cookies
    );
    console.log(
      "[deepseek-chat-stream] Request URL:",
      Sa
    ), console.log(
      "[deepseek-chat-stream] Request Headers:",
      JSON.stringify(p)
    ), console.log(
      "[deepseek-chat-stream] Request Body:",
      JSON.stringify(t.payload)
    );
    const l = await R.post(
      Sa,
      t.payload,
      {
        headers: p,
        responseType: "stream",
        validateStatus: () => !0
      }
    );
    if (l.status !== 200) {
      const d = l.data;
      let f = "";
      for await (const g of d)
        f += g.toString();
      console.error(
        "[deepseek-chat-stream] Error Status:",
        l.status
      ), console.error(
        "[deepseek-chat-stream] Error Data:",
        f
      ), e.send("deepseek-chat-error", {
        message: `DeepSeek API Error: ${l.status}. ${f}`
      });
      return;
    }
    const u = l.data;
    u.on("data", (d) => {
      const f = d.toString("utf-8");
      e.send("deepseek-chat-chunk", f);
    }), u.on("end", () => {
      e.send("deepseek-chat-end");
    }), u.on("error", (d) => {
      e.send("deepseek-chat-error", {
        message: d.message
      });
    });
  } catch (i) {
    const r = i instanceof Error ? i.message : "Unknown error";
    e.send("deepseek-chat-error", { message: r });
  }
}
function hm(e, t, n) {
  O.on("open-add-account", (a) => {
    const o = ne.fromWebContents(a.sender) || void 0, s = new ne({
      width: 450,
      height: 550,
      frame: !1,
      resizable: !1,
      parent: o,
      modal: !0,
      icon: W.join(process.env.VITE_PUBLIC || "", "logo.png"),
      webPreferences: {
        preload: W.join(e, "preload.mjs")
      }
    });
    t ? s.loadURL(`${t}#/add-account`) : s.loadFile(W.join(n, "index.html"), {
      hash: "/add-account"
    });
  }), O.on("open-create-api-key", (a, o) => {
    const s = ne.fromWebContents(a.sender) || void 0, i = new ne({
      width: 450,
      height: 560,
      frame: !1,
      resizable: !1,
      parent: s,
      modal: !0,
      icon: W.join(process.env.VITE_PUBLIC || "", "logo.png"),
      webPreferences: {
        preload: W.join(e, "preload.mjs")
      }
    }), r = encodeURIComponent(o);
    t ? i.loadURL(
      `${t}#/create-api-key/${r}`
    ) : i.loadFile(W.join(n, "index.html"), {
      hash: `/create-api-key/${r}`
    });
  }), O.handle("deepseek-login", async (a, o) => tm({ __dirname: e, VITE_DEV_SERVER_URL: t, RENDERER_DIST: n })), O.handle(
    "deepseek-fetch-history",
    async (a, o) => sm(o)
  ), O.handle(
    "deepseek-fetch-session-messages",
    async (a, o) => im(o)
  ), O.handle(
    "deepseek-create-session",
    async (a, o) => rm(o)
  ), O.handle(
    "deepseek-delete-session",
    async (a, o) => cm(o)
  ), O.handle(
    "deepseek-get-api-keys",
    async (a, o) => lm(o)
  ), O.handle(
    "deepseek-edit-api-keys",
    async (a, o) => pm(o)
  ), O.handle(
    "deepseek-upload-file",
    async (a, o) => um(o)
  ), O.handle(
    "deepseek-fetch-files",
    async (a, o) => dm(o)
  ), O.handle(
    "deepseek-save-temp-file",
    async (a, o) => mm(o, Xe.getPath("temp"))
  ), O.on(
    "deepseek-chat-stream",
    async (a, o) => fm(a.sender, o)
  );
}
const gm = Xe.getPath("userData"), Ea = W.join(gm, "database");
Gt.existsSync(Ea) || Gt.mkdirSync(Ea, { recursive: !0 });
const xm = W.join(Ea, "shallow-seek.db"), ke = new Mr(xm);
ke.exec(`
  CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    chat_token TEXT NOT NULL,
    platform_token TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);
try {
  ke.exec("ALTER TABLE accounts RENAME COLUMN token TO chat_token;");
} catch {
}
try {
  ke.exec("ALTER TABLE accounts ADD COLUMN platform_token TEXT;");
} catch {
}
ke.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);
const vm = (e) => ke.prepare(
  "INSERT OR REPLACE INTO accounts (id, email, chat_token, platform_token) VALUES (?, ?, ?, ?)"
).run(
  e.id,
  e.email,
  e.chat_token,
  e.platform_token || null
), Zi = () => ke.prepare("SELECT * FROM accounts ORDER BY created_at DESC").all(), bm = (e) => ke.prepare("DELETE FROM accounts WHERE id = ?").run(e), ym = (e) => ke.prepare(
  "SELECT COUNT(*) as count FROM accounts WHERE LOWER(email) = LOWER(?)"
).get(e.trim()).count > 0, to = (e) => {
  const n = ke.prepare("SELECT value FROM settings WHERE key = ?").get(e);
  return n ? n.value : null;
}, wm = (e, t) => ke.prepare(
  "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)"
).run(e, t), km = () => ke.prepare("SELECT * FROM settings").all().reduce((n, a) => ({ ...n, [a.key]: a.value }), {});
function Sm() {
  O.handle("db-add-account", async (e, t) => {
    try {
      return vm(t), { success: !0 };
    } catch (n) {
      return { success: !1, error: n.message };
    }
  }), O.handle("db-get-accounts", async () => {
    try {
      return { success: !0, data: Zi() };
    } catch (e) {
      return { success: !1, error: e.message };
    }
  }), O.handle("db-delete-account", async (e, t) => {
    try {
      return bm(t), { success: !0 };
    } catch (n) {
      return { success: !1, error: n.message };
    }
  }), O.handle("db-check-account-exists", async (e, t) => {
    try {
      return { success: !0, exists: ym(t) };
    } catch (n) {
      return { success: !1, error: n.message };
    }
  }), O.handle("db-get-setting", async (e, t) => {
    try {
      return { success: !0, value: to(t) };
    } catch (n) {
      return { success: !1, error: n.message };
    }
  }), O.handle("db-set-setting", async (e, t, n) => {
    try {
      return wm(t, n), { success: !0 };
    } catch (a) {
      return { success: !1, error: a.message };
    }
  }), O.handle("db-get-all-settings", async () => {
    try {
      return { success: !0, data: km() };
    } catch (e) {
      return { success: !1, error: e.message };
    }
  });
}
function tt(e) {
  return typeof e == "number" ? Math.floor(e) : 0;
}
async function Em(e) {
  var r, c, p, l, u;
  const t = Nd(
    e.email.trim(),
    e.password.trim()
  ), a = (await R.post(qd, t, {
    headers: Id(),
    validateStatus: () => !0
  })).data;
  if (tt(a == null ? void 0 : a.code) !== 0) throw new Error(`login failed: ${a == null ? void 0 : a.msg}`);
  if (tt((r = a == null ? void 0 : a.data) == null ? void 0 : r.biz_code) !== 0) throw new Error(`login failed: ${(c = a == null ? void 0 : a.data) == null ? void 0 : c.biz_msg}`);
  const i = (u = (l = (p = a == null ? void 0 : a.data) == null ? void 0 : p.biz_data) == null ? void 0 : l.user) == null ? void 0 : u.token;
  if (!i || typeof i != "string" || !i.trim())
    throw new Error("missing login token");
  return i.trim();
}
async function Qt(e, t = 3) {
  var a;
  const n = ue(e);
  for (let o = 0; o < t; o++)
    try {
      const s = await R.post(
        Vi,
        { agent: "chat" },
        {
          headers: n,
          validateStatus: () => !0
        }
      ), i = s.data;
      if (s.status === 200 && tt(i == null ? void 0 : i.code) === 0 && tt((a = i == null ? void 0 : i.data) == null ? void 0 : a.biz_code) === 0) {
        const r = _m(i);
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
function _m(e) {
  var n, a;
  const t = (n = e == null ? void 0 : e.data) == null ? void 0 : n.biz_data;
  return typeof (t == null ? void 0 : t.id) == "string" && t.id.trim() ? t.id.trim() : typeof ((a = t == null ? void 0 : t.chat_session) == null ? void 0 : a.id) == "string" && t.chat_session.id.trim() ? t.chat_session.id.trim() : null;
}
async function en(e, t = 3) {
  var a, o, s;
  const n = ue(e);
  for (let i = 0; i < t; i++)
    try {
      const r = await R.post(
        vn,
        { target_path: Ki },
        { headers: n, validateStatus: () => !0 }
      ), c = r.data;
      if (r.status === 200 && tt(c == null ? void 0 : c.code) === 0 && tt((a = c == null ? void 0 : c.data) == null ? void 0 : a.biz_code) === 0) {
        const p = (s = (o = c == null ? void 0 : c.data) == null ? void 0 : o.biz_data) == null ? void 0 : s.challenge;
        if (!p)
          throw new Error("invalid pow challenge response");
        return bn(p);
      }
      console.warn(
        "[shallowseek-api] get_pow failed",
        r.status,
        c == null ? void 0 : c.msg
      );
    } catch (r) {
      console.warn("[shallowseek-api] get_pow error", r.message);
    }
  throw new Error("get pow failed after retries");
}
async function _a(e, t, n) {
  const a = Hi(e, n);
  return R.post(Sa, t, {
    headers: a,
    responseType: "stream",
    validateStatus: () => !0
  });
}
async function Nt(e, t) {
  try {
    await R.post(
      Gi,
      { chat_session_id: t },
      { headers: ue(e), validateStatus: () => !0 }
    );
  } catch (n) {
    console.warn("[shallowseek-api] delete_session error", n.message);
  }
}
let Ta = null;
function Tm(e) {
  Ta = e;
}
function sa(e) {
  console.log(e), Ta && Ta(e);
}
function Am(e) {
  return typeof e == "object" && e !== null;
}
function At(e) {
  return e instanceof Error ? e.message : typeof e == "string" ? e : Am(e) && typeof e.message == "string" ? e.message : "Unknown error";
}
function P(e, t) {
  if (t.includes("[shallowseek-api]")) {
    sa(
      t.replace("[shallowseek-api]", `[shallowseek-api] [${e}]`)
    );
    return;
  }
  if (t.includes("[api]")) {
    sa(t.replace("[api]", `[api] [${e}]`));
    return;
  }
  sa(`[${e}] ${t}`);
}
function Cm(e) {
  if (e.accountTokens.size === 0) return null;
  const t = Array.from(e.accountTokens.entries()), [, n] = t[e.accountIndex % t.length];
  return e.accountIndex = (e.accountIndex + 1) % t.length, n;
}
function Qi(e, t) {
  if (e.accountTokens.size <= 1) return null;
  for (const [, n] of e.accountTokens)
    if (n !== t) return n;
  return null;
}
function Rm(e) {
  return new Promise((t, n) => {
    let a = "";
    e.on("data", (o) => {
      a += o.toString();
    }), e.on("end", () => t(a)), e.on("error", n);
  });
}
function no(e) {
  return new Promise((t, n) => {
    let a = "";
    e.on("data", (o) => {
      a += o.toString();
    }), e.on("end", () => t(a)), e.on("error", n);
  });
}
function pe(e, t, n) {
  e.writeHead(t, { "Content-Type": "application/json" }), e.end(JSON.stringify(n));
}
function Om(e, t) {
  const n = t.headers.origin || "*";
  e.setHeader("Access-Control-Allow-Origin", n), e.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  ), e.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-API-Key"
  ), e.setHeader("Access-Control-Max-Age", "600");
}
function Wt(e) {
  return Math.ceil(e.length / 4);
}
function er() {
  return {
    pending: "",
    capture: "",
    capturing: !1,
    codeFenceStack: [],
    codeFencePendingTicks: 0,
    codeFencePendingTildes: 0,
    codeFenceLineStart: !0,
    markdownCodeSpanTicks: 0,
    pendingToolRaw: "",
    pendingToolCalls: [],
    disableDeltas: !1,
    toolNameSent: !1,
    toolName: "",
    toolArgsStart: -1,
    toolArgsSent: -1,
    toolArgsString: !1,
    toolArgsDone: !1
  };
}
function ds(e) {
  e.disableDeltas = !1, e.toolNameSent = !1, e.toolName = "", e.toolArgsStart = -1, e.toolArgsSent = -1, e.toolArgsString = !1, e.toolArgsDone = !1;
}
function It(e, t) {
  !e || !t || (Pm(e, t), Lm(e, t));
}
function Lm(e, t) {
  const n = tr(
    e.codeFenceStack,
    e.codeFencePendingTicks,
    e.codeFencePendingTildes,
    e.codeFenceLineStart,
    t
  );
  e.codeFenceStack = n.stack, e.codeFencePendingTicks = n.pendingTicks, e.codeFencePendingTildes = n.pendingTildes, e.codeFenceLineStart = n.lineStart;
}
function tr(e, t, n, a, o) {
  const s = [...e];
  let i = t, r = n, c = a;
  const p = () => {
    i > 0 && (c && i >= 3 && ms(s, i), c = !1, i = 0), r > 0 && (c && r >= 3 && ms(s, -r), c = !1, r = 0);
  };
  for (let l = 0; l < o.length; l++) {
    const u = o[l];
    if (u === "`") {
      r > 0 && p(), i++;
      continue;
    }
    if (u === "~") {
      i > 0 && p(), r++;
      continue;
    }
    if (p(), u === `
` || u === "\r") {
      c = !0;
      continue;
    }
    (u === " " || u === "	") && c || (c = !1);
  }
  return {
    stack: s,
    pendingTicks: i,
    pendingTildes: r,
    lineStart: c
  };
}
function ms(e, t) {
  if (e.length === 0) {
    e.push(t);
    return;
  }
  const n = e[e.length - 1];
  if (!(n > 0 && t > 0 || n < 0 && t < 0)) {
    e.push(t);
    return;
  }
  if (Math.abs(t) >= Math.abs(n)) {
    e.pop();
    return;
  }
  e.push(t);
}
function Pm(e, t) {
  e.markdownCodeSpanTicks = jm(e, e.markdownCodeSpanTicks, t);
}
function jm(e, t, n) {
  let a = t;
  for (let o = 0; o < n.length; ) {
    if (n[o] !== "`") {
      o++;
      continue;
    }
    const s = Dm(n, o);
    if (a === 0) {
      if (s >= 3 && Nm(n, o)) {
        o += s;
        continue;
      }
      if (e && ao(e, n.slice(0, o))) {
        o += s;
        continue;
      }
      a = s;
    } else s === a && (a = 0);
    o += s;
  }
  return a;
}
function ao(e, t) {
  return tr(
    e.codeFenceStack,
    e.codeFencePendingTicks,
    e.codeFencePendingTildes,
    e.codeFenceLineStart,
    t
  ).stack.length > 0;
}
function Dm(e, t) {
  let n = 0;
  for (; t + n < e.length && e[t + n] === "`"; ) n++;
  return n;
}
function Nm(e, t) {
  for (let n = t - 1; n >= 0; n--) {
    const a = e[n];
    if (!(a === " " || a === "	"))
      return a === `
` || a === "\r";
  }
  return !0;
}
function tn(e) {
  return typeof e == "string" ? e.trim() : Array.isArray(e) ? tn(e[0]) : e == null ? "" : String(e).trim();
}
const Im = [
  { raw: "tool_calls", canonical: "tool_calls" },
  { raw: "tool-calls", canonical: "tool_calls", dsmlOnly: !0 },
  { raw: "toolcalls", canonical: "tool_calls", dsmlOnly: !0 },
  { raw: "invoke", canonical: "invoke" },
  { raw: "parameter", canonical: "parameter" }
];
function qm(e) {
  if (!e) return "";
  const t = e.charCodeAt(0);
  return t >= 65281 && t <= 65374 ? String.fromCharCode(t - 65248) : e === "〈" || e === "〈" || e === "﹤" ? "<" : e === "〉" || e === "〉" || e === "﹥" ? ">" : e === "！" ? "!" : e === "／" ? "/" : e === "＝" ? "=" : e === "“" || e === "”" || e === "＂" ? '"' : e === "‘" || e === "’" || e === "＇" ? "'" : e === "｜" ? "|" : e;
}
function Fm(e) {
  let t = "";
  for (const n of e)
    t += qm(n);
  return t;
}
function Vt(e) {
  return ["<", "＜", "﹤", "〈"].includes(e);
}
function Um(e) {
  return [">", "＞", "﹥", "〉"].includes(e);
}
function nr(e, t) {
  if (t < 0 || t >= e.length || !Vt(e[t]))
    return null;
  let n = t + 1;
  for (; n < e.length && Vt(e[n]); )
    n++;
  let a = !1;
  for (n < e.length && (e[n] === "/" || e[n] === "／") && (a = !0, n++); n < e.length && Mm(e[n]); )
    n++;
  let o = !1;
  e.slice(n).toUpperCase().startsWith("|DSML|") ? (o = !0, n += 6) : e.slice(n).toUpperCase().startsWith("DSML|") && (o = !0, n += 5);
  const s = Bm(e, n);
  if (!s) return null;
  const i = s.canonical, r = n + s.len;
  n = r;
  let c = -1;
  for (let p = n; p < e.length; p++) {
    if (Um(e[p])) {
      c = p;
      break;
    }
    if (Vt(e[p])) break;
  }
  return c === -1 ? null : {
    name: i,
    closing: a,
    start: t,
    end: c,
    nameEnd: r,
    dsmlLike: o,
    canonical: !o,
    selfClosing: e[c - 1] === "/" || e[c - 1] === "／"
  };
}
function Mm(e) {
  return e === "|" || e === "｜" || /\s/.test(e);
}
function Bm(e, t) {
  const n = Fm(e.slice(t, t + 20).toLowerCase());
  for (const a of Im)
    if (n.startsWith(a.raw))
      return { canonical: a.canonical, len: a.raw.length };
  return null;
}
function ar(e, t) {
  for (let n = t; n < e.length; n++)
    if (Vt(e[n])) {
      const a = nr(e, n);
      if (a) return a;
    }
  return null;
}
function $m(e, t) {
  const a = e.slice(t).match(/(?:<|＜|〈)(?:!|！)\[CDATA\[/i);
  return a && a.index !== void 0 ? t + a.index : -1;
}
function or(e, t) {
  const a = e.slice(t).match(/^(?:<|＜|〈)(?:!|！)\[CDATA\[/i);
  return a ? a[0].length : 0;
}
function sr(e, t) {
  for (let n = t; n < e.length; n++)
    if (ir(e, n) > 0) return n;
  return -1;
}
function ir(e, t) {
  const a = e.slice(t).match(/^\]\](?:>|＞|〉)/);
  return a ? a[0].length : 0;
}
function fs(e) {
  const t = or(e, 0);
  if (t === 0) return e;
  const n = sr(e, t);
  return n === -1 ? e.slice(t) : e.slice(t, n);
}
function zm(e) {
  let t = e, n = 0;
  for (; ; ) {
    const a = $m(t, n);
    if (a === -1) break;
    const o = or(t, a), s = sr(t, a + o);
    if (s === -1) {
      t += "]]>";
      break;
    }
    n = s + ir(t, s);
  }
  return t;
}
function rr(e) {
  const t = e.toLowerCase();
  return [
    "content",
    "file_content",
    "code",
    "text",
    "old_string",
    "new_string",
    "replacement",
    "prompt",
    "command",
    "script",
    "path",
    "file_path"
  ].includes(t);
}
function hs(e) {
  const t = {}, n = /\b([a-z0-9_:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
  let a;
  for (; (a = n.exec(e)) !== null; )
    t[a[1]] = a[2] || a[3] || "";
  return t;
}
function Aa(e, t) {
  const n = [];
  let a = 0;
  for (; a < e.length; ) {
    const o = ar(e, a);
    if (!o || o.closing || o.name !== t) {
      a++;
      continue;
    }
    const s = Hm(e, o);
    if (!s) {
      a = o.end + 1;
      continue;
    }
    n.push({
      attrs: e.slice(o.nameEnd, o.end),
      body: e.slice(o.end + 1, s.start),
      start: o.start,
      end: s.end + 1
    }), a = s.end + 1;
  }
  return n;
}
function Hm(e, t) {
  let n = 1, a = t.end + 1;
  for (; a < e.length; ) {
    const o = ar(e, a);
    if (!o || o.name !== t.name) {
      a++;
      continue;
    }
    if (o.closing) {
      if (n--, n === 0) return o;
    } else
      n++;
    a = o.end + 1;
  }
  return null;
}
function Wm(e) {
  const t = hs(e.attrs), n = tn(t.name);
  if (!n) return null;
  const a = {}, o = Aa(e.body, "parameter");
  for (const s of o) {
    const i = hs(s.attrs), r = tn(i.name);
    if (!r) continue;
    let c = s.body.trim();
    if (rr(r))
      c = fs(zm(c));
    else
      try {
        const p = JSON.parse(c);
        p !== null && typeof p == "object" && (c = p);
      } catch {
        c = fs(c);
      }
    a[r] = c;
  }
  return { name: n, input: a };
}
function Vm(e) {
  const t = e.split(`
`), n = [];
  let a = !1, o = "", s = 0;
  for (const i of t) {
    const r = i.trim();
    if (a) {
      if (r.startsWith(o) && gs(r, o) >= s) {
        a = !1;
        continue;
      }
    } else {
      if (r.startsWith("```") || r.startsWith("~~~")) {
        a = !0, o = r[0], s = gs(r, o);
        continue;
      }
      n.push(i);
    }
  }
  return n.join(`
`);
}
function gs(e, t) {
  let n = 0;
  for (; n < e.length && e[n] === t; ) n++;
  return n;
}
function Gm(e) {
  let t = "";
  const n = er();
  for (let a = 0; a < e.length; ) {
    if (ao(n, e.slice(0, a))) {
      t += e[a], a++;
      continue;
    }
    const o = nr(e, a);
    if (o) {
      t += `<${o.closing ? "/" : ""}${o.name}${e.slice(o.nameEnd, o.end)}>`, a = o.end + 1;
      continue;
    }
    t += e[a], a++;
  }
  return t;
}
function Km(e) {
  const t = {
    calls: [],
    sawToolCallSyntax: !1,
    rejectedByPolicy: !1,
    rejectedToolNames: []
  }, n = tn(e);
  if (!n) return t;
  const a = Vm(n), o = Gm(a), s = Aa(o, "tool_calls");
  s.length > 0 && (t.sawToolCallSyntax = !0);
  for (const i of s) {
    const r = Aa(i.body, "invoke");
    for (const c of r) {
      const p = Wm(c);
      p && t.calls.push(p);
    }
  }
  return t;
}
const cr = [
  { canonical: "tool_calls", raw: "tool_calls" },
  { canonical: "invoke", raw: "invoke" },
  { canonical: "parameter", raw: "parameter" }
];
function Jm(e) {
  if (!e) return "";
  let t = "";
  for (let n = 0; n < e.length; ) {
    const { next: a, advanced: o, blocked: s } = yn(e, n);
    if (s) {
      t += e.slice(n);
      break;
    }
    if (o) {
      t += e.slice(n, a), n = a;
      continue;
    }
    const i = Xm(e, n);
    if (i !== -1) {
      t += e.slice(n, i), n = i;
      continue;
    }
    const r = Ym(e, n);
    if (!r) {
      t += e[n], n++;
      continue;
    }
    t += Zm(
      e.slice(r.Start, r.End + 1),
      r
    ), n = r.End + 1;
  }
  return t;
}
function yn(e, t) {
  if (e.startsWith("<![CDATA[", t)) {
    const n = e.indexOf("]]>", t + 9);
    return n === -1 ? { next: e.length, advanced: !0, blocked: !0 } : { next: n + 3, advanced: !0, blocked: !1 };
  }
  if (e.startsWith("<!--", t)) {
    const n = e.indexOf("-->", t + 4);
    return n === -1 ? { next: e.length, advanced: !0, blocked: !0 } : { next: n + 3, advanced: !0, blocked: !1 };
  }
  return { next: t, advanced: !1, blocked: !1 };
}
function Xm(e, t) {
  if (e[t] !== "`") return -1;
  let n = 0;
  for (; t + n < e.length && e[t + n] === "`"; ) n++;
  const a = e.slice(t, t + n), o = e.indexOf(a, t + n);
  return o === -1 ? -1 : o + n;
}
function Ym(e, t) {
  const n = nt(e, t);
  if (n === 0) return null;
  let a = t + n;
  a = ve(e, a);
  let o = !1;
  const { next: s, ok: i } = gt(
    e,
    a
  );
  i && (o = !0, a = s), a = ve(e, a);
  let r = !1;
  e.startsWith("|DSML|", a) && (r = !0, a += 6);
  for (const c of cr) {
    const { next: p, ok: l } = it(
      e,
      a,
      c.raw
    );
    if (l) {
      let u = p, d = !1;
      for (; u < e.length; ) {
        const f = Ce(e, u);
        if (f > 0)
          return {
            Name: c.canonical,
            Start: t,
            End: u + f - 1,
            NameStart: a,
            NameEnd: p,
            Closing: o,
            SelfClosing: d,
            DSMLLike: r,
            Canonical: !r
          };
        const { next: g, ok: x } = gt(e, u);
        if (x) {
          d = !0, u = g;
          continue;
        }
        u++;
      }
    }
  }
  return null;
}
function Zm(e, t) {
  let n = 0;
  const a = nt(e, n);
  for (n += a; n < e.length; ) {
    n = ve(e, n);
    const r = nt(e, n);
    if (r > 0) {
      n += r;
      continue;
    }
    break;
  }
  if (n = ve(e, n), t.Closing) {
    const { next: r } = gt(e, n);
    n = r;
  }
  e.startsWith("|DSML|", n) && (n += 6);
  const { next: o } = it(e, n, Qm(t)), s = ef(e, o);
  let i = "<" + (t.Closing ? "/" : "") + (t.DSMLLike ? "|DSML|" : "") + t.Name;
  for (const r of s)
    i += ` ${r.Key}="${r.Value.replace(/"/g, "&quot;")}"`;
  return i += (t.SelfClosing ? "/" : "") + ">", i;
}
function Qm(e) {
  var t;
  return ((t = cr.find((n) => n.canonical === e.Name)) == null ? void 0 : t.raw) || e.Name;
}
function ef(e, t) {
  const n = [];
  for (; t < e.length && (t = ve(e, t), !(Ce(e, t) > 0)); ) {
    const { next: a, ok: o } = tf(e, t);
    if (o) {
      t = a;
      continue;
    }
    const { next: s, ok: i } = gt(
      e,
      t
    );
    if (i) {
      t = s;
      continue;
    }
    const r = t;
    for (; t < e.length && !(xs(e, t) > 0 || vs(e, t) > 0 || Ce(e, t) > 0); )
      t++;
    const c = e.slice(r, t).trim();
    if (!c) {
      t++;
      continue;
    }
    t = ve(e, t);
    const p = vs(e, t);
    if (p === 0) continue;
    t += p, t = ve(e, t);
    const { quote: l, quoteLen: u } = nf(e, t);
    let d = "";
    if (u > 0) {
      t += u;
      const f = t;
      for (; t < e.length; ) {
        if (e.startsWith(l, t)) {
          d = e.slice(f, t), t += l.length;
          break;
        }
        t++;
      }
    } else {
      const f = t;
      for (; t < e.length && !(xs(e, t) > 0 || Ce(e, t) > 0); )
        t++;
      d = e.slice(f, t);
    }
    c.toLowerCase().includes("name") && n.push({ Key: "name", Value: d });
  }
  return n;
}
function ve(e, t) {
  for (; t < e.length; ) {
    const n = e.charCodeAt(t);
    if (n >= 8203 && n <= 8207 || n >= 8234 && n <= 8238 || n < 32 && ![9, 10, 13].includes(n)) {
      t++;
      continue;
    }
    break;
  }
  return t;
}
function xs(e, t) {
  const n = e[t];
  return [" ", "	", `
`, "\r"].includes(n) || e.startsWith("▁", t) ? 1 : 0;
}
function vs(e, t) {
  const n = e[t];
  return ["=", "＝", "﹦", "꞊"].includes(n) ? n.length : 0;
}
function nt(e, t) {
  const n = e[t];
  return ["<", "＜", "﹤", "〈"].includes(n) ? n.length : 0;
}
function Ce(e, t) {
  const n = e[t];
  return [">", "＞", "﹥", "〉"].includes(n) ? n.length : 0;
}
function gt(e, t) {
  const n = e[t];
  return ["/", "／", "∕", "⁄", "⧸"].includes(n) ? { next: t + n.length, ok: !0 } : { next: t, ok: !1 };
}
function tf(e, t) {
  const n = e[t];
  return ["|", "│", "∣", "❘", "ǀ", "￨"].includes(n) ? { next: t + n.length, ok: !0 } : { next: t, ok: !1 };
}
function nf(e, t) {
  const n = e[t], a = {
    '"': '"',
    "'": "'",
    "“": "”",
    "‘": "’",
    "＂": "＂",
    "＇": "＇",
    "„": "”",
    "‟": "”"
  };
  return a[n] ? { quote: a[n], quoteLen: n.length } : { quote: "", quoteLen: 0 };
}
function af(e) {
  const t = e.charCodeAt(0);
  let n = e.toLowerCase();
  return t >= 65313 && t <= 65338 ? n = String.fromCharCode(t - 65248).toLowerCase() : t >= 65345 && t <= 65370 && (n = String.fromCharCode(t - 65248)), {
    а: "a",
    α: "a",
    с: "c",
    С: "c",
    ϲ: "c",
    "Ϲ": "c",
    "ԁ": "d",
    "ⅾ": "d",
    е: "e",
    Е: "e",
    Ε: "e",
    ε: "e",
    і: "i",
    І: "i",
    Ι: "i",
    ι: "i",
    ı: "i",
    к: "k",
    К: "k",
    Κ: "k",
    κ: "k",
    "ⅼ": "l",
    м: "m",
    М: "m",
    Μ: "m",
    μ: "m",
    ո: "n",
    о: "o",
    О: "o",
    Ο: "o",
    ο: "o",
    р: "p",
    Р: "p",
    Ρ: "p",
    ρ: "p",
    ѕ: "s",
    Ѕ: "s",
    т: "t",
    Т: "t",
    Τ: "t",
    τ: "t",
    ν: "v",
    Ν: "v",
    ѵ: "v",
    "ⅴ": "v"
  }[n] || (/[a-z0-9]/.test(n) ? n : null);
}
function it(e, t, n) {
  let a = t;
  for (let o = 0; o < n.length; o++) {
    if (a = ve(e, a), a >= e.length) return { next: t, ok: !1 };
    const s = n[o].toLowerCase(), i = e[a];
    if (s === "_" || s === "-") {
      if ([
        "_",
        "＿",
        "﹍",
        "﹎",
        "﹏",
        "-",
        "‐",
        "‑",
        "‒",
        "–",
        "—",
        "―",
        "−",
        "﹣",
        "－"
      ].includes(i)) {
        a++;
        continue;
      }
      return { next: t, ok: !1 };
    }
    if (af(i) !== s) return { next: t, ok: !1 };
    a++;
  }
  return { next: a, ok: !0 };
}
const lr = [
  { raw: "tool_calls", canonical: "tool_calls" },
  { raw: "tool-calls", canonical: "tool_calls", dsmlOnly: !0 },
  { raw: "toolcalls", canonical: "tool_calls", dsmlOnly: !0 },
  { raw: "invoke", canonical: "invoke" },
  { raw: "parameter", canonical: "parameter" }
];
function of(e) {
  let t = !1, n = !1;
  for (let a = 0; a < e.length; ) {
    const { next: o, advanced: s, blocked: i } = yn(e, a);
    if (i) break;
    if (s) {
      a = o;
      continue;
    }
    const r = pr(e, a);
    if (r !== -1) {
      a = r;
      continue;
    }
    const c = oo(e, a);
    if (c) {
      if (c.DSMLLike ? t = !0 : n = !0, t && n)
        return { hasDSML: !0, hasCanonical: !0 };
      a = c.End + 1;
      continue;
    }
    a++;
  }
  return { hasDSML: t, hasCanonical: n };
}
function Re(e, t) {
  for (let n = Math.max(t, 0); n < e.length; ) {
    const { next: a, advanced: o, blocked: s } = yn(e, n);
    if (s) break;
    if (o) {
      n = a;
      continue;
    }
    const i = pr(e, n);
    if (i !== -1) {
      n = i;
      continue;
    }
    const r = oo(e, n);
    if (r) return r;
    n++;
  }
  return null;
}
function wn(e, t) {
  if (!e || !t.Name || t.Closing || t.End >= e.length)
    return null;
  let n = 1, a = t.End + 1;
  for (; a < e.length; ) {
    const o = Re(e, a);
    if (!o) return null;
    if (o.Name !== t.Name) {
      a = o.End + 1;
      continue;
    }
    if (o.Closing) {
      if (n--, n === 0) return o;
    } else o.SelfClosing || n++;
    a = o.End + 1;
  }
  return null;
}
function oo(e, t) {
  const n = nt(e, t);
  if (n === 0) return null;
  let a = t + n;
  for (; ; ) {
    const x = nt(e, a);
    if (x === 0) break;
    a += x;
  }
  let o = !1;
  const s = gt(e, a);
  s.ok && (o = !0, a = s.next);
  const i = a, { next: r, dsmlLike: c } = sf(e, a);
  a = r;
  let { name: p, nameLen: l } = rf(e, a, c), u = c;
  if (l === 0) {
    const x = cf(
      e,
      i
    );
    if (!x) return null;
    p = x.name, a = x.start, l = x.len, u = !0;
  }
  const d = a + l, f = pf(e, d);
  if (f === -1) return null;
  const g = e.slice(t, f + 1).trim();
  return {
    Start: t,
    End: f,
    NameStart: a,
    NameEnd: d,
    Name: p,
    Closing: o,
    SelfClosing: g.endsWith("/>") || g.endsWith("/＞") || g.endsWith("/〉"),
    DSMLLike: u,
    Canonical: !u
  };
}
function sf(e, t) {
  let n = !1, a = t;
  for (; ; ) {
    const o = ve(e, a), { next: s, ok: i } = it(e, o, "dsml");
    if (i) {
      a = s, (e[a] === "-" || e[a] === "_") && a++, n = !0;
      continue;
    }
    break;
  }
  return { next: a, dsmlLike: n };
}
function rf(e, t, n) {
  for (const a of lr) {
    if (a.dsmlOnly && !n) continue;
    const { next: o, ok: s } = it(e, t, a.raw);
    if (s) return { name: a.canonical, nameLen: o - t };
  }
  return { name: "", nameLen: 0 };
}
function cf(e, t) {
  for (let n = t; n < e.length && !lf(e[n]); n++)
    for (const a of lr) {
      const { next: o, ok: s } = it(e, n, a.raw);
      if (s) return { name: a.canonical, start: n, len: o - n };
    }
  return null;
}
function lf(e) {
  return e === ">" || e === "＞" || e === "﹥" || e === "〉";
}
function pf(e, t) {
  for (let n = t; n < e.length; n++) {
    const a = Ce(e, n);
    if (a > 0) return n + a - 1;
  }
  return -1;
}
function pr(e, t) {
  if (e[t] !== "`") return -1;
  let n = 0;
  for (; t + n < e.length && e[t + n] === "`"; ) n++;
  const a = e.slice(t, t + n), o = e.indexOf(a, t + n);
  return o === -1 ? -1 : o + n;
}
function uf(e) {
  if (!e) return { text: "", ok: !0 };
  const t = Jm(e), { hasDSML: n, hasCanonical: a } = of(t);
  return !n && !a ? { text: t, ok: !0 } : { text: df(t), ok: !0 };
}
function df(e) {
  if (!e) return "";
  let t = "";
  for (let n = 0; n < e.length; ) {
    const { next: a, advanced: o, blocked: s } = yn(e, n);
    if (s) {
      t += e.slice(n);
      break;
    }
    if (o) {
      t += e.slice(n, a), n = a;
      continue;
    }
    const i = mf(e, n);
    if (i !== -1) {
      t += e.slice(n, i), n = i;
      continue;
    }
    const r = oo(e, n);
    if (!r) {
      t += e[n], n++;
      continue;
    }
    t += "<" + (r.Closing ? "/" : "") + r.Name + ">", n = r.End + 1;
  }
  return t;
}
function mf(e, t) {
  if (e[t] !== "`") return -1;
  let n = 0;
  for (; t + n < e.length && e[t + n] === "`"; ) n++;
  const a = e.slice(t, t + n), o = e.indexOf(a, t + n);
  return o === -1 ? -1 : o + n;
}
var Ke = function() {
  return Ke = Object.assign || function(e) {
    for (var t, n = 1, a = arguments.length; n < a; n++) {
      t = arguments[n];
      for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
    }
    return e;
  }, Ke.apply(this, arguments);
}, ff = "~", hf = "~~";
function so(e, t) {
  for (var n = {}, a = {}, o = e.split(hf), s = !1, i = 0; o.length > i; i++) {
    for (var r = o[i].split(ff), c = 0; c < r.length; c += 2) {
      var p = r[c], l = r[c + 1], u = "&" + p + ";";
      n[u] = l, s && (n["&" + p] = l), a[l] = u;
    }
    s = !0;
  }
  return t ? { entities: Ke(Ke({}, n), t.entities), characters: Ke(Ke({}, a), t.characters) } : { entities: n, characters: a };
}
var ia = {
  xml: /&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g,
  html4: /&notin;|&(?:nbsp|iexcl|cent|pound|curren|yen|brvbar|sect|uml|copy|ordf|laquo|not|shy|reg|macr|deg|plusmn|sup2|sup3|acute|micro|para|middot|cedil|sup1|ordm|raquo|frac14|frac12|frac34|iquest|Agrave|Aacute|Acirc|Atilde|Auml|Aring|AElig|Ccedil|Egrave|Eacute|Ecirc|Euml|Igrave|Iacute|Icirc|Iuml|ETH|Ntilde|Ograve|Oacute|Ocirc|Otilde|Ouml|times|Oslash|Ugrave|Uacute|Ucirc|Uuml|Yacute|THORN|szlig|agrave|aacute|acirc|atilde|auml|aring|aelig|ccedil|egrave|eacute|ecirc|euml|igrave|iacute|icirc|iuml|eth|ntilde|ograve|oacute|ocirc|otilde|ouml|divide|oslash|ugrave|uacute|ucirc|uuml|yacute|thorn|yuml|quot|amp|lt|gt|#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g,
  html5: /&centerdot;|&copysr;|&divideontimes;|&gtcc;|&gtcir;|&gtdot;|&gtlPar;|&gtquest;|&gtrapprox;|&gtrarr;|&gtrdot;|&gtreqless;|&gtreqqless;|&gtrless;|&gtrsim;|&ltcc;|&ltcir;|&ltdot;|&lthree;|&ltimes;|&ltlarr;|&ltquest;|&ltrPar;|&ltri;|&ltrie;|&ltrif;|&notin;|&notinE;|&notindot;|&notinva;|&notinvb;|&notinvc;|&notni;|&notniva;|&notnivb;|&notnivc;|&parallel;|&timesb;|&timesbar;|&timesd;|&(?:AElig|AMP|Aacute|Acirc|Agrave|Aring|Atilde|Auml|COPY|Ccedil|ETH|Eacute|Ecirc|Egrave|Euml|GT|Iacute|Icirc|Igrave|Iuml|LT|Ntilde|Oacute|Ocirc|Ograve|Oslash|Otilde|Ouml|QUOT|REG|THORN|Uacute|Ucirc|Ugrave|Uuml|Yacute|aacute|acirc|acute|aelig|agrave|amp|aring|atilde|auml|brvbar|ccedil|cedil|cent|copy|curren|deg|divide|eacute|ecirc|egrave|eth|euml|frac12|frac14|frac34|gt|iacute|icirc|iexcl|igrave|iquest|iuml|laquo|lt|macr|micro|middot|nbsp|not|ntilde|oacute|ocirc|ograve|ordf|ordm|oslash|otilde|ouml|para|plusmn|pound|quot|raquo|reg|sect|shy|sup1|sup2|sup3|szlig|thorn|times|uacute|ucirc|ugrave|uml|uuml|yacute|yen|yuml|#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g
}, at = {};
at.xml = so(`lt~<~gt~>~quot~"~apos~'~amp~&`);
at.html4 = so(`apos~'~OElig~Œ~oelig~œ~Scaron~Š~scaron~š~Yuml~Ÿ~circ~ˆ~tilde~˜~ensp~ ~emsp~ ~thinsp~ ~zwnj~‌~zwj~‍~lrm~‎~rlm~‏~ndash~–~mdash~—~lsquo~‘~rsquo~’~sbquo~‚~ldquo~“~rdquo~”~bdquo~„~dagger~†~Dagger~‡~permil~‰~lsaquo~‹~rsaquo~›~euro~€~fnof~ƒ~Alpha~Α~Beta~Β~Gamma~Γ~Delta~Δ~Epsilon~Ε~Zeta~Ζ~Eta~Η~Theta~Θ~Iota~Ι~Kappa~Κ~Lambda~Λ~Mu~Μ~Nu~Ν~Xi~Ξ~Omicron~Ο~Pi~Π~Rho~Ρ~Sigma~Σ~Tau~Τ~Upsilon~Υ~Phi~Φ~Chi~Χ~Psi~Ψ~Omega~Ω~alpha~α~beta~β~gamma~γ~delta~δ~epsilon~ε~zeta~ζ~eta~η~theta~θ~iota~ι~kappa~κ~lambda~λ~mu~μ~nu~ν~xi~ξ~omicron~ο~pi~π~rho~ρ~sigmaf~ς~sigma~σ~tau~τ~upsilon~υ~phi~φ~chi~χ~psi~ψ~omega~ω~thetasym~ϑ~upsih~ϒ~piv~ϖ~bull~•~hellip~…~prime~′~Prime~″~oline~‾~frasl~⁄~weierp~℘~image~ℑ~real~ℜ~trade~™~alefsym~ℵ~larr~←~uarr~↑~rarr~→~darr~↓~harr~↔~crarr~↵~lArr~⇐~uArr~⇑~rArr~⇒~dArr~⇓~hArr~⇔~forall~∀~part~∂~exist~∃~empty~∅~nabla~∇~isin~∈~notin~∉~ni~∋~prod~∏~sum~∑~minus~−~lowast~∗~radic~√~prop~∝~infin~∞~ang~∠~and~∧~or~∨~cap~∩~cup~∪~int~∫~there4~∴~sim~∼~cong~≅~asymp~≈~ne~≠~equiv~≡~le~≤~ge~≥~sub~⊂~sup~⊃~nsub~⊄~sube~⊆~supe~⊇~oplus~⊕~otimes~⊗~perp~⊥~sdot~⋅~lceil~⌈~rceil~⌉~lfloor~⌊~rfloor~⌋~lang~〈~rang~〉~loz~◊~spades~♠~clubs~♣~hearts~♥~diams~♦~~nbsp~ ~iexcl~¡~cent~¢~pound~£~curren~¤~yen~¥~brvbar~¦~sect~§~uml~¨~copy~©~ordf~ª~laquo~«~not~¬~shy~­~reg~®~macr~¯~deg~°~plusmn~±~sup2~²~sup3~³~acute~´~micro~µ~para~¶~middot~·~cedil~¸~sup1~¹~ordm~º~raquo~»~frac14~¼~frac12~½~frac34~¾~iquest~¿~Agrave~À~Aacute~Á~Acirc~Â~Atilde~Ã~Auml~Ä~Aring~Å~AElig~Æ~Ccedil~Ç~Egrave~È~Eacute~É~Ecirc~Ê~Euml~Ë~Igrave~Ì~Iacute~Í~Icirc~Î~Iuml~Ï~ETH~Ð~Ntilde~Ñ~Ograve~Ò~Oacute~Ó~Ocirc~Ô~Otilde~Õ~Ouml~Ö~times~×~Oslash~Ø~Ugrave~Ù~Uacute~Ú~Ucirc~Û~Uuml~Ü~Yacute~Ý~THORN~Þ~szlig~ß~agrave~à~aacute~á~acirc~â~atilde~ã~auml~ä~aring~å~aelig~æ~ccedil~ç~egrave~è~eacute~é~ecirc~ê~euml~ë~igrave~ì~iacute~í~icirc~î~iuml~ï~eth~ð~ntilde~ñ~ograve~ò~oacute~ó~ocirc~ô~otilde~õ~ouml~ö~divide~÷~oslash~ø~ugrave~ù~uacute~ú~ucirc~û~uuml~ü~yacute~ý~thorn~þ~yuml~ÿ~quot~"~amp~&~lt~<~gt~>`);
at.html5 = so('Abreve~Ă~Acy~А~Afr~𝔄~Amacr~Ā~And~⩓~Aogon~Ą~Aopf~𝔸~ApplyFunction~⁡~Ascr~𝒜~Assign~≔~Backslash~∖~Barv~⫧~Barwed~⌆~Bcy~Б~Because~∵~Bernoullis~ℬ~Bfr~𝔅~Bopf~𝔹~Breve~˘~Bscr~ℬ~Bumpeq~≎~CHcy~Ч~Cacute~Ć~Cap~⋒~CapitalDifferentialD~ⅅ~Cayleys~ℭ~Ccaron~Č~Ccirc~Ĉ~Cconint~∰~Cdot~Ċ~Cedilla~¸~CenterDot~·~Cfr~ℭ~CircleDot~⊙~CircleMinus~⊖~CirclePlus~⊕~CircleTimes~⊗~ClockwiseContourIntegral~∲~CloseCurlyDoubleQuote~”~CloseCurlyQuote~’~Colon~∷~Colone~⩴~Congruent~≡~Conint~∯~ContourIntegral~∮~Copf~ℂ~Coproduct~∐~CounterClockwiseContourIntegral~∳~Cross~⨯~Cscr~𝒞~Cup~⋓~CupCap~≍~DD~ⅅ~DDotrahd~⤑~DJcy~Ђ~DScy~Ѕ~DZcy~Џ~Darr~↡~Dashv~⫤~Dcaron~Ď~Dcy~Д~Del~∇~Dfr~𝔇~DiacriticalAcute~´~DiacriticalDot~˙~DiacriticalDoubleAcute~˝~DiacriticalGrave~`~DiacriticalTilde~˜~Diamond~⋄~DifferentialD~ⅆ~Dopf~𝔻~Dot~¨~DotDot~⃜~DotEqual~≐~DoubleContourIntegral~∯~DoubleDot~¨~DoubleDownArrow~⇓~DoubleLeftArrow~⇐~DoubleLeftRightArrow~⇔~DoubleLeftTee~⫤~DoubleLongLeftArrow~⟸~DoubleLongLeftRightArrow~⟺~DoubleLongRightArrow~⟹~DoubleRightArrow~⇒~DoubleRightTee~⊨~DoubleUpArrow~⇑~DoubleUpDownArrow~⇕~DoubleVerticalBar~∥~DownArrow~↓~DownArrowBar~⤓~DownArrowUpArrow~⇵~DownBreve~̑~DownLeftRightVector~⥐~DownLeftTeeVector~⥞~DownLeftVector~↽~DownLeftVectorBar~⥖~DownRightTeeVector~⥟~DownRightVector~⇁~DownRightVectorBar~⥗~DownTee~⊤~DownTeeArrow~↧~Downarrow~⇓~Dscr~𝒟~Dstrok~Đ~ENG~Ŋ~Ecaron~Ě~Ecy~Э~Edot~Ė~Efr~𝔈~Element~∈~Emacr~Ē~EmptySmallSquare~◻~EmptyVerySmallSquare~▫~Eogon~Ę~Eopf~𝔼~Equal~⩵~EqualTilde~≂~Equilibrium~⇌~Escr~ℰ~Esim~⩳~Exists~∃~ExponentialE~ⅇ~Fcy~Ф~Ffr~𝔉~FilledSmallSquare~◼~FilledVerySmallSquare~▪~Fopf~𝔽~ForAll~∀~Fouriertrf~ℱ~Fscr~ℱ~GJcy~Ѓ~Gammad~Ϝ~Gbreve~Ğ~Gcedil~Ģ~Gcirc~Ĝ~Gcy~Г~Gdot~Ġ~Gfr~𝔊~Gg~⋙~Gopf~𝔾~GreaterEqual~≥~GreaterEqualLess~⋛~GreaterFullEqual~≧~GreaterGreater~⪢~GreaterLess~≷~GreaterSlantEqual~⩾~GreaterTilde~≳~Gscr~𝒢~Gt~≫~HARDcy~Ъ~Hacek~ˇ~Hat~^~Hcirc~Ĥ~Hfr~ℌ~HilbertSpace~ℋ~Hopf~ℍ~HorizontalLine~─~Hscr~ℋ~Hstrok~Ħ~HumpDownHump~≎~HumpEqual~≏~IEcy~Е~IJlig~Ĳ~IOcy~Ё~Icy~И~Idot~İ~Ifr~ℑ~Im~ℑ~Imacr~Ī~ImaginaryI~ⅈ~Implies~⇒~Int~∬~Integral~∫~Intersection~⋂~InvisibleComma~⁣~InvisibleTimes~⁢~Iogon~Į~Iopf~𝕀~Iscr~ℐ~Itilde~Ĩ~Iukcy~І~Jcirc~Ĵ~Jcy~Й~Jfr~𝔍~Jopf~𝕁~Jscr~𝒥~Jsercy~Ј~Jukcy~Є~KHcy~Х~KJcy~Ќ~Kcedil~Ķ~Kcy~К~Kfr~𝔎~Kopf~𝕂~Kscr~𝒦~LJcy~Љ~Lacute~Ĺ~Lang~⟪~Laplacetrf~ℒ~Larr~↞~Lcaron~Ľ~Lcedil~Ļ~Lcy~Л~LeftAngleBracket~⟨~LeftArrow~←~LeftArrowBar~⇤~LeftArrowRightArrow~⇆~LeftCeiling~⌈~LeftDoubleBracket~⟦~LeftDownTeeVector~⥡~LeftDownVector~⇃~LeftDownVectorBar~⥙~LeftFloor~⌊~LeftRightArrow~↔~LeftRightVector~⥎~LeftTee~⊣~LeftTeeArrow~↤~LeftTeeVector~⥚~LeftTriangle~⊲~LeftTriangleBar~⧏~LeftTriangleEqual~⊴~LeftUpDownVector~⥑~LeftUpTeeVector~⥠~LeftUpVector~↿~LeftUpVectorBar~⥘~LeftVector~↼~LeftVectorBar~⥒~Leftarrow~⇐~Leftrightarrow~⇔~LessEqualGreater~⋚~LessFullEqual~≦~LessGreater~≶~LessLess~⪡~LessSlantEqual~⩽~LessTilde~≲~Lfr~𝔏~Ll~⋘~Lleftarrow~⇚~Lmidot~Ŀ~LongLeftArrow~⟵~LongLeftRightArrow~⟷~LongRightArrow~⟶~Longleftarrow~⟸~Longleftrightarrow~⟺~Longrightarrow~⟹~Lopf~𝕃~LowerLeftArrow~↙~LowerRightArrow~↘~Lscr~ℒ~Lsh~↰~Lstrok~Ł~Lt~≪~Map~⤅~Mcy~М~MediumSpace~ ~Mellintrf~ℳ~Mfr~𝔐~MinusPlus~∓~Mopf~𝕄~Mscr~ℳ~NJcy~Њ~Nacute~Ń~Ncaron~Ň~Ncedil~Ņ~Ncy~Н~NegativeMediumSpace~​~NegativeThickSpace~​~NegativeThinSpace~​~NegativeVeryThinSpace~​~NestedGreaterGreater~≫~NestedLessLess~≪~NewLine~\n~Nfr~𝔑~NoBreak~⁠~NonBreakingSpace~ ~Nopf~ℕ~Not~⫬~NotCongruent~≢~NotCupCap~≭~NotDoubleVerticalBar~∦~NotElement~∉~NotEqual~≠~NotEqualTilde~≂̸~NotExists~∄~NotGreater~≯~NotGreaterEqual~≱~NotGreaterFullEqual~≧̸~NotGreaterGreater~≫̸~NotGreaterLess~≹~NotGreaterSlantEqual~⩾̸~NotGreaterTilde~≵~NotHumpDownHump~≎̸~NotHumpEqual~≏̸~NotLeftTriangle~⋪~NotLeftTriangleBar~⧏̸~NotLeftTriangleEqual~⋬~NotLess~≮~NotLessEqual~≰~NotLessGreater~≸~NotLessLess~≪̸~NotLessSlantEqual~⩽̸~NotLessTilde~≴~NotNestedGreaterGreater~⪢̸~NotNestedLessLess~⪡̸~NotPrecedes~⊀~NotPrecedesEqual~⪯̸~NotPrecedesSlantEqual~⋠~NotReverseElement~∌~NotRightTriangle~⋫~NotRightTriangleBar~⧐̸~NotRightTriangleEqual~⋭~NotSquareSubset~⊏̸~NotSquareSubsetEqual~⋢~NotSquareSuperset~⊐̸~NotSquareSupersetEqual~⋣~NotSubset~⊂⃒~NotSubsetEqual~⊈~NotSucceeds~⊁~NotSucceedsEqual~⪰̸~NotSucceedsSlantEqual~⋡~NotSucceedsTilde~≿̸~NotSuperset~⊃⃒~NotSupersetEqual~⊉~NotTilde~≁~NotTildeEqual~≄~NotTildeFullEqual~≇~NotTildeTilde~≉~NotVerticalBar~∤~Nscr~𝒩~Ocy~О~Odblac~Ő~Ofr~𝔒~Omacr~Ō~Oopf~𝕆~OpenCurlyDoubleQuote~“~OpenCurlyQuote~‘~Or~⩔~Oscr~𝒪~Otimes~⨷~OverBar~‾~OverBrace~⏞~OverBracket~⎴~OverParenthesis~⏜~PartialD~∂~Pcy~П~Pfr~𝔓~PlusMinus~±~Poincareplane~ℌ~Popf~ℙ~Pr~⪻~Precedes~≺~PrecedesEqual~⪯~PrecedesSlantEqual~≼~PrecedesTilde~≾~Product~∏~Proportion~∷~Proportional~∝~Pscr~𝒫~Qfr~𝔔~Qopf~ℚ~Qscr~𝒬~RBarr~⤐~Racute~Ŕ~Rang~⟫~Rarr~↠~Rarrtl~⤖~Rcaron~Ř~Rcedil~Ŗ~Rcy~Р~Re~ℜ~ReverseElement~∋~ReverseEquilibrium~⇋~ReverseUpEquilibrium~⥯~Rfr~ℜ~RightAngleBracket~⟩~RightArrow~→~RightArrowBar~⇥~RightArrowLeftArrow~⇄~RightCeiling~⌉~RightDoubleBracket~⟧~RightDownTeeVector~⥝~RightDownVector~⇂~RightDownVectorBar~⥕~RightFloor~⌋~RightTee~⊢~RightTeeArrow~↦~RightTeeVector~⥛~RightTriangle~⊳~RightTriangleBar~⧐~RightTriangleEqual~⊵~RightUpDownVector~⥏~RightUpTeeVector~⥜~RightUpVector~↾~RightUpVectorBar~⥔~RightVector~⇀~RightVectorBar~⥓~Rightarrow~⇒~Ropf~ℝ~RoundImplies~⥰~Rrightarrow~⇛~Rscr~ℛ~Rsh~↱~RuleDelayed~⧴~SHCHcy~Щ~SHcy~Ш~SOFTcy~Ь~Sacute~Ś~Sc~⪼~Scedil~Ş~Scirc~Ŝ~Scy~С~Sfr~𝔖~ShortDownArrow~↓~ShortLeftArrow~←~ShortRightArrow~→~ShortUpArrow~↑~SmallCircle~∘~Sopf~𝕊~Sqrt~√~Square~□~SquareIntersection~⊓~SquareSubset~⊏~SquareSubsetEqual~⊑~SquareSuperset~⊐~SquareSupersetEqual~⊒~SquareUnion~⊔~Sscr~𝒮~Star~⋆~Sub~⋐~Subset~⋐~SubsetEqual~⊆~Succeeds~≻~SucceedsEqual~⪰~SucceedsSlantEqual~≽~SucceedsTilde~≿~SuchThat~∋~Sum~∑~Sup~⋑~Superset~⊃~SupersetEqual~⊇~Supset~⋑~TRADE~™~TSHcy~Ћ~TScy~Ц~Tab~	~Tcaron~Ť~Tcedil~Ţ~Tcy~Т~Tfr~𝔗~Therefore~∴~ThickSpace~  ~ThinSpace~ ~Tilde~∼~TildeEqual~≃~TildeFullEqual~≅~TildeTilde~≈~Topf~𝕋~TripleDot~⃛~Tscr~𝒯~Tstrok~Ŧ~Uarr~↟~Uarrocir~⥉~Ubrcy~Ў~Ubreve~Ŭ~Ucy~У~Udblac~Ű~Ufr~𝔘~Umacr~Ū~UnderBar~_~UnderBrace~⏟~UnderBracket~⎵~UnderParenthesis~⏝~Union~⋃~UnionPlus~⊎~Uogon~Ų~Uopf~𝕌~UpArrow~↑~UpArrowBar~⤒~UpArrowDownArrow~⇅~UpDownArrow~↕~UpEquilibrium~⥮~UpTee~⊥~UpTeeArrow~↥~Uparrow~⇑~Updownarrow~⇕~UpperLeftArrow~↖~UpperRightArrow~↗~Upsi~ϒ~Uring~Ů~Uscr~𝒰~Utilde~Ũ~VDash~⊫~Vbar~⫫~Vcy~В~Vdash~⊩~Vdashl~⫦~Vee~⋁~Verbar~‖~Vert~‖~VerticalBar~∣~VerticalLine~|~VerticalSeparator~❘~VerticalTilde~≀~VeryThinSpace~ ~Vfr~𝔙~Vopf~𝕍~Vscr~𝒱~Vvdash~⊪~Wcirc~Ŵ~Wedge~⋀~Wfr~𝔚~Wopf~𝕎~Wscr~𝒲~Xfr~𝔛~Xopf~𝕏~Xscr~𝒳~YAcy~Я~YIcy~Ї~YUcy~Ю~Ycirc~Ŷ~Ycy~Ы~Yfr~𝔜~Yopf~𝕐~Yscr~𝒴~ZHcy~Ж~Zacute~Ź~Zcaron~Ž~Zcy~З~Zdot~Ż~ZeroWidthSpace~​~Zfr~ℨ~Zopf~ℤ~Zscr~𝒵~abreve~ă~ac~∾~acE~∾̳~acd~∿~acy~а~af~⁡~afr~𝔞~aleph~ℵ~amacr~ā~amalg~⨿~andand~⩕~andd~⩜~andslope~⩘~andv~⩚~ange~⦤~angle~∠~angmsd~∡~angmsdaa~⦨~angmsdab~⦩~angmsdac~⦪~angmsdad~⦫~angmsdae~⦬~angmsdaf~⦭~angmsdag~⦮~angmsdah~⦯~angrt~∟~angrtvb~⊾~angrtvbd~⦝~angsph~∢~angst~Å~angzarr~⍼~aogon~ą~aopf~𝕒~ap~≈~apE~⩰~apacir~⩯~ape~≊~apid~≋~approx~≈~approxeq~≊~ascr~𝒶~ast~*~asympeq~≍~awconint~∳~awint~⨑~bNot~⫭~backcong~≌~backepsilon~϶~backprime~‵~backsim~∽~backsimeq~⋍~barvee~⊽~barwed~⌅~barwedge~⌅~bbrk~⎵~bbrktbrk~⎶~bcong~≌~bcy~б~becaus~∵~because~∵~bemptyv~⦰~bepsi~϶~bernou~ℬ~beth~ℶ~between~≬~bfr~𝔟~bigcap~⋂~bigcirc~◯~bigcup~⋃~bigodot~⨀~bigoplus~⨁~bigotimes~⨂~bigsqcup~⨆~bigstar~★~bigtriangledown~▽~bigtriangleup~△~biguplus~⨄~bigvee~⋁~bigwedge~⋀~bkarow~⤍~blacklozenge~⧫~blacksquare~▪~blacktriangle~▴~blacktriangledown~▾~blacktriangleleft~◂~blacktriangleright~▸~blank~␣~blk12~▒~blk14~░~blk34~▓~block~█~bne~=⃥~bnequiv~≡⃥~bnot~⌐~bopf~𝕓~bot~⊥~bottom~⊥~bowtie~⋈~boxDL~╗~boxDR~╔~boxDl~╖~boxDr~╓~boxH~═~boxHD~╦~boxHU~╩~boxHd~╤~boxHu~╧~boxUL~╝~boxUR~╚~boxUl~╜~boxUr~╙~boxV~║~boxVH~╬~boxVL~╣~boxVR~╠~boxVh~╫~boxVl~╢~boxVr~╟~boxbox~⧉~boxdL~╕~boxdR~╒~boxdl~┐~boxdr~┌~boxh~─~boxhD~╥~boxhU~╨~boxhd~┬~boxhu~┴~boxminus~⊟~boxplus~⊞~boxtimes~⊠~boxuL~╛~boxuR~╘~boxul~┘~boxur~└~boxv~│~boxvH~╪~boxvL~╡~boxvR~╞~boxvh~┼~boxvl~┤~boxvr~├~bprime~‵~breve~˘~bscr~𝒷~bsemi~⁏~bsim~∽~bsime~⋍~bsol~\\~bsolb~⧅~bsolhsub~⟈~bullet~•~bump~≎~bumpE~⪮~bumpe~≏~bumpeq~≏~cacute~ć~capand~⩄~capbrcup~⩉~capcap~⩋~capcup~⩇~capdot~⩀~caps~∩︀~caret~⁁~caron~ˇ~ccaps~⩍~ccaron~č~ccirc~ĉ~ccups~⩌~ccupssm~⩐~cdot~ċ~cemptyv~⦲~centerdot~·~cfr~𝔠~chcy~ч~check~✓~checkmark~✓~cir~○~cirE~⧃~circeq~≗~circlearrowleft~↺~circlearrowright~↻~circledR~®~circledS~Ⓢ~circledast~⊛~circledcirc~⊚~circleddash~⊝~cire~≗~cirfnint~⨐~cirmid~⫯~cirscir~⧂~clubsuit~♣~colon~:~colone~≔~coloneq~≔~comma~,~commat~@~comp~∁~compfn~∘~complement~∁~complexes~ℂ~congdot~⩭~conint~∮~copf~𝕔~coprod~∐~copysr~℗~cross~✗~cscr~𝒸~csub~⫏~csube~⫑~csup~⫐~csupe~⫒~ctdot~⋯~cudarrl~⤸~cudarrr~⤵~cuepr~⋞~cuesc~⋟~cularr~↶~cularrp~⤽~cupbrcap~⩈~cupcap~⩆~cupcup~⩊~cupdot~⊍~cupor~⩅~cups~∪︀~curarr~↷~curarrm~⤼~curlyeqprec~⋞~curlyeqsucc~⋟~curlyvee~⋎~curlywedge~⋏~curvearrowleft~↶~curvearrowright~↷~cuvee~⋎~cuwed~⋏~cwconint~∲~cwint~∱~cylcty~⌭~dHar~⥥~daleth~ℸ~dash~‐~dashv~⊣~dbkarow~⤏~dblac~˝~dcaron~ď~dcy~д~dd~ⅆ~ddagger~‡~ddarr~⇊~ddotseq~⩷~demptyv~⦱~dfisht~⥿~dfr~𝔡~dharl~⇃~dharr~⇂~diam~⋄~diamond~⋄~diamondsuit~♦~die~¨~digamma~ϝ~disin~⋲~div~÷~divideontimes~⋇~divonx~⋇~djcy~ђ~dlcorn~⌞~dlcrop~⌍~dollar~$~dopf~𝕕~dot~˙~doteq~≐~doteqdot~≑~dotminus~∸~dotplus~∔~dotsquare~⊡~doublebarwedge~⌆~downarrow~↓~downdownarrows~⇊~downharpoonleft~⇃~downharpoonright~⇂~drbkarow~⤐~drcorn~⌟~drcrop~⌌~dscr~𝒹~dscy~ѕ~dsol~⧶~dstrok~đ~dtdot~⋱~dtri~▿~dtrif~▾~duarr~⇵~duhar~⥯~dwangle~⦦~dzcy~џ~dzigrarr~⟿~eDDot~⩷~eDot~≑~easter~⩮~ecaron~ě~ecir~≖~ecolon~≕~ecy~э~edot~ė~ee~ⅇ~efDot~≒~efr~𝔢~eg~⪚~egs~⪖~egsdot~⪘~el~⪙~elinters~⏧~ell~ℓ~els~⪕~elsdot~⪗~emacr~ē~emptyset~∅~emptyv~∅~emsp13~ ~emsp14~ ~eng~ŋ~eogon~ę~eopf~𝕖~epar~⋕~eparsl~⧣~eplus~⩱~epsi~ε~epsiv~ϵ~eqcirc~≖~eqcolon~≕~eqsim~≂~eqslantgtr~⪖~eqslantless~⪕~equals~=~equest~≟~equivDD~⩸~eqvparsl~⧥~erDot~≓~erarr~⥱~escr~ℯ~esdot~≐~esim~≂~excl~!~expectation~ℰ~exponentiale~ⅇ~fallingdotseq~≒~fcy~ф~female~♀~ffilig~ﬃ~fflig~ﬀ~ffllig~ﬄ~ffr~𝔣~filig~ﬁ~fjlig~fj~flat~♭~fllig~ﬂ~fltns~▱~fopf~𝕗~fork~⋔~forkv~⫙~fpartint~⨍~frac13~⅓~frac15~⅕~frac16~⅙~frac18~⅛~frac23~⅔~frac25~⅖~frac35~⅗~frac38~⅜~frac45~⅘~frac56~⅚~frac58~⅝~frac78~⅞~frown~⌢~fscr~𝒻~gE~≧~gEl~⪌~gacute~ǵ~gammad~ϝ~gap~⪆~gbreve~ğ~gcirc~ĝ~gcy~г~gdot~ġ~gel~⋛~geq~≥~geqq~≧~geqslant~⩾~ges~⩾~gescc~⪩~gesdot~⪀~gesdoto~⪂~gesdotol~⪄~gesl~⋛︀~gesles~⪔~gfr~𝔤~gg~≫~ggg~⋙~gimel~ℷ~gjcy~ѓ~gl~≷~glE~⪒~gla~⪥~glj~⪤~gnE~≩~gnap~⪊~gnapprox~⪊~gne~⪈~gneq~⪈~gneqq~≩~gnsim~⋧~gopf~𝕘~grave~`~gscr~ℊ~gsim~≳~gsime~⪎~gsiml~⪐~gtcc~⪧~gtcir~⩺~gtdot~⋗~gtlPar~⦕~gtquest~⩼~gtrapprox~⪆~gtrarr~⥸~gtrdot~⋗~gtreqless~⋛~gtreqqless~⪌~gtrless~≷~gtrsim~≳~gvertneqq~≩︀~gvnE~≩︀~hairsp~ ~half~½~hamilt~ℋ~hardcy~ъ~harrcir~⥈~harrw~↭~hbar~ℏ~hcirc~ĥ~heartsuit~♥~hercon~⊹~hfr~𝔥~hksearow~⤥~hkswarow~⤦~hoarr~⇿~homtht~∻~hookleftarrow~↩~hookrightarrow~↪~hopf~𝕙~horbar~―~hscr~𝒽~hslash~ℏ~hstrok~ħ~hybull~⁃~hyphen~‐~ic~⁣~icy~и~iecy~е~iff~⇔~ifr~𝔦~ii~ⅈ~iiiint~⨌~iiint~∭~iinfin~⧜~iiota~℩~ijlig~ĳ~imacr~ī~imagline~ℐ~imagpart~ℑ~imath~ı~imof~⊷~imped~Ƶ~in~∈~incare~℅~infintie~⧝~inodot~ı~intcal~⊺~integers~ℤ~intercal~⊺~intlarhk~⨗~intprod~⨼~iocy~ё~iogon~į~iopf~𝕚~iprod~⨼~iscr~𝒾~isinE~⋹~isindot~⋵~isins~⋴~isinsv~⋳~isinv~∈~it~⁢~itilde~ĩ~iukcy~і~jcirc~ĵ~jcy~й~jfr~𝔧~jmath~ȷ~jopf~𝕛~jscr~𝒿~jsercy~ј~jukcy~є~kappav~ϰ~kcedil~ķ~kcy~к~kfr~𝔨~kgreen~ĸ~khcy~х~kjcy~ќ~kopf~𝕜~kscr~𝓀~lAarr~⇚~lAtail~⤛~lBarr~⤎~lE~≦~lEg~⪋~lHar~⥢~lacute~ĺ~laemptyv~⦴~lagran~ℒ~langd~⦑~langle~⟨~lap~⪅~larrb~⇤~larrbfs~⤟~larrfs~⤝~larrhk~↩~larrlp~↫~larrpl~⤹~larrsim~⥳~larrtl~↢~lat~⪫~latail~⤙~late~⪭~lates~⪭︀~lbarr~⤌~lbbrk~❲~lbrace~{~lbrack~[~lbrke~⦋~lbrksld~⦏~lbrkslu~⦍~lcaron~ľ~lcedil~ļ~lcub~{~lcy~л~ldca~⤶~ldquor~„~ldrdhar~⥧~ldrushar~⥋~ldsh~↲~leftarrow~←~leftarrowtail~↢~leftharpoondown~↽~leftharpoonup~↼~leftleftarrows~⇇~leftrightarrow~↔~leftrightarrows~⇆~leftrightharpoons~⇋~leftrightsquigarrow~↭~leftthreetimes~⋋~leg~⋚~leq~≤~leqq~≦~leqslant~⩽~les~⩽~lescc~⪨~lesdot~⩿~lesdoto~⪁~lesdotor~⪃~lesg~⋚︀~lesges~⪓~lessapprox~⪅~lessdot~⋖~lesseqgtr~⋚~lesseqqgtr~⪋~lessgtr~≶~lesssim~≲~lfisht~⥼~lfr~𝔩~lg~≶~lgE~⪑~lhard~↽~lharu~↼~lharul~⥪~lhblk~▄~ljcy~љ~ll~≪~llarr~⇇~llcorner~⌞~llhard~⥫~lltri~◺~lmidot~ŀ~lmoust~⎰~lmoustache~⎰~lnE~≨~lnap~⪉~lnapprox~⪉~lne~⪇~lneq~⪇~lneqq~≨~lnsim~⋦~loang~⟬~loarr~⇽~lobrk~⟦~longleftarrow~⟵~longleftrightarrow~⟷~longmapsto~⟼~longrightarrow~⟶~looparrowleft~↫~looparrowright~↬~lopar~⦅~lopf~𝕝~loplus~⨭~lotimes~⨴~lowbar~_~lozenge~◊~lozf~⧫~lpar~(~lparlt~⦓~lrarr~⇆~lrcorner~⌟~lrhar~⇋~lrhard~⥭~lrtri~⊿~lscr~𝓁~lsh~↰~lsim~≲~lsime~⪍~lsimg~⪏~lsqb~[~lsquor~‚~lstrok~ł~ltcc~⪦~ltcir~⩹~ltdot~⋖~lthree~⋋~ltimes~⋉~ltlarr~⥶~ltquest~⩻~ltrPar~⦖~ltri~◃~ltrie~⊴~ltrif~◂~lurdshar~⥊~luruhar~⥦~lvertneqq~≨︀~lvnE~≨︀~mDDot~∺~male~♂~malt~✠~maltese~✠~map~↦~mapsto~↦~mapstodown~↧~mapstoleft~↤~mapstoup~↥~marker~▮~mcomma~⨩~mcy~м~measuredangle~∡~mfr~𝔪~mho~℧~mid~∣~midast~*~midcir~⫰~minusb~⊟~minusd~∸~minusdu~⨪~mlcp~⫛~mldr~…~mnplus~∓~models~⊧~mopf~𝕞~mp~∓~mscr~𝓂~mstpos~∾~multimap~⊸~mumap~⊸~nGg~⋙̸~nGt~≫⃒~nGtv~≫̸~nLeftarrow~⇍~nLeftrightarrow~⇎~nLl~⋘̸~nLt~≪⃒~nLtv~≪̸~nRightarrow~⇏~nVDash~⊯~nVdash~⊮~nacute~ń~nang~∠⃒~nap~≉~napE~⩰̸~napid~≋̸~napos~ŉ~napprox~≉~natur~♮~natural~♮~naturals~ℕ~nbump~≎̸~nbumpe~≏̸~ncap~⩃~ncaron~ň~ncedil~ņ~ncong~≇~ncongdot~⩭̸~ncup~⩂~ncy~н~neArr~⇗~nearhk~⤤~nearr~↗~nearrow~↗~nedot~≐̸~nequiv~≢~nesear~⤨~nesim~≂̸~nexist~∄~nexists~∄~nfr~𝔫~ngE~≧̸~nge~≱~ngeq~≱~ngeqq~≧̸~ngeqslant~⩾̸~nges~⩾̸~ngsim~≵~ngt~≯~ngtr~≯~nhArr~⇎~nharr~↮~nhpar~⫲~nis~⋼~nisd~⋺~niv~∋~njcy~њ~nlArr~⇍~nlE~≦̸~nlarr~↚~nldr~‥~nle~≰~nleftarrow~↚~nleftrightarrow~↮~nleq~≰~nleqq~≦̸~nleqslant~⩽̸~nles~⩽̸~nless~≮~nlsim~≴~nlt~≮~nltri~⋪~nltrie~⋬~nmid~∤~nopf~𝕟~notinE~⋹̸~notindot~⋵̸~notinva~∉~notinvb~⋷~notinvc~⋶~notni~∌~notniva~∌~notnivb~⋾~notnivc~⋽~npar~∦~nparallel~∦~nparsl~⫽⃥~npart~∂̸~npolint~⨔~npr~⊀~nprcue~⋠~npre~⪯̸~nprec~⊀~npreceq~⪯̸~nrArr~⇏~nrarr~↛~nrarrc~⤳̸~nrarrw~↝̸~nrightarrow~↛~nrtri~⋫~nrtrie~⋭~nsc~⊁~nsccue~⋡~nsce~⪰̸~nscr~𝓃~nshortmid~∤~nshortparallel~∦~nsim~≁~nsime~≄~nsimeq~≄~nsmid~∤~nspar~∦~nsqsube~⋢~nsqsupe~⋣~nsubE~⫅̸~nsube~⊈~nsubset~⊂⃒~nsubseteq~⊈~nsubseteqq~⫅̸~nsucc~⊁~nsucceq~⪰̸~nsup~⊅~nsupE~⫆̸~nsupe~⊉~nsupset~⊃⃒~nsupseteq~⊉~nsupseteqq~⫆̸~ntgl~≹~ntlg~≸~ntriangleleft~⋪~ntrianglelefteq~⋬~ntriangleright~⋫~ntrianglerighteq~⋭~num~#~numero~№~numsp~ ~nvDash~⊭~nvHarr~⤄~nvap~≍⃒~nvdash~⊬~nvge~≥⃒~nvgt~>⃒~nvinfin~⧞~nvlArr~⤂~nvle~≤⃒~nvlt~<⃒~nvltrie~⊴⃒~nvrArr~⤃~nvrtrie~⊵⃒~nvsim~∼⃒~nwArr~⇖~nwarhk~⤣~nwarr~↖~nwarrow~↖~nwnear~⤧~oS~Ⓢ~oast~⊛~ocir~⊚~ocy~о~odash~⊝~odblac~ő~odiv~⨸~odot~⊙~odsold~⦼~ofcir~⦿~ofr~𝔬~ogon~˛~ogt~⧁~ohbar~⦵~ohm~Ω~oint~∮~olarr~↺~olcir~⦾~olcross~⦻~olt~⧀~omacr~ō~omid~⦶~ominus~⊖~oopf~𝕠~opar~⦷~operp~⦹~orarr~↻~ord~⩝~order~ℴ~orderof~ℴ~origof~⊶~oror~⩖~orslope~⩗~orv~⩛~oscr~ℴ~osol~⊘~otimesas~⨶~ovbar~⌽~par~∥~parallel~∥~parsim~⫳~parsl~⫽~pcy~п~percnt~%~period~.~pertenk~‱~pfr~𝔭~phiv~ϕ~phmmat~ℳ~phone~☎~pitchfork~⋔~planck~ℏ~planckh~ℎ~plankv~ℏ~plus~+~plusacir~⨣~plusb~⊞~pluscir~⨢~plusdo~∔~plusdu~⨥~pluse~⩲~plussim~⨦~plustwo~⨧~pm~±~pointint~⨕~popf~𝕡~pr~≺~prE~⪳~prap~⪷~prcue~≼~pre~⪯~prec~≺~precapprox~⪷~preccurlyeq~≼~preceq~⪯~precnapprox~⪹~precneqq~⪵~precnsim~⋨~precsim~≾~primes~ℙ~prnE~⪵~prnap~⪹~prnsim~⋨~profalar~⌮~profline~⌒~profsurf~⌓~propto~∝~prsim~≾~prurel~⊰~pscr~𝓅~puncsp~ ~qfr~𝔮~qint~⨌~qopf~𝕢~qprime~⁗~qscr~𝓆~quaternions~ℍ~quatint~⨖~quest~?~questeq~≟~rAarr~⇛~rAtail~⤜~rBarr~⤏~rHar~⥤~race~∽̱~racute~ŕ~raemptyv~⦳~rangd~⦒~range~⦥~rangle~⟩~rarrap~⥵~rarrb~⇥~rarrbfs~⤠~rarrc~⤳~rarrfs~⤞~rarrhk~↪~rarrlp~↬~rarrpl~⥅~rarrsim~⥴~rarrtl~↣~rarrw~↝~ratail~⤚~ratio~∶~rationals~ℚ~rbarr~⤍~rbbrk~❳~rbrace~}~rbrack~]~rbrke~⦌~rbrksld~⦎~rbrkslu~⦐~rcaron~ř~rcedil~ŗ~rcub~}~rcy~р~rdca~⤷~rdldhar~⥩~rdquor~”~rdsh~↳~realine~ℛ~realpart~ℜ~reals~ℝ~rect~▭~rfisht~⥽~rfr~𝔯~rhard~⇁~rharu~⇀~rharul~⥬~rhov~ϱ~rightarrow~→~rightarrowtail~↣~rightharpoondown~⇁~rightharpoonup~⇀~rightleftarrows~⇄~rightleftharpoons~⇌~rightrightarrows~⇉~rightsquigarrow~↝~rightthreetimes~⋌~ring~˚~risingdotseq~≓~rlarr~⇄~rlhar~⇌~rmoust~⎱~rmoustache~⎱~rnmid~⫮~roang~⟭~roarr~⇾~robrk~⟧~ropar~⦆~ropf~𝕣~roplus~⨮~rotimes~⨵~rpar~)~rpargt~⦔~rppolint~⨒~rrarr~⇉~rscr~𝓇~rsh~↱~rsqb~]~rsquor~’~rthree~⋌~rtimes~⋊~rtri~▹~rtrie~⊵~rtrif~▸~rtriltri~⧎~ruluhar~⥨~rx~℞~sacute~ś~sc~≻~scE~⪴~scap~⪸~sccue~≽~sce~⪰~scedil~ş~scirc~ŝ~scnE~⪶~scnap~⪺~scnsim~⋩~scpolint~⨓~scsim~≿~scy~с~sdotb~⊡~sdote~⩦~seArr~⇘~searhk~⤥~searr~↘~searrow~↘~semi~;~seswar~⤩~setminus~∖~setmn~∖~sext~✶~sfr~𝔰~sfrown~⌢~sharp~♯~shchcy~щ~shcy~ш~shortmid~∣~shortparallel~∥~sigmav~ς~simdot~⩪~sime~≃~simeq~≃~simg~⪞~simgE~⪠~siml~⪝~simlE~⪟~simne~≆~simplus~⨤~simrarr~⥲~slarr~←~smallsetminus~∖~smashp~⨳~smeparsl~⧤~smid~∣~smile~⌣~smt~⪪~smte~⪬~smtes~⪬︀~softcy~ь~sol~/~solb~⧄~solbar~⌿~sopf~𝕤~spadesuit~♠~spar~∥~sqcap~⊓~sqcaps~⊓︀~sqcup~⊔~sqcups~⊔︀~sqsub~⊏~sqsube~⊑~sqsubset~⊏~sqsubseteq~⊑~sqsup~⊐~sqsupe~⊒~sqsupset~⊐~sqsupseteq~⊒~squ~□~square~□~squarf~▪~squf~▪~srarr~→~sscr~𝓈~ssetmn~∖~ssmile~⌣~sstarf~⋆~star~☆~starf~★~straightepsilon~ϵ~straightphi~ϕ~strns~¯~subE~⫅~subdot~⪽~subedot~⫃~submult~⫁~subnE~⫋~subne~⊊~subplus~⪿~subrarr~⥹~subset~⊂~subseteq~⊆~subseteqq~⫅~subsetneq~⊊~subsetneqq~⫋~subsim~⫇~subsub~⫕~subsup~⫓~succ~≻~succapprox~⪸~succcurlyeq~≽~succeq~⪰~succnapprox~⪺~succneqq~⪶~succnsim~⋩~succsim~≿~sung~♪~supE~⫆~supdot~⪾~supdsub~⫘~supedot~⫄~suphsol~⟉~suphsub~⫗~suplarr~⥻~supmult~⫂~supnE~⫌~supne~⊋~supplus~⫀~supset~⊃~supseteq~⊇~supseteqq~⫆~supsetneq~⊋~supsetneqq~⫌~supsim~⫈~supsub~⫔~supsup~⫖~swArr~⇙~swarhk~⤦~swarr~↙~swarrow~↙~swnwar~⤪~target~⌖~tbrk~⎴~tcaron~ť~tcedil~ţ~tcy~т~tdot~⃛~telrec~⌕~tfr~𝔱~therefore~∴~thetav~ϑ~thickapprox~≈~thicksim~∼~thkap~≈~thksim~∼~timesb~⊠~timesbar~⨱~timesd~⨰~tint~∭~toea~⤨~top~⊤~topbot~⌶~topcir~⫱~topf~𝕥~topfork~⫚~tosa~⤩~tprime~‴~triangle~▵~triangledown~▿~triangleleft~◃~trianglelefteq~⊴~triangleq~≜~triangleright~▹~trianglerighteq~⊵~tridot~◬~trie~≜~triminus~⨺~triplus~⨹~trisb~⧍~tritime~⨻~trpezium~⏢~tscr~𝓉~tscy~ц~tshcy~ћ~tstrok~ŧ~twixt~≬~twoheadleftarrow~↞~twoheadrightarrow~↠~uHar~⥣~ubrcy~ў~ubreve~ŭ~ucy~у~udarr~⇅~udblac~ű~udhar~⥮~ufisht~⥾~ufr~𝔲~uharl~↿~uharr~↾~uhblk~▀~ulcorn~⌜~ulcorner~⌜~ulcrop~⌏~ultri~◸~umacr~ū~uogon~ų~uopf~𝕦~uparrow~↑~updownarrow~↕~upharpoonleft~↿~upharpoonright~↾~uplus~⊎~upsi~υ~upuparrows~⇈~urcorn~⌝~urcorner~⌝~urcrop~⌎~uring~ů~urtri~◹~uscr~𝓊~utdot~⋰~utilde~ũ~utri~▵~utrif~▴~uuarr~⇈~uwangle~⦧~vArr~⇕~vBar~⫨~vBarv~⫩~vDash~⊨~vangrt~⦜~varepsilon~ϵ~varkappa~ϰ~varnothing~∅~varphi~ϕ~varpi~ϖ~varpropto~∝~varr~↕~varrho~ϱ~varsigma~ς~varsubsetneq~⊊︀~varsubsetneqq~⫋︀~varsupsetneq~⊋︀~varsupsetneqq~⫌︀~vartheta~ϑ~vartriangleleft~⊲~vartriangleright~⊳~vcy~в~vdash~⊢~vee~∨~veebar~⊻~veeeq~≚~vellip~⋮~verbar~|~vert~|~vfr~𝔳~vltri~⊲~vnsub~⊂⃒~vnsup~⊃⃒~vopf~𝕧~vprop~∝~vrtri~⊳~vscr~𝓋~vsubnE~⫋︀~vsubne~⊊︀~vsupnE~⫌︀~vsupne~⊋︀~vzigzag~⦚~wcirc~ŵ~wedbar~⩟~wedge~∧~wedgeq~≙~wfr~𝔴~wopf~𝕨~wp~℘~wr~≀~wreath~≀~wscr~𝓌~xcap~⋂~xcirc~◯~xcup~⋃~xdtri~▽~xfr~𝔵~xhArr~⟺~xharr~⟷~xlArr~⟸~xlarr~⟵~xmap~⟼~xnis~⋻~xodot~⨀~xopf~𝕩~xoplus~⨁~xotime~⨂~xrArr~⟹~xrarr~⟶~xscr~𝓍~xsqcup~⨆~xuplus~⨄~xutri~△~xvee~⋁~xwedge~⋀~yacy~я~ycirc~ŷ~ycy~ы~yfr~𝔶~yicy~ї~yopf~𝕪~yscr~𝓎~yucy~ю~zacute~ź~zcaron~ž~zcy~з~zdot~ż~zeetrf~ℨ~zfr~𝔷~zhcy~ж~zigrarr~⇝~zopf~𝕫~zscr~𝓏~~AMP~&~COPY~©~GT~>~LT~<~QUOT~"~REG~®', at.html4);
var gf = {
  0: 65533,
  128: 8364,
  130: 8218,
  131: 402,
  132: 8222,
  133: 8230,
  134: 8224,
  135: 8225,
  136: 710,
  137: 8240,
  138: 352,
  139: 8249,
  140: 338,
  142: 381,
  145: 8216,
  146: 8217,
  147: 8220,
  148: 8221,
  149: 8226,
  150: 8211,
  151: 8212,
  152: 732,
  153: 8482,
  154: 353,
  155: 8250,
  156: 339,
  158: 382,
  159: 376
}, xf = String.fromCodePoint || function(e) {
  return String.fromCharCode(Math.floor((e - 65536) / 1024) + 55296, (e - 65536) % 1024 + 56320);
}, ot = function() {
  return ot = Object.assign || function(e) {
    for (var t, n = 1, a = arguments.length; n < a; n++) {
      t = arguments[n];
      for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
    }
    return e;
  }, ot.apply(this, arguments);
}, vf = ot(ot({}, at), { all: at.html5 }), bf = {
  scope: "body",
  level: "all"
}, ra = /&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);/g, ca = /&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+)[;=]?/g, bs = {
  xml: {
    strict: ra,
    attribute: ca,
    body: ia.xml
  },
  html4: {
    strict: ra,
    attribute: ca,
    body: ia.html4
  },
  html5: {
    strict: ra,
    attribute: ca,
    body: ia.html5
  }
}, yf = ot(ot({}, bs), { all: bs.html5 }), ur = String.fromCharCode, wf = ur(65533);
function kf(e, t, n, a) {
  var o = e, s = e[e.length - 1];
  if (n && s === "=")
    o = e;
  else if (a && s !== ";")
    o = e;
  else {
    var i = t[e];
    if (i)
      o = i;
    else if (e[0] === "&" && e[1] === "#") {
      var r = e[2], c = r == "x" || r == "X" ? parseInt(e.substr(3), 16) : parseInt(e.substr(2));
      o = c >= 1114111 ? wf : c > 65535 ? xf(c) : ur(gf[c] || c);
    }
  }
  return o;
}
function io(e, t) {
  var n = bf, a = n.level, o = a === void 0 ? "all" : a, s = n.scope, i = s === void 0 ? o === "xml" ? "strict" : "body" : s;
  if (!e)
    return "";
  var r = yf[o][i], c = vf[o].entities, p = i === "attribute", l = i === "strict";
  return e.replace(r, function(u) {
    return kf(u, c, p, l);
  });
}
function dr(e) {
  const t = e.trim();
  if (!t) return {};
  if (t.startsWith("<")) {
    const { value: n, ok: a } = kn(t);
    if (a) {
      if (typeof n == "object" && n !== null && !Array.isArray(n))
        return n;
      if (typeof n == "string")
        return n.trim() ? { _raw: n } : {};
    }
  }
  return { _raw: t };
}
function kn(e) {
  const t = e.trim();
  if (!t) return { value: "", ok: !0 };
  try {
    return { value: Sf(t), ok: !0 };
  } catch {
    return { value: null, ok: !1 };
  }
}
function Sf(e) {
  const t = `<root>${e}</root>`, n = _f(t);
  let a = 0;
  function o() {
    const s = n[a++];
    if (!s || !s.startsWith("<") || s.startsWith("</"))
      throw new Error("Invalid start tag");
    const i = s.slice(1, -1).split(" ")[0], r = {};
    let c = "";
    for (; a < n.length; ) {
      const p = n[a];
      if (p.startsWith("</")) {
        if (p.slice(2, -1) !== i) throw new Error("Mismatched tag");
        if (a++, Object.keys(r).length === 0)
          return ys(c.trim()) ?? c;
        c.trim() && (r._text = ys(c.trim()) ?? c);
        const u = Object.keys(r);
        return u.length === 1 && u[0] === "item" ? Array.isArray(r.item) ? r.item : [r.item] : r;
      } else if (p.startsWith("<")) {
        const l = p.slice(1, -1).split(" ")[0], u = o();
        Ef(r, l, u);
      } else
        c += p, a++;
    }
    return c;
  }
  return o();
}
function Ef(e, t, n) {
  if (t)
    if (Object.prototype.hasOwnProperty.call(e, t)) {
      const a = e[t];
      Array.isArray(a) ? a.push(n) : e[t] = [a, n];
    } else
      e[t] = n;
}
function _f(e) {
  const t = [];
  let n = "";
  for (let a = 0; a < e.length; a++)
    if (e[a] === "<") {
      n && t.push(n);
      let o = e.indexOf(">", a);
      o === -1 && (o = e.length), t.push(e.slice(a, o + 1)), a = o, n = "";
    } else
      n += e[a];
  return n && t.push(n), t;
}
function ys(e) {
  if (!e) return null;
  const t = e.toLowerCase();
  if (t === "true") return !0;
  if (t === "false") return !1;
  if (t === "null") return null;
  if (/^-?\d+(\.\d+)?$/.test(e)) return Number(e);
}
function Tf(e) {
  const t = ro(e);
  if (t.ok)
    return t.value;
  const n = Af(e).trim();
  if (n === "")
    return "";
  if (n.includes("<") && n.includes(">")) {
    const a = dr(n);
    if (Object.keys(a).length > 0)
      return Object.keys(a).length === 1 && "_raw" in a ? a._raw : a;
  }
  try {
    if (/^[-0-9"[{tfnu]/.test(n))
      return JSON.parse(n);
  } catch {
  }
  return n;
}
function Af(e) {
  const t = e.trim();
  if (!t) return "";
  const n = ro(t);
  return n.ok ? n.value : io(e);
}
function ro(e) {
  const t = e.trim(), n = xt(t, 0);
  if (n > 0) {
    const a = Rf(t);
    if (a >= n)
      return { value: t.slice(n, a), ok: !0 };
    const o = mr(t, n);
    return o >= 0 ? { value: t.slice(n, o), ok: !0 } : { value: t.slice(n), ok: !0 };
  }
  return { value: "", ok: !1 };
}
function xt(e, t) {
  const n = ve(e, t), a = nt(e, n);
  if (a === 0) return 0;
  let o = n + a;
  for (let s = 0; s <= 4 && o < e.length; s++) {
    if (o = ve(e, o), o >= e.length) return 0;
    if (e[o] === "[") {
      o++;
      const { next: r, ok: c } = it(e, o, "cdata");
      return !c || (o = ve(e, r), o >= e.length || e[o] !== "[") ? 0 : (o++, o - t);
    }
    const i = e[o];
    if (!Cf(i)) return 0;
    o++;
  }
  return 0;
}
function Cf(e) {
  return [" ", "	", `
`, "\r", "|", "│", "∣", "❘", "ǀ", "￨"].includes(e);
}
function Rf(e) {
  for (let t = e.length - 1; t >= 0; t--) {
    const n = Sn(e, t);
    if (n > 0 && t + n === e.length)
      return t;
  }
  return -1;
}
function Sn(e, t) {
  return t < 0 || t >= e.length ? 0 : e.startsWith("]]〉", t) || e.startsWith("]]＞", t) || e.startsWith("]]>", t) ? 3 : 0;
}
function mr(e, t) {
  if (t < 0 || t >= e.length) return -1;
  let n = -1;
  for (let a = t; a < e.length; ) {
    const o = Of(e, a);
    if (o < 0) break;
    const s = Sn(e, o);
    if (a = o + s, !Pf(e.slice(t, o))) {
      if (Lf(e, a))
        return o;
      n < 0 && (n = o);
    }
  }
  return n;
}
function Of(e, t) {
  t < 0 && (t = 0);
  const n = e.slice(t), a = n.indexOf("]]>"), o = n.indexOf("]]＞"), s = n.indexOf("]]〉");
  let i = -1;
  return [a, o, s].forEach((r) => {
    r >= 0 && (i < 0 || r < i) && (i = r);
  }), i < 0 ? -1 : t + i;
}
function Lf(e, t) {
  for (; t < e.length; ) {
    const n = e[t];
    if ([" ", "	", "\r", `
`].includes(n)) {
      t++;
      continue;
    }
    return !!e.startsWith("</", t);
  }
  return !1;
}
function Pf(e) {
  if (!e) return !1;
  const t = e.split(`
`);
  let n = !1, a = "";
  for (const o of t) {
    const s = o.trimStart();
    if (!n) {
      const { marker: i, ok: r } = jf(s);
      r && (n = !0, a = i);
      continue;
    }
    Df(s, a) && (n = !1, a = "");
  }
  return n;
}
function jf(e) {
  if (e.length < 3) return { marker: "", ok: !1 };
  const t = e[0];
  if (t !== "`" && t !== "~") return { marker: "", ok: !1 };
  let n = 0;
  for (; n < e.length && e[n] === t; )
    n++;
  return n < 3 ? { marker: "", ok: !1 } : { marker: t.repeat(n), ok: !0 };
}
function Df(e, t) {
  if (!t) return !1;
  const n = t[0];
  if (e === "" || e[0] !== n) return !1;
  let a = 0;
  for (; a < e.length && e[a] === n; )
    a++;
  return a < t.length ? !1 : e.slice(a).trim() === "";
}
function Nf(e) {
  if (!e) return "";
  let t = "", n = 0, a = !1;
  for (; n < e.length; ) {
    const o = vt(e, n);
    if (o < 0) {
      t += e.slice(n);
      break;
    }
    const s = xt(e, o), i = o + s;
    t += e.slice(n, o);
    const r = mr(e, i);
    if (r >= 0) {
      const c = r + Sn(e, r);
      t += e.slice(o, c), n = c;
      continue;
    }
    a = !0, t += e.slice(i), n = e.length;
  }
  return a ? t : e;
}
function vt(e, t) {
  for (let n = Math.max(t, 0); n < e.length; n++)
    if (xt(e, n) > 0)
      return n;
  return -1;
}
function If(e) {
  if (!e.includes("\\")) return e;
  let t = "";
  for (let n = 0; n < e.length; n++) {
    const a = e[n];
    if (a === "\\") {
      if (n + 1 < e.length) {
        const o = e[n + 1];
        if (['"', "\\", "/", "b", "f", "n", "r", "t"].includes(o)) {
          t += "\\" + o, n++;
          continue;
        }
        if (o === "u" && n + 5 < e.length) {
          const s = e.slice(n + 2, n + 6);
          if (/^[0-9a-fA-F]{4}$/.test(s)) {
            t += "\\u" + s, n += 5;
            continue;
          }
        }
      }
      t += "\\\\";
    } else
      t += a;
  }
  return t;
}
function qf(e) {
  let t = e.trim();
  if (!t) return t;
  t = t.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
  const n = /(:|：)\s*(\{(?:[^{}]|\{[^{}]*\})*\}(?:\s*,\s*\{(?:[^{}]|\{[^{}]*\})*\})+)/g;
  return t = t.replace(n, "$1[$2]"), t;
}
function qt(e, t) {
  if (rr(t))
    return null;
  const n = e.trim();
  if (!n) return null;
  const a = ws(n);
  if (a.ok) {
    const i = Ve(a.value, t);
    if (i) return i;
  }
  const o = Ff(n);
  if (!o) return null;
  const s = [];
  for (const i of o) {
    const r = ws(i);
    if (!r.ok) return null;
    s.push(r.value);
  }
  return s;
}
function ws(e) {
  const t = e.trim();
  if (!t) return { value: null, ok: !1 };
  try {
    return { value: JSON.parse(t), ok: !0 };
  } catch {
  }
  const n = If(t);
  if (n !== t)
    try {
      return { value: JSON.parse(n), ok: !0 };
    } catch {
    }
  const a = qf(t);
  if (a !== t)
    try {
      return { value: JSON.parse(a), ok: !0 };
    } catch {
    }
  if (t.includes("<") && t.includes(">")) {
    const o = kn(t);
    if (o.ok) return o;
  }
  return { value: null, ok: !1 };
}
function Ve(e, t) {
  if (Array.isArray(e)) return e;
  if (typeof e == "object" && e !== null) {
    const n = Object.keys(e);
    if (n.length === 1) {
      if (n[0] === "item") {
        const a = e.item;
        return Array.isArray(a) ? a : [a];
      }
      if (t && n[0] === t) {
        const a = e[t];
        return Array.isArray(a) ? a : [a];
      }
    }
  }
  return null;
}
function Ff(e) {
  const t = e.trim();
  if (!t) return null;
  const n = [];
  let a = 0, o = 0, s = !1, i = !1;
  for (let c = 0; c < t.length; c++) {
    const p = t[c];
    if (s) {
      if (i) {
        i = !1;
        continue;
      }
      p === "\\" ? i = !0 : p === '"' && (s = !1);
      continue;
    }
    switch (p) {
      case '"':
        s = !0;
        break;
      case "{":
      case "[":
        o++;
        break;
      case "}":
      case "]":
        o > 0 && o--;
        break;
      case ",":
        if (o === 0) {
          const l = t.slice(a, c).trim();
          if (!l) return null;
          n.push(l), a = c + 1;
        }
        break;
    }
  }
  const r = t.slice(a).trim();
  return r ? (n.push(r), n.length >= 2 ? n : null) : null;
}
const ks = /\b([a-z0-9_:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/gis, Uf = /<br\s*\/?>/gi;
function Ss(e) {
  let t = Es(e);
  if (t.length === 0) {
    const a = Mf(e);
    a !== e && (t = Es(a));
  }
  if (t.length === 0)
    return null;
  const n = [];
  for (const a of t)
    for (const o of fr(a.Body, "invoke")) {
      const s = $f(o);
      s && n.push(s);
    }
  return n.length === 0 ? null : n;
}
function Es(e) {
  if (!e) return [];
  const t = [];
  let n = 0;
  for (; n < e.length; ) {
    const a = Re(e, n);
    if (!a) break;
    if (a.Closing || a.Name !== "tool_calls") {
      n = a.End + 1;
      continue;
    }
    const o = wn(e, a);
    if (!o) {
      n = a.End + 1;
      continue;
    }
    let s = a.End + 1;
    const i = Ce(e, a.End);
    i > 0 && (s = a.End + 1 - i), t.push({
      Attrs: e.slice(a.NameEnd, s),
      Body: e.slice(a.End + 1, o.Start),
      Start: a.Start,
      End: o.End + 1
    }), n = o.End + 1;
  }
  return t;
}
function Mf(e) {
  if (_s(e, "tool_calls", !1))
    return e;
  const t = _s(e, "invoke", !1);
  if (!t) return e;
  const n = Bf(e, "tool_calls", !0);
  return !n || t.Start >= n.Start ? e : e.slice(0, t.Start) + "<tool_calls>" + e.slice(t.Start, n.Start) + "</tool_calls>" + e.slice(n.End + 1);
}
function _s(e, t, n) {
  let a = 0;
  for (; a < e.length; ) {
    const o = Re(e, a);
    if (!o) break;
    if (o.Name === t && o.Closing === n)
      return o;
    a = o.End + 1;
  }
  return null;
}
function Bf(e, t, n) {
  let a = null, o = 0;
  for (; o < e.length; ) {
    const s = Re(e, o);
    if (!s) break;
    s.Name === t && s.Closing === n && (a = s), o = s.End + 1;
  }
  return a;
}
function fr(e, t) {
  if (!e) return [];
  const n = [];
  let a = 0;
  for (; a < e.length; ) {
    const o = Re(e, a);
    if (!o) break;
    if (o.Closing || o.Name !== t) {
      a = o.End + 1;
      continue;
    }
    if (o.SelfClosing) {
      let c = o.End + 1;
      const p = Ce(e, o.End);
      p > 0 && (c = o.End + 1 - p), n.push({
        Attrs: e.slice(o.NameEnd, c),
        Body: "",
        Start: o.Start,
        End: o.End + 1
      }), a = o.End + 1;
      continue;
    }
    const s = wn(e, o);
    if (!s) {
      a = o.End + 1;
      continue;
    }
    let i = o.End + 1;
    const r = Ce(e, o.End);
    r > 0 && (i = o.End + 1 - r), n.push({
      Attrs: e.slice(o.NameEnd, i),
      Body: e.slice(o.End + 1, s.Start),
      Start: o.Start,
      End: s.End + 1
    }), a = s.End + 1;
  }
  return n;
}
function $f(e) {
  const n = Ts(e.Attrs).name || "";
  if (!n) return null;
  const a = {};
  for (const o of fr(e.Body, "parameter")) {
    const i = Ts(o.Attrs).name;
    if (!i) continue;
    const r = zf(i, o.Body);
    a[i] = r;
  }
  return { Name: n, Input: a };
}
function Ts(e) {
  const t = e.trim();
  if (!t) return {};
  const n = {};
  ks.lastIndex = 0;
  let a;
  for (; (a = ks.exec(t)) !== null; ) {
    const o = a[1].toLowerCase(), s = a[2] !== void 0 ? a[2] : a[3];
    n[o] = s;
  }
  return n;
}
function zf(e, t) {
  const n = t.trim();
  if (!n) return "";
  const a = ro(n);
  if (a.ok) {
    const i = a.value;
    try {
      if (/^[-0-9"[{tfnu]/.test(i.trim())) {
        const p = JSON.parse(i), l = Ve(p, e);
        return l || p;
      }
    } catch {
    }
    const r = Hf(e, i);
    if (r.ok) return r.value;
    const c = qt(i, e);
    return c || i;
  }
  const o = io(Tf(n));
  if (o.includes("<") && o.includes(">")) {
    const { value: i, ok: r } = kn(o);
    if (r) {
      if (i && typeof i == "object") {
        if (Array.isArray(i)) return i;
        const p = Ve(i, e);
        return p || i;
      }
      if (typeof i == "string") {
        const p = i.trim();
        if (!p) return "";
        try {
          if (/^[-0-9"[{tfnu]/.test(p)) {
            const u = JSON.parse(p), d = Ve(u, e);
            return d || u;
          }
        } catch {
        }
        const l = qt(p, e);
        return l || i;
      }
      return i;
    }
    const c = dr(o);
    if (Object.keys(c).length > 0) {
      if (Object.keys(c).length === 1 && "_raw" in c) {
        const l = c._raw, u = qt(
          l,
          e
        );
        return u || l;
      }
      const p = Ve(c, e);
      return p || c;
    }
  }
  try {
    const i = o.trim();
    if (/^[-0-9"[{tfnu]/.test(i)) {
      const r = JSON.parse(i), c = Ve(r, e);
      return c || r;
    }
  } catch {
  }
  const s = qt(o, e);
  return s || o;
}
function Hf(e, t) {
  if (Gf(e))
    return { value: null, ok: !1 };
  const n = Wf(t);
  if (!n.includes("<") || !n.includes(">"))
    return { value: null, ok: !1 };
  if (!Vf(n))
    return { value: null, ok: !1 };
  const { value: a, ok: o } = kn(n);
  return o ? Array.isArray(a) ? { value: a, ok: !0 } : a && typeof a == "object" && Object.keys(a).length > 0 ? { value: a, ok: !0 } : { value: null, ok: !1 } : { value: null, ok: !1 };
}
function Wf(e) {
  if (!e) return "";
  const t = e.replace(Uf, `
`);
  return io(t.trim());
}
function Vf(e) {
  const t = e.trim();
  if (!t) return !1;
  const n = t.match(/<[^>]+>/g);
  return !(!n || n.length < 2 || !t.startsWith("<") || !t.endsWith(">"));
}
function Gf(e) {
  const t = e.toLowerCase().trim();
  return [
    "content",
    "file_content",
    "text",
    "prompt",
    "query",
    "command",
    "cmd",
    "script",
    "code",
    "old_string",
    "new_string",
    "pattern",
    "path",
    "file_path"
  ].includes(t);
}
function hr(e) {
  const t = {
    Calls: [],
    SawToolCallSyntax: !1,
    RejectedByPolicy: !1,
    RejectedToolNames: []
  }, n = e.trim();
  if (!n) return t;
  const o = Xf(n).trim();
  if (!o) return t;
  const { text: s } = uf(o);
  t.SawToolCallSyntax = Jf(s);
  let i = Ss(s);
  if ((!i || i.length === 0) && vt(s, 0) >= 0) {
    const c = Nf(s);
    c !== s && (i = Ss(c));
  }
  if (!i || i.length === 0)
    return t;
  t.SawToolCallSyntax = !0;
  const r = Kf(i);
  return t.Calls = r.calls, t.RejectedToolNames = r.rejectedNames, t.RejectedByPolicy = r.rejectedNames.length > 0 && r.calls.length === 0, t;
}
function Kf(e) {
  const t = [], n = [];
  for (const a of e)
    a.Name && (a.Input || (a.Input = {}), t.push(a));
  return { calls: t, rejectedNames: n };
}
function Jf(e) {
  return e.includes("<tool_calls>") || e.includes("<invoke") || e.includes("<|DSML|");
}
function Xf(e) {
  if (!e) return "";
  const t = e.split(/\r?\n/);
  let n = "", a = !1, o = "", s = !1, i = "", r = "";
  for (let c = 0; c < t.length; c++) {
    const p = t[c] + (c < t.length - 1 ? `
` : "");
    if (s || Yf(p)) {
      n += p;
      const u = Qf(
        s,
        i,
        p
      );
      s = u.state, i = u.fenceMarker;
      continue;
    }
    const l = p.trimStart();
    if (!a) {
      const u = Ca(l);
      if (u) {
        a = !0, o = u, r = n;
        continue;
      }
      n += p;
      continue;
    }
    gr(l, o) && (a = !1, o = "");
  }
  return a ? r : n;
}
function Yf(e) {
  const t = vt(e, 0);
  if (t < 0) return !1;
  const n = Zf(e);
  return n < 0 || t < n;
}
function Zf(e) {
  const t = e.indexOf("```"), n = e.indexOf("~~~");
  return t < 0 ? n : n < 0 ? t : Math.min(t, n);
}
function Qf(e, t, n) {
  let a = 0, o = e, s = t, i = n;
  if (!o) {
    const c = vt(n, a);
    if (c < 0) return { state: !1, fenceMarker: "" };
    a = c + xt(n, c), o = !0, i = n.slice(a);
  }
  const r = i.trimStart();
  if (s)
    gr(r, s) && (s = "");
  else {
    const c = Ca(r);
    c && (s = c);
  }
  for (; a < n.length; ) {
    let c = -1, p = 0;
    for (let u = a; u < n.length; u++) {
      const d = Sn(n, u);
      if (d > 0) {
        c = u, p = d;
        break;
      }
    }
    if (c < 0) return { state: !0, fenceMarker: s };
    if (a = c + p, s !== "") continue;
    const l = n.slice(a).trimStart();
    if (l === "" || l.startsWith("<")) {
      o = !1;
      const u = vt(n, a);
      if (u < 0) return { state: !1, fenceMarker: "" };
      a = u + xt(n, u), o = !0;
      const d = n.slice(a).trimStart();
      s = Ca(d) || "";
    }
  }
  return { state: o, fenceMarker: s };
}
function Ca(e) {
  if (e.length < 3) return null;
  const t = e[0];
  if (t !== "`" && t !== "~") return null;
  let n = 0;
  for (; n < e.length && e[n] === t; ) n++;
  return n < 3 ? null : t.repeat(n);
}
function gr(e, t) {
  if (!t) return !1;
  const n = t[0];
  if (!e || e[0] !== n) return !1;
  let a = 0;
  for (; a < e.length && e[a] === n; ) a++;
  return a < t.length ? !1 : e.slice(a).trim() === "";
}
let eh = class {
  constructor() {
    Be(this, "state");
    this.state = er();
  }
  processChunk(t) {
    t && (this.state.pending += t);
    const n = [];
    for (; ; ) {
      if (this.state.pendingToolCalls.length > 0) {
        n.push({
          type: "tool_calls",
          calls: this.state.pendingToolCalls
        }), this.state.pendingToolRaw = "", this.state.pendingToolCalls = [];
        continue;
      }
      if (this.state.capturing) {
        this.state.pending && (this.state.capture += this.state.pending, this.state.pending = "");
        const r = this.consumeToolCapture();
        if (!r.ready) break;
        const c = this.state.capture;
        if (this.state.capture = "", this.state.capturing = !1, ds(this.state), r.calls.length > 0) {
          r.prefix && (It(this.state, r.prefix), n.push({ type: "text", text: r.prefix })), this.state.pendingToolRaw = c, this.state.pendingToolCalls = r.calls, r.suffix && (this.state.pending = r.suffix + this.state.pending);
          continue;
        }
        r.prefix && (It(this.state, r.prefix), n.push({ type: "text", text: r.prefix })), r.suffix && (this.state.pending = r.suffix + this.state.pending);
        continue;
      }
      const a = this.state.pending;
      if (!a) break;
      const o = this.findToolSegmentStart(a);
      if (o >= 0) {
        const r = a.slice(0, o);
        r && (It(this.state, r), n.push({ type: "text", text: r })), this.state.pending = "", this.state.capture = a.slice(o), this.state.capturing = !0, ds(this.state);
        continue;
      }
      const [s, i] = this.splitSafeContent(a);
      if (!s && i || (this.state.pending = i, s && (It(this.state, s), n.push({ type: "text", text: s })), !s)) break;
    }
    return n;
  }
  findToolSegmentStart(t) {
    let n = 0;
    for (; ; ) {
      const a = Re(t, n);
      if (!a) return -1;
      if (ao(this.state, t.slice(0, a.Start))) {
        n = a.End + 1;
        continue;
      }
      if (!a.Closing && a.Name === "tool_calls")
        return a.Start;
      n = a.End + 1;
    }
  }
  splitSafeContent(t) {
    const n = t.lastIndexOf("<");
    return n >= 0 && n > t.length - 20 ? [t.slice(0, n), t.slice(n)] : [t, ""];
  }
  consumeToolCapture() {
    const t = this.state.capture, n = Re(t, 0);
    if (n && !n.Closing && n.Name === "tool_calls") {
      const a = wn(t, n);
      if (a) {
        const o = t.slice(n.Start, a.End + 1), s = hr(o);
        return {
          ready: !0,
          prefix: t.slice(0, n.Start),
          calls: s.Calls,
          suffix: t.slice(a.End + 1)
        };
      }
      return { ready: !1, prefix: "", calls: [], suffix: "" };
    }
    return { ready: !0, prefix: t, calls: [], suffix: "" };
  }
  flush() {
    const t = this.processChunk("");
    return this.state.capture && (t.push({ type: "text", text: this.state.capture }), this.state.capture = ""), this.state.pending && (t.push({ type: "text", text: this.state.pending }), this.state.pending = ""), t;
  }
};
function xr(e) {
  if (!e || e.length === 0) return "";
  const t = [], n = [];
  for (const i of e) {
    if (i.type !== "function" || !i.function) continue;
    const r = i.function.name, c = i.function.description || "No description available", p = JSON.stringify(i.function.parameters || {});
    n.push(r), t.push(
      `Tool: ${r}
Description: ${c}
Parameters: ${p}`
    );
  }
  if (n.length === 0) return "";
  let o = `You have access to these tools:

` + t.join(`

`) + `

` + Jd;
  const s = Gd(n);
  return s && (o += `

` + s), Kd(n) && (o += `

` + Xd), o;
}
function th(e) {
  return Km(e).calls.map((n) => ({
    id: `call_${Ye.randomUUID().replace(/-/g, "")}`,
    type: "function",
    function: {
      name: n.name,
      arguments: JSON.stringify(n.input)
    }
  }));
}
class nh {
  constructor() {
    Be(this, "sieve");
    this.sieve = new eh();
  }
  processChunk(t) {
    const n = this.sieve.processChunk(t);
    let a = "", o = null;
    for (const s of n)
      if (s.type === "text" && s.text)
        a += s.text;
      else if (s.type === "tool_calls" && s.calls) {
        const i = s.calls.map((r) => ({
          id: `call_${Ye.randomUUID().replace(/-/g, "")}`,
          type: "function",
          function: {
            name: r.name,
            arguments: JSON.stringify(r.input)
          }
        }));
        o = [...o || [], ...i];
      }
    return { outputText: a, toolCalls: o };
  }
  flush() {
    const t = this.sieve.flush();
    let n = "", a = null;
    for (const o of t)
      if (o.type === "text" && o.text)
        n += o.text;
      else if (o.type === "tool_calls" && o.calls) {
        const s = o.calls.map((i) => ({
          id: `call_${Ye.randomUUID().replace(/-/g, "")}`,
          type: "function",
          function: {
            name: i.name,
            arguments: JSON.stringify(i.input)
          }
        }));
        a = [...a || [], ...s];
      }
    return { outputText: n, toolCalls: a };
  }
}
const nn = /* @__PURE__ */ new Map();
function ah(e) {
  const t = [
    `# ${Qa}`,
    "",
    "## Output Integrity",
    zi
  ];
  if (e.length > 0) {
    t.push(""), t.push("## System Instructions");
    for (const n of e) {
      const a = n.trim();
      a && (t.push(""), t.push(a));
    }
  }
  return t.join(`
`) + `
`;
}
function oh(e) {
  const t = xr(e);
  return t ? `# ${eo}
Available tool descriptions and parameter schemas for this request.

${t}
` : "";
}
async function sh(e, t, n, a) {
  const o = ah(t), s = oh(n), i = Rs(o), r = Rs(s), c = nn.get(e);
  if (c && c.rulesHash === i && c.toolsHash === r && Date.now() - c.createdAt < 25 * 60 * 1e3) {
    const d = [c.rulesFileId];
    return c.toolsFileId && d.push(c.toolsFileId), {
      rulesFileId: c.rulesFileId,
      toolsFileId: c.toolsFileId,
      refFileIds: d
    };
  }
  const p = await Cs(e, Qa, o, a);
  let l = null;
  s.trim() && (l = await Cs(e, eo, s, a)), nn.set(e, {
    rulesFileId: p,
    toolsFileId: l,
    toolsHash: r,
    rulesHash: i,
    createdAt: Date.now()
  });
  const u = [p];
  return l && u.push(l), { rulesFileId: p, toolsFileId: l, refFileIds: u };
}
function As(e) {
  nn.delete(e);
}
function ih() {
  nn.clear();
}
function rh(e, t) {
  let n = `Follow the instructions in the attached ${Qa}.`;
  return t && (n += ` Available tool descriptions and parameter schemas are attached in ${eo}; use only those tools and follow the tool-call format rules described there.`), `${n}

${e}`;
}
async function Cs(e, t, n, a) {
  var f, g, x, v, h;
  const o = await R.post(
    vn,
    { target_path: "/api/v0/file/upload_file" },
    {
      headers: ue(e),
      validateStatus: () => !0
    }
  );
  if (o.status !== 200 || ((f = o.data) == null ? void 0 : f.code) !== 0)
    throw new Error(`[rule-uploader] PoW challenge failed for ${t}`);
  const s = (v = (x = (g = o.data) == null ? void 0 : g.data) == null ? void 0 : x.biz_data) == null ? void 0 : v.challenge, i = bn(s), r = new fn(), c = Buffer.from(n, "utf-8");
  r.append("file", $r.from(c), {
    filename: t,
    contentType: $d,
    knownLength: c.length
  });
  const p = {
    ...ue(e),
    "x-ds-pow-response": i,
    "x-file-size": String(c.length),
    ...r.getHeaders()
  }, l = await R.post(Ji, r, {
    headers: p,
    maxBodyLength: 1 / 0,
    maxContentLength: 1 / 0,
    validateStatus: () => !0
  });
  if (l.status !== 200 || ((h = l.data) == null ? void 0 : h.code) !== 0)
    throw new Error(
      `[rule-uploader] Upload failed for ${t}: ${l.status} ${JSON.stringify(l.data).slice(0, 200)}`
    );
  const u = ph(l.data);
  if (!u)
    throw new Error(
      `[rule-uploader] Upload succeeded but no file ID for ${t}`
    );
  const d = uh(l.data);
  return vr(d) ? P(
    a,
    `[rule-uploader] Uploaded ${t} → ${u.slice(0, 12)}... (ready)`
  ) : (P(
    a,
    `[rule-uploader] Uploaded ${t} → ${u.slice(0, 12)}... (status: ${d}, waiting for ready...)`
  ), await ch(e, u, t, a)), u;
}
async function ch(e, t, n, a) {
  for (let o = 0; o < us; o++) {
    await dh(zd);
    try {
      const s = await lh(e, t);
      if (vr(s)) {
        P(
          a,
          `[rule-uploader] ${n} ready after ${o + 1} poll(s)`
        );
        return;
      }
    } catch (s) {
      P(
        a,
        `[rule-uploader] poll error for ${n} (attempt ${o + 1}): ${s instanceof Error ? s.message : String(s)}`
      );
    }
  }
  P(
    a,
    `[rule-uploader] ${n} (${t.slice(0, 12)}...) did not reach 'processed' after ${us} polls, proceeding anyway`
  );
}
async function lh(e, t) {
  var o;
  const n = `${Xi}?file_ids=${encodeURIComponent(t)}`, a = await R.get(n, {
    headers: ue(e),
    validateStatus: () => !0
  });
  if (a.status !== 200 || ((o = a.data) == null ? void 0 : o.code) !== 0)
    throw new Error(`fetch_files failed: ${a.status}`);
  return Ra(a.data, t);
}
function Ra(e, t) {
  if (!e || typeof e != "object") return "";
  if (Array.isArray(e)) {
    for (const a of e) {
      const o = Ra(a, t);
      if (o) return o;
    }
    return "";
  }
  const n = e.id || e.file_id || "";
  if (typeof n == "string" && n.trim() === t)
    return (e.status || e.file_status || "").toString().trim();
  for (const a of Object.keys(e)) {
    const o = e[a];
    if (o && typeof o == "object") {
      const s = Ra(o, t);
      if (s) return s;
    }
  }
  return "";
}
function vr(e) {
  switch (e.toLowerCase().trim()) {
    case "processed":
    case "ready":
    case "done":
    case "available":
    case "success":
    case "completed":
    case "finished":
      return !0;
    default:
      return !1;
  }
}
function ph(e) {
  var n, a, o;
  const t = (n = e == null ? void 0 : e.data) == null ? void 0 : n.biz_data;
  return typeof (t == null ? void 0 : t.id) == "string" && t.id.trim() ? t.id.trim() : typeof ((a = t == null ? void 0 : t.file) == null ? void 0 : a.id) == "string" && t.file.id.trim() ? t.file.id.trim() : typeof ((o = e == null ? void 0 : e.data) == null ? void 0 : o.id) == "string" && e.data.id.trim() ? e.data.id.trim() : null;
}
function uh(e) {
  var n, a;
  const t = (n = e == null ? void 0 : e.data) == null ? void 0 : n.biz_data;
  return typeof (t == null ? void 0 : t.status) == "string" ? t.status.trim() : typeof (t == null ? void 0 : t.file_status) == "string" ? t.file_status.trim() : typeof ((a = t == null ? void 0 : t.file) == null ? void 0 : a.status) == "string" ? t.file.status.trim() : "uploaded";
}
function Rs(e) {
  let t = 0;
  for (let n = 0; n < e.length; n++) {
    const a = e.charCodeAt(n);
    t = (t << 5) - t + a | 0;
  }
  return t.toString(36);
}
function dh(e) {
  return new Promise((t) => setTimeout(t, e));
}
const mh = 1e6, fh = 0.85, hh = 128e3, gh = 1e3;
function Ft(e) {
  if (!e) return 0;
  let t = 0;
  for (let a = 0; a < e.length; a++) {
    const o = e.charCodeAt(a);
    (o >= 19968 && o <= 40959 || o >= 13312 && o <= 19903) && t++;
  }
  const n = e.length - t;
  return Math.ceil(n / 4 + t / 1.5);
}
class xh {
  constructor(t = mh) {
    Be(this, "sessions", /* @__PURE__ */ new Map());
    Be(this, "contextWindow");
    this.contextWindow = t;
  }
  async getSession(t, n) {
    const a = this.sessions.get(t);
    if (a) {
      const s = a.totalTokens + n + hh, i = this.contextWindow * fh;
      if (s < i && a.history.length < gh)
        return a.lastUsedAt = Date.now(), a.requestCount++, { sessionId: a.sessionId, isNew: !1 };
      console.log(
        `[session-mgr] Context approaching limit (${a.totalTokens}/${this.contextWindow} tokens, ${a.history.length} messages). Compressing...`
      ), await this.compressAndRotate(t, a);
      const r = this.sessions.get(t);
      if (r)
        return { sessionId: r.sessionId, isNew: !0 };
    }
    const o = await Qt(t);
    return this.sessions.set(t, {
      sessionId: o,
      token: t,
      history: [],
      totalTokens: 0,
      createdAt: Date.now(),
      lastUsedAt: Date.now(),
      requestCount: 1,
      contextSummary: "",
      lastMessageId: null
    }), { sessionId: o, isNew: !0 };
  }
  recordExchange(t, n, a, o) {
    const s = this.sessions.get(t);
    if (!s) return;
    const i = Ft(n), r = Ft(a);
    s.history.push({
      role: "user",
      content: n,
      tokenEstimate: i,
      timestamp: Date.now()
    }), s.history.push({
      role: "assistant",
      content: a,
      tokenEstimate: r,
      timestamp: Date.now()
    }), s.totalTokens += i + r, s.lastUsedAt = Date.now(), o && (s.lastMessageId = o);
  }
  /**
   * Get the parent message ID for the next request.
   */
  getParentMessageId(t) {
    var n;
    return ((n = this.sessions.get(t)) == null ? void 0 : n.lastMessageId) || null;
  }
  getContextSummary(t) {
    var n;
    return ((n = this.sessions.get(t)) == null ? void 0 : n.contextSummary) || "";
  }
  getSessionInfo(t) {
    const n = this.sessions.get(t);
    return n ? {
      sessionId: n.sessionId,
      requestCount: n.requestCount,
      totalTokens: n.totalTokens,
      historyMessages: n.history.length,
      hasCompressedContext: !!n.contextSummary
    } : {
      sessionId: null,
      requestCount: 0,
      totalTokens: 0,
      historyMessages: 0,
      hasCompressedContext: !1
    };
  }
  async resetSession(t) {
    const n = this.sessions.get(t);
    n && (Nt(t, n.sessionId).catch(() => {
    }), this.sessions.delete(t)), As(t);
  }
  async cleanup() {
    for (const [t, n] of this.sessions)
      Nt(t, n.sessionId).catch(() => {
      });
    this.sessions.clear(), ih();
  }
  cleanupStale(t = 30 * 60 * 1e3) {
    const n = Date.now();
    for (const [a, o] of this.sessions)
      n - o.lastUsedAt > t && (console.log(
        `[session-mgr] Cleaning stale session ${o.sessionId.slice(0, 8)}... (idle ${Math.round((n - o.lastUsedAt) / 6e4)}min)`
      ), Nt(a, o.sessionId).catch(() => {
      }), this.sessions.delete(a), As(a));
  }
  async compressAndRotate(t, n) {
    const a = this.buildCompressedSummary(n);
    Nt(t, n.sessionId).catch(() => {
    });
    const o = await Qt(t);
    this.sessions.set(t, {
      sessionId: o,
      token: t,
      history: [],
      totalTokens: Ft(a),
      createdAt: Date.now(),
      lastUsedAt: Date.now(),
      requestCount: 1,
      contextSummary: a,
      lastMessageId: null
      // Reset ID chain on compression rotation
    }), console.log(
      `[session-mgr] Compressed ${n.history.length} messages (${n.totalTokens} tokens) → summary (${Ft(a)} tokens). New session: ${o.slice(0, 8)}...`
    );
  }
  buildCompressedSummary(t) {
    const n = [];
    if (t.contextSummary && n.push(
      `[Previous context summary]
` + this.truncateText(t.contextSummary, 2e3)
    ), t.history.length === 0) return n.join(`

`);
    const a = Math.min(6, t.history.length), o = t.history.slice(0, -a), s = t.history.slice(-a);
    if (o.length > 0) {
      const i = this.summarizeMessages(o);
      i && n.push(
        `[Conversation history summary — ${o.length} messages, ${t.requestCount} exchanges]
` + i
      );
    }
    if (s.length > 0) {
      const i = s.map((r) => {
        const c = r.role.toUpperCase(), p = this.truncateText(r.content, 4e3);
        return `[${c}]
${p}`;
      }).join(`

`);
      n.push(`[Recent conversation — keep for context]
` + i);
    }
    return n.join(`

---

`);
  }
  summarizeMessages(t) {
    var i, r;
    const n = /* @__PURE__ */ new Set(), a = [], o = [];
    for (const c of t) {
      const p = c.content.match(
        /<\|DSML\|invoke name="([^"]+)"/g
      );
      if (p)
        for (const u of p) {
          const d = (i = u.match(/name="([^"]+)"/)) == null ? void 0 : i[1];
          d && a.push(d);
        }
      if (c.role === "user") {
        const u = (r = c.content.split(`
`)[0]) == null ? void 0 : r.trim();
        u && u.length < 200 && n.add(u);
      }
      const l = c.content.match(
        /(?:\/[\w.-]+)+\.\w+|[\w.-]+\.(?:ts|js|go|py|tsx|jsx|css|html|json)/g
      );
      if (l)
        for (const u of l.slice(0, 10))
          n.add(`File: ${u}`);
    }
    const s = [];
    if (n.size > 0) {
      const c = [...n].slice(0, 15).join(`
- `);
      s.push(`Topics discussed:
- ${c}`);
    }
    if (a.length > 0) {
      const c = [...new Set(a)];
      s.push(`Tools used: ${c.join(", ")}`);
    }
    return o.length > 0 && s.push(`Key decisions:
- ${o.join(`
- `)}`), s.push(
      `Total exchanges: ${Math.ceil(t.length / 2)}, Total tokens: ~${t.reduce((c, p) => c + p.tokenEstimate, 0)}`
    ), s.join(`
`);
  }
  truncateText(t, n) {
    if (t.length <= n) return t;
    const a = t.slice(0, n), o = a.lastIndexOf(`
`), s = o > n * 0.5 ? o : n;
    return a.slice(0, s) + `
... [truncated]`;
  }
}
const an = "-nothinking", vh = [
  { id: "deepseek-v4-flash", object: "model", created: 1677610602, owned_by: "deepseek" },
  { id: "deepseek-v4-pro", object: "model", created: 1677610602, owned_by: "deepseek" },
  { id: "deepseek-v4-flash-search", object: "model", created: 1677610602, owned_by: "deepseek" },
  { id: "deepseek-v4-pro-search", object: "model", created: 1677610602, owned_by: "deepseek" },
  { id: "deepseek-v4-vision", object: "model", created: 1677610602, owned_by: "deepseek" }
];
function bh(e) {
  const t = [];
  for (const n of e)
    t.push(n), t.push({ ...n, id: n.id + an });
  return t;
}
const br = bh(vh);
function yr(e) {
  const { base: t, noThinking: n } = co(e);
  switch (t) {
    case "deepseek-v4-flash":
    case "deepseek-v4-pro":
    case "deepseek-v4-vision":
      return { thinking: !n, search: !1, ok: !0 };
    case "deepseek-v4-flash-search":
    case "deepseek-v4-pro-search":
      return { thinking: !n, search: !0, ok: !0 };
    default:
      return { thinking: !1, search: !1, ok: !1 };
  }
}
function yh(e) {
  const { base: t } = co(e);
  switch (t) {
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
function la(e) {
  return yr(e).ok;
}
const wh = {
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
function kh(e, t) {
  const n = e.trim().toLowerCase();
  if (!n) return null;
  const a = { ...wh, ...t || {} };
  if (la(n)) return n;
  const o = a[n];
  if (o && la(o)) return o;
  const { base: s, noThinking: i } = co(n), r = a[s];
  return r && la(r) ? i ? r + an : r : null;
}
function co(e) {
  const t = e.trim().toLowerCase();
  return t.endsWith(an) ? { base: t.slice(0, -an.length), noThinking: !0 } : { base: t, noThinking: !1 };
}
function Sh() {
  return { object: "list", data: br };
}
const Eh = [
  "quasi_status",
  "elapsed_secs",
  "token_usage",
  "pending_fragment",
  "conversation_mode",
  "fragments/-1/status",
  "fragments/-2/status",
  "fragments/-3/status"
], _h = /* @__PURE__ */ new Set(["response/search_status"]), Oa = /<\/\s*think\s*>/gi, Th = /<\s*think\s*>/gi;
function Ah(e) {
  if (!e || e === "response/status" || !e.startsWith("response/fragments/") || !e.endsWith("/status")) return !1;
  const t = e.slice(19, e.length - 7).replace(/^-/, "");
  return t.length > 0 && /^\d+$/.test(t);
}
function wr(e) {
  if (Ah(e) || _h.has(e)) return !0;
  for (const t of Eh)
    if (e.includes(t)) return !0;
  return !1;
}
function on(e) {
  return e === "response/status" || e === "status";
}
function pa(e) {
  return e.replace(Oa, "").replace(Th, "");
}
function kr(e) {
  const t = e.trim();
  if (!t || !t.startsWith("data:")) return [null, !1, !1];
  const n = t.slice(5).trim();
  if (n === "[DONE]") return [null, !0, !0];
  try {
    return [JSON.parse(n), !1, !0];
  } catch {
    return [null, !1, !1];
  }
}
function Sr(e, t, n) {
  const a = e.v;
  if (a === void 0)
    return { parts: [], finished: !1, nextType: n, messageId: null };
  const o = e.p ?? "";
  if (wr(o))
    return { parts: [], finished: !1, nextType: n, messageId: null };
  if (on(o) && typeof a == "string")
    return a.trim().toUpperCase() === "FINISHED" ? { parts: [], finished: !0, nextType: n, messageId: null } : { parts: [], finished: !1, nextType: n, messageId: null };
  let s = n;
  const i = [];
  if (o === "response/content" ? s = "text" : o === "response/thinking_content" && (!t || s !== "text") && (s = "thinking"), o === "response/fragments" && (e.o ?? "").toString().toUpperCase() === "APPEND") {
    const d = Array.isArray(a) ? a : [];
    for (const f of d) {
      if (typeof f != "object" || !f) continue;
      const { typeName: g, content: x } = La(f);
      switch (g) {
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
      for (const g of f) {
        if (typeof g != "object" || !g) continue;
        const { typeName: x } = La(g);
        x === "THINK" || x === "THINKING" ? s = "thinking" : x === "RESPONSE" && (s = "text");
      }
    }
  let r;
  o === "response/thinking_content" ? r = !t || s !== "text" ? "thinking" : "text" : o === "response/content" ? r = "text" : o.includes("response/fragments") && o.includes("/content") ? r = s : o === "" ? r = s || "text" : r = "text";
  const c = Rh(a, r, o);
  if (c.finished)
    return { parts: [], finished: !0, nextType: s, messageId: null };
  i.push(...c.parts), c.newType && (s = c.newType);
  const { parts: p, transitioned: l } = Lh(i);
  return l && (s = "text"), { parts: t ? p : p.filter((d) => d.type !== "thinking"), finished: !1, nextType: s, messageId: Ch(e) };
}
function Ch(e) {
  const t = e.response_message_id ?? e.message_id;
  if (typeof t == "number" && t > 0) return t;
  const n = e.v;
  if (typeof n == "object" && n !== null) {
    const a = n.message_id ?? n.id;
    if (typeof a == "number" && a > 0) return a;
    const o = n.response;
    if (typeof o == "object" && o !== null) {
      const s = o.message_id ?? o.id;
      if (typeof s == "number" && s > 0) return s;
    }
  }
  return null;
}
function La(e) {
  const t = (e.type || "").toUpperCase(), n = e.content || "";
  return { typeName: t, content: n };
}
function Rh(e, t, n) {
  const a = [];
  if (typeof e == "string")
    return e === "FINISHED" && (n === "" || n === "status") ? { parts: [], finished: !0 } : on(n) ? { parts: [], finished: !1 } : (e && a.push({ text: e, type: t }), { parts: a, finished: !1 });
  if (Array.isArray(e)) {
    const o = Oh(e, t);
    return o.finished ? { parts: [], finished: !0 } : { parts: o.parts, finished: !1 };
  }
  if (typeof e == "object" && e !== null) {
    if (n === "response/content" || n === "response/thinking_content" || n === "") {
      const i = e.text || e.content || "";
      if (i)
        return a.push({ text: i, type: t }), { parts: a, finished: !1 };
    }
    const o = e.response || e, s = o == null ? void 0 : o.fragments;
    if (Array.isArray(s)) {
      let i;
      for (const r of s) {
        if (typeof r != "object" || !r) continue;
        const { typeName: c, content: p } = La(r);
        switch (c) {
          case "THINK":
          case "THINKING":
            i = "thinking", p && a.push({ text: p, type: "thinking" });
            break;
          case "RESPONSE":
            i = "text", p && a.push({ text: p, type: "text" });
            break;
          default:
            p && a.push({ text: p, type: t });
        }
      }
      return { parts: a, finished: !1, newType: i };
    }
  }
  return { parts: a, finished: !1 };
}
function Oh(e, t) {
  const n = [];
  for (const a of e) {
    if (typeof a != "object" || !a) continue;
    const o = a.p || "", s = a.v;
    if (s === void 0) continue;
    if (on(o)) {
      if (typeof s == "string" && s.trim().toUpperCase() === "FINISHED")
        return { parts: [], finished: !0 };
      continue;
    }
    if (wr(o)) continue;
    if (typeof a.content == "string" && a.content) {
      switch ((a.type || "").toUpperCase()) {
        case "THINK":
        case "THINKING":
          n.push({ text: a.content, type: "thinking" });
          break;
        case "RESPONSE":
          n.push({ text: a.content, type: "text" });
          break;
        default:
          n.push({ text: a.content, type: t });
      }
      continue;
    }
    const i = o.includes("thinking") ? "thinking" : o.includes("content") || o === "response" || o === "fragments" ? "text" : t;
    if (typeof s == "string") {
      if (on(o)) continue;
      s && s !== "FINISHED" && n.push({ text: s, type: i });
    } else if (Array.isArray(s))
      for (const r of s)
        if (typeof r == "object" && (r != null && r.content))
          switch ((r.type || "").toUpperCase()) {
            case "THINK":
            case "THINKING":
              n.push({ text: r.content, type: "thinking" });
              break;
            case "RESPONSE":
              n.push({ text: r.content, type: "text" });
              break;
            default:
              n.push({ text: r.content, type: i });
          }
        else typeof r == "string" && r && n.push({ text: r, type: i });
  }
  return { parts: n, finished: !1 };
}
function Lh(e) {
  const t = [];
  let n = !1;
  for (const a of e) {
    if (n && a.type === "thinking") {
      const r = pa(a.text);
      r && t.push({ text: r, type: "text" });
      continue;
    }
    if (a.type !== "thinking") {
      const r = pa(a.text);
      r && t.push({ text: r, type: a.type });
      continue;
    }
    const o = Oa.exec(a.text);
    if (Oa.lastIndex = 0, !o) {
      t.push(a);
      continue;
    }
    n = !0;
    const s = a.text.slice(0, o.index), i = pa(a.text.slice(o.index + o[0].length));
    s && t.push({ text: s, type: "thinking" }), i && t.push({ text: i, type: "text" });
  }
  return { parts: t, transitioned: n };
}
function Er(e) {
  const t = e.code;
  return typeof t == "string" && t.trim().toLowerCase() === "content_filter" ? !0 : Pa(e);
}
function Pa(e) {
  if (Array.isArray(e)) return e.some((t) => Pa(t));
  if (typeof e == "object" && e !== null) {
    const t = e.p;
    if (typeof t == "string" && t.toLowerCase().includes("status") && typeof e.v == "string" && e.v.trim().toLowerCase() === "content_filter" || typeof e.code == "string" && e.code.trim().toLowerCase() === "content_filter") return !0;
    for (const n of Object.values(e))
      if (Pa(n)) return !0;
  }
  return !1;
}
function lo(e) {
  if (e == null) return "";
  if (typeof e == "string") return e;
  if (Array.isArray(e)) {
    const t = [];
    for (const n of e) {
      if (typeof n != "object" || n === null) continue;
      const a = n, o = (typeof a.type == "string" ? a.type : "").toLowerCase().trim();
      if (o === "text" || o === "output_text" || o === "input_text") {
        const s = typeof a.text == "string" ? a.text : typeof a.content == "string" ? a.content : "";
        s && t.push(s);
      }
    }
    if (t.length > 0) return t.join(`
`);
  }
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}
function po(e) {
  const t = (e || "user").toLowerCase().trim();
  return t === "developer" ? "system" : t;
}
function Os(e) {
  return e ? e.includes("]]>") ? "<![CDATA[" + e.replace(/]]>/g, "]]]><![CDATA[>") + "]]>" : "<![CDATA[" + e + "]]>" : "";
}
function _r(e) {
  if (!Array.isArray(e) || e.length === 0) return "";
  const t = [];
  for (const n of e) {
    if (typeof n != "object" || n === null) continue;
    const a = n;
    let o = "", s = null;
    const i = a.function;
    if (i && typeof i == "object" && (o = typeof i.name == "string" ? i.name.trim() : "", s = i.arguments ?? i.input ?? null), o || (o = typeof a.name == "string" ? a.name.trim() : "", s || (s = a.arguments ?? a.input ?? null)), !o) continue;
    let r = null;
    if (typeof s == "string") {
      const p = s.trim();
      if (p)
        try {
          r = JSON.parse(p);
        } catch {
        }
    } else typeof s == "object" && s !== null && (r = s);
    let c = "";
    if (r && typeof r == "object" && !Array.isArray(r))
      for (const [p, l] of Object.entries(r)) {
        const u = typeof l == "object" && l !== null ? JSON.stringify(l) : String(l ?? "");
        c += `    <|DSML|parameter name="${p}">${Os(u)}</|DSML|parameter>
`;
      }
    else typeof s == "string" && s.trim() && (c = `    <|DSML|parameter name="content">${Os(s)}</|DSML|parameter>
`);
    c ? t.push(
      `  <|DSML|invoke name="${o}">
${c}  </|DSML|invoke>`
    ) : t.push(`  <|DSML|invoke name="${o}"></|DSML|invoke>`);
  }
  return t.length === 0 ? "" : `<|DSML|tool_calls>
` + t.join(`
`) + `
</|DSML|tool_calls>`;
}
function Ph(e, t) {
  if (!Array.isArray(e) || e.length === 0) return "";
  const n = xr(t || []), a = [];
  a.push({ role: "system", content: zi });
  let o = !1;
  for (const c of e) {
    const p = po(c.role);
    let l = lo(c.content);
    if (p === "assistant") {
      const u = _r(c.tool_calls);
      u && (l = l ? l + `

` + u : u);
    } else p === "system" ? n && !o && (l = l ? l + `

` + n : n, o = !0) : p === "tool" && (l.trim() || (l = "null"));
    a.push({ role: p, content: l });
  }
  n && !o && a.splice(1, 0, { role: "system", content: n });
  const s = [];
  for (const c of a)
    s.length > 0 && s[s.length - 1].role === c.role ? s[s.length - 1].content += `

` + c.content : s.push({ ...c });
  const i = [Fi];
  let r = "";
  for (const c of s)
    switch (r = c.role, c.role) {
      case "system": {
        const p = c.content.trim();
        p && i.push(jd + p + Dd);
        break;
      }
      case "user":
        i.push(Ui + c.content);
        break;
      case "assistant":
        i.push(Zt + c.content + Bi);
        break;
      case "tool": {
        const p = c.content.trim();
        p && i.push(Mi + p + $i);
        break;
      }
      default: {
        const p = c.content.trim();
        p && i.push(p);
        break;
      }
    }
  return r !== "assistant" && i.push(Zt), i.join("");
}
function jh(e) {
  const t = [], n = [];
  for (const a of e) {
    const o = po(a.role), s = lo(a.content);
    o === "system" || o === "developer" ? s.trim() && t.push(s) : n.push(a);
  }
  return { systemMessages: t, conversationMessages: n };
}
function Dh(e) {
  if (!Array.isArray(e) || e.length === 0) return "";
  const t = [];
  for (const s of e) {
    const i = po(s.role);
    let r = lo(s.content);
    if (i === "assistant") {
      const c = _r(s.tool_calls);
      c && (r = r ? r + `

` + c : c);
    } else i === "tool" && (r.trim() || (r = "null"));
    t.push({ role: i, content: r });
  }
  const n = [];
  for (const s of t)
    n.length > 0 && n[n.length - 1].role === s.role ? n[n.length - 1].content += `

` + s.content : n.push({ ...s });
  const a = [Fi];
  let o = "";
  for (const s of n)
    switch (o = s.role, s.role) {
      case "user":
        a.push(Ui + s.content);
        break;
      case "assistant":
        a.push(Zt + s.content + Bi);
        break;
      case "tool": {
        const i = s.content.trim();
        i && a.push(Mi + i + $i);
        break;
      }
      default: {
        const i = s.content.trim();
        i && a.push(i);
        break;
      }
    }
  return o !== "assistant" && a.push(Zt), a.join("");
}
const Nh = /```json\s*```/gis, Ih = /\[\{\s*"function"\s*:\s*\{[\s\S]*?\}\s*,\s*"id"\s*:\s*"call[^"]*"\s*,\s*"type"\s*:\s*"function"\s*\}\]/gis, qh = /<\s*\|\s*tool\s*\|\s*>\s*\{[\s\S]*?"tool_call_id"\s*:\s*"call[^"]*"\s*\}/gis, Fh = /<\/?\s*think\s*>/gis, Uh = /<[|\uFF5C]\s*begin[_\u2581]of[_\u2581]sentence\s*[|\uFF5C]>/gi, Mh = /<[|\uFF5C]\s*(?:begin[_\u2581])?[_\u2581]*of[_\u2581]thought\s*[|\uFF5C]>/gi, Bh = /<[|\uFF5C]\s*(?:assistant|tool|end[_\u2581]of[_\u2581]sentence|end[_\u2581]of[_\u2581]thinking|end[_\u2581]of[_\u2581]thought|end[_\u2581]of[_\u2581]toolresults|end[_\u2581]of[_\u2581]instructions)\s*[|\uFF5C]>/gi, $h = [
  /(<attempt_completion\b[^>]*>)([\s\S]*?)(<\/attempt_completion>)/gis,
  /(<ask_followup_question\b[^>]*>)([\s\S]*?)(<\/ask_followup_question>)/gis,
  /(<new_task\b[^>]*>)([\s\S]*?)(<\/new_task>)/gis
], Ut = /<\/?(?:attempt_completion|ask_followup_question|new_task)\b[^>]*>/gis, Ls = /<(?:attempt_completion|ask_followup_question|new_task)\b[^>]*>\s*<result>/gis, Ps = /<\/result>\s*<\/(?:attempt_completion|ask_followup_question|new_task)\b[^>]*>/gis, lt = /<\/?result>/gis;
function zh(e) {
  if (!e) return e;
  let t = e;
  return t = t.replace(Nh, ""), t = t.replace(Ih, ""), t = t.replace(qh, ""), t = Hh(t), t = t.replace(Fh, ""), t = t.replace(Uh, ""), t = t.replace(Mh, ""), t = t.replace(Bh, ""), t = Wh(t), t = Vh(t), t;
}
function Hh(e) {
  const t = /<\/?\s*think\s*>/gi, n = [];
  let a;
  for (; (a = t.exec(e)) !== null; )
    n.push({ index: a.index, match: a[0] });
  if (n.length === 0) return e;
  let o = 0, s = -1;
  for (const { index: r, match: c } of n) {
    if (c.replace(/\s/g, "").toLowerCase().startsWith("</")) {
      o > 0 && (o--, o === 0 && (s = -1));
      continue;
    }
    o === 0 && (s = r), o++;
  }
  if (o === 0 || s < 0) return e;
  const i = e.slice(0, s);
  return i.trim() ? i : "";
}
function Wh(e) {
  if (!e) return e;
  let t = "", n = 0;
  for (; n < e.length; ) {
    const a = Re(e, n);
    if (!a) {
      t += e.slice(n);
      break;
    }
    if (a.Start > n && (t += e.slice(n, a.Start)), a.Closing || a.Name !== "tool_calls") {
      t += e.slice(a.Start, a.End + 1), n = a.End + 1;
      continue;
    }
    const o = wn(e, a);
    if (!o) {
      t += e.slice(a.Start, a.End + 1), n = a.End + 1;
      continue;
    }
    n = o.End + 1;
  }
  return t;
}
function Vh(e) {
  let t = e;
  for (const n of $h)
    n.lastIndex = 0, t = t.replace(n, (a, o, s, i) => s.replace(lt, ""));
  return Ut.lastIndex = 0, Ut.test(t) && (Ls.lastIndex = 0, t = t.replace(Ls, (n) => (lt.lastIndex = 0, n.replace(lt, ""))), Ps.lastIndex = 0, t = t.replace(Ps, (n) => (lt.lastIndex = 0, n.replace(lt, ""))), Ut.lastIndex = 0, t = t.replace(Ut, "")), t;
}
const Gh = /\[(citation|reference):\s*\d+\]/gi;
function Kh(e) {
  return e && e.replace(Gh, "");
}
function pt(e, t = !0) {
  if (!e) return e;
  let n = e;
  return t && (n = Kh(n)), zh(n);
}
function Jh(e, t) {
  if (!e || !t) return t;
  const n = Math.min(e.length, t.length);
  if (n === 0) return t;
  let a = 0;
  for (let o = n; o >= 1; o--) {
    const s = e.slice(-o), i = t.slice(0, o);
    if (s === i) {
      a = o;
      break;
    }
  }
  return a === 0 ? t : t.slice(a);
}
class js {
  constructor() {
    Be(this, "buffer", "");
  }
  append(t) {
    const n = Jh(this.buffer, t);
    return n && (this.buffer += n), n;
  }
  get text() {
    return this.buffer;
  }
  reset() {
    this.buffer = "";
  }
}
const Ds = "Previous reply had no visible output. Please regenerate the visible final answer or tool call now.", Tr = 1;
function Xh(e, t, n, a, o = Tr) {
  return a < o && !n && !t && !e.trim();
}
function Yh(e, t) {
  const n = { ...e }, a = typeof e.prompt == "string" ? e.prompt : "";
  return n.prompt = Zh(a), t && t > 0 && (n.parent_message_id = t), n;
}
function Zh(e) {
  const t = e.replace(/[\r\n\t ]+$/, "");
  return t ? `${t}

${Ds}` : Ds;
}
async function Qh(e, t, n) {
  var x;
  const a = Date.now(), o = await Rm(e);
  let s;
  try {
    s = JSON.parse(o);
  } catch {
    pe(t, 400, {
      error: { message: "Invalid JSON", type: "invalid_request_error" }
    });
    return;
  }
  const i = s.stream ? "stream" : "sync", r = s.model || "(none)", c = kh(
    s.model,
    n.config.modelAliases
  );
  if (!c) {
    P(
      n.port,
      `[api] ✗ completion rejected — unsupported model: ${r}`
    ), pe(t, 400, {
      error: {
        message: `Model '${s.model}' is not supported`,
        type: "invalid_request_error"
      }
    });
    return;
  }
  const p = r !== c ? `${r} → ${c}` : c;
  P(
    n.port,
    `[api] ⟶ completion ${i} | model: ${p} | msgs: ${((x = s.messages) == null ? void 0 : x.length) || 0}`
  );
  const { thinking: l, search: u } = yr(c), d = yh(c);
  let f = Cm(n);
  if (!f) {
    P(
      n.port,
      "[api] ✗ completion failed — no available accounts"
    ), pe(t, 503, {
      error: { message: "No available accounts", type: "api_error" }
    });
    return;
  }
  n.sessionManager.cleanupStale();
  let g;
  try {
    const { systemMessages: v, conversationMessages: h } = jh(s.messages), b = s.tools || [], k = Dh(h), E = Wt(k), _ = await n.sessionManager.getSession(
      f,
      E
    );
    g = _.sessionId;
    const A = n.sessionManager.getParentMessageId(f), C = n.sessionManager.getSessionInfo(f), I = _.isNew ? "new" : `reuse #${C.requestCount}`;
    P(
      n.port,
      `[api]   session: ${g.slice(0, 8)}... (${I}, ~${C.totalTokens} tokens, parent: ${A || "none"})`
    );
    let G = [], T = k;
    try {
      const B = await sh(
        f,
        v,
        b,
        n.port
      );
      G = B.refFileIds;
      const $ = n.sessionManager.getContextSummary(f), re = $ ? `[Compressed context from previous conversation]
${$}

---

${k}` : k;
      T = rh(
        re,
        B.toolsFileId !== null
      ), P(
        n.port,
        `[api]   rule-files: rules=${B.rulesFileId.slice(0, 8)}... tools=${B.toolsFileId ? B.toolsFileId.slice(0, 8) + "..." : "none"}`
      );
    } catch (B) {
      const $ = B instanceof Error ? B.message : String(B);
      P(
        n.port,
        `[api]   rule-file upload failed, falling back to inline: ${$}`
      ), T = Ph(s.messages, b);
      const re = n.sessionManager.getContextSummary(f);
      re && (T = `[Compressed context from previous conversation]
${re}

---

${T}`);
    }
    const Z = await en(f);
    P(n.port, "[api]   pow: solved");
    const U = {
      chat_session_id: g,
      prompt: T,
      ref_file_ids: G,
      thinking_enabled: l,
      search_enabled: u,
      parent_message_id: A
    };
    d && (U.model_class = d);
    let ie = null;
    s.stream ? ie = await ng(
      t,
      n,
      f,
      U,
      Z,
      c,
      l
    ) : ie = await eg(
      t,
      n,
      f,
      U,
      Z,
      c,
      T,
      l
    ), n.sessionManager.recordExchange(
      f,
      k,
      "(response recorded)",
      ie
    );
    const M = ((Date.now() - a) / 1e3).toFixed(1);
    P(
      n.port,
      `[api] ✓ completion done | model: ${c} | ${i} | ${M}s`
    );
  } catch (v) {
    const h = At(v), b = ((Date.now() - a) / 1e3).toFixed(1);
    P(
      n.port,
      `[api] ✗ completion error (${b}s): ${h}`
    ), h.includes("create session failed") && await n.sessionManager.resetSession(f), pe(t, 500, {
      error: {
        message: h || "Completion failed",
        type: "api_error"
      }
    });
  }
}
async function eg(e, t, n, a, o, s, i, r) {
  let c = { ...a }, p = o, l = n, u = 0, d = !1;
  for (; ; ) {
    const f = await _a(
      l,
      c,
      p
    );
    if (f.status === 429 && !d) {
      const A = Qi(t, l);
      if (A) {
        d = !0, P(
          t.port,
          "[api]   ⟲ 429 rate limit — rotating to alternate account"
        ), l = A;
        try {
          const C = await Qt(A);
          c = {
            ...c,
            chat_session_id: C
          }, delete c.parent_message_id, p = await en(A);
          continue;
        } catch (C) {
          P(
            t.port,
            `[api]   ✗ account switch failed: ${At(C)}`
          );
        }
      }
    }
    if (f.status !== 200) {
      const A = await no(f.data);
      return P(
        t.port,
        `[api] ✗ DeepSeek error ${f.status}: ${A.slice(0, 200)}`
      ), (f.status === 422 || f.status === 400) && (P(
        t.port,
        "[api]   resetting session due to error..."
      ), await t.sessionManager.resetSession(l)), pe(e, f.status, {
        error: {
          message: `DeepSeek API error: ${f.status}`,
          type: "api_error"
        }
      }), null;
    }
    const g = await tg(
      f.data,
      r
    );
    if (Xh(
      g.contentText,
      g.toolCalls !== void 0 && g.toolCalls.length > 0,
      g.finishReason === "content_filter",
      u,
      Tr
    )) {
      u++, P(
        t.port,
        `[api]   ⟲ empty output — retry #${u} (parent: ${g.lastMessageId || "none"})`
      ), c = Yh(
        c,
        g.lastMessageId
      );
      try {
        p = await en(l);
      } catch {
        P(
          t.port,
          "[api]   ⚠ retry PoW fetch failed, reusing original"
        );
      }
      continue;
    }
    const x = pt(g.contentText), v = r ? pt(g.thinkingText) : "";
    let h = g.toolCalls;
    if ((!h || h.length === 0) && !x.trim()) {
      const A = g.thinkingText || v || "";
      if (A.trim()) {
        const C = hr(A);
        C.Calls.length > 0 && (P(
          t.port,
          `[api]   ↗ recovered ${C.Calls.length} tool call(s) from thinking content`
        ), h = C.Calls.map((I) => ({
          id: `call_${Ye.randomUUID().replace(/-/g, "")}`,
          type: "function",
          function: {
            name: I.Name,
            arguments: JSON.stringify(I.Input)
          }
        })));
      }
    }
    const b = h && h.length > 0 ? "tool_calls" : g.finishReason, k = `chatcmpl-${Ye.randomUUID().replace(/-/g, "").slice(0, 24)}`, E = Math.floor(Date.now() / 1e3), _ = {
      id: k,
      object: "chat.completion",
      created: E,
      model: s,
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: x,
            ...r && v ? { reasoning_content: v } : {},
            ...h && h.length > 0 ? { tool_calls: h } : {}
          },
          finish_reason: b
        }
      ],
      usage: {
        prompt_tokens: Wt(i),
        completion_tokens: Wt(
          g.contentText + g.thinkingText
        ),
        total_tokens: Wt(
          i + g.contentText + g.thinkingText
        )
      }
    };
    return pe(e, 200, _), g.lastMessageId;
  }
}
async function tg(e, t) {
  let n = "", a = "", o = t ? "thinking" : "text", s = "stop", i = null;
  const c = (await no(e)).split(`
`);
  for (const d of c) {
    const f = d.trim();
    if (!f) continue;
    const [g, x, v] = kr(f);
    if (!v || x || !g) continue;
    if (Er(g)) {
      s = "content_filter";
      break;
    }
    const { parts: h, finished: b, nextType: k, messageId: E } = Sr(
      g,
      t,
      o
    );
    if (E && (i = E), o = k, b) break;
    for (const _ of h)
      _.type === "thinking" ? n += _.text : a += _.text;
  }
  let p;
  const l = a.indexOf("<|DSML|tool_calls>"), u = a.indexOf("</|DSML|tool_calls>");
  if (l !== -1 && u !== -1) {
    const d = a.substring(
      l,
      u + 19
    ), f = th(d);
    f.length > 0 && (p = f, a = a.substring(0, l), s === "stop" && (s = "tool_calls"));
  }
  return { thinkingText: n, contentText: a, finishReason: s, lastMessageId: i, toolCalls: p };
}
async function ng(e, t, n, a, o, s, i) {
  let r = n, c = { ...a }, p = o;
  const l = await _a(
    r,
    c,
    p
  );
  if (l.status === 429) {
    const u = Qi(t, r);
    if (u) {
      P(
        t.port,
        "[api]   ⟲ 429 rate limit — rotating to alternate account (stream)"
      );
      try {
        const d = await Qt(u);
        c = {
          ...c,
          chat_session_id: d
        }, delete c.parent_message_id, p = await en(u), r = u;
        const f = await _a(
          r,
          c,
          p
        );
        if (f.status === 200)
          return P(t.port, "[api]   streaming response..."), Ns(
            e,
            f.data,
            s,
            i,
            t
          );
      } catch (d) {
        P(
          t.port,
          `[api]   ✗ account switch failed: ${At(d)}`
        );
      }
    }
  }
  if (l.status !== 200) {
    const u = await no(l.data);
    return P(
      t.port,
      `[api] ✗ DeepSeek error ${l.status}: ${u.slice(0, 200)}`
    ), (l.status === 422 || l.status === 400) && (P(
      t.port,
      "[api]   resetting session due to error..."
    ), await t.sessionManager.resetSession(r)), pe(e, l.status, {
      error: {
        message: `DeepSeek API error: ${l.status}`,
        type: "api_error"
      }
    }), null;
  }
  return P(t.port, "[api]   streaming response..."), Ns(
    e,
    l.data,
    s,
    i,
    t
  );
}
async function Ns(e, t, n, a, o) {
  let s = null;
  e.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no"
  });
  const i = `chatcmpl-${Ye.randomUUID().replace(/-/g, "").slice(0, 24)}`, r = Math.floor(Date.now() / 1e3);
  let c = a ? "thinking" : "text", p = "", l = !1, u = !1;
  const d = new nh(), f = new js(), g = new js();
  return new Promise((x, v) => {
    const h = (b) => {
      e.write(`data: ${JSON.stringify(b)}

`);
    };
    t.on("data", (b) => {
      p += b.toString("utf-8");
      const k = p.split(`
`);
      p = k.pop() || "";
      for (const E of k) {
        const _ = E.trim();
        if (!_) continue;
        const [A, C, I] = kr(_);
        if (!I) continue;
        if (C) {
          h({
            id: i,
            object: "chat.completion.chunk",
            created: r,
            model: n,
            choices: [
              {
                index: 0,
                delta: {},
                finish_reason: "stop"
              }
            ]
          }), e.write(`data: [DONE]

`), e.end();
          return;
        }
        if (!A) continue;
        if (Er(A)) {
          h({
            id: i,
            object: "chat.completion.chunk",
            created: r,
            model: n,
            choices: [
              {
                index: 0,
                delta: {},
                finish_reason: "content_filter"
              }
            ]
          }), e.write(`data: [DONE]

`), e.end();
          return;
        }
        const { parts: G, finished: T, nextType: Z, messageId: U } = Sr(
          A,
          a,
          c
        );
        if (U && (s = U), c = Z, T) {
          h({
            id: i,
            object: "chat.completion.chunk",
            created: r,
            model: n,
            choices: [
              {
                index: 0,
                delta: {},
                finish_reason: "stop"
              }
            ]
          }), e.write(`data: [DONE]

`), e.end();
          return;
        }
        for (const ie of G)
          if (ie.type === "thinking") {
            const M = g.append(ie.text);
            if (!M) continue;
            const B = pt(M);
            if (!B) continue;
            l || (h({
              id: i,
              object: "chat.completion.chunk",
              created: r,
              model: n,
              choices: [
                {
                  index: 0,
                  delta: {
                    role: "assistant",
                    reasoning_content: ""
                  },
                  finish_reason: null
                }
              ]
            }), l = !0), h({
              id: i,
              object: "chat.completion.chunk",
              created: r,
              model: n,
              choices: [
                {
                  index: 0,
                  delta: { reasoning_content: B },
                  finish_reason: null
                }
              ]
            });
          } else {
            const M = f.append(ie.text);
            if (!M) continue;
            const B = pt(M), $ = d.processChunk(B || M);
            $.outputText && h({
              id: i,
              object: "chat.completion.chunk",
              created: r,
              model: n,
              choices: [
                {
                  index: 0,
                  delta: { content: $.outputText },
                  finish_reason: null
                }
              ]
            }), $.toolCalls && (u = !0, h({
              id: i,
              object: "chat.completion.chunk",
              created: r,
              model: n,
              choices: [
                {
                  index: 0,
                  delta: { tool_calls: $.toolCalls },
                  finish_reason: null
                }
              ]
            }));
          }
      }
    }), t.on("end", () => {
      if (!e.writableEnded) {
        const b = d.flush();
        if (b.outputText) {
          const k = pt(b.outputText);
          k && h({
            id: i,
            object: "chat.completion.chunk",
            created: r,
            model: n,
            choices: [
              {
                index: 0,
                delta: { content: k },
                finish_reason: null
              }
            ]
          });
        }
        b.toolCalls && (u = !0, h({
          id: i,
          object: "chat.completion.chunk",
          created: r,
          model: n,
          choices: [
            {
              index: 0,
              delta: { tool_calls: b.toolCalls },
              finish_reason: null
            }
          ]
        })), h({
          id: i,
          object: "chat.completion.chunk",
          created: r,
          model: n,
          choices: [
            {
              index: 0,
              delta: {},
              finish_reason: u ? "tool_calls" : "stop"
            }
          ]
        }), e.write(`data: [DONE]

`), e.end(), x(s);
      }
    }), t.on("error", (b) => {
      const k = b instanceof Error ? b.message : String(b);
      P(
        o.port,
        `[api] ✗ stream error: ${k}`
      ), e.writableEnded || e.end(), v(b);
    });
  });
}
async function ag(e, t, n) {
  const a = Date.now(), o = e.method || "GET";
  if (Om(t, e), o === "OPTIONS") {
    t.writeHead(204), t.end();
    return;
  }
  const i = new URL(
    e.url || "/",
    `http://${e.headers.host || "localhost"}`
  ).pathname, r = e.socket.remoteAddress || "unknown";
  t.once("finish", () => {
    const c = Date.now() - a, p = t.statusCode;
    i !== "/healthz" && i !== "/readyz" && P(
      n.port,
      `[api] ${o} ${i} → ${p} (${c}ms) [${r}]`
    );
  });
  try {
    if (i === "/healthz" || i === "/readyz") {
      pe(t, 200, { status: "ok" });
      return;
    }
    if ((i === "/v1/models" || i === "/models") && o === "GET") {
      pe(t, 200, Sh());
      return;
    }
    const c = i.match(/^\/(?:v1\/)?models\/(.+)$/);
    if (c && o === "GET") {
      const p = c[1], l = br.find((u) => u.id === p);
      l ? pe(t, 200, l) : pe(t, 404, {
        error: {
          message: `Model '${p}' not found`,
          type: "invalid_request_error"
        }
      });
      return;
    }
    if ((i === "/v1/chat/completions" || i === "/chat/completions") && o === "POST") {
      if (!ua(e, t, n)) return;
      await Qh(e, t, n);
      return;
    }
    if ((i === "/v1/sessions/reset" || i === "/sessions/reset") && o === "POST") {
      if (!ua(e, t, n)) return;
      await n.sessionManager.cleanup(), P(n.port, "[api] ✓ All sessions reset (new section)"), pe(t, 200, { status: "ok", message: "All sessions reset" });
      return;
    }
    if ((i === "/v1/sessions/info" || i === "/sessions/info") && o === "GET") {
      if (!ua(e, t, n)) return;
      const p = [];
      for (const [, l] of n.accountTokens)
        p.push(n.sessionManager.getSessionInfo(l));
      pe(t, 200, { sessions: p });
      return;
    }
    pe(t, 404, {
      error: { message: "Not found", type: "invalid_request_error" }
    });
  } catch (c) {
    const p = At(c);
    P(
      n.port,
      `[api] ✗ ${o} ${i} — unhandled error: ${p}`
    ), pe(t, 500, {
      error: { message: "Internal Server Error", type: "api_error" }
    });
  }
}
function ua(e, t, n) {
  if (!n.config || n.config.apiKeys.length === 0) return !0;
  const a = e.headers.authorization || "";
  let o = "";
  if (a.startsWith("Bearer ") && (o = a.slice(7).trim()), !o) {
    const s = new URL(
      e.url || "/",
      `http://${e.headers.host || "localhost"}`
    );
    o = s.searchParams.get("key") || s.searchParams.get("api_key") || "";
  }
  return !o || !n.config.apiKeys.includes(o) ? (pe(t, 401, {
    error: {
      message: "Invalid API key",
      type: "invalid_request_error",
      code: "invalid_api_key"
    }
  }), !1) : !0;
}
const Fe = /* @__PURE__ */ new Map();
function og(e) {
  Tm(e);
}
async function sg(e, t) {
  if (Fe.has(e))
    throw new Error(`Server for account ${e} is already running`);
  if (!t.accounts || t.accounts.length === 0)
    throw new Error("No account configured");
  const n = t.port;
  if (n <= 0 || n >= 65536)
    throw new Error(`Port out of range: ${n}`);
  const a = await rg(t);
  return Fe.set(e, a), n;
}
async function ig(e) {
  const t = Fe.get(e);
  if (!t)
    throw new Error(`Server for account ${e} is not running`);
  Fe.delete(e), await cg(t);
}
function da(e) {
  return Fe.has(e);
}
function Is(e) {
  const t = Fe.get(e);
  return t ? t.state.port : null;
}
function ja() {
  const e = {};
  for (const [t, n] of Fe)
    e[t] = n.state.port;
  return e;
}
async function rg(e) {
  const t = {
    config: e,
    accountTokens: /* @__PURE__ */ new Map(),
    accountIndex: 0,
    port: e.port,
    sessionManager: new xh()
  };
  for (const a of e.accounts)
    if (a.token)
      t.accountTokens.set(a.email, a.token);
    else
      try {
        const o = await Em(a);
        t.accountTokens.set(a.email, o), P(
          t.port,
          `[shallowseek-api] ✓ Logged in: ${a.email.slice(0, 3)}***`
        );
      } catch (o) {
        const s = At(o);
        P(
          t.port,
          `[shallowseek-api] ✗ Login failed for ${a.email}: ${s}`
        );
      }
  if (t.accountTokens.size === 0)
    throw new Error("No accounts available (all login attempts failed)");
  const n = Br.createServer(
    (a, o) => ag(a, o, t)
  );
  return await new Promise((a, o) => {
    n.listen(e.port, () => {
      P(
        t.port,
        `[shallowseek-api] OpenAI-compatible API server listening on port ${e.port}`
      ), a();
    }), n.on("error", o);
  }), { server: n, state: t };
}
async function cg(e) {
  return await e.state.sessionManager.cleanup(), new Promise((t) => {
    e.server.close(() => {
      P(
        e.state.port,
        "[shallowseek-api] Server stopped"
      ), t();
    });
  });
}
const sn = /* @__PURE__ */ new Map();
function qs(e, t, n) {
  for (const a of ne.getAllWindows())
    try {
      a.webContents.send(
        "server-account-status-changed",
        e,
        t,
        n
      );
    } catch {
    }
}
function He(e, t) {
  let n = sn.get(e);
  n || (n = [], sn.set(e, n)), n.push(t);
  for (const a of ne.getAllWindows())
    try {
      a.webContents.send("server-account-log", e, t);
    } catch {
    }
}
function Fs() {
  const e = to("endpointPort");
  if (e) {
    const t = parseInt(e, 10);
    if (!isNaN(t) && t > 0 && t < 65536) return t;
  }
  return 11434;
}
function lg() {
  return to("endpointApiKey");
}
function pg(e) {
  const n = Zi().find((a) => a.id === e);
  return n ? {
    id: n.id,
    email: n.email,
    password: "",
    token: n.chat_token
  } : null;
}
function ug(e) {
  const t = new Set(
    Object.values(ja())
  );
  let n = e;
  for (; t.has(n); )
    if (n++, n >= 65536)
      throw new Error("No available ports");
  return n;
}
function dg() {
  og((e) => {
    const t = e.match(/\[(\d+)\]/);
    if (t) {
      const n = parseInt(t[1], 10), a = ja(), o = Object.keys(a).find((s) => a[s] === n);
      if (o) {
        He(o, e);
        return;
      }
    }
    for (const n of ne.getAllWindows())
      try {
        n.webContents.send("server-log", e);
      } catch {
      }
  }), O.handle(
    "server-start-account",
    async (e, t) => {
      const { accountId: n } = t;
      if (da(n))
        return { ok: !1, error: "Server for this account is already running" };
      sn.set(n, []);
      const a = t.port || Fs();
      try {
        const o = pg(n);
        if (!o)
          return { ok: !1, error: "Account not found" };
        const s = ug(a), i = [], r = t.apiKey || lg();
        r && i.push(r);
        const c = {
          port: s,
          apiKeys: i,
          accounts: [o],
          modelAliases: {},
          autoDeleteMode: "single"
        };
        return He(n, `[shallowseek-api] Starting server for ${o.email} on port ${s}...`), await sg(n, c), He(n, `[shallowseek-api] Server started successfully on port ${s}`), He(n, `[shallowseek-api] OpenAI base URL: http://localhost:${s}/v1`), qs(n, !0, s), { ok: !0, port: s };
      } catch (o) {
        const s = o.message || "Unknown error";
        return He(n, `[shallowseek-api] Start failed: ${s}`), { ok: !1, error: s };
      }
    }
  ), O.handle(
    "server-stop-account",
    async (e, t) => {
      const { accountId: n } = t;
      if (!da(n))
        return { ok: !1, error: "Server for this account is not running" };
      try {
        const a = Is(n) || 0;
        return await ig(n), He(n, "[shallowseek-api] Server stopped"), qs(n, !1, a), { ok: !0 };
      } catch (a) {
        return { ok: !1, error: a.message };
      }
    }
  ), O.handle(
    "server-status-account",
    (e, t) => {
      const { accountId: n } = t, a = da(n), o = Is(n) ?? Fs();
      return { isRunning: a, port: o };
    }
  ), O.handle(
    "server-logs-account",
    (e, t) => ({ logs: sn.get(t.accountId) || [] })
  ), O.handle("server-all-running", () => ja());
}
function mg(e, t, n) {
  zr(e, t, n), hm(e, t, n), Sm(), dg();
}
const fg = Dr(import.meta.url), uo = W.dirname(fg);
process.env.APP_ROOT = W.join(uo, "..");
const ut = process.env.VITE_DEV_SERVER_URL, sx = W.join(process.env.APP_ROOT, "dist-electron"), rn = W.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = ut ? W.join(process.env.APP_ROOT, "public") : rn;
let xe;
function Ar() {
  xe = new ne({
    minWidth: 1200,
    minHeight: 800,
    frame: !1,
    titleBarStyle: "hidden",
    icon: W.join(process.env.VITE_PUBLIC, "logo.png"),
    webPreferences: {
      preload: W.join(uo, "preload.mjs")
    },
    autoHideMenuBar: !0
  }), jr.setApplicationMenu(null), xe.on("maximize", () => {
    xe == null || xe.webContents.send("window-state-changed", "maximized");
  }), xe.on("unmaximize", () => {
    xe == null || xe.webContents.send("window-state-changed", "unmaximized");
  }), ut ? (console.log("Loading URL:", ut), xe.loadURL(ut)) : (console.log("Loading file:", W.join(rn, "index.html")), xe.loadFile(W.join(rn, "index.html")));
}
mg(uo, ut, rn);
Xe.on("window-all-closed", () => {
  process.platform !== "darwin" && (Xe.quit(), xe = null);
});
Xe.on("activate", () => {
  ne.getAllWindows().length === 0 && Ar();
});
Xe.whenReady().then(Ar);
export {
  sx as MAIN_DIST,
  rn as RENDERER_DIST,
  ut as VITE_DEV_SERVER_URL
};
