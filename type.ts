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
import 'googlemaps'
// endregion
// region exports
// /  region implementation
export type Map = google.maps.Map
export type PlacesService = google.maps.places.PlacesService
export type MapMarker = google.maps.Marker
export type MapPosition = google.maps.LatLng
export type Maps = {
    LatLng:MapPosition;
    map:Map;
    Marker:MapMarker;
    places:{
        PlacesService:google.maps.places.PlacesService;
        SearchBox:google.maps.places.SearchBox;
    }
}
export type PlaceResult = google.maps.places.PlaceResult
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
// TODO
export type SearchOptions = {
    generic: {
        number: [2, 5],
        maximalDistanceInMeter: 1000000,
        filter: (place:PlaceResult):boolean =>
            /(?:^| )(?:Deutschland|Germany)( |$)/i.test(
                place.formatted_address
            ),
        prefer: true,
        retrieveOptions: {radius: '50000'}
    },
    properties: [
        'eMailAddress', 'eMail', 'email',
        'formattedAddress', 'formatted_address', 'address',
        'name',
        'street', 'streetAndStreetnumber',
        'zip', 'zipCode', 'postalCode'
    ],
    maximumNumberOfResults: 50,
    loadingContent: this._options.infoWindow.loadingContent,
    noResultsContent:
        '<div class="no-results">No results found</div>',
    resultAggregation: 'cut',
    stylePropertiesToDeriveFromInputField: [
        'left',
        'right',
        'top',
        'backgroundColor',
        'maxWidth',
        'minWidth',
        'position',
        'paddingBottom',
        'paddingLeft',
        'paddingRight',
        'paddingTop',
        'width'
    ],
    normalizer: (value:string):string =>
        `${value}`
            .toLowerCase()
            .replace(/[-_]+/g, '')
            .replace(/ß/g, 'ss')
            .replace(/(^| )str\./g, '$1strasse')
            .replace(/[& ]+/g, ' ')
}
export type Item = {
    data:object;
    foundWords:Array<string>;
    highlight:(event:object, type:string) => void;
    open:(event:object) => void;
    position:MapPosition;
}
// endregion
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
