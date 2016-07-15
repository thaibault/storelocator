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
import * as dom from 'jsdom'
import path from 'path'

import autoprefixer from 'autoprefixer'
import postcssImport from 'postcss-import'
import {sync as removeDirectoryRecursivelySync} from 'rimraf'
// NOTE: Only needed for debugging this file.
try {
    require('source-map-support/register')
} catch (error) {}
import webpack from 'webpack'
const plugins = require('webpack-load-plugins')()
import {RawSource as WebpackRawSource} from 'webpack-sources'

plugins.HTML = plugins.html
plugins.ExtractText = plugins.extractText
plugins.AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
plugins.OpenBrowser = plugins.openBrowser
plugins.Favicon = require('favicons-webpack-plugin')
plugins.Imagemin = require('imagemin-webpack-plugin').default
plugins.Offline = require('offline-plugin')

import type {
    DomNode, HTMLConfiguration, Injection, NormalizedInternalInjection,
    ProcedureFunction
} from './type'
import configuration from './configurator.compiled'
import Helper from './helper.compiled'

// / region monkey patches
// Monkey-Patch html loader to retrieve html loader options since the
// "webpack-html-plugin" doesn't preserve the original loader interface.
import htmlLoaderModuleBackup from 'html-loader'
require.cache[require.resolve('html-loader')].exports = function():any {
    Helper.extendObject(true, this.options, module, this.options)
    return htmlLoaderModuleBackup.apply(this, arguments)
}
// Monkey-Patch loader-utils to define which url is a local request.
import loaderUtilsModuleBackup from 'loader-utils'
const loaderUtilsIsUrlRequestBackup:(url:string) => boolean =
    loaderUtilsModuleBackup.isUrlRequest
require.cache[require.resolve('loader-utils')].exports.isUrlRequest = function(
    url:string
):boolean {
    if (url.match(/^[a-z]+:.+/))
        return false
    return loaderUtilsIsUrlRequestBackup.apply(
        loaderUtilsModuleBackup, arguments)
}
// / endregion
// endregion
// region initialisation
let libraryName:string = configuration.exportFormat === 'var' ?
    Helper.convertToValidVariableName(configuration.name) : configuration.name
// // region plugins
const pluginInstances:Array<Object> = [
    new webpack.optimize.OccurrenceOrderPlugin(true)]
// /// region generate html file
let htmlAvailable:boolean = false
if (configuration.givenCommandLineArguments[2] !== 'buildDLL')
    for (const htmlConfiguration:HTMLConfiguration of configuration.files.html)
        try {
            fileSystem.accessSync(htmlConfiguration.template.substring(
                htmlConfiguration.template.lastIndexOf('!') + 1
            ), fileSystem.F_OK)
            pluginInstances.push(new plugins.HTML(htmlConfiguration))
            htmlAvailable = true
        } catch (error) {}
// /// endregion
// /// region generate favicons
if (htmlAvailable && configuration.favicon) {
    let faviconAvailable:boolean = false
    try {
        fileSystem.accessSync(configuration.favicon.logo, fileSystem.F_OK)
        faviconAvailable = true
    } catch (error) {
    } finally {
        if (faviconAvailable)
            pluginInstances.push(new plugins.Favicon(configuration.favicon))
    }
}
// /// endregion
// /// region provide offline functionality
if (htmlAvailable && configuration.offline) {
    if (configuration.inPlace.cascadingStyleSheet)
        configuration.offline.excludes.push(
            `${configuration.path.asset.cascadingStyleSheet}*.css?` +
            `${configuration.hashAlgorithm}=*`)
    if (configuration.inPlace.javaScript)
        configuration.offline.excludes.push(
            `${configuration.path.asset.javaScript}*.js?` +
            `${configuration.hashAlgorithm}=*`)
    pluginInstances.push(new plugins.Offline(configuration.offline))
}
// /// endregion
// /// region opens browser automatically
if (configuration.development.openBrowser && (htmlAvailable && [
    'serve', 'testInBrowser'
].includes(configuration.givenCommandLineArguments[2])))
    pluginInstances.push(new plugins.OpenBrowser(
        configuration.development.openBrowser))
