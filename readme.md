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

A jQuery plugin to serve a store locator with google maps Application
interface.
<!--deDE:
    Ein jQuery-Plugin zum Bereitstellen eines Google-Maps-Storelocator.
-->

<!--|deDE:Inhalt-->
Content
------

<!--Place for automatic generated table of contents.-->
[TOC]

<!--|deDE:Installation-->
Installation
------------

<!--|deDE:Klassische Dom-Integration-->
### Classical dom injection

You can simply download the compiled version as zip file here and inject it
after needed dependencies:
<!--deDE:
    Du kannst einfach das Plugin als Zip-Archiv herunterladen und per
    Script-Tag in deine Webseite integrieren:
-->

    #!HTML

    <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
    <script src="http://torben.website/clientNode/data/distributionBundle/index.compiled.js"></script>
    <script src="https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/src/markerclusterer.js"></script>
    <!--Inject downloaded file:-->
    <script src="index.compiled.js"></script>
    <!--Or integrate via cdn:
    <script src="http://torben.website/storeLocator/data/distributionBundle/index.compiled.js"></script>
    -->

The compiled bundle supports AMD, commonjs, commonjs2 and variable injection
into given context (UMD) as export format: You can use a module bundler if you
want.
<!--deDE:
    Das kompilierte Bundle unterstützt AMD, commonjs, commonjs2 und
    Variable-Injection in den gegebenen Context (UMD) als Export-Format:
    Dadurch können verschiedene Module-Bundler genutzt werden.
-->

<!--|deDE:Paket-Management und Modul-Komposition-->
### Package managed and module bundled

If you are using npm as package manager you can simply add this tool to your
**package.json** as dependency:
<!--deDE:
    Nutzt du npm als Paket-Manager, dann solltest du einfach deine
    <strong>package.json</strong> erweitern:
-->

    #!JSON

    ...
    "dependencies": {
        ...
        "storelocator": "latest",
        ...
    },
    ...

After updating your packages you can simply depend on this script and let
a module bundler do the hard stuff or access it via an exported variable name
in given context.
<!--deDE:
    Nach einem Update deiner Pakete kannst du dieses Plugin einfach in deine
    JavaScript-Module importieren oder die exportierte Variable im gegebenen
    Context referenzieren.
-->

    #!JavaScript

    ...
    import StoreLocator from 'storelocator'
    class SpecialStoreLocator extends StoreLocator...
    // or
    import {$} from 'storelocator'
    class SpecialStoreLocator extends $.StoreLocator.class ...
    // or
    StoreLocator = require('storelocator').default
    value instanceof StoreLocator
    // or
    $ = require('storelocator').$
    $('[store-locator]').StoreLocator()
    ...

<!--|deDE:Beispiele-->
Examples
--------

<!--|deDE:Designvorgaben für die Store-Locator Beispiele-->
### Adding some style to our store locator examples

<!--showExample:cascadingStyleSheet-->

    #!CSS

    body.documentation simple-store-locator,
    body.documentation advanced-store-locator,
    body.documentation div.store-locator-with-bounds {
        width: 100%;
        height: 400px;
        margin: 0px;
        padding: 0px
    }
    body.documentation simple-store-locator > div,
    body.documentation advanced-store-locator > div,
    body.documentation div.store-locator-with-bounds > div {
        height: 100%;
    }
    body.documentation simple-store-locator input.form-control,
    body.documentation advanced-store-locator input.form-control,
    body.documentation div.store-locator-with-bounds input.form-control {
        margin-top: 9px;
        margin-left: 9px;
        width: 230px;
    }
    body.documentation simple-store-locator div.gm-style-iw > div,
    body.documentation advanced-store-locator div.gm-style-iw > div,
    body.documentation div.store-locator-with-bounds div.gm-style-iw > div {
        width: 225px;
        height: 60px;
        padding: 5px;
    }

<!--|deDE:Laden einiger benötigter Ressourcen-->
### Load needed dependencies

<!--showExample:javaScript-->

    #!JavaScript

    const dependenciesLoadPromise = $documentationWebsite.getScript(
        'https://code.jquery.com/jquery-3.1.1.min.js'
    ).then(() => $.getScript(
        'http://torben.website/clientNode/data/distributionBundle/' +
        'index.compiled.js'
    )).then(() => $.getScript(
        'https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/src/' +
        'markerclusterer.js'
    )).then(() => $.getScript(
        'http://torben.website/storeLocator/data/distributionBundle/' +
        'index.compiled.js'))

<!--|deDE:Einfaches Beispiel-->
### Simple example

<!--showExample-->

    #!HTML

    <script>
        dependenciesLoadPromise.always(() => $(
            'body simple-store-locator'
        ).StoreLocator({applicationInterface: {
            // NOTE: You should use your own google maps application interface
            // key.
            key: 'AIzaSyBAoKgqF4XaDblkRP4-94BITpUKzB767LQ'
        }}))
    </script>
    <simple-store-locator><input class="form-control"></simple-store-locator>

<!--|deDE:Erweitertes Beispiel mit allen verfügbaren (standart) Optionen-->
### Advanced example with all available (default) options

<!--showExample-->

    #!HTML

    <script>
        dependenciesLoadPromise.always(() => $(
            'body advanced-store-locator'
        ).StoreLocator({
            applicationInterface: {
                url:
                    'https://maps.googleapis.com/maps/api/js' +
                    '?{1}v=3&sensor=false&libraries=places,geometry&' +
                    'callback={2}',
                callbackName: null,
                // NOTE: You should use your own google maps application
                // interface key.
                key: 'AIzaSyBAoKgqF4XaDblkRP4-94BITpUKzB767LQ'
            },
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
            input: {
                hide: {opacity: 0},
                showAnimation: [{opacity: 1}, {duration: 'fast'}]
            },
            distanceToMoveByDuplicatedEntries: 0.0001,
            marker: {
                cluster: {
                    gridSize: 100, maxZoom: 11, imagePath:
                        'https://cdn.rawgit.com/googlemaps/' +
                        'js-marker-clusterer/gh-pages/images/m'
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
            onInfoWindowOpen: $.noop,
            onInfoWindowOpened: $.noop,
            onAddSearchResults: $.noop,
            onRemoveSearchResults: $.noop,
            onOpenSearchResults: $.noop,
            onCloseSearchResults: $.noop,
            onMarkerHighlighted: $.noop
        }))
    </script>
    <advanced-store-locator>
        <input class="form-control">
    </advanced-store-locator>

<!--|deDE:Beispiel mit limitiertem traversierbarem Bereich (Deutschland)-->
### Example with limited traversable area (Germany)

<!--showExample-->

    #!HTML

    <script>
        dependenciesLoadPromise.always(() => {
            const bounds = {
                northEast: {latitude: 55.12, longitude: 14.89},
                southWest: {latitude: 47.32, longitude: 5.50}
            }
            $('body div.store-locator-with-bounds').StoreLocator({
                applicationInterface: {
                    // NOTE: You should use your own google maps applciation
                    // interface key.
                    key: 'AIzaSyBAoKgqF4XaDblkRP4-94BITpUKzB767LQ'
                },
                ipToLocation: {bounds},
                limit: {zoom: {minimum: 5}, bounds},
                map: {zoom: 5},
                stores: bounds
            })
        })
    </script>
    <div class="store-locator-with-bounds"><input class="form-control"></div>

<!-- region modline
vim: set tabstop=4 shiftwidth=4 expandtab:
vim: foldmethod=marker foldmarker=region,endregion:
endregion -->
