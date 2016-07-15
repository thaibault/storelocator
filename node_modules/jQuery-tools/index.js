// @flow
// #!/usr/bin/env node
// -*- coding: utf-8 -*-
/** @module jQuery-tools */
'use strict'
/* !
    region header
    [Project page](http://torben.website/jQuery-tools)

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
import type {DomNode, PlainObject} from 'webOptimizer/type'
// endregion
// region types
export type Position = {
    top?:number;
    left?:number;
    right?:number;
    bottom?:number;
}
export type RelativePosition = 'in'|'above'|'left'|'below'|'right'
export type Options = {
    domNodeSelectorPrefix:string;
    [key:string]:any;
}
export type LockCallbackFunction = (description:string) => void
export type $DomNode = {
    [key:number|string]:DomNode;
    addClass(className:string):$DomNode;
    addBack():$DomNode;
    after(domNode:any):$DomNode;
    append(domNode:any):$DomNode;
    attr(attributeName:string|{[key:string]:string}, value:any):any;
    data(key:string, value:any):any;
    each():$DomNode;
    find(filter:any):$DomNode;
    height():number;
    is(selector:string):boolean;
    remove():$DomNode;
    removeAttr(attributeName:string):$DomNode;
    removeClass(className:string|Array<string>):$DomNode;
    submit():$DomNode;
    width():number;
    Tools(functionName:string, ...additionalArguments:Array<any>):any;
}
export type $Deferred<Type> = {
    always:() => $Deferred<Type>;
    resolve:() => $Deferred<Type>;
    done:() => $Deferred<Type>;
    fail:() => $Deferred<Type>;
    isRejected:() => $Deferred<Type>;
    isResolved:() => $Deferred<Type>;
    notify:() => $Deferred<Type>;
    notifyWith:() => $Deferred<Type>;
    progress:() => $Deferred<Type>;
    promise:() => $Deferred<Type>;
    reject:() => $Deferred<Type>;
    rejectWith:() => $Deferred<Type>;
    resolveWith:() => $Deferred<Type>;
    state:() => $Deferred<Type>;
    then:() => $Deferred<Type>;
}
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
 * This plugin provides such interface logic like generic controller logic for
 * integrating plugins into $, mutual exclusion for depending gui elements,
 * logging additional string, array or function handling. A set of helper
 * functions to parse option objects dom trees or handle events is also
 * provided.
 * @property static:abbreviations - Lists all known abbreviation for proper
 * camel case to delimited and back conversion.
 * @property static:animationEndEventNames - Saves a string with all css3
 * browser specific animation end event names.
 * @property static:keyCode - Saves a mapping from key codes to their
 * corresponding name.
 * @property static:maximalSupportedInternetExplorerVersion - Saves currently
 * minimal supported internet explorer version. Saves zero if no internet
 * explorer present.
 * @property static:transitionEndEventNames - Saves a string with all css3
 * browser specific transition end event names.
 * @property static:consoleMethodNames - This variable contains a collection of
 * methods usually binded to the console object.
 * @property static:_javaScriptDependentContentHandled - Indicates weather
 * javaScript dependent content where hide or shown.
 * @property static:_name - Defines this class name to allow retrieving them
 * after name mangling.
 * @property $domNode - $-extended dom node if one was given to the constructor
 * method.
 * @property _options - Options given to the constructor.
 * @property _defaultOptions - Fallback options if not overwritten by the
 * options given to the constructor method.
 * @property _defaultOptions.logging {boolean} - Indicates weather logging
 * should be active.
 * @property _defaultOptions.domNodeSelectorPrefix {string} - Selector prefix
 * for all needed dom nodes.
 * @property _defaultOptions.domNode {Object.<string, string>} - Mapping of
 * names to needed dom nodes referenced by there selector.
 * @property _defaultOptions.domNode.hideJavaScriptEnabled {string} - Selector
 * to dom nodes which should be hidden if javaScript is available.
 * @property _defaultOptions.domNode.showJavaScriptEnabled {string} - Selector
 * to dom nodes which should be visible if javaScript is available.
 * @property _locks - Mapping of lock descriptions to there corresponding
 * callbacks.
 */
