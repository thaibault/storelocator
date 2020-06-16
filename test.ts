// @flow
// #!/usr/bin/env node
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
import type {$Deferred, $DomNode} from 'clientnode'
import registerTest from 'clientnode/test'
import type StoreLocator from './index'
// endregion
registerTest(function(
    roundType:string, targetTechnology:?string, $:any
):$Deferred<$DomNode> {
    require('./index')
    $('#qunit-fixture').append('<store-locator><input></store-locator>')
    const $storeLocatorDeferred:$Deferred<$DomNode> = $(
        'store-locator'
    ).StoreLocator({
        applicationInterface: {
            key: 'AIzaSyBAoKgqF4XaDblkRP4-94BITpUKzB767LQ'
        },
        ipToLocationApplicationInterface: {
            key: '11a62990a1424e894da6eec464a747e6'
        },
        searchBox: {},
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
    // IgnoreTypeCheck
    return $storeLocatorDeferred.always((
        $storeLocatorDomNode:$DomNode
    ):void => {
        const storeLocator:$Deferred<StoreLocator> = $storeLocatorDomNode.data(
            'StoreLocator')
        // region tests
        this.test('initialize', async (assert:Object):Promise<void> => {
            const done:Function = assert.async()
            assert.ok(storeLocator)
            if (targetTechnology === 'web') {
                assert.ok($storeLocatorDomNode.children('div').length > 0)
                const $inputDomNode:$DomNode = $storeLocatorDomNode.find(
                    'input')
                assert.ok($inputDomNode.length > 0)
                $inputDomNode.val('a')
                $inputDomNode.trigger({
                    keyCode: $.Tools.class.keyCode.a,
                    type: `keyup`
                })
                await $.Tools.class.timeout()
                assert.strictEqual(
                    $storeLocatorDomNode.find(
                        '.store-locator-search-results'
                    ).length,
                    1)
            }
            done()
        })
        // endregion
    })
}, 'full')
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
