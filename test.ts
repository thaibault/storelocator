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
import {beforeAll, describe, expect, test} from '@jest/globals'
import Tools, {globalContext} from 'clientnode'
import {RecursivePartial, $Global} from 'clientnode/type'
import nodeFetch from 'node-fetch'

import api, {StoreLocator} from './index'
import {Configuration} from './type'
// endregion
// region prepare environment
globalContext.fetch = nodeFetch as unknown as typeof fetch
;(globalContext as $Global & {google:typeof google}).google = {
    maps: {
        ControlPosition: {TOP_LEFT: 0},
        event: {addListener: Tools.noop},
        InfoWindow: class {
            open:() => void = Tools.noop
            setContent:() => void = Tools.noop
        },
        LatLng: class {
            lat = ():number => 1
            lng = ():number => 1
        },
        LatLngBounds: class {
            contains:() => true = ():true => true
        },
        Map: class {
            controls:Array<Array<number>> = [[]]
            getCenter = ():Record<string, never> => ({})
            panBy:() => void = Tools.noop
            panTo:() => void = Tools.noop
        },
        Marker: class {
            setAnimation:() => void = Tools.noop
        },
        mockup: true,
        places: {
            PlacesService: class {
                textSearch = (
                    options:object, callback:(_words:Array<string>) => void
                ):void =>
                    callback([])
            },
            SearchBox: Tools.noop
        }
    }
} as unknown as typeof google

const defaultConfiguration:RecursivePartial<Configuration> = {
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
    search: {},
    // Automatically generated store with option: "stores: bounds"
    stores: [{
        address: 'Elgendorfer Str. 57, 56410 Montabaur, Deutschland',
        eMailAddress: 'info@fake-1.de',
        latitude: 50.4356,
        longitude: 7.81226,
        name: '1 & 1 Telecom GmbH',
        phoneNumber: '+49 721 9600'
    }]
}
Tools.extend(true, StoreLocator.defaultConfiguration, defaultConfiguration)

const name = 'test-store-locator'
api.register(name)
// endregion
// region tests
describe('api', ():void => {
    test('api definitions', ():void => {
        expect(api).toBeDefined()
        expect(api).toHaveProperty('component', StoreLocator)

        expect(document.createElement(name)).toBeInstanceOf(StoreLocator)
    })
})
describe('StoreLocator', ():void => {
    beforeAll(():Promise<void> => StoreLocator.applicationInterfaceLoad)
    // region tests
    test('custom element definition', ():void => {
        const storeLocator:StoreLocator =
            document.createElement(name) as StoreLocator
        document.body.appendChild(storeLocator)

        expect(storeLocator).toBeDefined()
    })
    test('attribute configuration', ():void => {
        const storeLocator:StoreLocator =
            document.createElement(name) as StoreLocator
        document.body.appendChild(storeLocator)

        storeLocator.setAttribute('configuration', '{value: 2}')

        expect(storeLocator).toHaveProperty('configuration.value', 2)
        expect(storeLocator).toHaveProperty('resolvedConfiguration.value', 2)
    })
    test('search results', async ():Promise<void> => {
        const storeLocator:StoreLocator =
            document.createElement(name) as StoreLocator
        document.body.appendChild(storeLocator)

        await new Promise((resolve:(_value:unknown) => void):void =>
            storeLocator.addEventListener('loaded', resolve)
        )

        expect(Array.from(storeLocator.querySelectorAll('div')).length)
            .toBeGreaterThan(0)

        const inputDomNode:HTMLInputElement =
            storeLocator.querySelector('input') as HTMLInputElement
        expect(inputDomNode).toBeDefined()

        inputDomNode.value = 'a'
        inputDomNode.dispatchEvent(new KeyboardEvent('keyup', {key: 'a'}))

        expect(storeLocator.querySelector('.store-locator-search-results'))
            .toBeDefined()
    })
    // endregion
})
// endregion
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
