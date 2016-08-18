// @flow
// #!/usr/bin/env node
// -*- coding: utf-8 -*-
/** @module jQuery-homePage */
'use strict'
/* !
    region header
    [Project page](http://torben.website)

    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    See http://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import $ from 'jquery'
import Lang from 'jQuery-lang'
import 'jQuery-website'
import type {DomNode} from 'webOptimizer/type'
import type {$DomNode} from 'jQuery-tools'
// endregion
// region declaration
declare var GOOGLE_TRACKING_CODE:string
declare var LANGUAGES:Array<string>
declare var OFFLINE:boolean
// endregion
const context:Object = (():Object => {
    if ($.type(window) === 'undefined') {
        if ($.type(global) === 'undefined')
            return ($.type(module) === 'undefined') ? {} : module
        return global
    }
    return window
})()
if (!('document' in context) && 'context' in $)
    context.document = $.context
// region plugins/classes
/**
 * This plugin holds all needed methods to extend a whole documentation site.
 * @extends jQuery-website:Website
 * @property static:_name - Defines this class name to allow retrieving them
 * after name mangling.
 * @property _options - Options extended by the options given to the
 * initializer method.
 * @property _options.onExamplesLoaded {Function} - Callback to trigger when
 * all example loaded.
 * @property _options.domNodeSelectorPrefix {string} - 'body.{1}'
 * @property _options.codeTableWrapper {string} - Markup to use as wrapper for
 * all code highlighted examples.
 * @property _options.showExample {Object} - Options object to configure code
 * example representation.
 * @property _options.showExample.pattern {string} - Regular expression to
 * introduce a code example section.
 * @property _options.showExample.domNodeName {string} - Dom node name to
 * indicate a declarative example section.
 * @property _options.showExample.htmlWrapper {string} - HTML example wrapper.
 * @property _options.domNode {Object} - Object with a mapping of needed dom
 * node descriptions to their corresponding selectors.
 * @property _options.section {Object} - Configuration object for section
 * switches between the main page and legal notes descriptions.
 * @property _options.section.aboutThisWebsite {Object} - Configuration object
 * for transitions concerning the legal notes section.
 * @property _options.section.aboutThisWebsite.fadeOut {Object} - Fade out
 * configurations.
 * @property _options.section.aboutThisWebsite.fadeIn {Object} - Fade in
 * configurations.
 * @property _options.section.main {Object} - Configuration object for
 * transitions concerning the main section.
 * @property _options.section.main.fadeOut {Object} - Fade out configurations.
 * @property _options.section.main.fadeIn {Object} - Fade in configurations.
 */
