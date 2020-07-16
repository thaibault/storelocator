// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
'use strict'
/* !
    region header
    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import Tools, {augment$, determine$} from 'clientnode'
import {$Global, $DomNode} from 'clientnode/type'
import {getInitializedBrowser} from 'weboptimizer/browser'
import {InitializedBrowser} from 'weboptimizer/type'

import StoreLocator from './index'
// endregion
// region declaration
declare var TARGET_TECHNOLOGY:string
// endregion
let testEnvironment:string = 'browser'
if (typeof TARGET_TECHNOLOGY === 'undefined' || TARGET_TECHNOLOGY === 'node') {
    testEnvironment = typeof document === 'undefined' ?
        'node' :
        'node-with-dom'
}
describe(`storeLocator (${testEnvironment})`, ():void => {
    // region mockup
    let $domNode:$DomNode
    let storeLocator:StoreLocator
    beforeAll(async ():Promise<void> => {
        const browser:InitializedBrowser = await getInitializedBrowser()
        globalThis.window = browser.window as Window & typeof globalThis
        jest.resetModules();
        (globalThis as $Global).$ = require('jquery')
        augment$(determine$())
        /*
            NOTE: Import plugin with side effects (augmenting "$" scope /
            registering plugin) when other imports are only used as type.
        */
        require('./index')
        if (testEnvironment !== 'browser')
            globalThis.window.google = {
                maps: {
                    ControlPosition: {
                        TOP_LEFT: 0
                    },
                    event: {
                        addListenerOnce: Tools.noop
                    },
                    InfoWindow: Tools.noop,
                    LatLng: Tools.noop,
                    LatLngBounds: class {
                        contains:Function = ():true => true
                    },
                    Map: class {
                        controls:Array<Array<number>> = [[]]
                        getCenter:Function = ():{} => ({})
                    },
                    Marker: Tools.noop,
                    mockup: true,
                    places: {
                        PlacesService: class {
                            textSearch:Function = (
                                options:object, callback:Function
                            ):void => callback([])
                        },
                        SearchBox: Tools.noop
                    }
                },
            } as unknown as typeof google
        $(window.document.body)
            .append('<store-locator><input></store-locator>')
        $domNode = await $('store-locator').StoreLocator({
            applicationInterface: {
                key: 'AIzaSyBAoKgqF4XaDblkRP4-94BITpUKzB767LQ'
            },
            ipToLocationApplicationInterface: {
                key: '11a62990a1424e894da6eec464a747e6'
            },
            marker: {
                // Is not loadable without browser environment.
                cluster: null
            },
            searchOptions: {},
            // Automatically generated store with option: "stores: bounds"
            stores: [{
                address: 'Elgendorfer Str. 57, 56410 Montabaur, Deutschland',
                eMailAddress: 'info@fake-1.de',
                latitude: 50.4356,
                longitude: 7.81226,
                name: '1 & 1 Telecom GmbH',
                phoneNumber: '+49 721 9600'
            }]
        })
        storeLocator = $domNode.data('StoreLocator')
    })
    // endregion
    // region tests 
    test('initialize', async ():Promise<void> => {
        expect(storeLocator).toBeDefined()
        if (testEnvironment !== 'node') {
            expect($domNode.children('div').length).toBeGreaterThan(0)
            const $inputDomNode:$DomNode<HTMLInputElement> =
                $domNode.find('input')
            expect($inputDomNode.length).toBeGreaterThan(0)
            $inputDomNode.val('a')
            $inputDomNode.trigger({
                keyCode: Tools.keyCode.a,
                type: 'keyup'
            } as JQuery.Event)
            await Tools.timeout()
            expect($domNode.find('.store-locator-search-results').length)
                .toStrictEqual(1)
        }
    })
    // endregion
})
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