// /// endregion
// /// region provide build environment
pluginInstances.push(new webpack.DefinePlugin(configuration.buildDefinition))
// /// endregion
// /// region modules/assets
const moduleLocations:{[key:string]:Array<string>} =
    Helper.determineModuleLocations(
        configuration.injection.internal, configuration.module.aliases,
        configuration.knownExtensions, configuration.path.context,
        configuration.path.ignore)
// //// region extract cascading style sheets
pluginInstances.push(new plugins.ExtractText(
    configuration.files.cascadingStyleSheet, {
        allChunks: true, disable: !configuration.files.cascadingStyleSheet}))
// //// endregion
// //// region perform javaScript minification/optimisation
if (configuration.module.optimizer.uglifyJS)
    pluginInstances.push(new webpack.optimize.UglifyJsPlugin(
        configuration.module.optimizer.uglifyJS))
// //// endregion
// //// region apply module pattern
pluginInstances.push({apply: (compiler:Object):void => {
    compiler.plugin('emit', (
        compilation:Object, callback:ProcedureFunction
    ):void => {
        for (const request:string in compilation.assets)
            if (compilation.assets.hasOwnProperty(request)) {
                const filePath:string = request.replace(/\?[^?]+$/, '')
                const type:?string = Helper.determineAssetType(
                    filePath, configuration.build, configuration.path)
                if (type && configuration.assetPattern[type] && !(new RegExp(
                    configuration.assetPattern[type]
                        .excludeFilePathRegularExpression
                )).test(filePath)) {
                    const source:?string = compilation.assets[request].source()
                    if (typeof source === 'string')
                        compilation.assets[request] = new WebpackRawSource(
                            configuration.assetPattern[type].pattern.replace(
                                /\{1\}/g, source.replace(/\$/g, '$$$')))
                }
            }
        callback()
    })
}})
// //// endregion
// //// region in-place configured assets in the main html file
if (htmlAvailable && !['serve', 'testInBrowser'].includes(
    configuration.givenCommandLineArguments[2]
))
    pluginInstances.push({apply: (compiler:Object):void => {
        compiler.plugin('emit', (
            compilation:Object, callback:ProcedureFunction
        ):void => {
            if (configuration.files.html[0].filename in compilation.assets && (
                configuration.inPlace.cascadingStyleSheet ||
                configuration.inPlace.javaScript
            ))
                dom.env(compilation.assets[configuration.files.html[
                    0
                ].filename].source(), (error:?Error, window:Object):void => {
                    if (configuration.inPlace.cascadingStyleSheet) {
                        const urlPrefix:string = configuration.files
                            .cascadingStyleSheet.replace(
                                '[contenthash]', '')
                        const domNode:DomNode = window.document.querySelector(
                            `link[href^="${urlPrefix}"]`)
                        if (domNode) {
                            let asset:string
                            for (asset in compilation.assets)
                                if (asset.startsWith(urlPrefix))
                                    break
                            const inPlaceDomNode:DomNode =
                                window.document.createElement('style')
                            inPlaceDomNode.textContent =
                                compilation.assets[asset].source()
                            domNode.parentNode.insertBefore(
                                inPlaceDomNode, domNode)
                            domNode.parentNode.removeChild(domNode)
                            /*
                                NOTE: This doesn't prevent webpack from
                                creating this file if present in another chunk
                                so removing it (and a potential source map
                                file) later in the "done" hook.
                            */
                            delete compilation.assets[asset]
                        } else
                            console.warn(
                                'No referenced cascading style sheet file in' +
                                ' resulting markup found with ' +
                                `selector: link[href^="${urlPrefix}"]`)
                    }
                    if (configuration.inPlace.javaScript) {
                        const urlPrefix:string =
                            configuration.files.javaScript.replace(
                                '[hash]', '')
                        const domNode:DomNode = window.document.querySelector(
                            `script[src^="${urlPrefix}"]`)
                        if (domNode) {
                            let asset:string
                            for (asset in compilation.assets)
                                if (asset.startsWith(urlPrefix))
                                    break
                            domNode.textContent = compilation.assets[
                                asset
                            ].source()
                            domNode.removeAttribute('src')
                            /*
                                NOTE: This doesn't prevent webpack from
                                creating this file if present in another chunk
                                so removing it (and a potential source map
                                file) later in the "done" hook.
                            */
                            delete compilation.assets[asset]
                        } else
                            console.warn(
                                'No referenced javaScript file in resulting ' +
                                'markup found with selector: ' +
                                `script[src^="${urlPrefix}"]`)
                    }
                    compilation.assets[configuration.files.html[
                        0
                    ].filename] = new WebpackRawSource(
                        compilation.assets[configuration.files.html[
                            0
                        ].filename].source().replace(
                            /^(\s*<!doctype[^>]+?>\s*)[\s\S]*$/i, '$1'
                        ) + window.document.documentElement.outerHTML)
                    callback()
                })
            else
                callback()
        })
        compiler.plugin('after-emit', (
            compilation:Object, callback:ProcedureFunction
        ):void => {
            if (configuration.files.html[0].filename in compilation.assets) {
                if (configuration.inPlace.cascadingStyleSheet)
                    removeDirectoryRecursivelySync(path.join(
                        configuration.path.asset.target,
                        configuration.path.asset.cascadingStyleSheet
                    ), {glob: false})
                if (configuration.inPlace.javaScript) {
                    const assetFilePath = path.join(
                        configuration.path.asset.target,
                        configuration.files.javaScript.replace(
                            `?${configuration.hashAlgorithm}=[hash]`, ''))
                    for (const filePath:string of [
                        assetFilePath, `${assetFilePath}.map`
                    ])
                        try {
                            fileSystem.unlinkSync(filePath)
                        } catch (error) {}
                    const javaScriptPath:string = path.join(
                        configuration.path.asset.target,
                        configuration.path.asset.javaScript)
                    if (fileSystem.readdirSync(javaScriptPath).length === 0)
                        fileSystem.rmdirSync(javaScriptPath)
                }
            }
            callback()
        })
    }})
