import { ad as useNavigate, x as getListener, U as onCleanup, a1 as sharedConfig, s as createSignal, a4 as startTransition, A as getOwner, w as getIntent, D as isServer, v as getInPreloadFn, o as createResource, g as catchError, a9 as untrack, k as createComponent, y as getNextElement, z as getNextMarker, C as insert, F as For, S as Show, n as createRenderEffect, Z as setAttribute, a8 as template, u as delegateEvents, ab as useI18n, ac as useLanguage, m as createMemo, l as createEffect, X as runHydrationEvents, $ as setProperty, W as route, V as onMount, f as addEventListener, aa as use, K as memo } from "./i18n-DJbnCyo8.js";
const LocationHeader = "Location";
const PRELOAD_TIMEOUT = 5e3;
const CACHE_TIMEOUT = 18e4;
let cacheMap = /* @__PURE__ */ new Map();
{
  setInterval(() => {
    const now = Date.now();
    for (let [k2, v] of cacheMap.entries()) {
      if (!v[4].count && now - v[0] > CACHE_TIMEOUT) {
        cacheMap.delete(k2);
      }
    }
  }, 3e5);
}
function getCache() {
  return cacheMap;
}
function query(fn, name) {
  if (fn.GET) fn = fn.GET;
  const cachedFn = (...args) => {
    const cache = getCache();
    const intent = getIntent();
    const inPreloadFn = getInPreloadFn();
    const owner = getOwner();
    const navigate = owner ? useNavigate() : void 0;
    const now = Date.now();
    const key = name + hashKey(args);
    let cached = cache.get(key);
    let tracking;
    if (getListener() && !isServer) {
      tracking = true;
      onCleanup(() => cached[4].count--);
    }
    if (cached && cached[0] && (intent === "native" || cached[4].count || Date.now() - cached[0] < PRELOAD_TIMEOUT)) {
      if (tracking) {
        cached[4].count++;
        cached[4][0]();
      }
      if (cached[3] === "preload" && intent !== "preload") {
        cached[0] = now;
      }
      let res2 = cached[1];
      if (intent !== "preload") {
        res2 = "then" in cached[1] ? cached[1].then(handleResponse(false), handleResponse(true)) : handleResponse(false)(cached[1]);
        intent === "navigate" && startTransition(() => cached[4][1](cached[0]));
      }
      inPreloadFn && "then" in res2 && res2.catch(() => {
      });
      return res2;
    }
    let res;
    if (sharedConfig.has && sharedConfig.has(key)) {
      res = sharedConfig.load(key);
      delete globalThis._$HY.r[key];
    } else res = fn(...args);
    if (cached) {
      cached[0] = now;
      cached[1] = res;
      cached[3] = intent;
      intent === "navigate" && startTransition(() => cached[4][1](cached[0]));
    } else {
      cache.set(key, cached = [now, res, , intent, createSignal(now)]);
      cached[4].count = 0;
    }
    if (tracking) {
      cached[4].count++;
      cached[4][0]();
    }
    if (intent !== "preload") {
      res = "then" in res ? res.then(handleResponse(false), handleResponse(true)) : handleResponse(false)(res);
    }
    inPreloadFn && "then" in res && res.catch(() => {
    });
    return res;
    function handleResponse(error) {
      return async (v) => {
        if (v instanceof Response) {
          const url = v.headers.get(LocationHeader);
          if (url !== null) {
            if (navigate && url.startsWith("/")) startTransition(() => {
              navigate(url, {
                replace: true
              });
            });
            else window.location.href = url;
            return;
          }
          if (v.customBody) v = await v.customBody();
        }
        if (error) throw v;
        cached[2] = v;
        return v;
      };
    }
  };
  cachedFn.keyFor = (...args) => name + hashKey(args);
  cachedFn.key = name;
  return cachedFn;
}
query.get = (key) => {
  const cached = getCache().get(key);
  return cached[2];
};
query.set = (key, value) => {
  const cache = getCache();
  const now = Date.now();
  let cached = cache.get(key);
  if (cached) {
    cached[0] = now;
    cached[1] = Promise.resolve(value);
    cached[2] = value;
    cached[3] = "preload";
  } else {
    cache.set(key, cached = [now, Promise.resolve(value), value, "preload", createSignal(now)]);
    cached[4].count = 0;
  }
};
query.delete = (key) => getCache().delete(key);
query.clear = () => getCache().clear();
function hashKey(args) {
  return JSON.stringify(args, (_2, val) => isPlainObject(val) ? Object.keys(val).sort().reduce((result, key) => {
    result[key] = val[key];
    return result;
  }, {}) : val);
}
function isPlainObject(obj) {
  let proto;
  return obj != null && typeof obj === "object" && (!(proto = Object.getPrototypeOf(obj)) || proto === Object.prototype);
}
function createAsync(fn, options) {
  let resource;
  let prev = () => !resource || resource.state === "unresolved" ? void 0 : resource.latest;
  [resource] = createResource(() => subFetch(fn, catchError(() => untrack(prev), () => void 0)), (v) => v);
  const resultAccessor = () => resource();
  Object.defineProperty(resultAccessor, "latest", {
    get() {
      return resource.latest;
    }
  });
  return resultAccessor;
}
class MockPromise {
  static all() {
    return new MockPromise();
  }
  static allSettled() {
    return new MockPromise();
  }
  static any() {
    return new MockPromise();
  }
  static race() {
    return new MockPromise();
  }
  static reject() {
    return new MockPromise();
  }
  static resolve() {
    return new MockPromise();
  }
  catch() {
    return new MockPromise();
  }
  then() {
    return new MockPromise();
  }
  finally() {
    return new MockPromise();
  }
}
function subFetch(fn, prev) {
  if (!sharedConfig.context) return fn(prev);
  const ogFetch = fetch;
  const ogPromise = Promise;
  try {
    window.fetch = () => new MockPromise();
    Promise = MockPromise;
    return fn(prev);
  } finally {
    window.fetch = ogFetch;
    Promise = ogPromise;
  }
}
var R = ((a) => (a[a.AggregateError = 1] = "AggregateError", a[a.ArrowFunction = 2] = "ArrowFunction", a[a.ErrorPrototypeStack = 4] = "ErrorPrototypeStack", a[a.ObjectAssign = 8] = "ObjectAssign", a[a.BigIntTypedArray = 16] = "BigIntTypedArray", a))(R || {});
function Nr(o) {
  switch (o) {
    case '"':
      return '\\"';
    case "\\":
      return "\\\\";
    case `
`:
      return "\\n";
    case "\r":
      return "\\r";
    case "\b":
      return "\\b";
    case "	":
      return "\\t";
    case "\f":
      return "\\f";
    case "<":
      return "\\x3C";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return;
  }
}
function d(o) {
  let e = "", r = 0, t;
  for (let n = 0, a = o.length; n < a; n++) t = Nr(o[n]), t && (e += o.slice(r, n) + t, r = n + 1);
  return r === 0 ? e = o : e += o.slice(r), e;
}
var O = "__SEROVAL_REFS__";
function f$1(o, e) {
  if (!o) throw e;
}
var Be = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map();
function je(o) {
  return Be.has(o);
}
function Ke(o) {
  return f$1(je(o), new ie$1(o)), Be.get(o);
}
typeof globalThis != "undefined" ? Object.defineProperty(globalThis, O, { value: C, configurable: true, writable: false, enumerable: false }) : typeof window != "undefined" ? Object.defineProperty(window, O, { value: C, configurable: true, writable: false, enumerable: false }) : typeof self != "undefined" ? Object.defineProperty(self, O, { value: C, configurable: true, writable: false, enumerable: false }) : typeof global != "undefined" && Object.defineProperty(global, O, { value: C, configurable: true, writable: false, enumerable: false });
function Hr(o) {
  return o;
}
function Ye(o, e) {
  for (let r = 0, t = e.length; r < t; r++) {
    let n = e[r];
    o.has(n) || (o.add(n), n.extends && Ye(o, n.extends));
  }
}
function m$1(o) {
  if (o) {
    let e = /* @__PURE__ */ new Set();
    return Ye(e, o), [...e];
  }
}
var ce = { [Symbol.asyncIterator]: 0, [Symbol.hasInstance]: 1, [Symbol.isConcatSpreadable]: 2, [Symbol.iterator]: 3, [Symbol.match]: 4, [Symbol.matchAll]: 5, [Symbol.replace]: 6, [Symbol.search]: 7, [Symbol.species]: 8, [Symbol.split]: 9, [Symbol.toPrimitive]: 10, [Symbol.toStringTag]: 11, [Symbol.unscopables]: 12 };
var ue$1 = { 0: "Error", 1: "EvalError", 2: "RangeError", 3: "ReferenceError", 4: "SyntaxError", 5: "TypeError", 6: "URIError" }, s = void 0;
function u$1(o, e, r, t, n, a, i2, l2, c2, p2, h2, X2) {
  return { t: o, i: e, s: r, l: t, c: n, m: a, p: i2, e: l2, a: c2, f: p2, b: h2, o: X2 };
}
function x(o) {
  return u$1(2, s, o, s, s, s, s, s, s, s, s, s);
}
var I = x(2), A = x(3), pe$1 = x(1), de = x(0), Xe = x(4), Qe = x(5), er = x(6), rr = x(7);
function me$1(o) {
  return o instanceof EvalError ? 1 : o instanceof RangeError ? 2 : o instanceof ReferenceError ? 3 : o instanceof SyntaxError ? 4 : o instanceof TypeError ? 5 : o instanceof URIError ? 6 : 0;
}
function wr(o) {
  let e = ue$1[me$1(o)];
  return o.name !== e ? { name: o.name } : o.constructor.name !== e ? { name: o.constructor.name } : {};
}
function j$1(o, e) {
  let r = wr(o), t = Object.getOwnPropertyNames(o);
  for (let n = 0, a = t.length, i2; n < a; n++) i2 = t[n], i2 !== "name" && i2 !== "message" && (i2 === "stack" ? e & 4 && (r = r || {}, r[i2] = o[i2]) : (r = r || {}, r[i2] = o[i2]));
  return r;
}
function fe$1(o) {
  return Object.isFrozen(o) ? 3 : Object.isSealed(o) ? 2 : Object.isExtensible(o) ? 0 : 1;
}
function ge(o) {
  switch (o) {
    case Number.POSITIVE_INFINITY:
      return Qe;
    case Number.NEGATIVE_INFINITY:
      return er;
  }
  return o !== o ? rr : Object.is(o, -0) ? Xe : u$1(0, s, o, s, s, s, s, s, s, s, s, s);
}
function w(o) {
  return u$1(1, s, d(o), s, s, s, s, s, s, s, s, s);
}
function Se(o) {
  return u$1(3, s, "" + o, s, s, s, s, s, s, s, s, s);
}
function sr(o) {
  return u$1(4, o, s, s, s, s, s, s, s, s, s, s);
}
function he(o, e) {
  let r = e.valueOf();
  return u$1(5, o, r !== r ? "" : e.toISOString(), s, s, s, s, s, s, s, s, s);
}
function ye(o, e) {
  return u$1(6, o, s, s, d(e.source), e.flags, s, s, s, s, s, s);
}
function ve(o, e) {
  let r = new Uint8Array(e), t = r.length, n = new Array(t);
  for (let a = 0; a < t; a++) n[a] = r[a];
  return u$1(19, o, n, s, s, s, s, s, s, s, s, s);
}
function or(o, e) {
  return u$1(17, o, ce[e], s, s, s, s, s, s, s, s, s);
}
function nr(o, e) {
  return u$1(18, o, d(Ke(e)), s, s, s, s, s, s, s, s, s);
}
function _$1(o, e, r) {
  return u$1(25, o, r, s, d(e), s, s, s, s, s, s, s);
}
function Ne(o, e, r) {
  return u$1(9, o, s, e.length, s, s, s, s, r, s, s, fe$1(e));
}
function be(o, e) {
  return u$1(21, o, s, s, s, s, s, s, s, e, s, s);
}
function xe(o, e, r) {
  return u$1(15, o, s, e.length, e.constructor.name, s, s, s, s, r, e.byteOffset, s);
}
function Ie(o, e, r) {
  return u$1(16, o, s, e.length, e.constructor.name, s, s, s, s, r, e.byteOffset, s);
}
function Ae(o, e, r) {
  return u$1(20, o, s, e.byteLength, s, s, s, s, s, r, e.byteOffset, s);
}
function we(o, e, r) {
  return u$1(13, o, me$1(e), s, s, d(e.message), r, s, s, s, s, s);
}
function Ee(o, e, r) {
  return u$1(14, o, me$1(e), s, s, d(e.message), r, s, s, s, s, s);
}
function Pe(o, e, r) {
  return u$1(7, o, s, e, s, s, s, s, r, s, s, s);
}
function M(o, e) {
  return u$1(28, s, s, s, s, s, s, s, [o, e], s, s, s);
}
function U(o, e) {
  return u$1(30, s, s, s, s, s, s, s, [o, e], s, s, s);
}
function L(o, e, r) {
  return u$1(31, o, s, s, s, s, s, s, r, e, s, s);
}
function Re(o, e) {
  return u$1(32, o, s, s, s, s, s, s, s, e, s, s);
}
function Oe(o, e) {
  return u$1(33, o, s, s, s, s, s, s, s, e, s, s);
}
function Ce(o, e) {
  return u$1(34, o, s, s, s, s, s, s, s, e, s, s);
}
var { toString: _e } = Object.prototype;
function Er(o, e) {
  return e instanceof Error ? `Seroval caught an error during the ${o} process.
  
${e.name}
${e.message}

- For more information, please check the "cause" property of this error.
- If you believe this is an error in Seroval, please submit an issue at https://github.com/lxsmnsyc/seroval/issues/new` : `Seroval caught an error during the ${o} process.

"${_e.call(e)}"

For more information, please check the "cause" property of this error.`;
}
var ee$1 = class ee extends Error {
  constructor(r, t) {
    super(Er(r, t));
    this.cause = t;
  }
}, E = class extends ee$1 {
  constructor(e) {
    super("parsing", e);
  }
}, g$1 = class g extends Error {
  constructor(r) {
    super(`The value ${_e.call(r)} of type "${typeof r}" cannot be parsed/serialized.
      
There are few workarounds for this problem:
- Transform the value in a way that it can be serialized.
- If the reference is present on multiple runtimes (isomorphic), you can use the Reference API to map the references.`);
    this.value = r;
  }
}, ie$1 = class ie extends Error {
  constructor(r) {
    super('Missing reference for the value "' + _e.call(r) + '" of type "' + typeof r + '"');
    this.value = r;
  }
};
var T$1 = class T {
  constructor(e, r) {
    this.value = e;
    this.replacement = r;
  }
};
var ar = {}, ir = {};
var lr = { 0: {}, 1: {}, 2: {}, 3: {}, 4: {} };
function Fe(o) {
  return "__SEROVAL_STREAM__" in o;
}
function K$1() {
  let o = /* @__PURE__ */ new Set(), e = [], r = true, t = true;
  function n(l2) {
    for (let c2 of o.keys()) c2.next(l2);
  }
  function a(l2) {
    for (let c2 of o.keys()) c2.throw(l2);
  }
  function i2(l2) {
    for (let c2 of o.keys()) c2.return(l2);
  }
  return { __SEROVAL_STREAM__: true, on(l2) {
    r && o.add(l2);
    for (let c2 = 0, p2 = e.length; c2 < p2; c2++) {
      let h2 = e[c2];
      c2 === p2 - 1 && !r ? t ? l2.return(h2) : l2.throw(h2) : l2.next(h2);
    }
    return () => {
      r && o.delete(l2);
    };
  }, next(l2) {
    r && (e.push(l2), n(l2));
  }, throw(l2) {
    r && (e.push(l2), a(l2), r = false, t = false, o.clear());
  }, return(l2) {
    r && (e.push(l2), i2(l2), r = false, t = true, o.clear());
  } };
}
function Ve(o) {
  let e = K$1(), r = o[Symbol.asyncIterator]();
  async function t() {
    try {
      let n = await r.next();
      n.done ? e.return(n.value) : (e.next(n.value), await t());
    } catch (n) {
      e.throw(n);
    }
  }
  return t().catch(() => {
  }), e;
}
function J$1(o) {
  let e = [], r = -1, t = -1, n = o[Symbol.iterator]();
  for (; ; ) try {
    let a = n.next();
    if (e.push(a.value), a.done) {
      t = e.length - 1;
      break;
    }
  } catch (a) {
    r = e.length, e.push(a);
  }
  return { v: e, t: r, d: t };
}
async function Me(o) {
  try {
    return [1, await o];
  } catch (e) {
    return [0, e];
  }
}
var Y$1 = class Y {
  constructor(e) {
    this.marked = /* @__PURE__ */ new Set();
    this.plugins = e.plugins, this.features = 31 ^ (e.disabledFeatures || 0), this.refs = e.refs || /* @__PURE__ */ new Map();
  }
  markRef(e) {
    this.marked.add(e);
  }
  isMarked(e) {
    return this.marked.has(e);
  }
  createIndex(e) {
    let r = this.refs.size;
    return this.refs.set(e, r), r;
  }
  getIndexedValue(e) {
    let r = this.refs.get(e);
    return r != null ? (this.markRef(r), { type: 1, value: sr(r) }) : { type: 0, value: this.createIndex(e) };
  }
  getReference(e) {
    let r = this.getIndexedValue(e);
    return r.type === 1 ? r : je(e) ? { type: 2, value: nr(r.value, e) } : r;
  }
  parseWellKnownSymbol(e) {
    let r = this.getReference(e);
    return r.type !== 0 ? r.value : (f$1(e in ce, new g$1(e)), or(r.value, e));
  }
  parseSpecialReference(e) {
    let r = this.getIndexedValue(lr[e]);
    return r.type === 1 ? r.value : u$1(26, r.value, e, s, s, s, s, s, s, s, s, s);
  }
  parseIteratorFactory() {
    let e = this.getIndexedValue(ar);
    return e.type === 1 ? e.value : u$1(27, e.value, s, s, s, s, s, s, s, this.parseWellKnownSymbol(Symbol.iterator), s, s);
  }
  parseAsyncIteratorFactory() {
    let e = this.getIndexedValue(ir);
    return e.type === 1 ? e.value : u$1(29, e.value, s, s, s, s, s, s, [this.parseSpecialReference(1), this.parseWellKnownSymbol(Symbol.asyncIterator)], s, s, s);
  }
  createObjectNode(e, r, t, n) {
    return u$1(t ? 11 : 10, e, s, s, s, s, n, s, s, s, s, fe$1(r));
  }
  createMapNode(e, r, t, n) {
    return u$1(8, e, s, s, s, s, s, { k: r, v: t, s: n }, s, this.parseSpecialReference(0), s, s);
  }
  createPromiseConstructorNode(e, r) {
    return u$1(22, e, r, s, s, s, s, s, s, this.parseSpecialReference(1), s, s);
  }
};
var k = class extends Y$1 {
  async parseItems(e) {
    let r = [];
    for (let t = 0, n = e.length; t < n; t++) t in e && (r[t] = await this.parse(e[t]));
    return r;
  }
  async parseArray(e, r) {
    return Ne(e, r, await this.parseItems(r));
  }
  async parseProperties(e) {
    let r = Object.entries(e), t = [], n = [];
    for (let i2 = 0, l2 = r.length; i2 < l2; i2++) t.push(d(r[i2][0])), n.push(await this.parse(r[i2][1]));
    let a = Symbol.iterator;
    return a in e && (t.push(this.parseWellKnownSymbol(a)), n.push(M(this.parseIteratorFactory(), await this.parse(J$1(e))))), a = Symbol.asyncIterator, a in e && (t.push(this.parseWellKnownSymbol(a)), n.push(U(this.parseAsyncIteratorFactory(), await this.parse(Ve(e))))), a = Symbol.toStringTag, a in e && (t.push(this.parseWellKnownSymbol(a)), n.push(w(e[a]))), a = Symbol.isConcatSpreadable, a in e && (t.push(this.parseWellKnownSymbol(a)), n.push(e[a] ? I : A)), { k: t, v: n, s: t.length };
  }
  async parsePlainObject(e, r, t) {
    return this.createObjectNode(e, r, t, await this.parseProperties(r));
  }
  async parseBoxed(e, r) {
    return be(e, await this.parse(r.valueOf()));
  }
  async parseTypedArray(e, r) {
    return xe(e, r, await this.parse(r.buffer));
  }
  async parseBigIntTypedArray(e, r) {
    return Ie(e, r, await this.parse(r.buffer));
  }
  async parseDataView(e, r) {
    return Ae(e, r, await this.parse(r.buffer));
  }
  async parseError(e, r) {
    let t = j$1(r, this.features);
    return we(e, r, t ? await this.parseProperties(t) : s);
  }
  async parseAggregateError(e, r) {
    let t = j$1(r, this.features);
    return Ee(e, r, t ? await this.parseProperties(t) : s);
  }
  async parseMap(e, r) {
    let t = [], n = [];
    for (let [a, i2] of r.entries()) t.push(await this.parse(a)), n.push(await this.parse(i2));
    return this.createMapNode(e, t, n, r.size);
  }
  async parseSet(e, r) {
    let t = [];
    for (let n of r.keys()) t.push(await this.parse(n));
    return Pe(e, r.size, t);
  }
  async parsePromise(e, r) {
    let [t, n] = await Me(r);
    return u$1(12, e, t, s, s, s, s, s, s, await this.parse(n), s, s);
  }
  async parsePlugin(e, r) {
    let t = this.plugins;
    if (t) for (let n = 0, a = t.length; n < a; n++) {
      let i2 = t[n];
      if (i2.parse.async && i2.test(r)) return _$1(e, i2.tag, await i2.parse.async(r, this, { id: e }));
    }
    return s;
  }
  async parseStream(e, r) {
    return L(e, this.parseSpecialReference(4), await new Promise((t, n) => {
      let a = [], i2 = r.on({ next: (l2) => {
        this.markRef(e), this.parse(l2).then((c2) => {
          a.push(Re(e, c2));
        }, (c2) => {
          n(c2), i2();
        });
      }, throw: (l2) => {
        this.markRef(e), this.parse(l2).then((c2) => {
          a.push(Oe(e, c2)), t(a), i2();
        }, (c2) => {
          n(c2), i2();
        });
      }, return: (l2) => {
        this.markRef(e), this.parse(l2).then((c2) => {
          a.push(Ce(e, c2)), t(a), i2();
        }, (c2) => {
          n(c2), i2();
        });
      } });
    }));
  }
  async parseObject(e, r) {
    if (Array.isArray(r)) return this.parseArray(e, r);
    if (Fe(r)) return this.parseStream(e, r);
    let t = r.constructor;
    if (t === T$1) return this.parse(r.replacement);
    let n = await this.parsePlugin(e, r);
    if (n) return n;
    switch (t) {
      case Object:
        return this.parsePlainObject(e, r, false);
      case s:
        return this.parsePlainObject(e, r, true);
      case Date:
        return he(e, r);
      case RegExp:
        return ye(e, r);
      case Error:
      case EvalError:
      case RangeError:
      case ReferenceError:
      case SyntaxError:
      case TypeError:
      case URIError:
        return this.parseError(e, r);
      case Number:
      case Boolean:
      case String:
      case BigInt:
        return this.parseBoxed(e, r);
      case ArrayBuffer:
        return ve(e, r);
      case Int8Array:
      case Int16Array:
      case Int32Array:
      case Uint8Array:
      case Uint16Array:
      case Uint32Array:
      case Uint8ClampedArray:
      case Float32Array:
      case Float64Array:
        return this.parseTypedArray(e, r);
      case DataView:
        return this.parseDataView(e, r);
      case Map:
        return this.parseMap(e, r);
      case Set:
        return this.parseSet(e, r);
    }
    if (t === Promise || r instanceof Promise) return this.parsePromise(e, r);
    let a = this.features;
    if (a & 16) switch (t) {
      case BigInt64Array:
      case BigUint64Array:
        return this.parseBigIntTypedArray(e, r);
    }
    if (a & 1 && typeof AggregateError != "undefined" && (t === AggregateError || r instanceof AggregateError)) return this.parseAggregateError(e, r);
    if (r instanceof Error) return this.parseError(e, r);
    if (Symbol.iterator in r || Symbol.asyncIterator in r) return this.parsePlainObject(e, r, !!t);
    throw new g$1(r);
  }
  async parseFunction(e) {
    let r = this.getReference(e);
    if (r.type !== 0) return r.value;
    let t = await this.parsePlugin(r.value, e);
    if (t) return t;
    throw new g$1(e);
  }
  async parse(e) {
    switch (typeof e) {
      case "boolean":
        return e ? I : A;
      case "undefined":
        return pe$1;
      case "string":
        return w(e);
      case "number":
        return ge(e);
      case "bigint":
        return Se(e);
      case "object": {
        if (e) {
          let r = this.getReference(e);
          return r.type === 0 ? await this.parseObject(r.value, e) : r.value;
        }
        return de;
      }
      case "symbol":
        return this.parseWellKnownSymbol(e);
      case "function":
        return this.parseFunction(e);
      default:
        throw new g$1(e);
    }
  }
  async parseTop(e) {
    try {
      return await this.parse(e);
    } catch (r) {
      throw r instanceof E ? r : new E(r);
    }
  }
};
var H$1 = class H extends k {
  constructor() {
    super(...arguments);
    this.mode = "vanilla";
  }
};
function jo(o) {
  return (0, eval)(o);
}
async function Mo(o, e = {}) {
  let r = m$1(e.plugins), t = new H$1({ plugins: r, disabledFeatures: e.disabledFeatures });
  return { t: await t.parseTop(o), f: t.features, m: Array.from(t.marked) };
}
function f(e) {
  return { detail: e.detail, bubbles: e.bubbles, cancelable: e.cancelable, composed: e.composed };
}
var q = Hr({ tag: "seroval-plugins/web/CustomEvent", test(e) {
  return typeof CustomEvent == "undefined" ? false : e instanceof CustomEvent;
}, parse: { sync(e, r) {
  return { type: r.parse(e.type), options: r.parse(f(e)) };
}, async async(e, r) {
  return { type: await r.parse(e.type), options: await r.parse(f(e)) };
}, stream(e, r) {
  return { type: r.parse(e.type), options: r.parse(f(e)) };
} }, serialize(e, r) {
  return "new CustomEvent(" + r.serialize(e.type) + "," + r.serialize(e.options) + ")";
}, deserialize(e, r) {
  return new CustomEvent(r.deserialize(e.type), r.deserialize(e.options));
} }), H2 = q;
var T2 = Hr({ tag: "seroval-plugins/web/DOMException", test(e) {
  return typeof DOMException == "undefined" ? false : e instanceof DOMException;
}, parse: { sync(e, r) {
  return { name: r.parse(e.name), message: r.parse(e.message) };
}, async async(e, r) {
  return { name: await r.parse(e.name), message: await r.parse(e.message) };
}, stream(e, r) {
  return { name: r.parse(e.name), message: r.parse(e.message) };
} }, serialize(e, r) {
  return "new DOMException(" + r.serialize(e.message) + "," + r.serialize(e.name) + ")";
}, deserialize(e, r) {
  return new DOMException(r.deserialize(e.message), r.deserialize(e.name));
} }), _ = T2;
function m(e) {
  return { bubbles: e.bubbles, cancelable: e.cancelable, composed: e.composed };
}
var j = Hr({ tag: "seroval-plugins/web/Event", test(e) {
  return typeof Event == "undefined" ? false : e instanceof Event;
}, parse: { sync(e, r) {
  return { type: r.parse(e.type), options: r.parse(m(e)) };
}, async async(e, r) {
  return { type: await r.parse(e.type), options: await r.parse(m(e)) };
}, stream(e, r) {
  return { type: r.parse(e.type), options: r.parse(m(e)) };
} }, serialize(e, r) {
  return "new Event(" + r.serialize(e.type) + "," + r.serialize(e.options) + ")";
}, deserialize(e, r) {
  return new Event(r.deserialize(e.type), r.deserialize(e.options));
} }), Y2 = j;
var W = Hr({ tag: "seroval-plugins/web/File", test(e) {
  return typeof File == "undefined" ? false : e instanceof File;
}, parse: { async async(e, r) {
  return { name: await r.parse(e.name), options: await r.parse({ type: e.type, lastModified: e.lastModified }), buffer: await r.parse(await e.arrayBuffer()) };
} }, serialize(e, r) {
  return "new File([" + r.serialize(e.buffer) + "]," + r.serialize(e.name) + "," + r.serialize(e.options) + ")";
}, deserialize(e, r) {
  return new File([r.deserialize(e.buffer)], r.deserialize(e.name), r.deserialize(e.options));
} }), c = W;
function g2(e) {
  let r = [];
  return e.forEach((a, t) => {
    r.push([t, a]);
  }), r;
}
var i = {}, G = Hr({ tag: "seroval-plugins/web/FormDataFactory", test(e) {
  return e === i;
}, parse: { sync() {
}, async async() {
  return await Promise.resolve(void 0);
}, stream() {
} }, serialize(e, r) {
  return r.createEffectfulFunction(["e", "f", "i", "s", "t"], "f=new FormData;for(i=0,s=e.length;i<s;i++)f.append((t=e[i])[0],t[1]);return f");
}, deserialize() {
  return i;
} }), J = Hr({ tag: "seroval-plugins/web/FormData", extends: [c, G], test(e) {
  return typeof FormData == "undefined" ? false : e instanceof FormData;
}, parse: { sync(e, r) {
  return { factory: r.parse(i), entries: r.parse(g2(e)) };
}, async async(e, r) {
  return { factory: await r.parse(i), entries: await r.parse(g2(e)) };
}, stream(e, r) {
  return { factory: r.parse(i), entries: r.parse(g2(e)) };
} }, serialize(e, r) {
  return "(" + r.serialize(e.factory) + ")(" + r.serialize(e.entries) + ")";
}, deserialize(e, r) {
  let a = new FormData(), t = r.deserialize(e.entries);
  for (let n = 0, b = t.length; n < b; n++) {
    let S = t[n];
    a.append(S[0], S[1]);
  }
  return a;
} }), K = J;
function y(e) {
  let r = [];
  return e.forEach((a, t) => {
    r.push([t, a]);
  }), r;
}
var X = Hr({ tag: "seroval-plugins/web/Headers", test(e) {
  return typeof Headers == "undefined" ? false : e instanceof Headers;
}, parse: { sync(e, r) {
  return r.parse(y(e));
}, async async(e, r) {
  return await r.parse(y(e));
}, stream(e, r) {
  return r.parse(y(e));
} }, serialize(e, r) {
  return "new Headers(" + r.serialize(e) + ")";
}, deserialize(e, r) {
  return new Headers(r.deserialize(e));
} }), l = X;
var p = {}, ee2 = Hr({ tag: "seroval-plugins/web/ReadableStreamFactory", test(e) {
  return e === p;
}, parse: { sync() {
}, async async() {
  return await Promise.resolve(void 0);
}, stream() {
} }, serialize(e, r) {
  return r.createFunction(["d"], "new ReadableStream({start:" + r.createEffectfulFunction(["c"], "d.on({next:" + r.createEffectfulFunction(["v"], "try{c.enqueue(v)}catch{}") + ",throw:" + r.createEffectfulFunction(["v"], "c.error(v)") + ",return:" + r.createEffectfulFunction([], "try{c.close()}catch{}") + "})") + "})");
}, deserialize() {
  return p;
} });
function z(e) {
  let r = K$1(), a = e.getReader();
  async function t() {
    try {
      let n = await a.read();
      n.done ? r.return(n.value) : (r.next(n.value), await t());
    } catch (n) {
      r.throw(n);
    }
  }
  return t().catch(() => {
  }), r;
}
var re = Hr({ tag: "seroval/plugins/web/ReadableStream", extends: [ee2], test(e) {
  return typeof ReadableStream == "undefined" ? false : e instanceof ReadableStream;
}, parse: { sync(e, r) {
  return { factory: r.parse(p), stream: r.parse(K$1()) };
}, async async(e, r) {
  return { factory: await r.parse(p), stream: await r.parse(z(e)) };
}, stream(e, r) {
  return { factory: r.parse(p), stream: r.parse(z(e)) };
} }, serialize(e, r) {
  return "(" + r.serialize(e.factory) + ")(" + r.serialize(e.stream) + ")";
}, deserialize(e, r) {
  let a = r.deserialize(e.stream);
  return new ReadableStream({ start(t) {
    a.on({ next(n) {
      try {
        t.enqueue(n);
      } catch (b) {
      }
    }, throw(n) {
      t.error(n);
    }, return() {
      try {
        t.close();
      } catch (n) {
      }
    } });
  } });
} }), u = re;
function h(e, r) {
  return { body: r, cache: e.cache, credentials: e.credentials, headers: e.headers, integrity: e.integrity, keepalive: e.keepalive, method: e.method, mode: e.mode, redirect: e.redirect, referrer: e.referrer, referrerPolicy: e.referrerPolicy };
}
var te = Hr({ tag: "seroval-plugins/web/Request", extends: [u, l], test(e) {
  return typeof Request == "undefined" ? false : e instanceof Request;
}, parse: { async async(e, r) {
  return { url: await r.parse(e.url), options: await r.parse(h(e, e.body ? await e.clone().arrayBuffer() : null)) };
}, stream(e, r) {
  return { url: r.parse(e.url), options: r.parse(h(e, e.clone().body)) };
} }, serialize(e, r) {
  return "new Request(" + r.serialize(e.url) + "," + r.serialize(e.options) + ")";
}, deserialize(e, r) {
  return new Request(r.deserialize(e.url), r.deserialize(e.options));
} }), ne = te;
function N(e) {
  return { headers: e.headers, status: e.status, statusText: e.statusText };
}
var se = Hr({ tag: "seroval-plugins/web/Response", extends: [u, l], test(e) {
  return typeof Response == "undefined" ? false : e instanceof Response;
}, parse: { async async(e, r) {
  return { body: await r.parse(e.body ? await e.clone().arrayBuffer() : null), options: await r.parse(N(e)) };
}, stream(e, r) {
  return { body: r.parse(e.clone().body), options: r.parse(N(e)) };
} }, serialize(e, r) {
  return "new Response(" + r.serialize(e.body) + "," + r.serialize(e.options) + ")";
}, deserialize(e, r) {
  return new Response(r.deserialize(e.body), r.deserialize(e.options));
} }), ie2 = se;
var pe = Hr({ tag: "seroval-plugins/web/URL", test(e) {
  return typeof URL == "undefined" ? false : e instanceof URL;
}, parse: { sync(e, r) {
  return r.parse(e.href);
}, async async(e, r) {
  return await r.parse(e.href);
}, stream(e, r) {
  return r.parse(e.href);
} }, serialize(e, r) {
  return "new URL(" + r.serialize(e) + ")";
}, deserialize(e, r) {
  return new URL(r.deserialize(e));
} }), ue = pe;
var fe = Hr({ tag: "seroval-plugins/web/URLSearchParams", test(e) {
  return typeof URLSearchParams == "undefined" ? false : e instanceof URLSearchParams;
}, parse: { sync(e, r) {
  return r.parse(e.toString());
}, async async(e, r) {
  return await r.parse(e.toString());
}, stream(e, r) {
  return r.parse(e.toString());
} }, serialize(e, r) {
  return "new URLSearchParams(" + r.serialize(e) + ")";
}, deserialize(e, r) {
  return new URLSearchParams(r.deserialize(e));
} }), me = fe;
class SerovalChunkReader {
  reader;
  buffer;
  done;
  constructor(stream) {
    this.reader = stream.getReader();
    this.buffer = new Uint8Array(0);
    this.done = false;
  }
  async readChunk() {
    const chunk = await this.reader.read();
    if (!chunk.done) {
      let newBuffer = new Uint8Array(this.buffer.length + chunk.value.length);
      newBuffer.set(this.buffer);
      newBuffer.set(chunk.value, this.buffer.length);
      this.buffer = newBuffer;
    } else {
      this.done = true;
    }
  }
  async next() {
    if (this.buffer.length === 0) {
      if (this.done) {
        return {
          done: true,
          value: void 0
        };
      }
      await this.readChunk();
      return await this.next();
    }
    const head = new TextDecoder().decode(this.buffer.subarray(1, 11));
    const bytes = Number.parseInt(head, 16);
    while (bytes > this.buffer.length - 12) {
      if (this.done) {
        throw new Error("Malformed server function stream.");
      }
      await this.readChunk();
    }
    const partial = new TextDecoder().decode(this.buffer.subarray(12, 12 + bytes));
    this.buffer = this.buffer.subarray(12 + bytes);
    return {
      done: false,
      value: jo(partial)
    };
  }
  async drain() {
    while (true) {
      const result = await this.next();
      if (result.done) {
        break;
      }
    }
  }
}
async function deserializeStream(id, response) {
  if (!response.body) {
    throw new Error("missing body");
  }
  const reader = new SerovalChunkReader(response.body);
  const result = await reader.next();
  if (!result.done) {
    reader.drain().then(() => {
      delete $R[id];
    }, () => {
    });
  }
  return result.value;
}
let INSTANCE = 0;
function createRequest(base, id, instance, options) {
  return fetch(base, {
    method: "POST",
    ...options,
    headers: {
      ...options.headers,
      "X-Server-Id": id,
      "X-Server-Instance": instance
    }
  });
}
const plugins = [H2, _, Y2, K, l, u, ne, ie2, me, ue];
async function fetchServerFunction(base, id, options, args) {
  const instance = `server-fn:${INSTANCE++}`;
  const response = await (args.length === 0 ? createRequest(base, id, instance, options) : args.length === 1 && args[0] instanceof FormData ? createRequest(base, id, instance, {
    ...options,
    body: args[0]
  }) : args.length === 1 && args[0] instanceof URLSearchParams ? createRequest(base, id, instance, {
    ...options,
    body: args[0],
    headers: {
      ...options.headers,
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }) : createRequest(base, id, instance, {
    ...options,
    body: JSON.stringify(await Promise.resolve(Mo(args, {
      plugins
    }))),
    headers: {
      ...options.headers,
      "Content-Type": "application/json"
    }
  }));
  if (response.headers.has("Location") || response.headers.has("X-Revalidate") || response.headers.has("X-Single-Flight")) {
    if (response.body) {
      response.customBody = () => {
        return deserializeStream(instance, response);
      };
    }
    return response;
  }
  const contentType = response.headers.get("Content-Type");
  let result;
  if (contentType && contentType.startsWith("text/plain")) {
    result = await response.text();
  } else if (contentType && contentType.startsWith("application/json")) {
    result = await response.json();
  } else {
    result = await deserializeStream(instance, response);
  }
  if (response.headers.has("X-Error")) {
    throw result;
  }
  return result;
}
function createServerReference(id) {
  let baseURL = "/data/";
  if (!baseURL.endsWith("/")) baseURL += "/";
  const fn = (...args) => fetchServerFunction(`${baseURL}_server`, id, {}, args);
  return new Proxy(fn, {
    get(target, prop, receiver) {
      if (prop === "url") {
        return `${baseURL}_server?id=${encodeURIComponent(id)}`;
      }
      if (prop === "GET") {
        return receiver.withOptions({
          method: "GET"
        });
      }
      if (prop === "withOptions") {
        const url = `${baseURL}_server?id=${encodeURIComponent(id)}`;
        return (options) => {
          const fn2 = async (...args) => {
            const encodeArgs = options.method && options.method.toUpperCase() === "GET";
            return fetchServerFunction(encodeArgs ? url + (args.length ? `&args=${encodeURIComponent(JSON.stringify(await Promise.resolve(Mo(args, {
              plugins
            }))))}` : "") : `${baseURL}_server`, id, options, encodeArgs ? [] : args);
          };
          fn2.url = url;
          return fn2;
        };
      }
      return target[prop];
    }
  });
}
const getModelCatalog_query = createServerReference("7b6179107c91e79ec37da089e24e80d73bb84873aeaa39ba37a38ee5cc440cdb");
const getModelCatalog = query(getModelCatalog_query, "getModelCatalog");
function findModelCatalogEntry(catalog, model, lab) {
  const normalizedId = lab ? `${catalogLabSlug(lab)}/${catalogSlug(model)}` : model.trim().toLowerCase();
  const leaf = catalogSlug(model);
  return catalog.models.find((entry) => entry.id.toLowerCase() === normalizedId) ?? catalog.models.find((entry) => (lab ? entry.lab === catalogLabSlug(lab) : true) && entry.slug === leaf) ?? catalog.models.find((entry) => entry.slug === leaf);
}
function findModelCatalogLab(catalog, lab) {
  const id = catalogLabSlug(lab);
  return catalog.labs.find((entry) => entry.id === id);
}
function formatCatalogLabName(lab) {
  const known = {
    alibaba: "Alibaba",
    anthropic: "Anthropic",
    cohere: "Cohere",
    deepseek: "DeepSeek",
    google: "Google",
    meta: "Meta",
    minimax: "MiniMax",
    mistral: "Mistral",
    moonshotai: "Moonshot",
    openai: "OpenAI",
    perplexity: "Perplexity",
    stepfun: "StepFun",
    tencent: "Tencent",
    xai: "xAI",
    xiaomi: "Xiaomi",
    zai: "Z.ai",
    qwen: "Qwen",
    zhipu: "Zhipu",
    zhipuai: "Zhipu"
  };
  return known[catalogSlug(lab)] ?? lab.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
function catalogSlug(value) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").replace(/-{2,}/g, "-");
}
function catalogLabSlug(value) {
  const slug = catalogSlug(value);
  const aliases = {
    moonshot: "moonshotai",
    qwen: "alibaba",
    zhipu: "zhipuai",
    zai: "zhipuai"
  };
  return aliases[slug] ?? slug;
}
var _tmpl$$1 = /* @__PURE__ */ template(`<section id=model-comparison data-section=model-panel><p data-slot=section-title><strong><!$><!/>.</strong> <span></span></p><div data-component=comparison-card-grid>`), _tmpl$2$1 = /* @__PURE__ */ template(`<small><!$><!/> / <!$><!/>`), _tmpl$3$1 = /* @__PURE__ */ template(`<a data-component=comparison-card><span></span><strong><!$><!/> <em>vs</em> <!$><!/></strong><p><b></b><i></i><b></b></p><!$><!/>`);
function modelRefFromCatalog(entry) {
  return {
    name: entry.name,
    lab: entry.lab,
    slug: entry.slug,
    labName: formatCatalogLabName(entry.lab)
  };
}
function comparisonHref(first, second) {
  return `${"/data/"}compare/${catalogSlug(first.lab)}/${catalogSlug(first.slug)}/${catalogSlug(second.lab)}/${catalogSlug(second.slug)}`;
}
function uniqueComparisonPairs(pairs) {
  return pairs.reduce((result, pair) => {
    const key = [modelKey(pair.first), modelKey(pair.second)].toSorted().join("|");
    if (result.keys.has(key) || modelKey(pair.first) === modelKey(pair.second)) return result;
    result.keys.add(key);
    result.pairs.push(pair);
    return result;
  }, {
    keys: /* @__PURE__ */ new Set(),
    pairs: []
  }).pairs;
}
function ComparisonCardsSection(props) {
  return createComponent(Show, {
    get when() {
      return props.pairs.length > 0;
    },
    get children() {
      var _el$ = getNextElement(_tmpl$$1), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$5 = _el$3.firstChild, [_el$6, _co$] = getNextMarker(_el$5.nextSibling);
      _el$6.nextSibling;
      var _el$7 = _el$3.nextSibling, _el$8 = _el$7.nextSibling, _el$9 = _el$2.nextSibling;
      insert(_el$3, () => props.title ?? "Model Comparisons", _el$6, _co$);
      insert(_el$8, () => props.description ?? "Compare usage, cost, limits, and features.");
      insert(_el$9, createComponent(For, {
        get each() {
          return props.pairs;
        },
        children: (pair) => (() => {
          var _el$0 = getNextElement(_tmpl$3$1), _el$1 = _el$0.firstChild, _el$10 = _el$1.nextSibling, _el$14 = _el$10.firstChild, [_el$15, _co$2] = getNextMarker(_el$14.nextSibling), _el$11 = _el$15.nextSibling, _el$12 = _el$11.nextSibling, _el$13 = _el$12.nextSibling, _el$16 = _el$13.nextSibling, [_el$17, _co$3] = getNextMarker(_el$16.nextSibling), _el$18 = _el$10.nextSibling, _el$19 = _el$18.firstChild, _el$20 = _el$19.nextSibling, _el$21 = _el$20.nextSibling, _el$28 = _el$18.nextSibling, [_el$29, _co$6] = getNextMarker(_el$28.nextSibling);
          insert(_el$1, () => pair.detail);
          insert(_el$10, () => pair.first.name, _el$15, _co$2);
          insert(_el$10, () => pair.second.name, _el$17, _co$3);
          insert(_el$19, () => pair.first.labName ?? formatCatalogLabName(pair.first.lab));
          insert(_el$21, () => pair.second.labName ?? formatCatalogLabName(pair.second.lab));
          insert(_el$0, createComponent(Show, {
            get when() {
              return pair.first.metric || pair.second.metric;
            },
            get children() {
              var _el$22 = getNextElement(_tmpl$2$1), _el$24 = _el$22.firstChild, [_el$25, _co$4] = getNextMarker(_el$24.nextSibling), _el$23 = _el$25.nextSibling, _el$26 = _el$23.nextSibling, [_el$27, _co$5] = getNextMarker(_el$26.nextSibling);
              insert(_el$22, () => pair.first.metric ?? "Listed", _el$25, _co$4);
              insert(_el$22, () => pair.second.metric ?? "Listed", _el$27, _co$5);
              return _el$22;
            }
          }), _el$29, _co$6);
          createRenderEffect(() => setAttribute(_el$0, "href", comparisonHref(pair.first, pair.second)));
          return _el$0;
        })()
      }));
      createRenderEffect(() => setAttribute(_el$, "data-variant", props.compact ? "compact" : void 0));
      return _el$;
    }
  });
}
function modelKey(model) {
  return `${catalogSlug(model.lab)}/${catalogSlug(model.slug)}`;
}
const opencodeWordmarkDark = "data:image/svg+xml,%3csvg%20width='234'%20height='42'%20viewBox='0%200%20234%2042'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M18%2030H6V18H18V30Z'%20fill='%234B4646'/%3e%3cpath%20d='M18%2012H6V30H18V12ZM24%2036H0V6H24V36Z'%20fill='%23B7B1B1'/%3e%3cpath%20d='M48%2030H36V18H48V30Z'%20fill='%234B4646'/%3e%3cpath%20d='M36%2030H48V12H36V30ZM54%2036H36V42H30V6H54V36Z'%20fill='%23B7B1B1'/%3e%3cpath%20d='M84%2024V30H66V24H84Z'%20fill='%234B4646'/%3e%3cpath%20d='M84%2024H66V30H84V36H60V6H84V24ZM66%2018H78V12H66V18Z'%20fill='%23B7B1B1'/%3e%3cpath%20d='M108%2036H96V18H108V36Z'%20fill='%234B4646'/%3e%3cpath%20d='M108%2012H96V36H90V6H108V12ZM114%2036H108V12H114V36Z'%20fill='%23B7B1B1'/%3e%3cpath%20d='M144%2030H126V18H144V30Z'%20fill='%234B4646'/%3e%3cpath%20d='M144%2012H126V30H144V36H120V6H144V12Z'%20fill='%23F1ECEC'/%3e%3cpath%20d='M168%2030H156V18H168V30Z'%20fill='%234B4646'/%3e%3cpath%20d='M168%2012H156V30H168V12ZM174%2036H150V6H174V36Z'%20fill='%23F1ECEC'/%3e%3cpath%20d='M198%2030H186V18H198V30Z'%20fill='%234B4646'/%3e%3cpath%20d='M198%2012H186V30H198V12ZM204%2036H180V6H198V0H204V36Z'%20fill='%23F1ECEC'/%3e%3cpath%20d='M234%2024V30H216V24H234Z'%20fill='%234B4646'/%3e%3cpath%20d='M216%2012V18H228V12H216ZM234%2024H216V30H234V36H210V6H234V24Z'%20fill='%23F1ECEC'/%3e%3c/svg%3e";
var _tmpl$ = /* @__PURE__ */ template(`<svg><path d="M4.44 4.44L11.56 11.56M11.56 4.44L4.44 11.56"stroke=currentColor></svg>`, false, true, false), _tmpl$2 = /* @__PURE__ */ template(`<header data-component=top><div data-slot=header-bar><a data-slot=brand></a><nav data-component=section-nav><ul></ul></nav><div data-slot=header-actions><a data-slot=header-button data-variant=neutral target=_blank rel=noreferrer><strong></strong><span>[<!$><!/>]</span></a><a data-slot=header-button data-variant=contrast href=https://opencode.ai/><strong></strong></a><button data-slot=menu-button type=button aria-controls=stats-mobile-nav><svg width=16 height=16 viewBox="0 0 16 16"fill=none aria-hidden=true></svg></button></div></div><nav id=stats-mobile-nav data-slot=mobile-menu><a data-slot=mobile-menu-item data-variant=github target=_blank rel=noreferrer><strong></strong><span>[<!$><!/>]</span></a><!$><!/>`), _tmpl$3 = /* @__PURE__ */ template(`<li><a>`), _tmpl$4 = /* @__PURE__ */ template(`<svg><path d="M2 4.72H14M2 8.5H14M2 12.28H14"stroke=currentColor></svg>`, false, true, false), _tmpl$5 = /* @__PURE__ */ template(`<a data-slot=mobile-menu-item>`), _tmpl$6 = /* @__PURE__ */ template(`<svg data-slot=stats-wordmark width=66 height=20 viewBox="0 0 66 20"fill=none aria-hidden=true><path opacity=0.2 d="M12 16H4V8H12V16Z"fill=currentColor></path><path d="M12 4H4V16H12V4ZM16 20H0V0H16V20Z"fill=currentColor></path><path d="M63.3543 16L62.5119 12.8711H58.6437L57.8013 16H55.7383L59.2454 4H61.9618L65.4689 16H63.3543ZM61.0678 7.851L60.6896 5.94269H60.4489L60.0707 7.851L59.1595 11.1347H61.9962L61.0678 7.851Z"fill=currentColor></path><path d="M52.5951 5.87392V16H50.4461V5.87392H47.4375V4H55.6209V5.87392H52.5951Z"fill=currentColor></path><path d="M45.2059 16L44.3635 12.8711H40.4953L39.6529 16H37.5898L41.097 4H43.8133L47.3205 16H45.2059ZM42.9194 7.851L42.5411 5.94269H42.3004L41.9222 7.851L41.011 11.1347H43.8477L42.9194 7.851Z"fill=currentColor></path><path d="M28 4H32.0917C32.8138 4 33.4556 4.11461 34.0172 4.34384C34.5903 4.5616 35.0716 4.9169 35.4613 5.40974C35.8625 5.89112 36.1662 6.51003 36.3725 7.26648C36.5788 8.02292 36.6819 8.9341 36.6819 10C36.6819 11.0659 36.5788 11.9771 36.3725 12.7335C36.1662 13.49 35.8625 14.1146 35.4613 14.6075C35.0716 15.0888 34.5903 15.4441 34.0172 15.6734C33.4556 15.8911 32.8138 16 32.0917 16H28V4ZM32.0917 14.1261C32.8252 14.1261 33.3926 13.9026 33.7937 13.4556C34.1948 12.9971 34.3954 12.3152 34.3954 11.4097V8.59026C34.3954 7.68481 34.1948 7.0086 33.7937 6.5616C33.3926 6.10315 32.8252 5.87392 32.0917 5.87392H30.149V14.1261H32.0917Z"fill=currentColor>`), _tmpl$7 = /* @__PURE__ */ template(`<svg data-slot=opencode-mark width=40 height=40 viewBox="0 0 40 40"fill=none aria-hidden=true><path d="M40 40H0V0H40V40Z"fill=var(--stats-logo-bg)></path><path d="M26 29H14V17H26V29Z"fill=var(--stats-logo-fill)></path><path d="M26 11H14V29H26V11ZM32 35H8V5H32V35Z"fill=var(--stats-logo-stroke)>`), _tmpl$8 = /* @__PURE__ */ template(`<footer data-component=footer><!$><!/><div data-slot=footer-grid><a data-slot=footer-mark href=https://opencode.ai></a><!$><!/><!$><!/><!$><!/><div data-slot=footer-column><h2></h2><p></p><button data-slot=subscribe-button type=button></button></div></div><div data-slot=footer-pattern aria-hidden=true></div><div data-slot=footer-bottom><div><span></span><span data-slot=status></span></div><div data-slot=footer-controls><!$><!/><div data-slot=theme-toggle role=group></div></div></div><!$><!/>`), _tmpl$9 = /* @__PURE__ */ template(`<button data-slot=theme-option type=button>`), _tmpl$0 = /* @__PURE__ */ template(`<label data-slot=footer-language><span></span><select>`), _tmpl$1 = /* @__PURE__ */ template(`<option>`), _tmpl$10 = /* @__PURE__ */ template(`<a data-component=section-bridge><span></span><i></i><strong></strong><b>▸`), _tmpl$11 = /* @__PURE__ */ template(`<svg x=2.0549 y=1.742 width=12.3867 height=12.3971 viewBox="0 0 12.3867 12.3971"preserveAspectRatio=none overflow=visible><path d="M9.05556 8.39711C6.37067 8.39711 4.19444 6.22089 4.19444 3.536C4.19444 2.48445 4.53122 1.51456 5.09822 0.71889C2.48178 1.20733 0.5 3.49944 0.5 6.25822C0.5 9.37244 3.02467 11.8971 6.13889 11.8971C8.76156 11.8971 10.9596 10.1036 11.5903 7.67844C10.8514 8.13189 9.98578 8.39711 9.05556 8.39711Z"stroke=currentColor stroke-linecap=round>`), _tmpl$12 = /* @__PURE__ */ template(`<svg data-slot=theme-icon width=16 height=16 viewBox="0 0 16 16"fill=none aria-hidden=true>`), _tmpl$13 = /* @__PURE__ */ template(`<svg x=0.6102 y=0.6102 width=14.7778 height=14.7778 viewBox="0 0 14.7778 14.7778"preserveAspectRatio=none overflow=visible><path d="M7.38889 0.5V1.38889M12.26 2.51782L11.6315 3.14627M14.2778 7.38892H13.3889M12.26 12.26L11.6315 11.6316M7.38889 14.2778V13.3889M2.51778 12.26L3.14622 11.6316M0.5 7.38892H1.38889M2.51778 2.51782L3.14622 3.14627M7.38888 11.1666C9.47528 11.1666 11.1667 9.47526 11.1667 7.38886C11.1667 5.30245 9.47528 3.61108 7.38888 3.61108C5.30247 3.61108 3.6111 5.30245 3.6111 7.38886C3.6111 9.47526 5.30247 11.1666 7.38888 11.1666Z"stroke=currentColor stroke-linecap=square>`), _tmpl$14 = /* @__PURE__ */ template(`<svg><rect x=1.5552 y=2.4448 width=12.8896 height=8.8888 fill=currentColor opacity=0.3></svg>`, false, true, false), _tmpl$15 = /* @__PURE__ */ template(`<svg x=1.0552 y=1.9446 width=13.8889 height=12.5325 viewBox="0 0 13.8889 12.5325"preserveAspectRatio=none overflow=visible><path d="M4.05559 12.0555C4.72936 11.8431 5.72492 11.6111 6.94448 11.6111M6.94448 11.6111C7.65114 11.6111 8.66981 11.6893 9.83336 12.0555M6.94448 11.6111L6.94448 9.38888M13.3889 0.5H0.500102C0.500102 0.5 0.500017 1.29594 0.500017 2.27778V7.61112C0.500017 8.59298 0.500007 9.38889 0.500007 9.38889H13.3889C13.3889 9.38889 13.3889 8.59298 13.3889 7.61112V2.27778C13.3889 1.29594 13.3889 0.5 13.3889 0.5Z"stroke=currentColor>`), _tmpl$16 = /* @__PURE__ */ template(`<p data-state=success>`), _tmpl$17 = /* @__PURE__ */ template(`<p data-state=error>`), _tmpl$18 = /* @__PURE__ */ template(`<div data-component=subscribe-modal role=dialog aria-modal=true aria-labelledby=subscribe-title><div data-slot=modal-scrim aria-hidden=true></div><div data-slot=modal-panel><div data-slot=modal-brand><img data-slot=modal-logo alt=OpenCode><button data-slot=modal-close type=button><svg width=16 height=16 viewBox="0 0 16 16"fill=none aria-hidden=true><path d="M4.44 4.44L11.56 11.56M11.56 4.44L4.44 11.56"stroke=currentColor></path></svg></button></div><div data-slot=modal-body><div data-slot=modal-intro><h2 id=subscribe-title></h2><p></p></div><form data-slot=subscribe-form method=post><input type=email name=email required><button type=submit><span></span></button></form><div data-slot=subscribe-feedback aria-live=polite><!$><!/><!$><!/>`), _tmpl$19 = /* @__PURE__ */ template(`<div data-slot=footer-column><h2></h2><nav>`), _tmpl$20 = /* @__PURE__ */ template(`<a rel=noreferrer>`);
const githubLink = {
  href: "https://github.com/anomalyco/opencode",
  fallbackStars: "150K"
};
const themePreferences = ["dark", "light", "system"];
const themeStorageKey = "opencode:stats-theme";
const getGitHubStars_query = createServerReference("c6f4612d416a847b748b86e219bd31ae0b93b6d461ef6c457e87b45a6b400aca");
const getGitHubStars = query(getGitHubStars_query, "getGitHubStars");
function isThemePreference(value) {
  return value === "dark" || value === "light" || value === "system";
}
function applyThemePreference(preference) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.statsTheme = preference;
  if (preference === "system") {
    document.documentElement.style.removeProperty("color-scheme");
    return;
  }
  document.documentElement.style.setProperty("color-scheme", preference);
}
function Header(props) {
  const i18n = useI18n();
  const language = useLanguage();
  const [menuOpen, setMenuOpen] = createSignal(false);
  const [menuViewport, setMenuViewport] = createSignal(false);
  const links = createMemo(() => props.links ?? [{
    href: "#top-models",
    label: i18n.t("nav.topModels")
  }, {
    href: "#leaderboard",
    label: i18n.t("nav.leaderboard")
  }, {
    href: "#session-cost",
    label: i18n.t("nav.sessionCost")
  }, {
    href: "#token-cost",
    label: i18n.t("nav.tokenCost")
  }, {
    href: "#cache-ratio",
    label: i18n.t("nav.cacheRatio")
  }, {
    href: "#market-share",
    label: i18n.t("nav.marketShare")
  }, {
    href: "#geo-breakdown",
    label: i18n.t("nav.geoBreakdown")
  }]);
  const localHref = (href) => href.startsWith("/") ? language.route(href) : href;
  createEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(max-width: 89.999rem)");
    const update = () => setMenuViewport(media.matches);
    update();
    media.addEventListener("change", update);
    onCleanup(() => media.removeEventListener("change", update));
  });
  createEffect(() => {
    if (!menuOpen()) return;
    if (!menuViewport()) return;
    if (typeof document === "undefined") return;
    const page = document.querySelector('[data-page="stats"]');
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const htmlOverflow = document.documentElement.style.overflow;
    const pagePaddingRight = page?.style.paddingRight;
    const bodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    if (scrollbarWidth > 0 && page) page.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.overflow = "hidden";
    onCleanup(() => {
      document.documentElement.style.overflow = htmlOverflow;
      if (page && pagePaddingRight !== void 0) page.style.paddingRight = pagePaddingRight;
      document.body.style.overflow = bodyOverflow;
    });
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$2), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, _el$5 = _el$4.firstChild, _el$6 = _el$4.nextSibling, _el$7 = _el$6.firstChild, _el$8 = _el$7.firstChild, _el$9 = _el$8.nextSibling, _el$0 = _el$9.firstChild, _el$10 = _el$0.nextSibling, [_el$11, _co$] = getNextMarker(_el$10.nextSibling);
    _el$11.nextSibling;
    var _el$12 = _el$7.nextSibling, _el$13 = _el$12.firstChild, _el$14 = _el$12.nextSibling, _el$15 = _el$14.firstChild, _el$17 = _el$2.nextSibling, _el$18 = _el$17.firstChild, _el$19 = _el$18.firstChild, _el$20 = _el$19.nextSibling, _el$21 = _el$20.firstChild, _el$23 = _el$21.nextSibling, [_el$24, _co$2] = getNextMarker(_el$23.nextSibling);
    _el$24.nextSibling;
    var _el$25 = _el$18.nextSibling, [_el$26, _co$3] = getNextMarker(_el$25.nextSibling);
    insert(_el$3, createComponent(DataWordmark, {}));
    insert(_el$5, createComponent(For, {
      get each() {
        return links();
      },
      children: (link) => (() => {
        var _el$27 = getNextElement(_tmpl$3), _el$28 = _el$27.firstChild;
        insert(_el$28, () => link.label);
        createRenderEffect(() => setAttribute(_el$28, "href", localHref(link.href)));
        return _el$27;
      })()
    }));
    insert(_el$8, () => i18n.t("header.github"));
    insert(_el$9, () => props.githubStars, _el$11, _co$);
    insert(_el$13, () => i18n.t("header.tryOpenCode"));
    _el$14.$$click = () => setMenuOpen((value) => !value);
    insert(_el$15, createComponent(Show, {
      get when() {
        return menuOpen();
      },
      get fallback() {
        return getNextElement(_tmpl$4);
      },
      get children() {
        return getNextElement(_tmpl$);
      }
    }));
    insert(_el$19, () => i18n.t("header.github"));
    insert(_el$20, () => props.githubStars, _el$24, _co$2);
    insert(_el$17, createComponent(For, {
      get each() {
        return links();
      },
      children: (link) => (() => {
        var _el$30 = getNextElement(_tmpl$5);
        _el$30.$$click = () => setMenuOpen(false);
        insert(_el$30, () => link.label);
        createRenderEffect(() => setAttribute(_el$30, "href", localHref(link.href)));
        runHydrationEvents();
        return _el$30;
      })()
    }), _el$26, _co$3);
    createRenderEffect((_p$) => {
      var _v$ = menuOpen() ? "true" : void 0, _v$2 = localHref(props.brandHref ?? "/data/"), _v$3 = i18n.t("header.brandLabel"), _v$4 = i18n.t("header.sectionNavLabel"), _v$5 = githubLink.href, _v$6 = `${i18n.t("header.githubAria")} (${props.githubStars} stars)`, _v$7 = menuOpen() ? "true" : "false", _v$8 = menuOpen() ? i18n.t("header.closeNav") : i18n.t("header.openNav"), _v$9 = i18n.t("header.sectionNavLabel"), _v$0 = !menuOpen(), _v$1 = githubLink.href, _v$10 = `${i18n.t("header.githubAria")} (${props.githubStars} stars)`;
      _v$ !== _p$.e && setAttribute(_el$, "data-menu-open", _p$.e = _v$);
      _v$2 !== _p$.t && setAttribute(_el$3, "href", _p$.t = _v$2);
      _v$3 !== _p$.a && setAttribute(_el$3, "aria-label", _p$.a = _v$3);
      _v$4 !== _p$.o && setAttribute(_el$4, "aria-label", _p$.o = _v$4);
      _v$5 !== _p$.i && setAttribute(_el$7, "href", _p$.i = _v$5);
      _v$6 !== _p$.n && setAttribute(_el$7, "aria-label", _p$.n = _v$6);
      _v$7 !== _p$.s && setAttribute(_el$14, "aria-expanded", _p$.s = _v$7);
      _v$8 !== _p$.h && setAttribute(_el$14, "aria-label", _p$.h = _v$8);
      _v$9 !== _p$.r && setAttribute(_el$17, "aria-label", _p$.r = _v$9);
      _v$0 !== _p$.d && setProperty(_el$17, "hidden", _p$.d = _v$0);
      _v$1 !== _p$.l && setAttribute(_el$18, "href", _p$.l = _v$1);
      _v$10 !== _p$.u && setAttribute(_el$18, "aria-label", _p$.u = _v$10);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0,
      s: void 0,
      h: void 0,
      r: void 0,
      d: void 0,
      l: void 0,
      u: void 0
    });
    runHydrationEvents();
    return _el$;
  })();
}
function DataWordmark() {
  return getNextElement(_tmpl$6);
}
function OpenCodeMark() {
  return getNextElement(_tmpl$7);
}
function Footer(props) {
  const i18n = useI18n();
  const language = useLanguage();
  const [subscribeOpen, setSubscribeOpen] = createSignal(false);
  const localHref = (href) => href.startsWith("/") ? language.route(href) : href;
  const modelStats = props.links ?? [{
    href: "#top-models",
    label: i18n.t("nav.topModels")
  }, {
    href: "#leaderboard",
    label: i18n.t("nav.leaderboard")
  }, {
    href: "#session-cost",
    label: i18n.t("nav.sessionCost")
  }, {
    href: "#token-cost",
    label: i18n.t("nav.tokenCost")
  }, {
    href: "#cache-ratio",
    label: i18n.t("nav.cacheRatio")
  }, {
    href: "#market-share",
    label: i18n.t("nav.marketShare")
  }, {
    href: "#geo-breakdown",
    label: i18n.t("nav.geoBreakdown")
  }];
  const legal = [{
    href: "https://opencode.ai/legal/terms-of-service",
    label: i18n.t("footer.terms")
  }, {
    href: "https://opencode.ai/legal/privacy-policy",
    label: i18n.t("footer.privacy")
  }];
  const connect = [{
    href: "mailto:hello@opencode.ai",
    label: i18n.t("footer.contact")
  }, {
    href: "https://opencode.ai/discord",
    label: i18n.t("footer.community")
  }, {
    href: "https://x.com/opencode",
    label: "X"
  }, {
    href: githubLink.href,
    label: i18n.t("header.github")
  }, {
    href: "https://www.youtube.com/@anomaly-co",
    label: i18n.t("footer.youtube")
  }];
  const bridge = () => props.bridge === void 0 ? {
    href: "#geo-breakdown",
    label: i18n.t("nav.geoBreakdown").toUpperCase()
  } : props.bridge;
  return (() => {
    var _el$33 = getNextElement(_tmpl$8), _el$55 = _el$33.firstChild, [_el$56, _co$8] = getNextMarker(_el$55.nextSibling), _el$34 = _el$56.nextSibling, _el$35 = _el$34.firstChild, _el$40 = _el$35.nextSibling, [_el$41, _co$4] = getNextMarker(_el$40.nextSibling), _el$42 = _el$41.nextSibling, [_el$43, _co$5] = getNextMarker(_el$42.nextSibling), _el$44 = _el$43.nextSibling, [_el$45, _co$6] = getNextMarker(_el$44.nextSibling), _el$36 = _el$45.nextSibling, _el$37 = _el$36.firstChild, _el$38 = _el$37.nextSibling, _el$39 = _el$38.nextSibling, _el$46 = _el$34.nextSibling, _el$47 = _el$46.nextSibling, _el$48 = _el$47.firstChild, _el$49 = _el$48.firstChild, _el$50 = _el$49.nextSibling, _el$51 = _el$48.nextSibling, _el$53 = _el$51.firstChild, [_el$54, _co$7] = getNextMarker(_el$53.nextSibling), _el$52 = _el$54.nextSibling, _el$57 = _el$47.nextSibling, [_el$58, _co$9] = getNextMarker(_el$57.nextSibling);
    insert(_el$33, createComponent(Show, {
      get when() {
        return bridge();
      },
      children: (link) => createComponent(SectionBridge, {
        get label() {
          return link().label;
        },
        get href() {
          return link().href;
        }
      })
    }), _el$56, _co$8);
    insert(_el$35, createComponent(OpenCodeMark, {}));
    insert(_el$34, createComponent(FooterColumn, {
      get title() {
        return i18n.t("footer.modelData");
      },
      links: modelStats,
      localHref
    }), _el$41, _co$4);
    insert(_el$34, createComponent(FooterColumn, {
      get title() {
        return i18n.t("footer.legal");
      },
      links: legal,
      localHref
    }), _el$43, _co$5);
    insert(_el$34, createComponent(FooterColumn, {
      get title() {
        return i18n.t("footer.connect");
      },
      links: connect,
      localHref
    }), _el$45, _co$6);
    insert(_el$37, () => i18n.t("footer.newsletter"));
    insert(_el$38, () => i18n.t("footer.newsletterBody"));
    _el$39.$$click = () => setSubscribeOpen(true);
    insert(_el$39, () => i18n.t("footer.subscribe"));
    insert(_el$49, () => i18n.t("footer.copyright"));
    insert(_el$50, () => i18n.t("footer.status"));
    insert(_el$51, createComponent(FooterLanguageSwitcher, {}), _el$54, _co$7);
    insert(_el$52, createComponent(For, {
      each: themePreferences,
      children: (preference) => (() => {
        var _el$59 = getNextElement(_tmpl$9);
        _el$59.$$click = () => props.onThemePreferenceChange(preference);
        insert(_el$59, createComponent(ThemePreferenceIcon, {
          preference
        }));
        createRenderEffect((_p$) => {
          var _v$13 = i18n.t(themePreferenceLabelKey(preference)), _v$14 = props.themePreference === preference ? "true" : "false", _v$15 = i18n.t(themePreferenceLabelKey(preference));
          _v$13 !== _p$.e && setAttribute(_el$59, "aria-label", _p$.e = _v$13);
          _v$14 !== _p$.t && setAttribute(_el$59, "aria-pressed", _p$.t = _v$14);
          _v$15 !== _p$.a && setAttribute(_el$59, "title", _p$.a = _v$15);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        });
        runHydrationEvents();
        return _el$59;
      })()
    }));
    insert(_el$33, createComponent(Show, {
      get when() {
        return subscribeOpen();
      },
      get children() {
        return createComponent(SubscribeModal, {
          onClose: () => setSubscribeOpen(false)
        });
      }
    }), _el$58, _co$9);
    createRenderEffect((_p$) => {
      var _v$11 = i18n.t("footer.homeAria"), _v$12 = i18n.t("theme.groupLabel");
      _v$11 !== _p$.e && setAttribute(_el$35, "aria-label", _p$.e = _v$11);
      _v$12 !== _p$.t && setAttribute(_el$52, "aria-label", _p$.t = _v$12);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    runHydrationEvents();
    return _el$33;
  })();
}
function FooterLanguageSwitcher() {
  const i18n = useI18n();
  const language = useLanguage();
  return (() => {
    var _el$60 = getNextElement(_tmpl$0), _el$61 = _el$60.firstChild, _el$62 = _el$61.nextSibling;
    insert(_el$61, () => i18n.t("footer.language"));
    _el$62.addEventListener("change", (event) => {
      const locale = event.currentTarget.value;
      const url = new URL(window.location.href);
      const current = `${url.pathname}${url.search}${url.hash}`;
      const href = `${route(locale, url.pathname)}${url.search}${url.hash}`;
      language.setLocale(locale);
      if (href !== current) window.location.assign(href);
    });
    insert(_el$62, createComponent(For, {
      get each() {
        return language.locales;
      },
      children: (locale) => (() => {
        var _el$63 = getNextElement(_tmpl$1);
        setProperty(_el$63, "value", locale);
        insert(_el$63, () => language.label(locale));
        return _el$63;
      })()
    }));
    createRenderEffect(() => setAttribute(_el$62, "aria-label", i18n.t("footer.language")));
    createRenderEffect(() => setProperty(_el$62, "value", language.locale()));
    return _el$60;
  })();
}
function SectionBridge(props) {
  const i18n = useI18n();
  return (() => {
    var _el$64 = getNextElement(_tmpl$10), _el$65 = _el$64.firstChild, _el$66 = _el$65.nextSibling, _el$67 = _el$66.nextSibling;
    insert(_el$65, () => i18n.t("bridge.learnMore"));
    insert(_el$67, () => props.label);
    createRenderEffect(() => setAttribute(_el$64, "href", props.href));
    return _el$64;
  })();
}
function ThemePreferenceIcon(props) {
  return (() => {
    var _el$68 = getNextElement(_tmpl$12);
    insert(_el$68, createComponent(Show, {
      get when() {
        return props.preference === "dark";
      },
      get fallback() {
        return createComponent(Show, {
          get when() {
            return props.preference === "light";
          },
          get fallback() {
            return [getNextElement(_tmpl$14), getNextElement(_tmpl$15)];
          },
          get children() {
            return getNextElement(_tmpl$13);
          }
        });
      },
      get children() {
        return getNextElement(_tmpl$11);
      }
    }));
    return _el$68;
  })();
}
function SubscribeModal(props) {
  const i18n = useI18n();
  const [status, setStatus] = createSignal("idle");
  const [message, setMessage] = createSignal("");
  let input;
  onMount(() => {
    if (typeof document === "undefined") return;
    const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : void 0;
    const htmlOverflow = document.documentElement.style.overflow;
    const bodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    const focusTimeout = window.setTimeout(() => input?.focus(), 0);
    const onKeyDown = (event) => {
      if (event.key === "Escape") props.onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    onCleanup(() => {
      window.clearTimeout(focusTimeout);
      document.documentElement.style.overflow = htmlOverflow;
      document.body.style.overflow = bodyOverflow;
      document.removeEventListener("keydown", onKeyDown);
      activeElement?.focus();
    });
  });
  return (() => {
    var _el$73 = getNextElement(_tmpl$18), _el$74 = _el$73.firstChild, _el$75 = _el$74.nextSibling, _el$76 = _el$75.firstChild, _el$77 = _el$76.firstChild, _el$78 = _el$77.nextSibling, _el$79 = _el$76.nextSibling, _el$80 = _el$79.firstChild, _el$81 = _el$80.firstChild, _el$82 = _el$81.nextSibling, _el$83 = _el$80.nextSibling, _el$84 = _el$83.firstChild, _el$85 = _el$84.nextSibling, _el$86 = _el$85.firstChild, _el$87 = _el$83.nextSibling, _el$90 = _el$87.firstChild, [_el$91, _co$0] = getNextMarker(_el$90.nextSibling), _el$92 = _el$91.nextSibling, [_el$93, _co$1] = getNextMarker(_el$92.nextSibling);
    addEventListener(_el$74, "click", props.onClose, true);
    setAttribute(_el$77, "src", opencodeWordmarkDark);
    addEventListener(_el$78, "click", props.onClose, true);
    insert(_el$81, () => i18n.t("modal.title"));
    insert(_el$82, () => i18n.t("modal.body"));
    _el$83.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      setStatus("pending");
      setMessage("");
      fetch(`${"/data/"}api/newsletter`, {
        method: "POST",
        body: new FormData(form)
      }).then(async (response) => {
        if (response.ok) {
          form.reset();
          setStatus("success");
          return;
        }
        setMessage(await newsletterErrorMessage(response, i18n.t("modal.error")));
        setStatus("error");
      }, () => {
        setMessage(i18n.t("modal.error"));
        setStatus("error");
      });
    });
    var _ref$ = input;
    typeof _ref$ === "function" ? use(_ref$, _el$84) : input = _el$84;
    insert(_el$86, (() => {
      var _c$ = memo(() => status() === "pending");
      return () => _c$() ? i18n.t("modal.subscribing") : i18n.t("modal.subscribe");
    })());
    insert(_el$87, createComponent(Show, {
      get when() {
        return status() === "success";
      },
      get children() {
        var _el$88 = getNextElement(_tmpl$16);
        insert(_el$88, () => i18n.t("modal.success"));
        return _el$88;
      }
    }), _el$91, _co$0);
    insert(_el$87, createComponent(Show, {
      get when() {
        return status() === "error";
      },
      get children() {
        var _el$89 = getNextElement(_tmpl$17);
        insert(_el$89, message);
        return _el$89;
      }
    }), _el$93, _co$1);
    createRenderEffect((_p$) => {
      var _v$16 = i18n.t("modal.closeNewsletter"), _v$17 = i18n.t("modal.email"), _v$18 = status() === "pending";
      _v$16 !== _p$.e && setAttribute(_el$78, "aria-label", _p$.e = _v$16);
      _v$17 !== _p$.t && setAttribute(_el$84, "placeholder", _p$.t = _v$17);
      _v$18 !== _p$.a && setProperty(_el$85, "disabled", _p$.a = _v$18);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    });
    runHydrationEvents();
    return _el$73;
  })();
}
function newsletterErrorMessage(response, fallback) {
  return response.json().then((body) => body && typeof body === "object" && "error" in body && typeof body.error === "string" ? body.error : fallback, () => fallback);
}
function FooterColumn(props) {
  return (() => {
    var _el$94 = getNextElement(_tmpl$19), _el$95 = _el$94.firstChild, _el$96 = _el$95.nextSibling;
    insert(_el$95, () => props.title);
    insert(_el$96, createComponent(For, {
      get each() {
        return props.links;
      },
      children: (link) => (() => {
        var _el$97 = getNextElement(_tmpl$20);
        insert(_el$97, () => link.label);
        createRenderEffect((_p$) => {
          var _v$19 = props.localHref(link.href), _v$20 = link.href.startsWith("http") ? "_blank" : void 0;
          _v$19 !== _p$.e && setAttribute(_el$97, "href", _p$.e = _v$19);
          _v$20 !== _p$.t && setAttribute(_el$97, "target", _p$.t = _v$20);
          return _p$;
        }, {
          e: void 0,
          t: void 0
        });
        return _el$97;
      })()
    }));
    createRenderEffect(() => setAttribute(_el$96, "aria-label", props.title));
    return _el$94;
  })();
}
function themePreferenceLabelKey(preference) {
  if (preference === "dark") return "theme.dark";
  if (preference === "light") return "theme.light";
  return "theme.system";
}
delegateEvents(["click"]);
export {
  ComparisonCardsSection as C,
  Footer as F,
  Header as H,
  applyThemePreference as a,
  comparisonHref as b,
  catalogSlug as c,
  createAsync as d,
  createServerReference as e,
  findModelCatalogEntry as f,
  findModelCatalogLab as g,
  formatCatalogLabName as h,
  getGitHubStars as i,
  getModelCatalog as j,
  githubLink as k,
  isThemePreference as l,
  modelRefFromCatalog as m,
  query as q,
  themeStorageKey as t,
  uniqueComparisonPairs as u
};
