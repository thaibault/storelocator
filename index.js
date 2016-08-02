// @flow
// #!/usr/bin/env node
// -*- coding: utf-8 -*-
/** @module jQuery-storeLocator */
'use strict'
/* !
    region header
    [Project page](http://torben.website/jQuery-storeLocator)

    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    See http://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import $ from 'jquery'
import type {PromiseCallbackFunction} from 'webOptimizer/type'
import 'jQuery-tools'
// IgnoreTypeCheck
const GoogleMarkerClusterer:any = require('googleMarkerClusterer')
/* eslint-disable no-duplicate-imports */
import type {$DomNode, $Deferred} from 'jQuery-tools'
/* eslint-enable no-duplicate-imports */
// endregion
// region types
export type Position = {
    latitude:number;
    longitude:number;
}
// endregion
const context:Object = (():Object => {
    if ($.type(window) === 'undefined') {
        if ($.type(global) === 'undefined')
            return ($.type(module) === 'undefined') ? {} : module
        return global
    }
    return window
})()
if (!context.hasOwnProperty('document') && $.hasOwnProperty('context'))
    context.document = $.context
// region plugins/classes
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
 */
class StoreLocator extends $.Tools.class {
    // region static properties
    static maps:Object
    static _name:string = 'StoreLocator'
    static _apiLoad:$Deferred<$DomNode>
    // endregion
    // region dynamic properties
    currentSearchResults:Array<Object>
    currentSearchText:?string
    resultsDomNode:?$DomNode
    currentSearchResultsDomNode:?$DomNode
    currentlyOpenWindow:?Object
    currentlyHighlightedMarker:?Object
    searchResultsDirty:boolean
    seenLocations:Array<string>
    markers:Array<Object>
    currentSearchResultRange:?Array<number>;
    // endregion
    /**
     * Entry point for object orientated jQuery plugin.
     * @param options - Options to overwrite default ones.
     * @returns Currently selected dom node.
     */
    initialize(options:Object = {}):$Deferred<$DomNode> {
        // region properties
        this.currentSearchResults = []
        this.currentSearchText = null
        this.resultsDomNode = null
        this.currentSearchResultsDomNode = null
        this.currentlyOpenWindow = null
        this.currentlyHighlightedMarker = null
        this.searchResultsDirty = false
        this.seenLocations = []
        this.markers = []
        this.currentSearchResultRange = null
        this._options = {
            api: {
                url: 'http://maps.googleapis.com/maps/api/js' +
                    '?v=3&sensor=false&libraries=places,geometry&callback={1}',
                callbackName: null
            },
            stores: {
                northEast: {latitude: 85, longitude: 180},
                southWest: {latitude: -85, longitude: -180},
                number: 100,
                generateProperties: (store:Object):Object => store
            },
            addtionalStoreProperties: {},
            iconPath: '/webAsset/image/storeLocator/',
            defaultMarkerIconFileName: null,
            startLocation: null,
            fallbackLocation: {latitude: 51.124213, longitude: 10.147705},
            ip: null,
            ipToLocation: {
                applicationInterfaceURL: '{1}://freegeoip.net/json/{2}',
                timeoutInMilliseconds: 5000,
                bounds: {
                    northEast: {latitude: 85, longitude: 180},
                    southWest: {latitude: -85, longitude: -180}
                }
            },
            map: {zoom: 3},
            showInputAfterLoadedDelayInMilliseconds: 500,
            inputFadeInOption: {duration: 'fast'},
            distanceToMoveByDuplicatedEntries: 0.0001,
            marker: {
                cluster: {
                    gridSize: 100, maxZoom: 11, imagePath:
                        'https://cdn.rawgit.com/googlemaps/' +
                        'js-marker-clusterer/gh-pages/images/m'
                },
                icon: {
                    size: {width: 44, height: 49, unit: 'px'},
                    scaledSize: {width: 44, height: 49, unit: 'px'}
                }
            },
            successfulSearchZoom: 12,
            infoWindow: {
                content: null,
                additionalMoveToBottomInPixel: 120,
                loadingContent: '<div class="idle">loading...</div>'
            },
            searchBox: 50,
            onInfoWindowOpen: $.noop,
            onInfoWindowOpened: $.noop,
            onAddSearchResults: $.noop,
            onRemoveSearchResults: $.noop,
            onOpenSearchResults: $.noop,
            onCloseSearchResults: $.noop,
            onMarkerHighlighted: $.noop
        }
        // endregion
        // Merges given options with default options recursively.
        super.initialize(options)
        let loadInitialized:boolean = true
        if (typeof this.constructor._apiLoad !== 'object') {
            loadInitialized = false
            this.constructor._apiLoad = $.Deferred()
        }
        const result:$Deferred<$DomNode> = this.constructor._apiLoad.then(
            this.getMethod(this.bootstrap))
        if ('google' in context && 'maps' in context.google) {
            this.constructor.maps = context.google.maps
            if (this.constructor._apiLoad.state() !== 'resolved')
                setTimeout(():$Deferred<$DomNode> =>
                    this.constructor._apiLoad.resolve(this.$domNode))
        } else if (
            'google' in context.window && 'maps' in context.window.google
        ) {
            this.constructor.maps = context.window.google.maps
            if (this.constructor._apiLoad.state() !== 'resolved')
                setTimeout(():$Deferred<$DomNode> =>
                    this.constructor._apiLoad.resolve(this.$domNode))
        } else if (!loadInitialized) {
            let callbackName:?string = this._options.api.callbackName
            if (!this._options.api.callbackName)
                callbackName = this.constructor.determineUniqueScopeName()
            context[callbackName] = ():$Deferred<$DomNode> => {
                this.constructor.maps = context.window.google.maps
                this.constructor._apiLoad.resolve(this.$domNode)
            }
            $.getScript(this.constructor.stringFormat(
                this._options.api.url, callbackName))
        }
        return result
    }
    /**
     * Determines useful location cluster, info windows and marker.
     * @returns The current instance.
     */
    bootstrap():$Deferred<$DomNode> {
        if (this._options.startLocation)
            return this.initializeMap()
        this._options.startLocation = this._options.fallbackLocation
        /*
            NOTE: If request is slower than the timeout parameter for jsonp
            request the padding function isn't set anymore so an error
            occurs. That's why we use our own timeout implementation.
        */
        let loaded:boolean = false
        const $deferred:$Deferred<$DomNode> = $.Deferred()
        const fallbackTimeoutID:number = setTimeout(():void => {
            loaded = true
            this.initializeMap().then(():$Deferred<$DomNode> =>
                $deferred.resolve(this.$domNode))
        }, this._options.ipToLocation.timeoutInMilliseconds)
        $.ajax({
            url: this.constructor.stringFormat(
                this._options.ipToLocation.applicationInterfaceURL,
                document.location.protocol.substring(
                    0, document.location.protocol.length - 1
                ), this._options.ip || ''
            ),
            dataType: 'jsonp', cache: true
        }).always((currentLocation:Position, textStatus:string):void => {
            if (!loaded) {
                clearTimeout(fallbackTimeoutID)
                loaded = true
                if (textStatus === 'success')
                    /*
                        Check if determined location is within defined
                        bounds.
                    */
                    if (!this._options.ipToLocation.bounds || (
                        new this.constructor.maps.LatLngBounds(
                            new this.constructor.maps.LatLng(
                                this._options.ipToLocation.bounds.southWest
                                    .latitude,
                                this._options.ipToLocation.bounds.southWest
                                    .longitude),
                            new this.constructor.maps.LatLng(
                                this._options.ipToLocation.bounds.northEast
                                    .latitude,
                                this._options.ipToLocation.bounds.northEast
                                    .longitude))
                    ).contains(new this.constructor.maps.LatLng(
                        currentLocation.latitude, currentLocation.longitude
                    )))
                        this._options.startLocation = currentLocation
                this.initializeMap().then(():$Deferred<$DomNode> =>
                    $deferred.resolve(this.$domNode))
            }
        })
        return $deferred
    }
    /**
     * Initializes cluster, info windows and marker.
     * @returns The current instance.
     */
    initializeMap():$Deferred<$DomNode> {
        this._options.map.center = new this.constructor.maps.LatLng(
            this._options.startLocation.latitude,
            this._options.startLocation.longitude)
        this.map = new this.constructor.maps.Map($('<div>').appendTo(
            this.$domNode
        )[0], this._options.map)
        let markerCluster:?Object = null
        if (this._options.marker.cluster && false)
            markerCluster = new GoogleMarkerClusterer(
                this.map, [], this._options.marker.cluster)
        // Add a marker for each retrieved store.
        const $addMarkerDeferred:$Deferred<Array<Object>> = $.Deferred()
        const markerList:Array<Object> = []
        if ($.isArray(this._options.stores))
            for (const store:Object of this._options.stores) {
                $.extend(true, store, this._options.addtionalStoreProperties)
                const marker:Object = this.createMarker(store)
                if (markerCluster)
                    markerCluster.addMarker(marker)
                markerList.push(marker)
                $addMarkerDeferred.resolve(markerList)
            }
        else if ($.type(this._options.stores) === 'string')
            $.getJSON(this._options.stores, (stores:Array<Object>):void => {
                for (const store:Object of stores) {
                    $.extend(
                        true, store, this._options.addtionalStoreProperties)
                    const marker:Object = this.createMarker(store)
                    if (markerCluster)
                        markerCluster.addMarker(marker)
                    markerList.push(marker)
                }
                $addMarkerDeferred.resolve(markerList)
            })
        else {
            const southWest:Object = new this.constructor.maps.LatLng(
                this._options.stores.southWest.latitude,
                this._options.stores.southWest.longitude)
            const northEast:Object = new this.constructor.maps.LatLng(
                this._options.stores.northEast.latitude,
                this._options.stores.northEast.longitude)
            for (
                let index:number = 0; index < this._options.stores.number;
                index++
            ) {
                const store:Object = $.extend({
                    latitude: southWest.lat() + (northEast.lat(
                    ) - southWest.lat()) * Math.random(),
                    longitude: southWest.lng() + (northEast.lng(
                    ) - southWest.lng()) * Math.random()
                }, this._options.addtionalStoreProperties)
                const marker:Object = this.createMarker($.extend(
                    store, this._options.stores.generateProperties(store)))
                if (markerCluster)
                    markerCluster.addMarker(marker)
                markerList.push(marker)
            }
            $addMarkerDeferred.resolve(markerList)
        }
        // Create the search box and link it to the UI element.
        this.map.controls[this.constructor.maps.ControlPosition.TOP_LEFT].push(
            this.$domNode.find('input')[0])
        if ($.type(this._options.searchBox) === 'number')
            this.initializeGenericSearchBox()
        else {
            this.constructor.maps.event.addListener(this.map, 'click', (
            ):StoreLocator => this.closeSearchResults())
            this.constructor.maps.event.addListener(this.map, 'dragstart', (
            ):StoreLocator => this.closeSearchResults())
            this._options.searchBox = $.extend(true, {
                maximumNumberOfResults: 50,
                numberOfAdditionalGenericPlaces: [2, 5],
                maximalDistanceInMeter: 1000000,
                loadingContent: this._options.infoWindow.loadingContent,
                genericPlaceFilter: (place:Object):boolean => (
                    place.formatted_address.indexOf(
                        ' Deutschland'
                    ) !== -1 || place.formatted_address.indexOf(
                        ' Germany'
                    ) !== -1
                ),
                prefereGenericResults: true,
                genericPlaceSearchOptions: {radius: '50000'}
            }, this._options.searchBox)
            this.initializeDataSourceSearchBox()
        }
        // Close marker if zoom level is bigger than the aggregation.
        this.constructor.maps.event.addListener(this.map, 'zoom_changed', (
        ):void => {
            if (
                typeof this.currentlyOpenWindow === 'object' &&
                this.currentlyOpenWindow &&
                this.currentlyOpenWindow.isOpen &&
                this.map.getZoom() <= this._options.marker.cluster.maxZoom
            ) {
                this.currentlyOpenWindow.isOpen = false
                this.currentlyOpenWindow.close()
            }
        })
        const $mapLoadedDeferred:$Deferred<$DomNode> = $.Deferred()
        this.constructor.maps.event.addListenerOnce(this.map, 'idle', (
        ):$Deferred<Array<Object>> => $addMarkerDeferred.then((
        ):$Deferred<$DomNode> => $mapLoadedDeferred.resolve(this.$domNode)))
        return $mapLoadedDeferred
    }
    /**
     * Position search results right below the search input field.
     * @returns The current instance.
     */
    initializeDataSourceSearchResultsBox():StoreLocator {
        const cssProperties:Object = {}
        for (const propertyName:string of [
            'position', 'width', 'top', 'left', 'border'
        ])
            cssProperties[propertyName] = this.$domNode.find('input').css(
                propertyName)
        cssProperties.marginTop = this.$domNode.find('input').outerHeight(
            true)
        // Prepare search result positioning.
        this.resultsDomNode = $('<div>').addClass(
            this.constructor.stringCamelCaseToDelimited(
                `${this.__name__}SearchResults`)
        ).css(cssProperties)
        // Inject the final search results into the dom tree.
        this.$domNode.find('input').after(this.resultsDomNode)
        return this
    }
    /**
     * Initializes a data source based search box to open and focus them
     * matching marker.
     * @returns The current instance.
     */
    initializeDataSourceSearchBox():StoreLocator {
        this.on(this.$domNode, 'keydown', (event:Object):void => {
            /*
                NOTE: Events that doesn't occurs in search context are handled
                by the native map implementation and won't be propagated so we
                doesn't have to care about that.
            */
            if (this.currentSearchResults.length) {
                if (this.currentSearchResultRange)
                    this.currentSearchResultRange = [
                        Math.max(0, this.currentSearchResultRange[0]),
                        Math.min(
                            this.currentSearchResults.length - 1,
                            // IgnoreTypeCheck
                            this.currentSearchResultRange[1])]
                else
                    this.currentSearchResultRange = [
                        0, this.currentSearchResults.length - 1]
                let currentIndex:number = -1
                if (this.currentlyHighlightedMarker)
                    currentIndex = this.currentSearchResults.indexOf(
                        this.currentlyHighlightedMarker)
                if (event.keyCode === this.keyCode.DOWN)
                    if (
                        currentIndex === -1 ||
                        this.currentSearchResultRange[1] < currentIndex + 1
                    )
                        this.highlightMarker(this.currentSearchResults[
                            this.currentSearchResultRange[0]
                        ], event)
                    else
                        this.highlightMarker(
                            this.currentSearchResults[currentIndex + 1], event)
                else if (event.keyCode === this.keyCode.UP)
                    if ([this.currentSearchResultRange[0], -1].includes(
                        currentIndex
                    ))
                        this.highlightMarker(this.currentSearchResults[
                            // IgnoreTypeCheck
                            this.currentSearchResultRange[1]
                        ], event)
                    else
                        this.highlightMarker(
                            this.currentSearchResults[currentIndex - 1], event)
                else if (
                    event.keyCode === this.keyCode.ENTER &&
                    this.currentlyHighlightedMarker
                ) {
                    event.stopPropagation()
                    if (this.currentlyHighlightedMarker)
                        if (this.currentlyHighlightedMarker.infoWindow)
                            this.openMarker(
                                this.currentlyHighlightedMarker, event)
                        else
                            this.openPlace(
                                this.currentlyHighlightedMarker.data, event)
                }
            }
        })
        this.on(this.$domNode.find('input'), 'focus', ():void => {
            if (this.currentSearchText)
                this.openSearchResults()
        })
        this.on(this.$domNode.find('input'), 'keydown', (
            event:Object
        ):void => {
            for (const name:string in this.keyCode)
                if (
                    this.keyCode.hasOwnProperty(name) &&
                    event.keyCode === this.keyCode[name] && name !== 'DOWN'
                )
                    return
        })
        if (this.currentSearchText)
            this.openSearchResults()
        this.on(this.$domNode.find('input'), 'click', ():void => {
            if (this.currentSearchText)
                this.openSearchResults()
        })
        this.constructor.maps.event.addListener(this.map, 'center_changed', (
        ):void => {
            // NOTE: Search results depends on current position.
            if (this.currentSearchText && this.resultsDomNode)
                this.searchResultsDirty = true
        })
        this.on(
            this.$domNode.find('input'), 'keyup',
            this.getUpdateSearchResultsHandler())
        return this
    }
    /**
     * Triggers on each search request.
     * @returns The current instance.
     */
    getUpdateSearchResultsHandler():Function {
        const placesService:Object =
            new this.constructor.maps.places.PlacesService(this.map)
        return this.debounce((event:Object):void => {
            for (const name:string in this.keyCode)
                if (event && event.keyCode === this.keyCode[name] && ![
                    'DELETE', 'BACKSPACE'
                ].includes(name))
                    return
            this.acquireLock(`${this.constructor._name}Search`, ():void => {
                const searchText:string = this.$domNode.find(
                    'input'
                ).val().trim()
                if (
                    this.currentSearchText === searchText &&
                    !this.searchResultsDirty
                )
                    return this.releaseLock(`${this.constructor._name}Search`)
                this.searchResultsDirty = false
                if (!this.resultsDomNode)
                    this.initializeDataSourceSearchResultsBox()
                if (!searchText && this.resultsDomNode) {
                    this.currentSearchText = ''
                    this.currentSearchResults = []
                    this.resultsDomNode.html('')
                    this.currentSearchResultsDomNode = null
                    this.closeSearchResults()
                    return this.releaseLock(`${this.constructor._name}Search`)
                }
                this.openSearchResults()
                const loadingDomNode:$DomNode = $(
                    this._options.searchBox.loadingContent)
                if (this.resultsDomNode && !this.fireEvent(
                    'addSearchResults', false, this, loadingDomNode,
                    this.resultsDomNode, this.currentSearchResultsDomNode || []
                ))
                    this.resultsDomNode.html(loadingDomNode)
                if (
                    this.currentSearchResultsDomNode &&
                    this.currentSearchResultsDomNode.length
                )
                    this.fireEvent(
                        'removeSearchResults', false, this,
                        this.currentSearchResultsDomNode)
                this.currentSearchResultsDomNode = loadingDomNode
                if (this._options.searchBox.numberOfAdditionalGenericPlaces)
                    /*
                        NOTE: Google searches for more items than exists in the
                        the specified radius. However the radius is a string in
                        the examples provided by google.
                    */
                    placesService.textSearch($.extend({
                        query: searchText, location: this.map.getCenter()
                    }, this._options.searchBox.genericPlaceSearchOptions), (
                        places:Array<Object>
                    ):void => {
                        if (places)
                            this.handleGenericSearchResults(places, searchText)
                    })
                else
                    this.performLocalSearch(searchText)
            }, 1000)
        })
    }
    /**
     * Sorts and filters search results given by the google api.
     * @param places - List of place objects.
     * @param searchText - Words which should occur in requested search
     * results.
     * @returns Returns current instance.
     */
    handleGenericSearchResults(
        places:Array<Object>, searchText:string
    ):StoreLocator {
        const searchResults:Array<Object> = []
        /*
            NOTE: Since google text search doesn't support sorting by distance
            we have to sort by our own.
        */
        let index:number = 1
        for (const place:Object of places.sort((
            firstPlace:Object, secondPlace:Object
        ):number =>
            this.constructor.maps.geometry.spherical.computeDistanceBetween(
                this.map.getCenter(), firstPlace.geometry.location
            ) - this.constructor.maps.geometry.spherical
                .computeDistanceBetween(this.map.getCenter(
                ), secondPlace.geometry.location)
        )) {
            index += 1
            const distance:number = this.constructor.maps.geometry.spherical
                .computeDistanceBetween(this.map.getCenter(
                ), place.geometry.location)
            if (distance > this._options.searchBox.maximalDistanceInMeter)
                break
            if (this._options.searchBox.genericPlaceFilter(place)) {
                const result:{
                    data:Object;
                    position:Position;
                    open:(event:Object) => any;
                    highlight:(event:Object, type:string) => any;
                } = {
                    data: $.extend(place, {
                        logoFilePath: place.icon.replace(
                            /^http:(\/\/)/, `${document.location.protocol}$1`),
                        address: place.formatted_address,
                        distance: distance
                    }),
                    position: place.geometry.location,
                    open: (event:Object):StoreLocator => this.openPlace(
                        place, event),
                    highlight: (event:Object, type:string):void => {
                        this.isHighlighted = type !== 'stop'
                    }
                }
                searchResults.push(result)
                if (this._options.searchBox.numberOfAdditionalGenericPlaces[
                    1
                ] < index)
                    break
            }
        }
        return this.performLocalSearch(searchText, searchResults)
    }
    /**
     * Performs a search on locally given store data.
     * @param searchText - Text to search for.
     * @param searchResults - A list if generic search results.
     * @returns The current instance.
     */
    performLocalSearch(
        searchText:string, searchResults:Array<Object> = []
    ):StoreLocator {
        const numberOfGenericSearchResults:number = searchResults.length
        for (const marker:Object of this.markers)
            for (const key:string of this._options.searchBox.properties)
                if ((
                    marker.data[key] || marker.data[key] === 0
                ) && `${marker.data[key]}`.toLowerCase().replace(
                    /[-_&]+/g, ' '
                ).indexOf(searchText.toLowerCase().replace(
                    /[-_&]+/g, ' '
                )) !== -1) {
                    marker.open = (event:Object):StoreLocator =>
                        this.openMarker(marker, event)
                    marker.highlight = (
                        event:Object, type:string
                    ):StoreLocator => this.highlightMarker(marker, event, type)
                    searchResults.push(marker)
                    break
                }
        /*
            Remove generic place results if there are enough local search
            results.
        */
        if (
            this._options.searchBox.numberOfAdditionalGenericPlaces &&
            searchResults.length && numberOfGenericSearchResults >
                this._options.searchBox.numberOfAdditionalGenericPlaces[0] &&
            searchResults.length >
                this._options.searchBox.numberOfAdditionalGenericPlaces[1]
        )
            searchResults.splice(
                this._options.searchBox.numberOfAdditionalGenericPlaces[0],
                numberOfGenericSearchResults -
                    this._options.searchBox.numberOfAdditionalGenericPlaces[0])
        // Slice additional unneeded local search results.
        let limitReached:boolean = false
        if (
            this._options.searchBox.maximumNumberOfResults <
            searchResults.length
        ) {
            limitReached = true
            searchResults.splice(
                this._options.searchBox.maximumNumberOfResults,
                searchResults.length)
        }
        /*
            Sort results by current map center form nearer to more fare away
            results.
        */
        searchResults.sort((first:Object, second:Object):number => {
            if (
                this._options.searchBox.prefereGenericResults &&
                !first.infoWindow && second.infoWindow
            )
                return -1
            if (
                this._options.searchBox.prefereGenericResults &&
                !second.infoWindow && first.infoWindow
            )
                return 1
            return this.constructor.maps.geometry.spherical
                .computeDistanceBetween(
                    this.map.getCenter(), first.position
                ) - this.constructor.maps.geometry.spherical
                    .computeDistanceBetween(
                        this.map.getCenter(), second.position)
        })
        // Compile search results markup.
        const resultsRepresentation:Promise<any>|string =
            this.makeSearchResults(searchResults, limitReached)
        if ($.type(resultsRepresentation) === 'string') {
            const resultsRepresentationDomNode:$DomNode = $(
                resultsRepresentation)
            if (this.resultsDomNode && !this.fireEvent(
                'addSearchResults', false, this, resultsRepresentationDomNode,
                this.resultsDomNode, this.currentSearchResultsDomNode || []
            ))
                this.resultsDomNode.html(resultsRepresentationDomNode)
            if (
                this.currentSearchResultsDomNode &&
                this.currentSearchResultsDomNode.length
            )
                this.fireEvent(
                    'removeSearchResults', false, this,
                    this.currentSearchResultsDomNode)
            this.currentSearchResultsDomNode = resultsRepresentationDomNode
            setTimeout(():StoreLocator => this.releaseLock(
                `${this.constructor._name}Search`
            ), 0)
        } else if (resultsRepresentation instanceof Promise)
            resultsRepresentation.then((resultsRepresentation:string):void => {
                const resultsRepresentationDomNode:$DomNode = $(
                    resultsRepresentation)
                if (this.resultsDomNode && !this.fireEvent(
                    'addSearchResults', false, this,
                    resultsRepresentationDomNode, this.resultsDomNode,
                    this.currentSearchResultsDomNode || []
                ))
                    this.resultsDomNode.html(resultsRepresentationDomNode)
                if (
                    this.currentSearchResultsDomNode &&
                    this.currentSearchResultsDomNode.length
                )
                    this.fireEvent(
                        'removeSearchResults', false, this,
                        this.currentSearchResultsDomNode)
                this.currentSearchResultsDomNode = resultsRepresentationDomNode
                this.releaseLock(`${this._name}Search`)
            })
        this.currentSearchText = searchText
        this.currentSearchResults = searchResults.slice()
        return this
    }
    /**
     * Opens current search results.
     * @param event - Object with meta data for current event which has
     * triggered to show search results.
     * @returns The current instance.
     */
    openSearchResults(event:?Object):StoreLocator {
        if (event)
            event.stopPropagation()
        this.getUpdateSearchResultsHandler()(event)
        if (this.resultsDomNode && !this.resultsDomNode.hasClass(
            'open'
        ) && !this.fireEvent(
            'openSearchResults', false, this, event, this.resultsDomNode
        ))
            this.resultsDomNode.addClass('open')
        return this
    }
    /**
     * Closes current search results.
     * @param event - Object with meta data for current event which has
     * triggered to close search results.
     * @returns The current instance.
     */
    closeSearchResults(event:?Object = null):StoreLocator {
        if (event)
            event.stopPropagation()
        if (this.resultsDomNode && this.resultsDomNode.hasClass(
            'open'
        ) && !this.fireEvent(
            'closeSearchResults', false, this, event, this.resultsDomNode
        ))
            this.resultsDomNode.removeClass('open')
        return this
    }
    /**
     * Initializes googles generic search box and tries to match to open and
     * focus them.
     * @returns The current instance.
     */
    initializeGenericSearchBox():StoreLocator {
        const searchBox:Object = new this.constructor.maps.places.SearchBox(
            this.$domNode.find('input')[0])
        /*
            Bias the search box results towards places that are within the
            bounds of the current map's viewport.
        */
        this.constructor.maps.event.addListener(
            this.map, 'bounds_changed', ():void => searchBox.setBounds(
                this.map.getBounds()))
        /*
            Listen for the event fired when the user selects an item from the
            pick list. Retrieve the matching places for that item.
        */
        this.constructor.maps.event.addListener(
            searchBox, 'places_changed', ():Promise<Array<Object>> =>
                this.ensurePlaceLocations(searchBox.getPlaces()).then((
                    places:Array<Object>
                ):Array<Object> => {
                    const foundPlace:?Object = this.determineBestSearchResult(
                        places)
                    if (foundPlace) {
                        let shortestDistanceInMeter:number = Number.MAX_VALUE
                        let matchingMarker:?Object = null
                        for (const marker:Object of this.markers) {
                            const distanceInMeter:number =
                                this.constructor.maps.geometry.spherical
                                    .computeDistanceBetween(
                                        foundPlace.geometry.location,
                                        marker.position)
                            if (distanceInMeter < shortestDistanceInMeter) {
                                shortestDistanceInMeter = distanceInMeter
                                matchingMarker = marker
                            }
                        }
                        if (
                            matchingMarker &&
                            shortestDistanceInMeter <= this._options.searchBox
                        ) {
                            if (this._options.successfulSearchZoom)
                                this.map.setZoom(
                                    this._options.successfulSearchZoom)
                            this.openMarker(matchingMarker)
                            return places
                        }
                        if (this.currentlyOpenWindow) {
                            this.currentlyOpenWindow.isOpen = false
                            this.currentlyOpenWindow.close()
                        }
                        this.map.setCenter(foundPlace.geometry.location)
                        if (this._options.successfulSearchZoom)
                            this.map.setZoom(
                                this._options.successfulSearchZoom)
                    }
                    return places
                }))
        return this
    }
    /**
     * Ensures that every given place have a location property.
     * @param places - Places to check for.
     * @returns A promise which will be resolved if all places are ensured.
     */
    ensurePlaceLocations(places:Array<Object>):Promise<Array<Object>> {
        return new Promise((resolve:PromiseCallbackFunction):void => {
            let runningGeocodes:number = 0
            const geocoder:Object = new this.constructor.maps.Geocoder()
            for (const place:Object of places)
                if (!('geometry' in place && 'location' in place.geometry)) {
                    this.warn(
                        'Found place "{1}" doesn\'t have a location. Full ' +
                        'object:', place.name)
                    this.warn(place)
                    this.info(
                        'Geocode will be determined separately. With address' +
                        ' "{1}".', place.name)
                    runningGeocodes += 1
                    /* eslint-disable no-loop-func */
                    geocoder.geocode({address: place.name}, (
                        results:Array<Object>, status:number
                    ):void => {
                        runningGeocodes -= 1
                        if (status === this.constructor.maps.GeocoderStatus.OK)
                            place.geometry = results[0].geometry
                        else {
                            delete places[places.indexOf(place)]
                            this.warn(
                                'Found place "{1}" couldn\'t be geocoded by ' +
                                'google. Removing it from the places list.',
                                place.name)
                        }
                        if (runningGeocodes === 0)
                            resolve(places)
                    })
                    /* eslint-enable no-loop-func */
                }
        })
    }
    /**
     * Determines the best search result from given list of candidates.
     * Currently the nearest result to current viewport will be preferred.
     * @param candidates - List of search results to determine best from.
     * @returns The determined best result.
     */
    determineBestSearchResult(candidates:Array<Object>):?Object {
        let result:?Object = null
        if (candidates.length) {
            let shortestDistanceInMeter:number = Number.MAX_VALUE
            for (const candidate:Object of candidates) {
                const distanceInMeter:number = this.constructor.maps.geometry
                    .spherical.computeDistanceBetween(
                        candidate.geometry.location, this.map.getCenter())
                if (distanceInMeter < shortestDistanceInMeter) {
                    result = candidate
                    shortestDistanceInMeter = distanceInMeter
                }
            }
        }
        return result
    }
    /**
     * Is triggered if the complete map ist loaded.
     * @returns The current instance.
     */
    onLoaded():StoreLocator {
        setTimeout(():$DomNode => this.$domNode.find('input').fadeIn(
            this._options.inputFadeInOption
        ), this._options.showInputAfterLoadedDelayInMilliseconds)
        return this
    }
    /**
     * Registers given store to the google maps canvas.
     * @param store - Store object to create a marker for.
     * @returns The created marker.
     */
    createMarker(store:Object):Object {
        let index:number = 0
        while (this.seenLocations.includes(
            `${store.latitude}-${store.longitude}`
        )) {
            if (index % 2)
                store.latitude +=
                    this._options.distanceToMoveByDuplicatedEntries
            else
                store.longitude +=
                    this._options.distanceToMoveByDuplicatedEntries
            index += 1
        }
        this.seenLocations.push(`${store.latitude}-${store.longitude}`)
        const marker:Object = {
            position: new this.constructor.maps.LatLng(
                store.latitude, store.longitude),
            map: this.map,
            data: store
        }
        if (
            store.markerIconFileName || this._options.defaultMarkerIconFileName
        ) {
            marker.icon = $.extend({}, this._options.marker.icon)
            if (marker.icon.size)
                marker.icon.size = new this.constructor.maps.Size(
                    marker.icon.size.width, marker.icon.size.height,
                    marker.icon.size.unit, marker.icon.size.unit)
            if (marker.icon.scaledSize)
                marker.icon.scaledSize = new this.constructor.maps.Size(
                    marker.icon.scaledSize.width,
                    marker.icon.scaledSize.height,
                    marker.icon.scaledSize.unit,
                    marker.icon.scaledSize.unit)
            if (store.markerIconFileName)
                marker.icon.url = this._options.iconPath +
                    store.markerIconFileName
            else
                marker.icon.url = this._options.iconPath +
                    this._options.defaultMarkerIconFileName
        }
        if (store.title)
            marker.title = store.title
        marker.infoWindow = new this.constructor.maps.InfoWindow({content: ''})
        marker.infoWindow.isOpen = false
        this.constructor.maps.event.addListener(
            marker.infoWindow, 'closeclick', ():void => {
                marker.infoWindow.isOpen = false
            })
        marker.nativeMarker = new this.constructor.maps.Marker(marker)
        this.constructor.maps.event.addListener(
            marker.nativeMarker, 'click', this.getMethod(
                'openMarker', this, marker))
        this.markers.push(marker)
        return marker.nativeMarker
    }
    /**
     * Opens given marker info window. And closes a potential opened windows.
     * @param marker - Marker to open.
     * @param event - Event which has triggered the marker opening call.
     * @returns The current instance.
     */
    openMarker(marker:Object, event:?Object):StoreLocator {
        if (event)
            event.stopPropagation()
        this.highlightMarker(marker, event, 'stop')
        /*
            We have to ensure that the minimum zoom level has one more then
            the clustering can appear. Since a cluster hides an open window.
        */
        if (
            'cluster' in this._options.marker &&
            this._options.marker.cluster.maxZoom &&
            this.map.getZoom() <= this._options.marker.cluster.maxZoom
        )
            this.map.setZoom(this._options.marker.cluster.maxZoom + 1)
        this.closeSearchResults(event)
        if (
            this.currentlyOpenWindow === marker.infoWindow &&
            this.currentlyOpenWindow.isOpen
        )
            return this
        this.fireEvent('infoWindowOpen', event, marker)
        marker.refreshSize = ():void =>
            // Simulates a content update to enforce info box size adjusting.
            marker.infoWindow.setContent(marker.infoWindow.getContent())
        const infoWindow:string|Object = this.makeInfoWindow(marker)
        if (typeof infoWindow === 'string')
            marker.infoWindow.setContent(infoWindow)
        else {
            marker.infoWindow.setContent(
                this._options.infoWindow.loadingContent)
            infoWindow.then((infoWindow:Object):void =>
                marker.infoWindow.setContent(infoWindow))
        }
        if (this.currentlyOpenWindow) {
            this.currentlyOpenWindow.isOpen = false
            this.currentlyOpenWindow.close()
        }
        this.currentlyOpenWindow = marker.infoWindow
        marker.infoWindow.isOpen = true
        marker.infoWindow.open(this.map, marker.nativeMarker)
        this.map.panTo(marker.nativeMarker.position)
        this.map.panBy(
            0, -this._options.infoWindow.additionalMoveToBottomInPixel)
        this.fireEvent('infoWindowOpened', event, marker)
        return this
    }
    /**
     * Focuses given place on map.
     * @param place - Place to open.
     * @param event - Event object which has triggered requested place opening.
     * @returns The current instance.
     */
    openPlace(place:Object, event:?Object):StoreLocator {
        if (event)
            event.stopPropagation()
        this.closeSearchResults(event)
        if (this.currentlyOpenWindow) {
            this.currentlyOpenWindow.isOpen = false
            this.currentlyOpenWindow.close()
        }
        this.map.setCenter(place.geometry.location)
        this.map.setZoom(this._options.successfulSearchZoom)
        return this
    }
    /**
     * Opens given marker info window. And closes a potential opened windows.
     * @param marker - Marker to Highlight.
     * @param event - Event object for corresponding event that has the
     * highlighting requested.
     * @param type - Type of highlighting.
     * @returns The current instance.
     */
    highlightMarker(
        marker:Object, event:?Object, type:string = 'bounce'
    ):StoreLocator {
        if (event)
            event.stopPropagation()
        if (this.currentlyHighlightedMarker) {
            if ('nativeMarker' in this.currentlyHighlightedMarker)
                this.currentlyHighlightedMarker.nativeMarker.setAnimation(null)
            this.currentlyHighlightedMarker.isHighlighted = false
            this.currentlyHighlightedMarker = null
        }
        if ('nativeMarker' in marker)
            if (type === 'stop')
                marker.nativeMarker.setAnimation(null)
            else {
                /*
                    We have to ensure that the minimum zoom level has one more
                    then the clustering can appear. Since a cluster hides an
                    open window.
                */
                if (
                    'cluster' in this._options.marker &&
                    this._options.marker.cluster.maxZoom &&
                    this.map.getZoom() <=
                        this._options.marker.cluster.maxZoom &&
                    'position' in marker.nativeMarker &&
                    this.map.getBounds().contains(
                        marker.nativeMarker.positioning)
                ) {
                    this.map.setCenter(marker.nativeMarker.position)
                    this.map.setZoom(this._options.marker.cluster.maxZoom + 1)
                }
                if (
                    marker !== this.currentlyHighlightedMarker &&
                    marker.nativeMarker
                ) {
                    marker.nativeMarker.setAnimation(
                        this.constructor.maps.Animation[type.toUpperCase()])
                    marker.isHighlighted = true
                    this.currentlyHighlightedMarker = marker
                }
                this.fireEvent('markerHighlighted', marker)
            }
        return this
    }
    /**
     * Takes the marker for a store and creates the HTML content of the info
     * window.
     * @param marker - Marker to generate info window for.
     * @returns Info window markup.
     */
    makeInfoWindow(marker:Object):string|Object {
        if ($.isFunction(this._options.infoWindow.content))
            return this._options.infoWindow.content.apply(this, arguments)
        if ('content' in this._options.infoWindow)
            return this._options.infoWindow.content
        let content:string = '<div>'
        for (const name:string in marker.data)
            if (marker.data.hasOwnProperty(name))
                content += `${name}: ${marker.data[name]}<br />`
        return `${content}</div>`
    }
    /**
     * Takes the search results and creates the HTML content of the search
     * results.
     * @param searchResults - Search result to generate markup for.
     * @returns Generated markup.
     */
    makeSearchResults(searchResults:Array<Object>):Promise<any>|string {
        if ($.isFunction(this._options.searchBox.content))
            return this._options.searchBox.content.apply(this, arguments)
        if ('content' in this._options.searchBox.content)
            return this._options.searchBox.content
        let content:string = ''
        for (const result:Object of searchResults) {
            content += '<div>'
            for (const name:string in result.data)
                if (result.data.hasOwnProperty(name))
                    content += `${name}: ${result.data[name]}<br />`
            content += '</div>'
        }
        return content
    }
}
// endregion
$.fn.StoreLocator = function():any {
    return $.Tools().controller(StoreLocator, arguments, this)
}
/** The jQuery-storeLocator plugin class. */
export default StoreLocator
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
