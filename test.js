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
import type {Window} from 'webOptimizer/type'
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
browserAPI((window:Window, alreadyLoaded:boolean):void => {
    /*
        NOTE: We have to define window globally before jQuery is loaded to
        ensure that all jquery instances share the same window object.
    */
    if (typeof global !== 'undefined' && global !== window) {
        global.window = window
        for (const key in window)
            if (window.hasOwnProperty(key) && !global.hasOwnProperty(key))
                global[key] = window[key]
    }
    const $:JQueryFunction = require('jquery')
    $.context = window.document
    require('./index')
    if (TARGET === 'node')
        QUnit.load()
    else if (!alreadyLoaded)
        QUnit.start()
    // region mock-up
    $('body div#qunit-fixture').append(
        '<store-locator><input></store-locator>')
    const storeLocatorDeferred:$Deferred<$DomNode> = $(
        'store-locator'
    ).StoreLocator()
    // endregion
    storeLocatorDeferred.always(($storeLocatorDomNode:$DomNode):void => {
        const storeLocator:$Deferred<StoreLocator> = $storeLocatorDomNode.data(
            'StoreLocator')
        // region tests
        // / region public methods
        // //  region special
        QUnit.test('initialize', (assert:Object):void => {
            assert.ok(storeLocator)
        })
        // // endregion
        // / endregion
        // endregion
    })
    //  region hot module replacement handler
    if (typeof module === 'object' && 'hot' in module && module.hot) {
        module.hot.accept()
        // IgnoreTypeCheck
        module.hot.dispose(():void => {
            /*
                NOTE: We have to delay status indicator reset because qunits
                status updates are delayed as well.
            */
            setTimeout(():void => {
                if (!$('.fail').length) {
                    window.document.title = '✔ test'
                    $('#qunit-banner').removeClass('qunit-fail').addClass(
                        'qunit-pass')
                }
            }, 0)
            $('#qunit-tests').html('')
            console.clear()
        })
    }
    // endregion
})
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
