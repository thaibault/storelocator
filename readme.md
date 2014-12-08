<!-- !/usr/bin/env markdown
-*- coding: utf-8 -*- -->

<!-- region header

Copyright Torben Sickert 16.12.2012

License
-------

This library written by Torben Sickert stand under a creative commons naming
3.0 unported license. see http://creativecommons.org/licenses/by/3.0/deed.de

endregion -->

<!--|deDE:Einsatz-->
Use case
--------

A jQuery plugin to serve a store locator with google maps API.
<!--deDE:
    Ein jQuery-Plugin zum Bereitstellen eines Google-Maps-Storelocator.
-->

<!--|deDE:Verwendung-->
Usage
-----

<!--showExample-->

    #!HTML

    <style type="text/css">
        body div[store-locator] {
            width: 100%;
            height: 400px;
            margin: 0px;
            padding: 0px
        }
        body div[store-locator] > div {
            height: 100%;
        }
        body div[store-locator] input.form-control {
            margin-top: 27px;
            width: 230px;
            display: none;
        }
        body div[store-locator] div.gm-style-iw > div {
            width: 225px;
            height: 60px;
            padding: 5px;
        }
    </style>

    <script type="text/javascript" src="http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/src/markerclusterer.js"></script>
    <script type="text/javascript" src="distributionBundle/jquery-2.1.1.js"></script>
    <script type="text/javascript" src="distributionBundle/jquery-tools-1.0.js"></script>
    <script type="text/javascript" src="distributionBundle/jquery-storeLocator-1.0.js"></script>

    <script type="text/javascript">
        window.initialize = function() {$(function($) {
            $('body div[store-locator]').StoreLocator({
                /*
                    URL to retrieve stores, list of stores or object describing
                    bounds to create random stores within. If a
                    "generateProperties" function is given it will be called to
                    retrieve additional properties for each store. The
                    specified store will be given to the function.

                */
                stores: {
                    northEast: {latitude: 85, longitude: 180},
                    southWest: {latitude: -85, longitude: -180},
                    number: 100, generateProperties: function(store) {
                        return {};
                    }
                },
                // Path prefix to search for marker icons.
                iconPath: '/webAsset/image/storeLocator/',
                /*
                    Specifies a fallback marker icon (if no store specific icon
                    was set). If set to "null" google will place a fallback
                    icon.
                */
                defaultMarkerIconFileName: null,
                /*
                    If not provided we initialize the map with center in
                    current location determined by internet protocol address.
                */
                startLocation: null,
                // Fallback location if automatic detection fails.
                fallbackLocation: {latitude: 51.124213, longitude: 10.147705},
                /*
                    Current ip. If set to "null" ip will be determined
                    dynamically
                */
                ip: null,
                ipToLocation: {
                    /*
                        IP to location determination api url. {1} and {2}
                        epresents currently used protocol and potentially given
                        ip.
                    */
                    apiURL: '{1}://freegeoip.net/json/{2}',
                    /*
                        Time to wait for ip resolve. If time is up initialize
                        on given fallback location.
                    */
                    timeoutInMilliseconds: 5000
                },
                // Initial view properties.
                map: {zoom: 3},
                // Delay before we show search input field.
                showInputAfterLoadedDelayInMilliseconds: 500,
                // Transition to show search input field.
                inputFadeInOption: {duration: 'fast'},
                /*
                    Distance to move if stores are determined with same
                    latitude and longitude.
                */
                distanceToMoveByDuplicatedEntries: 0.0001,
                // Options passed to the marker cluster.
                markerCluster: {gridSize: 100, maxZoom : 11},
                /*
                    Search result precision tolerance to identify a marker as
                    search result.
                */
                searchResultDistanceToleranceInMeter: 50,
                /*
                    Specifies a zoom value wich will be adjusted after
                    successfully picked a search result. If set to "null" no
                    zoom change happens.
                */
                successfulSearchZoom: 12,
                infoWindow: {
                    /*
                        Function or string returning or representing the info
                        box. If a function is given and a promise is returned
                        the info box will be filled with the given loading
                        content and updated with the resolved data. If nothing
                        is provided all available data will be listed in a
                        generic info window.
                    */
                    content: null,
                    /*
                        Additional move to bottom relative to the marker if an
                        info window has been opened.
                    */
                    additionalMoveToBottomInPixel: 100,
                    /*
                        Content to show in the info window during info window
                        load.
                    */
                    loadingContent: 'loading...'
                },
                // Function to call if map is fully initialized.
                onLoaded: $.noop,
                // Triggers if a marker info window will be opened.
                onInfoWindowOpen: $.noop,
                // Triggers if a marker info window has finished opening.
                onInfoWindowOpened: $.noop
            });
        });};
    </script>

    <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?v=3&sensor=false&libraries=places,geometry&callback=initialize"></script>

    <div store-locator><input type="text" class="form-control" /></div>

<!-- region modline

vim: set tabstop=4 shiftwidth=4 expandtab:
vim: foldmethod=marker foldmarker=region,endregion:

endregion -->