// //// endregion
const injection:Injection = Helper.resolveInjection(
    configuration.injection, Helper.resolveBuildConfigurationFilePaths(
        configuration.build, configuration.path.asset.source,
        configuration.path.context, configuration.path.ignore
    ), configuration.testInBrowser.injection.internal,
    configuration.module.aliases, configuration.knownExtensions,
    configuration.path.context, configuration.path.ignore)
let javaScriptNeeded:boolean = false
const normalizedInternalInjection:NormalizedInternalInjection =
    Helper.normalizeInternalInjection(injection.internal)
// //// region remove chunks if a corresponding dll package exists
if (configuration.givenCommandLineArguments[2] !== 'buildDLL')
    for (const chunkID:string in normalizedInternalInjection)
        if (
            normalizedInternalInjection.hasOwnProperty(chunkID) &&
            configuration.dllManifestFilePaths.includes(
                `${configuration.path.target}${chunkID}.dll-manifest.json`)
        ) {
            delete normalizedInternalInjection[chunkID]
            let sourceMapExists:boolean = false
            // TODO replace all placeholder like "[id]", "[ext]", "[hash]" and
            // everywhere else
            const fileName:string = configuration.files.javaScript.replace(
                /^(.+)(?:\?[^?]*)$/, '$1'
            ).replace(/\[name\]/g, chunkID)
            try {
                fileSystem.accessSync(
                    `${configuration.path.target}${fileName}.map`,
                    fileSystem.F_OK)
                sourceMapExists = true
            } catch (error) {}
            pluginInstances.push(new plugins.AddAssetHtmlPlugin({
                filename: `${configuration.path.target}${fileName}`,
                includeSourcemap: sourceMapExists
            }))
            pluginInstances.push(new webpack.DllReferencePlugin({
                context: configuration.path.context, manifest: require(
                    `${configuration.path.target}${chunkID}.dll-manifest.json`)
            }))
        }
// //// endregion
// //// region generate common chunks
if (configuration.givenCommandLineArguments[2] !== 'buildDLL')
    for (const chunkID:string of configuration.injection.commonChunkIDs)
        if (normalizedInternalInjection.hasOwnProperty(chunkID))
            pluginInstances.push(new webpack.optimize.CommonsChunkPlugin({
                async: false,
                children: false,
                filename: configuration.files.javaScript,
                minChunks: Infinity,
                name: chunkID,
                minSize: 0
            }))
// //// endregion
// //// region mark empty javaScript modules as dummy
for (const chunkName:string in normalizedInternalInjection)
    if (normalizedInternalInjection.hasOwnProperty(chunkName))
        for (const moduleID:string of normalizedInternalInjection[
            chunkName
        ]) {
            const type:?string = Helper.determineAssetType(
                Helper.determineModuleFilePath(
                    moduleID, configuration.module.aliases,
                    configuration.knownExtensions, configuration.path.context
                ),
                configuration.build, configuration.path)
            if (type && configuration.build[type] && configuration.build[
                type
            ].outputExtension === 'js') {
                javaScriptNeeded = true
                break
            }
        }
