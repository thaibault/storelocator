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

<!--|deDE:Inhalt-->
Content
------

<!--Place for automatic generated table of contents.-->
[TOC]

<!--|deDE:Beispiele-->
Examples
--------

<!--|deDE:Verwendung-->
Usage
-----

<!--|deDE:Designvorgaben für die Store-Locator Beispiele-->
### Adding some style to our store locator examples

<!--showExample:cascadingStyleSheet-->

    #!CSS

    body div.simple-store-locator, body div.advanced-store-locator {
        width: 100%;
        height: 400px;
        margin: 0px;
        padding: 0px
    }
    body div.simple-store-locator > div,
    body div.advanced-store-locator > div {
        height: 100%;
    }
    body div.simple-store-locator input.form-control,
    body div.advanced-store-locator input.form-control {
        margin-top: 9px;
        width: 230px;
        display: none;
    }
    body div.simple-store-locator div.gm-style-iw > div,
    body div.advanced-store-locator div.gm-style-iw > div {
        width: 225px;
        height: 60px;
        padding: 5px;
    }

<!--|deDE:Laden einiger benötigter Ressourcen-->
### Load needed dependencies

<!--showExample:javaScript-->

    #!JavaScript

    const dependenciesLoadPromise = documentationWebsiteJQuery.getScript(
        'https://code.jquery.com/jquery-3.1.0.js'
    ).then(() => {
        window.jquery = $
        return $.getScript(
            'http://torben.website/jQuery-tools/data/distributionBundle/' +
            'index.compiled.js')
    }).then(() => $.getScript(
        'https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/src/' +
        'markerclusterer.js'
    )).then(() => $.getScript(
        'http://torben.website/jQuery-storeLocator/data/distributionBundle/' +
        'index.compiled.js'))

<!--|deDE:Einfaches Beispiel-->
### Simple example

<!--showExample-->

    #!HTML

    <script>
        const initializeSimple = () => $(
            'body div.simple-store-locator'
        ).StoreLocator()
    </script>
    <div class="simple-store-locator"><input class="form-control" /></div>

<!--|deDE:Erweitertes Beispiel-->
### Advanced example with all available options.

<!--showExample-->

    #!HTML

    <script>
        const initializeAdvanced = () => $(
            'body div.advanced-store-locator'
        ).StoreLocator({
            stores: {
                northEast: {latitude: 85, longitude: 180},
                southWest: {latitude: -85, longitude: -180},
                number: 100,
                generateProperties: (store) => store
            },
            addtionalStoreProperties: {},
            iconPath: '/webAsset/image/storeLocator/',
            defaultMarkerIconFileName: null,
            startLocation: null,
            fallbackLocation: {latitude: 51.124213, longitude: 10.147705},
            ip: null,
            ipToLocation: {
                applicationInterfaceURL: '{1}://freegeoip.net/json/{2}',
                timeoutInMilliseconds: 5000,
                bounds: {
                    northEast: {latitude: 85, longitude: 180},
                    southWest: {latitude: -85, longitude: -180}
                }
            },
            map: {zoom: 3},
            showInputAfterLoadedDelayInMilliseconds: 500,
            inputFadeInOption: {duration: 'fast'},
            distanceToMoveByDuplicatedEntries: 0.0001,
            marker: {
                cluster: {
                    gridSize: 100, maxZoom: 11, imagePath:
                        'https://cdn.rawgit.com/googlemaps/' +
                        'js-marker-clusterer/gh-pages/images/m',
                },
                icon: {
                    size: {width: 44, height: 49, unit: 'px'},
                    scaledSize: {width: 44, height: 49, unit: 'px'}
                }
            },
            successfulSearchZoom: 12,
            infoWindow: {
                content: null,
                additionalMoveToBottomInPixel: 120,
                loadingContent: '<div class="idle">loading...</div>'
            },
            searchBox: 50,
            onLoaded: $.noop,
            onInfoWindowOpen: $.noop,
            onInfoWindowOpened: $.noop,
            onAddSearchResults: $.noop,
            onRemoveSearchResults: $.noop,
            onOpenSearchResults: $.noop,
            onCloseSearchResults: $.noop,
            onMarkerHighlighted: $.noop
        })
    </script>
    <div class="advanced-store-locator"><input class="form-control"></div>

<!--|deDE:Initialisierung der Store-Locator Beispiele-->
### Initialize both store locator examples

<!--showExample:javaScript-->

    #!JavaScript

    window.initialize = () => {
        initializeSimple()
        initializeAdvanced()
    }
    dependenciesLoadPromise.then(() => $.getScript(
        'http://maps.googleapis.com/maps/api/js' +
        '?v=3&sensor=false&libraries=places,geometry&callback=initialize'))

<!-- region modline
vim: set tabstop=4 shiftwidth=4 expandtab:
vim: foldmethod=marker foldmarker=region,endregion:
endregion -->
