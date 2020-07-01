// #!/usr/bin/env node
// -*- coding: utf-8 -*-
/** @module storelocator */
'use strict'
/* !
    region header
    [Project page](https://torben.website/storeLocator)

    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import {Tools, $} from 'clientnode'
import {$DomNode, $Global, Mapping, TimeoutPromise} from 'clientnode/type'
import JQuery from 'jquery'
import MarkerClusterer from '@google/markerclustererplus'

import {
    Icon,
    Item,
    MapArea,
    MapEventListener,
    MapGeocoder,
    MapGeocoderResult,
    MapGeocoderStatus,
    MapImpl,
    MapMarker,
    MapPlaceResult,
    MapPlacesService,
    MapPosition,
    MapReadonlyMarkerOptions,
    Maps,
    MapSearchBox,
    Options,
    SearchOptions,
    Square,
    Store,
    Position
} from './type'
// endregion
// region plugins/classes
/**
 * A storelocator plugin to represent searchable/clusterable items on an
 * interactive map.
 * @property static:applicationInterfaceLoad - Holds the currently promise to
 * retrieve a new maps application interface.
 * @property static:maps - Holds the currently used maps scope.
 *
 * @property static:_name - Defines this class name to allow retrieving them
 * after name mangling.
 *
 * @property currentlyHighlightedMarker - Saves currently highlighted marker
 * instance.
 * @property currentlyOpenWindow - Saves currently opened window instance.
 * @property currentSearchResultRange - Public editable property to set current
 * search result range. This is useful for pagination implementations in
 * template level.
 * @property currentSearchResults - Saves last found search results.
 * @property currentSearchResultsDomNode - Saves current search results content
 * dom node.
 * @property currentSearchSegments - Saves last searched segments.
 * @property currentSearchText - Saves last searched string.
 * @property currentSearchWords - Saves last searched words.
 * @property defaultSearchOptions - Sets default search box options.
 * @property map - Holds the currently used map instance.
 * @property markerClusterer - Holds the currently used marker cluster instance.
 * @property markers - Saves all recognized markers.
 * @property resultsDomNode - Saves currently opened results dom node or null
 * if no results exists yet.
 * @property searchResultsDirty - Indicates whether current search results
 * aren't valid anymore.
 * @property searchResultsStyleProperties - Dynamically computed CSS properties
 * to append to search result list (derived from search input field).
 * @property seenLocations - Saves all seen locations to recognize duplicates.
 *
 * @property _options - Saves all plugin interface options.
 * @property _options.applicationInterface - To store application interface
 * options in.
 * @property _options.applicationInterface.url - URL tor retrieve google maps
 * application interface.
 * @property _options.applicationInterface.callbackName - Global resource path
 * to callback function to trigger when google has finished loading the
 * application interface.
 * @property _options.applicationInterface.key - Application interface key to
 * authenticate against google maps application interface.
 * @property _options.stores - URL to retrieve stores, list of stores or object
 * describing bounds to create random stores within. If a "generateProperties"
 * function is given it will be called to retrieve additional properties for
 * each store. The specified store will be given to the function.
 * @property _options.additionalStoreProperties - Additional static store
 * properties which will be available to each store.
 * @property _options.iconPath - Path prefix to search for marker icons.
 * @property _options.defaultMarkerIconFileName - Specifies a fallback marker
 * icon (if no store specific icon was set). If set to "null" google will place
 * a fallback icon.
 * @property _options.startLocation - If not provided we initialize the map
 * with center in current location determined by internet protocol address. If
 * an object is given a "latitude" and "longitude" with a saved float are
 * assumed.
 * @property _options.fallbackLocation - Fallback location if automatic
 * location determination has failed.
 * @property _options.fallbackLocation.latitude - Latitude value.
 * @property _options.fallbackLocation.longitude - Longitude value.
 * @property _options.ip - If provided given ip will be used to determine
 * current location instead of automatically determined one.
 * @property _options.ipToLocationApplicationInterface - Configuration for ip
 * to location conversion.
 * @property _options.ipToLocationApplicationInterface.bounds - Defines bounds
 * within determined locations should be. If resolved location isn't within
 * this location it will be ignored.
 * @property _options.ipToLocationApplicationInterface.bounds.northEast -
 * Defines north east bound.
 * @property _options.ipToLocationApplicationInterface.bounds.northEast
 * .latitude - North east latitude bond.
 * @property _options.ipToLocationApplicationInterface.bounds.northEast
 * .longitude - North east longitude bond.
 * @property _options.ipToLocationApplicationInterface.bounds.southWest -
 * Defined south west bound.
 * @property _options.ipToLocationApplicationInterface.bounds.southWest
 * .latitude - South east latitude bound.
 * @property _options.ipToLocationApplicationInterface.bounds.southWest
 * .longitude - South west longitude bound.
 * @property _options.ipToLocationApplicationInterface.key - Key to let the api
 * identify your service plan.
 * @property _options.ipToLocationApplicationInterface.protocol - Protocol to
 * use for api requests.
 * @property _options.ipToLocationApplicationInterface.timeoutInMilliseconds -
 * Time to wait for ip resolve. If time is up initialize on given fallback
 * location.
 * @property _options.ipToLocationApplicationInterface.url - IP to location
 * determination application interface url. {1}, {2} and {3} represents
 * currently used protocol, key and potentially given ip.
 * @property _options.map - Initial view properties.
 * @property _options.showInputAfterLoadedDelayInMilliseconds - Delay before we
 * show search input field.
 * @property _options.inputFadeInOption - Transition options to show search
 * input field.
 * @property _options.distanceToMoveByDuplicatedEntries - Distance to move if
 * stores are determined with same latitude and longitude.
 * @property _options.marker - Options passed to the marker cluster. If set to
 * "null" no marker cluster will appear.
 * @property _options.icon - Options passed to the icon.
 * @property _options.successfulSearchZoomLevel - Specifies a zoom value wich
 * will be adjusted after successfully picked a search result. If set to "null"
 * no zoom change happens.
 * @property _options.infoWindow - Info window options.
 * @property _options.infoWindow.content - Function or string returning or
 * representing the info box. If a function is given and a promise is returned
 * the info box will be filled with the given loading content and updated with
 * the resolved data. The function becomes the corresponding marker as first
 * argument and the store locator instance as second argument. If nothing is
 * provided all available data will be listed in a generic info window.
 * @property _options.infoWindow.additionalMoveToBottomInPixel - Additional
 * move to bottom relative to the marker if an info window has been opened.
 * @property _options.infoWindow.loadingContent - Content to show in the info
 * window during info window load.
 * @property _options.searchOptions - If a number is given a generic search
 * will be provided and given number will be interpret as search result
 * precision tolerance to identify a marker as search result.
 * @property _options.searchOptions.stylePropertiesToDeriveFromInputField -
 * List of cascading style properties to derive from input field and use for
 * search box.
 * @property _options.searchOptions.properties - Specify which store data
 * should contain given search text.
 * @property _options.searchOptions.maximumNumberOfResults - Limits the auto
 * complete result list.
 * @property _options.searchOptions.loadingContent - Markup to display while
 * the results are loading.
 * @property _options.searchOptions.generic - Specifies options for the
 * additional generic search to add to specific search results.
 * @property _options.searchOptions.generic.number - A tuple describing a range
 * of minimal to maximal limits of additional generic google suggestions
 * depending on number of local search results.
 * @property _options.searchOptions.generic.maximalDistanceInMeter - Range to
 * specify maximal distance from current position to search suggestions.
 * @property _options.searchOptions.generic.filter - Specifies a callback which
 * gets a relevant place to decide if the place should be included (returns a
 * boolean value).
 * @property _options.searchOptions.generic.prefer - Specifies a boolean value
 * indicating if generic search results should be the first results.
 * @property _options.searchOptions.generic.retrieveOptions - Specifies how a
 * generic place search should be done (google maps request object
 * specification).
 * @property _options.searchOptions.content - Defines how to render the search
 * results. This can be a callback or a string returning or representing the
 * search results. If a function is given and a promise is returned the info
 * box will be filled with the given loading content and updated with the
 * resolved data. The function becomes search results as first argument, a
 * boolean value as second argument indicating if the maximum number of search
 * results was reached and the store locator instance itself as third argument.
 * If nothing is provided all available data will be listed in a generic info
 * window.
 * @property _options.searchOptions.resultAggregation - "Union" or "cut".
 * @property _options.searchOptions.normalizer - Pure function to normalize
 * strings before searching against them.
 * @property _options.onInfoWindowOpen - Triggers if a marker info window will
 * be opened.
 * @property _options.onInfoWindowOpened - Triggers if a marker info window has
 * finished opening.
 * @property _options.onAddSearchResults - Triggers before new search results
 * appears.
 * @property _options.onRemoveSearchResults - Triggers before old search
 * results will be removed.
 * @property _options.onOpenSearchResults - Triggers before search result box
 * appears.
 * @property _options.onCloseSearchResults - Triggers before search result box
 * will be hidden.
 * @property _options.onMarkerHighlighted - Triggers after a marker starts to
 * highlight.
 */