class Documentation extends $.Website.class {
    // region static properties
    static _name:string = 'Documentation'
    // endregion
    // region dynamic properties
    $domNodes:{[key:string]:$DomNode}
    startUpAnimationIsComplete:boolean
    _activateLanguageSupport:boolean
    languageHandler:Object;
    // endregion
    // region public methods
    // / region special
    /**
     * Initializes the interactive web application.
     * @param options - An options object.
     * @param startUpAnimationIsComplete - Indicates weather start up
     * animations has been completed.
     * @param activateLanguageSupport - Indicates weather a language handler
     * should be used or not.
     * @param languageHandler - A language handler to use. If "null" is given
     * a new handler will be created.
     * @returns Returns the current instance.
     */
    initialize(
        options:Object = {}, startUpAnimationIsComplete:boolean = false,
        activateLanguageSupport:boolean = false, languageHandler:?Lang = null
    ):Documentation {
        this.startUpAnimationIsComplete = startUpAnimationIsComplete
        this._activateLanguageSupport = activateLanguageSupport
        if (languageHandler)
            this.languageHandler = languageHandler
        this._options = {
            onExamplesLoaded: $.noop(),
            domNodeSelectorPrefix: 'body.{1}',
            codeTableWrapper: '<div class="table-responsive">',
            showExample: {
                pattern: '^ *showExample(: *([^ ]+))? *$',
                domNodeName: '#comment',
                htmlWrapper: `
                    <div class="show-example-wrapper">
                        <h3>
                            Example:
                            <!--deDE:Beispiel:-->
                            <!--frFR:Exemple:-->
                        </h3>
                    </div>
                `
            },
            domNode: {
                tableOfContentLinks: 'div.toc > ul > li a[href^="#"]',
                aboutThisWebsiteLink: 'a[href="#about-this-website"]',
                homeLink: 'a[href="#home"]',
                aboutThisWebsiteSection: 'section.about-this-website',
                mainSection: 'section.main-content',
                codeWrapper: 'div.codehilite',
                code: 'div.codehilite > pre, code'
            },
            section: {
                aboutThisWebsite: {
                    fadeOut: {duration: 'fast'},
                    fadeIn: {duration: 'fast'}
                },
                main: {
                    fadeOut: {duration: 'fast'},
                    fadeIn: {duration: 'fast'}
                }
            }
        }
        /*
            NOTE: We will initialize language support after examples are
            injected if activated via options.
        */
        this._activateLanguageSupport = options.activateLanguageSupport
        options.activateLanguageSupport = false
        super.initialize(options)
        if (!this._activateLanguageSupport)
            this._activateLanguageSupport =
                this._parentOptions.activateLanguageSupport
        if (!('location' in context && context.location.hash))
            context.location.hash = this.$domNodes.homeLink.attr('href')
        this.$domNodes.aboutThisWebsiteSection.hide()
        /*
            NOTE: We have to render examples first to avoid having dots in
            example code.
        */
        this._showExamples()._makeCodeEllipsis()
        this.on(this.$domNodes.tableOfContentLinks, 'click', function(
        ):void {
            $.scrollTo($(this).attr('href'), 'slow')
        })
        // Handle section switch between documentation and legal notes section.
        this._options.section.aboutThisWebsite.fadeOut.always = ():$DomNode =>
            this.$domNodes.mainSection.fadeIn(
                this._options.section.main.fadeIn)
        this._options.section.main.fadeOut.always = ():$DomNode =>
            this.$domNodes.aboutThisWebsiteSection.fadeIn(
                this._options.section.aboutThisWebsite.fadeIn)
        this.on(this.$domNodes.aboutThisWebsiteLink, 'click', ():$DomNode =>
            this._scrollToTop().$domNodes.mainSection.fadeOut(
                this._options.section.main.fadeOut))
        this.on(this.$domNodes.homeLink, 'click', ():$DomNode =>
            this._scrollToTop().$domNodes.aboutThisWebsiteSection.fadeOut(
                this._options.section.aboutThisWebsite.fadeOut))
        return this
    }
    // / endregion
    // endregion
    // region protected methods
    // / region event handler
    /**
     * This method triggers if all examples loaded.
     * @returns Returns the current instance.
     */
    _onExamplesLoaded():Documentation {
        /*
            NOTE: After injecting new dom nodes we have to grab them for
            further controller logic.
        */
        this.$domNodes = this.grabDomNode(this._options.domNode)
        // New injected dom nodes may take affect on language handler.
        if (
            this.startUpAnimationIsComplete &&
            this._activateLanguageSupport && !this._languageHandler
        )
            this._languageHandler = $.Lang(this._options.language)
        return this
    }
    /**
     * This method triggers if we change the current section.
     * @param sectionName - New section which should be switched to.
     * @returns Returns the current instance.
     */
    _onSwitchSection(sectionName:string):Documentation {
        this.$domNodes.tableOfContentLinks.add(
            this.$domNodes.aboutThisWebsiteLink
        ).add(this.$domNodes.homeLink).filter(
            `a[href="#${sectionName}"]`
        ).trigger('click')
        return super._onSwitchSection.apply(this, arguments)
    }
    /**
     * This method triggers if all startup animations are ready.
     * @returns Returns the current instance.
     */
    _onStartUpAnimationComplete():Documentation {
        if (this._activateLanguageSupport && !this._languageHandler)
            this._languageHandler = $.Lang(this._options.language)
        // All start up effects are ready. Handle direct section links.
        this.startUpAnimationIsComplete = true
        if ('location' in context)
            this.$domNodes.tableOfContentLinks.add(
                this.$domNodes.aboutThisWebsiteLink
            ).filter('a[href="' + context.location.href.substr(
                context.location.href.indexOf('#')
            ) + '"]').trigger('click')
        return super._onStartUpAnimationComplete.apply(this, arguments)
    }
    // / endregion
    /**
     * This method makes dotes after code lines which are too long. This
     * prevents line wrapping.
     * @returns Returns the current instance.
     */
    _makeCodeEllipsis():Documentation {
        this.$domNodes.code.each((index:number, domNode:DomNode):void => {
            const $domNode:$DomNode = $(domNode)
            const tableParent:$DomNode = $domNode.closest('table')
            if (tableParent.length)
                tableParent.wrap(this._options.codeTableWrapper)
            let newContent:string = ''
            const codeLines:Array<string> = $domNode.html().split('\n')
            $.each(codeLines, (index:number, value:string):void => {
                /*
                    NOTE: Wrap a div object to grantee that $ will accept the
                    input.
                */
                const excess:number = $(`<div>${value}</div>`).text(
                ).length - 79
                if (excess > 0)
                    newContent += this._replaceExcessWithDots(value, excess)
                else
                    newContent += value
                if (index + 1 !== codeLines.length)
                    newContent += "\n"
            })
            $domNode.html(newContent)
        })
        return this
    }
    /**
     * Replaces given html content with a shorter version trimmed by given
     * amount of excess.
     * @param content - String to trim.
     * @param excess - Amount of excess.
     * @returns Returns the trimmed content.
     */
    _replaceExcessWithDots(content:string, excess:number):string {
        // Add space for ending dots.
        excess += 3
        let newContent:string = ''
        let $content:$DomNode
        let wrapped:boolean = false
        try {
            $content = $(content)
            if (!$content.length)
                throw Error('error')
        } catch (error) {
            /*
                NOTE: Wrap an element around to grantee that $ will accept the
                input. We don't wrap an element in general to iterate through
                separate dom nodes in next step if possible.
            */
            $content = $(`<wrapper>${content}</wrapper>`)
            wrapped = true
        }
        $($content.get().reverse()).each(function():void {
            /*
                Wrap element to get not only the inner html. Wrap only if not
                wrapped already.
            */
            let $wrapper:$DomNode
            if (wrapped)
                $wrapper = $(this)
            else
                $wrapper = $(this).wrap('<wrapper>').parent()
            let contentSnippet:string = $wrapper.html()
            if (!contentSnippet)
                contentSnippet = this.textContent
            if (excess)
                if (this.textContent.length < excess) {
                    excess -= this.textContent.length
                    contentSnippet = ''
                } else if (this.textContent.length >= excess) {
                    this.textContent = this.textContent.substr(
                        0, this.textContent.length - excess - 1
                    ) + '...'
                    excess = 0
                    contentSnippet = $wrapper.html()
                    if (!contentSnippet)
                        contentSnippet = this.textContent
                }
            newContent = contentSnippet + newContent
        })
        return newContent
    }
    /**
     * Shows marked example codes directly in browser.
     * @returns Returns the current instance.
     */
    _showExamples():Documentation {
        this.$domNodes.parent.find(':not(iframe)').contents().each((
            index:number, domNode:DomNode
        ):void => {
            if (domNode.nodeName === this._options.showExample.domNodeName) {
                const match:Array<string> = domNode.textContent.match(
                    new RegExp(this._options.showExample.pattern))
                if (match) {
                    const $codeDomNode:$DomNode = $(domNode).next()
                    let code:string = $codeDomNode.find(
                        this.$domNodes.codeWrapper
                    ).text()
                    if (!code)
                        code = $codeDomNode.text()
                    try {
                        if (match.length > 2 && match[2])
                            if (['javascript', 'javascripts', 'js'].includes(
                                match[2].toLowerCase()
                            ))
                                $codeDomNode.after($('<script>').attr(
                                    'type', 'text/javascript'
                                ).text(code))
                            else if ([
                                'css', 'cascadingstylesheet',
                                'cascadingstylesheets', 'stylesheet',
                                'stylesheets', 'sheet', 'sheets', 'style',
                                'styles'
                            ].includes(match[2].toLowerCase()))
                                $codeDomNode.after($('<style>').attr(
                                    'type', 'text/css'
                                ).text(code))
                            else if (match[2].toLowerCase() === 'hidden')
                                $codeDomNode.after(code)
                            else
                                $codeDomNode.after($(
                                    this._options.showExample.htmlWrapper
                                ).append(code))
                        else
                            $codeDomNode.after($(
                                this._options.showExample.htmlWrapper
                            ).append(code))
                    } catch (error) {
                        this.critical(
                            `Error while integrating code "${code}": ${error}`)
                    }
                }
            }
        })
        this.fireEvent('examplesLoaded')
        return this
    }
    // endregion
}
// endregion
$.Documentation = function():any {
    return $.Tools().controller(Documentation, arguments)
}
$.Documentation.class = Documentation
/** jQuery extended with jQuery-documentation plugin. */
export default $
if (typeof OFFLINE !== 'undefined' && OFFLINE) {
    const offlineHandler:Object = require('offline-plugin/runtime')
    offlineHandler.install({
        // NOTE: Tell to new SW to take control immediately.
        onUpdateReady: ():void => offlineHandler.applyUpdate()
    })
}
// NOTE: We make jQuery available to make bootstrapping examples with deferred
// script loading simpler.
context.documentationWebsiteJQuery = $.noConflict(true)
$.noConflict()(($:Object):Documentation => $.Documentation({
    trackingCode: GOOGLE_TRACKING_CODE, language: {
        allowedLanguages: LANGUAGES || [],
        sessionDescription: 'documentationWebsite{1}'
    }
}))
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
