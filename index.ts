// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module storelocator */
'use strict'
/* !
    region header
    [Project page](https://torben.website/storelocator)

    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import Tools, {$} from 'clientnode'
import {
    EvaluationResult,
    Mapping,
    PlainObject,
    ProcedureFunction,
    SecondParameter,
    TimeoutPromise,
    ValueOf,
    $DomNode
} from 'clientnode/type'
import {object} from 'clientnode/property-types'
import MarkerClusterer from '@googlemaps/markerclustererplus'
import Web from 'web-component-wrapper/Web'
import {WebComponentAPI} from 'web-component-wrapper/type'

import {
    Configuration,
    Icon,
    InfoWindow,
    Item,
    MapAnimation,
    MapArea,
    MapEventListener,
    MapGeocoder,
    MapGeocoderResult,
    MapGeocoderStatus,
    MapIcon,
    MapImpl,
    MapMarker,
    MapMarkerClustererOptions,
    MapMarkerOptions,
    MapPlaceResult,
    MapPlacesService,
    MapPosition,
    MapReadonlyMarkerOptions,
    Maps,
    MapSearchBox,
    SearchConfiguration,
    Square,
    Store,
    Position,
    PropertyTypes
} from './type'
// endregion
// region components
/**
 * A store locator component to represent searchable items grouped on an
 * interactive map.
 * @property static:applicationInterfaceLoad - Holds the currently promise to
 * retrieve a new maps application interface.
 * @property static:defaultConfiguration - Holds default extendable
 * configuration object.
 * @property static:defaultSearchConfiguration - Sets default search box
 * options.
 * @property static:maps - Holds the currently used maps scope.
 *
 * @property configuration - Holds given configuration object.
 * @property resolvedConfiguration - Holds resolved configuration object.
 * @property urlConfiguration - URL given configurations object.
 *
 * @property items - Holds all recognized stores to represent as marker.
 * @property searchResultsStyleProperties - Dynamically computed CSS properties
 * to append to search result list (derived from search input field).
 * @property seenLocations - Saves all seen locations to recognize duplicates.
 *
 * @property currentlyHighlightedItem - Holds currently highlighted item.
 * @property currentlyOpenWindow - Holds currently opened window instance.
 * @property currentSearchResultRange - Public editable property to set current
 * search result range. This is useful for pagination implementations in
 * template level.
 * @property currentSearchResults - Saves last found search results.
 * @property currentSearchResultsDomNode - Saves current search results content
 * dom node.
 * @property currentSearchSegments - Saves last searched segments.
 * @property currentSearchText - Saves last searched string.
 * @property currentSearchWords - Saves last searched words.
 * @property searchResultsDirty - Indicates whether current search results
 * aren't valid anymore.
 *
 * @property map - Holds the currently used map instance.
 * @property markerClusterer - Holds the currently used marker cluster
 * instance.
 * @property resetMarkerCluster - API-method to reset marker cluster.
 *
 * @property inputDomNode - Search box input node.
 * @property infoWindowDomNode - Window which is opened when a marker is
 * focused.
 * @property loadingInfoWindowDomNode - Node to show during info window
 * loading.
 * @property loadingSearchDomNode - Node to show during search result loading.
 * @property searchResultsDomNode - Node to represent search results.
 * @property resultsDomNode - Saves currently opened results dom node or null
 * if no results exists yet.
 *
 * @property tools - Holds tools instance for saving instance specific locks.
 */
