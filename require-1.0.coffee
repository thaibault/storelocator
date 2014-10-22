#!/usr/bin/env coffee
# -*- coding: utf-8 -*-

# region header

###
[Project page](https://thaibault.github.com/require)

This native javaScript module provides a full featured import mechanism like
python, php, c++ etc..

Copyright Torben Sickert 16.12.2012

License
-------

This library written by Torben Sickert stand under a creative commons naming
3.0 unported license. see http://creativecommons.org/licenses/by/3.0/deed.de

Conventions
-----------

(rcX := require convention number x)

- **rc1**
Capitalized variables are constant and shouldn't be mutable.
- **rc2**
Properties with preceding underscores shouldn't be accessed from the outer
scope. They could accessed in inherited objects (protected attributes).
- **rc3**
Property with two preceding underscore shouldn't be accessed from any location
then the object itself (private attributes).
- **rc4**
Follow the javascript OOP conventions like camel-case class-names methods and
property names.
- **rc5**
Class-names have a leading upper case letter.
- **rc6**
Methods and functions are starting with a lower case letter.
- **rc7**
Do not use more chars then 79 in one line.
- **rc8**
Use short and/or long description doc-strings for all definitions.
- **rc9**
Write qunit tests for each unit it is possible and try to reach 100% path
coverage.

- **rc10** Sorting imports as following:
    1. Import all standard modules and packages,
    2. then all from third party,
    3. now import your own modules or packages.
    4. Sort import names alphabetically and separate the previous defined parts
       with blank lines.
- **rc11**
Prefix global reference from global context with "this" and with "window" in
none global contexts.
- **rc12**
Don't use any abbreviations.
- **rc13**
Try to use small cyclomatic complexity in all units (less then eight is a good
measurement).
- **rc14**
Use one of the plugin pattern described in "jQuery.Tools".
- **rc15**
Use the area statement syntax to structure your code and make it possible to
fold them in many IDE's (see Structure of meta documenting below).
- **rc16**
Always think that code is more read than written.
- **rc17** By choosing witch quotes to use follow this priority.
    1. Single quote (')
    2. Double quote (")
- **rc18**
Indent function parameter which doesn't match in one line like:

        function(
            parameter1, parameter2, parameter3,
            parameter4)

        instead of:

        function(parameter1,
                 parameter2,
                 parameter3,
                 parameter4)

        or:

        function(parameter1, parameter2, parameter3,
                 parameter4)

Structure of meta documenting (see rc15)
----------------------------------------

    // region header

    window.require([['ia', 'ia-1.0'], ['ib', 'ib-2.0']]), function(ia, ib) {

    // endregion

    // region plugins

        var A = function() {

        // region (public|protected|private) (properties|methods)

            // region property or method group

                // region subproperty of method or property group

            ...

                // endregion

            // endregion

        // endregion

        };

    // endregion

    // region footer

    });

    // endregion

Structure of dependencies
-------------------------

0. window
1. window.require
3. jQuery
4. jQuery.Tools
5. jQuery.*

This means that a module in level "i" could only import a full module in its
header in level "j" if "j < i" is valid.

Author
------

t.sickert["~at~"]gmail.com (Torben Sickert)

Version
-------

1.0 stable
###

# endregion

# region classes

class Require
    ###
        This class can be used as function for defining dependencies for
        modules. Note that this function searches in the same resource as the
        first javaScript include tag in your markup if given dependency
        resource doesn't start with "http://" or "https://". You can manually
        change this behavior by adding search bases via
        "window.require.basePath".

        **example**

        >>> window.require([['jQuery', 'jquery-3.0.1']], function() {
        ...     jQuery('div#id').show('slow');
        ... });
    ###

    # region properties

    ###
        These properties could be understand as static (or class instead of
        object) properties.
    ###
    ###
        **self {Require}**
        This variable saves a static reference to this class to make self
        referencing via introspection possible.
    ###
    self = Require
    ###
        **appendTimeStamp {Boolean}**
        If setted all resources will be appended by a timestamp string to
        make each request unique.
        This is useful to workaround some browsers caching mechanisms
        which aren't required.
    ###
    this.appendTimeStamp
    ###
        **scopeIndicator {String}**
        Current scope indicator set by module.
    ###
    this.scopeIndicator = ''
    ###
        **logging** {Boolean}
        Indicates if debugging is active.
    ###
    this.logging
    ###
        **basePath {Object}**
        Saves the base path for relative defined module locations.
    ###
    this.basePath
    ###
        **localStoragePathReminderPrefix {String}**
        Save a prefix for saved paths in resolved dependencies. If prefix is
        empty (default) no paths will be saved.
    ###
    this.localStoragePathReminderPrefix
    ###
        **noConflict {Boolean}**
        If the require scope should be deleted after serving all dependencies
        are loaded this property should be set to "true".
    ###
    this.noConflict
    ###
        **injectingDomNode {DomNode}**
        Caches a reference to the dom node for injecting needed script tags.
        You can alter this property to specify where to inject required
        scripts. Default is the head node.
    ###
    this.injectingDomNode
    ###
        **initializedLoadings {String[]}**
        Saves all loaded script resources to prevent double script
        loading. You can alter this property to specify where to inject
        required scripts.
        You can add scripts you have loaded via other mechanisms.
    ###
    this.initializedLoadings
    ###
        **passiv {Boolean}**
        Indicates if require should load resource on its own. If set to false
        require doesn't load any scripts.
    ###
    this.passiv
    ###
        **includeTypes {Object}**
        Describes all supported scripts with their needed properties to
        load them. A Mapping from file endings to their script node types.
    ###
    this.includeTypes
    ###
        **defaultType {String}**
        Describes a default type if no type could be determined.
    ###
    this.defaultType
    ###
        **asynchronModulePatternHandling {Object}**
        Defines a mapping from regular expression pattern which detects all
        modules to load via ajax to their corresponding handler functions. A
        css, JavaScript and CoffeeScript loader is included by default.
    ###
    this.asynchronModulePatternHandling
    ###
        **defaultAsynchronModulePatternHandler {Object}**
        Defines all default asynchron module pattern handler.
    ###
    this.defaultAsynchronModulePatternHandler =
        '^.+\.less$': (lessContent, url) ->
            # Specify a filename, for better error messages.
            options = filename: url
            # Specify search paths for @import directives.
            options.paths = []
            if self.basePath.less? and self.basePath.less.length
                options.paths = self.basePath.less
            compiledCSSCode = null
            new window.less.Parser(options).parse lessContent, (error, tree) ->
                if error
                    self._log error, true
                else
                    styleDomNode = document.createElement 'style'
                    styleDomNode.type = 'text/css'
                    compiledCSSCode = tree.toCSS()
                    styleDomNode.appendChild window.document.createTextNode(
                        compiledCSSCode)
                    self.injectingDomNode.appendChild styleDomNode
            return [compiledCSSCode, lessContent, null]
        '^.+\.coffee$': (coffeeScriptCode, url, module) ->
            sourceRootPath = url.replace(/\\/g, '/').replace(
                /\/[^\/]*\/?$/, '/')
            localSourceRootPath = sourceRootPath.replace(/^https?:\/\/[^/]+\//,
                '/')
            fileName = module[1].substr module[1].lastIndexOf('/') + 1
            coffeeScriptCompilerOptions =
                header: '// Generated with require.js'
                sourceMap: false
                dirname: localSourceRootPath
                filename: fileName
                modulename: fileName.substr 0, fileName.lastIndexOf '.'
                generatedFile: fileName.substr(
                    0, fileName.lastIndexOf('.') + 1
                ) + 'js'
                sourceRoot: sourceRootPath
                sourceFiles: [fileName]
            if window.btoa? and window.JSON? and window.unescape? and
               window.encodeURIComponent? and self.generateSourceMaps
                coffeeScriptCompilerOptions.sourceMap = true
                # NOTE: Workaround to enable source maps for asynchron loaded
                # coffee scripts.
                try
                    {js, v3SourceMap} = window.CoffeeScript.compile(
                        coffeeScriptCode, coffeeScriptCompilerOptions)
                catch error
                    self::_log(
                        'Syntax error in source file ' +
                        "\"#{localSourceRootPath}#{fileName}\".", true)
                    throw error
                # NOTE: Additional commend syntax with "/*...*/" is necessary
                # to support internet explorer.
                window.eval(
                    "#{js}\n//# sourceMappingURL=data:application/json;" +
                    'base64,' + window.btoa(
                        window.unescape window.encodeURIComponent v3SourceMap
                    ) + "\n//# sourceURL=#{localSourceRootPath + fileName}")
                return [js, coffeeScriptCode, v3SourceMap]
            else
                window.CoffeeScript.run(
                    coffeeScriptCode, coffeeScriptCompilerOptions)
                return [null, coffeeScriptCode, null]
    ###
        **generateSourceMaps {Boolean}**
        Indicates weather source maps should be created.
    ###
    this.generateSourceMaps
    ###
        **context {Object}**
        Defines scope where the required dependencies have to be present. In
        other words "require.context" will reference "this" in given callback
        functions.
    ###
    this.context
    ###
        **onEverythingIsLoaded {Function}**
        Saves a callback function triggered if all scripts where loaded
        completely. The defined value references to "this".
    ###
    this.onEverythingIsLoaded
    ###
        **_currentSessionTimestamp {Date}**
        Saves the date and time of each session, to distinguish old local
        storage entries from new one.
    ###
    this._currentSessionTimestamp
    ###
        **_callQueue {Object[]}**
        Saves function calls to require for running them in right order to
        guarantee dependencies. It consist of a list of tuples storing
        needed dependency as string and arguments to be given to callback
        function if dependency is determined.
    ###
    this._callQueue
    ###
        **_referenceBackup {Mixed}**
        Saves the initially pointed target of global variable
        "window.require" to reset that reference in "noConflict" mode.
    ###
    this._referenceBackup = window.require

    # endregion

    # region public methods

        # region special

    constructor: (modules, onLoaded, onLoadedArguments...) ->
        ###
            This method is used as initializer. Class properties will be
            initialized if its the first call to require. This methods gets the
            same arguments as the global "require" constructor.

            **modules {Array[String[]]}** - A list of string array which
                                            describes needed modules. Every
                                            element is a tuple consisting of an
                                            object reference which has to be
                                            available after script was loading
                                            and the module name (basename of
                                            script file with or without file
                                            extension).

            **onLoaded {Function}**       - A callback function to load after
                                            all dependences are available.

            Additional arguments are forwarded to given callback function.

            **returns {Require}**         - Returns the current function
                                            (class).
        ###
        # Set class property default values.
        self.context = this if not self.context?
        self.includeTypes = {} if not self.includeTypes?
        if not self.includeTypes?.javaScript?
            self.includeTypes.javaScript =
                extension: 'js', domNodeName: 'script'
                sourcePropertyName: 'src'
                domNodeProperties: type: 'text/javascript'
        if not self.includeTypes?.cascadingStyleSheet?
            self.includeTypes.cascadingStyleSheet =
                extension: 'css', domNodeName: 'link'
                sourcePropertyName: 'href', domNodeProperties:
                    type: 'text/css', media: 'all', rel: 'stylesheet'
        self.defaultType = 'javaScript' if not self.defaultType?
        self::_determineBasePath() if not self.basePath?.all?
        for type, paths of self.basePath
            for path, index in paths
                if path.substring(path.length - 1) isnt '/'
                    self.basePath[type][index] += '/'
        if not self.localStoragePathReminderPrefix?
            self.localStoragePathReminderPrefix = ''
        self.generateSourceMaps = true if not self.generateSourceMaps?
        if not self._currentSessionTimestamp?
            self._currentSessionTimestamp = new Date
        self.appendTimeStamp = false if not self.appendTimeStamp?
        self.passiv = false if not self.passiv?
        self.logging = false if not self.logging?
        self.noConflict = false if not self.noConflict?
        self.initializedLoadings = [] if not self.initializedLoadings?
        if not self.injectingDomNode?
            self.injectingDomNode = document.getElementsByTagName('head')[0]
        if not self.asynchronModulePatternHandling?
            self.asynchronModulePatternHandling = {}
        if not self.onEverythingIsLoaded?
            self.onEverythingIsLoaded = ->
        for pattern, handler of self.defaultAsynchronModulePatternHandler
            if not self.asynchronModulePatternHandling[pattern]?
                self.asynchronModulePatternHandling[pattern] = handler
        self._callQueue = [] if not self._callQueue?
        # NOTE: A constructor doesn't return last statement by default.
        if arguments.length
            return self::_load.apply Require, arguments
        return self

        # endregion

    self.clearOldPathReminder = ->
        ###
            Removes all path reminders from local storage of other then the
            current session.

            **returns {Require}** - Returns the current function (class).
        ###
        if self.localStoragePathReminderPrefix
            for key, value of window.localStorage
                if(key.substring(
                    0, self.localStoragePathReminderPrefix.length + 1
                ) is "#{self.localStoragePathReminderPrefix}:" and
                key.substring(key.indexOf(':') + 1, key.lastIndexOf(':')) isnt
                "#{self._currentSessionTimestamp.getTime()}")
                    self::_log(
                        "Remove old stored path reference \"#{value}\".")
                    delete window.localStorage[key]
        self

    # endregion

    # region protected methods

    _determineBasePath: ->
        ###
            Searches the dom tree for useful resource paths.

            **returns {Require}** - Returns the current function (class).
        ###
        self.basePath = {} if not self.basePath?
        self.basePath.all = []
        for name, properties of self.includeTypes
            for domNode in document.getElementsByTagName properties.domNodeName
                url = domNode[properties.sourcePropertyName]
                self.basePath.all.push url.substring 0, url.lastIndexOf(
                    '/') + 1
                extension = url.substring url.lastIndexOf('.') + 1
                if extension
                    path = url.substring 0, url.lastIndexOf('/') + 1
                    if not self.basePath[extension]
                        self.basePath[extension] = [path]
                    else if path not in self.basePath[extension]
                        self.basePath[extension].push path
        self

    _load: (parameters...) ->
        ###
            Loads needed modules and run the "onLoaded" callback function. This
            methods gets the same arguments as the global "Require"
            constructor.

            **returns {Require}** - Returns the current function (class).
        ###
        ###
            This method is alway working with argument array for easy
            recursive calling itself with a dynamic number of arguments.
        ###
        ###
            If you convert arguments object to an array.

            This following outcomment line would be responsible for a bug
            in yuicompressor.
            Because of declaration of arguments the parser things that
            arguments is a local variable and could be renamed.
            It doesn't care about that the magic arguments object is
            necessary to generate the arguments array in this context.

            var arguments = Array.prototype.slice.call(arguments);

            use something like this instead:

            var parameters = Array.prototype.slice.call(arguments);
        ###
        ###
            Make sure that we have a copy of given array containing needed
            dependencies.
        ###
        if parameters[parameters.length - 1] isnt Require
            # Save a copy if initially given dependencies.
            parameters.push parameters[0].slice 0
            # Mark array as initialized.
            parameters.push Require
        parameters[0] = [parameters[0]] if typeof parameters[0] is 'string'
        if parameters[0].length
            # Grab first needed dependency from given queue.
            module = parameters[0].shift()
            if module instanceof window.Array and self::_isModuleLoaded module
                ###
                    If module is already there make a recursive call with one
                    module dependency less.
                ###
                self::_load.apply Require, parameters
            else if(
                typeof(module) is 'string' or
                not self::_isLoadingInitialized module[0], parameters
            )
                ###
                    If module is currently not loading initialize loading and
                    save function call parameter.
                ###
                module = ['', module] if typeof(module) is 'string'
                if self.passiv
                    self::_log(
                        "Prevent loading module \"#{module[0]}\" in passiv " +
                        'mode.')
                else
                    self::_initializeResourceLoading module, parameters
        else
            ###
                Call a given event handler (if provided as second argument)
                when all dependencies are determined.
            ###
            if parameters.length > 3
                parameters[1].apply(
                    self.context, self::_generateLoadedHandlerArguments(
                        parameters))
            ###
                If other dependencies aren't determined yet try to determine it
                now after a new dependency was loaded.
            ###
            if(self._callQueue.length and self::_isModuleLoaded(
                self._callQueue[self._callQueue.length - 1])
            )
                self::_load.apply Require, self._callQueue.pop()[1]
        self::_handleNoConflict()
    _initializeResourceLoading: (module, parameters, urls=[]) ->
        ###
            Initialize loading of needed resources.

            **module {String[]}**     - A tuple (consisting of module indicator
                                        and module file path) which should be
                                        loaded.

            **parameters {Object[]}** - Saves arguments indented to be given to
                                        the on load function.

            **urls {String[]}**       - A list of URLs to check for needed
                                        resource.

            **returns {Require}**     - Returns the current function (class).
        ###
        shortcut = self.asynchronModulePatternHandling
        for asynchronModulePattern, callback of shortcut
            if new window.RegExp(asynchronModulePattern).test module[1]
                if window.XMLHttpRequest
                    ajaxObject = new window.XMLHttpRequest
                else
                    ajaxObject = new window.ActiveXObject 'Microsoft.XMLHTTP'
                urls = self::_getScriptFileURLs(module[1]) if not urls.length
                url = urls.shift()
                ajaxObject.open 'GET', url, true
                ajaxObject.onreadystatechange = ->
                    # NOTE: Internet explorer throws an exception here instead
                    # of showing the error code in the "status" property.
                    try
                        readyState = ajaxObject.readyState
                    catch error
                        throw new window.Error(
                            "Loading resource \"#{module[1]}\" failed via " +
                            'asynchron request caused by exception: ' +
                            "\"#{error}\".")
                    if ajaxObject.readyState is 4
                        if ajaxObject.status in [0, 200]
                            if self.localStoragePathReminderPrefix
                                window.localStorage[self
                                    .localStoragePathReminderPrefix +
                                    ":#{self._currentSessionTimestamp
                                    .getTime()}:#{module[1]}"
                                ] = url
                            callback.apply this, [
                                ajaxObject.responseText, url, module
                            ].concat parameters
                            self::_scriptLoaded module, parameters
                            # Delete event after passing it once.
                            ajaxObject.onreadystatechange = null
                        else if ajaxObject.status isnt 200
                            self::_log(
                                "Loading resource \"#{module[1]}\" via " +
                                "url \"#{url}\" failed with status " +
                                "\"#{ajaxObject.status}\" in state " +
                                "\"#{ajaxObject.readyState}\" via asynchron " +
                                'request.')
                            if urls.length
                                self::_log "Retrying with url \"#{urls[0]}\"."
                                self::_initializeResourceLoading(
                                    module, parameters, urls)
                            else
                                self::_log(
                                    'Loading resource failed with all known ' +
                                    'base paths.')
                ajaxObject.send null
                type = 'asynchron request'
                break
        if not type?
            self::_injectLoading module, parameters
            type = 'header dom node'
        self::_log "Initialized loading of \"#{module[1]}\" via #{type}."
        self
    _generateLoadedHandlerArguments: (parameters) ->
        ###
            Generates an array of arguments from initially given arguments to
            the require constructor. The generated arguments are designed to
            give the loaded handler a useful scope.
            First all explicit additional arguments given to the require
            constructor will be given. Then all needed dependencies with their
            nested scopes will be appended. In the end the scope indicator
            strings will be appended.

            **parameters {Object[]}** - Initially given arguments.

            **returns {Object[]}**    - Returns an array of arguments.
        ###
        scopeDependencyReferences = []
        # NOTE: We ignore last value of parameters array, because the last one
        # is the parameters initialized indicator. The second last one is the
        # initial given scope dependency array.
        for parameter in parameters[parameters.length - 2]
            if parameter.length is 2
                moduleObjects = parameter[0].split '.'
                query = self.context
                for moduleObject in moduleObjects
                    query = query[moduleObject]
                    # NOTE: We only add references as long they aren't
                    # undefined.
                    if query?
                        scopeDependencyReferences.push query
                    else
                        break
        # Merge additional initially given arguments with dependency
        # references and scope indicator strings.
        parameters.slice(2, parameters.length - 2).concat(
            scopeDependencyReferences, parameters[1])
    _getScriptFileURLs: (scriptFilePath, checkAgainExtension=false) ->
        ###
            Determines all urls for given script file.

            **scriptFilePath {String}**       - Path pointing to the file
                                                resource.

            **checkAgainExtension {Boolean}** - Indicates weather the
                                                javascript file extension
                                                should be appended if no known
                                                extension is present.

            **returns {String}**        - The absolute path to needed resource.
        ###
        initialScriptFilePath = scriptFilePath
        result = []
        if new window.RegExp('^https?://.+').test scriptFilePath
            result.push scriptFilePath
        else if checkAgainExtension
            hasExtension = false
            for name, properties of self.includeTypes
                if(scriptFilePath.substr(-".#{properties.extension}".length) is
                   ".#{properties.extension}")
                    hasExtension = true
                    break
            if not hasExtension
                scriptFilePath += ".#{self.includeTypes.javaScript.extension}"
        if self.appendTimeStamp
            scriptFilePath += "?timestamp=#{(new window.Date).getTime()}"
        extension = scriptFilePath.substring scriptFilePath.lastIndexOf(
            '.'
        ) + 1
        basePaths = self.basePath.all
        if self.basePath[extension] and self.basePath[extension].length
            basePaths = self.basePath[extension]
        cacheHit = false
        if self.localStoragePathReminderPrefix
            for key of window.localStorage
                if(key.substring(
                    0, self.localStoragePathReminderPrefix.length + 1
                ) is "#{self.localStoragePathReminderPrefix}:" and
                key.substring(key.lastIndexOf(':') + 1) is
                initialScriptFilePath)
                    cacheHit = key
        for path in basePaths
            fullScriptFilePath = path + scriptFilePath
            if cacheHit and fullScriptFilePath is window.localStorage[cacheHit]
                result.unshift window.localStorage[cacheHit]
                delete window.localStorage[cacheHit]
            else
                result.push fullScriptFilePath
        result
    _injectLoading: (module, parameters, urls=[]) ->
        ###
            Injects new script loading dom nodes or initializes asynchron
            loading processes.

            **module {String[]}**     - A tuple of module name to indicate if a
                                        module is presence and its file path
                                        resource.

            **parameters {Object[]}** - Saves arguments indented to be given
                                        to the on load function.

            **urls {String[]}**       - A list of URLs to check for needed
                                        resource.

            **returns {Require}**     - Returns the current function (class).
        ###
        urls = self::_getScriptFileURLs(module[1], true) if not urls.length
        url = urls.shift()
        for name, properties of self.includeTypes
            if(url.substr(-"-#{properties.extension}".length) is
               ".#{properties.extension}")
                return self::_injectLoadingHelper(
                    module, parameters, urls, url, properties)
        self::_log(
            "No known loading node type for \"#{module[1]}\" available. " +
            "Using default type \"#{self.defaultType}\".")
        self::_injectLoadingHelper(
            module, parameters, urls, url, self.includeTypes[self.defaultType])
    _injectLoadingHelper: (module, parameters, urls, url, properties) ->
        ###
            Injects a new script loading dom node or initializes an asynchron
            loading process.

            **module {String[]}**     - A tuple of module name to indicate if a
                                        module is presence and its file path
                                        resource.

            **parameters {Object[]}** - Saves arguments indented to be given
                                        to the on load function.

            **urls {String[]}**       - A list of URLs to check for needed
                                        resource.

            **returns {Require}**     - Returns the current function (class).
        ###
        domNode = document.createElement properties.domNodeName
        domNode[properties.sourcePropertyName] = url
        for name, value in properties.domNodeProperties
            domNode[name] = value
        ###
            Internet explorer workaround for capturing event when
            script is loaded.
        ###
        onErrorCallback = ->
            self::_log(
                "Loading resource \"#{module[1]}\" via header dom " +
                "node with url \"#{url}\" failed.")
            if urls.length
                self::_log "Retrying with url \"#{urls[0]}\"."
                self::_injectLoading module, parameters, urls
            else
                self::_log(
                    'Loading resource failed with all known base ' +
                    'paths.')
            # Delete event after passing it once.
            domNode.onerror = null
            domNode.parentElement.removeChild domNode
        if domNode.readyState
            domNode.onreadystatechange = ->
                if(domNode.readyState is 'loaded' or
                   domNode.readyState is 'complete')
                    self::_scriptLoaded module, parameters
                    # Delete event after passing it once.
                    domNode.onreadystatechange = null
                else
                    onErrorCallback()
        else
            domNode.onload = ->
                if self.localStoragePathReminderPrefix
                    window.localStorage[self
                        .localStoragePathReminderPrefix +
                        ":#{self._currentSessionTimestamp
                        .getTime()}:#{module[1]}"
                    ] = url
                self::_scriptLoaded module, parameters
                # Delete event after passing it once.
                domNode.onload = null
            domNode.onerror = onErrorCallback
        self.injectingDomNode.appendChild domNode
        self
    _scriptLoaded: (module, parameters) ->
        ###
            If script was loaded it will be deleted from the
            "initializedLoading" array. If all dependencies for this module are
            available the sequence could continue otherwise the current
            sequence status (the parameters array) will be saved in a queue for
            continue later.

            **module {String[]}**     - A tuple of module name to indicate if a
                                        module is presence and its file path
                                        resource.

            **parameters {Object[]}** - Saves arguments indented to be given
                                        to the on load function.

            **returns {Require}**     -  Returns the current function (class).
        ###
        hasScopeIndicator = module[0] isnt ''
        if self.scopeIndicator and not module[0]
            module[0] = self.scopeIndicator
        self.scopeIndicator = ''
        if typeof parameters[2] is 'string'
            parameters[2] = [parameters[2]]
        for value, index in parameters[2]
            if(not hasScopeIndicator and typeof value is 'string' and
               module[1] is value)
                parameters[2][index] = module
        for value, index in self.initializedLoadings
            if module[0] is value
                self.initializedLoadings.splice index, 1
                break
        if self::_isModuleLoaded module
            self::_load.apply require, parameters
        else
            self._callQueue.push [module[0], parameters]
        self
    _handleNoConflict: ->
        ###
            If "noConflict" property is set it will be handled by this method.
            It clears the called scope from the "Require" name and optionally
            runs a callback function given by the "noConflict" property after
            all dependencies are resolved.

            **returns {Require}** - Returns the current function (class).
        ###
        if self._callQueue.length is 0 and self.initializedLoadings.length is 0
            self::_log 'All resources are loaded so far.'
            if self.noConflict
                # Restore previous setted value to the "Require" reference.
                window.require = self._referenceBackup
            self.onEverythingIsLoaded()
            self.onEverythingIsLoaded = ->
        self
    _isLoadingInitialized: (moduleName, parameters) ->
        ###
            Determines if the given "moduleObject" is currently loading. If the
            given module is currently loading the current sequence status will
            be stored in the "callQueue" for continuing later.

            **moduleName {String}**   - A module object to indicate if a module
                                        is presence.

            **parameters {Object[]}** - The current status of solving the
                                        initially described arguments.

            **returns {Boolean}**     - If given module object is currently
                                        loading "true" will be given back and
                                        "false" otherwise.
        ###
        for value in self.initializedLoadings
            if moduleName is value
                self._callQueue.push [moduleName, parameters]
                return true
        self.initializedLoadings.push(moduleName) if moduleName
        false
    _isModuleLoaded: (module) ->
        ###
            Determines if the given "moduleObject" is present in the global
            (window) scope.

            **module {String[]}**        - A tuple of module name to indicate
                                           if a module is presence and its file
                                           path.

            **returns {String|Boolean}** - If given module object is present
                                           this method will return "true" and
                                           "false" otherwise.
        ###
        query = self.context
        moduleDescription = module[1]
        if module[0]
            moduleObjects = module[0].split '.'
            for moduleObject in moduleObjects
                if query[moduleObject]
                    query = query[moduleObject]
                else
                    self::_log(
                        "\"#{module[0]}\" isn\'t available because \"" +
                        "#{moduleObject}\" is missing in \"" +
                        "#{query.toString()}\".")
                    return false
            moduleDescription = module[0]
        self::_log "\"#{moduleDescription}\" is loaded complete."
        true
    _log: (message, force=false) ->
        ###
            If logging is enabled. Method shows the given message in the
            browsers console if possible or in a standalone alert-window as
            fallback.

            **message {String}**          - A logging message

            **returns {undefined|false}** - Returns the return value of
                                            "window.console.log()" or
                                            "window.alert()" or "false" if
                                            logging is disabled.
        ###
        if self.logging or force
            if window.console and window.console.log
                return window.console.log "require: #{message}"
            return window.alert "require: #{message}"
        false

    # endregion

this.require = Require

# endregion

# region vim modline

# vim: set tabstop=4 shiftwidth=4 expandtab:
# vim: foldmethod=marker foldmarker=region,endregion:

# endregion
