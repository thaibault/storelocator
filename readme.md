<!-- !/usr/bin/env markdown
-*- coding: utf-8 -*-
region header
Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

License
-------

This library written by Torben Sickert stand under a creative commons naming
3.0 unported license. See https://creativecommons.org/licenses/by/3.0/deed.de
endregion -->

Project status
--------------

[![npm](https://img.shields.io/npm/v/storelocator?color=%23d55e5d&label=npm%20package%20version&logoColor=%23d55e5d)](https://www.npmjs.com/package/storelocator)
[![npm downloads](https://img.shields.io/npm/dy/storelocator.svg)](https://www.npmjs.com/package/storelocator)

[![<LABEL>](https://github.com/thaibault/storelocator/actions/workflows/build.yaml/badge.svg)](https://github.com/thaibault/storelocator/actions/workflows/build.yaml)
[![<LABEL>](https://github.com/thaibault/storelocator/actions/workflows/test.yaml/badge.svg)](https://github.com/thaibault/storelocator/actions/workflows/test.yaml)
[![<LABEL>](https://github.com/thaibault/storelocator/actions/workflows/test:coverage:report.yaml/badge.svg)](https://github.com/thaibault/storelocator/actions/workflows/test:coverage:report.yaml)
[![<LABEL>](https://github.com/thaibault/storelocator/actions/workflows/check:types.yaml/badge.svg)](https://github.com/thaibault/storelocator/actions/workflows/check:types.yaml)
[![<LABEL>](https://github.com/thaibault/storelocator/actions/workflows/lint.yaml/badge.svg)](https://github.com/thaibault/storelocator/actions/workflows/lint.yaml)

[![code coverage](https://coveralls.io/repos/github/thaibault/storelocator/badge.svg)](https://coveralls.io/github/thaibault/storelocator)

<!-- Too unstable yet
[![dependencies](https://img.shields.io/david/thaibault/storelocator.svg)](https://david-dm.org/thaibault/storelocator)
[![development dependencies](https://img.shields.io/david/dev/thaibault/storelocator.svg)](https://david-dm.org/thaibault/storelocator?type=dev)
[![peer dependencies](https://img.shields.io/david/peer/thaibault/storelocator.svg)](https://david-dm.org/thaibault/storelocator?type=peer)
-->
[![documentation website](https://img.shields.io/website-up-down-green-red/https/torben.website/storelocator.svg?label=documentation-website)](https://torben.website/storelocator)

<!--|deDE:Einsatz-->
Use case
--------

A webcomponent to serve a store locator via google maps.
<!--deDE:
    Eine Web-Komponente zum Bereitstellen eines Google-Maps-Storelocators.
-->

<!--Place for automatic generated table of contents.-->
<div class="doc-toc" style="display:none">
    <!--|deDE:Inhalt-->
    <h2 id="content">Content</h2>
</div>

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
    <script src="https://goo.gl/HEL97d"></script>
    <script src="https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/src/markerclusterer.js"></script>
    <!--Inject downloaded file:-->
    <script src="index.compiled.js"></script>
    <!--Or integrate via cdn:
    <script src="https://goo.gl/s6wRPb"></script>
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
    ).then(() => $.getScript('https://goo.gl/HEL97d')).then(() => $.getScript(
        'https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/src/' +
        'markerclusterer.js'
    )).then(() => $.getScript('https://goo.gl/s6wRPb'))

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

# TODO

 * @property _options.applicationInterface - To store application interface
 * options in.
 * @property _options.applicationInterface.url - URL tor retrieve google maps
 * application interface.
 * @property _options.applicationInterface.callbackName - Global resource path
 * to callback function to trigger when google has finished loading the
 * application interface.
 * @property _options.applicationInterface.key - Application interface key to
 * authenticate against google maps application interface.
 * @property _options.stores - URL to retrieve stores, list of stores or object
 * describing bounds to create random stores within. If a "generateProperties"
 * function is given it will be called to retrieve additional properties for
 * each store. The specified store will be given to the function.
 * @property _options.additionalStoreProperties - Additional static store
 * properties which will be available to each store.
 * @property _options.iconPath - Path prefix to search for marker icons.
 * @property _options.defaultMarkerIconFileName - Specifies a fallback marker
 * icon (if no store specific icon was set). If set to "null" google will place
 * a fallback icon.
 * @property _options.startLocation - If not provided we initialize the map
 * with center in current location determined by internet protocol address. If
 * an object is given a "latitude" and "longitude" with a saved float are
 * assumed.
 * @property _options.fallbackLocation - Fallback location if automatic
 * location determination has failed.
 * @property _options.fallbackLocation.latitude - Latitude value.
 * @property _options.fallbackLocation.longitude - Longitude value.
 * @property _options.ip - If provided given ip will be used to determine
 * current location instead of automatically determined one.
 * @property _options.ipToLocationApplicationInterface - Configuration for ip
 * to location conversion.
 * @property _options.ipToLocationApplicationInterface.bounds - Defines bounds
 * within determined locations should be. If resolved location isn't within
 * this location it will be ignored.
 * @property _options.ipToLocationApplicationInterface.bounds.northEast -
 * Defines north east bound.
 * @property _options.ipToLocationApplicationInterface.bounds.northEast
 * .latitude - North east latitude bond.
 * @property _options.ipToLocationApplicationInterface.bounds.northEast
 * .longitude - North east longitude bond.
 * @property _options.ipToLocationApplicationInterface.bounds.southWest -
 * Defined south west bound.
 * @property _options.ipToLocationApplicationInterface.bounds.southWest
 * .latitude - South east latitude bound.
 * @property _options.ipToLocationApplicationInterface.bounds.southWest
 * .longitude - South west longitude bound.
 * @property _options.ipToLocationApplicationInterface.key - Key to let the api
 * identify your service plan.
 * @property _options.ipToLocationApplicationInterface.protocol - Protocol to
 * use for api requests.
 * @property _options.ipToLocationApplicationInterface.timeoutInMilliseconds -
 * Time to wait for ip resolve. If time is up initialize on given fallback
 * location.
 * @property _options.ipToLocationApplicationInterface.url - IP to location
 * determination application interface url. {1}, {2} and {3} represents
 * currently used protocol, key and potentially given ip.
 * @property _options.map - Initial view properties.
 * @property _options.showInputAfterLoadedDelayInMilliseconds - Delay before we
 * show search input field.
 * @property _options.inputFadeInOption - Transition options to show search
 * input field.
 * @property _options.distanceToMoveByDuplicatedEntries - Distance to move if
 * stores are determined with same latitude and longitude.
 * @property _options.marker - Options passed to the marker cluster. If set to
 * "null" no marker cluster will appear.
 * @property _options.icon - Options passed to the icon.
 * @property _options.successfulSearchZoomLevel - Specifies a zoom value wich
 * will be adjusted after successfully picked a search result. If set to "null"
 * no zoom change happens.
 * @property _options.infoWindow - Info window options.
 * @property _options.infoWindow.content - Function or string returning or
 * representing the info box. If a function is given and a promise is returned
 * the info box will be filled with the given loading content and updated with
 * the resolved data. The function becomes the corresponding marker as first
 * argument and the store locator instance as second argument. If nothing is
 * provided all available data will be listed in a generic info window.
 * @property _options.infoWindow.additionalMoveToBottomInPixel - Additional
 * move to bottom relative to the marker if an info window has been opened.
 * @property _options.infoWindow.loadingContent - Content to show in the info
 * window during info window load.
 * @property _options.search - If a number is given a generic search will be
 * provided and given number will be interpret as search result precision
 * tolerance to identify a marker as search result.
 * @property _options.search.stylePropertiesToDeriveFromInputField - List of
 * cascading style properties to derive from input field and use for search
 * box.
 * @property _options.search.properties - Specify which store data should
 * contain given search text.
 * @property _options.search.maximumNumberOfResults - Limits the auto complete
 * result list.
 * @property _options.search.loadingContent - Markup to display while the
 * results are loading.
 * @property _options.search.generic - Specifies options for the additional
 * generic search to add to specific search results.
 * @property _options.search.generic.number - A tuple describing a range of
 * minimal to maximal limits of additional generic google suggestions depending
 * on number of local search results.
 * @property _options.search.generic.maximalDistanceInMeter - Range to specify
 * maximal distance from current position to search suggestions.
 * @property _options.search.generic.filter - Specifies a callback which gets a
 * relevant place to decide if the place should be included (returns a boolean
 * value).
 * @property _options.search.generic.prefer - Specifies a boolean value
 * indicating if generic search results should be the first results.
 * @property _options.search.generic.retrieveOptions - Specifies how a generic
 * place search should be done (google maps request object specification).
 * @property _options.search.content - Defines how to render the search
 * results. This can be a callback or a string returning or representing the
 * search results. If a function is given and a promise is returned the info
 * box will be filled with the given loading content and updated with the
 * resolved data. The function becomes search results as first argument, a
 * boolean value as second argument indicating if the maximum number of search
 * results was reached and the store locator instance itself as third argument.
 * If nothing is provided all available data will be listed in a generic info
 * window.
 * @property _options.search.resultAggregation - "Union" or "cut".
 * @property _options.search.normalizer - Pure function to normalize strings
 * before searching against them.
 * @property _options.onInfoWindowOpen - Triggers if a marker info window will
 * be opened.
 * @property _options.onInfoWindowOpened - Triggers if a marker info window has
 * finished opening.
 * @property _options.onAddSearchResults - Triggers before new search results
 * appears.
 * @property _options.onRemoveSearchResults - Triggers before old search
 * results will be removed.
 * @property _options.onOpenSearchResults - Triggers before search result box
 * appears.
 * @property _options.onCloseSearchResults - Triggers before search result box
 * will be hidden.
 * @property _options.onMarkerHighlighted - Triggers after a marker starts to
 * highlight.

<!-- region modline
vim: set tabstop=4 shiftwidth=4 expandtab:
vim: foldmethod=marker foldmarker=region,endregion:
endregion -->
