/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
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
	var WIN = window;
	var ns = WIN.SkypeWebControl = WIN.SkypeWebControl || {};
	WIN.ES6Promise = __webpack_require__(2);
	WIN.Promise === undefined && WIN.ES6Promise && WIN.ES6Promise.polyfill();
	WIN.ariaTelemetry = __webpack_require__(5);
	var button_bootstrapper_1 = __webpack_require__(6);
	var chat_bootstrapper_1 = __webpack_require__(31);
	var Deferrer_1 = __webpack_require__(40);
	var styleLoader_1 = __webpack_require__(41);
	var packageName_1 = __webpack_require__(36);
	Deferrer_1.default.deferApi(ns, 'ChatContent', ['runChat', 'dispose']);
	Deferrer_1.default.deferApi(ns, 'API', ['registerEvent', 'dispose']);
	ns.SDK = ns.SDK || {};
	ns.SDK.Chat = ns.SDK.Chat || new chat_bootstrapper_1.default();
	ns.SDK.Chat.init();
	ns.SDK.Buttons = ns.SDK.Buttons || new button_bootstrapper_1.default();
	ns.initCallback && ns.initCallback();
	if (!(ns.EcsConfig && ns.EcsConfig.partner === 'bing')) {
	    styleLoader_1.default.addStyle(packageName_1.PackageName.STYLE_SDK, true, function () { });
	}
	ns.destroy = function () {
	    ns.API && ns.API.dispose();
	    ns.SDK.Buttons && ns.SDK.Buttons.dispose();
	    ns.SDK.Chat && ns.SDK.Chat.dispose();
	    delete ns.SDK.Buttons;
	    delete ns.SDK.Chat;
	    delete ns.SDK;
	    delete ns.ChatContent;
	    delete ns.API;
	    delete ns.SDKRunner;
	    delete ns.deferrer;
	};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var require;/* WEBPACK VAR INJECTION */(function(process, global) {/*!
	 * @overview es6-promise - a tiny implementation of Promises/A+.
	 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
	 * @license   Licensed under MIT license
	 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
	 * @version   4.0.5
	 */
	
	(function (global, factory) {
	     true ? module.exports = factory() :
	    typeof define === 'function' && define.amd ? define(factory) :
	    (global.ES6Promise = factory());
	}(this, (function () { 'use strict';
	
	function objectOrFunction(x) {
	  return typeof x === 'function' || typeof x === 'object' && x !== null;
	}
	
	function isFunction(x) {
	  return typeof x === 'function';
	}
	
	var _isArray = undefined;
	if (!Array.isArray) {
	  _isArray = function (x) {
	    return Object.prototype.toString.call(x) === '[object Array]';
	  };
	} else {
	  _isArray = Array.isArray;
	}
	
	var isArray = _isArray;
	
	var len = 0;
	var vertxNext = undefined;
	var customSchedulerFn = undefined;
	
	var asap = function asap(callback, arg) {
	  queue[len] = callback;
	  queue[len + 1] = arg;
	  len += 2;
	  if (len === 2) {
	    // If len is 2, that means that we need to schedule an async flush.
	    // If additional callbacks are queued before the queue is flushed, they
	    // will be processed by this flush that we are scheduling.
	    if (customSchedulerFn) {
	      customSchedulerFn(flush);
	    } else {
	      scheduleFlush();
	    }
	  }
	};
	
	function setScheduler(scheduleFn) {
	  customSchedulerFn = scheduleFn;
	}
	
	function setAsap(asapFn) {
	  asap = asapFn;
	}
	
	var browserWindow = typeof window !== 'undefined' ? window : undefined;
	var browserGlobal = browserWindow || {};
	var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
	var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && ({}).toString.call(process) === '[object process]';
	
	// test for web worker but not in IE10
	var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';
	
	// node
	function useNextTick() {
	  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
	  // see https://github.com/cujojs/when/issues/410 for details
	  return function () {
	    return process.nextTick(flush);
	  };
	}
	
	// vertx
	function useVertxTimer() {
	  if (typeof vertxNext !== 'undefined') {
	    return function () {
	      vertxNext(flush);
	    };
	  }
	
	  return useSetTimeout();
	}
	
	function useMutationObserver() {
	  var iterations = 0;
	  var observer = new BrowserMutationObserver(flush);
	  var node = document.createTextNode('');
	  observer.observe(node, { characterData: true });
	
	  return function () {
	    node.data = iterations = ++iterations % 2;
	  };
	}
	
	// web worker
	function useMessageChannel() {
	  var channel = new MessageChannel();
	  channel.port1.onmessage = flush;
	  return function () {
	    return channel.port2.postMessage(0);
	  };
	}
	
	function useSetTimeout() {
	  // Store setTimeout reference so es6-promise will be unaffected by
	  // other code modifying setTimeout (like sinon.useFakeTimers())
	  var globalSetTimeout = setTimeout;
	  return function () {
	    return globalSetTimeout(flush, 1);
	  };
	}
	
	var queue = new Array(1000);
	function flush() {
	  for (var i = 0; i < len; i += 2) {
	    var callback = queue[i];
	    var arg = queue[i + 1];
	
	    callback(arg);
	
	    queue[i] = undefined;
	    queue[i + 1] = undefined;
	  }
	
	  len = 0;
	}
	
	function attemptVertx() {
	  try {
	    var r = require;
	    var vertx = __webpack_require__(4);
	    vertxNext = vertx.runOnLoop || vertx.runOnContext;
	    return useVertxTimer();
	  } catch (e) {
	    return useSetTimeout();
	  }
	}
	
	var scheduleFlush = undefined;
	// Decide what async method to use to triggering processing of queued callbacks:
	if (isNode) {
	  scheduleFlush = useNextTick();
	} else if (BrowserMutationObserver) {
	  scheduleFlush = useMutationObserver();
	} else if (isWorker) {
	  scheduleFlush = useMessageChannel();
	} else if (browserWindow === undefined && "function" === 'function') {
	  scheduleFlush = attemptVertx();
	} else {
	  scheduleFlush = useSetTimeout();
	}
	
	function then(onFulfillment, onRejection) {
	  var _arguments = arguments;
	
	  var parent = this;
	
	  var child = new this.constructor(noop);
	
	  if (child[PROMISE_ID] === undefined) {
	    makePromise(child);
	  }
	
	  var _state = parent._state;
	
	  if (_state) {
	    (function () {
	      var callback = _arguments[_state - 1];
	      asap(function () {
	        return invokeCallback(_state, child, callback, parent._result);
	      });
	    })();
	  } else {
	    subscribe(parent, child, onFulfillment, onRejection);
	  }
	
	  return child;
	}
	
	/**
	  `Promise.resolve` returns a promise that will become resolved with the
	  passed `value`. It is shorthand for the following:
	
	  ```javascript
	  let promise = new Promise(function(resolve, reject){
	    resolve(1);
	  });
	
	  promise.then(function(value){
	    // value === 1
	  });
	  ```
	
	  Instead of writing the above, your code now simply becomes the following:
	
	  ```javascript
	  let promise = Promise.resolve(1);
	
	  promise.then(function(value){
	    // value === 1
	  });
	  ```
	
	  @method resolve
	  @static
	  @param {Any} value value that the returned promise will be resolved with
	  Useful for tooling.
	  @return {Promise} a promise that will become fulfilled with the given
	  `value`
	*/
	function resolve(object) {
	  /*jshint validthis:true */
	  var Constructor = this;
	
	  if (object && typeof object === 'object' && object.constructor === Constructor) {
	    return object;
	  }
	
	  var promise = new Constructor(noop);
	  _resolve(promise, object);
	  return promise;
	}
	
	var PROMISE_ID = Math.random().toString(36).substring(16);
	
	function noop() {}
	
	var PENDING = void 0;
	var FULFILLED = 1;
	var REJECTED = 2;
	
	var GET_THEN_ERROR = new ErrorObject();
	
	function selfFulfillment() {
	  return new TypeError("You cannot resolve a promise with itself");
	}
	
	function cannotReturnOwn() {
	  return new TypeError('A promises callback cannot return that same promise.');
	}
	
	function getThen(promise) {
	  try {
	    return promise.then;
	  } catch (error) {
	    GET_THEN_ERROR.error = error;
	    return GET_THEN_ERROR;
	  }
	}
	
	function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
	  try {
	    then.call(value, fulfillmentHandler, rejectionHandler);
	  } catch (e) {
	    return e;
	  }
	}
	
	function handleForeignThenable(promise, thenable, then) {
	  asap(function (promise) {
	    var sealed = false;
	    var error = tryThen(then, thenable, function (value) {
	      if (sealed) {
	        return;
	      }
	      sealed = true;
	      if (thenable !== value) {
	        _resolve(promise, value);
	      } else {
	        fulfill(promise, value);
	      }
	    }, function (reason) {
	      if (sealed) {
	        return;
	      }
	      sealed = true;
	
	      _reject(promise, reason);
	    }, 'Settle: ' + (promise._label || ' unknown promise'));
	
	    if (!sealed && error) {
	      sealed = true;
	      _reject(promise, error);
	    }
	  }, promise);
	}
	
	function handleOwnThenable(promise, thenable) {
	  if (thenable._state === FULFILLED) {
	    fulfill(promise, thenable._result);
	  } else if (thenable._state === REJECTED) {
	    _reject(promise, thenable._result);
	  } else {
	    subscribe(thenable, undefined, function (value) {
	      return _resolve(promise, value);
	    }, function (reason) {
	      return _reject(promise, reason);
	    });
	  }
	}
	
	function handleMaybeThenable(promise, maybeThenable, then$$) {
	  if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
	    handleOwnThenable(promise, maybeThenable);
	  } else {
	    if (then$$ === GET_THEN_ERROR) {
	      _reject(promise, GET_THEN_ERROR.error);
	    } else if (then$$ === undefined) {
	      fulfill(promise, maybeThenable);
	    } else if (isFunction(then$$)) {
	      handleForeignThenable(promise, maybeThenable, then$$);
	    } else {
	      fulfill(promise, maybeThenable);
	    }
	  }
	}
	
	function _resolve(promise, value) {
	  if (promise === value) {
	    _reject(promise, selfFulfillment());
	  } else if (objectOrFunction(value)) {
	    handleMaybeThenable(promise, value, getThen(value));
	  } else {
	    fulfill(promise, value);
	  }
	}
	
	function publishRejection(promise) {
	  if (promise._onerror) {
	    promise._onerror(promise._result);
	  }
	
	  publish(promise);
	}
	
	function fulfill(promise, value) {
	  if (promise._state !== PENDING) {
	    return;
	  }
	
	  promise._result = value;
	  promise._state = FULFILLED;
	
	  if (promise._subscribers.length !== 0) {
	    asap(publish, promise);
	  }
	}
	
	function _reject(promise, reason) {
	  if (promise._state !== PENDING) {
	    return;
	  }
	  promise._state = REJECTED;
	  promise._result = reason;
	
	  asap(publishRejection, promise);
	}
	
	function subscribe(parent, child, onFulfillment, onRejection) {
	  var _subscribers = parent._subscribers;
	  var length = _subscribers.length;
	
	  parent._onerror = null;
	
	  _subscribers[length] = child;
	  _subscribers[length + FULFILLED] = onFulfillment;
	  _subscribers[length + REJECTED] = onRejection;
	
	  if (length === 0 && parent._state) {
	    asap(publish, parent);
	  }
	}
	
	function publish(promise) {
	  var subscribers = promise._subscribers;
	  var settled = promise._state;
	
	  if (subscribers.length === 0) {
	    return;
	  }
	
	  var child = undefined,
	      callback = undefined,
	      detail = promise._result;
	
	  for (var i = 0; i < subscribers.length; i += 3) {
	    child = subscribers[i];
	    callback = subscribers[i + settled];
	
	    if (child) {
	      invokeCallback(settled, child, callback, detail);
	    } else {
	      callback(detail);
	    }
	  }
	
	  promise._subscribers.length = 0;
	}
	
	function ErrorObject() {
	  this.error = null;
	}
	
	var TRY_CATCH_ERROR = new ErrorObject();
	
	function tryCatch(callback, detail) {
	  try {
	    return callback(detail);
	  } catch (e) {
	    TRY_CATCH_ERROR.error = e;
	    return TRY_CATCH_ERROR;
	  }
	}
	
	function invokeCallback(settled, promise, callback, detail) {
	  var hasCallback = isFunction(callback),
	      value = undefined,
	      error = undefined,
	      succeeded = undefined,
	      failed = undefined;
	
	  if (hasCallback) {
	    value = tryCatch(callback, detail);
	
	    if (value === TRY_CATCH_ERROR) {
	      failed = true;
	      error = value.error;
	      value = null;
	    } else {
	      succeeded = true;
	    }
	
	    if (promise === value) {
	      _reject(promise, cannotReturnOwn());
	      return;
	    }
	  } else {
	    value = detail;
	    succeeded = true;
	  }
	
	  if (promise._state !== PENDING) {
	    // noop
	  } else if (hasCallback && succeeded) {
	      _resolve(promise, value);
	    } else if (failed) {
	      _reject(promise, error);
	    } else if (settled === FULFILLED) {
	      fulfill(promise, value);
	    } else if (settled === REJECTED) {
	      _reject(promise, value);
	    }
	}
	
	function initializePromise(promise, resolver) {
	  try {
	    resolver(function resolvePromise(value) {
	      _resolve(promise, value);
	    }, function rejectPromise(reason) {
	      _reject(promise, reason);
	    });
	  } catch (e) {
	    _reject(promise, e);
	  }
	}
	
	var id = 0;
	function nextId() {
	  return id++;
	}
	
	function makePromise(promise) {
	  promise[PROMISE_ID] = id++;
	  promise._state = undefined;
	  promise._result = undefined;
	  promise._subscribers = [];
	}
	
	function Enumerator(Constructor, input) {
	  this._instanceConstructor = Constructor;
	  this.promise = new Constructor(noop);
	
	  if (!this.promise[PROMISE_ID]) {
	    makePromise(this.promise);
	  }
	
	  if (isArray(input)) {
	    this._input = input;
	    this.length = input.length;
	    this._remaining = input.length;
	
	    this._result = new Array(this.length);
	
	    if (this.length === 0) {
	      fulfill(this.promise, this._result);
	    } else {
	      this.length = this.length || 0;
	      this._enumerate();
	      if (this._remaining === 0) {
	        fulfill(this.promise, this._result);
	      }
	    }
	  } else {
	    _reject(this.promise, validationError());
	  }
	}
	
	function validationError() {
	  return new Error('Array Methods must be provided an Array');
	};
	
	Enumerator.prototype._enumerate = function () {
	  var length = this.length;
	  var _input = this._input;
	
	  for (var i = 0; this._state === PENDING && i < length; i++) {
	    this._eachEntry(_input[i], i);
	  }
	};
	
	Enumerator.prototype._eachEntry = function (entry, i) {
	  var c = this._instanceConstructor;
	  var resolve$$ = c.resolve;
	
	  if (resolve$$ === resolve) {
	    var _then = getThen(entry);
	
	    if (_then === then && entry._state !== PENDING) {
	      this._settledAt(entry._state, i, entry._result);
	    } else if (typeof _then !== 'function') {
	      this._remaining--;
	      this._result[i] = entry;
	    } else if (c === Promise) {
	      var promise = new c(noop);
	      handleMaybeThenable(promise, entry, _then);
	      this._willSettleAt(promise, i);
	    } else {
	      this._willSettleAt(new c(function (resolve$$) {
	        return resolve$$(entry);
	      }), i);
	    }
	  } else {
	    this._willSettleAt(resolve$$(entry), i);
	  }
	};
	
	Enumerator.prototype._settledAt = function (state, i, value) {
	  var promise = this.promise;
	
	  if (promise._state === PENDING) {
	    this._remaining--;
	
	    if (state === REJECTED) {
	      _reject(promise, value);
	    } else {
	      this._result[i] = value;
	    }
	  }
	
	  if (this._remaining === 0) {
	    fulfill(promise, this._result);
	  }
	};
	
	Enumerator.prototype._willSettleAt = function (promise, i) {
	  var enumerator = this;
	
	  subscribe(promise, undefined, function (value) {
	    return enumerator._settledAt(FULFILLED, i, value);
	  }, function (reason) {
	    return enumerator._settledAt(REJECTED, i, reason);
	  });
	};
	
	/**
	  `Promise.all` accepts an array of promises, and returns a new promise which
	  is fulfilled with an array of fulfillment values for the passed promises, or
	  rejected with the reason of the first passed promise to be rejected. It casts all
	  elements of the passed iterable to promises as it runs this algorithm.
	
	  Example:
	
	  ```javascript
	  let promise1 = resolve(1);
	  let promise2 = resolve(2);
	  let promise3 = resolve(3);
	  let promises = [ promise1, promise2, promise3 ];
	
	  Promise.all(promises).then(function(array){
	    // The array here would be [ 1, 2, 3 ];
	  });
	  ```
	
	  If any of the `promises` given to `all` are rejected, the first promise
	  that is rejected will be given as an argument to the returned promises's
	  rejection handler. For example:
	
	  Example:
	
	  ```javascript
	  let promise1 = resolve(1);
	  let promise2 = reject(new Error("2"));
	  let promise3 = reject(new Error("3"));
	  let promises = [ promise1, promise2, promise3 ];
	
	  Promise.all(promises).then(function(array){
	    // Code here never runs because there are rejected promises!
	  }, function(error) {
	    // error.message === "2"
	  });
	  ```
	
	  @method all
	  @static
	  @param {Array} entries array of promises
	  @param {String} label optional string for labeling the promise.
	  Useful for tooling.
	  @return {Promise} promise that is fulfilled when all `promises` have been
	  fulfilled, or rejected if any of them become rejected.
	  @static
	*/
	function all(entries) {
	  return new Enumerator(this, entries).promise;
	}
	
	/**
	  `Promise.race` returns a new promise which is settled in the same way as the
	  first passed promise to settle.
	
	  Example:
	
	  ```javascript
	  let promise1 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      resolve('promise 1');
	    }, 200);
	  });
	
	  let promise2 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      resolve('promise 2');
	    }, 100);
	  });
	
	  Promise.race([promise1, promise2]).then(function(result){
	    // result === 'promise 2' because it was resolved before promise1
	    // was resolved.
	  });
	  ```
	
	  `Promise.race` is deterministic in that only the state of the first
	  settled promise matters. For example, even if other promises given to the
	  `promises` array argument are resolved, but the first settled promise has
	  become rejected before the other promises became fulfilled, the returned
	  promise will become rejected:
	
	  ```javascript
	  let promise1 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      resolve('promise 1');
	    }, 200);
	  });
	
	  let promise2 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      reject(new Error('promise 2'));
	    }, 100);
	  });
	
	  Promise.race([promise1, promise2]).then(function(result){
	    // Code here never runs
	  }, function(reason){
	    // reason.message === 'promise 2' because promise 2 became rejected before
	    // promise 1 became fulfilled
	  });
	  ```
	
	  An example real-world use case is implementing timeouts:
	
	  ```javascript
	  Promise.race([ajax('foo.json'), timeout(5000)])
	  ```
	
	  @method race
	  @static
	  @param {Array} promises array of promises to observe
	  Useful for tooling.
	  @return {Promise} a promise which settles in the same way as the first passed
	  promise to settle.
	*/
	function race(entries) {
	  /*jshint validthis:true */
	  var Constructor = this;
	
	  if (!isArray(entries)) {
	    return new Constructor(function (_, reject) {
	      return reject(new TypeError('You must pass an array to race.'));
	    });
	  } else {
	    return new Constructor(function (resolve, reject) {
	      var length = entries.length;
	      for (var i = 0; i < length; i++) {
	        Constructor.resolve(entries[i]).then(resolve, reject);
	      }
	    });
	  }
	}
	
	/**
	  `Promise.reject` returns a promise rejected with the passed `reason`.
	  It is shorthand for the following:
	
	  ```javascript
	  let promise = new Promise(function(resolve, reject){
	    reject(new Error('WHOOPS'));
	  });
	
	  promise.then(function(value){
	    // Code here doesn't run because the promise is rejected!
	  }, function(reason){
	    // reason.message === 'WHOOPS'
	  });
	  ```
	
	  Instead of writing the above, your code now simply becomes the following:
	
	  ```javascript
	  let promise = Promise.reject(new Error('WHOOPS'));
	
	  promise.then(function(value){
	    // Code here doesn't run because the promise is rejected!
	  }, function(reason){
	    // reason.message === 'WHOOPS'
	  });
	  ```
	
	  @method reject
	  @static
	  @param {Any} reason value that the returned promise will be rejected with.
	  Useful for tooling.
	  @return {Promise} a promise rejected with the given `reason`.
	*/
	function reject(reason) {
	  /*jshint validthis:true */
	  var Constructor = this;
	  var promise = new Constructor(noop);
	  _reject(promise, reason);
	  return promise;
	}
	
	function needsResolver() {
	  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
	}
	
	function needsNew() {
	  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
	}
	
	/**
	  Promise objects represent the eventual result of an asynchronous operation. The
	  primary way of interacting with a promise is through its `then` method, which
	  registers callbacks to receive either a promise's eventual value or the reason
	  why the promise cannot be fulfilled.
	
	  Terminology
	  -----------
	
	  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
	  - `thenable` is an object or function that defines a `then` method.
	  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
	  - `exception` is a value that is thrown using the throw statement.
	  - `reason` is a value that indicates why a promise was rejected.
	  - `settled` the final resting state of a promise, fulfilled or rejected.
	
	  A promise can be in one of three states: pending, fulfilled, or rejected.
	
	  Promises that are fulfilled have a fulfillment value and are in the fulfilled
	  state.  Promises that are rejected have a rejection reason and are in the
	  rejected state.  A fulfillment value is never a thenable.
	
	  Promises can also be said to *resolve* a value.  If this value is also a
	  promise, then the original promise's settled state will match the value's
	  settled state.  So a promise that *resolves* a promise that rejects will
	  itself reject, and a promise that *resolves* a promise that fulfills will
	  itself fulfill.
	
	
	  Basic Usage:
	  ------------
	
	  ```js
	  let promise = new Promise(function(resolve, reject) {
	    // on success
	    resolve(value);
	
	    // on failure
	    reject(reason);
	  });
	
	  promise.then(function(value) {
	    // on fulfillment
	  }, function(reason) {
	    // on rejection
	  });
	  ```
	
	  Advanced Usage:
	  ---------------
	
	  Promises shine when abstracting away asynchronous interactions such as
	  `XMLHttpRequest`s.
	
	  ```js
	  function getJSON(url) {
	    return new Promise(function(resolve, reject){
	      let xhr = new XMLHttpRequest();
	
	      xhr.open('GET', url);
	      xhr.onreadystatechange = handler;
	      xhr.responseType = 'json';
	      xhr.setRequestHeader('Accept', 'application/json');
	      xhr.send();
	
	      function handler() {
	        if (this.readyState === this.DONE) {
	          if (this.status === 200) {
	            resolve(this.response);
	          } else {
	            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
	          }
	        }
	      };
	    });
	  }
	
	  getJSON('/posts.json').then(function(json) {
	    // on fulfillment
	  }, function(reason) {
	    // on rejection
	  });
	  ```
	
	  Unlike callbacks, promises are great composable primitives.
	
	  ```js
	  Promise.all([
	    getJSON('/posts'),
	    getJSON('/comments')
	  ]).then(function(values){
	    values[0] // => postsJSON
	    values[1] // => commentsJSON
	
	    return values;
	  });
	  ```
	
	  @class Promise
	  @param {function} resolver
	  Useful for tooling.
	  @constructor
	*/
	function Promise(resolver) {
	  this[PROMISE_ID] = nextId();
	  this._result = this._state = undefined;
	  this._subscribers = [];
	
	  if (noop !== resolver) {
	    typeof resolver !== 'function' && needsResolver();
	    this instanceof Promise ? initializePromise(this, resolver) : needsNew();
	  }
	}
	
	Promise.all = all;
	Promise.race = race;
	Promise.resolve = resolve;
	Promise.reject = reject;
	Promise._setScheduler = setScheduler;
	Promise._setAsap = setAsap;
	Promise._asap = asap;
	
	Promise.prototype = {
	  constructor: Promise,
	
	  /**
	    The primary way of interacting with a promise is through its `then` method,
	    which registers callbacks to receive either a promise's eventual value or the
	    reason why the promise cannot be fulfilled.
	  
	    ```js
	    findUser().then(function(user){
	      // user is available
	    }, function(reason){
	      // user is unavailable, and you are given the reason why
	    });
	    ```
	  
	    Chaining
	    --------
	  
	    The return value of `then` is itself a promise.  This second, 'downstream'
	    promise is resolved with the return value of the first promise's fulfillment
	    or rejection handler, or rejected if the handler throws an exception.
	  
	    ```js
	    findUser().then(function (user) {
	      return user.name;
	    }, function (reason) {
	      return 'default name';
	    }).then(function (userName) {
	      // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
	      // will be `'default name'`
	    });
	  
	    findUser().then(function (user) {
	      throw new Error('Found user, but still unhappy');
	    }, function (reason) {
	      throw new Error('`findUser` rejected and we're unhappy');
	    }).then(function (value) {
	      // never reached
	    }, function (reason) {
	      // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
	      // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
	    });
	    ```
	    If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
	  
	    ```js
	    findUser().then(function (user) {
	      throw new PedagogicalException('Upstream error');
	    }).then(function (value) {
	      // never reached
	    }).then(function (value) {
	      // never reached
	    }, function (reason) {
	      // The `PedgagocialException` is propagated all the way down to here
	    });
	    ```
	  
	    Assimilation
	    ------------
	  
	    Sometimes the value you want to propagate to a downstream promise can only be
	    retrieved asynchronously. This can be achieved by returning a promise in the
	    fulfillment or rejection handler. The downstream promise will then be pending
	    until the returned promise is settled. This is called *assimilation*.
	  
	    ```js
	    findUser().then(function (user) {
	      return findCommentsByAuthor(user);
	    }).then(function (comments) {
	      // The user's comments are now available
	    });
	    ```
	  
	    If the assimliated promise rejects, then the downstream promise will also reject.
	  
	    ```js
	    findUser().then(function (user) {
	      return findCommentsByAuthor(user);
	    }).then(function (comments) {
	      // If `findCommentsByAuthor` fulfills, we'll have the value here
	    }, function (reason) {
	      // If `findCommentsByAuthor` rejects, we'll have the reason here
	    });
	    ```
	  
	    Simple Example
	    --------------
	  
	    Synchronous Example
	  
	    ```javascript
	    let result;
	  
	    try {
	      result = findResult();
	      // success
	    } catch(reason) {
	      // failure
	    }
	    ```
	  
	    Errback Example
	  
	    ```js
	    findResult(function(result, err){
	      if (err) {
	        // failure
	      } else {
	        // success
	      }
	    });
	    ```
	  
	    Promise Example;
	  
	    ```javascript
	    findResult().then(function(result){
	      // success
	    }, function(reason){
	      // failure
	    });
	    ```
	  
	    Advanced Example
	    --------------
	  
	    Synchronous Example
	  
	    ```javascript
	    let author, books;
	  
	    try {
	      author = findAuthor();
	      books  = findBooksByAuthor(author);
	      // success
	    } catch(reason) {
	      // failure
	    }
	    ```
	  
	    Errback Example
	  
	    ```js
	  
	    function foundBooks(books) {
	  
	    }
	  
	    function failure(reason) {
	  
	    }
	  
	    findAuthor(function(author, err){
	      if (err) {
	        failure(err);
	        // failure
	      } else {
	        try {
	          findBoooksByAuthor(author, function(books, err) {
	            if (err) {
	              failure(err);
	            } else {
	              try {
	                foundBooks(books);
	              } catch(reason) {
	                failure(reason);
	              }
	            }
	          });
	        } catch(error) {
	          failure(err);
	        }
	        // success
	      }
	    });
	    ```
	  
	    Promise Example;
	  
	    ```javascript
	    findAuthor().
	      then(findBooksByAuthor).
	      then(function(books){
	        // found books
	    }).catch(function(reason){
	      // something went wrong
	    });
	    ```
	  
	    @method then
	    @param {Function} onFulfilled
	    @param {Function} onRejected
	    Useful for tooling.
	    @return {Promise}
	  */
	  then: then,
	
	  /**
	    `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
	    as the catch block of a try/catch statement.
	  
	    ```js
	    function findAuthor(){
	      throw new Error('couldn't find that author');
	    }
	  
	    // synchronous
	    try {
	      findAuthor();
	    } catch(reason) {
	      // something went wrong
	    }
	  
	    // async with promises
	    findAuthor().catch(function(reason){
	      // something went wrong
	    });
	    ```
	  
	    @method catch
	    @param {Function} onRejection
	    Useful for tooling.
	    @return {Promise}
	  */
	  'catch': function _catch(onRejection) {
	    return this.then(null, onRejection);
	  }
	};
	
	function polyfill() {
	    var local = undefined;
	
	    if (typeof global !== 'undefined') {
	        local = global;
	    } else if (typeof self !== 'undefined') {
	        local = self;
	    } else {
	        try {
	            local = Function('return this')();
	        } catch (e) {
	            throw new Error('polyfill failed because global object is unavailable in this environment');
	        }
	    }
	
	    var P = local.Promise;
	
	    if (P) {
	        var promiseToString = null;
	        try {
	            promiseToString = Object.prototype.toString.call(P.resolve());
	        } catch (e) {
	            // silently ignored
	        }
	
	        if (promiseToString === '[object Promise]' && !P.cast) {
	            return;
	        }
	    }
	
	    local.Promise = Promise;
	}
	
	// Strange compat..
	Promise.polyfill = polyfill;
	Promise.Promise = Promise;
	
	return Promise;
	
	})));
	//# sourceMappingURL=es6-promise.map
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), (function() { return this; }())))