if (!javaScriptNeeded)
    configuration.files.javaScript = path.join(
        configuration.path.asset.javaScript, '.__dummy__.compiled.js')
// //// endregion
// //// region performs implicit external logic
if (injection.external === '__implicit__')
    /*
        We only want to process modules from local context in library mode,
        since a concrete project using this library should combine all assets
        (and deduplicate them) for optimal bundling results. NOTE: Only native
        javaScript and json modules will be marked as external dependency.
    */
    injection.external = (
        context:string, request:string, callback:ProcedureFunction
    ):void => {
        const filePath:string = Helper.determineModuleFilePath(
            request.substring(request.lastIndexOf('!') + 1),
            configuration.module.aliases, configuration.knownExtensions,
            context)
        if (filePath.endsWith('.js') || filePath.endsWith('.json')) {
            // NOTE: We apply alias on externals additionally.
            Helper.applyAliases(
                request.substring(request.lastIndexOf('!') + 1),
                configuration.module.aliases)
            if (request.match(
                /^webOptimizer\/browserAPI(?:\.compiled)?(?:\.js)?/
            ))
                /*
                    NOTE: The browser api needs processing since there exists
                    needed compile flags to avoid loading a complete node
                    browser api into a real browser.
                */
                return callback()
            for (const chunkName:string in normalizedInternalInjection)
                if (normalizedInternalInjection.hasOwnProperty(chunkName))
                    for (
                        const moduleID:string of
                        normalizedInternalInjection[chunkName]
                    )
                        if (Helper.determineModuleFilePath(
                            moduleID, configuration.module.aliases,
                            configuration.knownExtensions, context
                        ) === filePath)
                            return callback()
            if (!path.resolve(filePath).startsWith(
                configuration.path.context
            ) || Helper.isFilePathInLocation(
                filePath, configuration.path.ignore
            ) && !configuration.inPlace.externalLibrary) {
                if (configuration.exportFormat === 'var')
                    request = Helper.convertToValidVariableName(request)
                return callback(
                    null, `${configuration.exportFormat} ${request}`)
            }
        }
        return callback()
    }
// //// endregion
// //// region build dll packages
if (configuration.givenCommandLineArguments[2] === 'buildDLL') {
    let dllChunkIDExists:boolean = false
    for (const chunkID:string in normalizedInternalInjection)
        if (normalizedInternalInjection.hasOwnProperty(chunkID))
            if (configuration.injection.dllChunkIDs.includes(chunkID))
                dllChunkIDExists = true
            else
                delete normalizedInternalInjection[chunkID]
    if (dllChunkIDExists) {
        libraryName = '[name]DLLPackage'
        pluginInstances.push(new webpack.DllPlugin({
            path: `${configuration.path.target}[name].dll-manifest.json`,
            name: libraryName
        }))
    } else
        throw Error('No dll chunk id found.')
}
// //// endregion
// /// endregion
// /// region apply final dom modifications/fixes
if (htmlAvailable)
    pluginInstances.push({apply: (compiler:Object):void => {
        compiler.plugin('emit', (
            compilation:Object, callback:ProcedureFunction
        ):void => {
            if (configuration.files.html[0].filename in compilation.assets)
                dom.env(compilation.assets[configuration.files.html[
                    0
                ].filename].source(), (error:?Error, window:Object):void => {
                    const linkables:{[key:string]:string} = {
                        script: 'src', link: 'href'}
                    for (const tagName:string in linkables)
                        if (linkables.hasOwnProperty(tagName))
                            for (
                                const domNode:DomNode of
                                window.document.querySelectorAll(
                                    `${tagName}[${linkables[tagName]}*="?` +
                                    `${configuration.hashAlgorithm}="]`)
                            )
                                domNode.setAttribute(
                                    linkables[tagName], domNode.getAttribute(
                                        linkables[tagName]
                                    ).replace(new RegExp(
                                        `(\\?${configuration.hashAlgorithm}=` +
                                        '[^&]+).*$'
                                    ), '$1'))
                    compilation.assets[configuration.files.html[
                        0
                    ].filename] = new WebpackRawSource(
                        compilation.assets[configuration.files.html[
                            0
                        ].filename].source().replace(
                            /^(\s*<!doctype[^>]+?>\s*)[\s\S]*$/i, '$1'
                        ) + window.document.documentElement.outerHTML)
                    callback()
                })
            else
                callback()
        })
    }})
