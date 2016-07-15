#!/usr/bin/env node
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
import * as fileSystem from 'fs'
import * as pug from 'pug'
import * as loaderUtils from 'loader-utils'
// NOTE: Only needed for debugging this file.
try {
    require('source-map-support/register')
} catch (error) {}

import Helper from './helper.compiled'
// endregion
// region types
type TemplateFunction = (locals:Object) => string
type CompileFunction = (template:string, options:Object) => TemplateFunction
// endregion
module.exports = function(source:string):string {
    if (this.cacheable)
        this.cacheable()
    const query:Object = Helper.extendObject(true, {
        moduleAliases: [], knownExtensions: ['.pug', '.html', '.js', '.css'],
        context: './'
    }, this.options.pug || {}, loaderUtils.parseQuery(this.query))
    const compile:CompileFunction = (
        template:string, options:Object = query.compiler
    ):TemplateFunction => (locals:Object = {}):string => {
        options = Helper.extendObject(true, {
            filename: template, doctype: 'html',
            compileDebug: this.debug || false
        }, options)
        let templateFunction:TemplateFunction
        if (options.isString) {
            delete options.isString
            templateFunction = pug.compile(template, options)
        } else
            templateFunction = pug.compileFile(template, options)
        return templateFunction(Helper.extendObject(true, {
            require: (request:string):string => {
                const template:string = request.replace(/^(.+)\?[^?]+$/, '$1')
                const queryMatch:?Array<string> = request.match(
                    /^.+\?([^?]+)$/, '$1')
                let nestedLocals:Object = {}
                if (queryMatch) {
                    const evaluationFunction = (
                        request:string, template:string, source:string,
                        compile:CompileFunction, locals:Object
                    ):Object =>
                        // IgnoreTypeCheck
                        new Function(
                            'request', 'template', 'source', 'compile',
                            'locals', `return ${queryMatch[1]}`
                        )(request, template, source, compile, locals)
                    nestedLocals = evaluationFunction(
                        request, template, source, compile, locals)
                }
                const options:Object = Helper.extendObject(true, {
                    encoding: 'utf-8'
                }, nestedLocals.options || {})
                if (options.isString)
                    return compile(template, options)(nestedLocals)
                const templateFilePath:string = Helper.determineModuleFilePath(
                    template, query.moduleAliases, query.knownExtensions,
                    query.context)
                this.addDependency(templateFilePath)
                if (queryMatch || templateFilePath.endsWith('.pug'))
                    return compile(templateFilePath, options)(nestedLocals)
                return fileSystem.readFileSync(templateFilePath, options)
            }}, locals))
    }
    return compile(source, Helper.extendObject(true, {
        isString: true,
        filename: loaderUtils.getRemainingRequest(this).replace(/^!/, '')
    }, query.compiler || {}))(query.locals || {})
}
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
