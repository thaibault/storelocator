'use strict';
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("clientnode"));
	else if(typeof define === 'function' && define.amd)
		define("storelocator", ["clientnode"], factory);
	else if(typeof exports === 'object')
		exports["storelocator"] = factory(require("clientnode"));
	else
		root['storelocator'] = factory(root["clientnode"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

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

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
// #!/usr/bin/env node
// -*- coding: utf-8 -*-
/** @module storelocator */'use strict';/* !
    region header
    [Project page](http://torben.website/storeLocator)

    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    See http://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/// region imports
exports.__esModule=true;exports.$=undefined;var _clientnode=__webpack_require__(2);function _asyncToGenerator(fn){return function(){var gen=fn.apply(this,arguments);return new Promise(function(resolve,reject){function step(key,arg){try{var info=gen[key](arg);var value=info.value}catch(error){reject(error);return}if(info.done){resolve(value)}else{return Promise.resolve(value).then(function(value){step('next',value)},function(err){step('throw',err)})}}return step('next')})}}/*
    NOTE: Bind marker clusters google instance to an empty object first to add
    the runtime evaluated instance later to.
*/var googleMarkerClusterer= false?{Class:require('googleMarkerClusterer'),google:{}// IgnoreTypeCheck
}:__webpack_require__(1);var $=exports.$=_clientnode.$;// endregion
// region types
// endregion
// region plugins/classes
/**
 * A storelocator plugin.
 * Expected store data format:
 * {latitude: NUMBER, longitude: NUMBER, markerIconFileName: STRING}
 * @property static:maps - Holds the currently used maps class.
 * @property static:_name - Defines this class name to allow retrieving them
 * after name mangling.
 * @property static:_applicationInterfaceLoad - Holds the currently promise to
 * retrieve a new maps application interface.
 * @property map - Holds the currently used map instance.
 * @property markerCluster - Holds the currently used marker cluster instance.
 * @property searchResultsStyleProperties - Dynamically computed CSS properties
 * to append to search result list (derived from search input field).
 * @property currentSearchResults - Saves last found search results.
 * @property currentSearchText - Saves last searched string.
 * @property currentSearchWords - Saves last searched words.
 * @property resultsDomNode - Saves currently opened results dom node or null
 * if no results exists yet.
 * @property currentSearchResultsDomNode - Saves current search results content
 * dom node.
 * @property currentlyOpenWindow - Saves currently opened window instance.
 * @property currentlyHighlightedMarker - Saves currently highlighted marker
 * instance.
 * @property searchResultsDirty - Indicates whether current search results
 * aren't valid anymore.
 * @property seenLocations - Saves all seen locations to recognize duplicates.
 * @property markers - Saves all recognized markers.
 * @property currentSearchResultRange - Public editable property to set current
 * search result range. This is useful for pagination implementations in
 * template level.
 * @property _options - Saves all plugin interface options.
 * @property _options.applicationInterface {Object} - To store application
 * interface options in.
 * @property _options.applicationInterface.url {string} - URL tor retrieve
 * google maps application interface.
 * @property _options.applicationInterface.callbackName {string} - Global
 * resource path to
 * callback function to trigger when google has finished loading the
 * application interface.
 * @property _options.applicationInterface.key {string} - Application interface
 * key to authenticate against google maps application interface.
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
 * result precision tolerance to identify a marker as search result.
 * @property _options.searchBox.stylePropertiesToDeriveFromInputField
 * {Array<string>} - List of cascading style properties to derive from input
 * field and use for search box.
 * @property _options.searchBox.properties {Object} - Specify which store data
 * should contain given search text.
 * @property _options.searchBox.maximumNumberOfResults {number} - Limits the
 * auto complete result list.
 * @property _options.searchBox.loadingContent {string} - Markup to display
 * while the results are loading.
 * @property _options.searchBox.generic {Object} - Specifies options for the
 * additional generic search to add to specific search results.
 * @property _options.searchBox.generic.number {Array<number, number>} - A
 * tuple describing a range of minimal to maximal limits of additional generic
 * google suggestions depending on number of local search results.
 * @property _options.searchBox.generic.maximalDistanceInMeter {number} - Range
 * to specify maximal distance from current position to search suggestions.
 * @property _options.searchBox.generic.filter {Function} - Specifies a
 * callback which gets a relevant place to decide if the place should be
 * included (returns a boolean value).
 * @property _options.searchBox.generic.prefer {boolean} - Specifies a boolean
 * value indicating if generic search results should be the first results.
 * @property _options.searchBox.generic.retrieveOptions {Object}- Specifies
 * how a generic place search should be done (google maps request object
 * specification).
 * @property _options.searchBox.content {Function|string} - Defines how to
 * render the search results. This can be a callback or a string returning or
 * representing the search results. If a function is given and a promise is
 * returned the info box will be filled with the given loading content and
 * updated with the resolved data. The function becomes search results as first
 * argument, a boolean value as second argument indicating if the maximum
 * number of search results was reached and the store locator instance itself
 * as third argument. If nothing is provided all available data will be listed
 * in a generic info window.
 * @property _options.searchBox.resultAggregation {string} - "Union" or "cut".
 * @property _options.searchBox.normalizer {Function} - Pure function to
 * normalize strings before searching against them.
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
 */class StoreLocator extends $.Tools.class{// endregion
/**
     * Entry point for object orientated plugin.
     * @param options - Options to overwrite default ones.
     * @returns Currently selected dom node.
     */// region static properties
// endregion
// region dynamic properties
initialize(options={}){var _this=this;// region properties
this.markerCluster=null;this.searchResultsStyleProperties={};this.currentSearchResults=[];this.currentSearchText=null;this.currentSearchWords=[];this.resultsDomNode=null;this.currentSearchResultsDomNode=null;this.currentlyOpenWindow=null;this.currentlyHighlightedMarker=null;this.searchResultsDirty=false;this.seenLocations=[];this.markers=[];this.currentSearchResultRange=null;this._options={applicationInterface:{url:'https://maps.googleapis.com/maps/api/js?{1}v=3&'+'sensor=false&libraries=places,geometry&callback={2}',callbackName:null,key:null},stores:{northEast:{latitude:85,longitude:180},southWest:{latitude:-85,longitude:-180},number:100,generateProperties:function generateProperties(store){return store}},addtionalStoreProperties:{},iconPath:'',defaultMarkerIconFileName:null,startLocation:null,fallbackLocation:{latitude:51.124213,longitude:10.147705},ip:null,ipToLocation:{applicationInterfaceURL:'{1}://freegeoip.net/json/{2}',timeoutInMilliseconds:5000,bounds:{northEast:{latitude:85,longitude:180},southWest:{latitude:-85,longitude:-180}}},limit:{zoom:{minimum:1,maximum:9999},bounds:{northEast:{latitude:85,longitude:180},southWest:{latitude:-85,longitude:-180}}},map:{zoom:3,disableDefaultUI:true,zoomControl:true,streetViewControl:true},showInputAfterLoadedDelayInMilliseconds:500,input:{hide:{opacity:0},showAnimation:[{opacity:1},{duration:'fast'}]},distanceToMoveByDuplicatedEntries:0.0001,marker:{cluster:{gridSize:100,maxZoom:11,imagePath:'https://cdn.rawgit.com/googlemaps/'+'js-marker-clusterer/gh-pages/images/m'},icon:{size:{width:44,height:49,unit:'px'},scaledSize:{width:44,height:49,unit:'px'}}},successfulSearchZoom:12,infoWindow:{content:null,additionalMoveToBottomInPixel:120,loadingContent:'<div class="idle">loading...</div>'},searchBox:50,onInfoWindowOpen:this.constructor.noop,onInfoWindowOpened:this.constructor.noop,onAddSearchResults:this.constructor.noop,onRemoveSearchResults:this.constructor.noop,onOpenSearchResults:this.constructor.noop,onCloseSearchResults:this.constructor.noop,onMarkerHighlighted:this.constructor.noop};// endregion
// Merges given options with default options recursively.
super.initialize(options);this.defaultSearchBoxOptions={generic:{number:[2,5],maximalDistanceInMeter:1000000,filter:function filter(place){return place.formatted_address.indexOf(' Deutschland')!==-1||place.formatted_address.indexOf(' Germany')!==-1},prefer:true,retrieveOptions:{radius:'50000'}},properties:['eMailAddress','eMail','email','formattedAddress','formatted_address','address','name','street','streetAndStreetnumber','zip','zipCode','postalCode'],maximumNumberOfResults:50,loadingContent:this._options.infoWindow.loadingContent,noResultsContent:'<div class="no-results">No results found</div>',resultAggregation:'cut',stylePropertiesToDeriveFromInputField:['top','left','right','position','backgroundColor','paddingBottom','paddingLeft','paddingRight','paddingTop','minWidth','maxWidth','width'],normalizer:function normalizer(value){return`${value}`.toLowerCase().replace(/[-_]+/g,'').replace(/ß/g,'ss').replace(/(^| )str\./g,'$1strasse').replace(/[& ]+/g,' ')}};this.$domNode.find('input').css(this._options.input.hide);var loadInitialized=true;if(typeof this.constructor._applicationInterfaceLoad!=='object'){loadInitialized=false;this.constructor._applicationInterfaceLoad=$.Deferred()}var result=this.constructor._applicationInterfaceLoad.then(this.getMethod(this.bootstrap)).done(function(){return _this.fireEvent('loaded')});if('google'in $.global&&'maps'in $.global.google){this.constructor.google=$.global.google;if(this.constructor._applicationInterfaceLoad.state()!=='resolved')this.constructor.timeout(function(){return _this.constructor._applicationInterfaceLoad.resolve(_this.$domNode)})}else if(!loadInitialized){var callbackName=void 0;if(this._options.applicationInterface.callbackName)callbackName=this._options.applicationInterface.callbackName;else callbackName=this.constructor.determineUniqueScopeName();$.global[callbackName]=function(){_this.constructor.google=$.global.google;_this.constructor._applicationInterfaceLoad.resolve(_this.$domNode)};$.getScript(this.constructor.stringFormat(this._options.applicationInterface.url,this._options.applicationInterface.key?`key=${this._options.applicationInterface.key}&`:'',`window.${callbackName}`)).catch(function(response,error){return _this.constructor._applicationInterfaceLoad.reject(error)})}return result}/**
     * Determines useful location cluster, info windows and marker.
     * @returns The current instance.
     */bootstrap(){var _this2=this;if(this._options.startLocation)return this.initializeMap();this._options.startLocation=this._options.fallbackLocation;/*
            NOTE: If request is slower than the timeout parameter for jsonp
            request the padding function isn't set anymore so an error
            occurs. That's why we use our own timeout implementation.
        */var loaded=false;var $deferred=$.Deferred();var fallbackTimeout=this.constructor.timeout(function(){loaded=true;_this2.initializeMap().then(function(){return $deferred.resolve(_this2.$domNode)})},this._options.ipToLocation.timeoutInMilliseconds);$.ajax({url:this.constructor.stringFormat(this._options.ipToLocation.applicationInterfaceURL,$.global.location.protocol.substring(0,$.global.location.protocol.length-1),this._options.ip||''),dataType:'jsonp',cache:true}).always(function(currentLocation,textStatus){if(!loaded){fallbackTimeout.clear();loaded=true;if(textStatus==='success')/*
                        Check if determined location is within defined
                        bounds.
                    */if(!_this2._options.ipToLocation.bounds||new _this2.constructor.google.maps.LatLngBounds(new _this2.constructor.google.maps.LatLng(_this2._options.ipToLocation.bounds.southWest.latitude,_this2._options.ipToLocation.bounds.southWest.longitude),new _this2.constructor.google.maps.LatLng(_this2._options.ipToLocation.bounds.northEast.latitude,_this2._options.ipToLocation.bounds.northEast.longitude)).contains(new _this2.constructor.google.maps.LatLng(currentLocation.latitude,currentLocation.longitude)))_this2._options.startLocation=currentLocation;_this2.initializeMap().then(function(){return $deferred.resolve(_this2.$domNode)})}});return $deferred}/**
     * Initializes cluster, info windows and marker.
     * @returns The current instance.
     */initializeMap(){var _this3=this;this._options.map.center=new this.constructor.google.maps.LatLng(this._options.startLocation.latitude,this._options.startLocation.longitude);this.map=new this.constructor.google.maps.Map($('<div>').appendTo(this.$domNode.css('display','block'))[0],this._options.map);if(this._options.limit.bounds)this.constructor.google.maps.event.addListener(this.map,'dragend',function(){var limitBounds=new _this3.constructor.google.maps.LatLngBounds(new _this3.constructor.google.maps.LatLng(_this3._options.limit.bounds.southWest.latitude,_this3._options.limit.bounds.southWest.longitude),new _this3.constructor.google.maps.LatLng(_this3._options.limit.bounds.northEast.latitude,_this3._options.limit.bounds.northEast.longitude));var currentCenter=_this3.map.getCenter();if(!limitBounds.contains(currentCenter)){var newCenter={latitude:currentCenter.lat(),longitude:currentCenter.lng()};if(currentCenter.lng()<limitBounds.getSouthWest().lng())newCenter.longitude=limitBounds.getSouthWest().lng();if(currentCenter.lng()>limitBounds.getNorthEast().lng())newCenter.longitude=limitBounds.getNorthEast().lng();if(currentCenter.lat()<limitBounds.getSouthWest().lat())newCenter.latitude=limitBounds.getSouthWest().lat();if(currentCenter.lat()>limitBounds.getNorthEast().lat())newCenter.latitude=limitBounds.getNorthEast().lat();_this3.map.panTo(new _this3.constructor.google.maps.LatLng(newCenter.latitude,newCenter.longitude))}});if(this._options.limit.zoom)this.constructor.google.maps.event.addListener(this.map,'zoom_changed',function(){if(_this3.map.getZoom()<_this3._options.limit.zoom.minimum)_this3.map.setZoom(_this3._options.limit.zoom.minimum);else if(_this3.map.getZoom()>_this3._options.limit.zoom.maximum)_this3.map.setZoom(_this3._options.limit.zoom.maximum)});if(this._options.marker.cluster){this.constructor.extendObject(googleMarkerClusterer.google,this.constructor.google);this.markerCluster=new googleMarkerClusterer.Class(this.map,[],this._options.marker.cluster);this.resetMarkerCluster=function(){var markers=[];for(var marker of _this3.markers){marker.nativeMarker.setMap(null);delete marker.nativeMarker;marker.nativeMarker=new _this3.constructor.google.maps.Marker(marker);_this3.attachMarkerEventListener(marker);markers.push(marker.nativeMarker)}if(_this3.markerCluster){_this3.markerCluster.clearMarkers();_this3.markerCluster=new googleMarkerClusterer.Class(_this3.map,markers,_this3._options.marker.cluster)}}}// Add a marker for each retrieved store.
var $addMarkerDeferred=$.Deferred();if(Array.isArray(this._options.stores))for(var store of this._options.stores){this.constructor.extendObject(true,store,this._options.addtionalStoreProperties);var marker=this.createMarker(store);if(this.markerCluster)this.markerCluster.addMarker(marker);$addMarkerDeferred.resolve(this.markers)}else if(this.constructor.determineType(this._options.stores)==='string')$.getJSON(this._options.stores,function(stores){for(var _store of stores){_this3.constructor.extendObject(true,_store,_this3._options.addtionalStoreProperties);var _marker=_this3.createMarker(_store);if(_this3.markerCluster)_this3.markerCluster.addMarker(_marker)}$addMarkerDeferred.resolve(_this3.markers)});else{var southWest=new this.constructor.google.maps.LatLng(this._options.stores.southWest.latitude,this._options.stores.southWest.longitude);var northEast=new this.constructor.google.maps.LatLng(this._options.stores.northEast.latitude,this._options.stores.northEast.longitude);for(var index=0;index<this._options.stores.number;index++){var _store2=this.constructor.extendObject({latitude:southWest.lat()+(northEast.lat()-southWest.lat())*Math.random(),longitude:southWest.lng()+(northEast.lng()-southWest.lng())*Math.random()},this._options.addtionalStoreProperties);var _marker2=this.createMarker(this.constructor.extendObject(_store2,this._options.stores.generateProperties(_store2)));if(this.markerCluster)this.markerCluster.addMarker(_marker2)}$addMarkerDeferred.resolve(this.markers)}// Create the search box and link it to the UI element.
this.map.controls[this.constructor.google.maps.ControlPosition.TOP_LEFT].push(this.$domNode.find('input')[0]);if(this.constructor.determineType(this._options.searchBox)==='number')this.initializeGenericSearchBox();else{this.constructor.google.maps.event.addListener(this.map,'click',function(){return _this3.closeSearchResults()});this.constructor.google.maps.event.addListener(this.map,'dragstart',function(){return _this3.closeSearchResults()});this._options.searchBox=this.constructor.extendObject(true,this.defaultSearchBoxOptions,this._options.searchBox);this.initializeDataSourceSearchBox()}// Close marker if zoom level is bigger than the aggregation.
this.constructor.google.maps.event.addListener(this.map,'zoom_changed',function(){if(typeof _this3.currentlyOpenWindow==='object'&&_this3.currentlyOpenWindow&&_this3.currentlyOpenWindow.isOpen&&_this3.map.getZoom()<=_this3._options.marker.cluster.maxZoom){_this3.currentlyOpenWindow.isOpen=false;_this3.currentlyOpenWindow.close()}});var $mapLoadedDeferred=$.Deferred();this.constructor.google.maps.event.addListenerOnce(this.map,'idle',function(){return $addMarkerDeferred.then(function(){return $mapLoadedDeferred.resolve(_this3.$domNode)})});return $mapLoadedDeferred}/**
     * Position search results right below the search input field.
     * @returns The current instance.
     */initializeDataSourceSearchResultsBox(){this.searchResultsStyleProperties={};var allStyleProperties=this.$domNode.find('input').Tools('style');for(var propertyName in allStyleProperties){if(this._options.searchBox.stylePropertiesToDeriveFromInputField.includes(propertyName))this.searchResultsStyleProperties[propertyName]=allStyleProperties[propertyName]}this.searchResultsStyleProperties.marginTop=this.$domNode.find('input').outerHeight(true);// Prepare search result positioning.
this.resultsDomNode=$('<div>').addClass(this.constructor.stringCamelCaseToDelimited(`${this.constructor._name}SearchResults`)).css(this.searchResultsStyleProperties);// Inject the final search results into the dom tree.
this.$domNode.find('input').after(this.resultsDomNode);return this}/**
     * Initializes a data source based search box to open and focus them
     * matching marker.
     * @returns The current instance.
     */initializeDataSourceSearchBox(){var _this4=this;this.on(this.$domNode,'keydown',function(event){/*
                NOTE: Events that doesn't occurs in search context are handled
                by the native map implementation and won't be propagated so we
                doesn't have to care about that.
            */if(_this4.currentSearchResults.length){if(_this4.currentSearchResultRange)_this4.currentSearchResultRange=[Math.max(0,_this4.currentSearchResultRange[0]),Math.min(_this4.currentSearchResults.length-1,// IgnoreTypeCheck
_this4.currentSearchResultRange[1])];else _this4.currentSearchResultRange=[0,_this4.currentSearchResults.length-1];var currentIndex=-1;if(_this4.currentlyHighlightedMarker)currentIndex=_this4.currentSearchResults.indexOf(_this4.currentlyHighlightedMarker);if(event.keyCode===_this4.constructor.keyCode.DOWN){if(currentIndex===-1||_this4.currentSearchResultRange[1]<currentIndex+1)_this4.highlightMarker(_this4.currentSearchResults[_this4.currentSearchResultRange[0]],event);else _this4.highlightMarker(_this4.currentSearchResults[currentIndex+1],event);}else if(event.keyCode===_this4.constructor.keyCode.UP){if([_this4.currentSearchResultRange[0],-1].includes(currentIndex))_this4.highlightMarker(_this4.currentSearchResults[// IgnoreTypeCheck
_this4.currentSearchResultRange[1]],event);else _this4.highlightMarker(_this4.currentSearchResults[currentIndex-1],event);}else if(event.keyCode===_this4.constructor.keyCode.ENTER&&_this4.currentlyHighlightedMarker){event.stopPropagation();if(_this4.currentlyHighlightedMarker)if(_this4.currentlyHighlightedMarker.infoWindow)_this4.openMarker(event,_this4.currentlyHighlightedMarker);else _this4.openPlace(_this4.currentlyHighlightedMarker.data,event)}}});this.on(this.$domNode.find('input'),'focus',function(){if(_this4.currentSearchText)_this4.openSearchResults()});this.on(this.$domNode.find('input'),'keydown',function(event){if(_this4.constructor.keyCode.DOWN===event.keyCode&&_this4.currentSearchText)_this4.openSearchResults()});this.on(this.$domNode.find('input'),'click',function(){if(_this4.currentSearchText)_this4.openSearchResults()});this.constructor.google.maps.event.addListener(this.map,'center_changed',function(){// NOTE: Search results depends on current position.
if(_this4.currentSearchText&&_this4.resultsDomNode)_this4.searchResultsDirty=true});this.on(this.$domNode.find('input'),'keyup',this.updateSearchResultsHandler);return this}/**
     * Triggers on each search request.
     * @returns The current instance.
     */get updateSearchResultsHandler(){var _this5=this;var placesService=new this.constructor.google.maps.places.PlacesService(this.map);return this.constructor.debounce(function(){var _ref=_asyncToGenerator(function*(event){for(var name in _this5.constructor.keyCode){if(event&&event.keyCode===_this5.constructor.keyCode[name]&&!['DELETE','BACKSPACE','COMMA','PERIOD','NUMPAD_ADD','NUMPAD_DECIMAL','NUMPAD_DIVIDE','NUMPAD_MULTIPLY','NUMPAD_SUBTRACT'].includes(name))return}yield _this5.acquireLock(`${_this5.constructor._name}Search`);var searchText=_this5._options.searchBox.normalizer(_this5.$domNode.find('input').val());if(_this5.currentSearchText===searchText&&!_this5.searchResultsDirty)return _this5.releaseLock(`${_this5.constructor._name}Search`);_this5.searchResultsDirty=false;if(!_this5.resultsDomNode)_this5.initializeDataSourceSearchResultsBox();if(!searchText&&_this5.resultsDomNode){_this5.currentSearchResults=[];_this5.currentSearchText='';_this5.resultsDomNode.html('');_this5.fireEvent('removeSearchResults',false,_this5,_this5.currentSearchResultsDomNode);_this5.currentSearchResultsDomNode=null;_this5.closeSearchResults();return _this5.releaseLock(`${_this5.constructor._name}Search`)}_this5.openSearchResults();var loadingDomNode=$(_this5._options.searchBox.loadingContent);if(_this5.resultsDomNode&&_this5.fireEvent('addSearchResults',false,_this5,loadingDomNode,_this5.resultsDomNode,_this5.currentSearchResultsDomNode||[]))_this5.resultsDomNode.html(loadingDomNode);if(_this5.currentSearchResultsDomNode&&_this5.currentSearchResultsDomNode.length)_this5.fireEvent('removeSearchResults',false,_this5,_this5.currentSearchResultsDomNode);_this5.currentSearchResultsDomNode=loadingDomNode;if(_this5._options.searchBox.generic.number)/*
                    NOTE: Google searches for more items than exists in the
                    specified radius. However the radius is a string in the
                    examples provided by google.
                */placesService.textSearch(_this5.constructor.extendObject({query:searchText,location:_this5.map.getCenter()},_this5._options.searchBox.generic.retrieveOptions),function(places){if(places)_this5.handleGenericSearchResults(places,searchText)});else _this5.performLocalSearch(searchText)});return function(_x){return _ref.apply(this,arguments)}}(),1000)}/**
     * Sorts and filters search results given by google's aplication
     * interface.
     * @param places - List of place objects.
     * @param searchText - Words which should occur in requested search
     * results.
     * @returns Returns current instance.
     */handleGenericSearchResults(places,searchText){var _this6=this;var searchResults=[];/*
            NOTE: Since google text search doesn't support sorting by distance
            we have to sort by our own.
        */var index=1;var _loop=function _loop(place){index+=1;var distance=_this6.constructor.google.maps.geometry.spherical.computeDistanceBetween(_this6.map.getCenter(),place.geometry.location);if(distance>_this6._options.searchBox.generic.maximalDistanceInMeter)return'break';if(_this6._options.searchBox.generic.filter(place)){var result={data:_this6.constructor.extendObject(place,{logoFilePath:place.icon.replace(/^http:(\/\/)/,`${$.global.location.protocol}$1`),address:place.formatted_address,distance:distance}),position:place.geometry.location,open:function open(event){return _this6.openPlace(place,event)},highlight:function highlight(event,type){_this6.isHighlighted=type!=='stop'}};searchResults.push(result);if(_this6._options.searchBox.generic.number[1]<index)return'break'}};for(var place of places.sort(function(firstPlace,secondPlace){return _this6.constructor.google.maps.geometry.spherical.computeDistanceBetween(_this6.map.getCenter(),firstPlace.geometry.location)-_this6.constructor.google.maps.geometry.spherical.computeDistanceBetween(_this6.map.getCenter(),secondPlace.geometry.location)})){var _ret=_loop(place);if(_ret==='break')break}return this.performLocalSearch(searchText,searchResults)}/**
     * Performs a search on locally given store data.
     * @param searchText - Text to search for.
     * @param searchResults - A list if generic search results.
     * @returns The current instance.
     */performLocalSearch(searchText,searchResults=[]){var _this7=this;var numberOfGenericSearchResults=searchResults.length;this.currentSearchWords=searchText.split(' ');var _loop2=function _loop2(marker){marker.foundWords=[];for(var key of _this7._options.searchBox.hasOwnProperty('properties')&&_this7._options.searchBox.properties||Object.keys(marker.data)){for(var searchWord of _this7.currentSearchWords.concat(_this7.currentSearchWords.join(' '))){if(!marker.foundWords.includes(searchWord)&&(marker.data[key]||marker.data[key]===0)&&_this7._options.searchBox.normalizer(marker.data[key]).includes(searchWord)){marker.foundWords.push(searchWord);if(marker.foundWords.length===1){marker.open=function(event){return _this7.openMarker(event,marker)};marker.highlight=function(event,type){return _this7.highlightMarker(marker,event,type)};if(_this7._options.searchBox.resultAggregation==='union')searchResults.push(marker)}if(marker.foundWords.length===_this7.currentSearchWords.length&&_this7._options.searchBox.resultAggregation==='cut')searchResults.push(marker)}}}};for(var marker of this.markers){_loop2(marker)}/*
            Remove generic place results if there are enough local search
            results.
        */if(this._options.searchBox.generic.number&&searchResults.length&&numberOfGenericSearchResults>this._options.searchBox.generic.number[0]&&searchResults.length>this._options.searchBox.generic.number[1])searchResults.splice(this._options.searchBox.generic.number[0],numberOfGenericSearchResults-this._options.searchBox.generic.number[0]);/*
            Sort results by current map center form nearer to more fare away
            results.
        */searchResults.sort(function(first,second){if(_this7._options.searchBox.generic.prefer&&!first.infoWindow&&second.infoWindow)return-1;if(_this7._options.searchBox.generic.prefer&&!second.infoWindow&&first.infoWindow)return 1;if(first.foundWords.length<second.foundWords.length)return 1;if(second.foundWords.length<first.foundWords.length)return-1;return _this7.constructor.google.maps.geometry.spherical.computeDistanceBetween(_this7.map.getCenter(),first.position)-_this7.constructor.google.maps.geometry.spherical.computeDistanceBetween(_this7.map.getCenter(),second.position)});// Slice additional unneeded local search results.
var limitReached=false;if(this._options.searchBox.maximumNumberOfResults<searchResults.length){limitReached=true;searchResults.splice(this._options.searchBox.maximumNumberOfResults,searchResults.length)}// Compile search results markup.
var resultsRepresentation=this.makeSearchResults(searchResults,limitReached);if(this.constructor.determineType(resultsRepresentation)==='string'){var resultsRepresentationDomNode=$(resultsRepresentation);if(this.resultsDomNode&&this.fireEvent('addSearchResults',false,this,resultsRepresentationDomNode,this.resultsDomNode,this.currentSearchResultsDomNode||[]))this.resultsDomNode.html(resultsRepresentationDomNode);if(this.currentSearchResultsDomNode&&this.currentSearchResultsDomNode.length)this.fireEvent('removeSearchResults',false,this,this.currentSearchResultsDomNode);this.currentSearchResultsDomNode=resultsRepresentationDomNode;this.constructor.timeout(function(){return _this7.releaseLock(`${_this7.constructor._name}Search`)})}else if(resultsRepresentation instanceof Object)resultsRepresentation.then(function(resultsRepresentation){var resultsRepresentationDomNode=$(resultsRepresentation);if(_this7.resultsDomNode&&_this7.fireEvent('addSearchResults',false,_this7,resultsRepresentationDomNode,_this7.resultsDomNode,_this7.currentSearchResultsDomNode||[]))_this7.resultsDomNode.html(resultsRepresentationDomNode);if(_this7.currentSearchResultsDomNode&&_this7.currentSearchResultsDomNode.length)_this7.fireEvent('removeSearchResults',false,_this7,_this7.currentSearchResultsDomNode);_this7.currentSearchResultsDomNode=resultsRepresentationDomNode;_this7.releaseLock(`${_this7.constructor._name}Search`)});this.currentSearchText=searchText;this.currentSearchResults=searchResults.slice();return this}/**
     * Opens current search results.
     * @param event - Object with meta data for current event which has
     * triggered to show search results.
     * @returns The current instance.
     */openSearchResults(event){if(event)event.stopPropagation();if(this.resultsDomNode&&!this.resultsDomNode.hasClass('open')&&this.fireEvent('openSearchResults',false,this,event,this.resultsDomNode)){for(var propertyName in this.searchResultsStyleProperties){if(this.searchResultsStyleProperties.hasOwnProperty(propertyName))// IgnoreTypeCheck
this.resultsDomNode.css(propertyName,this.searchResultsStyleProperties[propertyName])}this.resultsDomNode.addClass('open')}return this}/**
     * Closes current search results.
     * @param event - Object with meta data for current event which has
     * triggered to close search results.
     * @returns The current instance.
     */closeSearchResults(event=null){if(event)event.stopPropagation();if(this.resultsDomNode&&this.resultsDomNode.hasClass('open')&&this.fireEvent('closeSearchResults',false,this,event,this.resultsDomNode)){for(var propertyName in this.searchResultsStyleProperties){if(this.searchResultsStyleProperties.hasOwnProperty(propertyName))// IgnoreTypeCheck
this.resultsDomNode.css(propertyName,'')}this.resultsDomNode.removeClass('open')}return this}/**
     * Initializes googles generic search box and tries to match to open and
     * focus them.
     * @returns The current instance.
     */initializeGenericSearchBox(){var _this8=this;var searchBox=new this.constructor.google.maps.places.SearchBox(this.$domNode.find('input')[0]);/*
            Bias the search box results towards places that are within the
            bounds of the current map's viewport.
        */this.constructor.google.maps.event.addListener(this.map,'bounds_changed',function(){return searchBox.setBounds(_this8.map.getBounds())});/*
            Listen for the event fired when the user selects an item from the
            pick list. Retrieve the matching places for that item.
        */this.constructor.google.maps.event.addListener(searchBox,'places_changed',function(){return _this8.ensurePlaceLocations(searchBox.getPlaces()).then(function(places){var foundPlace=_this8.determineBestSearchResult(places);if(foundPlace){var shortestDistanceInMeter=Number.MAX_VALUE;var matchingMarker=null;for(var marker of _this8.markers){var distanceInMeter=_this8.constructor.google.maps.geometry.spherical.computeDistanceBetween(foundPlace.geometry.location,marker.position);if(distanceInMeter<shortestDistanceInMeter){shortestDistanceInMeter=distanceInMeter;matchingMarker=marker}}if(matchingMarker&&shortestDistanceInMeter<=_this8._options.searchBox){if(_this8._options.successfulSearchZoom)_this8.map.setZoom(_this8._options.successfulSearchZoom);_this8.openMarker(null,matchingMarker);return places}if(_this8.currentlyOpenWindow){_this8.currentlyOpenWindow.isOpen=false;_this8.currentlyOpenWindow.close()}_this8.map.setCenter(foundPlace.geometry.location);if(_this8._options.successfulSearchZoom)_this8.map.setZoom(_this8._options.successfulSearchZoom)}return places})});return this}/**
     * Ensures that every given place have a location property.
     * @param places - Places to check for.
     * @returns A promise which will be resolved if all places are ensured.
     */ensurePlaceLocations(places){var _this9=this;var result=$.Deferred();var runningGeocodes=0;var geocoder=new this.constructor.google.maps.Geocoder;var _loop3=function _loop3(place){if(!('geometry'in place&&'location'in place.geometry)){_this9.warn('Found place "{1}" doesn\'t have a location. Full object:',place.name);_this9.warn(place);_this9.info('Geocode will be determined separately. With address '+'"{1}".',place.name);runningGeocodes+=1;/* eslint-disable no-loop-func */geocoder.geocode({address:place.name},function(results,status){runningGeocodes-=1;if(status===_this9.constructor.google.maps.GeocoderStatus.OK)place.geometry=results[0].geometry;else{delete places[places.indexOf(place)];_this9.warn('Found place "{1}" couldn\'t be geocoded by '+'google. Removing it from the places list.',place.name)}if(runningGeocodes===0)result.resolve(places)});/* eslint-enable no-loop-func */}};for(var place of places){_loop3(place)}if(runningGeocodes===0)result.resolve(places);return result}/**
     * Determines the best search result from given list of candidates.
     * Currently the nearest result to current viewport will be preferred.
     * @param candidates - List of search results to determine best from.
     * @returns The determined best result.
     */determineBestSearchResult(candidates){var result=null;if(candidates.length){var shortestDistanceInMeter=Number.MAX_VALUE;for(var candidate of candidates){var distanceInMeter=this.constructor.google.maps.geometry.spherical.computeDistanceBetween(candidate.geometry.location,this.map.getCenter());if(distanceInMeter<shortestDistanceInMeter){result=candidate;shortestDistanceInMeter=distanceInMeter}}}return result}/**
     * Is triggered if the complete map ist loaded.
     * @returns The current instance.
     */onLoaded(){var _this10=this;this.constructor.timeout(function(){return _this10.$domNode.find('input').animate(..._this10._options.input.showAnimation)},this._options.showInputAfterLoadedDelayInMilliseconds);return this}/**
     * Registers given store to the google maps canvas.
     * @param store - Store object to create a marker for.
     * @returns The created marker.
     */createMarker(store){var index=0;while(this.seenLocations.includes(`${store.latitude}-${store.longitude}`)){if(index%2)store.latitude+=this._options.distanceToMoveByDuplicatedEntries;else store.longitude+=this._options.distanceToMoveByDuplicatedEntries;index+=1}this.seenLocations.push(`${store.latitude}-${store.longitude}`);var marker={position:new this.constructor.google.maps.LatLng(store.latitude,store.longitude),map:this.map,data:store};if(store.markerIconFileName||this._options.defaultMarkerIconFileName){marker.icon=this.constructor.extendObject({},this._options.marker.icon);if(marker.icon.size)marker.icon.size=new this.constructor.google.maps.Size(marker.icon.size.width,marker.icon.size.height,marker.icon.size.unit,marker.icon.size.unit);if(marker.icon.scaledSize)marker.icon.scaledSize=new this.constructor.google.maps.Size(marker.icon.scaledSize.width,marker.icon.scaledSize.height,marker.icon.scaledSize.unit,marker.icon.scaledSize.unit);if(store.markerIconFileName)marker.icon.url=this._options.iconPath+store.markerIconFileName;else marker.icon.url=this._options.iconPath+this._options.defaultMarkerIconFileName}if(store.title)marker.title=store.title;marker.infoWindow=new this.constructor.google.maps.InfoWindow({content:''});marker.infoWindow.isOpen=false;marker.nativeMarker=new this.constructor.google.maps.Marker(marker);this.attachMarkerEventListener(marker);this.markers.push(marker);return marker.nativeMarker}/**
     * Adds needed event listener to given marker.
     * @param marker - Marker to attach event listener to.
     * @returns The current instance.
     */attachMarkerEventListener(marker){this.constructor.google.maps.event.addListener(marker.infoWindow,'closeclick',function(){marker.infoWindow.isOpen=false});this.constructor.google.maps.event.addListener(marker.nativeMarker,'click',this.getMethod('openMarker',this,marker));return this}/**
     * Opens given marker info window. And closes potentially opened windows.
     * @param event - Event which has triggered the marker opening call.
     * @param marker - Marker to open.
     * @returns The current instance.
     */openMarker(event,marker){if(event&&!('stopPropagation'in event))event=null;this.highlightMarker(marker,event,'stop');/*
            We have to ensure that the minimum zoom level has one more then
            the clustering can appear. Since a cluster hides an open window.
        */if('cluster'in this._options.marker&&this._options.marker.cluster.maxZoom&&this.map.getZoom()<=this._options.marker.cluster.maxZoom)this.map.setZoom(this._options.marker.cluster.maxZoom+1);this.closeSearchResults(event);if(this.currentlyOpenWindow&&this.currentlyOpenWindow===marker.infoWindow&&this.currentlyOpenWindow.isOpen)return this;this.fireEvent('infoWindowOpen',event,marker);marker.refreshSize=function(){return(// Simulates a content update to enforce info box size adjusting.
marker.infoWindow.setContent(marker.infoWindow.getContent()))};var infoWindow=this.makeInfoWindow(marker);if(typeof infoWindow==='string')marker.infoWindow.setContent(infoWindow);else{marker.infoWindow.setContent(this._options.infoWindow.loadingContent);infoWindow.then(function(infoWindow){return marker.infoWindow.setContent(infoWindow)})}if(this.currentlyOpenWindow){this.currentlyOpenWindow.isOpen=false;this.currentlyOpenWindow.close()}this.currentlyOpenWindow=marker.infoWindow;marker.infoWindow.isOpen=true;marker.infoWindow.open(this.map,marker.nativeMarker);this.map.panTo(marker.nativeMarker.position);this.map.panBy(0,-this._options.infoWindow.additionalMoveToBottomInPixel);this.fireEvent('infoWindowOpened',event,marker);return this}/**
     * Focuses given place on map.
     * @param place - Place to open.
     * @param event - Event object which has triggered requested place opening.
     * @returns The current instance.
     */openPlace(place,event){if(event)event.stopPropagation();this.closeSearchResults(event);if(this.currentlyOpenWindow){this.currentlyOpenWindow.isOpen=false;this.currentlyOpenWindow.close()}this.map.setCenter(place.geometry.location);this.map.setZoom(this._options.successfulSearchZoom);return this}/**
     * Opens given marker info window. And closes a potential opened windows.
     * @param marker - Marker to Highlight.
     * @param event - Event object for corresponding event that has the
     * highlighting requested.
     * @param type - Type of highlighting.
     * @returns The current instance.
     */highlightMarker(marker,event,type='bounce'){if(event)event.stopPropagation();if(this.currentlyHighlightedMarker){if('nativeMarker'in this.currentlyHighlightedMarker)this.currentlyHighlightedMarker.nativeMarker.setAnimation(null);this.currentlyHighlightedMarker.isHighlighted=false;this.currentlyHighlightedMarker=null}if('nativeMarker'in marker)if(type==='stop')marker.nativeMarker.setAnimation(null);else{/*
                    We have to ensure that the minimum zoom level has one more
                    then the clustering can appear. Since a cluster hides an
                    open window.
                */if('cluster'in this._options.marker&&this._options.marker.cluster.maxZoom&&this.map.getZoom()<=this._options.marker.cluster.maxZoom&&'position'in marker.nativeMarker&&this.map.getBounds().contains(marker.nativeMarker.position)){this.map.setCenter(marker.nativeMarker.position);this.map.setZoom(this._options.marker.cluster.maxZoom+1)}if(marker!==this.currentlyHighlightedMarker&&marker.nativeMarker){marker.nativeMarker.setAnimation(this.constructor.google.maps.Animation[type.toUpperCase()]);marker.isHighlighted=true;this.currentlyHighlightedMarker=marker}this.fireEvent('markerHighlighted',marker)}return this}/**
     * Takes the marker for a store and creates the HTML content of the info
     * window.
     * @param marker - Marker to generate info window for.
     * @param additionalParameter - Additional parameter to forward to options
     * given render callback.
     * @returns Info window markup.
     */makeInfoWindow(marker,...additionalParameter){if('content'in this._options.infoWindow){if(this.constructor.isFunction(this._options.infoWindow.content))return this._options.infoWindow.content(marker,...additionalParameter);if(this._options.infoWindow.content)return this._options.infoWindow.content}var content='<div>';for(var name in marker.data){if(marker.data.hasOwnProperty(name))content+=`${name}: ${marker.data[name]}<br />`}return`${content}</div>`}/**
     * Takes the search results and creates the HTML content of the search
     * results.
     * @param searchResults - Search result to generate markup for.
     * @param limitReached - Indicated weather defined limit was reached or
     * not.
     * @returns Generated markup.
     */makeSearchResults(searchResults,limitReached){if('content'in this._options.searchBox){if(this.constructor.isFunction(this._options.searchBox.content))return this._options.searchBox.content.call(this,searchResults,limitReached);return this._options.searchBox.content}if(searchResults.length){var content='';for(var result of searchResults){content+='<div>';for(var name in result.data){if(result.data.hasOwnProperty(name)&&(this._options.searchBox.properties.length===0||this._options.searchBox.properties.includes(name)))content+=`${name}: `+this.constructor.stringMark(`${result.data[name]}`,this.currentSearchWords,'<span class="tools-mark">{1}</span>',this._options.searchBox.normalizer)+'<br />'}content+='</div>'}return content}return this._options.searchBox.noResultsContent}}exports.default=StoreLocator;// endregion
StoreLocator._name='StoreLocator';$.fn.StoreLocator=function(...parameter){return $.Tools().controller(StoreLocator,parameter,this)};// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion

/***/ },
/* 1 */
/***/ function(module, exports) {

/*** IMPORTS FROM imports-loader ***/
var google = {};

// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @externs_url http://closure-compiler.googlecode.com/svn/trunk/contrib/externs/maps/google_maps_api_v3_3.js
// ==/ClosureCompiler==

/**
 * @name MarkerClusterer for Google Maps v3
 * @version version 1.0
 * @author Luke Mahe
 * @fileoverview
 * The library creates and manages per-zoom-level clusters for large amounts of
 * markers.
 * <br/>
 * This is a v3 implementation of the
 * <a href="http://gmaps-utility-library-dev.googlecode.com/svn/tags/markerclusterer/"
 * >v2 MarkerClusterer</a>.
 */

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * A Marker Clusterer that clusters markers.
 *
 * @param {google.maps.Map} map The Google map to attach to.
 * @param {Array.<google.maps.Marker>=} opt_markers Optional markers to add to
 *   the cluster.
 * @param {Object=} opt_options support the following options:
 *     'gridSize': (number) The grid size of a cluster in pixels.
 *     'maxZoom': (number) The maximum zoom level that a marker can be part of a
 *                cluster.
 *     'zoomOnClick': (boolean) Whether the default behaviour of clicking on a
 *                    cluster is to zoom into it.
 *     'averageCenter': (boolean) Wether the center of each cluster should be
 *                      the average of all markers in the cluster.
 *     'minimumClusterSize': (number) The minimum number of markers to be in a
 *                           cluster before the markers are hidden and a count
 *                           is shown.
 *     'styles': (object) An object that has style properties:
 *       'url': (string) The image url.
 *       'height': (number) The image height.
 *       'width': (number) The image width.
 *       'anchor': (Array) The anchor position of the label text.
 *       'textColor': (string) The text color.
 *       'textSize': (number) The text size.
 *       'backgroundPosition': (string) The position of the backgound x, y.
 *       'iconAnchor': (Array) The anchor position of the icon x, y.
 * @constructor
 * @extends google.maps.OverlayView
 */
function MarkerClusterer(map, opt_markers, opt_options) {
  // MarkerClusterer implements google.maps.OverlayView interface. We use the
  // extend function to extend MarkerClusterer with google.maps.OverlayView
  // because it might not always be available when the code is defined so we
  // look for it at the last possible moment. If it doesn't exist now then
  // there is no point going ahead :)
  this.extend(MarkerClusterer, google.maps.OverlayView);
  this.map_ = map;

  /**
   * @type {Array.<google.maps.Marker>}
   * @private
   */
  this.markers_ = [];

  /**
   *  @type {Array.<Cluster>}
   */
  this.clusters_ = [];

  this.sizes = [53, 56, 66, 78, 90];

  /**
   * @private
   */
  this.styles_ = [];

  /**
   * @type {boolean}
   * @private
   */
  this.ready_ = false;

  var options = opt_options || {};

  /**
   * @type {number}
   * @private
   */
  this.gridSize_ = options['gridSize'] || 60;

  /**
   * @private
   */
  this.minClusterSize_ = options['minimumClusterSize'] || 2;


  /**
   * @type {?number}
   * @private
   */
  this.maxZoom_ = options['maxZoom'] || null;

  this.styles_ = options['styles'] || [];

  /**
   * @type {string}
   * @private
   */
  this.imagePath_ = options['imagePath'] ||
      this.MARKER_CLUSTER_IMAGE_PATH_;

  /**
   * @type {string}
   * @private
   */
  this.imageExtension_ = options['imageExtension'] ||
      this.MARKER_CLUSTER_IMAGE_EXTENSION_;

  /**
   * @type {boolean}
   * @private
   */
  this.zoomOnClick_ = true;

  if (options['zoomOnClick'] != undefined) {
    this.zoomOnClick_ = options['zoomOnClick'];
  }

  /**
   * @type {boolean}
   * @private
   */
  this.averageCenter_ = false;

  if (options['averageCenter'] != undefined) {
    this.averageCenter_ = options['averageCenter'];
  }

  this.setupStyles_();

  this.setMap(map);

  /**
   * @type {number}
   * @private
   */
  this.prevZoom_ = this.map_.getZoom();

  // Add the map event listeners
  var that = this;
  google.maps.event.addListener(this.map_, 'zoom_changed', function() {
    var zoom = that.map_.getZoom();

    if (that.prevZoom_ != zoom) {
      that.prevZoom_ = zoom;
      that.resetViewport();
    }
  });

  google.maps.event.addListener(this.map_, 'idle', function() {
    that.redraw();
  });

  // Finally, add the markers
  if (opt_markers && opt_markers.length) {
    this.addMarkers(opt_markers, false);
  }
}


/**
 * The marker cluster image path.
 *
 * @type {string}
 * @private
 */
MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_PATH_ =
    'http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/' +
    'images/m';


/**
 * The marker cluster image path.
 *
 * @type {string}
 * @private
 */
MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_EXTENSION_ = 'png';


/**
 * Extends a objects prototype by anothers.
 *
 * @param {Object} obj1 The object to be extended.
 * @param {Object} obj2 The object to extend with.
 * @return {Object} The new extended object.
 * @ignore
 */
MarkerClusterer.prototype.extend = function(obj1, obj2) {
  return (function(object) {
    for (var property in object.prototype) {
      this.prototype[property] = object.prototype[property];
    }
    return this;
  }).apply(obj1, [obj2]);
};


/**
 * Implementaion of the interface method.
 * @ignore
 */
MarkerClusterer.prototype.onAdd = function() {
  this.setReady_(true);
};

/**
 * Implementaion of the interface method.
 * @ignore
 */
MarkerClusterer.prototype.draw = function() {};

/**
 * Sets up the styles object.
 *
 * @private
 */
MarkerClusterer.prototype.setupStyles_ = function() {
  if (this.styles_.length) {
    return;
  }

  for (var i = 0, size; size = this.sizes[i]; i++) {
    this.styles_.push({
      url: this.imagePath_ + (i + 1) + '.' + this.imageExtension_,
      height: size,
      width: size
    });
  }
};

/**
 *  Fit the map to the bounds of the markers in the clusterer.
 */
MarkerClusterer.prototype.fitMapToMarkers = function() {
  var markers = this.getMarkers();
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0, marker; marker = markers[i]; i++) {
    bounds.extend(marker.getPosition());
  }

  this.map_.fitBounds(bounds);
};


/**
 *  Sets the styles.
 *
 *  @param {Object} styles The style to set.
 */
MarkerClusterer.prototype.setStyles = function(styles) {
  this.styles_ = styles;
};


/**
 *  Gets the styles.
 *
 *  @return {Object} The styles object.
 */
MarkerClusterer.prototype.getStyles = function() {
  return this.styles_;
};


/**
 * Whether zoom on click is set.
 *
 * @return {boolean} True if zoomOnClick_ is set.
 */
MarkerClusterer.prototype.isZoomOnClick = function() {
  return this.zoomOnClick_;
};

/**
 * Whether average center is set.
 *
 * @return {boolean} True if averageCenter_ is set.
 */
MarkerClusterer.prototype.isAverageCenter = function() {
  return this.averageCenter_;
};


/**
 *  Returns the array of markers in the clusterer.
 *
 *  @return {Array.<google.maps.Marker>} The markers.
 */
MarkerClusterer.prototype.getMarkers = function() {
  return this.markers_;
};


/**
 *  Returns the number of markers in the clusterer
 *
 *  @return {Number} The number of markers.
 */
MarkerClusterer.prototype.getTotalMarkers = function() {
  return this.markers_.length;
};


/**
 *  Sets the max zoom for the clusterer.
 *
 *  @param {number} maxZoom The max zoom level.
 */
MarkerClusterer.prototype.setMaxZoom = function(maxZoom) {
  this.maxZoom_ = maxZoom;
};


/**
 *  Gets the max zoom for the clusterer.
 *
 *  @return {number} The max zoom level.
 */
MarkerClusterer.prototype.getMaxZoom = function() {
  return this.maxZoom_;
};


/**
 *  The function for calculating the cluster icon image.
 *
 *  @param {Array.<google.maps.Marker>} markers The markers in the clusterer.
 *  @param {number} numStyles The number of styles available.
 *  @return {Object} A object properties: 'text' (string) and 'index' (number).
 *  @private
 */
MarkerClusterer.prototype.calculator_ = function(markers, numStyles) {
  var index = 0;
  var count = markers.length;
  var dv = count;
  while (dv !== 0) {
    dv = parseInt(dv / 10, 10);
    index++;
  }

  index = Math.min(index, numStyles);
  return {
    text: count,
    index: index
  };
};


/**
 * Set the calculator function.
 *
 * @param {function(Array, number)} calculator The function to set as the
 *     calculator. The function should return a object properties:
 *     'text' (string) and 'index' (number).
 *
 */
MarkerClusterer.prototype.setCalculator = function(calculator) {
  this.calculator_ = calculator;
};


/**
 * Get the calculator function.
 *
 * @return {function(Array, number)} the calculator function.
 */
MarkerClusterer.prototype.getCalculator = function() {
  return this.calculator_;
};


/**
 * Add an array of markers to the clusterer.
 *
 * @param {Array.<google.maps.Marker>} markers The markers to add.
 * @param {boolean=} opt_nodraw Whether to redraw the clusters.
 */
MarkerClusterer.prototype.addMarkers = function(markers, opt_nodraw) {
  for (var i = 0, marker; marker = markers[i]; i++) {
    this.pushMarkerTo_(marker);
  }
  if (!opt_nodraw) {
    this.redraw();
  }
};


/**
 * Pushes a marker to the clusterer.
 *
 * @param {google.maps.Marker} marker The marker to add.
 * @private
 */
MarkerClusterer.prototype.pushMarkerTo_ = function(marker) {
  marker.isAdded = false;
  if (marker['draggable']) {
    // If the marker is draggable add a listener so we update the clusters on
    // the drag end.
    var that = this;
    google.maps.event.addListener(marker, 'dragend', function() {
      marker.isAdded = false;
      that.repaint();
    });
  }
  this.markers_.push(marker);
};


/**
 * Adds a marker to the clusterer and redraws if needed.
 *
 * @param {google.maps.Marker} marker The marker to add.
 * @param {boolean=} opt_nodraw Whether to redraw the clusters.
 */
MarkerClusterer.prototype.addMarker = function(marker, opt_nodraw) {
  this.pushMarkerTo_(marker);
  if (!opt_nodraw) {
    this.redraw();
  }
};


/**
 * Removes a marker and returns true if removed, false if not
 *
 * @param {google.maps.Marker} marker The marker to remove
 * @return {boolean} Whether the marker was removed or not
 * @private
 */
MarkerClusterer.prototype.removeMarker_ = function(marker) {
  var index = -1;
  if (this.markers_.indexOf) {
    index = this.markers_.indexOf(marker);
  } else {
    for (var i = 0, m; m = this.markers_[i]; i++) {
      if (m == marker) {
        index = i;
        break;
      }
    }
  }

  if (index == -1) {
    // Marker is not in our list of markers.
    return false;
  }

  marker.setMap(null);

  this.markers_.splice(index, 1);

  return true;
};


/**
 * Remove a marker from the cluster.
 *
 * @param {google.maps.Marker} marker The marker to remove.
 * @param {boolean=} opt_nodraw Optional boolean to force no redraw.
 * @return {boolean} True if the marker was removed.
 */
MarkerClusterer.prototype.removeMarker = function(marker, opt_nodraw) {
  var removed = this.removeMarker_(marker);

  if (!opt_nodraw && removed) {
    this.resetViewport();
    this.redraw();
    return true;
  } else {
   return false;
  }
};


/**
 * Removes an array of markers from the cluster.
 *
 * @param {Array.<google.maps.Marker>} markers The markers to remove.
 * @param {boolean=} opt_nodraw Optional boolean to force no redraw.
 */
MarkerClusterer.prototype.removeMarkers = function(markers, opt_nodraw) {
  var removed = false;

  for (var i = 0, marker; marker = markers[i]; i++) {
    var r = this.removeMarker_(marker);
    removed = removed || r;
  }

  if (!opt_nodraw && removed) {
    this.resetViewport();
    this.redraw();
    return true;
  }
};


/**
 * Sets the clusterer's ready state.
 *
 * @param {boolean} ready The state.
 * @private
 */
MarkerClusterer.prototype.setReady_ = function(ready) {
  if (!this.ready_) {
    this.ready_ = ready;
    this.createClusters_();
  }
};


/**
 * Returns the number of clusters in the clusterer.
 *
 * @return {number} The number of clusters.
 */
MarkerClusterer.prototype.getTotalClusters = function() {
  return this.clusters_.length;
};


/**
 * Returns the google map that the clusterer is associated with.
 *
 * @return {google.maps.Map} The map.
 */
MarkerClusterer.prototype.getMap = function() {
  return this.map_;
};


/**
 * Sets the google map that the clusterer is associated with.
 *
 * @param {google.maps.Map} map The map.
 */
MarkerClusterer.prototype.setMap = function(map) {
  this.map_ = map;
};


/**
 * Returns the size of the grid.
 *
 * @return {number} The grid size.
 */
MarkerClusterer.prototype.getGridSize = function() {
  return this.gridSize_;
};


/**
 * Sets the size of the grid.
 *
 * @param {number} size The grid size.
 */
MarkerClusterer.prototype.setGridSize = function(size) {
  this.gridSize_ = size;
};


/**
 * Returns the min cluster size.
 *
 * @return {number} The grid size.
 */
MarkerClusterer.prototype.getMinClusterSize = function() {
  return this.minClusterSize_;
};

/**
 * Sets the min cluster size.
 *
 * @param {number} size The grid size.
 */
MarkerClusterer.prototype.setMinClusterSize = function(size) {
  this.minClusterSize_ = size;
};


/**
 * Extends a bounds object by the grid size.
 *
 * @param {google.maps.LatLngBounds} bounds The bounds to extend.
 * @return {google.maps.LatLngBounds} The extended bounds.
 */
MarkerClusterer.prototype.getExtendedBounds = function(bounds) {
  var projection = this.getProjection();

  // Turn the bounds into latlng.
  var tr = new google.maps.LatLng(bounds.getNorthEast().lat(),
      bounds.getNorthEast().lng());
  var bl = new google.maps.LatLng(bounds.getSouthWest().lat(),
      bounds.getSouthWest().lng());

  // Convert the points to pixels and the extend out by the grid size.
  var trPix = projection.fromLatLngToDivPixel(tr);
  trPix.x += this.gridSize_;
  trPix.y -= this.gridSize_;

  var blPix = projection.fromLatLngToDivPixel(bl);
  blPix.x -= this.gridSize_;
  blPix.y += this.gridSize_;

  // Convert the pixel points back to LatLng
  var ne = projection.fromDivPixelToLatLng(trPix);
  var sw = projection.fromDivPixelToLatLng(blPix);

  // Extend the bounds to contain the new bounds.
  bounds.extend(ne);
  bounds.extend(sw);

  return bounds;
};


/**
 * Determins if a marker is contained in a bounds.
 *
 * @param {google.maps.Marker} marker The marker to check.
 * @param {google.maps.LatLngBounds} bounds The bounds to check against.
 * @return {boolean} True if the marker is in the bounds.
 * @private
 */
MarkerClusterer.prototype.isMarkerInBounds_ = function(marker, bounds) {
  return bounds.contains(marker.getPosition());
};


/**
 * Clears all clusters and markers from the clusterer.
 */
MarkerClusterer.prototype.clearMarkers = function() {
  this.resetViewport(true);

  // Set the markers a empty array.
  this.markers_ = [];
};


/**
 * Clears all existing clusters and recreates them.
 * @param {boolean} opt_hide To also hide the marker.
 */
MarkerClusterer.prototype.resetViewport = function(opt_hide) {
  // Remove all the clusters
  for (var i = 0, cluster; cluster = this.clusters_[i]; i++) {
    cluster.remove();
  }

  // Reset the markers to not be added and to be invisible.
  for (var i = 0, marker; marker = this.markers_[i]; i++) {
    marker.isAdded = false;
    if (opt_hide) {
      marker.setMap(null);
    }
  }

  this.clusters_ = [];
};

/**
 *
 */
MarkerClusterer.prototype.repaint = function() {
  var oldClusters = this.clusters_.slice();
  this.clusters_.length = 0;
  this.resetViewport();
  this.redraw();

  // Remove the old clusters.
  // Do it in a timeout so the other clusters have been drawn first.
  window.setTimeout(function() {
    for (var i = 0, cluster; cluster = oldClusters[i]; i++) {
      cluster.remove();
    }
  }, 0);
};


/**
 * Redraws the clusters.
 */
MarkerClusterer.prototype.redraw = function() {
  this.createClusters_();
};


/**
 * Calculates the distance between two latlng locations in km.
 * @see http://www.movable-type.co.uk/scripts/latlong.html
 *
 * @param {google.maps.LatLng} p1 The first lat lng point.
 * @param {google.maps.LatLng} p2 The second lat lng point.
 * @return {number} The distance between the two points in km.
 * @private
*/
MarkerClusterer.prototype.distanceBetweenPoints_ = function(p1, p2) {
  if (!p1 || !p2) {
    return 0;
  }

  var R = 6371; // Radius of the Earth in km
  var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
  var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
};


/**
 * Add a marker to a cluster, or creates a new cluster.
 *
 * @param {google.maps.Marker} marker The marker to add.
 * @private
 */
MarkerClusterer.prototype.addToClosestCluster_ = function(marker) {
  var distance = 40000; // Some large number
  var clusterToAddTo = null;
  var pos = marker.getPosition();
  for (var i = 0, cluster; cluster = this.clusters_[i]; i++) {
    var center = cluster.getCenter();
    if (center) {
      var d = this.distanceBetweenPoints_(center, marker.getPosition());
      if (d < distance) {
        distance = d;
        clusterToAddTo = cluster;
      }
    }
  }

  if (clusterToAddTo && clusterToAddTo.isMarkerInClusterBounds(marker)) {
    clusterToAddTo.addMarker(marker);
  } else {
    var cluster = new Cluster(this);
    cluster.addMarker(marker);
    this.clusters_.push(cluster);
  }
};


/**
 * Creates the clusters.
 *
 * @private
 */
MarkerClusterer.prototype.createClusters_ = function() {
  if (!this.ready_) {
    return;
  }

  // Get our current map view bounds.
  // Create a new bounds object so we don't affect the map.
  var mapBounds = new google.maps.LatLngBounds(this.map_.getBounds().getSouthWest(),
      this.map_.getBounds().getNorthEast());
  var bounds = this.getExtendedBounds(mapBounds);

  for (var i = 0, marker; marker = this.markers_[i]; i++) {
    if (!marker.isAdded && this.isMarkerInBounds_(marker, bounds)) {
      this.addToClosestCluster_(marker);
    }
  }
};


/**
 * A cluster that contains markers.
 *
 * @param {MarkerClusterer} markerClusterer The markerclusterer that this
 *     cluster is associated with.
 * @constructor
 * @ignore
 */
function Cluster(markerClusterer) {
  this.markerClusterer_ = markerClusterer;
  this.map_ = markerClusterer.getMap();
  this.gridSize_ = markerClusterer.getGridSize();
  this.minClusterSize_ = markerClusterer.getMinClusterSize();
  this.averageCenter_ = markerClusterer.isAverageCenter();
  this.center_ = null;
  this.markers_ = [];
  this.bounds_ = null;
  this.clusterIcon_ = new ClusterIcon(this, markerClusterer.getStyles(),
      markerClusterer.getGridSize());
}

/**
 * Determins if a marker is already added to the cluster.
 *
 * @param {google.maps.Marker} marker The marker to check.
 * @return {boolean} True if the marker is already added.
 */
Cluster.prototype.isMarkerAlreadyAdded = function(marker) {
  if (this.markers_.indexOf) {
    return this.markers_.indexOf(marker) != -1;
  } else {
    for (var i = 0, m; m = this.markers_[i]; i++) {
      if (m == marker) {
        return true;
      }
    }
  }
  return false;
};


/**
 * Add a marker the cluster.
 *
 * @param {google.maps.Marker} marker The marker to add.
 * @return {boolean} True if the marker was added.
 */
Cluster.prototype.addMarker = function(marker) {
  if (this.isMarkerAlreadyAdded(marker)) {
    return false;
  }

  if (!this.center_) {
    this.center_ = marker.getPosition();
    this.calculateBounds_();
  } else {
    if (this.averageCenter_) {
      var l = this.markers_.length + 1;
      var lat = (this.center_.lat() * (l-1) + marker.getPosition().lat()) / l;
      var lng = (this.center_.lng() * (l-1) + marker.getPosition().lng()) / l;
      this.center_ = new google.maps.LatLng(lat, lng);
      this.calculateBounds_();
    }
  }

  marker.isAdded = true;
  this.markers_.push(marker);

  var len = this.markers_.length;
  if (len < this.minClusterSize_ && marker.getMap() != this.map_) {
    // Min cluster size not reached so show the marker.
    marker.setMap(this.map_);
  }

  if (len == this.minClusterSize_) {
    // Hide the markers that were showing.
    for (var i = 0; i < len; i++) {
      this.markers_[i].setMap(null);
    }
  }

  if (len >= this.minClusterSize_) {
    marker.setMap(null);
  }

  this.updateIcon();
  return true;
};


/**
 * Returns the marker clusterer that the cluster is associated with.
 *
 * @return {MarkerClusterer} The associated marker clusterer.
 */
Cluster.prototype.getMarkerClusterer = function() {
  return this.markerClusterer_;
};


/**
 * Returns the bounds of the cluster.
 *
 * @return {google.maps.LatLngBounds} the cluster bounds.
 */
Cluster.prototype.getBounds = function() {
  var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
  var markers = this.getMarkers();
  for (var i = 0, marker; marker = markers[i]; i++) {
    bounds.extend(marker.getPosition());
  }
  return bounds;
};


/**
 * Removes the cluster
 */
Cluster.prototype.remove = function() {
  this.clusterIcon_.remove();
  this.markers_.length = 0;
  delete this.markers_;
};


/**
 * Returns the center of the cluster.
 *
 * @return {number} The cluster center.
 */
Cluster.prototype.getSize = function() {
  return this.markers_.length;
};


/**
 * Returns the center of the cluster.
 *
 * @return {Array.<google.maps.Marker>} The cluster center.
 */
Cluster.prototype.getMarkers = function() {
  return this.markers_;
};


/**
 * Returns the center of the cluster.
 *
 * @return {google.maps.LatLng} The cluster center.
 */
Cluster.prototype.getCenter = function() {
  return this.center_;
};


/**
 * Calculated the extended bounds of the cluster with the grid.
 *
 * @private
 */
Cluster.prototype.calculateBounds_ = function() {
  var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
  this.bounds_ = this.markerClusterer_.getExtendedBounds(bounds);
};


/**
 * Determines if a marker lies in the clusters bounds.
 *
 * @param {google.maps.Marker} marker The marker to check.
 * @return {boolean} True if the marker lies in the bounds.
 */
Cluster.prototype.isMarkerInClusterBounds = function(marker) {
  return this.bounds_.contains(marker.getPosition());
};


/**
 * Returns the map that the cluster is associated with.
 *
 * @return {google.maps.Map} The map.
 */
Cluster.prototype.getMap = function() {
  return this.map_;
};


/**
 * Updates the cluster icon
 */
Cluster.prototype.updateIcon = function() {
  var zoom = this.map_.getZoom();
  var mz = this.markerClusterer_.getMaxZoom();

  if (mz && zoom > mz) {
    // The zoom is greater than our max zoom so show all the markers in cluster.
    for (var i = 0, marker; marker = this.markers_[i]; i++) {
      marker.setMap(this.map_);
    }
    return;
  }

  if (this.markers_.length < this.minClusterSize_) {
    // Min cluster size not yet reached.
    this.clusterIcon_.hide();
    return;
  }

  var numStyles = this.markerClusterer_.getStyles().length;
  var sums = this.markerClusterer_.getCalculator()(this.markers_, numStyles);
  this.clusterIcon_.setCenter(this.center_);
  this.clusterIcon_.setSums(sums);
  this.clusterIcon_.show();
};


/**
 * A cluster icon
 *
 * @param {Cluster} cluster The cluster to be associated with.
 * @param {Object} styles An object that has style properties:
 *     'url': (string) The image url.
 *     'height': (number) The image height.
 *     'width': (number) The image width.
 *     'anchor': (Array) The anchor position of the label text.
 *     'textColor': (string) The text color.
 *     'textSize': (number) The text size.
 *     'backgroundPosition: (string) The background postition x, y.
 * @param {number=} opt_padding Optional padding to apply to the cluster icon.
 * @constructor
 * @extends google.maps.OverlayView
 * @ignore
 */
function ClusterIcon(cluster, styles, opt_padding) {
  cluster.getMarkerClusterer().extend(ClusterIcon, google.maps.OverlayView);

  this.styles_ = styles;
  this.padding_ = opt_padding || 0;
  this.cluster_ = cluster;
  this.center_ = null;
  this.map_ = cluster.getMap();
  this.div_ = null;
  this.sums_ = null;
  this.visible_ = false;

  this.setMap(this.map_);
}


/**
 * Triggers the clusterclick event and zoom's if the option is set.
 */
ClusterIcon.prototype.triggerClusterClick = function() {
  var markerClusterer = this.cluster_.getMarkerClusterer();

  // Trigger the clusterclick event.
  google.maps.event.trigger(markerClusterer, 'clusterclick', this.cluster_);

  if (markerClusterer.isZoomOnClick()) {
    // Zoom into the cluster.
    this.map_.fitBounds(this.cluster_.getBounds());
  }
};


/**
 * Adding the cluster icon to the dom.
 * @ignore
 */
ClusterIcon.prototype.onAdd = function() {
  this.div_ = document.createElement('DIV');
  if (this.visible_) {
    var pos = this.getPosFromLatLng_(this.center_);
    this.div_.style.cssText = this.createCss(pos);
    this.div_.innerHTML = this.sums_.text;
  }

  var panes = this.getPanes();
  panes.overlayMouseTarget.appendChild(this.div_);

  var that = this;
  google.maps.event.addDomListener(this.div_, 'click', function() {
    that.triggerClusterClick();
  });
};


/**
 * Returns the position to place the div dending on the latlng.
 *
 * @param {google.maps.LatLng} latlng The position in latlng.
 * @return {google.maps.Point} The position in pixels.
 * @private
 */
ClusterIcon.prototype.getPosFromLatLng_ = function(latlng) {
  var pos = this.getProjection().fromLatLngToDivPixel(latlng);

  if (typeof this.iconAnchor_ === 'object' && this.iconAnchor_.length === 2) {
    pos.x -= this.iconAnchor_[0];
    pos.y -= this.iconAnchor_[1];
  } else {
    pos.x -= parseInt(this.width_ / 2, 10);
    pos.y -= parseInt(this.height_ / 2, 10);
  }
  return pos;
};


/**
 * Draw the icon.
 * @ignore
 */
ClusterIcon.prototype.draw = function() {
  if (this.visible_) {
    var pos = this.getPosFromLatLng_(this.center_);
    this.div_.style.top = pos.y + 'px';
    this.div_.style.left = pos.x + 'px';
  }
};


/**
 * Hide the icon.
 */
ClusterIcon.prototype.hide = function() {
  if (this.div_) {
    this.div_.style.display = 'none';
  }
  this.visible_ = false;
};


/**
 * Position and show the icon.
 */
ClusterIcon.prototype.show = function() {
  if (this.div_) {
    var pos = this.getPosFromLatLng_(this.center_);
    this.div_.style.cssText = this.createCss(pos);
    this.div_.style.display = '';
  }
  this.visible_ = true;
};


/**
 * Remove the icon from the map
 */
ClusterIcon.prototype.remove = function() {
  this.setMap(null);
};


/**
 * Implementation of the onRemove interface.
 * @ignore
 */
ClusterIcon.prototype.onRemove = function() {
  if (this.div_ && this.div_.parentNode) {
    this.hide();
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
  }
};


/**
 * Set the sums of the icon.
 *
 * @param {Object} sums The sums containing:
 *   'text': (string) The text to display in the icon.
 *   'index': (number) The style index of the icon.
 */
ClusterIcon.prototype.setSums = function(sums) {
  this.sums_ = sums;
  this.text_ = sums.text;
  this.index_ = sums.index;
  if (this.div_) {
    this.div_.innerHTML = sums.text;
  }

  this.useStyle();
};


/**
 * Sets the icon to the the styles.
 */
ClusterIcon.prototype.useStyle = function() {
  var index = Math.max(0, this.sums_.index - 1);
  index = Math.min(this.styles_.length - 1, index);
  var style = this.styles_[index];
  this.url_ = style['url'];
  this.height_ = style['height'];
  this.width_ = style['width'];
  this.textColor_ = style['textColor'];
  this.anchor_ = style['anchor'];
  this.textSize_ = style['textSize'];
  this.backgroundPosition_ = style['backgroundPosition'];
  this.iconAnchor_ = style['iconAnchor'];
};


/**
 * Sets the center of the icon.
 *
 * @param {google.maps.LatLng} center The latlng to set as the center.
 */
ClusterIcon.prototype.setCenter = function(center) {
  this.center_ = center;
};


/**
 * Create the css text based on the position of the icon.
 *
 * @param {google.maps.Point} pos The position.
 * @return {string} The css style text.
 */
ClusterIcon.prototype.createCss = function(pos) {
  var style = [];
  style.push('background-image:url(' + this.url_ + ');');
  var backgroundPosition = this.backgroundPosition_ ? this.backgroundPosition_ : '0 0';
  style.push('background-position:' + backgroundPosition + ';');

  if (typeof this.anchor_ === 'object') {
    if (typeof this.anchor_[0] === 'number' && this.anchor_[0] > 0 &&
        this.anchor_[0] < this.height_) {
      style.push('height:' + (this.height_ - this.anchor_[0]) +
          'px; padding-top:' + this.anchor_[0] + 'px;');
    } else if (typeof this.anchor_[0] === 'number' && this.anchor_[0] < 0 &&
        -this.anchor_[0] < this.height_) {
      style.push('height:' + this.height_ + 'px; line-height:' + (this.height_ + this.anchor_[0]) +
          'px;');
    } else {
      style.push('height:' + this.height_ + 'px; line-height:' + this.height_ +
          'px;');
    }
    if (typeof this.anchor_[1] === 'number' && this.anchor_[1] > 0 &&
        this.anchor_[1] < this.width_) {
      style.push('width:' + (this.width_ - this.anchor_[1]) +
          'px; padding-left:' + this.anchor_[1] + 'px;');
    } else {
      style.push('width:' + this.width_ + 'px; text-align:center;');
    }
  } else {
    style.push('height:' + this.height_ + 'px; line-height:' +
        this.height_ + 'px; width:' + this.width_ + 'px; text-align:center;');
  }

  var txtColor = this.textColor_ ? this.textColor_ : 'black';
  var txtSize = this.textSize_ ? this.textSize_ : 11;

  style.push('cursor:pointer; top:' + pos.y + 'px; left:' +
      pos.x + 'px; color:' + txtColor + '; position:absolute; font-size:' +
      txtSize + 'px; font-family:Arial,sans-serif; font-weight:bold');
  return style.join('');
};


// Export Symbols for Closure
// If you are not going to compile with closure then you can remove the
// code below.
window['MarkerClusterer'] = MarkerClusterer;
MarkerClusterer.prototype['addMarker'] = MarkerClusterer.prototype.addMarker;
MarkerClusterer.prototype['addMarkers'] = MarkerClusterer.prototype.addMarkers;
MarkerClusterer.prototype['clearMarkers'] =
    MarkerClusterer.prototype.clearMarkers;
MarkerClusterer.prototype['fitMapToMarkers'] =
    MarkerClusterer.prototype.fitMapToMarkers;
MarkerClusterer.prototype['getCalculator'] =
    MarkerClusterer.prototype.getCalculator;
MarkerClusterer.prototype['getGridSize'] =
    MarkerClusterer.prototype.getGridSize;
MarkerClusterer.prototype['getExtendedBounds'] =
    MarkerClusterer.prototype.getExtendedBounds;
MarkerClusterer.prototype['getMap'] = MarkerClusterer.prototype.getMap;
MarkerClusterer.prototype['getMarkers'] = MarkerClusterer.prototype.getMarkers;
MarkerClusterer.prototype['getMaxZoom'] = MarkerClusterer.prototype.getMaxZoom;
MarkerClusterer.prototype['getStyles'] = MarkerClusterer.prototype.getStyles;
MarkerClusterer.prototype['getTotalClusters'] =
    MarkerClusterer.prototype.getTotalClusters;
MarkerClusterer.prototype['getTotalMarkers'] =
    MarkerClusterer.prototype.getTotalMarkers;
MarkerClusterer.prototype['redraw'] = MarkerClusterer.prototype.redraw;
MarkerClusterer.prototype['removeMarker'] =
    MarkerClusterer.prototype.removeMarker;
MarkerClusterer.prototype['removeMarkers'] =
    MarkerClusterer.prototype.removeMarkers;
MarkerClusterer.prototype['resetViewport'] =
    MarkerClusterer.prototype.resetViewport;
MarkerClusterer.prototype['repaint'] =
    MarkerClusterer.prototype.repaint;
MarkerClusterer.prototype['setCalculator'] =
    MarkerClusterer.prototype.setCalculator;
MarkerClusterer.prototype['setGridSize'] =
    MarkerClusterer.prototype.setGridSize;
MarkerClusterer.prototype['setMaxZoom'] =
    MarkerClusterer.prototype.setMaxZoom;
MarkerClusterer.prototype['onAdd'] = MarkerClusterer.prototype.onAdd;
MarkerClusterer.prototype['draw'] = MarkerClusterer.prototype.draw;

Cluster.prototype['getCenter'] = Cluster.prototype.getCenter;
Cluster.prototype['getSize'] = Cluster.prototype.getSize;
Cluster.prototype['getMarkers'] = Cluster.prototype.getMarkers;

ClusterIcon.prototype['onAdd'] = ClusterIcon.prototype.onAdd;
ClusterIcon.prototype['draw'] = ClusterIcon.prototype.draw;
ClusterIcon.prototype['onRemove'] = ClusterIcon.prototype.onRemove;



/*** EXPORTS FROM exports-loader ***/
exports["Class"] = (MarkerClusterer);
exports["google"] = (google);

/***/ },
/* 2 */
/***/ function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ }
/******/ ]);
});