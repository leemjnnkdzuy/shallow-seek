var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { ipcMain, BrowserWindow, shell, session, BrowserView, app, Menu } from "electron";
import path$1 from "node:path";
import { fileURLToPath } from "node:url";
import require$$1 from "util";
import stream$1, { Readable } from "stream";
import require$$1$1, { resolve } from "path";
import * as http$2 from "http";
import http__default from "http";
import https$2, { Agent as Agent$2 } from "https";
import require$$5, { URL as URL$2 } from "url";
import require$$6 from "fs";
import require$$8 from "crypto";
import http2 from "http2";
import require$$4 from "assert";
import require$$1$2 from "tty";
import require$$0$1 from "os";
import zlib from "zlib";
import require$$0$3, { EventEmitter } from "events";
import * as net$1 from "net";
import net__default from "net";
import require$$0$2 from "buffer";
import * as dns from "dns";
import * as tls from "tls";
import fs$1 from "node:fs";
import Database from "better-sqlite3";
import http$3 from "node:http";
import { Readable as Readable$1 } from "node:stream";
import crypto$1 from "node:crypto";
function registerWindowIpcs(__dirname, VITE_DEV_SERVER_URL2, RENDERER_DIST2) {
  ipcMain.on("window-minimize", (event) => {
    const webContents = event.sender;
    const win2 = BrowserWindow.fromWebContents(webContents);
    win2 == null ? void 0 : win2.minimize();
  });
  ipcMain.on("window-maximize", (event) => {
    const webContents = event.sender;
    const win2 = BrowserWindow.fromWebContents(webContents);
    if (win2 == null ? void 0 : win2.isMaximized()) {
      win2.unmaximize();
    } else {
      win2 == null ? void 0 : win2.maximize();
    }
  });
  ipcMain.on("window-close", (event) => {
    const webContents = event.sender;
    const win2 = BrowserWindow.fromWebContents(webContents);
    if (win2) {
      win2.hide();
      win2.close();
    }
  });
  ipcMain.on("window-zoom-in", (event) => {
    const webContents = event.sender;
    const currentZoom = webContents.getZoomLevel();
    webContents.setZoomLevel(currentZoom + 0.5);
  });
  ipcMain.on("window-zoom-out", (event) => {
    const webContents = event.sender;
    const currentZoom = webContents.getZoomLevel();
    webContents.setZoomLevel(currentZoom - 0.5);
  });
  ipcMain.on("window-zoom-reset", (event) => {
    const webContents = event.sender;
    webContents.setZoomLevel(0);
  });
  ipcMain.on("renderer-log", (_event, payload) => {
    console.log("[renderer-log]", payload);
  });
  let confirmResolve = null;
  ipcMain.handle("open-confirm", async (event, options) => {
    const parentWindow = BrowserWindow.fromWebContents(event.sender) || void 0;
    const params = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      params.append(key, String(value));
    });
    const popup = new BrowserWindow({
      width: 500,
      height: 240,
      frame: false,
      resizable: false,
      parent: parentWindow,
      modal: true,
      show: false,
      webPreferences: {
        preload: path$1.join(__dirname, "preload.mjs")
      }
    });
    if (VITE_DEV_SERVER_URL2) {
      popup.loadURL(
        `${VITE_DEV_SERVER_URL2}#/confirm?${params.toString()}`
      );
    } else {
      popup.loadFile(path$1.join(RENDERER_DIST2, "index.html"), {
        hash: `/confirm?${params.toString()}`
      });
    }
    popup.once("ready-to-show", () => {
      popup.show();
    });
    return new Promise((resolve2) => {
      confirmResolve = resolve2;
      popup.on("closed", () => {
        if (confirmResolve) {
          confirmResolve(false);
          confirmResolve = null;
        }
      });
    });
  });
  ipcMain.on("confirm-result", (event, result) => {
    if (confirmResolve) {
      confirmResolve(result);
      confirmResolve = null;
    }
    const win2 = BrowserWindow.fromWebContents(event.sender);
    win2 == null ? void 0 : win2.close();
  });
  ipcMain.on("open-settings", (event) => {
    const parentWindow = BrowserWindow.fromWebContents(event.sender) || void 0;
    const settingsWin = new BrowserWindow({
      width: 900,
      height: 600,
      frame: false,
      parent: parentWindow,
      modal: true,
      webPreferences: {
        preload: path$1.join(__dirname, "preload.mjs")
      }
    });
    if (VITE_DEV_SERVER_URL2) {
      settingsWin.loadURL(`${VITE_DEV_SERVER_URL2}#/settings/interface`);
    } else {
      settingsWin.loadFile(path$1.join(RENDERER_DIST2, "index.html"), {
        hash: "/settings/interface"
      });
    }
  });
  ipcMain.on("theme-changed", (_event, theme) => {
    BrowserWindow.getAllWindows().forEach((win2) => {
      win2.webContents.send("on-theme-changed", theme);
    });
  });
  ipcMain.on("language-changed", (_event, lang) => {
    BrowserWindow.getAllWindows().forEach((win2) => {
      win2.webContents.send("on-language-changed", lang);
    });
  });
  ipcMain.on("open-external", (_event, url2) => {
    shell.openExternal(url2);
  });
}
function bind$2(fn, thisArg) {
  return function wrap2() {
    return fn.apply(thisArg, arguments);
  };
}
const { toString } = Object.prototype;
const { getPrototypeOf } = Object;
const { iterator, toStringTag: toStringTag$1 } = Symbol;
const kindOf = /* @__PURE__ */ ((cache) => (thing) => {
  const str = toString.call(thing);
  return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null));
const kindOfTest = (type2) => {
  type2 = type2.toLowerCase();
  return (thing) => kindOf(thing) === type2;
};
const typeOfTest = (type2) => (thing) => typeof thing === type2;
const { isArray: isArray$1 } = Array;
const isUndefined = typeOfTest("undefined");
function isBuffer$1(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction$2(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}
const isArrayBuffer = kindOfTest("ArrayBuffer");
function isArrayBufferView(val) {
  let result;
  if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && isArrayBuffer(val.buffer);
  }
  return result;
}
const isString$1 = typeOfTest("string");
const isFunction$2 = typeOfTest("function");
const isNumber = typeOfTest("number");
const isObject = (thing) => thing !== null && typeof thing === "object";
const isBoolean = (thing) => thing === true || thing === false;
const isPlainObject = (val) => {
  if (kindOf(val) !== "object") {
    return false;
  }
  const prototype2 = getPrototypeOf(val);
  return (prototype2 === null || prototype2 === Object.prototype || Object.getPrototypeOf(prototype2) === null) && !(toStringTag$1 in val) && !(iterator in val);
};
const isEmptyObject = (val) => {
  if (!isObject(val) || isBuffer$1(val)) {
    return false;
  }
  try {
    return Object.keys(val).length === 0 && Object.getPrototypeOf(val) === Object.prototype;
  } catch (e) {
    return false;
  }
};
const isDate = kindOfTest("Date");
const isFile = kindOfTest("File");
const isReactNativeBlob = (value) => {
  return !!(value && typeof value.uri !== "undefined");
};
const isReactNative = (formData) => formData && typeof formData.getParts !== "undefined";
const isBlob = kindOfTest("Blob");
const isFileList = kindOfTest("FileList");
const isStream = (val) => isObject(val) && isFunction$2(val.pipe);
function getGlobal() {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof window !== "undefined") return window;
  if (typeof global !== "undefined") return global;
  return {};
}
const G = getGlobal();
const FormDataCtor = typeof G.FormData !== "undefined" ? G.FormData : void 0;
const isFormData = (thing) => {
  if (!thing) return false;
  if (FormDataCtor && thing instanceof FormDataCtor) return true;
  const proto = getPrototypeOf(thing);
  if (!proto || proto === Object.prototype) return false;
  if (!isFunction$2(thing.append)) return false;
  const kind = kindOf(thing);
  return kind === "formdata" || // detect form-data instance
  kind === "object" && isFunction$2(thing.toString) && thing.toString() === "[object FormData]";
};
const isURLSearchParams = kindOfTest("URLSearchParams");
const [isReadableStream, isRequest, isResponse, isHeaders] = [
  "ReadableStream",
  "Request",
  "Response",
  "Headers"
].map(kindOfTest);
const trim = (str) => {
  return str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
};
function forEach(obj, fn, { allOwnKeys = false } = {}) {
  if (obj === null || typeof obj === "undefined") {
    return;
  }
  let i;
  let l;
  if (typeof obj !== "object") {
    obj = [obj];
  }
  if (isArray$1(obj)) {
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    if (isBuffer$1(obj)) {
      return;
    }
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}
function findKey(obj, key) {
  if (isBuffer$1(obj)) {
    return null;
  }
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}
const _global = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
})();
const isContextDefined = (context) => !isUndefined(context) && context !== _global;
function merge(...objs) {
  const { caseless, skipUndefined } = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      return;
    }
    const targetKey = caseless && findKey(result, key) || key;
    const existing = hasOwnProperty(result, targetKey) ? result[targetKey] : void 0;
    if (isPlainObject(existing) && isPlainObject(val)) {
      result[targetKey] = merge(existing, val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray$1(val)) {
      result[targetKey] = val.slice();
    } else if (!skipUndefined || !isUndefined(val)) {
      result[targetKey] = val;
    }
  };
  for (let i = 0, l = objs.length; i < l; i++) {
    objs[i] && forEach(objs[i], assignValue);
  }
  return result;
}
const extend = (a, b, thisArg, { allOwnKeys } = {}) => {
  forEach(
    b,
    (val, key) => {
      if (thisArg && isFunction$2(val)) {
        Object.defineProperty(a, key, {
          // Null-proto descriptor so a polluted Object.prototype.get cannot
          // hijack defineProperty's accessor-vs-data resolution.
          __proto__: null,
          value: bind$2(val, thisArg),
          writable: true,
          enumerable: true,
          configurable: true
        });
      } else {
        Object.defineProperty(a, key, {
          __proto__: null,
          value: val,
          writable: true,
          enumerable: true,
          configurable: true
        });
      }
    },
    { allOwnKeys }
  );
  return a;
};
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 65279) {
    content = content.slice(1);
  }
  return content;
};
const inherits = (constructor, superConstructor, props, descriptors) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  Object.defineProperty(constructor.prototype, "constructor", {
    __proto__: null,
    value: constructor,
    writable: true,
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(constructor, "super", {
    __proto__: null,
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
};
const toFlatObject = (sourceObj, destObj, filter2, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};
  destObj = destObj || {};
  if (sourceObj == null) return destObj;
  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter2 !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter2 || filter2(sourceObj, destObj)) && sourceObj !== Object.prototype);
  return destObj;
};
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === void 0 || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};
const toArray = (thing) => {
  if (!thing) return null;
  if (isArray$1(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
};
const isTypedArray = /* @__PURE__ */ ((TypedArray2) => {
  return (thing) => {
    return TypedArray2 && thing instanceof TypedArray2;
  };
})(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[iterator];
  const _iterator = generator.call(obj);
  let result;
  while ((result = _iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];
  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }
  return arr;
};
const isHTMLForm = kindOfTest("HTMLFormElement");
const toCamelCase = (str) => {
  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function replacer(m, p1, p2) {
    return p1.toUpperCase() + p2;
  });
};
const hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
const isRegExp = kindOfTest("RegExp");
const reduceDescriptors = (obj, reducer) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};
  forEach(descriptors, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });
  Object.defineProperties(obj, reducedDescriptors);
};
const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    if (isFunction$2(obj) && ["arguments", "caller", "callee"].includes(name)) {
      return false;
    }
    const value = obj[name];
    if (!isFunction$2(value)) return;
    descriptor.enumerable = false;
    if ("writable" in descriptor) {
      descriptor.writable = false;
      return;
    }
    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error("Can not rewrite read-only method '" + name + "'");
      };
    }
  });
};
const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};
  const define = (arr) => {
    arr.forEach((value) => {
      obj[value] = true;
    });
  };
  isArray$1(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
  return obj;
};
const noop$1 = () => {
};
const toFiniteNumber = (value, defaultValue) => {
  return value != null && Number.isFinite(value = +value) ? value : defaultValue;
};
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction$2(thing.append) && thing[toStringTag$1] === "FormData" && thing[iterator]);
}
const toJSONObject = (obj) => {
  const stack = new Array(10);
  const visit = (source, i) => {
    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }
      if (isBuffer$1(source)) {
        return source;
      }
      if (!("toJSON" in source)) {
        stack[i] = source;
        const target = isArray$1(source) ? [] : {};
        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });
        stack[i] = void 0;
        return target;
      }
    }
    return source;
  };
  return visit(obj, 0);
};
const isAsyncFn = kindOfTest("AsyncFunction");
const isThenable = (thing) => thing && (isObject(thing) || isFunction$2(thing)) && isFunction$2(thing.then) && isFunction$2(thing.catch);
const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
  if (setImmediateSupported) {
    return setImmediate;
  }
  return postMessageSupported ? ((token, callbacks) => {
    _global.addEventListener(
      "message",
      ({ source, data }) => {
        if (source === _global && data === token) {
          callbacks.length && callbacks.shift()();
        }
      },
      false
    );
    return (cb) => {
      callbacks.push(cb);
      _global.postMessage(token, "*");
    };
  })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
})(typeof setImmediate === "function", isFunction$2(_global.postMessage));
const asap = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(_global) : typeof process !== "undefined" && process.nextTick || _setImmediate;
const isIterable = (thing) => thing != null && isFunction$2(thing[iterator]);
const utils$2 = {
  isArray: isArray$1,
  isArrayBuffer,
  isBuffer: isBuffer$1,
  isFormData,
  isArrayBufferView,
  isString: isString$1,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isEmptyObject,
  isReadableStream,
  isRequest,
  isResponse,
  isHeaders,
  isUndefined,
  isDate,
  isFile,
  isReactNativeBlob,
  isReactNative,
  isBlob,
  isRegExp,
  isFunction: isFunction$2,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop: noop$1,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable,
  setImmediate: _setImmediate,
  asap,
  isIterable
};
const ignoreDuplicateOf = utils$2.toObjectSet([
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
]);
const parseHeaders = (rawHeaders) => {
  const parsed = {};
  let key;
  let val;
  let i;
  rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
    i = line.indexOf(":");
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();
    if (!key || parsed[key] && ignoreDuplicateOf[key]) {
      return;
    }
    if (key === "set-cookie") {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
    }
  });
  return parsed;
};
const $internals = Symbol("internals");
const INVALID_HEADER_VALUE_CHARS_RE = /[^\x09\x20-\x7E\x80-\xFF]/g;
function trimSPorHTAB(str) {
  let start = 0;
  let end = str.length;
  while (start < end) {
    const code = str.charCodeAt(start);
    if (code !== 9 && code !== 32) {
      break;
    }
    start += 1;
  }
  while (end > start) {
    const code = str.charCodeAt(end - 1);
    if (code !== 9 && code !== 32) {
      break;
    }
    end -= 1;
  }
  return start === 0 && end === str.length ? str : str.slice(start, end);
}
function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}
function sanitizeHeaderValue(str) {
  return trimSPorHTAB(str.replace(INVALID_HEADER_VALUE_CHARS_RE, ""));
}
function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }
  return utils$2.isArray(value) ? value.map(normalizeValue) : sanitizeHeaderValue(String(value));
}
function parseTokens(str) {
  const tokens = /* @__PURE__ */ Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;
  while (match = tokensRE.exec(str)) {
    tokens[match[1]] = match[2];
  }
  return tokens;
}
const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
function matchHeaderValue(context, value, header, filter2, isHeaderNameFilter) {
  if (utils$2.isFunction(filter2)) {
    return filter2.call(this, value, header);
  }
  if (isHeaderNameFilter) {
    value = header;
  }
  if (!utils$2.isString(value)) return;
  if (utils$2.isString(filter2)) {
    return value.indexOf(filter2) !== -1;
  }
  if (utils$2.isRegExp(filter2)) {
    return filter2.test(value);
  }
}
function formatHeader(header) {
  return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
    return char.toUpperCase() + str;
  });
}
function buildAccessors(obj, header) {
  const accessorName = utils$2.toCamelCase(" " + header);
  ["get", "set", "has"].forEach((methodName) => {
    Object.defineProperty(obj, methodName + accessorName, {
      // Null-proto descriptor so a polluted Object.prototype.get cannot turn
      // this data descriptor into an accessor descriptor on the way in.
      __proto__: null,
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}
let AxiosHeaders$1 = class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }
  set(header, valueOrRewrite, rewrite) {
    const self2 = this;
    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);
      if (!lHeader) {
        throw new Error("header name must be a non-empty string");
      }
      const key = utils$2.findKey(self2, lHeader);
      if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
        self2[key || _header] = normalizeValue(_value);
      }
    }
    const setHeaders = (headers, _rewrite) => utils$2.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
    if (utils$2.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite);
    } else if (utils$2.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders(header), valueOrRewrite);
    } else if (utils$2.isObject(header) && utils$2.isIterable(header)) {
      let obj = {}, dest, key;
      for (const entry of header) {
        if (!utils$2.isArray(entry)) {
          throw TypeError("Object iterator must return a key-value pair");
        }
        obj[key = entry[0]] = (dest = obj[key]) ? utils$2.isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]] : entry[1];
      }
      setHeaders(obj, valueOrRewrite);
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }
    return this;
  }
  get(header, parser) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils$2.findKey(this, header);
      if (key) {
        const value = this[key];
        if (!parser) {
          return value;
        }
        if (parser === true) {
          return parseTokens(value);
        }
        if (utils$2.isFunction(parser)) {
          return parser.call(this, value, key);
        }
        if (utils$2.isRegExp(parser)) {
          return parser.exec(value);
        }
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(header, matcher) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils$2.findKey(this, header);
      return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }
    return false;
  }
  delete(header, matcher) {
    const self2 = this;
    let deleted = false;
    function deleteHeader(_header) {
      _header = normalizeHeader(_header);
      if (_header) {
        const key = utils$2.findKey(self2, _header);
        if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
          delete self2[key];
          deleted = true;
        }
      }
    }
    if (utils$2.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }
    return deleted;
  }
  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;
    while (i--) {
      const key = keys[i];
      if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }
    return deleted;
  }
  normalize(format) {
    const self2 = this;
    const headers = {};
    utils$2.forEach(this, (value, header) => {
      const key = utils$2.findKey(headers, header);
      if (key) {
        self2[key] = normalizeValue(value);
        delete self2[header];
        return;
      }
      const normalized = format ? formatHeader(header) : String(header).trim();
      if (normalized !== header) {
        delete self2[header];
      }
      self2[normalized] = normalizeValue(value);
      headers[normalized] = true;
    });
    return this;
  }
  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }
  toJSON(asStrings) {
    const obj = /* @__PURE__ */ Object.create(null);
    utils$2.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils$2.isArray(value) ? value.join(", ") : value);
    });
    return obj;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
  }
  getSetCookie() {
    return this.get("set-cookie") || [];
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }
  static concat(first, ...targets) {
    const computed = new this(first);
    targets.forEach((target) => computed.set(target));
    return computed;
  }
  static accessor(header) {
    const internals = this[$internals] = this[$internals] = {
      accessors: {}
    };
    const accessors = internals.accessors;
    const prototype2 = this.prototype;
    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);
      if (!accessors[lHeader]) {
        buildAccessors(prototype2, _header);
        accessors[lHeader] = true;
      }
    }
    utils$2.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
    return this;
  }
};
AxiosHeaders$1.accessor([
  "Content-Type",
  "Content-Length",
  "Accept",
  "Accept-Encoding",
  "User-Agent",
  "Authorization"
]);
utils$2.reduceDescriptors(AxiosHeaders$1.prototype, ({ value }, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1);
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  };
});
utils$2.freezeMethods(AxiosHeaders$1);
const REDACTED = "[REDACTED ****]";
function hasOwnOrPrototypeToJSON(source) {
  if (utils$2.hasOwnProp(source, "toJSON")) {
    return true;
  }
  let prototype2 = Object.getPrototypeOf(source);
  while (prototype2 && prototype2 !== Object.prototype) {
    if (utils$2.hasOwnProp(prototype2, "toJSON")) {
      return true;
    }
    prototype2 = Object.getPrototypeOf(prototype2);
  }
  return false;
}
function redactConfig(config, redactKeys) {
  const lowerKeys = new Set(redactKeys.map((k) => String(k).toLowerCase()));
  const seen = [];
  const visit = (source) => {
    if (source === null || typeof source !== "object") return source;
    if (utils$2.isBuffer(source)) return source;
    if (seen.indexOf(source) !== -1) return void 0;
    if (source instanceof AxiosHeaders$1) {
      source = source.toJSON();
    }
    seen.push(source);
    let result;
    if (utils$2.isArray(source)) {
      result = [];
      source.forEach((v, i) => {
        const reducedValue = visit(v);
        if (!utils$2.isUndefined(reducedValue)) {
          result[i] = reducedValue;
        }
      });
    } else {
      if (!utils$2.isPlainObject(source) && hasOwnOrPrototypeToJSON(source)) {
        seen.pop();
        return source;
      }
      result = /* @__PURE__ */ Object.create(null);
      for (const [key, value] of Object.entries(source)) {
        const reducedValue = lowerKeys.has(key.toLowerCase()) ? REDACTED : visit(value);
        if (!utils$2.isUndefined(reducedValue)) {
          result[key] = reducedValue;
        }
      }
    }
    seen.pop();
    return result;
  };
  return visit(config);
}
let AxiosError$1 = class AxiosError extends Error {
  static from(error, code, config, request, response, customProps) {
    const axiosError = new AxiosError(error.message, code || error.code, config, request, response);
    axiosError.cause = error;
    axiosError.name = error.name;
    if (error.status != null && axiosError.status == null) {
      axiosError.status = error.status;
    }
    customProps && Object.assign(axiosError, customProps);
    return axiosError;
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
  constructor(message, code, config, request, response) {
    super(message);
    Object.defineProperty(this, "message", {
      // Null-proto descriptor so a polluted Object.prototype.get cannot turn
      // this data descriptor into an accessor descriptor on the way in.
      __proto__: null,
      value: message,
      enumerable: true,
      writable: true,
      configurable: true
    });
    this.name = "AxiosError";
    this.isAxiosError = true;
    code && (this.code = code);
    config && (this.config = config);
    request && (this.request = request);
    if (response) {
      this.response = response;
      this.status = response.status;
    }
  }
  toJSON() {
    const config = this.config;
    const redactKeys = config && utils$2.hasOwnProp(config, "redact") ? config.redact : void 0;
    const serializedConfig = utils$2.isArray(redactKeys) && redactKeys.length > 0 ? redactConfig(config, redactKeys) : utils$2.toJSONObject(config);
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
      config: serializedConfig,
      code: this.code,
      status: this.status
    };
  }
};
AxiosError$1.ERR_BAD_OPTION_VALUE = "ERR_BAD_OPTION_VALUE";
AxiosError$1.ERR_BAD_OPTION = "ERR_BAD_OPTION";
AxiosError$1.ECONNABORTED = "ECONNABORTED";
AxiosError$1.ETIMEDOUT = "ETIMEDOUT";
AxiosError$1.ECONNREFUSED = "ECONNREFUSED";
AxiosError$1.ERR_NETWORK = "ERR_NETWORK";
AxiosError$1.ERR_FR_TOO_MANY_REDIRECTS = "ERR_FR_TOO_MANY_REDIRECTS";
AxiosError$1.ERR_DEPRECATED = "ERR_DEPRECATED";
AxiosError$1.ERR_BAD_RESPONSE = "ERR_BAD_RESPONSE";
AxiosError$1.ERR_BAD_REQUEST = "ERR_BAD_REQUEST";
AxiosError$1.ERR_CANCELED = "ERR_CANCELED";
AxiosError$1.ERR_NOT_SUPPORT = "ERR_NOT_SUPPORT";
AxiosError$1.ERR_INVALID_URL = "ERR_INVALID_URL";
AxiosError$1.ERR_FORM_DATA_DEPTH_EXCEEDED = "ERR_FORM_DATA_DEPTH_EXCEEDED";
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var Stream$2 = stream$1.Stream;
var util$3 = require$$1;
var delayed_stream = DelayedStream$1;
function DelayedStream$1() {
  this.source = null;
  this.dataSize = 0;
  this.maxDataSize = 1024 * 1024;
  this.pauseStream = true;
  this._maxDataSizeExceeded = false;
  this._released = false;
  this._bufferedEvents = [];
}
util$3.inherits(DelayedStream$1, Stream$2);
DelayedStream$1.create = function(source, options) {
  var delayedStream = new this();
  options = options || {};
  for (var option in options) {
    delayedStream[option] = options[option];
  }
  delayedStream.source = source;
  var realEmit = source.emit;
  source.emit = function() {
    delayedStream._handleEmit(arguments);
    return realEmit.apply(source, arguments);
  };
  source.on("error", function() {
  });
  if (delayedStream.pauseStream) {
    source.pause();
  }
  return delayedStream;
};
Object.defineProperty(DelayedStream$1.prototype, "readable", {
  configurable: true,
  enumerable: true,
  get: function() {
    return this.source.readable;
  }
});
DelayedStream$1.prototype.setEncoding = function() {
  return this.source.setEncoding.apply(this.source, arguments);
};
DelayedStream$1.prototype.resume = function() {
  if (!this._released) {
    this.release();
  }
  this.source.resume();
};
DelayedStream$1.prototype.pause = function() {
  this.source.pause();
};
DelayedStream$1.prototype.release = function() {
  this._released = true;
  this._bufferedEvents.forEach((function(args) {
    this.emit.apply(this, args);
  }).bind(this));
  this._bufferedEvents = [];
};
DelayedStream$1.prototype.pipe = function() {
  var r = Stream$2.prototype.pipe.apply(this, arguments);
  this.resume();
  return r;
};
DelayedStream$1.prototype._handleEmit = function(args) {
  if (this._released) {
    this.emit.apply(this, args);
    return;
  }
  if (args[0] === "data") {
    this.dataSize += args[1].length;
    this._checkIfMaxDataSizeExceeded();
  }
  this._bufferedEvents.push(args);
};
DelayedStream$1.prototype._checkIfMaxDataSizeExceeded = function() {
  if (this._maxDataSizeExceeded) {
    return;
  }
  if (this.dataSize <= this.maxDataSize) {
    return;
  }
  this._maxDataSizeExceeded = true;
  var message = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
  this.emit("error", new Error(message));
};
var util$2 = require$$1;
var Stream$1 = stream$1.Stream;
var DelayedStream = delayed_stream;
var combined_stream = CombinedStream$1;
function CombinedStream$1() {
  this.writable = false;
  this.readable = true;
  this.dataSize = 0;
  this.maxDataSize = 2 * 1024 * 1024;
  this.pauseStreams = true;
  this._released = false;
  this._streams = [];
  this._currentStream = null;
  this._insideLoop = false;
  this._pendingNext = false;
}
util$2.inherits(CombinedStream$1, Stream$1);
CombinedStream$1.create = function(options) {
  var combinedStream = new this();
  options = options || {};
  for (var option in options) {
    combinedStream[option] = options[option];
  }
  return combinedStream;
};
CombinedStream$1.isStreamLike = function(stream2) {
  return typeof stream2 !== "function" && typeof stream2 !== "string" && typeof stream2 !== "boolean" && typeof stream2 !== "number" && !Buffer.isBuffer(stream2);
};
CombinedStream$1.prototype.append = function(stream2) {
  var isStreamLike = CombinedStream$1.isStreamLike(stream2);
  if (isStreamLike) {
    if (!(stream2 instanceof DelayedStream)) {
      var newStream = DelayedStream.create(stream2, {
        maxDataSize: Infinity,
        pauseStream: this.pauseStreams
      });
      stream2.on("data", this._checkDataSize.bind(this));
      stream2 = newStream;
    }
    this._handleErrors(stream2);
    if (this.pauseStreams) {
      stream2.pause();
    }
  }
  this._streams.push(stream2);
  return this;
};
CombinedStream$1.prototype.pipe = function(dest, options) {
  Stream$1.prototype.pipe.call(this, dest, options);
  this.resume();
  return dest;
};
CombinedStream$1.prototype._getNext = function() {
  this._currentStream = null;
  if (this._insideLoop) {
    this._pendingNext = true;
    return;
  }
  this._insideLoop = true;
  try {
    do {
      this._pendingNext = false;
      this._realGetNext();
    } while (this._pendingNext);
  } finally {
    this._insideLoop = false;
  }
};
CombinedStream$1.prototype._realGetNext = function() {
  var stream2 = this._streams.shift();
  if (typeof stream2 == "undefined") {
    this.end();
    return;
  }
  if (typeof stream2 !== "function") {
    this._pipeNext(stream2);
    return;
  }
  var getStream = stream2;
  getStream((function(stream3) {
    var isStreamLike = CombinedStream$1.isStreamLike(stream3);
    if (isStreamLike) {
      stream3.on("data", this._checkDataSize.bind(this));
      this._handleErrors(stream3);
    }
    this._pipeNext(stream3);
  }).bind(this));
};
CombinedStream$1.prototype._pipeNext = function(stream2) {
  this._currentStream = stream2;
  var isStreamLike = CombinedStream$1.isStreamLike(stream2);
  if (isStreamLike) {
    stream2.on("end", this._getNext.bind(this));
    stream2.pipe(this, { end: false });
    return;
  }
  var value = stream2;
  this.write(value);
  this._getNext();
};
CombinedStream$1.prototype._handleErrors = function(stream2) {
  var self2 = this;
  stream2.on("error", function(err) {
    self2._emitError(err);
  });
};
CombinedStream$1.prototype.write = function(data) {
  this.emit("data", data);
};
CombinedStream$1.prototype.pause = function() {
  if (!this.pauseStreams) {
    return;
  }
  if (this.pauseStreams && this._currentStream && typeof this._currentStream.pause == "function") this._currentStream.pause();
  this.emit("pause");
};
CombinedStream$1.prototype.resume = function() {
  if (!this._released) {
    this._released = true;
    this.writable = true;
    this._getNext();
  }
  if (this.pauseStreams && this._currentStream && typeof this._currentStream.resume == "function") this._currentStream.resume();
  this.emit("resume");
};
CombinedStream$1.prototype.end = function() {
  this._reset();
  this.emit("end");
};
CombinedStream$1.prototype.destroy = function() {
  this._reset();
  this.emit("close");
};
CombinedStream$1.prototype._reset = function() {
  this.writable = false;
  this._streams = [];
  this._currentStream = null;
};
CombinedStream$1.prototype._checkDataSize = function() {
  this._updateDataSize();
  if (this.dataSize <= this.maxDataSize) {
    return;
  }
  var message = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
  this._emitError(new Error(message));
};
CombinedStream$1.prototype._updateDataSize = function() {
  this.dataSize = 0;
  var self2 = this;
  this._streams.forEach(function(stream2) {
    if (!stream2.dataSize) {
      return;
    }
    self2.dataSize += stream2.dataSize;
  });
  if (this._currentStream && this._currentStream.dataSize) {
    this.dataSize += this._currentStream.dataSize;
  }
};
CombinedStream$1.prototype._emitError = function(err) {
  this._reset();
  this.emit("error", err);
};
var mimeTypes = {};
const require$$0 = {
  "application/1d-interleaved-parityfec": {
    source: "iana"
  },
  "application/3gpdash-qoe-report+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/3gpp-ims+xml": {
    source: "iana",
    compressible: true
  },
  "application/3gpphal+json": {
    source: "iana",
    compressible: true
  },
  "application/3gpphalforms+json": {
    source: "iana",
    compressible: true
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
    compressible: true
  },
  "application/alto-costmap+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-costmapfilter+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-directory+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-endpointcost+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-endpointcostparams+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-endpointprop+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-endpointpropparams+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-error+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-networkmap+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-networkmapfilter+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-updatestreamcontrol+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-updatestreamparams+json": {
    source: "iana",
    compressible: true
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
    compressible: true,
    extensions: [
      "atom"
    ]
  },
  "application/atomcat+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "atomcat"
    ]
  },
  "application/atomdeleted+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "atomdeleted"
    ]
  },
  "application/atomicmail": {
    source: "iana"
  },
  "application/atomsvc+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "atomsvc"
    ]
  },
  "application/atsc-dwd+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "dwd"
    ]
  },
  "application/atsc-dynamic-event-message": {
    source: "iana"
  },
  "application/atsc-held+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "held"
    ]
  },
  "application/atsc-rdt+json": {
    source: "iana",
    compressible: true
  },
  "application/atsc-rsat+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "rsat"
    ]
  },
  "application/atxml": {
    source: "iana"
  },
  "application/auth-policy+xml": {
    source: "iana",
    compressible: true
  },
  "application/bacnet-xdd+zip": {
    source: "iana",
    compressible: false
  },
  "application/batch-smtp": {
    source: "iana"
  },
  "application/bdoc": {
    compressible: false,
    extensions: [
      "bdoc"
    ]
  },
  "application/beep+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/calendar+json": {
    source: "iana",
    compressible: true
  },
  "application/calendar+xml": {
    source: "iana",
    compressible: true,
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
    compressible: true
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
    compressible: true
  },
  "application/ccxml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "ccxml"
    ]
  },
  "application/cdfx+xml": {
    source: "iana",
    compressible: true,
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
    compressible: true
  },
  "application/cellml+xml": {
    source: "iana",
    compressible: true
  },
  "application/cfw": {
    source: "iana"
  },
  "application/city+json": {
    source: "iana",
    compressible: true
  },
  "application/clr": {
    source: "iana"
  },
  "application/clue+xml": {
    source: "iana",
    compressible: true
  },
  "application/clue_info+xml": {
    source: "iana",
    compressible: true
  },
  "application/cms": {
    source: "iana"
  },
  "application/cnrp+xml": {
    source: "iana",
    compressible: true
  },
  "application/coap-group+json": {
    source: "iana",
    compressible: true
  },
  "application/coap-payload": {
    source: "iana"
  },
  "application/commonground": {
    source: "iana"
  },
  "application/conference-info+xml": {
    source: "iana",
    compressible: true
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
    compressible: true,
    extensions: [
      "cpl"
    ]
  },
  "application/csrattrs": {
    source: "iana"
  },
  "application/csta+xml": {
    source: "iana",
    compressible: true
  },
  "application/cstadata+xml": {
    source: "iana",
    compressible: true
  },
  "application/csvm+json": {
    source: "iana",
    compressible: true
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
    compressible: true
  },
  "application/dash+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "mpd"
    ]
  },
  "application/dash-patch+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "mpp"
    ]
  },
  "application/dashdelta": {
    source: "iana"
  },
  "application/davmount+xml": {
    source: "iana",
    compressible: true,
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
    compressible: true
  },
  "application/dicom": {
    source: "iana"
  },
  "application/dicom+json": {
    source: "iana",
    compressible: true
  },
  "application/dicom+xml": {
    source: "iana",
    compressible: true
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
    compressible: true
  },
  "application/dns-message": {
    source: "iana"
  },
  "application/docbook+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "dbk"
    ]
  },
  "application/dots+cbor": {
    source: "iana"
  },
  "application/dskpp+xml": {
    source: "iana",
    compressible: true
  },
  "application/dssc+der": {
    source: "iana",
    extensions: [
      "dssc"
    ]
  },
  "application/dssc+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xdssc"
    ]
  },
  "application/dvcs": {
    source: "iana"
  },
  "application/ecmascript": {
    source: "iana",
    compressible: true,
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
    compressible: false
  },
  "application/edifact": {
    source: "iana",
    compressible: false
  },
  "application/efi": {
    source: "iana"
  },
  "application/elm+json": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/elm+xml": {
    source: "iana",
    compressible: true
  },
  "application/emergencycalldata.cap+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/emergencycalldata.comment+xml": {
    source: "iana",
    compressible: true
  },
  "application/emergencycalldata.control+xml": {
    source: "iana",
    compressible: true
  },
  "application/emergencycalldata.deviceinfo+xml": {
    source: "iana",
    compressible: true
  },
  "application/emergencycalldata.ecall.msd": {
    source: "iana"
  },
  "application/emergencycalldata.providerinfo+xml": {
    source: "iana",
    compressible: true
  },
  "application/emergencycalldata.serviceinfo+xml": {
    source: "iana",
    compressible: true
  },
  "application/emergencycalldata.subscriberinfo+xml": {
    source: "iana",
    compressible: true
  },
  "application/emergencycalldata.veds+xml": {
    source: "iana",
    compressible: true
  },
  "application/emma+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "emma"
    ]
  },
  "application/emotionml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "emotionml"
    ]
  },
  "application/encaprtp": {
    source: "iana"
  },
  "application/epp+xml": {
    source: "iana",
    compressible: true
  },
  "application/epub+zip": {
    source: "iana",
    compressible: false,
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
    compressible: true
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
    compressible: true,
    extensions: [
      "fdt"
    ]
  },
  "application/fhir+json": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/fhir+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/fido.trusted-apps+json": {
    compressible: true
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
    compressible: false
  },
  "application/framework-attributes+xml": {
    source: "iana",
    compressible: true
  },
  "application/geo+json": {
    source: "iana",
    compressible: true,
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
    compressible: true
  },
  "application/gltf-buffer": {
    source: "iana"
  },
  "application/gml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "gml"
    ]
  },
  "application/gpx+xml": {
    source: "apache",
    compressible: true,
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
    compressible: false,
    extensions: [
      "gz"
    ]
  },
  "application/h224": {
    source: "iana"
  },
  "application/held+xml": {
    source: "iana",
    compressible: true
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
    compressible: true
  },
  "application/ibe-pkg-reply+xml": {
    source: "iana",
    compressible: true
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
    compressible: true
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
    compressible: true,
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
    compressible: true,
    extensions: [
      "its"
    ]
  },
  "application/java-archive": {
    source: "apache",
    compressible: false,
    extensions: [
      "jar",
      "war",
      "ear"
    ]
  },
  "application/java-serialized-object": {
    source: "apache",
    compressible: false,
    extensions: [
      "ser"
    ]
  },
  "application/java-vm": {
    source: "apache",
    compressible: false,
    extensions: [
      "class"
    ]
  },
  "application/javascript": {
    source: "iana",
    charset: "UTF-8",
    compressible: true,
    extensions: [
      "js",
      "mjs"
    ]
  },
  "application/jf2feed+json": {
    source: "iana",
    compressible: true
  },
  "application/jose": {
    source: "iana"
  },
  "application/jose+json": {
    source: "iana",
    compressible: true
  },
  "application/jrd+json": {
    source: "iana",
    compressible: true
  },
  "application/jscalendar+json": {
    source: "iana",
    compressible: true
  },
  "application/json": {
    source: "iana",
    charset: "UTF-8",
    compressible: true,
    extensions: [
      "json",
      "map"
    ]
  },
  "application/json-patch+json": {
    source: "iana",
    compressible: true
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
    compressible: true,
    extensions: [
      "jsonml"
    ]
  },
  "application/jwk+json": {
    source: "iana",
    compressible: true
  },
  "application/jwk-set+json": {
    source: "iana",
    compressible: true
  },
  "application/jwt": {
    source: "iana"
  },
  "application/kpml-request+xml": {
    source: "iana",
    compressible: true
  },
  "application/kpml-response+xml": {
    source: "iana",
    compressible: true
  },
  "application/ld+json": {
    source: "iana",
    compressible: true,
    extensions: [
      "jsonld"
    ]
  },
  "application/lgr+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "lgr"
    ]
  },
  "application/link-format": {
    source: "iana"
  },
  "application/load-control+xml": {
    source: "iana",
    compressible: true
  },
  "application/lost+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "lostxml"
    ]
  },
  "application/lostsync+xml": {
    source: "iana",
    compressible: true
  },
  "application/lpf+zip": {
    source: "iana",
    compressible: false
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
    compressible: true,
    extensions: [
      "mads"
    ]
  },
  "application/manifest+json": {
    source: "iana",
    charset: "UTF-8",
    compressible: true,
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
    compressible: true,
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
    compressible: true,
    extensions: [
      "mathml"
    ]
  },
  "application/mathml-content+xml": {
    source: "iana",
    compressible: true
  },
  "application/mathml-presentation+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-associated-procedure-description+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-deregister+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-envelope+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-msk+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-msk-response+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-protection-description+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-reception-report+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-register+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-register-response+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-schedule+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-user-service-description+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbox": {
    source: "iana",
    extensions: [
      "mbox"
    ]
  },
  "application/media-policy-dataset+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "mpf"
    ]
  },
  "application/media_control+xml": {
    source: "iana",
    compressible: true
  },
  "application/mediaservercontrol+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "mscml"
    ]
  },
  "application/merge-patch+json": {
    source: "iana",
    compressible: true
  },
  "application/metalink+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "metalink"
    ]
  },
  "application/metalink4+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "meta4"
    ]
  },
  "application/mets+xml": {
    source: "iana",
    compressible: true,
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
    compressible: true,
    extensions: [
      "maei"
    ]
  },
  "application/mmt-usd+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "musd"
    ]
  },
  "application/mods+xml": {
    source: "iana",
    compressible: true,
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
    compressible: true
  },
  "application/mrb-publish+xml": {
    source: "iana",
    compressible: true
  },
  "application/msc-ivr+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/msc-mixer+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/msword": {
    source: "iana",
    compressible: false,
    extensions: [
      "doc",
      "dot"
    ]
  },
  "application/mud+json": {
    source: "iana",
    compressible: true
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
    compressible: true
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
    compressible: false,
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
    compressible: true
  },
  "application/odx": {
    source: "iana"
  },
  "application/oebps-package+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "opf"
    ]
  },
  "application/ogg": {
    source: "iana",
    compressible: false,
    extensions: [
      "ogx"
    ]
  },
  "application/omdoc+xml": {
    source: "apache",
    compressible: true,
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
    compressible: true
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
    compressible: false
  },
  "application/p2p-overlay+xml": {
    source: "iana",
    compressible: true,
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
    compressible: true,
    extensions: [
      "xer"
    ]
  },
  "application/pdf": {
    source: "iana",
    compressible: false,
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
    compressible: false,
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
    compressible: true
  },
  "application/pidf-diff+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
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
    compressible: true,
    extensions: [
      "pls"
    ]
  },
  "application/poc-settings+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/postscript": {
    source: "iana",
    compressible: true,
    extensions: [
      "ai",
      "eps",
      "ps"
    ]
  },
  "application/ppsp-tracker+json": {
    source: "iana",
    compressible: true
  },
  "application/problem+json": {
    source: "iana",
    compressible: true
  },
  "application/problem+xml": {
    source: "iana",
    compressible: true
  },
  "application/provenance+xml": {
    source: "iana",
    compressible: true,
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
    compressible: false
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
    compressible: true
  },
  "application/pskc+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "pskcxml"
    ]
  },
  "application/pvd+json": {
    source: "iana",
    compressible: true
  },
  "application/qsig": {
    source: "iana"
  },
  "application/raml+yaml": {
    compressible: true,
    extensions: [
      "raml"
    ]
  },
  "application/raptorfec": {
    source: "iana"
  },
  "application/rdap+json": {
    source: "iana",
    compressible: true
  },
  "application/rdf+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "rdf",
      "owl"
    ]
  },
  "application/reginfo+xml": {
    source: "iana",
    compressible: true,
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
    compressible: true
  },
  "application/resource-lists+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "rl"
    ]
  },
  "application/resource-lists-diff+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "rld"
    ]
  },
  "application/rfc+xml": {
    source: "iana",
    compressible: true
  },
  "application/riscos": {
    source: "iana"
  },
  "application/rlmi+xml": {
    source: "iana",
    compressible: true
  },
  "application/rls-services+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "rs"
    ]
  },
  "application/route-apd+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "rapd"
    ]
  },
  "application/route-s-tsid+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "sls"
    ]
  },
  "application/route-usd+xml": {
    source: "iana",
    compressible: true,
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
    compressible: true,
    extensions: [
      "rsd"
    ]
  },
  "application/rss+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "rss"
    ]
  },
  "application/rtf": {
    source: "iana",
    compressible: true,
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
    compressible: true
  },
  "application/samlmetadata+xml": {
    source: "iana",
    compressible: true
  },
  "application/sarif+json": {
    source: "iana",
    compressible: true
  },
  "application/sarif-external-properties+json": {
    source: "iana",
    compressible: true
  },
  "application/sbe": {
    source: "iana"
  },
  "application/sbml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "sbml"
    ]
  },
  "application/scaip+xml": {
    source: "iana",
    compressible: true
  },
  "application/scim+json": {
    source: "iana",
    compressible: true
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
    compressible: true
  },
  "application/senml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "senmlx"
    ]
  },
  "application/senml-etch+cbor": {
    source: "iana"
  },
  "application/senml-etch+json": {
    source: "iana",
    compressible: true
  },
  "application/senml-exi": {
    source: "iana"
  },
  "application/sensml+cbor": {
    source: "iana"
  },
  "application/sensml+json": {
    source: "iana",
    compressible: true
  },
  "application/sensml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "sensmlx"
    ]
  },
  "application/sensml-exi": {
    source: "iana"
  },
  "application/sep+xml": {
    source: "iana",
    compressible: true
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
    compressible: true,
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
    compressible: true
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
    compressible: true,
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
    compressible: true
  },
  "application/sparql-query": {
    source: "iana",
    extensions: [
      "rq"
    ]
  },
  "application/sparql-results+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "srx"
    ]
  },
  "application/spdx+json": {
    source: "iana",
    compressible: true
  },
  "application/spirits-event+xml": {
    source: "iana",
    compressible: true
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
    compressible: true,
    extensions: [
      "grxml"
    ]
  },
  "application/sru+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "sru"
    ]
  },
  "application/ssdl+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "ssdl"
    ]
  },
  "application/ssml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "ssml"
    ]
  },
  "application/stix+json": {
    source: "iana",
    compressible: true
  },
  "application/swid+xml": {
    source: "iana",
    compressible: true,
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
    compressible: true
  },
  "application/taxii+json": {
    source: "iana",
    compressible: true
  },
  "application/td+json": {
    source: "iana",
    compressible: true
  },
  "application/tei+xml": {
    source: "iana",
    compressible: true,
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
    compressible: true,
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
    compressible: true
  },
  "application/tnauthlist": {
    source: "iana"
  },
  "application/token-introspection+jwt": {
    source: "iana"
  },
  "application/toml": {
    compressible: true,
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
    compressible: true,
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
    compressible: false,
    extensions: [
      "ubj"
    ]
  },
  "application/ulpfec": {
    source: "iana"
  },
  "application/urc-grpsheet+xml": {
    source: "iana",
    compressible: true
  },
  "application/urc-ressheet+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "rsheet"
    ]
  },
  "application/urc-targetdesc+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "td"
    ]
  },
  "application/urc-uisocketdesc+xml": {
    source: "iana",
    compressible: true
  },
  "application/vcard+json": {
    source: "iana",
    compressible: true
  },
  "application/vcard+xml": {
    source: "iana",
    compressible: true
  },
  "application/vemmi": {
    source: "iana"
  },
  "application/vividence.scriptfile": {
    source: "apache"
  },
  "application/vnd.1000minds.decision-model+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "1km"
    ]
  },
  "application/vnd.3gpp-prose+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp-prose-pc3ch+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp-v2x-local-service-information": {
    source: "iana"
  },
  "application/vnd.3gpp.5gnas": {
    source: "iana"
  },
  "application/vnd.3gpp.access-transfer-events+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.bsf+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.gmop+xml": {
    source: "iana",
    compressible: true
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
    compressible: true
  },
  "application/vnd.3gpp.mcdata-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcdata-payload": {
    source: "iana"
  },
  "application/vnd.3gpp.mcdata-service-config+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcdata-signalling": {
    source: "iana"
  },
  "application/vnd.3gpp.mcdata-ue-config+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcdata-user-profile+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcptt-affiliation-command+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcptt-floor-request+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcptt-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcptt-location-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcptt-mbms-usage-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcptt-service-config+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcptt-signed+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcptt-ue-config+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcptt-ue-init-config+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcptt-user-profile+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcvideo-affiliation-command+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcvideo-affiliation-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcvideo-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcvideo-location-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcvideo-mbms-usage-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcvideo-service-config+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcvideo-transmission-request+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcvideo-ue-config+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcvideo-user-profile+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mid-call+xml": {
    source: "iana",
    compressible: true
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
    compressible: true
  },
  "application/vnd.3gpp.srvcc-ext+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.srvcc-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.state-and-event-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.ussd+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp2.bcmcsinfo+xml": {
    source: "iana",
    compressible: true
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
    compressible: false,
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
    compressible: true,
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
    compressible: true
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
    compressible: true
  },
  "application/vnd.android.ota": {
    source: "iana"
  },
  "application/vnd.android.package-archive": {
    source: "apache",
    compressible: false,
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
    compressible: true
  },
  "application/vnd.aplextor.warrp+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.apothekende.reservation+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.apple.installer+xml": {
    source: "iana",
    compressible: true,
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
    compressible: false,
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
    compressible: true
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
    compressible: true
  },
  "application/vnd.avistar+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.balsamiq.bmml+xml": {
    source: "iana",
    compressible: true,
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
    compressible: true
  },
  "application/vnd.bekitzur-stech+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.bint.med-content": {
    source: "iana"
  },
  "application/vnd.biopax.rdf+xml": {
    source: "iana",
    compressible: true
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
    compressible: true
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
    compressible: true
  },
  "application/vnd.cendio.thinlinc.clientconf": {
    source: "iana"
  },
  "application/vnd.century-systems.tcp_stream": {
    source: "iana"
  },
  "application/vnd.chemdraw+xml": {
    source: "iana",
    compressible: true,
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
    compressible: true,
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
    compressible: true
  },
  "application/vnd.collection.doc+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.collection.next+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.comicbook+zip": {
    source: "iana",
    compressible: false
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
    compressible: true
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
    compressible: true,
    extensions: [
      "wbs"
    ]
  },
  "application/vnd.cryptii.pipe+json": {
    source: "iana",
    compressible: true
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
    compressible: true
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
    compressible: true
  },
  "application/vnd.cybank": {
    source: "iana"
  },
  "application/vnd.cyclonedx+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.cyclonedx+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.d2l.coursepackage1p0+zip": {
    source: "iana",
    compressible: false
  },
  "application/vnd.d3m-dataset": {
    source: "iana"
  },
  "application/vnd.d3m-problem": {
    source: "iana"
  },
  "application/vnd.dart": {
    source: "iana",
    compressible: true,
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
    compressible: true
  },
  "application/vnd.dataresource+json": {
    source: "iana",
    compressible: true
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
    compressible: true,
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
    compressible: true
  },
  "application/vnd.dna": {
    source: "iana",
    extensions: [
      "dna"
    ]
  },
  "application/vnd.document+json": {
    source: "iana",
    compressible: true
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
    compressible: true
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
    compressible: true
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
    compressible: true
  },
  "application/vnd.dvb.notif-container+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.dvb.notif-generic+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.dvb.notif-ia-msglist+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.dvb.notif-ia-registration-request+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.dvb.notif-ia-registration-response+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.dvb.notif-init+xml": {
    source: "iana",
    compressible: true
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
    compressible: true
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
    compressible: true
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
    compressible: true
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
    compressible: false
  },
  "application/vnd.eszigno3+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "es3",
      "et3"
    ]
  },
  "application/vnd.etsi.aoc+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.asic-e+zip": {
    source: "iana",
    compressible: false
  },
  "application/vnd.etsi.asic-s+zip": {
    source: "iana",
    compressible: false
  },
  "application/vnd.etsi.cug+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.iptvcommand+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.iptvdiscovery+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.iptvprofile+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.iptvsad-bc+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.iptvsad-cod+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.iptvsad-npvr+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.iptvservice+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.iptvsync+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.iptvueprofile+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.mcid+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.mheg5": {
    source: "iana"
  },
  "application/vnd.etsi.overload-control-policy-dataset+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.pstn+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.sci+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.simservs+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.timestamp-token": {
    source: "iana"
  },
  "application/vnd.etsi.tsl+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.tsl.der": {
    source: "iana"
  },
  "application/vnd.eu.kasparian.car+json": {
    source: "iana",
    compressible: true
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
    compressible: false
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
    compressible: false
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
    compressible: false
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
    compressible: true
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
    compressible: true
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
    compressible: true
  },
  "application/vnd.geo+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.geocube+xml": {
    source: "iana",
    compressible: true
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
    compressible: false,
    extensions: [
      "gdoc"
    ]
  },
  "application/vnd.google-apps.presentation": {
    compressible: false,
    extensions: [
      "gslides"
    ]
  },
  "application/vnd.google-apps.spreadsheet": {
    compressible: false,
    extensions: [
      "gsheet"
    ]
  },
  "application/vnd.google-earth.kml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "kml"
    ]
  },
  "application/vnd.google-earth.kmz": {
    source: "iana",
    compressible: false,
    extensions: [
      "kmz"
    ]
  },
  "application/vnd.gov.sk.e-form+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.gov.sk.e-form+zip": {
    source: "iana",
    compressible: false
  },
  "application/vnd.gov.sk.xmldatacontainer+xml": {
    source: "iana",
    compressible: true
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
    compressible: true
  },
  "application/vnd.hal+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "hal"
    ]
  },
  "application/vnd.handheld-entertainment+xml": {
    source: "iana",
    compressible: true,
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
    compressible: true
  },
  "application/vnd.hcl-bireports": {
    source: "iana"
  },
  "application/vnd.hdt": {
    source: "iana"
  },
  "application/vnd.heroku+json": {
    source: "iana",
    compressible: true
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
    compressible: true
  },
  "application/vnd.hl7v2+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
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
    compressible: true
  },
  "application/vnd.hyper-item+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.hyperdrive+json": {
    source: "iana",
    compressible: true
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
    compressible: false
  },
  "application/vnd.imagemeter.image+zip": {
    source: "iana",
    compressible: false
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
    compressible: true
  },
  "application/vnd.ims.lti.v2.toolconsumerprofile+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.ims.lti.v2.toolproxy+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.ims.lti.v2.toolproxy.id+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.ims.lti.v2.toolsettings+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.ims.lti.v2.toolsettings.simple+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.informedcontrol.rms+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.informix-visionary": {
    source: "iana"
  },
  "application/vnd.infotech.project": {
    source: "iana"
  },
  "application/vnd.infotech.project+xml": {
    source: "iana",
    compressible: true
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
    compressible: true
  },
  "application/vnd.iptc.g2.conceptitem+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.iptc.g2.knowledgeitem+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.iptc.g2.newsitem+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.iptc.g2.newsmessage+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.iptc.g2.packageitem+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.iptc.g2.planningitem+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.ipunplugged.rcprofile": {
    source: "iana",
    extensions: [
      "rcprofile"
    ]
  },
  "application/vnd.irepository.package+xml": {
    source: "iana",
    compressible: true,
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
    compressible: false
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
    compressible: true
  },
  "application/vnd.las.las+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "lasxml"
    ]
  },
  "application/vnd.laszip": {
    source: "iana"
  },
  "application/vnd.leap+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.liberty-request+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.llamagraphics.life-balance.desktop": {
    source: "iana",
    extensions: [
      "lbd"
    ]
  },
  "application/vnd.llamagraphics.life-balance.exchange+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "lbe"
    ]
  },
  "application/vnd.logipipe.circuit+zip": {
    source: "iana",
    compressible: false
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
    compressible: true
  },
  "application/vnd.marlin.drm.conftoken+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.marlin.drm.license+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.marlin.drm.mdcf": {
    source: "iana"
  },
  "application/vnd.mason+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.maxar.archive.3tz+zip": {
    source: "iana",
    compressible: false
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
    compressible: true
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
    compressible: true
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
    compressible: true,
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
    compressible: false,
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
    compressible: true,
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
    compressible: true
  },
  "application/vnd.ms-officetheme": {
    source: "iana",
    extensions: [
      "thmx"
    ]
  },
  "application/vnd.ms-opentype": {
    source: "apache",
    compressible: true
  },
  "application/vnd.ms-outlook": {
    compressible: false,
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
    compressible: true
  },
  "application/vnd.ms-powerpoint": {
    source: "iana",
    compressible: false,
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
    compressible: true
  },
  "application/vnd.ms-printing.printticket+xml": {
    source: "apache",
    compressible: true
  },
  "application/vnd.ms-printschematicket+xml": {
    source: "iana",
    compressible: true
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
    compressible: false,
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
    compressible: true
  },
  "application/vnd.ncd.control": {
    source: "iana"
  },
  "application/vnd.ncd.reference": {
    source: "iana"
  },
  "application/vnd.nearst.inv+json": {
    source: "iana",
    compressible: true
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
    compressible: true
  },
  "application/vnd.nokia.iptv.config+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.nokia.isds-radio-presets": {
    source: "iana"
  },
  "application/vnd.nokia.landmark+wbxml": {
    source: "iana"
  },
  "application/vnd.nokia.landmark+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.nokia.landmarkcollection+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.nokia.n-gage.ac+xml": {
    source: "iana",
    compressible: true,
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
    compressible: true
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
    compressible: false,
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
    compressible: false,
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
    compressible: false,
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
    compressible: false,
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
    compressible: true
  },
  "application/vnd.oftn.l10n+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oipf.contentaccessdownload+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oipf.contentaccessstreaming+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oipf.cspg-hexbinary": {
    source: "iana"
  },
  "application/vnd.oipf.dae.svg+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oipf.dae.xhtml+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oipf.mippvcontrolmessage+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oipf.pae.gem": {
    source: "iana"
  },
  "application/vnd.oipf.spdiscovery+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oipf.spdlist+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oipf.ueprofile+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oipf.userprofile+xml": {
    source: "iana",
    compressible: true
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
    compressible: true
  },
  "application/vnd.oma.bcast.drm-trigger+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.bcast.imd+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.bcast.ltkm": {
    source: "iana"
  },
  "application/vnd.oma.bcast.notification+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.bcast.provisioningtrigger": {
    source: "iana"
  },
  "application/vnd.oma.bcast.sgboot": {
    source: "iana"
  },
  "application/vnd.oma.bcast.sgdd+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.bcast.sgdu": {
    source: "iana"
  },
  "application/vnd.oma.bcast.simple-symbol-container": {
    source: "iana"
  },
  "application/vnd.oma.bcast.smartcard-trigger+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.bcast.sprov+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.bcast.stkm": {
    source: "iana"
  },
  "application/vnd.oma.cab-address-book+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.cab-feature-handler+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.cab-pcc+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.cab-subs-invite+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.cab-user-prefs+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.dcd": {
    source: "iana"
  },
  "application/vnd.oma.dcdc": {
    source: "iana"
  },
  "application/vnd.oma.dd2+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "dd2"
    ]
  },
  "application/vnd.oma.drm.risd+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.group-usage-list+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.lwm2m+cbor": {
    source: "iana"
  },
  "application/vnd.oma.lwm2m+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.lwm2m+tlv": {
    source: "iana"
  },
  "application/vnd.oma.pal+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.poc.detailed-progress-report+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.poc.final-report+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.poc.groups+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.poc.invocation-descriptor+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.poc.optimized-progress-report+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.push": {
    source: "iana"
  },
  "application/vnd.oma.scidm.messages+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.xcap-directory+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.omads-email+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/vnd.omads-file+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/vnd.omads-folder+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
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
    compressible: true,
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
    compressible: true,
    extensions: [
      "osm"
    ]
  },
  "application/vnd.opentimestamps.ots": {
    source: "iana"
  },
  "application/vnd.openxmlformats-officedocument.custom-properties+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.drawing+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.extended-properties+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
    source: "iana",
    compressible: false,
    extensions: [
      "pptx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slide": {
    source: "iana",
    extensions: [
      "sldx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
    source: "iana",
    extensions: [
      "ppsx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.template": {
    source: "iana",
    extensions: [
      "potx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
    source: "iana",
    compressible: false,
    extensions: [
      "xlsx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
    source: "iana",
    extensions: [
      "xltx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.theme+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.themeoverride+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.vmldrawing": {
    source: "iana"
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    source: "iana",
    compressible: false,
    extensions: [
      "docx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
    source: "iana",
    extensions: [
      "dotx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-package.core-properties+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-package.relationships+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oracle.resource+json": {
    source: "iana",
    compressible: true
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
    compressible: true
  },
  "application/vnd.oxli.countgraph": {
    source: "iana"
  },
  "application/vnd.pagerduty+json": {
    source: "iana",
    compressible: true
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
    compressible: true
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
    compressible: true
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
    compressible: true
  },
  "application/vnd.radisys.msml+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-audit+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-audit-conf+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-audit-conn+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-audit-dialog+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-audit-stream+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-conf+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-dialog+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-dialog-base+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-dialog-fax-detect+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-dialog-group+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-dialog-speech+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-dialog-transform+xml": {
    source: "iana",
    compressible: true
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
    compressible: true,
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
    compressible: true
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
    compressible: true,
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
    compressible: true
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
    compressible: true
  },
  "application/vnd.shopkick+json": {
    source: "iana",
    compressible: true
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
    compressible: true
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
    compressible: true,
    extensions: [
      "fo"
    ]
  },
  "application/vnd.software602.filler.form-xml-zip": {
    source: "iana"
  },
  "application/vnd.solent.sdkm+xml": {
    source: "iana",
    compressible: true,
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
    compressible: true,
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
    compressible: true
  },
  "application/vnd.syft+json": {
    source: "iana",
    compressible: true
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
    compressible: true,
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
    compressible: true,
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
    compressible: true,
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
    compressible: true
  },
  "application/vnd.syncml.ds.notification": {
    source: "iana"
  },
  "application/vnd.tableschema+json": {
    source: "iana",
    compressible: true
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
    compressible: true
  },
  "application/vnd.tmd.mediaflex.api+xml": {
    source: "iana",
    compressible: true
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
    compressible: true,
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
    compressible: true
  },
  "application/vnd.verimatrix.vcas": {
    source: "iana"
  },
  "application/vnd.veritone.aion+json": {
    source: "iana",
    compressible: true
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
    compressible: true
  },
  "application/vnd.wv.ssp+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.xacml+json": {
    source: "iana",
    compressible: true
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
    compressible: true
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
    compressible: true,
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
    compressible: true,
    extensions: [
      "zaz"
    ]
  },
  "application/voicexml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "vxml"
    ]
  },
  "application/voucher-cms+json": {
    source: "iana",
    compressible: true
  },
  "application/vq-rtcpxr": {
    source: "iana"
  },
  "application/wasm": {
    source: "iana",
    compressible: true,
    extensions: [
      "wasm"
    ]
  },
  "application/watcherinfo+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "wif"
    ]
  },
  "application/webpush-options+json": {
    source: "iana",
    compressible: true
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
    compressible: true,
    extensions: [
      "wsdl"
    ]
  },
  "application/wspolicy+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "wspolicy"
    ]
  },
  "application/x-7z-compressed": {
    source: "apache",
    compressible: false,
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
    compressible: false,
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
    compressible: false,
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
    compressible: false,
    extensions: [
      "bz"
    ]
  },
  "application/x-bzip2": {
    source: "apache",
    compressible: false,
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
    compressible: false
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
    compressible: true,
    extensions: [
      "ncx"
    ]
  },
  "application/x-dtbook+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "dtb"
    ]
  },
  "application/x-dtbresource+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "res"
    ]
  },
  "application/x-dvi": {
    source: "apache",
    compressible: false,
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
    compressible: true,
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
    compressible: false,
    extensions: [
      "jnlp"
    ]
  },
  "application/x-javascript": {
    compressible: true
  },
  "application/x-keepass2": {
    extensions: [
      "kdbx"
    ]
  },
  "application/x-latex": {
    source: "apache",
    compressible: false,
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
    compressible: false
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
    compressible: true,
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
    compressible: false,
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
    compressible: false,
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
    compressible: true,
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
    compressible: false,
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
    compressible: false,
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
    compressible: true,
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
    compressible: true,
    extensions: [
      "hdd"
    ]
  },
  "application/x-virtualbox-ova": {
    compressible: true,
    extensions: [
      "ova"
    ]
  },
  "application/x-virtualbox-ovf": {
    compressible: true,
    extensions: [
      "ovf"
    ]
  },
  "application/x-virtualbox-vbox": {
    compressible: true,
    extensions: [
      "vbox"
    ]
  },
  "application/x-virtualbox-vbox-extpack": {
    compressible: false,
    extensions: [
      "vbox-extpack"
    ]
  },
  "application/x-virtualbox-vdi": {
    compressible: true,
    extensions: [
      "vdi"
    ]
  },
  "application/x-virtualbox-vhd": {
    compressible: true,
    extensions: [
      "vhd"
    ]
  },
  "application/x-virtualbox-vmdk": {
    compressible: true,
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
    compressible: true,
    extensions: [
      "webapp"
    ]
  },
  "application/x-www-form-urlencoded": {
    source: "iana",
    compressible: true
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
    compressible: true,
    extensions: [
      "xlf"
    ]
  },
  "application/x-xpinstall": {
    source: "apache",
    compressible: false,
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
    compressible: true
  },
  "application/xaml+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "xaml"
    ]
  },
  "application/xcap-att+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xav"
    ]
  },
  "application/xcap-caps+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xca"
    ]
  },
  "application/xcap-diff+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xdf"
    ]
  },
  "application/xcap-el+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xel"
    ]
  },
  "application/xcap-error+xml": {
    source: "iana",
    compressible: true
  },
  "application/xcap-ns+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xns"
    ]
  },
  "application/xcon-conference-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/xcon-conference-info-diff+xml": {
    source: "iana",
    compressible: true
  },
  "application/xenc+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xenc"
    ]
  },
  "application/xhtml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xhtml",
      "xht"
    ]
  },
  "application/xhtml-voice+xml": {
    source: "apache",
    compressible: true
  },
  "application/xliff+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xlf"
    ]
  },
  "application/xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xml",
      "xsl",
      "xsd",
      "rng"
    ]
  },
  "application/xml-dtd": {
    source: "iana",
    compressible: true,
    extensions: [
      "dtd"
    ]
  },
  "application/xml-external-parsed-entity": {
    source: "iana"
  },
  "application/xml-patch+xml": {
    source: "iana",
    compressible: true
  },
  "application/xmpp+xml": {
    source: "iana",
    compressible: true
  },
  "application/xop+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xop"
    ]
  },
  "application/xproc+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "xpl"
    ]
  },
  "application/xslt+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xsl",
      "xslt"
    ]
  },
  "application/xspf+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "xspf"
    ]
  },
  "application/xv+xml": {
    source: "iana",
    compressible: true,
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
    compressible: true
  },
  "application/yang-data+xml": {
    source: "iana",
    compressible: true
  },
  "application/yang-patch+json": {
    source: "iana",
    compressible: true
  },
  "application/yang-patch+xml": {
    source: "iana",
    compressible: true
  },
  "application/yin+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "yin"
    ]
  },
  "application/zip": {
    source: "iana",
    compressible: false,
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
    compressible: false,
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
    compressible: false,
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
    compressible: false
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
    compressible: false,
    extensions: [
      "mp3"
    ]
  },
  "audio/mp4": {
    source: "iana",
    compressible: false,
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
    compressible: false,
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
    compressible: false,
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
    compressible: false
  },
  "audio/vnd.sealedmedia.softseal.mpeg": {
    source: "iana"
  },
  "audio/vnd.vmx.cvsd": {
    source: "iana"
  },
  "audio/vnd.wave": {
    compressible: false
  },
  "audio/vorbis": {
    source: "iana",
    compressible: false
  },
  "audio/vorbis-config": {
    source: "iana"
  },
  "audio/wav": {
    compressible: false,
    extensions: [
      "wav"
    ]
  },
  "audio/wave": {
    compressible: false,
    extensions: [
      "wav"
    ]
  },
  "audio/webm": {
    source: "apache",
    compressible: false,
    extensions: [
      "weba"
    ]
  },
  "audio/x-aac": {
    source: "apache",
    compressible: false,
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
    compressible: false,
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
    compressible: true,
    extensions: [
      "otf"
    ]
  },
  "font/sfnt": {
    source: "iana"
  },
  "font/ttf": {
    source: "iana",
    compressible: true,
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
    compressible: false,
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
    compressible: false,
    extensions: [
      "avif"
    ]
  },
  "image/bmp": {
    source: "iana",
    compressible: true,
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
    compressible: false,
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
    compressible: false,
    extensions: [
      "jp2",
      "jpg2"
    ]
  },
  "image/jpeg": {
    source: "iana",
    compressible: false,
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
    compressible: false,
    extensions: [
      "jpm"
    ]
  },
  "image/jpx": {
    source: "iana",
    compressible: false,
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
    compressible: false
  },
  "image/png": {
    source: "iana",
    compressible: false,
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
    compressible: true,
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
    compressible: false,
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
    compressible: true,
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
    compressible: true,
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
    compressible: true,
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
    compressible: true,
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
    compressible: true,
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
    compressible: false
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
    compressible: false
  },
  "message/imdn+xml": {
    source: "iana",
    compressible: true
  },
  "message/news": {
    source: "iana"
  },
  "message/partial": {
    source: "iana",
    compressible: false
  },
  "message/rfc822": {
    source: "iana",
    compressible: true,
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
    compressible: true,
    extensions: [
      "gltf"
    ]
  },
  "model/gltf-binary": {
    source: "iana",
    compressible: true,
    extensions: [
      "glb"
    ]
  },
  "model/iges": {
    source: "iana",
    compressible: false,
    extensions: [
      "igs",
      "iges"
    ]
  },
  "model/mesh": {
    source: "iana",
    compressible: false,
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
    compressible: true,
    extensions: [
      "stpx"
    ]
  },
  "model/step+zip": {
    source: "iana",
    compressible: false,
    extensions: [
      "stpz"
    ]
  },
  "model/step-xml+zip": {
    source: "iana",
    compressible: false,
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
    compressible: true,
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
    compressible: true
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
    compressible: false,
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
    compressible: false,
    extensions: [
      "wrl",
      "vrml"
    ]
  },
  "model/x3d+binary": {
    source: "apache",
    compressible: false,
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
    compressible: false,
    extensions: [
      "x3dv",
      "x3dvz"
    ]
  },
  "model/x3d+xml": {
    source: "iana",
    compressible: true,
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
    compressible: false
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
    compressible: false
  },
  "multipart/form-data": {
    source: "iana",
    compressible: false
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
    compressible: false
  },
  "multipart/report": {
    source: "iana"
  },
  "multipart/signed": {
    source: "iana",
    compressible: false
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
    compressible: true,
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
    compressible: true
  },
  "text/cmd": {
    compressible: true
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
    compressible: true,
    extensions: [
      "css"
    ]
  },
  "text/csv": {
    source: "iana",
    compressible: true,
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
    compressible: true,
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
    compressible: true
  },
  "text/jcr-cnd": {
    source: "iana"
  },
  "text/jsx": {
    compressible: true,
    extensions: [
      "jsx"
    ]
  },
  "text/less": {
    compressible: true,
    extensions: [
      "less"
    ]
  },
  "text/markdown": {
    source: "iana",
    compressible: true,
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
    compressible: true,
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
    compressible: true,
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
    compressible: true,
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
    compressible: true,
    extensions: [
      "rtx"
    ]
  },
  "text/rtf": {
    source: "iana",
    compressible: true,
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
    compressible: true,
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
    compressible: true,
    extensions: [
      "uri",
      "uris",
      "urls"
    ]
  },
  "text/vcard": {
    source: "iana",
    compressible: true,
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
    compressible: true,
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
    compressible: true
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
    compressible: true
  },
  "text/x-lua": {
    extensions: [
      "lua"
    ]
  },
  "text/x-markdown": {
    compressible: true,
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
    compressible: true,
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
    compressible: true,
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
    compressible: true,
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
    compressible: true,
    extensions: [
      "xml"
    ]
  },
  "text/xml-external-parsed-entity": {
    source: "iana"
  },
  "text/yaml": {
    compressible: true,
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
    compressible: false,
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
    compressible: false,
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
    compressible: false,
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
    compressible: false,
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
    compressible: false,
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
    compressible: false,
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
    compressible: false,
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
    compressible: false,
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
    compressible: true
  },
  "x-shader/x-vertex": {
    compressible: true
  }
};
/*!
 * mime-db
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015-2022 Douglas Christopher Wilson
 * MIT Licensed
 */
var mimeDb = require$$0;
/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
(function(exports) {
  var db2 = mimeDb;
  var extname = require$$1$1.extname;
  var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
  var TEXT_TYPE_REGEXP = /^text\//i;
  exports.charset = charset;
  exports.charsets = { lookup: charset };
  exports.contentType = contentType;
  exports.extension = extension;
  exports.extensions = /* @__PURE__ */ Object.create(null);
  exports.lookup = lookup;
  exports.types = /* @__PURE__ */ Object.create(null);
  populateMaps(exports.extensions, exports.types);
  function charset(type2) {
    if (!type2 || typeof type2 !== "string") {
      return false;
    }
    var match = EXTRACT_TYPE_REGEXP.exec(type2);
    var mime2 = match && db2[match[1].toLowerCase()];
    if (mime2 && mime2.charset) {
      return mime2.charset;
    }
    if (match && TEXT_TYPE_REGEXP.test(match[1])) {
      return "UTF-8";
    }
    return false;
  }
  function contentType(str) {
    if (!str || typeof str !== "string") {
      return false;
    }
    var mime2 = str.indexOf("/") === -1 ? exports.lookup(str) : str;
    if (!mime2) {
      return false;
    }
    if (mime2.indexOf("charset") === -1) {
      var charset2 = exports.charset(mime2);
      if (charset2) mime2 += "; charset=" + charset2.toLowerCase();
    }
    return mime2;
  }
  function extension(type2) {
    if (!type2 || typeof type2 !== "string") {
      return false;
    }
    var match = EXTRACT_TYPE_REGEXP.exec(type2);
    var exts = match && exports.extensions[match[1].toLowerCase()];
    if (!exts || !exts.length) {
      return false;
    }
    return exts[0];
  }
  function lookup(path2) {
    if (!path2 || typeof path2 !== "string") {
      return false;
    }
    var extension2 = extname("x." + path2).toLowerCase().substr(1);
    if (!extension2) {
      return false;
    }
    return exports.types[extension2] || false;
  }
  function populateMaps(extensions, types) {
    var preference = ["nginx", "apache", void 0, "iana"];
    Object.keys(db2).forEach(function forEachMimeType(type2) {
      var mime2 = db2[type2];
      var exts = mime2.extensions;
      if (!exts || !exts.length) {
        return;
      }
      extensions[type2] = exts;
      for (var i = 0; i < exts.length; i++) {
        var extension2 = exts[i];
        if (types[extension2]) {
          var from = preference.indexOf(db2[types[extension2]].source);
          var to = preference.indexOf(mime2.source);
          if (types[extension2] !== "application/octet-stream" && (from > to || from === to && types[extension2].substr(0, 12) === "application/")) {
            continue;
          }
        }
        types[extension2] = type2;
      }
    });
  }
})(mimeTypes);
var defer_1 = defer$1;
function defer$1(fn) {
  var nextTick = typeof setImmediate == "function" ? setImmediate : typeof process == "object" && typeof process.nextTick == "function" ? process.nextTick : null;
  if (nextTick) {
    nextTick(fn);
  } else {
    setTimeout(fn, 0);
  }
}
var defer = defer_1;
var async_1 = async$2;
function async$2(callback) {
  var isAsync = false;
  defer(function() {
    isAsync = true;
  });
  return function async_callback(err, result) {
    if (isAsync) {
      callback(err, result);
    } else {
      defer(function nextTick_callback() {
        callback(err, result);
      });
    }
  };
}
var abort_1 = abort$2;
function abort$2(state2) {
  Object.keys(state2.jobs).forEach(clean.bind(state2));
  state2.jobs = {};
}
function clean(key) {
  if (typeof this.jobs[key] == "function") {
    this.jobs[key]();
  }
}
var async$1 = async_1, abort$1 = abort_1;
var iterate_1 = iterate$2;
function iterate$2(list, iterator2, state2, callback) {
  var key = state2["keyedList"] ? state2["keyedList"][state2.index] : state2.index;
  state2.jobs[key] = runJob(iterator2, key, list[key], function(error, output) {
    if (!(key in state2.jobs)) {
      return;
    }
    delete state2.jobs[key];
    if (error) {
      abort$1(state2);
    } else {
      state2.results[key] = output;
    }
    callback(error, state2.results);
  });
}
function runJob(iterator2, key, item, callback) {
  var aborter;
  if (iterator2.length == 2) {
    aborter = iterator2(item, async$1(callback));
  } else {
    aborter = iterator2(item, key, async$1(callback));
  }
  return aborter;
}
var state_1 = state;
function state(list, sortMethod) {
  var isNamedList = !Array.isArray(list), initState2 = {
    index: 0,
    keyedList: isNamedList || sortMethod ? Object.keys(list) : null,
    jobs: {},
    results: isNamedList ? {} : [],
    size: isNamedList ? Object.keys(list).length : list.length
  };
  if (sortMethod) {
    initState2.keyedList.sort(isNamedList ? sortMethod : function(a, b) {
      return sortMethod(list[a], list[b]);
    });
  }
  return initState2;
}
var abort = abort_1, async = async_1;
var terminator_1 = terminator$2;
function terminator$2(callback) {
  if (!Object.keys(this.jobs).length) {
    return;
  }
  this.index = this.size;
  abort(this);
  async(callback)(null, this.results);
}
var iterate$1 = iterate_1, initState$1 = state_1, terminator$1 = terminator_1;
var parallel_1 = parallel;
function parallel(list, iterator2, callback) {
  var state2 = initState$1(list);
  while (state2.index < (state2["keyedList"] || list).length) {
    iterate$1(list, iterator2, state2, function(error, result) {
      if (error) {
        callback(error, result);
        return;
      }
      if (Object.keys(state2.jobs).length === 0) {
        callback(null, state2.results);
        return;
      }
    });
    state2.index++;
  }
  return terminator$1.bind(state2, callback);
}
var serialOrdered$2 = { exports: {} };
var iterate = iterate_1, initState = state_1, terminator = terminator_1;
serialOrdered$2.exports = serialOrdered$1;
serialOrdered$2.exports.ascending = ascending;
serialOrdered$2.exports.descending = descending;
function serialOrdered$1(list, iterator2, sortMethod, callback) {
  var state2 = initState(list, sortMethod);
  iterate(list, iterator2, state2, function iteratorHandler(error, result) {
    if (error) {
      callback(error, result);
      return;
    }
    state2.index++;
    if (state2.index < (state2["keyedList"] || list).length) {
      iterate(list, iterator2, state2, iteratorHandler);
      return;
    }
    callback(null, state2.results);
  });
  return terminator.bind(state2, callback);
}
function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}
function descending(a, b) {
  return -1 * ascending(a, b);
}
var serialOrderedExports = serialOrdered$2.exports;
var serialOrdered = serialOrderedExports;
var serial_1 = serial;
function serial(list, iterator2, callback) {
  return serialOrdered(list, iterator2, null, callback);
}
var asynckit$1 = {
  parallel: parallel_1,
  serial: serial_1,
  serialOrdered: serialOrderedExports
};
var esObjectAtoms = Object;
var esErrors = Error;
var _eval = EvalError;
var range = RangeError;
var ref = ReferenceError;
var syntax = SyntaxError;
var type = TypeError;
var uri = URIError;
var abs$1 = Math.abs;
var floor$1 = Math.floor;
var max$2 = Math.max;
var min$1 = Math.min;
var pow$1 = Math.pow;
var round$1 = Math.round;
var _isNaN = Number.isNaN || function isNaN2(a) {
  return a !== a;
};
var $isNaN = _isNaN;
var sign$1 = function sign(number) {
  if ($isNaN(number) || number === 0) {
    return number;
  }
  return number < 0 ? -1 : 1;
};
var gOPD = Object.getOwnPropertyDescriptor;
var $gOPD$1 = gOPD;
if ($gOPD$1) {
  try {
    $gOPD$1([], "length");
  } catch (e) {
    $gOPD$1 = null;
  }
}
var gopd = $gOPD$1;
var $defineProperty$2 = Object.defineProperty || false;
if ($defineProperty$2) {
  try {
    $defineProperty$2({}, "a", { value: 1 });
  } catch (e) {
    $defineProperty$2 = false;
  }
}
var esDefineProperty = $defineProperty$2;
var shams$1;
var hasRequiredShams$1;
function requireShams$1() {
  if (hasRequiredShams$1) return shams$1;
  hasRequiredShams$1 = 1;
  shams$1 = function hasSymbols2() {
    if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
      return false;
    }
    if (typeof Symbol.iterator === "symbol") {
      return true;
    }
    var obj = {};
    var sym = Symbol("test");
    var symObj = Object(sym);
    if (typeof sym === "string") {
      return false;
    }
    if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
      return false;
    }
    if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
      return false;
    }
    var symVal = 42;
    obj[sym] = symVal;
    for (var _ in obj) {
      return false;
    }
    if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
      return false;
    }
    if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
      return false;
    }
    var syms = Object.getOwnPropertySymbols(obj);
    if (syms.length !== 1 || syms[0] !== sym) {
      return false;
    }
    if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
      return false;
    }
    if (typeof Object.getOwnPropertyDescriptor === "function") {
      var descriptor = (
        /** @type {PropertyDescriptor} */
        Object.getOwnPropertyDescriptor(obj, sym)
      );
      if (descriptor.value !== symVal || descriptor.enumerable !== true) {
        return false;
      }
    }
    return true;
  };
  return shams$1;
}
var hasSymbols$1;
var hasRequiredHasSymbols;
function requireHasSymbols() {
  if (hasRequiredHasSymbols) return hasSymbols$1;
  hasRequiredHasSymbols = 1;
  var origSymbol = typeof Symbol !== "undefined" && Symbol;
  var hasSymbolSham = requireShams$1();
  hasSymbols$1 = function hasNativeSymbols() {
    if (typeof origSymbol !== "function") {
      return false;
    }
    if (typeof Symbol !== "function") {
      return false;
    }
    if (typeof origSymbol("foo") !== "symbol") {
      return false;
    }
    if (typeof Symbol("bar") !== "symbol") {
      return false;
    }
    return hasSymbolSham();
  };
  return hasSymbols$1;
}
var Reflect_getPrototypeOf;
var hasRequiredReflect_getPrototypeOf;
function requireReflect_getPrototypeOf() {
  if (hasRequiredReflect_getPrototypeOf) return Reflect_getPrototypeOf;
  hasRequiredReflect_getPrototypeOf = 1;
  Reflect_getPrototypeOf = typeof Reflect !== "undefined" && Reflect.getPrototypeOf || null;
  return Reflect_getPrototypeOf;
}
var Object_getPrototypeOf;
var hasRequiredObject_getPrototypeOf;
function requireObject_getPrototypeOf() {
  if (hasRequiredObject_getPrototypeOf) return Object_getPrototypeOf;
  hasRequiredObject_getPrototypeOf = 1;
  var $Object2 = esObjectAtoms;
  Object_getPrototypeOf = $Object2.getPrototypeOf || null;
  return Object_getPrototypeOf;
}
var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
var toStr = Object.prototype.toString;
var max$1 = Math.max;
var funcType = "[object Function]";
var concatty = function concatty2(a, b) {
  var arr = [];
  for (var i = 0; i < a.length; i += 1) {
    arr[i] = a[i];
  }
  for (var j = 0; j < b.length; j += 1) {
    arr[j + a.length] = b[j];
  }
  return arr;
};
var slicy = function slicy2(arrLike, offset) {
  var arr = [];
  for (var i = offset, j = 0; i < arrLike.length; i += 1, j += 1) {
    arr[j] = arrLike[i];
  }
  return arr;
};
var joiny = function(arr, joiner) {
  var str = "";
  for (var i = 0; i < arr.length; i += 1) {
    str += arr[i];
    if (i + 1 < arr.length) {
      str += joiner;
    }
  }
  return str;
};
var implementation$1 = function bind(that) {
  var target = this;
  if (typeof target !== "function" || toStr.apply(target) !== funcType) {
    throw new TypeError(ERROR_MESSAGE + target);
  }
  var args = slicy(arguments, 1);
  var bound;
  var binder = function() {
    if (this instanceof bound) {
      var result = target.apply(
        this,
        concatty(args, arguments)
      );
      if (Object(result) === result) {
        return result;
      }
      return this;
    }
    return target.apply(
      that,
      concatty(args, arguments)
    );
  };
  var boundLength = max$1(0, target.length - args.length);
  var boundArgs = [];
  for (var i = 0; i < boundLength; i++) {
    boundArgs[i] = "$" + i;
  }
  bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder);
  if (target.prototype) {
    var Empty = function Empty2() {
    };
    Empty.prototype = target.prototype;
    bound.prototype = new Empty();
    Empty.prototype = null;
  }
  return bound;
};
var implementation = implementation$1;
var functionBind = Function.prototype.bind || implementation;
var functionCall;
var hasRequiredFunctionCall;
function requireFunctionCall() {
  if (hasRequiredFunctionCall) return functionCall;
  hasRequiredFunctionCall = 1;
  functionCall = Function.prototype.call;
  return functionCall;
}
var functionApply;
var hasRequiredFunctionApply;
function requireFunctionApply() {
  if (hasRequiredFunctionApply) return functionApply;
  hasRequiredFunctionApply = 1;
  functionApply = Function.prototype.apply;
  return functionApply;
}
var reflectApply;
var hasRequiredReflectApply;
function requireReflectApply() {
  if (hasRequiredReflectApply) return reflectApply;
  hasRequiredReflectApply = 1;
  reflectApply = typeof Reflect !== "undefined" && Reflect && Reflect.apply;
  return reflectApply;
}
var actualApply;
var hasRequiredActualApply;
function requireActualApply() {
  if (hasRequiredActualApply) return actualApply;
  hasRequiredActualApply = 1;
  var bind3 = functionBind;
  var $apply2 = requireFunctionApply();
  var $call2 = requireFunctionCall();
  var $reflectApply = requireReflectApply();
  actualApply = $reflectApply || bind3.call($call2, $apply2);
  return actualApply;
}
var callBindApplyHelpers;
var hasRequiredCallBindApplyHelpers;
function requireCallBindApplyHelpers() {
  if (hasRequiredCallBindApplyHelpers) return callBindApplyHelpers;
  hasRequiredCallBindApplyHelpers = 1;
  var bind3 = functionBind;
  var $TypeError2 = type;
  var $call2 = requireFunctionCall();
  var $actualApply = requireActualApply();
  callBindApplyHelpers = function callBindBasic(args) {
    if (args.length < 1 || typeof args[0] !== "function") {
      throw new $TypeError2("a function is required");
    }
    return $actualApply(bind3, $call2, args);
  };
  return callBindApplyHelpers;
}
var get;
var hasRequiredGet;
function requireGet() {
  if (hasRequiredGet) return get;
  hasRequiredGet = 1;
  var callBind = requireCallBindApplyHelpers();
  var gOPD2 = gopd;
  var hasProtoAccessor;
  try {
    hasProtoAccessor = /** @type {{ __proto__?: typeof Array.prototype }} */
    [].__proto__ === Array.prototype;
  } catch (e) {
    if (!e || typeof e !== "object" || !("code" in e) || e.code !== "ERR_PROTO_ACCESS") {
      throw e;
    }
  }
  var desc = !!hasProtoAccessor && gOPD2 && gOPD2(
    Object.prototype,
    /** @type {keyof typeof Object.prototype} */
    "__proto__"
  );
  var $Object2 = Object;
  var $getPrototypeOf = $Object2.getPrototypeOf;
  get = desc && typeof desc.get === "function" ? callBind([desc.get]) : typeof $getPrototypeOf === "function" ? (
    /** @type {import('./get')} */
    function getDunder(value) {
      return $getPrototypeOf(value == null ? value : $Object2(value));
    }
  ) : false;
  return get;
}
var getProto$1;
var hasRequiredGetProto;
function requireGetProto() {
  if (hasRequiredGetProto) return getProto$1;
  hasRequiredGetProto = 1;
  var reflectGetProto = requireReflect_getPrototypeOf();
  var originalGetProto = requireObject_getPrototypeOf();
  var getDunderProto = requireGet();
  getProto$1 = reflectGetProto ? function getProto2(O) {
    return reflectGetProto(O);
  } : originalGetProto ? function getProto2(O) {
    if (!O || typeof O !== "object" && typeof O !== "function") {
      throw new TypeError("getProto: not an object");
    }
    return originalGetProto(O);
  } : getDunderProto ? function getProto2(O) {
    return getDunderProto(O);
  } : null;
  return getProto$1;
}
var call = Function.prototype.call;
var $hasOwn = Object.prototype.hasOwnProperty;
var bind$1 = functionBind;
var hasown = bind$1.call(call, $hasOwn);
var undefined$1;
var $Object = esObjectAtoms;
var $Error = esErrors;
var $EvalError = _eval;
var $RangeError = range;
var $ReferenceError = ref;
var $SyntaxError = syntax;
var $TypeError$1 = type;
var $URIError = uri;
var abs = abs$1;
var floor = floor$1;
var max = max$2;
var min = min$1;
var pow = pow$1;
var round = round$1;
var sign2 = sign$1;
var $Function = Function;
var getEvalledConstructor = function(expressionSyntax) {
  try {
    return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
  } catch (e) {
  }
};
var $gOPD = gopd;
var $defineProperty$1 = esDefineProperty;
var throwTypeError = function() {
  throw new $TypeError$1();
};
var ThrowTypeError = $gOPD ? function() {
  try {
    arguments.callee;
    return throwTypeError;
  } catch (calleeThrows) {
    try {
      return $gOPD(arguments, "callee").get;
    } catch (gOPDthrows) {
      return throwTypeError;
    }
  }
}() : throwTypeError;
var hasSymbols = requireHasSymbols()();
var getProto = requireGetProto();
var $ObjectGPO = requireObject_getPrototypeOf();
var $ReflectGPO = requireReflect_getPrototypeOf();
var $apply = requireFunctionApply();
var $call = requireFunctionCall();
var needsEval = {};
var TypedArray = typeof Uint8Array === "undefined" || !getProto ? undefined$1 : getProto(Uint8Array);
var INTRINSICS = {
  __proto__: null,
  "%AggregateError%": typeof AggregateError === "undefined" ? undefined$1 : AggregateError,
  "%Array%": Array,
  "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined$1 : ArrayBuffer,
  "%ArrayIteratorPrototype%": hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined$1,
  "%AsyncFromSyncIteratorPrototype%": undefined$1,
  "%AsyncFunction%": needsEval,
  "%AsyncGenerator%": needsEval,
  "%AsyncGeneratorFunction%": needsEval,
  "%AsyncIteratorPrototype%": needsEval,
  "%Atomics%": typeof Atomics === "undefined" ? undefined$1 : Atomics,
  "%BigInt%": typeof BigInt === "undefined" ? undefined$1 : BigInt,
  "%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined$1 : BigInt64Array,
  "%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined$1 : BigUint64Array,
  "%Boolean%": Boolean,
  "%DataView%": typeof DataView === "undefined" ? undefined$1 : DataView,
  "%Date%": Date,
  "%decodeURI%": decodeURI,
  "%decodeURIComponent%": decodeURIComponent,
  "%encodeURI%": encodeURI,
  "%encodeURIComponent%": encodeURIComponent,
  "%Error%": $Error,
  "%eval%": eval,
  // eslint-disable-line no-eval
  "%EvalError%": $EvalError,
  "%Float16Array%": typeof Float16Array === "undefined" ? undefined$1 : Float16Array,
  "%Float32Array%": typeof Float32Array === "undefined" ? undefined$1 : Float32Array,
  "%Float64Array%": typeof Float64Array === "undefined" ? undefined$1 : Float64Array,
  "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined$1 : FinalizationRegistry,
  "%Function%": $Function,
  "%GeneratorFunction%": needsEval,
  "%Int8Array%": typeof Int8Array === "undefined" ? undefined$1 : Int8Array,
  "%Int16Array%": typeof Int16Array === "undefined" ? undefined$1 : Int16Array,
  "%Int32Array%": typeof Int32Array === "undefined" ? undefined$1 : Int32Array,
  "%isFinite%": isFinite,
  "%isNaN%": isNaN,
  "%IteratorPrototype%": hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined$1,
  "%JSON%": typeof JSON === "object" ? JSON : undefined$1,
  "%Map%": typeof Map === "undefined" ? undefined$1 : Map,
  "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols || !getProto ? undefined$1 : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
  "%Math%": Math,
  "%Number%": Number,
  "%Object%": $Object,
  "%Object.getOwnPropertyDescriptor%": $gOPD,
  "%parseFloat%": parseFloat,
  "%parseInt%": parseInt,
  "%Promise%": typeof Promise === "undefined" ? undefined$1 : Promise,
  "%Proxy%": typeof Proxy === "undefined" ? undefined$1 : Proxy,
  "%RangeError%": $RangeError,
  "%ReferenceError%": $ReferenceError,
  "%Reflect%": typeof Reflect === "undefined" ? undefined$1 : Reflect,
  "%RegExp%": RegExp,
  "%Set%": typeof Set === "undefined" ? undefined$1 : Set,
  "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols || !getProto ? undefined$1 : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
  "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined$1 : SharedArrayBuffer,
  "%String%": String,
  "%StringIteratorPrototype%": hasSymbols && getProto ? getProto(""[Symbol.iterator]()) : undefined$1,
  "%Symbol%": hasSymbols ? Symbol : undefined$1,
  "%SyntaxError%": $SyntaxError,
  "%ThrowTypeError%": ThrowTypeError,
  "%TypedArray%": TypedArray,
  "%TypeError%": $TypeError$1,
  "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined$1 : Uint8Array,
  "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined$1 : Uint8ClampedArray,
  "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined$1 : Uint16Array,
  "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined$1 : Uint32Array,
  "%URIError%": $URIError,
  "%WeakMap%": typeof WeakMap === "undefined" ? undefined$1 : WeakMap,
  "%WeakRef%": typeof WeakRef === "undefined" ? undefined$1 : WeakRef,
  "%WeakSet%": typeof WeakSet === "undefined" ? undefined$1 : WeakSet,
  "%Function.prototype.call%": $call,
  "%Function.prototype.apply%": $apply,
  "%Object.defineProperty%": $defineProperty$1,
  "%Object.getPrototypeOf%": $ObjectGPO,
  "%Math.abs%": abs,
  "%Math.floor%": floor,
  "%Math.max%": max,
  "%Math.min%": min,
  "%Math.pow%": pow,
  "%Math.round%": round,
  "%Math.sign%": sign2,
  "%Reflect.getPrototypeOf%": $ReflectGPO
};
if (getProto) {
  try {
    null.error;
  } catch (e) {
    var errorProto = getProto(getProto(e));
    INTRINSICS["%Error.prototype%"] = errorProto;
  }
}
var doEval = function doEval2(name) {
  var value;
  if (name === "%AsyncFunction%") {
    value = getEvalledConstructor("async function () {}");
  } else if (name === "%GeneratorFunction%") {
    value = getEvalledConstructor("function* () {}");
  } else if (name === "%AsyncGeneratorFunction%") {
    value = getEvalledConstructor("async function* () {}");
  } else if (name === "%AsyncGenerator%") {
    var fn = doEval2("%AsyncGeneratorFunction%");
    if (fn) {
      value = fn.prototype;
    }
  } else if (name === "%AsyncIteratorPrototype%") {
    var gen = doEval2("%AsyncGenerator%");
    if (gen && getProto) {
      value = getProto(gen.prototype);
    }
  }
  INTRINSICS[name] = value;
  return value;
};
var LEGACY_ALIASES = {
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
};
var bind2 = functionBind;
var hasOwn$2 = hasown;
var $concat = bind2.call($call, Array.prototype.concat);
var $spliceApply = bind2.call($apply, Array.prototype.splice);
var $replace = bind2.call($call, String.prototype.replace);
var $strSlice = bind2.call($call, String.prototype.slice);
var $exec = bind2.call($call, RegExp.prototype.exec);
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g;
var stringToPath = function stringToPath2(string) {
  var first = $strSlice(string, 0, 1);
  var last = $strSlice(string, -1);
  if (first === "%" && last !== "%") {
    throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
  } else if (last === "%" && first !== "%") {
    throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
  }
  var result = [];
  $replace(string, rePropName, function(match, number, quote, subString) {
    result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
  });
  return result;
};
var getBaseIntrinsic = function getBaseIntrinsic2(name, allowMissing) {
  var intrinsicName = name;
  var alias;
  if (hasOwn$2(LEGACY_ALIASES, intrinsicName)) {
    alias = LEGACY_ALIASES[intrinsicName];
    intrinsicName = "%" + alias[0] + "%";
  }
  if (hasOwn$2(INTRINSICS, intrinsicName)) {
    var value = INTRINSICS[intrinsicName];
    if (value === needsEval) {
      value = doEval(intrinsicName);
    }
    if (typeof value === "undefined" && !allowMissing) {
      throw new $TypeError$1("intrinsic " + name + " exists, but is not available. Please file an issue!");
    }
    return {
      alias,
      name: intrinsicName,
      value
    };
  }
  throw new $SyntaxError("intrinsic " + name + " does not exist!");
};
var getIntrinsic = function GetIntrinsic(name, allowMissing) {
  if (typeof name !== "string" || name.length === 0) {
    throw new $TypeError$1("intrinsic name must be a non-empty string");
  }
  if (arguments.length > 1 && typeof allowMissing !== "boolean") {
    throw new $TypeError$1('"allowMissing" argument must be a boolean');
  }
  if ($exec(/^%?[^%]*%?$/, name) === null) {
    throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
  }
  var parts = stringToPath(name);
  var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
  var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
  var intrinsicRealName = intrinsic.name;
  var value = intrinsic.value;
  var skipFurtherCaching = false;
  var alias = intrinsic.alias;
  if (alias) {
    intrinsicBaseName = alias[0];
    $spliceApply(parts, $concat([0, 1], alias));
  }
  for (var i = 1, isOwn = true; i < parts.length; i += 1) {
    var part = parts[i];
    var first = $strSlice(part, 0, 1);
    var last = $strSlice(part, -1);
    if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
      throw new $SyntaxError("property names with quotes must have matching quotes");
    }
    if (part === "constructor" || !isOwn) {
      skipFurtherCaching = true;
    }
    intrinsicBaseName += "." + part;
    intrinsicRealName = "%" + intrinsicBaseName + "%";
    if (hasOwn$2(INTRINSICS, intrinsicRealName)) {
      value = INTRINSICS[intrinsicRealName];
    } else if (value != null) {
      if (!(part in value)) {
        if (!allowMissing) {
          throw new $TypeError$1("base intrinsic for " + name + " exists, but the property is not available.");
        }
        return void 0;
      }
      if ($gOPD && i + 1 >= parts.length) {
        var desc = $gOPD(value, part);
        isOwn = !!desc;
        if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
          value = desc.get;
        } else {
          value = value[part];
        }
      } else {
        isOwn = hasOwn$2(value, part);
        value = value[part];
      }
      if (isOwn && !skipFurtherCaching) {
        INTRINSICS[intrinsicRealName] = value;
      }
    }
  }
  return value;
};
var shams;
var hasRequiredShams;
function requireShams() {
  if (hasRequiredShams) return shams;
  hasRequiredShams = 1;
  var hasSymbols2 = requireShams$1();
  shams = function hasToStringTagShams() {
    return hasSymbols2() && !!Symbol.toStringTag;
  };
  return shams;
}
var GetIntrinsic2 = getIntrinsic;
var $defineProperty = GetIntrinsic2("%Object.defineProperty%", true);
var hasToStringTag = requireShams()();
var hasOwn$1 = hasown;
var $TypeError = type;
var toStringTag = hasToStringTag ? Symbol.toStringTag : null;
var esSetTostringtag = function setToStringTag(object, value) {
  var overrideIfSet = arguments.length > 2 && !!arguments[2] && arguments[2].force;
  var nonConfigurable = arguments.length > 2 && !!arguments[2] && arguments[2].nonConfigurable;
  if (typeof overrideIfSet !== "undefined" && typeof overrideIfSet !== "boolean" || typeof nonConfigurable !== "undefined" && typeof nonConfigurable !== "boolean") {
    throw new $TypeError("if provided, the `overrideIfSet` and `nonConfigurable` options must be booleans");
  }
  if (toStringTag && (overrideIfSet || !hasOwn$1(object, toStringTag))) {
    if ($defineProperty) {
      $defineProperty(object, toStringTag, {
        configurable: !nonConfigurable,
        enumerable: false,
        value,
        writable: false
      });
    } else {
      object[toStringTag] = value;
    }
  }
};
var populate$1 = function(dst, src2) {
  Object.keys(src2).forEach(function(prop) {
    dst[prop] = dst[prop] || src2[prop];
  });
  return dst;
};
var CombinedStream = combined_stream;
var util$1 = require$$1;
var path = require$$1$1;
var http$1 = http__default;
var https$1 = https$2;
var parseUrl$2 = require$$5.parse;
var fs = require$$6;
var Stream = stream$1.Stream;
var crypto = require$$8;
var mime = mimeTypes;
var asynckit = asynckit$1;
var setToStringTag2 = esSetTostringtag;
var hasOwn = hasown;
var populate = populate$1;
function FormData$2(options) {
  if (!(this instanceof FormData$2)) {
    return new FormData$2(options);
  }
  this._overheadLength = 0;
  this._valueLength = 0;
  this._valuesToMeasure = [];
  CombinedStream.call(this);
  options = options || {};
  for (var option in options) {
    this[option] = options[option];
  }
}
util$1.inherits(FormData$2, CombinedStream);
FormData$2.LINE_BREAK = "\r\n";
FormData$2.DEFAULT_CONTENT_TYPE = "application/octet-stream";
FormData$2.prototype.append = function(field, value, options) {
  options = options || {};
  if (typeof options === "string") {
    options = { filename: options };
  }
  var append2 = CombinedStream.prototype.append.bind(this);
  if (typeof value === "number" || value == null) {
    value = String(value);
  }
  if (Array.isArray(value)) {
    this._error(new Error("Arrays are not supported."));
    return;
  }
  var header = this._multiPartHeader(field, value, options);
  var footer = this._multiPartFooter();
  append2(header);
  append2(value);
  append2(footer);
  this._trackLength(header, value, options);
};
FormData$2.prototype._trackLength = function(header, value, options) {
  var valueLength = 0;
  if (options.knownLength != null) {
    valueLength += Number(options.knownLength);
  } else if (Buffer.isBuffer(value)) {
    valueLength = value.length;
  } else if (typeof value === "string") {
    valueLength = Buffer.byteLength(value);
  }
  this._valueLength += valueLength;
  this._overheadLength += Buffer.byteLength(header) + FormData$2.LINE_BREAK.length;
  if (!value || !value.path && !(value.readable && hasOwn(value, "httpVersion")) && !(value instanceof Stream)) {
    return;
  }
  if (!options.knownLength) {
    this._valuesToMeasure.push(value);
  }
};
FormData$2.prototype._lengthRetriever = function(value, callback) {
  if (hasOwn(value, "fd")) {
    if (value.end != void 0 && value.end != Infinity && value.start != void 0) {
      callback(null, value.end + 1 - (value.start ? value.start : 0));
    } else {
      fs.stat(value.path, function(err, stat) {
        if (err) {
          callback(err);
          return;
        }
        var fileSize = stat.size - (value.start ? value.start : 0);
        callback(null, fileSize);
      });
    }
  } else if (hasOwn(value, "httpVersion")) {
    callback(null, Number(value.headers["content-length"]));
  } else if (hasOwn(value, "httpModule")) {
    value.on("response", function(response) {
      value.pause();
      callback(null, Number(response.headers["content-length"]));
    });
    value.resume();
  } else {
    callback("Unknown stream");
  }
};
FormData$2.prototype._multiPartHeader = function(field, value, options) {
  if (typeof options.header === "string") {
    return options.header;
  }
  var contentDisposition = this._getContentDisposition(value, options);
  var contentType = this._getContentType(value, options);
  var contents = "";
  var headers = {
    // add custom disposition as third element or keep it two elements if not
    "Content-Disposition": ["form-data", 'name="' + field + '"'].concat(contentDisposition || []),
    // if no content type. allow it to be empty array
    "Content-Type": [].concat(contentType || [])
  };
  if (typeof options.header === "object") {
    populate(headers, options.header);
  }
  var header;
  for (var prop in headers) {
    if (hasOwn(headers, prop)) {
      header = headers[prop];
      if (header == null) {
        continue;
      }
      if (!Array.isArray(header)) {
        header = [header];
      }
      if (header.length) {
        contents += prop + ": " + header.join("; ") + FormData$2.LINE_BREAK;
      }
    }
  }
  return "--" + this.getBoundary() + FormData$2.LINE_BREAK + contents + FormData$2.LINE_BREAK;
};
FormData$2.prototype._getContentDisposition = function(value, options) {
  var filename;
  if (typeof options.filepath === "string") {
    filename = path.normalize(options.filepath).replace(/\\/g, "/");
  } else if (options.filename || value && (value.name || value.path)) {
    filename = path.basename(options.filename || value && (value.name || value.path));
  } else if (value && value.readable && hasOwn(value, "httpVersion")) {
    filename = path.basename(value.client._httpMessage.path || "");
  }
  if (filename) {
    return 'filename="' + filename + '"';
  }
};
FormData$2.prototype._getContentType = function(value, options) {
  var contentType = options.contentType;
  if (!contentType && value && value.name) {
    contentType = mime.lookup(value.name);
  }
  if (!contentType && value && value.path) {
    contentType = mime.lookup(value.path);
  }
  if (!contentType && value && value.readable && hasOwn(value, "httpVersion")) {
    contentType = value.headers["content-type"];
  }
  if (!contentType && (options.filepath || options.filename)) {
    contentType = mime.lookup(options.filepath || options.filename);
  }
  if (!contentType && value && typeof value === "object") {
    contentType = FormData$2.DEFAULT_CONTENT_TYPE;
  }
  return contentType;
};
FormData$2.prototype._multiPartFooter = function() {
  return (function(next) {
    var footer = FormData$2.LINE_BREAK;
    var lastPart = this._streams.length === 0;
    if (lastPart) {
      footer += this._lastBoundary();
    }
    next(footer);
  }).bind(this);
};
FormData$2.prototype._lastBoundary = function() {
  return "--" + this.getBoundary() + "--" + FormData$2.LINE_BREAK;
};
FormData$2.prototype.getHeaders = function(userHeaders) {
  var header;
  var formHeaders = {
    "content-type": "multipart/form-data; boundary=" + this.getBoundary()
  };
  for (header in userHeaders) {
    if (hasOwn(userHeaders, header)) {
      formHeaders[header.toLowerCase()] = userHeaders[header];
    }
  }
  return formHeaders;
};
FormData$2.prototype.setBoundary = function(boundary) {
  if (typeof boundary !== "string") {
    throw new TypeError("FormData boundary must be a string");
  }
  this._boundary = boundary;
};
FormData$2.prototype.getBoundary = function() {
  if (!this._boundary) {
    this._generateBoundary();
  }
  return this._boundary;
};
FormData$2.prototype.getBuffer = function() {
  var dataBuffer = new Buffer.alloc(0);
  var boundary = this.getBoundary();
  for (var i = 0, len = this._streams.length; i < len; i++) {
    if (typeof this._streams[i] !== "function") {
      if (Buffer.isBuffer(this._streams[i])) {
        dataBuffer = Buffer.concat([dataBuffer, this._streams[i]]);
      } else {
        dataBuffer = Buffer.concat([dataBuffer, Buffer.from(this._streams[i])]);
      }
      if (typeof this._streams[i] !== "string" || this._streams[i].substring(2, boundary.length + 2) !== boundary) {
        dataBuffer = Buffer.concat([dataBuffer, Buffer.from(FormData$2.LINE_BREAK)]);
      }
    }
  }
  return Buffer.concat([dataBuffer, Buffer.from(this._lastBoundary())]);
};
FormData$2.prototype._generateBoundary = function() {
  this._boundary = "--------------------------" + crypto.randomBytes(12).toString("hex");
};
FormData$2.prototype.getLengthSync = function() {
  var knownLength = this._overheadLength + this._valueLength;
  if (this._streams.length) {
    knownLength += this._lastBoundary().length;
  }
  if (!this.hasKnownLength()) {
    this._error(new Error("Cannot calculate proper length in synchronous way."));
  }
  return knownLength;
};
FormData$2.prototype.hasKnownLength = function() {
  var hasKnownLength = true;
  if (this._valuesToMeasure.length) {
    hasKnownLength = false;
  }
  return hasKnownLength;
};
FormData$2.prototype.getLength = function(cb) {
  var knownLength = this._overheadLength + this._valueLength;
  if (this._streams.length) {
    knownLength += this._lastBoundary().length;
  }
  if (!this._valuesToMeasure.length) {
    process.nextTick(cb.bind(this, null, knownLength));
    return;
  }
  asynckit.parallel(this._valuesToMeasure, this._lengthRetriever, function(err, values) {
    if (err) {
      cb(err);
      return;
    }
    values.forEach(function(length) {
      knownLength += length;
    });
    cb(null, knownLength);
  });
};
FormData$2.prototype.submit = function(params, cb) {
  var request;
  var options;
  var defaults2 = { method: "post" };
  if (typeof params === "string") {
    params = parseUrl$2(params);
    options = populate({
      port: params.port,
      path: params.pathname,
      host: params.hostname,
      protocol: params.protocol
    }, defaults2);
  } else {
    options = populate(params, defaults2);
    if (!options.port) {
      options.port = options.protocol === "https:" ? 443 : 80;
    }
  }
  options.headers = this.getHeaders(params.headers);
  if (options.protocol === "https:") {
    request = https$1.request(options);
  } else {
    request = http$1.request(options);
  }
  this.getLength((function(err, length) {
    if (err && err !== "Unknown stream") {
      this._error(err);
      return;
    }
    if (length) {
      request.setHeader("Content-Length", length);
    }
    this.pipe(request);
    if (cb) {
      var onResponse;
      var callback = function(error, responce) {
        request.removeListener("error", callback);
        request.removeListener("response", onResponse);
        return cb.call(this, error, responce);
      };
      onResponse = callback.bind(this, null);
      request.on("error", callback);
      request.on("response", onResponse);
    }
  }).bind(this));
  return request;
};
FormData$2.prototype._error = function(err) {
  if (!this.error) {
    this.error = err;
    this.pause();
    this.emit("error", err);
  }
};
FormData$2.prototype.toString = function() {
  return "[object FormData]";
};
setToStringTag2(FormData$2.prototype, "FormData");
var form_data = FormData$2;
const FormData$1 = /* @__PURE__ */ getDefaultExportFromCjs(form_data);
function isVisitable(thing) {
  return utils$2.isPlainObject(thing) || utils$2.isArray(thing);
}
function removeBrackets(key) {
  return utils$2.endsWith(key, "[]") ? key.slice(0, -2) : key;
}
function renderKey(path2, key, dots) {
  if (!path2) return key;
  return path2.concat(key).map(function each(token, i) {
    token = removeBrackets(token);
    return !dots && i ? "[" + token + "]" : token;
  }).join(dots ? "." : "");
}
function isFlatArray(arr) {
  return utils$2.isArray(arr) && !arr.some(isVisitable);
}
const predicates = utils$2.toFlatObject(utils$2, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});
function toFormData$1(obj, formData, options) {
  if (!utils$2.isObject(obj)) {
    throw new TypeError("target must be an object");
  }
  formData = formData || new (FormData$1 || FormData)();
  options = utils$2.toFlatObject(
    options,
    {
      metaTokens: true,
      dots: false,
      indexes: false
    },
    false,
    function defined(option, source) {
      return !utils$2.isUndefined(source[option]);
    }
  );
  const metaTokens = options.metaTokens;
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
  const maxDepth = options.maxDepth === void 0 ? 100 : options.maxDepth;
  const useBlob = _Blob && utils$2.isSpecCompliantForm(formData);
  if (!utils$2.isFunction(visitor)) {
    throw new TypeError("visitor must be a function");
  }
  function convertValue(value) {
    if (value === null) return "";
    if (utils$2.isDate(value)) {
      return value.toISOString();
    }
    if (utils$2.isBoolean(value)) {
      return value.toString();
    }
    if (!useBlob && utils$2.isBlob(value)) {
      throw new AxiosError$1("Blob is not supported. Use a Buffer instead.");
    }
    if (utils$2.isArrayBuffer(value) || utils$2.isTypedArray(value)) {
      return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
    }
    return value;
  }
  function defaultVisitor(value, key, path2) {
    let arr = value;
    if (utils$2.isReactNative(formData) && utils$2.isReactNativeBlob(value)) {
      formData.append(renderKey(path2, key, dots), convertValue(value));
      return false;
    }
    if (value && !path2 && typeof value === "object") {
      if (utils$2.endsWith(key, "{}")) {
        key = metaTokens ? key : key.slice(0, -2);
        value = JSON.stringify(value);
      } else if (utils$2.isArray(value) && isFlatArray(value) || (utils$2.isFileList(value) || utils$2.endsWith(key, "[]")) && (arr = utils$2.toArray(value))) {
        key = removeBrackets(key);
        arr.forEach(function each(el, index) {
          !(utils$2.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]",
            convertValue(el)
          );
        });
        return false;
      }
    }
    if (isVisitable(value)) {
      return true;
    }
    formData.append(renderKey(path2, key, dots), convertValue(value));
    return false;
  }
  const stack = [];
  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });
  function build2(value, path2, depth = 0) {
    if (utils$2.isUndefined(value)) return;
    if (depth > maxDepth) {
      throw new AxiosError$1(
        "Object is too deeply nested (" + depth + " levels). Max depth: " + maxDepth,
        AxiosError$1.ERR_FORM_DATA_DEPTH_EXCEEDED
      );
    }
    if (stack.indexOf(value) !== -1) {
      throw Error("Circular reference detected in " + path2.join("."));
    }
    stack.push(value);
    utils$2.forEach(value, function each(el, key) {
      const result = !(utils$2.isUndefined(el) || el === null) && visitor.call(formData, el, utils$2.isString(key) ? key.trim() : key, path2, exposedHelpers);
      if (result === true) {
        build2(el, path2 ? path2.concat(key) : [key], depth + 1);
      }
    });
    stack.pop();
  }
  if (!utils$2.isObject(obj)) {
    throw new TypeError("data must be an object");
  }
  build2(obj);
  return formData;
}
function encode$1(str) {
  const charMap = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+"
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20/g, function replacer(match) {
    return charMap[match];
  });
}
function AxiosURLSearchParams(params, options) {
  this._pairs = [];
  params && toFormData$1(params, this, options);
}
const prototype = AxiosURLSearchParams.prototype;
prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};
prototype.toString = function toString2(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode$1);
  } : encode$1;
  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + "=" + _encode(pair[1]);
  }, "").join("&");
};
function encode(val) {
  return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
}
function buildURL(url2, params, options) {
  if (!params) {
    return url2;
  }
  const _encode = options && options.encode || encode;
  const _options = utils$2.isFunction(options) ? {
    serialize: options
  } : options;
  const serializeFn = _options && _options.serialize;
  let serializedParams;
  if (serializeFn) {
    serializedParams = serializeFn(params, _options);
  } else {
    serializedParams = utils$2.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams(params, _options).toString(_encode);
  }
  if (serializedParams) {
    const hashmarkIndex = url2.indexOf("#");
    if (hashmarkIndex !== -1) {
      url2 = url2.slice(0, hashmarkIndex);
    }
    url2 += (url2.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }
  return url2;
}
class InterceptorManager {
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
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {void}
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
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
  forEach(fn) {
    utils$2.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}
const transitionalDefaults = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false,
  legacyInterceptorReqResOrdering: true
};
const URLSearchParams$1 = require$$5.URLSearchParams;
const ALPHA = "abcdefghijklmnopqrstuvwxyz";
const DIGIT = "0123456789";
const ALPHABET = {
  DIGIT,
  ALPHA,
  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
};
const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
  let str = "";
  const { length } = alphabet;
  const randomValues = new Uint32Array(size);
  require$$8.randomFillSync(randomValues);
  for (let i = 0; i < size; i++) {
    str += alphabet[randomValues[i] % length];
  }
  return str;
};
const platform$1 = {
  isNode: true,
  classes: {
    URLSearchParams: URLSearchParams$1,
    FormData: FormData$1,
    Blob: typeof Blob !== "undefined" && Blob || null
  },
  ALPHABET,
  generateString,
  protocols: ["http", "https", "file", "data"]
};
const hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
const _navigator = typeof navigator === "object" && navigator || void 0;
const hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || ["ReactNative", "NativeScript", "NS"].indexOf(_navigator.product) < 0);
const hasStandardBrowserWebWorkerEnv = (() => {
  return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
  self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
})();
const origin = hasBrowserEnv && window.location.href || "http://localhost";
const utils$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  hasBrowserEnv,
  hasStandardBrowserEnv,
  hasStandardBrowserWebWorkerEnv,
  navigator: _navigator,
  origin
}, Symbol.toStringTag, { value: "Module" }));
const platform = {
  ...utils$1,
  ...platform$1
};
function toURLEncodedForm(data, options) {
  return toFormData$1(data, new platform.classes.URLSearchParams(), {
    visitor: function(value, key, path2, helpers2) {
      if (platform.isNode && utils$2.isBuffer(value)) {
        this.append(key, value.toString("base64"));
        return false;
      }
      return helpers2.defaultVisitor.apply(this, arguments);
    },
    ...options
  });
}
function parsePropPath(name) {
  return utils$2.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
    return match[0] === "[]" ? "" : match[1] || match[0];
  });
}
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}
function formDataToJSON(formData) {
  function buildPath(path2, value, target, index) {
    let name = path2[index++];
    if (name === "__proto__") return true;
    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path2.length;
    name = !name && utils$2.isArray(target) ? target.length : name;
    if (isLast) {
      if (utils$2.hasOwnProp(target, name)) {
        target[name] = utils$2.isArray(target[name]) ? target[name].concat(value) : [target[name], value];
      } else {
        target[name] = value;
      }
      return !isNumericKey;
    }
    if (!target[name] || !utils$2.isObject(target[name])) {
      target[name] = [];
    }
    const result = buildPath(path2, value, target[name], index);
    if (result && utils$2.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }
    return !isNumericKey;
  }
  if (utils$2.isFormData(formData) && utils$2.isFunction(formData.entries)) {
    const obj = {};
    utils$2.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });
    return obj;
  }
  return null;
}
const own = (obj, key) => obj != null && utils$2.hasOwnProp(obj, key) ? obj[key] : void 0;
function stringifySafely(rawValue, parser, encoder) {
  if (utils$2.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils$2.trim(rawValue);
    } catch (e) {
      if (e.name !== "SyntaxError") {
        throw e;
      }
    }
  }
  return (encoder || JSON.stringify)(rawValue);
}
const defaults = {
  transitional: transitionalDefaults,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [
    function transformRequest(data, headers) {
      const contentType = headers.getContentType() || "";
      const hasJSONContentType = contentType.indexOf("application/json") > -1;
      const isObjectPayload = utils$2.isObject(data);
      if (isObjectPayload && utils$2.isHTMLForm(data)) {
        data = new FormData(data);
      }
      const isFormData2 = utils$2.isFormData(data);
      if (isFormData2) {
        return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
      }
      if (utils$2.isArrayBuffer(data) || utils$2.isBuffer(data) || utils$2.isStream(data) || utils$2.isFile(data) || utils$2.isBlob(data) || utils$2.isReadableStream(data)) {
        return data;
      }
      if (utils$2.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils$2.isURLSearchParams(data)) {
        headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
        return data.toString();
      }
      let isFileList2;
      if (isObjectPayload) {
        const formSerializer = own(this, "formSerializer");
        if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
          return toURLEncodedForm(data, formSerializer).toString();
        }
        if ((isFileList2 = utils$2.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
          const env = own(this, "env");
          const _FormData = env && env.FormData;
          return toFormData$1(
            isFileList2 ? { "files[]": data } : data,
            _FormData && new _FormData(),
            formSerializer
          );
        }
      }
      if (isObjectPayload || hasJSONContentType) {
        headers.setContentType("application/json", false);
        return stringifySafely(data);
      }
      return data;
    }
  ],
  transformResponse: [
    function transformResponse(data) {
      const transitional2 = own(this, "transitional") || defaults.transitional;
      const forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
      const responseType = own(this, "responseType");
      const JSONRequested = responseType === "json";
      if (utils$2.isResponse(data) || utils$2.isReadableStream(data)) {
        return data;
      }
      if (data && utils$2.isString(data) && (forcedJSONParsing && !responseType || JSONRequested)) {
        const silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
        const strictJSONParsing = !silentJSONParsing && JSONRequested;
        try {
          return JSON.parse(data, own(this, "parseReviver"));
        } catch (e) {
          if (strictJSONParsing) {
            if (e.name === "SyntaxError") {
              throw AxiosError$1.from(e, AxiosError$1.ERR_BAD_RESPONSE, this, null, own(this, "response"));
            }
            throw e;
          }
        }
      }
      return data;
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
    FormData: platform.classes.FormData,
    Blob: platform.classes.Blob
  },
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": void 0
    }
  }
};
utils$2.forEach(["delete", "get", "head", "post", "put", "patch", "query"], (method) => {
  defaults.headers[method] = {};
});
function transformData(fns, response) {
  const config = this || defaults;
  const context = response || config;
  const headers = AxiosHeaders$1.from(context.headers);
  let data = context.data;
  utils$2.forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : void 0);
  });
  headers.normalize();
  return data;
}
function isCancel$1(value) {
  return !!(value && value.__CANCEL__);
}
let CanceledError$1 = class CanceledError extends AxiosError$1 {
  /**
   * A `CanceledError` is an object that is thrown when an operation is canceled.
   *
   * @param {string=} message The message.
   * @param {Object=} config The config.
   * @param {Object=} request The request.
   *
   * @returns {CanceledError} The created error.
   */
  constructor(message, config, request) {
    super(message == null ? "canceled" : message, AxiosError$1.ERR_CANCELED, config, request);
    this.name = "CanceledError";
    this.__CANCEL__ = true;
  }
};
function settle(resolve2, reject, response) {
  const validateStatus2 = response.config.validateStatus;
  if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
    resolve2(response);
  } else {
    reject(new AxiosError$1(
      "Request failed with status code " + response.status,
      response.status >= 400 && response.status < 500 ? AxiosError$1.ERR_BAD_REQUEST : AxiosError$1.ERR_BAD_RESPONSE,
      response.config,
      response.request,
      response
    ));
  }
}
function isAbsoluteURL(url2) {
  if (typeof url2 !== "string") {
    return false;
  }
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url2);
}
function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
}
function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
  let isRelativeUrl = !isAbsoluteURL(requestedURL);
  if (baseURL && (isRelativeUrl || allowAbsoluteUrls === false)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}
var DEFAULT_PORTS$1 = {
  ftp: 21,
  gopher: 70,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443
};
function parseUrl$1(urlString) {
  try {
    return new URL(urlString);
  } catch {
    return null;
  }
}
function getProxyForUrl(url2) {
  var parsedUrl = (typeof url2 === "string" ? parseUrl$1(url2) : url2) || {};
  var proto = parsedUrl.protocol;
  var hostname = parsedUrl.host;
  var port = parsedUrl.port;
  if (typeof hostname !== "string" || !hostname || typeof proto !== "string") {
    return "";
  }
  proto = proto.split(":", 1)[0];
  hostname = hostname.replace(/:\d*$/, "");
  port = parseInt(port) || DEFAULT_PORTS$1[proto] || 0;
  if (!shouldProxy(hostname, port)) {
    return "";
  }
  var proxy = getEnv(proto + "_proxy") || getEnv("all_proxy");
  if (proxy && proxy.indexOf("://") === -1) {
    proxy = proto + "://" + proxy;
  }
  return proxy;
}
function shouldProxy(hostname, port) {
  var NO_PROXY = getEnv("no_proxy").toLowerCase();
  if (!NO_PROXY) {
    return true;
  }
  if (NO_PROXY === "*") {
    return false;
  }
  return NO_PROXY.split(/[,\s]/).every(function(proxy) {
    if (!proxy) {
      return true;
    }
    var parsedProxy = proxy.match(/^(.+):(\d+)$/);
    var parsedProxyHostname = parsedProxy ? parsedProxy[1] : proxy;
    var parsedProxyPort = parsedProxy ? parseInt(parsedProxy[2]) : 0;
    if (parsedProxyPort && parsedProxyPort !== port) {
      return true;
    }
    if (!/^[.*]/.test(parsedProxyHostname)) {
      return hostname !== parsedProxyHostname;
    }
    if (parsedProxyHostname.charAt(0) === "*") {
      parsedProxyHostname = parsedProxyHostname.slice(1);
    }
    return !hostname.endsWith(parsedProxyHostname);
  });
}
function getEnv(key) {
  return process.env[key.toLowerCase()] || process.env[key.toUpperCase()] || "";
}
var followRedirects$1 = { exports: {} };
var src = { exports: {} };
var browser = { exports: {} };
var ms;
var hasRequiredMs;
function requireMs() {
  if (hasRequiredMs) return ms;
  hasRequiredMs = 1;
  var s = 1e3;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var w = d * 7;
  var y = d * 365.25;
  ms = function(val, options) {
    options = options || {};
    var type2 = typeof val;
    if (type2 === "string" && val.length > 0) {
      return parse(val);
    } else if (type2 === "number" && isFinite(val)) {
      return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
    );
  };
  function parse(str) {
    str = String(str);
    if (str.length > 100) {
      return;
    }
    var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
      str
    );
    if (!match) {
      return;
    }
    var n = parseFloat(match[1]);
    var type2 = (match[2] || "ms").toLowerCase();
    switch (type2) {
      case "years":
      case "year":
      case "yrs":
      case "yr":
      case "y":
        return n * y;
      case "weeks":
      case "week":
      case "w":
        return n * w;
      case "days":
      case "day":
      case "d":
        return n * d;
      case "hours":
      case "hour":
      case "hrs":
      case "hr":
      case "h":
        return n * h;
      case "minutes":
      case "minute":
      case "mins":
      case "min":
      case "m":
        return n * m;
      case "seconds":
      case "second":
      case "secs":
      case "sec":
      case "s":
        return n * s;
      case "milliseconds":
      case "millisecond":
      case "msecs":
      case "msec":
      case "ms":
        return n;
      default:
        return void 0;
    }
  }
  function fmtShort(ms2) {
    var msAbs = Math.abs(ms2);
    if (msAbs >= d) {
      return Math.round(ms2 / d) + "d";
    }
    if (msAbs >= h) {
      return Math.round(ms2 / h) + "h";
    }
    if (msAbs >= m) {
      return Math.round(ms2 / m) + "m";
    }
    if (msAbs >= s) {
      return Math.round(ms2 / s) + "s";
    }
    return ms2 + "ms";
  }
  function fmtLong(ms2) {
    var msAbs = Math.abs(ms2);
    if (msAbs >= d) {
      return plural(ms2, msAbs, d, "day");
    }
    if (msAbs >= h) {
      return plural(ms2, msAbs, h, "hour");
    }
    if (msAbs >= m) {
      return plural(ms2, msAbs, m, "minute");
    }
    if (msAbs >= s) {
      return plural(ms2, msAbs, s, "second");
    }
    return ms2 + " ms";
  }
  function plural(ms2, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms2 / n) + " " + name + (isPlural ? "s" : "");
  }
  return ms;
}
var common$3;
var hasRequiredCommon;
function requireCommon() {
  if (hasRequiredCommon) return common$3;
  hasRequiredCommon = 1;
  function setup(env) {
    createDebug2.debug = createDebug2;
    createDebug2.default = createDebug2;
    createDebug2.coerce = coerce;
    createDebug2.disable = disable;
    createDebug2.enable = enable;
    createDebug2.enabled = enabled;
    createDebug2.humanize = requireMs();
    createDebug2.destroy = destroy2;
    Object.keys(env).forEach((key) => {
      createDebug2[key] = env[key];
    });
    createDebug2.names = [];
    createDebug2.skips = [];
    createDebug2.formatters = {};
    function selectColor(namespace) {
      let hash = 0;
      for (let i = 0; i < namespace.length; i++) {
        hash = (hash << 5) - hash + namespace.charCodeAt(i);
        hash |= 0;
      }
      return createDebug2.colors[Math.abs(hash) % createDebug2.colors.length];
    }
    createDebug2.selectColor = selectColor;
    function createDebug2(namespace) {
      let prevTime;
      let enableOverride = null;
      let namespacesCache;
      let enabledCache;
      function debug2(...args) {
        if (!debug2.enabled) {
          return;
        }
        const self2 = debug2;
        const curr = Number(/* @__PURE__ */ new Date());
        const ms2 = curr - (prevTime || curr);
        self2.diff = ms2;
        self2.prev = prevTime;
        self2.curr = curr;
        prevTime = curr;
        args[0] = createDebug2.coerce(args[0]);
        if (typeof args[0] !== "string") {
          args.unshift("%O");
        }
        let index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
          if (match === "%%") {
            return "%";
          }
          index++;
          const formatter = createDebug2.formatters[format];
          if (typeof formatter === "function") {
            const val = args[index];
            match = formatter.call(self2, val);
            args.splice(index, 1);
            index--;
          }
          return match;
        });
        createDebug2.formatArgs.call(self2, args);
        const logFn = self2.log || createDebug2.log;
        logFn.apply(self2, args);
      }
      debug2.namespace = namespace;
      debug2.useColors = createDebug2.useColors();
      debug2.color = createDebug2.selectColor(namespace);
      debug2.extend = extend2;
      debug2.destroy = createDebug2.destroy;
      Object.defineProperty(debug2, "enabled", {
        enumerable: true,
        configurable: false,
        get: () => {
          if (enableOverride !== null) {
            return enableOverride;
          }
          if (namespacesCache !== createDebug2.namespaces) {
            namespacesCache = createDebug2.namespaces;
            enabledCache = createDebug2.enabled(namespace);
          }
          return enabledCache;
        },
        set: (v) => {
          enableOverride = v;
        }
      });
      if (typeof createDebug2.init === "function") {
        createDebug2.init(debug2);
      }
      return debug2;
    }
    function extend2(namespace, delimiter) {
      const newDebug = createDebug2(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
      newDebug.log = this.log;
      return newDebug;
    }
    function enable(namespaces) {
      createDebug2.save(namespaces);
      createDebug2.namespaces = namespaces;
      createDebug2.names = [];
      createDebug2.skips = [];
      const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const ns of split) {
        if (ns[0] === "-") {
          createDebug2.skips.push(ns.slice(1));
        } else {
          createDebug2.names.push(ns);
        }
      }
    }
    function matchesTemplate(search, template) {
      let searchIndex = 0;
      let templateIndex = 0;
      let starIndex = -1;
      let matchIndex = 0;
      while (searchIndex < search.length) {
        if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
          if (template[templateIndex] === "*") {
            starIndex = templateIndex;
            matchIndex = searchIndex;
            templateIndex++;
          } else {
            searchIndex++;
            templateIndex++;
          }
        } else if (starIndex !== -1) {
          templateIndex = starIndex + 1;
          matchIndex++;
          searchIndex = matchIndex;
        } else {
          return false;
        }
      }
      while (templateIndex < template.length && template[templateIndex] === "*") {
        templateIndex++;
      }
      return templateIndex === template.length;
    }
    function disable() {
      const namespaces = [
        ...createDebug2.names,
        ...createDebug2.skips.map((namespace) => "-" + namespace)
      ].join(",");
      createDebug2.enable("");
      return namespaces;
    }
    function enabled(name) {
      for (const skip of createDebug2.skips) {
        if (matchesTemplate(name, skip)) {
          return false;
        }
      }
      for (const ns of createDebug2.names) {
        if (matchesTemplate(name, ns)) {
          return true;
        }
      }
      return false;
    }
    function coerce(val) {
      if (val instanceof Error) {
        return val.stack || val.message;
      }
      return val;
    }
    function destroy2() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    createDebug2.enable(createDebug2.load());
    return createDebug2;
  }
  common$3 = setup;
  return common$3;
}
var hasRequiredBrowser;
function requireBrowser() {
  if (hasRequiredBrowser) return browser.exports;
  hasRequiredBrowser = 1;
  (function(module, exports) {
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports.colors = [
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
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      let m;
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports.storage.getItem("debug") || exports.storage.getItem("DEBUG");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module.exports = requireCommon()(exports);
    const { formatters } = module.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  })(browser, browser.exports);
  return browser.exports;
}
var node = { exports: {} };
var hasFlag;
var hasRequiredHasFlag;
function requireHasFlag() {
  if (hasRequiredHasFlag) return hasFlag;
  hasRequiredHasFlag = 1;
  hasFlag = (flag, argv = process.argv) => {
    const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
    const position = argv.indexOf(prefix + flag);
    const terminatorPosition = argv.indexOf("--");
    return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
  };
  return hasFlag;
}
var supportsColor_1;
var hasRequiredSupportsColor;
function requireSupportsColor() {
  if (hasRequiredSupportsColor) return supportsColor_1;
  hasRequiredSupportsColor = 1;
  const os = require$$0$1;
  const tty = require$$1$2;
  const hasFlag2 = requireHasFlag();
  const { env } = process;
  let forceColor;
  if (hasFlag2("no-color") || hasFlag2("no-colors") || hasFlag2("color=false") || hasFlag2("color=never")) {
    forceColor = 0;
  } else if (hasFlag2("color") || hasFlag2("colors") || hasFlag2("color=true") || hasFlag2("color=always")) {
    forceColor = 1;
  }
  if ("FORCE_COLOR" in env) {
    if (env.FORCE_COLOR === "true") {
      forceColor = 1;
    } else if (env.FORCE_COLOR === "false") {
      forceColor = 0;
    } else {
      forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
    }
  }
  function translateLevel(level) {
    if (level === 0) {
      return false;
    }
    return {
      level,
      hasBasic: true,
      has256: level >= 2,
      has16m: level >= 3
    };
  }
  function supportsColor(haveStream, streamIsTTY) {
    if (forceColor === 0) {
      return 0;
    }
    if (hasFlag2("color=16m") || hasFlag2("color=full") || hasFlag2("color=truecolor")) {
      return 3;
    }
    if (hasFlag2("color=256")) {
      return 2;
    }
    if (haveStream && !streamIsTTY && forceColor === void 0) {
      return 0;
    }
    const min2 = forceColor || 0;
    if (env.TERM === "dumb") {
      return min2;
    }
    if (process.platform === "win32") {
      const osRelease = os.release().split(".");
      if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
        return Number(osRelease[2]) >= 14931 ? 3 : 2;
      }
      return 1;
    }
    if ("CI" in env) {
      if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((sign3) => sign3 in env) || env.CI_NAME === "codeship") {
        return 1;
      }
      return min2;
    }
    if ("TEAMCITY_VERSION" in env) {
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
    }
    if (env.COLORTERM === "truecolor") {
      return 3;
    }
    if ("TERM_PROGRAM" in env) {
      const version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (env.TERM_PROGRAM) {
        case "iTerm.app":
          return version >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    if (/-256(color)?$/i.test(env.TERM)) {
      return 2;
    }
    if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
      return 1;
    }
    if ("COLORTERM" in env) {
      return 1;
    }
    return min2;
  }
  function getSupportLevel(stream2) {
    const level = supportsColor(stream2, stream2 && stream2.isTTY);
    return translateLevel(level);
  }
  supportsColor_1 = {
    supportsColor: getSupportLevel,
    stdout: translateLevel(supportsColor(true, tty.isatty(1))),
    stderr: translateLevel(supportsColor(true, tty.isatty(2)))
  };
  return supportsColor_1;
}
var hasRequiredNode;
function requireNode() {
  if (hasRequiredNode) return node.exports;
  hasRequiredNode = 1;
  (function(module, exports) {
    const tty = require$$1$2;
    const util2 = require$$1;
    exports.init = init;
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.destroy = util2.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    );
    exports.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = requireSupportsColor();
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports.colors = [
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
        ];
      }
    } catch (error) {
    }
    exports.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports.inspectOpts.hideDate) {
        return "";
      }
      return (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(util2.formatWithOptions(exports.inspectOpts, ...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug2) {
      debug2.inspectOpts = {};
      const keys = Object.keys(exports.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug2.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
      }
    }
    module.exports = requireCommon()(exports);
    const { formatters } = module.exports;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util2.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util2.inspect(v, this.inspectOpts);
    };
  })(node, node.exports);
  return node.exports;
}
if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
  src.exports = requireBrowser();
} else {
  src.exports = requireNode();
}
var srcExports = src.exports;
const createDebug = /* @__PURE__ */ getDefaultExportFromCjs(srcExports);
var debug$4;
var debug_1 = function() {
  if (!debug$4) {
    try {
      debug$4 = srcExports("follow-redirects");
    } catch (error) {
    }
    if (typeof debug$4 !== "function") {
      debug$4 = function() {
      };
    }
  }
  debug$4.apply(null, arguments);
};
var url = require$$5;
var URL$1 = url.URL;
var http = http__default;
var https = https$2;
var Writable = stream$1.Writable;
var assert$1 = require$$4;
var debug$3 = debug_1;
(function detectUnsupportedEnvironment() {
  var looksLikeNode = typeof process !== "undefined";
  var looksLikeBrowser = typeof window !== "undefined" && typeof document !== "undefined";
  var looksLikeV8 = isFunction$1(Error.captureStackTrace);
  if (!looksLikeNode && (looksLikeBrowser || !looksLikeV8)) {
    console.warn("The follow-redirects package should be excluded from browser builds.");
  }
})();
var useNativeURL = false;
try {
  assert$1(new URL$1(""));
} catch (error) {
  useNativeURL = error.code === "ERR_INVALID_URL";
}
var sensitiveHeaders = [
  "Authorization",
  "Proxy-Authorization",
  "Cookie"
];
var preservedUrlFields = [
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
];
var events = ["abort", "aborted", "connect", "error", "socket", "timeout"];
var eventHandlers = /* @__PURE__ */ Object.create(null);
events.forEach(function(event) {
  eventHandlers[event] = function(arg1, arg2, arg3) {
    this._redirectable.emit(event, arg1, arg2, arg3);
  };
});
var InvalidUrlError = createErrorType(
  "ERR_INVALID_URL",
  "Invalid URL",
  TypeError
);
var RedirectionError = createErrorType(
  "ERR_FR_REDIRECTION_FAILURE",
  "Redirected request failed"
);
var TooManyRedirectsError = createErrorType(
  "ERR_FR_TOO_MANY_REDIRECTS",
  "Maximum number of redirects exceeded",
  RedirectionError
);
var MaxBodyLengthExceededError = createErrorType(
  "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
  "Request body larger than maxBodyLength limit"
);
var WriteAfterEndError = createErrorType(
  "ERR_STREAM_WRITE_AFTER_END",
  "write after end"
);
var destroy = Writable.prototype.destroy || noop;
function RedirectableRequest(options, responseCallback) {
  Writable.call(this);
  this._sanitizeOptions(options);
  this._options = options;
  this._ended = false;
  this._ending = false;
  this._redirectCount = 0;
  this._redirects = [];
  this._requestBodyLength = 0;
  this._requestBodyBuffers = [];
  if (responseCallback) {
    this.on("response", responseCallback);
  }
  var self2 = this;
  this._onNativeResponse = function(response) {
    try {
      self2._processResponse(response);
    } catch (cause) {
      self2.emit("error", cause instanceof RedirectionError ? cause : new RedirectionError({ cause }));
    }
  };
  this._headerFilter = new RegExp("^(?:" + sensitiveHeaders.concat(options.sensitiveHeaders).map(escapeRegex).join("|") + ")$", "i");
  this._performRequest();
}
RedirectableRequest.prototype = Object.create(Writable.prototype);
RedirectableRequest.prototype.abort = function() {
  destroyRequest(this._currentRequest);
  this._currentRequest.abort();
  this.emit("abort");
};
RedirectableRequest.prototype.destroy = function(error) {
  destroyRequest(this._currentRequest, error);
  destroy.call(this, error);
  return this;
};
RedirectableRequest.prototype.write = function(data, encoding, callback) {
  if (this._ending) {
    throw new WriteAfterEndError();
  }
  if (!isString(data) && !isBuffer(data)) {
    throw new TypeError("data should be a string, Buffer or Uint8Array");
  }
  if (isFunction$1(encoding)) {
    callback = encoding;
    encoding = null;
  }
  if (data.length === 0) {
    if (callback) {
      callback();
    }
    return;
  }
  if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
    this._requestBodyLength += data.length;
    this._requestBodyBuffers.push({ data, encoding });
    this._currentRequest.write(data, encoding, callback);
  } else {
    this.emit("error", new MaxBodyLengthExceededError());
    this.abort();
  }
};
RedirectableRequest.prototype.end = function(data, encoding, callback) {
  if (isFunction$1(data)) {
    callback = data;
    data = encoding = null;
  } else if (isFunction$1(encoding)) {
    callback = encoding;
    encoding = null;
  }
  if (!data) {
    this._ended = this._ending = true;
    this._currentRequest.end(null, null, callback);
  } else {
    var self2 = this;
    var currentRequest = this._currentRequest;
    this.write(data, encoding, function() {
      self2._ended = true;
      currentRequest.end(null, null, callback);
    });
    this._ending = true;
  }
};
RedirectableRequest.prototype.setHeader = function(name, value) {
  this._options.headers[name] = value;
  this._currentRequest.setHeader(name, value);
};
RedirectableRequest.prototype.removeHeader = function(name) {
  delete this._options.headers[name];
  this._currentRequest.removeHeader(name);
};
RedirectableRequest.prototype.setTimeout = function(msecs, callback) {
  var self2 = this;
  function destroyOnTimeout(socket) {
    socket.setTimeout(msecs);
    socket.removeListener("timeout", socket.destroy);
    socket.addListener("timeout", socket.destroy);
  }
  function startTimer(socket) {
    if (self2._timeout) {
      clearTimeout(self2._timeout);
    }
    self2._timeout = setTimeout(function() {
      self2.emit("timeout");
      clearTimer();
    }, msecs);
    destroyOnTimeout(socket);
  }
  function clearTimer() {
    if (self2._timeout) {
      clearTimeout(self2._timeout);
      self2._timeout = null;
    }
    self2.removeListener("abort", clearTimer);
    self2.removeListener("error", clearTimer);
    self2.removeListener("response", clearTimer);
    self2.removeListener("close", clearTimer);
    if (callback) {
      self2.removeListener("timeout", callback);
    }
    if (!self2.socket) {
      self2._currentRequest.removeListener("socket", startTimer);
    }
  }
  if (callback) {
    this.on("timeout", callback);
  }
  if (this.socket) {
    startTimer(this.socket);
  } else {
    this._currentRequest.once("socket", startTimer);
  }
  this.on("socket", destroyOnTimeout);
  this.on("abort", clearTimer);
  this.on("error", clearTimer);
  this.on("response", clearTimer);
  this.on("close", clearTimer);
  return this;
};
[
  "flushHeaders",
  "getHeader",
  "setNoDelay",
  "setSocketKeepAlive"
].forEach(function(method) {
  RedirectableRequest.prototype[method] = function(a, b) {
    return this._currentRequest[method](a, b);
  };
});
["aborted", "connection", "socket"].forEach(function(property) {
  Object.defineProperty(RedirectableRequest.prototype, property, {
    get: function() {
      return this._currentRequest[property];
    }
  });
});
RedirectableRequest.prototype._sanitizeOptions = function(options) {
  if (!options.headers) {
    options.headers = {};
  }
  if (!isArray(options.sensitiveHeaders)) {
    options.sensitiveHeaders = [];
  }
  if (options.host) {
    if (!options.hostname) {
      options.hostname = options.host;
    }
    delete options.host;
  }
  if (!options.pathname && options.path) {
    var searchPos = options.path.indexOf("?");
    if (searchPos < 0) {
      options.pathname = options.path;
    } else {
      options.pathname = options.path.substring(0, searchPos);
      options.search = options.path.substring(searchPos);
    }
  }
};
RedirectableRequest.prototype._performRequest = function() {
  var protocol = this._options.protocol;
  var nativeProtocol = this._options.nativeProtocols[protocol];
  if (!nativeProtocol) {
    throw new TypeError("Unsupported protocol " + protocol);
  }
  if (this._options.agents) {
    var scheme = protocol.slice(0, -1);
    this._options.agent = this._options.agents[scheme];
  }
  var request = this._currentRequest = nativeProtocol.request(this._options, this._onNativeResponse);
  request._redirectable = this;
  for (var event of events) {
    request.on(event, eventHandlers[event]);
  }
  this._currentUrl = /^\//.test(this._options.path) ? url.format(this._options) : (
    // When making a request to a proxy, […]
    // a client MUST send the target URI in absolute-form […].
    this._options.path
  );
  if (this._isRedirect) {
    var i = 0;
    var self2 = this;
    var buffers = this._requestBodyBuffers;
    (function writeNext(error) {
      if (request === self2._currentRequest) {
        if (error) {
          self2.emit("error", error);
        } else if (i < buffers.length) {
          var buffer = buffers[i++];
          if (!request.finished) {
            request.write(buffer.data, buffer.encoding, writeNext);
          }
        } else if (self2._ended) {
          request.end();
        }
      }
    })();
  }
};
RedirectableRequest.prototype._processResponse = function(response) {
  var statusCode = response.statusCode;
  if (this._options.trackRedirects) {
    this._redirects.push({
      url: this._currentUrl,
      headers: response.headers,
      statusCode
    });
  }
  var location = response.headers.location;
  if (!location || this._options.followRedirects === false || statusCode < 300 || statusCode >= 400) {
    response.responseUrl = this._currentUrl;
    response.redirects = this._redirects;
    this.emit("response", response);
    this._requestBodyBuffers = [];
    return;
  }
  destroyRequest(this._currentRequest);
  response.destroy();
  if (++this._redirectCount > this._options.maxRedirects) {
    throw new TooManyRedirectsError();
  }
  var requestHeaders;
  var beforeRedirect = this._options.beforeRedirect;
  if (beforeRedirect) {
    requestHeaders = Object.assign({
      // The Host header was set by nativeProtocol.request
      Host: response.req.getHeader("host")
    }, this._options.headers);
  }
  var method = this._options.method;
  if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" || // RFC7231§6.4.4: The 303 (See Other) status code indicates that
  // the server is redirecting the user agent to a different resource […]
  // A user agent can perform a retrieval request targeting that URI
  // (a GET or HEAD request if using HTTP) […]
  statusCode === 303 && !/^(?:GET|HEAD)$/.test(this._options.method)) {
    this._options.method = "GET";
    this._requestBodyBuffers = [];
    removeMatchingHeaders(/^content-/i, this._options.headers);
  }
  var currentHostHeader = removeMatchingHeaders(/^host$/i, this._options.headers);
  var currentUrlParts = parseUrl(this._currentUrl);
  var currentHost = currentHostHeader || currentUrlParts.host;
  var currentUrl = /^\w+:/.test(location) ? this._currentUrl : url.format(Object.assign(currentUrlParts, { host: currentHost }));
  var redirectUrl = resolveUrl(location, currentUrl);
  debug$3("redirecting to", redirectUrl.href);
  this._isRedirect = true;
  spreadUrlObject(redirectUrl, this._options);
  if (redirectUrl.protocol !== currentUrlParts.protocol && redirectUrl.protocol !== "https:" || redirectUrl.host !== currentHost && !isSubdomain(redirectUrl.host, currentHost)) {
    removeMatchingHeaders(this._headerFilter, this._options.headers);
  }
  if (isFunction$1(beforeRedirect)) {
    var responseDetails = {
      headers: response.headers,
      statusCode
    };
    var requestDetails = {
      url: currentUrl,
      method,
      headers: requestHeaders
    };
    beforeRedirect(this._options, responseDetails, requestDetails);
    this._sanitizeOptions(this._options);
  }
  this._performRequest();
};
function wrap(protocols) {
  var exports = {
    maxRedirects: 21,
    maxBodyLength: 10 * 1024 * 1024
  };
  var nativeProtocols = {};
  Object.keys(protocols).forEach(function(scheme) {
    var protocol = scheme + ":";
    var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
    var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol);
    function request(input, options, callback) {
      if (isURL(input)) {
        input = spreadUrlObject(input);
      } else if (isString(input)) {
        input = spreadUrlObject(parseUrl(input));
      } else {
        callback = options;
        options = validateUrl(input);
        input = { protocol };
      }
      if (isFunction$1(options)) {
        callback = options;
        options = null;
      }
      options = Object.assign({
        maxRedirects: exports.maxRedirects,
        maxBodyLength: exports.maxBodyLength
      }, input, options);
      options.nativeProtocols = nativeProtocols;
      if (!isString(options.host) && !isString(options.hostname)) {
        options.hostname = "::1";
      }
      assert$1.equal(options.protocol, protocol, "protocol mismatch");
      debug$3("options", options);
      return new RedirectableRequest(options, callback);
    }
    function get2(input, options, callback) {
      var wrappedRequest = wrappedProtocol.request(input, options, callback);
      wrappedRequest.end();
      return wrappedRequest;
    }
    Object.defineProperties(wrappedProtocol, {
      request: { value: request, configurable: true, enumerable: true, writable: true },
      get: { value: get2, configurable: true, enumerable: true, writable: true }
    });
  });
  return exports;
}
function noop() {
}
function parseUrl(input) {
  var parsed;
  if (useNativeURL) {
    parsed = new URL$1(input);
  } else {
    parsed = validateUrl(url.parse(input));
    if (!isString(parsed.protocol)) {
      throw new InvalidUrlError({ input });
    }
  }
  return parsed;
}
function resolveUrl(relative, base) {
  return useNativeURL ? new URL$1(relative, base) : parseUrl(url.resolve(base, relative));
}
function validateUrl(input) {
  if (/^\[/.test(input.hostname) && !/^\[[:0-9a-f]+\]$/i.test(input.hostname)) {
    throw new InvalidUrlError({ input: input.href || input });
  }
  if (/^\[/.test(input.host) && !/^\[[:0-9a-f]+\](:\d+)?$/i.test(input.host)) {
    throw new InvalidUrlError({ input: input.href || input });
  }
  return input;
}
function spreadUrlObject(urlObject, target) {
  var spread2 = target || {};
  for (var key of preservedUrlFields) {
    spread2[key] = urlObject[key];
  }
  if (spread2.hostname.startsWith("[")) {
    spread2.hostname = spread2.hostname.slice(1, -1);
  }
  if (spread2.port !== "") {
    spread2.port = Number(spread2.port);
  }
  spread2.path = spread2.search ? spread2.pathname + spread2.search : spread2.pathname;
  return spread2;
}
function removeMatchingHeaders(regex, headers) {
  var lastValue;
  for (var header in headers) {
    if (regex.test(header)) {
      lastValue = headers[header];
      delete headers[header];
    }
  }
  return lastValue === null || typeof lastValue === "undefined" ? void 0 : String(lastValue).trim();
}
function createErrorType(code, message, baseClass) {
  function CustomError(properties) {
    if (isFunction$1(Error.captureStackTrace)) {
      Error.captureStackTrace(this, this.constructor);
    }
    Object.assign(this, properties || {});
    this.code = code;
    this.message = this.cause ? message + ": " + this.cause.message : message;
  }
  CustomError.prototype = new (baseClass || Error)();
  Object.defineProperties(CustomError.prototype, {
    constructor: {
      value: CustomError,
      enumerable: false
    },
    name: {
      value: "Error [" + code + "]",
      enumerable: false
    }
  });
  return CustomError;
}
function destroyRequest(request, error) {
  for (var event of events) {
    request.removeListener(event, eventHandlers[event]);
  }
  request.on("error", noop);
  request.destroy(error);
}
function isSubdomain(subdomain, domain) {
  assert$1(isString(subdomain) && isString(domain));
  var dot = subdomain.length - domain.length - 1;
  return dot > 0 && subdomain[dot] === "." && subdomain.endsWith(domain);
}
function isArray(value) {
  return value instanceof Array;
}
function isString(value) {
  return typeof value === "string" || value instanceof String;
}
function isFunction$1(value) {
  return typeof value === "function";
}
function isBuffer(value) {
  return typeof value === "object" && "length" in value;
}
function isURL(value) {
  return URL$1 && value instanceof URL$1;
}
function escapeRegex(regex) {
  return regex.replace(/[\]\\/()*+?.$]/g, "\\$&");
}
followRedirects$1.exports = wrap({ http, https });
followRedirects$1.exports.wrap = wrap;
var followRedirectsExports = followRedirects$1.exports;
const followRedirects = /* @__PURE__ */ getDefaultExportFromCjs(followRedirectsExports);
const VERSION$1 = "1.16.0";
function parseProtocol(url2) {
  const match = /^([-+\w]{1,25}):(?:\/\/)?/.exec(url2);
  return match && match[1] || "";
}
const DATA_URL_PATTERN = /^(?:([^;]+);)?(?:[^;]+;)?(base64|),([\s\S]*)$/;
function fromDataURI(uri2, asBlob, options) {
  const _Blob = options && options.Blob || platform.classes.Blob;
  const protocol = parseProtocol(uri2);
  if (asBlob === void 0 && _Blob) {
    asBlob = true;
  }
  if (protocol === "data") {
    uri2 = protocol.length ? uri2.slice(protocol.length + 1) : uri2;
    const match = DATA_URL_PATTERN.exec(uri2);
    if (!match) {
      throw new AxiosError$1("Invalid URL", AxiosError$1.ERR_INVALID_URL);
    }
    const mime2 = match[1];
    const isBase64 = match[2];
    const body = match[3];
    const buffer = Buffer.from(decodeURIComponent(body), isBase64 ? "base64" : "utf8");
    if (asBlob) {
      if (!_Blob) {
        throw new AxiosError$1("Blob is not supported", AxiosError$1.ERR_NOT_SUPPORT);
      }
      return new _Blob([buffer], { type: mime2 });
    }
    return buffer;
  }
  throw new AxiosError$1("Unsupported protocol " + protocol, AxiosError$1.ERR_NOT_SUPPORT);
}
const kInternals = Symbol("internals");
class AxiosTransformStream extends stream$1.Transform {
  constructor(options) {
    options = utils$2.toFlatObject(
      options,
      {
        maxRate: 0,
        chunkSize: 64 * 1024,
        minChunkSize: 100,
        timeWindow: 500,
        ticksRate: 2,
        samplesCount: 15
      },
      null,
      (prop, source) => {
        return !utils$2.isUndefined(source[prop]);
      }
    );
    super({
      readableHighWaterMark: options.chunkSize
    });
    const internals = this[kInternals] = {
      timeWindow: options.timeWindow,
      chunkSize: options.chunkSize,
      maxRate: options.maxRate,
      minChunkSize: options.minChunkSize,
      bytesSeen: 0,
      isCaptured: false,
      notifiedBytesLoaded: 0,
      ts: Date.now(),
      bytes: 0,
      onReadCallback: null
    };
    this.on("newListener", (event) => {
      if (event === "progress") {
        if (!internals.isCaptured) {
          internals.isCaptured = true;
        }
      }
    });
  }
  _read(size) {
    const internals = this[kInternals];
    if (internals.onReadCallback) {
      internals.onReadCallback();
    }
    return super._read(size);
  }
  _transform(chunk, encoding, callback) {
    const internals = this[kInternals];
    const maxRate = internals.maxRate;
    const readableHighWaterMark = this.readableHighWaterMark;
    const timeWindow = internals.timeWindow;
    const divider = 1e3 / timeWindow;
    const bytesThreshold = maxRate / divider;
    const minChunkSize = internals.minChunkSize !== false ? Math.max(internals.minChunkSize, bytesThreshold * 0.01) : 0;
    const pushChunk = (_chunk, _callback) => {
      const bytes = Buffer.byteLength(_chunk);
      internals.bytesSeen += bytes;
      internals.bytes += bytes;
      internals.isCaptured && this.emit("progress", internals.bytesSeen);
      if (this.push(_chunk)) {
        process.nextTick(_callback);
      } else {
        internals.onReadCallback = () => {
          internals.onReadCallback = null;
          process.nextTick(_callback);
        };
      }
    };
    const transformChunk = (_chunk, _callback) => {
      const chunkSize = Buffer.byteLength(_chunk);
      let chunkRemainder = null;
      let maxChunkSize = readableHighWaterMark;
      let bytesLeft;
      let passed = 0;
      if (maxRate) {
        const now = Date.now();
        if (!internals.ts || (passed = now - internals.ts) >= timeWindow) {
          internals.ts = now;
          bytesLeft = bytesThreshold - internals.bytes;
          internals.bytes = bytesLeft < 0 ? -bytesLeft : 0;
          passed = 0;
        }
        bytesLeft = bytesThreshold - internals.bytes;
      }
      if (maxRate) {
        if (bytesLeft <= 0) {
          return setTimeout(() => {
            _callback(null, _chunk);
          }, timeWindow - passed);
        }
        if (bytesLeft < maxChunkSize) {
          maxChunkSize = bytesLeft;
        }
      }
      if (maxChunkSize && chunkSize > maxChunkSize && chunkSize - maxChunkSize > minChunkSize) {
        chunkRemainder = _chunk.subarray(maxChunkSize);
        _chunk = _chunk.subarray(0, maxChunkSize);
      }
      pushChunk(
        _chunk,
        chunkRemainder ? () => {
          process.nextTick(_callback, null, chunkRemainder);
        } : _callback
      );
    };
    transformChunk(chunk, function transformNextChunk(err, _chunk) {
      if (err) {
        return callback(err);
      }
      if (_chunk) {
        transformChunk(_chunk, transformNextChunk);
      } else {
        callback(null);
      }
    });
  }
}
const { asyncIterator } = Symbol;
const readBlob = async function* (blob) {
  if (blob.stream) {
    yield* blob.stream();
  } else if (blob.arrayBuffer) {
    yield await blob.arrayBuffer();
  } else if (blob[asyncIterator]) {
    yield* blob[asyncIterator]();
  } else {
    yield blob;
  }
};
const BOUNDARY_ALPHABET = platform.ALPHABET.ALPHA_DIGIT + "-_";
const textEncoder = typeof TextEncoder === "function" ? new TextEncoder() : new require$$1.TextEncoder();
const CRLF = "\r\n";
const CRLF_BYTES = textEncoder.encode(CRLF);
const CRLF_BYTES_COUNT = 2;
class FormDataPart {
  constructor(name, value) {
    const { escapeName } = this.constructor;
    const isStringValue = utils$2.isString(value);
    let headers = `Content-Disposition: form-data; name="${escapeName(name)}"${!isStringValue && value.name ? `; filename="${escapeName(value.name)}"` : ""}${CRLF}`;
    if (isStringValue) {
      value = textEncoder.encode(String(value).replace(/\r?\n|\r\n?/g, CRLF));
    } else {
      const safeType = String(value.type || "application/octet-stream").replace(/[\r\n]/g, "");
      headers += `Content-Type: ${safeType}${CRLF}`;
    }
    this.headers = textEncoder.encode(headers + CRLF);
    this.contentLength = isStringValue ? value.byteLength : value.size;
    this.size = this.headers.byteLength + this.contentLength + CRLF_BYTES_COUNT;
    this.name = name;
    this.value = value;
  }
  async *encode() {
    yield this.headers;
    const { value } = this;
    if (utils$2.isTypedArray(value)) {
      yield value;
    } else {
      yield* readBlob(value);
    }
    yield CRLF_BYTES;
  }
  static escapeName(name) {
    return String(name).replace(
      /[\r\n"]/g,
      (match) => ({
        "\r": "%0D",
        "\n": "%0A",
        '"': "%22"
      })[match]
    );
  }
}
const formDataToStream = (form, headersHandler, options) => {
  const {
    tag = "form-data-boundary",
    size = 25,
    boundary = tag + "-" + platform.generateString(size, BOUNDARY_ALPHABET)
  } = options || {};
  if (!utils$2.isFormData(form)) {
    throw TypeError("FormData instance required");
  }
  if (boundary.length < 1 || boundary.length > 70) {
    throw Error("boundary must be 1-70 characters long");
  }
  const boundaryBytes = textEncoder.encode("--" + boundary + CRLF);
  const footerBytes = textEncoder.encode("--" + boundary + "--" + CRLF);
  let contentLength = footerBytes.byteLength;
  const parts = Array.from(form.entries()).map(([name, value]) => {
    const part = new FormDataPart(name, value);
    contentLength += part.size;
    return part;
  });
  contentLength += boundaryBytes.byteLength * parts.length;
  contentLength = utils$2.toFiniteNumber(contentLength);
  const computedHeaders = {
    "Content-Type": `multipart/form-data; boundary=${boundary}`
  };
  if (Number.isFinite(contentLength)) {
    computedHeaders["Content-Length"] = contentLength;
  }
  headersHandler && headersHandler(computedHeaders);
  return Readable.from(
    async function* () {
      for (const part of parts) {
        yield boundaryBytes;
        yield* part.encode();
      }
      yield footerBytes;
    }()
  );
};
class ZlibHeaderTransformStream extends stream$1.Transform {
  __transform(chunk, encoding, callback) {
    this.push(chunk);
    callback();
  }
  _transform(chunk, encoding, callback) {
    if (chunk.length !== 0) {
      this._transform = this.__transform;
      if (chunk[0] !== 120) {
        const header = Buffer.alloc(2);
        header[0] = 120;
        header[1] = 156;
        this.push(header, encoding);
      }
    }
    this.__transform(chunk, encoding, callback);
  }
}
const callbackify = (fn, reducer) => {
  return utils$2.isAsyncFn(fn) ? function(...args) {
    const cb = args.pop();
    fn.apply(this, args).then((value) => {
      try {
        reducer ? cb(null, ...reducer(value)) : cb(null, value);
      } catch (err) {
        cb(err);
      }
    }, cb);
  } : fn;
};
const LOOPBACK_HOSTNAMES = /* @__PURE__ */ new Set(["localhost"]);
const isIPv4Loopback = (host) => {
  const parts = host.split(".");
  if (parts.length !== 4) return false;
  if (parts[0] !== "127") return false;
  return parts.every((p) => /^\d+$/.test(p) && Number(p) >= 0 && Number(p) <= 255);
};
const isIPv6Loopback = (host) => {
  if (host === "::1") return true;
  const v4MappedDotted = host.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
  if (v4MappedDotted) return isIPv4Loopback(v4MappedDotted[1]);
  const v4MappedHex = host.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i);
  if (v4MappedHex) {
    const high = parseInt(v4MappedHex[1], 16);
    return high >= 32512 && high <= 32767;
  }
  const groups = host.split(":");
  if (groups.length === 8) {
    for (let i = 0; i < 7; i++) {
      if (!/^0+$/.test(groups[i])) return false;
    }
    return /^0*1$/.test(groups[7]);
  }
  return false;
};
const isLoopback = (host) => {
  if (!host) return false;
  if (LOOPBACK_HOSTNAMES.has(host)) return true;
  if (isIPv4Loopback(host)) return true;
  return isIPv6Loopback(host);
};
const DEFAULT_PORTS = {
  http: 80,
  https: 443,
  ws: 80,
  wss: 443,
  ftp: 21
};
const parseNoProxyEntry = (entry) => {
  let entryHost = entry;
  let entryPort = 0;
  if (entryHost.charAt(0) === "[") {
    const bracketIndex = entryHost.indexOf("]");
    if (bracketIndex !== -1) {
      const host = entryHost.slice(1, bracketIndex);
      const rest = entryHost.slice(bracketIndex + 1);
      if (rest.charAt(0) === ":" && /^\d+$/.test(rest.slice(1))) {
        entryPort = Number.parseInt(rest.slice(1), 10);
      }
      return [host, entryPort];
    }
  }
  const firstColon = entryHost.indexOf(":");
  const lastColon = entryHost.lastIndexOf(":");
  if (firstColon !== -1 && firstColon === lastColon && /^\d+$/.test(entryHost.slice(lastColon + 1))) {
    entryPort = Number.parseInt(entryHost.slice(lastColon + 1), 10);
    entryHost = entryHost.slice(0, lastColon);
  }
  return [entryHost, entryPort];
};
const IPV4_MAPPED_DOTTED_RE = /^(?:::|(?:0{1,4}:){1,4}:|(?:0{1,4}:){5})ffff:(\d+\.\d+\.\d+\.\d+)$/i;
const IPV4_MAPPED_HEX_RE = /^(?:::|(?:0{1,4}:){1,4}:|(?:0{1,4}:){5})ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i;
const unmapIPv4MappedIPv6 = (host) => {
  if (typeof host !== "string" || host.indexOf(":") === -1) return host;
  const dotted = host.match(IPV4_MAPPED_DOTTED_RE);
  if (dotted) return dotted[1];
  const hex = host.match(IPV4_MAPPED_HEX_RE);
  if (hex) {
    const high = parseInt(hex[1], 16);
    const low = parseInt(hex[2], 16);
    return `${high >> 8}.${high & 255}.${low >> 8}.${low & 255}`;
  }
  return host;
};
const normalizeNoProxyHost = (hostname) => {
  if (!hostname) {
    return hostname;
  }
  if (hostname.charAt(0) === "[" && hostname.charAt(hostname.length - 1) === "]") {
    hostname = hostname.slice(1, -1);
  }
  return unmapIPv4MappedIPv6(hostname.replace(/\.+$/, ""));
};
function shouldBypassProxy(location) {
  let parsed;
  try {
    parsed = new URL(location);
  } catch (_err) {
    return false;
  }
  const noProxy = (process.env.no_proxy || process.env.NO_PROXY || "").toLowerCase();
  if (!noProxy) {
    return false;
  }
  if (noProxy === "*") {
    return true;
  }
  const port = Number.parseInt(parsed.port, 10) || DEFAULT_PORTS[parsed.protocol.split(":", 1)[0]] || 0;
  const hostname = normalizeNoProxyHost(parsed.hostname.toLowerCase());
  return noProxy.split(/[\s,]+/).some((entry) => {
    if (!entry) {
      return false;
    }
    let [entryHost, entryPort] = parseNoProxyEntry(entry);
    entryHost = normalizeNoProxyHost(entryHost);
    if (!entryHost) {
      return false;
    }
    if (entryPort && entryPort !== port) {
      return false;
    }
    if (entryHost.charAt(0) === "*") {
      entryHost = entryHost.slice(1);
    }
    if (entryHost.charAt(0) === ".") {
      return hostname.endsWith(entryHost);
    }
    return hostname === entryHost || isLoopback(hostname) && isLoopback(entryHost);
  });
}
function speedometer(samplesCount, min2) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;
  min2 = min2 !== void 0 ? min2 : 1e3;
  return function push(chunkLength) {
    const now = Date.now();
    const startedAt = timestamps[tail];
    if (!firstSampleTS) {
      firstSampleTS = now;
    }
    bytes[head] = chunkLength;
    timestamps[head] = now;
    let i = tail;
    let bytesCount = 0;
    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }
    head = (head + 1) % samplesCount;
    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }
    if (now - firstSampleTS < min2) {
      return;
    }
    const passed = startedAt && now - startedAt;
    return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
  };
}
function throttle(fn, freq) {
  let timestamp = 0;
  let threshold = 1e3 / freq;
  let lastArgs;
  let timer;
  const invoke = (args, now = Date.now()) => {
    timestamp = now;
    lastArgs = null;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    fn(...args);
  };
  const throttled = (...args) => {
    const now = Date.now();
    const passed = now - timestamp;
    if (passed >= threshold) {
      invoke(args, now);
    } else {
      lastArgs = args;
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          invoke(lastArgs);
        }, threshold - passed);
      }
    }
  };
  const flush = () => lastArgs && invoke(lastArgs);
  return [throttled, flush];
}
const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
  let bytesNotified = 0;
  const _speedometer = speedometer(50, 250);
  return throttle((e) => {
    const rawLoaded = e.loaded;
    const total = e.lengthComputable ? e.total : void 0;
    const loaded = total != null ? Math.min(rawLoaded, total) : rawLoaded;
    const progressBytes = Math.max(0, loaded - bytesNotified);
    const rate = _speedometer(progressBytes);
    bytesNotified = Math.max(bytesNotified, loaded);
    const data = {
      loaded,
      total,
      progress: total ? loaded / total : void 0,
      bytes: progressBytes,
      rate: rate ? rate : void 0,
      estimated: rate && total ? (total - loaded) / rate : void 0,
      event: e,
      lengthComputable: total != null,
      [isDownloadStream ? "download" : "upload"]: true
    };
    listener(data);
  }, freq);
};
const progressEventDecorator = (total, throttled) => {
  const lengthComputable = total != null;
  return [
    (loaded) => throttled[0]({
      lengthComputable,
      total,
      loaded
    }),
    throttled[1]
  ];
};
const asyncDecorator = (fn) => (...args) => utils$2.asap(() => fn(...args));
function estimateDataURLDecodedBytes(url2) {
  if (!url2 || typeof url2 !== "string") return 0;
  if (!url2.startsWith("data:")) return 0;
  const comma = url2.indexOf(",");
  if (comma < 0) return 0;
  const meta = url2.slice(5, comma);
  const body = url2.slice(comma + 1);
  const isBase64 = /;base64/i.test(meta);
  if (isBase64) {
    let effectiveLen = body.length;
    const len = body.length;
    for (let i = 0; i < len; i++) {
      if (body.charCodeAt(i) === 37 && i + 2 < len) {
        const a = body.charCodeAt(i + 1);
        const b = body.charCodeAt(i + 2);
        const isHex = (a >= 48 && a <= 57 || a >= 65 && a <= 70 || a >= 97 && a <= 102) && (b >= 48 && b <= 57 || b >= 65 && b <= 70 || b >= 97 && b <= 102);
        if (isHex) {
          effectiveLen -= 2;
          i += 2;
        }
      }
    }
    let pad = 0;
    let idx = len - 1;
    const tailIsPct3D = (j) => j >= 2 && body.charCodeAt(j - 2) === 37 && // '%'
    body.charCodeAt(j - 1) === 51 && // '3'
    (body.charCodeAt(j) === 68 || body.charCodeAt(j) === 100);
    if (idx >= 0) {
      if (body.charCodeAt(idx) === 61) {
        pad++;
        idx--;
      } else if (tailIsPct3D(idx)) {
        pad++;
        idx -= 3;
      }
    }
    if (pad === 1 && idx >= 0) {
      if (body.charCodeAt(idx) === 61) {
        pad++;
      } else if (tailIsPct3D(idx)) {
        pad++;
      }
    }
    const groups = Math.floor(effectiveLen / 4);
    const bytes2 = groups * 3 - (pad || 0);
    return bytes2 > 0 ? bytes2 : 0;
  }
  if (typeof Buffer !== "undefined" && typeof Buffer.byteLength === "function") {
    return Buffer.byteLength(body, "utf8");
  }
  let bytes = 0;
  for (let i = 0, len = body.length; i < len; i++) {
    const c = body.charCodeAt(i);
    if (c < 128) {
      bytes += 1;
    } else if (c < 2048) {
      bytes += 2;
    } else if (c >= 55296 && c <= 56319 && i + 1 < len) {
      const next = body.charCodeAt(i + 1);
      if (next >= 56320 && next <= 57343) {
        bytes += 4;
        i++;
      } else {
        bytes += 3;
      }
    } else {
      bytes += 3;
    }
  }
  return bytes;
}
const zlibOptions = {
  flush: zlib.constants.Z_SYNC_FLUSH,
  finishFlush: zlib.constants.Z_SYNC_FLUSH
};
const brotliOptions = {
  flush: zlib.constants.BROTLI_OPERATION_FLUSH,
  finishFlush: zlib.constants.BROTLI_OPERATION_FLUSH
};
const isBrotliSupported = utils$2.isFunction(zlib.createBrotliDecompress);
const { http: httpFollow, https: httpsFollow } = followRedirects;
const isHttps = /https:?/;
const FORM_DATA_CONTENT_HEADERS$1 = ["content-type", "content-length"];
function setFormDataHeaders$1(headers, formHeaders, policy) {
  if (policy !== "content-only") {
    headers.set(formHeaders);
    return;
  }
  Object.entries(formHeaders).forEach(([key, val]) => {
    if (FORM_DATA_CONTENT_HEADERS$1.includes(key.toLowerCase())) {
      headers.set(key, val);
    }
  });
}
const kAxiosSocketListener = Symbol("axios.http.socketListener");
const kAxiosCurrentReq = Symbol("axios.http.currentReq");
const supportedProtocols = platform.protocols.map((protocol) => {
  return protocol + ":";
});
const decodeURIComponentSafe = (value) => {
  if (!utils$2.isString(value)) {
    return value;
  }
  try {
    return decodeURIComponent(value);
  } catch (error) {
    return value;
  }
};
const flushOnFinish = (stream2, [throttled, flush]) => {
  stream2.on("end", flush).on("error", flush);
  return throttled;
};
class Http2Sessions {
  constructor() {
    this.sessions = /* @__PURE__ */ Object.create(null);
  }
  getSession(authority, options) {
    options = Object.assign(
      {
        sessionTimeout: 1e3
      },
      options
    );
    let authoritySessions = this.sessions[authority];
    if (authoritySessions) {
      let len = authoritySessions.length;
      for (let i = 0; i < len; i++) {
        const [sessionHandle, sessionOptions] = authoritySessions[i];
        if (!sessionHandle.destroyed && !sessionHandle.closed && require$$1.isDeepStrictEqual(sessionOptions, options)) {
          return sessionHandle;
        }
      }
    }
    const session2 = http2.connect(authority, options);
    let removed;
    const removeSession = () => {
      if (removed) {
        return;
      }
      removed = true;
      let entries = authoritySessions, len = entries.length, i = len;
      while (i--) {
        if (entries[i][0] === session2) {
          if (len === 1) {
            delete this.sessions[authority];
          } else {
            entries.splice(i, 1);
          }
          if (!session2.closed) {
            session2.close();
          }
          return;
        }
      }
    };
    const originalRequestFn = session2.request;
    const { sessionTimeout } = options;
    if (sessionTimeout != null) {
      let timer;
      let streamsCount = 0;
      session2.request = function() {
        const stream2 = originalRequestFn.apply(this, arguments);
        streamsCount++;
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        stream2.once("close", () => {
          if (!--streamsCount) {
            timer = setTimeout(() => {
              timer = null;
              removeSession();
            }, sessionTimeout);
          }
        });
        return stream2;
      };
    }
    session2.once("close", removeSession);
    let entry = [session2, options];
    authoritySessions ? authoritySessions.push(entry) : authoritySessions = this.sessions[authority] = [entry];
    return session2;
  }
}
const http2Sessions = new Http2Sessions();
function dispatchBeforeRedirect(options, responseDetails, requestDetails) {
  if (options.beforeRedirects.proxy) {
    options.beforeRedirects.proxy(options);
  }
  if (options.beforeRedirects.config) {
    options.beforeRedirects.config(options, responseDetails, requestDetails);
  }
}
function setProxy(options, configProxy, location, isRedirect) {
  let proxy = configProxy;
  if (!proxy && proxy !== false) {
    const proxyUrl = getProxyForUrl(location);
    if (proxyUrl) {
      if (!shouldBypassProxy(location)) {
        proxy = new URL(proxyUrl);
      }
    }
  }
  if (isRedirect && options.headers) {
    for (const name of Object.keys(options.headers)) {
      if (name.toLowerCase() === "proxy-authorization") {
        delete options.headers[name];
      }
    }
  }
  if (proxy) {
    const isProxyURL = proxy instanceof URL;
    const readProxyField = (key) => isProxyURL || utils$2.hasOwnProp(proxy, key) ? proxy[key] : void 0;
    const proxyUsername = readProxyField("username");
    const proxyPassword = readProxyField("password");
    let proxyAuth = utils$2.hasOwnProp(proxy, "auth") ? proxy.auth : void 0;
    if (proxyUsername) {
      proxyAuth = (proxyUsername || "") + ":" + (proxyPassword || "");
    }
    if (proxyAuth) {
      const authIsObject = typeof proxyAuth === "object";
      const authUsername = authIsObject && utils$2.hasOwnProp(proxyAuth, "username") ? proxyAuth.username : void 0;
      const authPassword = authIsObject && utils$2.hasOwnProp(proxyAuth, "password") ? proxyAuth.password : void 0;
      const validProxyAuth = Boolean(authUsername || authPassword);
      if (validProxyAuth) {
        proxyAuth = (authUsername || "") + ":" + (authPassword || "");
      } else if (authIsObject) {
        throw new AxiosError$1("Invalid proxy authorization", AxiosError$1.ERR_BAD_OPTION, { proxy });
      }
      const base64 = Buffer.from(proxyAuth, "utf8").toString("base64");
      options.headers["Proxy-Authorization"] = "Basic " + base64;
    }
    let hasUserHostHeader = false;
    for (const name of Object.keys(options.headers)) {
      if (name.toLowerCase() === "host") {
        hasUserHostHeader = true;
        break;
      }
    }
    if (!hasUserHostHeader) {
      options.headers.host = options.hostname + (options.port ? ":" + options.port : "");
    }
    const proxyHost = readProxyField("hostname") || readProxyField("host");
    options.hostname = proxyHost;
    options.host = proxyHost;
    options.port = readProxyField("port");
    options.path = location;
    const proxyProtocol = readProxyField("protocol");
    if (proxyProtocol) {
      options.protocol = proxyProtocol.includes(":") ? proxyProtocol : `${proxyProtocol}:`;
    }
  }
  options.beforeRedirects.proxy = function beforeRedirect(redirectOptions) {
    setProxy(redirectOptions, configProxy, redirectOptions.href, true);
  };
}
const isHttpAdapterSupported = typeof process !== "undefined" && utils$2.kindOf(process) === "process";
const wrapAsync = (asyncExecutor) => {
  return new Promise((resolve2, reject) => {
    let onDone;
    let isDone;
    const done = (value, isRejected) => {
      if (isDone) return;
      isDone = true;
      onDone && onDone(value, isRejected);
    };
    const _resolve = (value) => {
      done(value);
      resolve2(value);
    };
    const _reject = (reason) => {
      done(reason, true);
      reject(reason);
    };
    asyncExecutor(_resolve, _reject, (onDoneHandler) => onDone = onDoneHandler).catch(_reject);
  });
};
const resolveFamily = ({ address, family }) => {
  if (!utils$2.isString(address)) {
    throw TypeError("address must be a string");
  }
  return {
    address,
    family: family || (address.indexOf(".") < 0 ? 6 : 4)
  };
};
const buildAddressEntry = (address, family) => resolveFamily(utils$2.isObject(address) ? address : { address, family });
const http2Transport = {
  request(options, cb) {
    const authority = options.protocol + "//" + options.hostname + ":" + (options.port || (options.protocol === "https:" ? 443 : 80));
    const { http2Options, headers } = options;
    const session2 = http2Sessions.getSession(authority, http2Options);
    const { HTTP2_HEADER_SCHEME, HTTP2_HEADER_METHOD, HTTP2_HEADER_PATH, HTTP2_HEADER_STATUS } = http2.constants;
    const http2Headers = {
      [HTTP2_HEADER_SCHEME]: options.protocol.replace(":", ""),
      [HTTP2_HEADER_METHOD]: options.method,
      [HTTP2_HEADER_PATH]: options.path
    };
    utils$2.forEach(headers, (header, name) => {
      name.charAt(0) !== ":" && (http2Headers[name] = header);
    });
    const req = session2.request(http2Headers);
    req.once("response", (responseHeaders) => {
      const response = req;
      responseHeaders = Object.assign({}, responseHeaders);
      const status = responseHeaders[HTTP2_HEADER_STATUS];
      delete responseHeaders[HTTP2_HEADER_STATUS];
      response.headers = responseHeaders;
      response.statusCode = +status;
      cb(response);
    });
    return req;
  }
};
const httpAdapter = isHttpAdapterSupported && function httpAdapter2(config) {
  return wrapAsync(async function dispatchHttpRequest(resolve$1, reject, onDone) {
    const own2 = (key) => utils$2.hasOwnProp(config, key) ? config[key] : void 0;
    let data = own2("data");
    let lookup = own2("lookup");
    let family = own2("family");
    let httpVersion = own2("httpVersion");
    if (httpVersion === void 0) httpVersion = 1;
    let http2Options = own2("http2Options");
    const responseType = own2("responseType");
    const responseEncoding = own2("responseEncoding");
    const method = config.method.toUpperCase();
    let isDone;
    let rejected = false;
    let req;
    let connectPhaseTimer;
    httpVersion = +httpVersion;
    if (Number.isNaN(httpVersion)) {
      throw TypeError(`Invalid protocol version: '${config.httpVersion}' is not a number`);
    }
    if (httpVersion !== 1 && httpVersion !== 2) {
      throw TypeError(`Unsupported protocol version '${httpVersion}'`);
    }
    const isHttp2 = httpVersion === 2;
    if (lookup) {
      const _lookup = callbackify(lookup, (value) => utils$2.isArray(value) ? value : [value]);
      lookup = (hostname, opt, cb) => {
        _lookup(hostname, opt, (err, arg0, arg1) => {
          if (err) {
            return cb(err);
          }
          const addresses = utils$2.isArray(arg0) ? arg0.map((addr) => buildAddressEntry(addr)) : [buildAddressEntry(arg0, arg1)];
          opt.all ? cb(err, addresses) : cb(err, addresses[0].address, addresses[0].family);
        });
      };
    }
    const abortEmitter = new EventEmitter();
    function abort2(reason) {
      try {
        abortEmitter.emit(
          "abort",
          !reason || reason.type ? new CanceledError$1(null, config, req) : reason
        );
      } catch (err) {
        console.warn("emit error", err);
      }
    }
    function clearConnectPhaseTimer() {
      if (connectPhaseTimer) {
        clearTimeout(connectPhaseTimer);
        connectPhaseTimer = null;
      }
    }
    function createTimeoutError() {
      let timeoutErrorMessage = config.timeout ? "timeout of " + config.timeout + "ms exceeded" : "timeout exceeded";
      const transitional2 = config.transitional || transitionalDefaults;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      return new AxiosError$1(
        timeoutErrorMessage,
        transitional2.clarifyTimeoutError ? AxiosError$1.ETIMEDOUT : AxiosError$1.ECONNABORTED,
        config,
        req
      );
    }
    abortEmitter.once("abort", reject);
    const onFinished = () => {
      clearConnectPhaseTimer();
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(abort2);
      }
      if (config.signal) {
        config.signal.removeEventListener("abort", abort2);
      }
      abortEmitter.removeAllListeners();
    };
    if (config.cancelToken || config.signal) {
      config.cancelToken && config.cancelToken.subscribe(abort2);
      if (config.signal) {
        config.signal.aborted ? abort2() : config.signal.addEventListener("abort", abort2);
      }
    }
    onDone((response, isRejected) => {
      isDone = true;
      clearConnectPhaseTimer();
      if (isRejected) {
        rejected = true;
        onFinished();
        return;
      }
      const { data: data2 } = response;
      if (data2 instanceof stream$1.Readable || data2 instanceof stream$1.Duplex) {
        const offListeners = stream$1.finished(data2, () => {
          offListeners();
          onFinished();
        });
      } else {
        onFinished();
      }
    });
    const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
    const parsed = new URL(fullPath, platform.hasBrowserEnv ? platform.origin : void 0);
    const protocol = parsed.protocol || supportedProtocols[0];
    if (protocol === "data:") {
      if (config.maxContentLength > -1) {
        const dataUrl = String(config.url || fullPath || "");
        const estimated = estimateDataURLDecodedBytes(dataUrl);
        if (estimated > config.maxContentLength) {
          return reject(
            new AxiosError$1(
              "maxContentLength size of " + config.maxContentLength + " exceeded",
              AxiosError$1.ERR_BAD_RESPONSE,
              config
            )
          );
        }
      }
      let convertedData;
      if (method !== "GET") {
        return settle(resolve$1, reject, {
          status: 405,
          statusText: "method not allowed",
          headers: {},
          config
        });
      }
      try {
        convertedData = fromDataURI(config.url, responseType === "blob", {
          Blob: config.env && config.env.Blob
        });
      } catch (err) {
        throw AxiosError$1.from(err, AxiosError$1.ERR_BAD_REQUEST, config);
      }
      if (responseType === "text") {
        convertedData = convertedData.toString(responseEncoding);
        if (!responseEncoding || responseEncoding === "utf8") {
          convertedData = utils$2.stripBOM(convertedData);
        }
      } else if (responseType === "stream") {
        convertedData = stream$1.Readable.from(convertedData);
      }
      return settle(resolve$1, reject, {
        data: convertedData,
        status: 200,
        statusText: "OK",
        headers: new AxiosHeaders$1(),
        config
      });
    }
    if (supportedProtocols.indexOf(protocol) === -1) {
      return reject(
        new AxiosError$1("Unsupported protocol " + protocol, AxiosError$1.ERR_BAD_REQUEST, config)
      );
    }
    const headers = AxiosHeaders$1.from(config.headers).normalize();
    headers.set("User-Agent", "axios/" + VERSION$1, false);
    const { onUploadProgress, onDownloadProgress } = config;
    const maxRate = config.maxRate;
    let maxUploadRate = void 0;
    let maxDownloadRate = void 0;
    if (utils$2.isSpecCompliantForm(data)) {
      const userBoundary = headers.getContentType(/boundary=([-_\w\d]{10,70})/i);
      data = formDataToStream(
        data,
        (formHeaders) => {
          headers.set(formHeaders);
        },
        {
          tag: `axios-${VERSION$1}-boundary`,
          boundary: userBoundary && userBoundary[1] || void 0
        }
      );
    } else if (utils$2.isFormData(data) && utils$2.isFunction(data.getHeaders) && data.getHeaders !== Object.prototype.getHeaders) {
      setFormDataHeaders$1(headers, data.getHeaders(), own2("formDataHeaderPolicy"));
      if (!headers.hasContentLength()) {
        try {
          const knownLength = await require$$1.promisify(data.getLength).call(data);
          Number.isFinite(knownLength) && knownLength >= 0 && headers.setContentLength(knownLength);
        } catch (e) {
        }
      }
    } else if (utils$2.isBlob(data) || utils$2.isFile(data)) {
      data.size && headers.setContentType(data.type || "application/octet-stream");
      headers.setContentLength(data.size || 0);
      data = stream$1.Readable.from(readBlob(data));
    } else if (data && !utils$2.isStream(data)) {
      if (Buffer.isBuffer(data)) ;
      else if (utils$2.isArrayBuffer(data)) {
        data = Buffer.from(new Uint8Array(data));
      } else if (utils$2.isString(data)) {
        data = Buffer.from(data, "utf-8");
      } else {
        return reject(
          new AxiosError$1(
            "Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream",
            AxiosError$1.ERR_BAD_REQUEST,
            config
          )
        );
      }
      headers.setContentLength(data.length, false);
      if (config.maxBodyLength > -1 && data.length > config.maxBodyLength) {
        return reject(
          new AxiosError$1(
            "Request body larger than maxBodyLength limit",
            AxiosError$1.ERR_BAD_REQUEST,
            config
          )
        );
      }
    }
    const contentLength = utils$2.toFiniteNumber(headers.getContentLength());
    if (utils$2.isArray(maxRate)) {
      maxUploadRate = maxRate[0];
      maxDownloadRate = maxRate[1];
    } else {
      maxUploadRate = maxDownloadRate = maxRate;
    }
    if (data && (onUploadProgress || maxUploadRate)) {
      if (!utils$2.isStream(data)) {
        data = stream$1.Readable.from(data, { objectMode: false });
      }
      data = stream$1.pipeline(
        [
          data,
          new AxiosTransformStream({
            maxRate: utils$2.toFiniteNumber(maxUploadRate)
          })
        ],
        utils$2.noop
      );
      onUploadProgress && data.on(
        "progress",
        flushOnFinish(
          data,
          progressEventDecorator(
            contentLength,
            progressEventReducer(asyncDecorator(onUploadProgress), false, 3)
          )
        )
      );
    }
    let auth = void 0;
    const configAuth = own2("auth");
    if (configAuth) {
      const username = configAuth.username || "";
      const password = configAuth.password || "";
      auth = username + ":" + password;
    }
    if (!auth && parsed.username) {
      const urlUsername = decodeURIComponentSafe(parsed.username);
      const urlPassword = decodeURIComponentSafe(parsed.password);
      auth = urlUsername + ":" + urlPassword;
    }
    auth && headers.delete("authorization");
    let path2;
    try {
      path2 = buildURL(
        parsed.pathname + parsed.search,
        config.params,
        config.paramsSerializer
      ).replace(/^\?/, "");
    } catch (err) {
      const customErr = new Error(err.message);
      customErr.config = config;
      customErr.url = config.url;
      customErr.exists = true;
      return reject(customErr);
    }
    headers.set(
      "Accept-Encoding",
      "gzip, compress, deflate" + (isBrotliSupported ? ", br" : ""),
      false
    );
    const options = Object.assign(/* @__PURE__ */ Object.create(null), {
      path: path2,
      method,
      headers: headers.toJSON(),
      agents: { http: config.httpAgent, https: config.httpsAgent },
      auth,
      protocol,
      family,
      beforeRedirect: dispatchBeforeRedirect,
      beforeRedirects: /* @__PURE__ */ Object.create(null),
      http2Options
    });
    !utils$2.isUndefined(lookup) && (options.lookup = lookup);
    if (config.socketPath) {
      if (typeof config.socketPath !== "string") {
        return reject(
          new AxiosError$1("socketPath must be a string", AxiosError$1.ERR_BAD_OPTION_VALUE, config)
        );
      }
      if (config.allowedSocketPaths != null) {
        const allowed = Array.isArray(config.allowedSocketPaths) ? config.allowedSocketPaths : [config.allowedSocketPaths];
        const resolvedSocket = resolve(config.socketPath);
        const isAllowed = allowed.some(
          (entry) => typeof entry === "string" && resolve(entry) === resolvedSocket
        );
        if (!isAllowed) {
          return reject(
            new AxiosError$1(
              `socketPath "${config.socketPath}" is not permitted by allowedSocketPaths`,
              AxiosError$1.ERR_BAD_OPTION_VALUE,
              config
            )
          );
        }
      }
      options.socketPath = config.socketPath;
    } else {
      options.hostname = parsed.hostname.startsWith("[") ? parsed.hostname.slice(1, -1) : parsed.hostname;
      options.port = parsed.port;
      setProxy(
        options,
        config.proxy,
        protocol + "//" + parsed.hostname + (parsed.port ? ":" + parsed.port : "") + options.path
      );
    }
    let transport;
    let isNativeTransport = false;
    const isHttpsRequest = isHttps.test(options.protocol);
    options.agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;
    if (isHttp2) {
      transport = http2Transport;
    } else {
      const configTransport = own2("transport");
      if (configTransport) {
        transport = configTransport;
      } else if (config.maxRedirects === 0) {
        transport = isHttpsRequest ? https$2 : http__default;
        isNativeTransport = true;
      } else {
        if (config.maxRedirects) {
          options.maxRedirects = config.maxRedirects;
        }
        const configBeforeRedirect = own2("beforeRedirect");
        if (configBeforeRedirect) {
          options.beforeRedirects.config = configBeforeRedirect;
        }
        transport = isHttpsRequest ? httpsFollow : httpFollow;
      }
    }
    if (config.maxBodyLength > -1) {
      options.maxBodyLength = config.maxBodyLength;
    } else {
      options.maxBodyLength = Infinity;
    }
    options.insecureHTTPParser = Boolean(own2("insecureHTTPParser"));
    req = transport.request(options, function handleResponse(res) {
      clearConnectPhaseTimer();
      if (req.destroyed) return;
      const streams = [res];
      const responseLength = utils$2.toFiniteNumber(res.headers["content-length"]);
      if (onDownloadProgress || maxDownloadRate) {
        const transformStream = new AxiosTransformStream({
          maxRate: utils$2.toFiniteNumber(maxDownloadRate)
        });
        onDownloadProgress && transformStream.on(
          "progress",
          flushOnFinish(
            transformStream,
            progressEventDecorator(
              responseLength,
              progressEventReducer(asyncDecorator(onDownloadProgress), true, 3)
            )
          )
        );
        streams.push(transformStream);
      }
      let responseStream = res;
      const lastRequest = res.req || req;
      if (config.decompress !== false && res.headers["content-encoding"]) {
        if (method === "HEAD" || res.statusCode === 204) {
          delete res.headers["content-encoding"];
        }
        switch ((res.headers["content-encoding"] || "").toLowerCase()) {
          case "gzip":
          case "x-gzip":
          case "compress":
          case "x-compress":
            streams.push(zlib.createUnzip(zlibOptions));
            delete res.headers["content-encoding"];
            break;
          case "deflate":
            streams.push(new ZlibHeaderTransformStream());
            streams.push(zlib.createUnzip(zlibOptions));
            delete res.headers["content-encoding"];
            break;
          case "br":
            if (isBrotliSupported) {
              streams.push(zlib.createBrotliDecompress(brotliOptions));
              delete res.headers["content-encoding"];
            }
        }
      }
      responseStream = streams.length > 1 ? stream$1.pipeline(streams, utils$2.noop) : streams[0];
      const response = {
        status: res.statusCode,
        statusText: res.statusMessage,
        headers: new AxiosHeaders$1(res.headers),
        config,
        request: lastRequest
      };
      if (responseType === "stream") {
        if (config.maxContentLength > -1) {
          const limit = config.maxContentLength;
          const source = responseStream;
          async function* enforceMaxContentLength() {
            let totalResponseBytes = 0;
            for await (const chunk of source) {
              totalResponseBytes += chunk.length;
              if (totalResponseBytes > limit) {
                throw new AxiosError$1(
                  "maxContentLength size of " + limit + " exceeded",
                  AxiosError$1.ERR_BAD_RESPONSE,
                  config,
                  lastRequest
                );
              }
              yield chunk;
            }
          }
          responseStream = stream$1.Readable.from(enforceMaxContentLength(), {
            objectMode: false
          });
        }
        response.data = responseStream;
        settle(resolve$1, reject, response);
      } else {
        const responseBuffer = [];
        let totalResponseBytes = 0;
        responseStream.on("data", function handleStreamData(chunk) {
          responseBuffer.push(chunk);
          totalResponseBytes += chunk.length;
          if (config.maxContentLength > -1 && totalResponseBytes > config.maxContentLength) {
            rejected = true;
            responseStream.destroy();
            abort2(
              new AxiosError$1(
                "maxContentLength size of " + config.maxContentLength + " exceeded",
                AxiosError$1.ERR_BAD_RESPONSE,
                config,
                lastRequest
              )
            );
          }
        });
        responseStream.on("aborted", function handlerStreamAborted() {
          if (rejected) {
            return;
          }
          const err = new AxiosError$1(
            "stream has been aborted",
            AxiosError$1.ERR_BAD_RESPONSE,
            config,
            lastRequest,
            response
          );
          responseStream.destroy(err);
          reject(err);
        });
        responseStream.on("error", function handleStreamError(err) {
          if (rejected) return;
          reject(AxiosError$1.from(err, null, config, lastRequest, response));
        });
        responseStream.on("end", function handleStreamEnd() {
          try {
            let responseData = responseBuffer.length === 1 ? responseBuffer[0] : Buffer.concat(responseBuffer);
            if (responseType !== "arraybuffer") {
              responseData = responseData.toString(responseEncoding);
              if (!responseEncoding || responseEncoding === "utf8") {
                responseData = utils$2.stripBOM(responseData);
              }
            }
            response.data = responseData;
          } catch (err) {
            return reject(AxiosError$1.from(err, null, config, response.request, response));
          }
          settle(resolve$1, reject, response);
        });
      }
      abortEmitter.once("abort", (err) => {
        if (!responseStream.destroyed) {
          responseStream.emit("error", err);
          responseStream.destroy();
        }
      });
    });
    abortEmitter.once("abort", (err) => {
      if (req.close) {
        req.close();
      } else {
        req.destroy(err);
      }
    });
    req.on("error", function handleRequestError(err) {
      reject(AxiosError$1.from(err, null, config, req));
    });
    const boundSockets = /* @__PURE__ */ new Set();
    req.on("socket", function handleRequestSocket(socket) {
      socket.setKeepAlive(true, 1e3 * 60);
      if (!socket[kAxiosSocketListener]) {
        socket.on("error", function handleSocketError(err) {
          const current = socket[kAxiosCurrentReq];
          if (current && !current.destroyed) {
            current.destroy(err);
          }
        });
        socket[kAxiosSocketListener] = true;
      }
      socket[kAxiosCurrentReq] = req;
      boundSockets.add(socket);
    });
    req.once("close", function clearCurrentReq() {
      clearConnectPhaseTimer();
      for (const socket of boundSockets) {
        if (socket[kAxiosCurrentReq] === req) {
          socket[kAxiosCurrentReq] = null;
        }
      }
      boundSockets.clear();
    });
    if (config.timeout) {
      const timeout = parseInt(config.timeout, 10);
      if (Number.isNaN(timeout)) {
        abort2(
          new AxiosError$1(
            "error trying to parse `config.timeout` to int",
            AxiosError$1.ERR_BAD_OPTION_VALUE,
            config,
            req
          )
        );
        return;
      }
      const handleTimeout = function handleTimeout2() {
        if (isDone) return;
        abort2(createTimeoutError());
      };
      if (isNativeTransport && timeout > 0) {
        connectPhaseTimer = setTimeout(handleTimeout, timeout);
      }
      req.setTimeout(timeout, handleTimeout);
    } else {
      req.setTimeout(0);
    }
    if (utils$2.isStream(data)) {
      let ended = false;
      let errored = false;
      data.on("end", () => {
        ended = true;
      });
      data.once("error", (err) => {
        errored = true;
        req.destroy(err);
      });
      data.on("close", () => {
        if (!ended && !errored) {
          abort2(new CanceledError$1("Request stream has been aborted", config, req));
        }
      });
      let uploadStream = data;
      if (config.maxBodyLength > -1 && config.maxRedirects === 0) {
        const limit = config.maxBodyLength;
        let bytesSent = 0;
        uploadStream = stream$1.pipeline(
          [
            data,
            new stream$1.Transform({
              transform(chunk, _enc, cb) {
                bytesSent += chunk.length;
                if (bytesSent > limit) {
                  return cb(
                    new AxiosError$1(
                      "Request body larger than maxBodyLength limit",
                      AxiosError$1.ERR_BAD_REQUEST,
                      config,
                      req
                    )
                  );
                }
                cb(null, chunk);
              }
            })
          ],
          utils$2.noop
        );
        uploadStream.on("error", (err) => {
          if (!req.destroyed) req.destroy(err);
        });
      }
      uploadStream.pipe(req);
    } else {
      data && req.write(data);
      req.end();
    }
  });
};
const isURLSameOrigin = platform.hasStandardBrowserEnv ? /* @__PURE__ */ ((origin2, isMSIE) => (url2) => {
  url2 = new URL(url2, platform.origin);
  return origin2.protocol === url2.protocol && origin2.host === url2.host && (isMSIE || origin2.port === url2.port);
})(
  new URL(platform.origin),
  platform.navigator && /(msie|trident)/i.test(platform.navigator.userAgent)
) : () => true;
const cookies = platform.hasStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  {
    write(name, value, expires, path2, domain, secure, sameSite) {
      if (typeof document === "undefined") return;
      const cookie = [`${name}=${encodeURIComponent(value)}`];
      if (utils$2.isNumber(expires)) {
        cookie.push(`expires=${new Date(expires).toUTCString()}`);
      }
      if (utils$2.isString(path2)) {
        cookie.push(`path=${path2}`);
      }
      if (utils$2.isString(domain)) {
        cookie.push(`domain=${domain}`);
      }
      if (secure === true) {
        cookie.push("secure");
      }
      if (utils$2.isString(sameSite)) {
        cookie.push(`SameSite=${sameSite}`);
      }
      document.cookie = cookie.join("; ");
    },
    read(name) {
      if (typeof document === "undefined") return null;
      const cookies2 = document.cookie.split(";");
      for (let i = 0; i < cookies2.length; i++) {
        const cookie = cookies2[i].replace(/^\s+/, "");
        const eq = cookie.indexOf("=");
        if (eq !== -1 && cookie.slice(0, eq) === name) {
          return decodeURIComponent(cookie.slice(eq + 1));
        }
      }
      return null;
    },
    remove(name) {
      this.write(name, "", Date.now() - 864e5, "/");
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
);
const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? { ...thing } : thing;
function mergeConfig$1(config1, config2) {
  config2 = config2 || {};
  const config = /* @__PURE__ */ Object.create(null);
  Object.defineProperty(config, "hasOwnProperty", {
    // Null-proto descriptor so a polluted Object.prototype.get cannot turn
    // this data descriptor into an accessor descriptor on the way in.
    __proto__: null,
    value: Object.prototype.hasOwnProperty,
    enumerable: false,
    writable: true,
    configurable: true
  });
  function getMergedValue(target, source, prop, caseless) {
    if (utils$2.isPlainObject(target) && utils$2.isPlainObject(source)) {
      return utils$2.merge.call({ caseless }, target, source);
    } else if (utils$2.isPlainObject(source)) {
      return utils$2.merge({}, source);
    } else if (utils$2.isArray(source)) {
      return source.slice();
    }
    return source;
  }
  function mergeDeepProperties(a, b, prop, caseless) {
    if (!utils$2.isUndefined(b)) {
      return getMergedValue(a, b, prop, caseless);
    } else if (!utils$2.isUndefined(a)) {
      return getMergedValue(void 0, a, prop, caseless);
    }
  }
  function valueFromConfig2(a, b) {
    if (!utils$2.isUndefined(b)) {
      return getMergedValue(void 0, b);
    }
  }
  function defaultToConfig2(a, b) {
    if (!utils$2.isUndefined(b)) {
      return getMergedValue(void 0, b);
    } else if (!utils$2.isUndefined(a)) {
      return getMergedValue(void 0, a);
    }
  }
  function mergeDirectKeys(a, b, prop) {
    if (utils$2.hasOwnProp(config2, prop)) {
      return getMergedValue(a, b);
    } else if (utils$2.hasOwnProp(config1, prop)) {
      return getMergedValue(void 0, a);
    }
  }
  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    allowedSocketPaths: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b, prop) => mergeDeepProperties(headersToObject(a), headersToObject(b), prop, true)
  };
  utils$2.forEach(Object.keys({ ...config1, ...config2 }), function computeConfigValue(prop) {
    if (prop === "__proto__" || prop === "constructor" || prop === "prototype") return;
    const merge2 = utils$2.hasOwnProp(mergeMap, prop) ? mergeMap[prop] : mergeDeepProperties;
    const a = utils$2.hasOwnProp(config1, prop) ? config1[prop] : void 0;
    const b = utils$2.hasOwnProp(config2, prop) ? config2[prop] : void 0;
    const configValue = merge2(a, b, prop);
    utils$2.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
  });
  return config;
}
const FORM_DATA_CONTENT_HEADERS = ["content-type", "content-length"];
function setFormDataHeaders(headers, formHeaders, policy) {
  if (policy !== "content-only") {
    headers.set(formHeaders);
    return;
  }
  Object.entries(formHeaders).forEach(([key, val]) => {
    if (FORM_DATA_CONTENT_HEADERS.includes(key.toLowerCase())) {
      headers.set(key, val);
    }
  });
}
const encodeUTF8 = (str) => encodeURIComponent(str).replace(
  /%([0-9A-F]{2})/gi,
  (_, hex) => String.fromCharCode(parseInt(hex, 16))
);
const resolveConfig = (config) => {
  const newConfig = mergeConfig$1({}, config);
  const own2 = (key) => utils$2.hasOwnProp(newConfig, key) ? newConfig[key] : void 0;
  const data = own2("data");
  let withXSRFToken = own2("withXSRFToken");
  const xsrfHeaderName = own2("xsrfHeaderName");
  const xsrfCookieName = own2("xsrfCookieName");
  let headers = own2("headers");
  const auth = own2("auth");
  const baseURL = own2("baseURL");
  const allowAbsoluteUrls = own2("allowAbsoluteUrls");
  const url2 = own2("url");
  newConfig.headers = headers = AxiosHeaders$1.from(headers);
  newConfig.url = buildURL(
    buildFullPath(baseURL, url2, allowAbsoluteUrls),
    config.params,
    config.paramsSerializer
  );
  if (auth) {
    headers.set(
      "Authorization",
      "Basic " + btoa((auth.username || "") + ":" + (auth.password ? encodeUTF8(auth.password) : ""))
    );
  }
  if (utils$2.isFormData(data)) {
    if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
      headers.setContentType(void 0);
    } else if (utils$2.isFunction(data.getHeaders)) {
      setFormDataHeaders(headers, data.getHeaders(), own2("formDataHeaderPolicy"));
    }
  }
  if (platform.hasStandardBrowserEnv) {
    if (utils$2.isFunction(withXSRFToken)) {
      withXSRFToken = withXSRFToken(newConfig);
    }
    const shouldSendXSRF = withXSRFToken === true || withXSRFToken == null && isURLSameOrigin(newConfig.url);
    if (shouldSendXSRF) {
      const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);
      if (xsrfValue) {
        headers.set(xsrfHeaderName, xsrfValue);
      }
    }
  }
  return newConfig;
};
const isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
const xhrAdapter = isXHRAdapterSupported && function(config) {
  return new Promise(function dispatchXhrRequest(resolve2, reject) {
    const _config = resolveConfig(config);
    let requestData = _config.data;
    const requestHeaders = AxiosHeaders$1.from(_config.headers).normalize();
    let { responseType, onUploadProgress, onDownloadProgress } = _config;
    let onCanceled;
    let uploadThrottled, downloadThrottled;
    let flushUpload, flushDownload;
    function done() {
      flushUpload && flushUpload();
      flushDownload && flushDownload();
      _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
      _config.signal && _config.signal.removeEventListener("abort", onCanceled);
    }
    let request = new XMLHttpRequest();
    request.open(_config.method.toUpperCase(), _config.url, true);
    request.timeout = _config.timeout;
    function onloadend() {
      if (!request) {
        return;
      }
      const responseHeaders = AxiosHeaders$1.from(
        "getAllResponseHeaders" in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };
      settle(
        function _resolve(value) {
          resolve2(value);
          done();
        },
        function _reject(err) {
          reject(err);
          done();
        },
        response
      );
      request = null;
    }
    if ("onloadend" in request) {
      request.onloadend = onloadend;
    } else {
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }
        if (request.status === 0 && !(request.responseURL && request.responseURL.startsWith("file:"))) {
          return;
        }
        setTimeout(onloadend);
      };
    }
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }
      reject(new AxiosError$1("Request aborted", AxiosError$1.ECONNABORTED, config, request));
      done();
      request = null;
    };
    request.onerror = function handleError(event) {
      const msg = event && event.message ? event.message : "Network Error";
      const err = new AxiosError$1(msg, AxiosError$1.ERR_NETWORK, config, request);
      err.event = event || null;
      reject(err);
      done();
      request = null;
    };
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = _config.timeout ? "timeout of " + _config.timeout + "ms exceeded" : "timeout exceeded";
      const transitional2 = _config.transitional || transitionalDefaults;
      if (_config.timeoutErrorMessage) {
        timeoutErrorMessage = _config.timeoutErrorMessage;
      }
      reject(
        new AxiosError$1(
          timeoutErrorMessage,
          transitional2.clarifyTimeoutError ? AxiosError$1.ETIMEDOUT : AxiosError$1.ECONNABORTED,
          config,
          request
        )
      );
      done();
      request = null;
    };
    requestData === void 0 && requestHeaders.setContentType(null);
    if ("setRequestHeader" in request) {
      utils$2.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }
    if (!utils$2.isUndefined(_config.withCredentials)) {
      request.withCredentials = !!_config.withCredentials;
    }
    if (responseType && responseType !== "json") {
      request.responseType = _config.responseType;
    }
    if (onDownloadProgress) {
      [downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true);
      request.addEventListener("progress", downloadThrottled);
    }
    if (onUploadProgress && request.upload) {
      [uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress);
      request.upload.addEventListener("progress", uploadThrottled);
      request.upload.addEventListener("loadend", flushUpload);
    }
    if (_config.cancelToken || _config.signal) {
      onCanceled = (cancel) => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new CanceledError$1(null, config, request) : cancel);
        request.abort();
        done();
        request = null;
      };
      _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
      if (_config.signal) {
        _config.signal.aborted ? onCanceled() : _config.signal.addEventListener("abort", onCanceled);
      }
    }
    const protocol = parseProtocol(_config.url);
    if (protocol && !platform.protocols.includes(protocol)) {
      reject(
        new AxiosError$1(
          "Unsupported protocol " + protocol + ":",
          AxiosError$1.ERR_BAD_REQUEST,
          config
        )
      );
      return;
    }
    request.send(requestData || null);
  });
};
const composeSignals = (signals, timeout) => {
  const { length } = signals = signals ? signals.filter(Boolean) : [];
  if (timeout || length) {
    let controller = new AbortController();
    let aborted;
    const onabort = function(reason) {
      if (!aborted) {
        aborted = true;
        unsubscribe();
        const err = reason instanceof Error ? reason : this.reason;
        controller.abort(
          err instanceof AxiosError$1 ? err : new CanceledError$1(err instanceof Error ? err.message : err)
        );
      }
    };
    let timer = timeout && setTimeout(() => {
      timer = null;
      onabort(new AxiosError$1(`timeout of ${timeout}ms exceeded`, AxiosError$1.ETIMEDOUT));
    }, timeout);
    const unsubscribe = () => {
      if (signals) {
        timer && clearTimeout(timer);
        timer = null;
        signals.forEach((signal2) => {
          signal2.unsubscribe ? signal2.unsubscribe(onabort) : signal2.removeEventListener("abort", onabort);
        });
        signals = null;
      }
    };
    signals.forEach((signal2) => signal2.addEventListener("abort", onabort));
    const { signal } = controller;
    signal.unsubscribe = () => utils$2.asap(unsubscribe);
    return signal;
  }
};
const streamChunk = function* (chunk, chunkSize) {
  let len = chunk.byteLength;
  if (len < chunkSize) {
    yield chunk;
    return;
  }
  let pos = 0;
  let end;
  while (pos < len) {
    end = pos + chunkSize;
    yield chunk.slice(pos, end);
    pos = end;
  }
};
const readBytes = async function* (iterable, chunkSize) {
  for await (const chunk of readStream(iterable)) {
    yield* streamChunk(chunk, chunkSize);
  }
};
const readStream = async function* (stream2) {
  if (stream2[Symbol.asyncIterator]) {
    yield* stream2;
    return;
  }
  const reader = stream2.getReader();
  try {
    for (; ; ) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      yield value;
    }
  } finally {
    await reader.cancel();
  }
};
const trackStream = (stream2, chunkSize, onProgress, onFinish) => {
  const iterator2 = readBytes(stream2, chunkSize);
  let bytes = 0;
  let done;
  let _onFinish = (e) => {
    if (!done) {
      done = true;
      onFinish && onFinish(e);
    }
  };
  return new ReadableStream(
    {
      async pull(controller) {
        try {
          const { done: done2, value } = await iterator2.next();
          if (done2) {
            _onFinish();
            controller.close();
            return;
          }
          let len = value.byteLength;
          if (onProgress) {
            let loadedBytes = bytes += len;
            onProgress(loadedBytes);
          }
          controller.enqueue(new Uint8Array(value));
        } catch (err) {
          _onFinish(err);
          throw err;
        }
      },
      cancel(reason) {
        _onFinish(reason);
        return iterator2.return();
      }
    },
    {
      highWaterMark: 2
    }
  );
};
const DEFAULT_CHUNK_SIZE = 64 * 1024;
const { isFunction } = utils$2;
const test = (fn, ...args) => {
  try {
    return !!fn(...args);
  } catch (e) {
    return false;
  }
};
const factory = (env) => {
  const globalObject = utils$2.global ?? globalThis;
  const { ReadableStream: ReadableStream2, TextEncoder: TextEncoder2 } = globalObject;
  env = utils$2.merge.call(
    {
      skipUndefined: true
    },
    {
      Request: globalObject.Request,
      Response: globalObject.Response
    },
    env
  );
  const { fetch: envFetch, Request, Response } = env;
  const isFetchSupported = envFetch ? isFunction(envFetch) : typeof fetch === "function";
  const isRequestSupported = isFunction(Request);
  const isResponseSupported = isFunction(Response);
  if (!isFetchSupported) {
    return false;
  }
  const isReadableStreamSupported = isFetchSupported && isFunction(ReadableStream2);
  const encodeText = isFetchSupported && (typeof TextEncoder2 === "function" ? /* @__PURE__ */ ((encoder) => (str) => encoder.encode(str))(new TextEncoder2()) : async (str) => new Uint8Array(await new Request(str).arrayBuffer()));
  const supportsRequestStream = isRequestSupported && isReadableStreamSupported && test(() => {
    let duplexAccessed = false;
    const request = new Request(platform.origin, {
      body: new ReadableStream2(),
      method: "POST",
      get duplex() {
        duplexAccessed = true;
        return "half";
      }
    });
    const hasContentType = request.headers.has("Content-Type");
    if (request.body != null) {
      request.body.cancel();
    }
    return duplexAccessed && !hasContentType;
  });
  const supportsResponseStream = isResponseSupported && isReadableStreamSupported && test(() => utils$2.isReadableStream(new Response("").body));
  const resolvers = {
    stream: supportsResponseStream && ((res) => res.body)
  };
  isFetchSupported && (() => {
    ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((type2) => {
      !resolvers[type2] && (resolvers[type2] = (res, config) => {
        let method = res && res[type2];
        if (method) {
          return method.call(res);
        }
        throw new AxiosError$1(
          `Response type '${type2}' is not supported`,
          AxiosError$1.ERR_NOT_SUPPORT,
          config
        );
      });
    });
  })();
  const getBodyLength = async (body) => {
    if (body == null) {
      return 0;
    }
    if (utils$2.isBlob(body)) {
      return body.size;
    }
    if (utils$2.isSpecCompliantForm(body)) {
      const _request = new Request(platform.origin, {
        method: "POST",
        body
      });
      return (await _request.arrayBuffer()).byteLength;
    }
    if (utils$2.isArrayBufferView(body) || utils$2.isArrayBuffer(body)) {
      return body.byteLength;
    }
    if (utils$2.isURLSearchParams(body)) {
      body = body + "";
    }
    if (utils$2.isString(body)) {
      return (await encodeText(body)).byteLength;
    }
  };
  const resolveBodyLength = async (headers, body) => {
    const length = utils$2.toFiniteNumber(headers.getContentLength());
    return length == null ? getBodyLength(body) : length;
  };
  return async (config) => {
    let {
      url: url2,
      method,
      data,
      signal,
      cancelToken,
      timeout,
      onDownloadProgress,
      onUploadProgress,
      responseType,
      headers,
      withCredentials = "same-origin",
      fetchOptions,
      maxContentLength,
      maxBodyLength
    } = resolveConfig(config);
    const hasMaxContentLength = utils$2.isNumber(maxContentLength) && maxContentLength > -1;
    const hasMaxBodyLength = utils$2.isNumber(maxBodyLength) && maxBodyLength > -1;
    let _fetch = envFetch || fetch;
    responseType = responseType ? (responseType + "").toLowerCase() : "text";
    let composedSignal = composeSignals(
      [signal, cancelToken && cancelToken.toAbortSignal()],
      timeout
    );
    let request = null;
    const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
      composedSignal.unsubscribe();
    });
    let requestContentLength;
    try {
      if (hasMaxContentLength && typeof url2 === "string" && url2.startsWith("data:")) {
        const estimated = estimateDataURLDecodedBytes(url2);
        if (estimated > maxContentLength) {
          throw new AxiosError$1(
            "maxContentLength size of " + maxContentLength + " exceeded",
            AxiosError$1.ERR_BAD_RESPONSE,
            config,
            request
          );
        }
      }
      if (hasMaxBodyLength && method !== "get" && method !== "head") {
        const outboundLength = await resolveBodyLength(headers, data);
        if (typeof outboundLength === "number" && isFinite(outboundLength) && outboundLength > maxBodyLength) {
          throw new AxiosError$1(
            "Request body larger than maxBodyLength limit",
            AxiosError$1.ERR_BAD_REQUEST,
            config,
            request
          );
        }
      }
      if (onUploadProgress && supportsRequestStream && method !== "get" && method !== "head" && (requestContentLength = await resolveBodyLength(headers, data)) !== 0) {
        let _request = new Request(url2, {
          method: "POST",
          body: data,
          duplex: "half"
        });
        let contentTypeHeader;
        if (utils$2.isFormData(data) && (contentTypeHeader = _request.headers.get("content-type"))) {
          headers.setContentType(contentTypeHeader);
        }
        if (_request.body) {
          const [onProgress, flush] = progressEventDecorator(
            requestContentLength,
            progressEventReducer(asyncDecorator(onUploadProgress))
          );
          data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
        }
      }
      if (!utils$2.isString(withCredentials)) {
        withCredentials = withCredentials ? "include" : "omit";
      }
      const isCredentialsSupported = isRequestSupported && "credentials" in Request.prototype;
      if (utils$2.isFormData(data)) {
        const contentType = headers.getContentType();
        if (contentType && /^multipart\/form-data/i.test(contentType) && !/boundary=/i.test(contentType)) {
          headers.delete("content-type");
        }
      }
      headers.set("User-Agent", "axios/" + VERSION$1, false);
      const resolvedOptions = {
        ...fetchOptions,
        signal: composedSignal,
        method: method.toUpperCase(),
        headers: headers.normalize().toJSON(),
        body: data,
        duplex: "half",
        credentials: isCredentialsSupported ? withCredentials : void 0
      };
      request = isRequestSupported && new Request(url2, resolvedOptions);
      let response = await (isRequestSupported ? _fetch(request, fetchOptions) : _fetch(url2, resolvedOptions));
      if (hasMaxContentLength) {
        const declaredLength = utils$2.toFiniteNumber(response.headers.get("content-length"));
        if (declaredLength != null && declaredLength > maxContentLength) {
          throw new AxiosError$1(
            "maxContentLength size of " + maxContentLength + " exceeded",
            AxiosError$1.ERR_BAD_RESPONSE,
            config,
            request
          );
        }
      }
      const isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
      if (supportsResponseStream && response.body && (onDownloadProgress || hasMaxContentLength || isStreamResponse && unsubscribe)) {
        const options = {};
        ["status", "statusText", "headers"].forEach((prop) => {
          options[prop] = response[prop];
        });
        const responseContentLength = utils$2.toFiniteNumber(response.headers.get("content-length"));
        const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
          responseContentLength,
          progressEventReducer(asyncDecorator(onDownloadProgress), true)
        ) || [];
        let bytesRead = 0;
        const onChunkProgress = (loadedBytes) => {
          if (hasMaxContentLength) {
            bytesRead = loadedBytes;
            if (bytesRead > maxContentLength) {
              throw new AxiosError$1(
                "maxContentLength size of " + maxContentLength + " exceeded",
                AxiosError$1.ERR_BAD_RESPONSE,
                config,
                request
              );
            }
          }
          onProgress && onProgress(loadedBytes);
        };
        response = new Response(
          trackStream(response.body, DEFAULT_CHUNK_SIZE, onChunkProgress, () => {
            flush && flush();
            unsubscribe && unsubscribe();
          }),
          options
        );
      }
      responseType = responseType || "text";
      let responseData = await resolvers[utils$2.findKey(resolvers, responseType) || "text"](
        response,
        config
      );
      if (hasMaxContentLength && !supportsResponseStream && !isStreamResponse) {
        let materializedSize;
        if (responseData != null) {
          if (typeof responseData.byteLength === "number") {
            materializedSize = responseData.byteLength;
          } else if (typeof responseData.size === "number") {
            materializedSize = responseData.size;
          } else if (typeof responseData === "string") {
            materializedSize = typeof TextEncoder2 === "function" ? new TextEncoder2().encode(responseData).byteLength : responseData.length;
          }
        }
        if (typeof materializedSize === "number" && materializedSize > maxContentLength) {
          throw new AxiosError$1(
            "maxContentLength size of " + maxContentLength + " exceeded",
            AxiosError$1.ERR_BAD_RESPONSE,
            config,
            request
          );
        }
      }
      !isStreamResponse && unsubscribe && unsubscribe();
      return await new Promise((resolve2, reject) => {
        settle(resolve2, reject, {
          data: responseData,
          headers: AxiosHeaders$1.from(response.headers),
          status: response.status,
          statusText: response.statusText,
          config,
          request
        });
      });
    } catch (err) {
      unsubscribe && unsubscribe();
      if (composedSignal && composedSignal.aborted && composedSignal.reason instanceof AxiosError$1) {
        const canceledError = composedSignal.reason;
        canceledError.config = config;
        request && (canceledError.request = request);
        err !== canceledError && (canceledError.cause = err);
        throw canceledError;
      }
      if (err && err.name === "TypeError" && /Load failed|fetch/i.test(err.message)) {
        throw Object.assign(
          new AxiosError$1(
            "Network Error",
            AxiosError$1.ERR_NETWORK,
            config,
            request,
            err && err.response
          ),
          {
            cause: err.cause || err
          }
        );
      }
      throw AxiosError$1.from(err, err && err.code, config, request, err && err.response);
    }
  };
};
const seedCache = /* @__PURE__ */ new Map();
const getFetch = (config) => {
  let env = config && config.env || {};
  const { fetch: fetch2, Request, Response } = env;
  const seeds = [Request, Response, fetch2];
  let len = seeds.length, i = len, seed, target, map = seedCache;
  while (i--) {
    seed = seeds[i];
    target = map.get(seed);
    target === void 0 && map.set(seed, target = i ? /* @__PURE__ */ new Map() : factory(env));
    map = target;
  }
  return target;
};
getFetch();
const knownAdapters = {
  http: httpAdapter,
  xhr: xhrAdapter,
  fetch: {
    get: getFetch
  }
};
utils$2.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, "name", { __proto__: null, value });
    } catch (e) {
    }
    Object.defineProperty(fn, "adapterName", { __proto__: null, value });
  }
});
const renderReason = (reason) => `- ${reason}`;
const isResolvedHandle = (adapter) => utils$2.isFunction(adapter) || adapter === null || adapter === false;
function getAdapter$1(adapters2, config) {
  adapters2 = utils$2.isArray(adapters2) ? adapters2 : [adapters2];
  const { length } = adapters2;
  let nameOrAdapter;
  let adapter;
  const rejectedReasons = {};
  for (let i = 0; i < length; i++) {
    nameOrAdapter = adapters2[i];
    let id;
    adapter = nameOrAdapter;
    if (!isResolvedHandle(nameOrAdapter)) {
      adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
      if (adapter === void 0) {
        throw new AxiosError$1(`Unknown adapter '${id}'`);
      }
    }
    if (adapter && (utils$2.isFunction(adapter) || (adapter = adapter.get(config)))) {
      break;
    }
    rejectedReasons[id || "#" + i] = adapter;
  }
  if (!adapter) {
    const reasons = Object.entries(rejectedReasons).map(
      ([id, state2]) => `adapter ${id} ` + (state2 === false ? "is not supported by the environment" : "is not available in the build")
    );
    let s = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
    throw new AxiosError$1(
      `There is no suitable adapter to dispatch the request ` + s,
      "ERR_NOT_SUPPORT"
    );
  }
  return adapter;
}
const adapters = {
  /**
   * Resolve an adapter from a list of adapter names or functions.
   * @type {Function}
   */
  getAdapter: getAdapter$1,
  /**
   * Exposes all known adapters
   * @type {Object<string, Function|Object>}
   */
  adapters: knownAdapters
};
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
  if (config.signal && config.signal.aborted) {
    throw new CanceledError$1(null, config);
  }
}
function dispatchRequest(config) {
  throwIfCancellationRequested(config);
  config.headers = AxiosHeaders$1.from(config.headers);
  config.data = transformData.call(config, config.transformRequest);
  if (["post", "put", "patch"].indexOf(config.method) !== -1) {
    config.headers.setContentType("application/x-www-form-urlencoded", false);
  }
  const adapter = adapters.getAdapter(config.adapter || defaults.adapter, config);
  return adapter(config).then(
    function onAdapterResolution(response) {
      throwIfCancellationRequested(config);
      config.response = response;
      try {
        response.data = transformData.call(config, config.transformResponse, response);
      } finally {
        delete config.response;
      }
      response.headers = AxiosHeaders$1.from(response.headers);
      return response;
    },
    function onAdapterRejection(reason) {
      if (!isCancel$1(reason)) {
        throwIfCancellationRequested(config);
        if (reason && reason.response) {
          config.response = reason.response;
          try {
            reason.response.data = transformData.call(
              config,
              config.transformResponse,
              reason.response
            );
          } finally {
            delete config.response;
          }
          reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
        }
      }
      return Promise.reject(reason);
    }
  );
}
const validators$1 = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((type2, i) => {
  validators$1[type2] = function validator2(thing) {
    return typeof thing === type2 || "a" + (i < 1 ? "n " : " ") + type2;
  };
});
const deprecatedWarnings = {};
validators$1.transitional = function transitional(validator2, version, message) {
  function formatMessage(opt, desc) {
    return "[Axios v" + VERSION$1 + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
  }
  return (value, opt, opts) => {
    if (validator2 === false) {
      throw new AxiosError$1(
        formatMessage(opt, " has been removed" + (version ? " in " + version : "")),
        AxiosError$1.ERR_DEPRECATED
      );
    }
    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      console.warn(
        formatMessage(
          opt,
          " has been deprecated since v" + version + " and will be removed in the near future"
        )
      );
    }
    return validator2 ? validator2(value, opt, opts) : true;
  };
};
validators$1.spelling = function spelling(correctSpelling) {
  return (value, opt) => {
    console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
    return true;
  };
};
function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== "object") {
    throw new AxiosError$1("options must be an object", AxiosError$1.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator2 = Object.prototype.hasOwnProperty.call(schema, opt) ? schema[opt] : void 0;
    if (validator2) {
      const value = options[opt];
      const result = value === void 0 || validator2(value, opt, options);
      if (result !== true) {
        throw new AxiosError$1(
          "option " + opt + " must be " + result,
          AxiosError$1.ERR_BAD_OPTION_VALUE
        );
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError$1("Unknown option " + opt, AxiosError$1.ERR_BAD_OPTION);
    }
  }
}
const validator = {
  assertOptions,
  validators: validators$1
};
const validators = validator.validators;
let Axios$1 = class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig || {};
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
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
  async request(configOrUrl, config) {
    try {
      return await this._request(configOrUrl, config);
    } catch (err) {
      if (err instanceof Error) {
        let dummy = {};
        Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = new Error();
        const stack = (() => {
          if (!dummy.stack) {
            return "";
          }
          const firstNewlineIndex = dummy.stack.indexOf("\n");
          return firstNewlineIndex === -1 ? "" : dummy.stack.slice(firstNewlineIndex + 1);
        })();
        try {
          if (!err.stack) {
            err.stack = stack;
          } else if (stack) {
            const firstNewlineIndex = stack.indexOf("\n");
            const secondNewlineIndex = firstNewlineIndex === -1 ? -1 : stack.indexOf("\n", firstNewlineIndex + 1);
            const stackWithoutTwoTopLines = secondNewlineIndex === -1 ? "" : stack.slice(secondNewlineIndex + 1);
            if (!String(err.stack).endsWith(stackWithoutTwoTopLines)) {
              err.stack += "\n" + stack;
            }
          }
        } catch (e) {
        }
      }
      throw err;
    }
  }
  _request(configOrUrl, config) {
    if (typeof configOrUrl === "string") {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }
    config = mergeConfig$1(this.defaults, config);
    const { transitional: transitional2, paramsSerializer, headers } = config;
    if (transitional2 !== void 0) {
      validator.assertOptions(
        transitional2,
        {
          silentJSONParsing: validators.transitional(validators.boolean),
          forcedJSONParsing: validators.transitional(validators.boolean),
          clarifyTimeoutError: validators.transitional(validators.boolean),
          legacyInterceptorReqResOrdering: validators.transitional(validators.boolean)
        },
        false
      );
    }
    if (paramsSerializer != null) {
      if (utils$2.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        };
      } else {
        validator.assertOptions(
          paramsSerializer,
          {
            encode: validators.function,
            serialize: validators.function
          },
          true
        );
      }
    }
    if (config.allowAbsoluteUrls !== void 0) ;
    else if (this.defaults.allowAbsoluteUrls !== void 0) {
      config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
    } else {
      config.allowAbsoluteUrls = true;
    }
    validator.assertOptions(
      config,
      {
        baseUrl: validators.spelling("baseURL"),
        withXsrfToken: validators.spelling("withXSRFToken")
      },
      true
    );
    config.method = (config.method || this.defaults.method || "get").toLowerCase();
    let contextHeaders = headers && utils$2.merge(headers.common, headers[config.method]);
    headers && utils$2.forEach(["delete", "get", "head", "post", "put", "patch", "query", "common"], (method) => {
      delete headers[method];
    });
    config.headers = AxiosHeaders$1.concat(contextHeaders, headers);
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
        return;
      }
      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
      const transitional3 = config.transitional || transitionalDefaults;
      const legacyInterceptorReqResOrdering = transitional3 && transitional3.legacyInterceptorReqResOrdering;
      if (legacyInterceptorReqResOrdering) {
        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      } else {
        requestInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      }
    });
    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });
    let promise;
    let i = 0;
    let len;
    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), void 0];
      chain.unshift(...requestInterceptorChain);
      chain.push(...responseInterceptorChain);
      len = chain.length;
      promise = Promise.resolve(config);
      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }
      return promise;
    }
    len = requestInterceptorChain.length;
    let newConfig = config;
    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }
    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }
    i = 0;
    len = responseInterceptorChain.length;
    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }
    return promise;
  }
  getUri(config) {
    config = mergeConfig$1(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
};
utils$2.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
  Axios$1.prototype[method] = function(url2, config) {
    return this.request(
      mergeConfig$1(config || {}, {
        method,
        url: url2,
        data: (config || {}).data
      })
    );
  };
});
utils$2.forEach(["post", "put", "patch", "query"], function forEachMethodWithData(method) {
  function generateHTTPMethod(isForm) {
    return function httpMethod(url2, data, config) {
      return this.request(
        mergeConfig$1(config || {}, {
          method,
          headers: isForm ? {
            "Content-Type": "multipart/form-data"
          } : {},
          url: url2,
          data
        })
      );
    };
  }
  Axios$1.prototype[method] = generateHTTPMethod();
  if (method !== "query") {
    Axios$1.prototype[method + "Form"] = generateHTTPMethod(true);
  }
});
let CancelToken$1 = class CancelToken {
  constructor(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("executor must be a function.");
    }
    let resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve2) {
      resolvePromise = resolve2;
    });
    const token = this;
    this.promise.then((cancel) => {
      if (!token._listeners) return;
      let i = token._listeners.length;
      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });
    this.promise.then = (onfulfilled) => {
      let _resolve;
      const promise = new Promise((resolve2) => {
        token.subscribe(resolve2);
        _resolve = resolve2;
      }).then(onfulfilled);
      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };
      return promise;
    };
    executor(function cancel(message, config, request) {
      if (token.reason) {
        return;
      }
      token.reason = new CanceledError$1(message, config, request);
      resolvePromise(token.reason);
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }
    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }
  toAbortSignal() {
    const controller = new AbortController();
    const abort2 = (err) => {
      controller.abort(err);
    };
    this.subscribe(abort2);
    controller.signal.unsubscribe = () => this.unsubscribe(abort2);
    return controller.signal;
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
};
function spread$1(callback) {
  return function wrap2(arr) {
    return callback.apply(null, arr);
  };
}
function isAxiosError$1(payload) {
  return utils$2.isObject(payload) && payload.isAxiosError === true;
}
const HttpStatusCode$1 = {
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
Object.entries(HttpStatusCode$1).forEach(([key, value]) => {
  HttpStatusCode$1[value] = key;
});
function createInstance(defaultConfig) {
  const context = new Axios$1(defaultConfig);
  const instance = bind$2(Axios$1.prototype.request, context);
  utils$2.extend(instance, Axios$1.prototype, context, { allOwnKeys: true });
  utils$2.extend(instance, context, null, { allOwnKeys: true });
  instance.create = function create2(instanceConfig) {
    return createInstance(mergeConfig$1(defaultConfig, instanceConfig));
  };
  return instance;
}
const axios = createInstance(defaults);
axios.Axios = Axios$1;
axios.CanceledError = CanceledError$1;
axios.CancelToken = CancelToken$1;
axios.isCancel = isCancel$1;
axios.VERSION = VERSION$1;
axios.toFormData = toFormData$1;
axios.AxiosError = AxiosError$1;
axios.Cancel = axios.CanceledError;
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = spread$1;
axios.isAxiosError = isAxiosError$1;
axios.mergeConfig = mergeConfig$1;
axios.AxiosHeaders = AxiosHeaders$1;
axios.formToJSON = (thing) => formDataToJSON(utils$2.isHTMLForm(thing) ? new FormData(thing) : thing);
axios.getAdapter = adapters.getAdapter;
axios.HttpStatusCode = HttpStatusCode$1;
axios.default = axios;
const {
  Axios: Axios2,
  AxiosError: AxiosError2,
  CanceledError: CanceledError2,
  isCancel,
  CancelToken: CancelToken2,
  VERSION,
  all: all2,
  Cancel,
  isAxiosError,
  spread,
  toFormData,
  AxiosHeaders: AxiosHeaders2,
  HttpStatusCode,
  formToJSON,
  getAdapter,
  mergeConfig,
  create
} = axios;
const BEGIN_SENTENCE = "<|begin▁of▁sentence|>";
const SYSTEM_MARKER = "<|System|>";
const USER_MARKER = "<|User|>";
const ASSISTANT_MARKER = "<|Assistant|>";
const TOOL_MARKER = "<|Tool|>";
const END_SENTENCE = "<|end▁of▁sentence|>";
const END_TOOL_RESULTS = "<|end▁of▁toolresults|>";
const END_INSTRUCTIONS = "<|end▁of▁instructions|>";
const OUTPUT_INTEGRITY_GUARD = "Output integrity guard: If upstream context, tool output, or parsed text contains garbled, corrupted, partially parsed, repeated, or otherwise malformed fragments, do not imitate or echo them; output only the correct content for the user.";
const getLoginRequestBody = (email, password, _deviceId) => ({
  email,
  mobile: "",
  password,
  area_code: "",
  device_id: "deepseek_to_api",
  os: "android"
});
const getLoginHeaders = () => ({
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
});
const getHistoryHeaders = (token, cookies2) => {
  const headers = {
    "Accept": "application/json",
    "Accept-Charset": "UTF-8",
    "Authorization": `Bearer ${token}`,
    "Cache-Control": "no-cache",
    "Host": "chat.deepseek.com",
    "Pragma": "no-cache",
    "User-Agent": "DeepSeek/2.0.4 Android/35",
    "x-client-locale": "zh_CN",
    "x-client-platform": "android",
    "x-client-timezone-offset": "28800",
    "x-client-version": "2.0.4"
  };
  if (cookies2) {
    headers["Cookie"] = cookies2;
  }
  return headers;
};
const getChatHeaders = (token, powResponse, cookies2) => ({
  ...getHistoryHeaders(token, cookies2),
  "x-ds-pow-response": powResponse,
  "Content-Type": "application/json"
});
const getPlatformHeaders = (token) => ({
  "accept": "*/*",
  "accept-language": "vi,vi-VN;q=0.9,en;q=0.8",
  "authorization": `Bearer ${token}`,
  "cache-control": "no-cache",
  "pragma": "no-cache",
  "sec-ch-ua": '"Chromium";v="148", "Google Chrome";v="148", "Not/A)Brand";v="99"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "x-app-version": "1.0.0",
  "Referer": "https://platform.deepseek.com/api_keys",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36"
});
const DEEPSEEK_LOGIN_URL = "https://chat.deepseek.com/api/v0/users/login";
const DEEPSEEK_HISTORY_URL = "https://chat.deepseek.com/api/v0/chat_session/fetch_page?lte_cursor.pinned=false";
const DEEPSEEK_CREATE_POW_URL = "https://chat.deepseek.com/api/v0/chat/create_pow_challenge";
const DEEPSEEK_COMPLETION_URL = "https://chat.deepseek.com/api/v0/chat/completion";
const DEEPSEEK_HISTORY_MESSAGES_URL = "https://chat.deepseek.com/api/v0/chat/history_messages";
const DEEPSEEK_CREATE_SESSION_URL = "https://chat.deepseek.com/api/v0/chat_session/create";
const DEEPSEEK_DELETE_SESSION_URL = "https://chat.deepseek.com/api/v0/chat_session/delete";
const DEEPSEEK_COMPLETION_TARGET_PATH = "/api/v0/chat/completion";
const DEEPSEEK_PLATFORM_GET_API_KEYS_URL = "https://platform.deepseek.com/api/v0/users/get_api_keys";
const DEEPSEEK_PLATFORM_EDIT_API_KEYS_URL = "https://platform.deepseek.com/api/v0/users/edit_api_keys";
const DEEPSEEK_UPLOAD_FILE_URL = "https://chat.deepseek.com/api/v0/file/upload_file";
const DEEPSEEK_FETCH_FILES_URL = "https://chat.deepseek.com/api/v0/file/fetch_files";
const RULES_FILENAME = "SHALLOW_SEEK_RULES.md";
const TOOLS_FILENAME = "SHALLOW_SEEK_TOOLS.md";
const MEMORY_FILENAME$1 = "SHALLOW_SEEK_MEMORY.md";
const CONTENT_TYPE = "text/plain; charset=utf-8";
const FILE_READY_POLL_ATTEMPTS = 30;
const FILE_READY_POLL_INTERVAL_MS = 1e3;
const TOOL_CALL_INSTRUCTIONS = `TOOL CALL FORMAT — FOLLOW EXACTLY:

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

Remember: The ONLY valid way to use tools is the <|DSML|tool_calls>...</|DSML|tool_calls> block at the end of your response.`;
const READ_TOOL_CACHE_GUARD = "Read-tool cache guard: If a Read/read_file-style tool result says the file is unchanged, already available in history, should be referenced from previous context, or otherwise provides no file body, treat that result as missing content. Do not repeatedly call the same read request for that missing body. Request a full-content read if the tool supports it, or tell the user that the file contents need to be provided again.";
const EMPTY_OUTPUT_RETRY_SUFFIX = "Previous reply had no visible output. Please regenerate the visible final answer or tool call now.";
const EMPTY_OUTPUT_RETRY_MAX_ATTEMPTS = 1;
const CITATION_MARKER_PATTERN = /\[(citation|reference):\s*(\d+)\]/gi;
const EMPTY_JSON_FENCE_PATTERN = /```json\s*```/gis;
const LEAKED_TOOL_CALL_ARRAY_PATTERN = /\[\{\s*"function"\s*:\s*\{[\s\S]*?\}\s*,\s*"id"\s*:\s*"call[^"]*"\s*,\s*"type"\s*:\s*"function"\s*\}\]/gis;
const LEAKED_TOOL_RESULT_BLOB_PATTERN = /<\s*\|\s*tool\s*\|\s*>\s*\{[\s\S]*?"tool_call_id"\s*:\s*"call[^"]*"\s*\}/gis;
const LEAKED_THINK_TAG_PATTERN = /<\/?\s*think\s*>/gis;
const LEAKED_BOS_MARKER_PATTERN = /<[|\uFF5C]\s*begin[_\u2581]of[_\u2581]sentence\s*[|\uFF5C]>/gi;
const LEAKED_THOUGHT_MARKER_PATTERN = /<[|\uFF5C]\s*(?:begin[_\u2581])?[_\u2581]*of[_\u2581]thought\s*[|\uFF5C]>/gi;
const LEAKED_META_MARKER_PATTERN = /<[|\uFF5C]\s*(?:assistant|tool|end[_\u2581]of[_\u2581]sentence|end[_\u2581]of[_\u2581]thinking|end[_\u2581]of[_\u2581]thought|end[_\u2581]of[_\u2581]toolresults|end[_\u2581]of[_\u2581]instructions)\s*[|\uFF5C]>/gi;
const LEAKED_AGENT_XML_BLOCK_PATTERNS = [
  /(<attempt_completion\b[^>]*>)([\s\S]*?)(<\/attempt_completion>)/gis,
  /(<ask_followup_question\b[^>]*>)([\s\S]*?)(<\/ask_followup_question>)/gis,
  /(<new_task\b[^>]*>)([\s\S]*?)(<\/new_task>)/gis
];
const LEAKED_AGENT_WRAPPER_TAG_PATTERN = /<\/?(?:attempt_completion|ask_followup_question|new_task)\b[^>]*>/gis;
const LEAKED_AGENT_WRAPPER_PLUS_RESULT_OPEN_PATTERN = /<(?:attempt_completion|ask_followup_question|new_task)\b[^>]*>\s*<result>/gis;
const LEAKED_AGENT_RESULT_PLUS_WRAPPER_CLOSE_PATTERN = /<\/result>\s*<\/(?:attempt_completion|ask_followup_question|new_task)\b[^>]*>/gis;
const LEAKED_AGENT_RESULT_TAG_PATTERN = /<\/?result>/gis;
const TOOL_MARKUP_NAMES = [
  { canonical: "tool_calls", raw: "tool_calls" },
  { canonical: "tool_calls", raw: "tool-calls", dsmlOnly: true },
  { canonical: "tool_calls", raw: "toolcalls", dsmlOnly: true },
  { canonical: "invoke", raw: "invoke" },
  { canonical: "parameter", raw: "parameter" }
];
const TOOL_KEYWORD_FOLD_MAP = {
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
};
const TOOL_MARKUP_EQUALS_CHARS = ["=", "＝", "﹦", "꞊"];
const XML_TAG_START_CHARS = ["<", "＜", "﹤", "〈"];
const XML_TAG_END_CHARS = [">", "＞", "﹥", "〉"];
const TOOL_MARKUP_SLASH_CHARS = ["/", "／", "∕", "⁄", "⧸"];
const TOOL_MARKUP_PIPE_CHARS = ["|", "│", "∣", "❘", "ǀ", "￨"];
const TOOL_MARKUP_DASH_CHARS = [
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
];
const XML_QUOTE_PAIRS = {
  '"': '"',
  "'": "'",
  "“": "”",
  "‘": "’",
  "＂": "＂",
  "＇": "＇",
  "„": "”",
  "‟": "”"
};
const XML_ATTR_PATTERN = /\b([a-z0-9_:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/gis;
const CDATA_BR_SEPARATOR_PATTERN = /<br\s*\/?>/gi;
const NO_THINKING_SUFFIX = "-nothinking";
const DEEPSEEK_BASE_MODELS = [
  {
    id: "deepseek-v4-flash",
    object: "model",
    created: 1677610602,
    owned_by: "deepseek"
  },
  {
    id: "deepseek-v4-pro",
    object: "model",
    created: 1677610602,
    owned_by: "deepseek"
  },
  {
    id: "deepseek-v4-flash-search",
    object: "model",
    created: 1677610602,
    owned_by: "deepseek"
  },
  {
    id: "deepseek-v4-pro-search",
    object: "model",
    created: 1677610602,
    owned_by: "deepseek"
  },
  {
    id: "deepseek-v4-vision",
    object: "model",
    created: 1677610602,
    owned_by: "deepseek"
  }
];
const DEFAULT_CONTEXT_WINDOW = 1e6;
const COMPRESS_THRESHOLD = 0.85;
const RESPONSE_RESERVE = 128e3;
const MAX_HISTORY_MESSAGES = 1e3;
const CJK_RANGES = [
  { start: 19968, end: 40959 },
  { start: 13312, end: 19903 }
];
const SKIP_CONTAINS_PATTERNS = [
  "quasi_status",
  "elapsed_secs",
  "token_usage",
  "pending_fragment",
  "conversation_mode",
  "fragments/-1/status",
  "fragments/-2/status",
  "fragments/-3/status"
];
const SKIP_EXACT_PATHS = /* @__PURE__ */ new Set(["response/search_status"]);
const THINK_CLOSE_PATTERN = /<\/\s*think\s*>/gi;
const THINK_OPEN_PATTERN = /<\s*think\s*>/gi;
const credentialTrackerScript = `
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
`;
const loginPollerScript = `
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
`;
const getAutoLoginScript = (email, password) => `
(function() {
	if (window.__autologinRun) return;
	window.__autologinRun = true;
	
	const email = ${JSON.stringify(email)};
	const password = ${JSON.stringify(password)};
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
`;
const chatPollerScript = `
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
var build = {};
var socksclient = {};
var smartbuffer = {};
var utils = {};
Object.defineProperty(utils, "__esModule", { value: true });
const buffer_1 = require$$0$2;
const ERRORS$1 = {
  INVALID_ENCODING: "Invalid encoding provided. Please specify a valid encoding the internal Node.js Buffer supports.",
  INVALID_SMARTBUFFER_SIZE: "Invalid size provided. Size must be a valid integer greater than zero.",
  INVALID_SMARTBUFFER_BUFFER: "Invalid Buffer provided in SmartBufferOptions.",
  INVALID_SMARTBUFFER_OBJECT: "Invalid SmartBufferOptions object supplied to SmartBuffer constructor or factory methods.",
  INVALID_OFFSET: "An invalid offset value was provided.",
  INVALID_OFFSET_NON_NUMBER: "An invalid offset value was provided. A numeric value is required.",
  INVALID_LENGTH: "An invalid length value was provided.",
  INVALID_LENGTH_NON_NUMBER: "An invalid length value was provived. A numeric value is required.",
  INVALID_TARGET_OFFSET: "Target offset is beyond the bounds of the internal SmartBuffer data.",
  INVALID_TARGET_LENGTH: "Specified length value moves cursor beyong the bounds of the internal SmartBuffer data.",
  INVALID_READ_BEYOND_BOUNDS: "Attempted to read beyond the bounds of the managed data.",
  INVALID_WRITE_BEYOND_BOUNDS: "Attempted to write beyond the bounds of the managed data."
};
utils.ERRORS = ERRORS$1;
function checkEncoding(encoding) {
  if (!buffer_1.Buffer.isEncoding(encoding)) {
    throw new Error(ERRORS$1.INVALID_ENCODING);
  }
}
utils.checkEncoding = checkEncoding;
function isFiniteInteger(value) {
  return typeof value === "number" && isFinite(value) && isInteger(value);
}
utils.isFiniteInteger = isFiniteInteger;
function checkOffsetOrLengthValue(value, offset) {
  if (typeof value === "number") {
    if (!isFiniteInteger(value) || value < 0) {
      throw new Error(offset ? ERRORS$1.INVALID_OFFSET : ERRORS$1.INVALID_LENGTH);
    }
  } else {
    throw new Error(offset ? ERRORS$1.INVALID_OFFSET_NON_NUMBER : ERRORS$1.INVALID_LENGTH_NON_NUMBER);
  }
}
function checkLengthValue(length) {
  checkOffsetOrLengthValue(length, false);
}
utils.checkLengthValue = checkLengthValue;
function checkOffsetValue(offset) {
  checkOffsetOrLengthValue(offset, true);
}
utils.checkOffsetValue = checkOffsetValue;
function checkTargetOffset(offset, buff) {
  if (offset < 0 || offset > buff.length) {
    throw new Error(ERRORS$1.INVALID_TARGET_OFFSET);
  }
}
utils.checkTargetOffset = checkTargetOffset;
function isInteger(value) {
  return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
}
function bigIntAndBufferInt64Check(bufferMethod) {
  if (typeof BigInt === "undefined") {
    throw new Error("Platform does not support JS BigInt type.");
  }
  if (typeof buffer_1.Buffer.prototype[bufferMethod] === "undefined") {
    throw new Error(`Platform does not support Buffer.prototype.${bufferMethod}.`);
  }
}
utils.bigIntAndBufferInt64Check = bigIntAndBufferInt64Check;
Object.defineProperty(smartbuffer, "__esModule", { value: true });
const utils_1 = utils;
const DEFAULT_SMARTBUFFER_SIZE = 4096;
const DEFAULT_SMARTBUFFER_ENCODING = "utf8";
class SmartBuffer {
  /**
   * Creates a new SmartBuffer instance.
   *
   * @param options { SmartBufferOptions } The SmartBufferOptions to apply to this instance.
   */
  constructor(options) {
    this.length = 0;
    this._encoding = DEFAULT_SMARTBUFFER_ENCODING;
    this._writeOffset = 0;
    this._readOffset = 0;
    if (SmartBuffer.isSmartBufferOptions(options)) {
      if (options.encoding) {
        utils_1.checkEncoding(options.encoding);
        this._encoding = options.encoding;
      }
      if (options.size) {
        if (utils_1.isFiniteInteger(options.size) && options.size > 0) {
          this._buff = Buffer.allocUnsafe(options.size);
        } else {
          throw new Error(utils_1.ERRORS.INVALID_SMARTBUFFER_SIZE);
        }
      } else if (options.buff) {
        if (Buffer.isBuffer(options.buff)) {
          this._buff = options.buff;
          this.length = options.buff.length;
        } else {
          throw new Error(utils_1.ERRORS.INVALID_SMARTBUFFER_BUFFER);
        }
      } else {
        this._buff = Buffer.allocUnsafe(DEFAULT_SMARTBUFFER_SIZE);
      }
    } else {
      if (typeof options !== "undefined") {
        throw new Error(utils_1.ERRORS.INVALID_SMARTBUFFER_OBJECT);
      }
      this._buff = Buffer.allocUnsafe(DEFAULT_SMARTBUFFER_SIZE);
    }
  }
  /**
   * Creates a new SmartBuffer instance with the provided internal Buffer size and optional encoding.
   *
   * @param size { Number } The size of the internal Buffer.
   * @param encoding { String } The BufferEncoding to use for strings.
   *
   * @return { SmartBuffer }
   */
  static fromSize(size, encoding) {
    return new this({
      size,
      encoding
    });
  }
  /**
   * Creates a new SmartBuffer instance with the provided Buffer and optional encoding.
   *
   * @param buffer { Buffer } The Buffer to use as the internal Buffer value.
   * @param encoding { String } The BufferEncoding to use for strings.
   *
   * @return { SmartBuffer }
   */
  static fromBuffer(buff, encoding) {
    return new this({
      buff,
      encoding
    });
  }
  /**
   * Creates a new SmartBuffer instance with the provided SmartBufferOptions options.
   *
   * @param options { SmartBufferOptions } The options to use when creating the SmartBuffer instance.
   */
  static fromOptions(options) {
    return new this(options);
  }
  /**
   * Type checking function that determines if an object is a SmartBufferOptions object.
   */
  static isSmartBufferOptions(options) {
    const castOptions = options;
    return castOptions && (castOptions.encoding !== void 0 || castOptions.size !== void 0 || castOptions.buff !== void 0);
  }
  // Signed integers
  /**
   * Reads an Int8 value from the current read position or an optionally provided offset.
   *
   * @param offset { Number } The offset to read data from (optional)
   * @return { Number }
   */
  readInt8(offset) {
    return this._readNumberValue(Buffer.prototype.readInt8, 1, offset);
  }
  /**
   * Reads an Int16BE value from the current read position or an optionally provided offset.
   *
   * @param offset { Number } The offset to read data from (optional)
   * @return { Number }
   */
  readInt16BE(offset) {
    return this._readNumberValue(Buffer.prototype.readInt16BE, 2, offset);
  }
  /**
   * Reads an Int16LE value from the current read position or an optionally provided offset.
   *
   * @param offset { Number } The offset to read data from (optional)
   * @return { Number }
   */
  readInt16LE(offset) {
    return this._readNumberValue(Buffer.prototype.readInt16LE, 2, offset);
  }
  /**
   * Reads an Int32BE value from the current read position or an optionally provided offset.
   *
   * @param offset { Number } The offset to read data from (optional)
   * @return { Number }
   */
  readInt32BE(offset) {
    return this._readNumberValue(Buffer.prototype.readInt32BE, 4, offset);
  }
  /**
   * Reads an Int32LE value from the current read position or an optionally provided offset.
   *
   * @param offset { Number } The offset to read data from (optional)
   * @return { Number }
   */
  readInt32LE(offset) {
    return this._readNumberValue(Buffer.prototype.readInt32LE, 4, offset);
  }
  /**
   * Reads a BigInt64BE value from the current read position or an optionally provided offset.
   *
   * @param offset { Number } The offset to read data from (optional)
   * @return { BigInt }
   */
  readBigInt64BE(offset) {
    utils_1.bigIntAndBufferInt64Check("readBigInt64BE");
    return this._readNumberValue(Buffer.prototype.readBigInt64BE, 8, offset);
  }
  /**
   * Reads a BigInt64LE value from the current read position or an optionally provided offset.
   *
   * @param offset { Number } The offset to read data from (optional)
   * @return { BigInt }
   */
  readBigInt64LE(offset) {
    utils_1.bigIntAndBufferInt64Check("readBigInt64LE");
    return this._readNumberValue(Buffer.prototype.readBigInt64LE, 8, offset);
  }
  /**
   * Writes an Int8 value to the current write position (or at optional offset).
   *
   * @param value { Number } The value to write.
   * @param offset { Number } The offset to write the value at.
   *
   * @return this
   */
  writeInt8(value, offset) {
    this._writeNumberValue(Buffer.prototype.writeInt8, 1, value, offset);
    return this;
  }
  /**
   * Inserts an Int8 value at the given offset value.
   *
   * @param value { Number } The value to insert.
   * @param offset { Number } The offset to insert the value at.
   *
   * @return this
   */
  insertInt8(value, offset) {
    return this._insertNumberValue(Buffer.prototype.writeInt8, 1, value, offset);
  }
  /**
   * Writes an Int16BE value to the current write position (or at optional offset).
   *
   * @param value { Number } The value to write.
   * @param offset { Number } The offset to write the value at.
   *
   * @return this
   */
  writeInt16BE(value, offset) {
    return this._writeNumberValue(Buffer.prototype.writeInt16BE, 2, value, offset);
  }
  /**
   * Inserts an Int16BE value at the given offset value.
   *
   * @param value { Number } The value to insert.
   * @param offset { Number } The offset to insert the value at.
   *
   * @return this
   */
  insertInt16BE(value, offset) {
    return this._insertNumberValue(Buffer.prototype.writeInt16BE, 2, value, offset);
  }
  /**
   * Writes an Int16LE value to the current write position (or at optional offset).
   *
   * @param value { Number } The value to write.
   * @param offset { Number } The offset to write the value at.
   *
   * @return this
   */
  writeInt16LE(value, offset) {
    return this._writeNumberValue(Buffer.prototype.writeInt16LE, 2, value, offset);
  }
  /**
   * Inserts an Int16LE value at the given offset value.
   *
   * @param value { Number } The value to insert.
   * @param offset { Number } The offset to insert the value at.
   *
   * @return this
   */
  insertInt16LE(value, offset) {
    return this._insertNumberValue(Buffer.prototype.writeInt16LE, 2, value, offset);
  }
  /**
   * Writes an Int32BE value to the current write position (or at optional offset).
   *
   * @param value { Number } The value to write.
   * @param offset { Number } The offset to write the value at.
   *
   * @return this
   */
  writeInt32BE(value, offset) {
    return this._writeNumberValue(Buffer.prototype.writeInt32BE, 4, value, offset);
  }
  /**
   * Inserts an Int32BE value at the given offset value.
   *
   * @param value { Number } The value to insert.
   * @param offset { Number } The offset to insert the value at.
   *
   * @return this
   */
  insertInt32BE(value, offset) {
    return this._insertNumberValue(Buffer.prototype.writeInt32BE, 4, value, offset);
  }
  /**
   * Writes an Int32LE value to the current write position (or at optional offset).
   *
   * @param value { Number } The value to write.
   * @param offset { Number } The offset to write the value at.
   *
   * @return this
   */
  writeInt32LE(value, offset) {
    return this._writeNumberValue(Buffer.prototype.writeInt32LE, 4, value, offset);
  }
  /**
   * Inserts an Int32LE value at the given offset value.
   *
   * @param value { Number } The value to insert.
   * @param offset { Number } The offset to insert the value at.
   *
   * @return this
   */
  insertInt32LE(value, offset) {
    return this._insertNumberValue(Buffer.prototype.writeInt32LE, 4, value, offset);
  }
  /**
   * Writes a BigInt64BE value to the current write position (or at optional offset).
   *
   * @param value { BigInt } The value to write.
   * @param offset { Number } The offset to write the value at.
   *
   * @return this
   */
  writeBigInt64BE(value, offset) {
    utils_1.bigIntAndBufferInt64Check("writeBigInt64BE");
    return this._writeNumberValue(Buffer.prototype.writeBigInt64BE, 8, value, offset);
  }
  /**
   * Inserts a BigInt64BE value at the given offset value.
   *
   * @param value { BigInt } The value to insert.
   * @param offset { Number } The offset to insert the value at.
   *
   * @return this
   */
  insertBigInt64BE(value, offset) {
    utils_1.bigIntAndBufferInt64Check("writeBigInt64BE");
    return this._insertNumberValue(Buffer.prototype.writeBigInt64BE, 8, value, offset);
  }
  /**
   * Writes a BigInt64LE value to the current write position (or at optional offset).
   *
   * @param value { BigInt } The value to write.
   * @param offset { Number } The offset to write the value at.
   *
   * @return this
   */
  writeBigInt64LE(value, offset) {
    utils_1.bigIntAndBufferInt64Check("writeBigInt64LE");
    return this._writeNumberValue(Buffer.prototype.writeBigInt64LE, 8, value, offset);
  }
  /**
   * Inserts a Int64LE value at the given offset value.
   *
   * @param value { BigInt } The value to insert.
   * @param offset { Number } The offset to insert the value at.
   *
   * @return this
   */
  insertBigInt64LE(value, offset) {
    utils_1.bigIntAndBufferInt64Check("writeBigInt64LE");
    return this._insertNumberValue(Buffer.prototype.writeBigInt64LE, 8, value, offset);
  }
  // Unsigned Integers
  /**
   * Reads an UInt8 value from the current read position or an optionally provided offset.
   *
   * @param offset { Number } The offset to read data from (optional)
   * @return { Number }
   */
  readUInt8(offset) {
    return this._readNumberValue(Buffer.prototype.readUInt8, 1, offset);
  }
  /**
   * Reads an UInt16BE value from the current read position or an optionally provided offset.
   *
   * @param offset { Number } The offset to read data from (optional)
   * @return { Number }
   */
  readUInt16BE(offset) {
    return this._readNumberValue(Buffer.prototype.readUInt16BE, 2, offset);
  }
  /**
   * Reads an UInt16LE value from the current read position or an optionally provided offset.
   *
   * @param offset { Number } The offset to read data from (optional)
   * @return { Number }
   */
  readUInt16LE(offset) {
    return this._readNumberValue(Buffer.prototype.readUInt16LE, 2, offset);
  }
  /**
   * Reads an UInt32BE value from the current read position or an optionally provided offset.
   *
   * @param offset { Number } The offset to read data from (optional)
   * @return { Number }
   */
  readUInt32BE(offset) {
    return this._readNumberValue(Buffer.prototype.readUInt32BE, 4, offset);
  }
  /**
   * Reads an UInt32LE value from the current read position or an optionally provided offset.
   *
   * @param offset { Number } The offset to read data from (optional)
   * @return { Number }
   */
  readUInt32LE(offset) {
    return this._readNumberValue(Buffer.prototype.readUInt32LE, 4, offset);
  }
  /**
   * Reads a BigUInt64BE value from the current read position or an optionally provided offset.
   *
   * @param offset { Number } The offset to read data from (optional)
   * @return { BigInt }
   */
  readBigUInt64BE(offset) {
    utils_1.bigIntAndBufferInt64Check("readBigUInt64BE");
    return this._readNumberValue(Buffer.prototype.readBigUInt64BE, 8, offset);
  }
  /**
   * Reads a BigUInt64LE value from the current read position or an optionally provided offset.
   *
   * @param offset { Number } The offset to read data from (optional)
   * @return { BigInt }
   */
  readBigUInt64LE(offset) {
    utils_1.bigIntAndBufferInt64Check("readBigUInt64LE");
    return this._readNumberValue(Buffer.prototype.readBigUInt64LE, 8, offset);
  }
  /**
   * Writes an UInt8 value to the current write position (or at optional offset).
   *
   * @param value { Number } The value to write.
   * @param offset { Number } The offset to write the value at.
   *
   * @return this
   */
  writeUInt8(value, offset) {
    return this._writeNumberValue(Buffer.prototype.writeUInt8, 1, value, offset);
  }
  /**
   * Inserts an UInt8 value at the given offset value.
   *
   * @param value { Number } The value to insert.
   * @param offset { Number } The offset to insert the value at.
   *
   * @return this
   */
  insertUInt8(value, offset) {
    return this._insertNumberValue(Buffer.prototype.writeUInt8, 1, value, offset);
  }
  /**
   * Writes an UInt16BE value to the current write position (or at optional offset).
   *
   * @param value { Number } The value to write.
   * @param offset { Number } The offset to write the value at.
   *
   * @return this
   */
  writeUInt16BE(value, offset) {
    return this._writeNumberValue(Buffer.prototype.writeUInt16BE, 2, value, offset);
  }
  /**
   * Inserts an UInt16BE value at the given offset value.
   *
   * @param value { Number } The value to insert.
   * @param offset { Number } The offset to insert the value at.
   *
   * @return this
   */
  insertUInt16BE(value, offset) {
    return this._insertNumberValue(Buffer.prototype.writeUInt16BE, 2, value, offset);
  }
  /**
   * Writes an UInt16LE value to the current write position (or at optional offset).
   *
   * @param value { Number } The value to write.
   * @param offset { Number } The offset to write the value at.
   *
   * @return this
   */
  writeUInt16LE(value, offset) {
    return this._writeNumberValue(Buffer.prototype.writeUInt16LE, 2, value, offset);
  }
  /**
   * Inserts an UInt16LE value at the given offset value.
   *
   * @param value { Number } The value to insert.
   * @param offset { Number } The offset to insert the value at.
   *
   * @return this
   */
  insertUInt16LE(value, offset) {
    return this._insertNumberValue(Buffer.prototype.writeUInt16LE, 2, value, offset);
  }
  /**
   * Writes an UInt32BE value to the current write position (or at optional offset).
   *
   * @param value { Number } The value to write.
   * @param offset { Number } The offset to write the value at.
   *
   * @return this
   */
  writeUInt32BE(value, offset) {
    return this._writeNumberValue(Buffer.prototype.writeUInt32BE, 4, value, offset);
  }
  /**
   * Inserts an UInt32BE value at the given offset value.
   *
   * @param value { Number } The value to insert.
   * @param offset { Number } The offset to insert the value at.
   *
   * @return this
   */
  insertUInt32BE(value, offset) {
    return this._insertNumberValue(Buffer.prototype.writeUInt32BE, 4, value, offset);
  }
  /**
   * Writes an UInt32LE value to the current write position (or at optional offset).
   *
   * @param value { Number } The value to write.
   * @param offset { Number } The offset to write the value at.
   *
   * @return this
   */
  writeUInt32LE(value, offset) {
    return this._writeNumberValue(Buffer.prototype.writeUInt32LE, 4, value, offset);
  }
  /**
   * Inserts an UInt32LE value at the given offset value.
   *
   * @param value { Number } The value to insert.
   * @param offset { Number } The offset to insert the value at.
   *
   * @return this
   */
  insertUInt32LE(value, offset) {
    return this._insertNumberValue(Buffer.prototype.writeUInt32LE, 4, value, offset);
  }
  /**
   * Writes a BigUInt64BE value to the current write position (or at optional offset).
   *
   * @param value { Number } The value to write.
   * @param offset { Number } The offset to write the value at.
   *
   * @return this
   */
  writeBigUInt64BE(value, offset) {
    utils_1.bigIntAndBufferInt64Check("writeBigUInt64BE");
    return this._writeNumberValue(Buffer.prototype.writeBigUInt64BE, 8, value, offset);
  }
  /**
   * Inserts a BigUInt64BE value at the given offset value.
   *
   * @param value { Number } The value to insert.
   * @param offset { Number } The offset to insert the value at.
   *
   * @return this
   */
  insertBigUInt64BE(value, offset) {
    utils_1.bigIntAndBufferInt64Check("writeBigUInt64BE");
    return this._insertNumberValue(Buffer.prototype.writeBigUInt64BE, 8, value, offset);
  }
  /**
   * Writes a BigUInt64LE value to the current write position (or at optional offset).
   *
   * @param value { Number } The value to write.
   * @param offset { Number } The offset to write the value at.
   *
   * @return this
   */
  writeBigUInt64LE(value, offset) {
    utils_1.bigIntAndBufferInt64Check("writeBigUInt64LE");
    return this._writeNumberValue(Buffer.prototype.writeBigUInt64LE, 8, value, offset);
  }
  /**
   * Inserts a BigUInt64LE value at the given offset value.
   *
   * @param value { Number } The value to insert.
   * @param offset { Number } The offset to insert the value at.
   *
   * @return this
   */
  insertBigUInt64LE(value, offset) {
    utils_1.bigIntAndBufferInt64Check("writeBigUInt64LE");
    return this._insertNumberValue(Buffer.prototype.writeBigUInt64LE, 8, value, offset);
  }
  // Floating Point
  /**
   * Reads an FloatBE value from the current read position or an optionally provided offset.
   *
   * @param offset { Number } The offset to read data from (optional)
   * @return { Number }
   */
  readFloatBE(offset) {
    return this._readNumberValue(Buffer.prototype.readFloatBE, 4, offset);
  }
  /**
   * Reads an FloatLE value from the current read position or an optionally provided offset.
   *
   * @param offset { Number } The offset to read data from (optional)
   * @return { Number }
   */
  readFloatLE(offset) {
    return this._readNumberValue(Buffer.prototype.readFloatLE, 4, offset);
  }
  /**
   * Writes a FloatBE value to the current write position (or at optional offset).
   *
   * @param value { Number } The value to write.
   * @param offset { Number } The offset to write the value at.
   *
   * @return this
   */
  writeFloatBE(value, offset) {
    return this._writeNumberValue(Buffer.prototype.writeFloatBE, 4, value, offset);
  }
  /**
   * Inserts a FloatBE value at the given offset value.
   *
   * @param value { Number } The value to insert.
   * @param offset { Number } The offset to insert the value at.
   *
   * @return this
   */
  insertFloatBE(value, offset) {
    return this._insertNumberValue(Buffer.prototype.writeFloatBE, 4, value, offset);
  }
  /**
   * Writes a FloatLE value to the current write position (or at optional offset).
   *
   * @param value { Number } The value to write.
   * @param offset { Number } The offset to write the value at.
   *
   * @return this
   */
  writeFloatLE(value, offset) {
    return this._writeNumberValue(Buffer.prototype.writeFloatLE, 4, value, offset);
  }
  /**
   * Inserts a FloatLE value at the given offset value.
   *
   * @param value { Number } The value to insert.
   * @param offset { Number } The offset to insert the value at.
   *
   * @return this
   */
  insertFloatLE(value, offset) {
    return this._insertNumberValue(Buffer.prototype.writeFloatLE, 4, value, offset);
  }
  // Double Floating Point
  /**
   * Reads an DoublEBE value from the current read position or an optionally provided offset.
   *
   * @param offset { Number } The offset to read data from (optional)
   * @return { Number }
   */
  readDoubleBE(offset) {
    return this._readNumberValue(Buffer.prototype.readDoubleBE, 8, offset);
  }
  /**
   * Reads an DoubleLE value from the current read position or an optionally provided offset.
   *
   * @param offset { Number } The offset to read data from (optional)
   * @return { Number }
   */
  readDoubleLE(offset) {
    return this._readNumberValue(Buffer.prototype.readDoubleLE, 8, offset);
  }
  /**
   * Writes a DoubleBE value to the current write position (or at optional offset).
   *
   * @param value { Number } The value to write.
   * @param offset { Number } The offset to write the value at.
   *
   * @return this
   */
  writeDoubleBE(value, offset) {
    return this._writeNumberValue(Buffer.prototype.writeDoubleBE, 8, value, offset);
  }
  /**
   * Inserts a DoubleBE value at the given offset value.
   *
   * @param value { Number } The value to insert.
   * @param offset { Number } The offset to insert the value at.
   *
   * @return this
   */
  insertDoubleBE(value, offset) {
    return this._insertNumberValue(Buffer.prototype.writeDoubleBE, 8, value, offset);
  }
  /**
   * Writes a DoubleLE value to the current write position (or at optional offset).
   *
   * @param value { Number } The value to write.
   * @param offset { Number } The offset to write the value at.
   *
   * @return this
   */
  writeDoubleLE(value, offset) {
    return this._writeNumberValue(Buffer.prototype.writeDoubleLE, 8, value, offset);
  }
  /**
   * Inserts a DoubleLE value at the given offset value.
   *
   * @param value { Number } The value to insert.
   * @param offset { Number } The offset to insert the value at.
   *
   * @return this
   */
  insertDoubleLE(value, offset) {
    return this._insertNumberValue(Buffer.prototype.writeDoubleLE, 8, value, offset);
  }
  // Strings
  /**
   * Reads a String from the current read position.
   *
   * @param arg1 { Number | String } The number of bytes to read as a String, or the BufferEncoding to use for
   *             the string (Defaults to instance level encoding).
   * @param encoding { String } The BufferEncoding to use for the string (Defaults to instance level encoding).
   *
   * @return { String }
   */
  readString(arg1, encoding) {
    let lengthVal;
    if (typeof arg1 === "number") {
      utils_1.checkLengthValue(arg1);
      lengthVal = Math.min(arg1, this.length - this._readOffset);
    } else {
      encoding = arg1;
      lengthVal = this.length - this._readOffset;
    }
    if (typeof encoding !== "undefined") {
      utils_1.checkEncoding(encoding);
    }
    const value = this._buff.slice(this._readOffset, this._readOffset + lengthVal).toString(encoding || this._encoding);
    this._readOffset += lengthVal;
    return value;
  }
  /**
   * Inserts a String
   *
   * @param value { String } The String value to insert.
   * @param offset { Number } The offset to insert the string at.
   * @param encoding { String } The BufferEncoding to use for writing strings (defaults to instance encoding).
   *
   * @return this
   */
  insertString(value, offset, encoding) {
    utils_1.checkOffsetValue(offset);
    return this._handleString(value, true, offset, encoding);
  }
  /**
   * Writes a String
   *
   * @param value { String } The String value to write.
   * @param arg2 { Number | String } The offset to write the string at, or the BufferEncoding to use.
   * @param encoding { String } The BufferEncoding to use for writing strings (defaults to instance encoding).
   *
   * @return this
   */
  writeString(value, arg2, encoding) {
    return this._handleString(value, false, arg2, encoding);
  }
  /**
   * Reads a null-terminated String from the current read position.
   *
   * @param encoding { String } The BufferEncoding to use for the string (Defaults to instance level encoding).
   *
   * @return { String }
   */
  readStringNT(encoding) {
    if (typeof encoding !== "undefined") {
      utils_1.checkEncoding(encoding);
    }
    let nullPos = this.length;
    for (let i = this._readOffset; i < this.length; i++) {
      if (this._buff[i] === 0) {
        nullPos = i;
        break;
      }
    }
    const value = this._buff.slice(this._readOffset, nullPos);
    this._readOffset = nullPos + 1;
    return value.toString(encoding || this._encoding);
  }
  /**
   * Inserts a null-terminated String.
   *
   * @param value { String } The String value to write.
   * @param arg2 { Number | String } The offset to write the string to, or the BufferEncoding to use.
   * @param encoding { String } The BufferEncoding to use for writing strings (defaults to instance encoding).
   *
   * @return this
   */
  insertStringNT(value, offset, encoding) {
    utils_1.checkOffsetValue(offset);
    this.insertString(value, offset, encoding);
    this.insertUInt8(0, offset + value.length);
    return this;
  }
  /**
   * Writes a null-terminated String.
   *
   * @param value { String } The String value to write.
   * @param arg2 { Number | String } The offset to write the string to, or the BufferEncoding to use.
   * @param encoding { String } The BufferEncoding to use for writing strings (defaults to instance encoding).
   *
   * @return this
   */
  writeStringNT(value, arg2, encoding) {
    this.writeString(value, arg2, encoding);
    this.writeUInt8(0, typeof arg2 === "number" ? arg2 + value.length : this.writeOffset);
    return this;
  }
  // Buffers
  /**
   * Reads a Buffer from the internal read position.
   *
   * @param length { Number } The length of data to read as a Buffer.
   *
   * @return { Buffer }
   */
  readBuffer(length) {
    if (typeof length !== "undefined") {
      utils_1.checkLengthValue(length);
    }
    const lengthVal = typeof length === "number" ? length : this.length;
    const endPoint = Math.min(this.length, this._readOffset + lengthVal);
    const value = this._buff.slice(this._readOffset, endPoint);
    this._readOffset = endPoint;
    return value;
  }
  /**
   * Writes a Buffer to the current write position.
   *
   * @param value { Buffer } The Buffer to write.
   * @param offset { Number } The offset to write the Buffer to.
   *
   * @return this
   */
  insertBuffer(value, offset) {
    utils_1.checkOffsetValue(offset);
    return this._handleBuffer(value, true, offset);
  }
  /**
   * Writes a Buffer to the current write position.
   *
   * @param value { Buffer } The Buffer to write.
   * @param offset { Number } The offset to write the Buffer to.
   *
   * @return this
   */
  writeBuffer(value, offset) {
    return this._handleBuffer(value, false, offset);
  }
  /**
   * Reads a null-terminated Buffer from the current read poisiton.
   *
   * @return { Buffer }
   */
  readBufferNT() {
    let nullPos = this.length;
    for (let i = this._readOffset; i < this.length; i++) {
      if (this._buff[i] === 0) {
        nullPos = i;
        break;
      }
    }
    const value = this._buff.slice(this._readOffset, nullPos);
    this._readOffset = nullPos + 1;
    return value;
  }
  /**
   * Inserts a null-terminated Buffer.
   *
   * @param value { Buffer } The Buffer to write.
   * @param offset { Number } The offset to write the Buffer to.
   *
   * @return this
   */
  insertBufferNT(value, offset) {
    utils_1.checkOffsetValue(offset);
    this.insertBuffer(value, offset);
    this.insertUInt8(0, offset + value.length);
    return this;
  }
  /**
   * Writes a null-terminated Buffer.
   *
   * @param value { Buffer } The Buffer to write.
   * @param offset { Number } The offset to write the Buffer to.
   *
   * @return this
   */
  writeBufferNT(value, offset) {
    if (typeof offset !== "undefined") {
      utils_1.checkOffsetValue(offset);
    }
    this.writeBuffer(value, offset);
    this.writeUInt8(0, typeof offset === "number" ? offset + value.length : this._writeOffset);
    return this;
  }
  /**
   * Clears the SmartBuffer instance to its original empty state.
   */
  clear() {
    this._writeOffset = 0;
    this._readOffset = 0;
    this.length = 0;
    return this;
  }
  /**
   * Gets the remaining data left to be read from the SmartBuffer instance.
   *
   * @return { Number }
   */
  remaining() {
    return this.length - this._readOffset;
  }
  /**
   * Gets the current read offset value of the SmartBuffer instance.
   *
   * @return { Number }
   */
  get readOffset() {
    return this._readOffset;
  }
  /**
   * Sets the read offset value of the SmartBuffer instance.
   *
   * @param offset { Number } - The offset value to set.
   */
  set readOffset(offset) {
    utils_1.checkOffsetValue(offset);
    utils_1.checkTargetOffset(offset, this);
    this._readOffset = offset;
  }
  /**
   * Gets the current write offset value of the SmartBuffer instance.
   *
   * @return { Number }
   */
  get writeOffset() {
    return this._writeOffset;
  }
  /**
   * Sets the write offset value of the SmartBuffer instance.
   *
   * @param offset { Number } - The offset value to set.
   */
  set writeOffset(offset) {
    utils_1.checkOffsetValue(offset);
    utils_1.checkTargetOffset(offset, this);
    this._writeOffset = offset;
  }
  /**
   * Gets the currently set string encoding of the SmartBuffer instance.
   *
   * @return { BufferEncoding } The string Buffer encoding currently set.
   */
  get encoding() {
    return this._encoding;
  }
  /**
   * Sets the string encoding of the SmartBuffer instance.
   *
   * @param encoding { BufferEncoding } The string Buffer encoding to set.
   */
  set encoding(encoding) {
    utils_1.checkEncoding(encoding);
    this._encoding = encoding;
  }
  /**
   * Gets the underlying internal Buffer. (This includes unmanaged data in the Buffer)
   *
   * @return { Buffer } The Buffer value.
   */
  get internalBuffer() {
    return this._buff;
  }
  /**
   * Gets the value of the internal managed Buffer (Includes managed data only)
   *
   * @param { Buffer }
   */
  toBuffer() {
    return this._buff.slice(0, this.length);
  }
  /**
   * Gets the String value of the internal managed Buffer
   *
   * @param encoding { String } The BufferEncoding to display the Buffer as (defaults to instance level encoding).
   */
  toString(encoding) {
    const encodingVal = typeof encoding === "string" ? encoding : this._encoding;
    utils_1.checkEncoding(encodingVal);
    return this._buff.toString(encodingVal, 0, this.length);
  }
  /**
   * Destroys the SmartBuffer instance.
   */
  destroy() {
    this.clear();
    return this;
  }
  /**
   * Handles inserting and writing strings.
   *
   * @param value { String } The String value to insert.
   * @param isInsert { Boolean } True if inserting a string, false if writing.
   * @param arg2 { Number | String } The offset to insert the string at, or the BufferEncoding to use.
   * @param encoding { String } The BufferEncoding to use for writing strings (defaults to instance encoding).
   */
  _handleString(value, isInsert, arg3, encoding) {
    let offsetVal = this._writeOffset;
    let encodingVal = this._encoding;
    if (typeof arg3 === "number") {
      offsetVal = arg3;
    } else if (typeof arg3 === "string") {
      utils_1.checkEncoding(arg3);
      encodingVal = arg3;
    }
    if (typeof encoding === "string") {
      utils_1.checkEncoding(encoding);
      encodingVal = encoding;
    }
    const byteLength = Buffer.byteLength(value, encodingVal);
    if (isInsert) {
      this.ensureInsertable(byteLength, offsetVal);
    } else {
      this._ensureWriteable(byteLength, offsetVal);
    }
    this._buff.write(value, offsetVal, byteLength, encodingVal);
    if (isInsert) {
      this._writeOffset += byteLength;
    } else {
      if (typeof arg3 === "number") {
        this._writeOffset = Math.max(this._writeOffset, offsetVal + byteLength);
      } else {
        this._writeOffset += byteLength;
      }
    }
    return this;
  }
  /**
   * Handles writing or insert of a Buffer.
   *
   * @param value { Buffer } The Buffer to write.
   * @param offset { Number } The offset to write the Buffer to.
   */
  _handleBuffer(value, isInsert, offset) {
    const offsetVal = typeof offset === "number" ? offset : this._writeOffset;
    if (isInsert) {
      this.ensureInsertable(value.length, offsetVal);
    } else {
      this._ensureWriteable(value.length, offsetVal);
    }
    value.copy(this._buff, offsetVal);
    if (isInsert) {
      this._writeOffset += value.length;
    } else {
      if (typeof offset === "number") {
        this._writeOffset = Math.max(this._writeOffset, offsetVal + value.length);
      } else {
        this._writeOffset += value.length;
      }
    }
    return this;
  }
  /**
   * Ensures that the internal Buffer is large enough to read data.
   *
   * @param length { Number } The length of the data that needs to be read.
   * @param offset { Number } The offset of the data that needs to be read.
   */
  ensureReadable(length, offset) {
    let offsetVal = this._readOffset;
    if (typeof offset !== "undefined") {
      utils_1.checkOffsetValue(offset);
      offsetVal = offset;
    }
    if (offsetVal < 0 || offsetVal + length > this.length) {
      throw new Error(utils_1.ERRORS.INVALID_READ_BEYOND_BOUNDS);
    }
  }
  /**
   * Ensures that the internal Buffer is large enough to insert data.
   *
   * @param dataLength { Number } The length of the data that needs to be written.
   * @param offset { Number } The offset of the data to be written.
   */
  ensureInsertable(dataLength, offset) {
    utils_1.checkOffsetValue(offset);
    this._ensureCapacity(this.length + dataLength);
    if (offset < this.length) {
      this._buff.copy(this._buff, offset + dataLength, offset, this._buff.length);
    }
    if (offset + dataLength > this.length) {
      this.length = offset + dataLength;
    } else {
      this.length += dataLength;
    }
  }
  /**
   * Ensures that the internal Buffer is large enough to write data.
   *
   * @param dataLength { Number } The length of the data that needs to be written.
   * @param offset { Number } The offset of the data to be written (defaults to writeOffset).
   */
  _ensureWriteable(dataLength, offset) {
    const offsetVal = typeof offset === "number" ? offset : this._writeOffset;
    this._ensureCapacity(offsetVal + dataLength);
    if (offsetVal + dataLength > this.length) {
      this.length = offsetVal + dataLength;
    }
  }
  /**
   * Ensures that the internal Buffer is large enough to write at least the given amount of data.
   *
   * @param minLength { Number } The minimum length of the data needs to be written.
   */
  _ensureCapacity(minLength) {
    const oldLength = this._buff.length;
    if (minLength > oldLength) {
      let data = this._buff;
      let newLength = oldLength * 3 / 2 + 1;
      if (newLength < minLength) {
        newLength = minLength;
      }
      this._buff = Buffer.allocUnsafe(newLength);
      data.copy(this._buff, 0, 0, oldLength);
    }
  }
  /**
   * Reads a numeric number value using the provided function.
   *
   * @typeparam T { number | bigint } The type of the value to be read
   *
   * @param func { Function(offset: number) => number } The function to read data on the internal Buffer with.
   * @param byteSize { Number } The number of bytes read.
   * @param offset { Number } The offset to read from (optional). When this is not provided, the managed readOffset is used instead.
   *
   * @returns { T } the number value
   */
  _readNumberValue(func, byteSize, offset) {
    this.ensureReadable(byteSize, offset);
    const value = func.call(this._buff, typeof offset === "number" ? offset : this._readOffset);
    if (typeof offset === "undefined") {
      this._readOffset += byteSize;
    }
    return value;
  }
  /**
   * Inserts a numeric number value based on the given offset and value.
   *
   * @typeparam T { number | bigint } The type of the value to be written
   *
   * @param func { Function(offset: T, offset?) => number} The function to write data on the internal Buffer with.
   * @param byteSize { Number } The number of bytes written.
   * @param value { T } The number value to write.
   * @param offset { Number } the offset to write the number at (REQUIRED).
   *
   * @returns SmartBuffer this buffer
   */
  _insertNumberValue(func, byteSize, value, offset) {
    utils_1.checkOffsetValue(offset);
    this.ensureInsertable(byteSize, offset);
    func.call(this._buff, value, offset);
    this._writeOffset += byteSize;
    return this;
  }
  /**
   * Writes a numeric number value based on the given offset and value.
   *
   * @typeparam T { number | bigint } The type of the value to be written
   *
   * @param func { Function(offset: T, offset?) => number} The function to write data on the internal Buffer with.
   * @param byteSize { Number } The number of bytes written.
   * @param value { T } The number value to write.
   * @param offset { Number } the offset to write the number at (REQUIRED).
   *
   * @returns SmartBuffer this buffer
   */
  _writeNumberValue(func, byteSize, value, offset) {
    if (typeof offset === "number") {
      if (offset < 0) {
        throw new Error(utils_1.ERRORS.INVALID_WRITE_BEYOND_BOUNDS);
      }
      utils_1.checkOffsetValue(offset);
    }
    const offsetVal = typeof offset === "number" ? offset : this._writeOffset;
    this._ensureWriteable(byteSize, offsetVal);
    func.call(this._buff, value, offsetVal);
    if (typeof offset === "number") {
      this._writeOffset = Math.max(this._writeOffset, offsetVal + byteSize);
    } else {
      this._writeOffset += byteSize;
    }
    return this;
  }
}
smartbuffer.SmartBuffer = SmartBuffer;
var constants$3 = {};
Object.defineProperty(constants$3, "__esModule", { value: true });
constants$3.SOCKS5_NO_ACCEPTABLE_AUTH = constants$3.SOCKS5_CUSTOM_AUTH_END = constants$3.SOCKS5_CUSTOM_AUTH_START = constants$3.SOCKS_INCOMING_PACKET_SIZES = constants$3.SocksClientState = constants$3.Socks5Response = constants$3.Socks5HostType = constants$3.Socks5Auth = constants$3.Socks4Response = constants$3.SocksCommand = constants$3.ERRORS = constants$3.DEFAULT_TIMEOUT = void 0;
const DEFAULT_TIMEOUT = 3e4;
constants$3.DEFAULT_TIMEOUT = DEFAULT_TIMEOUT;
const ERRORS = {
  InvalidSocksCommand: "An invalid SOCKS command was provided. Valid options are connect, bind, and associate.",
  InvalidSocksCommandForOperation: "An invalid SOCKS command was provided. Only a subset of commands are supported for this operation.",
  InvalidSocksCommandChain: "An invalid SOCKS command was provided. Chaining currently only supports the connect command.",
  InvalidSocksClientOptionsDestination: "An invalid destination host was provided.",
  InvalidSocksClientOptionsExistingSocket: "An invalid existing socket was provided. This should be an instance of stream.Duplex.",
  InvalidSocksClientOptionsProxy: "Invalid SOCKS proxy details were provided.",
  InvalidSocksClientOptionsTimeout: "An invalid timeout value was provided. Please enter a value above 0 (in ms).",
  InvalidSocksClientOptionsProxiesLength: "At least two socks proxies must be provided for chaining.",
  InvalidSocksClientOptionsCustomAuthRange: "Custom auth must be a value between 0x80 and 0xFE.",
  InvalidSocksClientOptionsCustomAuthOptions: "When a custom_auth_method is provided, custom_auth_request_handler, custom_auth_response_size, and custom_auth_response_handler must also be provided and valid.",
  NegotiationError: "Negotiation error",
  SocketClosed: "Socket closed",
  ProxyConnectionTimedOut: "Proxy connection timed out",
  InternalError: "SocksClient internal error (this should not happen)",
  InvalidSocks4HandshakeResponse: "Received invalid Socks4 handshake response",
  Socks4ProxyRejectedConnection: "Socks4 Proxy rejected connection",
  InvalidSocks4IncomingConnectionResponse: "Socks4 invalid incoming connection response",
  Socks4ProxyRejectedIncomingBoundConnection: "Socks4 Proxy rejected incoming bound connection",
  InvalidSocks5InitialHandshakeResponse: "Received invalid Socks5 initial handshake response",
  InvalidSocks5IntiailHandshakeSocksVersion: "Received invalid Socks5 initial handshake (invalid socks version)",
  InvalidSocks5InitialHandshakeNoAcceptedAuthType: "Received invalid Socks5 initial handshake (no accepted authentication type)",
  InvalidSocks5InitialHandshakeUnknownAuthType: "Received invalid Socks5 initial handshake (unknown authentication type)",
  Socks5AuthenticationFailed: "Socks5 Authentication failed",
  InvalidSocks5FinalHandshake: "Received invalid Socks5 final handshake response",
  InvalidSocks5FinalHandshakeRejected: "Socks5 proxy rejected connection",
  InvalidSocks5IncomingConnectionResponse: "Received invalid Socks5 incoming connection response",
  Socks5ProxyRejectedIncomingBoundConnection: "Socks5 Proxy rejected incoming bound connection"
};
constants$3.ERRORS = ERRORS;
const SOCKS_INCOMING_PACKET_SIZES = {
  Socks5InitialHandshakeResponse: 2,
  Socks5UserPassAuthenticationResponse: 2,
  // Command response + incoming connection (bind)
  Socks5ResponseHeader: 5,
  // We need at least 5 to read the hostname length, then we wait for the address+port information.
  Socks5ResponseIPv4: 10,
  // 4 header + 4 ip + 2 port
  Socks5ResponseIPv6: 22,
  // 4 header + 16 ip + 2 port
  Socks5ResponseHostname: (hostNameLength) => hostNameLength + 7,
  // 4 header + 1 host length + host + 2 port
  // Command response + incoming connection (bind)
  Socks4Response: 8
  // 2 header + 2 port + 4 ip
};
constants$3.SOCKS_INCOMING_PACKET_SIZES = SOCKS_INCOMING_PACKET_SIZES;
var SocksCommand;
(function(SocksCommand2) {
  SocksCommand2[SocksCommand2["connect"] = 1] = "connect";
  SocksCommand2[SocksCommand2["bind"] = 2] = "bind";
  SocksCommand2[SocksCommand2["associate"] = 3] = "associate";
})(SocksCommand || (constants$3.SocksCommand = SocksCommand = {}));
var Socks4Response;
(function(Socks4Response2) {
  Socks4Response2[Socks4Response2["Granted"] = 90] = "Granted";
  Socks4Response2[Socks4Response2["Failed"] = 91] = "Failed";
  Socks4Response2[Socks4Response2["Rejected"] = 92] = "Rejected";
  Socks4Response2[Socks4Response2["RejectedIdent"] = 93] = "RejectedIdent";
})(Socks4Response || (constants$3.Socks4Response = Socks4Response = {}));
var Socks5Auth;
(function(Socks5Auth2) {
  Socks5Auth2[Socks5Auth2["NoAuth"] = 0] = "NoAuth";
  Socks5Auth2[Socks5Auth2["GSSApi"] = 1] = "GSSApi";
  Socks5Auth2[Socks5Auth2["UserPass"] = 2] = "UserPass";
})(Socks5Auth || (constants$3.Socks5Auth = Socks5Auth = {}));
const SOCKS5_CUSTOM_AUTH_START = 128;
constants$3.SOCKS5_CUSTOM_AUTH_START = SOCKS5_CUSTOM_AUTH_START;
const SOCKS5_CUSTOM_AUTH_END = 254;
constants$3.SOCKS5_CUSTOM_AUTH_END = SOCKS5_CUSTOM_AUTH_END;
const SOCKS5_NO_ACCEPTABLE_AUTH = 255;
constants$3.SOCKS5_NO_ACCEPTABLE_AUTH = SOCKS5_NO_ACCEPTABLE_AUTH;
var Socks5Response;
(function(Socks5Response2) {
  Socks5Response2[Socks5Response2["Granted"] = 0] = "Granted";
  Socks5Response2[Socks5Response2["Failure"] = 1] = "Failure";
  Socks5Response2[Socks5Response2["NotAllowed"] = 2] = "NotAllowed";
  Socks5Response2[Socks5Response2["NetworkUnreachable"] = 3] = "NetworkUnreachable";
  Socks5Response2[Socks5Response2["HostUnreachable"] = 4] = "HostUnreachable";
  Socks5Response2[Socks5Response2["ConnectionRefused"] = 5] = "ConnectionRefused";
  Socks5Response2[Socks5Response2["TTLExpired"] = 6] = "TTLExpired";
  Socks5Response2[Socks5Response2["CommandNotSupported"] = 7] = "CommandNotSupported";
  Socks5Response2[Socks5Response2["AddressNotSupported"] = 8] = "AddressNotSupported";
})(Socks5Response || (constants$3.Socks5Response = Socks5Response = {}));
var Socks5HostType;
(function(Socks5HostType2) {
  Socks5HostType2[Socks5HostType2["IPv4"] = 1] = "IPv4";
  Socks5HostType2[Socks5HostType2["Hostname"] = 3] = "Hostname";
  Socks5HostType2[Socks5HostType2["IPv6"] = 4] = "IPv6";
})(Socks5HostType || (constants$3.Socks5HostType = Socks5HostType = {}));
var SocksClientState;
(function(SocksClientState2) {
  SocksClientState2[SocksClientState2["Created"] = 0] = "Created";
  SocksClientState2[SocksClientState2["Connecting"] = 1] = "Connecting";
  SocksClientState2[SocksClientState2["Connected"] = 2] = "Connected";
  SocksClientState2[SocksClientState2["SentInitialHandshake"] = 3] = "SentInitialHandshake";
  SocksClientState2[SocksClientState2["ReceivedInitialHandshakeResponse"] = 4] = "ReceivedInitialHandshakeResponse";
  SocksClientState2[SocksClientState2["SentAuthentication"] = 5] = "SentAuthentication";
  SocksClientState2[SocksClientState2["ReceivedAuthenticationResponse"] = 6] = "ReceivedAuthenticationResponse";
  SocksClientState2[SocksClientState2["SentFinalHandshake"] = 7] = "SentFinalHandshake";
  SocksClientState2[SocksClientState2["ReceivedFinalResponse"] = 8] = "ReceivedFinalResponse";
  SocksClientState2[SocksClientState2["BoundWaitingForConnection"] = 9] = "BoundWaitingForConnection";
  SocksClientState2[SocksClientState2["Established"] = 10] = "Established";
  SocksClientState2[SocksClientState2["Disconnected"] = 11] = "Disconnected";
  SocksClientState2[SocksClientState2["Error"] = 99] = "Error";
})(SocksClientState || (constants$3.SocksClientState = SocksClientState = {}));
var helpers$2 = {};
var util = {};
Object.defineProperty(util, "__esModule", { value: true });
util.shuffleArray = util.SocksClientError = void 0;
class SocksClientError extends Error {
  constructor(message, options) {
    super(message);
    this.options = options;
  }
}
util.SocksClientError = SocksClientError;
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
util.shuffleArray = shuffleArray;
var ipAddress = {};
var ipv4 = {};
var common$2 = {};
var addressError = {};
Object.defineProperty(addressError, "__esModule", { value: true });
addressError.AddressError = void 0;
class AddressError extends Error {
  constructor(message, parseMessage) {
    super(message);
    this.name = "AddressError";
    this.parseMessage = parseMessage;
  }
}
addressError.AddressError = AddressError;
Object.defineProperty(common$2, "__esModule", { value: true });
common$2.isInSubnet = isInSubnet;
common$2.isCorrect = isCorrect;
common$2.prefixLengthFromMask = prefixLengthFromMask;
common$2.numberToPaddedHex = numberToPaddedHex;
common$2.stringToPaddedHex = stringToPaddedHex;
common$2.testBit = testBit;
const address_error_1$2 = addressError;
function isInSubnet(address) {
  if (this.subnetMask < address.subnetMask) {
    return false;
  }
  if (this.mask(address.subnetMask) === address.mask()) {
    return true;
  }
  return false;
}
function isCorrect(defaultBits) {
  return function() {
    if (this.addressMinusSuffix !== this.correctForm()) {
      return false;
    }
    if (this.subnetMask === defaultBits && !this.parsedSubnet) {
      return true;
    }
    return this.parsedSubnet === String(this.subnetMask);
  };
}
function prefixLengthFromMask(value, totalBits) {
  const binary = value.toString(2).padStart(totalBits, "0");
  if (binary.length > totalBits) {
    throw new address_error_1$2.AddressError("Invalid subnet mask.");
  }
  const firstZero = binary.indexOf("0");
  if (firstZero === -1) {
    return totalBits;
  }
  if (binary.slice(firstZero).includes("1")) {
    throw new address_error_1$2.AddressError("Invalid subnet mask.");
  }
  return firstZero;
}
function numberToPaddedHex(number) {
  return number.toString(16).padStart(2, "0");
}
function stringToPaddedHex(numberString) {
  return numberToPaddedHex(parseInt(numberString, 10));
}
function testBit(binaryValue, position) {
  const { length } = binaryValue;
  if (position > length) {
    return false;
  }
  const positionInString = length - position;
  return binaryValue.substring(positionInString, positionInString + 1) === "1";
}
var constants$2 = {};
Object.defineProperty(constants$2, "__esModule", { value: true });
constants$2.RE_SUBNET_STRING = constants$2.RE_ADDRESS = constants$2.GROUPS = constants$2.BITS = void 0;
constants$2.BITS = 32;
constants$2.GROUPS = 4;
constants$2.RE_ADDRESS = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/g;
constants$2.RE_SUBNET_STRING = /\/\d{1,2}$/;
var __createBinding$2 = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
  if (k2 === void 0) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = { enumerable: true, get: function() {
      return m[k];
    } };
  }
  Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
  if (k2 === void 0) k2 = k;
  o[k2] = m[k];
});
var __setModuleDefault$2 = commonjsGlobal && commonjsGlobal.__setModuleDefault || (Object.create ? function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
} : function(o, v) {
  o["default"] = v;
});
var __importStar$2 = commonjsGlobal && commonjsGlobal.__importStar || function(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) {
    for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding$2(result, mod, k);
  }
  __setModuleDefault$2(result, mod);
  return result;
};
Object.defineProperty(ipv4, "__esModule", { value: true });
ipv4.Address4 = void 0;
const common$1 = __importStar$2(common$2);
const constants$1 = __importStar$2(constants$2);
const address_error_1$1 = addressError;
const isCorrect4 = common$1.isCorrect(constants$1.BITS);
class Address4 {
  constructor(address) {
    this.groups = constants$1.GROUPS;
    this.parsedAddress = [];
    this.parsedSubnet = "";
    this.subnet = "/32";
    this.subnetMask = 32;
    this.v4 = true;
    this.isCorrect = isCorrect4;
    this.isInSubnet = common$1.isInSubnet;
    this.address = address;
    const subnet = constants$1.RE_SUBNET_STRING.exec(address);
    if (subnet) {
      this.parsedSubnet = subnet[0].replace("/", "");
      this.subnetMask = parseInt(this.parsedSubnet, 10);
      this.subnet = `/${this.subnetMask}`;
      if (this.subnetMask < 0 || this.subnetMask > constants$1.BITS) {
        throw new address_error_1$1.AddressError("Invalid subnet mask.");
      }
      address = address.replace(constants$1.RE_SUBNET_STRING, "");
    }
    this.addressMinusSuffix = address;
    this.parsedAddress = this.parse(address);
  }
  /**
   * Returns true if the given string is a valid IPv4 address (with optional
   * CIDR subnet), false otherwise. Host bits in the subnet portion are
   * allowed (e.g. `192.168.1.5/24` is valid); for strict network-address
   * validation compare `correctForm()` to `startAddress().correctForm()`,
   * or use `networkForm()`.
   */
  static isValid(address) {
    try {
      new Address4(address);
      return true;
    } catch (e) {
      return false;
    }
  }
  /**
   * Parses an IPv4 address string into its four octet groups and stores the
   * result on `this.parsedAddress`. Called automatically by the constructor;
   * you typically don't need to call it directly. Throws `AddressError` if
   * the input is not a valid IPv4 address.
   */
  parse(address) {
    const groups = address.split(".");
    if (!address.match(constants$1.RE_ADDRESS)) {
      throw new address_error_1$1.AddressError("Invalid IPv4 address.");
    }
    return groups;
  }
  /**
   * Returns the address in correct form: octets joined with `.` and any
   * leading zeros stripped (e.g. `192.168.1.1`). For IPv4 this matches the
   * canonical dotted-decimal representation.
   */
  correctForm() {
    return this.parsedAddress.map((part) => parseInt(part, 10)).join(".");
  }
  /**
   * Construct an `Address4` from an address and a dotted-decimal subnet
   * mask given as separate strings (e.g. as returned by Node's
   * `os.networkInterfaces()`). Throws `AddressError` if the mask is
   * non-contiguous (e.g. `255.0.255.0`).
   * @example
   * var address = Address4.fromAddressAndMask('192.168.1.1', '255.255.255.0');
   * address.subnetMask; // 24
   */
  static fromAddressAndMask(address, mask) {
    const bits = common$1.prefixLengthFromMask(new Address4(mask).bigInt(), constants$1.BITS);
    return new Address4(`${address}/${bits}`);
  }
  /**
   * Construct an `Address4` from an address and a Cisco-style wildcard mask
   * given as separate strings (e.g. `0.0.0.255` for a `/24`). The wildcard
   * mask is the bitwise inverse of the subnet mask. Throws `AddressError`
   * if the mask is non-contiguous (e.g. `0.255.0.255`).
   * @example
   * var address = Address4.fromAddressAndWildcardMask('10.0.0.1', '0.0.0.255');
   * address.subnetMask; // 24
   */
  static fromAddressAndWildcardMask(address, wildcardMask) {
    const wildcard = new Address4(wildcardMask).bigInt();
    const allOnes = (BigInt(1) << BigInt(constants$1.BITS)) - BigInt(1);
    const mask = wildcard ^ allOnes;
    const bits = common$1.prefixLengthFromMask(mask, constants$1.BITS);
    return new Address4(`${address}/${bits}`);
  }
  /**
   * Construct an `Address4` from a wildcard pattern with trailing `*`
   * octets. The number of trailing wildcards determines the prefix
   * length: each `*` represents 8 bits.
   *
   * Only trailing whole-octet wildcards are supported. Partial-octet
   * wildcards (e.g. `192.168.0.1*`) and interior wildcards (e.g.
   * `192.*.0.1`) throw `AddressError`.
   * @example
   * Address4.fromWildcard('192.168.0.*').subnet;   // '/24'
   * Address4.fromWildcard('192.168.*.*').subnet;   // '/16'
   * Address4.fromWildcard('*.*.*.*').subnet;       // '/0'
   */
  static fromWildcard(input) {
    const groups = input.split(".");
    if (groups.length !== constants$1.GROUPS) {
      throw new address_error_1$1.AddressError("Wildcard pattern must have 4 octets");
    }
    let firstWildcard = -1;
    for (let i = 0; i < groups.length; i++) {
      if (groups[i] === "*") {
        if (firstWildcard === -1) {
          firstWildcard = i;
        }
      } else if (firstWildcard !== -1) {
        throw new address_error_1$1.AddressError("Wildcard `*` must only appear in trailing octets (e.g. `192.168.0.*`)");
      }
    }
    const trailing = firstWildcard === -1 ? 0 : groups.length - firstWildcard;
    const replaced = groups.map((g) => g === "*" ? "0" : g);
    const subnetBits = constants$1.BITS - trailing * 8;
    return new Address4(`${replaced.join(".")}/${subnetBits}`);
  }
  /**
   * Converts a hex string to an IPv4 address object. Accepts 8 hex digits
   * with optional `:` separators (e.g. `'7f000001'` or `'7f:00:00:01'`).
   * Throws `AddressError` for any other length or for non-hex characters.
   * @param {string} hex - a hex string to convert
   * @returns {Address4}
   */
  static fromHex(hex) {
    const stripped = hex.replace(/:/g, "");
    if (!/^[0-9a-fA-F]{8}$/.test(stripped)) {
      throw new address_error_1$1.AddressError("IPv4 hex must be exactly 8 hex digits");
    }
    const groups = [];
    for (let i = 0; i < 8; i += 2) {
      groups.push(parseInt(stripped.slice(i, i + 2), 16));
    }
    return new Address4(groups.join("."));
  }
  /**
   * Converts an integer into a IPv4 address object. The integer must be a
   * non-negative safe integer in the range `[0, 2**32 - 1]`; otherwise
   * `AddressError` is thrown.
   * @param {integer} integer - a number to convert
   * @returns {Address4}
   */
  static fromInteger(integer) {
    if (!Number.isInteger(integer) || integer < 0 || integer > 4294967295) {
      throw new address_error_1$1.AddressError("IPv4 integer must be in the range 0 to 2**32 - 1");
    }
    return Address4.fromHex(integer.toString(16).padStart(8, "0"));
  }
  /**
   * Return an address from in-addr.arpa form
   * @param {string} arpaFormAddress - an 'in-addr.arpa' form ipv4 address
   * @returns {Adress4}
   * @example
   * var address = Address4.fromArpa(42.2.0.192.in-addr.arpa.)
   * address.correctForm(); // '192.0.2.42'
   */
  static fromArpa(arpaFormAddress) {
    const leader = arpaFormAddress.replace(/(\.in-addr\.arpa)?\.$/, "");
    const address = leader.split(".").reverse().join(".");
    return new Address4(address);
  }
  /**
   * Converts an IPv4 address object to a hex string
   * @returns {String}
   */
  toHex() {
    return this.parsedAddress.map((part) => common$1.stringToPaddedHex(part)).join(":");
  }
  /**
   * Converts an IPv4 address object to an array of bytes.
   *
   * To get a Node.js `Buffer`, wrap the result: `Buffer.from(address.toArray())`.
   * @returns {Array}
   */
  toArray() {
    return this.parsedAddress.map((part) => parseInt(part, 10));
  }
  /**
   * Converts an IPv4 address object to an IPv6 address group
   * @returns {String}
   */
  toGroup6() {
    const output = [];
    let i;
    for (i = 0; i < constants$1.GROUPS; i += 2) {
      output.push(`${common$1.stringToPaddedHex(this.parsedAddress[i])}${common$1.stringToPaddedHex(this.parsedAddress[i + 1])}`);
    }
    return output.join(":");
  }
  /**
   * Returns the address as a `bigint`
   * @returns {bigint}
   */
  bigInt() {
    return BigInt(`0x${this.parsedAddress.map((n) => common$1.stringToPaddedHex(n)).join("")}`);
  }
  /**
   * Helper function getting start address.
   * @returns {bigint}
   */
  _startAddress() {
    return BigInt(`0b${this.mask() + "0".repeat(constants$1.BITS - this.subnetMask)}`);
  }
  /**
   * The first address in the range given by this address' subnet.
   * Often referred to as the Network Address.
   * @returns {Address4}
   */
  startAddress() {
    return Address4.fromBigInt(this._startAddress());
  }
  /**
   * The first host address in the range given by this address's subnet ie
   * the first address after the Network Address
   * @returns {Address4}
   */
  startAddressExclusive() {
    const adjust = BigInt("1");
    return Address4.fromBigInt(this._startAddress() + adjust);
  }
  /**
   * Helper function getting end address.
   * @returns {bigint}
   */
  _endAddress() {
    return BigInt(`0b${this.mask() + "1".repeat(constants$1.BITS - this.subnetMask)}`);
  }
  /**
   * The last address in the range given by this address' subnet
   * Often referred to as the Broadcast
   * @returns {Address4}
   */
  endAddress() {
    return Address4.fromBigInt(this._endAddress());
  }
  /**
   * The last host address in the range given by this address's subnet ie
   * the last address prior to the Broadcast Address
   * @returns {Address4}
   */
  endAddressExclusive() {
    const adjust = BigInt("1");
    return Address4.fromBigInt(this._endAddress() - adjust);
  }
  /**
   * The dotted-decimal form of the subnet mask, e.g. `255.255.240.0` for
   * a `/20`. Returns an `Address4`; call `.correctForm()` for the string.
   * @returns {Address4}
   */
  subnetMaskAddress() {
    return Address4.fromBigInt(BigInt(`0b${"1".repeat(this.subnetMask)}${"0".repeat(constants$1.BITS - this.subnetMask)}`));
  }
  /**
   * The Cisco-style wildcard mask, e.g. `0.0.0.255` for a `/24`. This is
   * the bitwise inverse of `subnetMaskAddress()`. Returns an `Address4`;
   * call `.correctForm()` for the string.
   * @returns {Address4}
   */
  wildcardMask() {
    return Address4.fromBigInt(BigInt(`0b${"0".repeat(this.subnetMask)}${"1".repeat(constants$1.BITS - this.subnetMask)}`));
  }
  /**
   * The network address in CIDR string form, e.g. `192.168.1.0/24` for
   * `192.168.1.5/24`. For an address with no explicit subnet the prefix is
   * `/32`, e.g. `networkForm()` on `192.168.1.5` returns `192.168.1.5/32`.
   * @returns {string}
   */
  networkForm() {
    return `${this.startAddress().correctForm()}/${this.subnetMask}`;
  }
  /**
   * Converts a BigInt to a v4 address object. The value must be in the
   * range `[0, 2**32 - 1]`; otherwise `AddressError` is thrown.
   * @param {bigint} bigInt - a BigInt to convert
   * @returns {Address4}
   */
  static fromBigInt(bigInt) {
    if (bigInt < 0n || bigInt > 0xffffffffn) {
      throw new address_error_1$1.AddressError("IPv4 BigInt must be in the range 0 to 2**32 - 1");
    }
    return Address4.fromHex(bigInt.toString(16).padStart(8, "0"));
  }
  /**
   * Convert a byte array to an Address4 object.
   *
   * To convert from a Node.js `Buffer`, spread it: `Address4.fromByteArray([...buf])`.
   * @param {Array<number>} bytes - an array of 4 bytes (0-255)
   * @returns {Address4}
   */
  static fromByteArray(bytes) {
    if (bytes.length !== 4) {
      throw new address_error_1$1.AddressError("IPv4 addresses require exactly 4 bytes");
    }
    for (let i = 0; i < bytes.length; i++) {
      if (!Number.isInteger(bytes[i]) || bytes[i] < 0 || bytes[i] > 255) {
        throw new address_error_1$1.AddressError("All bytes must be integers between 0 and 255");
      }
    }
    return this.fromUnsignedByteArray(bytes);
  }
  /**
   * Convert an unsigned byte array to an Address4 object
   * @param {Array<number>} bytes - an array of 4 unsigned bytes (0-255)
   * @returns {Address4}
   */
  static fromUnsignedByteArray(bytes) {
    if (bytes.length !== 4) {
      throw new address_error_1$1.AddressError("IPv4 addresses require exactly 4 bytes");
    }
    const address = bytes.join(".");
    return new Address4(address);
  }
  /**
   * Returns the first n bits of the address, defaulting to the
   * subnet mask
   * @returns {String}
   */
  mask(mask) {
    if (mask === void 0) {
      mask = this.subnetMask;
    }
    return this.getBitsBase2(0, mask);
  }
  /**
   * Returns the bits in the given range as a base-2 string
   * @returns {string}
   */
  getBitsBase2(start, end) {
    return this.binaryZeroPad().slice(start, end);
  }
  /**
   * Return the reversed ip6.arpa form of the address
   * @param {Object} options
   * @param {boolean} options.omitSuffix - omit the "in-addr.arpa" suffix
   * @returns {String}
   */
  reverseForm(options) {
    if (!options) {
      options = {};
    }
    const reversed = this.correctForm().split(".").reverse().join(".");
    if (options.omitSuffix) {
      return reversed;
    }
    return `${reversed}.in-addr.arpa.`;
  }
  /**
   * Returns true if the given address is a multicast address
   * @returns {boolean}
   */
  isMulticast() {
    return this.isInSubnet(MULTICAST_V4);
  }
  /**
   * Returns true if the address is in one of the [RFC 1918](https://datatracker.ietf.org/doc/html/rfc1918) private address ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`).
   * @returns {boolean}
   */
  isPrivate() {
    return PRIVATE_V4.some((subnet) => this.isInSubnet(subnet));
  }
  /**
   * Returns true if the address is in the loopback range `127.0.0.0/8` ([RFC 1122](https://datatracker.ietf.org/doc/html/rfc1122)).
   * @returns {boolean}
   */
  isLoopback() {
    return this.isInSubnet(LOOPBACK_V4);
  }
  /**
   * Returns true if the address is in the link-local range `169.254.0.0/16` ([RFC 3927](https://datatracker.ietf.org/doc/html/rfc3927)).
   * @returns {boolean}
   */
  isLinkLocal() {
    return this.isInSubnet(LINK_LOCAL_V4);
  }
  /**
   * Returns true if the address is the unspecified address `0.0.0.0`.
   * @returns {boolean}
   */
  isUnspecified() {
    return this.isInSubnet(UNSPECIFIED_V4);
  }
  /**
   * Returns true if the address is the limited broadcast address `255.255.255.255` ([RFC 919](https://datatracker.ietf.org/doc/html/rfc919)).
   * @returns {boolean}
   */
  isBroadcast() {
    return this.isInSubnet(BROADCAST_V4);
  }
  /**
   * Returns true if the address is in the carrier-grade NAT range `100.64.0.0/10` ([RFC 6598](https://datatracker.ietf.org/doc/html/rfc6598)).
   * @returns {boolean}
   */
  isCGNAT() {
    return this.isInSubnet(CGNAT_V4);
  }
  /**
   * Returns a zero-padded base-2 string representation of the address
   * @returns {string}
   */
  binaryZeroPad() {
    if (this._binaryZeroPad === void 0) {
      this._binaryZeroPad = this.bigInt().toString(2).padStart(constants$1.BITS, "0");
    }
    return this._binaryZeroPad;
  }
  /**
   * Groups an IPv4 address for inclusion at the end of an IPv6 address
   * @returns {String}
   */
  groupForV6() {
    const segments = this.parsedAddress;
    return this.address.replace(constants$1.RE_ADDRESS, `<span class="hover-group group-v4 group-6">${segments.slice(0, 2).join(".")}</span>.<span class="hover-group group-v4 group-7">${segments.slice(2, 4).join(".")}</span>`);
  }
}
ipv4.Address4 = Address4;
const MULTICAST_V4 = new Address4("224.0.0.0/4");
const PRIVATE_V4 = [
  new Address4("10.0.0.0/8"),
  new Address4("172.16.0.0/12"),
  new Address4("192.168.0.0/16")
];
const LOOPBACK_V4 = new Address4("127.0.0.0/8");
const LINK_LOCAL_V4 = new Address4("169.254.0.0/16");
const UNSPECIFIED_V4 = new Address4("0.0.0.0/32");
const BROADCAST_V4 = new Address4("255.255.255.255/32");
const CGNAT_V4 = new Address4("100.64.0.0/10");
var ipv6 = {};
var constants = {};
Object.defineProperty(constants, "__esModule", { value: true });
constants.RE_URL_WITH_PORT = constants.RE_URL = constants.RE_ZONE_STRING = constants.RE_SUBNET_STRING = constants.RE_BAD_ADDRESS = constants.RE_BAD_CHARACTERS = constants.TYPES = constants.SCOPES = constants.GROUPS = constants.BITS = void 0;
constants.BITS = 128;
constants.GROUPS = 8;
constants.SCOPES = {
  0: "Reserved",
  1: "Interface local",
  2: "Link local",
  4: "Admin local",
  5: "Site local",
  8: "Organization local",
  14: "Global",
  15: "Reserved"
};
constants.TYPES = {
  "ff01::1/128": "Multicast (All nodes on this interface)",
  "ff01::2/128": "Multicast (All routers on this interface)",
  "ff02::1/128": "Multicast (All nodes on this link)",
  "ff02::2/128": "Multicast (All routers on this link)",
  "ff05::2/128": "Multicast (All routers in this site)",
  "ff02::5/128": "Multicast (OSPFv3 AllSPF routers)",
  "ff02::6/128": "Multicast (OSPFv3 AllDR routers)",
  "ff02::9/128": "Multicast (RIP routers)",
  "ff02::a/128": "Multicast (EIGRP routers)",
  "ff02::d/128": "Multicast (PIM routers)",
  "ff02::16/128": "Multicast (MLDv2 reports)",
  "ff01::fb/128": "Multicast (mDNSv6)",
  "ff02::fb/128": "Multicast (mDNSv6)",
  "ff05::fb/128": "Multicast (mDNSv6)",
  "ff02::1:2/128": "Multicast (All DHCP servers and relay agents on this link)",
  "ff05::1:2/128": "Multicast (All DHCP servers and relay agents in this site)",
  "ff02::1:3/128": "Multicast (All DHCP servers on this link)",
  "ff05::1:3/128": "Multicast (All DHCP servers in this site)",
  "::/128": "Unspecified",
  "::1/128": "Loopback",
  "ff00::/8": "Multicast",
  "fe80::/10": "Link-local unicast",
  "fc00::/7": "Unique local",
  "2002::/16": "6to4",
  "2001:db8::/32": "Documentation",
  "64:ff9b::/96": "NAT64 (well-known)",
  "64:ff9b:1::/48": "NAT64 (local-use)"
};
constants.RE_BAD_CHARACTERS = /([^0-9a-f:/%])/gi;
constants.RE_BAD_ADDRESS = /([0-9a-f]{5,}|:{3,}|[^:]:$|^:[^:]|\/$)/gi;
constants.RE_SUBNET_STRING = /\/\d{1,3}(?=%|$)/;
constants.RE_ZONE_STRING = /%.*$/;
constants.RE_URL = /^\[{0,1}([0-9a-f:]+)\]{0,1}/;
constants.RE_URL_WITH_PORT = /\[([0-9a-f:]+)\]:([0-9]{1,5})/;
var helpers$1 = {};
Object.defineProperty(helpers$1, "__esModule", { value: true });
helpers$1.escapeHtml = escapeHtml;
helpers$1.spanAllZeroes = spanAllZeroes;
helpers$1.spanAll = spanAll;
helpers$1.spanLeadingZeroes = spanLeadingZeroes;
helpers$1.simpleGroup = simpleGroup;
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function spanAllZeroes(s) {
  return escapeHtml(s).replace(/(0+)/g, '<span class="zero">$1</span>');
}
function spanAll(s, offset = 0) {
  const letters = s.split("");
  return letters.map((n, i) => `<span class="digit value-${escapeHtml(n)} position-${i + offset}">${spanAllZeroes(n)}</span>`).join("");
}
function spanLeadingZeroesSimple(group) {
  return escapeHtml(group).replace(/^(0+)/, '<span class="zero">$1</span>');
}
function spanLeadingZeroes(address) {
  const groups = address.split(":");
  return groups.map((g) => spanLeadingZeroesSimple(g)).join(":");
}
function simpleGroup(addressString, offset = 0) {
  const groups = addressString.split(":");
  return groups.map((g, i) => {
    if (/group-v4/.test(g)) {
      return g;
    }
    return `<span class="hover-group group-${i + offset}">${spanLeadingZeroesSimple(g)}</span>`;
  });
}
var regularExpressions = {};
var __createBinding$1 = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
  if (k2 === void 0) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = { enumerable: true, get: function() {
      return m[k];
    } };
  }
  Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
  if (k2 === void 0) k2 = k;
  o[k2] = m[k];
});
var __setModuleDefault$1 = commonjsGlobal && commonjsGlobal.__setModuleDefault || (Object.create ? function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
} : function(o, v) {
  o["default"] = v;
});
var __importStar$1 = commonjsGlobal && commonjsGlobal.__importStar || function(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) {
    for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding$1(result, mod, k);
  }
  __setModuleDefault$1(result, mod);
  return result;
};
Object.defineProperty(regularExpressions, "__esModule", { value: true });
regularExpressions.ADDRESS_BOUNDARY = void 0;
regularExpressions.groupPossibilities = groupPossibilities;
regularExpressions.padGroup = padGroup;
regularExpressions.simpleRegularExpression = simpleRegularExpression;
regularExpressions.possibleElisions = possibleElisions;
const v6 = __importStar$1(constants);
function groupPossibilities(possibilities) {
  return `(${possibilities.join("|")})`;
}
function padGroup(group) {
  if (group.length < 4) {
    return `0{0,${4 - group.length}}${group}`;
  }
  return group;
}
regularExpressions.ADDRESS_BOUNDARY = "[^A-Fa-f0-9:]";
function simpleRegularExpression(groups) {
  const zeroIndexes = [];
  groups.forEach((group, i) => {
    const groupInteger = parseInt(group, 16);
    if (groupInteger === 0) {
      zeroIndexes.push(i);
    }
  });
  const possibilities = zeroIndexes.map((zeroIndex) => groups.map((group, i) => {
    if (i === zeroIndex) {
      const elision = i === 0 || i === v6.GROUPS - 1 ? ":" : "";
      return groupPossibilities([padGroup(group), elision]);
    }
    return padGroup(group);
  }).join(":"));
  possibilities.push(groups.map(padGroup).join(":"));
  return groupPossibilities(possibilities);
}
function possibleElisions(elidedGroups, moreLeft, moreRight) {
  const left = moreLeft ? "" : ":";
  const right = moreRight ? "" : ":";
  const possibilities = [];
  if (!moreLeft && !moreRight) {
    possibilities.push("::");
  }
  if (moreLeft && moreRight) {
    possibilities.push("");
  }
  if (moreRight && !moreLeft || !moreRight && moreLeft) {
    possibilities.push(":");
  }
  possibilities.push(`${left}(:0{1,4}){1,${elidedGroups - 1}}`);
  possibilities.push(`(0{1,4}:){1,${elidedGroups - 1}}${right}`);
  possibilities.push(`(0{1,4}:){${elidedGroups - 1}}0{1,4}`);
  for (let groups = 1; groups < elidedGroups - 1; groups++) {
    for (let position = 1; position < elidedGroups - groups; position++) {
      possibilities.push(`(0{1,4}:){${position}}:(0{1,4}:){${elidedGroups - position - groups - 1}}0{1,4}`);
    }
  }
  return groupPossibilities(possibilities);
}
var __createBinding = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
  if (k2 === void 0) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = { enumerable: true, get: function() {
      return m[k];
    } };
  }
  Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
  if (k2 === void 0) k2 = k;
  o[k2] = m[k];
});
var __setModuleDefault = commonjsGlobal && commonjsGlobal.__setModuleDefault || (Object.create ? function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
} : function(o, v) {
  o["default"] = v;
});
var __importStar = commonjsGlobal && commonjsGlobal.__importStar || function(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) {
    for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  }
  __setModuleDefault(result, mod);
  return result;
};
Object.defineProperty(ipv6, "__esModule", { value: true });
ipv6.Address6 = void 0;
const common = __importStar(common$2);
const constants4 = __importStar(constants$2);
const constants6 = __importStar(constants);
const helpers = __importStar(helpers$1);
const ipv4_1 = ipv4;
const regular_expressions_1 = regularExpressions;
const address_error_1 = addressError;
const common_1 = common$2;
const isCorrect6 = common.isCorrect(constants6.BITS);
function assert(condition) {
  if (!condition) {
    throw new Error("Assertion failed.");
  }
}
function addCommas(number) {
  const r = /(\d+)(\d{3})/;
  while (r.test(number)) {
    number = number.replace(r, "$1,$2");
  }
  return number;
}
function spanLeadingZeroes4(n) {
  n = n.replace(/^(0{1,})([1-9]+)$/, '<span class="parse-error">$1</span>$2');
  n = n.replace(/^(0{1,})(0)$/, '<span class="parse-error">$1</span>$2');
  return n;
}
function compact(address, slice) {
  const s1 = [];
  const s2 = [];
  let i;
  for (i = 0; i < address.length; i++) {
    if (i < slice[0]) {
      s1.push(address[i]);
    } else if (i > slice[1]) {
      s2.push(address[i]);
    }
  }
  return s1.concat(["compact"]).concat(s2);
}
function paddedHex(octet) {
  return parseInt(octet, 16).toString(16).padStart(4, "0");
}
function unsignByte(b) {
  return b & 255;
}
class Address6 {
  constructor(address, optionalGroups) {
    this.addressMinusSuffix = "";
    this.parsedSubnet = "";
    this.subnet = "/128";
    this.subnetMask = 128;
    this.v4 = false;
    this.zone = "";
    this.isInSubnet = common.isInSubnet;
    this.isCorrect = isCorrect6;
    if (optionalGroups === void 0) {
      this.groups = constants6.GROUPS;
    } else {
      this.groups = optionalGroups;
    }
    this.address = address;
    const subnet = constants6.RE_SUBNET_STRING.exec(address);
    if (subnet) {
      this.parsedSubnet = subnet[0].replace("/", "");
      this.subnetMask = parseInt(this.parsedSubnet, 10);
      this.subnet = `/${this.subnetMask}`;
      if (Number.isNaN(this.subnetMask) || this.subnetMask < 0 || this.subnetMask > constants6.BITS) {
        throw new address_error_1.AddressError("Invalid subnet mask.");
      }
      address = address.replace(constants6.RE_SUBNET_STRING, "");
    } else if (/\//.test(address)) {
      throw new address_error_1.AddressError("Invalid subnet mask.");
    }
    const zone = constants6.RE_ZONE_STRING.exec(address);
    if (zone) {
      this.zone = zone[0];
      address = address.replace(constants6.RE_ZONE_STRING, "");
    }
    this.addressMinusSuffix = address;
    this.parsedAddress = this.parse(this.addressMinusSuffix);
  }
  /**
   * Returns true if the given string is a valid IPv6 address (with optional
   * CIDR subnet and zone identifier), false otherwise. Host bits in the
   * subnet portion are allowed (e.g. `2001:db8::1/32` is valid); for strict
   * network-address validation compare `correctForm()` to
   * `startAddress().correctForm()`, or use `networkForm()`.
   */
  static isValid(address) {
    try {
      new Address6(address);
      return true;
    } catch (e) {
      return false;
    }
  }
  /**
   * Convert a BigInt to a v6 address object. The value must be in the
   * range `[0, 2**128 - 1]`; otherwise `AddressError` is thrown.
   * @param {bigint} bigInt - a BigInt to convert
   * @returns {Address6}
   * @example
   * var bigInt = BigInt('1000000000000');
   * var address = Address6.fromBigInt(bigInt);
   * address.correctForm(); // '::e8:d4a5:1000'
   */
  static fromBigInt(bigInt) {
    if (bigInt < 0n || bigInt > (1n << BigInt(constants6.BITS)) - 1n) {
      throw new address_error_1.AddressError("IPv6 BigInt must be in the range 0 to 2**128 - 1");
    }
    const hex = bigInt.toString(16).padStart(32, "0");
    const groups = [];
    for (let i = 0; i < constants6.GROUPS; i++) {
      groups.push(hex.slice(i * 4, (i + 1) * 4));
    }
    return new Address6(groups.join(":"));
  }
  /**
   * Parse a URL (with optional bracketed host and port) into an address and
   * port. Returns either `{ address, port }` on success or
   * `{ error, address: null, port: null }` if the URL could not be parsed.
   * Ports are returned as numbers (or `null` if absent or out of range).
   * @example
   * var addressAndPort = Address6.fromURL('http://[ffff::]:8080/foo/');
   * addressAndPort.address.correctForm(); // 'ffff::'
   * addressAndPort.port; // 8080
   */
  static fromURL(url2) {
    let host;
    let port = null;
    let result;
    if (url2.indexOf("[") !== -1 && url2.indexOf("]:") !== -1) {
      result = constants6.RE_URL_WITH_PORT.exec(url2);
      if (result === null) {
        return {
          error: "failed to parse address with port",
          address: null,
          port: null
        };
      }
      host = result[1];
      port = result[2];
    } else if (url2.indexOf("/") !== -1) {
      url2 = url2.replace(/^[a-z0-9]+:\/\//, "");
      result = constants6.RE_URL.exec(url2);
      if (result === null) {
        return {
          error: "failed to parse address from URL",
          address: null,
          port: null
        };
      }
      host = result[1];
    } else {
      host = url2;
    }
    if (port) {
      port = parseInt(port, 10);
      if (port < 0 || port > 65536) {
        port = null;
      }
    } else {
      port = null;
    }
    return {
      address: new Address6(host),
      port
    };
  }
  /**
   * Construct an `Address6` from an address and a hex subnet mask given as
   * separate strings (e.g. as returned by Node's `os.networkInterfaces()`).
   * Throws `AddressError` if the mask is non-contiguous (e.g.
   * `ffff::ffff`).
   * @example
   * var address = Address6.fromAddressAndMask('fe80::1', 'ffff:ffff:ffff:ffff::');
   * address.subnetMask; // 64
   */
  static fromAddressAndMask(address, mask) {
    const bits = common.prefixLengthFromMask(new Address6(mask).bigInt(), constants6.BITS);
    return new Address6(`${address}/${bits}`);
  }
  /**
   * Construct an `Address6` from an address and a Cisco-style wildcard mask
   * given as separate strings (e.g. `::ffff:ffff:ffff:ffff` for a `/64`).
   * The wildcard mask is the bitwise inverse of the subnet mask. Throws
   * `AddressError` if the mask is non-contiguous.
   * @example
   * var address = Address6.fromAddressAndWildcardMask('fe80::1', '::ffff:ffff:ffff:ffff');
   * address.subnetMask; // 64
   */
  static fromAddressAndWildcardMask(address, wildcardMask) {
    const wildcard = new Address6(wildcardMask).bigInt();
    const allOnes = (BigInt(1) << BigInt(constants6.BITS)) - BigInt(1);
    const mask = wildcard ^ allOnes;
    const bits = common.prefixLengthFromMask(mask, constants6.BITS);
    return new Address6(`${address}/${bits}`);
  }
  /**
   * Construct an `Address6` from a wildcard pattern with trailing `*`
   * groups. The number of trailing wildcards determines the prefix
   * length: each `*` represents 16 bits. `::` is expanded to zero groups
   * (not wildcards) before evaluating trailing wildcards.
   *
   * Only trailing whole-group wildcards are supported. Partial-group
   * wildcards (e.g. `2001:db8::0*`) and interior wildcards (e.g.
   * `*::1`) throw `AddressError`.
   * @example
   * Address6.fromWildcard('2001:db8:*:*:*:*:*:*').subnet;  // '/32'
   * Address6.fromWildcard('2001:db8::*').subnet;           // '/112'
   * Address6.fromWildcard('*:*:*:*:*:*:*:*').subnet;       // '/0'
   */
  static fromWildcard(input) {
    if (input.includes("%") || input.includes("/")) {
      throw new address_error_1.AddressError("Wildcard pattern must not include a zone or CIDR suffix");
    }
    const halves = input.split("::");
    if (halves.length > 2) {
      throw new address_error_1.AddressError("Wildcard pattern cannot contain more than one '::'");
    }
    let groups;
    if (halves.length === 2) {
      const left = halves[0] === "" ? [] : halves[0].split(":");
      const right = halves[1] === "" ? [] : halves[1].split(":");
      const remaining = constants6.GROUPS - left.length - right.length;
      if (remaining < 1) {
        throw new address_error_1.AddressError("Wildcard pattern with '::' has too many groups");
      }
      groups = [...left, ...new Array(remaining).fill("0"), ...right];
    } else {
      groups = input.split(":");
    }
    if (groups.length !== constants6.GROUPS) {
      throw new address_error_1.AddressError("Wildcard pattern must have 8 groups");
    }
    let firstWildcard = -1;
    for (let i = 0; i < groups.length; i++) {
      if (groups[i] === "*") {
        if (firstWildcard === -1) {
          firstWildcard = i;
        }
      } else if (firstWildcard !== -1) {
        throw new address_error_1.AddressError("Wildcard `*` must only appear in trailing groups (e.g. `2001:db8:*:*:*:*:*:*`)");
      }
    }
    const trailing = firstWildcard === -1 ? 0 : groups.length - firstWildcard;
    const replaced = groups.map((g) => g === "*" ? "0" : g);
    const subnetBits = constants6.BITS - trailing * 16;
    return new Address6(`${replaced.join(":")}/${subnetBits}`);
  }
  /**
   * Create an IPv6-mapped address given an IPv4 address
   * @param {string} address - An IPv4 address string
   * @returns {Address6}
   * @example
   * var address = Address6.fromAddress4('192.168.0.1');
   * address.correctForm(); // '::ffff:c0a8:1'
   * address.to4in6(); // '::ffff:192.168.0.1'
   */
  static fromAddress4(address) {
    const address4 = new ipv4_1.Address4(address);
    const mask6 = constants6.BITS - (constants4.BITS - address4.subnetMask);
    return new Address6(`::ffff:${address4.correctForm()}/${mask6}`);
  }
  /**
   * Return an address from ip6.arpa form
   * @param {string} arpaFormAddress - an 'ip6.arpa' form address
   * @returns {Adress6}
   * @example
   * var address = Address6.fromArpa(e.f.f.f.3.c.2.6.f.f.f.e.6.6.8.e.1.0.6.7.9.4.e.c.0.0.0.0.1.0.0.2.ip6.arpa.)
   * address.correctForm(); // '2001:0:ce49:7601:e866:efff:62c3:fffe'
   */
  static fromArpa(arpaFormAddress) {
    let address = arpaFormAddress.replace(/(\.ip6\.arpa)?\.$/, "");
    const semicolonAmount = 7;
    if (address.length !== 63) {
      throw new address_error_1.AddressError("Invalid 'ip6.arpa' form.");
    }
    const parts = address.split(".").reverse();
    for (let i = semicolonAmount; i > 0; i--) {
      const insertIndex = i * 4;
      parts.splice(insertIndex, 0, ":");
    }
    address = parts.join("");
    return new Address6(address);
  }
  /**
   * Return the Microsoft UNC transcription of the address
   * @returns {String} the Microsoft UNC transcription of the address
   */
  microsoftTranscription() {
    return `${this.correctForm().replace(/:/g, "-")}.ipv6-literal.net`;
  }
  /**
   * Return the first n bits of the address, defaulting to the subnet mask
   * @param {number} [mask=subnet] - the number of bits to mask
   * @returns {String} the first n bits of the address as a string
   */
  mask(mask = this.subnetMask) {
    return this.getBitsBase2(0, mask);
  }
  /**
   * Return the number of possible subnets of a given size in the address
   * @param {number} [subnetSize=128] - the subnet size
   * @returns {String}
   */
  // TODO: probably useful to have a numeric version of this too
  possibleSubnets(subnetSize = 128) {
    const availableBits = constants6.BITS - this.subnetMask;
    const subnetBits = Math.abs(subnetSize - constants6.BITS);
    const subnetPowers = availableBits - subnetBits;
    if (subnetPowers < 0) {
      return "0";
    }
    return addCommas((BigInt("2") ** BigInt(subnetPowers)).toString(10));
  }
  /**
   * Helper function getting start address.
   * @returns {bigint}
   */
  _startAddress() {
    return BigInt(`0b${this.mask() + "0".repeat(constants6.BITS - this.subnetMask)}`);
  }
  /**
   * The first address in the range given by this address' subnet
   * Often referred to as the Network Address.
   * @returns {Address6}
   */
  startAddress() {
    return Address6.fromBigInt(this._startAddress());
  }
  /**
   * The first host address in the range given by this address's subnet ie
   * the first address after the Network Address
   * @returns {Address6}
   */
  startAddressExclusive() {
    const adjust = BigInt("1");
    return Address6.fromBigInt(this._startAddress() + adjust);
  }
  /**
   * Helper function getting end address.
   * @returns {bigint}
   */
  _endAddress() {
    return BigInt(`0b${this.mask() + "1".repeat(constants6.BITS - this.subnetMask)}`);
  }
  /**
   * The last address in the range given by this address' subnet
   * Often referred to as the Broadcast
   * @returns {Address6}
   */
  endAddress() {
    return Address6.fromBigInt(this._endAddress());
  }
  /**
   * The last host address in the range given by this address's subnet ie
   * the last address prior to the Broadcast Address
   * @returns {Address6}
   */
  endAddressExclusive() {
    const adjust = BigInt("1");
    return Address6.fromBigInt(this._endAddress() - adjust);
  }
  /**
   * The hex form of the subnet mask, e.g. `ffff:ffff:ffff:ffff::` for a
   * `/64`. Returns an `Address6`; call `.correctForm()` for the string.
   * @returns {Address6}
   */
  subnetMaskAddress() {
    return Address6.fromBigInt(BigInt(`0b${"1".repeat(this.subnetMask)}${"0".repeat(constants6.BITS - this.subnetMask)}`));
  }
  /**
   * The Cisco-style wildcard mask, e.g. `::ffff:ffff:ffff:ffff` for a
   * `/64`. This is the bitwise inverse of `subnetMaskAddress()`. Returns
   * an `Address6`; call `.correctForm()` for the string.
   * @returns {Address6}
   */
  wildcardMask() {
    return Address6.fromBigInt(BigInt(`0b${"0".repeat(this.subnetMask)}${"1".repeat(constants6.BITS - this.subnetMask)}`));
  }
  /**
   * The network address in CIDR string form, e.g. `2001:db8::/32` for
   * `2001:db8::1/32`. For an address with no explicit subnet the prefix
   * is `/128`, e.g. `networkForm()` on `2001:db8::1` returns
   * `2001:db8::1/128`.
   * @returns {string}
   */
  networkForm() {
    return `${this.startAddress().correctForm()}/${this.subnetMask}`;
  }
  /**
   * Return the scope of the address. The 4-bit scope field
   * ([RFC 4291 §2.7](https://datatracker.ietf.org/doc/html/rfc4291#section-2.7))
   * is only defined for multicast addresses; for unicast addresses the scope
   * is derived from the address type per
   * [RFC 4007 §6](https://datatracker.ietf.org/doc/html/rfc4007#section-6).
   * @returns {String}
   */
  getScope() {
    const type2 = this.getType();
    if (type2 === "Multicast" || type2.startsWith("Multicast ")) {
      const scope = constants6.SCOPES[parseInt(this.getBits(12, 16).toString(10), 10)];
      return scope || "Unknown";
    }
    if (type2 === "Link-local unicast" || type2 === "Loopback") {
      return "Link local";
    }
    if (type2 === "Unspecified") {
      return "Unknown";
    }
    return "Global";
  }
  /**
   * Return the type of the address
   * @returns {String}
   */
  getType() {
    for (let i = 0; i < TYPE_SUBNETS.length; i++) {
      const entry = TYPE_SUBNETS[i];
      if (this.isInSubnet(entry[0])) {
        return entry[1];
      }
    }
    return "Global unicast";
  }
  /**
   * Return the bits in the given range as a BigInt
   * @returns {bigint}
   */
  getBits(start, end) {
    return BigInt(`0b${this.getBitsBase2(start, end)}`);
  }
  /**
   * Return the bits in the given range as a base-2 string
   * @returns {String}
   */
  getBitsBase2(start, end) {
    return this.binaryZeroPad().slice(start, end);
  }
  /**
   * Return the bits in the given range as a base-16 string
   * @returns {String}
   */
  getBitsBase16(start, end) {
    const length = end - start;
    if (length % 4 !== 0) {
      throw new Error("Length of bits to retrieve must be divisible by four");
    }
    return this.getBits(start, end).toString(16).padStart(length / 4, "0");
  }
  /**
   * Return the bits that are set past the subnet mask length
   * @returns {String}
   */
  getBitsPastSubnet() {
    return this.getBitsBase2(this.subnetMask, constants6.BITS);
  }
  /**
   * Return the reversed ip6.arpa form of the address
   * @param {Object} options
   * @param {boolean} options.omitSuffix - omit the "ip6.arpa" suffix
   * @returns {String}
   */
  reverseForm(options) {
    if (!options) {
      options = {};
    }
    const characters = Math.floor(this.subnetMask / 4);
    const reversed = this.canonicalForm().replace(/:/g, "").split("").slice(0, characters).reverse().join(".");
    if (characters > 0) {
      if (options.omitSuffix) {
        return reversed;
      }
      return `${reversed}.ip6.arpa.`;
    }
    if (options.omitSuffix) {
      return "";
    }
    return "ip6.arpa.";
  }
  /**
   * Returns the address in correct form, per
   * [RFC 5952](https://datatracker.ietf.org/doc/html/rfc5952): leading zeros
   * stripped, the longest run of zero groups collapsed to `::`, and hex digits
   * lowercased (e.g. `2001:db8::1`). This is the recommended form for display.
   */
  correctForm() {
    let i;
    let groups = [];
    let zeroCounter = 0;
    const zeroes = [];
    for (i = 0; i < this.parsedAddress.length; i++) {
      const value = parseInt(this.parsedAddress[i], 16);
      if (value === 0) {
        zeroCounter++;
      }
      if (value !== 0 && zeroCounter > 0) {
        if (zeroCounter > 1) {
          zeroes.push([i - zeroCounter, i - 1]);
        }
        zeroCounter = 0;
      }
    }
    if (zeroCounter > 1) {
      zeroes.push([this.parsedAddress.length - zeroCounter, this.parsedAddress.length - 1]);
    }
    const zeroLengths = zeroes.map((n) => n[1] - n[0] + 1);
    if (zeroes.length > 0) {
      const index = zeroLengths.indexOf(Math.max(...zeroLengths));
      groups = compact(this.parsedAddress, zeroes[index]);
    } else {
      groups = this.parsedAddress;
    }
    for (i = 0; i < groups.length; i++) {
      if (groups[i] !== "compact") {
        groups[i] = parseInt(groups[i], 16).toString(16);
      }
    }
    let correct = groups.join(":");
    correct = correct.replace(/^compact$/, "::");
    correct = correct.replace(/(^compact)|(compact$)/, ":");
    correct = correct.replace(/compact/, "");
    return correct;
  }
  /**
   * Return a zero-padded base-2 string representation of the address
   * @returns {String}
   * @example
   * var address = new Address6('2001:4860:4001:803::1011');
   * address.binaryZeroPad();
   * // '0010000000000001010010000110000001000000000000010000100000000011
   * //  0000000000000000000000000000000000000000000000000001000000010001'
   */
  binaryZeroPad() {
    if (this._binaryZeroPad === void 0) {
      this._binaryZeroPad = this.bigInt().toString(2).padStart(constants6.BITS, "0");
    }
    return this._binaryZeroPad;
  }
  /**
   * Parses a v4-in-v6 string (e.g. `::ffff:192.168.0.1`) by extracting the
   * trailing IPv4 address into `this.address4` / `this.parsedAddress4` and
   * returning the address with the v4 portion converted to two v6 groups.
   * Used internally by `parse()`.
   */
  // TODO: Improve the semantics of this helper function
  parse4in6(address) {
    if (address.indexOf(".") === -1) {
      return address;
    }
    const groups = address.split(":");
    const lastGroup = groups.slice(-1)[0];
    const address4 = lastGroup.match(constants4.RE_ADDRESS);
    if (address4) {
      this.parsedAddress4 = address4[0];
      this.address4 = new ipv4_1.Address4(this.parsedAddress4);
      for (let i = 0; i < this.address4.groups; i++) {
        if (/^0[0-9]+/.test(this.address4.parsedAddress[i])) {
          const highlighted = this.address4.parsedAddress.map(spanLeadingZeroes4).join(".");
          const prefix = groups.slice(0, -1).map(helpers.escapeHtml).join(":");
          const separator = groups.length > 1 ? ":" : "";
          throw new address_error_1.AddressError("IPv4 addresses can't have leading zeroes.", `${prefix}${separator}${highlighted}`);
        }
      }
      this.v4 = true;
      groups[groups.length - 1] = this.address4.toGroup6();
      address = groups.join(":");
    }
    return address;
  }
  /**
   * Parses an IPv6 address string into its 8 hexadecimal groups (expanding
   * any `::` elision and any trailing v4-in-v6 portion) and stores the result
   * on `this.parsedAddress`. Called automatically by the constructor; you
   * typically don't need to call it directly. Throws `AddressError` if the
   * input is malformed.
   */
  // TODO: Make private?
  parse(address) {
    address = this.parse4in6(address);
    const badCharacters = address.match(constants6.RE_BAD_CHARACTERS);
    if (badCharacters) {
      throw new address_error_1.AddressError(`Bad character${badCharacters.length > 1 ? "s" : ""} detected in address: ${badCharacters.join("")}`, address.replace(constants6.RE_BAD_CHARACTERS, '<span class="parse-error">$1</span>'));
    }
    const badAddress = address.match(constants6.RE_BAD_ADDRESS);
    if (badAddress) {
      throw new address_error_1.AddressError(`Address failed regex: ${badAddress.join("")}`, address.replace(constants6.RE_BAD_ADDRESS, '<span class="parse-error">$1</span>'));
    }
    let groups = [];
    const halves = address.split("::");
    if (halves.length === 2) {
      let first = halves[0].split(":");
      let last = halves[1].split(":");
      if (first.length === 1 && first[0] === "") {
        first = [];
      }
      if (last.length === 1 && last[0] === "") {
        last = [];
      }
      const remaining = this.groups - (first.length + last.length);
      if (!remaining) {
        throw new address_error_1.AddressError("Error parsing groups");
      }
      this.elidedGroups = remaining;
      this.elisionBegin = first.length;
      this.elisionEnd = first.length + this.elidedGroups;
      groups = groups.concat(first);
      for (let i = 0; i < remaining; i++) {
        groups.push("0");
      }
      groups = groups.concat(last);
    } else if (halves.length === 1) {
      groups = address.split(":");
      this.elidedGroups = 0;
    } else {
      throw new address_error_1.AddressError("Too many :: groups found");
    }
    groups = groups.map((group) => parseInt(group, 16).toString(16));
    if (groups.length !== this.groups) {
      throw new address_error_1.AddressError("Incorrect number of groups found");
    }
    return groups;
  }
  /**
   * Returns the canonical (fully expanded) form of the address: all 8 groups,
   * each padded to 4 hex digits, with no `::` collapsing
   * (e.g. `2001:0db8:0000:0000:0000:0000:0000:0001`). Useful for sorting and
   * byte-exact comparison.
   */
  canonicalForm() {
    return this.parsedAddress.map(paddedHex).join(":");
  }
  /**
   * Return the decimal form of the address
   * @returns {String}
   */
  decimal() {
    return this.parsedAddress.map((n) => parseInt(n, 16).toString(10).padStart(5, "0")).join(":");
  }
  /**
   * Return the address as a BigInt
   * @returns {bigint}
   */
  bigInt() {
    return BigInt(`0x${this.parsedAddress.map(paddedHex).join("")}`);
  }
  /**
   * Return the last two groups of this address as an IPv4 address string
   * @returns {Address4}
   * @example
   * var address = new Address6('2001:4860:4001::1825:bf11');
   * address.to4().correctForm(); // '24.37.191.17'
   */
  to4() {
    const binary = this.binaryZeroPad().split("");
    return ipv4_1.Address4.fromHex(BigInt(`0b${binary.slice(96, 128).join("")}`).toString(16).padStart(8, "0"));
  }
  /**
   * Return the v4-in-v6 form of the address
   * @returns {String}
   */
  to4in6() {
    const address4 = this.to4();
    const address6 = new Address6(this.parsedAddress.slice(0, 6).join(":"), 6);
    const correct = address6.correctForm();
    let infix = "";
    if (!/:$/.test(correct)) {
      infix = ":";
    }
    return correct + infix + address4.address;
  }
  /**
   * Decodes the Teredo tunneling fields embedded in this address. Returns the
   * Teredo prefix, server IPv4, client IPv4, raw flag bits, cone-NAT flag,
   * UDP port, and Microsoft-format flag breakdown (reserved, universal/local,
   * group/individual, nonce). Only meaningful for addresses in `2001::/32`.
   */
  inspectTeredo() {
    const prefix = this.getBitsBase16(0, 32);
    const bitsForUdpPort = this.getBits(80, 96);
    const udpPort = (bitsForUdpPort ^ BigInt("0xffff")).toString();
    const server4 = ipv4_1.Address4.fromHex(this.getBitsBase16(32, 64));
    const bitsForClient4 = this.getBits(96, 128);
    const client4 = ipv4_1.Address4.fromHex((bitsForClient4 ^ BigInt("0xffffffff")).toString(16).padStart(8, "0"));
    const flagsBase2 = this.getBitsBase2(64, 80);
    const coneNat = (0, common_1.testBit)(flagsBase2, 15);
    const reserved = (0, common_1.testBit)(flagsBase2, 14);
    const groupIndividual = (0, common_1.testBit)(flagsBase2, 8);
    const universalLocal = (0, common_1.testBit)(flagsBase2, 9);
    const nonce = BigInt(`0b${flagsBase2.slice(2, 6) + flagsBase2.slice(8, 16)}`).toString(10);
    return {
      prefix: `${prefix.slice(0, 4)}:${prefix.slice(4, 8)}`,
      server4: server4.address,
      client4: client4.address,
      flags: flagsBase2,
      coneNat,
      microsoft: {
        reserved,
        universalLocal,
        groupIndividual,
        nonce
      },
      udpPort
    };
  }
  /**
   * Decodes the 6to4 tunneling fields embedded in this address. Returns the
   * 6to4 prefix and the embedded IPv4 gateway address. Only meaningful for
   * addresses in `2002::/16`.
   */
  inspect6to4() {
    const prefix = this.getBitsBase16(0, 16);
    const gateway = ipv4_1.Address4.fromHex(this.getBitsBase16(16, 48));
    return {
      prefix: prefix.slice(0, 4),
      gateway: gateway.address
    };
  }
  /**
   * Return a v6 6to4 address from a v6 v4inv6 address
   * @returns {Address6}
   */
  to6to4() {
    if (!this.is4()) {
      return null;
    }
    const addr6to4 = [
      "2002",
      this.getBitsBase16(96, 112),
      this.getBitsBase16(112, 128),
      "",
      "/16"
    ].join(":");
    return new Address6(addr6to4);
  }
  /**
   * Embed an IPv4 address into a NAT64 IPv6 address using the encoding
   * defined by [RFC 6052](https://datatracker.ietf.org/doc/html/rfc6052).
   * The default prefix is the well-known prefix `64:ff9b::/96`. The prefix
   * length must be one of 32, 40, 48, 56, 64, or 96; for prefixes shorter
   * than /64 the IPv4 octets are split around the reserved bits 64–71.
   * @example
   * Address6.fromAddress4Nat64('192.0.2.33').correctForm(); // '64:ff9b::c000:221'
   * Address6.fromAddress4Nat64('192.0.2.33', '2001:db8::/32').correctForm(); // '2001:db8:c000:221::'
   */
  static fromAddress4Nat64(address, prefix = "64:ff9b::/96") {
    const v4 = new ipv4_1.Address4(address);
    const prefix6 = new Address6(prefix);
    const pl = prefix6.subnetMask;
    if (pl !== 32 && pl !== 40 && pl !== 48 && pl !== 56 && pl !== 64 && pl !== 96) {
      throw new address_error_1.AddressError("NAT64 prefix length must be 32, 40, 48, 56, 64, or 96");
    }
    const prefixBits = prefix6.binaryZeroPad();
    const v4Bits = v4.binaryZeroPad();
    let bits;
    if (pl === 96) {
      bits = prefixBits.slice(0, 96) + v4Bits;
    } else {
      const beforeU = 64 - pl;
      bits = prefixBits.slice(0, pl) + v4Bits.slice(0, beforeU) + "00000000" + v4Bits.slice(beforeU) + "0".repeat(128 - 72 - (32 - beforeU));
    }
    const hex = BigInt(`0b${bits}`).toString(16).padStart(32, "0");
    const groups = [];
    for (let i = 0; i < 8; i++) {
      groups.push(hex.slice(i * 4, (i + 1) * 4));
    }
    return new Address6(groups.join(":"));
  }
  /**
   * Extract the embedded IPv4 address from a NAT64 IPv6 address using the
   * encoding defined by [RFC 6052](https://datatracker.ietf.org/doc/html/rfc6052).
   * The default prefix is the well-known prefix `64:ff9b::/96`. Returns
   * `null` if this address is not contained within the given prefix.
   * @example
   * new Address6('64:ff9b::c000:221').toAddress4Nat64()!.correctForm(); // '192.0.2.33'
   */
  toAddress4Nat64(prefix = "64:ff9b::/96") {
    const prefix6 = new Address6(prefix);
    const pl = prefix6.subnetMask;
    if (pl !== 32 && pl !== 40 && pl !== 48 && pl !== 56 && pl !== 64 && pl !== 96) {
      throw new address_error_1.AddressError("NAT64 prefix length must be 32, 40, 48, 56, 64, or 96");
    }
    if (!this.isInSubnet(prefix6)) {
      return null;
    }
    const bits = this.binaryZeroPad();
    let v4Bits;
    if (pl === 96) {
      v4Bits = bits.slice(96, 128);
    } else {
      const beforeU = 64 - pl;
      v4Bits = bits.slice(pl, pl + beforeU) + bits.slice(72, 72 + (32 - beforeU));
    }
    const octets = [];
    for (let i = 0; i < 4; i++) {
      octets.push(parseInt(v4Bits.slice(i * 8, (i + 1) * 8), 2).toString());
    }
    return new ipv4_1.Address4(octets.join("."));
  }
  /**
   * Return a byte array.
   *
   * To get a Node.js `Buffer`, wrap the result: `Buffer.from(address.toByteArray())`.
   * @returns {Array}
   */
  toByteArray() {
    const valueWithoutPadding = this.bigInt().toString(16);
    const leadingPad = "0".repeat(valueWithoutPadding.length % 2);
    const value = `${leadingPad}${valueWithoutPadding}`;
    const bytes = [];
    for (let i = 0, length = value.length; i < length; i += 2) {
      bytes.push(parseInt(value.substring(i, i + 2), 16));
    }
    return bytes;
  }
  /**
   * Return an unsigned byte array.
   *
   * To get a Node.js `Buffer`, wrap the result: `Buffer.from(address.toUnsignedByteArray())`.
   * @returns {Array}
   */
  toUnsignedByteArray() {
    return this.toByteArray().map(unsignByte);
  }
  /**
   * Convert a byte array to an Address6 object.
   *
   * To convert from a Node.js `Buffer`, spread it: `Address6.fromByteArray([...buf])`.
   * @returns {Address6}
   */
  static fromByteArray(bytes) {
    return this.fromUnsignedByteArray(bytes.map(unsignByte));
  }
  /**
   * Convert an unsigned byte array to an Address6 object.
   *
   * To convert from a Node.js `Buffer`, spread it: `Address6.fromUnsignedByteArray([...buf])`.
   * @returns {Address6}
   */
  static fromUnsignedByteArray(bytes) {
    const BYTE_MAX = BigInt("256");
    let result = BigInt("0");
    let multiplier = BigInt("1");
    for (let i = bytes.length - 1; i >= 0; i--) {
      result += multiplier * BigInt(bytes[i].toString(10));
      multiplier *= BYTE_MAX;
    }
    return Address6.fromBigInt(result);
  }
  /**
   * Returns true if the address is in the canonical form, false otherwise
   * @returns {boolean}
   */
  isCanonical() {
    return this.addressMinusSuffix === this.canonicalForm();
  }
  /**
   * Returns true if the address is a link local address, false otherwise
   * @returns {boolean}
   */
  isLinkLocal() {
    if (this.getBitsBase2(0, 64) === "1111111010000000000000000000000000000000000000000000000000000000") {
      return true;
    }
    return false;
  }
  /**
   * Returns true if the address is a multicast address, false otherwise
   * @returns {boolean}
   */
  isMulticast() {
    const type2 = this.getType();
    return type2 === "Multicast" || type2.startsWith("Multicast ");
  }
  /**
   * Returns true if the address was written in v4-in-v6 dotted-quad notation
   * (e.g. `::ffff:127.0.0.1`), false otherwise. This is a notation-level flag
   * and does not reflect whether the address bits lie in the IPv4-mapped
   * (`::ffff:0:0/96`) subnet — for that, see {@link isMapped4}.
   * @returns {boolean}
   */
  is4() {
    return this.v4;
  }
  /**
   * Returns true if the address is an IPv4-mapped IPv6 address in
   * `::ffff:0:0/96` ([RFC 4291 §2.5.5.2](https://datatracker.ietf.org/doc/html/rfc4291#section-2.5.5.2)),
   * false otherwise. Unlike {@link is4}, this checks the underlying address
   * bits rather than the textual notation, so `::ffff:127.0.0.1` and
   * `::ffff:7f00:1` both return true.
   * @returns {boolean}
   */
  isMapped4() {
    return this.isInSubnet(IPV4_MAPPED_SUBNET);
  }
  /**
   * Returns true if the address is a Teredo address, false otherwise
   * @returns {boolean}
   */
  isTeredo() {
    return this.isInSubnet(TEREDO_SUBNET);
  }
  /**
   * Returns true if the address is a 6to4 address, false otherwise
   * @returns {boolean}
   */
  is6to4() {
    return this.isInSubnet(SIX_TO_FOUR_SUBNET);
  }
  /**
   * Returns true if the address is a loopback address, false otherwise
   * @returns {boolean}
   */
  isLoopback() {
    return this.getType() === "Loopback";
  }
  /**
   * Returns true if the address is a Unique Local Address in `fc00::/7` ([RFC 4193](https://datatracker.ietf.org/doc/html/rfc4193)). ULAs are the IPv6 equivalent of IPv4 [RFC 1918](https://datatracker.ietf.org/doc/html/rfc1918) private addresses.
   * @returns {boolean}
   */
  isULA() {
    return this.isInSubnet(ULA_SUBNET);
  }
  /**
   * Returns true if the address is the unspecified address `::`.
   * @returns {boolean}
   */
  isUnspecified() {
    return this.getType() === "Unspecified";
  }
  /**
   * Returns true if the address is in the documentation prefix `2001:db8::/32` ([RFC 3849](https://datatracker.ietf.org/doc/html/rfc3849)).
   * @returns {boolean}
   */
  isDocumentation() {
    return this.isInSubnet(DOCUMENTATION_SUBNET);
  }
  // #endregion
  // #region HTML
  /**
   * Returns the address as an HTTP URL with the host bracketed, e.g.
   * `http://[2001:db8::1]/`. If `optionalPort` is provided it is appended,
   * e.g. `http://[2001:db8::1]:8080/`.
   */
  href(optionalPort) {
    if (optionalPort === void 0) {
      optionalPort = "";
    } else {
      optionalPort = `:${optionalPort}`;
    }
    return `http://[${this.correctForm()}]${optionalPort}/`;
  }
  /**
   * Returns an HTML `<a>` element whose `href` encodes the address in a URL
   * hash fragment (default prefix `/#address=`). Useful for linking between
   * pages of an address-inspector UI.
   * @param options.className - CSS class for the rendered `<a>` element
   * @param options.prefix - hash prefix prepended to the address (default `/#address=`)
   * @param options.v4 - when true, render the address in v4-in-v6 form
   */
  link(options) {
    if (!options) {
      options = {};
    }
    if (options.className === void 0) {
      options.className = "";
    }
    if (options.prefix === void 0) {
      options.prefix = "/#address=";
    }
    if (options.v4 === void 0) {
      options.v4 = false;
    }
    let formFunction = this.correctForm;
    if (options.v4) {
      formFunction = this.to4in6;
    }
    const form = formFunction.call(this);
    const safeHref = helpers.escapeHtml(`${options.prefix}${form}`);
    const safeForm = helpers.escapeHtml(form);
    if (options.className) {
      const safeClass = helpers.escapeHtml(options.className);
      return `<a href="${safeHref}" class="${safeClass}">${safeForm}</a>`;
    }
    return `<a href="${safeHref}">${safeForm}</a>`;
  }
  /**
   * Groups an address
   * @returns {String}
   */
  group() {
    if (this.elidedGroups === 0) {
      return helpers.simpleGroup(this.addressMinusSuffix).join(":");
    }
    assert(typeof this.elidedGroups === "number");
    assert(typeof this.elisionBegin === "number");
    const output = [];
    const [left, right] = this.addressMinusSuffix.split("::");
    if (left.length) {
      output.push(...helpers.simpleGroup(left));
    } else {
      output.push("");
    }
    const classes = ["hover-group"];
    for (let i = this.elisionBegin; i < this.elisionBegin + this.elidedGroups; i++) {
      classes.push(`group-${i}`);
    }
    output.push(`<span class="${classes.join(" ")}"></span>`);
    if (right.length) {
      output.push(...helpers.simpleGroup(right, this.elisionEnd));
    } else {
      output.push("");
    }
    if (this.is4()) {
      assert(this.address4 instanceof ipv4_1.Address4);
      output.pop();
      output.push(this.address4.groupForV6());
    }
    return output.join(":");
  }
  // #endregion
  // #region Regular expressions
  /**
   * Generate a regular expression string that can be used to find or validate
   * all variations of this address
   * @param {boolean} substringSearch
   * @returns {string}
   */
  regularExpressionString(substringSearch = false) {
    let output = [];
    const address6 = new Address6(this.correctForm());
    if (address6.elidedGroups === 0) {
      output.push((0, regular_expressions_1.simpleRegularExpression)(address6.parsedAddress));
    } else if (address6.elidedGroups === constants6.GROUPS) {
      output.push((0, regular_expressions_1.possibleElisions)(constants6.GROUPS));
    } else {
      const halves = address6.address.split("::");
      if (halves[0].length) {
        output.push((0, regular_expressions_1.simpleRegularExpression)(halves[0].split(":")));
      }
      assert(typeof address6.elidedGroups === "number");
      output.push((0, regular_expressions_1.possibleElisions)(address6.elidedGroups, halves[0].length !== 0, halves[1].length !== 0));
      if (halves[1].length) {
        output.push((0, regular_expressions_1.simpleRegularExpression)(halves[1].split(":")));
      }
      output = [output.join(":")];
    }
    if (!substringSearch) {
      output = [
        "(?=^|",
        regular_expressions_1.ADDRESS_BOUNDARY,
        "|[^\\w\\:])(",
        ...output,
        ")(?=[^\\w\\:]|",
        regular_expressions_1.ADDRESS_BOUNDARY,
        "|$)"
      ];
    }
    return output.join("");
  }
  /**
   * Generate a regular expression that can be used to find or validate all
   * variations of this address.
   * @param {boolean} substringSearch
   * @returns {RegExp}
   */
  regularExpression(substringSearch = false) {
    return new RegExp(this.regularExpressionString(substringSearch), "i");
  }
}
ipv6.Address6 = Address6;
const TYPE_SUBNETS = Object.keys(constants6.TYPES).map((subnet) => [
  new Address6(subnet),
  constants6.TYPES[subnet]
]);
const TEREDO_SUBNET = new Address6("2001::/32");
const SIX_TO_FOUR_SUBNET = new Address6("2002::/16");
const ULA_SUBNET = new Address6("fc00::/7");
const DOCUMENTATION_SUBNET = new Address6("2001:db8::/32");
const IPV4_MAPPED_SUBNET = new Address6("::ffff:0:0/96");
(function(exports) {
  var __createBinding2 = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  });
  var __setModuleDefault2 = commonjsGlobal && commonjsGlobal.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  } : function(o, v) {
    o["default"] = v;
  });
  var __importStar2 = commonjsGlobal && commonjsGlobal.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding2(result, mod, k);
    }
    __setModuleDefault2(result, mod);
    return result;
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.v6 = exports.AddressError = exports.Address6 = exports.Address4 = void 0;
  var ipv4_12 = ipv4;
  Object.defineProperty(exports, "Address4", { enumerable: true, get: function() {
    return ipv4_12.Address4;
  } });
  var ipv6_1 = ipv6;
  Object.defineProperty(exports, "Address6", { enumerable: true, get: function() {
    return ipv6_1.Address6;
  } });
  var address_error_12 = addressError;
  Object.defineProperty(exports, "AddressError", { enumerable: true, get: function() {
    return address_error_12.AddressError;
  } });
  const helpers2 = __importStar2(helpers$1);
  exports.v6 = { helpers: helpers2 };
})(ipAddress);
Object.defineProperty(helpers$2, "__esModule", { value: true });
helpers$2.ipToBuffer = helpers$2.int32ToIpv4 = helpers$2.ipv4ToInt32 = helpers$2.validateSocksClientChainOptions = helpers$2.validateSocksClientOptions = void 0;
const util_1 = util;
const constants_1 = constants$3;
const stream = stream$1;
const ip_address_1 = ipAddress;
const net = net__default;
function validateSocksClientOptions(options, acceptedCommands = ["connect", "bind", "associate"]) {
  if (!constants_1.SocksCommand[options.command]) {
    throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksCommand, options);
  }
  if (acceptedCommands.indexOf(options.command) === -1) {
    throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksCommandForOperation, options);
  }
  if (!isValidSocksRemoteHost(options.destination)) {
    throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsDestination, options);
  }
  if (!isValidSocksProxy(options.proxy)) {
    throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsProxy, options);
  }
  validateCustomProxyAuth(options.proxy, options);
  if (options.timeout && !isValidTimeoutValue(options.timeout)) {
    throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsTimeout, options);
  }
  if (options.existing_socket && !(options.existing_socket instanceof stream.Duplex)) {
    throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsExistingSocket, options);
  }
}
helpers$2.validateSocksClientOptions = validateSocksClientOptions;
function validateSocksClientChainOptions(options) {
  if (options.command !== "connect") {
    throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksCommandChain, options);
  }
  if (!isValidSocksRemoteHost(options.destination)) {
    throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsDestination, options);
  }
  if (!(options.proxies && Array.isArray(options.proxies) && options.proxies.length >= 2)) {
    throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsProxiesLength, options);
  }
  options.proxies.forEach((proxy) => {
    if (!isValidSocksProxy(proxy)) {
      throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsProxy, options);
    }
    validateCustomProxyAuth(proxy, options);
  });
  if (options.timeout && !isValidTimeoutValue(options.timeout)) {
    throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsTimeout, options);
  }
}
helpers$2.validateSocksClientChainOptions = validateSocksClientChainOptions;
function validateCustomProxyAuth(proxy, options) {
  if (proxy.custom_auth_method !== void 0) {
    if (proxy.custom_auth_method < constants_1.SOCKS5_CUSTOM_AUTH_START || proxy.custom_auth_method > constants_1.SOCKS5_CUSTOM_AUTH_END) {
      throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsCustomAuthRange, options);
    }
    if (proxy.custom_auth_request_handler === void 0 || typeof proxy.custom_auth_request_handler !== "function") {
      throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsCustomAuthOptions, options);
    }
    if (proxy.custom_auth_response_size === void 0) {
      throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsCustomAuthOptions, options);
    }
    if (proxy.custom_auth_response_handler === void 0 || typeof proxy.custom_auth_response_handler !== "function") {
      throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsCustomAuthOptions, options);
    }
  }
}
function isValidSocksRemoteHost(remoteHost) {
  return remoteHost && typeof remoteHost.host === "string" && Buffer.byteLength(remoteHost.host) < 256 && typeof remoteHost.port === "number" && remoteHost.port >= 0 && remoteHost.port <= 65535;
}
function isValidSocksProxy(proxy) {
  return proxy && (typeof proxy.host === "string" || typeof proxy.ipaddress === "string") && typeof proxy.port === "number" && proxy.port >= 0 && proxy.port <= 65535 && (proxy.type === 4 || proxy.type === 5);
}
function isValidTimeoutValue(value) {
  return typeof value === "number" && value > 0;
}
function ipv4ToInt32(ip) {
  const address = new ip_address_1.Address4(ip);
  return address.toArray().reduce((acc, part) => (acc << 8) + part, 0) >>> 0;
}
helpers$2.ipv4ToInt32 = ipv4ToInt32;
function int32ToIpv4(int32) {
  const octet1 = int32 >>> 24 & 255;
  const octet2 = int32 >>> 16 & 255;
  const octet3 = int32 >>> 8 & 255;
  const octet4 = int32 & 255;
  return [octet1, octet2, octet3, octet4].join(".");
}
helpers$2.int32ToIpv4 = int32ToIpv4;
function ipToBuffer(ip) {
  if (net.isIPv4(ip)) {
    const address = new ip_address_1.Address4(ip);
    return Buffer.from(address.toArray());
  } else if (net.isIPv6(ip)) {
    const address = new ip_address_1.Address6(ip);
    return Buffer.from(address.canonicalForm().split(":").map((segment) => segment.padStart(4, "0")).join(""), "hex");
  } else {
    throw new Error("Invalid IP address format");
  }
}
helpers$2.ipToBuffer = ipToBuffer;
var receivebuffer = {};
Object.defineProperty(receivebuffer, "__esModule", { value: true });
receivebuffer.ReceiveBuffer = void 0;
class ReceiveBuffer {
  constructor(size = 4096) {
    this.buffer = Buffer.allocUnsafe(size);
    this.offset = 0;
    this.originalSize = size;
  }
  get length() {
    return this.offset;
  }
  append(data) {
    if (!Buffer.isBuffer(data)) {
      throw new Error("Attempted to append a non-buffer instance to ReceiveBuffer.");
    }
    if (this.offset + data.length >= this.buffer.length) {
      const tmp = this.buffer;
      this.buffer = Buffer.allocUnsafe(Math.max(this.buffer.length + this.originalSize, this.buffer.length + data.length));
      tmp.copy(this.buffer);
    }
    data.copy(this.buffer, this.offset);
    return this.offset += data.length;
  }
  peek(length) {
    if (length > this.offset) {
      throw new Error("Attempted to read beyond the bounds of the managed internal data.");
    }
    return this.buffer.slice(0, length);
  }
  get(length) {
    if (length > this.offset) {
      throw new Error("Attempted to read beyond the bounds of the managed internal data.");
    }
    const value = Buffer.allocUnsafe(length);
    this.buffer.slice(0, length).copy(value);
    this.buffer.copyWithin(0, length, length + this.offset - length);
    this.offset -= length;
    return value;
  }
}
receivebuffer.ReceiveBuffer = ReceiveBuffer;
(function(exports) {
  var __awaiter = commonjsGlobal && commonjsGlobal.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P || (P = Promise))(function(resolve2, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.SocksClientError = exports.SocksClient = void 0;
  const events_1 = require$$0$3;
  const net2 = net__default;
  const smart_buffer_1 = smartbuffer;
  const constants_12 = constants$3;
  const helpers_1 = helpers$2;
  const receivebuffer_1 = receivebuffer;
  const util_12 = util;
  Object.defineProperty(exports, "SocksClientError", { enumerable: true, get: function() {
    return util_12.SocksClientError;
  } });
  const ip_address_12 = ipAddress;
  class SocksClient extends events_1.EventEmitter {
    constructor(options) {
      super();
      this.options = Object.assign({}, options);
      (0, helpers_1.validateSocksClientOptions)(options);
      this.setState(constants_12.SocksClientState.Created);
    }
    /**
     * Creates a new SOCKS connection.
     *
     * Note: Supports callbacks and promises. Only supports the connect command.
     * @param options { SocksClientOptions } Options.
     * @param callback { Function } An optional callback function.
     * @returns { Promise }
     */
    static createConnection(options, callback) {
      return new Promise((resolve2, reject) => {
        try {
          (0, helpers_1.validateSocksClientOptions)(options, ["connect"]);
        } catch (err) {
          if (typeof callback === "function") {
            callback(err);
            return resolve2(err);
          } else {
            return reject(err);
          }
        }
        const client = new SocksClient(options);
        client.connect(options.existing_socket);
        client.once("established", (info) => {
          client.removeAllListeners();
          if (typeof callback === "function") {
            callback(null, info);
            resolve2(info);
          } else {
            resolve2(info);
          }
        });
        client.once("error", (err) => {
          client.removeAllListeners();
          if (typeof callback === "function") {
            callback(err);
            resolve2(err);
          } else {
            reject(err);
          }
        });
      });
    }
    /**
     * Creates a new SOCKS connection chain to a destination host through 2 or more SOCKS proxies.
     *
     * Note: Supports callbacks and promises. Only supports the connect method.
     * Note: Implemented via createConnection() factory function.
     * @param options { SocksClientChainOptions } Options
     * @param callback { Function } An optional callback function.
     * @returns { Promise }
     */
    static createConnectionChain(options, callback) {
      return new Promise((resolve2, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
          (0, helpers_1.validateSocksClientChainOptions)(options);
        } catch (err) {
          if (typeof callback === "function") {
            callback(err);
            return resolve2(err);
          } else {
            return reject(err);
          }
        }
        if (options.randomizeChain) {
          (0, util_12.shuffleArray)(options.proxies);
        }
        try {
          let sock;
          for (let i = 0; i < options.proxies.length; i++) {
            const nextProxy = options.proxies[i];
            const nextDestination = i === options.proxies.length - 1 ? options.destination : {
              host: options.proxies[i + 1].host || options.proxies[i + 1].ipaddress,
              port: options.proxies[i + 1].port
            };
            const result = yield SocksClient.createConnection({
              command: "connect",
              proxy: nextProxy,
              destination: nextDestination,
              existing_socket: sock
            });
            sock = sock || result.socket;
          }
          if (typeof callback === "function") {
            callback(null, { socket: sock });
            resolve2({ socket: sock });
          } else {
            resolve2({ socket: sock });
          }
        } catch (err) {
          if (typeof callback === "function") {
            callback(err);
            resolve2(err);
          } else {
            reject(err);
          }
        }
      }));
    }
    /**
     * Creates a SOCKS UDP Frame.
     * @param options
     */
    static createUDPFrame(options) {
      const buff = new smart_buffer_1.SmartBuffer();
      buff.writeUInt16BE(0);
      buff.writeUInt8(options.frameNumber || 0);
      if (net2.isIPv4(options.remoteHost.host)) {
        buff.writeUInt8(constants_12.Socks5HostType.IPv4);
        buff.writeUInt32BE((0, helpers_1.ipv4ToInt32)(options.remoteHost.host));
      } else if (net2.isIPv6(options.remoteHost.host)) {
        buff.writeUInt8(constants_12.Socks5HostType.IPv6);
        buff.writeBuffer((0, helpers_1.ipToBuffer)(options.remoteHost.host));
      } else {
        buff.writeUInt8(constants_12.Socks5HostType.Hostname);
        buff.writeUInt8(Buffer.byteLength(options.remoteHost.host));
        buff.writeString(options.remoteHost.host);
      }
      buff.writeUInt16BE(options.remoteHost.port);
      buff.writeBuffer(options.data);
      return buff.toBuffer();
    }
    /**
     * Parses a SOCKS UDP frame.
     * @param data
     */
    static parseUDPFrame(data) {
      const buff = smart_buffer_1.SmartBuffer.fromBuffer(data);
      buff.readOffset = 2;
      const frameNumber = buff.readUInt8();
      const hostType = buff.readUInt8();
      let remoteHost;
      if (hostType === constants_12.Socks5HostType.IPv4) {
        remoteHost = (0, helpers_1.int32ToIpv4)(buff.readUInt32BE());
      } else if (hostType === constants_12.Socks5HostType.IPv6) {
        remoteHost = ip_address_12.Address6.fromByteArray(Array.from(buff.readBuffer(16))).canonicalForm();
      } else {
        remoteHost = buff.readString(buff.readUInt8());
      }
      const remotePort = buff.readUInt16BE();
      return {
        frameNumber,
        remoteHost: {
          host: remoteHost,
          port: remotePort
        },
        data: buff.readBuffer()
      };
    }
    /**
     * Internal state setter. If the SocksClient is in an error state, it cannot be changed to a non error state.
     */
    setState(newState) {
      if (this.state !== constants_12.SocksClientState.Error) {
        this.state = newState;
      }
    }
    /**
     * Starts the connection establishment to the proxy and destination.
     * @param existingSocket Connected socket to use instead of creating a new one (internal use).
     */
    connect(existingSocket) {
      this.onDataReceived = (data) => this.onDataReceivedHandler(data);
      this.onClose = () => this.onCloseHandler();
      this.onError = (err) => this.onErrorHandler(err);
      this.onConnect = () => this.onConnectHandler();
      const timer = setTimeout(() => this.onEstablishedTimeout(), this.options.timeout || constants_12.DEFAULT_TIMEOUT);
      if (timer.unref && typeof timer.unref === "function") {
        timer.unref();
      }
      if (existingSocket) {
        this.socket = existingSocket;
      } else {
        this.socket = new net2.Socket();
      }
      this.socket.once("close", this.onClose);
      this.socket.once("error", this.onError);
      this.socket.once("connect", this.onConnect);
      this.socket.on("data", this.onDataReceived);
      this.setState(constants_12.SocksClientState.Connecting);
      this.receiveBuffer = new receivebuffer_1.ReceiveBuffer();
      if (existingSocket) {
        this.socket.emit("connect");
      } else {
        this.socket.connect(this.getSocketOptions());
        if (this.options.set_tcp_nodelay !== void 0 && this.options.set_tcp_nodelay !== null) {
          this.socket.setNoDelay(!!this.options.set_tcp_nodelay);
        }
      }
      this.prependOnceListener("established", (info) => {
        setImmediate(() => {
          if (this.receiveBuffer.length > 0) {
            const excessData = this.receiveBuffer.get(this.receiveBuffer.length);
            info.socket.emit("data", excessData);
          }
          info.socket.resume();
        });
      });
    }
    // Socket options (defaults host/port to options.proxy.host/options.proxy.port)
    getSocketOptions() {
      return Object.assign(Object.assign({}, this.options.socket_options), { host: this.options.proxy.host || this.options.proxy.ipaddress, port: this.options.proxy.port });
    }
    /**
     * Handles internal Socks timeout callback.
     * Note: If the Socks client is not BoundWaitingForConnection or Established, the connection will be closed.
     */
    onEstablishedTimeout() {
      if (this.state !== constants_12.SocksClientState.Established && this.state !== constants_12.SocksClientState.BoundWaitingForConnection) {
        this.closeSocket(constants_12.ERRORS.ProxyConnectionTimedOut);
      }
    }
    /**
     * Handles Socket connect event.
     */
    onConnectHandler() {
      this.setState(constants_12.SocksClientState.Connected);
      if (this.options.proxy.type === 4) {
        this.sendSocks4InitialHandshake();
      } else {
        this.sendSocks5InitialHandshake();
      }
      this.setState(constants_12.SocksClientState.SentInitialHandshake);
    }
    /**
     * Handles Socket data event.
     * @param data
     */
    onDataReceivedHandler(data) {
      this.receiveBuffer.append(data);
      this.processData();
    }
    /**
     * Handles processing of the data we have received.
     */
    processData() {
      while (this.state !== constants_12.SocksClientState.Established && this.state !== constants_12.SocksClientState.Error && this.receiveBuffer.length >= this.nextRequiredPacketBufferSize) {
        if (this.state === constants_12.SocksClientState.SentInitialHandshake) {
          if (this.options.proxy.type === 4) {
            this.handleSocks4FinalHandshakeResponse();
          } else {
            this.handleInitialSocks5HandshakeResponse();
          }
        } else if (this.state === constants_12.SocksClientState.SentAuthentication) {
          this.handleInitialSocks5AuthenticationHandshakeResponse();
        } else if (this.state === constants_12.SocksClientState.SentFinalHandshake) {
          this.handleSocks5FinalHandshakeResponse();
        } else if (this.state === constants_12.SocksClientState.BoundWaitingForConnection) {
          if (this.options.proxy.type === 4) {
            this.handleSocks4IncomingConnectionResponse();
          } else {
            this.handleSocks5IncomingConnectionResponse();
          }
        } else {
          this.closeSocket(constants_12.ERRORS.InternalError);
          break;
        }
      }
    }
    /**
     * Handles Socket close event.
     * @param had_error
     */
    onCloseHandler() {
      this.closeSocket(constants_12.ERRORS.SocketClosed);
    }
    /**
     * Handles Socket error event.
     * @param err
     */
    onErrorHandler(err) {
      this.closeSocket(err.message);
    }
    /**
     * Removes internal event listeners on the underlying Socket.
     */
    removeInternalSocketHandlers() {
      this.socket.pause();
      this.socket.removeListener("data", this.onDataReceived);
      this.socket.removeListener("close", this.onClose);
      this.socket.removeListener("error", this.onError);
      this.socket.removeListener("connect", this.onConnect);
    }
    /**
     * Closes and destroys the underlying Socket. Emits an error event.
     * @param err { String } An error string to include in error event.
     */
    closeSocket(err) {
      if (this.state !== constants_12.SocksClientState.Error) {
        this.setState(constants_12.SocksClientState.Error);
        this.socket.destroy();
        this.removeInternalSocketHandlers();
        this.emit("error", new util_12.SocksClientError(err, this.options));
      }
    }
    /**
     * Sends initial Socks v4 handshake request.
     */
    sendSocks4InitialHandshake() {
      const userId = this.options.proxy.userId || "";
      const buff = new smart_buffer_1.SmartBuffer();
      buff.writeUInt8(4);
      buff.writeUInt8(constants_12.SocksCommand[this.options.command]);
      buff.writeUInt16BE(this.options.destination.port);
      if (net2.isIPv4(this.options.destination.host)) {
        buff.writeBuffer((0, helpers_1.ipToBuffer)(this.options.destination.host));
        buff.writeStringNT(userId);
      } else {
        buff.writeUInt8(0);
        buff.writeUInt8(0);
        buff.writeUInt8(0);
        buff.writeUInt8(1);
        buff.writeStringNT(userId);
        buff.writeStringNT(this.options.destination.host);
      }
      this.nextRequiredPacketBufferSize = constants_12.SOCKS_INCOMING_PACKET_SIZES.Socks4Response;
      this.socket.write(buff.toBuffer());
    }
    /**
     * Handles Socks v4 handshake response.
     * @param data
     */
    handleSocks4FinalHandshakeResponse() {
      const data = this.receiveBuffer.get(8);
      if (data[1] !== constants_12.Socks4Response.Granted) {
        this.closeSocket(`${constants_12.ERRORS.Socks4ProxyRejectedConnection} - (${constants_12.Socks4Response[data[1]]})`);
      } else {
        if (constants_12.SocksCommand[this.options.command] === constants_12.SocksCommand.bind) {
          const buff = smart_buffer_1.SmartBuffer.fromBuffer(data);
          buff.readOffset = 2;
          const remoteHost = {
            port: buff.readUInt16BE(),
            host: (0, helpers_1.int32ToIpv4)(buff.readUInt32BE())
          };
          if (remoteHost.host === "0.0.0.0") {
            remoteHost.host = this.options.proxy.ipaddress;
          }
          this.setState(constants_12.SocksClientState.BoundWaitingForConnection);
          this.emit("bound", { remoteHost, socket: this.socket });
        } else {
          this.setState(constants_12.SocksClientState.Established);
          this.removeInternalSocketHandlers();
          this.emit("established", { socket: this.socket });
        }
      }
    }
    /**
     * Handles Socks v4 incoming connection request (BIND)
     * @param data
     */
    handleSocks4IncomingConnectionResponse() {
      const data = this.receiveBuffer.get(8);
      if (data[1] !== constants_12.Socks4Response.Granted) {
        this.closeSocket(`${constants_12.ERRORS.Socks4ProxyRejectedIncomingBoundConnection} - (${constants_12.Socks4Response[data[1]]})`);
      } else {
        const buff = smart_buffer_1.SmartBuffer.fromBuffer(data);
        buff.readOffset = 2;
        const remoteHost = {
          port: buff.readUInt16BE(),
          host: (0, helpers_1.int32ToIpv4)(buff.readUInt32BE())
        };
        this.setState(constants_12.SocksClientState.Established);
        this.removeInternalSocketHandlers();
        this.emit("established", { remoteHost, socket: this.socket });
      }
    }
    /**
     * Sends initial Socks v5 handshake request.
     */
    sendSocks5InitialHandshake() {
      const buff = new smart_buffer_1.SmartBuffer();
      const supportedAuthMethods = [constants_12.Socks5Auth.NoAuth];
      if (this.options.proxy.userId || this.options.proxy.password) {
        supportedAuthMethods.push(constants_12.Socks5Auth.UserPass);
      }
      if (this.options.proxy.custom_auth_method !== void 0) {
        supportedAuthMethods.push(this.options.proxy.custom_auth_method);
      }
      buff.writeUInt8(5);
      buff.writeUInt8(supportedAuthMethods.length);
      for (const authMethod of supportedAuthMethods) {
        buff.writeUInt8(authMethod);
      }
      this.nextRequiredPacketBufferSize = constants_12.SOCKS_INCOMING_PACKET_SIZES.Socks5InitialHandshakeResponse;
      this.socket.write(buff.toBuffer());
      this.setState(constants_12.SocksClientState.SentInitialHandshake);
    }
    /**
     * Handles initial Socks v5 handshake response.
     * @param data
     */
    handleInitialSocks5HandshakeResponse() {
      const data = this.receiveBuffer.get(2);
      if (data[0] !== 5) {
        this.closeSocket(constants_12.ERRORS.InvalidSocks5IntiailHandshakeSocksVersion);
      } else if (data[1] === constants_12.SOCKS5_NO_ACCEPTABLE_AUTH) {
        this.closeSocket(constants_12.ERRORS.InvalidSocks5InitialHandshakeNoAcceptedAuthType);
      } else {
        if (data[1] === constants_12.Socks5Auth.NoAuth) {
          this.socks5ChosenAuthType = constants_12.Socks5Auth.NoAuth;
          this.sendSocks5CommandRequest();
        } else if (data[1] === constants_12.Socks5Auth.UserPass) {
          this.socks5ChosenAuthType = constants_12.Socks5Auth.UserPass;
          this.sendSocks5UserPassAuthentication();
        } else if (data[1] === this.options.proxy.custom_auth_method) {
          this.socks5ChosenAuthType = this.options.proxy.custom_auth_method;
          this.sendSocks5CustomAuthentication();
        } else {
          this.closeSocket(constants_12.ERRORS.InvalidSocks5InitialHandshakeUnknownAuthType);
        }
      }
    }
    /**
     * Sends Socks v5 user & password auth handshake.
     *
     * Note: No auth and user/pass are currently supported.
     */
    sendSocks5UserPassAuthentication() {
      const userId = this.options.proxy.userId || "";
      const password = this.options.proxy.password || "";
      const buff = new smart_buffer_1.SmartBuffer();
      buff.writeUInt8(1);
      buff.writeUInt8(Buffer.byteLength(userId));
      buff.writeString(userId);
      buff.writeUInt8(Buffer.byteLength(password));
      buff.writeString(password);
      this.nextRequiredPacketBufferSize = constants_12.SOCKS_INCOMING_PACKET_SIZES.Socks5UserPassAuthenticationResponse;
      this.socket.write(buff.toBuffer());
      this.setState(constants_12.SocksClientState.SentAuthentication);
    }
    sendSocks5CustomAuthentication() {
      return __awaiter(this, void 0, void 0, function* () {
        this.nextRequiredPacketBufferSize = this.options.proxy.custom_auth_response_size;
        this.socket.write(yield this.options.proxy.custom_auth_request_handler());
        this.setState(constants_12.SocksClientState.SentAuthentication);
      });
    }
    handleSocks5CustomAuthHandshakeResponse(data) {
      return __awaiter(this, void 0, void 0, function* () {
        return yield this.options.proxy.custom_auth_response_handler(data);
      });
    }
    handleSocks5AuthenticationNoAuthHandshakeResponse(data) {
      return __awaiter(this, void 0, void 0, function* () {
        return data[1] === 0;
      });
    }
    handleSocks5AuthenticationUserPassHandshakeResponse(data) {
      return __awaiter(this, void 0, void 0, function* () {
        return data[1] === 0;
      });
    }
    /**
     * Handles Socks v5 auth handshake response.
     * @param data
     */
    handleInitialSocks5AuthenticationHandshakeResponse() {
      return __awaiter(this, void 0, void 0, function* () {
        this.setState(constants_12.SocksClientState.ReceivedAuthenticationResponse);
        let authResult = false;
        if (this.socks5ChosenAuthType === constants_12.Socks5Auth.NoAuth) {
          authResult = yield this.handleSocks5AuthenticationNoAuthHandshakeResponse(this.receiveBuffer.get(2));
        } else if (this.socks5ChosenAuthType === constants_12.Socks5Auth.UserPass) {
          authResult = yield this.handleSocks5AuthenticationUserPassHandshakeResponse(this.receiveBuffer.get(2));
        } else if (this.socks5ChosenAuthType === this.options.proxy.custom_auth_method) {
          authResult = yield this.handleSocks5CustomAuthHandshakeResponse(this.receiveBuffer.get(this.options.proxy.custom_auth_response_size));
        }
        if (!authResult) {
          this.closeSocket(constants_12.ERRORS.Socks5AuthenticationFailed);
        } else {
          this.sendSocks5CommandRequest();
        }
      });
    }
    /**
     * Sends Socks v5 final handshake request.
     */
    sendSocks5CommandRequest() {
      const buff = new smart_buffer_1.SmartBuffer();
      buff.writeUInt8(5);
      buff.writeUInt8(constants_12.SocksCommand[this.options.command]);
      buff.writeUInt8(0);
      if (net2.isIPv4(this.options.destination.host)) {
        buff.writeUInt8(constants_12.Socks5HostType.IPv4);
        buff.writeBuffer((0, helpers_1.ipToBuffer)(this.options.destination.host));
      } else if (net2.isIPv6(this.options.destination.host)) {
        buff.writeUInt8(constants_12.Socks5HostType.IPv6);
        buff.writeBuffer((0, helpers_1.ipToBuffer)(this.options.destination.host));
      } else {
        buff.writeUInt8(constants_12.Socks5HostType.Hostname);
        buff.writeUInt8(this.options.destination.host.length);
        buff.writeString(this.options.destination.host);
      }
      buff.writeUInt16BE(this.options.destination.port);
      this.nextRequiredPacketBufferSize = constants_12.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseHeader;
      this.socket.write(buff.toBuffer());
      this.setState(constants_12.SocksClientState.SentFinalHandshake);
    }
    /**
     * Handles Socks v5 final handshake response.
     * @param data
     */
    handleSocks5FinalHandshakeResponse() {
      const header = this.receiveBuffer.peek(5);
      if (header[0] !== 5 || header[1] !== constants_12.Socks5Response.Granted) {
        this.closeSocket(`${constants_12.ERRORS.InvalidSocks5FinalHandshakeRejected} - ${constants_12.Socks5Response[header[1]]}`);
      } else {
        const addressType = header[3];
        let remoteHost;
        let buff;
        if (addressType === constants_12.Socks5HostType.IPv4) {
          const dataNeeded = constants_12.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseIPv4;
          if (this.receiveBuffer.length < dataNeeded) {
            this.nextRequiredPacketBufferSize = dataNeeded;
            return;
          }
          buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(4));
          remoteHost = {
            host: (0, helpers_1.int32ToIpv4)(buff.readUInt32BE()),
            port: buff.readUInt16BE()
          };
          if (remoteHost.host === "0.0.0.0") {
            remoteHost.host = this.options.proxy.ipaddress;
          }
        } else if (addressType === constants_12.Socks5HostType.Hostname) {
          const hostLength = header[4];
          const dataNeeded = constants_12.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseHostname(hostLength);
          if (this.receiveBuffer.length < dataNeeded) {
            this.nextRequiredPacketBufferSize = dataNeeded;
            return;
          }
          buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(5));
          remoteHost = {
            host: buff.readString(hostLength),
            port: buff.readUInt16BE()
          };
        } else if (addressType === constants_12.Socks5HostType.IPv6) {
          const dataNeeded = constants_12.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseIPv6;
          if (this.receiveBuffer.length < dataNeeded) {
            this.nextRequiredPacketBufferSize = dataNeeded;
            return;
          }
          buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(4));
          remoteHost = {
            host: ip_address_12.Address6.fromByteArray(Array.from(buff.readBuffer(16))).canonicalForm(),
            port: buff.readUInt16BE()
          };
        }
        this.setState(constants_12.SocksClientState.ReceivedFinalResponse);
        if (constants_12.SocksCommand[this.options.command] === constants_12.SocksCommand.connect) {
          this.setState(constants_12.SocksClientState.Established);
          this.removeInternalSocketHandlers();
          this.emit("established", { remoteHost, socket: this.socket });
        } else if (constants_12.SocksCommand[this.options.command] === constants_12.SocksCommand.bind) {
          this.setState(constants_12.SocksClientState.BoundWaitingForConnection);
          this.nextRequiredPacketBufferSize = constants_12.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseHeader;
          this.emit("bound", { remoteHost, socket: this.socket });
        } else if (constants_12.SocksCommand[this.options.command] === constants_12.SocksCommand.associate) {
          this.setState(constants_12.SocksClientState.Established);
          this.removeInternalSocketHandlers();
          this.emit("established", {
            remoteHost,
            socket: this.socket
          });
        }
      }
    }
    /**
     * Handles Socks v5 incoming connection request (BIND).
     */
    handleSocks5IncomingConnectionResponse() {
      const header = this.receiveBuffer.peek(5);
      if (header[0] !== 5 || header[1] !== constants_12.Socks5Response.Granted) {
        this.closeSocket(`${constants_12.ERRORS.Socks5ProxyRejectedIncomingBoundConnection} - ${constants_12.Socks5Response[header[1]]}`);
      } else {
        const addressType = header[3];
        let remoteHost;
        let buff;
        if (addressType === constants_12.Socks5HostType.IPv4) {
          const dataNeeded = constants_12.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseIPv4;
          if (this.receiveBuffer.length < dataNeeded) {
            this.nextRequiredPacketBufferSize = dataNeeded;
            return;
          }
          buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(4));
          remoteHost = {
            host: (0, helpers_1.int32ToIpv4)(buff.readUInt32BE()),
            port: buff.readUInt16BE()
          };
          if (remoteHost.host === "0.0.0.0") {
            remoteHost.host = this.options.proxy.ipaddress;
          }
        } else if (addressType === constants_12.Socks5HostType.Hostname) {
          const hostLength = header[4];
          const dataNeeded = constants_12.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseHostname(hostLength);
          if (this.receiveBuffer.length < dataNeeded) {
            this.nextRequiredPacketBufferSize = dataNeeded;
            return;
          }
          buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(5));
          remoteHost = {
            host: buff.readString(hostLength),
            port: buff.readUInt16BE()
          };
        } else if (addressType === constants_12.Socks5HostType.IPv6) {
          const dataNeeded = constants_12.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseIPv6;
          if (this.receiveBuffer.length < dataNeeded) {
            this.nextRequiredPacketBufferSize = dataNeeded;
            return;
          }
          buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(4));
          remoteHost = {
            host: ip_address_12.Address6.fromByteArray(Array.from(buff.readBuffer(16))).canonicalForm(),
            port: buff.readUInt16BE()
          };
        }
        this.setState(constants_12.SocksClientState.Established);
        this.removeInternalSocketHandlers();
        this.emit("established", { remoteHost, socket: this.socket });
      }
    }
    get socksClientOptions() {
      return Object.assign({}, this.options);
    }
  }
  exports.SocksClient = SocksClient;
})(socksclient);
(function(exports) {
  var __createBinding2 = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  });
  var __exportStar = commonjsGlobal && commonjsGlobal.__exportStar || function(m, exports2) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding2(exports2, m, p);
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  __exportStar(socksclient, exports);
})(build);
const INTERNAL$1 = Symbol("AgentBaseInternalState");
let Agent$1 = class Agent extends http$2.Agent {
  constructor(opts) {
    super(opts);
    this[INTERNAL$1] = {};
  }
  /**
   * Determine whether this is an `http` or `https` request.
   */
  isSecureEndpoint(options) {
    if (options) {
      if (typeof options.secureEndpoint === "boolean") {
        return options.secureEndpoint;
      }
      if (typeof options.protocol === "string") {
        return options.protocol === "https:";
      }
    }
    const { stack } = new Error();
    if (typeof stack !== "string")
      return false;
    return stack.split("\n").some((l) => l.indexOf("(https.js:") !== -1 || l.indexOf("node:https:") !== -1);
  }
  // In order to support async signatures in `connect()` and Node's native
  // connection pooling in `http.Agent`, the array of sockets for each origin
  // has to be updated synchronously. This is so the length of the array is
  // accurate when `addRequest()` is next called. We achieve this by creating a
  // fake socket and adding it to `sockets[origin]` and incrementing
  // `totalSocketCount`.
  incrementSockets(name) {
    if (this.maxSockets === Infinity && this.maxTotalSockets === Infinity) {
      return null;
    }
    if (!this.sockets[name]) {
      this.sockets[name] = [];
    }
    const fakeSocket = new net$1.Socket({ writable: false });
    this.sockets[name].push(fakeSocket);
    this.totalSocketCount++;
    return fakeSocket;
  }
  decrementSockets(name, socket) {
    if (!this.sockets[name] || socket === null) {
      return;
    }
    const sockets = this.sockets[name];
    const index = sockets.indexOf(socket);
    if (index !== -1) {
      sockets.splice(index, 1);
      this.totalSocketCount--;
      if (sockets.length === 0) {
        delete this.sockets[name];
      }
    }
  }
  // In order to properly update the socket pool, we need to call `getName()` on
  // the core `https.Agent` if it is a secureEndpoint.
  getName(options) {
    const secureEndpoint = this.isSecureEndpoint(options);
    if (secureEndpoint) {
      return Agent$2.prototype.getName.call(this, options);
    }
    return super.getName(options);
  }
  createSocket(req, options, cb) {
    const connectOpts = {
      ...options,
      secureEndpoint: this.isSecureEndpoint(options)
    };
    const name = this.getName(connectOpts);
    const fakeSocket = this.incrementSockets(name);
    Promise.resolve().then(() => this.connect(req, connectOpts)).then((socket) => {
      this.decrementSockets(name, fakeSocket);
      if (typeof socket.addRequest === "function") {
        try {
          return socket.addRequest(req, connectOpts);
        } catch (err) {
          return cb(err);
        }
      }
      this[INTERNAL$1].currentSocket = socket;
      super.createSocket(req, options, cb);
    }, (err) => {
      this.decrementSockets(name, fakeSocket);
      cb(err);
    });
  }
  createConnection() {
    const socket = this[INTERNAL$1].currentSocket;
    this[INTERNAL$1].currentSocket = void 0;
    if (!socket) {
      throw new Error("No socket was returned in the `connect()` function");
    }
    return socket;
  }
  get defaultPort() {
    return this[INTERNAL$1].defaultPort ?? (this.protocol === "https:" ? 443 : 80);
  }
  set defaultPort(v) {
    if (this[INTERNAL$1]) {
      this[INTERNAL$1].defaultPort = v;
    }
  }
  get protocol() {
    return this[INTERNAL$1].protocol ?? (this.isSecureEndpoint() ? "https:" : "http:");
  }
  set protocol(v) {
    if (this[INTERNAL$1]) {
      this[INTERNAL$1].protocol = v;
    }
  }
};
const debug$2 = createDebug("socks-proxy-agent");
const setServernameFromNonIpHost$1 = (options) => {
  if (options.servername === void 0 && options.host && !net$1.isIP(options.host)) {
    return {
      ...options,
      servername: options.host
    };
  }
  return options;
};
function parseSocksURL(url2) {
  let lookup = false;
  let type2 = 5;
  const host = url2.hostname;
  const port = parseInt(url2.port, 10) || 1080;
  switch (url2.protocol.replace(":", "")) {
    case "socks4":
      lookup = true;
      type2 = 4;
      break;
    case "socks4a":
      type2 = 4;
      break;
    case "socks5":
      lookup = true;
      type2 = 5;
      break;
    case "socks":
      type2 = 5;
      break;
    case "socks5h":
      type2 = 5;
      break;
    default:
      throw new TypeError(`A "socks" protocol must be specified! Got: ${String(url2.protocol)}`);
  }
  const proxy = {
    host,
    port,
    type: type2
  };
  if (url2.username) {
    Object.defineProperty(proxy, "userId", {
      value: decodeURIComponent(url2.username),
      enumerable: false
    });
  }
  if (url2.password != null) {
    Object.defineProperty(proxy, "password", {
      value: decodeURIComponent(url2.password),
      enumerable: false
    });
  }
  return { lookup, proxy };
}
class SocksProxyAgent extends Agent$1 {
  constructor(uri2, opts) {
    super(opts);
    const url2 = typeof uri2 === "string" ? new URL$2(uri2) : uri2;
    const { proxy, lookup } = parseSocksURL(url2);
    this.shouldLookup = lookup;
    this.proxy = proxy;
    this.timeout = (opts == null ? void 0 : opts.timeout) ?? null;
    this.socketOptions = (opts == null ? void 0 : opts.socketOptions) ?? null;
  }
  /**
   * Initiates a SOCKS connection to the specified SOCKS proxy server,
   * which in turn connects to the specified remote host and port.
   */
  async connect(req, opts) {
    const { shouldLookup, proxy, timeout } = this;
    if (!opts.host) {
      throw new Error("No `host` defined!");
    }
    let { host } = opts;
    const { port, lookup: lookupFn = dns.lookup } = opts;
    if (shouldLookup) {
      host = await new Promise((resolve2, reject) => {
        lookupFn(host, {}, (err, address) => {
          if (err) {
            reject(err);
          } else {
            resolve2(typeof address === "string" ? address : address[0].address);
          }
        });
      });
    }
    const socksOpts = {
      proxy,
      destination: {
        host,
        port: typeof port === "number" ? port : parseInt(port, 10)
      },
      command: "connect",
      timeout: timeout ?? void 0,
      // @ts-expect-error the type supplied by socks for socket_options is wider
      // than necessary since socks will always override the host and port
      socket_options: this.socketOptions ?? void 0
    };
    const cleanup = (tlsSocket) => {
      req.destroy();
      socket.destroy();
      if (tlsSocket)
        tlsSocket.destroy();
    };
    debug$2("Creating socks proxy connection: %o", socksOpts);
    const { socket } = await build.SocksClient.createConnection(socksOpts);
    debug$2("Successfully created socks proxy connection");
    if (timeout !== null) {
      socket.setTimeout(timeout);
      socket.on("timeout", () => cleanup());
    }
    if (opts.secureEndpoint) {
      debug$2("Upgrading socket connection to TLS");
      const tlsSocket = tls.connect({
        ...omit$1(setServernameFromNonIpHost$1(opts), "host", "path", "port"),
        socket
      });
      tlsSocket.once("error", (error) => {
        debug$2("Socket TLS error", error.message);
        cleanup(tlsSocket);
      });
      return tlsSocket;
    }
    return socket;
  }
}
SocksProxyAgent.protocols = [
  "socks",
  "socks4",
  "socks4a",
  "socks5",
  "socks5h"
];
function omit$1(obj, ...keys) {
  const ret = {};
  let key;
  for (key in obj) {
    if (!keys.includes(key)) {
      ret[key] = obj[key];
    }
  }
  return ret;
}
const INTERNAL = Symbol("AgentBaseInternalState");
class Agent2 extends http$2.Agent {
  constructor(opts) {
    super(opts);
    this[INTERNAL] = {};
  }
  /**
   * Determine whether this is an `http` or `https` request.
   */
  isSecureEndpoint(options) {
    if (options) {
      if (typeof options.secureEndpoint === "boolean") {
        return options.secureEndpoint;
      }
      if (typeof options.protocol === "string") {
        return options.protocol === "https:";
      }
    }
    const { stack } = new Error();
    if (typeof stack !== "string")
      return false;
    return stack.split("\n").some((l) => l.indexOf("(https.js:") !== -1 || l.indexOf("node:https:") !== -1);
  }
  // In order to support async signatures in `connect()` and Node's native
  // connection pooling in `http.Agent`, the array of sockets for each origin
  // has to be updated synchronously. This is so the length of the array is
  // accurate when `addRequest()` is next called. We achieve this by creating a
  // fake socket and adding it to `sockets[origin]` and incrementing
  // `totalSocketCount`.
  incrementSockets(name) {
    if (this.maxSockets === Infinity && this.maxTotalSockets === Infinity) {
      return null;
    }
    if (!this.sockets[name]) {
      this.sockets[name] = [];
    }
    const fakeSocket = new net$1.Socket({ writable: false });
    this.sockets[name].push(fakeSocket);
    this.totalSocketCount++;
    return fakeSocket;
  }
  decrementSockets(name, socket) {
    if (!this.sockets[name] || socket === null) {
      return;
    }
    const sockets = this.sockets[name];
    const index = sockets.indexOf(socket);
    if (index !== -1) {
      sockets.splice(index, 1);
      this.totalSocketCount--;
      if (sockets.length === 0) {
        delete this.sockets[name];
      }
    }
  }
  // In order to properly update the socket pool, we need to call `getName()` on
  // the core `https.Agent` if it is a secureEndpoint.
  getName(options) {
    const secureEndpoint = this.isSecureEndpoint(options);
    if (secureEndpoint) {
      return Agent$2.prototype.getName.call(this, options);
    }
    return super.getName(options);
  }
  createSocket(req, options, cb) {
    const connectOpts = {
      ...options,
      secureEndpoint: this.isSecureEndpoint(options)
    };
    const name = this.getName(connectOpts);
    const fakeSocket = this.incrementSockets(name);
    Promise.resolve().then(() => this.connect(req, connectOpts)).then((socket) => {
      this.decrementSockets(name, fakeSocket);
      if (typeof socket.addRequest === "function") {
        try {
          return socket.addRequest(req, connectOpts);
        } catch (err) {
          return cb(err);
        }
      }
      this[INTERNAL].currentSocket = socket;
      super.createSocket(req, options, cb);
    }, (err) => {
      this.decrementSockets(name, fakeSocket);
      cb(err);
    });
  }
  createConnection() {
    const socket = this[INTERNAL].currentSocket;
    this[INTERNAL].currentSocket = void 0;
    if (!socket) {
      throw new Error("No socket was returned in the `connect()` function");
    }
    return socket;
  }
  get defaultPort() {
    return this[INTERNAL].defaultPort ?? (this.protocol === "https:" ? 443 : 80);
  }
  set defaultPort(v) {
    if (this[INTERNAL]) {
      this[INTERNAL].defaultPort = v;
    }
  }
  get protocol() {
    return this[INTERNAL].protocol ?? (this.isSecureEndpoint() ? "https:" : "http:");
  }
  set protocol(v) {
    if (this[INTERNAL]) {
      this[INTERNAL].protocol = v;
    }
  }
}
const debug$1 = createDebug("https-proxy-agent:parse-proxy-response");
function parseProxyResponse(socket) {
  return new Promise((resolve2, reject) => {
    let buffersLength = 0;
    const buffers = [];
    function read() {
      const b = socket.read();
      if (b)
        ondata(b);
      else
        socket.once("readable", read);
    }
    function cleanup() {
      socket.removeListener("end", onend);
      socket.removeListener("error", onerror);
      socket.removeListener("readable", read);
    }
    function onend() {
      cleanup();
      debug$1("onend");
      reject(new Error("Proxy connection ended before receiving CONNECT response"));
    }
    function onerror(err) {
      cleanup();
      debug$1("onerror %o", err);
      reject(err);
    }
    function ondata(b) {
      buffers.push(b);
      buffersLength += b.length;
      const buffered = Buffer.concat(buffers, buffersLength);
      const endOfHeaders = buffered.indexOf("\r\n\r\n");
      if (endOfHeaders === -1) {
        debug$1("have not received end of HTTP headers yet...");
        read();
        return;
      }
      const headerParts = buffered.slice(0, endOfHeaders).toString("ascii").split("\r\n");
      const firstLine = headerParts.shift();
      if (!firstLine) {
        socket.destroy();
        return reject(new Error("No header received from proxy CONNECT response"));
      }
      const firstLineParts = firstLine.split(" ");
      const statusCode = +firstLineParts[1];
      const statusText = firstLineParts.slice(2).join(" ");
      const headers = {};
      for (const header of headerParts) {
        if (!header)
          continue;
        const firstColon = header.indexOf(":");
        if (firstColon === -1) {
          socket.destroy();
          return reject(new Error(`Invalid header from proxy CONNECT response: "${header}"`));
        }
        const key = header.slice(0, firstColon).toLowerCase();
        const value = header.slice(firstColon + 1).trimStart();
        const current = headers[key];
        if (typeof current === "string") {
          headers[key] = [current, value];
        } else if (Array.isArray(current)) {
          current.push(value);
        } else {
          headers[key] = value;
        }
      }
      debug$1("got proxy server response: %o %o", firstLine, headers);
      cleanup();
      resolve2({
        connect: {
          statusCode,
          statusText,
          headers
        },
        buffered
      });
    }
    socket.on("error", onerror);
    socket.on("end", onend);
    read();
  });
}
const debug = createDebug("https-proxy-agent");
const setServernameFromNonIpHost = (options) => {
  if (options.servername === void 0 && options.host && !net$1.isIP(options.host)) {
    return {
      ...options,
      servername: options.host
    };
  }
  return options;
};
class HttpsProxyAgent extends Agent2 {
  constructor(proxy, opts) {
    super(opts);
    this.options = { path: void 0 };
    this.proxy = typeof proxy === "string" ? new URL$2(proxy) : proxy;
    this.proxyHeaders = (opts == null ? void 0 : opts.headers) ?? {};
    debug("Creating new HttpsProxyAgent instance: %o", this.proxy.href);
    const host = (this.proxy.hostname || this.proxy.host).replace(/^\[|\]$/g, "");
    const port = this.proxy.port ? parseInt(this.proxy.port, 10) : this.proxy.protocol === "https:" ? 443 : 80;
    this.connectOpts = {
      // Attempt to negotiate http/1.1 for proxy servers that support http/2
      ALPNProtocols: ["http/1.1"],
      ...opts ? omit(opts, "headers") : null,
      host,
      port
    };
  }
  /**
   * Called when the node-core HTTP client library is creating a
   * new HTTP request.
   */
  async connect(req, opts) {
    const { proxy } = this;
    if (!opts.host) {
      throw new TypeError('No "host" provided');
    }
    let socket;
    if (proxy.protocol === "https:") {
      debug("Creating `tls.Socket`: %o", this.connectOpts);
      socket = tls.connect(setServernameFromNonIpHost(this.connectOpts));
    } else {
      debug("Creating `net.Socket`: %o", this.connectOpts);
      socket = net$1.connect(this.connectOpts);
    }
    const headers = typeof this.proxyHeaders === "function" ? this.proxyHeaders() : { ...this.proxyHeaders };
    const host = net$1.isIPv6(opts.host) ? `[${opts.host}]` : opts.host;
    let payload = `CONNECT ${host}:${opts.port} HTTP/1.1\r
`;
    if (proxy.username || proxy.password) {
      const auth = `${decodeURIComponent(proxy.username)}:${decodeURIComponent(proxy.password)}`;
      headers["Proxy-Authorization"] = `Basic ${Buffer.from(auth).toString("base64")}`;
    }
    headers.Host = `${host}:${opts.port}`;
    if (!headers["Proxy-Connection"]) {
      headers["Proxy-Connection"] = this.keepAlive ? "Keep-Alive" : "close";
    }
    for (const name of Object.keys(headers)) {
      payload += `${name}: ${headers[name]}\r
`;
    }
    const proxyResponsePromise = parseProxyResponse(socket);
    socket.write(`${payload}\r
`);
    const { connect, buffered } = await proxyResponsePromise;
    req.emit("proxyConnect", connect);
    this.emit("proxyConnect", connect, req);
    if (connect.statusCode === 200) {
      req.once("socket", resume);
      if (opts.secureEndpoint) {
        debug("Upgrading socket connection to TLS");
        return tls.connect({
          ...omit(setServernameFromNonIpHost(opts), "host", "path", "port"),
          socket
        });
      }
      return socket;
    }
    socket.destroy();
    const fakeSocket = new net$1.Socket({ writable: false });
    fakeSocket.readable = true;
    req.once("socket", (s) => {
      debug("Replaying proxy buffer for failed request");
      require$$4(s.listenerCount("data") > 0);
      s.push(buffered);
      s.push(null);
    });
    return fakeSocket;
  }
}
HttpsProxyAgent.protocols = ["http", "https"];
function resume(socket) {
  socket.resume();
}
function omit(obj, ...keys) {
  const ret = {};
  let key;
  for (key in obj) {
    if (!keys.includes(key)) {
      ret[key] = obj[key];
    }
  }
  return ret;
}
function getProxyAgent(proxyUrl) {
  if (!proxyUrl) return void 0;
  const trimmed = proxyUrl.trim();
  if (!trimmed) return void 0;
  if (trimmed.startsWith("socks5://") || trimmed.startsWith("socks4://") || trimmed.startsWith("socks://")) {
    return new SocksProxyAgent(trimmed);
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return new HttpsProxyAgent(trimmed);
  }
  return void 0;
}
function performLogin(ctx) {
  return new Promise(async (resolve2) => {
    const partitionName = `platform-waf-${Date.now()}`;
    const ses = session.fromPartition(partitionName, {
      cache: false
    });
    if (ctx.proxy) {
      await ses.setProxy({ proxyRules: ctx.proxy }).catch((err) => {
        console.error(
          "[deepseek-login] Failed to set proxy for session:",
          err.message
        );
      });
    }
    const win2 = new BrowserWindow({
      width: 800,
      height: 600,
      show: true,
      frame: false,
      icon: path$1.join(process.env.VITE_PUBLIC || "", "logo.png"),
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path$1.join(ctx.__dirname, "preload.mjs")
      }
    });
    if (ctx.VITE_DEV_SERVER_URL) {
      win2.loadURL(`${ctx.VITE_DEV_SERVER_URL}#/deepseek-browser`);
    } else {
      win2.loadFile(path$1.join(ctx.RENDERER_DIST, "index.html"), {
        hash: "/deepseek-browser"
      });
    }
    const view = new BrowserView({
      webPreferences: {
        session: ses,
        nodeIntegration: false,
        contextIsolation: true,
        webSecurity: true,
        preload: path$1.join(ctx.__dirname, "preload.mjs")
      }
    });
    win2.setBrowserView(view);
    const [width, height] = win2.getContentSize();
    view.setBounds({ x: 0, y: 40, width, height: height - 40 });
    view.setAutoResize({ width: true, height: true });
    win2.on("resize", () => {
      const [w, h] = win2.getContentSize();
      view.setBounds({ x: 0, y: 40, width: w, height: h - 40 });
    });
    const standardUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
    ses.setUserAgent(standardUA);
    view.webContents.setUserAgent(standardUA);
    let platformToken = null;
    let chatToken = null;
    let hasNavigatedToChat = false;
    let isResolved = false;
    let capturedEmail = "";
    let capturedPassword = "";
    const completeLogin = () => {
      if (isResolved) return;
      if (platformToken && chatToken) {
        isResolved = true;
        console.log(
          "[deepseek-login] Both tokens captured successfully, fetching user profile via main process (Android client mode)..."
        );
        const httpsAgent = getProxyAgent(ctx.proxy);
        axios.get(
          "https://chat.deepseek.com/api/v0/users/current",
          {
            headers: getHistoryHeaders(chatToken),
            httpsAgent
          }
        ).then((response) => {
          var _a, _b;
          const bizData = (_b = (_a = response.data) == null ? void 0 : _a.data) == null ? void 0 : _b.biz_data;
          console.log(
            "[deepseek-login] User profile fetched successfully:",
            bizData
          );
          resolve2({
            ok: true,
            status: 200,
            data: {
              data: {
                biz_data: {
                  user: {
                    id: (bizData == null ? void 0 : bizData.id) || `temp_${Date.now()}`,
                    email: capturedEmail || (bizData == null ? void 0 : bizData.email) || "unknown@deepseek.com",
                    token: chatToken
                  }
                }
              }
            },
            platformToken,
            proxy: ctx.proxy
          });
        }).catch((err) => {
          console.error(
            "[deepseek-login] Main-process profile fetch failed, using captured credentials fallback:",
            err.message
          );
          resolve2({
            ok: true,
            status: 200,
            data: {
              data: {
                biz_data: {
                  user: {
                    id: `temp_${Date.now()}`,
                    email: capturedEmail || "unknown@deepseek.com",
                    token: chatToken
                  }
                }
              }
            },
            platformToken,
            proxy: ctx.proxy
          });
        }).finally(() => {
          setTimeout(() => {
            if (!win2.isDestroyed()) {
              win2.destroy();
              ses.clearStorageData().catch(() => {
              });
            }
          }, 500);
        });
      }
    };
    ses.webRequest.onBeforeSendHeaders(
      { urls: ["*://*/*"] },
      (details, callback) => {
        if (details.requestHeaders["sec-ch-ua"]) {
          details.requestHeaders["sec-ch-ua"] = details.requestHeaders["sec-ch-ua"].split(", ").filter(
            (part) => !part.includes("Electron") && !part.includes("shallow-seek")
          ).join(", ");
        }
        callback({
          cancel: false,
          requestHeaders: details.requestHeaders
        });
      }
    );
    view.webContents.on("did-finish-load", async () => {
      const url2 = view.webContents.getURL();
      if (url2.includes("platform.deepseek.com")) {
        await view.webContents.executeJavaScript(credentialTrackerScript).catch(() => {
        });
        await view.webContents.executeJavaScript(loginPollerScript).catch(() => {
        });
      } else if (url2.includes("chat.deepseek.com")) {
        if (capturedEmail && capturedPassword) {
          console.log(
            "[deepseek-login] Injecting auto-login credentials into Chat page...",
            { capturedEmail }
          );
          await view.webContents.executeJavaScript(
            getAutoLoginScript(
              capturedEmail,
              capturedPassword
            )
          ).catch(() => {
          });
        }
        await view.webContents.executeJavaScript(chatPollerScript).catch(() => {
        });
      }
    });
    view.webContents.on(
      "console-message",
      async (_event, level, message) => {
        console.log(
          `[Browser Console] [Level ${level}]:`,
          message
        );
        if (message.startsWith("__TRACKED_EMAIL__:")) {
          capturedEmail = message.replace("__TRACKED_EMAIL__:", "").trim();
        } else if (message.startsWith("__TRACKED_PASSWORD__:")) {
          capturedPassword = message.replace("__TRACKED_PASSWORD__:", "").trim();
        } else if (message.startsWith("__PLATFORM_TOKEN__:")) {
          const token = message.replace("__PLATFORM_TOKEN__:", "").trim();
          if (!platformToken) {
            platformToken = token;
            console.log(
              "[deepseek-login] Captured platform token from localStorage!"
            );
          }
          if (platformToken && !hasNavigatedToChat) {
            hasNavigatedToChat = true;
            try {
              const cookies2 = await ses.cookies.get({});
              console.log(
                "[deepseek-login] Domain cookies:",
                cookies2.map(
                  (c) => `${c.domain} - ${c.name}=${c.value ? "***" : "empty"}`
                )
              );
            } catch (cookieErr) {
              console.error(
                "[deepseek-login] Error getting cookies:",
                cookieErr.message
              );
            }
            console.log(
              "[deepseek-login] Platform token found, waiting 2.5s before navigating to chat..."
            );
            setTimeout(() => {
              view.webContents.loadURL("https://chat.deepseek.com/");
            }, 2500);
          }
        } else if (message.startsWith("__CHAT_TOKEN__:")) {
          const token = message.replace("__CHAT_TOKEN__:", "").trim();
          if (!chatToken) {
            chatToken = token;
            console.log(
              "[deepseek-login] Captured chat token from localStorage!"
            );
          }
        }
        completeLogin();
      }
    );
    win2.on("closed", () => {
      if (!isResolved) {
        isResolved = true;
        resolve2({
          ok: false,
          error: {
            message: "User closed window before login complete"
          }
        });
      }
    });
    console.log(
      "[deepseek-login] Opening platform sign_in page..."
    );
    await view.webContents.loadURL("https://platform.deepseek.com/sign_in");
  });
}
const rc = [
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
function rotl64(v, k) {
  return BigInt.asUintN(64, v << k | v >> 64n - k);
}
function keccakF23(s) {
  let a0 = s[0], a1 = s[1], a2 = s[2], a3 = s[3], a4 = s[4];
  let a5 = s[5], a6 = s[6], a7 = s[7], a8 = s[8], a9 = s[9];
  let a10 = s[10], a11 = s[11], a12 = s[12], a13 = s[13], a14 = s[14];
  let a15 = s[15], a16 = s[16], a17 = s[17], a18 = s[18], a19 = s[19];
  let a20 = s[20], a21 = s[21], a22 = s[22], a23 = s[23], a24 = s[24];
  for (let r = 1; r < 24; r++) {
    const c0 = a0 ^ a5 ^ a10 ^ a15 ^ a20;
    const c1 = a1 ^ a6 ^ a11 ^ a16 ^ a21;
    const c2 = a2 ^ a7 ^ a12 ^ a17 ^ a22;
    const c3 = a3 ^ a8 ^ a13 ^ a18 ^ a23;
    const c4 = a4 ^ a9 ^ a14 ^ a19 ^ a24;
    const d0 = c4 ^ rotl64(c1, 1n);
    const d1 = c0 ^ rotl64(c2, 1n);
    const d2 = c1 ^ rotl64(c3, 1n);
    const d3 = c2 ^ rotl64(c4, 1n);
    const d4 = c3 ^ rotl64(c0, 1n);
    a0 ^= d0;
    a5 ^= d0;
    a10 ^= d0;
    a15 ^= d0;
    a20 ^= d0;
    a1 ^= d1;
    a6 ^= d1;
    a11 ^= d1;
    a16 ^= d1;
    a21 ^= d1;
    a2 ^= d2;
    a7 ^= d2;
    a12 ^= d2;
    a17 ^= d2;
    a22 ^= d2;
    a3 ^= d3;
    a8 ^= d3;
    a13 ^= d3;
    a18 ^= d3;
    a23 ^= d3;
    a4 ^= d4;
    a9 ^= d4;
    a14 ^= d4;
    a19 ^= d4;
    a24 ^= d4;
    const b0 = a0;
    const b10 = rotl64(a1, 1n);
    const b20 = rotl64(a2, 62n);
    const b5 = rotl64(a3, 28n);
    const b15 = rotl64(a4, 27n);
    const b16 = rotl64(a5, 36n);
    const b1 = rotl64(a6, 44n);
    const b11 = rotl64(a7, 6n);
    const b21 = rotl64(a8, 55n);
    const b6 = rotl64(a9, 20n);
    const b7 = rotl64(a10, 3n);
    const b17 = rotl64(a11, 10n);
    const b2 = rotl64(a12, 43n);
    const b12 = rotl64(a13, 25n);
    const b22 = rotl64(a14, 39n);
    const b23 = rotl64(a15, 41n);
    const b8 = rotl64(a16, 45n);
    const b18 = rotl64(a17, 15n);
    const b3 = rotl64(a18, 21n);
    const b13 = rotl64(a19, 8n);
    const b14 = rotl64(a20, 18n);
    const b24 = rotl64(a21, 2n);
    const b9 = rotl64(a22, 61n);
    const b19 = rotl64(a23, 56n);
    const b4 = rotl64(a24, 14n);
    a0 = b0 ^ ~b1 & b2;
    a1 = b1 ^ ~b2 & b3;
    a2 = b2 ^ ~b3 & b4;
    a3 = b3 ^ ~b4 & b0;
    a4 = b4 ^ ~b0 & b1;
    a5 = b5 ^ ~b6 & b7;
    a6 = b6 ^ ~b7 & b8;
    a7 = b7 ^ ~b8 & b9;
    a8 = b8 ^ ~b9 & b5;
    a9 = b9 ^ ~b5 & b6;
    a10 = b10 ^ ~b11 & b12;
    a11 = b11 ^ ~b12 & b13;
    a12 = b12 ^ ~b13 & b14;
    a13 = b13 ^ ~b14 & b10;
    a14 = b14 ^ ~b10 & b11;
    a15 = b15 ^ ~b16 & b17;
    a16 = b16 ^ ~b17 & b18;
    a17 = b17 ^ ~b18 & b19;
    a18 = b18 ^ ~b19 & b15;
    a19 = b19 ^ ~b15 & b16;
    a20 = b20 ^ ~b21 & b22;
    a21 = b21 ^ ~b22 & b23;
    a22 = b22 ^ ~b23 & b24;
    a23 = b23 ^ ~b24 & b20;
    a24 = b24 ^ ~b20 & b21;
    a0 ^= rc[r];
  }
  s[0] = a0;
  s[1] = a1;
  s[2] = a2;
  s[3] = a3;
  s[4] = a4;
  s[5] = a5;
  s[6] = a6;
  s[7] = a7;
  s[8] = a8;
  s[9] = a9;
  s[10] = a10;
  s[11] = a11;
  s[12] = a12;
  s[13] = a13;
  s[14] = a14;
  s[15] = a15;
  s[16] = a16;
  s[17] = a17;
  s[18] = a18;
  s[19] = a19;
  s[20] = a20;
  s[21] = a21;
  s[22] = a22;
  s[23] = a23;
  s[24] = a24;
}
function solvePow(challengeHex, salt, expireAt, difficulty) {
  if (challengeHex.length !== 64) {
    throw new Error("pow: challenge must be 64 hex chars");
  }
  const target = Buffer.from(challengeHex, "hex");
  const t0 = target.readBigUInt64LE(0);
  const t1 = target.readBigUInt64LE(8);
  const t2 = target.readBigUInt64LE(16);
  const t3 = target.readBigUInt64LE(24);
  const prefixStr = `${salt}_${expireAt}_`;
  const prefix = Buffer.from(prefixStr, "utf-8");
  const rate = 136;
  let baseState = new Array(25).fill(0n);
  let off = 0;
  while (off + rate <= prefix.length) {
    for (let i = 0; i < rate / 8; i++) {
      baseState[i] ^= prefix.readBigUInt64LE(off + i * 8);
    }
    keccakF23(baseState);
    off += rate;
  }
  const tailLen = prefix.length - off;
  const tail = Buffer.alloc(rate);
  prefix.copy(tail, 0, off);
  let numBuf = Buffer.alloc(20);
  for (let n = 0; n < difficulty; n++) {
    let v = n;
    let pos = 20;
    if (v === 0) {
      pos--;
      numBuf[pos] = 48;
    } else {
      while (v > 0) {
        pos--;
        numBuf[pos] = 48 + v % 10;
        v = Math.floor(v / 10);
      }
    }
    const numLen = 20 - pos;
    let s = [...baseState];
    const totalTail = tailLen + numLen;
    if (totalTail < rate) {
      let buf = Buffer.alloc(rate);
      tail.copy(buf, 0, 0, tailLen);
      numBuf.copy(buf, tailLen, pos, 20);
      buf[totalTail] = 6;
      buf[rate - 1] |= 128;
      for (let i = 0; i < rate / 8; i++) {
        s[i] ^= buf.readBigUInt64LE(i * 8);
      }
      keccakF23(s);
    } else {
      let buf = Buffer.alloc(rate);
      tail.copy(buf, 0, 0, tailLen);
      numBuf.copy(buf, tailLen, pos, pos + (rate - tailLen));
      for (let i = 0; i < rate / 8; i++) {
        s[i] ^= buf.readBigUInt64LE(i * 8);
      }
      keccakF23(s);
      let buf2 = Buffer.alloc(rate);
      const rem = totalTail - rate;
      numBuf.copy(buf2, 0, pos + (rate - tailLen), pos + (rate - tailLen) + rem);
      buf2[rem] = 6;
      buf2[rate - 1] |= 128;
      for (let i = 0; i < rate / 8; i++) {
        s[i] ^= buf2.readBigUInt64LE(i * 8);
      }
      keccakF23(s);
    }
    if (s[0] === t0 && s[1] === t1 && s[2] === t2 && s[3] === t3) {
      return n;
    }
  }
  throw new Error("pow: no solution within difficulty");
}
function buildPowHeader(challenge, answer) {
  const payload = {
    algorithm: challenge.algorithm,
    challenge: challenge.challenge,
    salt: challenge.salt,
    answer,
    signature: challenge.signature,
    target_path: challenge.target_path
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}
function solveAndBuildHeader(challenge) {
  if (challenge.algorithm !== "DeepSeekHashV1") {
    throw new Error("pow: unsupported algorithm: " + challenge.algorithm);
  }
  const difficulty = challenge.difficulty || 144e3;
  const answer = solvePow(
    challenge.challenge,
    challenge.salt,
    challenge.expire_at,
    difficulty
  );
  return buildPowHeader(challenge, answer);
}
const userDataPath = app.getPath("userData");
const dbDir = path$1.join(userDataPath, "database");
if (!fs$1.existsSync(dbDir)) {
  fs$1.mkdirSync(dbDir, { recursive: true });
}
const dbPath = path$1.join(dbDir, "shallow-seek.db");
const db = new Database(dbPath);
db.exec(`
  CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    chat_token TEXT NOT NULL,
    platform_token TEXT,
    proxy TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);
try {
  db.exec(`ALTER TABLE accounts RENAME COLUMN token TO chat_token;`);
} catch (e) {
}
try {
  db.exec(`ALTER TABLE accounts ADD COLUMN platform_token TEXT;`);
} catch (e) {
}
try {
  db.exec(`ALTER TABLE accounts ADD COLUMN proxy TEXT;`);
} catch (e) {
}
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);
const addAccount = (account) => {
  const stmt = db.prepare(
    "INSERT OR REPLACE INTO accounts (id, email, chat_token, platform_token, proxy) VALUES (?, ?, ?, ?, ?)"
  );
  return stmt.run(
    account.id,
    account.email,
    account.chat_token,
    account.platform_token || null,
    account.proxy || null
  );
};
const getAccounts = () => {
  const stmt = db.prepare("SELECT * FROM accounts ORDER BY created_at DESC");
  return stmt.all();
};
const deleteAccount = (id) => {
  const stmt = db.prepare("DELETE FROM accounts WHERE id = ?");
  return stmt.run(id);
};
const checkAccountExists = (email) => {
  const stmt = db.prepare(
    "SELECT COUNT(*) as count FROM accounts WHERE LOWER(email) = LOWER(?)"
  );
  const result = stmt.get(email.trim());
  return result.count > 0;
};
const getSetting = (key) => {
  const stmt = db.prepare("SELECT value FROM settings WHERE key = ?");
  const result = stmt.get(key);
  return result ? result.value : null;
};
const setSetting = (key, value) => {
  const stmt = db.prepare(
    "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)"
  );
  return stmt.run(key, value);
};
const getAllSettings = () => {
  const stmt = db.prepare("SELECT * FROM settings");
  const rows = stmt.all();
  return rows.reduce((acc, row) => ({ ...acc, [row.key]: row.value }), {});
};
const getProxyForToken = (token) => {
  if (!token) return null;
  try {
    const stmt = db.prepare("SELECT proxy FROM accounts WHERE chat_token = ? OR platform_token = ?");
    const result = stmt.get(token, token);
    return result ? result.proxy : null;
  } catch (e) {
    return null;
  }
};
async function fetchHistory(payload) {
  console.log(
    "[deepseek-fetch-history] Requesting history with token:",
    payload.token ? "present" : "missing"
  );
  try {
    const proxyUrl = getProxyForToken(payload.token);
    const httpsAgent = getProxyAgent(proxyUrl);
    const response = await axios.get(DEEPSEEK_HISTORY_URL, {
      headers: getHistoryHeaders(payload.token, payload.cookies),
      validateStatus: () => true,
      httpsAgent
    });
    console.log(
      "[deepseek-fetch-history] Response status:",
      response.status
    );
    if (response.status !== 200) {
      console.error(
        "[deepseek-fetch-history] Error response data:",
        response.data
      );
    }
    return { ok: true, data: response.data };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[deepseek-fetch-history] Catch error:", message);
    return { ok: false, error: { message } };
  }
}
async function fetchSessionMessages(payload) {
  var _a, _b, _c, _d, _e;
  try {
    const proxyUrl = getProxyForToken(payload.token);
    const httpsAgent = getProxyAgent(proxyUrl);
    const headers = getHistoryHeaders(
      payload.token,
      payload.cookies
    );
    const res = await axios.get(
      `${DEEPSEEK_HISTORY_MESSAGES_URL}?chat_session_id=${payload.sessionId}`,
      {
        headers,
        httpsAgent
      }
    );
    console.log(
      "[deepseek-fetch-session-messages] Response status:",
      res.status
    );
    if (((_d = (_c = (_b = (_a = res.data) == null ? void 0 : _a.data) == null ? void 0 : _b.biz_data) == null ? void 0 : _c.chat_messages) == null ? void 0 : _d.length) > 0) {
      console.log(
        "[deepseek-fetch-session-messages] Message keys:",
        Object.keys(res.data.data.biz_data.chat_messages[0])
      );
      console.log(
        "[deepseek-fetch-session-messages] Message sample:",
        JSON.stringify(
          res.data.data.biz_data.chat_messages[0]
        ).substring(0, 1e3)
      );
    }
    return { ok: true, data: res.data };
  } catch (error) {
    console.error(
      "[deepseek-fetch-session-messages] error:",
      error == null ? void 0 : error.message
    );
    return {
      ok: false,
      error: ((_e = error == null ? void 0 : error.response) == null ? void 0 : _e.data) || (error == null ? void 0 : error.message)
    };
  }
}
async function createSession$1(payload) {
  try {
    const proxyUrl = getProxyForToken(payload.token);
    const httpsAgent = getProxyAgent(proxyUrl);
    const response = await axios.post(
      DEEPSEEK_CREATE_SESSION_URL,
      {},
      {
        headers: getHistoryHeaders(
          payload.token,
          payload.cookies
        ),
        validateStatus: () => true,
        httpsAgent
      }
    );
    console.log(
      "[deepseek-create-session] Response status:",
      response.status
    );
    return { ok: true, data: response.data };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(
      "[deepseek-create-session] Catch error:",
      message
    );
    return { ok: false, error: { message } };
  }
}
async function deleteSession$1(payload) {
  try {
    const proxyUrl = getProxyForToken(payload.token);
    const httpsAgent = getProxyAgent(proxyUrl);
    const response = await axios.post(
      DEEPSEEK_DELETE_SESSION_URL,
      { chat_session_id: payload.sessionId },
      {
        headers: getHistoryHeaders(
          payload.token,
          payload.cookies
        ),
        validateStatus: () => true,
        httpsAgent
      }
    );
    console.log(
      "[deepseek-delete-session] Response status:",
      response.status
    );
    return { ok: true, data: response.data };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(
      "[deepseek-delete-session] Catch error:",
      message
    );
    return { ok: false, error: { message } };
  }
}
async function getApiKeys(payload) {
  console.log(
    "[deepseek-get-api-keys] Request with token prefix:",
    payload.token ? `${payload.token.substring(0, 10)}... (len: ${payload.token.length})` : "missing"
  );
  try {
    const proxyUrl = getProxyForToken(payload.token);
    const httpsAgent = getProxyAgent(proxyUrl);
    const response = await axios.get(
      DEEPSEEK_PLATFORM_GET_API_KEYS_URL,
      {
        headers: getPlatformHeaders(payload.token),
        validateStatus: () => true,
        httpsAgent
      }
    );
    console.log(
      "[deepseek-get-api-keys] Response status:",
      response.status,
      "body:",
      JSON.stringify(response.data)
    );
    return { ok: true, data: response.data };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[deepseek-get-api-keys] Catch error:", message);
    return { ok: false, error: { message } };
  }
}
async function editApiKeys(payload) {
  console.log(
    "[deepseek-edit-api-keys] Request with token prefix:",
    payload.token ? `${payload.token.substring(0, 10)}... (len: ${payload.token.length})` : "missing",
    "body:",
    JSON.stringify(payload.body)
  );
  try {
    const proxyUrl = getProxyForToken(payload.token);
    const httpsAgent = getProxyAgent(proxyUrl);
    const response = await axios.post(
      DEEPSEEK_PLATFORM_EDIT_API_KEYS_URL,
      payload.body,
      {
        headers: {
          ...getPlatformHeaders(payload.token),
          "Content-Type": "application/json"
        },
        validateStatus: () => true,
        httpsAgent
      }
    );
    console.log(
      "[deepseek-edit-api-keys] Response status:",
      response.status,
      "body:",
      JSON.stringify(response.data)
    );
    return { ok: true, data: response.data };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[deepseek-edit-api-keys] Catch error:", message);
    return { ok: false, error: { message } };
  }
}
async function uploadFile(payload) {
  var _a, _b, _c, _d, _e;
  try {
    const proxyUrl = getProxyForToken(payload.token);
    const httpsAgent = getProxyAgent(proxyUrl);
    const powResponse = await axios.post(
      DEEPSEEK_CREATE_POW_URL,
      { target_path: "/api/v0/file/upload_file" },
      {
        headers: getHistoryHeaders(
          payload.token,
          payload.cookies
        ),
        validateStatus: () => true,
        httpsAgent
      }
    );
    if (powResponse.status !== 200 || ((_a = powResponse.data) == null ? void 0 : _a.code) !== 0) {
      return { ok: false, error: { message: "Failed to get PoW challenge for upload" } };
    }
    const challenge = (_d = (_c = (_b = powResponse.data) == null ? void 0 : _b.data) == null ? void 0 : _c.biz_data) == null ? void 0 : _d.challenge;
    const powHeaderStr = solveAndBuildHeader(challenge);
    const formData = new FormData$1();
    formData.append("file", fs$1.createReadStream(payload.filePath), payload.fileName);
    const headers = {
      ...getHistoryHeaders(payload.token, payload.cookies),
      "x-ds-pow-response": powHeaderStr,
      ...formData.getHeaders()
    };
    const response = await axios.post(DEEPSEEK_UPLOAD_FILE_URL, formData, {
      headers,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      validateStatus: () => true,
      httpsAgent
    });
    if (response.status !== 200 || ((_e = response.data) == null ? void 0 : _e.code) !== 0) {
      return { ok: false, error: response.data || { message: "Upload failed" } };
    }
    return { ok: true, data: response.data };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, error: { message } };
  }
}
async function fetchFiles(payload) {
  var _a;
  try {
    const proxyUrl = getProxyForToken(payload.token);
    const httpsAgent = getProxyAgent(proxyUrl);
    const query = payload.fileIds.map((id) => `file_ids=${encodeURIComponent(id)}`).join("&");
    const response = await axios.get(`${DEEPSEEK_FETCH_FILES_URL}?${query}`, {
      headers: getHistoryHeaders(payload.token),
      validateStatus: () => true,
      httpsAgent
    });
    if (response.status !== 200 || ((_a = response.data) == null ? void 0 : _a.code) !== 0) {
      return { ok: false, error: response.data || { message: "Fetch files failed" } };
    }
    return { ok: true, data: response.data };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, error: { message } };
  }
}
async function saveTempFile(payload, tempDir) {
  try {
    const path2 = await import("node:path");
    const filePath = path2.join(tempDir, payload.fileName);
    const buffer = Buffer.from(payload.base64Data, "base64");
    await fs$1.promises.writeFile(filePath, buffer);
    return { ok: true, filePath };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, error: { message } };
  }
}
async function handleChatStream(sender, payload) {
  var _a, _b, _c, _d;
  try {
    const powResponse = await axios.post(
      DEEPSEEK_CREATE_POW_URL,
      { target_path: DEEPSEEK_COMPLETION_TARGET_PATH },
      {
        headers: getHistoryHeaders(
          payload.token,
          payload.cookies
        ),
        validateStatus: () => true
      }
    );
    if (powResponse.status !== 200 || ((_a = powResponse.data) == null ? void 0 : _a.code) !== 0) {
      sender.send("deepseek-chat-error", {
        message: "Failed to get PoW challenge"
      });
      return;
    }
    const challenge = (_d = (_c = (_b = powResponse.data) == null ? void 0 : _b.data) == null ? void 0 : _c.biz_data) == null ? void 0 : _d.challenge;
    if (!challenge) {
      sender.send("deepseek-chat-error", {
        message: "Invalid PoW challenge response"
      });
      return;
    }
    const powHeaderStr = solveAndBuildHeader(challenge);
    const chatHeaders = getChatHeaders(
      payload.token,
      powHeaderStr,
      payload.cookies
    );
    console.log(
      "[deepseek-chat-stream] Request URL:",
      DEEPSEEK_COMPLETION_URL
    );
    console.log(
      "[deepseek-chat-stream] Request Headers:",
      JSON.stringify(chatHeaders)
    );
    console.log(
      "[deepseek-chat-stream] Request Body:",
      JSON.stringify(payload.payload)
    );
    const response = await axios.post(
      DEEPSEEK_COMPLETION_URL,
      payload.payload,
      {
        headers: chatHeaders,
        responseType: "stream",
        validateStatus: () => true
      }
    );
    if (response.status !== 200) {
      const stream22 = response.data;
      let errorData = "";
      for await (const chunk of stream22) {
        errorData += chunk.toString();
      }
      console.error(
        "[deepseek-chat-stream] Error Status:",
        response.status
      );
      console.error(
        "[deepseek-chat-stream] Error Data:",
        errorData
      );
      sender.send("deepseek-chat-error", {
        message: `DeepSeek API Error: ${response.status}. ${errorData}`
      });
      return;
    }
    const stream2 = response.data;
    stream2.on("data", (chunk) => {
      const text = chunk.toString("utf-8");
      sender.send("deepseek-chat-chunk", text);
    });
    stream2.on("end", () => {
      sender.send("deepseek-chat-end");
    });
    stream2.on("error", (err) => {
      sender.send("deepseek-chat-error", {
        message: err.message
      });
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    sender.send("deepseek-chat-error", { message });
  }
}
function registerAccountIpcs(__dirname, VITE_DEV_SERVER_URL2, RENDERER_DIST2) {
  ipcMain.on("open-add-account", (event) => {
    const parentWindow = BrowserWindow.fromWebContents(event.sender) || void 0;
    const popup = new BrowserWindow({
      width: 450,
      height: 550,
      frame: false,
      resizable: false,
      parent: parentWindow,
      modal: true,
      icon: path$1.join(process.env.VITE_PUBLIC || "", "logo.png"),
      webPreferences: {
        preload: path$1.join(__dirname, "preload.mjs")
      }
    });
    if (VITE_DEV_SERVER_URL2) {
      popup.loadURL(`${VITE_DEV_SERVER_URL2}#/add-account`);
    } else {
      popup.loadFile(path$1.join(RENDERER_DIST2, "index.html"), {
        hash: "/add-account"
      });
    }
  });
  ipcMain.on("open-create-api-key", (event, token) => {
    const parentWindow = BrowserWindow.fromWebContents(event.sender) || void 0;
    const popup = new BrowserWindow({
      width: 450,
      height: 560,
      frame: false,
      resizable: false,
      parent: parentWindow,
      modal: true,
      icon: path$1.join(process.env.VITE_PUBLIC || "", "logo.png"),
      webPreferences: {
        preload: path$1.join(__dirname, "preload.mjs")
      }
    });
    const encodedToken = encodeURIComponent(token);
    if (VITE_DEV_SERVER_URL2) {
      popup.loadURL(
        `${VITE_DEV_SERVER_URL2}#/create-api-key/${encodedToken}`
      );
    } else {
      popup.loadFile(path$1.join(RENDERER_DIST2, "index.html"), {
        hash: `/create-api-key/${encodedToken}`
      });
    }
  });
  ipcMain.handle("deepseek-login", async (_event, payload) => {
    return performLogin({ __dirname, VITE_DEV_SERVER_URL: VITE_DEV_SERVER_URL2, RENDERER_DIST: RENDERER_DIST2, proxy: payload == null ? void 0 : payload.proxy });
  });
  ipcMain.handle(
    "deepseek-fetch-history",
    async (_event, payload) => {
      return fetchHistory(payload);
    }
  );
  ipcMain.handle(
    "deepseek-fetch-session-messages",
    async (_event, payload) => {
      return fetchSessionMessages(payload);
    }
  );
  ipcMain.handle(
    "deepseek-create-session",
    async (_event, payload) => {
      return createSession$1(payload);
    }
  );
  ipcMain.handle(
    "deepseek-delete-session",
    async (_event, payload) => {
      return deleteSession$1(payload);
    }
  );
  ipcMain.handle(
    "deepseek-get-api-keys",
    async (_event, payload) => {
      return getApiKeys(payload);
    }
  );
  ipcMain.handle(
    "deepseek-edit-api-keys",
    async (_event, payload) => {
      return editApiKeys(payload);
    }
  );
  ipcMain.handle(
    "deepseek-upload-file",
    async (_event, payload) => {
      return uploadFile(payload);
    }
  );
  ipcMain.handle(
    "deepseek-fetch-files",
    async (_event, payload) => {
      return fetchFiles(payload);
    }
  );
  ipcMain.handle(
    "deepseek-save-temp-file",
    async (_event, payload) => {
      return saveTempFile(payload, app.getPath("temp"));
    }
  );
  ipcMain.on(
    "deepseek-chat-stream",
    async (event, payload) => {
      return handleChatStream(event.sender, payload);
    }
  );
}
function registerDatabaseIpcs() {
  ipcMain.handle("db-add-account", async (_event, account) => {
    try {
      addAccount(account);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
  ipcMain.handle("db-get-accounts", async () => {
    try {
      const accounts = getAccounts();
      return { success: true, data: accounts };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
  ipcMain.handle("db-delete-account", async (_event, id) => {
    try {
      deleteAccount(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
  ipcMain.handle("db-check-account-exists", async (_event, email) => {
    try {
      const exists = checkAccountExists(email);
      return { success: true, exists };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
  ipcMain.handle("db-get-setting", async (_event, key) => {
    try {
      const value = getSetting(key);
      return { success: true, value };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
  ipcMain.handle("db-set-setting", async (_event, key, value) => {
    try {
      setSetting(key, value);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
  ipcMain.handle("db-get-all-settings", async () => {
    try {
      const settings = getAllSettings();
      return { success: true, data: settings };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
}
function intFrom(v) {
  if (typeof v === "number") return Math.floor(v);
  return 0;
}
async function login(acc) {
  var _a, _b, _c, _d, _e;
  const body = getLoginRequestBody(
    acc.email.trim(),
    acc.password.trim()
  );
  const httpsAgent = getProxyAgent(acc.proxy);
  const resp = await axios.post(DEEPSEEK_LOGIN_URL, body, {
    headers: getLoginHeaders(),
    validateStatus: () => true,
    httpsAgent
  });
  const data = resp.data;
  const code = intFrom(data == null ? void 0 : data.code);
  if (code !== 0) throw new Error(`login failed: ${data == null ? void 0 : data.msg}`);
  const bizCode = intFrom((_a = data == null ? void 0 : data.data) == null ? void 0 : _a.biz_code);
  if (bizCode !== 0) throw new Error(`login failed: ${(_b = data == null ? void 0 : data.data) == null ? void 0 : _b.biz_msg}`);
  const token = (_e = (_d = (_c = data == null ? void 0 : data.data) == null ? void 0 : _c.biz_data) == null ? void 0 : _d.user) == null ? void 0 : _e.token;
  if (!token || typeof token !== "string" || !token.trim()) {
    throw new Error("missing login token");
  }
  return token.trim();
}
async function createSession(token, maxAttempts = 3) {
  var _a;
  const proxyUrl = getProxyForToken(token);
  const httpsAgent = getProxyAgent(proxyUrl);
  const headers = getHistoryHeaders(token);
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const resp = await axios.post(
        DEEPSEEK_CREATE_SESSION_URL,
        { agent: "chat" },
        {
          headers,
          validateStatus: () => true,
          httpsAgent
        }
      );
      const data = resp.data;
      if (resp.status === 200 && intFrom(data == null ? void 0 : data.code) === 0 && intFrom((_a = data == null ? void 0 : data.data) == null ? void 0 : _a.biz_code) === 0) {
        const sessionId = extractSessionId(data);
        if (sessionId) return sessionId;
      }
      console.warn(
        "[shallowseek-api] create_session failed",
        resp.status,
        data == null ? void 0 : data.msg
      );
    } catch (err) {
      console.warn("[shallowseek-api] create_session error", err.message);
    }
  }
  throw new Error("create session failed after retries");
}
function extractSessionId(resp) {
  var _a, _b;
  const bizData = (_a = resp == null ? void 0 : resp.data) == null ? void 0 : _a.biz_data;
  if (typeof (bizData == null ? void 0 : bizData.id) === "string" && bizData.id.trim())
    return bizData.id.trim();
  if (typeof ((_b = bizData == null ? void 0 : bizData.chat_session) == null ? void 0 : _b.id) === "string" && bizData.chat_session.id.trim()) {
    return bizData.chat_session.id.trim();
  }
  return null;
}
async function getPow(token, maxAttempts = 3) {
  var _a, _b, _c;
  const proxyUrl = getProxyForToken(token);
  const httpsAgent = getProxyAgent(proxyUrl);
  const headers = getHistoryHeaders(token);
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const resp = await axios.post(
        DEEPSEEK_CREATE_POW_URL,
        { target_path: DEEPSEEK_COMPLETION_TARGET_PATH },
        { headers, validateStatus: () => true, httpsAgent }
      );
      const data = resp.data;
      if (resp.status === 200 && intFrom(data == null ? void 0 : data.code) === 0 && intFrom((_a = data == null ? void 0 : data.data) == null ? void 0 : _a.biz_code) === 0) {
        const challenge = (_c = (_b = data == null ? void 0 : data.data) == null ? void 0 : _b.biz_data) == null ? void 0 : _c.challenge;
        if (!challenge)
          throw new Error("invalid pow challenge response");
        return solveAndBuildHeader(challenge);
      }
      console.warn(
        "[shallowseek-api] get_pow failed",
        resp.status,
        data == null ? void 0 : data.msg
      );
    } catch (err) {
      console.warn("[shallowseek-api] get_pow error", err.message);
    }
  }
  throw new Error("get pow failed after retries");
}
async function callCompletion(token, payload, powResponse) {
  const proxyUrl = getProxyForToken(token);
  const httpsAgent = getProxyAgent(proxyUrl);
  const headers = getChatHeaders(token, powResponse);
  return axios.post(DEEPSEEK_COMPLETION_URL, payload, {
    headers,
    responseType: "stream",
    validateStatus: () => true,
    httpsAgent
  });
}
async function deleteSession(token, sessionId) {
  try {
    const proxyUrl = getProxyForToken(token);
    const httpsAgent = getProxyAgent(proxyUrl);
    await axios.post(
      DEEPSEEK_DELETE_SESSION_URL,
      { chat_session_id: sessionId },
      { headers: getHistoryHeaders(token), validateStatus: () => true, httpsAgent }
    );
  } catch (err) {
    console.warn("[shallowseek-api] delete_session error", err.message);
  }
}
let _logCallback = null;
function setLogCallback$1(cb) {
  _logCallback = cb;
}
function serverLog(msg) {
  console.log(msg);
  if (_logCallback) _logCallback(msg);
}
function isRecord(value) {
  return typeof value === "object" && value !== null;
}
function getErrorMessage(err) {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  if (isRecord(err) && typeof err.message === "string") return err.message;
  return "Unknown error";
}
function logWithPort(port, msg) {
  if (msg.includes("[shallowseek-api]")) {
    serverLog(
      msg.replace("[shallowseek-api]", `[shallowseek-api] [${port}]`)
    );
    return;
  }
  if (msg.includes("[api]")) {
    serverLog(msg.replace("[api]", `[api] [${port}]`));
    return;
  }
  serverLog(`[${port}] ${msg}`);
}
function getNextToken(state2) {
  if (state2.accountTokens.size === 0) return null;
  const entries = Array.from(state2.accountTokens.entries());
  const [, token] = entries[state2.accountIndex % entries.length];
  state2.accountIndex = (state2.accountIndex + 1) % entries.length;
  return token;
}
function getAlternateToken(state2, currentToken) {
  if (state2.accountTokens.size <= 1) return null;
  for (const [, token] of state2.accountTokens) {
    if (token !== currentToken) return token;
  }
  return null;
}
function readBody(req) {
  return new Promise((resolve2, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => resolve2(body));
    req.on("error", reject);
  });
}
function streamToString(stream2) {
  return new Promise((resolve2, reject) => {
    let data = "";
    stream2.on("data", (chunk) => {
      data += chunk.toString();
    });
    stream2.on("end", () => resolve2(data));
    stream2.on("error", reject);
  });
}
function jsonResponse(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}
function setCORS(res, req) {
  const origin2 = req.headers["origin"] || "*";
  res.setHeader("Access-Control-Allow-Origin", origin2);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-API-Key"
  );
  res.setHeader("Access-Control-Max-Age", "600");
}
function estimateTokens(text) {
  if (!text) return 0;
  let asciiChars = 0;
  let nonASCIIChars = 0;
  for (let i = 0; i < text.length; i++) {
    if (text.charCodeAt(i) < 128) {
      asciiChars++;
    } else {
      nonASCIIChars++;
    }
  }
  const n = Math.floor(asciiChars / 4) + Math.floor((nonASCIIChars * 10 + 7) / 13);
  return Math.max(1, n);
}
function buildToolCallInstructions(toolNames) {
  return `${TOOL_CALL_INSTRUCTIONS}
${buildCorrectToolExamples(toolNames)}`;
}
function buildCorrectToolExamples(toolNames) {
  const names = uniqueToolNames(toolNames);
  const examples = [];
  const single = firstBasicExample(names);
  if (single) {
    examples.push(
      "Example A — Single tool:\n" + renderToolExampleBlock([single])
    );
  }
  const parallel2 = firstNBasicExamples(names, 2);
  if (parallel2.length >= 2) {
    examples.push(
      "Example B — Two tools in parallel:\n" + renderToolExampleBlock(parallel2)
    );
  }
  const nested = firstNestedExample(names);
  if (nested) {
    examples.push(
      "Example C — Tool with nested XML parameters:\n" + renderToolExampleBlock([nested])
    );
  }
  const script = firstScriptExample(names);
  if (script) {
    examples.push(
      "Example D — Tool with long script using CDATA (RELIABLE FOR CODE/SCRIPTS):\n" + renderToolExampleBlock([script])
    );
  }
  if (examples.length === 0) {
    return "";
  }
  return "【CORRECT EXAMPLES】:\n\n" + examples.join("\n\n") + "\n\n";
}
function uniqueToolNames(toolNames) {
  const names = [];
  const seen = /* @__PURE__ */ new Set();
  for (let name of toolNames) {
    name = name.trim();
    if (name === "" || seen.has(name)) {
      continue;
    }
    seen.add(name);
    names.push(name);
  }
  return names;
}
function firstBasicExample(names) {
  for (const name of names) {
    const params = exampleBasicParams(name);
    if (params) {
      return { name, params };
    }
  }
  return null;
}
function firstNBasicExamples(names, count) {
  const out = [];
  for (const name of names) {
    const params = exampleBasicParams(name);
    if (params) {
      out.push({ name, params });
      if (out.length === count) {
        return out;
      }
    }
  }
  return out;
}
function firstNestedExample(names) {
  for (const name of names) {
    const params = exampleNestedParams(name);
    if (params) {
      return { name, params };
    }
  }
  return null;
}
function firstScriptExample(names) {
  for (const name of names) {
    const params = exampleScriptParams(name);
    if (params) {
      return { name, params };
    }
  }
  return null;
}
function renderToolExampleBlock(calls) {
  let b = "<|DSML|tool_calls>\n";
  for (const call2 of calls) {
    b += `  <|DSML|invoke name="${call2.name}">
`;
    b += indentPromptParameters(call2.params, "    ");
    b += "\n  </|DSML|invoke>\n";
  }
  b += "</|DSML|tool_calls>";
  return b;
}
function indentPromptParameters(body, indent) {
  if (body.trim() === "") {
    return indent + `<|DSML|parameter name="content"></|DSML|parameter>`;
  }
  const lines = body.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === "") {
      continue;
    }
    lines[i] = indent + lines[i];
  }
  return lines.join("\n");
}
function wrapParameter(name, inner) {
  return `<|DSML|parameter name="${name}">${inner}</|DSML|parameter>`;
}
function exampleBasicParams(name) {
  switch (name.trim()) {
    case "Read":
      return wrapParameter("file_path", promptCDATA("README.md"));
    case "Glob":
      return wrapParameter("pattern", promptCDATA("**/*.go")) + "\n" + wrapParameter("path", promptCDATA("."));
    case "read_file":
      return wrapParameter("path", promptCDATA("src/main.go"));
    case "list_files":
      return wrapParameter("path", promptCDATA("."));
    case "search_files":
      return wrapParameter("query", promptCDATA("tool call parser"));
    case "Bash":
    case "execute_command":
      return wrapParameter("command", promptCDATA("pwd"));
    case "exec_command":
      return wrapParameter("cmd", promptCDATA("pwd"));
    case "Write":
      return wrapParameter("file_path", promptCDATA("notes.txt")) + "\n" + wrapParameter("content", promptCDATA("Hello world"));
    case "write_to_file":
      return wrapParameter("path", promptCDATA("notes.txt")) + "\n" + wrapParameter("content", promptCDATA("Hello world"));
    case "Edit":
      return wrapParameter("file_path", promptCDATA("README.md")) + "\n" + wrapParameter("old_string", promptCDATA("foo")) + "\n" + wrapParameter("new_string", promptCDATA("bar"));
    case "MultiEdit":
      return wrapParameter("file_path", promptCDATA("README.md")) + `
<|DSML|parameter name="edits"><item><old_string>${promptCDATA("foo")}</old_string><new_string>${promptCDATA("bar")}</new_string></item></|DSML|parameter>`;
  }
  return null;
}
function exampleNestedParams(name) {
  switch (name.trim()) {
    case "MultiEdit":
      return wrapParameter("file_path", promptCDATA("README.md")) + `
<|DSML|parameter name="edits"><item><old_string>${promptCDATA("foo")}</old_string><new_string>${promptCDATA("bar")}</new_string></item></|DSML|parameter>`;
    case "Task":
      return wrapParameter(
        "description",
        promptCDATA("Investigate flaky tests")
      ) + "\n" + wrapParameter(
        "prompt",
        promptCDATA("Run targeted tests and summarize failures")
      );
    case "ask_followup_question":
      return wrapParameter(
        "question",
        promptCDATA("Which approach do you prefer?")
      ) + `
<|DSML|parameter name="follow_up"><item><text>${promptCDATA("Option A")}</text></item><item><text>${promptCDATA("Option B")}</text></item></|DSML|parameter>`;
  }
  return null;
}
function exampleScriptParams(name) {
  const scriptCommand = `cat > /tmp/test_escape.sh <<'EOF'
#!/bin/bash
echo 'single "double"'
echo "literal dollar: \\$HOME"
EOF
bash /tmp/test_escape.sh`;
  const scriptContent = `#!/bin/bash
echo 'single "double"'
echo "literal dollar: $HOME"`;
  switch (name.trim()) {
    case "Bash":
      return wrapParameter("command", promptCDATA(scriptCommand)) + "\n" + wrapParameter("description", promptCDATA("Test shell escaping"));
    case "execute_command":
      return wrapParameter("command", promptCDATA(scriptCommand));
    case "exec_command":
      return wrapParameter("cmd", promptCDATA(scriptCommand));
    case "Write":
      return wrapParameter("file_path", promptCDATA("test_escape.sh")) + "\n" + wrapParameter("content", promptCDATA(scriptContent));
    case "write_to_file":
      return wrapParameter("path", promptCDATA("test_escape.sh")) + "\n" + wrapParameter("content", promptCDATA(scriptContent));
  }
  return null;
}
function promptCDATA(text) {
  if (text === "") {
    return "";
  }
  if (text.includes("]]>")) {
    return "<![CDATA[" + text.split("]]>").join("]]]]><![CDATA[>") + "]]>";
  }
  return "<![CDATA[" + text + "]]>";
}
function hasReadLikeTool(names) {
  for (const name of names) {
    const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (normalized === "read" || normalized === "readfile") return true;
  }
  return false;
}
function normalizeParsedToolCallsForSchemas(calls, toolsRaw) {
  if (!calls || calls.length === 0) return calls;
  const schemas = buildToolSchemaIndex(toolsRaw);
  if (!schemas || Object.keys(schemas).length === 0) return calls;
  let changedAny = false;
  const out = calls.map((call2) => {
    const schema = schemas[call2.Name.toLowerCase().trim()];
    if (!schema || !call2.Input) return call2;
    const { value: normalized, changed } = normalizeToolValueWithSchema(
      call2.Input,
      schema
    );
    if (changed && typeof normalized === "object" && normalized !== null) {
      changedAny = true;
      return { ...call2, Input: normalized };
    }
    return call2;
  });
  return changedAny ? out : calls;
}
function buildToolSchemaIndex(toolsRaw) {
  if (!Array.isArray(toolsRaw)) return {};
  const out = {};
  for (const item of toolsRaw) {
    const { name, schema } = extractToolMeta(item);
    if (name && schema) {
      out[name.toLowerCase()] = schema;
    }
  }
  return out;
}
function extractToolMeta(tool) {
  let name = (tool.name || "").trim();
  let desc = (tool.description || "").trim();
  let schema = tool.parameters || tool.input_schema || tool.inputSchema || tool.schema;
  if (tool.function && typeof tool.function === "object") {
    if (!name) name = (tool.function.name || "").trim();
    if (!desc) desc = (tool.function.description || "").trim();
    schema = schema || tool.function.parameters || tool.function.input_schema || tool.function.inputSchema || tool.function.schema;
  }
  return { name, desc, schema };
}
function normalizeToolValueWithSchema(value, schema) {
  if (value === null || value === void 0 || !schema)
    return { value, changed: false };
  if (shouldCoerceSchemaToString(schema)) {
    return stringifySchemaValue(value);
  }
  if (looksLikeObjectSchema(schema)) {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      return { value, changed: false };
    }
    const properties = schema.properties || {};
    const additional = schema.additionalProperties;
    let changed = false;
    const out = {};
    for (const key in value) {
      const current = value[key];
      let next = current;
      let fieldChanged = false;
      if (properties[key]) {
        ({ value: next, changed: fieldChanged } = normalizeToolValueWithSchema(current, properties[key]));
      } else if (additional) {
        ({ value: next, changed: fieldChanged } = normalizeToolValueWithSchema(current, additional));
      }
      out[key] = next;
      if (fieldChanged) changed = true;
    }
    return { value: changed ? out : value, changed };
  }
  if (looksLikeArraySchema(schema)) {
    if (!Array.isArray(value)) return { value, changed: false };
    const itemsSchema = schema.items;
    if (!itemsSchema) return { value, changed: false };
    let changed = false;
    const out = value.map((item, i) => {
      let itemSchema = itemsSchema;
      if (Array.isArray(itemsSchema)) {
        itemSchema = i < itemsSchema.length ? itemsSchema[i] : null;
      }
      if (!itemSchema) return item;
      const { value: next, changed: itemChanged } = normalizeToolValueWithSchema(item, itemSchema);
      if (itemChanged) changed = true;
      return next;
    });
    return { value: changed ? out : value, changed };
  }
  return { value, changed: false };
}
function shouldCoerceSchemaToString(schema) {
  if (!schema) return false;
  if (typeof schema.const === "string") return true;
  if (Array.isArray(schema.enum) && schema.enum.every((v) => typeof v === "string"))
    return true;
  const type2 = schema.type;
  if (typeof type2 === "string") return type2.toLowerCase() === "string";
  if (Array.isArray(type2)) {
    return type2.some(
      (t) => typeof t === "string" && t.toLowerCase() === "string"
    ) && type2.every(
      (t) => typeof t === "string" && (t.toLowerCase() === "string" || t.toLowerCase() === "null")
    );
  }
  return false;
}
function looksLikeObjectSchema(schema) {
  if (!schema) return false;
  if (schema.type === "object") return true;
  return !!(schema.properties || schema.additionalProperties);
}
function looksLikeArraySchema(schema) {
  if (!schema) return false;
  if (schema.type === "array") return true;
  return !!schema.items;
}
function stringifySchemaValue(value) {
  if (value === null || value === void 0) return { value, changed: false };
  if (typeof value === "string") return { value, changed: false };
  try {
    return { value: JSON.stringify(value), changed: true };
  } catch {
    return { value, changed: false };
  }
}
function createToolSieveState() {
  return {
    pending: "",
    capture: "",
    capturing: false,
    codeFenceStack: [],
    codeFencePendingTicks: 0,
    codeFencePendingTildes: 0,
    codeFenceLineStart: true,
    markdownCodeSpanTicks: 0,
    pendingToolRaw: "",
    pendingToolCalls: [],
    disableDeltas: false,
    toolNameSent: false,
    toolName: "",
    toolArgsStart: -1,
    toolArgsSent: -1,
    toolArgsString: false,
    toolArgsDone: false
  };
}
function resetIncrementalToolState(state2) {
  state2.disableDeltas = false;
  state2.toolNameSent = false;
  state2.toolName = "";
  state2.toolArgsStart = -1;
  state2.toolArgsSent = -1;
  state2.toolArgsString = false;
  state2.toolArgsDone = false;
}
function noteText(state2, text) {
  if (!state2 || !text) return;
  updateMarkdownCodeSpanState(state2, text);
  updateCodeFenceState(state2, text);
}
function updateCodeFenceState(state2, text) {
  const next = simulateCodeFenceState(
    state2.codeFenceStack,
    state2.codeFencePendingTicks,
    state2.codeFencePendingTildes,
    state2.codeFenceLineStart,
    text
  );
  state2.codeFenceStack = next.stack;
  state2.codeFencePendingTicks = next.pendingTicks;
  state2.codeFencePendingTildes = next.pendingTildes;
  state2.codeFenceLineStart = next.lineStart;
}
function simulateCodeFenceState(stack, pendingTicks, pendingTildes, lineStart, text) {
  const nextStack = [...stack];
  let ticks = pendingTicks;
  let tildes = pendingTildes;
  let atLineStart = lineStart;
  const flushPending = () => {
    if (ticks > 0) {
      if (atLineStart && ticks >= 3) applyFenceMarker(nextStack, ticks);
      atLineStart = false;
      ticks = 0;
    }
    if (tildes > 0) {
      if (atLineStart && tildes >= 3) applyFenceMarker(nextStack, -tildes);
      atLineStart = false;
      tildes = 0;
    }
  };
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === "`") {
      if (tildes > 0) flushPending();
      ticks++;
      continue;
    }
    if (ch === "~") {
      if (ticks > 0) flushPending();
      tildes++;
      continue;
    }
    flushPending();
    if (ch === "\n" || ch === "\r") {
      atLineStart = true;
      continue;
    }
    if ((ch === " " || ch === "	") && atLineStart) continue;
    atLineStart = false;
  }
  return {
    stack: nextStack,
    pendingTicks: ticks,
    pendingTildes: tildes,
    lineStart: atLineStart
  };
}
function applyFenceMarker(stack, marker) {
  if (stack.length === 0) {
    stack.push(marker);
    return;
  }
  const top = stack[stack.length - 1];
  const sameType = top > 0 && marker > 0 || top < 0 && marker < 0;
  if (!sameType) {
    stack.push(marker);
    return;
  }
  if (Math.abs(marker) >= Math.abs(top)) {
    stack.pop();
    return;
  }
  stack.push(marker);
}
function updateMarkdownCodeSpanState(state2, text) {
  state2.markdownCodeSpanTicks = simulateMarkdownCodeSpanTicks(state2, state2.markdownCodeSpanTicks, text);
}
function simulateMarkdownCodeSpanTicks(state2, initialTicks, text) {
  let ticks = initialTicks;
  for (let i = 0; i < text.length; ) {
    if (text[i] !== "`") {
      i++;
      continue;
    }
    const run = countBacktickRun(text, i);
    if (ticks === 0) {
      if (run >= 3 && atMarkdownFenceLineStart(text, i)) {
        i += run;
        continue;
      }
      if (state2 && insideCodeFenceWithState(state2, text.slice(0, i))) {
        i += run;
        continue;
      }
      ticks = run;
    } else if (run === ticks) {
      ticks = 0;
    }
    i += run;
  }
  return ticks;
}
function insideCodeFenceWithState(state2, text) {
  const simulated = simulateCodeFenceState(
    state2.codeFenceStack,
    state2.codeFencePendingTicks,
    state2.codeFencePendingTildes,
    state2.codeFenceLineStart,
    text
  );
  return simulated.stack.length > 0;
}
function countBacktickRun(text, start) {
  let count = 0;
  while (start + count < text.length && text[start + count] === "`") count++;
  return count;
}
function atMarkdownFenceLineStart(text, idx) {
  for (let i = idx - 1; i >= 0; i--) {
    const ch = text[i];
    if (ch === " " || ch === "	") continue;
    return ch === "\n" || ch === "\r";
  }
  return true;
}
function toStringSafe(v) {
  if (typeof v === "string") return v.trim();
  if (Array.isArray(v)) return toStringSafe(v[0]);
  if (v == null) return "";
  return String(v).trim();
}
function normalizeFullwidthASCIIChar(ch) {
  if (!ch) return "";
  const code = ch.charCodeAt(0);
  if (code >= 65281 && code <= 65374) {
    return String.fromCharCode(code - 65248);
  }
  if (XML_TAG_START_CHARS.includes(ch)) return "<";
  if (XML_TAG_END_CHARS.includes(ch)) return ">";
  if (ch === "！") return "!";
  if (ch === "／") return "/";
  if (ch === "＝") return "=";
  if (ch === "“" || ch === "”" || ch === "＂") return '"';
  if (ch === "‘" || ch === "’" || ch === "＇") return "'";
  if (ch === "｜") return "|";
  return ch;
}
function normalizeFullwidthASCII(text) {
  let out = "";
  for (const ch of text) {
    out += normalizeFullwidthASCIIChar(ch);
  }
  return out;
}
function isXmlTagStartDelimiter(ch) {
  return XML_TAG_START_CHARS.includes(ch);
}
function isXmlTagEndDelimiter(ch) {
  return XML_TAG_END_CHARS.includes(ch);
}
function scanToolMarkupTagAt$2(text, start) {
  if (start < 0 || start >= text.length || !isXmlTagStartDelimiter(text[start])) {
    return null;
  }
  let i = start + 1;
  while (i < text.length && isXmlTagStartDelimiter(text[i])) {
    i++;
  }
  let closing = false;
  if (i < text.length && (text[i] === "/" || text[i] === "／")) {
    closing = true;
    i++;
  }
  while (i < text.length && isIgnorableToolMarkupChar(text[i])) {
    i++;
  }
  let dsmlLike = false;
  if (text.slice(i).toUpperCase().startsWith("|DSML|")) {
    dsmlLike = true;
    i += 6;
  } else if (text.slice(i).toUpperCase().startsWith("DSML|")) {
    dsmlLike = true;
    i += 5;
  }
  const nameMatch = matchToolMarkupName$1(text, i);
  if (!nameMatch) return null;
  const name = nameMatch.canonical;
  const nameEnd = i + nameMatch.len;
  i = nameEnd;
  let end = -1;
  for (let j = i; j < text.length; j++) {
    if (isXmlTagEndDelimiter(text[j])) {
      end = j;
      break;
    }
    if (isXmlTagStartDelimiter(text[j])) break;
  }
  if (end === -1) return null;
  return {
    name,
    closing,
    start,
    end,
    nameEnd,
    dsmlLike,
    canonical: !dsmlLike,
    selfClosing: text[end - 1] === "/" || text[end - 1] === "／"
  };
}
function isIgnorableToolMarkupChar(ch) {
  return ch === "|" || ch === "｜" || /\s/.test(ch);
}
function matchToolMarkupName$1(text, start) {
  const sub = normalizeFullwidthASCII(
    text.slice(start, start + 20).toLowerCase()
  );
  for (const entry of TOOL_MARKUP_NAMES) {
    if (sub.startsWith(entry.raw)) {
      return { canonical: entry.canonical, len: entry.raw.length };
    }
  }
  return null;
}
function findToolMarkupTag(text, from) {
  for (let i = from; i < text.length; i++) {
    if (isXmlTagStartDelimiter(text[i])) {
      const tag = scanToolMarkupTagAt$2(text, i);
      if (tag) return tag;
    }
  }
  return null;
}
function indexToolCDATAOpen$1(text, from) {
  const sub = text.slice(from);
  const match = sub.match(/(?:<|＜|〈)(?:!|！)\[CDATA\[/i);
  return match && match.index !== void 0 ? from + match.index : -1;
}
function toolCDATAOpenLenAt$1(text, pos) {
  const sub = text.slice(pos);
  const match = sub.match(/^(?:<|＜|〈)(?:!|！)\[CDATA\[/i);
  return match ? match[0].length : 0;
}
function findToolCDATAEnd$1(text, from) {
  for (let i = from; i < text.length; i++) {
    const len = toolCDATACloseLenAt$1(text, i);
    if (len > 0) return i;
  }
  return -1;
}
function toolCDATACloseLenAt$1(text, pos) {
  const sub = text.slice(pos);
  const match = sub.match(/^\]\](?:>|＞|〉)/);
  return match ? match[0].length : 0;
}
function extractStandaloneCDATA$1(text) {
  const openLen = toolCDATAOpenLenAt$1(text, 0);
  if (openLen === 0) return text;
  const endPos = findToolCDATAEnd$1(text, openLen);
  if (endPos === -1) return text.slice(openLen);
  return text.slice(openLen, endPos);
}
function sanitizeLooseCDATA(text) {
  let out = text;
  let pos = 0;
  while (true) {
    const openIdx = indexToolCDATAOpen$1(out, pos);
    if (openIdx === -1) break;
    const openLen = toolCDATAOpenLenAt$1(out, openIdx);
    const endIdx = findToolCDATAEnd$1(out, openIdx + openLen);
    if (endIdx === -1) {
      out += "]]>";
      break;
    }
    pos = endIdx + toolCDATACloseLenAt$1(out, endIdx);
  }
  return out;
}
function preservesCDATAStringParameter$1(name) {
  const n = name.toLowerCase();
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
  ].includes(n);
}
function parseTagAttributes(attrStr) {
  const out = {};
  const pattern = /\b([a-z0-9_:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
  let match;
  while ((match = pattern.exec(attrStr)) !== null) {
    out[match[1]] = match[2] || match[3] || "";
  }
  return out;
}
function findXmlElementBlocks(text, tagName) {
  const out = [];
  let pos = 0;
  while (pos < text.length) {
    const tag = findToolMarkupTag(text, pos);
    if (!tag || tag.closing || tag.name !== tagName) {
      pos++;
      continue;
    }
    const closeTag = findMatchingCloseTag(text, tag);
    if (!closeTag) {
      pos = tag.end + 1;
      continue;
    }
    out.push({
      attrs: text.slice(tag.nameEnd, tag.end),
      body: text.slice(tag.end + 1, closeTag.start),
      start: tag.start,
      end: closeTag.end + 1
    });
    pos = closeTag.end + 1;
  }
  return out;
}
function findMatchingCloseTag(text, openTag) {
  let depth = 1;
  let pos = openTag.end + 1;
  while (pos < text.length) {
    const tag = findToolMarkupTag(text, pos);
    if (!tag || tag.name !== openTag.name) {
      pos++;
      continue;
    }
    if (tag.closing) {
      depth--;
      if (depth === 0) return tag;
    } else {
      depth++;
    }
    pos = tag.end + 1;
  }
  return null;
}
function parseMarkupSingleToolCall(block) {
  const attrs = parseTagAttributes(block.attrs);
  const name = toStringSafe(attrs.name);
  if (!name) return null;
  const input = {};
  const paramBlocks = findXmlElementBlocks(block.body, "parameter");
  for (const pb of paramBlocks) {
    const pAttrs = parseTagAttributes(pb.attrs);
    const pName = toStringSafe(pAttrs.name);
    if (!pName) continue;
    let value = pb.body.trim();
    if (preservesCDATAStringParameter$1(pName)) {
      value = extractStandaloneCDATA$1(sanitizeLooseCDATA(value));
    } else {
      try {
        const decoded = JSON.parse(value);
        if (decoded !== null && typeof decoded === "object") value = decoded;
      } catch {
        value = extractStandaloneCDATA$1(value);
      }
    }
    input[pName] = value;
  }
  return { name, input };
}
function stripFencedCodeBlocks$1(text) {
  const lines = text.split("\n");
  const out = [];
  let inFence = false;
  let fenceChar = "";
  let fenceLen = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!inFence) {
      if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
        inFence = true;
        fenceChar = trimmed[0];
        fenceLen = countLeadingChars(trimmed, fenceChar);
        continue;
      }
      out.push(line);
    } else {
      if (trimmed.startsWith(fenceChar) && countLeadingChars(trimmed, fenceChar) >= fenceLen) {
        inFence = false;
        continue;
      }
    }
  }
  return out.join("\n");
}
function countLeadingChars(text, ch) {
  let count = 0;
  while (count < text.length && text[count] === ch) count++;
  return count;
}
function normalizeDSMLToolCallMarkup$1(text) {
  let out = "";
  const state2 = createToolSieveState();
  for (let i = 0; i < text.length; ) {
    if (insideCodeFenceWithState(state2, text.slice(0, i))) {
      out += text[i];
      i++;
      continue;
    }
    const tag = scanToolMarkupTagAt$2(text, i);
    if (tag) {
      out += `<${tag.closing ? "/" : ""}${tag.name}${text.slice(tag.nameEnd, tag.end)}>`;
      i = tag.end + 1;
      continue;
    }
    out += text[i];
    i++;
  }
  return out;
}
function parseToolCalls(text) {
  const result = {
    calls: [],
    sawToolCallSyntax: false,
    rejectedByPolicy: false,
    rejectedToolNames: []
  };
  const raw = toStringSafe(text);
  if (!raw) return result;
  const cleaned = stripFencedCodeBlocks$1(raw);
  const normalized = normalizeDSMLToolCallMarkup$1(cleaned);
  const wrappers = findXmlElementBlocks(normalized, "tool_calls");
  if (wrappers.length > 0) result.sawToolCallSyntax = true;
  for (const wrapper of wrappers) {
    const calls = findXmlElementBlocks(wrapper.body, "invoke");
    for (const callBlock of calls) {
      const parsed = parseMarkupSingleToolCall(callBlock);
      if (parsed) result.calls.push(parsed);
    }
  }
  return result;
}
function canonicalizeToolCallCandidateSpans(text) {
  if (!text) return "";
  let out = "";
  for (let i = 0; i < text.length; ) {
    const { next, advanced, blocked } = skipXMLIgnoredSection(text, i);
    if (blocked) {
      out += text.slice(i);
      break;
    }
    if (advanced) {
      out += text.slice(i, next);
      i = next;
      continue;
    }
    const codeEnd = markdownCodeSpanEnd$1(text, i);
    if (codeEnd !== -1) {
      out += text.slice(i, codeEnd);
      i = codeEnd;
      continue;
    }
    const tag = scanToolMarkupTagAt$1(text, i);
    if (!tag) {
      out += text[i];
      i++;
      continue;
    }
    out += canonicalizeRecognizedToolMarkupTag(
      text.slice(tag.Start, tag.End + 1),
      tag
    );
    i = tag.End + 1;
  }
  return out;
}
function skipXMLIgnoredSection(text, idx) {
  if (text.startsWith("<![CDATA[", idx)) {
    const end = text.indexOf("]]>", idx + 9);
    if (end === -1)
      return { next: text.length, advanced: true, blocked: true };
    return { next: end + 3, advanced: true, blocked: false };
  }
  if (text.startsWith("<!--", idx)) {
    const end = text.indexOf("-->", idx + 4);
    if (end === -1)
      return { next: text.length, advanced: true, blocked: true };
    return { next: end + 3, advanced: true, blocked: false };
  }
  return { next: idx, advanced: false, blocked: false };
}
function markdownCodeSpanEnd$1(text, idx) {
  if (text[idx] !== "`") return -1;
  let count = 0;
  while (idx + count < text.length && text[idx + count] === "`") count++;
  const fence = text.slice(idx, idx + count);
  const end = text.indexOf(fence, idx + count);
  if (end === -1) return -1;
  return end + count;
}
function scanToolMarkupTagAt$1(text, idx) {
  const startLen = xmlTagStartDelimiterLenAt(text, idx);
  if (startLen === 0) return null;
  let pos = idx + startLen;
  pos = skipToolMarkupIgnorables(text, pos);
  let closing = false;
  const { next: afterSlash, ok: hasSlash } = consumeToolMarkupClosingSlash(
    text,
    pos
  );
  if (hasSlash) {
    closing = true;
    pos = afterSlash;
  }
  pos = skipToolMarkupIgnorables(text, pos);
  let dsmlLike = false;
  if (text.startsWith("|DSML|", pos)) {
    dsmlLike = true;
    pos += 6;
  }
  for (const entry of TOOL_MARKUP_NAMES) {
    const { next: afterName, ok: nameMatch } = consumeToolKeyword(
      text,
      pos,
      entry.raw
    );
    if (nameMatch) {
      let endPos = afterName;
      let selfClosing = false;
      while (endPos < text.length) {
        const endLen = xmlTagEndDelimiterLenAt(text, endPos);
        if (endLen > 0) {
          return {
            Name: entry.canonical,
            Start: idx,
            End: endPos + endLen - 1,
            NameStart: pos,
            NameEnd: afterName,
            Closing: closing,
            SelfClosing: selfClosing,
            DSMLLike: dsmlLike,
            Canonical: !dsmlLike
          };
        }
        const { next: nextAfterSlash, ok: scSlash } = consumeToolMarkupClosingSlash(text, endPos);
        if (scSlash) {
          selfClosing = true;
          endPos = nextAfterSlash;
          continue;
        }
        endPos++;
      }
    }
  }
  return null;
}
function canonicalizeRecognizedToolMarkupTag(raw, tag) {
  let idx = 0;
  const startDelim = xmlTagStartDelimiterLenAt(raw, idx);
  idx += startDelim;
  while (idx < raw.length) {
    idx = skipToolMarkupIgnorables(raw, idx);
    const d = xmlTagStartDelimiterLenAt(raw, idx);
    if (d > 0) {
      idx += d;
      continue;
    }
    break;
  }
  idx = skipToolMarkupIgnorables(raw, idx);
  if (tag.Closing) {
    const { next } = consumeToolMarkupClosingSlash(raw, idx);
    idx = next;
  }
  if (raw.startsWith("|DSML|", idx)) idx += 6;
  const { next: afterName } = consumeToolKeyword(raw, idx, rawNameForTag(tag));
  const attrs = parseCanonicalToolMarkupAttrs(raw, afterName);
  let out = "<" + (tag.Closing ? "/" : "") + (tag.DSMLLike ? "|DSML|" : "") + tag.Name;
  for (const attr of attrs) {
    out += ` ${attr.Key}="${attr.Value.replace(/"/g, "&quot;")}"`;
  }
  out += (tag.SelfClosing ? "/" : "") + ">";
  return out;
}
function rawNameForTag(tag) {
  var _a;
  return ((_a = TOOL_MARKUP_NAMES.find((n) => n.canonical === tag.Name)) == null ? void 0 : _a.raw) || tag.Name;
}
function parseCanonicalToolMarkupAttrs(raw, idx) {
  const out = [];
  while (idx < raw.length) {
    idx = skipToolMarkupIgnorables(raw, idx);
    if (xmlTagEndDelimiterLenAt(raw, idx) > 0) break;
    const { next: pNext, ok: hasPipe } = consumeToolMarkupPipe(raw, idx);
    if (hasPipe) {
      idx = pNext;
      continue;
    }
    const { next: sNext, ok: hasSlash } = consumeToolMarkupClosingSlash(
      raw,
      idx
    );
    if (hasSlash) {
      idx = sNext;
      continue;
    }
    const keyStart = idx;
    while (idx < raw.length) {
      if (toolMarkupWhitespaceLikeLenAt(raw, idx) > 0) break;
      if (toolMarkupEqualsLenAt(raw, idx) > 0) break;
      if (xmlTagEndDelimiterLenAt(raw, idx) > 0) break;
      idx++;
    }
    const key = raw.slice(keyStart, idx).trim();
    if (!key) {
      idx++;
      continue;
    }
    idx = skipToolMarkupIgnorables(raw, idx);
    const eqLen = toolMarkupEqualsLenAt(raw, idx);
    if (eqLen === 0) continue;
    idx += eqLen;
    idx = skipToolMarkupIgnorables(raw, idx);
    const { quote, quoteLen } = xmlQuotePairAt(raw, idx);
    let value = "";
    if (quoteLen > 0) {
      idx += quoteLen;
      const vStart = idx;
      while (idx < raw.length) {
        if (raw.startsWith(quote, idx)) {
          value = raw.slice(vStart, idx);
          idx += quote.length;
          break;
        }
        idx++;
      }
    } else {
      const vStart = idx;
      while (idx < raw.length) {
        if (toolMarkupWhitespaceLikeLenAt(raw, idx) > 0 || xmlTagEndDelimiterLenAt(raw, idx) > 0)
          break;
        idx++;
      }
      value = raw.slice(vStart, idx);
    }
    if (key.toLowerCase().includes("name")) {
      out.push({ Key: "name", Value: value });
    }
  }
  return out;
}
function skipToolMarkupIgnorables(text, idx) {
  while (idx < text.length) {
    const code = text.charCodeAt(idx);
    if (code >= 8203 && code <= 8207 || code >= 8234 && code <= 8238 || code < 32 && ![9, 10, 13].includes(code)) {
      idx++;
      continue;
    }
    break;
  }
  return idx;
}
function toolMarkupWhitespaceLikeLenAt(text, idx) {
  const ch = text[idx];
  if ([" ", "	", "\n", "\r"].includes(ch)) return 1;
  if (text.startsWith("▁", idx)) return 1;
  return 0;
}
function toolMarkupEqualsLenAt(text, idx) {
  const ch = text[idx];
  if (TOOL_MARKUP_EQUALS_CHARS.includes(ch)) return ch.length;
  return 0;
}
function xmlTagStartDelimiterLenAt(text, idx) {
  const ch = text[idx];
  if (XML_TAG_START_CHARS.includes(ch)) return ch.length;
  return 0;
}
function xmlTagEndDelimiterLenAt(text, idx) {
  const ch = text[idx];
  if (XML_TAG_END_CHARS.includes(ch)) return ch.length;
  return 0;
}
function consumeToolMarkupClosingSlash(text, idx) {
  const ch = text[idx];
  if (TOOL_MARKUP_SLASH_CHARS.includes(ch))
    return { next: idx + ch.length, ok: true };
  return { next: idx, ok: false };
}
function consumeToolMarkupPipe(text, idx) {
  const ch = text[idx];
  if (TOOL_MARKUP_PIPE_CHARS.includes(ch))
    return { next: idx + ch.length, ok: true };
  return { next: idx, ok: false };
}
function xmlQuotePairAt(text, idx) {
  const ch = text[idx];
  if (XML_QUOTE_PAIRS[ch]) return { quote: XML_QUOTE_PAIRS[ch], quoteLen: ch.length };
  return { quote: "", quoteLen: 0 };
}
function foldToolKeywordRune(r) {
  const code = r.charCodeAt(0);
  let normalized = r.toLowerCase();
  if (code >= 65313 && code <= 65338)
    normalized = String.fromCharCode(code - 65248).toLowerCase();
  else if (code >= 65345 && code <= 65370)
    normalized = String.fromCharCode(code - 65248);
  return TOOL_KEYWORD_FOLD_MAP[normalized] || (/[a-z0-9]/.test(normalized) ? normalized : null);
}
function consumeToolKeyword(text, idx, keyword) {
  let next = idx;
  for (let i = 0; i < keyword.length; i++) {
    next = skipToolMarkupIgnorables(text, next);
    if (next >= text.length) return { next: idx, ok: false };
    const target = keyword[i].toLowerCase();
    const ch = text[next];
    if (target === "_" || target === "-") {
      if (TOOL_MARKUP_DASH_CHARS.includes(ch)) {
        next++;
        continue;
      }
      return { next: idx, ok: false };
    }
    if (foldToolKeywordRune(ch) !== target) return { next: idx, ok: false };
    next++;
  }
  return { next, ok: true };
}
function containsToolMarkupSyntaxOutsideIgnored(text) {
  let hasDSML = false;
  let hasCanonical = false;
  for (let i = 0; i < text.length; ) {
    const { next, advanced, blocked } = skipXMLIgnoredSection(text, i);
    if (blocked) break;
    if (advanced) {
      i = next;
      continue;
    }
    const codeEnd = markdownCodeSpanEnd(text, i);
    if (codeEnd !== -1) {
      i = codeEnd;
      continue;
    }
    const tag = scanToolMarkupTagAt(text, i);
    if (tag) {
      if (tag.DSMLLike) hasDSML = true;
      else hasCanonical = true;
      if (hasDSML && hasCanonical)
        return { hasDSML: true, hasCanonical: true };
      i = tag.End + 1;
      continue;
    }
    i++;
  }
  return { hasDSML, hasCanonical };
}
function findToolMarkupTagOutsideIgnored(text, start) {
  for (let i = Math.max(start, 0); i < text.length; ) {
    const { next, advanced, blocked } = skipXMLIgnoredSection(text, i);
    if (blocked) break;
    if (advanced) {
      i = next;
      continue;
    }
    const codeEnd = markdownCodeSpanEnd(text, i);
    if (codeEnd !== -1) {
      i = codeEnd;
      continue;
    }
    const tag = scanToolMarkupTagAt(text, i);
    if (tag) return tag;
    i++;
  }
  return null;
}
function findMatchingToolMarkupClose(text, open) {
  if (!text || !open.Name || open.Closing || open.End >= text.length)
    return null;
  let depth = 1;
  let pos = open.End + 1;
  while (pos < text.length) {
    const tag = findToolMarkupTagOutsideIgnored(text, pos);
    if (!tag) return null;
    if (tag.Name !== open.Name) {
      pos = tag.End + 1;
      continue;
    }
    if (tag.Closing) {
      depth--;
      if (depth === 0) return tag;
    } else if (!tag.SelfClosing) {
      depth++;
    }
    pos = tag.End + 1;
  }
  return null;
}
function scanToolMarkupTagAt(text, start) {
  const startLen = xmlTagStartDelimiterLenAt(text, start);
  if (startLen === 0) return null;
  let i = start + startLen;
  while (true) {
    const nextLen = xmlTagStartDelimiterLenAt(text, i);
    if (nextLen === 0) break;
    i += nextLen;
  }
  let closing = false;
  const slashRes = consumeToolMarkupClosingSlash(text, i);
  if (slashRes.ok) {
    closing = true;
    i = slashRes.next;
  }
  const prefixStart = i;
  const { next: afterPrefix, dsmlLike } = consumeToolMarkupNamePrefix(text, i);
  i = afterPrefix;
  let { name, nameLen } = matchToolMarkupName(text, i, dsmlLike);
  let finalDsmlLike = dsmlLike;
  if (nameLen === 0) {
    const fallback = matchToolMarkupNameAfterArbitraryPrefix(
      text,
      prefixStart
    );
    if (!fallback) return null;
    name = fallback.name;
    i = fallback.start;
    nameLen = fallback.len;
    finalDsmlLike = true;
  }
  const nameEnd = i + nameLen;
  const end = findXmlTagEnd(text, nameEnd);
  if (end === -1) return null;
  const tagText = text.slice(start, end + 1).trim();
  return {
    Start: start,
    End: end,
    NameStart: i,
    NameEnd: nameEnd,
    Name: name,
    Closing: closing,
    SelfClosing: tagText.endsWith("/>") || tagText.endsWith("/＞") || tagText.endsWith("/〉"),
    DSMLLike: finalDsmlLike,
    Canonical: !finalDsmlLike
  };
}
function consumeToolMarkupNamePrefix(text, idx) {
  let dsmlLike = false;
  let current = idx;
  while (true) {
    const next = skipToolMarkupIgnorables(text, current);
    const { next: afterKeyword, ok } = consumeToolKeyword(text, next, "dsml");
    if (ok) {
      current = afterKeyword;
      if (text[current] === "-" || text[current] === "_") current++;
      dsmlLike = true;
      continue;
    }
    break;
  }
  return { next: current, dsmlLike };
}
function matchToolMarkupName(text, start, dsmlLike) {
  for (const entry of TOOL_MARKUP_NAMES) {
    if (entry.dsmlOnly && !dsmlLike) continue;
    const { next, ok } = consumeToolKeyword(text, start, entry.raw);
    if (ok) return { name: entry.canonical, nameLen: next - start };
  }
  return { name: "", nameLen: 0 };
}
function matchToolMarkupNameAfterArbitraryPrefix(text, start) {
  for (let idx = start; idx < text.length; idx++) {
    if (isToolMarkupTagTerminator(text[idx])) break;
    for (const entry of TOOL_MARKUP_NAMES) {
      const { next, ok } = consumeToolKeyword(text, idx, entry.raw);
      if (ok) return { name: entry.canonical, start: idx, len: next - idx };
    }
  }
  return null;
}
function isToolMarkupTagTerminator(ch) {
  return ch === ">" || ch === "＞" || ch === "﹥" || ch === "〉";
}
function findXmlTagEnd(text, start) {
  for (let i = start; i < text.length; i++) {
    const endLen = xmlTagEndDelimiterLenAt(text, i);
    if (endLen > 0) return i + endLen - 1;
  }
  return -1;
}
function markdownCodeSpanEnd(text, idx) {
  if (text[idx] !== "`") return -1;
  let count = 0;
  while (idx + count < text.length && text[idx + count] === "`") count++;
  const fence = text.slice(idx, idx + count);
  const end = text.indexOf(fence, idx + count);
  if (end === -1) return -1;
  return end + count;
}
function normalizeDSMLToolCallMarkup(text) {
  if (!text) return { text: "", ok: true };
  const canonicalized = canonicalizeToolCallCandidateSpans(text);
  const { hasDSML, hasCanonical } = containsToolMarkupSyntaxOutsideIgnored(canonicalized);
  if (!hasDSML && !hasCanonical) {
    return { text: canonicalized, ok: true };
  }
  return { text: rewriteDSMLToolMarkupOutsideIgnored(canonicalized), ok: true };
}
function rewriteDSMLToolMarkupOutsideIgnored(text) {
  if (!text) return "";
  let out = "";
  for (let i = 0; i < text.length; ) {
    const { next, advanced, blocked } = skipXMLIgnoredSection(text, i);
    if (blocked) {
      out += text.slice(i);
      break;
    }
    if (advanced) {
      out += text.slice(i, next);
      i = next;
      continue;
    }
    const codeEnd = markdownCodeSpanEndAt(text, i);
    if (codeEnd !== -1) {
      out += text.slice(i, codeEnd);
      i = codeEnd;
      continue;
    }
    const tag = scanToolMarkupTagAt(text, i);
    if (!tag) {
      out += text[i];
      i++;
      continue;
    }
    out += "<" + (tag.Closing ? "/" : "") + tag.Name + text.slice(tag.NameEnd, tag.End) + ">";
    i = tag.End + 1;
  }
  return out;
}
function markdownCodeSpanEndAt(text, idx) {
  if (text[idx] !== "`") return -1;
  let count = 0;
  while (idx + count < text.length && text[idx + count] === "`") count++;
  const fence = text.slice(idx, idx + count);
  const end = text.indexOf(fence, idx + count);
  if (end === -1) return -1;
  return end + count;
}
var __assign$1 = function() {
  __assign$1 = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
        t[p] = s[p];
    }
    return t;
  };
  return __assign$1.apply(this, arguments);
};
var pairDivider = "~";
var blockDivider = "~~";
function generateNamedReferences(input, prev) {
  var entities = {};
  var characters = {};
  var blocks = input.split(blockDivider);
  var isOptionalBlock = false;
  for (var i = 0; blocks.length > i; i++) {
    var entries = blocks[i].split(pairDivider);
    for (var j = 0; j < entries.length; j += 2) {
      var entity = entries[j];
      var character = entries[j + 1];
      var fullEntity = "&" + entity + ";";
      entities[fullEntity] = character;
      if (isOptionalBlock) {
        entities["&" + entity] = character;
      }
      characters[character] = fullEntity;
    }
    isOptionalBlock = true;
  }
  return prev ? { entities: __assign$1(__assign$1({}, entities), prev.entities), characters: __assign$1(__assign$1({}, characters), prev.characters) } : { entities, characters };
}
var bodyRegExps = {
  xml: /&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g,
  html4: /&notin;|&(?:nbsp|iexcl|cent|pound|curren|yen|brvbar|sect|uml|copy|ordf|laquo|not|shy|reg|macr|deg|plusmn|sup2|sup3|acute|micro|para|middot|cedil|sup1|ordm|raquo|frac14|frac12|frac34|iquest|Agrave|Aacute|Acirc|Atilde|Auml|Aring|AElig|Ccedil|Egrave|Eacute|Ecirc|Euml|Igrave|Iacute|Icirc|Iuml|ETH|Ntilde|Ograve|Oacute|Ocirc|Otilde|Ouml|times|Oslash|Ugrave|Uacute|Ucirc|Uuml|Yacute|THORN|szlig|agrave|aacute|acirc|atilde|auml|aring|aelig|ccedil|egrave|eacute|ecirc|euml|igrave|iacute|icirc|iuml|eth|ntilde|ograve|oacute|ocirc|otilde|ouml|divide|oslash|ugrave|uacute|ucirc|uuml|yacute|thorn|yuml|quot|amp|lt|gt|#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g,
  html5: /&centerdot;|&copysr;|&divideontimes;|&gtcc;|&gtcir;|&gtdot;|&gtlPar;|&gtquest;|&gtrapprox;|&gtrarr;|&gtrdot;|&gtreqless;|&gtreqqless;|&gtrless;|&gtrsim;|&ltcc;|&ltcir;|&ltdot;|&lthree;|&ltimes;|&ltlarr;|&ltquest;|&ltrPar;|&ltri;|&ltrie;|&ltrif;|&notin;|&notinE;|&notindot;|&notinva;|&notinvb;|&notinvc;|&notni;|&notniva;|&notnivb;|&notnivc;|&parallel;|&timesb;|&timesbar;|&timesd;|&(?:AElig|AMP|Aacute|Acirc|Agrave|Aring|Atilde|Auml|COPY|Ccedil|ETH|Eacute|Ecirc|Egrave|Euml|GT|Iacute|Icirc|Igrave|Iuml|LT|Ntilde|Oacute|Ocirc|Ograve|Oslash|Otilde|Ouml|QUOT|REG|THORN|Uacute|Ucirc|Ugrave|Uuml|Yacute|aacute|acirc|acute|aelig|agrave|amp|aring|atilde|auml|brvbar|ccedil|cedil|cent|copy|curren|deg|divide|eacute|ecirc|egrave|eth|euml|frac12|frac14|frac34|gt|iacute|icirc|iexcl|igrave|iquest|iuml|laquo|lt|macr|micro|middot|nbsp|not|ntilde|oacute|ocirc|ograve|ordf|ordm|oslash|otilde|ouml|para|plusmn|pound|quot|raquo|reg|sect|shy|sup1|sup2|sup3|szlig|thorn|times|uacute|ucirc|ugrave|uml|uuml|yacute|yen|yuml|#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g
};
var namedReferences = {};
namedReferences["xml"] = generateNamedReferences(`lt~<~gt~>~quot~"~apos~'~amp~&`);
namedReferences["html4"] = generateNamedReferences(`apos~'~OElig~Œ~oelig~œ~Scaron~Š~scaron~š~Yuml~Ÿ~circ~ˆ~tilde~˜~ensp~ ~emsp~ ~thinsp~ ~zwnj~‌~zwj~‍~lrm~‎~rlm~‏~ndash~–~mdash~—~lsquo~‘~rsquo~’~sbquo~‚~ldquo~“~rdquo~”~bdquo~„~dagger~†~Dagger~‡~permil~‰~lsaquo~‹~rsaquo~›~euro~€~fnof~ƒ~Alpha~Α~Beta~Β~Gamma~Γ~Delta~Δ~Epsilon~Ε~Zeta~Ζ~Eta~Η~Theta~Θ~Iota~Ι~Kappa~Κ~Lambda~Λ~Mu~Μ~Nu~Ν~Xi~Ξ~Omicron~Ο~Pi~Π~Rho~Ρ~Sigma~Σ~Tau~Τ~Upsilon~Υ~Phi~Φ~Chi~Χ~Psi~Ψ~Omega~Ω~alpha~α~beta~β~gamma~γ~delta~δ~epsilon~ε~zeta~ζ~eta~η~theta~θ~iota~ι~kappa~κ~lambda~λ~mu~μ~nu~ν~xi~ξ~omicron~ο~pi~π~rho~ρ~sigmaf~ς~sigma~σ~tau~τ~upsilon~υ~phi~φ~chi~χ~psi~ψ~omega~ω~thetasym~ϑ~upsih~ϒ~piv~ϖ~bull~•~hellip~…~prime~′~Prime~″~oline~‾~frasl~⁄~weierp~℘~image~ℑ~real~ℜ~trade~™~alefsym~ℵ~larr~←~uarr~↑~rarr~→~darr~↓~harr~↔~crarr~↵~lArr~⇐~uArr~⇑~rArr~⇒~dArr~⇓~hArr~⇔~forall~∀~part~∂~exist~∃~empty~∅~nabla~∇~isin~∈~notin~∉~ni~∋~prod~∏~sum~∑~minus~−~lowast~∗~radic~√~prop~∝~infin~∞~ang~∠~and~∧~or~∨~cap~∩~cup~∪~int~∫~there4~∴~sim~∼~cong~≅~asymp~≈~ne~≠~equiv~≡~le~≤~ge~≥~sub~⊂~sup~⊃~nsub~⊄~sube~⊆~supe~⊇~oplus~⊕~otimes~⊗~perp~⊥~sdot~⋅~lceil~⌈~rceil~⌉~lfloor~⌊~rfloor~⌋~lang~〈~rang~〉~loz~◊~spades~♠~clubs~♣~hearts~♥~diams~♦~~nbsp~ ~iexcl~¡~cent~¢~pound~£~curren~¤~yen~¥~brvbar~¦~sect~§~uml~¨~copy~©~ordf~ª~laquo~«~not~¬~shy~­~reg~®~macr~¯~deg~°~plusmn~±~sup2~²~sup3~³~acute~´~micro~µ~para~¶~middot~·~cedil~¸~sup1~¹~ordm~º~raquo~»~frac14~¼~frac12~½~frac34~¾~iquest~¿~Agrave~À~Aacute~Á~Acirc~Â~Atilde~Ã~Auml~Ä~Aring~Å~AElig~Æ~Ccedil~Ç~Egrave~È~Eacute~É~Ecirc~Ê~Euml~Ë~Igrave~Ì~Iacute~Í~Icirc~Î~Iuml~Ï~ETH~Ð~Ntilde~Ñ~Ograve~Ò~Oacute~Ó~Ocirc~Ô~Otilde~Õ~Ouml~Ö~times~×~Oslash~Ø~Ugrave~Ù~Uacute~Ú~Ucirc~Û~Uuml~Ü~Yacute~Ý~THORN~Þ~szlig~ß~agrave~à~aacute~á~acirc~â~atilde~ã~auml~ä~aring~å~aelig~æ~ccedil~ç~egrave~è~eacute~é~ecirc~ê~euml~ë~igrave~ì~iacute~í~icirc~î~iuml~ï~eth~ð~ntilde~ñ~ograve~ò~oacute~ó~ocirc~ô~otilde~õ~ouml~ö~divide~÷~oslash~ø~ugrave~ù~uacute~ú~ucirc~û~uuml~ü~yacute~ý~thorn~þ~yuml~ÿ~quot~"~amp~&~lt~<~gt~>`);
namedReferences["html5"] = generateNamedReferences('Abreve~Ă~Acy~А~Afr~𝔄~Amacr~Ā~And~⩓~Aogon~Ą~Aopf~𝔸~ApplyFunction~⁡~Ascr~𝒜~Assign~≔~Backslash~∖~Barv~⫧~Barwed~⌆~Bcy~Б~Because~∵~Bernoullis~ℬ~Bfr~𝔅~Bopf~𝔹~Breve~˘~Bscr~ℬ~Bumpeq~≎~CHcy~Ч~Cacute~Ć~Cap~⋒~CapitalDifferentialD~ⅅ~Cayleys~ℭ~Ccaron~Č~Ccirc~Ĉ~Cconint~∰~Cdot~Ċ~Cedilla~¸~CenterDot~·~Cfr~ℭ~CircleDot~⊙~CircleMinus~⊖~CirclePlus~⊕~CircleTimes~⊗~ClockwiseContourIntegral~∲~CloseCurlyDoubleQuote~”~CloseCurlyQuote~’~Colon~∷~Colone~⩴~Congruent~≡~Conint~∯~ContourIntegral~∮~Copf~ℂ~Coproduct~∐~CounterClockwiseContourIntegral~∳~Cross~⨯~Cscr~𝒞~Cup~⋓~CupCap~≍~DD~ⅅ~DDotrahd~⤑~DJcy~Ђ~DScy~Ѕ~DZcy~Џ~Darr~↡~Dashv~⫤~Dcaron~Ď~Dcy~Д~Del~∇~Dfr~𝔇~DiacriticalAcute~´~DiacriticalDot~˙~DiacriticalDoubleAcute~˝~DiacriticalGrave~`~DiacriticalTilde~˜~Diamond~⋄~DifferentialD~ⅆ~Dopf~𝔻~Dot~¨~DotDot~⃜~DotEqual~≐~DoubleContourIntegral~∯~DoubleDot~¨~DoubleDownArrow~⇓~DoubleLeftArrow~⇐~DoubleLeftRightArrow~⇔~DoubleLeftTee~⫤~DoubleLongLeftArrow~⟸~DoubleLongLeftRightArrow~⟺~DoubleLongRightArrow~⟹~DoubleRightArrow~⇒~DoubleRightTee~⊨~DoubleUpArrow~⇑~DoubleUpDownArrow~⇕~DoubleVerticalBar~∥~DownArrow~↓~DownArrowBar~⤓~DownArrowUpArrow~⇵~DownBreve~̑~DownLeftRightVector~⥐~DownLeftTeeVector~⥞~DownLeftVector~↽~DownLeftVectorBar~⥖~DownRightTeeVector~⥟~DownRightVector~⇁~DownRightVectorBar~⥗~DownTee~⊤~DownTeeArrow~↧~Downarrow~⇓~Dscr~𝒟~Dstrok~Đ~ENG~Ŋ~Ecaron~Ě~Ecy~Э~Edot~Ė~Efr~𝔈~Element~∈~Emacr~Ē~EmptySmallSquare~◻~EmptyVerySmallSquare~▫~Eogon~Ę~Eopf~𝔼~Equal~⩵~EqualTilde~≂~Equilibrium~⇌~Escr~ℰ~Esim~⩳~Exists~∃~ExponentialE~ⅇ~Fcy~Ф~Ffr~𝔉~FilledSmallSquare~◼~FilledVerySmallSquare~▪~Fopf~𝔽~ForAll~∀~Fouriertrf~ℱ~Fscr~ℱ~GJcy~Ѓ~Gammad~Ϝ~Gbreve~Ğ~Gcedil~Ģ~Gcirc~Ĝ~Gcy~Г~Gdot~Ġ~Gfr~𝔊~Gg~⋙~Gopf~𝔾~GreaterEqual~≥~GreaterEqualLess~⋛~GreaterFullEqual~≧~GreaterGreater~⪢~GreaterLess~≷~GreaterSlantEqual~⩾~GreaterTilde~≳~Gscr~𝒢~Gt~≫~HARDcy~Ъ~Hacek~ˇ~Hat~^~Hcirc~Ĥ~Hfr~ℌ~HilbertSpace~ℋ~Hopf~ℍ~HorizontalLine~─~Hscr~ℋ~Hstrok~Ħ~HumpDownHump~≎~HumpEqual~≏~IEcy~Е~IJlig~Ĳ~IOcy~Ё~Icy~И~Idot~İ~Ifr~ℑ~Im~ℑ~Imacr~Ī~ImaginaryI~ⅈ~Implies~⇒~Int~∬~Integral~∫~Intersection~⋂~InvisibleComma~⁣~InvisibleTimes~⁢~Iogon~Į~Iopf~𝕀~Iscr~ℐ~Itilde~Ĩ~Iukcy~І~Jcirc~Ĵ~Jcy~Й~Jfr~𝔍~Jopf~𝕁~Jscr~𝒥~Jsercy~Ј~Jukcy~Є~KHcy~Х~KJcy~Ќ~Kcedil~Ķ~Kcy~К~Kfr~𝔎~Kopf~𝕂~Kscr~𝒦~LJcy~Љ~Lacute~Ĺ~Lang~⟪~Laplacetrf~ℒ~Larr~↞~Lcaron~Ľ~Lcedil~Ļ~Lcy~Л~LeftAngleBracket~⟨~LeftArrow~←~LeftArrowBar~⇤~LeftArrowRightArrow~⇆~LeftCeiling~⌈~LeftDoubleBracket~⟦~LeftDownTeeVector~⥡~LeftDownVector~⇃~LeftDownVectorBar~⥙~LeftFloor~⌊~LeftRightArrow~↔~LeftRightVector~⥎~LeftTee~⊣~LeftTeeArrow~↤~LeftTeeVector~⥚~LeftTriangle~⊲~LeftTriangleBar~⧏~LeftTriangleEqual~⊴~LeftUpDownVector~⥑~LeftUpTeeVector~⥠~LeftUpVector~↿~LeftUpVectorBar~⥘~LeftVector~↼~LeftVectorBar~⥒~Leftarrow~⇐~Leftrightarrow~⇔~LessEqualGreater~⋚~LessFullEqual~≦~LessGreater~≶~LessLess~⪡~LessSlantEqual~⩽~LessTilde~≲~Lfr~𝔏~Ll~⋘~Lleftarrow~⇚~Lmidot~Ŀ~LongLeftArrow~⟵~LongLeftRightArrow~⟷~LongRightArrow~⟶~Longleftarrow~⟸~Longleftrightarrow~⟺~Longrightarrow~⟹~Lopf~𝕃~LowerLeftArrow~↙~LowerRightArrow~↘~Lscr~ℒ~Lsh~↰~Lstrok~Ł~Lt~≪~Map~⤅~Mcy~М~MediumSpace~ ~Mellintrf~ℳ~Mfr~𝔐~MinusPlus~∓~Mopf~𝕄~Mscr~ℳ~NJcy~Њ~Nacute~Ń~Ncaron~Ň~Ncedil~Ņ~Ncy~Н~NegativeMediumSpace~​~NegativeThickSpace~​~NegativeThinSpace~​~NegativeVeryThinSpace~​~NestedGreaterGreater~≫~NestedLessLess~≪~NewLine~\n~Nfr~𝔑~NoBreak~⁠~NonBreakingSpace~ ~Nopf~ℕ~Not~⫬~NotCongruent~≢~NotCupCap~≭~NotDoubleVerticalBar~∦~NotElement~∉~NotEqual~≠~NotEqualTilde~≂̸~NotExists~∄~NotGreater~≯~NotGreaterEqual~≱~NotGreaterFullEqual~≧̸~NotGreaterGreater~≫̸~NotGreaterLess~≹~NotGreaterSlantEqual~⩾̸~NotGreaterTilde~≵~NotHumpDownHump~≎̸~NotHumpEqual~≏̸~NotLeftTriangle~⋪~NotLeftTriangleBar~⧏̸~NotLeftTriangleEqual~⋬~NotLess~≮~NotLessEqual~≰~NotLessGreater~≸~NotLessLess~≪̸~NotLessSlantEqual~⩽̸~NotLessTilde~≴~NotNestedGreaterGreater~⪢̸~NotNestedLessLess~⪡̸~NotPrecedes~⊀~NotPrecedesEqual~⪯̸~NotPrecedesSlantEqual~⋠~NotReverseElement~∌~NotRightTriangle~⋫~NotRightTriangleBar~⧐̸~NotRightTriangleEqual~⋭~NotSquareSubset~⊏̸~NotSquareSubsetEqual~⋢~NotSquareSuperset~⊐̸~NotSquareSupersetEqual~⋣~NotSubset~⊂⃒~NotSubsetEqual~⊈~NotSucceeds~⊁~NotSucceedsEqual~⪰̸~NotSucceedsSlantEqual~⋡~NotSucceedsTilde~≿̸~NotSuperset~⊃⃒~NotSupersetEqual~⊉~NotTilde~≁~NotTildeEqual~≄~NotTildeFullEqual~≇~NotTildeTilde~≉~NotVerticalBar~∤~Nscr~𝒩~Ocy~О~Odblac~Ő~Ofr~𝔒~Omacr~Ō~Oopf~𝕆~OpenCurlyDoubleQuote~“~OpenCurlyQuote~‘~Or~⩔~Oscr~𝒪~Otimes~⨷~OverBar~‾~OverBrace~⏞~OverBracket~⎴~OverParenthesis~⏜~PartialD~∂~Pcy~П~Pfr~𝔓~PlusMinus~±~Poincareplane~ℌ~Popf~ℙ~Pr~⪻~Precedes~≺~PrecedesEqual~⪯~PrecedesSlantEqual~≼~PrecedesTilde~≾~Product~∏~Proportion~∷~Proportional~∝~Pscr~𝒫~Qfr~𝔔~Qopf~ℚ~Qscr~𝒬~RBarr~⤐~Racute~Ŕ~Rang~⟫~Rarr~↠~Rarrtl~⤖~Rcaron~Ř~Rcedil~Ŗ~Rcy~Р~Re~ℜ~ReverseElement~∋~ReverseEquilibrium~⇋~ReverseUpEquilibrium~⥯~Rfr~ℜ~RightAngleBracket~⟩~RightArrow~→~RightArrowBar~⇥~RightArrowLeftArrow~⇄~RightCeiling~⌉~RightDoubleBracket~⟧~RightDownTeeVector~⥝~RightDownVector~⇂~RightDownVectorBar~⥕~RightFloor~⌋~RightTee~⊢~RightTeeArrow~↦~RightTeeVector~⥛~RightTriangle~⊳~RightTriangleBar~⧐~RightTriangleEqual~⊵~RightUpDownVector~⥏~RightUpTeeVector~⥜~RightUpVector~↾~RightUpVectorBar~⥔~RightVector~⇀~RightVectorBar~⥓~Rightarrow~⇒~Ropf~ℝ~RoundImplies~⥰~Rrightarrow~⇛~Rscr~ℛ~Rsh~↱~RuleDelayed~⧴~SHCHcy~Щ~SHcy~Ш~SOFTcy~Ь~Sacute~Ś~Sc~⪼~Scedil~Ş~Scirc~Ŝ~Scy~С~Sfr~𝔖~ShortDownArrow~↓~ShortLeftArrow~←~ShortRightArrow~→~ShortUpArrow~↑~SmallCircle~∘~Sopf~𝕊~Sqrt~√~Square~□~SquareIntersection~⊓~SquareSubset~⊏~SquareSubsetEqual~⊑~SquareSuperset~⊐~SquareSupersetEqual~⊒~SquareUnion~⊔~Sscr~𝒮~Star~⋆~Sub~⋐~Subset~⋐~SubsetEqual~⊆~Succeeds~≻~SucceedsEqual~⪰~SucceedsSlantEqual~≽~SucceedsTilde~≿~SuchThat~∋~Sum~∑~Sup~⋑~Superset~⊃~SupersetEqual~⊇~Supset~⋑~TRADE~™~TSHcy~Ћ~TScy~Ц~Tab~	~Tcaron~Ť~Tcedil~Ţ~Tcy~Т~Tfr~𝔗~Therefore~∴~ThickSpace~  ~ThinSpace~ ~Tilde~∼~TildeEqual~≃~TildeFullEqual~≅~TildeTilde~≈~Topf~𝕋~TripleDot~⃛~Tscr~𝒯~Tstrok~Ŧ~Uarr~↟~Uarrocir~⥉~Ubrcy~Ў~Ubreve~Ŭ~Ucy~У~Udblac~Ű~Ufr~𝔘~Umacr~Ū~UnderBar~_~UnderBrace~⏟~UnderBracket~⎵~UnderParenthesis~⏝~Union~⋃~UnionPlus~⊎~Uogon~Ų~Uopf~𝕌~UpArrow~↑~UpArrowBar~⤒~UpArrowDownArrow~⇅~UpDownArrow~↕~UpEquilibrium~⥮~UpTee~⊥~UpTeeArrow~↥~Uparrow~⇑~Updownarrow~⇕~UpperLeftArrow~↖~UpperRightArrow~↗~Upsi~ϒ~Uring~Ů~Uscr~𝒰~Utilde~Ũ~VDash~⊫~Vbar~⫫~Vcy~В~Vdash~⊩~Vdashl~⫦~Vee~⋁~Verbar~‖~Vert~‖~VerticalBar~∣~VerticalLine~|~VerticalSeparator~❘~VerticalTilde~≀~VeryThinSpace~ ~Vfr~𝔙~Vopf~𝕍~Vscr~𝒱~Vvdash~⊪~Wcirc~Ŵ~Wedge~⋀~Wfr~𝔚~Wopf~𝕎~Wscr~𝒲~Xfr~𝔛~Xopf~𝕏~Xscr~𝒳~YAcy~Я~YIcy~Ї~YUcy~Ю~Ycirc~Ŷ~Ycy~Ы~Yfr~𝔜~Yopf~𝕐~Yscr~𝒴~ZHcy~Ж~Zacute~Ź~Zcaron~Ž~Zcy~З~Zdot~Ż~ZeroWidthSpace~​~Zfr~ℨ~Zopf~ℤ~Zscr~𝒵~abreve~ă~ac~∾~acE~∾̳~acd~∿~acy~а~af~⁡~afr~𝔞~aleph~ℵ~amacr~ā~amalg~⨿~andand~⩕~andd~⩜~andslope~⩘~andv~⩚~ange~⦤~angle~∠~angmsd~∡~angmsdaa~⦨~angmsdab~⦩~angmsdac~⦪~angmsdad~⦫~angmsdae~⦬~angmsdaf~⦭~angmsdag~⦮~angmsdah~⦯~angrt~∟~angrtvb~⊾~angrtvbd~⦝~angsph~∢~angst~Å~angzarr~⍼~aogon~ą~aopf~𝕒~ap~≈~apE~⩰~apacir~⩯~ape~≊~apid~≋~approx~≈~approxeq~≊~ascr~𝒶~ast~*~asympeq~≍~awconint~∳~awint~⨑~bNot~⫭~backcong~≌~backepsilon~϶~backprime~‵~backsim~∽~backsimeq~⋍~barvee~⊽~barwed~⌅~barwedge~⌅~bbrk~⎵~bbrktbrk~⎶~bcong~≌~bcy~б~becaus~∵~because~∵~bemptyv~⦰~bepsi~϶~bernou~ℬ~beth~ℶ~between~≬~bfr~𝔟~bigcap~⋂~bigcirc~◯~bigcup~⋃~bigodot~⨀~bigoplus~⨁~bigotimes~⨂~bigsqcup~⨆~bigstar~★~bigtriangledown~▽~bigtriangleup~△~biguplus~⨄~bigvee~⋁~bigwedge~⋀~bkarow~⤍~blacklozenge~⧫~blacksquare~▪~blacktriangle~▴~blacktriangledown~▾~blacktriangleleft~◂~blacktriangleright~▸~blank~␣~blk12~▒~blk14~░~blk34~▓~block~█~bne~=⃥~bnequiv~≡⃥~bnot~⌐~bopf~𝕓~bot~⊥~bottom~⊥~bowtie~⋈~boxDL~╗~boxDR~╔~boxDl~╖~boxDr~╓~boxH~═~boxHD~╦~boxHU~╩~boxHd~╤~boxHu~╧~boxUL~╝~boxUR~╚~boxUl~╜~boxUr~╙~boxV~║~boxVH~╬~boxVL~╣~boxVR~╠~boxVh~╫~boxVl~╢~boxVr~╟~boxbox~⧉~boxdL~╕~boxdR~╒~boxdl~┐~boxdr~┌~boxh~─~boxhD~╥~boxhU~╨~boxhd~┬~boxhu~┴~boxminus~⊟~boxplus~⊞~boxtimes~⊠~boxuL~╛~boxuR~╘~boxul~┘~boxur~└~boxv~│~boxvH~╪~boxvL~╡~boxvR~╞~boxvh~┼~boxvl~┤~boxvr~├~bprime~‵~breve~˘~bscr~𝒷~bsemi~⁏~bsim~∽~bsime~⋍~bsol~\\~bsolb~⧅~bsolhsub~⟈~bullet~•~bump~≎~bumpE~⪮~bumpe~≏~bumpeq~≏~cacute~ć~capand~⩄~capbrcup~⩉~capcap~⩋~capcup~⩇~capdot~⩀~caps~∩︀~caret~⁁~caron~ˇ~ccaps~⩍~ccaron~č~ccirc~ĉ~ccups~⩌~ccupssm~⩐~cdot~ċ~cemptyv~⦲~centerdot~·~cfr~𝔠~chcy~ч~check~✓~checkmark~✓~cir~○~cirE~⧃~circeq~≗~circlearrowleft~↺~circlearrowright~↻~circledR~®~circledS~Ⓢ~circledast~⊛~circledcirc~⊚~circleddash~⊝~cire~≗~cirfnint~⨐~cirmid~⫯~cirscir~⧂~clubsuit~♣~colon~:~colone~≔~coloneq~≔~comma~,~commat~@~comp~∁~compfn~∘~complement~∁~complexes~ℂ~congdot~⩭~conint~∮~copf~𝕔~coprod~∐~copysr~℗~cross~✗~cscr~𝒸~csub~⫏~csube~⫑~csup~⫐~csupe~⫒~ctdot~⋯~cudarrl~⤸~cudarrr~⤵~cuepr~⋞~cuesc~⋟~cularr~↶~cularrp~⤽~cupbrcap~⩈~cupcap~⩆~cupcup~⩊~cupdot~⊍~cupor~⩅~cups~∪︀~curarr~↷~curarrm~⤼~curlyeqprec~⋞~curlyeqsucc~⋟~curlyvee~⋎~curlywedge~⋏~curvearrowleft~↶~curvearrowright~↷~cuvee~⋎~cuwed~⋏~cwconint~∲~cwint~∱~cylcty~⌭~dHar~⥥~daleth~ℸ~dash~‐~dashv~⊣~dbkarow~⤏~dblac~˝~dcaron~ď~dcy~д~dd~ⅆ~ddagger~‡~ddarr~⇊~ddotseq~⩷~demptyv~⦱~dfisht~⥿~dfr~𝔡~dharl~⇃~dharr~⇂~diam~⋄~diamond~⋄~diamondsuit~♦~die~¨~digamma~ϝ~disin~⋲~div~÷~divideontimes~⋇~divonx~⋇~djcy~ђ~dlcorn~⌞~dlcrop~⌍~dollar~$~dopf~𝕕~dot~˙~doteq~≐~doteqdot~≑~dotminus~∸~dotplus~∔~dotsquare~⊡~doublebarwedge~⌆~downarrow~↓~downdownarrows~⇊~downharpoonleft~⇃~downharpoonright~⇂~drbkarow~⤐~drcorn~⌟~drcrop~⌌~dscr~𝒹~dscy~ѕ~dsol~⧶~dstrok~đ~dtdot~⋱~dtri~▿~dtrif~▾~duarr~⇵~duhar~⥯~dwangle~⦦~dzcy~џ~dzigrarr~⟿~eDDot~⩷~eDot~≑~easter~⩮~ecaron~ě~ecir~≖~ecolon~≕~ecy~э~edot~ė~ee~ⅇ~efDot~≒~efr~𝔢~eg~⪚~egs~⪖~egsdot~⪘~el~⪙~elinters~⏧~ell~ℓ~els~⪕~elsdot~⪗~emacr~ē~emptyset~∅~emptyv~∅~emsp13~ ~emsp14~ ~eng~ŋ~eogon~ę~eopf~𝕖~epar~⋕~eparsl~⧣~eplus~⩱~epsi~ε~epsiv~ϵ~eqcirc~≖~eqcolon~≕~eqsim~≂~eqslantgtr~⪖~eqslantless~⪕~equals~=~equest~≟~equivDD~⩸~eqvparsl~⧥~erDot~≓~erarr~⥱~escr~ℯ~esdot~≐~esim~≂~excl~!~expectation~ℰ~exponentiale~ⅇ~fallingdotseq~≒~fcy~ф~female~♀~ffilig~ﬃ~fflig~ﬀ~ffllig~ﬄ~ffr~𝔣~filig~ﬁ~fjlig~fj~flat~♭~fllig~ﬂ~fltns~▱~fopf~𝕗~fork~⋔~forkv~⫙~fpartint~⨍~frac13~⅓~frac15~⅕~frac16~⅙~frac18~⅛~frac23~⅔~frac25~⅖~frac35~⅗~frac38~⅜~frac45~⅘~frac56~⅚~frac58~⅝~frac78~⅞~frown~⌢~fscr~𝒻~gE~≧~gEl~⪌~gacute~ǵ~gammad~ϝ~gap~⪆~gbreve~ğ~gcirc~ĝ~gcy~г~gdot~ġ~gel~⋛~geq~≥~geqq~≧~geqslant~⩾~ges~⩾~gescc~⪩~gesdot~⪀~gesdoto~⪂~gesdotol~⪄~gesl~⋛︀~gesles~⪔~gfr~𝔤~gg~≫~ggg~⋙~gimel~ℷ~gjcy~ѓ~gl~≷~glE~⪒~gla~⪥~glj~⪤~gnE~≩~gnap~⪊~gnapprox~⪊~gne~⪈~gneq~⪈~gneqq~≩~gnsim~⋧~gopf~𝕘~grave~`~gscr~ℊ~gsim~≳~gsime~⪎~gsiml~⪐~gtcc~⪧~gtcir~⩺~gtdot~⋗~gtlPar~⦕~gtquest~⩼~gtrapprox~⪆~gtrarr~⥸~gtrdot~⋗~gtreqless~⋛~gtreqqless~⪌~gtrless~≷~gtrsim~≳~gvertneqq~≩︀~gvnE~≩︀~hairsp~ ~half~½~hamilt~ℋ~hardcy~ъ~harrcir~⥈~harrw~↭~hbar~ℏ~hcirc~ĥ~heartsuit~♥~hercon~⊹~hfr~𝔥~hksearow~⤥~hkswarow~⤦~hoarr~⇿~homtht~∻~hookleftarrow~↩~hookrightarrow~↪~hopf~𝕙~horbar~―~hscr~𝒽~hslash~ℏ~hstrok~ħ~hybull~⁃~hyphen~‐~ic~⁣~icy~и~iecy~е~iff~⇔~ifr~𝔦~ii~ⅈ~iiiint~⨌~iiint~∭~iinfin~⧜~iiota~℩~ijlig~ĳ~imacr~ī~imagline~ℐ~imagpart~ℑ~imath~ı~imof~⊷~imped~Ƶ~in~∈~incare~℅~infintie~⧝~inodot~ı~intcal~⊺~integers~ℤ~intercal~⊺~intlarhk~⨗~intprod~⨼~iocy~ё~iogon~į~iopf~𝕚~iprod~⨼~iscr~𝒾~isinE~⋹~isindot~⋵~isins~⋴~isinsv~⋳~isinv~∈~it~⁢~itilde~ĩ~iukcy~і~jcirc~ĵ~jcy~й~jfr~𝔧~jmath~ȷ~jopf~𝕛~jscr~𝒿~jsercy~ј~jukcy~є~kappav~ϰ~kcedil~ķ~kcy~к~kfr~𝔨~kgreen~ĸ~khcy~х~kjcy~ќ~kopf~𝕜~kscr~𝓀~lAarr~⇚~lAtail~⤛~lBarr~⤎~lE~≦~lEg~⪋~lHar~⥢~lacute~ĺ~laemptyv~⦴~lagran~ℒ~langd~⦑~langle~⟨~lap~⪅~larrb~⇤~larrbfs~⤟~larrfs~⤝~larrhk~↩~larrlp~↫~larrpl~⤹~larrsim~⥳~larrtl~↢~lat~⪫~latail~⤙~late~⪭~lates~⪭︀~lbarr~⤌~lbbrk~❲~lbrace~{~lbrack~[~lbrke~⦋~lbrksld~⦏~lbrkslu~⦍~lcaron~ľ~lcedil~ļ~lcub~{~lcy~л~ldca~⤶~ldquor~„~ldrdhar~⥧~ldrushar~⥋~ldsh~↲~leftarrow~←~leftarrowtail~↢~leftharpoondown~↽~leftharpoonup~↼~leftleftarrows~⇇~leftrightarrow~↔~leftrightarrows~⇆~leftrightharpoons~⇋~leftrightsquigarrow~↭~leftthreetimes~⋋~leg~⋚~leq~≤~leqq~≦~leqslant~⩽~les~⩽~lescc~⪨~lesdot~⩿~lesdoto~⪁~lesdotor~⪃~lesg~⋚︀~lesges~⪓~lessapprox~⪅~lessdot~⋖~lesseqgtr~⋚~lesseqqgtr~⪋~lessgtr~≶~lesssim~≲~lfisht~⥼~lfr~𝔩~lg~≶~lgE~⪑~lhard~↽~lharu~↼~lharul~⥪~lhblk~▄~ljcy~љ~ll~≪~llarr~⇇~llcorner~⌞~llhard~⥫~lltri~◺~lmidot~ŀ~lmoust~⎰~lmoustache~⎰~lnE~≨~lnap~⪉~lnapprox~⪉~lne~⪇~lneq~⪇~lneqq~≨~lnsim~⋦~loang~⟬~loarr~⇽~lobrk~⟦~longleftarrow~⟵~longleftrightarrow~⟷~longmapsto~⟼~longrightarrow~⟶~looparrowleft~↫~looparrowright~↬~lopar~⦅~lopf~𝕝~loplus~⨭~lotimes~⨴~lowbar~_~lozenge~◊~lozf~⧫~lpar~(~lparlt~⦓~lrarr~⇆~lrcorner~⌟~lrhar~⇋~lrhard~⥭~lrtri~⊿~lscr~𝓁~lsh~↰~lsim~≲~lsime~⪍~lsimg~⪏~lsqb~[~lsquor~‚~lstrok~ł~ltcc~⪦~ltcir~⩹~ltdot~⋖~lthree~⋋~ltimes~⋉~ltlarr~⥶~ltquest~⩻~ltrPar~⦖~ltri~◃~ltrie~⊴~ltrif~◂~lurdshar~⥊~luruhar~⥦~lvertneqq~≨︀~lvnE~≨︀~mDDot~∺~male~♂~malt~✠~maltese~✠~map~↦~mapsto~↦~mapstodown~↧~mapstoleft~↤~mapstoup~↥~marker~▮~mcomma~⨩~mcy~м~measuredangle~∡~mfr~𝔪~mho~℧~mid~∣~midast~*~midcir~⫰~minusb~⊟~minusd~∸~minusdu~⨪~mlcp~⫛~mldr~…~mnplus~∓~models~⊧~mopf~𝕞~mp~∓~mscr~𝓂~mstpos~∾~multimap~⊸~mumap~⊸~nGg~⋙̸~nGt~≫⃒~nGtv~≫̸~nLeftarrow~⇍~nLeftrightarrow~⇎~nLl~⋘̸~nLt~≪⃒~nLtv~≪̸~nRightarrow~⇏~nVDash~⊯~nVdash~⊮~nacute~ń~nang~∠⃒~nap~≉~napE~⩰̸~napid~≋̸~napos~ŉ~napprox~≉~natur~♮~natural~♮~naturals~ℕ~nbump~≎̸~nbumpe~≏̸~ncap~⩃~ncaron~ň~ncedil~ņ~ncong~≇~ncongdot~⩭̸~ncup~⩂~ncy~н~neArr~⇗~nearhk~⤤~nearr~↗~nearrow~↗~nedot~≐̸~nequiv~≢~nesear~⤨~nesim~≂̸~nexist~∄~nexists~∄~nfr~𝔫~ngE~≧̸~nge~≱~ngeq~≱~ngeqq~≧̸~ngeqslant~⩾̸~nges~⩾̸~ngsim~≵~ngt~≯~ngtr~≯~nhArr~⇎~nharr~↮~nhpar~⫲~nis~⋼~nisd~⋺~niv~∋~njcy~њ~nlArr~⇍~nlE~≦̸~nlarr~↚~nldr~‥~nle~≰~nleftarrow~↚~nleftrightarrow~↮~nleq~≰~nleqq~≦̸~nleqslant~⩽̸~nles~⩽̸~nless~≮~nlsim~≴~nlt~≮~nltri~⋪~nltrie~⋬~nmid~∤~nopf~𝕟~notinE~⋹̸~notindot~⋵̸~notinva~∉~notinvb~⋷~notinvc~⋶~notni~∌~notniva~∌~notnivb~⋾~notnivc~⋽~npar~∦~nparallel~∦~nparsl~⫽⃥~npart~∂̸~npolint~⨔~npr~⊀~nprcue~⋠~npre~⪯̸~nprec~⊀~npreceq~⪯̸~nrArr~⇏~nrarr~↛~nrarrc~⤳̸~nrarrw~↝̸~nrightarrow~↛~nrtri~⋫~nrtrie~⋭~nsc~⊁~nsccue~⋡~nsce~⪰̸~nscr~𝓃~nshortmid~∤~nshortparallel~∦~nsim~≁~nsime~≄~nsimeq~≄~nsmid~∤~nspar~∦~nsqsube~⋢~nsqsupe~⋣~nsubE~⫅̸~nsube~⊈~nsubset~⊂⃒~nsubseteq~⊈~nsubseteqq~⫅̸~nsucc~⊁~nsucceq~⪰̸~nsup~⊅~nsupE~⫆̸~nsupe~⊉~nsupset~⊃⃒~nsupseteq~⊉~nsupseteqq~⫆̸~ntgl~≹~ntlg~≸~ntriangleleft~⋪~ntrianglelefteq~⋬~ntriangleright~⋫~ntrianglerighteq~⋭~num~#~numero~№~numsp~ ~nvDash~⊭~nvHarr~⤄~nvap~≍⃒~nvdash~⊬~nvge~≥⃒~nvgt~>⃒~nvinfin~⧞~nvlArr~⤂~nvle~≤⃒~nvlt~<⃒~nvltrie~⊴⃒~nvrArr~⤃~nvrtrie~⊵⃒~nvsim~∼⃒~nwArr~⇖~nwarhk~⤣~nwarr~↖~nwarrow~↖~nwnear~⤧~oS~Ⓢ~oast~⊛~ocir~⊚~ocy~о~odash~⊝~odblac~ő~odiv~⨸~odot~⊙~odsold~⦼~ofcir~⦿~ofr~𝔬~ogon~˛~ogt~⧁~ohbar~⦵~ohm~Ω~oint~∮~olarr~↺~olcir~⦾~olcross~⦻~olt~⧀~omacr~ō~omid~⦶~ominus~⊖~oopf~𝕠~opar~⦷~operp~⦹~orarr~↻~ord~⩝~order~ℴ~orderof~ℴ~origof~⊶~oror~⩖~orslope~⩗~orv~⩛~oscr~ℴ~osol~⊘~otimesas~⨶~ovbar~⌽~par~∥~parallel~∥~parsim~⫳~parsl~⫽~pcy~п~percnt~%~period~.~pertenk~‱~pfr~𝔭~phiv~ϕ~phmmat~ℳ~phone~☎~pitchfork~⋔~planck~ℏ~planckh~ℎ~plankv~ℏ~plus~+~plusacir~⨣~plusb~⊞~pluscir~⨢~plusdo~∔~plusdu~⨥~pluse~⩲~plussim~⨦~plustwo~⨧~pm~±~pointint~⨕~popf~𝕡~pr~≺~prE~⪳~prap~⪷~prcue~≼~pre~⪯~prec~≺~precapprox~⪷~preccurlyeq~≼~preceq~⪯~precnapprox~⪹~precneqq~⪵~precnsim~⋨~precsim~≾~primes~ℙ~prnE~⪵~prnap~⪹~prnsim~⋨~profalar~⌮~profline~⌒~profsurf~⌓~propto~∝~prsim~≾~prurel~⊰~pscr~𝓅~puncsp~ ~qfr~𝔮~qint~⨌~qopf~𝕢~qprime~⁗~qscr~𝓆~quaternions~ℍ~quatint~⨖~quest~?~questeq~≟~rAarr~⇛~rAtail~⤜~rBarr~⤏~rHar~⥤~race~∽̱~racute~ŕ~raemptyv~⦳~rangd~⦒~range~⦥~rangle~⟩~rarrap~⥵~rarrb~⇥~rarrbfs~⤠~rarrc~⤳~rarrfs~⤞~rarrhk~↪~rarrlp~↬~rarrpl~⥅~rarrsim~⥴~rarrtl~↣~rarrw~↝~ratail~⤚~ratio~∶~rationals~ℚ~rbarr~⤍~rbbrk~❳~rbrace~}~rbrack~]~rbrke~⦌~rbrksld~⦎~rbrkslu~⦐~rcaron~ř~rcedil~ŗ~rcub~}~rcy~р~rdca~⤷~rdldhar~⥩~rdquor~”~rdsh~↳~realine~ℛ~realpart~ℜ~reals~ℝ~rect~▭~rfisht~⥽~rfr~𝔯~rhard~⇁~rharu~⇀~rharul~⥬~rhov~ϱ~rightarrow~→~rightarrowtail~↣~rightharpoondown~⇁~rightharpoonup~⇀~rightleftarrows~⇄~rightleftharpoons~⇌~rightrightarrows~⇉~rightsquigarrow~↝~rightthreetimes~⋌~ring~˚~risingdotseq~≓~rlarr~⇄~rlhar~⇌~rmoust~⎱~rmoustache~⎱~rnmid~⫮~roang~⟭~roarr~⇾~robrk~⟧~ropar~⦆~ropf~𝕣~roplus~⨮~rotimes~⨵~rpar~)~rpargt~⦔~rppolint~⨒~rrarr~⇉~rscr~𝓇~rsh~↱~rsqb~]~rsquor~’~rthree~⋌~rtimes~⋊~rtri~▹~rtrie~⊵~rtrif~▸~rtriltri~⧎~ruluhar~⥨~rx~℞~sacute~ś~sc~≻~scE~⪴~scap~⪸~sccue~≽~sce~⪰~scedil~ş~scirc~ŝ~scnE~⪶~scnap~⪺~scnsim~⋩~scpolint~⨓~scsim~≿~scy~с~sdotb~⊡~sdote~⩦~seArr~⇘~searhk~⤥~searr~↘~searrow~↘~semi~;~seswar~⤩~setminus~∖~setmn~∖~sext~✶~sfr~𝔰~sfrown~⌢~sharp~♯~shchcy~щ~shcy~ш~shortmid~∣~shortparallel~∥~sigmav~ς~simdot~⩪~sime~≃~simeq~≃~simg~⪞~simgE~⪠~siml~⪝~simlE~⪟~simne~≆~simplus~⨤~simrarr~⥲~slarr~←~smallsetminus~∖~smashp~⨳~smeparsl~⧤~smid~∣~smile~⌣~smt~⪪~smte~⪬~smtes~⪬︀~softcy~ь~sol~/~solb~⧄~solbar~⌿~sopf~𝕤~spadesuit~♠~spar~∥~sqcap~⊓~sqcaps~⊓︀~sqcup~⊔~sqcups~⊔︀~sqsub~⊏~sqsube~⊑~sqsubset~⊏~sqsubseteq~⊑~sqsup~⊐~sqsupe~⊒~sqsupset~⊐~sqsupseteq~⊒~squ~□~square~□~squarf~▪~squf~▪~srarr~→~sscr~𝓈~ssetmn~∖~ssmile~⌣~sstarf~⋆~star~☆~starf~★~straightepsilon~ϵ~straightphi~ϕ~strns~¯~subE~⫅~subdot~⪽~subedot~⫃~submult~⫁~subnE~⫋~subne~⊊~subplus~⪿~subrarr~⥹~subset~⊂~subseteq~⊆~subseteqq~⫅~subsetneq~⊊~subsetneqq~⫋~subsim~⫇~subsub~⫕~subsup~⫓~succ~≻~succapprox~⪸~succcurlyeq~≽~succeq~⪰~succnapprox~⪺~succneqq~⪶~succnsim~⋩~succsim~≿~sung~♪~supE~⫆~supdot~⪾~supdsub~⫘~supedot~⫄~suphsol~⟉~suphsub~⫗~suplarr~⥻~supmult~⫂~supnE~⫌~supne~⊋~supplus~⫀~supset~⊃~supseteq~⊇~supseteqq~⫆~supsetneq~⊋~supsetneqq~⫌~supsim~⫈~supsub~⫔~supsup~⫖~swArr~⇙~swarhk~⤦~swarr~↙~swarrow~↙~swnwar~⤪~target~⌖~tbrk~⎴~tcaron~ť~tcedil~ţ~tcy~т~tdot~⃛~telrec~⌕~tfr~𝔱~therefore~∴~thetav~ϑ~thickapprox~≈~thicksim~∼~thkap~≈~thksim~∼~timesb~⊠~timesbar~⨱~timesd~⨰~tint~∭~toea~⤨~top~⊤~topbot~⌶~topcir~⫱~topf~𝕥~topfork~⫚~tosa~⤩~tprime~‴~triangle~▵~triangledown~▿~triangleleft~◃~trianglelefteq~⊴~triangleq~≜~triangleright~▹~trianglerighteq~⊵~tridot~◬~trie~≜~triminus~⨺~triplus~⨹~trisb~⧍~tritime~⨻~trpezium~⏢~tscr~𝓉~tscy~ц~tshcy~ћ~tstrok~ŧ~twixt~≬~twoheadleftarrow~↞~twoheadrightarrow~↠~uHar~⥣~ubrcy~ў~ubreve~ŭ~ucy~у~udarr~⇅~udblac~ű~udhar~⥮~ufisht~⥾~ufr~𝔲~uharl~↿~uharr~↾~uhblk~▀~ulcorn~⌜~ulcorner~⌜~ulcrop~⌏~ultri~◸~umacr~ū~uogon~ų~uopf~𝕦~uparrow~↑~updownarrow~↕~upharpoonleft~↿~upharpoonright~↾~uplus~⊎~upsi~υ~upuparrows~⇈~urcorn~⌝~urcorner~⌝~urcrop~⌎~uring~ů~urtri~◹~uscr~𝓊~utdot~⋰~utilde~ũ~utri~▵~utrif~▴~uuarr~⇈~uwangle~⦧~vArr~⇕~vBar~⫨~vBarv~⫩~vDash~⊨~vangrt~⦜~varepsilon~ϵ~varkappa~ϰ~varnothing~∅~varphi~ϕ~varpi~ϖ~varpropto~∝~varr~↕~varrho~ϱ~varsigma~ς~varsubsetneq~⊊︀~varsubsetneqq~⫋︀~varsupsetneq~⊋︀~varsupsetneqq~⫌︀~vartheta~ϑ~vartriangleleft~⊲~vartriangleright~⊳~vcy~в~vdash~⊢~vee~∨~veebar~⊻~veeeq~≚~vellip~⋮~verbar~|~vert~|~vfr~𝔳~vltri~⊲~vnsub~⊂⃒~vnsup~⊃⃒~vopf~𝕧~vprop~∝~vrtri~⊳~vscr~𝓋~vsubnE~⫋︀~vsubne~⊊︀~vsupnE~⫌︀~vsupne~⊋︀~vzigzag~⦚~wcirc~ŵ~wedbar~⩟~wedge~∧~wedgeq~≙~wfr~𝔴~wopf~𝕨~wp~℘~wr~≀~wreath~≀~wscr~𝓌~xcap~⋂~xcirc~◯~xcup~⋃~xdtri~▽~xfr~𝔵~xhArr~⟺~xharr~⟷~xlArr~⟸~xlarr~⟵~xmap~⟼~xnis~⋻~xodot~⨀~xopf~𝕩~xoplus~⨁~xotime~⨂~xrArr~⟹~xrarr~⟶~xscr~𝓍~xsqcup~⨆~xuplus~⨄~xutri~△~xvee~⋁~xwedge~⋀~yacy~я~ycirc~ŷ~ycy~ы~yfr~𝔶~yicy~ї~yopf~𝕪~yscr~𝓎~yucy~ю~zacute~ź~zcaron~ž~zcy~з~zdot~ż~zeetrf~ℨ~zfr~𝔷~zhcy~ж~zigrarr~⇝~zopf~𝕫~zscr~𝓏~~AMP~&~COPY~©~GT~>~LT~<~QUOT~"~REG~®', namedReferences["html4"]);
var numericUnicodeMap = {
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
};
var fromCodePoint = String.fromCodePoint || function(astralCodePoint) {
  return String.fromCharCode(Math.floor((astralCodePoint - 65536) / 1024) + 55296, (astralCodePoint - 65536) % 1024 + 56320);
};
var __assign = function() {
  __assign = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
        t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
var allNamedReferences = __assign(__assign({}, namedReferences), { all: namedReferences.html5 });
var defaultDecodeOptions = {
  scope: "body",
  level: "all"
};
var strict = /&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);/g;
var attribute = /&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+)[;=]?/g;
var baseDecodeRegExps = {
  xml: {
    strict,
    attribute,
    body: bodyRegExps.xml
  },
  html4: {
    strict,
    attribute,
    body: bodyRegExps.html4
  },
  html5: {
    strict,
    attribute,
    body: bodyRegExps.html5
  }
};
var decodeRegExps = __assign(__assign({}, baseDecodeRegExps), { all: baseDecodeRegExps.html5 });
var fromCharCode = String.fromCharCode;
var outOfBoundsChar = fromCharCode(65533);
function getDecodedEntity(entity, references, isAttribute, isStrict) {
  var decodeResult = entity;
  var decodeEntityLastChar = entity[entity.length - 1];
  if (isAttribute && decodeEntityLastChar === "=") {
    decodeResult = entity;
  } else if (isStrict && decodeEntityLastChar !== ";") {
    decodeResult = entity;
  } else {
    var decodeResultByReference = references[entity];
    if (decodeResultByReference) {
      decodeResult = decodeResultByReference;
    } else if (entity[0] === "&" && entity[1] === "#") {
      var decodeSecondChar = entity[2];
      var decodeCode = decodeSecondChar == "x" || decodeSecondChar == "X" ? parseInt(entity.substr(3), 16) : parseInt(entity.substr(2));
      decodeResult = decodeCode >= 1114111 ? outOfBoundsChar : decodeCode > 65535 ? fromCodePoint(decodeCode) : fromCharCode(numericUnicodeMap[decodeCode] || decodeCode);
    }
  }
  return decodeResult;
}
function decode(text, _a) {
  var _b = defaultDecodeOptions, _c = _b.level, level = _c === void 0 ? "all" : _c, _d = _b.scope, scope = _d === void 0 ? level === "xml" ? "strict" : "body" : _d;
  if (!text) {
    return "";
  }
  var decodeRegExp = decodeRegExps[level][scope];
  var references = allNamedReferences[level].entities;
  var isAttribute = scope === "attribute";
  var isStrict = scope === "strict";
  return text.replace(decodeRegExp, function(entity) {
    return getDecodedEntity(entity, references, isAttribute, isStrict);
  });
}
function parseStructuredToolCallInput(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return {};
  if (trimmed.startsWith("<")) {
    const { value, ok } = parseXMLFragmentValue(trimmed);
    if (ok) {
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        return value;
      }
      if (typeof value === "string") {
        const text = value.trim();
        if (!text) return {};
        return { _raw: value };
      }
    }
  }
  return { _raw: trimmed };
}
function parseXMLFragmentValue(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return { value: "", ok: true };
  try {
    const result = parseSimpleXml(trimmed);
    return { value: result, ok: true };
  } catch {
    return { value: null, ok: false };
  }
}
function parseSimpleXml(xml) {
  const wrapped = `<root>${xml}</root>`;
  const tokens = tokenizeXml(wrapped);
  let pos = 0;
  function parseNode() {
    const startTag = tokens[pos++];
    if (!startTag || !startTag.startsWith("<") || startTag.startsWith("</")) {
      throw new Error("Invalid start tag");
    }
    const tagName = startTag.slice(1, -1).split(" ")[0];
    const children = {};
    let text = "";
    while (pos < tokens.length) {
      const token = tokens[pos];
      if (token.startsWith("</")) {
        const endTagName = token.slice(2, -1);
        if (endTagName !== tagName) throw new Error("Mismatched tag");
        pos++;
        if (Object.keys(children).length === 0) {
          return tryParseJsonLiteral(text.trim()) ?? text;
        }
        if (text.trim()) {
          children["_text"] = tryParseJsonLiteral(text.trim()) ?? text;
        }
        const childKeys = Object.keys(children);
        if (childKeys.length === 1 && childKeys[0] === "item") {
          return Array.isArray(children["item"]) ? children["item"] : [children["item"]];
        }
        return children;
      } else if (token.startsWith("<")) {
        const childName = token.slice(1, -1).split(" ")[0];
        const childValue = parseNode();
        appendXMLChildValue(children, childName, childValue);
      } else {
        text += token;
        pos++;
      }
    }
    return text;
  }
  return parseNode();
}
function appendXMLChildValue(dst, key, value) {
  if (!key) return;
  if (Object.prototype.hasOwnProperty.call(dst, key)) {
    const existing = dst[key];
    if (Array.isArray(existing)) {
      existing.push(value);
    } else {
      dst[key] = [existing, value];
    }
  } else {
    dst[key] = value;
  }
}
function tokenizeXml(xml) {
  const tokens = [];
  let current = "";
  for (let i = 0; i < xml.length; i++) {
    if (xml[i] === "<") {
      if (current) tokens.push(current);
      let end = xml.indexOf(">", i);
      if (end === -1) end = xml.length;
      tokens.push(xml.slice(i, end + 1));
      i = end;
      current = "";
    } else {
      current += xml[i];
    }
  }
  if (current) tokens.push(current);
  return tokens;
}
function tryParseJsonLiteral(s) {
  if (!s) return null;
  const lower = s.toLowerCase();
  if (lower === "true") return true;
  if (lower === "false") return false;
  if (lower === "null") return null;
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  return void 0;
}
function parseMarkupValue(inner) {
  const standaloneCDATA = extractStandaloneCDATA(inner);
  if (standaloneCDATA.ok) {
    return standaloneCDATA.value;
  }
  const value = extractRawTagValue(inner).trim();
  if (value === "") {
    return "";
  }
  if (value.includes("<") && value.includes(">")) {
    const parsed = parseStructuredToolCallInput(value);
    if (Object.keys(parsed).length > 0) {
      if (Object.keys(parsed).length === 1 && "_raw" in parsed) {
        return parsed["_raw"];
      }
      return parsed;
    }
  }
  try {
    if (/^[-0-9"[{tfnu]/.test(value)) {
      return JSON.parse(value);
    }
  } catch (e) {
  }
  return value;
}
function extractRawTagValue(inner) {
  const trimmed = inner.trim();
  if (!trimmed) return "";
  const standaloneCDATA = extractStandaloneCDATA(trimmed);
  if (standaloneCDATA.ok) {
    return standaloneCDATA.value;
  }
  return decode(inner);
}
function extractStandaloneCDATA(inner) {
  const trimmed = inner.trim();
  const openLen = toolCDATAOpenLenAt(trimmed, 0);
  if (openLen > 0) {
    const closeStart = findTrailingToolCDATACloseStart(trimmed);
    if (closeStart >= openLen) {
      return { value: trimmed.slice(openLen, closeStart), ok: true };
    }
    const end = findToolCDATAEnd(trimmed, openLen);
    if (end >= 0) {
      return { value: trimmed.slice(openLen, end), ok: true };
    }
    return { value: trimmed.slice(openLen), ok: true };
  }
  return { value: "", ok: false };
}
function toolCDATAOpenLenAt(text, idx) {
  const start = skipToolMarkupIgnorables(text, idx);
  const ltLen = xmlTagStartDelimiterLenAt(text, start);
  if (ltLen === 0) return 0;
  let pos = start + ltLen;
  for (let skipped = 0; skipped <= 4 && pos < text.length; skipped++) {
    pos = skipToolMarkupIgnorables(text, pos);
    if (pos >= text.length) return 0;
    if (text[pos] === "[") {
      pos++;
      const { next, ok } = consumeToolKeyword(text, pos, "cdata");
      if (!ok) return 0;
      pos = skipToolMarkupIgnorables(text, next);
      if (pos >= text.length || text[pos] !== "[") return 0;
      pos++;
      return pos - idx;
    }
    const ch = text[pos];
    if (!isToolMarkupSeparator(ch)) return 0;
    pos++;
  }
  return 0;
}
function isToolMarkupSeparator(ch) {
  return [" ", "	", "\n", "\r", "|", "│", "∣", "❘", "ǀ", "￨"].includes(ch);
}
function findTrailingToolCDATACloseStart(text) {
  for (let i = text.length - 1; i >= 0; i--) {
    const closeLen = toolCDATACloseLenAt(text, i);
    if (closeLen > 0 && i + closeLen === text.length) {
      return i;
    }
  }
  return -1;
}
function toolCDATACloseLenAt(text, idx) {
  if (idx < 0 || idx >= text.length) return 0;
  if (text.startsWith("]]〉", idx)) return 3;
  if (text.startsWith("]]＞", idx)) return 3;
  if (text.startsWith("]]>", idx)) return 3;
  return 0;
}
function findToolCDATAEnd(text, from) {
  if (from < 0 || from >= text.length) return -1;
  let firstNonFenceEnd = -1;
  for (let searchFrom = from; searchFrom < text.length; ) {
    const end = indexToolCDATAClose(text, searchFrom);
    if (end < 0) break;
    const closeLen = toolCDATACloseLenAt(text, end);
    searchFrom = end + closeLen;
    if (cdataOffsetIsInsideMarkdownFence(text.slice(from, end))) {
      continue;
    }
    if (cdataEndLooksStructural(text, searchFrom)) {
      return end;
    }
    if (firstNonFenceEnd < 0) {
      firstNonFenceEnd = end;
    }
  }
  return firstNonFenceEnd;
}
function indexToolCDATAClose(text, from) {
  if (from < 0) from = 0;
  const s = text.slice(from);
  const asciiIdx = s.indexOf("]]>");
  const fullIdx = s.indexOf("]]＞");
  const cjkIdx = s.indexOf("]]〉");
  let best = -1;
  [asciiIdx, fullIdx, cjkIdx].forEach((idx) => {
    if (idx >= 0 && (best < 0 || idx < best)) {
      best = idx;
    }
  });
  return best < 0 ? -1 : from + best;
}
function cdataEndLooksStructural(text, after) {
  while (after < text.length) {
    const ch = text[after];
    if ([" ", "	", "\r", "\n"].includes(ch)) {
      after++;
      continue;
    }
    if (text.startsWith("</", after)) {
      return true;
    }
    return false;
  }
  return false;
}
function cdataOffsetIsInsideMarkdownFence(fragment) {
  if (!fragment) return false;
  const lines = fragment.split("\n");
  let inFence = false;
  let fenceMarker = "";
  for (const line of lines) {
    const trimmed = line.trimStart();
    if (!inFence) {
      const { marker, ok } = parseFenceOpen$1(trimmed);
      if (ok) {
        inFence = true;
        fenceMarker = marker;
      }
      continue;
    }
    if (isFenceClose$1(trimmed, fenceMarker)) {
      inFence = false;
      fenceMarker = "";
    }
  }
  return inFence;
}
function parseFenceOpen$1(line) {
  if (line.length < 3) return { marker: "", ok: false };
  const ch = line[0];
  if (ch !== "`" && ch !== "~") return { marker: "", ok: false };
  let count = 0;
  while (count < line.length && line[count] === ch) {
    count++;
  }
  if (count < 3) return { marker: "", ok: false };
  return { marker: ch.repeat(count), ok: true };
}
function isFenceClose$1(line, marker) {
  if (!marker) return false;
  const ch = marker[0];
  if (line === "" || line[0] !== ch) return false;
  let count = 0;
  while (count < line.length && line[count] === ch) {
    count++;
  }
  if (count < marker.length) return false;
  const rest = line.slice(count).trim();
  return rest === "";
}
function SanitizeLooseCDATA(text) {
  if (!text) return "";
  let out = "";
  let pos = 0;
  let changed = false;
  while (pos < text.length) {
    const start = indexToolCDATAOpen(text, pos);
    if (start < 0) {
      out += text.slice(pos);
      break;
    }
    const openLen = toolCDATAOpenLenAt(text, start);
    const contentStart = start + openLen;
    out += text.slice(pos, start);
    const endRel = findToolCDATAEnd(text, contentStart);
    if (endRel >= 0) {
      const end = endRel + toolCDATACloseLenAt(text, endRel);
      out += text.slice(start, end);
      pos = end;
      continue;
    }
    changed = true;
    out += text.slice(contentStart);
    pos = text.length;
  }
  return changed ? out : text;
}
function indexToolCDATAOpen(text, start) {
  for (let i = Math.max(start, 0); i < text.length; i++) {
    if (toolCDATAOpenLenAt(text, i) > 0) {
      return i;
    }
  }
  return -1;
}
function repairInvalidJSONBackslashes(s) {
  if (!s.includes("\\")) return s;
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "\\") {
      if (i + 1 < s.length) {
        const next = s[i + 1];
        if (['"', "\\", "/", "b", "f", "n", "r", "t"].includes(next)) {
          out += "\\" + next;
          i++;
          continue;
        }
        if (next === "u" && i + 5 < s.length) {
          const hex = s.slice(i + 2, i + 6);
          if (/^[0-9a-fA-F]{4}$/.test(hex)) {
            out += "\\u" + hex;
            i += 5;
            continue;
          }
        }
      }
      out += "\\\\";
    } else {
      out += ch;
    }
  }
  return out;
}
function repairLooseJSON(s) {
  let out = s.trim();
  if (!out) return out;
  out = out.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
  const missingArrayPattern = /(:|：)\s*(\{(?:[^{}]|\{[^{}]*\})*\}(?:\s*,\s*\{(?:[^{}]|\{[^{}]*\})*\})+)/g;
  out = out.replace(missingArrayPattern, "$1[$2]");
  return out;
}
function parseLooseJSONArrayValue(raw, paramName) {
  if (preservesCDATAStringParameter$1(paramName)) {
    return null;
  }
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const candidate = parseLooseArrayElementValue(trimmed);
  if (candidate.ok) {
    const coerced = coerceArrayValue(candidate.value, paramName);
    if (coerced) return coerced;
  }
  const segments = splitTopLevelJSONValues(trimmed);
  if (!segments) return null;
  const out = [];
  for (const segment of segments) {
    const parsed = parseLooseArrayElementValue(segment);
    if (!parsed.ok) return null;
    out.push(parsed.value);
  }
  return out;
}
function parseLooseArrayElementValue(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return { value: null, ok: false };
  try {
    return { value: JSON.parse(trimmed), ok: true };
  } catch {
  }
  const repairedBackslashes = repairInvalidJSONBackslashes(trimmed);
  if (repairedBackslashes !== trimmed) {
    try {
      return { value: JSON.parse(repairedBackslashes), ok: true };
    } catch {
    }
  }
  const repairedLoose = repairLooseJSON(trimmed);
  if (repairedLoose !== trimmed) {
    try {
      return { value: JSON.parse(repairedLoose), ok: true };
    } catch {
    }
  }
  if (trimmed.includes("<") && trimmed.includes(">")) {
    const xmlParsed = parseXMLFragmentValue(trimmed);
    if (xmlParsed.ok) return xmlParsed;
  }
  return { value: null, ok: false };
}
function coerceArrayValue(value, paramName) {
  if (Array.isArray(value)) return value;
  if (typeof value === "object" && value !== null) {
    const keys = Object.keys(value);
    if (keys.length === 1) {
      if (keys[0] === "item") {
        const items = value.item;
        return Array.isArray(items) ? items : [items];
      }
      if (paramName && keys[0] === paramName) {
        const wrapped = value[paramName];
        return Array.isArray(wrapped) ? wrapped : [wrapped];
      }
    }
  }
  return null;
}
function splitTopLevelJSONValues(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const values = [];
  let start = 0;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = 0; i < trimmed.length; i++) {
    const ch = trimmed[i];
    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }
    switch (ch) {
      case '"':
        inString = true;
        break;
      case "{":
      case "[":
        depth++;
        break;
      case "}":
      case "]":
        if (depth > 0) depth--;
        break;
      case ",":
        if (depth === 0) {
          const segment = trimmed.slice(start, i).trim();
          if (!segment) return null;
          values.push(segment);
          start = i + 1;
        }
        break;
    }
  }
  const last = trimmed.slice(start).trim();
  if (!last) return null;
  values.push(last);
  return values.length >= 2 ? values : null;
}
function parseXMLToolCalls(text) {
  let wrappers = findToolCallElementBlocksOutsideIgnored(text);
  if (wrappers.length === 0) {
    const repaired = repairMissingXMLToolCallsOpeningWrapper(text);
    if (repaired !== text) {
      wrappers = findToolCallElementBlocksOutsideIgnored(repaired);
    }
  }
  if (wrappers.length === 0) {
    return null;
  }
  const out = [];
  for (const wrapper of wrappers) {
    for (const block of findXMLElementBlocks(wrapper.Body, "invoke")) {
      const call2 = parseSingleXMLToolCall(block);
      if (call2) {
        out.push(call2);
      }
    }
  }
  return out.length === 0 ? null : out;
}
function findToolCallElementBlocksOutsideIgnored(text) {
  if (!text) return [];
  const out = [];
  let searchFrom = 0;
  while (searchFrom < text.length) {
    const tag = findToolMarkupTagOutsideIgnored(text, searchFrom);
    if (!tag) break;
    if (tag.Closing || tag.Name !== "tool_calls") {
      searchFrom = tag.End + 1;
      continue;
    }
    const closeTag = findMatchingToolMarkupClose(text, tag);
    if (!closeTag) {
      searchFrom = tag.End + 1;
      continue;
    }
    let attrsEnd = tag.End + 1;
    const endLen = xmlTagEndDelimiterLenAt(text, tag.End);
    if (endLen > 0) {
      attrsEnd = tag.End + 1 - endLen;
    }
    out.push({
      Attrs: text.slice(tag.NameEnd, attrsEnd),
      Body: text.slice(tag.End + 1, closeTag.Start),
      Start: tag.Start,
      End: closeTag.End + 1
    });
    searchFrom = closeTag.End + 1;
  }
  return out;
}
function repairMissingXMLToolCallsOpeningWrapper(text) {
  if (firstToolMarkupTagByName(text, "tool_calls", false)) {
    return text;
  }
  const invokeTag = firstToolMarkupTagByName(text, "invoke", false);
  if (!invokeTag) return text;
  const closeTag = lastToolMarkupTagByName(text, "tool_calls", true);
  if (!closeTag || invokeTag.Start >= closeTag.Start) {
    return text;
  }
  return text.slice(0, invokeTag.Start) + "<tool_calls>" + text.slice(invokeTag.Start, closeTag.Start) + "</tool_calls>" + text.slice(closeTag.End + 1);
}
function firstToolMarkupTagByName(text, name, closing) {
  let searchFrom = 0;
  while (searchFrom < text.length) {
    const tag = findToolMarkupTagOutsideIgnored(text, searchFrom);
    if (!tag) break;
    if (tag.Name === name && tag.Closing === closing) {
      return tag;
    }
    searchFrom = tag.End + 1;
  }
  return null;
}
function lastToolMarkupTagByName(text, name, closing) {
  let last = null;
  let searchFrom = 0;
  while (searchFrom < text.length) {
    const tag = findToolMarkupTagOutsideIgnored(text, searchFrom);
    if (!tag) break;
    if (tag.Name === name && tag.Closing === closing) {
      last = tag;
    }
    searchFrom = tag.End + 1;
  }
  return last;
}
function findXMLElementBlocks(text, name) {
  if (!text) return [];
  const out = [];
  let searchFrom = 0;
  while (searchFrom < text.length) {
    const tag = findToolMarkupTagOutsideIgnored(text, searchFrom);
    if (!tag) break;
    if (tag.Closing || tag.Name !== name) {
      searchFrom = tag.End + 1;
      continue;
    }
    if (tag.SelfClosing) {
      let attrsEnd2 = tag.End + 1;
      const endLen2 = xmlTagEndDelimiterLenAt(text, tag.End);
      if (endLen2 > 0) {
        attrsEnd2 = tag.End + 1 - endLen2;
      }
      out.push({
        Attrs: text.slice(tag.NameEnd, attrsEnd2),
        Body: "",
        Start: tag.Start,
        End: tag.End + 1
      });
      searchFrom = tag.End + 1;
      continue;
    }
    const closeTag = findMatchingToolMarkupClose(text, tag);
    if (!closeTag) {
      searchFrom = tag.End + 1;
      continue;
    }
    let attrsEnd = tag.End + 1;
    const endLen = xmlTagEndDelimiterLenAt(text, tag.End);
    if (endLen > 0) {
      attrsEnd = tag.End + 1 - endLen;
    }
    out.push({
      Attrs: text.slice(tag.NameEnd, attrsEnd),
      Body: text.slice(tag.End + 1, closeTag.Start),
      Start: tag.Start,
      End: closeTag.End + 1
    });
    searchFrom = closeTag.End + 1;
  }
  return out;
}
function parseSingleXMLToolCall(block) {
  const attrs = parseXMLTagAttributes(block.Attrs);
  const name = attrs["name"] || "";
  if (!name) return null;
  const input = {};
  for (const paramBlock of findXMLElementBlocks(block.Body, "parameter")) {
    const paramAttrs = parseXMLTagAttributes(paramBlock.Attrs);
    const paramName = paramAttrs["name"];
    if (!paramName) continue;
    const val = parseInvokeParameterValue(paramName, paramBlock.Body);
    input[paramName] = val;
  }
  return { Name: name, Input: input };
}
function parseXMLTagAttributes(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return {};
  const out = {};
  XML_ATTR_PATTERN.lastIndex = 0;
  let match;
  while ((match = XML_ATTR_PATTERN.exec(trimmed)) !== null) {
    const key = match[1].toLowerCase();
    const val = match[2] !== void 0 ? match[2] : match[3];
    out[key] = val;
  }
  return out;
}
function parseInvokeParameterValue(paramName, raw) {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const standaloneCDATA = extractStandaloneCDATA(trimmed);
  if (standaloneCDATA.ok) {
    const value = standaloneCDATA.value;
    try {
      if (/^[-0-9"[{tfnu]/.test(value.trim())) {
        const parsed = JSON.parse(value);
        const coerced = coerceArrayValue(parsed, paramName);
        if (coerced) return coerced;
        return parsed;
      }
    } catch (e) {
    }
    const structured = parseStructuredCDATAParameterValue(paramName, value);
    if (structured.ok) return structured.value;
    const looseArray2 = parseLooseJSONArrayValue(value, paramName);
    if (looseArray2) return looseArray2;
    return value;
  }
  const decoded = decode(parseMarkupValue(trimmed));
  if (decoded.includes("<") && decoded.includes(">")) {
    const { value: parsedValue, ok } = parseXMLFragmentValue(decoded);
    if (ok) {
      if (parsedValue && typeof parsedValue === "object") {
        if (Array.isArray(parsedValue)) return parsedValue;
        const coerced = coerceArrayValue(parsedValue, paramName);
        if (coerced) return coerced;
        return parsedValue;
      }
      if (typeof parsedValue === "string") {
        const text = parsedValue.trim();
        if (!text) return "";
        try {
          if (/^[-0-9"[{tfnu]/.test(text)) {
            const parsedText = JSON.parse(text);
            const coerced = coerceArrayValue(parsedText, paramName);
            if (coerced) return coerced;
            return parsedText;
          }
        } catch (e) {
        }
        const looseArray2 = parseLooseJSONArrayValue(text, paramName);
        if (looseArray2) return looseArray2;
        return parsedValue;
      }
      return parsedValue;
    }
    const parsed = parseStructuredToolCallInput(decoded);
    if (Object.keys(parsed).length > 0) {
      if (Object.keys(parsed).length === 1 && "_raw" in parsed) {
        const rawValue = parsed["_raw"];
        const looseArray2 = parseLooseJSONArrayValue(
          rawValue,
          paramName
        );
        if (looseArray2) return looseArray2;
        return rawValue;
      }
      const coerced = coerceArrayValue(parsed, paramName);
      if (coerced) return coerced;
      return parsed;
    }
  }
  try {
    const dt = decoded.trim();
    if (/^[-0-9"[{tfnu]/.test(dt)) {
      const parsed = JSON.parse(dt);
      const coerced = coerceArrayValue(parsed, paramName);
      if (coerced) return coerced;
      return parsed;
    }
  } catch (e) {
  }
  const looseArray = parseLooseJSONArrayValue(decoded, paramName);
  if (looseArray) return looseArray;
  return decoded;
}
function parseStructuredCDATAParameterValue(paramName, raw) {
  if (preservesCDATAStringParameter(paramName)) {
    return { value: null, ok: false };
  }
  const normalized = normalizeCDATAForStructuredParse(raw);
  if (!normalized.includes("<") || !normalized.includes(">")) {
    return { value: null, ok: false };
  }
  if (!cdataFragmentLooksExplicitlyStructured(normalized)) {
    return { value: null, ok: false };
  }
  const { value, ok } = parseXMLFragmentValue(normalized);
  if (!ok) return { value: null, ok: false };
  if (Array.isArray(value)) return { value, ok: true };
  if (value && typeof value === "object" && Object.keys(value).length > 0) {
    return { value, ok: true };
  }
  return { value: null, ok: false };
}
function normalizeCDATAForStructuredParse(raw) {
  if (!raw) return "";
  const normalized = raw.replace(CDATA_BR_SEPARATOR_PATTERN, "\n");
  return decode(normalized.trim());
}
function cdataFragmentLooksExplicitlyStructured(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return false;
  const tags = trimmed.match(/<[^>]+>/g);
  if (!tags || tags.length < 2) return false;
  if (!trimmed.startsWith("<") || !trimmed.endsWith(">")) return false;
  return true;
}
function preservesCDATAStringParameter(name) {
  const n = name.toLowerCase().trim();
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
  ].includes(n);
}
function parseToolCallsDetailed(text) {
  const result = {
    Calls: [],
    SawToolCallSyntax: false,
    RejectedByPolicy: false,
    RejectedToolNames: []
  };
  const trimmed = text.trim();
  if (!trimmed) return result;
  const stripped = stripFencedCodeBlocks(trimmed);
  const finalTrimmed = stripped.trim();
  if (!finalTrimmed) return result;
  const { text: normalized } = normalizeDSMLToolCallMarkup(finalTrimmed);
  result.SawToolCallSyntax = looksLikeToolCallSyntax(normalized);
  let parsed = parseXMLToolCalls(normalized);
  if ((!parsed || parsed.length === 0) && indexToolCDATAOpen(normalized, 0) >= 0) {
    const recovered = SanitizeLooseCDATA(normalized);
    if (recovered !== normalized) {
      parsed = parseXMLToolCalls(recovered);
    }
  }
  if (!parsed || parsed.length === 0) {
    return result;
  }
  result.SawToolCallSyntax = true;
  const filtered = filterToolCallsDetailed(parsed);
  result.Calls = filtered.calls;
  result.RejectedToolNames = filtered.rejectedNames;
  result.RejectedByPolicy = filtered.rejectedNames.length > 0 && filtered.calls.length === 0;
  return result;
}
function filterToolCallsDetailed(parsed) {
  const calls = [];
  const rejectedNames = [];
  for (const tc of parsed) {
    if (!tc.Name) continue;
    if (!tc.Input) tc.Input = {};
    calls.push(tc);
  }
  return { calls, rejectedNames };
}
function looksLikeToolCallSyntax(text) {
  return text.includes("<tool_calls>") || text.includes("<invoke") || text.includes("<|DSML|");
}
function stripFencedCodeBlocks(text) {
  if (!text) return "";
  const lines = text.split(/\r?\n/);
  let out = "";
  let inFence = false;
  let fenceMarker = "";
  let inCDATA = false;
  let cdataFenceMarker = "";
  let beforeFenceOut = "";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] + (i < lines.length - 1 ? "\n" : "");
    if (inCDATA || cdataStartsBeforeFence(line)) {
      out += line;
      const res = updateCDATAStateForStrip(
        inCDATA,
        cdataFenceMarker,
        line
      );
      inCDATA = res.state;
      cdataFenceMarker = res.fenceMarker;
      continue;
    }
    const trimmed = line.trimStart();
    if (!inFence) {
      const marker = parseFenceOpen(trimmed);
      if (marker) {
        inFence = true;
        fenceMarker = marker;
        beforeFenceOut = out;
        continue;
      }
      out += line;
      continue;
    }
    if (isFenceClose(trimmed, fenceMarker)) {
      inFence = false;
      fenceMarker = "";
    }
  }
  if (inFence) {
    return beforeFenceOut;
  }
  return out;
}
function cdataStartsBeforeFence(line) {
  const cdataIdx = indexToolCDATAOpen(line, 0);
  if (cdataIdx < 0) return false;
  const fenceIdx = firstFenceMarkerIndex(line);
  return fenceIdx < 0 || cdataIdx < fenceIdx;
}
function firstFenceMarkerIndex(line) {
  const idx3 = line.indexOf("```");
  const idxT = line.indexOf("~~~");
  if (idx3 < 0) return idxT;
  if (idxT < 0) return idx3;
  return Math.min(idx3, idxT);
}
function updateCDATAStateForStrip(inCDATA, cdataFenceMarker, line) {
  let pos = 0;
  let state2 = inCDATA;
  let fenceMarker = cdataFenceMarker;
  let lineForFence = line;
  if (!state2) {
    const start = indexToolCDATAOpen(line, pos);
    if (start < 0) return { state: false, fenceMarker: "" };
    pos = start + toolCDATAOpenLenAt(line, start);
    state2 = true;
    lineForFence = line.slice(pos);
  }
  const trimmed = lineForFence.trimStart();
  if (!fenceMarker) {
    const m = parseFenceOpen(trimmed);
    if (m) fenceMarker = m;
  } else if (isFenceClose(trimmed, fenceMarker)) {
    fenceMarker = "";
  }
  while (pos < line.length) {
    let endPos = -1;
    let closeLen = 0;
    for (let search = pos; search < line.length; search++) {
      const foundLen = toolCDATACloseLenAt(line, search);
      if (foundLen > 0) {
        endPos = search;
        closeLen = foundLen;
        break;
      }
    }
    if (endPos < 0) return { state: true, fenceMarker };
    pos = endPos + closeLen;
    if (fenceMarker !== "") continue;
    const tail = line.slice(pos).trimStart();
    if (tail === "" || tail.startsWith("<")) {
      state2 = false;
      const nextStart = indexToolCDATAOpen(line, pos);
      if (nextStart < 0) return { state: false, fenceMarker: "" };
      pos = nextStart + toolCDATAOpenLenAt(line, nextStart);
      state2 = true;
      const trimmedTail = line.slice(pos).trimStart();
      const m = parseFenceOpen(trimmedTail);
      fenceMarker = m || "";
    }
  }
  return { state: state2, fenceMarker };
}
function parseFenceOpen(line) {
  if (line.length < 3) return null;
  const ch = line[0];
  if (ch !== "`" && ch !== "~") return null;
  let count = 0;
  while (count < line.length && line[count] === ch) count++;
  if (count < 3) return null;
  return ch.repeat(count);
}
function isFenceClose(line, marker) {
  if (!marker) return false;
  const ch = marker[0];
  if (!line || line[0] !== ch) return false;
  let count = 0;
  while (count < line.length && line[count] === ch) count++;
  if (count < marker.length) return false;
  return line.slice(count).trim() === "";
}
let StreamToolSieve$1 = class StreamToolSieve {
  constructor() {
    __publicField(this, "state");
    this.state = createToolSieveState();
  }
  processChunk(chunk) {
    if (chunk) {
      this.state.pending += chunk;
    }
    const events2 = [];
    while (true) {
      if (this.state.pendingToolCalls.length > 0) {
        events2.push({
          type: "tool_calls",
          calls: this.state.pendingToolCalls
        });
        this.state.pendingToolRaw = "";
        this.state.pendingToolCalls = [];
        continue;
      }
      if (this.state.capturing) {
        if (this.state.pending) {
          this.state.capture += this.state.pending;
          this.state.pending = "";
        }
        const result = this.consumeToolCapture();
        if (!result.ready) break;
        const captured = this.state.capture;
        this.state.capture = "";
        this.state.capturing = false;
        resetIncrementalToolState(this.state);
        if (result.calls.length > 0) {
          if (result.prefix) {
            noteText(this.state, result.prefix);
            events2.push({ type: "text", text: result.prefix });
          }
          this.state.pendingToolRaw = captured;
          this.state.pendingToolCalls = result.calls;
          if (result.suffix) {
            this.state.pending = result.suffix + this.state.pending;
          }
          continue;
        }
        if (result.prefix) {
          noteText(this.state, result.prefix);
          events2.push({ type: "text", text: result.prefix });
        }
        if (result.suffix) {
          this.state.pending = result.suffix + this.state.pending;
        }
        continue;
      }
      const pending = this.state.pending;
      if (!pending) break;
      const start = this.findToolSegmentStart(pending);
      if (start >= 0) {
        const prefix = pending.slice(0, start);
        if (prefix) {
          noteText(this.state, prefix);
          events2.push({ type: "text", text: prefix });
        }
        this.state.pending = "";
        this.state.capture = pending.slice(start);
        this.state.capturing = true;
        resetIncrementalToolState(this.state);
        continue;
      }
      const [safe, hold] = this.splitSafeContent(pending);
      if (!safe && hold) break;
      this.state.pending = hold;
      if (safe) {
        noteText(this.state, safe);
        events2.push({ type: "text", text: safe });
      }
      if (!safe) break;
    }
    return events2;
  }
  findToolSegmentStart(text) {
    let offset = 0;
    while (true) {
      const tag = findToolMarkupTagOutsideIgnored(text, offset);
      if (!tag) return -1;
      if (insideCodeFenceWithState(this.state, text.slice(0, tag.Start))) {
        offset = tag.End + 1;
        continue;
      }
      if (!tag.Closing && tag.Name === "tool_calls") {
        return tag.Start;
      }
      offset = tag.End + 1;
    }
  }
  splitSafeContent(text) {
    const lastLt = text.lastIndexOf("<");
    if (lastLt >= 0 && lastLt > text.length - 20) {
      return [text.slice(0, lastLt), text.slice(lastLt)];
    }
    return [text, ""];
  }
  consumeToolCapture() {
    const captured = this.state.capture;
    const tag = findToolMarkupTagOutsideIgnored(captured, 0);
    if (tag && !tag.Closing && tag.Name === "tool_calls") {
      const closeTag = findMatchingToolMarkupClose(captured, tag);
      if (closeTag) {
        const fullBlock = captured.slice(tag.Start, closeTag.End + 1);
        const parseResult = parseToolCallsDetailed(fullBlock);
        return {
          ready: true,
          prefix: captured.slice(0, tag.Start),
          calls: parseResult.Calls,
          suffix: captured.slice(closeTag.End + 1)
        };
      }
      return { ready: false, prefix: "", calls: [], suffix: "" };
    }
    return { ready: true, prefix: captured, calls: [], suffix: "" };
  }
  flush() {
    const events2 = this.processChunk("");
    if (this.state.capture) {
      events2.push({ type: "text", text: this.state.capture });
      this.state.capture = "";
    }
    if (this.state.pending) {
      events2.push({ type: "text", text: this.state.pending });
      this.state.pending = "";
    }
    return events2;
  }
};
function buildToolPrompt(tools) {
  if (!tools || tools.length === 0) return "";
  const toolSchemas = [];
  const names = [];
  for (const t of tools) {
    if (t.type !== "function" || !t.function) continue;
    const name = t.function.name;
    const desc = t.function.description || "No description available";
    const parameters = JSON.stringify(t.function.parameters || {});
    names.push(name);
    toolSchemas.push(
      `Tool: ${name}
Description: ${desc}
Parameters: ${parameters}`
    );
  }
  if (names.length === 0) return "";
  const descriptions = "You have access to these tools:\n\n" + toolSchemas.join("\n\n");
  let fullPrompt = descriptions + "\n\n" + buildToolCallInstructions(names);
  if (hasReadLikeTool(names)) {
    fullPrompt += "\n\n" + READ_TOOL_CACHE_GUARD;
  }
  return fullPrompt;
}
function parseDSMLToolCalls(xmlContent, tools) {
  const result = parseToolCalls(xmlContent);
  let calls = result.calls.map((c) => ({
    Name: c.name !== void 0 ? c.name : c.Name,
    Input: c.input !== void 0 ? c.input : c.Input
  }));
  if (tools && tools.length > 0) {
    calls = normalizeParsedToolCallsForSchemas(calls, tools);
  }
  return calls.map((c) => ({
    id: `call_${crypto$1.randomUUID().replace(/-/g, "")}`,
    type: "function",
    function: {
      name: c.Name,
      arguments: JSON.stringify(c.Input)
    }
  }));
}
class StreamToolSieve2 {
  constructor(tools) {
    __publicField(this, "sieve");
    __publicField(this, "tools");
    __publicField(this, "toolCallCounter", 0);
    this.sieve = new StreamToolSieve$1();
    this.tools = tools;
  }
  processChunk(text) {
    const events2 = this.sieve.processChunk(text);
    let outputText = "";
    let toolCalls = null;
    for (const ev of events2) {
      if (ev.type === "text" && ev.text) {
        outputText += ev.text;
      } else if (ev.type === "tool_calls" && ev.calls) {
        let callsToNormalize = ev.calls.map((c) => ({
          Name: c.name !== void 0 ? c.name : c.Name,
          Input: c.input !== void 0 ? c.input : c.Input
        }));
        if (this.tools && this.tools.length > 0) {
          callsToNormalize = normalizeParsedToolCallsForSchemas(
            callsToNormalize,
            this.tools
          );
        }
        const formatted = callsToNormalize.map((c) => ({
          index: this.toolCallCounter++,
          id: `call_${crypto$1.randomUUID().replace(/-/g, "")}`,
          type: "function",
          function: {
            name: c.Name,
            arguments: JSON.stringify(c.Input)
          }
        }));
        toolCalls = [...toolCalls || [], ...formatted];
      }
    }
    return { outputText, toolCalls };
  }
  flush() {
    const events2 = this.sieve.flush();
    let outputText = "";
    let toolCalls = null;
    for (const ev of events2) {
      if (ev.type === "text" && ev.text) {
        outputText += ev.text;
      } else if (ev.type === "tool_calls" && ev.calls) {
        let callsToNormalize = ev.calls.map((c) => ({
          Name: c.name !== void 0 ? c.name : c.Name,
          Input: c.input !== void 0 ? c.input : c.Input
        }));
        if (this.tools && this.tools.length > 0) {
          callsToNormalize = normalizeParsedToolCallsForSchemas(
            callsToNormalize,
            this.tools
          );
        }
        const formatted = callsToNormalize.map((c) => ({
          index: this.toolCallCounter++,
          id: `call_${crypto$1.randomUUID().replace(/-/g, "")}`,
          type: "function",
          function: {
            name: c.Name,
            arguments: JSON.stringify(c.Input)
          }
        }));
        toolCalls = [...toolCalls || [], ...formatted];
      }
    }
    return { outputText, toolCalls };
  }
}
const fileCache = /* @__PURE__ */ new Map();
function buildRulesText(systemMessages) {
  const parts = [
    `# ${RULES_FILENAME}`,
    "",
    "## Output Integrity",
    OUTPUT_INTEGRITY_GUARD
  ];
  if (systemMessages.length > 0) {
    parts.push("");
    parts.push("## System Instructions");
    for (const msg of systemMessages) {
      const trimmed = msg.trim();
      if (trimmed) {
        parts.push("");
        parts.push(trimmed);
      }
    }
  }
  return parts.join("\n") + "\n";
}
function buildToolsText(tools) {
  const toolPrompt = buildToolPrompt(tools);
  if (!toolPrompt) return "";
  return `# ${TOOLS_FILENAME}
Available tool descriptions and parameter schemas for this request.

${toolPrompt}
`;
}
async function uploadRuleFiles(token, systemMessages, tools, port) {
  const rulesText = buildRulesText(systemMessages);
  const toolsText = buildToolsText(tools);
  const rulesHash = simpleHash(rulesText);
  const toolsHash = simpleHash(toolsText);
  const cached = fileCache.get(token);
  if (cached && cached.rulesHash === rulesHash && cached.toolsHash === toolsHash && Date.now() - cached.createdAt < 25 * 60 * 1e3) {
    const refFileIds2 = [cached.rulesFileId];
    if (cached.toolsFileId) refFileIds2.push(cached.toolsFileId);
    return {
      rulesFileId: cached.rulesFileId,
      toolsFileId: cached.toolsFileId,
      refFileIds: refFileIds2
    };
  }
  const rulesFileId = await uploadTextFile(
    token,
    RULES_FILENAME,
    rulesText,
    port
  );
  let toolsFileId = null;
  if (toolsText.trim()) {
    toolsFileId = await uploadTextFile(
      token,
      TOOLS_FILENAME,
      toolsText,
      port
    );
  }
  fileCache.set(token, {
    rulesFileId,
    toolsFileId,
    toolsHash,
    rulesHash,
    createdAt: Date.now()
  });
  const refFileIds = [rulesFileId];
  if (toolsFileId) refFileIds.push(toolsFileId);
  return { rulesFileId, toolsFileId, refFileIds };
}
function clearRuleFileCache(token) {
  fileCache.delete(token);
}
function clearAllRuleFileCache() {
  fileCache.clear();
}
function buildLivePrompt(userMessage, hasToolsFile, hasMemoryFile = false) {
  let instruction = `Follow the instructions in the attached ${RULES_FILENAME}.`;
  if (hasToolsFile) {
    instruction += ` Available tool descriptions and parameter schemas are attached in ${TOOLS_FILENAME}; use only those tools and follow the tool-call format rules described there.`;
  }
  if (hasMemoryFile) {
    instruction += ` Also refer to the attached ${MEMORY_FILENAME$1} file for complete context, session history, and step-by-step progress/tool outputs. Use it to coordinate your actions and do not repeat completed tasks.`;
  }
  return `${instruction}

${userMessage}`;
}
async function uploadTextFile(token, filename, content, port) {
  var _a, _b, _c, _d, _e;
  const proxyUrl = getProxyForToken(token);
  const httpsAgent = getProxyAgent(proxyUrl);
  const powResponse = await axios.post(
    DEEPSEEK_CREATE_POW_URL,
    { target_path: "/api/v0/file/upload_file" },
    {
      headers: getHistoryHeaders(token),
      validateStatus: () => true,
      httpsAgent
    }
  );
  if (powResponse.status !== 200 || ((_a = powResponse.data) == null ? void 0 : _a.code) !== 0) {
    throw new Error(`[rule-uploader] PoW challenge failed for ${filename}`);
  }
  const challenge = (_d = (_c = (_b = powResponse.data) == null ? void 0 : _b.data) == null ? void 0 : _c.biz_data) == null ? void 0 : _d.challenge;
  const powHeaderStr = solveAndBuildHeader(challenge);
  const formData = new FormData$1();
  const buffer = Buffer.from(content, "utf-8");
  formData.append("file", Readable$1.from(buffer), {
    filename,
    contentType: CONTENT_TYPE,
    knownLength: buffer.length
  });
  const headers = {
    ...getHistoryHeaders(token),
    "x-ds-pow-response": powHeaderStr,
    "x-file-size": String(buffer.length),
    ...formData.getHeaders()
  };
  const response = await axios.post(DEEPSEEK_UPLOAD_FILE_URL, formData, {
    headers,
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
    validateStatus: () => true,
    httpsAgent
  });
  if (response.status !== 200 || ((_e = response.data) == null ? void 0 : _e.code) !== 0) {
    throw new Error(
      `[rule-uploader] Upload failed for ${filename}: ${response.status} ${JSON.stringify(response.data).slice(0, 200)}`
    );
  }
  const fileId = extractFileId(response.data);
  if (!fileId) {
    throw new Error(
      `[rule-uploader] Upload succeeded but no file ID for ${filename}: ${JSON.stringify(response.data).slice(0, 300)}`
    );
  }
  const initialStatus = extractFileStatus(response.data);
  if (!isReadyFileStatus(initialStatus)) {
    logWithPort(
      port,
      `[rule-uploader] Uploaded ${filename} → ${fileId.slice(0, 12)}... (status: ${initialStatus}, waiting for ready...)`
    );
    await waitForFileReady(token, fileId, filename, port);
  } else {
    logWithPort(
      port,
      `[rule-uploader] Uploaded ${filename} → ${fileId.slice(0, 12)}... (ready)`
    );
  }
  return fileId;
}
async function waitForFileReady(token, fileId, filename, port) {
  for (let attempt = 0; attempt < FILE_READY_POLL_ATTEMPTS; attempt++) {
    await sleep(FILE_READY_POLL_INTERVAL_MS);
    try {
      const status = await fetchFileStatus(token, fileId);
      if (isReadyFileStatus(status)) {
        logWithPort(
          port,
          `[rule-uploader] ${filename} ready after ${attempt + 1} poll(s)`
        );
        return;
      }
    } catch (err) {
      logWithPort(
        port,
        `[rule-uploader] poll error for ${filename} (attempt ${attempt + 1}): ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }
  logWithPort(
    port,
    `[rule-uploader] ${filename} (${fileId.slice(0, 12)}...) did not reach 'processed' after ${FILE_READY_POLL_ATTEMPTS} polls, proceeding anyway`
  );
}
async function fetchFileStatus(token, fileId) {
  var _a;
  const proxyUrl = getProxyForToken(token);
  const httpsAgent = getProxyAgent(proxyUrl);
  const url2 = `${DEEPSEEK_FETCH_FILES_URL}?file_ids=${encodeURIComponent(fileId)}`;
  const response = await axios.get(url2, {
    headers: getHistoryHeaders(token),
    validateStatus: () => true,
    httpsAgent
  });
  if (response.status !== 200 || ((_a = response.data) == null ? void 0 : _a.code) !== 0) {
    throw new Error(`fetch_files failed: ${response.status}`);
  }
  return findFileStatusInResponse(response.data, fileId);
}
function findFileStatusInResponse(data, targetId) {
  if (!data || typeof data !== "object") return "";
  if (Array.isArray(data)) {
    for (const item of data) {
      const found = findFileStatusInResponse(item, targetId);
      if (found) return found;
    }
    return "";
  }
  const id = data.id || data.file_id || "";
  if (typeof id === "string" && id.trim() === targetId) {
    return (data.status || data.file_status || "").toString().trim();
  }
  for (const key of Object.keys(data)) {
    const val = data[key];
    if (val && typeof val === "object") {
      const found = findFileStatusInResponse(val, targetId);
      if (found) return found;
    }
  }
  return "";
}
function isReadyFileStatus(status) {
  switch (status.toLowerCase().trim()) {
    case "processed":
    case "ready":
    case "done":
    case "available":
    case "success":
    case "completed":
    case "finished":
      return true;
    default:
      return false;
  }
}
function extractFileId(data) {
  if (!data || typeof data !== "object") return null;
  const searchQueue = [data];
  const rawData = data.data;
  if (rawData && typeof rawData === "object") {
    searchQueue.push(rawData);
    const bizData = rawData.biz_data;
    if (bizData && typeof bizData === "object") {
      searchQueue.push(bizData);
    }
  }
  const searchMaps = [...searchQueue];
  for (const parent of searchQueue) {
    for (const key of ["file", "biz_data", "data", "files"]) {
      const val = parent[key];
      if (val && typeof val === "object") {
        if (Array.isArray(val)) {
          for (const item of val) {
            if (item && typeof item === "object") {
              searchMaps.push(item);
            }
          }
        } else {
          searchMaps.push(val);
        }
      }
    }
  }
  for (const m of searchMaps) {
    if (!m || typeof m !== "object") continue;
    const idVal = m.id || m.file_id || m.fileId;
    if (typeof idVal === "string" && idVal.trim()) {
      return idVal.trim();
    }
  }
  const findId = (obj) => {
    if (!obj || typeof obj !== "object") return null;
    const r = obj;
    const idVal = r.id || r.file_id || r.fileId;
    if (typeof idVal === "string" && idVal.trim()) {
      return idVal.trim();
    }
    for (const key of Object.keys(r)) {
      const val = r[key];
      if (val && typeof val === "object") {
        const res = findId(val);
        if (res) return res;
      }
    }
    return null;
  };
  return findId(data);
}
function extractFileStatus(data) {
  if (!data || typeof data !== "object") return "uploaded";
  const searchQueue = [data];
  const rawData = data.data;
  if (rawData && typeof rawData === "object") {
    searchQueue.push(rawData);
    const bizData = rawData.biz_data;
    if (bizData && typeof bizData === "object") {
      searchQueue.push(bizData);
    }
  }
  const searchMaps = [...searchQueue];
  for (const parent of searchQueue) {
    for (const key of ["file", "biz_data", "data", "files"]) {
      const val = parent[key];
      if (val && typeof val === "object") {
        if (Array.isArray(val)) {
          for (const item of val) {
            if (item && typeof item === "object") {
              searchMaps.push(item);
            }
          }
        } else {
          searchMaps.push(val);
        }
      }
    }
  }
  for (const m of searchMaps) {
    if (!m || typeof m !== "object") continue;
    const statusVal = m.status || m.file_status || m.fileStatus;
    if (typeof statusVal === "string" && statusVal.trim()) {
      return statusVal.trim();
    }
  }
  const findStatus = (obj) => {
    if (!obj || typeof obj !== "object") return null;
    const r = obj;
    const statusVal = r.status || r.file_status || r.fileStatus;
    if (typeof statusVal === "string" && statusVal.trim()) {
      return statusVal.trim();
    }
    for (const key of Object.keys(r)) {
      const val = r[key];
      if (val && typeof val === "object") {
        const res = findStatus(val);
        if (res) return res;
      }
    }
    return null;
  };
  return findStatus(data) || "uploaded";
}
function simpleHash(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text.charCodeAt(i);
    hash = (hash << 5) - hash + ch | 0;
  }
  return hash.toString(36);
}
function sleep(ms2) {
  return new Promise((resolve2) => setTimeout(resolve2, ms2));
}
function estimateTokenCount(text) {
  if (!text) return 0;
  let cjk = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (CJK_RANGES.some((r) => c >= r.start && c <= r.end)) cjk++;
  }
  const ascii = text.length - cjk;
  return Math.ceil(ascii / 4 + cjk / 1.5);
}
class SessionManager {
  constructor(contextWindow = DEFAULT_CONTEXT_WINDOW) {
    __publicField(this, "sessions", /* @__PURE__ */ new Map());
    __publicField(this, "contextWindow");
    this.contextWindow = contextWindow;
  }
  async getSession(token, incomingPromptTokens) {
    const existing = this.sessions.get(token);
    if (existing) {
      const projectedTokens = existing.totalTokens + incomingPromptTokens + RESPONSE_RESERVE;
      const threshold = this.contextWindow * COMPRESS_THRESHOLD;
      if (projectedTokens < threshold && existing.history.length < MAX_HISTORY_MESSAGES) {
        existing.lastUsedAt = Date.now();
        existing.requestCount++;
        return { sessionId: existing.sessionId, isNew: false };
      }
      console.log(
        `[session-mgr] Context approaching limit (${existing.totalTokens}/${this.contextWindow} tokens, ${existing.history.length} messages). Compressing...`
      );
      await this.compressAndRotate(token, existing);
      const rotated = this.sessions.get(token);
      if (rotated) {
        return { sessionId: rotated.sessionId, isNew: true };
      }
    }
    const sessionId = await createSession(token);
    this.sessions.set(token, {
      sessionId,
      token,
      history: [],
      totalTokens: 0,
      createdAt: Date.now(),
      lastUsedAt: Date.now(),
      requestCount: 1,
      contextSummary: "",
      lastMessageId: null
    });
    return { sessionId, isNew: true };
  }
  recordExchange(token, userPrompt, assistantResponse, assistantMessageId, toolCalls) {
    const session2 = this.sessions.get(token);
    if (!session2) return;
    const userTokens = estimateTokenCount(userPrompt);
    const assistantTokens = estimateTokenCount(assistantResponse);
    session2.history.push({
      role: "user",
      content: userPrompt,
      tokenEstimate: userTokens,
      timestamp: Date.now()
    });
    session2.history.push({
      role: "assistant",
      content: assistantResponse,
      tokenEstimate: assistantTokens,
      timestamp: Date.now(),
      tool_calls: toolCalls || void 0
    });
    session2.totalTokens += userTokens + assistantTokens;
    session2.lastUsedAt = Date.now();
    if (assistantMessageId) {
      session2.lastMessageId = assistantMessageId;
    }
  }
  /**
   * Get the parent message ID for the next request.
   */
  getParentMessageId(token) {
    var _a;
    return ((_a = this.sessions.get(token)) == null ? void 0 : _a.lastMessageId) || null;
  }
  getContextSummary(token) {
    var _a;
    return ((_a = this.sessions.get(token)) == null ? void 0 : _a.contextSummary) || "";
  }
  getSessionInfo(token) {
    const session2 = this.sessions.get(token);
    if (!session2) {
      return {
        sessionId: null,
        requestCount: 0,
        totalTokens: 0,
        historyMessages: 0,
        hasCompressedContext: false
      };
    }
    return {
      sessionId: session2.sessionId,
      requestCount: session2.requestCount,
      totalTokens: session2.totalTokens,
      historyMessages: session2.history.length,
      hasCompressedContext: !!session2.contextSummary
    };
  }
  async resetSession(token) {
    const existing = this.sessions.get(token);
    if (existing) {
      deleteSession(token, existing.sessionId).catch(() => {
      });
      this.sessions.delete(token);
    }
    clearRuleFileCache(token);
  }
  async cleanup() {
    for (const [token, session2] of this.sessions) {
      deleteSession(token, session2.sessionId).catch(() => {
      });
    }
    this.sessions.clear();
    clearAllRuleFileCache();
  }
  cleanupStale(maxIdleMs = 30 * 60 * 1e3) {
    const now = Date.now();
    for (const [token, session2] of this.sessions) {
      if (now - session2.lastUsedAt > maxIdleMs) {
        console.log(
          `[session-mgr] Cleaning stale session ${session2.sessionId.slice(0, 8)}... (idle ${Math.round((now - session2.lastUsedAt) / 6e4)}min)`
        );
        deleteSession(token, session2.sessionId).catch(() => {
        });
        this.sessions.delete(token);
        clearRuleFileCache(token);
      }
    }
  }
  async compressAndRotate(token, existing) {
    const summary = this.buildCompressedSummary(existing);
    deleteSession(token, existing.sessionId).catch(() => {
    });
    const newSessionId = await createSession(token);
    this.sessions.set(token, {
      sessionId: newSessionId,
      token,
      history: [],
      totalTokens: estimateTokenCount(summary),
      createdAt: Date.now(),
      lastUsedAt: Date.now(),
      requestCount: 1,
      contextSummary: summary,
      lastMessageId: null
      // Reset ID chain on compression rotation
    });
    console.log(
      `[session-mgr] Compressed ${existing.history.length} messages (${existing.totalTokens} tokens) → summary (${estimateTokenCount(summary)} tokens). New session: ${newSessionId.slice(0, 8)}...`
    );
  }
  buildCompressedSummary(session2) {
    const parts = [];
    if (session2.contextSummary) {
      parts.push(
        "[Previous context summary]\n" + this.truncateText(session2.contextSummary, 2e3)
      );
    }
    if (session2.history.length === 0) return parts.join("\n\n");
    const recentCount = Math.min(6, session2.history.length);
    const older = session2.history.slice(0, -recentCount);
    const recent = session2.history.slice(-recentCount);
    if (older.length > 0) {
      const olderSummary = this.summarizeMessages(older);
      if (olderSummary) {
        parts.push(
          `[Conversation history summary — ${older.length} messages, ${session2.requestCount} exchanges]
` + olderSummary
        );
      }
    }
    if (recent.length > 0) {
      const recentText = recent.map((m) => {
        const label = m.role.toUpperCase();
        const content = this.truncateText(m.content, 4e3);
        return `[${label}]
${content}`;
      }).join("\n\n");
      parts.push("[Recent conversation — keep for context]\n" + recentText);
    }
    return parts.join("\n\n---\n\n");
  }
  summarizeMessages(messages) {
    var _a, _b;
    const topics = /* @__PURE__ */ new Set();
    const toolCalls = [];
    const keyDecisions = [];
    for (const msg of messages) {
      const toolMatches = msg.content.match(
        /<\|DSML\|invoke name="([^"]+)"/g
      );
      if (toolMatches) {
        for (const m of toolMatches) {
          const name = (_a = m.match(/name="([^"]+)"/)) == null ? void 0 : _a[1];
          if (name) toolCalls.push(name);
        }
      }
      if (msg.role === "user") {
        const firstLine = (_b = msg.content.split("\n")[0]) == null ? void 0 : _b.trim();
        if (firstLine && firstLine.length < 200) {
          topics.add(firstLine);
        }
      }
      const fileMatches = msg.content.match(
        /(?:\/[\w.-]+)+\.\w+|[\w.-]+\.(?:ts|js|go|py|tsx|jsx|css|html|json)/g
      );
      if (fileMatches) {
        for (const f of fileMatches.slice(0, 10)) {
          topics.add(`File: ${f}`);
        }
      }
    }
    const parts = [];
    if (topics.size > 0) {
      const topicList = [...topics].slice(0, 15).join("\n- ");
      parts.push(`Topics discussed:
- ${topicList}`);
    }
    if (toolCalls.length > 0) {
      const uniqueTools = [...new Set(toolCalls)];
      parts.push(`Tools used: ${uniqueTools.join(", ")}`);
    }
    if (keyDecisions.length > 0) {
      parts.push(`Key decisions:
- ${keyDecisions.join("\n- ")}`);
    }
    parts.push(
      `Total exchanges: ${Math.ceil(messages.length / 2)}, Total tokens: ~${messages.reduce((s, m) => s + m.tokenEstimate, 0)}`
    );
    return parts.join("\n");
  }
  truncateText(text, maxLen) {
    if (text.length <= maxLen) return text;
    const truncated = text.slice(0, maxLen);
    const lastNewline = truncated.lastIndexOf("\n");
    const cutPoint = lastNewline > maxLen * 0.5 ? lastNewline : maxLen;
    return truncated.slice(0, cutPoint) + "\n... [truncated]";
  }
}
function appendNoThinkingVariants(models) {
  const out = [];
  for (const model of models) {
    out.push(model);
    out.push({ ...model, id: model.id + NO_THINKING_SUFFIX });
  }
  return out;
}
const ALL_MODELS = appendNoThinkingVariants(DEEPSEEK_BASE_MODELS);
function getModelConfig(model) {
  const { base, noThinking } = splitNoThinking(model);
  switch (base) {
    case "deepseek-v4-flash":
    case "deepseek-v4-pro":
    case "deepseek-v4-vision":
      return { thinking: !noThinking, search: false, ok: true };
    case "deepseek-v4-flash-search":
    case "deepseek-v4-pro-search":
      return { thinking: !noThinking, search: true, ok: true };
    default:
      return { thinking: false, search: false, ok: false };
  }
}
function getModelType(model) {
  const { base } = splitNoThinking(model);
  switch (base) {
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
function isSupportedModel(model) {
  return getModelConfig(model).ok;
}
const DEFAULT_MODEL_ALIASES = {
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
function resolveModel(requested, customAliases) {
  const model = requested.trim().toLowerCase();
  if (!model) return null;
  const aliases = { ...DEFAULT_MODEL_ALIASES, ...customAliases || {} };
  if (isSupportedModel(model)) return model;
  const mapped = aliases[model];
  if (mapped && isSupportedModel(mapped)) return mapped;
  const { base, noThinking } = splitNoThinking(model);
  const baseMapped = aliases[base];
  if (baseMapped && isSupportedModel(baseMapped)) {
    return noThinking ? baseMapped + NO_THINKING_SUFFIX : baseMapped;
  }
  return null;
}
function splitNoThinking(model) {
  const m = model.trim().toLowerCase();
  if (m.endsWith(NO_THINKING_SUFFIX)) {
    return { base: m.slice(0, -NO_THINKING_SUFFIX.length), noThinking: true };
  }
  return { base: m, noThinking: false };
}
function openAIModelsResponse() {
  return { object: "list", data: ALL_MODELS };
}
function isFragmentStatusPath(path2) {
  if (!path2 || path2 === "response/status") return false;
  if (!path2.startsWith("response/fragments/") || !path2.endsWith("/status"))
    return false;
  const mid = path2.slice("response/fragments/".length, path2.length - "/status".length).replace(/^-/, "");
  return mid.length > 0 && /^\d+$/.test(mid);
}
function shouldSkipPath(path2) {
  if (isFragmentStatusPath(path2)) return true;
  if (SKIP_EXACT_PATHS.has(path2)) return true;
  for (const p of SKIP_CONTAINS_PATTERNS) {
    if (path2.includes(p)) return true;
  }
  return false;
}
function isStatusPath(path2) {
  return path2 === "response/status" || path2 === "status";
}
function stripThinkTags(s) {
  return s.replace(THINK_CLOSE_PATTERN, "").replace(THINK_OPEN_PATTERN, "");
}
function parseDeepSeekSSELine(raw) {
  const line = raw.trim();
  if (!line || !line.startsWith("data:")) return [null, false, false];
  const dataStr = line.slice(5).trim();
  if (dataStr === "[DONE]") return [null, true, true];
  try {
    const chunk = JSON.parse(dataStr);
    return [chunk, false, true];
  } catch {
    return [null, false, false];
  }
}
function parseSSEChunkForContent(chunk, thinkingEnabled, currentFragmentType) {
  const v = chunk["v"];
  if (v === void 0) {
    return {
      parts: [],
      finished: false,
      nextType: currentFragmentType,
      messageId: null
    };
  }
  const path2 = chunk["p"] ?? "";
  if (shouldSkipPath(path2)) {
    return {
      parts: [],
      finished: false,
      nextType: currentFragmentType,
      messageId: null
    };
  }
  if (isStatusPath(path2) && typeof v === "string") {
    if (v.trim().toUpperCase() === "FINISHED") {
      return {
        parts: [],
        finished: true,
        nextType: currentFragmentType,
        messageId: null
      };
    }
    return {
      parts: [],
      finished: false,
      nextType: currentFragmentType,
      messageId: null
    };
  }
  let newType = currentFragmentType;
  const parts = [];
  if (path2 === "response/content") newType = "text";
  else if (path2 === "response/thinking_content") {
    if (!thinkingEnabled || newType !== "text") newType = "thinking";
  }
  if (path2 === "response/fragments" && (chunk["o"] ?? "").toString().toUpperCase() === "APPEND") {
    const frags = Array.isArray(v) ? v : [];
    for (const frag of frags) {
      if (typeof frag !== "object" || !frag) continue;
      const { typeName, content } = parseFragmentTypeContent(frag);
      switch (typeName) {
        case "THINK":
        case "THINKING":
          newType = "thinking";
          if (content) parts.push({ text: content, type: "thinking" });
          break;
        case "RESPONSE":
          newType = "text";
          if (content) parts.push({ text: content, type: "text" });
          break;
        default:
          if (content) parts.push({ text: content, type: "text" });
      }
    }
  }
  if (path2 === "response" && Array.isArray(v)) {
    for (const it of v) {
      if (typeof it !== "object" || !it) continue;
      if (it.p !== "fragments" || it.o !== "APPEND") continue;
      const frags = Array.isArray(it.v) ? it.v : [];
      for (const frag of frags) {
        if (typeof frag !== "object" || !frag) continue;
        const { typeName } = parseFragmentTypeContent(frag);
        if (typeName === "THINK" || typeName === "THINKING")
          newType = "thinking";
        else if (typeName === "RESPONSE") newType = "text";
      }
    }
  }
  let partType;
  if (path2 === "response/thinking_content") {
    partType = !thinkingEnabled || newType !== "text" ? "thinking" : "text";
  } else if (path2 === "response/content") {
    partType = "text";
  } else if (path2.includes("response/fragments") && path2.includes("/content")) {
    partType = newType;
  } else if (path2 === "") {
    partType = newType || "text";
  } else {
    partType = "text";
  }
  const appendResult = appendChunkValueContent(v, partType, path2);
  if (appendResult.finished) {
    return { parts: [], finished: true, nextType: newType, messageId: null };
  }
  parts.push(...appendResult.parts);
  if (appendResult.newType) newType = appendResult.newType;
  const { parts: splitParts, transitioned } = splitThinkingParts(parts);
  if (transitioned) newType = "text";
  const finalParts = thinkingEnabled ? splitParts : splitParts.filter((p) => p.type !== "thinking");
  return {
    parts: finalParts,
    finished: false,
    nextType: newType,
    messageId: extractMessageId(chunk)
  };
}
function extractMessageId(chunk) {
  const id = chunk["response_message_id"] ?? chunk["message_id"];
  if (typeof id === "number" && id > 0) return id;
  const v = chunk["v"];
  if (typeof v === "object" && v !== null) {
    const msgId = v["message_id"] ?? v["id"];
    if (typeof msgId === "number" && msgId > 0) return msgId;
    const resp = v["response"];
    if (typeof resp === "object" && resp !== null) {
      const respId = resp["message_id"] ?? resp["id"];
      if (typeof respId === "number" && respId > 0) return respId;
    }
  }
  return null;
}
function parseFragmentTypeContent(m) {
  const typeName = (m.type || "").toUpperCase();
  const content = m.content || "";
  return { typeName, content };
}
function appendChunkValueContent(v, partType, path2) {
  const parts = [];
  if (typeof v === "string") {
    if (v === "FINISHED" && (path2 === "" || path2 === "status")) {
      return { parts: [], finished: true };
    }
    if (isStatusPath(path2)) return { parts: [], finished: false };
    if (v) parts.push({ text: v, type: partType });
    return { parts, finished: false };
  }
  if (Array.isArray(v)) {
    const result = extractContentRecursive(v, partType);
    if (result.finished) return { parts: [], finished: true };
    return { parts: result.parts, finished: false };
  }
  if (typeof v === "object" && v !== null) {
    if (path2 === "response/content" || path2 === "response/thinking_content" || path2 === "") {
      const text = v.text || v.content || "";
      if (text) {
        parts.push({ text, type: partType });
        return { parts, finished: false };
      }
    }
    const resp = v.response || v;
    const frags = resp == null ? void 0 : resp.fragments;
    if (Array.isArray(frags)) {
      let newType;
      for (const item of frags) {
        if (typeof item !== "object" || !item) continue;
        const { typeName, content } = parseFragmentTypeContent(item);
        switch (typeName) {
          case "THINK":
          case "THINKING":
            newType = "thinking";
            if (content)
              parts.push({ text: content, type: "thinking" });
            break;
          case "RESPONSE":
            newType = "text";
            if (content) parts.push({ text: content, type: "text" });
            break;
          default:
            if (content)
              parts.push({ text: content, type: partType });
        }
      }
      return { parts, finished: false, newType };
    }
  }
  return { parts, finished: false };
}
function extractContentRecursive(items, defaultType) {
  const parts = [];
  for (const it of items) {
    if (typeof it !== "object" || !it) continue;
    const itemPath = it.p || "";
    const itemV = it.v;
    if (itemV === void 0) continue;
    if (isStatusPath(itemPath)) {
      if (typeof itemV === "string" && itemV.trim().toUpperCase() === "FINISHED") {
        return { parts: [], finished: true };
      }
      continue;
    }
    if (shouldSkipPath(itemPath)) continue;
    if (typeof it.content === "string" && it.content) {
      const typeName = (it.type || "").toUpperCase();
      switch (typeName) {
        case "THINK":
        case "THINKING":
          parts.push({ text: it.content, type: "thinking" });
          break;
        case "RESPONSE":
          parts.push({ text: it.content, type: "text" });
          break;
        default:
          parts.push({ text: it.content, type: defaultType });
      }
      continue;
    }
    const partType = itemPath.includes("thinking") ? "thinking" : itemPath.includes("content") || itemPath === "response" || itemPath === "fragments" ? "text" : defaultType;
    if (typeof itemV === "string") {
      if (isStatusPath(itemPath)) continue;
      if (itemV && itemV !== "FINISHED") {
        parts.push({ text: itemV, type: partType });
      }
    } else if (Array.isArray(itemV)) {
      for (const inner of itemV) {
        if (typeof inner === "object" && (inner == null ? void 0 : inner.content)) {
          const typeName = (inner.type || "").toUpperCase();
          switch (typeName) {
            case "THINK":
            case "THINKING":
              parts.push({ text: inner.content, type: "thinking" });
              break;
            case "RESPONSE":
              parts.push({ text: inner.content, type: "text" });
              break;
            default:
              parts.push({
                text: inner.content,
                type: partType
              });
          }
        } else if (typeof inner === "string" && inner) {
          parts.push({ text: inner, type: partType });
        }
      }
    }
  }
  return { parts, finished: false };
}
function splitThinkingParts(parts) {
  const out = [];
  let thinkingDone = false;
  for (const p of parts) {
    if (thinkingDone && p.type === "thinking") {
      const cleaned = stripThinkTags(p.text);
      if (cleaned) out.push({ text: cleaned, type: "text" });
      continue;
    }
    if (p.type !== "thinking") {
      const cleaned = stripThinkTags(p.text);
      if (cleaned) out.push({ text: cleaned, type: p.type });
      continue;
    }
    const match = THINK_CLOSE_PATTERN.exec(p.text);
    THINK_CLOSE_PATTERN.lastIndex = 0;
    if (!match) {
      out.push(p);
      continue;
    }
    thinkingDone = true;
    const before = p.text.slice(0, match.index);
    const after = stripThinkTags(
      p.text.slice(match.index + match[0].length)
    );
    if (before) out.push({ text: before, type: "thinking" });
    if (after) out.push({ text: after, type: "text" });
  }
  return { parts: out, transitioned: thinkingDone };
}
function hasContentFilterStatus(chunk) {
  const code = chunk.code;
  if (typeof code === "string" && code.trim().toLowerCase() === "content_filter")
    return true;
  return hasContentFilterStatusValue(chunk);
}
function hasContentFilterStatusValue(v) {
  if (Array.isArray(v))
    return v.some((item) => hasContentFilterStatusValue(item));
  if (typeof v === "object" && v !== null) {
    const p = v.p;
    if (typeof p === "string" && p.toLowerCase().includes("status")) {
      if (typeof v.v === "string" && v.v.trim().toLowerCase() === "content_filter")
        return true;
    }
    if (typeof v.code === "string" && v.code.trim().toLowerCase() === "content_filter")
      return true;
    for (const val of Object.values(v)) {
      if (hasContentFilterStatusValue(val)) return true;
    }
  }
  return false;
}
const markdownImagePattern = /!\[(.*?)\]\((.*?)\)/g;
function isValidXMLName(name) {
  return /^[A-Za-z_][A-Za-z0-9_.:-]*$/.test(name.trim());
}
function escapeXMLAttribute(text) {
  return text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function renderPromptToolXMLNode(name, value, indent) {
  const trimmedName = name.trim();
  if (!isValidXMLName(trimmedName)) return "";
  if (value === null || value === void 0) {
    return `${indent}<${trimmedName}></${trimmedName}>`;
  }
  if (typeof value === "object") {
    const innerIndent = indent + "  ";
    let body = "";
    if (Array.isArray(value)) {
      body = value.map(
        (item) => renderPromptToolXMLNode(trimmedName, item, innerIndent)
      ).filter(Boolean).join("\n");
      return body;
    } else {
      const keys = Object.keys(value).sort();
      body = keys.map(
        (key) => renderPromptToolXMLNode(key, value[key], innerIndent)
      ).filter(Boolean).join("\n");
    }
    if (!body.trim()) {
      return `${indent}<${trimmedName}></${trimmedName}>`;
    }
    return `${indent}<${trimmedName}>
${body}
${indent}</${trimmedName}>`;
  }
  return `${indent}<${trimmedName}>${renderPromptCDATA(String(value))}</${trimmedName}>`;
}
function renderPromptParameterNode(name, value, indent) {
  const trimmedName = name.trim();
  if (!trimmedName) return "";
  if (value === null || value === void 0) {
    return `${indent}<|DSML|parameter name="${escapeXMLAttribute(trimmedName)}"></|DSML|parameter>`;
  }
  if (typeof value === "object") {
    const innerIndent = indent + "  ";
    let body = "";
    if (Array.isArray(value)) {
      body = value.map(
        (item) => renderPromptToolXMLNode("item", item, innerIndent)
      ).filter(Boolean).join("\n");
    } else {
      const keys = Object.keys(value).sort();
      body = keys.map(
        (key) => renderPromptToolXMLNode(key, value[key], innerIndent)
      ).filter(Boolean).join("\n");
    }
    if (!body.trim()) {
      return `${indent}<|DSML|parameter name="${escapeXMLAttribute(trimmedName)}"></|DSML|parameter>`;
    }
    return `${indent}<|DSML|parameter name="${escapeXMLAttribute(trimmedName)}">
${body}
${indent}</|DSML|parameter>`;
  }
  return `${indent}<|DSML|parameter name="${escapeXMLAttribute(trimmedName)}">${renderPromptCDATA(String(value))}</|DSML|parameter>`;
}
function normalizeContent(v) {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (Array.isArray(v)) {
    const texts = [];
    for (const item of v) {
      if (typeof item !== "object" || item === null) continue;
      const obj = item;
      const typeStr = (typeof obj.type === "string" ? obj.type : "").toLowerCase().trim();
      if (typeStr === "text" || typeStr === "output_text" || typeStr === "input_text") {
        const txt = typeof obj.text === "string" ? obj.text : typeof obj.content === "string" ? obj.content : "";
        if (txt) texts.push(txt);
      }
    }
    if (texts.length > 0) return texts.join("\n");
  }
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}
function normalizeRole(role) {
  const r = (role || "user").toLowerCase().trim();
  if (r === "developer") return "system";
  return r;
}
function renderPromptCDATA(text) {
  if (!text) return "";
  if (text.includes("]]>")) {
    return "<![CDATA[" + text.replace(/]]>/g, "]]]><![CDATA[>") + "]]>";
  }
  return "<![CDATA[" + text + "]]>";
}
function formatToolCallsForPrompt(toolCalls) {
  if (!Array.isArray(toolCalls) || toolCalls.length === 0) return "";
  const blocks = [];
  for (const item of toolCalls) {
    if (typeof item !== "object" || item === null) continue;
    const call2 = item;
    let name = "";
    let argsRaw = null;
    const fn = call2.function;
    if (fn && typeof fn === "object") {
      name = typeof fn.name === "string" ? fn.name.trim() : "";
      argsRaw = fn.arguments ?? fn.input ?? null;
    }
    if (!name) {
      name = typeof call2.name === "string" ? call2.name.trim() : "";
      if (!argsRaw) argsRaw = call2.arguments ?? call2.input ?? null;
    }
    if (!name) continue;
    let args = null;
    if (typeof argsRaw === "string") {
      const trimmed = argsRaw.trim();
      if (trimmed) {
        try {
          args = JSON.parse(trimmed);
        } catch {
        }
      }
    } else if (typeof argsRaw === "object" && argsRaw !== null) {
      args = argsRaw;
    }
    let paramLines = "";
    if (args && typeof args === "object" && !Array.isArray(args)) {
      paramLines = Object.entries(args).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => renderPromptParameterNode(k, v, "    ")).filter(Boolean).join("\n");
    } else if (typeof argsRaw === "string" && argsRaw.trim()) {
      paramLines = renderPromptParameterNode("content", argsRaw, "    ");
    }
    if (paramLines) {
      blocks.push(
        `  <|DSML|invoke name="${escapeXMLAttribute(name)}">
${paramLines}
  </|DSML|invoke>`
      );
    } else {
      blocks.push(
        `  <|DSML|invoke name="${escapeXMLAttribute(name)}"></|DSML|invoke>`
      );
    }
  }
  if (blocks.length === 0) return "";
  return "<|DSML|tool_calls>\n" + blocks.join("\n") + "\n</|DSML|tool_calls>";
}
function buildPromptText(messages, tools) {
  if (!Array.isArray(messages) || messages.length === 0) return "";
  const toolPrompt = buildToolPrompt(tools || []);
  const normalized = [];
  normalized.push({ role: "system", content: OUTPUT_INTEGRITY_GUARD });
  let systemInjected = false;
  for (const msg of messages) {
    const role = normalizeRole(msg.role);
    let content = normalizeContent(msg.content);
    if (role === "assistant") {
      const toolHistory = formatToolCallsForPrompt(msg.tool_calls);
      if (toolHistory) {
        content = content ? content + "\n\n" + toolHistory : toolHistory;
      }
    } else if (role === "system") {
      if (toolPrompt && !systemInjected) {
        content = content ? content + "\n\n" + toolPrompt : toolPrompt;
        systemInjected = true;
      }
    } else if (role === "tool") {
      if (!content.trim()) content = "null";
    }
    normalized.push({ role, content });
  }
  if (toolPrompt && !systemInjected) {
    normalized.splice(1, 0, { role: "system", content: toolPrompt });
  }
  const merged = [];
  for (const msg of normalized) {
    if (merged.length > 0 && merged[merged.length - 1].role === msg.role) {
      merged[merged.length - 1].content += "\n\n" + msg.content;
    } else {
      merged.push({ ...msg });
    }
  }
  const parts = [BEGIN_SENTENCE];
  let lastRole = "";
  for (const msg of merged) {
    lastRole = msg.role;
    switch (msg.role) {
      case "system": {
        const text = msg.content.trim();
        if (text) {
          parts.push(SYSTEM_MARKER + text + END_INSTRUCTIONS);
        }
        break;
      }
      case "user":
        parts.push(USER_MARKER + msg.content);
        break;
      case "assistant":
        parts.push(ASSISTANT_MARKER + msg.content + END_SENTENCE);
        break;
      case "tool": {
        const text = msg.content.trim();
        if (text) {
          parts.push(TOOL_MARKER + text + END_TOOL_RESULTS);
        }
        break;
      }
      default: {
        const text = msg.content.trim();
        if (text) parts.push(text);
        break;
      }
    }
  }
  if (lastRole !== "assistant") {
    parts.push(ASSISTANT_MARKER);
  }
  const out = parts.join("");
  return out.replace(markdownImagePattern, "[$1]($2)");
}
function extractSystemAndUserMessages(messages) {
  const systemMessages = [];
  const conversationMessages = [];
  for (const msg of messages) {
    const role = normalizeRole(msg.role);
    const content = normalizeContent(msg.content);
    if (role === "system" || role === "developer") {
      if (content.trim()) {
        systemMessages.push(content);
      }
    } else {
      conversationMessages.push(msg);
    }
  }
  return { systemMessages, conversationMessages };
}
function buildUserOnlyPromptText(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return "";
  const normalized = [];
  for (const msg of messages) {
    const role = normalizeRole(msg.role);
    let content = normalizeContent(msg.content);
    if (role === "assistant") {
      const toolHistory = formatToolCallsForPrompt(msg.tool_calls);
      if (toolHistory) {
        content = content ? content + "\n\n" + toolHistory : toolHistory;
      }
    } else if (role === "tool") {
      if (!content.trim()) content = "null";
    }
    normalized.push({ role, content });
  }
  const merged = [];
  for (const msg of normalized) {
    if (merged.length > 0 && merged[merged.length - 1].role === msg.role) {
      merged[merged.length - 1].content += "\n\n" + msg.content;
    } else {
      merged.push({ ...msg });
    }
  }
  const parts = [BEGIN_SENTENCE];
  let lastRole = "";
  for (const msg of merged) {
    lastRole = msg.role;
    switch (msg.role) {
      case "user":
        parts.push(USER_MARKER + msg.content);
        break;
      case "assistant":
        parts.push(ASSISTANT_MARKER + msg.content + END_SENTENCE);
        break;
      case "tool": {
        const text = msg.content.trim();
        if (text) {
          parts.push(TOOL_MARKER + text + END_TOOL_RESULTS);
        }
        break;
      }
      default: {
        const text = msg.content.trim();
        if (text) parts.push(text);
        break;
      }
    }
  }
  if (lastRole !== "assistant") {
    parts.push(ASSISTANT_MARKER);
  }
  const out = parts.join("");
  return out.replace(markdownImagePattern, "[$1]($2)");
}
function resolveThinkingAndSearch(request, modelDefaults) {
  const resolved = { ...modelDefaults };
  const [thinkingOverride, hasThinkingOverride] = resolveThinkingOverride(request);
  if (hasThinkingOverride) {
    resolved.thinking = thinkingOverride;
  }
  const [searchOverride, hasSearchOverride] = resolveSearchOverride(request);
  if (hasSearchOverride) {
    resolved.search = searchOverride;
  }
  return resolved;
}
function resolveThinkingOverride(req) {
  if (!req) return [false, false];
  const [t1, ok1] = parseThinkingSetting(req.thinking);
  if (ok1) return [t1, true];
  const [t2, ok2] = parseReasoningSetting(req.reasoning);
  if (ok2) return [t2, true];
  const [t3, ok3] = parseReasoningEffort(req.reasoning_effort);
  if (ok3) return [t3, true];
  if (req.extra_body && typeof req.extra_body === "object") {
    const eb = req.extra_body;
    const [et1, eok1] = parseThinkingSetting(eb.thinking);
    if (eok1) return [et1, true];
    const [et2, eok2] = parseReasoningSetting(eb.reasoning);
    if (eok2) return [et2, true];
    const [et3, eok3] = parseReasoningEffort(eb.reasoning_effort);
    if (eok3) return [et3, true];
  }
  return [false, false];
}
function resolveSearchOverride(req) {
  if (!req) return [false, false];
  const s1 = req.search ?? req.search_enabled;
  if (typeof s1 === "boolean") return [s1, true];
  if (req.extra_body && typeof req.extra_body === "object") {
    const eb = req.extra_body;
    const es = eb.search ?? eb.search_enabled;
    if (typeof es === "boolean") return [es, true];
  }
  return [false, false];
}
function parseThinkingSetting(raw) {
  if (typeof raw === "boolean") return [raw, true];
  if (typeof raw === "string") {
    const s = raw.toLowerCase().trim();
    if (["enabled", "enable", "on", "true"].includes(s))
      return [true, true];
    if (["disabled", "disable", "off", "false", "none"].includes(s))
      return [false, true];
    return [false, false];
  }
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    if (raw.type !== void 0) {
      return parseThinkingSetting(raw.type);
    }
  }
  return [false, false];
}
function parseReasoningSetting(raw) {
  if (typeof raw === "boolean") return [raw, true];
  if (typeof raw === "string") {
    return parseReasoningEffort(raw);
  }
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    for (const key of ["effort", "type", "enabled"]) {
      const [val, ok] = parseReasoningSetting(raw[key]);
      if (ok) return [val, true];
    }
  }
  return [false, false];
}
function parseReasoningEffort(raw) {
  const s = String(raw ?? "").toLowerCase().trim();
  if (["minimal", "low", "medium", "high", "xhigh"].includes(s))
    return [true, true];
  if (["none", "disabled", "disable", "off", "false"].includes(s))
    return [false, true];
  return [false, false];
}
function sanitizeLeakedOutput(text) {
  if (!text) return text;
  let out = text;
  out = out.replace(EMPTY_JSON_FENCE_PATTERN, "");
  out = out.replace(LEAKED_TOOL_CALL_ARRAY_PATTERN, "");
  out = out.replace(LEAKED_TOOL_RESULT_BLOB_PATTERN, "");
  out = stripDanglingThinkSuffix(out);
  out = out.replace(LEAKED_THINK_TAG_PATTERN, "");
  out = out.replace(LEAKED_BOS_MARKER_PATTERN, "");
  out = out.replace(LEAKED_THOUGHT_MARKER_PATTERN, "");
  out = out.replace(LEAKED_META_MARKER_PATTERN, "");
  out = stripLeakedToolCallWrapperBlocks(out);
  out = sanitizeLeakedAgentXMLBlocks(out);
  return out;
}
function stripDanglingThinkSuffix(text) {
  const thinkTag = /<\/?\s*think\s*>/gi;
  const matches = [];
  let m;
  while ((m = thinkTag.exec(text)) !== null) {
    matches.push({ index: m.index, match: m[0] });
  }
  if (matches.length === 0) return text;
  let depth = 0;
  let lastOpen = -1;
  for (const { index, match } of matches) {
    const compact2 = match.replace(/\s/g, "").toLowerCase();
    if (compact2.startsWith("</")) {
      if (depth > 0) {
        depth--;
        if (depth === 0) lastOpen = -1;
      }
      continue;
    }
    if (depth === 0) lastOpen = index;
    depth++;
  }
  if (depth === 0 || lastOpen < 0) return text;
  const prefix = text.slice(0, lastOpen);
  if (!prefix.trim()) return "";
  return prefix;
}
function stripLeakedToolCallWrapperBlocks(text) {
  if (!text) return text;
  let out = "";
  let pos = 0;
  while (pos < text.length) {
    const tag = findToolMarkupTagOutsideIgnored(text, pos);
    if (!tag) {
      out += text.slice(pos);
      break;
    }
    if (tag.Start > pos) {
      out += text.slice(pos, tag.Start);
    }
    if (tag.Closing || tag.Name !== "tool_calls") {
      out += text.slice(tag.Start, tag.End + 1);
      pos = tag.End + 1;
      continue;
    }
    const closeTag = findMatchingToolMarkupClose(text, tag);
    if (!closeTag) {
      out += text.slice(tag.Start, tag.End + 1);
      pos = tag.End + 1;
      continue;
    }
    pos = closeTag.End + 1;
  }
  return out;
}
function sanitizeLeakedAgentXMLBlocks(text) {
  let out = text;
  for (const pattern of LEAKED_AGENT_XML_BLOCK_PATTERNS) {
    pattern.lastIndex = 0;
    out = out.replace(pattern, (_match, _open, inner, _close) => {
      return inner.replace(LEAKED_AGENT_RESULT_TAG_PATTERN, "");
    });
  }
  LEAKED_AGENT_WRAPPER_TAG_PATTERN.lastIndex = 0;
  if (LEAKED_AGENT_WRAPPER_TAG_PATTERN.test(out)) {
    LEAKED_AGENT_WRAPPER_PLUS_RESULT_OPEN_PATTERN.lastIndex = 0;
    out = out.replace(
      LEAKED_AGENT_WRAPPER_PLUS_RESULT_OPEN_PATTERN,
      (match) => {
        LEAKED_AGENT_RESULT_TAG_PATTERN.lastIndex = 0;
        return match.replace(LEAKED_AGENT_RESULT_TAG_PATTERN, "");
      }
    );
    LEAKED_AGENT_RESULT_PLUS_WRAPPER_CLOSE_PATTERN.lastIndex = 0;
    out = out.replace(
      LEAKED_AGENT_RESULT_PLUS_WRAPPER_CLOSE_PATTERN,
      (match) => {
        LEAKED_AGENT_RESULT_TAG_PATTERN.lastIndex = 0;
        return match.replace(LEAKED_AGENT_RESULT_TAG_PATTERN, "");
      }
    );
    LEAKED_AGENT_WRAPPER_TAG_PATTERN.lastIndex = 0;
    out = out.replace(LEAKED_AGENT_WRAPPER_TAG_PATTERN, "");
  }
  return out;
}
function stripReferenceMarkers(text) {
  if (!text) return text;
  return text.replace(CITATION_MARKER_PATTERN, "");
}
function cleanVisibleOutput(text, stripRefMarkers = true) {
  if (!text) return text;
  let out = text;
  if (stripRefMarkers) {
    out = stripReferenceMarkers(out);
  }
  return sanitizeLeakedOutput(out);
}
function trimContinuationOverlap(accumulated, newChunk) {
  if (!accumulated || !newChunk) return newChunk;
  const maxOverlap = Math.min(accumulated.length, newChunk.length);
  if (maxOverlap === 0) return newChunk;
  let bestOverlap = 0;
  for (let len = maxOverlap; len >= 1; len--) {
    const tail = accumulated.slice(-len);
    const head = newChunk.slice(0, len);
    if (tail === head) {
      bestOverlap = len;
      break;
    }
  }
  if (bestOverlap === 0) return newChunk;
  return newChunk.slice(bestOverlap);
}
class StreamTextAccumulator {
  constructor() {
    __publicField(this, "buffer", "");
  }
  append(text) {
    const trimmed = trimContinuationOverlap(this.buffer, text);
    if (trimmed) {
      this.buffer += trimmed;
    }
    return trimmed;
  }
  get text() {
    return this.buffer;
  }
  reset() {
    this.buffer = "";
  }
}
function shouldRetryEmptyOutput(visibleText, hasToolCalls, contentFilter, attempts, maxAttempts = EMPTY_OUTPUT_RETRY_MAX_ATTEMPTS) {
  return attempts < maxAttempts && !contentFilter && !hasToolCalls && !visibleText.trim();
}
function clonePayloadForEmptyOutputRetry(payload, parentMessageId) {
  const clone = { ...payload };
  const original = typeof payload.prompt === "string" ? payload.prompt : "";
  clone.prompt = appendEmptyOutputRetrySuffix(original);
  if (parentMessageId && parentMessageId > 0) {
    clone.parent_message_id = parentMessageId;
  }
  return clone;
}
function appendEmptyOutputRetrySuffix(prompt) {
  const trimmed = prompt.replace(/[\r\n\t ]+$/, "");
  if (!trimmed) return EMPTY_OUTPUT_RETRY_SUFFIX;
  return `${trimmed}

${EMPTY_OUTPUT_RETRY_SUFFIX}`;
}
function buildContextMemoryText(messages, sessionId) {
  var _a, _b;
  const parts = [];
  parts.push(`# ShallowSeek Context Memory`);
  parts.push("");
  parts.push(`*Active Session:* \`${sessionId}\``);
  parts.push(`*Generated At:* ${(/* @__PURE__ */ new Date()).toISOString()}`);
  parts.push("");
  let goal = "Not specified.";
  for (const msg of messages) {
    if (msg.role === "user") {
      const content = typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content);
      if (content.trim()) {
        const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);
        if (lines.length > 0) {
          goal = lines.slice(0, 3).join("\n");
          break;
        }
      }
    }
  }
  parts.push(`## 🎯 Primary Goal`);
  parts.push(goal);
  parts.push("");
  const filesMentioned = /* @__PURE__ */ new Set();
  const filePattern = /(?:\/[\w.-]+)+\.\w+|[\w.-]+\.(?:ts|js|go|py|tsx|jsx|css|html|json|md|sh)/g;
  for (const msg of messages) {
    const content = typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content);
    const matches = content.match(filePattern);
    if (matches) {
      for (const m of matches) {
        filesMentioned.add(m);
      }
    }
  }
  if (filesMentioned.size > 0) {
    parts.push(`## 📁 Files Involved`);
    for (const file of filesMentioned) {
      parts.push(`- \`${file}\``);
    }
    parts.push("");
  }
  parts.push(`## ⏱️ Execution Timeline & Steps`);
  parts.push("");
  let stepNum = 1;
  for (const msg of messages) {
    const role = msg.role;
    const content = typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content);
    if (role === "system" || role === "developer") {
      continue;
    }
    if (role === "user") {
      parts.push(`### Step ${stepNum++}: User Request`);
      parts.push(content);
      parts.push("");
    } else if (role === "assistant") {
      parts.push(`### Step ${stepNum++}: Assistant Action`);
      const msgWithReasoning = msg;
      if (msgWithReasoning.reasoning_content && typeof msgWithReasoning.reasoning_content === "string") {
        parts.push(`#### Reasoning:`);
        parts.push(msgWithReasoning.reasoning_content);
        parts.push("");
      }
      if (content && content.trim() && content !== "(response recorded)") {
        parts.push(`#### Response:`);
        parts.push(content);
        parts.push("");
      }
      if (msg.tool_calls && Array.isArray(msg.tool_calls) && msg.tool_calls.length > 0) {
        parts.push(`#### Called Tools:`);
        for (const tc of msg.tool_calls) {
          const fnName = ((_a = tc.function) == null ? void 0 : _a.name) || tc.name || "unknown";
          const fnArgs = ((_b = tc.function) == null ? void 0 : _b.arguments) || tc.arguments || "{}";
          parts.push(`- **Tool:** \`${fnName}\``);
          parts.push(`  **Arguments:** \`${fnArgs}\``);
        }
        parts.push("");
      }
    } else if (role === "tool") {
      const msgWithId = msg;
      const toolId = msgWithId.tool_call_id || msgWithId.name || "unknown";
      parts.push(
        `### Step ${stepNum++}: Tool Execution Result (ID: \`${toolId}\`)`
      );
      const maxLines = 150;
      const lines = content.split("\n");
      if (lines.length > maxLines) {
        const startLines = lines.slice(0, 50).join("\n");
        const endLines = lines.slice(-50).join("\n");
        parts.push("```");
        parts.push(startLines);
        parts.push(
          `
... [TRUNCATED ${lines.length - 100} LINES OF TOOL OUTPUT] ...
`
        );
        parts.push(endLines);
        parts.push("```");
      } else {
        parts.push("```");
        parts.push(content);
        parts.push("```");
      }
      parts.push("");
    }
  }
  return parts.join("\n");
}
async function uploadContextMemory(token, messages, sessionId, port) {
  const memoryText = buildContextMemoryText(messages, sessionId);
  return await uploadTextFile(token, MEMORY_FILENAME$1, memoryText, port);
}
async function handleChatCompletions(req, res, state2) {
  var _a;
  const reqStart = Date.now();
  const body = await readBody(req);
  let request;
  try {
    request = JSON.parse(body);
  } catch {
    jsonResponse(res, 400, {
      error: { message: "Invalid JSON", type: "invalid_request_error" }
    });
    return;
  }
  const streamMode = request.stream ? "stream" : "sync";
  const requestedModel = request.model || "(none)";
  const resolvedModel = resolveModel(
    request.model,
    state2.config.modelAliases
  );
  if (!resolvedModel) {
    logWithPort(
      state2.port,
      `[api] ✗ completion rejected — unsupported model: ${requestedModel}`
    );
    jsonResponse(res, 400, {
      error: {
        message: `Model '${request.model}' is not supported`,
        type: "invalid_request_error"
      }
    });
    return;
  }
  const modelAlias = requestedModel !== resolvedModel ? `${requestedModel} → ${resolvedModel}` : resolvedModel;
  logWithPort(
    state2.port,
    `[api] ⟶ completion ${streamMode} | model: ${modelAlias} | msgs: ${((_a = request.messages) == null ? void 0 : _a.length) || 0}`
  );
  const modelDefaults = getModelConfig(resolvedModel);
  const { thinking, search } = resolveThinkingAndSearch(request, modelDefaults);
  const modelType = getModelType(resolvedModel);
  const token = getNextToken(state2);
  if (!token) {
    logWithPort(
      state2.port,
      `[api] ✗ completion failed — no available accounts`
    );
    jsonResponse(res, 503, {
      error: { message: "No available accounts", type: "api_error" }
    });
    return;
  }
  state2.sessionManager.cleanupStale();
  let sessionId;
  try {
    const { systemMessages, conversationMessages } = extractSystemAndUserMessages(request.messages);
    const tools = request.tools || [];
    const prompt = buildUserOnlyPromptText(conversationMessages);
    const promptTokens = estimateTokens(prompt);
    const sessionResult = await state2.sessionManager.getSession(
      token,
      promptTokens
    );
    sessionId = sessionResult.sessionId;
    const parentMessageId = state2.sessionManager.getParentMessageId(token);
    const sessionInfo = state2.sessionManager.getSessionInfo(token);
    const sessionTag = sessionResult.isNew ? "new" : `reuse #${sessionInfo.requestCount}`;
    logWithPort(
      state2.port,
      `[api]   session: ${sessionId.slice(0, 8)}... (${sessionTag}, ~${sessionInfo.totalTokens} tokens, parent: ${parentMessageId || "none"})`
    );
    let refFileIds = [];
    let finalPrompt = prompt;
    let hasMemoryFile = false;
    let hasToolsFile = false;
    let rulesSucceeded = false;
    try {
      const ruleFiles = await uploadRuleFiles(
        token,
        systemMessages,
        tools,
        state2.port
      );
      refFileIds = ruleFiles.refFileIds;
      hasToolsFile = ruleFiles.toolsFileId !== null;
      rulesSucceeded = true;
      logWithPort(
        state2.port,
        `[api]   rule-files: rules=${ruleFiles.rulesFileId.slice(0, 8)}... tools=${ruleFiles.toolsFileId ? ruleFiles.toolsFileId.slice(0, 8) + "..." : "none"}`
      );
    } catch (ruleErr) {
      const message = ruleErr instanceof Error ? ruleErr.message : String(ruleErr);
      logWithPort(
        state2.port,
        `[api]   rule-file upload failed, falling back to inline: ${message}`
      );
    }
    try {
      const memoryFileId = await uploadContextMemory(
        token,
        request.messages,
        sessionId,
        state2.port
      );
      if (memoryFileId) {
        refFileIds.push(memoryFileId);
        hasMemoryFile = true;
        logWithPort(
          state2.port,
          `[api]   context-memory uploaded: fileId=${memoryFileId.slice(0, 8)}...`
        );
      }
    } catch (memErr) {
      const message = memErr instanceof Error ? memErr.message : String(memErr);
      logWithPort(
        state2.port,
        `[api]   ⚠ context memory upload failed: ${message}`
      );
    }
    const contextSummary = state2.sessionManager.getContextSummary(token);
    if (rulesSucceeded) {
      const userPrompt = contextSummary ? `[Compressed context from previous conversation]
${contextSummary}

---

${prompt}` : prompt;
      finalPrompt = buildLivePrompt(
        userPrompt,
        hasToolsFile,
        hasMemoryFile
      );
    } else {
      finalPrompt = buildPromptText(request.messages, tools);
      if (contextSummary) {
        finalPrompt = `[Compressed context from previous conversation]
${contextSummary}

---

${finalPrompt}`;
      }
      if (hasMemoryFile) {
        finalPrompt = `Also refer to the attached ${MEMORY_FILENAME$1} file for complete context, session history, and step-by-step progress/tool outputs. Use it to coordinate your actions and do not repeat completed tasks.

${finalPrompt}`;
      }
    }
    const powResponse = await getPow(token);
    logWithPort(state2.port, `[api]   pow: solved`);
    const payload = {
      chat_session_id: sessionId,
      prompt: finalPrompt,
      ref_file_ids: refFileIds,
      thinking_enabled: thinking,
      search_enabled: search,
      parent_message_id: parentMessageId
    };
    if (modelType) {
      payload.model_class = modelType;
    }
    let lastMessageId = null;
    let completionResult = null;
    if (request.stream) {
      completionResult = await handleStreamWithRetry(
        res,
        state2,
        token,
        payload,
        powResponse,
        resolvedModel,
        thinking,
        tools
      );
    } else {
      completionResult = await handleNonStreamWithRetry(
        res,
        state2,
        token,
        payload,
        powResponse,
        resolvedModel,
        finalPrompt,
        thinking,
        tools
      );
    }
    if (completionResult) {
      lastMessageId = completionResult.lastMessageId;
      state2.sessionManager.recordExchange(
        token,
        prompt,
        completionResult.contentText || "(response recorded)",
        lastMessageId,
        completionResult.toolCalls
      );
    } else {
      state2.sessionManager.recordExchange(
        token,
        prompt,
        "(response recorded)",
        null
      );
    }
    const elapsed = ((Date.now() - reqStart) / 1e3).toFixed(1);
    logWithPort(
      state2.port,
      `[api] ✓ completion done | model: ${resolvedModel} | ${streamMode} | ${elapsed}s`
    );
  } catch (err) {
    const message = getErrorMessage(err);
    const elapsed = ((Date.now() - reqStart) / 1e3).toFixed(1);
    logWithPort(
      state2.port,
      `[api] ✗ completion error (${elapsed}s): ${message}`
    );
    if (message.includes("create session failed")) {
      await state2.sessionManager.resetSession(token);
    }
    jsonResponse(res, 500, {
      error: {
        message: message || "Completion failed",
        type: "api_error"
      }
    });
  }
}
async function handleNonStreamWithRetry(res, state2, token, payload, pow2, model, prompt, thinkingEnabled, tools) {
  let currentPayload = { ...payload };
  let currentPow = pow2;
  let currentToken = token;
  let attempts = 0;
  let accountSwitchAttempted = false;
  const running = true;
  while (running) {
    const dsResponse = await callCompletion(
      currentToken,
      currentPayload,
      currentPow
    );
    if (dsResponse.status === 429 && !accountSwitchAttempted) {
      const altToken = getAlternateToken(state2, currentToken);
      if (altToken) {
        accountSwitchAttempted = true;
        logWithPort(
          state2.port,
          `[api]   ⟲ 429 rate limit — rotating to alternate account`
        );
        currentToken = altToken;
        try {
          const newSession = await createSession(altToken);
          currentPayload = {
            ...currentPayload,
            chat_session_id: newSession
          };
          delete currentPayload.parent_message_id;
          currentPow = await getPow(altToken);
          continue;
        } catch (switchErr) {
          logWithPort(
            state2.port,
            `[api]   ✗ account switch failed: ${getErrorMessage(switchErr)}`
          );
        }
      }
    }
    if (dsResponse.status !== 200) {
      const errData = await streamToString(dsResponse.data);
      logWithPort(
        state2.port,
        `[api] ✗ DeepSeek error ${dsResponse.status}: ${errData.slice(0, 200)}`
      );
      if (dsResponse.status === 422 || dsResponse.status === 400) {
        logWithPort(
          state2.port,
          `[api]   resetting session due to error...`
        );
        await state2.sessionManager.resetSession(currentToken);
      }
      jsonResponse(res, dsResponse.status, {
        error: {
          message: `DeepSeek API error: ${dsResponse.status}`,
          type: "api_error"
        }
      });
      return null;
    }
    const result = await collectNonStreamResponse(
      dsResponse.data,
      thinkingEnabled,
      tools
    );
    if (shouldRetryEmptyOutput(
      result.contentText,
      result.toolCalls !== void 0 && result.toolCalls.length > 0,
      result.finishReason === "content_filter",
      attempts,
      EMPTY_OUTPUT_RETRY_MAX_ATTEMPTS
    )) {
      attempts++;
      logWithPort(
        state2.port,
        `[api]   ⟲ empty output — retry #${attempts} (parent: ${result.lastMessageId || "none"})`
      );
      currentPayload = clonePayloadForEmptyOutputRetry(
        currentPayload,
        result.lastMessageId
      );
      try {
        currentPow = await getPow(currentToken);
      } catch {
        logWithPort(
          state2.port,
          `[api]   ⚠ retry PoW fetch failed, reusing original`
        );
      }
      continue;
    }
    const cleanedContent = cleanVisibleOutput(result.contentText);
    const cleanedThinking = thinkingEnabled ? cleanVisibleOutput(result.thinkingText) : "";
    let finalToolCalls = result.toolCalls;
    if ((!finalToolCalls || finalToolCalls.length === 0) && !cleanedContent.trim()) {
      const thinkingSource = result.thinkingText || cleanedThinking || "";
      if (thinkingSource.trim()) {
        const thinkingParsed = parseToolCallsDetailed(thinkingSource);
        if (thinkingParsed.Calls.length > 0) {
          logWithPort(
            state2.port,
            `[api]   ↗ recovered ${thinkingParsed.Calls.length} tool call(s) from thinking content`
          );
          let calls = thinkingParsed.Calls;
          if (tools && tools.length > 0) {
            calls = normalizeParsedToolCallsForSchemas(
              calls,
              tools
            );
          }
          finalToolCalls = calls.map((c) => ({
            id: `call_${crypto$1.randomUUID().replace(/-/g, "")}`,
            type: "function",
            function: {
              name: c.Name,
              arguments: JSON.stringify(c.Input)
            }
          }));
        }
      }
    }
    const finishReason = finalToolCalls && finalToolCalls.length > 0 ? "tool_calls" : result.finishReason;
    const completionId = `chatcmpl-${crypto$1.randomUUID().replace(/-/g, "").slice(0, 24)}`;
    const created = Math.floor(Date.now() / 1e3);
    const responseBody = {
      id: completionId,
      object: "chat.completion",
      created,
      model,
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: cleanedContent,
            ...thinkingEnabled && cleanedThinking ? { reasoning_content: cleanedThinking } : {},
            ...finalToolCalls && finalToolCalls.length > 0 ? { tool_calls: finalToolCalls } : {}
          },
          finish_reason: finishReason
        }
      ],
      usage: {
        prompt_tokens: estimateTokens(prompt),
        completion_tokens: estimateTokens(
          result.contentText + result.thinkingText
        ),
        total_tokens: estimateTokens(
          prompt + result.contentText + result.thinkingText
        )
      }
    };
    jsonResponse(res, 200, responseBody);
    return {
      lastMessageId: result.lastMessageId,
      contentText: cleanedContent,
      thinkingText: cleanedThinking,
      toolCalls: finalToolCalls
    };
  }
  return null;
}
async function collectNonStreamResponse(stream2, thinkingEnabled, tools) {
  let thinkingText = "";
  let contentText = "";
  let currentType = thinkingEnabled ? "thinking" : "text";
  let finishReason = "stop";
  let lastMessageId = null;
  const raw = await streamToString(stream2);
  const lines = raw.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const [parsed, isDone, isValid] = parseDeepSeekSSELine(trimmed);
    if (!isValid || isDone) continue;
    if (!parsed) continue;
    if (hasContentFilterStatus(parsed)) {
      finishReason = "content_filter";
      break;
    }
    const { parts, finished, nextType, messageId } = parseSSEChunkForContent(
      parsed,
      thinkingEnabled,
      currentType
    );
    if (messageId) {
      lastMessageId = messageId;
    }
    currentType = nextType;
    if (finished) break;
    for (const part of parts) {
      if (part.type === "thinking") {
        thinkingText += part.text;
      } else {
        contentText += part.text;
      }
    }
  }
  let toolCalls = void 0;
  const toolStartIdx = contentText.indexOf("<|DSML|tool_calls>");
  const toolEndIdx = contentText.indexOf("</|DSML|tool_calls>");
  if (toolStartIdx !== -1 && toolEndIdx !== -1) {
    const fullXml = contentText.substring(
      toolStartIdx,
      toolEndIdx + "</|DSML|tool_calls>".length
    );
    const parsedTools = parseDSMLToolCalls(
      fullXml,
      tools
    );
    if (parsedTools.length > 0) {
      toolCalls = parsedTools;
      contentText = contentText.substring(0, toolStartIdx);
      if (finishReason === "stop") finishReason = "tool_calls";
    }
  }
  return { thinkingText, contentText, finishReason, lastMessageId, toolCalls };
}
async function handleStreamWithRetry(res, state2, token, payload, pow2, model, thinkingEnabled, tools) {
  let currentToken = token;
  let currentPayload = { ...payload };
  let currentPow = pow2;
  const dsResponse = await callCompletion(
    currentToken,
    currentPayload,
    currentPow
  );
  if (dsResponse.status === 429) {
    const altToken = getAlternateToken(state2, currentToken);
    if (altToken) {
      logWithPort(
        state2.port,
        `[api]   ⟲ 429 rate limit — rotating to alternate account (stream)`
      );
      try {
        const newSession = await createSession(altToken);
        currentPayload = {
          ...currentPayload,
          chat_session_id: newSession
        };
        delete currentPayload.parent_message_id;
        currentPow = await getPow(altToken);
        currentToken = altToken;
        const retryResponse = await callCompletion(
          currentToken,
          currentPayload,
          currentPow
        );
        if (retryResponse.status === 200) {
          logWithPort(state2.port, `[api]   streaming response...`);
          return handleStreamResponse(
            res,
            retryResponse.data,
            model,
            thinkingEnabled,
            state2,
            tools
          );
        }
      } catch (switchErr) {
        logWithPort(
          state2.port,
          `[api]   ✗ account switch failed: ${getErrorMessage(switchErr)}`
        );
      }
    }
  }
  if (dsResponse.status !== 200) {
    const errData = await streamToString(dsResponse.data);
    logWithPort(
      state2.port,
      `[api] ✗ DeepSeek error ${dsResponse.status}: ${errData.slice(0, 200)}`
    );
    if (dsResponse.status === 422 || dsResponse.status === 400) {
      logWithPort(
        state2.port,
        `[api]   resetting session due to error...`
      );
      await state2.sessionManager.resetSession(currentToken);
    }
    jsonResponse(res, dsResponse.status, {
      error: {
        message: `DeepSeek API error: ${dsResponse.status}`,
        type: "api_error"
      }
    });
    return null;
  }
  logWithPort(state2.port, `[api]   streaming response...`);
  return handleStreamResponse(
    res,
    dsResponse.data,
    model,
    thinkingEnabled,
    state2,
    tools
  );
}
async function handleStreamResponse(res, stream2, model, thinkingEnabled, state2, tools) {
  let lastMessageId = null;
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no"
  });
  const completionId = `chatcmpl-${crypto$1.randomUUID().replace(/-/g, "").slice(0, 24)}`;
  const created = Math.floor(Date.now() / 1e3);
  let currentType = thinkingEnabled ? "thinking" : "text";
  let buffer = "";
  let thinkingStartSent = false;
  let hasToolCalls = false;
  const sieve = new StreamToolSieve2(tools);
  const textAccum = new StreamTextAccumulator();
  const thinkingAccum = new StreamTextAccumulator();
  let contentText = "";
  let thinkingText = "";
  const sieveToolCalls = [];
  return new Promise((resolve2, reject) => {
    const sendSSE = (data) => {
      res.write(`data: ${JSON.stringify(data)}

`);
    };
    stream2.on("data", (chunk) => {
      buffer += chunk.toString("utf-8");
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        const [parsed, isDone, isValid] = parseDeepSeekSSELine(trimmed);
        if (!isValid) continue;
        if (isDone) {
          sendSSE({
            id: completionId,
            object: "chat.completion.chunk",
            created,
            model,
            choices: [
              {
                index: 0,
                delta: {},
                finish_reason: "stop"
              }
            ]
          });
          res.write("data: [DONE]\n\n");
          res.end();
          resolve2({
            lastMessageId,
            contentText,
            thinkingText,
            toolCalls: sieveToolCalls.length > 0 ? sieveToolCalls : void 0
          });
          return;
        }
        if (!parsed) continue;
        if (hasContentFilterStatus(parsed)) {
          sendSSE({
            id: completionId,
            object: "chat.completion.chunk",
            created,
            model,
            choices: [
              {
                index: 0,
                delta: {},
                finish_reason: "content_filter"
              }
            ]
          });
          res.write("data: [DONE]\n\n");
          res.end();
          resolve2({
            lastMessageId,
            contentText,
            thinkingText,
            toolCalls: sieveToolCalls.length > 0 ? sieveToolCalls : void 0
          });
          return;
        }
        const { parts, finished, nextType, messageId } = parseSSEChunkForContent(
          parsed,
          thinkingEnabled,
          currentType
        );
        if (messageId) {
          lastMessageId = messageId;
        }
        currentType = nextType;
        if (finished) {
          sendSSE({
            id: completionId,
            object: "chat.completion.chunk",
            created,
            model,
            choices: [
              {
                index: 0,
                delta: {},
                finish_reason: "stop"
              }
            ]
          });
          res.write("data: [DONE]\n\n");
          res.end();
          resolve2({
            lastMessageId,
            contentText,
            thinkingText,
            toolCalls: sieveToolCalls.length > 0 ? sieveToolCalls : void 0
          });
          return;
        }
        for (const part of parts) {
          if (part.type === "thinking") {
            const deduped = thinkingAccum.append(part.text);
            if (!deduped) continue;
            const cleaned = cleanVisibleOutput(deduped);
            if (!cleaned) continue;
            if (!thinkingStartSent) {
              sendSSE({
                id: completionId,
                object: "chat.completion.chunk",
                created,
                model,
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
              });
              thinkingStartSent = true;
            }
            sendSSE({
              id: completionId,
              object: "chat.completion.chunk",
              created,
              model,
              choices: [
                {
                  index: 0,
                  delta: { reasoning_content: cleaned },
                  finish_reason: null
                }
              ]
            });
            thinkingText += cleaned;
          } else {
            const deduped = textAccum.append(part.text);
            if (!deduped) continue;
            const cleaned = cleanVisibleOutput(deduped);
            const result = sieve.processChunk(cleaned || deduped);
            if (result.outputText) {
              sendSSE({
                id: completionId,
                object: "chat.completion.chunk",
                created,
                model,
                choices: [
                  {
                    index: 0,
                    delta: { content: result.outputText },
                    finish_reason: null
                  }
                ]
              });
              contentText += result.outputText;
            }
            if (result.toolCalls) {
              hasToolCalls = true;
              sendSSE({
                id: completionId,
                object: "chat.completion.chunk",
                created,
                model,
                choices: [
                  {
                    index: 0,
                    delta: { tool_calls: result.toolCalls },
                    finish_reason: null
                  }
                ]
              });
              sieveToolCalls.push(...result.toolCalls);
            }
          }
        }
      }
    });
    stream2.on("end", () => {
      if (!res.writableEnded) {
        const finalResult = sieve.flush();
        if (finalResult.outputText) {
          const cleaned = cleanVisibleOutput(finalResult.outputText);
          if (cleaned) {
            sendSSE({
              id: completionId,
              object: "chat.completion.chunk",
              created,
              model,
              choices: [
                {
                  index: 0,
                  delta: { content: cleaned },
                  finish_reason: null
                }
              ]
            });
            contentText += cleaned;
          }
        }
        if (finalResult.toolCalls) {
          hasToolCalls = true;
          sendSSE({
            id: completionId,
            object: "chat.completion.chunk",
            created,
            model,
            choices: [
              {
                index: 0,
                delta: { tool_calls: finalResult.toolCalls },
                finish_reason: null
              }
            ]
          });
          sieveToolCalls.push(...finalResult.toolCalls);
        }
        sendSSE({
          id: completionId,
          object: "chat.completion.chunk",
          created,
          model,
          choices: [
            {
              index: 0,
              delta: {},
              finish_reason: hasToolCalls ? "tool_calls" : "stop"
            }
          ]
        });
        res.write("data: [DONE]\n\n");
        res.end();
        resolve2({
          lastMessageId,
          contentText,
          thinkingText,
          toolCalls: sieveToolCalls.length > 0 ? sieveToolCalls : void 0
        });
      }
    });
    stream2.on("error", (err) => {
      const message = err instanceof Error ? err.message : String(err);
      logWithPort(
        state2.port,
        `[api] ✗ stream error: ${message}`
      );
      if (!res.writableEnded) res.end();
      reject(err);
    });
  });
}
async function handleRequest(req, res, state2) {
  const startTime = Date.now();
  const method = req.method || "GET";
  setCORS(res, req);
  if (method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }
  const url2 = new URL(
    req.url || "/",
    `http://${req.headers.host || "localhost"}`
  );
  const path2 = url2.pathname;
  const clientIP = req.socket.remoteAddress || "unknown";
  res.once("finish", () => {
    const duration = Date.now() - startTime;
    const status = res.statusCode;
    if (path2 !== "/healthz" && path2 !== "/readyz") {
      logWithPort(
        state2.port,
        `[api] ${method} ${path2} → ${status} (${duration}ms) [${clientIP}]`
      );
    }
  });
  try {
    if (path2 === "/healthz" || path2 === "/readyz") {
      jsonResponse(res, 200, { status: "ok" });
      return;
    }
    if ((path2 === "/v1/models" || path2 === "/models") && method === "GET") {
      jsonResponse(res, 200, openAIModelsResponse());
      return;
    }
    const modelMatch = path2.match(/^\/(?:v1\/)?models\/(.+)$/);
    if (modelMatch && method === "GET") {
      const modelId = modelMatch[1];
      const model = ALL_MODELS.find((m) => m.id === modelId);
      if (model) {
        jsonResponse(res, 200, model);
      } else {
        jsonResponse(res, 404, {
          error: {
            message: `Model '${modelId}' not found`,
            type: "invalid_request_error"
          }
        });
      }
      return;
    }
    if ((path2 === "/v1/chat/completions" || path2 === "/chat/completions") && method === "POST") {
      if (!validateAuth(req, res, state2)) return;
      await handleChatCompletions(req, res, state2);
      return;
    }
    if ((path2 === "/v1/sessions/reset" || path2 === "/sessions/reset") && method === "POST") {
      if (!validateAuth(req, res, state2)) return;
      await state2.sessionManager.cleanup();
      logWithPort(state2.port, `[api] ✓ All sessions reset (new section)`);
      jsonResponse(res, 200, { status: "ok", message: "All sessions reset" });
      return;
    }
    if ((path2 === "/v1/sessions/info" || path2 === "/sessions/info") && method === "GET") {
      if (!validateAuth(req, res, state2)) return;
      const info = [];
      for (const [, token] of state2.accountTokens) {
        info.push(state2.sessionManager.getSessionInfo(token));
      }
      jsonResponse(res, 200, { sessions: info });
      return;
    }
    jsonResponse(res, 404, {
      error: { message: "Not found", type: "invalid_request_error" }
    });
  } catch (err) {
    const message = getErrorMessage(err);
    logWithPort(
      state2.port,
      `[api] ✗ ${method} ${path2} — unhandled error: ${message}`
    );
    jsonResponse(res, 500, {
      error: { message: "Internal Server Error", type: "api_error" }
    });
  }
}
function validateAuth(req, res, state2) {
  if (!state2.config || state2.config.apiKeys.length === 0) return true;
  const authHeader = req.headers["authorization"] || "";
  let key = "";
  if (authHeader.startsWith("Bearer ")) {
    key = authHeader.slice(7).trim();
  }
  if (!key) {
    const url2 = new URL(
      req.url || "/",
      `http://${req.headers.host || "localhost"}`
    );
    key = url2.searchParams.get("key") || url2.searchParams.get("api_key") || "";
  }
  if (!key || !state2.config.apiKeys.includes(key)) {
    jsonResponse(res, 401, {
      error: {
        message: "Invalid API key",
        type: "invalid_request_error",
        code: "invalid_api_key"
      }
    });
    return false;
  }
  return true;
}
const runningServers = /* @__PURE__ */ new Map();
function setLogCallback(cb) {
  setLogCallback$1(cb);
}
async function startServerForAccount(accountId, config) {
  if (runningServers.has(accountId)) {
    throw new Error(`Server for account ${accountId} is already running`);
  }
  if (!config.accounts || config.accounts.length === 0) {
    throw new Error("No account configured");
  }
  const port = config.port;
  if (port <= 0 || port >= 65536) {
    throw new Error(`Port out of range: ${port}`);
  }
  const instance = await startServerInstance(config);
  runningServers.set(accountId, instance);
  return port;
}
async function stopServerForAccount(accountId) {
  const instance = runningServers.get(accountId);
  if (!instance) {
    throw new Error(`Server for account ${accountId} is not running`);
  }
  runningServers.delete(accountId);
  await stopServerInstance(instance);
}
function isAccountRunning(accountId) {
  return runningServers.has(accountId);
}
function getAccountPort(accountId) {
  const instance = runningServers.get(accountId);
  return instance ? instance.state.port : null;
}
function getAllRunningAccounts() {
  const result = {};
  for (const [id, instance] of runningServers) {
    result[id] = instance.state.port;
  }
  return result;
}
async function startServerInstance(config) {
  const state2 = {
    config,
    accountTokens: /* @__PURE__ */ new Map(),
    accountIndex: 0,
    port: config.port,
    sessionManager: new SessionManager()
  };
  for (const acc of config.accounts) {
    if (acc.token) {
      state2.accountTokens.set(acc.email, acc.token);
    } else {
      try {
        const token = await login(acc);
        state2.accountTokens.set(acc.email, token);
        logWithPort(
          state2.port,
          `[shallowseek-api] ✓ Logged in: ${acc.email.slice(0, 3)}***`
        );
      } catch (err) {
        const message = getErrorMessage(err);
        logWithPort(
          state2.port,
          `[shallowseek-api] ✗ Login failed for ${acc.email}: ${message}`
        );
      }
    }
  }
  if (state2.accountTokens.size === 0) {
    throw new Error("No accounts available (all login attempts failed)");
  }
  const server = http$3.createServer(
    (req, res) => handleRequest(req, res, state2)
  );
  await new Promise((resolve2, reject) => {
    server.listen(config.port, () => {
      logWithPort(
        state2.port,
        `[shallowseek-api] OpenAI-compatible API server listening on port ${config.port}`
      );
      resolve2();
    });
    server.on("error", reject);
  });
  return { server, state: state2 };
}
async function stopServerInstance(instance) {
  await instance.state.sessionManager.cleanup();
  return new Promise((resolve2) => {
    instance.server.close(() => {
      logWithPort(
        instance.state.port,
        "[shallowseek-api] Server stopped"
      );
      resolve2();
    });
  });
}
const accountLogs = /* @__PURE__ */ new Map();
function broadcastAccountStatus(accountId, isRunning, port) {
  for (const win2 of BrowserWindow.getAllWindows()) {
    try {
      win2.webContents.send(
        "server-account-status-changed",
        accountId,
        isRunning,
        port
      );
    } catch {
    }
  }
}
function captureLog(accountId, msg) {
  let logs = accountLogs.get(accountId);
  if (!logs) {
    logs = [];
    accountLogs.set(accountId, logs);
  }
  logs.push(msg);
  for (const win2 of BrowserWindow.getAllWindows()) {
    try {
      win2.webContents.send("server-account-log", accountId, msg);
    } catch {
    }
  }
}
function getPortFromDB() {
  const raw = getSetting("endpointPort");
  if (raw) {
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed < 65536) return parsed;
  }
  return 11434;
}
function getApiKeyFromDB() {
  return getSetting("endpointApiKey");
}
function getAccountFromDB(accountId) {
  const dbAccounts = getAccounts();
  const acc = dbAccounts.find((a) => a.id === accountId);
  if (!acc) return null;
  return {
    id: acc.id,
    email: acc.email,
    password: "",
    token: acc.chat_token
  };
}
function findAvailablePort(basePort) {
  const usedPorts = new Set(
    Object.values(getAllRunningAccounts())
  );
  let port = basePort;
  while (usedPorts.has(port)) {
    port++;
    if (port >= 65536) {
      throw new Error("No available ports");
    }
  }
  return port;
}
function registerServerIpcs() {
  setLogCallback((msg) => {
    const portMatch = msg.match(/\[(\d+)\]/);
    if (portMatch) {
      const port = parseInt(portMatch[1], 10);
      const running = getAllRunningAccounts();
      const accountId = Object.keys(running).find((id) => running[id] === port);
      if (accountId) {
        captureLog(accountId, msg);
        return;
      }
    }
    for (const win2 of BrowserWindow.getAllWindows()) {
      try {
        win2.webContents.send("server-log", msg);
      } catch {
      }
    }
  });
  ipcMain.handle(
    "server-start-account",
    async (_event, payload) => {
      const { accountId } = payload;
      if (isAccountRunning(accountId)) {
        return { ok: false, error: "Server for this account is already running" };
      }
      accountLogs.set(accountId, []);
      const basePort = payload.port || getPortFromDB();
      try {
        const account = getAccountFromDB(accountId);
        if (!account) {
          return { ok: false, error: "Account not found" };
        }
        const port = findAvailablePort(basePort);
        const apiKeys = [];
        const apiKey = payload.apiKey || getApiKeyFromDB();
        if (apiKey) {
          apiKeys.push(apiKey);
        }
        const serverConfig = {
          port,
          apiKeys,
          accounts: [account],
          modelAliases: {},
          autoDeleteMode: "single"
        };
        captureLog(accountId, `[shallowseek-api] Starting server for ${account.email} on port ${port}...`);
        await startServerForAccount(accountId, serverConfig);
        captureLog(accountId, `[shallowseek-api] Server started successfully on port ${port}`);
        captureLog(accountId, `[shallowseek-api] OpenAI base URL: http://localhost:${port}/v1`);
        broadcastAccountStatus(accountId, true, port);
        return { ok: true, port };
      } catch (err) {
        const msg = err.message || "Unknown error";
        captureLog(accountId, `[shallowseek-api] Start failed: ${msg}`);
        return { ok: false, error: msg };
      }
    }
  );
  ipcMain.handle(
    "server-stop-account",
    async (_event, payload) => {
      const { accountId } = payload;
      if (!isAccountRunning(accountId)) {
        return { ok: false, error: "Server for this account is not running" };
      }
      try {
        const port = getAccountPort(accountId) || 0;
        await stopServerForAccount(accountId);
        captureLog(accountId, "[shallowseek-api] Server stopped");
        broadcastAccountStatus(accountId, false, port);
        return { ok: true };
      } catch (err) {
        return { ok: false, error: err.message };
      }
    }
  );
  ipcMain.handle(
    "server-status-account",
    (_event, payload) => {
      const { accountId } = payload;
      const isRunning = isAccountRunning(accountId);
      const port = getAccountPort(accountId) ?? getPortFromDB();
      return { isRunning, port };
    }
  );
  ipcMain.handle(
    "server-logs-account",
    (_event, payload) => {
      return { logs: accountLogs.get(payload.accountId) || [] };
    }
  );
  ipcMain.handle("server-all-running", () => {
    return getAllRunningAccounts();
  });
}
function registerIpcs(__dirname, VITE_DEV_SERVER_URL2, RENDERER_DIST2) {
  registerWindowIpcs(__dirname, VITE_DEV_SERVER_URL2, RENDERER_DIST2);
  registerAccountIpcs(__dirname, VITE_DEV_SERVER_URL2, RENDERER_DIST2);
  registerDatabaseIpcs();
  registerServerIpcs();
}
const __filename$1 = fileURLToPath(import.meta.url);
const __dirname$1 = path$1.dirname(__filename$1);
process.env.APP_ROOT = path$1.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path$1.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path$1.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path$1.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    minWidth: 1200,
    minHeight: 800,
    frame: false,
    titleBarStyle: "hidden",
    icon: path$1.join(process.env.VITE_PUBLIC, "logo.png"),
    webPreferences: {
      preload: path$1.join(__dirname$1, "preload.mjs")
    },
    autoHideMenuBar: true
  });
  Menu.setApplicationMenu(null);
  win.on("maximize", () => {
    win == null ? void 0 : win.webContents.send("window-state-changed", "maximized");
  });
  win.on("unmaximize", () => {
    win == null ? void 0 : win.webContents.send("window-state-changed", "unmaximized");
  });
  if (VITE_DEV_SERVER_URL) {
    console.log("Loading URL:", VITE_DEV_SERVER_URL);
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    console.log("Loading file:", path$1.join(RENDERER_DIST, "index.html"));
    win.loadFile(path$1.join(RENDERER_DIST, "index.html"));
  }
}
registerIpcs(__dirname$1, VITE_DEV_SERVER_URL, RENDERER_DIST);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