export class StoreLocator<TElement extends Element = HTMLElement> extends Web<TElement> {
    static applicationInterfaceLoad:Promise<void>
    static content:string = `
        <div>
            <slot name="input"><input /></slot>
            <slot name="infoWindow"></slot>
            <slot name="loadingInfoWindow">
                <div class="idle">loading...</div>
            </slot>
            <slot name="loadingSearch">
                <div class="idle">loading...</div>
            </slot>
            <slot name="searchResults">
                <div class="no-results">No results found</div>
            </slot>
        </div>
    `
    static defaultConfiguration:Configuration = {
        additionalStoreProperties: {},
        applicationInterface: {
            callbackName: null,
            key: null,
            url: `
                https://maps.googleapis.com/maps/api/js ?
                    {1}
                    v=3 &
                    sensor=false &
                    libraries=places,geometry &
                    callback={2}
            `.replace(/[ \n]+/g, '')
        },
        debug: false,
        defaultMarkerIconFileName: null,
        distanceToMoveByDuplicatedEntries: 0.0001,
        fallbackLocation: {latitude: 51.124213, longitude: 10.147705},
        iconPath: '',
        infoWindow: {additionalMoveToBottomInPixel: 120},
        input: {
            hide: {opacity: 0},
            showAnimation: [{opacity: 1}, {duration: 'fast'}]
        },
        ip: 'check',
        ipToLocationApplicationInterface: {
            bounds: {
                northEast: {latitude: 85, longitude: 180},
                southWest: {latitude: -85, longitude: -180}
            },
            key: null,
            protocol: 'https',
            timeoutInMilliseconds: 1000,
            url: `
                {1}//api.ipstack.com/{3} ?
                    access_key={2} &
                    fields=latitude,longitude
            `.replace(/[ \n]+/g, '')
        },
        limit: {
            northEast: {latitude: 85, longitude: 180},
            southWest: {latitude: -85, longitude: -180}
        },
        map: {
            disableDefaultUI: true,
            maxZoom: 0,
            minZoom: 9999,
            streetViewControl: true,
            zoom: 3,
            zoomControl: true
        },
        marker: {
            cluster: {
                gridSize: 100,
                // TODO take existing images.
                imagePath: `
                    https://cdn.rawgit.com/
                    googlemaps/js-marker-clusterer/gh-pages/images/m
                `.replace(/[ \n]+/g, ''),
                maxZoom: 11
            },
            icon: {
                scaledSize: {height: 49, unit: 'px', width: 44},
                size: {height: 49, unit: 'px', width: 44}
            }
        },
        name: 'storeLocator',
        search: 50,
        showInputAfterLoadedDelayInMilliseconds: 500,
        startLocation: null,
        stores: {
            generateProperties: (store:object):object => store,
            northEast: {latitude: 85, longitude: 180},
            number: 100,
            southWest: {latitude: -85, longitude: -180}
        },
        successfulSearchZoomLevel: 12,
        urlModelMask: {
            exclude: false,
            include: {
                model: false,

                reCaptcha: {
                    secret: true,
                    skip: true
                },

                tag: true,
                tags: true
            }
        }
    }
    static defaultSearchConfiguration:SearchConfiguration = {
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
        maximumNumberOfResults: 50,
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
    static maps:Maps
    static observedAttributes:Array<string> = ['configuration']
    static propertyTypes:Mapping<ValueOf<PropertyTypes>> = {
        configuration: object
    }
    static _name:string = 'StoreLocator'

    configuration:Partial<Configuration>|undefined
    resolvedConfiguration:Configuration = {} as Configuration
    urlConfiguration:null|PlainObject = null

    items:Array<Item> = []
    searchResultsStyleProperties:Mapping<number|string> = {}
    seenLocations:Array<string> = []

    currentlyHighlightedItem:Item|null = null
    currentlyOpenWindow:InfoWindow|null = null
    currentSearchResultRange:Array<number>|null = null
    currentSearchResults:Array<Item> = []
    currentSearchResultsDomNode:HTMLElement|null = null
    currentSearchSegments:Array<string> = []
    currentSearchText:string|null = null
    currentSearchWords:Array<string> = []
    searchResultsDirty:boolean = false

    // NOTE: Will be initialized during bootstrapping.
    map:MapImpl<TElement> = null as unknown as MapImpl<TElement>
    markerClusterer:MarkerClusterer|null = null
    resetMarkerCluster:Function|null = null

    inputDomNode:HTMLInputElement = null as unknown as HTMLInputElement
    resultsDomNode:HTMLDivElement|null = null

    readonly self:typeof StoreLocator = StoreLocator

    readonly tools:Tools = new Tools()
    // region live cycle hooks
    /**
     * Defines dynamic getter and setter interface and resolves configuration
     * object. Initializes the map implementation.
     */
    constructor() {
        super()
        /*
            Babels property declaration transformation overwrites defined
            properties at the end of an implicit constructor. So we have to
            redefined them as long as we want to declare expected component
            interface properties to enable static type checks.
        */
        this.defineGetterAndSetterInterface()
        this.resolveConfiguration()
    }
    /**
     * Parses given configuration object and (re-)renders map.
     * @param name - Attribute name which was updates.
     * @param oldValue - Old attribute value.
     * @param newValue - New updated value.
     * @returns Nothing.
     */
    attributeChangedCallback(
        name:string, oldValue:string, newValue:string
    ):void {
        super.attributeChangedCallback(name, oldValue, newValue)

        this.resolveConfiguration()
    }
    /**
     * De-registers all needed event listener.
     * @returns Nothing.
     */
    disconnectedCallback():void {
        super.disconnectedCallback()

        // TODO release event listener.
    }
    /**
     * Triggered when content projected and nested dom nodes are ready to be
     * traversed. Selects all needed dom nodes.
     * @returns A promise resolving to nothing.
     */
    async render():Promise<void> {
        this.inputDomNode =
            this.root.querySelector('[slot="input"]') as HTMLInputElement
        this.infoWindowDomNode =
            this.root.querySelector('[slot="infoWindow"]') as HTMLElement
        this.loadingInfoWindowDomNode =
            this.root.querySelector('[slot="loadingInfoWindow"]') as HTMLElement
        this.loadingSearchDomNode =
            this.root.querySelector('[slot="loadingSearch"]') as HTMLElement
        this.searchResultsDomNode =
            this.root.querySelector('[slot="searchResults"]') as HTMLElement

        $(this.root)
            .find(this.resolvedConfiguration.input.selector)
            .css(this.resolvedConfiguration.input.hide)

        await this.loadMapEnvironmentIfNotAvailable()
    }
    // endregion
    // region event handler
    onMapCenterChanged = ():void => {
        // NOTE: Search results depends on current position.
        if (this.currentSearchText && this.resultsDomNode)
            this.searchResultsDirty = true
    }
    onInputClick = ():void => {
        if (this.currentSearchText)
            this.openSearchResults()
    }
    onInputFocus = ():void => {
        if (this.currentSearchText)
            this.openSearchResults()
    }
    onInputKeyDown = (event:KeyboardEvent):void => {
        if (Tools.keyCode.DOWN === event.keyCode && this.currentSearchText)
            this.openSearchResults()
    }
    onKeyDown = (event:KeyboardEvent):void => {
        /*
            NOTE: Events that doesn't occurs in search context are handled by
            the native map implementation and won't be propagated so we doesn't
            have to care about that.
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
                this.currentSearchResultRange =
                    [0, this.currentSearchResults.length - 1]
            let currentIndex:number = -1
            if (this.currentlyHighlightedItem)
                currentIndex = this.currentSearchResults.indexOf(
                    this.currentlyHighlightedItem
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
                this.currentlyHighlightedItem
            ) {
                event.stopPropagation()
                if (this.currentlyHighlightedItem)
                    if (this.currentlyHighlightedItem.infoWindow)
                        this.openMarker(this.currentlyHighlightedItem, event)
                    else
                        this.focusPlace(this.currentlyHighlightedItem, event)
            }
        }
    }
    // endregion
    // region helper
    // / region configuration
    /**
     * Merges configuration sources into final object.
     * @returns Nothing.
     */
    resolveConfiguration():void {
        this.resolvedConfiguration = Tools.extend(
            true,
            Tools.copy(this.self.defaultConfiguration) as Configuration,
            this.configuration || {}
        )

        this.extendConfigurationByGivenURLParameter()

        if (this.resolvedConfiguration.debug)
            console.debug('Got configuration:', this.resolvedConfiguration)
    }
    /**
     * Extends current configuration object by given url parameter.
     * @param name - URL parameter name to interpret.
     * @returns Nothing.
     */
    extendConfigurationByGivenURLParameter(name?:string):void {
        if (!name)
            name = this.resolvedConfiguration.name

        const parameter:Array<string>|null|string =
            Tools.stringGetURLParameter(name)
        if (typeof parameter === 'string') {
            const evaluated:EvaluationResult =
                Tools.stringEvaluate(decodeURI(parameter))
            if (evaluated.error) {
                console.warn(
                    'Error occurred during processing given url parameter "' +
                    `${name}": ${evaluated.error}`
                )
                return
            }
            if (
                evaluated.result !== null &&
                typeof evaluated.result === 'object'
            ) {
                this.urlConfiguration = Tools.maskObject(
                    evaluated.result, this.resolvedConfiguration.urlModelMask
                ) as PlainObject
                Tools.extend(
                    true, this.resolvedConfiguration, this.urlConfiguration
                )
            }
        }
    }
    // / endregion
    /**
     * Loads google map resources if not loaded yet (or loading triggered).
     * Initializes map instances.
     * @returns Promise resolving when everything is loaded and initialized.
     */
    loadMapEnvironmentIfNotAvailable():Promise<void> {
        let loadInitialized:boolean = true
        const applicationInterfaceLoadCallbacks:{
            reject:ProcedureFunction
            resolve:ProcedureFunction
            resolved:boolean
        } = {
            reject: Tools.noop,
            resolve: Tools.noop,
            resolved: false
        }
        if (typeof this.self.applicationInterfaceLoad !== 'object') {
            loadInitialized = false
            this.self.applicationInterfaceLoad = new Promise((
                resolve:ProcedureFunction, reject:ProcedureFunction
            ):void => {
                applicationInterfaceLoadCallbacks.resolve = ():void => {
                    applicationInterfaceLoadCallbacks.resolved = true
                    resolve()
                }
                applicationInterfaceLoadCallbacks.reject = reject
            })
        }

        const result:Promise<void> = this.self.applicationInterfaceLoad
            .then(this.bootstrap)
            .then(():boolean =>
                this.dispatchEvent(
                    new CustomEvent('loaded', {detail: {target: this}})
                )
            )

        if ($.global.window?.google?.maps) {
            this.self.maps = $.global.window.google.maps
            if (!applicationInterfaceLoadCallbacks.resolved)
                Tools.timeout(():Promise<void>|void =>
                    applicationInterfaceLoadCallbacks.resolve()
                )
        } else if (!loadInitialized) {
            const callbackName:string =
                this.resolvedConfiguration.applicationInterface.callbackName ?
                    this.resolvedConfiguration.applicationInterface.callbackName :
                    Tools.determineUniqueScopeName()

            const callback:ProcedureFunction = ():void => {
                if (!applicationInterfaceLoadCallbacks.resolved)
                    if ($.global.window?.google?.maps) {
                        this.self.maps = $.global.window.google.maps
                        applicationInterfaceLoadCallbacks.resolve()
                    } else
                        applicationInterfaceLoadCallbacks.reject(
                            new Error('No google maps environment set.')
                        )
            }
            ;($.global as unknown as Mapping<Function>)[callbackName] =
                callback

            $.getScript(Tools.stringFormat(
                this.resolvedConfiguration.applicationInterface.url,
                this.resolvedConfiguration.applicationInterface.key ?
                    `key=${this.resolvedConfiguration.applicationInterface.key}&` :
                    '',
                (
                    window === ($.global as unknown as Window) ?
                        'window' :
                        'global'
                ) +
                `.${callbackName}`
            ))
                .done(callback)
                .fail((
                    response:JQuery.jqXHR<string|undefined>,
                    error:JQuery.Ajax.ErrorTextStatus
                ):Promise<void>|void =>
                    applicationInterfaceLoadCallbacks.reject(error)
                )
        }

        return result
    }
    /**
     * Determines useful location cluster, info windows and marker.
     * @returns Promise resolving to the current instance.
     */
    bootstrap = ():Promise<void> => {
        if (this.resolvedConfiguration.startLocation)
            return this.initializeMap()
        this.resolvedConfiguration.startLocation =
            this.resolvedConfiguration.fallbackLocation
        if ([null, undefined].includes(
            this.resolvedConfiguration.ipToLocationApplicationInterface.key as
                null
        ))
            return this.initializeMap()
        /*
            NOTE: If request is slower than the timeout parameter for jsonp
            request the padding function isn't set anymore so an error occurs.
            That's why we use our own timeout implementation.
        */
        let loaded:boolean = false
        return new Promise((
            resolve:ProcedureFunction, reject:ProcedureFunction
        ):void => {
            const ipToLocationAPIConfiguration:Configuration[
                'ipToLocationApplicationInterface'
            ] = this.resolvedConfiguration.ipToLocationApplicationInterface

            const fallbackTimeout:TimeoutPromise = Tools.timeout(
                async ():Promise<void> => {
                    loaded = true
                    await this.initializeMap()
                    resolve()
                },
                ipToLocationAPIConfiguration.timeoutInMilliseconds
            )
            $.ajax({
                cache: true,
                dataType: 'jsonp',
                url: Tools.stringFormat(
                    ipToLocationAPIConfiguration.url,
                    (
                        ipToLocationAPIConfiguration.protocol &&
                        !ipToLocationAPIConfiguration.protocol.endsWith(':')
                    ) ?
                        `${ipToLocationAPIConfiguration.protocol}:` :
                        ipToLocationAPIConfiguration.protocol,
                    ipToLocationAPIConfiguration.key,
                    this.resolvedConfiguration.ip || ''
                )
            }).always(async (
                currentLocation:Position, textStatus:string
            ):Promise<void> => {
                if (!loaded) {
                    fallbackTimeout.clear()
                    loaded = true
                    if (textStatus === 'success')
                        /*
                            Check if determined location is within defined
                            bounds.
                        */
                        if (
                            !ipToLocationAPIConfiguration.bounds ||
                            (new this.self.maps.LatLngBounds(
                                new this.self.maps.LatLng(
                                    ipToLocationAPIConfiguration
                                        .bounds.southWest.latitude,
                                    ipToLocationAPIConfiguration
                                        .bounds.southWest.longitude
                                ),
                                new this.self.maps.LatLng(
                                    ipToLocationAPIConfiguration
                                        .bounds.northEast.latitude,
                                    ipToLocationAPIConfiguration
                                        .bounds.northEast.longitude
                                )
                            ))
                                .contains(new this.self.maps.LatLng(
                                    currentLocation.latitude,
                                    currentLocation.longitude
                                ))
                        )
                            this.resolvedConfiguration.startLocation =
                                currentLocation
                    await this.initializeMap()
                    resolve()
                }
            })
        })
    }
    /**
     * Initializes cluster, info windows and marker.
     * @returns Promise resolving to the current instance.
     */
    initializeMap():Promise<void> {
        const startLocation:Position =
            this.resolvedConfiguration.startLocation as Position
        this.resolvedConfiguration.map.center = new this.self.maps.LatLng(
            startLocation.latitude, startLocation.longitude
        )
        ;(this.root as HTMLElement).style.display = 'block'
        this.map = new this.self.maps.Map<TElement>(
            this.root as unknown as TElement, this.resolvedConfiguration.map
        )
        if (this.resolvedConfiguration.limit)
            this.self.maps.event.addListenerOnce(
                this.map,
                'dragend',
                ():void => {
                    const area:MapArea = new StoreLocator.maps.LatLngBounds(
                        new StoreLocator.maps.LatLng(
                            this.resolvedConfiguration.limit.southWest.latitude,
                            this.resolvedConfiguration.limit.southWest.longitude
                        ),
                        new StoreLocator.maps.LatLng(
                            this.resolvedConfiguration.limit.northEast.latitude,
                            this.resolvedConfiguration.limit.northEast.longitude
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
                        this.map.panTo(new this.self.maps.LatLng(
                            newCenter.latitude, newCenter.longitude
                        ))
                    }
                })
        if (this.resolvedConfiguration.marker.cluster) {
            this.markerClusterer = new MarkerClusterer(
                this.map, [], this.resolvedConfiguration.marker.cluster
            )
            this.resetMarkerCluster = ():void => {
                const markers:Array<MapMarker> = []
                for (const item of this.items) {
                    if (item.marker) {
                        item.marker.setMap(null)
                        delete item.marker
                    }
                    item.marker = new this.self.maps.Marker(
                        this.createMarkerConfiguration(item)
                    )
                    this.attachMarkerEventListener(item)
                    markers.push(item.marker)
                }
                if (this.markerClusterer) {
                    this.markerClusterer.clearMarkers()
                    this.markerClusterer = new MarkerClusterer(
                        this.map,
                        markers,
                        this.resolvedConfiguration.marker.cluster as
                            MapMarkerClustererOptions
                    )
                }
            }
        }
        // Add a marker for each retrieved store.
        const addMarkerPromise:Promise<Array<Item>> = new Promise((
            resolve:Function, reject:Function
        ):void => {
            if (Array.isArray(this.resolvedConfiguration.stores))
                for (const store of this.resolvedConfiguration.stores) {
                    Tools.extend(
                        true,
                        store,
                        this.resolvedConfiguration.additionalStoreProperties
                    )
                    const marker:MapMarker = this.createMarker(store)
                    if (this.markerClusterer)
                        this.markerClusterer.addMarker(marker)
                }
            else if (typeof this.resolvedConfiguration.stores === 'string')
                $.getJSON(
                    this.resolvedConfiguration.stores,
                    (stores:Array<Store>):void => {
                        for (const store of stores) {
                            Tools.extend(
                                true,
                                store,
                                this.resolvedConfiguration
                                    .additionalStoreProperties
                            )
                            const marker:MapMarker = this.createMarker(store)
                            if (this.markerClusterer)
                                this.markerClusterer.addMarker(marker)
                        }
                    }
                )
            else {
                const southWest:MapPosition = new this.self.maps.LatLng(
                    this.resolvedConfiguration.stores.southWest.latitude,
                    this.resolvedConfiguration.stores.southWest.longitude
                )
                const northEast:MapPosition = new this.self.maps.LatLng(
                    this.resolvedConfiguration.stores.northEast.latitude,
                    this.resolvedConfiguration.stores.northEast.longitude
                )
                for (
                    let index:number = 0;
                    index < this.resolvedConfiguration.stores.number;
                    index++
                ) {
                    const store:Store = {
                        latitude:
                            southWest.lat() +
                            (northEast.lat() - southWest.lat()) *
                            Math.random(),
                        longitude:
                            southWest.lng() +
                            (northEast.lng() - southWest.lng()) *
                            Math.random(),
                        ...this.resolvedConfiguration.additionalStoreProperties
                    }
                    Tools.extend(
                        true,
                        store,
                        this.resolvedConfiguration.stores.generateProperties(store)
                    )
                    const marker:MapMarker = this.createMarker()
                    if (this.markerClusterer)
                        this.markerClusterer.addMarker(marker)
                }
            }
            resolve(this.items)
        })
        // Create the search box and link it to the UI element.
        this.map.controls[this.self.maps.ControlPosition.TOP_LEFT]
            .push(this.inputDomNode)
        if (typeof this.resolvedConfiguration.search === 'number')
            this.initializeGenericSearch()
        else {
            this.self.maps.event.addListenerOnce(
                this.map, 'click', ():void => this.closeSearchResults()
            )
            this.self.maps.event.addListenerOnce(
                this.map, 'dragstart', ():void => this.closeSearchResults()
            )
            this.resolvedConfiguration.search = Tools.extend(
                true, 
                Tools.copy(this.self.defaultSearchConfiguration),
                this.resolvedConfiguration.search
            )
            this.initializeDataSourceSearch()
        }
        const markerClusterZoomLevel:number =
            this.markerClusterer &&
            (this.resolvedConfiguration.marker.cluster as MapMarkerClustererOptions)
                .maxZoom ||
            0
        if (markerClusterZoomLevel > 0)
            // Close marker if zoom level is bigger than the aggregation.
            this.self.maps.event.addListenerOnce(
                this.map,
                'zoom_changed',
                ():void => {
                    if (
                        typeof this.currentlyOpenWindow === 'object' &&
                        this.currentlyOpenWindow?.isOpen &&
                        this.map.getZoom() <= markerClusterZoomLevel
                    ) {
                        this.currentlyOpenWindow.isOpen = false
                        if (this.currentlyOpenWindow.close)
                            this.currentlyOpenWindow.close()
                    }
                }
            )
        return new Promise((resolve:Function, reject:Function):void => {
            const doResolve:Function = async ():Promise<void> => {
                await addMarkerPromise
                resolve()
            }
            if (this.self.maps.mockup)
                doResolve()
            const listener:MapEventListener =
                this.self.maps.event.addListenerOnce(
                    this.map, 'idle', async ():Promise<void> => {
                        listener.remove()
                        doResolve()
                    }
                )
        })
    }
    // TODO
    /**
     * Position search results right below the search input field.
     * @returns Nothing.
     */
    initializeDataSourceSearchResultsBox():void {
        this.searchResultsStyleProperties = {}
        const allStyleProperties:Mapping<number|string> =
            $(this.inputDomNode).Tools('style')
        for (const propertyName in allStyleProperties)
            if (
                (this.resolvedConfiguration.search as SearchConfiguration)
                    .stylePropertiesToDeriveFromInputField
                    .includes(propertyName)
            )
                this.searchResultsStyleProperties[propertyName] =
                    allStyleProperties[propertyName]
        const outerHeight:number|undefined =
            $(this.inputDomNode).outerHeight(true)
        if (outerHeight)
            this.searchResultsStyleProperties.marginTop = outerHeight
        // Prepare search result positioning.
        this.resultsDomNode = $('<div>')
            .addClass(Tools.stringCamelCaseToDelimited(
                `${this.self._name}SearchResults`
            ))
            .css(this.searchResultsStyleProperties)[0] as HTMLDivElement
        // Inject the final search results into the dom tree.
        this.inputDomNode.parentNode!
            .insertBefore(this.resultsDomNode, this.inputDomNode.nextSibling)
    }
    /**
     * Initializes a data source based search box to open and focus them
     * matching marker.
     * @returns Nothing.
     */
    initializeDataSourceSearch():void {
        this.root.addEventListener('keydown', this.onKeyDown as EventListener)
        this.inputDomNode.addEventListener('click', this.onInputClick)
        this.inputDomNode.addEventListener('focus', this.onInputFocus)
        this.inputDomNode.addEventListener('keydown', this.onInputKeyDown)
        this.inputDomNode.addEventListener(
            'keyup', this.updateSearchResultsHandler
        )
        this.self.maps.event.addListenerOnce(
            this.map, 'center_changed', this.onMapCenterChanged
        )
    }
    /**
     * Triggers on each search request.
     * @returns Debounced function.
     */
    get updateSearchResultsHandler():EventListener {
        const placesService:MapPlacesService =
            new this.self.maps.places.PlacesService(this.map)
        const searchOptions:SearchConfiguration =
            this.resolvedConfiguration.search as SearchConfiguration
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
                await this.tools.acquireLock(`${this.self._name}Search`)
                const searchText:string =
                    searchOptions.normalizer(this.inputDomNode.value)
                if (
                    this.currentSearchText === searchText &&
                    !this.searchResultsDirty
                )
                    return this.tools.releaseLock(`${this.self._name}Search`)
                this.searchResultsDirty = false
                if (!this.resultsDomNode)
                    this.initializeDataSourceSearchResultsBox()
                if (!searchText && this.resultsDomNode) {
                    this.currentSearchResults = []
                    this.currentSearchText = ''
                    this.resultsDomNode.innerHTML = ''
                    if (this.dispatchEvent(new CustomEvent(
                        'removeSearchResults',
                        {detail: {
                            searchResultsDomNode:
                                this.currentSearchResultsDomNode,
                            target: this
                        }}
                    )))
                        this.closeSearchResults()
                    this.currentSearchResultsDomNode = null
                    return this.tools.releaseLock(`${this.self._name}Search`)
                }
                this.openSearchResults()
                let loadingDomNode:HTMLElement = document.createElement('div')
                loadingDomNode.innerHTML = searchOptions.loadingContent
                loadingDomNode = loadingDomNode.firstChild as HTMLElement
                if (
                    this.resultsDomNode &&
                    this.dispatchEvent(new CustomEvent(
                        'addSearchResults',
                        {detail: {
                            currentSearchResultsDomNode:
                                this.currentSearchResultsDomNode,
                            loadingDomNode,
                            resultsDomNode: this.resultsDomNode,
                            target: this
                        }}
                    ))
                )
                    /*
                        NOTE: Cast to string because specified signature misses
                        valid wrapped dom node type.
                    */
                    this.resultsDomNode.appendChild(loadingDomNode)
                if (this.currentSearchResultsDomNode)
                    this.dispatchEvent(new CustomEvent(
                        'removeSearchResults',
                        {detail: {
                            currentSearchResultsDomNode:
                                this.currentSearchResultsDomNode,
                            target: this
                        }}
                    ))
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
                        {
                            ...searchOptions.generic.retrieveOptions,
                            location: this.map.getCenter(),
                            query: searchText
                        },
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
     * @returns Nothing.
     */
    handleGenericSearchResults(
        places:Array<MapPlaceResult>, searchText:string
    ):void {
        const searchResults:Array<Item> = []
        const searchOptions:SearchConfiguration =
            this.resolvedConfiguration.search as SearchConfiguration
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
                firstDistance = this.self.maps.geometry.spherical
                    .computeDistanceBetween(
                        this.map.getCenter(), firstPlace.geometry.location
                    )
            if (secondPlace.geometry)
                secondDistance = this.self.maps.geometry.spherical
                    .computeDistanceBetween(
                        this.map.getCenter(), secondPlace.geometry.location
                    )
            return firstDistance - secondDistance
        })) {
            index += 1
            let distance:number = 0
            if (place.geometry)
                distance = this.self.maps.geometry.spherical
                    .computeDistanceBetween(
                        this.map.getCenter(), place.geometry.location
                    )
            if (distance > searchOptions.generic.maximalDistanceInMeter)
                break
            if (searchOptions.generic.filter(place)) {
                const result:Item = {
                    data: {
                        ...place,
                        address: place.formatted_address,
                        distance: distance,
                        logoFilePath: place.icon ?
                            place.icon.replace(
                                /^http:(\/\/)/,
                                `${$.global.location.protocol}$1`
                            ) :
                            null
                    },
                    foundWords: this.currentSearchSegments.filter((
                        word:string
                    ):boolean =>
                        place.formatted_address?.includes(word) ||
                        (place.name || '').includes(word)
                    ),
                    highlight: (event?:Event, type?:string):void => {
                        result.isHighlighted = type !== 'stop'
                    },
                    isHighlighted: false,
                    isOpen: false,
                    open: (event?:Event):void =>
                        this.focusPlace(result, event),
                    position: place.geometry ? place.geometry.location : null
                }
                searchResults.push(result)
                if (searchOptions.generic.number[1] < index)
                    break
            }
        }
        this.performLocalSearch(searchText, searchResults)
    }
    /**
     * Performs a search on locally given store data.
     * @param searchText - Text to search for.
     * @param searchResults - A list if generic search results.
     * @returns Nothing.
     */
    performLocalSearch(
        searchText:string, searchResults:Array<Item> = []
    ):void {
        const searchOptions:SearchConfiguration =
            this.resolvedConfiguration.search as SearchConfiguration
        const numberOfGenericSearchResults:number = searchResults.length
        const defaultProperties:Array<string>|null =
            searchOptions.hasOwnProperty('properties') ?
                searchOptions.properties :
                null
        for (const item of this.items) {
            const properties:Array<string> = defaultProperties ?
                defaultProperties :
                item.data ? Object.keys(item.data) : []
            item.foundWords = []
            for (const key of properties)
                for (const searchWord of this.currentSearchSegments)
                    if (
                        !item.foundWords.includes(searchWord) &&
                        item.data &&
                        item.data[key as keyof Store] &&
                        typeof item.data[key as keyof Store] === 'string' &&
                        searchOptions.normalizer(
                            item.data[key as keyof Store] as unknown as string
                        ).includes(searchWord)
                    ) {
                        item.foundWords.push(searchWord)
                        if (item.foundWords.length === 1) {
                            item.open = (event?:Event):Promise<void> =>
                                this.openMarker(item, event)
                            item.highlight = (
                                event?:Event, type?:string
                            ):void => this.highlightMarker(item, event, type)
                            if (searchOptions.resultAggregation === 'union')
                                searchResults.push(item)
                        }
                        if (
                            item.foundWords.length >=
                                this.currentSearchWords.length &&
                            searchOptions.resultAggregation === 'cut'
                        )
                            searchResults.push(item)
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
                firstDistance = this.self.maps.geometry.spherical
                    .computeDistanceBetween(
                        this.map.getCenter(), first.position
                    )
            let secondDistance:number = 0
            if (second.position)
                secondDistance = this.self.maps.geometry.spherical
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
            let resultsRepresentationDomNode:HTMLElement =
                document.createElement('div')
            resultsRepresentationDomNode.innerHTML = resultsRepresentation
            resultsRepresentationDomNode =
                resultsRepresentationDomNode.firstChild as HTMLElement
            if (
                this.resultsDomNode &&
                this.dispatchEvent(new CustomEvent(
                    'addSearchResults',
                    {detail: {
                        resultsRepresentationDomNode,
                        resultsDomNode: this.resultsDomNode,
                        currenSearchResultsDomNode:
                            this.currentSearchResultsDomNode,
                        target: this
                    }}
                ))
            )
                this.resultsDomNode.appendChild(resultsRepresentationDomNode)
            if (this.currentSearchResultsDomNode)
                this.dispatchEvent(new CustomEvent(
                    'removeSearchResults',
                    {detail: {
                        currentSearchResultsDomNode:
                            this.currentSearchResultsDomNode,
                        target: this
                    }}
                ))
            this.currentSearchResultsDomNode = resultsRepresentationDomNode
            this.tools.releaseLock(`${this.self._name}Search`)
        })
        this.currentSearchText = searchText
        this.currentSearchResults = searchResults.slice()
    }
    /**
     * Opens current search results.
     * @param event - Object with meta data for current event which has
     * triggered to show search results.
     * @returns Nothing.
     */
    openSearchResults(event?:Event):void {
        if (event)
            event.stopPropagation()
        if (
            this.resultsDomNode &&
            !this.resultsDomNode.getAttribute('class')?.includes('open') &&
            this.dispatchEvent(new CustomEvent(
                'openSearchResults',
                {detail: {
                    resultsDomNode: this.resultsDomNode,
                    target: this
                }}
            ))
        ) {
            for (const propertyName in this.searchResultsStyleProperties)
                if (this.searchResultsStyleProperties.hasOwnProperty(
                    propertyName
                ))
                    this.resultsDomNode.style[propertyName as 'display'] =
                        `${this.searchResultsStyleProperties[propertyName]}`
            this.resultsDomNode.setAttribute('class', 'open')
        }
    }
    /**
     * Closes current search results.
     * @param event - Object with meta data for current event which has
     * triggered to close search results.
     * @returns Nothing.
     */
    closeSearchResults(event?:Event):void {
        if (event)
            event.stopPropagation()
        if (
            this.resultsDomNode!.getAttribute('class')?.includes('open') &&
            this.dispatchEvent(new CustomEvent(
                'closeSearchResults',
                {detail: {
                    currentSearchResultsDomNode: this.resultsDomNode,
                    target: this
                }}
            ))
        ) {
            for (const propertyName in this.searchResultsStyleProperties)
                if (this.searchResultsStyleProperties.hasOwnProperty(
                    propertyName
                ))
                    this.resultsDomNode!.style[propertyName as 'display'] = ''
            this.resultsDomNode!.setAttribute(
                'class',
                this.resultsDomNode!
                    .getAttribute('class')?.replace('open', '') ||
                    ''
            )
        }
    }
    /**
     * Initializes googles generic search box and tries to match to open and
     * focus them.
     * @returns Nothing.
     */
    initializeGenericSearch():void {
        const searchBox:MapSearchBox = new this.self.maps.places.SearchBox(
            this.inputDomNode,
            {bounds: new this.self.maps.LatLngBounds(
                new this.self.maps.LatLng(
                    this.resolvedConfiguration.limit.southWest.latitude,
                    this.resolvedConfiguration.limit.southWest.longitude
                ),
                new this.self.maps.LatLng(
                    this.resolvedConfiguration.limit.northEast.latitude,
                    this.resolvedConfiguration.limit.northEast.longitude
                )
            )}
        )
        /*
            Bias the search box results towards places that are within the
            bounds of the current map's viewport.
        */
        this.self.maps.event.addListenerOnce(
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
        this.self.maps.event.addListenerOnce(
            searchBox,
            'places_changed',
            async ():Promise<void> => {
                const places:Array<MapPlaceResult> =
                    await this.ensurePlaceLocations(searchBox.getPlaces())
                const foundPlace:MapPlaceResult|null =
                    this.determineBestSearchResult(places)
                if (foundPlace) {
                    let shortestDistanceInMeter:number = Number.MAX_VALUE
                    let matchingItem:Item|undefined
                    for (const item of this.items) {
                        let distanceInMeter:number = 0
                        if (foundPlace.geometry && item.position)
                            distanceInMeter = this.self.maps.geometry
                                .spherical.computeDistanceBetween(
                                    foundPlace.geometry.location, item.position
                                )
                        if (distanceInMeter < shortestDistanceInMeter) {
                            shortestDistanceInMeter = distanceInMeter
                            matchingItem = item
                        }
                    }
                    if (
                        matchingItem &&
                        shortestDistanceInMeter <= this.resolvedConfiguration.search
                    ) {
                        if (this.resolvedConfiguration.successfulSearchZoomLevel)
                            this.map.setZoom(
                                this.resolvedConfiguration.successfulSearchZoomLevel
                            )
                        await this.openMarker(matchingItem)
                        return
                    }
                    if (this.currentlyOpenWindow) {
                        this.currentlyOpenWindow.isOpen = false
                        if (this.currentlyOpenWindow.close)
                            this.currentlyOpenWindow.close()
                    }
                    if (foundPlace.geometry)
                        this.map.setCenter(foundPlace.geometry.location)
                    if (this.resolvedConfiguration.successfulSearchZoomLevel)
                        this.map.setZoom(
                            this.resolvedConfiguration.successfulSearchZoomLevel
                        )
                }
            }
        )
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
        const geocoder:MapGeocoder = new this.self.maps.Geocoder()
        return new Promise((resolve:Function, reject:Function):void => {
            for (const place of places)
                if (!place.geometry?.location) {
                    console.warn(
                        `Found place "${place.name}" doesn't have a location` +
                        '. Full object:'
                    )
                    console.warn(place)
                    console.info(
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
                            if (status === this.self.maps.GeocoderStatus.OK)
                                place.geometry = results[0].geometry
                            else {
                                delete places[places.indexOf(place)]
                                console.warn(
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
                    distanceInMeter = this.self.maps.geometry.spherical
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
     * @returns Nothing.
     */
    onLoaded():void {
        Tools.timeout(():$DomNode =>
            $(this.inputDomNode).animate(
                ...this.resolvedConfiguration.input.showAnimation
            ),
            this.resolvedConfiguration.showInputAfterLoadedDelayInMilliseconds
        )
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
                        this.resolvedConfiguration.distanceToMoveByDuplicatedEntries
                else
                    store.longitude +=
                        this.resolvedConfiguration.distanceToMoveByDuplicatedEntries
                index += 1
            }
            this.seenLocations.push(`${store.latitude}-${store.longitude}`)
        }
        const item:Item = {
            data: store || null,
            foundWords: [],
            highlight: Tools.noop,
            isHighlighted: false,
            isOpen: false,
            open: Tools.noop,
            position: (store && store.latitude && store.longitude) ?
                new this.self.maps.LatLng(store.latitude, store.longitude) :
                null
        }
        if (
            store?.markerIconFileName ||
            this.resolvedConfiguration.defaultMarkerIconFileName
        ) {
            item.icon = this.resolvedConfiguration.marker.icon ?
                Tools.copy(this.resolvedConfiguration.marker.icon as unknown as Icon) :
                {} as Icon
            if (item.icon.scaledSize) {
                const square:Square = item.icon.scaledSize as Square
                item.icon.scaledSize = new this.self.maps.Size(
                    square.width, square.height, square.unit, square.unit
                )
            }
            if (item.icon.size) {
                const square:Square = item.icon.size as Square
                item.icon.size = new this.self.maps.Size(
                    square.width, square.height, square.unit, square.unit
                )
            }
            if (store?.markerIconFileName)
                item.icon.url =
                    this.resolvedConfiguration.iconPath + store.markerIconFileName
            else
                item.icon.url =
                    this.resolvedConfiguration.iconPath +
                    this.resolvedConfiguration.defaultMarkerIconFileName
        }
        if (store?.title)
            item.title = store.title
        item.infoWindow = new this.self.maps.InfoWindow({content: ''}) as
            InfoWindow
        item.infoWindow.isOpen = false
        item.marker = new this.self.maps.Marker(
            this.createMarkerConfiguration(item)
        )
        this.attachMarkerEventListener(item)
        this.items.push(item)
        return item.marker
    }
    /**
     * Create marker configuration from given item.
     * @param item - Marker to derive a configuration from.
     * @returns Configuration object.
     */
    createMarkerConfiguration(item:Item):MapMarkerOptions {
        return {
            // anchorPoint: Point
            // animation: Animation
            clickable: true,
            crossOnDrag: true,
            // cursor: string
            draggable: false,
            icon: item.icon as MapIcon,
            label: item.title,
            map: this.map,
            opacity: .9,
            optimized: true,
            // place: Place
            position: item.position as MapPosition,
            // shape: MarkerShape
            title: item.title,
            visible: true,
            zIndex: 1
        }
    }
    /**
     * Adds needed event listener to given item marker.
     * @param item - Marker to attach event listener to.
     * @returns Nothing.
     */
    attachMarkerEventListener(item:Item):void {
        this.self.maps.event.addListenerOnce(
            item.infoWindow as InfoWindow,
            'closeclick',
            ():void => {
                (item.infoWindow as InfoWindow).isOpen = false
            }
        )
        this.self.maps.event.addListenerOnce(
            item.marker as MapMarker,
            'click',
            this.openMarker.bind(this, item)
        )
    }
    /**
     * Opens given item's marker info window and closes potentially opened
     * windows.
     * @param item - Item's marker to open.
     * @param event - Event which has triggered the marker opening call.
     * @returns Promise resolving to nothing.
     */
    async openMarker(item:Item, event?:Event):Promise<void> {
        if (event && !event.stopPropagation)
            event = undefined
        this.highlightMarker(item, event, 'stop')
        /*
            We have to ensure that the minimum zoom level has one more then
            the clustering can appear. Since a cluster hides an open window.
        */
        if (
            this.resolvedConfiguration.marker.cluster?.maxZoom &&
            this.map.getZoom() <= this.resolvedConfiguration.marker.cluster.maxZoom
        )
            this.map.setZoom(this.resolvedConfiguration.marker.cluster.maxZoom + 1)
        this.closeSearchResults(event)
        if (
            this.currentlyOpenWindow?.isOpen &&
            this.currentlyOpenWindow === item.infoWindow
        )
            return
        if (this.dispatchEvent(new CustomEvent(
            'infoWindowOpen',
            {detail: {
                event,
                item,
                target: this
            }}
        ))) {
            const infoWindow:InfoWindow = item.infoWindow as InfoWindow
            item.refreshSize = ():void =>
                /*
                    Simulates a content update to enforce info box size
                    adjusting.
                */
                infoWindow.setContent(infoWindow.getContent())
            infoWindow.setContent(
                this.resolvedConfiguration.infoWindow.loadingContent
            )
            infoWindow.setContent(await this.makeInfoWindow(item))
            if (this.currentlyOpenWindow) {
                this.currentlyOpenWindow.isOpen = false
                this.currentlyOpenWindow.close()
            }
            infoWindow.isOpen = true
            this.currentlyOpenWindow = infoWindow
            infoWindow.open(this.map, item.marker)
            this.map.panTo(item.position as MapPosition)
            this.map.panBy(
                0,
                -this.resolvedConfiguration.infoWindow
                    .additionalMoveToBottomInPixel
            )
            this.dispatchEvent(new CustomEvent(
                'infoWindowOpened', {detail: {event, item, target: this}}
            ))
        }
    }
    /**
     * Focuses given place on map.
     * @param place - Place to open.
     * @param event - Event object which has triggered requested place opening.
     * @returns Nothing.
     */
    focusPlace(place:Item, event?:Event):void {
        if (event)
            event.stopPropagation()
        this.closeSearchResults(event)
        if (this.currentlyOpenWindow) {
            this.currentlyOpenWindow.isOpen = false
            this.currentlyOpenWindow.close()
        }
        this.map.setCenter(place.position as MapPosition)
        this.map.setZoom(this.resolvedConfiguration.successfulSearchZoomLevel)
    }
    /**
     * Opens given item's marker info window and closes a potential opened
     * windows.
     * @param item - Marker to Highlight.
     * @param event - Event object for corresponding event that has the
     * highlighting requested.
     * @param type - Type of highlighting.
     * @returns Nothing.
     */
    highlightMarker(item:Item, event?:Event, type:string = 'bounce'):void {
        if (event)
            event.stopPropagation()
        if (this.currentlyHighlightedItem) {
            if (this.currentlyHighlightedItem.marker)
                this.currentlyHighlightedItem.marker.setAnimation(null)
            this.currentlyHighlightedItem.isHighlighted = false
            this.currentlyHighlightedItem = null
        }
        if (item.marker)
            if (type === 'stop')
                item.marker.setAnimation(null)
            else {
                /*
                    We have to ensure that the minimum zoom level has one more
                    then the clustering can appear. Since a cluster hides an
                    open window.
                */
                if (
                    this.resolvedConfiguration.marker.cluster?.maxZoom &&
                    this.map.getZoom() <=
                        this.resolvedConfiguration.marker.cluster.maxZoom &&
                    item.position &&
                    (this.map.getBounds() as MapArea)
                        .contains(item.position as MapPosition)
                ) {
                    this.map.setCenter(item.position as MapPosition)
                    this.map.setZoom(this.resolvedConfiguration.marker.cluster.maxZoom + 1)
                }
                if (item !== this.currentlyHighlightedItem && item.marker) {
                    item.marker.setAnimation(
                        this.self.maps.Animation[
                            type.toUpperCase() as keyof MapAnimation
                        ]
                    )
                    item.isHighlighted = true
                    this.currentlyHighlightedItem = item
                }
                this.dispatchEvent(new CustomEvent(
                    'markerHighlighted', {detail: {item, target: this}}
                ))
            }
    }
    /**
     * Takes the item's marker for a store and creates the HTML content of the
     * info window.
     * @param item - Item to generate info window for.
     * @param additionalParameter - Additional parameter to forward to options
     * given render callback.
     * @returns Promise resolving to info window markup.
     */
    async makeInfoWindow(
        item:Item, ...additionalParameter:Array<any>
    ):Promise<string> {
        if (this.infoWindowDomNode) {
            // TODO
            if (Tools.isFunction(this.resolvedConfiguration.infoWindow.content)) {
                const result:Promise<string>|string =
                    this.resolvedConfiguration.infoWindow.content(
                        item, ...additionalParameter
                    )
                if (typeof result === 'string')
                    return result
                return await result
            }
            if (this.resolvedConfiguration.infoWindow.content)
                return this.resolvedConfiguration.infoWindow.content
        }
        let content:string = '<div>'
        for (const name in item.data)
            if (
                item.data.hasOwnProperty(name) &&
                ['boolean', 'number', 'string'].includes(
                    typeof item.data[name as keyof Store]
                )
            )
                content += `${name}: ${item.data[name as keyof Store]}<br />`
        return `${content}</div>`
    }
    /**
     * Takes the search results and creates the HTML content of the search
     * results.
     * @param searchResults - Search result to generate markup for.
     * @param limitReached - Indicated whether defined limit was reached or
     * not.
     * @returns Promise resolving to generated markup.
     */
    async makeSearchResults(
        searchResults:Array<Item>, limitReached:boolean
    ):Promise<string> {
        const searchOptions:SearchConfiguration =
            this.resolvedConfiguration.search as SearchConfiguration
        if (searchOptions.content) {
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
                                searchOptions.normalizer
                            ) +
                            '<br />'
                content += '</div>'
            }
            return content
        }
        return searchOptions.noResultsContent
    }
    // endregion
}
// endregion
export const api:WebComponentAPI<typeof StoreLocator> = {
    component: StoreLocator,
    register: (tagName:string = 'store-locator'):void =>
        customElements.define(tagName, StoreLocator)
}
export default api
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
