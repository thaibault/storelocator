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
export type MapArea = google.maps.LatLngBounds
export type MapEventListener = google.maps.MapsEventListener
export type MapGeocoder = google.maps.Geocoder
export type MapGeocoderResult = google.maps.GeocoderResult
export type MapGeocoderStatus = google.maps.GeocoderStatus
export type MapImpl<TElement extends Element = Element> =
    google.maps.Map<TElement>
export type MapInfoWindow = google.maps.InfoWindow
export type MapMarker = google.maps.Marker
export type MapMarkerOptions = google.maps.ReadonlyMarkerOptions
export type MapOptions = google.maps.MapOptions
export type MapPosition = google.maps.LatLng
export type MapPlaceResult = google.maps.places.PlaceResult
export type MapPlacesService = google.maps.places.PlacesService
export type MapReadonlyMarkerOptions = google.maps.ReadonlyMarkerOptions
export type MapSearchBox = google.maps.places.SearchBox
export type MapSearchBoxOptions = google.maps.places.SearchBoxOptions
export type MapSize = google.maps.Size
export type Maps = {
    ControlPosition:typeof google.maps.ControlPosition;
    event:{
        addListener:(instance:MapImpl|MapSearchBox, eventName:string, handler:(...args: any[]) => void) => MapEventListener;
        addListenerOnce:(instance:MapImpl|MapSearchBox, eventName:string, handler:(...args: any[]) => void) => MapEventListener;
    };
    Geocoder:typeof google.maps.Geocoder;
    GeocoderStatus:typeof google.maps.GeocoderStatus;
    geometry:{
        spherical:{
            computeDistanceBetween:(from:MapPosition, to:MapPosition, radius?:number) =>
                number;
        };
    };
    InfoWindow:typeof google.maps.InfoWindow;
    LatLng:typeof google.maps.LatLng;
    LatLngBounds:typeof google.maps.LatLngBounds;
    Map:typeof google.maps.Map;
    Marker:typeof google.maps.Marker;
    places:{
        PlacesService:typeof google.maps.places.PlacesService;
        SearchBox:typeof google.maps.places.SearchBox;
    };
    Size:typeof google.maps.Size;
}
export type MapTextSearchRequest = google.maps.places.TextSearchRequest
// / endregion
export type Store = object & {
    latitude?:number;
    longitude?:number;
    markerIconFileName?:string;
    title?:string;
}
export type Square = {
    height:number;
    unit:string;
    width:number
};
export type Icon = {
    scaledSize?:MapSize|Square;
    size?:MapSize|Square;
    url?:string;
}
export type Item = {
    close?:Function;
    data:null|Store;
    foundWords:Array<string>;
    highlight:(event?:Event, type?:string) => void;
    icon?:Icon;
    infoWindow?:MapInfoWindow;
    isHighlighted:boolean;
    isOpen:boolean;
    map:MapImpl;
    nativeMarker?:MapMarker;
    open:(event?:Event) => void;
    position:MapPosition|null;
    title?:string;
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
            scaledSize:Square;
            size:Square;
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
    stores:Array<Store>|string|{
        generateProperties:(store:object) => object;
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
