const sharedConfig = {
  context: void 0,
  registry: void 0,
  effects: void 0,
  done: false,
  getContextId() {
    return getContextId(this.context.count);
  },
  getNextContextId() {
    return getContextId(this.context.count++);
  }
};
function getContextId(count) {
  const num = String(count), len = num.length - 1;
  return sharedConfig.context.id + (len ? String.fromCharCode(96 + len) : "") + num;
}
function setHydrateContext(context) {
  sharedConfig.context = context;
}
function nextHydrateContext() {
  return {
    ...sharedConfig.context,
    id: sharedConfig.getNextContextId(),
    count: 0
  };
}
const IS_DEV = false;
const equalFn = (a, b) => a === b;
const $PROXY = Symbol("solid-proxy");
const SUPPORTS_PROXY = typeof Proxy === "function";
const $TRACK = Symbol("solid-track");
const signalOptions = {
  equals: equalFn
};
let ERROR = null;
let runEffects = runQueue;
const STALE = 1;
const PENDING = 2;
const UNOWNED = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
const NO_INIT = {};
var Owner = null;
let Transition = null;
let ExternalSourceConfig = null;
let Listener = null;
let Updates = null;
let Effects = null;
let ExecCount = 0;
function createRoot(fn, detachedOwner) {
  const listener = Listener, owner = Owner, unowned = fn.length === 0, current = detachedOwner === void 0 ? owner : detachedOwner, root = unowned ? UNOWNED : {
    owned: null,
    cleanups: null,
    context: current ? current.context : null,
    owner: current
  }, updateFn = unowned ? fn : () => fn(() => untrack(() => cleanNode(root)));
  Owner = root;
  Listener = null;
  try {
    return runUpdates(updateFn, true);
  } finally {
    Listener = listener;
    Owner = owner;
  }
}
function createSignal(value, options) {
  options = options ? Object.assign({}, signalOptions, options) : signalOptions;
  const s = {
    value,
    observers: null,
    observerSlots: null,
    comparator: options.equals || void 0
  };
  const setter = (value2) => {
    if (typeof value2 === "function") {
      if (Transition && Transition.running && Transition.sources.has(s)) value2 = value2(s.tValue);
      else value2 = value2(s.value);
    }
    return writeSignal(s, value2);
  };
  return [readSignal.bind(s), setter];
}
function createComputed(fn, value, options) {
  const c = createComputation(fn, value, true, STALE);
  updateComputation(c);
}
function createRenderEffect(fn, value, options) {
  const c = createComputation(fn, value, false, STALE);
  updateComputation(c);
}
function createEffect(fn, value, options) {
  runEffects = runUserEffects;
  const c = createComputation(fn, value, false, STALE), s = SuspenseContext && useContext(SuspenseContext);
  if (s) c.suspense = s;
  c.user = true;
  Effects ? Effects.push(c) : updateComputation(c);
}
function createMemo(fn, value, options) {
  options = options ? Object.assign({}, signalOptions, options) : signalOptions;
  const c = createComputation(fn, value, true, 0);
  c.observers = null;
  c.observerSlots = null;
  c.comparator = options.equals || void 0;
  updateComputation(c);
  return readSignal.bind(c);
}
function isPromise(v) {
  return v && typeof v === "object" && "then" in v;
}
function createResource(pSource, pFetcher, pOptions) {
  let source;
  let fetcher;
  let options;
  if (typeof pFetcher === "function") {
    source = pSource;
    fetcher = pFetcher;
    options = {};
  } else {
    source = true;
    fetcher = pSource;
    options = pFetcher || {};
  }
  let pr = null, initP = NO_INIT, id = null, loadedUnderTransition = false, scheduled = false, resolved = "initialValue" in options, dynamic = typeof source === "function" && createMemo(source);
  const contexts = /* @__PURE__ */ new Set(), [value, setValue] = (options.storage || createSignal)(options.initialValue), [error, setError] = createSignal(void 0), [track, trigger] = createSignal(void 0, {
    equals: false
  }), [state, setState] = createSignal(resolved ? "ready" : "unresolved");
  if (sharedConfig.context) {
    id = sharedConfig.getNextContextId();
    if (options.ssrLoadFrom === "initial") initP = options.initialValue;
    else if (sharedConfig.load && sharedConfig.has(id)) initP = sharedConfig.load(id);
  }
  function loadEnd(p, v, error2, key) {
    if (pr === p) {
      pr = null;
      key !== void 0 && (resolved = true);
      if ((p === initP || v === initP) && options.onHydrated) queueMicrotask(() => options.onHydrated(key, {
        value: v
      }));
      initP = NO_INIT;
      if (Transition && p && loadedUnderTransition) {
        Transition.promises.delete(p);
        loadedUnderTransition = false;
        runUpdates(() => {
          Transition.running = true;
          completeLoad(v, error2);
        }, false);
      } else completeLoad(v, error2);
    }
    return v;
  }
  function completeLoad(v, err) {
    runUpdates(() => {
      if (err === void 0) setValue(() => v);
      setState(err !== void 0 ? "errored" : resolved ? "ready" : "unresolved");
      setError(err);
      for (const c of contexts.keys()) c.decrement();
      contexts.clear();
    }, false);
  }
  function read() {
    const c = SuspenseContext && useContext(SuspenseContext), v = value(), err = error();
    if (err !== void 0 && !pr) throw err;
    if (Listener && !Listener.user && c) {
      createComputed(() => {
        track();
        if (pr) {
          if (c.resolved && Transition && loadedUnderTransition) Transition.promises.add(pr);
          else if (!contexts.has(c)) {
            c.increment();
            contexts.add(c);
          }
        }
      });
    }
    return v;
  }
  function load(refetching = true) {
    if (refetching !== false && scheduled) return;
    scheduled = false;
    const lookup = dynamic ? dynamic() : source;
    loadedUnderTransition = Transition && Transition.running;
    if (lookup == null || lookup === false) {
      loadEnd(pr, untrack(value));
      return;
    }
    if (Transition && pr) Transition.promises.delete(pr);
    let error2;
    const p = initP !== NO_INIT ? initP : untrack(() => {
      try {
        return fetcher(lookup, {
          value: value(),
          refetching
        });
      } catch (fetcherError) {
        error2 = fetcherError;
      }
    });
    if (error2 !== void 0) {
      loadEnd(pr, void 0, castError(error2), lookup);
      return;
    } else if (!isPromise(p)) {
      loadEnd(pr, p, void 0, lookup);
      return p;
    }
    pr = p;
    if ("v" in p) {
      if (p.s === 1) loadEnd(pr, p.v, void 0, lookup);
      else loadEnd(pr, void 0, castError(p.v), lookup);
      return p;
    }
    scheduled = true;
    queueMicrotask(() => scheduled = false);
    runUpdates(() => {
      setState(resolved ? "refreshing" : "pending");
      trigger();
    }, false);
    return p.then((v) => loadEnd(p, v, void 0, lookup), (e) => loadEnd(p, void 0, castError(e), lookup));
  }
  Object.defineProperties(read, {
    state: {
      get: () => state()
    },
    error: {
      get: () => error()
    },
    loading: {
      get() {
        const s = state();
        return s === "pending" || s === "refreshing";
      }
    },
    latest: {
      get() {
        if (!resolved) return read();
        const err = error();
        if (err && !pr) throw err;
        return value();
      }
    }
  });
  let owner = Owner;
  if (dynamic) createComputed(() => (owner = Owner, load(false)));
  else load(false);
  return [read, {
    refetch: (info) => runWithOwner(owner, () => load(info)),
    mutate: setValue
  }];
}
function batch(fn) {
  return runUpdates(fn, false);
}
function untrack(fn) {
  if (Listener === null) return fn();
  const listener = Listener;
  Listener = null;
  try {
    if (ExternalSourceConfig) ;
    return fn();
  } finally {
    Listener = listener;
  }
}
function on(deps, fn, options) {
  const isArray = Array.isArray(deps);
  let prevInput;
  let defer = options && options.defer;
  return (prevValue) => {
    let input;
    if (isArray) {
      input = Array(deps.length);
      for (let i = 0; i < deps.length; i++) input[i] = deps[i]();
    } else input = deps();
    if (defer) {
      defer = false;
      return prevValue;
    }
    const result = untrack(() => fn(input, prevInput, prevValue));
    prevInput = input;
    return result;
  };
}
function onMount(fn) {
  createEffect(() => untrack(fn));
}
function onCleanup(fn) {
  if (Owner === null) ;
  else if (Owner.cleanups === null) Owner.cleanups = [fn];
  else Owner.cleanups.push(fn);
  return fn;
}
function catchError(fn, handler) {
  ERROR || (ERROR = Symbol("error"));
  Owner = createComputation(void 0, void 0, true);
  Owner.context = {
    ...Owner.context,
    [ERROR]: [handler]
  };
  if (Transition && Transition.running) Transition.sources.add(Owner);
  try {
    return fn();
  } catch (err) {
    handleError(err);
  } finally {
    Owner = Owner.owner;
  }
}
function getListener() {
  return Listener;
}
function getOwner() {
  return Owner;
}
function runWithOwner(o, fn) {
  const prev = Owner;
  const prevListener = Listener;
  Owner = o;
  Listener = null;
  try {
    return runUpdates(fn, true);
  } catch (err) {
    handleError(err);
  } finally {
    Owner = prev;
    Listener = prevListener;
  }
}
function startTransition(fn) {
  if (Transition && Transition.running) {
    fn();
    return Transition.done;
  }
  const l = Listener;
  const o = Owner;
  return Promise.resolve().then(() => {
    Listener = l;
    Owner = o;
    let t;
    if (SuspenseContext) {
      t = Transition || (Transition = {
        sources: /* @__PURE__ */ new Set(),
        effects: [],
        promises: /* @__PURE__ */ new Set(),
        disposed: /* @__PURE__ */ new Set(),
        queue: /* @__PURE__ */ new Set(),
        running: true
      });
      t.done || (t.done = new Promise((res) => t.resolve = res));
      t.running = true;
    }
    runUpdates(fn, false);
    Listener = Owner = null;
    return t ? t.done : void 0;
  });
}
const [transPending, setTransPending] = /* @__PURE__ */ createSignal(false);
function resumeEffects(e) {
  Effects.push.apply(Effects, e);
  e.length = 0;
}
function createContext(defaultValue, options) {
  const id = Symbol("context");
  return {
    id,
    Provider: createProvider(id),
    defaultValue
  };
}
function useContext(context) {
  let value;
  return Owner && Owner.context && (value = Owner.context[context.id]) !== void 0 ? value : context.defaultValue;
}
function children(fn) {
  const children2 = createMemo(fn);
  const memo2 = createMemo(() => resolveChildren(children2()));
  memo2.toArray = () => {
    const c = memo2();
    return Array.isArray(c) ? c : c != null ? [c] : [];
  };
  return memo2;
}
let SuspenseContext;
function getSuspenseContext() {
  return SuspenseContext || (SuspenseContext = createContext());
}
function readSignal() {
  const runningTransition = Transition && Transition.running;
  if (this.sources && (runningTransition ? this.tState : this.state)) {
    if ((runningTransition ? this.tState : this.state) === STALE) updateComputation(this);
    else {
      const updates = Updates;
      Updates = null;
      runUpdates(() => lookUpstream(this), false);
      Updates = updates;
    }
  }
  if (Listener) {
    const sSlot = this.observers ? this.observers.length : 0;
    if (!Listener.sources) {
      Listener.sources = [this];
      Listener.sourceSlots = [sSlot];
    } else {
      Listener.sources.push(this);
      Listener.sourceSlots.push(sSlot);
    }
    if (!this.observers) {
      this.observers = [Listener];
      this.observerSlots = [Listener.sources.length - 1];
    } else {
      this.observers.push(Listener);
      this.observerSlots.push(Listener.sources.length - 1);
    }
  }
  if (runningTransition && Transition.sources.has(this)) return this.tValue;
  return this.value;
}
function writeSignal(node, value, isComp) {
  let current = Transition && Transition.running && Transition.sources.has(node) ? node.tValue : node.value;
  if (!node.comparator || !node.comparator(current, value)) {
    if (Transition) {
      const TransitionRunning = Transition.running;
      if (TransitionRunning || !isComp && Transition.sources.has(node)) {
        Transition.sources.add(node);
        node.tValue = value;
      }
      if (!TransitionRunning) node.value = value;
    } else node.value = value;
    if (node.observers && node.observers.length) {
      runUpdates(() => {
        for (let i = 0; i < node.observers.length; i += 1) {
          const o = node.observers[i];
          const TransitionRunning = Transition && Transition.running;
          if (TransitionRunning && Transition.disposed.has(o)) continue;
          if (TransitionRunning ? !o.tState : !o.state) {
            if (o.pure) Updates.push(o);
            else Effects.push(o);
            if (o.observers) markDownstream(o);
          }
          if (!TransitionRunning) o.state = STALE;
          else o.tState = STALE;
        }
        if (Updates.length > 1e6) {
          Updates = [];
          if (IS_DEV) ;
          throw new Error();
        }
      }, false);
    }
  }
  return value;
}
function updateComputation(node) {
  if (!node.fn) return;
  cleanNode(node);
  const time = ExecCount;
  runComputation(node, Transition && Transition.running && Transition.sources.has(node) ? node.tValue : node.value, time);
  if (Transition && !Transition.running && Transition.sources.has(node)) {
    queueMicrotask(() => {
      runUpdates(() => {
        Transition && (Transition.running = true);
        Listener = Owner = node;
        runComputation(node, node.tValue, time);
        Listener = Owner = null;
      }, false);
    });
  }
}
function runComputation(node, value, time) {
  let nextValue;
  const owner = Owner, listener = Listener;
  Listener = Owner = node;
  try {
    nextValue = node.fn(value);
  } catch (err) {
    if (node.pure) {
      if (Transition && Transition.running) {
        node.tState = STALE;
        node.tOwned && node.tOwned.forEach(cleanNode);
        node.tOwned = void 0;
      } else {
        node.state = STALE;
        node.owned && node.owned.forEach(cleanNode);
        node.owned = null;
      }
    }
    node.updatedAt = time + 1;
    return handleError(err);
  } finally {
    Listener = listener;
    Owner = owner;
  }
  if (!node.updatedAt || node.updatedAt <= time) {
    if (node.updatedAt != null && "observers" in node) {
      writeSignal(node, nextValue, true);
    } else if (Transition && Transition.running && node.pure) {
      if (!Transition.sources.has(node)) node.value = nextValue;
      Transition.sources.add(node);
      node.tValue = nextValue;
    } else node.value = nextValue;
    node.updatedAt = time;
  }
}
function createComputation(fn, init, pure, state = STALE, options) {
  const c = {
    fn,
    state,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: init,
    owner: Owner,
    context: Owner ? Owner.context : null,
    pure
  };
  if (Transition && Transition.running) {
    c.state = 0;
    c.tState = state;
  }
  if (Owner === null) ;
  else if (Owner !== UNOWNED) {
    if (Transition && Transition.running && Owner.pure) {
      if (!Owner.tOwned) Owner.tOwned = [c];
      else Owner.tOwned.push(c);
    } else {
      if (!Owner.owned) Owner.owned = [c];
      else Owner.owned.push(c);
    }
  }
  return c;
}
function runTop(node) {
  const runningTransition = Transition && Transition.running;
  if ((runningTransition ? node.tState : node.state) === 0) return;
  if ((runningTransition ? node.tState : node.state) === PENDING) return lookUpstream(node);
  if (node.suspense && untrack(node.suspense.inFallback)) return node.suspense.effects.push(node);
  const ancestors = [node];
  while ((node = node.owner) && (!node.updatedAt || node.updatedAt < ExecCount)) {
    if (runningTransition && Transition.disposed.has(node)) return;
    if (runningTransition ? node.tState : node.state) ancestors.push(node);
  }
  for (let i = ancestors.length - 1; i >= 0; i--) {
    node = ancestors[i];
    if (runningTransition) {
      let top = node, prev = ancestors[i + 1];
      while ((top = top.owner) && top !== prev) {
        if (Transition.disposed.has(top)) return;
      }
    }
    if ((runningTransition ? node.tState : node.state) === STALE) {
      updateComputation(node);
    } else if ((runningTransition ? node.tState : node.state) === PENDING) {
      const updates = Updates;
      Updates = null;
      runUpdates(() => lookUpstream(node, ancestors[0]), false);
      Updates = updates;
    }
  }
}
function runUpdates(fn, init) {
  if (Updates) return fn();
  let wait = false;
  if (!init) Updates = [];
  if (Effects) wait = true;
  else Effects = [];
  ExecCount++;
  try {
    const res = fn();
    completeUpdates(wait);
    return res;
  } catch (err) {
    if (!wait) Effects = null;
    Updates = null;
    handleError(err);
  }
}
function completeUpdates(wait) {
  if (Updates) {
    runQueue(Updates);
    Updates = null;
  }
  if (wait) return;
  let res;
  if (Transition) {
    if (!Transition.promises.size && !Transition.queue.size) {
      const sources = Transition.sources;
      const disposed = Transition.disposed;
      Effects.push.apply(Effects, Transition.effects);
      res = Transition.resolve;
      for (const e2 of Effects) {
        "tState" in e2 && (e2.state = e2.tState);
        delete e2.tState;
      }
      Transition = null;
      runUpdates(() => {
        for (const d of disposed) cleanNode(d);
        for (const v of sources) {
          v.value = v.tValue;
          if (v.owned) {
            for (let i = 0, len = v.owned.length; i < len; i++) cleanNode(v.owned[i]);
          }
          if (v.tOwned) v.owned = v.tOwned;
          delete v.tValue;
          delete v.tOwned;
          v.tState = 0;
        }
        setTransPending(false);
      }, false);
    } else if (Transition.running) {
      Transition.running = false;
      Transition.effects.push.apply(Transition.effects, Effects);
      Effects = null;
      setTransPending(true);
      return;
    }
  }
  const e = Effects;
  Effects = null;
  if (e.length) runUpdates(() => runEffects(e), false);
  if (res) res();
}
function runQueue(queue) {
  for (let i = 0; i < queue.length; i++) runTop(queue[i]);
}
function runUserEffects(queue) {
  let i, userLength = 0;
  for (i = 0; i < queue.length; i++) {
    const e = queue[i];
    if (!e.user) runTop(e);
    else queue[userLength++] = e;
  }
  if (sharedConfig.context) {
    if (sharedConfig.count) {
      sharedConfig.effects || (sharedConfig.effects = []);
      sharedConfig.effects.push(...queue.slice(0, userLength));
      return;
    }
    setHydrateContext();
  }
  if (sharedConfig.effects && (sharedConfig.done || !sharedConfig.count)) {
    queue = [...sharedConfig.effects, ...queue];
    userLength += sharedConfig.effects.length;
    delete sharedConfig.effects;
  }
  for (i = 0; i < userLength; i++) runTop(queue[i]);
}
function lookUpstream(node, ignore) {
  const runningTransition = Transition && Transition.running;
  if (runningTransition) node.tState = 0;
  else node.state = 0;
  for (let i = 0; i < node.sources.length; i += 1) {
    const source = node.sources[i];
    if (source.sources) {
      const state = runningTransition ? source.tState : source.state;
      if (state === STALE) {
        if (source !== ignore && (!source.updatedAt || source.updatedAt < ExecCount)) runTop(source);
      } else if (state === PENDING) lookUpstream(source, ignore);
    }
  }
}
function markDownstream(node) {
  const runningTransition = Transition && Transition.running;
  for (let i = 0; i < node.observers.length; i += 1) {
    const o = node.observers[i];
    if (runningTransition ? !o.tState : !o.state) {
      if (runningTransition) o.tState = PENDING;
      else o.state = PENDING;
      if (o.pure) Updates.push(o);
      else Effects.push(o);
      o.observers && markDownstream(o);
    }
  }
}
function cleanNode(node) {
  let i;
  if (node.sources) {
    while (node.sources.length) {
      const source = node.sources.pop(), index = node.sourceSlots.pop(), obs = source.observers;
      if (obs && obs.length) {
        const n = obs.pop(), s = source.observerSlots.pop();
        if (index < obs.length) {
          n.sourceSlots[s] = index;
          obs[index] = n;
          source.observerSlots[index] = s;
        }
      }
    }
  }
  if (node.tOwned) {
    for (i = node.tOwned.length - 1; i >= 0; i--) cleanNode(node.tOwned[i]);
    delete node.tOwned;
  }
  if (Transition && Transition.running && node.pure) {
    reset(node, true);
  } else if (node.owned) {
    for (i = node.owned.length - 1; i >= 0; i--) cleanNode(node.owned[i]);
    node.owned = null;
  }
  if (node.cleanups) {
    for (i = node.cleanups.length - 1; i >= 0; i--) node.cleanups[i]();
    node.cleanups = null;
  }
  if (Transition && Transition.running) node.tState = 0;
  else node.state = 0;
}
function reset(node, top) {
  if (!top) {
    node.tState = 0;
    Transition.disposed.add(node);
  }
  if (node.owned) {
    for (let i = 0; i < node.owned.length; i++) reset(node.owned[i]);
  }
}
function castError(err) {
  if (err instanceof Error) return err;
  return new Error(typeof err === "string" ? err : "Unknown error", {
    cause: err
  });
}
function runErrors(err, fns, owner) {
  try {
    for (const f of fns) f(err);
  } catch (e) {
    handleError(e, owner && owner.owner || null);
  }
}
function handleError(err, owner = Owner) {
  const fns = ERROR && owner && owner.context && owner.context[ERROR];
  const error = castError(err);
  if (!fns) throw error;
  if (Effects) Effects.push({
    fn() {
      runErrors(error, fns, owner);
    },
    state: STALE
  });
  else runErrors(error, fns, owner);
}
function resolveChildren(children2) {
  if (typeof children2 === "function" && !children2.length) return resolveChildren(children2());
  if (Array.isArray(children2)) {
    const results = [];
    for (let i = 0; i < children2.length; i++) {
      const result = resolveChildren(children2[i]);
      Array.isArray(result) ? results.push.apply(results, result) : results.push(result);
    }
    return results;
  }
  return children2;
}
function createProvider(id, options) {
  return function provider(props) {
    let res;
    createRenderEffect(() => res = untrack(() => {
      Owner.context = {
        ...Owner.context,
        [id]: props.value
      };
      return children(() => props.children);
    }), void 0);
    return res;
  };
}
const FALLBACK = Symbol("fallback");
function dispose(d) {
  for (let i = 0; i < d.length; i++) d[i]();
}
function mapArray(list, mapFn, options = {}) {
  let items = [], mapped = [], disposers = [], len = 0, indexes = mapFn.length > 1 ? [] : null;
  onCleanup(() => dispose(disposers));
  return () => {
    let newItems = list() || [], newLen = newItems.length, i, j;
    newItems[$TRACK];
    return untrack(() => {
      let newIndices, newIndicesNext, temp, tempdisposers, tempIndexes, start, end, newEnd, item;
      if (newLen === 0) {
        if (len !== 0) {
          dispose(disposers);
          disposers = [];
          items = [];
          mapped = [];
          len = 0;
          indexes && (indexes = []);
        }
        if (options.fallback) {
          items = [FALLBACK];
          mapped[0] = createRoot((disposer) => {
            disposers[0] = disposer;
            return options.fallback();
          });
          len = 1;
        }
      } else if (len === 0) {
        mapped = new Array(newLen);
        for (j = 0; j < newLen; j++) {
          items[j] = newItems[j];
          mapped[j] = createRoot(mapper);
        }
        len = newLen;
      } else {
        temp = new Array(newLen);
        tempdisposers = new Array(newLen);
        indexes && (tempIndexes = new Array(newLen));
        for (start = 0, end = Math.min(len, newLen); start < end && items[start] === newItems[start]; start++) ;
        for (end = len - 1, newEnd = newLen - 1; end >= start && newEnd >= start && items[end] === newItems[newEnd]; end--, newEnd--) {
          temp[newEnd] = mapped[end];
          tempdisposers[newEnd] = disposers[end];
          indexes && (tempIndexes[newEnd] = indexes[end]);
        }
        newIndices = /* @__PURE__ */ new Map();
        newIndicesNext = new Array(newEnd + 1);
        for (j = newEnd; j >= start; j--) {
          item = newItems[j];
          i = newIndices.get(item);
          newIndicesNext[j] = i === void 0 ? -1 : i;
          newIndices.set(item, j);
        }
        for (i = start; i <= end; i++) {
          item = items[i];
          j = newIndices.get(item);
          if (j !== void 0 && j !== -1) {
            temp[j] = mapped[i];
            tempdisposers[j] = disposers[i];
            indexes && (tempIndexes[j] = indexes[i]);
            j = newIndicesNext[j];
            newIndices.set(item, j);
          } else disposers[i]();
        }
        for (j = start; j < newLen; j++) {
          if (j in temp) {
            mapped[j] = temp[j];
            disposers[j] = tempdisposers[j];
            if (indexes) {
              indexes[j] = tempIndexes[j];
              indexes[j](j);
            }
          } else mapped[j] = createRoot(mapper);
        }
        mapped = mapped.slice(0, len = newLen);
        items = newItems.slice(0);
      }
      return mapped;
    });
    function mapper(disposer) {
      disposers[j] = disposer;
      if (indexes) {
        const [s, set] = createSignal(j);
        indexes[j] = set;
        return mapFn(newItems[j], s);
      }
      return mapFn(newItems[j]);
    }
  };
}
let hydrationEnabled = false;
function enableHydration() {
  hydrationEnabled = true;
}
function createComponent(Comp, props) {
  if (hydrationEnabled) {
    if (sharedConfig.context) {
      const c = sharedConfig.context;
      setHydrateContext(nextHydrateContext());
      const r = untrack(() => Comp(props || {}));
      setHydrateContext(c);
      return r;
    }
  }
  return untrack(() => Comp(props || {}));
}
function trueFn() {
  return true;
}
const propTraps = {
  get(_, property, receiver) {
    if (property === $PROXY) return receiver;
    return _.get(property);
  },
  has(_, property) {
    if (property === $PROXY) return true;
    return _.has(property);
  },
  set: trueFn,
  deleteProperty: trueFn,
  getOwnPropertyDescriptor(_, property) {
    return {
      configurable: true,
      enumerable: true,
      get() {
        return _.get(property);
      },
      set: trueFn,
      deleteProperty: trueFn
    };
  },
  ownKeys(_) {
    return _.keys();
  }
};
function resolveSource(s) {
  return !(s = typeof s === "function" ? s() : s) ? {} : s;
}
function resolveSources() {
  for (let i = 0, length = this.length; i < length; ++i) {
    const v = this[i]();
    if (v !== void 0) return v;
  }
}
function mergeProps(...sources) {
  let proxy = false;
  for (let i = 0; i < sources.length; i++) {
    const s = sources[i];
    proxy = proxy || !!s && $PROXY in s;
    sources[i] = typeof s === "function" ? (proxy = true, createMemo(s)) : s;
  }
  if (SUPPORTS_PROXY && proxy) {
    return new Proxy({
      get(property) {
        for (let i = sources.length - 1; i >= 0; i--) {
          const v = resolveSource(sources[i])[property];
          if (v !== void 0) return v;
        }
      },
      has(property) {
        for (let i = sources.length - 1; i >= 0; i--) {
          if (property in resolveSource(sources[i])) return true;
        }
        return false;
      },
      keys() {
        const keys = [];
        for (let i = 0; i < sources.length; i++) keys.push(...Object.keys(resolveSource(sources[i])));
        return [...new Set(keys)];
      }
    }, propTraps);
  }
  const sourcesMap = {};
  const defined = /* @__PURE__ */ Object.create(null);
  for (let i = sources.length - 1; i >= 0; i--) {
    const source = sources[i];
    if (!source) continue;
    const sourceKeys = Object.getOwnPropertyNames(source);
    for (let i2 = sourceKeys.length - 1; i2 >= 0; i2--) {
      const key = sourceKeys[i2];
      if (key === "__proto__" || key === "constructor") continue;
      const desc = Object.getOwnPropertyDescriptor(source, key);
      if (!defined[key]) {
        defined[key] = desc.get ? {
          enumerable: true,
          configurable: true,
          get: resolveSources.bind(sourcesMap[key] = [desc.get.bind(source)])
        } : desc.value !== void 0 ? desc : void 0;
      } else {
        const sources2 = sourcesMap[key];
        if (sources2) {
          if (desc.get) sources2.push(desc.get.bind(source));
          else if (desc.value !== void 0) sources2.push(() => desc.value);
        }
      }
    }
  }
  const target = {};
  const definedKeys = Object.keys(defined);
  for (let i = definedKeys.length - 1; i >= 0; i--) {
    const key = definedKeys[i], desc = defined[key];
    if (desc && desc.get) Object.defineProperty(target, key, desc);
    else target[key] = desc ? desc.value : void 0;
  }
  return target;
}
function splitProps(props, ...keys) {
  const len = keys.length;
  if (SUPPORTS_PROXY && $PROXY in props) {
    const blocked = len > 1 ? keys.flat() : keys[0];
    const res = keys.map((k) => {
      return new Proxy({
        get(property) {
          return k.includes(property) ? props[property] : void 0;
        },
        has(property) {
          return k.includes(property) && property in props;
        },
        keys() {
          return k.filter((property) => property in props);
        }
      }, propTraps);
    });
    res.push(new Proxy({
      get(property) {
        return blocked.includes(property) ? void 0 : props[property];
      },
      has(property) {
        return blocked.includes(property) ? false : property in props;
      },
      keys() {
        return Object.keys(props).filter((k) => !blocked.includes(k));
      }
    }, propTraps));
    return res;
  }
  const objects = [];
  for (let i = 0; i <= len; i++) {
    objects[i] = {};
  }
  for (const propName of Object.getOwnPropertyNames(props)) {
    let keyIndex = len;
    for (let i = 0; i < keys.length; i++) {
      if (keys[i].includes(propName)) {
        keyIndex = i;
        break;
      }
    }
    const desc = Object.getOwnPropertyDescriptor(props, propName);
    const isDefaultDesc = !desc.get && !desc.set && desc.enumerable && desc.writable && desc.configurable;
    isDefaultDesc ? objects[keyIndex][propName] = desc.value : Object.defineProperty(objects[keyIndex], propName, desc);
  }
  return objects;
}
function lazy(fn) {
  let comp;
  let p;
  const wrap = (props) => {
    const ctx = sharedConfig.context;
    if (ctx) {
      const [s, set] = createSignal();
      sharedConfig.count || (sharedConfig.count = 0);
      sharedConfig.count++;
      (p || (p = fn())).then((mod) => {
        !sharedConfig.done && setHydrateContext(ctx);
        sharedConfig.count--;
        set(() => mod.default);
        setHydrateContext();
      });
      comp = s;
    } else if (!comp) {
      const [s] = createResource(() => (p || (p = fn())).then((mod) => mod.default));
      comp = s;
    }
    let Comp;
    return createMemo(() => (Comp = comp()) ? untrack(() => {
      if (IS_DEV) ;
      if (!ctx || sharedConfig.done) return Comp(props);
      const c = sharedConfig.context;
      setHydrateContext(ctx);
      const r = Comp(props);
      setHydrateContext(c);
      return r;
    }) : "");
  };
  wrap.preload = () => p || ((p = fn()).then((mod) => comp = () => mod.default), p);
  return wrap;
}
let counter = 0;
function createUniqueId() {
  const ctx = sharedConfig.context;
  return ctx ? sharedConfig.getNextContextId() : `cl-${counter++}`;
}
const narrowedError = (name) => `Stale read from <${name}>.`;
function For(props) {
  const fallback = "fallback" in props && {
    fallback: () => props.fallback
  };
  return createMemo(mapArray(() => props.each, props.children, fallback || void 0));
}
function Show(props) {
  const keyed = props.keyed;
  const conditionValue = createMemo(() => props.when, void 0, void 0);
  const condition = keyed ? conditionValue : createMemo(conditionValue, void 0, {
    equals: (a, b) => !a === !b
  });
  return createMemo(() => {
    const c = condition();
    if (c) {
      const child = props.children;
      const fn = typeof child === "function" && child.length > 0;
      return fn ? untrack(() => child(keyed ? c : () => {
        if (!untrack(condition)) throw narrowedError("Show");
        return conditionValue();
      })) : child;
    }
    return props.fallback;
  }, void 0, void 0);
}
let Errors;
function resetErrorBoundaries() {
  Errors && [...Errors].forEach((fn) => fn());
}
function ErrorBoundary(props) {
  let err;
  if (sharedConfig.context && sharedConfig.load) err = sharedConfig.load(sharedConfig.getContextId());
  const [errored, setErrored] = createSignal(err, void 0);
  Errors || (Errors = /* @__PURE__ */ new Set());
  Errors.add(setErrored);
  onCleanup(() => Errors.delete(setErrored));
  return createMemo(() => {
    let e;
    if (e = errored()) {
      const f = props.fallback;
      return typeof f === "function" && f.length ? untrack(() => f(e, () => setErrored())) : f;
    }
    return catchError(() => props.children, setErrored);
  }, void 0, void 0);
}
const SuspenseListContext = /* @__PURE__ */ createContext();
function Suspense(props) {
  let counter2 = 0, show, ctx, p, flicker, error;
  const [inFallback, setFallback] = createSignal(false), SuspenseContext2 = getSuspenseContext(), store = {
    increment: () => {
      if (++counter2 === 1) setFallback(true);
    },
    decrement: () => {
      if (--counter2 === 0) setFallback(false);
    },
    inFallback,
    effects: [],
    resolved: false
  }, owner = getOwner();
  if (sharedConfig.context && sharedConfig.load) {
    const key = sharedConfig.getContextId();
    let ref = sharedConfig.load(key);
    if (ref) {
      if (typeof ref !== "object" || ref.s !== 1) p = ref;
      else sharedConfig.gather(key);
    }
    if (p && p !== "$$f") {
      const [s, set] = createSignal(void 0, {
        equals: false
      });
      flicker = s;
      p.then(() => {
        if (sharedConfig.done) return set();
        sharedConfig.gather(key);
        setHydrateContext(ctx);
        set();
        setHydrateContext();
      }, (err) => {
        error = err;
        set();
      });
    }
  }
  const listContext = useContext(SuspenseListContext);
  if (listContext) show = listContext.register(store.inFallback);
  let dispose2;
  onCleanup(() => dispose2 && dispose2());
  return createComponent(SuspenseContext2.Provider, {
    value: store,
    get children() {
      return createMemo(() => {
        if (error) throw error;
        ctx = sharedConfig.context;
        if (flicker) {
          flicker();
          return flicker = void 0;
        }
        if (ctx && p === "$$f") setHydrateContext();
        const rendered = createMemo(() => props.children);
        return createMemo((prev) => {
          const inFallback2 = store.inFallback(), {
            showContent = true,
            showFallback = true
          } = show ? show() : {};
          if ((!inFallback2 || p && p !== "$$f") && showContent) {
            store.resolved = true;
            dispose2 && dispose2();
            dispose2 = ctx = p = void 0;
            resumeEffects(store.effects);
            return rendered();
          }
          if (!showFallback) return;
          if (dispose2) return prev;
          return createRoot((disposer) => {
            dispose2 = disposer;
            if (ctx) {
              setHydrateContext({
                id: ctx.id + "F",
                count: 0
              });
              ctx = void 0;
            }
            return props.fallback;
          }, owner);
        });
      });
    }
  });
}
const booleans = ["allowfullscreen", "async", "alpha", "autofocus", "autoplay", "checked", "controls", "default", "disabled", "formnovalidate", "hidden", "indeterminate", "inert", "ismap", "loop", "multiple", "muted", "nomodule", "novalidate", "open", "playsinline", "readonly", "required", "reversed", "seamless", "selected", "adauctionheaders", "browsingtopics", "credentialless", "defaultchecked", "defaultmuted", "defaultselected", "defer", "disablepictureinpicture", "disableremoteplayback", "preservespitch", "shadowrootclonable", "shadowrootcustomelementregistry", "shadowrootdelegatesfocus", "shadowrootserializable", "sharedstoragewritable"];
const Properties = /* @__PURE__ */ new Set(["className", "value", "readOnly", "noValidate", "formNoValidate", "isMap", "noModule", "playsInline", "adAuctionHeaders", "allowFullscreen", "browsingTopics", "defaultChecked", "defaultMuted", "defaultSelected", "disablePictureInPicture", "disableRemotePlayback", "preservesPitch", "shadowRootClonable", "shadowRootCustomElementRegistry", "shadowRootDelegatesFocus", "shadowRootSerializable", "sharedStorageWritable", ...booleans]);
const ChildProperties = /* @__PURE__ */ new Set(["innerHTML", "textContent", "innerText", "children"]);
const Aliases = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
  className: "class",
  htmlFor: "for"
});
const PropAliases = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
  class: "className",
  novalidate: {
    $: "noValidate",
    FORM: 1
  },
  formnovalidate: {
    $: "formNoValidate",
    BUTTON: 1,
    INPUT: 1
  },
  ismap: {
    $: "isMap",
    IMG: 1
  },
  nomodule: {
    $: "noModule",
    SCRIPT: 1
  },
  playsinline: {
    $: "playsInline",
    VIDEO: 1
  },
  readonly: {
    $: "readOnly",
    INPUT: 1,
    TEXTAREA: 1
  },
  adauctionheaders: {
    $: "adAuctionHeaders",
    IFRAME: 1
  },
  allowfullscreen: {
    $: "allowFullscreen",
    IFRAME: 1
  },
  browsingtopics: {
    $: "browsingTopics",
    IMG: 1
  },
  defaultchecked: {
    $: "defaultChecked",
    INPUT: 1
  },
  defaultmuted: {
    $: "defaultMuted",
    AUDIO: 1,
    VIDEO: 1
  },
  defaultselected: {
    $: "defaultSelected",
    OPTION: 1
  },
  disablepictureinpicture: {
    $: "disablePictureInPicture",
    VIDEO: 1
  },
  disableremoteplayback: {
    $: "disableRemotePlayback",
    AUDIO: 1,
    VIDEO: 1
  },
  preservespitch: {
    $: "preservesPitch",
    AUDIO: 1,
    VIDEO: 1
  },
  shadowrootclonable: {
    $: "shadowRootClonable",
    TEMPLATE: 1
  },
  shadowrootdelegatesfocus: {
    $: "shadowRootDelegatesFocus",
    TEMPLATE: 1
  },
  shadowrootserializable: {
    $: "shadowRootSerializable",
    TEMPLATE: 1
  },
  sharedstoragewritable: {
    $: "sharedStorageWritable",
    IFRAME: 1,
    IMG: 1
  }
});
function getPropAlias(prop, tagName) {
  const a = PropAliases[prop];
  return typeof a === "object" ? a[tagName] ? a["$"] : void 0 : a;
}
const DelegatedEvents = /* @__PURE__ */ new Set(["beforeinput", "click", "dblclick", "contextmenu", "focusin", "focusout", "input", "keydown", "keyup", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "pointerdown", "pointermove", "pointerout", "pointerover", "pointerup", "touchend", "touchmove", "touchstart"]);
const SVGNamespace = {
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace"
};
const memo = (fn) => createMemo(() => fn());
function reconcileArrays(parentNode, a, b) {
  let bLength = b.length, aEnd = a.length, bEnd = bLength, aStart = 0, bStart = 0, after = a[aEnd - 1].nextSibling, map = null;
  while (aStart < aEnd || bStart < bEnd) {
    if (a[aStart] === b[bStart]) {
      aStart++;
      bStart++;
      continue;
    }
    while (a[aEnd - 1] === b[bEnd - 1]) {
      aEnd--;
      bEnd--;
    }
    if (aEnd === aStart) {
      const node = bEnd < bLength ? bStart ? b[bStart - 1].nextSibling : b[bEnd - bStart] : after;
      while (bStart < bEnd) parentNode.insertBefore(b[bStart++], node);
    } else if (bEnd === bStart) {
      while (aStart < aEnd) {
        if (!map || !map.has(a[aStart])) a[aStart].remove();
        aStart++;
      }
    } else if (a[aStart] === b[bEnd - 1] && b[bStart] === a[aEnd - 1]) {
      const node = a[--aEnd].nextSibling;
      parentNode.insertBefore(b[bStart++], a[aStart++].nextSibling);
      parentNode.insertBefore(b[--bEnd], node);
      a[aEnd] = b[bEnd];
    } else {
      if (!map) {
        map = /* @__PURE__ */ new Map();
        let i = bStart;
        while (i < bEnd) map.set(b[i], i++);
      }
      const index = map.get(a[aStart]);
      if (index != null) {
        if (bStart < index && index < bEnd) {
          let i = aStart, sequence = 1, t;
          while (++i < aEnd && i < bEnd) {
            if ((t = map.get(a[i])) == null || t !== index + sequence) break;
            sequence++;
          }
          if (sequence > index - bStart) {
            const node = a[aStart];
            while (bStart < index) parentNode.insertBefore(b[bStart++], node);
          } else parentNode.replaceChild(b[bStart++], a[aStart++]);
        } else aStart++;
      } else a[aStart++].remove();
    }
  }
}
const $$EVENTS = "_$DX_DELEGATE";
function render(code, element, init, options = {}) {
  let disposer;
  createRoot((dispose2) => {
    disposer = dispose2;
    element === document ? code() : insert(element, code(), element.firstChild ? null : void 0, init);
  }, options.owner);
  return () => {
    disposer();
    element.textContent = "";
  };
}
function template(html, isImportNode, isSVG, isMathML) {
  let node;
  const create = () => {
    const t = isMathML ? document.createElementNS("http://www.w3.org/1998/Math/MathML", "template") : document.createElement("template");
    t.innerHTML = html;
    return isSVG ? t.content.firstChild.firstChild : isMathML ? t.firstChild : t.content.firstChild;
  };
  const fn = isImportNode ? () => untrack(() => document.importNode(node || (node = create()), true)) : () => (node || (node = create())).cloneNode(true);
  fn.cloneNode = fn;
  return fn;
}
function delegateEvents(eventNames, document2 = window.document) {
  const e = document2[$$EVENTS] || (document2[$$EVENTS] = /* @__PURE__ */ new Set());
  for (let i = 0, l = eventNames.length; i < l; i++) {
    const name = eventNames[i];
    if (!e.has(name)) {
      e.add(name);
      document2.addEventListener(name, eventHandler);
    }
  }
}
function setProperty$1(node, name, value) {
  if (isHydrating(node)) return;
  node[name] = value;
}
function setAttribute(node, name, value) {
  if (isHydrating(node)) return;
  if (value == null) node.removeAttribute(name);
  else node.setAttribute(name, value);
}
function setAttributeNS(node, namespace, name, value) {
  if (isHydrating(node)) return;
  if (value == null) node.removeAttributeNS(namespace, name);
  else node.setAttributeNS(namespace, name, value);
}
function setBoolAttribute(node, name, value) {
  if (isHydrating(node)) return;
  value ? node.setAttribute(name, "") : node.removeAttribute(name);
}
function className(node, value) {
  if (isHydrating(node)) return;
  if (value == null) node.removeAttribute("class");
  else node.className = value;
}
function addEventListener(node, name, handler, delegate) {
  if (delegate) {
    if (Array.isArray(handler)) {
      node[`$$${name}`] = handler[0];
      node[`$$${name}Data`] = handler[1];
    } else node[`$$${name}`] = handler;
  } else if (Array.isArray(handler)) {
    const handlerFn = handler[0];
    node.addEventListener(name, handler[0] = (e) => handlerFn.call(node, handler[1], e));
  } else node.addEventListener(name, handler, typeof handler !== "function" && handler);
}
function classList(node, value, prev = {}) {
  const classKeys = Object.keys(value || {}), prevKeys = Object.keys(prev);
  let i, len;
  for (i = 0, len = prevKeys.length; i < len; i++) {
    const key = prevKeys[i];
    if (!key || key === "undefined" || value[key]) continue;
    toggleClassKey(node, key, false);
    delete prev[key];
  }
  for (i = 0, len = classKeys.length; i < len; i++) {
    const key = classKeys[i], classValue = !!value[key];
    if (!key || key === "undefined" || prev[key] === classValue || !classValue) continue;
    toggleClassKey(node, key, true);
    prev[key] = classValue;
  }
  return prev;
}
function style(node, value, prev) {
  if (!value) return prev ? setAttribute(node, "style") : value;
  const nodeStyle = node.style;
  if (typeof value === "string") return nodeStyle.cssText = value;
  typeof prev === "string" && (nodeStyle.cssText = prev = void 0);
  prev || (prev = {});
  value || (value = {});
  let v, s;
  for (s in prev) {
    value[s] == null && nodeStyle.removeProperty(s);
    delete prev[s];
  }
  for (s in value) {
    v = value[s];
    if (v !== prev[s]) {
      nodeStyle.setProperty(s, v);
      prev[s] = v;
    }
  }
  return prev;
}
function setStyleProperty(node, name, value) {
  value != null ? node.style.setProperty(name, value) : node.style.removeProperty(name);
}
function spread(node, props = {}, isSVG, skipChildren) {
  const prevProps = {};
  if (!skipChildren) {
    createRenderEffect(() => prevProps.children = insertExpression(node, props.children, prevProps.children));
  }
  createRenderEffect(() => typeof props.ref === "function" && use(props.ref, node));
  createRenderEffect(() => assign(node, props, isSVG, true, prevProps, true));
  return prevProps;
}
function use(fn, element, arg) {
  return untrack(() => fn(element, arg));
}
function insert(parent, accessor, marker, initial2) {
  if (marker !== void 0 && !initial2) initial2 = [];
  if (typeof accessor !== "function") return insertExpression(parent, accessor, initial2, marker);
  createRenderEffect((current) => insertExpression(parent, accessor(), current, marker), initial2);
}
function assign(node, props, isSVG, skipChildren, prevProps = {}, skipRef = false) {
  props || (props = {});
  for (const prop in prevProps) {
    if (!(prop in props)) {
      if (prop === "children") continue;
      prevProps[prop] = assignProp(node, prop, null, prevProps[prop], isSVG, skipRef, props);
    }
  }
  for (const prop in props) {
    if (prop === "children") {
      continue;
    }
    const value = props[prop];
    prevProps[prop] = assignProp(node, prop, value, prevProps[prop], isSVG, skipRef, props);
  }
}
function hydrate$1(code, element, options = {}) {
  if (globalThis._$HY.done) return render(code, element, [...element.childNodes], options);
  sharedConfig.completed = globalThis._$HY.completed;
  sharedConfig.events = globalThis._$HY.events;
  sharedConfig.load = (id) => globalThis._$HY.r[id];
  sharedConfig.has = (id) => id in globalThis._$HY.r;
  sharedConfig.gather = (root) => gatherHydratable(element, root);
  sharedConfig.registry = /* @__PURE__ */ new Map();
  sharedConfig.context = {
    id: options.renderId || "",
    count: 0
  };
  try {
    gatherHydratable(element, options.renderId);
    return render(code, element, [...element.childNodes], options);
  } finally {
    sharedConfig.context = null;
  }
}
function getNextElement(template2) {
  let node, key, hydrating = isHydrating();
  if (!hydrating || !(node = sharedConfig.registry.get(key = getHydrationKey()))) {
    return template2();
  }
  if (sharedConfig.completed) sharedConfig.completed.add(node);
  sharedConfig.registry.delete(key);
  return node;
}
function getNextMarker(start) {
  let end = start, count = 0, current = [];
  if (isHydrating(start)) {
    while (end) {
      if (end.nodeType === 8) {
        const v = end.nodeValue;
        if (v === "$") count++;
        else if (v === "/") {
          if (count === 0) return [end, current];
          count--;
        }
      }
      current.push(end);
      end = end.nextSibling;
    }
  }
  return [end, current];
}
function runHydrationEvents() {
  if (sharedConfig.events && !sharedConfig.events.queued) {
    queueMicrotask(() => {
      const {
        completed,
        events
      } = sharedConfig;
      if (!events) return;
      events.queued = false;
      while (events.length) {
        const [el, e] = events[0];
        if (!completed.has(el)) return;
        events.shift();
        eventHandler(e);
      }
      if (sharedConfig.done) {
        sharedConfig.events = _$HY.events = null;
        sharedConfig.completed = _$HY.completed = null;
      }
    });
    sharedConfig.events.queued = true;
  }
}
function isHydrating(node) {
  return !!sharedConfig.context && !sharedConfig.done && (!node || node.isConnected);
}
function toPropertyName(name) {
  return name.toLowerCase().replace(/-([a-z])/g, (_, w) => w.toUpperCase());
}
function toggleClassKey(node, key, value) {
  const classNames = key.trim().split(/\s+/);
  for (let i = 0, nameLen = classNames.length; i < nameLen; i++) node.classList.toggle(classNames[i], value);
}
function assignProp(node, prop, value, prev, isSVG, skipRef, props) {
  let isCE, isProp, isChildProp, propAlias, forceProp;
  if (prop === "style") return style(node, value, prev);
  if (prop === "classList") return classList(node, value, prev);
  if (value === prev) return prev;
  if (prop === "ref") {
    if (!skipRef) value(node);
  } else if (prop.slice(0, 3) === "on:") {
    const e = prop.slice(3);
    prev && node.removeEventListener(e, prev, typeof prev !== "function" && prev);
    value && node.addEventListener(e, value, typeof value !== "function" && value);
  } else if (prop.slice(0, 10) === "oncapture:") {
    const e = prop.slice(10);
    prev && node.removeEventListener(e, prev, true);
    value && node.addEventListener(e, value, true);
  } else if (prop.slice(0, 2) === "on") {
    const name = prop.slice(2).toLowerCase();
    const delegate = DelegatedEvents.has(name);
    if (!delegate && prev) {
      const h = Array.isArray(prev) ? prev[0] : prev;
      node.removeEventListener(name, h);
    }
    if (delegate || value) {
      addEventListener(node, name, value, delegate);
      delegate && delegateEvents([name]);
    }
  } else if (prop.slice(0, 5) === "attr:") {
    setAttribute(node, prop.slice(5), value);
  } else if (prop.slice(0, 5) === "bool:") {
    setBoolAttribute(node, prop.slice(5), value);
  } else if ((forceProp = prop.slice(0, 5) === "prop:") || (isChildProp = ChildProperties.has(prop)) || !isSVG && ((propAlias = getPropAlias(prop, node.tagName)) || (isProp = Properties.has(prop))) || (isCE = node.nodeName.includes("-") || "is" in props)) {
    if (forceProp) {
      prop = prop.slice(5);
      isProp = true;
    } else if (isHydrating(node)) return value;
    if (prop === "class" || prop === "className") className(node, value);
    else if (isCE && !isProp && !isChildProp) node[toPropertyName(prop)] = value;
    else node[propAlias || prop] = value;
  } else {
    const ns = isSVG && prop.indexOf(":") > -1 && SVGNamespace[prop.split(":")[0]];
    if (ns) setAttributeNS(node, ns, prop, value);
    else setAttribute(node, Aliases[prop] || prop, value);
  }
  return value;
}
function eventHandler(e) {
  if (sharedConfig.registry && sharedConfig.events) {
    if (sharedConfig.events.find(([el, ev]) => ev === e)) return;
  }
  let node = e.target;
  const key = `$$${e.type}`;
  const oriTarget = e.target;
  const oriCurrentTarget = e.currentTarget;
  const retarget = (value) => Object.defineProperty(e, "target", {
    configurable: true,
    value
  });
  const handleNode = () => {
    const handler = node[key];
    if (handler && !node.disabled) {
      const data = node[`${key}Data`];
      data !== void 0 ? handler.call(node, data, e) : handler.call(node, e);
      if (e.cancelBubble) return;
    }
    node.host && typeof node.host !== "string" && !node.host._$host && node.contains(e.target) && retarget(node.host);
    return true;
  };
  const walkUpTree = () => {
    while (handleNode() && (node = node._$host || node.parentNode || node.host)) ;
  };
  Object.defineProperty(e, "currentTarget", {
    configurable: true,
    get() {
      return node || document;
    }
  });
  if (sharedConfig.registry && !sharedConfig.done) sharedConfig.done = _$HY.done = true;
  if (e.composedPath) {
    const path = e.composedPath();
    retarget(path[0]);
    for (let i = 0; i < path.length - 2; i++) {
      node = path[i];
      if (!handleNode()) break;
      if (node._$host) {
        node = node._$host;
        walkUpTree();
        break;
      }
      if (node.parentNode === oriCurrentTarget) {
        break;
      }
    }
  } else walkUpTree();
  retarget(oriTarget);
}
function insertExpression(parent, value, current, marker, unwrapArray) {
  const hydrating = isHydrating(parent);
  if (hydrating) {
    !current && (current = [...parent.childNodes]);
    let cleaned = [];
    for (let i = 0; i < current.length; i++) {
      const node = current[i];
      if (node.nodeType === 8 && node.data.slice(0, 2) === "!$") node.remove();
      else cleaned.push(node);
    }
    current = cleaned;
  }
  while (typeof current === "function") current = current();
  if (value === current) return current;
  const t = typeof value, multi = marker !== void 0;
  parent = multi && current[0] && current[0].parentNode || parent;
  if (t === "string" || t === "number") {
    if (hydrating) return current;
    if (t === "number") {
      value = value.toString();
      if (value === current) return current;
    }
    if (multi) {
      let node = current[0];
      if (node && node.nodeType === 3) {
        node.data !== value && (node.data = value);
      } else node = document.createTextNode(value);
      current = cleanChildren(parent, current, marker, node);
    } else {
      if (current !== "" && typeof current === "string") {
        current = parent.firstChild.data = value;
      } else current = parent.textContent = value;
    }
  } else if (value == null || t === "boolean") {
    if (hydrating) return current;
    current = cleanChildren(parent, current, marker);
  } else if (t === "function") {
    createRenderEffect(() => {
      let v = value();
      while (typeof v === "function") v = v();
      current = insertExpression(parent, v, current, marker);
    });
    return () => current;
  } else if (Array.isArray(value)) {
    const array = [];
    const currentArray = current && Array.isArray(current);
    if (normalizeIncomingArray(array, value, current, unwrapArray)) {
      createRenderEffect(() => current = insertExpression(parent, array, current, marker, true));
      return () => current;
    }
    if (hydrating) {
      if (!array.length) return current;
      if (marker === void 0) return current = [...parent.childNodes];
      let node = array[0];
      if (node.parentNode !== parent) return current;
      const nodes = [node];
      while ((node = node.nextSibling) !== marker) nodes.push(node);
      return current = nodes;
    }
    if (array.length === 0) {
      current = cleanChildren(parent, current, marker);
      if (multi) return current;
    } else if (currentArray) {
      if (current.length === 0) {
        appendNodes(parent, array, marker);
      } else reconcileArrays(parent, current, array);
    } else {
      current && cleanChildren(parent);
      appendNodes(parent, array);
    }
    current = array;
  } else if (value.nodeType) {
    if (hydrating && value.parentNode) return current = multi ? [value] : value;
    if (Array.isArray(current)) {
      if (multi) return current = cleanChildren(parent, current, marker, value);
      cleanChildren(parent, current, null, value);
    } else if (current == null || current === "" || !parent.firstChild) {
      parent.appendChild(value);
    } else parent.replaceChild(value, parent.firstChild);
    current = value;
  } else ;
  return current;
}
function normalizeIncomingArray(normalized, array, current, unwrap2) {
  let dynamic = false;
  for (let i = 0, len = array.length; i < len; i++) {
    let item = array[i], prev = current && current[normalized.length], t;
    if (item == null || item === true || item === false) ;
    else if ((t = typeof item) === "object" && item.nodeType) {
      normalized.push(item);
    } else if (Array.isArray(item)) {
      dynamic = normalizeIncomingArray(normalized, item, prev) || dynamic;
    } else if (t === "function") {
      if (unwrap2) {
        while (typeof item === "function") item = item();
        dynamic = normalizeIncomingArray(normalized, Array.isArray(item) ? item : [item], Array.isArray(prev) ? prev : [prev]) || dynamic;
      } else {
        normalized.push(item);
        dynamic = true;
      }
    } else {
      const value = String(item);
      if (prev && prev.nodeType === 3 && prev.data === value) normalized.push(prev);
      else normalized.push(document.createTextNode(value));
    }
  }
  return dynamic;
}
function appendNodes(parent, array, marker = null) {
  for (let i = 0, len = array.length; i < len; i++) parent.insertBefore(array[i], marker);
}
function cleanChildren(parent, current, marker, replacement) {
  if (marker === void 0) return parent.textContent = "";
  const node = replacement || document.createTextNode("");
  if (current.length) {
    let inserted = false;
    for (let i = current.length - 1; i >= 0; i--) {
      const el = current[i];
      if (node !== el) {
        const isParent = el.parentNode === parent;
        if (!inserted && !i) isParent ? parent.replaceChild(node, el) : parent.insertBefore(node, marker);
        else isParent && el.remove();
      } else inserted = true;
    }
  } else parent.insertBefore(node, marker);
  return [node];
}
function gatherHydratable(element, root) {
  const templates = element.querySelectorAll(`*[data-hk]`);
  for (let i = 0; i < templates.length; i++) {
    const node = templates[i];
    const key = node.getAttribute("data-hk");
    if ((!root || key.startsWith(root)) && !sharedConfig.registry.has(key)) sharedConfig.registry.set(key, node);
  }
}
function getHydrationKey() {
  return sharedConfig.getNextContextId();
}
const voidFn = () => void 0;
const isServer = false;
const hydrate = (...args) => {
  enableHydration();
  return hydrate$1(...args);
};
const $RAW = Symbol("store-raw"), $NODE = Symbol("store-node"), $HAS = Symbol("store-has"), $SELF = Symbol("store-self");
function wrap$1(value) {
  let p = value[$PROXY];
  if (!p) {
    Object.defineProperty(value, $PROXY, {
      value: p = new Proxy(value, proxyTraps$1)
    });
    if (!Array.isArray(value)) {
      const keys = Object.keys(value), desc = Object.getOwnPropertyDescriptors(value);
      for (let i = 0, l = keys.length; i < l; i++) {
        const prop = keys[i];
        if (desc[prop].get) {
          Object.defineProperty(value, prop, {
            enumerable: desc[prop].enumerable,
            get: desc[prop].get.bind(p)
          });
        }
      }
    }
  }
  return p;
}
function isWrappable(obj) {
  let proto;
  return obj != null && typeof obj === "object" && (obj[$PROXY] || !(proto = Object.getPrototypeOf(obj)) || proto === Object.prototype || Array.isArray(obj));
}
function unwrap(item, set = /* @__PURE__ */ new Set()) {
  let result, unwrapped, v, prop;
  if (result = item != null && item[$RAW]) return result;
  if (!isWrappable(item) || set.has(item)) return item;
  if (Array.isArray(item)) {
    if (Object.isFrozen(item)) item = item.slice(0);
    else set.add(item);
    for (let i = 0, l = item.length; i < l; i++) {
      v = item[i];
      if ((unwrapped = unwrap(v, set)) !== v) item[i] = unwrapped;
    }
  } else {
    if (Object.isFrozen(item)) item = Object.assign({}, item);
    else set.add(item);
    const keys = Object.keys(item), desc = Object.getOwnPropertyDescriptors(item);
    for (let i = 0, l = keys.length; i < l; i++) {
      prop = keys[i];
      if (desc[prop].get) continue;
      v = item[prop];
      if ((unwrapped = unwrap(v, set)) !== v) item[prop] = unwrapped;
    }
  }
  return item;
}
function getNodes(target, symbol) {
  let nodes = target[symbol];
  if (!nodes) Object.defineProperty(target, symbol, {
    value: nodes = /* @__PURE__ */ Object.create(null)
  });
  return nodes;
}
function getNode(nodes, property, value) {
  if (nodes[property]) return nodes[property];
  const [s, set] = createSignal(value, {
    equals: false,
    internal: true
  });
  s.$ = set;
  return nodes[property] = s;
}
function proxyDescriptor$1(target, property) {
  const desc = Reflect.getOwnPropertyDescriptor(target, property);
  if (!desc || desc.get || !desc.configurable || property === $PROXY || property === $NODE) return desc;
  delete desc.value;
  delete desc.writable;
  desc.get = () => target[$PROXY][property];
  return desc;
}
function trackSelf(target) {
  getListener() && getNode(getNodes(target, $NODE), $SELF)();
}
function ownKeys(target) {
  trackSelf(target);
  return Reflect.ownKeys(target);
}
const proxyTraps$1 = {
  get(target, property, receiver) {
    if (property === $RAW) return target;
    if (property === $PROXY) return receiver;
    if (property === $TRACK) {
      trackSelf(target);
      return receiver;
    }
    const nodes = getNodes(target, $NODE);
    const tracked = nodes[property];
    let value = tracked ? tracked() : target[property];
    if (property === $NODE || property === $HAS || property === "__proto__") return value;
    if (!tracked) {
      const desc = Object.getOwnPropertyDescriptor(target, property);
      if (getListener() && (typeof value !== "function" || target.hasOwnProperty(property)) && !(desc && desc.get)) value = getNode(nodes, property, value)();
    }
    return isWrappable(value) ? wrap$1(value) : value;
  },
  has(target, property) {
    if (property === $RAW || property === $PROXY || property === $TRACK || property === $NODE || property === $HAS || property === "__proto__") return true;
    getListener() && getNode(getNodes(target, $HAS), property)();
    return property in target;
  },
  set() {
    return true;
  },
  deleteProperty() {
    return true;
  },
  ownKeys,
  getOwnPropertyDescriptor: proxyDescriptor$1
};
function setProperty(state, property, value, deleting = false) {
  if (!deleting && state[property] === value) return;
  const prev = state[property], len = state.length;
  if (value === void 0) {
    delete state[property];
    if (state[$HAS] && state[$HAS][property] && prev !== void 0) state[$HAS][property].$();
  } else {
    state[property] = value;
    if (state[$HAS] && state[$HAS][property] && prev === void 0) state[$HAS][property].$();
  }
  let nodes = getNodes(state, $NODE), node;
  if (node = getNode(nodes, property, prev)) node.$(() => value);
  if (Array.isArray(state) && state.length !== len) {
    for (let i = state.length; i < len; i++) (node = nodes[i]) && node.$();
    (node = getNode(nodes, "length", len)) && node.$(state.length);
  }
  (node = nodes[$SELF]) && node.$();
}
function mergeStoreNode(state, value) {
  const keys = Object.keys(value);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    setProperty(state, key, value[key]);
  }
}
function updateArray(current, next) {
  if (typeof next === "function") next = next(current);
  next = unwrap(next);
  if (Array.isArray(next)) {
    if (current === next) return;
    let i = 0, len = next.length;
    for (; i < len; i++) {
      const value = next[i];
      if (current[i] !== value) setProperty(current, i, value);
    }
    setProperty(current, "length", len);
  } else mergeStoreNode(current, next);
}
function updatePath(current, path, traversed = []) {
  let part, prev = current;
  if (path.length > 1) {
    part = path.shift();
    const partType = typeof part, isArray = Array.isArray(current);
    if (Array.isArray(part)) {
      for (let i = 0; i < part.length; i++) {
        updatePath(current, [part[i]].concat(path), traversed);
      }
      return;
    } else if (isArray && partType === "function") {
      for (let i = 0; i < current.length; i++) {
        if (part(current[i], i)) updatePath(current, [i].concat(path), traversed);
      }
      return;
    } else if (isArray && partType === "object") {
      const {
        from = 0,
        to = current.length - 1,
        by = 1
      } = part;
      for (let i = from; i <= to; i += by) {
        updatePath(current, [i].concat(path), traversed);
      }
      return;
    } else if (path.length > 1) {
      updatePath(current[part], path, [part].concat(traversed));
      return;
    }
    prev = current[part];
    traversed = [part].concat(traversed);
  }
  let value = path[0];
  if (typeof value === "function") {
    value = value(prev, traversed);
    if (value === prev) return;
  }
  if (part === void 0 && value == void 0) return;
  value = unwrap(value);
  if (part === void 0 || isWrappable(prev) && isWrappable(value) && !Array.isArray(value)) {
    mergeStoreNode(prev, value);
  } else setProperty(current, part, value);
}
function createStore(...[store, options]) {
  const unwrappedStore = unwrap(store || {});
  const isArray = Array.isArray(unwrappedStore);
  const wrappedStore = wrap$1(unwrappedStore);
  function setStore(...args) {
    batch(() => {
      isArray && args.length === 1 ? updateArray(unwrappedStore, args[0]) : updatePath(unwrappedStore, args);
    });
  }
  return [wrappedStore, setStore];
}
const MetaContext = createContext();
const cascadingTags = ["title", "meta"];
const titleTagProperties = [];
const metaTagProperties = (
  // https://html.spec.whatwg.org/multipage/semantics.html#the-meta-element
  ["name", "http-equiv", "content", "charset", "media"].concat(["property"])
);
const getTagKey = (tag2, properties) => {
  const tagProps = Object.fromEntries(Object.entries(tag2.props).filter(([k]) => properties.includes(k)).sort());
  if (Object.hasOwn(tagProps, "name") || Object.hasOwn(tagProps, "property")) {
    tagProps.name = tagProps.name || tagProps.property;
    delete tagProps.property;
  }
  return tag2.tag + JSON.stringify(tagProps);
};
function initClientProvider() {
  if (!sharedConfig.context) {
    const ssrTags = document.head.querySelectorAll(`[data-sm]`);
    Array.prototype.forEach.call(ssrTags, (ssrTag) => ssrTag.parentNode.removeChild(ssrTag));
  }
  const cascadedTagInstances = /* @__PURE__ */ new Map();
  function getElement(tag2) {
    if (tag2.ref) {
      return tag2.ref;
    }
    let el = document.querySelector(`[data-sm="${tag2.id}"]`);
    if (el) {
      if (el.tagName.toLowerCase() !== tag2.tag) {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
        el = document.createElement(tag2.tag);
      }
      el.removeAttribute("data-sm");
    } else {
      el = document.createElement(tag2.tag);
    }
    return el;
  }
  return {
    addTag(tag2) {
      if (cascadingTags.indexOf(tag2.tag) !== -1) {
        const properties = tag2.tag === "title" ? titleTagProperties : metaTagProperties;
        const tagKey = getTagKey(tag2, properties);
        if (!cascadedTagInstances.has(tagKey)) {
          cascadedTagInstances.set(tagKey, []);
        }
        let instances = cascadedTagInstances.get(tagKey);
        let index = instances.length;
        instances = [...instances, tag2];
        cascadedTagInstances.set(tagKey, instances);
        let element2 = getElement(tag2);
        tag2.ref = element2;
        spread(element2, tag2.props);
        let lastVisited = null;
        for (var i = index - 1; i >= 0; i--) {
          if (instances[i] != null) {
            lastVisited = instances[i];
            break;
          }
        }
        if (element2.parentNode != document.head) {
          document.head.appendChild(element2);
        }
        if (lastVisited && lastVisited.ref && lastVisited.ref.parentNode) {
          document.head.removeChild(lastVisited.ref);
        }
        return index;
      }
      let element = getElement(tag2);
      tag2.ref = element;
      spread(element, tag2.props);
      if (element.parentNode != document.head) {
        document.head.appendChild(element);
      }
      return -1;
    },
    removeTag(tag2, index) {
      const properties = tag2.tag === "title" ? titleTagProperties : metaTagProperties;
      const tagKey = getTagKey(tag2, properties);
      if (tag2.ref) {
        const t = cascadedTagInstances.get(tagKey);
        if (t) {
          if (tag2.ref.parentNode) {
            tag2.ref.parentNode.removeChild(tag2.ref);
            for (let i = index - 1; i >= 0; i--) {
              if (t[i] != null) {
                document.head.appendChild(t[i].ref);
              }
            }
          }
          t[index] = null;
          cascadedTagInstances.set(tagKey, t);
        } else {
          if (tag2.ref.parentNode) {
            tag2.ref.parentNode.removeChild(tag2.ref);
          }
        }
      }
    }
  };
}
const MetaProvider = (props) => {
  const actions = initClientProvider();
  return createComponent(MetaContext.Provider, {
    value: actions,
    get children() {
      return props.children;
    }
  });
};
const MetaTag = (tag2, props, setting) => {
  useHead({
    tag: tag2,
    props,
    setting,
    id: createUniqueId(),
    get name() {
      return props.name || props.property;
    }
  });
  return null;
};
function useHead(tagDesc) {
  const c = useContext(MetaContext);
  if (!c) throw new Error("<MetaProvider /> should be in the tree");
  createRenderEffect(() => {
    const index = c.addTag(tagDesc);
    onCleanup(() => c.removeTag(tagDesc, index));
  });
}
const Title = (props) => MetaTag("title", props, {
  escape: true,
  close: true
});
const Meta = (props) => MetaTag("meta", props);
const Link = (props) => MetaTag("link", props);
function createBeforeLeave() {
  let listeners = /* @__PURE__ */ new Set();
  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
  let ignore = false;
  function confirm(to, options) {
    if (ignore) return !(ignore = false);
    const e = {
      to,
      options,
      defaultPrevented: false,
      preventDefault: () => e.defaultPrevented = true
    };
    for (const l of listeners) l.listener({
      ...e,
      from: l.location,
      retry: (force) => {
        force && (ignore = true);
        l.navigate(to, {
          ...options,
          resolve: false
        });
      }
    });
    return !e.defaultPrevented;
  }
  return {
    subscribe,
    confirm
  };
}
let depth;
function saveCurrentDepth() {
  if (!window.history.state || window.history.state._depth == null) {
    window.history.replaceState({
      ...window.history.state,
      _depth: window.history.length - 1
    }, "");
  }
  depth = window.history.state._depth;
}
{
  saveCurrentDepth();
}
function keepDepth(state) {
  return {
    ...state,
    _depth: window.history.state && window.history.state._depth
  };
}
function notifyIfNotBlocked(notify, block) {
  let ignore = false;
  return () => {
    const prevDepth = depth;
    saveCurrentDepth();
    const delta = prevDepth == null ? null : depth - prevDepth;
    if (ignore) {
      ignore = false;
      return;
    }
    if (delta && block(delta)) {
      ignore = true;
      window.history.go(-delta);
    } else {
      notify();
    }
  };
}
const hasSchemeRegex = /^(?:[a-z0-9]+:)?\/\//i;
const trimPathRegex = /^\/+|(\/)\/+$/g;
const mockBase = "http://sr";
function normalizePath(path, omitSlash = false) {
  const s = path.replace(trimPathRegex, "$1");
  return s ? omitSlash || /^[?#]/.test(s) ? s : "/" + s : "";
}
function resolvePath(base, path, from) {
  if (hasSchemeRegex.test(path)) {
    return void 0;
  }
  const basePath2 = normalizePath(base);
  const fromPath = from && normalizePath(from);
  let result = "";
  if (!fromPath || path.startsWith("/")) {
    result = basePath2;
  } else if (fromPath.toLowerCase().indexOf(basePath2.toLowerCase()) !== 0) {
    result = basePath2 + fromPath;
  } else {
    result = fromPath;
  }
  return (result || "/") + normalizePath(path, !result);
}
function invariant(value, message) {
  if (value == null) {
    throw new Error(message);
  }
  return value;
}
function joinPaths(from, to) {
  return normalizePath(from).replace(/\/*(\*.*)?$/g, "") + normalizePath(to);
}
function extractSearchParams(url) {
  const params = {};
  url.searchParams.forEach((value, key) => {
    if (key in params) {
      if (Array.isArray(params[key])) params[key].push(value);
      else params[key] = [params[key], value];
    } else params[key] = value;
  });
  return params;
}
function createMatcher(path, partial, matchFilters) {
  const [pattern, splat] = path.split("/*", 2);
  const segments = pattern.split("/").filter(Boolean);
  const len = segments.length;
  return (location) => {
    const locSegments = location.split("/").filter(Boolean);
    const lenDiff = locSegments.length - len;
    if (lenDiff < 0 || lenDiff > 0 && splat === void 0 && !partial) {
      return null;
    }
    const match2 = {
      path: len ? "" : "/",
      params: {}
    };
    const matchFilter = (s) => matchFilters === void 0 ? void 0 : matchFilters[s];
    for (let i = 0; i < len; i++) {
      const segment = segments[i];
      const dynamic = segment[0] === ":";
      const locSegment = dynamic ? locSegments[i] : locSegments[i].toLowerCase();
      const key = dynamic ? segment.slice(1) : segment.toLowerCase();
      if (dynamic && matchSegment(locSegment, matchFilter(key))) {
        match2.params[key] = locSegment;
      } else if (dynamic || !matchSegment(locSegment, key)) {
        return null;
      }
      match2.path += `/${locSegment}`;
    }
    if (splat) {
      const remainder = lenDiff ? locSegments.slice(-lenDiff).join("/") : "";
      if (matchSegment(remainder, matchFilter(splat))) {
        match2.params[splat] = remainder;
      } else {
        return null;
      }
    }
    return match2;
  };
}
function matchSegment(input, filter) {
  const isEqual = (s) => s === input;
  if (filter === void 0) {
    return true;
  } else if (typeof filter === "string") {
    return isEqual(filter);
  } else if (typeof filter === "function") {
    return filter(input);
  } else if (Array.isArray(filter)) {
    return filter.some(isEqual);
  } else if (filter instanceof RegExp) {
    return filter.test(input);
  }
  return false;
}
function scoreRoute(route2) {
  const [pattern, splat] = route2.pattern.split("/*", 2);
  const segments = pattern.split("/").filter(Boolean);
  return segments.reduce((score, segment) => score + (segment.startsWith(":") ? 2 : 3), segments.length - (splat === void 0 ? 0 : 1));
}
function createMemoObject(fn) {
  const map = /* @__PURE__ */ new Map();
  const owner = getOwner();
  return new Proxy({}, {
    get(_, property) {
      if (!map.has(property)) {
        runWithOwner(owner, () => map.set(property, createMemo(() => fn()[property])));
      }
      return map.get(property)();
    },
    getOwnPropertyDescriptor() {
      return {
        enumerable: true,
        configurable: true
      };
    },
    ownKeys() {
      return Reflect.ownKeys(fn());
    },
    has(_, property) {
      return property in fn();
    }
  });
}
function expandOptionals(pattern) {
  let match2 = /(\/?\:[^\/]+)\?/.exec(pattern);
  if (!match2) return [pattern];
  let prefix = pattern.slice(0, match2.index);
  let suffix2 = pattern.slice(match2.index + match2[0].length);
  const prefixes = [prefix, prefix += match2[1]];
  while (match2 = /^(\/\:[^\/]+)\?/.exec(suffix2)) {
    prefixes.push(prefix += match2[1]);
    suffix2 = suffix2.slice(match2[0].length);
  }
  return expandOptionals(suffix2).reduce((results, expansion) => [...results, ...prefixes.map((p) => p + expansion)], []);
}
const MAX_REDIRECTS = 100;
const RouterContextObj = createContext();
const RouteContextObj = createContext();
const useRouter = () => invariant(useContext(RouterContextObj), "<A> and 'use' router primitives can be only used inside a Route.");
const useNavigate = () => useRouter().navigatorFactory();
const useParams = () => useRouter().params;
function createRoutes(routeDef, base = "") {
  const {
    component,
    preload,
    load,
    children: children2,
    info
  } = routeDef;
  const isLeaf = !children2 || Array.isArray(children2) && !children2.length;
  const shared = {
    key: routeDef,
    component,
    preload: preload || load,
    info
  };
  return asArray(routeDef.path).reduce((acc, originalPath) => {
    for (const expandedPath of expandOptionals(originalPath)) {
      const path = joinPaths(base, expandedPath);
      let pattern = isLeaf ? path : path.split("/*", 1)[0];
      pattern = pattern.split("/").map((s) => {
        return s.startsWith(":") || s.startsWith("*") ? s : encodeURIComponent(s);
      }).join("/");
      acc.push({
        ...shared,
        originalPath,
        pattern,
        matcher: createMatcher(pattern, !isLeaf, routeDef.matchFilters)
      });
    }
    return acc;
  }, []);
}
function createBranch(routes, index = 0) {
  return {
    routes,
    score: scoreRoute(routes[routes.length - 1]) * 1e4 - index,
    matcher(location) {
      const matches = [];
      for (let i = routes.length - 1; i >= 0; i--) {
        const route2 = routes[i];
        const match2 = route2.matcher(location);
        if (!match2) {
          return null;
        }
        matches.unshift({
          ...match2,
          route: route2
        });
      }
      return matches;
    }
  };
}
function asArray(value) {
  return Array.isArray(value) ? value : [value];
}
function createBranches(routeDef, base = "", stack = [], branches = []) {
  const routeDefs = asArray(routeDef);
  for (let i = 0, len = routeDefs.length; i < len; i++) {
    const def = routeDefs[i];
    if (def && typeof def === "object") {
      if (!def.hasOwnProperty("path")) def.path = "";
      const routes = createRoutes(def, base);
      for (const route2 of routes) {
        stack.push(route2);
        const isEmptyArray = Array.isArray(def.children) && def.children.length === 0;
        if (def.children && !isEmptyArray) {
          createBranches(def.children, route2.pattern, stack, branches);
        } else {
          const branch = createBranch([...stack], branches.length);
          branches.push(branch);
        }
        stack.pop();
      }
    }
  }
  return stack.length ? branches : branches.sort((a, b) => b.score - a.score);
}
function getRouteMatches(branches, location) {
  for (let i = 0, len = branches.length; i < len; i++) {
    const match2 = branches[i].matcher(location);
    if (match2) {
      return match2;
    }
  }
  return [];
}
function createLocation(path, state, queryWrapper) {
  const origin = new URL(mockBase);
  const url = createMemo((prev) => {
    const path_ = path();
    try {
      return new URL(path_, origin);
    } catch (err) {
      console.error(`Invalid path ${path_}`);
      return prev;
    }
  }, origin, {
    equals: (a, b) => a.href === b.href
  });
  const pathname = createMemo(() => url().pathname);
  const search = createMemo(() => url().search, true);
  const hash = createMemo(() => url().hash);
  const key = () => "";
  const queryFn = on(search, () => extractSearchParams(url()));
  return {
    get pathname() {
      return pathname();
    },
    get search() {
      return search();
    },
    get hash() {
      return hash();
    },
    get state() {
      return state();
    },
    get key() {
      return key();
    },
    query: queryWrapper ? queryWrapper(queryFn) : createMemoObject(queryFn)
  };
}
let intent;
function getIntent() {
  return intent;
}
let inPreloadFn = false;
function getInPreloadFn() {
  return inPreloadFn;
}
function setInPreloadFn(value) {
  inPreloadFn = value;
}
function createRouterContext(integration, branches, getContext, options = {}) {
  const {
    signal: [source, setSource],
    utils = {}
  } = integration;
  const parsePath = utils.parsePath || ((p) => p);
  const renderPath = utils.renderPath || ((p) => p);
  const beforeLeave = utils.beforeLeave || createBeforeLeave();
  const basePath2 = resolvePath("", options.base || "");
  if (basePath2 === void 0) {
    throw new Error(`${basePath2} is not a valid base path`);
  } else if (basePath2 && !source().value) {
    setSource({
      value: basePath2,
      replace: true,
      scroll: false
    });
  }
  const [isRouting, setIsRouting] = createSignal(false);
  let lastTransitionTarget;
  const transition = (newIntent, newTarget) => {
    if (newTarget.value === reference() && newTarget.state === state()) return;
    if (lastTransitionTarget === void 0) setIsRouting(true);
    intent = newIntent;
    lastTransitionTarget = newTarget;
    startTransition(() => {
      if (lastTransitionTarget !== newTarget) return;
      setReference(lastTransitionTarget.value);
      setState(lastTransitionTarget.state);
      resetErrorBoundaries();
      submissions[1]((subs) => subs.filter((s) => s.pending));
    }).finally(() => {
      if (lastTransitionTarget !== newTarget) return;
      batch(() => {
        intent = void 0;
        if (newIntent === "navigate") navigateEnd(lastTransitionTarget);
        setIsRouting(false);
        lastTransitionTarget = void 0;
      });
    });
  };
  const [reference, setReference] = createSignal(source().value);
  const [state, setState] = createSignal(source().state);
  const location = createLocation(reference, state, utils.queryWrapper);
  const referrers = [];
  const submissions = createSignal([]);
  const matches = createMemo(() => {
    if (typeof options.transformUrl === "function") {
      return getRouteMatches(branches(), options.transformUrl(location.pathname));
    }
    return getRouteMatches(branches(), location.pathname);
  });
  const buildParams = () => {
    const m = matches();
    const params2 = {};
    for (let i = 0; i < m.length; i++) {
      Object.assign(params2, m[i].params);
    }
    return params2;
  };
  const params = utils.paramsWrapper ? utils.paramsWrapper(buildParams, branches) : createMemoObject(buildParams);
  const baseRoute = {
    pattern: basePath2,
    path: () => basePath2,
    outlet: () => null,
    resolvePath(to) {
      return resolvePath(basePath2, to);
    }
  };
  createRenderEffect(on(source, (source2) => transition("native", source2), {
    defer: true
  }));
  return {
    base: baseRoute,
    location,
    params,
    isRouting,
    renderPath,
    parsePath,
    navigatorFactory,
    matches,
    beforeLeave,
    preloadRoute,
    singleFlight: options.singleFlight === void 0 ? true : options.singleFlight,
    submissions
  };
  function navigateFromRoute(route2, to, options2) {
    untrack(() => {
      if (typeof to === "number") {
        if (!to) {
        } else if (utils.go) {
          utils.go(to);
        } else {
          console.warn("Router integration does not support relative routing");
        }
        return;
      }
      const queryOnly = !to || to[0] === "?";
      const {
        replace,
        resolve: resolve2,
        scroll,
        state: nextState
      } = {
        replace: false,
        resolve: !queryOnly,
        scroll: true,
        ...options2
      };
      const resolvedTo = resolve2 ? route2.resolvePath(to) : resolvePath(queryOnly && location.pathname || "", to);
      if (resolvedTo === void 0) {
        throw new Error(`Path '${to}' is not a routable path`);
      } else if (referrers.length >= MAX_REDIRECTS) {
        throw new Error("Too many redirects");
      }
      const current = reference();
      if (resolvedTo !== current || nextState !== state()) {
        if (isServer) ;
        else if (beforeLeave.confirm(resolvedTo, options2)) {
          referrers.push({
            value: current,
            replace,
            scroll,
            state: state()
          });
          transition("navigate", {
            value: resolvedTo,
            state: nextState
          });
        }
      }
    });
  }
  function navigatorFactory(route2) {
    route2 = route2 || useContext(RouteContextObj) || baseRoute;
    return (to, options2) => navigateFromRoute(route2, to, options2);
  }
  function navigateEnd(next) {
    const first = referrers[0];
    if (first) {
      setSource({
        ...next,
        replace: first.replace,
        scroll: first.scroll
      });
      referrers.length = 0;
    }
  }
  function preloadRoute(url, preloadData) {
    const matches2 = getRouteMatches(branches(), url.pathname);
    const prevIntent = intent;
    intent = "preload";
    for (let match2 in matches2) {
      const {
        route: route2,
        params: params2
      } = matches2[match2];
      route2.component && route2.component.preload && route2.component.preload();
      const {
        preload
      } = route2;
      inPreloadFn = true;
      preloadData && preload && runWithOwner(getContext(), () => preload({
        params: params2,
        location: {
          pathname: url.pathname,
          search: url.search,
          hash: url.hash,
          query: extractSearchParams(url),
          state: null,
          key: ""
        },
        intent: "preload"
      }));
      inPreloadFn = false;
    }
    intent = prevIntent;
  }
}
function createRouteContext(router, parent, outlet, match2) {
  const {
    base,
    location,
    params
  } = router;
  const {
    pattern,
    component,
    preload
  } = match2().route;
  const path = createMemo(() => match2().path);
  component && component.preload && component.preload();
  inPreloadFn = true;
  const data = preload ? preload({
    params,
    location,
    intent: intent || "initial"
  }) : void 0;
  inPreloadFn = false;
  const route2 = {
    parent,
    pattern,
    path,
    outlet: () => component ? createComponent(component, {
      params,
      location,
      data,
      get children() {
        return outlet();
      }
    }) : outlet(),
    resolvePath(to) {
      return resolvePath(base.path(), to, path());
    }
  };
  return route2;
}
function createSimpleContext(input) {
  const ctx = createContext();
  return {
    provider: (props) => {
      const init = input.init(props);
      const gate = input.gate ?? true;
      if (!gate) {
        return createComponent(ctx.Provider, {
          value: init,
          get children() {
            return props.children;
          }
        });
      }
      const isReady = createMemo(() => {
        const ready = init.ready;
        return ready === void 0 || (typeof ready === "function" ? ready() : ready);
      });
      return createComponent(Show, {
        get when() {
          return isReady();
        },
        get children() {
          return createComponent(ctx.Provider, {
            value: init,
            get children() {
              return props.children;
            }
          });
        }
      });
    },
    use() {
      const value = useContext(ctx);
      if (!value) throw new Error(`${input.name} context must be used within a context provider`);
      return value;
    }
  };
}
const dict$h = {
  "app.title": "ترتيب استخدام نماذج الذكاء الاصطناعي | OpenCode Data",
  "app.description": "استكشف استخدام OpenCode Go عبر نماذج الذكاء الاصطناعي، بما في ذلك حجم الرموز، والترتيب، وحصة السوق، وتسعير الرموز، وتكلفة الجلسة، ونسبة التخزين المؤقت، والتوزيع الجغرافي.",
  "app.unfurlAlt": "شعار OpenCode Data على خلفية داكنة مزخرفة",
  "nav.dataHome": "صفحة البيانات الرئيسية",
  "nav.topModels": "أهم النماذج",
  "nav.leaderboard": "لوحة الترتيب",
  "nav.uniqueUsers": "المستخدمون الفريدون",
  "nav.sessionCost": "تكلفة الجلسة",
  "nav.tokenCost": "تكلفة الرموز",
  "nav.cacheRatio": "نسبة التخزين المؤقت",
  "nav.marketShare": "حصة السوق",
  "nav.geoBreakdown": "التوزيع الجغرافي",
  "nav.overview": "نظرة عامة",
  "nav.usage": "الاستخدام",
  "nav.users": "المستخدمون",
  "nav.efficiency": "الكفاءة",
  "nav.peers": "النماذج المشابهة",
  "nav.models": "النماذج",
  "header.brandLabel": "صفحة البيانات الرئيسية",
  "header.sectionNavLabel": "أقسام البيانات",
  "header.githubAria": "ضع نجمة لـ OpenCode على GitHub",
  "header.github": "GitHub",
  "header.tryOpenCode": "جرّب OpenCode",
  "header.openNav": "فتح التنقل",
  "header.closeNav": "إغلاق التنقل",
  "theme.groupLabel": "السمة",
  "theme.dark": "داكن",
  "theme.light": "فاتح",
  "theme.system": "النظام",
  "footer.modelData": "بيانات النموذج",
  "footer.legal": "قانوني",
  "footer.connect": "تواصل",
  "footer.newsletter": "النشرة الإخبارية",
  "footer.newsletterBody": "كن أول من يعرف بالإصدارات الجديدة.",
  "footer.language": "اللغة",
  "footer.subscribe": "اشترك",
  "footer.terms": "شروط الخدمة",
  "footer.privacy": "سياسة الخصوصية",
  "footer.contact": "اتصل بنا",
  "footer.community": "المجتمع",
  "footer.youtube": "YouTube",
  "footer.homeAria": "صفحة OpenCode الرئيسية",
  "footer.status": "كل الأنظمة تعمل",
  "footer.copyright": "© 2026 Anomaly Innovations Inc.",
  "bridge.learnMore": "اعرف المزيد",
  "modal.closeNewsletter": "إغلاق التسجيل في النشرة الإخبارية",
  "modal.title": "نشرة OpenCode الإخبارية",
  "modal.body": "كن أول من يعرف\nبالإصدارات الجديدة.",
  "modal.email": "عنوان البريد الإلكتروني",
  "modal.subscribe": "اشترك",
  "modal.subscribing": "جاري الاشتراك...",
  "modal.success": "تم اشتراكك.",
  "modal.error": "فشل الاشتراك",
  "product.allUsers": "كل المستخدمين",
  "product.zen": "Zen",
  "product.go": "Go",
  "range.1D": "يوم واحد",
  "range.1W": "أسبوع واحد",
  "range.2W": "أسبوعان",
  "range.1M": "شهر واحد",
  "range.2M": "شهران",
  "chart.daily": "يومي",
  "chart.input": "الإدخال",
  "chart.output": "الإخراج",
  "chart.cached": "مخزّن مؤقتًا",
  "chart.uncached": "غير مخزّن مؤقتًا",
  "chart.ratio": "النسبة",
  "chart.model": "النموذج",
  "chart.cacheRatio": "نسبة التخزين المؤقت",
  "chart.costSession": "التكلفة/الجلسة",
  "chart.tokensSession": "الرموز/الجلسة",
  "chart.costPerSession": "التكلفة / الجلسة",
  "chart.tokensPerSession": "الرموز / الجلسة",
  "chart.live": "مباشر",
  "chart.percent": "نسبة مئوية",
  "chart.leaderboardAria": "لوحة ترتيب رموز النموذج",
  "chart.scrollableLeaderboardAria": "لوحة ترتيب رموز النموذج قابلة للتمرير",
  "chart.byAuthor": "بواسطة {{author}}",
  "home.updated": "تم التحديث",
  "home.noRows": "لا توجد صفوف بعد",
  "home.justNow": "الآن للتو",
  "home.heroCopy": "تعرّف على النماذج التي تحقق استخدامًا فعليًا أكبر، وكيف يتغير المزيج، وما يعنيه ذلك للتكلفة.",
  "home.loadingTitle": "تحميل البيانات",
  "home.loadingDescription": "قراءة تجميعات النماذج.",
  "home.usageTitle": "الاستخدام",
  "home.topModelsDescription": "استخدام النماذج عبر OpenCode Go.",
  "home.noUsageTitle": "لا توجد بيانات استخدام",
  "home.noUsageDescription": "لم تطابق أي صفوف نماذج هذا المنتج وهذا النطاق.",
  "home.noLeaderboardTitle": "لا توجد بيانات ترتيب",
  "home.noLeaderboardDescription": "لم تطابق أي صفوف نماذج هذا المنتج وهذا النطاق.",
  "home.productFilter": "عامل تصفية المنتج",
  "home.dateRange": "نطاق التاريخ",
  "home.stackedUsageChart": "مخطط استخدام مكدس لأهم النماذج",
  "home.total": "الإجمالي",
  "home.modelUsers": "مستخدمو النموذج",
  "home.new": "جديد",
  "home.uniqueUsersTitle": "المستخدمون الفريدون",
  "home.uniqueUsersDescription": "المستخدمون اليوميون الفريدون لـ OpenCode Go حسب النموذج.",
  "home.noUserDataTitle": "لا توجد بيانات مستخدمين",
  "home.noUserDataDescription": "لم تطابق أي صفوف نماذج تحتوي على مستخدمين هذه النافذة.",
  "home.uniqueUsersChart": "مخطط مكدس للمستخدمين الفريدين حسب النموذج",
  "home.marketShareTitle": "حصة السوق",
  "home.marketShareDescription": "قارن حصة الرموز حسب مؤلف النموذج.",
  "home.noMarketTitle": "لا توجد بيانات سوق",
  "home.noMarketDescription": "لم تطابق أي صفوف نماذج هذا النطاق.",
  "home.marketChart": "حصة السوق حسب مؤلف النموذج",
  "home.noData": "لا توجد بيانات",
  "home.geoTitle": "التوزيع الجغرافي",
  "home.geoDescription": "الرموز المستخدمة حسب البلد.",
  "home.noGeoTitle": "لا توجد بيانات جغرافية",
  "home.noGeoDescription": "لم تطابق أي صفوف جغرافية هذا النطاق.",
  "home.worldMap": "خريطة عالمية لاستخدام الرموز حسب البلد",
  "home.geoMapTitle": "خريطة التوزيع الجغرافي",
  "home.unknown": "غير معروف",
  "home.tokenCostTitle": "تكلفة الرموز",
  "home.tokenCostDescription": "السعر لكل مليون رمز.",
  "home.noTokenCostTitle": "لا توجد بيانات تكلفة الرموز",
  "home.noTokenCostDescription": "لم تطابق أي صفوف نماذج ذات تكلفة هذا المنتج.",
  "home.cacheRatioTitle": "نسبة التخزين المؤقت",
  "home.cacheRatioDescription": "حصة رموز الإدخال التي قُدمت من التخزين المؤقت.",
  "home.noCacheTitle": "لا توجد بيانات نسبة التخزين المؤقت",
  "home.noCacheDescription": "لم تطابق أي صفوف نماذج ذات رموز إدخال هذا المنتج.",
  "home.sessionCostTitle": "تكلفة الجلسة",
  "home.sessionCostDescription": "متوسط التكلفة لكل جلسة.",
  "home.noSessionCostTitle": "لا توجد بيانات تكلفة الجلسة",
  "home.noSessionCostDescription": "لم تطابق أي صفوف نماذج ذات جلسات هذا المنتج.",
  "home.costSession": "التكلفة/الجلسة",
  "lab.title": "استخدام وترتيب نماذج {{lab}} للذكاء الاصطناعي | OpenCode Data",
  "lab.description": "قارن نماذج {{lab}} المستخدمة في OpenCode Go، بما في ذلك استخدام الرموز، وترتيب النماذج، ونوافذ السياق، وتواريخ الإصدار، والتكاليف، والبيانات الخاصة بكل نموذج.",
  "lab.loadingTitle": "مختبر النماذج",
  "lab.loadingDescription": "قراءة توفر النماذج واستخدام OpenCode الأخير.",
  "lab.notFound": "لم تطابق أي نماذج هذا المختبر.",
  "lab.heroPrefix": "استكشف {{count}} من نماذج {{lab}} المستخدمة في OpenCode",
  "lab.heroIncluding": "بما في ذلك {{models}}",
  "lab.heroSuffix": "قارن الاستخدام الأخير للرموز، ونوافذ السياق، وتواريخ الإصدار، والبيانات الخاصة بكل نموذج.",
  "lab.tokensProcessed": "الرموز المعالجة",
  "lab.pending": "قيد الانتظار",
  "lab.usageAfterActivity": "يظهر الاستخدام بعد وصول نشاط النموذج",
  "lab.latestRelease": "آخر إصدار {{date}}",
  "lab.shareOfUsage": "{{share}} من استخدام OpenCode الأخير",
  "lab.usageTitle": "استخدام رموز {{lab}}",
  "lab.usageDescription": "حجم رموز OpenCode اليومي خلال الشهرين الماضيين.",
  "lab.noUsageTitle": "لا يوجد استخدام بعد",
  "lab.noUsageDescription": "سيظهر الاستخدام الأخير للرموز هنا عندما يصبح لهذا المختبر نشاط.",
  "lab.dailyTokenChart": "مخطط استخدام رموز {{lab}} اليومي",
  "lab.dailyTokens": "الرموز اليومية",
  "lab.tokens": "رموز",
  "lab.modelsTitle": "نماذج {{lab}}",
  "lab.modelsDescription": "تفاصيل الكتالوج مع الاستخدام الأخير.",
  "lab.recentUsageAndLimits": "الاستخدام والحدود الأخيرة.",
  "lab.usage": "الاستخدام",
  "lab.share": "الحصة",
  "model.title": "استخدام {{model}} وتكلفته وترتيبه | OpenCode Data",
  "model.description": "اعرض بيانات استخدام {{model}} في OpenCode Go، بما في ذلك حجم الرموز، والترتيب الأسبوعي، ومزيج الرموز، والتكاليف، ونسبة التخزين المؤقت، والجلسات، والتوزيع الجغرافي، والنماذج المشابهة.",
  "model.loadingTitle": "بيانات النموذج",
  "model.loadingDescription": "قراءة تجميعات النماذج.",
  "model.loadingProfile": "قراءة ملف النموذج.",
  "model.noDataTitle": "لا توجد بيانات نموذج",
  "model.noDataDescription": "جرّب فتح نموذج من لوحة الترتيب.",
  "model.noMatched": "لم تطابق أي حقائق نموذج أو صفوف استخدام {{id}}.",
  "model.fallback": "نموذج",
  "model.catalogFallback": "حقائق النموذج من فهرس النماذج المشترك. يظهر استخدام OpenCode Go عندما يصبح لهذا النموذج نشاط.",
  "model.unranked": "غير مصنف ضمن استخدام OpenCode Go للأسبوع الماضي",
  "model.ranked": "مصنف رقم {{rank}} ضمن استخدام OpenCode Go للأسبوع الماضي",
  "model.observedVolume": "مع {{share}} من حجم 2M المرصود.",
  "model.weights": "أوزان النموذج: {{label}}",
  "model.rank": "ترتيب 7 أيام",
  "model.profile": "ملف النموذج",
  "model.listed": "مدرج",
  "model.noCurrentUsage": "لا يوجد استخدام لـ OpenCode Go في نافذة البيانات الحالية.",
  "model.facts": "حقائق النموذج",
  "model.context": "السياق",
  "model.output": "الإخراج",
  "model.knowledge": "المعرفة",
  "model.release": "الإصدار",
  "model.inputs": "المدخلات",
  "model.overviewDescription": "رموز OpenCode Go الأخيرة، والمستخدمون الفريدون، وموقع السوق.",
  "model.noSummaryTitle": "لا يوجد ملخص استخدام",
  "model.noSummaryDescription": "لا يحتوي هذا النموذج على صفوف استخدام OpenCode Go بعد.",
  "model.tokens": "الرموز",
  "model.uniqueUsers": "المستخدمون الفريدون",
  "model.lastTwoMonths": "آخر شهرين",
  "model.sessions": "الجلسات",
  "model.completedSessions": "الجلسات المكتملة",
  "model.tokenShare": "حصة الرموز",
  "model.totalModels": "{{count}} نموذجًا",
  "model.momentum": "الزخم",
  "model.vsPreviousWindow": "مقارنة بالنافذة السابقة",
  "model.usageDescription": "حجم رموز OpenCode Go اليومي خلال نافذة الشهرين الأخيرة.",
  "model.noUsageTitle": "لا يوجد استخدام",
  "model.noUsageDescription": "لم يصل أي استخدام في النافذة الحالية.",
  "model.dailyTokenChart": "مخطط استخدام الرموز اليومي",
  "model.usersDescription": "المستخدمون اليوميون الفريدون لـ OpenCode Go خلال نافذة الشهرين الأخيرة.",
  "model.noUsersTitle": "لا توجد بيانات مستخدمين",
  "model.noUsersDescription": "لم تصل أي صفوف تحتوي على مستخدمين في النافذة الحالية.",
  "model.dailyUserChart": "مخطط المستخدمين الفريدين اليومي",
  "model.efficiencyDescription": "التكلفة، وسلوك التخزين المؤقت، ومتوسط شكل جلسة OpenCode Go.",
  "model.noEfficiencyTitle": "لا توجد بيانات كفاءة",
  "model.noEfficiencyDescription": "تظهر بيانات الكفاءة بعد وصول الاستخدام.",
  "model.totalSpendLabel": "Total spend",
  "model.costInput": "Cost input",
  "model.costOutput": "Cost output",
  "model.averageCostSession": "Average cost / Session",
  "model.averageTokensSession": "Average tokens / session",
  "model.cost": "التكلفة",
  "model.totalSpend": "إجمالي الإنفاق",
  "model.costPerMillion": "التكلفة / 1M",
  "model.inputOutput": "الإدخال / الإخراج",
  "model.observedTokens": "كل الرموز المرصودة",
  "model.costSession": "التكلفة / الجلسة",
  "model.average": "المتوسط",
  "model.tokensSession": "الرموز / الجلسة",
  "model.cacheRatio": "نسبة التخزين المؤقت",
  "model.inputTokens": "رموز الإدخال",
  "model.geoDescription": "رموز نموذج OpenCode Go المستخدمة حسب البلد.",
  "model.noGeoTitle": "لا توجد بيانات جغرافية",
  "model.noGeoDescription": "لم تطابق أي صفوف جغرافية في OpenCode Go هذا النموذج.",
  "model.worldMap": "خريطة عالمية لاستخدام رموز النموذج حسب البلد",
  "model.peersDescription": "نماذج قريبة حسب حجم رموز OpenCode Go الأخير.",
  "model.noPeersTitle": "لا توجد نماذج مشابهة",
  "model.noPeersDescription": "تظهر ترتيبات النماذج المشابهة بعد وصول الاستخدام.",
  "model.noUsageLastWeek": "لا يوجد استخدام الأسبوع الماضي",
  "model.newThisWeek": "جديد هذا الأسبوع",
  "model.sameAsPreviousWeek": "دون تغيير عن الأسبوع السابق",
  "model.vsPreviousWeek": "{{change}} مقارنة بالأسبوع السابق",
  "model.pdf": "PDF",
  "format.users": "مستخدمون",
  "format.tokens": "رموز"
};
const dict$g = {
  "app.title": "Ranking de uso de modelos de IA | OpenCode Data",
  "app.description": "Explore o uso do OpenCode Go em modelos de IA, incluindo volume de tokens, rankings, participação de mercado, preço por token, custo por sessão, taxa de cache e distribuição geográfica.",
  "app.unfurlAlt": "Logotipo do OpenCode Data sobre um fundo escuro padronizado",
  "nav.dataHome": "Início dos dados",
  "nav.topModels": "Principais modelos",
  "nav.leaderboard": "Classificação",
  "nav.uniqueUsers": "Usuários únicos",
  "nav.sessionCost": "Custo da sessão",
  "nav.tokenCost": "Custo de tokens",
  "nav.cacheRatio": "Taxa de cache",
  "nav.marketShare": "Participação de mercado",
  "nav.geoBreakdown": "Distribuição geográfica",
  "nav.overview": "Visão geral",
  "nav.usage": "Uso",
  "nav.users": "Usuários",
  "nav.efficiency": "Eficiência",
  "nav.peers": "Pares",
  "nav.models": "Modelos",
  "header.brandLabel": "Início dos dados",
  "header.sectionNavLabel": "Seções de dados",
  "header.githubAria": "Dar estrela ao OpenCode no GitHub",
  "header.github": "GitHub",
  "header.tryOpenCode": "Experimente o OpenCode",
  "header.openNav": "Abrir navegação",
  "header.closeNav": "Fechar navegação",
  "theme.groupLabel": "Tema",
  "theme.dark": "Escuro",
  "theme.light": "Claro",
  "theme.system": "Sistema",
  "footer.modelData": "Dados do modelo",
  "footer.legal": "Legal",
  "footer.connect": "Conectar",
  "footer.newsletter": "Newsletter",
  "footer.newsletterBody": "Seja a primeira pessoa a saber sobre novos lançamentos.",
  "footer.language": "Idioma",
  "footer.subscribe": "Inscrever-se",
  "footer.terms": "Termos de serviço",
  "footer.privacy": "Política de privacidade",
  "footer.contact": "Fale conosco",
  "footer.community": "Comunidade",
  "footer.youtube": "YouTube",
  "footer.homeAria": "Início do OpenCode",
  "footer.status": "Todos os sistemas operacionais",
  "footer.copyright": "© 2026 Anomaly Innovations Inc.",
  "bridge.learnMore": "SAIBA MAIS",
  "modal.closeNewsletter": "Fechar inscrição na newsletter",
  "modal.title": "Newsletter do OpenCode",
  "modal.body": "Seja a primeira pessoa a saber\nsobre novos lançamentos.",
  "modal.email": "Endereço de email",
  "modal.subscribe": "Inscrever-se",
  "modal.subscribing": "Inscrevendo...",
  "modal.success": "Inscrição realizada.",
  "modal.error": "Falha ao inscrever",
  "product.allUsers": "Todos os usuários",
  "product.zen": "Zen",
  "product.go": "Go",
  "range.1D": "1 dia",
  "range.1W": "1 semana",
  "range.2W": "2 semanas",
  "range.1M": "1 mês",
  "range.2M": "2 meses",
  "chart.daily": "Diário",
  "chart.input": "Entrada",
  "chart.output": "Saída",
  "chart.cached": "Em cache",
  "chart.uncached": "Sem cache",
  "chart.ratio": "Taxa",
  "chart.model": "Modelo",
  "chart.cacheRatio": "Taxa de cache",
  "chart.costSession": "Custo/sessão",
  "chart.tokensSession": "Tokens/sessão",
  "chart.costPerSession": "CUSTO / SESSÃO",
  "chart.tokensPerSession": "TOKENS / SESSÃO",
  "chart.live": "Ao vivo",
  "chart.percent": "por cento",
  "chart.leaderboardAria": "Classificação de tokens do modelo",
  "chart.scrollableLeaderboardAria": "Classificação rolável de tokens do modelo",
  "chart.byAuthor": "por {{author}}",
  "home.updated": "Atualizado",
  "home.noRows": "Ainda não há linhas",
  "home.justNow": "agora mesmo",
  "home.heroCopy": "Veja quais modelos estão vencendo em uso real, como a combinação está mudando e o que isso significa para o custo.",
  "home.loadingTitle": "Carregando dados",
  "home.loadingDescription": "Lendo agregados de modelos.",
  "home.usageTitle": "Uso",
  "home.topModelsDescription": "Uso de modelos no OpenCode Go.",
  "home.noUsageTitle": "Sem dados de uso",
  "home.noUsageDescription": "Nenhuma linha de modelo correspondeu a este produto e intervalo.",
  "home.noLeaderboardTitle": "Sem dados de classificação",
  "home.noLeaderboardDescription": "Nenhuma linha de modelo correspondeu a este produto e intervalo.",
  "home.productFilter": "Filtro de produto",
  "home.dateRange": "Intervalo de datas",
  "home.stackedUsageChart": "Gráfico empilhado de uso dos principais modelos",
  "home.total": "total",
  "home.modelUsers": "usuários do modelo",
  "home.new": "Novo",
  "home.uniqueUsersTitle": "Usuários únicos",
  "home.uniqueUsersDescription": "Usuários únicos diários do OpenCode Go por modelo.",
  "home.noUserDataTitle": "Sem dados de usuários",
  "home.noUserDataDescription": "Nenhuma linha de modelo com usuários correspondeu a esta janela.",
  "home.uniqueUsersChart": "Gráfico empilhado de usuários únicos por modelo",
  "home.marketShareTitle": "Participação de mercado",
  "home.marketShareDescription": "Compare a participação de tokens por autor do modelo.",
  "home.noMarketTitle": "Sem dados de mercado",
  "home.noMarketDescription": "Nenhuma linha de modelo correspondeu a este intervalo.",
  "home.marketChart": "Participação de mercado por autor do modelo",
  "home.noData": "Sem dados",
  "home.geoTitle": "Distribuição geográfica",
  "home.geoDescription": "Tokens usados por país.",
  "home.noGeoTitle": "Sem dados geográficos",
  "home.noGeoDescription": "Nenhuma linha geográfica correspondeu a este intervalo.",
  "home.worldMap": "Mapa-múndi do uso de tokens por país",
  "home.geoMapTitle": "Mapa da distribuição geográfica",
  "home.unknown": "Desconhecido",
  "home.tokenCostTitle": "Custo de tokens",
  "home.tokenCostDescription": "Preço por 1 milhão de tokens.",
  "home.noTokenCostTitle": "Sem dados de custo de tokens",
  "home.noTokenCostDescription": "Nenhuma linha de modelo com custo correspondeu a este produto.",
  "home.cacheRatioTitle": "Taxa de cache",
  "home.cacheRatioDescription": "Parcela dos tokens de entrada atendida pelo cache.",
  "home.noCacheTitle": "Sem dados de taxa de cache",
  "home.noCacheDescription": "Nenhuma linha de modelo com tokens de entrada correspondeu a este produto.",
  "home.sessionCostTitle": "Custo da sessão",
  "home.sessionCostDescription": "Custo médio por sessão.",
  "home.noSessionCostTitle": "Sem dados de custo da sessão",
  "home.noSessionCostDescription": "Nenhuma linha de modelo com sessões correspondeu a este produto.",
  "home.costSession": "Custo/sessão",
  "lab.title": "Uso e ranking de modelos de IA da {{lab}} | OpenCode Data",
  "lab.description": "Compare modelos da {{lab}} usados no OpenCode Go, incluindo uso de tokens, ranking de modelos, janelas de contexto, datas de lançamento, custos e dados específicos de cada modelo.",
  "lab.loadingTitle": "Laboratório de modelos",
  "lab.loadingDescription": "Lendo disponibilidade de modelos e uso recente do OpenCode.",
  "lab.notFound": "Nenhum modelo correspondeu a este laboratório.",
  "lab.heroPrefix": "Explore {{count}} modelos da {{lab}} usados no OpenCode",
  "lab.heroIncluding": "incluindo {{models}}",
  "lab.heroSuffix": "Compare uso recente de tokens, janelas de contexto, datas de lançamento e dados específicos de cada modelo.",
  "lab.tokensProcessed": "Tokens processados",
  "lab.pending": "Pendente",
  "lab.usageAfterActivity": "O uso aparece depois que a atividade do modelo chega",
  "lab.latestRelease": "Último lançamento em {{date}}",
  "lab.shareOfUsage": "{{share}} do uso recente do OpenCode",
  "lab.usageTitle": "Uso de tokens da {{lab}}",
  "lab.usageDescription": "Volume diário de tokens do OpenCode nos últimos dois meses.",
  "lab.noUsageTitle": "Ainda sem uso",
  "lab.noUsageDescription": "O uso recente de tokens aparece aqui quando este laboratório tiver atividade.",
  "lab.dailyTokenChart": "Gráfico diário de uso de tokens da {{lab}}",
  "lab.dailyTokens": "Tokens diários",
  "lab.tokens": "tokens",
  "lab.modelsTitle": "Modelos da {{lab}}",
  "lab.modelsDescription": "Detalhes do catálogo mais uso recente.",
  "lab.recentUsageAndLimits": "Uso recente e limites.",
  "lab.usage": "Uso",
  "lab.share": "Participação",
  "model.title": "Uso, custo e posição de {{model}} | OpenCode Data",
  "model.description": "Veja dados de uso de {{model}} no OpenCode Go, incluindo volume de tokens, ranking semanal, combinação de tokens, custos, taxa de cache, sessões, distribuição geográfica e modelos pares.",
  "model.loadingTitle": "Dados do modelo",
  "model.loadingDescription": "Lendo agregados de modelos.",
  "model.loadingProfile": "Lendo o perfil do modelo.",
  "model.noDataTitle": "Sem dados do modelo",
  "model.noDataDescription": "Tente abrir um modelo pela classificação.",
  "model.noMatched": "Nenhum fato do modelo ou linha de uso correspondeu a {{id}}.",
  "model.fallback": "Modelo",
  "model.catalogFallback": "Fatos do modelo do índice compartilhado de modelos. O uso no OpenCode Go aparece quando este modelo tiver atividade.",
  "model.unranked": "Sem classificação no uso do OpenCode Go da última semana",
  "model.ranked": "Classificado em #{{rank}} no uso do OpenCode Go da última semana",
  "model.observedVolume": "com {{share}} do volume observado de 2M.",
  "model.weights": "Pesos do modelo: {{label}}",
  "model.rank": "Ranking 7D",
  "model.profile": "Perfil do modelo",
  "model.listed": "Listado",
  "model.noCurrentUsage": "Sem uso do OpenCode Go na janela de dados atual.",
  "model.facts": "Fatos do modelo",
  "model.context": "Contexto",
  "model.output": "Saída",
  "model.knowledge": "Conhecimento",
  "model.release": "Lançamento",
  "model.inputs": "Entradas",
  "model.overviewDescription": "Tokens recentes do OpenCode Go, usuários únicos e posição de mercado.",
  "model.noSummaryTitle": "Sem resumo de uso",
  "model.noSummaryDescription": "Este modelo ainda não tem linhas de uso do OpenCode Go.",
  "model.tokens": "Tokens",
  "model.uniqueUsers": "Usuários únicos",
  "model.lastTwoMonths": "últimos dois meses",
  "model.sessions": "Sessões",
  "model.completedSessions": "sessões concluídas",
  "model.tokenShare": "Participação de tokens",
  "model.totalModels": "{{count}} modelos",
  "model.momentum": "Momento",
  "model.vsPreviousWindow": "vs janela anterior",
  "model.usageDescription": "Volume diário de tokens do OpenCode Go na janela recente de dois meses.",
  "model.noUsageTitle": "Sem uso",
  "model.noUsageDescription": "Nenhum uso chegou na janela atual.",
  "model.dailyTokenChart": "Gráfico diário de uso de tokens",
  "model.usersDescription": "Usuários únicos diários do OpenCode Go na janela recente de dois meses.",
  "model.noUsersTitle": "Sem dados de usuários",
  "model.noUsersDescription": "Nenhuma linha com usuários chegou na janela atual.",
  "model.dailyUserChart": "Gráfico diário de usuários únicos",
  "model.efficiencyDescription": "Custo, comportamento de cache e formato médio da sessão do OpenCode Go.",
  "model.noEfficiencyTitle": "Sem dados de eficiência",
  "model.noEfficiencyDescription": "Os dados de eficiência aparecem depois que o uso chega.",
  "model.totalSpendLabel": "Total spend",
  "model.costInput": "Cost input",
  "model.costOutput": "Cost output",
  "model.averageCostSession": "Average cost / Session",
  "model.averageTokensSession": "Average tokens / session",
  "model.cost": "Custo",
  "model.totalSpend": "gasto total",
  "model.costPerMillion": "Custo / 1M",
  "model.inputOutput": "entrada / saída",
  "model.observedTokens": "todos os tokens observados",
  "model.costSession": "Custo / sessão",
  "model.average": "média",
  "model.tokensSession": "Tokens / sessão",
  "model.cacheRatio": "Taxa de cache",
  "model.inputTokens": "tokens de entrada",
  "model.geoDescription": "Tokens do modelo OpenCode Go usados por país.",
  "model.noGeoTitle": "Sem dados geográficos",
  "model.noGeoDescription": "Nenhuma linha geográfica do OpenCode Go correspondeu a este modelo.",
  "model.worldMap": "Mapa-múndi do uso de tokens do modelo por país",
  "model.peersDescription": "Modelos próximos por volume recente de tokens do OpenCode Go.",
  "model.noPeersTitle": "Sem pares",
  "model.noPeersDescription": "Os rankings de pares aparecem depois que o uso chega.",
  "model.noUsageLastWeek": "Sem uso na semana passada",
  "model.newThisWeek": "Novo esta semana",
  "model.sameAsPreviousWeek": "Igual à semana anterior",
  "model.vsPreviousWeek": "{{change}} vs semana anterior",
  "model.pdf": "PDF",
  "format.users": "usuários",
  "format.tokens": "tokens"
};
const dict$f = {
  "app.title": "Ranglister for brug af AI-modeller | OpenCode Data",
  "app.description": "Udforsk brugen af OpenCode Go på tværs af AI-modeller, inklusive tokenvolumen, ranglister, markedsandel, tokenpriser, sessionsomkostning, cacheandel og geografiske opdelinger.",
  "app.unfurlAlt": "OpenCode Data-ordmærke på en mørk mønstret baggrund",
  "nav.dataHome": "Dataforside",
  "nav.topModels": "Topmodeller",
  "nav.leaderboard": "Rangliste",
  "nav.uniqueUsers": "Unikke brugere",
  "nav.sessionCost": "Sessionsomkostning",
  "nav.tokenCost": "Tokenomkostning",
  "nav.cacheRatio": "Cacheandel",
  "nav.marketShare": "Markedsandel",
  "nav.geoBreakdown": "Geografisk opdeling",
  "nav.overview": "Overblik",
  "nav.usage": "Brug",
  "nav.users": "Brugere",
  "nav.efficiency": "Effektivitet",
  "nav.peers": "Lignende modeller",
  "nav.models": "Modeller",
  "header.brandLabel": "Dataforside",
  "header.sectionNavLabel": "Datasektioner",
  "header.githubAria": "Giv OpenCode en stjerne på GitHub",
  "header.github": "GitHub",
  "header.tryOpenCode": "Prøv OpenCode",
  "header.openNav": "Åbn navigation",
  "header.closeNav": "Luk navigation",
  "theme.groupLabel": "Tema",
  "theme.dark": "Mørkt",
  "theme.light": "Lyst",
  "theme.system": "System",
  "footer.modelData": "Modeldata",
  "footer.legal": "Juridisk",
  "footer.connect": "Kontakt",
  "footer.newsletter": "Nyhedsbrev",
  "footer.newsletterBody": "Vær den første til at høre om nye udgivelser.",
  "footer.language": "Sprog",
  "footer.subscribe": "Tilmeld",
  "footer.terms": "Servicevilkår",
  "footer.privacy": "Privatlivspolitik",
  "footer.contact": "Kontakt os",
  "footer.community": "Fællesskab",
  "footer.youtube": "YouTube",
  "footer.homeAria": "OpenCode-forside",
  "footer.status": "Alle systemer er i drift",
  "footer.copyright": "© 2026 Anomaly Innovations Inc.",
  "bridge.learnMore": "LÆR MERE",
  "modal.closeNewsletter": "Luk tilmelding til nyhedsbrev",
  "modal.title": "OpenCode-nyhedsbrev",
  "modal.body": "Vær den første til at høre\nom nye udgivelser.",
  "modal.email": "E-mailadresse",
  "modal.subscribe": "Tilmeld",
  "modal.subscribing": "Tilmelder...",
  "modal.success": "Du er tilmeldt.",
  "modal.error": "Tilmelding mislykkedes",
  "product.allUsers": "Alle brugere",
  "product.zen": "Zen",
  "product.go": "Go",
  "range.1D": "1 dag",
  "range.1W": "1 uge",
  "range.2W": "2 uger",
  "range.1M": "1 måned",
  "range.2M": "2 måneder",
  "chart.daily": "Dagligt",
  "chart.input": "Input",
  "chart.output": "Output",
  "chart.cached": "Cachelagret",
  "chart.uncached": "Ikke cachelagret",
  "chart.ratio": "Forhold",
  "chart.model": "Model",
  "chart.cacheRatio": "Cacheandel",
  "chart.costSession": "Omkostning/session",
  "chart.tokensSession": "Tokens/session",
  "chart.costPerSession": "OMKOSTNING / SESSION",
  "chart.tokensPerSession": "TOKENS / SESSION",
  "chart.live": "Live",
  "chart.percent": "procent",
  "chart.leaderboardAria": "Rangliste over modeltokens",
  "chart.scrollableLeaderboardAria": "Rulbar rangliste over modeltokens",
  "chart.byAuthor": "af {{author}}",
  "home.updated": "Opdateret",
  "home.noRows": "Ingen rækker endnu",
  "home.justNow": "lige nu",
  "home.heroCopy": "Se hvilke modeller der vinder reel brug, hvordan mixet skifter, og hvad det betyder for omkostningerne.",
  "home.loadingTitle": "Indlæser data",
  "home.loadingDescription": "Læser modelaggregater.",
  "home.usageTitle": "Brug",
  "home.topModelsDescription": "Brug af modeller på tværs af OpenCode Go.",
  "home.noUsageTitle": "Ingen brugsdata",
  "home.noUsageDescription": "Ingen modelrækker matchede dette produkt og interval.",
  "home.noLeaderboardTitle": "Ingen ranglistedata",
  "home.noLeaderboardDescription": "Ingen modelrækker matchede dette produkt og interval.",
  "home.productFilter": "Produktfilter",
  "home.dateRange": "Datointerval",
  "home.stackedUsageChart": "Stablet brugsdiagram for topmodeller",
  "home.total": "i alt",
  "home.modelUsers": "modelbrugere",
  "home.new": "Ny",
  "home.uniqueUsersTitle": "Unikke brugere",
  "home.uniqueUsersDescription": "Daglige unikke OpenCode Go-brugere efter model.",
  "home.noUserDataTitle": "Ingen brugerdata",
  "home.noUserDataDescription": "Ingen modelrækker med brugere matchede dette vindue.",
  "home.uniqueUsersChart": "Stablet diagram over unikke brugere efter model",
  "home.marketShareTitle": "Markedsandel",
  "home.marketShareDescription": "Sammenlign tokenandel efter modelforfatter.",
  "home.noMarketTitle": "Ingen markedsdata",
  "home.noMarketDescription": "Ingen modelrækker matchede dette interval.",
  "home.marketChart": "Markedsandel efter modelforfatter",
  "home.noData": "Ingen data",
  "home.geoTitle": "Geografisk opdeling",
  "home.geoDescription": "Tokens brugt efter land.",
  "home.noGeoTitle": "Ingen geodata",
  "home.noGeoDescription": "Ingen georækker matchede dette interval.",
  "home.worldMap": "Verdenskort over tokenbrug efter land",
  "home.geoMapTitle": "Kort over geografisk opdeling",
  "home.unknown": "Ukendt",
  "home.tokenCostTitle": "Tokenomkostning",
  "home.tokenCostDescription": "Pris pr. 1 mio. tokens.",
  "home.noTokenCostTitle": "Ingen tokenomkostningsdata",
  "home.noTokenCostDescription": "Ingen modelrækker med omkostninger matchede dette produkt.",
  "home.cacheRatioTitle": "Cacheandel",
  "home.cacheRatioDescription": "Andel af inputtokens leveret fra cache.",
  "home.noCacheTitle": "Ingen cacheandelsdata",
  "home.noCacheDescription": "Ingen modelrækker med inputtokens matchede dette produkt.",
  "home.sessionCostTitle": "Sessionsomkostning",
  "home.sessionCostDescription": "Gennemsnitlig omkostning pr. session.",
  "home.noSessionCostTitle": "Ingen sessionsomkostningsdata",
  "home.noSessionCostDescription": "Ingen modelrækker med sessioner matchede dette produkt.",
  "home.costSession": "Omkostning/session",
  "lab.title": "{{lab}} AI-modelbrug og ranglister | OpenCode Data",
  "lab.description": "Sammenlign {{lab}}-modeller brugt i OpenCode Go, inklusive tokenbrug, modelranglister, kontekstvinduer, udgivelsesdatoer, omkostninger og modelspecifikke data.",
  "lab.loadingTitle": "Modellab",
  "lab.loadingDescription": "Læser modeltilgængelighed og seneste OpenCode-brug.",
  "lab.notFound": "Ingen modeller matchede dette lab.",
  "lab.heroPrefix": "Udforsk {{count}} {{lab}}-modeller brugt i OpenCode",
  "lab.heroIncluding": "inklusive {{models}}",
  "lab.heroSuffix": "Sammenlign seneste tokenbrug, kontekstvinduer, udgivelsesdatoer og modelspecifikke data.",
  "lab.tokensProcessed": "Behandlede tokens",
  "lab.pending": "Afventer",
  "lab.usageAfterActivity": "Brug vises, når modelaktivitet lander",
  "lab.latestRelease": "Seneste udgivelse {{date}}",
  "lab.shareOfUsage": "{{share}} af den seneste OpenCode-brug",
  "lab.usageTitle": "{{lab}}-tokenbrug",
  "lab.usageDescription": "Daglig OpenCode-tokenvolumen over de sidste to måneder.",
  "lab.noUsageTitle": "Ingen brug endnu",
  "lab.noUsageDescription": "Seneste tokenbrug vises her, når dette lab har aktivitet.",
  "lab.dailyTokenChart": "Dagligt diagram over {{lab}}-tokenbrug",
  "lab.dailyTokens": "Daglige tokens",
  "lab.tokens": "tokens",
  "lab.modelsTitle": "{{lab}}-modeller",
  "lab.modelsDescription": "Katalogdetaljer plus seneste brug.",
  "lab.recentUsageAndLimits": "Seneste brug og grænser.",
  "lab.usage": "Brug",
  "lab.share": "Andel",
  "model.title": "{{model}} brug, omkostning og rang | OpenCode Data",
  "model.description": "Se OpenCode Go-brugsdata for {{model}}, inklusive tokenvolumen, ugentlig rang, tokenmix, omkostninger, cacheandel, sessioner, geografiske opdelinger og lignende modeller.",
  "model.loadingTitle": "Modeldata",
  "model.loadingDescription": "Læser modelaggregater.",
  "model.loadingProfile": "Læser modelprofilen.",
  "model.noDataTitle": "Ingen modeldata",
  "model.noDataDescription": "Prøv at åbne en model fra ranglisten.",
  "model.noMatched": "Ingen modelfakta eller brugsrækker matchede {{id}}.",
  "model.fallback": "Model",
  "model.catalogFallback": "Modelfakta fra det fælles modelindeks. OpenCode Go-brug vises, når denne model har aktivitet.",
  "model.unranked": "Ikke rangeret i sidste uges OpenCode Go-brug",
  "model.ranked": "Rangeret #{{rank}} i sidste uges OpenCode Go-brug",
  "model.observedVolume": "med {{share}} af observeret 2M-volumen.",
  "model.weights": "Modelvægte: {{label}}",
  "model.rank": "7D-rang",
  "model.profile": "Modelprofil",
  "model.listed": "Opført",
  "model.noCurrentUsage": "Ingen OpenCode Go-brug i det aktuelle datavindue.",
  "model.facts": "Modelfakta",
  "model.context": "Kontekst",
  "model.output": "Output",
  "model.knowledge": "Viden",
  "model.release": "Udgivelse",
  "model.inputs": "Input",
  "model.overviewDescription": "Seneste OpenCode Go-tokens, unikke brugere og markedsposition.",
  "model.noSummaryTitle": "Ingen brugsoversigt",
  "model.noSummaryDescription": "Denne model har endnu ingen OpenCode Go-brugsrækker.",
  "model.tokens": "Tokens",
  "model.uniqueUsers": "Unikke brugere",
  "model.lastTwoMonths": "sidste to måneder",
  "model.sessions": "Sessioner",
  "model.completedSessions": "fuldførte sessioner",
  "model.tokenShare": "Tokenandel",
  "model.totalModels": "{{count}} modeller",
  "model.momentum": "Momentum",
  "model.vsPreviousWindow": "vs forrige vindue",
  "model.usageDescription": "Daglig OpenCode Go-tokenvolumen i det seneste tomånedersvindue.",
  "model.noUsageTitle": "Ingen brug",
  "model.noUsageDescription": "Ingen brug landede i det aktuelle vindue.",
  "model.dailyTokenChart": "Dagligt diagram over tokenbrug",
  "model.usersDescription": "Daglige unikke OpenCode Go-brugere i det seneste tomånedersvindue.",
  "model.noUsersTitle": "Ingen brugerdata",
  "model.noUsersDescription": "Ingen rækker med brugere landede i det aktuelle vindue.",
  "model.dailyUserChart": "Dagligt diagram over unikke brugere",
  "model.efficiencyDescription": "Omkostning, cacheadfærd og gennemsnitlig OpenCode Go-sessionsform.",
  "model.noEfficiencyTitle": "Ingen effektivitetsdata",
  "model.noEfficiencyDescription": "Effektivitetsdata vises, når brug lander.",
  "model.totalSpendLabel": "Total spend",
  "model.costInput": "Cost input",
  "model.costOutput": "Cost output",
  "model.averageCostSession": "Average cost / Session",
  "model.averageTokensSession": "Average tokens / session",
  "model.cost": "Omkostning",
  "model.totalSpend": "samlet forbrug",
  "model.costPerMillion": "Omkostning / 1 mio.",
  "model.inputOutput": "input / output",
  "model.observedTokens": "alle observerede tokens",
  "model.costSession": "Omkostning / session",
  "model.average": "gennemsnit",
  "model.tokensSession": "Tokens / session",
  "model.cacheRatio": "Cacheandel",
  "model.inputTokens": "inputtokens",
  "model.geoDescription": "OpenCode Go-modeltokens brugt efter land.",
  "model.noGeoTitle": "Ingen geodata",
  "model.noGeoDescription": "Ingen OpenCode Go-georækker matchede denne model.",
  "model.worldMap": "Verdenskort over modeltokenbrug efter land",
  "model.peersDescription": "Nærliggende modeller efter seneste OpenCode Go-tokenvolumen.",
  "model.noPeersTitle": "Ingen lignende modeller",
  "model.noPeersDescription": "Ranglister over lignende modeller vises, når brug lander.",
  "model.noUsageLastWeek": "Ingen brug sidste uge",
  "model.newThisWeek": "Ny denne uge",
  "model.sameAsPreviousWeek": "Samme som forrige uge",
  "model.vsPreviousWeek": "{{change}} vs forrige uge",
  "model.pdf": "PDF",
  "format.users": "brugere",
  "format.tokens": "tokens"
};
const dict$e = {
  "app.title": "KI-Modellnutzungs-Rankings | OpenCode Data",
  "app.description": "Erkunde die OpenCode Go-Nutzung über KI-Modelle hinweg, einschließlich Tokenvolumen, Rankings, Marktanteil, Tokenpreisen, Sitzungskosten, Cache-Anteil und geografischen Aufschlüsselungen.",
  "app.unfurlAlt": "OpenCode Data-Wortmarke auf dunklem gemustertem Hintergrund",
  "nav.dataHome": "Daten-Startseite",
  "nav.topModels": "Top-Modelle",
  "nav.leaderboard": "Bestenliste",
  "nav.uniqueUsers": "Eindeutige Nutzer",
  "nav.sessionCost": "Sitzungskosten",
  "nav.tokenCost": "Tokenkosten",
  "nav.cacheRatio": "Cache-Anteil",
  "nav.marketShare": "Marktanteil",
  "nav.geoBreakdown": "Geografische Aufschlüsselung",
  "nav.overview": "Übersicht",
  "nav.usage": "Nutzung",
  "nav.users": "Nutzer",
  "nav.efficiency": "Effizienz",
  "nav.peers": "Vergleichsmodelle",
  "nav.models": "Modelle",
  "header.brandLabel": "Daten-Startseite",
  "header.sectionNavLabel": "Datenbereiche",
  "header.githubAria": "OpenCode auf GitHub mit Stern markieren",
  "header.github": "GitHub",
  "header.tryOpenCode": "OpenCode ausprobieren",
  "header.openNav": "Navigation öffnen",
  "header.closeNav": "Navigation schließen",
  "theme.groupLabel": "Design",
  "theme.dark": "Dunkel",
  "theme.light": "Hell",
  "theme.system": "System",
  "footer.modelData": "Modelldaten",
  "footer.legal": "Rechtliches",
  "footer.connect": "Kontakt",
  "footer.newsletter": "Newsletter",
  "footer.newsletterBody": "Erfahre als Erstes von neuen Veröffentlichungen.",
  "footer.language": "Sprache",
  "footer.subscribe": "Abonnieren",
  "footer.terms": "Nutzungsbedingungen",
  "footer.privacy": "Datenschutzerklärung",
  "footer.contact": "Kontakt aufnehmen",
  "footer.community": "Community",
  "footer.youtube": "YouTube",
  "footer.homeAria": "OpenCode-Startseite",
  "footer.status": "Alle Systeme betriebsbereit",
  "footer.copyright": "© 2026 Anomaly Innovations Inc.",
  "bridge.learnMore": "MEHR ERFAHREN",
  "modal.closeNewsletter": "Newsletter-Anmeldung schließen",
  "modal.title": "OpenCode-Newsletter",
  "modal.body": "Erfahre als Erstes\nvon neuen Veröffentlichungen.",
  "modal.email": "E-Mail-Adresse",
  "modal.subscribe": "Abonnieren",
  "modal.subscribing": "Wird abonniert...",
  "modal.success": "Du hast dich angemeldet.",
  "modal.error": "Anmeldung fehlgeschlagen",
  "product.allUsers": "Alle Nutzer",
  "product.zen": "Zen",
  "product.go": "Go",
  "range.1D": "1 Tag",
  "range.1W": "1 Woche",
  "range.2W": "2 Wochen",
  "range.1M": "1 Monat",
  "range.2M": "2 Monate",
  "chart.daily": "Täglich",
  "chart.input": "Eingabe",
  "chart.output": "Ausgabe",
  "chart.cached": "Gecacht",
  "chart.uncached": "Nicht gecacht",
  "chart.ratio": "Verhältnis",
  "chart.model": "Modell",
  "chart.cacheRatio": "Cache-Anteil",
  "chart.costSession": "Kosten/Sitzung",
  "chart.tokensSession": "Tokens/Sitzung",
  "chart.costPerSession": "KOSTEN / SITZUNG",
  "chart.tokensPerSession": "TOKENS / SITZUNG",
  "chart.live": "Live",
  "chart.percent": "Prozent",
  "chart.leaderboardAria": "Modell-Token-Bestenliste",
  "chart.scrollableLeaderboardAria": "Scrollbare Modell-Token-Bestenliste",
  "chart.byAuthor": "von {{author}}",
  "home.updated": "Aktualisiert",
  "home.noRows": "Noch keine Zeilen",
  "home.justNow": "gerade eben",
  "home.heroCopy": "Sieh, welche Modelle echte Nutzung gewinnen, wie sich der Mix verschiebt und was das für die Kosten bedeutet.",
  "home.loadingTitle": "Daten werden geladen",
  "home.loadingDescription": "Modellaggregate werden gelesen.",
  "home.usageTitle": "Nutzung",
  "home.topModelsDescription": "Nutzung von Modellen in OpenCode Go.",
  "home.noUsageTitle": "Keine Nutzungsdaten",
  "home.noUsageDescription": "Keine Modellzeilen passten zu diesem Produkt und Zeitraum.",
  "home.noLeaderboardTitle": "Keine Bestenlistendaten",
  "home.noLeaderboardDescription": "Keine Modellzeilen passten zu diesem Produkt und Zeitraum.",
  "home.productFilter": "Produktfilter",
  "home.dateRange": "Datumsbereich",
  "home.stackedUsageChart": "Gestapeltes Nutzungsdiagramm der Top-Modelle",
  "home.total": "gesamt",
  "home.modelUsers": "Modellnutzer",
  "home.new": "Neu",
  "home.uniqueUsersTitle": "Eindeutige Nutzer",
  "home.uniqueUsersDescription": "Täglich eindeutige OpenCode Go-Nutzer nach Modell.",
  "home.noUserDataTitle": "Keine Nutzerdaten",
  "home.noUserDataDescription": "Keine Modellzeilen mit Nutzern passten zu diesem Zeitraum.",
  "home.uniqueUsersChart": "Gestapeltes Diagramm eindeutiger Nutzer nach Modell",
  "home.marketShareTitle": "Marktanteil",
  "home.marketShareDescription": "Vergleiche den Tokenanteil nach Modellautor.",
  "home.noMarketTitle": "Keine Marktdaten",
  "home.noMarketDescription": "Keine Modellzeilen passten zu diesem Zeitraum.",
  "home.marketChart": "Marktanteil nach Modellautor",
  "home.noData": "Keine Daten",
  "home.geoTitle": "Geografische Aufschlüsselung",
  "home.geoDescription": "Nach Land verwendete Tokens.",
  "home.noGeoTitle": "Keine Geodaten",
  "home.noGeoDescription": "Keine Geozeilen passten zu diesem Zeitraum.",
  "home.worldMap": "Weltkarte der Tokennutzung nach Land",
  "home.geoMapTitle": "Karte der geografischen Aufschlüsselung",
  "home.unknown": "Unbekannt",
  "home.tokenCostTitle": "Tokenkosten",
  "home.tokenCostDescription": "Preis pro 1 Mio. Tokens.",
  "home.noTokenCostTitle": "Keine Tokenkostendaten",
  "home.noTokenCostDescription": "Keine Modellzeilen mit Kostendaten passten zu diesem Produkt.",
  "home.cacheRatioTitle": "Cache-Anteil",
  "home.cacheRatioDescription": "Anteil der Eingabetokens, die aus dem Cache bedient wurden.",
  "home.noCacheTitle": "Keine Cache-Anteilsdaten",
  "home.noCacheDescription": "Keine Modellzeilen mit Eingabetokens passten zu diesem Produkt.",
  "home.sessionCostTitle": "Sitzungskosten",
  "home.sessionCostDescription": "Durchschnittliche Kosten pro Sitzung.",
  "home.noSessionCostTitle": "Keine Sitzungskostendaten",
  "home.noSessionCostDescription": "Keine Modellzeilen mit Sitzungen passten zu diesem Produkt.",
  "home.costSession": "Kosten/Sitzung",
  "lab.title": "{{lab}} KI-Modellnutzung und Rankings | OpenCode Data",
  "lab.description": "Vergleiche {{lab}}-Modelle, die in OpenCode Go verwendet werden, einschließlich Tokennutzung, Modellrankings, Kontextfenstern, Veröffentlichungsdaten, Kosten und modellspezifischen Daten.",
  "lab.loadingTitle": "Modelllabor",
  "lab.loadingDescription": "Modellverfügbarkeit und aktuelle OpenCode-Nutzung werden gelesen.",
  "lab.notFound": "Keine Modelle passten zu diesem Lab.",
  "lab.heroPrefix": "Erkunde {{count}} {{lab}}-Modelle, die in OpenCode verwendet werden",
  "lab.heroIncluding": "einschließlich {{models}}",
  "lab.heroSuffix": "Vergleiche aktuelle Tokennutzung, Kontextfenster, Veröffentlichungsdaten und modellspezifische Daten.",
  "lab.tokensProcessed": "Verarbeitete Tokens",
  "lab.pending": "Ausstehend",
  "lab.usageAfterActivity": "Nutzung erscheint, sobald Modellaktivität vorliegt",
  "lab.latestRelease": "Neueste Veröffentlichung {{date}}",
  "lab.shareOfUsage": "{{share}} der aktuellen OpenCode-Nutzung",
  "lab.usageTitle": "{{lab}}-Tokennutzung",
  "lab.usageDescription": "Tägliches OpenCode-Tokenvolumen der letzten zwei Monate.",
  "lab.noUsageTitle": "Noch keine Nutzung",
  "lab.noUsageDescription": "Aktuelle Tokennutzung erscheint hier, sobald dieses Lab Aktivität hat.",
  "lab.dailyTokenChart": "Diagramm der täglichen {{lab}}-Tokennutzung",
  "lab.dailyTokens": "Tägliche Tokens",
  "lab.tokens": "Tokens",
  "lab.modelsTitle": "{{lab}}-Modelle",
  "lab.modelsDescription": "Katalogdetails plus aktuelle Nutzung.",
  "lab.recentUsageAndLimits": "Aktuelle Nutzung und Limits.",
  "lab.usage": "Nutzung",
  "lab.share": "Anteil",
  "model.title": "{{model}} Nutzung, Kosten und Rang | OpenCode Data",
  "model.description": "Sieh dir OpenCode Go-Nutzungsdaten für {{model}} an, einschließlich Tokenvolumen, Wochenrang, Tokenmix, Kosten, Cache-Anteil, Sitzungen, geografischer Aufschlüsselung und Vergleichsmodellen.",
  "model.loadingTitle": "Modelldaten",
  "model.loadingDescription": "Modellaggregate werden gelesen.",
  "model.loadingProfile": "Modellprofil wird gelesen.",
  "model.noDataTitle": "Keine Modelldaten",
  "model.noDataDescription": "Öffne ein Modell aus der Bestenliste.",
  "model.noMatched": "Keine Modellfakten oder Nutzungszeilen passten zu {{id}}.",
  "model.fallback": "Modell",
  "model.catalogFallback": "Modellfakten aus dem gemeinsamen Modellindex. OpenCode Go-Nutzung erscheint, sobald dieses Modell Aktivität hat.",
  "model.unranked": "In der OpenCode Go-Nutzung der letzten Woche nicht platziert",
  "model.ranked": "Rang #{{rank}} in der OpenCode Go-Nutzung der letzten Woche",
  "model.observedVolume": "mit {{share}} des beobachteten 2M-Volumens.",
  "model.weights": "Modellgewichte: {{label}}",
  "model.rank": "7T-Rang",
  "model.profile": "Modellprofil",
  "model.listed": "Gelistet",
  "model.noCurrentUsage": "Keine OpenCode Go-Nutzung im aktuellen Datenfenster.",
  "model.facts": "Modellfakten",
  "model.context": "Kontext",
  "model.output": "Ausgabe",
  "model.knowledge": "Wissensstand",
  "model.release": "Veröffentlichung",
  "model.inputs": "Eingaben",
  "model.overviewDescription": "Aktuelle OpenCode Go-Tokens, eindeutige Nutzer und Marktposition.",
  "model.noSummaryTitle": "Keine Nutzungsübersicht",
  "model.noSummaryDescription": "Dieses Modell hat noch keine OpenCode Go-Nutzungszeilen.",
  "model.tokens": "Tokens",
  "model.uniqueUsers": "Eindeutige Nutzer",
  "model.lastTwoMonths": "letzte zwei Monate",
  "model.sessions": "Sitzungen",
  "model.completedSessions": "abgeschlossene Sitzungen",
  "model.tokenShare": "Tokenanteil",
  "model.totalModels": "{{count}} Modelle",
  "model.momentum": "Momentum",
  "model.vsPreviousWindow": "ggü. vorherigem Fenster",
  "model.usageDescription": "Tägliches OpenCode Go-Tokenvolumen im aktuellen Zwei-Monats-Fenster.",
  "model.noUsageTitle": "Keine Nutzung",
  "model.noUsageDescription": "Im aktuellen Fenster ist keine Nutzung eingegangen.",
  "model.dailyTokenChart": "Diagramm der täglichen Tokennutzung",
  "model.usersDescription": "Täglich eindeutige OpenCode Go-Nutzer im aktuellen Zwei-Monats-Fenster.",
  "model.noUsersTitle": "Keine Nutzerdaten",
  "model.noUsersDescription": "Im aktuellen Fenster sind keine Zeilen mit Nutzern eingegangen.",
  "model.dailyUserChart": "Diagramm der täglich eindeutigen Nutzer",
  "model.efficiencyDescription": "Kosten, Cache-Verhalten und durchschnittliche OpenCode Go-Sitzungsform.",
  "model.noEfficiencyTitle": "Keine Effizienzdaten",
  "model.noEfficiencyDescription": "Effizienzdaten erscheinen, nachdem Nutzung eingegangen ist.",
  "model.totalSpendLabel": "Total spend",
  "model.costInput": "Cost input",
  "model.costOutput": "Cost output",
  "model.averageCostSession": "Average cost / Session",
  "model.averageTokensSession": "Average tokens / session",
  "model.cost": "Kosten",
  "model.totalSpend": "Gesamtausgaben",
  "model.costPerMillion": "Kosten / 1 Mio.",
  "model.inputOutput": "Eingabe / Ausgabe",
  "model.observedTokens": "alle beobachteten Tokens",
  "model.costSession": "Kosten / Sitzung",
  "model.average": "Durchschnitt",
  "model.tokensSession": "Tokens / Sitzung",
  "model.cacheRatio": "Cache-Anteil",
  "model.inputTokens": "Eingabetokens",
  "model.geoDescription": "OpenCode Go-Modelltokens nach Land.",
  "model.noGeoTitle": "Keine Geodaten",
  "model.noGeoDescription": "Keine OpenCode Go-Geozeilen passten zu diesem Modell.",
  "model.worldMap": "Weltkarte der Modelltokennutzung nach Land",
  "model.peersDescription": "Nahe Modelle nach aktuellem OpenCode Go-Tokenvolumen.",
  "model.noPeersTitle": "Keine Vergleichsmodelle",
  "model.noPeersDescription": "Vergleichsrankings erscheinen, nachdem Nutzung eingegangen ist.",
  "model.noUsageLastWeek": "Keine Nutzung letzte Woche",
  "model.newThisWeek": "Neu diese Woche",
  "model.sameAsPreviousWeek": "Unverändert zur vorherigen Woche",
  "model.vsPreviousWeek": "{{change}} ggü. vorheriger Woche",
  "model.pdf": "PDF",
  "format.users": "Nutzer",
  "format.tokens": "Tokens"
};
const dict$d = {
  "app.title": "Clasificaciones de uso de modelos de IA | OpenCode Data",
  "app.description": "Explora el uso de OpenCode Go en modelos de IA, incluido el volumen de tokens, clasificaciones, cuota de mercado, precios de tokens, coste por sesión, ratio de caché y desgloses geográficos.",
  "app.unfurlAlt": "Logotipo textual de OpenCode Data sobre un fondo oscuro con patrón",
  "nav.dataHome": "Inicio de datos",
  "nav.topModels": "Modelos principales",
  "nav.leaderboard": "Clasificación",
  "nav.uniqueUsers": "Usuarios únicos",
  "nav.sessionCost": "Coste por sesión",
  "nav.tokenCost": "Coste de tokens",
  "nav.cacheRatio": "Ratio de caché",
  "nav.marketShare": "Cuota de mercado",
  "nav.geoBreakdown": "Desglose geográfico",
  "nav.overview": "Resumen",
  "nav.usage": "Uso",
  "nav.users": "Usuarios",
  "nav.efficiency": "Eficiencia",
  "nav.peers": "Modelos similares",
  "nav.models": "Modelos",
  "header.brandLabel": "Inicio de datos",
  "header.sectionNavLabel": "Secciones de datos",
  "header.githubAria": "Dale una estrella a OpenCode en GitHub",
  "header.github": "GitHub",
  "header.tryOpenCode": "Probar OpenCode",
  "header.openNav": "Abrir navegación",
  "header.closeNav": "Cerrar navegación",
  "theme.groupLabel": "Tema",
  "theme.dark": "Oscuro",
  "theme.light": "Claro",
  "theme.system": "Sistema",
  "footer.modelData": "Datos de modelos",
  "footer.legal": "Legal",
  "footer.connect": "Conectar",
  "footer.newsletter": "Boletín",
  "footer.newsletterBody": "Entérate antes que nadie de los nuevos lanzamientos.",
  "footer.language": "Idioma",
  "footer.subscribe": "Suscribirse",
  "footer.terms": "Términos del servicio",
  "footer.privacy": "Política de privacidad",
  "footer.contact": "Contáctanos",
  "footer.community": "Comunidad",
  "footer.youtube": "YouTube",
  "footer.homeAria": "Inicio de OpenCode",
  "footer.status": "Todos los sistemas están operativos",
  "footer.copyright": "© 2026 Anomaly Innovations Inc.",
  "bridge.learnMore": "MÁS INFORMACIÓN",
  "modal.closeNewsletter": "Cerrar suscripción al boletín",
  "modal.title": "Boletín de OpenCode",
  "modal.body": "Entérate antes que nadie\nde los nuevos lanzamientos.",
  "modal.email": "Dirección de correo",
  "modal.subscribe": "Suscribirse",
  "modal.subscribing": "Suscribiendo...",
  "modal.success": "Suscripción completada.",
  "modal.error": "No se pudo suscribir",
  "product.allUsers": "Todos los usuarios",
  "product.zen": "Zen",
  "product.go": "Go",
  "range.1D": "1 día",
  "range.1W": "1 semana",
  "range.2W": "2 semanas",
  "range.1M": "1 mes",
  "range.2M": "2 meses",
  "chart.daily": "Diario",
  "chart.input": "Entrada",
  "chart.output": "Salida",
  "chart.cached": "En caché",
  "chart.uncached": "Sin caché",
  "chart.ratio": "Ratio",
  "chart.model": "Modelo",
  "chart.cacheRatio": "Ratio de caché",
  "chart.costSession": "Coste/sesión",
  "chart.tokensSession": "Tokens/sesión",
  "chart.costPerSession": "COSTE / SESIÓN",
  "chart.tokensPerSession": "TOKENS / SESIÓN",
  "chart.live": "En directo",
  "chart.percent": "porcentaje",
  "chart.leaderboardAria": "Clasificación de tokens por modelo",
  "chart.scrollableLeaderboardAria": "Clasificación desplazable de tokens por modelo",
  "chart.byAuthor": "por {{author}}",
  "home.updated": "Actualizado",
  "home.noRows": "Aún no hay filas",
  "home.justNow": "ahora mismo",
  "home.heroCopy": "Mira qué modelos ganan uso real, cómo cambia la mezcla y qué significa eso para el coste.",
  "home.loadingTitle": "Cargando datos",
  "home.loadingDescription": "Leyendo agregados de modelos.",
  "home.usageTitle": "Uso",
  "home.topModelsDescription": "Uso de modelos en OpenCode Go.",
  "home.noUsageTitle": "Sin datos de uso",
  "home.noUsageDescription": "Ninguna fila de modelo coincidió con este producto y rango.",
  "home.noLeaderboardTitle": "Sin datos de clasificación",
  "home.noLeaderboardDescription": "Ninguna fila de modelo coincidió con este producto y rango.",
  "home.productFilter": "Filtro de producto",
  "home.dateRange": "Rango de fechas",
  "home.stackedUsageChart": "Gráfico apilado de uso de los modelos principales",
  "home.total": "total",
  "home.modelUsers": "usuarios del modelo",
  "home.new": "Nuevo",
  "home.uniqueUsersTitle": "Usuarios únicos",
  "home.uniqueUsersDescription": "Usuarios únicos diarios de OpenCode Go por modelo.",
  "home.noUserDataTitle": "Sin datos de usuarios",
  "home.noUserDataDescription": "Ninguna fila de modelo con usuarios coincidió con esta ventana.",
  "home.uniqueUsersChart": "Gráfico apilado de usuarios únicos por modelo",
  "home.marketShareTitle": "Cuota de mercado",
  "home.marketShareDescription": "Compara la cuota de tokens por autor del modelo.",
  "home.noMarketTitle": "Sin datos de mercado",
  "home.noMarketDescription": "Ninguna fila de modelo coincidió con este rango.",
  "home.marketChart": "Cuota de mercado por autor del modelo",
  "home.noData": "Sin datos",
  "home.geoTitle": "Desglose geográfico",
  "home.geoDescription": "Tokens usados por país.",
  "home.noGeoTitle": "Sin datos geográficos",
  "home.noGeoDescription": "Ninguna fila geográfica coincidió con este rango.",
  "home.worldMap": "Mapa mundial del uso de tokens por país",
  "home.geoMapTitle": "Mapa de desglose geográfico",
  "home.unknown": "Desconocido",
  "home.tokenCostTitle": "Coste de tokens",
  "home.tokenCostDescription": "Precio por 1 M de tokens.",
  "home.noTokenCostTitle": "Sin datos de coste de tokens",
  "home.noTokenCostDescription": "Ninguna fila de modelo con costes coincidió con este producto.",
  "home.cacheRatioTitle": "Ratio de caché",
  "home.cacheRatioDescription": "Porción de tokens de entrada servidos desde caché.",
  "home.noCacheTitle": "Sin datos de ratio de caché",
  "home.noCacheDescription": "Ninguna fila de modelo con tokens de entrada coincidió con este producto.",
  "home.sessionCostTitle": "Coste por sesión",
  "home.sessionCostDescription": "Coste medio por sesión.",
  "home.noSessionCostTitle": "Sin datos de coste por sesión",
  "home.noSessionCostDescription": "Ninguna fila de modelo con sesiones coincidió con este producto.",
  "home.costSession": "Coste/sesión",
  "lab.title": "Uso y clasificaciones de modelos de IA de {{lab}} | OpenCode Data",
  "lab.description": "Compara modelos de {{lab}} usados en OpenCode Go, incluido uso de tokens, clasificaciones de modelos, ventanas de contexto, fechas de lanzamiento, costes y datos específicos del modelo.",
  "lab.loadingTitle": "Laboratorio de modelos",
  "lab.loadingDescription": "Leyendo disponibilidad de modelos y uso reciente de OpenCode.",
  "lab.notFound": "Ningún modelo coincidió con este laboratorio.",
  "lab.heroPrefix": "Explora {{count}} modelos de {{lab}} usados en OpenCode",
  "lab.heroIncluding": "incluidos {{models}}",
  "lab.heroSuffix": "Compara uso reciente de tokens, ventanas de contexto, fechas de lanzamiento y datos específicos del modelo.",
  "lab.tokensProcessed": "Tokens procesados",
  "lab.pending": "Pendiente",
  "lab.usageAfterActivity": "El uso aparece después de que llegue actividad del modelo",
  "lab.latestRelease": "Último lanzamiento {{date}}",
  "lab.shareOfUsage": "{{share}} del uso reciente de OpenCode",
  "lab.usageTitle": "Uso de tokens de {{lab}}",
  "lab.usageDescription": "Volumen diario de tokens de OpenCode durante los últimos dos meses.",
  "lab.noUsageTitle": "Aún sin uso",
  "lab.noUsageDescription": "El uso reciente de tokens aparecerá aquí cuando este laboratorio tenga actividad.",
  "lab.dailyTokenChart": "Gráfico de uso diario de tokens de {{lab}}",
  "lab.dailyTokens": "Tokens diarios",
  "lab.tokens": "tokens",
  "lab.modelsTitle": "Modelos de {{lab}}",
  "lab.modelsDescription": "Detalles del catálogo más uso reciente.",
  "lab.recentUsageAndLimits": "Uso reciente y límites.",
  "lab.usage": "Uso",
  "lab.share": "Cuota",
  "model.title": "Uso, coste y posición de {{model}} | OpenCode Data",
  "model.description": "Consulta datos de uso de {{model}} en OpenCode Go, incluido volumen de tokens, posición semanal, mezcla de tokens, costes, ratio de caché, sesiones, desgloses geográficos y modelos similares.",
  "model.loadingTitle": "Datos del modelo",
  "model.loadingDescription": "Leyendo agregados del modelo.",
  "model.loadingProfile": "Leyendo el perfil del modelo.",
  "model.noDataTitle": "Sin datos del modelo",
  "model.noDataDescription": "Prueba a abrir un modelo desde la clasificación.",
  "model.noMatched": "Ningún dato del modelo ni fila de uso coincidió con {{id}}.",
  "model.fallback": "Modelo",
  "model.catalogFallback": "Datos del modelo desde el índice compartido de modelos. El uso de OpenCode Go aparecerá cuando este modelo tenga actividad.",
  "model.unranked": "Sin clasificación en el uso de OpenCode Go de la semana pasada",
  "model.ranked": "Clasificado #{{rank}} en el uso de OpenCode Go de la semana pasada",
  "model.observedVolume": "con {{share}} del volumen 2M observado.",
  "model.weights": "Pesos del modelo: {{label}}",
  "model.rank": "Posición 7D",
  "model.profile": "Perfil del modelo",
  "model.listed": "Listado",
  "model.noCurrentUsage": "Sin uso de OpenCode Go en la ventana de datos actual.",
  "model.facts": "Datos del modelo",
  "model.context": "Contexto",
  "model.output": "Salida",
  "model.knowledge": "Conocimiento",
  "model.release": "Lanzamiento",
  "model.inputs": "Entradas",
  "model.overviewDescription": "Tokens recientes de OpenCode Go, usuarios únicos y posición de mercado.",
  "model.noSummaryTitle": "Sin resumen de uso",
  "model.noSummaryDescription": "Este modelo aún no tiene filas de uso de OpenCode Go.",
  "model.tokens": "Tokens",
  "model.uniqueUsers": "Usuarios únicos",
  "model.lastTwoMonths": "últimos dos meses",
  "model.sessions": "Sesiones",
  "model.completedSessions": "sesiones completadas",
  "model.tokenShare": "Cuota de tokens",
  "model.totalModels": "{{count}} modelos",
  "model.momentum": "Impulso",
  "model.vsPreviousWindow": "vs ventana anterior",
  "model.usageDescription": "Volumen diario de tokens de OpenCode Go durante la ventana reciente de dos meses.",
  "model.noUsageTitle": "Sin uso",
  "model.noUsageDescription": "No llegó uso en la ventana actual.",
  "model.dailyTokenChart": "Gráfico de uso diario de tokens",
  "model.usersDescription": "Usuarios únicos diarios de OpenCode Go durante la ventana reciente de dos meses.",
  "model.noUsersTitle": "Sin datos de usuarios",
  "model.noUsersDescription": "No llegaron filas con usuarios en la ventana actual.",
  "model.dailyUserChart": "Gráfico diario de usuarios únicos",
  "model.efficiencyDescription": "Coste, comportamiento de caché y forma media de sesión de OpenCode Go.",
  "model.noEfficiencyTitle": "Sin datos de eficiencia",
  "model.noEfficiencyDescription": "Los datos de eficiencia aparecen después de que llegue uso.",
  "model.totalSpendLabel": "Total spend",
  "model.costInput": "Cost input",
  "model.costOutput": "Cost output",
  "model.averageCostSession": "Average cost / Session",
  "model.averageTokensSession": "Average tokens / session",
  "model.cost": "Coste",
  "model.totalSpend": "gasto total",
  "model.costPerMillion": "Coste / 1 M",
  "model.inputOutput": "entrada / salida",
  "model.observedTokens": "todos los tokens observados",
  "model.costSession": "Coste / sesión",
  "model.average": "media",
  "model.tokensSession": "Tokens / sesión",
  "model.cacheRatio": "Ratio de caché",
  "model.inputTokens": "tokens de entrada",
  "model.geoDescription": "Tokens del modelo de OpenCode Go usados por país.",
  "model.noGeoTitle": "Sin datos geográficos",
  "model.noGeoDescription": "Ninguna fila geográfica de OpenCode Go coincidió con este modelo.",
  "model.worldMap": "Mapa mundial del uso de tokens del modelo por país",
  "model.peersDescription": "Modelos cercanos por volumen reciente de tokens de OpenCode Go.",
  "model.noPeersTitle": "Sin modelos similares",
  "model.noPeersDescription": "Las clasificaciones de modelos similares aparecen después de que llegue uso.",
  "model.noUsageLastWeek": "Sin uso la semana pasada",
  "model.newThisWeek": "Nuevo esta semana",
  "model.sameAsPreviousWeek": "Igual que la semana anterior",
  "model.vsPreviousWeek": "{{change}} vs semana anterior",
  "model.pdf": "PDF",
  "format.users": "usuarios",
  "format.tokens": "tokens"
};
const dict$c = {
  "app.title": "Classements d'utilisation des modèles d'IA | OpenCode Data",
  "app.description": "Explorez l'utilisation d'OpenCode Go par modèle d'IA, avec le volume de tokens, les classements, la part de marché, le prix des tokens, le coût par session, le taux de cache et les répartitions géographiques.",
  "app.unfurlAlt": "Logo textuel OpenCode Data sur un fond sombre à motif",
  "nav.dataHome": "Accueil des données",
  "nav.topModels": "Meilleurs modèles",
  "nav.leaderboard": "Classement",
  "nav.uniqueUsers": "Utilisateurs uniques",
  "nav.sessionCost": "Coût par session",
  "nav.tokenCost": "Coût des tokens",
  "nav.cacheRatio": "Taux de cache",
  "nav.marketShare": "Part de marché",
  "nav.geoBreakdown": "Répartition géographique",
  "nav.overview": "Aperçu",
  "nav.usage": "Utilisation",
  "nav.users": "Utilisateurs",
  "nav.efficiency": "Efficacité",
  "nav.peers": "Modèles proches",
  "nav.models": "Modèles",
  "header.brandLabel": "Accueil des données",
  "header.sectionNavLabel": "Sections de données",
  "header.githubAria": "Ajouter une étoile à OpenCode sur GitHub",
  "header.github": "GitHub",
  "header.tryOpenCode": "Essayer OpenCode",
  "header.openNav": "Ouvrir la navigation",
  "header.closeNav": "Fermer la navigation",
  "theme.groupLabel": "Thème",
  "theme.dark": "Sombre",
  "theme.light": "Clair",
  "theme.system": "Système",
  "footer.modelData": "Données des modèles",
  "footer.legal": "Mentions légales",
  "footer.connect": "Contact",
  "footer.newsletter": "Newsletter",
  "footer.newsletterBody": "Soyez informé en premier des nouvelles versions.",
  "footer.language": "Langue",
  "footer.subscribe": "S'abonner",
  "footer.terms": "Conditions d'utilisation",
  "footer.privacy": "Politique de confidentialité",
  "footer.contact": "Nous contacter",
  "footer.community": "Communauté",
  "footer.youtube": "YouTube",
  "footer.homeAria": "Accueil OpenCode",
  "footer.status": "Tous les systèmes sont opérationnels",
  "footer.copyright": "© 2026 Anomaly Innovations Inc.",
  "bridge.learnMore": "EN SAVOIR PLUS",
  "modal.closeNewsletter": "Fermer l'inscription à la newsletter",
  "modal.title": "Newsletter OpenCode",
  "modal.body": "Soyez informé en premier\ndes nouvelles versions.",
  "modal.email": "Adresse e-mail",
  "modal.subscribe": "S'abonner",
  "modal.subscribing": "Inscription...",
  "modal.success": "Vous êtes inscrit.",
  "modal.error": "Échec de l'inscription",
  "product.allUsers": "Tous les utilisateurs",
  "product.zen": "Zen",
  "product.go": "Go",
  "range.1D": "1 jour",
  "range.1W": "1 semaine",
  "range.2W": "2 semaines",
  "range.1M": "1 mois",
  "range.2M": "2 mois",
  "chart.daily": "Quotidien",
  "chart.input": "Entrée",
  "chart.output": "Sortie",
  "chart.cached": "Mis en cache",
  "chart.uncached": "Non mis en cache",
  "chart.ratio": "Ratio",
  "chart.model": "Modèle",
  "chart.cacheRatio": "Taux de cache",
  "chart.costSession": "Coût/session",
  "chart.tokensSession": "Tokens/session",
  "chart.costPerSession": "COÛT / SESSION",
  "chart.tokensPerSession": "TOKENS / SESSION",
  "chart.live": "En direct",
  "chart.percent": "pourcentage",
  "chart.leaderboardAria": "Classement des tokens par modèle",
  "chart.scrollableLeaderboardAria": "Classement déroulant des tokens par modèle",
  "chart.byAuthor": "par {{author}}",
  "home.updated": "Mis à jour",
  "home.noRows": "Aucune ligne pour l'instant",
  "home.justNow": "à l'instant",
  "home.heroCopy": "Voyez quels modèles gagnent en usage réel, comment la répartition évolue et ce que cela signifie pour les coûts.",
  "home.loadingTitle": "Chargement des données",
  "home.loadingDescription": "Lecture des agrégats de modèles.",
  "home.usageTitle": "Utilisation",
  "home.topModelsDescription": "Utilisation des modèles dans OpenCode Go.",
  "home.noUsageTitle": "Aucune donnée d'utilisation",
  "home.noUsageDescription": "Aucune ligne de modèle ne correspondait à ce produit et à cette période.",
  "home.noLeaderboardTitle": "Aucune donnée de classement",
  "home.noLeaderboardDescription": "Aucune ligne de modèle ne correspondait à ce produit et à cette période.",
  "home.productFilter": "Filtre produit",
  "home.dateRange": "Période",
  "home.stackedUsageChart": "Graphique empilé d'utilisation des meilleurs modèles",
  "home.total": "total",
  "home.modelUsers": "utilisateurs du modèle",
  "home.new": "Nouveau",
  "home.uniqueUsersTitle": "Utilisateurs uniques",
  "home.uniqueUsersDescription": "Utilisateurs uniques quotidiens d'OpenCode Go par modèle.",
  "home.noUserDataTitle": "Aucune donnée utilisateur",
  "home.noUserDataDescription": "Aucune ligne de modèle avec utilisateurs ne correspondait à cette fenêtre.",
  "home.uniqueUsersChart": "Graphique empilé des utilisateurs uniques par modèle",
  "home.marketShareTitle": "Part de marché",
  "home.marketShareDescription": "Comparez la part de tokens par auteur de modèle.",
  "home.noMarketTitle": "Aucune donnée de marché",
  "home.noMarketDescription": "Aucune ligne de modèle ne correspondait à cette période.",
  "home.marketChart": "Part de marché par auteur de modèle",
  "home.noData": "Aucune donnée",
  "home.geoTitle": "Répartition géographique",
  "home.geoDescription": "Tokens utilisés par pays.",
  "home.noGeoTitle": "Aucune donnée géographique",
  "home.noGeoDescription": "Aucune ligne géographique ne correspondait à cette période.",
  "home.worldMap": "Carte mondiale de l'utilisation des tokens par pays",
  "home.geoMapTitle": "Carte de répartition géographique",
  "home.unknown": "Inconnu",
  "home.tokenCostTitle": "Coût des tokens",
  "home.tokenCostDescription": "Prix par million de tokens.",
  "home.noTokenCostTitle": "Aucune donnée de coût des tokens",
  "home.noTokenCostDescription": "Aucune ligne de modèle avec coût ne correspondait à ce produit.",
  "home.cacheRatioTitle": "Taux de cache",
  "home.cacheRatioDescription": "Part des tokens d'entrée servis depuis le cache.",
  "home.noCacheTitle": "Aucune donnée de taux de cache",
  "home.noCacheDescription": "Aucune ligne de modèle avec tokens d'entrée ne correspondait à ce produit.",
  "home.sessionCostTitle": "Coût par session",
  "home.sessionCostDescription": "Coût moyen par session.",
  "home.noSessionCostTitle": "Aucune donnée de coût par session",
  "home.noSessionCostDescription": "Aucune ligne de modèle avec sessions ne correspondait à ce produit.",
  "home.costSession": "Coût/session",
  "lab.title": "Utilisation et classements des modèles d'IA {{lab}} | OpenCode Data",
  "lab.description": "Comparez les modèles {{lab}} utilisés dans OpenCode Go, avec l'utilisation des tokens, les classements de modèles, les fenêtres de contexte, les dates de sortie, les coûts et les données propres aux modèles.",
  "lab.loadingTitle": "Laboratoire de modèles",
  "lab.loadingDescription": "Lecture de la disponibilité des modèles et de l'utilisation récente d'OpenCode.",
  "lab.notFound": "Aucun modèle ne correspondait à ce laboratoire.",
  "lab.heroPrefix": "Explorez {{count}} modèles {{lab}} utilisés dans OpenCode",
  "lab.heroIncluding": "dont {{models}}",
  "lab.heroSuffix": "Comparez l'utilisation récente des tokens, les fenêtres de contexte, les dates de sortie et les données propres aux modèles.",
  "lab.tokensProcessed": "Tokens traités",
  "lab.pending": "En attente",
  "lab.usageAfterActivity": "L'utilisation apparaît après l'arrivée de l'activité du modèle",
  "lab.latestRelease": "Dernière sortie {{date}}",
  "lab.shareOfUsage": "{{share}} de l'utilisation récente d'OpenCode",
  "lab.usageTitle": "Utilisation des tokens {{lab}}",
  "lab.usageDescription": "Volume quotidien de tokens OpenCode sur les deux derniers mois.",
  "lab.noUsageTitle": "Aucune utilisation pour l'instant",
  "lab.noUsageDescription": "L'utilisation récente des tokens apparaîtra ici dès que ce laboratoire aura de l'activité.",
  "lab.dailyTokenChart": "Graphique quotidien d'utilisation des tokens {{lab}}",
  "lab.dailyTokens": "Tokens quotidiens",
  "lab.tokens": "tokens",
  "lab.modelsTitle": "Modèles {{lab}}",
  "lab.modelsDescription": "Détails du catalogue plus utilisation récente.",
  "lab.recentUsageAndLimits": "Utilisation récente et limites.",
  "lab.usage": "Utilisation",
  "lab.share": "Part",
  "model.title": "Utilisation, coût et rang de {{model}} | OpenCode Data",
  "model.description": "Consultez les données d'utilisation OpenCode Go de {{model}}, avec le volume de tokens, le rang hebdomadaire, la répartition des tokens, les coûts, le taux de cache, les sessions, les répartitions géographiques et les modèles proches.",
  "model.loadingTitle": "Données du modèle",
  "model.loadingDescription": "Lecture des agrégats du modèle.",
  "model.loadingProfile": "Lecture du profil du modèle.",
  "model.noDataTitle": "Aucune donnée de modèle",
  "model.noDataDescription": "Essayez d'ouvrir un modèle depuis le classement.",
  "model.noMatched": "Aucun fait de modèle ni aucune ligne d'utilisation ne correspondait à {{id}}.",
  "model.fallback": "Modèle",
  "model.catalogFallback": "Faits du modèle issus de l'index partagé des modèles. L'utilisation OpenCode Go apparaîtra dès que ce modèle aura de l'activité.",
  "model.unranked": "Non classé dans l'utilisation OpenCode Go de la semaine dernière",
  "model.ranked": "Classé #{{rank}} dans l'utilisation OpenCode Go de la semaine dernière",
  "model.observedVolume": "avec {{share}} du volume 2M observé.",
  "model.weights": "Poids du modèle : {{label}}",
  "model.rank": "Rang 7 j",
  "model.profile": "Profil du modèle",
  "model.listed": "Répertorié",
  "model.noCurrentUsage": "Aucune utilisation OpenCode Go dans la fenêtre de données actuelle.",
  "model.facts": "Faits du modèle",
  "model.context": "Contexte",
  "model.output": "Sortie",
  "model.knowledge": "Connaissances",
  "model.release": "Sortie",
  "model.inputs": "Entrées",
  "model.overviewDescription": "Tokens OpenCode Go récents, utilisateurs uniques et position sur le marché.",
  "model.noSummaryTitle": "Aucun résumé d'utilisation",
  "model.noSummaryDescription": "Ce modèle n'a pas encore de lignes d'utilisation OpenCode Go.",
  "model.tokens": "Tokens",
  "model.uniqueUsers": "Utilisateurs uniques",
  "model.lastTwoMonths": "deux derniers mois",
  "model.sessions": "Sessions",
  "model.completedSessions": "sessions terminées",
  "model.tokenShare": "Part de tokens",
  "model.totalModels": "{{count}} modèles",
  "model.momentum": "Dynamique",
  "model.vsPreviousWindow": "vs fenêtre précédente",
  "model.usageDescription": "Volume quotidien de tokens OpenCode Go sur la fenêtre récente de deux mois.",
  "model.noUsageTitle": "Aucune utilisation",
  "model.noUsageDescription": "Aucune utilisation n'est arrivée dans la fenêtre actuelle.",
  "model.dailyTokenChart": "Graphique quotidien d'utilisation des tokens",
  "model.usersDescription": "Utilisateurs uniques quotidiens d'OpenCode Go sur la fenêtre récente de deux mois.",
  "model.noUsersTitle": "Aucune donnée utilisateur",
  "model.noUsersDescription": "Aucune ligne avec utilisateurs n'est arrivée dans la fenêtre actuelle.",
  "model.dailyUserChart": "Graphique quotidien des utilisateurs uniques",
  "model.efficiencyDescription": "Coût, comportement du cache et forme moyenne des sessions OpenCode Go.",
  "model.noEfficiencyTitle": "Aucune donnée d'efficacité",
  "model.noEfficiencyDescription": "Les données d'efficacité apparaissent après l'arrivée de l'utilisation.",
  "model.totalSpendLabel": "Total spend",
  "model.costInput": "Cost input",
  "model.costOutput": "Cost output",
  "model.averageCostSession": "Average cost / Session",
  "model.averageTokensSession": "Average tokens / session",
  "model.cost": "Coût",
  "model.totalSpend": "dépense totale",
  "model.costPerMillion": "Coût / 1 M",
  "model.inputOutput": "entrée / sortie",
  "model.observedTokens": "tous les tokens observés",
  "model.costSession": "Coût / session",
  "model.average": "moyenne",
  "model.tokensSession": "Tokens / session",
  "model.cacheRatio": "Taux de cache",
  "model.inputTokens": "tokens d'entrée",
  "model.geoDescription": "Tokens du modèle OpenCode Go utilisés par pays.",
  "model.noGeoTitle": "Aucune donnée géographique",
  "model.noGeoDescription": "Aucune ligne géographique OpenCode Go ne correspondait à ce modèle.",
  "model.worldMap": "Carte mondiale de l'utilisation des tokens du modèle par pays",
  "model.peersDescription": "Modèles proches par volume récent de tokens OpenCode Go.",
  "model.noPeersTitle": "Aucun modèle proche",
  "model.noPeersDescription": "Les classements de modèles proches apparaissent après l'arrivée de l'utilisation.",
  "model.noUsageLastWeek": "Aucune utilisation la semaine dernière",
  "model.newThisWeek": "Nouveau cette semaine",
  "model.sameAsPreviousWeek": "Identique à la semaine précédente",
  "model.vsPreviousWeek": "{{change}} vs semaine précédente",
  "model.pdf": "PDF",
  "format.users": "utilisateurs",
  "format.tokens": "tokens"
};
const dict$b = {
  "app.title": "Classifiche di utilizzo dei modelli IA | OpenCode Data",
  "app.description": "Esplora l'utilizzo di OpenCode Go nei modelli IA, inclusi volume di token, classifiche, quota di mercato, prezzi dei token, costo per sessione, rapporto cache e ripartizioni geografiche.",
  "app.unfurlAlt": "Logotipo OpenCode Data su uno sfondo scuro con motivo",
  "nav.dataHome": "Home dati",
  "nav.topModels": "Modelli principali",
  "nav.leaderboard": "Classifica",
  "nav.uniqueUsers": "Utenti unici",
  "nav.sessionCost": "Costo sessione",
  "nav.tokenCost": "Costo token",
  "nav.cacheRatio": "Rapporto cache",
  "nav.marketShare": "Quota di mercato",
  "nav.geoBreakdown": "Ripartizione geografica",
  "nav.overview": "Panoramica",
  "nav.usage": "Utilizzo",
  "nav.users": "Utenti",
  "nav.efficiency": "Efficienza",
  "nav.peers": "Modelli simili",
  "nav.models": "Modelli",
  "header.brandLabel": "Home dati",
  "header.sectionNavLabel": "Sezioni dati",
  "header.githubAria": "Aggiungi una stella a OpenCode su GitHub",
  "header.github": "GitHub",
  "header.tryOpenCode": "Prova OpenCode",
  "header.openNav": "Apri navigazione",
  "header.closeNav": "Chiudi navigazione",
  "theme.groupLabel": "Tema",
  "theme.dark": "Scuro",
  "theme.light": "Chiaro",
  "theme.system": "Sistema",
  "footer.modelData": "Dati modello",
  "footer.legal": "Note legali",
  "footer.connect": "Contatti",
  "footer.newsletter": "Newsletter",
  "footer.newsletterBody": "Scopri per primo le nuove versioni.",
  "footer.language": "Lingua",
  "footer.subscribe": "Iscriviti",
  "footer.terms": "Termini di servizio",
  "footer.privacy": "Informativa sulla privacy",
  "footer.contact": "Contattaci",
  "footer.community": "Community",
  "footer.youtube": "YouTube",
  "footer.homeAria": "Home OpenCode",
  "footer.status": "Tutti i sistemi sono operativi",
  "footer.copyright": "© 2026 Anomaly Innovations Inc.",
  "bridge.learnMore": "SCOPRI DI PIÙ",
  "modal.closeNewsletter": "Chiudi iscrizione alla newsletter",
  "modal.title": "Newsletter OpenCode",
  "modal.body": "Scopri per primo\nle nuove versioni.",
  "modal.email": "Indirizzo email",
  "modal.subscribe": "Iscriviti",
  "modal.subscribing": "Iscrizione in corso...",
  "modal.success": "Iscrizione completata.",
  "modal.error": "Iscrizione non riuscita",
  "product.allUsers": "Tutti gli utenti",
  "product.zen": "Zen",
  "product.go": "Go",
  "range.1D": "1 giorno",
  "range.1W": "1 settimana",
  "range.2W": "2 settimane",
  "range.1M": "1 mese",
  "range.2M": "2 mesi",
  "chart.daily": "Giornaliero",
  "chart.input": "Input",
  "chart.output": "Output",
  "chart.cached": "In cache",
  "chart.uncached": "Non in cache",
  "chart.ratio": "Rapporto",
  "chart.model": "Modello",
  "chart.cacheRatio": "Rapporto cache",
  "chart.costSession": "Costo/sessione",
  "chart.tokensSession": "Token/sessione",
  "chart.costPerSession": "COSTO / SESSIONE",
  "chart.tokensPerSession": "TOKEN / SESSIONE",
  "chart.live": "Live",
  "chart.percent": "percentuale",
  "chart.leaderboardAria": "Classifica token dei modelli",
  "chart.scrollableLeaderboardAria": "Classifica token dei modelli scorrevole",
  "chart.byAuthor": "di {{author}}",
  "home.updated": "Aggiornato",
  "home.noRows": "Ancora nessuna riga",
  "home.justNow": "proprio ora",
  "home.heroCopy": "Scopri quali modelli stanno vincendo nell'uso reale, come cambia il mix e cosa significa per i costi.",
  "home.loadingTitle": "Caricamento dati",
  "home.loadingDescription": "Lettura degli aggregati dei modelli.",
  "home.usageTitle": "Utilizzo",
  "home.topModelsDescription": "Utilizzo dei modelli in OpenCode Go.",
  "home.noUsageTitle": "Nessun dato di utilizzo",
  "home.noUsageDescription": "Nessuna riga modello corrispondeva a questo prodotto e intervallo.",
  "home.noLeaderboardTitle": "Nessun dato di classifica",
  "home.noLeaderboardDescription": "Nessuna riga modello corrispondeva a questo prodotto e intervallo.",
  "home.productFilter": "Filtro prodotto",
  "home.dateRange": "Intervallo date",
  "home.stackedUsageChart": "Grafico di utilizzo impilato dei modelli principali",
  "home.total": "totale",
  "home.modelUsers": "utenti del modello",
  "home.new": "Nuovo",
  "home.uniqueUsersTitle": "Utenti unici",
  "home.uniqueUsersDescription": "Utenti unici giornalieri di OpenCode Go per modello.",
  "home.noUserDataTitle": "Nessun dato utente",
  "home.noUserDataDescription": "Nessuna riga modello con utenti corrispondeva a questa finestra.",
  "home.uniqueUsersChart": "Grafico impilato degli utenti unici per modello",
  "home.marketShareTitle": "Quota di mercato",
  "home.marketShareDescription": "Confronta la quota di token per autore del modello.",
  "home.noMarketTitle": "Nessun dato di mercato",
  "home.noMarketDescription": "Nessuna riga modello corrispondeva a questo intervallo.",
  "home.marketChart": "Quota di mercato per autore del modello",
  "home.noData": "Nessun dato",
  "home.geoTitle": "Ripartizione geografica",
  "home.geoDescription": "Token usati per paese.",
  "home.noGeoTitle": "Nessun dato geografico",
  "home.noGeoDescription": "Nessuna riga geografica corrispondeva a questo intervallo.",
  "home.worldMap": "Mappa mondiale dell'utilizzo dei token per paese",
  "home.geoMapTitle": "Mappa della ripartizione geografica",
  "home.unknown": "Sconosciuto",
  "home.tokenCostTitle": "Costo token",
  "home.tokenCostDescription": "Prezzo per 1 M di token.",
  "home.noTokenCostTitle": "Nessun dato sul costo dei token",
  "home.noTokenCostDescription": "Nessuna riga modello con costi corrispondeva a questo prodotto.",
  "home.cacheRatioTitle": "Rapporto cache",
  "home.cacheRatioDescription": "Quota di token di input serviti dalla cache.",
  "home.noCacheTitle": "Nessun dato sul rapporto cache",
  "home.noCacheDescription": "Nessuna riga modello con token di input corrispondeva a questo prodotto.",
  "home.sessionCostTitle": "Costo sessione",
  "home.sessionCostDescription": "Costo medio per sessione.",
  "home.noSessionCostTitle": "Nessun dato sul costo sessione",
  "home.noSessionCostDescription": "Nessuna riga modello con sessioni corrispondeva a questo prodotto.",
  "home.costSession": "Costo/sessione",
  "lab.title": "Utilizzo e classifiche dei modelli IA {{lab}} | OpenCode Data",
  "lab.description": "Confronta i modelli {{lab}} usati in OpenCode Go, inclusi utilizzo dei token, classifiche dei modelli, finestre di contesto, date di rilascio, costi e dati specifici del modello.",
  "lab.loadingTitle": "Laboratorio modelli",
  "lab.loadingDescription": "Lettura della disponibilità dei modelli e dell'utilizzo recente di OpenCode.",
  "lab.notFound": "Nessun modello corrispondeva a questo laboratorio.",
  "lab.heroPrefix": "Esplora {{count}} modelli {{lab}} usati in OpenCode",
  "lab.heroIncluding": "inclusi {{models}}",
  "lab.heroSuffix": "Confronta l'utilizzo recente dei token, le finestre di contesto, le date di rilascio e i dati specifici del modello.",
  "lab.tokensProcessed": "Token elaborati",
  "lab.pending": "In sospeso",
  "lab.usageAfterActivity": "L'utilizzo appare dopo l'arrivo dell'attività del modello",
  "lab.latestRelease": "Ultima versione {{date}}",
  "lab.shareOfUsage": "{{share}} dell'utilizzo recente di OpenCode",
  "lab.usageTitle": "Utilizzo token {{lab}}",
  "lab.usageDescription": "Volume giornaliero di token OpenCode negli ultimi due mesi.",
  "lab.noUsageTitle": "Ancora nessun utilizzo",
  "lab.noUsageDescription": "L'utilizzo recente dei token apparirà qui quando questo laboratorio avrà attività.",
  "lab.dailyTokenChart": "Grafico giornaliero dell'utilizzo token {{lab}}",
  "lab.dailyTokens": "Token giornalieri",
  "lab.tokens": "token",
  "lab.modelsTitle": "Modelli {{lab}}",
  "lab.modelsDescription": "Dettagli del catalogo più utilizzo recente.",
  "lab.recentUsageAndLimits": "Utilizzo recente e limiti.",
  "lab.usage": "Utilizzo",
  "lab.share": "Quota",
  "model.title": "Utilizzo, costo e posizione di {{model}} | OpenCode Data",
  "model.description": "Visualizza i dati di utilizzo di {{model}} in OpenCode Go, inclusi volume di token, rango settimanale, mix di token, costi, rapporto cache, sessioni, ripartizioni geografiche e modelli simili.",
  "model.loadingTitle": "Dati modello",
  "model.loadingDescription": "Lettura degli aggregati del modello.",
  "model.loadingProfile": "Lettura del profilo del modello.",
  "model.noDataTitle": "Nessun dato modello",
  "model.noDataDescription": "Prova ad aprire un modello dalla classifica.",
  "model.noMatched": "Nessun fatto modello o riga di utilizzo corrispondeva a {{id}}.",
  "model.fallback": "Modello",
  "model.catalogFallback": "Fatti del modello dall'indice condiviso dei modelli. L'utilizzo di OpenCode Go appare quando questo modello ha attività.",
  "model.unranked": "Non classificato nell'utilizzo OpenCode Go della scorsa settimana",
  "model.ranked": "Posizione #{{rank}} nell'utilizzo OpenCode Go della scorsa settimana",
  "model.observedVolume": "con {{share}} del volume 2M osservato.",
  "model.weights": "Pesi del modello: {{label}}",
  "model.rank": "Posizione 7G",
  "model.profile": "Profilo modello",
  "model.listed": "Elencato",
  "model.noCurrentUsage": "Nessun utilizzo di OpenCode Go nella finestra dati attuale.",
  "model.facts": "Fatti del modello",
  "model.context": "Contesto",
  "model.output": "Output",
  "model.knowledge": "Conoscenza",
  "model.release": "Versione",
  "model.inputs": "Input",
  "model.overviewDescription": "Token recenti di OpenCode Go, utenti unici e posizione di mercato.",
  "model.noSummaryTitle": "Nessun riepilogo di utilizzo",
  "model.noSummaryDescription": "Questo modello non ha ancora righe di utilizzo di OpenCode Go.",
  "model.tokens": "Token",
  "model.uniqueUsers": "Utenti unici",
  "model.lastTwoMonths": "ultimi due mesi",
  "model.sessions": "Sessioni",
  "model.completedSessions": "sessioni completate",
  "model.tokenShare": "Quota token",
  "model.totalModels": "{{count}} modelli",
  "model.momentum": "Slancio",
  "model.vsPreviousWindow": "vs finestra precedente",
  "model.usageDescription": "Volume giornaliero di token OpenCode Go nella recente finestra di due mesi.",
  "model.noUsageTitle": "Nessun utilizzo",
  "model.noUsageDescription": "Nessun utilizzo è arrivato nella finestra attuale.",
  "model.dailyTokenChart": "Grafico giornaliero di utilizzo dei token",
  "model.usersDescription": "Utenti unici giornalieri di OpenCode Go nella recente finestra di due mesi.",
  "model.noUsersTitle": "Nessun dato utente",
  "model.noUsersDescription": "Nessuna riga con utenti è arrivata nella finestra attuale.",
  "model.dailyUserChart": "Grafico giornaliero degli utenti unici",
  "model.efficiencyDescription": "Costi, comportamento della cache e forma media della sessione OpenCode Go.",
  "model.noEfficiencyTitle": "Nessun dato di efficienza",
  "model.noEfficiencyDescription": "I dati di efficienza appaiono dopo l'arrivo dell'utilizzo.",
  "model.totalSpendLabel": "Total spend",
  "model.costInput": "Cost input",
  "model.costOutput": "Cost output",
  "model.averageCostSession": "Average cost / Session",
  "model.averageTokensSession": "Average tokens / session",
  "model.cost": "Costo",
  "model.totalSpend": "spesa totale",
  "model.costPerMillion": "Costo / 1 M",
  "model.inputOutput": "input / output",
  "model.observedTokens": "tutti i token osservati",
  "model.costSession": "Costo / sessione",
  "model.average": "media",
  "model.tokensSession": "Token / sessione",
  "model.cacheRatio": "Rapporto cache",
  "model.inputTokens": "token di input",
  "model.geoDescription": "Token del modello OpenCode Go usati per paese.",
  "model.noGeoTitle": "Nessun dato geografico",
  "model.noGeoDescription": "Nessuna riga geografica OpenCode Go corrispondeva a questo modello.",
  "model.worldMap": "Mappa mondiale dell'utilizzo dei token del modello per paese",
  "model.peersDescription": "Modelli vicini per volume recente di token OpenCode Go.",
  "model.noPeersTitle": "Nessun modello simile",
  "model.noPeersDescription": "Le classifiche dei modelli simili appaiono dopo l'arrivo dell'utilizzo.",
  "model.noUsageLastWeek": "Nessun utilizzo la scorsa settimana",
  "model.newThisWeek": "Nuovo questa settimana",
  "model.sameAsPreviousWeek": "Uguale alla settimana precedente",
  "model.vsPreviousWeek": "{{change}} vs settimana precedente",
  "model.pdf": "PDF",
  "format.users": "utenti",
  "format.tokens": "token"
};
const dict$a = {
  "app.title": "AIモデル使用ランキング | OpenCodeデータ",
  "app.description": "OpenCode GoでのAIモデル利用状況を、トークン量、ランキング、マーケットシェア、トークン価格、セッションコスト、キャッシュ比率、地域別内訳まで確認できます。",
  "app.unfurlAlt": "暗いパターン背景上のOpenCode Dataワードマーク",
  "nav.dataHome": "データホーム",
  "nav.topModels": "上位モデル",
  "nav.leaderboard": "ランキング",
  "nav.uniqueUsers": "ユニークユーザー",
  "nav.sessionCost": "セッションコスト",
  "nav.tokenCost": "トークンコスト",
  "nav.cacheRatio": "キャッシュ比率",
  "nav.marketShare": "マーケットシェア",
  "nav.geoBreakdown": "地域別内訳",
  "nav.overview": "概要",
  "nav.usage": "使用量",
  "nav.users": "ユーザー",
  "nav.efficiency": "効率",
  "nav.peers": "類似モデル",
  "nav.models": "モデル",
  "header.brandLabel": "データホーム",
  "header.sectionNavLabel": "データセクション",
  "header.githubAria": "GitHubでOpenCodeにスターを付ける",
  "header.github": "GitHub",
  "header.tryOpenCode": "OpenCodeを試す",
  "header.openNav": "ナビゲーションを開く",
  "header.closeNav": "ナビゲーションを閉じる",
  "theme.groupLabel": "テーマ",
  "theme.dark": "ダーク",
  "theme.light": "ライト",
  "theme.system": "システム",
  "footer.modelData": "モデルデータ",
  "footer.legal": "法務",
  "footer.connect": "つながる",
  "footer.newsletter": "ニュースレター",
  "footer.newsletterBody": "新しいリリース情報をいち早く受け取れます。",
  "footer.language": "言語",
  "footer.subscribe": "登録",
  "footer.terms": "利用規約",
  "footer.privacy": "プライバシーポリシー",
  "footer.contact": "お問い合わせ",
  "footer.community": "コミュニティ",
  "footer.youtube": "YouTube",
  "footer.homeAria": "OpenCodeホーム",
  "footer.status": "すべてのシステムは正常稼働中",
  "footer.copyright": "© 2026 Anomaly Innovations Inc.",
  "bridge.learnMore": "詳しく見る",
  "modal.closeNewsletter": "ニュースレター登録を閉じる",
  "modal.title": "OpenCodeニュースレター",
  "modal.body": "新しいリリース情報を\nいち早く受け取れます。",
  "modal.email": "メールアドレス",
  "modal.subscribe": "登録",
  "modal.subscribing": "登録中...",
  "modal.success": "登録しました。",
  "modal.error": "登録に失敗しました",
  "product.allUsers": "すべてのユーザー",
  "product.zen": "Zen",
  "product.go": "Go",
  "range.1D": "1日",
  "range.1W": "1週間",
  "range.2W": "2週間",
  "range.1M": "1か月",
  "range.2M": "2か月",
  "chart.daily": "日次",
  "chart.input": "入力",
  "chart.output": "出力",
  "chart.cached": "キャッシュ済み",
  "chart.uncached": "未キャッシュ",
  "chart.ratio": "比率",
  "chart.model": "モデル",
  "chart.cacheRatio": "キャッシュ比率",
  "chart.costSession": "コスト/セッション",
  "chart.tokensSession": "トークン/セッション",
  "chart.costPerSession": "コスト / セッション",
  "chart.tokensPerSession": "トークン / セッション",
  "chart.live": "ライブ",
  "chart.percent": "パーセント",
  "chart.leaderboardAria": "モデルのトークンランキング",
  "chart.scrollableLeaderboardAria": "スクロール可能なモデルのトークンランキング",
  "chart.byAuthor": "提供元: {{author}}",
  "home.updated": "更新済み",
  "home.noRows": "まだ行がありません",
  "home.justNow": "たった今",
  "home.heroCopy": "実際の利用でどのモデルが伸びているか、利用構成がどう変化しているか、それがコストに何を意味するかを確認できます。",
  "home.loadingTitle": "データを読み込み中",
  "home.loadingDescription": "モデル集計を読み込んでいます。",
  "home.usageTitle": "使用量",
  "home.topModelsDescription": "OpenCode Goにおけるモデルの使用状況。",
  "home.noUsageTitle": "使用データがありません",
  "home.noUsageDescription": "このプロダクトと期間に一致するモデル行はありません。",
  "home.noLeaderboardTitle": "ランキングデータがありません",
  "home.noLeaderboardDescription": "このプロダクトと期間に一致するモデル行はありません。",
  "home.productFilter": "プロダクトフィルター",
  "home.dateRange": "日付範囲",
  "home.stackedUsageChart": "上位モデル使用量の積み上げグラフ",
  "home.total": "合計",
  "home.modelUsers": "モデルユーザー",
  "home.new": "新規",
  "home.uniqueUsersTitle": "ユニークユーザー",
  "home.uniqueUsersDescription": "モデル別のOpenCode Go日次ユニークユーザー。",
  "home.noUserDataTitle": "ユーザーデータがありません",
  "home.noUserDataDescription": "この期間に一致するユーザー付きモデル行はありません。",
  "home.uniqueUsersChart": "モデル別ユニークユーザーの積み上げグラフ",
  "home.marketShareTitle": "マーケットシェア",
  "home.marketShareDescription": "モデル作者別にトークンシェアを比較します。",
  "home.noMarketTitle": "マーケットデータがありません",
  "home.noMarketDescription": "この期間に一致するモデル行はありません。",
  "home.marketChart": "モデル作者別マーケットシェア",
  "home.noData": "データなし",
  "home.geoTitle": "地域別内訳",
  "home.geoDescription": "国別のトークン使用量。",
  "home.noGeoTitle": "地域データがありません",
  "home.noGeoDescription": "この期間に一致する地域行はありません。",
  "home.worldMap": "国別トークン使用量の世界地図",
  "home.geoMapTitle": "地域別内訳マップ",
  "home.unknown": "不明",
  "home.tokenCostTitle": "トークンコスト",
  "home.tokenCostDescription": "100万トークンあたりの価格。",
  "home.noTokenCostTitle": "トークンコストデータがありません",
  "home.noTokenCostDescription": "このプロダクトに一致するコスト付きモデル行はありません。",
  "home.cacheRatioTitle": "キャッシュ比率",
  "home.cacheRatioDescription": "キャッシュから提供された入力トークンの割合。",
  "home.noCacheTitle": "キャッシュ比率データがありません",
  "home.noCacheDescription": "このプロダクトに一致する入力トークン付きモデル行はありません。",
  "home.sessionCostTitle": "セッションコスト",
  "home.sessionCostDescription": "セッションあたりの平均コスト。",
  "home.noSessionCostTitle": "セッションコストデータがありません",
  "home.noSessionCostDescription": "このプロダクトに一致するセッション付きモデル行はありません。",
  "home.costSession": "コスト/セッション",
  "lab.title": "{{lab}} AIモデル使用量とランキング | OpenCodeデータ",
  "lab.description": "OpenCode Goで使用されている{{lab}}モデルを、トークン使用量、モデルランキング、コンテキストウィンドウ、リリース日、コスト、モデル別データで比較できます。",
  "lab.loadingTitle": "モデルラボ",
  "lab.loadingDescription": "モデルの利用可否と最近のOpenCode使用状況を読み込んでいます。",
  "lab.notFound": "このラボに一致するモデルはありません。",
  "lab.heroPrefix": "OpenCodeで使用されている{{count}}件の{{lab}}モデルを確認",
  "lab.heroIncluding": "{{models}}など",
  "lab.heroSuffix": "最近のトークン使用量、コンテキストウィンドウ、リリース日、モデル別データを比較できます。",
  "lab.tokensProcessed": "処理済みトークン",
  "lab.pending": "保留中",
  "lab.usageAfterActivity": "モデルのアクティビティが届くと使用量が表示されます",
  "lab.latestRelease": "最新リリース {{date}}",
  "lab.shareOfUsage": "最近のOpenCode使用量の{{share}}",
  "lab.usageTitle": "{{lab}}のトークン使用量",
  "lab.usageDescription": "過去2か月の日次OpenCodeトークン量。",
  "lab.noUsageTitle": "まだ使用量がありません",
  "lab.noUsageDescription": "このラボにアクティビティが発生すると、最近のトークン使用量がここに表示されます。",
  "lab.dailyTokenChart": "{{lab}}の日次トークン使用量グラフ",
  "lab.dailyTokens": "日次トークン",
  "lab.tokens": "トークン",
  "lab.modelsTitle": "{{lab}}モデル",
  "lab.modelsDescription": "カタログ詳細と最近の使用量。",
  "lab.recentUsageAndLimits": "最近の使用量と制限。",
  "lab.usage": "使用量",
  "lab.share": "シェア",
  "model.title": "{{model}}の使用量、コスト、ランク | OpenCodeデータ",
  "model.description": "{{model}}のOpenCode Go使用データを、トークン量、週間ランク、トークン構成、コスト、キャッシュ比率、セッション、地域別内訳、類似モデルまで確認できます。",
  "model.loadingTitle": "モデルデータ",
  "model.loadingDescription": "モデル集計を読み込んでいます。",
  "model.loadingProfile": "モデルプロフィールを読み込んでいます。",
  "model.noDataTitle": "モデルデータがありません",
  "model.noDataDescription": "ランキングからモデルを開いてみてください。",
  "model.noMatched": "{{id}}に一致するモデル情報または使用行はありません。",
  "model.fallback": "モデル",
  "model.catalogFallback": "共有モデルインデックスのモデル情報です。このモデルにアクティビティが発生するとOpenCode Go使用量が表示されます。",
  "model.unranked": "先週のOpenCode Go使用量では未ランク",
  "model.ranked": "先週のOpenCode Go使用量で#{{rank}}位",
  "model.observedVolume": "観測された2M量の{{share}}。",
  "model.weights": "モデル重み: {{label}}",
  "model.rank": "7日ランク",
  "model.profile": "モデルプロフィール",
  "model.listed": "掲載日",
  "model.noCurrentUsage": "現在のデータ期間にはOpenCode Go使用量がありません。",
  "model.facts": "モデル情報",
  "model.context": "コンテキスト",
  "model.output": "出力",
  "model.knowledge": "知識",
  "model.release": "リリース",
  "model.inputs": "入力",
  "model.overviewDescription": "最近のOpenCode Goトークン、ユニークユーザー、市場での位置。",
  "model.noSummaryTitle": "使用概要がありません",
  "model.noSummaryDescription": "このモデルにはまだOpenCode Goの使用行がありません。",
  "model.tokens": "トークン",
  "model.uniqueUsers": "ユニークユーザー",
  "model.lastTwoMonths": "過去2か月",
  "model.sessions": "セッション",
  "model.completedSessions": "完了セッション",
  "model.tokenShare": "トークンシェア",
  "model.totalModels": "{{count}}件のモデル",
  "model.momentum": "勢い",
  "model.vsPreviousWindow": "前の期間比",
  "model.usageDescription": "直近2か月の期間におけるOpenCode Goの日次トークン量。",
  "model.noUsageTitle": "使用量がありません",
  "model.noUsageDescription": "現在の期間には使用量がありません。",
  "model.dailyTokenChart": "日次トークン使用量グラフ",
  "model.usersDescription": "直近2か月の期間におけるOpenCode Goの日次ユニークユーザー。",
  "model.noUsersTitle": "ユーザーデータがありません",
  "model.noUsersDescription": "現在の期間にはユーザー付き行がありません。",
  "model.dailyUserChart": "日次ユニークユーザーグラフ",
  "model.efficiencyDescription": "コスト、キャッシュ動作、平均的なOpenCode Goセッションの形。",
  "model.noEfficiencyTitle": "効率データがありません",
  "model.noEfficiencyDescription": "使用量が届くと効率データが表示されます。",
  "model.totalSpendLabel": "Total spend",
  "model.costInput": "Cost input",
  "model.costOutput": "Cost output",
  "model.averageCostSession": "Average cost / Session",
  "model.averageTokensSession": "Average tokens / session",
  "model.cost": "コスト",
  "model.totalSpend": "総支出",
  "model.costPerMillion": "100万あたりのコスト",
  "model.inputOutput": "入力 / 出力",
  "model.observedTokens": "観測された全トークン",
  "model.costSession": "コスト / セッション",
  "model.average": "平均",
  "model.tokensSession": "トークン / セッション",
  "model.cacheRatio": "キャッシュ比率",
  "model.inputTokens": "入力トークン",
  "model.geoDescription": "国別のOpenCode Goモデルのトークン使用量。",
  "model.noGeoTitle": "地域データがありません",
  "model.noGeoDescription": "このモデルに一致するOpenCode Go地域行はありません。",
  "model.worldMap": "国別モデル別トークン使用量の世界地図",
  "model.peersDescription": "最近のOpenCode Goトークン量が近いモデル。",
  "model.noPeersTitle": "類似モデルがありません",
  "model.noPeersDescription": "使用量が届くと類似モデルのランキングが表示されます。",
  "model.noUsageLastWeek": "先週の使用量なし",
  "model.newThisWeek": "今週新規",
  "model.sameAsPreviousWeek": "前週と同じ",
  "model.vsPreviousWeek": "前週比 {{change}}",
  "model.pdf": "PDF",
  "format.users": "ユーザー",
  "format.tokens": "トークン"
};
const dict$9 = {
  "app.title": "AI 모델 사용 순위 | OpenCode 데이터",
  "app.description": "OpenCode Go에서 AI 모델이 어떻게 사용되는지 토큰 볼륨, 순위, 시장 점유율, 토큰 가격, 세션 비용, 캐시 비율, 지역별 분포까지 살펴보세요.",
  "app.unfurlAlt": "어두운 패턴 배경 위의 OpenCode Data 워드마크",
  "nav.dataHome": "데이터 홈",
  "nav.topModels": "상위 모델",
  "nav.leaderboard": "리더보드",
  "nav.uniqueUsers": "순 사용자",
  "nav.sessionCost": "세션 비용",
  "nav.tokenCost": "토큰 비용",
  "nav.cacheRatio": "캐시 비율",
  "nav.marketShare": "시장 점유율",
  "nav.geoBreakdown": "지역별 분포",
  "nav.overview": "개요",
  "nav.usage": "사용량",
  "nav.users": "사용자",
  "nav.efficiency": "효율",
  "nav.peers": "비슷한 모델",
  "nav.models": "모델",
  "header.brandLabel": "데이터 홈",
  "header.sectionNavLabel": "데이터 섹션",
  "header.githubAria": "GitHub에서 OpenCode에 스타 주기",
  "header.github": "GitHub",
  "header.tryOpenCode": "OpenCode 사용해 보기",
  "header.openNav": "내비게이션 열기",
  "header.closeNav": "내비게이션 닫기",
  "theme.groupLabel": "테마",
  "theme.dark": "다크",
  "theme.light": "라이트",
  "theme.system": "시스템",
  "footer.modelData": "모델 데이터",
  "footer.legal": "법률",
  "footer.connect": "연결",
  "footer.newsletter": "뉴스레터",
  "footer.newsletterBody": "새 릴리스를 가장 먼저 받아보세요.",
  "footer.language": "언어",
  "footer.subscribe": "구독",
  "footer.terms": "서비스 약관",
  "footer.privacy": "개인정보처리방침",
  "footer.contact": "문의하기",
  "footer.community": "커뮤니티",
  "footer.youtube": "YouTube",
  "footer.homeAria": "OpenCode 홈",
  "footer.status": "모든 시스템 정상 운영 중",
  "footer.copyright": "© 2026 Anomaly Innovations Inc.",
  "bridge.learnMore": "더 알아보기",
  "modal.closeNewsletter": "뉴스레터 가입 닫기",
  "modal.title": "OpenCode 뉴스레터",
  "modal.body": "새 릴리스를\n가장 먼저 받아보세요.",
  "modal.email": "이메일 주소",
  "modal.subscribe": "구독",
  "modal.subscribing": "구독 중...",
  "modal.success": "구독되었습니다.",
  "modal.error": "구독에 실패했습니다",
  "product.allUsers": "모든 사용자",
  "product.zen": "Zen",
  "product.go": "Go",
  "range.1D": "1일",
  "range.1W": "1주",
  "range.2W": "2주",
  "range.1M": "1개월",
  "range.2M": "2개월",
  "chart.daily": "일간",
  "chart.input": "입력",
  "chart.output": "출력",
  "chart.cached": "캐시됨",
  "chart.uncached": "캐시 안 됨",
  "chart.ratio": "비율",
  "chart.model": "모델",
  "chart.cacheRatio": "캐시 비율",
  "chart.costSession": "비용/세션",
  "chart.tokensSession": "토큰/세션",
  "chart.costPerSession": "비용 / 세션",
  "chart.tokensPerSession": "토큰 / 세션",
  "chart.live": "실시간",
  "chart.percent": "퍼센트",
  "chart.leaderboardAria": "모델 토큰 리더보드",
  "chart.scrollableLeaderboardAria": "스크롤 가능한 모델 토큰 리더보드",
  "chart.byAuthor": "{{author}} 제공",
  "home.updated": "업데이트됨",
  "home.noRows": "아직 행이 없습니다",
  "home.justNow": "방금 전",
  "home.heroCopy": "실제 사용량에서 어떤 모델이 앞서고 있는지, 사용 구성이 어떻게 바뀌는지, 그것이 비용에 어떤 의미인지 확인하세요.",
  "home.loadingTitle": "데이터 로딩 중",
  "home.loadingDescription": "모델 집계를 읽는 중입니다.",
  "home.usageTitle": "사용량",
  "home.topModelsDescription": "OpenCode Go 전반의 모델 사용량입니다.",
  "home.noUsageTitle": "사용 데이터 없음",
  "home.noUsageDescription": "이 제품과 범위에 맞는 모델 행이 없습니다.",
  "home.noLeaderboardTitle": "리더보드 데이터 없음",
  "home.noLeaderboardDescription": "이 제품과 범위에 맞는 모델 행이 없습니다.",
  "home.productFilter": "제품 필터",
  "home.dateRange": "날짜 범위",
  "home.stackedUsageChart": "상위 모델 사용량 누적 차트",
  "home.total": "합계",
  "home.modelUsers": "모델 사용자",
  "home.new": "신규",
  "home.uniqueUsersTitle": "순 사용자",
  "home.uniqueUsersDescription": "모델별 일간 OpenCode Go 순 사용자입니다.",
  "home.noUserDataTitle": "사용자 데이터 없음",
  "home.noUserDataDescription": "이 기간에 맞는 사용자 포함 모델 행이 없습니다.",
  "home.uniqueUsersChart": "모델별 순 사용자 누적 차트",
  "home.marketShareTitle": "시장 점유율",
  "home.marketShareDescription": "모델 작성자별 토큰 점유율을 비교합니다.",
  "home.noMarketTitle": "시장 데이터 없음",
  "home.noMarketDescription": "이 범위에 맞는 모델 행이 없습니다.",
  "home.marketChart": "모델 작성자별 시장 점유율",
  "home.noData": "데이터 없음",
  "home.geoTitle": "지역별 분포",
  "home.geoDescription": "국가별 사용 토큰입니다.",
  "home.noGeoTitle": "지역 데이터 없음",
  "home.noGeoDescription": "이 범위에 맞는 지역 행이 없습니다.",
  "home.worldMap": "국가별 토큰 사용량 세계 지도",
  "home.geoMapTitle": "지역별 분포 지도",
  "home.unknown": "알 수 없음",
  "home.tokenCostTitle": "토큰 비용",
  "home.tokenCostDescription": "100만 토큰당 가격입니다.",
  "home.noTokenCostTitle": "토큰 비용 데이터 없음",
  "home.noTokenCostDescription": "이 제품에 맞는 비용 포함 모델 행이 없습니다.",
  "home.cacheRatioTitle": "캐시 비율",
  "home.cacheRatioDescription": "캐시에서 제공된 입력 토큰의 비율입니다.",
  "home.noCacheTitle": "캐시 비율 데이터 없음",
  "home.noCacheDescription": "이 제품에 맞는 입력 토큰 포함 모델 행이 없습니다.",
  "home.sessionCostTitle": "세션 비용",
  "home.sessionCostDescription": "세션당 평균 비용입니다.",
  "home.noSessionCostTitle": "세션 비용 데이터 없음",
  "home.noSessionCostDescription": "이 제품에 맞는 세션 포함 모델 행이 없습니다.",
  "home.costSession": "비용/세션",
  "lab.title": "{{lab}} AI 모델 사용량 및 순위 | OpenCode 데이터",
  "lab.description": "OpenCode Go에서 사용되는 {{lab}} 모델을 토큰 사용량, 모델 순위, 컨텍스트 창, 출시일, 비용, 모델별 데이터까지 비교하세요.",
  "lab.loadingTitle": "모델 랩",
  "lab.loadingDescription": "모델 가용성과 최근 OpenCode 사용량을 읽는 중입니다.",
  "lab.notFound": "이 랩과 일치하는 모델이 없습니다.",
  "lab.heroPrefix": "OpenCode에서 사용된 {{count}}개의 {{lab}} 모델 살펴보기",
  "lab.heroIncluding": "{{models}} 포함",
  "lab.heroSuffix": "최근 토큰 사용량, 컨텍스트 창, 출시일, 모델별 데이터를 비교하세요.",
  "lab.tokensProcessed": "처리된 토큰",
  "lab.pending": "대기 중",
  "lab.usageAfterActivity": "모델 활동이 들어오면 사용량이 표시됩니다",
  "lab.latestRelease": "최신 출시 {{date}}",
  "lab.shareOfUsage": "최근 OpenCode 사용량의 {{share}}",
  "lab.usageTitle": "{{lab}} 토큰 사용량",
  "lab.usageDescription": "지난 두 달 동안의 일간 OpenCode 토큰 볼륨입니다.",
  "lab.noUsageTitle": "아직 사용량 없음",
  "lab.noUsageDescription": "이 랩에 활동이 생기면 최근 토큰 사용량이 여기에 표시됩니다.",
  "lab.dailyTokenChart": "{{lab}} 일간 토큰 사용량 차트",
  "lab.dailyTokens": "일간 토큰",
  "lab.tokens": "토큰",
  "lab.modelsTitle": "{{lab}} 모델",
  "lab.modelsDescription": "카탈로그 세부 정보와 최근 사용량입니다.",
  "lab.recentUsageAndLimits": "최근 사용량과 한도입니다.",
  "lab.usage": "사용량",
  "lab.share": "점유율",
  "model.title": "{{model}} 사용량, 비용 및 순위 | OpenCode 데이터",
  "model.description": "{{model}}의 OpenCode Go 사용 데이터를 토큰 볼륨, 주간 순위, 토큰 구성, 비용, 캐시 비율, 세션, 지역별 분포, 비슷한 모델까지 확인하세요.",
  "model.loadingTitle": "모델 데이터",
  "model.loadingDescription": "모델 집계를 읽는 중입니다.",
  "model.loadingProfile": "모델 프로필을 읽는 중입니다.",
  "model.noDataTitle": "모델 데이터 없음",
  "model.noDataDescription": "리더보드에서 모델을 열어보세요.",
  "model.noMatched": "{{id}}와 일치하는 모델 정보나 사용 행이 없습니다.",
  "model.fallback": "모델",
  "model.catalogFallback": "공유 모델 인덱스의 모델 정보입니다. 이 모델에 활동이 생기면 OpenCode Go 사용량이 표시됩니다.",
  "model.unranked": "지난주 OpenCode Go 사용량에서 순위 없음",
  "model.ranked": "지난주 OpenCode Go 사용량에서 #{{rank}}위",
  "model.observedVolume": "관측된 2M 볼륨의 {{share}}.",
  "model.weights": "모델 가중치: {{label}}",
  "model.rank": "7일 순위",
  "model.profile": "모델 프로필",
  "model.listed": "등록됨",
  "model.noCurrentUsage": "현재 데이터 기간에는 OpenCode Go 사용량이 없습니다.",
  "model.facts": "모델 정보",
  "model.context": "컨텍스트",
  "model.output": "출력",
  "model.knowledge": "지식",
  "model.release": "출시",
  "model.inputs": "입력",
  "model.overviewDescription": "최근 OpenCode Go 토큰, 순 사용자, 시장 위치입니다.",
  "model.noSummaryTitle": "사용 요약 없음",
  "model.noSummaryDescription": "이 모델에는 아직 OpenCode Go 사용 행이 없습니다.",
  "model.tokens": "토큰",
  "model.uniqueUsers": "순 사용자",
  "model.lastTwoMonths": "지난 두 달",
  "model.sessions": "세션",
  "model.completedSessions": "완료된 세션",
  "model.tokenShare": "토큰 점유율",
  "model.totalModels": "{{count}}개 모델",
  "model.momentum": "모멘텀",
  "model.vsPreviousWindow": "이전 기간 대비",
  "model.usageDescription": "최근 두 달 기간의 일간 OpenCode Go 토큰 볼륨입니다.",
  "model.noUsageTitle": "사용량 없음",
  "model.noUsageDescription": "현재 기간에는 사용량이 없습니다.",
  "model.dailyTokenChart": "일간 토큰 사용량 차트",
  "model.usersDescription": "최근 두 달 기간의 일간 OpenCode Go 순 사용자입니다.",
  "model.noUsersTitle": "사용자 데이터 없음",
  "model.noUsersDescription": "현재 기간에는 사용자 포함 행이 없습니다.",
  "model.dailyUserChart": "일간 순 사용자 차트",
  "model.efficiencyDescription": "비용, 캐시 동작, 평균 OpenCode Go 세션 형태입니다.",
  "model.noEfficiencyTitle": "효율 데이터 없음",
  "model.noEfficiencyDescription": "사용량이 들어오면 효율 데이터가 표시됩니다.",
  "model.totalSpendLabel": "Total spend",
  "model.costInput": "Cost input",
  "model.costOutput": "Cost output",
  "model.averageCostSession": "Average cost / Session",
  "model.averageTokensSession": "Average tokens / session",
  "model.cost": "비용",
  "model.totalSpend": "총 지출",
  "model.costPerMillion": "100만당 비용",
  "model.inputOutput": "입력 / 출력",
  "model.observedTokens": "관측된 전체 토큰",
  "model.costSession": "비용 / 세션",
  "model.average": "평균",
  "model.tokensSession": "토큰 / 세션",
  "model.cacheRatio": "캐시 비율",
  "model.inputTokens": "입력 토큰",
  "model.geoDescription": "국가별 OpenCode Go 모델 토큰 사용량입니다.",
  "model.noGeoTitle": "지역 데이터 없음",
  "model.noGeoDescription": "이 모델과 일치하는 OpenCode Go 지역 행이 없습니다.",
  "model.worldMap": "국가별 모델 토큰 사용량 세계 지도",
  "model.peersDescription": "최근 OpenCode Go 토큰 볼륨이 가까운 모델입니다.",
  "model.noPeersTitle": "비슷한 모델 없음",
  "model.noPeersDescription": "사용량이 들어오면 비슷한 모델 순위가 표시됩니다.",
  "model.noUsageLastWeek": "지난주 사용량 없음",
  "model.newThisWeek": "이번 주 신규",
  "model.sameAsPreviousWeek": "지난주와 동일",
  "model.vsPreviousWeek": "지난주 대비 {{change}}",
  "model.pdf": "PDF",
  "format.users": "사용자",
  "format.tokens": "토큰"
};
const dict$8 = {
  "app.title": "Rangeringer for bruk av AI-modeller | OpenCode Data",
  "app.description": "Utforsk bruk av OpenCode Go på tvers av AI-modeller, inkludert tokenvolum, rangeringer, markedsandel, tokenpriser, øktkostnad, cacheandel og geografiske fordelinger.",
  "app.unfurlAlt": "OpenCode Data-ordmerke på en mørk mønstret bakgrunn",
  "nav.dataHome": "Dataforside",
  "nav.topModels": "Toppmodeller",
  "nav.leaderboard": "Rangering",
  "nav.uniqueUsers": "Unike brukere",
  "nav.sessionCost": "Øktkostnad",
  "nav.tokenCost": "Tokenkostnad",
  "nav.cacheRatio": "Cacheandel",
  "nav.marketShare": "Markedsandel",
  "nav.geoBreakdown": "Geografisk fordeling",
  "nav.overview": "Oversikt",
  "nav.usage": "Bruk",
  "nav.users": "Brukere",
  "nav.efficiency": "Effektivitet",
  "nav.peers": "Lignende modeller",
  "nav.models": "Modeller",
  "header.brandLabel": "Dataforside",
  "header.sectionNavLabel": "Dataseksjoner",
  "header.githubAria": "Gi OpenCode en stjerne på GitHub",
  "header.github": "GitHub",
  "header.tryOpenCode": "Prøv OpenCode",
  "header.openNav": "Åpne navigasjon",
  "header.closeNav": "Lukk navigasjon",
  "theme.groupLabel": "Tema",
  "theme.dark": "Mørkt",
  "theme.light": "Lyst",
  "theme.system": "System",
  "footer.modelData": "Modelldata",
  "footer.legal": "Juridisk",
  "footer.connect": "Kontakt",
  "footer.newsletter": "Nyhetsbrev",
  "footer.newsletterBody": "Vær først ute med å høre om nye utgivelser.",
  "footer.language": "Språk",
  "footer.subscribe": "Abonner",
  "footer.terms": "Tjenestevilkår",
  "footer.privacy": "Personvernerklæring",
  "footer.contact": "Kontakt oss",
  "footer.community": "Fellesskap",
  "footer.youtube": "YouTube",
  "footer.homeAria": "OpenCode-forside",
  "footer.status": "Alle systemer er operative",
  "footer.copyright": "© 2026 Anomaly Innovations Inc.",
  "bridge.learnMore": "LES MER",
  "modal.closeNewsletter": "Lukk påmelding til nyhetsbrev",
  "modal.title": "OpenCode-nyhetsbrev",
  "modal.body": "Vær først ute med å høre\nom nye utgivelser.",
  "modal.email": "E-postadresse",
  "modal.subscribe": "Abonner",
  "modal.subscribing": "Abonnerer...",
  "modal.success": "Du er abonnert.",
  "modal.error": "Kunne ikke abonnere",
  "product.allUsers": "Alle brukere",
  "product.zen": "Zen",
  "product.go": "Go",
  "range.1D": "1 dag",
  "range.1W": "1 uke",
  "range.2W": "2 uker",
  "range.1M": "1 måned",
  "range.2M": "2 måneder",
  "chart.daily": "Daglig",
  "chart.input": "Inndata",
  "chart.output": "Utdata",
  "chart.cached": "Bufret",
  "chart.uncached": "Ikke bufret",
  "chart.ratio": "Forhold",
  "chart.model": "Modell",
  "chart.cacheRatio": "Cacheandel",
  "chart.costSession": "Kostnad/økt",
  "chart.tokensSession": "Tokens/økt",
  "chart.costPerSession": "KOSTNAD / ØKT",
  "chart.tokensPerSession": "TOKENS / ØKT",
  "chart.live": "Direkte",
  "chart.percent": "prosent",
  "chart.leaderboardAria": "Rangering av modelltokens",
  "chart.scrollableLeaderboardAria": "Rullbar rangering av modelltokens",
  "chart.byAuthor": "av {{author}}",
  "home.updated": "Oppdatert",
  "home.noRows": "Ingen rader ennå",
  "home.justNow": "akkurat nå",
  "home.heroCopy": "Se hvilke modeller som vinner reell bruk, hvordan miksen endrer seg, og hva det betyr for kostnadene.",
  "home.loadingTitle": "Laster data",
  "home.loadingDescription": "Leser modellaggregater.",
  "home.usageTitle": "Bruk",
  "home.topModelsDescription": "Bruk av modeller på tvers av OpenCode Go.",
  "home.noUsageTitle": "Ingen bruksdata",
  "home.noUsageDescription": "Ingen modellrader matchet dette produktet og intervallet.",
  "home.noLeaderboardTitle": "Ingen rangeringsdata",
  "home.noLeaderboardDescription": "Ingen modellrader matchet dette produktet og intervallet.",
  "home.productFilter": "Produktfilter",
  "home.dateRange": "Datoområde",
  "home.stackedUsageChart": "Stablet bruksdiagram for toppmodeller",
  "home.total": "totalt",
  "home.modelUsers": "modellbrukere",
  "home.new": "Ny",
  "home.uniqueUsersTitle": "Unike brukere",
  "home.uniqueUsersDescription": "Daglige unike OpenCode Go-brukere etter modell.",
  "home.noUserDataTitle": "Ingen brukerdata",
  "home.noUserDataDescription": "Ingen modellrader med brukere matchet dette vinduet.",
  "home.uniqueUsersChart": "Stablet diagram over unike brukere etter modell",
  "home.marketShareTitle": "Markedsandel",
  "home.marketShareDescription": "Sammenlign tokenandel etter modellforfatter.",
  "home.noMarketTitle": "Ingen markedsdata",
  "home.noMarketDescription": "Ingen modellrader matchet dette intervallet.",
  "home.marketChart": "Markedsandel etter modellforfatter",
  "home.noData": "Ingen data",
  "home.geoTitle": "Geografisk fordeling",
  "home.geoDescription": "Tokens brukt etter land.",
  "home.noGeoTitle": "Ingen geodata",
  "home.noGeoDescription": "Ingen georader matchet dette intervallet.",
  "home.worldMap": "Verdenskart over tokenbruk etter land",
  "home.geoMapTitle": "Kart over geografisk fordeling",
  "home.unknown": "Ukjent",
  "home.tokenCostTitle": "Tokenkostnad",
  "home.tokenCostDescription": "Pris per 1 mill. tokens.",
  "home.noTokenCostTitle": "Ingen tokenkostnadsdata",
  "home.noTokenCostDescription": "Ingen modellrader med kostnader matchet dette produktet.",
  "home.cacheRatioTitle": "Cacheandel",
  "home.cacheRatioDescription": "Andel inndata-tokens levert fra cache.",
  "home.noCacheTitle": "Ingen cacheandelsdata",
  "home.noCacheDescription": "Ingen modellrader med inndata-tokens matchet dette produktet.",
  "home.sessionCostTitle": "Øktkostnad",
  "home.sessionCostDescription": "Gjennomsnittlig kostnad per økt.",
  "home.noSessionCostTitle": "Ingen øktkostnadsdata",
  "home.noSessionCostDescription": "Ingen modellrader med økter matchet dette produktet.",
  "home.costSession": "Kostnad/økt",
  "lab.title": "{{lab}} AI-modellbruk og rangeringer | OpenCode Data",
  "lab.description": "Sammenlign {{lab}}-modeller brukt i OpenCode Go, inkludert tokenbruk, modellrangeringer, kontekstvinduer, utgivelsesdatoer, kostnader og modellspesifikke data.",
  "lab.loadingTitle": "Modellab",
  "lab.loadingDescription": "Leser modelltilgjengelighet og nylig OpenCode-bruk.",
  "lab.notFound": "Ingen modeller matchet dette laben.",
  "lab.heroPrefix": "Utforsk {{count}} {{lab}}-modeller brukt i OpenCode",
  "lab.heroIncluding": "inkludert {{models}}",
  "lab.heroSuffix": "Sammenlign nylig tokenbruk, kontekstvinduer, utgivelsesdatoer og modellspesifikke data.",
  "lab.tokensProcessed": "Behandlede tokens",
  "lab.pending": "Venter",
  "lab.usageAfterActivity": "Bruk vises etter at modellaktivitet lander",
  "lab.latestRelease": "Siste utgivelse {{date}}",
  "lab.shareOfUsage": "{{share}} av nylig OpenCode-bruk",
  "lab.usageTitle": "{{lab}} tokenbruk",
  "lab.usageDescription": "Daglig OpenCode-tokenvolum over de siste to månedene.",
  "lab.noUsageTitle": "Ingen bruk ennå",
  "lab.noUsageDescription": "Nylig tokenbruk vises her når denne laben har aktivitet.",
  "lab.dailyTokenChart": "Daglig diagram over {{lab}} tokenbruk",
  "lab.dailyTokens": "Daglige tokens",
  "lab.tokens": "tokens",
  "lab.modelsTitle": "{{lab}}-modeller",
  "lab.modelsDescription": "Katalogdetaljer pluss nylig bruk.",
  "lab.recentUsageAndLimits": "Nylig bruk og grenser.",
  "lab.usage": "Bruk",
  "lab.share": "Andel",
  "model.title": "{{model}} bruk, kostnad og rangering | OpenCode Data",
  "model.description": "Se OpenCode Go-bruksdata for {{model}}, inkludert tokenvolum, ukentlig rangering, tokenmiks, kostnader, cacheandel, økter, geografiske fordelinger og lignende modeller.",
  "model.loadingTitle": "Modelldata",
  "model.loadingDescription": "Leser modellaggregater.",
  "model.loadingProfile": "Leser modellprofilen.",
  "model.noDataTitle": "Ingen modelldata",
  "model.noDataDescription": "Prøv å åpne en modell fra rangeringen.",
  "model.noMatched": "Ingen modellfakta eller bruksrader matchet {{id}}.",
  "model.fallback": "Modell",
  "model.catalogFallback": "Modellfakta fra den delte modellindeksen. OpenCode Go-bruk vises når denne modellen har aktivitet.",
  "model.unranked": "Ikke rangert i forrige ukes OpenCode Go-bruk",
  "model.ranked": "Rangert #{{rank}} i forrige ukes OpenCode Go-bruk",
  "model.observedVolume": "med {{share}} av observert 2M-volum.",
  "model.weights": "Modellvekter: {{label}}",
  "model.rank": "7D-rangering",
  "model.profile": "Modellprofil",
  "model.listed": "Oppført",
  "model.noCurrentUsage": "Ingen OpenCode Go-bruk i gjeldende datavindu.",
  "model.facts": "Modellfakta",
  "model.context": "Kontekst",
  "model.output": "Utdata",
  "model.knowledge": "Kunnskap",
  "model.release": "Utgivelse",
  "model.inputs": "Inndata",
  "model.overviewDescription": "Nylige OpenCode Go-tokens, unike brukere og markedsposisjon.",
  "model.noSummaryTitle": "Ingen bruksoversikt",
  "model.noSummaryDescription": "Denne modellen har ingen OpenCode Go-bruksrader ennå.",
  "model.tokens": "Tokens",
  "model.uniqueUsers": "Unike brukere",
  "model.lastTwoMonths": "siste to måneder",
  "model.sessions": "Økter",
  "model.completedSessions": "fullførte økter",
  "model.tokenShare": "Tokenandel",
  "model.totalModels": "{{count}} modeller",
  "model.momentum": "Momentum",
  "model.vsPreviousWindow": "mot forrige vindu",
  "model.usageDescription": "Daglig OpenCode Go-tokenvolum i det nylige tomånedersvinduet.",
  "model.noUsageTitle": "Ingen bruk",
  "model.noUsageDescription": "Ingen bruk landet i gjeldende vindu.",
  "model.dailyTokenChart": "Daglig diagram over tokenbruk",
  "model.usersDescription": "Daglige unike OpenCode Go-brukere i det nylige tomånedersvinduet.",
  "model.noUsersTitle": "Ingen brukerdata",
  "model.noUsersDescription": "Ingen rader med brukere landet i gjeldende vindu.",
  "model.dailyUserChart": "Daglig diagram over unike brukere",
  "model.efficiencyDescription": "Kostnad, cacheatferd og gjennomsnittlig OpenCode Go-øktform.",
  "model.noEfficiencyTitle": "Ingen effektivitetsdata",
  "model.noEfficiencyDescription": "Effektivitetsdata vises etter at bruk lander.",
  "model.totalSpendLabel": "Total spend",
  "model.costInput": "Cost input",
  "model.costOutput": "Cost output",
  "model.averageCostSession": "Average cost / Session",
  "model.averageTokensSession": "Average tokens / session",
  "model.cost": "Kostnad",
  "model.totalSpend": "totalt forbruk",
  "model.costPerMillion": "Kostnad / 1 mill.",
  "model.inputOutput": "inndata / utdata",
  "model.observedTokens": "alle observerte tokens",
  "model.costSession": "Kostnad / økt",
  "model.average": "gjennomsnitt",
  "model.tokensSession": "Tokens / økt",
  "model.cacheRatio": "Cacheandel",
  "model.inputTokens": "inndata-tokens",
  "model.geoDescription": "OpenCode Go-modelltokens brukt etter land.",
  "model.noGeoTitle": "Ingen geodata",
  "model.noGeoDescription": "Ingen OpenCode Go-georader matchet denne modellen.",
  "model.worldMap": "Verdenskart over modelltokenbruk etter land",
  "model.peersDescription": "Nærliggende modeller etter nylig OpenCode Go-tokenvolum.",
  "model.noPeersTitle": "Ingen lignende modeller",
  "model.noPeersDescription": "Rangeringer for lignende modeller vises etter at bruk lander.",
  "model.noUsageLastWeek": "Ingen bruk forrige uke",
  "model.newThisWeek": "Ny denne uken",
  "model.sameAsPreviousWeek": "Samme som forrige uke",
  "model.vsPreviousWeek": "{{change}} mot forrige uke",
  "model.pdf": "PDF",
  "format.users": "brukere",
  "format.tokens": "tokens"
};
const dict$7 = {
  "app.title": "Rankingi użycia modeli AI | OpenCode Data",
  "app.description": "Przeglądaj użycie OpenCode Go w modelach AI, w tym wolumen tokenów, rankingi, udział w rynku, ceny tokenów, koszt sesji, współczynnik cache i podziały geograficzne.",
  "app.unfurlAlt": "Znak słowny OpenCode Data na ciemnym wzorzystym tle",
  "nav.dataHome": "Strona danych",
  "nav.topModels": "Najlepsze modele",
  "nav.leaderboard": "Ranking",
  "nav.uniqueUsers": "Unikalni użytkownicy",
  "nav.sessionCost": "Koszt sesji",
  "nav.tokenCost": "Koszt tokenów",
  "nav.cacheRatio": "Współczynnik cache",
  "nav.marketShare": "Udział w rynku",
  "nav.geoBreakdown": "Podział geograficzny",
  "nav.overview": "Przegląd",
  "nav.usage": "Użycie",
  "nav.users": "Użytkownicy",
  "nav.efficiency": "Wydajność",
  "nav.peers": "Podobne modele",
  "nav.models": "Modele",
  "header.brandLabel": "Strona danych",
  "header.sectionNavLabel": "Sekcje danych",
  "header.githubAria": "Dodaj gwiazdkę OpenCode na GitHub",
  "header.github": "GitHub",
  "header.tryOpenCode": "Wypróbuj OpenCode",
  "header.openNav": "Otwórz nawigację",
  "header.closeNav": "Zamknij nawigację",
  "theme.groupLabel": "Motyw",
  "theme.dark": "Ciemny",
  "theme.light": "Jasny",
  "theme.system": "Systemowy",
  "footer.modelData": "Dane modeli",
  "footer.legal": "Informacje prawne",
  "footer.connect": "Kontakt",
  "footer.newsletter": "Newsletter",
  "footer.newsletterBody": "Dowiedz się jako pierwszy o nowych wydaniach.",
  "footer.language": "Język",
  "footer.subscribe": "Subskrybuj",
  "footer.terms": "Warunki korzystania",
  "footer.privacy": "Polityka prywatności",
  "footer.contact": "Skontaktuj się z nami",
  "footer.community": "Społeczność",
  "footer.youtube": "YouTube",
  "footer.homeAria": "Strona główna OpenCode",
  "footer.status": "Wszystkie systemy działają",
  "footer.copyright": "© 2026 Anomaly Innovations Inc.",
  "bridge.learnMore": "DOWIEDZ SIĘ WIĘCEJ",
  "modal.closeNewsletter": "Zamknij zapis do newslettera",
  "modal.title": "Newsletter OpenCode",
  "modal.body": "Dowiedz się jako pierwszy\no nowych wydaniach.",
  "modal.email": "Adres e-mail",
  "modal.subscribe": "Subskrybuj",
  "modal.subscribing": "Subskrybowanie...",
  "modal.success": "Subskrypcja aktywna.",
  "modal.error": "Nie udało się subskrybować",
  "product.allUsers": "Wszyscy użytkownicy",
  "product.zen": "Zen",
  "product.go": "Go",
  "range.1D": "1 dzień",
  "range.1W": "1 tydzień",
  "range.2W": "2 tygodnie",
  "range.1M": "1 miesiąc",
  "range.2M": "2 miesiące",
  "chart.daily": "Dziennie",
  "chart.input": "Wejście",
  "chart.output": "Wyjście",
  "chart.cached": "Z cache",
  "chart.uncached": "Bez cache",
  "chart.ratio": "Współczynnik",
  "chart.model": "Model",
  "chart.cacheRatio": "Współczynnik cache",
  "chart.costSession": "Koszt/sesja",
  "chart.tokensSession": "Tokeny/sesja",
  "chart.costPerSession": "KOSZT / SESJA",
  "chart.tokensPerSession": "TOKENY / SESJA",
  "chart.live": "Na żywo",
  "chart.percent": "procent",
  "chart.leaderboardAria": "Ranking tokenów modeli",
  "chart.scrollableLeaderboardAria": "Przewijany ranking tokenów modeli",
  "chart.byAuthor": "autor: {{author}}",
  "home.updated": "Zaktualizowano",
  "home.noRows": "Nie ma jeszcze wierszy",
  "home.justNow": "przed chwilą",
  "home.heroCopy": "Zobacz, które modele wygrywają w realnym użyciu, jak zmienia się miks i co to oznacza dla kosztów.",
  "home.loadingTitle": "Ładowanie danych",
  "home.loadingDescription": "Odczytywanie agregatów modeli.",
  "home.usageTitle": "Użycie",
  "home.topModelsDescription": "Użycie modeli w OpenCode Go.",
  "home.noUsageTitle": "Brak danych użycia",
  "home.noUsageDescription": "Żadne wiersze modeli nie pasowały do tego produktu i zakresu.",
  "home.noLeaderboardTitle": "Brak danych rankingu",
  "home.noLeaderboardDescription": "Żadne wiersze modeli nie pasowały do tego produktu i zakresu.",
  "home.productFilter": "Filtr produktu",
  "home.dateRange": "Zakres dat",
  "home.stackedUsageChart": "Skumulowany wykres użycia najlepszych modeli",
  "home.total": "razem",
  "home.modelUsers": "użytkownicy modelu",
  "home.new": "Nowy",
  "home.uniqueUsersTitle": "Unikalni użytkownicy",
  "home.uniqueUsersDescription": "Dzienni unikalni użytkownicy OpenCode Go według modelu.",
  "home.noUserDataTitle": "Brak danych użytkowników",
  "home.noUserDataDescription": "Żadne wiersze modeli z użytkownikami nie pasowały do tego okna.",
  "home.uniqueUsersChart": "Skumulowany wykres unikalnych użytkowników według modelu",
  "home.marketShareTitle": "Udział w rynku",
  "home.marketShareDescription": "Porównaj udział tokenów według autora modelu.",
  "home.noMarketTitle": "Brak danych rynkowych",
  "home.noMarketDescription": "Żadne wiersze modeli nie pasowały do tego zakresu.",
  "home.marketChart": "Udział w rynku według autora modelu",
  "home.noData": "Brak danych",
  "home.geoTitle": "Podział geograficzny",
  "home.geoDescription": "Tokeny użyte według kraju.",
  "home.noGeoTitle": "Brak danych geograficznych",
  "home.noGeoDescription": "Żadne wiersze geograficzne nie pasowały do tego zakresu.",
  "home.worldMap": "Mapa świata użycia tokenów według kraju",
  "home.geoMapTitle": "Mapa podziału geograficznego",
  "home.unknown": "Nieznane",
  "home.tokenCostTitle": "Koszt tokenów",
  "home.tokenCostDescription": "Cena za 1 mln tokenów.",
  "home.noTokenCostTitle": "Brak danych kosztu tokenów",
  "home.noTokenCostDescription": "Żadne wiersze modeli z kosztami nie pasowały do tego produktu.",
  "home.cacheRatioTitle": "Współczynnik cache",
  "home.cacheRatioDescription": "Udział tokenów wejściowych obsłużonych z cache.",
  "home.noCacheTitle": "Brak danych współczynnika cache",
  "home.noCacheDescription": "Żadne wiersze modeli z tokenami wejściowymi nie pasowały do tego produktu.",
  "home.sessionCostTitle": "Koszt sesji",
  "home.sessionCostDescription": "Średni koszt na sesję.",
  "home.noSessionCostTitle": "Brak danych kosztu sesji",
  "home.noSessionCostDescription": "Żadne wiersze modeli z sesjami nie pasowały do tego produktu.",
  "home.costSession": "Koszt/sesja",
  "lab.title": "Użycie i rankingi modeli AI {{lab}} | OpenCode Data",
  "lab.description": "Porównaj modele {{lab}} używane w OpenCode Go, w tym użycie tokenów, rankingi modeli, okna kontekstu, daty wydań, koszty i dane specyficzne dla modeli.",
  "lab.loadingTitle": "Laboratorium modeli",
  "lab.loadingDescription": "Odczytywanie dostępności modeli i ostatniego użycia OpenCode.",
  "lab.notFound": "Żadne modele nie pasowały do tego laboratorium.",
  "lab.heroPrefix": "Przeglądaj {{count}} modeli {{lab}} używanych w OpenCode",
  "lab.heroIncluding": "w tym {{models}}",
  "lab.heroSuffix": "Porównaj ostatnie użycie tokenów, okna kontekstu, daty wydań i dane specyficzne dla modeli.",
  "lab.tokensProcessed": "Przetworzone tokeny",
  "lab.pending": "Oczekujące",
  "lab.usageAfterActivity": "Użycie pojawi się po nadejściu aktywności modelu",
  "lab.latestRelease": "Najnowsze wydanie {{date}}",
  "lab.shareOfUsage": "{{share}} ostatniego użycia OpenCode",
  "lab.usageTitle": "Użycie tokenów {{lab}}",
  "lab.usageDescription": "Dzienny wolumen tokenów OpenCode z ostatnich dwóch miesięcy.",
  "lab.noUsageTitle": "Jeszcze brak użycia",
  "lab.noUsageDescription": "Ostatnie użycie tokenów pojawi się tutaj, gdy to laboratorium będzie mieć aktywność.",
  "lab.dailyTokenChart": "Dzienny wykres użycia tokenów {{lab}}",
  "lab.dailyTokens": "Dzienne tokeny",
  "lab.tokens": "tokeny",
  "lab.modelsTitle": "Modele {{lab}}",
  "lab.modelsDescription": "Szczegóły katalogu plus ostatnie użycie.",
  "lab.recentUsageAndLimits": "Ostatnie użycie i limity.",
  "lab.usage": "Użycie",
  "lab.share": "Udział",
  "model.title": "Użycie, koszt i pozycja {{model}} | OpenCode Data",
  "model.description": "Zobacz dane użycia {{model}} w OpenCode Go, w tym wolumen tokenów, tygodniową pozycję, miks tokenów, koszty, współczynnik cache, sesje, podziały geograficzne i podobne modele.",
  "model.loadingTitle": "Dane modelu",
  "model.loadingDescription": "Odczytywanie agregatów modelu.",
  "model.loadingProfile": "Odczytywanie profilu modelu.",
  "model.noDataTitle": "Brak danych modelu",
  "model.noDataDescription": "Spróbuj otworzyć model z rankingu.",
  "model.noMatched": "Żadne fakty modelu ani wiersze użycia nie pasowały do {{id}}.",
  "model.fallback": "Model",
  "model.catalogFallback": "Fakty modelu ze wspólnego indeksu modeli. Użycie OpenCode Go pojawi się, gdy ten model będzie mieć aktywność.",
  "model.unranked": "Bez pozycji w użyciu OpenCode Go z zeszłego tygodnia",
  "model.ranked": "Pozycja #{{rank}} w użyciu OpenCode Go z zeszłego tygodnia",
  "model.observedVolume": "z {{share}} obserwowanego wolumenu 2M.",
  "model.weights": "Wagi modelu: {{label}}",
  "model.rank": "Pozycja 7D",
  "model.profile": "Profil modelu",
  "model.listed": "W katalogu",
  "model.noCurrentUsage": "Brak użycia OpenCode Go w bieżącym oknie danych.",
  "model.facts": "Fakty modelu",
  "model.context": "Kontekst",
  "model.output": "Wyjście",
  "model.knowledge": "Wiedza",
  "model.release": "Wydanie",
  "model.inputs": "Wejścia",
  "model.overviewDescription": "Ostatnie tokeny OpenCode Go, unikalni użytkownicy i pozycja rynkowa.",
  "model.noSummaryTitle": "Brak podsumowania użycia",
  "model.noSummaryDescription": "Ten model nie ma jeszcze wierszy użycia OpenCode Go.",
  "model.tokens": "Tokeny",
  "model.uniqueUsers": "Unikalni użytkownicy",
  "model.lastTwoMonths": "ostatnie dwa miesiące",
  "model.sessions": "Sesje",
  "model.completedSessions": "zakończone sesje",
  "model.tokenShare": "Udział tokenów",
  "model.totalModels": "{{count}} modeli",
  "model.momentum": "Momentum",
  "model.vsPreviousWindow": "vs poprzednie okno",
  "model.usageDescription": "Dzienny wolumen tokenów OpenCode Go w ostatnim dwumiesięcznym oknie.",
  "model.noUsageTitle": "Brak użycia",
  "model.noUsageDescription": "W bieżącym oknie nie pojawiło się użycie.",
  "model.dailyTokenChart": "Dzienny wykres użycia tokenów",
  "model.usersDescription": "Dzienni unikalni użytkownicy OpenCode Go w ostatnim dwumiesięcznym oknie.",
  "model.noUsersTitle": "Brak danych użytkowników",
  "model.noUsersDescription": "W bieżącym oknie nie pojawiły się wiersze z użytkownikami.",
  "model.dailyUserChart": "Dzienny wykres unikalnych użytkowników",
  "model.efficiencyDescription": "Koszt, zachowanie cache i średni kształt sesji OpenCode Go.",
  "model.noEfficiencyTitle": "Brak danych wydajności",
  "model.noEfficiencyDescription": "Dane wydajności pojawią się po nadejściu użycia.",
  "model.totalSpendLabel": "Total spend",
  "model.costInput": "Cost input",
  "model.costOutput": "Cost output",
  "model.averageCostSession": "Average cost / Session",
  "model.averageTokensSession": "Average tokens / session",
  "model.cost": "Koszt",
  "model.totalSpend": "łączne wydatki",
  "model.costPerMillion": "Koszt / 1 mln",
  "model.inputOutput": "wejście / wyjście",
  "model.observedTokens": "wszystkie obserwowane tokeny",
  "model.costSession": "Koszt / sesja",
  "model.average": "średnio",
  "model.tokensSession": "Tokeny / sesja",
  "model.cacheRatio": "Współczynnik cache",
  "model.inputTokens": "tokeny wejściowe",
  "model.geoDescription": "Tokeny modelu OpenCode Go użyte według kraju.",
  "model.noGeoTitle": "Brak danych geograficznych",
  "model.noGeoDescription": "Żadne wiersze geograficzne OpenCode Go nie pasowały do tego modelu.",
  "model.worldMap": "Mapa świata użycia tokenów modelu według kraju",
  "model.peersDescription": "Pobliskie modele według ostatniego wolumenu tokenów OpenCode Go.",
  "model.noPeersTitle": "Brak podobnych modeli",
  "model.noPeersDescription": "Rankingi podobnych modeli pojawią się po nadejściu użycia.",
  "model.noUsageLastWeek": "Brak użycia w zeszłym tygodniu",
  "model.newThisWeek": "Nowy w tym tygodniu",
  "model.sameAsPreviousWeek": "Tak samo jak w poprzednim tygodniu",
  "model.vsPreviousWeek": "{{change}} vs poprzedni tydzień",
  "model.pdf": "PDF",
  "format.users": "użytkownicy",
  "format.tokens": "tokeny"
};
const dict$6 = {
  "app.title": "Рейтинги использования ИИ-моделей | OpenCode Data",
  "app.description": "Изучайте использование OpenCode Go по ИИ-моделям: объем токенов, рейтинги, долю рынка, цены токенов, стоимость сеанса, долю кэша и географические разрезы.",
  "app.unfurlAlt": "Словесный знак OpenCode Data на темном узорном фоне",
  "nav.dataHome": "Главная данных",
  "nav.topModels": "Лучшие модели",
  "nav.leaderboard": "Рейтинг",
  "nav.uniqueUsers": "Уникальные пользователи",
  "nav.sessionCost": "Стоимость сеанса",
  "nav.tokenCost": "Стоимость токенов",
  "nav.cacheRatio": "Доля кэша",
  "nav.marketShare": "Доля рынка",
  "nav.geoBreakdown": "Географический разрез",
  "nav.overview": "Обзор",
  "nav.usage": "Использование",
  "nav.users": "Пользователи",
  "nav.efficiency": "Эффективность",
  "nav.peers": "Похожие модели",
  "nav.models": "Модели",
  "header.brandLabel": "Главная данных",
  "header.sectionNavLabel": "Разделы данных",
  "header.githubAria": "Поставить звезду OpenCode на GitHub",
  "header.github": "GitHub",
  "header.tryOpenCode": "Попробовать OpenCode",
  "header.openNav": "Открыть навигацию",
  "header.closeNav": "Закрыть навигацию",
  "theme.groupLabel": "Тема",
  "theme.dark": "Темная",
  "theme.light": "Светлая",
  "theme.system": "Системная",
  "footer.modelData": "Данные моделей",
  "footer.legal": "Правовая информация",
  "footer.connect": "Связаться",
  "footer.newsletter": "Рассылка",
  "footer.newsletterBody": "Узнавайте о новых релизах первыми.",
  "footer.language": "Язык",
  "footer.subscribe": "Подписаться",
  "footer.terms": "Условия обслуживания",
  "footer.privacy": "Политика конфиденциальности",
  "footer.contact": "Свяжитесь с нами",
  "footer.community": "Сообщество",
  "footer.youtube": "YouTube",
  "footer.homeAria": "Главная OpenCode",
  "footer.status": "Все системы работают",
  "footer.copyright": "© 2026 Anomaly Innovations Inc.",
  "bridge.learnMore": "УЗНАТЬ БОЛЬШЕ",
  "modal.closeNewsletter": "Закрыть форму подписки",
  "modal.title": "Рассылка OpenCode",
  "modal.body": "Узнавайте первыми\nо новых релизах.",
  "modal.email": "Адрес электронной почты",
  "modal.subscribe": "Подписаться",
  "modal.subscribing": "Оформляем подписку...",
  "modal.success": "Вы подписаны.",
  "modal.error": "Не удалось подписаться",
  "product.allUsers": "Все пользователи",
  "product.zen": "Zen",
  "product.go": "Go",
  "range.1D": "1 день",
  "range.1W": "1 неделя",
  "range.2W": "2 недели",
  "range.1M": "1 месяц",
  "range.2M": "2 месяца",
  "chart.daily": "Ежедневно",
  "chart.input": "Ввод",
  "chart.output": "Вывод",
  "chart.cached": "Из кэша",
  "chart.uncached": "Без кэша",
  "chart.ratio": "Соотношение",
  "chart.model": "Модель",
  "chart.cacheRatio": "Доля кэша",
  "chart.costSession": "Стоимость/сеанс",
  "chart.tokensSession": "Токены/сеанс",
  "chart.costPerSession": "СТОИМОСТЬ / СЕАНС",
  "chart.tokensPerSession": "ТОКЕНЫ / СЕАНС",
  "chart.live": "В реальном времени",
  "chart.percent": "процент",
  "chart.leaderboardAria": "Рейтинг моделей по токенам",
  "chart.scrollableLeaderboardAria": "Прокручиваемый рейтинг моделей по токенам",
  "chart.byAuthor": "автор: {{author}}",
  "home.updated": "Обновлено",
  "home.noRows": "Строк пока нет",
  "home.justNow": "только что",
  "home.heroCopy": "Посмотрите, какие модели выигрывают в реальном использовании, как меняется состав и что это значит для стоимости.",
  "home.loadingTitle": "Загрузка данных",
  "home.loadingDescription": "Читаем агрегаты моделей.",
  "home.usageTitle": "Использование",
  "home.topModelsDescription": "Использование моделей в OpenCode Go.",
  "home.noUsageTitle": "Нет данных использования",
  "home.noUsageDescription": "Нет строк моделей для этого продукта и диапазона.",
  "home.noLeaderboardTitle": "Нет данных рейтинга",
  "home.noLeaderboardDescription": "Нет строк моделей для этого продукта и диапазона.",
  "home.productFilter": "Фильтр продукта",
  "home.dateRange": "Диапазон дат",
  "home.stackedUsageChart": "Составной график использования лучших моделей",
  "home.total": "всего",
  "home.modelUsers": "пользователи модели",
  "home.new": "Новая",
  "home.uniqueUsersTitle": "Уникальные пользователи",
  "home.uniqueUsersDescription": "Ежедневные уникальные пользователи OpenCode Go по моделям.",
  "home.noUserDataTitle": "Нет данных пользователей",
  "home.noUserDataDescription": "Нет строк моделей с пользователями для этого окна.",
  "home.uniqueUsersChart": "Составной график уникальных пользователей по моделям",
  "home.marketShareTitle": "Доля рынка",
  "home.marketShareDescription": "Сравните долю токенов по автору модели.",
  "home.noMarketTitle": "Нет рыночных данных",
  "home.noMarketDescription": "Нет строк моделей для этого диапазона.",
  "home.marketChart": "Доля рынка по автору модели",
  "home.noData": "Нет данных",
  "home.geoTitle": "Географический разрез",
  "home.geoDescription": "Токены, использованные по странам.",
  "home.noGeoTitle": "Нет геоданных",
  "home.noGeoDescription": "Нет географических строк для этого диапазона.",
  "home.worldMap": "Карта мира использования токенов по странам",
  "home.geoMapTitle": "Карта географического разреза",
  "home.unknown": "Неизвестно",
  "home.tokenCostTitle": "Стоимость токенов",
  "home.tokenCostDescription": "Цена за 1 млн токенов.",
  "home.noTokenCostTitle": "Нет данных стоимости токенов",
  "home.noTokenCostDescription": "Нет строк моделей со стоимостью для этого продукта.",
  "home.cacheRatioTitle": "Доля кэша",
  "home.cacheRatioDescription": "Доля входных токенов, обслуженных из кэша.",
  "home.noCacheTitle": "Нет данных доли кэша",
  "home.noCacheDescription": "Нет строк моделей с входными токенами для этого продукта.",
  "home.sessionCostTitle": "Стоимость сеанса",
  "home.sessionCostDescription": "Средняя стоимость за сеанс.",
  "home.noSessionCostTitle": "Нет данных стоимости сеанса",
  "home.noSessionCostDescription": "Нет строк моделей с сеансами для этого продукта.",
  "home.costSession": "Стоимость/сеанс",
  "lab.title": "Использование и рейтинги ИИ-моделей {{lab}} | OpenCode Data",
  "lab.description": "Сравните модели {{lab}}, используемые в OpenCode Go: использование токенов, рейтинги моделей, контекстные окна, даты релизов, стоимость и данные конкретных моделей.",
  "lab.loadingTitle": "Лаборатория моделей",
  "lab.loadingDescription": "Читаем доступность моделей и недавнее использование OpenCode.",
  "lab.notFound": "Нет моделей, соответствующих этой лаборатории.",
  "lab.heroPrefix": "Изучайте {{count}} моделей {{lab}}, используемых в OpenCode",
  "lab.heroIncluding": "включая {{models}}",
  "lab.heroSuffix": "Сравните недавнее использование токенов, контекстные окна, даты релизов и данные конкретных моделей.",
  "lab.tokensProcessed": "Обработанные токены",
  "lab.pending": "Ожидает",
  "lab.usageAfterActivity": "Использование появится после активности модели",
  "lab.latestRelease": "Последний релиз {{date}}",
  "lab.shareOfUsage": "{{share}} недавнего использования OpenCode",
  "lab.usageTitle": "Использование токенов {{lab}}",
  "lab.usageDescription": "Ежедневный объем токенов OpenCode за последние два месяца.",
  "lab.noUsageTitle": "Использования пока нет",
  "lab.noUsageDescription": "Недавнее использование токенов появится здесь, когда у этой лаборатории будет активность.",
  "lab.dailyTokenChart": "Ежедневный график использования токенов {{lab}}",
  "lab.dailyTokens": "Ежедневные токены",
  "lab.tokens": "токены",
  "lab.modelsTitle": "Модели {{lab}}",
  "lab.modelsDescription": "Детали каталога и недавнее использование.",
  "lab.recentUsageAndLimits": "Недавнее использование и лимиты.",
  "lab.usage": "Использование",
  "lab.share": "Доля",
  "model.title": "Использование, стоимость и ранг {{model}} | OpenCode Data",
  "model.description": "Посмотрите данные использования {{model}} в OpenCode Go: объем токенов, недельный ранг, состав токенов, стоимость, долю кэша, сеансы, географические разрезы и похожие модели.",
  "model.loadingTitle": "Данные модели",
  "model.loadingDescription": "Читаем агрегаты модели.",
  "model.loadingProfile": "Читаем профиль модели.",
  "model.noDataTitle": "Нет данных модели",
  "model.noDataDescription": "Попробуйте открыть модель из рейтинга.",
  "model.noMatched": "Нет фактов модели или строк использования для {{id}}.",
  "model.fallback": "Модель",
  "model.catalogFallback": "Факты модели из общего индекса моделей. Использование OpenCode Go появится, когда у этой модели будет активность.",
  "model.unranked": "Нет рейтинга по использованию OpenCode Go за прошлую неделю",
  "model.ranked": "Ранг #{{rank}} по использованию OpenCode Go за прошлую неделю",
  "model.observedVolume": "с {{share}} наблюдаемого объема 2M.",
  "model.weights": "Веса модели: {{label}}",
  "model.rank": "Ранг за 7 дн.",
  "model.profile": "Профиль модели",
  "model.listed": "В каталоге",
  "model.noCurrentUsage": "Нет использования OpenCode Go в текущем окне данных.",
  "model.facts": "Факты модели",
  "model.context": "Контекст",
  "model.output": "Вывод",
  "model.knowledge": "Знания",
  "model.release": "Релиз",
  "model.inputs": "Входы",
  "model.overviewDescription": "Недавние токены OpenCode Go, уникальные пользователи и рыночная позиция.",
  "model.noSummaryTitle": "Нет сводки использования",
  "model.noSummaryDescription": "У этой модели пока нет строк использования OpenCode Go.",
  "model.tokens": "Токены",
  "model.uniqueUsers": "Уникальные пользователи",
  "model.lastTwoMonths": "последние два месяца",
  "model.sessions": "Сеансы",
  "model.completedSessions": "завершенные сеансы",
  "model.tokenShare": "Доля токенов",
  "model.totalModels": "{{count}} моделей",
  "model.momentum": "Динамика",
  "model.vsPreviousWindow": "к предыдущему окну",
  "model.usageDescription": "Ежедневный объем токенов OpenCode Go за недавнее двухмесячное окно.",
  "model.noUsageTitle": "Нет использования",
  "model.noUsageDescription": "В текущем окне использование не появилось.",
  "model.dailyTokenChart": "Ежедневный график использования токенов",
  "model.usersDescription": "Ежедневные уникальные пользователи OpenCode Go за недавнее двухмесячное окно.",
  "model.noUsersTitle": "Нет данных пользователей",
  "model.noUsersDescription": "В текущем окне нет строк с пользователями.",
  "model.dailyUserChart": "Ежедневный график уникальных пользователей",
  "model.efficiencyDescription": "Стоимость, поведение кэша и средняя форма сеанса OpenCode Go.",
  "model.noEfficiencyTitle": "Нет данных эффективности",
  "model.noEfficiencyDescription": "Данные эффективности появятся после использования.",
  "model.totalSpendLabel": "Total spend",
  "model.costInput": "Cost input",
  "model.costOutput": "Cost output",
  "model.averageCostSession": "Average cost / Session",
  "model.averageTokensSession": "Average tokens / session",
  "model.cost": "Стоимость",
  "model.totalSpend": "общие расходы",
  "model.costPerMillion": "Стоимость / 1 млн",
  "model.inputOutput": "ввод / вывод",
  "model.observedTokens": "все наблюдаемые токены",
  "model.costSession": "Стоимость / сеанс",
  "model.average": "в среднем",
  "model.tokensSession": "Токены / сеанс",
  "model.cacheRatio": "Доля кэша",
  "model.inputTokens": "входные токены",
  "model.geoDescription": "Токены модели OpenCode Go, использованные по странам.",
  "model.noGeoTitle": "Нет геоданных",
  "model.noGeoDescription": "Нет географических строк OpenCode Go для этой модели.",
  "model.worldMap": "Карта мира использования токенов модели по странам",
  "model.peersDescription": "Близкие модели по недавнему объему токенов OpenCode Go.",
  "model.noPeersTitle": "Нет похожих моделей",
  "model.noPeersDescription": "Рейтинги похожих моделей появятся после использования.",
  "model.noUsageLastWeek": "Нет использования на прошлой неделе",
  "model.newThisWeek": "Новая на этой неделе",
  "model.sameAsPreviousWeek": "Без изменений к предыдущей неделе",
  "model.vsPreviousWeek": "{{change}} к предыдущей неделе",
  "model.pdf": "PDF",
  "format.users": "пользователи",
  "format.tokens": "токены"
};
const dict$5 = {
  "app.title": "อันดับการใช้งานโมเดล AI | ข้อมูล OpenCode",
  "app.description": "สำรวจการใช้งาน OpenCode Go ในโมเดล AI ต่างๆ รวมถึงปริมาณ token อันดับ ส่วนแบ่งตลาด ราคา token ต้นทุนต่อเซสชัน อัตราแคช และข้อมูลแยกตามภูมิศาสตร์",
  "app.unfurlAlt": "เวิร์ดมาร์ก OpenCode Data บนพื้นหลังลวดลายสีเข้ม",
  "nav.dataHome": "หน้าหลักข้อมูล",
  "nav.topModels": "โมเดลยอดนิยม",
  "nav.leaderboard": "ลีดเดอร์บอร์ด",
  "nav.uniqueUsers": "ผู้ใช้ไม่ซ้ำ",
  "nav.sessionCost": "ต้นทุนเซสชัน",
  "nav.tokenCost": "ต้นทุน Token",
  "nav.cacheRatio": "อัตราแคช",
  "nav.marketShare": "ส่วนแบ่งตลาด",
  "nav.geoBreakdown": "แยกตามภูมิศาสตร์",
  "nav.overview": "ภาพรวม",
  "nav.usage": "การใช้งาน",
  "nav.users": "ผู้ใช้",
  "nav.efficiency": "ประสิทธิภาพ",
  "nav.peers": "โมเดลใกล้เคียง",
  "nav.models": "โมเดล",
  "header.brandLabel": "หน้าหลักข้อมูล",
  "header.sectionNavLabel": "ส่วนข้อมูล",
  "header.githubAria": "กดดาว OpenCode บน GitHub",
  "header.github": "GitHub",
  "header.tryOpenCode": "ลองใช้ OpenCode",
  "header.openNav": "เปิดการนำทาง",
  "header.closeNav": "ปิดการนำทาง",
  "theme.groupLabel": "ธีม",
  "theme.dark": "มืด",
  "theme.light": "สว่าง",
  "theme.system": "ระบบ",
  "footer.modelData": "ข้อมูลโมเดล",
  "footer.legal": "กฎหมาย",
  "footer.connect": "ติดต่อ",
  "footer.newsletter": "จดหมายข่าว",
  "footer.newsletterBody": "รับข่าวการปล่อยเวอร์ชันใหม่ก่อนใคร",
  "footer.language": "ภาษา",
  "footer.subscribe": "สมัครรับข่าวสาร",
  "footer.terms": "ข้อกำหนดการให้บริการ",
  "footer.privacy": "นโยบายความเป็นส่วนตัว",
  "footer.contact": "ติดต่อเรา",
  "footer.community": "ชุมชน",
  "footer.youtube": "YouTube",
  "footer.homeAria": "หน้าหลัก OpenCode",
  "footer.status": "ทุกระบบทำงานปกติ",
  "footer.copyright": "© 2026 Anomaly Innovations Inc.",
  "bridge.learnMore": "ดูเพิ่มเติม",
  "modal.closeNewsletter": "ปิดการสมัครจดหมายข่าว",
  "modal.title": "จดหมายข่าว OpenCode",
  "modal.body": "รับข่าวการปล่อยเวอร์ชันใหม่\nก่อนใคร",
  "modal.email": "ที่อยู่อีเมล",
  "modal.subscribe": "สมัครรับข่าวสาร",
  "modal.subscribing": "กำลังสมัคร...",
  "modal.success": "สมัครเรียบร้อยแล้ว",
  "modal.error": "สมัครไม่สำเร็จ",
  "product.allUsers": "ผู้ใช้ทั้งหมด",
  "product.zen": "Zen",
  "product.go": "Go",
  "range.1D": "1 วัน",
  "range.1W": "1 สัปดาห์",
  "range.2W": "2 สัปดาห์",
  "range.1M": "1 เดือน",
  "range.2M": "2 เดือน",
  "chart.daily": "รายวัน",
  "chart.input": "อินพุต",
  "chart.output": "เอาต์พุต",
  "chart.cached": "แคชแล้ว",
  "chart.uncached": "ไม่แคช",
  "chart.ratio": "อัตราส่วน",
  "chart.model": "โมเดล",
  "chart.cacheRatio": "อัตราแคช",
  "chart.costSession": "ต้นทุน/เซสชัน",
  "chart.tokensSession": "Token/เซสชัน",
  "chart.costPerSession": "ต้นทุน / เซสชัน",
  "chart.tokensPerSession": "Token / เซสชัน",
  "chart.live": "สด",
  "chart.percent": "เปอร์เซ็นต์",
  "chart.leaderboardAria": "ลีดเดอร์บอร์ด token ของโมเดล",
  "chart.scrollableLeaderboardAria": "ลีดเดอร์บอร์ด token ของโมเดลแบบเลื่อนได้",
  "chart.byAuthor": "โดย {{author}}",
  "home.updated": "อัปเดตแล้ว",
  "home.noRows": "ยังไม่มีแถวข้อมูล",
  "home.justNow": "เมื่อสักครู่",
  "home.heroCopy": "ดูว่าโมเดลใดชนะในการใช้งานจริง ส่วนผสมการใช้งานเปลี่ยนไปอย่างไร และสิ่งนั้นหมายถึงต้นทุนอย่างไร",
  "home.loadingTitle": "กำลังโหลดข้อมูล",
  "home.loadingDescription": "กำลังอ่านข้อมูลสรุปของโมเดล",
  "home.usageTitle": "การใช้งาน",
  "home.topModelsDescription": "การใช้งานโมเดลบน OpenCode Go",
  "home.noUsageTitle": "ไม่มีข้อมูลการใช้งาน",
  "home.noUsageDescription": "ไม่มีแถวโมเดลที่ตรงกับผลิตภัณฑ์และช่วงเวลานี้",
  "home.noLeaderboardTitle": "ไม่มีข้อมูลลีดเดอร์บอร์ด",
  "home.noLeaderboardDescription": "ไม่มีแถวโมเดลที่ตรงกับผลิตภัณฑ์และช่วงเวลานี้",
  "home.productFilter": "ตัวกรองผลิตภัณฑ์",
  "home.dateRange": "ช่วงวันที่",
  "home.stackedUsageChart": "กราฟซ้อนการใช้งานของโมเดลยอดนิยม",
  "home.total": "รวม",
  "home.modelUsers": "ผู้ใช้โมเดล",
  "home.new": "ใหม่",
  "home.uniqueUsersTitle": "ผู้ใช้ไม่ซ้ำ",
  "home.uniqueUsersDescription": "ผู้ใช้ OpenCode Go ไม่ซ้ำรายวัน แยกตามโมเดล",
  "home.noUserDataTitle": "ไม่มีข้อมูลผู้ใช้",
  "home.noUserDataDescription": "ไม่มีแถวโมเดลที่มีข้อมูลผู้ใช้ตรงกับช่วงเวลานี้",
  "home.uniqueUsersChart": "กราฟซ้อนผู้ใช้ไม่ซ้ำแยกตามโมเดล",
  "home.marketShareTitle": "ส่วนแบ่งตลาด",
  "home.marketShareDescription": "เปรียบเทียบส่วนแบ่ง token ตามผู้สร้างโมเดล",
  "home.noMarketTitle": "ไม่มีข้อมูลตลาด",
  "home.noMarketDescription": "ไม่มีแถวโมเดลที่ตรงกับช่วงเวลานี้",
  "home.marketChart": "ส่วนแบ่งตลาดตามผู้สร้างโมเดล",
  "home.noData": "ไม่มีข้อมูล",
  "home.geoTitle": "แยกตามภูมิศาสตร์",
  "home.geoDescription": "token ที่ใช้แยกตามประเทศ",
  "home.noGeoTitle": "ไม่มีข้อมูลภูมิศาสตร์",
  "home.noGeoDescription": "ไม่มีแถวภูมิศาสตร์ที่ตรงกับช่วงเวลานี้",
  "home.worldMap": "แผนที่โลกของการใช้ token แยกตามประเทศ",
  "home.geoMapTitle": "แผนที่แยกตามภูมิศาสตร์",
  "home.unknown": "ไม่ทราบ",
  "home.tokenCostTitle": "ต้นทุน Token",
  "home.tokenCostDescription": "ราคาต่อ 1 ล้าน token",
  "home.noTokenCostTitle": "ไม่มีข้อมูลต้นทุน token",
  "home.noTokenCostDescription": "ไม่มีแถวโมเดลที่มีข้อมูลต้นทุนตรงกับผลิตภัณฑ์นี้",
  "home.cacheRatioTitle": "อัตราแคช",
  "home.cacheRatioDescription": "สัดส่วน input token ที่ให้บริการจากแคช",
  "home.noCacheTitle": "ไม่มีข้อมูลอัตราแคช",
  "home.noCacheDescription": "ไม่มีแถวโมเดลที่มี input token ตรงกับผลิตภัณฑ์นี้",
  "home.sessionCostTitle": "ต้นทุนเซสชัน",
  "home.sessionCostDescription": "ต้นทุนเฉลี่ยต่อเซสชัน",
  "home.noSessionCostTitle": "ไม่มีข้อมูลต้นทุนเซสชัน",
  "home.noSessionCostDescription": "ไม่มีแถวโมเดลที่มีข้อมูลเซสชันตรงกับผลิตภัณฑ์นี้",
  "home.costSession": "ต้นทุน/เซสชัน",
  "lab.title": "การใช้งานและอันดับโมเดล AI ของ {{lab}} | ข้อมูล OpenCode",
  "lab.description": "เปรียบเทียบโมเดล {{lab}} ที่ใช้ใน OpenCode Go รวมถึงการใช้ token อันดับโมเดล หน้าต่างบริบท วันที่ปล่อย ต้นทุน และข้อมูลเฉพาะโมเดล",
  "lab.loadingTitle": "แล็บโมเดล",
  "lab.loadingDescription": "กำลังอ่านความพร้อมของโมเดลและการใช้งาน OpenCode ล่าสุด",
  "lab.notFound": "ไม่มีโมเดลที่ตรงกับแล็บนี้",
  "lab.heroPrefix": "สำรวจโมเดล {{lab}} จำนวน {{count}} รายการที่ใช้ใน OpenCode",
  "lab.heroIncluding": "รวมถึง {{models}}",
  "lab.heroSuffix": "เปรียบเทียบการใช้ token ล่าสุด หน้าต่างบริบท วันที่ปล่อย และข้อมูลเฉพาะโมเดล",
  "lab.tokensProcessed": "Token ที่ประมวลผลแล้ว",
  "lab.pending": "รอดำเนินการ",
  "lab.usageAfterActivity": "การใช้งานจะแสดงหลังจากมีกิจกรรมของโมเดลเข้ามา",
  "lab.latestRelease": "รุ่นล่าสุด {{date}}",
  "lab.shareOfUsage": "{{share}} ของการใช้งาน OpenCode ล่าสุด",
  "lab.usageTitle": "การใช้ token ของ {{lab}}",
  "lab.usageDescription": "ปริมาณ token รายวันของ OpenCode ในช่วงสองเดือนล่าสุด",
  "lab.noUsageTitle": "ยังไม่มีการใช้งาน",
  "lab.noUsageDescription": "การใช้ token ล่าสุดจะแสดงที่นี่เมื่อแล็บนี้มีกิจกรรม",
  "lab.dailyTokenChart": "กราฟการใช้ token รายวันของ {{lab}}",
  "lab.dailyTokens": "token รายวัน",
  "lab.tokens": "token",
  "lab.modelsTitle": "โมเดล {{lab}}",
  "lab.modelsDescription": "รายละเอียดแค็ตตาล็อกและการใช้งานล่าสุด",
  "lab.recentUsageAndLimits": "การใช้งานและขีดจำกัดล่าสุด",
  "lab.usage": "การใช้งาน",
  "lab.share": "ส่วนแบ่ง",
  "model.title": "การใช้งาน ต้นทุน และอันดับของ {{model}} | ข้อมูล OpenCode",
  "model.description": "ดูข้อมูลการใช้งาน OpenCode Go ของ {{model}} รวมถึงปริมาณ token อันดับรายสัปดาห์ ส่วนผสม token ต้นทุน อัตราแคช เซสชัน ข้อมูลแยกตามภูมิศาสตร์ และโมเดลใกล้เคียง",
  "model.loadingTitle": "ข้อมูลโมเดล",
  "model.loadingDescription": "กำลังอ่านข้อมูลสรุปของโมเดล",
  "model.loadingProfile": "กำลังอ่านโปรไฟล์โมเดล",
  "model.noDataTitle": "ไม่มีข้อมูลโมเดล",
  "model.noDataDescription": "ลองเปิดโมเดลจากลีดเดอร์บอร์ด",
  "model.noMatched": "ไม่มีข้อเท็จจริงของโมเดลหรือแถวการใช้งานที่ตรงกับ {{id}}",
  "model.fallback": "โมเดล",
  "model.catalogFallback": "ข้อเท็จจริงของโมเดลจากดัชนีโมเดลที่ใช้ร่วมกัน การใช้งาน OpenCode Go จะแสดงเมื่อโมเดลนี้มีกิจกรรม",
  "model.unranked": "ไม่มีอันดับในการใช้งาน OpenCode Go ของสัปดาห์ที่แล้ว",
  "model.ranked": "อันดับ #{{rank}} ในการใช้งาน OpenCode Go ของสัปดาห์ที่แล้ว",
  "model.observedVolume": "พร้อม {{share}} ของปริมาณ 2M ที่สังเกตได้",
  "model.weights": "น้ำหนักโมเดล: {{label}}",
  "model.rank": "อันดับ 7 วัน",
  "model.profile": "โปรไฟล์โมเดล",
  "model.listed": "อยู่ในรายการ",
  "model.noCurrentUsage": "ไม่มีการใช้งาน OpenCode Go ในช่วงข้อมูลปัจจุบัน",
  "model.facts": "ข้อเท็จจริงของโมเดล",
  "model.context": "บริบท",
  "model.output": "เอาต์พุต",
  "model.knowledge": "ความรู้",
  "model.release": "รุ่น",
  "model.inputs": "อินพุต",
  "model.overviewDescription": "token ล่าสุดของ OpenCode Go ผู้ใช้ไม่ซ้ำ และตำแหน่งในตลาด",
  "model.noSummaryTitle": "ไม่มีสรุปการใช้งาน",
  "model.noSummaryDescription": "โมเดลนี้ยังไม่มีแถวการใช้งาน OpenCode Go",
  "model.tokens": "Token",
  "model.uniqueUsers": "ผู้ใช้ไม่ซ้ำ",
  "model.lastTwoMonths": "สองเดือนล่าสุด",
  "model.sessions": "เซสชัน",
  "model.completedSessions": "เซสชันที่เสร็จสิ้น",
  "model.tokenShare": "ส่วนแบ่ง Token",
  "model.totalModels": "{{count}} โมเดล",
  "model.momentum": "โมเมนตัม",
  "model.vsPreviousWindow": "เทียบกับช่วงก่อนหน้า",
  "model.usageDescription": "ปริมาณ token รายวันของ OpenCode Go ในช่วงสองเดือนล่าสุด",
  "model.noUsageTitle": "ไม่มีการใช้งาน",
  "model.noUsageDescription": "ไม่มีการใช้งานในช่วงปัจจุบัน",
  "model.dailyTokenChart": "กราฟการใช้ token รายวัน",
  "model.usersDescription": "ผู้ใช้ OpenCode Go ไม่ซ้ำรายวันในช่วงสองเดือนล่าสุด",
  "model.noUsersTitle": "ไม่มีข้อมูลผู้ใช้",
  "model.noUsersDescription": "ไม่มีแถวที่มีข้อมูลผู้ใช้ในช่วงปัจจุบัน",
  "model.dailyUserChart": "กราฟผู้ใช้ไม่ซ้ำรายวัน",
  "model.efficiencyDescription": "ต้นทุน พฤติกรรมแคช และรูปแบบเซสชัน OpenCode Go โดยเฉลี่ย",
  "model.noEfficiencyTitle": "ไม่มีข้อมูลประสิทธิภาพ",
  "model.noEfficiencyDescription": "ข้อมูลประสิทธิภาพจะแสดงหลังจากมีการใช้งานเข้ามา",
  "model.totalSpendLabel": "Total spend",
  "model.costInput": "Cost input",
  "model.costOutput": "Cost output",
  "model.averageCostSession": "Average cost / Session",
  "model.averageTokensSession": "Average tokens / session",
  "model.cost": "ต้นทุน",
  "model.totalSpend": "ยอดใช้จ่ายรวม",
  "model.costPerMillion": "ต้นทุน / 1 ล้าน",
  "model.inputOutput": "อินพุต / เอาต์พุต",
  "model.observedTokens": "token ทั้งหมดที่สังเกตได้",
  "model.costSession": "ต้นทุน / เซสชัน",
  "model.average": "เฉลี่ย",
  "model.tokensSession": "Token / เซสชัน",
  "model.cacheRatio": "อัตราแคช",
  "model.inputTokens": "input token",
  "model.geoDescription": "token ของโมเดล OpenCode Go ที่ใช้แยกตามประเทศ",
  "model.noGeoTitle": "ไม่มีข้อมูลภูมิศาสตร์",
  "model.noGeoDescription": "ไม่มีแถวภูมิศาสตร์ของ OpenCode Go ที่ตรงกับโมเดลนี้",
  "model.worldMap": "แผนที่โลกของการใช้ token ของโมเดลแยกตามประเทศ",
  "model.peersDescription": "โมเดลใกล้เคียงตามปริมาณ token ล่าสุดของ OpenCode Go",
  "model.noPeersTitle": "ไม่มีโมเดลใกล้เคียง",
  "model.noPeersDescription": "อันดับโมเดลใกล้เคียงจะแสดงหลังจากมีการใช้งานเข้ามา",
  "model.noUsageLastWeek": "ไม่มีการใช้งานเมื่อสัปดาห์ที่แล้ว",
  "model.newThisWeek": "ใหม่ในสัปดาห์นี้",
  "model.sameAsPreviousWeek": "เท่าเดิมจากสัปดาห์ก่อน",
  "model.vsPreviousWeek": "{{change}} เทียบกับสัปดาห์ก่อน",
  "model.pdf": "PDF",
  "format.users": "ผู้ใช้",
  "format.tokens": "token"
};
const dict$4 = {
  "app.title": "Yapay Zeka Model Kullanım Sıralamaları | OpenCode Data",
  "app.description": "OpenCode Go kullanımını yapay zeka modelleri genelinde keşfedin: token hacmi, sıralamalar, pazar payı, token fiyatlandırması, oturum maliyeti, önbellek oranı ve coğrafi dağılımlar.",
  "app.unfurlAlt": "Koyu desenli arka plan üzerinde OpenCode Data logosu",
  "nav.dataHome": "Veri Ana Sayfası",
  "nav.topModels": "En İyi Modeller",
  "nav.leaderboard": "Sıralama",
  "nav.uniqueUsers": "Benzersiz Kullanıcılar",
  "nav.sessionCost": "Oturum Maliyeti",
  "nav.tokenCost": "Token Maliyeti",
  "nav.cacheRatio": "Önbellek Oranı",
  "nav.marketShare": "Pazar Payı",
  "nav.geoBreakdown": "Coğrafi Dağılım",
  "nav.overview": "Genel Bakış",
  "nav.usage": "Kullanım",
  "nav.users": "Kullanıcılar",
  "nav.efficiency": "Verimlilik",
  "nav.peers": "Benzerler",
  "nav.models": "Modeller",
  "header.brandLabel": "Veri ana sayfası",
  "header.sectionNavLabel": "Veri bölümleri",
  "header.githubAria": "GitHub'da OpenCode'a yıldız ver",
  "header.github": "GitHub",
  "header.tryOpenCode": "OpenCode'u dene",
  "header.openNav": "Gezinmeyi aç",
  "header.closeNav": "Gezinmeyi kapat",
  "theme.groupLabel": "Tema",
  "theme.dark": "Koyu",
  "theme.light": "Açık",
  "theme.system": "Sistem",
  "footer.modelData": "Model Verileri",
  "footer.legal": "Yasal",
  "footer.connect": "Bağlan",
  "footer.newsletter": "Bülten",
  "footer.newsletterBody": "Yeni sürümlerden ilk haberdar olun.",
  "footer.language": "Dil",
  "footer.subscribe": "Abone ol",
  "footer.terms": "Hizmet şartları",
  "footer.privacy": "Gizlilik politikası",
  "footer.contact": "Bize ulaşın",
  "footer.community": "Topluluk",
  "footer.youtube": "YouTube",
  "footer.homeAria": "OpenCode ana sayfası",
  "footer.status": "Tüm sistemler çalışıyor",
  "footer.copyright": "© 2026 Anomaly Innovations Inc.",
  "bridge.learnMore": "DAHA FAZLA BİLGİ",
  "modal.closeNewsletter": "Bülten kaydını kapat",
  "modal.title": "OpenCode Bülteni",
  "modal.body": "Yeni sürümlerden ilk\nhaberdar olun.",
  "modal.email": "E-posta adresi",
  "modal.subscribe": "Abone ol",
  "modal.subscribing": "Abone olunuyor...",
  "modal.success": "Abone oldunuz.",
  "modal.error": "Abonelik başarısız oldu",
  "product.allUsers": "Tüm Kullanıcılar",
  "product.zen": "Zen",
  "product.go": "Go",
  "range.1D": "1 Gün",
  "range.1W": "1 Hafta",
  "range.2W": "2 Hafta",
  "range.1M": "1 Ay",
  "range.2M": "2 Ay",
  "chart.daily": "Günlük",
  "chart.input": "Girdi",
  "chart.output": "Çıktı",
  "chart.cached": "Önbellekte",
  "chart.uncached": "Önbelleksiz",
  "chart.ratio": "Oran",
  "chart.model": "Model",
  "chart.cacheRatio": "Önbellek Oranı",
  "chart.costSession": "Maliyet/Oturum",
  "chart.tokensSession": "Token/Oturum",
  "chart.costPerSession": "MALİYET / OTURUM",
  "chart.tokensPerSession": "TOKEN / OTURUM",
  "chart.live": "Canlı",
  "chart.percent": "yüzde",
  "chart.leaderboardAria": "Model token sıralaması",
  "chart.scrollableLeaderboardAria": "Kaydırılabilir model token sıralaması",
  "chart.byAuthor": "{{author}} tarafından",
  "home.updated": "Güncellendi",
  "home.noRows": "Henüz satır yok",
  "home.justNow": "az önce",
  "home.heroCopy": "Gerçek kullanımda hangi modellerin öne geçtiğini, karışımın nasıl değiştiğini ve bunun maliyet için ne anlama geldiğini görün.",
  "home.loadingTitle": "Veriler yükleniyor",
  "home.loadingDescription": "Model toplamları okunuyor.",
  "home.usageTitle": "Kullanım",
  "home.topModelsDescription": "OpenCode Go genelinde model kullanımı.",
  "home.noUsageTitle": "Kullanım verisi yok",
  "home.noUsageDescription": "Bu ürün ve aralıkla eşleşen model satırı yok.",
  "home.noLeaderboardTitle": "Sıralama verisi yok",
  "home.noLeaderboardDescription": "Bu ürün ve aralıkla eşleşen model satırı yok.",
  "home.productFilter": "Ürün filtresi",
  "home.dateRange": "Tarih aralığı",
  "home.stackedUsageChart": "En iyi model kullanımı yığılmış grafiği",
  "home.total": "toplam",
  "home.modelUsers": "model kullanıcıları",
  "home.new": "Yeni",
  "home.uniqueUsersTitle": "Benzersiz Kullanıcılar",
  "home.uniqueUsersDescription": "Modele göre günlük benzersiz OpenCode Go kullanıcıları.",
  "home.noUserDataTitle": "Kullanıcı verisi yok",
  "home.noUserDataDescription": "Bu pencereyle eşleşen kullanıcı içeren model satırı yok.",
  "home.uniqueUsersChart": "Modele göre yığılmış benzersiz kullanıcı grafiği",
  "home.marketShareTitle": "Pazar Payı",
  "home.marketShareDescription": "Model yazarına göre token payını karşılaştırın.",
  "home.noMarketTitle": "Pazar verisi yok",
  "home.noMarketDescription": "Bu aralıkla eşleşen model satırı yok.",
  "home.marketChart": "Model yazarına göre pazar payı",
  "home.noData": "Veri yok",
  "home.geoTitle": "Coğrafi Dağılım",
  "home.geoDescription": "Ülkeye göre kullanılan tokenlar.",
  "home.noGeoTitle": "Coğrafi veri yok",
  "home.noGeoDescription": "Bu aralıkla eşleşen coğrafi satır yok.",
  "home.worldMap": "Ülkeye göre token kullanımının dünya haritası",
  "home.geoMapTitle": "Coğrafi Dağılım haritası",
  "home.unknown": "Bilinmiyor",
  "home.tokenCostTitle": "Token Maliyeti",
  "home.tokenCostDescription": "1 milyon token başına fiyat.",
  "home.noTokenCostTitle": "Token maliyeti verisi yok",
  "home.noTokenCostDescription": "Bu ürünle eşleşen maliyet içeren model satırı yok.",
  "home.cacheRatioTitle": "Önbellek Oranı",
  "home.cacheRatioDescription": "Önbellekten karşılanan giriş tokenlarının payı.",
  "home.noCacheTitle": "Önbellek oranı verisi yok",
  "home.noCacheDescription": "Bu ürünle eşleşen giriş tokenı içeren model satırı yok.",
  "home.sessionCostTitle": "Oturum Maliyeti",
  "home.sessionCostDescription": "Oturum başına ortalama maliyet.",
  "home.noSessionCostTitle": "Oturum maliyeti verisi yok",
  "home.noSessionCostDescription": "Bu ürünle eşleşen oturum içeren model satırı yok.",
  "home.costSession": "Maliyet/Oturum",
  "lab.title": "{{lab}} Yapay Zeka Model Kullanımı ve Sıralamaları | OpenCode Data",
  "lab.description": "OpenCode Go'da kullanılan {{lab}} modellerini karşılaştırın: token kullanımı, model sıralamaları, bağlam pencereleri, yayın tarihleri, maliyetler ve modele özel veriler.",
  "lab.loadingTitle": "Model Laboratuvarı",
  "lab.loadingDescription": "Model kullanılabilirliği ve son OpenCode kullanımı okunuyor.",
  "lab.notFound": "Bu laboratuvarla eşleşen model yok.",
  "lab.heroPrefix": "OpenCode'da kullanılan {{count}} {{lab}} modelini keşfedin",
  "lab.heroIncluding": "{{models}} dahil",
  "lab.heroSuffix": "Son token kullanımını, bağlam pencerelerini, yayın tarihlerini ve modele özel verileri karşılaştırın.",
  "lab.tokensProcessed": "İşlenen Tokenlar",
  "lab.pending": "Beklemede",
  "lab.usageAfterActivity": "Kullanım, model etkinliği ulaştıktan sonra görünür",
  "lab.latestRelease": "Son yayın {{date}}",
  "lab.shareOfUsage": "Son OpenCode kullanımının {{share}} kadarı",
  "lab.usageTitle": "{{lab}} token kullanımı",
  "lab.usageDescription": "Son iki ayda günlük OpenCode token hacmi.",
  "lab.noUsageTitle": "Henüz kullanım yok",
  "lab.noUsageDescription": "Bu laboratuvarda etkinlik olduğunda son token kullanımı burada görünür.",
  "lab.dailyTokenChart": "{{lab}} günlük token kullanım grafiği",
  "lab.dailyTokens": "Günlük tokenlar",
  "lab.tokens": "token",
  "lab.modelsTitle": "{{lab}} modelleri",
  "lab.modelsDescription": "Katalog ayrıntıları ve son kullanım.",
  "lab.recentUsageAndLimits": "Son kullanım ve sınırlar.",
  "lab.usage": "Kullanım",
  "lab.share": "Pay",
  "model.title": "{{model}} Kullanımı, Maliyeti ve Sırası | OpenCode Data",
  "model.description": "{{model}} için OpenCode Go kullanım verilerini görüntüleyin: token hacmi, haftalık sıra, token karışımı, maliyetler, önbellek oranı, oturumlar, coğrafi dağılımlar ve benzer modeller.",
  "model.loadingTitle": "Model Verileri",
  "model.loadingDescription": "Model toplamları okunuyor.",
  "model.loadingProfile": "Model profili okunuyor.",
  "model.noDataTitle": "Model verisi yok",
  "model.noDataDescription": "Sıralamadan bir model açmayı deneyin.",
  "model.noMatched": "{{id}} ile eşleşen model bilgisi veya kullanım satırı yok.",
  "model.fallback": "Model",
  "model.catalogFallback": "Paylaşılan model dizininden model bilgileri. Bu modelde etkinlik olduğunda OpenCode Go kullanımı görünür.",
  "model.unranked": "Geçen haftaki OpenCode Go kullanımında sıralanmamış",
  "model.ranked": "Geçen haftaki OpenCode Go kullanımında #{{rank}} sırada",
  "model.observedVolume": "gözlemlenen 2M hacmin {{share}} payıyla.",
  "model.weights": "Model ağırlıkları: {{label}}",
  "model.rank": "7G Sıra",
  "model.profile": "Model Profili",
  "model.listed": "Listelendi",
  "model.noCurrentUsage": "Geçerli veri penceresinde OpenCode Go kullanımı yok.",
  "model.facts": "Model bilgileri",
  "model.context": "Bağlam",
  "model.output": "Çıktı",
  "model.knowledge": "Bilgi",
  "model.release": "Yayın",
  "model.inputs": "Girdiler",
  "model.overviewDescription": "Son OpenCode Go tokenları, benzersiz kullanıcılar ve pazar konumu.",
  "model.noSummaryTitle": "Kullanım özeti yok",
  "model.noSummaryDescription": "Bu modelde henüz OpenCode Go kullanım satırı yok.",
  "model.tokens": "Tokenlar",
  "model.uniqueUsers": "Benzersiz Kullanıcılar",
  "model.lastTwoMonths": "son iki ay",
  "model.sessions": "Oturumlar",
  "model.completedSessions": "tamamlanan oturumlar",
  "model.tokenShare": "Token Payı",
  "model.totalModels": "{{count}} model",
  "model.momentum": "İvme",
  "model.vsPreviousWindow": "önceki pencereye göre",
  "model.usageDescription": "Son iki aylık pencerede günlük OpenCode Go token hacmi.",
  "model.noUsageTitle": "Kullanım yok",
  "model.noUsageDescription": "Geçerli pencereye kullanım gelmedi.",
  "model.dailyTokenChart": "Günlük token kullanım grafiği",
  "model.usersDescription": "Son iki aylık pencerede günlük benzersiz OpenCode Go kullanıcıları.",
  "model.noUsersTitle": "Kullanıcı verisi yok",
  "model.noUsersDescription": "Geçerli pencereye kullanıcı içeren satır gelmedi.",
  "model.dailyUserChart": "Günlük benzersiz kullanıcı grafiği",
  "model.efficiencyDescription": "Maliyet, önbellek davranışı ve ortalama OpenCode Go oturum yapısı.",
  "model.noEfficiencyTitle": "Verimlilik verisi yok",
  "model.noEfficiencyDescription": "Verimlilik verileri kullanım geldikten sonra görünür.",
  "model.totalSpendLabel": "Total spend",
  "model.costInput": "Cost input",
  "model.costOutput": "Cost output",
  "model.averageCostSession": "Average cost / Session",
  "model.averageTokensSession": "Average tokens / session",
  "model.cost": "Maliyet",
  "model.totalSpend": "toplam harcama",
  "model.costPerMillion": "Maliyet / 1M",
  "model.inputOutput": "girdi / çıktı",
  "model.observedTokens": "gözlemlenen tüm tokenlar",
  "model.costSession": "Maliyet / Oturum",
  "model.average": "ortalama",
  "model.tokensSession": "Token / Oturum",
  "model.cacheRatio": "Önbellek Oranı",
  "model.inputTokens": "giriş tokenları",
  "model.geoDescription": "Ülkeye göre kullanılan OpenCode Go model tokenları.",
  "model.noGeoTitle": "Coğrafi veri yok",
  "model.noGeoDescription": "Bu modelle eşleşen OpenCode Go coğrafi satırı yok.",
  "model.worldMap": "Ülkeye göre model token kullanımının dünya haritası",
  "model.peersDescription": "Son OpenCode Go token hacmine göre yakındaki modeller.",
  "model.noPeersTitle": "Benzer yok",
  "model.noPeersDescription": "Benzer model sıralamaları kullanım geldikten sonra görünür.",
  "model.noUsageLastWeek": "Geçen hafta kullanım yok",
  "model.newThisWeek": "Bu hafta yeni",
  "model.sameAsPreviousWeek": "Önceki haftayla aynı",
  "model.vsPreviousWeek": "önceki haftaya göre {{change}}",
  "model.pdf": "PDF",
  "format.users": "kullanıcı",
  "format.tokens": "token"
};
const dict$3 = {
  "app.title": "Рейтинги використання моделей ШІ | OpenCode Data",
  "app.description": "Досліджуйте використання OpenCode Go серед моделей ШІ, зокрема обсяг токенів, рейтинги, частку ринку, ціни токенів, вартість сеансу, частку кешу та географічні розрізи.",
  "app.unfurlAlt": "Словесний знак OpenCode Data на темному візерунковому тлі",
  "nav.dataHome": "Головна даних",
  "nav.topModels": "Найкращі моделі",
  "nav.leaderboard": "Рейтинг",
  "nav.uniqueUsers": "Унікальні користувачі",
  "nav.sessionCost": "Вартість сеансу",
  "nav.tokenCost": "Вартість токенів",
  "nav.cacheRatio": "Частка кешу",
  "nav.marketShare": "Частка ринку",
  "nav.geoBreakdown": "Географічний розріз",
  "nav.overview": "Огляд",
  "nav.usage": "Використання",
  "nav.users": "Користувачі",
  "nav.efficiency": "Ефективність",
  "nav.peers": "Схожі моделі",
  "nav.models": "Моделі",
  "header.brandLabel": "Головна даних",
  "header.sectionNavLabel": "Розділи даних",
  "header.githubAria": "Поставити зірку OpenCode на GitHub",
  "header.github": "GitHub",
  "header.tryOpenCode": "Спробувати OpenCode",
  "header.openNav": "Відкрити навігацію",
  "header.closeNav": "Закрити навігацію",
  "theme.groupLabel": "Тема",
  "theme.dark": "Темна",
  "theme.light": "Світла",
  "theme.system": "Системна",
  "footer.modelData": "Дані моделей",
  "footer.legal": "Правова інформація",
  "footer.connect": "Зв'язок",
  "footer.newsletter": "Розсилка",
  "footer.newsletterBody": "Дізнавайтеся про нові релізи першими.",
  "footer.language": "Мова",
  "footer.subscribe": "Підписатися",
  "footer.terms": "Умови обслуговування",
  "footer.privacy": "Політика конфіденційності",
  "footer.contact": "Зв'яжіться з нами",
  "footer.community": "Спільнота",
  "footer.youtube": "YouTube",
  "footer.homeAria": "Головна OpenCode",
  "footer.status": "Усі системи працюють",
  "footer.copyright": "© 2026 Anomaly Innovations Inc.",
  "bridge.learnMore": "ДІЗНАТИСЯ БІЛЬШЕ",
  "modal.closeNewsletter": "Закрити форму підписки",
  "modal.title": "Розсилка OpenCode",
  "modal.body": "Дізнавайтеся першими\nпро нові релізи.",
  "modal.email": "Адреса електронної пошти",
  "modal.subscribe": "Підписатися",
  "modal.subscribing": "Оформлюємо підписку...",
  "modal.success": "Ви підписалися.",
  "modal.error": "Не вдалося підписатися",
  "product.allUsers": "Усі користувачі",
  "product.zen": "Zen",
  "product.go": "Go",
  "range.1D": "1 день",
  "range.1W": "1 тиждень",
  "range.2W": "2 тижні",
  "range.1M": "1 місяць",
  "range.2M": "2 місяці",
  "chart.daily": "Щоденно",
  "chart.input": "Вхід",
  "chart.output": "Вихід",
  "chart.cached": "З кешу",
  "chart.uncached": "Без кешу",
  "chart.ratio": "Співвідношення",
  "chart.model": "Модель",
  "chart.cacheRatio": "Частка кешу",
  "chart.costSession": "Вартість/сеанс",
  "chart.tokensSession": "Токени/сеанс",
  "chart.costPerSession": "ВАРТІСТЬ / СЕАНС",
  "chart.tokensPerSession": "ТОКЕНИ / СЕАНС",
  "chart.live": "Наживо",
  "chart.percent": "відсоток",
  "chart.leaderboardAria": "Рейтинг моделей за токенами",
  "chart.scrollableLeaderboardAria": "Прокручуваний рейтинг моделей за токенами",
  "chart.byAuthor": "автор: {{author}}",
  "home.updated": "Оновлено",
  "home.noRows": "Рядків поки немає",
  "home.justNow": "щойно",
  "home.heroCopy": "Подивіться, які моделі перемагають у реальному використанні, як змінюється мікс і що це означає для вартості.",
  "home.loadingTitle": "Завантаження даних",
  "home.loadingDescription": "Читаємо агрегати моделей.",
  "home.usageTitle": "Використання",
  "home.topModelsDescription": "Використання моделей в OpenCode Go.",
  "home.noUsageTitle": "Немає даних використання",
  "home.noUsageDescription": "Жодні рядки моделей не відповідали цьому продукту й діапазону.",
  "home.noLeaderboardTitle": "Немає даних рейтингу",
  "home.noLeaderboardDescription": "Жодні рядки моделей не відповідали цьому продукту й діапазону.",
  "home.productFilter": "Фільтр продукту",
  "home.dateRange": "Діапазон дат",
  "home.stackedUsageChart": "Складена діаграма використання найкращих моделей",
  "home.total": "усього",
  "home.modelUsers": "користувачі моделі",
  "home.new": "Нова",
  "home.uniqueUsersTitle": "Унікальні користувачі",
  "home.uniqueUsersDescription": "Щоденні унікальні користувачі OpenCode Go за моделлю.",
  "home.noUserDataTitle": "Немає даних користувачів",
  "home.noUserDataDescription": "Жодні рядки моделей із користувачами не відповідали цьому вікну.",
  "home.uniqueUsersChart": "Складена діаграма унікальних користувачів за моделлю",
  "home.marketShareTitle": "Частка ринку",
  "home.marketShareDescription": "Порівняйте частку токенів за автором моделі.",
  "home.noMarketTitle": "Немає ринкових даних",
  "home.noMarketDescription": "Жодні рядки моделей не відповідали цьому діапазону.",
  "home.marketChart": "Частка ринку за автором моделі",
  "home.noData": "Немає даних",
  "home.geoTitle": "Географічний розріз",
  "home.geoDescription": "Токени, використані за країнами.",
  "home.noGeoTitle": "Немає геоданих",
  "home.noGeoDescription": "Жодні географічні рядки не відповідали цьому діапазону.",
  "home.worldMap": "Карта світу використання токенів за країнами",
  "home.geoMapTitle": "Карта географічного розрізу",
  "home.unknown": "Невідомо",
  "home.tokenCostTitle": "Вартість токенів",
  "home.tokenCostDescription": "Ціна за 1 млн токенів.",
  "home.noTokenCostTitle": "Немає даних вартості токенів",
  "home.noTokenCostDescription": "Жодні рядки моделей із вартістю не відповідали цьому продукту.",
  "home.cacheRatioTitle": "Частка кешу",
  "home.cacheRatioDescription": "Частка вхідних токенів, обслужених із кешу.",
  "home.noCacheTitle": "Немає даних частки кешу",
  "home.noCacheDescription": "Жодні рядки моделей із вхідними токенами не відповідали цьому продукту.",
  "home.sessionCostTitle": "Вартість сеансу",
  "home.sessionCostDescription": "Середня вартість за сеанс.",
  "home.noSessionCostTitle": "Немає даних вартості сеансу",
  "home.noSessionCostDescription": "Жодні рядки моделей із сеансами не відповідали цьому продукту.",
  "home.costSession": "Вартість/сеанс",
  "lab.title": "Використання та рейтинги моделей ШІ {{lab}} | OpenCode Data",
  "lab.description": "Порівняйте моделі {{lab}}, які використовуються в OpenCode Go, зокрема використання токенів, рейтинги моделей, контекстні вікна, дати релізів, вартість і дані конкретних моделей.",
  "lab.loadingTitle": "Лабораторія моделей",
  "lab.loadingDescription": "Читаємо доступність моделей і нещодавнє використання OpenCode.",
  "lab.notFound": "Жодна модель не відповідала цій лабораторії.",
  "lab.heroPrefix": "Досліджуйте {{count}} моделей {{lab}}, що використовуються в OpenCode",
  "lab.heroIncluding": "зокрема {{models}}",
  "lab.heroSuffix": "Порівняйте нещодавнє використання токенів, контекстні вікна, дати релізів і дані конкретних моделей.",
  "lab.tokensProcessed": "Оброблені токени",
  "lab.pending": "Очікується",
  "lab.usageAfterActivity": "Використання з'явиться після активності моделі",
  "lab.latestRelease": "Останній реліз {{date}}",
  "lab.shareOfUsage": "{{share}} нещодавнього використання OpenCode",
  "lab.usageTitle": "Використання токенів {{lab}}",
  "lab.usageDescription": "Щоденний обсяг токенів OpenCode за останні два місяці.",
  "lab.noUsageTitle": "Використання поки немає",
  "lab.noUsageDescription": "Нещодавнє використання токенів з'явиться тут, коли ця лабораторія матиме активність.",
  "lab.dailyTokenChart": "Щоденна діаграма використання токенів {{lab}}",
  "lab.dailyTokens": "Щоденні токени",
  "lab.tokens": "токени",
  "lab.modelsTitle": "Моделі {{lab}}",
  "lab.modelsDescription": "Деталі каталогу плюс нещодавнє використання.",
  "lab.recentUsageAndLimits": "Нещодавнє використання та ліміти.",
  "lab.usage": "Використання",
  "lab.share": "Частка",
  "model.title": "Використання, вартість і ранг {{model}} | OpenCode Data",
  "model.description": "Перегляньте дані використання {{model}} в OpenCode Go, зокрема обсяг токенів, тижневий ранг, мікс токенів, вартість, частку кешу, сеанси, географічні розрізи та схожі моделі.",
  "model.loadingTitle": "Дані моделі",
  "model.loadingDescription": "Читаємо агрегати моделі.",
  "model.loadingProfile": "Читаємо профіль моделі.",
  "model.noDataTitle": "Немає даних моделі",
  "model.noDataDescription": "Спробуйте відкрити модель із рейтингу.",
  "model.noMatched": "Жодні факти моделі або рядки використання не відповідали {{id}}.",
  "model.fallback": "Модель",
  "model.catalogFallback": "Факти моделі зі спільного індексу моделей. Використання OpenCode Go з'явиться, коли ця модель матиме активність.",
  "model.unranked": "Без рейтингу у використанні OpenCode Go за минулий тиждень",
  "model.ranked": "Ранг #{{rank}} у використанні OpenCode Go за минулий тиждень",
  "model.observedVolume": "з {{share}} спостережуваного обсягу 2M.",
  "model.weights": "Ваги моделі: {{label}}",
  "model.rank": "Ранг за 7 дн.",
  "model.profile": "Профіль моделі",
  "model.listed": "У каталозі",
  "model.noCurrentUsage": "Немає використання OpenCode Go в поточному вікні даних.",
  "model.facts": "Факти моделі",
  "model.context": "Контекст",
  "model.output": "Вихід",
  "model.knowledge": "Знання",
  "model.release": "Реліз",
  "model.inputs": "Входи",
  "model.overviewDescription": "Нещодавні токени OpenCode Go, унікальні користувачі та ринкова позиція.",
  "model.noSummaryTitle": "Немає підсумку використання",
  "model.noSummaryDescription": "Ця модель ще не має рядків використання OpenCode Go.",
  "model.tokens": "Токени",
  "model.uniqueUsers": "Унікальні користувачі",
  "model.lastTwoMonths": "останні два місяці",
  "model.sessions": "Сеанси",
  "model.completedSessions": "завершені сеанси",
  "model.tokenShare": "Частка токенів",
  "model.totalModels": "{{count}} моделей",
  "model.momentum": "Динаміка",
  "model.vsPreviousWindow": "до попереднього вікна",
  "model.usageDescription": "Щоденний обсяг токенів OpenCode Go за нещодавнє двомісячне вікно.",
  "model.noUsageTitle": "Немає використання",
  "model.noUsageDescription": "У поточному вікні використання не з'явилося.",
  "model.dailyTokenChart": "Щоденна діаграма використання токенів",
  "model.usersDescription": "Щоденні унікальні користувачі OpenCode Go за нещодавнє двомісячне вікно.",
  "model.noUsersTitle": "Немає даних користувачів",
  "model.noUsersDescription": "У поточному вікні немає рядків із користувачами.",
  "model.dailyUserChart": "Щоденна діаграма унікальних користувачів",
  "model.efficiencyDescription": "Вартість, поведінка кешу та середня форма сеансу OpenCode Go.",
  "model.noEfficiencyTitle": "Немає даних ефективності",
  "model.noEfficiencyDescription": "Дані ефективності з'являться після використання.",
  "model.totalSpendLabel": "Total spend",
  "model.costInput": "Cost input",
  "model.costOutput": "Cost output",
  "model.averageCostSession": "Average cost / Session",
  "model.averageTokensSession": "Average tokens / session",
  "model.cost": "Вартість",
  "model.totalSpend": "загальні витрати",
  "model.costPerMillion": "Вартість / 1 млн",
  "model.inputOutput": "вхід / вихід",
  "model.observedTokens": "усі спостережувані токени",
  "model.costSession": "Вартість / сеанс",
  "model.average": "у середньому",
  "model.tokensSession": "Токени / сеанс",
  "model.cacheRatio": "Частка кешу",
  "model.inputTokens": "вхідні токени",
  "model.geoDescription": "Токени моделі OpenCode Go, використані за країнами.",
  "model.noGeoTitle": "Немає геоданих",
  "model.noGeoDescription": "Жодні географічні рядки OpenCode Go не відповідали цій моделі.",
  "model.worldMap": "Карта світу використання токенів моделі за країнами",
  "model.peersDescription": "Близькі моделі за нещодавнім обсягом токенів OpenCode Go.",
  "model.noPeersTitle": "Немає схожих моделей",
  "model.noPeersDescription": "Рейтинги схожих моделей з'являться після використання.",
  "model.noUsageLastWeek": "Немає використання минулого тижня",
  "model.newThisWeek": "Нова цього тижня",
  "model.sameAsPreviousWeek": "Без змін відносно попереднього тижня",
  "model.vsPreviousWeek": "{{change}} до попереднього тижня",
  "model.pdf": "PDF",
  "format.users": "користувачі",
  "format.tokens": "токени"
};
const dict$2 = {
  "app.title": "AI 模型使用排名 | OpenCode 数据",
  "app.description": "探索 OpenCode Go 在各 AI 模型上的使用情况，包括 token 用量、排名、市场份额、token 价格、会话成本、缓存比例和地理分布。",
  "app.unfurlAlt": "深色纹理背景上的 OpenCode Data 字标",
  "nav.dataHome": "数据首页",
  "nav.topModels": "热门模型",
  "nav.leaderboard": "排行榜",
  "nav.uniqueUsers": "独立用户",
  "nav.sessionCost": "会话成本",
  "nav.tokenCost": "Token 成本",
  "nav.cacheRatio": "缓存比例",
  "nav.marketShare": "市场份额",
  "nav.geoBreakdown": "地理分布",
  "nav.overview": "概览",
  "nav.usage": "用量",
  "nav.users": "用户",
  "nav.efficiency": "效率",
  "nav.peers": "同类模型",
  "nav.models": "模型",
  "header.brandLabel": "数据首页",
  "header.sectionNavLabel": "数据分区",
  "header.githubAria": "在 GitHub 上为 OpenCode 加星",
  "header.github": "GitHub",
  "header.tryOpenCode": "试用 OpenCode",
  "header.openNav": "打开导航",
  "header.closeNav": "关闭导航",
  "theme.groupLabel": "主题",
  "theme.dark": "深色",
  "theme.light": "浅色",
  "theme.system": "跟随系统",
  "footer.modelData": "模型数据",
  "footer.legal": "法律",
  "footer.connect": "联系",
  "footer.newsletter": "新闻通讯",
  "footer.newsletterBody": "第一时间了解新版本发布。",
  "footer.language": "语言",
  "footer.subscribe": "订阅",
  "footer.terms": "服务条款",
  "footer.privacy": "隐私政策",
  "footer.contact": "联系我们",
  "footer.community": "社区",
  "footer.youtube": "YouTube",
  "footer.homeAria": "OpenCode 首页",
  "footer.status": "所有系统运行正常",
  "footer.copyright": "© 2026 Anomaly Innovations Inc.",
  "bridge.learnMore": "了解更多",
  "modal.closeNewsletter": "关闭新闻通讯注册",
  "modal.title": "OpenCode 新闻通讯",
  "modal.body": "第一时间了解\n新版本发布。",
  "modal.email": "电子邮箱地址",
  "modal.subscribe": "订阅",
  "modal.subscribing": "正在订阅...",
  "modal.success": "你已订阅。",
  "modal.error": "订阅失败",
  "product.allUsers": "所有用户",
  "product.zen": "Zen",
  "product.go": "Go",
  "range.1D": "1 天",
  "range.1W": "1 周",
  "range.2W": "2 周",
  "range.1M": "1 个月",
  "range.2M": "2 个月",
  "chart.daily": "每日",
  "chart.input": "输入",
  "chart.output": "输出",
  "chart.cached": "已缓存",
  "chart.uncached": "未缓存",
  "chart.ratio": "比例",
  "chart.model": "模型",
  "chart.cacheRatio": "缓存比例",
  "chart.costSession": "成本/会话",
  "chart.tokensSession": "Token/会话",
  "chart.costPerSession": "成本 / 会话",
  "chart.tokensPerSession": "Token / 会话",
  "chart.live": "实时",
  "chart.percent": "百分比",
  "chart.leaderboardAria": "模型 token 排行榜",
  "chart.scrollableLeaderboardAria": "可滚动的模型 token 排行榜",
  "chart.byAuthor": "作者：{{author}}",
  "home.updated": "已更新",
  "home.noRows": "暂无数据行",
  "home.justNow": "刚刚",
  "home.heroCopy": "查看哪些模型正在赢得真实使用量、使用组合如何变化，以及这对成本意味着什么。",
  "home.loadingTitle": "正在加载数据",
  "home.loadingDescription": "正在读取模型汇总。",
  "home.usageTitle": "用量",
  "home.topModelsDescription": "OpenCode Go 中各模型的使用情况。",
  "home.noUsageTitle": "无使用数据",
  "home.noUsageDescription": "没有符合该产品和时间范围的模型行。",
  "home.noLeaderboardTitle": "无排行榜数据",
  "home.noLeaderboardDescription": "没有符合该产品和时间范围的模型行。",
  "home.productFilter": "产品筛选",
  "home.dateRange": "日期范围",
  "home.stackedUsageChart": "热门模型用量堆叠图",
  "home.total": "总计",
  "home.modelUsers": "模型用户",
  "home.new": "新",
  "home.uniqueUsersTitle": "独立用户",
  "home.uniqueUsersDescription": "按模型显示的每日 OpenCode Go 独立用户。",
  "home.noUserDataTitle": "无用户数据",
  "home.noUserDataDescription": "没有符合该窗口且包含用户的模型行。",
  "home.uniqueUsersChart": "按模型显示的独立用户堆叠图",
  "home.marketShareTitle": "市场份额",
  "home.marketShareDescription": "按模型作者比较 token 份额。",
  "home.noMarketTitle": "无市场数据",
  "home.noMarketDescription": "没有符合该时间范围的模型行。",
  "home.marketChart": "按模型作者显示的市场份额",
  "home.noData": "无数据",
  "home.geoTitle": "地理分布",
  "home.geoDescription": "按国家/地区统计的 token 使用量。",
  "home.noGeoTitle": "无地理数据",
  "home.noGeoDescription": "没有符合该时间范围的地理行。",
  "home.worldMap": "按国家/地区显示 token 使用量的世界地图",
  "home.geoMapTitle": "地理分布地图",
  "home.unknown": "未知",
  "home.tokenCostTitle": "Token 成本",
  "home.tokenCostDescription": "每 100 万 token 的价格。",
  "home.noTokenCostTitle": "无 token 成本数据",
  "home.noTokenCostDescription": "没有符合该产品且包含成本的模型行。",
  "home.cacheRatioTitle": "缓存比例",
  "home.cacheRatioDescription": "从缓存提供的输入 token 占比。",
  "home.noCacheTitle": "无缓存比例数据",
  "home.noCacheDescription": "没有符合该产品且包含输入 token 的模型行。",
  "home.sessionCostTitle": "会话成本",
  "home.sessionCostDescription": "每次会话的平均成本。",
  "home.noSessionCostTitle": "无会话成本数据",
  "home.noSessionCostDescription": "没有符合该产品且包含会话的模型行。",
  "home.costSession": "成本/会话",
  "lab.title": "{{lab}} AI 模型使用量与排名 | OpenCode 数据",
  "lab.description": "比较在 OpenCode Go 中使用的 {{lab}} 模型，包括 token 用量、模型排名、上下文窗口、发布日期、成本和模型专属数据。",
  "lab.loadingTitle": "模型实验室",
  "lab.loadingDescription": "正在读取模型可用性和近期 OpenCode 使用情况。",
  "lab.notFound": "没有匹配此实验室的模型。",
  "lab.heroPrefix": "探索 OpenCode 中使用的 {{count}} 个 {{lab}} 模型",
  "lab.heroIncluding": "包括 {{models}}",
  "lab.heroSuffix": "比较近期 token 用量、上下文窗口、发布日期和模型专属数据。",
  "lab.tokensProcessed": "已处理 Token",
  "lab.pending": "待定",
  "lab.usageAfterActivity": "模型活动到达后会显示使用量",
  "lab.latestRelease": "最新发布 {{date}}",
  "lab.shareOfUsage": "占近期 OpenCode 使用量的 {{share}}",
  "lab.usageTitle": "{{lab}} token 用量",
  "lab.usageDescription": "过去两个月的每日 OpenCode token 用量。",
  "lab.noUsageTitle": "暂无使用量",
  "lab.noUsageDescription": "此实验室有活动后，近期 token 用量会显示在这里。",
  "lab.dailyTokenChart": "{{lab}} 每日 token 用量图",
  "lab.dailyTokens": "每日 token",
  "lab.tokens": "token",
  "lab.modelsTitle": "{{lab}} 模型",
  "lab.modelsDescription": "目录详情与近期使用量。",
  "lab.recentUsageAndLimits": "近期使用量和限制。",
  "lab.usage": "用量",
  "lab.share": "份额",
  "model.title": "{{model}} 使用量、成本与排名 | OpenCode 数据",
  "model.description": "查看 {{model}} 的 OpenCode Go 使用数据，包括 token 用量、周排名、token 组合、成本、缓存比例、会话、地理分布和同类模型。",
  "model.loadingTitle": "模型数据",
  "model.loadingDescription": "正在读取模型汇总。",
  "model.loadingProfile": "正在读取模型档案。",
  "model.noDataTitle": "无模型数据",
  "model.noDataDescription": "请尝试从排行榜打开一个模型。",
  "model.noMatched": "没有匹配 {{id}} 的模型事实或使用行。",
  "model.fallback": "模型",
  "model.catalogFallback": "来自共享模型索引的模型事实。此模型产生活动后会显示 OpenCode Go 使用量。",
  "model.unranked": "未进入上周 OpenCode Go 使用量排名",
  "model.ranked": "在上周 OpenCode Go 使用量中排名 #{{rank}}",
  "model.observedVolume": "占观测到的 2M 用量的 {{share}}。",
  "model.weights": "模型权重：{{label}}",
  "model.rank": "7 日排名",
  "model.profile": "模型档案",
  "model.listed": "已列出",
  "model.noCurrentUsage": "当前数据窗口中没有 OpenCode Go 使用量。",
  "model.facts": "模型事实",
  "model.context": "上下文",
  "model.output": "输出",
  "model.knowledge": "知识",
  "model.release": "发布",
  "model.inputs": "输入",
  "model.overviewDescription": "近期 OpenCode Go token、独立用户和市场位置。",
  "model.noSummaryTitle": "无使用摘要",
  "model.noSummaryDescription": "此模型尚无 OpenCode Go 使用行。",
  "model.tokens": "Token",
  "model.uniqueUsers": "独立用户",
  "model.lastTwoMonths": "过去两个月",
  "model.sessions": "会话",
  "model.completedSessions": "已完成会话",
  "model.tokenShare": "Token 份额",
  "model.totalModels": "{{count}} 个模型",
  "model.momentum": "趋势",
  "model.vsPreviousWindow": "相较上一窗口",
  "model.usageDescription": "近期两个月窗口内的每日 OpenCode Go token 用量。",
  "model.noUsageTitle": "无使用量",
  "model.noUsageDescription": "当前窗口中没有使用量。",
  "model.dailyTokenChart": "每日 token 用量图",
  "model.usersDescription": "近期两个月窗口内的每日 OpenCode Go 独立用户。",
  "model.noUsersTitle": "无用户数据",
  "model.noUsersDescription": "当前窗口中没有包含用户的行。",
  "model.dailyUserChart": "每日独立用户图",
  "model.efficiencyDescription": "成本、缓存行为和平均 OpenCode Go 会话形态。",
  "model.noEfficiencyTitle": "无效率数据",
  "model.noEfficiencyDescription": "使用量到达后会显示效率数据。",
  "model.totalSpendLabel": "Total spend",
  "model.costInput": "Cost input",
  "model.costOutput": "Cost output",
  "model.averageCostSession": "Average cost / Session",
  "model.averageTokensSession": "Average tokens / session",
  "model.cost": "成本",
  "model.totalSpend": "总支出",
  "model.costPerMillion": "每 100 万成本",
  "model.inputOutput": "输入 / 输出",
  "model.observedTokens": "观测到的全部 token",
  "model.costSession": "成本 / 会话",
  "model.average": "平均",
  "model.tokensSession": "Token / 会话",
  "model.cacheRatio": "缓存比例",
  "model.inputTokens": "输入 token",
  "model.geoDescription": "按国家/地区统计的 OpenCode Go 模型 token 使用量。",
  "model.noGeoTitle": "无地理数据",
  "model.noGeoDescription": "没有符合此模型的 OpenCode Go 地理行。",
  "model.worldMap": "按国家/地区显示模型 token 使用量的世界地图",
  "model.peersDescription": "按近期 OpenCode Go token 用量排列的相近模型。",
  "model.noPeersTitle": "无同类模型",
  "model.noPeersDescription": "使用量到达后会显示同类模型排名。",
  "model.noUsageLastWeek": "上周无使用量",
  "model.newThisWeek": "本周新增",
  "model.sameAsPreviousWeek": "与上周相同",
  "model.vsPreviousWeek": "较上周 {{change}}",
  "model.pdf": "PDF",
  "format.users": "用户",
  "format.tokens": "token"
};
const dict$1 = {
  "app.title": "AI 模型使用排名 | OpenCode 數據",
  "app.description": "探索 OpenCode Go 在各 AI 模型上的使用情況，包括 token 用量、排名、市場佔有率、token 價格、工作階段成本、快取比例和地理分布。",
  "app.unfurlAlt": "深色紋理背景上的 OpenCode Data 字標",
  "nav.dataHome": "數據首頁",
  "nav.topModels": "熱門模型",
  "nav.leaderboard": "排行榜",
  "nav.uniqueUsers": "不重複使用者",
  "nav.sessionCost": "工作階段成本",
  "nav.tokenCost": "Token 成本",
  "nav.cacheRatio": "快取比例",
  "nav.marketShare": "市場佔有率",
  "nav.geoBreakdown": "地理分布",
  "nav.overview": "總覽",
  "nav.usage": "用量",
  "nav.users": "使用者",
  "nav.efficiency": "效率",
  "nav.peers": "同類模型",
  "nav.models": "模型",
  "header.brandLabel": "數據首頁",
  "header.sectionNavLabel": "數據分區",
  "header.githubAria": "在 GitHub 上為 OpenCode 加星",
  "header.github": "GitHub",
  "header.tryOpenCode": "試用 OpenCode",
  "header.openNav": "開啟導覽",
  "header.closeNav": "關閉導覽",
  "theme.groupLabel": "主題",
  "theme.dark": "深色",
  "theme.light": "淺色",
  "theme.system": "跟隨系統",
  "footer.modelData": "模型數據",
  "footer.legal": "法律",
  "footer.connect": "聯絡",
  "footer.newsletter": "電子報",
  "footer.newsletterBody": "第一時間了解新版本發布。",
  "footer.language": "語言",
  "footer.subscribe": "訂閱",
  "footer.terms": "服務條款",
  "footer.privacy": "隱私權政策",
  "footer.contact": "聯絡我們",
  "footer.community": "社群",
  "footer.youtube": "YouTube",
  "footer.homeAria": "OpenCode 首頁",
  "footer.status": "所有系統運作正常",
  "footer.copyright": "© 2026 Anomaly Innovations Inc.",
  "bridge.learnMore": "了解更多",
  "modal.closeNewsletter": "關閉電子報註冊",
  "modal.title": "OpenCode 電子報",
  "modal.body": "第一時間了解\n新版本發布。",
  "modal.email": "電子郵件地址",
  "modal.subscribe": "訂閱",
  "modal.subscribing": "正在訂閱...",
  "modal.success": "你已訂閱。",
  "modal.error": "訂閱失敗",
  "product.allUsers": "所有使用者",
  "product.zen": "Zen",
  "product.go": "Go",
  "range.1D": "1 天",
  "range.1W": "1 週",
  "range.2W": "2 週",
  "range.1M": "1 個月",
  "range.2M": "2 個月",
  "chart.daily": "每日",
  "chart.input": "輸入",
  "chart.output": "輸出",
  "chart.cached": "已快取",
  "chart.uncached": "未快取",
  "chart.ratio": "比例",
  "chart.model": "模型",
  "chart.cacheRatio": "快取比例",
  "chart.costSession": "成本/工作階段",
  "chart.tokensSession": "Token/工作階段",
  "chart.costPerSession": "成本 / 工作階段",
  "chart.tokensPerSession": "Token / 工作階段",
  "chart.live": "即時",
  "chart.percent": "百分比",
  "chart.leaderboardAria": "模型 token 排行榜",
  "chart.scrollableLeaderboardAria": "可捲動的模型 token 排行榜",
  "chart.byAuthor": "作者：{{author}}",
  "home.updated": "已更新",
  "home.noRows": "暫無資料列",
  "home.justNow": "剛剛",
  "home.heroCopy": "查看哪些模型正在贏得真實使用量、使用組合如何變化，以及這對成本意味著什麼。",
  "home.loadingTitle": "正在載入數據",
  "home.loadingDescription": "正在讀取模型彙總。",
  "home.usageTitle": "用量",
  "home.topModelsDescription": "OpenCode Go 中各模型的使用情況。",
  "home.noUsageTitle": "無使用數據",
  "home.noUsageDescription": "沒有符合該產品和時間範圍的模型列。",
  "home.noLeaderboardTitle": "無排行榜數據",
  "home.noLeaderboardDescription": "沒有符合該產品和時間範圍的模型列。",
  "home.productFilter": "產品篩選",
  "home.dateRange": "日期範圍",
  "home.stackedUsageChart": "熱門模型用量堆疊圖",
  "home.total": "總計",
  "home.modelUsers": "模型使用者",
  "home.new": "新",
  "home.uniqueUsersTitle": "不重複使用者",
  "home.uniqueUsersDescription": "按模型顯示的每日 OpenCode Go 不重複使用者。",
  "home.noUserDataTitle": "無使用者數據",
  "home.noUserDataDescription": "沒有符合該視窗且包含使用者的模型列。",
  "home.uniqueUsersChart": "按模型顯示的不重複使用者堆疊圖",
  "home.marketShareTitle": "市場佔有率",
  "home.marketShareDescription": "按模型作者比較 token 佔有率。",
  "home.noMarketTitle": "無市場數據",
  "home.noMarketDescription": "沒有符合該時間範圍的模型列。",
  "home.marketChart": "按模型作者顯示的市場佔有率",
  "home.noData": "無數據",
  "home.geoTitle": "地理分布",
  "home.geoDescription": "按國家/地區統計的 token 使用量。",
  "home.noGeoTitle": "無地理數據",
  "home.noGeoDescription": "沒有符合該時間範圍的地理列。",
  "home.worldMap": "按國家/地區顯示 token 使用量的世界地圖",
  "home.geoMapTitle": "地理分布地圖",
  "home.unknown": "未知",
  "home.tokenCostTitle": "Token 成本",
  "home.tokenCostDescription": "每 100 萬 token 的價格。",
  "home.noTokenCostTitle": "無 token 成本數據",
  "home.noTokenCostDescription": "沒有符合該產品且包含成本的模型列。",
  "home.cacheRatioTitle": "快取比例",
  "home.cacheRatioDescription": "由快取提供的輸入 token 佔比。",
  "home.noCacheTitle": "無快取比例數據",
  "home.noCacheDescription": "沒有符合該產品且包含輸入 token 的模型列。",
  "home.sessionCostTitle": "工作階段成本",
  "home.sessionCostDescription": "每個工作階段的平均成本。",
  "home.noSessionCostTitle": "無工作階段成本數據",
  "home.noSessionCostDescription": "沒有符合該產品且包含工作階段的模型列。",
  "home.costSession": "成本/工作階段",
  "lab.title": "{{lab}} AI 模型使用量與排名 | OpenCode 數據",
  "lab.description": "比較在 OpenCode Go 中使用的 {{lab}} 模型，包括 token 用量、模型排名、上下文視窗、發布日期、成本和模型專屬數據。",
  "lab.loadingTitle": "模型實驗室",
  "lab.loadingDescription": "正在讀取模型可用性和近期 OpenCode 使用情況。",
  "lab.notFound": "沒有符合此實驗室的模型。",
  "lab.heroPrefix": "探索 OpenCode 中使用的 {{count}} 個 {{lab}} 模型",
  "lab.heroIncluding": "包括 {{models}}",
  "lab.heroSuffix": "比較近期 token 用量、上下文視窗、發布日期和模型專屬數據。",
  "lab.tokensProcessed": "已處理 Token",
  "lab.pending": "待定",
  "lab.usageAfterActivity": "模型活動到達後會顯示使用量",
  "lab.latestRelease": "最新發布 {{date}}",
  "lab.shareOfUsage": "佔近期 OpenCode 使用量的 {{share}}",
  "lab.usageTitle": "{{lab}} token 用量",
  "lab.usageDescription": "過去兩個月的每日 OpenCode token 用量。",
  "lab.noUsageTitle": "暫無使用量",
  "lab.noUsageDescription": "此實驗室有活動後，近期 token 用量會顯示在這裡。",
  "lab.dailyTokenChart": "{{lab}} 每日 token 用量圖",
  "lab.dailyTokens": "每日 token",
  "lab.tokens": "token",
  "lab.modelsTitle": "{{lab}} 模型",
  "lab.modelsDescription": "目錄詳情與近期使用量。",
  "lab.recentUsageAndLimits": "近期使用量和限制。",
  "lab.usage": "用量",
  "lab.share": "佔比",
  "model.title": "{{model}} 使用量、成本與排名 | OpenCode 數據",
  "model.description": "查看 {{model}} 的 OpenCode Go 使用數據，包括 token 用量、週排名、token 組合、成本、快取比例、工作階段、地理分布和同類模型。",
  "model.loadingTitle": "模型數據",
  "model.loadingDescription": "正在讀取模型彙總。",
  "model.loadingProfile": "正在讀取模型檔案。",
  "model.noDataTitle": "無模型數據",
  "model.noDataDescription": "請嘗試從排行榜開啟一個模型。",
  "model.noMatched": "沒有符合 {{id}} 的模型事實或使用列。",
  "model.fallback": "模型",
  "model.catalogFallback": "來自共享模型索引的模型事實。此模型產生活動後會顯示 OpenCode Go 使用量。",
  "model.unranked": "未進入上週 OpenCode Go 使用量排名",
  "model.ranked": "在上週 OpenCode Go 使用量中排名 #{{rank}}",
  "model.observedVolume": "佔觀測到的 2M 用量的 {{share}}。",
  "model.weights": "模型權重：{{label}}",
  "model.rank": "7 日排名",
  "model.profile": "模型檔案",
  "model.listed": "已列出",
  "model.noCurrentUsage": "目前數據視窗中沒有 OpenCode Go 使用量。",
  "model.facts": "模型事實",
  "model.context": "上下文",
  "model.output": "輸出",
  "model.knowledge": "知識",
  "model.release": "發布",
  "model.inputs": "輸入",
  "model.overviewDescription": "近期 OpenCode Go token、不重複使用者和市場位置。",
  "model.noSummaryTitle": "無使用摘要",
  "model.noSummaryDescription": "此模型尚無 OpenCode Go 使用列。",
  "model.tokens": "Token",
  "model.uniqueUsers": "不重複使用者",
  "model.lastTwoMonths": "過去兩個月",
  "model.sessions": "工作階段",
  "model.completedSessions": "已完成工作階段",
  "model.tokenShare": "Token 佔比",
  "model.totalModels": "{{count}} 個模型",
  "model.momentum": "趨勢",
  "model.vsPreviousWindow": "相較上一視窗",
  "model.usageDescription": "近期兩個月視窗內的每日 OpenCode Go token 用量。",
  "model.noUsageTitle": "無使用量",
  "model.noUsageDescription": "目前視窗中沒有使用量。",
  "model.dailyTokenChart": "每日 token 用量圖",
  "model.usersDescription": "近期兩個月視窗內的每日 OpenCode Go 不重複使用者。",
  "model.noUsersTitle": "無使用者數據",
  "model.noUsersDescription": "目前視窗中沒有包含使用者的列。",
  "model.dailyUserChart": "每日不重複使用者圖",
  "model.efficiencyDescription": "成本、快取行為和平均 OpenCode Go 工作階段形態。",
  "model.noEfficiencyTitle": "無效率數據",
  "model.noEfficiencyDescription": "使用量到達後會顯示效率數據。",
  "model.totalSpendLabel": "Total spend",
  "model.costInput": "Cost input",
  "model.costOutput": "Cost output",
  "model.averageCostSession": "Average cost / Session",
  "model.averageTokensSession": "Average tokens / session",
  "model.cost": "成本",
  "model.totalSpend": "總支出",
  "model.costPerMillion": "每 100 萬成本",
  "model.inputOutput": "輸入 / 輸出",
  "model.observedTokens": "觀測到的全部 token",
  "model.costSession": "成本 / 工作階段",
  "model.average": "平均",
  "model.tokensSession": "Token / 工作階段",
  "model.cacheRatio": "快取比例",
  "model.inputTokens": "輸入 token",
  "model.geoDescription": "按國家/地區統計的 OpenCode Go 模型 token 使用量。",
  "model.noGeoTitle": "無地理數據",
  "model.noGeoDescription": "沒有符合此模型的 OpenCode Go 地理列。",
  "model.worldMap": "按國家/地區顯示模型 token 使用量的世界地圖",
  "model.peersDescription": "按近期 OpenCode Go token 用量排列的相近模型。",
  "model.noPeersTitle": "無同類模型",
  "model.noPeersDescription": "使用量到達後會顯示同類模型排名。",
  "model.noUsageLastWeek": "上週無使用量",
  "model.newThisWeek": "本週新增",
  "model.sameAsPreviousWeek": "與上週相同",
  "model.vsPreviousWeek": "較上週 {{change}}",
  "model.pdf": "PDF",
  "format.users": "使用者",
  "format.tokens": "token"
};
const en = {
  "app.title": "AI Model Usage Rankings | OpenCode Data",
  "app.description": "Explore OpenCode Go usage across AI models, including token volume, rankings, market share, token pricing, session cost, cache ratio, and geo breakdowns.",
  "app.unfurlAlt": "OpenCode Data wordmark on a dark patterned background",
  "nav.dataHome": "Data Home",
  "nav.topModels": "Top Models",
  "nav.leaderboard": "Leaderboard",
  "nav.uniqueUsers": "Unique Users",
  "nav.sessionCost": "Session Cost",
  "nav.tokenCost": "Token Cost",
  "nav.cacheRatio": "Cache Ratio",
  "nav.marketShare": "Market Share",
  "nav.geoBreakdown": "Geo Breakdown",
  "nav.overview": "Overview",
  "nav.usage": "Usage",
  "nav.users": "Users",
  "nav.efficiency": "Efficiency",
  "nav.peers": "Peers",
  "nav.models": "Models",
  "header.brandLabel": "Data home",
  "header.sectionNavLabel": "Data sections",
  "header.githubAria": "Star OpenCode on GitHub",
  "header.github": "GitHub",
  "header.tryOpenCode": "Try OpenCode",
  "header.openNav": "Open navigation",
  "header.closeNav": "Close navigation",
  "theme.groupLabel": "Theme",
  "theme.dark": "Dark",
  "theme.light": "Light",
  "theme.system": "System",
  "footer.modelData": "Model Data",
  "footer.legal": "Legal",
  "footer.connect": "Connect",
  "footer.newsletter": "Newsletter",
  "footer.newsletterBody": "Be the first to know about new releases.",
  "footer.language": "Language",
  "footer.subscribe": "Subscribe",
  "footer.terms": "Terms of service",
  "footer.privacy": "Privacy policy",
  "footer.contact": "Contact us",
  "footer.community": "Community",
  "footer.youtube": "YouTube",
  "footer.homeAria": "OpenCode home",
  "footer.status": "All systems Operational",
  "footer.copyright": "© 2026 Anomaly Innovations Inc.",
  "bridge.learnMore": "LEARN MORE",
  "modal.closeNewsletter": "Close newsletter signup",
  "modal.title": "OpenCode Newsletter",
  "modal.body": "Be the first to know\nabout new releases.",
  "modal.email": "Email address",
  "modal.subscribe": "Subscribe",
  "modal.subscribing": "Subscribing...",
  "modal.success": "You're subscribed.",
  "modal.error": "Failed to subscribe",
  "product.allUsers": "All Users",
  "product.zen": "Zen",
  "product.go": "Go",
  "range.1D": "1 Day",
  "range.1W": "1 Week",
  "range.2W": "2 Weeks",
  "range.1M": "1 Month",
  "range.2M": "2 Months",
  "chart.daily": "Daily",
  "chart.input": "Input",
  "chart.output": "Output",
  "chart.cached": "Cached",
  "chart.uncached": "Uncached",
  "chart.ratio": "Ratio",
  "chart.model": "Model",
  "chart.cacheRatio": "Cache Ratio",
  "chart.costSession": "Cost/Session",
  "chart.tokensSession": "Tokens/Session",
  "chart.costPerSession": "COST / SESSION",
  "chart.tokensPerSession": "TOKENS / SESSION",
  "chart.live": "Live",
  "chart.percent": "percent",
  "chart.leaderboardAria": "Model token leaderboard",
  "chart.scrollableLeaderboardAria": "Scrollable model token leaderboard",
  "chart.byAuthor": "by {{author}}",
  "home.updated": "Updated",
  "home.noRows": "No rows yet",
  "home.justNow": "just now",
  "home.heroCopy": "See which models are winning real usage, how the mix is shifting, and what that means for cost.",
  "home.loadingTitle": "Loading data",
  "home.loadingDescription": "Reading model aggregates.",
  "home.usageTitle": "Usage",
  "home.topModelsDescription": "Usage of models across OpenCode Go.",
  "home.noUsageTitle": "No usage data",
  "home.noUsageDescription": "No model rows matched this product and range.",
  "home.noLeaderboardTitle": "No leaderboard data",
  "home.noLeaderboardDescription": "No model rows matched this product and range.",
  "home.productFilter": "Product filter",
  "home.dateRange": "Date range",
  "home.stackedUsageChart": "Stacked top model usage chart",
  "home.total": "total",
  "home.modelUsers": "model users",
  "home.new": "New",
  "home.uniqueUsersTitle": "Unique Users",
  "home.uniqueUsersDescription": "Daily unique OpenCode Go users by model.",
  "home.noUserDataTitle": "No user data",
  "home.noUserDataDescription": "No user-bearing model rows matched this window.",
  "home.uniqueUsersChart": "Stacked unique user chart by model",
  "home.marketShareTitle": "Market Share",
  "home.marketShareDescription": "Compare token share by model author.",
  "home.noMarketTitle": "No market data",
  "home.noMarketDescription": "No model rows matched this range.",
  "home.marketChart": "Market share by model author",
  "home.noData": "No data",
  "home.geoTitle": "Geo Breakdown",
  "home.geoDescription": "Tokens used by country.",
  "home.noGeoTitle": "No geo data",
  "home.noGeoDescription": "No geo rows matched this range.",
  "home.worldMap": "World map of token usage by country",
  "home.geoMapTitle": "Geo Breakdown map",
  "home.unknown": "Unknown",
  "home.tokenCostTitle": "Token Cost",
  "home.tokenCostDescription": "Price per 1M tokens.",
  "home.noTokenCostTitle": "No token cost data",
  "home.noTokenCostDescription": "No cost-bearing model rows matched this product.",
  "home.cacheRatioTitle": "Cache Ratio",
  "home.cacheRatioDescription": "Share of input tokens served from cache.",
  "home.noCacheTitle": "No cache ratio data",
  "home.noCacheDescription": "No input-token model rows matched this product.",
  "home.sessionCostTitle": "Session Cost",
  "home.sessionCostDescription": "Average cost per session.",
  "home.noSessionCostTitle": "No session cost data",
  "home.noSessionCostDescription": "No session-bearing model rows matched this product.",
  "home.costSession": "Cost/Session",
  "lab.title": "{{lab}} AI Model Usage & Rankings | OpenCode Data",
  "lab.description": "Compare {{lab}} models used in OpenCode Go, including token usage, model rankings, context windows, release dates, costs, and model-specific data.",
  "lab.loadingTitle": "Model Lab",
  "lab.loadingDescription": "Reading model availability and recent OpenCode usage.",
  "lab.notFound": "No models matched this lab.",
  "lab.heroPrefix": "Explore {{count}} {{lab}} models used in OpenCode",
  "lab.heroIncluding": "including {{models}}",
  "lab.heroSuffix": "Compare recent token usage, context windows, release dates, and model data.",
  "lab.tokensProcessed": "Tokens Processed",
  "lab.pending": "Pending",
  "lab.usageAfterActivity": "Usage appears after model activity lands",
  "lab.latestRelease": "Latest release {{date}}",
  "lab.shareOfUsage": "{{share}} of recent OpenCode usage",
  "lab.usageTitle": "{{lab}} token usage",
  "lab.usageDescription": "Daily token volume.",
  "lab.noUsageTitle": "No usage yet",
  "lab.noUsageDescription": "Recent token usage appears here once this lab has activity.",
  "lab.dailyTokenChart": "{{lab}} daily token usage chart",
  "lab.dailyTokens": "Daily tokens",
  "lab.tokens": "tokens",
  "lab.modelsTitle": "{{lab}} models",
  "lab.modelsDescription": "Catalog details plus recent usage.",
  "lab.recentUsageAndLimits": "Recent usage and limits.",
  "lab.usage": "Usage",
  "lab.share": "Share",
  "model.title": "{{model}} Usage, Cost & Rank | OpenCode Data",
  "model.description": "View {{model}} OpenCode Go usage data, including token volume, weekly rank, token mix, costs, cache ratio, sessions, geo breakdowns, and peer models.",
  "model.loadingTitle": "Model Data",
  "model.loadingDescription": "Reading model aggregates.",
  "model.loadingProfile": "Reading the model profile.",
  "model.noDataTitle": "No model data",
  "model.noDataDescription": "Try opening a model from the leaderboard.",
  "model.noMatched": "No model facts or usage rows matched {{id}}.",
  "model.fallback": "Model",
  "model.catalogFallback": "Model facts from the shared model index. OpenCode Go usage appears once this model has activity.",
  "model.unranked": "Unranked across last week's OpenCode Go usage",
  "model.ranked": "Ranked #{{rank}} across last week's OpenCode Go usage",
  "model.observedVolume": "with {{share}} of observed 2M volume.",
  "model.weights": "Model weights: {{label}}",
  "model.rank": "7D Rank",
  "model.profile": "Model Profile",
  "model.listed": "Listed",
  "model.noCurrentUsage": "No OpenCode Go usage in the current data window.",
  "model.facts": "Model facts",
  "model.context": "Context",
  "model.output": "Output",
  "model.knowledge": "Knowledge",
  "model.release": "Release",
  "model.inputs": "Inputs",
  "model.overviewDescription": "Recent tokens, unique users, and market position.",
  "model.noSummaryTitle": "No usage summary",
  "model.noSummaryDescription": "This model has no OpenCode Go usage rows yet.",
  "model.tokens": "Tokens",
  "model.uniqueUsers": "Unique Users",
  "model.lastTwoMonths": "last two months",
  "model.sessions": "Sessions",
  "model.completedSessions": "completed sessions",
  "model.tokenShare": "Token Share",
  "model.totalModels": "{{count}} models",
  "model.momentum": "Momentum",
  "model.vsPreviousWindow": "vs previous window",
  "model.usageDescription": "Daily token volume.",
  "model.noUsageTitle": "No usage",
  "model.noUsageDescription": "No usage landed in the current window.",
  "model.dailyTokenChart": "Daily token usage chart",
  "model.usersDescription": "Daily unique users.",
  "model.noUsersTitle": "No user data",
  "model.noUsersDescription": "No user-bearing rows landed in the current window.",
  "model.dailyUserChart": "Daily unique user chart",
  "model.efficiencyDescription": "Cost, cache behavior, and average session shape.",
  "model.noEfficiencyTitle": "No efficiency data",
  "model.noEfficiencyDescription": "Efficiency data appears after usage lands.",
  "model.totalSpendLabel": "Total spend",
  "model.cost": "Cost",
  "model.totalSpend": "total spend",
  "model.costPerMillion": "Cost / 1M",
  "model.costInput": "Cost input",
  "model.costOutput": "Cost output",
  "model.inputOutput": "input / output",
  "model.observedTokens": "observed all tokens",
  "model.costSession": "Cost / Session",
  "model.averageCostSession": "Average cost / Session",
  "model.average": "average",
  "model.tokensSession": "Tokens / Session",
  "model.averageTokensSession": "Average tokens / session",
  "model.cacheRatio": "Cache Ratio",
  "model.inputTokens": "input tokens",
  "model.geoDescription": "OpenCode Go model tokens used by country.",
  "model.noGeoTitle": "No geo data",
  "model.noGeoDescription": "No OpenCode Go geo rows matched this model.",
  "model.worldMap": "World map of model token usage by country",
  "model.peersDescription": "Nearby models by recent OpenCode Go token volume.",
  "model.noPeersTitle": "No peers",
  "model.noPeersDescription": "Peer rankings appear after usage lands.",
  "model.noUsageLastWeek": "No usage last week",
  "model.newThisWeek": "New this week",
  "model.sameAsPreviousWeek": "Same as previous week",
  "model.vsPreviousWeek": "{{change}} vs previous week",
  "model.pdf": "PDF",
  "format.users": "users",
  "format.tokens": "tokens"
};
const dictionaries = {
  ar: dict$h,
  br: dict$g,
  da: dict$f,
  de: dict$e,
  en,
  es: dict$d,
  fr: dict$c,
  it: dict$b,
  ja: dict$a,
  ko: dict$9,
  no: dict$8,
  pl: dict$7,
  ru: dict$6,
  th: dict$5,
  tr: dict$4,
  uk: dict$3,
  zh: dict$2,
  zht: dict$1
};
function dict(locale) {
  return dictionaries[locale];
}
const LOCALES = ["en", "zh", "zht", "ko", "de", "es", "fr", "it", "da", "ja", "pl", "ru", "uk", "ar", "no", "br", "th", "tr"];
const LOCALE_COOKIE = "oc_locale";
function fix(pathname) {
  if (pathname.startsWith("/")) return pathname;
  return `/${pathname}`;
}
const LABEL = {
  en: "English",
  zh: "简体中文",
  zht: "繁體中文",
  ko: "한국어",
  de: "Deutsch",
  es: "Español",
  fr: "Français",
  it: "Italiano",
  da: "Dansk",
  ja: "日本語",
  pl: "Polski",
  ru: "Русский",
  uk: "Українська",
  ar: "العربية",
  no: "Norsk",
  br: "Português (Brasil)",
  th: "ไทย",
  tr: "Türkçe"
};
const TAG = {
  en: "en",
  zh: "zh-Hans",
  zht: "zh-Hant",
  ko: "ko",
  de: "de",
  es: "es",
  fr: "fr",
  it: "it",
  da: "da",
  ja: "ja",
  pl: "pl",
  ru: "ru",
  uk: "uk",
  ar: "ar",
  no: "no",
  br: "pt-BR",
  th: "th",
  tr: "tr"
};
const DOCS = {
  en: "root",
  zh: "zh-cn",
  zht: "zh-tw",
  ko: "ko",
  de: "de",
  es: "es",
  fr: "fr",
  it: "it",
  da: "da",
  ja: "ja",
  pl: "pl",
  ru: "ru",
  uk: "uk",
  ar: "ar",
  no: "nb",
  br: "pt-br",
  th: "th",
  tr: "tr"
};
const DOCS_SEGMENT = /* @__PURE__ */ new Set(["ar", "bs", "da", "de", "es", "fr", "it", "ja", "ko", "nb", "pl", "pt-br", "ru", "th", "tr", "uk", "zh-cn", "zh-tw"]);
function suffix(pathname) {
  const index = pathname.search(/[?#]/);
  if (index === -1) {
    return {
      path: fix(pathname),
      suffix: ""
    };
  }
  return {
    path: fix(pathname.slice(0, index)),
    suffix: pathname.slice(index)
  };
}
function docs(locale, pathname) {
  const value = DOCS[locale];
  const next = suffix(pathname);
  if (next.path !== "/docs" && next.path !== "/docs/" && !next.path.startsWith("/docs/")) {
    return `${next.path}${next.suffix}`;
  }
  if (value === "root") {
    if (next.path === "/docs/en") return `/docs${next.suffix}`;
    if (next.path === "/docs/en/") return `/docs/${next.suffix}`;
    if (next.path.startsWith("/docs/en/")) return `/docs/${next.path.slice("/docs/en/".length)}${next.suffix}`;
    return `${next.path}${next.suffix}`;
  }
  if (next.path === "/docs") return `/docs/${value}${next.suffix}`;
  if (next.path === "/docs/") return `/docs/${value}/${next.suffix}`;
  const head = next.path.slice("/docs/".length).split("/")[0] ?? "";
  if (!head) return `/docs/${value}/${next.suffix}`;
  if (DOCS_SEGMENT.has(head)) return `${next.path}${next.suffix}`;
  if (head.startsWith("_")) return `${next.path}${next.suffix}`;
  if (head.includes(".")) return `${next.path}${next.suffix}`;
  return `/docs/${value}${next.path.slice("/docs".length)}${next.suffix}`;
}
function parseLocale(value) {
  if (typeof value !== "string") return null;
  if (LOCALES.includes(value)) return value;
  return null;
}
function fromPathname(pathname) {
  return parseLocale(fix(pathname).split("/")[1]);
}
function strip$1(pathname) {
  const locale = fromPathname(pathname);
  if (!locale) return fix(pathname);
  const next = fix(pathname).slice(locale.length + 1);
  if (!next) return "/";
  if (next.startsWith("/")) return next;
  return `/${next}`;
}
function route$1(locale, pathname) {
  const next = strip$1(pathname);
  if (next.startsWith("/docs")) return docs(locale, next);
  if (next.startsWith("/auth")) return next;
  if (next.startsWith("/workspace")) return next;
  if (locale === "en") return next;
  if (next === "/") return `/${locale}`;
  return `/${locale}${next}`;
}
function label(locale) {
  return LABEL[locale];
}
function tag(locale) {
  return TAG[locale];
}
function dir(locale) {
  if (locale === "ar") return "rtl";
  return "ltr";
}
function match(input) {
  const value = input.trim().toLowerCase();
  if (!value) return null;
  if (value.startsWith("zh")) {
    if (value.includes("hant") || value.includes("-tw") || value.includes("-hk") || value.includes("-mo")) return "zht";
    return "zh";
  }
  if (value.startsWith("ko")) return "ko";
  if (value.startsWith("de")) return "de";
  if (value.startsWith("es")) return "es";
  if (value.startsWith("fr")) return "fr";
  if (value.startsWith("it")) return "it";
  if (value.startsWith("da")) return "da";
  if (value.startsWith("ja")) return "ja";
  if (value.startsWith("pl")) return "pl";
  if (value.startsWith("ru")) return "ru";
  if (value.startsWith("uk")) return "uk";
  if (value.startsWith("ar")) return "ar";
  if (value.startsWith("tr")) return "tr";
  if (value.startsWith("th")) return "th";
  if (value.startsWith("pt")) return "br";
  if (value.startsWith("no") || value.startsWith("nb") || value.startsWith("nn")) return "no";
  if (value.startsWith("en")) return "en";
  return null;
}
function detectFromLanguages(languages) {
  for (const language of languages) {
    const locale = match(language);
    if (locale) return locale;
  }
  return "en";
}
function localeFromCookieHeader(header) {
  if (!header) return null;
  const raw = header.split(";").map((x) => x.trim()).find((x) => x.startsWith(`${LOCALE_COOKIE}=`))?.slice(`${LOCALE_COOKIE}=`.length);
  if (!raw) return null;
  return parseLocale(decodeURIComponent(raw));
}
function cookie(locale) {
  return `${LOCALE_COOKIE}=${encodeURIComponent(locale)}; Path=/; Max-Age=31536000; SameSite=Lax`;
}
const basePath = "/data";
const baseUrl = "https://opencode.ai";
function normalizeDataPathname(pathname) {
  const next = strip$1(pathname);
  const path = next.startsWith("/") ? next : `/${next}`;
  const trailing = path.endsWith("/");
  const segments = path.split("/").filter(Boolean);
  const dataIndex = segments.lastIndexOf(basePath.slice(1));
  const rest = dataIndex === -1 ? segments : segments.slice(dataIndex + 1);
  const normalized = `${basePath}${rest.length ? `/${rest.join("/")}` : "/"}`;
  if (trailing && !normalized.endsWith("/")) return `${normalized}/`;
  return normalized;
}
function strip(pathname) {
  return normalizeDataPathname(pathname);
}
function route(locale, pathname) {
  return route$1(locale, normalizeDataPathname(pathname));
}
function localizedUrl(locale, pathname) {
  return `${baseUrl}${route(locale, pathname)}`;
}
function initial() {
  if (typeof window === "object") {
    const fromPath = fromPathname(window.location.pathname);
    if (fromPath) return fromPath;
  }
  if (typeof document === "object") {
    const fromCookie = localeFromCookieHeader(document.cookie);
    if (fromCookie) return fromCookie;
    const fromDom = parseLocale(document.documentElement.dataset.locale);
    if (fromDom) return fromDom;
  }
  if (typeof navigator !== "object") return "en";
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  return detectFromLanguages(languages);
}
const {
  use: useLanguage,
  provider: LanguageProvider
} = createSimpleContext({
  name: "StatsLanguage",
  init: () => {
    const [store, setStore] = createStore({
      locale: initial()
    });
    createEffect(() => {
      document.documentElement.lang = tag(store.locale);
      document.documentElement.dir = dir(store.locale);
      document.documentElement.dataset.locale = store.locale;
    });
    return {
      locale: () => store.locale,
      locales: LOCALES,
      label,
      tag,
      dir,
      route(pathname) {
        return route(store.locale, pathname);
      },
      setLocale(next) {
        setStore("locale", next);
        if (typeof document !== "object") return;
        document.cookie = cookie(next);
      }
    };
  }
});
function resolve(text, params) {
  if (!params) return text;
  return text.replace(/\{\{(\w+)\}\}/g, (raw, key) => {
    const value = params[key];
    if (value === void 0 || value === null) return raw;
    return String(value);
  });
}
const {
  use: useI18n,
  provider: I18nProvider
} = createSimpleContext({
  name: "StatsI18n",
  init: () => {
    const language = useLanguage();
    const dictionary = createMemo(() => dict(language.locale()));
    return {
      t(key, params) {
        return resolve(dictionary()[key], params);
      }
    };
  }
});
export {
  setProperty$1 as $,
  getOwner as A,
  hydrate as B,
  insert as C,
  isServer as D,
  ErrorBoundary as E,
  For as F,
  keepDepth as G,
  lazy as H,
  I18nProvider as I,
  localizedUrl as J,
  memo as K,
  LOCALES as L,
  Meta as M,
  mergeProps as N,
  mockBase as O,
  notifyIfNotBlocked as P,
  on as Q,
  RouteContextObj as R,
  Show as S,
  Title as T,
  onCleanup as U,
  onMount as V,
  route as W,
  runHydrationEvents as X,
  saveCurrentDepth as Y,
  setAttribute as Z,
  setInPreloadFn as _,
  LanguageProvider as a,
  setStyleProperty as a0,
  sharedConfig as a1,
  splitProps as a2,
  spread as a3,
  startTransition as a4,
  strip as a5,
  style as a6,
  tag as a7,
  template as a8,
  untrack as a9,
  use as aa,
  useI18n as ab,
  useLanguage as ac,
  useNavigate as ad,
  useParams as ae,
  Link as b,
  MetaProvider as c,
  RouterContextObj as d,
  Suspense as e,
  addEventListener as f,
  catchError as g,
  children as h,
  createBeforeLeave as i,
  createBranches as j,
  createComponent as k,
  createEffect as l,
  createMemo as m,
  createRenderEffect as n,
  createResource as o,
  createRoot as p,
  createRouteContext as q,
  createRouterContext as r,
  createSignal as s,
  createUniqueId as t,
  delegateEvents as u,
  getInPreloadFn as v,
  getIntent as w,
  getListener as x,
  getNextElement as y,
  getNextMarker as z
};
