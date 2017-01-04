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
    See http://creativecommons.org/licenses/by/3.0/deed.de
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
    ).StoreLocator({api: {key: 'AIzaSyBAoKgqF4XaDblkRP4-94BITpUKzB767LQ'}})
    return $storeLocatorDeferred.always((
        $storeLocatorDomNode:$DomNode
    ):void => {
        const storeLocator:$Deferred<StoreLocator> = $storeLocatorDomNode.data(
            'StoreLocator')
        // region tests
        // / region public methods
        // //  region special
        this.test('initialize', (assert:Object):void => {
            assert.ok(storeLocator)
            assert.ok($storeLocatorDomNode.children('div').length > 0)
            const $inputDomNode:$DomNode = $storeLocatorDomNode.find('input')
            assert.ok($inputDomNode.length > 0)
            $inputDomNode.val('a')
            const $resultsDomNode:$DomNode = $storeLocatorDomNode.find(
                '.store-locator-search-results')
            // TODO assert.ok($resultsDomNode.length)
        })
        // // endregion
        // / endregion
        // endregion
    })
}, ['full'], true)
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
