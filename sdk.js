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
/***/ (function(module, exports) {

	var SDK = (function () {
	    function SDK() {
	        // this should be replaced by vsts build 
	        var RUNNER_NAME = 'sdk-run';
	        var RUNNER_PATH = '/sdk/0.12.2/' + RUNNER_NAME + '.js';
	        var DOMAIN = 'latest-swc.cdn.skype.com';
	        var SWC_PREF = 'swc-';
	        var doc = window.document;
	        var SDKScript;
	        var qVars;
	        // DO NOT TOUCH ';' it is used by build.
	        fillAttrsFromUrl();
	        isAutoInit() && addRunner();
	        this.start = addRunner;
	        function addRunner(callback) {
	            var variables = getVariablesForLatest(); // getVariablesForLatest(); will be replaced by the build for .min version
	            var script = doc.createElement('script');
	            script.type = 'text/javascript';
	            script.src = 'https://' + DOMAIN + RUNNER_PATH;
	            script.onload = function (e) {
	                setTimeout(function () { return window.SkypeWebControl.SDKRunner.start(variables); }, 5);
	            };
	            document.body.appendChild(script);
	            window.SkypeWebControl.initCallback = callback;
	        }
	        function getSDKScript() {
	            var sdkRegex = /\/(v\d+)|(\d+\.\d+\.\d+)\/sdk(.min)?.js/g;
	            if (SDKScript) {
	                return SDKScript;
	            }
	            for (var i = 0; i < doc.scripts.length; i++) {
	                var script = document.scripts[i];
	                if (sdkRegex.test(script.src)) {
	                    return SDKScript = script;
	                }
	            }
	            return null;
	        }
	        function isManualBootstrap() {
	            var script = getSDKScript();
	            var manualBootstrapAttrValue = script ? getSDKScript().getAttribute('data-init') || 'false' : 'false';
	            return manualBootstrapAttrValue.toLowerCase() === 'true';
	        }
	        function isAutoInit() {
	            var script = getSDKScript();
	            var isAutoInitValue = 'true';
	            if (script && script.getAttribute('data-init')) {
	                isAutoInitValue = script.getAttribute('data-init');
	            }
	            return isAutoInitValue.toLowerCase() === 'true';
	        }
	        function getVariablesForProd() {
	            return {
	                ver: '',
	                env: 'prod',
	                host: getHost()
	            };
	        }
	        function getVariablesForLatest() {
	            var environment = 'df';
	            var version = '';
	            var script = getSDKScript();
	            if (script) {
	                environment = script.getAttribute('data-environment') || environment;
	                version = script.getAttribute('data-version');
	            }
	            return {
	                ver: version,
	                env: environment,
	                host: getHost()
	            };
	        }
	        function getHost() {
	            try {
	                return window.location.hostname;
	            }
	            catch (e) {
	                return null;
	            }
	        }
	        function fillAttrsFromUrl() {
	            fillAttrsFromUrlToElts(getSDKScript(), ['swc-version', 'swc-environment']); // reference only THE SCRIPT
	            fillAttrsFromUrlToElts(document.querySelector('.skype-chat'));
	        }
	        function fillAttrsFromUrlToElts(elt, attrs) {
	            if (!elt) {
	                return;
	            }
	            var aaa = getQueryParameters();
	            if (!attrs) {
	                attrs = Object.getOwnPropertyNames(getQueryParameters());
	            }
	            var value;
	            for (var prop in attrs) {
	                var attrName = attrs[prop];
	                var value = aaa[attrName];
	                if (!value) {
	                    continue;
	                }
	                elt.setAttribute(attrName.replace(SWC_PREF, 'data-'), value);
	            }
	        }
	        function getQueryParameters() {
	            if (this.qVars) {
	                return this.qVars;
	            }
	            var variables = window.location.search.substring(1).split('&').filter(function (value) { return value.indexOf(SWC_PREF) === 0; });
	            var ret = {};
	            variables.forEach(function (variable) {
	                var tuple = variable.split('=');
	                ret[decodeURIComponent(tuple[0])] = decodeURIComponent(tuple[1]) || '';
	            });
	            this.qVars = ret;
	            return this.qVars;
	        }
	    }
	    return SDK;
	}());
	window.SkypeWebControl = window.SkypeWebControl || {};
	window.SkypeWebControl.SDK = window.SkypeWebControl.SDK || new SDK();


/***/ })
/******/ ]);
//# sourceMappingURL=sdk.js.map
