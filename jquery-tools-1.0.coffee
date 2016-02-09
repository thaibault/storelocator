#!/usr/bin/env coffee
# -*- coding: utf-8 -*-

# region header

###
[Project page](http://torben.website/jQuery-tools)

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
        ###
            Lists all known abbreviation for proper camel case to delimited
            and back conversion.
        ###
        abbreviations: ['html', 'id', 'url', 'us', 'de', 'api', 'href']
        ###
            **transitionEndEventNames {String}**
            Saves a string with all css3 browser specific transition end event
            names.
        ###
        transitionEndEventNames:
            'transitionend webkitTransitionEnd oTransitionEnd ' +
            'MSTransitionEnd'
        ###
            **animationEndEventNames {String}**
            Saves a string with all css3 browser specific animation end event
            names.
        ###
        animationEndEventNames:
            'animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd'
        ###
            **maximalsupportedinternetexplorerversion {String}**
            Saves currently minimal supported internet explorer version.
        ###
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
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error'
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log'
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd'
            'timeStamp', 'trace', 'warn']
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
                logging: false, domNodeSelectorPrefix: 'body', domNode:
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

        # region dom node

        normalizeClassNames: ->
            ###
                Normalizes class name order of current dom node.

                **returns {$.Tools}** - Returns current instance.
            ###
            this.$domNode.find('*').addBack().each ->
                $this = $ this
                if $this.attr 'class'
                    sortedClassNames = $this.attr('class').split(' ').sort(
                    ) or []
                    $this.attr 'class', ''
                    for className in sortedClassNames
                        $this.addClass className
                else if $this.attr('class')?
                    $this.removeAttr 'class'
            this
        isEquivalentDom: (first, second) ->
            ###
                Checks weather given html or text strings are equal.

                **first {String|DomNode}**  - First html or text to compare.

                **second {String|DomNode}** - Second html or text to compare.

                **returns {Boolean}**       - Returns true if both dom
                                              representations are equivalent.
            ###
            return true if first is second
            if first?
                if second?
                    # NOTE: We have to distinguish between selector and markup.
                    if not (
                        (not first.charAt? or first.charAt(0) is '<') and
                        (not second.charAt? or second.charAt(0) is '<')
                    )
                        return first is second
                    $firstDomNode = $ first
                    if $firstDomNode.length
                        $secondDomNode = $ second
                        if $secondDomNode.length
                            $firstDomNode = $firstDomNode.Tools(
                                'normalizeClassNames'
                            ).$domNode
                            $secondDomNode = $secondDomNode.Tools(
                                'normalizeClassNames'
                            ).$domNode
                            return $firstDomNode[0].isEqualNode(
                                $secondDomNode[0])
                        return false
                    return first is second
                return false
            not second?
        getPositionRelativeToViewport: (delta={}) ->
            ###
                Determines where current dom node is relative to current view
                port position.

                **delta {Object}**   - Allows deltas for "top", "left",
                                       "bottom" and "right" for determining
                                       positions.

                **returns {String}** - Returns one of "above", "left", "below",
                                       "right" or "in".
            ###
            delta = $.extend {top: 0, left: 0, bottom: 0, right: 0}, delta
            $window = $ window
            rectangle = this.$domNode[0].getBoundingClientRect()
            if (rectangle.top + delta.top) < 0
                return 'above'
            if (rectangle.left + delta.left) < 0
                return 'left'
            if $window.height() < (rectangle.bottom + delta.bottom)
                return 'below'
            if $window.width() < (rectangle.right + delta.right)
                return 'right'
            'in'
        generateDirectiveSelector: (directiveName) ->
            ###
                Generates a directive name corresponding selector string.

                **directiveName {String}** - The directive name

                **return {String}**        - Returns generated selector
            ###
            delimitedName = this.stringCamelCaseToDelimited directiveName
            "#{delimitedName}, .#{delimitedName}, [#{delimitedName}], " +
            "[data-#{delimitedName}], [x-#{delimitedName}]" + (
                if delimitedName.indexOf('-') is -1 then '' else \
                (", [#{delimitedName.replace /-/g, '\\:'}], " +
                "[#{delimitedName.replace /-/g, '_'}]"))
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
            ).removeAttr(delimitedName.replace '-', ':').removeAttr(
                delimitedName.replace '-', '_')
        getNormalizedDirectiveName: (directiveName) ->
            ###
                Determines a normalized camel case directive name
                representation.

                **directiveName {String}** - The directive name

                **return {String}**        - Returns the corresponding name
            ###
            for delimiter in ['-', ':', '_']
                prefixFound = false
                for prefix in ['data' + delimiter, 'x' + delimiter]
                    if this.stringStartsWith directiveName, prefix
                        directiveName = directiveName.substring prefix.length
                        prefixFound = true
                        break
                break if prefixFound
            for delimiter in ['-', ':', '_']
                directiveName = this.stringDelimitedToCamelCase(
                    directiveName, delimiter)
            directiveName
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

        isolateScope: (scope, prefixesToIgnore=['$', '_']) ->
            ###
                Overwrites all inherited variables from parent scope with
                "undefined".

                **scope {Object}**            - A scope where inherited names
                                                will be removed.

                **prefixesToIgnore String[]** - Name prefixes to ignore during
                                                deleting names in given scope.

                **returns {Object}**          - The isolated scope.
            ###
            for name, object of scope
                if prefixesToIgnore.indexOf(name.charAt 0) is -1 and [
                    'this', 'constructor'
                ].indexOf(name) is -1 and not scope.hasOwnProperty name
                    # NOTE: Delete ("delete $scope[name]") doesn't destroy the
                    # automatic lookup to parent scope.
                    scope[name] = undefined
            scope
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

        # region function

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
            if $.type(method) is 'string' and $.type(scope) is 'object'
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
        identity: (value) ->
            ###
                Implements the identity function.

                **value {Object}**   - A value to return.

                **returns {Object}** - Returns the given value.
            ###
            value
        invertArrayFilter: (filter) ->
            ###
                Inverted filter helper to inverse each given filter.

                **filter {Function}**  - A function that filters an array.

                **returns {Function}** - The inverted filter.
            ###
            (data) ->
                if data
                    filteredData = filter.apply this, arguments
                    result = []
                    if filteredData.length
                        for date in data
                            if date not in filteredData
                                result.push date
                    else
                        result = data
                    return result
                data

        # endregion

        # region event

        debounce: (
            eventFunction, thresholdInMilliseconds=600, additionalArguments...
        ) ->
            ###
                Prevents event functions from triggering to often by defining a
                minimal span between each function call. Additional arguments
                given to this function will be forwarded to given event
                function call. The function wrapper returns null if current
                function will be omitted due to debounceing.

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
            timeoutID = null
            ->
                parameter = self.argumentsObjectToArray arguments
                if lock
                    waitingCallArguments = parameter.concat(
                        additionalArguments or [])
                    null
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
                timeoutID
        fireEvent: (
            eventName, callOnlyOptionsMethod=false, scope=this
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

        # region object

        forEachSorted: (object, iterator, context) ->
            ###
                Iterates given objects own properties in sorted fashion. For
                each key value pair given iterator function will be called with
                value and key as arguments.

                **object {Object}**     - Object to iterate.

                **iterator {Function}** - Function to execute for each key
                                          value pair. Value will be the first
                                          and key will be the second argument.

                **context {Object}**    - The "this" binding for given iterator
                                          function.

                **returns {Object[]}**  - List of given sorted keys.
            ###
            keys = this.sort object
            for key in keys
                iterator.call context, object[key], key
            keys
        sort: (object) ->
            ###
                Sort given objects keys.

                **object {Object}**    - Object which keys should be sorted.

                **returns {Object[]}** - Sorted list of given keys.
            ###
            isArray = $.isArray object
            keys = []
            for key, value of object
                key = window.parseInt(key) if isArray
                if object.hasOwnProperty key
                    keys.push key
            keys.sort()
        equals: (
            firstValue, secondValue, properties=null, deep=-1
            exceptionPrefixes=['$', '_'], ignoreFunctions=true
        ) ->
            ###
                Returns true if given items are equal for given property list.
                If property list isn't set all properties will be checked. All
                keys which starts with one of the exception prefixes will be
                omitted.

                **firstValue {Mixed}**           - First object to compare.

                **secondValue {Mixed}**          - Second object to compare.

                **properties {String[]}**        - Property names to check.
                                                   Check all if "null" is
                                                   selected (default).

                **deep {Integer}**               - Recursion depth negative
                                                   values means infinitely deep
                                                   (default).

                **exceptionPrefixes {String[]}** - Property prefixes which
                                                   indicates properties to
                                                   ignore.

                **ignoreFunctions {Boolean}* *   - Indicates weather functions
                                                   have to be identical to
                                                   interpret is as equal.
                                                   If set to "true" two
                                                   functions will be assumed to
                                                   be equal (default).

                **returns {Boolean}**            - "true" if both objects are
                                                   equal and "false" otherwise.
            ###
            if(
                ignoreFunctions and $.isFunction(firstValue) and $.isFunction(
                    secondValue
                ) or firstValue is secondValue or this.numberIsNotANumber(
                    firstValue
                ) and this.numberIsNotANumber(secondValue) or
                firstValue instanceof window.RegExp and
                secondValue instanceof window.RegExp and
                firstValue.toString() is secondValue.toString() or
                firstValue instanceof window.Date and
                secondValue instanceof window.Date and (
                    window.isNaN(firstValue.getTime()) and
                    window.isNaN(secondValue.getTime()) or
                    not window.isNaN(firstValue.getTime()) and
                    not window.isNaN(secondValue.getTime()) and
                    firstValue.getTime() is secondValue.getTime()
                )
            )
                return true
            if $.isPlainObject(firstValue) and $.isPlainObject(
                secondValue
            ) and not (
                firstValue instanceof window.RegExp or
                secondValue instanceof window.RegExp
            ) or $.isArray(firstValue) and $.isArray(
                secondValue
            ) and firstValue.length is secondValue.length
                equal = true
                for [first, second] in [[firstValue, secondValue], [
                    secondValue, firstValue
                ]]
                    firstIsArray = $.isArray first
                    return false if firstIsArray and (not $.isArray(
                        second
                    )) or first.length isnt second.length
                    $.each first, (key, value) =>
                        if not firstIsArray
                            if(
                                not equal or properties? and
                                key not in properties
                            )
                                return
                            for exceptionPrefix in exceptionPrefixes
                                if this.stringStartsWith(
                                    key.toString(), exceptionPrefix
                                )
                                    return
                        if deep isnt 0 and not this.equals(
                            value, second[key], properties, deep - 1
                            exceptionPrefixes
                        )
                            equal = false
                return equal
            false

        # endregion

        # region array

        argumentsObjectToArray: (argumentsObject) ->
            ###
                Converts the interpreter given magic arguments object to a
                standard array object.

                **argumentsObject {Object}** - An argument object.

                **returns {Object[]}**       - Returns the array containing all
                                               elements in given arguments
                                               object.
            ###
            window.Array.prototype.slice.call argumentsObject
        arrayUnique: (data) ->
            ###
                Makes all values in given iterable unique by removing
                duplicates (The first occurrences will be left).

                **data {Object}**    - Array like object.

                **returns {Object}** - Sliced version of given object.
            ###
            result = []
            for index, value of data
                result.push(value) if value not in result
            result
        arrayAggregatePropertyIfEqual: (data, propertyName, defaultValue='') ->
            ###
                Summarizes given property of given item list.

                **data {Object[]}**       - Array of objects with given
                                            property name.

                **propertyName {String}** - Property name to summarize.

                **defaultValue {Mixed}**  - Value to return if property values
                                            doesn't match.
            ###
            result = defaultValue
            if data?.length and data[0][propertyName]?
                result = data[0][propertyName]
                for item in data
                    if item[propertyName] isnt result
                        return defaultValue
            result
        arrayDeleteEmptyItems: (data, propertyNames=[]) ->
            ###
                Deletes every item witch has only empty attributes for given
                property names. If given property names are empty each
                attribute will be considered. The empty string, "null" and
                "undefined" will be interpreted as empty.

                **data {Object[]}**          - Data to filter.

                **propertyNames {String[]}** - Properties to consider.

                **returns {Object[]}**       - Given data without empty items.
            ###
            return data if not data?
            result = []
            for item in data
                empty = true
                for propertyName, value of item
                    if value not in ['', null, undefined] and (
                        not propertyNames.length or
                        propertyName in propertyNames
                    )
                        empty = false
                        break
                result.push(item) if not empty
            result
        arrayExtract: (data, propertyNames) ->
            ###
                Extracts all properties from all items wich occur in given
                property names.

                **data {Object[]}**          - Data where each item should be
                                               sliced.

                **propertyNames {String[]}** - Property names to extract.

                **returns {Object[]}**       - Data with sliced items.
            ###
            for item in data
                for attributeName of item
                    if attributeName not in propertyNames
                        delete item[attributeName]
            data
        arrayExtractIfMatches: (data, regularExpression) ->
            ###
                Extracts all values which matches given regular expression.

                **data {String[]}**            - Data to filter.

                **regularExpression {String}** - Pattern to match for.

                **returns {String[]}**         - Filtered data.
            ###
            result = []
            $.each data, (index, value) ->
                if (new window.RegExp regularExpression).test value
                    result.push value
            result
        arrayExtractIfPropertyExists: (data, propertyName) ->
            ###
                Filters given data if given property is set or not.

                **data {Object[]}**       - Data to filter.

                **propertyName {String}** - Property name to check for
                                            existence.

                **returns {Object[]}**    - Given data without the items which
                                            doesn't have specified property.
            ###
            if data and propertyName
                result = []
                for item in data
                    exists = false
                    for key, value of item
                        if key is propertyName and value?
                            exists = true
                            break
                    result.push(item) if exists
                return result
            data
        arrayExtractIfPropertyMatches: (data, propertyPattern) ->
            ###
                Extract given data where specified property value matches given
                patterns.

                **data {Object[]}**          - Data to filter.

                **propertyPattern {Object}** - Mapping of property names to
                                               pattern.

                **returns {Object[]}**       - Filtered data.
            ###
            if data and propertyPattern
                result = []
                for item in data
                    matches = true
                    for key, pattern of propertyPattern
                        if not window.RegExp(pattern).test item[key]
                            matches = false
                            break
                    result.push(item) if matches
                return result
            data
        arrayIntersect: (firstSet, secondSet, keys=[], strict=true) ->
            ###
                Determines all objects which exists in "firstSet" and in
                "secondSet". Object key which will be compared are given by
                "keys". If an empty array is given each key will be compared.
                If an object is given corresponding initial data key will be
                mapped to referenced new data key.

                **firstSet {Mixed[]}**     - Referenced data to check for.

                **secondSet {Mixed[]}**    - Data to check for existence.

                **keys {Object|String[]}** - Keys to define equality.

                **strict {Boolean}**       - The strict parameter indicates
                                             weather "null" and "undefined"
                                             should be interpreted as equal
                                             (takes only effect if given keys
                                             aren't empty).

                **returns {Mixed[]} **     - Data which does exit in given
                                             initial data.
            ###
            containingData = []
            for initialItem in firstSet
                if $.isPlainObject initialItem
                    exists = false
                    for newItem in secondSet
                        exists = true
                        iterateGivenKeys = $.isPlainObject(keys) or keys.length
                        if not iterateGivenKeys
                            keys = initialItem
                        $.each (keys), (firstSetKey, secondSetKey) ->
                            if $.isArray keys
                                firstSetKey = secondSetKey
                            else if not iterateGivenKeys
                                secondSetKey = firstSetKey
                            if(
                                newItem[secondSetKey] isnt
                                initialItem[firstSetKey] and (
                                    strict or (
                                        [null, undefined].indexOf(
                                            newItem[secondSetKey]
                                        ) is -1 or
                                        [null, undefined].indexOf(
                                            initialItem[firstSetKey]
                                        ) is -1))
                            )
                                exists = false
                                return false
                        break if exists
                else
                    exists = secondSet.indexOf(initialItem) isnt -1
                containingData.push(initialItem) if exists
            containingData
        arrayMakeRange: (range, step=1) ->
            ###
                Creates a list of items within given range.

                **range {Integer[]}**   - Array of lower and upper bounds. If
                                          only one value is given lower bound
                                          will be assumed to be zero. Both
                                          integers have to be positive and will
                                          be contained in the resulting array.

                **step {Integer}**      - Space between two consecutive values.

                **returns {Integer[]}** - Produced array of integers.
            ###
            if range.length is 1
                index = 0
                higherBound = window.parseInt range[0]
            else if range.length is 2
                index = window.parseInt range[0]
                higherBound = window.parseInt range[1]
            else
                return range
            result = [index]
            while index <= higherBound - step
                index += step
                result.push index
            return result
        arraySumUpProperty: (data, propertyName) ->
            ###
                Sums up given property of given item list.

                **data {Object[]}**        - The objects to with the given
                                             property to sum up.

                **propertyNames {String}** - Property name to sum up its value.

                **returns {Number}**       - The aggregated value.
            ###
            result = 0
            if data?.length
                for item in data
                    result += window.parseFloat item[propertyName] or 0
            result
        arrayAppendAdd: (item, target, name, checkIfExists=true) ->
            ###
                Adds an item to another item as array connection (many to one).

                **item {Object}**           - Item where the item should be
                                              appended to.

                **target {Object}**         - Target to add to given item.

                **name {String}**           - Name of the target connection.

                **checkIfExists {Boolean}** - Indicates if duplicates are
                                              allowed in resulting list (will
                                              result in linear runtime instead
                                              of constant one).

                **returns {Object}** - Item with the appended target.
            ###
            if item.hasOwnProperty name
                if not (checkIfExists and target in item[name])
                    item[name].push target
            else
                item[name] = [target]
            item
        arrayRemove: (list, target, strict=false) ->
            ###
                Removes given target on given list.

                **list {Object[]}**    - Array to splice.

                **target {Object}**    - Target to remove from given list.

                **strict {Boolean}**   - Indicates weather to fire an exception
                                         if given target doesn't exists given
                                         list.

                **returns {Object[]}** - Item with the appended target.
            ###
            if list? or strict
                index = list.indexOf target
                if index is -1
                    if strict
                        throw window.Error(
                            "Given target doesn't exists in given list.")
                else
                    list.splice index, 1
            list

        # endregion

        # region string

        ## region url handling

        stringEncodeURIComponent: (url, encodeSpaces) ->
            ###
                This method is intended for encoding *key* or *value* parts of
                query component. We need a custom method because
                "window.encodeURIComponent()" is too aggressive and encodes
                stuff that doesn't have to be encoded per
                "http://tools.ietf.org/html/rfc3986:"

                **url {String}**           - URL to encode.

                **encodeSpaces {Boolean}** - Indicates weather given url should
                                             encode whitespaces as "+" or
                                             "%20".

                **return {String}**        - Encoded given url.
            ###
            window.encodeURIComponent(url).replace(/%40/gi, '@').replace(
                /%3A/gi, ':'
            ).replace(/%24/g, '$').replace(/%2C/gi, ',').replace(
                /%20/g, if encodeSpaces then '%20' else '+')
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
        stringHasPathPrefix: (
            prefix='/admin', path=window.location.pathname, separator='/'
        ) ->
            ###
                Checks if given path has given path prefix.

                **prefix {String}**    - Path prefix to search for.

                **path {String}**      - Path to search in.

                **separator {String}** - Delimiter to use in path (default is
                                         the posix conform slash).

                **returns {Boolean}**  - "true" if given prefix occur and
                                         "false" otherwise.
            ###
            return false if not prefix?
            if not this.stringEndsWith prefix, separator
                prefix += separator
            path is prefix.substring(
                0, prefix.length - separator.length
            ) or this.stringStartsWith path, prefix
        stringGetDomainName: (
            url=window.location.href, fallback=window.location.hostname
        ) ->
            ###
                Extracts domain name from given url. If no explicit domain name
                given current domain name will be assumed. If no parameter
                given current domain name will be determined.

                **url** {String}      - The url to extract domain from.

                **fallback** {String} - The fallback host name if no one exits
                                        in given url (default is current
                                        hostname)

                **returns {String}** - Extracted domain.
            ###
            result = /^([a-z]*:?\/\/)?([^/]+?)(?::[0-9]+)?(?:\/.*|$)/i.exec url
            return result[2] if result?[2]? and result?[1]?
            fallback
        stringGetPortNumber: (
            url=window.location.href, fallback=null, parameter=[]
        ) ->
            ###
                Extracts port number from given url. If no explicit port number
                given and no fallback is defined current port number will be
                assumed for local links. For external links 80 will be assumed
                for http protocol or 443 for https.

                **url** {String}        - The url to extract port from.

                **fallback {String}**   - Fallback port number if no explicit
                                          one was found. Default is derived
                                          from current protocol name.

                **parameter {Object[]}** - Additional parameter for checking if
                                           given url is an internal url. Given
                                           url and this parameter will be
                                           forwarded to the
                                           "stringIsInternalURL()" method.

                **returns {Integer}** - Extracted port number.
            ###
            result = /^(?:[a-z]*:?\/\/[^/]+?)?(?:[^/]+?):([0-9]+)/i.exec url
            return window.parseInt(result[1]) if result?[1]?
            return fallback if fallback isnt null
            if this.stringIsInternalURL.apply(
                this, [url].concat parameter
            ) and window.location.port and window.parseInt window.location.port
                return window.parseInt window.location.port
            if this.stringGetProtocolName(url) is 'https' then 443 else 80
        stringGetProtocolName: (
            url=window.location.href
            fallback=window.location.protocol.substring(
                0, window.location.protocol.length - 1)
        ) ->
            ###
                Extracts protocol name from given url. If no explicit url is
                given, current protocol will be assumed. If no parameter
                given current protocol number will be determined.

                **url** {String}      - The url to extract protocol from.

                **fallback** {String} - Fallback port to use if no protocol
                                        exists in given url (default is current
                                        protocol).

                **returns {String}**  - Extracted protocol.
            ###
            result = /^([a-z]+):\/\//i.exec url
            return result[1] if result?[1]
            fallback
        stringGetURLVariable: (
            keyToGet, input, subDelimiter='$', hashedPathIndicator='!', search
            hash=window.location.hash
        ) ->
            ###
                Read a page's GET URL variables and return them as an
                associative array and preserves ordering.

                **keyToGet {String}**            - If key given the
                                                   corresponding value is
                                                   returned and full object
                                                   otherwise.

                **input {String}**               - An alternative input to the
                                                   url search parameter. If "#"
                                                   is given the complete
                                                   current hash tag will be
                                                   interpreted as url and
                                                   search parameter will be
                                                   extracted from there. If "&"
                                                   is given classical search
                                                   parameter and hash parameter
                                                   will be taken in account. If
                                                   a search string is given
                                                   this will be analyzed. The
                                                   default is to take given
                                                   search part into account.

                **subDelimiter {String}**        - Defines which sequence
                                                   indicates the start of
                                                   parameter in a hash part of
                                                   the url.

                **hashedPathIndicator {String}** - If defined and given hash
                                                   starts with this indicator
                                                   given hash will be
                                                   interpreted as path
                                                   containing search and hash
                                                   parts.

                **search {String}**              - Search part to take into
                                                   account defaults to current
                                                   url search part.

                **hash {String}**                - Hash part to take into
                                                   account defaults to current
                                                   url hash part.

                **returns {Mixed}**              - Returns the current get
                                                   array or requested value. If
                                                   requested key doesn't exist
                                                   "undefined" is returned.
            ###

            # region set search and hash

            if not search?
                hash = '#' if not hash
                hash = hash.substring '#'.length
                if hashedPathIndicator and this.stringStartsWith(
                    hash, hashedPathIndicator
                )
                    subHashStartIndex = hash.indexOf '#'
                    if subHashStartIndex is -1
                        pathAndSearch = hash.substring(
                            hashedPathIndicator.length)
                        hash = ''
                    else
                        pathAndSearch = hash.substring(
                            hashedPathIndicator.length, subHashStartIndex)
                        hash = hash.substring subHashStartIndex
                    subSearchStartIndex = pathAndSearch.indexOf '?'
                    if subSearchStartIndex is -1
                        search = ''
                    else
                        search = pathAndSearch.substring subSearchStartIndex
                else
                    search = window.location.search
            input = search if not input

            # endregion

            # region determine data from search and hash if specified

            both = input is '&'
            if both or input is '#'
                decodedHash = decodeURIComponent hash
                subDelimiterPosition = decodedHash.indexOf subDelimiter
                if subDelimiterPosition is -1
                    input = ''
                else
                    input = decodedHash.substring subDelimiterPosition
                    if this.stringStartsWith input, subDelimiter
                        input = input.substring subDelimiter.length
            else if this.stringStartsWith input, '?'
                input = input.substring '?'.length
            data = if input then input.split '&' else []
            search = search.substring '?'.length
            data = data.concat(search.split '&') if both and search

            # endregion

            # region construct data structure

            variables = []
            $.each data, (key, value) ->
                keyValuePair = value.split '='
                key = window.decodeURIComponent keyValuePair[0]
                value = window.decodeURIComponent keyValuePair[1]
                variables.push key
                variables[key] = value

            # endregion

            return variables[keyToGet] if keyToGet?
            variables
        stringIsInternalURL: (firstURL, secondURL=window.location.href) ->
            ###
                Checks if given url points to another domain than second given
                url. If no second given url provided current url will be
                assumed.

                **firstURL {String}**  - URL to check against second url.

                **secondURL {String}** - URL to check against first url.

                **returns {Boolean}**  - Returns "true" if given first url has
                                         same domain as given second (or
                                         current) or.
            ###
            explicitDomainName = this.stringGetDomainName firstURL, false
            explicitProtocolName = this.stringGetProtocolName firstURL, false
            explicitPortNumber = this.stringGetPortNumber firstURL, false
            (
                not explicitDomainName or
                explicitDomainName is this.stringGetDomainName secondURL
            ) and (
                not explicitProtocolName or
                explicitProtocolName is this.stringGetProtocolName secondURL
            ) and (
                not explicitPortNumber or
                explicitPortNumber is this.stringGetPortNumber secondURL)
        stringNormalizeURL: (url) ->
            ###
                Normalized given website url.

                **url {String}**     - Uniform resource locator to normalize.

                **returns {String}** - Normalized result.
            ###
            if url
                url = $.trim url.replace(/^:?\/+/, '').replace /\/+$/, ''
                if this.stringStartsWith url, 'http'
                    return url
                return "http://#{url}"
            return ''
        stringRepresentURL: (url) ->
            ###
                Represents given website url.

                **url {String}**     - Uniform resource locator to represent.

                **returns {String}** - Represented result.
            ###
            if url
                return $.trim url.replace(/^(https?)?:?\/+/, '').replace(
                    /\/+$/, '')
            ''

        ## endregion

        stringCamelCaseToDelimited: (
            string, delimiter='-', abbreviations=null
        ) ->
            ###
                Converts a camel cased string to its delimited string version.

                **string {String}**          - The string to format.

                **delimiter {String}**       - Delimiter string

                **abbreviations {String[]}** - Collection of shortcut words to
                                               represent upper cased.

                **returns {String}**         - The formatted string.
            ###
            abbreviations = this.abbreviations if not abbreviations?
            escapedDelimiter = this.stringGetRegularExpressionValidated(
                delimiter)
            if abbreviations.length
                abbreviationPattern = ''
                for abbreviation in abbreviations
                    abbreviationPattern += '|' if abbreviationPattern
                    abbreviationPattern += abbreviation.toUpperCase()
                string = string.replace new window.RegExp(
                    "(#{abbreviationPattern})(#{abbreviationPattern})", 'g'
                ), "$1#{delimiter}$2"
            string = string.replace new window.RegExp(
                "([^#{escapedDelimiter}])([A-Z][a-z]+)", 'g'
            ), "$1#{delimiter}$2"
            string.replace(new window.RegExp(
                '([a-z0-9])([A-Z])', 'g'
            ), "$1#{delimiter}$2").toLowerCase()
        stringCapitalize: (string) ->
            ###
                Converts a string to its capitalize representation.

                **string {String}**  - The string to format.

                **returns {String}** - The formatted string.
            ###
            string.charAt(0).toUpperCase() + string.substring 1
        stringDelimitedToCamelCase: (
            string, delimiter='-', abbreviations=null
            preserveWrongFormattedAbbreviations=false
        ) ->
            ###
                Converts a delimited string to its camel case representation.

                **string {String}**          - The string to format.

                **delimiter {String}**       - Delimiter string

                **abbreviations {String[]}** - Collection of shortcut words to
                                               represent upper cased.

                **preserveWrongFormattedAbbreviations {Boolean}**
                                             - If set to "True" wrong formatted
                                               camel case abbreviations will
                                               be ignored.

                **returns {String}**         - The formatted string.
            ###
            escapedDelimiter = this.stringGetRegularExpressionValidated(
                delimiter)
            abbreviations = this.abbreviations if not abbreviations?
            if preserveWrongFormattedAbbreviations
                abbreviationPattern = abbreviations.join '|'
            else
                abbreviationPattern = ''
                for abbreviation in abbreviations
                    abbreviationPattern += '|' if abbreviationPattern
                    abbreviationPattern +=
                        "#{this.stringCapitalize abbreviation}|#{abbreviation}"
            stringStartsWithDelimiter = false
            if this.stringStartsWith string, delimiter
                string = string.substring delimiter.length
                stringStartsWithDelimiter = true
            string = string.replace new window.RegExp(
                "(#{escapedDelimiter})(#{abbreviationPattern})" +
                "(#{escapedDelimiter}|$)", 'g'
            ), (fullMatch, before, abbreviation, after) ->
                return (
                    before + abbreviation.toUpperCase() + after
                ) if fullMatch
                fullMatch
            string = string.replace new window.RegExp(
                "#{escapedDelimiter}([a-zA-Z0-9])", 'g'
            ), (fullMatch, firstLetter) ->
                return firstLetter.toUpperCase() if fullMatch
                fullMatch
            string = (delimiter + string) if stringStartsWithDelimiter
            string
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
                    new window.RegExp("\\{#{key}\\}", 'gm'), value))
            string
        stringGetRegularExpressionValidated: (string) ->
            ###
                Validates the current string for using in a regular expression
                pattern. Special regular expression chars will be escaped.

                **string {String}**            - The string to format.

                **returns {String}**           - The formatted string.
            ###
            string.replace /([\\|.*$^+[\]()?\-{}])/g, '\\$1'
        stringLowerCase: (string) ->
            ###
                Converts a string to its lower case representation.

                **string {String}**  - The string to format.

                **returns {String}** - The formatted string.
            ###
            string.charAt(0).toLowerCase() + string.substring 1
        stringMark: (
            target, mark, marker='<span class="tools-mark">{1}</span>'
            caseSensitiv=false
        ) ->
            ###
                Wraps given mark strings in given target with given marker.

                **target {String}**         - String to search for marker.

                **mark {String}**           - String to search in target for.

                **marker {String}**         - HTML template string to mark.

                **caseSensitive {Boolean}** - Indicates weather case takes a
                                              role during searching.

                **returns {String}**        - Processed result.
            ###
            target = $.trim target
            mark = $.trim mark
            if target and mark
                offset = 0
                searchTarget = target
                searchTarget = searchTarget.toLowerCase() if not caseSensitiv
                mark = mark.toLowerCase() if not caseSensitiv
                while true
                    index = searchTarget.indexOf mark, offset
                    if index is -1
                        break
                    else
                        target = target.substring(
                            0, index
                        ) + this.stringFormat(
                            marker, target.substr index, mark.length
                        ) + target.substring index + mark.length
                        searchTarget = target.toLowerCase() if not caseSensitiv
                        offset = index + (
                            marker.length - '{1}'.length
                        ) + mark.length
            target
        stringMD5: (value) ->
            ###
                Implements the md5 hash algorithm.

                **value {String}**   - Value to calculate md5 hash for.

                **returns {String}** - Calculated md5 hash value.
            ###
            rotateLeft = (lValue, iShiftBits) ->
                (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits))

            addUnsigned = (lX, lY) ->
                lX8 = (lX & 0x80000000)
                lY8 = (lY & 0x80000000)
                lX4 = (lX & 0x40000000)
                lY4 = (lY & 0x40000000)
                lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF)
                if lX4 & lY4
                    return lResult ^ 0x80000000 ^ lX8 ^ lY8
                if lX4 | lY4
                    if lResult & 0x40000000
                        return lResult ^ 0xC0000000 ^ lX8 ^ lY8
                    else
                        return lResult ^ 0x40000000 ^ lX8 ^ lY8
                else
                    return lResult ^ lX8 ^ lY8

            _F = (x, y, z) -> (x & y) | ((~x) & z)
            _G = (x, y, z) -> (x & z) | (y & (~z))
            _H = (x, y, z) -> x ^ y ^ z
            _I = (x, y, z) -> y ^ (x | (~z))

            _FF = (a, b, c, d, x, s, ac) ->
                a = addUnsigned a, addUnsigned addUnsigned(_F(b, c, d), x), ac
                addUnsigned rotateLeft(a, s), b

            _GG = (a, b, c, d, x, s, ac) ->
                a = addUnsigned a, addUnsigned addUnsigned(_G(b, c, d), x), ac
                addUnsigned rotateLeft(a, s), b

            _HH = (a, b, c, d, x, s, ac) ->
                a = addUnsigned a, addUnsigned addUnsigned(_H(b, c, d), x), ac
                addUnsigned rotateLeft(a, s), b

            _II = (a, b, c, d, x, s, ac) ->
                a = addUnsigned a, addUnsigned addUnsigned(_I(b, c, d), x), ac
                addUnsigned rotateLeft(a, s), b

            convertToWordArray = (value) ->
                lMessageLength = value.length
                lNumberOfWords_temp1 = lMessageLength + 8
                lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (
                    lNumberOfWords_temp1 % 64)) / 64
                lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16
                lWordArray = new Array(lNumberOfWords - 1)
                lBytePosition = 0
                lByteCount = 0
                while lByteCount < lMessageLength
                    lWordCount = (lByteCount - (lByteCount % 4)) / 4
                    lBytePosition = (lByteCount % 4) * 8
                    lWordArray[lWordCount] = (lWordArray[lWordCount] | (
                        value.charCodeAt(lByteCount) << lBytePosition))
                    lByteCount += 1
                lWordCount = (lByteCount - (lByteCount % 4)) / 4
                lBytePosition = (lByteCount % 4) * 8
                lWordArray[lWordCount] = lWordArray[lWordCount] | (
                    0x80 << lBytePosition)
                lWordArray[lNumberOfWords - 2] = lMessageLength << 3
                lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29
                lWordArray

            wordToHex = (lValue) ->
                wordToHexValue = ''
                wordToHexValueTemp = ''
                lCount = 0
                while lCount <= 3
                    lByte = (lValue >>> (lCount * 8)) & 255
                    wordToHexValueTemp = "0" + lByte.toString(16)
                    wordToHexValue =
                        wordToHexValue + wordToHexValueTemp.substr(
                            wordToHexValueTemp.length - 2, 2)
                    lCount += 1
                wordToHexValue

            x = []
            S11 = 7
            S12 = 12
            S13 = 17
            S14 = 22
            S21 = 5
            S22 = 9
            S23 = 14
            S24 = 20
            S31 = 4
            S32 = 11
            S33 = 16
            S34 = 23
            S41 = 6
            S42 = 10
            S43 = 15
            S44 = 21

            x = convertToWordArray value
            a = 0x67452301
            b = 0xEFCDAB89
            c = 0x98BADCFE
            d = 0x10325476

            xl = x.length

            k = 0
            while k < xl
                AA = a
                BB = b
                CC = c
                DD = d
                a = _FF a, b, c, d, x[k + 0], S11, 0xD76AA478
                d = _FF d, a, b, c, x[k + 1], S12, 0xE8C7B756
                c = _FF c, d, a, b, x[k + 2], S13, 0x242070DB
                b = _FF b, c, d, a, x[k + 3], S14, 0xC1BDCEEE
                a = _FF a, b, c, d, x[k + 4], S11, 0xF57C0FAF
                d = _FF d, a, b, c, x[k + 5], S12, 0x4787C62A
                c = _FF c, d, a, b, x[k + 6], S13, 0xA8304613
                b = _FF b, c, d, a, x[k + 7], S14, 0xFD469501
                a = _FF a, b, c, d, x[k + 8], S11, 0x698098D8
                d = _FF d, a, b, c, x[k + 9], S12, 0x8B44F7AF
                c = _FF c, d, a, b, x[k + 10], S13, 0xFFFF5BB1
                b = _FF b, c, d, a, x[k + 11], S14, 0x895CD7BE
                a = _FF a, b, c, d, x[k + 12], S11, 0x6B901122
                d = _FF d, a, b, c, x[k + 13], S12, 0xFD987193
                c = _FF c, d, a, b, x[k + 14], S13, 0xA679438E
                b = _FF b, c, d, a, x[k + 15], S14, 0x49B40821
                a = _GG a, b, c, d, x[k + 1], S21, 0xF61E2562
                d = _GG d, a, b, c, x[k + 6], S22, 0xC040B340
                c = _GG c, d, a, b, x[k + 11], S23, 0x265E5A51
                b = _GG b, c, d, a, x[k + 0], S24, 0xE9B6C7AA
                a = _GG a, b, c, d, x[k + 5], S21, 0xD62F105D
                d = _GG d, a, b, c, x[k + 10], S22, 0x2441453
                c = _GG c, d, a, b, x[k + 15], S23, 0xD8A1E681
                b = _GG b, c, d, a, x[k + 4], S24, 0xE7D3FBC8
                a = _GG a, b, c, d, x[k + 9], S21, 0x21E1CDE6
                d = _GG d, a, b, c, x[k + 14], S22, 0xC33707D6
                c = _GG c, d, a, b, x[k + 3], S23, 0xF4D50D87
                b = _GG b, c, d, a, x[k + 8], S24, 0x455A14ED
                a = _GG a, b, c, d, x[k + 13], S21, 0xA9E3E905
                d = _GG d, a, b, c, x[k + 2], S22, 0xFCEFA3F8
                c = _GG c, d, a, b, x[k + 7], S23, 0x676F02D9
                b = _GG b, c, d, a, x[k + 12], S24, 0x8D2A4C8A
                a = _HH a, b, c, d, x[k + 5], S31, 0xFFFA3942
                d = _HH d, a, b, c, x[k + 8], S32, 0x8771F681
                c = _HH c, d, a, b, x[k + 11], S33, 0x6D9D6122
                b = _HH b, c, d, a, x[k + 14], S34, 0xFDE5380C
                a = _HH a, b, c, d, x[k + 1], S31, 0xA4BEEA44
                d = _HH d, a, b, c, x[k + 4], S32, 0x4BDECFA9
                c = _HH c, d, a, b, x[k + 7], S33, 0xF6BB4B60
                b = _HH b, c, d, a, x[k + 10], S34, 0xBEBFBC70
                a = _HH a, b, c, d, x[k + 13], S31, 0x289B7EC6
                d = _HH d, a, b, c, x[k + 0], S32, 0xEAA127FA
                c = _HH c, d, a, b, x[k + 3], S33, 0xD4EF3085
                b = _HH b, c, d, a, x[k + 6], S34, 0x4881D05
                a = _HH a, b, c, d, x[k + 9], S31, 0xD9D4D039
                d = _HH d, a, b, c, x[k + 12], S32, 0xE6DB99E5
                c = _HH c, d, a, b, x[k + 15], S33, 0x1FA27CF8
                b = _HH b, c, d, a, x[k + 2], S34, 0xC4AC5665
                a = _II a, b, c, d, x[k + 0], S41, 0xF4292244
                d = _II d, a, b, c, x[k + 7], S42, 0x432AFF97
                c = _II c, d, a, b, x[k + 14], S43, 0xAB9423A7
                b = _II b, c, d, a, x[k + 5], S44, 0xFC93A039
                a = _II a, b, c, d, x[k + 12], S41, 0x655B59C3
                d = _II d, a, b, c, x[k + 3], S42, 0x8F0CCC92
                c = _II c, d, a, b, x[k + 10], S43, 0xFFEFF47D
                b = _II b, c, d, a, x[k + 1], S44, 0x85845DD1
                a = _II a, b, c, d, x[k + 8], S41, 0x6FA87E4F
                d = _II d, a, b, c, x[k + 15], S42, 0xFE2CE6E0
                c = _II c, d, a, b, x[k + 6], S43, 0xA3014314
                b = _II b, c, d, a, x[k + 13], S44, 0x4E0811A1
                a = _II a, b, c, d, x[k + 4], S41, 0xF7537E82
                d = _II d, a, b, c, x[k + 11], S42, 0xBD3AF235
                c = _II c, d, a, b, x[k + 2], S43, 0x2AD7D2BB
                b = _II b, c, d, a, x[k + 9], S44, 0xEB86D391
                a = addUnsigned a, AA
                b = addUnsigned b, BB
                c = addUnsigned c, CC
                d = addUnsigned d, DD
                k += 16
            (
                wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex d
            ).toLowerCase()
        stringNormalizePhoneNumber: (phoneNumber) ->
            ###
                Normalizes given phone number for automatic dialing mechanisms.

                **phoneNumber {String}** - Number to normalize.

                **returns {String}**     - Normalized number.
            ###
            if phoneNumber?
                return "#{phoneNumber}".replace(/[^0-9]*\+/, '00').replace(
                    /[^0-9]+/g, '')
            ''
        stringRepresentPhoneNumber: (phoneNumber) ->
            ###
                Represents given phone number. NOTE: Currently only support
                German phone numbers.

                **phoneNumber {String}** - Number to format.

                **returns {String}**     - Formatted number.
            ###
            if phoneNumber
                # Represent country code and leading area code zero.
                phoneNumber = phoneNumber.replace(
                    /^(00|\+)([0-9]+)-([0-9-]+)$/, '+$2 (0) $3')
                # Add German country code if not exists.
                phoneNumber = phoneNumber.replace(
                    /^0([1-9][0-9-]+)$/, '+49 (0) $1')
                # Separate area code from base number.
                phoneNumber = phoneNumber.replace(
                    /^([^-]+)-([0-9-]+)$/, '$1 / $2')
                # Partition base number in one triple and tuples or tuples
                # only.
                return phoneNumber.replace /^(.*?)([0-9]+)(-?[0-9]*)$/, (
                    match, prefix, number, suffix
                ) -> prefix + $.trim(
                    if number.length % 2 is 0 then number.replace(
                        /([0-9]{2})/g, '$1 '
                    ) else number.replace(
                        /^([0-9]{3})([0-9]+)$/, (match, triple, rest) ->
                            triple + ' ' + $.trim rest.replace(
                                /([0-9]{2})/g, '$1 ')
                    ) + suffix)
            ''
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
        stringDecodeHTMLEntities: (htmlString) ->
            ###
                Decodes all html symbols in text nodes in given html string.

                **htmlString {String}** - HTML string to decode.

                **returns {String}**    - Decoded html string.
            ###
            textareaDomNode = window.document.createElement 'textarea'
            textareaDomNode.innerHTML = htmlString
            textareaDomNode.value

        # endregion

        # region number

        numberIsNotANumber: (object) ->
            ###
                Checks if given object is java scripts native
                "window.Number.NaN" object.

                **object {Mixed}**    - Object to Check.

                **returns {Boolean}** - Returns weather given value is not a
                                        number or not.
            ###
            typeof object is 'number' and window.isNaN object
        numberRound: (number, digits=0) ->
            ###
                Rounds a given number accurate to given number of digits.

                **number {Float}**   - The number to round.

                **digits {Integer}** - The number of digits after comma.

                **returns {Float}**  - Returns the rounded number.
            ###
            Math.round(number * Math.pow 10, digits) / Math.pow 10, digits

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