class Tools {
    // region static properties
    static abbreviations:Array<string> = [
        'html', 'id', 'url', 'us', 'de', 'api', 'href']
    static animationEndEventNames:string = 'animationend webkitAnimationEnd ' +
        'oAnimationEnd MSAnimationEnd'
    static keyCode:{[key:string]:number} = {
        BACKSPACE: 8,
        COMMA: 188,
        DELETE: 46,
        DOWN: 40,
        END: 35,
        ENTER: 13,
        ESCAPE: 27,
        HOME: 36,
        LEFT: 37,
        NUMPAD_ADD: 107,
        NUMPAD_DECIMAL: 110,
        NUMPAD_DIVIDE: 111,
        NUMPAD_ENTER: 108,
        NUMPAD_MULTIPLY: 106,
        NUMPAD_SUBTRACT: 109,
        PAGE_DOWN: 34,
        PAGE_UP: 33,
        PERIOD: 190,
        RIGHT: 39,
        SPACE: 32,
        TAB: 9,
        UP: 38
    }
    static maximalSupportedInternetExplorerVersion:number = (():number => {
        if ('document' in context)
            return 0
        const div = context.document.createElement('div')
        let version:number
        for (version = 0; version < 10; version++) {
            /*
                NOTE: We split html comment sequences to avoid wrong
                interpretation if this code is embedded in markup.
                NOTE: Internet Explorer 9 and lower sometimes doesn't
                understand conditional comments wich doesn't starts with a
                whitespace. If the conditional markup isn't in a commend.
                Otherwise there shouldn't be any whitespace!
            */
            /* eslint-disable no-useless-concat */
            div.innerHTML = (
                '<!' + `--[if gt IE ${version}]><i></i><![e` + 'ndif]-' + '->')
            /* eslint-enable no-useless-concat */
            if (div.getElementsByTagName('i').length === 0)
                break
        }
        // Try special detection for internet explorer 10 and 11.
        if (version === 0 && 'navigator' in context)
            if (context.navigator.appVersion.includes('MSIE 10'))
                return 10
            else if (context.navigator.userAgent.includes(
                'Trident'
            ) && context.navigator.userAgent.includes('rv:11'))
                return 11
        return version
    })()
    static transitionEndEventNames:string = 'transitionend ' +
        'webkitTransitionEnd oTransitionEnd MSTransitionEnd'
    static consoleMethodNames:Array<string> = [
        'assert',
        'clear',
        'count',
        'debug',
        'dir',
        'dirxml',
        'error',
        'exception',
        'group',
        'groupCollapsed',
        'groupEnd',
        'info',
        'log',
        'markTimeline',
        'profile',
        'profileEnd',
        'table',
        'time',
        'timeEnd',
        'timeStamp',
        'trace',
        'warn'
    ]
    static _javaScriptDependentContentHandled:boolean = false
    static _name:string = 'Tools'
    // endregion
    // region dynamic properties
    $domNode:$DomNode
    _options:Options
    _defaultOptions:PlainObject
    _locks:{[key:string]:Array<LockCallbackFunction>};
    // endregion
    // region public methods
    // / region special
    /**
     * This method should be overwritten normally. It is triggered if current
     * object is created via the "new" keyword. The dom node selector prefix
     * enforces to not globally select any dom nodes which aren't in the
     * expected scope of this plugin. "{1}" will be automatically replaced with
     * this plugin name suffix ("tools"). You don't have to use "{1}" but it
     * can help you to write code which is more reconcilable with the dry
     * concept.
     * @param $domNode - $-extended dom node to use as reference in various
     * methods.
     * @param options - Options to change runtime behavior.
     * @param defaultOptions - Default options to ensure to be present in any
     * options instance.
     * @param locks - Mapping of a lock description to callbacks for calling
     * when given lock should be released.
     * @returns Returns nothing but if invoked with "new" an instance of this
     * class will be given back.
     */
    constructor(
        $domNode:?$DomNode = null, options:Object = {},
        defaultOptions:PlainObject = {
            logging: false, domNodeSelectorPrefix: 'body', domNode: {
                hideJavaScriptEnabled: '.tools-hidden-on-javascript-enabled',
                showJavaScriptEnabled: '.tools-visible-on-javascript-enabled'
            }
        }, locks:{[key:string]:Array<LockCallbackFunction>} = {}
    ):void {
        if ($domNode)
            this.$domNode = $domNode
        this._options = options
        this._defaultOptions = defaultOptions
        this._locks = locks
        // Avoid errors in browsers that lack a console.
        if (!('console' in context))
            context.console = {}
        for (const methodName:string of this.constructor.consoleMethodNames)
            if (!(methodName in context.console))
                context.console[methodName] = 'noop' in $ ? $.noop() : (
                ):void => {}
        if (
            !this.constructor._javaScriptDependentContentHandled &&
            'document' in context
        ) {
            this.constructor._javaScriptDependentContentHandled = true
            $(
                `${this._defaultOptions.domNodeSelectorPrefix} ` +
                this._defaultOptions.domNode.hideJavaScriptEnabled
            ).filter(function():boolean {
                return !$(this).data('javaScriptDependentContentHide')
            }).data('javaScriptDependentContentHide', true).hide()
            $(
                `${this._defaultOptions.domNodeSelectorPrefix} ` +
                this._defaultOptions.domNode.showJavaScriptEnabled
            ).filter(function():boolean {
                return !$(this).data('javaScriptDependentContentShow')
            }).data('javaScriptDependentContentShow', true).show()
        }
    }
    /**
     * This method could be overwritten normally. It acts like a destructor.
     * @returns Returns the current instance.
     */
    destructor():Tools {
        this.off('*')
        return this
    }
    /**
     * This method should be overwritten normally. It is triggered if current
     * object was created via the "new" keyword and is called now.
     * @param options - An options object.
     * @returns Returns the current instance.
     */
    initialize(options:PlainObject = {}):Tools {
        /*
            NOTE: We have to create a new options object instance to avoid
            changing a static options object.
        */
        this._options = $.extend(
            true, {}, this._defaultOptions, this._options, options)
        /*
            The selector prefix should be parsed after extending options
            because the selector would be overwritten otherwise.
        */
        this._options.domNodeSelectorPrefix = this.constructor.stringFormat(
            this._options.domNodeSelectorPrefix,
            this.constructor.stringCamelCaseToDelimited(this.constructor._name))
        return this
    }
    // / endregion
    // / region object orientation
    /* eslint-disable jsdoc/require-description-complete-sentence */
    /**
     * Defines a generic controller for jQuery plugins.
     * @param object - The object or class to control. If "object" is a class
     * an instance will be generated.
     * @param parameter - The initially given arguments object.
     * @param $domNode - Optionally a $-extended dom node to use as reference.
     * @returns Returns whatever the initializer method returns.
     */
    controller(
        object:Object, parameter:Array<any>, $domNode:?$DomNode = null
    ):any {
    /* eslint-enable jsdoc/require-description-complete-sentence */
        if (typeof object === 'function') {
            object = new object($domNode)
            if (!object instanceof Tools)
                object = $.extend(true, new Tools(), object)
        }
        parameter = this.constructor.argumentsObjectToArray(parameter)
        if ($domNode && !$domNode.data(object.constructor._name))
            // Attach extended object to the associated dom node.
            $domNode.data(object.constructor._name, object)
        if (parameter[0] in object)
            return object[parameter[0]].apply(object, parameter.slice(1))
        else if (parameter.length === 0 || $.type(parameter[0]) === 'object')
            /*
                If an options object or no method name is given the initializer
                will be called.
            */
            return object.initialize.apply(object, parameter)
        $.error(
            `Method "${parameter[0]}" does not exist on $-extended dom node ` +
            `"${object.constructor._name}".`)
    }
    // / endregion
    // / region mutual exclusion
    /**
     * Calling this method introduces a starting point for a critical area with
     * potential race conditions. The area will be binded to given description
     * string. So don't use same names for different areas.
     * @param description - A short string describing the critical areas
     * properties.
     * @param callbackFunction - A procedure which should only be executed if
     * the interpreter isn't in the given critical area. The lock description
     * string will be given to the callback function.
     * @param autoRelease - Release the lock after execution of given callback.
     * @returns Returns the current instance.
     */
    acquireLock(
        description:string, callbackFunction:LockCallbackFunction,
        autoRelease:boolean = false
    ):Tools {
        const wrappedCallbackFunction:LockCallbackFunction = (
            description:string
        ):void => {
            callbackFunction(description)
            if (autoRelease)
                this.releaseLock(description)
        }
        if (this._locks.hasOwnProperty(description))
            this._locks[description].push(wrappedCallbackFunction)
        else {
            this._locks[description] = []
            wrappedCallbackFunction(description)
        }
        return this
    }
    /**
     * Calling this method  causes the given critical area to be finished and
     * all functions given to "this.acquireLock()" will be executed in right
     * order.
     * @param description - A short string describing the critical areas
     * properties.
     * @returns Returns the current instance.
     */
    releaseLock(description:string):Tools {
        if (this._locks.hasOwnProperty(description))
            if (this._locks[description].length)
                this._locks[description].shift()(description)
            else
                delete this._locks[description]
        return this
    }
    // / endregion
    // / region language fixes
    /**
     * This method fixes an ugly javaScript bug. If you add a mouseout event
     * listener to a dom node the given handler will be called each time any
     * dom node inside the observed dom node triggers a mouseout event. This
     * methods guarantees that the given event handler is only called if the
     * observed dom node was leaved.
     * @param eventHandler - The mouse out event handler.
     * @returns Returns the given function wrapped by the workaround logic.
     */
    static mouseOutEventHandlerFix(eventHandler:Function):Function {
        const self:Object = this
        return function(event:Object):any {
            let relatedTarget:DomNode = event.toElement
            if ('relatedTarget' in event)
                relatedTarget = event.relatedTarget
            while (relatedTarget && relatedTarget.tagName !== 'BODY') {
                if (relatedTarget === this)
                    return
                relatedTarget = relatedTarget.parentNode
            }
            return eventHandler.apply(self, arguments)
        }
    }
    // / endregion
    // / region logging
    /**
     * Shows the given object's representation in the browsers console if
     * possible or in a standalone alert-window as fallback.
     * @param object - Any object to print.
     * @param force - If set to "true" given input will be shown independently
     * from current logging configuration or interpreter's console
     * implementation.
     * @param avoidAnnotation - If set to "true" given input has no module or
     * log level specific annotations.
     * @param level - Description of log messages importance.
     * @param additionalArguments - Additional arguments are used for string
     * formating.
     * @returns Returns the current instance.
     */
    log(
        object:any, force:boolean = false, avoidAnnotation:boolean = false,
        level:string = 'info', ...additionalArguments:Array<any>
    ):Tools {
        if (this._options.logging || force || ['error', 'critical'].includes(
            level
        )) {
            let message:any
            if (avoidAnnotation)
                message = object
            else if (typeof object === 'string') {
                additionalArguments.unshift(object)
                message = `${this.constructor._name} (${level}): ` +
                    this.constructor.stringFormat.apply(
                        this, additionalArguments)
            } else if ($.isNumeric(object) || $.type(object) === 'boolean')
                message = `${this.constructor._name} (${level}): ` +
                    object.toString()
            else {
                this.log(',--------------------------------------------,')
                this.log(object, force, true)
                this.log("'--------------------------------------------'")
            }
            if (message)
                if (!('console' in context && level in context.console) || (
                    'noop' in $ && context.console[level] === $.noop()
                )) {
                    if ('alert' in context)
                        context.alert(message)
                } else
                    context.console[level](message)
        }
        return this
    }
    /**
     * Wrapper method for the native console method usually provided by
     * interpreter.
     * @param object - Any object to print.
     * @param additionalArguments - Additional arguments are used for string
     * formating.
     * @returns Returns the current instance.
     */
    info(object:any, ...additionalArguments:Array<any>):Tools {
        // IgnoreTypeCheck
        return this.log.apply(this, [object, false, false, 'info'].concat(
            additionalArguments))
    }
    /**
     * Wrapper method for the native console method usually provided by
     * interpreter.
     * @param object - Any object to print.
     * @param additionalArguments - Additional arguments are used for string
     * formating.
     * @returns Returns the current instance.
     */
    debug(object:any, ...additionalArguments:Array<any>):Tools {
        // IgnoreTypeCheck
        return this.log.apply(this, [object, false, false, 'debug'].concat(
            additionalArguments))
    }
    /**
     * Wrapper method for the native console method usually provided by
     * interpreter.
     * @param object - Any object to print.
     * @param additionalArguments - Additional arguments are used for string
     * formating.
     * @returns Returns the current instance.
     */
    error(object:any, ...additionalArguments:Array<any>):Tools {
        // IgnoreTypeCheck
        return this.log.apply(this, [object, true, false, 'error'].concat(
            additionalArguments))
    }
    /**
     * Wrapper method for the native console method usually provided by
     * interpreter.
     * @param object - Any object to print.
     * @param additionalArguments - Additional arguments are used for string
     * formating.
     * @returns Returns the current instance.
     */
    critical(object:any, ...additionalArguments:Array<any>):Tools {
        // IgnoreTypeCheck
        return this.log.apply(this, [object, true, false, 'warn'].concat(
            additionalArguments))
    }
    /**
     * Wrapper method for the native console method usually provided by
     * interpreter.
     * @param object - Any object to print.
     * @param additionalArguments - Additional arguments are used for string
     * formating.
     * @returns Returns the current instance.
     */
    warn(object:any, ...additionalArguments:Array<any>):Tools {
        // IgnoreTypeCheck
        return this.log.apply(this, [object, false, false, 'warn'].concat(
            additionalArguments))
    }
    /**
     * Dumps a given object in a human readable format.
     * @param object - Any object to show.
     * @returns Returns the serialized version of given object.
     */
    static show(object:any):string {
        let output:string = ''
        if ($.type(object) === 'string')
            output = object
        else
            $.each(object, (key:any, value:any):void => {
                if (value === undefined)
                    value = 'undefined'
                else if (value === null)
                    value = 'null'
                output += `${key.toString()}: ${value.toString()}\n`
            })
        if (!output)
            output = output.toString()
        return `${$.trim(output)}\n(Type: "${$.type(object)}")`
    }
    // / endregion
    // / region dom node
    /**
     * Normalizes class name order of current dom node.
     * @returns Returns current instance.
     */
    normalizeClassNames():Tools {
        this.$domNode.find('*').addBack().each(function():void {
            const $thisDomNode:$DomNode = $(this)
            if ($thisDomNode.attr('class')) {
                const sortedClassNames:Array<string> = $thisDomNode.attr(
                    'class'
                ).split(' ').sort() || []
                $thisDomNode.attr('class', '')
                for (const className:string of sortedClassNames)
                    $thisDomNode.addClass(className)
            } else if ($thisDomNode.is('[class]'))
                $thisDomNode.removeAttr('class')
        })
        return this
    }
    /**
     * Checks weather given html or text strings are equal.
     * @param first - First html, selector to dom node or text to compare.
     * @param second - Second html, selector to dom node  or text to compare.
     * @param forceHTMLString - Indicates weather given contents are
     * interpreted as html string (otherwise an automatic detection will be
     * triggered).
     * @returns Returns true if both dom representations are equivalent.
     */
    static isEquivalentDom(
        first:any, second:any, forceHTMLString:boolean = false
    ):boolean {
        if (first === second)
            return true
        if (first && second) {
            const detemermineHTMLPattern:RegExp =
                /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/
            const inputs:{first:any;second:any} = {first, second}
            const $domNodes:{first:$DomNode;second:$DomNode} = {
                first: $('<dummy>'), second: $('<dummy>')
            }
            /*
                NOTE: Assume that strings that start "<" and end with ">" are
                markup and skip the more expensive regular expression check.
            */
            for (const type:string of ['first', 'second'])
                if (typeof inputs[type] === 'string' && (forceHTMLString || (
                    inputs[type].startsWith('<') &&
                    inputs[type].endsWith('>') && inputs[type].length >= 3 ||
                    detemermineHTMLPattern.test(inputs[type])
                )))
                    $domNodes[type] = $(`<div>${inputs[type]}</div>`)
                else
                    try {
                        let $selectedDomNode:$DomNode = $(inputs[type])
                        if ($selectedDomNode.length)
                            $domNodes[type] = $('<div>').append(
                                $selectedDomNode.clone())
                        else
                            return false
                    } catch (error) {
                        return false
                    }
            if (
                $domNodes.first.length &&
                $domNodes.first.length === $domNodes.second.length
            ) {
                $domNodes.first = $domNodes.first.Tools(
                    'normalizeClassNames'
                ).$domNode
                $domNodes.second = $domNodes.second.Tools(
                    'normalizeClassNames'
                ).$domNode
                let index:number = 0
                for (const domNode:DomNode of $domNodes.first)
                    if (!domNode.isEqualNode($domNodes.second[index]))
                        return false
                return true
            }
        }
        return false
    }
    /**
     * Determines where current dom node is relative to current view port
     * position.
     * @param delta - Allows deltas for "top", "left", "bottom" and "right" for
     * determining positions.
     * @returns Returns one of "above", "left", "below", "right" or "in".
     */
    getPositionRelativeToViewport(delta:Position = {}):RelativePosition {
        delta = $.extend({top: 0, left: 0, bottom: 0, right: 0}, delta)
        if (
            'window' in context && this.$domNode && this.$domNode.length &&
            this.$domNode[0]
        ) {
            const $window:$DomNode = $(window)
            const rectangle:Position = this.$domNode[0].getBoundingClientRect()
            if ((rectangle.top + delta.top) < 0)
                return 'above'
            if ((rectangle.left + delta.left) < 0)
                return 'left'
            if ($window.height() < (rectangle.bottom + delta.bottom))
                return 'below'
            if ($window.width() < (rectangle.right + delta.right))
                return 'right'
        }
        return 'in'
    }
    /**
     * Generates a directive name corresponding selector string.
     * @param directiveName - The directive name.
     * @returns Returns generated selector.
     */
    static generateDirectiveSelector(directiveName:string):string {
        const delimitedName:string = Tools.stringCamelCaseToDelimited(
            directiveName)
        return `${delimitedName}, .${delimitedName}, [${delimitedName}], ` +
            `[data-${delimitedName}], [x-${delimitedName}]` + (
                (delimitedName.includes('-') ? (
                    `, [${delimitedName.replace(/-/g, '\\:')}], ` +
                    `[${delimitedName.replace(/-/g, '_')}]`) : ''))
    }
    /**
     * Removes a directive name corresponding class or attribute.
     * @param directiveName - The directive name.
     * @returns Returns current dom node.
     */
    removeDirective(directiveName:string):$DomNode {
        const delimitedName:string =
            this.constructor.stringCamelCaseToDelimited(directiveName)
        return this.$domNode.removeClass(delimitedName).removeAttr(
            delimitedName
        ).removeAttr(`data-${delimitedName}`).removeAttr(
            `x-${delimitedName}`
        ).removeAttr(delimitedName.replace('-', ':')).removeAttr(
            delimitedName.replace('-', '_'))
    }
    /**
     * Determines a normalized camel case directive name representation.
     * @param directiveName - The directive name.
     * @returns Returns the corresponding name.
     */
    static getNormalizedDirectiveName(directiveName:string):string {
        for (const delimiter:string of ['-', ':', '_']) {
            let prefixFound:boolean = false
            for (const prefix:string of [`data${delimiter}`, `x${delimiter}`])
                if (directiveName.startsWith(prefix)) {
                    directiveName = directiveName.substring(prefix.length)
                    prefixFound = true
                    break
                }
            if (prefixFound)
                break
        }
        for (const delimiter:string of ['-', ':', '_'])
            directiveName = Tools.stringDelimitedToCamelCase(
                directiveName, delimiter)
        return directiveName
    }
    /**
     * Determines a directive attribute value.
     * @param directiveName - The directive name.
     * @returns Returns the corresponding attribute value or "null" if no
     * attribute value exists.
     */
    getDirectiveValue(directiveName:string):?string {
        const delimitedName:string =
            this.constructor.stringCamelCaseToDelimited(directiveName)
        for (const attributeName:string of [
            delimitedName, `data-${delimitedName}`, `x-${delimitedName}`,
            delimitedName.replace('-', '\\:')
        ]) {
            const value:string = this.$domNode.attr(attributeName)
            if (value !== undefined)
                return value
        }
        return null
    }
    /**
     * Removes a selector prefix from a given selector. This methods searches
     * in the options object for a given "domNodeSelectorPrefix".
     * @param domNodeSelector - The dom node selector to slice.
     * @returns Returns the sliced selector.
     */
    sliceDomNodeSelectorPrefix(domNodeSelector:string):string {
        if (
            'domNodeSelectorPrefix' in this._options &&
            domNodeSelector.startsWith(this._options.domNodeSelectorPrefix)
        )
            return $.trim(domNodeSelector.substring(
                this._options.domNodeSelectorPrefix.length))
        return domNodeSelector
    }
    /**
     * Determines the dom node name of a given dom node string.
     * @param domNodeSelector - A given to dom node selector to determine its
     * name.
     * @returns Returns The dom node name.
     * @example
     * // returns 'div'
     * $.Tools.getDomNodeName('&lt;div&gt;')
     * @example
     * // returns 'div'
     * $.Tools.getDomNodeName('&lt;div&gt;&lt;/div&gt;')
     * @example
     * // returns 'br'
     * $.Tools.getDomNodeName('&lt;br/&gt;')
     */
    static getDomNodeName(domNodeSelector:string):?string {
        const match:?Array<string> = domNodeSelector.match(
            new RegExp('^<?([a-zA-Z]+).*>?.*'))
        if (match)
            return match[1]
        return null
    }
    /* eslint-disable jsdoc/require-description-complete-sentence */
    /**
     * Converts an object of dom selectors to an array of $ wrapped dom nodes.
     * Note if selector description as one of "class" or "id" as suffix element
     * will be ignored.
     * @param domNodeSelectors - An object with dom node selectors.
     * @param wrapperDomNode - A dom node to be the parent or wrapper of all
     * retrieved dom nodes.
     * @returns Returns All $ wrapped dom nodes corresponding to given
     * selectors.
     */
    grabDomNode(
        domNodeSelectors:PlainObject, wrapperDomNode:DomNode|$DomNode
    ):{[key:string]:$DomNode} {
    /* eslint-enable jsdoc/require-description-complete-sentence */
        const domNodes:{[key:string]:$DomNode} = {}
        if (domNodeSelectors)
            if (wrapperDomNode) {
                const $wrapperDomNode:$DomNode = $(wrapperDomNode)
                $.each(domNodeSelectors, (key:string, value:string):void => {
                    domNodes[key] = $wrapperDomNode.find(value)
                })
            } else
                $.each(domNodeSelectors, (key:string, value:string):void => {
                    const match:?Array<string> = value.match(', *')
                    if (match)
                        $.each(value.split(match[0]), (
                            key:string, valuePart:string
                        ):void => {
                            if (key)
                                value += ', ' + this._grabDomNodeHelper(
                                    key, valuePart, domNodeSelectors)
                            else
                                /* eslint-disable max-statements-per-line */
                                value = valuePart
                                /* eslint-enable max-statements-per-line */
                        })
                    domNodes[key] = $(this._grabDomNodeHelper(
                        key, value, domNodeSelectors))
                })
        if (this._options.domNodeSelectorPrefix)
            domNodes.parent = $(this._options.domNodeSelectorPrefix)
        if ('window' in context)
            domNodes.window = $(window)
        if ('document' in context)
            domNodes.document = $(context.document)
        return domNodes
    }
    // / endregion
    // / region scope
    /**
     * Overwrites all inherited variables from parent scope with "undefined".
     * @param scope - A scope where inherited names will be removed.
     * @param prefixesToIgnore - Name prefixes to ignore during deleting names
     * in given scope.
     * @returns The isolated scope.
     */
    static isolateScope(scope:Object, prefixesToIgnore:Array<string> = [
        '$', '_'
    ]):Object {
        for (const name:string in scope)
            if (!(prefixesToIgnore.includes(name.charAt(0)) || [
                'this', 'constructor'
            ].includes(name) || scope.hasOwnProperty(name)))
                /*
                    NOTE: Delete ("delete $scope[name]") doesn't destroy the
                    automatic lookup to parent scope.
                */
                scope[name] = undefined
        return scope
    }
    /**
     * Generates a unique name in given scope (usefull for jsonp requests).
     * @param prefix - A prefix which will be preprended to uniqe name.
     * @param suffix - A suffix which will be preprended to uniqe name.
     * @param scope - A scope where the name should be unique.
     * @param initialUniqueName - An initial scope name to use if not exists.
     * @returns The function name.
     */
    static determineUniqueScopeName(
        prefix:string = 'callback', suffix:string = '', scope:Object = context,
        initialUniqueName:string = ''
    ):string {
        if (initialUniqueName.length && !(initialUniqueName in scope))
            return initialUniqueName
        let uniqueName:string = prefix + suffix
        while (true) {
            uniqueName = prefix + parseInt(
                Math.random() * Math.pow(10, 10), 10
            ) + suffix
            if (!(uniqueName in scope))
                break
        }
        return uniqueName
    }
    // / endregion
    // / region function
    /**
     * Methods given by this method has the plugin scope referenced with
     * "this". Otherwise "this" usually points to the object the given method
     * was attached to. If "method" doesn't match string arguments are passed
     * through "$.proxy()" with "context" setted as "scope" or "this" if
     * nothing is provided.
     * @param method - A method name of given scope.
     * @param scope - A given scope.
     * @param additionalArguments - A list of additional arguments to forward
     * to given function, when it should be called.
     * @returns Returns the given methods return value.
     */
    getMethod(
        method:Function|string, scope:any = null,
        ...additionalArguments:Array<any>
    ):Function {
        /*
            This following outcomment line would be responsible for a bug in
            yuicompressor. Because of declaration of arguments the parser
            things that arguments is a local variable and could be renamed. It
            doesn't care about that the magic arguments object is necessary to
            generate the arguments array in this context.

            var arguments = Tools.argumentsObjectToArray(arguments)

            use something like this instead:

            var parameter = Tools.argumentsObjectToArray(arguments)
        */
        let parameter:Array<any> = this.constructor.argumentsObjectToArray(
            arguments)
        if (!scope)
            parameter[1] = scope = this
        if (typeof method === 'string' && typeof scope === 'object')
            return function():void {
                if (!scope[method] && typeof method === 'string')
                    $.error(`Method "${method}" doesn't exists in "${scope}".`)
                parameter = $.Tools().argumentsObjectToArray(arguments)
                scope[method].apply(scope, parameter.concat(
                    additionalArguments))
            }
        return $.proxy.apply($, parameter)
    }
    /**
     * Implements the identity function.
     * @param value - A value to return.
     * @returns Returns the given value.
     */
    static identity(value:any):any {
        return value
    }
    /**
     * Inverted filter helper to inverse each given filter.
     * @param filter - A function that filters an array.
     * @returns The inverted filter.
     */
    static invertArrayFilter(filter:Function):Function {
        return function(data:any):any {
            if (data) {
                const filteredData:any = filter.apply(this, arguments)
                let result:Array<any> = []
                /* eslint-disable curly */
                if (filteredData.length) {
                    for (const date:any of data)
                        if (!filteredData.includes(date))
                            result.push(date)
                } else
                /* eslint-enable curly */
                    result = data
                return result
            }
            return data
        }
    }
    // / endregion
    // / region event
    /**
     * Prevents event functions from triggering to often by defining a minimal
     * span between each function call. Additional arguments given to this
     * function will be forwarded to given event function call. The function
     * wrapper returns null if current function will be omitted due to
     * debounceing.
     * @param eventFunction - The function to call debounced.
     * @param thresholdInMilliseconds - The minimum time span between each
     * function call.
     * @param additionalArguments - Additional arguments to forward to given
     * function.
     * @returns Returns the wrapped method.
     */
    static debounce(
        eventFunction:Function, thresholdInMilliseconds:number = 600,
        ...additionalArguments:Array<any>
    ):Function {
        let lock:boolean = false
        let waitingCallArguments:?Array<any> = null
        let timeoutID:?number = null
        return function():?number {
            const parameter:Array<any> = Tools.argumentsObjectToArray(
                arguments)
            if (lock)
                waitingCallArguments = parameter.concat(
                    additionalArguments || [])
            else {
                lock = true
                timeoutID = setTimeout(():void => {
                    lock = false
                    if (waitingCallArguments) {
                        eventFunction.apply(this, waitingCallArguments)
                        waitingCallArguments = null
                    }
                }, thresholdInMilliseconds)
                eventFunction.apply(this, parameter.concat(
                    additionalArguments || []))
            }
            return timeoutID
        }
    }
    /**
     * Searches for internal event handler methods and runs them by default. In
     * addition this method searches for a given event method by the options
     * object. Additional arguments are forwarded to respective event
     * functions.
     * @param eventName - An event name.
     * @param callOnlyOptionsMethod - Prevents from trying to call an internal
     * event handler.
     * @param scope - The scope from where the given event handler should be
     * called.
     * @param additionalArguments - Additional arguments to forward to
     * corresponding event handlers.
     * @returns - Returns "true" if an event handler was called and "false"
     * otherwise.
     */
    fireEvent(
        eventName:string, callOnlyOptionsMethod:boolean = false,
        scope:any = this, ...additionalArguments:Array<any>
    ):boolean {
        const eventHandlerName:string =
            `on${this.constructor.stringCapitalize(eventName)}`
        if (!callOnlyOptionsMethod)
            if (eventHandlerName in scope)
                scope[eventHandlerName].apply(scope, additionalArguments)
            else if (`_${eventHandlerName}` in scope)
                scope[`_${eventHandlerName}`].apply(
                    scope, additionalArguments)
        if (scope._options && eventHandlerName in scope._options) {
            scope._options[eventHandlerName].apply(scope, additionalArguments)
            return true
        }
        return false
    }
    /* eslint-disable jsdoc/require-description-complete-sentence */
    /**
     * A wrapper method for "$.on()". It sets current plugin name as event
     * scope if no scope is given. Given arguments are modified and passed
     * through "$.on()".
     * @returns Returns $'s grabbed dom node.
     */
    on():$DomNode {
    /* eslint-enable jsdoc/require-description-complete-sentence */
        return this._bindHelper(arguments, false)
    }
    /* eslint-disable jsdoc/require-description-complete-sentence */
    /**
     * A wrapper method fo "$.off()". It sets current plugin name as event
     * scope if no scope is given. Given arguments are modified and passed
     * through "$.off()".
     * @returns Returns $'s grabbed dom node.
     */
    off():$DomNode {
    /* eslint-enable jsdoc/require-description-complete-sentence */
        return this._bindHelper(arguments, true, 'off')
    }
    // / endregion
    // / region object
    /**
     * Converts given plain object and all nested found objects to
     * corresponding map.
     * @param object - Object to convert to.
     * @param deep - Indicates whether to perform a recursive conversion.
     * @returns Given object as map.
     */
    static convertPlainObjectToMap<Value>(
        object:Value, deep:boolean = true
    ):Value|Map<any, any> {
        if (typeof object === 'object' && $.isPlainObject(object)) {
            const newObject:Map<any, any> = new Map()
            for (const key:string in object)
                if (object.hasOwnProperty(key)) {
                    if (deep)
                        object[key] = Tools.convertPlainObjectToMap(
                            object[key], deep)
                    newObject.set(key, object[key])
                }
            return newObject
        }
        if (deep)
            if (Array.isArray(object)) {
                let index:number = 0
                for (const value:Object of object) {
                    object[index] = Tools.convertPlainObjectToMap(value, deep)
                    index += 1
                }
            } else if (object instanceof Map) {
                for (const [key:mixed, value:mixed] of object)
                    object.set(key, Tools.convertPlainObjectToMap(
                        value, deep))
            }
        return object
    }
    /**
     * Converts given map and all nested found maps objects to corresponding
     * object.
     * @param object - Map to convert to.
     * @param deep - Indicates whether to perform a recursive conversion.
     * @returns Given map as object.
     */
    static convertMapToPlainObject<Value>(
        object:Value, deep:boolean = true
    ):Value|PlainObject {
        if (object instanceof Map) {
            const newObject:PlainObject = {}
            for (let [key:any, value:mixed] of object) {
                if (deep)
                    value = Tools.convertMapToPlainObject(value, deep)
                newObject[`${key}`] = value
            }
            return newObject
        }
        if (deep)
            if (typeof object === 'object' && $.isPlainObject(object)) {
                for (const key:string in object)
                    if (object.hasOwnProperty(key))
                        object[key] = Tools.convertMapToPlainObject(
                            object[key], deep)
            } else if (Array.isArray(object)) {
                let index:number = 0
                for (const value:mixed of object) {
                    object[index] = Tools.convertMapToPlainObject(value, deep)
                    index += 1
                }
            }
        return object
    }
    /**
     * Iterates given objects own properties in sorted fashion. For
     * each key value pair given iterator function will be called with
     * value and key as arguments.
     * @param object - Object to iterate.
     * @param iterator - Function to execute for each key value pair. Value
     * will be the first and key will be the second argument.
     * @param context - The "this" binding for given iterator function.
     * @returns List of given sorted keys.
     */
    static forEachSorted(
        object:mixed, iterator:(key:any, value:any) => any,
        context:Object
    ):Array<any> {
        const keys:Array<any> = Tools.sort(object)
        for (const key:any of keys)
            if (object instanceof Map)
                iterator.call(context, object.get(key), key)
            else if (Array.isArray(object) || object instanceof Object)
                iterator.call(context, object[key], key)
        return keys
    }
    /**
     * Sort given objects keys.
     * @param object - Object which keys should be sorted.
     * @returns Sorted list of given keys.
     */
    static sort(object:mixed):Array<any> {
        const keys:Array<any> = []
        if (Array.isArray(object))
            for (let index:number = 0; index < object.length; index++)
                keys.push(index)
        else if (object instanceof Map)
            for (const keyValuePair:Array<any> of object)
                keys.push(keyValuePair[0])
        else if (object instanceof Object)
            for (const key:string in object)
                if (object.hasOwnProperty(key))
                    keys.push(key)
        return keys.sort()
    }
    /**
     * Returns true if given items are equal for given property list. If
     * property list isn't set all properties will be checked. All keys which
     * starts with one of the exception prefixes will be omitted.
     * @param firstValue - First object to compare.
     * @param secondValue - Second object to compare.
     * @param properties - Property names to check. Check all if "null" is
     * selected (default).
     * @param deep - Recursion depth negative values means infinitely deep
     * (default).
     * @param exceptionPrefixes - Property prefixes which indicates properties
     * to ignore.
     * @param ignoreFunctions - Indicates weather functions have to be
     * identical to interpret is as equal. If set to "true" two functions will
     * be assumed to be equal (default).
     * @returns Value "true" if both objects are equal and "false" otherwise.
     */
    static equals(
        firstValue:any, secondValue:any, properties:?Array<any> = null,
        deep:number = -1, exceptionPrefixes:Array<string> = ['$', '_'],
        ignoreFunctions:boolean = true
    ):boolean {
        if (
            ignoreFunctions && $.isFunction(firstValue) && $.isFunction(
                secondValue
            ) || firstValue === secondValue || Tools.numberIsNotANumber(
                firstValue
            ) && Tools.numberIsNotANumber(secondValue) ||
            firstValue instanceof RegExp &&
            secondValue instanceof RegExp &&
            firstValue.toString() === secondValue.toString() ||
            firstValue instanceof Date &&
            secondValue instanceof Date && (
                isNaN(firstValue.getTime()) &&
                isNaN(secondValue.getTime()) ||
                !isNaN(firstValue.getTime()) &&
                !isNaN(secondValue.getTime()) &&
                firstValue.getTime() === secondValue.getTime()
            )
        )
            return true
        if ($.isPlainObject(firstValue) && $.isPlainObject(
            secondValue
        ) && !(
            firstValue instanceof RegExp || secondValue instanceof RegExp
        ) || $.isArray(firstValue) && $.isArray(
            secondValue
        ) && firstValue.length === secondValue.length) {
            for (const [first, second] of [[firstValue, secondValue], [
                secondValue, firstValue
            ]]) {
                const firstIsArray:boolean = $.isArray(first)
                if (firstIsArray && (!$.isArray(
                    second
                )) || first.length !== second.length)
                    return false
                let equal:boolean = true
                $.each(first, (key:string|number, value:any):void => {
                    if (!firstIsArray) {
                        if (!equal || properties && !properties.includes(key))
                            return
                        for (const exceptionPrefix:string of exceptionPrefixes)
                            if (key.toString().startsWith(exceptionPrefix))
                                return
                    }
                    if (deep !== 0 && !Tools.equals(
                        value, second[key], properties, deep - 1,
                        exceptionPrefixes
                    ))
                        equal = false
                })
                if (!equal)
                    return false
            }
            return true
        }
        return false
    }
    // / endregion
    // / region array
    /**
     * Converts the interpreter given magic arguments object to a standard
     * array object.
     * @param argumentsObject - An argument object.
     * @returns Returns the array containing all elements in given arguments
     * object.
     */
    static argumentsObjectToArray(argumentsObject:Array<any>):Array<any> {
        return Array.prototype.slice.call(argumentsObject)
    }
    /**
     * Makes all values in given iterable unique by removing duplicates (The
     * first occurrences will be left).
     * @param data - Array like object.
     * @returns Sliced version of given object.
     */
    static arrayUnique(data:Array<any>):Array<any> {
        const result:Array<any> = []
        for (const value:any of data)
            if (!result.includes(value))
                result.push(value)
        return result
    }
    /**
     * Summarizes given property of given item list.
     * @param data - Array of objects with given property name.
     * @param propertyName - Property name to summarize.
     * @param defaultValue - Value to return if property values doesn't match.
     * @returns Summarized array.
     */
    static arrayAggregatePropertyIfEqual(
        data:Array<Object>, propertyName:string, defaultValue:any = ''
    ):any {
        let result:any = defaultValue
        if (data && data.length && data[0].hasOwnProperty(propertyName)) {
            result = data[0][propertyName]
            for (const item of data)
                if (item[propertyName] !== result)
                    return defaultValue
        }
        return result
    }
    /**
     * Deletes every item witch has only empty attributes for given property
     * names. If given property names are empty each attribute will be
     * considered. The empty string, "null" and "undefined" will be interpreted
     * as empty.
     * @param data - Data to filter.
     * @param propertyNames - Properties to consider.
     * @returns Given data without empty items.
     */
    static arrayDeleteEmptyItems(
        data:?Array<Object>, propertyNames:Array<string> = []
    ):?Array<Object> {
        if (!data)
            return data
        const result:Array<any> = []
        for (const item:any of data) {
            let empty:boolean = true
            for (const propertyName:string in item)
                if (item.hasOwnProperty(propertyName))
                    if (!['', null, undefined].includes(item[
                        propertyName
                    ]) && (!propertyNames.length || propertyNames.includes(
                        propertyName
                    ))) {
                        empty = false
                        break
                    }
            if (!empty)
                result.push(item)
        }
        return result
    }
    /**
     * Extracts all properties from all items wich occur in given property
     * names.
     * @param data - Data where each item should be sliced.
     * @param propertyNames - Property names to extract.
     * @returns Data with sliced items.
     */
    static arrayExtract(
        data:Array<Object>, propertyNames:Array<string>
    ):Array<Object> {
        const result:Array<Object> = []
        for (const item:Object of data) {
            const newItem:Object = {}
            for (const propertyName:string of propertyNames)
                if (item.hasOwnProperty(propertyName))
                    newItem[propertyName] = item[propertyName]
            result.push(newItem)
        }
        return result
    }
    /**
     * Extracts all values which matches given regular expression.
     * @param data - Data to filter.
     * @param regularExpression - Pattern to match for.
     * @returns Filtered data.
     */
    static arrayExtractIfMatches(
        data:Array<string>, regularExpression:string|RegExp
    ):Array<string> {
        const result:Array<string> = []
        $.each(data, (index:number, value:string):void => {
            if (((typeof regularExpression === 'string') ? new RegExp(
                regularExpression
            ) : regularExpression).test(value))
                result.push(value)
        })
        return result
    }
    /**
     * Filters given data if given property is set or not.
     * @param data - Data to filter.
     * @param propertyName - Property name to check for existence.
     * @returns Given data without the items which doesn't have specified
     * property.
     */
    static arrayExtractIfPropertyExists(
        data:?Array<Object>, propertyName:string
    ):?Array<Object> {
        if (data && propertyName) {
            const result:Array<Object> = []
            for (const item:Object of data) {
                let exists:boolean = false
                for (const key:string in item)
                    if (key === propertyName && item.hasOwnProperty(key) && ![
                        undefined, null
                    ].includes(item[key])) {
                        exists = true
                        break
                    }
                if (exists)
                    result.push(item)
            }
            return result
        }
        return data
    }
    /**
     * Extract given data where specified property value matches given
     * patterns.
     * @param data - Data to filter.
     * @param propertyPattern - Mapping of property names to pattern.
     * @returns Filtered data.
     */
    static arrayExtractIfPropertyMatches(
        data:?Array<Object>, propertyPattern:{[key:string]:string|RegExp}
    ):?Array<Object> {
        if (data && propertyPattern) {
            const result:Array<Object> = []
            for (const item:Object of data) {
                let matches:boolean = true
                for (const propertyName:string in propertyPattern)
                    if (!((
                        propertyPattern[propertyName] instanceof RegExp
                    ) ? propertyPattern[propertyName] : new RegExp(
                        propertyPattern[propertyName]
                    )).test(item[propertyName])) {
                        matches = false
                        break
                    }
                if (matches)
                    result.push(item)
            }
            return result
        }
        return data
    }
    /**
     * Determines all objects which exists in "firstSet" and in "secondSet".
     * Object key which will be compared are given by "keys". If an empty array
     * is given each key will be compared. If an object is given corresponding
     * initial data key will be mapped to referenced new data key.
     * @param firstSet - Referenced data to check for.
     * @param secondSet - Data to check for existence.
     * @param keys - Keys to define equality.
     * @param strict - The strict parameter indicates weather "null" and
     * "undefined" should be interpreted as equal (takes only effect if given
     * keys aren't empty).
     * @returns Data which does exit in given initial data.
     */
    static arrayIntersect(
        firstSet:Array<any>, secondSet:Array<any>,
        keys:{[key:string]:string}|Array<string> = [], strict:boolean = true
    ):Array<any> {
        const containingData:Array<any> = []
        for (const initialItem:any of firstSet)
            if ($.isPlainObject(initialItem))
                for (const newItem:any of secondSet) {
                    let exists:boolean = true
                    let iterateGivenKeys:boolean
                    const keysAreAnArray:boolean = Array.isArray(keys)
                    if ($.isPlainObject(keys) || keysAreAnArray && keys.length)
                        iterateGivenKeys = true
                    else {
                        iterateGivenKeys = false
                        keys = initialItem
                    }
                    $.each(keys, (
                        firstSetKey:string|number, secondSetKey:string|number
                    ):?false => {
                        if (keysAreAnArray && iterateGivenKeys)
                            firstSetKey = secondSetKey
                        else if (!iterateGivenKeys)
                            secondSetKey = firstSetKey
                        if (
                            newItem[secondSetKey] !==
                            initialItem[firstSetKey] && (strict || !(
                                [null, undefined].includes(
                                    newItem[secondSetKey]
                                ) && [null, undefined].includes(
                                    initialItem[firstSetKey]
                                )))
                        ) {
                            exists = false
                            return false
                        }
                    })
                    if (exists) {
                        containingData.push(initialItem)
                        break
                    }
                }
            else if (secondSet.includes(initialItem))
                containingData.push(initialItem)
        return containingData
    }
    /**
     * Creates a list of items within given range.
     * @param range - Array of lower and upper bounds. If only one value is
     * given lower bound will be assumed to be zero. Both integers have to be
     * positive and will be contained in the resulting array.
     * @param step - Space between two consecutive values.
     * @returns Produced array of integers.
     */
    static arrayMakeRange(range:Array<number>, step:number = 1):Array<number> {
        let index:number
        let higherBound:number
        if (range.length === 1) {
            index = 0
            higherBound = parseInt(range[0], 10)
        } else if (range.length === 2) {
            index = parseInt(range[0], 10)
            higherBound = parseInt(range[1], 10)
        } else
            return range
        const result = [index]
        while (index <= higherBound - step) {
            index += step
            result.push(index)
        }
        return result
    }
    /**
     * Sums up given property of given item list.
     * @param data - The objects with specified property to sum up.
     * @param propertyName - Property name to sum up its value.
     * @returns The aggregated value.
     */
    static arraySumUpProperty(
        data:?Array<Object>, propertyName:string
    ):number {
        let result:number = 0
        if (Array.isArray(data) && data.length)
            for (const item:Object of data)
                if (item.hasOwnProperty(propertyName))
                    result += parseFloat(item[propertyName] || 0)
        return result
    }
    /**
     * Adds an item to another item as array connection (many to one).
     * @param item - Item where the item should be appended to.
     * @param target - Target to add to given item.
     * @param name - Name of the target connection.
     * @param checkIfExists - Indicates if duplicates are allowed in resulting
     * list (will result in linear runtime instead of constant one).
     * @returns Item with the appended target.
     */
    static arrayAppendAdd(
        item:Object, target:any, name:string, checkIfExists:boolean = true
    ):Object {
        if (item.hasOwnProperty(name)) {
            if (!(checkIfExists && item[name].includes(target)))
                item[name].push(target)
        } else
            item[name] = [target]
        return item
    }
    /**
     * Removes given target on given list.
     * @param list - Array to splice.
     * @param target - Target to remove from given list.
     * @param strict - Indicates weather to fire an exception if given target
     * doesn't exists given list.
     * @returns Item with the appended target.
     */
    static arrayRemove(
        list:?Array<any>, target:any, strict:boolean = false
    ):?Array<any> {
        if (Array.isArray(list)) {
            const index:number = list.indexOf(target)
            if (index === -1) {
                if (strict)
                    throw Error("Given target doesn't exists in given list.")
            } else
                /* eslint-disable max-statements-per-line */
                list.splice(index, 1)
                /* eslint-enable max-statements-per-line */
        } else if (strict)
            throw Error("Given target isn't an array.")
        return list
    }
    // / endregion
    // / region string
    // // region url handling
    /**
     * This method is intended for encoding *key* or *value* parts of query
     * component. We need a custom method because "encodeURIComponent()" is too
     * aggressive and encodes stuff that doesn't have to be encoded per
     * "http://tools.ietf.org/html/rfc3986:".
     * @param url - URL to encode.
     * @param encodeSpaces - Indicates weather given url should encode
     * whitespaces as "+" or "%20".
     * @returns Encoded given url.
     */
    static stringEncodeURIComponent(url:string, encodeSpaces:boolean):string {
        return encodeURIComponent(url).replace(/%40/gi, '@').replace(
            /%3A/gi, ':'
        ).replace(/%24/g, '$').replace(/%2C/gi, ',').replace(
            /%20/g, (encodeSpaces) ? '%20' : '+')
    }
    /**
     * Appends a path selector to the given path if there isn't one yet.
     * @param path - The path for appending a selector.
     * @param pathSeparator - The selector for appending to path.
     * @returns The appended path.
     */
    static stringAddSeparatorToPath(
        path:string, pathSeparator:string = '/'
    ):string {
        path = $.trim(path)
        if (path.substr(-1) !== pathSeparator && path.length)
            return path + pathSeparator
        return path
    }
    /**
     * Checks if given path has given path prefix.
     * @param prefix - Path prefix to search for.
     * @param path - Path to search in.
     * @param separator - Delimiter to use in path (default is the posix
     * conform slash).
     * @returns Value "true" if given prefix occur and "false" otherwise.
     */
    static stringHasPathPrefix(
        prefix:?string = '/admin',
        path:string = 'location' in context && location.pathname || '',
        separator:string = '/'
    ):boolean {
        if (typeof prefix === 'string') {
            if (!prefix.endsWith(separator))
                prefix += separator
            return path === prefix.substring(
                0, prefix.length - separator.length
            ) || path.startsWith(prefix)
        }
        return false
    }
    /**
     * Extracts domain name from given url. If no explicit domain name given
     * current domain name will be assumed. If no parameter given current
     * domain name will be determined.
     * @param url - The url to extract domain from.
     * @param fallback - The fallback host name if no one exits in given url
     * (default is current hostname).
     * @returns Extracted domain.
     */
    static stringGetDomainName(
        url:string = 'location' in context && location.href || '',
        fallback:any = 'location' in context && location.hostname || ''
    ):any {
        const result:Array<?string> =
            /^([a-z]*:?\/\/)?([^/]+?)(?::[0-9]+)?(?:\/.*|$)/i.exec(url)
        if (result && result.length > 2 && result[1] && result[2])
            return result[2]
        return fallback
    }
    /**
     * Extracts port number from given url. If no explicit port number given
     * and no fallback is defined current port number will be assumed for local
     * links. For external links 80 will be assumed for http protocol or 443
     * for https.
     * @param url - The url to extract port from.
     * @param fallback - Fallback port number if no explicit one was found.
     * Default is derived from current protocol name.
     * @param parameter - Additional parameter for checking if given url is an
     * internal url. Given url and this parameter will be forwarded to the
     * "stringIsInternalURL()" method.
     * @returns Extracted port number.
     */
    static stringGetPortNumber(
        url:string = 'location' in context && location.href || '',
        fallback:any = null, parameter:Array<string> = []
    ):number {
        const result:Array<?string> =
            /^(?:[a-z]*:?\/\/[^/]+?)?(?:[^/]+?):([0-9]+)/i.exec(url)
        if (result && result.length > 1)
            return parseInt(result[1], 10)
        if (fallback !== null)
            return fallback
        if (Tools.stringIsInternalURL.apply(
            this, [url].concat(parameter)
            ) && 'location' in context && location.port &&
            parseInt(location.port, 10)
        )
            return parseInt(location.port, 10)
        return (Tools.stringGetProtocolName(url) === 'https') ? 443 : 80
    }
    /**
     * Extracts protocol name from given url. If no explicit url is given,
     * current protocol will be assumed. If no parameter given current protocol
     * number will be determined.
     * @param url - The url to extract protocol from.
     * @param fallback - Fallback port to use if no protocol exists in given
     * url (default is current protocol).
     * returns Extracted protocol.
     */
    static stringGetProtocolName(
        url:string = 'location' in context && location.href || '',
        fallback:any = 'location' in context &&
            location.protocol.substring(0, location.protocol.length - 1) || ''
    ):any {
        const result:Array<?string> = /^([a-z]+):\/\//i.exec(url)
        if (result && result.length > 1 && result[1])
            return result[1]
        return fallback
    }
    /**
     * Read a page's GET URL variables and return them as an associative array
     * and preserves ordering.
     * @param keyToGet - If key given the corresponding value is returned and
     * full object otherwise.
     * @param givenInput - An alternative input to the url search parameter. If
     * "#" is given the complete current hash tag will be interpreted as url
     * and search parameter will be extracted from there. If "&" is given
     * classical search parameter and hash parameter will be taken in account.
     * If a search string is given this will be analyzed. The default is to
     * take given search part into account.
     * @param subDelimiter - Defines which sequence indicates the start of
     * parameter in a hash part of the url.
     * @param hashedPathIndicator - If defined and given hash starts with this
     * indicator given hash will be interpreted as path containing search and
     * hash parts.
     * @param givenSearch - Search part to take into account defaults to
     * current url search part.
     * @param givenHash - Hash part to take into account defaults to current
     * url hash part.
     * @returns Returns the current get array or requested value. If requested
     * key doesn't exist "undefined" is returned.
     */
    static stringGetURLVariable(
        keyToGet:string, givenInput:?string, subDelimiter:string = '$',
        hashedPathIndicator:string = '!', givenSearch:?string,
        givenHash:?string = 'location' in context && location.hash || ''
    ):Array<string>|string {
        // region set search and hash
        let hash:string = (givenHash) ? givenHash : '#'
        let search:string = ''
        if (givenSearch)
            search = givenSearch
        else if (hashedPathIndicator && hash.startsWith(hashedPathIndicator)) {
            const subHashStartIndex:number = hash.indexOf('#')
            let pathAndSearch:string
            if (subHashStartIndex === -1) {
                pathAndSearch = hash.substring(hashedPathIndicator.length)
                hash = ''
            } else {
                pathAndSearch = hash.substring(
                    hashedPathIndicator.length, subHashStartIndex)
                hash = hash.substring(subHashStartIndex)
            }
            const subSearchStartIndex:number = pathAndSearch.indexOf('?')
            if (subSearchStartIndex !== -1)
                search = pathAndSearch.substring(subSearchStartIndex)
        } else if ('location' in context)
            search = location.search || ''
        let input:string = (givenInput) ? givenInput : search
        // endregion
        // region determine data from search and hash if specified
        const both:boolean = input === '&'
        if (both || input === '#') {
            const decodedHash:string = decodeURIComponent(hash)
            const subDelimiterIndex:number = decodedHash.indexOf(subDelimiter)
            if (subDelimiterIndex === -1)
                input = ''
            else {
                input = decodedHash.substring(subDelimiterIndex)
                if (input.startsWith(subDelimiter))
                    input = input.substring(subDelimiter.length)
            }
        } else if (input.startsWith('?'))
            input = input.substring('?'.length)
        let data:Array<string> = (input) ? input.split('&') : []
        search = search.substring('?'.length)
        if (both && search)
            data = data.concat(search.split('&'))
        // endregion
        // region construct data structure
        const variables:Array<string> = []
        $.each(data, (key:string, value:string):void => {
            const keyValuePair:Array<string> = value.split('=')
            // IgnoreTypeCheck
            key = decodeURIComponent(keyValuePair[0])
            value = decodeURIComponent(keyValuePair[1])
            variables.push(key)
            variables[key] = value
        })
        // endregion
        if (keyToGet)
            // IgnoreTypeCheck
            return variables[keyToGet]
        return variables
    }
    /**
     * Checks if given url points to another domain than second given url. If
     * no second given url provided current url will be assumed.
     * @param firstURL - URL to check against second url.
     * @param secondURL - URL to check against first url.
     * @returns Returns "true" if given first url has same domain as given
     * second (or current).
     */
    static stringIsInternalURL(
        firstURL:string, secondURL:string = 'location' in context &&
        location.href || ''
    ):boolean {
        const explicitDomainName:string = Tools.stringGetDomainName(
            firstURL, false)
        const explicitProtocolName:string = Tools.stringGetProtocolName(
            firstURL, false)
        const explicitPortNumber = Tools.stringGetPortNumber(firstURL, false)
        return (
            !explicitDomainName ||
            explicitDomainName === Tools.stringGetDomainName(secondURL)
        ) && (
            !explicitProtocolName ||
            explicitProtocolName === Tools.stringGetProtocolName(secondURL)
        ) && (
            !explicitPortNumber ||
            explicitPortNumber === Tools.stringGetPortNumber(secondURL))
    }
    /**
     * Normalized given website url.
     * @param url - Uniform resource locator to normalize.
     * @returns Normalized result.
     */
    static stringNormalizeURL(url:?string):string {
        if (url) {
            url = $.trim(url.replace(/^:?\/+/, '').replace(/\/+$/, ''))
            if (url.startsWith('http'))
                return url
            return `http://${url}`
        }
        return ''
    }
    /**
     * Represents given website url.
     * @param url - Uniform resource locator to represent.
     * @returns Represented result.
     */
    static stringRepresentURL(url:?string):string {
        if (typeof url === 'string')
            return $.trim(url.replace(/^(https?)?:?\/+/, '').replace(
                /\/+$/, ''))
        return ''
    }
    // // endregion
    /* eslint-disable jsdoc/require-description-complete-sentence */
    /**
     * Converts a camel cased string to its delimited string version.
     * @param string - The string to format.
     * @param delimiter - Delimiter string
     * @param abbreviations - Collection of shortcut words to represent upper
     * cased.
     * @returns The formatted string.
     */
    static stringCamelCaseToDelimited(
        string:string, delimiter:string = '-',
        abbreviations:?Array<string> = null
    ):string {
    /* eslint-enable jsdoc/require-description-complete-sentence */
        if (!abbreviations)
            abbreviations = Tools.abbreviations
        const escapedDelimiter:string =
            Tools.stringGetRegularExpressionValidated(delimiter)
        if (abbreviations.length) {
            let abbreviationPattern:string = ''
            for (const abbreviation:string of abbreviations) {
                if (abbreviationPattern)
                    abbreviationPattern += '|'
                abbreviationPattern += abbreviation.toUpperCase()
            }
            string = string.replace(new RegExp(
                `(${abbreviationPattern})(${abbreviationPattern})`, 'g'
            ), `$1${delimiter}$2`)
        }
        string = string.replace(new RegExp(
            `([^${escapedDelimiter}])([A-Z][a-z]+)`, 'g'
        ), `$1${delimiter}$2`)
        return string.replace(
            new RegExp('([a-z0-9])([A-Z])', 'g'), `$1${delimiter}$2`
        ).toLowerCase()
    }
    /* eslint-disable jsdoc/require-description-complete-sentence */
    /**
     * Converts a string to its capitalize representation.
     * @param string - The string to format.
     * @returns The formatted string.
     */
    static stringCapitalize(string:string):string {
    /* eslint-enable jsdoc/require-description-complete-sentence */
        return string.charAt(0).toUpperCase() + string.substring(1)
    }
    /**
     * Converts a delimited string to its camel case representation.
     * @param string - The string to format.
     * @param delimiter - Delimiter string to use.
     * @param abbreviations - Collection of shortcut words to represent upper
     * cased.
     * @param preserveWrongFormattedAbbreviations - If set to "True" wrong
     * formatted camel case abbreviations will be ignored.
     * @param removeMultipleDelimiter - Indicates weather a series of delimiter
     * should be consolidated.
     * @returns The formatted string.
     */
    static stringDelimitedToCamelCase(
        string:string, delimiter:string = '-',
        abbreviations:?Array<string> = null,
        preserveWrongFormattedAbbreviations:boolean = false,
        removeMultipleDelimiter:boolean = false
    ):string {
        let escapedDelimiter:string =
            Tools.stringGetRegularExpressionValidated(delimiter)
        if (!abbreviations)
            abbreviations = Tools.abbreviations
        let abbreviationPattern:string
        if (preserveWrongFormattedAbbreviations)
            abbreviationPattern = abbreviations.join('|')
        else {
            abbreviationPattern = ''
            for (const abbreviation:string of abbreviations) {
                if (abbreviationPattern)
                    abbreviationPattern += '|'
                abbreviationPattern +=
                    `${Tools.stringCapitalize(abbreviation)}|${abbreviation}`
            }
        }
        let stringStartsWithDelimiter:boolean = false
        if (string.startsWith(delimiter)) {
            string = string.substring(delimiter.length)
            stringStartsWithDelimiter = true
        }
        string = string.replace(new RegExp(
            `(${escapedDelimiter})(${abbreviationPattern})` +
            `(${escapedDelimiter}|$)`, 'g'
        ), (
            fullMatch:string, before:string, abbreviation:string, after:string
        ):string => before + abbreviation.toUpperCase() + after)
        if (removeMultipleDelimiter)
            escapedDelimiter = `(?:${escapedDelimiter})+`
        string = string.replace(new RegExp(
            `${escapedDelimiter}([a-zA-Z0-9])`, 'g'
        ), (fullMatch:string, firstLetter:string):string =>
            firstLetter.toUpperCase())
        if (stringStartsWithDelimiter)
            string = delimiter + string
        return string
    }
    /**
     * Performs a string formation. Replaces every placeholder "{i}" with the
     * i'th argument.
     * @param string - The string to format.
     * @param additionalArguments - Additional arguments are interpreted as
     * replacements for string formating.
     * @returns The formatted string.
     */
    static stringFormat(
        string:string, ...additionalArguments:Array<any>
    ):string {
        additionalArguments.unshift(string)
        $.each(additionalArguments, (
            index:number, value:string|number
        ):void => {
            string = string.replace(
                new RegExp(`\\{${index}\\}`, 'gm'), `${value}`)
        })
        return string
    }
    /**
     * Validates the current string for using in a regular expression pattern.
     * Special regular expression chars will be escaped.
     * @param string - The string to format.
     * @returns The formatted string.
     */
    static stringGetRegularExpressionValidated(string:string):string {
        return string.replace(/([\\|.*$^+[\]()?\-{}])/g, '\\$1')
    }
    /**
     * Converts a string to its lower case representation.
     * @param string - The string to format.
     * @returns The formatted string.
     */
    static stringLowerCase(string:string):string {
        return string.charAt(0).toLowerCase() + string.substring(1)
    }
    /**
     * Wraps given mark strings in given target with given marker.
     * @param target - String to search for marker.
     * @param mark - String to search in target for.
     * @param marker - HTML template string to mark.
     * @param caseSensitive - Indicates weather case takes a role during
     * searching.
     * @returns Processed result.
     */
    static stringMark(
        target:?string, mark:?string,
        marker:string = '<span class="tools-mark">{1}</span>',
        caseSensitive:boolean = false
    ):?string {
        target = $.trim(target)
        mark = $.trim(mark)
        if (target && mark) {
            let offset:number = 0
            let searchTarget:string = target
            if (!caseSensitive)
                searchTarget = searchTarget.toLowerCase()
            if (!caseSensitive)
                mark = mark.toLowerCase()
            while (true) {
                const index:number = searchTarget.indexOf(mark, offset)
                if (index === -1)
                    break
                else {
                    target = target.substring(0, index) + Tools.stringFormat(
                        marker, target.substr(index, mark.length)
                    ) + target.substring(index + mark.length)
                    if (!caseSensitive)
                        searchTarget = target.toLowerCase()
                    offset = index + (
                        marker.length - '{1}'.length
                    ) + mark.length
                }
            }
        }
        return target
    }
    /**
     * Implements the md5 hash algorithm.
     * @param value - Value to calculate md5 hash for.
     * @param onlyAscii - Set to true if given input has ascii characters only
     * to get more performance.
     * @returns Calculated md5 hash value.
     */
    static stringMD5(value:string, onlyAscii:boolean = false):string {
        const hexCharacters:Array<string> = '0123456789abcdef'.split('')
        // region sub helper
        /**
         * This function is much faster, so if possible we use it. Some IEs
         * are the only ones I know of that need the idiotic second function,
         * generated by an if clause in the end.
         * @param first - First operand to add.
         * @param second - Second operant to add.
         * @returns The sum of both given operands.
        */
        let unsignedModule2PowerOf32Addition = (
            first:number, second:number
        ):number => (first + second) & 0xFFFFFFFF
        // / region primary functions needed for the algorithm
        /*
         * Implements the basic operation for each round of the algorithm.
         */
        const cmn = (
            q:number, a:number, b:number, x:number, s:number, t:number
        ):number => {
            a = unsignedModule2PowerOf32Addition(
                unsignedModule2PowerOf32Addition(a, q),
                unsignedModule2PowerOf32Addition(x, t))
            return unsignedModule2PowerOf32Addition(
                (a << s) | (a >>> (32 - s)), b)
        }
        /**
         * First algorithm part.
         * @param a - Operand.
         * @param b - Operand.
         * @param c - Operand.
         * @param d - Operand.
         * @param x - Operand.
         * @param s - Operand.
         * @param t - Operand.
         * @returns Result.
         */
        const ff = (
            a:number, b:number, c:number, d:number, x:number, s:number,
            t:number
        ):number => cmn((b & c) | ((~b) & d), a, b, x, s, t)
        /**
         * Second algorithm part.
         * @param a - Operand.
         * @param b - Operand.
         * @param c - Operand.
         * @param d - Operand.
         * @param x - Operand.
         * @param s - Operand.
         * @param t - Operand.
         * @returns Result.
         */
        const gg = (
            a:number, b:number, c:number, d:number, x:number, s:number,
            t:number
        ):number => cmn((b & d) | (c & (~d)), a, b, x, s, t)
        /**
         * Third algorithm part.
         * @param a - Operand.
         * @param b - Operand.
         * @param c - Operand.
         * @param d - Operand.
         * @param x - Operand.
         * @param s - Operand.
         * @param t - Operand.
         * @returns Result.
         */
        const hh = (
            a:number, b:number, c:number, d:number, x:number, s:number,
            t:number
        ):number => cmn(b ^ c ^ d, a, b, x, s, t)
        /**
         * Fourth algorithm part.
         * @param a - Operand.
         * @param b - Operand.
         * @param c - Operand.
         * @param d - Operand.
         * @param x - Operand.
         * @param s - Operand.
         * @param t - Operand.
         * @returns Result.
         */
        const ii = (
            a:number, b:number, c:number, d:number, x:number, s:number,
            t:number
        ):number => cmn(c ^ (b | (~d)), a, b, x, s, t)
        /**
         * Performs all 16 needed steps.
         * @param state - Current state.
         * @param blocks - Blocks to cycle through.
         * @returns Returns given state.
         */
        const cycle = (state:Array<any>, blocks:Array<any>):Array<any> => {
            let a:any = state[0]
            let b:any = state[1]
            let c:any = state[2]
            let d:any = state[3]
            // region round 1
            a = ff(a, b, c, d, blocks[0], 7, -680876936)
            d = ff(d, a, b, c, blocks[1], 12, -389564586)
            c = ff(c, d, a, b, blocks[2], 17, 606105819)
            b = ff(b, c, d, a, blocks[3], 22, -1044525330)

            a = ff(a, b, c, d, blocks[4], 7, -176418897)
            d = ff(d, a, b, c, blocks[5], 12, 1200080426)
            c = ff(c, d, a, b, blocks[6], 17, -1473231341)
            b = ff(b, c, d, a, blocks[7], 22, -45705983)

            a = ff(a, b, c, d, blocks[8], 7, 1770035416)
            d = ff(d, a, b, c, blocks[9], 12, -1958414417)
            c = ff(c, d, a, b, blocks[10], 17, -42063)
            b = ff(b, c, d, a, blocks[11], 22, -1990404162)

            a = ff(a, b, c, d, blocks[12], 7, 1804603682)
            d = ff(d, a, b, c, blocks[13], 12, -40341101)
            c = ff(c, d, a, b, blocks[14], 17, -1502002290)
            b = ff(b, c, d, a, blocks[15], 22, 1236535329)
            // endregion
            // region round 2
            a = gg(a, b, c, d, blocks[1], 5, -165796510)
            d = gg(d, a, b, c, blocks[6], 9, -1069501632)
            c = gg(c, d, a, b, blocks[11], 14, 643717713)
            b = gg(b, c, d, a, blocks[0], 20, -373897302)

            a = gg(a, b, c, d, blocks[5], 5, -701558691)
            d = gg(d, a, b, c, blocks[10], 9, 38016083)
            c = gg(c, d, a, b, blocks[15], 14, -660478335)
            b = gg(b, c, d, a, blocks[4], 20, -405537848)

            a = gg(a, b, c, d, blocks[9], 5, 568446438)
            d = gg(d, a, b, c, blocks[14], 9, -1019803690)
            c = gg(c, d, a, b, blocks[3], 14, -187363961)
            b = gg(b, c, d, a, blocks[8], 20, 1163531501)

            a = gg(a, b, c, d, blocks[13], 5, -1444681467)
            d = gg(d, a, b, c, blocks[2], 9, -51403784)
            c = gg(c, d, a, b, blocks[7], 14, 1735328473)
            b = gg(b, c, d, a, blocks[12], 20, -1926607734)
            // endregion
            // region round 3
            a = hh(a, b, c, d, blocks[5], 4, -378558)
            d = hh(d, a, b, c, blocks[8], 11, -2022574463)
            c = hh(c, d, a, b, blocks[11], 16, 1839030562)
            b = hh(b, c, d, a, blocks[14], 23, -35309556)

            a = hh(a, b, c, d, blocks[1], 4, -1530992060)
            d = hh(d, a, b, c, blocks[4], 11, 1272893353)
            c = hh(c, d, a, b, blocks[7], 16, -155497632)
            b = hh(b, c, d, a, blocks[10], 23, -1094730640)

            a = hh(a, b, c, d, blocks[13], 4, 681279174)
            d = hh(d, a, b, c, blocks[0], 11, -358537222)
            c = hh(c, d, a, b, blocks[3], 16, -722521979)
            b = hh(b, c, d, a, blocks[6], 23, 76029189)

            a = hh(a, b, c, d, blocks[9], 4, -640364487)
            d = hh(d, a, b, c, blocks[12], 11, -421815835)
            c = hh(c, d, a, b, blocks[15], 16, 530742520)
            b = hh(b, c, d, a, blocks[2], 23, -995338651)
            // endregion
            // region round 4
            a = ii(a, b, c, d, blocks[0], 6, -198630844)
            d = ii(d, a, b, c, blocks[7], 10, 1126891415)
            c = ii(c, d, a, b, blocks[14], 15, -1416354905)
            b = ii(b, c, d, a, blocks[5], 21, -57434055)

            a = ii(a, b, c, d, blocks[12], 6, 1700485571)
            d = ii(d, a, b, c, blocks[3], 10, -1894986606)
            c = ii(c, d, a, b, blocks[10], 15, -1051523)
            b = ii(b, c, d, a, blocks[1], 21, -2054922799)

            a = ii(a, b, c, d, blocks[8], 6, 1873313359)
            d = ii(d, a, b, c, blocks[15], 10, -30611744)
            c = ii(c, d, a, b, blocks[6], 15, -1560198380)
            b = ii(b, c, d, a, blocks[13], 21, 1309151649)

            a = ii(a, b, c, d, blocks[4], 6, -145523070)
            d = ii(d, a, b, c, blocks[11], 10, -1120210379)
            c = ii(c, d, a, b, blocks[2], 15, 718787259)
            b = ii(b, c, d, a, blocks[9], 21, -343485551)
            // endregion
            state[0] = unsignedModule2PowerOf32Addition(a, state[0])
            state[1] = unsignedModule2PowerOf32Addition(b, state[1])
            state[2] = unsignedModule2PowerOf32Addition(c, state[2])
            state[3] = unsignedModule2PowerOf32Addition(d, state[3])
            return state
        }
        // / endregion
        /**
         * Converts given character to its corresponding hex code
         * representation.
         * @param character - Character to convert.
         * @returns Converted hex code string.
         */
        const convertCharactorToHexCode = (character:any):string => {
            let hexString:string = ''
            for (let round:number = 0; round < 4; round++)
                hexString += hexCharacters[(character >> (
                    round * 8 + 4
                )) & 0x0F] + hexCharacters[(character >> (round * 8)) & 0x0F]
            return hexString
        }
        /**
         * Converts given byte array to its corresponding hex code as string.
         * @param value - Array of characters to convert.
         * @returns Converted hex code.
         */
        const convertToHexCode = (value:Array<any>):string => {
            for (let index:number = 0; index < value.length; index++)
                value[index] = convertCharactorToHexCode(value[index])
            return value.join('')
        }
        /**
         * There needs to be support for unicode here, unless we pretend that
         * we can redefine the md5 algorithm for multi-byte characters
         * (perhaps by adding every four 16-bit characters and shortening the
         * sum to 32 bits). Otherwise I suggest performing md5 as if every
         * character was two bytes--e.g., 0040 0025 = @%--but then how will an
         * ordinary md5 sum be matched? There is no way to standardize text
         * to something like utf-8 before transformation; speed cost is
         * utterly prohibitive. The JavaScript standard itself needs to look
         * at this: it should start providing access to strings as preformed
         * utf-8 8-bit unsigned value arrays.
         * @param value - Value to process with each block.
         * @returns Converted byte array.
         */
        const handleBlock = (value:string):Array<any> => {
            const blocks:Array<any> = []
            for (
                let blockNumber:number = 0; blockNumber < 64; blockNumber += 4
            )
                blocks[blockNumber >> 2] = value.charCodeAt(blockNumber) + (
                    value.charCodeAt(blockNumber + 1) << 8
                ) + (value.charCodeAt(blockNumber + 2) << 16) + (
                    value.charCodeAt(blockNumber + 3) << 24)
            return blocks
        }
        // endregion
        /**
         * Triggers the main algorithm to calculate the md5 representation of
         * given value.
         * @param value - String to convert to its md5 representation.
         * @returns Array of blocks.
         */
        const main = (value:string):Array<any> => {
            const length:number = value.length
            const state:Array<any> = [
                1732584193, -271733879, -1732584194, 271733878]
            let blockNumber:number
            for (
                blockNumber = 64; blockNumber <= value.length;
                blockNumber += 64
            )
                cycle(state, handleBlock(value.substring(
                    blockNumber - 64, blockNumber)))
            value = value.substring(blockNumber - 64)
            const tail:Array<number> = [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            for (blockNumber = 0; blockNumber < value.length; blockNumber++)
                tail[blockNumber >> 2] |= value.charCodeAt(blockNumber) << ((
                    blockNumber % 4
                ) << 3)
            tail[blockNumber >> 2] |= 0x80 << ((blockNumber % 4) << 3)
            if (blockNumber > 55) {
                cycle(state, tail)
                for (let index:number = 0; index < 16; index++)
                    tail[index] = 0
            }
            tail[14] = length * 8
            cycle(state, tail)
            return state
        }
        // region final call
        if (convertToHexCode(main(
            'hello'
        )) !== '5d41402abc4b2a76b9719d911017c592')
            /**
             * This function is much faster, so if possible we use it. Some IEs
             * are the only ones I know of that need the idiotic second
             * function, generated by an if clause in the end.
             * @private
             * @param first - First operand to add.
             * @param second - Second operant to add.
             * @returns The sum of both given operands.
            */
            unsignedModule2PowerOf32Addition = (
                first:number, second:number
            ):number => {
                const lsw = (first & 0xFFFF) + (second & 0xFFFF)
                const msw = (first >> 16) + (second >> 16) + (lsw >> 16)
                return (msw << 16) | (lsw & 0xFFFF)
            }
        // IgnoreTypeCheck
        return convertToHexCode(main((onlyAscii) ? value : unescape(
            encodeURIComponent(value))))
        // endregion
    }
    /**
     * Normalizes given phone number for automatic dialing mechanisms.
     * @param phoneNumber - Number to normalize.
     * @returns Normalized number.
     */
    static stringNormalizePhoneNumber(phoneNumber:?string|?number):string {
        if (typeof phoneNumber === 'string' || typeof phoneNumber === 'number')
            return `${phoneNumber}`.replace(/[^0-9]*\+/, '00').replace(
                /[^0-9]+/g, '')
        return ''
    }
    /**
     * Represents given phone number. NOTE: Currently only support german phone
     * numbers.
     * @param phoneNumber - Number to format.
     * @returns Formatted number.
     */
    static stringRepresentPhoneNumber(phoneNumber:?string|?number):string {
        if (['number', 'string'].includes($.type(
            phoneNumber
        )) && phoneNumber) {
            // Represent country code and leading area code zero.
            phoneNumber = `${phoneNumber}`.replace(
                /^(00|\+)([0-9]+)-([0-9-]+)$/, '+$2 (0) $3')
            // Add German country code if not exists.
            phoneNumber = phoneNumber.replace(
                /^0([1-9][0-9-]+)$/, '+49 (0) $1')
            // Separate area code from base number.
            phoneNumber = phoneNumber.replace(/^([^-]+)-([0-9-]+)$/, '$1 / $2')
            // Partition base number in one triple and tuples or tuples only.
            return $.trim(phoneNumber.replace(/^(.*?)([0-9]+)(-?[0-9]*)$/, (
                match:string, prefix:string, number:string, suffix:string
            ):string => prefix + $.trim(
                (number.length % 2 === 0) ? number.replace(
                    /([0-9]{2})/g, '$1 '
                ) : number.replace(/^([0-9]{3})([0-9]+)$/, (
                    match:string, triple:string, rest:string
                ):string => `${triple} ` + $.trim(rest.replace(
                    /([0-9]{2})/g, '$1 '
                ))) + suffix)))
        }
        return ''
    }
    /**
     * Decodes all html symbols in text nodes in given html string.
     * @param htmlString - HTML string to decode.
     * @returns Decoded html string.
     */
    static stringDecodeHTMLEntities(htmlString:string):?string {
        if ('document' in context) {
            const textareaDomNode = context.document.createElement('textarea')
            textareaDomNode.innerHTML = htmlString
            return textareaDomNode.value
        }
        return null
    }
    // / endregion
    // / region number
    /**
     * Checks if given object is java scripts native "Number.NaN" object.
     * @param object - Object to Check.
     * @returns Returns weather given value is not a number or not.
     */
    static numberIsNotANumber(object:any):boolean {
        return $.type(object) === 'number' && isNaN(object)
    }
    /**
     * Rounds a given number accurate to given number of digits.
     * @param number - The number to round.
     * @param digits - The number of digits after comma.
     * @returns Returns the rounded number.
     */
    static numberRound(number:number, digits:number = 0):number {
        return Math.round(number * Math.pow(10, digits)) / Math.pow(10, digits)
    }
    // / endregion
    // / region data transfer
    /**
     * Send given data to a given iframe.
     * @param target - Name of the target iframe or the target iframe itself.
     * @param url - URL to send to data to.
     * @param data - Data holding object to send data to.
     * @param requestType - The forms action attribute value. If nothing is
     * provided "post" will be used as default.
     * @param removeAfterLoad - Indicates if created iframe should be removed
     * right after load event. Only works if an iframe object is given instead
     * of a simple target name.
     * @returns Returns the given target.
     */
    static sendToIFrame(
        target:$DomNode|string, url:string, data:{[key:string]:any},
        requestType:string = 'post', removeAfterLoad:boolean = false
    ):string {
        const targetName:string = typeof target === 'string' ? target :
            target.attr('name')
        const $formDomNode:$DomNode = $('<form>').attr({
            action: url,
            method: requestType,
            target: targetName
        })
        for (const name:string in data)
            if (data.hasOwnProperty(name))
                $formDomNode.append($('<input>').attr({
                    type: 'hidden',
                    name,
                    value: data[name]
                }))
        $formDomNode.submit().remove()
        if (removeAfterLoad && typeof target === 'object' && 'on' in target)
            // IgnoreTypeCheck
            target.on('load', ():$DomNode => target.remove())
        return targetName
    }
    /**
     * Send given data to a temporary created iframe.
     * @param url - URL to send to data to.
     * @param data - Data holding object to send data to.
     * @param requestType - The forms action attribute value. If nothing is
     * provided "post" will be used as default.
     * @param removeAfterLoad - Indicates if created iframe should be removed
     * right after load event.
     * @returns Returns the dynamically created iframe.
     */
    sendToExternalURL(
        url:string, data:{[key:string]:any}, requestType:string = 'post',
        removeAfterLoad:boolean = true
    ):string {
        const $iFrameDomNode:$DomNode = $('<iframe>').attr(
            'name', this.constructor._name.charAt(0).toLowerCase() +
            this.constructor._name.substring(1) + (new Date()).getTime()
        ).hide()
        this.$domNode.after($iFrameDomNode)
        return this.constructor.sendToIFrame(
            $iFrameDomNode, url, data, requestType, removeAfterLoad)
    }
    // / endregion
    // endregion
    // region protected
    /* eslint-disable jsdoc/require-description-complete-sentence */
    /**
     * Helper method for attach event handler methods and their event handler
     * remove pendants.
     * @param parameter - Arguments object given to methods like "bind()" or
     * "unbind()".
     * @param removeEvent - Indicates if "unbind()" or "bind()" was given.
     * @param eventFunctionName - Name of function to wrap.
     * @returns Returns $'s wrapped dom node.
     */
    _bindHelper(
        parameter:Array<any>, removeEvent:boolean = false,
        eventFunctionName:string = 'on'
    ):$DomNode {
    /* eslint-enable jsdoc/require-description-complete-sentence */
        const $domNode:$DomNode = $(parameter[0])
        if ($.type(parameter[1]) === 'object' && !removeEvent) {
            $.each(parameter[1], (
                eventType:string, handler:Function
            ):$DomNode =>
                // IgnoreTypeCheck
                this[eventFunctionName]($domNode, eventType, handler))
            return $domNode
        }
        parameter = this.constructor.argumentsObjectToArray(parameter).slice(1)
        if (parameter.length === 0)
            parameter.push('')
        if (!parameter[0].includes('.'))
            parameter[0] += `.${this.constructor._name}`
        if (removeEvent)
            return $domNode[eventFunctionName].apply($domNode, parameter)
        return $domNode[eventFunctionName].apply($domNode, parameter)
    }
    /**
     * Converts a dom selector to a prefixed dom selector string.
     * @param key - Current element in options array to grab.
     * @param selector - A dom node selector.
     * @param domNodeSelectors - An object with dom node selectors.
     * @returns Returns given selector prefixed.
     */
    _grabDomNodeHelper(
        key:string, selector:string, domNodeSelectors:{[key:string]:string}
    ):string {
        let domNodeSelectorPrefix:string = ''
        if (this._options.domNodeSelectorPrefix)
            domNodeSelectorPrefix = `${this._options.domNodeSelectorPrefix} `
        if (!(selector.startsWith(domNodeSelectorPrefix) || $.trim(
            selector
        ).startsWith('<'))) {
            domNodeSelectors[key] = domNodeSelectorPrefix + selector
            return $.trim(domNodeSelectors[key])
        }
        return $.trim(selector)
    }
    // endregion
}
// endregion
// region handle $ extending
if ('fn' in $)
    $.fn.Tools = function():any {
        return (new Tools()).controller(Tools, arguments, this)
    }
$.Tools = function():any {
    return (new Tools()).controller(Tools, arguments)
}
$.Tools.class = Tools
// / region prop fix for comments and text nodes
if ('fn' in $) {
    const nativePropFunction = $.fn.prop
    /**
     * JQuery's native prop implementation ignores properties for text nodes,
     * comments and attribute nodes.
     * @param key - Name of property to retrieve from current dom node.
     * @param value - Value to set for given property by name.
     * @returns Returns value if used as getter or current dom node if used as
     * setter.
     */
    $.fn.prop = function(key:string, value:any):any {
        if (arguments.length < 3 && this.length && [
            '#text', '#comment'
        ].includes(this[0].nodeName) && key in this[0]) {
            if (arguments.length === 1)
                return this[0][key]
            if (arguments.length === 2) {
                this[0][key] = value
                return this
            }
        }
        return nativePropFunction.apply(this, arguments)
    }
}
// / endregion
// endregion
/** The jQuery-tools plugin class. */
export default Tools
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
