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
import {Options as BaseOptions} from 'clientnode'
import 'googlemaps'
// endregion
// region exports
// /  region implementation
export type Map<TElement extends Element = Element> = google.maps.Map<TElement>
export type MapArea = google.maps.LatLngBounds
export type MapGeocoder = google.maps.Geocoder
export type MapGeocoderResult = google.maps.GeocoderResult
export type MapGeocoderStatus = google.maps.GeocoderStatus
export type MapMarker = google.maps.Marker
export type MapOptions = google.maps.MapOptions
export type MapPosition = google.maps.LatLng
export type MapPlaceResult = google.maps.places.PlaceResult
export type MapPlacesServices = google.maps.places.PlacesService
export type MapSearchBox = google.maps.places.SearchBox
export interface Maps<TElement extends Element = Element> {
    Geocoder:MapGeocoder;
    LatLng:MapPosition;
    Map:Map<TElement>;
    Marker:MapMarker;
    places:{
        PlacesService:MapPlacesServices;
        SearchBox:MapSearchBox;
    }
}
export type MapTextSearchRequest = google.maps.places.TextSearchRequest
// / endregion
export type Marker = {
    data:object;
    map:Map;
    nativeMarker:MapMarker;
    position:MapPosition;
}
export type Position = {
    latitude:number;
    longitude:number;
}
export type SearchOptions = {
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
        callbackName?:Function|null;
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
        hide:PlainObject;
        showAnimation:Array<PlainObject>;
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
