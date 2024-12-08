// -*- coding: utf-8 -*-
/** @module type */
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
/// <reference path="googlemaps" />
/// <reference path="googlemaps/coordinates" />
/// <reference path="googlemaps/event" />
/// <reference path="googlemaps/geocoder" />
/// <reference path="googlemaps/map" />
/// <reference path="googlemaps/marker" />
/// <reference path="googlemaps/places-service" />
/// <reference path="googlemaps/places-widget" />

import {
    Mapping, ObjectMaskConfiguration, ProcedureFunction, ValueOf
} from 'clientnode'
import PropertyTypes from 'clientnode/property-types'
import {
    Cluster as MapMarkerCluster,
    ClusterStats as MapMarkerClusterStats,
    SuperClusterOptions
} from '@googlemaps/markerclusterer'
// endregion
// region exports
/// region map implementation
export type MapAnimation = typeof google.maps.Animation
export type MapArea = google.maps.LatLngBounds
export type MapEventListener = google.maps.MapsEventListener
export type MapGeocoder = google.maps.Geocoder
export type MapGeocoderResult = google.maps.GeocoderResult
export type MapGeocoderStatus = google.maps.GeocoderStatus
export type MapIcon = google.maps.Icon
export type MapImpl = google.maps.Map
export type MapInfoWindow = google.maps.InfoWindow
export type MapMarker = google.maps.marker.AdvancedMarkerElement
export type MapMarkerClustererOptions = SuperClusterOptions
export type MapMarkerOptions = google.maps.marker.AdvancedMarkerElementOptions
export type MapOptions = google.maps.MapOptions
export type MapPosition = google.maps.LatLng
export type MapPlaceResult = google.maps.places.PlaceResult
export type MapPlacesService = google.maps.places.PlacesService
export type MapSearchBox = google.maps.places.SearchBox
export type MapSearchBoxOptions = google.maps.places.SearchBoxOptions
export type MapSize = google.maps.Size
export type MapItem =
    InfoWindow |
    MapImpl |
    MapInfoWindow |
    MapMarker |
    MapSearchBox
export interface Maps {
    Animation: typeof google.maps.Animation
    ControlPosition: typeof google.maps.ControlPosition
    event: {
        addListener: (
            instance: MapItem,
            eventName: string,
            handler: (event: Event) => void
        ) => MapEventListener
        addListenerOnce: (
            instance: MapItem,
            eventName: string,
            handler: (event: Event) => void
        ) => MapEventListener
    }
    Geocoder: typeof google.maps.Geocoder
    GeocoderStatus: typeof google.maps.GeocoderStatus
    geometry: {
        spherical: {
            computeDistanceBetween: (
                from: MapPosition, to: MapPosition, radius?: number
            ) => number
        }
    }
    InfoWindow: typeof google.maps.InfoWindow
    LatLng: typeof google.maps.LatLng
    LatLngBounds: typeof google.maps.LatLngBounds
    Map: typeof google.maps.Map
    marker: {
        AdvancedMarkerElement: typeof google.maps.marker.AdvancedMarkerElement
    }
    mockup?: boolean
    places: {
        PlacesService: typeof google.maps.places.PlacesService
        SearchBox: typeof google.maps.places.SearchBox
    }
    Size: typeof google.maps.Size
}
export type MapTextSearchRequest = google.maps.places.TextSearchRequest
/// endregion
export interface PropertyTypes {
    baseConfiguration: ValueOf<typeof PropertyTypes>
    configuration: ValueOf<typeof PropertyTypes>
    dynamicConfiguration: ValueOf<typeof PropertyTypes>
}
export type Store = Mapping<unknown> & {
    address?: string
    city?: string
    id?: number | string
    latitude?: number
    longitude?: number
    markerIconFileName?: string
    street?: string
    streetAndStreetnumber?: string
    streetnumber?: string
    title?: string
    zipCode?: string
    zipCodeAndCity?: string
}
export interface Square {
    height: number
    unit: string
    width: number
}
export interface Icon {
    scaledSize?: MapSize | Square
    size?: MapSize | Square
    url: string
}
export type InfoWindow = MapInfoWindow & {isOpen: boolean}
export interface Item<StoreType extends Store = Store> {
    close?: () => void
    data: null | StoreType
    foundWords: Array<string>
    highlight: (event?: Event, type?: string) => void
    icon?: Icon
    infoWindow?: InfoWindow
    isHighlighted: boolean
    marker?: MapMarker
    open: (event?: Event) => void
    position: MapPosition | null
    refreshSize?: ProcedureFunction
    title?: string
}
export interface Position {
    latitude: number
    longitude: number
}
export interface SearchConfiguration {
    generic: {
        filter: (place: MapPlaceResult) => boolean
        maximalDistanceInMeter: number
        minimumNumberOfSymbols: number
        number?: Array<number>
        prefer: boolean
        retrieveOptions: MapTextSearchRequest
        searchDebounceTimeInMilliseconds: number
    }
    maximumNumberOfResults: {
        location: number
        query: number
    }
    normalizer: (value: string) => string
    properties: Array<string>
    resultAggregation: 'cut' | 'union'
    resultsBarAlwaysVisible: boolean
    stylePropertiesToDeriveFromInputField: Array<string>
}
export interface AppearanceConfiguration {
    hide: Mapping<number | string>
    showAnimation: [Mapping<number | string>, Mapping<number | string>]
}
export type ClusterOptions = MapMarkerOptions & {count: number}
export type RendererConfiguration =
    Array<ClusterOptions> |
    MapMarkerOptions |
    null |
    ((
        defaultOptions: MapMarkerOptions,
        cluster: MapMarkerCluster,
        stats: MapMarkerClusterStats
    ) => MapMarkerOptions)
export interface Configuration<StoreItem = Store> {
    additionalStoreProperties: object
    defaultMarkerIconFileName?: null | string
    filter: null | string | ((store: StoreItem) => boolean)
    boundaries: {
        northEast: Position
        southWest: Position
    }
    numberOfStoresToGenerate: number
    stores: Array<StoreItem>
    storesAPIURL: string
    transformStore: null | string | ((store: StoreItem) => StoreItem)

    applicationInterface: {
        callbackName?: null | string
        key?: null | string
        url: string
    }

    debug: boolean

    distanceToMoveByDuplicatedEntries: number

    fallbackLocation: Position
    ip: string
    ipToLocationApplicationInterface: {
        bounds?: {
            northEast: Position
            southWest: Position
        }
        key?: null | string
        protocol: string
        timeoutInMilliseconds: number
        url: string
    }
    startLocation?: null | Position

    iconPath: string
    infoWindow: {additionalMoveToBottomInPixel: number}
    input: AppearanceConfiguration
    root: AppearanceConfiguration
    loadingHideAnimation: [Mapping<number | string>, Mapping<number | string>]
    showInputAfterLoadedDelayInMilliseconds: number

    limit?: {
        northEast: Position
        southWest: Position
    }

    map: MapOptions

    marker: {
        cluster?: MapMarkerClustererOptions | null
        icon?: {
            scaledSize: Square
            size: Square
        }
        renderer?: RendererConfiguration
    }

    name: string

    search: number | SearchConfiguration
    successfulSearchZoomLevel: number

    securityResponsePrefix: string

    urlModelMask: ObjectMaskConfiguration
}
// endregion
