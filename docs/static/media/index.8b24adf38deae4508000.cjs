"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __reflectGet = Reflect.get;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a2, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a2, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a2, prop, b[prop]);
    }
  return a2;
};
var __spreadProps = (a2, b) => __defProps(a2, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __superGet = (cls, obj, key) => __reflectGet(__getProtoOf(cls), key, obj);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e2) {
        reject(e2);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e2) {
        reject(e2);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var _a, _b, _c, _d, _e, _f, _g, _i;
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const core = require("@okxconnect/core");
const tonsdk = require("@okxconnect/tonsdk");
const UAParser = require("ua-parser-js");
const cn = require("classnames");
const deepmerge = require("deepmerge");
const universalProvider = require("@okxconnect/universal-provider");
const _interopDefaultLegacy = (e2) => e2 && typeof e2 === "object" && "default" in e2 ? e2 : { default: e2 };
const UAParser__default = /* @__PURE__ */ _interopDefaultLegacy(UAParser);
const cn__default = /* @__PURE__ */ _interopDefaultLegacy(cn);
const deepmerge__default = /* @__PURE__ */ _interopDefaultLegacy(deepmerge);
var THEME = /* @__PURE__ */ ((THEME2) => {
  THEME2["DARK"] = "DARK";
  THEME2["LIGHT"] = "LIGHT";
  return THEME2;
})(THEME || {});
class OKXConnectUiError extends core.OKXConnectError {
  constructor(message) {
    super(1, message);
  }
}
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
const equalFn = (a2, b) => a2 === b;
const $PROXY = Symbol("solid-proxy");
const SUPPORTS_PROXY = typeof Proxy === "function";
const $TRACK = Symbol("solid-track");
const signalOptions = {
  equals: equalFn
};
let runEffects = runQueue;
const STALE = 1;
const PENDING = 2;
const UNOWNED = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var Owner = null;
let Transition$1 = null;
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
  const s2 = {
    value,
    observers: null,
    observerSlots: null,
    comparator: options.equals || void 0
  };
  const setter = (value2) => {
    if (typeof value2 === "function") {
      value2 = value2(s2.value);
    }
    return writeSignal(s2, value2);
  };
  return [readSignal.bind(s2), setter];
}
function createComputed(fn, value, options) {
  const c2 = createComputation(fn, value, true, STALE);
  updateComputation(c2);
}
function createRenderEffect(fn, value, options) {
  const c2 = createComputation(fn, value, false, STALE);
  updateComputation(c2);
}
function createEffect(fn, value, options) {
  runEffects = runUserEffects;
  const c2 = createComputation(fn, value, false, STALE);
  if (!options || !options.render)
    c2.user = true;
  Effects ? Effects.push(c2) : updateComputation(c2);
}
function createMemo(fn, value, options) {
  options = options ? Object.assign({}, signalOptions, options) : signalOptions;
  const c2 = createComputation(fn, value, true, 0);
  c2.observers = null;
  c2.observerSlots = null;
  c2.comparator = options.equals || void 0;
  updateComputation(c2);
  return readSignal.bind(c2);
}
function batch(fn) {
  return runUpdates(fn, false);
}
function untrack(fn) {
  if (Listener === null)
    return fn();
  const listener = Listener;
  Listener = null;
  try {
    if (ExternalSourceConfig)
      ;
    return fn();
  } finally {
    Listener = listener;
  }
}
function onMount(fn) {
  createEffect(() => untrack(fn));
}
function onCleanup(fn) {
  if (Owner === null)
    ;
  else if (Owner.cleanups === null)
    Owner.cleanups = [fn];
  else
    Owner.cleanups.push(fn);
  return fn;
}
function getListener() {
  return Listener;
}
function getOwner() {
  return Owner;
}
function runWithOwner(o2, fn) {
  const prev = Owner;
  const prevListener = Listener;
  Owner = o2;
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
  const memo = createMemo(() => resolveChildren(children2()));
  memo.toArray = () => {
    const c2 = memo();
    return Array.isArray(c2) ? c2 : c2 != null ? [c2] : [];
  };
  return memo;
}
function readSignal() {
  if (this.sources && this.state) {
    if (this.state === STALE)
      updateComputation(this);
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
  return this.value;
}
function writeSignal(node, value, isComp) {
  let current = node.value;
  if (!node.comparator || !node.comparator(current, value)) {
    node.value = value;
    if (node.observers && node.observers.length) {
      runUpdates(() => {
        for (let i2 = 0; i2 < node.observers.length; i2 += 1) {
          const o2 = node.observers[i2];
          const TransitionRunning = Transition$1 && Transition$1.running;
          if (TransitionRunning && Transition$1.disposed.has(o2))
            ;
          if (TransitionRunning ? !o2.tState : !o2.state) {
            if (o2.pure)
              Updates.push(o2);
            else
              Effects.push(o2);
            if (o2.observers)
              markDownstream(o2);
          }
          if (!TransitionRunning)
            o2.state = STALE;
        }
        if (Updates.length > 1e6) {
          Updates = [];
          if (false)
            ;
          throw new Error();
        }
      }, false);
    }
  }
  return value;
}
function updateComputation(node) {
  if (!node.fn)
    return;
  cleanNode(node);
  const time = ExecCount;
  runComputation(
    node,
    node.value,
    time
  );
}
function runComputation(node, value, time) {
  let nextValue;
  const owner = Owner, listener = Listener;
  Listener = Owner = node;
  try {
    nextValue = node.fn(value);
  } catch (err) {
    if (node.pure) {
      {
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
      writeSignal(node, nextValue);
    } else
      node.value = nextValue;
    node.updatedAt = time;
  }
}
function createComputation(fn, init, pure, state = STALE, options) {
  const c2 = {
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
  if (Owner === null)
    ;
  else if (Owner !== UNOWNED) {
    {
      if (!Owner.owned)
        Owner.owned = [c2];
      else
        Owner.owned.push(c2);
    }
  }
  return c2;
}
function runTop(node) {
  if (node.state === 0)
    return;
  if (node.state === PENDING)
    return lookUpstream(node);
  if (node.suspense && untrack(node.suspense.inFallback))
    return node.suspense.effects.push(node);
  const ancestors = [node];
  while ((node = node.owner) && (!node.updatedAt || node.updatedAt < ExecCount)) {
    if (node.state)
      ancestors.push(node);
  }
  for (let i2 = ancestors.length - 1; i2 >= 0; i2--) {
    node = ancestors[i2];
    if (node.state === STALE) {
      updateComputation(node);
    } else if (node.state === PENDING) {
      const updates = Updates;
      Updates = null;
      runUpdates(() => lookUpstream(node, ancestors[0]), false);
      Updates = updates;
    }
  }
}
function runUpdates(fn, init) {
  if (Updates)
    return fn();
  let wait = false;
  if (!init)
    Updates = [];
  if (Effects)
    wait = true;
  else
    Effects = [];
  ExecCount++;
  try {
    const res = fn();
    completeUpdates(wait);
    return res;
  } catch (err) {
    if (!wait)
      Effects = null;
    Updates = null;
    handleError(err);
  }
}
function completeUpdates(wait) {
  if (Updates) {
    runQueue(Updates);
    Updates = null;
  }
  if (wait)
    return;
  const e2 = Effects;
  Effects = null;
  if (e2.length)
    runUpdates(() => runEffects(e2), false);
}
function runQueue(queue) {
  for (let i2 = 0; i2 < queue.length; i2++)
    runTop(queue[i2]);
}
function runUserEffects(queue) {
  let i2, userLength = 0;
  for (i2 = 0; i2 < queue.length; i2++) {
    const e2 = queue[i2];
    if (!e2.user)
      runTop(e2);
    else
      queue[userLength++] = e2;
  }
  for (i2 = 0; i2 < userLength; i2++)
    runTop(queue[i2]);
}
function lookUpstream(node, ignore) {
  node.state = 0;
  for (let i2 = 0; i2 < node.sources.length; i2 += 1) {
    const source = node.sources[i2];
    if (source.sources) {
      const state = source.state;
      if (state === STALE) {
        if (source !== ignore && (!source.updatedAt || source.updatedAt < ExecCount))
          runTop(source);
      } else if (state === PENDING)
        lookUpstream(source, ignore);
    }
  }
}
function markDownstream(node) {
  for (let i2 = 0; i2 < node.observers.length; i2 += 1) {
    const o2 = node.observers[i2];
    if (!o2.state) {
      o2.state = PENDING;
      if (o2.pure)
        Updates.push(o2);
      else
        Effects.push(o2);
      o2.observers && markDownstream(o2);
    }
  }
}
function cleanNode(node) {
  let i2;
  if (node.sources) {
    while (node.sources.length) {
      const source = node.sources.pop(), index = node.sourceSlots.pop(), obs = source.observers;
      if (obs && obs.length) {
        const n2 = obs.pop(), s2 = source.observerSlots.pop();
        if (index < obs.length) {
          n2.sourceSlots[s2] = index;
          obs[index] = n2;
          source.observerSlots[index] = s2;
        }
      }
    }
  }
  if (node.tOwned) {
    for (i2 = node.tOwned.length - 1; i2 >= 0; i2--)
      cleanNode(node.tOwned[i2]);
    delete node.tOwned;
  }
  if (node.owned) {
    for (i2 = node.owned.length - 1; i2 >= 0; i2--)
      cleanNode(node.owned[i2]);
    node.owned = null;
  }
  if (node.cleanups) {
    for (i2 = node.cleanups.length - 1; i2 >= 0; i2--)
      node.cleanups[i2]();
    node.cleanups = null;
  }
  node.state = 0;
}
function castError(err) {
  if (err instanceof Error)
    return err;
  return new Error(typeof err === "string" ? err : "Unknown error", {
    cause: err
  });
}
function handleError(err, owner = Owner) {
  const error = castError(err);
  throw error;
}
function resolveChildren(children2) {
  if (typeof children2 === "function" && !children2.length)
    return resolveChildren(children2());
  if (Array.isArray(children2)) {
    const results = [];
    for (let i2 = 0; i2 < children2.length; i2++) {
      const result = resolveChildren(children2[i2]);
      Array.isArray(result) ? results.push.apply(results, result) : results.push(result);
    }
    return results;
  }
  return children2;
}
function createProvider(id, options) {
  return function provider(props) {
    let res;
    createRenderEffect(
      () => res = untrack(() => {
        Owner.context = __spreadProps(__spreadValues({}, Owner.context), {
          [id]: props.value
        });
        return children(() => props.children);
      }),
      void 0
    );
    return res;
  };
}
function createComponent(Comp, props) {
  return untrack(() => Comp(props || {}));
}
function trueFn() {
  return true;
}
const propTraps = {
  get(_, property, receiver) {
    if (property === $PROXY)
      return receiver;
    return _.get(property);
  },
  has(_, property) {
    if (property === $PROXY)
      return true;
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
function resolveSource(s2) {
  return !(s2 = typeof s2 === "function" ? s2() : s2) ? {} : s2;
}
function resolveSources() {
  for (let i2 = 0, length = this.length; i2 < length; ++i2) {
    const v = this[i2]();
    if (v !== void 0)
      return v;
  }
}
function mergeProps(...sources) {
  let proxy = false;
  for (let i2 = 0; i2 < sources.length; i2++) {
    const s2 = sources[i2];
    proxy = proxy || !!s2 && $PROXY in s2;
    sources[i2] = typeof s2 === "function" ? (proxy = true, createMemo(s2)) : s2;
  }
  if (SUPPORTS_PROXY && proxy) {
    return new Proxy(
      {
        get(property) {
          for (let i2 = sources.length - 1; i2 >= 0; i2--) {
            const v = resolveSource(sources[i2])[property];
            if (v !== void 0)
              return v;
          }
        },
        has(property) {
          for (let i2 = sources.length - 1; i2 >= 0; i2--) {
            if (property in resolveSource(sources[i2]))
              return true;
          }
          return false;
        },
        keys() {
          const keys = [];
          for (let i2 = 0; i2 < sources.length; i2++)
            keys.push(...Object.keys(resolveSource(sources[i2])));
          return [...new Set(keys)];
        }
      },
      propTraps
    );
  }
  const sourcesMap = {};
  const defined = /* @__PURE__ */ Object.create(null);
  for (let i2 = sources.length - 1; i2 >= 0; i2--) {
    const source = sources[i2];
    if (!source)
      continue;
    const sourceKeys = Object.getOwnPropertyNames(source);
    for (let i3 = sourceKeys.length - 1; i3 >= 0; i3--) {
      const key = sourceKeys[i3];
      if (key === "__proto__" || key === "constructor")
        continue;
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
          if (desc.get)
            sources2.push(desc.get.bind(source));
          else if (desc.value !== void 0)
            sources2.push(() => desc.value);
        }
      }
    }
  }
  const target = {};
  const definedKeys = Object.keys(defined);
  for (let i2 = definedKeys.length - 1; i2 >= 0; i2--) {
    const key = definedKeys[i2], desc = defined[key];
    if (desc && desc.get)
      Object.defineProperty(target, key, desc);
    else
      target[key] = desc ? desc.value : void 0;
  }
  return target;
}
function splitProps(props, ...keys) {
  if (SUPPORTS_PROXY && $PROXY in props) {
    const blocked = new Set(keys.length > 1 ? keys.flat() : keys[0]);
    const res = keys.map((k) => {
      return new Proxy(
        {
          get(property) {
            return k.includes(property) ? props[property] : void 0;
          },
          has(property) {
            return k.includes(property) && property in props;
          },
          keys() {
            return k.filter((property) => property in props);
          }
        },
        propTraps
      );
    });
    res.push(
      new Proxy(
        {
          get(property) {
            return blocked.has(property) ? void 0 : props[property];
          },
          has(property) {
            return blocked.has(property) ? false : property in props;
          },
          keys() {
            return Object.keys(props).filter((k) => !blocked.has(k));
          }
        },
        propTraps
      )
    );
    return res;
  }
  const otherObject = {};
  const objects = keys.map(() => ({}));
  for (const propName of Object.getOwnPropertyNames(props)) {
    const desc = Object.getOwnPropertyDescriptor(props, propName);
    const isDefaultDesc = !desc.get && !desc.set && desc.enumerable && desc.writable && desc.configurable;
    let blocked = false;
    let objectIndex = 0;
    for (const k of keys) {
      if (k.includes(propName)) {
        blocked = true;
        isDefaultDesc ? objects[objectIndex][propName] = desc.value : Object.defineProperty(objects[objectIndex], propName, desc);
      }
      ++objectIndex;
    }
    if (!blocked) {
      isDefaultDesc ? otherObject[propName] = desc.value : Object.defineProperty(otherObject, propName, desc);
    }
  }
  return [...objects, otherObject];
}
const narrowedError = (name) => `Stale read from <${name}>.`;
function Show(props) {
  const keyed = props.keyed;
  const condition = createMemo(() => props.when, void 0, {
    equals: (a2, b) => keyed ? a2 === b : !a2 === !b
  });
  return createMemo(
    () => {
      const c2 = condition();
      if (c2) {
        const child = props.children;
        const fn = typeof child === "function" && child.length > 0;
        return fn ? untrack(
          () => child(
            keyed ? c2 : () => {
              if (!untrack(condition))
                throw narrowedError("Show");
              return props.when;
            }
          )
        ) : child;
      }
      return props.fallback;
    },
    void 0,
    void 0
  );
}
function Switch(props) {
  let keyed = false;
  const equals = (a2, b) => (keyed ? a2[1] === b[1] : !a2[1] === !b[1]) && a2[2] === b[2];
  const conditions = children(() => props.children), evalConditions = createMemo(
    () => {
      let conds = conditions();
      if (!Array.isArray(conds))
        conds = [conds];
      for (let i2 = 0; i2 < conds.length; i2++) {
        const c2 = conds[i2].when;
        if (c2) {
          keyed = !!conds[i2].keyed;
          return [i2, c2, conds[i2]];
        }
      }
      return [-1];
    },
    void 0,
    {
      equals
    }
  );
  return createMemo(
    () => {
      const [index, when, cond] = evalConditions();
      if (index < 0)
        return props.fallback;
      const c2 = cond.children;
      const fn = typeof c2 === "function" && c2.length > 0;
      return fn ? untrack(
        () => c2(
          keyed ? when : () => {
            if (untrack(evalConditions)[0] !== index)
              throw narrowedError("Match");
            return cond.when;
          }
        )
      ) : c2;
    },
    void 0,
    void 0
  );
}
function Match(props) {
  return props;
}
const booleans = [
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "disabled",
  "formnovalidate",
  "hidden",
  "indeterminate",
  "inert",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "seamless",
  "selected"
];
const Properties = /* @__PURE__ */ new Set([
  "className",
  "value",
  "readOnly",
  "formNoValidate",
  "isMap",
  "noModule",
  "playsInline",
  ...booleans
]);
const ChildProperties = /* @__PURE__ */ new Set([
  "innerHTML",
  "textContent",
  "innerText",
  "children"
]);
const Aliases = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
  className: "class",
  htmlFor: "for"
});
const PropAliases = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
  class: "className",
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
  }
});
function getPropAlias(prop, tagName) {
  const a2 = PropAliases[prop];
  return typeof a2 === "object" ? a2[tagName] ? a2["$"] : void 0 : a2;
}
const DelegatedEvents = /* @__PURE__ */ new Set([
  "beforeinput",
  "click",
  "dblclick",
  "contextmenu",
  "focusin",
  "focusout",
  "input",
  "keydown",
  "keyup",
  "mousedown",
  "mousemove",
  "mouseout",
  "mouseover",
  "mouseup",
  "pointerdown",
  "pointermove",
  "pointerout",
  "pointerover",
  "pointerup",
  "touchend",
  "touchmove",
  "touchstart"
]);
const SVGElements = /* @__PURE__ */ new Set([
  "altGlyph",
  "altGlyphDef",
  "altGlyphItem",
  "animate",
  "animateColor",
  "animateMotion",
  "animateTransform",
  "circle",
  "clipPath",
  "color-profile",
  "cursor",
  "defs",
  "desc",
  "ellipse",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "filter",
  "font",
  "font-face",
  "font-face-format",
  "font-face-name",
  "font-face-src",
  "font-face-uri",
  "foreignObject",
  "g",
  "glyph",
  "glyphRef",
  "hkern",
  "image",
  "line",
  "linearGradient",
  "marker",
  "mask",
  "metadata",
  "missing-glyph",
  "mpath",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "set",
  "stop",
  "svg",
  "switch",
  "symbol",
  "text",
  "textPath",
  "tref",
  "tspan",
  "use",
  "view",
  "vkern"
]);
const SVGNamespace = {
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace"
};
function reconcileArrays(parentNode, a2, b) {
  let bLength = b.length, aEnd = a2.length, bEnd = bLength, aStart = 0, bStart = 0, after = a2[aEnd - 1].nextSibling, map = null;
  while (aStart < aEnd || bStart < bEnd) {
    if (a2[aStart] === b[bStart]) {
      aStart++;
      bStart++;
      continue;
    }
    while (a2[aEnd - 1] === b[bEnd - 1]) {
      aEnd--;
      bEnd--;
    }
    if (aEnd === aStart) {
      const node = bEnd < bLength ? bStart ? b[bStart - 1].nextSibling : b[bEnd - bStart] : after;
      while (bStart < bEnd)
        parentNode.insertBefore(b[bStart++], node);
    } else if (bEnd === bStart) {
      while (aStart < aEnd) {
        if (!map || !map.has(a2[aStart]))
          a2[aStart].remove();
        aStart++;
      }
    } else if (a2[aStart] === b[bEnd - 1] && b[bStart] === a2[aEnd - 1]) {
      const node = a2[--aEnd].nextSibling;
      parentNode.insertBefore(b[bStart++], a2[aStart++].nextSibling);
      parentNode.insertBefore(b[--bEnd], node);
      a2[aEnd] = b[bEnd];
    } else {
      if (!map) {
        map = /* @__PURE__ */ new Map();
        let i2 = bStart;
        while (i2 < bEnd)
          map.set(b[i2], i2++);
      }
      const index = map.get(a2[aStart]);
      if (index != null) {
        if (bStart < index && index < bEnd) {
          let i2 = aStart, sequence = 1, t2;
          while (++i2 < aEnd && i2 < bEnd) {
            if ((t2 = map.get(a2[i2])) == null || t2 !== index + sequence)
              break;
            sequence++;
          }
          if (sequence > index - bStart) {
            const node = a2[aStart];
            while (bStart < index)
              parentNode.insertBefore(b[bStart++], node);
          } else
            parentNode.replaceChild(b[bStart++], a2[aStart++]);
        } else
          aStart++;
      } else
        a2[aStart++].remove();
    }
  }
}
const $$EVENTS = "_$DX_DELEGATE";
function render(code, element, init, options = {}) {
  let disposer;
  createRoot((dispose) => {
    disposer = dispose;
    element === document ? code() : insert(element, code(), element.firstChild ? null : void 0, init);
  }, options.owner);
  return () => {
    disposer();
    element.textContent = "";
  };
}
function template$1(html, isImportNode, isSVG) {
  let node;
  const create = () => {
    const t2 = document.createElement("template");
    t2.innerHTML = html;
    return isSVG ? t2.content.firstChild.firstChild : t2.content.firstChild;
  };
  const fn = isImportNode ? () => untrack(() => document.importNode(node || (node = create()), true)) : () => (node || (node = create())).cloneNode(true);
  fn.cloneNode = fn;
  return fn;
}
function delegateEvents(eventNames, document2 = window.document) {
  const e2 = document2[$$EVENTS] || (document2[$$EVENTS] = /* @__PURE__ */ new Set());
  for (let i2 = 0, l2 = eventNames.length; i2 < l2; i2++) {
    const name = eventNames[i2];
    if (!e2.has(name)) {
      e2.add(name);
      document2.addEventListener(name, eventHandler);
    }
  }
}
function setAttribute(node, name, value) {
  if (value == null)
    node.removeAttribute(name);
  else
    node.setAttribute(name, value);
}
function setAttributeNS(node, namespace, name, value) {
  if (value == null)
    node.removeAttributeNS(namespace, name);
  else
    node.setAttributeNS(namespace, name, value);
}
function setBoolAttribute(node, name, value) {
  value ? node.setAttribute(name, "") : node.removeAttribute(name);
}
function className(node, value) {
  if (value == null)
    node.removeAttribute("class");
  else
    node.className = value;
}
function addEventListener(node, name, handler, delegate) {
  if (delegate) {
    if (Array.isArray(handler)) {
      node[`$$${name}`] = handler[0];
      node[`$$${name}Data`] = handler[1];
    } else
      node[`$$${name}`] = handler;
  } else if (Array.isArray(handler)) {
    const handlerFn = handler[0];
    node.addEventListener(name, handler[0] = (e2) => handlerFn.call(node, handler[1], e2));
  } else
    node.addEventListener(name, handler, typeof handler !== "function" && handler);
}
function classList(node, value, prev = {}) {
  const classKeys = Object.keys(value || {}), prevKeys = Object.keys(prev);
  let i2, len;
  for (i2 = 0, len = prevKeys.length; i2 < len; i2++) {
    const key = prevKeys[i2];
    if (!key || key === "undefined" || value[key])
      continue;
    toggleClassKey(node, key, false);
    delete prev[key];
  }
  for (i2 = 0, len = classKeys.length; i2 < len; i2++) {
    const key = classKeys[i2], classValue = !!value[key];
    if (!key || key === "undefined" || prev[key] === classValue || !classValue)
      continue;
    toggleClassKey(node, key, true);
    prev[key] = classValue;
  }
  return prev;
}
function style(node, value, prev) {
  if (!value)
    return prev ? setAttribute(node, "style") : value;
  const nodeStyle = node.style;
  if (typeof value === "string")
    return nodeStyle.cssText = value;
  typeof prev === "string" && (nodeStyle.cssText = prev = void 0);
  prev || (prev = {});
  value || (value = {});
  let v, s2;
  for (s2 in prev) {
    value[s2] == null && nodeStyle.removeProperty(s2);
    delete prev[s2];
  }
  for (s2 in value) {
    v = value[s2];
    if (v !== prev[s2]) {
      nodeStyle.setProperty(s2, v);
      prev[s2] = v;
    }
  }
  return prev;
}
function spread(node, props = {}, isSVG, skipChildren) {
  const prevProps = {};
  if (!skipChildren) {
    createRenderEffect(
      () => prevProps.children = insertExpression(node, props.children, prevProps.children)
    );
  }
  createRenderEffect(() => typeof props.ref === "function" && use(props.ref, node));
  createRenderEffect(() => assign(node, props, isSVG, true, prevProps, true));
  return prevProps;
}
function use(fn, element, arg) {
  return untrack(() => fn(element, arg));
}
function insert(parent, accessor, marker, initial) {
  if (marker !== void 0 && !initial)
    initial = [];
  if (typeof accessor !== "function")
    return insertExpression(parent, accessor, initial, marker);
  createRenderEffect((current) => insertExpression(parent, accessor(), current, marker), initial);
}
function assign(node, props, isSVG, skipChildren, prevProps = {}, skipRef = false) {
  props || (props = {});
  for (const prop in prevProps) {
    if (!(prop in props)) {
      if (prop === "children")
        continue;
      prevProps[prop] = assignProp(node, prop, null, prevProps[prop], isSVG, skipRef, props);
    }
  }
  for (const prop in props) {
    if (prop === "children") {
      if (!skipChildren)
        insertExpression(node, props.children);
      continue;
    }
    const value = props[prop];
    prevProps[prop] = assignProp(node, prop, value, prevProps[prop], isSVG, skipRef, props);
  }
}
function toPropertyName(name) {
  return name.toLowerCase().replace(/-([a-z])/g, (_, w) => w.toUpperCase());
}
function toggleClassKey(node, key, value) {
  const classNames = key.trim().split(/\s+/);
  for (let i2 = 0, nameLen = classNames.length; i2 < nameLen; i2++)
    node.classList.toggle(classNames[i2], value);
}
function assignProp(node, prop, value, prev, isSVG, skipRef, props) {
  let isCE, isProp, isChildProp, propAlias, forceProp;
  if (prop === "style")
    return style(node, value, prev);
  if (prop === "classList")
    return classList(node, value, prev);
  if (value === prev)
    return prev;
  if (prop === "ref") {
    if (!skipRef)
      value(node);
  } else if (prop.slice(0, 3) === "on:") {
    const e2 = prop.slice(3);
    prev && node.removeEventListener(e2, prev, typeof prev !== "function" && prev);
    value && node.addEventListener(e2, value, typeof value !== "function" && value);
  } else if (prop.slice(0, 10) === "oncapture:") {
    const e2 = prop.slice(10);
    prev && node.removeEventListener(e2, prev, true);
    value && node.addEventListener(e2, value, true);
  } else if (prop.slice(0, 2) === "on") {
    const name = prop.slice(2).toLowerCase();
    const delegate = DelegatedEvents.has(name);
    if (!delegate && prev) {
      const h2 = Array.isArray(prev) ? prev[0] : prev;
      node.removeEventListener(name, h2);
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
    }
    if (prop === "class" || prop === "className")
      className(node, value);
    else if (isCE && !isProp && !isChildProp)
      node[toPropertyName(prop)] = value;
    else
      node[propAlias || prop] = value;
  } else {
    const ns = isSVG && prop.indexOf(":") > -1 && SVGNamespace[prop.split(":")[0]];
    if (ns)
      setAttributeNS(node, ns, prop, value);
    else
      setAttribute(node, Aliases[prop] || prop, value);
  }
  return value;
}
function eventHandler(e2) {
  let node = e2.target;
  const key = `$$${e2.type}`;
  const oriTarget = e2.target;
  const oriCurrentTarget = e2.currentTarget;
  const retarget = (value) => Object.defineProperty(e2, "target", {
    configurable: true,
    value
  });
  const handleNode = () => {
    const handler = node[key];
    if (handler && !node.disabled) {
      const data = node[`${key}Data`];
      data !== void 0 ? handler.call(node, data, e2) : handler.call(node, e2);
      if (e2.cancelBubble)
        return;
    }
    node.host && typeof node.host !== "string" && !node.host._$host && node.contains(e2.target) && retarget(node.host);
    return true;
  };
  const walkUpTree = () => {
    while (handleNode() && (node = node._$host || node.parentNode || node.host))
      ;
  };
  Object.defineProperty(e2, "currentTarget", {
    configurable: true,
    get() {
      return node || document;
    }
  });
  if (e2.composedPath) {
    const path = e2.composedPath();
    retarget(path[0]);
    for (let i2 = 0; i2 < path.length - 2; i2++) {
      node = path[i2];
      if (!handleNode())
        break;
      if (node._$host) {
        node = node._$host;
        walkUpTree();
        break;
      }
      if (node.parentNode === oriCurrentTarget) {
        break;
      }
    }
  } else
    walkUpTree();
  retarget(oriTarget);
}
function insertExpression(parent, value, current, marker, unwrapArray) {
  while (typeof current === "function")
    current = current();
  if (value === current)
    return current;
  const t2 = typeof value, multi = marker !== void 0;
  parent = multi && current[0] && current[0].parentNode || parent;
  if (t2 === "string" || t2 === "number") {
    if (t2 === "number") {
      value = value.toString();
      if (value === current)
        return current;
    }
    if (multi) {
      let node = current[0];
      if (node && node.nodeType === 3) {
        node.data !== value && (node.data = value);
      } else
        node = document.createTextNode(value);
      current = cleanChildren(parent, current, marker, node);
    } else {
      if (current !== "" && typeof current === "string") {
        current = parent.firstChild.data = value;
      } else
        current = parent.textContent = value;
    }
  } else if (value == null || t2 === "boolean") {
    current = cleanChildren(parent, current, marker);
  } else if (t2 === "function") {
    createRenderEffect(() => {
      let v = value();
      while (typeof v === "function")
        v = v();
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
    if (array.length === 0) {
      current = cleanChildren(parent, current, marker);
      if (multi)
        return current;
    } else if (currentArray) {
      if (current.length === 0) {
        appendNodes(parent, array, marker);
      } else
        reconcileArrays(parent, current, array);
    } else {
      current && cleanChildren(parent);
      appendNodes(parent, array);
    }
    current = array;
  } else if (value.nodeType) {
    if (Array.isArray(current)) {
      if (multi)
        return current = cleanChildren(parent, current, marker, value);
      cleanChildren(parent, current, null, value);
    } else if (current == null || current === "" || !parent.firstChild) {
      parent.appendChild(value);
    } else
      parent.replaceChild(value, parent.firstChild);
    current = value;
  } else
    ;
  return current;
}
function normalizeIncomingArray(normalized, array, current, unwrap2) {
  let dynamic = false;
  for (let i2 = 0, len = array.length; i2 < len; i2++) {
    let item = array[i2], prev = current && current[normalized.length], t2;
    if (item == null || item === true || item === false)
      ;
    else if ((t2 = typeof item) === "object" && item.nodeType) {
      normalized.push(item);
    } else if (Array.isArray(item)) {
      dynamic = normalizeIncomingArray(normalized, item, prev) || dynamic;
    } else if (t2 === "function") {
      if (unwrap2) {
        while (typeof item === "function")
          item = item();
        dynamic = normalizeIncomingArray(
          normalized,
          Array.isArray(item) ? item : [item],
          Array.isArray(prev) ? prev : [prev]
        ) || dynamic;
      } else {
        normalized.push(item);
        dynamic = true;
      }
    } else {
      const value = String(item);
      if (prev && prev.nodeType === 3 && prev.data === value)
        normalized.push(prev);
      else
        normalized.push(document.createTextNode(value));
    }
  }
  return dynamic;
}
function appendNodes(parent, array, marker = null) {
  for (let i2 = 0, len = array.length; i2 < len; i2++)
    parent.insertBefore(array[i2], marker);
}
function cleanChildren(parent, current, marker, replacement) {
  if (marker === void 0)
    return parent.textContent = "";
  const node = replacement || document.createTextNode("");
  if (current.length) {
    let inserted = false;
    for (let i2 = current.length - 1; i2 >= 0; i2--) {
      const el = current[i2];
      if (node !== el) {
        const isParent = el.parentNode === parent;
        if (!inserted && !i2)
          isParent ? parent.replaceChild(node, el) : parent.insertBefore(node, marker);
        else
          isParent && el.remove();
      } else
        inserted = true;
    }
  } else
    parent.insertBefore(node, marker);
  return [node];
}
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
function createElement(tagName, isSVG = false) {
  return isSVG ? document.createElementNS(SVG_NAMESPACE, tagName) : document.createElement(tagName);
}
function Portal(props) {
  const { useShadow } = props, marker = document.createTextNode(""), mount = () => props.mount || document.body, owner = getOwner();
  let content;
  let hydrating = !!sharedConfig.context;
  createEffect(
    () => {
      content || (content = runWithOwner(owner, () => createMemo(() => props.children)));
      const el = mount();
      if (el instanceof HTMLHeadElement) {
        const [clean, setClean] = createSignal(false);
        const cleanup = () => setClean(true);
        createRoot((dispose) => insert(el, () => !clean() ? content() : dispose(), null));
        onCleanup(cleanup);
      } else {
        const container = createElement(props.isSVG ? "g" : "div", props.isSVG), renderRoot = useShadow && container.attachShadow ? container.attachShadow({
          mode: "open"
        }) : container;
        Object.defineProperty(container, "_$host", {
          get() {
            return marker.parentNode;
          },
          configurable: true
        });
        insert(renderRoot, content);
        el.appendChild(container);
        props.ref && props.ref(container);
        onCleanup(() => el.removeChild(container));
      }
    },
    void 0,
    {
      render: !hydrating
    }
  );
  return marker;
}
function Dynamic(props) {
  const [p2, others] = splitProps(props, ["component"]);
  const cached = createMemo(() => p2.component);
  return createMemo(() => {
    const component = cached();
    switch (typeof component) {
      case "function":
        return untrack(() => component(others));
      case "string":
        const isSvg = SVGElements.has(component);
        const el = createElement(component, isSvg);
        spread(el, others, isSvg);
        return el;
    }
  });
}
let e = { data: "" }, t = (t2) => "object" == typeof window ? ((t2 ? t2.querySelector("#_goober") : window._goober) || Object.assign((t2 || document.head).appendChild(document.createElement("style")), { innerHTML: " ", id: "_goober" })).firstChild : t2 || e, l = /(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g, a = /\/\*[^]*?\*\/|  +/g, n = /\n+/g, o = (e2, t2) => {
  let r = "", l2 = "", a2 = "";
  for (let n2 in e2) {
    let c2 = e2[n2];
    "@" == n2[0] ? "i" == n2[1] ? r = n2 + " " + c2 + ";" : l2 += "f" == n2[1] ? o(c2, n2) : n2 + "{" + o(c2, "k" == n2[1] ? "" : t2) + "}" : "object" == typeof c2 ? l2 += o(c2, t2 ? t2.replace(/([^,])+/g, (e3) => n2.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g, (t3) => /&/.test(t3) ? t3.replace(/&/g, e3) : e3 ? e3 + " " + t3 : t3)) : n2) : null != c2 && (n2 = /^--/.test(n2) ? n2 : n2.replace(/[A-Z]/g, "-$&").toLowerCase(), a2 += o.p ? o.p(n2, c2) : n2 + ":" + c2 + ";");
  }
  return r + (t2 && a2 ? t2 + "{" + a2 + "}" : a2) + l2;
}, c = {}, s = (e2) => {
  if ("object" == typeof e2) {
    let t2 = "";
    for (let r in e2)
      t2 += r + s(e2[r]);
    return t2;
  }
  return e2;
}, i = (e2, t2, r, i2, p2) => {
  let u2 = s(e2), d = c[u2] || (c[u2] = ((e3) => {
    let t3 = 0, r2 = 11;
    for (; t3 < e3.length; )
      r2 = 101 * r2 + e3.charCodeAt(t3++) >>> 0;
    return "go" + r2;
  })(u2));
  if (!c[d]) {
    let t3 = u2 !== e2 ? e2 : ((e3) => {
      let t4, r2, o2 = [{}];
      for (; t4 = l.exec(e3.replace(a, "")); )
        t4[4] ? o2.shift() : t4[3] ? (r2 = t4[3].replace(n, " ").trim(), o2.unshift(o2[0][r2] = o2[0][r2] || {})) : o2[0][t4[1]] = t4[2].replace(n, " ").trim();
      return o2[0];
    })(e2);
    c[d] = o(p2 ? { ["@keyframes " + d]: t3 } : t3, r ? "" : "." + d);
  }
  let f = r && c.g ? c.g : null;
  return r && (c.g = c[d]), ((e3, t3, r2, l2) => {
    l2 ? t3.data = t3.data.replace(l2, e3) : -1 === t3.data.indexOf(e3) && (t3.data = r2 ? e3 + t3.data : t3.data + e3);
  })(c[d], t2, i2, f), d;
}, p = (e2, t2, r) => e2.reduce((e3, l2, a2) => {
  let n2 = t2[a2];
  if (n2 && n2.call) {
    let e4 = n2(r), t3 = e4 && e4.props && e4.props.className || /^go/.test(e4) && e4;
    n2 = t3 ? "." + t3 : e4 && "object" == typeof e4 ? e4.props ? "" : o(e4, "") : false === e4 ? "" : e4;
  }
  return e3 + l2 + (null == n2 ? "" : n2);
}, "");
function u(e2) {
  let r = this || {}, l2 = e2.call ? e2(r.p) : e2;
  return i(l2.unshift ? l2.raw ? p(l2, [].slice.call(arguments, 1), r.p) : l2.reduce((e3, t2) => Object.assign(e3, t2 && t2.call ? t2(r.p) : t2), {}) : l2, t(r.target), r.g, r.o, r.k);
}
u.bind({ g: 1 });
let h = u.bind({ k: 1 });
const ThemeContext = createContext();
function ThemeProvider(props) {
  return createComponent(ThemeContext.Provider, {
    value: props.theme,
    get children() {
      return props.children;
    }
  });
}
function useTheme() {
  return useContext(ThemeContext);
}
function makeStyled(tag) {
  let _ctx = this || {};
  return (...args) => {
    const Styled = (props) => {
      const theme = useContext(ThemeContext);
      const withTheme = mergeProps(props, { theme });
      const clone = mergeProps(withTheme, {
        get class() {
          const pClass = withTheme.class, append = "class" in withTheme && /^go[0-9]+/.test(pClass);
          let className2 = u.apply(
            { target: _ctx.target, o: append, p: withTheme, g: _ctx.g },
            args
          );
          return [pClass, className2].filter(Boolean).join(" ");
        }
      });
      const [local, newProps] = splitProps(clone, ["as", "theme"]);
      const htmlProps = newProps;
      const createTag = local.as || tag;
      let el;
      if (typeof createTag === "function") {
        el = createTag(htmlProps);
      } else {
        {
          if (_ctx.g == 1) {
            el = document.createElement(createTag);
            spread(el, htmlProps);
          } else {
            el = Dynamic(mergeProps({ component: createTag }, htmlProps));
          }
        }
      }
      return el;
    };
    Styled.class = (props) => {
      return untrack(() => {
        return u.apply({ target: _ctx.target, p: props, g: _ctx.g }, args);
      });
    };
    return Styled;
  };
}
const styled = new Proxy(makeStyled, {
  get(target, tag) {
    return target(tag);
  }
});
function createGlobalStyles() {
  const fn = makeStyled.call({ g: 1 }, "div").apply(null, arguments);
  return function GlobalStyles2(props) {
    fn(props);
    return null;
  };
}
const globalStylesTag = "okxc-root";
const disableScrollClass = "okxc-disable-scroll";
const usingMouseClass = "okxc-using-mouse";
const GlobalStyles = () => {
  document.body.addEventListener("mousedown", () => document.body.classList.add(usingMouseClass));
  document.body.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
      document.body.classList.remove(usingMouseClass);
    }
  });
  const Styles = createGlobalStyles`
    ${globalStylesTag} * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        
        font-family: -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', Arial, Tahoma, Verdana, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;        
        -webkit-tap-highlight-color: transparent;
    }
    
    ${globalStylesTag} img {
      -webkit-user-select: none;
      -webkit-touch-callout: none;
    }   
 
    ${globalStylesTag} *:focus {
        outline: #08f auto 2px;
    }
    
    ${globalStylesTag} li {
        list-style: none;
    }
    
    ${globalStylesTag} button {
        outline: none;
    }
    
    body.${disableScrollClass} {
        position: fixed; 
        overflow-y: scroll;
        right: 0;
        left: 0;
    }
    
    body.${usingMouseClass} ${globalStylesTag} *:focus {
        outline: none;
    }
`;
  return createComponent(Styles, {});
};
function hexToRgb(hex) {
  if (hex[0] === "#") {
    hex = hex.slice(1);
  }
  const bigint = parseInt(hex, 16);
  const r = bigint >> 16 & 255;
  const g = bigint >> 8 & 255;
  const b = bigint & 255;
  return [r, g, b].join(",");
}
function rgba(color, opacity) {
  if (color[0] === "#") {
    color = hexToRgb(color);
  }
  return `rgba(${color}, ${opacity})`;
}
function toPx(value) {
  return value.toString() + "px";
}
const _InMemoryStorage = class {
  constructor() {
    __publicField(this, "storage", {});
  }
  static getInstance() {
    if (!_InMemoryStorage.instance) {
      _InMemoryStorage.instance = new _InMemoryStorage();
    }
    return _InMemoryStorage.instance;
  }
  get length() {
    return Object.keys(this.storage).length;
  }
  clear() {
    this.storage = {};
  }
  getItem(key) {
    var _a2;
    return (_a2 = this.storage[key]) != null ? _a2 : null;
  }
  key(index) {
    var _a2;
    const keys = Object.keys(this.storage);
    if (index < 0 || index >= keys.length) {
      return null;
    }
    return (_a2 = keys[index]) != null ? _a2 : null;
  }
  removeItem(key) {
    delete this.storage[key];
  }
  setItem(key, value) {
    this.storage[key] = value;
  }
};
let InMemoryStorage = _InMemoryStorage;
__publicField(InMemoryStorage, "instance");
const debug = false;
function logDebug(...args) {
  {
    try {
      if (debug || (window == null ? void 0 : window.okxLogDebug)) {
        console.debug("[OKX_TON_CONNECT_UI]", ...args);
      }
    } catch (e2) {
    }
  }
}
function logError(...args) {
  {
    try {
      if (debug || (window == null ? void 0 : window.okxLogDebug)) {
        console.error("[OKX_TON_CONNECT_UI]", ...args);
      }
    } catch (e2) {
    }
  }
}
function logWarning(...args) {
  {
    try {
      if (debug || (window == null ? void 0 : window.okxLogDebug)) {
        console.warn("[OKX_TON_CONNECT_UI]", ...args);
      }
    } catch (e2) {
    }
  }
}
function uniq(array) {
  return [...new Set(array)];
}
let initParams = {};
try {
  let locationHash = location.hash.toString();
  initParams = urlParseHashParams(locationHash);
} catch (e2) {
}
let tmaPlatform = "unknown";
if (initParams == null ? void 0 : initParams.tgWebAppPlatform) {
  tmaPlatform = (_a = initParams.tgWebAppPlatform) != null ? _a : "unknown";
}
if (tmaPlatform === "unknown") {
  const window2 = getWindow$1();
  tmaPlatform = (_d = (_c = (_b = window2 == null ? void 0 : window2.Telegram) == null ? void 0 : _b.WebApp) == null ? void 0 : _c.platform) != null ? _d : "unknown";
}
let webAppVersion = "6.0";
if (initParams == null ? void 0 : initParams.tgWebAppVersion) {
  webAppVersion = initParams.tgWebAppVersion;
}
if (!webAppVersion) {
  const window2 = getWindow$1();
  webAppVersion = (_g = (_f = (_e = window2 == null ? void 0 : window2.Telegram) == null ? void 0 : _e.WebApp) == null ? void 0 : _f.version) != null ? _g : "6.0";
}
function isTmaPlatform(...platforms) {
  return platforms.includes(tmaPlatform);
}
function isInTMA() {
  var _a2;
  return tmaPlatform !== "unknown" || !!((_a2 = getWindow$1()) == null ? void 0 : _a2.TelegramWebviewProxy);
}
function isInTelegramBrowser() {
  var _a2;
  const isTelegramWebview = !!((_a2 = getWindow$1()) == null ? void 0 : _a2.TelegramWebview);
  return (isInTMA() || isTelegramWebview) && tmaPlatform === "unknown";
}
function sendExpand() {
  postEvent("web_app_expand", {});
}
function isIframe() {
  try {
    const window2 = getWindow$1();
    if (!window2) {
      return false;
    }
    return window2.parent != null && window2 !== window2.parent;
  } catch (e2) {
    return false;
  }
}
function postEvent(eventType, eventData) {
  try {
    const window2 = getWindow$1();
    if (!window2) {
      throw new OKXConnectUiError(`Can't post event to parent window: window is not defined`);
    }
    if (window2.TelegramWebviewProxy !== void 0) {
      logDebug("postEvent", eventType, eventData);
      window2.TelegramWebviewProxy.postEvent(eventType, JSON.stringify(eventData));
    } else if (window2.external && "notify" in window2.external) {
      logDebug("postEvent", eventType, eventData);
      window2.external.notify(JSON.stringify({ eventType, eventData }));
    } else if (isIframe()) {
      const trustedTarget = "*";
      const message = JSON.stringify({ eventType, eventData });
      logDebug("postEvent", eventType, eventData);
      window2.parent.postMessage(message, trustedTarget);
    } else {
      throw new OKXConnectUiError(`Can't post event to TMA`);
    }
  } catch (e2) {
    logError(`Can't post event to parent window: ${e2}`);
  }
}
function urlParseHashParams(locationHash) {
  locationHash = locationHash.replace(/^#/, "");
  let params = {};
  if (!locationHash.length) {
    return params;
  }
  if (locationHash.indexOf("=") < 0 && locationHash.indexOf("?") < 0) {
    params._path = urlSafeDecode(locationHash);
    return params;
  }
  let qIndex = locationHash.indexOf("?");
  if (qIndex >= 0) {
    let pathParam = locationHash.substr(0, qIndex);
    params._path = urlSafeDecode(pathParam);
    locationHash = locationHash.substr(qIndex + 1);
  }
  let query_params = urlParseQueryString(locationHash);
  for (let k in query_params) {
    params[k] = query_params[k];
  }
  return params;
}
function urlSafeDecode(urlencoded) {
  try {
    urlencoded = urlencoded.replace(/\+/g, "%20");
    return decodeURIComponent(urlencoded);
  } catch (e2) {
    return urlencoded;
  }
}
function urlParseQueryString(queryString) {
  let params = {};
  if (!queryString.length) {
    return params;
  }
  let queryStringParams = queryString.split("&");
  let i2, param, paramName, paramValue;
  for (i2 = 0; i2 < queryStringParams.length; i2++) {
    param = queryStringParams[i2].split("=");
    paramName = urlSafeDecode(param[0]);
    paramValue = param[1] == null ? null : urlSafeDecode(param[1]);
    params[paramName] = paramValue;
  }
  return params;
}
const maxWidth = {
  mobile: 440,
  tablet: 1020
};
function isDevice(device) {
  var _a2;
  const window2 = getWindow$1();
  if (!window2) {
    return device === "desktop";
  }
  if (isTmaPlatform("weba")) {
    return true;
  }
  const width = window2.innerWidth;
  switch (device) {
    case "desktop":
      return width > maxWidth.tablet;
    case "tablet":
      return width > maxWidth.mobile;
    default:
    case "mobile":
      let isMobile2 = width <= maxWidth.mobile || isOS("ios", "android", "ipad");
      if (isMobile2) {
        const isTelegram = !!((_a2 = getWindow$1()) == null ? void 0 : _a2.TelegramWebviewProxy);
        const maxTouchPoints = navigator.maxTouchPoints || 0;
        if (isTelegram && maxTouchPoints === 0) {
          isMobile2 = false;
        }
        core.logDebug("isDevice mobile isTelegram and maxTouchPoints:", isMobile2, isTelegram, maxTouchPoints);
      }
      return isMobile2;
  }
}
function media(device) {
  switch (device) {
    case "mobile":
      return `@media (max-width: ${maxWidth.mobile}px)`;
    case "tablet":
      return `@media (max-width: ${maxWidth.tablet}px) (min-width: ${maxWidth.mobile}px)`;
    default:
    case "desktop":
      return `@media (min-width: ${maxWidth.tablet}px)`;
  }
}
const mediaTouch = "@media (hover: none)";
const mediaNotTouch = "@media not all and (hover: none)";
const [isMobile, setIsMobile] = createSignal(isDevice("mobile"));
const updateIsMobile = () => setIsMobile(isDevice("mobile"));
if (getWindow$1()) {
  window.addEventListener("resize", () => updateIsMobile());
  window.addEventListener("load", () => updateIsMobile(), { once: true });
}
function eqWalletName(wallet1, name) {
  if (!name) {
    return false;
  }
  return wallet1.name.toLowerCase() === name.toLowerCase() || wallet1.appName.toLowerCase() === name.toLowerCase();
}
function inTg() {
  return isInTelegramBrowser() || isInTMA();
}
function showTonTgWallet() {
  if (!inTg()) {
    return false;
  }
  return true;
}
function showUniversalTgWalletByRequestNameSpaces(nameSpaces, optionalNameSpace) {
  if (!inTg()) {
    return false;
  }
  return EqnameSpace();
}
function showUniversalTgWalletBySessionNameSpaces(sessionNameSpace) {
  if (!inTg()) {
    return false;
  }
  return EqnameSpace();
}
function EqnameSpace(_) {
  return true;
}
function defaultOpenUniversalLink(nameSpaces, optionalNameSpace) {
  if (!showUniversalTgWalletByRequestNameSpaces()) {
    return isMobile();
  }
  return false;
}
function defaultOpenTonUniversalLink() {
  if (!showTonTgWallet()) {
    return isMobile();
  }
  return false;
}
function isAppWallet(walletInfo) {
  if (!walletInfo)
    return false;
  return walletInfo.name === core.creatOKXWalletInfo().name;
}
function openUniversalWallet(walletInfo, twaReturnUrl, sessionNameSpace) {
  core.logDebug("wallets openUniversalWallet");
  if (showUniversalTgWalletBySessionNameSpaces()) {
    openWallet(walletInfo, twaReturnUrl);
  }
}
function openTonWallet(walletInfo, twaReturnUrl) {
  core.logDebug("wallets openTonWallet");
  if (showTonTgWallet()) {
    openWallet(walletInfo, twaReturnUrl);
  }
}
function openWallet(walletInfo, twaReturnUrl) {
  core.logDebug("wallets openWallet");
  if (walletInfo) {
    if (isAppWallet(walletInfo)) {
      core.logDebug(`wallets openWallet openOKXDeeplinkWithFallback ${walletInfo.universalLink}`);
      core.openOKXDeeplink(walletInfo.deepLink);
    } else {
      core.logDebug(`wallets openWallet openOKXTMAWalletlinkWithFallback ${walletInfo.universalLink}`);
      core.openOKXTMAWalletlinkWithFallback(core.getTelegramWalletTWAUrl(void 0, twaReturnUrl, browserDebug()), browserDebug());
    }
  }
}
function browserDebug() {
  return !(isInTelegramBrowser() || isInTMA());
}
function openWalletForUIRequest(walletInfo, openMethod) {
  if (!isAppWallet(walletInfo)) {
    return true;
  }
  return isMobile() && openMethod !== "qrcode";
}
function openLink(href, target = "_self") {
  logDebug("web-api  openLink", href, target);
  window.open(href, target, "noopener noreferrer");
}
function openLinkBlank(href) {
  openLink(href, "_blank");
}
function openDeeplinkWithFallback(href, fallback) {
  logDebug(`web-api openDeeplinkWithFallback ${href}`);
  const doFallback = () => {
    if (isBrowser("safari") || isOS("android") && isBrowser("firefox")) {
      return;
    }
    fallback();
  };
  const fallbackTimeout = setTimeout(() => doFallback(), 3e3);
  window.addEventListener("blur", () => clearTimeout(fallbackTimeout), { once: true });
  if (isOS("android") && inTg()) {
    openLink(href, "_blank");
  } else {
    openLink(href, "_self");
  }
}
function getSystemTheme() {
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    return THEME.LIGHT;
  }
  return THEME.DARK;
}
function subscribeToThemeChange(callback) {
  const handler = (event) => callback(event.matches ? THEME.DARK : THEME.LIGHT);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", handler);
  return () => window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", handler);
}
function disableScroll() {
  if (document.documentElement.scrollHeight === document.documentElement.clientHeight) {
    return;
  }
  document.body.style.top = toPx(-document.documentElement.scrollTop);
  document.body.classList.add(disableScrollClass);
}
function enableScroll() {
  document.body.classList.remove(disableScrollClass);
  document.documentElement.scrollTo({ top: -parseFloat(getComputedStyle(document.body).top) });
  document.body.style.top = "auto";
}
function fixMobileSafariActiveTransition() {
  if (!document.body.hasAttribute("ontouchstart")) {
    document.body.setAttribute("ontouchstart", "");
  }
}
function defineStylesRoot() {
  if (document.body.getElementsByTagName(globalStylesTag)) {
    return;
  }
  customElements.define(
    globalStylesTag,
    class TcRootElement extends HTMLElement {
    }
  );
}
function createMacrotask(callback) {
  return __async(this, null, function* () {
    yield new Promise((resolve) => requestAnimationFrame(resolve));
    callback();
  });
}
function createMacrotaskAsync(callback) {
  return __async(this, null, function* () {
    yield new Promise((resolve) => requestAnimationFrame(resolve));
    return callback();
  });
}
function preloadImages(images) {
  if (document.readyState !== "complete") {
    window.addEventListener("load", () => createMacrotask(() => preloadImages(images)), {
      once: true
    });
  } else {
    images.forEach((img) => {
      const node = new window.Image();
      node.src = img;
    });
  }
}
function getWindow$1() {
  if (typeof window !== "undefined") {
    return window;
  }
  return void 0;
}
function tryGetLocalStorage() {
  if (isLocalStorageAvailable()) {
    return localStorage;
  }
  if (isNodeJs()) {
    throw new OKXConnectUiError(
      "`localStorage` is unavailable, but it is required for TonConnect"
    );
  }
  return InMemoryStorage.getInstance();
}
function isLocalStorageAvailable() {
  try {
    return typeof localStorage !== "undefined";
  } catch (e2) {
    return false;
  }
}
function isNodeJs() {
  return typeof process !== "undefined" && process.versions != null && process.versions.node != null;
}
function getUserAgent() {
  var _a2, _b2, _c2;
  const results = new UAParser__default.default().getResult();
  const osName = (_a2 = results.os.name) == null ? void 0 : _a2.toLowerCase();
  const deviceModel = (_b2 = results.device.model) == null ? void 0 : _b2.toLowerCase();
  let os;
  switch (true) {
    case deviceModel === "ipad":
      os = "ipad";
      break;
    case osName === "ios":
      os = "ios";
      break;
    case osName === "android":
      os = "android";
      break;
    case osName === "mac os":
      os = "macos";
      break;
    case osName === "linux":
      os = "linux";
      break;
    case (osName == null ? void 0 : osName.includes("windows")):
      os = "windows";
      break;
  }
  const browserName = (_c2 = results.browser.name) == null ? void 0 : _c2.toLowerCase();
  let browser;
  switch (true) {
    case browserName === "chrome":
      browser = "chrome";
      break;
    case browserName === "firefox":
      browser = "firefox";
      break;
    case (browserName == null ? void 0 : browserName.includes("safari")):
      browser = "safari";
      break;
    case (browserName == null ? void 0 : browserName.includes("opera")):
      browser = "opera";
      break;
  }
  return {
    os,
    browser
  };
}
function isOS(...os) {
  return os.includes(getUserAgent().os);
}
function isBrowser(...browser) {
  return browser.includes(getUserAgent().browser);
}
function toDeeplink(universalLink, deeplink) {
  const url = new URL(universalLink);
  return deeplink + url.search;
}
class WalletInfoStorage {
  constructor(storageKey) {
    __publicField(this, "localStorage");
    __publicField(this, "storageKey", "okx-wallet-connect-ui_wallet-info");
    this.localStorage = tryGetLocalStorage();
    this.storageKey = storageKey;
  }
  setWalletInfo(walletInfo) {
    this.localStorage.setItem(this.storageKey, JSON.stringify(walletInfo));
  }
  getWalletInfo() {
    const walletInfoString = this.localStorage.getItem(this.storageKey);
    if (!walletInfoString) {
      return null;
    }
    return JSON.parse(walletInfoString);
  }
  removeWalletInfo() {
    this.localStorage.removeItem(this.storageKey);
  }
}
class LastSelectedWalletInfoStorage {
  constructor() {
    __publicField(this, "localStorage");
    __publicField(this, "storageKey", "okx_wallet_connect_ui_last-selected-wallet-info");
    this.localStorage = tryGetLocalStorage();
  }
  setLastSelectedWalletInfo(walletInfo) {
    this.localStorage.setItem(this.storageKey, JSON.stringify(walletInfo));
  }
  getLastSelectedWalletInfo() {
    const walletInfoString = this.localStorage.getItem(this.storageKey);
    if (!walletInfoString) {
      return null;
    }
    return JSON.parse(walletInfoString);
  }
  removeLastSelectedWalletInfo() {
    this.localStorage.removeItem(this.storageKey);
  }
}
const [tonWalletsModalState, setTonWalletsModalState] = createSignal({
  status: "closed",
  closeReason: null
});
createMemo(() => tonWalletsModalState().status === "opened");
const [tonSingleWalletModalState, setTonSingleWalletModalState] = createSignal({
  status: "closed",
  closeReason: null
});
const getTonSingleWalletModalIsOpened = createMemo(
  () => tonSingleWalletModalState().status === "opened"
);
const getTonSingleWalletModalWalletInfo = createMemo(() => {
  const state = tonSingleWalletModalState();
  if (state.status === "opened") {
    return state.walletInfo;
  }
  return null;
});
let lastSelectedWalletInfoStorage$1 = typeof window !== "undefined" ? new LastSelectedWalletInfoStorage() : void 0;
const [lastTonSelectedWalletInfo, _setLastTonSelectedWalletInfo] = createSignal((lastSelectedWalletInfoStorage$1 == null ? void 0 : lastSelectedWalletInfoStorage$1.getLastSelectedWalletInfo()) || null);
const setLastTonSelectedWalletInfo = (walletInfo) => {
  if (!lastSelectedWalletInfoStorage$1) {
    lastSelectedWalletInfoStorage$1 = new LastSelectedWalletInfoStorage();
  }
  if (walletInfo) {
    logDebug(`modals-state.ts: setLastSelectedWalletInfo ${JSON.stringify(walletInfo)}`);
    lastSelectedWalletInfoStorage$1.setLastSelectedWalletInfo(walletInfo);
  } else {
    logDebug("modals-state.ts: setLastSelectedWalletInfo    removeLastSelectedWalletInfo");
    lastSelectedWalletInfoStorage$1.removeLastSelectedWalletInfo();
  }
  _setLastTonSelectedWalletInfo(walletInfo);
};
const [tonAction, setTonAction] = createSignal(null);
const ImagePlaceholder = styled.div`
    background-color: ${(props) => props.theme.colors.background.secondary};
`;
const Image = (props) => {
  let imgRef;
  const [image, setImage] = createSignal(null);
  createEffect(() => {
    const img = new window.Image();
    img.src = props.src;
    img.alt = props.alt || "";
    img.setAttribute("draggable", "false");
    if (props.class) {
      img.classList.add(props.class);
    }
    if (img.complete) {
      return setImage(img);
    }
    img.addEventListener("load", () => setImage(img));
    return () => img.removeEventListener("load", () => setImage(img));
  });
  return [createComponent(Show, {
    get when() {
      return image();
    },
    get children() {
      return image();
    }
  }), createComponent(Show, {
    get when() {
      return !image();
    },
    get children() {
      return createComponent(ImagePlaceholder, {
        get ["class"]() {
          return props.class;
        },
        ref(r$) {
          var _ref$ = imgRef;
          typeof _ref$ === "function" ? _ref$(r$) : imgRef = r$;
        }
      });
    }
  })];
};
const borders$2 = {
  m: "100vh",
  s: "8px",
  none: "0"
};
const scaleValues = {
  s: 0.02,
  m: 0.04
};
const ButtonStyled$1 = styled.button`
    display: ${(props) => props.leftIcon || props.rightIcon ? "flex" : "inline-block"};
    gap: ${(props) => props.leftIcon || props.rightIcon ? "6px" : "unset"};
    align-items: ${(props) => props.leftIcon || props.rightIcon ? "center" : "unset"};
    justify-content: ${(props) => props.leftIcon || props.rightIcon ? "space-between" : "unset"};
    background-color: ${(props) => props.appearance === "flat" ? "transparent" : props.appearance === "secondary" ? props.theme.colors.background.tint : rgba(props.theme.colors.accent, 0.12)};
    color: ${(props) => props.appearance === "secondary" ? props.theme.colors.text.primary : props.theme.colors.accent};

    padding: ${(props) => props.appearance === "flat" ? "0" : "9px 16px"};
    padding-left: ${(props) => props.leftIcon && props.appearance !== "flat" ? "12px" : "16px"};
    padding-right: ${(props) => props.rightIcon && props.appearance !== "flat" ? "12px" : "16px"};
    border: none;
    border-radius: ${(props) => borders$2[props.theme.borderRadius]};
    cursor: ${(props) => props.disabled ? "not-allowed" : "pointer"};

    font-size: 14px;
    font-weight: 510;
    line-height: 18px;

    transition: transform 0.125s ease-in-out;

    ${mediaNotTouch} {
        &:hover {
            transform: ${(props) => props.disabled ? "unset" : `scale(${1 + scaleValues[props.scale]})`};
        }
    }

    &:active {
        transform: ${(props) => props.disabled ? "unset" : `scale(${1 - scaleValues[props.scale]})`};
    }

    ${mediaTouch} {
        &:active {
            transform: ${(props) => props.disabled ? "unset" : `scale(${1 - scaleValues[props.scale] * 2})`};
        }
    }
`;
function useDataAttributes(props) {
  const keys = untrack(() => Object.keys(props).filter((key) => key.startsWith("data-")));
  const [dataAttrs] = splitProps(props, keys);
  return dataAttrs;
}
const Button = (props) => {
  const dataAttrs = useDataAttributes(props);
  return createComponent(ButtonStyled$1, mergeProps({
    get appearance() {
      return props.appearance || "primary";
    },
    get ["class"]() {
      return props.class;
    },
    onClick: (e2) => {
      var _a2;
      return (_a2 = props.onClick) == null ? void 0 : _a2.call(props, e2);
    },
    onMouseEnter: (e2) => {
      var _a2;
      return (_a2 = props.onMouseEnter) == null ? void 0 : _a2.call(props, e2);
    },
    onMouseLeave: (e2) => {
      var _a2;
      return (_a2 = props.onMouseLeave) == null ? void 0 : _a2.call(props, e2);
    },
    ref(r$) {
      var _ref$ = props.ref;
      typeof _ref$ === "function" ? _ref$(r$) : props.ref = r$;
    },
    get disabled() {
      return props.disabled;
    },
    get scale() {
      return props.scale || "m";
    },
    get leftIcon() {
      return !!props.leftIcon;
    },
    get rightIcon() {
      return !!props.rightIcon;
    },
    "data-tc-button": "true"
  }, dataAttrs, {
    get children() {
      return [createMemo(() => props.leftIcon), createMemo(() => props.children), createMemo(() => props.rightIcon)];
    }
  }));
};
function nextFrame(fn) {
  requestAnimationFrame(() => {
    requestAnimationFrame(fn);
  });
}
const Transition = (props) => {
  let el;
  let first = true;
  const [s1, set1] = createSignal();
  const [s2, set2] = createSignal();
  const resolved = children(() => props.children);
  const {
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onBeforeExit,
    onExit,
    onAfterExit
  } = props;
  const classnames = createMemo(() => {
    const name = props.name || "s";
    return {
      enterActiveClass: props.enterActiveClass || name + "-enter-active",
      enterClass: props.enterClass || name + "-enter",
      enterToClass: props.enterToClass || name + "-enter-to",
      exitActiveClass: props.exitActiveClass || name + "-exit-active",
      exitClass: props.exitClass || name + "-exit",
      exitToClass: props.exitToClass || name + "-exit-to"
    };
  });
  function enterTransition(el2, prev) {
    if (!first || props.appear) {
      let endTransition = function(e2) {
        if (el2 && (!e2 || e2.target === el2)) {
          el2.removeEventListener("transitionend", endTransition);
          el2.removeEventListener("animationend", endTransition);
          el2.classList.remove(...enterActiveClasses);
          el2.classList.remove(...enterToClasses);
          batch(() => {
            s1() !== el2 && set1(el2);
            s2() === el2 && set2(void 0);
          });
          onAfterEnter && onAfterEnter(el2);
          if (props.mode === "inout")
            exitTransition(el2, prev);
        }
      };
      const enterClasses = classnames().enterClass.split(" ");
      const enterActiveClasses = classnames().enterActiveClass.split(" ");
      const enterToClasses = classnames().enterToClass.split(" ");
      onBeforeEnter && onBeforeEnter(el2);
      el2.classList.add(...enterClasses);
      el2.classList.add(...enterActiveClasses);
      nextFrame(() => {
        el2.classList.remove(...enterClasses);
        el2.classList.add(...enterToClasses);
        onEnter && onEnter(el2, () => endTransition());
        if (!onEnter || onEnter.length < 2) {
          el2.addEventListener("transitionend", endTransition);
          el2.addEventListener("animationend", endTransition);
        }
      });
    }
    prev && !props.mode ? set2(el2) : set1(el2);
  }
  function exitTransition(el2, prev) {
    const exitClasses = classnames().exitClass.split(" ");
    const exitActiveClasses = classnames().exitActiveClass.split(" ");
    const exitToClasses = classnames().exitToClass.split(" ");
    if (!prev.parentNode)
      return endTransition();
    onBeforeExit && onBeforeExit(prev);
    prev.classList.add(...exitClasses);
    prev.classList.add(...exitActiveClasses);
    nextFrame(() => {
      prev.classList.remove(...exitClasses);
      prev.classList.add(...exitToClasses);
    });
    onExit && onExit(prev, () => endTransition());
    if (!onExit || onExit.length < 2) {
      prev.addEventListener("transitionend", endTransition);
      prev.addEventListener("animationend", endTransition);
    }
    function endTransition(e2) {
      if (!e2 || e2.target === prev) {
        prev.removeEventListener("transitionend", endTransition);
        prev.removeEventListener("animationend", endTransition);
        prev.classList.remove(...exitActiveClasses);
        prev.classList.remove(...exitToClasses);
        s1() === prev && set1(void 0);
        onAfterExit && onAfterExit(prev);
        if (props.mode === "outin")
          enterTransition(el2, prev);
      }
    }
  }
  createComputed((prev) => {
    el = resolved();
    while (typeof el === "function")
      el = el();
    return untrack(() => {
      if (el && el !== prev) {
        if (props.mode !== "outin")
          enterTransition(el, prev);
        else if (first)
          set1(el);
      }
      if (prev && prev !== el && props.mode !== "inout")
        exitTransition(el, prev);
      first = false;
      return el;
    });
  });
  return [s1, s2];
};
function clickOutside$1(el, accessor) {
  const onClick = (e2) => {
    var _a2;
    return !el.contains(e2.target) && ((_a2 = accessor()) == null ? void 0 : _a2());
  };
  document.body.addEventListener("click", onClick);
  onCleanup(() => document.body.removeEventListener("click", onClick));
}
function escPressed(_, accessor) {
  const onKeyPress = (e2) => {
    var _a2, _b2;
    if (e2.key === "Escape") {
      (_a2 = document.activeElement) == null ? void 0 : _a2.blur();
      (_b2 = accessor()) == null ? void 0 : _b2();
    }
  };
  document.body.addEventListener("keydown", onKeyPress);
  onCleanup(() => document.body.removeEventListener("keydown", onKeyPress));
}
function androidBackHandler$1(_, config) {
  const {
    isEnabled,
    onClose
  } = config();
  if (!isEnabled) {
    return;
  }
  const userOSIsAndroid = getUserAgent().os === "android";
  if (!userOSIsAndroid) {
    return;
  }
  window.history.pushState(ROUTE_STATE, "");
  const popstateHandler = (event) => {
    event.preventDefault();
    onClose();
  };
  window.addEventListener("popstate", popstateHandler, {
    once: true
  });
  onCleanup(() => {
    window.removeEventListener("popstate", popstateHandler);
    createMacrotask(() => {
      var _a2;
      if (((_a2 = window.history.state) == null ? void 0 : _a2[ROUTE_STATE_KEY]) === true) {
        window.history.back();
      }
    });
  });
}
const ROUTE_STATE_KEY = "androidBackHandler";
const ROUTE_STATE = {
  [ROUTE_STATE_KEY]: true
};
var _tmpl$$g = /* @__PURE__ */ template$1(`<svg><path fill-rule=evenodd clip-rule=evenodd d="M10.2122 14.3407C10.5384 14.0854 10.5959 13.614 10.3406 13.2878L6.20237 8.00003L10.3406 2.71227C10.5959 2.38607 10.5384 1.91469 10.2122 1.6594C9.88604 1.40412 9.41465 1.46161 9.15937 1.7878L4.65937 7.5378C4.44688 7.80932 4.44688 8.19074 4.65937 8.46226L9.15937 14.2123C9.41465 14.5385 9.88604 14.5959 10.2122 14.3407Z"></svg>`, false, true);
const rotationDegrees = {
  left: 0,
  top: 90,
  right: 180,
  bottom: 270
};
const ArrowIcon = (props) => {
  const theme = useTheme();
  const fill = () => props.fill || theme.colors.icon.secondary;
  const direction = () => props.direction || "left";
  const Svg = styled("svg")`
        transform: rotate(${(props2) => rotationDegrees[props2.svgDirection]}deg);
        transition: transform 0.1s ease-in-out;
    `;
  return createComponent(Svg, {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    get svgDirection() {
      return direction();
    },
    get children() {
      var _el$ = _tmpl$$g();
      createRenderEffect(() => setAttribute(_el$, "fill", fill()));
      return _el$;
    }
  });
};
var _tmpl$$f = /* @__PURE__ */ template$1(`<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"fill=none><path fill-rule=evenodd clip-rule=evenodd d="M18.5303 6.53033C18.8232 6.23744 18.8232 5.76256 18.5303 5.46967C18.2374 5.17678 17.7626 5.17678 17.4697 5.46967L12 10.9393L6.53033 5.46967C6.23744 5.17678 5.76256 5.17678 5.46967 5.46967C5.17678 5.76256 5.17678 6.23744 5.46967 6.53033L10.9393 12L5.46967 17.4697C5.17678 17.7626 5.17678 18.2374 5.46967 18.5303C5.76256 18.8232 6.23744 18.8232 6.53033 18.5303L12 13.0607L17.4697 18.5303C17.7626 18.8232 18.2374 18.8232 18.5303 18.5303C18.8232 18.2374 18.8232 17.7626 18.5303 17.4697L13.0607 12L18.5303 6.53033Z">`);
const CloseIcon = (props) => {
  const theme = useTheme();
  logDebug(`CloseIcon  ${theme}`);
  const fill = () => props.fill || theme.colors.icon.secondary;
  return (() => {
    var _el$ = _tmpl$$f(), _el$2 = _el$.firstChild;
    createRenderEffect(() => setAttribute(_el$2, "fill", fill()));
    return _el$;
  })();
};
var _tmpl$$e = /* @__PURE__ */ template$1(`<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path fill-rule=evenodd clip-rule=evenodd d="M14.1839 17.7069C13.6405 18.6507 13.3688 19.1226 13.0591 19.348C12.4278 19.8074 11.5723 19.8074 10.941 19.348C10.6312 19.1226 10.3595 18.6507 9.81613 17.7069L5.52066 10.2464C4.76864 8.94024 4.39263 8.28717 4.33762 7.75894C4.2255 6.68236 4.81894 5.65591 5.80788 5.21589C6.29309 5 7.04667 5 8.55383 5H15.4462C16.9534 5 17.7069 5 18.1922 5.21589C19.1811 5.65591 19.7745 6.68236 19.6624 7.75894C19.6074 8.28717 19.2314 8.94024 18.4794 10.2464L14.1839 17.7069ZM11.1 16.3412L6.56139 8.48002C6.31995 8.06185 6.19924 7.85276 6.18146 7.68365C6.14523 7.33896 6.33507 7.01015 6.65169 6.86919C6.80703 6.80002 7.04847 6.80002 7.53133 6.80002H7.53134L11.1 6.80002V16.3412ZM12.9 16.3412L17.4387 8.48002C17.6801 8.06185 17.8008 7.85276 17.8186 7.68365C17.8548 7.33896 17.665 7.01015 17.3484 6.86919C17.193 6.80002 16.9516 6.80002 16.4687 6.80002L12.9 6.80002V16.3412Z">`);
const TonIcon = (props) => {
  const theme = useTheme();
  const fill = () => props.fill || theme.colors.icon.primary;
  return (() => {
    var _el$ = _tmpl$$e(), _el$2 = _el$.firstChild;
    createRenderEffect(() => setAttribute(_el$2, "fill", fill()));
    return _el$;
  })();
};
var _tmpl$$d = /* @__PURE__ */ template$1(`<svg xmlns=http://www.w3.org/2000/svg width=16 height=16 viewBox="0 0 16 16"fill=none><g clip-path=url(#clip0_3783_2045)><circle cx=8 cy=8.00098 r=8></circle><path d="M4.75 8.50098L7 10.751L11.75 6.00098"stroke-width=1.5 stroke-linecap=round stroke-linejoin=round></path></g><defs><clipPath id=clip0_3783_2045><rect width=16 height=16 fill=white transform="translate(0 0.000976562)">`), _tmpl$2$3 = /* @__PURE__ */ template$1(`<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><circle cx=12 cy=12 r=11></circle><path d="M17.1364 9.6364C17.4879 9.28493 17.4879 8.71508 17.1364 8.36361C16.7849 8.01214 16.2151 8.01214 15.8636 8.36361L10 14.2272L8.1364 12.3636C7.78493 12.0121 7.21508 12.0121 6.86361 12.3636C6.51214 12.7151 6.51214 13.2849 6.86361 13.6364L9.36361 16.1364C9.71508 16.4879 10.2849 16.4879 10.6364 16.1364L17.1364 9.6364Z">`), _tmpl$3$2 = /* @__PURE__ */ template$1(`<svg width=72 height=72 viewBox="0 0 72 72"fill=none xmlns=http://www.w3.org/2000/svg><circle cx=36 cy=36 r=33></circle><path d="M50.9142 28.4142C51.6953 27.6332 51.6953 26.3668 50.9142 25.5858C50.1332 24.8047 48.8668 24.8047 48.0858 25.5858L30 43.6716L23.9142 37.5858C23.1332 36.8047 21.8668 36.8047 21.0858 37.5858C20.3047 38.3668 20.3047 39.6332 21.0858 40.4142L28.5858 47.9142C29.3668 48.6953 30.6332 48.6953 31.4142 47.9142L50.9142 28.4142Z">`);
const SuccessIcon = (props) => {
  const theme = useTheme();
  const size2 = () => props.size || "s";
  const fill = () => props.fill || theme.colors.icon.success;
  return createMemo(() => createMemo(() => size2() === "xs")() ? (() => {
    var _el$ = _tmpl$$d(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling;
    createRenderEffect((_p$) => {
      var _v$ = props.class, _v$2 = fill(), _v$3 = theme.colors.constant.white;
      _v$ !== _p$.e && setAttribute(_el$, "class", _p$.e = _v$);
      _v$2 !== _p$.t && setAttribute(_el$3, "fill", _p$.t = _v$2);
      _v$3 !== _p$.a && setAttribute(_el$4, "stroke", _p$.a = _v$3);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    });
    return _el$;
  })() : createMemo(() => size2() === "s")() ? (() => {
    var _el$5 = _tmpl$2$3(), _el$6 = _el$5.firstChild, _el$7 = _el$6.nextSibling;
    createRenderEffect((_p$) => {
      var _v$4 = props.class, _v$5 = fill(), _v$6 = theme.colors.constant.white;
      _v$4 !== _p$.e && setAttribute(_el$5, "class", _p$.e = _v$4);
      _v$5 !== _p$.t && setAttribute(_el$6, "fill", _p$.t = _v$5);
      _v$6 !== _p$.a && setAttribute(_el$7, "fill", _p$.a = _v$6);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    });
    return _el$5;
  })() : (() => {
    var _el$8 = _tmpl$3$2(), _el$9 = _el$8.firstChild, _el$10 = _el$9.nextSibling;
    createRenderEffect((_p$) => {
      var _v$7 = props.class, _v$8 = fill(), _v$9 = theme.colors.constant.white;
      _v$7 !== _p$.e && setAttribute(_el$8, "class", _p$.e = _v$7);
      _v$8 !== _p$.t && setAttribute(_el$9, "fill", _p$.t = _v$8);
      _v$9 !== _p$.a && setAttribute(_el$10, "fill", _p$.a = _v$9);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    });
    return _el$8;
  })());
};
var _tmpl$$c = /* @__PURE__ */ template$1(`<svg xmlns=http://www.w3.org/2000/svg width=103 height=102 viewBox="0 0 103 102"fill=none><path fill-rule=evenodd clip-rule=evenodd d="M51.5 14.8747C31.5487 14.8747 15.375 31.0485 15.375 50.9997C15.375 70.951 31.5487 87.1247 51.5 87.1247C71.4513 87.1247 87.625 70.951 87.625 50.9997C87.625 31.0485 71.4513 14.8747 51.5 14.8747ZM9 50.9997C9 27.5276 28.0279 8.49974 51.5 8.49974C74.9721 8.49974 94 27.5276 94 50.9997C94 74.4718 74.9721 93.4997 51.5 93.4997C28.0279 93.4997 9 74.4718 9 50.9997ZM65.0234 37.4765C66.2682 38.7213 66.2682 40.7395 65.0234 41.9843L56.0078 50.9999L65.0234 60.0155C66.2682 61.2603 66.2682 63.2785 65.0234 64.5233C63.7786 65.7681 61.7604 65.7681 60.5156 64.5233L51.5 55.5077L42.4844 64.5233C41.2396 65.7681 39.2214 65.7681 37.9766 64.5233C36.7318 63.2785 36.7318 61.2603 37.9766 60.0155L46.9922 50.9999L37.9766 41.9843C36.7318 40.7395 36.7318 38.7213 37.9766 37.4765C39.2214 36.2317 41.2396 36.2317 42.4844 37.4765L51.5 46.4921L60.5156 37.4765C61.7604 36.2317 63.7787 36.2317 65.0234 37.4765Z"fill=#909090>`), _tmpl$2$2 = /* @__PURE__ */ template$1(`<svg xmlns=http://www.w3.org/2000/svg width=72 height=72 viewBox="0 0 103 102"fill=none><path fill-rule=evenodd clip-rule=evenodd d="M51.5 14.8747C31.5487 14.8747 15.375 31.0485 15.375 50.9997C15.375 70.951 31.5487 87.1247 51.5 87.1247C71.4513 87.1247 87.625 70.951 87.625 50.9997C87.625 31.0485 71.4513 14.8747 51.5 14.8747ZM9 50.9997C9 27.5276 28.0279 8.49974 51.5 8.49974C74.9721 8.49974 94 27.5276 94 50.9997C94 74.4718 74.9721 93.4997 51.5 93.4997C28.0279 93.4997 9 74.4718 9 50.9997ZM65.0234 37.4765C66.2682 38.7213 66.2682 40.7395 65.0234 41.9843L56.0078 50.9999L65.0234 60.0155C66.2682 61.2603 66.2682 63.2785 65.0234 64.5233C63.7786 65.7681 61.7604 65.7681 60.5156 64.5233L51.5 55.5077L42.4844 64.5233C41.2396 65.7681 39.2214 65.7681 37.9766 64.5233C36.7318 63.2785 36.7318 61.2603 37.9766 60.0155L46.9922 50.9999L37.9766 41.9843C36.7318 40.7395 36.7318 38.7213 37.9766 37.4765C39.2214 36.2317 41.2396 36.2317 42.4844 37.4765L51.5 46.4921L60.5156 37.4765C61.7604 36.2317 63.7787 36.2317 65.0234 37.4765Z"fill=#909090>`), _tmpl$3$1 = /* @__PURE__ */ template$1(`<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 103 102"fill=none><path fill-rule=evenodd clip-rule=evenodd d="M51.5 14.8747C31.5487 14.8747 15.375 31.0485 15.375 50.9997C15.375 70.951 31.5487 87.1247 51.5 87.1247C71.4513 87.1247 87.625 70.951 87.625 50.9997C87.625 31.0485 71.4513 14.8747 51.5 14.8747ZM9 50.9997C9 27.5276 28.0279 8.49974 51.5 8.49974C74.9721 8.49974 94 27.5276 94 50.9997C94 74.4718 74.9721 93.4997 51.5 93.4997C28.0279 93.4997 9 74.4718 9 50.9997ZM65.0234 37.4765C66.2682 38.7213 66.2682 40.7395 65.0234 41.9843L56.0078 50.9999L65.0234 60.0155C66.2682 61.2603 66.2682 63.2785 65.0234 64.5233C63.7786 65.7681 61.7604 65.7681 60.5156 64.5233L51.5 55.5077L42.4844 64.5233C41.2396 65.7681 39.2214 65.7681 37.9766 64.5233C36.7318 63.2785 36.7318 61.2603 37.9766 60.0155L46.9922 50.9999L37.9766 41.9843C36.7318 40.7395 36.7318 38.7213 37.9766 37.4765C39.2214 36.2317 41.2396 36.2317 42.4844 37.4765L51.5 46.4921L60.5156 37.4765C61.7604 36.2317 63.7787 36.2317 65.0234 37.4765Z"fill=#909090>`);
const ErrorIcon = (props) => {
  useTheme();
  const size2 = () => props.size || "m";
  return createMemo(() => createMemo(() => size2() === "m")() ? _tmpl$$c() : createMemo(() => size2() === "s")() ? _tmpl$2$2() : _tmpl$3$1());
};
var _tmpl$$b = /* @__PURE__ */ template$1(`<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M15.55 5.85123C18.9459 7.81184 20.1094 12.1541 18.1488 15.55C16.1882 18.9459 11.8459 20.1094 8.44998 18.1488C8.01952 17.9003 7.46909 18.0478 7.22056 18.4782C6.97203 18.9087 7.11952 19.4591 7.54998 19.7076C11.8068 22.1653 17.2499 20.7068 19.7076 16.45C22.1653 12.1932 20.7068 6.75005 16.45 4.29239C12.1932 1.83472 6.75003 3.29321 4.29236 7.55001C4.04383 7.98047 4.19132 8.53091 4.62178 8.77943C5.05224 9.02796 5.60268 8.88048 5.8512 8.45001C7.81181 5.05413 12.1541 3.89062 15.55 5.85123Z">`), _tmpl$2$1 = /* @__PURE__ */ template$1(`<svg xmlns=http://www.w3.org/2000/svg width=44 height=44 viewBox="0 0 44 44"fill=none><path fill-rule=evenodd clip-rule=evenodd d="M22 2.99951C11.5066 2.99951 3 11.5061 3 21.9995C3 32.4929 11.5066 40.9995 22 40.9995C22.8284 40.9995 23.5 41.6711 23.5 42.4995C23.5 43.3279 22.8284 43.9995 22 43.9995C9.84974 43.9995 0 34.1498 0 21.9995C0 9.84925 9.84974 -0.000488281 22 -0.000488281C34.1503 -0.000488281 44 9.84925 44 21.9995C44 22.8279 43.3284 23.4995 42.5 23.4995C41.6716 23.4995 41 22.8279 41 21.9995C41 11.5061 32.4934 2.99951 22 2.99951Z">`), _tmpl$3 = /* @__PURE__ */ template$1(`<svg width=72 height=72 viewBox="0 0 72 72"fill=none xmlns=http://www.w3.org/2000/svg><path d="M24 56.7846C35.479 63.412 50.1572 59.479 56.7846 47.9999C63.412 36.5209 59.479 21.8427 48 15.2153C36.521 8.58791 21.8428 12.5209 15.2154 23.9999"stroke-width=4 stroke-linecap=round stroke-linejoin=round>`);
const LoaderIcon = (props) => {
  const theme = useTheme();
  const size2 = () => props.size || "xs";
  const fill = () => props.fill || theme.colors.icon.tertiary;
  const rotateAnimation = h`
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
    `;
  const svgClass = u`
        animation: ${rotateAnimation} 1s linear infinite;
    `;
  return createMemo(() => createMemo(() => size2() === "xs")() ? (() => {
    var _el$ = _tmpl$$b(), _el$2 = _el$.firstChild;
    createRenderEffect((_p$) => {
      var _v$ = cn__default.default(svgClass, props.class), _v$2 = fill();
      _v$ !== _p$.e && setAttribute(_el$, "class", _p$.e = _v$);
      _v$2 !== _p$.t && setAttribute(_el$2, "fill", _p$.t = _v$2);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$;
  })() : createMemo(() => size2() === "s")() ? (() => {
    var _el$3 = _tmpl$2$1(), _el$4 = _el$3.firstChild;
    createRenderEffect((_p$) => {
      var _v$3 = cn__default.default(svgClass, props.class), _v$4 = fill();
      _v$3 !== _p$.e && setAttribute(_el$3, "class", _p$.e = _v$3);
      _v$4 !== _p$.t && setAttribute(_el$4, "fill", _p$.t = _v$4);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$3;
  })() : (() => {
    var _el$5 = _tmpl$3(), _el$6 = _el$5.firstChild;
    createRenderEffect((_p$) => {
      var _v$5 = cn__default.default(svgClass, props.class), _v$6 = fill();
      _v$5 !== _p$.e && setAttribute(_el$5, "class", _p$.e = _v$5);
      _v$6 !== _p$.t && setAttribute(_el$6, "stroke", _p$.t = _v$6);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$5;
  })());
};
var _tmpl$$a = /* @__PURE__ */ template$1(`<svg xmlns=http://www.w3.org/2000/svg width=16 height=16 viewBox="0 0 16 16"fill=none><path fill-rule=evenodd clip-rule=evenodd d="M5.56608 4.42584C5.82527 3.32158 6.8176 2.5 8.00001 2.5C9.38072 2.5 10.5 3.61929 10.5 5C10.5 5.63026 10.3391 6.0386 10.1264 6.34455C9.90018 6.66993 9.58561 6.92478 9.18864 7.20877C9.12579 7.25372 9.05873 7.30025 8.9887 7.34883C8.27392 7.84472 7.25001 8.55507 7.25001 10V10.25C7.25001 10.6642 7.5858 11 8.00001 11C8.41422 11 8.75001 10.6642 8.75001 10.25V10C8.75001 9.36502 9.10777 9.1096 9.94554 8.51149L10.0614 8.42873C10.4769 8.13147 10.9748 7.75194 11.358 7.20076C11.7547 6.63015 12 5.91973 12 5C12 2.79086 10.2091 1 8.00001 1C6.10564 1 4.5205 2.31615 4.10577 4.08308C4.01112 4.48634 4.26129 4.88997 4.66454 4.98462C5.0678 5.07927 5.47143 4.8291 5.56608 4.42584ZM8.00001 15C8.60752 15 9.10001 14.5075 9.10001 13.9C9.10001 13.2925 8.60752 12.8 8.00001 12.8C7.39249 12.8 6.90001 13.2925 6.90001 13.9C6.90001 14.5075 7.39249 15 8.00001 15Z">`);
const QuestionIcon = (props) => {
  const theme = useTheme();
  const fill = () => props.fill || theme.colors.icon.secondary;
  return (() => {
    var _el$ = _tmpl$$a(), _el$2 = _el$.firstChild;
    createRenderEffect(() => setAttribute(_el$2, "fill", fill()));
    return _el$;
  })();
};
var _tmpl$$9 = /* @__PURE__ */ template$1(`<svg xmlns=http://www.w3.org/2000/svg width=16 height=16 viewBox="0 0 16 16"fill=none><path fill-rule=evenodd clip-rule=evenodd d="M3.56176 1.87482C3.8379 1.87482 4.06176 2.09867 4.06176 2.37482V3.69674C5.09916 2.7469 6.48174 2.16666 7.99996 2.16666C11.2216 2.16666 13.8333 4.77834 13.8333 8C13.8333 11.2217 11.2216 13.8333 7.99996 13.8333C4.7783 13.8333 2.16663 11.2217 2.16663 8C2.16663 7.72385 2.39048 7.5 2.66663 7.5C2.94277 7.5 3.16663 7.72385 3.16663 8C3.16663 10.6694 5.33058 12.8333 7.99996 12.8333C10.6693 12.8333 12.8333 10.6694 12.8333 8C12.8333 5.33062 10.6693 3.16666 7.99996 3.16666C6.68645 3.16666 5.49513 3.69037 4.62354 4.54148H6.22843C6.50457 4.54148 6.72843 4.76534 6.72843 5.04148C6.72843 5.31763 6.50457 5.54148 6.22843 5.54148H3.56176C3.28562 5.54148 3.06176 5.31763 3.06176 5.04148V2.37482C3.06176 2.09867 3.28562 1.87482 3.56176 1.87482Z">`);
const RetryIcon = (_) => {
  const theme = useTheme();
  return (() => {
    var _el$ = _tmpl$$9(), _el$2 = _el$.firstChild;
    createRenderEffect(() => setAttribute(_el$2, "fill", theme.colors.text.primary));
    return _el$;
  })();
};
var _tmpl$$8 = /* @__PURE__ */ template$1(`<svg xmlns=http://www.w3.org/2000/svg width=16 height=17 viewBox="0 0 16 17"fill=none><path fill-rule=evenodd clip-rule=evenodd d="M1 4.12695C1 3.07754 1 2.55284 1.19202 2.14684C1.38986 1.72856 1.7266 1.39181 2.14489 1.19397C2.55088 1.00195 3.07559 1.00195 4.125 1.00195C5.17441 1.00195 5.69912 1.00195 6.10511 1.19397C6.5234 1.39181 6.86014 1.72856 7.05798 2.14684C7.25 2.55284 7.25 3.07754 7.25 4.12695C7.25 5.17636 7.25 5.70107 7.05798 6.10706C6.86014 6.52535 6.5234 6.8621 6.10511 7.05993C5.69912 7.25195 5.17441 7.25195 4.125 7.25195C3.07559 7.25195 2.55088 7.25195 2.14489 7.05993C1.7266 6.8621 1.38986 6.52535 1.19202 6.10706C1 5.70107 1 5.17636 1 4.12695ZM2.5 3.30195C2.5 3.02193 2.5 2.88191 2.5545 2.77496C2.60243 2.68088 2.67892 2.60439 2.773 2.55645C2.87996 2.50195 3.01997 2.50195 3.3 2.50195H4.95C5.23003 2.50195 5.37004 2.50195 5.477 2.55645C5.57108 2.60439 5.64757 2.68088 5.6955 2.77496C5.75 2.88191 5.75 3.02193 5.75 3.30195V4.95195C5.75 5.23198 5.75 5.37199 5.6955 5.47895C5.64757 5.57303 5.57108 5.64952 5.477 5.69746C5.37004 5.75195 5.23003 5.75195 4.95 5.75195H3.3C3.01997 5.75195 2.87996 5.75195 2.773 5.69746C2.67892 5.64952 2.60243 5.57303 2.5545 5.47895C2.5 5.37199 2.5 5.23198 2.5 4.95195V3.30195ZM1 11.877C1 10.8275 1 10.3028 1.19202 9.89684C1.38986 9.47856 1.7266 9.14181 2.14489 8.94397C2.55088 8.75195 3.07559 8.75195 4.125 8.75195C5.17441 8.75195 5.69912 8.75195 6.10511 8.94397C6.5234 9.14181 6.86014 9.47856 7.05798 9.89684C7.25 10.3028 7.25 10.8275 7.25 11.877C7.25 12.9264 7.25 13.4511 7.05798 13.8571C6.86014 14.2753 6.5234 14.6121 6.10511 14.8099C5.69912 15.002 5.17441 15.002 4.125 15.002C3.07559 15.002 2.55088 15.002 2.14489 14.8099C1.7266 14.6121 1.38986 14.2753 1.19202 13.8571C1 13.4511 1 12.9264 1 11.877ZM2.5 11.052C2.5 10.7719 2.5 10.6319 2.5545 10.525C2.60243 10.4309 2.67892 10.3544 2.773 10.3064C2.87996 10.252 3.01997 10.252 3.3 10.252H4.95C5.23003 10.252 5.37004 10.252 5.477 10.3064C5.57108 10.3544 5.64757 10.4309 5.6955 10.525C5.75 10.6319 5.75 10.7719 5.75 11.052V12.702C5.75 12.982 5.75 13.122 5.6955 13.2289C5.64757 13.323 5.57108 13.3995 5.477 13.4475C5.37004 13.502 5.23003 13.502 4.95 13.502H3.3C3.01997 13.502 2.87996 13.502 2.773 13.4475C2.67892 13.3995 2.60243 13.323 2.5545 13.2289C2.5 13.122 2.5 12.982 2.5 12.702V11.052ZM8.94202 2.14684C8.75 2.55284 8.75 3.07754 8.75 4.12695C8.75 5.17636 8.75 5.70107 8.94202 6.10706C9.13986 6.52535 9.4766 6.8621 9.89489 7.05993C10.3009 7.25195 10.8256 7.25195 11.875 7.25195C12.9244 7.25195 13.4491 7.25195 13.8551 7.05993C14.2734 6.8621 14.6101 6.52535 14.808 6.10706C15 5.70107 15 5.17636 15 4.12695C15 3.07754 15 2.55284 14.808 2.14684C14.6101 1.72856 14.2734 1.39181 13.8551 1.19397C13.4491 1.00195 12.9244 1.00195 11.875 1.00195C10.8256 1.00195 10.3009 1.00195 9.89489 1.19397C9.4766 1.39181 9.13986 1.72856 8.94202 2.14684ZM10.3045 2.77496C10.25 2.88191 10.25 3.02193 10.25 3.30195V4.95195C10.25 5.23198 10.25 5.37199 10.3045 5.47895C10.3524 5.57303 10.4289 5.64952 10.523 5.69746C10.63 5.75195 10.77 5.75195 11.05 5.75195H12.7C12.98 5.75195 13.12 5.75195 13.227 5.69746C13.3211 5.64952 13.3976 5.57303 13.4455 5.47895C13.5 5.37199 13.5 5.23198 13.5 4.95195V3.30195C13.5 3.02193 13.5 2.88191 13.4455 2.77496C13.3976 2.68088 13.3211 2.60439 13.227 2.55645C13.12 2.50195 12.98 2.50195 12.7 2.50195H11.05C10.77 2.50195 10.63 2.50195 10.523 2.55645C10.4289 2.60439 10.3524 2.68088 10.3045 2.77496ZM8.80727 9.13518C8.75 9.26242 8.75 9.4256 8.75 9.75195C8.75 10.0783 8.75 10.2415 8.80727 10.3687C8.87245 10.5136 8.9884 10.6295 9.13323 10.6947C9.26047 10.752 9.42365 10.752 9.75 10.752C10.0764 10.752 10.2395 10.752 10.3668 10.6947C10.5116 10.6295 10.6276 10.5136 10.6927 10.3687C10.75 10.2415 10.75 10.0783 10.75 9.75195C10.75 9.4256 10.75 9.26242 10.6927 9.13518C10.6276 8.99035 10.5116 8.8744 10.3668 8.80922C10.2395 8.75195 10.0764 8.75195 9.75 8.75195C9.42365 8.75195 9.26047 8.75195 9.13323 8.80922C8.9884 8.8744 8.87245 8.99035 8.80727 9.13518ZM10.87 11.8771C10.87 11.546 10.87 11.3805 10.9289 11.2517C10.9938 11.1098 11.1077 10.9959 11.2497 10.931C11.3784 10.8721 11.5439 10.8721 11.875 10.8721C12.2061 10.8721 12.3716 10.8721 12.5003 10.931C12.6423 10.9959 12.7562 11.1098 12.8211 11.2517C12.88 11.3805 12.88 11.546 12.88 11.8771C12.88 12.2081 12.88 12.3737 12.8211 12.5024C12.7562 12.6444 12.6423 12.7583 12.5003 12.8232C12.3716 12.8821 12.2061 12.8821 11.875 12.8821C11.5439 12.8821 11.3784 12.8821 11.2497 12.8232C11.1077 12.7583 10.9938 12.6444 10.9289 12.5024C10.87 12.3737 10.87 12.2081 10.87 11.8771ZM8.80727 13.3852C8.75 13.5124 8.75 13.6756 8.75 14.002C8.75 14.3283 8.75 14.4915 8.80727 14.6187C8.87245 14.7636 8.9884 14.8795 9.13323 14.9447C9.26047 15.002 9.42365 15.002 9.75 15.002C10.0764 15.002 10.2395 15.002 10.3668 14.9447C10.5116 14.8795 10.6276 14.7636 10.6927 14.6187C10.75 14.4915 10.75 14.3283 10.75 14.002C10.75 13.6756 10.75 13.5124 10.6927 13.3852C10.6276 13.2404 10.5116 13.1244 10.3668 13.0592C10.2395 13.002 10.0764 13.002 9.75 13.002C9.42365 13.002 9.26047 13.002 9.13323 13.0592C8.9884 13.1244 8.87245 13.2404 8.80727 13.3852ZM13 9.75195C13 9.4256 13 9.26242 13.0573 9.13518C13.1224 8.99035 13.2384 8.8744 13.3832 8.80922C13.5105 8.75195 13.6736 8.75195 14 8.75195C14.3264 8.75195 14.4895 8.75195 14.6168 8.80922C14.7616 8.8744 14.8776 8.99035 14.9427 9.13518C15 9.26242 15 9.4256 15 9.75195C15 10.0783 15 10.2415 14.9427 10.3687C14.8776 10.5136 14.7616 10.6295 14.6168 10.6947C14.4895 10.752 14.3264 10.752 14 10.752C13.6736 10.752 13.5105 10.752 13.3832 10.6947C13.2384 10.6295 13.1224 10.5136 13.0573 10.3687C13 10.2415 13 10.0783 13 9.75195ZM13.0573 13.3852C13 13.5124 13 13.6756 13 14.002C13 14.3283 13 14.4915 13.0573 14.6187C13.1224 14.7636 13.2384 14.8795 13.3832 14.9447C13.5105 15.002 13.6736 15.002 14 15.002C14.3264 15.002 14.4895 15.002 14.6168 14.9447C14.7616 14.8795 14.8776 14.7636 14.9427 14.6187C15 14.4915 15 14.3283 15 14.002C15 13.6756 15 13.5124 14.9427 13.3852C14.8776 13.2404 14.7616 13.1244 14.6168 13.0592C14.4895 13.002 14.3264 13.002 14 13.002C13.6736 13.002 13.5105 13.002 13.3832 13.0592C13.2384 13.1244 13.1224 13.2404 13.0573 13.3852Z">`);
const QRIcon = (props) => {
  const theme = useTheme();
  const fill = () => props.fill || theme.colors.icon.secondary;
  return (() => {
    var _el$ = _tmpl$$8(), _el$2 = _el$.firstChild;
    createRenderEffect(() => setAttribute(_el$2, "fill", fill()));
    return _el$;
  })();
};
const IconButtonStyled = styled.button`
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: transparent;
    border: none;
    cursor: pointer;

    transition: transform 0.125s ease-in-out;

    ${mediaNotTouch} {
        &:hover {
            transform: scale(1.04);
        }
    }

    &:active {
        transform: scale(0.96);
    }

    ${mediaTouch} {
        &:active {
            transform: scale(0.92);
        }
    }
`;
const IconButton = (props) => {
  const dataAttrs = useDataAttributes(props);
  const icon = () => props.icon || "close";
  return createComponent(IconButtonStyled, mergeProps({
    get ["class"]() {
      return props.class;
    },
    onClick: () => props.onClick(),
    "data-tc-icon-button": "true"
  }, dataAttrs, {
    get children() {
      return [createComponent(Show, {
        get when() {
          return !!props.children;
        },
        get children() {
          return props.children;
        }
      }), createComponent(Show, {
        get when() {
          return !props.children;
        },
        get children() {
          return createComponent(Switch, {
            get children() {
              return [createComponent(Match, {
                get when() {
                  return icon() === "close";
                },
                get children() {
                  return createComponent(CloseIcon, {
                    get fill() {
                      return props.fill;
                    }
                  });
                }
              }), createComponent(Match, {
                get when() {
                  return icon() === "arrow";
                },
                get children() {
                  return createComponent(ArrowIcon, {
                    get fill() {
                      return props.fill;
                    }
                  });
                }
              }), createComponent(Match, {
                get when() {
                  return icon() === "question";
                },
                get children() {
                  return createComponent(QuestionIcon, {
                    get fill() {
                      return props.fill;
                    }
                  });
                }
              }), createComponent(Match, {
                get when() {
                  return typeof icon() !== "string";
                },
                get children() {
                  return icon();
                }
              })];
            }
          });
        }
      })];
    }
  }));
};
const borders$1 = {
  m: "24px",
  s: "16px",
  none: "0"
};
const ModalBackgroundStyled = styled.div`
  display: flex;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  padding: 20px 0;
  overflow-y: auto;

  ${media("mobile")} {
    padding-bottom: 0;
  }
`;
const ModalWrapperClass = u`
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), 0 16px 64px rgba(0, 0, 0, 0.16);
  width: fit-content;
  margin: auto;

  ${media("mobile")} {
    width: 100%;
    height: fit-content;
    margin: auto 0 0 0;
  }
`;
const ModalBodyStyled = styled.div`
  position: relative;
  min-height: 100px;
  width: 416px;
  padding: 44px 56px 24px;

  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);

  background-color: ${(props) => props.theme.colors.background.primary};
  border-radius: ${(props) => borders$1[props.theme.borderRadius]};

  ${media("mobile")} {
    width: 100%;
    border-radius: 24px 24px 0px 0px;
  }
`;
const CloseButtonStyled = styled(IconButton)`
  position: absolute;
  right: 16px;
  top: 12px;
`;
styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 16px 16px 18px;
  border-radius: 0 0 ${(props) => borders$1[props.theme.borderRadius]}
    ${(props) => borders$1[props.theme.borderRadius]};
`;
styled(IconButton)`
  background-color: ${(props) => rgba(props.theme.colors.icon.secondary, 0.12)};
`;
class AnimationTimelineNoop {
  constructor() {
    __publicField(this, "currentTime", 0);
  }
}
const _AnimationNoop = class {
  constructor() {
    __publicField(this, "currentTime", 0);
    __publicField(this, "playbackRate", 1);
    __publicField(this, "startTime", null);
    __publicField(this, "timeline", new AnimationTimelineNoop());
    __publicField(this, "finished", Promise.resolve(this));
    __publicField(this, "effect", null);
    __publicField(this, "id", "");
    __publicField(this, "pending", false);
    __publicField(this, "playState", "finished");
    __publicField(this, "replaceState", "active");
    __publicField(this, "ready", Promise.resolve(this));
    __publicField(this, "oncancel", null);
    __publicField(this, "onfinish", null);
    __publicField(this, "onremove", null);
  }
  static create() {
    if (!_AnimationNoop._instance) {
      logWarning(
        "Animation is not supported in this environment: please consider using the `web-animations-js` polyfill to provide a fallback implementation of the Web Animations API."
      );
      _AnimationNoop._instance = new _AnimationNoop();
    }
    return _AnimationNoop._instance;
  }
  cancel() {
  }
  finish() {
  }
  pause() {
  }
  play() {
  }
  reverse() {
  }
  addEventListener(_type, _listener, _options) {
  }
  dispatchEvent(_event) {
    return false;
  }
  removeEventListener(_type, _callback, _options) {
  }
  updatePlaybackRate(_playbackRate) {
  }
  commitStyles() {
  }
  persist() {
  }
};
let AnimationNoop = _AnimationNoop;
__publicField(AnimationNoop, "_instance", null);
function animate(element, keyframes, options) {
  if ("animate" in element) {
    return element.animate(keyframes, options);
  }
  return AnimationNoop.create();
}
var _tmpl$$7 = /* @__PURE__ */ template$1(`<div>`);
const clickOutside = clickOutside$1;
const keyPressed = escPressed;
const androidBackHandler = androidBackHandler$1;
const Modal = (props) => {
  const theme = useTheme();
  const dataAttrs = useDataAttributes(props);
  createEffect(() => {
    if (props.opened) {
      disableScroll();
    } else {
      enableScroll();
    }
  });
  return createComponent(Transition, {
    onBeforeEnter: (el) => {
      const duration = isDevice("mobile") ? 200 : 100;
      animate(el, [{
        opacity: 0
      }, {
        opacity: 1
      }], {
        duration
      });
      if (isDevice("mobile")) {
        animate(el.firstElementChild, [{
          transform: "translateY(390px)"
        }, {
          transform: "translateY(0)"
        }], {
          duration
        });
      }
    },
    onExit: (el, done) => {
      const duration = isDevice("mobile") ? 200 : 100;
      const backgroundAnimation = animate(el, [{
        opacity: 1
      }, {
        opacity: 0
      }], {
        duration
      });
      if (isDevice("mobile")) {
        const contentAnimation = animate(el.firstElementChild, [{
          transform: "translateY(0)"
        }, {
          transform: "translateY(390px)"
        }], {
          duration
        });
        Promise.all([backgroundAnimation.finished, contentAnimation.finished]).then(done);
      } else {
        backgroundAnimation.finished.then(done);
      }
    },
    get children() {
      return createComponent(Show, {
        get when() {
          return props.opened;
        },
        get children() {
          return createComponent(ModalBackgroundStyled, mergeProps({
            "data-tc-modal": "true"
          }, dataAttrs, {
            get children() {
              var _el$ = _tmpl$$7();
              use(androidBackHandler, _el$, () => ({
                isEnabled: true,
                onClose: () => props.onClose()
              }));
              use(keyPressed, _el$, () => () => props.onClose());
              use(clickOutside, _el$, () => () => props.onClose());
              insert(_el$, createComponent(ModalBodyStyled, {
                get ["class"]() {
                  return props.class;
                },
                get children() {
                  return [createComponent(CloseButtonStyled, {
                    icon: "close",
                    onClick: () => props.onClose()
                  }), createMemo(() => props.children)];
                }
              }));
              createRenderEffect(() => className(_el$, cn__default.default(ModalWrapperClass, u`
                                border-radius: ${borders$1[theme.borderRadius]};
                                background-color: ${theme.colors.background.tint};

                                ${media("mobile")} {
                                    border-radius: ${borders$1[theme.borderRadius]}
                                        ${borders$1[theme.borderRadius]} 0 0;
                                }
                            `)));
              return _el$;
            }
          }));
        }
      });
    }
  });
};
const wrapperBorderRadius = {
  m: "22px",
  s: "12px",
  none: "0"
};
const sliderBorderRadius = {
  m: "18px",
  s: "8px",
  none: "0"
};
styled.div`
    display: grid;
    grid-template: 1fr / 1fr 1fr;
    width: fit-content;
    justify-items: center;
    gap: 4px;

    position: relative;
    padding: 4px;
    border-radius: ${(props) => wrapperBorderRadius[props.theme.borderRadius]};

    background-color: ${(props) => props.theme.colors.background.secondary};
`;
styled.div`
    position: absolute;
    top: 4px;
    left: 4px;

    height: calc(100% - 8px);
    width: calc(50% - 4px);

    border-radius: ${(props) => sliderBorderRadius[props.theme.borderRadius]};
    background-color: ${(props) => props.theme.colors.background.segment};

    transform: ${(props) => props.right ? "translateX(100%)" : "translateX(0)"};

    transition: transform 0.13s ease-in-out;
`;
styled.input`
    display: none;
`;
styled.label`
    padding: 9px 12px;
    z-index: 1;

    cursor: ${(props) => props.isActive ? "default" : "pointer"};

    transition: transform 0.13s ease-in-out;

    &:hover {
        transform: ${(props) => props.isActive ? "none" : "scale(1.025)"};
    }

    > * {
        ${(props) => !props.isActive ? `color: ${props.theme.colors.text.secondary};` : ""}
    }
`;
const backgroundBorders = {
  m: "16px",
  s: "12px",
  none: "0"
};
const imageBorders = {
  m: "12px",
  s: "8px",
  none: "0"
};
const qrNormalSize = 263;
const imgSizeDefault = 56;
const picSizeDefault = 54;
const qrPaddingTop = 0;
const CopyIconButton = styled.div`
    width: 52px;
    height: 52px;
    background: transparent;
    position: absolute;
    right: 0;
    bottom: 0;

    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.125s ease-in-out;
`;
const QrCodeBackground = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background-color: ${(props) => props.theme.colors.background.qr};
    border-radius: ${(props) => backgroundBorders[props.theme.borderRadius]};
    padding: ${toPx(qrPaddingTop)} 0;
    height: ${toPx(qrNormalSize + qrPaddingTop * 2)};
    width: 100%;

    overflow: hidden;
    cursor: pointer;
    border: none;

    ${mediaNotTouch} {
        &:hover {
            ${CopyIconButton.class} {
                transform: scale(1.04);
            }
        }
    }

    &:active {
        ${CopyIconButton.class} {
            transform: scale(0.96);
        }
    }

    ${mediaTouch} {
        &:active {
            ${CopyIconButton.class} {
                transform: scale(0.92);
            }
        }
    }
`;
const QrCodeWrapper$1 = styled.div`
    position: relative;
  
    width: fit-content;
    margin: 0 auto;

    > div:first-child {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    rect {
        fill: transparent;
    }
    
    path {
        fill: ${(props) => props.theme.colors.qrFill};
    }
`;
const ImageBackground = styled.div`
    position: absolute;
    width: ${toPx(imgSizeDefault)};
    height: ${toPx(imgSizeDefault)};
    background: ${(props) => props.theme.colors.background.qr};

    display: flex;
    align-items: center;
    justify-content: center;
`;
const ImageStyled$2 = styled(Image)`
    width: ${(props) => toPx(props.size)};
    height: ${(props) => toPx(props.size)};
    border-radius: ${(props) => imageBorders[props.theme.borderRadius]};
    background-color: ${(props) => props.theme.colors.background.qr};
`;
styled.div`
    position: absolute;
    bottom: 14px;
    left: 50%;
    transform: translate(-50%, 0);

    display: flex;
    gap: 6px;
    align-items: center;
    border-radius: 18px;
    min-width: 126px;
    padding: 9px 16px 9px 10px;

    filter: drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.08));
    background-color: ${(props) => props.theme.colors.background.segment};
`;
var qrcode$1 = { exports: {} };
(function(module2, exports2) {
  var qrcode2 = function() {
    var qrcode3 = function(typeNumber, errorCorrectionLevel) {
      var PAD0 = 236;
      var PAD1 = 17;
      var _typeNumber = typeNumber;
      var _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
      var _modules = null;
      var _moduleCount = 0;
      var _dataCache = null;
      var _dataList = [];
      var _this = {};
      var makeImpl = function(test, maskPattern) {
        _moduleCount = _typeNumber * 4 + 17;
        _modules = function(moduleCount) {
          var modules = new Array(moduleCount);
          for (var row = 0; row < moduleCount; row += 1) {
            modules[row] = new Array(moduleCount);
            for (var col = 0; col < moduleCount; col += 1) {
              modules[row][col] = null;
            }
          }
          return modules;
        }(_moduleCount);
        setupPositionProbePattern(0, 0);
        setupPositionProbePattern(_moduleCount - 7, 0);
        setupPositionProbePattern(0, _moduleCount - 7);
        setupPositionAdjustPattern();
        setupTimingPattern();
        setupTypeInfo(test, maskPattern);
        if (_typeNumber >= 7) {
          setupTypeNumber(test);
        }
        if (_dataCache == null) {
          _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
        }
        mapData(_dataCache, maskPattern);
      };
      var setupPositionProbePattern = function(row, col) {
        for (var r = -1; r <= 7; r += 1) {
          if (row + r <= -1 || _moduleCount <= row + r)
            continue;
          for (var c2 = -1; c2 <= 7; c2 += 1) {
            if (col + c2 <= -1 || _moduleCount <= col + c2)
              continue;
            if (0 <= r && r <= 6 && (c2 == 0 || c2 == 6) || 0 <= c2 && c2 <= 6 && (r == 0 || r == 6) || 2 <= r && r <= 4 && 2 <= c2 && c2 <= 4) {
              _modules[row + r][col + c2] = true;
            } else {
              _modules[row + r][col + c2] = false;
            }
          }
        }
      };
      var getBestMaskPattern = function() {
        var minLostPoint = 0;
        var pattern = 0;
        for (var i2 = 0; i2 < 8; i2 += 1) {
          makeImpl(true, i2);
          var lostPoint = QRUtil.getLostPoint(_this);
          if (i2 == 0 || minLostPoint > lostPoint) {
            minLostPoint = lostPoint;
            pattern = i2;
          }
        }
        return pattern;
      };
      var setupTimingPattern = function() {
        for (var r = 8; r < _moduleCount - 8; r += 1) {
          if (_modules[r][6] != null) {
            continue;
          }
          _modules[r][6] = r % 2 == 0;
        }
        for (var c2 = 8; c2 < _moduleCount - 8; c2 += 1) {
          if (_modules[6][c2] != null) {
            continue;
          }
          _modules[6][c2] = c2 % 2 == 0;
        }
      };
      var setupPositionAdjustPattern = function() {
        var pos = QRUtil.getPatternPosition(_typeNumber);
        for (var i2 = 0; i2 < pos.length; i2 += 1) {
          for (var j = 0; j < pos.length; j += 1) {
            var row = pos[i2];
            var col = pos[j];
            if (_modules[row][col] != null) {
              continue;
            }
            for (var r = -2; r <= 2; r += 1) {
              for (var c2 = -2; c2 <= 2; c2 += 1) {
                if (r == -2 || r == 2 || c2 == -2 || c2 == 2 || r == 0 && c2 == 0) {
                  _modules[row + r][col + c2] = true;
                } else {
                  _modules[row + r][col + c2] = false;
                }
              }
            }
          }
        }
      };
      var setupTypeNumber = function(test) {
        var bits = QRUtil.getBCHTypeNumber(_typeNumber);
        for (var i2 = 0; i2 < 18; i2 += 1) {
          var mod = !test && (bits >> i2 & 1) == 1;
          _modules[Math.floor(i2 / 3)][i2 % 3 + _moduleCount - 8 - 3] = mod;
        }
        for (var i2 = 0; i2 < 18; i2 += 1) {
          var mod = !test && (bits >> i2 & 1) == 1;
          _modules[i2 % 3 + _moduleCount - 8 - 3][Math.floor(i2 / 3)] = mod;
        }
      };
      var setupTypeInfo = function(test, maskPattern) {
        var data = _errorCorrectionLevel << 3 | maskPattern;
        var bits = QRUtil.getBCHTypeInfo(data);
        for (var i2 = 0; i2 < 15; i2 += 1) {
          var mod = !test && (bits >> i2 & 1) == 1;
          if (i2 < 6) {
            _modules[i2][8] = mod;
          } else if (i2 < 8) {
            _modules[i2 + 1][8] = mod;
          } else {
            _modules[_moduleCount - 15 + i2][8] = mod;
          }
        }
        for (var i2 = 0; i2 < 15; i2 += 1) {
          var mod = !test && (bits >> i2 & 1) == 1;
          if (i2 < 8) {
            _modules[8][_moduleCount - i2 - 1] = mod;
          } else if (i2 < 9) {
            _modules[8][15 - i2 - 1 + 1] = mod;
          } else {
            _modules[8][15 - i2 - 1] = mod;
          }
        }
        _modules[_moduleCount - 8][8] = !test;
      };
      var mapData = function(data, maskPattern) {
        var inc = -1;
        var row = _moduleCount - 1;
        var bitIndex = 7;
        var byteIndex = 0;
        var maskFunc = QRUtil.getMaskFunction(maskPattern);
        for (var col = _moduleCount - 1; col > 0; col -= 2) {
          if (col == 6)
            col -= 1;
          while (true) {
            for (var c2 = 0; c2 < 2; c2 += 1) {
              if (_modules[row][col - c2] == null) {
                var dark = false;
                if (byteIndex < data.length) {
                  dark = (data[byteIndex] >>> bitIndex & 1) == 1;
                }
                var mask = maskFunc(row, col - c2);
                if (mask) {
                  dark = !dark;
                }
                _modules[row][col - c2] = dark;
                bitIndex -= 1;
                if (bitIndex == -1) {
                  byteIndex += 1;
                  bitIndex = 7;
                }
              }
            }
            row += inc;
            if (row < 0 || _moduleCount <= row) {
              row -= inc;
              inc = -inc;
              break;
            }
          }
        }
      };
      var createBytes = function(buffer, rsBlocks) {
        var offset2 = 0;
        var maxDcCount = 0;
        var maxEcCount = 0;
        var dcdata = new Array(rsBlocks.length);
        var ecdata = new Array(rsBlocks.length);
        for (var r = 0; r < rsBlocks.length; r += 1) {
          var dcCount = rsBlocks[r].dataCount;
          var ecCount = rsBlocks[r].totalCount - dcCount;
          maxDcCount = Math.max(maxDcCount, dcCount);
          maxEcCount = Math.max(maxEcCount, ecCount);
          dcdata[r] = new Array(dcCount);
          for (var i2 = 0; i2 < dcdata[r].length; i2 += 1) {
            dcdata[r][i2] = 255 & buffer.getBuffer()[i2 + offset2];
          }
          offset2 += dcCount;
          var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
          var rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);
          var modPoly = rawPoly.mod(rsPoly);
          ecdata[r] = new Array(rsPoly.getLength() - 1);
          for (var i2 = 0; i2 < ecdata[r].length; i2 += 1) {
            var modIndex = i2 + modPoly.getLength() - ecdata[r].length;
            ecdata[r][i2] = modIndex >= 0 ? modPoly.getAt(modIndex) : 0;
          }
        }
        var totalCodeCount = 0;
        for (var i2 = 0; i2 < rsBlocks.length; i2 += 1) {
          totalCodeCount += rsBlocks[i2].totalCount;
        }
        var data = new Array(totalCodeCount);
        var index = 0;
        for (var i2 = 0; i2 < maxDcCount; i2 += 1) {
          for (var r = 0; r < rsBlocks.length; r += 1) {
            if (i2 < dcdata[r].length) {
              data[index] = dcdata[r][i2];
              index += 1;
            }
          }
        }
        for (var i2 = 0; i2 < maxEcCount; i2 += 1) {
          for (var r = 0; r < rsBlocks.length; r += 1) {
            if (i2 < ecdata[r].length) {
              data[index] = ecdata[r][i2];
              index += 1;
            }
          }
        }
        return data;
      };
      var createData = function(typeNumber2, errorCorrectionLevel2, dataList) {
        var rsBlocks = QRRSBlock.getRSBlocks(typeNumber2, errorCorrectionLevel2);
        var buffer = qrBitBuffer();
        for (var i2 = 0; i2 < dataList.length; i2 += 1) {
          var data = dataList[i2];
          buffer.put(data.getMode(), 4);
          buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber2));
          data.write(buffer);
        }
        var totalDataCount = 0;
        for (var i2 = 0; i2 < rsBlocks.length; i2 += 1) {
          totalDataCount += rsBlocks[i2].dataCount;
        }
        if (buffer.getLengthInBits() > totalDataCount * 8) {
          throw "code length overflow. (" + buffer.getLengthInBits() + ">" + totalDataCount * 8 + ")";
        }
        if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
          buffer.put(0, 4);
        }
        while (buffer.getLengthInBits() % 8 != 0) {
          buffer.putBit(false);
        }
        while (true) {
          if (buffer.getLengthInBits() >= totalDataCount * 8) {
            break;
          }
          buffer.put(PAD0, 8);
          if (buffer.getLengthInBits() >= totalDataCount * 8) {
            break;
          }
          buffer.put(PAD1, 8);
        }
        return createBytes(buffer, rsBlocks);
      };
      _this.addData = function(data, mode) {
        mode = mode || "Byte";
        var newData = null;
        switch (mode) {
          case "Numeric":
            newData = qrNumber(data);
            break;
          case "Alphanumeric":
            newData = qrAlphaNum(data);
            break;
          case "Byte":
            newData = qr8BitByte(data);
            break;
          case "Kanji":
            newData = qrKanji(data);
            break;
          default:
            throw "mode:" + mode;
        }
        _dataList.push(newData);
        _dataCache = null;
      };
      _this.isDark = function(row, col) {
        if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
          throw row + "," + col;
        }
        return _modules[row][col];
      };
      _this.getModuleCount = function() {
        return _moduleCount;
      };
      _this.make = function() {
        if (_typeNumber < 1) {
          var typeNumber2 = 1;
          for (; typeNumber2 < 40; typeNumber2++) {
            var rsBlocks = QRRSBlock.getRSBlocks(typeNumber2, _errorCorrectionLevel);
            var buffer = qrBitBuffer();
            for (var i2 = 0; i2 < _dataList.length; i2++) {
              var data = _dataList[i2];
              buffer.put(data.getMode(), 4);
              buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber2));
              data.write(buffer);
            }
            var totalDataCount = 0;
            for (var i2 = 0; i2 < rsBlocks.length; i2++) {
              totalDataCount += rsBlocks[i2].dataCount;
            }
            if (buffer.getLengthInBits() <= totalDataCount * 8) {
              break;
            }
          }
          _typeNumber = typeNumber2;
        }
        makeImpl(false, getBestMaskPattern());
      };
      _this.createTableTag = function(cellSize, margin) {
        cellSize = cellSize || 2;
        margin = typeof margin == "undefined" ? cellSize * 4 : margin;
        var qrHtml = "";
        qrHtml += '<table style="';
        qrHtml += " border-width: 0px; border-style: none;";
        qrHtml += " border-collapse: collapse;";
        qrHtml += " padding: 0px; margin: " + margin + "px;";
        qrHtml += '">';
        qrHtml += "<tbody>";
        for (var r = 0; r < _this.getModuleCount(); r += 1) {
          qrHtml += "<tr>";
          for (var c2 = 0; c2 < _this.getModuleCount(); c2 += 1) {
            qrHtml += '<td style="';
            qrHtml += " border-width: 0px; border-style: none;";
            qrHtml += " border-collapse: collapse;";
            qrHtml += " padding: 0px; margin: 0px;";
            qrHtml += " width: " + cellSize + "px;";
            qrHtml += " height: " + cellSize + "px;";
            qrHtml += " background-color: ";
            qrHtml += _this.isDark(r, c2) ? "#000000" : "#ffffff";
            qrHtml += ";";
            qrHtml += '"/>';
          }
          qrHtml += "</tr>";
        }
        qrHtml += "</tbody>";
        qrHtml += "</table>";
        return qrHtml;
      };
      _this.createSvgTag = function(cellSize, margin, alt, title) {
        var opts = {};
        if (typeof arguments[0] == "object") {
          opts = arguments[0];
          cellSize = opts.cellSize;
          margin = opts.margin;
          alt = opts.alt;
          title = opts.title;
        }
        cellSize = cellSize || 2;
        margin = typeof margin == "undefined" ? cellSize * 4 : margin;
        alt = typeof alt === "string" ? { text: alt } : alt || {};
        alt.text = alt.text || null;
        alt.id = alt.text ? alt.id || "qrcode-description" : null;
        title = typeof title === "string" ? { text: title } : title || {};
        title.text = title.text || null;
        title.id = title.text ? title.id || "qrcode-title" : null;
        var size2 = _this.getModuleCount() * cellSize + margin * 2;
        var c2, mc, r, mr, qrSvg = "", rect;
        rect = "l" + cellSize + ",0 0," + cellSize + " -" + cellSize + ",0 0,-" + cellSize + "z ";
        qrSvg += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"';
        qrSvg += !opts.scalable ? ' width="' + size2 + 'px" height="' + size2 + 'px"' : "";
        qrSvg += ' viewBox="0 0 ' + size2 + " " + size2 + '" ';
        qrSvg += ' preserveAspectRatio="xMinYMin meet"';
        qrSvg += title.text || alt.text ? ' role="img" aria-labelledby="' + escapeXml([title.id, alt.id].join(" ").trim()) + '"' : "";
        qrSvg += ">";
        qrSvg += title.text ? '<title id="' + escapeXml(title.id) + '">' + escapeXml(title.text) + "</title>" : "";
        qrSvg += alt.text ? '<description id="' + escapeXml(alt.id) + '">' + escapeXml(alt.text) + "</description>" : "";
        qrSvg += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>';
        qrSvg += '<path d="';
        for (r = 0; r < _this.getModuleCount(); r += 1) {
          mr = r * cellSize + margin;
          for (c2 = 0; c2 < _this.getModuleCount(); c2 += 1) {
            if (_this.isDark(r, c2)) {
              mc = c2 * cellSize + margin;
              qrSvg += "M" + mc + "," + mr + rect;
            }
          }
        }
        qrSvg += '" stroke="transparent" fill="black"/>';
        qrSvg += "</svg>";
        return qrSvg;
      };
      _this.createDataURL = function(cellSize, margin) {
        cellSize = cellSize || 2;
        margin = typeof margin == "undefined" ? cellSize * 4 : margin;
        var size2 = _this.getModuleCount() * cellSize + margin * 2;
        var min2 = margin;
        var max2 = size2 - margin;
        return createDataURL(size2, size2, function(x, y) {
          if (min2 <= x && x < max2 && min2 <= y && y < max2) {
            var c2 = Math.floor((x - min2) / cellSize);
            var r = Math.floor((y - min2) / cellSize);
            return _this.isDark(r, c2) ? 0 : 1;
          } else {
            return 1;
          }
        });
      };
      _this.createImgTag = function(cellSize, margin, alt) {
        cellSize = cellSize || 2;
        margin = typeof margin == "undefined" ? cellSize * 4 : margin;
        var size2 = _this.getModuleCount() * cellSize + margin * 2;
        var img = "";
        img += "<img";
        img += ' src="';
        img += _this.createDataURL(cellSize, margin);
        img += '"';
        img += ' width="';
        img += size2;
        img += '"';
        img += ' height="';
        img += size2;
        img += '"';
        if (alt) {
          img += ' alt="';
          img += escapeXml(alt);
          img += '"';
        }
        img += "/>";
        return img;
      };
      var escapeXml = function(s2) {
        var escaped = "";
        for (var i2 = 0; i2 < s2.length; i2 += 1) {
          var c2 = s2.charAt(i2);
          switch (c2) {
            case "<":
              escaped += "&lt;";
              break;
            case ">":
              escaped += "&gt;";
              break;
            case "&":
              escaped += "&amp;";
              break;
            case '"':
              escaped += "&quot;";
              break;
            default:
              escaped += c2;
              break;
          }
        }
        return escaped;
      };
      var _createHalfASCII = function(margin) {
        var cellSize = 1;
        margin = typeof margin == "undefined" ? cellSize * 2 : margin;
        var size2 = _this.getModuleCount() * cellSize + margin * 2;
        var min2 = margin;
        var max2 = size2 - margin;
        var y, x, r1, r2, p2;
        var blocks = {
          "\u2588\u2588": "\u2588",
          "\u2588 ": "\u2580",
          " \u2588": "\u2584",
          "  ": " "
        };
        var blocksLastLineNoMargin = {
          "\u2588\u2588": "\u2580",
          "\u2588 ": "\u2580",
          " \u2588": " ",
          "  ": " "
        };
        var ascii = "";
        for (y = 0; y < size2; y += 2) {
          r1 = Math.floor((y - min2) / cellSize);
          r2 = Math.floor((y + 1 - min2) / cellSize);
          for (x = 0; x < size2; x += 1) {
            p2 = "\u2588";
            if (min2 <= x && x < max2 && min2 <= y && y < max2 && _this.isDark(r1, Math.floor((x - min2) / cellSize))) {
              p2 = " ";
            }
            if (min2 <= x && x < max2 && min2 <= y + 1 && y + 1 < max2 && _this.isDark(r2, Math.floor((x - min2) / cellSize))) {
              p2 += " ";
            } else {
              p2 += "\u2588";
            }
            ascii += margin < 1 && y + 1 >= max2 ? blocksLastLineNoMargin[p2] : blocks[p2];
          }
          ascii += "\n";
        }
        if (size2 % 2 && margin > 0) {
          return ascii.substring(0, ascii.length - size2 - 1) + Array(size2 + 1).join("\u2580");
        }
        return ascii.substring(0, ascii.length - 1);
      };
      _this.createASCII = function(cellSize, margin) {
        cellSize = cellSize || 1;
        if (cellSize < 2) {
          return _createHalfASCII(margin);
        }
        cellSize -= 1;
        margin = typeof margin == "undefined" ? cellSize * 2 : margin;
        var size2 = _this.getModuleCount() * cellSize + margin * 2;
        var min2 = margin;
        var max2 = size2 - margin;
        var y, x, r, p2;
        var white = Array(cellSize + 1).join("\u2588\u2588");
        var black = Array(cellSize + 1).join("  ");
        var ascii = "";
        var line = "";
        for (y = 0; y < size2; y += 1) {
          r = Math.floor((y - min2) / cellSize);
          line = "";
          for (x = 0; x < size2; x += 1) {
            p2 = 1;
            if (min2 <= x && x < max2 && min2 <= y && y < max2 && _this.isDark(r, Math.floor((x - min2) / cellSize))) {
              p2 = 0;
            }
            line += p2 ? white : black;
          }
          for (r = 0; r < cellSize; r += 1) {
            ascii += line + "\n";
          }
        }
        return ascii.substring(0, ascii.length - 1);
      };
      _this.renderTo2dContext = function(context, cellSize) {
        cellSize = cellSize || 2;
        var length = _this.getModuleCount();
        for (var row = 0; row < length; row++) {
          for (var col = 0; col < length; col++) {
            context.fillStyle = _this.isDark(row, col) ? "black" : "white";
            context.fillRect(row * cellSize, col * cellSize, cellSize, cellSize);
          }
        }
      };
      return _this;
    };
    qrcode3.stringToBytesFuncs = {
      "default": function(s2) {
        var bytes = [];
        for (var i2 = 0; i2 < s2.length; i2 += 1) {
          var c2 = s2.charCodeAt(i2);
          bytes.push(c2 & 255);
        }
        return bytes;
      }
    };
    qrcode3.stringToBytes = qrcode3.stringToBytesFuncs["default"];
    qrcode3.createStringToBytes = function(unicodeData, numChars) {
      var unicodeMap = function() {
        var bin = base64DecodeInputStream(unicodeData);
        var read = function() {
          var b = bin.read();
          if (b == -1)
            throw "eof";
          return b;
        };
        var count = 0;
        var unicodeMap2 = {};
        while (true) {
          var b0 = bin.read();
          if (b0 == -1)
            break;
          var b1 = read();
          var b2 = read();
          var b3 = read();
          var k = String.fromCharCode(b0 << 8 | b1);
          var v = b2 << 8 | b3;
          unicodeMap2[k] = v;
          count += 1;
        }
        if (count != numChars) {
          throw count + " != " + numChars;
        }
        return unicodeMap2;
      }();
      var unknownChar = "?".charCodeAt(0);
      return function(s2) {
        var bytes = [];
        for (var i2 = 0; i2 < s2.length; i2 += 1) {
          var c2 = s2.charCodeAt(i2);
          if (c2 < 128) {
            bytes.push(c2);
          } else {
            var b = unicodeMap[s2.charAt(i2)];
            if (typeof b == "number") {
              if ((b & 255) == b) {
                bytes.push(b);
              } else {
                bytes.push(b >>> 8);
                bytes.push(b & 255);
              }
            } else {
              bytes.push(unknownChar);
            }
          }
        }
        return bytes;
      };
    };
    var QRMode = {
      MODE_NUMBER: 1 << 0,
      MODE_ALPHA_NUM: 1 << 1,
      MODE_8BIT_BYTE: 1 << 2,
      MODE_KANJI: 1 << 3
    };
    var QRErrorCorrectionLevel = {
      L: 1,
      M: 0,
      Q: 3,
      H: 2
    };
    var QRMaskPattern = {
      PATTERN000: 0,
      PATTERN001: 1,
      PATTERN010: 2,
      PATTERN011: 3,
      PATTERN100: 4,
      PATTERN101: 5,
      PATTERN110: 6,
      PATTERN111: 7
    };
    var QRUtil = function() {
      var PATTERN_POSITION_TABLE = [
        [],
        [6, 18],
        [6, 22],
        [6, 26],
        [6, 30],
        [6, 34],
        [6, 22, 38],
        [6, 24, 42],
        [6, 26, 46],
        [6, 28, 50],
        [6, 30, 54],
        [6, 32, 58],
        [6, 34, 62],
        [6, 26, 46, 66],
        [6, 26, 48, 70],
        [6, 26, 50, 74],
        [6, 30, 54, 78],
        [6, 30, 56, 82],
        [6, 30, 58, 86],
        [6, 34, 62, 90],
        [6, 28, 50, 72, 94],
        [6, 26, 50, 74, 98],
        [6, 30, 54, 78, 102],
        [6, 28, 54, 80, 106],
        [6, 32, 58, 84, 110],
        [6, 30, 58, 86, 114],
        [6, 34, 62, 90, 118],
        [6, 26, 50, 74, 98, 122],
        [6, 30, 54, 78, 102, 126],
        [6, 26, 52, 78, 104, 130],
        [6, 30, 56, 82, 108, 134],
        [6, 34, 60, 86, 112, 138],
        [6, 30, 58, 86, 114, 142],
        [6, 34, 62, 90, 118, 146],
        [6, 30, 54, 78, 102, 126, 150],
        [6, 24, 50, 76, 102, 128, 154],
        [6, 28, 54, 80, 106, 132, 158],
        [6, 32, 58, 84, 110, 136, 162],
        [6, 26, 54, 82, 110, 138, 166],
        [6, 30, 58, 86, 114, 142, 170]
      ];
      var G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
      var G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
      var G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
      var _this = {};
      var getBCHDigit = function(data) {
        var digit = 0;
        while (data != 0) {
          digit += 1;
          data >>>= 1;
        }
        return digit;
      };
      _this.getBCHTypeInfo = function(data) {
        var d = data << 10;
        while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
          d ^= G15 << getBCHDigit(d) - getBCHDigit(G15);
        }
        return (data << 10 | d) ^ G15_MASK;
      };
      _this.getBCHTypeNumber = function(data) {
        var d = data << 12;
        while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
          d ^= G18 << getBCHDigit(d) - getBCHDigit(G18);
        }
        return data << 12 | d;
      };
      _this.getPatternPosition = function(typeNumber) {
        return PATTERN_POSITION_TABLE[typeNumber - 1];
      };
      _this.getMaskFunction = function(maskPattern) {
        switch (maskPattern) {
          case QRMaskPattern.PATTERN000:
            return function(i2, j) {
              return (i2 + j) % 2 == 0;
            };
          case QRMaskPattern.PATTERN001:
            return function(i2, j) {
              return i2 % 2 == 0;
            };
          case QRMaskPattern.PATTERN010:
            return function(i2, j) {
              return j % 3 == 0;
            };
          case QRMaskPattern.PATTERN011:
            return function(i2, j) {
              return (i2 + j) % 3 == 0;
            };
          case QRMaskPattern.PATTERN100:
            return function(i2, j) {
              return (Math.floor(i2 / 2) + Math.floor(j / 3)) % 2 == 0;
            };
          case QRMaskPattern.PATTERN101:
            return function(i2, j) {
              return i2 * j % 2 + i2 * j % 3 == 0;
            };
          case QRMaskPattern.PATTERN110:
            return function(i2, j) {
              return (i2 * j % 2 + i2 * j % 3) % 2 == 0;
            };
          case QRMaskPattern.PATTERN111:
            return function(i2, j) {
              return (i2 * j % 3 + (i2 + j) % 2) % 2 == 0;
            };
          default:
            throw "bad maskPattern:" + maskPattern;
        }
      };
      _this.getErrorCorrectPolynomial = function(errorCorrectLength) {
        var a2 = qrPolynomial([1], 0);
        for (var i2 = 0; i2 < errorCorrectLength; i2 += 1) {
          a2 = a2.multiply(qrPolynomial([1, QRMath.gexp(i2)], 0));
        }
        return a2;
      };
      _this.getLengthInBits = function(mode, type) {
        if (1 <= type && type < 10) {
          switch (mode) {
            case QRMode.MODE_NUMBER:
              return 10;
            case QRMode.MODE_ALPHA_NUM:
              return 9;
            case QRMode.MODE_8BIT_BYTE:
              return 8;
            case QRMode.MODE_KANJI:
              return 8;
            default:
              throw "mode:" + mode;
          }
        } else if (type < 27) {
          switch (mode) {
            case QRMode.MODE_NUMBER:
              return 12;
            case QRMode.MODE_ALPHA_NUM:
              return 11;
            case QRMode.MODE_8BIT_BYTE:
              return 16;
            case QRMode.MODE_KANJI:
              return 10;
            default:
              throw "mode:" + mode;
          }
        } else if (type < 41) {
          switch (mode) {
            case QRMode.MODE_NUMBER:
              return 14;
            case QRMode.MODE_ALPHA_NUM:
              return 13;
            case QRMode.MODE_8BIT_BYTE:
              return 16;
            case QRMode.MODE_KANJI:
              return 12;
            default:
              throw "mode:" + mode;
          }
        } else {
          throw "type:" + type;
        }
      };
      _this.getLostPoint = function(qrcode4) {
        var moduleCount = qrcode4.getModuleCount();
        var lostPoint = 0;
        for (var row = 0; row < moduleCount; row += 1) {
          for (var col = 0; col < moduleCount; col += 1) {
            var sameCount = 0;
            var dark = qrcode4.isDark(row, col);
            for (var r = -1; r <= 1; r += 1) {
              if (row + r < 0 || moduleCount <= row + r) {
                continue;
              }
              for (var c2 = -1; c2 <= 1; c2 += 1) {
                if (col + c2 < 0 || moduleCount <= col + c2) {
                  continue;
                }
                if (r == 0 && c2 == 0) {
                  continue;
                }
                if (dark == qrcode4.isDark(row + r, col + c2)) {
                  sameCount += 1;
                }
              }
            }
            if (sameCount > 5) {
              lostPoint += 3 + sameCount - 5;
            }
          }
        }
        for (var row = 0; row < moduleCount - 1; row += 1) {
          for (var col = 0; col < moduleCount - 1; col += 1) {
            var count = 0;
            if (qrcode4.isDark(row, col))
              count += 1;
            if (qrcode4.isDark(row + 1, col))
              count += 1;
            if (qrcode4.isDark(row, col + 1))
              count += 1;
            if (qrcode4.isDark(row + 1, col + 1))
              count += 1;
            if (count == 0 || count == 4) {
              lostPoint += 3;
            }
          }
        }
        for (var row = 0; row < moduleCount; row += 1) {
          for (var col = 0; col < moduleCount - 6; col += 1) {
            if (qrcode4.isDark(row, col) && !qrcode4.isDark(row, col + 1) && qrcode4.isDark(row, col + 2) && qrcode4.isDark(row, col + 3) && qrcode4.isDark(row, col + 4) && !qrcode4.isDark(row, col + 5) && qrcode4.isDark(row, col + 6)) {
              lostPoint += 40;
            }
          }
        }
        for (var col = 0; col < moduleCount; col += 1) {
          for (var row = 0; row < moduleCount - 6; row += 1) {
            if (qrcode4.isDark(row, col) && !qrcode4.isDark(row + 1, col) && qrcode4.isDark(row + 2, col) && qrcode4.isDark(row + 3, col) && qrcode4.isDark(row + 4, col) && !qrcode4.isDark(row + 5, col) && qrcode4.isDark(row + 6, col)) {
              lostPoint += 40;
            }
          }
        }
        var darkCount = 0;
        for (var col = 0; col < moduleCount; col += 1) {
          for (var row = 0; row < moduleCount; row += 1) {
            if (qrcode4.isDark(row, col)) {
              darkCount += 1;
            }
          }
        }
        var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
        lostPoint += ratio * 10;
        return lostPoint;
      };
      return _this;
    }();
    var QRMath = function() {
      var EXP_TABLE = new Array(256);
      var LOG_TABLE = new Array(256);
      for (var i2 = 0; i2 < 8; i2 += 1) {
        EXP_TABLE[i2] = 1 << i2;
      }
      for (var i2 = 8; i2 < 256; i2 += 1) {
        EXP_TABLE[i2] = EXP_TABLE[i2 - 4] ^ EXP_TABLE[i2 - 5] ^ EXP_TABLE[i2 - 6] ^ EXP_TABLE[i2 - 8];
      }
      for (var i2 = 0; i2 < 255; i2 += 1) {
        LOG_TABLE[EXP_TABLE[i2]] = i2;
      }
      var _this = {};
      _this.glog = function(n2) {
        if (n2 < 1) {
          throw "glog(" + n2 + ")";
        }
        return LOG_TABLE[n2];
      };
      _this.gexp = function(n2) {
        while (n2 < 0) {
          n2 += 255;
        }
        while (n2 >= 256) {
          n2 -= 255;
        }
        return EXP_TABLE[n2];
      };
      return _this;
    }();
    function qrPolynomial(num, shift2) {
      if (typeof num.length == "undefined") {
        throw num.length + "/" + shift2;
      }
      var _num = function() {
        var offset2 = 0;
        while (offset2 < num.length && num[offset2] == 0) {
          offset2 += 1;
        }
        var _num2 = new Array(num.length - offset2 + shift2);
        for (var i2 = 0; i2 < num.length - offset2; i2 += 1) {
          _num2[i2] = num[i2 + offset2];
        }
        return _num2;
      }();
      var _this = {};
      _this.getAt = function(index) {
        return _num[index];
      };
      _this.getLength = function() {
        return _num.length;
      };
      _this.multiply = function(e2) {
        var num2 = new Array(_this.getLength() + e2.getLength() - 1);
        for (var i2 = 0; i2 < _this.getLength(); i2 += 1) {
          for (var j = 0; j < e2.getLength(); j += 1) {
            num2[i2 + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i2)) + QRMath.glog(e2.getAt(j)));
          }
        }
        return qrPolynomial(num2, 0);
      };
      _this.mod = function(e2) {
        if (_this.getLength() - e2.getLength() < 0) {
          return _this;
        }
        var ratio = QRMath.glog(_this.getAt(0)) - QRMath.glog(e2.getAt(0));
        var num2 = new Array(_this.getLength());
        for (var i2 = 0; i2 < _this.getLength(); i2 += 1) {
          num2[i2] = _this.getAt(i2);
        }
        for (var i2 = 0; i2 < e2.getLength(); i2 += 1) {
          num2[i2] ^= QRMath.gexp(QRMath.glog(e2.getAt(i2)) + ratio);
        }
        return qrPolynomial(num2, 0).mod(e2);
      };
      return _this;
    }
    var QRRSBlock = function() {
      var RS_BLOCK_TABLE = [
        [1, 26, 19],
        [1, 26, 16],
        [1, 26, 13],
        [1, 26, 9],
        [1, 44, 34],
        [1, 44, 28],
        [1, 44, 22],
        [1, 44, 16],
        [1, 70, 55],
        [1, 70, 44],
        [2, 35, 17],
        [2, 35, 13],
        [1, 100, 80],
        [2, 50, 32],
        [2, 50, 24],
        [4, 25, 9],
        [1, 134, 108],
        [2, 67, 43],
        [2, 33, 15, 2, 34, 16],
        [2, 33, 11, 2, 34, 12],
        [2, 86, 68],
        [4, 43, 27],
        [4, 43, 19],
        [4, 43, 15],
        [2, 98, 78],
        [4, 49, 31],
        [2, 32, 14, 4, 33, 15],
        [4, 39, 13, 1, 40, 14],
        [2, 121, 97],
        [2, 60, 38, 2, 61, 39],
        [4, 40, 18, 2, 41, 19],
        [4, 40, 14, 2, 41, 15],
        [2, 146, 116],
        [3, 58, 36, 2, 59, 37],
        [4, 36, 16, 4, 37, 17],
        [4, 36, 12, 4, 37, 13],
        [2, 86, 68, 2, 87, 69],
        [4, 69, 43, 1, 70, 44],
        [6, 43, 19, 2, 44, 20],
        [6, 43, 15, 2, 44, 16],
        [4, 101, 81],
        [1, 80, 50, 4, 81, 51],
        [4, 50, 22, 4, 51, 23],
        [3, 36, 12, 8, 37, 13],
        [2, 116, 92, 2, 117, 93],
        [6, 58, 36, 2, 59, 37],
        [4, 46, 20, 6, 47, 21],
        [7, 42, 14, 4, 43, 15],
        [4, 133, 107],
        [8, 59, 37, 1, 60, 38],
        [8, 44, 20, 4, 45, 21],
        [12, 33, 11, 4, 34, 12],
        [3, 145, 115, 1, 146, 116],
        [4, 64, 40, 5, 65, 41],
        [11, 36, 16, 5, 37, 17],
        [11, 36, 12, 5, 37, 13],
        [5, 109, 87, 1, 110, 88],
        [5, 65, 41, 5, 66, 42],
        [5, 54, 24, 7, 55, 25],
        [11, 36, 12, 7, 37, 13],
        [5, 122, 98, 1, 123, 99],
        [7, 73, 45, 3, 74, 46],
        [15, 43, 19, 2, 44, 20],
        [3, 45, 15, 13, 46, 16],
        [1, 135, 107, 5, 136, 108],
        [10, 74, 46, 1, 75, 47],
        [1, 50, 22, 15, 51, 23],
        [2, 42, 14, 17, 43, 15],
        [5, 150, 120, 1, 151, 121],
        [9, 69, 43, 4, 70, 44],
        [17, 50, 22, 1, 51, 23],
        [2, 42, 14, 19, 43, 15],
        [3, 141, 113, 4, 142, 114],
        [3, 70, 44, 11, 71, 45],
        [17, 47, 21, 4, 48, 22],
        [9, 39, 13, 16, 40, 14],
        [3, 135, 107, 5, 136, 108],
        [3, 67, 41, 13, 68, 42],
        [15, 54, 24, 5, 55, 25],
        [15, 43, 15, 10, 44, 16],
        [4, 144, 116, 4, 145, 117],
        [17, 68, 42],
        [17, 50, 22, 6, 51, 23],
        [19, 46, 16, 6, 47, 17],
        [2, 139, 111, 7, 140, 112],
        [17, 74, 46],
        [7, 54, 24, 16, 55, 25],
        [34, 37, 13],
        [4, 151, 121, 5, 152, 122],
        [4, 75, 47, 14, 76, 48],
        [11, 54, 24, 14, 55, 25],
        [16, 45, 15, 14, 46, 16],
        [6, 147, 117, 4, 148, 118],
        [6, 73, 45, 14, 74, 46],
        [11, 54, 24, 16, 55, 25],
        [30, 46, 16, 2, 47, 17],
        [8, 132, 106, 4, 133, 107],
        [8, 75, 47, 13, 76, 48],
        [7, 54, 24, 22, 55, 25],
        [22, 45, 15, 13, 46, 16],
        [10, 142, 114, 2, 143, 115],
        [19, 74, 46, 4, 75, 47],
        [28, 50, 22, 6, 51, 23],
        [33, 46, 16, 4, 47, 17],
        [8, 152, 122, 4, 153, 123],
        [22, 73, 45, 3, 74, 46],
        [8, 53, 23, 26, 54, 24],
        [12, 45, 15, 28, 46, 16],
        [3, 147, 117, 10, 148, 118],
        [3, 73, 45, 23, 74, 46],
        [4, 54, 24, 31, 55, 25],
        [11, 45, 15, 31, 46, 16],
        [7, 146, 116, 7, 147, 117],
        [21, 73, 45, 7, 74, 46],
        [1, 53, 23, 37, 54, 24],
        [19, 45, 15, 26, 46, 16],
        [5, 145, 115, 10, 146, 116],
        [19, 75, 47, 10, 76, 48],
        [15, 54, 24, 25, 55, 25],
        [23, 45, 15, 25, 46, 16],
        [13, 145, 115, 3, 146, 116],
        [2, 74, 46, 29, 75, 47],
        [42, 54, 24, 1, 55, 25],
        [23, 45, 15, 28, 46, 16],
        [17, 145, 115],
        [10, 74, 46, 23, 75, 47],
        [10, 54, 24, 35, 55, 25],
        [19, 45, 15, 35, 46, 16],
        [17, 145, 115, 1, 146, 116],
        [14, 74, 46, 21, 75, 47],
        [29, 54, 24, 19, 55, 25],
        [11, 45, 15, 46, 46, 16],
        [13, 145, 115, 6, 146, 116],
        [14, 74, 46, 23, 75, 47],
        [44, 54, 24, 7, 55, 25],
        [59, 46, 16, 1, 47, 17],
        [12, 151, 121, 7, 152, 122],
        [12, 75, 47, 26, 76, 48],
        [39, 54, 24, 14, 55, 25],
        [22, 45, 15, 41, 46, 16],
        [6, 151, 121, 14, 152, 122],
        [6, 75, 47, 34, 76, 48],
        [46, 54, 24, 10, 55, 25],
        [2, 45, 15, 64, 46, 16],
        [17, 152, 122, 4, 153, 123],
        [29, 74, 46, 14, 75, 47],
        [49, 54, 24, 10, 55, 25],
        [24, 45, 15, 46, 46, 16],
        [4, 152, 122, 18, 153, 123],
        [13, 74, 46, 32, 75, 47],
        [48, 54, 24, 14, 55, 25],
        [42, 45, 15, 32, 46, 16],
        [20, 147, 117, 4, 148, 118],
        [40, 75, 47, 7, 76, 48],
        [43, 54, 24, 22, 55, 25],
        [10, 45, 15, 67, 46, 16],
        [19, 148, 118, 6, 149, 119],
        [18, 75, 47, 31, 76, 48],
        [34, 54, 24, 34, 55, 25],
        [20, 45, 15, 61, 46, 16]
      ];
      var qrRSBlock = function(totalCount, dataCount) {
        var _this2 = {};
        _this2.totalCount = totalCount;
        _this2.dataCount = dataCount;
        return _this2;
      };
      var _this = {};
      var getRsBlockTable = function(typeNumber, errorCorrectionLevel) {
        switch (errorCorrectionLevel) {
          case QRErrorCorrectionLevel.L:
            return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
          case QRErrorCorrectionLevel.M:
            return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
          case QRErrorCorrectionLevel.Q:
            return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
          case QRErrorCorrectionLevel.H:
            return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
          default:
            return void 0;
        }
      };
      _this.getRSBlocks = function(typeNumber, errorCorrectionLevel) {
        var rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);
        if (typeof rsBlock == "undefined") {
          throw "bad rs block @ typeNumber:" + typeNumber + "/errorCorrectionLevel:" + errorCorrectionLevel;
        }
        var length = rsBlock.length / 3;
        var list = [];
        for (var i2 = 0; i2 < length; i2 += 1) {
          var count = rsBlock[i2 * 3 + 0];
          var totalCount = rsBlock[i2 * 3 + 1];
          var dataCount = rsBlock[i2 * 3 + 2];
          for (var j = 0; j < count; j += 1) {
            list.push(qrRSBlock(totalCount, dataCount));
          }
        }
        return list;
      };
      return _this;
    }();
    var qrBitBuffer = function() {
      var _buffer = [];
      var _length = 0;
      var _this = {};
      _this.getBuffer = function() {
        return _buffer;
      };
      _this.getAt = function(index) {
        var bufIndex = Math.floor(index / 8);
        return (_buffer[bufIndex] >>> 7 - index % 8 & 1) == 1;
      };
      _this.put = function(num, length) {
        for (var i2 = 0; i2 < length; i2 += 1) {
          _this.putBit((num >>> length - i2 - 1 & 1) == 1);
        }
      };
      _this.getLengthInBits = function() {
        return _length;
      };
      _this.putBit = function(bit) {
        var bufIndex = Math.floor(_length / 8);
        if (_buffer.length <= bufIndex) {
          _buffer.push(0);
        }
        if (bit) {
          _buffer[bufIndex] |= 128 >>> _length % 8;
        }
        _length += 1;
      };
      return _this;
    };
    var qrNumber = function(data) {
      var _mode = QRMode.MODE_NUMBER;
      var _data = data;
      var _this = {};
      _this.getMode = function() {
        return _mode;
      };
      _this.getLength = function(buffer) {
        return _data.length;
      };
      _this.write = function(buffer) {
        var data2 = _data;
        var i2 = 0;
        while (i2 + 2 < data2.length) {
          buffer.put(strToNum(data2.substring(i2, i2 + 3)), 10);
          i2 += 3;
        }
        if (i2 < data2.length) {
          if (data2.length - i2 == 1) {
            buffer.put(strToNum(data2.substring(i2, i2 + 1)), 4);
          } else if (data2.length - i2 == 2) {
            buffer.put(strToNum(data2.substring(i2, i2 + 2)), 7);
          }
        }
      };
      var strToNum = function(s2) {
        var num = 0;
        for (var i2 = 0; i2 < s2.length; i2 += 1) {
          num = num * 10 + chatToNum(s2.charAt(i2));
        }
        return num;
      };
      var chatToNum = function(c2) {
        if ("0" <= c2 && c2 <= "9") {
          return c2.charCodeAt(0) - "0".charCodeAt(0);
        }
        throw "illegal char :" + c2;
      };
      return _this;
    };
    var qrAlphaNum = function(data) {
      var _mode = QRMode.MODE_ALPHA_NUM;
      var _data = data;
      var _this = {};
      _this.getMode = function() {
        return _mode;
      };
      _this.getLength = function(buffer) {
        return _data.length;
      };
      _this.write = function(buffer) {
        var s2 = _data;
        var i2 = 0;
        while (i2 + 1 < s2.length) {
          buffer.put(
            getCode(s2.charAt(i2)) * 45 + getCode(s2.charAt(i2 + 1)),
            11
          );
          i2 += 2;
        }
        if (i2 < s2.length) {
          buffer.put(getCode(s2.charAt(i2)), 6);
        }
      };
      var getCode = function(c2) {
        if ("0" <= c2 && c2 <= "9") {
          return c2.charCodeAt(0) - "0".charCodeAt(0);
        } else if ("A" <= c2 && c2 <= "Z") {
          return c2.charCodeAt(0) - "A".charCodeAt(0) + 10;
        } else {
          switch (c2) {
            case " ":
              return 36;
            case "$":
              return 37;
            case "%":
              return 38;
            case "*":
              return 39;
            case "+":
              return 40;
            case "-":
              return 41;
            case ".":
              return 42;
            case "/":
              return 43;
            case ":":
              return 44;
            default:
              throw "illegal char :" + c2;
          }
        }
      };
      return _this;
    };
    var qr8BitByte = function(data) {
      var _mode = QRMode.MODE_8BIT_BYTE;
      var _bytes = qrcode3.stringToBytes(data);
      var _this = {};
      _this.getMode = function() {
        return _mode;
      };
      _this.getLength = function(buffer) {
        return _bytes.length;
      };
      _this.write = function(buffer) {
        for (var i2 = 0; i2 < _bytes.length; i2 += 1) {
          buffer.put(_bytes[i2], 8);
        }
      };
      return _this;
    };
    var qrKanji = function(data) {
      var _mode = QRMode.MODE_KANJI;
      var stringToBytes = qrcode3.stringToBytesFuncs["SJIS"];
      if (!stringToBytes) {
        throw "sjis not supported.";
      }
      !function(c2, code) {
        var test = stringToBytes(c2);
        if (test.length != 2 || (test[0] << 8 | test[1]) != code) {
          throw "sjis not supported.";
        }
      }("\u53CB", 38726);
      var _bytes = stringToBytes(data);
      var _this = {};
      _this.getMode = function() {
        return _mode;
      };
      _this.getLength = function(buffer) {
        return ~~(_bytes.length / 2);
      };
      _this.write = function(buffer) {
        var data2 = _bytes;
        var i2 = 0;
        while (i2 + 1 < data2.length) {
          var c2 = (255 & data2[i2]) << 8 | 255 & data2[i2 + 1];
          if (33088 <= c2 && c2 <= 40956) {
            c2 -= 33088;
          } else if (57408 <= c2 && c2 <= 60351) {
            c2 -= 49472;
          } else {
            throw "illegal char at " + (i2 + 1) + "/" + c2;
          }
          c2 = (c2 >>> 8 & 255) * 192 + (c2 & 255);
          buffer.put(c2, 13);
          i2 += 2;
        }
        if (i2 < data2.length) {
          throw "illegal char at " + (i2 + 1);
        }
      };
      return _this;
    };
    var byteArrayOutputStream = function() {
      var _bytes = [];
      var _this = {};
      _this.writeByte = function(b) {
        _bytes.push(b & 255);
      };
      _this.writeShort = function(i2) {
        _this.writeByte(i2);
        _this.writeByte(i2 >>> 8);
      };
      _this.writeBytes = function(b, off, len) {
        off = off || 0;
        len = len || b.length;
        for (var i2 = 0; i2 < len; i2 += 1) {
          _this.writeByte(b[i2 + off]);
        }
      };
      _this.writeString = function(s2) {
        for (var i2 = 0; i2 < s2.length; i2 += 1) {
          _this.writeByte(s2.charCodeAt(i2));
        }
      };
      _this.toByteArray = function() {
        return _bytes;
      };
      _this.toString = function() {
        var s2 = "";
        s2 += "[";
        for (var i2 = 0; i2 < _bytes.length; i2 += 1) {
          if (i2 > 0) {
            s2 += ",";
          }
          s2 += _bytes[i2];
        }
        s2 += "]";
        return s2;
      };
      return _this;
    };
    var base64EncodeOutputStream = function() {
      var _buffer = 0;
      var _buflen = 0;
      var _length = 0;
      var _base64 = "";
      var _this = {};
      var writeEncoded = function(b) {
        _base64 += String.fromCharCode(encode(b & 63));
      };
      var encode = function(n2) {
        if (n2 < 0)
          ;
        else if (n2 < 26) {
          return 65 + n2;
        } else if (n2 < 52) {
          return 97 + (n2 - 26);
        } else if (n2 < 62) {
          return 48 + (n2 - 52);
        } else if (n2 == 62) {
          return 43;
        } else if (n2 == 63) {
          return 47;
        }
        throw "n:" + n2;
      };
      _this.writeByte = function(n2) {
        _buffer = _buffer << 8 | n2 & 255;
        _buflen += 8;
        _length += 1;
        while (_buflen >= 6) {
          writeEncoded(_buffer >>> _buflen - 6);
          _buflen -= 6;
        }
      };
      _this.flush = function() {
        if (_buflen > 0) {
          writeEncoded(_buffer << 6 - _buflen);
          _buffer = 0;
          _buflen = 0;
        }
        if (_length % 3 != 0) {
          var padlen = 3 - _length % 3;
          for (var i2 = 0; i2 < padlen; i2 += 1) {
            _base64 += "=";
          }
        }
      };
      _this.toString = function() {
        return _base64;
      };
      return _this;
    };
    var base64DecodeInputStream = function(str) {
      var _str = str;
      var _pos = 0;
      var _buffer = 0;
      var _buflen = 0;
      var _this = {};
      _this.read = function() {
        while (_buflen < 8) {
          if (_pos >= _str.length) {
            if (_buflen == 0) {
              return -1;
            }
            throw "unexpected end of file./" + _buflen;
          }
          var c2 = _str.charAt(_pos);
          _pos += 1;
          if (c2 == "=") {
            _buflen = 0;
            return -1;
          } else if (c2.match(/^\s$/)) {
            continue;
          }
          _buffer = _buffer << 6 | decode(c2.charCodeAt(0));
          _buflen += 6;
        }
        var n2 = _buffer >>> _buflen - 8 & 255;
        _buflen -= 8;
        return n2;
      };
      var decode = function(c2) {
        if (65 <= c2 && c2 <= 90) {
          return c2 - 65;
        } else if (97 <= c2 && c2 <= 122) {
          return c2 - 97 + 26;
        } else if (48 <= c2 && c2 <= 57) {
          return c2 - 48 + 52;
        } else if (c2 == 43) {
          return 62;
        } else if (c2 == 47) {
          return 63;
        } else {
          throw "c:" + c2;
        }
      };
      return _this;
    };
    var gifImage = function(width, height) {
      var _width = width;
      var _height = height;
      var _data = new Array(width * height);
      var _this = {};
      _this.setPixel = function(x, y, pixel) {
        _data[y * _width + x] = pixel;
      };
      _this.write = function(out) {
        out.writeString("GIF87a");
        out.writeShort(_width);
        out.writeShort(_height);
        out.writeByte(128);
        out.writeByte(0);
        out.writeByte(0);
        out.writeByte(0);
        out.writeByte(0);
        out.writeByte(0);
        out.writeByte(255);
        out.writeByte(255);
        out.writeByte(255);
        out.writeString(",");
        out.writeShort(0);
        out.writeShort(0);
        out.writeShort(_width);
        out.writeShort(_height);
        out.writeByte(0);
        var lzwMinCodeSize = 2;
        var raster = getLZWRaster(lzwMinCodeSize);
        out.writeByte(lzwMinCodeSize);
        var offset2 = 0;
        while (raster.length - offset2 > 255) {
          out.writeByte(255);
          out.writeBytes(raster, offset2, 255);
          offset2 += 255;
        }
        out.writeByte(raster.length - offset2);
        out.writeBytes(raster, offset2, raster.length - offset2);
        out.writeByte(0);
        out.writeString(";");
      };
      var bitOutputStream = function(out) {
        var _out = out;
        var _bitLength = 0;
        var _bitBuffer = 0;
        var _this2 = {};
        _this2.write = function(data, length) {
          if (data >>> length != 0) {
            throw "length over";
          }
          while (_bitLength + length >= 8) {
            _out.writeByte(255 & (data << _bitLength | _bitBuffer));
            length -= 8 - _bitLength;
            data >>>= 8 - _bitLength;
            _bitBuffer = 0;
            _bitLength = 0;
          }
          _bitBuffer = data << _bitLength | _bitBuffer;
          _bitLength = _bitLength + length;
        };
        _this2.flush = function() {
          if (_bitLength > 0) {
            _out.writeByte(_bitBuffer);
          }
        };
        return _this2;
      };
      var getLZWRaster = function(lzwMinCodeSize) {
        var clearCode = 1 << lzwMinCodeSize;
        var endCode = (1 << lzwMinCodeSize) + 1;
        var bitLength = lzwMinCodeSize + 1;
        var table = lzwTable();
        for (var i2 = 0; i2 < clearCode; i2 += 1) {
          table.add(String.fromCharCode(i2));
        }
        table.add(String.fromCharCode(clearCode));
        table.add(String.fromCharCode(endCode));
        var byteOut = byteArrayOutputStream();
        var bitOut = bitOutputStream(byteOut);
        bitOut.write(clearCode, bitLength);
        var dataIndex = 0;
        var s2 = String.fromCharCode(_data[dataIndex]);
        dataIndex += 1;
        while (dataIndex < _data.length) {
          var c2 = String.fromCharCode(_data[dataIndex]);
          dataIndex += 1;
          if (table.contains(s2 + c2)) {
            s2 = s2 + c2;
          } else {
            bitOut.write(table.indexOf(s2), bitLength);
            if (table.size() < 4095) {
              if (table.size() == 1 << bitLength) {
                bitLength += 1;
              }
              table.add(s2 + c2);
            }
            s2 = c2;
          }
        }
        bitOut.write(table.indexOf(s2), bitLength);
        bitOut.write(endCode, bitLength);
        bitOut.flush();
        return byteOut.toByteArray();
      };
      var lzwTable = function() {
        var _map = {};
        var _size = 0;
        var _this2 = {};
        _this2.add = function(key) {
          if (_this2.contains(key)) {
            throw "dup key:" + key;
          }
          _map[key] = _size;
          _size += 1;
        };
        _this2.size = function() {
          return _size;
        };
        _this2.indexOf = function(key) {
          return _map[key];
        };
        _this2.contains = function(key) {
          return typeof _map[key] != "undefined";
        };
        return _this2;
      };
      return _this;
    };
    var createDataURL = function(width, height, getPixel) {
      var gif = gifImage(width, height);
      for (var y = 0; y < height; y += 1) {
        for (var x = 0; x < width; x += 1) {
          gif.setPixel(x, y, getPixel(x, y));
        }
      }
      var b = byteArrayOutputStream();
      gif.write(b);
      var base64 = base64EncodeOutputStream();
      var bytes = b.toByteArray();
      for (var i2 = 0; i2 < bytes.length; i2 += 1) {
        base64.writeByte(bytes[i2]);
      }
      base64.flush();
      return "data:image/gif;base64," + base64;
    };
    return qrcode3;
  }();
  !function() {
    qrcode2.stringToBytesFuncs["UTF-8"] = function(s2) {
      function toUTF8Array(str) {
        var utf8 = [];
        for (var i2 = 0; i2 < str.length; i2++) {
          var charcode = str.charCodeAt(i2);
          if (charcode < 128)
            utf8.push(charcode);
          else if (charcode < 2048) {
            utf8.push(
              192 | charcode >> 6,
              128 | charcode & 63
            );
          } else if (charcode < 55296 || charcode >= 57344) {
            utf8.push(
              224 | charcode >> 12,
              128 | charcode >> 6 & 63,
              128 | charcode & 63
            );
          } else {
            i2++;
            charcode = 65536 + ((charcode & 1023) << 10 | str.charCodeAt(i2) & 1023);
            utf8.push(
              240 | charcode >> 18,
              128 | charcode >> 12 & 63,
              128 | charcode >> 6 & 63,
              128 | charcode & 63
            );
          }
        }
        return utf8;
      }
      return toUTF8Array(s2);
    };
  }();
  (function(factory) {
    {
      module2.exports = factory();
    }
  })(function() {
    return qrcode2;
  });
})(qrcode$1);
const qrcode = qrcode$1.exports;
var _tmpl$$6 = /* @__PURE__ */ template$1(`<div>`);
const QRCode = (props) => {
  let qrCodeCanvasRef;
  let qrCodeWrapperRef;
  let imageRef;
  createSignal(false);
  const [picSize, setPicSize] = createSignal(picSizeDefault);
  createEffect(() => {
    const errorCorrectionLevel = "L";
    const cellSize = 4;
    const qr = qrcode(0, errorCorrectionLevel);
    qr.addData(props.sourceUrl);
    qr.make();
    qrCodeCanvasRef.innerHTML = qr.createSvgTag(cellSize, 0);
    const qrSize = qrCodeCanvasRef.firstElementChild.clientWidth;
    const scale = Math.round(qrNormalSize / qrSize * 1e5) / 1e5;
    if (imageRef) {
      const imgSize = Math.ceil(imgSizeDefault / (scale * cellSize)) * cellSize;
      const imgOffset = toPx(Math.ceil((qrSize - imgSize) / (2 * cellSize)) * cellSize);
      imageRef.style.top = imgOffset;
      imageRef.style.left = imgOffset;
      imageRef.style.height = toPx(imgSize);
      imageRef.style.width = toPx(imgSize);
      setPicSize(Math.round(picSizeDefault / scale));
    }
    qrCodeWrapperRef.style.transform = `scale(${scale})`;
  });
  return createComponent(QrCodeBackground, {
    get ["class"]() {
      return props.class;
    },
    get children() {
      return [createComponent(QrCodeWrapper$1, {
        ref(r$) {
          var _ref$ = qrCodeWrapperRef;
          typeof _ref$ === "function" ? _ref$(r$) : qrCodeWrapperRef = r$;
        },
        get children() {
          return [(() => {
            var _el$ = _tmpl$$6();
            var _ref$2 = qrCodeCanvasRef;
            typeof _ref$2 === "function" ? use(_ref$2, _el$) : qrCodeCanvasRef = _el$;
            return _el$;
          })(), createComponent(Show, {
            get when() {
              return props.imageUrl;
            },
            get children() {
              return createComponent(ImageBackground, {
                ref(r$) {
                  var _ref$3 = imageRef;
                  typeof _ref$3 === "function" ? _ref$3(r$) : imageRef = r$;
                },
                get children() {
                  return createComponent(ImageStyled$2, {
                    get src() {
                      return props.imageUrl;
                    },
                    alt: "",
                    get size() {
                      return picSize();
                    }
                  });
                }
              });
            }
          })];
        }
      }), createComponent(Transition, {
        onBeforeEnter: (el) => {
          animate(el, [{
            opacity: 0,
            transform: "translate(-50%, 44px)"
          }, {
            opacity: 1,
            transform: "translate(-50%, 0)"
          }], {
            duration: 150,
            easing: "ease-out"
          });
        },
        onExit: (el, done) => {
          animate(el, [{
            opacity: 1,
            transform: "translate(-50%, 0)"
          }, {
            opacity: 0,
            transform: "translate(-50%, 44px)"
          }], {
            duration: 150,
            easing: "ease-out"
          }).finished.then(() => {
            done();
          });
        }
      })];
    }
  });
};
const $RAW = Symbol("store-raw"), $NODE = Symbol("store-node"), $HAS = Symbol("store-has"), $SELF = Symbol("store-self");
function wrap$1(value) {
  let p2 = value[$PROXY];
  if (!p2) {
    Object.defineProperty(value, $PROXY, {
      value: p2 = new Proxy(value, proxyTraps$1)
    });
    if (!Array.isArray(value)) {
      const keys = Object.keys(value), desc = Object.getOwnPropertyDescriptors(value);
      for (let i2 = 0, l2 = keys.length; i2 < l2; i2++) {
        const prop = keys[i2];
        if (desc[prop].get) {
          Object.defineProperty(value, prop, {
            enumerable: desc[prop].enumerable,
            get: desc[prop].get.bind(p2)
          });
        }
      }
    }
  }
  return p2;
}
function isWrappable(obj) {
  let proto;
  return obj != null && typeof obj === "object" && (obj[$PROXY] || !(proto = Object.getPrototypeOf(obj)) || proto === Object.prototype || Array.isArray(obj));
}
function unwrap(item, set = /* @__PURE__ */ new Set()) {
  let result, unwrapped, v, prop;
  if (result = item != null && item[$RAW])
    return result;
  if (!isWrappable(item) || set.has(item))
    return item;
  if (Array.isArray(item)) {
    if (Object.isFrozen(item))
      item = item.slice(0);
    else
      set.add(item);
    for (let i2 = 0, l2 = item.length; i2 < l2; i2++) {
      v = item[i2];
      if ((unwrapped = unwrap(v, set)) !== v)
        item[i2] = unwrapped;
    }
  } else {
    if (Object.isFrozen(item))
      item = Object.assign({}, item);
    else
      set.add(item);
    const keys = Object.keys(item), desc = Object.getOwnPropertyDescriptors(item);
    for (let i2 = 0, l2 = keys.length; i2 < l2; i2++) {
      prop = keys[i2];
      if (desc[prop].get)
        continue;
      v = item[prop];
      if ((unwrapped = unwrap(v, set)) !== v)
        item[prop] = unwrapped;
    }
  }
  return item;
}
function getNodes(target, symbol) {
  let nodes = target[symbol];
  if (!nodes)
    Object.defineProperty(target, symbol, {
      value: nodes = /* @__PURE__ */ Object.create(null)
    });
  return nodes;
}
function getNode(nodes, property, value) {
  if (nodes[property])
    return nodes[property];
  const [s2, set] = createSignal(value, {
    equals: false,
    internal: true
  });
  s2.$ = set;
  return nodes[property] = s2;
}
function proxyDescriptor$1(target, property) {
  const desc = Reflect.getOwnPropertyDescriptor(target, property);
  if (!desc || desc.get || !desc.configurable || property === $PROXY || property === $NODE)
    return desc;
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
    if (property === $RAW)
      return target;
    if (property === $PROXY)
      return receiver;
    if (property === $TRACK) {
      trackSelf(target);
      return receiver;
    }
    const nodes = getNodes(target, $NODE);
    const tracked = nodes[property];
    let value = tracked ? tracked() : target[property];
    if (property === $NODE || property === $HAS || property === "__proto__")
      return value;
    if (!tracked) {
      const desc = Object.getOwnPropertyDescriptor(target, property);
      if (getListener() && (typeof value !== "function" || target.hasOwnProperty(property)) && !(desc && desc.get))
        value = getNode(nodes, property, value)();
    }
    return isWrappable(value) ? wrap$1(value) : value;
  },
  has(target, property) {
    if (property === $RAW || property === $PROXY || property === $TRACK || property === $NODE || property === $HAS || property === "__proto__")
      return true;
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
  if (!deleting && state[property] === value)
    return;
  const prev = state[property], len = state.length;
  if (value === void 0) {
    delete state[property];
    if (state[$HAS] && state[$HAS][property] && prev !== void 0)
      state[$HAS][property].$();
  } else {
    state[property] = value;
    if (state[$HAS] && state[$HAS][property] && prev === void 0)
      state[$HAS][property].$();
  }
  let nodes = getNodes(state, $NODE), node;
  if (node = getNode(nodes, property, prev))
    node.$(() => value);
  if (Array.isArray(state) && state.length !== len) {
    for (let i2 = state.length; i2 < len; i2++)
      (node = nodes[i2]) && node.$();
    (node = getNode(nodes, "length", len)) && node.$(state.length);
  }
  (node = nodes[$SELF]) && node.$();
}
function mergeStoreNode(state, value) {
  const keys = Object.keys(value);
  for (let i2 = 0; i2 < keys.length; i2 += 1) {
    const key = keys[i2];
    setProperty(state, key, value[key]);
  }
}
function updateArray(current, next) {
  if (typeof next === "function")
    next = next(current);
  next = unwrap(next);
  if (Array.isArray(next)) {
    if (current === next)
      return;
    let i2 = 0, len = next.length;
    for (; i2 < len; i2++) {
      const value = next[i2];
      if (current[i2] !== value)
        setProperty(current, i2, value);
    }
    setProperty(current, "length", len);
  } else
    mergeStoreNode(current, next);
}
function updatePath(current, path, traversed = []) {
  let part, prev = current;
  if (path.length > 1) {
    part = path.shift();
    const partType = typeof part, isArray = Array.isArray(current);
    if (Array.isArray(part)) {
      for (let i2 = 0; i2 < part.length; i2++) {
        updatePath(current, [part[i2]].concat(path), traversed);
      }
      return;
    } else if (isArray && partType === "function") {
      for (let i2 = 0; i2 < current.length; i2++) {
        if (part(current[i2], i2))
          updatePath(current, [i2].concat(path), traversed);
      }
      return;
    } else if (isArray && partType === "object") {
      const { from = 0, to = current.length - 1, by = 1 } = part;
      for (let i2 = from; i2 <= to; i2 += by) {
        updatePath(current, [i2].concat(path), traversed);
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
    if (value === prev)
      return;
  }
  if (part === void 0 && value == void 0)
    return;
  value = unwrap(value);
  if (part === void 0 || isWrappable(prev) && isWrappable(value) && !Array.isArray(value)) {
    mergeStoreNode(prev, value);
  } else
    setProperty(current, part, value);
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
function deepReadObject(obj, path, defaultValue) {
  const value = obj[path] || path.trim().split(".").reduce((a2, b) => a2 ? a2[b] : void 0, obj);
  return value !== void 0 ? value : defaultValue;
}
var template = (str, params, reg = /{{([^{}]+)}}/g) => str.replace(reg, (_, key) => deepReadObject(params, key, ""));
var createI18nContext = (init = {}, lang = typeof navigator !== "undefined" && navigator.language in init ? navigator.language : ((_h) => (_h = Object.keys(init)[0]) != null ? _h : "")()) => {
  const [locale, setLocale] = createSignal(lang);
  const [dict, setDict] = createStore(init);
  const translate = (key, params, defaultValue) => {
    const val = deepReadObject(dict[locale()], key, defaultValue || "");
    if (typeof val === "function")
      return val(params);
    if (typeof val === "string")
      return template(val, params || {});
    return val;
  };
  const actions = {
    add(lang2, table) {
      setDict(lang2, (t2) => Object.assign(t2 || {}, table));
    },
    locale: (lang2) => lang2 ? setLocale(lang2) : locale(),
    dict: (lang2) => deepReadObject(dict, lang2)
  };
  return [translate, actions];
};
var I18nContext = createContext({});
var useI18n = () => useContext(I18nContext);
const TextStyled$2 = styled.div`
    font-style: normal;
    font-weight: ${(props) => props.fontWeight};
    font-size: ${(props) => props.fontSize};
    line-height: ${(props) => props.lineHeight};

    color: ${(props) => props.color};
`;
const Text = (inputs) => {
  const theme = useTheme();
  const [t2] = useI18n();
  let textRef;
  const color = () => inputs.color || theme.colors.text.primary;
  const props = mergeProps({
    fontSize: "14px",
    fontWeight: "510",
    lineHeight: "130%"
  }, inputs);
  createEffect(() => {
    if (!textRef) {
      return;
    }
    if (props.cursor === "unset") {
      return;
    }
    if (getComputedStyle(textRef).cursor !== "pointer") {
      textRef.style.cursor = "default";
    }
  });
  return createComponent(TextStyled$2, {
    get fontSize() {
      return props.fontSize;
    },
    get fontWeight() {
      return props.fontWeight;
    },
    get lineHeight() {
      return props.lineHeight;
    },
    get color() {
      return color();
    },
    get ["class"]() {
      return props.class;
    },
    ref(r$) {
      var _ref$ = textRef;
      typeof _ref$ === "function" ? _ref$(r$) : textRef = r$;
    },
    "data-tc-text": "true",
    get children() {
      var _a2;
      return createMemo(() => !!props.translationKey)() ? t2(props.translationKey, props.translationValues, (_a2 = props.children) == null ? void 0 : _a2.toString()) : props.children;
    }
  });
};
const ImageContainer = styled.div`
    position: relative;

    &::after {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        border: 0.5px solid rgba(0, 0, 0, 0.08);

        border-radius: inherit;
    }
`;
const ImageStyled$1 = styled(Image)`
    width: 100%;
    height: 100%;
    border-radius: inherit;
`;
const WalletImage = (props) => {
  return createComponent(ImageContainer, {
    get ["class"]() {
      return props.class;
    },
    get children() {
      return createComponent(ImageStyled$1, {
        get src() {
          return props.src;
        }
      });
    }
  });
};
const borders = {
  m: "16px",
  s: "12px",
  none: "0"
};
const badgeBorders = {
  m: "6px",
  s: "6px",
  none: "0"
};
styled.button`
    position: relative;
    cursor: pointer;
    border: none;
    background-color: unset;
    padding: 8px 4px;
    width: 92px;
    display: flex;
    flex-direction: column;
    align-items: center;

    transition: transform 0.125s ease-in-out;

    ${mediaNotTouch} {
        &:hover {
            transform: scale(1.04);
        }
    }

    &:active {
        transform: scale(0.96);
    }

    ${media("mobile")} {
        padding: 8px 4px;
        width: 82px;
    }

    ${mediaTouch} {
        &:active {
            transform: scale(0.92);
        }
    }
`;
styled(WalletImage)`
    width: 60px;
    height: 60px;
    border-radius: ${(props) => borders[props.theme.borderRadius]};

    margin-bottom: 8px;
`;
styled(Image)`
    position: absolute;
    right: 10px;
    top: 50px;
    width: 24px;
    height: 24px;
    border-radius: ${(props) => badgeBorders[props.theme.borderRadius]};
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
`;
styled(Text)`
    max-width: 90px;
    font-weight: 510;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

    ${media("mobile")} {
        max-width: 80px;
    }
`;
styled(Text)`
    font-weight: ${(props) => props.colorPrimary ? "510" : "400"};
    max-width: 90px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: ${(props) => props.colorPrimary ? props.theme.colors.text.primary : props.theme.colors.text.secondary};

    ${media("mobile")} {
        max-width: 80px;
    }
`;
const H1Styled$2 = styled.h1`
    font-style: normal;
    font-weight: 590;
    font-size: 20px;
    line-height: 28px;

    text-align: center;

    color: ${(props) => props.theme.colors.text.primary};

    margin-top: 0;
    margin-bottom: 0;

    cursor: default;
`;
const H1 = (props) => {
  const [t2] = useI18n();
  return createComponent(H1Styled$2, {
    get ["class"]() {
      return props.class;
    },
    "data-tc-h1": "true",
    get children() {
      var _a2;
      return createMemo(() => !!props.translationKey)() ? t2(props.translationKey, props.translationValues, (_a2 = props.children) == null ? void 0 : _a2.toString()) : props.children;
    }
  });
};
const H2Styled$1 = styled.h2`
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;

    text-align: center;

    color: ${(props) => props.theme.colors.text.secondary};

    margin-top: 0;
    margin-bottom: 32px;

    cursor: default;
`;
const H2 = (props) => {
  const [t2] = useI18n();
  return createComponent(H2Styled$1, {
    get ["class"]() {
      return props.class;
    },
    "data-tc-h2": "true",
    get children() {
      var _a2;
      return createMemo(() => !!props.translationKey)() ? t2(props.translationKey, props.translationValues, (_a2 = props.children) == null ? void 0 : _a2.toString()) : props.children;
    }
  });
};
const H3Styled = styled.h3`
    font-style: normal;
    font-weight: 510;
    font-size: 16px;
    line-height: 20px;

    color: ${(props) => props.theme.colors.text.primary};

    margin-top: 0;
    margin-bottom: 0;

    cursor: default;
`;
const H3 = (props) => {
  const [t2] = useI18n();
  return createComponent(H3Styled, {
    "data-tc-h3": "true",
    get ["class"]() {
      return props.class;
    },
    get children() {
      var _a2;
      return createMemo(() => !!props.translationKey)() ? t2(props.translationKey, props.translationValues, (_a2 = props.children) == null ? void 0 : _a2.toString()) : props.children;
    }
  });
};
const containerBorders = {
  m: "16px",
  s: "12px",
  none: "0"
};
const walletBorders = {
  m: "6px",
  s: "6px",
  none: "0"
};
styled.div`
    width: 60px;
    height: 60px;
    padding: 8px;
    margin-bottom: 8px;
    border-radius: ${(props) => containerBorders[props.theme.borderRadius]};
    background-color: ${(props) => props.theme.colors.background.tint};
    display: grid;
    grid-template: 1fr 1fr / 1fr 1fr;
    gap: 4px;
`;
styled(WalletImage)`
    width: 20px;
    height: 20px;
    border-radius: ${(props) => walletBorders[props.theme.borderRadius]};
`;
styled.div`
    width: 100%;
    overflow-y: auto;
    max-height: ${(props) => props.maxHeight};

    scrollbar-width: none;
    &&::-webkit-scrollbar {
        display: none;
    }

    &&::-webkit-scrollbar-track {
        background: transparent;
    }

    &&::-webkit-scrollbar-thumb {
        display: none;
    }
`;
styled.div`
    height: 1px;
    margin: 0 -24px;
    width: calc(100% + 48px);
    opacity: 0.08;
    background: ${(props) => props.isShown ? props.theme.colors.icon.secondary : "transparent"};
    transition: background 0.15s ease-in-out;

    ${media("mobile")} {
        width: 100%;
        margin: 0;
    }
`;
const [windowHeight, setWindowHeight] = createSignal(((_i = getWindow$1()) == null ? void 0 : _i.innerHeight) || 0);
if (getWindow$1()) {
  window.addEventListener("resize", () => setWindowHeight(window.innerHeight));
}
const AStyled = styled.a`
    display: block;
    text-decoration: unset;
`;
const Link = (props) => {
  const attributes = () => props.blank ? {
    rel: "noreferrer noopener"
  } : {};
  return createComponent(AStyled, mergeProps({
    get href() {
      return props.href;
    },
    get target() {
      return props.blank ? "_blank" : "_self";
    },
    get ["class"]() {
      return props.class;
    }
  }, attributes, {
    get children() {
      return props.children;
    }
  }));
};
var _tmpl$$5 = /* @__PURE__ */ template$1(`<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path fill-rule=evenodd clip-rule=evenodd d="M7.76228 2.09998H10.2378C11.0458 2.09997 11.7067 2.09996 12.2438 2.14384C12.7997 2.18926 13.3017 2.28614 13.7706 2.52505C14.5045 2.89896 15.1011 3.49558 15.475 4.22941C15.7139 4.6983 15.8108 5.20038 15.8562 5.75629C15.9001 6.29337 15.9001 6.95422 15.9001 7.76227V8.1H16.2377C17.0457 8.09999 17.7066 8.09998 18.2437 8.14386C18.7996 8.18928 19.3017 8.28616 19.7705 8.52507C20.5044 8.89898 21.101 9.4956 21.4749 10.2294C21.7138 10.6983 21.8107 11.2004 21.8561 11.7563C21.9 12.2934 21.9 12.9542 21.9 13.7623V16.2377C21.9 17.0458 21.9 17.7066 21.8561 18.2437C21.8107 18.7996 21.7138 19.3017 21.4749 19.7706C21.101 20.5044 20.5044 21.101 19.7705 21.4749C19.3017 21.7138 18.7996 21.8107 18.2437 21.8561C17.7066 21.9 17.0458 21.9 16.2378 21.9H13.7623C12.9543 21.9 12.2934 21.9 11.7563 21.8561C11.2004 21.8107 10.6983 21.7138 10.2294 21.4749C9.49561 21.101 8.89898 20.5044 8.52508 19.7706C8.28616 19.3017 8.18928 18.7996 8.14386 18.2437C8.09998 17.7066 8.09999 17.0458 8.1 16.2377V15.9H7.76227C6.95426 15.9 6.29335 15.9 5.75629 15.8561C5.20038 15.8107 4.6983 15.7138 4.22941 15.4749C3.49558 15.101 2.89896 14.5044 2.52505 13.7705C2.28614 13.3017 2.18926 12.7996 2.14384 12.2437C2.09996 11.7066 2.09997 11.0458 2.09998 10.2377V7.76228C2.09997 6.95424 2.09996 6.29336 2.14384 5.75629C2.18926 5.20038 2.28614 4.6983 2.52505 4.22941C2.89896 3.49558 3.49558 2.89896 4.22941 2.52505C4.6983 2.28614 5.20038 2.18926 5.75629 2.14384C6.29336 2.09996 6.95425 2.09997 7.76228 2.09998ZM8.1 14.1V13.7623C8.09999 12.9542 8.09998 12.2934 8.14386 11.7563C8.18928 11.2004 8.28616 10.6983 8.52508 10.2294C8.89898 9.4956 9.49561 8.89898 10.2294 8.52507C10.6983 8.28616 11.2004 8.18928 11.7563 8.14386C12.2934 8.09998 12.9542 8.09999 13.7623 8.1H14.1001V7.79998C14.1001 6.94505 14.0994 6.35798 14.0622 5.90287C14.0259 5.45827 13.9593 5.21944 13.8712 5.0466C13.6699 4.65146 13.3486 4.3302 12.9535 4.12886C12.7806 4.04079 12.5418 3.97419 12.0972 3.93786C11.6421 3.90068 11.055 3.89998 10.2001 3.89998H7.79998C6.94505 3.89998 6.35798 3.90068 5.90287 3.93786C5.45827 3.97419 5.21944 4.04079 5.0466 4.12886C4.65146 4.3302 4.3302 4.65146 4.12886 5.0466C4.04079 5.21944 3.97419 5.45827 3.93786 5.90287C3.90068 6.35798 3.89998 6.94505 3.89998 7.79998V10.2C3.89998 11.0549 3.90068 11.642 3.93786 12.0971C3.97419 12.5417 4.04079 12.7805 4.12886 12.9534C4.3302 13.3485 4.65146 13.6698 5.0466 13.8711C5.21944 13.9592 5.45827 14.0258 5.90287 14.0621C6.35798 14.0993 6.94505 14.1 7.79998 14.1H8.1ZM11.0466 10.1289C11.2195 10.0408 11.4583 9.97421 11.9029 9.93788C12.358 9.9007 12.9451 9.9 13.8 9.9H16.2C17.0549 9.9 17.642 9.9007 18.0971 9.93788C18.5417 9.97421 18.7805 10.0408 18.9534 10.1289C19.3485 10.3302 19.6698 10.6515 19.8711 11.0466C19.9592 11.2195 20.0258 11.4583 20.0621 11.9029C20.0993 12.358 20.1 12.9451 20.1 13.8V16.2C20.1 17.0549 20.0993 17.642 20.0621 18.0971C20.0258 18.5417 19.9592 18.7805 19.8711 18.9534C19.6698 19.3485 19.3485 19.6698 18.9534 19.8711C18.7805 19.9592 18.5417 20.0258 18.0971 20.0621C17.642 20.0993 17.0549 20.1 16.2 20.1H13.8C12.9451 20.1 12.358 20.0993 11.9029 20.0621C11.4583 20.0258 11.2195 19.9592 11.0466 19.8711C10.6515 19.6698 10.3302 19.3485 10.1289 18.9534C10.0408 18.7805 9.97421 18.5417 9.93788 18.0971C9.9007 17.642 9.9 17.0549 9.9 16.2V13.8C9.9 12.9451 9.9007 12.358 9.93788 11.9029C9.97421 11.4583 10.0408 11.2195 10.1289 11.0466C10.3302 10.6515 10.6515 10.3302 11.0466 10.1289Z">`);
const CopyIcon = (props) => {
  const theme = useTheme();
  const fill = () => props.fill || theme.colors.icon.primary;
  return (() => {
    var _el$ = _tmpl$$5(), _el$2 = _el$.firstChild;
    createRenderEffect((_p$) => {
      var _v$ = props.class, _v$2 = fill();
      _v$ !== _p$.e && setAttribute(_el$, "class", _p$.e = _v$);
      _v$2 !== _p$.t && setAttribute(_el$2, "fill", _p$.t = _v$2);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$;
  })();
};
var _tmpl$$4 = /* @__PURE__ */ template$1(`<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M8.7624 3.10001C7.95435 3.1 7.29349 3.09999 6.75642 3.14387C6.2005 3.18929 5.69842 3.28617 5.22954 3.52508C4.4957 3.89899 3.89908 4.49561 3.52517 5.22944C3.28626 5.69833 3.18938 6.20041 3.14396 6.75632C3.10008 7.2934 3.10009 7.95424 3.1001 8.76229V15.2377C3.10009 16.0458 3.10008 16.7066 3.14396 17.2437C3.18938 17.7996 3.28626 18.3017 3.52517 18.7706C3.89908 19.5044 4.4957 20.101 5.22954 20.4749C5.69842 20.7138 6.2005 20.8107 6.75642 20.8561C7.29349 20.9 7.95434 20.9 8.76239 20.9H12.0001C12.4972 20.9 12.9001 20.4971 12.9001 20C12.9001 19.503 12.4972 19.1 12.0001 19.1H8.8001C7.94517 19.1 7.3581 19.0993 6.90299 19.0621C6.45839 19.0258 6.21956 18.9592 6.04672 18.8711C5.65158 18.6698 5.33032 18.3485 5.12898 17.9534C5.04092 17.7805 4.97431 17.5417 4.93798 17.0971C4.9008 16.642 4.9001 16.0549 4.9001 15.2V8.80001C4.9001 7.94508 4.9008 7.35801 4.93798 6.9029C4.97431 6.4583 5.04092 6.21947 5.12898 6.04663C5.33032 5.65149 5.65158 5.33023 6.04672 5.12889C6.21956 5.04082 6.45839 4.97422 6.90299 4.93789C7.3581 4.90071 7.94517 4.90001 8.8001 4.90001H12.0001C12.4972 4.90001 12.9001 4.49706 12.9001 4.00001C12.9001 3.50295 12.4972 3.10001 12.0001 3.10001H8.7624Z"></path><path d="M17.6364 7.3636C17.2849 7.01212 16.7151 7.01212 16.3636 7.3636C16.0121 7.71507 16.0121 8.28492 16.3636 8.63639L18.8272 11.1H9.00001C8.50295 11.1 8.10001 11.5029 8.10001 12C8.10001 12.497 8.50295 12.9 9.00001 12.9H18.8272L16.3636 15.3636C16.0121 15.7151 16.0121 16.2849 16.3636 16.6364C16.7151 16.9879 17.2849 16.9879 17.6364 16.6364L21.6364 12.6364C21.9879 12.2849 21.9879 11.7151 21.6364 11.3636L17.6364 7.3636Z">`);
const DisconnectIcon = (props) => {
  const theme = useTheme();
  const fill = () => props.fill || theme.colors.icon.primary;
  return (() => {
    var _el$ = _tmpl$$4(), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling;
    createRenderEffect((_p$) => {
      var _v$ = fill(), _v$2 = fill();
      _v$ !== _p$.e && setAttribute(_el$2, "fill", _p$.e = _v$);
      _v$2 !== _p$.t && setAttribute(_el$3, "fill", _p$.t = _v$2);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$;
  })();
};
function copyToClipboard(text) {
  return __async(this, null, function* () {
    try {
      if (!(navigator == null ? void 0 : navigator.clipboard)) {
        throw new OKXConnectUiError("Clipboard API not available");
      }
      return yield navigator.clipboard.writeText(text);
    } catch (e2) {
    }
    fallbackCopyTextToClipboard(text);
  });
}
function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand("copy");
  } finally {
    document.body.removeChild(textArea);
  }
}
const hoverBorders = {
  m: "8px",
  s: "4px",
  none: "0"
};
const dropdownBorders = {
  m: "16px",
  s: "8px",
  none: "0"
};
const AccountButtonDropdownStyled = styled.div`
    width: 256px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.16);
    border-radius: ${(props) => dropdownBorders[props.theme.borderRadius]};

    background-color: ${(props) => props.theme.colors.background.primary}
           
    color: ${(props) => props.theme.colors.text.primary}
`;
const UlStyled = styled.ul`
    background-color: ${(props) => props.theme.colors.background.primary};
    padding: 8px;
`;
const MenuButtonStyled = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    height: 40px;
    padding-left: 8px;
    width: 100%;

    background-color: ${(props) => props.theme.colors.background.primary};
    border: none;
    border-radius: ${(props) => hoverBorders[props.theme.borderRadius]};
    cursor: pointer;

    transition: background-color, transform 0.1s ease-in-out;

    &:hover {
        background-color: ${(props) => props.theme.colors.background.secondary};
    }

    &:active {
        transform: scale(0.96);
    }
`;
const OKXConnectUiContext = createContext();
var _tmpl$$3 = /* @__PURE__ */ template$1(`<li>`);
const MenuItemText = (props) => createComponent(Text, {
  get translationKey() {
    return props.translationKey;
  },
  fontSize: "15px",
  fontWeight: "590",
  get children() {
    return props.children;
  }
});
const AccountButtonDropdown = (props) => {
  const tonConnectUi = useContext(OKXConnectUiContext);
  const [isCopiedShown, setIsCopiedShown] = createSignal(false);
  const onCopy = () => __async(exports, null, function* () {
    const userFriendlyAddress = tonsdk.toUserFriendlyAddress(tonConnectUi.account.address);
    yield copyToClipboard(userFriendlyAddress);
    setIsCopiedShown(true);
    setTimeout(() => setIsCopiedShown(false), 1e3);
  });
  const onDisconnect = () => {
    tonConnectUi.disconnect();
    props.onClose();
  };
  return createComponent(AccountButtonDropdownStyled, {
    ref(r$) {
      var _ref$ = props.ref;
      typeof _ref$ === "function" ? _ref$(r$) : props.ref = r$;
    },
    get ["class"]() {
      return props.class;
    },
    "data-tc-dropdown": "true",
    get children() {
      return createComponent(UlStyled, {
        get children() {
          return [(() => {
            var _el$ = _tmpl$$3();
            insert(_el$, createComponent(MenuButtonStyled, {
              onClick: () => onCopy(),
              get children() {
                return [createComponent(CopyIcon, {}), createComponent(Show, {
                  get when() {
                    return !isCopiedShown();
                  },
                  get children() {
                    return createComponent(MenuItemText, {
                      translationKey: "button.dropdown.copy",
                      children: "Copy address"
                    });
                  }
                }), createComponent(Show, {
                  get when() {
                    return isCopiedShown();
                  },
                  get children() {
                    return createComponent(MenuItemText, {
                      translationKey: "button.dropdown.copied",
                      children: "Address copied!"
                    });
                  }
                })];
              }
            }));
            return _el$;
          })(), (() => {
            var _el$2 = _tmpl$$3();
            insert(_el$2, createComponent(MenuButtonStyled, {
              onClick: () => onDisconnect(),
              get children() {
                return [createComponent(DisconnectIcon, {}), createComponent(MenuItemText, {
                  translationKey: "button.dropdown.disconnect",
                  children: "Disconnect"
                })];
              }
            }));
            return _el$2;
          })()];
        }
      });
    }
  });
};
const AccountButtonStyled = styled(Button)`
    background-color: ${(props) => props.theme.colors.connectButton.background};
    color: ${(props) => props.theme.colors.connectButton.foreground};
    box-shadow: ${(props) => `0 4px 24px ${rgba(props.theme.colors.constant.black, 0.16)}`};
    padding: 8px 16px 8px 12px;

    display: flex;
    align-items: center;
    gap: 4px;
    height: 40px;
`;
const DropdownButtonStyled = styled(AccountButtonStyled)`
    padding: 12px 16px;
    min-width: 148px;
    justify-content: center;
    background-color: ${(props) => props.theme.colors.background.primary};
`;
const LoaderButtonStyled = styled(Button)`
    min-width: 148px;
    height: 40px;

    background-color: ${(props) => props.theme.colors.background.primary};
    color: ${(props) => props.theme.colors.connectButton.foreground};
    box-shadow: ${(props) => `0 4px 24px ${rgba(props.theme.colors.constant.black, 0.16)}`};

    display: flex;
    align-items: center;
    justify-content: center;
`;
const LoaderIconStyled = styled(LoaderIcon)`
    height: 18px;
    width: 18px;
`;
const DropdownContainerStyled = styled.div`
    width: fit-content;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
`;
const DropdownStyled = styled(AccountButtonDropdown)`
    box-sizing: border-box;
    overflow: hidden;
    margin-top: 12px;
`;
const sides = ["top", "right", "bottom", "left"];
const alignments = ["start", "end"];
const placements = /* @__PURE__ */ sides.reduce((acc, side) => acc.concat(side, side + "-" + alignments[0], side + "-" + alignments[1]), []);
const min = Math.min;
const max = Math.max;
const round = Math.round;
const floor = Math.floor;
const createCoords = (v) => ({
  x: v,
  y: v
});
const oppositeSideMap = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
const oppositeAlignmentMap = {
  start: "end",
  end: "start"
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === "function" ? value(param) : value;
}
function getSide(placement) {
  return placement.split("-")[0];
}
function getAlignment(placement) {
  return placement.split("-")[1];
}
function getOppositeAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
  return axis === "y" ? "height" : "width";
}
function getSideAxis(placement) {
  return ["top", "bottom"].includes(getSide(placement)) ? "y" : "x";
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, (alignment) => oppositeAlignmentMap[alignment]);
}
function getSideList(side, isStart, rtl) {
  const lr = ["left", "right"];
  const rl = ["right", "left"];
  const tb = ["top", "bottom"];
  const bt = ["bottom", "top"];
  switch (side) {
    case "top":
    case "bottom":
      if (rtl)
        return isStart ? rl : lr;
      return isStart ? lr : rl;
    case "left":
    case "right":
      return isStart ? tb : bt;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === "start", rtl);
  if (alignment) {
    list = list.map((side) => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side]);
}
function expandPaddingObject(padding) {
  return __spreadValues({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }, padding);
}
function getPaddingObject(padding) {
  return typeof padding !== "number" ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  const {
    x,
    y,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y
  };
}
function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = getSideAxis(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);
  const side = getSide(placement);
  const isVertical = sideAxis === "y";
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case "top":
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case "bottom":
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case "right":
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case "left":
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case "start":
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case "end":
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}
const computePosition$1 = (reference, floating, config) => __async(exports, null, function* () {
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform: platform2
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = yield platform2.isRTL == null ? void 0 : platform2.isRTL(floating);
  let rects = yield platform2.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i2 = 0; i2 < validMiddleware.length; i2++) {
    const {
      name,
      fn
    } = validMiddleware[i2];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = yield fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: platform2,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData = __spreadProps(__spreadValues({}, middlewareData), {
      [name]: __spreadValues(__spreadValues({}, middlewareData[name]), data)
    });
    if (reset && resetCount <= 50) {
      resetCount++;
      if (typeof reset === "object") {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? yield platform2.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i2 = -1;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
});
function detectOverflow(state, options) {
  return __async(this, null, function* () {
    var _await$platform$isEle;
    if (options === void 0) {
      options = {};
    }
    const {
      x,
      y,
      platform: platform2,
      rects,
      elements,
      strategy
    } = state;
    const {
      boundary = "clippingAncestors",
      rootBoundary = "viewport",
      elementContext = "floating",
      altBoundary = false,
      padding = 0
    } = evaluate(options, state);
    const paddingObject = getPaddingObject(padding);
    const altContext = elementContext === "floating" ? "reference" : "floating";
    const element = elements[altBoundary ? altContext : elementContext];
    const clippingClientRect = rectToClientRect(yield platform2.getClippingRect({
      element: ((_await$platform$isEle = yield platform2.isElement == null ? void 0 : platform2.isElement(element)) != null ? _await$platform$isEle : true) ? element : element.contextElement || (yield platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
      boundary,
      rootBoundary,
      strategy
    }));
    const rect = elementContext === "floating" ? {
      x,
      y,
      width: rects.floating.width,
      height: rects.floating.height
    } : rects.reference;
    const offsetParent = yield platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating);
    const offsetScale = (yield platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? (yield platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
      x: 1,
      y: 1
    } : {
      x: 1,
      y: 1
    };
    const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? yield platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
      elements,
      rect,
      offsetParent,
      strategy
    }) : rect);
    return {
      top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
      bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
      left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
      right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
    };
  });
}
const arrow = (options) => ({
  name: "arrow",
  options,
  fn(state) {
    return __async(this, null, function* () {
      const {
        x,
        y,
        placement,
        rects,
        platform: platform2,
        elements,
        middlewareData
      } = state;
      const {
        element,
        padding = 0
      } = evaluate(options, state) || {};
      if (element == null) {
        return {};
      }
      const paddingObject = getPaddingObject(padding);
      const coords = {
        x,
        y
      };
      const axis = getAlignmentAxis(placement);
      const length = getAxisLength(axis);
      const arrowDimensions = yield platform2.getDimensions(element);
      const isYAxis = axis === "y";
      const minProp = isYAxis ? "top" : "left";
      const maxProp = isYAxis ? "bottom" : "right";
      const clientProp = isYAxis ? "clientHeight" : "clientWidth";
      const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
      const startDiff = coords[axis] - rects.reference[axis];
      const arrowOffsetParent = yield platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(element);
      let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
      if (!clientSize || !(yield platform2.isElement == null ? void 0 : platform2.isElement(arrowOffsetParent))) {
        clientSize = elements.floating[clientProp] || rects.floating[length];
      }
      const centerToReference = endDiff / 2 - startDiff / 2;
      const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
      const minPadding = min(paddingObject[minProp], largestPossiblePadding);
      const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);
      const min$1 = minPadding;
      const max2 = clientSize - arrowDimensions[length] - maxPadding;
      const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
      const offset2 = clamp(min$1, center, max2);
      const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset2 && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
      const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max2 : 0;
      return {
        [axis]: coords[axis] + alignmentOffset,
        data: __spreadValues({
          [axis]: offset2,
          centerOffset: center - offset2 - alignmentOffset
        }, shouldAddOffset && {
          alignmentOffset
        }),
        reset: shouldAddOffset
      };
    });
  }
});
function getPlacementList(alignment, autoAlignment, allowedPlacements) {
  const allowedPlacementsSortedByAlignment = alignment ? [...allowedPlacements.filter((placement) => getAlignment(placement) === alignment), ...allowedPlacements.filter((placement) => getAlignment(placement) !== alignment)] : allowedPlacements.filter((placement) => getSide(placement) === placement);
  return allowedPlacementsSortedByAlignment.filter((placement) => {
    if (alignment) {
      return getAlignment(placement) === alignment || (autoAlignment ? getOppositeAlignmentPlacement(placement) !== placement : false);
    }
    return true;
  });
}
const autoPlacement = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "autoPlacement",
    options,
    fn(state) {
      return __async(this, null, function* () {
        var _middlewareData$autoP, _middlewareData$autoP2, _placementsThatFitOnE;
        const {
          rects,
          middlewareData,
          placement,
          platform: platform2,
          elements
        } = state;
        const _a3 = evaluate(options, state), {
          crossAxis = false,
          alignment,
          allowedPlacements = placements,
          autoAlignment = true
        } = _a3, detectOverflowOptions = __objRest(_a3, [
          "crossAxis",
          "alignment",
          "allowedPlacements",
          "autoAlignment"
        ]);
        const placements$1 = alignment !== void 0 || allowedPlacements === placements ? getPlacementList(alignment || null, autoAlignment, allowedPlacements) : allowedPlacements;
        const overflow = yield detectOverflow(state, detectOverflowOptions);
        const currentIndex = ((_middlewareData$autoP = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP.index) || 0;
        const currentPlacement = placements$1[currentIndex];
        if (currentPlacement == null) {
          return {};
        }
        const alignmentSides = getAlignmentSides(currentPlacement, rects, yield platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
        if (placement !== currentPlacement) {
          return {
            reset: {
              placement: placements$1[0]
            }
          };
        }
        const currentOverflows = [overflow[getSide(currentPlacement)], overflow[alignmentSides[0]], overflow[alignmentSides[1]]];
        const allOverflows = [...((_middlewareData$autoP2 = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP2.overflows) || [], {
          placement: currentPlacement,
          overflows: currentOverflows
        }];
        const nextPlacement = placements$1[currentIndex + 1];
        if (nextPlacement) {
          return {
            data: {
              index: currentIndex + 1,
              overflows: allOverflows
            },
            reset: {
              placement: nextPlacement
            }
          };
        }
        const placementsSortedByMostSpace = allOverflows.map((d) => {
          const alignment2 = getAlignment(d.placement);
          return [d.placement, alignment2 && crossAxis ? d.overflows.slice(0, 2).reduce((acc, v) => acc + v, 0) : d.overflows[0], d.overflows];
        }).sort((a2, b) => a2[1] - b[1]);
        const placementsThatFitOnEachSide = placementsSortedByMostSpace.filter((d) => d[2].slice(
          0,
          getAlignment(d[0]) ? 2 : 3
        ).every((v) => v <= 0));
        const resetPlacement = ((_placementsThatFitOnE = placementsThatFitOnEachSide[0]) == null ? void 0 : _placementsThatFitOnE[0]) || placementsSortedByMostSpace[0][0];
        if (resetPlacement !== placement) {
          return {
            data: {
              index: currentIndex + 1,
              overflows: allOverflows
            },
            reset: {
              placement: resetPlacement
            }
          };
        }
        return {};
      });
    }
  };
};
const flip = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "flip",
    options,
    fn(state) {
      return __async(this, null, function* () {
        var _middlewareData$arrow, _middlewareData$flip;
        const {
          placement,
          middlewareData,
          rects,
          initialPlacement,
          platform: platform2,
          elements
        } = state;
        const _a3 = evaluate(options, state), {
          mainAxis: checkMainAxis = true,
          crossAxis: checkCrossAxis = true,
          fallbackPlacements: specifiedFallbackPlacements,
          fallbackStrategy = "bestFit",
          fallbackAxisSideDirection = "none",
          flipAlignment = true
        } = _a3, detectOverflowOptions = __objRest(_a3, [
          "mainAxis",
          "crossAxis",
          "fallbackPlacements",
          "fallbackStrategy",
          "fallbackAxisSideDirection",
          "flipAlignment"
        ]);
        if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
          return {};
        }
        const side = getSide(placement);
        const initialSideAxis = getSideAxis(initialPlacement);
        const isBasePlacement = getSide(initialPlacement) === initialPlacement;
        const rtl = yield platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating);
        const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
        const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
        if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
          fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
        }
        const placements2 = [initialPlacement, ...fallbackPlacements];
        const overflow = yield detectOverflow(state, detectOverflowOptions);
        const overflows = [];
        let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
        if (checkMainAxis) {
          overflows.push(overflow[side]);
        }
        if (checkCrossAxis) {
          const sides2 = getAlignmentSides(placement, rects, rtl);
          overflows.push(overflow[sides2[0]], overflow[sides2[1]]);
        }
        overflowsData = [...overflowsData, {
          placement,
          overflows
        }];
        if (!overflows.every((side2) => side2 <= 0)) {
          var _middlewareData$flip2, _overflowsData$filter;
          const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
          const nextPlacement = placements2[nextIndex];
          if (nextPlacement) {
            return {
              data: {
                index: nextIndex,
                overflows: overflowsData
              },
              reset: {
                placement: nextPlacement
              }
            };
          }
          let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a2, b) => a2.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
          if (!resetPlacement) {
            switch (fallbackStrategy) {
              case "bestFit": {
                var _overflowsData$filter2;
                const placement2 = (_overflowsData$filter2 = overflowsData.filter((d) => {
                  if (hasFallbackAxisSideDirection) {
                    const currentSideAxis = getSideAxis(d.placement);
                    return currentSideAxis === initialSideAxis || currentSideAxis === "y";
                  }
                  return true;
                }).map((d) => [d.placement, d.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a2, b) => a2[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
                if (placement2) {
                  resetPlacement = placement2;
                }
                break;
              }
              case "initialPlacement":
                resetPlacement = initialPlacement;
                break;
            }
          }
          if (placement !== resetPlacement) {
            return {
              reset: {
                placement: resetPlacement
              }
            };
          }
        }
        return {};
      });
    }
  };
};
function getSideOffsets(overflow, rect) {
  return {
    top: overflow.top - rect.height,
    right: overflow.right - rect.width,
    bottom: overflow.bottom - rect.height,
    left: overflow.left - rect.width
  };
}
function isAnySideFullyClipped(overflow) {
  return sides.some((side) => overflow[side] >= 0);
}
const hide = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "hide",
    options,
    fn(state) {
      return __async(this, null, function* () {
        const {
          rects
        } = state;
        const _a3 = evaluate(options, state), {
          strategy = "referenceHidden"
        } = _a3, detectOverflowOptions = __objRest(_a3, [
          "strategy"
        ]);
        switch (strategy) {
          case "referenceHidden": {
            const overflow = yield detectOverflow(state, __spreadProps(__spreadValues({}, detectOverflowOptions), {
              elementContext: "reference"
            }));
            const offsets = getSideOffsets(overflow, rects.reference);
            return {
              data: {
                referenceHiddenOffsets: offsets,
                referenceHidden: isAnySideFullyClipped(offsets)
              }
            };
          }
          case "escaped": {
            const overflow = yield detectOverflow(state, __spreadProps(__spreadValues({}, detectOverflowOptions), {
              altBoundary: true
            }));
            const offsets = getSideOffsets(overflow, rects.floating);
            return {
              data: {
                escapedOffsets: offsets,
                escaped: isAnySideFullyClipped(offsets)
              }
            };
          }
          default: {
            return {};
          }
        }
      });
    }
  };
};
function getBoundingRect(rects) {
  const minX = min(...rects.map((rect) => rect.left));
  const minY = min(...rects.map((rect) => rect.top));
  const maxX = max(...rects.map((rect) => rect.right));
  const maxY = max(...rects.map((rect) => rect.bottom));
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}
function getRectsByLine(rects) {
  const sortedRects = rects.slice().sort((a2, b) => a2.y - b.y);
  const groups = [];
  let prevRect = null;
  for (let i2 = 0; i2 < sortedRects.length; i2++) {
    const rect = sortedRects[i2];
    if (!prevRect || rect.y - prevRect.y > prevRect.height / 2) {
      groups.push([rect]);
    } else {
      groups[groups.length - 1].push(rect);
    }
    prevRect = rect;
  }
  return groups.map((rect) => rectToClientRect(getBoundingRect(rect)));
}
const inline = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "inline",
    options,
    fn(state) {
      return __async(this, null, function* () {
        const {
          placement,
          elements,
          rects,
          platform: platform2,
          strategy
        } = state;
        const {
          padding = 2,
          x,
          y
        } = evaluate(options, state);
        const nativeClientRects = Array.from((yield platform2.getClientRects == null ? void 0 : platform2.getClientRects(elements.reference)) || []);
        const clientRects = getRectsByLine(nativeClientRects);
        const fallback = rectToClientRect(getBoundingRect(nativeClientRects));
        const paddingObject = getPaddingObject(padding);
        function getBoundingClientRect2() {
          if (clientRects.length === 2 && clientRects[0].left > clientRects[1].right && x != null && y != null) {
            return clientRects.find((rect) => x > rect.left - paddingObject.left && x < rect.right + paddingObject.right && y > rect.top - paddingObject.top && y < rect.bottom + paddingObject.bottom) || fallback;
          }
          if (clientRects.length >= 2) {
            if (getSideAxis(placement) === "y") {
              const firstRect = clientRects[0];
              const lastRect = clientRects[clientRects.length - 1];
              const isTop = getSide(placement) === "top";
              const top2 = firstRect.top;
              const bottom2 = lastRect.bottom;
              const left2 = isTop ? firstRect.left : lastRect.left;
              const right2 = isTop ? firstRect.right : lastRect.right;
              const width2 = right2 - left2;
              const height2 = bottom2 - top2;
              return {
                top: top2,
                bottom: bottom2,
                left: left2,
                right: right2,
                width: width2,
                height: height2,
                x: left2,
                y: top2
              };
            }
            const isLeftSide = getSide(placement) === "left";
            const maxRight = max(...clientRects.map((rect) => rect.right));
            const minLeft = min(...clientRects.map((rect) => rect.left));
            const measureRects = clientRects.filter((rect) => isLeftSide ? rect.left === minLeft : rect.right === maxRight);
            const top = measureRects[0].top;
            const bottom = measureRects[measureRects.length - 1].bottom;
            const left = minLeft;
            const right = maxRight;
            const width = right - left;
            const height = bottom - top;
            return {
              top,
              bottom,
              left,
              right,
              width,
              height,
              x: left,
              y: top
            };
          }
          return fallback;
        }
        const resetRects = yield platform2.getElementRects({
          reference: {
            getBoundingClientRect: getBoundingClientRect2
          },
          floating: elements.floating,
          strategy
        });
        if (rects.reference.x !== resetRects.reference.x || rects.reference.y !== resetRects.reference.y || rects.reference.width !== resetRects.reference.width || rects.reference.height !== resetRects.reference.height) {
          return {
            reset: {
              rects: resetRects
            }
          };
        }
        return {};
      });
    }
  };
};
function convertValueToCoords(state, options) {
  return __async(this, null, function* () {
    const {
      placement,
      platform: platform2,
      elements
    } = state;
    const rtl = yield platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating);
    const side = getSide(placement);
    const alignment = getAlignment(placement);
    const isVertical = getSideAxis(placement) === "y";
    const mainAxisMulti = ["left", "top"].includes(side) ? -1 : 1;
    const crossAxisMulti = rtl && isVertical ? -1 : 1;
    const rawValue = evaluate(options, state);
    let {
      mainAxis,
      crossAxis,
      alignmentAxis
    } = typeof rawValue === "number" ? {
      mainAxis: rawValue,
      crossAxis: 0,
      alignmentAxis: null
    } : {
      mainAxis: rawValue.mainAxis || 0,
      crossAxis: rawValue.crossAxis || 0,
      alignmentAxis: rawValue.alignmentAxis
    };
    if (alignment && typeof alignmentAxis === "number") {
      crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
    }
    return isVertical ? {
      x: crossAxis * crossAxisMulti,
      y: mainAxis * mainAxisMulti
    } : {
      x: mainAxis * mainAxisMulti,
      y: crossAxis * crossAxisMulti
    };
  });
}
const offset = function(options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: "offset",
    options,
    fn(state) {
      return __async(this, null, function* () {
        var _middlewareData$offse, _middlewareData$arrow;
        const {
          x,
          y,
          placement,
          middlewareData
        } = state;
        const diffCoords = yield convertValueToCoords(state, options);
        if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
          return {};
        }
        return {
          x: x + diffCoords.x,
          y: y + diffCoords.y,
          data: __spreadProps(__spreadValues({}, diffCoords), {
            placement
          })
        };
      });
    }
  };
};
const shift = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "shift",
    options,
    fn(state) {
      return __async(this, null, function* () {
        const {
          x,
          y,
          placement
        } = state;
        const _a3 = evaluate(options, state), {
          mainAxis: checkMainAxis = true,
          crossAxis: checkCrossAxis = false,
          limiter = {
            fn: (_ref) => {
              let {
                x: x2,
                y: y2
              } = _ref;
              return {
                x: x2,
                y: y2
              };
            }
          }
        } = _a3, detectOverflowOptions = __objRest(_a3, [
          "mainAxis",
          "crossAxis",
          "limiter"
        ]);
        const coords = {
          x,
          y
        };
        const overflow = yield detectOverflow(state, detectOverflowOptions);
        const crossAxis = getSideAxis(getSide(placement));
        const mainAxis = getOppositeAxis(crossAxis);
        let mainAxisCoord = coords[mainAxis];
        let crossAxisCoord = coords[crossAxis];
        if (checkMainAxis) {
          const minSide = mainAxis === "y" ? "top" : "left";
          const maxSide = mainAxis === "y" ? "bottom" : "right";
          const min2 = mainAxisCoord + overflow[minSide];
          const max2 = mainAxisCoord - overflow[maxSide];
          mainAxisCoord = clamp(min2, mainAxisCoord, max2);
        }
        if (checkCrossAxis) {
          const minSide = crossAxis === "y" ? "top" : "left";
          const maxSide = crossAxis === "y" ? "bottom" : "right";
          const min2 = crossAxisCoord + overflow[minSide];
          const max2 = crossAxisCoord - overflow[maxSide];
          crossAxisCoord = clamp(min2, crossAxisCoord, max2);
        }
        const limitedCoords = limiter.fn(__spreadProps(__spreadValues({}, state), {
          [mainAxis]: mainAxisCoord,
          [crossAxis]: crossAxisCoord
        }));
        return __spreadProps(__spreadValues({}, limitedCoords), {
          data: {
            x: limitedCoords.x - x,
            y: limitedCoords.y - y,
            enabled: {
              [mainAxis]: checkMainAxis,
              [crossAxis]: checkCrossAxis
            }
          }
        });
      });
    }
  };
};
const limitShift = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    options,
    fn(state) {
      const {
        x,
        y,
        placement,
        rects,
        middlewareData
      } = state;
      const {
        offset: offset2 = 0,
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true
      } = evaluate(options, state);
      const coords = {
        x,
        y
      };
      const crossAxis = getSideAxis(placement);
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      const rawOffset = evaluate(offset2, state);
      const computedOffset = typeof rawOffset === "number" ? {
        mainAxis: rawOffset,
        crossAxis: 0
      } : __spreadValues({
        mainAxis: 0,
        crossAxis: 0
      }, rawOffset);
      if (checkMainAxis) {
        const len = mainAxis === "y" ? "height" : "width";
        const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
        const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
        if (mainAxisCoord < limitMin) {
          mainAxisCoord = limitMin;
        } else if (mainAxisCoord > limitMax) {
          mainAxisCoord = limitMax;
        }
      }
      if (checkCrossAxis) {
        var _middlewareData$offse, _middlewareData$offse2;
        const len = mainAxis === "y" ? "width" : "height";
        const isOriginSide = ["top", "left"].includes(getSide(placement));
        const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
        const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
        if (crossAxisCoord < limitMin) {
          crossAxisCoord = limitMin;
        } else if (crossAxisCoord > limitMax) {
          crossAxisCoord = limitMax;
        }
      }
      return {
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      };
    }
  };
};
const size = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "size",
    options,
    fn(state) {
      return __async(this, null, function* () {
        var _state$middlewareData, _state$middlewareData2;
        const {
          placement,
          rects,
          platform: platform2,
          elements
        } = state;
        const _a3 = evaluate(options, state), {
          apply = () => {
          }
        } = _a3, detectOverflowOptions = __objRest(_a3, [
          "apply"
        ]);
        const overflow = yield detectOverflow(state, detectOverflowOptions);
        const side = getSide(placement);
        const alignment = getAlignment(placement);
        const isYAxis = getSideAxis(placement) === "y";
        const {
          width,
          height
        } = rects.floating;
        let heightSide;
        let widthSide;
        if (side === "top" || side === "bottom") {
          heightSide = side;
          widthSide = alignment === ((yield platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating)) ? "start" : "end") ? "left" : "right";
        } else {
          widthSide = side;
          heightSide = alignment === "end" ? "top" : "bottom";
        }
        const maximumClippingHeight = height - overflow.top - overflow.bottom;
        const maximumClippingWidth = width - overflow.left - overflow.right;
        const overflowAvailableHeight = min(height - overflow[heightSide], maximumClippingHeight);
        const overflowAvailableWidth = min(width - overflow[widthSide], maximumClippingWidth);
        const noShift = !state.middlewareData.shift;
        let availableHeight = overflowAvailableHeight;
        let availableWidth = overflowAvailableWidth;
        if ((_state$middlewareData = state.middlewareData.shift) != null && _state$middlewareData.enabled.x) {
          availableWidth = maximumClippingWidth;
        }
        if ((_state$middlewareData2 = state.middlewareData.shift) != null && _state$middlewareData2.enabled.y) {
          availableHeight = maximumClippingHeight;
        }
        if (noShift && !alignment) {
          const xMin = max(overflow.left, 0);
          const xMax = max(overflow.right, 0);
          const yMin = max(overflow.top, 0);
          const yMax = max(overflow.bottom, 0);
          if (isYAxis) {
            availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : max(overflow.left, overflow.right));
          } else {
            availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : max(overflow.top, overflow.bottom));
          }
        }
        yield apply(__spreadProps(__spreadValues({}, state), {
          availableWidth,
          availableHeight
        }));
        const nextDimensions = yield platform2.getDimensions(elements.floating);
        if (width !== nextDimensions.width || height !== nextDimensions.height) {
          return {
            reset: {
              rects: true
            }
          };
        }
        return {};
      });
    }
  };
};
function hasWindow() {
  return typeof window !== "undefined";
}
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || "").toLowerCase();
  }
  return "#document";
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (!hasWindow() || typeof ShadowRoot === "undefined") {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle$1(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !["inline", "contents"].includes(display);
}
function isTableElement(element) {
  return ["table", "td", "th"].includes(getNodeName(element));
}
function isTopLayer(element) {
  return [":popover-open", ":modal"].some((selector) => {
    try {
      return element.matches(selector);
    } catch (e2) {
      return false;
    }
  });
}
function isContainingBlock(elementOrCss) {
  const webkit = isWebKit();
  const css = isElement(elementOrCss) ? getComputedStyle$1(elementOrCss) : elementOrCss;
  return css.transform !== "none" || css.perspective !== "none" || (css.containerType ? css.containerType !== "normal" : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== "none" : false) || !webkit && (css.filter ? css.filter !== "none" : false) || ["transform", "perspective", "filter"].some((value) => (css.willChange || "").includes(value)) || ["paint", "layout", "strict", "content"].some((value) => (css.contain || "").includes(value));
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else if (isTopLayer(currentNode)) {
      return null;
    }
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  if (typeof CSS === "undefined" || !CSS.supports)
    return false;
  return CSS.supports("-webkit-backdrop-filter", "none");
}
function isLastTraversableNode(node) {
  return ["html", "body", "#document"].includes(getNodeName(node));
}
function getComputedStyle$1(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.scrollX,
    scrollTop: element.scrollY
  };
}
function getParentNode(node) {
  if (getNodeName(node) === "html") {
    return node;
  }
  const result = node.assignedSlot || node.parentNode || isShadowRoot(node) && node.host || getDocumentElement(node);
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    const frameElement = getFrameElement(win);
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}
function getFrameElement(win) {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}
function getCssDimensions(element) {
  const css = getComputedStyle$1(element);
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}
function unwrapElement(element) {
  return !isElement(element) ? element.contextElement : element;
}
function getScale(element) {
  const domElement = unwrapElement(element);
  if (!isHTMLElement(domElement)) {
    return createCoords(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? round(rect.width) : rect.width) / width;
  let y = ($ ? round(rect.height) : rect.height) / height;
  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}
const noOffsets = /* @__PURE__ */ createCoords(0);
function getVisualOffsets(element) {
  const win = getWindow(element);
  if (!isWebKit() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
    return false;
  }
  return isFixed;
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = createCoords(1);
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = getWindow(domElement);
    const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = getFrameElement(currentWin);
    while (currentIFrame && offsetParent && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle$1(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentWin = getWindow(currentIFrame);
      currentIFrame = getFrameElement(currentWin);
    }
  }
  return rectToClientRect({
    width,
    height,
    x,
    y
  });
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === "fixed";
  const documentElement = getDocumentElement(offsetParent);
  const topLayer = elements ? isTopLayer(elements.floating) : false;
  if (offsetParent === documentElement || topLayer && isFixed) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = createCoords(1);
  const offsets = createCoords(0);
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y
  };
}
function getClientRects(element) {
  return Array.from(element.getClientRects());
}
function getWindowScrollBarX(element, rect) {
  const leftScroll = getNodeScroll(element).scrollLeft;
  if (!rect) {
    return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
  }
  return rect.left + leftScroll;
}
function getDocumentRect(element) {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if (getComputedStyle$1(body).direction === "rtl") {
    x += max(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}
function getViewportRect(element, strategy) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isWebKit();
    if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x,
    y
  };
}
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === "viewport") {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === "document") {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = __spreadProps(__spreadValues({}, clippingAncestor), {
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y
    });
  }
  return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = getParentNode(element);
  if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
    return false;
  }
  return getComputedStyle$1(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
}
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle$1(element).position === "fixed";
  let currentNode = elementIsFixed ? getParentNode(element) : element;
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle$1(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === "fixed") {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && ["absolute", "fixed"].includes(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      result = result.filter((ancestor) => ancestor !== currentNode);
    } else {
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
}
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}
function getDimensions(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === "fixed";
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = createCoords(0);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  let htmlX = 0;
  let htmlY = 0;
  if (documentElement && !isOffsetParentAnElement && !isFixed) {
    const htmlRect = documentElement.getBoundingClientRect();
    htmlY = htmlRect.top + scroll.scrollTop;
    htmlX = htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect);
  }
  const x = rect.left + scroll.scrollLeft - offsets.x - htmlX;
  const y = rect.top + scroll.scrollTop - offsets.y - htmlY;
  return {
    x,
    y,
    width: rect.width,
    height: rect.height
  };
}
function isStaticPositioned(element) {
  return getComputedStyle$1(element).position === "static";
}
function getTrueOffsetParent(element, polyfill) {
  if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  let rawOffsetParent = element.offsetParent;
  if (getDocumentElement(element) === rawOffsetParent) {
    rawOffsetParent = rawOffsetParent.ownerDocument.body;
  }
  return rawOffsetParent;
}
function getOffsetParent(element, polyfill) {
  const win = getWindow(element);
  if (isTopLayer(element)) {
    return win;
  }
  if (!isHTMLElement(element)) {
    let svgOffsetParent = getParentNode(element);
    while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
      if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = getParentNode(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
    return win;
  }
  return offsetParent || getContainingBlock(element) || win;
}
const getElementRects = function(data) {
  return __async(this, null, function* () {
    const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
    const getDimensionsFn = this.getDimensions;
    const floatingDimensions = yield getDimensionsFn(data.floating);
    return {
      reference: getRectRelativeToOffsetParent(data.reference, yield getOffsetParentFn(data.floating), data.strategy),
      floating: {
        x: 0,
        y: 0,
        width: floatingDimensions.width,
        height: floatingDimensions.height
      }
    };
  });
};
function isRTL(element) {
  return getComputedStyle$1(element).direction === "rtl";
}
const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement,
  isRTL
};
function observeMove(element, onMove) {
  let io = null;
  let timeoutId;
  const root = getDocumentElement(element);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const {
      left,
      top,
      width,
      height
    } = element.getBoundingClientRect();
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = floor(top);
    const insetRight = floor(root.clientWidth - (left + width));
    const insetBottom = floor(root.clientHeight - (top + height));
    const insetLeft = floor(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: max(0, min(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1e3);
        } else {
          refresh(false, ratio);
        }
      }
      isFirstUpdate = false;
    }
    try {
      io = new IntersectionObserver(handleObserve, __spreadProps(__spreadValues({}, options), {
        root: root.ownerDocument
      }));
    } catch (e2) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  refresh(true);
  return cleanup;
}
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === "function",
    layoutShift = typeof IntersectionObserver === "function",
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...getOverflowAncestors(floating)] : [];
  ancestors.forEach((ancestor) => {
    ancestorScroll && ancestor.addEventListener("scroll", update, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener("resize", update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver((_ref) => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    resizeObserver.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && (nextRefRect.x !== prevRefRect.x || nextRefRect.y !== prevRefRect.y || nextRefRect.width !== prevRefRect.width || nextRefRect.height !== prevRefRect.height)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _resizeObserver2;
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.removeEventListener("scroll", update);
      ancestorResize && ancestor.removeEventListener("resize", update);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}
offset;
autoPlacement;
shift;
flip;
size;
hide;
arrow;
inline;
limitShift;
const computePosition = (reference, floating, options) => {
  const cache = /* @__PURE__ */ new Map();
  const mergedOptions = __spreadValues({
    platform
  }, options);
  const platformWithCache = __spreadProps(__spreadValues({}, mergedOptions.platform), {
    _c: cache
  });
  return computePosition$1(reference, floating, __spreadProps(__spreadValues({}, mergedOptions), {
    platform: platformWithCache
  }));
};
function P(l2, u2, e2) {
  let c2 = () => {
    var t2;
    return (t2 = e2 == null ? void 0 : e2.placement) != null ? t2 : "bottom";
  }, d = () => {
    var t2;
    return (t2 = e2 == null ? void 0 : e2.strategy) != null ? t2 : "absolute";
  }, [n2, o2] = createSignal({ x: null, y: null, placement: c2(), strategy: d(), middlewareData: {} }), [x, F] = createSignal();
  createEffect(() => {
    let t2 = x();
    if (t2)
      throw t2.value;
  });
  let s2 = createMemo(() => (l2(), u2(), {}));
  function i2() {
    let t2 = l2(), r = u2();
    if (t2 && r) {
      let a2 = s2();
      computePosition(t2, r, { middleware: e2 == null ? void 0 : e2.middleware, placement: c2(), strategy: d() }).then((m) => {
        a2 === s2() && o2(m);
      }, (m) => {
        F(m);
      });
    }
  }
  return createEffect(() => {
    let t2 = l2(), r = u2();
    if (e2 == null || e2.middleware, c2(), d(), t2 && r)
      if (e2 != null && e2.whileElementsMounted) {
        let a2 = e2.whileElementsMounted(t2, r, i2);
        a2 && onCleanup(a2);
      } else
        i2();
  }), { get x() {
    return n2().x;
  }, get y() {
    return n2().y;
  }, get placement() {
    return n2().placement;
  }, get strategy() {
    return n2().strategy;
  }, get middlewareData() {
    return n2().middlewareData;
  }, update: i2 };
}
const ConnectorContext = createContext();
const UniversalConnectorContext = createContext();
var _tmpl$$2 = /* @__PURE__ */ template$1(`<okxc-root data-tc-dropdown-container=true>`, true, false);
const AccountButton = () => {
  const theme = useTheme();
  const connector = useContext(ConnectorContext);
  const tonConnectUI = useContext(OKXConnectUiContext);
  const [isOpened, setIsOpened] = createSignal(false);
  const [account, setAccount] = createSignal(connector.account);
  const [restoringProcess, setRestoringProcess] = createSignal(!connector.account);
  let dropDownRef;
  const [floating, setFloating] = createSignal();
  const [anchor, setAnchor] = createSignal();
  const position = P(anchor, floating, {
    whileElementsMounted: autoUpdate,
    placement: "bottom-end"
  });
  const normalizedAddress = () => {
    const acc = account();
    if (acc) {
      const userFriendlyAddress = tonsdk.toUserFriendlyAddress(acc.address);
      return userFriendlyAddress.slice(0, 4) + "\u2026" + userFriendlyAddress.slice(-4);
    }
    return "";
  };
  tonConnectUI.connectionRestored.then(() => setRestoringProcess(false));
  const unsubscribe = connector.onStatusChange((wallet) => {
    if (!wallet) {
      setIsOpened(false);
      setAccount(null);
      setRestoringProcess(false);
      return;
    }
    setAccount(wallet.account);
    setRestoringProcess(false);
  });
  const onClick = (e2) => {
    if (!account() || !isOpened()) {
      return;
    }
    const clickToButton = anchor().contains(e2.target);
    const clickToDropdown = dropDownRef.contains(e2.target);
    if (!clickToButton && !clickToDropdown) {
      setIsOpened(false);
    }
  };
  onMount(() => {
    document.body.addEventListener("click", onClick);
  });
  onCleanup(() => {
    document.body.removeEventListener("click", onClick);
    unsubscribe();
  });
  return createComponent(Dynamic, {
    component: globalStylesTag,
    get children() {
      return [createComponent(Show, {
        get when() {
          return restoringProcess();
        },
        get children() {
          return createComponent(LoaderButtonStyled, {
            disabled: true,
            "data-tc-connect-button-loading": "true",
            get children() {
              return createComponent(LoaderIconStyled, {});
            }
          });
        }
      }), createComponent(Show, {
        get when() {
          return !restoringProcess();
        },
        get children() {
          return [createComponent(Show, {
            get when() {
              return !account();
            },
            get children() {
              return createComponent(AccountButtonStyled, {
                onClick: () => tonConnectUI.openModal(),
                "data-tc-connect-button": "true",
                scale: "s",
                get children() {
                  return [createComponent(TonIcon, {
                    get fill() {
                      return theme.colors.connectButton.foreground;
                    }
                  }), createComponent(Text, {
                    translationKey: "button.connectWallet",
                    fontSize: "15px",
                    lineHeight: "18px",
                    fontWeight: "590",
                    get color() {
                      return theme.colors.connectButton.foreground;
                    },
                    children: "Connect wallet"
                  })];
                }
              });
            }
          }), createComponent(Show, {
            get when() {
              return account();
            },
            get children() {
              return createComponent(DropdownContainerStyled, {
                get children() {
                  return [createComponent(DropdownButtonStyled, {
                    onClick: () => setIsOpened((v) => !v),
                    ref: setAnchor,
                    "data-tc-dropdown-button": "true",
                    scale: "s",
                    get children() {
                      return [createComponent(Text, {
                        fontSize: "15px",
                        fontWeight: "590",
                        lineHeight: "18px",
                        get children() {
                          return normalizedAddress();
                        }
                      }), createComponent(ArrowIcon, {
                        direction: "bottom"
                      })];
                    }
                  }), createComponent(Portal, {
                    get children() {
                      var _el$ = _tmpl$$2();
                      use(setFloating, _el$);
                      _el$.style.setProperty("z-index", "999");
                      _el$._$owner = getOwner();
                      insert(_el$, createComponent(Transition, {
                        onBeforeEnter: (el) => {
                          animate(el, [{
                            opacity: 0,
                            transform: "translateY(-8px)"
                          }, {
                            opacity: 1,
                            transform: "translateY(0)"
                          }], {
                            duration: 150
                          });
                        },
                        onExit: (el, done) => {
                          const a2 = animate(el, [{
                            opacity: 1,
                            transform: "translateY(0)"
                          }, {
                            opacity: 0,
                            transform: "translateY(-8px)"
                          }], {
                            duration: 150
                          });
                          a2.finished.then(done);
                        },
                        get children() {
                          return createComponent(Show, {
                            get when() {
                              return isOpened();
                            },
                            get children() {
                              return createComponent(DropdownStyled, {
                                get hidden() {
                                  return !isOpened();
                                },
                                onClose: () => setIsOpened(false),
                                ref(r$) {
                                  var _ref$ = dropDownRef;
                                  typeof _ref$ === "function" ? _ref$(r$) : dropDownRef = r$;
                                }
                              });
                            }
                          });
                        }
                      }));
                      createRenderEffect((_p$) => {
                        var _a2, _b2;
                        var _v$ = position.strategy, _v$2 = `${(_a2 = position.y) != null ? _a2 : 0}px`, _v$3 = `${(_b2 = position.x) != null ? _b2 : 0}px`;
                        _v$ !== _p$.e && ((_p$.e = _v$) != null ? _el$.style.setProperty("position", _v$) : _el$.style.removeProperty("position"));
                        _v$2 !== _p$.t && ((_p$.t = _v$2) != null ? _el$.style.setProperty("top", _v$2) : _el$.style.removeProperty("top"));
                        _v$3 !== _p$.a && ((_p$.a = _v$3) != null ? _el$.style.setProperty("left", _v$3) : _el$.style.removeProperty("left"));
                        return _p$;
                      }, {
                        e: void 0,
                        t: void 0,
                        a: void 0
                      });
                      return _el$;
                    }
                  })];
                }
              });
            }
          })];
        }
      })];
    }
  });
};
const [appState, setAppState] = createStore({
  buttonRootId: null,
  language: "en_US",
  returnStrategy: "none"
});
const StyledModal = styled(Modal)`
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;

  ${media("mobile")} {
    padding-left: 0;
    padding-right: 0;
    min-height: 364px;
  }
`;
const H1Styled$1 = styled(H1)`
  padding: 12px 64px;
`;
const MobileConnectionModalStyled$1 = styled.div``;
const BodyStyled$1 = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 325px;
  gap: 24px;
`;
const StyledIconButton = styled(IconButton)`
  position: absolute;
  top: 12px;
  left: 16px;
`;
const H2Styled = styled(H2)`
  margin-bottom: 0;
  padding: 16px 24px 24px 24px;
  min-height: 44px;
`;
const QrCodeWrapper = styled.div`
  margin-top: 24px;
  margin-left: 24px;
  margin-right: 24px;
`;
const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
function addReturnStrategy(url, strategy) {
  let returnStrategy;
  if (typeof strategy === "string") {
    returnStrategy = strategy;
  } else {
    returnStrategy = strategy.returnStrategy;
  }
  const newUrl = addQueryParameter(url, "ret", returnStrategy);
  if (!core.isTelegramUrl(url)) {
    return newUrl;
  }
  const lastParam = newUrl.slice(newUrl.lastIndexOf("&") + 1);
  return newUrl.slice(0, newUrl.lastIndexOf("&")) + "-" + core.encodeTelegramUrlParameters(lastParam);
}
function openLinkOnPhone(universalLink, deepLink) {
  if (isOS("android")) {
    openDeeplinkWithFallback(deepLink, () => {
    });
  } else {
    openLinkBlank(universalLink);
  }
}
function redirectToWallet(universalLink, deepLink, options, setOpenMethod) {
  if (!deepLink) {
    deepLink = core.standardDeeplink;
  }
  options = __spreadValues({}, options);
  if (isInTelegramBrowser()) {
    if (isOS("ios", "android")) {
      if (options.returnStrategy === "back") {
        options.returnStrategy = "tg://resolve";
      }
      setOpenMethod("universal-link");
      openLinkOnPhone(universalLink, deepLink);
    } else {
      setOpenMethod("universal-link");
      const linkWitStrategy = addReturnStrategy(universalLink, options.returnStrategy);
      openLinkBlank(linkWitStrategy);
    }
  } else if (isInTMA()) {
    if (isTmaPlatform("ios", "android")) {
      if (options.returnStrategy === "back") {
        options.returnStrategy = "tg://resolve";
      }
      setOpenMethod("universal-link");
      openLinkOnPhone(universalLink, deepLink);
    } else if (isTmaPlatform("macos", "tdesktop")) {
      if (options.returnStrategy === "back") {
        options.returnStrategy = "tg://resolve";
      }
      const linkWitStrategy = addReturnStrategy(universalLink, options.returnStrategy);
      const useDeepLink = !!deepLink && !options.forceRedirect;
      if (useDeepLink) {
        setOpenMethod("custom-deeplink");
        openDeeplinkWithFallback(toDeeplink(linkWitStrategy, deepLink), () => {
          setOpenMethod("universal-link");
          openLinkBlank(linkWitStrategy);
        });
      } else {
        setOpenMethod("universal-link");
        openLinkBlank(linkWitStrategy);
      }
    } else if (isTmaPlatform("weba")) {
      if (options.returnStrategy === "back") {
        if (isBrowser("safari")) {
          options.returnStrategy = location.href;
        } else if (isBrowser("chrome")) {
          options.returnStrategy = "googlechrome://";
        } else if (isBrowser("firefox")) {
          options.returnStrategy = "firefox://";
        } else if (isBrowser("opera")) {
          options.returnStrategy = "opera-http://";
        } else {
          options.returnStrategy = location.href;
        }
      }
      const linkWitStrategy = addReturnStrategy(universalLink, options.returnStrategy);
      const useDeepLink = !!deepLink && !options.forceRedirect;
      if (useDeepLink) {
        setOpenMethod("custom-deeplink");
        openDeeplinkWithFallback(toDeeplink(linkWitStrategy, deepLink), () => {
          setOpenMethod("universal-link");
          openLinkBlank(linkWitStrategy);
        });
      } else {
        setOpenMethod("universal-link");
        openLinkBlank(linkWitStrategy);
      }
    } else if (isTmaPlatform("web")) {
      if (options.returnStrategy === "back") {
        if (isBrowser("safari")) {
          options.returnStrategy = location.href;
        } else if (isBrowser("chrome")) {
          options.returnStrategy = "googlechrome://";
        } else if (isBrowser("firefox")) {
          options.returnStrategy = "firefox://";
        } else if (isBrowser("opera")) {
          options.returnStrategy = "opera-http://";
        } else {
          options.returnStrategy = location.href;
        }
      }
      const linkWitStrategy = addReturnStrategy(universalLink, options.returnStrategy);
      const useDeepLink = !!deepLink && !options.forceRedirect;
      if (useDeepLink) {
        setOpenMethod("custom-deeplink");
        openDeeplinkWithFallback(toDeeplink(linkWitStrategy, deepLink), () => {
          setOpenMethod("universal-link");
          openLinkBlank(linkWitStrategy);
        });
      } else {
        setOpenMethod("universal-link");
        openLinkBlank(linkWitStrategy);
      }
    } else {
      setOpenMethod("universal-link");
      const linkWitStrategy = addReturnStrategy(universalLink, options.returnStrategy);
      openLinkBlank(linkWitStrategy);
    }
  } else {
    if (isOS("ios")) {
      if (options.returnStrategy === "back") {
        if (isBrowser("safari")) {
          options.returnStrategy = "none";
        } else if (isBrowser("chrome")) {
          options.returnStrategy = "googlechrome://";
        } else if (isBrowser("firefox")) {
          options.returnStrategy = "firefox://";
        } else if (isBrowser("opera")) {
          options.returnStrategy = "opera-http://";
        } else {
          options.returnStrategy = location.href;
        }
      }
      setOpenMethod("universal-link");
      openLinkOnPhone(universalLink, deepLink);
    } else if (isOS("android")) {
      if (options.returnStrategy === "back") {
        if (isBrowser("chrome")) {
          options.returnStrategy = "googlechrome://";
        } else if (isBrowser("firefox")) {
          options.returnStrategy = "firefox://";
        } else if (isBrowser("opera")) {
          options.returnStrategy = "opera-http://";
        } else {
          options.returnStrategy = location.href;
        }
      }
      setOpenMethod("universal-link");
      core.logDebug("url-strategy-helpers 489");
      openLinkOnPhone(universalLink, deepLink);
    } else if (isOS("ipad")) {
      if (options.returnStrategy === "back") {
        if (isBrowser("safari")) {
          options.returnStrategy = "none";
        } else if (isBrowser("chrome")) {
          options.returnStrategy = "googlechrome://";
        } else if (isBrowser("firefox")) {
          options.returnStrategy = "firefox://";
        } else if (isBrowser("opera")) {
          options.returnStrategy = "opera-http://";
        } else {
          options.returnStrategy = location.href;
        }
      }
      openLinkOnPhone(universalLink, deepLink);
    } else if (isOS("macos", "windows", "linux")) {
      if (options.returnStrategy === "back") {
        if (isBrowser("safari")) {
          options.returnStrategy = "none";
        } else if (isBrowser("chrome")) {
          options.returnStrategy = "googlechrome://";
        } else if (isBrowser("firefox")) {
          options.returnStrategy = "firefox://";
        } else if (isBrowser("opera")) {
          options.returnStrategy = "opera-http://";
        } else {
          options.returnStrategy = "none";
        }
      }
      const linkWitStrategy = addReturnStrategy(universalLink, options.returnStrategy);
      const useDeepLink = !!deepLink && !options.forceRedirect;
      if (useDeepLink) {
        setOpenMethod("custom-deeplink");
        openDeeplinkWithFallback(toDeeplink(linkWitStrategy, deepLink), () => {
          setOpenMethod("universal-link");
          openLinkBlank(linkWitStrategy);
        });
      } else {
        setOpenMethod("universal-link");
        openLinkBlank(linkWitStrategy);
      }
    } else {
      setOpenMethod("universal-link");
      openLinkBlank(addReturnStrategy(universalLink, options.returnStrategy));
    }
  }
}
function addQueryParameter(url, key, value) {
  const parsed = new URL(url);
  parsed.searchParams.append(key, value);
  return parsed.toString();
}
const imageUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAACE4AAAhOAFFljFgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAleSURBVHgB7V27chNJFG3LPGweLhkDZV7l2S9Yk5FhZ2TY4UaGbDPwFxhHSwZkZLa/wHZGJpGx0Wq/YIcqMK7iJYN5G7TnNH1Fe/TW9IzGUp+qUc+MJXl0T/e5/bw9pDKKIAjye3t705VKZRqXU0gD3saRHxoayuM6b78f98q4V0YaSorbT5GWDh06VArDsKwyiCGVEdDg3759m8PpVRhwRv00tkuUSAbSx4cPHy6CkFBlAD0lwBj9Bk6vG6NXgWv1/ft3hb/r48ePHzrlfZ7zsJHL5fQxPDxcTXnA2OrIkSM1/xtkFJGs9ZqMnhBw8eLFGRhyyTY6DUsDf/78WX358kWfu8TRo0c1GSMjI/UI2cCxtrW1taFSRmoESG6HoW8pIy9i9A8fPmijR3N1UmAJISGjo6OaEAshSsby8+fPV1VKSIUA5PhbMPYdcZyUlo8fP2rDp2X0RqBMkYyTJ0/qc4PUiEiUAEoNDLyiTI7/+vWrev/+vc7tWcSxY8dSJyIRAiA3AYx9D6es1egcXy6XM2v4KKJEgIRV+I/lJJz1sHKMCxcuLCDX05mxDq92d3fVmzdvNAkHBeKX+PzGYU/j+efGxsZ2UIJLyiGcEUAne/z48b/w0HdxOUK5ef36ta7VHFTwN3z69Ek7bZQA+i+SkJ+YmPgbJdrJD3MiQUZyCjxlrnn37p3OQf2EEydOaFmCHPEyRMmYdSFJsQmA5LCroMAaDmXm1atXB0puOgF9wunTp8U30EHPw0HHkqRYEkS9h+Ef4XSEUkOt73W1MkmwdFOS0LfEg5L0JyQphF/4V3WJrgkwdfuHPGfVcmdnRz9gv0NIINh+AOYgTzuobDxRXaArAmh85PT7PKfxeQwa6KAJkgAputYtCR0TYGSnmvMH0fiCKAndyFFHTpgOF8b/h+eDbnwbrB3xIEDE5U4cc67dN7KqCeOv89wbfz9se8BGBdqq3c+2RQAbWVLPZ23HG78WtIlpdGpb0WbtfK4tAtA0X0ISSJ+OR33QNqYNFBibtURLJwzdZx/+XVa/Xr582df1/LigjVgK0CXDyyvtOOWmJcDovmaS3QvttnDX19f1w8Q5+B2ukObz0EaWP7jfyh80rQUh96/gS25w8KQT6XHVIDP9LrHRi+dhl4XpSd3AUOd8o/c1LAFGenh4p9sF3r59K8TPcWCq0fsaEtCN9Hj8Am3GsRDCjArWRV0CmPuVqfX0W7dymqBySK3o3Llzt+u9py4Bkvu99MSH+E74j6V6bYMaAuzcT+frEQ8cBzd9Rnmc34j+vYYAn/vdQ2yJUnAr+rd9BFy6dImzGHzudwyWAvEF0RrRPgKQ+xeY+tzvHpKhRWEEVQLYYkN1Sc/jOSjzdw4SZJoL58PazrhKADqPZpiyL8PX+91DZncTtjO2JUjLj9f+5CBtqlwud13uaQJMp9sMz2WYzcM9KO1RGdIEiPzQ+L67OTnYMmRWA1Ul6CpfZLqFR3KQqZooBdrmQgBnt6m9vT3lkSwsiZ/hS45aZFYiOqt+bmzEX+nj4jtcfper5yEBpps60H6ALbPz589XMIDAu5k6VlY4HhQPhUIhc7/r7NmzFdqcth9C59ttPOc9VpE4vTBLyNrImivk83m9CAS/b5E+IOBNr//pQWyN9kCQQ+6Y4oVv/aYHqeqjBAS5ilm56Kq4e7SGpTZTJCCI3PRIGJba5ClBvgSkDMvW+aoE+S6I9GDZOt/27GiPZOAJ6DE8AT0GnbCeuMLFyB7pwLJ1mU5YE5C15no/w7J12ZeAHoDrjAnGtcuZ4HY6mpRHOpDMDvXZoQQ95YWXoPRghcEJSUXIC18C0oMQgAaZliC9pjWLBKytram4KBaLKmsQW4OIkl6CytGZyclJZyM+6+vrlbjgd/Tr89DePGh7Lfy4+A9JwFWQLsJFVvwasYZgWIOJiQmelra2ti5L3fMxX+oFOPVwC0vqtfRrAkwUWR1H0yNZSJxS2Fxnek0AWNFzLthA8A2y5EDbispgUKao7/GFkcVZCuw3eLiHCfCkFWd7ezvkuZ3dN/nC4HQeyYBTUQyq9esqAZChVaZehpIB7SolQOSHqFraliETbMLDISxp3xT5IfZldcZJZmoVFQ9HkIhawKp9fx8Bz549KyIJJaK4hxswQ0us0egeBTVij1LwgKnFmEdMWPHklqN/qyGAzpiDNNQsXwriw8799cLg1xBgdhvSTHEWr0c8NMv9+n6jD0oHXTcREn1n3E+wTTU2NsZTav9v9d7TsMKP6uhNpqySyhimR/ugzVrlfqIhAaZGtMF2gZeizmGFul9ttgVK0yYvhswWxSF30jgb9DVilB7TsxzChsvN3ttS1EzsuBVOKOXeAH4ae3NQes6cOaNzP46brTYAahk3lHumwJGM48uusC+ba4krfip7XVCuGS2RKdtTMP7dlp9RbQBtgzvKtJC9P2gM2kbq/MZmLdEWAWwbQIJm6Q9YCnwruRa0iRntou7Ptrt7a9v9zqYHb1b+mSfhFyLh6+ft3s5W6GgDB/iDbfgDzqSbk26KQY+uEjE+ne6jTj7f8Q4axilzRfe1QSfBNj4qJoto7T5UHaKrPWRAwpNBJyFq/BcvXtxXXaDrXZQMCVU54nwXCUjUz2AVc3x8vNowpex0k/MFTjZyq/zc2kSHu+T2hf3aWGMji7PaWNU06ypm427k5qS7cXJyMkDOKOCUkRd172m/b2XIqmYntZ1GcLKZ5+7ubhk5Yw0PNSotZuYWloSDvv6Yv+PUqVN6YMV0LzxA39gf6KzcVg7gfFWG6TtaUn1QGpjjmfON4Sk5i643d3a+nzCrqXBQm3hg9h9NszSY2DhOZl6nAVYq2KfDZzeSs4HMNI+aTlE5RqLrkuzSwGvZXyWrsUllb3lrDk/IgSkzNpIIUlkY1ogIth16XWOSiWjW4LmWG/bjd1u37wSprsyLEkEwjCNLRJoxS2USMvWd7RdrrJd7BD/gzJB2O9PioidLIxkmH6VgAadz9n2SQELoK1wHEKehKTHU9YjR9WxljtsmKTWN0NO1qWw/oNjP4HShYkIn2yAhJIOSRamiI+c5S0q0tDBXm4EQbWCzD7xsvlwzo8EsStlMM7fXQ2YWBwsZJALG+b1iYpk6RGiM/pgLUnppdBuZXZ3NFYTI9dOGCAYXn2J0L6SBSfcNzdFx4l7ZpDQ2+6mYllACSlkxeBT/A6Mt6rTZ7SrDAAAAAElFTkSuQmCC";
var _tmpl$$1 = /* @__PURE__ */ template$1(`<svg><path fill-rule=evenodd clip-rule=evenodd d="M96 51C96 75.8528 75.8528 96 51 96C26.1472 96 6 75.8528 6 51C6 26.1472 26.1472 6 51 6C75.8528 6 96 26.1472 96 51ZM102 51C102 79.1665 79.1665 102 51 102C22.8335 102 0 79.1665 0 51C0 22.8335 22.8335 0 51 0C79.1665 0 102 22.8335 102 51Z"fill-opacity=0.2></svg>`, false, true), _tmpl$2 = /* @__PURE__ */ template$1(`<svg><path fill-rule=evenodd clip-rule=evenodd d="M6 51H0C0 79.1665 22.8335 102 51 102V96C26.1472 96 6 75.8528 6 51Z"></svg>`, false, true);
const OKXLoaderIconWithLogo = (_) => {
  return createComponent(LoaderContainerStyled$1, {
    get children() {
      return [createComponent(LoaderStyled, {}), createComponent(OKIconStyle, {
        src: imageUrl
      })];
    }
  });
};
const OKXIconWithLogo = (_) => {
  return createComponent(LoaderContainerStyled$1, {
    get children() {
      return createComponent(OKIconStyle, {
        src: imageUrl
      });
    }
  });
};
const OKXLoaderIcon = (_) => {
  const theme = useTheme();
  const rotateAnimation = h`
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    `;
  const RotatingSVG = styled.svg`
    animation: ${rotateAnimation} 2s linear infinite;
    transform-origin: center;
  `;
  return createComponent(RotatingSVG, {
    xmlns: "http://www.w3.org/2000/svg",
    width: "102",
    height: "102",
    viewBox: "0 0 102 102",
    fill: "none",
    get children() {
      return [(() => {
        var _el$ = _tmpl$$1();
        createRenderEffect(() => setAttribute(_el$, "fill", theme.colors.text.primary));
        return _el$;
      })(), (() => {
        var _el$2 = _tmpl$2();
        createRenderEffect(() => setAttribute(_el$2, "fill", theme.colors.text.primary));
        return _el$2;
      })()];
    }
  });
};
const LoaderContainerStyled$1 = styled.div`
  position: relative;
  height: 102px;
  width: 102px;
`;
const LoaderStyled = styled(OKXLoaderIcon)`
  height: 102px;
  width: 102px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const OKIconStyle = styled(Image)`
  position: absolute;
  width: 86px;
  height: 86px;
  border-radius: 44px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const MobileConnectionQR = (props) => {
  return [createComponent(H1Styled$1, {
    translationKey: "walletModal.mobileConnectionModal.OKXConnect"
  }), createComponent(QrCodeWrapper, {
    get children() {
      return [createComponent(Show, {
        get when() {
          return props.universalLink === null;
        },
        get children() {
          return createComponent(LoaderWrapper, {
            get children() {
              return createComponent(OKXLoaderIconWithLogo, {});
            }
          });
        }
      }), createComponent(Show, {
        get when() {
          return props.universalLink !== null;
        },
        get children() {
          return createComponent(QRCode, {
            imageUrl,
            get sourceUrl() {
              return addReturnStrategy(props.universalLink, "none");
            },
            disableCopy: true
          });
        }
      })];
    }
  }), createComponent(H2Styled, {
    translationKey: "walletModal.mobileConnectionModal.scanQR",
    get translationValues() {
      return {
        name: props.walletInfo.name
      };
    },
    get children() {
      return ["Scan the QR code below with your phone\u2019s or ", createMemo(() => props.walletInfo.name), "\u2019s camera"];
    }
  })];
};
styled(H1)`
  padding: 12px 64px;
`;
const H1StyledMaxWidth = styled(H1)`
  max-width: 262px;
`;
const H1StyledRetry = styled(H1StyledMaxWidth)`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text.primary};
`;
const RetryButtonStyle = styled(Button)`
  background-color: transparent;
  color: ${(props) => props.theme.colors.text.primary};
  padding: 0px;
`;
const LoaderContainerStyled = styled.div`
  margin: 30px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;

  ${media("mobile")} {
    height: 160px;
    align-items: center;
  }
`;
const ErrorIconStyled = styled(ErrorIcon)`
  margin-bottom: 16px;
`;
const ButtonsContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;
const ButtonsQRContainerStyled = styled.div`
  background-color: ${(props) => props.theme.colors.text.primary};
  height: 48px;
  width: 262px;
  justify-content: center;
  border-radius: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
`;
const TextStyled$1 = styled(Text)`
  max-width: 262px;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  margin-top: 10px;
  color: ${(props) => props.theme.colors.text.contrast};
`;
const ContainedButton = styled(Button)`
  height: 48px;
  width: 262px;
  border-radius: 999px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 24px;
`;
const ContainedPrimaryButton = styled(ContainedButton)`
  background-color: ${(props) => props.theme.colors.text.primary};
`;
styled(ContainedButton)`
  background-color: transparent;
  border-color: ${(props) => props.theme.colors.border.secondary};
  border-width: 0.5px;
  border-style: solid;
`;
const ContainedPrimaryButtonText = styled(H1StyledMaxWidth)`
  font-size: 14px;
  color: ${(props) => props.theme.colors.background.primary};
`;
styled(H1StyledMaxWidth)`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text.primary};
`;
const FooterStyled = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-top: 0.5px solid
    ${(props) => rgba(props.theme.colors.icon.secondary, 0.2)};
  margin-top: 32px;
`;
const ImageStyled = styled(Image)`
  width: 32px;
  height: 32px;
  border-radius: 16px;
`;
const FooterButton = styled(Link)`
  margin-left: auto;
  display: flex;
`;
const FooterButtonCenter = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
`;
const ConnectAppTgModalPage = (props) => {
  return [createComponent(ButtonsContainerStyled, {
    get children() {
      return [createComponent(OKXIconWithLogo, {}), createComponent(TextStyled$1, {
        translationKey: "walletModal.mobileConnectionModal.appAndTelegram.text",
        children: "OKX Wallet supports OKX app and Telegram Mini Apps"
      })];
    }
  }), createComponent(ButtonsContainerStyled, {
    get children() {
      return [createComponent(ContainedPrimaryButton, {
        get onClick() {
          return props.onConnectApp;
        },
        get children() {
          return createComponent(ContainedPrimaryButtonText, {
            translationKey: "walletModal.mobileConnectionModal.connectApp",
            children: "Connect to OKX app"
          });
        }
      }), createComponent(ContainedPrimaryButton, {
        get onClick() {
          return props.onConnectMini;
        },
        get children() {
          return createComponent(ContainedPrimaryButtonText, {
            translationKey: "walletModal.mobileConnectionModal.connectMini",
            children: "Connect to Mini Apps"
          });
        }
      })];
    }
  })];
};
const LoadingModalPage = (props) => {
  return createComponent(LoaderContainerStyled, {
    get children() {
      return [createComponent(OKXLoaderIconWithLogo, {}), createComponent(Show, {
        get when() {
          return props.loadingTextTranslationKey || props.loadingTextTranslationKey;
        },
        get children() {
          return createComponent(H1StyledMaxWidth, {
            get translationKey() {
              return props.loadingTextTranslationKey;
            },
            get children() {
              return props.loadingText;
            }
          });
        }
      })];
    }
  });
};
const Translation = (props) => {
  const [t2] = useI18n();
  return createMemo(() => {
    var _a2;
    return t2(props.translationKey, props.translationValues, (_a2 = props.children) == null ? void 0 : _a2.toString());
  });
};
var _tmpl$ = /* @__PURE__ */ template$1(`<svg width=40 height=12 viewBox="0 0 40 12"fill=none xmlns=http://www.w3.org/2000/svg><g clip-path=url(#clip0_4356_43883)><path d="M11.7336 0H0.269322C0.198282 0 0.130151 0.0282212 0.0799182 0.0784542C0.0296852 0.128687 0.00146484 0.196817 0.00146484 0.267857V11.7321C0.00146484 11.8032 0.0296852 11.8713 0.0799182 11.9215C0.130151 11.9718 0.198282 12 0.269322 12H11.7336C11.8046 12 11.8728 11.9718 11.923 11.9215C11.9732 11.8713 12.0015 11.8032 12.0015 11.7321V0.267857C12.0015 0.196817 11.9732 0.128687 11.923 0.0784542C11.8728 0.0282212 11.8046 0 11.7336 0ZM8.00129 7.73303C8.00129 7.80407 7.97307 7.87221 7.92283 7.92244C7.8726 7.97267 7.80447 8.00089 7.73343 8.00089H4.26736C4.19632 8.00089 4.12819 7.97267 4.07795 7.92244C4.02772 7.87221 3.9995 7.80407 3.9995 7.73303V4.26643C3.9995 4.19539 4.02772 4.12726 4.07795 4.07702C4.12819 4.02679 4.19632 3.99857 4.26736 3.99857H7.73343C7.80447 3.99857 7.8726 4.02679 7.92283 4.07702C7.97307 4.12726 8.00129 4.19539 8.00129 4.26643V7.73303Z"></path><path d="M35.7391 4.00018H32.2725C32.2015 4.00018 32.1333 4.0284 32.0831 4.07864C32.0329 4.12887 32.0046 4.197 32.0046 4.26804V7.73465C32.0046 7.80569 32.0329 7.87382 32.0831 7.92405C32.1333 7.97428 32.2015 8.0025 32.2725 8.0025H35.7391C35.8101 8.0025 35.8783 7.97428 35.9285 7.92405C35.9787 7.87382 36.007 7.80569 36.007 7.73465V4.26697C36.0067 4.19611 35.9783 4.12826 35.9281 4.07826C35.8779 4.02825 35.81 4.00018 35.7391 4.00018Z"></path><path d="M31.7379 0H28.2713C28.2002 0 28.1321 0.0282212 28.0819 0.0784542C28.0316 0.128687 28.0034 0.196817 28.0034 0.267857V3.73446C28.0034 3.8055 28.0316 3.87364 28.0819 3.92387C28.1321 3.9741 28.2002 4.00232 28.2713 4.00232H31.7379C31.8089 4.00232 31.8771 3.9741 31.9273 3.92387C31.9775 3.87364 32.0057 3.8055 32.0057 3.73446V0.267857C32.0057 0.196817 31.9775 0.128687 31.9273 0.0784542C31.8771 0.0282212 31.8089 0 31.7379 0Z"></path><path d="M39.7376 0H36.271C36.2 0 36.1319 0.0282212 36.0816 0.0784542C36.0314 0.128687 36.0032 0.196817 36.0032 0.267857V3.73446C36.0032 3.8055 36.0314 3.87364 36.0816 3.92387C36.1319 3.9741 36.2 4.00232 36.271 4.00232H39.7376C39.8087 4.00232 39.8768 3.9741 39.927 3.92387C39.9773 3.87364 40.0055 3.8055 40.0055 3.73446V0.267857C40.0055 0.232682 39.9986 0.19785 39.9851 0.165352C39.9716 0.132854 39.9519 0.103327 39.927 0.0784542C39.9022 0.0535813 39.8726 0.0338512 39.8401 0.0203901C39.8076 0.00692902 39.7728 0 39.7376 0Z"></path><path d="M31.7379 7.99982H28.2713C28.2002 7.99982 28.1321 8.02804 28.0819 8.07827C28.0316 8.1285 28.0034 8.19663 28.0034 8.26767V11.7321C28.0034 11.8032 28.0316 11.8713 28.0819 11.9215C28.1321 11.9718 28.2002 12 28.2713 12H31.7379C31.8089 12 31.8771 11.9718 31.9273 11.9215C31.9775 11.8713 32.0057 11.8032 32.0057 11.7321V8.2666C32.0055 8.19575 31.9771 8.12789 31.9269 8.07789C31.8767 8.02789 31.8087 7.99982 31.7379 7.99982Z"></path><path d="M39.7376 7.99982H36.271C36.2 7.99982 36.1319 8.02804 36.0816 8.07827C36.0314 8.1285 36.0032 8.19663 36.0032 8.26767V11.7321C36.0032 11.8032 36.0314 11.8713 36.0816 11.9215C36.1319 11.9718 36.2 12 36.271 12H39.7376C39.8087 12 39.8768 11.9718 39.927 11.9215C39.9773 11.8713 40.0055 11.8032 40.0055 11.7321V8.2666C40.0052 8.19575 39.9769 8.12789 39.9267 8.07789C39.8765 8.02789 39.8085 7.99982 39.7376 7.99982Z"></path><path d="M25.733 0H22.2664C22.1954 0 22.1272 0.0282212 22.077 0.0784542C22.0268 0.128687 21.9985 0.196817 21.9985 0.267857V3.73446C21.9985 3.8055 22.0268 3.87364 22.077 3.92387C22.1272 3.9741 22.1954 4.00232 22.2664 4.00232H25.733C25.804 4.00232 25.8722 3.9741 25.9224 3.92387C25.9726 3.87364 26.0009 3.8055 26.0009 3.73446V0.267857C26.0009 0.196817 25.9726 0.128687 25.9224 0.0784542C25.8722 0.0282212 25.804 0 25.733 0Z"></path><path d="M25.733 7.99982H22.2664C22.1954 7.99982 22.1272 8.02804 22.077 8.07827C22.0268 8.1285 21.9985 8.19663 21.9985 8.26767V11.7321C21.9985 11.8032 22.0268 11.8713 22.077 11.9215C22.1272 11.9718 22.1954 12 22.2664 12H25.733C25.804 12 25.8722 11.9718 25.9224 11.9215C25.9726 11.8713 26.0009 11.8032 26.0009 11.7321V8.2666C26.0006 8.19575 25.9722 8.12789 25.922 8.07789C25.8718 8.02789 25.8039 7.99982 25.733 7.99982Z"></path><path d="M21.9996 4.26375C21.9996 4.19271 21.9714 4.12458 21.9212 4.07435C21.8709 4.02411 21.8028 3.99589 21.7317 3.99589H17.9994V0.267857C17.9994 0.196817 17.9712 0.128687 17.921 0.0784542C17.8707 0.0282212 17.8026 0 17.7316 0H14.2687C14.1977 0 14.1295 0.0282212 14.0793 0.0784542C14.0291 0.128687 14.0009 0.196817 14.0009 0.267857V11.7273C14.0009 11.7984 14.0291 11.8665 14.0793 11.9167C14.1295 11.967 14.1977 11.9952 14.2687 11.9952H17.7353C17.8064 11.9952 17.8745 11.967 17.9247 11.9167C17.975 11.8665 18.0032 11.7984 18.0032 11.7273V7.99661H21.7366C21.8076 7.99661 21.8757 7.96839 21.926 7.91815C21.9762 7.86792 22.0044 7.79979 22.0044 7.72875L21.9996 4.26375Z"></path></g><defs><clipPath id=clip0_4356_43883><rect width=40.0039 height=12 fill=white>`);
const OKXLogo = (props) => {
  const theme = useTheme();
  const fill = () => props.fill || theme.colors.disable;
  return (() => {
    var _el$ = _tmpl$(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, _el$5 = _el$4.nextSibling, _el$6 = _el$5.nextSibling, _el$7 = _el$6.nextSibling, _el$8 = _el$7.nextSibling, _el$9 = _el$8.nextSibling, _el$10 = _el$9.nextSibling, _el$11 = _el$10.nextSibling;
    createRenderEffect((_p$) => {
      var _v$ = fill(), _v$2 = fill(), _v$3 = fill(), _v$4 = fill(), _v$5 = fill(), _v$6 = fill(), _v$7 = fill(), _v$8 = fill(), _v$9 = fill();
      _v$ !== _p$.e && setAttribute(_el$3, "fill", _p$.e = _v$);
      _v$2 !== _p$.t && setAttribute(_el$4, "fill", _p$.t = _v$2);
      _v$3 !== _p$.a && setAttribute(_el$5, "fill", _p$.a = _v$3);
      _v$4 !== _p$.o && setAttribute(_el$6, "fill", _p$.o = _v$4);
      _v$5 !== _p$.i && setAttribute(_el$7, "fill", _p$.i = _v$5);
      _v$6 !== _p$.n && setAttribute(_el$8, "fill", _p$.n = _v$6);
      _v$7 !== _p$.s && setAttribute(_el$9, "fill", _p$.s = _v$7);
      _v$8 !== _p$.h && setAttribute(_el$10, "fill", _p$.h = _v$8);
      _v$9 !== _p$.r && setAttribute(_el$11, "fill", _p$.r = _v$9);
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
      r: void 0
    });
    return _el$;
  })();
};
const ModalFooter = (props) => {
  const theme = useTheme();
  return [createComponent(FooterStyled, {
    get children() {
      return [createComponent(ImageStyled, {
        src: imageUrl
      }), createComponent(H3, {
        get children() {
          return props.wallet.name;
        }
      }), createComponent(FooterButton, {
        get href() {
          return props.wallet.aboutUrl;
        },
        blank: true,
        get children() {
          return [createComponent(Text, {
            get color() {
              return theme.colors.text.contrast;
            },
            get children() {
              return createComponent(Translation, {
                translationKey: "common.get",
                children: "GET"
              });
            }
          }), createComponent(ArrowIcon, {
            direction: "right"
          })];
        }
      })];
    }
  }), createComponent(FooterButtonCenter, {
    get children() {
      return [createComponent(Text, {
        get color() {
          return theme.colors.disable;
        },
        get children() {
          return createComponent(Translation, {
            translationKey: "walletModal.mobileConnectionModal.PoweredBy",
            children: "PoweredBy"
          });
        }
      }), createComponent(OKXLogo, {})];
    }
  })];
};
const ModalRetryButton = (props) => {
  return createComponent(RetryButtonStyle, {
    get leftIcon() {
      return createComponent(RetryIcon, {});
    },
    get onClick() {
      return props.onRetry;
    },
    get children() {
      return createComponent(H1StyledRetry, {
        translationKey: "common.retry",
        children: "Retry"
      });
    }
  });
};
const ConnectionDeclinedModalPage = (props) => {
  return [createComponent(ErrorIconStyled, {
    size: "s"
  }), createComponent(H1StyledMaxWidth, {
    translationKey: "walletModal.mobileConnectionModal.connectionDeclined",
    children: "Connection declined"
  }), createComponent(ButtonsContainerStyled, {
    get children() {
      return createComponent(ModalRetryButton, {
        get onRetry() {
          return props.onRetry;
        }
      });
    }
  })];
};
const ContinueInWalletModalPage = (props) => {
  const theme = useTheme();
  return [createComponent(ButtonsContainerStyled, {
    get children() {
      return [createComponent(OKXLoaderIconWithLogo, {}), createComponent(H1StyledMaxWidth, {
        translationKey: "walletModal.mobileConnectionModal.continueIn",
        children: "Continue the transaction in OKX Wallet"
      })];
    }
  }), createComponent(ButtonsContainerStyled, {
    get children() {
      return [createComponent(ButtonsQRContainerStyled, {
        get onClick() {
          return props.onOpenQR;
        },
        get children() {
          return [createComponent(QRIcon, {
            get fill() {
              return theme.colors.background.primary;
            }
          }), createComponent(ContainedPrimaryButtonText, {
            translationKey: "walletModal.mobileConnectionModal.showQR",
            children: "Show QR Codes"
          })];
        }
      }), createComponent(ModalRetryButton, {
        get onRetry() {
          return props.onRetry;
        }
      })];
    }
  })];
};
const MobileConnectionModal = (props) => {
  useTheme();
  const [firstClick, setFirstClick] = createSignal(true);
  const [showQR, setShowQR] = createSignal(false);
  const [connectClicked, setConnectClicked] = createSignal(false);
  const showAppAndTgState = createMemo(() => !props.isSingleWallet && !connectClicked());
  const [connectionErrored, setConnectionErrored] = createSignal(false);
  const connector = useContext(ConnectorContext);
  const [appDeepLink, setAppDeepLink] = createSignal(null);
  const [miniUniversalLink, setMiniUniversalLink] = createSignal(null);
  const [qrLink, setQrLink] = createSignal(null);
  const okxConnectUI = useContext(OKXConnectUiContext);
  const unsubscribe = connector == null ? void 0 : connector.onStatusChange(() => {
  }, () => {
    setConnectionErrored(true);
    const info = props.lastSelectedWalletInfo;
    if (info && info.openMethod && info.openMethod === "qrcode") {
      if (showQR()) {
        onCloseQR();
      }
    }
  });
  createEffect(() => {
    var _a2, _b2;
    var info = props.universalLinkParams();
    if (info) {
      props.setLastSelectedWalletInfo(__spreadProps(__spreadValues({}, props.wallet), {
        openMethod: "universal-link"
      }));
      core.logDebug(`createEffect  ${JSON.stringify(info)}`);
      var connectRequest = info.connectRequest;
      var tonConnectRequest = info.tonConnectRequest;
      if (!tonConnectRequest) {
        tonConnectRequest = connectRequest;
      }
      if (connectRequest) {
        var encodeParams = core.encodeConnectParams(__spreadProps(__spreadValues({}, tonConnectRequest), {
          redirect: "none"
        }));
        var qrLink2 = core.getUniversalLink(core.getAppWalletDeepLink(encodeParams));
        setQrLink(qrLink2);
        var appConnectEncodeParams = core.encodeConnectParams(__spreadProps(__spreadValues({}, tonConnectRequest), {
          redirect: (_a2 = info.redirect) != null ? _a2 : "none"
        }));
        var appDeepLink2 = core.getAppWalletDeepLink(appConnectEncodeParams);
        setAppDeepLink(appDeepLink2);
        var encodeTGParams = core.encodeTWAConnectURLParams(__spreadProps(__spreadValues({}, connectRequest), {
          redirect: "none"
        }));
        var tgUrl = core.getTelegramWalletTWAUrl(encodeTGParams, (_b2 = info.tmaReturnUrl) != null ? _b2 : "back");
        setMiniUniversalLink(tgUrl);
        core.logDebug(`setUniversalLink  ${appDeepLink2}   tgUrl  ${tgUrl}    qrLink ${qrLink2}`);
      }
    }
  });
  onMount(() => __async(exports, null, function* () {
    try {
      yield props.connect().catch((error) => core.logDebug(`MobileConnectionModal onMount error ${JSON.stringify(error)}`));
    } catch (error) {
      console.error("Error while connecting:", error);
    }
  }));
  const onRetry = () => {
    setConnectionErrored(false);
    setConnectClicked(false);
    !firstClick();
    setFirstClick(false);
    try {
      props.connect();
    } catch (error) {
      console.error("Error while connecting:", error);
    }
  };
  const onOpenQR = () => {
    setConnectionErrored(false);
    setShowQR(true);
    props.setLastSelectedWalletInfo(__spreadProps(__spreadValues({}, props.wallet), {
      openMethod: "qrcode"
    }));
  };
  const onCloseQR = () => {
    setShowQR(false);
    props.setLastSelectedWalletInfo(__spreadProps(__spreadValues({}, props.wallet), {
      openMethod: "universal-link"
    }));
  };
  const onBack = () => {
    if (showQR()) {
      onCloseQR();
    } else {
      props.onBackClick();
    }
  };
  const onConnectApp = () => {
    setConnectClicked(true);
    core.openOKXDeeplinkWithFallback(appDeepLink());
  };
  const onConnectMini = () => {
    okxConnectUI == null ? void 0 : okxConnectUI.closeModal();
    core.openOKXTMAWalletlinkWithFallback(miniUniversalLink());
  };
  if (unsubscribe) {
    onCleanup(unsubscribe);
  }
  return createComponent(MobileConnectionModalStyled$1, {
    "data-tc-wallets-modal-connection-mobile": "true",
    get children() {
      return [createComponent(Show, {
        get when() {
          return !props.backDisabled || showQR();
        },
        get children() {
          return createComponent(StyledIconButton, {
            icon: "arrow",
            onClick: onBack
          });
        }
      }), createComponent(Show, {
        get when() {
          return props.universalLinkParams() === null;
        },
        get children() {
          return [createComponent(H1Styled$1, {
            children: "OKX Connect"
          }), createComponent(LoadingModalPage, {}), createComponent(ModalFooter, {
            get wallet() {
              return props.wallet;
            }
          })];
        }
      }), createComponent(Show, {
        get when() {
          return props.universalLinkParams() !== null;
        },
        get children() {
          return [createComponent(Show, {
            get when() {
              return showQR();
            },
            get children() {
              return createComponent(MobileConnectionQR, {
                get universalLink() {
                  return qrLink();
                },
                get walletInfo() {
                  return props.wallet;
                }
              });
            }
          }), createComponent(Show, {
            get when() {
              return !showQR();
            },
            get children() {
              return [createComponent(H1Styled$1, {
                children: "OKX Connect"
              }), createComponent(BodyStyled$1, {
                get children() {
                  return [createComponent(Show, {
                    get when() {
                      return connectionErrored();
                    },
                    get children() {
                      return createComponent(ConnectionDeclinedModalPage, {
                        onRetry
                      });
                    }
                  }), createComponent(Show, {
                    get when() {
                      return !connectionErrored();
                    },
                    get children() {
                      return [createComponent(Show, {
                        get when() {
                          return showAppAndTgState();
                        },
                        get children() {
                          return createComponent(ConnectAppTgModalPage, {
                            onConnectApp,
                            onConnectMini
                          });
                        }
                      }), createComponent(Show, {
                        get when() {
                          return !showAppAndTgState();
                        },
                        get children() {
                          return createComponent(ContinueInWalletModalPage, {
                            onOpenQR,
                            onRetry
                          });
                        }
                      })];
                    }
                  })];
                }
              }), createComponent(ModalFooter, {
                get wallet() {
                  return props.wallet;
                }
              })];
            }
          })];
        }
      })];
    }
  });
};
const MobileConnectionModalStyled = styled.div``;
const BodyStyled = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 325px;
  gap: 24px;
`;
const DesktopConnectionModal = (props) => {
  useTheme();
  const [firstClick, setFirstClick] = createSignal(true);
  const [showQR, setShowQR] = createSignal(false);
  const [walletType, setWalletType] = createSignal(null);
  const showAppAndTgState = createMemo(() => !props.isSingleWallet && walletType() === null);
  const [connectionErrored, setConnectionErrored] = createSignal(false);
  const connector = useContext(ConnectorContext);
  const [miniUniversalLink, setMiniUniversalLink] = createSignal(null);
  const okxConnectUI = useContext(OKXConnectUiContext);
  createEffect(() => {
    var _a2;
    core.logDebug("TON customEvent.detail  :::", createEffect);
    var info = props.universalLinkParams();
    core.logDebug("TON customEvent.detail  :::", JSON.stringify(info));
    if (info) {
      props.setLastSelectedWalletInfo(__spreadProps(__spreadValues({}, props.wallet), {
        openMethod: "universal-link"
      }));
      var connectRequest = info.connectRequest;
      var tonConnectRequest = info.tonConnectRequest;
      if (!tonConnectRequest) {
        tonConnectRequest = connectRequest;
      }
      if (connectRequest) {
        var encodeParams = core.encodeConnectParams(__spreadProps(__spreadValues({}, tonConnectRequest), {
          redirect: "none"
        }));
        var qrLink2 = core.getUniversalLink(core.getAppWalletDeepLink(encodeParams));
        setQrLink(qrLink2);
        var encodeTGParams = core.encodeTWAConnectURLParams(connectRequest);
        var tgUrl = core.getTelegramWalletTWAUrl(encodeTGParams, (_a2 = info.tmaReturnUrl) != null ? _a2 : "back", browserDebug());
        setMiniUniversalLink(tgUrl);
        core.logDebug(`DesktopConnectionModal  setUniversalLink  tgUrl  ${tgUrl}    qrLink ${qrLink2}`);
      }
    }
  });
  const [qrLink, setQrLink] = createSignal(null);
  const unsubscribe = connector == null ? void 0 : connector.onStatusChange(() => {
  }, () => {
    setConnectionErrored(true);
    const info = props.lastSelectedWalletInfo;
    if (info && info.openMethod && info.openMethod === "qrcode") {
      if (showQR()) {
        onCloseQR();
      }
    }
  });
  onMount(() => __async(exports, null, function* () {
    try {
      yield props.connect().catch((error) => core.logDebug("DesktopConnectionModal connect catch error ", JSON.stringify(error)));
    } catch (error) {
      core.logDebug("DesktopConnectionModal connect  error ", JSON.stringify(error));
    }
  }));
  const onRetry = () => {
    setConnectionErrored(false);
    setWalletType(null);
    !firstClick();
    setFirstClick(false);
    try {
      props.connect();
    } catch (error) {
      console.error("Error while connecting:", error);
    }
  };
  const onOpenQR = () => {
    setConnectionErrored(false);
    setShowQR(true);
    props.setLastSelectedWalletInfo(__spreadProps(__spreadValues({}, props.wallet), {
      openMethod: "qrcode"
    }));
  };
  const onCloseQR = () => {
    setShowQR(false);
    props.setLastSelectedWalletInfo(__spreadProps(__spreadValues({}, props.wallet), {
      openMethod: "universal-link"
    }));
  };
  const onConnectApp = () => {
    setQrLink(qrLink());
    setWalletType("app");
    onOpenQR();
  };
  const onConnectMini = () => {
    core.logDebug("desktop on connect mini");
    okxConnectUI == null ? void 0 : okxConnectUI.closeModal();
    core.openOKXTMAWalletlinkWithFallback(miniUniversalLink(), browserDebug());
  };
  if (unsubscribe) {
    onCleanup(unsubscribe);
  }
  return createComponent(MobileConnectionModalStyled, {
    "data-tc-wallets-modal-connection-mobile": "true",
    get children() {
      return [createComponent(Show, {
        get when() {
          return props.universalLinkParams() === null || connectionErrored() || showAppAndTgState();
        },
        get children() {
          return createComponent(H1Styled$1, {
            children: "OKX Connect"
          });
        }
      }), createComponent(Show, {
        get when() {
          return props.universalLinkParams() === null;
        },
        get children() {
          return [createComponent(LoadingModalPage, {}), createComponent(ModalFooter, {
            get wallet() {
              return props.wallet;
            }
          })];
        }
      }), createComponent(Show, {
        get when() {
          return props.universalLinkParams() !== null;
        },
        get children() {
          return [createComponent(Show, {
            get when() {
              return connectionErrored();
            },
            get children() {
              return createComponent(BodyStyled, {
                get children() {
                  return createComponent(ConnectionDeclinedModalPage, {
                    onRetry
                  });
                }
              });
            }
          }), createComponent(Show, {
            get when() {
              return !connectionErrored();
            },
            get children() {
              return [createComponent(Show, {
                get when() {
                  return !showAppAndTgState();
                },
                get children() {
                  return createComponent(MobileConnectionQR, {
                    get universalLink() {
                      return qrLink();
                    },
                    get walletInfo() {
                      return props.wallet;
                    }
                  });
                }
              }), createComponent(Show, {
                get when() {
                  return showAppAndTgState();
                },
                get children() {
                  return createComponent(BodyStyled, {
                    get children() {
                      return createComponent(ConnectAppTgModalPage, {
                        onConnectApp,
                        onConnectMini
                      });
                    }
                  });
                }
              })];
            }
          }), createComponent(ModalFooter, {
            get wallet() {
              return props.wallet;
            }
          })];
        }
      })];
    }
  });
};
const SingleWalletModal = (props) => {
  const {
    locale
  } = useI18n()[1];
  createEffect(() => locale(appState.language));
  createEffect(() => {
    if (props.opened) {
      updateIsMobile();
    }
  });
  return createComponent(StyledModal, {
    get opened() {
      return props.opened;
    },
    onClose: () => props.onClose("action-cancelled"),
    "data-tc-wallets-modal-container": "true",
    get children() {
      return [createComponent(Show, {
        get when() {
          return props.loadingBeforeConnect();
        },
        get children() {
          return [createComponent(H1Styled$1, {
            get children() {
              var _a2;
              return (_a2 = props.walletInfo) == null ? void 0 : _a2.name;
            }
          }), createComponent(LoadingModalPage, {})];
        }
      }), createComponent(Show, {
        get when() {
          return !props.loadingBeforeConnect();
        },
        get children() {
          return createComponent(Dynamic, {
            get component() {
              return isMobile() ? MobileConnectionModal : DesktopConnectionModal;
            },
            get wallet() {
              return props.walletInfo;
            },
            onBackClick: () => {
            },
            backDisabled: true,
            get connect() {
              return props.connect;
            },
            get isSingleWallet() {
              return props.isSingleWallet;
            },
            get universalLinkParams() {
              return props.universalLinkParams;
            },
            get lastSelectedWalletInfo() {
              return props.lastSelectedWalletInfo;
            },
            get setLastSelectedWalletInfo() {
              return props.setLastSelectedWalletInfo;
            }
          });
        }
      })];
    }
  });
};
const TonSingleWalletModal = () => {
  const tonConnectUI = useContext(OKXConnectUiContext);
  const connector = useContext(ConnectorContext);
  const additionalRequestLoading = () => {
    var _a2;
    return ((_a2 = appState.connectRequestParameters) == null ? void 0 : _a2.state) === "loading";
  };
  const [universalLinkParams, setUniversalLinkParams] = createSignal(null);
  window.addEventListener("okx-ton-connect-connection-info-before-jump", (event) => {
    const customEvent = event;
    core.logDebug("TON   :::", JSON.stringify(customEvent.detail));
    if (customEvent.detail && "connectInfo" in customEvent.detail) {
      setUniversalLinkParams(customEvent.detail.connectInfo);
    }
  });
  const additionalRequest = createMemo(() => {
    var _a2;
    if (additionalRequestLoading()) {
      return void 0;
    }
    return (_a2 = appState.connectRequestParameters) == null ? void 0 : _a2.value;
  });
  const onClose = (closeReason) => {
    tonConnectUI.closeModal(closeReason);
  };
  const unsubscribe = connector.onStatusChange((wallet) => {
    if (wallet) {
      onClose("wallet-selected");
    }
  });
  onCleanup(unsubscribe);
  return createComponent(SingleWalletModal, {
    get opened() {
      return getTonSingleWalletModalIsOpened();
    },
    get walletInfo() {
      return getTonSingleWalletModalWalletInfo();
    },
    loadingBeforeConnect: () => {
      var _a2;
      return ((_a2 = appState.connectRequestParameters) == null ? void 0 : _a2.state) === "loading";
    },
    connect: () => {
      return new Promise((resolve, reject) => {
        setUniversalLinkParams(null);
        tonConnectUI.handleConnect((actionConfiguration) => {
          var _a2;
          return connector.connect({
            openUniversalLink: defaultOpenTonUniversalLink(),
            tonProof: (_a2 = additionalRequest()) == null ? void 0 : _a2.tonProof,
            redirect: actionConfiguration == null ? void 0 : actionConfiguration.returnStrategy,
            tmaReturnUrl: appState.tmaReturnUrl
          });
        }).then((url) => {
          resolve(url);
        }).catch((error) => {
          reject(error);
          setUniversalLinkParams(null);
        });
      });
    },
    onClose,
    universalLinkParams,
    get isSingleWallet() {
      return !showTonTgWallet();
    },
    get lastSelectedWalletInfo() {
      return lastTonSelectedWalletInfo();
    },
    setLastSelectedWalletInfo: setLastTonSelectedWalletInfo
  });
};
const common$i = {
  openWallet: "Open wallet",
  get: "Get",
  close: "Close",
  retry: "Retry"
};
const button$i = {
  connectWallet: "Connect wallet",
  dropdown: {
    copy: "Copy address",
    copied: "Address copied",
    disconnect: "Disconnect"
  }
};
const notifications$i = {
  confirm: {
    header: "Open {{ name }} to\xA0confirm the\xA0transaction."
  },
  transactionSent: {
    header: "Transaction sent",
    text: "Your transaction\xA0will be\xA0processed in\xA0a\xA0few seconds."
  },
  transactionCanceled: {
    header: "Transaction canceled",
    text: "There\u2019ll be no changes to your account."
  }
};
const walletModal$i = {
  mobileConnectionModal: {
    OKXConnect: "OKX Connect",
    showQR: "Show QR Code",
    scanQR: "Scan the\xA0QR code below with your phone\u2019s\xA0or\xA0{{ name }}\u2019s camera",
    continueIn: "Proceed in OKX Wallet",
    connectionDeclined: "Connection failed",
    PoweredBy: "Powered by",
    appAndTelegram: {
      header: "Connect to OKX Wallet",
      text: "OKX Wallet is available on OKX App and Telegram"
    },
    connectApp: "Connect to OKX App",
    connectMini: "Connect to OKX Mini Wallet"
  }
};
const actionModal$i = {
  confirmTransaction: {
    header: "Confirm the\xA0transaction in\xA0{{ name }}",
    text: "It\u2019ll only take a moment."
  },
  transactionSent: "$notifications.transactionSent",
  transactionCanceled: "$notifications.transactionCanceled"
};
const en = {
  common: common$i,
  button: button$i,
  notifications: notifications$i,
  walletModal: walletModal$i,
  actionModal: actionModal$i
};
const common$h = {
  openWallet: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043A\u043E\u0448\u0435\u043B\u0435\u043A",
  get: "\u041F\u041E\u041B\u0423\u0427\u0418\u0422\u042C",
  close: "\u0417\u0430\u043A\u0440\u044B\u0442\u044C",
  retry: "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C \u043F\u043E\u043F\u044B\u0442\u043A\u0443"
};
const button$h = {
  connectWallet: "\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u043A\u043E\u0448\u0435\u043B\u0435\u043A",
  dropdown: {
    copy: "\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0430\u0434\u0440\u0435\u0441",
    copied: "\u0410\u0434\u0440\u0435\u0441 \u0441\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D.",
    disconnect: "\u041E\u0442\u043A\u043B\u044E\u0447\u0438\u0442\u044C"
  }
};
const notifications$h = {
  confirm: {
    header: "\u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 {{ name }} \u0434\u043B\u044F \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F \u0442\u0440\u0430\u043D\u0437\u0430\u043A\u0446\u0438\u0438."
  },
  transactionSent: {
    header: "\u0422\u0440\u0430\u043D\u0437\u0430\u043A\u0446\u0438\u044F \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0430",
    text: "\u0422\u0440\u0430\u043D\u0437\u0430\u043A\u0446\u0438\u044F \u0431\u0443\u0434\u0435\u0442 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0430\u043D\u0430 \u0447\u0435\u0440\u0435\u0437 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0441\u0435\u043A\u0443\u043D\u0434."
  },
  transactionCanceled: {
    header: "\u0422\u0440\u0430\u043D\u0437\u0430\u043A\u0446\u0438\u044F \u043E\u0442\u043C\u0435\u043D\u0435\u043D\u0430",
    text: "\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0439 \u0432 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0435 \u043D\u0435 \u0431\u0443\u0434\u0435\u0442."
  }
};
const walletModal$h = {
  mobileConnectionModal: {
    showQR: "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C QR-\u043A\u043E\u0434",
    scanQR: "\u041E\u0442\u0441\u043A\u0430\u043D\u0438\u0440\u0443\u0439\u0442\u0435 QR-\u043A\u043E\u0434 \u043D\u0438\u0436\u0435 \u0441 \u043F\u043E\u043C\u043E\u0449\u044C\u044E \u043A\u0430\u043C\u0435\u0440\u044B \u043D\u0430 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0435 \u0438\u043B\u0438 {{ name }}",
    continueIn: "\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0435 \u0442\u0440\u0430\u043D\u0437\u0430\u043A\u0446\u0438\u0438 \u0432 \u041A\u043E\u0448\u0435\u043B\u044C\u043A\u0435 OKX",
    connectionDeclined: "\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u043E",
    PoweredBy: "Powered by",
    appAndTelegram: {
      header: "Connect to OKX Wallet",
      text: "\u041A\u043E\u0448\u0435\u043B\u0435\u043A OKX \u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D \u0432 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0438 OKX \u0438 \u0432 Telegram"
    },
    connectApp: "\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u044C\u0441\u044F \u043A \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044E OKX",
    connectMini: "\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u044C\u0441\u044F \u043A \u043C\u0438\u043D\u0438-\u041A\u043E\u0448\u0435\u043B\u044C\u043A\u0443 OKX"
  }
};
const actionModal$h = {
  confirmTransaction: {
    header: "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u0442\u0440\u0430\u043D\u0437\u0430\u043A\u0446\u0438\u044E \u0432 {{ name }}",
    text: "\u042D\u0442\u043E \u0437\u0430\u0439\u043C\u0435\u0442 \u0432\u0441\u0435\u0433\u043E \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0441\u0435\u043A\u0443\u043D\u0434."
  },
  transactionSent: "$notifications.transactionSent",
  transactionCanceled: "$notifications.transactionCanceled"
};
const ru = {
  common: common$h,
  button: button$h,
  notifications: notifications$h,
  walletModal: walletModal$h,
  actionModal: actionModal$h
};
const common$g = {
  openWallet: "\u6253\u5F00\u94B1\u5305",
  get: "\u83B7\u53D6",
  close: "\u5173\u95ED",
  retry: "\u518D\u8BD5\u4E00\u6B21"
};
const button$g = {
  connectWallet: "\u8FDE\u63A5\u94B1\u5305",
  dropdown: {
    copy: "\u590D\u5236\u5730\u5740",
    copied: "\u5730\u5740\u5DF2\u590D\u5236",
    disconnect: "\u65AD\u5F00\u8FDE\u63A5"
  }
};
const notifications$g = {
  confirm: {
    header: "\u6253\u5F00 {{ name }} \u4EE5\u786E\u8BA4\u4EA4\u6613"
  },
  transactionSent: {
    header: "\u4EA4\u6613\u5DF2\u53D1\u9001",
    text: "\u4EA4\u6613\u5373\u5C06\u5B8C\u6210\uFF0C\u8BF7\u7A0D\u5019"
  },
  transactionCanceled: {
    header: "\u4EA4\u6613\u5DF2\u53D6\u6D88",
    text: "\u8D26\u6237\u672A\u53D1\u751F\u4EFB\u4F55\u66F4\u6539"
  }
};
const walletModal$g = {
  mobileConnectionModal: {
    OKXConnect: "OKX Connect",
    showQR: "\u5C55\u793A\u4E8C\u7EF4\u7801",
    scanQR: "\u4F7F\u7528\u624B\u673A\u6216\u6B27\u6613\u94B1\u5305\u7684\u76F8\u673A\u626B\u63CF\u4E0B\u65B9\u4E8C\u7EF4\u7801",
    continueIn: "\u5728\u6B27\u6613\u94B1\u5305\u4E2D\u7EE7\u7EED\u5B8C\u6210",
    connectionDeclined: "\u8FDE\u63A5\u5931\u8D25",
    PoweredBy: "Powered by",
    appAndTelegram: {
      header: "\u8FDE\u63A5 OKX \u94B1\u5305",
      text: "OKX \u94B1\u5305\u652F\u6301 App \u548C Telegram \u5C0F\u7A0B\u5E8F"
    },
    connectApp: "\u8FDE\u63A5\u6B27\u6613 App",
    connectMini: "\u8FDE\u63A5\u6B27\u6613 Mini Wallet"
  }
};
const actionModal$g = {
  confirmTransaction: {
    header: "\u5728 {{ name }} \u4E2D\u786E\u8BA4\u4EA4\u6613",
    text: "\u8BF7\u7A0D\u5019"
  },
  transactionSent: "$notifications.transactionSent",
  transactionCanceled: "$notifications.transactionCanceled"
};
const zh_CN = {
  common: common$g,
  button: button$g,
  notifications: notifications$g,
  walletModal: walletModal$g,
  actionModal: actionModal$g
};
const common$f = {
  openWallet: "\u0641\u062A\u062D \u0645\u062D\u0641\u0638\u0629",
  get: "\u062D\u0635\u0648\u0644",
  close: "\u0625\u063A\u0644\u0627\u0642",
  retry: "\u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629"
};
const button$f = {
  connectWallet: "\u0631\u0628\u0637 \u0627\u0644\u0645\u062D\u0641\u0638\u0629",
  dropdown: {
    copy: "\u0646\u0633\u062E \u0627\u0644\u0639\u0646\u0648\u0627\u0646",
    copied: "\u062A\u0645 \u0646\u0633\u062E \u0627\u0644\u0639\u0646\u0648\u0627\u0646",
    disconnect: "\u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u0631\u0628\u0637"
  }
};
const notifications$f = {
  confirm: {
    header: "\u0627\u0641\u062A\u062D {{ name }} \u0644\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0645\u0639\u0627\u0645\u0644\u0629."
  },
  transactionSent: {
    header: "\u0623\u064F\u0631\u0633\u0644\u062A \u0627\u0644\u0645\u0639\u0627\u0645\u0644\u0629",
    text: "\u0633\u062A\u062A\u0645 \u0645\u0639\u0627\u0644\u062C\u0629 \u0645\u0639\u0627\u0645\u0644\u062A\u0643 \u0641\u064A \u063A\u0636\u0648\u0646 \u062B\u0648\u0627\u0646\u064D \u0642\u0644\u064A\u0644\u0629."
  },
  transactionCanceled: {
    header: "\u0623\u064F\u0644\u063A\u064A\u062A \u0627\u0644\u0645\u0639\u0627\u0645\u0644\u0629",
    text: "\u0644\u0646 \u062A\u0637\u0631\u0623 \u0623\u064A\u0629 \u062A\u063A\u064A\u064A\u0631\u0627\u062A \u0639\u0644\u0649 \u062D\u0633\u0627\u0628\u0643."
  }
};
const walletModal$f = {
  mobileConnectionModal: {
    showQR: "\u0639\u0631\u0636 \u0631\u0645\u0632 QR",
    scanQR: "\u0627\u0645\u0633\u062D \u0631\u0645\u0632 QR \u0623\u062F\u0646\u0627\u0647 \u0628\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0643\u0627\u0645\u064A\u0631\u0627 \u0647\u0627\u062A\u0641\u0643 \u0623\u0648 \u0643\u0627\u0645\u064A\u0631\u0627 \u0647\u0627\u062A\u0641 {{ name }}",
    continueIn: "\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u0645\u0639\u0627\u0645\u0644\u0629 \u0641\u064A \u0645\u062D\u0641\u0638\u0629 OKX",
    connectionDeclined: "\u0641\u0634\u0644 \u0627\u0644\u0627\u062A\u0635\u0627\u0644",
    PoweredBy: "Powered by",
    appAndTelegram: {
      header: "Connect to OKX Wallet",
      text: "\u0645\u062D\u0641\u0638\u0629 OKX \u0645\u062A\u0627\u062D\u0629 \u0639\u0644\u0649 \u062A\u0637\u0628\u064A\u0642 OKX \u0648Telegram"
    },
    connectApp: "\u0627\u0644\u0631\u0628\u0637 \u0628\u062A\u0637\u0628\u064A\u0642 OKX",
    connectMini: "\u0627\u0644\u0631\u0628\u0637 \u0628\u0645\u062D\u0641\u0638\u0629 OKX \u0627\u0644\u0645\u0635\u063A\u0631\u0629"
  }
};
const actionModal$f = {
  confirmTransaction: {
    header: "\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0645\u0639\u0627\u0645\u0644\u0629 \u0641\u064A {{ name }}",
    text: "\u0644\u0646 \u064A\u0633\u062A\u063A\u0631\u0642 \u0627\u0644\u0623\u0645\u0631 \u0633\u0648\u0649 \u0644\u062D\u0638\u0627\u062A."
  }
};
const ar_AE = {
  common: common$f,
  button: button$f,
  notifications: notifications$f,
  walletModal: walletModal$f,
  actionModal: actionModal$f
};
const common$e = {
  openWallet: "Otev\u0159\xEDt pen\u011B\u017Eenku",
  get: "Z\xEDskat",
  close: "Zav\u0159\xEDt",
  retry: "Zkusit znovu"
};
const button$e = {
  connectWallet: "P\u0159ipojit pen\u011B\u017Eenku",
  dropdown: {
    copy: "Kop\xEDrovat adresu",
    copied: "Adresa zkop\xEDrov\xE1na",
    disconnect: "Odpojit"
  }
};
const notifications$e = {
  confirm: {
    header: "Otev\u0159ete {{ name }} a potvr\u010Fte transakci."
  },
  transactionSent: {
    header: "Transakce odesl\xE1na",
    text: "Va\u0161e transakce bude zru\u0161ena b\u011Bhem n\u011Bkolika sekund."
  },
  transactionCanceled: {
    header: "Transakce zru\u0161ena",
    text: "Na va\u0161em \xFA\u010Dtu nedojde k \u017E\xE1dn\xFDm zm\u011Bn\xE1m."
  }
};
const walletModal$e = {
  mobileConnectionModal: {
    showQR: "Zobrazit QR k\xF3d",
    scanQR: "Naskenujte n\xED\u017Ee uveden\xFD QR k\xF3d pomoc\xED kamery telefonu nebo {{ name }}",
    continueIn: "Potvr\u010Fte transakci v OKX Pen\u011B\u017Eence.",
    connectionDeclined: "P\u0159ipojen\xED selhalo",
    PoweredBy: "Powered by",
    appAndTelegram: {
      header: "Connect to OKX Wallet",
      text: "OKX Pen\u011B\u017Eenka je k dispozici v aplikaci OKX a na s\xEDti Telegram."
    },
    connectApp: "P\u0159ipojit k aplikaci OKX",
    connectMini: "P\u0159ipojit k minipen\u011B\u017Eence OKX"
  }
};
const actionModal$e = {
  confirmTransaction: {
    header: "Potvr\u010Fte transakci na {{ name }}.",
    text: "Zabere to jen chvilku."
  }
};
const cs_CZ = {
  common: common$e,
  button: button$e,
  notifications: notifications$e,
  walletModal: walletModal$e,
  actionModal: actionModal$e
};
const common$d = {
  openWallet: "Wallet \xF6ffnen",
  get: "Erhalten",
  close: "Schlie\xDFen",
  retry: "Wiederholen"
};
const button$d = {
  connectWallet: "Wallet verkn\xFCpfen",
  dropdown: {
    copy: "Adresse kopieren",
    copied: "Adresse kopiert",
    disconnect: "Trennen"
  }
};
const notifications$d = {
  confirm: {
    header: "{{ name }} \xF6ffnen und Transaktion best\xE4tigen."
  },
  transactionSent: {
    header: "Transaktion gesendet",
    text: "Ihre Transaktion wird in wenigen Sekunden bearbeitet."
  },
  transactionCanceled: {
    header: "Transaktion storniert",
    text: "Es werden keine \xC4nderungen an Ihrem Konto vorgenommen."
  }
};
const walletModal$d = {
  mobileConnectionModal: {
    showQR: "QR-Code anzeigen",
    scanQR: "Scannen Sie den QR-Code unten mit der Kamera Ihres Telefons oder {{ name }}",
    continueIn: "Setzen Sie die Transaktion in der OKX Wallet fort",
    connectionDeclined: "Verbindung fehlgeschlagen",
    PoweredBy: "Powered by",
    appAndTelegram: {
      header: "Connect to OKX Wallet",
      text: "OKX Wallet ist in der OKX App und auf Telegram verf\xFCgbar"
    },
    connectApp: "Mit der OKX-App verbinden",
    connectMini: "Mit der OKX-Mini-Wallet verbinden"
  }
};
const actionModal$d = {
  confirmTransaction: {
    header: "Transaktion in {{ name }} best\xE4tigen",
    text: "Es dauert nur einen Augenblick."
  }
};
const de_DE = {
  common: common$d,
  button: button$d,
  notifications: notifications$d,
  walletModal: walletModal$d,
  actionModal: actionModal$d
};
const common$c = {
  openWallet: "Abrir wallet",
  get: "Consigue",
  close: "Cerrar",
  retry: "Volver a intentar"
};
const button$c = {
  connectWallet: "Conectar billetera",
  dropdown: {
    copy: "Copiar direcci\xF3n",
    copied: "Direcci\xF3n copiada",
    disconnect: "Desconectar"
  }
};
const notifications$c = {
  confirm: {
    header: "Abre {{ name }} para confirmar la transacci\xF3n."
  },
  transactionSent: {
    header: "Transacci\xF3n enviada",
    text: "Tu transacci\xF3n se procesar\xE1 en unos segundos."
  },
  transactionCanceled: {
    header: "Transacci\xF3n cancelada",
    text: "No se realizar\xE1n cambios en tu cuenta."
  }
};
const walletModal$c = {
  mobileConnectionModal: {
    showQR: "Mostrar c\xF3digo QR",
    scanQR: "Escanea el siguiente c\xF3digo QR con la c\xE1mara de tu tel\xE9fono o de tu {{ name }}",
    continueIn: "Continuar con la transacci\xF3n en OKX Wallet",
    connectionDeclined: "Error de conexi\xF3n",
    PoweredBy: "Powered by",
    appAndTelegram: {
      header: "Connect to OKX Wallet",
      text: "OKX Wallet est\xE1 disponible en la OKX app y en Telegram"
    },
    connectApp: "Conectarse a la OKX app",
    connectMini: "Conectarse a la OKX Mini Wallet"
  }
};
const actionModal$c = {
  confirmTransaction: {
    header: "Confirma la transacci\xF3n de {{ name }}",
    text: "Solo te llevar\xE1 un momento."
  }
};
const es_ES = {
  common: common$c,
  button: button$c,
  notifications: notifications$c,
  walletModal: walletModal$c,
  actionModal: actionModal$c
};
const common$b = {
  openWallet: "Abrir billetera",
  get: "Obtener",
  close: "Cerrar",
  retry: "Reintentar"
};
const button$b = {
  connectWallet: "Conectar billetera",
  dropdown: {
    copy: "Copiar direcci\xF3n",
    copied: "Direcci\xF3n copiada",
    disconnect: "Desconectar"
  }
};
const notifications$b = {
  confirm: {
    header: "Abre {{ name }} para confirmar la transacci\xF3n."
  },
  transactionSent: {
    header: "Transacci\xF3n enviada",
    text: "Tu transacci\xF3n se procesar\xE1 en unos segundos."
  },
  transactionCanceled: {
    header: "Transacci\xF3n cancelada",
    text: "No habr\xE1 cambios en tu cuenta."
  }
};
const walletModal$b = {
  mobileConnectionModal: {
    showQR: "Mostrar c\xF3digo QR",
    scanQR: "Escanea el siguiente c\xF3digo QR con la c\xE1mara de tu tel\xE9fono o {{ name }}",
    continueIn: "Contin\xFAa la transacci\xF3n en OKX Wallet",
    connectionDeclined: "Error de conexi\xF3n",
    PoweredBy: "Powered by",
    appAndTelegram: {
      header: "Connect to OKX Wallet",
      text: "OKX Wallet est\xE1 disponible en la aplicaci\xF3n de OKX y Telegram"
    },
    connectApp: "Con\xE9ctate a la aplicaci\xF3n de OKX",
    connectMini: "Con\xE9ctate a la OKX\xA0Mini Wallet"
  }
};
const actionModal$b = {
  confirmTransaction: {
    header: "Confirmar la transacci\xF3n en {{ name }}",
    text: "Solo tomar\xE1 un momento."
  }
};
const es_LAT = {
  common: common$b,
  button: button$b,
  notifications: notifications$b,
  walletModal: walletModal$b,
  actionModal: actionModal$b
};
const common$a = {
  openWallet: "Portefeuille ouvert",
  get: "Obtenir",
  close: "Fermer",
  retry: "R\xE9essayer"
};
const button$a = {
  connectWallet: "Connecter le portefeuille",
  dropdown: {
    copy: "Copier l\u2019adresse",
    copied: "Adresse copi\xE9e",
    disconnect: "D\xE9connecter"
  }
};
const notifications$a = {
  confirm: {
    header: "Ouvrir {{ name }} pour confirmer la transaction."
  },
  transactionSent: {
    header: "Transaction envoy\xE9e",
    text: "Votre transaction sera trait\xE9e en quelques secondes."
  },
  transactionCanceled: {
    header: "Transaction annul\xE9e",
    text: "Aucun changement ne sera apport\xE9 \xE0 votre compte."
  }
};
const walletModal$a = {
  mobileConnectionModal: {
    showQR: "Afficher le code QR",
    scanQR: "Scannez le code QR ci-dessous avec la cam\xE9ra de votre t\xE9l\xE9phone ou de votre {{ name }}.",
    continueIn: "Poursuivre la transaction dans OKX Wallet",
    connectionDeclined: "\xC9chec de la connexion",
    PoweredBy: "Powered by",
    appAndTelegram: {
      header: "Connect to OKX Wallet",
      text: "OKX Wallet est disponible sur OKX App et Telegram"
    },
    connectApp: "Se connecter \xE0 l\u2019appli OKX",
    connectMini: "Se connecter \xE0 OKX Mini Wallet"
  }
};
const actionModal$a = {
  confirmTransaction: {
    header: "Confirmer la transaction dans {{ name }}",
    text: "Cela ne prendra qu'un instant."
  }
};
const fr_FR = {
  common: common$a,
  button: button$a,
  notifications: notifications$a,
  walletModal: walletModal$a,
  actionModal: actionModal$a
};
const common$9 = {
  openWallet: "Buka wallet",
  get: "Dapatkan",
  close: "Tutup",
  retry: "Coba lagi"
};
const button$9 = {
  connectWallet: "Hubungkan wallet",
  dropdown: {
    copy: "Salin alamat",
    copied: "Alamat disalin",
    disconnect: "Putuskan sambungan"
  }
};
const notifications$9 = {
  confirm: {
    header: "Buka {{ name }} untuk mengonfirmasi transaksi."
  },
  transactionSent: {
    header: "Transaksi terkirim",
    text: "Transaksi Anda akan diproses dalam beberapa detik."
  },
  transactionCanceled: {
    header: "Transaksi dibatalkan",
    text: "Tidak akan ada perubahan pada akun Anda."
  }
};
const walletModal$9 = {
  mobileConnectionModal: {
    showQR: "Tampilkan Kode QR",
    scanQR: "Pindai kode QR di bawah dengan kamera ponsel atau {{ name }} Anda",
    continueIn: "Lanjutkan transaksi di OKX Wallet",
    connectionDeclined: "Koneksi gagal",
    PoweredBy: "Powered by",
    appAndTelegram: {
      header: "Connect to OKX Wallet",
      text: "OKX Wallet tersedia di OKX App dan Telegram"
    },
    connectApp: "Hubungkan ke OKX App",
    connectMini: "Hubungkan ke OKX Mini Wallet"
  }
};
const actionModal$9 = {
  confirmTransaction: {
    header: "Konfirmasi transaksi pada {{ name }}",
    text: "Hanya perlu beberapa saat."
  }
};
const id_ID = {
  common: common$9,
  button: button$9,
  notifications: notifications$9,
  walletModal: walletModal$9,
  actionModal: actionModal$9
};
const common$8 = {
  openWallet: "Apri portafoglio",
  get: "Ottieni",
  close: "Chiudi",
  retry: "Riprova"
};
const button$8 = {
  connectWallet: "Connetti il portafoglio",
  dropdown: {
    copy: "Copia indirizzo",
    copied: "Indirizzo copiato",
    disconnect: "Disconnetti"
  }
};
const notifications$8 = {
  confirm: {
    header: "Apri {{ name }} per confermare la transazione."
  },
  transactionSent: {
    header: "Transazione inviata",
    text: "La transazione verr\xE0 elaborata in pochi secondi."
  },
  transactionCanceled: {
    header: "Transazione annullata",
    text: "Il tuo conto non subir\xE0 modifiche."
  }
};
const walletModal$8 = {
  mobileConnectionModal: {
    showQR: "Mostra il codice QR",
    scanQR: "Scansiona il codice QR di seguito con la fotocamera del tuo smartphone o {{ name }}",
    continueIn: "Continua la transazione in OKX Wallet",
    connectionDeclined: "Collegamento non riuscito",
    PoweredBy: "Powered by",
    appAndTelegram: {
      header: "Connect to OKX Wallet",
      text: "OKX Wallet \xE8 disponibile sull'app OKX e Telegram"
    },
    connectApp: "Connettiti all'app OKX",
    connectMini: "Connettiti a OKX Mini Wallet"
  }
};
const actionModal$8 = {
  confirmTransaction: {
    header: "Conferma la transazione in {{ name }}",
    text: "Ci vorr\xE0 solo un secondo."
  }
};
const it_IT = {
  common: common$8,
  button: button$8,
  notifications: notifications$8,
  walletModal: walletModal$8,
  actionModal: actionModal$8
};
const common$7 = {
  openWallet: "Wallet openen",
  get: "Krijgen",
  close: "Sluiten",
  retry: "Opnieuw proberen"
};
const button$7 = {
  connectWallet: "Wallet koppelen",
  dropdown: {
    copy: "Adres kopi\xEBren",
    copied: "Adres gekopieerd",
    disconnect: "Verbinding verbreken"
  }
};
const notifications$7 = {
  confirm: {
    header: "Open {{ name }} om de transactie te bevestigen."
  },
  transactionSent: {
    header: "Transactie verstuurd",
    text: "Je transactie wordt binnen een paar seconden verwerkt."
  },
  transactionCanceled: {
    header: "Transactie geannuleerd",
    text: "Er verandert niets aan je account."
  }
};
const walletModal$7 = {
  mobileConnectionModal: {
    showQR: "QR-code weergeven",
    scanQR: "Scan de QR-code hieronder met de camera van je telefoon of de camera van{{ name }}",
    continueIn: "Ga verder met de transactie in OKX Wallet",
    connectionDeclined: "Koppelen mislukt",
    PoweredBy: "Powered by",
    appAndTelegram: {
      header: "Connect to OKX Wallet",
      text: "OKX Wallet is beschikbaar op OKX App en Telegram"
    },
    connectApp: "Koppelen met de OKX-app",
    connectMini: "Koppelen met OKX Mini Wallet"
  }
};
const actionModal$7 = {
  confirmTransaction: {
    header: "De transactie in {{ name }} bevestigen",
    text: "Het is zo gebeurd."
  }
};
const nl_NL = {
  common: common$7,
  button: button$7,
  notifications: notifications$7,
  walletModal: walletModal$7,
  actionModal: actionModal$7
};
const common$6 = {
  openWallet: "Otw\xF3rz portfel",
  get: "Otrzymaj",
  close: "Zamknij",
  retry: "Spr\xF3buj ponownie"
};
const button$6 = {
  connectWallet: "Po\u0142\u0105cz portfel",
  dropdown: {
    copy: "Kopiuj adres",
    copied: "Adres skopiowany",
    disconnect: "Roz\u0142\u0105cz"
  }
};
const notifications$6 = {
  confirm: {
    header: "Otw\xF3rz {{ name }}, aby potwierdzi\u0107 transakcj\u0119."
  },
  transactionSent: {
    header: "Wys\u0142ano transakcj\u0119",
    text: "Transakcja zostanie przetworzona w ci\u0105gu kilku sekund."
  },
  transactionCanceled: {
    header: "Anulowano transakcj\u0119",
    text: "Na koncie nie zostan\u0105 wprowadzone \u017Cadne zmiany."
  }
};
const walletModal$6 = {
  mobileConnectionModal: {
    showQR: "Poka\u017C kod QR",
    scanQR: "Zeskanuj poni\u017Cszy kod QR za pomoc\u0105 aparatu w telefonie lub {{ name }}",
    continueIn: "Kontynuuj transakcj\u0119 w OKX Wallet",
    connectionDeclined: "Po\u0142\u0105czenie nieudane",
    PoweredBy: "Powered by",
    appAndTelegram: {
      header: "Connect to OKX Wallet",
      text: "OKX Wallet jest dost\u0119pny w aplikacji OKX i Telegramie"
    },
    connectApp: "Po\u0142\u0105cz z aplikacj\u0105 OKX",
    connectMini: "Po\u0142\u0105cz z OKX Mini Wallet"
  }
};
const actionModal$6 = {
  confirmTransaction: {
    header: "Potwierd\u017A transakcj\u0119 w {{ name }}",
    text: "To zajmie tylko chwil\u0119."
  }
};
const pl_PL = {
  common: common$6,
  button: button$6,
  notifications: notifications$6,
  walletModal: walletModal$6,
  actionModal: actionModal$6
};
const common$5 = {
  openWallet: "Abrir carteira",
  get: "Receber",
  close: "Fechar",
  retry: "Tentar novamente"
};
const button$5 = {
  connectWallet: "Conectar carteira",
  dropdown: {
    copy: "Copiar endere\xE7o",
    copied: "Endere\xE7o copiado",
    disconnect: "Desconectar"
  }
};
const notifications$5 = {
  confirm: {
    header: "Abrir {{ name }} para confirmar a transa\xE7\xE3o."
  },
  transactionSent: {
    header: "Transa\xE7\xE3o enviada",
    text: "Sua transa\xE7\xE3o ser\xE1 processada em alguns segundos."
  },
  transactionCanceled: {
    header: "Transa\xE7\xE3o cancelada",
    text: "N\xE3o haver\xE1 altera\xE7\xF5es em sua conta."
  }
};
const walletModal$5 = {
  mobileConnectionModal: {
    showQR: "Mostrar C\xF3digo QR",
    scanQR: "Digitalize o c\xF3digo QR abaixo com a c\xE2mera do seu telefone ou do {{ name }}",
    continueIn: "Continuar a transa\xE7\xE3o na OKX Wallet",
    connectionDeclined: "Falha na conex\xE3o",
    PoweredBy: "Powered by",
    appAndTelegram: {
      header: "Connect to OKX Wallet",
      text: "A OKX Wallet est\xE1 dispon\xEDvel na OKX App e no Telegram"
    },
    connectApp: "Conecte-se \xE0 OKX App",
    connectMini: "Conecte-se \xE0 OKX Mini Wallet"
  }
};
const actionModal$5 = {
  confirmTransaction: {
    header: "Confirmar a transa\xE7\xE3o em {{ name }}",
    text: "Isso levar\xE1 apenas um momento."
  }
};
const pt_BR = {
  common: common$5,
  button: button$5,
  notifications: notifications$5,
  walletModal: walletModal$5,
  actionModal: actionModal$5
};
const common$4 = {
  openWallet: "Abrir carteira",
  get: "Receber",
  close: "Fechar",
  retry: "Tentar novamente"
};
const button$4 = {
  connectWallet: "Associar carteira",
  dropdown: {
    copy: "Copiar endere\xE7o",
    copied: "Endere\xE7o copiado",
    disconnect: "Desassociar"
  }
};
const notifications$4 = {
  confirm: {
    header: "Abra {{ name }} para confirmar a transa\xE7\xE3o."
  },
  transactionSent: {
    header: "Transa\xE7\xE3o efetuada",
    text: "A sua transa\xE7\xE3o ser\xE1 processada dentro de poucos segundos."
  },
  transactionCanceled: {
    header: "Transa\xE7\xE3o cancelada",
    text: "N\xE3o ser\xE3o feitas altera\xE7\xF5es \xE0 sua conta."
  }
};
const walletModal$4 = {
  mobileConnectionModal: {
    showQR: "Mostrar c\xF3digo QR",
    scanQR: "Leia o c\xF3digo QR abaixo com a c\xE2mara do seu telem\xF3vel ou {{ name }}",
    continueIn: "Continuar a transa\xE7\xE3o na OKX Wallet",
    connectionDeclined: "Falha na liga\xE7\xE3o",
    PoweredBy: "Powered by",
    appAndTelegram: {
      header: "Connect to OKX Wallet",
      text: "A OKX Wallet est\xE1 dispon\xEDvel na Aplica\xE7\xE3o da OKX e no Telegram"
    },
    connectApp: "Associar \xE0 Aplica\xE7\xE3o da OKX",
    connectMini: "Associar \xE0 OKX Mini Wallet"
  }
};
const actionModal$4 = {
  confirmTransaction: {
    header: "Confirmar a transa\xE7\xE3o na {{ name }}",
    text: "Demora apenas um momento."
  }
};
const pt_PT = {
  common: common$4,
  button: button$4,
  notifications: notifications$4,
  walletModal: walletModal$4,
  actionModal: actionModal$4
};
const common$3 = {
  openWallet: "Deschide\u021Bi portofelul",
  get: "Primi\u021Bi",
  close: "\xCEnchide\u021Bi",
  retry: "Re\xEEncerca\u021Bi"
};
const button$3 = {
  connectWallet: "Conecta\u021Bi portofelul",
  dropdown: {
    copy: "Copia\u021Bi adresa",
    copied: "Adres\u0103 copiat\u0103",
    disconnect: "Deconecta\u021Bi"
  }
};
const notifications$3 = {
  confirm: {
    header: "Deschide\u021Bi {{ name }} pentru a confirma tranzac\u021Bia."
  },
  transactionSent: {
    header: "Tranzac\u021Bie trimis\u0103",
    text: "Tranzac\u021Bia dvs. va fi procesat\u0103 \xEEn c\xE2teva secunde."
  },
  transactionCanceled: {
    header: "Tranzac\u021Bie anulat\u0103",
    text: "Nu va exista nicio modificare \xEEn cont."
  }
};
const walletModal$3 = {
  mobileConnectionModal: {
    showQR: "Scana\u021Bi codul QR",
    scanQR: "Scana\u021Bi codul QR mai jos cu camera telefonului sau a {{ name }}",
    continueIn: "Continua\u021Bi tranzac\u021Bia \xEEn OKX Wallet",
    connectionDeclined: "Conexiunea a e\u0219uat",
    PoweredBy: "Powered by",
    appAndTelegram: {
      header: "Connect to OKX Wallet",
      text: "OKX Wallet este disponibil din aplica\u021Bia OKX \u0219i Telegram"
    },
    connectApp: "Conecta\u021Bi-v\u0103 la aplica\u021Bia OKX",
    connectMini: "Conecta\u021Bi-v\u0103 la OKX Mini Wallet"
  }
};
const actionModal$3 = {
  confirmTransaction: {
    header: "Confirma\u021Bi tranzac\u021Bia \xEEn {{ name }}",
    text: "Va dura doar un moment."
  }
};
const ro_RO = {
  common: common$3,
  button: button$3,
  notifications: notifications$3,
  walletModal: walletModal$3,
  actionModal: actionModal$3
};
const common$2 = {
  openWallet: "C\xFCzdan\u0131 a\xE7",
  get: "Al",
  close: "Kapat",
  retry: "Tekrar Dene"
};
const button$2 = {
  connectWallet: "C\xFCzdan\u0131 ba\u011Fla",
  dropdown: {
    copy: "Adresi kopyala",
    copied: "Adres kopyaland\u0131!",
    disconnect: "Ba\u011Flant\u0131y\u0131 kes"
  }
};
const notifications$2 = {
  confirm: {
    header: "\u0130\u015Flemi onaylamak i\xE7in {{ name }} \xF6gesini a\xE7\u0131n."
  },
  transactionSent: {
    header: "\u0130\u015Flem g\xF6nderildi.",
    text: "\u0130\u015Fleminiz birka\xE7 saniye i\xE7inde ger\xE7ekle\u015Ftirilecek."
  },
  transactionCanceled: {
    header: "\u0130\u015Flem iptal edildi!",
    text: "Hesab\u0131n\u0131zda de\u011Fi\u015Fiklik olmayacak."
  }
};
const walletModal$2 = {
  mobileConnectionModal: {
    showQR: "QR Kodunu G\xF6ster",
    scanQR: "A\u015Fa\u011F\u0131daki QR kodunu telefonunuzun veya {{ name }} cihaz\u0131n\u0131z\u0131n kameras\u0131yla taray\u0131n.",
    continueIn: "\u0130\u015Fleme OKX Web3 C\xFCzdan\u2019da devam edin.",
    connectionDeclined: "Ba\u011Flant\u0131 ba\u015Far\u0131s\u0131z.",
    PoweredBy: "Powered by",
    appAndTelegram: {
      header: "Connect to OKX Wallet",
      text: "OKX Web3 C\xFCzdan, OKX Uygulamas\u0131nda ve Telegram\u2019da kullan\u0131ma sunuldu"
    },
    connectApp: "OKX Uygulamas\u0131na Ba\u011Flan",
    connectMini: "OKX Mini C\xFCzdan\u0131na Ba\u011Flan"
  }
};
const actionModal$2 = {
  confirmTransaction: {
    header: "{{ name }} Konumunda \u0130\u015Flemi Onaylay\u0131n",
    text: "Bu yaln\u0131zca bir dakikan\u0131z\u0131 alacak."
  }
};
const tr_TR = {
  common: common$2,
  button: button$2,
  notifications: notifications$2,
  walletModal: walletModal$2,
  actionModal: actionModal$2
};
const common$1 = {
  openWallet: "\u0412\u0456\u0434\u043A\u0440\u0438\u0442\u0438\u0439 \u0433\u0430\u043C\u0430\u043D\u0435\u0446\u044C",
  get: "\u041E\u0442\u0440\u0438\u043C\u0430\u0442\u0438",
  close: "\u0417\u0430\u043A\u0440\u0438\u0442\u0438",
  retry: "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0438 \u0441\u043F\u0440\u043E\u0431\u0443"
};
const button$1 = {
  connectWallet: "\u041F\u0456\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u0438 \u0433\u0430\u043C\u0430\u043D\u0435\u0446\u044C",
  dropdown: {
    copy: "\u041A\u043E\u043F\u0456\u044E\u0432\u0430\u0442\u0438 \u0430\u0434\u0440\u0435\u0441\u0443",
    copied: "\u0410\u0434\u0440\u0435\u0441\u0443 \u0441\u043A\u043E\u043F\u0456\u0439\u043E\u0432\u0430\u043D\u043E",
    disconnect: "\u0412\u0456\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u0438"
  }
};
const notifications$1 = {
  confirm: {
    header: "\u0412\u0456\u0434\u043A\u0440\u0438\u0439\u0442\u0435 {{ name }}, \u0449\u043E\u0431 \u043F\u0456\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0438 \u0442\u0440\u0430\u043D\u0437\u0430\u043A\u0446\u0456\u044E."
  },
  transactionSent: {
    header: "\u0422\u0440\u0430\u043D\u0437\u0430\u043A\u0446\u0456\u044E \u043D\u0430\u0434\u0456\u0441\u043B\u0430\u043D\u043E",
    text: "\u0412\u0430\u0448\u0443 \u0442\u0440\u0430\u043D\u0437\u0430\u043A\u0446\u0456\u044E \u0431\u0443\u0434\u0435 \u043E\u0431\u0440\u043E\u0431\u043B\u0435\u043D\u043E \u0447\u0435\u0440\u0435\u0437 \u043A\u0456\u043B\u044C\u043A\u0430 \u0441\u0435\u043A\u0443\u043D\u0434."
  },
  transactionCanceled: {
    header: "\u0422\u0440\u0430\u043D\u0437\u0430\u043A\u0446\u0456\u044E \u0441\u043A\u0430\u0441\u043E\u0432\u0430\u043D\u043E",
    text: "\u0423 \u0432\u0430\u0448\u043E\u043C\u0443 \u0430\u043A\u0430\u0443\u043D\u0442\u0456 \u043D\u0435 \u0431\u0443\u0434\u0435 \u0437\u043C\u0456\u043D."
  }
};
const walletModal$1 = {
  mobileConnectionModal: {
    showQR: "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u0438 QR-\u043A\u043E\u0434",
    scanQR: "\u0412\u0456\u0434\u0441\u043A\u0430\u043D\u0443\u0439\u0442\u0435 \u043D\u0430\u0432\u0435\u0434\u0435\u043D\u0438\u0439 \u043D\u0438\u0436\u0447\u0435 QR-\u043A\u043E\u0434 \u0437\u0430 \u0434\u043E\u043F\u043E\u043C\u043E\u0433\u043E\u044E \u043A\u0430\u043C\u0435\u0440\u0438 \u0441\u0432\u043E\u0433\u043E \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430 \u0430\u0431\u043E {{ name }}",
    continueIn: "\u041F\u0440\u043E\u0434\u043E\u0432\u0436\u0442\u0435 \u0442\u0440\u0430\u043D\u0437\u0430\u043A\u0446\u0456\u044E \u0432 OKX Wallet",
    connectionDeclined: "\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u043F\u0456\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u043D\u044F",
    PoweredBy: "Powered by",
    appAndTelegram: {
      header: "Connect to OKX Wallet",
      text: "OKX \u0413\u0430\u043C\u0430\u043D\u0435\u0446\u044C \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0438\u0439 \u0443 \u0437\u0430\u0441\u0442\u043E\u0441\u0443\u043D\u043A\u0443 OKX \u0456 Telegram"
    },
    connectApp: "\u041F\u0456\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u0438\u0441\u044F \u0434\u043E \u0437\u0430\u0441\u0442\u043E\u0441\u0443\u043D\u043A\u0430 OKX",
    connectMini: "\u041F\u0456\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u0438\u0441\u044F \u0434\u043E \u043C\u0456\u043D\u0456\u0433\u0430\u043C\u0430\u043D\u0446\u044F OKX"
  }
};
const actionModal$1 = {
  confirmTransaction: {
    header: "\u041F\u0456\u0434\u0442\u0432\u0435\u0440\u0434\u044C\u0442\u0435 \u0442\u0440\u0430\u043D\u0437\u0430\u043A\u0446\u0456\u044E \u0432 {{ name }}",
    text: "\u0426\u0435 \u0437\u0430\u0439\u043C\u0435 \u043B\u0438\u0448\u0435 \u043C\u0438\u0442\u044C."
  }
};
const uk_UA = {
  common: common$1,
  button: button$1,
  notifications: notifications$1,
  walletModal: walletModal$1,
  actionModal: actionModal$1
};
const common = {
  openWallet: "M\u1EDF v\xED",
  get: "Nh\u1EADn",
  close: "\u0110\xF3ng",
  retry: "Th\u1EED l\u1EA1i"
};
const button = {
  connectWallet: "K\u1EBFt n\u1ED1i v\xED",
  dropdown: {
    copy: "Sao ch\xE9p \u0111\u1ECBa ch\u1EC9",
    copied: "\u0110\xE3 sao ch\xE9p \u0111\u1ECBa ch\u1EC9",
    disconnect: "Ng\u1EAFt k\u1EBFt n\u1ED1i"
  }
};
const notifications = {
  confirm: {
    header: "M\u1EDF {{ name }} \u0111\u1EC3 x\xE1c nh\u1EADn giao d\u1ECBch."
  },
  transactionSent: {
    header: "\u0110\xE3 g\u1EEDi giao d\u1ECBch",
    text: "Giao d\u1ECBch c\u1EE7a b\u1EA1n s\u1EBD \u0111\u01B0\u1EE3c x\u1EED l\xFD trong v\xE0i gi\xE2y."
  },
  transactionCanceled: {
    header: "\u0110\xE3 h\u1EE7y giao d\u1ECBch",
    text: "Kh\xF4ng c\xF3 thay \u0111\u1ED5i n\xE0o v\u1EDBi t\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n."
  }
};
const walletModal = {
  mobileConnectionModal: {
    showQR: "Hi\u1EC3n th\u1ECB m\xE3 QR",
    scanQR: "Qu\xE9t m\xE3 QR b\xEAn d\u01B0\u1EDBi b\u1EB1ng m\xE1y \u1EA3nh \u0111i\u1EC7n tho\u1EA1i ho\u1EB7c {{ name }} c\u1EE7a b\u1EA1n",
    continueIn: "Ti\u1EBFp t\u1EE5c giao d\u1ECBch tr\xEAn V\xED Web3 OKX",
    connectionDeclined: "K\u1EBFt n\u1ED1i kh\xF4ng th\xE0nh c\xF4ng",
    PoweredBy: "Powered by",
    appAndTelegram: {
      header: "Connect to OKX Wallet",
      text: "V\xED Web3 OKX hi\u1EC7n c\xF3 tr\xEAn c\u1EA3 \u1EE8ng d\u1EE5ng OKX v\xE0 Telegram"
    },
    connectApp: "K\u1EBFt n\u1ED1i \u1EE8ng d\u1EE5ng OKX",
    connectMini: "K\u1EBFt n\u1ED1i V\xED Web3 OKX Mini"
  }
};
const actionModal = {
  confirmTransaction: {
    header: "X\xE1c nh\u1EADn giao d\u1ECBch trong {{ name }}",
    text: "N\xF3 ch\u1EC9 m\u1EA5t ch\xFAt th\u1EDDi gian."
  }
};
const vi_VN = {
  common,
  button,
  notifications,
  walletModal,
  actionModal
};
const i18nDictionary = {
  en_US: parseDictionary(en),
  ru_RU: parseDictionary(ru),
  zh_CN: parseDictionary(zh_CN),
  zh: parseDictionary(zh_CN),
  ar_AE: parseDictionary(ar_AE),
  cs_CZ: parseDictionary(cs_CZ),
  de_DE: parseDictionary(de_DE),
  es_ES: parseDictionary(es_ES),
  es_LAT: parseDictionary(es_LAT),
  fr_FR: parseDictionary(fr_FR),
  id_ID: parseDictionary(id_ID),
  it_IT: parseDictionary(it_IT),
  nl_NL: parseDictionary(nl_NL),
  pl_PL: parseDictionary(pl_PL),
  pt_BR: parseDictionary(pt_BR),
  pt_PT: parseDictionary(pt_PT),
  ro_RO: parseDictionary(ro_RO),
  tr_TR: parseDictionary(tr_TR),
  uk_UA: parseDictionary(uk_UA),
  vi_VN: parseDictionary(vi_VN)
};
function parseDictionary(dictionary) {
  const refSymbol = "$";
  const iterate = (subDictionary) => {
    Object.entries(subDictionary).forEach(([key, value]) => {
      if (typeof value === "object" && value) {
        return iterate(value);
      }
      if (typeof value === "string") {
        if (value[0] === refSymbol) {
          const path = value.slice(1).split(".");
          let obj = dictionary;
          path.forEach((item) => {
            if (item in obj) {
              obj = obj[item];
            } else {
              throw new Error(
                `Cannot parse translations: there is no property ${item} in translation`
              );
            }
          });
          subDictionary[key] = obj;
        }
        if (value.slice(0, 2) === `\\${refSymbol}`) {
          subDictionary[key] = value.slice(1);
        }
      }
    });
  };
  iterate(dictionary);
  return dictionary;
}
const defaultLightColorsSet = {
  constant: {
    black: "#000000",
    white: "#FFFFFF"
  },
  connectButton: {
    background: "#0098EA",
    foreground: "#FFFFFF"
  },
  accent: "#0098EA",
  telegramButton: "#0098EA",
  qrFill: "#000000",
  icon: {
    primary: "#0F0F0F",
    secondary: "#7A8999",
    tertiary: "#C1CAD2",
    success: "#29CC6A",
    error: "#F5A73B"
  },
  background: {
    primary: "#FFFFFF",
    secondary: "#F1F3F5",
    segment: "#FFFFFF",
    tint: "#F1F3F5",
    qr: "#FFFFFF"
  },
  text: {
    primary: "#000000",
    secondary: "#6A7785",
    contrast: "#909090"
  },
  border: {
    primary: "#00000014",
    secondary: "#00000024"
  },
  disable: "#B3B3B3"
};
const defaultDarkColorsSet = {
  constant: {
    black: "#000000",
    white: "#FFFFFF"
  },
  connectButton: {
    background: "#0098EA",
    foreground: "#FFFFFF"
  },
  accent: "#E5E5EA",
  telegramButton: "#31A6F5",
  qrFill: "#FFFFFF",
  icon: {
    primary: "#E5E5EA",
    secondary: "#909099",
    tertiary: "#434347",
    success: "#29CC6A",
    error: "#F5A73B"
  },
  background: {
    primary: "#121214",
    secondary: "#18181A",
    segment: "#262629",
    tint: "#222224",
    qr: "#121214"
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#7D7D85",
    contrast: "#909090"
  },
  border: {
    primary: "#FFFFFF1F",
    secondary: "#FFFFFF30"
  },
  disable: "#5B5B5B"
};
const [themeState, setThemeState] = createStore({
  theme: THEME.LIGHT,
  colors: defaultLightColorsSet,
  borderRadius: "m"
});
const themeColorsMappingDefault = {
  [THEME.LIGHT]: defaultLightColorsSet,
  [THEME.DARK]: defaultDarkColorsSet
};
({
  [THEME.LIGHT]: void 0,
  [THEME.DARK]: void 0
});
function setTheme(theme) {
  setThemeState({
    theme,
    colors: themeColorsMappingDefault[theme]
  });
}
const ActionModalStyled = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 8px;
`;
const H1Styled = styled(H1)`
    margin-top: 16px;
`;
const TextStyled = styled(Text)`
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    max-width: 250px;
    margin-top: 10px;
    color: ${(props) => props.theme.colors.text.contrast};
`;
styled(Button)`
    min-width: 112px;
    margin-top: 32px;
`;
styled(LoaderIcon)`
    height: 16px;
    width: 16px;
`;
const ButtonStyled = styled.div`
    margin-top: 24px;
  background-color: ${(props) => props.theme.colors.text.primary};
  height: 48px;
  width: 262px;
  justify-content: center;
  border-radius: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
`;
const ActionModal = (props) => {
  const dataAttrs = useDataAttributes(props);
  const connectUI = useContext(OKXConnectUiContext);
  const [firstClick, setFirstClick] = createSignal(true);
  const [sent, setSent] = createSignal(false);
  const theme = useTheme();
  const {
    action
  } = useContext(ActionsModalContext);
  createEffect(() => {
    const currentAction = action;
    setSent(!!currentAction && "sent" in currentAction && currentAction.sent);
  });
  let universalLink = connectUI == null ? void 0 : connectUI.universalLink;
  const onOpenWallet = () => {
    tonsdk.logDebug("ActionModal ====> onOpenWallet ");
    !firstClick();
    setFirstClick(false);
    redirectToWallet(universalLink, "okx://web3?stack=true", {
      returnStrategy: "none",
      forceRedirect: false
    }, () => {
    });
  };
  return createComponent(ActionModalStyled, mergeProps(dataAttrs, {
    get children() {
      return [createMemo(() => props.icon), createComponent(H1Styled, {
        get translationKey() {
          return props.headerTranslationKey;
        },
        get translationValues() {
          return props.headerTranslationValues;
        }
      }), createComponent(TextStyled, {
        get translationKey() {
          return props.textTranslationKey;
        },
        get translationValues() {
          return props.textTranslationValues;
        }
      }), createComponent(Show, {
        get when() {
          return connectUI == null ? void 0 : connectUI.showActionButton();
        },
        get children() {
          return [createComponent(Show, {
            get when() {
              return props.showButton === "close";
            },
            get children() {
              return createComponent(ButtonStyled, {
                onClick: () => props.onClose(),
                get children() {
                  return createComponent(Text, {
                    fontWeight: 700,
                    fontSize: "16px",
                    get color() {
                      return theme.colors.background.primary;
                    },
                    get children() {
                      return createComponent(Translation, {
                        translationKey: "common.close",
                        children: "Close"
                      });
                    }
                  });
                }
              });
            }
          }), createComponent(Show, {
            get when() {
              return props.showButton === "open-wallet";
            },
            get children() {
              return createComponent(ButtonStyled, {
                onClick: onOpenWallet,
                get children() {
                  return createComponent(Text, {
                    fontWeight: 700,
                    fontSize: "16px",
                    get color() {
                      return theme.colors.background.primary;
                    },
                    get children() {
                      return createComponent(Translation, {
                        translationKey: "common.openWallet",
                        children: "Open wallet"
                      });
                    }
                  });
                }
              });
            }
          })];
        }
      })];
    }
  }));
};
const ConfirmTransactionModal = (props) => {
  const tonConnectUI = useContext(OKXConnectUiContext);
  const [t2] = useI18n();
  const name = () => tonConnectUI.walletName ? tonConnectUI.walletName : t2("common.yourWallet", {}, "Your wallet");
  return createComponent(ActionModal, {
    headerTranslationKey: "actionModal.confirmTransaction.header",
    get headerTranslationValues() {
      return {
        name: name()
      };
    },
    textTranslationKey: "actionModal.confirmTransaction.text",
    get icon() {
      return createComponent(OKXLoaderIconWithLogo, {});
    },
    onClose: () => props.onClose(),
    get showButton() {
      return isMobile() ? "open-wallet" : void 0;
    },
    "data-tc-confirm-modal": "true"
  });
};
const TransactionCanceledModal = (props) => {
  return createComponent(ActionModal, {
    headerTranslationKey: "actionModal.transactionCanceled.header",
    textTranslationKey: "actionModal.transactionCanceled.text",
    get icon() {
      return createComponent(ErrorIcon, {
        size: "m"
      });
    },
    onClose: () => props.onClose(),
    get showButton() {
      return isMobile() ? "close" : void 0;
    },
    "data-tc-transaction-canceled-modal": "true"
  });
};
const TransactionSentModal = (props) => {
  return createComponent(ActionModal, {
    headerTranslationKey: "actionModal.transactionSent.header",
    textTranslationKey: "actionModal.transactionSent.text",
    get icon() {
      return createComponent(SuccessIcon, {
        size: "m"
      });
    },
    onClose: () => props.onClose(),
    get showButton() {
      return isMobile() ? "close" : void 0;
    },
    "data-tc-transaction-sent-modal": "true"
  });
};
const ActionsModalContext = createContext({
  action: null
});
const ActionsModal = (props) => {
  createEffect(() => {
    console.log("ActionsModal", props.action);
  });
  return createComponent(ActionsModalContext.Provider, {
    get value() {
      return {
        action: props.action
      };
    },
    get children() {
      return createComponent(Modal, {
        get opened() {
          var _a2;
          return props.action !== null && ((_a2 = props.action) == null ? void 0 : _a2.openModal) === true;
        },
        onClose: () => props.setAction(null),
        "data-tc-actions-modal-container": "true",
        get children() {
          return createComponent(Switch, {
            get children() {
              return [createComponent(Match, {
                get when() {
                  return props.action.name === "transaction-sent";
                },
                get children() {
                  return createComponent(TransactionSentModal, {
                    onClose: () => props.setAction(null)
                  });
                }
              }), createComponent(Match, {
                get when() {
                  return props.action.name === "transaction-canceled";
                },
                get children() {
                  return createComponent(TransactionCanceledModal, {
                    onClose: () => props.setAction(null)
                  });
                }
              }), createComponent(Match, {
                get when() {
                  return props.action.name === "confirm-transaction";
                },
                get children() {
                  return createComponent(ConfirmTransactionModal, {
                    onClose: () => props.setAction(null)
                  });
                }
              })];
            }
          });
        }
      });
    }
  });
};
const TONApp = (props) => {
  const translations = createI18nContext(i18nDictionary, appState.language);
  defineStylesRoot();
  fixMobileSafariActiveTransition();
  setAppState({
    contextType: "TONContext"
  });
  return createComponent(I18nContext.Provider, {
    value: translations,
    get children() {
      return createComponent(OKXConnectUiContext.Provider, {
        get value() {
          return props.connectUI;
        },
        get children() {
          return createComponent(ConnectorContext.Provider, {
            get value() {
              return appState.tonConnector;
            },
            get children() {
              return [createComponent(GlobalStyles, {}), createComponent(ThemeProvider, {
                theme: themeState,
                get children() {
                  return [createComponent(Show, {
                    get when() {
                      return appState.buttonRootId;
                    },
                    get children() {
                      return createComponent(Portal, {
                        get mount() {
                          return document.getElementById(appState.buttonRootId);
                        },
                        get children() {
                          return createComponent(AccountButton, {});
                        }
                      });
                    }
                  }), createComponent(Dynamic, {
                    component: globalStylesTag,
                    get children() {
                      return [createComponent(TonSingleWalletModal, {}), createComponent(ActionsModal, {
                        get action() {
                          return tonAction();
                        },
                        setAction: setTonAction
                      })];
                    }
                  })];
                }
              })];
            }
          });
        }
      });
    }
  });
};
const [universalWalletsModalState, setUniversalWalletsModalState] = createSignal({
  status: "closed",
  closeReason: null
});
createMemo(
  () => universalWalletsModalState().status === "opened"
);
const [universalSingleWalletModalState, setUniversalSingleWalletModalState] = createSignal({
  status: "closed",
  closeReason: null
});
const getUniversalSingleWalletModalIsOpened = createMemo(
  () => universalSingleWalletModalState().status === "opened"
);
const getUniversalSingleWalletModalWalletInfo = createMemo(() => {
  const state = universalSingleWalletModalState();
  if (state.status === "opened") {
    return state.walletInfo;
  }
  return null;
});
let lastSelectedWalletInfoStorage = typeof window !== "undefined" ? new LastSelectedWalletInfoStorage() : void 0;
const [lastUniversalSelectedWalletInfo, _setLastUniversalSelectedWalletInfo] = createSignal((lastSelectedWalletInfoStorage == null ? void 0 : lastSelectedWalletInfoStorage.getLastSelectedWalletInfo()) || null);
const setLastUniversalSelectedWalletInfo = (walletInfo) => {
  if (!lastSelectedWalletInfoStorage) {
    lastSelectedWalletInfoStorage = new LastSelectedWalletInfoStorage();
  }
  if (walletInfo) {
    logDebug(`modals-state.ts: setLastSelectedWalletInfo ${JSON.stringify(walletInfo)}`);
    lastSelectedWalletInfoStorage.setLastSelectedWalletInfo(walletInfo);
  } else {
    logDebug("modals-state.ts: setLastSelectedWalletInfo    removeLastSelectedWalletInfo");
    lastSelectedWalletInfoStorage.removeLastSelectedWalletInfo();
  }
  _setLastUniversalSelectedWalletInfo(walletInfo);
};
const [universalAction, setUniversalAction] = createSignal(null);
const UniversalSingleWalletModal = () => {
  const tonConnectUI = useContext(OKXConnectUiContext);
  const connector = useContext(UniversalConnectorContext);
  const [universalLinkParams, setUniversalLinkParams] = createSignal(null);
  const onClose = (closeReason) => {
    tonConnectUI.closeModal(closeReason);
  };
  connector == null ? void 0 : connector.on("okx_engine_connect_params", (info) => {
    core.logDebug(`UniversalSigneWalletModal  okx_engine_connect_params  ${JSON.stringify(info)}`);
    setUniversalLinkParams(info);
  });
  return createComponent(SingleWalletModal, {
    get opened() {
      return getUniversalSingleWalletModalIsOpened();
    },
    get walletInfo() {
      return getUniversalSingleWalletModalWalletInfo();
    },
    loadingBeforeConnect: () => {
      return false;
    },
    connect: () => {
      return new Promise((resolve, reject) => {
        var _a2, _b2;
        if (appState.universalConnectRequestParameters) {
          new OKXConnectUiError("connect params is nil");
        }
        let opts = __spreadValues({}, JSON.parse(JSON.stringify(appState.universalConnectRequestParameters)));
        opts.sessionConfig = {};
        opts.sessionConfig.openUniversalUrl = defaultOpenUniversalLink((_a2 = appState.universalConnectRequestParameters) == null ? void 0 : _a2.namespaces, (_b2 = appState.universalConnectRequestParameters) == null ? void 0 : _b2.optionalNamespaces);
        setUniversalLinkParams(null);
        tonConnectUI.handleConnect((actionConfiguration) => {
          opts.sessionConfig.tmaReturnUrl = actionConfiguration == null ? void 0 : actionConfiguration.tmaReturnUrl;
          opts.sessionConfig.redirect = actionConfiguration == null ? void 0 : actionConfiguration.returnStrategy;
          return connector.connect(opts);
        }).then((session) => {
          if (session) {
            onClose("wallet-selected");
            resolve(session);
          } else {
            onClose("action-cancelled");
          }
        }).catch((error) => {
          onClose("action-cancelled");
          core.logDebug("UniversalSingleWalletModal connect  error", JSON.stringify(error));
          setUniversalLinkParams(null);
          reject(error);
        });
      });
    },
    onClose,
    universalLinkParams,
    get isSingleWallet() {
      var _a2, _b2;
      return !showUniversalTgWalletByRequestNameSpaces((_a2 = appState.universalConnectRequestParameters) == null ? void 0 : _a2.namespaces, (_b2 = appState.universalConnectRequestParameters) == null ? void 0 : _b2.optionalNamespaces);
    },
    get lastSelectedWalletInfo() {
      return lastUniversalSelectedWalletInfo();
    },
    setLastSelectedWalletInfo: setLastUniversalSelectedWalletInfo
  });
};
const UniversalApp = (props) => {
  const translations = createI18nContext(i18nDictionary, appState.language);
  defineStylesRoot();
  fixMobileSafariActiveTransition();
  setAppState({
    contextType: "UniversalContext"
  });
  return createComponent(I18nContext.Provider, {
    value: translations,
    get children() {
      return createComponent(OKXConnectUiContext.Provider, {
        get value() {
          return props.connectUI;
        },
        get children() {
          return createComponent(UniversalConnectorContext.Provider, {
            get value() {
              return appState.universalConnector;
            },
            get children() {
              return [createComponent(GlobalStyles, {}), createComponent(ThemeProvider, {
                theme: themeState,
                get children() {
                  return createComponent(Dynamic, {
                    component: globalStylesTag,
                    get children() {
                      return [createComponent(UniversalSingleWalletModal, {}), createComponent(ActionsModal, {
                        get action() {
                          return universalAction();
                        },
                        setAction: setUniversalAction
                      })];
                    }
                  });
                }
              })];
            }
          });
        }
      });
    }
  });
};
const tonWidgetController = {
  openSingleWalletModal: (walletInfo) => {
    core.logDebug(`tonWidgetController : openSingleWalletModal : ${JSON.stringify(walletInfo)}`);
    void setTimeout(() => setTonSingleWalletModalState({
      status: "opened",
      closeReason: null,
      walletInfo
    }));
  },
  closeSingleWalletModal: (reason) => void setTimeout(() => setTonSingleWalletModalState({
    status: "closed",
    closeReason: reason
  })),
  setAction: (action) => void setTimeout(() => setTonAction(action)),
  clearAction: () => void setTimeout(() => {
    console.log("clearAction");
    setTonAction(null);
  }),
  getSelectedWalletInfo: () => lastTonSelectedWalletInfo(),
  removeSelectedWalletInfo: () => setLastTonSelectedWalletInfo(null),
  renderApp: (root, connectUI) => {
    return render(() => createComponent(TONApp, {
      connectUI
    }), document.getElementById(root));
  },
  renderUniversalApp: (root, connectUI) => {
    return render(() => createComponent(UniversalApp, {
      connectUI
    }), document.getElementById(root));
  }
};
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
function isObject(o2) {
  return Object.prototype.toString.call(o2) === "[object Object]";
}
function isPlainObject(o2) {
  var ctor, prot;
  if (isObject(o2) === false)
    return false;
  ctor = o2.constructor;
  if (ctor === void 0)
    return true;
  prot = ctor.prototype;
  if (isObject(prot) === false)
    return false;
  if (prot.hasOwnProperty("isPrototypeOf") === false) {
    return false;
  }
  return true;
}
function mergeOptions(options, defaultOptions) {
  if (!options) {
    return defaultOptions;
  }
  const overwriteMerge = (_, sourceArray, __) => sourceArray;
  return deepmerge__default.default(defaultOptions, options, {
    arrayMerge: overwriteMerge,
    isMergeableObject: isPlainObject
  });
}
class TransactionModalManager {
  constructor() {
    __publicField(this, "consumers", []);
    createEffect(() => {
      const currentAction = tonAction();
      this.consumers.forEach((consumer) => consumer(currentAction));
    });
  }
  onStateChange(consumer) {
    this.consumers.push(consumer);
    return () => {
      this.consumers = this.consumers.filter((c2) => c2 !== consumer);
    };
  }
}
var OKX_UI_CONNECTION_AND_TRANSACTION_EVENT = /* @__PURE__ */ ((OKX_UI_CONNECTION_AND_TRANSACTION_EVENT2) => {
  OKX_UI_CONNECTION_AND_TRANSACTION_EVENT2["OKX_UI_CONNECTION_STARTED"] = "okx-connect-ui-connection-started";
  OKX_UI_CONNECTION_AND_TRANSACTION_EVENT2["OKX_UI_CONNECTION_COMPLETED"] = "okx-connect-ui-connection-completed";
  OKX_UI_CONNECTION_AND_TRANSACTION_EVENT2["OKX_UI_CONNECTION_ERROR"] = "okx-connect-ui-connection-error";
  OKX_UI_CONNECTION_AND_TRANSACTION_EVENT2["OKX_UI_CONNECTION_RESTORING_STARTED"] = "okx-connect-ui-connection-restoring-started";
  OKX_UI_CONNECTION_AND_TRANSACTION_EVENT2["OKX_UI_CONNECTION_RESTORING_COMPLETED"] = "okx-connect-ui-connection-restoring-completed";
  OKX_UI_CONNECTION_AND_TRANSACTION_EVENT2["OKX_UI_CONNECTION_RESTORING_ERROR"] = "okx-connect-ui-connection-restoring-error";
  OKX_UI_CONNECTION_AND_TRANSACTION_EVENT2["OKX_UI_DISCONNECTION"] = "okx-connect-ui-disconnection";
  OKX_UI_CONNECTION_AND_TRANSACTION_EVENT2["OKX_UI_TRANSACTION_SENT_FOR_SIGNATURE"] = "okx-connect-ui-transaction-sent-for-signature";
  OKX_UI_CONNECTION_AND_TRANSACTION_EVENT2["OKX_UI_TRANSACTION_SIGNED"] = "okx-connect-ui-transaction-signed";
  OKX_UI_CONNECTION_AND_TRANSACTION_EVENT2["OKX_UI_TRANSACTION_SIGNING_FAILED"] = "okx-connect-ui-transaction-signing-failed";
  return OKX_UI_CONNECTION_AND_TRANSACTION_EVENT2;
})(OKX_UI_CONNECTION_AND_TRANSACTION_EVENT || {});
class OKXTonConnectUITracker {
  constructor(options) {
    __publicField(this, "eventPrefix", "okx-connect-ui-");
    __publicField(this, "OKXConnectUiVersion");
    __publicField(this, "OKXtonConnectSdkVersion", null);
    __publicField(this, "eventDispatcher");
    var _a2;
    this.eventDispatcher = (_a2 = options == null ? void 0 : options.eventDispatcher) != null ? _a2 : new tonsdk.BrowserEventDispatcher();
    this.OKXConnectUiVersion = options.tonConnectUiVersion;
    this.init().catch();
  }
  get version() {
    return tonsdk.createVersionInfo({
      okx_ton_connect_sdk_lib: this.OKXtonConnectSdkVersion,
      okx_connect_ui_lib: this.OKXConnectUiVersion
    });
  }
  init() {
    return __async(this, null, function* () {
      try {
        yield this.setRequestVersionHandler();
        this.OKXtonConnectSdkVersion = yield this.requestTonConnectSdkVersion();
      } catch (e2) {
        console.log(`okx-ton-connect-response-version  init error  ====> requestTonConnectSdkVersion`);
      }
    });
  }
  setRequestVersionHandler() {
    return __async(this, null, function* () {
      yield this.eventDispatcher.addEventListener("okx-connect-ui-request-version", () => __async(this, null, function* () {
        yield this.eventDispatcher.dispatchEvent(
          "okx-connect-ui-response-version",
          tonsdk.createResponseVersionEvent(this.OKXConnectUiVersion)
        );
      }));
    });
  }
  requestTonConnectSdkVersion() {
    return __async(this, null, function* () {
      return new Promise((resolve, reject) => __async(this, null, function* () {
        try {
          yield this.eventDispatcher.addEventListener(
            "okx-ton-connect-response-version",
            (event) => {
              resolve(event.detail.version);
            },
            { once: true }
          );
          yield this.eventDispatcher.dispatchEvent(
            "okx-ton-connect-request-version",
            tonsdk.createRequestVersionEvent()
          );
        } catch (e2) {
          console.log(`okx-ton-connect-response-version    ====> ${e2.message}`);
          reject(e2);
        }
      }));
    });
  }
  dispatchUserActionEvent(eventDetails) {
    var _a2;
    try {
      (_a2 = this.eventDispatcher) == null ? void 0 : _a2.dispatchEvent(`${this.eventPrefix}${eventDetails.type}`, eventDetails).catch();
    } catch (e2) {
    }
  }
  trackConnectionStarted(...args) {
    try {
      const event = tonsdk.createConnectionStartedEvent(this.version, ...args);
      this.dispatchUserActionEvent(event);
    } catch (e2) {
    }
  }
  trackConnectionCompleted(...args) {
    try {
      const event = tonsdk.createConnectionCompletedEvent(this.version, ...args);
      this.dispatchUserActionEvent(event);
    } catch (e2) {
    }
  }
  trackConnectionError(...args) {
    try {
      const event = tonsdk.createConnectionErrorEvent(this.version, ...args);
      this.dispatchUserActionEvent(event);
    } catch (e2) {
    }
  }
  trackConnectionRestoringStarted(...args) {
    try {
      const event = tonsdk.createConnectionRestoringStartedEvent(this.version, ...args);
      this.dispatchUserActionEvent(event);
    } catch (e2) {
    }
  }
  trackConnectionRestoringCompleted(...args) {
    try {
      const event = tonsdk.createConnectionRestoringCompletedEvent(this.version, ...args);
      this.dispatchUserActionEvent(event);
    } catch (e2) {
    }
  }
  trackConnectionRestoringError(...args) {
    try {
      const event = tonsdk.createConnectionRestoringErrorEvent(this.version, ...args);
      this.dispatchUserActionEvent(event);
    } catch (e2) {
    }
  }
  trackDisconnection(...args) {
    try {
      const event = tonsdk.createDisconnectionEvent(this.version, ...args);
      this.dispatchUserActionEvent(event);
    } catch (e2) {
    }
  }
  trackTransactionSentForSignature(...args) {
    try {
      const event = tonsdk.createTransactionSentForSignatureEvent(this.version, ...args);
      this.dispatchUserActionEvent(event);
    } catch (e2) {
    }
  }
  trackTransactionSigned(...args) {
    try {
      const event = tonsdk.createTransactionSignedEvent(this.version, ...args);
      this.dispatchUserActionEvent(event);
    } catch (e2) {
    }
  }
  trackTransactionSigningFailed(...args) {
    try {
      const event = tonsdk.createTransactionSigningFailedEvent(this.version, ...args);
      this.dispatchUserActionEvent(event);
    } catch (e2) {
    }
  }
}
const tonConnectUiVersion = "1";
class TonSingleWalletModalManager {
  constructor(options) {
    __publicField(this, "consumers", []);
    __publicField(this, "getWalltsInfo");
    __publicField(this, "state", tonSingleWalletModalState());
    this.getWalltsInfo = options.getWalltsInfo;
    createEffect(() => {
      const state = tonSingleWalletModalState();
      this.state = state;
      this.consumers.forEach((consumer) => consumer(state));
    });
  }
  open(wallet) {
    return __async(this, null, function* () {
      const fetchedWalletsList = this.getWalltsInfo();
      const walletsList = fetchedWalletsList;
      const externalWallets = walletsList;
      const externalWallet = externalWallets.find((walletInfo) => eqWalletName(walletInfo, wallet));
      if (externalWallet) {
        return this.openSingleWalletModal(externalWallet);
      }
      const error = `Trying to open modal window with unknown wallet "${wallet}".`;
      throw new OKXConnectUiError(error);
    });
  }
  close(reason = "action-cancelled") {
    tonWidgetController.closeSingleWalletModal(reason);
  }
  onStateChange(onChange) {
    this.consumers.push(onChange);
    return () => {
      this.consumers = this.consumers.filter((consumer) => consumer !== onChange);
    };
  }
  handleConnect(connectMethod, actionConfiguration) {
    return __async(this, null, function* () {
      return new Promise((resolve, reject) => {
        try {
          connectMethod(actionConfiguration).then((result) => {
            resolve(result);
            core.logDebug("TonSingleWalletModalManager  result >>>", JSON.stringify(result));
          }).catch((error) => {
            reject(error);
            core.logDebug("TonSingleWalletModalManager  error >>>", JSON.stringify(error));
          });
        } catch (error) {
          reject(error);
          core.logDebug("TonSingleWalletModalManager  catch error >>>", JSON.stringify(error));
        }
      });
    });
  }
  openSingleWalletModal(wallet) {
    return __async(this, null, function* () {
      if (isInTMA()) {
        sendExpand();
      }
      tonWidgetController.openSingleWalletModal(wallet);
      return new Promise((resolve) => {
        const unsubscribe = this.onStateChange((state) => {
          const { status } = state;
          if (status === "opened") {
            unsubscribe();
            resolve();
          }
        });
      });
    });
  }
}
const validLocales = [
  "en_US",
  "ru_RU",
  "zh_CN",
  "zh",
  "ar_AE",
  "cs_CZ",
  "de_DE",
  "es_ES",
  "es_LAT",
  "fr_FR",
  "id_ID",
  "it_IT",
  "nl_NL",
  "pl_PL",
  "pt_BR",
  "pt_PT",
  "ro_RO",
  "tr_TR",
  "uk_UA",
  "vi_VN"
];
function isValidLocale(locale) {
  return validLocales.includes(locale);
}
class OKXTonConnectUI {
  constructor(options) {
    __publicField(this, "walletInfoStorage", new WalletInfoStorage("okx-wallet-connect-ui-ton_wallet-info"));
    __publicField(this, "tracker");
    __publicField(this, "walletInfo", null);
    __publicField(this, "systemThemeChangeUnsubscribe", null);
    __publicField(this, "actionsConfiguration");
    __publicField(this, "walletsList");
    __publicField(this, "connectRequestParametersCallback");
    __publicField(this, "connector");
    __publicField(this, "singleWalletModal");
    __publicField(this, "transactionModal");
    __publicField(this, "connectionRestored", Promise.resolve(false));
    __publicField(this, "dispose");
    if (options && "dappMetaData" in options && options.dappMetaData) {
      this.connector = new tonsdk.OKXTonConnect({ metaData: options.dappMetaData });
    } else {
      throw new OKXConnectUiError(
        "You have to specify a `dappMetaData`in the options."
      );
    }
    if (options.language && !isValidLocale(options.language.toString())) {
      options.language = "en_US";
    }
    this.tracker = new OKXTonConnectUITracker({
      eventDispatcher: null,
      tonConnectUiVersion
    });
    this.singleWalletModal = new TonSingleWalletModalManager({
      getWalltsInfo: () => tonsdk.OKXTonConnect.getWallets()
    });
    this.transactionModal = new TransactionModalManager();
    this.walletsList = this.getWallets();
    preloadImages(uniq(this.walletsList.map((item) => item.imageUrl)));
    const rootId = this.normalizeWidgetRoot(void 0);
    this.subscribeToWalletChange();
    if ((options == null ? void 0 : options.restoreConnection) !== false) {
      this.connectionRestored = createMacrotaskAsync(() => __async(this, null, function* () {
        this.tracker.trackConnectionRestoringStarted();
        yield this.connector.restoreConnection();
        if (!this.connector.connected) {
          this.tracker.trackConnectionRestoringError("Connection was not restored");
          this.walletInfoStorage.removeWalletInfo();
        } else {
          this.tracker.trackConnectionRestoringCompleted(this.wallet);
        }
        return this.connector.connected;
      }));
    }
    this.uiOptions = mergeOptions(options, { uiPreferences: { theme: "SYSTEM" } });
    setAppState({
      tonConnector: this.connector,
      preferredWalletAppName: void 0
    });
    this.dispose = tonWidgetController.renderApp(rootId, this);
  }
  static getWallets() {
    return tonsdk.OKXTonConnect.getWallets();
  }
  get connected() {
    return this.connector.connected;
  }
  get account() {
    return this.connector.account;
  }
  get wallet() {
    if (!this.connector.wallet) {
      return null;
    }
    return __spreadValues(__spreadValues({}, this.connector.wallet), this.walletInfo);
  }
  get universalLink() {
    if (this.wallet && "universalLink" in this.wallet) {
      return this.wallet.universalLink;
    }
    return void 0;
  }
  get deepLink() {
    if (this.wallet && "deepLink" in this.wallet) {
      return this.wallet.deepLink;
    }
    return void 0;
  }
  get walletName() {
    if (this.wallet && "name" in this.wallet) {
      return this.wallet.name;
    }
    return void 0;
  }
  set uiOptions(options) {
    var _a2, _b2, _c2;
    this.checkButtonRootExist(options.buttonRootId);
    this.actionsConfiguration = options.actionsConfiguration;
    if ((_a2 = options.uiPreferences) == null ? void 0 : _a2.theme) {
      if (((_b2 = options.uiPreferences) == null ? void 0 : _b2.theme) !== "SYSTEM") {
        (_c2 = this.systemThemeChangeUnsubscribe) == null ? void 0 : _c2.call(this);
        setTheme(options.uiPreferences.theme);
      } else {
        setTheme(getSystemTheme());
        if (!this.systemThemeChangeUnsubscribe) {
          this.systemThemeChangeUnsubscribe = subscribeToThemeChange(setTheme);
        }
      }
    }
    setAppState((state) => {
      var _a3, _b3;
      const merged = mergeOptions(
        __spreadValues(__spreadValues(__spreadValues({}, options.language && { language: options.language }), !!((_a3 = options.actionsConfiguration) == null ? void 0 : _a3.returnStrategy) && {
          returnStrategy: options.actionsConfiguration.returnStrategy
        }), ((_b3 = options.actionsConfiguration) == null ? void 0 : _b3.tmaReturnUrl) && {
          tmaReturnUrl: options.actionsConfiguration.tmaReturnUrl
        }),
        unwrap(state)
      );
      if (options.buttonRootId !== void 0) {
        merged.buttonRootId = options.buttonRootId;
      }
      return merged;
    });
  }
  destory() {
    if (this.dispose) {
      this.dispose();
    }
  }
  setConnectRequestParameters(connectRequestParameters) {
    var _a2;
    setAppState({ connectRequestParameters });
    if ((connectRequestParameters == null ? void 0 : connectRequestParameters.state) === "ready" || !connectRequestParameters) {
      (_a2 = this.connectRequestParametersCallback) == null ? void 0 : _a2.call(this, {
        tonProof: connectRequestParameters.value.tonProof
      });
    }
  }
  getWallets() {
    return [core.creatOKXWalletInfo(), core.creatOKXMiniAppWalletInfo()];
  }
  onStatusChange(callback, errorsHandler) {
    return this.connector.onStatusChange((wallet) => __async(this, null, function* () {
      if (wallet) {
        yield this.getSelectedWalletInfo(wallet);
        let info = this.getWalletInfo(wallet);
        core.logDebug("OKXTonConnectUI onStatusChange info :", JSON.stringify(info));
        core.logDebug("OKXTonConnectUI onStatusChange wallet :", JSON.stringify(wallet));
        callback(__spreadValues(__spreadValues({}, wallet), info || this.getWallets()[0]));
      } else {
        callback(wallet);
      }
    }), errorsHandler);
  }
  handleConnect(connectMethod) {
    return __async(this, null, function* () {
      return this.singleWalletModal.handleConnect(connectMethod, this.actionsConfiguration);
    });
  }
  openModal() {
    return __async(this, null, function* () {
      return new Promise((_, reject) => __async(this, null, function* () {
        yield Promise.all(
          [
            this.waitForWalletConnection({}),
            this.openSingleWalletModal("okxAppWallet")
          ]
        ).catch((error) => {
          reject(error);
        });
      }));
    });
  }
  closeModal(reason) {
    this.closeSingleWalletModal(reason);
  }
  waitForWalletConnection(options) {
    return __async(this, null, function* () {
      return new Promise((resolve, reject) => {
        const onStatusChangeHandler = (wallet) => __async(this, null, function* () {
          if (!wallet) {
            this.tracker.trackConnectionError("Connection was cancelled");
            unsubscribe();
            reject(new OKXConnectUiError("Wallet was not connected"));
          } else {
            this.tracker.trackConnectionCompleted(wallet);
            unsubscribe();
            resolve(wallet);
          }
        });
        const onErrorsHandler = (reason) => {
          this.tracker.trackConnectionError(reason.message);
          unsubscribe();
          reject(reason);
        };
        const unsubscribe = this.onStatusChange(
          (wallet) => onStatusChangeHandler(wallet),
          (reason) => onErrorsHandler(reason)
        );
      });
    });
  }
  onModalStateChange(onChange) {
    return this.onSingleWalletModalStateChange(onChange);
  }
  get modalState() {
    return this.singleWalletModalState;
  }
  openSingleWalletModal(wallet) {
    return __async(this, null, function* () {
      this.tracker.trackConnectionStarted();
      try {
        return this.singleWalletModal.open(wallet);
      } catch (error) {
        this.tracker.trackConnectionError(error.message);
        throw error;
      }
    });
  }
  closeSingleWalletModal(closeReason) {
    if (closeReason === "action-cancelled") {
      this.tracker.trackConnectionError("Connection was cancelled");
    }
    this.singleWalletModal.close(closeReason);
  }
  onSingleWalletModalStateChange(onChange) {
    return this.singleWalletModal.onStateChange(onChange);
  }
  get singleWalletModalState() {
    return this.singleWalletModal.state;
  }
  disconnect() {
    this.tracker.trackDisconnection(this.wallet, "dapp");
    tonWidgetController.clearAction();
    tonWidgetController.removeSelectedWalletInfo();
    this.walletInfoStorage.removeWalletInfo();
    return this.connector.disconnect();
  }
  sendTransaction(tx, actionConfiguration) {
    return __async(this, null, function* () {
      return this.sendTransactionInner(
        tx,
        {
          returnStrategy: actionConfiguration == null ? void 0 : actionConfiguration.returnStrategy,
          modals: actionConfiguration == null ? void 0 : actionConfiguration.modals
        }
      );
    });
  }
  sendTransactionInner(tx, actionConfiguration) {
    return __async(this, null, function* () {
      var _a2, _b2;
      this.tracker.trackTransactionSentForSignature(this.wallet, tx);
      if (!this.connected) {
        this.tracker.trackTransactionSigningFailed(this.wallet, tx, "Wallet was not connected");
        throw new OKXConnectUiError("Connect wallet to send a transaction.");
      }
      if (isInTMA()) {
        sendExpand();
      }
      const options = {
        returnStrategy: isDevice("mobile") && ((_a2 = lastTonSelectedWalletInfo()) == null ? void 0 : _a2.openMethod) !== "qrcode" ? actionConfiguration == null ? void 0 : actionConfiguration.returnStrategy : "none",
        modals: actionConfiguration == null ? void 0 : actionConfiguration.modals,
        tmaReturnUrl: (_b2 = actionConfiguration == null ? void 0 : actionConfiguration.tmaReturnUrl) != null ? _b2 : "back"
      };
      const { modals, returnStrategy, tmaReturnUrl } = this.getModalsAndNotificationsConfiguration(options);
      tonWidgetController.setAction({
        name: "confirm-transaction",
        openModal: modals.includes("before"),
        sent: false
      });
      const onRequestSent = () => {
        var _a3;
        if (abortController.signal.aborted) {
          return;
        }
        if (!this.connector.openUniversalLink && openWalletForUIRequest(this.walletInfo, (_a3 = lastTonSelectedWalletInfo()) == null ? void 0 : _a3.openMethod)) {
          openTonWallet(this.walletInfo, tmaReturnUrl);
        }
        tonWidgetController.setAction({
          name: "confirm-transaction",
          openModal: modals.includes("before"),
          sent: true
        });
      };
      const abortController = new AbortController();
      const unsubscribe = this.onTransactionModalStateChange((action) => {
        if (action == null ? void 0 : action.openModal) {
          return;
        }
        unsubscribe();
      });
      const transaction = __spreadProps(__spreadValues({}, tx), { redirect: returnStrategy });
      try {
        const result = yield this.waitForSendTransaction(
          {
            transaction,
            signal: abortController.signal
          },
          onRequestSent
        );
        this.tracker.trackTransactionSigned(this.wallet, tx, result);
        tonWidgetController.setAction({
          name: "transaction-sent",
          openModal: modals.includes("success")
        });
        return result;
      } catch (e2) {
        tonWidgetController.setAction({
          name: "transaction-canceled",
          openModal: modals.includes("error")
        });
        if (e2 instanceof core.OKXConnectError) {
          throw e2;
        } else {
          throw new OKXConnectUiError("Unhandled error:" + e2);
        }
      } finally {
        unsubscribe();
      }
    });
  }
  waitForSendTransaction(options, onRequestSent) {
    return __async(this, null, function* () {
      return new Promise((resolve, reject) => {
        var _a2;
        const { transaction, signal } = options;
        if (signal.aborted) {
          this.tracker.trackTransactionSigningFailed(
            this.wallet,
            transaction,
            "Transaction was cancelled"
          );
          return reject(new OKXConnectUiError("Transaction was not sent"));
        }
        const onTransactionHandler = (transaction2) => __async(this, null, function* () {
          resolve(transaction2);
        });
        const onErrorsHandler = (reason) => {
          reject(reason);
        };
        const onCanceledHandler = () => {
          this.tracker.trackTransactionSigningFailed(
            this.wallet,
            transaction,
            "Transaction was cancelled"
          );
          reject(new OKXConnectUiError("Transaction was not sent"));
        };
        signal.addEventListener("abort", onCanceledHandler, { once: true });
        this.connector.sendTransaction(transaction, {
          doNotOpenWallet: !(isMobile() && ((_a2 = lastTonSelectedWalletInfo()) == null ? void 0 : _a2.openMethod) !== "qrcode"),
          onRequestSent
        }).then((result) => {
          signal.removeEventListener("abort", onCanceledHandler);
          return onTransactionHandler(result);
        }).catch((reason) => {
          this.tracker.trackTransactionSigningFailed(
            this.wallet,
            transaction,
            reason.message
          );
          signal.removeEventListener("abort", onCanceledHandler);
          return onErrorsHandler(reason);
        });
      });
    });
  }
  onTransactionModalStateChange(onChange) {
    return this.transactionModal.onStateChange(onChange);
  }
  subscribeToWalletChange() {
    this.connector.onStatusChange((wallet) => __async(this, null, function* () {
      var _a2;
      if (wallet) {
        yield this.updateWalletInfo(wallet);
        this.setPreferredWalletAppName(((_a2 = this.walletInfo) == null ? void 0 : _a2.appName) || wallet.device.appName);
      } else {
        this.walletInfoStorage.removeWalletInfo();
      }
    }));
  }
  setPreferredWalletAppName(value) {
    setAppState({ preferredWalletAppName: value });
  }
  getSelectedWalletInfo(wallet) {
    return __async(this, null, function* () {
      let lastSelectedWalletInfo = tonWidgetController.getSelectedWalletInfo();
      if (!lastSelectedWalletInfo) {
        return null;
      }
      let fullLastSelectedWalletInfo;
      if (!("name" in lastSelectedWalletInfo)) {
        const walletsList = this.walletsList;
        const walletInfo = walletsList.find((item) => eqWalletName(item, wallet.device.appName));
        if (!walletInfo) {
          throw new OKXConnectUiError(
            `Cannot find WalletInfo for the '${wallet.device.appName}' wallet`
          );
        }
        fullLastSelectedWalletInfo = __spreadValues(__spreadValues({}, walletInfo), lastSelectedWalletInfo);
      } else {
        fullLastSelectedWalletInfo = lastSelectedWalletInfo;
      }
      return fullLastSelectedWalletInfo;
    });
  }
  updateWalletInfo(wallet) {
    return __async(this, null, function* () {
      this.walletInfo = this.getWalletInfo(wallet);
      core.logDebug("updateWalletInfo ---this.walletInfo -", JSON.stringify(this.walletInfo));
    });
  }
  getWalletInfo(wallet) {
    core.logDebug("getWalletInfo ----", JSON.stringify(wallet));
    let info = this.walletsList.find(
      (walletInfo) => eqWalletName(walletInfo, wallet.device.appName)
    ) || null;
    core.logDebug("getWalletInfo ---info -", JSON.stringify(info));
    return info;
  }
  normalizeWidgetRoot(rootId) {
    if (!rootId || !document.getElementById(rootId)) {
      rootId = "tc-widget-root";
      const rootElement = document.createElement("div");
      rootElement.id = rootId;
      document.body.appendChild(rootElement);
    }
    return rootId;
  }
  checkButtonRootExist(buttonRootId) {
    if (buttonRootId == null) {
      return;
    }
    if (!document.getElementById(buttonRootId)) {
      throw new OKXConnectUiError(`${buttonRootId} element not found in the document.`);
    }
  }
  getModalsAndNotificationsConfiguration(options) {
    var _a2, _b2, _c2;
    const allActions = [
      "before",
      "success",
      "error"
    ];
    let modals = ["before"];
    if ((_a2 = this.actionsConfiguration) == null ? void 0 : _a2.modals) {
      if (this.actionsConfiguration.modals === "all") {
        modals = allActions;
      } else {
        modals = this.actionsConfiguration.modals;
      }
    }
    if (options == null ? void 0 : options.modals) {
      if (options.modals === "all") {
        modals = allActions;
      } else {
        modals = options.modals;
      }
    }
    const returnStrategy = (options == null ? void 0 : options.returnStrategy) || ((_b2 = this.actionsConfiguration) == null ? void 0 : _b2.returnStrategy) || "back";
    const tmaReturnUrl = (options == null ? void 0 : options.tmaReturnUrl) || ((_c2 = this.actionsConfiguration) == null ? void 0 : _c2.tmaReturnUrl) || "back";
    return {
      modals,
      tmaReturnUrl,
      returnStrategy
    };
  }
  showActionButton() {
    return isAppWallet(this.walletInfo) && isMobile();
  }
}
const universalWidgetController = {
  openSingleWalletModal: (walletInfo) => {
    core.logDebug(`universalWidgetController : openSingleWalletModal : ${JSON.stringify(walletInfo)}`);
    void setTimeout(() => setUniversalSingleWalletModalState({
      status: "opened",
      closeReason: null,
      walletInfo
    }));
  },
  closeSingleWalletModal: (reason) => void setTimeout(() => setUniversalSingleWalletModalState({
    status: "closed",
    closeReason: reason
  })),
  setAction: (action) => void setTimeout(() => setUniversalAction(action)),
  clearAction: () => void setTimeout(() => {
    console.log("clearAction");
    setUniversalAction(null);
  }),
  getSelectedWalletInfo: () => lastUniversalSelectedWalletInfo(),
  removeSelectedWalletInfo: () => setLastUniversalSelectedWalletInfo(null),
  renderApp: (root, connectUI) => {
    return render(() => createComponent(TONApp, {
      connectUI
    }), document.getElementById(root));
  },
  renderUniversalApp: (root, connectUI) => {
    return render(() => createComponent(UniversalApp, {
      connectUI
    }), document.getElementById(root));
  }
};
class Signal {
  constructor() {
    __publicField(this, "listeners", []);
  }
  listen(callback) {
    this.listeners.push(callback);
  }
  trigger(data) {
    this.listeners.forEach((listener) => listener(data));
  }
}
class UniversalSingleWalletModalManager {
  constructor(options) {
    __publicField(this, "consumers", []);
    __publicField(this, "getWalltsInfo");
    __publicField(this, "connectSignal", new Signal());
    __publicField(this, "state", universalSingleWalletModalState());
    this.getWalltsInfo = options.getWalltsInfo;
    createEffect(() => {
      const state = universalSingleWalletModalState();
      this.state = state;
      this.consumers.forEach((consumer) => consumer(state));
    });
  }
  open(wallet, opts) {
    return __async(this, null, function* () {
      core.logDebug(`UniversalSingleWalletModalManager : open : ${JSON.stringify(opts)}`);
      const externalWallets = this.getWalltsInfo();
      const externalWallet = externalWallets.find((walletInfo) => eqWalletName(walletInfo, wallet));
      if (externalWallet) {
        return this.openSingleWalletModal(externalWallet, opts);
      }
      const error = `Trying to open modal window with unknown wallet "${wallet}".`;
      throw new OKXConnectUiError(error);
    });
  }
  close(reason = "action-cancelled") {
    universalWidgetController.closeSingleWalletModal(reason);
  }
  onStateChange(onChange) {
    this.consumers.push(onChange);
    return () => {
      this.consumers = this.consumers.filter((consumer) => consumer !== onChange);
    };
  }
  handleConnect(connectMethod, actionConfiguration) {
    return __async(this, null, function* () {
      return new Promise((resolve, reject) => {
        try {
          connectMethod(actionConfiguration).then((result) => {
            resolve(result);
            core.logDebug("UniversalSingleWalletModalManager  result >>>", JSON.stringify(result));
            this.connectSignal.trigger(result);
          }).catch((error) => {
            reject(error);
            core.logDebug("UniversalSingleWalletModalManager  error >>>", JSON.stringify(error));
            this.connectSignal.trigger(error);
          });
        } catch (error) {
          reject(error);
          core.logDebug("UniversalSingleWalletModalManager  catch error >>>", JSON.stringify(error));
          this.connectSignal.trigger(error);
        }
      });
    });
  }
  openSingleWalletModal(wallet, opts) {
    return __async(this, null, function* () {
      core.logDebug(`UniversalSingleWalletModalManager : openSingleWalletModal : ${JSON.stringify(opts)}`);
      if (isInTMA()) {
        sendExpand();
      }
      setAppState({ universalConnectRequestParameters: opts });
      universalWidgetController.openSingleWalletModal(wallet);
      return new Promise((resolve, reject) => {
        this.connectSignal.listen((resultOrError) => {
          if (resultOrError instanceof Error) {
            reject(resultOrError);
          } else {
            resolve(resultOrError);
          }
        });
      });
    });
  }
}
class OKXUniversalConnectUI extends universalProvider.OKXUniversalProvider {
  constructor(options) {
    super({ dappMetaData: options.dappMetaData });
    __publicField(this, "singleWalletModal");
    __publicField(this, "actionsConfiguration");
    __publicField(this, "systemThemeChangeUnsubscribe", null);
    __publicField(this, "dispose");
    this.singleWalletModal = new UniversalSingleWalletModalManager({
      getWalltsInfo: () => OKXUniversalConnectUI.getWallets()
    });
    const rootId = this.normalizeWidgetRoot(void 0);
    this.uiOptions = mergeOptions(options, { uiPreferences: { theme: "SYSTEM" }, dappMetaData: options.dappMetaData });
    setAppState({
      universalConnector: this,
      preferredWalletAppName: void 0
    });
    this.dispose = universalWidgetController.renderUniversalApp(rootId, this);
  }
  static getWallets() {
    return [core.creatOKXWalletInfo(), core.creatOKXMiniAppWalletInfo()];
  }
  getConnectWallet() {
    var _a2, _b2;
    core.logDebug(`this.session?.wallet?.appName ${(_b2 = (_a2 = this.session) == null ? void 0 : _a2.wallet) == null ? void 0 : _b2.appName}`);
    return this.getWallets().find((wallet) => {
      var _a3, _b3;
      return eqWalletName(wallet, (_b3 = (_a3 = this.session) == null ? void 0 : _a3.wallet) == null ? void 0 : _b3.appName);
    });
  }
  get universalLink() {
    var _a2, _b2;
    core.logDebug(`this.getConnectWallet()?.universalLink ${(_a2 = this.getConnectWallet()) == null ? void 0 : _a2.universalLink}`);
    return (_b2 = this.getConnectWallet()) == null ? void 0 : _b2.universalLink;
  }
  get deepLink() {
    var _a2;
    return (_a2 = this.getConnectWallet()) == null ? void 0 : _a2.deepLink;
  }
  get walletName() {
    var _a2, _b2;
    core.logDebug(`this.getConnectWallet()?.walletName ${(_a2 = this.getConnectWallet()) == null ? void 0 : _a2.name}`);
    return (_b2 = this.getConnectWallet()) == null ? void 0 : _b2.name;
  }
  set uiOptions(options) {
    var _a2, _b2, _c2;
    this.actionsConfiguration = options.actionsConfiguration;
    if ((_a2 = options.uiPreferences) == null ? void 0 : _a2.theme) {
      if (((_b2 = options.uiPreferences) == null ? void 0 : _b2.theme) !== "SYSTEM") {
        (_c2 = this.systemThemeChangeUnsubscribe) == null ? void 0 : _c2.call(this);
        setTheme(options.uiPreferences.theme);
      } else {
        setTheme(getSystemTheme());
        if (!this.systemThemeChangeUnsubscribe) {
          this.systemThemeChangeUnsubscribe = subscribeToThemeChange(setTheme);
        }
      }
    }
    if (options.language && !isValidLocale(options.language.toString())) {
      options.language = "en_US";
    }
    setAppState((state) => {
      var _a3;
      const merged = mergeOptions(
        __spreadValues(__spreadValues({}, options.language && { language: options.language }), !!((_a3 = options.actionsConfiguration) == null ? void 0 : _a3.returnStrategy) && {
          returnStrategy: options.actionsConfiguration.returnStrategy
        }),
        unwrap(state)
      );
      return merged;
    });
  }
  destory() {
    if (this.dispose) {
      this.dispose();
    }
  }
  request(args, chain, actionConfiguration) {
    return __async(this, null, function* () {
      var _a2, _b2, _c2, _d2, _e2;
      if (!this.session) {
        throw new OKXConnectUiError("Connect wallet to send a transaction.");
      }
      const options = {
        returnStrategy: isDevice("mobile") && ((_a2 = lastUniversalSelectedWalletInfo()) == null ? void 0 : _a2.openMethod) !== "qrcode" ? actionConfiguration == null ? void 0 : actionConfiguration.returnStrategy : "none",
        modals: actionConfiguration == null ? void 0 : actionConfiguration.modals,
        tmaReturnUrl: (_b2 = actionConfiguration == null ? void 0 : actionConfiguration.tmaReturnUrl) != null ? _b2 : "back"
      };
      const { modals, returnStrategy, tmaReturnUrl } = this.getModalsAndNotificationsConfiguration(options);
      const reqArgs = __spreadProps(__spreadValues({}, args), { redirect: returnStrategy });
      const showRequestModal = __superGet(OKXUniversalConnectUI.prototype, this, "showRequestModal").call(this, reqArgs, chain);
      universalWidgetController.setAction({
        name: "confirm-transaction",
        openModal: modals.includes("before") && showRequestModal,
        sent: false
      });
      if (!((_c2 = this.session.sessionConfig) == null ? void 0 : _c2.openUniversalUrl) && showRequestModal && openWalletForUIRequest(this.getConnectWallet(), (_d2 = lastUniversalSelectedWalletInfo()) == null ? void 0 : _d2.openMethod)) {
        openUniversalWallet(
          this.getConnectWallet(),
          tmaReturnUrl,
          this.session.namespaces
        );
      }
      if (this.session.sessionConfig) {
        this.session.sessionConfig.openUniversalUrl = this.session.sessionConfig.openUniversalUrl && isMobile() && ((_e2 = lastUniversalSelectedWalletInfo()) == null ? void 0 : _e2.openMethod) !== "qrcode";
      }
      try {
        const result = yield __superGet(OKXUniversalConnectUI.prototype, this, "request").call(this, reqArgs, chain);
        universalWidgetController.setAction({
          name: "transaction-sent",
          openModal: modals.includes("success") && showRequestModal
        });
        return result;
      } catch (e2) {
        core.logDebug(`OKXUniversalConnectUI  request  ==>  ${typeof e2} ==> is core OKXConnectError: ${e2 instanceof core.OKXConnectError} ==> is universal-provider OKXConnectError: ${e2 instanceof universalProvider.OKXConnectError} ==>  ${JSON.stringify(e2)}`);
        universalWidgetController.setAction({
          name: "transaction-canceled",
          openModal: modals.includes("error") && showRequestModal
        });
        if (e2 instanceof core.OKXConnectError || e2 instanceof universalProvider.OKXConnectError) {
          core.logDebug(`OKXUniversalConnectUI  request  ==> ${JSON.stringify(e2)}`);
          throw e2;
        } else {
          throw new OKXConnectUiError("Unhandled error:" + e2);
        }
      }
    });
  }
  getModalsAndNotificationsConfiguration(options) {
    var _a2, _b2, _c2;
    const allActions = [
      "before",
      "success",
      "error"
    ];
    let modals = ["before"];
    if ((_a2 = this.actionsConfiguration) == null ? void 0 : _a2.modals) {
      if (this.actionsConfiguration.modals === "all") {
        modals = allActions;
      } else {
        modals = this.actionsConfiguration.modals;
      }
    }
    if (options == null ? void 0 : options.modals) {
      if (options.modals === "all") {
        modals = allActions;
      } else {
        modals = options.modals;
      }
    }
    const returnStrategy = (options == null ? void 0 : options.returnStrategy) || ((_b2 = this.actionsConfiguration) == null ? void 0 : _b2.returnStrategy) || "back";
    const tmaReturnUrl = (options == null ? void 0 : options.tmaReturnUrl) || ((_c2 = this.actionsConfiguration) == null ? void 0 : _c2.tmaReturnUrl) || "back";
    return {
      modals,
      tmaReturnUrl,
      returnStrategy
    };
  }
  static init(opts) {
    return __async(this, null, function* () {
      if (opts && "dappMetaData" in opts && opts.dappMetaData) {
        const provider = new OKXUniversalConnectUI(opts);
        yield provider.initialize();
        return provider;
      } else {
        throw new OKXConnectUiError(
          "You have to specify a `dappMetaData`in the options."
        );
      }
    });
  }
  normalizeWidgetRoot(rootId) {
    if (!rootId || !document.getElementById(rootId)) {
      rootId = "universal-widget-root";
      const rootElement = document.createElement("div");
      rootElement.id = rootId;
      document.body.appendChild(rootElement);
    }
    return rootId;
  }
  getWallets() {
    return OKXUniversalConnectUI.getWallets();
  }
  handleConnect(connectMethod) {
    return __async(this, null, function* () {
      return this.singleWalletModal.handleConnect(connectMethod, this.actionsConfiguration);
    });
  }
  openModal(opts) {
    return __async(this, null, function* () {
      try {
        if (this.connected()) {
          return this.session;
        }
        return this.singleWalletModal.open("okxAppWallet", opts);
      } catch (error) {
        throw error;
      }
    });
  }
  closeModal(reason) {
    this.singleWalletModal.close(reason);
  }
  showActionButton() {
    return isAppWallet(this.getConnectWallet()) && isMobile();
  }
}
exports.OKXConnectUiError = OKXConnectUiError;
exports.OKXTonConnectUI = OKXTonConnectUI;d
exports.OKXUniversalConnectUI = OKXUniversalConnectUI;
exports.OKX_UI_CONNECTION_AND_TRANSACTION_EVENT = OKX_UI_CONNECTION_AND_TRANSACTION_EVENT;
exports.THEME = THEME;
for (const k in tonsdk) {
  if (k !== "default" && !exports.hasOwnProperty(k))
    Object.defineProperty(exports, k, {
      enumerable: true,
      get: () => tonsdk[k]
    });
}
//# sourceMappingURL=index.cjs.map
