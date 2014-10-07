#!/usr/bin/env coffee
# -*- coding: utf-8 -*-

# region header

###
[Project page](https://thaibault.github.com/jQuery-storeLocator)

This plugin provides a google api based store locator.

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

t.sickert@gmail.com (Torben Sickert)

Version
-------

1.0 stable
###

main = ($) ->

# endregion

# region plugins/classes

    class StoreLocator extends $.Tools.class
        ###
            A jQuery storelocator plugin.

            Expected store data format:

            {latitude: float, longitude: float, iconFileName: string}
        ###
        __name__: 'StoreLocator'
        initialize: (options={}) ->
            ###Entry point for object orientated jQuery plugin.###
            this.currentlyOpenWindow = null
            this._options =
                stores: '/StoreLocatorData.json'
                infoBox: null, iconPath: '/webAsset/image/storeLocator/'
                # Initialize map with center in current location determined by
                # internet protocol address.
                startLocation: null
                ip: null
                ipToLocationAPIURL: '{1}://freegeoip.net/json/{2}'
                map: zoom: 11
                onLoaded: $.noop
                showInputAfterLoadedDelayInMilliseconds: 4000
                inputFadeInOption: duration: 'fast'
            # Merges given options with default options recursively.
            super options
            # Grab dom nodes
            this.$domNodes = this.grabDomNode this._options.domNode
            if this._options.startLocation?
                this.initializeMap()
            else
                $.ajax {
                    url: this.stringFormat(
                        this._options.ipToLocationAPIURL
                        document.location.protocol.substring(
                            0, document.location.protocol.length - 1
                        ), this._options.ip or ''
                    )
                    jsonp: 'callback', dataType: 'jsonp'
                    success: (currentLocation) =>
                        this._options.startLocation = currentLocation
                        this.initializeMap()
                }
            this.$domNode or this
        initializeMap: ->
            ###Initializes cluster, info windows and marker.###
            this._options.map.center = new window.google.maps.LatLng(
                this._options.startLocation.latitude
                this._options.startLocation.longitude)
            this.map = new window.google.maps.Map $('<div>').appendTo(
                this.$domNode
            )[0], this._options.map
            markerCluster = new window.MarkerClusterer this.map
            # Add a marker for each retrieved store.
            if $.isArray this._options.stores
                for store in this._options.stores
                    markerCluster.addMarker this.addStore store
            else
                $.getJSON this._options.stores, (stores) =>
                    for store in stores
                        markerCluster.addMarker this.addStore store
            # Create the search box and link it to the UI element.
            searchInputDomNode = this.$domNode.find('input')[0]
            this.map.controls[window.google.maps.ControlPosition.TOP_LEFT]
            .push searchInputDomNode
            searchBox = new window.google.maps.places.SearchBox(
                searchInputDomNode)
            # Listen for the event fired when the user selects an item from the
            # pick list. Retrieve the matching places for that item.
            window.google.maps.event.addListener(
                searchBox, 'places_changed', => this.map.setCenter(
                    searchBox.getPlaces()[0].geometry.location))
            # Bias the search box results towards places that are within the
            # bounds of the current map's viewport.
            window.google.maps.event.addListener this.map, 'bounds_changed', =>
                searchBox.setBounds this.map.getBounds()
            this.fireEvent 'loaded'
            this
        onLoaded: ->
            ###Is triggered if the complete map ist loaded.###
            window.setTimeout (=>
                this.$domNode.find('input').fadeIn(
                    this._options.inputFadeInOption)
            ), this._options.showInputAfterLoadedDelayInMilliseconds
            this
        addStore: (store) ->
            ###Registers given store to the google maps canvas.###
            marker = new window.google.maps.Marker
                position: new window.google.maps.LatLng(
                    store.latitude, store.longitude)
                map: this.map, title: ''
                icon: this._options.iconPath + store.iconFileName
            infoWindow = new window.google.maps.InfoWindow
                content: this.makeInfoWindow store
            window.google.maps.event.addListener marker, 'click', =>
                this.currentlyOpenWindow.close() if this.currentlyOpenWindow?
                this.currentlyOpenWindow = infoWindow
                infoWindow.open this.map, marker
            marker
        makeInfoWindow: (store) ->
            ###
                Takes the info window data for a store and creates the HTML
                content of the info window.
            ###
            if $.isFunction this._options.infoBox
                return this._options.infoBox store
            if this._options.infoBox?
                return this._options.infoBox
            content = '<div>'
            for name, value of store
                content += "#{name}: #{value}<br />"
            "#{content}</div>"

    $.fn.StoreLocator = -> $.Tools().controller StoreLocator, arguments, this

# endregion

# region dependencies

if this.require?
    this.require.scopeIndicator = 'jQuery.fn.StoreLocator'
    this.require 'jquery-tools-1.0.coffee', main
else
    main this.jQuery

# endregion

# region vim modline

# vim: set tabstop=4 shiftwidth=4 expandtab:
# vim: foldmethod=marker foldmarker=region,endregion:

# endregion
