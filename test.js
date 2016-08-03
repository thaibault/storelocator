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
import browserAPI from 'webOptimizer/browserAPI'
import type {BrowserAPI} from 'webOptimizer/type'
import type {$DomNode, $Deferred} from 'jQuery-tools'
import type StoreLocator from './index'
// endregion
// region declaration
declare var TARGET:string
// endregion
// region types
type JQueryFunction = (object:any) => Object
// endregion
const QUnit:Object = (TARGET === 'node') ? require('qunit-cli') : require(
    'qunitjs')
browserAPI((browserAPI:BrowserAPI):void => {
    const $:JQueryFunction = require('jquery')
    $.context = browserAPI.window.document
    require('./index')
    // region configuration
    QUnit.config = $.extend(QUnit.config || {}, {
        /*
        notrycatch: true,
        noglobals: true,
        */
        altertitle: true,
        autostart: true,
        fixture: '',
        hidepassed: false,
        maxDepth: 3,
        reorder: false,
        requireExpects: false,
        testTimeout: 30 * 1000,
        scrolltop: false
    })
    $('#qunit-fixture').append('<store-locator><input></store-locator>')
    const $storeLocatorDeferred:$Deferred<$DomNode> = $(
        'store-locator'
    ).StoreLocator({marker: {cluster: null}})
    // endregion
    $storeLocatorDeferred.always(($storeLocatorDomNode:$DomNode):void => {
        const storeLocator:$Deferred<StoreLocator> = $storeLocatorDomNode.data(
            'StoreLocator')
        // region tests
        // / region public methods
        // //  region special
        QUnit.test('initialize', (assert:Object):void => {
            assert.ok(storeLocator)
            assert.ok($storeLocatorDomNode.children('div').length > 0)
            assert.ok($storeLocatorDomNode.find('input').length > 0)
        })
        // // endregion
        // / endregion
        // endregion
        if (TARGET === 'node') {
            browserAPI.window.close()
            QUnit.load()
        }
    })
    // region hot module replacement
    /*
        NOTE: hot module replacement doesn't work with async tests yet since
        qunit is not resetable yet:

        if (typeof module === 'object' && 'hot' in module && module.hot) {
            module.hot.accept()
            // IgnoreTypeCheck
            module.hot.dispose(():void => {
                QUnit.reset()
                console.clear()
            }
        }
    */
    // endregion
})
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
