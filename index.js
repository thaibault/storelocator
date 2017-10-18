'use strict';
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("index", [], factory);
	else if(typeof exports === 'object')
		exports["index"] = factory();
	else
		root["index"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 62);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.1' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var core = __webpack_require__(0);
var ctx = __webpack_require__(5);
var hide = __webpack_require__(6);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(45)('wks');
var uid = __webpack_require__(30);
var Symbol = __webpack_require__(2).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(10);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(7);
var createDesc = __webpack_require__(41);
module.exports = __webpack_require__(9) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(8);
var IE8_DOM_DEFINE = __webpack_require__(69);
var toPrimitive = __webpack_require__(70);
var dP = Object.defineProperty;

exports.f = __webpack_require__(9) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(11)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(44);
var defined = __webpack_require__(24);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 15 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(5);
var call = __webpack_require__(79);
var isArrayIter = __webpack_require__(80);
var anObject = __webpack_require__(8);
var toLength = __webpack_require__(28);
var getIterFn = __webpack_require__(81);
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(7).f;
var has = __webpack_require__(12);
var TAG = __webpack_require__(3)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(24);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _promise = __webpack_require__(20);

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new _promise2.default(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return _promise2.default.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(67), __esModule: true };

/***/ }),
/* 21 */
/***/ (function(module, exports) {



/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(68)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(25)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 23 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 24 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(40);
var $export = __webpack_require__(1);
var redefine = __webpack_require__(71);
var hide = __webpack_require__(6);
var has = __webpack_require__(12);
var Iterators = __webpack_require__(13);
var $iterCreate = __webpack_require__(72);
var setToStringTag = __webpack_require__(17);
var getPrototypeOf = __webpack_require__(47);
var ITERATOR = __webpack_require__(3)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
var document = __webpack_require__(2).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(43);
var enumBugKeys = __webpack_require__(31);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(23);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(45)('keys');
var uid = __webpack_require__(30);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 30 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 31 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(76);
var global = __webpack_require__(2);
var hide = __webpack_require__(6);
var Iterators = __webpack_require__(13);
var TO_STRING_TAG = __webpack_require__(3)('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(15);
var TAG = __webpack_require__(3)('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)
var aFunction = __webpack_require__(10);

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var hide = __webpack_require__(6);
module.exports = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(1);
var core = __webpack_require__(0);
var fails = __webpack_require__(11);
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),
/* 39 */
/***/ (function(module, exports) {

/*! jQuery v3.2.1 | (c) JS Foundation and other contributors | jquery.org/license */
!function(a,b){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){"use strict";var c=[],d=a.document,e=Object.getPrototypeOf,f=c.slice,g=c.concat,h=c.push,i=c.indexOf,j={},k=j.toString,l=j.hasOwnProperty,m=l.toString,n=m.call(Object),o={};function p(a,b){b=b||d;var c=b.createElement("script");c.text=a,b.head.appendChild(c).parentNode.removeChild(c)}var q="3.2.1",r=function(a,b){return new r.fn.init(a,b)},s=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,t=/^-ms-/,u=/-([a-z])/g,v=function(a,b){return b.toUpperCase()};r.fn=r.prototype={jquery:q,constructor:r,length:0,toArray:function(){return f.call(this)},get:function(a){return null==a?f.call(this):a<0?this[a+this.length]:this[a]},pushStack:function(a){var b=r.merge(this.constructor(),a);return b.prevObject=this,b},each:function(a){return r.each(this,a)},map:function(a){return this.pushStack(r.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(f.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(a<0?b:0);return this.pushStack(c>=0&&c<b?[this[c]]:[])},end:function(){return this.prevObject||this.constructor()},push:h,sort:c.sort,splice:c.splice},r.extend=r.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||r.isFunction(g)||(g={}),h===i&&(g=this,h--);h<i;h++)if(null!=(a=arguments[h]))for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(r.isPlainObject(d)||(e=Array.isArray(d)))?(e?(e=!1,f=c&&Array.isArray(c)?c:[]):f=c&&r.isPlainObject(c)?c:{},g[b]=r.extend(j,f,d)):void 0!==d&&(g[b]=d));return g},r.extend({expando:"jQuery"+(q+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===r.type(a)},isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){var b=r.type(a);return("number"===b||"string"===b)&&!isNaN(a-parseFloat(a))},isPlainObject:function(a){var b,c;return!(!a||"[object Object]"!==k.call(a))&&(!(b=e(a))||(c=l.call(b,"constructor")&&b.constructor,"function"==typeof c&&m.call(c)===n))},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?j[k.call(a)]||"object":typeof a},globalEval:function(a){p(a)},camelCase:function(a){return a.replace(t,"ms-").replace(u,v)},each:function(a,b){var c,d=0;if(w(a)){for(c=a.length;d<c;d++)if(b.call(a[d],d,a[d])===!1)break}else for(d in a)if(b.call(a[d],d,a[d])===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(s,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(w(Object(a))?r.merge(c,"string"==typeof a?[a]:a):h.call(c,a)),c},inArray:function(a,b,c){return null==b?-1:i.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;d<c;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;f<g;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,e,f=0,h=[];if(w(a))for(d=a.length;f<d;f++)e=b(a[f],f,c),null!=e&&h.push(e);else for(f in a)e=b(a[f],f,c),null!=e&&h.push(e);return g.apply([],h)},guid:1,proxy:function(a,b){var c,d,e;if("string"==typeof b&&(c=a[b],b=a,a=c),r.isFunction(a))return d=f.call(arguments,2),e=function(){return a.apply(b||this,d.concat(f.call(arguments)))},e.guid=a.guid=a.guid||r.guid++,e},now:Date.now,support:o}),"function"==typeof Symbol&&(r.fn[Symbol.iterator]=c[Symbol.iterator]),r.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(a,b){j["[object "+b+"]"]=b.toLowerCase()});function w(a){var b=!!a&&"length"in a&&a.length,c=r.type(a);return"function"!==c&&!r.isWindow(a)&&("array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a)}var x=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=ha(),z=ha(),A=ha(),B=function(a,b){return a===b&&(l=!0),0},C={}.hasOwnProperty,D=[],E=D.pop,F=D.push,G=D.push,H=D.slice,I=function(a,b){for(var c=0,d=a.length;c<d;c++)if(a[c]===b)return c;return-1},J="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",K="[\\x20\\t\\r\\n\\f]",L="(?:\\\\.|[\\w-]|[^\0-\\xa0])+",M="\\["+K+"*("+L+")(?:"+K+"*([*^$|!~]?=)"+K+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+L+"))|)"+K+"*\\]",N=":("+L+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+M+")*)|.*)\\)|)",O=new RegExp(K+"+","g"),P=new RegExp("^"+K+"+|((?:^|[^\\\\])(?:\\\\.)*)"+K+"+$","g"),Q=new RegExp("^"+K+"*,"+K+"*"),R=new RegExp("^"+K+"*([>+~]|"+K+")"+K+"*"),S=new RegExp("="+K+"*([^\\]'\"]*?)"+K+"*\\]","g"),T=new RegExp(N),U=new RegExp("^"+L+"$"),V={ID:new RegExp("^#("+L+")"),CLASS:new RegExp("^\\.("+L+")"),TAG:new RegExp("^("+L+"|[*])"),ATTR:new RegExp("^"+M),PSEUDO:new RegExp("^"+N),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+K+"*(even|odd|(([+-]|)(\\d*)n|)"+K+"*(?:([+-]|)"+K+"*(\\d+)|))"+K+"*\\)|)","i"),bool:new RegExp("^(?:"+J+")$","i"),needsContext:new RegExp("^"+K+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+K+"*((?:-\\d)?\\d*)"+K+"*\\)|)(?=[^-]|$)","i")},W=/^(?:input|select|textarea|button)$/i,X=/^h\d$/i,Y=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,$=/[+~]/,_=new RegExp("\\\\([\\da-f]{1,6}"+K+"?|("+K+")|.)","ig"),aa=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:d<0?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},ba=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,ca=function(a,b){return b?"\0"===a?"\ufffd":a.slice(0,-1)+"\\"+a.charCodeAt(a.length-1).toString(16)+" ":"\\"+a},da=function(){m()},ea=ta(function(a){return a.disabled===!0&&("form"in a||"label"in a)},{dir:"parentNode",next:"legend"});try{G.apply(D=H.call(v.childNodes),v.childNodes),D[v.childNodes.length].nodeType}catch(fa){G={apply:D.length?function(a,b){F.apply(a,H.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function ga(a,b,d,e){var f,h,j,k,l,o,r,s=b&&b.ownerDocument,w=b?b.nodeType:9;if(d=d||[],"string"!=typeof a||!a||1!==w&&9!==w&&11!==w)return d;if(!e&&((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,p)){if(11!==w&&(l=Z.exec(a)))if(f=l[1]){if(9===w){if(!(j=b.getElementById(f)))return d;if(j.id===f)return d.push(j),d}else if(s&&(j=s.getElementById(f))&&t(b,j)&&j.id===f)return d.push(j),d}else{if(l[2])return G.apply(d,b.getElementsByTagName(a)),d;if((f=l[3])&&c.getElementsByClassName&&b.getElementsByClassName)return G.apply(d,b.getElementsByClassName(f)),d}if(c.qsa&&!A[a+" "]&&(!q||!q.test(a))){if(1!==w)s=b,r=a;else if("object"!==b.nodeName.toLowerCase()){(k=b.getAttribute("id"))?k=k.replace(ba,ca):b.setAttribute("id",k=u),o=g(a),h=o.length;while(h--)o[h]="#"+k+" "+sa(o[h]);r=o.join(","),s=$.test(a)&&qa(b.parentNode)||b}if(r)try{return G.apply(d,s.querySelectorAll(r)),d}catch(x){}finally{k===u&&b.removeAttribute("id")}}}return i(a.replace(P,"$1"),b,d,e)}function ha(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ia(a){return a[u]=!0,a}function ja(a){var b=n.createElement("fieldset");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function ka(a,b){var c=a.split("|"),e=c.length;while(e--)d.attrHandle[c[e]]=b}function la(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&a.sourceIndex-b.sourceIndex;if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function ma(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function na(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function oa(a){return function(b){return"form"in b?b.parentNode&&b.disabled===!1?"label"in b?"label"in b.parentNode?b.parentNode.disabled===a:b.disabled===a:b.isDisabled===a||b.isDisabled!==!a&&ea(b)===a:b.disabled===a:"label"in b&&b.disabled===a}}function pa(a){return ia(function(b){return b=+b,ia(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function qa(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=ga.support={},f=ga.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return!!b&&"HTML"!==b.nodeName},m=ga.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=n.documentElement,p=!f(n),v!==n&&(e=n.defaultView)&&e.top!==e&&(e.addEventListener?e.addEventListener("unload",da,!1):e.attachEvent&&e.attachEvent("onunload",da)),c.attributes=ja(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ja(function(a){return a.appendChild(n.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=Y.test(n.getElementsByClassName),c.getById=ja(function(a){return o.appendChild(a).id=u,!n.getElementsByName||!n.getElementsByName(u).length}),c.getById?(d.filter.ID=function(a){var b=a.replace(_,aa);return function(a){return a.getAttribute("id")===b}},d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c?[c]:[]}}):(d.filter.ID=function(a){var b=a.replace(_,aa);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}},d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c,d,e,f=b.getElementById(a);if(f){if(c=f.getAttributeNode("id"),c&&c.value===a)return[f];e=b.getElementsByName(a),d=0;while(f=e[d++])if(c=f.getAttributeNode("id"),c&&c.value===a)return[f]}return[]}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){if("undefined"!=typeof b.getElementsByClassName&&p)return b.getElementsByClassName(a)},r=[],q=[],(c.qsa=Y.test(n.querySelectorAll))&&(ja(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\r\\' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+K+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+K+"*(?:value|"+J+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),ja(function(a){a.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var b=n.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+K+"*[*^$|!~]?="),2!==a.querySelectorAll(":enabled").length&&q.push(":enabled",":disabled"),o.appendChild(a).disabled=!0,2!==a.querySelectorAll(":disabled").length&&q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=Y.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ja(function(a){c.disconnectedMatch=s.call(a,"*"),s.call(a,"[s!='']:x"),r.push("!=",N)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=Y.test(o.compareDocumentPosition),t=b||Y.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===n||a.ownerDocument===v&&t(v,a)?-1:b===n||b.ownerDocument===v&&t(v,b)?1:k?I(k,a)-I(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,g=[a],h=[b];if(!e||!f)return a===n?-1:b===n?1:e?-1:f?1:k?I(k,a)-I(k,b):0;if(e===f)return la(a,b);c=a;while(c=c.parentNode)g.unshift(c);c=b;while(c=c.parentNode)h.unshift(c);while(g[d]===h[d])d++;return d?la(g[d],h[d]):g[d]===v?-1:h[d]===v?1:0},n):n},ga.matches=function(a,b){return ga(a,null,null,b)},ga.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(S,"='$1']"),c.matchesSelector&&p&&!A[b+" "]&&(!r||!r.test(b))&&(!q||!q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return ga(b,n,null,[a]).length>0},ga.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},ga.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&C.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},ga.escape=function(a){return(a+"").replace(ba,ca)},ga.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},ga.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=ga.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=ga.selectors={cacheLength:50,createPseudo:ia,match:V,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(_,aa),a[3]=(a[3]||a[4]||a[5]||"").replace(_,aa),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||ga.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&ga.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return V.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&T.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(_,aa).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+K+")"+a+"("+K+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=ga.attr(d,a);return null==e?"!="===b:!b||(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(O," ")+" ").indexOf(c)>-1:"|="===b&&(e===c||e.slice(0,c.length+1)===c+"-"))}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h,t=!1;if(q){if(f){while(p){m=b;while(m=m[p])if(h?m.nodeName.toLowerCase()===r:1===m.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){m=q,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n&&j[2],m=n&&q.childNodes[n];while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if(1===m.nodeType&&++t&&m===b){k[a]=[w,n,t];break}}else if(s&&(m=b,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n),t===!1)while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if((h?m.nodeName.toLowerCase()===r:1===m.nodeType)&&++t&&(s&&(l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),k[a]=[w,t]),m===b))break;return t-=e,t===d||t%d===0&&t/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||ga.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ia(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=I(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ia(function(a){var b=[],c=[],d=h(a.replace(P,"$1"));return d[u]?ia(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ia(function(a){return function(b){return ga(a,b).length>0}}),contains:ia(function(a){return a=a.replace(_,aa),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ia(function(a){return U.test(a||"")||ga.error("unsupported lang: "+a),a=a.replace(_,aa).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:oa(!1),disabled:oa(!0),checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return X.test(a.nodeName)},input:function(a){return W.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:pa(function(){return[0]}),last:pa(function(a,b){return[b-1]}),eq:pa(function(a,b,c){return[c<0?c+b:c]}),even:pa(function(a,b){for(var c=0;c<b;c+=2)a.push(c);return a}),odd:pa(function(a,b){for(var c=1;c<b;c+=2)a.push(c);return a}),lt:pa(function(a,b,c){for(var d=c<0?c+b:c;--d>=0;)a.push(d);return a}),gt:pa(function(a,b,c){for(var d=c<0?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=ma(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=na(b);function ra(){}ra.prototype=d.filters=d.pseudos,d.setFilters=new ra,g=ga.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){c&&!(e=Q.exec(h))||(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=R.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(P," ")}),h=h.slice(c.length));for(g in d.filter)!(e=V[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?ga.error(a):z(a,i).slice(0)};function sa(a){for(var b=0,c=a.length,d="";b<c;b++)d+=a[b].value;return d}function ta(a,b,c){var d=b.dir,e=b.next,f=e||d,g=c&&"parentNode"===f,h=x++;return b.first?function(b,c,e){while(b=b[d])if(1===b.nodeType||g)return a(b,c,e);return!1}:function(b,c,i){var j,k,l,m=[w,h];if(i){while(b=b[d])if((1===b.nodeType||g)&&a(b,c,i))return!0}else while(b=b[d])if(1===b.nodeType||g)if(l=b[u]||(b[u]={}),k=l[b.uniqueID]||(l[b.uniqueID]={}),e&&e===b.nodeName.toLowerCase())b=b[d]||b;else{if((j=k[f])&&j[0]===w&&j[1]===h)return m[2]=j[2];if(k[f]=m,m[2]=a(b,c,i))return!0}return!1}}function ua(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function va(a,b,c){for(var d=0,e=b.length;d<e;d++)ga(a,b[d],c);return c}function wa(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;h<i;h++)(f=a[h])&&(c&&!c(f,d,e)||(g.push(f),j&&b.push(h)));return g}function xa(a,b,c,d,e,f){return d&&!d[u]&&(d=xa(d)),e&&!e[u]&&(e=xa(e,f)),ia(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||va(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:wa(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=wa(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?I(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=wa(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):G.apply(g,r)})}function ya(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=ta(function(a){return a===b},h,!0),l=ta(function(a){return I(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];i<f;i++)if(c=d.relative[a[i].type])m=[ta(ua(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;e<f;e++)if(d.relative[a[e].type])break;return xa(i>1&&ua(m),i>1&&sa(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(P,"$1"),c,i<e&&ya(a.slice(i,e)),e<f&&ya(a=a.slice(e)),e<f&&sa(a))}m.push(c)}return ua(m)}function za(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,o,q,r=0,s="0",t=f&&[],u=[],v=j,x=f||e&&d.find.TAG("*",k),y=w+=null==v?1:Math.random()||.1,z=x.length;for(k&&(j=g===n||g||k);s!==z&&null!=(l=x[s]);s++){if(e&&l){o=0,g||l.ownerDocument===n||(m(l),h=!p);while(q=a[o++])if(q(l,g||n,h)){i.push(l);break}k&&(w=y)}c&&((l=!q&&l)&&r--,f&&t.push(l))}if(r+=s,c&&s!==r){o=0;while(q=b[o++])q(t,u,g,h);if(f){if(r>0)while(s--)t[s]||u[s]||(u[s]=E.call(i));u=wa(u)}G.apply(i,u),k&&!f&&u.length>0&&r+b.length>1&&ga.uniqueSort(i)}return k&&(w=y,j=v),t};return c?ia(f):f}return h=ga.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=ya(b[c]),f[u]?d.push(f):e.push(f);f=A(a,za(e,d)),f.selector=a}return f},i=ga.select=function(a,b,c,e){var f,i,j,k,l,m="function"==typeof a&&a,n=!e&&g(a=m.selector||a);if(c=c||[],1===n.length){if(i=n[0]=n[0].slice(0),i.length>2&&"ID"===(j=i[0]).type&&9===b.nodeType&&p&&d.relative[i[1].type]){if(b=(d.find.ID(j.matches[0].replace(_,aa),b)||[])[0],!b)return c;m&&(b=b.parentNode),a=a.slice(i.shift().value.length)}f=V.needsContext.test(a)?0:i.length;while(f--){if(j=i[f],d.relative[k=j.type])break;if((l=d.find[k])&&(e=l(j.matches[0].replace(_,aa),$.test(i[0].type)&&qa(b.parentNode)||b))){if(i.splice(f,1),a=e.length&&sa(i),!a)return G.apply(c,e),c;break}}}return(m||h(a,n))(e,b,!p,c,!b||$.test(a)&&qa(b.parentNode)||b),c},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ja(function(a){return 1&a.compareDocumentPosition(n.createElement("fieldset"))}),ja(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||ka("type|href|height|width",function(a,b,c){if(!c)return a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ja(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||ka("value",function(a,b,c){if(!c&&"input"===a.nodeName.toLowerCase())return a.defaultValue}),ja(function(a){return null==a.getAttribute("disabled")})||ka(J,function(a,b,c){var d;if(!c)return a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),ga}(a);r.find=x,r.expr=x.selectors,r.expr[":"]=r.expr.pseudos,r.uniqueSort=r.unique=x.uniqueSort,r.text=x.getText,r.isXMLDoc=x.isXML,r.contains=x.contains,r.escapeSelector=x.escape;var y=function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&r(a).is(c))break;d.push(a)}return d},z=function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c},A=r.expr.match.needsContext;function B(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()}var C=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i,D=/^.[^:#\[\.,]*$/;function E(a,b,c){return r.isFunction(b)?r.grep(a,function(a,d){return!!b.call(a,d,a)!==c}):b.nodeType?r.grep(a,function(a){return a===b!==c}):"string"!=typeof b?r.grep(a,function(a){return i.call(b,a)>-1!==c}):D.test(b)?r.filter(b,a,c):(b=r.filter(b,a),r.grep(a,function(a){return i.call(b,a)>-1!==c&&1===a.nodeType}))}r.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?r.find.matchesSelector(d,a)?[d]:[]:r.find.matches(a,r.grep(b,function(a){return 1===a.nodeType}))},r.fn.extend({find:function(a){var b,c,d=this.length,e=this;if("string"!=typeof a)return this.pushStack(r(a).filter(function(){for(b=0;b<d;b++)if(r.contains(e[b],this))return!0}));for(c=this.pushStack([]),b=0;b<d;b++)r.find(a,e[b],c);return d>1?r.uniqueSort(c):c},filter:function(a){return this.pushStack(E(this,a||[],!1))},not:function(a){return this.pushStack(E(this,a||[],!0))},is:function(a){return!!E(this,"string"==typeof a&&A.test(a)?r(a):a||[],!1).length}});var F,G=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,H=r.fn.init=function(a,b,c){var e,f;if(!a)return this;if(c=c||F,"string"==typeof a){if(e="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:G.exec(a),!e||!e[1]&&b)return!b||b.jquery?(b||c).find(a):this.constructor(b).find(a);if(e[1]){if(b=b instanceof r?b[0]:b,r.merge(this,r.parseHTML(e[1],b&&b.nodeType?b.ownerDocument||b:d,!0)),C.test(e[1])&&r.isPlainObject(b))for(e in b)r.isFunction(this[e])?this[e](b[e]):this.attr(e,b[e]);return this}return f=d.getElementById(e[2]),f&&(this[0]=f,this.length=1),this}return a.nodeType?(this[0]=a,this.length=1,this):r.isFunction(a)?void 0!==c.ready?c.ready(a):a(r):r.makeArray(a,this)};H.prototype=r.fn,F=r(d);var I=/^(?:parents|prev(?:Until|All))/,J={children:!0,contents:!0,next:!0,prev:!0};r.fn.extend({has:function(a){var b=r(a,this),c=b.length;return this.filter(function(){for(var a=0;a<c;a++)if(r.contains(this,b[a]))return!0})},closest:function(a,b){var c,d=0,e=this.length,f=[],g="string"!=typeof a&&r(a);if(!A.test(a))for(;d<e;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&r.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?r.uniqueSort(f):f)},index:function(a){return a?"string"==typeof a?i.call(r(a),this[0]):i.call(this,a.jquery?a[0]:a):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(r.uniqueSort(r.merge(this.get(),r(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function K(a,b){while((a=a[b])&&1!==a.nodeType);return a}r.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return y(a,"parentNode")},parentsUntil:function(a,b,c){return y(a,"parentNode",c)},next:function(a){return K(a,"nextSibling")},prev:function(a){return K(a,"previousSibling")},nextAll:function(a){return y(a,"nextSibling")},prevAll:function(a){return y(a,"previousSibling")},nextUntil:function(a,b,c){return y(a,"nextSibling",c)},prevUntil:function(a,b,c){return y(a,"previousSibling",c)},siblings:function(a){return z((a.parentNode||{}).firstChild,a)},children:function(a){return z(a.firstChild)},contents:function(a){return B(a,"iframe")?a.contentDocument:(B(a,"template")&&(a=a.content||a),r.merge([],a.childNodes))}},function(a,b){r.fn[a]=function(c,d){var e=r.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=r.filter(d,e)),this.length>1&&(J[a]||r.uniqueSort(e),I.test(a)&&e.reverse()),this.pushStack(e)}});var L=/[^\x20\t\r\n\f]+/g;function M(a){var b={};return r.each(a.match(L)||[],function(a,c){b[c]=!0}),b}r.Callbacks=function(a){a="string"==typeof a?M(a):r.extend({},a);var b,c,d,e,f=[],g=[],h=-1,i=function(){for(e=e||a.once,d=b=!0;g.length;h=-1){c=g.shift();while(++h<f.length)f[h].apply(c[0],c[1])===!1&&a.stopOnFalse&&(h=f.length,c=!1)}a.memory||(c=!1),b=!1,e&&(f=c?[]:"")},j={add:function(){return f&&(c&&!b&&(h=f.length-1,g.push(c)),function d(b){r.each(b,function(b,c){r.isFunction(c)?a.unique&&j.has(c)||f.push(c):c&&c.length&&"string"!==r.type(c)&&d(c)})}(arguments),c&&!b&&i()),this},remove:function(){return r.each(arguments,function(a,b){var c;while((c=r.inArray(b,f,c))>-1)f.splice(c,1),c<=h&&h--}),this},has:function(a){return a?r.inArray(a,f)>-1:f.length>0},empty:function(){return f&&(f=[]),this},disable:function(){return e=g=[],f=c="",this},disabled:function(){return!f},lock:function(){return e=g=[],c||b||(f=c=""),this},locked:function(){return!!e},fireWith:function(a,c){return e||(c=c||[],c=[a,c.slice?c.slice():c],g.push(c),b||i()),this},fire:function(){return j.fireWith(this,arguments),this},fired:function(){return!!d}};return j};function N(a){return a}function O(a){throw a}function P(a,b,c,d){var e;try{a&&r.isFunction(e=a.promise)?e.call(a).done(b).fail(c):a&&r.isFunction(e=a.then)?e.call(a,b,c):b.apply(void 0,[a].slice(d))}catch(a){c.apply(void 0,[a])}}r.extend({Deferred:function(b){var c=[["notify","progress",r.Callbacks("memory"),r.Callbacks("memory"),2],["resolve","done",r.Callbacks("once memory"),r.Callbacks("once memory"),0,"resolved"],["reject","fail",r.Callbacks("once memory"),r.Callbacks("once memory"),1,"rejected"]],d="pending",e={state:function(){return d},always:function(){return f.done(arguments).fail(arguments),this},"catch":function(a){return e.then(null,a)},pipe:function(){var a=arguments;return r.Deferred(function(b){r.each(c,function(c,d){var e=r.isFunction(a[d[4]])&&a[d[4]];f[d[1]](function(){var a=e&&e.apply(this,arguments);a&&r.isFunction(a.promise)?a.promise().progress(b.notify).done(b.resolve).fail(b.reject):b[d[0]+"With"](this,e?[a]:arguments)})}),a=null}).promise()},then:function(b,d,e){var f=0;function g(b,c,d,e){return function(){var h=this,i=arguments,j=function(){var a,j;if(!(b<f)){if(a=d.apply(h,i),a===c.promise())throw new TypeError("Thenable self-resolution");j=a&&("object"==typeof a||"function"==typeof a)&&a.then,r.isFunction(j)?e?j.call(a,g(f,c,N,e),g(f,c,O,e)):(f++,j.call(a,g(f,c,N,e),g(f,c,O,e),g(f,c,N,c.notifyWith))):(d!==N&&(h=void 0,i=[a]),(e||c.resolveWith)(h,i))}},k=e?j:function(){try{j()}catch(a){r.Deferred.exceptionHook&&r.Deferred.exceptionHook(a,k.stackTrace),b+1>=f&&(d!==O&&(h=void 0,i=[a]),c.rejectWith(h,i))}};b?k():(r.Deferred.getStackHook&&(k.stackTrace=r.Deferred.getStackHook()),a.setTimeout(k))}}return r.Deferred(function(a){c[0][3].add(g(0,a,r.isFunction(e)?e:N,a.notifyWith)),c[1][3].add(g(0,a,r.isFunction(b)?b:N)),c[2][3].add(g(0,a,r.isFunction(d)?d:O))}).promise()},promise:function(a){return null!=a?r.extend(a,e):e}},f={};return r.each(c,function(a,b){var g=b[2],h=b[5];e[b[1]]=g.add,h&&g.add(function(){d=h},c[3-a][2].disable,c[0][2].lock),g.add(b[3].fire),f[b[0]]=function(){return f[b[0]+"With"](this===f?void 0:this,arguments),this},f[b[0]+"With"]=g.fireWith}),e.promise(f),b&&b.call(f,f),f},when:function(a){var b=arguments.length,c=b,d=Array(c),e=f.call(arguments),g=r.Deferred(),h=function(a){return function(c){d[a]=this,e[a]=arguments.length>1?f.call(arguments):c,--b||g.resolveWith(d,e)}};if(b<=1&&(P(a,g.done(h(c)).resolve,g.reject,!b),"pending"===g.state()||r.isFunction(e[c]&&e[c].then)))return g.then();while(c--)P(e[c],h(c),g.reject);return g.promise()}});var Q=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;r.Deferred.exceptionHook=function(b,c){a.console&&a.console.warn&&b&&Q.test(b.name)&&a.console.warn("jQuery.Deferred exception: "+b.message,b.stack,c)},r.readyException=function(b){a.setTimeout(function(){throw b})};var R=r.Deferred();r.fn.ready=function(a){return R.then(a)["catch"](function(a){r.readyException(a)}),this},r.extend({isReady:!1,readyWait:1,ready:function(a){(a===!0?--r.readyWait:r.isReady)||(r.isReady=!0,a!==!0&&--r.readyWait>0||R.resolveWith(d,[r]))}}),r.ready.then=R.then;function S(){d.removeEventListener("DOMContentLoaded",S),
a.removeEventListener("load",S),r.ready()}"complete"===d.readyState||"loading"!==d.readyState&&!d.documentElement.doScroll?a.setTimeout(r.ready):(d.addEventListener("DOMContentLoaded",S),a.addEventListener("load",S));var T=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===r.type(c)){e=!0;for(h in c)T(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,r.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(r(a),c)})),b))for(;h<i;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f},U=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType};function V(){this.expando=r.expando+V.uid++}V.uid=1,V.prototype={cache:function(a){var b=a[this.expando];return b||(b={},U(a)&&(a.nodeType?a[this.expando]=b:Object.defineProperty(a,this.expando,{value:b,configurable:!0}))),b},set:function(a,b,c){var d,e=this.cache(a);if("string"==typeof b)e[r.camelCase(b)]=c;else for(d in b)e[r.camelCase(d)]=b[d];return e},get:function(a,b){return void 0===b?this.cache(a):a[this.expando]&&a[this.expando][r.camelCase(b)]},access:function(a,b,c){return void 0===b||b&&"string"==typeof b&&void 0===c?this.get(a,b):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d=a[this.expando];if(void 0!==d){if(void 0!==b){Array.isArray(b)?b=b.map(r.camelCase):(b=r.camelCase(b),b=b in d?[b]:b.match(L)||[]),c=b.length;while(c--)delete d[b[c]]}(void 0===b||r.isEmptyObject(d))&&(a.nodeType?a[this.expando]=void 0:delete a[this.expando])}},hasData:function(a){var b=a[this.expando];return void 0!==b&&!r.isEmptyObject(b)}};var W=new V,X=new V,Y=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,Z=/[A-Z]/g;function $(a){return"true"===a||"false"!==a&&("null"===a?null:a===+a+""?+a:Y.test(a)?JSON.parse(a):a)}function _(a,b,c){var d;if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(Z,"-$&").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c=$(c)}catch(e){}X.set(a,b,c)}else c=void 0;return c}r.extend({hasData:function(a){return X.hasData(a)||W.hasData(a)},data:function(a,b,c){return X.access(a,b,c)},removeData:function(a,b){X.remove(a,b)},_data:function(a,b,c){return W.access(a,b,c)},_removeData:function(a,b){W.remove(a,b)}}),r.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=X.get(f),1===f.nodeType&&!W.get(f,"hasDataAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=r.camelCase(d.slice(5)),_(f,d,e[d])));W.set(f,"hasDataAttrs",!0)}return e}return"object"==typeof a?this.each(function(){X.set(this,a)}):T(this,function(b){var c;if(f&&void 0===b){if(c=X.get(f,a),void 0!==c)return c;if(c=_(f,a),void 0!==c)return c}else this.each(function(){X.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){X.remove(this,a)})}}),r.extend({queue:function(a,b,c){var d;if(a)return b=(b||"fx")+"queue",d=W.get(a,b),c&&(!d||Array.isArray(c)?d=W.access(a,b,r.makeArray(c)):d.push(c)),d||[]},dequeue:function(a,b){b=b||"fx";var c=r.queue(a,b),d=c.length,e=c.shift(),f=r._queueHooks(a,b),g=function(){r.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return W.get(a,c)||W.access(a,c,{empty:r.Callbacks("once memory").add(function(){W.remove(a,[b+"queue",c])})})}}),r.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?r.queue(this[0],a):void 0===b?this:this.each(function(){var c=r.queue(this,a,b);r._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&r.dequeue(this,a)})},dequeue:function(a){return this.each(function(){r.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=r.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=W.get(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var aa=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,ba=new RegExp("^(?:([+-])=|)("+aa+")([a-z%]*)$","i"),ca=["Top","Right","Bottom","Left"],da=function(a,b){return a=b||a,"none"===a.style.display||""===a.style.display&&r.contains(a.ownerDocument,a)&&"none"===r.css(a,"display")},ea=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};function fa(a,b,c,d){var e,f=1,g=20,h=d?function(){return d.cur()}:function(){return r.css(a,b,"")},i=h(),j=c&&c[3]||(r.cssNumber[b]?"":"px"),k=(r.cssNumber[b]||"px"!==j&&+i)&&ba.exec(r.css(a,b));if(k&&k[3]!==j){j=j||k[3],c=c||[],k=+i||1;do f=f||".5",k/=f,r.style(a,b,k+j);while(f!==(f=h()/i)&&1!==f&&--g)}return c&&(k=+k||+i||0,e=c[1]?k+(c[1]+1)*c[2]:+c[2],d&&(d.unit=j,d.start=k,d.end=e)),e}var ga={};function ha(a){var b,c=a.ownerDocument,d=a.nodeName,e=ga[d];return e?e:(b=c.body.appendChild(c.createElement(d)),e=r.css(b,"display"),b.parentNode.removeChild(b),"none"===e&&(e="block"),ga[d]=e,e)}function ia(a,b){for(var c,d,e=[],f=0,g=a.length;f<g;f++)d=a[f],d.style&&(c=d.style.display,b?("none"===c&&(e[f]=W.get(d,"display")||null,e[f]||(d.style.display="")),""===d.style.display&&da(d)&&(e[f]=ha(d))):"none"!==c&&(e[f]="none",W.set(d,"display",c)));for(f=0;f<g;f++)null!=e[f]&&(a[f].style.display=e[f]);return a}r.fn.extend({show:function(){return ia(this,!0)},hide:function(){return ia(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){da(this)?r(this).show():r(this).hide()})}});var ja=/^(?:checkbox|radio)$/i,ka=/<([a-z][^\/\0>\x20\t\r\n\f]+)/i,la=/^$|\/(?:java|ecma)script/i,ma={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ma.optgroup=ma.option,ma.tbody=ma.tfoot=ma.colgroup=ma.caption=ma.thead,ma.th=ma.td;function na(a,b){var c;return c="undefined"!=typeof a.getElementsByTagName?a.getElementsByTagName(b||"*"):"undefined"!=typeof a.querySelectorAll?a.querySelectorAll(b||"*"):[],void 0===b||b&&B(a,b)?r.merge([a],c):c}function oa(a,b){for(var c=0,d=a.length;c<d;c++)W.set(a[c],"globalEval",!b||W.get(b[c],"globalEval"))}var pa=/<|&#?\w+;/;function qa(a,b,c,d,e){for(var f,g,h,i,j,k,l=b.createDocumentFragment(),m=[],n=0,o=a.length;n<o;n++)if(f=a[n],f||0===f)if("object"===r.type(f))r.merge(m,f.nodeType?[f]:f);else if(pa.test(f)){g=g||l.appendChild(b.createElement("div")),h=(ka.exec(f)||["",""])[1].toLowerCase(),i=ma[h]||ma._default,g.innerHTML=i[1]+r.htmlPrefilter(f)+i[2],k=i[0];while(k--)g=g.lastChild;r.merge(m,g.childNodes),g=l.firstChild,g.textContent=""}else m.push(b.createTextNode(f));l.textContent="",n=0;while(f=m[n++])if(d&&r.inArray(f,d)>-1)e&&e.push(f);else if(j=r.contains(f.ownerDocument,f),g=na(l.appendChild(f),"script"),j&&oa(g),c){k=0;while(f=g[k++])la.test(f.type||"")&&c.push(f)}return l}!function(){var a=d.createDocumentFragment(),b=a.appendChild(d.createElement("div")),c=d.createElement("input");c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),b.appendChild(c),o.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,b.innerHTML="<textarea>x</textarea>",o.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue}();var ra=d.documentElement,sa=/^key/,ta=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,ua=/^([^.]*)(?:\.(.+)|)/;function va(){return!0}function wa(){return!1}function xa(){try{return d.activeElement}catch(a){}}function ya(a,b,c,d,e,f){var g,h;if("object"==typeof b){"string"!=typeof c&&(d=d||c,c=void 0);for(h in b)ya(a,h,c,d,b[h],f);return a}if(null==d&&null==e?(e=c,d=c=void 0):null==e&&("string"==typeof c?(e=d,d=void 0):(e=d,d=c,c=void 0)),e===!1)e=wa;else if(!e)return a;return 1===f&&(g=e,e=function(a){return r().off(a),g.apply(this,arguments)},e.guid=g.guid||(g.guid=r.guid++)),a.each(function(){r.event.add(this,b,e,d,c)})}r.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=W.get(a);if(q){c.handler&&(f=c,c=f.handler,e=f.selector),e&&r.find.matchesSelector(ra,e),c.guid||(c.guid=r.guid++),(i=q.events)||(i=q.events={}),(g=q.handle)||(g=q.handle=function(b){return"undefined"!=typeof r&&r.event.triggered!==b.type?r.event.dispatch.apply(a,arguments):void 0}),b=(b||"").match(L)||[""],j=b.length;while(j--)h=ua.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n&&(l=r.event.special[n]||{},n=(e?l.delegateType:l.bindType)||n,l=r.event.special[n]||{},k=r.extend({type:n,origType:p,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&r.expr.match.needsContext.test(e),namespace:o.join(".")},f),(m=i[n])||(m=i[n]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,o,g)!==!1||a.addEventListener&&a.addEventListener(n,g)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),r.event.global[n]=!0)}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=W.hasData(a)&&W.get(a);if(q&&(i=q.events)){b=(b||"").match(L)||[""],j=b.length;while(j--)if(h=ua.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n){l=r.event.special[n]||{},n=(d?l.delegateType:l.bindType)||n,m=i[n]||[],h=h[2]&&new RegExp("(^|\\.)"+o.join("\\.(?:.*\\.|)")+"(\\.|$)"),g=f=m.length;while(f--)k=m[f],!e&&p!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));g&&!m.length&&(l.teardown&&l.teardown.call(a,o,q.handle)!==!1||r.removeEvent(a,n,q.handle),delete i[n])}else for(n in i)r.event.remove(a,n+b[j],c,d,!0);r.isEmptyObject(i)&&W.remove(a,"handle events")}},dispatch:function(a){var b=r.event.fix(a),c,d,e,f,g,h,i=new Array(arguments.length),j=(W.get(this,"events")||{})[b.type]||[],k=r.event.special[b.type]||{};for(i[0]=b,c=1;c<arguments.length;c++)i[c]=arguments[c];if(b.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,b)!==!1){h=r.event.handlers.call(this,b,j),c=0;while((f=h[c++])&&!b.isPropagationStopped()){b.currentTarget=f.elem,d=0;while((g=f.handlers[d++])&&!b.isImmediatePropagationStopped())b.rnamespace&&!b.rnamespace.test(g.namespace)||(b.handleObj=g,b.data=g.data,e=((r.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==e&&(b.result=e)===!1&&(b.preventDefault(),b.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,b),b.result}},handlers:function(a,b){var c,d,e,f,g,h=[],i=b.delegateCount,j=a.target;if(i&&j.nodeType&&!("click"===a.type&&a.button>=1))for(;j!==this;j=j.parentNode||this)if(1===j.nodeType&&("click"!==a.type||j.disabled!==!0)){for(f=[],g={},c=0;c<i;c++)d=b[c],e=d.selector+" ",void 0===g[e]&&(g[e]=d.needsContext?r(e,this).index(j)>-1:r.find(e,this,null,[j]).length),g[e]&&f.push(d);f.length&&h.push({elem:j,handlers:f})}return j=this,i<b.length&&h.push({elem:j,handlers:b.slice(i)}),h},addProp:function(a,b){Object.defineProperty(r.Event.prototype,a,{enumerable:!0,configurable:!0,get:r.isFunction(b)?function(){if(this.originalEvent)return b(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[a]},set:function(b){Object.defineProperty(this,a,{enumerable:!0,configurable:!0,writable:!0,value:b})}})},fix:function(a){return a[r.expando]?a:new r.Event(a)},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==xa()&&this.focus)return this.focus(),!1},delegateType:"focusin"},blur:{trigger:function(){if(this===xa()&&this.blur)return this.blur(),!1},delegateType:"focusout"},click:{trigger:function(){if("checkbox"===this.type&&this.click&&B(this,"input"))return this.click(),!1},_default:function(a){return B(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}}},r.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c)},r.Event=function(a,b){return this instanceof r.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?va:wa,this.target=a.target&&3===a.target.nodeType?a.target.parentNode:a.target,this.currentTarget=a.currentTarget,this.relatedTarget=a.relatedTarget):this.type=a,b&&r.extend(this,b),this.timeStamp=a&&a.timeStamp||r.now(),void(this[r.expando]=!0)):new r.Event(a,b)},r.Event.prototype={constructor:r.Event,isDefaultPrevented:wa,isPropagationStopped:wa,isImmediatePropagationStopped:wa,isSimulated:!1,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=va,a&&!this.isSimulated&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=va,a&&!this.isSimulated&&a.stopPropagation()},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=va,a&&!this.isSimulated&&a.stopImmediatePropagation(),this.stopPropagation()}},r.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,"char":!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(a){var b=a.button;return null==a.which&&sa.test(a.type)?null!=a.charCode?a.charCode:a.keyCode:!a.which&&void 0!==b&&ta.test(a.type)?1&b?1:2&b?3:4&b?2:0:a.which}},r.event.addProp),r.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){r.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return e&&(e===d||r.contains(d,e))||(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),r.fn.extend({on:function(a,b,c,d){return ya(this,a,b,c,d)},one:function(a,b,c,d){return ya(this,a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,r(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return b!==!1&&"function"!=typeof b||(c=b,b=void 0),c===!1&&(c=wa),this.each(function(){r.event.remove(this,a,c,b)})}});var za=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,Aa=/<script|<style|<link/i,Ba=/checked\s*(?:[^=]|=\s*.checked.)/i,Ca=/^true\/(.*)/,Da=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function Ea(a,b){return B(a,"table")&&B(11!==b.nodeType?b:b.firstChild,"tr")?r(">tbody",a)[0]||a:a}function Fa(a){return a.type=(null!==a.getAttribute("type"))+"/"+a.type,a}function Ga(a){var b=Ca.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function Ha(a,b){var c,d,e,f,g,h,i,j;if(1===b.nodeType){if(W.hasData(a)&&(f=W.access(a),g=W.set(b,f),j=f.events)){delete g.handle,g.events={};for(e in j)for(c=0,d=j[e].length;c<d;c++)r.event.add(b,e,j[e][c])}X.hasData(a)&&(h=X.access(a),i=r.extend({},h),X.set(b,i))}}function Ia(a,b){var c=b.nodeName.toLowerCase();"input"===c&&ja.test(a.type)?b.checked=a.checked:"input"!==c&&"textarea"!==c||(b.defaultValue=a.defaultValue)}function Ja(a,b,c,d){b=g.apply([],b);var e,f,h,i,j,k,l=0,m=a.length,n=m-1,q=b[0],s=r.isFunction(q);if(s||m>1&&"string"==typeof q&&!o.checkClone&&Ba.test(q))return a.each(function(e){var f=a.eq(e);s&&(b[0]=q.call(this,e,f.html())),Ja(f,b,c,d)});if(m&&(e=qa(b,a[0].ownerDocument,!1,a,d),f=e.firstChild,1===e.childNodes.length&&(e=f),f||d)){for(h=r.map(na(e,"script"),Fa),i=h.length;l<m;l++)j=e,l!==n&&(j=r.clone(j,!0,!0),i&&r.merge(h,na(j,"script"))),c.call(a[l],j,l);if(i)for(k=h[h.length-1].ownerDocument,r.map(h,Ga),l=0;l<i;l++)j=h[l],la.test(j.type||"")&&!W.access(j,"globalEval")&&r.contains(k,j)&&(j.src?r._evalUrl&&r._evalUrl(j.src):p(j.textContent.replace(Da,""),k))}return a}function Ka(a,b,c){for(var d,e=b?r.filter(b,a):a,f=0;null!=(d=e[f]);f++)c||1!==d.nodeType||r.cleanData(na(d)),d.parentNode&&(c&&r.contains(d.ownerDocument,d)&&oa(na(d,"script")),d.parentNode.removeChild(d));return a}r.extend({htmlPrefilter:function(a){return a.replace(za,"<$1></$2>")},clone:function(a,b,c){var d,e,f,g,h=a.cloneNode(!0),i=r.contains(a.ownerDocument,a);if(!(o.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||r.isXMLDoc(a)))for(g=na(h),f=na(a),d=0,e=f.length;d<e;d++)Ia(f[d],g[d]);if(b)if(c)for(f=f||na(a),g=g||na(h),d=0,e=f.length;d<e;d++)Ha(f[d],g[d]);else Ha(a,h);return g=na(h,"script"),g.length>0&&oa(g,!i&&na(a,"script")),h},cleanData:function(a){for(var b,c,d,e=r.event.special,f=0;void 0!==(c=a[f]);f++)if(U(c)){if(b=c[W.expando]){if(b.events)for(d in b.events)e[d]?r.event.remove(c,d):r.removeEvent(c,d,b.handle);c[W.expando]=void 0}c[X.expando]&&(c[X.expando]=void 0)}}}),r.fn.extend({detach:function(a){return Ka(this,a,!0)},remove:function(a){return Ka(this,a)},text:function(a){return T(this,function(a){return void 0===a?r.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=a)})},null,a,arguments.length)},append:function(){return Ja(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=Ea(this,a);b.appendChild(a)}})},prepend:function(){return Ja(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=Ea(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return Ja(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return Ja(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)1===a.nodeType&&(r.cleanData(na(a,!1)),a.textContent="");return this},clone:function(a,b){return a=null!=a&&a,b=null==b?a:b,this.map(function(){return r.clone(this,a,b)})},html:function(a){return T(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a&&1===b.nodeType)return b.innerHTML;if("string"==typeof a&&!Aa.test(a)&&!ma[(ka.exec(a)||["",""])[1].toLowerCase()]){a=r.htmlPrefilter(a);try{for(;c<d;c++)b=this[c]||{},1===b.nodeType&&(r.cleanData(na(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=[];return Ja(this,arguments,function(b){var c=this.parentNode;r.inArray(this,a)<0&&(r.cleanData(na(this)),c&&c.replaceChild(b,this))},a)}}),r.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){r.fn[a]=function(a){for(var c,d=[],e=r(a),f=e.length-1,g=0;g<=f;g++)c=g===f?this:this.clone(!0),r(e[g])[b](c),h.apply(d,c.get());return this.pushStack(d)}});var La=/^margin/,Ma=new RegExp("^("+aa+")(?!px)[a-z%]+$","i"),Na=function(b){var c=b.ownerDocument.defaultView;return c&&c.opener||(c=a),c.getComputedStyle(b)};!function(){function b(){if(i){i.style.cssText="box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%",i.innerHTML="",ra.appendChild(h);var b=a.getComputedStyle(i);c="1%"!==b.top,g="2px"===b.marginLeft,e="4px"===b.width,i.style.marginRight="50%",f="4px"===b.marginRight,ra.removeChild(h),i=null}}var c,e,f,g,h=d.createElement("div"),i=d.createElement("div");i.style&&(i.style.backgroundClip="content-box",i.cloneNode(!0).style.backgroundClip="",o.clearCloneStyle="content-box"===i.style.backgroundClip,h.style.cssText="border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute",h.appendChild(i),r.extend(o,{pixelPosition:function(){return b(),c},boxSizingReliable:function(){return b(),e},pixelMarginRight:function(){return b(),f},reliableMarginLeft:function(){return b(),g}}))}();function Oa(a,b,c){var d,e,f,g,h=a.style;return c=c||Na(a),c&&(g=c.getPropertyValue(b)||c[b],""!==g||r.contains(a.ownerDocument,a)||(g=r.style(a,b)),!o.pixelMarginRight()&&Ma.test(g)&&La.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0!==g?g+"":g}function Pa(a,b){return{get:function(){return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}var Qa=/^(none|table(?!-c[ea]).+)/,Ra=/^--/,Sa={position:"absolute",visibility:"hidden",display:"block"},Ta={letterSpacing:"0",fontWeight:"400"},Ua=["Webkit","Moz","ms"],Va=d.createElement("div").style;function Wa(a){if(a in Va)return a;var b=a[0].toUpperCase()+a.slice(1),c=Ua.length;while(c--)if(a=Ua[c]+b,a in Va)return a}function Xa(a){var b=r.cssProps[a];return b||(b=r.cssProps[a]=Wa(a)||a),b}function Ya(a,b,c){var d=ba.exec(b);return d?Math.max(0,d[2]-(c||0))+(d[3]||"px"):b}function Za(a,b,c,d,e){var f,g=0;for(f=c===(d?"border":"content")?4:"width"===b?1:0;f<4;f+=2)"margin"===c&&(g+=r.css(a,c+ca[f],!0,e)),d?("content"===c&&(g-=r.css(a,"padding"+ca[f],!0,e)),"margin"!==c&&(g-=r.css(a,"border"+ca[f]+"Width",!0,e))):(g+=r.css(a,"padding"+ca[f],!0,e),"padding"!==c&&(g+=r.css(a,"border"+ca[f]+"Width",!0,e)));return g}function $a(a,b,c){var d,e=Na(a),f=Oa(a,b,e),g="border-box"===r.css(a,"boxSizing",!1,e);return Ma.test(f)?f:(d=g&&(o.boxSizingReliable()||f===a.style[b]),"auto"===f&&(f=a["offset"+b[0].toUpperCase()+b.slice(1)]),f=parseFloat(f)||0,f+Za(a,b,c||(g?"border":"content"),d,e)+"px")}r.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=Oa(a,"opacity");return""===c?"1":c}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=r.camelCase(b),i=Ra.test(b),j=a.style;return i||(b=Xa(h)),g=r.cssHooks[b]||r.cssHooks[h],void 0===c?g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:j[b]:(f=typeof c,"string"===f&&(e=ba.exec(c))&&e[1]&&(c=fa(a,b,e),f="number"),null!=c&&c===c&&("number"===f&&(c+=e&&e[3]||(r.cssNumber[h]?"":"px")),o.clearCloneStyle||""!==c||0!==b.indexOf("background")||(j[b]="inherit"),g&&"set"in g&&void 0===(c=g.set(a,c,d))||(i?j.setProperty(b,c):j[b]=c)),void 0)}},css:function(a,b,c,d){var e,f,g,h=r.camelCase(b),i=Ra.test(b);return i||(b=Xa(h)),g=r.cssHooks[b]||r.cssHooks[h],g&&"get"in g&&(e=g.get(a,!0,c)),void 0===e&&(e=Oa(a,b,d)),"normal"===e&&b in Ta&&(e=Ta[b]),""===c||c?(f=parseFloat(e),c===!0||isFinite(f)?f||0:e):e}}),r.each(["height","width"],function(a,b){r.cssHooks[b]={get:function(a,c,d){if(c)return!Qa.test(r.css(a,"display"))||a.getClientRects().length&&a.getBoundingClientRect().width?$a(a,b,d):ea(a,Sa,function(){return $a(a,b,d)})},set:function(a,c,d){var e,f=d&&Na(a),g=d&&Za(a,b,d,"border-box"===r.css(a,"boxSizing",!1,f),f);return g&&(e=ba.exec(c))&&"px"!==(e[3]||"px")&&(a.style[b]=c,c=r.css(a,b)),Ya(a,c,g)}}}),r.cssHooks.marginLeft=Pa(o.reliableMarginLeft,function(a,b){if(b)return(parseFloat(Oa(a,"marginLeft"))||a.getBoundingClientRect().left-ea(a,{marginLeft:0},function(){return a.getBoundingClientRect().left}))+"px"}),r.each({margin:"",padding:"",border:"Width"},function(a,b){r.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];d<4;d++)e[a+ca[d]+b]=f[d]||f[d-2]||f[0];return e}},La.test(a)||(r.cssHooks[a+b].set=Ya)}),r.fn.extend({css:function(a,b){return T(this,function(a,b,c){var d,e,f={},g=0;if(Array.isArray(b)){for(d=Na(a),e=b.length;g<e;g++)f[b[g]]=r.css(a,b[g],!1,d);return f}return void 0!==c?r.style(a,b,c):r.css(a,b)},a,b,arguments.length>1)}});function _a(a,b,c,d,e){return new _a.prototype.init(a,b,c,d,e)}r.Tween=_a,_a.prototype={constructor:_a,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||r.easing._default,this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(r.cssNumber[c]?"":"px")},cur:function(){var a=_a.propHooks[this.prop];return a&&a.get?a.get(this):_a.propHooks._default.get(this)},run:function(a){var b,c=_a.propHooks[this.prop];return this.options.duration?this.pos=b=r.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):this.pos=b=a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):_a.propHooks._default.set(this),this}},_a.prototype.init.prototype=_a.prototype,_a.propHooks={_default:{get:function(a){var b;return 1!==a.elem.nodeType||null!=a.elem[a.prop]&&null==a.elem.style[a.prop]?a.elem[a.prop]:(b=r.css(a.elem,a.prop,""),b&&"auto"!==b?b:0)},set:function(a){r.fx.step[a.prop]?r.fx.step[a.prop](a):1!==a.elem.nodeType||null==a.elem.style[r.cssProps[a.prop]]&&!r.cssHooks[a.prop]?a.elem[a.prop]=a.now:r.style(a.elem,a.prop,a.now+a.unit)}}},_a.propHooks.scrollTop=_a.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},r.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2},_default:"swing"},r.fx=_a.prototype.init,r.fx.step={};var ab,bb,cb=/^(?:toggle|show|hide)$/,db=/queueHooks$/;function eb(){bb&&(d.hidden===!1&&a.requestAnimationFrame?a.requestAnimationFrame(eb):a.setTimeout(eb,r.fx.interval),r.fx.tick())}function fb(){return a.setTimeout(function(){ab=void 0}),ab=r.now()}function gb(a,b){var c,d=0,e={height:a};for(b=b?1:0;d<4;d+=2-b)c=ca[d],e["margin"+c]=e["padding"+c]=a;return b&&(e.opacity=e.width=a),e}function hb(a,b,c){for(var d,e=(kb.tweeners[b]||[]).concat(kb.tweeners["*"]),f=0,g=e.length;f<g;f++)if(d=e[f].call(c,b,a))return d}function ib(a,b,c){var d,e,f,g,h,i,j,k,l="width"in b||"height"in b,m=this,n={},o=a.style,p=a.nodeType&&da(a),q=W.get(a,"fxshow");c.queue||(g=r._queueHooks(a,"fx"),null==g.unqueued&&(g.unqueued=0,h=g.empty.fire,g.empty.fire=function(){g.unqueued||h()}),g.unqueued++,m.always(function(){m.always(function(){g.unqueued--,r.queue(a,"fx").length||g.empty.fire()})}));for(d in b)if(e=b[d],cb.test(e)){if(delete b[d],f=f||"toggle"===e,e===(p?"hide":"show")){if("show"!==e||!q||void 0===q[d])continue;p=!0}n[d]=q&&q[d]||r.style(a,d)}if(i=!r.isEmptyObject(b),i||!r.isEmptyObject(n)){l&&1===a.nodeType&&(c.overflow=[o.overflow,o.overflowX,o.overflowY],j=q&&q.display,null==j&&(j=W.get(a,"display")),k=r.css(a,"display"),"none"===k&&(j?k=j:(ia([a],!0),j=a.style.display||j,k=r.css(a,"display"),ia([a]))),("inline"===k||"inline-block"===k&&null!=j)&&"none"===r.css(a,"float")&&(i||(m.done(function(){o.display=j}),null==j&&(k=o.display,j="none"===k?"":k)),o.display="inline-block")),c.overflow&&(o.overflow="hidden",m.always(function(){o.overflow=c.overflow[0],o.overflowX=c.overflow[1],o.overflowY=c.overflow[2]})),i=!1;for(d in n)i||(q?"hidden"in q&&(p=q.hidden):q=W.access(a,"fxshow",{display:j}),f&&(q.hidden=!p),p&&ia([a],!0),m.done(function(){p||ia([a]),W.remove(a,"fxshow");for(d in n)r.style(a,d,n[d])})),i=hb(p?q[d]:0,d,m),d in q||(q[d]=i.start,p&&(i.end=i.start,i.start=0))}}function jb(a,b){var c,d,e,f,g;for(c in a)if(d=r.camelCase(c),e=b[d],f=a[c],Array.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=r.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function kb(a,b,c){var d,e,f=0,g=kb.prefilters.length,h=r.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=ab||fb(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;g<i;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),f<1&&i?c:(i||h.notifyWith(a,[j,1,0]),h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:r.extend({},b),opts:r.extend(!0,{specialEasing:{},easing:r.easing._default},c),originalProperties:b,originalOptions:c,startTime:ab||fb(),duration:c.duration,tweens:[],createTween:function(b,c){var d=r.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;c<d;c++)j.tweens[c].run(1);return b?(h.notifyWith(a,[j,1,0]),h.resolveWith(a,[j,b])):h.rejectWith(a,[j,b]),this}}),k=j.props;for(jb(k,j.opts.specialEasing);f<g;f++)if(d=kb.prefilters[f].call(j,a,k,j.opts))return r.isFunction(d.stop)&&(r._queueHooks(j.elem,j.opts.queue).stop=r.proxy(d.stop,d)),d;return r.map(k,hb,j),r.isFunction(j.opts.start)&&j.opts.start.call(a,j),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always),r.fx.timer(r.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j}r.Animation=r.extend(kb,{tweeners:{"*":[function(a,b){var c=this.createTween(a,b);return fa(c.elem,a,ba.exec(b),c),c}]},tweener:function(a,b){r.isFunction(a)?(b=a,a=["*"]):a=a.match(L);for(var c,d=0,e=a.length;d<e;d++)c=a[d],kb.tweeners[c]=kb.tweeners[c]||[],kb.tweeners[c].unshift(b)},prefilters:[ib],prefilter:function(a,b){b?kb.prefilters.unshift(a):kb.prefilters.push(a)}}),r.speed=function(a,b,c){var d=a&&"object"==typeof a?r.extend({},a):{complete:c||!c&&b||r.isFunction(a)&&a,duration:a,easing:c&&b||b&&!r.isFunction(b)&&b};return r.fx.off?d.duration=0:"number"!=typeof d.duration&&(d.duration in r.fx.speeds?d.duration=r.fx.speeds[d.duration]:d.duration=r.fx.speeds._default),null!=d.queue&&d.queue!==!0||(d.queue="fx"),d.old=d.complete,d.complete=function(){r.isFunction(d.old)&&d.old.call(this),d.queue&&r.dequeue(this,d.queue)},d},r.fn.extend({fadeTo:function(a,b,c,d){return this.filter(da).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=r.isEmptyObject(a),f=r.speed(b,c,d),g=function(){var b=kb(this,r.extend({},a),f);(e||W.get(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=r.timers,g=W.get(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&db.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));!b&&c||r.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=W.get(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=r.timers,g=d?d.length:0;for(c.finish=!0,r.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;b<g;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),r.each(["toggle","show","hide"],function(a,b){var c=r.fn[b];r.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(gb(b,!0),a,d,e)}}),r.each({slideDown:gb("show"),slideUp:gb("hide"),slideToggle:gb("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){r.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),r.timers=[],r.fx.tick=function(){var a,b=0,c=r.timers;for(ab=r.now();b<c.length;b++)a=c[b],a()||c[b]!==a||c.splice(b--,1);c.length||r.fx.stop(),ab=void 0},r.fx.timer=function(a){r.timers.push(a),r.fx.start()},r.fx.interval=13,r.fx.start=function(){bb||(bb=!0,eb())},r.fx.stop=function(){bb=null},r.fx.speeds={slow:600,fast:200,_default:400},r.fn.delay=function(b,c){return b=r.fx?r.fx.speeds[b]||b:b,c=c||"fx",this.queue(c,function(c,d){var e=a.setTimeout(c,b);d.stop=function(){a.clearTimeout(e)}})},function(){var a=d.createElement("input"),b=d.createElement("select"),c=b.appendChild(d.createElement("option"));a.type="checkbox",o.checkOn=""!==a.value,o.optSelected=c.selected,a=d.createElement("input"),a.value="t",a.type="radio",o.radioValue="t"===a.value}();var lb,mb=r.expr.attrHandle;r.fn.extend({attr:function(a,b){return T(this,r.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){r.removeAttr(this,a)})}}),r.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return"undefined"==typeof a.getAttribute?r.prop(a,b,c):(1===f&&r.isXMLDoc(a)||(e=r.attrHooks[b.toLowerCase()]||(r.expr.match.bool.test(b)?lb:void 0)),void 0!==c?null===c?void r.removeAttr(a,b):e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:(a.setAttribute(b,c+""),c):e&&"get"in e&&null!==(d=e.get(a,b))?d:(d=r.find.attr(a,b),
null==d?void 0:d))},attrHooks:{type:{set:function(a,b){if(!o.radioValue&&"radio"===b&&B(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}},removeAttr:function(a,b){var c,d=0,e=b&&b.match(L);if(e&&1===a.nodeType)while(c=e[d++])a.removeAttribute(c)}}),lb={set:function(a,b,c){return b===!1?r.removeAttr(a,c):a.setAttribute(c,c),c}},r.each(r.expr.match.bool.source.match(/\w+/g),function(a,b){var c=mb[b]||r.find.attr;mb[b]=function(a,b,d){var e,f,g=b.toLowerCase();return d||(f=mb[g],mb[g]=e,e=null!=c(a,b,d)?g:null,mb[g]=f),e}});var nb=/^(?:input|select|textarea|button)$/i,ob=/^(?:a|area)$/i;r.fn.extend({prop:function(a,b){return T(this,r.prop,a,b,arguments.length>1)},removeProp:function(a){return this.each(function(){delete this[r.propFix[a]||a]})}}),r.extend({prop:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return 1===f&&r.isXMLDoc(a)||(b=r.propFix[b]||b,e=r.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){var b=r.find.attr(a,"tabindex");return b?parseInt(b,10):nb.test(a.nodeName)||ob.test(a.nodeName)&&a.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),o.optSelected||(r.propHooks.selected={get:function(a){var b=a.parentNode;return b&&b.parentNode&&b.parentNode.selectedIndex,null},set:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex)}}),r.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){r.propFix[this.toLowerCase()]=this});function pb(a){var b=a.match(L)||[];return b.join(" ")}function qb(a){return a.getAttribute&&a.getAttribute("class")||""}r.fn.extend({addClass:function(a){var b,c,d,e,f,g,h,i=0;if(r.isFunction(a))return this.each(function(b){r(this).addClass(a.call(this,b,qb(this)))});if("string"==typeof a&&a){b=a.match(L)||[];while(c=this[i++])if(e=qb(c),d=1===c.nodeType&&" "+pb(e)+" "){g=0;while(f=b[g++])d.indexOf(" "+f+" ")<0&&(d+=f+" ");h=pb(d),e!==h&&c.setAttribute("class",h)}}return this},removeClass:function(a){var b,c,d,e,f,g,h,i=0;if(r.isFunction(a))return this.each(function(b){r(this).removeClass(a.call(this,b,qb(this)))});if(!arguments.length)return this.attr("class","");if("string"==typeof a&&a){b=a.match(L)||[];while(c=this[i++])if(e=qb(c),d=1===c.nodeType&&" "+pb(e)+" "){g=0;while(f=b[g++])while(d.indexOf(" "+f+" ")>-1)d=d.replace(" "+f+" "," ");h=pb(d),e!==h&&c.setAttribute("class",h)}}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):r.isFunction(a)?this.each(function(c){r(this).toggleClass(a.call(this,c,qb(this),b),b)}):this.each(function(){var b,d,e,f;if("string"===c){d=0,e=r(this),f=a.match(L)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else void 0!==a&&"boolean"!==c||(b=qb(this),b&&W.set(this,"__className__",b),this.setAttribute&&this.setAttribute("class",b||a===!1?"":W.get(this,"__className__")||""))})},hasClass:function(a){var b,c,d=0;b=" "+a+" ";while(c=this[d++])if(1===c.nodeType&&(" "+pb(qb(c))+" ").indexOf(b)>-1)return!0;return!1}});var rb=/\r/g;r.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=r.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,r(this).val()):a,null==e?e="":"number"==typeof e?e+="":Array.isArray(e)&&(e=r.map(e,function(a){return null==a?"":a+""})),b=r.valHooks[this.type]||r.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=r.valHooks[e.type]||r.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(rb,""):null==c?"":c)}}}),r.extend({valHooks:{option:{get:function(a){var b=r.find.attr(a,"value");return null!=b?b:pb(r.text(a))}},select:{get:function(a){var b,c,d,e=a.options,f=a.selectedIndex,g="select-one"===a.type,h=g?null:[],i=g?f+1:e.length;for(d=f<0?i:g?f:0;d<i;d++)if(c=e[d],(c.selected||d===f)&&!c.disabled&&(!c.parentNode.disabled||!B(c.parentNode,"optgroup"))){if(b=r(c).val(),g)return b;h.push(b)}return h},set:function(a,b){var c,d,e=a.options,f=r.makeArray(b),g=e.length;while(g--)d=e[g],(d.selected=r.inArray(r.valHooks.option.get(d),f)>-1)&&(c=!0);return c||(a.selectedIndex=-1),f}}}}),r.each(["radio","checkbox"],function(){r.valHooks[this]={set:function(a,b){if(Array.isArray(b))return a.checked=r.inArray(r(a).val(),b)>-1}},o.checkOn||(r.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})});var sb=/^(?:focusinfocus|focusoutblur)$/;r.extend(r.event,{trigger:function(b,c,e,f){var g,h,i,j,k,m,n,o=[e||d],p=l.call(b,"type")?b.type:b,q=l.call(b,"namespace")?b.namespace.split("."):[];if(h=i=e=e||d,3!==e.nodeType&&8!==e.nodeType&&!sb.test(p+r.event.triggered)&&(p.indexOf(".")>-1&&(q=p.split("."),p=q.shift(),q.sort()),k=p.indexOf(":")<0&&"on"+p,b=b[r.expando]?b:new r.Event(p,"object"==typeof b&&b),b.isTrigger=f?2:3,b.namespace=q.join("."),b.rnamespace=b.namespace?new RegExp("(^|\\.)"+q.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=e),c=null==c?[b]:r.makeArray(c,[b]),n=r.event.special[p]||{},f||!n.trigger||n.trigger.apply(e,c)!==!1)){if(!f&&!n.noBubble&&!r.isWindow(e)){for(j=n.delegateType||p,sb.test(j+p)||(h=h.parentNode);h;h=h.parentNode)o.push(h),i=h;i===(e.ownerDocument||d)&&o.push(i.defaultView||i.parentWindow||a)}g=0;while((h=o[g++])&&!b.isPropagationStopped())b.type=g>1?j:n.bindType||p,m=(W.get(h,"events")||{})[b.type]&&W.get(h,"handle"),m&&m.apply(h,c),m=k&&h[k],m&&m.apply&&U(h)&&(b.result=m.apply(h,c),b.result===!1&&b.preventDefault());return b.type=p,f||b.isDefaultPrevented()||n._default&&n._default.apply(o.pop(),c)!==!1||!U(e)||k&&r.isFunction(e[p])&&!r.isWindow(e)&&(i=e[k],i&&(e[k]=null),r.event.triggered=p,e[p](),r.event.triggered=void 0,i&&(e[k]=i)),b.result}},simulate:function(a,b,c){var d=r.extend(new r.Event,c,{type:a,isSimulated:!0});r.event.trigger(d,null,b)}}),r.fn.extend({trigger:function(a,b){return this.each(function(){r.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];if(c)return r.event.trigger(a,b,c,!0)}}),r.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(a,b){r.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),r.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),o.focusin="onfocusin"in a,o.focusin||r.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){r.event.simulate(b,a.target,r.event.fix(a))};r.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=W.access(d,b);e||d.addEventListener(a,c,!0),W.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=W.access(d,b)-1;e?W.access(d,b,e):(d.removeEventListener(a,c,!0),W.remove(d,b))}}});var tb=a.location,ub=r.now(),vb=/\?/;r.parseXML=function(b){var c;if(!b||"string"!=typeof b)return null;try{c=(new a.DOMParser).parseFromString(b,"text/xml")}catch(d){c=void 0}return c&&!c.getElementsByTagName("parsererror").length||r.error("Invalid XML: "+b),c};var wb=/\[\]$/,xb=/\r?\n/g,yb=/^(?:submit|button|image|reset|file)$/i,zb=/^(?:input|select|textarea|keygen)/i;function Ab(a,b,c,d){var e;if(Array.isArray(b))r.each(b,function(b,e){c||wb.test(a)?d(a,e):Ab(a+"["+("object"==typeof e&&null!=e?b:"")+"]",e,c,d)});else if(c||"object"!==r.type(b))d(a,b);else for(e in b)Ab(a+"["+e+"]",b[e],c,d)}r.param=function(a,b){var c,d=[],e=function(a,b){var c=r.isFunction(b)?b():b;d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(null==c?"":c)};if(Array.isArray(a)||a.jquery&&!r.isPlainObject(a))r.each(a,function(){e(this.name,this.value)});else for(c in a)Ab(c,a[c],b,e);return d.join("&")},r.fn.extend({serialize:function(){return r.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=r.prop(this,"elements");return a?r.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!r(this).is(":disabled")&&zb.test(this.nodeName)&&!yb.test(a)&&(this.checked||!ja.test(a))}).map(function(a,b){var c=r(this).val();return null==c?null:Array.isArray(c)?r.map(c,function(a){return{name:b.name,value:a.replace(xb,"\r\n")}}):{name:b.name,value:c.replace(xb,"\r\n")}}).get()}});var Bb=/%20/g,Cb=/#.*$/,Db=/([?&])_=[^&]*/,Eb=/^(.*?):[ \t]*([^\r\n]*)$/gm,Fb=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Gb=/^(?:GET|HEAD)$/,Hb=/^\/\//,Ib={},Jb={},Kb="*/".concat("*"),Lb=d.createElement("a");Lb.href=tb.href;function Mb(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(L)||[];if(r.isFunction(c))while(d=f[e++])"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function Nb(a,b,c,d){var e={},f=a===Jb;function g(h){var i;return e[h]=!0,r.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function Ob(a,b){var c,d,e=r.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&r.extend(!0,a,d),a}function Pb(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}if(i[0]in c)f=i[0];else{for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}f=f||g}if(f)return f!==i[0]&&i.unshift(f),c[f]}function Qb(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}r.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:tb.href,type:"GET",isLocal:Fb.test(tb.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Kb,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":r.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?Ob(Ob(a,r.ajaxSettings),b):Ob(r.ajaxSettings,a)},ajaxPrefilter:Mb(Ib),ajaxTransport:Mb(Jb),ajax:function(b,c){"object"==typeof b&&(c=b,b=void 0),c=c||{};var e,f,g,h,i,j,k,l,m,n,o=r.ajaxSetup({},c),p=o.context||o,q=o.context&&(p.nodeType||p.jquery)?r(p):r.event,s=r.Deferred(),t=r.Callbacks("once memory"),u=o.statusCode||{},v={},w={},x="canceled",y={readyState:0,getResponseHeader:function(a){var b;if(k){if(!h){h={};while(b=Eb.exec(g))h[b[1].toLowerCase()]=b[2]}b=h[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return k?g:null},setRequestHeader:function(a,b){return null==k&&(a=w[a.toLowerCase()]=w[a.toLowerCase()]||a,v[a]=b),this},overrideMimeType:function(a){return null==k&&(o.mimeType=a),this},statusCode:function(a){var b;if(a)if(k)y.always(a[y.status]);else for(b in a)u[b]=[u[b],a[b]];return this},abort:function(a){var b=a||x;return e&&e.abort(b),A(0,b),this}};if(s.promise(y),o.url=((b||o.url||tb.href)+"").replace(Hb,tb.protocol+"//"),o.type=c.method||c.type||o.method||o.type,o.dataTypes=(o.dataType||"*").toLowerCase().match(L)||[""],null==o.crossDomain){j=d.createElement("a");try{j.href=o.url,j.href=j.href,o.crossDomain=Lb.protocol+"//"+Lb.host!=j.protocol+"//"+j.host}catch(z){o.crossDomain=!0}}if(o.data&&o.processData&&"string"!=typeof o.data&&(o.data=r.param(o.data,o.traditional)),Nb(Ib,o,c,y),k)return y;l=r.event&&o.global,l&&0===r.active++&&r.event.trigger("ajaxStart"),o.type=o.type.toUpperCase(),o.hasContent=!Gb.test(o.type),f=o.url.replace(Cb,""),o.hasContent?o.data&&o.processData&&0===(o.contentType||"").indexOf("application/x-www-form-urlencoded")&&(o.data=o.data.replace(Bb,"+")):(n=o.url.slice(f.length),o.data&&(f+=(vb.test(f)?"&":"?")+o.data,delete o.data),o.cache===!1&&(f=f.replace(Db,"$1"),n=(vb.test(f)?"&":"?")+"_="+ub++ +n),o.url=f+n),o.ifModified&&(r.lastModified[f]&&y.setRequestHeader("If-Modified-Since",r.lastModified[f]),r.etag[f]&&y.setRequestHeader("If-None-Match",r.etag[f])),(o.data&&o.hasContent&&o.contentType!==!1||c.contentType)&&y.setRequestHeader("Content-Type",o.contentType),y.setRequestHeader("Accept",o.dataTypes[0]&&o.accepts[o.dataTypes[0]]?o.accepts[o.dataTypes[0]]+("*"!==o.dataTypes[0]?", "+Kb+"; q=0.01":""):o.accepts["*"]);for(m in o.headers)y.setRequestHeader(m,o.headers[m]);if(o.beforeSend&&(o.beforeSend.call(p,y,o)===!1||k))return y.abort();if(x="abort",t.add(o.complete),y.done(o.success),y.fail(o.error),e=Nb(Jb,o,c,y)){if(y.readyState=1,l&&q.trigger("ajaxSend",[y,o]),k)return y;o.async&&o.timeout>0&&(i=a.setTimeout(function(){y.abort("timeout")},o.timeout));try{k=!1,e.send(v,A)}catch(z){if(k)throw z;A(-1,z)}}else A(-1,"No Transport");function A(b,c,d,h){var j,m,n,v,w,x=c;k||(k=!0,i&&a.clearTimeout(i),e=void 0,g=h||"",y.readyState=b>0?4:0,j=b>=200&&b<300||304===b,d&&(v=Pb(o,y,d)),v=Qb(o,v,y,j),j?(o.ifModified&&(w=y.getResponseHeader("Last-Modified"),w&&(r.lastModified[f]=w),w=y.getResponseHeader("etag"),w&&(r.etag[f]=w)),204===b||"HEAD"===o.type?x="nocontent":304===b?x="notmodified":(x=v.state,m=v.data,n=v.error,j=!n)):(n=x,!b&&x||(x="error",b<0&&(b=0))),y.status=b,y.statusText=(c||x)+"",j?s.resolveWith(p,[m,x,y]):s.rejectWith(p,[y,x,n]),y.statusCode(u),u=void 0,l&&q.trigger(j?"ajaxSuccess":"ajaxError",[y,o,j?m:n]),t.fireWith(p,[y,x]),l&&(q.trigger("ajaxComplete",[y,o]),--r.active||r.event.trigger("ajaxStop")))}return y},getJSON:function(a,b,c){return r.get(a,b,c,"json")},getScript:function(a,b){return r.get(a,void 0,b,"script")}}),r.each(["get","post"],function(a,b){r[b]=function(a,c,d,e){return r.isFunction(c)&&(e=e||d,d=c,c=void 0),r.ajax(r.extend({url:a,type:b,dataType:e,data:c,success:d},r.isPlainObject(a)&&a))}}),r._evalUrl=function(a){return r.ajax({url:a,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,"throws":!0})},r.fn.extend({wrapAll:function(a){var b;return this[0]&&(r.isFunction(a)&&(a=a.call(this[0])),b=r(a,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstElementChild)a=a.firstElementChild;return a}).append(this)),this},wrapInner:function(a){return r.isFunction(a)?this.each(function(b){r(this).wrapInner(a.call(this,b))}):this.each(function(){var b=r(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=r.isFunction(a);return this.each(function(c){r(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(a){return this.parent(a).not("body").each(function(){r(this).replaceWith(this.childNodes)}),this}}),r.expr.pseudos.hidden=function(a){return!r.expr.pseudos.visible(a)},r.expr.pseudos.visible=function(a){return!!(a.offsetWidth||a.offsetHeight||a.getClientRects().length)},r.ajaxSettings.xhr=function(){try{return new a.XMLHttpRequest}catch(b){}};var Rb={0:200,1223:204},Sb=r.ajaxSettings.xhr();o.cors=!!Sb&&"withCredentials"in Sb,o.ajax=Sb=!!Sb,r.ajaxTransport(function(b){var c,d;if(o.cors||Sb&&!b.crossDomain)return{send:function(e,f){var g,h=b.xhr();if(h.open(b.type,b.url,b.async,b.username,b.password),b.xhrFields)for(g in b.xhrFields)h[g]=b.xhrFields[g];b.mimeType&&h.overrideMimeType&&h.overrideMimeType(b.mimeType),b.crossDomain||e["X-Requested-With"]||(e["X-Requested-With"]="XMLHttpRequest");for(g in e)h.setRequestHeader(g,e[g]);c=function(a){return function(){c&&(c=d=h.onload=h.onerror=h.onabort=h.onreadystatechange=null,"abort"===a?h.abort():"error"===a?"number"!=typeof h.status?f(0,"error"):f(h.status,h.statusText):f(Rb[h.status]||h.status,h.statusText,"text"!==(h.responseType||"text")||"string"!=typeof h.responseText?{binary:h.response}:{text:h.responseText},h.getAllResponseHeaders()))}},h.onload=c(),d=h.onerror=c("error"),void 0!==h.onabort?h.onabort=d:h.onreadystatechange=function(){4===h.readyState&&a.setTimeout(function(){c&&d()})},c=c("abort");try{h.send(b.hasContent&&b.data||null)}catch(i){if(c)throw i}},abort:function(){c&&c()}}}),r.ajaxPrefilter(function(a){a.crossDomain&&(a.contents.script=!1)}),r.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(a){return r.globalEval(a),a}}}),r.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),r.ajaxTransport("script",function(a){if(a.crossDomain){var b,c;return{send:function(e,f){b=r("<script>").prop({charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&f("error"===a.type?404:200,a.type)}),d.head.appendChild(b[0])},abort:function(){c&&c()}}}});var Tb=[],Ub=/(=)\?(?=&|$)|\?\?/;r.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=Tb.pop()||r.expando+"_"+ub++;return this[a]=!0,a}}),r.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(Ub.test(b.url)?"url":"string"==typeof b.data&&0===(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&Ub.test(b.data)&&"data");if(h||"jsonp"===b.dataTypes[0])return e=b.jsonpCallback=r.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(Ub,"$1"+e):b.jsonp!==!1&&(b.url+=(vb.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||r.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){void 0===f?r(a).removeProp(e):a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,Tb.push(e)),g&&r.isFunction(f)&&f(g[0]),g=f=void 0}),"script"}),o.createHTMLDocument=function(){var a=d.implementation.createHTMLDocument("").body;return a.innerHTML="<form></form><form></form>",2===a.childNodes.length}(),r.parseHTML=function(a,b,c){if("string"!=typeof a)return[];"boolean"==typeof b&&(c=b,b=!1);var e,f,g;return b||(o.createHTMLDocument?(b=d.implementation.createHTMLDocument(""),e=b.createElement("base"),e.href=d.location.href,b.head.appendChild(e)):b=d),f=C.exec(a),g=!c&&[],f?[b.createElement(f[1])]:(f=qa([a],b,g),g&&g.length&&r(g).remove(),r.merge([],f.childNodes))},r.fn.load=function(a,b,c){var d,e,f,g=this,h=a.indexOf(" ");return h>-1&&(d=pb(a.slice(h)),a=a.slice(0,h)),r.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&r.ajax({url:a,type:e||"GET",dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?r("<div>").append(r.parseHTML(a)).find(d):a)}).always(c&&function(a,b){g.each(function(){c.apply(this,f||[a.responseText,b,a])})}),this},r.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){r.fn[b]=function(a){return this.on(b,a)}}),r.expr.pseudos.animated=function(a){return r.grep(r.timers,function(b){return a===b.elem}).length},r.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=r.css(a,"position"),l=r(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=r.css(a,"top"),i=r.css(a,"left"),j=("absolute"===k||"fixed"===k)&&(f+i).indexOf("auto")>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),r.isFunction(b)&&(b=b.call(a,c,r.extend({},h))),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},r.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){r.offset.setOffset(this,a,b)});var b,c,d,e,f=this[0];if(f)return f.getClientRects().length?(d=f.getBoundingClientRect(),b=f.ownerDocument,c=b.documentElement,e=b.defaultView,{top:d.top+e.pageYOffset-c.clientTop,left:d.left+e.pageXOffset-c.clientLeft}):{top:0,left:0}},position:function(){if(this[0]){var a,b,c=this[0],d={top:0,left:0};return"fixed"===r.css(c,"position")?b=c.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),B(a[0],"html")||(d=a.offset()),d={top:d.top+r.css(a[0],"borderTopWidth",!0),left:d.left+r.css(a[0],"borderLeftWidth",!0)}),{top:b.top-d.top-r.css(c,"marginTop",!0),left:b.left-d.left-r.css(c,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent;while(a&&"static"===r.css(a,"position"))a=a.offsetParent;return a||ra})}}),r.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,b){var c="pageYOffset"===b;r.fn[a]=function(d){return T(this,function(a,d,e){var f;return r.isWindow(a)?f=a:9===a.nodeType&&(f=a.defaultView),void 0===e?f?f[b]:a[d]:void(f?f.scrollTo(c?f.pageXOffset:e,c?e:f.pageYOffset):a[d]=e)},a,d,arguments.length)}}),r.each(["top","left"],function(a,b){r.cssHooks[b]=Pa(o.pixelPosition,function(a,c){if(c)return c=Oa(a,b),Ma.test(c)?r(a).position()[b]+"px":c})}),r.each({Height:"height",Width:"width"},function(a,b){r.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){r.fn[d]=function(e,f){var g=arguments.length&&(c||"boolean"!=typeof e),h=c||(e===!0||f===!0?"margin":"border");return T(this,function(b,c,e){var f;return r.isWindow(b)?0===d.indexOf("outer")?b["inner"+a]:b.document.documentElement["client"+a]:9===b.nodeType?(f=b.documentElement,Math.max(b.body["scroll"+a],f["scroll"+a],b.body["offset"+a],f["offset"+a],f["client"+a])):void 0===e?r.css(b,c,h):r.style(b,c,e,h)},b,g?e:void 0,g)}})}),r.fn.extend({bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}}),r.holdReady=function(a){a?r.readyWait++:r.ready(!0)},r.isArray=Array.isArray,r.parseJSON=JSON.parse,r.nodeName=B,"function"==typeof define&&define.amd&&define("jquery",[],function(){return r});var Vb=a.jQuery,Wb=a.$;return r.noConflict=function(b){return a.$===r&&(a.$=Wb),b&&a.jQuery===r&&(a.jQuery=Vb),r},b||(a.jQuery=a.$=r),r});


/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = true;


/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(8);
var dPs = __webpack_require__(73);
var enumBugKeys = __webpack_require__(31);
var IE_PROTO = __webpack_require__(29)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(26)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(46).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(12);
var toIObject = __webpack_require__(14);
var arrayIndexOf = __webpack_require__(74)(false);
var IE_PROTO = __webpack_require__(29)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(15);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(2).document;
module.exports = document && document.documentElement;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(12);
var toObject = __webpack_require__(18);
var IE_PROTO = __webpack_require__(29)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),
/* 48 */
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__(8);
var aFunction = __webpack_require__(10);
var SPECIES = __webpack_require__(3)('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(5);
var invoke = __webpack_require__(82);
var html = __webpack_require__(46);
var cel = __webpack_require__(26);
var global = __webpack_require__(2);
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__(15)(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};


/***/ }),
/* 51 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(8);
var isObject = __webpack_require__(4);
var newPromiseCapability = __webpack_require__(35);

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(2);
var core = __webpack_require__(0);
var dP = __webpack_require__(7);
var DESCRIPTORS = __webpack_require__(9);
var SPECIES = __webpack_require__(3)('species');

module.exports = function (KEY) {
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory(__webpack_require__(87), __webpack_require__(98), __webpack_require__(103), __webpack_require__(108), __webpack_require__(111), __webpack_require__(117), __webpack_require__(119), __webpack_require__(122), __webpack_require__(20), __webpack_require__(19), (function webpackLoadOptionalExternalModule() { try { return __webpack_require__(39); } catch(e) {} }()));
	else if(typeof define === 'function' && define.amd)
		define("clientnode", ["babel-runtime/core-js/set", "babel-runtime/core-js/object/get-own-property-names", "babel-runtime/core-js/object/values", "babel-runtime/core-js/object/keys", "babel-runtime/core-js/map", "babel-runtime/core-js/json/stringify", "babel-runtime/core-js/number/is-nan", "babel-runtime/core-js/object/get-prototype-of", "babel-runtime/core-js/promise", "babel-runtime/helpers/asyncToGenerator", 'jquery'], factory);
	else if(typeof exports === 'object')
		exports["clientnode"] = factory(require("babel-runtime/core-js/set"), require("babel-runtime/core-js/object/get-own-property-names"), require("babel-runtime/core-js/object/values"), require("babel-runtime/core-js/object/keys"), require("babel-runtime/core-js/map"), require("babel-runtime/core-js/json/stringify"), require("babel-runtime/core-js/number/is-nan"), require("babel-runtime/core-js/object/get-prototype-of"), require("babel-runtime/core-js/promise"), require("babel-runtime/helpers/asyncToGenerator"), (function webpackLoadOptionalExternalModule() { try { return require('jquery'); } catch(e) {} }()));
	else
		root['clientnode'] = factory(root["babel-runtime/core-js/set"], root["babel-runtime/core-js/object/get-own-property-names"], root["babel-runtime/core-js/object/values"], root["babel-runtime/core-js/object/keys"], root["babel-runtime/core-js/map"], root["babel-runtime/core-js/json/stringify"], root["babel-runtime/core-js/number/is-nan"], root["babel-runtime/core-js/object/get-prototype-of"], root["babel-runtime/core-js/promise"], root["babel-runtime/helpers/asyncToGenerator"], root["jQuery"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_8__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_9__, __WEBPACK_EXTERNAL_MODULE_10__, __WEBPACK_EXTERNAL_MODULE_11__, __WEBPACK_EXTERNAL_MODULE_12__, __WEBPACK_EXTERNAL_MODULE_13__, __WEBPACK_EXTERNAL_MODULE_14__, __WEBPACK_EXTERNAL_MODULE_15__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module, global, process) {// #!/usr/bin/env node
// -*- coding: utf-8 -*-
/** @module clientnode *//* !
    region header
    [Project page](http://torben.website/clientnode)

    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    See http://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/// region imports
exports.__esModule=true;exports.$=exports.globalContext=undefined;var _getOwnPropertyNames=__webpack_require__(5);var _getOwnPropertyNames2=_interopRequireDefault(_getOwnPropertyNames);var _values=__webpack_require__(6);var _values2=_interopRequireDefault(_values);var _keys=__webpack_require__(7);var _keys2=_interopRequireDefault(_keys);var _set=__webpack_require__(8);var _set2=_interopRequireDefault(_set);var _map=__webpack_require__(9);var _map2=_interopRequireDefault(_map);var _stringify=__webpack_require__(10);var _stringify2=_interopRequireDefault(_stringify);var _isNan=__webpack_require__(11);var _isNan2=_interopRequireDefault(_isNan);var _getPrototypeOf=__webpack_require__(12);var _getPrototypeOf2=_interopRequireDefault(_getPrototypeOf);var _promise=__webpack_require__(13);var _promise2=_interopRequireDefault(_promise);var _asyncToGenerator2=__webpack_require__(14);var _asyncToGenerator3=_interopRequireDefault(_asyncToGenerator2);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}let fileSystem={};try{fileSystem=eval('require')('fs')}catch(error){}let path={};try{path=eval('require')('path')}catch(error){}// NOTE: Only needed for debugging this file.
try{module.require('source-map-support/register')}catch(error){}// endregion
// region types
// / region browser
// / endregion
// endregion
// region determine context
const globalContext=exports.globalContext=function(){if(typeof window==='undefined'){if(typeof global==='undefined')return  false?{}:module;if('window'in global)return global.window;return global}return window}();/* eslint-disable no-use-before-define */const $=exports.$=function(){/* eslint-enable no-use-before-define */let _$;if('$'in globalContext&&globalContext.$!==null)_$=globalContext.$;else{if(!('$'in globalContext)&&'document'in globalContext)try{return __webpack_require__(15)}catch(error){}const selector='document'in globalContext&&'querySelectorAll'in globalContext.document?globalContext.document.querySelectorAll.bind(globalContext.document):function(){return null};_$=function $(parameter,...additionalArguments){if(typeof parameter==='string'){const $domNodes=selector(parameter,...additionalArguments);if('fn'in _$)for(const key in _$.fn)if(_$.fn.hasOwnProperty(key))// IgnoreTypeCheck
$domNodes[key]=_$.fn[key].bind($domNodes);return $domNodes}/* eslint-disable no-use-before-define */if(Tools.isFunction(parameter)&&'document'in globalContext)/* eslint-enable no-use-before-define */globalContext.document.addEventListener('DOMContentLoaded',parameter);return parameter};_$.fn={}}return _$}();if(!('global'in $))$.global=globalContext;if(!('context'in $)&&'document'in $.global)$.context=$.global.document;// endregion
// region plugins/classes
/**
 * This plugin provides such interface logic like generic controller logic for
 * integrating plugins into $, mutual exclusion for depending gui elements,
 * logging additional string, array or function handling. A set of helper
 * functions to parse option objects dom trees or handle events is also
 * provided.
 * @property static:abbreviations - Lists all known abbreviation for proper
 * camel case to delimited and back conversion.
 * @property static:animationEndEventNames - Saves a string with all css3
 * browser specific animation end event names.
 * @property static:classToTypeMapping - String representation to object type
 * name mapping.
 * @property static:closeEventNames - Process event names which indicates that
 * a process has finished.
 * @property static:consoleMethodNames - This variable contains a collection of
 * methods usually binded to the console object.
 * @property static:keyCode - Saves a mapping from key codes to their
 * corresponding name.
 * @property static:maximalSupportedInternetExplorerVersion - Saves currently
 * minimal supported internet explorer version. Saves zero if no internet
 * explorer present.
 * @property static:noop - A no-op dummy function.
 * @property static:specialRegexSequences - A list of special regular
 * expression symbols.
 * @property static:transitionEndEventNames - Saves a string with all css3
 * browser specific transition end event names.
 * @property static:_javaScriptDependentContentHandled - Indicates whether
 * javaScript dependent content where hide or shown.
 *
 * @property $domNode - $-extended dom node if one was given to the constructor
 * method.
 * @property locks - Mapping of lock descriptions to there corresponding
 * callbacks.
 *
 * @property _options - Options given to the constructor.
 * @property _defaultOptions - Fallback options if not overwritten by the
 * options given to the constructor method.
 * @property _defaultOptions.logging {boolean} - Indicates whether logging
 * should be active.
 * @property _defaultOptions.domNodeSelectorPrefix {string} - Selector prefix
 * for all needed dom nodes.
 * @property _defaultOptions.domNode {Object.<string, string>} - Mapping of
 * names to needed dom nodes referenced by there selector.
 * @property _defaultOptions.domNode.hideJavaScriptEnabled {string} - Selector
 * to dom nodes which should be hidden if javaScript is available.
 * @property _defaultOptions.domNode.showJavaScriptEnabled {string} - Selector
 * to dom nodes which should be visible if javaScript is available.
 */class Tools{// endregion
// region public methods
// / region special
/**
     * This method should be overwritten normally. It is triggered if current
     * object is created via the "new" keyword. The dom node selector prefix
     * enforces to not globally select any dom nodes which aren't in the
     * expected scope of this plugin. "{1}" will be automatically replaced with
     * this plugin name suffix ("tools"). You don't have to use "{1}" but it
     * can help you to write code which is more reconcilable with the dry
     * concept.
     * @param $domNode - $-extended dom node to use as reference in various
     * methods.
     * @param options - Options to change runtime behavior.
     * @param defaultOptions - Default options to ensure to be present in any
     * options instance.
     * @param locks - Mapping of a lock description to callbacks for calling
     * when given lock should be released.
     * @returns Returns nothing but if invoked with "new" an instance of this
     * class will be given back.
     */// endregion
// region dynamic properties
// region static properties
constructor($domNode=null,options={},defaultOptions={domNode:{hideJavaScriptEnabled:'.tools-hidden-on-javascript-enabled',showJavaScriptEnabled:'.tools-visible-on-javascript-enabled'},domNodeSelectorPrefix:'body',logging:false},locks={}){if($domNode)this.$domNode=$domNode;this._options=options;this._defaultOptions=defaultOptions;this.locks=locks;// Avoid errors in browsers that lack a console.
if(!('console'in $.global))$.global.console={};for(const methodName of this.constructor.consoleMethodNames)if(!(methodName in $.global.console))$.global.console[methodName]=this.constructor.noop;if(!this.constructor._javaScriptDependentContentHandled&&'document'in $.global&&'filter'in $&&'hide'in $&&'show'in $){this.constructor._javaScriptDependentContentHandled=true;$(`${this._defaultOptions.domNodeSelectorPrefix} `+this._defaultOptions.domNode.hideJavaScriptEnabled).filter(function(){return!$(this).data('javaScriptDependentContentHide')}).data('javaScriptDependentContentHide',true).hide();$(`${this._defaultOptions.domNodeSelectorPrefix} `+this._defaultOptions.domNode.showJavaScriptEnabled).filter(function(){return!$(this).data('javaScriptDependentContentShow')}).data('javaScriptDependentContentShow',true).show()}}/**
     * This method could be overwritten normally. It acts like a destructor.
     * @returns Returns the current instance.
     */destructor(){if('off'in $.fn)this.off('*');return this}/**
     * This method should be overwritten normally. It is triggered if current
     * object was created via the "new" keyword and is called now.
     * @param options - An options object.
     * @returns Returns the current instance.
     */initialize(options={}){/*
            NOTE: We have to create a new options object instance to avoid
            changing a static options object.
        */this._options=this.constructor.extendObject(true,{},this._defaultOptions,this._options,options);/*
            The selector prefix should be parsed after extending options
            because the selector would be overwritten otherwise.
        */this._options.domNodeSelectorPrefix=this.constructor.stringFormat(this._options.domNodeSelectorPrefix,this.constructor.stringCamelCaseToDelimited(this.constructor.name));return this}// / endregion
// / region object orientation
/* eslint-disable jsdoc/require-description-complete-sentence *//**
     * Defines a generic controller for dom node aware plugins.
     * @param object - The object or class to control. If "object" is a class
     * an instance will be generated.
     * @param parameter - The initially given arguments object.
     * @param $domNode - Optionally a $-extended dom node to use as reference.
     * @returns Returns whatever the initializer method returns.
     */controller(object,parameter,$domNode=null){/* eslint-enable jsdoc/require-description-complete-sentence */if(typeof object==='function'){object=new object($domNode);if(!(object instanceof Tools))object=this.constructor.extendObject(true,new Tools,object)}parameter=this.constructor.arrayMake(parameter);if($domNode&&'data'in $domNode&&!$domNode.data(object.constructor.name))// Attach extended object to the associated dom node.
$domNode.data(object.constructor.name,object);if(parameter[0]in object){if(Tools.isFunction(object[parameter[0]]))return object[parameter[0]](...parameter.slice(1));return object[parameter[0]]}else if(parameter.length===0||typeof parameter[0]==='object')/*
                If an options object or no method name is given the initializer
                will be called.
            */return object.initialize(...parameter);throw new Error(`Method "${parameter[0]}" does not exist on $-extended dom node `+`"${object.constructor.name}".`)}// / endregion
// / region mutual exclusion
/**
     * Calling this method introduces a starting point for a critical area with
     * potential race conditions. The area will be binded to given description
     * string. So don't use same names for different areas.
     * @param description - A short string describing the critical areas
     * properties.
     * @param callbackFunction - A procedure which should only be executed if
     * the interpreter isn't in the given critical area. The lock description
     * string will be given to the callback function.
     * @param autoRelease - Release the lock after execution of given callback.
     * @returns Returns a promise which will be resolved after releasing lock.
     */acquireLock(description,callbackFunction=Tools.noop,autoRelease=false){var _this=this;return(0,_asyncToGenerator3.default)(function*(){return new _promise2.default(function(resolve){const wrappedCallbackFunction=function(){var _ref=(0,_asyncToGenerator3.default)(function*(description){const result=callbackFunction(description);const finish=function finish(value){if(autoRelease)_this.releaseLock(description);resolve(value)};if(result!==null&&typeof result==='object'&&'then'in result)return result.then(finish);finish(description)});return function wrappedCallbackFunction(_x){return _ref.apply(this,arguments)}}();if(_this.locks.hasOwnProperty(description))_this.locks[description].push(wrappedCallbackFunction);else{_this.locks[description]=[];wrappedCallbackFunction(description)}})})()}/**
     * Calling this method  causes the given critical area to be finished and
     * all functions given to "acquireLock()" will be executed in right order.
     * @param description - A short string describing the critical areas
     * properties.
     * @returns Returns the return (maybe promise resolved) value of the
     * callback given to the "acquireLock" method.
     */releaseLock(description){var _this2=this;return(0,_asyncToGenerator3.default)(function*(){let result;if(_this2.locks.hasOwnProperty(description))if(_this2.locks[description].length)result=yield _this2.locks[description].shift()(description);else delete _this2.locks[description];return result})()}/**
     * Generate a semaphore object with given number of resources.
     * @param numberOfResources - Number of allowed concurrent resource uses.
     * @returns The requested semaphore instance.
     */static getSemaphore(numberOfResources=2){/**
         * Represents the semaphore state.
         * @property queue - List of waiting resource requests.
         * @property numberOfFreeResources - Number free allowed concurrent
         * resource uses.
         * @property numberOfResources - Number of allowed concurrent resource
         * uses.
         */return new class{constructor(){this.queue=[];this.numberOfResources=numberOfResources;this.numberOfFreeResources=numberOfResources}/**
             * Acquires a new resource and runs given callback if available.
             * @returns A promise which will be resolved if requested a
             * resource is available.
             */acquire(){var _this3=this;return new _promise2.default(function(resolve){if(_this3.numberOfFreeResources<=0)_this3.queue.push(resolve);else{_this3.numberOfFreeResources-=1;resolve(_this3.numberOfFreeResources)}})}/**
             * Releases a resource and runs a waiting resolver if there exists
             * some.
             * @returns Nothing.
             */release(){if(this.queue.length===0)this.numberOfFreeResources+=1;else this.queue.pop()(this.numberOfFreeResources)}}}// / endregion
// / region boolean
/**
     * Determines whether its argument represents a JavaScript number.
     * @param object - Object to analyze.
     * @returns A boolean value indicating whether given object is numeric
     * like.
     */static isNumeric(object){const type=Tools.determineType(object);/*
            NOTE: "parseFloat" "NaNs" numeric-cast false positives ("") but
            misinterprets leading-number strings, particularly hex literals
            ("0x...") subtraction forces infinities to NaN.
        */return['number','string'].includes(type)&&!isNaN(object-parseFloat(object))}/**
     * Determine whether the argument is a window.
     * @param object - Object to check for.
     * @returns Boolean value indicating the result.
     */static isWindow(object){return![undefined,null].includes(object)&&typeof object==='object'&&'window'in object&&object===object.window}/**
     * Checks if given object is similar to an array and can be handled like an
     * array.
     * @param object - Object to check behavior for.
     * @returns A boolean value indicating whether given object is array like.
     */static isArrayLike(object){let length;try{length=Boolean(object)&&'length'in object&&object.length}catch(error){return false}const type=Tools.determineType(object);if(type==='function'||Tools.isWindow(object))return false;if(type==='array'||length===0)return true;if(typeof length==='number'&&length>0)try{/* eslint-disable no-unused-expressions */object[length-1];/* eslint-enable no-unused-expressions */return true}catch(error){}return false}/**
     * Checks whether one of the given pattern matches given string.
     * @param target - Target to check in pattern for.
     * @param pattern - List of pattern to check for.
     * @returns Value "true" if given object is matches by at leas one of the
     * given pattern and "false" otherwise.
     */static isAnyMatching(target,pattern){for(const currentPattern of pattern)if(typeof currentPattern==='string'){if(currentPattern===target)return true}else if(currentPattern.test(target))return true;return false}/**
     * Checks whether given object is a plain native object.
     * @param object - Object to check.
     * @returns Value "true" if given object is a plain javaScript object and
     * "false" otherwise.
     */static isPlainObject(object){return typeof object==='object'&&object!==null&&Tools.plainObjectPrototypes.includes((0,_getPrototypeOf2.default)(object))}/**
     * Checks whether given object is a function.
     * @param object - Object to check.
     * @returns Value "true" if given object is a function and "false"
     * otherwise.
     */static isFunction(object){return Boolean(object)&&{}.toString.call(object)==='[object Function]'}// / endregion
// / region language fixes
/**
     * This method fixes an ugly javaScript bug. If you add a mouseout event
     * listener to a dom node the given handler will be called each time any
     * dom node inside the observed dom node triggers a mouseout event. This
     * methods guarantees that the given event handler is only called if the
     * observed dom node was leaved.
     * @param eventHandler - The mouse out event handler.
     * @returns Returns the given function wrapped by the workaround logic.
     */static mouseOutEventHandlerFix(eventHandler){var _this4=this;return function(event,...additionalParameter){let relatedTarget=event.toElement;if('relatedTarget'in event)relatedTarget=event.relatedTarget;while(relatedTarget&&relatedTarget.tagName!=='BODY'){if(relatedTarget===_this4)return;relatedTarget=relatedTarget.parentNode}return eventHandler.call(_this4,...additionalParameter)}}// / endregion
// / region logging
/**
     * Shows the given object's representation in the browsers console if
     * possible or in a standalone alert-window as fallback.
     * @param object - Any object to print.
     * @param force - If set to "true" given input will be shown independently
     * from current logging configuration or interpreter's console
     * implementation.
     * @param avoidAnnotation - If set to "true" given input has no module or
     * log level specific annotations.
     * @param level - Description of log messages importance.
     * @param additionalArguments - Additional arguments are used for string
     * formating.
     * @returns Returns the current instance.
     */log(object,force=false,avoidAnnotation=false,level='info',...additionalArguments){if(this._options.logging||force||['error','critical'].includes(level)){let message;if(avoidAnnotation)message=object;else if(typeof object==='string'){additionalArguments.unshift(object);message=`${this.constructor.name} (${level}): `+this.constructor.stringFormat(...additionalArguments)}else if(this.constructor.isNumeric(object)||typeof object==='boolean')message=`${this.constructor.name} (${level}): `+object.toString();else{this.log(',--------------------------------------------,');this.log(object,force,true);this.log(`'--------------------------------------------'`)}if(message)if(!('console'in $.global&&level in $.global.console)||$.global.console[level]===this.constructor.noop){if('alert'in $.global)$.global.alert(message)}else $.global.console[level](message)}return this}/**
     * Wrapper method for the native console method usually provided by
     * interpreter.
     * @param object - Any object to print.
     * @param additionalArguments - Additional arguments are used for string
     * formating.
     * @returns Returns the current instance.
     */info(object,...additionalArguments){return this.log(object,false,false,'info',...additionalArguments)}/**
     * Wrapper method for the native console method usually provided by
     * interpreter.
     * @param object - Any object to print.
     * @param additionalArguments - Additional arguments are used for string
     * formating.
     * @returns Returns the current instance.
     */debug(object,...additionalArguments){return this.log(object,false,false,'debug',...additionalArguments)}/**
     * Wrapper method for the native console method usually provided by
     * interpreter.
     * @param object - Any object to print.
     * @param additionalArguments - Additional arguments are used for string
     * formating.
     * @returns Returns the current instance.
     */error(object,...additionalArguments){return this.log(object,true,false,'error',...additionalArguments)}/**
     * Wrapper method for the native console method usually provided by
     * interpreter.
     * @param object - Any object to print.
     * @param additionalArguments - Additional arguments are used for string
     * formating.
     * @returns Returns the current instance.
     */critical(object,...additionalArguments){return this.log(object,true,false,'warn',...additionalArguments)}/**
     * Wrapper method for the native console method usually provided by
     * interpreter.
     * @param object - Any object to print.
     * @param additionalArguments - Additional arguments are used for string
     * formating.
     * @returns Returns the current instance.
     */warn(object,...additionalArguments){return this.log(object,false,false,'warn',...additionalArguments)}/**
     * Dumps a given object in a human readable format.
     * @param object - Any object to show.
     * @param level - Number of levels to dig into given object recursively.
     * @param currentLevel - Maximal number of recursive function calls to
     * represent given object.
     * @returns Returns the serialized version of given object.
     */static show(object,level=3,currentLevel=0){let output='';if(Tools.determineType(object)==='object'){for(const key in object)if(object.hasOwnProperty(key)){output+=`${key.toString()}: `;if(currentLevel<=level)output+=Tools.show(object[key],level,currentLevel+1);else output+=`${object[key]}`;output+='\n'}return output.trim()}output=`${object}`.trim();return`${output} (Type: "${Tools.determineType(object)}")`}// / endregion
// / region dom node
/**
     * Normalizes class name order of current dom node.
     * @returns Current instance.
     */get normalizedClassNames(){// IgnoreTypeCheck
this.$domNode.find('*').addBack().each(function(){const $thisDomNode=$(this);if($thisDomNode.attr('class')){const sortedClassNames=$thisDomNode.attr('class').split(' ').sort()||[];$thisDomNode.attr('class','');for(const className of sortedClassNames)$thisDomNode.addClass(className)}else if($thisDomNode.is('[class]'))$thisDomNode.removeAttr('class')});return this}/**
     * Normalizes style attributes order of current dom node.
     * @returns Returns current instance.
     */get normalizedStyles(){const self=this;// IgnoreTypeCheck
this.$domNode.find('*').addBack().each(function(){const $thisDomNode=$(this);let serializedStyles=$thisDomNode.attr('style');if(serializedStyles){const sortedStyles=self.constructor.stringCompressStyleValue(serializedStyles).split(';').sort()||[];$thisDomNode.attr('style','');for(const style of sortedStyles)$thisDomNode.css(...style.trim().split(':'));$thisDomNode.attr('style',self.constructor.stringCompressStyleValue($thisDomNode.attr('style')))}else if($thisDomNode.is('[style]'))$thisDomNode.removeAttr('style')});return this}/**
     * Retrieves a mapping of computed style attributes to their corresponding
     * values.
     * @returns The computed style mapping.
     */get style(){const result={};if('window'in $.global&&$.global.window.getComputedStyle){const styleProperties=$.global.window.getComputedStyle(this.$domNode[0],null);if(styleProperties){if('length'in styleProperties)for(let index=0;index<styleProperties.length;index+=1)result[this.constructor.stringDelimitedToCamelCase(styleProperties[index])]=styleProperties.getPropertyValue(styleProperties[index]);else for(const propertyName in styleProperties)if(styleProperties.hasOwnProperty(propertyName))result[this.constructor.stringDelimitedToCamelCase(propertyName)]=propertyName in styleProperties&&styleProperties[propertyName]||styleProperties.getPropertyValue(propertyName);return result}}let styleProperties=this.$domNode[0].currentStyle;if(styleProperties){for(const propertyName in styleProperties)if(styleProperties.hasOwnProperty(propertyName))result[propertyName]=styleProperties[propertyName];return result}styleProperties=this.$domNode[0].style;if(styleProperties)for(const propertyName in styleProperties)if(typeof styleProperties[propertyName]!=='function')result[propertyName]=styleProperties[propertyName];return result}/**
     * Get text content of current element without it children's text contents.
     * @returns The text string.
     */get text(){return this.$domNode.clone().children().remove().end().text()}/**
     * Checks whether given html or text strings are equal.
     * @param first - First html, selector to dom node or text to compare.
     * @param second - Second html, selector to dom node  or text to compare.
     * @param forceHTMLString - Indicates whether given contents are
     * interpreted as html string (otherwise an automatic detection will be
     * triggered).
     * @returns Returns true if both dom representations are equivalent.
     */static isEquivalentDOM(first,second,forceHTMLString=false){if(first===second)return true;if(first&&second){const detemermineHTMLPattern=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;const inputs={first,second};const $domNodes={first:$('<dummy>'),second:$('<dummy>')/*
                NOTE: Assume that strings that start "<" and end with ">" are
                markup and skip the more expensive regular expression check.
            */};for(const type of['first','second'])if(typeof inputs[type]==='string'&&(forceHTMLString||inputs[type].startsWith('<')&&inputs[type].endsWith('>')&&inputs[type].length>=3||detemermineHTMLPattern.test(inputs[type])))$domNodes[type]=$(`<div>${inputs[type]}</div>`);else try{let $selectedDomNode=$(inputs[type]);if($selectedDomNode.length)$domNodes[type]=$('<div>').append($selectedDomNode.clone());else return false}catch(error){return false}if($domNodes.first.length&&$domNodes.first.length===$domNodes.second.length){$domNodes.first=$domNodes.first.Tools('normalizedClassNames').$domNode.Tools('normalizedStyles').$domNode;$domNodes.second=$domNodes.second.Tools('normalizedClassNames').$domNode.Tools('normalizedStyles').$domNode;let index=0;for(const domNode of $domNodes.first)if(!domNode.isEqualNode($domNodes.second[index]))return false;return true}}return false}/**
     * Determines where current dom node is relative to current view port
     * position.
     * @param delta - Allows deltas for "top", "left", "bottom" and "right" for
     * determining positions.
     * @returns Returns one of "above", "left", "below", "right" or "in".
     */getPositionRelativeToViewport(delta={}){delta=this.constructor.extendObject({top:0,left:0,bottom:0,right:0},delta);if('window'in $.global&&this.$domNode&&this.$domNode.length&&this.$domNode[0]){const $window=$($.global.window);const rectangle=this.$domNode[0].getBoundingClientRect();if(rectangle.top+delta.top<0)return'above';if(rectangle.left+delta.left<0)return'left';if($window.height()<rectangle.bottom+delta.bottom)return'below';if($window.width()<rectangle.right+delta.right)return'right'}return'in'}/**
     * Generates a directive name corresponding selector string.
     * @param directiveName - The directive name.
     * @returns Returns generated selector.
     */static generateDirectiveSelector(directiveName){const delimitedName=Tools.stringCamelCaseToDelimited(directiveName);return`${delimitedName}, .${delimitedName}, [${delimitedName}], `+`[data-${delimitedName}], [x-${delimitedName}]`+(delimitedName.includes('-')?`, [${delimitedName.replace(/-/g,'\\:')}], `+`[${delimitedName.replace(/-/g,'_')}]`:'')}/**
     * Removes a directive name corresponding class or attribute.
     * @param directiveName - The directive name.
     * @returns Returns current dom node.
     */removeDirective(directiveName){const delimitedName=this.constructor.stringCamelCaseToDelimited(directiveName);return this.$domNode.removeClass(delimitedName).removeAttr(delimitedName).removeAttr(`data-${delimitedName}`).removeAttr(`x-${delimitedName}`).removeAttr(delimitedName.replace('-',':')).removeAttr(delimitedName.replace('-','_'))}/**
     * Determines a normalized camel case directive name representation.
     * @param directiveName - The directive name.
     * @returns Returns the corresponding name.
     */static getNormalizedDirectiveName(directiveName){for(const delimiter of['-',':','_']){let prefixFound=false;for(const prefix of[`data${delimiter}`,`x${delimiter}`])if(directiveName.startsWith(prefix)){directiveName=directiveName.substring(prefix.length);prefixFound=true;break}if(prefixFound)break}for(const delimiter of['-',':','_'])directiveName=Tools.stringDelimitedToCamelCase(directiveName,delimiter);return directiveName}/**
     * Determines a directive attribute value.
     * @param directiveName - The directive name.
     * @returns Returns the corresponding attribute value or "null" if no
     * attribute value exists.
     */getDirectiveValue(directiveName){const delimitedName=this.constructor.stringCamelCaseToDelimited(directiveName);for(const attributeName of[delimitedName,`data-${delimitedName}`,`x-${delimitedName}`,delimitedName.replace('-','\\:')]){const value=this.$domNode.attr(attributeName);if(value!==undefined)return value}return null}/**
     * Removes a selector prefix from a given selector. This methods searches
     * in the options object for a given "domNodeSelectorPrefix".
     * @param domNodeSelector - The dom node selector to slice.
     * @returns Returns the sliced selector.
     */sliceDomNodeSelectorPrefix(domNodeSelector){if('domNodeSelectorPrefix'in this._options&&domNodeSelector.startsWith(this._options.domNodeSelectorPrefix))return domNodeSelector.substring(this._options.domNodeSelectorPrefix.length).trim();return domNodeSelector}/**
     * Determines the dom node name of a given dom node string.
     * @param domNodeSelector - A given to dom node selector to determine its
     * name.
     * @returns Returns The dom node name.
     * @example
     * // returns 'div'
     * $.Tools.getDomNodeName('&lt;div&gt;')
     * @example
     * // returns 'div'
     * $.Tools.getDomNodeName('&lt;div&gt;&lt;/div&gt;')
     * @example
     * // returns 'br'
     * $.Tools.getDomNodeName('&lt;br/&gt;')
     */static getDomNodeName(domNodeSelector){const match=domNodeSelector.match(new RegExp('^<?([a-zA-Z]+).*>?.*'));if(match)return match[1];return null}/* eslint-disable jsdoc/require-description-complete-sentence *//**
     * Converts an object of dom selectors to an array of $ wrapped dom nodes.
     * Note if selector description as one of "class" or "id" as suffix element
     * will be ignored.
     * @param domNodeSelectors - An object with dom node selectors.
     * @param wrapperDomNode - A dom node to be the parent or wrapper of all
     * retrieved dom nodes.
     * @returns Returns All $ wrapped dom nodes corresponding to given
     * selectors.
     */grabDomNode(domNodeSelectors,wrapperDomNode){/* eslint-enable jsdoc/require-description-complete-sentence */const domNodes={};if(domNodeSelectors)if(wrapperDomNode){const $wrapperDomNode=$(wrapperDomNode);for(const name in domNodeSelectors)if(domNodeSelectors.hasOwnProperty(name))domNodes[name]=$wrapperDomNode.find(domNodeSelectors[name])}else for(const name in domNodeSelectors)if(domNodeSelectors.hasOwnProperty(name)){const match=domNodeSelectors[name].match(', *');if(match)for(const selectorPart of domNodeSelectors[name].split(match[0]))domNodeSelectors[name]+=', '+this.normalizeDomNodeSelector(selectorPart);domNodes[name]=$(this.normalizeDomNodeSelector(domNodeSelectors[name]))}if(this._options.domNodeSelectorPrefix)domNodes.parent=$(this._options.domNodeSelectorPrefix);if('window'in $.global)domNodes.window=$($.global.window);if('document'in $.global)domNodes.document=$($.global.document);return domNodes}// / endregion
// / region scope
/**
     * Overwrites all inherited variables from parent scope with "undefined".
     * @param scope - A scope where inherited names will be removed.
     * @param prefixesToIgnore - Name prefixes to ignore during deleting names
     * in given scope.
     * @returns The isolated scope.
     */static isolateScope(scope,prefixesToIgnore=[]){for(const name in scope)if(!(prefixesToIgnore.includes(name.charAt(0))||['this','constructor'].includes(name)||scope.hasOwnProperty(name)))/*
                    NOTE: Delete ("delete $scope[name]") doesn't destroy the
                    automatic lookup to parent scope.
                */scope[name]=undefined;return scope}/**
     * Generates a unique name in given scope (useful for jsonp requests).
     * @param prefix - A prefix which will be prepended to unique name.
     * @param suffix - A suffix which will be prepended to unique name.
     * @param scope - A scope where the name should be unique.
     * @param initialUniqueName - An initial scope name to use if not exists.
     * @returns The function name.
     */static determineUniqueScopeName(prefix='callback',suffix='',scope=$.global,initialUniqueName=''){if(initialUniqueName.length&&!(initialUniqueName in scope))return initialUniqueName;let uniqueName=prefix+suffix;while(true){uniqueName=prefix+parseInt(Math.random()*Math.pow(10,10),10)+suffix;if(!(uniqueName in scope))break}return uniqueName}// / endregion
// / region function
/**
     * Determines all parameter names from given callable (function or class,
     * ...).
     * @param callable - Function or function code to inspect.
     * @returns List of parameter names.
     */static getParameterNames(callable){const functionCode=(typeof callable==='string'?callable:callable.toString()).replace(// Strip comments.
/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,'');if(functionCode.startsWith('class'))return Tools.getParameterNames('function '+functionCode.replace(/.*(constructor\([^)]+\))/m,'$1'));// Try classic function declaration.
let parameter=functionCode.match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m);if(parameter===null)// Try arrow function declaration.
parameter=functionCode.match(/^[^\(]*\(\s*([^\)]*)\) *=>.*/m);if(parameter===null)// Try one argument and without brackets arrow function declaration.
parameter=functionCode.match(/([^= ]+) *=>.*/m);const names=[];if(parameter&&parameter.length>1&&parameter[1].trim().length){for(const name of parameter[1].split(','))// Remove default parameter values.
names.push(name.replace(/=.+$/g,'').trim());return names}return names}/**
     * Implements the identity function.
     * @param value - A value to return.
     * @returns Returns the given value.
     */static identity(value){return value}/**
     * Inverted filter helper to inverse each given filter.
     * @param filter - A function that filters an array.
     * @returns The inverted filter.
     */static invertArrayFilter(filter){return function(data,...additionalParameter){if(data){const filteredData=filter.call(this,data,...additionalParameter);let result=[];/* eslint-disable curly */if(filteredData.length){for(const date of data)if(!filteredData.includes(date))result.push(date)}else/* eslint-enable curly */result=data;return result}return data}}/**
     * Triggers given callback after given duration. Supports unlimited
     * duration length and returns a promise which will be resolved after given
     * duration has been passed.
     * @param parameter - Observes the first three existing parameter. If one
     * is a number it will be interpret as delay in milliseconds until given
     * callback will be triggered. If one is of type function it will be used
     * as callback and if one is of type boolean it will indicate if returning
     * promise should be rejected or resolved if given internally created
     * timeout should be canceled. Additional parameter will be forwarded to
     * given callback.
     * @returns A promise resolving after given delay or being rejected if
     * value "true" is within one of the first three parameter. The promise
     * holds a boolean indicating whether timeout has been canceled or
     * resolved.
     */static timeout(...parameter){let callback=Tools.noop;let delayInMilliseconds=0;let throwOnTimeoutClear=false;for(const value of parameter)if(typeof value==='number'&&!(0,_isNan2.default)(value))delayInMilliseconds=value;else if(typeof value==='boolean')throwOnTimeoutClear=value;else if(Tools.isFunction(value))callback=value;let rejectCallback;let resolveCallback;const result=new _promise2.default(function(resolve,reject){rejectCallback=reject;resolveCallback=resolve});const wrappedCallback=function wrappedCallback(){callback.call(result,...parameter);resolveCallback(false)};const maximumTimeoutDelayInMilliseconds=2147483647;if(delayInMilliseconds<=maximumTimeoutDelayInMilliseconds)// IgnoreTypeCheck
result.timeoutID=setTimeout(wrappedCallback,delayInMilliseconds);else{/*
                Determine the number of times we need to delay by maximum
                possible timeout duration.
            */let numberOfRemainingTimeouts=Math.floor(delayInMilliseconds/maximumTimeoutDelayInMilliseconds);const finalTimeoutDuration=delayInMilliseconds%maximumTimeoutDelayInMilliseconds;const delay=function delay(){if(numberOfRemainingTimeouts>0){numberOfRemainingTimeouts-=1;// IgnoreTypeCheck
result.timeoutID=setTimeout(delay,maximumTimeoutDelayInMilliseconds)}else// IgnoreTypeCheck
result.timeoutID=setTimeout(wrappedCallback,finalTimeoutDuration)};delay()}// IgnoreTypeCheck
result.clear=function(){if(result.timeoutID){clearTimeout(result.timeoutID);(throwOnTimeoutClear?rejectCallback:resolveCallback)(true)}};return result}// / endregion
// / region event
/**
     * Prevents event functions from triggering to often by defining a minimal
     * span between each function call. Additional arguments given to this
     * function will be forwarded to given event function call. The function
     * wrapper returns null if current function will be omitted due to
     * debounceing.
     * @param eventFunction - The function to call debounced.
     * @param thresholdInMilliseconds - The minimum time span between each
     * function call.
     * @param additionalArguments - Additional arguments to forward to given
     * function.
     * @returns Returns the wrapped method.
     */static debounce(eventFunction,thresholdInMilliseconds=600,...additionalArguments){let lock=false;let waitingCallArguments=null;let timer=null;return function(...parameter){parameter=parameter.concat(additionalArguments||[]);if(lock)waitingCallArguments=parameter;else{lock=true;eventFunction(...parameter);timer=Tools.timeout(thresholdInMilliseconds,function(){lock=false;if(waitingCallArguments){eventFunction(...waitingCallArguments);waitingCallArguments=null}})}return timer}}/**
     * Searches for internal event handler methods and runs them by default. In
     * addition this method searches for a given event method by the options
     * object. Additional arguments are forwarded to respective event
     * functions.
     * @param eventName - An event name.
     * @param callOnlyOptionsMethod - Prevents from trying to call an internal
     * event handler.
     * @param scope - The scope from where the given event handler should be
     * called.
     * @param additionalArguments - Additional arguments to forward to
     * corresponding event handlers.
     * @returns - Returns "true" if an options event handler was called and
     * "false" otherwise.
     */fireEvent(eventName,callOnlyOptionsMethod=false,scope=this,...additionalArguments){const eventHandlerName=`on${this.constructor.stringCapitalize(eventName)}`;if(!callOnlyOptionsMethod)if(eventHandlerName in scope)scope[eventHandlerName](...additionalArguments);else if(`_${eventHandlerName}`in scope)scope[`_${eventHandlerName}`](...additionalArguments);if(scope._options&&eventHandlerName in scope._options&&scope._options[eventHandlerName]!==this.constructor.noop)return scope._options[eventHandlerName].call(this,...additionalArguments);return true}/* eslint-disable jsdoc/require-description-complete-sentence *//**
     * A wrapper method for "$.on()". It sets current plugin name as event
     * scope if no scope is given. Given arguments are modified and passed
     * through "$.on()".
     * @param parameter - Parameter to forward.
     * @returns Returns $'s grabbed dom node.
     */on(...parameter){/* eslint-enable jsdoc/require-description-complete-sentence */return this._bindEventHelper(parameter,false)}/* eslint-disable jsdoc/require-description-complete-sentence *//**
     * A wrapper method fo "$.off()". It sets current plugin name as event
     * scope if no scope is given. Given arguments are modified and passed
     * through "$.off()".
     * @param parameter - Parameter to forward.
     * @returns Returns $'s grabbed dom node.
     */off(...parameter){/* eslint-enable jsdoc/require-description-complete-sentence */return this._bindEventHelper(parameter,true,'off')}// / endregion
// / region object
/**
     * Adds dynamic getter and setter to any given data structure such as maps.
     * @param object - Object to proxy.
     * @param getterWrapper - Function to wrap each property get.
     * @param setterWrapper - Function to wrap each property set.
     * @param methodNames - Method names to perform actions on the given
     * object.
     * @param deep - Indicates to perform a deep wrapping of specified types.
     * @param typesToExtend - Types which should be extended (Checks are
     * performed via "value instanceof type".).
     * @returns Returns given object wrapped with a dynamic getter proxy.
     */static addDynamicGetterAndSetter(object,getterWrapper=null,setterWrapper=null,methodNames={},deep=true,typesToExtend=[Object]){if(deep&&typeof object==='object')if(Array.isArray(object)){let index=0;for(const value of object){object[index]=Tools.addDynamicGetterAndSetter(value,getterWrapper,setterWrapper,methodNames,deep);index+=1}}else if(Tools.determineType(object)==='map')for(const[key,value]of object)object.set(key,Tools.addDynamicGetterAndSetter(value,getterWrapper,setterWrapper,methodNames,deep));else if(Tools.determineType(object)==='set'){const cache=[];for(const value of object){object.delete(value);cache.push(Tools.addDynamicGetterAndSetter(value,getterWrapper,setterWrapper,methodNames,deep))}for(const value of cache)object.add(value)}else if(object!==null){for(const key in object)if(object.hasOwnProperty(key))object[key]=Tools.addDynamicGetterAndSetter(object[key],getterWrapper,setterWrapper,methodNames,deep)}if(getterWrapper||setterWrapper)for(const type of typesToExtend)if(typeof object==='object'&&object instanceof type&&object!==null){const defaultHandler=Tools.getProxyHandler(object,methodNames);const handler=Tools.getProxyHandler(object,methodNames);if(getterWrapper)handler.get=function(proxy,name){if(name==='__target__')return object;if(name==='__revoke__')return function(){revoke();return object};if(typeof object[name]==='function')return object[name];// IgnoreTypeCheck
return getterWrapper(defaultHandler.get(proxy,name),name,object)};if(setterWrapper)handler.set=function(proxy,name,value){return defaultHandler.set(proxy,name,setterWrapper(name,value,object))};const{proxy,revoke}=Proxy.revocable({},handler);return proxy}return object}/**
     * Converts given object into its serialized json representation by
     * replacing circular references with a given provided value.
     * @param object - Object to serialize.
     * @param determineCicularReferenceValue - Callback to create a fallback
     * value depending on given redundant value.
     * @param numberOfSpaces - Number of spaces to use for string formatting.
     * @returns The formatted json string.
     */static convertCircularObjectToJSON(object,determineCicularReferenceValue=function(){return'__circularReference__'},numberOfSpaces=0){const seenObjects=[];return(0,_stringify2.default)(object,function(key,value){if(typeof value==='object'&&value!==null){if(seenObjects.includes(value))return determineCicularReferenceValue(key,value,seenObjects);seenObjects.push(value);return value}return value},numberOfSpaces)}/**
     * Converts given map and all nested found maps objects to corresponding
     * object.
     * @param object - Map to convert to.
     * @param deep - Indicates whether to perform a recursive conversion.
     * @returns Given map as object.
     */static convertMapToPlainObject(object,deep=true){if(typeof object==='object'){if(Tools.determineType(object)==='map'){const newObject={};for(let[key,value]of object){if(deep)value=Tools.convertMapToPlainObject(value,deep);newObject[`${key}`]=value}return newObject}if(deep)if(Tools.isPlainObject(object)){for(const key in object)if(object.hasOwnProperty(key))object[key]=Tools.convertMapToPlainObject(object[key],deep)}else if(Array.isArray(object)){let index=0;for(const value of object){object[index]=Tools.convertMapToPlainObject(value,deep);index+=1}}else if(Tools.determineType(object)==='set'){const cache=[];for(const value of object){object.delete(value);cache.push(Tools.convertMapToPlainObject(value,deep))}for(const value of cache)object.add(value)}}return object}/**
     * Converts given plain object and all nested found objects to
     * corresponding map.
     * @param object - Object to convert to.
     * @param deep - Indicates whether to perform a recursive conversion.
     * @returns Given object as map.
     */static convertPlainObjectToMap(object,deep=true){if(typeof object==='object'){if(Tools.isPlainObject(object)){const newObject=new _map2.default;for(const key in object)if(object.hasOwnProperty(key)){if(deep)object[key]=Tools.convertPlainObjectToMap(object[key],deep);newObject.set(key,object[key])}return newObject}if(deep)if(Array.isArray(object)){let index=0;for(const value of object){object[index]=Tools.convertPlainObjectToMap(value,deep);index+=1}}else if(Tools.determineType(object)==='map')for(const[key,value]of object)object.set(key,Tools.convertPlainObjectToMap(value,deep));else if(Tools.determineType(object)==='set'){const cache=[];for(const value of object){object.delete(value);cache.push(Tools.convertPlainObjectToMap(value,deep))}for(const value of cache)object.add(value)}}return object}/**
     * Replaces given pattern in each value in given object recursively with
     * given string replacement.
     * @param object - Object to convert substrings in.
     * @param pattern - Regular expression to replace.
     * @param replacement - String to use as replacement for found patterns.
     * @returns Converted object with replaced patterns.
     */static convertSubstringInPlainObject(object,pattern,replacement){for(const key in object)if(object.hasOwnProperty(key))if(Tools.isPlainObject(object[key]))object[key]=Tools.convertSubstringInPlainObject(object[key],pattern,replacement);else if(typeof object[key]==='string')object[key]=object[key].replace(pattern,replacement);return object}/**
     * Copies given object (of any type) into optionally given destination.
     * @param source - Object to copy.
     * @param recursionLimit - Specifies how deep we should traverse into given
     * object recursively.
     * @param cyclic - Indicates whether known sub structures should be copied
     * or referenced (if "true" endless loops can occur of source has cyclic
     * structures).
     * @param destination - Target to copy source to.
     * @param stackSource - Internally used to avoid traversing loops.
     * @param stackDestination - Internally used to avoid traversing loops and
     * referencing them correctly.
     * @param recursionLevel - Internally used to track current recursion
     * level in given source data structure.
     * @returns Value "true" if both objects are equal and "false" otherwise.
     */static copyLimitedRecursively(source,recursionLimit=-1,cyclic=false,destination=null,stackSource=[],stackDestination=[],recursionLevel=0){if(typeof source==='object')if(destination){if(source===destination)throw new Error(`Can't copy because source and destination are `+`identical.`);if(recursionLimit!==-1&&recursionLimit<recursionLevel)return null;if(!cyclic&&![undefined,null].includes(source)){const index=stackSource.indexOf(source);if(index!==-1)return stackDestination[index];stackSource.push(source);stackDestination.push(destination)}const copyValue=function copyValue(value){const result=Tools.copyLimitedRecursively(value,recursionLimit,cyclic,null,stackSource,stackDestination,recursionLevel+1);if(!cyclic&&![undefined,null].includes(value)&&typeof value==='object'){stackSource.push(value);stackDestination.push(result)}return result};if(Array.isArray(source))for(const item of source)destination.push(copyValue(item));else if(Tools.determineType(source)==='map')for(const[key,value]of source)destination.set(key,copyValue(value));else if(Tools.determineType(source)==='set')for(const value of source)destination.add(copyValue(value));else if(source!==null)for(const key in source)if(source.hasOwnProperty(key))destination[key]=copyValue(source[key])}else if(source){if(Array.isArray(source))return Tools.copyLimitedRecursively(source,recursionLimit,cyclic,[],stackSource,stackDestination,recursionLevel);if(Tools.determineType(source)==='map')return Tools.copyLimitedRecursively(source,recursionLimit,cyclic,new _map2.default,stackSource,stackDestination,recursionLevel);if(Tools.determineType(source)==='set')return Tools.copyLimitedRecursively(source,recursionLimit,cyclic,new _set2.default,stackSource,stackDestination,recursionLevel);if(Tools.determineType(source)==='date')return new Date(source.getTime());if(Tools.determineType(source)==='regexp'){destination=new RegExp(source.source,source.toString().match(/[^\/]*$/)[0]);destination.lastIndex=source.lastIndex;return destination}return Tools.copyLimitedRecursively(source,recursionLimit,cyclic,{},stackSource,stackDestination,recursionLevel)}return destination||source}/**
     * Determine the internal JavaScript [[Class]] of an object.
     * @param object - Object to analyze.
     * @returns Name of determined class.
     */static determineType(object=undefined){if([undefined,null].includes(object))return`${object}`;if(['object','function'].includes(typeof object)&&'toString'in object){const stringRepresentation=Tools.classToTypeMapping.toString.call(object);if(Tools.classToTypeMapping.hasOwnProperty(stringRepresentation))return Tools.classToTypeMapping[stringRepresentation]}return typeof object}/**
     * Returns true if given items are equal for given property list. If
     * property list isn't set all properties will be checked. All keys which
     * starts with one of the exception prefixes will be omitted.
     * @param firstValue - First object to compare.
     * @param secondValue - Second object to compare.
     * @param properties - Property names to check. Check all if "null" is
     * selected (default).
     * @param deep - Recursion depth negative values means infinitely deep
     * (default).
     * @param exceptionPrefixes - Property prefixes which indicates properties
     * to ignore.
     * @param ignoreFunctions - Indicates whether functions have to be
     * identical to interpret is as equal. If set to "true" two functions will
     * be assumed to be equal (default).
     * @returns Value "true" if both objects are equal and "false" otherwise.
     */static equals(firstValue,secondValue,properties=null,deep=-1,exceptionPrefixes=[],ignoreFunctions=true){if(ignoreFunctions&&Tools.isFunction(firstValue)&&Tools.isFunction(secondValue)||firstValue===secondValue||Tools.numberIsNotANumber(firstValue)&&Tools.numberIsNotANumber(secondValue)||firstValue instanceof RegExp&&secondValue instanceof RegExp&&firstValue.toString()===secondValue.toString()||firstValue instanceof Date&&secondValue instanceof Date&&(isNaN(firstValue.getTime())&&isNaN(secondValue.getTime())||!isNaN(firstValue.getTime())&&!isNaN(secondValue.getTime())&&firstValue.getTime()===secondValue.getTime()))return true;if(Tools.isPlainObject(firstValue)&&Tools.isPlainObject(secondValue)&&!(firstValue instanceof RegExp||secondValue instanceof RegExp)||Array.isArray(firstValue)&&Array.isArray(secondValue)&&firstValue.length===secondValue.length||(Tools.determineType(firstValue)==='map'&&Tools.determineType(secondValue)==='map'||Tools.determineType(firstValue)==='set'&&Tools.determineType(secondValue)==='set')&&firstValue.size===secondValue.size){for(const[first,second]of[[firstValue,secondValue],[secondValue,firstValue]]){const firstIsArray=Array.isArray(first);if(firstIsArray&&(!Array.isArray(second)||first.length!==second.length))return false;const firstIsMap=Tools.determineType(first)==='map';if(firstIsMap&&(Tools.determineType(second)!=='map'||first.size!==second.size))return false;const firstIsSet=Tools.determineType(first)==='set';if(firstIsSet&&(Tools.determineType(second)!=='set'||first.size!==second.size))return false;let equal=true;if(firstIsArray){let index=0;for(const value of first){if(deep!==0&&!Tools.equals(value,second[index],properties,deep-1,exceptionPrefixes))equal=false;index+=1}}else if(firstIsMap)/* eslint-disable curly */for(const[key,value]of first){if(deep!==0&&!Tools.equals(value,second.get(key),properties,deep-1,exceptionPrefixes))equal=false}/* eslint-enable curly *//* eslint-disable curly */else if(firstIsSet){for(const value of first)if(deep!==0){equal=false;for(const secondValue of second)if(Tools.equals(value,secondValue,properties,deep-1,exceptionPrefixes)){equal=true;break}if(!equal)break}}else/* eslint-enable curly */for(const key in first)if(first.hasOwnProperty(key)){if(!equal||properties&&!properties.includes(key))break;let doBreak=false;for(const exceptionPrefix of exceptionPrefixes)if(key.toString().startsWith(exceptionPrefix)){doBreak=true;break}if(doBreak)break;if(deep!==0&&!Tools.equals(first[key],second[key],properties,deep-1,exceptionPrefixes))equal=false}if(!equal)return false}return true}return false}/**
     * Searches for nested mappings with given indicator key and resolves
     * marked values. Additionally all objects are wrapped with a proxy to
     * dynamically resolve nested properties.
     * @param object - Given mapping to resolve.
     * @param scope - Scope to to use evaluate again.
     * @param selfReferenceName - Name to use for reference to given object.
     * @param expressionIndicatorKey - Indicator property name to mark a value
     * to evaluate.
     * @param executionIndicatorKey - Indicator property name to mark a value
     * to evaluate.
     * @returns Evaluated given mapping.
     */static evaluateDynamicDataStructure(object,scope={},selfReferenceName='self',expressionIndicatorKey='__evaluate__',executionIndicatorKey='__execute__'){if(typeof object!=='object'||object===null)return object;if(!(selfReferenceName in scope))scope[selfReferenceName]=object;const evaluate=function evaluate(code,type=expressionIndicatorKey){code=type===expressionIndicatorKey?`return ${code}`:code;let compiledFunction;try{/* eslint-disable new-parens */// IgnoreTypeCheck
compiledFunction=new(Function.prototype.bind.call(/* eslint-enable new-parens */Function,null,...(0,_keys2.default)(scope),code))}catch(error){throw new Error(`Error during compiling code "${code}": "`+`${Tools.representObject(error)}".`)}try{return compiledFunction(...(0,_values2.default)(scope))}catch(error){throw new Error(`Error running code "${code}" in scope with variables "`+`${(0,_keys2.default)(scope).join('", "')}": "`+`${Tools.representObject(error)}".`)}};const addProxyRecursively=function addProxyRecursively(data){if(typeof data!=='object'||data===null)return data;for(const key in data)if(data.hasOwnProperty(key)&&key!=='__target__'&&typeof data[key]==='object'&&data[key]!==null){addProxyRecursively(data[key]);/*
                        NOTE: We only wrap needed objects for performance
                        reasons.
                    */if(data[key].hasOwnProperty(expressionIndicatorKey)||data[key].hasOwnProperty(executionIndicatorKey))data[key]=new Proxy(data[key],{get:function get(target,key){if(key==='__target__')return target;if(key==='hasOwnProperty')return target[key];/*
                                    NOTE: Very complicated stuff section, only
                                    change while doing a lot of tests.
                                */for(const type of[expressionIndicatorKey,executionIndicatorKey])if(key===type)return resolve(evaluate(target[key],type));let resolvedTarget=resolve(target);if(key==='toString'){const result=evaluate(resolvedTarget);return result[key].bind(result)}if(typeof key!=='string'){const result=evaluate(resolvedTarget);if(result[key]&&result[key].call)return result[key].bind(result);return result[key]}for(const type of[expressionIndicatorKey,executionIndicatorKey])if(target.hasOwnProperty(type))return evaluate(resolvedTarget,type)[key];return resolvedTarget[key];// End of complicated stuff.
},ownKeys:function ownKeys(target){for(const type of[expressionIndicatorKey,executionIndicatorKey])if(target.hasOwnProperty(type))return(0,_getOwnPropertyNames2.default)(resolve(evaluate(target[type],type)));return(0,_getOwnPropertyNames2.default)(target)}})}return data};const resolve=function resolve(data){if(typeof data==='object'&&data!==null){if(data.__target__){// NOTE: We have to skip "ownKeys" proxy trap here.
for(const type of[expressionIndicatorKey,executionIndicatorKey])if(data.hasOwnProperty(type))return data[type];data=data.__target__}for(const key in data)if(data.hasOwnProperty(key))if([expressionIndicatorKey,executionIndicatorKey].includes(key))return data[key];else data[key]=resolve(data[key])}return data};scope.resolve=resolve;const removeProxyRecursively=function removeProxyRecursively(data){if(typeof data==='object'&&data!==null)for(const key in data)if(data.hasOwnProperty(key)&&key!=='__target__'&&typeof data[key]==='object'&&data[key]!==null){const target=data[key].__target__;if(typeof target!=='undefined')data[key]=target;removeProxyRecursively(data[key])}return data};if(typeof object==='object'&&object!==null)if(object.hasOwnProperty(expressionIndicatorKey))return evaluate(object[expressionIndicatorKey]);else if(object.hasOwnProperty(executionIndicatorKey))return evaluate(object[executionIndicatorKey],executionIndicatorKey);return removeProxyRecursively(resolve(addProxyRecursively(object)))}/**
     * Extends given target object with given sources object. As target and
     * sources many expandable types are allowed but target and sources have to
     * to come from the same type.
     * @param targetOrDeepIndicator - Maybe the target or deep indicator.
     * @param targetAndOrSources - Target and at least one source object.
     * @returns Returns given target extended with all given sources.
     */static extendObject(targetOrDeepIndicator,...targetAndOrSources){let index=0;let deep=false;let target;if(typeof targetOrDeepIndicator==='boolean'){// Handle a deep copy situation and skip deep indicator and target.
deep=targetOrDeepIndicator;target=targetAndOrSources[index];index=1}else target=targetOrDeepIndicator;const mergeValue=function mergeValue(targetValue,value){if(value===targetValue)return targetValue;// Recurse if we're merging plain objects or maps.
if(deep&&value&&(Tools.isPlainObject(value)||Tools.determineType(value)==='map')){let clone;if(Tools.determineType(value)==='map')clone=targetValue&&Tools.determineType(targetValue)==='map'?targetValue:new _map2.default;else clone=targetValue&&Tools.isPlainObject(targetValue)?targetValue:{};return Tools.extendObject(deep,clone,value)}return value};while(index<targetAndOrSources.length){const source=targetAndOrSources[index];let targetType=typeof target;let sourceType=typeof source;if(Tools.determineType(target)==='map')targetType+=' Map';if(Tools.determineType(source)==='map')sourceType+=' Map';if(targetType===sourceType&&target!==source){if(Tools.determineType(target)==='map'&&Tools.determineType(source)==='map')for(const[key,value]of source)target.set(key,mergeValue(target.get(key),value));else if(target!==null&&!Array.isArray(target)&&typeof target==='object'&&source!==null&&!Array.isArray(source)&&typeof source==='object'){for(const key in source)if(source.hasOwnProperty(key))target[key]=mergeValue(target[key],source[key])}else target=source;}else target=source;index+=1}return target}/**
     * Iterates given objects own properties in sorted fashion. For
     * each key value pair given iterator function will be called with
     * value and key as arguments.
     * @param object - Object to iterate.
     * @param iterator - Function to execute for each key value pair. Value
     * will be the first and key will be the second argument.
     * @param context - The "this" binding for given iterator function.
     * @returns List of given sorted keys.
     */static forEachSorted(object,iterator,context){const keys=Tools.sort(object);for(const key of keys)if(typeof object==='object')if(['map','set'].includes(Tools.determineType(object)))// IgnoreTypeCheck
iterator.call(context,object.get(key),key);else if(Array.isArray(object)||object instanceof Object)iterator.call(context,object[key],key);return keys}/**
     * Generates a proxy handler which forwards all operations to given object
     * as there wouldn't be a proxy.
     * @param target - Object to proxy.
     * @param methodNames - Mapping of operand name to object specific method
     * name.
     * @returns Determined proxy handler.
     */static getProxyHandler(target,methodNames={}){methodNames=Tools.extendObject({delete:'[]',get:'[]',has:'[]',set:'[]'},methodNames);return{deleteProperty:function deleteProperty(proxy,key){if(methodNames.delete==='[]')delete target[key];else return target[methodNames.delete](key)},get:function get(proxy,key){if(methodNames.get==='[]')return target[key];return target[methodNames.get](key)},has:function has(proxy,key){if(methodNames.has==='[]')return key in target;return target[methodNames.has](key)},set:function set(proxy,key,value){if(methodNames.set==='[]')target[key]=value;else return target[methodNames.set](value)}}}/**
     * Modifies given target corresponding to given source and removes source
     * modification infos.
     * @param target - Object to modify.
     * @param source - Source object to load modifications from.
     * @param removeIndicatorKey - Indicator property name or value to mark a
     * value to remove from object or list.
     * @param prependIndicatorKey - Indicator property name to mark a value to
     * prepend to target list.
     * @param appendIndicatorKey - Indicator property name to mark a value to
     * append to target list.
     * @param positionPrefix - Indicates a prefix to use a value on given
     * position to add or remove.
     * @param positionSuffix - Indicates a suffix to use a value on given
     * position to add or remove.
     * @param parentSource - Source context to remove modification info from
     * (usually only needed internally).
     * @param parentKey - Source key in given source context to remove
     * modification info from (usually only needed internally).
     * @returns Given target modified with given source.
     */static modifyObject(target,source,removeIndicatorKey='__remove__',prependIndicatorKey='__prepend__',appendIndicatorKey='__append__',positionPrefix='__',positionSuffix='__',parentSource=null,parentKey=null){/* eslint-disable curly */if(Tools.determineType(source)==='map'&&Tools.determineType(target)==='map'){for(const[key,value]of source)if(target.has(key))Tools.modifyObject(target.get(key),value,removeIndicatorKey,prependIndicatorKey,appendIndicatorKey,positionPrefix,positionSuffix,source,key)}else if(/* eslint-enable curly */source!==null&&typeof source==='object'&&target!==null&&typeof target==='object')for(const key in source)if(source.hasOwnProperty(key))if([removeIndicatorKey,prependIndicatorKey,appendIndicatorKey].includes(key)){if(Array.isArray(target)){if(key===removeIndicatorKey){for(const valueToModify of[].concat(source[key]))if(typeof valueToModify==='string'&&valueToModify.startsWith(positionPrefix)&&valueToModify.endsWith(positionSuffix))target.splice(parseInt(valueToModify.substring(positionPrefix.length,valueToModify.length-positionSuffix.length)),1);else if(target.includes(valueToModify))target.splice(target.indexOf(valueToModify),1)}else if(key===prependIndicatorKey)target=[].concat(source[key]).concat(target);else target=target.concat(source[key]);}else if(key===removeIndicatorKey)for(const valueToModify of[].concat(source[key]))if(target.hasOwnProperty(valueToModify))delete target[valueToModify];delete source[key];if(parentSource&&parentKey)delete parentSource[parentKey]}else if(target!==null&&target.hasOwnProperty(key))// IgnoreTypeCheck
target[key]=Tools.modifyObject(// IgnoreTypeCheck
target[key],source[key],removeIndicatorKey,prependIndicatorKey,appendIndicatorKey,positionPrefix,positionSuffix,source,key);return target}/**
     * Represents given object as formatted string.
     * @param object - Object to Represents.
     * @param indention - String (usually whitespaces) to use as indention.
     * @param initialIndention - String (usually whitespaces) to use as
     * additional indention for the first object traversing level.
     * @returns Representation string.
     */static representObject(object,indention='    ',initialIndention=''){if(object===null)return'null';if(object===undefined)return'undefined';if(typeof object==='string')return`"${object.replace(/\n/g,`\n${initialIndention}`)}"`;if(Tools.isNumeric(object)||typeof object==='boolean')return`${object}`;if(Array.isArray(object)){let result='[';let firstSeen=false;for(const item of object){if(firstSeen)result+=',';result+=`\n${initialIndention}${indention}`+Tools.representObject(item,indention,`${initialIndention}${indention}`);firstSeen=true}if(firstSeen)result+=`\n${initialIndention}`;result+=']';return result}if(Tools.determineType(object)==='map'){let result='';let firstSeen=false;for(const[key,item]of object){if(firstSeen)result+=`,\n${initialIndention}${indention}`;result+=Tools.representObject(key,indention,`${initialIndention}${indention}`)+' -> '+Tools.representObject(item,indention,`${initialIndention}${indention}`);firstSeen=true}if(!firstSeen)result='EmptyMap';return result}if(Tools.determineType(object)==='set'){let result='{';let firstSeen=false;for(const item of object){if(firstSeen)result+=',';result+=`\n${initialIndention}${indention}`+Tools.representObject(item,indention,`${initialIndention}${indention}`);firstSeen=true}if(firstSeen)result+=`\n${initialIndention}}`;else result='EmptySet';return result}let result='{';const keys=(0,_getOwnPropertyNames2.default)(object).sort();let firstSeen=false;for(const key of keys){if(firstSeen)result+=',';result+=`\n${initialIndention}${indention}${key}: `+Tools.representObject(object[key],indention,`${initialIndention}${indention}`);firstSeen=true}if(firstSeen)result+=`\n${initialIndention}`;result+='}';return result}/**
     * Sort given objects keys.
     * @param object - Object which keys should be sorted.
     * @returns Sorted list of given keys.
     */static sort(object){const keys=[];if(Array.isArray(object))for(let index=0;index<object.length;index++)keys.push(index);else if(typeof object==='object')if(Tools.determineType(object)==='map')for(const keyValuePair of object)keys.push(keyValuePair[0]);else if(object!==null)for(const key in object)if(object.hasOwnProperty(key))keys.push(key);return keys.sort()}/**
     * Removes a proxy from given data structure recursively.
     * @param object - Object to proxy.
     * @param seenObjects - Tracks all already processed objects to avoid
     * endless loops (usually only needed for internal purpose).
     * @returns Returns given object unwrapped from a dynamic proxy.
     */static unwrapProxy(object,seenObjects=new _set2.default){if(object!==null&&typeof object==='object'){if(seenObjects.has(object))return object;try{if(object.__revoke__){object=object.__target__;object.__revoke__()}}catch(error){return object}finally{seenObjects.add(object)}if(Array.isArray(object)){let index=0;for(const value of object){object[index]=Tools.unwrapProxy(value,seenObjects);index+=1}}else if(Tools.determineType(object)==='map')for(const[key,value]of object)object.set(key,Tools.unwrapProxy(value,seenObjects));else if(Tools.determineType(object)==='set'){const cache=[];for(const value of object){object.delete(value);cache.push(Tools.unwrapProxy(value,seenObjects))}for(const value of cache)object.add(value)}else for(const key in object)if(object.hasOwnProperty(key))object[key]=Tools.unwrapProxy(object[key],seenObjects)}return object}// / endregion
// / region array
/**
     * Merge the contents of two arrays together into the first array.
     * @param target - Target array.
     * @param source - Source array.
     * @returns Target array with merged given source one.
     */static arrayMerge(target,source){if(!Array.isArray(source))source=Array.prototype.slice.call(source);for(const value of source)target.push(value);return target}/**
     * Converts given object into an array.
     * @param object - Target to convert.
     * @returns Generated array.
     */static arrayMake(object){const result=[];if(![null,undefined].includes(result))if(Tools.isArrayLike(Object(object)))Tools.arrayMerge(result,typeof object==='string'?[object]:object);else result.push(object);return result}/**
     * Makes all values in given iterable unique by removing duplicates (The
     * first occurrences will be left).
     * @param data - Array like object.
     * @returns Sliced version of given object.
     */static arrayUnique(data){const result=[];for(const value of Tools.arrayMake(data))if(!result.includes(value))result.push(value);return result}/**
     * Summarizes given property of given item list.
     * @param data - Array of objects with given property name.
     * @param propertyName - Property name to summarize.
     * @param defaultValue - Value to return if property values doesn't match.
     * @returns Summarized array.
     */static arrayAggregatePropertyIfEqual(data,propertyName,defaultValue=''){let result=defaultValue;if(data&&data.length&&data[0].hasOwnProperty(propertyName)){result=data[0][propertyName];for(const item of Tools.arrayMake(data))if(item[propertyName]!==result)return defaultValue}return result}/**
     * Deletes every item witch has only empty attributes for given property
     * names. If given property names are empty each attribute will be
     * considered. The empty string, "null" and "undefined" will be interpreted
     * as empty.
     * @param data - Data to filter.
     * @param propertyNames - Properties to consider.
     * @returns Given data without empty items.
     */static arrayDeleteEmptyItems(data,propertyNames=[]){if(!data)return data;const result=[];for(const item of Tools.arrayMake(data)){let empty=true;for(const propertyName in item)if(item.hasOwnProperty(propertyName))if(!['',null,undefined].includes(item[propertyName])&&(!propertyNames.length||Tools.arrayMake(propertyNames).includes(propertyName))){empty=false;break}if(!empty)result.push(item)}return result}/**
     * Extracts all properties from all items wich occur in given property
     * names.
     * @param data - Data where each item should be sliced.
     * @param propertyNames - Property names to extract.
     * @returns Data with sliced items.
     */static arrayExtract(data,propertyNames){const result=[];for(const item of Tools.arrayMake(data)){const newItem={};for(const propertyName of Tools.arrayMake(propertyNames))if(item.hasOwnProperty(propertyName))newItem[propertyName]=item[propertyName];result.push(newItem)}return result}/**
     * Extracts all values which matches given regular expression.
     * @param data - Data to filter.
     * @param regularExpression - Pattern to match for.
     * @returns Filtered data.
     */static arrayExtractIfMatches(data,regularExpression){if(!regularExpression)return Tools.arrayMake(data);const result=[];for(const value of Tools.arrayMake(data))if((typeof regularExpression==='string'?new RegExp(regularExpression):regularExpression).test(value))result.push(value);return result}/**
     * Filters given data if given property is set or not.
     * @param data - Data to filter.
     * @param propertyName - Property name to check for existence.
     * @returns Given data without the items which doesn't have specified
     * property.
     */static arrayExtractIfPropertyExists(data,propertyName){if(data&&propertyName){const result=[];for(const item of Tools.arrayMake(data)){let exists=false;for(const key in item)if(key===propertyName&&item.hasOwnProperty(key)&&![undefined,null].includes(item[key])){exists=true;break}if(exists)result.push(item)}return result}return data}/**
     * Extract given data where specified property value matches given
     * patterns.
     * @param data - Data to filter.
     * @param propertyPattern - Mapping of property names to pattern.
     * @returns Filtered data.
     */static arrayExtractIfPropertyMatches(data,propertyPattern){if(data&&propertyPattern){const result=[];for(const item of Tools.arrayMake(data)){let matches=true;for(const propertyName in propertyPattern)if(!(propertyPattern[propertyName]&&(typeof propertyPattern[propertyName]==='string'?new RegExp(propertyPattern[propertyName]):propertyPattern[propertyName]).test(item[propertyName]))){matches=false;break}if(matches)result.push(item)}return result}return data}/**
     * Determines all objects which exists in "first" and in "second".
     * Object key which will be compared are given by "keys". If an empty array
     * is given each key will be compared. If an object is given corresponding
     * initial data key will be mapped to referenced new data key.
     * @param first - Referenced data to check for.
     * @param second - Data to check for existence.
     * @param keys - Keys to define equality.
     * @param strict - The strict parameter indicates whether "null" and
     * "undefined" should be interpreted as equal (takes only effect if given
     * keys aren't empty).
     * @returns Data which does exit in given initial data.
     */static arrayIntersect(first,second,keys=[],strict=true){const containingData=[];second=Tools.arrayMake(second);const intersectItem=function intersectItem(firstItem,secondItem,firstKey,secondKey,keysAreAnArray,iterateGivenKeys){if(iterateGivenKeys){if(keysAreAnArray)firstKey=secondKey}else secondKey=firstKey;if(secondItem[secondKey]!==firstItem[firstKey]&&(strict||!([null,undefined].includes(secondItem[secondKey])&&[null,undefined].includes(firstItem[firstKey]))))return false};for(const firstItem of Tools.arrayMake(first))if(Tools.isPlainObject(firstItem))for(const secondItem of second){let exists=true;let iterateGivenKeys;const keysAreAnArray=Array.isArray(keys);if(Tools.isPlainObject(keys)||keysAreAnArray&&keys.length)iterateGivenKeys=true;else{iterateGivenKeys=false;keys=firstItem}if(Array.isArray(keys)){let index=0;for(const key of keys){if(intersectItem(firstItem,secondItem,index,key,keysAreAnArray,iterateGivenKeys)===false){exists=false;break}index+=1}}else for(const key in keys)if(keys.hasOwnProperty(key))if(intersectItem(firstItem,secondItem,key,keys[key],keysAreAnArray,iterateGivenKeys)===false){exists=false;break}if(exists){containingData.push(firstItem);break}}else if(second.includes(firstItem))containingData.push(firstItem);return containingData}/**
     * Creates a list of items within given range.
     * @param range - Array of lower and upper bounds. If only one value is
     * given lower bound will be assumed to be zero. Both integers have to be
     * positive and will be contained in the resulting array.
     * @param step - Space between two consecutive values.
     * @returns Produced array of integers.
     */static arrayMakeRange(range,step=1){let index;let higherBound;if(range.length===1){index=0;higherBound=parseInt(range[0],10)}else if(range.length===2){index=parseInt(range[0],10);higherBound=parseInt(range[1],10)}else return range;const result=[index];while(index<=higherBound-step){index+=step;result.push(index)}return result}/**
     * Sums up given property of given item list.
     * @param data - The objects with specified property to sum up.
     * @param propertyName - Property name to sum up its value.
     * @returns The aggregated value.
     */static arraySumUpProperty(data,propertyName){let result=0;if(Array.isArray(data)&&data.length)for(const item of data)if(item.hasOwnProperty(propertyName))result+=parseFloat(item[propertyName]||0);return result}/**
     * Adds an item to another item as array connection (many to one).
     * @param item - Item where the item should be appended to.
     * @param target - Target to add to given item.
     * @param name - Name of the target connection.
     * @param checkIfExists - Indicates if duplicates are allowed in resulting
     * list (will result in linear runtime instead of constant one).
     * @returns Item with the appended target.
     */static arrayAppendAdd(item,target,name,checkIfExists=true){if(item.hasOwnProperty(name)){if(!(checkIfExists&&item[name].includes(target)))item[name].push(target)}else item[name]=[target];return item}/**
     * Removes given target on given list.
     * @param list - Array to splice.
     * @param target - Target to remove from given list.
     * @param strict - Indicates whether to fire an exception if given target
     * doesn't exists given list.
     * @returns Item with the appended target.
     */static arrayRemove(list,target,strict=false){if(Array.isArray(list)){const index=list.indexOf(target);if(index===-1){if(strict)throw new Error(`Given target doesn't exists in given list.`)}else/* eslint-disable max-statements-per-line */list.splice(index,1);/* eslint-enable max-statements-per-line */}else if(strict)throw new Error(`Given target isn't an array.`);return list}/**
     * Sorts given object of dependencies in a topological order.
     * @param items - Items to sort.
     * @returns Sorted array of given items respecting their dependencies.
     */static arraySortTopological(items){const edges=[];for(const name in items)if(items.hasOwnProperty(name)){if(!Array.isArray(items[name]))items[name]=[items[name]];if(items[name].length>0)for(const dependencyName of Tools.arrayMake(items[name]))edges.push([name,dependencyName]);else edges.push([name])}const nodes=[];// Accumulate unique nodes into a large list.
for(const edge of edges)for(const node of edge)if(!nodes.includes(node))nodes.push(node);const sorted=[];// Define a visitor function that recursively traverses dependencies.
const visit=function visit(node,predecessors){// Check if a node is dependent of itself.
if(predecessors.length!==0&&predecessors.includes(node))throw new Error(`Cyclic dependency found. "${node}" is dependent of `+'itself.\n'+`Dependency chain: "${predecessors.join('" -> "')}" => "`+`${node}".`);let index=nodes.indexOf(node);// If the node still exists, traverse its dependencies.
if(index!==-1){let copy;// Mark the node to exclude it from future iterations.
nodes[index]=null;/*
                    Loop through all edges and follow dependencies of the
                    current node
                */for(const edge of edges)if(edge[0]===node){/*
                            Lazily create a copy of predecessors with the
                            current node concatenated onto it.
                        */copy=copy||predecessors.concat([node]);// Recurse to node dependencies.
visit(edge[1],copy)}sorted.push(node)}};for(let index=0;index<nodes.length;index++){const node=nodes[index];// Ignore nodes that have been excluded.
if(node){// Mark the node to exclude it from future iterations.
nodes[index]=null;/*
                    Loop through all edges and follow dependencies of the
                    current node.
                */for(const edge of edges)if(edge[0]===node)// Recurse to node dependencies.
visit(edge[1],[node]);sorted.push(node)}}return sorted}// / endregion
// / region string
// // region url handling
/**
     * Translates given string into the regular expression validated
     * representation.
     * @param value - String to convert.
     * @param excludeSymbols - Symbols not to escape.
     * @returns Converted string.
     */static stringEscapeRegularExpressions(value,excludeSymbols=[]){// NOTE: This is only for performance improvements.
if(value.length===1&&!Tools.specialRegexSequences.includes(value))return value;// The escape sequence must also be escaped; but at first.
if(!excludeSymbols.includes('\\'))value.replace(/\\/g,'\\\\');for(const replace of Tools.specialRegexSequences)if(!excludeSymbols.includes(replace))value=value.replace(new RegExp(`\\${replace}`,'g'),`\\${replace}`);return value}/**
     * Translates given name into a valid javaScript one.
     * @param name - Name to convert.
     * @param allowedSymbols - String of symbols which should be allowed within
     * a variable name (not the first character).
     * @returns Converted name is returned.
     */static stringConvertToValidVariableName(name,allowedSymbols='0-9a-zA-Z_$'){return name.toString().replace(/^[^a-zA-Z_$]+/,'').replace(new RegExp(`[^${allowedSymbols}]+([a-zA-Z0-9])`,'g'),function(fullMatch,firstLetter){return firstLetter.toUpperCase()})}/**
     * This method is intended for encoding *key* or *value* parts of query
     * component. We need a custom method because "encodeURIComponent()" is too
     * aggressive and encodes stuff that doesn't have to be encoded per
     * "http://tools.ietf.org/html/rfc3986:".
     * @param url - URL to encode.
     * @param encodeSpaces - Indicates whether given url should encode
     * whitespaces as "+" or "%20".
     * @returns Encoded given url.
     */static stringEncodeURIComponent(url,encodeSpaces){return encodeURIComponent(url).replace(/%40/gi,'@').replace(/%3A/gi,':').replace(/%24/g,'$').replace(/%2C/gi,',').replace(/%20/g,encodeSpaces?'%20':'+')}/**
     * Appends a path selector to the given path if there isn't one yet.
     * @param path - The path for appending a selector.
     * @param pathSeparator - The selector for appending to path.
     * @returns The appended path.
     */static stringAddSeparatorToPath(path,pathSeparator='/'){path=path.trim();if(path.substr(-1)!==pathSeparator&&path.length)return path+pathSeparator;return path}/**
     * Checks if given path has given path prefix.
     * @param prefix - Path prefix to search for.
     * @param path - Path to search in.
     * @param separator - Delimiter to use in path (default is the posix
     * conform slash).
     * @returns Value "true" if given prefix occur and "false" otherwise.
     */static stringHasPathPrefix(prefix='/admin',path='location'in $.global&&$.global.location.pathname||'',separator='/'){if(typeof prefix==='string'){if(!prefix.endsWith(separator))prefix+=separator;return path===prefix.substring(0,prefix.length-separator.length)||path.startsWith(prefix)}return false}/**
     * Extracts domain name from given url. If no explicit domain name given
     * current domain name will be assumed. If no parameter given current
     * domain name will be determined.
     * @param url - The url to extract domain from.
     * @param fallback - The fallback host name if no one exits in given url
     * (default is current hostname).
     * @returns Extracted domain.
     */static stringGetDomainName(url='location'in $.global&&$.global.location.href||'',fallback='location'in $.global&&$.global.location.hostname||''){const result=/^([a-z]*:?\/\/)?([^/]+?)(?::[0-9]+)?(?:\/.*|$)/i.exec(url);if(result&&result.length>2&&result[1]&&result[2])return result[2];return fallback}/**
     * Extracts port number from given url. If no explicit port number given
     * and no fallback is defined current port number will be assumed for local
     * links. For external links 80 will be assumed for http protocol or 443
     * for https.
     * @param url - The url to extract port from.
     * @param fallback - Fallback port number if no explicit one was found.
     * Default is derived from current protocol name.
     * @param parameter - Additional parameter for checking if given url is an
     * internal url. Given url and this parameter will be forwarded to the
     * "stringIsInternalURL()" method.
     * @returns Extracted port number.
     */static stringGetPortNumber(url='location'in $.global&&$.global.location.href||'',fallback=null,parameter=[]){const result=/^(?:[a-z]*:?\/\/[^/]+?)?(?:[^/]+?):([0-9]+)/i.exec(url);if(result&&result.length>1)return parseInt(result[1],10);if(fallback!==null)return fallback;if(Tools.stringIsInternalURL(url,...parameter)&&'location'in $.global&&$.global.location.port&&parseInt($.global.location.port,10))return parseInt($.global.location.port,10);return Tools.stringGetProtocolName(url)==='https'?443:80}/**
     * Extracts protocol name from given url. If no explicit url is given,
     * current protocol will be assumed. If no parameter given current protocol
     * number will be determined.
     * @param url - The url to extract protocol from.
     * @param fallback - Fallback port to use if no protocol exists in given
     * url (default is current protocol).
     * returns Extracted protocol.
     */static stringGetProtocolName(url='location'in $.global&&$.global.location.href||'',fallback='location'in $.global&&$.global.location.protocol.substring(0,$.global.location.protocol.length-1)||''){const result=/^([a-z]+):\/\//i.exec(url);if(result&&result.length>1&&result[1])return result[1];return fallback}/**
     * Read a page's GET URL variables and return them as an associative array
     * and preserves ordering.
     * @param keyToGet - If key given the corresponding value is returned and
     * full object otherwise.
     * @param givenInput - An alternative input to the url search parameter. If
     * "#" is given the complete current hash tag will be interpreted as url
     * and search parameter will be extracted from there. If "&" is given
     * classical search parameter and hash parameter will be taken in account.
     * If a search string is given this will be analyzed. The default is to
     * take given search part into account.
     * @param subDelimiter - Defines which sequence indicates the start of
     * parameter in a hash part of the url.
     * @param hashedPathIndicator - If defined and given hash starts with this
     * indicator given hash will be interpreted as path containing search and
     * hash parts.
     * @param givenSearch - Search part to take into account defaults to
     * current url search part.
     * @param givenHash - Hash part to take into account defaults to current
     * url hash part.
     * @returns Returns the current get array or requested value. If requested
     * key doesn't exist "undefined" is returned.
     */static stringGetURLVariable(keyToGet,givenInput,subDelimiter='$',hashedPathIndicator='!',givenSearch,givenHash='location'in $.global&&$.global.location.hash||''){// region set search and hash
let hash=givenHash?givenHash:'#';let search='';if(givenSearch)search=givenSearch;else if(hashedPathIndicator&&hash.startsWith(hashedPathIndicator)){const subHashStartIndex=hash.indexOf('#');let pathAndSearch;if(subHashStartIndex===-1){pathAndSearch=hash.substring(hashedPathIndicator.length);hash=''}else{pathAndSearch=hash.substring(hashedPathIndicator.length,subHashStartIndex);hash=hash.substring(subHashStartIndex)}const subSearchStartIndex=pathAndSearch.indexOf('?');if(subSearchStartIndex!==-1)search=pathAndSearch.substring(subSearchStartIndex)}else if('location'in $.global)search=$.global.location.search||'';let input=givenInput?givenInput:search;// endregion
// region determine data from search and hash if specified
const both=input==='&';if(both||input==='#'){let decodedHash='';try{decodedHash=decodeURIComponent(hash)}catch(error){}const subDelimiterIndex=decodedHash.indexOf(subDelimiter);if(subDelimiterIndex===-1)input='';else{input=decodedHash.substring(subDelimiterIndex);if(input.startsWith(subDelimiter))input=input.substring(subDelimiter.length)}}else if(input.startsWith('?'))input=input.substring('?'.length);let data=input?input.split('&'):[];search=search.substring('?'.length);if(both&&search)data=data.concat(search.split('&'));// endregion
// region construct data structure
const variables=[];for(let value of data){const keyValuePair=value.split('=');let key;try{key=decodeURIComponent(keyValuePair[0])}catch(error){key=''}try{value=decodeURIComponent(keyValuePair[1])}catch(error){value=''}variables.push(key);// IgnoreTypeCheck
variables[key]=value}// endregion
if(keyToGet)// IgnoreTypeCheck
return variables[keyToGet];return variables}/**
     * Checks if given url points to another domain than second given url. If
     * no second given url provided current url will be assumed.
     * @param firstURL - URL to check against second url.
     * @param secondURL - URL to check against first url.
     * @returns Returns "true" if given first url has same domain as given
     * second (or current).
     */static stringIsInternalURL(firstURL,secondURL='location'in $.global&&$.global.location.href||''){const explicitDomainName=Tools.stringGetDomainName(firstURL,false);const explicitProtocolName=Tools.stringGetProtocolName(firstURL,false);const explicitPortNumber=Tools.stringGetPortNumber(firstURL,false);return(!explicitDomainName||explicitDomainName===Tools.stringGetDomainName(secondURL))&&(!explicitProtocolName||explicitProtocolName===Tools.stringGetProtocolName(secondURL))&&(!explicitPortNumber||explicitPortNumber===Tools.stringGetPortNumber(secondURL))}/**
     * Normalized given website url.
     * @param url - Uniform resource locator to normalize.
     * @returns Normalized result.
     */static stringNormalizeURL(url){if(url){url=url.replace(/^:?\/+/,'').replace(/\/+$/,'').trim();if(url.startsWith('http'))return url;return`http://${url}`}return''}/**
     * Represents given website url.
     * @param url - Uniform resource locator to represent.
     * @returns Represented result.
     */static stringRepresentURL(url){if(typeof url==='string')return url.replace(/^(https?)?:?\/+/,'').replace(/\/+$/,'').trim();return''}// // endregion
/**
     * Compresses given style attribute value.
     * @param styleValue - Style value to compress.
     * @returns The compressed value.
     */static stringCompressStyleValue(styleValue){return styleValue.replace(/ *([:;]) */g,'$1').replace(/ +/g,' ').replace(/^;+/,'').replace(/;+$/,'').trim()}/* eslint-disable jsdoc/require-description-complete-sentence *//**
     * Converts a camel cased string to its delimited string version.
     * @param string - The string to format.
     * @param delimiter - Delimiter string
     * @param abbreviations - Collection of shortcut words to represent upper
     * cased.
     * @returns The formatted string.
     */static stringCamelCaseToDelimited(string,delimiter='-',abbreviations=null){/* eslint-enable jsdoc/require-description-complete-sentence */if(!abbreviations)abbreviations=Tools.abbreviations;const escapedDelimiter=Tools.stringGetRegularExpressionValidated(delimiter);if(abbreviations.length){let abbreviationPattern='';for(const abbreviation of abbreviations){if(abbreviationPattern)abbreviationPattern+='|';abbreviationPattern+=abbreviation.toUpperCase()}string=string.replace(new RegExp(`(${abbreviationPattern})(${abbreviationPattern})`,'g'),`$1${delimiter}$2`)}string=string.replace(new RegExp(`([^${escapedDelimiter}])([A-Z][a-z]+)`,'g'),`$1${delimiter}$2`);return string.replace(new RegExp('([a-z0-9])([A-Z])','g'),`$1${delimiter}$2`).toLowerCase()}/* eslint-disable jsdoc/require-description-complete-sentence *//**
     * Converts a string to its capitalize representation.
     * @param string - The string to format.
     * @returns The formatted string.
     */static stringCapitalize(string){/* eslint-enable jsdoc/require-description-complete-sentence */return string.charAt(0).toUpperCase()+string.substring(1)}/**
     * Converts a delimited string to its camel case representation.
     * @param string - The string to format.
     * @param delimiter - Delimiter string to use.
     * @param abbreviations - Collection of shortcut words to represent upper
     * cased.
     * @param preserveWrongFormattedAbbreviations - If set to "True" wrong
     * formatted camel case abbreviations will be ignored.
     * @param removeMultipleDelimiter - Indicates whether a series of delimiter
     * should be consolidated.
     * @returns The formatted string.
     */static stringDelimitedToCamelCase(string,delimiter='-',abbreviations=null,preserveWrongFormattedAbbreviations=false,removeMultipleDelimiter=false){let escapedDelimiter=Tools.stringGetRegularExpressionValidated(delimiter);if(!abbreviations)abbreviations=Tools.abbreviations;let abbreviationPattern;if(preserveWrongFormattedAbbreviations)abbreviationPattern=abbreviations.join('|');else{abbreviationPattern='';for(const abbreviation of abbreviations){if(abbreviationPattern)abbreviationPattern+='|';abbreviationPattern+=`${Tools.stringCapitalize(abbreviation)}|${abbreviation}`}}let stringStartsWithDelimiter=false;if(string.startsWith(delimiter)){string=string.substring(delimiter.length);stringStartsWithDelimiter=true}string=string.replace(new RegExp(`(${escapedDelimiter})(${abbreviationPattern})`+`(${escapedDelimiter}|$)`,'g'),function(fullMatch,before,abbreviation,after){return before+abbreviation.toUpperCase()+after});if(removeMultipleDelimiter)escapedDelimiter=`(?:${escapedDelimiter})+`;string=string.replace(new RegExp(`${escapedDelimiter}([a-zA-Z0-9])`,'g'),function(fullMatch,firstLetter){return firstLetter.toUpperCase()});if(stringStartsWithDelimiter)string=delimiter+string;return string}/**
     * Performs a string formation. Replaces every placeholder "{i}" with the
     * i'th argument.
     * @param string - The string to format.
     * @param additionalArguments - Additional arguments are interpreted as
     * replacements for string formating.
     * @returns The formatted string.
     */static stringFormat(string,...additionalArguments){additionalArguments.unshift(string);let index=0;for(const value of additionalArguments){string=string.replace(new RegExp(`\\{${index}\\}`,'gm'),`${value}`);index+=1}return string}/**
     * Validates the current string for using in a regular expression pattern.
     * Special regular expression chars will be escaped.
     * @param string - The string to format.
     * @returns The formatted string.
     */static stringGetRegularExpressionValidated(string){return string.replace(/([\\|.*$^+[\]()?\-{}])/g,'\\$1')}/**
     * Converts a string to its lower case representation.
     * @param string - The string to format.
     * @returns The formatted string.
     */static stringLowerCase(string){return string.charAt(0).toLowerCase()+string.substring(1)}/**
     * Finds the string match of given query in given target text by applying
     * given normalisation function to target and query.
     * @param target - Target to search in.
     * @param query - Search string to search for.
     * @param normalizer - Function to use as normalisation for queries and
     * search targets.
     */static stringFindNormalizedMatchRange(target,query,normalizer=function(value){return`${value}`.toLowerCase()}){query=normalizer(query);if(normalizer(target)&&query)for(let index=0;index<target.length;index+=1)if(normalizer(target.substring(index)).startsWith(query)){if(query.length===1)return[index,index+1];for(let subIndex=target.length;subIndex>index;subIndex-=1)if(!normalizer(target.substring(index,subIndex)).startsWith(query))return[index,subIndex+1]}return null}/**
     * Wraps given mark strings in given target with given marker.
     * @param target - String to search for marker.
     * @param words - String or array of strings to search in target for.
     * @param marker - HTML template string to mark.
     * @param normalizer - Pure normalisation function to use before searching
     * for matches.
     * @returns Processed result.
     */static stringMark(target,words,marker='<span class="tools-mark">{1}</span>',normalizer=function(value){return`${value}`.toLowerCase()}){if(target&&words&&words.length){target=target.trim();if(!Array.isArray(words))words=[words];let index=0;for(const word of words){words[index]=normalizer(word).trim();index+=1}let restTarget=target;let offset=0;while(true){let nearestRange;let currentRange;for(const word of words){currentRange=Tools.stringFindNormalizedMatchRange(restTarget,word,normalizer);if(currentRange&&(!nearestRange||currentRange[0]<nearestRange[0]))nearestRange=currentRange}if(nearestRange){target=target.substring(0,offset+nearestRange[0])+Tools.stringFormat(marker,target.substring(offset+nearestRange[0],offset+nearestRange[1]))+target.substring(offset+nearestRange[1]);offset+=nearestRange[1]+(marker.length-'{1}'.length);if(target.length<=offset)break;restTarget=target.substring(offset)}else break}}return target}/**
     * Implements the md5 hash algorithm.
     * @param value - Value to calculate md5 hash for.
     * @param onlyAscii - Set to true if given input has ascii characters only
     * to get more performance.
     * @returns Calculated md5 hash value.
     */static stringMD5(value,onlyAscii=false){const hexCharacters='0123456789abcdef'.split('');// region sub helper
/**
         * This function is much faster, so if possible we use it. Some IEs
         * are the only ones I know of that need the idiotic second function,
         * generated by an if clause in the end.
         * @param first - First operand to add.
         * @param second - Second operant to add.
         * @returns The sum of both given operands.
        */let unsignedModule2PowerOf32Addition=function unsignedModule2PowerOf32Addition(first,second){return first+second&4294967295};// / region primary functions needed for the algorithm
/*
         * Implements the basic operation for each round of the algorithm.
         */const cmn=function cmn(q,a,b,x,s,t){a=unsignedModule2PowerOf32Addition(unsignedModule2PowerOf32Addition(a,q),unsignedModule2PowerOf32Addition(x,t));return unsignedModule2PowerOf32Addition(a<<s|a>>>32-s,b)};/**
         * First algorithm part.
         * @param a - Operand.
         * @param b - Operand.
         * @param c - Operand.
         * @param d - Operand.
         * @param x - Operand.
         * @param s - Operand.
         * @param t - Operand.
         * @returns Result.
         */const ff=function ff(a,b,c,d,x,s,t){return cmn(b&c|~b&d,a,b,x,s,t)};/**
         * Second algorithm part.
         * @param a - Operand.
         * @param b - Operand.
         * @param c - Operand.
         * @param d - Operand.
         * @param x - Operand.
         * @param s - Operand.
         * @param t - Operand.
         * @returns Result.
         */const gg=function gg(a,b,c,d,x,s,t){return cmn(b&d|c&~d,a,b,x,s,t)};/**
         * Third algorithm part.
         * @param a - Operand.
         * @param b - Operand.
         * @param c - Operand.
         * @param d - Operand.
         * @param x - Operand.
         * @param s - Operand.
         * @param t - Operand.
         * @returns Result.
         */const hh=function hh(a,b,c,d,x,s,t){return cmn(b^c^d,a,b,x,s,t)};/**
         * Fourth algorithm part.
         * @param a - Operand.
         * @param b - Operand.
         * @param c - Operand.
         * @param d - Operand.
         * @param x - Operand.
         * @param s - Operand.
         * @param t - Operand.
         * @returns Result.
         */const ii=function ii(a,b,c,d,x,s,t){return cmn(c^(b|~d),a,b,x,s,t)};/**
         * Performs all 16 needed steps.
         * @param state - Current state.
         * @param blocks - Blocks to cycle through.
         * @returns Returns given state.
         */const cycle=function cycle(state,blocks){let a=state[0];let b=state[1];let c=state[2];let d=state[3];// region round 1
a=ff(a,b,c,d,blocks[0],7,-680876936);d=ff(d,a,b,c,blocks[1],12,-389564586);c=ff(c,d,a,b,blocks[2],17,606105819);b=ff(b,c,d,a,blocks[3],22,-1044525330);a=ff(a,b,c,d,blocks[4],7,-176418897);d=ff(d,a,b,c,blocks[5],12,1200080426);c=ff(c,d,a,b,blocks[6],17,-1473231341);b=ff(b,c,d,a,blocks[7],22,-45705983);a=ff(a,b,c,d,blocks[8],7,1770035416);d=ff(d,a,b,c,blocks[9],12,-1958414417);c=ff(c,d,a,b,blocks[10],17,-42063);b=ff(b,c,d,a,blocks[11],22,-1990404162);a=ff(a,b,c,d,blocks[12],7,1804603682);d=ff(d,a,b,c,blocks[13],12,-40341101);c=ff(c,d,a,b,blocks[14],17,-1502002290);b=ff(b,c,d,a,blocks[15],22,1236535329);// endregion
// region round 2
a=gg(a,b,c,d,blocks[1],5,-165796510);d=gg(d,a,b,c,blocks[6],9,-1069501632);c=gg(c,d,a,b,blocks[11],14,643717713);b=gg(b,c,d,a,blocks[0],20,-373897302);a=gg(a,b,c,d,blocks[5],5,-701558691);d=gg(d,a,b,c,blocks[10],9,38016083);c=gg(c,d,a,b,blocks[15],14,-660478335);b=gg(b,c,d,a,blocks[4],20,-405537848);a=gg(a,b,c,d,blocks[9],5,568446438);d=gg(d,a,b,c,blocks[14],9,-1019803690);c=gg(c,d,a,b,blocks[3],14,-187363961);b=gg(b,c,d,a,blocks[8],20,1163531501);a=gg(a,b,c,d,blocks[13],5,-1444681467);d=gg(d,a,b,c,blocks[2],9,-51403784);c=gg(c,d,a,b,blocks[7],14,1735328473);b=gg(b,c,d,a,blocks[12],20,-1926607734);// endregion
// region round 3
a=hh(a,b,c,d,blocks[5],4,-378558);d=hh(d,a,b,c,blocks[8],11,-2022574463);c=hh(c,d,a,b,blocks[11],16,1839030562);b=hh(b,c,d,a,blocks[14],23,-35309556);a=hh(a,b,c,d,blocks[1],4,-1530992060);d=hh(d,a,b,c,blocks[4],11,1272893353);c=hh(c,d,a,b,blocks[7],16,-155497632);b=hh(b,c,d,a,blocks[10],23,-1094730640);a=hh(a,b,c,d,blocks[13],4,681279174);d=hh(d,a,b,c,blocks[0],11,-358537222);c=hh(c,d,a,b,blocks[3],16,-722521979);b=hh(b,c,d,a,blocks[6],23,76029189);a=hh(a,b,c,d,blocks[9],4,-640364487);d=hh(d,a,b,c,blocks[12],11,-421815835);c=hh(c,d,a,b,blocks[15],16,530742520);b=hh(b,c,d,a,blocks[2],23,-995338651);// endregion
// region round 4
a=ii(a,b,c,d,blocks[0],6,-198630844);d=ii(d,a,b,c,blocks[7],10,1126891415);c=ii(c,d,a,b,blocks[14],15,-1416354905);b=ii(b,c,d,a,blocks[5],21,-57434055);a=ii(a,b,c,d,blocks[12],6,1700485571);d=ii(d,a,b,c,blocks[3],10,-1894986606);c=ii(c,d,a,b,blocks[10],15,-1051523);b=ii(b,c,d,a,blocks[1],21,-2054922799);a=ii(a,b,c,d,blocks[8],6,1873313359);d=ii(d,a,b,c,blocks[15],10,-30611744);c=ii(c,d,a,b,blocks[6],15,-1560198380);b=ii(b,c,d,a,blocks[13],21,1309151649);a=ii(a,b,c,d,blocks[4],6,-145523070);d=ii(d,a,b,c,blocks[11],10,-1120210379);c=ii(c,d,a,b,blocks[2],15,718787259);b=ii(b,c,d,a,blocks[9],21,-343485551);// endregion
state[0]=unsignedModule2PowerOf32Addition(a,state[0]);state[1]=unsignedModule2PowerOf32Addition(b,state[1]);state[2]=unsignedModule2PowerOf32Addition(c,state[2]);state[3]=unsignedModule2PowerOf32Addition(d,state[3]);return state};// / endregion
/**
         * Converts given character to its corresponding hex code
         * representation.
         * @param character - Character to convert.
         * @returns Converted hex code string.
         */const convertCharactorToHexCode=function convertCharactorToHexCode(character){let hexString='';for(let round=0;round<4;round++)hexString+=hexCharacters[character>>round*8+4&15]+hexCharacters[character>>round*8&15];return hexString};/**
         * Converts given byte array to its corresponding hex code as string.
         * @param value - Array of characters to convert.
         * @returns Converted hex code.
         */const convertToHexCode=function convertToHexCode(value){for(let index=0;index<value.length;index++)value[index]=convertCharactorToHexCode(value[index]);return value.join('')};/**
         * There needs to be support for unicode here, unless we pretend that
         * we can redefine the md5 algorithm for multi-byte characters
         * (perhaps by adding every four 16-bit characters and shortening the
         * sum to 32 bits). Otherwise I suggest performing md5 as if every
         * character was two bytes--e.g., 0040 0025 = @%--but then how will an
         * ordinary md5 sum be matched? There is no way to standardize text
         * to something like utf-8 before transformation; speed cost is
         * utterly prohibitive. The JavaScript standard itself needs to look
         * at this: it should start providing access to strings as preformed
         * utf-8 8-bit unsigned value arrays.
         * @param value - Value to process with each block.
         * @returns Converted byte array.
         */const handleBlock=function handleBlock(value){const blocks=[];for(let blockNumber=0;blockNumber<64;blockNumber+=4)blocks[blockNumber>>2]=value.charCodeAt(blockNumber)+(value.charCodeAt(blockNumber+1)<<8)+(value.charCodeAt(blockNumber+2)<<16)+(value.charCodeAt(blockNumber+3)<<24);return blocks};// endregion
/**
         * Triggers the main algorithm to calculate the md5 representation of
         * given value.
         * @param value - String to convert to its md5 representation.
         * @returns Array of blocks.
         */const main=function main(value){const length=value.length;const state=[1732584193,-271733879,-1732584194,271733878];let blockNumber;for(blockNumber=64;blockNumber<=value.length;blockNumber+=64)cycle(state,handleBlock(value.substring(blockNumber-64,blockNumber)));value=value.substring(blockNumber-64);const tail=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(blockNumber=0;blockNumber<value.length;blockNumber++)tail[blockNumber>>2]|=value.charCodeAt(blockNumber)<<(blockNumber%4<<3);tail[blockNumber>>2]|=128<<(blockNumber%4<<3);if(blockNumber>55){cycle(state,tail);for(let index=0;index<16;index++)tail[index]=0}tail[14]=length*8;cycle(state,tail);return state};// region final call
if(convertToHexCode(main('hello'))!=='5d41402abc4b2a76b9719d911017c592')/**
             * This function is much faster, so if possible we use it. Some IEs
             * are the only ones I know of that need the idiotic second
             * function, generated by an if clause in the end.
             * @private
             * @param first - First operand to add.
             * @param second - Second operant to add.
             * @returns The sum of both given operands.
            */unsignedModule2PowerOf32Addition=function unsignedModule2PowerOf32Addition(first,second){const lsw=(first&65535)+(second&65535);const msw=(first>>16)+(second>>16)+(lsw>>16);return msw<<16|lsw&65535};return convertToHexCode(main(onlyAscii?value:unescape(encodeURIComponent(value))));// endregion
}/**
     * Normalizes given phone number for automatic dialing mechanisms.
     * @param phoneNumber - Number to normalize.
     * @returns Normalized number.
     */static stringNormalizePhoneNumber(phoneNumber){if(typeof phoneNumber==='string'||typeof phoneNumber==='number')return`${phoneNumber}`.replace(/[^0-9]*\+/,'00').replace(/[^0-9]+/g,'');return''}/**
     * Converts given serialized, base64 encoded or file path given object into
     * a native javaScript one if possible.
     * @param serializedObject - Object as string.
     * @param scope - An optional scope which will be used to evaluate given
     * object in.
     * @param name - The name under given scope will be available.
     * @returns The parsed object if possible and null otherwise.
     */static stringParseEncodedObject(serializedObject,scope={},name='scope'){if(serializedObject.endsWith('.json')&&Tools.isFileSync(serializedObject))serializedObject=fileSystem.readFileSync(serializedObject,{encoding:'utf-8'});if(!serializedObject.startsWith('{'))serializedObject=eval('Buffer').from(serializedObject,'base64').toString('utf8');let result;try{// IgnoreTypeCheck
result=new Function(name,`return ${serializedObject}`)(scope)}catch(error){}if(typeof result==='object')return result;return null}/**
     * Represents given phone number. NOTE: Currently only support german phone
     * numbers.
     * @param phoneNumber - Number to format.
     * @returns Formatted number.
     */static stringRepresentPhoneNumber(phoneNumber){if(['number','string'].includes(Tools.determineType(phoneNumber))&&phoneNumber){// Represent country code and leading area code zero.
phoneNumber=`${phoneNumber}`.replace(/^(00|\+)([0-9]+)-([0-9-]+)$/,'+$2 (0) $3');// Add German country code if not exists.
phoneNumber=phoneNumber.replace(/^0([1-9][0-9-]+)$/,'+49 (0) $1');// Separate area code from base number.
phoneNumber=phoneNumber.replace(/^([^-]+)-([0-9-]+)$/,'$1 / $2');// Partition base number in one triple and tuples or tuples only.
return phoneNumber.replace(/^(.*?)([0-9]+)(-?[0-9]*)$/,function(match,prefix,number,suffix){return prefix+(number.length%2===0?number.replace(/([0-9]{2})/g,'$1 '):number.replace(/^([0-9]{3})([0-9]+)$/,function(match,triple,rest){return`${triple} `+rest.replace(/([0-9]{2})/g,'$1 ').trim()})+suffix).trim()}).trim()}return''}/**
     * Decodes all html symbols in text nodes in given html string.
     * @param htmlString - HTML string to decode.
     * @returns Decoded html string.
     */static stringDecodeHTMLEntities(htmlString){if('document'in $.global){const textareaDomNode=$.global.document.createElement('textarea');textareaDomNode.innerHTML=htmlString;return textareaDomNode.value}return null}/**
     * Converts a dom selector to a prefixed dom selector string.
     * @param selector - A dom node selector.
     * @returns Returns given selector prefixed.
     */normalizeDomNodeSelector(selector){let domNodeSelectorPrefix='';if(this._options.domNodeSelectorPrefix)domNodeSelectorPrefix=`${this._options.domNodeSelectorPrefix} `;if(!(selector.startsWith(domNodeSelectorPrefix)||selector.trim().startsWith('<')))selector=domNodeSelectorPrefix+selector;return selector.trim()}// / endregion
// / region number
/**
     * Determines corresponding utc timestamp for given date object.
     * @param value - Date to convert.
     * @param inMilliseconds - Indicates whether given number should be in
     * seconds (default) or milliseconds.
     * @returns Determined numerous value.
     */static numberGetUTCTimestamp(value,inMilliseconds=false){const date=[undefined,null].includes(value)?new Date:new Date(value);return Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate(),date.getUTCHours(),date.getUTCMinutes(),date.getUTCSeconds(),date.getUTCMilliseconds())/(inMilliseconds?1:1000)}/**
     * Checks if given object is java scripts native "Number.NaN" object.
     * @param object - Object to Check.
     * @returns Returns whether given value is not a number or not.
     */static numberIsNotANumber(object){return Tools.determineType(object)==='number'&&isNaN(object)}/**
     * Rounds a given number accurate to given number of digits.
     * @param number - The number to round.
     * @param digits - The number of digits after comma.
     * @returns Returns the rounded number.
     */static numberRound(number,digits=0){return Math.round(number*Math.pow(10,digits))/Math.pow(10,digits)}// / endregion
// / region data transfer
/**
     * Checks if given url response with given status code.
     * @param url - Url to check reachability.
     * @param wait - Boolean indicating if we should retry until a status code
     * will be given.
     * @param expectedStatusCodes - Status codes to check for.
     * @param timeoutInSeconds - Delay after assuming given resource isn't
     * available if no response is coming.
     * @param pollIntervallInSeconds - Seconds between two tries to reach given
     * url.
     * @param options - Fetch options to use.
     * @returns A promise which will be resolved if a request to given url has
     * finished and resulting status code matches given expectedstatus code.
     * Otherwise returned promise will be rejected.
     */static checkReachability(url,wait=false,expectedStatusCodes=200,timeoutInSeconds=10,pollIntervallInSeconds=0.1,options={}){return(0,_asyncToGenerator3.default)(function*(){expectedStatusCodes=[].concat(expectedStatusCodes);const check=function check(response){if(response&&'status'in response&&// IgnoreTypeCheck
!expectedStatusCodes.includes(response.status))throw new Error(`Given status code ${response.status} differs from `+// IgnoreTypeCheck
`${expectedStatusCodes.join(', ')}.`);return response};if(wait)return new _promise2.default(function(){var _ref2=(0,_asyncToGenerator3.default)(function*(resolve,reject){let timedOut=false;const wrapper=function(){var _ref3=(0,_asyncToGenerator3.default)(function*(){let response;try{response=yield fetch(url,options)}catch(error){if(!timedOut){/* eslint-disable no-use-before-define */currentlyRunningTimer=Tools.timeout(pollIntervallInSeconds*1000,wrapper);/* eslint-enable no-use-before-define *//*
                                NOTE: A timer rejection is expected. Avoid
                                throwing errors about unhandled promise
                                rejections.
                            */currentlyRunningTimer.catch(Tools.noop)}return error}try{resolve(check(response))}catch(error){reject(error)}finally{/* eslint-disable no-use-before-define */// IgnoreTypeCheck
timer.clear();/* eslint-enable no-use-before-define */}return response});return function wrapper(){return _ref3.apply(this,arguments)}}();let currentlyRunningTimer=Tools.timeout(0,wrapper);const timer=Tools.timeout(timeoutInSeconds*1000);try{yield timer}catch(error){}timedOut=true;// IgnoreTypeCheck
currentlyRunningTimer.clear();reject(`Timeout of ${timeoutInSeconds} seconds reached.`)});return function(_x2,_x3){return _ref2.apply(this,arguments)}}());return check((yield fetch(url,options)))})()}/**
     * Checks if given url isn't reachable.
     * @param url - Url to check reachability.
     * @param wait - Boolean indicating if we should retry until a status code
     * will be given.
     * @param timeoutInSeconds - Delay after assuming given resource will stay
     * available.
     * @param pollIntervallInSeconds - Seconds between two tries to reach given
     * url.
     * @param unexpectedStatusCodes - Status codes to check for.
     * @param options - Fetch options to use.
     * @returns A promise which will be resolved if a request to given url
     * couldn't finished. Otherwise returned promise will be rejected.
     */static checkUnreachability(url,wait=false,timeoutInSeconds=10,pollIntervallInSeconds=0.1,unexpectedStatusCodes=null,options={}){return(0,_asyncToGenerator3.default)(function*(){const check=function check(response){if(unexpectedStatusCodes){unexpectedStatusCodes=[].concat(unexpectedStatusCodes);if(response&&'status'in response&&unexpectedStatusCodes.includes(response.status))throw new Error(`Given url "${url}" is reachable ans responses with `+`unexpected status code "${response.status}".`);return new Error('Given status code is not "'+`${unexpectedStatusCodes.join(', ')}".`)}};if(wait)return new _promise2.default(function(){var _ref4=(0,_asyncToGenerator3.default)(function*(resolve,reject){let timedOut=false;const wrapper=function(){var _ref5=(0,_asyncToGenerator3.default)(function*(){try{const response=yield fetch(url,options);if(timedOut)return response;const result=check(response);if(result){// IgnoreTypeCheck
timer.clear();resolve(result);return result}/* eslint-disable no-use-before-define */currentlyRunningTimer=Tools.timeout(pollIntervallInSeconds*1000,wrapper);/* eslint-enable no-use-before-define *//*
                            NOTE: A timer rejection is expected. Avoid throwing
                            errors about unhandled promise rejections.
                        */currentlyRunningTimer.catch(Tools.noop)}catch(error){/* eslint-disable no-use-before-define */// IgnoreTypeCheck
timer.clear();/* eslint-enable no-use-before-define */resolve(error);return error}});return function wrapper(){return _ref5.apply(this,arguments)}}();let currentlyRunningTimer=Tools.timeout(0,wrapper);const timer=Tools.timeout(timeoutInSeconds*1000);try{yield timer}catch(error){}timedOut=true;// IgnoreTypeCheck
currentlyRunningTimer.clear();reject(`Timeout of ${timeoutInSeconds} seconds reached.`)});return function(_x4,_x5){return _ref4.apply(this,arguments)}}());try{const result=check((yield fetch(url,options)));if(result)return result}catch(error){return error}throw new Error(`Given url "${url}" is reachable.`)})()}/**
     * Send given data to a given iframe.
     * @param target - Name of the target iframe or the target iframe itself.
     * @param url - URL to send to data to.
     * @param data - Data holding object to send data to.
     * @param requestType - The forms action attribute value. If nothing is
     * provided "post" will be used as default.
     * @param removeAfterLoad - Indicates if created iframe should be removed
     * right after load event. Only works if an iframe object is given instead
     * of a simple target name.
     * @returns Returns the given target as extended dom node.
     */static sendToIFrame(target,url,data,requestType='post',removeAfterLoad=false){const $targetDomNode=typeof target==='string'?$(`iframe[name"${target}"]`):$(target);const $formDomNode=$('<form>').attr({action:url,method:requestType,target:$targetDomNode.attr('name')});for(const name in data)if(data.hasOwnProperty(name))$formDomNode.append($('<input>').attr({type:'hidden',name,value:data[name]}));/*
            NOTE: The given target form have to be injected into document
            object model to successfully submit.
        */if(removeAfterLoad)$targetDomNode.on('load',function(){return $targetDomNode.remove()});$formDomNode.insertAfter($targetDomNode);$formDomNode[0].submit();$formDomNode.remove();return $targetDomNode}/**
     * Send given data to a temporary created iframe.
     * @param url - URL to send to data to.
     * @param data - Data holding object to send data to.
     * @param requestType - The forms action attribute value. If nothing is
     * provided "post" will be used as default.
     * @param removeAfterLoad - Indicates if created iframe should be removed
     * right after load event.
     * @returns Returns the dynamically created iframe.
     */sendToExternalURL(url,data,requestType='post',removeAfterLoad=true){const $iFrameDomNode=$('<iframe>').attr('name',this.constructor.name.charAt(0).toLowerCase()+this.constructor.name.substring(1)+new Date().getTime()).hide();this.$domNode.append($iFrameDomNode);this.constructor.sendToIFrame($iFrameDomNode,url,data,requestType,removeAfterLoad);return $iFrameDomNode}// / endregion
// / region file
/**
     * Copies given source directory via path to given target directory
     * location with same target name as source file has or copy to given
     * complete target directory path.
     * @param sourcePath - Path to directory to copy.
     * @param targetPath - Target directory or complete directory location to
     * copy in.
     * @param callback - Function to invoke for each traversed file.
     * @param readOptions - Options to use for reading source file.
     * @param writeOptions - Options to use for writing to target file.
     * @returns Promise holding the determined target directory path.
     */static copyDirectoryRecursive(sourcePath,targetPath,callback=Tools.noop,readOptions={encoding:null,flag:'r'},writeOptions={encoding:'utf8',flag:'w',mode:438}){return new _promise2.default(function(){var _ref6=(0,_asyncToGenerator3.default)(function*(resolve,reject){// NOTE: Check if folder needs to be created or integrated.
let isDirectory;try{isDirectory=yield Tools.isDirectory(targetPath)}catch(error){return reject(error)}if(isDirectory)targetPath=path.resolve(targetPath,path.basename(sourcePath));sourcePath=path.resolve(sourcePath);fileSystem.mkdir(targetPath,function(){var _ref7=(0,_asyncToGenerator3.default)(function*(error){if(error&&!('code'in error&&error.code==='EEXIST'))return reject(error);let files;try{files=yield Tools.walkDirectoryRecursively(sourcePath,callback)}catch(error){return reject(error)}for(const currentSourceFile of files){const currentTargetPath=path.join(targetPath,currentSourceFile.path.substring(sourcePath.length));if(currentSourceFile.stat.isDirectory())try{fileSystem.mkdirSync(currentTargetPath)}catch(error){if(!('code'in error&&error.code==='EEXIST'))throw error}else try{yield Tools.copyFile(currentSourceFile.path,currentTargetPath,readOptions,writeOptions)}catch(error){return reject(error)}}resolve(targetPath)});return function(_x8){return _ref7.apply(this,arguments)}}())});return function(_x6,_x7){return _ref6.apply(this,arguments)}}())}/**
     * Copies given source directory via path to given target directory
     * location with same target name as source file has or copy to given
     * complete target directory path.
     * @param sourcePath - Path to directory to copy.
     * @param targetPath - Target directory or complete directory location to
     * copy in.
     * @param callback - Function to invoke for each traversed file.
     * @param readOptions - Options to use for reading source file.
     * @param writeOptions - Options to use for writing to target file.
     * @returns Determined target directory path.
     */static copyDirectoryRecursiveSync(sourcePath,targetPath,callback=Tools.noop,readOptions={encoding:null,flag:'r'},writeOptions={encoding:'utf8',flag:'w',mode:438}){// Check if folder needs to be created or integrated.
sourcePath=path.resolve(sourcePath);if(Tools.isDirectorySync(targetPath))targetPath=path.resolve(targetPath,path.basename(sourcePath));fileSystem.mkdirSync(targetPath);for(const currentSourceFile of Tools.walkDirectoryRecursivelySync(sourcePath,callback)){const currentTargetPath=path.join(targetPath,currentSourceFile.path.substring(sourcePath.length));if(currentSourceFile.stat.isDirectory())fileSystem.mkdirSync(currentTargetPath);else Tools.copyFileSync(currentSourceFile.path,currentTargetPath,readOptions,writeOptions)}return targetPath}/**
     * Copies given source file via path to given target directory location
     * with same target name as source file has or copy to given complete
     * target file path.
     * @param sourcePath - Path to file to copy.
     * @param targetPath - Target directory or complete file location to copy
     * to.
     * @param readOptions - Options to use for reading source file.
     * @param writeOptions - Options to use for writing to target file.
     * @returns Determined target file path.
     */static copyFile(sourcePath,targetPath,readOptions={encoding:null,flag:'r'},writeOptions={encoding:'utf8',flag:'w',mode:438}){/*
            NOTE: If target path references a directory a new file with the
            same name will be created.
        */return new _promise2.default(function(){var _ref8=(0,_asyncToGenerator3.default)(function*(resolve,reject){let isDirectory;try{isDirectory=yield Tools.isDirectory(targetPath)}catch(error){return reject(error)}if(isDirectory)targetPath=path.resolve(targetPath,path.basename(sourcePath));fileSystem.readFile(sourcePath,readOptions,function(error,data){if(error)reject(error);else fileSystem.writeFile(targetPath,data,writeOptions,function(error){if(error)reject(error);else resolve(targetPath)})})});return function(_x9,_x10){return _ref8.apply(this,arguments)}}())}/**
     * Copies given source file via path to given target directory location
     * with same target name as source file has or copy to given complete
     * target file path.
     * @param sourcePath - Path to file to copy.
     * @param targetPath - Target directory or complete file location to copy
     * to.
     * @param readOptions - Options to use for reading source file.
     * @param writeOptions - Options to use for writing to target file.
     * @returns Determined target file path.
     */static copyFileSync(sourcePath,targetPath,readOptions={encoding:null,flag:'r'},writeOptions={encoding:'utf8',flag:'w',mode:438}){/*
            NOTE: If target path references a directory a new file with the
            same name will be created.
        */if(Tools.isDirectorySync(targetPath))targetPath=path.resolve(targetPath,path.basename(sourcePath));fileSystem.writeFileSync(targetPath,fileSystem.readFileSync(sourcePath,readOptions),writeOptions);return targetPath}/**
     * Checks if given path points to a valid directory.
     * @param filePath - Path to directory.
     * @returns A promise holding a boolean which indicates directory
     * existents.
     */static isDirectory(filePath){return new _promise2.default(function(resolve,reject){return fileSystem.stat(filePath,function(error,stat){if(error){if(error.hasOwnProperty('code'// IgnoreTypeCheck
)&&['ENOENT','ENOTDIR'].includes(error.code))resolve(false);else reject(error);}else resolve(stat.isDirectory())})})}/**
     * Checks if given path points to a valid directory.
     * @param filePath - Path to directory.
     * @returns A boolean which indicates directory existents.
     */static isDirectorySync(filePath){try{return fileSystem.statSync(filePath).isDirectory()}catch(error){if(error.hasOwnProperty('code')&&['ENOENT','ENOTDIR'].includes(error.code))return false;throw error}}/**
     * Checks if given path points to a valid file.
     * @param filePath - Path to directory.
     * @returns A promise holding a boolean which indicates directory
     * existents.
     */static isFile(filePath){return new _promise2.default(function(resolve,reject){return fileSystem.stat(filePath,function(error,stat){if(error){if(error.hasOwnProperty('code'// IgnoreTypeCheck
)&&['ENOENT','ENOTDIR'].includes(error.code))resolve(false);else reject(error);}else resolve(stat.isFile())})})}/**
     * Checks if given path points to a valid file.
     * @param filePath - Path to file.
     * @returns A boolean which indicates file existents.
     */static isFileSync(filePath){try{return fileSystem.statSync(filePath).isFile()}catch(error){if(error.hasOwnProperty('code')&&['ENOENT','ENOTDIR'].includes(error.code))return false;throw error}}/**
     * Iterates through given directory structure recursively and calls given
     * callback for each found file. Callback gets file path and corresponding
     * stat object as argument.
     * @param directoryPath - Path to directory structure to traverse.
     * @param callback - Function to invoke for each traversed file and
     * potentially manipulate further traversing.
     * @param options - Options to use for nested "readdir" calls.
     * @returns A promise holding the determined files.
     */static walkDirectoryRecursively(directoryPath,callback=Tools.noop,options='utf8'){return new _promise2.default(function(resolve,reject){return fileSystem.readdir(directoryPath,options,function(){var _ref9=(0,_asyncToGenerator3.default)(function*(error,fileNames){if(error)return reject(error);const files=[];const statPromises=[];for(const fileName of fileNames){const filePath=path.resolve(directoryPath,fileName);statPromises.push(new _promise2.default(function(resolve){return fileSystem.stat(filePath,function(error,stat){files.push({directoryPath,name:fileName,path:filePath,stat:error||stat});resolve()})}))}yield _promise2.default.all(statPromises);if(callback)/*
                        NOTE: Directories have to be iterated first to
                        potentially avoid deeper iterations.
                    */files.sort(function(firstFile,secondFile){if(firstFile.stat.isDirectory()){if(secondFile.stat.isDirectory())return 0;return-1}if(secondFile.stat.isDirectory())return 1;return 0});let finalFiles=[];for(const file of files){finalFiles.push(file);let result=callback(file);if(result===null)break;if(typeof result==='object'&&'then'in result)result=yield result;if(result===null)break;if(result!==false&&file.stat.isDirectory())finalFiles=finalFiles.concat((yield Tools.walkDirectoryRecursively(file.path,callback)))}resolve(finalFiles)});return function(_x11,_x12){return _ref9.apply(this,arguments)}}())})}/**
     * Iterates through given directory structure recursively and calls given
     * callback for each found file. Callback gets file path and corresponding
     * stat object as argument.
     * @param directoryPath - Path to directory structure to traverse.
     * @param callback - Function to invoke for each traversed file.
     * @param options - Options to use for nested "readdir" calls.
     * @returns Determined list if all files.
     */static walkDirectoryRecursivelySync(directoryPath,callback=Tools.noop,options='utf8'){let files=[];for(const fileName of fileSystem.readdirSync(directoryPath,options)){const filePath=path.resolve(directoryPath,fileName);files.push({directoryPath,name:fileName,path:filePath,stat:fileSystem.statSync(filePath)})}if(callback)/*
                NOTE: Directories have to be iterated first to potentially
                avoid deeper iterations.
            */files.sort(function(firstFile,secondFile){if(firstFile.stat.isDirectory()){if(secondFile.stat.isDirectory())return 0;return-1}if(secondFile.stat.isDirectory())return 1;return 0});let finalFiles=[];for(const file of files){finalFiles.push(file);const result=callback(file);if(result===null)break;if(result!==false&&file.stat.isDirectory())finalFiles=finalFiles.concat(Tools.walkDirectoryRecursivelySync(file.path,callback))}return finalFiles}// / endregion
// / region process handler
/**
     * Generates a one shot close handler which triggers given promise methods.
     * If a reason is provided it will be given as resolve target. An Error
     * will be generated if return code is not zero. The generated Error has
     * a property "returnCode" which provides corresponding process return
     * code.
     * @param resolve - Promise's resolve function.
     * @param reject - Promise's reject function.
     * @param reason - Promise target if process has a zero return code.
     * @param callback - Optional function to call of process has successfully
     * finished.
     * @returns Process close handler function.
     */static getProcessCloseHandler(resolve,reject,reason=null,callback=function(){}){let finished=false;return function(returnCode,...parameter){if(finished)finished=true;else{finished=true;if(typeof returnCode!=='number'||returnCode===0){callback();resolve({reason,parameter})}else{const error=new Error(`Task exited with error code ${returnCode}`);// IgnoreTypeCheck
error.returnCode=returnCode;// IgnoreTypeCheck
error.parameter=parameter;reject(error)}}}}/**
     * Forwards given child process communication channels to corresponding
     * current process communication channels.
     * @param childProcess - Child process meta data.
     * @returns Given child process meta data.
     */static handleChildProcess(childProcess){childProcess.stdout.pipe(process.stdout);childProcess.stderr.pipe(process.stderr);childProcess.on('close',function(returnCode){if(returnCode!==0)console.error(`Task exited with error code ${returnCode}`)});return childProcess}// / endregion
// endregion
// region protected methods
/* eslint-disable jsdoc/require-description-complete-sentence *//**
     * Helper method for attach event handler methods and their event handler
     * remove pendants.
     * @param parameter - Arguments object given to methods like "bind()" or
     * "unbind()".
     * @param removeEvent - Indicates if "unbind()" or "bind()" was given.
     * @param eventFunctionName - Name of function to wrap.
     * @returns Returns $'s wrapped dom node.
     */_bindEventHelper(parameter,removeEvent=false,eventFunctionName='on'){/* eslint-enable jsdoc/require-description-complete-sentence */const $domNode=$(parameter[0]);if(this.constructor.determineType(parameter[1])==='object'&&!removeEvent){for(const eventType in parameter[1])if(parameter[1].hasOwnProperty(eventType))// IgnoreTypeCheck
this[eventFunctionName]($domNode,eventType,parameter[1][eventType]);return $domNode}parameter=this.constructor.arrayMake(parameter).slice(1);if(parameter.length===0)parameter.push('');if(!parameter[0].includes('.'))parameter[0]+=`.${this.constructor.name}`;if(removeEvent)return $domNode[eventFunctionName](...parameter);return $domNode[eventFunctionName](...parameter)}// endregion
}exports.default=Tools;// endregion
// region handle $ extending
Tools.abbreviations=['html','id','url','us','de','api','href'];Tools.animationEndEventNames='animationend webkitAnimationEnd '+'oAnimationEnd MSAnimationEnd';Tools.classToTypeMapping={'[object Array]':'array','[object Boolean]':'boolean','[object Date]':'date','[object Error]':'error','[object Function]':'function','[object Map]':'map','[object Number]':'number','[object Object]':'object','[object RegExp]':'regexp','[object Set]':'set','[object String]':'string'};Tools.closeEventNames=['exit','close','uncaughtException','SIGINT','SIGTERM','SIGQUIT'];Tools.consoleMethodNames=['assert','clear','count','debug','dir','dirxml','error','exception','group','groupCollapsed','groupEnd','info','log','markTimeline','profile','profileEnd','table','time','timeEnd','timeStamp','trace','warn'];Tools.keyCode={BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,F1:112,F2:113,F3:114,F4:115,F5:116,F6:117,F7:118,F8:119,F9:120,F10:121,F11:122,F12:123,HOME:36,LEFT:37,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38};Tools.maximalSupportedInternetExplorerVersion=function(){if(!('document'in $.global))return 0;const div=$.global.document.createElement('div');let version;for(version=0;version<10;version++){/*
                NOTE: We split html comment sequences to avoid wrong
                interpretation if this code is embedded in markup.
                NOTE: Internet Explorer 9 and lower sometimes doesn't
                understand conditional comments wich doesn't starts with a
                whitespace. If the conditional markup isn't in a commend.
                Otherwise there shouldn't be any whitespace!
            *//* eslint-disable no-useless-concat */div.innerHTML='<!'+`--[if gt IE ${version}]><i></i><![e`+'ndif]-'+'->';/* eslint-enable no-useless-concat */if(div.getElementsByTagName('i').length===0)break}// Try special detection for internet explorer 10 and 11.
if(version===0&&'navigator'in $.global)if($.global.navigator.appVersion.includes('MSIE 10'))return 10;else if($.global.navigator.userAgent.includes('Trident')&&$.global.navigator.userAgent.includes('rv:11'))return 11;return version}();Tools.noop='noop'in $?$.noop:function(){};Tools.plainObjectPrototypes=[Object.prototype];Tools.specialRegexSequences=['-','[',']','(',')','^','$','*','+','.','{','}'];Tools.transitionEndEventNames='transitionend '+'webkitTransitionEnd oTransitionEnd MSTransitionEnd';Tools._javaScriptDependentContentHandled=false;if('fn'in $)$.fn.Tools=function(...parameter){return new Tools().controller(Tools,parameter,this)};$.Tools=function(...parameter){return new Tools().controller(Tools,parameter)};$.Tools.class=Tools;if('fn'in $){// region prop fix for comments and text nodes
const nativePropFunction=$.fn.prop;/**
     * JQuery's native prop implementation ignores properties for text nodes,
     * comments and attribute nodes.
     * @param key - Name of property to retrieve from current dom node.
     * @param additionalParameter - Additional parameter will be forwarded to
     * native prop function also.
     * @returns Returns value if used as getter or current dom node if used as
     * setter.
     */$.fn.prop=function(key,...additionalParameter){if(additionalParameter.length<2&&this.length&&['#text','#comment'].includes(this[0].nodeName)&&key in this[0]){if(additionalParameter.length===0)return this[0][key];if(additionalParameter.length===1){this[0][key]=additionalParameter[0];return this}}return nativePropFunction.call(this,key,...additionalParameter)};// endregion
// region fix script loading errors with canceling requests after dom ready
$.readyException=function(error){if(!(typeof error==='string'&&error==='canceled'))throw error};// endregion
}// endregion
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module), __webpack_require__(3), __webpack_require__(4)))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_9__;

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_10__;

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_11__;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_12__;

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_13__;

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_14__;

/***/ }),
/* 15 */
/***/ (function(module, exports) {

if(typeof __WEBPACK_EXTERNAL_MODULE_15__ === 'undefined') {var e = new Error("Cannot find module \"jQuery\""); e.code = 'MODULE_NOT_FOUND'; throw e;}
module.exports = __WEBPACK_EXTERNAL_MODULE_15__;

/***/ })
/******/ ]);
});

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var dP = __webpack_require__(7).f;
var create = __webpack_require__(42);
var redefineAll = __webpack_require__(36);
var ctx = __webpack_require__(5);
var anInstance = __webpack_require__(34);
var forOf = __webpack_require__(16);
var $iterDefine = __webpack_require__(25);
var step = __webpack_require__(48);
var setSpecies = __webpack_require__(53);
var DESCRIPTORS = __webpack_require__(9);
var fastKey = __webpack_require__(56).fastKey;
var validate = __webpack_require__(37);
var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function () {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

var META = __webpack_require__(30)('meta');
var isObject = __webpack_require__(4);
var has = __webpack_require__(12);
var setDesc = __webpack_require__(7).f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__(11)(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(2);
var $export = __webpack_require__(1);
var meta = __webpack_require__(56);
var fails = __webpack_require__(11);
var hide = __webpack_require__(6);
var redefineAll = __webpack_require__(36);
var forOf = __webpack_require__(16);
var anInstance = __webpack_require__(34);
var isObject = __webpack_require__(4);
var setToStringTag = __webpack_require__(17);
var dP = __webpack_require__(7).f;
var each = __webpack_require__(90)(0);
var DESCRIPTORS = __webpack_require__(9);

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  if (!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    C = wrapper(function (target, iterable) {
      anInstance(target, C, NAME, '_c');
      target._c = new Base();
      if (iterable != undefined) forOf(iterable, IS_MAP, target[ADDER], target);
    });
    each('add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON'.split(','), function (KEY) {
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if (KEY in proto && !(IS_WEAK && KEY == 'clear')) hide(C.prototype, KEY, function (a, b) {
        anInstance(this, C, KEY);
        if (!IS_ADDER && IS_WEAK && !isObject(a)) return KEY == 'get' ? undefined : false;
        var result = this._c[KEY](a === 0 ? 0 : a, b);
        return IS_ADDER ? this : result;
      });
    });
    IS_WEAK || dP(C.prototype, 'size', {
      get: function () {
        return this._c.size;
      }
    });
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F, O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = __webpack_require__(33);
var from = __webpack_require__(95);
module.exports = function (NAME) {
  return function toJSON() {
    if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-setmap-offrom/
var $export = __webpack_require__(1);

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { of: function of() {
    var length = arguments.length;
    var A = Array(length);
    while (length--) A[length] = arguments[length];
    return new this(A);
  } });
};


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-setmap-offrom/
var $export = __webpack_require__(1);
var aFunction = __webpack_require__(10);
var ctx = __webpack_require__(5);
var forOf = __webpack_require__(16);

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { from: function from(source /* , mapFn, thisArg */) {
    var mapFn = arguments[1];
    var mapping, A, n, cb;
    aFunction(this);
    mapping = mapFn !== undefined;
    if (mapping) aFunction(mapFn);
    if (source == undefined) return new this();
    A = [];
    if (mapping) {
      n = 0;
      cb = ctx(mapFn, arguments[2], 2);
      forOf(source, false, function (nextItem) {
        A.push(cb(nextItem, n++));
      });
    } else {
      forOf(source, false, A.push, A);
    }
    return new this(A);
  } });
};


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory(__webpack_require__(19), __webpack_require__(54));
	else if(typeof define === 'function' && define.amd)
		define("internationalisation", ["babel-runtime/helpers/asyncToGenerator", "clientnode"], factory);
	else if(typeof exports === 'object')
		exports["internationalisation"] = factory(require("babel-runtime/helpers/asyncToGenerator"), require("clientnode"));
	else
		root['internationalisation'] = factory(root["babel-runtime/helpers/asyncToGenerator"], root["clientnode"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var _asyncToGenerator2=__webpack_require__(3),_asyncToGenerator3=_interopRequireDefault(_asyncToGenerator2),_clientnode=__webpack_require__(4);exports.__esModule=!0,exports.$=void 0;function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}try{module.require('source-map-support/register')}catch(a){}const $=exports.$=_clientnode.$;class Language extends $.Tools.class{initialize(a={},b='',c={},d=null,e=[],f={}){var g=this;this.currentLanguage=b,this.knownTranslation=c,this._$domNodeToFade=d,this._replacements=e,this._textNodesWithKnownTranslation=f,this._options={domNodeSelectorPrefix:'body',default:'enUS',selection:[],initial:null,templateDelimiter:{pre:'{{',post:'}}'},fadeEffect:!0,textNodeParent:{showAnimation:[{opacity:1},{duration:'fast'}],hideAnimation:[{opacity:0},{duration:'fast'}]},preReplacementLanguagePattern:'^\\|({1})$',replacementLanguagePattern:'^([a-z]{2}[A-Z]{2}):((.|\\s)*)$',currentLanguagePattern:'^[a-z]{2}[A-Z]{2}$',replacementDomNodeName:['#comment','langreplacement'],replaceDomNodeNames:['#text','langreplace'],toolsLockDescription:'{1}Switch',languageHashPrefix:'language-',currentLanguageIndicatorClassName:'current',sessionDescription:'{1}',languageMapping:{deDE:['de','de_de','de-de','german','deutsch'],enUS:['en','en_us','en-us'],enEN:['en_en','en-en','english'],frFR:['fr','fr_fr','fr-fr','french']},onSwitched:this.constructor.noop,onEnsured:this.constructor.noop,onSwitch:this.constructor.noop,onEnsure:this.constructor.noop,domNode:{knownTranslation:'div.toc'}},super.initialize(a),this._options.preReplacementLanguagePattern=this.constructor.stringFormat(this._options.preReplacementLanguagePattern,this._options.replacementLanguagePattern.substr(1,this._options.replacementLanguagePattern.length-2)),this._options.toolsLockDescription=this.constructor.stringFormat(this._options.toolsLockDescription,this.constructor.name),this._options.sessionDescription=this.constructor.stringFormat(this._options.sessionDescription,this.constructor.name),this.$domNodes=this.grabDomNode(this._options.domNode),this.$domNodes.switchLanguageButtons=$(`a[href^="#${this._options.languageHashPrefix}"]`),this._movePreReplacementNodes(),this.currentLanguage=this._normalizeLanguage(this._options.default);const h=this._determineUsefulLanguage();return this.on(this.$domNodes.switchLanguageButtons,'click',function(a){return a.preventDefault(),g.switch($(a.target).attr('href').substr(g._options.languageHashPrefix.length+1))}),this.currentLanguage===h?$.when(this._switchCurrentLanguageIndicator(h)):this.switch(h,!0)}switch(a,b=!1){var c=this;return!0!==a&&this._options.selection.length&&!this._options.selection.includes(a)?(this.debug('"{1}" isn\'t one of the allowed languages.',a),$.when(this)):this.acquireLock(this._options.toolsLockDescription,function(){if(!0===a?(b=!0,a=c.currentLanguage):a=c._normalizeLanguage(a),b&&a!==c._options.default||c.currentLanguage!==a){let d='Switch to';b&&(d='Ensure'),c.debug('{1} "{2}".',d,a),c._switchCurrentLanguageIndicator(a),c.fireEvent(b?'ensure':'switch',!0,c,c.currentLanguage,a),c._$domNodeToFade=null,c._replacements=[];const[e,f]=c._collectTextNodesToReplace(a,b);return c._ensureLastTextNodeHavingLanguageIndicator(e,f,b),c._handleSwitchEffect(a,b)}return c.debug('"{1}" is already current selected language.',a),c.releaseLock(c._options.toolsLockDescription),$.when(c)})}refresh(){return this._movePreReplacementNodes().switch(!0)}_handleSwitchEffect(a,b){var c=this;return(0,_asyncToGenerator3.default)(function*(){const d=c.currentLanguage;return!b&&c._options.fadeEffect&&c._$domNodeToFade?(yield c._$domNodeToFade.animate(...c._options.textNodeParent.hideAnimation).promise(),c._switchLanguage(a),c._$domNodeToFade&&(yield c._$domNodeToFade.animate(...c._options.textNodeParent.showAnimation).promise(),yield c.fireEvent(b?'ensured':'switched',!0,c,d,a),c.releaseLock(c._options.toolsLockDescription)),c):(c._switchLanguage(a),yield c.fireEvent(b?'ensured':'switched',!0,c,d,a),c.releaseLock(c._options.toolsLockDescription),c)})()}_movePreReplacementNodes(){const a=this;return this.$domNodes.parent.find(':not(iframe)').contents().each(function(){const b=$(this),c=b.prop('nodeName').toLowerCase();if(a._options.replacementDomNodeName.includes(c)){['#comment','#text'].includes(c)||b.hide();const d=new RegExp(a._options.preReplacementLanguagePattern),e=b.prop('textContent').match(d);if(e&&e[0]){b.prop('textContent',b.prop('textContent').replace(d,e[1]));let a=!1;b.parent().contents().each(function(){return a&&$(this).Tools('text').trim()?(b.appendTo(this),!1):void(b[0]===this&&(a=!0))})}}}),this}_collectTextNodesToReplace(a,b){let c=null,d=null,e=null,f=null;this.knownTranslation={};const g=this;return this.$domNodes.parent.find(':not(iframe)').contents().each(function(){const h=$(this),i=h.prop('nodeName').toLowerCase();if(g._options.replaceDomNodeNames.includes(i.toLowerCase()))h.Tools('text').trim()&&0===h.parents(g._options.replaceDomNodeNames.join()).length&&(f=g._ensureLastTextNodeHavingLanguageIndicator(e,f,b),c=h);else if(c){if(g._options.replacementDomNodeName.includes(i)){let b=h.prop('textContent');'#comment'!==i&&(b=h.html());const j=b.match(new RegExp(g._options.replacementLanguagePattern));return Array.isArray(j)&&j[1]===a?(g.knownTranslation[c.Tools('text').trim()]=j[2].trim(),g._registerTextNodeToChange(c,h,j,d),e=c,f=d,c=null,d=null):h.prop('textContent').match(new RegExp(g._options.currentLanguagePattern))&&(d=h),!0}e=null,f=null,c=null,d=null}}),this._registerKnownTextNodes(),[e,f]}_registerKnownTextNodes(){this._textNodesWithKnownTranslation={};const a=this;return this.$domNodes.knownTranslation.find(':not(iframe)').contents().each(function(){const b=$(this);!a._options.replaceDomNodeNames.includes(b.prop('nodeName').toLowerCase())&&b.Tools('text').trim()&&0===b.parents(a._options.replaceDomNodeNames.join()).length&&a.knownTranslation.hasOwnProperty(b.Tools('text').trim())&&(a._addTextNodeToFade(b),a._textNodesWithKnownTranslation[a.knownTranslation[b.prop('textContent').trim()]]=a._textNodesWithKnownTranslation.hasOwnProperty(a.knownTranslation[b.prop('textContent').trim()])?a._textNodesWithKnownTranslation[a.knownTranslation[b.prop('textContent').trim()]].add(b):b)}),this}_normalizeLanguage(a){for(const b in this._options.languageMapping)if(this._options.languageMapping.hasOwnProperty(b)&&(this._options.languageMapping[b].includes(b.toLowerCase())||this._options.languageMapping[b].push(b.toLowerCase()),this._options.languageMapping[b].includes(a.toLowerCase())))return b;return this._options.default}_determineUsefulLanguage(){let a;return this._options.initial?a=this._options.initial:'localStorage'in $.global&&$.global.localStorage.getItem(this._options.sessionDescription)?(a=$.global.localStorage.getItem(this._options.sessionDescription),this.debug('Determine "{1}", because of local storage information.',a)):'navigator'in $.global&&$.global.navigator.language?(a=$.global.navigator.language,this.debug('Determine "{1}", because of browser settings.',a)):(a=this._options.default,this.debug('Determine "{1}", because of default option.',a)),a=this._normalizeLanguage(a),this._options.selection.length&&!this._options.selection.includes(a)&&(this.debug('"{1}" isn\'t one of the allowed languages. Set language to "{2}".',a,this._options.selection[0]),a=this._options.selection[0]),'localStorage'in $.global&&$.global.localStorage.setItem(this._options.sessionDescription,a),a}_addTextNodeToFade(a){const b=a.parent();return this._$domNodeToFade=this._$domNodeToFade?this._$domNodeToFade.add(b):b,this}_registerTextNodeToChange(a,b,c,d){return this._addTextNodeToFade(a),b&&this._replacements.push({$textNodeToTranslate:a,$nodeToReplace:b,textToReplace:c[2],$currentLanguageDomNode:d}),this}_ensureLastTextNodeHavingLanguageIndicator(a,b,c){if(a&&!b){let d=this.currentLanguage;c&&(d=this._options.default),b=$(`<!--${d}-->`),a.after(b)}return b}_switchLanguage(a){for(const b of this._replacements){let c=b.$textNodeToTranslate.html();'#text'===b.$textNodeToTranslate.prop('nodeName')&&(c=b.$textNodeToTranslate.prop('textContent'));const d=c.trim();if(!this._options.templateDelimiter||!d.endsWith(this._options.templateDelimiter.post)&&this._options.templateDelimiter.post){let d=b.$currentLanguageDomNode;if(!b.$currentLanguageDomNode){d=$('body');let a=!1;b.$textNodeToTranslate.parent().contents().each(function(){return a?(b.$currentLanguageDomNode=d=$(this),!1):void(this===b.$textNodeToTranslate[0]&&(a=!0))})}const e=d.prop('textContent');a===e&&this.warn(`Text node "${b.textToReplace}" is marked `+`as "${e}" and has same translation `+'language as it already is.');const f=b.$nodeToReplace.prop('nodeName').toLowerCase();'#comment'===f?b.$textNodeToTranslate.after($(`<!--${e}:${c}-->`)):b.$textNodeToTranslate.after($(`<${f}>${e}:${c}</`+`${f}>`).hide()),b.$textNodeToTranslate.after($(`<!--${a}-->`)),'#text'===b.$textNodeToTranslate.prop('nodeName')?b.$textNodeToTranslate.prop('textContent',b.textToReplace):b.$textNodeToTranslate.html(b.textToReplace),d.remove(),b.$nodeToReplace.remove()}}for(const b in this._textNodesWithKnownTranslation)this._textNodesWithKnownTranslation.hasOwnProperty(b)&&this._textNodesWithKnownTranslation[b].prop('textContent',b);return'localStorage'in $.global&&$.global.localStorage.setItem(this._options.sessionDescription,a),this.currentLanguage=a,this}_switchCurrentLanguageIndicator(a){return $(`a[href="#${this._options.languageHashPrefix}`+`${this.currentLanguage}"].`+this._options.currentLanguageIndicatorClassName).removeClass(this._options.currentLanguageIndicatorClassName),$(`a[href="#${this._options.languageHashPrefix}${a}"]`).addClass(this._options.currentLanguageIndicatorClassName),this}}exports.default=Language,Language._name='Language',$.Language=function(...a){return $.Tools().controller(Language,a)},$.Language.class=Language;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ })
/******/ ]);
});

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(63);
__webpack_require__(64);
module.exports = __webpack_require__(65);


/***/ }),
/* 63 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 64 */
/***/ (function(module, exports) {

!function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var c="function"==typeof require&&require;if(!u&&c)return c(o,!0);if(i)return i(o,!0);var a=new Error("Cannot find module '"+o+"'");throw a.code="MODULE_NOT_FOUND",a}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(n){var r=t[o][1][n];return s(r||n)},f,f.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o]);return s}({1:[function(t,n,r){(function(n){"use strict";function define(t,n,e){t[n]||Object[r](t,n,{writable:!0,configurable:!0,value:e})}if(t(327),t(328),t(2),n._babelPolyfill)throw new Error("only one instance of babel-polyfill is allowed");n._babelPolyfill=!0;var r="defineProperty";define(String.prototype,"padLeft","".padStart),define(String.prototype,"padRight","".padEnd),"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach(function(t){[][t]&&define(Array,t,Function.call.bind([][t]))})}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{2:2,327:327,328:328}],2:[function(t,n,r){t(130),n.exports=t(23).RegExp.escape},{130:130,23:23}],3:[function(t,n,r){n.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},{}],4:[function(t,n,r){var e=t(18);n.exports=function(t,n){if("number"!=typeof t&&"Number"!=e(t))throw TypeError(n);return+t}},{18:18}],5:[function(t,n,r){var e=t(128)("unscopables"),i=Array.prototype;void 0==i[e]&&t(42)(i,e,{}),n.exports=function(t){i[e][t]=!0}},{128:128,42:42}],6:[function(t,n,r){n.exports=function(t,n,r,e){if(!(t instanceof n)||void 0!==e&&e in t)throw TypeError(r+": incorrect invocation!");return t}},{}],7:[function(t,n,r){var e=t(51);n.exports=function(t){if(!e(t))throw TypeError(t+" is not an object!");return t}},{51:51}],8:[function(t,n,r){"use strict";var e=t(119),i=t(114),o=t(118);n.exports=[].copyWithin||function copyWithin(t,n){var r=e(this),u=o(r.length),c=i(t,u),a=i(n,u),f=arguments.length>2?arguments[2]:void 0,s=Math.min((void 0===f?u:i(f,u))-a,u-c),l=1;for(a<c&&c<a+s&&(l=-1,a+=s-1,c+=s-1);s-- >0;)a in r?r[c]=r[a]:delete r[c],c+=l,a+=l;return r}},{114:114,118:118,119:119}],9:[function(t,n,r){"use strict";var e=t(119),i=t(114),o=t(118);n.exports=function fill(t){for(var n=e(this),r=o(n.length),u=arguments.length,c=i(u>1?arguments[1]:void 0,r),a=u>2?arguments[2]:void 0,f=void 0===a?r:i(a,r);f>c;)n[c++]=t;return n}},{114:114,118:118,119:119}],10:[function(t,n,r){var e=t(39);n.exports=function(t,n){var r=[];return e(t,!1,r.push,r,n),r}},{39:39}],11:[function(t,n,r){var e=t(117),i=t(118),o=t(114);n.exports=function(t){return function(n,r,u){var c,a=e(n),f=i(a.length),s=o(u,f);if(t&&r!=r){for(;f>s;)if((c=a[s++])!=c)return!0}else for(;f>s;s++)if((t||s in a)&&a[s]===r)return t||s||0;return!t&&-1}}},{114:114,117:117,118:118}],12:[function(t,n,r){var e=t(25),i=t(47),o=t(119),u=t(118),c=t(15);n.exports=function(t,n){var r=1==t,a=2==t,f=3==t,s=4==t,l=6==t,h=5==t||l,v=n||c;return function(n,c,p){for(var d,y,g=o(n),m=i(g),b=e(c,p,3),x=u(m.length),S=0,w=r?v(n,x):a?v(n,0):void 0;x>S;S++)if((h||S in m)&&(d=m[S],y=b(d,S,g),t))if(r)w[S]=y;else if(y)switch(t){case 3:return!0;case 5:return d;case 6:return S;case 2:w.push(d)}else if(s)return!1;return l?-1:f||s?s:w}}},{118:118,119:119,15:15,25:25,47:47}],13:[function(t,n,r){var e=t(3),i=t(119),o=t(47),u=t(118);n.exports=function(t,n,r,c,a){e(n);var f=i(t),s=o(f),l=u(f.length),h=a?l-1:0,v=a?-1:1;if(r<2)for(;;){if(h in s){c=s[h],h+=v;break}if(h+=v,a?h<0:l<=h)throw TypeError("Reduce of empty array with no initial value")}for(;a?h>=0:l>h;h+=v)h in s&&(c=n(c,s[h],h,f));return c}},{118:118,119:119,3:3,47:47}],14:[function(t,n,r){var e=t(51),i=t(49),o=t(128)("species");n.exports=function(t){var n;return i(t)&&(n=t.constructor,"function"!=typeof n||n!==Array&&!i(n.prototype)||(n=void 0),e(n)&&null===(n=n[o])&&(n=void 0)),void 0===n?Array:n}},{128:128,49:49,51:51}],15:[function(t,n,r){var e=t(14);n.exports=function(t,n){return new(e(t))(n)}},{14:14}],16:[function(t,n,r){"use strict";var e=t(3),i=t(51),o=t(46),u=[].slice,c={},a=function(t,n,r){if(!(n in c)){for(var e=[],i=0;i<n;i++)e[i]="a["+i+"]";c[n]=Function("F,a","return new F("+e.join(",")+")")}return c[n](t,r)};n.exports=Function.bind||function bind(t){var n=e(this),r=u.call(arguments,1),c=function(){var e=r.concat(u.call(arguments));return this instanceof c?a(n,e.length,e):o(n,e,t)};return i(n.prototype)&&(c.prototype=n.prototype),c}},{3:3,46:46,51:51}],17:[function(t,n,r){var e=t(18),i=t(128)("toStringTag"),o="Arguments"==e(function(){return arguments}()),u=function(t,n){try{return t[n]}catch(t){}};n.exports=function(t){var n,r,c;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(r=u(n=Object(t),i))?r:o?e(n):"Object"==(c=e(n))&&"function"==typeof n.callee?"Arguments":c}},{128:128,18:18}],18:[function(t,n,r){var e={}.toString;n.exports=function(t){return e.call(t).slice(8,-1)}},{}],19:[function(t,n,r){"use strict";var e=t(72).f,i=t(71),o=t(93),u=t(25),c=t(6),a=t(39),f=t(55),s=t(57),l=t(100),h=t(29),v=t(66).fastKey,p=t(125),d=h?"_s":"size",y=function(t,n){var r,e=v(n);if("F"!==e)return t._i[e];for(r=t._f;r;r=r.n)if(r.k==n)return r};n.exports={getConstructor:function(t,n,r,f){var s=t(function(t,e){c(t,s,n,"_i"),t._t=n,t._i=i(null),t._f=void 0,t._l=void 0,t[d]=0,void 0!=e&&a(e,r,t[f],t)});return o(s.prototype,{clear:function clear(){for(var t=p(this,n),r=t._i,e=t._f;e;e=e.n)e.r=!0,e.p&&(e.p=e.p.n=void 0),delete r[e.i];t._f=t._l=void 0,t[d]=0},delete:function(t){var r=p(this,n),e=y(r,t);if(e){var i=e.n,o=e.p;delete r._i[e.i],e.r=!0,o&&(o.n=i),i&&(i.p=o),r._f==e&&(r._f=i),r._l==e&&(r._l=o),r[d]--}return!!e},forEach:function forEach(t){p(this,n);for(var r,e=u(t,arguments.length>1?arguments[1]:void 0,3);r=r?r.n:this._f;)for(e(r.v,r.k,this);r&&r.r;)r=r.p},has:function has(t){return!!y(p(this,n),t)}}),h&&e(s.prototype,"size",{get:function(){return p(this,n)[d]}}),s},def:function(t,n,r){var e,i,o=y(t,n);return o?o.v=r:(t._l=o={i:i=v(n,!0),k:n,v:r,p:e=t._l,n:void 0,r:!1},t._f||(t._f=o),e&&(e.n=o),t[d]++,"F"!==i&&(t._i[i]=o)),t},getEntry:y,setStrong:function(t,n,r){f(t,n,function(t,r){this._t=p(t,n),this._k=r,this._l=void 0},function(){for(var t=this,n=t._k,r=t._l;r&&r.r;)r=r.p;return t._t&&(t._l=r=r?r.n:t._t._f)?"keys"==n?s(0,r.k):"values"==n?s(0,r.v):s(0,[r.k,r.v]):(t._t=void 0,s(1))},r?"entries":"values",!r,!0),l(n)}}},{100:100,125:125,25:25,29:29,39:39,55:55,57:57,6:6,66:66,71:71,72:72,93:93}],20:[function(t,n,r){var e=t(17),i=t(10);n.exports=function(t){return function toJSON(){if(e(this)!=t)throw TypeError(t+"#toJSON isn't generic");return i(this)}}},{10:10,17:17}],21:[function(t,n,r){"use strict";var e=t(93),i=t(66).getWeak,o=t(7),u=t(51),c=t(6),a=t(39),f=t(12),s=t(41),l=t(125),h=f(5),v=f(6),p=0,d=function(t){return t._l||(t._l=new y)},y=function(){this.a=[]},g=function(t,n){return h(t.a,function(t){return t[0]===n})};y.prototype={get:function(t){var n=g(this,t);if(n)return n[1]},has:function(t){return!!g(this,t)},set:function(t,n){var r=g(this,t);r?r[1]=n:this.a.push([t,n])},delete:function(t){var n=v(this.a,function(n){return n[0]===t});return~n&&this.a.splice(n,1),!!~n}},n.exports={getConstructor:function(t,n,r,o){var f=t(function(t,e){c(t,f,n,"_i"),t._t=n,t._i=p++,t._l=void 0,void 0!=e&&a(e,r,t[o],t)});return e(f.prototype,{delete:function(t){if(!u(t))return!1;var r=i(t);return!0===r?d(l(this,n)).delete(t):r&&s(r,this._i)&&delete r[this._i]},has:function has(t){if(!u(t))return!1;var r=i(t);return!0===r?d(l(this,n)).has(t):r&&s(r,this._i)}}),f},def:function(t,n,r){var e=i(o(n),!0);return!0===e?d(t).set(n,r):e[t._i]=r,t},ufstore:d}},{12:12,125:125,39:39,41:41,51:51,6:6,66:66,7:7,93:93}],22:[function(t,n,r){"use strict";var e=t(40),i=t(33),o=t(94),u=t(93),c=t(66),a=t(39),f=t(6),s=t(51),l=t(35),h=t(56),v=t(101),p=t(45);n.exports=function(t,n,r,d,y,g){var m=e[t],b=m,x=y?"set":"add",S=b&&b.prototype,w={},_=function(t){var n=S[t];o(S,t,"delete"==t?function(t){return!(g&&!s(t))&&n.call(this,0===t?0:t)}:"has"==t?function has(t){return!(g&&!s(t))&&n.call(this,0===t?0:t)}:"get"==t?function get(t){return g&&!s(t)?void 0:n.call(this,0===t?0:t)}:"add"==t?function add(t){return n.call(this,0===t?0:t),this}:function set(t,r){return n.call(this,0===t?0:t,r),this})};if("function"==typeof b&&(g||S.forEach&&!l(function(){(new b).entries().next()}))){var E=new b,O=E[x](g?{}:-0,1)!=E,P=l(function(){E.has(1)}),M=h(function(t){new b(t)}),F=!g&&l(function(){for(var t=new b,n=5;n--;)t[x](n,n);return!t.has(-0)});M||(b=n(function(n,r){f(n,b,t);var e=p(new m,n,b);return void 0!=r&&a(r,y,e[x],e),e}),b.prototype=S,S.constructor=b),(P||F)&&(_("delete"),_("has"),y&&_("get")),(F||O)&&_(x),g&&S.clear&&delete S.clear}else b=d.getConstructor(n,t,y,x),u(b.prototype,r),c.NEED=!0;return v(b,t),w[t]=b,i(i.G+i.W+i.F*(b!=m),w),g||d.setStrong(b,t,y),b}},{101:101,33:33,35:35,39:39,40:40,45:45,51:51,56:56,6:6,66:66,93:93,94:94}],23:[function(t,n,r){var e=n.exports={version:"2.5.0"};"number"==typeof __e&&(__e=e)},{}],24:[function(t,n,r){"use strict";var e=t(72),i=t(92);n.exports=function(t,n,r){n in t?e.f(t,n,i(0,r)):t[n]=r}},{72:72,92:92}],25:[function(t,n,r){var e=t(3);n.exports=function(t,n,r){if(e(t),void 0===n)return t;switch(r){case 1:return function(r){return t.call(n,r)};case 2:return function(r,e){return t.call(n,r,e)};case 3:return function(r,e,i){return t.call(n,r,e,i)}}return function(){return t.apply(n,arguments)}}},{3:3}],26:[function(t,n,r){"use strict";var e=t(35),i=Date.prototype.getTime,o=Date.prototype.toISOString,u=function(t){return t>9?t:"0"+t};n.exports=e(function(){return"0385-07-25T07:06:39.999Z"!=o.call(new Date(-5e13-1))})||!e(function(){o.call(new Date(NaN))})?function toISOString(){if(!isFinite(i.call(this)))throw RangeError("Invalid time value");var t=this,n=t.getUTCFullYear(),r=t.getUTCMilliseconds(),e=n<0?"-":n>9999?"+":"";return e+("00000"+Math.abs(n)).slice(e?-6:-4)+"-"+u(t.getUTCMonth()+1)+"-"+u(t.getUTCDate())+"T"+u(t.getUTCHours())+":"+u(t.getUTCMinutes())+":"+u(t.getUTCSeconds())+"."+(r>99?r:"0"+u(r))+"Z"}:o},{35:35}],27:[function(t,n,r){"use strict";var e=t(7),i=t(120);n.exports=function(t){if("string"!==t&&"number"!==t&&"default"!==t)throw TypeError("Incorrect hint");return i(e(this),"number"!=t)}},{120:120,7:7}],28:[function(t,n,r){n.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},{}],29:[function(t,n,r){n.exports=!t(35)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},{35:35}],30:[function(t,n,r){var e=t(51),i=t(40).document,o=e(i)&&e(i.createElement);n.exports=function(t){return o?i.createElement(t):{}}},{40:40,51:51}],31:[function(t,n,r){n.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},{}],32:[function(t,n,r){var e=t(81),i=t(78),o=t(82);n.exports=function(t){var n=e(t),r=i.f;if(r)for(var u,c=r(t),a=o.f,f=0;c.length>f;)a.call(t,u=c[f++])&&n.push(u);return n}},{78:78,81:81,82:82}],33:[function(t,n,r){var e=t(40),i=t(23),o=t(42),u=t(94),c=t(25),a=function(t,n,r){var f,s,l,h,v=t&a.F,p=t&a.G,d=t&a.S,y=t&a.P,g=t&a.B,m=p?e:d?e[n]||(e[n]={}):(e[n]||{}).prototype,b=p?i:i[n]||(i[n]={}),x=b.prototype||(b.prototype={});p&&(r=n);for(f in r)s=!v&&m&&void 0!==m[f],l=(s?m:r)[f],h=g&&s?c(l,e):y&&"function"==typeof l?c(Function.call,l):l,m&&u(m,f,l,t&a.U),b[f]!=l&&o(b,f,h),y&&x[f]!=l&&(x[f]=l)};e.core=i,a.F=1,a.G=2,a.S=4,a.P=8,a.B=16,a.W=32,a.U=64,a.R=128,n.exports=a},{23:23,25:25,40:40,42:42,94:94}],34:[function(t,n,r){var e=t(128)("match");n.exports=function(t){var n=/./;try{"/./"[t](n)}catch(r){try{return n[e]=!1,!"/./"[t](n)}catch(t){}}return!0}},{128:128}],35:[function(t,n,r){n.exports=function(t){try{return!!t()}catch(t){return!0}}},{}],36:[function(t,n,r){"use strict";var e=t(42),i=t(94),o=t(35),u=t(28),c=t(128);n.exports=function(t,n,r){var a=c(t),f=r(u,a,""[t]),s=f[0],l=f[1];o(function(){var n={};return n[a]=function(){return 7},7!=""[t](n)})&&(i(String.prototype,t,s),e(RegExp.prototype,a,2==n?function(t,n){return l.call(t,this,n)}:function(t){return l.call(t,this)}))}},{128:128,28:28,35:35,42:42,94:94}],37:[function(t,n,r){"use strict";var e=t(7);n.exports=function(){var t=e(this),n="";return t.global&&(n+="g"),t.ignoreCase&&(n+="i"),t.multiline&&(n+="m"),t.unicode&&(n+="u"),t.sticky&&(n+="y"),n}},{7:7}],38:[function(t,n,r){"use strict";function flattenIntoArray(t,n,r,a,f,s,l,h){for(var v,p,d=f,y=0,g=!!l&&u(l,h,3);y<a;){if(y in r){if(v=g?g(r[y],y,n):r[y],p=!1,i(v)&&(p=v[c],p=void 0!==p?!!p:e(v)),p&&s>0)d=flattenIntoArray(t,n,v,o(v.length),d,s-1)-1;else{if(d>=9007199254740991)throw TypeError();t[d]=v}d++}y++}return d}var e=t(49),i=t(51),o=t(118),u=t(25),c=t(128)("isConcatSpreadable");n.exports=flattenIntoArray},{118:118,128:128,25:25,49:49,51:51}],39:[function(t,n,r){var e=t(25),i=t(53),o=t(48),u=t(7),c=t(118),a=t(129),f={},s={},r=n.exports=function(t,n,r,l,h){var v,p,d,y,g=h?function(){return t}:a(t),m=e(r,l,n?2:1),b=0;if("function"!=typeof g)throw TypeError(t+" is not iterable!");if(o(g)){for(v=c(t.length);v>b;b++)if((y=n?m(u(p=t[b])[0],p[1]):m(t[b]))===f||y===s)return y}else for(d=g.call(t);!(p=d.next()).done;)if((y=i(d,m,p.value,n))===f||y===s)return y};r.BREAK=f,r.RETURN=s},{118:118,129:129,25:25,48:48,53:53,7:7}],40:[function(t,n,r){var e=n.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=e)},{}],41:[function(t,n,r){var e={}.hasOwnProperty;n.exports=function(t,n){return e.call(t,n)}},{}],42:[function(t,n,r){var e=t(72),i=t(92);n.exports=t(29)?function(t,n,r){return e.f(t,n,i(1,r))}:function(t,n,r){return t[n]=r,t}},{29:29,72:72,92:92}],43:[function(t,n,r){var e=t(40).document;n.exports=e&&e.documentElement},{40:40}],44:[function(t,n,r){n.exports=!t(29)&&!t(35)(function(){return 7!=Object.defineProperty(t(30)("div"),"a",{get:function(){return 7}}).a})},{29:29,30:30,35:35}],45:[function(t,n,r){var e=t(51),i=t(99).set;n.exports=function(t,n,r){var o,u=n.constructor;return u!==r&&"function"==typeof u&&(o=u.prototype)!==r.prototype&&e(o)&&i&&i(t,o),t}},{51:51,99:99}],46:[function(t,n,r){n.exports=function(t,n,r){var e=void 0===r;switch(n.length){case 0:return e?t():t.call(r);case 1:return e?t(n[0]):t.call(r,n[0]);case 2:return e?t(n[0],n[1]):t.call(r,n[0],n[1]);case 3:return e?t(n[0],n[1],n[2]):t.call(r,n[0],n[1],n[2]);case 4:return e?t(n[0],n[1],n[2],n[3]):t.call(r,n[0],n[1],n[2],n[3])}return t.apply(r,n)}},{}],47:[function(t,n,r){var e=t(18);n.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==e(t)?t.split(""):Object(t)}},{18:18}],48:[function(t,n,r){var e=t(58),i=t(128)("iterator"),o=Array.prototype;n.exports=function(t){return void 0!==t&&(e.Array===t||o[i]===t)}},{128:128,58:58}],49:[function(t,n,r){var e=t(18);n.exports=Array.isArray||function isArray(t){return"Array"==e(t)}},{18:18}],50:[function(t,n,r){var e=t(51),i=Math.floor;n.exports=function isInteger(t){return!e(t)&&isFinite(t)&&i(t)===t}},{51:51}],51:[function(t,n,r){n.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},{}],52:[function(t,n,r){var e=t(51),i=t(18),o=t(128)("match");n.exports=function(t){var n;return e(t)&&(void 0!==(n=t[o])?!!n:"RegExp"==i(t))}},{128:128,18:18,51:51}],53:[function(t,n,r){var e=t(7);n.exports=function(t,n,r,i){try{return i?n(e(r)[0],r[1]):n(r)}catch(n){var o=t.return;throw void 0!==o&&e(o.call(t)),n}}},{7:7}],54:[function(t,n,r){"use strict";var e=t(71),i=t(92),o=t(101),u={};t(42)(u,t(128)("iterator"),function(){return this}),n.exports=function(t,n,r){t.prototype=e(u,{next:i(1,r)}),o(t,n+" Iterator")}},{101:101,128:128,42:42,71:71,92:92}],55:[function(t,n,r){"use strict";var e=t(60),i=t(33),o=t(94),u=t(42),c=t(41),a=t(58),f=t(54),s=t(101),l=t(79),h=t(128)("iterator"),v=!([].keys&&"next"in[].keys()),p=function(){return this};n.exports=function(t,n,r,d,y,g,m){f(r,n,d);var b,x,S,w=function(t){if(!v&&t in P)return P[t];switch(t){case"keys":return function keys(){return new r(this,t)};case"values":return function values(){return new r(this,t)}}return function entries(){return new r(this,t)}},_=n+" Iterator",E="values"==y,O=!1,P=t.prototype,M=P[h]||P["@@iterator"]||y&&P[y],F=M||w(y),I=y?E?w("entries"):F:void 0,A="Array"==n?P.entries||M:M;if(A&&(S=l(A.call(new t)))!==Object.prototype&&S.next&&(s(S,_,!0),e||c(S,h)||u(S,h,p)),E&&M&&"values"!==M.name&&(O=!0,F=function values(){return M.call(this)}),e&&!m||!v&&!O&&P[h]||u(P,h,F),a[n]=F,a[_]=p,y)if(b={values:E?F:w("values"),keys:g?F:w("keys"),entries:I},m)for(x in b)x in P||o(P,x,b[x]);else i(i.P+i.F*(v||O),n,b);return b}},{101:101,128:128,33:33,41:41,42:42,54:54,58:58,60:60,79:79,94:94}],56:[function(t,n,r){var e=t(128)("iterator"),i=!1;try{var o=[7][e]();o.return=function(){i=!0},Array.from(o,function(){throw 2})}catch(t){}n.exports=function(t,n){if(!n&&!i)return!1;var r=!1;try{var o=[7],u=o[e]();u.next=function(){return{done:r=!0}},o[e]=function(){return u},t(o)}catch(t){}return r}},{128:128}],57:[function(t,n,r){n.exports=function(t,n){return{value:n,done:!!t}}},{}],58:[function(t,n,r){n.exports={}},{}],59:[function(t,n,r){var e=t(81),i=t(117);n.exports=function(t,n){for(var r,o=i(t),u=e(o),c=u.length,a=0;c>a;)if(o[r=u[a++]]===n)return r}},{117:117,81:81}],60:[function(t,n,r){n.exports=!1},{}],61:[function(t,n,r){var e=Math.expm1;n.exports=!e||e(10)>22025.465794806718||e(10)<22025.465794806718||-2e-17!=e(-2e-17)?function expm1(t){return 0==(t=+t)?t:t>-1e-6&&t<1e-6?t+t*t/2:Math.exp(t)-1}:e},{}],62:[function(t,n,r){var e=t(65),i=Math.pow,o=i(2,-52),u=i(2,-23),c=i(2,127)*(2-u),a=i(2,-126),f=function(t){return t+1/o-1/o};n.exports=Math.fround||function fround(t){var n,r,i=Math.abs(t),s=e(t);return i<a?s*f(i/a/u)*a*u:(n=(1+u/o)*i,r=n-(n-i),r>c||r!=r?s*(1/0):s*r)}},{65:65}],63:[function(t,n,r){n.exports=Math.log1p||function log1p(t){return(t=+t)>-1e-8&&t<1e-8?t-t*t/2:Math.log(1+t)}},{}],64:[function(t,n,r){n.exports=Math.scale||function scale(t,n,r,e,i){return 0===arguments.length||t!=t||n!=n||r!=r||e!=e||i!=i?NaN:t===1/0||t===-1/0?t:(t-n)*(i-e)/(r-n)+e}},{}],65:[function(t,n,r){n.exports=Math.sign||function sign(t){return 0==(t=+t)||t!=t?t:t<0?-1:1}},{}],66:[function(t,n,r){var e=t(124)("meta"),i=t(51),o=t(41),u=t(72).f,c=0,a=Object.isExtensible||function(){return!0},f=!t(35)(function(){return a(Object.preventExtensions({}))}),s=function(t){u(t,e,{value:{i:"O"+ ++c,w:{}}})},l=function(t,n){if(!i(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!o(t,e)){if(!a(t))return"F";if(!n)return"E";s(t)}return t[e].i},h=function(t,n){if(!o(t,e)){if(!a(t))return!0;if(!n)return!1;s(t)}return t[e].w},v=function(t){return f&&p.NEED&&a(t)&&!o(t,e)&&s(t),t},p=n.exports={KEY:e,NEED:!1,fastKey:l,getWeak:h,onFreeze:v}},{124:124,35:35,41:41,51:51,72:72}],67:[function(t,n,r){var e=t(160),i=t(33),o=t(103)("metadata"),u=o.store||(o.store=new(t(266))),c=function(t,n,r){var i=u.get(t);if(!i){if(!r)return;u.set(t,i=new e)}var o=i.get(n);if(!o){if(!r)return;i.set(n,o=new e)}return o},a=function(t,n,r){var e=c(n,r,!1);return void 0!==e&&e.has(t)},f=function(t,n,r){var e=c(n,r,!1);return void 0===e?void 0:e.get(t)},s=function(t,n,r,e){c(r,e,!0).set(t,n)},l=function(t,n){var r=c(t,n,!1),e=[];return r&&r.forEach(function(t,n){e.push(n)}),e},h=function(t){return void 0===t||"symbol"==typeof t?t:String(t)},v=function(t){i(i.S,"Reflect",t)};n.exports={store:u,map:c,has:a,get:f,set:s,keys:l,key:h,exp:v}},{103:103,160:160,266:266,33:33}],68:[function(t,n,r){var e=t(40),i=t(113).set,o=e.MutationObserver||e.WebKitMutationObserver,u=e.process,c=e.Promise,a="process"==t(18)(u);n.exports=function(){var t,n,r,f=function(){var e,i;for(a&&(e=u.domain)&&e.exit();t;){i=t.fn,t=t.next;try{i()}catch(e){throw t?r():n=void 0,e}}n=void 0,e&&e.enter()};if(a)r=function(){u.nextTick(f)};else if(o){var s=!0,l=document.createTextNode("");new o(f).observe(l,{characterData:!0}),r=function(){l.data=s=!s}}else if(c&&c.resolve){var h=c.resolve();r=function(){h.then(f)}}else r=function(){i.call(e,f)};return function(e){var i={fn:e,next:void 0};n&&(n.next=i),t||(t=i,r()),n=i}}},{113:113,18:18,40:40}],69:[function(t,n,r){"use strict";function PromiseCapability(t){var n,r;this.promise=new t(function(t,e){if(void 0!==n||void 0!==r)throw TypeError("Bad Promise constructor");n=t,r=e}),this.resolve=e(n),this.reject=e(r)}var e=t(3);n.exports.f=function(t){return new PromiseCapability(t)}},{3:3}],70:[function(t,n,r){"use strict";var e=t(81),i=t(78),o=t(82),u=t(119),c=t(47),a=Object.assign;n.exports=!a||t(35)(function(){var t={},n={},r=Symbol(),e="abcdefghijklmnopqrst";return t[r]=7,e.split("").forEach(function(t){n[t]=t}),7!=a({},t)[r]||Object.keys(a({},n)).join("")!=e})?function assign(t,n){for(var r=u(t),a=arguments.length,f=1,s=i.f,l=o.f;a>f;)for(var h,v=c(arguments[f++]),p=s?e(v).concat(s(v)):e(v),d=p.length,y=0;d>y;)l.call(v,h=p[y++])&&(r[h]=v[h]);return r}:a},{119:119,35:35,47:47,78:78,81:81,82:82}],71:[function(t,n,r){var e=t(7),i=t(73),o=t(31),u=t(102)("IE_PROTO"),c=function(){},a=function(){var n,r=t(30)("iframe"),e=o.length;for(r.style.display="none",t(43).appendChild(r),r.src="javascript:",n=r.contentWindow.document,n.open(),n.write("<script>document.F=Object<\/script>"),n.close(),a=n.F;e--;)delete a.prototype[o[e]];return a()};n.exports=Object.create||function create(t,n){var r;return null!==t?(c.prototype=e(t),r=new c,c.prototype=null,r[u]=t):r=a(),void 0===n?r:i(r,n)}},{102:102,30:30,31:31,43:43,7:7,73:73}],72:[function(t,n,r){var e=t(7),i=t(44),o=t(120),u=Object.defineProperty;r.f=t(29)?Object.defineProperty:function defineProperty(t,n,r){if(e(t),n=o(n,!0),e(r),i)try{return u(t,n,r)}catch(t){}if("get"in r||"set"in r)throw TypeError("Accessors not supported!");return"value"in r&&(t[n]=r.value),t}},{120:120,29:29,44:44,7:7}],73:[function(t,n,r){var e=t(72),i=t(7),o=t(81);n.exports=t(29)?Object.defineProperties:function defineProperties(t,n){i(t);for(var r,u=o(n),c=u.length,a=0;c>a;)e.f(t,r=u[a++],n[r]);return t}},{29:29,7:7,72:72,81:81}],74:[function(t,n,r){"use strict";n.exports=t(60)||!t(35)(function(){var n=Math.random();__defineSetter__.call(null,n,function(){}),delete t(40)[n]})},{35:35,40:40,60:60}],75:[function(t,n,r){var e=t(82),i=t(92),o=t(117),u=t(120),c=t(41),a=t(44),f=Object.getOwnPropertyDescriptor;r.f=t(29)?f:function getOwnPropertyDescriptor(t,n){if(t=o(t),n=u(n,!0),a)try{return f(t,n)}catch(t){}if(c(t,n))return i(!e.f.call(t,n),t[n])}},{117:117,120:120,29:29,41:41,44:44,82:82,92:92}],76:[function(t,n,r){var e=t(117),i=t(77).f,o={}.toString,u="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],c=function(t){try{return i(t)}catch(t){return u.slice()}};n.exports.f=function getOwnPropertyNames(t){return u&&"[object Window]"==o.call(t)?c(t):i(e(t))}},{117:117,77:77}],77:[function(t,n,r){var e=t(80),i=t(31).concat("length","prototype");r.f=Object.getOwnPropertyNames||function getOwnPropertyNames(t){return e(t,i)}},{31:31,80:80}],78:[function(t,n,r){r.f=Object.getOwnPropertySymbols},{}],79:[function(t,n,r){var e=t(41),i=t(119),o=t(102)("IE_PROTO"),u=Object.prototype;n.exports=Object.getPrototypeOf||function(t){return t=i(t),e(t,o)?t[o]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?u:null}},{102:102,119:119,41:41}],80:[function(t,n,r){var e=t(41),i=t(117),o=t(11)(!1),u=t(102)("IE_PROTO");n.exports=function(t,n){var r,c=i(t),a=0,f=[];for(r in c)r!=u&&e(c,r)&&f.push(r);for(;n.length>a;)e(c,r=n[a++])&&(~o(f,r)||f.push(r));return f}},{102:102,11:11,117:117,41:41}],81:[function(t,n,r){var e=t(80),i=t(31);n.exports=Object.keys||function keys(t){return e(t,i)}},{31:31,80:80}],82:[function(t,n,r){r.f={}.propertyIsEnumerable},{}],83:[function(t,n,r){var e=t(33),i=t(23),o=t(35);n.exports=function(t,n){var r=(i.Object||{})[t]||Object[t],u={};u[t]=n(r),e(e.S+e.F*o(function(){r(1)}),"Object",u)}},{23:23,33:33,35:35}],84:[function(t,n,r){var e=t(81),i=t(117),o=t(82).f;n.exports=function(t){return function(n){for(var r,u=i(n),c=e(u),a=c.length,f=0,s=[];a>f;)o.call(u,r=c[f++])&&s.push(t?[r,u[r]]:u[r]);return s}}},{117:117,81:81,82:82}],85:[function(t,n,r){var e=t(77),i=t(78),o=t(7),u=t(40).Reflect;n.exports=u&&u.ownKeys||function ownKeys(t){var n=e.f(o(t)),r=i.f;return r?n.concat(r(t)):n}},{40:40,7:7,77:77,78:78}],86:[function(t,n,r){var e=t(40).parseFloat,i=t(111).trim;n.exports=1/e(t(112)+"-0")!=-1/0?function parseFloat(t){var n=i(String(t),3),r=e(n);return 0===r&&"-"==n.charAt(0)?-0:r}:e},{111:111,112:112,40:40}],87:[function(t,n,r){var e=t(40).parseInt,i=t(111).trim,o=t(112),u=/^[-+]?0[xX]/;n.exports=8!==e(o+"08")||22!==e(o+"0x16")?function parseInt(t,n){var r=i(String(t),3);return e(r,n>>>0||(u.test(r)?16:10))}:e},{111:111,112:112,40:40}],88:[function(t,n,r){"use strict";var e=t(89),i=t(46),o=t(3);n.exports=function(){for(var t=o(this),n=arguments.length,r=Array(n),u=0,c=e._,a=!1;n>u;)(r[u]=arguments[u++])===c&&(a=!0);return function(){var e,o=this,u=arguments.length,f=0,s=0;if(!a&&!u)return i(t,r,o);if(e=r.slice(),a)for(;n>f;f++)e[f]===c&&(e[f]=arguments[s++]);for(;u>s;)e.push(arguments[s++]);return i(t,e,o)}}},{3:3,46:46,89:89}],89:[function(t,n,r){n.exports=t(40)},{40:40}],90:[function(t,n,r){n.exports=function(t){try{return{e:!1,v:t()}}catch(t){return{e:!0,v:t}}}},{}],91:[function(t,n,r){var e=t(69);n.exports=function(t,n){var r=e.f(t);return(0,r.resolve)(n),r.promise}},{69:69}],92:[function(t,n,r){n.exports=function(t,n){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:n}}},{}],93:[function(t,n,r){var e=t(94);n.exports=function(t,n,r){for(var i in n)e(t,i,n[i],r);return t}},{94:94}],94:[function(t,n,r){var e=t(40),i=t(42),o=t(41),u=t(124)("src"),c=Function.toString,a=(""+c).split("toString");t(23).inspectSource=function(t){return c.call(t)},(n.exports=function(t,n,r,c){var f="function"==typeof r;f&&(o(r,"name")||i(r,"name",n)),t[n]!==r&&(f&&(o(r,u)||i(r,u,t[n]?""+t[n]:a.join(String(n)))),t===e?t[n]=r:c?t[n]?t[n]=r:i(t,n,r):(delete t[n],i(t,n,r)))})(Function.prototype,"toString",function toString(){return"function"==typeof this&&this[u]||c.call(this)})},{124:124,23:23,40:40,41:41,42:42}],95:[function(t,n,r){n.exports=function(t,n){var r=n===Object(n)?function(t){return n[t]}:n;return function(n){return String(n).replace(t,r)}}},{}],96:[function(t,n,r){n.exports=Object.is||function is(t,n){return t===n?0!==t||1/t==1/n:t!=t&&n!=n}},{}],97:[function(t,n,r){"use strict";var e=t(33),i=t(3),o=t(25),u=t(39);n.exports=function(t){e(e.S,t,{from:function from(t){var n,r,e,c,a=arguments[1];return i(this),n=void 0!==a,n&&i(a),void 0==t?new this:(r=[],n?(e=0,c=o(a,arguments[2],2),u(t,!1,function(t){r.push(c(t,e++))})):u(t,!1,r.push,r),new this(r))}})}},{25:25,3:3,33:33,39:39}],98:[function(t,n,r){"use strict";var e=t(33);n.exports=function(t){e(e.S,t,{of:function of(){for(var t=arguments.length,n=Array(t);t--;)n[t]=arguments[t];return new this(n)}})}},{33:33}],99:[function(t,n,r){var e=t(51),i=t(7),o=function(t,n){if(i(t),!e(n)&&null!==n)throw TypeError(n+": can't set as prototype!")};n.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(n,r,e){try{e=t(25)(Function.call,t(75).f(Object.prototype,"__proto__").set,2),e(n,[]),r=!(n instanceof Array)}catch(t){r=!0}return function setPrototypeOf(t,n){return o(t,n),r?t.__proto__=n:e(t,n),t}}({},!1):void 0),check:o}},{25:25,51:51,7:7,75:75}],100:[function(t,n,r){"use strict";var e=t(40),i=t(72),o=t(29),u=t(128)("species");n.exports=function(t){var n=e[t];o&&n&&!n[u]&&i.f(n,u,{configurable:!0,get:function(){return this}})}},{128:128,29:29,40:40,72:72}],101:[function(t,n,r){var e=t(72).f,i=t(41),o=t(128)("toStringTag");n.exports=function(t,n,r){t&&!i(t=r?t:t.prototype,o)&&e(t,o,{configurable:!0,value:n})}},{128:128,41:41,72:72}],102:[function(t,n,r){var e=t(103)("keys"),i=t(124);n.exports=function(t){return e[t]||(e[t]=i(t))}},{103:103,124:124}],103:[function(t,n,r){var e=t(40),i=e["__core-js_shared__"]||(e["__core-js_shared__"]={});n.exports=function(t){return i[t]||(i[t]={})}},{40:40}],104:[function(t,n,r){var e=t(7),i=t(3),o=t(128)("species");n.exports=function(t,n){var r,u=e(t).constructor;return void 0===u||void 0==(r=e(u)[o])?n:i(r)}},{128:128,3:3,7:7}],105:[function(t,n,r){"use strict";var e=t(35);n.exports=function(t,n){return!!t&&e(function(){n?t.call(null,function(){},1):t.call(null)})}},{35:35}],106:[function(t,n,r){var e=t(116),i=t(28);n.exports=function(t){return function(n,r){var o,u,c=String(i(n)),a=e(r),f=c.length;return a<0||a>=f?t?"":void 0:(o=c.charCodeAt(a),o<55296||o>56319||a+1===f||(u=c.charCodeAt(a+1))<56320||u>57343?t?c.charAt(a):o:t?c.slice(a,a+2):u-56320+(o-55296<<10)+65536)}}},{116:116,28:28}],107:[function(t,n,r){var e=t(52),i=t(28);n.exports=function(t,n,r){if(e(n))throw TypeError("String#"+r+" doesn't accept regex!");return String(i(t))}},{28:28,52:52}],108:[function(t,n,r){var e=t(33),i=t(35),o=t(28),u=/"/g,c=function(t,n,r,e){var i=String(o(t)),c="<"+n;return""!==r&&(c+=" "+r+'="'+String(e).replace(u,"&quot;")+'"'),c+">"+i+"</"+n+">"};n.exports=function(t,n){var r={};r[t]=n(c),e(e.P+e.F*i(function(){var n=""[t]('"');return n!==n.toLowerCase()||n.split('"').length>3}),"String",r)}},{28:28,33:33,35:35}],109:[function(t,n,r){var e=t(118),i=t(110),o=t(28);n.exports=function(t,n,r,u){var c=String(o(t)),a=c.length,f=void 0===r?" ":String(r),s=e(n);if(s<=a||""==f)return c;var l=s-a,h=i.call(f,Math.ceil(l/f.length));return h.length>l&&(h=h.slice(0,l)),u?h+c:c+h}},{110:110,118:118,28:28}],110:[function(t,n,r){"use strict";var e=t(116),i=t(28);n.exports=function repeat(t){var n=String(i(this)),r="",o=e(t);if(o<0||o==1/0)throw RangeError("Count can't be negative");for(;o>0;(o>>>=1)&&(n+=n))1&o&&(r+=n);return r}},{116:116,28:28}],111:[function(t,n,r){var e=t(33),i=t(28),o=t(35),u=t(112),c="["+u+"]",a="​",f=RegExp("^"+c+c+"*"),s=RegExp(c+c+"*$"),l=function(t,n,r){var i={},c=o(function(){return!!u[t]()||a[t]()!=a}),f=i[t]=c?n(h):u[t];r&&(i[r]=f),e(e.P+e.F*c,"String",i)},h=l.trim=function(t,n){return t=String(i(t)),1&n&&(t=t.replace(f,"")),2&n&&(t=t.replace(s,"")),t};n.exports=l},{112:112,28:28,33:33,35:35}],112:[function(t,n,r){n.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"},{}],113:[function(t,n,r){var e,i,o,u=t(25),c=t(46),a=t(43),f=t(30),s=t(40),l=s.process,h=s.setImmediate,v=s.clearImmediate,p=s.MessageChannel,d=s.Dispatch,y=0,g={},m=function(){var t=+this;if(g.hasOwnProperty(t)){var n=g[t];delete g[t],n()}},b=function(t){m.call(t.data)};h&&v||(h=function setImmediate(t){for(var n=[],r=1;arguments.length>r;)n.push(arguments[r++]);return g[++y]=function(){c("function"==typeof t?t:Function(t),n)},e(y),y},v=function clearImmediate(t){delete g[t]},"process"==t(18)(l)?e=function(t){l.nextTick(u(m,t,1))}:d&&d.now?e=function(t){d.now(u(m,t,1))}:p?(i=new p,o=i.port2,i.port1.onmessage=b,e=u(o.postMessage,o,1)):s.addEventListener&&"function"==typeof postMessage&&!s.importScripts?(e=function(t){s.postMessage(t+"","*")},s.addEventListener("message",b,!1)):e="onreadystatechange"in f("script")?function(t){a.appendChild(f("script")).onreadystatechange=function(){a.removeChild(this),m.call(t)}}:function(t){setTimeout(u(m,t,1),0)}),n.exports={set:h,clear:v}},{18:18,25:25,30:30,40:40,43:43,46:46}],114:[function(t,n,r){var e=t(116),i=Math.max,o=Math.min;n.exports=function(t,n){return t=e(t),t<0?i(t+n,0):o(t,n)}},{116:116}],115:[function(t,n,r){var e=t(116),i=t(118);n.exports=function(t){if(void 0===t)return 0;var n=e(t),r=i(n);if(n!==r)throw RangeError("Wrong length!");return r}},{116:116,118:118}],116:[function(t,n,r){var e=Math.ceil,i=Math.floor;n.exports=function(t){return isNaN(t=+t)?0:(t>0?i:e)(t)}},{}],117:[function(t,n,r){var e=t(47),i=t(28);n.exports=function(t){return e(i(t))}},{28:28,47:47}],118:[function(t,n,r){var e=t(116),i=Math.min;n.exports=function(t){return t>0?i(e(t),9007199254740991):0}},{116:116}],
119:[function(t,n,r){var e=t(28);n.exports=function(t){return Object(e(t))}},{28:28}],120:[function(t,n,r){var e=t(51);n.exports=function(t,n){if(!e(t))return t;var r,i;if(n&&"function"==typeof(r=t.toString)&&!e(i=r.call(t)))return i;if("function"==typeof(r=t.valueOf)&&!e(i=r.call(t)))return i;if(!n&&"function"==typeof(r=t.toString)&&!e(i=r.call(t)))return i;throw TypeError("Can't convert object to primitive value")}},{51:51}],121:[function(t,n,r){"use strict";if(t(29)){var e=t(60),i=t(40),o=t(35),u=t(33),c=t(123),a=t(122),f=t(25),s=t(6),l=t(92),h=t(42),v=t(93),p=t(116),d=t(118),y=t(115),g=t(114),m=t(120),b=t(41),x=t(17),S=t(51),w=t(119),_=t(48),E=t(71),O=t(79),P=t(77).f,M=t(129),F=t(124),I=t(128),A=t(12),k=t(11),N=t(104),j=t(141),T=t(58),R=t(56),L=t(100),G=t(9),D=t(8),C=t(72),W=t(75),U=C.f,B=W.f,V=i.RangeError,z=i.TypeError,q=i.Uint8Array,K=Array.prototype,Y=a.ArrayBuffer,J=a.DataView,H=A(0),X=A(2),$=A(3),Z=A(4),Q=A(5),tt=A(6),nt=k(!0),rt=k(!1),et=j.values,it=j.keys,ot=j.entries,ut=K.lastIndexOf,ct=K.reduce,at=K.reduceRight,ft=K.join,st=K.sort,lt=K.slice,ht=K.toString,vt=K.toLocaleString,pt=I("iterator"),dt=I("toStringTag"),yt=F("typed_constructor"),gt=F("def_constructor"),mt=c.CONSTR,bt=c.TYPED,xt=c.VIEW,St=A(1,function(t,n){return Pt(N(t,t[gt]),n)}),wt=o(function(){return 1===new q(new Uint16Array([1]).buffer)[0]}),_t=!!q&&!!q.prototype.set&&o(function(){new q(1).set({})}),Et=function(t,n){var r=p(t);if(r<0||r%n)throw V("Wrong offset!");return r},Ot=function(t){if(S(t)&&bt in t)return t;throw z(t+" is not a typed array!")},Pt=function(t,n){if(!(S(t)&&yt in t))throw z("It is not a typed array constructor!");return new t(n)},Mt=function(t,n){return Ft(N(t,t[gt]),n)},Ft=function(t,n){for(var r=0,e=n.length,i=Pt(t,e);e>r;)i[r]=n[r++];return i},It=function(t,n,r){U(t,n,{get:function(){return this._d[r]}})},At=function from(t){var n,r,e,i,o,u,c=w(t),a=arguments.length,s=a>1?arguments[1]:void 0,l=void 0!==s,h=M(c);if(void 0!=h&&!_(h)){for(u=h.call(c),e=[],n=0;!(o=u.next()).done;n++)e.push(o.value);c=e}for(l&&a>2&&(s=f(s,arguments[2],2)),n=0,r=d(c.length),i=Pt(this,r);r>n;n++)i[n]=l?s(c[n],n):c[n];return i},kt=function of(){for(var t=0,n=arguments.length,r=Pt(this,n);n>t;)r[t]=arguments[t++];return r},Nt=!!q&&o(function(){vt.call(new q(1))}),jt=function toLocaleString(){return vt.apply(Nt?lt.call(Ot(this)):Ot(this),arguments)},Tt={copyWithin:function copyWithin(t,n){return D.call(Ot(this),t,n,arguments.length>2?arguments[2]:void 0)},every:function every(t){return Z(Ot(this),t,arguments.length>1?arguments[1]:void 0)},fill:function fill(t){return G.apply(Ot(this),arguments)},filter:function filter(t){return Mt(this,X(Ot(this),t,arguments.length>1?arguments[1]:void 0))},find:function find(t){return Q(Ot(this),t,arguments.length>1?arguments[1]:void 0)},findIndex:function findIndex(t){return tt(Ot(this),t,arguments.length>1?arguments[1]:void 0)},forEach:function forEach(t){H(Ot(this),t,arguments.length>1?arguments[1]:void 0)},indexOf:function indexOf(t){return rt(Ot(this),t,arguments.length>1?arguments[1]:void 0)},includes:function includes(t){return nt(Ot(this),t,arguments.length>1?arguments[1]:void 0)},join:function join(t){return ft.apply(Ot(this),arguments)},lastIndexOf:function lastIndexOf(t){return ut.apply(Ot(this),arguments)},map:function map(t){return St(Ot(this),t,arguments.length>1?arguments[1]:void 0)},reduce:function reduce(t){return ct.apply(Ot(this),arguments)},reduceRight:function reduceRight(t){return at.apply(Ot(this),arguments)},reverse:function reverse(){for(var t,n=this,r=Ot(n).length,e=Math.floor(r/2),i=0;i<e;)t=n[i],n[i++]=n[--r],n[r]=t;return n},some:function some(t){return $(Ot(this),t,arguments.length>1?arguments[1]:void 0)},sort:function sort(t){return st.call(Ot(this),t)},subarray:function subarray(t,n){var r=Ot(this),e=r.length,i=g(t,e);return new(N(r,r[gt]))(r.buffer,r.byteOffset+i*r.BYTES_PER_ELEMENT,d((void 0===n?e:g(n,e))-i))}},Rt=function slice(t,n){return Mt(this,lt.call(Ot(this),t,n))},Lt=function set(t){Ot(this);var n=Et(arguments[1],1),r=this.length,e=w(t),i=d(e.length),o=0;if(i+n>r)throw V("Wrong length!");for(;o<i;)this[n+o]=e[o++]},Gt={entries:function entries(){return ot.call(Ot(this))},keys:function keys(){return it.call(Ot(this))},values:function values(){return et.call(Ot(this))}},Dt=function(t,n){return S(t)&&t[bt]&&"symbol"!=typeof n&&n in t&&String(+n)==String(n)},Ct=function getOwnPropertyDescriptor(t,n){return Dt(t,n=m(n,!0))?l(2,t[n]):B(t,n)},Wt=function defineProperty(t,n,r){return!(Dt(t,n=m(n,!0))&&S(r)&&b(r,"value"))||b(r,"get")||b(r,"set")||r.configurable||b(r,"writable")&&!r.writable||b(r,"enumerable")&&!r.enumerable?U(t,n,r):(t[n]=r.value,t)};mt||(W.f=Ct,C.f=Wt),u(u.S+u.F*!mt,"Object",{getOwnPropertyDescriptor:Ct,defineProperty:Wt}),o(function(){ht.call({})})&&(ht=vt=function toString(){return ft.call(this)});var Ut=v({},Tt);v(Ut,Gt),h(Ut,pt,Gt.values),v(Ut,{slice:Rt,set:Lt,constructor:function(){},toString:ht,toLocaleString:jt}),It(Ut,"buffer","b"),It(Ut,"byteOffset","o"),It(Ut,"byteLength","l"),It(Ut,"length","e"),U(Ut,dt,{get:function(){return this[bt]}}),n.exports=function(t,n,r,a){a=!!a;var f=t+(a?"Clamped":"")+"Array",l="get"+t,v="set"+t,p=i[f],g=p||{},m=p&&O(p),b=!p||!c.ABV,w={},_=p&&p.prototype,M=function(t,r){var e=t._d;return e.v[l](r*n+e.o,wt)},F=function(t,r,e){var i=t._d;a&&(e=(e=Math.round(e))<0?0:e>255?255:255&e),i.v[v](r*n+i.o,e,wt)},I=function(t,n){U(t,n,{get:function(){return M(this,n)},set:function(t){return F(this,n,t)},enumerable:!0})};b?(p=r(function(t,r,e,i){s(t,p,f,"_d");var o,u,c,a,l=0,v=0;if(S(r)){if(!(r instanceof Y||"ArrayBuffer"==(a=x(r))||"SharedArrayBuffer"==a))return bt in r?Ft(p,r):At.call(p,r);o=r,v=Et(e,n);var g=r.byteLength;if(void 0===i){if(g%n)throw V("Wrong length!");if((u=g-v)<0)throw V("Wrong length!")}else if((u=d(i)*n)+v>g)throw V("Wrong length!");c=u/n}else c=y(r),u=c*n,o=new Y(u);for(h(t,"_d",{b:o,o:v,l:u,e:c,v:new J(o)});l<c;)I(t,l++)}),_=p.prototype=E(Ut),h(_,"constructor",p)):o(function(){p(1)})&&o(function(){new p(-1)})&&R(function(t){new p,new p(null),new p(1.5),new p(t)},!0)||(p=r(function(t,r,e,i){s(t,p,f);var o;return S(r)?r instanceof Y||"ArrayBuffer"==(o=x(r))||"SharedArrayBuffer"==o?void 0!==i?new g(r,Et(e,n),i):void 0!==e?new g(r,Et(e,n)):new g(r):bt in r?Ft(p,r):At.call(p,r):new g(y(r))}),H(m!==Function.prototype?P(g).concat(P(m)):P(g),function(t){t in p||h(p,t,g[t])}),p.prototype=_,e||(_.constructor=p));var A=_[pt],k=!!A&&("values"==A.name||void 0==A.name),N=Gt.values;h(p,yt,!0),h(_,bt,f),h(_,xt,!0),h(_,gt,p),(a?new p(1)[dt]==f:dt in _)||U(_,dt,{get:function(){return f}}),w[f]=p,u(u.G+u.W+u.F*(p!=g),w),u(u.S,f,{BYTES_PER_ELEMENT:n}),u(u.S+u.F*o(function(){g.of.call(p,1)}),f,{from:At,of:kt}),"BYTES_PER_ELEMENT"in _||h(_,"BYTES_PER_ELEMENT",n),u(u.P,f,Tt),L(f),u(u.P+u.F*_t,f,{set:Lt}),u(u.P+u.F*!k,f,Gt),e||_.toString==ht||(_.toString=ht),u(u.P+u.F*o(function(){new p(1).slice()}),f,{slice:Rt}),u(u.P+u.F*(o(function(){return[1,2].toLocaleString()!=new p([1,2]).toLocaleString()})||!o(function(){_.toLocaleString.call([1,2])})),f,{toLocaleString:jt}),T[f]=k?A:N,e||k||h(_,pt,N)}}else n.exports=function(){}},{100:100,104:104,11:11,114:114,115:115,116:116,118:118,119:119,12:12,120:120,122:122,123:123,124:124,128:128,129:129,141:141,17:17,25:25,29:29,33:33,35:35,40:40,41:41,42:42,48:48,51:51,56:56,58:58,6:6,60:60,71:71,72:72,75:75,77:77,79:79,8:8,9:9,92:92,93:93}],122:[function(t,n,r){"use strict";function packIEEE754(t,n,r){var e,i,o,u=Array(r),c=8*r-n-1,a=(1<<c)-1,f=a>>1,s=23===n?M(2,-24)-M(2,-77):0,l=0,h=t<0||0===t&&1/t<0?1:0;for(t=P(t),t!=t||t===E?(i=t!=t?1:0,e=a):(e=F(I(t)/A),t*(o=M(2,-e))<1&&(e--,o*=2),t+=e+f>=1?s/o:s*M(2,1-f),t*o>=2&&(e++,o/=2),e+f>=a?(i=0,e=a):e+f>=1?(i=(t*o-1)*M(2,n),e+=f):(i=t*M(2,f-1)*M(2,n),e=0));n>=8;u[l++]=255&i,i/=256,n-=8);for(e=e<<n|i,c+=n;c>0;u[l++]=255&e,e/=256,c-=8);return u[--l]|=128*h,u}function unpackIEEE754(t,n,r){var e,i=8*r-n-1,o=(1<<i)-1,u=o>>1,c=i-7,a=r-1,f=t[a--],s=127&f;for(f>>=7;c>0;s=256*s+t[a],a--,c-=8);for(e=s&(1<<-c)-1,s>>=-c,c+=n;c>0;e=256*e+t[a],a--,c-=8);if(0===s)s=1-u;else{if(s===o)return e?NaN:f?-E:E;e+=M(2,n),s-=u}return(f?-1:1)*e*M(2,s-n)}function unpackI32(t){return t[3]<<24|t[2]<<16|t[1]<<8|t[0]}function packI8(t){return[255&t]}function packI16(t){return[255&t,t>>8&255]}function packI32(t){return[255&t,t>>8&255,t>>16&255,t>>24&255]}function packF64(t){return packIEEE754(t,52,8)}function packF32(t){return packIEEE754(t,23,4)}function addGetter(t,n,r){d(t[m],n,{get:function(){return this[r]}})}function get(t,n,r,e){var i=+r,o=v(i);if(o+n>t[N])throw _(b);var u=t[k]._b,c=o+t[j],a=u.slice(c,c+n);return e?a:a.reverse()}function set(t,n,r,e,i,o){var u=+r,c=v(u);if(c+n>t[N])throw _(b);for(var a=t[k]._b,f=c+t[j],s=e(+i),l=0;l<n;l++)a[f+l]=s[o?l:n-l-1]}var e=t(40),i=t(29),o=t(60),u=t(123),c=t(42),a=t(93),f=t(35),s=t(6),l=t(116),h=t(118),v=t(115),p=t(77).f,d=t(72).f,y=t(9),g=t(101),m="prototype",b="Wrong index!",x=e.ArrayBuffer,S=e.DataView,w=e.Math,_=e.RangeError,E=e.Infinity,O=x,P=w.abs,M=w.pow,F=w.floor,I=w.log,A=w.LN2,k=i?"_b":"buffer",N=i?"_l":"byteLength",j=i?"_o":"byteOffset";if(u.ABV){if(!f(function(){x(1)})||!f(function(){new x(-1)})||f(function(){return new x,new x(1.5),new x(NaN),"ArrayBuffer"!=x.name})){x=function ArrayBuffer(t){return s(this,x),new O(v(t))};for(var T,R=x[m]=O[m],L=p(O),G=0;L.length>G;)(T=L[G++])in x||c(x,T,O[T]);o||(R.constructor=x)}var D=new S(new x(2)),C=S[m].setInt8;D.setInt8(0,2147483648),D.setInt8(1,2147483649),!D.getInt8(0)&&D.getInt8(1)||a(S[m],{setInt8:function setInt8(t,n){C.call(this,t,n<<24>>24)},setUint8:function setUint8(t,n){C.call(this,t,n<<24>>24)}},!0)}else x=function ArrayBuffer(t){s(this,x,"ArrayBuffer");var n=v(t);this._b=y.call(Array(n),0),this[N]=n},S=function DataView(t,n,r){s(this,S,"DataView"),s(t,x,"DataView");var e=t[N],i=l(n);if(i<0||i>e)throw _("Wrong offset!");if(r=void 0===r?e-i:h(r),i+r>e)throw _("Wrong length!");this[k]=t,this[j]=i,this[N]=r},i&&(addGetter(x,"byteLength","_l"),addGetter(S,"buffer","_b"),addGetter(S,"byteLength","_l"),addGetter(S,"byteOffset","_o")),a(S[m],{getInt8:function getInt8(t){return get(this,1,t)[0]<<24>>24},getUint8:function getUint8(t){return get(this,1,t)[0]},getInt16:function getInt16(t){var n=get(this,2,t,arguments[1]);return(n[1]<<8|n[0])<<16>>16},getUint16:function getUint16(t){var n=get(this,2,t,arguments[1]);return n[1]<<8|n[0]},getInt32:function getInt32(t){return unpackI32(get(this,4,t,arguments[1]))},getUint32:function getUint32(t){return unpackI32(get(this,4,t,arguments[1]))>>>0},getFloat32:function getFloat32(t){return unpackIEEE754(get(this,4,t,arguments[1]),23,4)},getFloat64:function getFloat64(t){return unpackIEEE754(get(this,8,t,arguments[1]),52,8)},setInt8:function setInt8(t,n){set(this,1,t,packI8,n)},setUint8:function setUint8(t,n){set(this,1,t,packI8,n)},setInt16:function setInt16(t,n){set(this,2,t,packI16,n,arguments[2])},setUint16:function setUint16(t,n){set(this,2,t,packI16,n,arguments[2])},setInt32:function setInt32(t,n){set(this,4,t,packI32,n,arguments[2])},setUint32:function setUint32(t,n){set(this,4,t,packI32,n,arguments[2])},setFloat32:function setFloat32(t,n){set(this,4,t,packF32,n,arguments[2])},setFloat64:function setFloat64(t,n){set(this,8,t,packF64,n,arguments[2])}});g(x,"ArrayBuffer"),g(S,"DataView"),c(S[m],u.VIEW,!0),r.ArrayBuffer=x,r.DataView=S},{101:101,115:115,116:116,118:118,123:123,29:29,35:35,40:40,42:42,6:6,60:60,72:72,77:77,9:9,93:93}],123:[function(t,n,r){for(var e,i=t(40),o=t(42),u=t(124),c=u("typed_array"),a=u("view"),f=!(!i.ArrayBuffer||!i.DataView),s=f,l=0,h="Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array".split(",");l<9;)(e=i[h[l++]])?(o(e.prototype,c,!0),o(e.prototype,a,!0)):s=!1;n.exports={ABV:f,CONSTR:s,TYPED:c,VIEW:a}},{124:124,40:40,42:42}],124:[function(t,n,r){var e=0,i=Math.random();n.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++e+i).toString(36))}},{}],125:[function(t,n,r){var e=t(51);n.exports=function(t,n){if(!e(t)||t._t!==n)throw TypeError("Incompatible receiver, "+n+" required!");return t}},{51:51}],126:[function(t,n,r){var e=t(40),i=t(23),o=t(60),u=t(127),c=t(72).f;n.exports=function(t){var n=i.Symbol||(i.Symbol=o?{}:e.Symbol||{});"_"==t.charAt(0)||t in n||c(n,t,{value:u.f(t)})}},{127:127,23:23,40:40,60:60,72:72}],127:[function(t,n,r){r.f=t(128)},{128:128}],128:[function(t,n,r){var e=t(103)("wks"),i=t(124),o=t(40).Symbol,u="function"==typeof o;(n.exports=function(t){return e[t]||(e[t]=u&&o[t]||(u?o:i)("Symbol."+t))}).store=e},{103:103,124:124,40:40}],129:[function(t,n,r){var e=t(17),i=t(128)("iterator"),o=t(58);n.exports=t(23).getIteratorMethod=function(t){if(void 0!=t)return t[i]||t["@@iterator"]||o[e(t)]}},{128:128,17:17,23:23,58:58}],130:[function(t,n,r){var e=t(33),i=t(95)(/[\\^$*+?.()|[\]{}]/g,"\\$&");e(e.S,"RegExp",{escape:function escape(t){return i(t)}})},{33:33,95:95}],131:[function(t,n,r){var e=t(33);e(e.P,"Array",{copyWithin:t(8)}),t(5)("copyWithin")},{33:33,5:5,8:8}],132:[function(t,n,r){"use strict";var e=t(33),i=t(12)(4);e(e.P+e.F*!t(105)([].every,!0),"Array",{every:function every(t){return i(this,t,arguments[1])}})},{105:105,12:12,33:33}],133:[function(t,n,r){var e=t(33);e(e.P,"Array",{fill:t(9)}),t(5)("fill")},{33:33,5:5,9:9}],134:[function(t,n,r){"use strict";var e=t(33),i=t(12)(2);e(e.P+e.F*!t(105)([].filter,!0),"Array",{filter:function filter(t){return i(this,t,arguments[1])}})},{105:105,12:12,33:33}],135:[function(t,n,r){"use strict";var e=t(33),i=t(12)(6),o="findIndex",u=!0;o in[]&&Array(1)[o](function(){u=!1}),e(e.P+e.F*u,"Array",{findIndex:function findIndex(t){return i(this,t,arguments.length>1?arguments[1]:void 0)}}),t(5)(o)},{12:12,33:33,5:5}],136:[function(t,n,r){"use strict";var e=t(33),i=t(12)(5),o=!0;"find"in[]&&Array(1).find(function(){o=!1}),e(e.P+e.F*o,"Array",{find:function find(t){return i(this,t,arguments.length>1?arguments[1]:void 0)}}),t(5)("find")},{12:12,33:33,5:5}],137:[function(t,n,r){"use strict";var e=t(33),i=t(12)(0),o=t(105)([].forEach,!0);e(e.P+e.F*!o,"Array",{forEach:function forEach(t){return i(this,t,arguments[1])}})},{105:105,12:12,33:33}],138:[function(t,n,r){"use strict";var e=t(25),i=t(33),o=t(119),u=t(53),c=t(48),a=t(118),f=t(24),s=t(129);i(i.S+i.F*!t(56)(function(t){Array.from(t)}),"Array",{from:function from(t){var n,r,i,l,h=o(t),v="function"==typeof this?this:Array,p=arguments.length,d=p>1?arguments[1]:void 0,y=void 0!==d,g=0,m=s(h);if(y&&(d=e(d,p>2?arguments[2]:void 0,2)),void 0==m||v==Array&&c(m))for(n=a(h.length),r=new v(n);n>g;g++)f(r,g,y?d(h[g],g):h[g]);else for(l=m.call(h),r=new v;!(i=l.next()).done;g++)f(r,g,y?u(l,d,[i.value,g],!0):i.value);return r.length=g,r}})},{118:118,119:119,129:129,24:24,25:25,33:33,48:48,53:53,56:56}],139:[function(t,n,r){"use strict";var e=t(33),i=t(11)(!1),o=[].indexOf,u=!!o&&1/[1].indexOf(1,-0)<0;e(e.P+e.F*(u||!t(105)(o)),"Array",{indexOf:function indexOf(t){return u?o.apply(this,arguments)||0:i(this,t,arguments[1])}})},{105:105,11:11,33:33}],140:[function(t,n,r){var e=t(33);e(e.S,"Array",{isArray:t(49)})},{33:33,49:49}],141:[function(t,n,r){"use strict";var e=t(5),i=t(57),o=t(58),u=t(117);n.exports=t(55)(Array,"Array",function(t,n){this._t=u(t),this._i=0,this._k=n},function(){var t=this._t,n=this._k,r=this._i++;return!t||r>=t.length?(this._t=void 0,i(1)):"keys"==n?i(0,r):"values"==n?i(0,t[r]):i(0,[r,t[r]])},"values"),o.Arguments=o.Array,e("keys"),e("values"),e("entries")},{117:117,5:5,55:55,57:57,58:58}],142:[function(t,n,r){"use strict";var e=t(33),i=t(117),o=[].join;e(e.P+e.F*(t(47)!=Object||!t(105)(o)),"Array",{join:function join(t){return o.call(i(this),void 0===t?",":t)}})},{105:105,117:117,33:33,47:47}],143:[function(t,n,r){"use strict";var e=t(33),i=t(117),o=t(116),u=t(118),c=[].lastIndexOf,a=!!c&&1/[1].lastIndexOf(1,-0)<0;e(e.P+e.F*(a||!t(105)(c)),"Array",{lastIndexOf:function lastIndexOf(t){if(a)return c.apply(this,arguments)||0;var n=i(this),r=u(n.length),e=r-1;for(arguments.length>1&&(e=Math.min(e,o(arguments[1]))),e<0&&(e=r+e);e>=0;e--)if(e in n&&n[e]===t)return e||0;return-1}})},{105:105,116:116,117:117,118:118,33:33}],144:[function(t,n,r){"use strict";var e=t(33),i=t(12)(1);e(e.P+e.F*!t(105)([].map,!0),"Array",{map:function map(t){return i(this,t,arguments[1])}})},{105:105,12:12,33:33}],145:[function(t,n,r){"use strict";var e=t(33),i=t(24);e(e.S+e.F*t(35)(function(){function F(){}return!(Array.of.call(F)instanceof F)}),"Array",{of:function of(){for(var t=0,n=arguments.length,r=new("function"==typeof this?this:Array)(n);n>t;)i(r,t,arguments[t++]);return r.length=n,r}})},{24:24,33:33,35:35}],146:[function(t,n,r){"use strict";var e=t(33),i=t(13);e(e.P+e.F*!t(105)([].reduceRight,!0),"Array",{reduceRight:function reduceRight(t){return i(this,t,arguments.length,arguments[1],!0)}})},{105:105,13:13,33:33}],147:[function(t,n,r){"use strict";var e=t(33),i=t(13);e(e.P+e.F*!t(105)([].reduce,!0),"Array",{reduce:function reduce(t){return i(this,t,arguments.length,arguments[1],!1)}})},{105:105,13:13,33:33}],148:[function(t,n,r){"use strict";var e=t(33),i=t(43),o=t(18),u=t(114),c=t(118),a=[].slice;e(e.P+e.F*t(35)(function(){i&&a.call(i)}),"Array",{slice:function slice(t,n){var r=c(this.length),e=o(this);if(n=void 0===n?r:n,"Array"==e)return a.call(this,t,n);for(var i=u(t,r),f=u(n,r),s=c(f-i),l=Array(s),h=0;h<s;h++)l[h]="String"==e?this.charAt(i+h):this[i+h];return l}})},{114:114,118:118,18:18,33:33,35:35,43:43}],149:[function(t,n,r){"use strict";var e=t(33),i=t(12)(3);e(e.P+e.F*!t(105)([].some,!0),"Array",{some:function some(t){return i(this,t,arguments[1])}})},{105:105,12:12,33:33}],150:[function(t,n,r){"use strict";var e=t(33),i=t(3),o=t(119),u=t(35),c=[].sort,a=[1,2,3];e(e.P+e.F*(u(function(){a.sort(void 0)})||!u(function(){a.sort(null)})||!t(105)(c)),"Array",{sort:function sort(t){return void 0===t?c.call(o(this)):c.call(o(this),i(t))}})},{105:105,119:119,3:3,33:33,35:35}],151:[function(t,n,r){t(100)("Array")},{100:100}],152:[function(t,n,r){var e=t(33);e(e.S,"Date",{now:function(){return(new Date).getTime()}})},{33:33}],153:[function(t,n,r){var e=t(33),i=t(26);e(e.P+e.F*(Date.prototype.toISOString!==i),"Date",{toISOString:i})},{26:26,33:33}],154:[function(t,n,r){"use strict";var e=t(33),i=t(119),o=t(120);e(e.P+e.F*t(35)(function(){return null!==new Date(NaN).toJSON()||1!==Date.prototype.toJSON.call({toISOString:function(){return 1}})}),"Date",{toJSON:function toJSON(t){var n=i(this),r=o(n);return"number"!=typeof r||isFinite(r)?n.toISOString():null}})},{119:119,120:120,33:33,35:35}],155:[function(t,n,r){var e=t(128)("toPrimitive"),i=Date.prototype;e in i||t(42)(i,e,t(27))},{128:128,27:27,42:42}],156:[function(t,n,r){var e=Date.prototype,i=e.toString,o=e.getTime;new Date(NaN)+""!="Invalid Date"&&t(94)(e,"toString",function toString(){var t=o.call(this);return t===t?i.call(this):"Invalid Date"})},{94:94}],157:[function(t,n,r){var e=t(33);e(e.P,"Function",{bind:t(16)})},{16:16,33:33}],158:[function(t,n,r){"use strict";var e=t(51),i=t(79),o=t(128)("hasInstance"),u=Function.prototype;o in u||t(72).f(u,o,{value:function(t){if("function"!=typeof this||!e(t))return!1;if(!e(this.prototype))return t instanceof this;for(;t=i(t);)if(this.prototype===t)return!0;return!1}})},{128:128,51:51,72:72,79:79}],159:[function(t,n,r){var e=t(72).f,i=Function.prototype,o=/^\s*function ([^ (]*)/;"name"in i||t(29)&&e(i,"name",{configurable:!0,get:function(){try{return(""+this).match(o)[1]}catch(t){return""}}})},{29:29,72:72}],160:[function(t,n,r){"use strict";var e=t(19),i=t(125);n.exports=t(22)("Map",function(t){return function Map(){return t(this,arguments.length>0?arguments[0]:void 0)}},{get:function get(t){var n=e.getEntry(i(this,"Map"),t);return n&&n.v},set:function set(t,n){return e.def(i(this,"Map"),0===t?0:t,n)}},e,!0)},{125:125,19:19,22:22}],161:[function(t,n,r){var e=t(33),i=t(63),o=Math.sqrt,u=Math.acosh;e(e.S+e.F*!(u&&710==Math.floor(u(Number.MAX_VALUE))&&u(1/0)==1/0),"Math",{acosh:function acosh(t){return(t=+t)<1?NaN:t>94906265.62425156?Math.log(t)+Math.LN2:i(t-1+o(t-1)*o(t+1))}})},{33:33,63:63}],162:[function(t,n,r){function asinh(t){return isFinite(t=+t)&&0!=t?t<0?-asinh(-t):Math.log(t+Math.sqrt(t*t+1)):t}var e=t(33),i=Math.asinh;e(e.S+e.F*!(i&&1/i(0)>0),"Math",{asinh:asinh})},{33:33}],163:[function(t,n,r){var e=t(33),i=Math.atanh;e(e.S+e.F*!(i&&1/i(-0)<0),"Math",{atanh:function atanh(t){return 0==(t=+t)?t:Math.log((1+t)/(1-t))/2}})},{33:33}],164:[function(t,n,r){var e=t(33),i=t(65);e(e.S,"Math",{cbrt:function cbrt(t){return i(t=+t)*Math.pow(Math.abs(t),1/3)}})},{33:33,65:65}],165:[function(t,n,r){var e=t(33);e(e.S,"Math",{clz32:function clz32(t){return(t>>>=0)?31-Math.floor(Math.log(t+.5)*Math.LOG2E):32}})},{33:33}],166:[function(t,n,r){var e=t(33),i=Math.exp;e(e.S,"Math",{cosh:function cosh(t){return(i(t=+t)+i(-t))/2}})},{33:33}],167:[function(t,n,r){var e=t(33),i=t(61);e(e.S+e.F*(i!=Math.expm1),"Math",{expm1:i})},{33:33,61:61}],168:[function(t,n,r){var e=t(33);e(e.S,"Math",{fround:t(62)})},{33:33,62:62}],169:[function(t,n,r){var e=t(33),i=Math.abs;e(e.S,"Math",{hypot:function hypot(t,n){for(var r,e,o=0,u=0,c=arguments.length,a=0;u<c;)r=i(arguments[u++]),a<r?(e=a/r,o=o*e*e+1,a=r):r>0?(e=r/a,o+=e*e):o+=r;return a===1/0?1/0:a*Math.sqrt(o)}})},{33:33}],170:[function(t,n,r){var e=t(33),i=Math.imul;e(e.S+e.F*t(35)(function(){return-5!=i(4294967295,5)||2!=i.length}),"Math",{imul:function imul(t,n){var r=+t,e=+n,i=65535&r,o=65535&e;return 0|i*o+((65535&r>>>16)*o+i*(65535&e>>>16)<<16>>>0)}})},{33:33,35:35}],171:[function(t,n,r){var e=t(33);e(e.S,"Math",{log10:function log10(t){return Math.log(t)*Math.LOG10E}})},{33:33}],172:[function(t,n,r){var e=t(33);e(e.S,"Math",{log1p:t(63)})},{33:33,63:63}],173:[function(t,n,r){var e=t(33);e(e.S,"Math",{log2:function log2(t){return Math.log(t)/Math.LN2}})},{33:33}],174:[function(t,n,r){var e=t(33);e(e.S,"Math",{sign:t(65)})},{33:33,65:65}],175:[function(t,n,r){var e=t(33),i=t(61),o=Math.exp;e(e.S+e.F*t(35)(function(){return-2e-17!=!Math.sinh(-2e-17)}),"Math",{sinh:function sinh(t){return Math.abs(t=+t)<1?(i(t)-i(-t))/2:(o(t-1)-o(-t-1))*(Math.E/2)}})},{33:33,35:35,61:61}],176:[function(t,n,r){var e=t(33),i=t(61),o=Math.exp;e(e.S,"Math",{tanh:function tanh(t){var n=i(t=+t),r=i(-t);return n==1/0?1:r==1/0?-1:(n-r)/(o(t)+o(-t))}})},{33:33,61:61}],177:[function(t,n,r){var e=t(33);e(e.S,"Math",{trunc:function trunc(t){return(t>0?Math.floor:Math.ceil)(t)}})},{33:33}],178:[function(t,n,r){"use strict";var e=t(40),i=t(41),o=t(18),u=t(45),c=t(120),a=t(35),f=t(77).f,s=t(75).f,l=t(72).f,h=t(111).trim,v=e.Number,p=v,d=v.prototype,y="Number"==o(t(71)(d)),g="trim"in String.prototype,m=function(t){var n=c(t,!1);if("string"==typeof n&&n.length>2){n=g?n.trim():h(n,3);var r,e,i,o=n.charCodeAt(0);if(43===o||45===o){if(88===(r=n.charCodeAt(2))||120===r)return NaN}else if(48===o){switch(n.charCodeAt(1)){case 66:case 98:e=2,i=49;break;case 79:case 111:e=8,i=55;break;default:return+n}for(var u,a=n.slice(2),f=0,s=a.length;f<s;f++)if((u=a.charCodeAt(f))<48||u>i)return NaN;return parseInt(a,e)}}return+n};if(!v(" 0o1")||!v("0b1")||v("+0x1")){v=function Number(t){var n=arguments.length<1?0:t,r=this;return r instanceof v&&(y?a(function(){d.valueOf.call(r)}):"Number"!=o(r))?u(new p(m(n)),r,v):m(n)};for(var b,x=t(29)?f(p):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),S=0;x.length>S;S++)i(p,b=x[S])&&!i(v,b)&&l(v,b,s(p,b));v.prototype=d,d.constructor=v,t(94)(e,"Number",v)}},{111:111,120:120,18:18,29:29,35:35,40:40,41:41,45:45,71:71,72:72,75:75,77:77,94:94}],179:[function(t,n,r){var e=t(33);e(e.S,"Number",{EPSILON:Math.pow(2,-52)})},{33:33}],180:[function(t,n,r){var e=t(33),i=t(40).isFinite;e(e.S,"Number",{isFinite:function isFinite(t){return"number"==typeof t&&i(t)}})},{33:33,40:40}],181:[function(t,n,r){var e=t(33);e(e.S,"Number",{isInteger:t(50)})},{33:33,50:50}],182:[function(t,n,r){var e=t(33);e(e.S,"Number",{isNaN:function isNaN(t){return t!=t}})},{33:33}],183:[function(t,n,r){var e=t(33),i=t(50),o=Math.abs;e(e.S,"Number",{isSafeInteger:function isSafeInteger(t){return i(t)&&o(t)<=9007199254740991}})},{33:33,50:50}],184:[function(t,n,r){var e=t(33);e(e.S,"Number",{MAX_SAFE_INTEGER:9007199254740991})},{33:33}],185:[function(t,n,r){var e=t(33);e(e.S,"Number",{MIN_SAFE_INTEGER:-9007199254740991})},{33:33}],186:[function(t,n,r){var e=t(33),i=t(86);e(e.S+e.F*(Number.parseFloat!=i),"Number",{parseFloat:i})},{33:33,86:86}],187:[function(t,n,r){var e=t(33),i=t(87);e(e.S+e.F*(Number.parseInt!=i),"Number",{parseInt:i})},{33:33,87:87}],188:[function(t,n,r){"use strict";var e=t(33),i=t(116),o=t(4),u=t(110),c=1..toFixed,a=Math.floor,f=[0,0,0,0,0,0],s="Number.toFixed: incorrect invocation!",l=function(t,n){for(var r=-1,e=n;++r<6;)e+=t*f[r],f[r]=e%1e7,e=a(e/1e7)},h=function(t){for(var n=6,r=0;--n>=0;)r+=f[n],f[n]=a(r/t),r=r%t*1e7},v=function(){for(var t=6,n="";--t>=0;)if(""!==n||0===t||0!==f[t]){var r=String(f[t]);n=""===n?r:n+u.call("0",7-r.length)+r}return n},p=function(t,n,r){return 0===n?r:n%2==1?p(t,n-1,r*t):p(t*t,n/2,r)},d=function(t){for(var n=0,r=t;r>=4096;)n+=12,r/=4096;for(;r>=2;)n+=1,r/=2;return n};e(e.P+e.F*(!!c&&("0.000"!==8e-5.toFixed(3)||"1"!==.9.toFixed(0)||"1.25"!==1.255.toFixed(2)||"1000000000000000128"!==(0xde0b6b3a7640080).toFixed(0))||!t(35)(function(){c.call({})})),"Number",{toFixed:function toFixed(t){var n,r,e,c,a=o(this,s),f=i(t),y="",g="0";if(f<0||f>20)throw RangeError(s);if(a!=a)return"NaN";if(a<=-1e21||a>=1e21)return String(a);if(a<0&&(y="-",a=-a),a>1e-21)if(n=d(a*p(2,69,1))-69,r=n<0?a*p(2,-n,1):a/p(2,n,1),r*=4503599627370496,(n=52-n)>0){for(l(0,r),e=f;e>=7;)l(1e7,0),e-=7;for(l(p(10,e,1),0),e=n-1;e>=23;)h(1<<23),e-=23;h(1<<e),l(1,1),h(2),g=v()}else l(0,r),l(1<<-n,0),g=v()+u.call("0",f);return f>0?(c=g.length,g=y+(c<=f?"0."+u.call("0",f-c)+g:g.slice(0,c-f)+"."+g.slice(c-f))):g=y+g,g}})},{110:110,116:116,33:33,35:35,4:4}],189:[function(t,n,r){"use strict";var e=t(33),i=t(35),o=t(4),u=1..toPrecision;e(e.P+e.F*(i(function(){return"1"!==u.call(1,void 0)})||!i(function(){u.call({})})),"Number",{toPrecision:function toPrecision(t){var n=o(this,"Number#toPrecision: incorrect invocation!");return void 0===t?u.call(n):u.call(n,t)}})},{33:33,35:35,4:4}],190:[function(t,n,r){var e=t(33);e(e.S+e.F,"Object",{assign:t(70)})},{33:33,70:70}],191:[function(t,n,r){var e=t(33);e(e.S,"Object",{create:t(71)})},{33:33,71:71}],192:[function(t,n,r){var e=t(33);e(e.S+e.F*!t(29),"Object",{defineProperties:t(73)})},{29:29,33:33,73:73}],193:[function(t,n,r){var e=t(33);e(e.S+e.F*!t(29),"Object",{defineProperty:t(72).f})},{29:29,33:33,72:72}],194:[function(t,n,r){var e=t(51),i=t(66).onFreeze;t(83)("freeze",function(t){return function freeze(n){return t&&e(n)?t(i(n)):n}})},{51:51,66:66,83:83}],195:[function(t,n,r){var e=t(117),i=t(75).f;t(83)("getOwnPropertyDescriptor",function(){return function getOwnPropertyDescriptor(t,n){return i(e(t),n)}})},{117:117,75:75,83:83}],196:[function(t,n,r){t(83)("getOwnPropertyNames",function(){return t(76).f})},{76:76,83:83}],197:[function(t,n,r){var e=t(119),i=t(79);t(83)("getPrototypeOf",function(){return function getPrototypeOf(t){return i(e(t))}})},{119:119,79:79,83:83}],198:[function(t,n,r){var e=t(51);t(83)("isExtensible",function(t){return function isExtensible(n){return!!e(n)&&(!t||t(n))}})},{51:51,83:83}],199:[function(t,n,r){var e=t(51);t(83)("isFrozen",function(t){return function isFrozen(n){return!e(n)||!!t&&t(n)}})},{51:51,83:83}],200:[function(t,n,r){var e=t(51);t(83)("isSealed",function(t){return function isSealed(n){return!e(n)||!!t&&t(n)}})},{51:51,83:83}],201:[function(t,n,r){var e=t(33);e(e.S,"Object",{is:t(96)})},{33:33,96:96}],202:[function(t,n,r){var e=t(119),i=t(81);t(83)("keys",function(){return function keys(t){return i(e(t))}})},{119:119,81:81,83:83}],203:[function(t,n,r){var e=t(51),i=t(66).onFreeze;t(83)("preventExtensions",function(t){return function preventExtensions(n){return t&&e(n)?t(i(n)):n}})},{51:51,66:66,83:83}],204:[function(t,n,r){var e=t(51),i=t(66).onFreeze;t(83)("seal",function(t){return function seal(n){return t&&e(n)?t(i(n)):n}})},{51:51,66:66,83:83}],205:[function(t,n,r){var e=t(33);e(e.S,"Object",{setPrototypeOf:t(99).set})},{33:33,99:99}],206:[function(t,n,r){"use strict";var e=t(17),i={};i[t(128)("toStringTag")]="z",i+""!="[object z]"&&t(94)(Object.prototype,"toString",function toString(){return"[object "+e(this)+"]"},!0)},{128:128,17:17,94:94}],207:[function(t,n,r){var e=t(33),i=t(86);e(e.G+e.F*(parseFloat!=i),{parseFloat:i})},{33:33,86:86}],208:[function(t,n,r){var e=t(33),i=t(87);e(e.G+e.F*(parseInt!=i),{parseInt:i})},{33:33,87:87}],209:[function(t,n,r){"use strict";var e,i,o,u,c=t(60),a=t(40),f=t(25),s=t(17),l=t(33),h=t(51),v=t(3),p=t(6),d=t(39),y=t(104),g=t(113).set,m=t(68)(),b=t(69),x=t(90),S=t(91),w=a.TypeError,_=a.process,E=a.Promise,O="process"==s(_),P=function(){},M=i=b.f,F=!!function(){try{var n=E.resolve(1),r=(n.constructor={})[t(128)("species")]=function(t){t(P,P)};return(O||"function"==typeof PromiseRejectionEvent)&&n.then(P)instanceof r}catch(t){}}(),I=c?function(t,n){return t===n||t===E&&n===u}:function(t,n){return t===n},A=function(t){var n;return!(!h(t)||"function"!=typeof(n=t.then))&&n},k=function(t,n){if(!t._n){t._n=!0;var r=t._c;m(function(){for(var e=t._v,i=1==t._s,o=0;r.length>o;)!function(n){var r,o,u=i?n.ok:n.fail,c=n.resolve,a=n.reject,f=n.domain;try{u?(i||(2==t._h&&T(t),t._h=1),!0===u?r=e:(f&&f.enter(),r=u(e),f&&f.exit()),r===n.promise?a(w("Promise-chain cycle")):(o=A(r))?o.call(r,c,a):c(r)):a(e)}catch(t){a(t)}}(r[o++]);t._c=[],t._n=!1,n&&!t._h&&N(t)})}},N=function(t){g.call(a,function(){var n,r,e,i=t._v,o=j(t);if(o&&(n=x(function(){O?_.emit("unhandledRejection",i,t):(r=a.onunhandledrejection)?r({promise:t,reason:i}):(e=a.console)&&e.error&&e.error("Unhandled promise rejection",i)}),t._h=O||j(t)?2:1),t._a=void 0,o&&n.e)throw n.v})},j=function(t){if(1==t._h)return!1;for(var n,r=t._a||t._c,e=0;r.length>e;)if(n=r[e++],n.fail||!j(n.promise))return!1;return!0},T=function(t){g.call(a,function(){var n;O?_.emit("rejectionHandled",t):(n=a.onrejectionhandled)&&n({promise:t,reason:t._v})})},R=function(t){var n=this;n._d||(n._d=!0,n=n._w||n,n._v=t,n._s=2,n._a||(n._a=n._c.slice()),k(n,!0))},L=function(t){var n,r=this;if(!r._d){r._d=!0,r=r._w||r;try{if(r===t)throw w("Promise can't be resolved itself");(n=A(t))?m(function(){var e={_w:r,_d:!1};try{n.call(t,f(L,e,1),f(R,e,1))}catch(t){R.call(e,t)}}):(r._v=t,r._s=1,k(r,!1))}catch(t){R.call({_w:r,_d:!1},t)}}};F||(E=function Promise(t){p(this,E,"Promise","_h"),v(t),e.call(this);try{t(f(L,this,1),f(R,this,1))}catch(t){R.call(this,t)}},e=function Promise(t){this._c=[],this._a=void 0,this._s=0,this._d=!1,this._v=void 0,this._h=0,this._n=!1},e.prototype=t(93)(E.prototype,{then:function then(t,n){var r=M(y(this,E));return r.ok="function"!=typeof t||t,r.fail="function"==typeof n&&n,r.domain=O?_.domain:void 0,this._c.push(r),this._a&&this._a.push(r),this._s&&k(this,!1),r.promise},catch:function(t){return this.then(void 0,t)}}),o=function(){var t=new e;this.promise=t,this.resolve=f(L,t,1),this.reject=f(R,t,1)},b.f=M=function(t){return I(E,t)?new o(t):i(t)}),l(l.G+l.W+l.F*!F,{Promise:E}),t(101)(E,"Promise"),t(100)("Promise"),u=t(23).Promise,l(l.S+l.F*!F,"Promise",{reject:function reject(t){var n=M(this);return(0,n.reject)(t),n.promise}}),l(l.S+l.F*(c||!F),"Promise",{resolve:function resolve(t){return t instanceof E&&I(t.constructor,this)?t:S(this,t)}}),l(l.S+l.F*!(F&&t(56)(function(t){E.all(t).catch(P)})),"Promise",{all:function all(t){var n=this,r=M(n),e=r.resolve,i=r.reject,o=x(function(){var r=[],o=0,u=1;d(t,!1,function(t){var c=o++,a=!1;r.push(void 0),u++,n.resolve(t).then(function(t){a||(a=!0,r[c]=t,--u||e(r))},i)}),--u||e(r)});return o.e&&i(o.v),r.promise},race:function race(t){var n=this,r=M(n),e=r.reject,i=x(function(){d(t,!1,function(t){n.resolve(t).then(r.resolve,e)})});return i.e&&e(i.v),r.promise}})},{100:100,101:101,104:104,113:113,128:128,17:17,23:23,25:25,
3:3,33:33,39:39,40:40,51:51,56:56,6:6,60:60,68:68,69:69,90:90,91:91,93:93}],210:[function(t,n,r){var e=t(33),i=t(3),o=t(7),u=(t(40).Reflect||{}).apply,c=Function.apply;e(e.S+e.F*!t(35)(function(){u(function(){})}),"Reflect",{apply:function apply(t,n,r){var e=i(t),a=o(r);return u?u(e,n,a):c.call(e,n,a)}})},{3:3,33:33,35:35,40:40,7:7}],211:[function(t,n,r){var e=t(33),i=t(71),o=t(3),u=t(7),c=t(51),a=t(35),f=t(16),s=(t(40).Reflect||{}).construct,l=a(function(){function F(){}return!(s(function(){},[],F)instanceof F)}),h=!a(function(){s(function(){})});e(e.S+e.F*(l||h),"Reflect",{construct:function construct(t,n){o(t),u(n);var r=arguments.length<3?t:o(arguments[2]);if(h&&!l)return s(t,n,r);if(t==r){switch(n.length){case 0:return new t;case 1:return new t(n[0]);case 2:return new t(n[0],n[1]);case 3:return new t(n[0],n[1],n[2]);case 4:return new t(n[0],n[1],n[2],n[3])}var e=[null];return e.push.apply(e,n),new(f.apply(t,e))}var a=r.prototype,v=i(c(a)?a:Object.prototype),p=Function.apply.call(t,v,n);return c(p)?p:v}})},{16:16,3:3,33:33,35:35,40:40,51:51,7:7,71:71}],212:[function(t,n,r){var e=t(72),i=t(33),o=t(7),u=t(120);i(i.S+i.F*t(35)(function(){Reflect.defineProperty(e.f({},1,{value:1}),1,{value:2})}),"Reflect",{defineProperty:function defineProperty(t,n,r){o(t),n=u(n,!0),o(r);try{return e.f(t,n,r),!0}catch(t){return!1}}})},{120:120,33:33,35:35,7:7,72:72}],213:[function(t,n,r){var e=t(33),i=t(75).f,o=t(7);e(e.S,"Reflect",{deleteProperty:function deleteProperty(t,n){var r=i(o(t),n);return!(r&&!r.configurable)&&delete t[n]}})},{33:33,7:7,75:75}],214:[function(t,n,r){"use strict";var e=t(33),i=t(7),o=function(t){this._t=i(t),this._i=0;var n,r=this._k=[];for(n in t)r.push(n)};t(54)(o,"Object",function(){var t,n=this,r=n._k;do{if(n._i>=r.length)return{value:void 0,done:!0}}while(!((t=r[n._i++])in n._t));return{value:t,done:!1}}),e(e.S,"Reflect",{enumerate:function enumerate(t){return new o(t)}})},{33:33,54:54,7:7}],215:[function(t,n,r){var e=t(75),i=t(33),o=t(7);i(i.S,"Reflect",{getOwnPropertyDescriptor:function getOwnPropertyDescriptor(t,n){return e.f(o(t),n)}})},{33:33,7:7,75:75}],216:[function(t,n,r){var e=t(33),i=t(79),o=t(7);e(e.S,"Reflect",{getPrototypeOf:function getPrototypeOf(t){return i(o(t))}})},{33:33,7:7,79:79}],217:[function(t,n,r){function get(t,n){var r,u,f=arguments.length<3?t:arguments[2];return a(t)===f?t[n]:(r=e.f(t,n))?o(r,"value")?r.value:void 0!==r.get?r.get.call(f):void 0:c(u=i(t))?get(u,n,f):void 0}var e=t(75),i=t(79),o=t(41),u=t(33),c=t(51),a=t(7);u(u.S,"Reflect",{get:get})},{33:33,41:41,51:51,7:7,75:75,79:79}],218:[function(t,n,r){var e=t(33);e(e.S,"Reflect",{has:function has(t,n){return n in t}})},{33:33}],219:[function(t,n,r){var e=t(33),i=t(7),o=Object.isExtensible;e(e.S,"Reflect",{isExtensible:function isExtensible(t){return i(t),!o||o(t)}})},{33:33,7:7}],220:[function(t,n,r){var e=t(33);e(e.S,"Reflect",{ownKeys:t(85)})},{33:33,85:85}],221:[function(t,n,r){var e=t(33),i=t(7),o=Object.preventExtensions;e(e.S,"Reflect",{preventExtensions:function preventExtensions(t){i(t);try{return o&&o(t),!0}catch(t){return!1}}})},{33:33,7:7}],222:[function(t,n,r){var e=t(33),i=t(99);i&&e(e.S,"Reflect",{setPrototypeOf:function setPrototypeOf(t,n){i.check(t,n);try{return i.set(t,n),!0}catch(t){return!1}}})},{33:33,99:99}],223:[function(t,n,r){function set(t,n,r){var c,l,h=arguments.length<4?t:arguments[3],v=i.f(f(t),n);if(!v){if(s(l=o(t)))return set(l,n,r,h);v=a(0)}return u(v,"value")?!(!1===v.writable||!s(h))&&(c=i.f(h,n)||a(0),c.value=r,e.f(h,n,c),!0):void 0!==v.set&&(v.set.call(h,r),!0)}var e=t(72),i=t(75),o=t(79),u=t(41),c=t(33),a=t(92),f=t(7),s=t(51);c(c.S,"Reflect",{set:set})},{33:33,41:41,51:51,7:7,72:72,75:75,79:79,92:92}],224:[function(t,n,r){var e=t(40),i=t(45),o=t(72).f,u=t(77).f,c=t(52),a=t(37),f=e.RegExp,s=f,l=f.prototype,h=/a/g,v=/a/g,p=new f(h)!==h;if(t(29)&&(!p||t(35)(function(){return v[t(128)("match")]=!1,f(h)!=h||f(v)==v||"/a/i"!=f(h,"i")}))){f=function RegExp(t,n){var r=this instanceof f,e=c(t),o=void 0===n;return!r&&e&&t.constructor===f&&o?t:i(p?new s(e&&!o?t.source:t,n):s((e=t instanceof f)?t.source:t,e&&o?a.call(t):n),r?this:l,f)};for(var d=u(s),y=0;d.length>y;)!function(t){t in f||o(f,t,{configurable:!0,get:function(){return s[t]},set:function(n){s[t]=n}})}(d[y++]);l.constructor=f,f.prototype=l,t(94)(e,"RegExp",f)}t(100)("RegExp")},{100:100,128:128,29:29,35:35,37:37,40:40,45:45,52:52,72:72,77:77,94:94}],225:[function(t,n,r){t(29)&&"g"!=/./g.flags&&t(72).f(RegExp.prototype,"flags",{configurable:!0,get:t(37)})},{29:29,37:37,72:72}],226:[function(t,n,r){t(36)("match",1,function(t,n,r){return[function match(r){"use strict";var e=t(this),i=void 0==r?void 0:r[n];return void 0!==i?i.call(r,e):new RegExp(r)[n](String(e))},r]})},{36:36}],227:[function(t,n,r){t(36)("replace",2,function(t,n,r){return[function replace(e,i){"use strict";var o=t(this),u=void 0==e?void 0:e[n];return void 0!==u?u.call(e,o,i):r.call(String(o),e,i)},r]})},{36:36}],228:[function(t,n,r){t(36)("search",1,function(t,n,r){return[function search(r){"use strict";var e=t(this),i=void 0==r?void 0:r[n];return void 0!==i?i.call(r,e):new RegExp(r)[n](String(e))},r]})},{36:36}],229:[function(t,n,r){t(36)("split",2,function(n,r,e){"use strict";var i=t(52),o=e,u=[].push,c="length";if("c"=="abbc".split(/(b)*/)[1]||4!="test".split(/(?:)/,-1)[c]||2!="ab".split(/(?:ab)*/)[c]||4!=".".split(/(.?)(.?)/)[c]||".".split(/()()/)[c]>1||"".split(/.?/)[c]){var a=void 0===/()??/.exec("")[1];e=function(t,n){var r=String(this);if(void 0===t&&0===n)return[];if(!i(t))return o.call(r,t,n);var e,f,s,l,h,v=[],p=(t.ignoreCase?"i":"")+(t.multiline?"m":"")+(t.unicode?"u":"")+(t.sticky?"y":""),d=0,y=void 0===n?4294967295:n>>>0,g=new RegExp(t.source,p+"g");for(a||(e=new RegExp("^"+g.source+"$(?!\\s)",p));(f=g.exec(r))&&!((s=f.index+f[0][c])>d&&(v.push(r.slice(d,f.index)),!a&&f[c]>1&&f[0].replace(e,function(){for(h=1;h<arguments[c]-2;h++)void 0===arguments[h]&&(f[h]=void 0)}),f[c]>1&&f.index<r[c]&&u.apply(v,f.slice(1)),l=f[0][c],d=s,v[c]>=y));)g.lastIndex===f.index&&g.lastIndex++;return d===r[c]?!l&&g.test("")||v.push(""):v.push(r.slice(d)),v[c]>y?v.slice(0,y):v}}else"0".split(void 0,0)[c]&&(e=function(t,n){return void 0===t&&0===n?[]:o.call(this,t,n)});return[function split(t,i){var o=n(this),u=void 0==t?void 0:t[r];return void 0!==u?u.call(t,o,i):e.call(String(o),t,i)},e]})},{36:36,52:52}],230:[function(t,n,r){"use strict";t(225);var e=t(7),i=t(37),o=t(29),u=/./.toString,c=function(n){t(94)(RegExp.prototype,"toString",n,!0)};t(35)(function(){return"/a/b"!=u.call({source:"a",flags:"b"})})?c(function toString(){var t=e(this);return"/".concat(t.source,"/","flags"in t?t.flags:!o&&t instanceof RegExp?i.call(t):void 0)}):"toString"!=u.name&&c(function toString(){return u.call(this)})},{225:225,29:29,35:35,37:37,7:7,94:94}],231:[function(t,n,r){"use strict";var e=t(19),i=t(125);n.exports=t(22)("Set",function(t){return function Set(){return t(this,arguments.length>0?arguments[0]:void 0)}},{add:function add(t){return e.def(i(this,"Set"),t=0===t?0:t,t)}},e)},{125:125,19:19,22:22}],232:[function(t,n,r){"use strict";t(108)("anchor",function(t){return function anchor(n){return t(this,"a","name",n)}})},{108:108}],233:[function(t,n,r){"use strict";t(108)("big",function(t){return function big(){return t(this,"big","","")}})},{108:108}],234:[function(t,n,r){"use strict";t(108)("blink",function(t){return function blink(){return t(this,"blink","","")}})},{108:108}],235:[function(t,n,r){"use strict";t(108)("bold",function(t){return function bold(){return t(this,"b","","")}})},{108:108}],236:[function(t,n,r){"use strict";var e=t(33),i=t(106)(!1);e(e.P,"String",{codePointAt:function codePointAt(t){return i(this,t)}})},{106:106,33:33}],237:[function(t,n,r){"use strict";var e=t(33),i=t(118),o=t(107),u="".endsWith;e(e.P+e.F*t(34)("endsWith"),"String",{endsWith:function endsWith(t){var n=o(this,t,"endsWith"),r=arguments.length>1?arguments[1]:void 0,e=i(n.length),c=void 0===r?e:Math.min(i(r),e),a=String(t);return u?u.call(n,a,c):n.slice(c-a.length,c)===a}})},{107:107,118:118,33:33,34:34}],238:[function(t,n,r){"use strict";t(108)("fixed",function(t){return function fixed(){return t(this,"tt","","")}})},{108:108}],239:[function(t,n,r){"use strict";t(108)("fontcolor",function(t){return function fontcolor(n){return t(this,"font","color",n)}})},{108:108}],240:[function(t,n,r){"use strict";t(108)("fontsize",function(t){return function fontsize(n){return t(this,"font","size",n)}})},{108:108}],241:[function(t,n,r){var e=t(33),i=t(114),o=String.fromCharCode,u=String.fromCodePoint;e(e.S+e.F*(!!u&&1!=u.length),"String",{fromCodePoint:function fromCodePoint(t){for(var n,r=[],e=arguments.length,u=0;e>u;){if(n=+arguments[u++],i(n,1114111)!==n)throw RangeError(n+" is not a valid code point");r.push(n<65536?o(n):o(55296+((n-=65536)>>10),n%1024+56320))}return r.join("")}})},{114:114,33:33}],242:[function(t,n,r){"use strict";var e=t(33),i=t(107);e(e.P+e.F*t(34)("includes"),"String",{includes:function includes(t){return!!~i(this,t,"includes").indexOf(t,arguments.length>1?arguments[1]:void 0)}})},{107:107,33:33,34:34}],243:[function(t,n,r){"use strict";t(108)("italics",function(t){return function italics(){return t(this,"i","","")}})},{108:108}],244:[function(t,n,r){"use strict";var e=t(106)(!0);t(55)(String,"String",function(t){this._t=String(t),this._i=0},function(){var t,n=this._t,r=this._i;return r>=n.length?{value:void 0,done:!0}:(t=e(n,r),this._i+=t.length,{value:t,done:!1})})},{106:106,55:55}],245:[function(t,n,r){"use strict";t(108)("link",function(t){return function link(n){return t(this,"a","href",n)}})},{108:108}],246:[function(t,n,r){var e=t(33),i=t(117),o=t(118);e(e.S,"String",{raw:function raw(t){for(var n=i(t.raw),r=o(n.length),e=arguments.length,u=[],c=0;r>c;)u.push(String(n[c++])),c<e&&u.push(String(arguments[c]));return u.join("")}})},{117:117,118:118,33:33}],247:[function(t,n,r){var e=t(33);e(e.P,"String",{repeat:t(110)})},{110:110,33:33}],248:[function(t,n,r){"use strict";t(108)("small",function(t){return function small(){return t(this,"small","","")}})},{108:108}],249:[function(t,n,r){"use strict";var e=t(33),i=t(118),o=t(107),u="".startsWith;e(e.P+e.F*t(34)("startsWith"),"String",{startsWith:function startsWith(t){var n=o(this,t,"startsWith"),r=i(Math.min(arguments.length>1?arguments[1]:void 0,n.length)),e=String(t);return u?u.call(n,e,r):n.slice(r,r+e.length)===e}})},{107:107,118:118,33:33,34:34}],250:[function(t,n,r){"use strict";t(108)("strike",function(t){return function strike(){return t(this,"strike","","")}})},{108:108}],251:[function(t,n,r){"use strict";t(108)("sub",function(t){return function sub(){return t(this,"sub","","")}})},{108:108}],252:[function(t,n,r){"use strict";t(108)("sup",function(t){return function sup(){return t(this,"sup","","")}})},{108:108}],253:[function(t,n,r){"use strict";t(111)("trim",function(t){return function trim(){return t(this,3)}})},{111:111}],254:[function(t,n,r){"use strict";var e=t(40),i=t(41),o=t(29),u=t(33),c=t(94),a=t(66).KEY,f=t(35),s=t(103),l=t(101),h=t(124),v=t(128),p=t(127),d=t(126),y=t(59),g=t(32),m=t(49),b=t(7),x=t(117),S=t(120),w=t(92),_=t(71),E=t(76),O=t(75),P=t(72),M=t(81),F=O.f,I=P.f,A=E.f,k=e.Symbol,N=e.JSON,j=N&&N.stringify,T=v("_hidden"),R=v("toPrimitive"),L={}.propertyIsEnumerable,G=s("symbol-registry"),D=s("symbols"),C=s("op-symbols"),W=Object.prototype,U="function"==typeof k,B=e.QObject,V=!B||!B.prototype||!B.prototype.findChild,z=o&&f(function(){return 7!=_(I({},"a",{get:function(){return I(this,"a",{value:7}).a}})).a})?function(t,n,r){var e=F(W,n);e&&delete W[n],I(t,n,r),e&&t!==W&&I(W,n,e)}:I,q=function(t){var n=D[t]=_(k.prototype);return n._k=t,n},K=U&&"symbol"==typeof k.iterator?function(t){return"symbol"==typeof t}:function(t){return t instanceof k},Y=function defineProperty(t,n,r){return t===W&&Y(C,n,r),b(t),n=S(n,!0),b(r),i(D,n)?(r.enumerable?(i(t,T)&&t[T][n]&&(t[T][n]=!1),r=_(r,{enumerable:w(0,!1)})):(i(t,T)||I(t,T,w(1,{})),t[T][n]=!0),z(t,n,r)):I(t,n,r)},J=function defineProperties(t,n){b(t);for(var r,e=g(n=x(n)),i=0,o=e.length;o>i;)Y(t,r=e[i++],n[r]);return t},H=function create(t,n){return void 0===n?_(t):J(_(t),n)},X=function propertyIsEnumerable(t){var n=L.call(this,t=S(t,!0));return!(this===W&&i(D,t)&&!i(C,t))&&(!(n||!i(this,t)||!i(D,t)||i(this,T)&&this[T][t])||n)},$=function getOwnPropertyDescriptor(t,n){if(t=x(t),n=S(n,!0),t!==W||!i(D,n)||i(C,n)){var r=F(t,n);return!r||!i(D,n)||i(t,T)&&t[T][n]||(r.enumerable=!0),r}},Z=function getOwnPropertyNames(t){for(var n,r=A(x(t)),e=[],o=0;r.length>o;)i(D,n=r[o++])||n==T||n==a||e.push(n);return e},Q=function getOwnPropertySymbols(t){for(var n,r=t===W,e=A(r?C:x(t)),o=[],u=0;e.length>u;)!i(D,n=e[u++])||r&&!i(W,n)||o.push(D[n]);return o};U||(k=function Symbol(){if(this instanceof k)throw TypeError("Symbol is not a constructor!");var t=h(arguments.length>0?arguments[0]:void 0),n=function(r){this===W&&n.call(C,r),i(this,T)&&i(this[T],t)&&(this[T][t]=!1),z(this,t,w(1,r))};return o&&V&&z(W,t,{configurable:!0,set:n}),q(t)},c(k.prototype,"toString",function toString(){return this._k}),O.f=$,P.f=Y,t(77).f=E.f=Z,t(82).f=X,t(78).f=Q,o&&!t(60)&&c(W,"propertyIsEnumerable",X,!0),p.f=function(t){return q(v(t))}),u(u.G+u.W+u.F*!U,{Symbol:k});for(var tt="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),nt=0;tt.length>nt;)v(tt[nt++]);for(var rt=M(v.store),et=0;rt.length>et;)d(rt[et++]);u(u.S+u.F*!U,"Symbol",{for:function(t){return i(G,t+="")?G[t]:G[t]=k(t)},keyFor:function keyFor(t){if(K(t))return y(G,t);throw TypeError(t+" is not a symbol!")},useSetter:function(){V=!0},useSimple:function(){V=!1}}),u(u.S+u.F*!U,"Object",{create:H,defineProperty:Y,defineProperties:J,getOwnPropertyDescriptor:$,getOwnPropertyNames:Z,getOwnPropertySymbols:Q}),N&&u(u.S+u.F*(!U||f(function(){var t=k();return"[null]"!=j([t])||"{}"!=j({a:t})||"{}"!=j(Object(t))})),"JSON",{stringify:function stringify(t){if(void 0!==t&&!K(t)){for(var n,r,e=[t],i=1;arguments.length>i;)e.push(arguments[i++]);return n=e[1],"function"==typeof n&&(r=n),!r&&m(n)||(n=function(t,n){if(r&&(n=r.call(this,t,n)),!K(n))return n}),e[1]=n,j.apply(N,e)}}}),k.prototype[R]||t(42)(k.prototype,R,k.prototype.valueOf),l(k,"Symbol"),l(Math,"Math",!0),l(e.JSON,"JSON",!0)},{101:101,103:103,117:117,120:120,124:124,126:126,127:127,128:128,29:29,32:32,33:33,35:35,40:40,41:41,42:42,49:49,59:59,60:60,66:66,7:7,71:71,72:72,75:75,76:76,77:77,78:78,81:81,82:82,92:92,94:94}],255:[function(t,n,r){"use strict";var e=t(33),i=t(123),o=t(122),u=t(7),c=t(114),a=t(118),f=t(51),s=t(40).ArrayBuffer,l=t(104),h=o.ArrayBuffer,v=o.DataView,p=i.ABV&&s.isView,d=h.prototype.slice,y=i.VIEW;e(e.G+e.W+e.F*(s!==h),{ArrayBuffer:h}),e(e.S+e.F*!i.CONSTR,"ArrayBuffer",{isView:function isView(t){return p&&p(t)||f(t)&&y in t}}),e(e.P+e.U+e.F*t(35)(function(){return!new h(2).slice(1,void 0).byteLength}),"ArrayBuffer",{slice:function slice(t,n){if(void 0!==d&&void 0===n)return d.call(u(this),t);for(var r=u(this).byteLength,e=c(t,r),i=c(void 0===n?r:n,r),o=new(l(this,h))(a(i-e)),f=new v(this),s=new v(o),p=0;e<i;)s.setUint8(p++,f.getUint8(e++));return o}}),t(100)("ArrayBuffer")},{100:100,104:104,114:114,118:118,122:122,123:123,33:33,35:35,40:40,51:51,7:7}],256:[function(t,n,r){var e=t(33);e(e.G+e.W+e.F*!t(123).ABV,{DataView:t(122).DataView})},{122:122,123:123,33:33}],257:[function(t,n,r){t(121)("Float32",4,function(t){return function Float32Array(n,r,e){return t(this,n,r,e)}})},{121:121}],258:[function(t,n,r){t(121)("Float64",8,function(t){return function Float64Array(n,r,e){return t(this,n,r,e)}})},{121:121}],259:[function(t,n,r){t(121)("Int16",2,function(t){return function Int16Array(n,r,e){return t(this,n,r,e)}})},{121:121}],260:[function(t,n,r){t(121)("Int32",4,function(t){return function Int32Array(n,r,e){return t(this,n,r,e)}})},{121:121}],261:[function(t,n,r){t(121)("Int8",1,function(t){return function Int8Array(n,r,e){return t(this,n,r,e)}})},{121:121}],262:[function(t,n,r){t(121)("Uint16",2,function(t){return function Uint16Array(n,r,e){return t(this,n,r,e)}})},{121:121}],263:[function(t,n,r){t(121)("Uint32",4,function(t){return function Uint32Array(n,r,e){return t(this,n,r,e)}})},{121:121}],264:[function(t,n,r){t(121)("Uint8",1,function(t){return function Uint8Array(n,r,e){return t(this,n,r,e)}})},{121:121}],265:[function(t,n,r){t(121)("Uint8",1,function(t){return function Uint8ClampedArray(n,r,e){return t(this,n,r,e)}},!0)},{121:121}],266:[function(t,n,r){"use strict";var e,i=t(12)(0),o=t(94),u=t(66),c=t(70),a=t(21),f=t(51),s=t(35),l=t(125),h=u.getWeak,v=Object.isExtensible,p=a.ufstore,d={},y=function(t){return function WeakMap(){return t(this,arguments.length>0?arguments[0]:void 0)}},g={get:function get(t){if(f(t)){var n=h(t);return!0===n?p(l(this,"WeakMap")).get(t):n?n[this._i]:void 0}},set:function set(t,n){return a.def(l(this,"WeakMap"),t,n)}},m=n.exports=t(22)("WeakMap",y,g,a,!0,!0);s(function(){return 7!=(new m).set((Object.freeze||Object)(d),7).get(d)})&&(e=a.getConstructor(y,"WeakMap"),c(e.prototype,g),u.NEED=!0,i(["delete","has","get","set"],function(t){var n=m.prototype,r=n[t];o(n,t,function(n,i){if(f(n)&&!v(n)){this._f||(this._f=new e);var o=this._f[t](n,i);return"set"==t?this:o}return r.call(this,n,i)})}))},{12:12,125:125,21:21,22:22,35:35,51:51,66:66,70:70,94:94}],267:[function(t,n,r){"use strict";var e=t(21),i=t(125);t(22)("WeakSet",function(t){return function WeakSet(){return t(this,arguments.length>0?arguments[0]:void 0)}},{add:function add(t){return e.def(i(this,"WeakSet"),t,!0)}},e,!1,!0)},{125:125,21:21,22:22}],268:[function(t,n,r){"use strict";var e=t(33),i=t(38),o=t(119),u=t(118),c=t(3),a=t(15);e(e.P,"Array",{flatMap:function flatMap(t){var n,r,e=o(this);return c(t),n=u(e.length),r=a(e,0),i(r,e,e,n,0,1,t,arguments[1]),r}}),t(5)("flatMap")},{118:118,119:119,15:15,3:3,33:33,38:38,5:5}],269:[function(t,n,r){"use strict";var e=t(33),i=t(38),o=t(119),u=t(118),c=t(116),a=t(15);e(e.P,"Array",{flatten:function flatten(){var t=arguments[0],n=o(this),r=u(n.length),e=a(n,0);return i(e,n,n,r,0,void 0===t?1:c(t)),e}}),t(5)("flatten")},{116:116,118:118,119:119,15:15,33:33,38:38,5:5}],270:[function(t,n,r){"use strict";var e=t(33),i=t(11)(!0);e(e.P,"Array",{includes:function includes(t){return i(this,t,arguments.length>1?arguments[1]:void 0)}}),t(5)("includes")},{11:11,33:33,5:5}],271:[function(t,n,r){var e=t(33),i=t(68)(),o=t(40).process,u="process"==t(18)(o);e(e.G,{asap:function asap(t){var n=u&&o.domain;i(n?n.bind(t):t)}})},{18:18,33:33,40:40,68:68}],272:[function(t,n,r){var e=t(33),i=t(18);e(e.S,"Error",{isError:function isError(t){return"Error"===i(t)}})},{18:18,33:33}],273:[function(t,n,r){var e=t(33);e(e.G,{global:t(40)})},{33:33,40:40}],274:[function(t,n,r){t(97)("Map")},{97:97}],275:[function(t,n,r){t(98)("Map")},{98:98}],276:[function(t,n,r){var e=t(33);e(e.P+e.R,"Map",{toJSON:t(20)("Map")})},{20:20,33:33}],277:[function(t,n,r){var e=t(33);e(e.S,"Math",{clamp:function clamp(t,n,r){return Math.min(r,Math.max(n,t))}})},{33:33}],278:[function(t,n,r){var e=t(33);e(e.S,"Math",{DEG_PER_RAD:Math.PI/180})},{33:33}],279:[function(t,n,r){var e=t(33),i=180/Math.PI;e(e.S,"Math",{degrees:function degrees(t){return t*i}})},{33:33}],280:[function(t,n,r){var e=t(33),i=t(64),o=t(62);e(e.S,"Math",{fscale:function fscale(t,n,r,e,u){return o(i(t,n,r,e,u))}})},{33:33,62:62,64:64}],281:[function(t,n,r){var e=t(33);e(e.S,"Math",{iaddh:function iaddh(t,n,r,e){var i=t>>>0,o=n>>>0,u=r>>>0;return o+(e>>>0)+((i&u|(i|u)&~(i+u>>>0))>>>31)|0}})},{33:33}],282:[function(t,n,r){var e=t(33);e(e.S,"Math",{imulh:function imulh(t,n){var r=+t,e=+n,i=65535&r,o=65535&e,u=r>>16,c=e>>16,a=(u*o>>>0)+(i*o>>>16);return u*c+(a>>16)+((i*c>>>0)+(65535&a)>>16)}})},{33:33}],283:[function(t,n,r){var e=t(33);e(e.S,"Math",{isubh:function isubh(t,n,r,e){var i=t>>>0,o=n>>>0,u=r>>>0;return o-(e>>>0)-((~i&u|~(i^u)&i-u>>>0)>>>31)|0}})},{33:33}],284:[function(t,n,r){var e=t(33);e(e.S,"Math",{RAD_PER_DEG:180/Math.PI})},{33:33}],285:[function(t,n,r){var e=t(33),i=Math.PI/180;e(e.S,"Math",{radians:function radians(t){return t*i}})},{33:33}],286:[function(t,n,r){var e=t(33);e(e.S,"Math",{scale:t(64)})},{33:33,64:64}],287:[function(t,n,r){var e=t(33);e(e.S,"Math",{signbit:function signbit(t){return(t=+t)!=t?t:0==t?1/t==1/0:t>0}})},{33:33}],288:[function(t,n,r){var e=t(33);e(e.S,"Math",{umulh:function umulh(t,n){var r=+t,e=+n,i=65535&r,o=65535&e,u=r>>>16,c=e>>>16,a=(u*o>>>0)+(i*o>>>16);return u*c+(a>>>16)+((i*c>>>0)+(65535&a)>>>16)}})},{33:33}],289:[function(t,n,r){"use strict";var e=t(33),i=t(119),o=t(3),u=t(72);t(29)&&e(e.P+t(74),"Object",{__defineGetter__:function __defineGetter__(t,n){u.f(i(this),t,{get:o(n),enumerable:!0,configurable:!0})}})},{119:119,29:29,3:3,33:33,72:72,74:74}],290:[function(t,n,r){"use strict";var e=t(33),i=t(119),o=t(3),u=t(72);t(29)&&e(e.P+t(74),"Object",{__defineSetter__:function __defineSetter__(t,n){u.f(i(this),t,{set:o(n),enumerable:!0,configurable:!0})}})},{119:119,29:29,3:3,33:33,72:72,74:74}],291:[function(t,n,r){var e=t(33),i=t(84)(!0);e(e.S,"Object",{entries:function entries(t){return i(t)}})},{33:33,84:84}],292:[function(t,n,r){var e=t(33),i=t(85),o=t(117),u=t(75),c=t(24);e(e.S,"Object",{getOwnPropertyDescriptors:function getOwnPropertyDescriptors(t){for(var n,r,e=o(t),a=u.f,f=i(e),s={},l=0;f.length>l;)void 0!==(r=a(e,n=f[l++]))&&c(s,n,r);return s}})},{117:117,24:24,33:33,75:75,85:85}],293:[function(t,n,r){"use strict";var e=t(33),i=t(119),o=t(120),u=t(79),c=t(75).f;t(29)&&e(e.P+t(74),"Object",{__lookupGetter__:function __lookupGetter__(t){var n,r=i(this),e=o(t,!0);do{if(n=c(r,e))return n.get}while(r=u(r))}})},{119:119,120:120,29:29,33:33,74:74,75:75,79:79}],294:[function(t,n,r){"use strict";var e=t(33),i=t(119),o=t(120),u=t(79),c=t(75).f;t(29)&&e(e.P+t(74),"Object",{__lookupSetter__:function __lookupSetter__(t){var n,r=i(this),e=o(t,!0);do{if(n=c(r,e))return n.set}while(r=u(r))}})},{119:119,120:120,29:29,33:33,74:74,75:75,79:79}],295:[function(t,n,r){var e=t(33),i=t(84)(!1);e(e.S,"Object",{values:function values(t){return i(t)}})},{33:33,84:84}],296:[function(t,n,r){"use strict";var e=t(33),i=t(40),o=t(23),u=t(68)(),c=t(128)("observable"),a=t(3),f=t(7),s=t(6),l=t(93),h=t(42),v=t(39),p=v.RETURN,d=function(t){return null==t?void 0:a(t)},y=function(t){var n=t._c;n&&(t._c=void 0,n())},g=function(t){return void 0===t._o},m=function(t){g(t)||(t._o=void 0,y(t))},b=function(t,n){f(t),this._c=void 0,this._o=t,t=new x(this);try{var r=n(t),e=r;null!=r&&("function"==typeof r.unsubscribe?r=function(){e.unsubscribe()}:a(r),this._c=r)}catch(n){return void t.error(n)}g(this)&&y(this)};b.prototype=l({},{unsubscribe:function unsubscribe(){m(this)}});var x=function(t){this._s=t};x.prototype=l({},{next:function next(t){var n=this._s;if(!g(n)){var r=n._o;try{var e=d(r.next);if(e)return e.call(r,t)}catch(t){try{m(n)}finally{throw t}}}},error:function error(t){var n=this._s;if(g(n))throw t;var r=n._o;n._o=void 0;try{var e=d(r.error);if(!e)throw t;t=e.call(r,t)}catch(t){try{y(n)}finally{throw t}}return y(n),t},complete:function complete(t){var n=this._s;if(!g(n)){var r=n._o;n._o=void 0;try{var e=d(r.complete);t=e?e.call(r,t):void 0}catch(t){try{y(n)}finally{throw t}}return y(n),t}}});var S=function Observable(t){s(this,S,"Observable","_f")._f=a(t)};l(S.prototype,{subscribe:function subscribe(t){return new b(t,this._f)},forEach:function forEach(t){var n=this;return new(o.Promise||i.Promise)(function(r,e){a(t);var i=n.subscribe({next:function(n){try{return t(n)}catch(t){e(t),i.unsubscribe()}},error:e,complete:r})})}}),l(S,{from:function from(t){var n="function"==typeof this?this:S,r=d(f(t)[c]);if(r){var e=f(r.call(t));return e.constructor===n?e:new n(function(t){return e.subscribe(t)})}return new n(function(n){var r=!1;return u(function(){if(!r){try{if(v(t,!1,function(t){if(n.next(t),r)return p})===p)return}catch(t){if(r)throw t;return void n.error(t)}n.complete()}}),function(){r=!0}})},of:function of(){for(var t=0,n=arguments.length,r=Array(n);t<n;)r[t]=arguments[t++];return new("function"==typeof this?this:S)(function(t){var n=!1;return u(function(){if(!n){for(var e=0;e<r.length;++e)if(t.next(r[e]),n)return;t.complete()}}),function(){n=!0}})}}),h(S.prototype,c,function(){return this}),e(e.G,{Observable:S}),t(100)("Observable")},{100:100,128:128,23:23,3:3,33:33,39:39,40:40,42:42,6:6,68:68,7:7,93:93}],297:[function(t,n,r){"use strict";var e=t(33),i=t(23),o=t(40),u=t(104),c=t(91);e(e.P+e.R,"Promise",{finally:function(t){var n=u(this,i.Promise||o.Promise),r="function"==typeof t;return this.then(r?function(r){return c(n,t()).then(function(){return r})}:t,r?function(r){return c(n,t()).then(function(){throw r})}:t)}})},{104:104,23:23,33:33,40:40,91:91}],298:[function(t,n,r){"use strict";var e=t(33),i=t(69),o=t(90);e(e.S,"Promise",{try:function(t){var n=i.f(this),r=o(t);return(r.e?n.reject:n.resolve)(r.v),n.promise}})},{33:33,69:69,90:90}],299:[function(t,n,r){var e=t(67),i=t(7),o=e.key,u=e.set;e.exp({defineMetadata:function defineMetadata(t,n,r,e){u(t,n,i(r),o(e))}})},{67:67,7:7}],300:[function(t,n,r){var e=t(67),i=t(7),o=e.key,u=e.map,c=e.store;e.exp({deleteMetadata:function deleteMetadata(t,n){var r=arguments.length<3?void 0:o(arguments[2]),e=u(i(n),r,!1);if(void 0===e||!e.delete(t))return!1;if(e.size)return!0;var a=c.get(n);return a.delete(r),!!a.size||c.delete(n)}})},{67:67,7:7}],301:[function(t,n,r){var e=t(231),i=t(10),o=t(67),u=t(7),c=t(79),a=o.keys,f=o.key,s=function(t,n){var r=a(t,n),o=c(t);if(null===o)return r;var u=s(o,n);return u.length?r.length?i(new e(r.concat(u))):u:r};o.exp({getMetadataKeys:function getMetadataKeys(t){return s(u(t),arguments.length<2?void 0:f(arguments[1]))}})},{10:10,231:231,67:67,7:7,79:79}],302:[function(t,n,r){var e=t(67),i=t(7),o=t(79),u=e.has,c=e.get,a=e.key,f=function(t,n,r){if(u(t,n,r))return c(t,n,r);var e=o(n);return null!==e?f(t,e,r):void 0};e.exp({getMetadata:function getMetadata(t,n){return f(t,i(n),arguments.length<3?void 0:a(arguments[2]))}})},{67:67,7:7,79:79}],303:[function(t,n,r){var e=t(67),i=t(7),o=e.keys,u=e.key;e.exp({getOwnMetadataKeys:function getOwnMetadataKeys(t){return o(i(t),arguments.length<2?void 0:u(arguments[1]))}})},{67:67,7:7}],304:[function(t,n,r){var e=t(67),i=t(7),o=e.get,u=e.key;e.exp({getOwnMetadata:function getOwnMetadata(t,n){return o(t,i(n),arguments.length<3?void 0:u(arguments[2]))}})},{67:67,7:7}],305:[function(t,n,r){var e=t(67),i=t(7),o=t(79),u=e.has,c=e.key,a=function(t,n,r){if(u(t,n,r))return!0;var e=o(n);return null!==e&&a(t,e,r)};e.exp({hasMetadata:function hasMetadata(t,n){return a(t,i(n),arguments.length<3?void 0:c(arguments[2]))}})},{67:67,7:7,79:79}],306:[function(t,n,r){var e=t(67),i=t(7),o=e.has,u=e.key;e.exp({hasOwnMetadata:function hasOwnMetadata(t,n){return o(t,i(n),arguments.length<3?void 0:u(arguments[2]))}})},{67:67,7:7}],307:[function(t,n,r){var e=t(67),i=t(7),o=t(3),u=e.key,c=e.set;e.exp({metadata:function metadata(t,n){return function decorator(r,e){c(t,n,(void 0!==e?i:o)(r),u(e))}}})},{3:3,67:67,7:7}],308:[function(t,n,r){t(97)("Set")},{97:97}],309:[function(t,n,r){t(98)("Set")},{98:98}],310:[function(t,n,r){var e=t(33);e(e.P+e.R,"Set",{toJSON:t(20)("Set")})},{20:20,33:33}],311:[function(t,n,r){"use strict";var e=t(33),i=t(106)(!0);e(e.P,"String",{at:function at(t){return i(this,t)}})},{106:106,33:33}],312:[function(t,n,r){"use strict";var e=t(33),i=t(28),o=t(118),u=t(52),c=t(37),a=RegExp.prototype,f=function(t,n){this._r=t,this._s=n};t(54)(f,"RegExp String",function next(){var t=this._r.exec(this._s);return{value:t,done:null===t}}),e(e.P,"String",{matchAll:function matchAll(t){if(i(this),!u(t))throw TypeError(t+" is not a regexp!");var n=String(this),r="flags"in a?String(t.flags):c.call(t),e=new RegExp(t.source,~r.indexOf("g")?r:"g"+r);return e.lastIndex=o(t.lastIndex),new f(e,n)}})},{118:118,28:28,33:33,37:37,52:52,54:54}],313:[function(t,n,r){"use strict";var e=t(33),i=t(109);e(e.P,"String",{padEnd:function padEnd(t){return i(this,t,arguments.length>1?arguments[1]:void 0,!1)}})},{109:109,33:33}],314:[function(t,n,r){"use strict";var e=t(33),i=t(109);e(e.P,"String",{padStart:function padStart(t){return i(this,t,arguments.length>1?arguments[1]:void 0,!0)}})},{109:109,33:33}],315:[function(t,n,r){"use strict";t(111)("trimLeft",function(t){return function trimLeft(){return t(this,1)}},"trimStart")},{111:111}],316:[function(t,n,r){"use strict";t(111)("trimRight",function(t){return function trimRight(){return t(this,2)}},"trimEnd")},{111:111}],317:[function(t,n,r){t(126)("asyncIterator")},{126:126}],318:[function(t,n,r){t(126)("observable")},{126:126}],319:[function(t,n,r){var e=t(33);e(e.S,"System",{global:t(40)})},{33:33,40:40}],320:[function(t,n,r){t(97)("WeakMap")},{97:97}],321:[function(t,n,r){t(98)("WeakMap")},{98:98}],322:[function(t,n,r){t(97)("WeakSet")},{97:97}],323:[function(t,n,r){t(98)("WeakSet")},{98:98}],324:[function(t,n,r){for(var e=t(141),i=t(81),o=t(94),u=t(40),c=t(42),a=t(58),f=t(128),s=f("iterator"),l=f("toStringTag"),h=a.Array,v={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},p=i(v),d=0;d<p.length;d++){var y,g=p[d],m=v[g],b=u[g],x=b&&b.prototype;if(x&&(x[s]||c(x,s,h),x[l]||c(x,l,g),a[g]=h,m))for(y in e)x[y]||o(x,y,e[y],!0)}},{128:128,141:141,40:40,42:42,58:58,81:81,94:94}],325:[function(t,n,r){var e=t(33),i=t(113);e(e.G+e.B,{setImmediate:i.set,clearImmediate:i.clear})},{113:113,33:33}],326:[function(t,n,r){var e=t(40),i=t(33),o=t(46),u=t(88),c=e.navigator,a=!!c&&/MSIE .\./.test(c.userAgent),f=function(t){return a?function(n,r){return t(o(u,[].slice.call(arguments,2),"function"==typeof n?n:Function(n)),r)}:t};i(i.G+i.B+i.F*a,{setTimeout:f(e.setTimeout),setInterval:f(e.setInterval)})},{33:33,40:40,46:46,88:88}],327:[function(t,n,r){t(254),t(191),t(193),t(192),t(195),t(197),t(202),t(196),t(194),t(204),t(203),t(199),t(200),t(198),t(190),t(201),t(205),t(206),t(157),t(159),t(158),t(208),t(207),t(178),t(188),t(189),t(179),t(180),t(181),t(182),t(183),t(184),t(185),t(186),t(187),t(161),t(162),t(163),t(164),t(165),t(166),t(167),t(168),t(169),t(170),t(171),t(172),t(173),t(174),t(175),t(176),t(177),t(241),t(246),t(253),t(244),t(236),t(237),t(242),t(247),t(249),t(232),t(233),t(234),t(235),t(238),t(239),t(240),t(243),t(245),t(248),t(250),t(251),t(252),t(152),t(154),t(153),t(156),t(155),t(140),t(138),t(145),t(142),t(148),t(150),t(137),t(144),t(134),t(149),t(132),t(147),t(146),t(139),t(143),t(131),t(133),t(136),t(135),t(151),t(141),t(224),t(230),t(225),t(226),t(227),t(228),t(229),t(209),t(160),t(231),t(266),t(267),t(255),t(256),t(261),t(264),t(265),t(259),t(262),t(260),t(263),t(257),t(258),t(210),t(211),t(212),t(213),t(214),t(217),t(215),t(216),t(218),t(219),t(220),t(221),t(223),t(222),t(270),t(268),t(269),t(311),t(314),t(313),t(315),t(316),t(312),t(317),t(318),t(292),t(295),t(291),t(289),t(290),t(293),t(294),t(276),t(310),t(275),t(309),t(321),t(323),t(274),t(308),t(320),t(322),t(273),t(319),t(272),t(277),t(278),t(279),t(280),t(281),t(283),t(282),t(284),t(285),t(286),t(288),t(287),t(297),t(298),t(299),t(300),t(302),t(301),t(304),t(303),t(305),t(306),t(307),t(271),t(296),t(326),t(325),t(324),n.exports=t(23)},{131:131,132:132,133:133,134:134,135:135,136:136,137:137,138:138,139:139,140:140,141:141,142:142,143:143,144:144,145:145,146:146,147:147,148:148,149:149,150:150,151:151,152:152,153:153,154:154,155:155,156:156,157:157,158:158,159:159,160:160,161:161,162:162,163:163,164:164,165:165,166:166,167:167,168:168,169:169,170:170,171:171,172:172,173:173,174:174,175:175,176:176,177:177,178:178,179:179,180:180,181:181,182:182,183:183,184:184,185:185,
186:186,187:187,188:188,189:189,190:190,191:191,192:192,193:193,194:194,195:195,196:196,197:197,198:198,199:199,200:200,201:201,202:202,203:203,204:204,205:205,206:206,207:207,208:208,209:209,210:210,211:211,212:212,213:213,214:214,215:215,216:216,217:217,218:218,219:219,220:220,221:221,222:222,223:223,224:224,225:225,226:226,227:227,228:228,229:229,23:23,230:230,231:231,232:232,233:233,234:234,235:235,236:236,237:237,238:238,239:239,240:240,241:241,242:242,243:243,244:244,245:245,246:246,247:247,248:248,249:249,250:250,251:251,252:252,253:253,254:254,255:255,256:256,257:257,258:258,259:259,260:260,261:261,262:262,263:263,264:264,265:265,266:266,267:267,268:268,269:269,270:270,271:271,272:272,273:273,274:274,275:275,276:276,277:277,278:278,279:279,280:280,281:281,282:282,283:283,284:284,285:285,286:286,287:287,288:288,289:289,290:290,291:291,292:292,293:293,294:294,295:295,296:296,297:297,298:298,299:299,300:300,301:301,302:302,303:303,304:304,305:305,306:306,307:307,308:308,309:309,310:310,311:311,312:312,313:313,314:314,315:315,316:316,317:317,318:318,319:319,320:320,321:321,322:322,323:323,324:324,325:325,326:326}],328:[function(t,n,r){(function(t){!function(t){"use strict";function wrap(t,n,r,e){var i=n&&n.prototype instanceof Generator?n:Generator,o=Object.create(i.prototype),u=new Context(e||[]);return o._invoke=makeInvokeMethod(t,r,u),o}function tryCatch(t,n,r){try{return{type:"normal",arg:t.call(n,r)}}catch(t){return{type:"throw",arg:t}}}function Generator(){}function GeneratorFunction(){}function GeneratorFunctionPrototype(){}function defineIteratorMethods(t){["next","throw","return"].forEach(function(n){t[n]=function(t){return this._invoke(n,t)}})}function AsyncIterator(n){function invoke(t,r,e,o){var u=tryCatch(n[t],n,r);if("throw"!==u.type){var c=u.arg,a=c.value;return a&&"object"==typeof a&&i.call(a,"__await")?Promise.resolve(a.__await).then(function(t){invoke("next",t,e,o)},function(t){invoke("throw",t,e,o)}):Promise.resolve(a).then(function(t){c.value=t,e(c)},o)}o(u.arg)}function enqueue(t,n){function callInvokeWithMethodAndArg(){return new Promise(function(r,e){invoke(t,n,r,e)})}return r=r?r.then(callInvokeWithMethodAndArg,callInvokeWithMethodAndArg):callInvokeWithMethodAndArg()}"object"==typeof t.process&&t.process.domain&&(invoke=t.process.domain.bind(invoke));var r;this._invoke=enqueue}function makeInvokeMethod(t,n,r){var e=l;return function invoke(i,o){if(e===v)throw new Error("Generator is already running");if(e===p){if("throw"===i)throw o;return doneResult()}for(r.method=i,r.arg=o;;){var u=r.delegate;if(u){var c=maybeInvokeDelegate(u,r);if(c){if(c===d)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(e===l)throw e=p,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);e=v;var a=tryCatch(t,n,r);if("normal"===a.type){if(e=r.done?p:h,a.arg===d)continue;return{value:a.arg,done:r.done}}"throw"===a.type&&(e=p,r.method="throw",r.arg=a.arg)}}}function maybeInvokeDelegate(t,n){var e=t.iterator[n.method];if(e===r){if(n.delegate=null,"throw"===n.method){if(t.iterator.return&&(n.method="return",n.arg=r,maybeInvokeDelegate(t,n),"throw"===n.method))return d;n.method="throw",n.arg=new TypeError("The iterator does not provide a 'throw' method")}return d}var i=tryCatch(e,t.iterator,n.arg);if("throw"===i.type)return n.method="throw",n.arg=i.arg,n.delegate=null,d;var o=i.arg;return o?o.done?(n[t.resultName]=o.value,n.next=t.nextLoc,"return"!==n.method&&(n.method="next",n.arg=r),n.delegate=null,d):o:(n.method="throw",n.arg=new TypeError("iterator result is not an object"),n.delegate=null,d)}function pushTryEntry(t){var n={tryLoc:t[0]};1 in t&&(n.catchLoc=t[1]),2 in t&&(n.finallyLoc=t[2],n.afterLoc=t[3]),this.tryEntries.push(n)}function resetTryEntry(t){var n=t.completion||{};n.type="normal",delete n.arg,t.completion=n}function Context(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(pushTryEntry,this),this.reset(!0)}function values(t){if(t){var n=t[u];if(n)return n.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var e=-1,o=function next(){for(;++e<t.length;)if(i.call(t,e))return next.value=t[e],next.done=!1,next;return next.value=r,next.done=!0,next};return o.next=o}}return{next:doneResult}}function doneResult(){return{value:r,done:!0}}var r,e=Object.prototype,i=e.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},u=o.iterator||"@@iterator",c=o.asyncIterator||"@@asyncIterator",a=o.toStringTag||"@@toStringTag",f="object"==typeof n,s=t.regeneratorRuntime;if(s)return void(f&&(n.exports=s));s=t.regeneratorRuntime=f?n.exports:{},s.wrap=wrap;var l="suspendedStart",h="suspendedYield",v="executing",p="completed",d={},y={};y[u]=function(){return this};var g=Object.getPrototypeOf,m=g&&g(g(values([])));m&&m!==e&&i.call(m,u)&&(y=m);var b=GeneratorFunctionPrototype.prototype=Generator.prototype=Object.create(y);GeneratorFunction.prototype=b.constructor=GeneratorFunctionPrototype,GeneratorFunctionPrototype.constructor=GeneratorFunction,GeneratorFunctionPrototype[a]=GeneratorFunction.displayName="GeneratorFunction",s.isGeneratorFunction=function(t){var n="function"==typeof t&&t.constructor;return!!n&&(n===GeneratorFunction||"GeneratorFunction"===(n.displayName||n.name))},s.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,GeneratorFunctionPrototype):(t.__proto__=GeneratorFunctionPrototype,a in t||(t[a]="GeneratorFunction")),t.prototype=Object.create(b),t},s.awrap=function(t){return{__await:t}},defineIteratorMethods(AsyncIterator.prototype),AsyncIterator.prototype[c]=function(){return this},s.AsyncIterator=AsyncIterator,s.async=function(t,n,r,e){var i=new AsyncIterator(wrap(t,n,r,e));return s.isGeneratorFunction(n)?i:i.next().then(function(t){return t.done?t.value:i.next()})},defineIteratorMethods(b),b[a]="Generator",b[u]=function(){return this},b.toString=function(){return"[object Generator]"},s.keys=function(t){var n=[];for(var r in t)n.push(r);return n.reverse(),function next(){for(;n.length;){var r=n.pop();if(r in t)return next.value=r,next.done=!1,next}return next.done=!0,next}},s.values=values,Context.prototype={constructor:Context,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=r,this.done=!1,this.delegate=null,this.method="next",this.arg=r,this.tryEntries.forEach(resetTryEntry),!t)for(var n in this)"t"===n.charAt(0)&&i.call(this,n)&&!isNaN(+n.slice(1))&&(this[n]=r)},stop:function(){this.done=!0;var t=this.tryEntries[0],n=t.completion;if("throw"===n.type)throw n.arg;return this.rval},dispatchException:function(t){function handle(e,i){return u.type="throw",u.arg=t,n.next=e,i&&(n.method="next",n.arg=r),!!i}if(this.done)throw t;for(var n=this,e=this.tryEntries.length-1;e>=0;--e){var o=this.tryEntries[e],u=o.completion;if("root"===o.tryLoc)return handle("end");if(o.tryLoc<=this.prev){var c=i.call(o,"catchLoc"),a=i.call(o,"finallyLoc");if(c&&a){if(this.prev<o.catchLoc)return handle(o.catchLoc,!0);if(this.prev<o.finallyLoc)return handle(o.finallyLoc)}else if(c){if(this.prev<o.catchLoc)return handle(o.catchLoc,!0)}else{if(!a)throw new Error("try statement without catch or finally");if(this.prev<o.finallyLoc)return handle(o.finallyLoc)}}}},abrupt:function(t,n){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.tryLoc<=this.prev&&i.call(e,"finallyLoc")&&this.prev<e.finallyLoc){var o=e;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=n&&n<=o.finallyLoc&&(o=null);var u=o?o.completion:{};return u.type=t,u.arg=n,o?(this.method="next",this.next=o.finallyLoc,d):this.complete(u)},complete:function(t,n){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&n&&(this.next=n),d},finish:function(t){for(var n=this.tryEntries.length-1;n>=0;--n){var r=this.tryEntries[n];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),resetTryEntry(r),d}},catch:function(t){for(var n=this.tryEntries.length-1;n>=0;--n){var r=this.tryEntries[n];if(r.tryLoc===t){var e=r.completion;if("throw"===e.type){var i=e.arg;resetTryEntry(r)}return i}}throw new Error("illegal catch attempt")},delegateYield:function(t,n,e){return this.delegate={iterator:values(t),resultName:n,nextLoc:e},"next"===this.method&&(this.arg=r),d}}}("object"==typeof t?t:"object"==typeof window?window:"object"==typeof self?self:this)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[1]);


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// #!/usr/bin/env node
// -*- coding: utf-8 -*-
/** @module Documentation *//* !
    region header
    [Project page](http://torben.website)

    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    See http://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/// region imports
exports.__esModule=true;var _websiteUtilities=__webpack_require__(66);var _internationalisation=__webpack_require__(61);var _internationalisation2=_interopRequireDefault(_internationalisation);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}// endregion
// region plugins/classes
/**
 * This plugin holds all needed methods to extend a whole documentation site.
 * @property static:_name - Defines this class name to allow retrieving them
 * after name mangling.
 *
 * @property startUpAnimationIsComplete - Indicates whether start up animations
 * has been completed.
 * @property languageHandler - Saves a reference to the language handler.
 *
 * @property _activateLanguageSupport - Indicates whether a language switcher
 * should be activated.
 * @property _options - Options extended by the options given to the
 * initializer method.
 * @property _options.onExamplesLoaded {Function} - Callback to trigger when
 * all example loaded.
 * @property _options.domNodeSelectorPrefix {string} - 'body.{1}'
 * @property _options.codeTableWrapper {string} - Markup to use as wrapper for
 * all code highlighted examples.
 * @property _options.showExample {Object} - Options object to configure code
 * example representation.
 * @property _options.showExample.pattern {string} - Regular expression to
 * introduce a code example section.
 * @property _options.showExample.domNodeName {string} - Dom node name to
 * indicate a declarative example section.
 * @property _options.showExample.htmlWrapper {string} - HTML example wrapper.
 * @property _options.domNode {Object} - Object with a mapping of needed dom
 * node descriptions to their corresponding selectors.
 * @property _options.section {Object} - Configuration object for section
 * switches between the main page and legal notes descriptions.
 * @property _options.section.aboutThisWebsite {Object} - Configuration object
 * for transitions concerning the legal notes section.
 * @property _options.section.aboutThisWebsite.fadeOut {Object} - Fade out
 * configurations.
 * @property _options.section.aboutThisWebsite.fadeIn {Object} - Fade in
 * configurations.
 * @property _options.section.main {Object} - Configuration object for
 * transitions concerning the main section.
 * @property _options.section.main.fadeOut {Object} - Fade out configurations.
 * @property _options.section.main.fadeIn {Object} - Fade in configurations.
 */// endregion
// region declaration
class Documentation extends _websiteUtilities.$.Website.class{// region public methods
// / region special
/**
     * Initializes the interactive web application.
     * @param options - An options object.
     * @param startUpAnimationIsComplete - Indicates whether start up
     * animations has been completed.
     * @param activateLanguageSupport - Indicates whether a language handler
     * should be used or not.
     * @param languageHandler - A language handler to use. If "null" is given
     * a new handler will be created.
     * @returns Returns the current instance.
     */initialize(options={},startUpAnimationIsComplete=false,activateLanguageSupport=false,languageHandler=null){var _this=this;this.startUpAnimationIsComplete=startUpAnimationIsComplete;this._activateLanguageSupport=activateLanguageSupport;if(languageHandler)this.languageHandler=languageHandler;this._options={onExamplesLoaded:this.constructor.noop,domNodeSelectorPrefix:'body.{1}',codeTableWrapper:'<div class="table-responsive">',showExample:{pattern:'^ *showExample(: *([^ ]+))? *$',domNodeName:'#comment',htmlWrapper:`
                    <div class="show-example-wrapper">
                        <h3>
                            Example:
                            <!--deDE:Beispiel:-->
                            <!--frFR:Exemple:-->
                        </h3>
                    </div>
                `},domNode:{tableOfContentLinks:'.toc ul li a[href^="#"]',aboutThisWebsiteLink:'a[href="#about-this-website"]',homeLink:'a[href="#home"]',aboutThisWebsiteSection:'.about-this-website',mainSection:'.main-content',codeWrapper:'.codehilite',code:'.codehilite pre, code'},section:{aboutThisWebsite:{fadeOut:{duration:'fast'},fadeIn:{duration:'fast'}},main:{fadeOut:{duration:'fast'},fadeIn:{duration:'fast'}}}/*
            NOTE: We will initialize language support after examples are
            injected if activated via options.
        */};this._activateLanguageSupport=options.activateLanguageSupport;options.activateLanguageSupport=false;super.initialize(options);if(!this._activateLanguageSupport)this._activateLanguageSupport=this._parentOptions.activateLanguageSupport;if(!('location'in _websiteUtilities.$.global&&_websiteUtilities.$.global.location.hash))_websiteUtilities.$.global.location.hash=this.$domNodes.homeLink.attr('href');this.$domNodes.aboutThisWebsiteSection.hide();/*
            NOTE: We have to render examples first to avoid having dots in
            example code.
        */this._showExamples()._makeCodeEllipsis().on(this.$domNodes.tableOfContentLinks,'click',function(event){const hashReference=(0,_websiteUtilities.$)(event.target).attr('href');if(hashReference&&hashReference!=='#')_websiteUtilities.$.scrollTo(hashReference,'slow');else _this.scrollToTop()});// Handle section switch between documentation and legal notes section.
this._options.section.aboutThisWebsite.fadeOut.always=function(){return _this.$domNodes.mainSection.fadeIn(_this._options.section.main.fadeIn)};this._options.section.main.fadeOut.always=function(){return _this.$domNodes.aboutThisWebsiteSection.fadeIn(_this._options.section.aboutThisWebsite.fadeIn)};this.on(this.$domNodes.aboutThisWebsiteLink,'click',function(){return _this.scrollToTop().$domNodes.mainSection.fadeOut(_this._options.section.main.fadeOut)});this.on(this.$domNodes.homeLink,'click',function(){return _this.scrollToTop().$domNodes.aboutThisWebsiteSection.fadeOut(_this._options.section.aboutThisWebsite.fadeOut)});return this}// / endregion
// endregion
// region protected methods
// / region event handler
/**
     * This method triggers if all examples loaded.
     * @returns Returns the current instance.
     */_onExamplesLoaded(){/*
            NOTE: After injecting new dom nodes we have to grab them for
            further controller logic.
        */this.$domNodes=this.grabDomNode(this._options.domNode);// New injected dom nodes may take affect on language handler.
if(this.startUpAnimationIsComplete&&this._activateLanguageSupport&&!this._languageHandler)this._languageHandler=_websiteUtilities.$.Language(this._options.language);return this}/**
     * This method triggers if we change the current section.
     * @param sectionName - New section which should be switched to.
     * @returns Returns the current instance.
     */_onSwitchSection(sectionName){this.$domNodes.tableOfContentLinks.add(this.$domNodes.aboutThisWebsiteLink).add(this.$domNodes.homeLink).filter(`a[href="#${sectionName}"]`).trigger('click');return super._onSwitchSection(sectionName)}/**
     * This method triggers if all startup animations are ready.
     * @param parameter - All parameter will be forwarded to registered event
     * handler callbacks.
     * @returns Returns the current instance.
     */_onStartUpAnimationComplete(...parameter){if(this._activateLanguageSupport&&!this._languageHandler)this._languageHandler=_websiteUtilities.$.Language(this._options.language);// All start up effects are ready. Handle direct section links.
this.startUpAnimationIsComplete=true;if('location'in _websiteUtilities.$.global)this.$domNodes.tableOfContentLinks.add(this.$domNodes.aboutThisWebsiteLink).filter('a[href="'+_websiteUtilities.$.global.location.href.substr(_websiteUtilities.$.global.location.href.indexOf('#'))+'"]').trigger('click');return super._onStartUpAnimationComplete(...parameter)}// / endregion
/**
     * This method makes dotes after code lines which are too long. This
     * prevents line wrapping.
     * @returns Returns the current instance.
     */_makeCodeEllipsis(){var _this2=this;this.$domNodes.code.each(function(index,domNode){const $domNode=(0,_websiteUtilities.$)(domNode);const tableParent=$domNode.closest('table');if(tableParent.length)tableParent.wrap(_this2._options.codeTableWrapper);let newContent='';const codeLines=$domNode.html().split('\n');let subIndex=0;for(const value of codeLines){/*
                    NOTE: Wrap a div object to grantee that $ will accept the
                    input.
                */const excess=(0,_websiteUtilities.$)(`<div>${value}</div>`).text().length-79;if(excess>0)newContent+=_this2._replaceExcessWithDots(value,excess);else newContent+=value;if(subIndex+1!==codeLines.length)newContent+='\n';subIndex+=1}$domNode.html(newContent)});return this}/**
     * Replaces given html content with a shorter version trimmed by given
     * amount of excess.
     * @param content - String to trim.
     * @param excess - Amount of excess.
     * @returns Returns the trimmed content.
     */_replaceExcessWithDots(content,excess){// Add space for ending dots.
excess+=3;let newContent='';let $content;$content=(0,_websiteUtilities.$)(`<wrapper>${content}</wrapper>`);for(const domNode of $content.contents().get().reverse()){const $wrapper=(0,_websiteUtilities.$)(domNode).wrap('<wrapper>').parent();let contentSnippet=$wrapper.html();if(!contentSnippet)contentSnippet=domNode.textContent;if(excess)if(domNode.textContent.length<excess){excess-=domNode.textContent.length;contentSnippet=''}else if(domNode.textContent.length>=excess){/*
                        NOTE: We have to ensure that no html tag will be
                        shortend: We work on "textContent" property only.
                    */domNode.textContent=domNode.textContent.substr(0,domNode.textContent.length-excess-1)+'...';excess=0;contentSnippet=$wrapper.html();if(!contentSnippet)contentSnippet=domNode.textContent}newContent=contentSnippet+newContent}return newContent}/**
     * Shows marked example codes directly in browser.
     * @returns Returns the current instance.
     */_showExamples(){var _this3=this;this.$domNodes.parent.find(':not(iframe)').contents().each(function(index,domNode){if(domNode.nodeName===_this3._options.showExample.domNodeName){const match=domNode.textContent.match(new RegExp(_this3._options.showExample.pattern));if(match){const $codeDomNode=(0,_websiteUtilities.$)(domNode).next();let code=$codeDomNode.find(_this3.$domNodes.codeWrapper).text();if(!code)code=$codeDomNode.text();try{if(match.length>2&&match[2]){if(['javascript','javascripts','js'].includes(match[2].toLowerCase()))$codeDomNode.after((0,_websiteUtilities.$)('<script>').attr('type','text/javascript').text(code));else if(['css','cascadingstylesheet','cascadingstylesheets','stylesheet','stylesheets','sheet','sheets','style','styles'].includes(match[2].toLowerCase()))$codeDomNode.after((0,_websiteUtilities.$)('<style>').attr('type','text/css').text(code));else if(match[2].toLowerCase()==='hidden')$codeDomNode.after(code);else $codeDomNode.after((0,_websiteUtilities.$)(_this3._options.showExample.htmlWrapper).append(code));}else $codeDomNode.after((0,_websiteUtilities.$)(_this3._options.showExample.htmlWrapper).append(code))}catch(error){_this3.critical(`Error while integrating code "${code}": ${error}`)}}}});this.fireEvent('examplesLoaded');return this}// endregion
}exports.default=Documentation;// endregion
Documentation._name='Documentation';_websiteUtilities.$.Documentation=function(...parameter){return _websiteUtilities.$.Tools().controller(Documentation,parameter)};_websiteUtilities.$.Documentation.class=Documentation;if(false){const offlineHandler=require('offline-plugin/runtime');offlineHandler.install({// NOTE: Tell the new service worker to take control immediately.
onUpdateReady:function onUpdateReady(){return offlineHandler.applyUpdate()}})}// NOTE: We make jQuery available to make bootstrapping examples with deferred
// script loading simpler.
_websiteUtilities.$.global.$documentationWebsite=_websiteUtilities.$;_websiteUtilities.$.noConflict(true)(function($){return $.Documentation({trackingCode: false?null:'UA-40192634-10',language:{selection: false?[]:['deDE', 'enUS'],sessionDescription:'documentationWebsite{1}'}})});// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory(__webpack_require__(19), __webpack_require__(20), __webpack_require__(54), __webpack_require__(61), __webpack_require__(125), __webpack_require__(126));
	else if(typeof define === 'function' && define.amd)
		define("website-utilities", ["babel-runtime/helpers/asyncToGenerator", "babel-runtime/core-js/promise", "clientnode", "internationalisation", 'jQuery-scrollTo', 'jQuery-spin'], factory);
	else if(typeof exports === 'object')
		exports["website-utilities"] = factory(require("babel-runtime/helpers/asyncToGenerator"), require("babel-runtime/core-js/promise"), require("clientnode"), require("internationalisation"), require('jQuery-scrollTo'), require('jQuery-spin'));
	else
		root['websiteUtilities'] = factory(root["babel-runtime/helpers/asyncToGenerator"], root["babel-runtime/core-js/promise"], root["clientnode"], root["internationalisation"], root["$.fn.scrollTo"], root["$.fn.spin"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_8__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(2);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// #!/usr/bin/env node
// -*- coding: utf-8 -*-
/** @module website-utilities *//* !
    region header
    [Project page](http://torben.website/websiteUtilities)

    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    See http://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/// region imports
exports.__esModule=true;exports.$=undefined;var _asyncToGenerator2=__webpack_require__(3);var _asyncToGenerator3=_interopRequireDefault(_asyncToGenerator2);var _promise=__webpack_require__(4);var _promise2=_interopRequireDefault(_promise);var _clientnode=__webpack_require__(5);var _internationalisation=__webpack_require__(6);var _internationalisation2=_interopRequireDefault(_internationalisation);__webpack_require__(7);__webpack_require__(8);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}const $=exports.$=_clientnode.$;// endregion
// region types
// endregion
// region plugins/classes
/**
 * This plugin holds all needed methods to extend a whole website.###
 * @property static:_name - Defines this class name to allow retrieving them
 * after name mangling.
 *
 * @property $domNodes - Saves a set of references to all needed dom nodes.
 * @property currentMediaQueryMode - Saves current media query status depending
 * on available space in current browser window.
 * @property currentSectionName - Saves current section hash name.
 * @property languageHandler - Reference to the language switcher instance.
 * @property startUpAnimationIsComplete - Indicates whether start up animations
 * has finished.
 * @property viewportIsOnTop - Indicates whether current viewport is on top.
 *
 * @property _analyticsCode - Saves analytics code snippets to use for
 * referenced situations.
 * @property _analyticsCode.initial {string} - Initial string to use for
 * analyses on.
 * @property _analyticsCode.sectionSwitch {string} - Code to execute on each
 * section switch. Current page is available via "{1}" string formatting.
 * @property _analyticsCod.event {string} - Code to execute on each fired
 * event.
 * @property _options - Options extended by the options given to the
 * initializer method.
 * @property _parentOptions - Saves default options to extend by options given
 * to the initializer method.
 * @property _parentOptions.domNodeSelectorPrefix {string} - Selector prefix
 * for all nodes to take into account.
 * @property _parantOptions.onViewportMovesToTop {Function} - Callback to
 * trigger when viewport arrives at top.
 * @property _parantOptions.onViewportMovesAwayFromTop {Function} - Callback to
 * trigger when viewport moves away from top.
 * @property _parentOptions.onChangeToLargeMode {Function} - Callback to
 * trigger if media query mode changes to large mode.
 * @property _parentOptions.onChangeToMediumMode {Function} - Callback to
 * trigger if media query mode changes to medium mode.
 * @property _parentOptions.onChangeToSmallMode {Function} - Callback to
 * trigger if media query mode changes to small mode.
 * @property _parentOptions.onChangeToExtraSmallMode {Function} - Callback to
 * trigger if media query mode changes to extra small mode.
 * @property _parentOptions.onChangeMediaQueryMode {Function} - Callback to
 * trigger if media query mode changes.
 * @property _parentOptions.onSwitchSection {Function} - Callback to trigger if
 * current section switches.
 * @property _parentOptions.onStartUpAnimationComplete {Function} - Callback to
 * trigger if all start up animations has finished.
 * @property _parentOptions.knownScrollEventNames {string} - Saves all known
 * scroll events in a space separated string.
 * @property _parentOption.switchToManualScrollingIndicator {Function} -
 * Indicator function to stop currently running scroll animations to let the
 * user get control of current scrolling behavior. Given callback gets an event
 * object. If the function returns "true" current animated scrolls will be
 * stopped.
 * @property _parentOptions.additionalPageLoadingTimeInMilliseconds {Number} -
 * Additional time to wait until page will be indicated as loaded.
 * @property _parentOptions.trackingCode - Analytic tracking code to collect
 * user behavior data.
 * @property _parentOptions.mediaQueryClassNameIndicator
 * {Array.Array.<string>} - Mapping of media query class indicator names to
 * internal event names.
 * @property _parentOptions.domNode {Object.<string, string>} - Mapping of
 * dom node descriptions to their corresponding selectors.
 * @property _parentOptions.domNode.mediaQueryIndicator {string} - Selector
 * for indicator dom node to use to trigger current media query mode.
 * @property _parentOptions.domNode.top {string} - Selector to indicate that
 * viewport is currently on top.
 * @property _parentOptions.domNode.scrollToTopButton {string} - Selector for
 * starting an animated scroll to top.
 * @property _parentOption.domNode.startUpAnimationClassPrefix {string} -
 * Class name selector prefix for all dom nodes to appear during start up
 * animations.
 * @property _parentOptions.domNode.windowLoadingCover {string} - Selector
 * to the full window loading cover dom node.
 * @property _parentOptions.domNode.windowLoadingSpinner {string} - Selector
 * to the window loading spinner (on top of the window loading cover).
 * @property _parentOption.startUpShowAnimation {Object} - Options for startup
 * show in animation.
 * @property _parentOption.startUpHide {Object} - Options for initially hiding
 * dom nodes showing on startup later.
 * @property _parentOptions.windowLoadingCoverHideAnimation {Object} - Options
 * for startup loading cover hide animation.
 * @property _parentOptions.startUpAnimationElementDelayInMiliseconds {number}
 * - Delay between two startup animated dom nodes in order.
 * @property _parentOptions.windowLoadingSpinner {Object} - Options for the
 * window loading cover spinner.
 * @property _parentOptions.activateLanguageSupport {boolean} - Indicates
 * whether language support should be used or not.
 * @property _parentOptions.language {Object} - Options for client side
 * internationalisation handler.
 * @property _parentOptions.scrollTop {Object} - Options for automated scroll
 * top animation.
 * @property _parentOptions.domain {string} - Sets current domain name. If
 * "auto" is given it will be determined automatically.
 */class Website extends $.Tools.class{// region public methods
// / region special
/**
     * Initializes the interactive web application.
     * @param options - An options object.
     * @param parentOptions - A default options object.
     * @param startUpAnimationIsComplete - If set to "true", no start up
     * animation will be performed.
     * @param currentSectionName - Initial section name to use.
     * @param viewportIsOnTop - Indicates whether viewport is on top initially.
     * @param currentMediaQueryMode - Initial media query mode to use (until
     * first window resize event could trigger a change).
     * @param languageHandler - Language handler instance to use.
     * @param analyticsCode - Analytic code snippet to use.
     * @returns Returns the current instance.
     */initialize(options={},parentOptions={activateLanguageSupport:true,additionalPageLoadingTimeInMilliseconds:0,domain:'auto',domNode:{mediaQueryIndicator:'<div class="media-query-indicator">',top:'header',scrollToTopButton:'a[href="#top"]',startUpAnimationClassPrefix:'.website-start-up-animation-number-',windowLoadingCover:'.website-window-loading-cover',windowLoadingSpinner:'.website-window-loading-cover > div'},domNodeSelectorPrefix:'body.{1}',knownScrollEventNames:'scroll mousedown wheel DOMMouseScroll mousewheel keyup '+'touchmove',language:{},mediaQueryClassNameIndicator:[['extraSmall','xs'],['small','sm'],['medium','md'],['large','lg']],onViewportMovesToTop:Website.noop,onViewportMovesAwayFromTop:Website.noop,onChangeToLargeMode:Website.noop,onChangeToMediumMode:Website.noop,onChangeToSmallMode:Website.noop,onChangeToExtraSmallMode:Website.noop,onChangeMediaQueryMode:Website.noop,onSwitchSection:Website.noop,onStartUpAnimationComplete:Website.noop,startUpAnimationElementDelayInMiliseconds:100,startUpShowAnimation:[{opacity:1},{}],startUpHide:{opacity:0},switchToManualScrollingIndicator:function switchToManualScrollingIndicator(event){return event.which>0||event.type==='mousedown'||event.type==='mousewheel'||event.type==='touchmove'},scrollToTop:{inLinearTime:false,options:{duration:'normal'},button:{slideDistanceInPixel:30,showAnimation:{duration:'normal'},hideAnimation:{duration:'normal'}}},trackingCode:null,windowLoadingCoverHideAnimation:[{opacity:0},{}],windowLoadingSpinner:{lines:9,// The number of lines to draw
length:23,// The length of each line
width:11,// The line thickness
radius:40,// The radius of the inner circle
corners:1,// Corner roundness (0..1)
rotate:75,// The rotation offset
color:'#000',// #rgb or #rrggbb
speed:1.1,// Rounds per second
trail:58,// Afterglow percentage
shadow:false,// Whether to render a shadow
hwaccel:false,// Whether to use hardware acceleration
className:'spinner',// CSS class to assign to the spinner
zIndex:2e9,// The z-index (defaults to 2000000000)
top:'auto',// Top position relative to parent in px
left:'auto'// Left position relative to parent in px
},windowLoadedTimeoutAfterDocumentLoadedInMilliseconds:2000},startUpAnimationIsComplete=false,currentSectionName=null,viewportIsOnTop=false,currentMediaQueryMode='',languageHandler=null,analyticsCode={initial:`
                (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=`+'i[r]||function(){'+'(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*'+'new window.Date();'+'a=s.createElement(o),m=s.getElementsByTagName(o)[0];'+'a.async=1;a.src=g;'+'m.parentNode.insertBefore(a,m)})('+`window,document,'script','//www.google-analytics.com/`+`analytics.js','ga');`+`window.ga('create', '{1}', '{2}');
                window.ga('set', 'anonymizeIp', true);
                window.ga('send', 'pageview', {page: '{3}'});
            `,sectionSwitch:`window.ga('send', 'pageview', {page: '{1}'});`,event:`window.ga(
                'send', 'event', eventCategory, eventAction, eventLabel,
                eventValue, eventData);
            `}){var _this=this;this._parentOptions=parentOptions;this.startUpAnimationIsComplete=startUpAnimationIsComplete;this.viewportIsOnTop=viewportIsOnTop;this.currentMediaQueryMode=currentMediaQueryMode;this.languageHandler=languageHandler;this._analyticsCode=analyticsCode;if(currentSectionName)this.currentSectionName=currentSectionName;else if('location'in $.global&&$.global.location.hash)this.currentSectionName=$.global.location.hash.substring('#'.length);else this.currenSectionName='home';// Wrap event methods with debounceing handler.
// IgnoreTypeCheck
this._onViewportMovesToTop=this.constructor.debounce(this._onViewportMovesToTop.bind(this));// IgnoreTypeCheck
this._onViewportMovesAwayFromTop=this.constructor.debounce(this._onViewportMovesAwayFromTop.bind(this));this._options=this.constructor.extendObject(true,{},this._parentOptions,this._options);super.initialize(options);this.$domNodes=this.grabDomNode(this._options.domNode);this.disableScrolling();return new _promise2.default(function(resolve){_this._options.windowLoadingCoverHideAnimation[1].always=function(){_this._handleStartUpEffects();resolve(_this)};if(_this.$domNodes.windowLoadingSpinner.length)_this.$domNodes.windowLoadingSpinner.spin(_this._options.windowLoadingSpinner);_this._bindScrollEvents().$domNodes.parent.show();if('window'in _this.$domNodes){const onLoaded=function onLoaded(){if(!_this.windowLoaded){_this.windowLoaded=true;_this._removeLoadingCover()}};$(function(){return _this.constructor.timeout(onLoaded,_this._options.windowLoadedTimeoutAfterDocumentLoadedInMilliseconds)});_this.on(_this.$domNodes.window,'load',onLoaded)}_this._addNavigationEvents()._addMediaQueryChangeEvents()._triggerWindowResizeEvents()._handleAnalyticsInitialisation();if(!_this._options.language.logging)_this._options.language.logging=_this._options.logging;if(_this._options.activateLanguageSupport&&!_this.languageHandler)$.Language(_this._options.language).then(function(languageHandler){_this.languageHandler=languageHandler})})}// endregion
/**
     * Scrolls to top of page. Runs the given function after viewport arrives.
     * @param onAfter - Callback to call after effect has finished.
     * @returns Returns the current instance.
     */scrollToTop(onAfter=Website.noop){if(!('document'in $.global))return this;this._options.scrollToTop.options.onAfter=onAfter;/*
            NOTE: This is a workaround to avoid a bug in "jQuery.scrollTo()"
            expecting this property exists.
        */Object.defineProperty($.global.document,'body',{value:$('body')[0]});if(this._options.scrollToTop.inLinearTime){const distanceToTopInPixel=this.$domNodes.window.scrollTop();// Scroll four times faster as we have distance to top.
this._options.scrollToTop.options.duration=distanceToTopInPixel/4;this.$domNodes.window.scrollTo({top:`-=${distanceToTopInPixel}`,left:'+=0'},this._options.scrollToTop.options)}else this.$domNodes.window.scrollTo({top:0,left:0},this._options.scrollToTop.options);return this}/**
     * This method disables scrolling on the given web view.
     * @returns Returns the current instance.
     */disableScrolling(){this.$domNodes.parent.addClass('disable-scrolling').on('touchmove',function(event){return event.preventDefault()});return this}/**
     * This method disables scrolling on the given web view.
     * @returns Returns the current instance.
     */enableScrolling(){this.off(this.$domNodes.parent.removeClass('disable-scrolling','touchmove'));return this}/**
     * Triggers an analytics event. All given arguments are forwarded to
     * configured analytics event code to defined their environment variables.
     * @param parameter - All parameter will be forwarded to the analytics
     * code.
     * @returns Returns the current instance.
     */triggerAnalyticsEvent(...parameter){if(this._options.trackingCode&&'location'in $.global&&$.global.location.hostname!=='localhost'){this.debug('Run analytics code: "#{this._analyticsCode.event}" with '+'arguments:');this.debug(parameter);try{new Function('eventCategory','eventAction','eventLabel','eventData','eventValue',this._analyticsCode.event).call(this,...parameter)}catch(exception){this.warn('Problem in google analytics event code snippet: {1}',exception)}}return this}// endregion
// region protected methods
// / region event
/**
     * This method triggers if the viewport moves to top.
     * @returns Returns the current instance.
     */_onViewportMovesToTop(){var _this2=this;if(this.$domNodes.scrollToTopButton.css('visibility')==='hidden')this.$domNodes.scrollToTopButton.css('opacity',0);else{this._options.scrollToTop.button.hideAnimation.always=function(){return _this2.$domNodes.scrollToTopButton.css({bottom:`-=${_this2._options.scrollToTop.button.slideDistanceInPixel}`,display:'none'})};this.$domNodes.scrollToTopButton.finish().animate({bottom:'+='+this._options.scrollToTop.button.slideDistanceInPixel,opacity:0},this._options.scrollToTop.button.hideAnimation)}return this}/**
     * This method triggers if the viewport moves away from top.
     * @returns Returns the current instance.
     */_onViewportMovesAwayFromTop(){if(this.$domNodes.scrollToTopButton.css('visibility')==='hidden')this.$domNodes.scrollToTopButton.css('opacity',1);else this.$domNodes.scrollToTopButton.finish().css({bottom:'+='+this._options.scrollToTop.button.slideDistanceInPixel,display:'block',opacity:0}).animate({bottom:'-='+this._options.scrollToTop.button.slideDistanceInPixel,queue:false,opacity:1},this._options.scrollToTop.button.showAnimation);return this}/* eslint-disable no-unused-vars *//**
     * This method triggers if the responsive design switches to another mode.
     * @param oldMode - Saves the previous mode.
     * @param newMode - Saves the new mode.
     * @returns Returns the current instance.
     */_onChangeMediaQueryMode(oldMode,newMode){return this}/**
     * This method triggers if the responsive design switches to large mode.
     * @param oldMode - Saves the previous mode.
     * @param newMode - Saves the new mode.
     * @returns Returns the current instance.
     */_onChangeToLargeMode(oldMode,newMode){return this}/**
     * This method triggers if the responsive design switches to medium mode.
     * @param oldMode - Saves the previous mode.
     * @param newMode - Saves the new mode.
     * @returns Returns the current instance.
     */_onChangeToMediumMode(oldMode,newMode){return this}/**
     * This method triggers if the responsive design switches to small mode.
     * @param oldMode - Saves the previous mode.
     * @param newMode - Saves the new mode.
     * @returns Returns the current instance.
     */_onChangeToSmallMode(oldMode,newMode){return this}/**
     * This method triggers if the responsive design switches to extra small
     * mode.
     * @param oldMode - Saves the previous mode.
     * @param newMode - Saves the new mode.
     * @returns Returns the current instance.
     */_onChangeToExtraSmallMode(oldMode,newMode){return this}/* eslint-enable no-unused-vars *//**
     * This method triggers if we change the current section.
     * @param sectionName - Contains the new section name.
     * @returns Returns the current instance.
     */_onSwitchSection(sectionName){if(this._options.trackingCode&&this._options.trackingCode!=='__none__'&&'location'in $.global&&$.global.location.hostname!=='localhost'&&this.currentSectionName!==sectionName){this.currentSectionName=sectionName;this.debug(`Run analytics code: "${this._analyticsCode.sectionSwitch}"`,this.currentSectionName);try{new Function(this.constructor.stringFormat(this._analyticsCode.sectionSwitch,this.currentSectionName))()}catch(exception){this.warn('Problem in analytics section switch code snippet: {1}',exception)}}return this}/**
     * This method is complete if last startup animation was initialized.
     * @returns Returns the current instance.
     */_onStartUpAnimationComplete(){this.startUpAnimationIsComplete=true;return this}// endregion
// / region helper
/**
     * This method adds triggers for responsive design switches.
     * @returns Returns the current instance.
     */_addMediaQueryChangeEvents(){this.on(this.$domNodes.window,'resize',this._triggerWindowResizeEvents.bind(this));return this}/**
     * This method triggers if the responsive design switches its mode.
     * @param parameter - All arguments will be appended to the event handler
     * callbacks.
     * @returns Returns the current instance.
     */_triggerWindowResizeEvents(...parameter){for(const classNameMapping of this._options.mediaQueryClassNameIndicator){this.$domNodes.mediaQueryIndicator.prependTo(this.$domNodes.parent).addClass(`hidden-${classNameMapping[1]}`);if(this.$domNodes.mediaQueryIndicator.is(':hidden')&&classNameMapping[0]!==this.currentMediaQueryMode){this.fireEvent('changeMediaQueryMode',false,this,this.currentMediaQueryMode,classNameMapping[0],...parameter);this.fireEvent(this.constructor.stringFormat(`changeTo{1}Mode`,this.constructor.stringCapitalize(classNameMapping[0])),false,this,this.currentMediaQueryMode,classNameMapping[0],...parameter);this.currentMediaQueryMode=classNameMapping[0]}this.$domNodes.mediaQueryIndicator.removeClass(`hidden-${classNameMapping[1]}`)}return this}/**
     * This method triggers if view port arrives at special areas.
     * @param parameter - All arguments will be appended to the event handler
     * callbacks.
     * @returns Returns the current instance.
     */_bindScrollEvents(...parameter){var _this3=this;// Stop automatic scrolling if the user wants to scroll manually.
if(!('window'in this.$domNodes))return this;const $scrollTarget=$('body, html').add(this.$domNodes.window);$scrollTarget.on(this._options.knownScrollEventNames,function(event){if(_this3._options.switchToManualScrollingIndicator(event))$scrollTarget.stop(true)});this.on(this.$domNodes.window,'scroll',function(){if(_this3.$domNodes.window.scrollTop()){if(_this3.viewportIsOnTop){_this3.viewportIsOnTop=false;_this3.fireEvent('viewportMovesAwayFromTop',false,_this3,...parameter)}}else if(!_this3.viewportIsOnTop){_this3.viewportIsOnTop=true;_this3.fireEvent('viewportMovesToTop',false,_this3,...parameter)}});if(this.$domNodes.window.scrollTop()){this.viewportIsOnTop=false;this.fireEvent('viewportMovesAwayFromTop',false,this,...parameter)}else{this.viewportIsOnTop=true;this.fireEvent('viewportMovesToTop',false,this,...parameter)}return this}/**
     * This method triggers after window is loaded.
     * @returns Returns the current instance.
     */_removeLoadingCover(){var _this4=this;return(0,_asyncToGenerator3.default)(function*(){yield _this4.constructor.timeout(_this4._options.additionalPageLoadingTimeInMilliseconds);// Hide startup animation dom nodes to show them step by step.
$(_this4.constructor.stringFormat('[class^="{1}"], [class*=" {1}"]',_this4.sliceDomNodeSelectorPrefix(_this4._options.domNode.startUpAnimationClassPrefix).substr(1))).css(_this4._options.startUpHide);if(_this4.$domNodes.windowLoadingCover.length)_this4.enableScrolling().$domNodes.windowLoadingCover.animate(..._this4._options.windowLoadingCoverHideAnimation);else _this4._options.windowLoadingCoverHideAnimation[1].always();return _this4})()}/**
     * This method handles the given start up effect step.
     * @param elementNumber - The current start up step.
     * @returns Returns the current instance.
     */_handleStartUpEffects(elementNumber=1){var _this5=this;return(0,_asyncToGenerator3.default)(function*(){// Stop and delete spinner instance.
_this5.$domNodes.windowLoadingCover.hide();if(_this5.$domNodes.windowLoadingSpinner.length)_this5.$domNodes.windowLoadingSpinner.spin(false);if($(_this5.constructor.stringFormat('[class^="{1}"], [class*=" {1}"]',_this5.sliceDomNodeSelectorPrefix(_this5._options.domNode.startUpAnimationClassPrefix).substr(1))).length){yield _this5.constructor.timeout(_this5._options.startUpAnimationElementDelayInMiliseconds);let lastElementTriggered=false;_this5._options.startUpShowAnimation[1].always=function(){if(lastElementTriggered)_this5.fireEvent('startUpAnimationComplete')};const $domNode=$(_this5._options.domNode.startUpAnimationClassPrefix+elementNumber);$domNode.animate(..._this5._options.startUpShowAnimation);if($(_this5._options.domNode.startUpAnimationClassPrefix+(elementNumber+1)).length)yield _this5._handleStartUpEffects(elementNumber+1);else lastElementTriggered=true}else _this5.fireEvent('startUpAnimationComplete');return _this5})()}/**
     * This method adds triggers to switch section.
     * @returns Returns the current instance.
     */_addNavigationEvents(){var _this6=this;if('addEventListener'in $.global)$.global.addEventListener('hashchange',function(){if(_this6.startUpAnimationIsComplete)_this6.fireEvent('switchSection',false,_this6,location.hash.substring('#'.length))},false);return this._handleScrollToTopButton()}/**
     * Adds trigger to scroll top buttons.
     * @returns Returns the current instance.
     */_handleScrollToTopButton(){var _this7=this;this.on(this.$domNodes.scrollToTopButton,'click',function(event){event.preventDefault();_this7.scrollToTop()});return this}/**
     * Executes the page tracking code.
     * @returns Returns the current instance.
     */_handleAnalyticsInitialisation(){var _this8=this;if(this._options.trackingCode&&this._options.trackingCode!=='__none__'&&'location'in $.global&&$.global.location.hostname!=='localhost'){this.debug(`Run analytics code: "${this._analyticsCode.initial}"`,this._options.trackingCode,this._options.domain,this.currentSectionName);try{new Function(this.constructor.stringFormat(this._analyticsCode.initial,this._options.trackingCode,this._options.domain,this.currentSectionName))()}catch(exception){this.warn('Problem in analytics initial code snippet: {1}',exception)}this.on(this.$domNodes.parent.find('a, button'),'click',function(event){const $domNode=$(event.target);_this8.triggerAnalyticsEvent(_this8.currentSectionName,'click',$domNode.text(),event.data||{},$domNode.attr('website-analytics-value')||1)})}return this}// / endregion
// endregion
}exports.default=Website;// endregion
Website._name='Website';$.Website=function(...parameter){return $.Tools().controller(Website,parameter)};$.Website.class=Website;// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ })
/******/ ]);
});

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(21);
__webpack_require__(22);
__webpack_require__(32);
__webpack_require__(78);
__webpack_require__(85);
__webpack_require__(86);
module.exports = __webpack_require__(0).Promise;


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(23);
var defined = __webpack_require__(24);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(9) && !__webpack_require__(11)(function () {
  return Object.defineProperty(__webpack_require__(26)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(4);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(6);


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(42);
var descriptor = __webpack_require__(41);
var setToStringTag = __webpack_require__(17);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(6)(IteratorPrototype, __webpack_require__(3)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(7);
var anObject = __webpack_require__(8);
var getKeys = __webpack_require__(27);

module.exports = __webpack_require__(9) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(14);
var toLength = __webpack_require__(28);
var toAbsoluteIndex = __webpack_require__(75);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(23);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(77);
var step = __webpack_require__(48);
var Iterators = __webpack_require__(13);
var toIObject = __webpack_require__(14);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(25)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),
/* 77 */
/***/ (function(module, exports) {

module.exports = function () { /* empty */ };


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(40);
var global = __webpack_require__(2);
var ctx = __webpack_require__(5);
var classof = __webpack_require__(33);
var $export = __webpack_require__(1);
var isObject = __webpack_require__(4);
var aFunction = __webpack_require__(10);
var anInstance = __webpack_require__(34);
var forOf = __webpack_require__(16);
var speciesConstructor = __webpack_require__(49);
var task = __webpack_require__(50).set;
var microtask = __webpack_require__(83)();
var newPromiseCapabilityModule = __webpack_require__(35);
var perform = __webpack_require__(51);
var promiseResolve = __webpack_require__(52);
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[__webpack_require__(3)('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value);
            if (domain) domain.exit();
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  if (promise._h == 1) return false;
  var chain = promise._a || promise._c;
  var i = 0;
  var reaction;
  while (chain.length > i) {
    reaction = chain[i++];
    if (reaction.fail || !isUnhandled(reaction.promise)) return false;
  } return true;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__(36)($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__(17)($Promise, PROMISE);
__webpack_require__(53)(PROMISE);
Wrapper = __webpack_require__(0)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(84)(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(8);
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__(13);
var ITERATOR = __webpack_require__(3)('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(33);
var ITERATOR = __webpack_require__(3)('iterator');
var Iterators = __webpack_require__(13);
module.exports = __webpack_require__(0).getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),
/* 82 */
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var macrotask = __webpack_require__(50).set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__(15)(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if (Observer) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    var promise = Promise.resolve();
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__(3)('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// https://github.com/tc39/proposal-promise-finally

var $export = __webpack_require__(1);
var core = __webpack_require__(0);
var global = __webpack_require__(2);
var speciesConstructor = __webpack_require__(49);
var promiseResolve = __webpack_require__(52);

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-promise-try
var $export = __webpack_require__(1);
var newPromiseCapability = __webpack_require__(35);
var perform = __webpack_require__(51);

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(88), __esModule: true };

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(21);
__webpack_require__(22);
__webpack_require__(32);
__webpack_require__(89);
__webpack_require__(94);
__webpack_require__(96);
__webpack_require__(97);
module.exports = __webpack_require__(0).Set;


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__(55);
var validate = __webpack_require__(37);
var SET = 'Set';

// 23.2 Set Objects
module.exports = __webpack_require__(57)(SET, function (get) {
  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
  }
}, strong);


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = __webpack_require__(5);
var IObject = __webpack_require__(44);
var toObject = __webpack_require__(18);
var toLength = __webpack_require__(28);
var asc = __webpack_require__(91);
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__(92);

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
var isArray = __webpack_require__(93);
var SPECIES = __webpack_require__(3)('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(15);
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = __webpack_require__(1);

$export($export.P + $export.R, 'Set', { toJSON: __webpack_require__(58)('Set') });


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

var forOf = __webpack_require__(16);

module.exports = function (iter, ITERATOR) {
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-set.of
__webpack_require__(59)('Set');


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-set.from
__webpack_require__(60)('Set');


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(99), __esModule: true };

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(100);
var $Object = __webpack_require__(0).Object;
module.exports = function getOwnPropertyNames(it) {
  return $Object.getOwnPropertyNames(it);
};


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 Object.getOwnPropertyNames(O)
__webpack_require__(38)('getOwnPropertyNames', function () {
  return __webpack_require__(101).f;
});


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(14);
var gOPN = __webpack_require__(102).f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__(43);
var hiddenKeys = __webpack_require__(31).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(104), __esModule: true };

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(105);
module.exports = __webpack_require__(0).Object.values;


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-values-entries
var $export = __webpack_require__(1);
var $values = __webpack_require__(106)(false);

$export($export.S, 'Object', {
  values: function values(it) {
    return $values(it);
  }
});


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

var getKeys = __webpack_require__(27);
var toIObject = __webpack_require__(14);
var isEnum = __webpack_require__(107).f;
module.exports = function (isEntries) {
  return function (it) {
    var O = toIObject(it);
    var keys = getKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) if (isEnum.call(O, key = keys[i++])) {
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};


/***/ }),
/* 107 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(109), __esModule: true };

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(110);
module.exports = __webpack_require__(0).Object.keys;


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(18);
var $keys = __webpack_require__(27);

__webpack_require__(38)('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(112), __esModule: true };

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(21);
__webpack_require__(22);
__webpack_require__(32);
__webpack_require__(113);
__webpack_require__(114);
__webpack_require__(115);
__webpack_require__(116);
module.exports = __webpack_require__(0).Map;


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__(55);
var validate = __webpack_require__(37);
var MAP = 'Map';

// 23.1 Map Objects
module.exports = __webpack_require__(57)(MAP, function (get) {
  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(validate(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
  }
}, strong, true);


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = __webpack_require__(1);

$export($export.P + $export.R, 'Map', { toJSON: __webpack_require__(58)('Map') });


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-map.of
__webpack_require__(59)('Map');


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-map.from
__webpack_require__(60)('Map');


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(118), __esModule: true };

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(0);
var $JSON = core.JSON || (core.JSON = { stringify: JSON.stringify });
module.exports = function stringify(it) { // eslint-disable-line no-unused-vars
  return $JSON.stringify.apply($JSON, arguments);
};


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(120), __esModule: true };

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(121);
module.exports = __webpack_require__(0).Number.isNaN;


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.4 Number.isNaN(number)
var $export = __webpack_require__(1);

$export($export.S, 'Number', {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare
    return number != number;
  }
});


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(123), __esModule: true };

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(124);
module.exports = __webpack_require__(0).Object.getPrototypeOf;


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = __webpack_require__(18);
var $getPrototypeOf = __webpack_require__(47);

__webpack_require__(38)('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return $getPrototypeOf(toObject(it));
  };
});


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Copyright (c) 2007-2015 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
 * Licensed under MIT
 * @author Ariel Flesler
 * @version 2.1.2
 */
;(function(f){"use strict"; true?!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(39)], __WEBPACK_AMD_DEFINE_FACTORY__ = (f),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):"undefined"!==typeof module&&module.exports?module.exports=f(require("jquery")):f(jQuery)})(function($){"use strict";function n(a){return!a.nodeName||-1!==$.inArray(a.nodeName.toLowerCase(),["iframe","#document","html","body"])}function h(a){return $.isFunction(a)||$.isPlainObject(a)?a:{top:a,left:a}}var p=$.scrollTo=function(a,d,b){return $(window).scrollTo(a,d,b)};p.defaults={axis:"xy",duration:0,limit:!0};$.fn.scrollTo=function(a,d,b){"object"=== typeof d&&(b=d,d=0);"function"===typeof b&&(b={onAfter:b});"max"===a&&(a=9E9);b=$.extend({},p.defaults,b);d=d||b.duration;var u=b.queue&&1<b.axis.length;u&&(d/=2);b.offset=h(b.offset);b.over=h(b.over);return this.each(function(){function k(a){var k=$.extend({},b,{queue:!0,duration:d,complete:a&&function(){a.call(q,e,b)}});r.animate(f,k)}if(null!==a){var l=n(this),q=l?this.contentWindow||window:this,r=$(q),e=a,f={},t;switch(typeof e){case "number":case "string":if(/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(e)){e= h(e);break}e=l?$(e):$(e,q);case "object":if(e.length===0)return;if(e.is||e.style)t=(e=$(e)).offset()}var v=$.isFunction(b.offset)&&b.offset(q,e)||b.offset;$.each(b.axis.split(""),function(a,c){var d="x"===c?"Left":"Top",m=d.toLowerCase(),g="scroll"+d,h=r[g](),n=p.max(q,c);t?(f[g]=t[m]+(l?0:h-r.offset()[m]),b.margin&&(f[g]-=parseInt(e.css("margin"+d),10)||0,f[g]-=parseInt(e.css("border"+d+"Width"),10)||0),f[g]+=v[m]||0,b.over[m]&&(f[g]+=e["x"===c?"width":"height"]()*b.over[m])):(d=e[m],f[g]=d.slice&& "%"===d.slice(-1)?parseFloat(d)/100*n:d);b.limit&&/^\d+$/.test(f[g])&&(f[g]=0>=f[g]?0:Math.min(f[g],n));!a&&1<b.axis.length&&(h===f[g]?f={}:u&&(k(b.onAfterFirst),f={}))});k(b.onAfter)}})};p.max=function(a,d){var b="x"===d?"Width":"Height",h="scroll"+b;if(!n(a))return a[h]-$(a)[b.toLowerCase()]();var b="client"+b,k=a.ownerDocument||a.document,l=k.documentElement,k=k.body;return Math.max(l[h],k[h])-Math.min(l[b],k[b])};$.Tween.propHooks.scrollLeft=$.Tween.propHooks.scrollTop={get:function(a){return $(a.elem)[a.prop]()}, set:function(a){var d=this.get(a);if(a.options.interrupt&&a._last&&a._last!==d)return $(a.elem).stop();var b=Math.round(a.now);d!==b&&($(a.elem)[a.prop](b),a._last=this.get(a))}};return p});

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2011-2014 Felix Gnass
 * Licensed under the MIT license
 * http://spin.js.org/
 */

/*

Basic Usage:
============

$('#el').spin() // Creates a default Spinner using the text color of #el.
$('#el').spin({ ... }) // Creates a Spinner using the provided options.

$('#el').spin(false) // Stops and removes the spinner.

Using Presets:
==============

$('#el').spin('small') // Creates a 'small' Spinner using the text color of #el.
$('#el').spin('large', '#fff') // Creates a 'large' white Spinner.

Adding a custom preset:
=======================

$.fn.spin.presets.flower = {
  lines:   9
, length: 10
, width:  20
, radius:  0
}

$('#el').spin('flower', 'red')

*/

;(function(factory) {

  if (true) {
    // CommonJS
    factory(__webpack_require__(39), __webpack_require__(127))
  } else if (typeof define == 'function' && define.amd) {
    // AMD, register as anonymous module
    define(['jquery', 'spin'], factory)
  } else {
    // Browser globals
    if (!window.Spinner) throw new Error('Spin.js not present')
    factory(window.jQuery, window.Spinner)
  }

}(function($, Spinner) {

  $.fn.spin = function(opts, color) {

    return this.each(function() {
      var $this = $(this)
        , data = $this.data()

      if (data.spinner) {
        data.spinner.stop()
        delete data.spinner
      }
      if (opts !== false) {
        opts = $.extend(
          { color: color || $this.css('color') }
        , $.fn.spin.presets[opts] || opts
        )
        data.spinner = new Spinner(opts).spin(this)
      }
    })
  }

  $.fn.spin.presets = {
    tiny:  { lines:  8, length: 2, width: 2, radius: 3 }
  , small: { lines:  8, length: 4, width: 3, radius: 5 }
  , large: { lines: 10, length: 8, width: 4, radius: 8 }
  }

}));


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;// http://spin.js.org/#v2.3.2
!function(a,b){"object"==typeof module&&module.exports?module.exports=b(): true?!(__WEBPACK_AMD_DEFINE_FACTORY__ = (b),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):a.Spinner=b()}(this,function(){"use strict";function a(a,b){var c,d=document.createElement(a||"div");for(c in b)d[c]=b[c];return d}function b(a){for(var b=1,c=arguments.length;c>b;b++)a.appendChild(arguments[b]);return a}function c(a,b,c,d){var e=["opacity",b,~~(100*a),c,d].join("-"),f=.01+c/d*100,g=Math.max(1-(1-a)/b*(100-f),a),h=j.substring(0,j.indexOf("Animation")).toLowerCase(),i=h&&"-"+h+"-"||"";return m[e]||(k.insertRule("@"+i+"keyframes "+e+"{0%{opacity:"+g+"}"+f+"%{opacity:"+a+"}"+(f+.01)+"%{opacity:1}"+(f+b)%100+"%{opacity:"+a+"}100%{opacity:"+g+"}}",k.cssRules.length),m[e]=1),e}function d(a,b){var c,d,e=a.style;if(b=b.charAt(0).toUpperCase()+b.slice(1),void 0!==e[b])return b;for(d=0;d<l.length;d++)if(c=l[d]+b,void 0!==e[c])return c}function e(a,b){for(var c in b)a.style[d(a,c)||c]=b[c];return a}function f(a){for(var b=1;b<arguments.length;b++){var c=arguments[b];for(var d in c)void 0===a[d]&&(a[d]=c[d])}return a}function g(a,b){return"string"==typeof a?a:a[b%a.length]}function h(a){this.opts=f(a||{},h.defaults,n)}function i(){function c(b,c){return a("<"+b+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',c)}k.addRule(".spin-vml","behavior:url(#default#VML)"),h.prototype.lines=function(a,d){function f(){return e(c("group",{coordsize:k+" "+k,coordorigin:-j+" "+-j}),{width:k,height:k})}function h(a,h,i){b(m,b(e(f(),{rotation:360/d.lines*a+"deg",left:~~h}),b(e(c("roundrect",{arcsize:d.corners}),{width:j,height:d.scale*d.width,left:d.scale*d.radius,top:-d.scale*d.width>>1,filter:i}),c("fill",{color:g(d.color,a),opacity:d.opacity}),c("stroke",{opacity:0}))))}var i,j=d.scale*(d.length+d.width),k=2*d.scale*j,l=-(d.width+d.length)*d.scale*2+"px",m=e(f(),{position:"absolute",top:l,left:l});if(d.shadow)for(i=1;i<=d.lines;i++)h(i,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(i=1;i<=d.lines;i++)h(i);return b(a,m)},h.prototype.opacity=function(a,b,c,d){var e=a.firstChild;d=d.shadow&&d.lines||0,e&&b+d<e.childNodes.length&&(e=e.childNodes[b+d],e=e&&e.firstChild,e=e&&e.firstChild,e&&(e.opacity=c))}}var j,k,l=["webkit","Moz","ms","O"],m={},n={lines:12,length:7,width:5,radius:10,scale:1,corners:1,color:"#000",opacity:.25,rotate:0,direction:1,speed:1,trail:100,fps:20,zIndex:2e9,className:"spinner",top:"50%",left:"50%",shadow:!1,hwaccel:!1,position:"absolute"};if(h.defaults={},f(h.prototype,{spin:function(b){this.stop();var c=this,d=c.opts,f=c.el=a(null,{className:d.className});if(e(f,{position:d.position,width:0,zIndex:d.zIndex,left:d.left,top:d.top}),b&&b.insertBefore(f,b.firstChild||null),f.setAttribute("role","progressbar"),c.lines(f,c.opts),!j){var g,h=0,i=(d.lines-1)*(1-d.direction)/2,k=d.fps,l=k/d.speed,m=(1-d.opacity)/(l*d.trail/100),n=l/d.lines;!function o(){h++;for(var a=0;a<d.lines;a++)g=Math.max(1-(h+(d.lines-a)*n)%l*m,d.opacity),c.opacity(f,a*d.direction+i,g,d);c.timeout=c.el&&setTimeout(o,~~(1e3/k))}()}return c},stop:function(){var a=this.el;return a&&(clearTimeout(this.timeout),a.parentNode&&a.parentNode.removeChild(a),this.el=void 0),this},lines:function(d,f){function h(b,c){return e(a(),{position:"absolute",width:f.scale*(f.length+f.width)+"px",height:f.scale*f.width+"px",background:b,boxShadow:c,transformOrigin:"left",transform:"rotate("+~~(360/f.lines*k+f.rotate)+"deg) translate("+f.scale*f.radius+"px,0)",borderRadius:(f.corners*f.scale*f.width>>1)+"px"})}for(var i,k=0,l=(f.lines-1)*(1-f.direction)/2;k<f.lines;k++)i=e(a(),{position:"absolute",top:1+~(f.scale*f.width/2)+"px",transform:f.hwaccel?"translate3d(0,0,0)":"",opacity:f.opacity,animation:j&&c(f.opacity,f.trail,l+k*f.direction,f.lines)+" "+1/f.speed+"s linear infinite"}),f.shadow&&b(i,e(h("#000","0 0 4px #000"),{top:"2px"})),b(d,b(i,h(g(f.color,k),"0 0 1px rgba(0,0,0,.1)")));return d},opacity:function(a,b,c){b<a.childNodes.length&&(a.childNodes[b].style.opacity=c)}}),"undefined"!=typeof document){k=function(){var c=a("style",{type:"text/css"});return b(document.getElementsByTagName("head")[0],c),c.sheet||c.styleSheet}();var o=e(a("group"),{behavior:"url(#default#VML)"});!d(o,"transform")&&o.adj?i():j=d(o,"animation")}return h});

/***/ })
/******/ ]);
});