#!/usr/bin/env coffee
# -*- coding: utf-8 -*-

# region header

###
[Project page](https://thaibault.github.com/jQuery-tools)

This module provides common reusable logic for every non trivial jQuery plugin.

Copyright Torben Sickert 16.12.2012

License
-------

This library written by Torben Sickert stand under a creative commons naming
3.0 unported license. see http://creativecommons.org/licenses/by/3.0/deed.de

Extending this module
---------------------

For conventions see require on https://github.com/thaibault/require

Author
------

t.sickert["~at~"]gmail.com (Torben Sickert)

Version
-------

1.0 stable
###

main = ($) ->

# endregion

# region plugins/classes

    class Tools
        ###
            This plugin provides such interface logic like generic controller
            logic for integrating plugins into $, mutual exclusion for
            depending gui elements, logging additional string, array or
            function handling. A set of helper functions to parse option
            objects dom trees or handle events is also provided.
        ###

    # region properties

        ###
            **self {Tools}**
            Saves a reference to this class useful for introspection.
        ###
        self: this
        ###
            **keyCode {Object}**
            Saves a mapping from key codes to their corresponding name.
        ###
        keyCode:
            BACKSPACE: 8, COMMA: 188, DELETE: 46, DOWN: 40, END: 35, ENTER: 13
            ESCAPE: 27, HOME: 36, LEFT: 37, NUMPAD_ADD: 107,
            NUMPAD_DECIMAL: 110, NUMPAD_DIVIDE: 111, NUMPAD_ENTER: 108
            NUMPAD_MULTIPLY: 106, NUMPAD_SUBTRACT: 109, PAGE_DOWN: 34
            PAGE_UP: 33, PERIOD: 190, RIGHT: 39, SPACE: 32, TAB: 9, UP: 38
        ###Saves currently minimal supported internet explorer version.###
        maximalSupportedInternetExplorerVersion: do ->
            ###Returns zero if no internet explorer present.###
            div = document.createElement 'div'
            for version in [0...9]
                # NOTE: We split html comment sequences to avoid wrong
                # interpretation if this code is embedded in markup.
                # NOTE: Internet Explorer 9 and lower sometimes doesn't
                # understand conditional comments wich doesn't starts with a
                # whitespace. If the conditional markup isn't in a commend.
                # Otherwise there shouldn't be any whitespace!
                div.innerHTML = (
                    '<!' + "--[if gt IE #{version}]><i></i><![e" + 'ndif]-' +
                    '->')
                if not div.getElementsByTagName('i').length
                    break
            if not version
                # Try special detection for internet explorer 10 and 11.
                if window.navigator.appVersion.indexOf('MSIE 10') isnt -1
                    return 10
                else if window.navigator.userAgent.indexOf(
                    'Trident'
                ) isnt -1 and window.navigator.userAgent.indexOf(
                    'rv:11'
                ) isnt -1
                    return 11
            version
        ###
            **_consoleMethods {String[]}**
            This variable contains a collection of methods usually binded to
            the console object.
        ###
        _consoleMethods: [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time',
            'timeEnd', 'timeStamp', 'trace', 'warn']
        ###
            **_javaScriptDependentContentHandled {Boolean}**
            Indicates weather javaScript dependent content where hide or shown.
        ###
        _javaScriptDependentContentHandled: false
        ###
            **__tools__ {Boolean}**
            Indicates if an instance was derived from this class.
        ###
        __tools__: true
        ###
            **__name__ {String}**
            Holds the class name to provide inspection features.
        ###
        __name__: 'Tools'

    # endregion

    # region public methods

        # region special

        constructor: (
            @$domNode=null, @_options={}, @_defaultOptions={
                logging: false, domNodeSelectorPrefix: 'body',
                domNode:
                    hideJavaScriptEnabled:
                        '.tools-hidden-on-javascript-enabled'
                    showJavaScriptEnabled:
                        '.tools-visible-on-javascript-enabled'
            }, @_locks={}
        ) ->
            ###
                This method should be overwritten normally. It is triggered if
                current object is created via the "new" keyword.

                The dom node selector prefix enforces to not globally select
                any dom nodes which aren't in the expected scope of this
                plugin. "{1}" will be automatically replaced with this plugin
                name suffix ("incrementer"). You don't have to use "{1}" but it
                can help you to write code which is more reconcilable with the
                dry concept.

                **returns {$.Tools}** Returns the current instance.
            ###
            # Avoid errors in browsers that lack a console.
            for method in this._consoleMethods
                window.console = {} if not window.console?
                # Only stub the $ empty method.
                console[method] = $.noop() if not window.console[method]?
            if not this.self::_javaScriptDependentContentHandled
                this.self::_javaScriptDependentContentHandled = true
                $(
                    this._defaultOptions.domNodeSelectorPrefix + ' ' +
                    this._defaultOptions.domNode.hideJavaScriptEnabled
                ).filter(->
                    not $(this).data 'javaScriptDependentContentHide'
                ).data('javaScriptDependentContentHide', true).hide()
                $(
                    this._defaultOptions.domNodeSelectorPrefix + ' ' +
                    this._defaultOptions.domNode.showJavaScriptEnabled
                ).filter(->
                    not $(this).data 'javaScriptDependentContentShow'
                ).data('javaScriptDependentContentShow', true).show()
            # NOTE: A constructor doesn't return last statement by default.
            return this
        destructor: ->
            ###
                This method could be overwritten normally. It acts like a
                destructor.

                **returns {$.Tools}** - Returns the current instance.
            ###
            this.off '*'
            this
        initialize: (options={}) ->
            ###
                This method should be overwritten normally. It is triggered if
                current object was created via the "new" keyword and is called
                now.

                **options {Object}**  - options An options object.

                **returns {$.Tools}** - Returns the current instance.
            ###
            # NOTE: We have to create a new options object instance to
            # avoid changing a static options object.
            this._options = $.extend(
                true, {}, this._defaultOptions, this._options, options)
            # The selector prefix should be parsed after extending options
            # because the selector would be overwritten otherwise.
            this._options.domNodeSelectorPrefix = this.stringFormat(
                this._options.domNodeSelectorPrefix
                this.stringCamelCaseToDelimited this.__name__)
            this

        # endregion

        # region object orientation

        controller: (object, parameter, $domNode=null) ->
            ###
                Defines a generic controller for $ plugins.

                **object {Object|String}** - The object or class to control. If
                                             "object" is a class an instance
                                             will be generated.

                **parameter {Arguments}**  - The initially given arguments
                                             object.

                **returns {Mixed}**        - Returns whatever the initializer
                                             method returns.
            ###
            parameter = this.argumentsObjectToArray parameter
            if not object.__name__?
                object = new object $domNode
                if not object.__tools__?
                    object = $.extend true, new Tools, object
            if $domNode? and not $domNode.data object.__name__
                # Attach extended object to the associated dom node.
                $domNode.data object.__name__, object
            if object[parameter[0]]?
                return object[parameter[0]].apply object, parameter.slice 1
            else if not parameter.length or $.type(parameter[0]) is 'object'
                ###
                    If an options object or no method name is given the
                    initializer will be called.
                ###
                return object.initialize.apply object, parameter
            $.error(
                "Method \"#{parameter[0]}\" does not exist on $-extension " +
                "#{object.__name__}\".")

        # endregion

        # region mutual exclusion

        acquireLock: (description, callbackFunction, autoRelease=false) ->
            ###
                Calling this method introduces a starting point for a critical
                area with potential race conditions. The area will be binded to
                given description string. So don't use same names for different
                areas.

                **description {String}**        - A short string describing the
                                                  critical areas properties.

                **callbackFunction {Function}** - A procedure which should only
                                                  be executed if the
                                                  interpreter isn't in the
                                                  given critical area. The lock
                                                  description string will be
                                                  given to the callback
                                                  function.

                **autoRelease {Boolean}**       - Release the lock after
                                                  execution of given callback.

                **returns {$.Tools}**           - Returns the current instance.
            ###
            wrappedCallbackFunction = (description) =>
                callbackFunction description
                this.releaseLock(description) if autoRelease
            if this._locks[description]?
                this._locks[description].push wrappedCallbackFunction
            else
                this._locks[description] = []
                wrappedCallbackFunction description
            this
        releaseLock: (description) ->
            ###
                Calling this method  causes the given critical area to be
                finished and all functions given to "this.acquireLock()" will
                be executed in right order.

                **description {String}** - A short string describing the
                                           critical areas properties.

                **returns {$.Tools}**    - Returns the current instance.
            ###
            if this._locks[description]?
                if this._locks[description].length
                    this._locks[description].shift() description
                else
                    delete this._locks[description]
            this

        # endregion

        # region language fixes

        mouseOutEventHandlerFix: (eventHandler) ->
            ###
                This method fixes an ugly javaScript bug. If you add a mouseout
                event listener to a dom node the given handler will be called
                each time any dom node inside the observed dom node triggers a
                mouseout event. This methods guarantees that the given event
                handler is only called if the observed dom node was leaved.

                **eventHandler {Function}** - The mouse out event handler.

                **returns {Function}**      - Returns the given function
                                              wrapped by the workaround logic.
            ###
            self = this
            (event) ->
                relatedTarget = event.toElement
                if event.relatedTarget
                    relatedTarget = event.relatedTarget
                while relatedTarget and relatedTarget.tagName isnt 'BODY'
                    if relatedTarget is this
                        return
                    relatedTarget = relatedTarget.parentNode
                eventHandler.apply self, arguments

        # endregion

        # region logging

        log: (
            object, force=false, avoidAnnotation=false, level='info',
            additionalArguments...
        ) ->
            ###
                Shows the given object's representation in the browsers
                console if possible or in a standalone alert-window as
                fallback.

                **object {Mixed}**            - Any object to print.

                **force {Boolean}**           - If set to "true" given input
                                                will be shown independently
                                                from current logging
                                                configuration or interpreter's
                                                console implementation.

                **avoidAnnotation {Boolean}** - If set to "true" given input
                                                has no module or log level
                                                specific annotations.

                **level {String}**            - Description of log messages
                                                importance.

                Additional arguments are used for string formating.

                **returns {$.Tools}**         - Returns the current instance.
            ###
            if this._options.logging or force or level in ['error', 'critical']
                if avoidAnnotation
                    message = object
                else if $.type(object) is 'string'
                    additionalArguments.unshift object
                    message = (
                        "#{this.__name__} (#{level}): " +
                        this.stringFormat.apply this, additionalArguments)
                else if $.isNumeric(object) or $.type(object) is 'boolean'
                    message = (
                        "#{this.__name__} (#{level}): #{object.toString()}")
                else
                    this.log ",--------------------------------------------,"
                    this.log object, force, true
                    this.log "'--------------------------------------------'"
                if message
                    if(
                        not window.console?[level]? or
                        window.console[level] is $.noop()
                    )
                        window.alert message
                    window.console[level] message
            this
        info: (object, additionalArguments...) ->
            ###
                Wrapper method for the native console method usually provided
                by interpreter.

                **object {Mixed}**    - Any object to print.

                Additional arguments are used for string formating.

                **returns {$.Tools}** - Returns the current instance.
            ###
            this.log.apply(
                this, [object, false, false, 'info'].concat(
                    additionalArguments))
        debug: (object, additionalArguments...) ->
            ###
                Wrapper method for the native console method usually provided
                by interpreter.

                **param {Mixed}**     - Any object to print.

                Additional arguments are used for string formating.

                **returns {$.Tools}** - Returns the current instance.
            ###
            this.log.apply(
                this, [object, false, false, 'debug'].concat(
                    additionalArguments))
        error: (object, additionalArguments...) ->
            ###
                Wrapper method for the native console method usually provided
                by interpreter.

                **object {Mixed}**    - Any object to print.

                Additional arguments are used for string formating.

                **returns {$.Tools}** - Returns the current instance.
            ###
            this.log.apply(
                this, [object, true, false, 'error'].concat(
                    additionalArguments))
        critical: (object, additionalArguments...) ->
            ###
                Wrapper method for the native console method usually provided
                by interpreter.

                **object {Mixed}**    - Any object to print.

                Additional arguments are used for string formating.

                **returns {$.Tools}** - Returns the current instance.
            ###
            this.log.apply(
                this, [object, true, false, 'warn'].concat(
                    additionalArguments))
        warn: (object, additionalArguments...) ->
            ###
                Wrapper method for the native console method usually provided
                by interpreter.

                **object {Mixed}**    - Any object to print.

                Additional arguments are used for string formating.

                **returns {$.Tools}** - Returns the current instance.
            ###
            this.log.apply this, [object, false, false, 'warn'].concat(
                additionalArguments)
        show: (object) ->
            ###
                Dumps a given object in a human readable format.

                **object {Object}**  - Any object to show.

                **returns {String}** - Returns the serialized object.
            ###
            output = ''
            if $.type(object) is 'string'
                output = object
            else
                $.each object, (key, value) ->
                    if value is undefined
                        value = 'undefined'
                    else if value is null
                        value = 'null'
                    output += "#{key.toString()}: #{value.toString()}\n"
            output = output.toString() if not output
            "#{$.trim(output)}\n(Type: \"#{$.type(object)}\")"

        # endregion

        # region dom node handling

        generateDirectiveSelector: (directiveName) ->
            ###
                Generates a directive name corresponding selector string.

                **directiveName {String}** - The directive name

                **return {String}**        - Returns generated selector
            ###
            delimitedName = this.stringCamelCaseToDelimited directiveName
            "#{delimitedName}, .#{delimitedName}, [#{delimitedName}], " +
            "[data-#{delimitedName}], [x-#{delimitedName}], " +
            "[#{delimitedName.replace '-', '\\:'}]"
        removeDirective: (directiveName) ->
            ###
                Removes a directive name corresponding class or attribute.

                **directiveName {String}** - The directive name

                **return {DomNode}**       - Returns current dom node
            ###
            delimitedName = this.stringCamelCaseToDelimited directiveName
            this.$domNode.removeClass(delimitedName).removeAttr(
                delimitedName
            ).removeAttr("data-#{delimitedName}").removeAttr(
                "x-#{delimitedName}"
            ).removeAttr delimitedName.replace '-', ':'
        getDirectiveValue: (directiveName) ->
            ###
                Determines a directive attribute value.

                **directiveName {String}** - The directive name

                **return {String|Null}**   - Returns the corresponding
                                             attribute value or "null" if no
                                             attribute value exists.
            ###
            delimitedName = this.stringCamelCaseToDelimited directiveName
            for attributeName in [
                delimitedName, "data-#{delimitedName}", "x-#{delimitedName}"
                delimitedName.replace '-', '\\:'
            ]
                value = this.$domNode.attr attributeName
                return value if value?
        sliceDomNodeSelectorPrefix: (domNodeSelector) ->
            ###
                Removes a selector prefix from a given selector. This methods
                searches in the options object for a given
                "domNodeSelectorPrefix".

                **domNodeSelector {String}** - The dom node selector to slice.

                **return {String}**          - Returns the sliced selector.
            ###
            if this._options?.domNodeSelectorPrefix? and this.stringStartsWith(
                domNodeSelector, this._options.domNodeSelectorPrefix
            )
                return $.trim(domNodeSelector.substring(
                    this._options.domNodeSelectorPrefix.length))
            domNodeSelector
        getDomNodeName: (domNodeSelector) ->
            ###
                Determines the dom node name of a given dom node string.

                **domNodeSelector {String}** - A given to dom node selector to
                                               determine its name.

                **returns {String}**         - Returns the dom node name.

                **examples**

                >>> $.Tools.getDomNodeName('&lt;div&gt;');
                'div'

                >>> $.Tools.getDomNodeName('&lt;div&gt;&lt;/div&gt;');
                'div'

                >>> $.Tools.getDomNodeName('&lt;br/&gt;');
                'br'
            ###
            domNodeSelector.match(new RegExp('^<?([a-zA-Z]+).*>?.*'))[1]
        grabDomNode: (domNodeSelectors, wrapperDomNode) ->
            ###
                Converts an object of dom selectors to an array of $ wrapped
                dom nodes. Note if selector description as one of "class" or
                "id" as suffix element will be ignored.

                **domNodeSelectors {Object}** - An object with dom node
                                                selectors.

                **wrapperDomNode {DomNode}**  - A dom node to be the parent or
                                                wrapper of all retrieved dom
                                                nodes.

                **returns {Object}**          - Returns all $ wrapped dom nodes
                                                corresponding to given
                                                selectors.
            ###
            domNodes = {}
            if domNodeSelectors?
                if wrapperDomNode?
                    wrapperDomNode = $ wrapperDomNode
                    $.each domNodeSelectors, (key, value) ->
                        domNodes[key] = wrapperDomNode.find value
                else
                    $.each domNodeSelectors, (key, value) =>
                        match = value.match ', *'
                        if match
                            $.each value.split(match[0]), (key, valuePart) =>
                                if key
                                    value += ', ' + this._grabDomNodeHelper(
                                        key, valuePart, domNodeSelectors)
                                else
                                    value = valuePart
                        domNodes[key] = $ this._grabDomNodeHelper(
                            key, value, domNodeSelectors)
            if this._options.domNodeSelectorPrefix
                domNodes.parent = $ this._options.domNodeSelectorPrefix
            domNodes.window = $ window
            domNodes.document = $ document
            domNodes

        # endregion

        # region scope

        getURLVariable: (key) ->
            ###
                Read a page's GET URL variables and return them as an
                associative array and preserves ordering.

                **key {String}**    - A get array key. If given only the
                                      corresponding value is returned and full
                                      array otherwise.

                **returns {Mixed}** - Returns the current get array or
                                      requested value. If requested key doesn't
                                      exist "undefined" is returned.
            ###
            variables = []
            $.each window.location.search.substring(1).split('&'), (
                key, value
            ) ->
                keyValuePair = value.split('=')
                key = window.decodeURIComponent keyValuePair[0]
                value = window.decodeURIComponent keyValuePair[1]
                variables.push key
                variables[key] = value
            if $.type(key) is 'string'
                if key in variables
                    return variables[key]
                else
                    return undefined
            variables
        determineUniqueScopeName: (prefix='callback', scope=window) ->
            ###
                Generates a unique function name needed for jsonp requests.

                **scope {Object}**   - A scope where the name should be unique.

                **returns {String}** - The function name.
            ###
            while true
                uniqueName = prefix + window.parseInt window.Math.random(
                ) * window.Math.pow 10, 10
                break if not scope[uniqueName]?
            uniqueName

        # endregion

        # region function handling

        getMethod: (method, scope=this, additionalArguments...) ->
            ###
                Methods given by this method has the plugin scope referenced
                with "this". Otherwise "this" usually points to the object the
                given method was attached to. If "method" doesn't match string
                arguments are passed through "$.proxy()" with "context" setted
                as "scope" or "this" if nothing is provided.

                **method {String|Function|Object}** - A method name of given
                                                      scope.

                **scope {Object|String}**           - A given scope.

                **returns {Mixed}**                 - Returns the given methods
                                                      return value.
            ###
            ###
                This following outcomment line would be responsible for a
                bug in yuicompressor.
                Because of declaration of arguments the parser things that
                arguments is a local variable and could be renamed.
                It doesn't care about that the magic arguments object is
                necessary to generate the arguments array in this context.

                var arguments = this.argumentsObjectToArray(arguments);

                use something like this instead:

                var parameter = this.argumentsObjectToArray(arguments);
            ###
            parameter = this.argumentsObjectToArray arguments
            if($.type(method) is 'string' and
               $.type(scope) is 'object')
                return ->
                    if not scope[method]
                        $.error(
                            "Method \"#{method}\" doesn't exists in " +
                            "\"#{scope}\".")
                    thisFunction = arguments.callee
                    parameter = $.Tools().argumentsObjectToArray(
                        arguments)
                    parameter.push thisFunction
                    scope[method].apply(scope, parameter.concat(
                        additionalArguments))
            parameter.unshift scope
            parameter.unshift method
            $.proxy.apply $, parameter

        # endregion

        # region event handling

        debounce: (
            eventFunction, thresholdInMilliseconds=600, additionalArguments...
        ) ->
            ###
                Prevents event functions from triggering to often by defining a
                minimal span between each function call. Additional arguments
                given to this function will be forwarded to given event
                function call.

                **eventFunction** {Function}         - The function to call
                                                       debounced

                **thresholdInMilliseconds** {Number} - The minimum time span
                                                       between each function
                                                       call

                **returns {Function}**               - Returns the wrapped
                                                       method
            ###
            lock = false
            waitingCallArguments = null
            self = this
            ->
                parameter = self.argumentsObjectToArray arguments
                if lock
                    waitingCallArguments = parameter.concat(
                        additionalArguments or [])
                else
                    lock = true
                    timeoutID = window.setTimeout (=>
                        lock = false
                        if waitingCallArguments
                            eventFunction.apply this, waitingCallArguments
                            waitingCallArguments = null
                    ), thresholdInMilliseconds
                    eventFunction.apply this, parameter.concat(
                        additionalArguments or [])
        fireEvent: (
            eventName, callOnlyOptionsMethod=false, scope=this,
            additionalArguments...
        ) ->
            ###
                Searches for internal event handler methods and runs them by
                default. In addition this method searches for a given event
                method by the options object. Additional arguments are
                forwarded to respective event functions.

                **eventName {String}                - An event name.

                **callOnlyOptionsMethod {Boolean}** - Prevents from trying to
                                                      call an internal event
                                                      handler.

                **scope {Object}**                  - The scope from where the
                                                      given event handler
                                                      should be called.

                **returns {Boolean}**               - Returns "true" if an
                                                      event handler was called
                                                      and "false" otherwise.
            ###
            scope = this if not scope
            eventHandlerName = "on#{this.stringCapitalize eventName}"
            if not callOnlyOptionsMethod
                if scope[eventHandlerName]
                    scope[eventHandlerName].apply scope, additionalArguments
                else if scope["_#{eventHandlerName}"]
                    scope["_#{eventHandlerName}"].apply(
                        scope, additionalArguments)
            if scope._options and scope._options[eventHandlerName]
                scope._options[eventHandlerName].apply(
                    scope, additionalArguments)
                return true
            false
        on: ->
            ###
                A wrapper method for "$.on()". It sets current plugin name as
                event scope if no scope is given. Given arguments are modified
                and passed through "$.on()".

                **returns {$}** - Returns $'s grabbed dom node.
            ###
            this._bindHelper arguments, false
        off: ->
            ###
                A wrapper method fo "$.off()". It sets current plugin name as
                event scope if no scope is given. Given arguments are modified
                and passed through "$.off()".

                **returns {$}** - Returns $'s grabbed dom node.
            ###
            this._bindHelper arguments, true, 'off'

        # endregion

        # region array handling

        argumentsObjectToArray: (argumentsObject) ->
            ###
                Converts the interpreter given magic arguments object to a
                standard array object.

                **argumentsObject {Object}** - An argument object.

                **returns {Object[]}**       - Returns the array containing all
                                               elements in given arguments
                                               object.
            ###
            Array.prototype.slice.call argumentsObject

        # endregion

        # region number handling

        round: (number, digits=0) ->
            ###
                Rounds a given number accurate to given number of digits.

                **number {Float}**   - The number to round.

                **digits {Integer}** - The number of digits after comma.

                **returns {Float}**  - Returns the rounded number.
            ###
            Math.round(number * Math.pow 10, digits) / Math.pow 10, digits

        # endregion

        # region string manipulating

        stringStartsWith: (string, searchString) ->
            ###
                Checks weather given string starts with given search string.

                **string {String}**        - String to search in.

                **searchString {String}**  - String to search for.

                **returns {String}**       - Returns "true" if given string
                                             starts with given search string
                                             and "false" otherwise.
            ###
            string.indexOf(searchString) is 0
        stringEndsWith: (string, searchString) ->
            ###
                Checks weather given string ends with given search string.

                **string {String}**        - String to search in.

                **searchString {String}**  - String to search for.

                **returns {String}**       - Returns "true" if given string
                                             ends with given search string
                                             and "false" otherwise.
            ###
            string.length >= searchString.length and string.lastIndexOf(
                searchString
            ) is string.length - searchString.length
        stringFormat: (string, additionalArguments...) ->
            ###
                Performs a string formation. Replaces every placeholder "{i}"
                with the i'th argument.

                **string {String}**  - The string to format.

                Additional arguments are interpreted as replacements for string
                formating.

                **returns {String}** - The formatted string.
            ###
            additionalArguments.unshift string
            $.each(additionalArguments, (key, value) ->
                string = string.replace(
                    new RegExp("\\{#{key}\\}", 'gm'), value))
            string
        stringCamelCaseToDelimited: (string, delimiter='-') ->
            ###
                Converts a camel case string to a string with given delimiter
                between each camel case separation.

                **string {String}**    - The string to format.

                **delimiter {String}** - The string to put between each camel
                                         case separation.

                **returns {String}**   - The formatted string.
            ###
            string.replace(new window.RegExp('(.)([A-Z])', 'g'), ->
                arguments[1] + delimiter + arguments[2]
            ).toLowerCase()
        stringDelimitedToCamelCase: (string, delimiter='-') ->
            ###
                Converts a delimited string to a string with any none
                alphanumeric value to its camel cased version.

                **string {String}**    - The string to format.

                **returns {String}**   - The formatted string.
            ###
            string = string.replace(
                new window.RegExp('[^a-zA-Z0-9]([a-z])', 'g'), (
                    fullMatch, firstLetter
                ) -> firstLetter.toUpperCase()
            ).replace window.RegExp('[^a-zA-Z0-9]', 'g'), ''
            this.stringLowerCase string
        stringLowerCase: (string) ->
            ###
                Converts a string to its lower case representation.

                **string {String}**  - The string to format.

                **returns {String}** - The formatted string.
            ###
            string.charAt(0).toLowerCase() + string.substring 1
        stringCapitalize: (string) ->
            ###
                Converts a string to its capitalize representation.

                **string {String}**  - The string to format.

                **returns {String}** - The formatted string.
            ###
            string.charAt(0).toUpperCase() + string.substring 1
        stringAddSeparatorToPath: (path, pathSeparator='/') ->
            ###
                Appends a path selector to the given path if there isn't one
                yet.

                **path {String}**          - The path for appending a selector.

                **pathSeparator {String}** - The selector for appending to
                                             path.

                **returns {String}**       - The appended path.
            ###
            path = $.trim path
            if path.substr(-1) isnt pathSeparator and path.length
                return path + pathSeparator
            path

        # endregion

        # region data transfer

        sendToIFrame: (
            target, url, data, requestType='post', removeAfterLoad=false
        ) ->
            ###
                Send given data to a given iframe.

                **target {String|DomNode}**   - Name of the target iframe or
                                                the target iframe itself.

                **url {String}**              - URL to send to data to.

                **data {Object}**             - Data holding object to send
                                                data to.

                **requestType {String}**      - The forms action attribute
                                                value. If nothing is provided
                                                "post" will be used as default.

                **removeAfterLoad {Boolean}** - Indicates if created iframe
                                                should be removed right after
                                                load event. Only works if an
                                                iframe object is given instead
                                                of a simple target name.

                **returns {String|DomNode}**  - Returns the given target.
            ###
            form = $('<form>').attr
                action: url
                method: requestType
                target: if $.type(
                    target
                ) is 'string' then target else target.attr 'name'
            for name, value of data
                form.append $('<input>').attr
                    type: 'hidden'
                    name: name
                    value: value
            form.submit().remove()
            target.on? 'load', -> target.remove() if removeAfterLoad

        sendToExternalURL: (
            url, data, requestType='post', removeAfterLoad=true
        ) ->
            ###
                Send given data to a temporary created iframe.

                **url {String}**              - URL to send to data to.

                **data {Object}**             - Data holding object to send
                                                data to.

                **requestType {String}**      - The forms action attribute
                                                value. If nothing is provided
                                                "post" will be used as default.

                **removeAfterLoad {Boolean}** - Indicates if created iframe
                                                should be removed right after
                                                load event.

                **returns {DomNode}**         - Returns the dynamically created
                                                iframe.
            ###
            iFrame = $('<iframe>').attr(
                name: this.__name__.charAt(0).toLowerCase(
                ) + this.__name__.substring(1) + (new Date).getTime()
            ).hide()
            this.$domNode.after iFrame
            this.sendToIFrame iFrame, url, data, requestType, removeAfterLoad

        # endregion

    # endregion

    # region protected

        _bindHelper: (
            parameter, removeEvent=false, eventFunctionName='on'
        ) ->
            ###
                Helper method for attach event handler methods and their event
                handler remove pendants.

                **parameter** {Object}**       - Arguments object given to
                                                 methods like "bind()" or
                                                 "unbind()".

                **removeEvent {Boolean}**      - Indicates if "unbind()" or
                                                 "bind()" was given.

                **eventFunctionName {String}** - Name of function to wrap.

                **returns {$}**                - Returns $'s wrapped dom node.
            ###
            $domNode = $ parameter[0]
            if $.type(parameter[1]) is 'object' and not removeEvent
                $.each(parameter[1], (eventType, handler) =>
                    this[eventFunctionName] $domNode, eventType, handler)
                return $domNode
            parameter = this.argumentsObjectToArray(parameter).slice 1
            if parameter.length is 0
                parameter.push ''
            if parameter[0].indexOf('.') is -1
                parameter[0] += ".#{this.__name__}"
            if removeEvent
                return $domNode[eventFunctionName].apply $domNode, parameter
            $domNode[eventFunctionName].apply $domNode, parameter
        _grabDomNodeHelper: (key, selector, domNodeSelectors) ->
            ###
                Converts a dom selector to a prefixed dom selector string.

                **key {Integer}**             - Current element in options
                                                array to
                                                grab.

                **selector {String}**         - A dom node selector.

                **domNodeSelectors {Object}** - An object with dom node
                                                selectors.

                **returns {Object}**          - Returns given selector
                                                prefixed.
            ###
            domNodeSelectorPrefix = ''
            if this._options.domNodeSelectorPrefix
                domNodeSelectorPrefix = this._options.domNodeSelectorPrefix +
                    ' '
            if not (this.stringStartsWith(
                selector, domNodeSelectorPrefix
            ) or this.stringStartsWith $.trim(selector), '<')
                domNodeSelectors[key] = domNodeSelectorPrefix + selector
                return $.trim domNodeSelectors[key]
            $.trim selector

    # endregion

    # region handle $ extending

    $.fn.Tools = -> (new Tools).controller Tools, arguments, this
    $.Tools = -> (new Tools).controller Tools, arguments
    $.Tools.class = Tools

        # region prop fix for comments and text nodes

    nativePropFunction = $.fn.prop
    $.fn.prop = (key, value) ->
        ###
            JQuery's native prop implementation ignores properties for text
            nodes, comments and attribute nodes.
        ###
        if arguments.length < 3 and this[0].nodeName in [
            '#text', '#comment'
        ] and this[0][key]?
            if arguments.length is 1
                return this[0][key]
            if arguments.length is 2
                this[0][key] = value
                return this
        nativePropFunction.apply this, arguments

        # endregion

    # endregion

# endregion

# region dependencies

if this.require?
    this.require.scopeIndicator = 'jQuery.Tools'
    this.require [['jQuery', 'jquery-2.1.1']], main
else
    main this.jQuery

# endregion

# region vim modline

# vim: set tabstop=4 shiftwidth=4 expandtab:
# vim: foldmethod=marker foldmarker=region,endregion:

# endregion
