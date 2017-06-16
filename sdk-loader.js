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
	/// <reference path="../../../customTypings/skype.d.ts" />
	var scriptLoader_1 = __webpack_require__(2);
	var packageName_1 = __webpack_require__(6);
	var SdkLoader = (function () {
	    /**
	     * Creates an instance of SdkLoader.
	     *
	     *
	     * @memberOf SdkLoader
	     */
	    function SdkLoader() {
	        if (this.exists('.skype-builder')) {
	            console.log('LOADIND BUILDER ...');
	            scriptLoader_1.default.addScript(packageName_1.PackageName.BUILDER_CORE, true);
	        }
	        if (this.exists('.skype-button') || this.exists('.skype-chat')) {
	            console.log('LOADING SDK CORE ...');
	            //styleLoader.addStyle(PackageName.STYLE_SDK, true);
	            scriptLoader_1.default.addScript(packageName_1.PackageName.SDK_CORE, true);
	        }
	    }
	    SdkLoader.prototype.exists = function (selector) {
	        return !!document.querySelector(selector);
	    };
	    return SdkLoader;
	}());
	exports.SdkLoader = SdkLoader;
	// trigger loader on load
	new SdkLoader();


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var browser_1 = __webpack_require__(3);
	var urlHelper_1 = __webpack_require__(4);
	var ScriptLoader = (function () {
	    function ScriptLoader() {
	    }
	    /**
	    * Adds a script reference to the page body if it is not already there.
	    *
	    * @static
	    * @param {string} uri
	    * @param {boolean} [isRelative]
	    * @returns {void}
	    *
	    * @memberOf HTMLManager
	    */
	    ScriptLoader.addScript = function (uri, isRelative, onLoaded, onFailed) {
	        var absoluteUrl = uri;
	        if (isRelative) {
	            absoluteUrl = urlHelper_1.default.getAbsoluteUrl(absoluteUrl, 'js');
	        }
	        // if (this.hasScript(absoluteUrl)) {
	        //     if (onLoaded) {
	        //         onLoaded();
	        //     }
	        //     return;
	        // }
	        var document = browser_1.default.getDocument();
	        var script = document.createElement('script');
	        script.type = 'text/javascript';
	        script.src = absoluteUrl;
	        if (onLoaded) {
	            script.onload = onLoaded;
	        }
	        if (onFailed) {
	            script.onerror = onFailed;
	        }
	        document.getElementsByTagName('body')[0].appendChild(script);
	    };
	    ScriptLoader.hasScript = function (absolutePath) {
	        for (var i = 0; i < document.scripts.length; i++) {
	            var script = document.scripts[i];
	            if (script.src === absolutePath) {
	                return true;
	            }
	        }
	        return false;
	    };
	    return ScriptLoader;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ScriptLoader;


/***/ }),
/* 3 */
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var errorHandler_1 = __webpack_require__(5);
	var packageName_1 = __webpack_require__(6);
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
/* 5 */
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
/* 6 */
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


/***/ })
/******/ ]);
//# sourceMappingURL=sdk-loader.js.map