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
import {
    Map as GoogleMap,
    LatLng as GooglePosition,
    Marker as GoogleMarker,
    PlaceResult as GooglePlaceResult
} from 'googlemaps'
// endregion
// region exports
// /  region implementation
export type Map = GoogleMap
export type PlaceResult = GooglePlaceResult
// / endregion
export type Marker = {
    data:object;
    map:Map;
    nativeMarker:GoogleMarker;
    position:GooglePosition;
}
export type Position = {
    latitude:number;
    longitude:number;
}
export type Item = {
    data:object;
    foundWords:Array<string>;
    highlight:(event:object, type:string) => void;
    open:(event:object) => void;
    position:GooglePosition;
}
// endregion
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
