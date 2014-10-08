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
        body div[store-locator] input {
            margin-top: 34px;
            display: none;
        }
        body div[store-locator] div.gm-style-iw > div {
            width: 225px;
            height: 60px;
            padding: 5px;
        }
    </style>

    <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?v=3&sensor=false&libraries=places"></script>
    <script type="text/javascript" src="http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/src/markerclusterer.js"></script>

    <script type="text/javascript" src="distributionBundle/jquery-2.1.1.js"></script>
    <script type="text/javascript" src="distributionBundle/jquery-tools-1.0.js"></script>
    <script type="text/javascript" src="distributionBundle/jquery-storeLocator-1.0.js"></script>

    <script type="text/javascript">
        $(function($) {
            $('body div[store-locator]').StoreLocator({
                // URL, list of stores or object describing bounds to create
                // random string within.
                stores: {
                    northEast: {latitude: 85, longitude: 180},
                    southWest: {latitude: -85, longitude: -180},
                    number: 100
                },
                // Function or string returning or representing the infoBox
                infoBox: null,
                // Path prefix to search for marker icons.
                iconPath: '/image/',
                // Specifies a fallback marker icon (if no store specific icon
                // was set)
                defaultMarkerIconFileName: 'defaultMarkerIcon.png',
                // If not provided we initialize the map with center in current
                // location determined by internet protocol address.
                startLocation: null,
                // Determine ip dynamically
                ip: null,
                // IP to location determination api url. {1} and {2} represents
                // currently used protocoll and potentially given ip.
                ipToLocationAPIURL: '{1}://freegeoip.net/json/{2}',
                // Initial view properties.
                map: {zoom: 3},
                // Function to call if map is fully initialized.
                onLoaded: $.noop,
                // Delay before we show search input field.
                showInputAfterLoadedDelayInMilliseconds: 2000,
                // Transition to show search input field.
                inputFadeInOption: {duration: 'fast'}
            });
        });
    </script>

    <div store-locator><input type="text" class="form-control" /></div>

<!-- region modline

vim: set tabstop=4 shiftwidth=4 expandtab:
vim: foldmethod=marker foldmarker=region,endregion:

endregion -->