/***/ }),
/* 3 */
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
/* 4 */
/***/ (function(module, exports) {

	/* (ignored) */

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	var clienttelemetry_build;!function(e){e.version="2.7.2"}(clienttelemetry_build||(clienttelemetry_build={}));var Microsoft;!function(e){var t;!function(e){!function(e){e[e.BT_STOP=0]="BT_STOP",e[e.BT_STOP_BASE=1]="BT_STOP_BASE",e[e.BT_BOOL=2]="BT_BOOL",e[e.BT_UINT8=3]="BT_UINT8",e[e.BT_UINT16=4]="BT_UINT16",e[e.BT_UINT32=5]="BT_UINT32",e[e.BT_UINT64=6]="BT_UINT64",e[e.BT_FLOAT=7]="BT_FLOAT",e[e.BT_DOUBLE=8]="BT_DOUBLE",e[e.BT_STRING=9]="BT_STRING",e[e.BT_STRUCT=10]="BT_STRUCT",e[e.BT_LIST=11]="BT_LIST",e[e.BT_SET=12]="BT_SET",e[e.BT_MAP=13]="BT_MAP",e[e.BT_INT8=14]="BT_INT8",e[e.BT_INT16=15]="BT_INT16",e[e.BT_INT32=16]="BT_INT32",e[e.BT_INT64=17]="BT_INT64",e[e.BT_WSTRING=18]="BT_WSTRING",e[e.BT_UNAVAILABLE=127]="BT_UNAVAILABLE"}(e.BondDataType||(e.BondDataType={}));e.BondDataType;!function(e){e[e.MARSHALED_PROTOCOL=0]="MARSHALED_PROTOCOL",e[e.MAFIA_PROTOCOL=17997]="MAFIA_PROTOCOL",e[e.COMPACT_PROTOCOL=16963]="COMPACT_PROTOCOL",e[e.JSON_PROTOCOL=21322]="JSON_PROTOCOL",e[e.PRETTY_JSON_PROTOCOL=20554]="PRETTY_JSON_PROTOCOL",e[e.SIMPLE_PROTOCOL=20563]="SIMPLE_PROTOCOL"}(e.ProtocolType||(e.ProtocolType={}));e.ProtocolType}(t=e.Bond||(e.Bond={}))}(Microsoft||(Microsoft={}));var Microsoft;!function(e){var t;!function(e){var t;!function(e){var t=function(){function e(){this._buffer=[]}return e.prototype.Add=function(e){for(var t=0;t<this._buffer.length&&this._buffer[t]!=e;++t);t==this._buffer.length&&this._buffer.push(e)},e.prototype.Count=function(){return this._buffer.length},e.prototype.GetBuffer=function(){return this._buffer},e}();e.Set=t;var n=function(){function e(){this._buffer=[]}return e.prototype.Add=function(e,t){this._getIndex(e)==-1&&this._buffer.push({Key:e,Value:t})},e.prototype.AddOrReplace=function(e,t){var n=this._getIndex(e);n>=0?this._buffer[n]={Key:e,Value:t}:this._buffer.push({Key:e,Value:t})},e.prototype.Remove=function(e){var t=this._getIndex(e);t>=0&&this._buffer.splice(t,1)},e.prototype.Count=function(){return this._buffer.length},e.prototype.GetBuffer=function(){return this._buffer},e.prototype.ContainsKey=function(e){return this._getIndex(e)>=0},e.prototype.Get=function(e){var t=this._getIndex(e);return t>=0?this._buffer[t].Value:null},e.prototype._getIndex=function(e){for(var t=0,n=-1;t<this._buffer.length;++t)if(this._buffer[t].Key==e){n=t;break}return n},e}();e.Map=n}(t=e.Collections||(e.Collections={}))}(t=e.Bond||(e.Bond={}))}(Microsoft||(Microsoft={}));var Microsoft;!function(e){var t;!function(t){var n;!function(e){var n=function(){function e(){}return e.GetBytes=function(e){for(var t=[],n=0;n<e.length;++n){var i=e.charCodeAt(n);i<128?t.push(i):i<2048?t.push(192|i>>6,128|63&i):i<55296||i>=57344?t.push(224|i>>12,128|i>>6&63,128|63&i):(i=65536+((1023&i)<<10|1023&e.charCodeAt(++n)),t.push(240|i>>18,128|i>>12&63,128|i>>6&63,128|63&i))}return t},e}();e.Utf8=n;var i=function(){function e(){}return e.GetString=function(e){var t,n,i,r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",o=[],s=e.length%3,a=function(e){return[r.charAt(e>>18&63),r.charAt(e>>12&63),r.charAt(e>>6&63),r.charAt(63&e)].join("")};for(t=0,i=e.length-s;t<i;t+=3)n=(e[t]<<16)+(e[t+1]<<8)+e[t+2],o.push(a(n));switch(s){case 1:n=e[e.length-1],o.push(r.charAt(n>>2)),o.push(r.charAt(n<<4&63)),o.push("==");break;case 2:n=(e[e.length-2]<<8)+e[e.length-1],o.push(r.charAt(n>>10)),o.push(r.charAt(n>>4&63)),o.push(r.charAt(n<<2&63)),o.push("=")}return o.join("")},e}();e.Base64=i;var o=function(){function e(){}return e.GetBytes=function(e){for(var t=[];4294967168&e;)t.push(127&e|128),e>>>=7;return t.push(127&e),t},e}();e.Varint=o;var s=function(){function e(){}return e.GetBytes=function(e){for(var t=e.low,n=e.high,i=[];n||4294967168&t;)i.push(127&t|128),t=(127&n)<<25|t>>>7,n>>>=7;return i.push(127&t),i},e}();e.Varint64=s;var a=function(){function e(){}return e.GetBytes=function(e){if(t.BrowserChecker.IsDataViewSupport()){var n=new DataView(new ArrayBuffer(4));n.setFloat32(0,e,!0);for(var i=[],o=0;o<4;++o)i.push(n.getUint8(o));return i}return r.ConvertNumberToArray(e,!1)},e}();e.Float=a;var u=function(){function e(){}return e.GetBytes=function(e){if(t.BrowserChecker.IsDataViewSupport()){var n=new DataView(new ArrayBuffer(8));n.setFloat64(0,e,!0);for(var i=[],o=0;o<8;++o)i.push(n.getUint8(o));return i}return r.ConvertNumberToArray(e,!0)},e}();e.Double=u;var d=function(){function e(){}return e.EncodeZigzag16=function(e){return e=t.Number.ToInt16(e),e<<1^e>>15},e.EncodeZigzag32=function(e){return e=t.Number.ToInt32(e),e<<1^e>>31},e.EncodeZigzag64=function(e){var n=e.low,i=e.high,r=i<<1|n>>>31,o=n<<1;2147483648&i&&(r=~r,o=~o);var s=new t.UInt64("0");return s.low=o,s.high=r,s},e}();e.Zigzag=d}(n=t.Encoding||(t.Encoding={}));var i;!function(n){var i=function(){function e(){}return e.GetString=function(e){for(var t=[],n=0;n<e.length;++n){var i=e[n];if(i<=191)t.push(String.fromCharCode(i));else if(i<=223){var r=e[++n];t.push(String.fromCharCode((31&i)<<6|63&r))}else if(i<=239){var r=e[++n],o=e[++n];t.push(String.fromCharCode((15&i)<<12|(63&r)<<6|63&o))}else{var r=e[++n],o=e[++n],s=e[++n];i=(7&i)<<18|(63&r)<<12|(63&o)<<6|63&s,i-=65536,t.push(String.fromCharCode(55296|i>>10&1023)),t.push(String.fromCharCode(56320|1023&i))}}return t.join("")},e}();n.Utf8=i;var o=function(){function e(){}return e.GetBytes=function(e){for(var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",n=[],i=0;i<e.length;++i){var r=t.indexOf(e.charAt(i++)),o=t.indexOf(e.charAt(i++)),s=t.indexOf(e.charAt(i++)),a=t.indexOf(e.charAt(i));n.push(r<<2|o>>4),s>=0&&(n.push(o<<4&240|s>>2),a>=0&&n.push(s<<6&192|a))}return n},e}();n.Base64=o;var s=function(){function t(){}return t.GetInt64=function(t){var n=new e.Bond.Int64("0"),i=this._Read(t);return n.low=i[0],i.length>1&&(n.high=i[1]),n},t.GetNumber=function(e){return this._Read(e)[0]},t._Read=function(e){for(var t=[],n=0,i=!0,r=0;i;){var o=e.shift();if(i=0!=(128&o),o=127&o,!(r<28)){n|=o<<r,t.push(n),n=o>>4,r=3;break}n|=o<<r,r+=7}for(;i;){var o=e.shift();if(i=0!=(128&o),o=127&o,n|=o<<r,r+=7,r>=32)break}return t.push(n),t},t}();n.Varint=s;var a=function(){function e(){}return e.GetNumber=function(e){if(t.BrowserChecker.IsDataViewSupport()){for(var n=new DataView(new ArrayBuffer(4)),i=0;i<4;++i)n.setUint8(i,e[i]);return n.getFloat32(0,!0)}return r.ConvertArrayToNumber(e,!1)},e}();n.Float=a;var u=function(){function e(){}return e.GetNumber=function(e){if(t.BrowserChecker.IsDataViewSupport()){for(var n=new DataView(new ArrayBuffer(8)),i=0;i<8;++i)n.setUint8(i,e[i]);return n.getFloat64(0,!0)}return r.ConvertArrayToNumber(e,!0)},e}();n.Double=u;var d=function(){function t(){}return t.DecodeZigzag16=function(e){return((65535&e)>>>1^-(1&e))<<16>>16},t.DecodeZigzag32=function(e){return e>>>1^-(1&e)},t.DecodeZigzag64=function(t){var n=1&t.high,i=t.high>>>1,r=1&t.low,o=t.low>>>1;o=n<<31|o,r&&(o^=4294967295,i^=4294967295);var s=new e.Bond.UInt64("0");return s.low=o,s.high=i,s},t}();n.Zigzag=d}(i=t.Decoding||(t.Decoding={}));var r=function(){function e(){}return e.ConvertNumberToArray=function(e,t){if(!e)return t?this._doubleZero:this._floatZero;var n=t?11:8,i=t?52:23,r=(1<<n-1)-1,o=1-r,s=r,a=e<0?1:0;e=Math.abs(e);for(var u=Math.floor(e),d=e-u,c=2*(r+2)+i,l=new Array(c),_=0;_<c;)l[_++]=0;for(_=r+2;_&&u;)l[--_]=u%2,u=Math.floor(u/2);for(_=r+1;_<c-1&&d>0;)d*=2,d>=1?(l[++_]=1,--d):l[++_]=0;for(var f=0;f<c&&!l[f];++f);var h=r+1-f,p=f+i;if(l[p+1]){for(_=p;_>f&&!(l[_]=1-l[_]);--_);_==f&&++h}if(h>s||u)return a?t?this._doubleNegInifinity:this._floatNegInifinity:t?this._doubleInifinity:this._floatInifinity;if(h<o)return t?this._doubleZero:this._floatZero;if(t){var I=0;for(_=0;_<20;++_)I=I<<1|l[++f];for(var T=0;_<52;++_)T=T<<1|l[++f];I|=h+r<<20,I=a<<31|2147483647&I;var S=[255&T,T>>8&255,T>>16&255,T>>>24,255&I,I>>8&255,I>>16&255,I>>>24];return S}var g=0;for(_=0;_<23;++_)g=g<<1|l[++f];g|=h+r<<23,g=a<<31|2147483647&g;var S=[255&g,g>>8&255,g>>16&255,g>>>24];return S},e.ConvertArrayToNumber=function(e,n){var i=n?11:8,r=(1<<i-1)-1,o=0!=(128&e[n?7:3]),s=n?(127&e[7])<<4|(240&e[6])>>4:(127&e[3])<<1|(128&e[2])>>7;if(255==s)throw new t.Exception("Not a valid float/double buffer.");var a=1,u=1;if(n){var d=(15&e[6])<<28|(255&e[5])<<20|(255&e[4])<<12,c=e[3]<<24|(255&e[2])<<16|(255&e[1])<<8|255&e[0];if(!s&&!d&&!c)return 0;for(var l=0;l<20;++l)u/=2,d<0&&(a+=u),d<<=1;for(var l=0;l<32;++l)u/=2,c<0&&(a+=u),c<<=1}else{var _=(127&e[2])<<25|(255&e[1])<<17|(255&e[0])<<9;if(!s&&!_)return 0;for(var l=0;l<23;++l)u/=2,_<0&&(a+=u),_<<=1}return a*=Math.pow(2,s-r),o?0-a:a},e._floatZero=[0,0,0,0],e._doubleZero=[0,0,0,0,0,0,0,0],e._floatInifinity=[0,0,128,127],e._floatNegInifinity=[0,0,128,255],e._doubleInifinity=[0,0,0,0,0,0,240,127],e._doubleNegInifinity=[0,0,0,0,0,0,240,255],e}()}(t=e.Bond||(e.Bond={}))}(Microsoft||(Microsoft={}));var Microsoft;!function(e){var t;!function(e){var t;!function(t){var n=function(){function t(){this._buffer=[]}return t.prototype.WriteByte=function(t){this._buffer.push(e.Number.ToByte(t))},t.prototype.Write=function(e,t,n){for(;n--;)this.WriteByte(e[t++])},t.prototype.GetBuffer=function(){return this._buffer},t}();t.MemoryStream=n}(t=e.IO||(e.IO={}))}(t=e.Bond||(e.Bond={}))}(Microsoft||(Microsoft={}));var Microsoft;!function(e){var t;!function(e){var t=function(){function e(e,t){this.Type=e,this.Id=t}return e}();e.FieldTag=t;var n=function(){function e(e,t){this.ElementType=e,this.Size=t}return e}();e.ContainerTag=n;var i=function(){function e(e,t,n){this.KeyType=e,this.ValueType=t,this.Size=n}return e}();e.KeyValueContainerTag=i;var r=function(){function e(){}return e}();e.Bonded=r;var o=function(){function e(e){this.low=0,this.high=0,this.low=parseInt(e),this.low<0&&(this.high=-1)}return e.prototype.Equals=function(t){var n=new e(t);return this.low==n.low&&this.high==n.high},e}();e.Int64=o;var s=function(){function e(e){this.low=0,this.high=0,this.low=parseInt(e)}return e.prototype.Equals=function(t){var n=new e(t);return this.low==n.low&&this.high==n.high},e}();e.UInt64=s;var a=function(){function e(){}return e.ToByte=function(e){return this.ToUInt8(e)},e.ToInt8=function(e){var t=(128&e)<<24>>24;return 127&e|t},e.ToInt16=function(e){var t=(32768&e)<<16>>16;return 32767&e|t},e.ToInt32=function(e){var t=2147483648&e;return 2147483647&e|t},e.ToUInt8=function(e){return 255&e},e.ToUInt16=function(e){return 65535&e},e.ToUInt32=function(e){return 4294967295&e},e}();e.Number=a;var u=function(){function e(e){this.Message=e}return e}();e.Exception=u;var d=function(){function e(){}return e}();e.KeyValuePair=d;var c=function(){function e(){}return e.IsDataViewSupport=function(){return"undefined"!=typeof ArrayBuffer&&"undefined"!=typeof DataView},e}();e.BrowserChecker=c}(t=e.Bond||(e.Bond={}))}(Microsoft||(Microsoft={}));var Microsoft;!function(e){var t;!function(e){var t=function(){function t(e){this._stream=e}return t.prototype.WriteBlob=function(e){this._stream.Write(e,0,e.length)},t.prototype.WriteBool=function(e){this._stream.WriteByte(e?1:0)},t.prototype.WriteContainerBegin=function(e,t){this.WriteUInt8(t),this.WriteUInt32(e)},t.prototype.WriteMapContainerBegin=function(e,t,n){this.WriteUInt8(t),this.WriteUInt8(n),this.WriteUInt32(e)},t.prototype.WriteContainerEnd=function(){},t.prototype.WriteDouble=function(t){var n=e.Encoding.Double.GetBytes(t);this._stream.Write(n,0,n.length)},t.prototype.WriteFloat=function(t){var n=e.Encoding.Float.GetBytes(t);this._stream.Write(n,0,n.length)},t.prototype.WriteFieldBegin=function(e,t,n){t<=5?this._stream.WriteByte(e|t<<5):t<=255?(this._stream.WriteByte(192|e),this._stream.WriteByte(t)):(this._stream.WriteByte(224|e),this._stream.WriteByte(t),this._stream.WriteByte(t>>8))},t.prototype.WriteFieldEnd=function(){},t.prototype.WriteFieldOmitted=function(e,t,n){},t.prototype.WriteInt16=function(t){t=e.Encoding.Zigzag.EncodeZigzag16(t),this.WriteUInt16(t)},t.prototype.WriteInt32=function(t){t=e.Encoding.Zigzag.EncodeZigzag32(t),this.WriteUInt32(t)},t.prototype.WriteInt64=function(t){this.WriteUInt64(e.Encoding.Zigzag.EncodeZigzag64(t))},t.prototype.WriteInt8=function(t){this._stream.WriteByte(e.Number.ToInt8(t))},t.prototype.WriteString=function(t){if(""==t)this.WriteUInt32(0);else{var n=e.Encoding.Utf8.GetBytes(t);this.WriteUInt32(n.length),this._stream.Write(n,0,n.length)}},t.prototype.WriteStructBegin=function(e,t){},t.prototype.WriteStructEnd=function(t){this.WriteUInt8(t?e.BondDataType.BT_STOP_BASE:e.BondDataType.BT_STOP)},t.prototype.WriteUInt16=function(t){var n=e.Encoding.Varint.GetBytes(e.Number.ToUInt16(t));this._stream.Write(n,0,n.length)},t.prototype.WriteUInt32=function(t){var n=e.Encoding.Varint.GetBytes(e.Number.ToUInt32(t));this._stream.Write(n,0,n.length)},t.prototype.WriteUInt64=function(t){var n=e.Encoding.Varint64.GetBytes(t);this._stream.Write(n,0,n.length)},t.prototype.WriteUInt8=function(t){this._stream.WriteByte(e.Number.ToUInt8(t))},t.prototype.WriteWString=function(e){this.WriteUInt32(e.length);for(var t=0;t<e.length;++t){var n=e.charCodeAt(t);this._stream.WriteByte(n),this._stream.WriteByte(n>>>8)}},t}();e.CompactBinaryProtocolWriter=t;var n=function(){function e(){}return e}();e.CompactBinaryProtocolReader=n}(t=e.Bond||(e.Bond={}))}(Microsoft||(Microsoft={}));var sct;!function(e){var t=function(){function t(){}return t.IsSafari=function(){if(null===t._isSafari)if("undefined"!=typeof navigator&&navigator.userAgent){var e=navigator.userAgent.toLowerCase();e.indexOf("safari")>=0&&e.indexOf("chrome")<0?t._isSafari=!0:t._isSafari=!1}else t._isSafari=!1;return t._isSafari},t.IsReactNative=function(){return null===t._isReactNative&&("undefined"!=typeof navigator&&navigator.product?t._isReactNative="ReactNative"===navigator.product:t._isReactNative=!1),t._isReactNative},t.IsUint8ArrSupported=function(){return!e.Utils.IsSafari()&&"undefined"!=typeof Uint8Array&&!e.Utils.IsReactNative()},t.ajax=function(e,n){var i=t._createConnection();if(e.headers){var r="qsp=true";for(var o in e.headers)r+="&",r+=encodeURIComponent(o),r+="=",r+=encodeURIComponent(e.headers[o]);e.url.indexOf("?")<0?e.url+="?":e.url+="&",e.url+=r}i.open(e.type,e.url,!n),e.complete&&(i.onload=function(){"undefined"==typeof i.status&&(i.status=200),e.complete(i)},i.ontimeout=function(){"undefined"==typeof i.status&&(i.status=500),e.complete(i)},i.onerror=function(){e.complete(i)}),i.send(e.data)},t.keys=function(e){if(Object.keys)return Object.keys(e);var t=[];for(var n in e)e.hasOwnProperty(n)&&t.push(n);return t},t.IsUsingXDomainRequest=function(){if(null==t._usingXDomainRequest){var e=new XMLHttpRequest;"undefined"==typeof e.withCredentials&&"undefined"!=typeof XDomainRequest?t._usingXDomainRequest=!0:t._usingXDomainRequest=!1}return t._usingXDomainRequest},t._createConnection=function(){var e=new XMLHttpRequest;return t.IsUsingXDomainRequest()?new XDomainRequest:e},t._isSafari=null,t._isReactNative=null,t._usingXDomainRequest=null,t}();e.Utils=t}(sct||(sct={}));var microsoft;!function(e){var t;!function(e){var t;!function(e){var t;!function(t){var n=function(){function e(){}return e.GetGuid=function(){var e=function(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1,5)};return[e(),e(),"-",e(),"-",e(),"-",e(),"-",e(),e(),e()].join("")},e.GetTimeStamp=function(){var e=(new Date).getTime(),t=new Microsoft.Bond.Int64("0");return t.low=4294967295&e,t.high=Math.floor(e/4294967296),t},e.GetTimeStampWithValue=function(e){var t=new Microsoft.Bond.Int64("0");return t.low=4294967295&e,t.high=Math.floor(e/4294967296),t},e}();t.utils=n,function(e){e[e.NotSet=0]="NotSet",e[e.Event=1]="Event",e[e.PerformanceCounter=2]="PerformanceCounter",e[e.Anomaly=3]="Anomaly",e[e.Prediction=4]="Prediction",e[e.TraceLog=5]="TraceLog",e[e.EventSourceLog=6]="EventSourceLog",e[e.HttpLog=7]="HttpLog",e[e.PerformanceCounterAzure=8]="PerformanceCounterAzure",e[e.PerformanceCounterGfs=9]="PerformanceCounterGfs"}(t.RecordType||(t.RecordType={}));t.RecordType;!function(e){e[e.NotSet=0]="NotSet",e[e.O365=1]="O365",e[e.SkypeBI=2]="SkypeBI",e[e.SkypeData=3]="SkypeData"}(t.PIIScrubber||(t.PIIScrubber={}));t.PIIScrubber;!function(e){e[e.NotSet=0]="NotSet",e[e.DistinguishedName=1]="DistinguishedName",e[e.GenericData=2]="GenericData",e[e.IPV4Address=3]="IPV4Address",e[e.IPv6Address=4]="IPv6Address",e[e.MailSubject=5]="MailSubject",e[e.PhoneNumber=6]="PhoneNumber",e[e.QueryString=7]="QueryString",e[e.SipAddress=8]="SipAddress",e[e.SmtpAddress=9]="SmtpAddress",e[e.Identity=10]="Identity",e[e.Uri=11]="Uri",e[e.Fqdn=12]="Fqdn",e[e.IPV4AddressLegacy=13]="IPV4AddressLegacy"}(t.PIIKind||(t.PIIKind={}));t.PIIKind;!function(e){e[e.Unknown=0]="Unknown",e[e.MSACID=1]="MSACID",e[e.MSAPUID=2]="MSAPUID",e[e.ANID=3]="ANID",e[e.OrgIdCID=4]="OrgIdCID",e[e.OrgIdPUID=5]="OrgIdPUID",e[e.UserObjectId=6]="UserObjectId",e[e.Skype=7]="Skype",e[e.Yammer=8]="Yammer",e[e.EmailAddress=9]="EmailAddress",e[e.PhoneNumber=10]="PhoneNumber",e[e.SipAddress=11]="SipAddress",e[e.MUID=12]="MUID"}(t.UserIdType||(t.UserIdType={}));var i=(t.UserIdType,function(){function t(){this.ScrubType=e.datamodels.PIIScrubber.NotSet,this.Kind=e.datamodels.PIIKind.NotSet,this.RawContent=""}return t.prototype.Write=function(e){this.WriteImpl(e,!1)},t.prototype.WriteImpl=function(t,n){t.WriteStructBegin(null,n),this.ScrubType!=e.datamodels.PIIScrubber.NotSet?(t.WriteFieldBegin(Microsoft.Bond.BondDataType.BT_INT32,1,null),t.WriteInt32(this.ScrubType),t.WriteFieldEnd()):t.WriteFieldOmitted(Microsoft.Bond.BondDataType.BT_INT32,1,null),this.Kind!=e.datamodels.PIIKind.NotSet?(t.WriteFieldBegin(Microsoft.Bond.BondDataType.BT_INT32,2,null),t.WriteInt32(this.Kind),t.WriteFieldEnd()):t.WriteFieldOmitted(Microsoft.Bond.BondDataType.BT_INT32,2,null),""!=this.RawContent?(t.WriteFieldBegin(Microsoft.Bond.BondDataType.BT_STRING,3,null),t.WriteString(this.RawContent),t.WriteFieldEnd()):t.WriteFieldOmitted(Microsoft.Bond.BondDataType.BT_STRING,3,null),t.WriteStructEnd(n)},t.prototype.Read=function(e){this.ReadImpl(e,!1)},t.prototype.ReadImpl=function(e,t){},t}());t.PII=i;var r=function(){function t(){this.Id=n.GetGuid(),this.Timestamp=n.GetTimeStamp(),this.Type="",this.EventType="",this.Extension=new Microsoft.Bond.Collections.Map,this.RecordType=e.datamodels.RecordType.NotSet,this.PIIExtensions=new Microsoft.Bond.Collections.Map}return t.prototype.AddOrReplacePII=function(t,n,i){var r=new e.datamodels.PII;r.RawContent=n,r.Kind=i,r.ScrubType=e.datamodels.PIIScrubber.O365,this.PIIExtensions.AddOrReplace(t,r)},t.prototype.Write=function(e){this.WriteImpl(e,!1)},t.prototype.WriteImpl=function(t,n){if(t.WriteStructBegin(null,n),""!=this.Id?(t.WriteFieldBegin(Microsoft.Bond.BondDataType.BT_STRING,1,null),t.WriteString(this.Id),t.WriteFieldEnd()):t.WriteFieldOmitted(Microsoft.Bond.BondDataType.BT_STRING,1,null),this.Timestamp.Equals("0")?t.WriteFieldOmitted(Microsoft.Bond.BondDataType.BT_INT64,3,null):(t.WriteFieldBegin(Microsoft.Bond.BondDataType.BT_INT64,3,null),t.WriteInt64(this.Timestamp),t.WriteFieldEnd()),""!=this.Type?(t.WriteFieldBegin(Microsoft.Bond.BondDataType.BT_STRING,5,null),t.WriteString(this.Type),t.WriteFieldEnd()):t.WriteFieldOmitted(Microsoft.Bond.BondDataType.BT_STRING,5,null),""!=this.EventType?(t.WriteFieldBegin(Microsoft.Bond.BondDataType.BT_STRING,6,null),t.WriteString(this.EventType),t.WriteFieldEnd()):t.WriteFieldOmitted(Microsoft.Bond.BondDataType.BT_STRING,6,null),this.Extension.Count()){t.WriteFieldBegin(Microsoft.Bond.BondDataType.BT_MAP,13,null),t.WriteMapContainerBegin(this.Extension.Count(),Microsoft.Bond.BondDataType.BT_STRING,Microsoft.Bond.BondDataType.BT_STRING);for(var i=0;i<this.Extension.GetBuffer().length;++i)t.WriteString(this.Extension.GetBuffer()[i].Key),t.WriteString(this.Extension.GetBuffer()[i].Value);t.WriteContainerEnd(),t.WriteFieldEnd()}else t.WriteFieldOmitted(Microsoft.Bond.BondDataType.BT_MAP,13,null);if(this.RecordType!=e.datamodels.RecordType.NotSet?(t.WriteFieldBegin(Microsoft.Bond.BondDataType.BT_INT32,24,null),t.WriteInt32(this.RecordType),t.WriteFieldEnd()):t.WriteFieldOmitted(Microsoft.Bond.BondDataType.BT_INT32,24,null),this.PIIExtensions.Count()){t.WriteFieldBegin(Microsoft.Bond.BondDataType.BT_MAP,30,null),t.WriteMapContainerBegin(this.PIIExtensions.Count(),Microsoft.Bond.BondDataType.BT_STRING,Microsoft.Bond.BondDataType.BT_STRUCT);for(var r=0;r<this.PIIExtensions.GetBuffer().length;++r)t.WriteString(this.PIIExtensions.GetBuffer()[r].Key),this.PIIExtensions.GetBuffer()[r].Value.WriteImpl(t,!1);t.WriteContainerEnd(),t.WriteFieldEnd()}else t.WriteFieldOmitted(Microsoft.Bond.BondDataType.BT_MAP,30,null);t.WriteStructEnd(n)},t.prototype.Read=function(e){this.ReadImpl(e,!1)},t.prototype.ReadImpl=function(e,t){},t}();t.Record=r;var o=function(){function e(){this.Source="",this.DataPackageId="",this.Timestamp=new Microsoft.Bond.Int64("0"),this.Records=[]}return e.prototype.Write=function(e){this.WriteImpl(e,!1)},e.prototype.WriteImpl=function(e,t){if(e.WriteStructBegin(null,t),""!=this.Source?(e.WriteFieldBegin(Microsoft.Bond.BondDataType.BT_STRING,2,null),e.WriteString(this.Source),e.WriteFieldEnd()):e.WriteFieldOmitted(Microsoft.Bond.BondDataType.BT_STRING,2,null),""!=this.DataPackageId?(e.WriteFieldBegin(Microsoft.Bond.BondDataType.BT_STRING,5,null),e.WriteString(this.DataPackageId),e.WriteFieldEnd()):e.WriteFieldOmitted(Microsoft.Bond.BondDataType.BT_STRING,5,null),this.Timestamp.Equals("0")?e.WriteFieldOmitted(Microsoft.Bond.BondDataType.BT_INT64,6,null):(e.WriteFieldBegin(Microsoft.Bond.BondDataType.BT_INT64,6,null),e.WriteInt64(this.Timestamp),e.WriteFieldEnd()),this.Records.length){e.WriteFieldBegin(Microsoft.Bond.BondDataType.BT_LIST,8,null),e.WriteContainerBegin(this.Records.length,Microsoft.Bond.BondDataType.BT_STRUCT);for(var n=0;n<this.Records.length;++n)this.Records[n].WriteImpl(e,!1);e.WriteContainerEnd(),e.WriteFieldEnd()}else e.WriteFieldOmitted(Microsoft.Bond.BondDataType.BT_LIST,8,null);e.WriteStructEnd(t)},e.prototype.Read=function(e){this.ReadImpl(e,!1)},e.prototype.ReadImpl=function(e,t){},e}();t.DataPackage=o;var s=function(){function e(){this.DataPackages=[],this.RequestRetryCount=0}return e.prototype.Write=function(e){this.WriteImpl(e,!1)},e.prototype.WriteImpl=function(e,t){if(e.WriteStructBegin(null,t),this.DataPackages.length){e.WriteFieldBegin(Microsoft.Bond.BondDataType.BT_LIST,1,null),e.WriteContainerBegin(this.DataPackages.length,Microsoft.Bond.BondDataType.BT_STRUCT);for(var n=0;n<this.DataPackages.length;++n)this.DataPackages[n].WriteImpl(e,!1);e.WriteContainerEnd(),e.WriteFieldEnd()}else e.WriteFieldOmitted(Microsoft.Bond.BondDataType.BT_LIST,1,null);0!=this.RequestRetryCount?(e.WriteFieldBegin(Microsoft.Bond.BondDataType.BT_INT32,2,null),e.WriteInt32(this.RequestRetryCount),e.WriteFieldEnd()):e.WriteFieldOmitted(Microsoft.Bond.BondDataType.BT_INT32,2,null),e.WriteStructEnd(t)},e.prototype.Read=function(e){this.ReadImpl(e,!1)},e.prototype.ReadImpl=function(e,t){},e}();t.ClientToCollectorRequest=s}(t=e.datamodels||(e.datamodels={}))}(t=e.telemetry||(e.telemetry={}))}(t=e.applications||(e.applications={}))}(microsoft||(microsoft={}));var microsoft;!function(e){var t;!function(e){var t;!function(e){var t;!function(t){!function(e){e[e.SENT=0]="SENT",e[e.SEND_FAILED=1]="SEND_FAILED"}(t.CallbackEventType||(t.CallbackEventType={}));var n=t.CallbackEventType;!function(e){e[e.DATARV_ERROR_OK=0]="DATARV_ERROR_OK",e[e.DATARV_ERROR_INVALID_EVENT=1]="DATARV_ERROR_INVALID_EVENT",e[e.DATARV_ERROR_INVALID_CONFIG=2]="DATARV_ERROR_INVALID_CONFIG",e[e.DATARV_ERROR_INVALID_DEPENDENCIES=3]="DATARV_ERROR_INVALID_DEPENDENCIES",e[e.DATARV_ERROR_INVALID_STATUS=4]="DATARV_ERROR_INVALID_STATUS",e[e.DATARV_ERROR_INVALID_ARG=5]="DATARV_ERROR_INVALID_ARG"}(t.DATARV_ERROR||(t.DATARV_ERROR={}));var i=t.DATARV_ERROR,r=function(){function e(e){this._errorCode=i.DATARV_ERROR_OK,this._errorCode=e}return e.prototype.ErrorCode=function(){return this._errorCode},e.prototype.toString=function(){switch(this._errorCode){case i.DATARV_ERROR_OK:return"DATARV_ERROR_OK";case i.DATARV_ERROR_INVALID_EVENT:return"Event is invalid. Either event.Id is empty, or event.Timestamp is empty, or event.EventType is empty.";case i.DATARV_ERROR_INVALID_CONFIG:return"Invalid configuration. CollectorUrl is missing.";case i.DATARV_ERROR_INVALID_DEPENDENCIES:return"DATARV_ERROR_INVALID_DEPENDENCIES";case i.DATARV_ERROR_INVALID_STATUS:return"Telemetry Manager is not initialized.";case i.DATARV_ERROR_INVALID_ARG:return"TenantToken is null or empty, or events is null.";default:return"Unknown error"}},e}();t.Exception=r;var o=function(){function e(){}return e}();t.TelemetryConfig=o;var s=function(){function e(){}return e.CreateTelemetryManager=function(){return new d},e}();t.TelemetryManagerFactory=s;var a,u=function(){function e(){}return e.MaxPackageSizeInBytes=function(){return 3e6},e.TimeIntervalForNextSendInMS=function(){return 1e3},e}();!function(e){e[e.Created=0]="Created",e[e.Initialized=1]="Initialized",e[e.Started=2]="Started"}(a||(a={}));var d=function(){function t(){this._MaxPackageSizeInBytes=u.MaxPackageSizeInBytes(),this._listeners=[],this._status=a.Created,this._etag=null,this._testServerResponseHook=null,this._isPaused=!1}return t.prototype.Initialize=function(e){if(this._status!=a.Created)throw new r(i.DATARV_ERROR_INVALID_STATUS);if(!e||!e.collectorUrl)throw new r(i.DATARV_ERROR_INVALID_CONFIG);this._config=e,this._Reset(),this._status=a.Initialized,this._Verbose("Initialize() done")},t.prototype.AddListener=function(e){if(this._status<a.Initialized)throw new r(i.DATARV_ERROR_INVALID_STATUS);this._Verbose(["AddListener(), status: ",this._status," old length: ",this._listeners.length," func: ",e].join(""));for(var t=0;t<this._listeners.length;++t)if(this._listeners[t]==e)return void this._Verbose("the listener has been added already, index: "+t);this._listeners.push(e),this._Verbose("AddListener() done, the new length: "+this._listeners.length)},t.prototype.RemoveListener=function(e){if(this._status<a.Initialized)throw new r(i.DATARV_ERROR_INVALID_STATUS);this._Verbose(["RemoveListener(), status: ",this._status," old length: ",this._listeners.length," func: ",e].join(""));for(var t=0;t<this._listeners.length;++t)if(this._listeners[t]==e)return 1==this._listeners.length?this._listeners=[]:t==this._listeners.length-1?this._listeners.pop():this._listeners[t]=this._listeners.pop(),void this._Verbose(["this listener has been found, index: ",t,"new length: ",this._listeners.length].join(""));this._Verbose("listener isn't been found, new length"+this._listeners.length)},t.prototype.Start=function(){if(this._status<a.Initialized)throw new r(i.DATARV_ERROR_INVALID_STATUS);this._Verbose(["Start(), status:",this._status,"tag:",t._tag].join(" ")),this._status>=a.Started&&this._Verbose("Start() already, ignore"),++t._tag,this._status=a.Started,this._Verbose(["Start() done, status: ",this._status,"tag: ",t._tag].join(""))},t.prototype.Stop=function(){if(this._status<a.Initialized)throw new r(i.DATARV_ERROR_INVALID_STATUS);return this._Verbose("Stop(), status: "+this._status),this._status==a.Initialized?void this._Verbose("Stop() already, ignore"):(this._Reset(),this._status=a.Initialized,void this._Verbose("Stop() done, status: "+this._status))},t.prototype.Pause=function(){this._isPaused=!0,this._CleanTimer()},t.prototype.Resume=function(){this._isPaused=!1,this._eventsCache.IsEmpty()||this._timer||this._ScheduleTimer(!1)},t.prototype.Flush=function(e){this._eventsCache.IsEmpty()||this._WorkThread(e,!0)},t.prototype.SendAsync=function(e,n){if(this._status<a.Initialized)throw new r(i.DATARV_ERROR_INVALID_STATUS);if(this._Verbose(["SendAsync(), status:",this._status,"tenantToken:",e,"count:",n.length].join(" ")),this._status<a.Started)return this._Info("SendAsync(), not started, ignore, return false"),!1;if(!e||!n)throw this._Error("SendAsync(), tenantToken or events is null or empty"),new r(i.DATARV_ERROR_INVALID_ARG);for(var o=0;o<n.length;++o)if(!n[o].Id||!t._eventTypeRegex.test(n[o].EventType)||n[o].Timestamp.Equals("0"))throw this._Error(["eventId:",n[o].Id,"eventType:",n[o].EventType,"timestamp high:",n[o].Timestamp.high,"timestamp low:",n[o].Timestamp.low].join("")),new r(i.DATARV_ERROR_INVALID_EVENT);return this._eventsCache.AddEvents(e,n),this._Verbose(["SendAsync(), currentTimer: ",this._timer,"eventsCacheIsEmpty",this._eventsCache.IsEmpty()].join(" ")),this._eventsCache.IsEmpty()||this._timer||this._ScheduleTimer(!1),this._Verbose("SendAsync() done"),!0},t.prototype._WorkThread=function(e,n){var i=this;try{if(this._Verbose("_WorkThread, status: "+this._status),this._status<a.Started)return void this._Verbose("_WorkThread, status is not started, return");var r=this._eventsCache.DequeuEvents();if(null==r)return this._Verbose("_WorkThread, No events found, return"),void this._CleanTimer();var o=this._PackEvents(r.tenantToken,r.events);if(this._eventsCache.AddEvents(r.tenantToken,o.remainedEvents),null==o.buffer||0==o.buffer.length)return void(this._eventsCache.IsEmpty()?(this._Verbose("eventsCache is empty, stop schedule"),this._CleanTimer()):(this._Verbose("eventsCache is not empty, schedule for next run"),this._ScheduleTimer(!1)));if(this._testServerResponseHook){var s=this._testServerResponseHook();return void setTimeout(this._SendCallback(d,r.tenantToken,o.sendEvents,s,!1,null),100)}var u={type:"POST",url:this._config.collectorUrl,processData:!1,headers:{"content-type":"application/bond-compact-binary","client-id":"NO_AUTH","sdk-version":"ACT-Web-JS-"+clienttelemetry_build.version},complete:function(t){return i._SendCallback(d,r.tenantToken,o.sendEvents,t,n,e)}};sct.Utils.IsUint8ArrSupported()?(this._Verbose("Uint8Array is defined, send with binary format directly."),u.data=new Uint8Array(o.buffer)):(this._Verbose("Uint8Array is undefined, send with base64 encode."),u.data=Microsoft.Bond.Encoding.Base64.GetString(o.buffer),u.headers["content-encoding"]="base64"),r.tenantToken&&(u.headers["x-apikey"]=r.tenantToken);var d=t._tag;this._lastActiveTime=(new Date).getTime(),sct.Utils.ajax(u,n),this._Verbose("_Workthread, send via jquery, tag: "+d)}catch(e){this._Error("_WorkThread, exception: "+e)}},t.prototype._PackEvents=function(t,n){this._Verbose("_PackageEvents, total Count: "+n.length);var i=new e.datamodels.ClientToCollectorRequest,r=new e.datamodels.DataPackage;r.Source="JS_default_source",r.DataPackageId=e.datamodels.utils.GetGuid(),r.Timestamp=e.datamodels.utils.GetTimeStamp();var o,s=n;for(n=[];;){if(r.Records=[],r.Records.push.apply(r.Records,s),i.DataPackages=[],i.DataPackages.push(r),o=this._Serialize(i),this._Verbose(["_PackageEvents, sendEvents.length:",s.length,"buffer.length:",o.length,"MaxPackageSize:",this._MaxPackageSizeInBytes].join("")),o.length<this._MaxPackageSizeInBytes)break;if(1==s.length){s=[],o=null;break}var a=s.splice(0,Math.floor(s.length/2));this._Verbose("_PackageEvents, too large, package again"),n.push.apply(n,s),s=a}return this._Verbose(["_PakcageEvents done, sendEventsCount:",s.length,"buffer.length:",null==o?0:o.length,"remained events:",n.length].join("")),{buffer:o,sendEvents:s,remainedEvents:n}},t.prototype._Serialize=function(e){var t=new Microsoft.Bond.IO.MemoryStream,n=new Microsoft.Bond.CompactBinaryProtocolWriter(t);return e.Write(n),t.GetBuffer()},t.prototype._SendCallback=function(e,i,r,o,s,u){if(this._Verbose(["_SendCallback","tag:",e,"current tag:",t._tag,"tenantToken:",i,"events count:",r.length,"jqXHR:",o].join("")),u&&u(o?o.status:0,i,r),!s){var d=null!=o&&o.status>=200&&o.status<300;if(this._status<a.Started||e<t._tag)return void this._Verbose("_SendCallback, is not started, or tag is not the same, return");if(!d&&(!o||o.status&&400!=o.status))return this._Verbose("retry statusCode: "+(o?o.status:0)),this._eventsCache.AddEvents(i,r),void this._ScheduleTimer(!0);for(var c=0;c<this._listeners.length;++c)this._listeners[c](d?n.SENT:n.SEND_FAILED,o?o.status:0,i,r);this._eventsCache.IsEmpty()?(this._Verbose("eventsCache is empty, stop schedule"),this._CleanTimer()):(this._Verbose("eventsCache is not empty, schedule for next run"),this._ScheduleTimer(!1))}},t.prototype._CleanTimer=function(){
	this._Verbose("_CleanTimer(), timer: "+this._timer),this._timer&&(clearTimeout(this._timer),this._timer=null)},t.prototype._ScheduleTimer=function(e){var t=this;if(!this._isPaused)if(this._Verbose("_ScheduleTimer: isRetry: "+e),this._CleanTimer(),e){this._Verbose("_ScheduleTimer, current factor: "+this._rescheduleFactor);var n=Math.floor(5*this._rescheduleFactor*(1+Math.random()));this._timer=setTimeout(function(){return t._WorkThread(null,!1)},1e3*n),this._Verbose("_ScheduleTimer, next try (s): "+n),this._rescheduleFactor<<=1,this._rescheduleFactor>64&&(this._rescheduleFactor=1)}else{var n=0,i=(new Date).getTime(),r=i-this._lastActiveTime;n=r>u.TimeIntervalForNextSendInMS()?0:u.TimeIntervalForNextSendInMS()-r,this._timer=setTimeout(function(){return t._WorkThread(null,!1)},n),this._Verbose("_ScheduleTimer, next try: "+n),this._rescheduleFactor=1}},t.prototype._Verbose=function(e){this._config.log&&this._config.log.Verbose("[TelemetryManagerImpl]: "+e)},t.prototype._Info=function(e){this._config.log&&this._config.log.Info("[TelemetryManagerImpl]: "+e)},t.prototype._Error=function(e){this._config.log&&this._config.log.Error("[TelemetryManagerImpl]: "+e)},t.prototype._Reset=function(){this._Verbose("Reset()"),this._CleanTimer(),this._lastActiveTime=0,this._rescheduleFactor=1,this._sendingEvents=[],this._eventsCache=new c},t.prototype.__GetListenerArray=function(){return this._listeners},t.prototype.__GetTotalEventsCount=function(){return this._eventsCache.GetTotalEventsCount()},t.prototype.__IsScheduled=function(){return null!=this._timer},t.prototype.__ChageMaxPackageSizeInKB=function(e){this._MaxPackageSizeInBytes=1024*e},t.prototype.__SetTestServerResponseHook=function(e){this._testServerResponseHook=e},t._eventTypeRegex=/^[a-zA-Z0-9]([a-zA-Z0-9]|_){2,98}[a-zA-Z0-9]$/,t._tag=0,t}(),c=function(){function e(){this._events={},this._tokens=[]}return e.prototype.AddEvents=function(e,t){t.length&&(this._events[e]||(this._events[e]=[],this._tokens.push(e)),this._events[e].push.apply(this._events[e],t))},e.prototype.IsEmpty=function(){return 0==this._tokens.length},e.prototype.DequeuEvents=function(){if(0==this._tokens.length)return null;var e=this._tokens.shift(),t=this._events[e];return delete this._events[e],{tenantToken:e,events:t}},e.prototype.GetTotalEventsCount=function(){var e=0;for(var t in this._events)e+=this._events[t].length;return e},e}()}(t=e._sender||(e._sender={}))}(t=e.telemetry||(e.telemetry={}))}(t=e.applications||(e.applications={}))}(microsoft||(microsoft={}));var microsoft;!function(e){var t;!function(t){var n;!function(t){var n=t._sender.TelemetryManagerFactory.CreateTelemetryManager(),i=function(){function e(){this.collectorUrl=null,this.enableAutoUserSession=!1,this.browserOverrides=new r}return e}();t.LogConfiguration=i;var r=function(){function e(){this.onSaveData=null,this.onGetData=null}return e}();t.LogConfigurationBrowserOverrides=r;var o=function(){function e(){this.value=null,this.pii=null}return e._isPii=function(e){return null!==e&&void 0!==e&&e!==t.datamodels.PIIKind.NotSet&&!isNaN(e)&&void 0!==t.datamodels.PIIKind[e]},e}(),s=function(){function e(){this.name=null,this.timestamp=null,this.properties={},this.eventType=null}return e.prototype.setProperty=function(n,i,r){if(!n||!e._propertyNameRegex.test(n))throw new u(a.INVALID_PROPERTY_NAME);r?this.properties[n]={value:i,pii:r!=t.datamodels.PIIKind.NotSet?r:null}:this.properties[n]={value:i,pii:null}},e._propertyNameRegex=/^[a-zA-Z0-9](([a-zA-Z0-9|_|\.]){0,98}[a-zA-Z0-9])?$/,e}();t.EventProperties=s,function(e){e[e.INVALID_TENANT_TOKEN=1]="INVALID_TENANT_TOKEN",e[e.MISSING_EVENT_PROPERTIES_NAME=2]="MISSING_EVENT_PROPERTIES_NAME",e[e.INVALID_PROPERTY_NAME=3]="INVALID_PROPERTY_NAME",e[e.MISSING_FAILURE_SIGNATURE=5]="MISSING_FAILURE_SIGNATURE",e[e.MISSING_FAILURE_DETAIL=6]="MISSING_FAILURE_DETAIL",e[e.MISSING_PAGEVIEW_ID=7]="MISSING_PAGEVIEW_ID",e[e.MISSING_PAGEVIEW_NAME=8]="MISSING_PAGEVIEW_NAME",e[e.INVALID_SESSION_STATE=9]="INVALID_SESSION_STATE",e[e.INVALID_CONFIGURATION_USE_CUSTOM_GET_SET=10]="INVALID_CONFIGURATION_USE_CUSTOM_GET_SET"}(t.TelemetryError||(t.TelemetryError={}));var a=t.TelemetryError,u=function(){function e(e){this.errorCode=null,this.errorCode=e}return e.prototype.ErrorCode=function(){return this.errorCode},e.prototype.toString=function(){switch(this.errorCode){case a.INVALID_TENANT_TOKEN:return"Invalid tenant token";case a.MISSING_EVENT_PROPERTIES_NAME:return"Eventproperties.name can not be null or empty";case a.INVALID_PROPERTY_NAME:return"Invalid Key. Key does not conform to regular expression ^[a-zA-Z0-9](([a-zA-Z0-9|_|.]){0,98}[a-zA-Z0-9])?$";case a.MISSING_FAILURE_SIGNATURE:return"Failure signature can't be null or empty.";case a.MISSING_FAILURE_DETAIL:return"Failure detail can't be null or empty.";case a.MISSING_PAGEVIEW_ID:return"Pageview id can't be null or empty.";case a.MISSING_PAGEVIEW_NAME:return"Pageview name can't be null or empty.";case a.INVALID_SESSION_STATE:return"Session state has to be a value from the SessionState enum.";case a.INVALID_CONFIGURATION_USE_CUSTOM_GET_SET:return"Invalid configuration provided during initialization. Both onGetConfigData and onSaveConfigData must be provided together.  These are manditory when running in a non-brower enviornment";default:return"Unknown error"}},e}();t.Exception=u;var d=function(){function n(e){this.contextMap={},this.piiKind=t.datamodels.PIIKind.NotSet,this._allowDeviceInfoFields=!1,this._allowDeviceInfoFields=e}return n.prototype.setAppId=function(e){e&&(this.contextMap["AppInfo.Id"]=e)},n.prototype.setAppVersion=function(e){e&&(this.contextMap["AppInfo.Version"]=e)},n.prototype.setAppLanguage=function(e){e&&(this.contextMap["AppInfo.Language"]=e)},n.prototype.setDeviceId=function(e){e&&this._allowDeviceInfoFields&&(this.contextMap["DeviceInfo.Id"]=e,c.checkAndUpdateDeviceId(e))},n.prototype.setDeviceOsName=function(e){e&&this._allowDeviceInfoFields&&(this.contextMap["DeviceInfo.OsName"]=e)},n.prototype.setDeviceOsVersion=function(e){e&&this._allowDeviceInfoFields&&(this.contextMap["DeviceInfo.OsVersion"]=e)},n.prototype.setDeviceBrowserName=function(e){e&&this._allowDeviceInfoFields&&(this.contextMap["DeviceInfo.BrowserName"]=e)},n.prototype.setDeviceBrowserVersion=function(e){e&&this._allowDeviceInfoFields&&(this.contextMap["DeviceInfo.BrowserVersion"]=e)},n.prototype.setUserId=function(t,n,i){if(t&&(this.contextMap["UserInfo.Id"]=t),i)this.contextMap["UserInfo.IdType"]=i;else{var r;switch(n){case e.applications.telemetry.datamodels.PIIKind.SipAddress:r=e.applications.telemetry.datamodels.UserIdType.SipAddress;break;case e.applications.telemetry.datamodels.PIIKind.PhoneNumber:r=e.applications.telemetry.datamodels.UserIdType.PhoneNumber;break;case e.applications.telemetry.datamodels.PIIKind.SmtpAddress:r=e.applications.telemetry.datamodels.UserIdType.EmailAddress;break;default:r=e.applications.telemetry.datamodels.UserIdType.Unknown}this.contextMap["UserInfo.IdType"]=r}if(n)o._isPii(n)&&(this.piiKind=n);else{var s;switch(i){case e.applications.telemetry.datamodels.UserIdType.Skype:s=e.applications.telemetry.datamodels.PIIKind.Identity;break;case e.applications.telemetry.datamodels.UserIdType.EmailAddress:s=e.applications.telemetry.datamodels.PIIKind.SmtpAddress;break;case e.applications.telemetry.datamodels.UserIdType.PhoneNumber:s=e.applications.telemetry.datamodels.PIIKind.PhoneNumber;break;case e.applications.telemetry.datamodels.UserIdType.SipAddress:s=e.applications.telemetry.datamodels.PIIKind.SipAddress;break;default:s=e.applications.telemetry.datamodels.PIIKind.NotSet}o._isPii(s)&&(this.piiKind=s)}},n.prototype.setUserMsaId=function(e){e&&(this.contextMap["UserInfo.MsaId"]=e)},n.prototype.setUserANID=function(e){e&&(this.contextMap["UserInfo.ANID"]=e)},n.prototype.setUserAdvertisingId=function(e){e&&(this.contextMap["UserInfo.AdvertisingId"]=e)},n.prototype.setUserTimeZone=function(e){e&&(this.contextMap["UserInfo.TimeZone"]=e)},n.prototype.setUserLanguage=function(e){e&&(this.contextMap["UserInfo.Language"]=e)},n}();t.SemanticContext=d;var c=function(){function e(){}return e.initialize=function(n){this._overrides=n;var i=e._getAppLanguage();i&&e.semanticContext.setAppLanguage(i);var r=e._getUserLanguage();r&&e.semanticContext.setUserLanguage(r);var o=(new Date).getTimezoneOffset(),s=o%60,a=(o-s)/60,u="+";a>0&&(u="-"),e.semanticContext.setUserTimeZone(u+(a<10?"0"+a:a.toString())+":"+(s<10?"0"+s:s.toString()));var d=e._getUserAgent();d&&(e.semanticContext.setDeviceBrowserName(e._getBrowserName()),e.semanticContext.setDeviceBrowserVersion(e._getBrowserVersion()),e.semanticContext.setDeviceOsName(e._getOsName()),e.semanticContext.setDeviceOsVersion(e._getOsVersion()));var c=e._getData(e.DEVICE_ID_COOKIE);c&&""!=c||(c=t.datamodels.utils.GetGuid()),e.semanticContext.setDeviceId(c)},e.checkAndUpdateDeviceId=function(t){var n=e._getData(e.DEVICE_ID_COOKIE);n!=t&&(e._saveData(e.DEVICE_ID_COOKIE,t),e._saveData(e.FIRST_LAUNCH_TIME_COOKIE,(new Date).getTime().toString()));var i=e._getData(e.FIRST_LAUNCH_TIME_COOKIE);e.firstLaunchTime=parseInt(i)},e._saveData=function(e,t){if(this._overrides.onSaveData)this._overrides.onSaveData(e,t);else if("undefined"!=typeof document&&document.cookie){var n="expires=Mon, 31 Dec 2029 23:59:59 GMT";document.cookie=e+"="+t+"; "+n}},e._getData=function(e){if(this._overrides.onGetData)return this._overrides.onGetData(e)||"";if("undefined"!=typeof document&&document.cookie)for(var t=e+"=",n=document.cookie.split(";"),i=0;i<n.length;i++){for(var r=n[i],o=0;" "==r.charAt(o);)o++;if(r=r.substring(o),0==r.indexOf(t))return r.substring(t.length,r.length)}return""},e._getUserAgent=function(){return"undefined"!=typeof navigator?navigator.userAgent||"":""},e._getAppLanguage=function(){return"undefined"!=typeof document&&document.documentElement?document.documentElement.lang:null},e._getUserLanguage=function(){return"undefined"!=typeof navigator?navigator.userLanguage||navigator.language:null},e._userAgentContainsString=function(t){return e._getUserAgent().indexOf(t)>-1},e._isIe=function(){return e._userAgentContainsString("Trident")},e._isEdge=function(){return e._userAgentContainsString(e.BROWSERS.EDGE)},e._isOpera=function(){return e._userAgentContainsString("OPR/")},e._getBrowserName=function(){return e._isOpera()?e.BROWSERS.UNKNOWN:e._userAgentContainsString(e.BROWSERS.PHANTOMJS)?e.BROWSERS.PHANTOMJS:e._isIe()?e.BROWSERS.MSIE:e._isEdge()?e.BROWSERS.EDGE:e._userAgentContainsString(e.BROWSERS.ELECTRON)?e.BROWSERS.ELECTRON:e._userAgentContainsString(e.BROWSERS.CHROME)?e.BROWSERS.CHROME:e._userAgentContainsString(e.BROWSERS.FIREFOX)?e.BROWSERS.FIREFOX:e._userAgentContainsString(e.BROWSERS.SAFARI)?e.BROWSERS.SAFARI:e._userAgentContainsString(e.BROWSERS.SKYPE_SHELL)?e.BROWSERS.SKYPE_SHELL:e.BROWSERS.UNKNOWN},e._getBrowserVersion=function(){function t(){var t,n=e._getUserAgent(),i=n.match(new RegExp(e.BROWSERS.MSIE+" "+e.REGEX_VERSION));return i?i[1]:(t=n.match(new RegExp("rv:"+e.REGEX_VERSION)))?t[1]:void 0}function n(t){var n;return t===e.BROWSERS.SAFARI&&(t="Version"),n=e._getUserAgent().match(new RegExp(t+"/"+e.REGEX_VERSION)),n?n[1]:e.UNKNOWN_VERSION}return e._isIe()?t():n(e._getBrowserName())},e._getOsName=function(){var t=/(windows|win32)/i,n=/ arm;/i,i=/windows\sphone\s\d+\.\d+/i,r=/(macintosh|mac os x)/i,o=/(iPad|iPhone|iPod)(?=.*like Mac OS X)/i,s=/(linux|joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk)/i,a=/android/i;return e._getUserAgent().match(i)?e.OPERATING_SYSTEMS.WINDOWS_PHONE:e._getUserAgent().match(n)?e.OPERATING_SYSTEMS.WINDOWS_RT:e._getUserAgent().match(o)?e.OPERATING_SYSTEMS.IOS:e._getUserAgent().match(a)?e.OPERATING_SYSTEMS.ANDROID:e._getUserAgent().match(s)?e.OPERATING_SYSTEMS.LINUX:e._getUserAgent().match(r)?e.OPERATING_SYSTEMS.MACOSX:e._getUserAgent().match(t)?e.OPERATING_SYSTEMS.WINDOWS:e.OPERATING_SYSTEMS.UNKNOWN},e._getOsVersion=function(){function t(){var t=e._getUserAgent().match(new RegExp("Windows NT "+e.REGEX_VERSION));return t&&e.VERSION_MAPPINGS[t[1]]?e.VERSION_MAPPINGS[t[1]]:e.UNKNOWN_VERSION}function n(){var t=e._getUserAgent().match(new RegExp(e.OPERATING_SYSTEMS.MACOSX+" "+e.REGEX_VERSION_MAC));if(t){var n=t[1].replace(/_/g,"."),r=[];if(n){var o=i(n);return o?(r=n.split(o),r[0]):n}}return e.UNKNOWN_VERSION}function i(e){return e.indexOf(".")>-1?".":e.indexOf("_")>-1?"_":null}return e._getOsName()===e.OPERATING_SYSTEMS.WINDOWS?t():e._getOsName()===e.OPERATING_SYSTEMS.MACOSX?n():e.UNKNOWN_VERSION},e.semanticContext=new d((!0)),e.firstLaunchTime=-1,e.BROWSERS={MSIE:"MSIE",CHROME:"Chrome",FIREFOX:"Firefox",SAFARI:"Safari",EDGE:"Edge",ELECTRON:"Electron",SKYPE_SHELL:"SkypeShell",PHANTOMJS:"PhantomJS",UNKNOWN:"Unknown"},e.OPERATING_SYSTEMS={WINDOWS:"Windows",MACOSX:"Mac OS X",WINDOWS_PHONE:"Windows Phone",WINDOWS_RT:"Windows RT",IOS:"iOS",ANDROID:"Android",LINUX:"Linux",UNKNOWN:"Unknown"},e.VERSION_MAPPINGS={5.1:"XP","6.0":"Vista",6.1:"7",6.2:"8",6.3:"8.1","10.0":"10"},e.REGEX_VERSION="([\\d,.]+)",e.REGEX_VERSION_MAC="([\\d,_,.]+)",e.UNKNOWN_VERSION="Unknown",e.DEVICE_ID_COOKIE="MicrosoftApplicationsTelemetryDeviceId",e.FIRST_LAUNCH_TIME_COOKIE="MicrosoftApplicationsTelemetryFirstLaunchTime",e}();!function(e){e[e.STARTED=0]="STARTED",e[e.ENDED=1]="ENDED"}(t.SessionState||(t.SessionState={}));var l=t.SessionState,_=function(){function e(){}return e.initialize=function(t,i){if(!e._initialized){if(!t)throw new u(a.INVALID_TENANT_TOKEN);if(e._defaultToken=t,e._tmConfig.collectorUrl="https://browser.pipe.aria.microsoft.com/Collector/3.0/",e._configuration=i,!("undefined"!=typeof window||i&&i.browserOverrides&&i.browserOverrides.onGetData))throw new u(a.INVALID_CONFIGURATION_USE_CUSTOM_GET_SET);var o=new r;if(i&&(i.collectorUrl&&(e._tmConfig.collectorUrl=i.collectorUrl),i.browserOverrides)){if(i.browserOverrides.onGetData?!i.browserOverrides.onSaveData:!!i.browserOverrides.onSaveData)throw new u(a.INVALID_CONFIGURATION_USE_CUSTOM_GET_SET);o.onGetData=i.browserOverrides.onGetData,o.onSaveData=i.browserOverrides.onSaveData}n.Initialize(e._tmConfig),n.Start(),c.initialize(o),e._initialized=!0,"undefined"!=typeof window&&window.addEventListener&&(i&&i.enableAutoUserSession&&(e._logger=new f,e._logger.logSession(l.STARTED)),window.addEventListener("beforeunload",e._teardown))}},e.pauseTransmission=function(){n.Pause()},e.resumeTransmission=function(){n.Resume()},e.flush=function(e){n.Flush(e)},e.addCallbackListener=function(t){e._initialized&&n.AddListener(t)},e.setContext=function(t,n,i){e._contextProperties.setProperty(t,n,i)},e.isInitialized=function(){return e._initialized},e.getDefaultToken=function(){return e._defaultToken},e.getSemanticContext=function(){return e._semanticContext},e._getInitIdForToken=function(n){return e._initIdMap[n]||(e._initIdMap[n]=t.datamodels.utils.GetGuid()),e._initIdMap[n]},e._getSequenceForToken=function(t){return e._sequenceMap[t]||(e._sequenceMap[t]=0),e._sequenceMap[t]++,e._sequenceMap[t]},e._teardown=function(){e._logger&&e._logger.logSession(l.ENDED),e.flush()},e.__backToUninitialized=function(){e._tmConfig=new t._sender.TelemetryConfig,e._semanticContext=new d((!0)),e._contextProperties=new s,e._configuration=null,n=t._sender.TelemetryManagerFactory.CreateTelemetryManager(),e._initialized=!1,e._initIdMap={},e._sequenceMap={}},e._initialized=!1,e._defaultToken=null,e._tmConfig=new t._sender.TelemetryConfig,e._logger=null,e._initIdMap={},e._sequenceMap={},e._configuration=null,e._contextProperties=new s,e._semanticContext=new d((!0)),e}();t.LogManager=_;var f=function(){function e(e){this._initId=null,this._tenantToken=null,this._contextProperties=new s,this._semanticContext=new d((!1)),this._sessionStartTime=0,this._sessionId=null,e?this._tenantToken=e:this._tenantToken=_.getDefaultToken(),this._initId=_._getInitIdForToken(this._tenantToken)}return e.prototype.logEvent=function(e){if(!e.name)throw new u(a.MISSING_EVENT_PROPERTIES_NAME);var t=this._createEventRecord(e.name,e.eventType);this._addPropertiesAndSendEvent(t,e)},e.prototype.logFailure=function(e,t,n,i,r){if(!e)throw new u(a.MISSING_FAILURE_SIGNATURE);if(!t)throw new u(a.MISSING_FAILURE_DETAIL);var o=this._createEventRecord("failure","failure");o.Extension.Add("Failure.Signature",e),o.Extension.Add("Failure.Detail",t),n&&o.Extension.Add("Failure.Category",n),i&&o.Extension.Add("Failure.Id",i),this._addPropertiesAndSendEvent(o,r)},e.prototype.logPageView=function(e,t,n,i,r,o){if(!e)throw new u(a.MISSING_PAGEVIEW_ID);if(!t)throw new u(a.MISSING_PAGEVIEW_NAME);var s=this._createEventRecord("pageview","pageview");s.Extension.Add("PageView.Id",e),s.Extension.Add("PageView.Name",t),n&&s.Extension.Add("PageView.Category",n),i&&s.Extension.Add("PageView.Uri",i),r&&s.Extension.Add("PageView.ReferrerUri",r),this._addPropertiesAndSendEvent(s,o)},e.prototype.logSession=function(e,n){if(e!==l.STARTED&&e!==l.ENDED)throw new u(a.INVALID_SESSION_STATE);var i=this._createEventRecord("session","session");if(e===l.STARTED){if(this._sessionStartTime>0)return;this._sessionStartTime=(new Date).getTime(),this._sessionId=t.datamodels.utils.GetGuid(),i.Extension.Add("Session.Id",this._sessionId),i.Extension.Add("Session.State","Started")}else if(e===l.ENDED){if(0==this._sessionStartTime)return;var r=Math.floor(((new Date).getTime()-this._sessionStartTime)/1e3);i.Extension.Add("Session.Duration",r.toString()),i.Extension.Add("Session.DurationBucket",this._getSessionDurationFromTime(r)),i.Extension.Add("Session.Id",this._sessionId),i.Extension.Add("Session.State","Ended"),this._sessionId=null,this._sessionStartTime=0}i.Extension.Add("Session.FirstLaunchTime",this._getISOString(new Date(c.firstLaunchTime))),this._addPropertiesAndSendEvent(i,n)},e.prototype.getSessionId=function(){return this._sessionId},e.prototype.setContext=function(e,t,n){this._contextProperties.setProperty(e,t,n)},e.prototype.getSemanticContext=function(){return this._semanticContext},e.prototype._getSessionDurationFromTime=function(e){return e<0?"Undefined":e<=3?"UpTo3Sec":e<=10?"UpTo10Sec":e<=30?"UpTo30Sec":e<=60?"UpTo60Sec":e<=180?"UpTo3Min":e<=600?"UpTo10Min":e<=1800?"UpTo30Min":"Above30Min"},e.prototype._createEventRecord=function(e,n){var i=new t.datamodels.Record;n||(n="custom"),i.EventType=e.toLowerCase(),i.Type=n.toLowerCase(),i.Extension.Add("EventInfo.Source","JS_default_source"),i.Extension.Add("EventInfo.InitId",this._initId),i.Extension.Add("EventInfo.Sequence",_._getSequenceForToken(this._tenantToken).toString()),i.Extension.Add("EventInfo.Name",e.toLowerCase());var r=new Date;return i.Timestamp=t.datamodels.utils.GetTimeStampWithValue(r.getTime()),i.Extension.Add("EventInfo.Time",this._getISOString(r)),i.Extension.Add("EventInfo.SdkVersion","ACT-Web-JS-"+clienttelemetry_build.version),i},e.prototype._getISOString=function(e){function t(e){return e<10?"0"+e:e.toString()}function n(e){return e<10?"00"+e:e<100?"0"+e:e.toString()}return e.getUTCFullYear()+"-"+t(e.getUTCMonth()+1)+"-"+t(e.getUTCDate())+"T"+t(e.getUTCHours())+":"+t(e.getUTCMinutes())+":"+t(e.getUTCSeconds())+"."+n(e.getUTCMilliseconds())+"Z"},e.prototype._addCustomPropertiesToEvent=function(e,t){this._addSemanticContext(e,c.semanticContext),this._addSemanticContext(e,_._semanticContext),this._addSemanticContext(e,this._semanticContext),this._sessionId&&e.Extension.Add("Session.Id",this._sessionId),this._addEventPropertiesToEvent(e,_._contextProperties),this._addEventPropertiesToEvent(e,this._contextProperties),this._addEventPropertiesToEvent(e,t)},e.prototype._addSemanticContext=function(e,n){if(n&&n.contextMap){var i=n.contextMap;for(var r in n.contextMap)"UserInfo.Id"==r&&n.piiKind!=t.datamodels.PIIKind.NotSet?e.AddOrReplacePII(r,i[r],n.piiKind):e.Extension.AddOrReplace(r,i[r])}},e.prototype._addEventPropertiesToEvent=function(e,n){if(n){n.timestamp&&n.timestamp>=new Date("1/1/2000").getTime()&&(e.Timestamp=t.datamodels.utils.GetTimeStampWithValue(n.timestamp),e.Extension.AddOrReplace("EventInfo.Time",this._getISOString(new Date(n.timestamp)))),n.name&&(e.EventType=n.name.toLowerCase(),e.Extension.AddOrReplace("EventInfo.Name",n.name.toLowerCase()));var i=n.properties;if(i)for(var r in i)r&&(i[r].value||i[r].value===!1||0==i[r].value||""==i[r].value)&&(o._isPii(i[r].pii)?(e.AddOrReplacePII(r,i[r].value.toString(),i[r].pii),e.Extension.Remove(r)):(e.Extension.AddOrReplace(r,i[r].value.toString()),e.PIIExtensions.Remove(r)))}},e.prototype._addPropertiesAndSendEvent=function(e,t){this._addCustomPropertiesToEvent(e,t),_.isInitialized()&&(this._sanitizeName(e),n.SendAsync(this._tenantToken,[e]))},e.prototype._sanitizeName=function(e){var t=e.EventType.replace(/\./g,"_");e.EventType=t,e.Extension.AddOrReplace("EventInfo.Name",t)},e}();t.Logger=f}(n=t.telemetry||(t.telemetry={}))}(t=e.applications||(e.applications={}))}(microsoft||(microsoft={})),"undefined"!=typeof module&&(module.exports=microsoft.applications.telemetry);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var buttonConfigFactory_1 = __webpack_require__(7);
	var chatDefinition_1 = __webpack_require__(18);
	var preloadType_1 = __webpack_require__(19);
	var conversationType_1 = __webpack_require__(11);
	var buttonRenderEvent_1 = __webpack_require__(20);
	var buttonClickEvent_1 = __webpack_require__(29);
	var ariaTelemetryService_1 = __webpack_require__(30);
	var ButtonBootstrapper = (function () {
	    function ButtonBootstrapper() {
	        this._buttons = [];
	        this._initialized = false;
	        this.init();
	    }
	    ButtonBootstrapper.prototype.init = function () {
	        var _this = this;
	        this._skypeButtonPlaceholders = document.querySelectorAll('.skype-button');
	        if (!this._skypeButtonPlaceholders.length) {
	            return;
	        }
	        var _loop_1 = function(i) {
	            var skypeButtonPlaceholder = this_1._skypeButtonPlaceholders[i];
	            this_1.createSkypeButton(skypeButtonPlaceholder, function (definition, chat) {
	                definition._isHidden = false;
	                if (skypeButtonPlaceholder.classList.contains('bubble')) {
	                    skypeButtonPlaceholder.firstElementChild.classList.remove('close-bubble');
	                    skypeButtonPlaceholder.firstElementChild.classList.add('open-bubble');
	                }
	                switch (definition.Preload) {
	                    case preloadType_1.PreloadType.UIONLY:
	                        chat.showChat();
	                        break;
	                    case preloadType_1.PreloadType.NONE:
	                    case preloadType_1.PreloadType.FULL:
	                    default:
	                        chat.startChat(definition);
	                        break;
	                }
	                var btnClickEvt = new buttonClickEvent_1.default();
	                btnClickEvt.chatId = definition.ConversationType === conversationType_1.default.AGENT || definition.ConversationType === conversationType_1.default.DIRECT_LINE ? definition.ConversationId : null;
	                _this.telemetryService.sendEvent(btnClickEvt);
	            });
	        };
	        var this_1 = this;
	        for (var i = 0; i < this._skypeButtonPlaceholders.length; i++) {
	            _loop_1(i);
	        }
	        this._showSkypeButtons();
	    };
	    ButtonBootstrapper.prototype.dispose = function () {
	        this._buttons.forEach(function (button) {
	            button.element.removeEventListener('click', button.callback);
	        });
	    };
	    Object.defineProperty(ButtonBootstrapper.prototype, "telemetryService", {
	        get: function () {
	            if (!this._telemetryService) {
	                this._telemetryService = new ariaTelemetryService_1.AriaTelemetryService();
	            }
	            return this._telemetryService;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    ButtonBootstrapper.prototype._showSkypeButtons = function () {
	        for (var i = 0; i < this._skypeButtonPlaceholders.length; i++) {
	            var skypeButtonPlaceholder = this._skypeButtonPlaceholders[i];
	            skypeButtonPlaceholder.style.visibility = null;
	        }
	    };
	    ButtonBootstrapper.prototype.createSkypeButton = function (skypeButtonPlaceholder, onClicked) {
	        var configFactory = new buttonConfigFactory_1.ButtonConfigFactory();
	        var definition = configFactory.getDefinitionFromDOM(skypeButtonPlaceholder);
	        var chat = window.SkypeWebControl.SDK.Chat;
	        var chatAttrs = chat.getChatAttrs();
	        if (!chatAttrs) {
	            chatAttrs = new chatDefinition_1.ChatDefinition();
	        }
	        // definition.MergeWith(chatAttrs)
	        chatAttrs.MergeWith(definition);
	        if (definition && chatAttrs) {
	            definition.MergeWith(chatAttrs);
	        }
	        if (chatAttrs.Preload === preloadType_1.PreloadType.UIONLY) {
	            chat.startChat(chatAttrs);
	        }
	        if (chatAttrs.Preload === preloadType_1.PreloadType.FULL) {
	            chatAttrs._isHidden = true;
	            chat.startChat(chatAttrs);
	        }
	        var callback = function () { return onClicked(chatAttrs, chat); };
	        if (skypeButtonPlaceholder.children.length > 0 || skypeButtonPlaceholder.innerText.length > 0) {
	            skypeButtonPlaceholder.addEventListener('click', callback);
	            this._buttons.push({ element: skypeButtonPlaceholder, callback: callback });
	        }
	        else {
	            var buttonElement = document.createElement('a');
	            var buttonText = definition.Text || 'Contact us';
	            buttonElement.className = 'lwc-chat-button';
	            buttonElement.innerHTML = this.getTemplate(buttonText);
	            buttonElement.addEventListener('click', callback);
	            if (definition.Color) {
	                buttonElement.style.backgroundColor = definition.Color;
	            }
	            skypeButtonPlaceholder.appendChild(buttonElement);
	            this._buttons.push({ element: buttonElement, callback: callback });
	        }
	        !this._initialized && this._showSkypeButtons();
	        this._initialized = true;
	        var btnRenderEvt = new buttonRenderEvent_1.default();
	        btnRenderEvt.chatId = definition.ConversationType === 'agent' ? definition.ConversationId : null;
	        this.telemetryService.sendEvent(btnRenderEvt);
	    };
	    ButtonBootstrapper.prototype.getTemplate = function (label) {
	        return "\n            <span class=\"lwc-button-icon\">\n                <svg viewBox=\"0 0 38 35\" style=\"width: inherit\">\n                <path fill=\"#FFF\" fill-rule=\"evenodd\" d=\"M36.9 10.05c-1-4.27-4.45-7.6-8.8-8.4-2.95-.5-6-.78-9.1-.78-3.1 0-6.15.27-9.1.8-4.35.8-7.8 4.1-8.8 8.38-.4 1.5-.6 3.07-.6 4.7 0 1.62.2 3.2.6 4.7 1 4.26 4.45 7.58 8.8 8.37 2.95.53 6 .45 9.1.45v5.2c0 .77.62 1.4 1.4 1.4.3 0 .6-.12.82-.3l11.06-8.46c2.3-1.53 3.97-3.9 4.62-6.66.4-1.5.6-3.07.6-4.7 0-1.62-.2-3.2-.6-4.7zm-14.2 9.1H10.68c-.77 0-1.4-.63-1.4-1.4 0-.77.63-1.4 1.4-1.4H22.7c.76 0 1.4.63 1.4 1.4 0 .77-.63 1.4-1.4 1.4zm4.62-6.03H10.68c-.77 0-1.4-.62-1.4-1.38 0-.77.63-1.4 1.4-1.4h16.64c.77 0 1.4.63 1.4 1.4 0 .76-.63 1.38-1.4 1.38z\"/></svg>\n            </span>\n            <span id=\"chatIconText\" class=\"lwc-button-text\">" + label + "</span>\n        ";
	    };
	    return ButtonBootstrapper;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ButtonBootstrapper;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var configFactory_1 = __webpack_require__(8);
	var buttonDefinition_1 = __webpack_require__(15);
	var buttonAttributes_1 = __webpack_require__(17);
	var ButtonConfigFactory = (function (_super) {
	    __extends(ButtonConfigFactory, _super);
	    function ButtonConfigFactory() {
	        _super.apply(this, arguments);
	    }
	    /**
	     * Sets the attributes of the button element to represent the
	     * state of given button definition.
	     *
	     * @param {ButtonDefinition} definition
	     * @param {Element} [element]
	     *
	     * @memberOf ButtonConfigFactory
	     */
	    ButtonConfigFactory.prototype.setDOMFrom = function (definition, element) {
	        this.setBaseDOM(definition, element);
	        this.setDom(definition, buttonAttributes_1.default, element, new buttonDefinition_1.ButtonDefinition());
	    };
	    /**
	     * Process the given element data- attributes searching for
	     * the values customizing the behavior of the Skype Button.
	     *
	     * @param {HTMLElement} element
	     * @returns {ButtonDefinition}
	     *
	     * @memberOf ButtonConfigFactory
	     */
	    ButtonConfigFactory.prototype.getDefinitionFromDOM = function (element) {
	        var definition = new buttonDefinition_1.ButtonDefinition();
	        this.parseBaseDom(definition, element);
	        this.parseDom(definition, buttonAttributes_1.default, element);
	        return definition;
	    };
	    return ButtonConfigFactory;
	}(configFactory_1.ConfigFactory));
	exports.ButtonConfigFactory = ButtonConfigFactory;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var attributes_1 = __webpack_require__(9);
	var identityParser_1 = __webpack_require__(10);
	var conversationType_1 = __webpack_require__(11);
	var errorHandler_1 = __webpack_require__(12);
	var stringUtils_1 = __webpack_require__(13);
	var objectUtils_1 = __webpack_require__(14);
	/**
	 * Base configuration factory processing html and urls to populate configuration.
	 *
	 * @export
	 * @class ConfigFactory
	 */
	var ConfigFactory = (function () {
	    function ConfigFactory() {
	    }
	    /**
	     * Process attributes of the given html element and
	     * initialize the provided definition with defined data- attributes.
	     *
	     * @protected
	     * @param {Definition} definition
	     * @param {HTMLElement} element
	     *
	     * @memberOf ConfigFactory
	     */
	    ConfigFactory.prototype.parseBaseDom = function (definition, element) {
	        var conversationId = element.getAttribute(attributes_1.Attributes.BOT_ID);
	        if (conversationId) {
	            definition.ConversationId = identityParser_1.default.getBotId(conversationId);
	            definition.ConversationType = conversationType_1.default.AGENT;
	        }
	        conversationId = element.getAttribute(attributes_1.Attributes.CONTACT_EMAIL);
	        if (conversationId) {
	            definition.ConversationId = conversationId;
	            definition.ConversationType = conversationType_1.default.PERSON;
	        }
	        conversationId = element.getAttribute(attributes_1.Attributes.CONTACT_ID);
	        if (conversationId) {
	            definition.ConversationId = identityParser_1.default.getPersonId(conversationId);
	            definition.ConversationType = conversationType_1.default.PERSON;
	        }
	        conversationId = element.getAttribute(attributes_1.Attributes.THREAD_ID);
	        if (conversationId) {
	            definition.ConversationId = identityParser_1.default.getThreadId(conversationId);
	            definition.ConversationType = conversationType_1.default.GROUP;
	        }
	        conversationId = element.getAttribute(attributes_1.Attributes.JOIN_LINK);
	        if (conversationId) {
	            definition.ConversationId = conversationId;
	            definition.ConversationType = conversationType_1.default.JOIN;
	        }
	        conversationId = element.getAttribute(attributes_1.Attributes.TOKEN);
	        if (conversationId) {
	            definition.ConversationId = conversationId;
	            definition.ConversationType = conversationType_1.default.DIRECT_LINE;
	        }
	        this.parseDom(definition, attributes_1.Attributes, element);
	    };
	    ConfigFactory.prototype.parseDom = function (def, attrs, element) {
	        objectUtils_1.objectProperties(def, function (propName) {
	            if (!propName) {
	                return;
	            }
	            if (!attrs[propName]) {
	                return;
	            }
	            if (element.getAttribute(attrs[propName])) {
	                var value = element.getAttribute(attrs[propName]);
	                if (!value) {
	                    return;
	                }
	                if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
	                    def[propName] = stringUtils_1.default.toBoolean(value);
	                }
	                else {
	                    def[propName] = value;
	                }
	            }
	        });
	    };
	    /**
	     * Sets the DOM element attributes based on the definition.
	     *
	     * @protected
	     * @param {Definition} definition
	     * @param {Element} element
	     *
	     * @memberOf ConfigFactory
	     */
	    ConfigFactory.prototype.setBaseDOM = function (definition, element) {
	        this.setDom(definition, attributes_1.Attributes, element);
	        if (definition.ConversationId) {
	            element.removeAttribute(attributes_1.Attributes.CONTACT_ID);
	            element.removeAttribute(attributes_1.Attributes.BOT_ID);
	            element.removeAttribute(attributes_1.Attributes.JOIN_LINK);
	            if (definition.ConversationType === conversationType_1.default.AGENT) {
	                element.setAttribute(attributes_1.Attributes.BOT_ID, identityParser_1.default.getBotId(definition.ConversationId));
	            }
	            else if (definition.ConversationType === conversationType_1.default.PERSON) {
	                element.setAttribute(attributes_1.Attributes.CONTACT_ID, identityParser_1.default.getPersonId(definition.ConversationId));
	            }
	            else if (definition.ConversationType === conversationType_1.default.JOIN) {
	                element.setAttribute(attributes_1.Attributes.JOIN_LINK, definition.ConversationId);
	            }
	            else if (definition.ConversationType === conversationType_1.default.DIRECT_LINE) {
	                element.setAttribute(attributes_1.Attributes.TOKEN, definition.ConversationId);
	            }
	            else {
	                errorHandler_1.default.throwError(10002, 'Unsupported conversation id:' + definition.ConversationId);
	            }
	        }
	    };
	    ConfigFactory.prototype.setDom = function (def, attrs, element, defaults) {
	        // const defaultDef = <any>(new Definition())
	        objectUtils_1.objectProperties(def, function (propName) {
	            if (def[propName] !== undefined && def[propName] !== null && def[propName] != '') {
	                var value = def[propName];
	                if (typeof (value) === "boolean") {
	                    value = value.toString();
	                }
	                if (!attrs[propName]) {
	                    return;
	                }
	                if (defaults && def[propName] === defaults[propName]) {
	                    return;
	                }
	                element.setAttribute(attrs[propName], value);
	            }
	        });
	    };
	    /**
	     * Process the hosting page url searching for data- keys and sets the
	     * given config values with the provided data- attribute values.
	     *
	     * @protected
	     * @param {Definition} definition
	     * @param {KeyValuePair} params
	     *
	     * @memberOf ConfigFactory
	     */
	    ConfigFactory.prototype.parseBaseUrlParams = function (definition, params) {
	        if (params[attributes_1.Attributes.BOT_ID]) {
	            definition.ConversationId = identityParser_1.default.getBotId(params[attributes_1.Attributes.BOT_ID]);
	            definition.ConversationType = conversationType_1.default.AGENT;
	        }
	        else if (params[attributes_1.Attributes.CONTACT_ID]) {
	            definition.ConversationId = identityParser_1.default.getPersonId(params[attributes_1.Attributes.CONTACT_ID]);
	            definition.ConversationType = conversationType_1.default.PERSON;
	        }
	        else if (params[attributes_1.Attributes.THREAD_ID]) {
	            definition.ConversationId = identityParser_1.default.getThreadId(params[attributes_1.Attributes.THREAD_ID]);
	            definition.ConversationType = conversationType_1.default.GROUP;
	        }
	        else if (params[attributes_1.Attributes.JOIN_LINK]) {
	            definition.ConversationId = params[attributes_1.Attributes.JOIN_LINK];
	            definition.ConversationType = conversationType_1.default.JOIN;
	        }
	        else if (params[attributes_1.Attributes.TOKEN]) {
	            definition.ConversationId = params[attributes_1.Attributes.TOKEN];
	            definition.ConversationType = conversationType_1.default.DIRECT_LINE;
	        }
	        this.parseUrlParams(definition, attributes_1.Attributes, params);
	    };
	    ConfigFactory.prototype.parseUrlParams = function (def, attrs, params) {
	        objectUtils_1.objectProperties(def, function (propName) {
	            if (params[attrs[propName]]) {
	                var value = params[attrs[propName]];
	                if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
	                    def[propName] = stringUtils_1.default.toBoolean(value);
	                }
	                else {
	                    def[propName] = value;
	                }
	            }
	        });
	    };
	    /**
	     * Collects the query parameters into key/value string pairs.
	     *
	     * @protected
	     * @returns {KeyValuePair}
	     *
	     * @memberOf ConfigFactory
	     */
	    ConfigFactory.prototype.getQueryStringParameters = function () {
	        var found = false;
	        var variables = window.location.search.substring(1).split('&');
	        var result = {};
	        variables.forEach(function (variable) {
	            if (variable) {
	                found = true;
	                var tuple = variable.split('=');
	                result[decodeURIComponent(tuple[0])] = decodeURIComponent(tuple[1]) || '';
	            }
	        });
	        if (found) {
	            return result;
	        }
	        else {
	            return null;
	        }
	    };
	    return ConfigFactory;
	}());
	exports.ConfigFactory = ConfigFactory;


/***/ }),
/* 9 */
/***/ (function(module, exports) {

	"use strict";
	var Attributes = (function () {
	    function Attributes() {
	    }
	    Attributes.Theme = 'data-theme';
	    Attributes.Locale = 'data-locale';
	    Attributes.BOT_ID = 'data-bot-id';
	    Attributes.CONTACT_ID = 'data-contact-id';
	    Attributes.CONTACT_EMAIL = 'data-contact-email';
	    Attributes.JOIN_LINK = 'data-join-link';
	    Attributes.THREAD_ID = 'data-thread-id';
	    Attributes.TOKEN = 'data-token';
	    Attributes.Payload = 'data-payload';
	    Attributes.BingDLApi = 'data-bing-dl-api';
	    Attributes.Title = 'data-title';
	    Attributes.Avatar = 'data-avatar';
	    Attributes.PrivacyUri = 'data-privacy-uri';
	    Attributes.TermsOfUseUri = 'data-tou-uri';
	    return Attributes;
	}());
	exports.Attributes = Attributes;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var conversationType_1 = __webpack_require__(11);
	var IdentityParser = (function () {
	    function IdentityParser() {
	    }
	    IdentityParser.strip = function (identity) {
	        var match = identity.match(this.idRegExp);
	        if (match) {
	            return match[2];
	        }
	        return identity;
	    };
	    IdentityParser.isPersonConversation = function (conversationId) {
	        var conversationTypeId = conversationId.split(':')[0];
	        return conversationTypeId === this.SKYPE_USER_PREFIX;
	    };
	    IdentityParser.isEmail = function (conversationId) {
	        var emailReg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	        return emailReg.test(conversationId);
	    };
	    IdentityParser.isThread = function (conversationId) {
	        var conversationTypeId = conversationId.split(':')[0];
	        return conversationTypeId === this.THREAD_PREFIX;
	    };
	    IdentityParser.isJoinUrl = function (conversationId) {
	        return conversationId.indexOf(this.URL_PREFIX) === 0;
	    };
	    IdentityParser.isToken = function (conversationId) {
	        return conversationId.indexOf(this.DL_PREFIX) === 0;
	    };
	    IdentityParser.isBotConversation = function (conversationId) {
	        var conversationTypeId = conversationId.split(':')[0];
	        return conversationTypeId === this.BOT_PREFIX;
	    };
	    IdentityParser.getBotId = function (identity) {
	        return this.getNormalizeId(identity);
	    };
	    IdentityParser.getPersonId = function (identity) {
	        return this.getNormalizeId(identity);
	    };
	    IdentityParser.getThreadId = function (identity) {
	        return this.getNormalizeId(identity);
	    };
	    IdentityParser.getToken = function (identity) {
	        return this.getNormalizeId(identity);
	    };
	    IdentityParser.getCompleteBotId = function (identity) {
	        return this.getCompleteId(identity, this.BOT_PREFIX);
	    };
	    IdentityParser.getCompletePersonId = function (identity) {
	        return this.getCompleteId(identity, this.SKYPE_USER_PREFIX);
	    };
	    IdentityParser.getCompleteThreadId = function (identity) {
	        return this.getCompleteId(identity, this.THREAD_PREFIX);
	    };
	    IdentityParser.addPrefix = function (prefix, identity) {
	        if (identity.indexOf(prefix + this.SPLITTER) === 0) {
	            return identity;
	        }
	        if (identity.indexOf(this.SPLITTER) === 0) {
	            return prefix + identity;
	        }
	        return prefix + this.SPLITTER + identity;
	    };
	    IdentityParser.getConversationType = function (conversationId) {
	        if (this.isPersonConversation(conversationId)) {
	            return conversationType_1.default.PERSON;
	        }
	        if (this.isBotConversation(conversationId)) {
	            return conversationType_1.default.AGENT;
	        }
	        if (this.isJoinUrl(conversationId)) {
	            return conversationType_1.default.JOIN;
	        }
	        if (this.isToken(conversationId)) {
	            return conversationType_1.default.AGENT;
	        }
	        return conversationType_1.default.UNDEFINED;
	    };
	    IdentityParser.getNormalizeId = function (id) {
	        if (id.match(this.idRegExp)) {
	            return id.replace(/\d{1,2}:/, '');
	        }
	        return id;
	    };
	    IdentityParser.getCompleteId = function (id, prefix) {
	        if (id.match(this.idRegExp)) {
	            return id;
	        }
	        return prefix + ':' + id;
	    };
	    IdentityParser.SPLITTER = ':';
	    IdentityParser.SKYPE_USER_PREFIX = '8';
	    IdentityParser.THREAD_PREFIX = '18';
	    IdentityParser.BOT_PREFIX = '28';
	    IdentityParser.URL_PREFIX = 'HTTP';
	    IdentityParser.DL_PREFIX = '99';
	    IdentityParser.idRegExp = /(\d{1,2}:)([\S]*)/;
	    return IdentityParser;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = IdentityParser;


/***/ }),
/* 11 */
/***/ (function(module, exports) {

	"use strict";
	var ConversationType = (function () {
	    function ConversationType() {
	    }
	    ConversationType.UNDEFINED = '';
	    ConversationType.PERSON = 'person';
	    ConversationType.AGENT = 'agent';
	    ConversationType.JOIN = 'join';
	    ConversationType.GROUP = 'group';
	    ConversationType.DIRECT_LINE = 'dl';
	    return ConversationType;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ConversationType;


/***/ }),
/* 12 */
/***/ (function(module, exports) {

	"use strict";
	var ErrorHandler = (function () {
	    function ErrorHandler() {
	    }
	    ErrorHandler.throwError = function (code, message) {
	        console.log('[' + code + ']::' + message);
	        throw new Error(code + '');
	    };
	    return ErrorHandler;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ErrorHandler;


/***/ }),
/* 13 */
/***/ (function(module, exports) {

	"use strict";
	var StringUtils = (function () {
	    function StringUtils() {
	    }
	    /**
	      * Converts string value to boolean value.
	      *
	      * @static
	      * @param {string} value
	      * @returns {boolean}
	      *
	      * @memberOf StringUtils
	      */
	    StringUtils.toBoolean = function (value) {
	        if (!value) {
	            return null;
	        }
	        return value.toLowerCase() === 'true';
	    };
	    /**
	    * Adds px at the end of the size if it is not already there.
	    *
	    * @static
	    * @param {string} size
	    * @returns {string}
	    *
	    * @memberOf StringUtils
	    */
	    // public static normalizeSize(size: string): string {
	    //     if (!size) {
	    //         return null;
	    //     }
	    //     if (/\d$/.test(size)) {
	    //         return size + 'px';
	    //     }
	    //     return size;
	    // }
	    StringUtils.wordAt = function (text, position) {
	        var boundaries = this.wordBoundariesAt(text, position);
	        return text.substring(boundaries.start, boundaries.end);
	    };
	    // letter at 'start' is included in word, while letter at index 'end' is excluded
	    StringUtils.wordBoundariesAt = function (text, position) {
	        var left = text.substring(0, position).search(/\S+$/);
	        var right = text.substring(position).search(/\s/);
	        if (left === -1) {
	            left = position;
	        }
	        if (right === -1) {
	            right = text.length;
	        }
	        else {
	            right += position;
	        }
	        return {
	            start: left,
	            end: right
	        };
	    };
	    StringUtils.b64DecodeUnicode = function (str) {
	        return decodeURIComponent(Array.prototype.map.call(atob(str), function (c) {
	            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	        }).join(''));
	    };
	    StringUtils.zipString = function (a, b) {
	        if (a.length === 0) {
	            return b;
	        }
	        if (b.length === 0) {
	            return a;
	        }
	        return a[0] + b[0] + this.zipString(a.substr(1), b.substr(1));
	    };
	    return StringUtils;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = StringUtils;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

	"use strict";
	exports.objectProperties = function (object, callback) {
	    for (var prop in object) {
	        if (!object.hasOwnProperty(prop)) {
	            continue;
	        }
	        if (callback) {
	            callback(prop);
	        }
	    }
	};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var definition_1 = __webpack_require__(16);
	var ButtonDefinition = (function (_super) {
	    __extends(ButtonDefinition, _super);
	    function ButtonDefinition() {
	        _super.apply(this, arguments);
	        this.Text = '';
	        this.Color = '';
	    }
	    return ButtonDefinition;
	}(definition_1.Definition));
	exports.ButtonDefinition = ButtonDefinition;


/***/ }),
/* 16 */
/***/ (function(module, exports) {

	"use strict";
	var Definition = (function () {
	    function Definition() {
	        this.Locale = '';
	        this.Theme = '';
	        this.Payload = '';
	        this.BingDLApi = false;
	        this.Title = '';
	        this.Avatar = '';
	        this.PrivacyUri = '';
	        this.TermsOfUseUri = '';
	    }
	    Definition.prototype.MergeWith = function (definition) {
	        if (!definition) {
	            return;
	        }
	        var objectTarget = this;
	        var objectSource = definition;
	        for (var prop in objectSource) {
	            if (!objectSource.hasOwnProperty(prop)) {
	                continue;
	            }
	            if (prop.indexOf('_') === 0) {
	                continue;
	            }
	            if (objectSource[prop] !== undefined && objectSource[prop] !== null && objectSource[prop] !== '') {
	                objectTarget[prop] = objectSource[prop];
	            }
	        }
	    };
	    return Definition;
	}());
	exports.Definition = Definition;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var attributes_1 = __webpack_require__(9);
	var ButtonAttributes = (function (_super) {
	    __extends(ButtonAttributes, _super);
	    function ButtonAttributes() {
	        _super.apply(this, arguments);
	    }
	    ButtonAttributes.Text = 'data-text';
	    ButtonAttributes.Color = 'data-color';
	    return ButtonAttributes;
	}(attributes_1.Attributes));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ButtonAttributes;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var definition_1 = __webpack_require__(16);
	var ChatDefinition = (function (_super) {
	    __extends(ChatDefinition, _super);
	    function ChatDefinition() {
	        _super.apply(this, arguments);
	        this.CanClose = true;
	        this.CanUploadFile = true;
	        this.CanCollapse = false;
	        this.ShowHeader = true; // TRUE
	        this.EnableTranslator = false;
	        this.ColorMain = '';
	        this.ColorMessage = '';
	        this.CssUrl = '';
	        this.Partner = '';
	        this.Preload = '';
	        this.Frameless = false;
	        this.EntryAnim = true;
	        this.GuestOnly = false;
	    }
	    return ChatDefinition;
	}(definition_1.Definition));
	exports.ChatDefinition = ChatDefinition;


/***/ }),
/* 19 */
/***/ (function(module, exports) {

	"use strict";
	var PreloadType = (function () {
	    function PreloadType() {
	    }
	    PreloadType.NONE = 'none';
	    PreloadType.UIONLY = 'uionly';
	    PreloadType.FULL = 'full';
	    return PreloadType;
	}());
	exports.PreloadType = PreloadType;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var telemetryEvent_1 = __webpack_require__(21);
	var piiType_1 = __webpack_require__(23);
	var telemetryPropertyValue_1 = __webpack_require__(22);
	var ButtonRenderEvent = (function (_super) {
	    __extends(ButtonRenderEvent, _super);
	    function ButtonRenderEvent() {
	        _super.call(this, 'kpi_button_render');
	    }
	    ButtonRenderEvent.prototype.getCustomProperties = function () {
	        var props = new Array();
	        props.push(telemetryPropertyValue_1.TelemetryPropertyValue.Create('chatId', this.chatId ? this.chatId : telemetryEvent_1.NA, piiType_1.PIIType.NotSet));
	        return props;
	    };
	    return ButtonRenderEvent;
	}(telemetryEvent_1.TelemetryEvent));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ButtonRenderEvent;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var telemetryPropertyValue_1 = __webpack_require__(22);
	var piiType_1 = __webpack_require__(23);
	var app_1 = __webpack_require__(24);
	var config_1 = __webpack_require__(25);
	var identityType_1 = __webpack_require__(27);
	var errorHandler_1 = __webpack_require__(12);
	exports.NA = 'n/a';
	/**
	 * Base telemetry event class which all the
	 * specialized events have to extend.
	 *
	 * @export
	 * @abstract
	 * @class TelemetryEvent
	 */
	var TelemetryEvent = (function () {
	    function TelemetryEvent(eventName) {
	        this.name = eventName;
	        this.timestamp = Date.now();
	        this.type = 'general';
	    }
	    /**
	     * Method providing a perf efficient way for telemetry provider
	     * to get a list of all event properties which needs to be sent.
	     *
	     * @abstract
	     * @returns {Array<TelemetryPropertyValue>}
	     *
	     * @memberOf TelemetryEvent
	     */
	    TelemetryEvent.prototype.getEventProperties = function () {
	        this.version = telemetryPropertyValue_1.TelemetryPropertyValue.Create('version', config_1.default.ECS.version, piiType_1.PIIType.NotSet);
	        this.host = telemetryPropertyValue_1.TelemetryPropertyValue.Create('host', this.gethost(), piiType_1.PIIType.NotSet);
	        this.lang = telemetryPropertyValue_1.TelemetryPropertyValue.Create('lang', app_1.default.language || exports.NA, piiType_1.PIIType.NotSet);
	        this.user = telemetryPropertyValue_1.TelemetryPropertyValue.Create('user', app_1.default.currentUserName || exports.NA, piiType_1.PIIType.Identity);
	        this.setIdentityType();
	        var properties = this.getCustomProperties();
	        return properties;
	    };
	    // public isBotRelated(): boolean {
	    //     return this.sdkMode === SDKMode.BOT || this.sdkMode === SDKMode.DIRECT_LINE_TOKEN;
	    // }
	    // public isPersonRelated(): boolean {
	    //     return this.sdkMode === SDKMode.PERSON;
	    // }
	    TelemetryEvent.prototype.getProperty = function (value) {
	        if (value === undefined || value === null) {
	            return exports.NA;
	        }
	        if (typeof (value) !== 'string') {
	            return value + '';
	        }
	        return value;
	    };
	    /**
	   * Sets the identitytype property.
	   *
	   * @private
	   *
	   * @memberOf TelemetryEvent
	   */
	    TelemetryEvent.prototype.setIdentityType = function () {
	        var type = '';
	        switch (app_1.default.currentUserIdentityType) {
	            case identityType_1.IdentityType.UNDETERMINED:
	                type = exports.NA;
	                break;
	            case identityType_1.IdentityType.GUEST:
	                type = 'Guest';
	                break;
	            case identityType_1.IdentityType.SKYPE:
	                type = 'Skype';
	                break;
	            case identityType_1.IdentityType.DL_TOKEN:
	                type = 'Direct line token';
	                break;
	            case identityType_1.IdentityType.UNDEFINED:
	                errorHandler_1.default.throwError(10030, 'Undefined identity type:' + app_1.default.currentUserIdentityType);
	            default:
	                errorHandler_1.default.throwError(10031, 'Unknown identityType:' + app_1.default.currentUserIdentityType);
	        }
	        console.log('[telemetryEvent:] ' + type);
	        this.identityType = telemetryPropertyValue_1.TelemetryPropertyValue.Create('identitytype', type, piiType_1.PIIType.NotSet);
	    };
	    TelemetryEvent.prototype.gethost = function () {
	        if (app_1.default.host && app_1.default.host.toLowerCase() !== exports.NA.toLowerCase()) {
	            return app_1.default.host;
	        }
	        try {
	            var hostname = window.location.hostname;
	            if (!hostname && hostname.length > 0) {
	                return hostname;
	            }
	            if (window.location.protocol.toLowerCase() === 'file:') {
	                hostname = 'local';
	            }
	            return hostname;
	        }
	        catch (e) {
	            return exports.NA;
	        }
	    };
	    return TelemetryEvent;
	}());
	exports.TelemetryEvent = TelemetryEvent;


/***/ }),
/* 22 */
/***/ (function(module, exports) {

	"use strict";
	var TelemetryPropertyValue = (function () {
	    function TelemetryPropertyValue() {
	    }
	    /**
	     * Creates a new telemetry property instance.
	     *
	     * @static
	     * @param {string} key
	     * @param {(string | number | boolean)} value
	     * @param {PIIType} type
	     * @returns
	     *
	     * @memberOf TelemeteryPropertyValue
	     */
	    TelemetryPropertyValue.Create = function (key, value, type) {
	        var telemetryProperty = new TelemetryPropertyValue();
	        telemetryProperty.key = key;
	        telemetryProperty.value = value;
	        telemetryProperty.type = type;
	        return telemetryProperty;
	    };
	    return TelemetryPropertyValue;
	}());
	exports.TelemetryPropertyValue = TelemetryPropertyValue;


/***/ }),
/* 23 */
/***/ (function(module, exports) {

	"use strict";
	(function (PIIType) {
	    PIIType[PIIType["NotSet"] = 0] = "NotSet";
	    // DistinguishedName = 1,
	    // GenericData = 2,
	    // IPV4Address = 3,
	    // IPv6Address = 4,
	    // MailSubject = 5,
	    // PhoneNumber = 6,
	    // QueryString = 7,
	    // SipAddress = 8,
	    // SmtpAddress = 9,
	    PIIType[PIIType["Identity"] = 10] = "Identity";
	})(exports.PIIType || (exports.PIIType = {}));
	var PIIType = exports.PIIType;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var config_1 = __webpack_require__(25);
	var identityType_1 = __webpack_require__(27);
	var sdkMode_1 = __webpack_require__(28);
	var App = (function () {
	    function App() {
	    }
	    // public static isDirectLineBackend(){
	    //     return this.backend === MessagingBackend.DIRECT_LINE;
	    // }
	    App.isGuestUser = function () {
	        return this.currentUserIdentityType === identityType_1.IdentityType.GUEST;
	    };
	    /**
	     * Currect culture locale of the user - default en-us
	     *
	     * @static
	     *
	     * @memberOf App
	     */
	    App.currentLocale = config_1.default.LOCALE;
	    /**
	     * Backend service being use by the control.
	     *
	     * @static
	     * @type {MessagingBackend}
	     * @memberOf App
	     */
	    // public static backend: MessagingBackend = MessagingBackend.UNDETERMINED;
	    /**
	     * Represents the identity of the current user.
	     *
	     * @static
	     * @type {IdentityType.UNDETERMINED}
	     * @memberOf App
	     */
	    App.currentUserIdentityType = identityType_1.IdentityType.UNDETERMINED;
	    /**
	     * Mode in which SDK markup is defined.
	     *
	     * @static
	     * @type {SDKMode}
	     * @memberOf App
	     */
	    App.activeConversationSdkMode = sdkMode_1.SDKMode.UNDEFINED;
	    /**
	     * Identifier of the hosting property -
	     * 1st party - name
	     * 3rd party - guid
	     *
	     * @static
	     * @type {string}
	     * @memberOf App
	     */
	    App.host = 'N/A';
	    App.translatorEnabled = false;
	    App.frameless = false;
	    return App;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = App;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var sessionStorageKeys_1 = __webpack_require__(26);
	var errorHandler_1 = __webpack_require__(12);
	var Configuration = (function () {
	    function Configuration() {
	    }
	    Object.defineProperty(Configuration, "ECS", {
	        get: function () {
	            if (!SkypeWebControl || !SkypeWebControl.EcsConfig) {
	                errorHandler_1.default.throwError(10001, 'You need to setup ecs config context prior to using it.');
	            }
	            return SkypeWebControl.EcsConfig;
	        },
	        set: function (value) {
	            window.SkypeWebControl = window.SkypeWebControl || {};
	            window.SkypeWebControl.EcsConfig = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Configuration.APPNAME = 'SWC';
	    Configuration.LOCALE = 'en-us';
	    Configuration.ORIGIN = 'SkypeLWC';
	    Configuration.MSG_MAX_LENGTH = 2000;
	    Configuration.SKYPE_TOKEN_KEY = sessionStorageKeys_1.SKYPE_TOKEN_KEY;
	    Configuration.SKYPE_REGTOKEN_KEY = sessionStorageKeys_1.SKYPE_REGTOKEN_KEY;
	    Configuration.PLATFORM_ID = 912;
	    // NOTE: nimal, 5.10.2016 - Changing this requires rev change in Loader!
	    Configuration.BUTTON_MARKER_CLASS = '.skype-button';
	    // NOTE: nimal, 5.10.2016 - Changing this requires rev change in Loader!
	    Configuration.CHAT_MARKER_CLASS = '.skype-chat';
	    Configuration.CHAT_FRAME_MARKER_CLASS = '.lwc-chat-frame';
	    // signin manager
	    Configuration.LOGIN_CLIENT_ID = '919866';
	    Configuration.LOGIN_PAGE_URL = 'https://login.skype.com/login';
	    Configuration.LOGIN_THEME = 'skype-white';
	    Configuration.LOGOUT_PAGE_URL = 'https://login.skype.com/logout';
	    Configuration.LOGIN_POPUP_URL = 'https://demoplayground.skype.com/joinlwc?t=';
	    Configuration.LOGIN_POPUP_FEATURES = 'width=600, height=620, menubar=no, status=no, titlebar=no, toolbar=no';
	    Configuration.LOGOUT_POPUP_FEATURES = 'width=1, height=1, menubar=no, status=no, titlebar=no, toolbar=no';
	    // services/ams
	    Configuration.AMS_HOST_URL = 'https://api.asm.skype.com/v1/';
	    // services/aps
	    Configuration.APS_HOST_URL = 'https://api.aps.skype.com/v1/';
	    Configuration.CDN_SERVICE_HOST = 'secure.skypeassets.com';
	    // services/urlp
	    Configuration.URLP_SERVICE_URL = 'https://urlp.asm.skype.com';
	    // services/SkypeGraphe
	    Configuration.SKYPE_GRAPH_URL = 'https://skypegraph.skype.com/';
	    // services/invite
	    // public static INVITE_HOST_URL = 'https://latest-join.skype.com/api/v1/';
	    Configuration.INVITE_HOST_URL = 'https://join.skype.com/api/v1/';
	    // services/chat
	    // public static CHAT_MAX_RETRIES = 3;
	    Configuration.CHAT_CLIENT_INFO = 'os=Windows; osVer=10; proc=Win32; lcid=en-us; deviceType=1; country=n/a; clientName=swc; clientVer=999/0.80.0.0/swc';
	    // public static CHAT_GUEST_HOST_URL = 'https://co4-df-client-s.gateway.messenger.live.com/v1/';
	    Configuration.CHAT_GUEST_HOST_URL = 'https://client-s.gateway.messenger.live.com/v1/';
	    Configuration.CHAT_HOST_URL = 'https://client-s.gateway.messenger.live.com/v1/';
	    Configuration.CHAT_JOIN_URL = 'https://latest-join.skype.com/api/v2/conversation';
	    // services/contactss
	    Configuration.SKYPE_CALLER_ID = 'lwc';
	    Configuration.CONTACTS_HOST_URL = 'https://contacts.skype.com/contacts/v2/';
	    // services/joinagents
	    Configuration.AGENTS_HOST_URL = 'https://join.skype.com/';
	    // services/stratus
	    Configuration.STRATUS_DOMAIN_HOST_URL = 'https://api.skype.com/';
	    Configuration.ECS_CLIENT_NAME = 'skype';
	    Configuration.ECS_TEAM_NAME = 'lwc';
	    Configuration.ECS_CLIENT_VERSION = '1.00';
	    return Configuration;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Configuration;


/***/ }),
/* 26 */
/***/ (function(module, exports) {

	"use strict";
	exports.SKYPE_TOKEN_KEY = 'skype|token';
	exports.SKYPE_REGTOKEN_KEY = 'skype|registrationtoken';


/***/ }),
/* 27 */
/***/ (function(module, exports) {

	"use strict";
	(function (IdentityType) {
	    /**
	     * Using of this enum points to application error.
	     */
	    IdentityType[IdentityType["UNDEFINED"] = 0] = "UNDEFINED";
	    /**
	     * The identity of user is not determined at this time yet.
	     */
	    IdentityType[IdentityType["UNDETERMINED"] = 10] = "UNDETERMINED";
	    /**
	     * User is a skype guest user
	     */
	    IdentityType[IdentityType["GUEST"] = 100] = "GUEST";
	    /**
	     * User is a skype authenticated user
	     */
	    IdentityType[IdentityType["SKYPE"] = 200] = "SKYPE";
	    /**
	     * User authenticated using the DL token
	     */
	    IdentityType[IdentityType["DL_TOKEN"] = 300] = "DL_TOKEN";
	})(exports.IdentityType || (exports.IdentityType = {}));
	var IdentityType = exports.IdentityType;


/***/ }),
/* 28 */
/***/ (function(module, exports) {

	"use strict";
	(function (SDKMode) {
	    /**
	     * Using of this enum points to application error.
	     */
	    SDKMode[SDKMode["UNDEFINED"] = 0] = "UNDEFINED";
	    /**
	     * Conversation is 1-1 conversation with another skype user.
	     */
	    SDKMode[SDKMode["PERSON"] = 1] = "PERSON";
	    /**
	     * Conversation is group conversation for a given threadId
	     */
	    SDKMode[SDKMode["THREAD"] = 2] = "THREAD";
	    /**
	     * Conversation is 1-1 conversation with a bot.
	     */
	    SDKMode[SDKMode["BOT"] = 3] = "BOT";
	    /**
	     * Conversation is group conversation for a given join url,
	     */
	    SDKMode[SDKMode["JOIN_URL"] = 4] = "JOIN_URL";
	    /**
	     * Direct line mode
	     */
	    SDKMode[SDKMode["DIRECT_LINE_TOKEN"] = 5] = "DIRECT_LINE_TOKEN";
	})(exports.SDKMode || (exports.SDKMode = {}));
	var SDKMode = exports.SDKMode;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var telemetryEvent_1 = __webpack_require__(21);
	var piiType_1 = __webpack_require__(23);
	var telemetryPropertyValue_1 = __webpack_require__(22);
	var ButtonClickEvent = (function (_super) {
	    __extends(ButtonClickEvent, _super);
	    function ButtonClickEvent() {
	        _super.call(this, 'kpi_button_click');
	    }
	    ButtonClickEvent.prototype.getCustomProperties = function () {
	        var props = new Array();
	        props.push(telemetryPropertyValue_1.TelemetryPropertyValue.Create('chatId', this.chatId ? this.chatId : telemetryEvent_1.NA, piiType_1.PIIType.NotSet));
	        return props;
	    };
	    return ButtonClickEvent;
	}(telemetryEvent_1.TelemetryEvent));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ButtonClickEvent;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var app_1 = __webpack_require__(24);
	var telemetryPropertyValue_1 = __webpack_require__(22);
	var telemetryEvent_1 = __webpack_require__(21);
	var config_1 = __webpack_require__(25);
	var piiType_1 = __webpack_require__(23);
	var AriaTelemetryService = (function () {
	    function AriaTelemetryService() {
	    }
	    // todo - this can be most probably promiseless
	    AriaTelemetryService.prototype.getLogger = function () {
	        var _this = this;
	        if (this.loggerPromise) {
	            return this.loggerPromise;
	        }
	        var self = this;
	        this.loggerPromise = new Promise(function (resolve, reject) {
	            if (_this.logger) {
	                resolve(_this.logger);
	                self.loggerPromise = null;
	                return;
	            }
	            window.ariaTelemetry.LogManager.initialize(config_1.default.ECS.ariaTenantId);
	            _this.logger = new window.ariaTelemetry.Logger(config_1.default.ECS.ariaTenantId);
	            resolve(_this.logger);
	            self.loggerPromise = null;
	        });
	        return this.loggerPromise;
	    };
	    ;
	    AriaTelemetryService.prototype.sendEvent = function (event) {
	        var _this = this;
	        this.getLogger().then(function (logger) {
	            var eventProperties = new window.ariaTelemetry.EventProperties();
	            eventProperties.name = event.name;
	            eventProperties.eventType = event.type;
	            eventProperties.timestamp = event.timestamp;
	            // todo: pass served config ids from ecs and pass them here
	            var properties = event.getEventProperties();
	            properties.forEach(function (property) {
	                _this.addProperty(eventProperties, property);
	            });
	            _this.addProperty(eventProperties, event.version);
	            _this.addProperty(eventProperties, event.user);
	            _this.addProperty(eventProperties, event.identityType);
	            _this.addProperty(eventProperties, event.host);
	            _this.addProperty(eventProperties, telemetryPropertyValue_1.TelemetryPropertyValue.Create('sessionId', app_1.default.sessionId ? app_1.default.sessionId : telemetryEvent_1.NA, piiType_1.PIIType.NotSet));
	            console.log(eventProperties);
	            logger.logEvent(eventProperties);
	        });
	    };
	    ;
	    AriaTelemetryService.prototype.addProperty = function (eventProperties, property) {
	        eventProperties.setProperty(property.key, property.value + '', property.type);
	    };
	    ;
	    return AriaTelemetryService;
	}());
	exports.AriaTelemetryService = AriaTelemetryService;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var actionNames_1 = __webpack_require__(32);
	var chatAttributes_1 = __webpack_require__(33);
	var chatConfigFactory_1 = __webpack_require__(34);
	var chatDefinition_1 = __webpack_require__(18);
	var messagingBackend_1 = __webpack_require__(35);
	var packageName_1 = __webpack_require__(36);
	var sdkMode_1 = __webpack_require__(28);
	var preloadType_1 = __webpack_require__(19);
	var config_1 = __webpack_require__(25);
	var frameUtils_1 = __webpack_require__(37);
	var urlHelper_1 = __webpack_require__(39);
	var conversationType_1 = __webpack_require__(11);
	var DEFAULT_LANGUAGE = 'en-us';
	var ChatBootstrapper = (function () {
	    function ChatBootstrapper() {
	        var _this = this;
	        this._chatConfigFactory = new chatConfigFactory_1.ChatConfigFactory();
	        this._startDate = Date.now();
	        this._isHidden = true;
	        this._isCollapsed = false;
	        this._onFocus = function () { return _this._postMessage({
	            origin: config_1.default.ORIGIN,
	            action: actionNames_1.default.StartActivation,
	            lifeTime: Date.now() - _this._startDate,
	        }); };
	        this._onBlur = function () { return _this._postMessage({
	            origin: config_1.default.ORIGIN,
	            action: actionNames_1.default.StopActivation,
	            lifeTime: Date.now() - _this._startDate,
	        }); };
	        this.resolveMessage = function (payload) {
	            // ui actions
	            if (!_this._hostElement) {
	                return;
	            }
	            switch (payload.action) {
	                case actionNames_1.default.HideChatWindow:
	                    _this._hideChat();
	                    break;
	                case actionNames_1.default.ShowChatWindow:
	                    _this._showChatWindow();
	                    break;
	                case actionNames_1.default.CollapseChatWindow:
	                    _this._collapseChat();
	                    break;
	                case actionNames_1.default.ExpandChatWindow:
	                    _this._expandChat();
	                    break;
	            }
	        };
	        this.onMessageHandler = function (event) {
	            if (event.data.origin !== config_1.default.ORIGIN || !/^bs:/.test(event.data.action)) {
	                return;
	            }
	            _this.resolveMessage(event.data);
	            event.stopImmediatePropagation();
	        };
	        this.startChat = function (definition) {
	            if (definition && !definition.MergeWith) {
	                var definitionObj = new chatDefinition_1.ChatDefinition();
	                definitionObj.MergeWith(definition);
	                definition = definitionObj;
	            }
	            if (definition) {
	                _this._chatAttributes = definition;
	            }
	            var switchConversations = _this._currentConversationId && definition.ConversationId !== _this._currentConversationId;
	            if (_this.chatControlExists() && !switchConversations) {
	                _this._isHidden ? _this._showChatWindow() : _this._hideChat();
	                return;
	            }
	            if (_this._isCollapsed) {
	                _this._expandChat();
	                _this._postMessage({
	                    origin: config_1.default.ORIGIN,
	                    action: actionNames_1.default.ExpandChatWindow,
	                    lifeTime: Date.now() - _this._startDate,
	                    isModule: _this._isModule
	                });
	            }
	            _this._openConversation(definition.ConversationId, _this.getSdkModeFromType(definition.ConversationType), null, switchConversations);
	        };
	        this.showChat = function () {
	            _this._postMessage({
	                origin: config_1.default.ORIGIN,
	                action: actionNames_1.default.LoadChatData,
	                lifeTime: Date.now() - _this._startDate,
	                isModule: _this._isModule
	            });
	            _this._showChatWindow();
	        };
	        this._fillPostMessageData = function (id, initTime) {
	            var skypeConversationPlaceholder = document.querySelector('.skype-chat');
	            var data = {
	                id: id,
	                initTime: initTime,
	                messagingBackend: null,
	                lang: null,
	                ecs: null,
	                chatConfig: _this._chatAttributes
	            };
	            if (skypeConversationPlaceholder) {
	                data.token = skypeConversationPlaceholder.getAttribute(chatAttributes_1.default.TOKEN);
	            }
	            if (config_1.default.ECS.partner && !data.chatConfig.Partner) {
	                data.chatConfig.Partner = config_1.default.ECS.partner;
	            }
	            if (config_1.default.ECS.partner && config_1.default.ECS.partner === "bing") {
	                data.chatConfig.CanCollapse = true;
	            }
	            // init data
	            data.lang = document.documentElement.lang || DEFAULT_LANGUAGE;
	            data.ecs = config_1.default.ECS;
	            return data;
	        };
	        this._openConversation = function (id, mode, initTime, switchConversations) {
	            _this._currentConversationId = id;
	            initTime = initTime || Date.now();
	            SkypeWebControl.SDK.Backend = mode === sdkMode_1.SDKMode.DIRECT_LINE_TOKEN ? messagingBackend_1.MessagingBackend.DIRECT_LINE : messagingBackend_1.MessagingBackend.SKYPE;
	            var data = _this._fillPostMessageData(id, initTime);
	            if (switchConversations) {
	                data.switchConversation = true;
	                _this._postLoadConverstionEvent(mode, data);
	            }
	            else {
	                _this._initAndPostConversationEvent(mode, data);
	            }
	        };
	        this._hideChat = function () {
	            if (!_this._hostElement) {
	                return;
	            }
	            if (_this._chatAttributes.EntryAnim) {
	                _this._hostElement.classList.remove('open-chat');
	                _this._hostElement.classList.add('close-chat');
	            }
	            else {
	                _this._hostElement.style.display = 'none';
	            }
	            _this._showSkypeButton();
	            _this._isHidden = true;
	        };
	        this._collapseChat = function () {
	            if (!_this._hostElement) {
	                return;
	            }
	            _this._hostElement.classList.add('collapsed');
	            _this._isCollapsed = true;
	        };
	        this._expandChat = function () {
	            if (!_this._hostElement) {
	                return;
	            }
	            _this._hostElement.classList.remove('collapsed');
	            _this._isCollapsed = false;
	        };
	        this._showChatWindow = function () {
	            if (!_this._hostElement) {
	                return;
	            }
	            if (_this._chatAttributes._isHidden) {
	                return;
	            }
	            if (_this._chatAttributes.EntryAnim === undefined || !!_this._chatAttributes.EntryAnim) {
	                _this._hostElement.classList.remove('close-chat');
	                _this._hostElement.classList.add('open-chat');
	                _this._hostElement.style.display = '';
	            }
	            else {
	                _this._hostElement.style.display = 'flex'; // null
	            }
	            // notify the chat about visibility || frameless
	            _this._postMessage({
	                origin: config_1.default.ORIGIN,
	                action: actionNames_1.default.OpenChatWindow,
	                lifeTime: Date.now() - _this._startDate,
	                isModule: _this._isModule
	            });
	            _this._isHidden = false;
	        };
	        this._initAndPostConversationEvent = function (mode, data) {
	            var chatFrame = document.querySelector('.lwc-chat-frame');
	            if (chatFrame) {
	                return;
	            }
	            var skypeConversationPlaceholder = document.querySelector(config_1.default.CHAT_MARKER_CLASS);
	            if (!skypeConversationPlaceholder) {
	                skypeConversationPlaceholder = document.createElement('div');
	                skypeConversationPlaceholder.setAttribute('class', 'skype-chat');
	                document.body.appendChild(skypeConversationPlaceholder);
	            }
	            _this.createChatControl(mode, data);
	        };
	        this._postLoadConverstionEvent = function (mode, data) {
	            data.chatConfig = _this._chatAttributes;
	            _this._postMessage({
	                origin: config_1.default.ORIGIN,
	                action: actionNames_1.default.ShowChatWindow,
	                lifeTime: Date.now() - _this._startDate,
	                sdkmode: mode,
	                id: data.id,
	                data: data,
	                host: SkypeWebControl.SDK.host,
	                isModule: _this._isModule
	            });
	        };
	    }
	    ChatBootstrapper.prototype.init = function (isModule) {
	        this._isModule = isModule;
	        var hasChatButtons = this.buttonControlsExists();
	        this.setupChatAttrs();
	        var hostName = window.location.hostname.replace('www.', '');
	        this._frameless = this._isModule || (!!hostName && config_1.default.ECS.frameless.indexOf(hostName) > -1);
	        !this._frameless && window.addEventListener('message', this.onMessageHandler);
	        if (!hasChatButtons && !isModule) {
	            this._chatAttributes.CanClose = false;
	            this.initChat();
	        }
	        window.addEventListener('focus', this._onFocus);
	        window.addEventListener('blur', this._onBlur);
	    };
	    ChatBootstrapper.prototype.setupChatAttrs = function () {
	        var skypeConversationPlaceholder = document.querySelector(config_1.default.CHAT_MARKER_CLASS);
	        if (!skypeConversationPlaceholder) {
	            return;
	        }
	        var domDefinition = this._chatConfigFactory.getDefinitionFromDOM(skypeConversationPlaceholder);
	        var urlDefinition = this._chatConfigFactory.getDefinitionFromUrl();
	        urlDefinition.MergeWith(domDefinition);
	        this._chatConfigFactory.setDOMFrom(urlDefinition, skypeConversationPlaceholder);
	        this._chatAttributes = urlDefinition;
	    };
	    ChatBootstrapper.prototype.initChat = function () {
	        var skypeConversationPlaceholder = document.querySelector(config_1.default.CHAT_MARKER_CLASS);
	        if (skypeConversationPlaceholder && this._chatAttributes.Preload !== preloadType_1.PreloadType.NONE) {
	            this._openConversation(this._chatAttributes.ConversationId, this.getSdkModeFromType(this._chatAttributes.ConversationType));
	        }
	    };
	    ChatBootstrapper.prototype.chatControlExists = function () {
	        return !!document.querySelector(config_1.default.CHAT_FRAME_MARKER_CLASS);
	    };
	    ChatBootstrapper.prototype.buttonControlsExists = function () {
	        return !!document.querySelector(config_1.default.BUTTON_MARKER_CLASS);
	    };
	    ChatBootstrapper.prototype.getChatAttrs = function () {
	        var skypeConversationPlaceholder = document.querySelector(config_1.default.CHAT_MARKER_CLASS);
	        if (!skypeConversationPlaceholder) {
	            return new chatDefinition_1.ChatDefinition();
	        }
	        return this._chatConfigFactory.getDefinitionFromDOM(skypeConversationPlaceholder);
	        // return this._chatAttributes;
	    };
	    ChatBootstrapper.prototype.dispose = function () {
	        window.removeEventListener('focus', this._onFocus);
	        window.removeEventListener('blur', this._onBlur);
	        window.removeEventListener('message', this.onMessageHandler);
	        var ns = window.SkypeWebControl;
	        ns.ChatContent && ns.ChatContent.dispose();
	        if (this._hostElement) {
	            var container = this._hostElement.parentElement;
	            container && container.removeChild(this._hostElement);
	        }
	    };
	    ChatBootstrapper.prototype.getSdkModeFromType = function (type) {
	        switch (type) {
	            case conversationType_1.default.PERSON:
	                return sdkMode_1.SDKMode.PERSON;
	            case conversationType_1.default.AGENT:
	                return sdkMode_1.SDKMode.BOT;
	            case conversationType_1.default.JOIN:
	                return sdkMode_1.SDKMode.JOIN_URL;
	            case conversationType_1.default.DIRECT_LINE:
	                return sdkMode_1.SDKMode.DIRECT_LINE_TOKEN;
	        }
	        return sdkMode_1.SDKMode.UNDEFINED;
	    };
	    ChatBootstrapper.prototype.createChatControl = function (mode, data) {
	        var _this = this;
	        if (this.chatControlExists()) {
	            return;
	        }
	        var chatConfigFactory = new chatConfigFactory_1.ChatConfigFactory();
	        var skypeChatPlaceholder = document.querySelector(config_1.default.CHAT_MARKER_CLASS);
	        var domDefinition = chatConfigFactory.getDefinitionFromDOM(skypeChatPlaceholder);
	        var urlDefinition = chatConfigFactory.getDefinitionFromUrl();
	        domDefinition.MergeWith(urlDefinition);
	        domDefinition.MergeWith(this._chatAttributes);
	        chatConfigFactory.setDOMFrom(domDefinition, skypeChatPlaceholder);
	        this._chatAttributes = domDefinition;
	        if (this._frameless) {
	            this._hostElement = frameUtils_1.default.injectFrameless(skypeChatPlaceholder);
	            if (this._isModule) {
	                var api = window.SkypeWebControl.API;
	                api && api.triggerEvent('createControl', this._hostElement);
	                this._postLoadConverstionEvent(mode, data);
	            }
	            else {
	                var bundleScript = document.createElement('script');
	                bundleScript.type = 'text/javascript';
	                bundleScript.src = urlHelper_1.default.getAbsoluteUrl('chat-bundle', 'js');
	                this._hostElement.appendChild(bundleScript);
	                bundleScript.onload = (function () { _this._postLoadConverstionEvent(mode, data); });
	            }
	        }
	        else {
	            var url = urlHelper_1.default.getAbsoluteUrl(packageName_1.PackageName.INDEX_CHAT, 'html');
	            var iframe = void 0;
	            iframe = frameUtils_1.default.inject(url, skypeChatPlaceholder);
	            iframe.onload = function () {
	                _this._postLoadConverstionEvent(mode, data);
	            };
	            this._hostElement = iframe;
	            this._hostElement.style.display = 'none';
	        }
	        this._hostElement.classList.add('lwc-chat-frame');
	        if (this._chatAttributes.Preload === preloadType_1.PreloadType.FULL) {
	            this.startChat();
	        }
	    };
	    ChatBootstrapper.prototype._showSkypeButton = function () {
	        var skypeButtonPlaceholders = document.querySelectorAll('.skype-button');
	        for (var i = 0; i < skypeButtonPlaceholders.length; i++) {
	            var skypeButtonPlaceholder = skypeButtonPlaceholders[i];
	            if (!skypeButtonPlaceholder.classList.contains('bubble')) {
	                return;
	            }
	            skypeButtonPlaceholder.firstElementChild.classList.remove('open-bubble');
	            skypeButtonPlaceholder.firstElementChild.classList.add('close-bubble');
	        }
	    };
	    ChatBootstrapper.prototype._postMessage = function (message) {
	        if (!this._hostElement) {
	            return;
	        }
	        if (this._frameless) {
	            window.SkypeWebControl.ChatContent.runChat(message);
	        }
	        else {
	            this._hostElement.contentWindow.postMessage(message, config_1.default.ECS.domain);
	        }
	    };
	    return ChatBootstrapper;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ChatBootstrapper;


/***/ }),
/* 32 */
/***/ (function(module, exports) {

	"use strict";
	var ActionNames = (function () {
	    function ActionNames() {
	    }
	    // UI handling actions
	    ActionNames.HideChatWindow = 'bs:hChat';
	    ActionNames.OpenChatWindow = 'bs:oChat';
	    ActionNames.ShowChatWindow = 'bs:sChat';
	    ActionNames.CollapseChatWindow = 'bs:chat:collapse';
	    ActionNames.ExpandChatWindow = 'bs:chat:expand';
	    ActionNames.LoadChatData = 'bs:sChat:run';
	    ActionNames.StartActivation = 'bs:sChat:startActivation';
	    ActionNames.StopActivation = 'bs:sChat:stopActivation';
	    ActionNames.MessageSent = 'lwc:mSent';
	    return ActionNames;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ActionNames;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var attributes_1 = __webpack_require__(9);
	var default_1 = (function (_super) {
	    __extends(default_1, _super);
	    function default_1() {
	        _super.apply(this, arguments);
	    }
	    default_1.CanCollapse = "data-can-collapse";
	    default_1.CanClose = 'data-can-close';
	    default_1.CanUploadFile = 'data-can-upload-file';
	    default_1.ShowHeader = 'data-show-header';
	    default_1.ColorMain = 'data-color';
	    default_1.CssUrl = 'data-css-url';
	    default_1.Partner = 'data-partner';
	    default_1.ColorMessage = 'data-color-message';
	    default_1.Preload = 'data-preload';
	    default_1.EntryAnim = 'data-entry-animation';
	    default_1.Frameless = 'data-frameless';
	    default_1.GuestOnly = 'data-guest-only';
	    default_1.EnableTranslator = 'data-enable-translator';
	    return default_1;
	}(attributes_1.Attributes));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = default_1;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var configFactory_1 = __webpack_require__(8);
	var chatDefinition_1 = __webpack_require__(18);
	var chatAttributes_1 = __webpack_require__(33);
	var stringUtils_1 = __webpack_require__(13);
	var ChatConfigFactory = (function (_super) {
	    __extends(ChatConfigFactory, _super);
	    function ChatConfigFactory() {
	        _super.apply(this, arguments);
	    }
	    /**
	     * Returns chat control definition built from the default values
	     * and updated with values sent through the url of the hosting page.
	     * Primarily  used to pass the config context to a hosting iframe.
	     *
	     * @returns {ChatDefinition}
	     *
	     * @memberOf ButtonConfigFactory
	     */
	    ChatConfigFactory.prototype.getDefinitionFromUrl = function () {
	        var params = this.getQueryStringParameters();
	        var definition = new chatDefinition_1.ChatDefinition();
	        if (!params) {
	            return definition;
	        }
	        this.parseBaseUrlParams(definition, params);
	        this.parseUrlParams(definition, chatAttributes_1.default, params);
	        return definition;
	    };
	    /**
	     * Sets the attributes of the button element to represent the
	     * state of given button definition.
	     *
	     * @param {ButtonDefinition} definition
	     * @param {Element} [element]
	     *
	     * @memberOf ButtonConfigFactory
	     */
	    ChatConfigFactory.prototype.setDOMFrom = function (definition, element) {
	        this.setBaseDOM(definition, element);
	        this.setDom(definition, chatAttributes_1.default, element, new chatDefinition_1.ChatDefinition());
	    };
	    /**
	    * Process the given element data- attributes searching for
	    * the values customizing the behavior of the Skype Chat.
	     *
	     * @param {HTMLElement} element
	     * @returns {ChatDefinition}
	     *
	     * @memberOf ChatConfigFactory
	     */
	    ChatConfigFactory.prototype.getDefinitionFromDOM = function (element) {
	        var definition = new chatDefinition_1.ChatDefinition();
	        this.parseBaseDom(definition, element);
	        this.parseDom(definition, chatAttributes_1.default, element);
	        return definition;
	    };
	    ChatConfigFactory.prototype.getStringValue = function (element, attribute, defaultValue) {
	        var value = element.getAttribute(attribute);
	        return (value === null) ? defaultValue : value;
	    };
	    ChatConfigFactory.prototype.getValue = function (element, attribute, defaultValue) {
	        var value = element.getAttribute(attribute);
	        if (value === null) {
	            return defaultValue;
	        }
	        else {
	            return stringUtils_1.default.toBoolean(value);
	        }
	    };
	    return ChatConfigFactory;
	}(configFactory_1.ConfigFactory));
	exports.ChatConfigFactory = ChatConfigFactory;


/***/ }),
/* 35 */
/***/ (function(module, exports) {

	"use strict";
	(function (MessagingBackend) {
	    /**
	     * Using of this enum points to application error.
	     */
	    MessagingBackend[MessagingBackend["UNDEFINED"] = 0] = "UNDEFINED";
	    /**
	     * The backend service is not determined at this time yet.
	     */
	    MessagingBackend[MessagingBackend["UNDETERMINED"] = 10] = "UNDETERMINED";
	    /**
	     * Skype backend service is used (Chat Service).
	     */
	    MessagingBackend[MessagingBackend["SKYPE"] = 100] = "SKYPE";
	    /**
	     * BotFramework DirectLine endpoints are used.
	     */
	    MessagingBackend[MessagingBackend["DIRECT_LINE"] = 200] = "DIRECT_LINE";
	})(exports.MessagingBackend || (exports.MessagingBackend = {}));
	var MessagingBackend = exports.MessagingBackend;


/***/ }),
/* 36 */
/***/ (function(module, exports) {

	"use strict";
	var PackageName = (function () {
	    function PackageName() {
	    }
	    PackageName.VENDORS_ARIA = 'https://latest-swc.cdn.skype.com/vendors/aria-web-telemetry-2.7.2.min.js';
	    PackageName.VENDORS_ES6_PROMISE = 'https://latest-swc.cdn.skype.com/vendors/es6-promise.min.js';
	    PackageName.DOM_PURIFY = 'https://latest-swc.cdn.skype.com/vendors/purify.min.js';
	    PackageName.BUTTON_CORE = 'lwc-button-core';
	    PackageName.CHAT_CORE = 'lwc-chat-core';
	    PackageName.SKYPE_LOGIN = 'lwc-login-skype';
	    PackageName.SKYPE_CHAT = 'lwc-chat-skype';
	    // public static DIRECTLINE_CHAT = 'lwc-chat-dl';
	    PackageName.DIRECTLINE_CHAT = 'directline-bundle';
	    PackageName.SDK_LOADER_CHAT = 'sdk-loader';
	    PackageName.SDK_CORE = 'sdk-core';
	    PackageName.ASSETS = 'assets-bundle';
	    PackageName.BUILDER = 'builder-bundle';
	    PackageName.BUILDER_CORE = 'builder-core';
	    // public static SDK_EXTERNAL_CHAT = 'lwc-sdk-ext';
	    // public static SDK_INTERNAL_CHAT = 'lwc-sdk-int';
	    PackageName.INDEX_BUILDER = 'index-builder';
	    PackageName.INDEX_CHAT = 'lwc-chat-index';
	    PackageName.CONNECT = 'connect';
	    PackageName.HOST_CHAT_PAGE = 'host-chat';
	    PackageName.HOST_BING_PAGE = 'host-button';
	    PackageName.HOST_BUILDER_PAGE = 'host-builder';
	    PackageName.STYLE_BUILDER = 'lwc-builder';
	    PackageName.STYLE_SDK = 'lwc-sdk';
	    PackageName.STYLE_CHAT_SKYPE = 'lwc-chat-skype';
	    PackageName.STYLE_CHAT_BING = 'lwc-chat-bing';
	    PackageName.STYLE_CHAT_THEME_DARK = 'lwc-chat-theme-dark';
	    return PackageName;
	}());
	exports.PackageName = PackageName;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var browser_1 = __webpack_require__(38);
	/**
	 * Set of utility function working with iframe
	 *
	 * @export
	 * @class frameUtils
	 */
	var FrameUtils = (function () {
	    function FrameUtils() {
	    }
	    /**
	     * Injects a iframe into the document with the given source
	     *
	     * @static
	     * @param {string} frameId  Unique identifier of the iframe
	     * @param {string} source   Url of the html page which iframe will load
	     * @param {string} width    Width of the iframe (optional)
	     * @param {string} height   Height of the iframe (optional)
	     * @returns {HTMLIFrameElement}
	     *
	     * @memberOf frameUtils
	     */
	    FrameUtils.inject = function (source, parent) {
	        var document = browser_1.default.getDocument();
	        var iframe = document.createElement('iframe');
	        iframe.src = encodeURI(source);
	        iframe.setAttribute('frameborder', '0');
	        iframe.setAttribute('seamless', 'seamless');
	        iframe.setAttribute('border-radius', '6px');
	        iframe.setAttribute('allowFullScreen', 'true');
	        if (parent) {
	            parent.appendChild(iframe);
	        }
	        else {
	            document.body.appendChild(iframe);
	        }
	        return iframe;
	    };
	    FrameUtils.injectFrameless = function (skypeChatPlaceholder) {
	        var conversation = document.createElement('div');
	        var dlConversation = document.createElement('div');
	        var chatContainer = document.createElement('div');
	        chatContainer.id = 'main';
	        chatContainer.classList.add('swc', 'frameless');
	        chatContainer.style.display = 'none';
	        conversation.className = 'conversation skype-conversation';
	        conversation.setAttribute('data-bind', 'component: {name: "conversation", params: {conversation: conversation, enable: enable, topic: topic}}');
	        conversation.style.display = 'none';
	        chatContainer.appendChild(conversation);
	        dlConversation.className = 'conversation directline-conversation';
	        dlConversation.setAttribute('data-bind', 'component: {name: "dl-conversation", params: {conversation: conversation, enable: enable, topic: topic}}');
	        dlConversation.style.display = 'none';
	        chatContainer.appendChild(dlConversation);
	        skypeChatPlaceholder.appendChild(chatContainer);
	        return chatContainer;
	    };
	    return FrameUtils;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = FrameUtils;


/***/ }),
/* 38 */
/***/ (function(module, exports) {

	"use strict";
	var Browser = (function () {
	    function Browser() {
	    }
	    Browser.getWindow = function () {
	        return window;
	    };
	    Browser.getDocument = function () {
	        return window.document;
	    };
	    return Browser;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Browser;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var errorHandler_1 = __webpack_require__(12);
	var packageName_1 = __webpack_require__(36);
	var UrlHelper = (function () {
	    function UrlHelper() {
	    }
	    /**
	     * Combines the two fragments making sure that '/' is added when needed in between.
	     *
	     * @static
	     * @param {string} path
	     * @param {string} query
	     * @returns
	     *
	     * @memberOf UrlHelper
	     */
	    UrlHelper.combine = function (path, query) {
	        if (path.lastIndexOf('/') !== path.length - 1) {
	            if (query.substring(0, 1) !== '/') {
	                return path + '/' + query;
	            }
	        }
	        return SkypeWebControl.EcsConfig.appUri + path + query;
	    };
	    /**
	     * Gets the absolute path by combining the given relative path and the ecs define
	     * appropriate root folder.
	     *
	     * @static
	     * @param {string} relativePath
	     * @param {string} ext
	     * @returns
	     *
	     * @memberOf UrlHelper
	     */
	    UrlHelper.getAbsoluteUrl = function (relativePath, ext) {
	        var completePath = this.getCompletePath(relativePath, ext);
	        switch (relativePath) {
	            case packageName_1.PackageName.ASSETS:
	            case packageName_1.PackageName.SDK_CORE:
	            case packageName_1.PackageName.BUILDER_CORE:
	            case packageName_1.PackageName.DIRECTLINE_CHAT:
	            case packageName_1.PackageName.INDEX_CHAT:
	            case packageName_1.PackageName.BUILDER:
	            case 'chat-bundle':
	                return this.combine('', completePath);
	            case packageName_1.PackageName.SDK_LOADER_CHAT:
	                return this.combine(SkypeWebControl.EcsConfig.loaderUrl, completePath);
	            case packageName_1.PackageName.STYLE_BUILDER:
	            case packageName_1.PackageName.STYLE_SDK:
	            case packageName_1.PackageName.STYLE_CHAT_SKYPE:
	            case packageName_1.PackageName.STYLE_CHAT_BING:
	            case packageName_1.PackageName.STYLE_CHAT_THEME_DARK:
	                return this.combine(SkypeWebControl.EcsConfig.cssHostUrl, completePath);
	            case packageName_1.PackageName.CONNECT:
	                return SkypeWebControl.EcsConfig.connectPageUrl;
	            default:
	                errorHandler_1.default.throwError(10051, 'Not supported, yet!' + relativePath);
	                return '';
	        }
	    };
	    UrlHelper.getCompletePath = function (relativePath, ext) {
	        var suffix = '';
	        var prefix = '';
	        switch (SkypeWebControl.EcsConfig.environment) {
	            case 'dev':
	                break;
	            case '':
	            case 'int':
	            case 'qa':
	                break;
	            case 'df':
	            case 'prod':
	                suffix = '.min';
	                break;
	        }
	        return prefix + relativePath + suffix + '.' + ext;
	    };
	    return UrlHelper;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = UrlHelper;


/***/ }),
/* 40 */
/***/ (function(module, exports) {

	"use strict";
	var DeferredApi = (function () {
	    function DeferredApi(ns, name, method) {
	        this.ns = ns;
	        this.name = name;
	        this.method = method;
	        this.defer = this.defer.bind(this);
	    }
	    DeferredApi.prototype.defer = function () {
	        Deferrer.calls[this.ns][this.name].push({ method: this.method, args: arguments });
	    };
	    return DeferredApi;
	}());
	var Deferrer = (function () {
	    function Deferrer() {
	    }
	    Deferrer.execute = function (ns, name, ref, context) {
	        if (ns && ns[name] && ns[name].deferred) {
	            var calls = Deferrer.calls[ns][name];
	            ns[name] = ref;
	            var keys_1 = Object.keys(ref);
	            calls.forEach(function (call) {
	                keys_1.indexOf(call.method) > -1 && ns[name][call.method].apply(context, call.args);
	            });
	            delete Deferrer.calls[ns][name];
	        }
	    };
	    Deferrer.deferApi = function (ns, name, methods) {
	        if (!ns || ns[name]) {
	            return;
	        }
	        ns[name] = { deferred: true };
	        methods.forEach(function (method) {
	            ns[name][method] = (new DeferredApi(ns, name, method)).defer;
	        });
	        Deferrer.calls[ns] = Deferrer.calls[ns] || {};
	        Deferrer.calls[ns][name] = [];
	    };
	    Deferrer.calls = {};
	    return Deferrer;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = (function () {
	    window.SkypeWebControl = window.SkypeWebControl || {};
	    return window.SkypeWebControl.deferrer = window.SkypeWebControl.deferrer || Deferrer;
	})();


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var browser_1 = __webpack_require__(38);
	var urlHelper_1 = __webpack_require__(39);
	var StyleLoader = (function () {
	    function StyleLoader() {
	    }
	    /**
	     * Adds a css stylesheet link to the head if it is not already there.
	     *
	     * @static
	     * @param {string} uri
	     * @param {boolean} [isRelative]
	     * @returns {void}
	     *
	     * @memberOf HTMLManager
	     */
	    StyleLoader.addStyle = function (uri, isRelative, onLoaded) {
	        var absoluteUrl = uri;
	        if (isRelative) {
	            absoluteUrl = urlHelper_1.default.getAbsoluteUrl(absoluteUrl, 'css');
	        }
	        if (this.hasStyle(absoluteUrl)) {
	            if (onLoaded) {
	                onLoaded();
	            }
	            return;
	        }
	        var document = browser_1.default.getDocument();
	        var style = document.createElement('link');
	        style.type = 'text/css';
	        style.rel = 'stylesheet';
	        style.href = absoluteUrl;
	        if (onLoaded) {
	            style.onload = onLoaded;
	        }
	        document.getElementsByTagName('head')[0].appendChild(style);
	    };
	    StyleLoader.hasStyle = function (absolutePath) {
	        for (var i = 0; i < document.styleSheets.length; i++) {
	            if (document.styleSheets[i].href === absolutePath) {
	                return true;
	            }
	        }
	        return false;
	    };
	    return StyleLoader;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = StyleLoader;


/***/ })
/******/ ]);
//# sourceMappingURL=sdk-core.js.map