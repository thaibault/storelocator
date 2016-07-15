// #!/usr/bin/env node
// @flow
// -*- coding: utf-8 -*-
'use strict'
/* !
    region header
    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons naming
    3.0 unported license. see http://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import type {OnDomContentLoadedListenerFunction, Window} from './type'
 // endregion
// region declaration
declare var TARGET:string
declare var window:Window
// endregion
// region constants
const onDomContentLoadedListener:Array<OnDomContentLoadedListenerFunction> = []
// endregion
// region functions
let windowWithLoadedDomContent:?Window = null
const onDomContentLoaded = (window:Window):void => {
    windowWithLoadedDomContent = window
    for (
        const callback:OnDomContentLoadedListenerFunction of
        onDomContentLoadedListener
    )
        callback(window, false)
}
// endregion
// region ensure presence of common browser environment
if (typeof TARGET === 'undefined' || TARGET === 'node') {
    // region mock browser environment
    const dom = require('jsdom')
    dom.env(`
    <!doctype html>
        <html>
            <head>
                <meta charset="UTF-8">
                <!--Prevent browser caching-->
                <meta http-equiv="cache-control" content="no-cache">
                <meta http-equiv="expires" content="0">
                <meta http-equiv="pragma" content="no-cache">
                <title>test</title>
                <link
                    href="/node_modules/qunitjs/qunit/qunit.css"
                    rel="stylesheet" type="text/css"
                >
            </head>
        <body>
            <div id="qunit"></div>
            <div id="qunit-fixture"></div>
        </body>
    </html>
    `, (error:?Error, window:Object):void => {
        if (error)
            throw error
        else {
            Object.defineProperty(window, 'location', {
                value: {
                    hash: '',
                    search: '',
                    pathname: '/path',
                    port: '',
                    hostname: 'localhost',
                    host: 'localhost',
                    protocol: 'http:',
                    origin: 'http://localhost',
                    href: 'http://localhost/path',
                    username: '',
                    password: '',
                    assign: ():void => {},
                    reload: ():void => {},
                    replace: ():void => {},
                    toString: function():string {
                        return this.href
                    }
                },
                writable: false
            })
            onDomContentLoaded(window)
        }
    })
    // endregion
} else
    window.document.addEventListener('DOMContentLoaded', ():void => {
        onDomContentLoaded(window)
    })
// endregion
export default (
    callback:OnDomContentLoadedListenerFunction
):void => {
    if (windowWithLoadedDomContent)
        callback(windowWithLoadedDomContent, true)
    else
        onDomContentLoadedListener.push(callback)
}
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
