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
import PropertyTypes from 'clientnode/property-types'
import {
    Mapping, ObjectMaskConfiguration, ProcedureFunction, ValueOf
} from 'clientnode/type'
/// <reference path="googlemaps" />
/// <reference path="googlemaps/coordinates" />
/// <reference path="googlemaps/event" />
/// <reference path="googlemaps/geocoder" />
/// <reference path="googlemaps/map" />
/// <reference path="googlemaps/marker" />
/// <reference path="googlemaps/places-service" />
/// <reference path="googlemaps/places-widget" />
import {MarkerClustererOptions} from '@googlemaps/markerclustererplus'
// endregion
// region exports
// / region map implementation
export type MapAnimation = typeof google.maps.Animation
export type MapArea = google.maps.LatLngBounds
export type MapEventListener = google.maps.MapsEventListener
export type MapGeocoder = google.maps.Geocoder
export type MapGeocoderResult = google.maps.GeocoderResult
export type MapGeocoderStatus = google.maps.GeocoderStatus
export type MapIcon = google.maps.Icon
export type MapImpl = google.maps.Map
export type MapInfoWindow = google.maps.InfoWindow
export type MapMarker = google.maps.Marker
export type MapMarkerClustererOptions = MarkerClustererOptions
export type MapMarkerOptions = google.maps.MarkerOptions
export type MapOptions = google.maps.MapOptions
export type MapPosition = google.maps.LatLng
export type MapPlaceResult = google.maps.places.PlaceResult
export type MapPlacesService = google.maps.places.PlacesService
export type MapSearchBox = google.maps.places.SearchBox
export type MapSearchBoxOptions = google.maps.places.SearchBoxOptions
export type MapSize = google.maps.Size
export type Maps = {
    Animation:typeof google.maps.Animation
    ControlPosition:typeof google.maps.ControlPosition
    event:{
        addListener:(
            _instance:InfoWindow|MapImpl|MapInfoWindow|MapMarker|MapSearchBox,
            _eventName:string,
            _handler:(..._parameters:Array<any>) => void
        ) => MapEventListener
        addListenerOnce:(
            _instance:InfoWindow|MapImpl|MapInfoWindow|MapMarker|MapSearchBox,
            _eventName:string,
            _handler:(..._parameters:Array<any>) => void
        ) => MapEventListener
    }
    Geocoder:typeof google.maps.Geocoder
    GeocoderStatus:typeof google.maps.GeocoderStatus
    geometry:{
        spherical:{
            computeDistanceBetween:(
                _from:MapPosition, _to:MapPosition, _radius?:number
            ) => number
        }
    }
    InfoWindow:typeof google.maps.InfoWindow
    LatLng:typeof google.maps.LatLng
    LatLngBounds:typeof google.maps.LatLngBounds
    Map:typeof google.maps.Map
    Marker:typeof google.maps.Marker
    mockup?:boolean
    places:{
        PlacesService:typeof google.maps.places.PlacesService
        SearchBox:typeof google.maps.places.SearchBox
    }
    Size:typeof google.maps.Size
}
export type MapTextSearchRequest = google.maps.places.TextSearchRequest
// / endregion
export type PropertyTypes = {
    baseConfiguration:ValueOf<typeof PropertyTypes>
    configuration:ValueOf<typeof PropertyTypes>
    dynamicConfiguration:ValueOf<typeof PropertyTypes>
}
export type Store = Mapping<any> & {
    address?:string
    city?:string
    id?:number|string
    latitude?:number
    longitude?:number
    markerIconFileName?:string
    street?:string
    streetAndStreetnumber?:string
    streetnumber?:string
    title?:string
    zipCode?:string
    zipCodeAndCity?:string
}
export type Square = {
    height:number
    unit:string
    width:number
}
export type Icon = {
    scaledSize?:MapSize|Square
    size?:MapSize|Square
    url:string
}
export type InfoWindow = MapInfoWindow & {isOpen:boolean}
export type Item<StoreType extends Store = Store> = {
    close?:Function
    data:null|StoreType
    foundWords:Array<string>
    highlight:(_event?:Event, _type?:string) => void
    icon?:Icon
    infoWindow?:InfoWindow
    isHighlighted:boolean
    marker?:MapMarker
    open:(_event?:Event) => void
    position:MapPosition|null
    refreshSize?:ProcedureFunction
    title?:string
}
export type Position = {
    latitude:number
    longitude:number
}
export type SearchConfiguration = {
    generic:{
        filter:(_place:MapPlaceResult) => boolean
        maximalDistanceInMeter:number
        minimumNumberOfSymbols:number
        number:Array<number>
        prefer:boolean
        retrieveOptions:MapTextSearchRequest
        searchDebounceTimeInMilliseconds:number
    },
    maximumNumberOfResults:number
    normalizer:(_value:string) => string
    properties:Array<string>
    resultAggregation:'cut'|'union'
    stylePropertiesToDeriveFromInputField:Array<string>
}
export type AppearanceConfiguration = {
    hide:Mapping<number|string>
    showAnimation:[Mapping<number|string>, Mapping<number|string>]
}
export type Configuration<StoreItem = Store> = {
    additionalStoreProperties:object
    applicationInterface:{
        callbackName?:null|string
        key?:null|string
        url:string
    }
    debug:boolean
    defaultMarkerIconFileName?:null|string
    distanceToMoveByDuplicatedEntries:number
    fallbackLocation:Position
    filter:null|string
    iconPath:string
    infoWindow:{additionalMoveToBottomInPixel:number}
    input:AppearanceConfiguration
    ip:string
    ipToLocationApplicationInterface:{
        bounds:{
            northEast:Position
            southWest:Position
        }
        key?:null|string
        protocol:string
        timeoutInMilliseconds:number
        url:string
    }
    limit:{
        northEast:Position
        southWest:Position
    }
    loadingHideAnimation:[Mapping<number|string>, Mapping<number|string>]
    map:MapOptions
    marker:{
        cluster?:MapMarkerClustererOptions|null
        icon:{
            scaledSize:Square
            size:Square
        }
    }
    name:string
    root:AppearanceConfiguration
    search:number|SearchConfiguration
    securityResponsePrefix:string
    showInputAfterLoadedDelayInMilliseconds:number
    startLocation?:null|Position
    stores:Array<StoreItem>|string|{
        generateProperties:(_store:object) => object
        northEast:Position
        number:number
        southWest:Position
    }
    successfulSearchZoomLevel:number
    urlModelMask:ObjectMaskConfiguration
}
// endregion
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
