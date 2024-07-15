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

[![npm](https://img.shields.io/npm/v/storelocator?color=%23d55e5d&label=npm%20package%20version&logoColor=%23d55e5d&style=for-the-badge)](https://www.npmjs.com/package/storelocator)
[![npm downloads](https://img.shields.io/npm/dy/storelocator.svg?style=for-the-badge)](https://www.npmjs.com/package/storelocator)

[![build](https://img.shields.io/github/actions/workflow/status/thaibault/storelocator/build.yaml?style=for-the-badge)](https://github.com/thaibault/storelocator/actions/workflows/build.yaml)

[![check types](https://img.shields.io/github/actions/workflow/status/thaibault/storelocator/check-types.yaml?label=check%20types&style=for-the-badge)](https://github.com/thaibault/storelocator/actions/workflows/check-types.yaml)
[![lint](https://img.shields.io/github/actions/workflow/status/thaibault/storelocator/lint.yaml?label=lint&style=for-the-badge)](https://github.com/thaibault/storelocator/actions/workflows/lint.yaml)
[![test](https://img.shields.io/github/actions/workflow/status/thaibault/storelocator/test-coverage-report.yaml?label=test&style=for-the-badge)](https://github.com/thaibault/storelocator/actions/workflows/test-coverage-report.yaml)

[![code coverage](https://img.shields.io/coverallsCoverage/github/thaibault/storelocator?label=code%20coverage&style=for-the-badge)](https://coveralls.io/github/thaibault/storelocator)

[![documentation website](https://img.shields.io/website-up-down-green-red/https/torben.website/storelocator.svg?label=documentation-website&style=for-the-badge)](https://torben.website/storelocator)

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

```HTML
<!--Inject downloaded file:
<script src="index.js"></script>
-->
<!--Or integrate via cdn:-->
<script
    src="https://torben.website/storelocator/data/distributionBundle/index.js"
></script>
```

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

```JSON
...
"dependencies": {
    ...
    "storelocator": "latest",
    ...
},
...
```

After updating your packages you can simply depend on this script and let
a module bundler do the hard stuff or access it via an exported variable name
in given context.
<!--deDE:
    Nach einem Update deiner Pakete kannst du dieses Plugin einfach in deine
    JavaScript-Module importieren oder die exportierte Variable im gegebenen
    Context referenzieren.
-->

```JavaScript
...
import storeLocatorAPI from 'storelocator'

// Default tag name is "store-locator".
storelocatorAPI.register(/*'my-store-locator-tag-name'*/)
...
```

Then inject component in html:

```HTML
<store-locator></store-locator>
```

<!--|deDE:Beispiele-->
Examples
--------

<!--|deDE:Designvorgaben für die Store-Locator Beispiele-->
### Adding some style to our store locator examples

<!--showExample:cascadingStyleSheet-->

```CSS
store-locator {
    font-family: Roboto, Arial, sans-serif;

    display: block;

    width: 100%;
    height: 400px;

    margin: 0px;
    padding: 0px
}

.web-component-template {
    display: none;
}

store-locator > div {
    height: 100%;
}

.store-locator__input {
    margin-top: 9px;
    margin-left: 9px;

    width: 230px;
}

store-locator .gm-style-iw > div {
    width: 225px;
    height: 60px;
    padding: 5px;
}
```

<!--|deDE:Einfaches Beispiel-->
### Simple example

Download, register component and use new component.

<!--showExample-->

```HTML
<script
    src="https://torben.website/storelocator/data/distributionBundle/index.js"
></script>

<script>
    console.info('Register "store-locator" tag name.')

    storelocator.index.api.register()
</script>

<store-locator
    configuration="{
        applicationInterface: {
            // NOTE: You should use your own google maps application interface
            // key.
            key: 'AIzaSyBAoKgqF4XaDblkRP4-94BITpUKzB767LQ'
        }
    }"
>
    <input>
</store-locator>
```

<!--|deDE:Erweitertes Beispiel mit allen verfügbaren (standart) Optionen-->
### Advanced example with all available (default) options

<!--showExample-->

```HTML
<store-locator
    configuration="{
        applicationInterface: {
            // NOTE: You should use your own google maps application interface
            // key.
            key: 'AIzaSyBAoKgqF4XaDblkRP4-94BITpUKzB767LQ'
        },
        ipToLocationApplicationInterface: {
            bounds: {
                northEast: {latitude: 55.12, longitude: 14.89},
                southWest: {latitude: 47.32, longitude: 5.50}
            },
            key: '11a62990a1424e894da6eec464a747e6'
        },

        defaultMarkerIconFileName:
            'https://via.placeholder.com/50/0099ff/ffffff.png',
        // Automatically generated stores with option: {stores: bounds}
        stores: [
            {
                address:
                    'Elgendorfer Str. 57, 56410 Montabaur, Deutschland',
                eMailAddress: 'info@fake-1.de',
                id: 1,
                latitude: 50.4356,
                longitude: 7.81226,
                name: '1 & 1 Telecom GmbH',
                phoneNumber: '+49 721 9600'
            },
            {
                address:
                    'Freiheitsstr.1a, 53842 Troisdorf, Deutschland',
                eMailAddress: '1a@demo.de',
                id: 2,
                latitude: 50.82791,
                longitude: 7.1219600000000005,
                name: '1A-Bike&Parts GmbH',
                phoneNumber: '02241 / 91 18 09 3',
                websiteURL: 'http://www.1a-bike.bike'
            },
            {
                address:
                    'Niederrheinische Str. 27, 34626 Neukirchen, Deutschland',
                eMailAddress: 'tfddfa@de.de',
                id: 3,
                latitude: 50.871640000000006,
                longitude: 9.337940000000001,
                name: '1a Fahrradservice',
                phoneNumber: '+49 (6694) 7878',
                websiteURL: 'http://www.1a-fahrradservice-diegelmann.de'
            },
            {
                address:
                    'Dener Strasse 73, 48653 Coesfeld, Deutschland',
                eMailAddress: '12345@example.org',
                id: 4,
                latitude: 51.93271000000001,
                longitude: 9.337940000000001,
                name: '2-Rad-Baumeister',
                phoneNumber: '+49 (2541) 2509',
                websiteURL: 'www.2rad-baumeister.de'
            },
            {
                address:
                    'Friedrichstr. 100, 47475 Kamp - Lintfort, Deutschland',
                eMailAddress: 'test@example.org',
                id: 5,
                latitude: 51.508750000000006,
                longitude: 6.553020000000001,
                name: '2 - Rad Behringer',
                phoneNumber: '02842 / 42 471',
                websiteURL: 'www.zweirad-behringer.de'
            },
            {
                address:
                    'Werster Str. 86, 32549 Bad Oeynhausen, Deutschland',
                eMailAddress: 'test@example.org',
                id: 6,
                latitude: 52.215630000000004,
                longitude: 8.785,
                name:
                    '2Rad Berger Fahrradhandel & Tankstelle Marcus Berger',
                phoneNumber: '+49 (5731) 28930',
                websiteURL: 'www.2radberger.de'
            },
            {
                address: 'Rauchstr. 16, 34454 Bad Arolsen, Deutschland',
                eMailAddress: 'test@example.org',
                id: 7,
                latitude: 51.38242,
                longitude: 9.01524,
                name: '2Rad Br\u00fcne',
                phoneNumber: '05691 / 2220',
                websiteURL: 'http://2rad-bruene.de'
            },
            {
                address: 'Schneiderstr.40, 46244 Bottrop, Deutschland',
                id: 8,
                latitude: 51.57477,
                longitude: 6.90406,
                name: '2 - Rad B\u00fcning',
                phoneNumber: '02045 / 57 38',
                websiteURL: 'http://www.2-rad-buening.de'
            },
            {
                address: 'Butenwall 63, 46325 Borken, Deutschland',
                eMailAddress: 'test@example.org',
                id: 9,
                latitude: 51.846050000000005,
                longitude: 6.8543,
                name: '2Rad Busch',
                phoneNumber: '+49 (2861) 2692',
                websiteURL: 'www.2rad-busch.de '
            },
            {
                address:
                    'Herzebrockerstrasse 12, 33378 Rheda-Wiedenbrück, Deutschland',
                eMailAddress: 'test@example.org',
                id: 10,
                latitude: 51.85799,
                longitude: 8.28283,
                name: '2-rad Butschko',
                phoneNumber: '05242 / 4 31 61',
                websiteURL: 'http://www.zweirad-butschko.de'
            }
        ],

        limit: {
            northEast: {latitude: 55.12, longitude: 14.89},
            southWest: {latitude: 47.32, longitude: 5.50}
        },
        map: {minZoom: 5, zoom: 9},

        search: {}
    }"
>
    <input
        bind-property-title="configuration.name"
        class="store-locator__input"
        placeholder="Please provide some search words"
        slot="input"
    />

    <a
        class="store-locator__link"
        href="https://www.google.com"
        slot="link"
    >Legal notes example</a>
</store-locator>
```
