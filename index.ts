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
import Tools, {globalContext, Lock, $} from 'clientnode'
import {
    EvaluationResult,
    Mapping,
    PlainObject,
    ProcedureFunction,
    TimeoutPromise,
    UnknownFunction
} from 'clientnode/type'
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import {any, boolean, object} from 'clientnode/property-types'
import {
    Cluster as MapMarkerCluster,
    ClusterStats as MapMarkerClusterStats,
    MarkerClusterer,
    SuperClusterAlgorithm
} from '@googlemaps/markerclusterer'
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import property from 'web-component-wrapper/decorator'
import Web from 'web-component-wrapper/Web'
import {WebComponentAPI} from 'web-component-wrapper/type'

import {
    Configuration,
    ClusterOptions,
    Icon,
    InfoWindow,
    Item,
    MapAnimation,
    MapArea,
    MapGeocoder,
    MapGeocoderResult,
    MapGeocoderStatus,
    MapIcon,
    MapImpl,
    MapMarker,
    MapMarkerOptions,
    MapPlaceResult,
    MapPlacesService,
    MapPosition,
    Maps,
    MapSearchBox,
    RendererConfiguration,
    SearchConfiguration,
    Square,
    Store as BaseStore,
    Position
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
 * @property initialized - Indicates whether map has been initialized yet.
 * Avoids re-initializing due to property updates (would be too expensive).
 * @property loaded - Indicates whether map has been finished to initialize.
 *
 * @property configuration - Holds given configuration object.
 * @property resolvedConfiguration - Holds resolved configuration object.
 * @property urlConfiguration - URL given configurations object.
 *
 * @property filter - Filter function to dynamically sort out some stores.
 * @property items - Holds all recognized stores to represent as marker.
 * @property searchResultsStyleProperties - Dynamically computed CSS properties
 * to append to search result list (derived from search input field).
 * @property seenLocations - Saves all seen locations to recognize duplicates.
 *
 * @property highlightedItem - Holds currently highlighted item.
 * @property openWindow - Holds currently opened window instance.
 * @property searchBoxInitialized - Indicates whether search results have been
 * initialized yet.
 * @property searchResultRange - Public editable property to set current search
 * result range. This is useful for pagination implementations in template
 * level.
 * @property searchResults - Saves last found search results.
 * @property searchSegments - Saves last searched segments.
 * @property searchText - Saves last searched string.
 * @property searchWords - Saves last searched words.
 * @property searchResultsDirty - Indicates whether current search results
 * aren't valid anymore.
 *
 * @property default - Sets default value if not alternate value set yet.
 * @property dirty - Indicates whether this component has been modified input.
 * @property disabled - Indicates whether this component is in editable.
 * @property invalid - Indicates whether this component is in invalid state.
 * @property pristine - Indicates whether this component hasn't been modified
 * yet.
 * @property required - Indicates whether this is invalid as long there is no
 * item selected yet.
 * @property valid - Indicates whether this component is in valid state.
 * @property value - Currently selected item (for using as form component).
 *
 * @property map - Holds the currently used map instance.
 * @property markerClusterer - Holds the currently used marker cluster
 * instance.
 * @property resetMarkerCluster - API-method to reset marker cluster.
 *
 * @property lock - Holds instance specific locks.
 */
export class StoreLocator<
    TElement extends Element = HTMLElement,
    ExternalProperties extends Mapping<unknown> = Mapping<unknown>,
    InternalProperties extends Mapping<unknown> = Mapping<unknown>,
    Store extends BaseStore = BaseStore
> extends Web<TElement, ExternalProperties, InternalProperties> {
    static applicationInterfaceLoad:Promise<void>
    static cloneSlots = true
    /*
        Nested quotes in code can work in IE 11 if only one type of quote is
        used according to escaping.
    */
    static content = `
        <slot name="loadingOverlay">
            <div class="store-locator__loading-overlay">
                <span class="store-locator__loading-overlay__content">
                    Loading...
                </span>
            </div>
        </slot>

        <slot name="disabledOverlay">
            <div class="store-locator__disabled-overlay"></div>
        </slot>

        <slot name="input">
            <input class="store-locator__input" style="display:none" />
        </slot>

        <slot name="searchResults"><div class="store-locator__search-results">
            <textarea style="display:none">\\\${

loading ?
    (
        "<div class=\\\\"" +
        "store-locator__search-results store-locator__search-results" +
        "--loading" +
        "\\\\">loading...</div>"
    ) :
    results.length ?
        results.map(function(result) {
            return ("<ul>" +
                "<li>" +
                    Object.keys(result.data)
                        .filter(function(name) {
                            return ["number", "string"]
                                .includes(typeof result.data[name])
                        })
                        .map(function(name) {
                            return (
                                name +
                                ": " +
                                Tools.stringMark(
                                    result.data[name],
                                    searchWords,
                                    configuration.search.normalizer,
                                    null
                                )
                            )
                        })
                        .join("</li><li>") +
                "</li>" +
            "</ul>")
        })
        .join("") :
        (
            "<div class=\\\\"" +
            "store-locator__search-results store-locator__search-results" +
            "--no-results" +
            "\\\\">No results found</div>"
        )
            }</textarea>
        </div></slot>

        <slot name="infoWindow"><ul class="store-locator__info-window">
            <textarea style="display:none">
                <li>
                    \\\${Object.keys(item.data)
                        .filter(function(name) {
                            return ["number", "string"]
                                .includes(typeof item.data[name])
                        })
                        .map(function(name) {
                            return name + ": " + item.data[name]
                        })
                        .join("</li><li>")
                    }
                </li>
            </textarea>
        </ul></slot>
    `
    static defaultConfiguration:Configuration<BaseStore> = {
        additionalStoreProperties: {},
        defaultMarkerIconFileName: null,
        filter: null,
        iconPath: '',
        infoWindow: {additionalMoveToBottomInPixel: 80},
        transformStore: null,
        boundaries: {
            northEast: {latitude: 85, longitude: 180},
            southWest: {latitude: -85, longitude: -180}
        },
        numberOfStoresToGenerate: 100,
        stores: [],
        storesAPIURL: '',

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

        distanceToMoveByDuplicatedEntries: 0.0001,

        fallbackLocation: {latitude: 51.124213, longitude: 10.147705},
        ip: 'check',
        ipToLocationApplicationInterface: {
            bounds: {
                northEast: {latitude: 85, longitude: 180},
                southWest: {latitude: -85, longitude: -180}
            },
            key: null,
            protocol: 'https',
            timeoutInMilliseconds: 1000,
            url:
                '{1}//api.ipstack.com/{3}?access_key={2}&' +
                'fields=latitude,longitude'
        },
        startLocation: null,

        input: {
            hide: {display: 'block', opacity: 0},
            showAnimation: [{opacity: 1}, {duration: 'fast'}]
        },
        loadingHideAnimation: [{opacity: 0}, {duration: 'fast'}],
        showInputAfterLoadedDelayInMilliseconds: 500,
        root: {
            hide: {display: 'block', opacity: 0},
            showAnimation: [{opacity: 1}, {duration: 'fast'}]
        },

        limit: {
            northEast: {latitude: 85, longitude: 180},
            southWest: {latitude: -85, longitude: -180}
        },

        map: {
            disableDefaultUI: true,
            maxZoom: 9999,
            minZoom: 0,
            streetViewControl: true,
            zoom: 3,
            zoomControl: true
        },
        marker: {
            cluster: {
                maxZoom: 11,
                radius: 100
            },
            icon: {
                scaledSize: {height: 49, unit: 'px', width: 44},
                size: {height: 49, unit: 'px', width: 44}
            }
        },

        name: 'storeLocator',

        search: 50,
        successfulSearchZoomLevel: 12,

        securityResponsePrefix: `)]}',`,
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
            minimumNumberOfSymbols: 3,
            number: [2, 5],
            prefer: true,
            retrieveOptions: {radius: 50000, query: ''},
            searchDebounceTimeInMilliseconds: 1000
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
    /*
       Renders component given slot contents into given dom node. We avoid that
       since all slots will be injected dynamically triggered through google
       map events.

       NOTE: We render slots to use them as mocks for testing.
    */
    static renderSlots = Boolean(
        /*
            NOTE: "globalContext.window?.google?.maps" does not work since
            experiencing a compiler bug.
        */
        globalContext.window &&
        globalContext.window.google &&
        globalContext.window.google.maps &&
        (globalContext.window.google.maps as Maps).mockup
    )
    static renderUnsafe = true
    static _name = 'StoreLocator'

    initialized = false
    loaded = false

    @property({type: object})
        configuration:Partial<Configuration<Store>>|undefined
    resolvedConfiguration:Configuration<Store> = {} as Configuration<Store>
    urlConfiguration:null|PlainObject = null

    filter = (_store:Store):boolean => true
    items:Array<Item> = []
    searchResultsStyleProperties:Mapping<number|string> = {}
    seenLocations:Array<string> = []
    transformStore:(store:Store) => Store = Tools.identity

    highlightedItem:Item|null = null
    openWindow:InfoWindow|null = null
    searchBoxInitialized = false
    searchResultRange:Array<number>|null = null
    searchResults:Array<Item> = []
    searchSegments:Array<string> = []
    searchText:null|string = null
    searchWords:Array<string> = []
    searchResultsDirty = false

    @property()
        name = 'storeLocator'

    @property({type: any})
        default:Item|null = null
    dirty = false
    @property({type: boolean, writeAttribute: true})
        disabled = false
    invalid = false
    pristine = true
    @property({type: boolean, writeAttribute: true})
        required = false
    valid = true
    @property({type: any})
        value:Item|null = null

    // NOTE: Will be initialized during bootstrapping.
    map:MapImpl = null as unknown as MapImpl
    markerClusterer:MarkerClusterer|null = null
    resetMarkerCluster:null|(() => void) = null

    readonly self:typeof StoreLocator = StoreLocator

    readonly lock:Lock = new Lock()
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
     * Converts given declarative icon configuration to marker needed format.
     * @param options - Icon configuration.
     *
     * @returns Icon configuration.
     */
    transformIconConfiguration(options:Icon):Icon {
        if (options.scaledSize) {
            const square:Square = options.scaledSize as Square
            options.scaledSize = new this.self.maps.Size(
                square.width, square.height, square.unit, square.unit
            )
        }

        if (options.size) {
            const square:Square = options.size as Square
            options.size = new this.self.maps.Size(
                square.width, square.height, square.unit, square.unit
            )
        }

        return options
    }
    /**
     * Parses given configuration object and (re-)renders map.
     * @param name - Attribute name which was updates.
     * @param oldValue - Old attribute value.
     * @param newValue - New updated value.
     *
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

        this.root.removeEventListener(
            'keydown', this.onKeyDown as EventListener
        )
        this.slots.input?.removeEventListener('click', this.onInputClick)
        this.slots.input?.removeEventListener('focus', this.onInputFocus)
        this.slots.input?.removeEventListener(
            'keydown', this.onInputKeyDown as EventListener
        )
        this.slots.input?.removeEventListener(
            'keyup', this.updateSearchResultsHandler
        )
    }
    /**
     * Generic internal property setter. Forwards field writes into internal.
     * @param name - Property name to write.
     * @param value - New value to write.
     *
     * @returns Nothing.
     */
    setInternalPropertyValue(name:string, value:unknown):void {
        if (!this.initialized && name === 'default') {
            this.setPropertyValue('value', value)

            return
        }

        if (this.loaded && name === 'value') {
            const givenValue:unknown = value
            value = this.mapValue(value as Item|null|number|string|Store)
            if (givenValue !== value) {
                this.setPropertyValue(name, value)

                return
            }
        }

        super.setInternalPropertyValue(name, value)

        /*
            NOTE: Since we avoid re-rendering an already initialized map (to
            improve performance) we have to adapt already rendered state here.
        */
        if (this.initialized && name === 'disabled')
            this.slots.disabledOverlay.style.display = value ? 'block' : 'none'

        this.updateValueState()
    }
    /**
     * Triggered when content projected and nested dom nodes are ready to be
     * traversed / injected.
     * @param reason - Description why rendering is necessary.
     *
     * @returns A promise resolving to nothing.
     */
    async render(reason = 'unknown'):Promise<void> {
        if (this.initialized && reason === 'propertyChanged')
            return

        // NOTE: We have to reset open window state first.
        this.closeCurrentWindow()

        this.initialized = true

        super.render(reason)

        $(this.slots.input).css(this.resolvedConfiguration.input.hide)
        this.slots.disabledOverlay.style.display =
            this.disabled ? 'block' : 'none'

        await this.loadMapEnvironmentIfNotAvailableAndInitializeMap()
    }
    // endregion
    // region event handler
    onMapCenterChanged = ():void => {
        // NOTE: Search results depends on current position.
        if (this.searchText && this.slots.searchResults)
            this.searchResultsDirty = true
    }
    onInputClick = ():void => {
        if (this.searchText)
            this.openSearchResults()
    }
    onInputFocus = ():void => {
        if (this.searchText)
            this.openSearchResults()
    }
    onInputKeyDown = (event:KeyboardEvent):void => {
        if (Tools.keyCode.DOWN === event.keyCode && this.searchText)
            this.openSearchResults()
    }
    onKeyDown = (event:KeyboardEvent):void => {
        /*
            NOTE: Events that doesn't occurs in search context are handled by
            the native map implementation and won't be propagated so we doesn't
            have to care about that.
        */
        if (this.searchResults.length) {
            if (this.searchResultRange)
                this.searchResultRange = [
                    Math.max(0, this.searchResultRange[0]),
                    Math.min(
                        this.searchResults.length - 1,
                        this.searchResultRange[1]
                    )
                ]
            else
                this.searchResultRange = [0, this.searchResults.length - 1]

            let currentIndex = -1
            if (this.highlightedItem)
                currentIndex = this.searchResults.indexOf(this.highlightedItem)

            if (event.keyCode === Tools.keyCode.DOWN)
                if (
                    currentIndex === -1 ||
                    this.searchResultRange[1] < currentIndex + 1
                )
                    this.highlightMarker(
                        this.searchResults[this.searchResultRange[0]], event
                    )
                else
                    this.highlightMarker(
                        this.searchResults[currentIndex + 1], event
                    )
            else if (event.keyCode === Tools.keyCode.UP)
                if ([this.searchResultRange[0], -1].includes(currentIndex))
                    this.highlightMarker(
                        this.searchResults[this.searchResultRange[1]], event
                    )
                else
                    this.highlightMarker(
                        this.searchResults[currentIndex - 1], event
                    )
            else if (
                event.keyCode === Tools.keyCode.ENTER && this.highlightedItem
            ) {
                event.stopPropagation()

                if (this.dispatchEvent(new CustomEvent(
                    'change', {detail: {value: this.highlightedItem}}
                ))) {
                    this.setPropertyValue('value', this.highlightedItem)

                    if (this.highlightedItem.infoWindow)
                        this.openMarker(this.highlightedItem, event)
                    else
                        this.focusPlace(this.highlightedItem, event)
                }
            }
        }
    }
    // endregion
    // region helper
    // / region  configuration
    /**
     * Merges configuration sources into final object.
     * @returns Nothing.
     */
    resolveConfiguration():void {
        this.resolvedConfiguration = Tools.extend(
            true,
            Tools.copy(this.self.defaultConfiguration) as
                unknown as Configuration<Store>,
            this.configuration || {}
        )

        this.extendConfigurationByGivenURLParameter()

        this.resolvedConfiguration.search = Tools.extend<SearchConfiguration>(
            true,
            Tools.copy(this.self.defaultSearchConfiguration),
            this.resolvedConfiguration.search as SearchConfiguration
        )

        if (this.resolvedConfiguration.debug)
            console.debug('Got configuration:', this.resolvedConfiguration)

        if (typeof this.resolvedConfiguration.transformStore === 'function')
            this.transformStore = this.resolvedConfiguration.transformStore
        else if (this.resolvedConfiguration.transformStore) {
            const {error, templateFunction} = Tools.stringCompile<Store>(
                this.resolvedConfiguration.transformStore, ['store']
            )

            if (error)
                console.warn(
                    `Given store transformer "` +
                    `${this.resolvedConfiguration.transformStore}" does not ` +
                    `compile: ${error}`
                )
            else
                this.transformStore = templateFunction
        }

        if (typeof this.resolvedConfiguration.filter === 'function')
            this.filter = this.resolvedConfiguration.filter
        else if (this.resolvedConfiguration.filter) {
            const {error, templateFunction} = Tools.stringCompile<boolean>(
                this.resolvedConfiguration.filter, ['store']
            )

            if (error)
                console.warn(
                    `Given filter "${this.resolvedConfiguration.filter}" ` +
                    `does not compile: ${error}`
                )
            else
                this.filter = templateFunction
        }
    }
    /**
     * Extends current configuration object by given url parameter.
     * @param name - URL parameter name to interpret.
     *
     * @returns Nothing.
     */
    extendConfigurationByGivenURLParameter(name?:string):void {
        if (!name)
            name = this.resolvedConfiguration.name

        const parameter:Array<string>|null|string =
            Tools.stringGetURLParameter(name) as Array<string>|null|string
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
                this.urlConfiguration = Tools.mask(
                    evaluated.result, this.resolvedConfiguration.urlModelMask
                ) as PlainObject
                Tools.extend(
                    true, this.resolvedConfiguration, this.urlConfiguration
                )
            }
        }
    }
    // / endregion
    // / region  initializing
    /**
     * Loads google map resources if not loaded yet (or loading triggered).
     * Initializes map instances.
     * @returns Promise resolving when everything is loaded and initialized.
     */
    loadMapEnvironmentIfNotAvailableAndInitializeMap():Promise<void> {
        let loadInitialized = true
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
            this.self.applicationInterfaceLoad = new Promise<void>((
                resolve:() => void, reject:() => void
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
            .then(():void => {
                if (this.dispatchEvent(new CustomEvent('loaded')))
                    void this.onLoaded()
            })

        if (globalContext.window?.google?.maps) {
            this.self.maps = globalContext.window.google.maps
            if (!applicationInterfaceLoadCallbacks.resolved)
                void Tools.timeout(():Promise<void>|void =>
                    applicationInterfaceLoadCallbacks.resolve()
                )
        } else if (!loadInitialized) {
            const callbackName:string =
                this.resolvedConfiguration.applicationInterface.callbackName ?
                    this.resolvedConfiguration
                        .applicationInterface.callbackName :
                    Tools.determineUniqueScopeName()

            const callback:ProcedureFunction = ():void => {
                if (!applicationInterfaceLoadCallbacks.resolved)
                    if (globalContext.window?.google?.maps) {
                        this.self.maps = globalContext.window.google.maps
                        void applicationInterfaceLoadCallbacks.resolve()
                    } else
                        void applicationInterfaceLoadCallbacks.reject(
                            new Error('No google maps environment set.')
                        )
            }
            ;(globalContext as unknown as Mapping<() => void>)[callbackName] =
                callback

            void $.getScript(Tools.stringFormat(
                this.resolvedConfiguration.applicationInterface.url,
                this.resolvedConfiguration.applicationInterface.key ?
                    'key=' +
                    `${this.resolvedConfiguration.applicationInterface.key}&` :
                    '',
                (
                    window === (globalContext as unknown as Window) ?
                        'window' :
                        'global'
                ) +
                `.${callbackName}`
            ))
                .done(callback)
                .fail((
                    response:JQuery.jqXHR<string|undefined>,
                    error:JQuery.Ajax.ErrorTextStatus
                ):void => {
                    void applicationInterfaceLoadCallbacks.reject(error)
                })
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
        let loaded = false
        return new Promise<void>((resolve:() => void):void => {
            const ipToLocationAPIConfiguration:Configuration<Store>[
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
            void $.ajax({
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
            })
                .always((currentLocation:Position):void => {
                    if (!loaded) {
                        fallbackTimeout.clear()
                        loaded = true
                        /*
                            Check if determined location is valid and within
                            defined bounds.
                        */
                        if (
                            typeof currentLocation.latitude === 'number' &&
                            typeof currentLocation.longitude === 'number' &&
                            (
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
                        )
                            this.resolvedConfiguration.startLocation =
                                currentLocation

                        void this.initializeMap().then(resolve)
                    }
                })
        })
    }
    /**
     * Adds given store as marker to the map.
     * @param store - Store to add as marker.
     *
     * @returns Nothing.
     */
    transformMarker(store:Store):Store {
        Tools.extend(
            true,
            store,
            this.resolvedConfiguration.additionalStoreProperties
        )

        if (!store.streetAndStreetnumber)
            store.streetAndStreetnumber =
                (store.street || '') +
                (store.streetnumber ? `, ${store.streetnumber}` : '')
        if (!store.zipCodeAndCity)
            store.zipCodeAndCity =
            (store.zipCode || '') +
            (store.city ? ` ${store.city}` : '')
        if (!store.address)
            store.address =
                (store.streetAndStreetnumber || '') +
                (store.zipCodeAndCity ? `, ${store.zipCodeAndCity}` : '')

        return store
    }
    /**
     * Initializes given value. Maps to internally determined item and opens
     * corresponding marker. Normalizes from id, data item or item to internal
     * item representation.
     * @param value - Value to initialize.
     *
     * @returns Determined value.
     */
    mapValue(value?:Item|null|number|Store|string):Item|null {
        if (![null, undefined].includes(value as null)) {
            const hasID:boolean =
                typeof value === 'object' &&
                (
                    'id' in (value as Store) ||
                    'data' in (value as Item) &&
                    'id' in ((value as Item).data as Store)
                )
            const id:unknown = hasID ?
                (value as Store).id || (value as Item).data?.id :
                value

            for (const item of this.items)
                if (id === (typeof id === 'object' ? item : item.data?.id)) {
                    if (item.infoWindow && !item.infoWindow.isOpen)
                        this.openMarker(item)

                    return item
                }
        }

        return null
    }
    /**
     * Initializes cluster, info windows and marker.
     * @returns Promise resolving to the current instance.
     */
    async initializeMap():Promise<void> {
        const startLocation:Position =
            this.resolvedConfiguration.startLocation as Position
        this.resolvedConfiguration.map.center = new this.self.maps.LatLng(
            startLocation.latitude, startLocation.longitude
        )

        ;(this.root as HTMLElement).style.display = 'block'
        this.map = new this.self.maps.Map(
            this.root as HTMLElement, this.resolvedConfiguration.map
        )
        $(this.root.firstElementChild!)
            .css(this.resolvedConfiguration.root.hide)

        if (this.resolvedConfiguration.limit)
            this.self.maps.event.addListener(
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
                    const currentCenter:MapPosition|undefined =
                        this.map.getCenter()
                    if (currentCenter && !area.contains(currentCenter)) {
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
                }
            )

        // Create the search box and link it to the UI element.
        this.applyBindings(
            this.slots.input,
            {
                [Tools.stringLowerCase(this.self._name) || 'instance']: this,
                configuration: this.resolvedConfiguration,
                Tools
            }
        )
        this.map.controls[this.self.maps.ControlPosition.TOP_LEFT]
            .push(this.slots.input)

        for (const domNode of [
            this.slots.disabledOverlay,
            this.slots.loadingOverlay,
            this.slots.link
        ])
            if (domNode) {
                this.evaluateDomNodeTemplate(
                    domNode,
                    {
                        [Tools.stringLowerCase(this.self._name) || 'instance']:
                            this,
                        configuration: this.resolvedConfiguration,
                        Tools
                    }
                )
                this.root.appendChild(domNode)
            }

        if (typeof this.resolvedConfiguration.search === 'number')
            this.initializeGenericSearch()
        else {
            this.self.maps.event.addListener(
                this.map, 'click', ():void => this.closeSearchResults()
            )
            this.self.maps.event.addListener(
                this.map, 'dragstart', ():void => this.closeSearchResults()
            )
            this.initializeDataSourceSearch()
        }
        const markerClusterZoomLevel:number =
            this.markerClusterer &&
            this.resolvedConfiguration.marker.cluster!.maxZoom ||
            0
        if (markerClusterZoomLevel > 0)
            // Close marker if zoom level is bigger than the aggregation.
            this.self.maps.event.addListener(
                this.map,
                'zoom_changed',
                ():void => {
                    if (
                        typeof this.map.getZoom() !== 'number' ||
                        this.map.getZoom()! <= markerClusterZoomLevel
                    )
                        this.closeCurrentWindow()
                }
            )

        if (!this.self.maps.mockup)
            await new Promise<void>((resolve:() => void):void => {
                this.self.maps.event.addListenerOnce(
                    this.map, 'idle', ():void => resolve()
                )
            })

        if (this.resolvedConfiguration.stores.length) {
            for (const store of this.resolvedConfiguration.stores)
                if (this.filter(store))
                    this.createMarker(
                        this.transformMarker(this.transformStore(store))
                    )
        } else if (this.resolvedConfiguration.storesAPIURL.length > 7) {
            const result:Response = await globalContext.fetch(
                this.resolvedConfiguration.storesAPIURL
            )
            let responseString:string = await result.text()
            if (responseString.startsWith(
                this.resolvedConfiguration.securityResponsePrefix
            ))
                responseString = responseString.substring(
                    this.resolvedConfiguration.securityResponsePrefix.length
                )
            for (const store of JSON.parse(responseString) as Array<Store>)
                if (this.filter(store))
                    this.createMarker(
                        this.transformMarker(this.transformStore(store))
                    )
        } else {
            const southWest:MapPosition = new this.self.maps.LatLng(
                this.resolvedConfiguration.boundaries.southWest.latitude,
                this.resolvedConfiguration.boundaries.southWest.longitude
            )
            const northEast:MapPosition = new this.self.maps.LatLng(
                this.resolvedConfiguration.boundaries.northEast.latitude,
                this.resolvedConfiguration.boundaries.northEast.longitude
            )
            for (
                let index = 0;
                index < this.resolvedConfiguration.numberOfStoresToGenerate;
                index++
            )
                this.createMarker(this.transformMarker(this.transformStore({
                    latitude:
                        southWest.lat() +
                        (northEast.lat() - southWest.lat()) *
                        Math.random(),
                    longitude:
                        southWest.lng() +
                        (northEast.lng() - southWest.lng()) *
                        Math.random(),
                    ...this.resolvedConfiguration.additionalStoreProperties
                } as Store)))
        }

        if (this.resolvedConfiguration.marker.cluster) {
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

                const algorithm = new SuperClusterAlgorithm(
                    this.resolvedConfiguration.marker.cluster!
                )

                this.markerClusterer = new MarkerClusterer({
                    algorithm,
                    map: this.map,
                    markers,
                    renderer: this.resolvedConfiguration.marker.renderer ?
                        {
                            render: (
                                cluster:MapMarkerCluster,
                                stats:MapMarkerClusterStats
                            ):MapMarker => {
                                const defaultOptions:MapMarkerOptions = {
                                    label: {text: String(cluster.count)},
                                    position: cluster.position,
                                    /*
                                        Adjust "zIndex" to be above other
                                        markers.
                                    */
                                    zIndex:
                                        Number(
                                            this.self.maps.Marker.MAX_ZINDEX
                                        ) +
                                        cluster.count
                                }

                                const givenOptions:RendererConfiguration =
                                    this.resolvedConfiguration.marker.renderer!

                                if (typeof givenOptions === 'function')
                                    return new this.self.maps.Marker(
                                        givenOptions(
                                            defaultOptions, cluster, stats
                                        )
                                    )

                                let selectedOptions:MapMarkerOptions =
                                    givenOptions as MapMarkerOptions

                                if (Array.isArray(givenOptions)) {
                                    if (givenOptions.length === 0)
                                        return new this.self.maps.Marker(
                                            defaultOptions
                                        )

                                    let currentOptions:ClusterOptions =
                                        givenOptions[0]

                                    for (const options of givenOptions)
                                        if (cluster.count >= options.count)
                                            currentOptions = options

                                    selectedOptions =
                                        {...currentOptions} as MapMarkerOptions
                                    delete (
                                        selectedOptions as
                                            MapMarkerOptions & {count?:number}
                                    ).count
                                }

                                if (selectedOptions.icon)
                                    this.transformIconConfiguration(
                                        selectedOptions.icon as Icon
                                    )

                                return new this.self.maps.Marker(Tools.extend(
                                    true, defaultOptions, selectedOptions
                                ))
                            }
                        } :
                        undefined
                })
            }

            this.resetMarkerCluster()
        }

        this.loaded = true

        this.setPropertyValue('value', this.value)

        /*
            NOTE: This fixes initial window focus not respecting
            "infoWindow.additionalMoveToBottomInPixel" configuration to take
            effect.
        */
        await Tools.timeout(3000)
        if (
            this.value?.infoWindow?.isOpen &&
            this.resolvedConfiguration.infoWindow
                .additionalMoveToBottomInPixel !== 0
        )
            this.map.panBy(
                0,
                -this.resolvedConfiguration.infoWindow
                    .additionalMoveToBottomInPixel
            )
    }
    /**
     * Position search results right below the search input field.
     * @returns Nothing.
     */
    initializeSearchResultsBox():void {
        this.searchBoxInitialized = true

        this.searchResultsStyleProperties = {}
        const allStyleProperties:Mapping<number|string> =
            $(this.slots.input).Tools('style')
        for (const propertyName in allStyleProperties)
            if (
                (this.resolvedConfiguration.search as SearchConfiguration)
                    .stylePropertiesToDeriveFromInputField
                    .includes(propertyName)
            )
                this.searchResultsStyleProperties[propertyName] =
                    allStyleProperties[propertyName]

        const outerHeight:number|undefined =
            $(this.slots.input).outerHeight(true)
        if (outerHeight)
            this.searchResultsStyleProperties.marginTop = outerHeight

        // Prepare search result positioning.
        $(this.slots.searchResults).css(this.searchResultsStyleProperties)

        /*
            Inject the final search results into the dom tree next to the input
            node.
        */
        this.slots.input.parentNode!.insertBefore(
            this.slots.searchResults, this.slots.input.nextSibling
        )
    }
    /**
     * Initializes a data source based search box to open and focus them
     * matching marker.
     * @returns Nothing.
     */
    initializeDataSourceSearch():void {
        this.root.addEventListener('keydown', this.onKeyDown as EventListener)
        this.slots.input.addEventListener('click', this.onInputClick)
        this.slots.input.addEventListener('focus', this.onInputFocus)
        this.slots.input.addEventListener(
            'keydown', this.onInputKeyDown as EventListener
        )
        this.slots.input.addEventListener(
            'keyup', this.updateSearchResultsHandler
        )
        this.self.maps.event.addListener(
            this.map, 'center_changed', this.onMapCenterChanged
        )
    }
    // / endregion
    /**
     * Update input state.
     * @returns Nothing.
     */
    updateValueState():void {
        this.valid =
            !([null, undefined].includes(this.value as null) && this.required)
        this.invalid = !this.valid

        /*
            Do not modify if internal initialisation is running. No user
            interaction possible yet.
        */
        if (!this.loaded)
            return

        this.dirty = true
        this.pristine = !this.dirty

        if (this.dirty) {
            this.removeAttribute('pristine')
            this.setAttribute('dirty', '')
        } else {
            this.removeAttribute('dirty')
            this.setAttribute('pristine', '')
        }

        if (this.disabled)
            this.setAttribute('disabled', '')
        else
            this.removeAttribute('disabled')

        if (this.valid) {
            this.removeAttribute('invalid')
            this.setAttribute('valid', '')
        } else {
            this.removeAttribute('valid')
            this.setAttribute('invalid', '')
        }
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

        return Tools.debounce<void>(
            (async (event?:KeyboardEvent):Promise<void> => {
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

                const searchText:string = searchOptions.normalizer(
                    (this.slots.input as HTMLInputElement).value
                )
                if (this.searchText === searchText && !this.searchResultsDirty)
                    return

                await this.lock.acquire(`${this.self._name}Search`)

                this.searchResultsDirty = false

                if (!this.searchBoxInitialized)
                    this.initializeSearchResultsBox()

                if (
                    !searchText ||
                    searchText.length <
                        searchOptions.generic.minimumNumberOfSymbols
                ) {
                    if (this.searchResults.length) {
                        this.searchResults = []
                        this.searchText = ''
                        if (this.dispatchEvent(new CustomEvent(
                            'removeSearchResults'
                        )))
                            this.closeSearchResults()
                    }

                    void this.lock.release(`${this.self._name}Search`)

                    return
                }

                this.searchText = searchText
                this.searchWords = this.searchText.split(' ')
                this.searchSegments = [...this.searchWords]
                if (!this.searchSegments.includes(this.searchText))
                    this.searchSegments.push(this.searchText)

                if (
                    this.slots.searchResults &&
                    this.dispatchEvent(new CustomEvent('loadSearchResults'))
                ) {
                    this.openSearchResults()
                    /*
                        NOTE: Cast to string because specified signature misses
                        valid wrapped dom node type.
                    */
                    this.evaluateDomNodeTemplate(
                        this.slots.searchResults,
                        {
                            [
                            Tools.stringLowerCase(this.self._name) ||
                            'instance'
                            ]: this,
                            configuration: this.resolvedConfiguration,
                            limitReached: false,
                            loading: true,
                            results: [],
                            searchSegments: this.searchSegments,
                            searchText: this.searchText,
                            searchWords: this.searchWords,
                            Tools
                        }
                    )
                }

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
                            query: this.searchText
                        },
                        (places:Array<MapPlaceResult>|null):void => {
                            if (places)
                                this.handleGenericSearchResults(places)

                            void this.lock.release(`${this.self._name}Search`)
                        }
                    )
                else {
                    this.performLocalSearch()

                    void this.lock.release(`${this.self._name}Search`)
                }
            }) as UnknownFunction,
            searchOptions.generic.searchDebounceTimeInMilliseconds
        ) as UnknownFunction
    }
    /**
     * Sorts and filters search results given by google's application
     * interface.
     * @param places - List of place objects.
     *
     * @returns Nothing.
     */
    handleGenericSearchResults(places:Array<MapPlaceResult>):void {
        const results:Array<Item> = []
        const searchOptions:SearchConfiguration =
            this.resolvedConfiguration.search as SearchConfiguration

        const center:MapPosition|undefined = this.map.getCenter()
        /*
            NOTE: Since google text search doesn't support sorting by distance
            we have to sort by our own.
        */
        let index = 1
        for (const place of places.sort((
            firstPlace:MapPlaceResult, secondPlace:MapPlaceResult
        ):number => {
            let firstDistance = 0
            let secondDistance = 0
            if (center) {
                if (firstPlace.geometry?.location)
                    firstDistance = this.self.maps.geometry.spherical
                        .computeDistanceBetween(
                            center, firstPlace.geometry.location
                        )
                if (secondPlace.geometry?.location)
                    secondDistance = this.self.maps.geometry.spherical
                        .computeDistanceBetween(
                            center, secondPlace.geometry.location
                        )
            }

            return firstDistance - secondDistance
        })) {
            index += 1

            let distance = 0
            if (center && place.geometry?.location)
                distance = this.self.maps.geometry.spherical
                    .computeDistanceBetween(center, place.geometry.location)
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
                                `${globalContext.location.protocol}$1`
                            ) :
                            null
                    },
                    foundWords: this.searchSegments.filter((
                        word:string
                    ):boolean =>
                        place.formatted_address?.includes(word) ||
                        (place.name || '').includes(word)
                    ),
                    highlight: (event?:Event, type?:string):void => {
                        result.isHighlighted = type !== 'stop'
                    },
                    isHighlighted: false,
                    open: (event?:Event):void =>
                        this.focusPlace(result, event),
                    position: place.geometry ?
                        place.geometry.location ?? null :
                        null
                }
                results.push(result)

                if (searchOptions.generic.number[1] < index)
                    break
            }
        }

        this.performLocalSearch(results)
    }
    /**
     * Performs a search on locally given store data.
     * @param results - A list if generic search results.
     *
     * @returns Nothing.
     */
    performLocalSearch(results:Array<Item> = []):void {
        const searchOptions:SearchConfiguration =
            this.resolvedConfiguration.search as SearchConfiguration
        const numberOfGenericSearchResults:number = results.length
        const defaultProperties:Array<string>|null =
            Object.prototype.hasOwnProperty.call(searchOptions, 'properties') ?
                searchOptions.properties :
                null

        for (const item of this.items) {
            const properties:Array<string> = defaultProperties ?
                defaultProperties :
                item.data ? Object.keys(item.data) : []

            item.foundWords = []
            for (const key of properties)
                for (const searchWord of this.searchSegments)
                    if (
                        !item.foundWords.includes(searchWord) &&
                        item.data &&
                        item.data[key] &&
                        typeof item.data[key] === 'string' &&
                        searchOptions
                            .normalizer(item.data[key] as string)
                            .includes(searchWord)
                    ) {
                        item.foundWords.push(searchWord)

                        if (item.foundWords.length === 1) {
                            item.open = (event?:Event):void => {
                                if (this.dispatchEvent(new CustomEvent(
                                    'change', {detail: {value: item}}
                                ))) {
                                    this.setPropertyValue('value', item)
                                    this.openMarker(item, event)
                                }
                            }
                            item.highlight = (
                                event?:Event, type?:string
                            ):void => this.highlightMarker(item, event, type)
                            if (searchOptions.resultAggregation === 'union')
                                results.push(item)
                        }

                        if (
                            item.foundWords.length >=
                                this.searchWords.length &&
                            searchOptions.resultAggregation === 'cut'
                        )
                            results.push(item)
                    }
        }
        /*
            Remove generic place results if there are enough local search
            results.
        */
        if (
            searchOptions.generic.number &&
            results.length &&
            numberOfGenericSearchResults > searchOptions.generic.number[0] &&
            results.length > searchOptions.generic.number[1]
        )
            results.splice(
                searchOptions.generic.number[0],
                numberOfGenericSearchResults - searchOptions.generic.number[0]
            )
        /*
            Sort results by current map center form nearer to more fare away
            results.
        */
        results.sort((first:Item, second:Item):number => {
            if (searchOptions.generic.prefer)
                if (!first.infoWindow && second.infoWindow)
                    return -1
                else if (!second.infoWindow && first.infoWindow)
                    return 1

            if (first.foundWords.length < second.foundWords.length)
                return 1
            if (second.foundWords.length < first.foundWords.length)
                return -1

            const center:MapPosition|undefined = this.map.getCenter()

            let firstDistance = 0
            let secondDistance = 0
            if (center) {
                if (first.position)
                    firstDistance = this.self.maps.geometry.spherical
                        .computeDistanceBetween(center, first.position)

                if (second.position)
                    secondDistance = this.self.maps.geometry.spherical
                        .computeDistanceBetween(center, second.position)
            }

            return firstDistance - secondDistance
        })

        // Slice additional unneeded local search results.
        let limitReached = false
        if (searchOptions.maximumNumberOfResults < results.length) {
            limitReached = true
            results.splice(
                searchOptions.maximumNumberOfResults, results.length
            )
        }

        this.searchResults = results.slice()

        if (this.dispatchEvent(new CustomEvent(
            'addSearchResults', {detail: {results}}
        )))
            this.evaluateDomNodeTemplate(
                this.slots.searchResults,
                {
                    [Tools.stringLowerCase(this.self._name) || 'instance']:
                        this,
                    configuration: this.resolvedConfiguration,
                    limitReached,
                    loading: false,
                    results: this.searchResults,
                    searchSegments: this.searchSegments,
                    searchText: this.searchText,
                    searchWords: this.searchWords,
                    Tools
                }
            )
    }
    /**
     * Opens current search results.
     * @param event - Object with meta data for current event which has
     * triggered to show search results.
     *
     * @returns Nothing.
     */
    openSearchResults(event?:Event):void {
        if (event)
            event.stopPropagation()

        if (
            this.slots.searchResults &&
            !this.slots.searchResults.classList?.contains(
                'store-locator__search-results--open'
            ) &&
            this.dispatchEvent(new CustomEvent(
                'openSearchResults',
                {detail: {
                    event,
                    searchResults: this.searchResults,
                    searchSegments: this.searchSegments,
                    searchText: this.searchText,
                    searchWords: this.searchWords
                }}
            ))
        ) {
            for (const [propertyName, value] of Object.entries(
                this.searchResultsStyleProperties
            ))
                this.slots.searchResults.style[propertyName as 'display'] =
                    `${value}`

            this.slots.searchResults!.classList?.add(
                'store-locator__search-results--open'
            )
        }
    }
    /**
     * Closes current search results.
     * @param event - Object with meta data for current event which has
     * triggered to close search results.
     *
     * @returns Nothing.
     */
    closeSearchResults(event?:Event):void {
        if (event)
            event.stopPropagation()

        if (
            this.slots.searchResults?.classList?.contains(
                'store-locator__search-results--open'
            ) &&
            this.dispatchEvent(new CustomEvent('closeSearchResults'))
        ) {
            for (const propertyName of Object.keys(
                this.searchResultsStyleProperties
            ))
                this.slots.searchResults!.style[propertyName as 'display'] = ''

            this.slots.searchResults!.classList?.remove(
                'store-locator__search-results--open'
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
            this.slots.input as HTMLInputElement,
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
        this.self.maps.event.addListener(
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
        this.self.maps.event.addListener(
            searchBox,
            'places_changed',
            ():void => {
                const givenPlaces:Array<MapPlaceResult>|undefined =
                    searchBox.getPlaces()

                if (!Array.isArray(givenPlaces))
                    return

                this.ensurePlaceLocations(givenPlaces)
                    .then((places:Array<MapPlaceResult>):void => {
                        const foundPlace:MapPlaceResult|null =
                            this.determineBestSearchResult(places)

                        if (foundPlace) {
                            let shortestDistanceInMeter:number =
                                Number.MAX_VALUE
                            let matchingItem:Item|undefined
                            for (const item of this.items) {
                                let distanceInMeter = 0
                                if (
                                    foundPlace.geometry?.location &&
                                    item.position
                                )
                                    distanceInMeter = this.self.maps.geometry
                                        .spherical.computeDistanceBetween(
                                            foundPlace.geometry.location,
                                            item.position
                                        )
                                if (
                                    distanceInMeter < shortestDistanceInMeter
                                ) {
                                    shortestDistanceInMeter = distanceInMeter
                                    matchingItem = item
                                }
                            }
                            if (
                                matchingItem &&
                                shortestDistanceInMeter <=
                                    this.resolvedConfiguration.search
                            ) {
                                if (
                                    this.resolvedConfiguration
                                        .successfulSearchZoomLevel
                                )
                                    this.map.setZoom(
                                        this.resolvedConfiguration
                                            .successfulSearchZoomLevel
                                    )
                                this.openMarker(matchingItem)

                                return
                            }

                            this.closeCurrentWindow()

                            if (foundPlace.geometry?.location)
                                this.map.setCenter(
                                    foundPlace.geometry.location
                                )
                            if (
                                this.resolvedConfiguration
                                    .successfulSearchZoomLevel
                            )
                                this.map.setZoom(
                                    this.resolvedConfiguration
                                        .successfulSearchZoomLevel
                                )
                        }
                    })
                    .catch(console.warn)
            }
        )
    }
    /**
     * Closes current window if opened.
     * @returns Nothing.
     */
    closeCurrentWindow():void {
        if (this.openWindow) {
            this.openWindow.isOpen = false
            if (this.openWindow.close)
                this.openWindow.close()
        }
    }
    /**
     * Ensures that every given place have a location property.
     * @param places - Places to check for.
     *
     * @returns A promise which will be resolved if all places are ensured.
     */
    ensurePlaceLocations(
        places:Array<MapPlaceResult>
    ):Promise<Array<MapPlaceResult>> {
        let runningGeocodes = 0
        const geocoder:MapGeocoder = new this.self.maps.Geocoder()

        return new Promise<Array<MapPlaceResult>>((
            resolve:(_value:Array<MapPlaceResult>) => void
        ):void => {
            for (const place of places)
                if (!place.geometry?.location) {
                    console.warn(
                        `Found place "${place.name!}" doesn't have a ` +
                        'location. Full object:'
                    )
                    console.warn(place)
                    console.info(
                        'Geocode will be determined separately. With address' +
                        ` "${place.name!}".`
                    )

                    runningGeocodes += 1

                    /* eslint-disable no-loop-func */
                    void geocoder.geocode(
                        {address: place.name},
                        (
                            results:Array<MapGeocoderResult>|null,
                            status:MapGeocoderStatus
                        ):void => {
                            runningGeocodes -= 1

                            if (
                                results &&
                                status === this.self.maps.GeocoderStatus.OK
                            )
                                place.geometry = results[0].geometry
                            else {
                                delete places[places.indexOf(place)]

                                console.warn(
                                    `Found place "${place.name!}" couldn't ` +
                                    'be geocoded by google. Removing it from' +
                                    ' the places list.'
                                )
                            }

                            // Resolve all after last resolved geo coding.
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
     *
     * @returns The determined best result.
     */
    determineBestSearchResult(
        candidates:Array<MapPlaceResult>
    ):MapPlaceResult|null {
        const center:MapPosition|undefined = this.map.getCenter()

        let result:null|MapPlaceResult = null
        if (center && candidates.length) {
            let shortestDistanceInMeter:number = Number.MAX_VALUE
            for (const candidate of candidates) {
                let distanceInMeter = 0

                if (candidate.geometry?.location)
                    distanceInMeter = this.self.maps.geometry.spherical
                        .computeDistanceBetween(
                            candidate.geometry.location, center
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
     * @returns Promise resolving when start up animation has been completed.
     */
    async onLoaded():Promise<void> {
        void $(this.slots.loadingOverlay)
            .animate(...this.resolvedConfiguration.loadingHideAnimation)
            .promise()
            .then(():void => {
                this.slots.loadingOverlay.style.display = 'none'
            })

        $(this.root.firstElementChild!)
            .animate(...this.resolvedConfiguration.root.showAnimation)

        await Tools.timeout(
            this.resolvedConfiguration.showInputAfterLoadedDelayInMilliseconds
        )

        $(this.slots.input)
            .animate(...this.resolvedConfiguration.input.showAnimation)
    }
    /**
     * Registers given store to the google maps canvas.
     * @param store - Store object to create a marker for.
     *
     * @returns The created marker.
     */
    createMarker(store?:Store):MapMarker {
        let index = 0
        if (store && store.latitude && store.longitude) {
            while (this.seenLocations.includes(
                `${store.latitude}-${store.longitude}`
            )) {
                if (index % 2)
                    store.latitude +=
                        this.resolvedConfiguration
                            .distanceToMoveByDuplicatedEntries
                else
                    store.longitude +=
                        this.resolvedConfiguration
                            .distanceToMoveByDuplicatedEntries
                index += 1
            }

            this.seenLocations.push(`${store.latitude}-${store.longitude}`)
        }

        const item:Item = {
            data: store || null,
            foundWords: [],
            highlight: Tools.noop,
            isHighlighted: false,
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
                Tools.copy(
                    this.resolvedConfiguration.marker.icon as unknown as Icon
                ) :
                {} as Icon

            this.transformIconConfiguration(item.icon)

            item.icon.url = this.resolvedConfiguration.iconPath
            if (store?.markerIconFileName)
                item.icon.url += store.markerIconFileName
            else
                item.icon.url +=
                    this.resolvedConfiguration.defaultMarkerIconFileName
        }

        if (store?.title)
            item.title = store.title

        item.infoWindow = new this.self.maps.InfoWindow({content: ''}) as
            InfoWindow
        item.infoWindow.isOpen = false

        item.marker =
            new this.self.maps.Marker(this.createMarkerConfiguration(item))

        this.attachMarkerEventListener(item)
        this.items.push(item)

        return item.marker
    }
    /**
     * Create marker configuration from given item.
     * @param item - Marker to derive a configuration from.
     *
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
     *
     * @returns Nothing.
     */
    attachMarkerEventListener(item:Item):void {
        this.self.maps.event.addListener(
            item.infoWindow!,
            'closeclick',
            (event:Event):void => {
                if (
                    this.dispatchEvent(new CustomEvent(
                        'infoWindowClose', {detail: {event, item}}
                    )) &&
                    this.dispatchEvent(new CustomEvent(
                        'change', {detail: {value: null}}
                    ))
                ) {
                    item.infoWindow!.isOpen = false

                    this.setPropertyValue('value', null)

                    this.dispatchEvent(new CustomEvent(
                        'infoWindowClosed', {detail: {event, item}}
                    ))
                }
            }
        )

        this.self.maps.event.addListener(
            item.marker as MapMarker,
            'click',
            (event:Event):void => {
                if (this.dispatchEvent(new CustomEvent(
                    'change', {detail: {value: item}}
                ))) {
                    this.setPropertyValue('value', item)
                    this.openMarker(item, event)
                }
            }
        )
    }
    /**
     * Opens given item's marker info window and closes potentially opened
     * windows.
     * @param item - Item's marker to open.
     * @param event - Event which has triggered the marker opening call.
     *
     * @returns Nothing.
     */
    openMarker(item:Item, event?:Event):void {
        if (event && !event.stopPropagation)
            event = undefined

        if (this.dispatchEvent(new CustomEvent(
            'infoWindowOpen', {detail: {event, item}}
        ))) {
            this.highlightMarker(item, event, 'stop')

            /*
                We have to ensure that the minimum zoom level has one more then
                the clustering can appear. Since a cluster hides an open
                window.
            */
            if (
                this.resolvedConfiguration.marker.cluster?.maxZoom &&
                (this.map.getZoom() ?? 0) <=
                    this.resolvedConfiguration.marker.cluster.maxZoom
            )
                this.map.setZoom(
                    this.resolvedConfiguration.marker.cluster.maxZoom + 1
                )

            this.closeSearchResults(event)

            if (this.openWindow?.isOpen && this.openWindow === item.infoWindow)
                return

            const infoWindow:InfoWindow = item.infoWindow as InfoWindow
            item.refreshSize = ():void =>
                /*
                    Simulates a content update to enforce info box size
                    adjusting.
                */
                infoWindow.setContent(infoWindow.getContent())

            this.evaluateDomNodeTemplate(
                this.slots.infoWindow,
                {
                    ...item,
                    [Tools.stringLowerCase(this.self._name) || 'instance']:
                        this,
                    configuration: this.resolvedConfiguration,
                    item,
                    instance: this,
                    Tools
                }
            )
            infoWindow.setContent(this.slots.infoWindow.outerHTML)

            this.closeCurrentWindow()

            infoWindow.isOpen = true
            this.openWindow = infoWindow
            infoWindow.open(this.map, item.marker)

            this.map.panTo(item.position as MapPosition)
            this.map.panBy(
                0,
                -this.resolvedConfiguration.infoWindow
                    .additionalMoveToBottomInPixel
            )

            this.dispatchEvent(new CustomEvent(
                'infoWindowOpened', {detail: {event, item}}
            ))
        }
    }
    /**
     * Focuses given place on map.
     * @param place - Place to open.
     * @param event - Event object which has triggered requested place opening.
     *
     * @returns Nothing.
     */
    focusPlace(place:Item, event?:Event):void {
        if (event)
            event.stopPropagation()

        this.closeSearchResults(event)

        this.closeCurrentWindow()

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
     *
     * @returns Nothing.
     */
    highlightMarker(item:Item, event?:Event, type = 'bounce'):void {
        if (event)
            event.stopPropagation()

        if (this.highlightedItem) {
            if (this.highlightedItem.marker)
                this.highlightedItem.marker.setAnimation(null)
            this.highlightedItem.isHighlighted = false
            this.highlightedItem = null
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
                    (this.map.getZoom() ?? 0) <=
                        this.resolvedConfiguration.marker.cluster.maxZoom &&
                    item.position &&
                    this.map.getBounds()!.contains(item.position)
                ) {
                    this.map.setCenter(item.position)
                    this.map.setZoom(
                        this.resolvedConfiguration.marker.cluster.maxZoom + 1
                    )
                }
                if (item !== this.highlightedItem && item.marker) {
                    item.marker.setAnimation(
                        this.self.maps.Animation[
                            type.toUpperCase() as keyof MapAnimation
                        ]
                    )
                    this.highlightedItem = item
                    item.isHighlighted = true
                }
                this.dispatchEvent(new CustomEvent(
                    'markerHighlighted', {detail: {event, item}}
                ))
            }
    }
    // endregion
}
// endregion
export const api:WebComponentAPI<typeof StoreLocator> = {
    component: StoreLocator,
    register: (tagName = 'store-locator'):void =>
        customElements.define(tagName, StoreLocator)
}
export default api
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
