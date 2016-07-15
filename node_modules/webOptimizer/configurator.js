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
import path from 'path'
// NOTE: Only needed for debugging this file.
try {
    require('source-map-support/register')
} catch (error) {}

import Helper from './helper.compiled'
// NOTE: "{configuration as metaConfiguration}" would result in a read only
// variable named "metaConfiguration".
import {configuration as givenMetaConfiguration} from './package'
/* eslint-disable no-unused-vars */
import type {
    DefaultConfiguration, HTMLConfiguration, MetaConfiguration, PlainObject,
    ResolvedConfiguration
} from './type'
/* eslint-enable no-unused-vars */
let metaConfiguration:MetaConfiguration = givenMetaConfiguration
metaConfiguration.default.path.context = path.resolve(__dirname, '../../')
metaConfiguration.default.contextType = 'main'
if (
    path.basename(path.dirname(process.cwd())) === 'node_modules' ||
    path.basename(path.dirname(process.cwd())) === '.staging' &&
    path.basename(path.dirname(path.dirname(process.cwd()))) === 'node_modules'
) {
    metaConfiguration.default.path.context = process.cwd()
    metaConfiguration.default.contextType = 'dependency'
}
let specificConfiguration:PlainObject
try {
    // IgnoreTypeCheck
    specificConfiguration = require(path.join(
        metaConfiguration.default.path.context, 'package'))
} catch (error) {
    specificConfiguration = {name: 'mockup'}
    metaConfiguration.default.path.context = process.cwd()
}
const name:string = specificConfiguration.name
specificConfiguration = specificConfiguration.webOptimizer || {}
specificConfiguration.name = name
// endregion
// region loading default configuration
// NOTE: Given node command line arguments results in "npm_config_*"
// environment variables.
let debug:boolean = metaConfiguration.default.debug
if (specificConfiguration.debug !== undefined)
    debug = specificConfiguration.debug
if (process.env.npm_config_production)
    debug = false
else if (process.env.npm_config_debug)
    debug = true
metaConfiguration.default.path.context += '/'
// Merges final default configuration object depending on given target
// environment.
const libraryConfiguration:PlainObject = metaConfiguration.library
let configuration:DefaultConfiguration
if (debug)
    configuration = Helper.extendObject(
        true, metaConfiguration.default, metaConfiguration.debug)
else
    configuration = metaConfiguration.default
if (typeof configuration.library === 'object')
    Helper.extendObject(true, libraryConfiguration, configuration.library)
if (
    specificConfiguration.library === true ||
    specificConfiguration.library === undefined && configuration.library
)
    configuration = Helper.extendObject(
        true, configuration, libraryConfiguration)
// endregion
// region merging and evaluating default, test, dynamic and specific settings
// Merges project specific configurations with default ones.
configuration = Helper.extendObject(true, configuration, specificConfiguration)
configuration.debug = debug
// / region load additional dynamically given configuration
let count:number = 0
let filePath:?string = null
while (true) {
    const newFilePath:string = configuration.path.context +
        `.dynamicConfiguration-${count}.json`
    try {
        fileSystem.accessSync(newFilePath, fileSystem.F_OK)
    } catch (error) {
        break
    }
    filePath = newFilePath
    count += 1
}
let runtimeInformation:PlainObject = {
    givenCommandLineArguments: process.argv
}
if (filePath) {
    runtimeInformation = JSON.parse(fileSystem.readFileSync(filePath, {
        encoding: 'utf-8'}))
    fileSystem.unlink(filePath, (error:?Error):void => {
        if (error)
            throw error
    })
}
if (runtimeInformation.givenCommandLineArguments.length > 2)
    // region apply documentation configuration
    if (runtimeInformation.givenCommandLineArguments[2] === 'document')
        Helper.extendObject(true, configuration, configuration.document)
    // endregion
    // region apply test configuration
    else if (
        runtimeInformation.givenCommandLineArguments[2] === 'testInBrowser'
    )
        Helper.extendObject(true, configuration, configuration.testInBrowser)
    else if (runtimeInformation.givenCommandLineArguments[2] === 'test')
        Helper.extendObject(true, configuration, configuration.test)
    // endregion
// / endregion
Helper.extendObject(true, configuration, runtimeInformation)
let result:?PlainObject = null
const evaluationFunction = (configuration:PlainObject):?PlainObject =>
    // IgnoreTypeCheck
    new Function('configuration', 'return ' +
        runtimeInformation.givenCommandLineArguments[runtimeInformation
            .givenCommandLineArguments.length - 1]
    )(configuration)
try {
    result = evaluationFunction(configuration)
} catch (error) {}
if (Helper.isPlainObject(result))
    Helper.extendObject(true, configuration, result)
// / region determine existing pre compiled dll manifests file paths
configuration.dllManifestFilePaths = []
let targetDirectory:?Object = null
try {
    targetDirectory = fileSystem.statSync(configuration.path.target)
} catch (error) {}
if (targetDirectory && targetDirectory.isDirectory())
    fileSystem.readdirSync(configuration.path.target).forEach((
        fileName:string
    ):void => {
        if (fileName.match(/^.*\.dll-manifest\.json$/))
            configuration.dllManifestFilePaths.push(path.resolve(
                configuration.path.target, fileName))
    })
// / endregion
// / region build absolute paths
for (const pathConfiguration:{[key:string]:{[key:string]:string}|string} of [
    configuration.path, configuration.path.asset
])
    for (const key:string of ['source', 'target'])
        if (pathConfiguration[key])
            pathConfiguration[key] = path.resolve(
                configuration.path.context, Helper.resolveDynamicDataStructure(
                    pathConfiguration[key], configuration)
            ) + '/'
// / endregion
const resolvedConfiguration:ResolvedConfiguration =
    Helper.resolveDynamicDataStructure(configuration)
// endregion
// region consolidate file specific build configuration
// Apply default file level build configurations to all file type specific
// ones.
const defaultConfiguration:PlainObject = resolvedConfiguration.build.default
delete resolvedConfiguration.build.default
for (const type:string in resolvedConfiguration.build)
    if (resolvedConfiguration.build.hasOwnProperty(type))
        resolvedConfiguration.build[type] = Helper.extendObject(true, {
        }, defaultConfiguration, Helper.extendObject(
            true, {extension: type}, resolvedConfiguration.build[type], {type})
        )
// endregion
// region apply webpack html plugin workaround
/*
    NOTE: Provides a workaround to handle a bug with changed loader
    configurations.
*/
for (
    const htmlConguration:HTMLConfiguration of resolvedConfiguration.files.html
)
    if (
        typeof htmlConguration.template === 'string' &&
        htmlConguration.template.includes('!')
    ) {
        const newTemplateString:Object = new String(htmlConguration.template)
        newTemplateString.replace = ((string:string):Function => (
            _search:RegExp|string, _replacement:string|(
                ...matches:Array<string>
            ) => string
        ):string => string)(htmlConguration.template)
        htmlConguration.template = newTemplateString
    }
// endregion
export default resolvedConfiguration
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
