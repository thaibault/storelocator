<!-- !/usr/bin/env markdown
-*- coding: utf-8 -*- -->

<!-- region header

Copyright Torben Sickert 16.12.2012

License
-------

This library written by Torben Sickert stand under a creative commons naming
3.0 unported license. see http://creativecommons.org/licenses/by/3.0/deed.de

endregion -->

<!--|deDE:Einsatz-->
Use case
--------

The main goal of This plugin is providing an generic interface logic like
controller for calling instance methods or getting property values of an object
orientated designed plugin. A set of reusable logic elements for building gui
components is integrated as well.
<!--deDE:
    Hauptziel dieses Plugins ist es einen generischen Weg zu bieten indem
    Objekt Orientierte Plugins verfasst werden können, ohne dabei gegen
    jQuery's Vorgaben an Plugins zu verstoßen.
    Desweiteren werden einige wiederverwendbare Logikbausteine zum Bau
    verschiedener GUI-Komponenten mitgeliefert.
-->

<!--|deDE:Inhalt-->
Content
------

<!--Place for automatic generated table of contents.-->
[TOC]

<!--|deDE:Merkmale-->
Features
--------

<ul>
    <li>
        Mutual exclusion for depending gui elements
        <!--deDE:Wechselseitiger Ausschluss für abhängige GUI-Elemente-->
    </li>
    <li>
        Cross browser logging with different log levels
        <!--deDE:
            Browserübergreifender Log-Mechanismen mit diversen Log-Levels
        -->
    </li>
    <li>
        Extending native JavaScript types like strings, arrays or functions
        <!--deDE:
            Erweiterung der Standard-JavaScript-Typen wie Strings, Arrays und
            Funktionen
        -->
    </li>
    <li>
        A set of helper functions to parse option objects
        <!--deDE:Hilfsfunktionen um Options-Objekte intelligent zu parsen-->
    </li>
    <li>
        Extended dom tree handling.<!--deDE:Erweitertes DOM-Baum-Management-->
    </li>
    <li>
        Plugin scoped event handling
        <!--deDE:Plugineigene Namensräume für Events-->
    </li>
    <li>
        Generic none-redundant plugin pattern for JavaScript and CoffeeScript
        <!--deDE:Generischer Plugin-Muster für JavaScript und CoffeeScript-->
    </li>
</ul>

<!--|deDE:Einstieg-->
Quick start
-----------

Easy access of a method in "$.Tools":
<!--deDE:Einfacher Aufruf einer Methode aus "$.Tools":-->

```javaScript
var tools = $.Tools({'logging': true});
tools.log('test');
```

<!--|deDE:Plugin-Vorlage in JavaScript-->
Plugin pattern in JavaScript
----------------------------

Use as extension for object orientated jQuery plugin using inheritance and dom
node reference. This plugin pattern gives their instance back if no dom node is
provided. Direct initializing the plugin without providing a dom node is also
provided.
<!--deDE:
    Einsatz von "$.Tools" um Objekt orientierte jQuery Plugins zu verfassen,
    indem von "$.Tools" geerbt wird und der durch jQuery erweiterte DOM-Knoten
    referenziert wird. Sollte kein DOM-Knoten an die $-Funktion übergeben
    worden sein, gibt dieser Pattern seine Instanz zurück.
-->

    #!/usr/bin/env javaScript
    // -*- coding: utf-8 -*-

    ;(function($) {
        var Example = function($domNode) {
            this.$domNode = $domNode;
            this._options = {...};
            this.__name__ = 'Example';
            this.initialize = function(options) {
                /*
                    "this.$domNode" points to jQuery's wrapped dom node
                                    (if provided).
                    "this"          points to the "Example" instance extended
                                    by "Tools".
                */
                if(options)
                    // Merges given options with default options recursively.
                    this._options = $.extend(true, {}, this._options, options);
                return this.$domNode || this;
            };
            this.method = function(anArgument) {
                ...
                return returnValue;
            };
            ...
        };
        $.fn.Example = function() {
            return $.Tools().controller(Example, arguments, this);
        };
        $.Example = function() {
            return $.Tools().controller(Example, arguments);
        };
        // Allows to reference the native class, e.g. to inherit from Example.
        $.Example.class = Example;
    }).call(this, this.jQuery);

Initialisation with given dom node and without:
<!--deDE:Aufruf mit und ohne übergebenen DOM-Knoten:-->

```javaScript
$domNode = $('#domNode').Example({firstOption: 'value'...});
exampleInstance = $.Example({firstOption: 'value'...});
```

Function call from previous generated instance via dom node or instance
reference:
<!--deDE:
    Aufruf einer Plugin-Method anhand der zuvor generierten Instanzreferenz
    bzw. über den zurückgegebene DOM-Knoten:
-->

