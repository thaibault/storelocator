'use strict';
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jquery"), require("jQuery-tools"), require("js-marker-clusterer"), require("qunitjs"));
	else if(typeof define === 'function' && define.amd)
		define("jQuery-storeLocator", ["jquery", "jQuery-tools", "js-marker-clusterer", "qunitjs"], factory);
	else if(typeof exports === 'object')
		exports["jQuery-storeLocator"] = factory(require("jquery"), require("jQuery-tools"), require("js-marker-clusterer"), require("qunitjs"));
	else
		root["jQuery-storeLocator"] = factory(root["jquery"], root["jQuery-tools"], root["js-marker-clusterer"], root["qunitjs"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_8__) {
return /******/ (function(modules) { // webpackBootstrap
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
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(4);


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, module) {// #!/usr/bin/env node
	// -*- coding: utf-8 -*-
	/** @module jQuery-storeLocator */'use strict'; /* !
	    region header
	    [Project page](http://torben.website/jQuery-storeLocator)
	
	    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012
	
	    License
	    -------
	
	    This library written by Torben Sickert stand under a creative commons
	    naming 3.0 unported license.
	    See http://creativecommons.org/licenses/by/3.0/deed.de
	    endregion
	*/ // region imports
	exports.__esModule=true;var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol?"symbol":typeof obj;};var _jquery=__webpack_require__(2);var _jquery2=_interopRequireDefault(_jquery);__webpack_require__(6);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;} // IgnoreTypeCheck
	var GoogleMarkerClusterer=__webpack_require__(7); /* eslint-disable no-duplicate-imports */ /* eslint-enable no-duplicate-imports */ // endregion
	// region types
	// endregion
	var context=function(){if(_jquery2.default.type(window)==='undefined'){if(_jquery2.default.type(global)==='undefined')return _jquery2.default.type(module)==='undefined'?{}:module;return global;}return window;}();if(!context.hasOwnProperty('document')&&_jquery2.default.hasOwnProperty('context'))context.document=_jquery2.default.context; // region plugins/classes
	/**
	 * A jQuery storelocator plugin.
	 * Expected store data format:
	 * {latitude: NUMBER, longitude: NUMBER, markerIconFileName: STRING}
	 * @property static:maps - Holds the currently used maps class.
	 * @property static:_name - Defines this class name to allow retrieving them
	 * after name mangling.
	 * @property static:_apiLoad - Holds the currently promise to retrieve a new
	 * maps api.
	 * @property currentSearchResults - Saves last found search results.
	 * @property currentSearchText - Saves last searched string.
	 * @property resultsDomNode - Saves currently opened results dom node or null
	 * if no results exists yet.
	 * @property currentSearchResultsDomNode - Saves current search results content
	 * dom node.
	 * @property currentlyOpenWindow - Saves currently opened window instance.
	 * @property currentlyHighlightedMarker - Saves currently highlighted marker
	 * instance.
	 * @property searchResultsDirty - Indicates weather current search results
	 * aren't valid anymore.
	 * @property seenLocations - Saves all seen locations to recognize duplicates.
	 * @property markers - Saves all recognized markers.
	 * @property currentSearchResultRange - Public editable property to set current
	 * search result range. This is useful for pagination implementations in
	 * template level.
	 * @property _options - Saves all plugin interface options.
	 * @property _options.stores
	 * {string|Array.<string>|Object.<string, number|Function>} - URL to retrieve
	 * stores, list of stores or object describing bounds to create random stores
	 * within. If a "generateProperties" function is given it will be called to
	 * retrieve additional properties for each store. The specified store will be
	 * given to the function.
	 * @property _options.addtionalStoreProperties {Object.<string, mixed>} -
	 * Additional static store properties which will be available to each store.
	 * @property _options.iconPath {string} - Path prefix to search for marker
	 * icons.
	 * @property _options.defaultMarkerIconFileName {string} - Specifies a fallback
	 * marker
	 * icon (if no store specific icon was set). If set to "null" google will place
	 * a fallback icon.
	 * @property _options.startLocation {null|Object} - If not provided we
	 * initialize the map with center in current location determined by internet
	 * protocol address. If an object is given a "latitude" and "longitude" with a
	 * saved float are assumed.
	 * @property _options.fallbackLocation {Object} - Fallback location if
	 * automatic location determination has failed.
	 * @property _options.fallbackLocation.latitude {number} - Latitude value.
	 * @property _options.fallbackLocation.longitude {number} - Longitude value.
	 * @property _options.ip {null|string} - If provided given ip will be used to
	 * determine current location instead of automatically determined one.
	 * @property _options.ipToLocation {Object} - Configuration for ip to location
	 * conversion.
	 * @property _options.ipToLocation.applicationInterfaceURL {string} - IP to
	 * location determination application interface url. {1} and {2} represents
	 * currently used protocol and potentially given ip.
	 * @property _options.ipToLocation.timeoutInMilliseconds {number} - Time to
	 * wait for ip resolve. If time is up initialize on given fallback location.
	 * @property _options.ipToLocation.bounds
	 * {Object.<string, Object.<string, number>>} - Defines bound withing
	 * determined locations should be. If resolved location isn't within this
	 * location it will be ignored.
	 * @property _options.ipToLocation.bound.northEast {Object.<string, number>} -
	 * Defines north east bound.
	 * @property _options.ipToLocation.bound.northEast.latitude {number} - North
	 * east latitude bond.
	 * @property _options.ipToLocation.bound.northEast.longitude {number} - North
	 * east longitude bond.
	 * @property _options.ipToLocation.bound.southWest {Object.<string, number>} -
	 * Defined south west bound.
	 * @property _options.ipToLocation.bound.southWest.latitude {number} - South
	 * east latitude bound.
	 * @property _options.ipToLocation.bound.southWest.longitude {number} - South
	 * west longitude bound.
	 * @property _options.map {Object} - Initial view properties.
	 * @property _options.showInputAfterLoadedDelayInMilliseconds {number} - Delay
	 * before we show search input field.
	 * @property _options.inputFadeInOption {Object.<string, mixed>} - Transition
	 * options to show search input field.
	 * @property _options.distanceToMoveByDuplicatedEntries {number} - Distance to
	 * move if stores are determined with same latitude and longitude.
	 * @property _options.marker {Object|null} - Options passed to the marker
	 * cluster. If set to "null" no marker cluster will appear.
	 * @property _options.icon {Object} - Options passed to the icon.
	 * @property _options.successfulSearchZoom {number} - Specifies a zoom value
	 * wich will be adjusted after successfully picked a search result. If set to
	 * "null" no zoom change happens.
	 * @property _options.infoWindow {Object.<string, mixed>} - Info window
	 * options.
	 * @property _options.infoWindow.content {Function|string|null} - Function or
	 * string returning or representing the info box. If a function is given and a
	 * promise is returned the info box will be filled with the given loading
	 * content and updated with the resolved data. The function becomes the
	 * corresponding marker as first argument and the store locator instance as
	 * second argument. If nothing is provided all available data will be listed in
	 * a generic info window.
	 * @property _options.infoWindow.additionalMoveToBottomInPixel {number} -
	 * Additional move to bottom relative to the marker if an info window has been
	 * opened.
	 * @property _options.infoWindow.loadingContent {string} - Content to show in
	 * the info window during info window load.
	 * @property _options.searchBox {number|Object} - If a number is given a
	 * generic search will be provided and given number will be interpret as search
	 * result precision tolerance to identify a marker as search result. If an
	 * object is given it indicates what should be search for. The object can hold
	 * up to nine keys. "properties" to specify which store data should contain
	 * given search text, "maximumNumberOfResults" to limit the auto complete
	 * result, "loadingContent" to display while the results are loading,
	 * "numberOfAdditionalGenericPlaces" a tuple describing a range of minimal to
	 * maximal limits of additional generic google suggestions depending on number
	 * of local search results, "maximalDistanceInMeter" to specify maximal
	 * distance from current position to search suggestions, "genericPlaceFilter"
	 * specifies a function which gets a relevant place to decide if the place
	 * should be included (returns a boolean value), "prefereGenericResults"
	 * specifies a boolean value indicating if generic search results should be the
	 * first results, "genericPlaceSearchOptions" specifies how a generic place
	 * search should be done (google maps request object specification) and
	 * "content" to render the search results. "content" can be a function or
	 * string returning or representing the search results. If a function is given
	 * and a promise is returned the info box will be filled with the given loading
	 * content and updated with the resolved data. The function becomes search
	 * results as first argument, a boolean value as second argument indicating if
	 * the maximum number of search results was reached and the store locator
	 * instance as third argument. If nothing is provided all available data will
	 * be listed in a generic info window.
	 * @property _options.onInfoWindowOpen {Function} - Triggers if a marker info
	 * window will be opened.
	 * @property _options.onInfoWindowOpened {Function} - Triggers if a marker info
	 * window has finished opening.
	 * @property _options.onAddSearchResults {Function} - Triggers before new
	 * search results appears.
	 * @property _options.onRemoveSearchResults {Function} - Triggers before old
	 * search results will be removed.
	 * @property _options.onOpenSearchResults {Function} - Triggers before search
	 * result box appears.
	 * @property _options.onCloseSearchResults {Function} - Triggers before search
	 * result box will be hidden.
	 * @property _options.onMarkerHighlighted {Function} - Triggers after a marker
	 * starts to highlight.
	 */var StoreLocator=function(_$$Tools$class){_inherits(StoreLocator,_$$Tools$class);function StoreLocator(){_classCallCheck(this,StoreLocator);return _possibleConstructorReturn(this,_$$Tools$class.apply(this,arguments));} // endregion
	/**
	     * Entry point for object orientated jQuery plugin.
	     * @param options - Options to overwrite default ones.
	     * @returns Currently selected dom node.
	     */ // endregion
	// region dynamic properties
	StoreLocator.prototype.initialize=function initialize(){var _this2=this;var options=arguments.length<=0||arguments[0]===undefined?{}:arguments[0]; // region properties
	this.currentSearchResults=[];this.currentSearchText=null;this.resultsDomNode=null;this.currentSearchResultsDomNode=null;this.currentlyOpenWindow=null;this.currentlyHighlightedMarker=null;this.searchResultsDirty=false;this.seenLocations=[];this.markers=[];this.currentSearchResultRange=null;this._options={api:{url:'https://maps.googleapis.com/maps/api/js'+'?v=3&sensor=false&libraries=places,geometry&callback={1}',callbackName:null},stores:{northEast:{latitude:85,longitude:180},southWest:{latitude:-85,longitude:-180},number:100,generateProperties:function generateProperties(store){return store;}},addtionalStoreProperties:{},iconPath:'/webAsset/image/storeLocator/',defaultMarkerIconFileName:null,startLocation:null,fallbackLocation:{latitude:51.124213,longitude:10.147705},ip:null,ipToLocation:{applicationInterfaceURL:'{1}://freegeoip.net/json/{2}',timeoutInMilliseconds:5000,bounds:{northEast:{latitude:85,longitude:180},southWest:{latitude:-85,longitude:-180}}},map:{zoom:3},showInputAfterLoadedDelayInMilliseconds:500,inputFadeInOption:{duration:'fast'},distanceToMoveByDuplicatedEntries:0.0001,marker:{cluster:{gridSize:100,maxZoom:11,imagePath:'https://cdn.rawgit.com/googlemaps/'+'js-marker-clusterer/gh-pages/images/m'},icon:{size:{width:44,height:49,unit:'px'},scaledSize:{width:44,height:49,unit:'px'}}},successfulSearchZoom:12,infoWindow:{content:null,additionalMoveToBottomInPixel:120,loadingContent:'<div class="idle">loading...</div>'},searchBox:50,onInfoWindowOpen:_jquery2.default.noop,onInfoWindowOpened:_jquery2.default.noop,onAddSearchResults:_jquery2.default.noop,onRemoveSearchResults:_jquery2.default.noop,onOpenSearchResults:_jquery2.default.noop,onCloseSearchResults:_jquery2.default.noop,onMarkerHighlighted:_jquery2.default.noop}; // endregion
	// Merges given options with default options recursively.
	_$$Tools$class.prototype.initialize.call(this,options);var loadInitialized=true;if(_typeof(this.constructor._apiLoad)!=='object'){loadInitialized=false;this.constructor._apiLoad=_jquery2.default.Deferred();}var result=this.constructor._apiLoad.then(this.getMethod(this.bootstrap));if('google' in context&&'maps' in context.google){this.constructor.maps=context.google.maps;if(this.constructor._apiLoad.state()!=='resolved')setTimeout(function(){return _this2.constructor._apiLoad.resolve(_this2.$domNode);});}else if('google' in context.window&&'maps' in context.window.google){this.constructor.maps=context.window.google.maps;if(this.constructor._apiLoad.state()!=='resolved')setTimeout(function(){return _this2.constructor._apiLoad.resolve(_this2.$domNode);});}else if(!loadInitialized){var callbackName=void 0;if(this._options.api.callbackName)callbackName=this._options.api.callbackName;else callbackName=this.constructor.determineUniqueScopeName();context.window[callbackName]=function(){_this2.constructor.maps=context.window.google.maps;_this2.constructor._apiLoad.resolve(_this2.$domNode);};_jquery2.default.getScript(this.constructor.stringFormat(this._options.api.url,'window.'+callbackName)).catch(function(response,error){return _this2.constructor._apiLoad.reject(error);});}return result;}; /**
	     * Determines useful location cluster, info windows and marker.
	     * @returns The current instance.
	     */ // region static properties
	StoreLocator.prototype.bootstrap=function bootstrap(){var _this3=this;if(this._options.startLocation)return this.initializeMap();this._options.startLocation=this._options.fallbackLocation; /*
	            NOTE: If request is slower than the timeout parameter for jsonp
	            request the padding function isn't set anymore so an error
	            occurs. That's why we use our own timeout implementation.
	        */var loaded=false;var $deferred=_jquery2.default.Deferred();var fallbackTimeoutID=setTimeout(function(){loaded=true;_this3.initializeMap().then(function(){return $deferred.resolve(_this3.$domNode);});},this._options.ipToLocation.timeoutInMilliseconds);_jquery2.default.ajax({url:this.constructor.stringFormat(this._options.ipToLocation.applicationInterfaceURL,document.location.protocol.substring(0,document.location.protocol.length-1),this._options.ip||''),dataType:'jsonp',cache:true}).always(function(currentLocation,textStatus){if(!loaded){clearTimeout(fallbackTimeoutID);loaded=true;if(textStatus==='success') /*
	                        Check if determined location is within defined
	                        bounds.
	                    */if(!_this3._options.ipToLocation.bounds||new _this3.constructor.maps.LatLngBounds(new _this3.constructor.maps.LatLng(_this3._options.ipToLocation.bounds.southWest.latitude,_this3._options.ipToLocation.bounds.southWest.longitude),new _this3.constructor.maps.LatLng(_this3._options.ipToLocation.bounds.northEast.latitude,_this3._options.ipToLocation.bounds.northEast.longitude)).contains(new _this3.constructor.maps.LatLng(currentLocation.latitude,currentLocation.longitude)))_this3._options.startLocation=currentLocation;_this3.initializeMap().then(function(){return $deferred.resolve(_this3.$domNode);});}});return $deferred;}; /**
	     * Initializes cluster, info windows and marker.
	     * @returns The current instance.
	     */StoreLocator.prototype.initializeMap=function initializeMap(){var _this4=this;this._options.map.center=new this.constructor.maps.LatLng(this._options.startLocation.latitude,this._options.startLocation.longitude);this.map=new this.constructor.maps.Map((0,_jquery2.default)('<div>').appendTo(this.$domNode)[0],this._options.map);var markerCluster=null;if(this._options.marker.cluster)markerCluster=new GoogleMarkerClusterer(this.map,[],this._options.marker.cluster); // Add a marker for each retrieved store.
	var $addMarkerDeferred=_jquery2.default.Deferred();var markerList=[];if(_jquery2.default.isArray(this._options.stores)){for(var _iterator=this._options.stores,_isArray=Array.isArray(_iterator),_i=0,_iterator=_isArray?_iterator:_iterator[Symbol.iterator]();;){var _ref;if(_isArray){if(_i>=_iterator.length)break;_ref=_iterator[_i++];}else {_i=_iterator.next();if(_i.done)break;_ref=_i.value;}var _store=_ref;_jquery2.default.extend(true,_store,this._options.addtionalStoreProperties);var marker=this.createMarker(_store);if(markerCluster)markerCluster.addMarker(marker);markerList.push(marker);$addMarkerDeferred.resolve(markerList);}}else if(_jquery2.default.type(this._options.stores)==='string')_jquery2.default.getJSON(this._options.stores,function(stores){for(var _iterator2=stores,_isArray2=Array.isArray(_iterator2),_i2=0,_iterator2=_isArray2?_iterator2:_iterator2[Symbol.iterator]();;){var _ref2;if(_isArray2){if(_i2>=_iterator2.length)break;_ref2=_iterator2[_i2++];}else {_i2=_iterator2.next();if(_i2.done)break;_ref2=_i2.value;}var store=_ref2;_jquery2.default.extend(true,store,_this4._options.addtionalStoreProperties);var _marker=_this4.createMarker(store);if(markerCluster)markerCluster.addMarker(_marker);markerList.push(_marker);}$addMarkerDeferred.resolve(markerList);});else {var southWest=new this.constructor.maps.LatLng(this._options.stores.southWest.latitude,this._options.stores.southWest.longitude);var northEast=new this.constructor.maps.LatLng(this._options.stores.northEast.latitude,this._options.stores.northEast.longitude);for(var index=0;index<this._options.stores.number;index++){var store=_jquery2.default.extend({latitude:southWest.lat()+(northEast.lat()-southWest.lat())*Math.random(),longitude:southWest.lng()+(northEast.lng()-southWest.lng())*Math.random()},this._options.addtionalStoreProperties);var _marker2=this.createMarker(_jquery2.default.extend(store,this._options.stores.generateProperties(store)));if(markerCluster)markerCluster.addMarker(_marker2);markerList.push(_marker2);}$addMarkerDeferred.resolve(markerList);} // Create the search box and link it to the UI element.
	this.map.controls[this.constructor.maps.ControlPosition.TOP_LEFT].push(this.$domNode.find('input')[0]);if(_jquery2.default.type(this._options.searchBox)==='number')this.initializeGenericSearchBox();else {this.constructor.maps.event.addListener(this.map,'click',function(){return _this4.closeSearchResults();});this.constructor.maps.event.addListener(this.map,'dragstart',function(){return _this4.closeSearchResults();});this._options.searchBox=_jquery2.default.extend(true,{maximumNumberOfResults:50,numberOfAdditionalGenericPlaces:[2,5],maximalDistanceInMeter:1000000,loadingContent:this._options.infoWindow.loadingContent,genericPlaceFilter:function genericPlaceFilter(place){return place.formatted_address.indexOf(' Deutschland')!==-1||place.formatted_address.indexOf(' Germany')!==-1;},prefereGenericResults:true,genericPlaceSearchOptions:{radius:'50000'}},this._options.searchBox);this.initializeDataSourceSearchBox();} // Close marker if zoom level is bigger than the aggregation.
	this.constructor.maps.event.addListener(this.map,'zoom_changed',function(){if(_typeof(_this4.currentlyOpenWindow)==='object'&&_this4.currentlyOpenWindow&&_this4.currentlyOpenWindow.isOpen&&_this4.map.getZoom()<=_this4._options.marker.cluster.maxZoom){_this4.currentlyOpenWindow.isOpen=false;_this4.currentlyOpenWindow.close();}});var $mapLoadedDeferred=_jquery2.default.Deferred();this.constructor.maps.event.addListenerOnce(this.map,'idle',function(){return $addMarkerDeferred.then(function(){return $mapLoadedDeferred.resolve(_this4.$domNode);});});return $mapLoadedDeferred;}; /**
	     * Position search results right below the search input field.
	     * @returns The current instance.
	     */StoreLocator.prototype.initializeDataSourceSearchResultsBox=function initializeDataSourceSearchResultsBox(){var cssProperties={};var _arr=['position','width','top','left','border'];for(var _i3=0;_i3<_arr.length;_i3++){var propertyName=_arr[_i3];cssProperties[propertyName]=this.$domNode.find('input').css(propertyName);}cssProperties.marginTop=this.$domNode.find('input').outerHeight(true); // Prepare search result positioning.
	this.resultsDomNode=(0,_jquery2.default)('<div>').addClass(this.constructor.stringCamelCaseToDelimited(this.__name__+'SearchResults')).css(cssProperties); // Inject the final search results into the dom tree.
	this.$domNode.find('input').after(this.resultsDomNode);return this;}; /**
	     * Initializes a data source based search box to open and focus them
	     * matching marker.
	     * @returns The current instance.
	     */StoreLocator.prototype.initializeDataSourceSearchBox=function initializeDataSourceSearchBox(){var _this5=this;this.on(this.$domNode,'keydown',function(event){ /*
	                NOTE: Events that doesn't occurs in search context are handled
	                by the native map implementation and won't be propagated so we
	                doesn't have to care about that.
	            */if(_this5.currentSearchResults.length){if(_this5.currentSearchResultRange)_this5.currentSearchResultRange=[Math.max(0,_this5.currentSearchResultRange[0]),Math.min(_this5.currentSearchResults.length-1, // IgnoreTypeCheck
	_this5.currentSearchResultRange[1])];else _this5.currentSearchResultRange=[0,_this5.currentSearchResults.length-1];var currentIndex=-1;if(_this5.currentlyHighlightedMarker)currentIndex=_this5.currentSearchResults.indexOf(_this5.currentlyHighlightedMarker);if(event.keyCode===_this5.keyCode.DOWN){if(currentIndex===-1||_this5.currentSearchResultRange[1]<currentIndex+1)_this5.highlightMarker(_this5.currentSearchResults[_this5.currentSearchResultRange[0]],event);else _this5.highlightMarker(_this5.currentSearchResults[currentIndex+1],event);}else if(event.keyCode===_this5.keyCode.UP){if([_this5.currentSearchResultRange[0],-1].includes(currentIndex))_this5.highlightMarker(_this5.currentSearchResults[ // IgnoreTypeCheck
	_this5.currentSearchResultRange[1]],event);else _this5.highlightMarker(_this5.currentSearchResults[currentIndex-1],event);}else if(event.keyCode===_this5.keyCode.ENTER&&_this5.currentlyHighlightedMarker){event.stopPropagation();if(_this5.currentlyHighlightedMarker)if(_this5.currentlyHighlightedMarker.infoWindow)_this5.openMarker(_this5.currentlyHighlightedMarker,event);else _this5.openPlace(_this5.currentlyHighlightedMarker.data,event);}}});this.on(this.$domNode.find('input'),'focus',function(){if(_this5.currentSearchText)_this5.openSearchResults();});this.on(this.$domNode.find('input'),'keydown',function(event){for(var name in _this5.keyCode){if(_this5.keyCode.hasOwnProperty(name)&&event.keyCode===_this5.keyCode[name]&&name!=='DOWN')return;}});if(this.currentSearchText)this.openSearchResults();this.on(this.$domNode.find('input'),'click',function(){if(_this5.currentSearchText)_this5.openSearchResults();});this.constructor.maps.event.addListener(this.map,'center_changed',function(){ // NOTE: Search results depends on current position.
	if(_this5.currentSearchText&&_this5.resultsDomNode)_this5.searchResultsDirty=true;});this.on(this.$domNode.find('input'),'keyup',this.getUpdateSearchResultsHandler());return this;}; /**
	     * Triggers on each search request.
	     * @returns The current instance.
	     */StoreLocator.prototype.getUpdateSearchResultsHandler=function getUpdateSearchResultsHandler(){var _this6=this;var placesService=new this.constructor.maps.places.PlacesService(this.map);return this.debounce(function(event){for(var name in _this6.keyCode){if(event&&event.keyCode===_this6.keyCode[name]&&!['DELETE','BACKSPACE'].includes(name))return;}_this6.acquireLock(_this6.constructor._name+'Search',function(){var searchText=_this6.$domNode.find('input').val().trim();if(_this6.currentSearchText===searchText&&!_this6.searchResultsDirty)return _this6.releaseLock(_this6.constructor._name+'Search');_this6.searchResultsDirty=false;if(!_this6.resultsDomNode)_this6.initializeDataSourceSearchResultsBox();if(!searchText&&_this6.resultsDomNode){_this6.currentSearchText='';_this6.currentSearchResults=[];_this6.resultsDomNode.html('');_this6.currentSearchResultsDomNode=null;_this6.closeSearchResults();return _this6.releaseLock(_this6.constructor._name+'Search');}_this6.openSearchResults();var loadingDomNode=(0,_jquery2.default)(_this6._options.searchBox.loadingContent);if(_this6.resultsDomNode&&!_this6.fireEvent('addSearchResults',false,_this6,loadingDomNode,_this6.resultsDomNode,_this6.currentSearchResultsDomNode||[]))_this6.resultsDomNode.html(loadingDomNode);if(_this6.currentSearchResultsDomNode&&_this6.currentSearchResultsDomNode.length)_this6.fireEvent('removeSearchResults',false,_this6,_this6.currentSearchResultsDomNode);_this6.currentSearchResultsDomNode=loadingDomNode;if(_this6._options.searchBox.numberOfAdditionalGenericPlaces) /*
	                        NOTE: Google searches for more items than exists in the
	                        the specified radius. However the radius is a string in
	                        the examples provided by google.
	                    */placesService.textSearch(_jquery2.default.extend({query:searchText,location:_this6.map.getCenter()},_this6._options.searchBox.genericPlaceSearchOptions),function(places){if(places)_this6.handleGenericSearchResults(places,searchText);});else _this6.performLocalSearch(searchText);},1000);});}; /**
	     * Sorts and filters search results given by the google api.
	     * @param places - List of place objects.
	     * @param searchText - Words which should occur in requested search
	     * results.
	     * @returns Returns current instance.
	     */StoreLocator.prototype.handleGenericSearchResults=function handleGenericSearchResults(places,searchText){var _this7=this;var searchResults=[]; /*
	            NOTE: Since google text search doesn't support sorting by distance
	            we have to sort by our own.
	        */var index=1;var _loop=function _loop(){if(_isArray3){if(_i4>=_iterator3.length)return 'break';_ref3=_iterator3[_i4++];}else {_i4=_iterator3.next();if(_i4.done)return 'break';_ref3=_i4.value;}var place=_ref3;index+=1;var distance=_this7.constructor.maps.geometry.spherical.computeDistanceBetween(_this7.map.getCenter(),place.geometry.location);if(distance>_this7._options.searchBox.maximalDistanceInMeter)return 'break';if(_this7._options.searchBox.genericPlaceFilter(place)){var result={data:_jquery2.default.extend(place,{logoFilePath:place.icon.replace(/^http:(\/\/)/,document.location.protocol+'$1'),address:place.formatted_address,distance:distance}),position:place.geometry.location,open:function open(event){return _this7.openPlace(place,event);},highlight:function highlight(event,type){_this7.isHighlighted=type!=='stop';}};searchResults.push(result);if(_this7._options.searchBox.numberOfAdditionalGenericPlaces[1]<index)return 'break';}};for(var _iterator3=places.sort(function(firstPlace,secondPlace){return _this7.constructor.maps.geometry.spherical.computeDistanceBetween(_this7.map.getCenter(),firstPlace.geometry.location)-_this7.constructor.maps.geometry.spherical.computeDistanceBetween(_this7.map.getCenter(),secondPlace.geometry.location);}),_isArray3=Array.isArray(_iterator3),_i4=0,_iterator3=_isArray3?_iterator3:_iterator3[Symbol.iterator]();;){var _ref3;var _ret=_loop();if(_ret==='break')break;}return this.performLocalSearch(searchText,searchResults);}; /**
	     * Performs a search on locally given store data.
	     * @param searchText - Text to search for.
	     * @param searchResults - A list if generic search results.
	     * @returns The current instance.
	     */StoreLocator.prototype.performLocalSearch=function performLocalSearch(searchText){var _this8=this;var searchResults=arguments.length<=1||arguments[1]===undefined?[]:arguments[1];var numberOfGenericSearchResults=searchResults.length;var _loop2=function _loop2(){if(_isArray4){if(_i5>=_iterator4.length)return 'break';_ref4=_iterator4[_i5++];}else {_i5=_iterator4.next();if(_i5.done)return 'break';_ref4=_i5.value;}var marker=_ref4;for(var _iterator5=_this8._options.searchBox.properties,_isArray5=Array.isArray(_iterator5),_i6=0,_iterator5=_isArray5?_iterator5:_iterator5[Symbol.iterator]();;){var _ref5;if(_isArray5){if(_i6>=_iterator5.length)break;_ref5=_iterator5[_i6++];}else {_i6=_iterator5.next();if(_i6.done)break;_ref5=_i6.value;}var key=_ref5;if((marker.data[key]||marker.data[key]===0)&&(''+marker.data[key]).toLowerCase().replace(/[-_&]+/g,' ').indexOf(searchText.toLowerCase().replace(/[-_&]+/g,' '))!==-1){marker.open=function(event){return _this8.openMarker(marker,event);};marker.highlight=function(event,type){return _this8.highlightMarker(marker,event,type);};searchResults.push(marker);break;}}};for(var _iterator4=this.markers,_isArray4=Array.isArray(_iterator4),_i5=0,_iterator4=_isArray4?_iterator4:_iterator4[Symbol.iterator]();;){var _ref4;var _ret2=_loop2();if(_ret2==='break')break;} /*
	            Remove generic place results if there are enough local search
	            results.
	        */if(this._options.searchBox.numberOfAdditionalGenericPlaces&&searchResults.length&&numberOfGenericSearchResults>this._options.searchBox.numberOfAdditionalGenericPlaces[0]&&searchResults.length>this._options.searchBox.numberOfAdditionalGenericPlaces[1])searchResults.splice(this._options.searchBox.numberOfAdditionalGenericPlaces[0],numberOfGenericSearchResults-this._options.searchBox.numberOfAdditionalGenericPlaces[0]); // Slice additional unneeded local search results.
	var limitReached=false;if(this._options.searchBox.maximumNumberOfResults<searchResults.length){limitReached=true;searchResults.splice(this._options.searchBox.maximumNumberOfResults,searchResults.length);} /*
	            Sort results by current map center form nearer to more fare away
	            results.
	        */searchResults.sort(function(first,second){if(_this8._options.searchBox.prefereGenericResults&&!first.infoWindow&&second.infoWindow)return -1;if(_this8._options.searchBox.prefereGenericResults&&!second.infoWindow&&first.infoWindow)return 1;return _this8.constructor.maps.geometry.spherical.computeDistanceBetween(_this8.map.getCenter(),first.position)-_this8.constructor.maps.geometry.spherical.computeDistanceBetween(_this8.map.getCenter(),second.position);}); // Compile search results markup.
	var resultsRepresentation=this.makeSearchResults(searchResults,limitReached);if(_jquery2.default.type(resultsRepresentation)==='string'){var resultsRepresentationDomNode=(0,_jquery2.default)(resultsRepresentation);if(this.resultsDomNode&&!this.fireEvent('addSearchResults',false,this,resultsRepresentationDomNode,this.resultsDomNode,this.currentSearchResultsDomNode||[]))this.resultsDomNode.html(resultsRepresentationDomNode);if(this.currentSearchResultsDomNode&&this.currentSearchResultsDomNode.length)this.fireEvent('removeSearchResults',false,this,this.currentSearchResultsDomNode);this.currentSearchResultsDomNode=resultsRepresentationDomNode;setTimeout(function(){return _this8.releaseLock(_this8.constructor._name+'Search');},0);}else if(resultsRepresentation instanceof Promise)resultsRepresentation.then(function(resultsRepresentation){var resultsRepresentationDomNode=(0,_jquery2.default)(resultsRepresentation);if(_this8.resultsDomNode&&!_this8.fireEvent('addSearchResults',false,_this8,resultsRepresentationDomNode,_this8.resultsDomNode,_this8.currentSearchResultsDomNode||[]))_this8.resultsDomNode.html(resultsRepresentationDomNode);if(_this8.currentSearchResultsDomNode&&_this8.currentSearchResultsDomNode.length)_this8.fireEvent('removeSearchResults',false,_this8,_this8.currentSearchResultsDomNode);_this8.currentSearchResultsDomNode=resultsRepresentationDomNode;_this8.releaseLock(_this8._name+'Search');});this.currentSearchText=searchText;this.currentSearchResults=searchResults.slice();return this;}; /**
	     * Opens current search results.
	     * @param event - Object with meta data for current event which has
	     * triggered to show search results.
	     * @returns The current instance.
	     */StoreLocator.prototype.openSearchResults=function openSearchResults(event){if(event)event.stopPropagation();this.getUpdateSearchResultsHandler()(event);if(this.resultsDomNode&&!this.resultsDomNode.hasClass('open')&&!this.fireEvent('openSearchResults',false,this,event,this.resultsDomNode))this.resultsDomNode.addClass('open');return this;}; /**
	     * Closes current search results.
	     * @param event - Object with meta data for current event which has
	     * triggered to close search results.
	     * @returns The current instance.
	     */StoreLocator.prototype.closeSearchResults=function closeSearchResults(){var event=arguments.length<=0||arguments[0]===undefined?null:arguments[0];if(event)event.stopPropagation();if(this.resultsDomNode&&this.resultsDomNode.hasClass('open')&&!this.fireEvent('closeSearchResults',false,this,event,this.resultsDomNode))this.resultsDomNode.removeClass('open');return this;}; /**
	     * Initializes googles generic search box and tries to match to open and
	     * focus them.
	     * @returns The current instance.
	     */StoreLocator.prototype.initializeGenericSearchBox=function initializeGenericSearchBox(){var _this9=this;var searchBox=new this.constructor.maps.places.SearchBox(this.$domNode.find('input')[0]); /*
	            Bias the search box results towards places that are within the
	            bounds of the current map's viewport.
	        */this.constructor.maps.event.addListener(this.map,'bounds_changed',function(){return searchBox.setBounds(_this9.map.getBounds());}); /*
	            Listen for the event fired when the user selects an item from the
	            pick list. Retrieve the matching places for that item.
	        */this.constructor.maps.event.addListener(searchBox,'places_changed',function(){return _this9.ensurePlaceLocations(searchBox.getPlaces()).then(function(places){var foundPlace=_this9.determineBestSearchResult(places);if(foundPlace){var shortestDistanceInMeter=Number.MAX_VALUE;var matchingMarker=null;for(var _iterator6=_this9.markers,_isArray6=Array.isArray(_iterator6),_i7=0,_iterator6=_isArray6?_iterator6:_iterator6[Symbol.iterator]();;){var _ref6;if(_isArray6){if(_i7>=_iterator6.length)break;_ref6=_iterator6[_i7++];}else {_i7=_iterator6.next();if(_i7.done)break;_ref6=_i7.value;}var _marker3=_ref6;var distanceInMeter=_this9.constructor.maps.geometry.spherical.computeDistanceBetween(foundPlace.geometry.location,_marker3.position);if(distanceInMeter<shortestDistanceInMeter){shortestDistanceInMeter=distanceInMeter;matchingMarker=_marker3;}}if(matchingMarker&&shortestDistanceInMeter<=_this9._options.searchBox){if(_this9._options.successfulSearchZoom)_this9.map.setZoom(_this9._options.successfulSearchZoom);_this9.openMarker(matchingMarker);return places;}if(_this9.currentlyOpenWindow){_this9.currentlyOpenWindow.isOpen=false;_this9.currentlyOpenWindow.close();}_this9.map.setCenter(foundPlace.geometry.location);if(_this9._options.successfulSearchZoom)_this9.map.setZoom(_this9._options.successfulSearchZoom);}return places;});});return this;}; /**
	     * Ensures that every given place have a location property.
	     * @param places - Places to check for.
	     * @returns A promise which will be resolved if all places are ensured.
	     */StoreLocator.prototype.ensurePlaceLocations=function ensurePlaceLocations(places){var _this10=this;return new Promise(function(resolve){var runningGeocodes=0;var geocoder=new _this10.constructor.maps.Geocoder();var _loop3=function _loop3(){if(_isArray7){if(_i8>=_iterator7.length)return 'break';_ref7=_iterator7[_i8++];}else {_i8=_iterator7.next();if(_i8.done)return 'break';_ref7=_i8.value;}var place=_ref7;if(!('geometry' in place&&'location' in place.geometry)){_this10.warn('Found place "{1}" doesn\'t have a location. Full '+'object:',place.name);_this10.warn(place);_this10.info('Geocode will be determined separately. With address'+' "{1}".',place.name);runningGeocodes+=1; /* eslint-disable no-loop-func */geocoder.geocode({address:place.name},function(results,status){runningGeocodes-=1;if(status===_this10.constructor.maps.GeocoderStatus.OK)place.geometry=results[0].geometry;else {delete places[places.indexOf(place)];_this10.warn('Found place "{1}" couldn\'t be geocoded by '+'google. Removing it from the places list.',place.name);}if(runningGeocodes===0)resolve(places);}); /* eslint-enable no-loop-func */}};for(var _iterator7=places,_isArray7=Array.isArray(_iterator7),_i8=0,_iterator7=_isArray7?_iterator7:_iterator7[Symbol.iterator]();;){var _ref7;var _ret3=_loop3();if(_ret3==='break')break;}});}; /**
	     * Determines the best search result from given list of candidates.
	     * Currently the nearest result to current viewport will be preferred.
	     * @param candidates - List of search results to determine best from.
	     * @returns The determined best result.
	     */StoreLocator.prototype.determineBestSearchResult=function determineBestSearchResult(candidates){var result=null;if(candidates.length){var shortestDistanceInMeter=Number.MAX_VALUE;for(var _iterator8=candidates,_isArray8=Array.isArray(_iterator8),_i9=0,_iterator8=_isArray8?_iterator8:_iterator8[Symbol.iterator]();;){var _ref8;if(_isArray8){if(_i9>=_iterator8.length)break;_ref8=_iterator8[_i9++];}else {_i9=_iterator8.next();if(_i9.done)break;_ref8=_i9.value;}var candidate=_ref8;var distanceInMeter=this.constructor.maps.geometry.spherical.computeDistanceBetween(candidate.geometry.location,this.map.getCenter());if(distanceInMeter<shortestDistanceInMeter){result=candidate;shortestDistanceInMeter=distanceInMeter;}}}return result;}; /**
	     * Is triggered if the complete map ist loaded.
	     * @returns The current instance.
	     */StoreLocator.prototype.onLoaded=function onLoaded(){var _this11=this;setTimeout(function(){return _this11.$domNode.find('input').fadeIn(_this11._options.inputFadeInOption);},this._options.showInputAfterLoadedDelayInMilliseconds);return this;}; /**
	     * Registers given store to the google maps canvas.
	     * @param store - Store object to create a marker for.
	     * @returns The created marker.
	     */StoreLocator.prototype.createMarker=function createMarker(store){var index=0;while(this.seenLocations.includes(store.latitude+'-'+store.longitude)){if(index%2)store.latitude+=this._options.distanceToMoveByDuplicatedEntries;else store.longitude+=this._options.distanceToMoveByDuplicatedEntries;index+=1;}this.seenLocations.push(store.latitude+'-'+store.longitude);var marker={position:new this.constructor.maps.LatLng(store.latitude,store.longitude),map:this.map,data:store};if(store.markerIconFileName||this._options.defaultMarkerIconFileName){marker.icon=_jquery2.default.extend({},this._options.marker.icon);if(marker.icon.size)marker.icon.size=new this.constructor.maps.Size(marker.icon.size.width,marker.icon.size.height,marker.icon.size.unit,marker.icon.size.unit);if(marker.icon.scaledSize)marker.icon.scaledSize=new this.constructor.maps.Size(marker.icon.scaledSize.width,marker.icon.scaledSize.height,marker.icon.scaledSize.unit,marker.icon.scaledSize.unit);if(store.markerIconFileName)marker.icon.url=this._options.iconPath+store.markerIconFileName;else marker.icon.url=this._options.iconPath+this._options.defaultMarkerIconFileName;}if(store.title)marker.title=store.title;marker.infoWindow=new this.constructor.maps.InfoWindow({content:''});marker.infoWindow.isOpen=false;this.constructor.maps.event.addListener(marker.infoWindow,'closeclick',function(){marker.infoWindow.isOpen=false;});marker.nativeMarker=new this.constructor.maps.Marker(marker);this.constructor.maps.event.addListener(marker.nativeMarker,'click',this.getMethod('openMarker',this,marker));this.markers.push(marker);return marker.nativeMarker;}; /**
	     * Opens given marker info window. And closes a potential opened windows.
	     * @param marker - Marker to open.
	     * @param event - Event which has triggered the marker opening call.
	     * @returns The current instance.
	     */StoreLocator.prototype.openMarker=function openMarker(marker,event){if(event)event.stopPropagation();this.highlightMarker(marker,event,'stop'); /*
	            We have to ensure that the minimum zoom level has one more then
	            the clustering can appear. Since a cluster hides an open window.
	        */if('cluster' in this._options.marker&&this._options.marker.cluster.maxZoom&&this.map.getZoom()<=this._options.marker.cluster.maxZoom)this.map.setZoom(this._options.marker.cluster.maxZoom+1);this.closeSearchResults(event);if(this.currentlyOpenWindow===marker.infoWindow&&this.currentlyOpenWindow.isOpen)return this;this.fireEvent('infoWindowOpen',event,marker);marker.refreshSize=function(){return  (// Simulates a content update to enforce info box size adjusting.
	marker.infoWindow.setContent(marker.infoWindow.getContent()));};var infoWindow=this.makeInfoWindow(marker);if(typeof infoWindow==='string')marker.infoWindow.setContent(infoWindow);else {marker.infoWindow.setContent(this._options.infoWindow.loadingContent);infoWindow.then(function(infoWindow){return marker.infoWindow.setContent(infoWindow);});}if(this.currentlyOpenWindow){this.currentlyOpenWindow.isOpen=false;this.currentlyOpenWindow.close();}this.currentlyOpenWindow=marker.infoWindow;marker.infoWindow.isOpen=true;marker.infoWindow.open(this.map,marker.nativeMarker);this.map.panTo(marker.nativeMarker.position);this.map.panBy(0,-this._options.infoWindow.additionalMoveToBottomInPixel);this.fireEvent('infoWindowOpened',event,marker);return this;}; /**
	     * Focuses given place on map.
	     * @param place - Place to open.
	     * @param event - Event object which has triggered requested place opening.
	     * @returns The current instance.
	     */StoreLocator.prototype.openPlace=function openPlace(place,event){if(event)event.stopPropagation();this.closeSearchResults(event);if(this.currentlyOpenWindow){this.currentlyOpenWindow.isOpen=false;this.currentlyOpenWindow.close();}this.map.setCenter(place.geometry.location);this.map.setZoom(this._options.successfulSearchZoom);return this;}; /**
	     * Opens given marker info window. And closes a potential opened windows.
	     * @param marker - Marker to Highlight.
	     * @param event - Event object for corresponding event that has the
	     * highlighting requested.
	     * @param type - Type of highlighting.
	     * @returns The current instance.
	     */StoreLocator.prototype.highlightMarker=function highlightMarker(marker,event){var type=arguments.length<=2||arguments[2]===undefined?'bounce':arguments[2];if(event)event.stopPropagation();if(this.currentlyHighlightedMarker){if('nativeMarker' in this.currentlyHighlightedMarker)this.currentlyHighlightedMarker.nativeMarker.setAnimation(null);this.currentlyHighlightedMarker.isHighlighted=false;this.currentlyHighlightedMarker=null;}if('nativeMarker' in marker)if(type==='stop')marker.nativeMarker.setAnimation(null);else { /*
	                    We have to ensure that the minimum zoom level has one more
	                    then the clustering can appear. Since a cluster hides an
	                    open window.
	                */if('cluster' in this._options.marker&&this._options.marker.cluster.maxZoom&&this.map.getZoom()<=this._options.marker.cluster.maxZoom&&'position' in marker.nativeMarker&&this.map.getBounds().contains(marker.nativeMarker.positioning)){this.map.setCenter(marker.nativeMarker.position);this.map.setZoom(this._options.marker.cluster.maxZoom+1);}if(marker!==this.currentlyHighlightedMarker&&marker.nativeMarker){marker.nativeMarker.setAnimation(this.constructor.maps.Animation[type.toUpperCase()]);marker.isHighlighted=true;this.currentlyHighlightedMarker=marker;}this.fireEvent('markerHighlighted',marker);}return this;}; /**
	     * Takes the marker for a store and creates the HTML content of the info
	     * window.
	     * @param marker - Marker to generate info window for.
	     * @returns Info window markup.
	     */StoreLocator.prototype.makeInfoWindow=function makeInfoWindow(marker){if(_jquery2.default.isFunction(this._options.infoWindow.content))return this._options.infoWindow.content.apply(this,arguments);if('content' in this._options.infoWindow)return this._options.infoWindow.content;var content='<div>';for(var name in marker.data){if(marker.data.hasOwnProperty(name))content+=name+': '+marker.data[name]+'<br />';}return content+'</div>';}; /**
	     * Takes the search results and creates the HTML content of the search
	     * results.
	     * @param searchResults - Search result to generate markup for.
	     * @returns Generated markup.
	     */StoreLocator.prototype.makeSearchResults=function makeSearchResults(searchResults){if(_jquery2.default.isFunction(this._options.searchBox.content))return this._options.searchBox.content.apply(this,arguments);if('content' in this._options.searchBox.content)return this._options.searchBox.content;var content='';for(var _iterator9=searchResults,_isArray9=Array.isArray(_iterator9),_i10=0,_iterator9=_isArray9?_iterator9:_iterator9[Symbol.iterator]();;){var _ref9;if(_isArray9){if(_i10>=_iterator9.length)break;_ref9=_iterator9[_i10++];}else {_i10=_iterator9.next();if(_i10.done)break;_ref9=_i10.value;}var result=_ref9;content+='<div>';for(var name in result.data){if(result.data.hasOwnProperty(name))content+=name+': '+result.data[name]+'<br />';}content+='</div>';}return content;};return StoreLocator;}(_jquery2.default.Tools.class); // endregion
	StoreLocator._name='StoreLocator';_jquery2.default.fn.StoreLocator=function(){return _jquery2.default.Tools().controller(StoreLocator,arguments,this);}; /** The jQuery-storeLocator plugin class. */exports.default=StoreLocator; // region vim modline
	// vim: set tabstop=4 shiftwidth=4 expandtab:
	// vim: foldmethod=marker foldmarker=region,endregion:
	// endregion
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(1)(module)))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {// #!/usr/bin/env node
	// -*- coding: utf-8 -*-
	'use strict'; /* !
	    region header
	    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012
	
	    License
	    -------
	
	    This library written by Torben Sickert stand under a creative commons
	    naming 3.0 unported license.
	    See http://creativecommons.org/licenses/by/3.0/deed.de
	    endregion
	*/ // region imports
	var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol?"symbol":typeof obj;};var _browserAPI=__webpack_require__(5);var _browserAPI2=_interopRequireDefault(_browserAPI);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};} // endregion
	// endregion
	// region declaration
	// endregion
	// region types
	var QUnit= false?require('qunit-cli'):__webpack_require__(8);(0,_browserAPI2.default)(function(browserAPI,alreadyLoaded){var $=__webpack_require__(2);$.context=browserAPI.window.document;__webpack_require__(3); // region mock-up
	$('#qunit-fixture').append('<store-locator><input></store-locator>');var $storeLocatorDeferred=$('store-locator').StoreLocator({marker:{cluster:null}}); // endregion
	$storeLocatorDeferred.always(function($storeLocatorDomNode){if(false)QUnit.load();else if(!alreadyLoaded)QUnit.start();var storeLocator=$storeLocatorDomNode.data('StoreLocator'); // region tests
	// / region public methods
	// //  region special
	QUnit.test('initialize',function(assert){assert.ok(storeLocator);assert.ok($storeLocatorDomNode.children('div').length>0);assert.ok($storeLocatorDomNode.find('input').length>0);}); // // endregion
	// / endregion
	// endregion
	if(false)browserAPI.window.close();}); //  region hot module replacement handler
	if(( false?'undefined':_typeof(module))==='object'&&'hot' in module&&module.hot){module.hot.accept(); // IgnoreTypeCheck
	module.hot.dispose(function(){ /*
	                NOTE: We have to delay status indicator reset because qunits
	                status updates are delayed as well.
	            */$storeLocatorDeferred.always(function(){setTimeout(function(){if(!$('.fail').length){browserAPI.window.document.title='✔ test';$('#qunit-banner').removeClass('qunit-fail').addClass('qunit-pass');}},0);$('#qunit-tests').html('');console.clear();});});} // endregion
	}); // region vim modline
	// vim: set tabstop=4 shiftwidth=4 expandtab:
	// vim: foldmethod=marker foldmarker=region,endregion:
	// endregion
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {// #!/usr/bin/env node
	
	// -*- coding: utf-8 -*-
	'use strict';
	/* !
	    region header
	    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012
	
	    License
	    -------
	
	    This library written by Torben Sickert stand under a creative commons naming
	    3.0 unported license. see http://creativecommons.org/licenses/by/3.0/deed.de
	    endregion
	*/
	// region imports
	/* eslint-disable no-unused-vars */
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	// endregion
	// region variables
	
	/* eslint-enable no-unused-vars */
	// endregion
	// region declaration
	const onCreatedListener = [];
	let browserAPI;
	// endregion
	// region ensure presence of common browser environment
	if (false) {
	    // region mock browser environment
	    const fileSystem = require('fs');
	    const path = require('path');
	    const metaDOM = require('jsdom');
	    const virtualConsole = metaDOM.createVirtualConsole().sendTo(console, { omitJsdomErrors: true });
	    virtualConsole.on('jsdomError', error => {
	        if (!browserAPI.debug && ['XMLHttpRequest', 'resource loading'
	        // IgnoreTypeCheck
	        ].includes(error.type)) console.warn(`Loading resource failed: ${ error.toString() }.`);else console.error(error);
	    });
	    let templateFilePath = path.join(__dirname, 'test.compiled.html');
	    try {
	        fileSystem.accessSync(templateFilePath, fileSystem.F_OK);
	    } catch (error) {
	        templateFilePath = path.join(process.cwd(), __dirname, 'node_modules/webOptimizer/test.compiled.html');
	    }
	    metaDOM.env({
	        created: (error, window) => {
	            browserAPI = {
	                debug: false, domContentLoaded: false, metaDOM, window };
	            browserAPI.window.document.addEventListener('DOMContentLoaded', () => {
	                browserAPI.domContentLoaded = true;
	            });
	            if (error) throw error;else for (const callback of onCreatedListener) callback(browserAPI, false);
	        },
	        features: {
	            FetchExternalResources: ['script', 'frame', 'iframe', 'link', 'img'],
	            ProcessExternalResources: ['script'],
	            SkipExternalResources: false
	        },
	        html: fileSystem.readFileSync(templateFilePath, { encoding: 'utf-8' }),
	        resourceLoader: (resource, callback) => {
	            if (resource.url.hostname === 'localhost') {
	                resource.url.host = resource.url.hostname = '';
	                resource.url.port = null;
	                resource.url.protocol = 'file:';
	                resource.url.href = resource.url.href.replace(/^[a-zA-Z]+:\/\/localhost(?::[0-9]+)?/, `file://${ process.cwd() }`);
	                resource.url.path = resource.url.pathname = path.join(process.cwd(), resource.url.path);
	            }
	            if (browserAPI.debug) console.info(`Load resource "${ resource.url.href }".`);
	            return resource.defaultFetch(function (error) {
	                if (!error) callback.apply(this, arguments);
	            });
	        },
	        url: 'http://localhost',
	        virtualConsole
	    });
	    // endregion
	} else {
	        browserAPI = { debug: false, domContentLoaded: false, metaDOM: null, window };
	        window.document.addEventListener('DOMContentLoaded', () => {
	            browserAPI.domContentLoaded = true;
	            for (const callback of onCreatedListener) callback(browserAPI, false);
	        });
	    }
	// endregion
	
	exports.default = (callback, clear = true) => {
	    // region initialize global context
	    /*
	        NOTE: We have to define window globally before anything is loaded to
	        ensure that all future instances share the same window object.
	    */
	    if (clear && typeof global !== 'undefined' && global !== browserAPI.window) {
	        global.window = browserAPI.window;
	        for (const key in browserAPI.window) if (browserAPI.window.hasOwnProperty(key) && !global.hasOwnProperty(key)) global[key] = browserAPI.window[key];
	    }
	    // endregion
	    if (false) return browserAPI ? callback(browserAPI, true) : onCreatedListener.push(callback);
	    return browserAPI.domContentLoaded ? callback(browserAPI, true) : onCreatedListener.push(callback);
	};
	// region vim modline
	// vim: set tabstop=4 shiftwidth=4 expandtab:
	// vim: foldmethod=marker foldmarker=region,endregion:
	// endregion
	
	//# sourceMappingURL=data:application/json;base64,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QWQ7QUFDWDtBQUNEO0FBQ0EsUUFBSSxPQUFPLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUMsV0FBVyxNQUFoRCxFQUNJLE9BQVEsVUFBRCxHQUFlLFNBQ2xCLFVBRGtCLEVBQ04sSUFETSxDQUFmLEdBRUgsa0JBQWtCLElBQWxCLENBQXVCLFFBQXZCLENBRko7QUFHSixXQUFRLFdBQVcsZ0JBQVosR0FBZ0MsU0FDbkMsVUFEbUMsRUFDdkIsSUFEdUIsQ0FBaEMsR0FFSCxrQkFBa0IsSUFBbEIsQ0FBdUIsUUFBdkIsQ0FGSjtBQUdILEM7QUFDRDtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJicm93c2VyQVBJLmNvbXBpbGVkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gIyEvdXNyL2Jpbi9lbnYgbm9kZVxuLy8gQGZsb3dcbi8vIC0qLSBjb2Rpbmc6IHV0Zi04IC0qLVxuJ3VzZSBzdHJpY3QnXG4vKiAhXG4gICAgcmVnaW9uIGhlYWRlclxuICAgIENvcHlyaWdodCBUb3JiZW4gU2lja2VydCAoaW5mb1tcIn5hdH5cIl10b3JiZW4ud2Vic2l0ZSkgMTYuMTIuMjAxMlxuXG4gICAgTGljZW5zZVxuICAgIC0tLS0tLS1cblxuICAgIFRoaXMgbGlicmFyeSB3cml0dGVuIGJ5IFRvcmJlbiBTaWNrZXJ0IHN0YW5kIHVuZGVyIGEgY3JlYXRpdmUgY29tbW9ucyBuYW1pbmdcbiAgICAzLjAgdW5wb3J0ZWQgbGljZW5zZS4gc2VlIGh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LzMuMC9kZWVkLmRlXG4gICAgZW5kcmVnaW9uXG4qL1xuLy8gcmVnaW9uIGltcG9ydHNcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG5pbXBvcnQgdHlwZSB7QnJvd3NlckFQSSwgRG9tTm9kZSwgV2luZG93fSBmcm9tICcuL3R5cGUnXG4vKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXG4gLy8gZW5kcmVnaW9uXG4vLyByZWdpb24gZGVjbGFyYXRpb25cbmRlY2xhcmUgdmFyIFRBUkdFVDpzdHJpbmdcbmRlY2xhcmUgdmFyIHdpbmRvdzpXaW5kb3dcbi8vIGVuZHJlZ2lvblxuLy8gcmVnaW9uIHZhcmlhYmxlc1xuY29uc3Qgb25DcmVhdGVkTGlzdGVuZXI6QXJyYXk8RnVuY3Rpb24+ID0gW11cbmxldCBicm93c2VyQVBJOkJyb3dzZXJBUElcbi8vIGVuZHJlZ2lvblxuLy8gcmVnaW9uIGVuc3VyZSBwcmVzZW5jZSBvZiBjb21tb24gYnJvd3NlciBlbnZpcm9ubWVudFxuaWYgKHR5cGVvZiBUQVJHRVQgPT09ICd1bmRlZmluZWQnIHx8IFRBUkdFVCA9PT0gJ25vZGUnKSB7XG4gICAgLy8gcmVnaW9uIG1vY2sgYnJvd3NlciBlbnZpcm9ubWVudFxuICAgIGNvbnN0IGZpbGVTeXN0ZW06T2JqZWN0ID0gcmVxdWlyZSgnZnMnKVxuICAgIGNvbnN0IHBhdGg6T2JqZWN0ID0gcmVxdWlyZSgncGF0aCcpXG4gICAgY29uc3QgbWV0YURPTTpPYmplY3QgPSByZXF1aXJlKCdqc2RvbScpXG4gICAgY29uc3QgdmlydHVhbENvbnNvbGU6T2JqZWN0ID0gbWV0YURPTS5jcmVhdGVWaXJ0dWFsQ29uc29sZSgpLnNlbmRUbyhcbiAgICAgICAgY29uc29sZSwge29taXRKc2RvbUVycm9yczogdHJ1ZX0pXG4gICAgdmlydHVhbENvbnNvbGUub24oJ2pzZG9tRXJyb3InLCAoZXJyb3I6RXJyb3IpOnZvaWQgPT4ge1xuICAgICAgICBpZiAoIWJyb3dzZXJBUEkuZGVidWcgJiYgW1xuICAgICAgICAgICAgJ1hNTEh0dHBSZXF1ZXN0JywgJ3Jlc291cmNlIGxvYWRpbmcnXG4gICAgICAgIC8vIElnbm9yZVR5cGVDaGVja1xuICAgICAgICBdLmluY2x1ZGVzKGVycm9yLnR5cGUpKVxuICAgICAgICAgICAgY29uc29sZS53YXJuKGBMb2FkaW5nIHJlc291cmNlIGZhaWxlZDogJHtlcnJvci50b1N0cmluZygpfS5gKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgIH0pXG4gICAgbGV0IHRlbXBsYXRlRmlsZVBhdGg6c3RyaW5nID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ3Rlc3QuY29tcGlsZWQuaHRtbCcpXG4gICAgdHJ5IHtcbiAgICAgICAgZmlsZVN5c3RlbS5hY2Nlc3NTeW5jKHRlbXBsYXRlRmlsZVBhdGgsIGZpbGVTeXN0ZW0uRl9PSylcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICB0ZW1wbGF0ZUZpbGVQYXRoID0gcGF0aC5qb2luKFxuICAgICAgICAgICAgcHJvY2Vzcy5jd2QoKSwgX19kaXJuYW1lLFxuICAgICAgICAgICAgJ25vZGVfbW9kdWxlcy93ZWJPcHRpbWl6ZXIvdGVzdC5jb21waWxlZC5odG1sJylcbiAgICB9XG4gICAgbWV0YURPTS5lbnYoe1xuICAgICAgICBjcmVhdGVkOiAoZXJyb3I6P0Vycm9yLCB3aW5kb3c6T2JqZWN0KTp2b2lkID0+IHtcbiAgICAgICAgICAgIGJyb3dzZXJBUEkgPSB7XG4gICAgICAgICAgICAgICAgZGVidWc6IGZhbHNlLCBkb21Db250ZW50TG9hZGVkOiBmYWxzZSwgbWV0YURPTSwgd2luZG93fVxuICAgICAgICAgICAgYnJvd3NlckFQSS53aW5kb3cuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIChcbiAgICAgICAgICAgICk6dm9pZCA9PiB7XG4gICAgICAgICAgICAgICAgYnJvd3NlckFQSS5kb21Db250ZW50TG9hZGVkID0gdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGlmIChlcnJvcilcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvclxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgY2FsbGJhY2s6RnVuY3Rpb24gb2Ygb25DcmVhdGVkTGlzdGVuZXIpXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGJyb3dzZXJBUEksIGZhbHNlKVxuICAgICAgICB9LFxuICAgICAgICBmZWF0dXJlczoge1xuICAgICAgICAgICAgRmV0Y2hFeHRlcm5hbFJlc291cmNlczogW1xuICAgICAgICAgICAgICAgICdzY3JpcHQnLCAnZnJhbWUnLCAnaWZyYW1lJywgJ2xpbmsnLCAnaW1nJ1xuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFByb2Nlc3NFeHRlcm5hbFJlc291cmNlczogWydzY3JpcHQnXSxcbiAgICAgICAgICAgIFNraXBFeHRlcm5hbFJlc291cmNlczogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgaHRtbDogZmlsZVN5c3RlbS5yZWFkRmlsZVN5bmModGVtcGxhdGVGaWxlUGF0aCwge2VuY29kaW5nOiAndXRmLTgnfSksXG4gICAgICAgIHJlc291cmNlTG9hZGVyOiAoXG4gICAgICAgICAgICByZXNvdXJjZTp7XG4gICAgICAgICAgICAgICAgZWxlbWVudDpEb21Ob2RlO1xuICAgICAgICAgICAgICAgIHVybDp7XG4gICAgICAgICAgICAgICAgICAgIGhvc3RuYW1lOnN0cmluZztcbiAgICAgICAgICAgICAgICAgICAgaG9zdDpzdHJpbmc7XG4gICAgICAgICAgICAgICAgICAgIHBvcnQ6P3N0cmluZztcbiAgICAgICAgICAgICAgICAgICAgcHJvdG9jb2w6c3RyaW5nO1xuICAgICAgICAgICAgICAgICAgICBocmVmOnN0cmluZztcbiAgICAgICAgICAgICAgICAgICAgcGF0aDpzdHJpbmc7XG4gICAgICAgICAgICAgICAgICAgIHBhdGhuYW1lOnN0cmluZztcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGNvb2tpZTpzdHJpbmc7XG4gICAgICAgICAgICAgICAgYmFzZVVybDpzdHJpbmc7XG4gICAgICAgICAgICAgICAgZGVmYXVsdEZldGNoOihjYWxsYmFjazooXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOj9FcnJvciwgYm9keTpzdHJpbmdcbiAgICAgICAgICAgICAgICApID0+IHZvaWQpID0+IHZvaWRcbiAgICAgICAgICAgIH0sIGNhbGxiYWNrOihlcnJvcjo/RXJyb3IsIGJvZHk6c3RyaW5nKSA9PiB2b2lkXG4gICAgICAgICk6dm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAocmVzb3VyY2UudXJsLmhvc3RuYW1lID09PSAnbG9jYWxob3N0Jykge1xuICAgICAgICAgICAgICAgIHJlc291cmNlLnVybC5ob3N0ID0gcmVzb3VyY2UudXJsLmhvc3RuYW1lID0gJydcbiAgICAgICAgICAgICAgICByZXNvdXJjZS51cmwucG9ydCA9IG51bGxcbiAgICAgICAgICAgICAgICByZXNvdXJjZS51cmwucHJvdG9jb2wgPSAnZmlsZTonXG4gICAgICAgICAgICAgICAgcmVzb3VyY2UudXJsLmhyZWYgPSByZXNvdXJjZS51cmwuaHJlZi5yZXBsYWNlKFxuICAgICAgICAgICAgICAgICAgICAvXlthLXpBLVpdKzpcXC9cXC9sb2NhbGhvc3QoPzo6WzAtOV0rKT8vLFxuICAgICAgICAgICAgICAgICAgICBgZmlsZTovLyR7cHJvY2Vzcy5jd2QoKX1gKVxuICAgICAgICAgICAgICAgIHJlc291cmNlLnVybC5wYXRoID0gcmVzb3VyY2UudXJsLnBhdGhuYW1lID0gcGF0aC5qb2luKFxuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLmN3ZCgpLCByZXNvdXJjZS51cmwucGF0aClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChicm93c2VyQVBJLmRlYnVnKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhgTG9hZCByZXNvdXJjZSBcIiR7cmVzb3VyY2UudXJsLmhyZWZ9XCIuYClcbiAgICAgICAgICAgIHJldHVybiByZXNvdXJjZS5kZWZhdWx0RmV0Y2goZnVuY3Rpb24oZXJyb3I6P0Vycm9yKTp2b2lkIHtcbiAgICAgICAgICAgICAgICBpZiAoIWVycm9yKVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0JyxcbiAgICAgICAgdmlydHVhbENvbnNvbGVcbiAgICB9KVxuICAgIC8vIGVuZHJlZ2lvblxufSBlbHNlIHtcbiAgICBicm93c2VyQVBJID0ge2RlYnVnOiBmYWxzZSwgZG9tQ29udGVudExvYWRlZDogZmFsc2UsIG1ldGFET006IG51bGwsIHdpbmRvd31cbiAgICB3aW5kb3cuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpOnZvaWQgPT4ge1xuICAgICAgICBicm93c2VyQVBJLmRvbUNvbnRlbnRMb2FkZWQgPSB0cnVlXG4gICAgICAgIGZvciAoY29uc3QgY2FsbGJhY2s6RnVuY3Rpb24gb2Ygb25DcmVhdGVkTGlzdGVuZXIpXG4gICAgICAgICAgICBjYWxsYmFjayhicm93c2VyQVBJLCBmYWxzZSlcbiAgICB9KVxufVxuLy8gZW5kcmVnaW9uXG5leHBvcnQgZGVmYXVsdCAoY2FsbGJhY2s6RnVuY3Rpb24sIGNsZWFyOmJvb2xlYW4gPSB0cnVlKTphbnkgPT4ge1xuICAgIC8vIHJlZ2lvbiBpbml0aWFsaXplIGdsb2JhbCBjb250ZXh0XG4gICAgLypcbiAgICAgICAgTk9URTogV2UgaGF2ZSB0byBkZWZpbmUgd2luZG93IGdsb2JhbGx5IGJlZm9yZSBhbnl0aGluZyBpcyBsb2FkZWQgdG9cbiAgICAgICAgZW5zdXJlIHRoYXQgYWxsIGZ1dHVyZSBpbnN0YW5jZXMgc2hhcmUgdGhlIHNhbWUgd2luZG93IG9iamVjdC5cbiAgICAqL1xuICAgIGlmIChcbiAgICAgICAgY2xlYXIgJiYgdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgJiYgZ2xvYmFsICE9PSBicm93c2VyQVBJLndpbmRvd1xuICAgICkge1xuICAgICAgICBnbG9iYWwud2luZG93ID0gYnJvd3NlckFQSS53aW5kb3dcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gYnJvd3NlckFQSS53aW5kb3cpXG4gICAgICAgICAgICBpZiAoYnJvd3NlckFQSS53aW5kb3cuaGFzT3duUHJvcGVydHkoXG4gICAgICAgICAgICAgICAga2V5XG4gICAgICAgICAgICApICYmICFnbG9iYWwuaGFzT3duUHJvcGVydHkoa2V5KSlcbiAgICAgICAgICAgICAgICBnbG9iYWxba2V5XSA9IGJyb3dzZXJBUEkud2luZG93W2tleV1cbiAgICB9XG4gICAgLy8gZW5kcmVnaW9uXG4gICAgaWYgKHR5cGVvZiBUQVJHRVQgPT09ICd1bmRlZmluZWQnIHx8IFRBUkdFVCA9PT0gJ25vZGUnKVxuICAgICAgICByZXR1cm4gKGJyb3dzZXJBUEkpID8gY2FsbGJhY2soXG4gICAgICAgICAgICBicm93c2VyQVBJLCB0cnVlXG4gICAgICAgICkgOiBvbkNyZWF0ZWRMaXN0ZW5lci5wdXNoKGNhbGxiYWNrKVxuICAgIHJldHVybiAoYnJvd3NlckFQSS5kb21Db250ZW50TG9hZGVkKSA/IGNhbGxiYWNrKFxuICAgICAgICBicm93c2VyQVBJLCB0cnVlXG4gICAgKSA6IG9uQ3JlYXRlZExpc3RlbmVyLnB1c2goY2FsbGJhY2spXG59XG4vLyByZWdpb24gdmltIG1vZGxpbmVcbi8vIHZpbTogc2V0IHRhYnN0b3A9NCBzaGlmdHdpZHRoPTQgZXhwYW5kdGFiOlxuLy8gdmltOiBmb2xkbWV0aG9kPW1hcmtlciBmb2xkbWFya2VyPXJlZ2lvbixlbmRyZWdpb246XG4vLyBlbmRyZWdpb25cbiJdfQ==
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ }
/******/ ])
});
;