export class StoreLocator<TElement extends HTMLElement = HTMLElement> extends
    Tools<TElement> {
    static applicationInterfaceLoad:Promise<$DomNode>
    static maps:Maps

    static _name:string = 'StoreLocator'

    currentlyHighlightedMarker:Item|null = null
    currentlyOpenWindow:Item|null = null
    currentSearchResultRange:Array<number>|null = null
    currentSearchResults:Array<Item> = []
    currentSearchResultsDomNode:$DomNode|null = null
    currentSearchSegments:Array<string> = []
    currentSearchText:string|null = null
    currentSearchWords:Array<string> = []
    defaultSearchOptions:SearchOptions = {} as SearchOptions
    map:MapImpl<TElement> = {} as MapImpl<TElement>
    markerClusterer:MarkerClusterer|null = null
    markers:Array<Item> = []
    resetMarkerCluster:Function|null = null
    resultsDomNode:$DomNode|null = null
    searchResultsDirty:boolean = false
    searchResultsStyleProperties:Mapping<number|string> = {}
    seenLocations:Array<string> = []
    $domNode:$DomNode<TElement> = {} as $DomNode<TElement>

    _options:Options = {} as Options
    /**
     * Entry point for object orientated plugin.
     * @param options - Options to overwrite default ones.
     * @returns Currently selected dom node.
     */
    initialize(options:object = {}):Promise<$DomNode<TElement>> {
        // region properties
        this._options = {
            additionalStoreProperties: {},
            applicationInterface: {
                url:
                    'https://maps.googleapis.com/maps/api/js?{1}v=3&' +
                    'sensor=false&libraries=places,geometry&callback={2}',
                callbackName: null,
                key: null
            },
            defaultMarkerIconFileName: null,
            fallbackLocation: {latitude: 51.124213, longitude: 10.147705},
            iconPath: '',
            ip: 'check',
            ipToLocationApplicationInterface: {
                bounds: {
                    northEast: {latitude: 85, longitude: 180},
                    southWest: {latitude: -85, longitude: -180}
                },
                key: null,
                protocol: 'inherit',
                timeoutInMilliseconds: 5000,
                url:
                    '{1}://api.ipstack.com/{3}?access_key={2}&fields=' +
                    'latitude,longitude'
            },
            limit: {
                northEast: {latitude: 85, longitude: 180},
                southWest: {latitude: -85, longitude: -180}
            },
            map: {
                maxZoom: 0,
                minZoom: 9999,
                zoom: 3,
                disableDefaultUI: true,
                zoomControl: true,
                streetViewControl: true
            },
            startLocation: null,
            stores: {
                generateProperties: (store:object):object => store,
                northEast: {latitude: 85, longitude: 180},
                number: 100,
                southWest: {latitude: -85, longitude: -180}
            },
            showInputAfterLoadedDelayInMilliseconds: 500,
            input: {
                hide: {opacity: 0},
                showAnimation: [{opacity: 1}, {duration: 'fast'}]
            },
            distanceToMoveByDuplicatedEntries: 0.0001,
            marker: {
                cluster: {
                    gridSize: 100,
                    // TODO take existing images.
                    imagePath:
                        'https://cdn.rawgit.com/googlemaps/' +
                        'js-marker-clusterer/gh-pages/images/m',
                    maxZoomLevel: 11
                },
                icon: {
                    scaledSize: {height: 49, unit: 'px', width: 44},
                    size: {height: 49, unit: 'px', width: 44}
                }
            },
            successfulSearchZoomLevel: 12,
            infoWindow: {
                additionalMoveToBottomInPixel: 120,
                content: null,
                loadingContent: '<div class="idle">loading...</div>'
            },
            searchOptions: 50,
            onInfoWindowOpen: Tools.noop,
            onInfoWindowOpened: Tools.noop,
            onAddSearchResults: Tools.noop,
            onRemoveSearchResults: Tools.noop,
            onOpenSearchResults: Tools.noop,
            onCloseSearchResults: Tools.noop,
            onMarkerHighlighted: Tools.noop
        } as unknown as Options
        // endregion
        // Merges given options with default options recursively.
        super.initialize(options)
        this.defaultSearchOptions = {
            generic: {
                filter: (place:MapPlaceResult):boolean =>
                    /(?:^| )(?:Deutschland|Germany)( |$)/i.test(
                        place.formatted_address as string
                    ),
                maximalDistanceInMeter: 1000000,
                number: [2, 5],
                prefer: true,
                retrieveOptions: {radius: 50000, query: ''}
            },
            loadingContent: this._options.infoWindow.loadingContent,
            maximumNumberOfResults: 50,
            noResultsContent: '<div class="no-results">No results found</div>',
            normalizer: (value:string):string =>
                `${value}`
                    .toLowerCase()
                    .replace(/[-_]+/g, '')
                    .replace(/ß/g, 'ss')
                    .replace(/(^| )str\./g, '$1strasse')
                    .replace(/[& ]+/g, ' '),
            properties: [
                'eMailAddress', 'eMail', 'email',
                'formattedAddress', 'formatted_address', 'address',
                'name',
                'street', 'streetAndStreetnumber',
                'zip', 'zipCode', 'postalCode'
            ],
            resultAggregation: 'cut',
            stylePropertiesToDeriveFromInputField: [
                'backgroundColor',
                'left',
                'maxWidth',
                'minWidth',
                'position',
                'paddingBottom',
                'paddingLeft',
                'paddingRight',
                'paddingTop',
                'right',
                'top',
                'width'
            ]
        }
        this.$domNode.find('input').css(this._options.input.hide)
        let loadInitialized:boolean = true
        const applicationInterfaceLoadCallbacks:{
            resolve:Function;
            reject:Function;
            resolved:boolean;
        } = {
            resolve: Tools.noop,
            reject: Tools.noop,
            resolved: false
        }
        if (typeof StoreLocator.applicationInterfaceLoad !== 'object') {
            loadInitialized = false
            StoreLocator.applicationInterfaceLoad = new Promise((
                resolve:Function, reject:Function
            ):void => {
                applicationInterfaceLoadCallbacks.resolve = ():void => {
                    applicationInterfaceLoadCallbacks.resolved = true
                    resolve(this.$domNode)
                }
                applicationInterfaceLoadCallbacks.reject = reject
            })
        }
        const result:Promise<$DomNode<TElement>> =
            StoreLocator.applicationInterfaceLoad
                .then(this.bootstrap.bind(this))
                .then(():StoreLocator<TElement> => this.fireEvent('loaded'))
                .then(():$DomNode<TElement> => this.$domNode)
        if ('google' in $.global && 'maps' in $.global.google) {
            StoreLocator.maps = $.global.google.maps
            if (!applicationInterfaceLoadCallbacks.resolved)
                Tools.timeout(():void =>
                    applicationInterfaceLoadCallbacks.resolve(this.$domNode)
                )
        } else if (!loadInitialized) {
            const callbackName:string =
                this._options.applicationInterface.callbackName ?
                    this._options.applicationInterface.callbackName :
                    StoreLocator.determineUniqueScopeName();
            ($.global as unknown as Mapping<Function>)[callbackName] = (
            ):void => {
                StoreLocator.maps = $.global.google.maps
                applicationInterfaceLoadCallbacks.resolve(this.$domNode)
            }
            $.getScript(Tools.stringFormat(
                this._options.applicationInterface.url,
                this._options.applicationInterface.key ?
                    `key=${this._options.applicationInterface.key}&` :
                    '',
                (
                    window === ($.global as unknown as Window) ?
                        'window' :
                        'global'
                ) +
                `.${callbackName}`
            ))
                .done(applicationInterfaceLoadCallbacks.resolve.bind(
                    this, this.$domNode
                ))
                .fail((
                    response:JQuery.jqXHR<string|undefined>,
                    error:JQuery.Ajax.ErrorTextStatus
                ):void => applicationInterfaceLoadCallbacks.reject(error))
        }
        return result
    }
    /**
     * Determines useful location cluster, info windows and marker.
     * @returns The current instance.
     */
    bootstrap():Promise<$DomNode<TElement>> {
        if (
            !('location' in $.global) ||
            [null, undefined].includes($.global.location as unknown as null)
        )
            return Promise.resolve(this.$domNode)
        if (this._options.startLocation)
            return this.initializeMap()
        this._options.startLocation = this._options.fallbackLocation
        if ([null, undefined].includes(
            this._options.ipToLocationApplicationInterface.key as null
        ))
            return this.initializeMap()
        /*
            NOTE: If request is slower than the timeout parameter for jsonp
            request the padding function isn't set anymore so an error occurs.
            That's why we use our own timeout implementation.
        */
        let loaded:boolean = false
        return new Promise((resolve:Function, reject:Function):void => {
            const fallbackTimeout:TimeoutPromise = Tools.timeout(
                async ():Promise<void> => {
                    loaded = true
                    await this.initializeMap()
                    resolve(this.$domNode)
                },
                this._options.ipToLocationApplicationInterface
                    .timeoutInMilliseconds
            )
            $.ajax({
                cache: true,
                dataType: 'jsonp',
                url: Tools.stringFormat(
                    this._options.ipToLocationApplicationInterface.url,
                    this._options.ipToLocationApplicationInterface.protocol ===
                        'inherit' ?
                            $.global.location.protocol.substring(
                                0, $.global.location.protocol.length - 1
                            ) :
                            this._options.ipToLocationApplicationInterface
                                .protocol,
                    this._options.ipToLocationApplicationInterface.key,
                    this._options.ip || ''
                )
            }).always(async (
                currentLocation:Position, textStatus:string
            ):Promise<void> => {
                if (!loaded) {
                    fallbackTimeout.clear()
                    loaded = true
                    if (textStatus === 'success')
                        // Check if determined location is within defined bounds.
                        if (
                            !this._options
                                .ipToLocationApplicationInterface.bounds ||
                            (
                                new StoreLocator.maps.LatLngBounds(
                                    new StoreLocator.maps.LatLng(
                                        this._options
                                            .ipToLocationApplicationInterface
                                            .bounds.southWest.latitude,
                                        this._options
                                            .ipToLocationApplicationInterface
                                            .bounds.southWest.longitude
                                    ),
                                    new StoreLocator.maps.LatLng(
                                        this._options
                                            .ipToLocationApplicationInterface
                                            .bounds.northEast.latitude,
                                        this._options
                                            .ipToLocationApplicationInterface
                                            .bounds.northEast.longitude
                                    )
                                )
                            ).contains(new StoreLocator.maps.LatLng(
                                currentLocation.latitude,
                                currentLocation.longitude
                            ))
                        )
                            this._options.startLocation = currentLocation
                    await this.initializeMap()
                    resolve(this.$domNode)
                }
            })
        })
    }
    /**
     * Initializes cluster, info windows and marker.
     * @returns The current instance.
     */
    initializeMap():Promise<$DomNode<TElement>> {
        const startLocation:Position = this._options.startLocation as Position
        this._options.map.center = new StoreLocator.maps.LatLng(
            startLocation.latitude, startLocation.longitude
        )
        this.map = new StoreLocator.maps.Map<TElement>(
            $('<div>').appendTo(this.$domNode.css('display', 'block'))[0] as
                TElement,
            this._options.map
        )
        if (this._options.limit)
            StoreLocator.maps.event.addListener(
                this.map,
                'dragend',
                ():void => {
                    const area:MapArea = new StoreLocator.maps.LatLngBounds(
                        new StoreLocator.maps.LatLng(
                            this._options.limit.southWest.latitude,
                            this._options.limit.southWest.longitude
                        ),
                        new StoreLocator.maps.LatLng(
                            this._options.limit.northEast.latitude,
                            this._options.limit.northEast.longitude
                        )
                    )
                    const currentCenter:MapPosition = this.map.getCenter()
                    if (!area.contains(currentCenter)) {
                        const newCenter:Position = {
                            latitude: currentCenter.lat(),
                            longitude: currentCenter.lng()
                        }
                        if (currentCenter.lng() < area.getSouthWest().lng())
                            newCenter.longitude = area.getSouthWest().lng()
                        if (currentCenter.lng() > area.getNorthEast().lng())
                            newCenter.longitude = area.getNorthEast().lng()
                        if (currentCenter.lat() < area.getSouthWest().lat())
                            newCenter.latitude = area.getSouthWest().lat()
                        if (currentCenter.lat() > area.getNorthEast().lat())
                            newCenter.latitude = area.getNorthEast().lat()
                        this.map.panTo(new StoreLocator.maps.LatLng(
                            newCenter.latitude, newCenter.longitude
                        ))
                    }
                })
        if (this._options.marker.cluster) {
            this.markerClusterer = new MarkerClusterer(
                this.map, [], this._options.marker.cluster
            )
            this.resetMarkerCluster = ():void => {
                const markers:Array<MapMarker> = []
                for (const marker of this.markers) {
                    if (marker.nativeMarker) {
                        marker.nativeMarker.setMap(null)
                        delete marker.nativeMarker
                    }
                    marker.nativeMarker = new StoreLocator.maps.Marker(
                        marker as MapReadonlyMarkerOptions
                    )
                    this.attachMarkerEventListener(marker)
                    markers.push(marker.nativeMarker)
                }
                if (this.markerClusterer) {
                    this.markerClusterer.clearMarkers()
                    this.markerClusterer = new MarkerClusterer(
                        this.map, markers, this._options.marker.cluster
                    )
                }
            }
        }
        // Add a marker for each retrieved store.
        const addMarkerPromise:Promise<Array<Item>> = new Promise((
            resolve:Function, reject:Function
        ):void => {
            if (Array.isArray(this._options.stores))
                for (const store of this._options.stores) {
                    Tools.extend(
                        true, store, this._options.additionalStoreProperties
                    )
                    const marker:MapMarker = this.createMarker(store)
                    if (this.markerClusterer)
                        this.markerClusterer.addMarker(marker)
                }
            else if (typeof this._options.stores === 'string')
                $.getJSON(this._options.stores, (stores:Array<Store>):void => {
                    for (const store of stores) {
                        Tools.extend(
                            true,
                            store,
                            this._options.additionalStoreProperties
                        )
                        const marker:MapMarker = this.createMarker(store)
                        if (this.markerClusterer)
                            this.markerClusterer.addMarker(marker)
                    }
                })
            else {
                const southWest:MapPosition = new StoreLocator.maps.LatLng(
                    this._options.stores.southWest.latitude,
                    this._options.stores.southWest.longitude
                )
                const northEast:MapPosition = new StoreLocator.maps.LatLng(
                    this._options.stores.northEast.latitude,
                    this._options.stores.northEast.longitude
                )
                for (
                    let index:number = 0;
                    index < this._options.stores.number;
                    index++
                ) {
                    const store:Store = Tools.extend(
                        {
                            latitude:
                                southWest.lat() +
                                (northEast.lat() - southWest.lat()) *
                                Math.random(),
                            longitude:
                                southWest.lng() +
                                (northEast.lng() - southWest.lng()) *
                                Math.random()
                        },
                        this._options.additionalStoreProperties
                    )
                    Tools.extend(
                        true,
                        store,
                        this._options.stores.generateProperties(store)
                    )
                    const marker:MapMarker = this.createMarker()
                    if (this.markerClusterer)
                        this.markerClusterer.addMarker(marker)
                }
            }
            resolve(this.markers)
        })
        // Create the search box and link it to the UI element.
        this.map.controls[StoreLocator.maps.ControlPosition.TOP_LEFT].push(
            this.$domNode.find('input')[0]
        )
        if (typeof this._options.searchOptions === 'number')
            this.initializeGenericSearch()
        else {
            StoreLocator.maps.event.addListener(
                this.map, 'click', ():StoreLocator => this.closeSearchResults()
            )
            StoreLocator.maps.event.addListener(
                this.map,
                'dragstart',
                ():StoreLocator<TElement> => this.closeSearchResults()
            )
            this._options.searchOptions = Tools.extend(
                true, this.defaultSearchOptions, this._options.searchOptions
            )
            this.initializeDataSourceSearch()
        }
        // Close marker if zoom level is bigger than the aggregation.
        StoreLocator.maps.event.addListener(
            this.map,
            'zoom_changed',
            ():void => {
                if (
                    typeof this.currentlyOpenWindow === 'object' &&
                    this.currentlyOpenWindow &&
                    this.currentlyOpenWindow.isOpen &&
                    this.map.getZoom() <=
                        this._options.marker.cluster.maxZoomLevel
                ) {
                    this.currentlyOpenWindow.isOpen = false
                    if (this.currentlyOpenWindow.close)
                        this.currentlyOpenWindow.close()
                }
            }
        )
        return new Promise((resolve:Function, reject:Function):void => {
            const listener:MapEventListener =
                StoreLocator.maps.event.addListenerOnce(
                    this.map,
                    'idle',
                    async ():Promise<void> => {
                        listener.remove()
                        await addMarkerPromise
                        resolve(this.$domNode)
                    }
                )
        })
    }
    /**
     * Position search results right below the search input field.
     * @returns The current instance.
     */
    initializeDataSourceSearchResultsBox():StoreLocator<TElement> {
        this.searchResultsStyleProperties = {}
        const $inputDomNode = this.$domNode.find('input')
        const allStyleProperties:Mapping<number|string> =
            $inputDomNode.Tools('style')
        for (const propertyName in allStyleProperties)
            if (
                (this._options.searchOptions as SearchOptions)
                    .stylePropertiesToDeriveFromInputField
                    .includes(propertyName)
            )
                this.searchResultsStyleProperties[propertyName] =
                    allStyleProperties[propertyName]
        const outerHeight:number|undefined =
            this.$domNode.find('input').outerHeight(true)
        if (outerHeight)
            this.searchResultsStyleProperties.marginTop = outerHeight
        // Prepare search result positioning.
        this.resultsDomNode = $('<div>')
            .addClass(Tools.stringCamelCaseToDelimited(
                `${StoreLocator._name}SearchResults`
            ))
            .css(this.searchResultsStyleProperties)
        // Inject the final search results into the dom tree.
        $inputDomNode.after(this.resultsDomNode)
        return this
    }
    /**
     * Initializes a data source based search box to open and focus them
     * matching marker.
     * @returns The current instance.
     */
    initializeDataSourceSearch():StoreLocator<TElement> {
        this.on(this.$domNode, 'keydown', (event:KeyboardEvent):void => {
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
                            this.currentSearchResultRange[1]
                        )
                    ]
                else
                    this.currentSearchResultRange = [
                        0, this.currentSearchResults.length - 1
                    ]
                let currentIndex:number = -1
                if (this.currentlyHighlightedMarker)
                    currentIndex = this.currentSearchResults.indexOf(
                        this.currentlyHighlightedMarker
                    )
                if (event.keyCode === Tools.keyCode.DOWN)
                    if (
                        currentIndex === -1 ||
                        this.currentSearchResultRange[1] < currentIndex + 1
                    )
                        this.highlightMarker(
                            this.currentSearchResults[
                                this.currentSearchResultRange[0]
                            ],
                            event
                        )
                    else
                        this.highlightMarker(
                            this.currentSearchResults[currentIndex + 1], event
                        )
                else if (event.keyCode === Tools.keyCode.UP)
                    if ([this.currentSearchResultRange[0], -1].includes(
                        currentIndex
                    ))
                        this.highlightMarker(
                            this.currentSearchResults[
                                this.currentSearchResultRange[1]
                            ],
                            event
                        )
                    else
                        this.highlightMarker(
                            this.currentSearchResults[currentIndex - 1], event
                        )
                else if (
                    event.keyCode === Tools.keyCode.ENTER &&
                    this.currentlyHighlightedMarker
                ) {
                    event.stopPropagation()
                    if (this.currentlyHighlightedMarker)
                        if (this.currentlyHighlightedMarker.infoWindow)
                            this.openMarker(
                                this.currentlyHighlightedMarker, event
                            )
                        else
                            this.focusPlace(
                                this.currentlyHighlightedMarker, event
                            )
                }
            }
        })
        const $inputDomNode:$DomNode = this.$domNode.find('input')
        this.on($inputDomNode, 'click', ():void => {
            if (this.currentSearchText)
                this.openSearchResults()
        })
        this.on($inputDomNode, 'focus', ():void => {
            if (this.currentSearchText)
                this.openSearchResults()
        })
        this.on($inputDomNode, 'keydown', (event:KeyboardEvent):void => {
            if (Tools.keyCode.DOWN === event.keyCode && this.currentSearchText)
                this.openSearchResults()
        })
        this.on($inputDomNode, 'keyup', this.updateSearchResultsHandler)
        StoreLocator.maps.event.addListener(
            this.map,
            'center_changed',
            ():void => {
                // NOTE: Search results depends on current position.
                if (this.currentSearchText && this.resultsDomNode)
                    this.searchResultsDirty = true
            }
        )
        return this
    }
    /**
     * Triggers on each search request.
     * @returns The current instance.
     */
    get updateSearchResultsHandler():Function {
        const placesService:MapPlacesService =
            new StoreLocator.maps.places.PlacesService(this.map)
        const searchOptions:SearchOptions =
            this._options.searchOptions as SearchOptions
        return Tools.debounce(
            async (event?:KeyboardEvent):Promise<void> => {
                for (const name in Tools.keyCode)
                    if (
                        event &&
                        event.keyCode === Tools.keyCode[name] &&
                        ![
                            'BACKSPACE',
                            'COMMA',
                            'DELETE',
                            'NUMPAD_ADD',
                            'NUMPAD_DECIMAL',
                            'NUMPAD_DIVIDE',
                            'NUMPAD_MULTIPLY',
                            'NUMPAD_SUBTRACT',
                            'PERIOD'
                        ].includes(name)
                    )
                        return
                await this.acquireLock(`${StoreLocator._name}Search`)
                const searchText:string = searchOptions.normalizer(
                   this.$domNode.find('input').val() as string || ''
                )
                if (
                    this.currentSearchText === searchText &&
                    !this.searchResultsDirty
                )
                    return this.releaseLock(`${StoreLocator._name}Search`)
                this.searchResultsDirty = false
                if (!this.resultsDomNode)
                    this.initializeDataSourceSearchResultsBox()
                if (!searchText && this.resultsDomNode) {
                    this.currentSearchResults = []
                    this.currentSearchText = ''
                    this.resultsDomNode.html('')
                    this.fireEvent(
                        'removeSearchResults',
                        false,
                        this,
                        this.currentSearchResultsDomNode
                    )
                    this.currentSearchResultsDomNode = null
                    this.closeSearchResults()
                    return this.releaseLock(`${StoreLocator._name}Search`)
                }
                this.openSearchResults()
                const loadingDomNode:$DomNode =
                    $(searchOptions.loadingContent as string)
                if (
                    this.resultsDomNode &&
                    this.fireEvent(
                        'addSearchResults',
                        false,
                        this,
                        loadingDomNode,
                        this.resultsDomNode,
                        this.currentSearchResultsDomNode || []
                    )
                )
                    /*
                        NOTE: Cast to string because specified signature misses
                        valid wrapped dom node type.
                    */
                    this.resultsDomNode.html(
                        loadingDomNode as unknown as string
                    )
                if (
                    this.currentSearchResultsDomNode &&
                    this.currentSearchResultsDomNode.length
                )
                    this.fireEvent(
                        'removeSearchResults',
                        false,
                        this,
                        this.currentSearchResultsDomNode
                    )
                this.currentSearchResultsDomNode = loadingDomNode
                this.currentSearchWords = searchText.split(' ')
                this.currentSearchSegments = this.currentSearchWords
                if (!this.currentSearchSegments.includes(searchText))
                    this.currentSearchSegments.push(searchText)
                if (searchOptions.generic.number)
                    /*
                        NOTE: Google searches for more items than exists in the
                        specified radius. However the radius is a string in the
                        examples provided by google.
                    */
                    placesService.textSearch(
                        Tools.extend(
                            {
                                location: this.map.getCenter(),
                                query: searchText
                            },
                            searchOptions.generic.retrieveOptions
                        ),
                        (places:Array<MapPlaceResult>):void => {
                            if (places)
                                this.handleGenericSearchResults(
                                    places, searchText
                                )
                        }
                    )
                else
                    this.performLocalSearch(searchText)
            },
            1000
        )
    }
    /**
     * Sorts and filters search results given by google's aplication
     * interface.
     * @param places - List of place objects.
     * @param searchText - Words which should occur in requested search
     * results.
     * @returns Returns current instance.
     */
    handleGenericSearchResults(
        places:Array<MapPlaceResult>, searchText:string
    ):StoreLocator<TElement> {
        const searchResults:Array<Item> = []
        const searchOptions:SearchOptions =
            this._options.searchOptions as SearchOptions
        /*
            NOTE: Since google text search doesn't support sorting by distance
            we have to sort by our own.
        */
        let index:number = 1
        for (const place of places.sort((
            firstPlace:MapPlaceResult, secondPlace:MapPlaceResult
        ):number => {
            let firstDistance:number = 0
            let secondDistance:number = 0
            if (firstPlace.geometry)
                firstDistance = StoreLocator.maps.geometry.spherical
                    .computeDistanceBetween(
                        this.map.getCenter(), firstPlace.geometry.location
                    )
            if (secondPlace.geometry)
                secondDistance = StoreLocator.maps.geometry.spherical
                    .computeDistanceBetween(
                        this.map.getCenter(), secondPlace.geometry.location
                    )
            return firstDistance - secondDistance
        })) {
            index += 1
            let distance:number = 0
            if (place.geometry)
                distance = StoreLocator.maps.geometry.spherical
                    .computeDistanceBetween(
                        this.map.getCenter(), place.geometry.location
                    )
            if (distance > searchOptions.generic.maximalDistanceInMeter)
                break
            if (searchOptions.generic.filter(place)) {
                const result:Item = {
                    data: Tools.extend(
                        place,
                        {
                            address: place.formatted_address,
                            distance: distance,
                            logoFilePath: place.icon ?
                                place.icon.replace(
                                    /^http:(\/\/)/,
                                    `${$.global.location.protocol}$1`
                                ) :
                                null
                        }
                    ),
                    foundWords: this.currentSearchSegments.filter((
                        word:string
                    ):boolean =>
                        place.formatted_address &&
                        place.formatted_address.includes(word) ||
                        (place.name || '').includes(word)
                    ),
                    highlight: (event?:Event, type?:string):void => {
                        result.isHighlighted = type !== 'stop'
                    },
                    isHighlighted: false,
                    isOpen: false,
                    map: this.map,
                    open: (event?:Event):StoreLocator<TElement> =>
                        this.focusPlace(result, event),
                    position: place.geometry ? place.geometry.location : null
                }
                searchResults.push(result)
                if (searchOptions.generic.number[1] < index)
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
        searchText:string, searchResults:Array<Item> = []
    ):StoreLocator<TElement> {
        const searchOptions:SearchOptions =
            this._options.searchOptions as SearchOptions
        const numberOfGenericSearchResults:number = searchResults.length
        const defaultProperties:Array<string>|null =
            searchOptions.hasOwnProperty('properties') ?
                searchOptions.properties :
                null
        for (const marker of this.markers) {
            const properties:Array<string> = defaultProperties ?
                defaultProperties :
                marker.data ? Object.keys(marker.data) : []
            marker.foundWords = []
            for (const key of properties)
                for (const searchWord of this.currentSearchSegments)
                    if (
                        !marker.foundWords.includes(searchWord) &&
                        marker.data &&
                        marker.data[key as keyof Store] &&
                        typeof marker.data[key as keyof Store] === 'string' &&
                        searchOptions.normalizer(
                            marker.data[key as keyof Store] as
                                unknown as string
                        ).includes(searchWord)
                    ) {
                        marker.foundWords.push(searchWord)
                        if (marker.foundWords.length === 1) {
                            marker.open = (event?:Event):Promise<void> =>
                                this.openMarker(marker, event)
                            marker.highlight = (
                                event?:Event, type?:string
                            ):StoreLocator<TElement> =>
                                this.highlightMarker(marker, event, type)
                            if (searchOptions.resultAggregation === 'union')
                                searchResults.push(marker)
                        }
                        if (
                            marker.foundWords.length >=
                                this.currentSearchWords.length &&
                            searchOptions.resultAggregation === 'cut'
                        )
                            searchResults.push(marker)
                    }
        }
        /*
            Remove generic place results if there are enough local search
            results.
        */
        if (
            searchOptions.generic.number &&
            searchResults.length &&
            numberOfGenericSearchResults > searchOptions.generic.number[0] &&
            searchResults.length > searchOptions.generic.number[1]
        )
            searchResults.splice(
                searchOptions.generic.number[0],
                numberOfGenericSearchResults - searchOptions.generic.number[0]
            )
        /*
            Sort results by current map center form nearer to more fare away
            results.
        */
        searchResults.sort((first:Item, second:Item):number => {
            if (searchOptions.generic.prefer)
                if (!first.infoWindow && second.infoWindow)
                    return -1
                else if (!second.infoWindow && first.infoWindow)
                    return 1
            if (first.foundWords.length < second.foundWords.length)
                return 1
            if (second.foundWords.length < first.foundWords.length)
                return -1
            let firstDistance:number = 0
            if (first.position)
                firstDistance = StoreLocator.maps.geometry.spherical
                    .computeDistanceBetween(
                        this.map.getCenter(), first.position
                    )
            let secondDistance:number = 0
            if (second.position)
                secondDistance = StoreLocator.maps.geometry.spherical
                    .computeDistanceBetween(
                        this.map.getCenter(), second.position
                    )
            return firstDistance - secondDistance
        })
        // Slice additional unneeded local search results.
        let limitReached:boolean = false
        if (searchOptions.maximumNumberOfResults < searchResults.length) {
            limitReached = true
            searchResults.splice(
                searchOptions.maximumNumberOfResults, searchResults.length
            )
        }
        // Compile search results markup.
        this.makeSearchResults(searchResults, limitReached).then((
            resultsRepresentation:string
        ):void => {
            const resultsRepresentationDomNode:$DomNode =
                $(resultsRepresentation)
            if (this.resultsDomNode && this.fireEvent(
                'addSearchResults',
                false,
                this,
                resultsRepresentationDomNode,
                this.resultsDomNode,
                this.currentSearchResultsDomNode || []
            ))
                /*
                    NOTE: Cast to string because specified signature misses
                    valid wrapped dom node type.
                */
                this.resultsDomNode.html(
                    resultsRepresentationDomNode as unknown as string
                )
            if (
                this.currentSearchResultsDomNode &&
                this.currentSearchResultsDomNode.length
            )
                this.fireEvent(
                    'removeSearchResults',
                    false,
                    this,
                    this.currentSearchResultsDomNode
                )
            this.currentSearchResultsDomNode = resultsRepresentationDomNode
            this.releaseLock(`${StoreLocator._name}Search`)
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
    openSearchResults(event?:Event):StoreLocator<TElement> {
        if (event)
            event.stopPropagation()
        if (
            this.resultsDomNode &&
            !this.resultsDomNode.hasClass('open') &&
            this.fireEvent(
                'openSearchResults', false, this, event, this.resultsDomNode
            )
        ) {
            for (const propertyName in this.searchResultsStyleProperties)
                if (this.searchResultsStyleProperties.hasOwnProperty(
                    propertyName
                ))
                    this.resultsDomNode.css(
                        propertyName,
                        this.searchResultsStyleProperties[propertyName]
                    )
            this.resultsDomNode.addClass('open')
        }
        return this
    }
    /**
     * Closes current search results.
     * @param event - Object with meta data for current event which has
     * triggered to close search results.
     * @returns The current instance.
     */
    closeSearchResults(event?:Event):StoreLocator<TElement> {
        if (event)
            event.stopPropagation()
        if (
            this.resultsDomNode &&
            this.resultsDomNode.hasClass('open') &&
            this.fireEvent(
                'closeSearchResults', false, this, event, this.resultsDomNode
            )
        ) {
            for (const propertyName in this.searchResultsStyleProperties)
                if (this.searchResultsStyleProperties.hasOwnProperty(
                    propertyName
                ))
                    this.resultsDomNode.css(propertyName, '')
            this.resultsDomNode.removeClass('open')
        }
        return this
    }
    /**
     * Initializes googles generic search box and tries to match to open and
     * focus them.
     * @returns The current instance.
     */
    initializeGenericSearch():StoreLocator<TElement> {
        const searchBox:MapSearchBox = new StoreLocator.maps.places.SearchBox(
            this.$domNode.find('input')[0],
            {bounds: new StoreLocator.maps.LatLngBounds(
                new StoreLocator.maps.LatLng(
                    this._options.limit.southWest.latitude,
                    this._options.limit.southWest.longitude
                ),
                new StoreLocator.maps.LatLng(
                    this._options.limit.northEast.latitude,
                    this._options.limit.northEast.longitude
                )
            )}
        )
        /*
            Bias the search box results towards places that are within the
            bounds of the current map's viewport.
        */
        StoreLocator.maps.event.addListenerOnce(
            this.map,
            'bounds_changed',
            ():void => {
                const bounds = this.map.getBounds()
                if (bounds)
                    searchBox.setBounds(bounds)
            }
        )
        /*
            Listen for the event fired when the user selects an item from the
            pick list. Retrieve the matching places for that item.
        */
        StoreLocator.maps.event.addListenerOnce(
            searchBox,
            'places_changed',
            async ():Promise<void> => {
                const places:Array<MapPlaceResult> =
                    await this.ensurePlaceLocations(searchBox.getPlaces())
                const foundPlace:MapPlaceResult|null =
                    this.determineBestSearchResult(places)
                if (foundPlace) {
                    let shortestDistanceInMeter:number = Number.MAX_VALUE
                    let matchingMarker:Item|undefined
                    for (const marker of this.markers) {
                        let distanceInMeter:number = 0
                        if (foundPlace.geometry && marker.position)
                            distanceInMeter = StoreLocator.maps.geometry
                                .spherical.computeDistanceBetween(
                                    foundPlace.geometry.location,
                                    marker.position
                                )
                        if (distanceInMeter < shortestDistanceInMeter) {
                            shortestDistanceInMeter = distanceInMeter
                            matchingMarker = marker
                        }
                    }
                    if (
                        matchingMarker &&
                        shortestDistanceInMeter <= this._options.searchOptions
                    ) {
                        if (this._options.successfulSearchZoomLevel)
                            this.map.setZoom(
                                this._options.successfulSearchZoomLevel
                            )
                        await this.openMarker(matchingMarker)
                        return
                    }
                    if (this.currentlyOpenWindow) {
                        this.currentlyOpenWindow.isOpen = false
                        if (this.currentlyOpenWindow.close)
                            this.currentlyOpenWindow.close()
                    }
                    if (foundPlace.geometry)
                        this.map.setCenter(foundPlace.geometry.location)
                    if (this._options.successfulSearchZoomLevel)
                        this.map.setZoom(
                            this._options.successfulSearchZoomLevel
                        )
                }
            }
        )
        return this
    }
    /**
     * Ensures that every given place have a location property.
     * @param places - Places to check for.
     * @returns A promise which will be resolved if all places are ensured.
     */
    ensurePlaceLocations(
        places:Array<MapPlaceResult>
    ):Promise<Array<MapPlaceResult>> {
        let runningGeocodes:number = 0
        const geocoder:MapGeocoder = new StoreLocator.maps.Geocoder()
        return new Promise((resolve:Function, reject:Function):void => {
            for (const place of places)
                if (!(place.geometry && place.geometry.location)) {
                    this.warn(
                        `Found place "${place.name}" doesn't have a location` +
                        '. Full object:'
                    )
                    this.warn(place)
                    this.info(
                        'Geocode will be determined separately. With address' +
                        ` "${place.name}".`
                    )
                    runningGeocodes += 1
                    /* eslint-disable no-loop-func */
                    geocoder.geocode(
                        {address: place.name},
                        (
                            results:Array<MapGeocoderResult>,
                            status:MapGeocoderStatus
                        ):void => {
                            runningGeocodes -= 1
                            if (status === StoreLocator.maps.GeocoderStatus.OK)
                                place.geometry = results[0].geometry
                            else {
                                delete places[places.indexOf(place)]
                                this.warn(
                                    `Found place "${place.name}" couldn\'t ` +
                                    'be geocoded by google. Removing it from' +
                                    ' the places list.'
                                )
                            }
                            // Resolve all after last resolved geocoding.
                            if (runningGeocodes === 0)
                                resolve(places)
                        }
                    )
                    /* eslint-enable no-loop-func */
                }
            // Resolve directly if we don't have to wait for any geocoding.
            if (runningGeocodes === 0)
                resolve(places)
        })
    }
    /**
     * Determines the best search result from given list of candidates.
     * Currently the nearest result to current viewport will be preferred.
     * @param candidates - List of search results to determine best from.
     * @returns The determined best result.
     */
    determineBestSearchResult(
        candidates:Array<MapPlaceResult>
    ):MapPlaceResult|null {
        let result:null|MapPlaceResult = null
        if (candidates.length) {
            let shortestDistanceInMeter:number = Number.MAX_VALUE
            for (const candidate of candidates) {
                let distanceInMeter:number = 0
                if (candidate.geometry)
                    distanceInMeter = StoreLocator.maps.geometry.spherical
                        .computeDistanceBetween(
                            candidate.geometry.location, this.map.getCenter()
                        )
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
    onLoaded():StoreLocator<TElement> {
        Tools.timeout(():$DomNode =>
            this.$domNode.find('input').animate(
                ...this._options.input.showAnimation
            ),
            this._options.showInputAfterLoadedDelayInMilliseconds
        )
        return this
    }
    /**
     * Registers given store to the google maps canvas.
     * @param store - Store object to create a marker for.
     * @returns The created marker.
     */
    createMarker(store?:Store):MapMarker {
        let index:number = 0
        if (store && store.latitude && store.longitude) {
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
        }
        const marker:Item = {
            data: store || null,
            foundWords: [],
            highlight: Tools.noop,
            isHighlighted: false,
            isOpen: false,
            map: this.map,
            open: Tools.noop,
            position: (store && store.latitude && store.longitude) ?
                new StoreLocator.maps.LatLng(store.latitude, store.longitude) :
                null
        }
        if (
            store && store.markerIconFileName ||
            this._options.defaultMarkerIconFileName
        ) {
            marker.icon = this._options.marker.icon ?
                Tools.copy(this._options.marker.icon as unknown as Icon) :
                {} as Icon
            if (marker.icon.scaledSize) {
                const square:Square = marker.icon.scaledSize as Square
                marker.icon.scaledSize = new StoreLocator.maps.Size(
                    square.width, square.height, square.unit, square.unit
                )
            }
            if (marker.icon.size) {
                const square:Square = marker.icon.size as Square
                marker.icon.size = new StoreLocator.maps.Size(
                    square.width, square.height, square.unit, square.unit
                )
            }
            if (store && store.markerIconFileName)
                marker.icon.url =
                    this._options.iconPath + store.markerIconFileName
            else
                marker.icon.url =
                    this._options.iconPath +
                    this._options.defaultMarkerIconFileName
        }
        if (store && store.title)
            marker.title = store.title
        marker.infoWindow = new StoreLocator.maps.InfoWindow({content: ''})
        marker.infoWindow.isOpen = false
        marker.nativeMarker = new StoreLocator.maps.Marker(marker)
        this.attachMarkerEventListener(marker)
        this.markers.push(marker)
        return marker.nativeMarker
    }
    /**
     * Adds needed event listener to given marker.
     * @param marker - Marker to attach event listener to.
     * @returns The current instance.
     */
    attachMarkerEventListener(marker:Item):StoreLocator<TElement> {
        StoreLocator.maps.event.addListener(
            marker.infoWindow,
            'closeclick',
            ():void => {
                marker.infoWindow.isOpen = false
            }
        )
        StoreLocator.maps.event.addListener(
            marker.nativeMarker, 'click', this.openMarker.bind(this, marker)
        )
        return this
    }
    /**
     * Opens given marker info window. And closes potentially opened windows.
     * @param marker - Marker to open.
     * @param event - Event which has triggered the marker opening call.
     * @returns The current instance.
     */
    async openMarker(marker:Item, event?:Event):Promise<void> {
        if (event && !('stopPropagation' in event))
            event = null
        this.highlightMarker(marker, event, 'stop')
        /*
            We have to ensure that the minimum zoom level has one more then
            the clustering can appear. Since a cluster hides an open window.
        */
        if (
            'cluster' in this._options.marker &&
            this._options.marker.cluster.maxZoomLevel &&
            this.map.getZoom() <= this._options.marker.cluster.maxZoomLevel
        )
            this.map.setZoom(this._options.marker.cluster.maxZoomLevel + 1)
        this.closeSearchResults(event)
        if (
            this.currentlyOpenWindow &&
            this.currentlyOpenWindow === marker.infoWindow &&
            this.currentlyOpenWindow.isOpen
        )
            return this
        this.fireEvent('infoWindowOpen', false, this, event, marker)
        marker.refreshSize = ():void =>
            // Simulates a content update to enforce info box size adjusting.
            marker.infoWindow.setContent(marker.infoWindow.getContent())
        marker.infoWindow.setContent(this._options.infoWindow.loadingContent)
        marker.infoWindow.setContent(await this.makeInfoWindow(marker))
        if (this.currentlyOpenWindow) {
            this.currentlyOpenWindow.isOpen = false
            this.currentlyOpenWindow.close()
        }
        this.currentlyOpenWindow = marker.infoWindow
        marker.infoWindow.isOpen = true
        marker.infoWindow.open(this.map, marker.nativeMarker)
        this.map.panTo(marker.nativeMarker.position)
        this.map.panBy(
            0, -this._options.infoWindow.additionalMoveToBottomInPixel
        )
        this.fireEvent('infoWindowOpened', false, this, event, marker)
        return this
    }
    /**
     * Focuses given place on map.
     * @param place - Place to open.
     * @param event - Event object which has triggered requested place opening.
     * @returns The current instance.
     */
    focusPlace(place:Item, event?:Event):StoreLocator<TElement> {
        if (event)
            event.stopPropagation()
        this.closeSearchResults(event)
        if (this.currentlyOpenWindow) {
            this.currentlyOpenWindow.isOpen = false
            this.currentlyOpenWindow.close()
        }
        this.map.setCenter(place.position)
        this.map.setZoom(this._options.successfulSearchZoomLevel)
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
        marker:Item, event?:Event, type:string = 'bounce'
    ):StoreLocator<TElement> {
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
                    this._options.marker.cluster.maxZoomLevel &&
                    this.map.getZoom() <=
                        this._options.marker.cluster.maxZoomLevel &&
                    'position' in marker.nativeMarker &&
                    this.map.getBounds().contains(marker.nativeMarker.position)
                ) {
                    this.map.setCenter(marker.nativeMarker.position)
                    this.map.setZoom(
                        this._options.marker.cluster.maxZoomLevel + 1
                    )
                }
                if (
                    marker !== this.currentlyHighlightedMarker &&
                    marker.nativeMarker
                ) {
                    marker.nativeMarker.setAnimation(
                        StoreLocator.maps.Animation[type.toUpperCase()]
                    )
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
     * @param additionalParameter - Additional parameter to forward to options
     * given render callback.
     * @returns Info window markup.
     */
    async makeInfoWindow(
        marker:Item, ...additionalParameter:Array<any>
    ):Promise<string> {
        if ('content' in this._options.infoWindow) {
            if (Tools.isFunction(this._options.infoWindow.content)) {
                const result:Promise<string>|string =
                    this._options.infoWindow.content(
                        marker, ...additionalParameter
                    )
                if (typeof result === 'string')
                    return result
                return await result
            }
            if (this._options.infoWindow.content)
                return this._options.infoWindow.content
        }
        let content:string = '<div>'
        for (const name in marker.data)
            if (marker.data.hasOwnProperty(name))
                content += `${name}: ${marker.data[name]}<br />`
        return `${content}</div>`
    }
    /**
     * Takes the search results and creates the HTML content of the search
     * results.
     * @param searchResults - Search result to generate markup for.
     * @param limitReached - Indicated whether defined limit was reached or
     * not.
     * @returns Generated markup.
     */
    async makeSearchResults(
        searchResults:Array<Item>, limitReached:boolean
    ):Promise<string> {
        const searchOptions:SearchOptions = this._options.searchOptions as
            SearchOptions
        if ('content' in searchOptions) {
            if (Tools.isFunction(searchOptions.content)) {
                const result:Promise<string>|string =
                    searchOptions.content.call(
                        this, searchResults, limitReached
                    )
                if (typeof result === 'string')
                    return result
                return await result
            }
            return searchOptions.content as string
        }
        if (searchResults.length) {
            let content:string = ''
            for (const result of searchResults) {
                content += '<div>'
                for (const name in result.data)
                    if (
                        result.data.hasOwnProperty(name) &&
                        (
                            searchOptions.properties.length === 0 ||
                            searchOptions.properties.includes(name)
                        )
                    )
                        content +=
                            `${name}: ` +
                            Tools.stringMark(
                                `${result.data[name as keyof object]}`,
                                this.currentSearchWords,
                                '<span class="tools-mark">{1}</span>',
                                searchOptions.normalizer
                            ) +
                            '<br />'
                content += '</div>'
            }
            return content
        }
        return searchOptions.noResultsContent
    }
}
export default StoreLocator
// endregion
// region handle $ extending
if ('fn' in $)
    $.fn.StoreLocator = function(...parameter:Array<any>):any {
        return $.Tools().controller(
            StoreLocator, parameter, this as unknown as $DomNode
        )
    }
// endregion
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