// /// endregion
// /// region add automatic image compression
// NOTE: This plugin should be loaded at last to ensure that all emitted images
// ran through.
pluginInstances.push(new plugins.Imagemin(
    configuration.module.optimizer.image.content))
// /// endregion
// // endregion
// / region loader
let imageLoader:string = 'url?' + JSON.stringify(
    configuration.module.optimizer.image.file)
const loader:{
    preprocessor:{
        cascadingStyleSheet:string;
        less:string;
        sass:string;
        scss:string;
        javaScript:string;
        coffee:string;
        pug:string;
        literateCoffee:string
    };
    html:string;
    cascadingStyleSheet:string;
    style:string;
    postprocessor:{
        image:string;
        font:{
            eot:string;
            woff:string;
            ttf:string;
            svg:string
        };
        data:string
    }
} = {
    preprocessor: {
        cascadingStyleSheet: 'postcss',
        javaScript: 'babel?' + JSON.stringify(
            configuration.module.preprocessor.modernJavaScript),
        pug: `pug?${JSON.stringify(configuration.module.preprocessor.pug)}`,
        // TODO deprecated
        coffee: 'coffee',
        literateCoffee: 'coffee?literate',
        less: `less?${JSON.stringify(configuration.module.preprocessor.less)}`,
        sass: `sass?${JSON.stringify(configuration.module.preprocessor.sass)}`,
        scss: `sass?${JSON.stringify(configuration.module.preprocessor.scss)}`
        //
    },
    html: `html?${JSON.stringify(configuration.module.html)}`,
    cascadingStyleSheet: 'css?' + JSON.stringify(
        configuration.module.cascadingStyleSheet),
    style: `style?${JSON.stringify(configuration.module.style)}`,
    postprocessor: {
        image: imageLoader,
        font: {
            eot: 'url?' + JSON.stringify(
                configuration.module.optimizer.font.eot),
            woff: 'url?' + JSON.stringify(
                configuration.module.optimizer.font.woff),
            ttf: 'url?' + JSON.stringify(
                configuration.module.optimizer.font.ttf),
            svg: 'url?' + JSON.stringify(
                configuration.module.optimizer.font.svg)
        },
        data: `url?${JSON.stringify(configuration.module.optimizer.data)}`
    }
}
// / endregion
// endregion
// region configuration
export default {
    context: configuration.path.context,
    debug: configuration.debug,
    devtool: configuration.development.tool,
    devserver: configuration.development.server,
    // region input
    entry: normalizedInternalInjection, externals: injection.external,
    resolveLoader: configuration.loader,
    resolve: {
        alias: configuration.module.aliases,
        extensions: configuration.knownExtensions,
        root: [(configuration.path.asset.source: string)]
    },
    // endregion
    // region output
    output: {
        filename: configuration.files.javaScript,
        hashFunction: configuration.hashAlgorithm,
        library: libraryName,
        libraryTarget: (
            configuration.givenCommandLineArguments[2] === 'buildDLL'
        ) ? 'var' : configuration.exportFormat,
        path: configuration.path.asset.target,
        // publicPath: configuration.path.asset.publicTarget,
        pathinfo: configuration.debug,
        umdNamedDefine: true
    },
    target: configuration.target,
    // endregion
    module: {
        noParse: configuration.module.skipParseRegularExpression,
        preLoaders: [
            // Convert to native web types.
            // region script
            {
                test: /\.js$/,
                loader: loader.preprocessor.javaScript,
                include: [path.join(
                    configuration.path.asset.source,
                    configuration.path.asset.javaScript
                )].concat(moduleLocations.directoryPaths),
                exclude: (filePath:string):boolean =>
                    Helper.isFilePathInLocation(filePath.replace(
                        /^(.+)(?:\?[^?]*)$/, '$1'
                    ), configuration.path.ignore)
            }, {
                test: /\.coffee$/,
                loader: loader.preprocessor.coffee,
                include: [path.join(
                    configuration.path.asset.source,
                    configuration.path.asset.coffeeScript
                )].concat(moduleLocations.directoryPaths)
            }, {
                test: /\.(?:coffee\.md|litcoffee)$/,
                loader: loader.preprocessor.literateCoffee,
                include: [path.join(
                    configuration.path.asset.source,
                    configuration.path.asset.coffeeScript
                )].concat(moduleLocations.directoryPaths)
            },
            // endregion
            // region html (templates)
            {
                test: /\.pug$/,
                loader:
                    `file?name=${configuration.path.asset.template}` +
                    `[name].html?${configuration.hashAlgorithm}=[hash]!` +
                    `extract!${loader.html}!${loader.preprocessor.pug}`,
                include: path.join(
                    configuration.path.asset.source,
                    configuration.path.asset.template),
                exclude: configuration.files.html.map((
                    htmlConfiguration:HTMLConfiguration
                ):string => htmlConfiguration.template.substring(
                    htmlConfiguration.template.lastIndexOf('!') + 1))
            }
            // endregion
        ],
        loaders: [
            // Loads dependencies.
            // region style
            // TODO deprecated
            {
                test: /\.less$/,
                loader: plugins.ExtractText.extract(
                    loader.style,
                    `${loader.cascadingStyleSheet}!${loader.preprocessor.less}`
                )
            }, {
                test: /\.sass$/,
                loader: plugins.ExtractText.extract(
                    loader.style,
                    `${loader.cascadingStyleSheet}!${loader.preprocessor.sass}`
                )
            }, {
                test: /\.scss$/,
                loader: plugins.ExtractText.extract(
                    loader.style,
                    `${loader.cascadingStyleSheet}!${loader.preprocessor.scss}`
                )
            },
            //
            {
                test: /\.css$/,
                loader: plugins.ExtractText.extract(
                    loader.style,
                    `${loader.preprocessor.cascadingStyleSheet}!` +
                    loader.cascadingStyleSheet),
                include: [path.join(
                    configuration.path.asset.source,
                    configuration.path.asset.cascadingStyleSheet
                )].concat(moduleLocations.directoryPaths),
                exclude: (filePath:string):boolean =>
                    Helper.isFilePathInLocation(filePath.replace(
                        /^(.+)(?:\?[^?]*)$/, '$1'
                    ), configuration.path.ignore)
            },
            // endregion
            // region html (templates)
            {
                test: /\.html$/,
                loader:
                    `file?name=${configuration.path.asset.template}` +
                    `[name].[ext]?${configuration.hashAlgorithm}=[hash]!` +
                    `extract!${loader.html}`,
                include: path.join(
                    configuration.path.asset.source,
                    configuration.path.asset.template),
                exclude: configuration.files.html.map((
                    htmlConfiguration:HTMLConfiguration
                ):string => htmlConfiguration.template.substring(
                    htmlConfiguration.template.lastIndexOf('!') + 1))
            }
            // endregion
        ],
        postLoaders: [
            // Optimize loaded assets.
            // region font
            {
                test: /\.eot(?:\?v=\d+\.\d+\.\d+)?$/,
                loader: loader.postprocessor.font.eot
            }, {test: /\.woff2?$/, loader: loader.postprocessor.font.woff}, {
                test: /\.ttf(?:\?v=\d+\.\d+\.\d+)?$/,
                loader: loader.postprocessor.font.ttf
            }, {
                test: /\.svg(?:\?v=\d+\.\d+\.\d+)?$/,
                loader: loader.postprocessor.font.svg
            },
            // endregion
            // region image
            {
                test: /\.(?:png|jpg|ico|gif)$/,
                loader: loader.postprocessor.image
            },
            // endregion
            // region data
            {
                test: /.+/,
                loader: loader.postprocessor.data,
                include: path.join(
                    configuration.path.asset.source,
                    configuration.path.asset.data),
                exclude: (filePath:string):boolean =>
                    configuration.knownExtensions.includes(
                        path.extname(filePath.replace(
                            /^(.+)(?:\?[^?]*)$/, '$1')))
            }
            // endregion
        ]
    },
    postcss: ():Array<Object> => [
        autoprefixer, postcssImport({addDependencyTo: webpack})
    ],
    html: configuration.module.optimizer.htmlMinifier,
    // Let the "html-loader" access full html minifier processing
    // configuration.
    pug: configuration.module.preprocessor.pug,
    plugins: pluginInstances
}
// endregion
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