```javaScript
returnValue = $('#domNode').Example('method', 'anArgument');
returnValue = $('#domNode').Example().method('anArgument');
exampleInstance = $.Example firstOption: 'value'...
returnValue = exampleInstance.method 'anArgument'
```

Use as extension for default functional orientated jQuery plugin pattern
using composition, dom node reference and chaining support.
<!--deDE:
    Sollte der standard jQuery-Pattern eingesetzt werden kann wie hier
    beschrieben auf die Methoden von "$.Tools" zugegriffen werden.
-->

    #!/usr/bin/env javaScript
    // -*- coding: utf-8 -*-

    ;(function($) {
        var options = {...};
        var tools = $.Tools();
        var example = function(options) {
            // "this" points to dom node grabbed by jQuery.
            if (options)
                this._options = $.extend(true, {}, this._options, options);
            tools.log('initialized.');
            ...
        };
        $.fn.example = function() {
            if (methods[method])
                return methods[method].apply(
                    this, Array.prototype.slice.call(arguments, 1));
            else if ($.type(method) === 'object' || !method)
                return methods.init.apply(this, arguments);
            else
                $.error(
                    'Method ' + method + ' does not exist on ' +
                    'jQuery.example');
        };
    }).call(this, this.jQuery);

Function call:<!--deDE:Funktionsaufruf:-->

```javaScript
var $domNode = $('#domNode').example({'firstOption': 'value'...});
```

<!--|deDE:Plugin-Vorlage in CoffeeScript-->
Plugin pattern in CoffeeScript
------------------------------

Use as extension for object orientated jQuery plugin using inheritance and dom
node reference. This plugin pattern gives their instance back if no dom node is
provided. Direct initializing the plugin without providing a dom node is also
provided.
<!--deDE:
    Einsatz von "$.Tools" um Objekt orientierte jQuery Plugins zu verfassen,
    indem von "$.Tools" geerbt wird und der durch jQuery erweiterte DOM-Knoten
    referenziert wird. Sollte kein DOM-Knoten an die $-Funktion übergeben
    worden sein, gibt dieser Pattern seine Instanz zurück.
-->

    #!/usr/bin/env coffee
    # -*- coding: utf-8 -*-

    class Example extends $.Tools.class
        __name__: 'Example'
        initialize: (options={}) ->
            ###
                "this.$domNode" points to jQuery's wrapped dom node
                (if provided).
                "this" points to this "Example" instance extended by "Tools".
                Merges given options with default options recursively.
            ###
            this._options: {...}
            # Merges given options with default options recursively.
            super options
            this.$domNode or this
        method: (anArgument) ->
            ...
            returnValue
        ...
    $.fn.Example = -> $.Tools().controller Example, arguments, this
    $.Example = -> $.Tools().controller Example, arguments
    # Allows to reference the native class, e.g. to inherit from Example.
    $.Example.class = Example

Initialisation with given dom node and without:
<!--deDE:Aufruf mit übergebenen DOM-Knoten und ohne:-->

```coffee
$domNode = $('#domNode').Example firstOption: 'value'...
exampleInstance = $.Example firstOption: 'value'...
```

Function call from previous generated instance via dom node or instance
reference:
<!--deDE:
    Aufruf einer Plugin-Method anhand der zuvor generierten Instanzreferenz
    bzw. über den zurückgegebene DOM-Knoten:
-->

```coffee
returnValue = $('#domNode').Example 'method', 'anArgument'
returnValue = $('#domNode').Example().method 'anArgument'
exampleInstance = $.Example firstOption: 'value'...
returnValue = exampleInstance.method 'anArgument'
```

Use as extension for default functional orientated jQuery plugin pattern
using composition, dom node reference and chaining support.
<!--deDE:
    Sollte der standard jQuery-Pattern eingesetzt werden kann wie hier
    beschrieben auf die Methoden von "$.Tools" zugegriffen werden.
-->

    #!/usr/bin/env coffee
    # -*- coding: utf-8 -*-

    defaultOptions = {...}
    tools = $.Tools
    example = (options={}) ->
        # "this" points to dom node grabbed by jQuery.
        $.extend true, defaultOptions, options
        tools.log 'initialized.'
        ...
    $.fn.example = ->
        if methods[method]
            methods[method].apply(
                this, Array.prototype.slice.call arguments, 1)
        else if $.type(method) is 'object' or not method
            methods.init.apply this, arguments
        else
            $.error "Method \"#{method}\" does not exist on $.example."

Function call:<!--deDE:Funktionsaufruf:-->

```coffee
$domNode = $('#domNode').example firstOption: 'value'...
```

<!-- region modline

vim: set tabstop=4 shiftwidth=4 expandtab:
vim: foldmethod=marker foldmarker=region,endregion:

endregion -->
