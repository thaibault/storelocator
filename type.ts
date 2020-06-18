// #!/usr/bin/env node
// -*- coding: utf-8 -*-
/** @module clientnode */
'use strict'
/* !
    region header
    [Project page](https://torben.website/clientnode)

    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import {Mapping, Options as BaseOptions, PlainObject} from 'clientnode/type'
import 'googlemaps'
import 'googlemaps/coordinates'
import 'googlemaps/event'
import 'googlemaps/geocoder'
import 'googlemaps/map'
import 'googlemaps/marker'
import 'googlemaps/places-service'
import 'googlemaps/places-widget'
// endregion
// region exports
// /  region implementation
export type MapImpl<TElement extends Element = Element> = google.maps.Map<TElement>
export type MapArea = google.maps.LatLngBounds
export type MapGeocoder = google.maps.Geocoder
export type MapGeocoderResult = google.maps.GeocoderResult
export type MapGeocoderStatus = google.maps.GeocoderStatus
export type MapMarker = google.maps.Marker
export type MapMarkerOptions = google.maps.ReadonlyMarkerOptions
export type MapOptions = google.maps.MapOptions
export type MapPosition = google.maps.LatLng
export type MapPlaceResult = google.maps.places.PlaceResult
export type MapPlacesService = google.maps.places.PlacesService
export type MapSearchBox = google.maps.places.SearchBox
export type MapSearchBoxOptions = google.maps.places.SearchBoxOptions
export type Maps = {
    ControlPosition:google.maps.ControlPosition;
    event:{
        // TODO
        addListener:(instance: object, eventName: string, handler: (...args: any[]) => void): MapsEventListener;
        addListenerOnce:(instance: object, eventName: string, handler: (...args: any[]) => void): MapsEventListener;
    };
    Geocoder:new () => MapGeocoder;
    LatLng:new (latitude:number, longitude: number, noWrap?:boolean) =>
        MapPosition;
    LatLngBounds:new (southWest:MapPosition, northEast:MapPosition) =>
        MapArea;
    Map:new <TElement extends Element = Element>(
        domNode:TElement, options?:MapOptions
    ) => MapImpl<TElement>;
    Marker:new (options?:MapMarkerOptions) => MapMarker;
    places:{
        PlacesService:new <TElement extends Element = Element>(
            map:MapImpl<TElement>
        ) => MapPlacesService;
        SearchBox:new (
            inputDomNode:HTMLInputElement, options?:MapSearchBoxOptions
        ) => MapSearchBox;
    }
}
export type MapTextSearchRequest = google.maps.places.TextSearchRequest
// / endregion
export type Marker = {
    data:object;
    map:MapImpl;
    nativeMarker:MapMarker;
    position:MapPosition;
}
export type Position = {
    latitude:number;
    longitude:number;
}
export type SearchOptions = {
    content?:string|((searchResults:Array<Item>, limitReached:boolean) =>
        Promise<string>|string
    );
    generic:{
        filter:(place:MapPlaceResult) => boolean;
        number:Array<number>;
        maximalDistanceInMeter:number;
        prefer:boolean;
        retrieveOptions:MapTextSearchRequest;
    },
    loadingContent:string;
    maximumNumberOfResults:number;
    noResultsContent:string;
    normalizer:(value:string) => string;
    properties:Array<string>;
    resultAggregation:'cut'|'union';
    stylePropertiesToDeriveFromInputField:Array<string>;
}
export type Item = Mapping<any> & {
    data:null|object;
    foundWords:Array<string>;
    highlight:(event:object, type:string) => void;
    open:(event:object) => void;
    position:MapPosition;
}
export type Options = BaseOptions & {
    additionalStoreProperties:object;
    applicationInterface:{
        url:string;
        callbackName?:null|string;
        key?:null|string;
    };
    defaultMarkerIconFileName?:null|string;
    distanceToMoveByDuplicatedEntries:number;
    fallbackLocation:Position;
    iconPath:string;
    infoWindow:{
        additionalMoveToBottomInPixel:number;
        content?:null|string;
        loadingContent:string;
    };
    input:{
        hide:Mapping<number|string>;
        showAnimation:[Mapping<number|string>, string];
    };
    ip:string;
    ipToLocationApplicationInterface:{
        bounds:{
            northEast:Position;
            southWest:Position;
        };
        key?:null|string;
        protocol:string;
        timeoutInMilliseconds:number;
        url:string;
    };
    limit:{
        northEast:Position;
        southWest:Position;
    };
    map:MapOptions;
    marker:{
        cluster:{
            gridSize:number;
            imagePath:string;
            maxZoomLevel:number;
        },
        icon:{
            scaledSize:{
                height:number;
                unit:string;
                width:number
            };
            size:{
                height:number;
                unit:string;
                width:number;
            };
        };
    };
    onInfoWindowOpen:Function;
    onInfoWindowOpened:Function;
    onAddSearchResults:Function;
    onRemoveSearchResults:Function;
    onOpenSearchResults:Function;
    onCloseSearchResults:Function;
    onMarkerHighlighted:Function;
    searchOptions:number|SearchOptions;
    showInputAfterLoadedDelayInMilliseconds:number;
    startLocation?:null|Position;
    stores:Array<Item>|string|{
        generateProperties:(store:Item) => Item;
        northEast:Position;
        number:number;
        southWest:Position;
    };
    successfulSearchZoomLevel:number;
}
// endregion
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
