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

    <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?v=3&sensor=false&libraries=places"></script>
    <script type="text/javascript" src="http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/src/markerclusterer.js"></script>

    <script type="text/javascript" src="distributionBundle/jquery-2.1.1.js"></script>
    <script type="text/javascript" src="distributionBundle/jquery-tools-1.0.js"></script>
    <script type="text/javascript" src="distributionBundle/jquery-storeLocator-1.0.js"></script>

    <div store-locator><input type="text" /></div>
    <style type="text/css">
        body div[store-locator] {
            border: 1px solid blue;
        }
        body div[store-locator] input {
            border: 1px solid red;
        }
    </style>
    <script type="text/javascript">
        $(function($) {
            $('body div[store-locator]').StoreLocator({
                // URL or list of stores.
                stores: '/StoreLocatorData.json',
                // Function or string returning or representing the infoBox
                infoBox: null,
                // Path prefix to search for marker icons.
                iconPath: '/webAsset/image/storeLocator/',
                // If not provided we initialize the map with center in current
                // location determined by internet protocol address.
                startLocation: null,
                // Determine ip dynamically
                ip: null,
                // IP to location determination api url. {1} and {2} represents
                // currently used protocoll and potentially given ip.
                ipToLocationAPIURL: '{1}://freegeoip.net/json/{2}',
                // Initial view properties.
                map: {zoom: 11},
                // Function to call if map is fully initialized.
                onLoaded: $.noop,
                // Delay before we show search input field.
                showInputAfterLoadedDelayInMilliseconds: 4000,
                // Transition to show search input field.
                inputFadeInOption: {duration: 'fast'}
            });
        });
    </script>

<!-- region modline

vim: set tabstop=4 shiftwidth=4 expandtab:
vim: foldmethod=marker foldmarker=region,endregion:

endregion -->
