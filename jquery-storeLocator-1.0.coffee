#!/usr/bin/env coffee
# -*- coding: utf-8 -*-

# region header

###
[Project page](http://torben.website/jQuery-storeLocator)

This plugin provides a google application interface based store locator.

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

    class StoreLocator extends $.Tools.class
        ###
            A jQuery storelocator plugin.

            Expected store data format:

            {latitude: NUMBER, longitude: NUMBER, markerIconFileName: STRING}
        ###
        __name__: 'StoreLocator'
        initialize: (options={}) ->
            ###Entry point for object orientated jQuery plugin.###

            # region properties

            # Saves last found search results.
            this.currentSearchResults = []
            # Saves last searched string.
            this.currentSearchText = null
            # Saves currently opened results dom node or null if no results
            # exists yet.
            this.resultsDomNode = null
            # Saves current search results content dom node.
            this.currentSearchResultsDomNode = null
            # Saves currently opened window instance.
            this.currentlyOpenWindow = null
            # Saves currently highlighted marker instance.
            this.currentlyHighlightedMarker = null
            # Indicates weather current search results aren't valid anymore.
            this.searchResultsDirty = false
            # Saves all seen locations to recognize duplicates.
            this.seenLocations = []
            # Saves all recognized markers.
            this.markers = []
            # Public editable property to set current search result range. This
            # is useful for pagination implementations in template level.
            this.currentSearchResultRange = null
            # Saves all plugin interface options.
            this._options =
                ###
                    URL to retrieve stores, list of stores or object describing
                    bounds to create random stores within. If a
                    "generateProperties" function is given it will be called to
                    retrieve additional properties for each store. The
                    specified store will be given to the function.
                ###
                stores: {
                    northEast: latitude: 85, longitude: 180
                    southWest: latitude: -85, longitude: -180
                    number: 100, generateProperties: (store) -> {}
                }
                # Additional static store properties which will be available to
                # each store.
                addtionalStoreProperties: {}
                # Path prefix to search for marker icons.
                iconPath: '/webAsset/image/storeLocator/'
                ###
                    Specifies a fallback marker icon (if no store specific icon
                    was set). If set to "null" google will place a fallback
                    icon.
                ###
                defaultMarkerIconFileName: null
                ###
                    If not provided we initialize the map with center in
                    current location determined by internet protocol address.
                ###
                startLocation: null
                # Fallback location if automatic detection fails.
                fallbackLocation: latitude: 51.124213, longitude: 10.147705
                ###
                    Current ip. If set to "null" ip will be determined
                    dynamically
                ###
                ip: null
                ipToLocation:
                    ###
                        IP to location determination application interface url.
                        {1} and {2} represents currently used protocol and
                        potentially given ip.
                    ###
                    applicationInterfaceURL: '{1}://freegeoip.net/json/{2}'
                    ###
                        Time to wait for ip resolve. If time is up initialize
                        on given fallback location.
                    ###
                    timeoutInMilliseconds: 5000
                # Initial view properties.
                map: zoom: 3
                # Delay before we show search input field.
                showInputAfterLoadedDelayInMilliseconds: 500
                # Transition to show search input field.
                inputFadeInOption: duration: 'fast'
                ###
                    Distance to move if stores are determined with same
                    latitude and longitude.
                ###
                distanceToMoveByDuplicatedEntries: 0.0001
                # Options passed to the marker cluster.
                markerCluster: gridSize: 100, maxZoom : 11
                ###
                    Specifies a zoom value wich will be adjusted after
                    successfully picked a search result. If set to "null" no
                    zoom change happens.
                ###
                successfulSearchZoom: 12
                infoWindow:
                    ###
                        Function or string returning or representing the info
                        box. If a function is given and a promise is returned
                        the info box will be filled with the given loading
                        content and updated with the resolved data. The
                        function becomes the corresponding marker as first
                        argument and the store locator instance as second
                        argument. If nothing is provided all available data
                        will be listed in a generic info window.
                    ###
                    content: null
                    ###
                        Additional move to bottom relative to the marker if an
                        info window has been opened.
                    ###
                    additionalMoveToBottomInPixel: 120
                    ###
                        Content to show in the info window during info window
                        load.
                    ###
                    loadingContent: '<div class="idle">loading...</div>'
                ###
                    If a number is given a generic search will be provided and
                    given number will be interpret as search result precision
                    tolerance to identify a marker as search result. If an
                    object is given it indicates what should be search for. The
                    object can hold up to nine keys. "properties" to specify
                    which store data should contain given search text,
                    "maximumNumberOfResults" to limit the auto complete result,
                    "loadingContent" to display while the results are loading,
                    "numberOfAdditionalGenericPlaces" a tuple describing a
                    range of minimal to maximal limits of additional generic
                    google suggestions depending on number of local search
                    results, "maximalDistanceInMeter" to specify maximal
                    distance from current position to search suggestions,
                    "genericPlaceFilter" specifies a function which gets a
                    relevant place to decide if the place should be included
                    (returns a boolean value), "prefereGenericResults"
                    specifies a boolean value indicating if generic search
                    results should be the first results,
                    "genericPlaceSearchOptions" specifies how a generic place
                    search should be done (google maps request object
                    specification) and "content" to render the search results.
                    "content" can be a function or string returning or
                    representing the search results. If a function is given and
                    a promise is returned the info box will be filled with the
                    given loading content and updated with the resolved data.
                    The function becomes search results as first argument, a
                    boolean value as second argument indicating if the maximum
                    number of search results was reached and the store locator
                    instance as third argument. If nothing is provided all
                    available data will be listed in a generic info window.
                ###
                searchBox: 50
                # Function to call if map is fully initialized.
                onLoaded: $.noop
                # Triggers if a marker info window will be opened.
                onInfoWindowOpen: $.noop
                # Triggers if a marker info window has finished opening.
                onInfoWindowOpened: $.noop
                # Triggers before new search results appears.
                onAddSearchResults: $.noop
                # Triggers before old search results will be removed.
                onRemoveSearchResults: $.noop
                # Triggers before search result box appears.
                onOpenSearchResults: $.noop
                # Triggers before search result box will be hidden.
                onCloseSearchResults: $.noop
                # Triggers after a marker starts to highlight.
                onMarkerHighlighted: $.noop

            # endregion

            # Merges given options with default options recursively.
            super options
            # Grab dom nodes
            this.$domNodes = this.grabDomNode this._options.domNode
            if this._options.startLocation?
                this.initializeMap()
            else
                this._options.startLocation = this._options.fallbackLocation
                # NOTE: If request is slower than the timeout parameter for
                # jsonp request the padding function isn't set anymore so an
                # error occurs. That's why we use our own timeout
                # implementation.
                loaded = false
                window.setTimeout (=> if not loaded
                    loaded = true
                    this.initializeMap()
                ), this._options.ipToLocation.timeoutInMilliseconds
                $.ajax(
                    url: this.stringFormat(
                        this._options.ipToLocation.applicationInterfaceURL
                        document.location.protocol.substring(
                            0, document.location.protocol.length - 1
                        ), this._options.ip or ''
                    ), dataType: 'jsonp', cache: true
                ).always (currentLocation, textStatus) => if not loaded
                    loaded = true
                    if textStatus is 'success'
                        this._options.startLocation = currentLocation
                    this.initializeMap()
            this.$domNode or this
        initializeMap: ->
            ###Initializes cluster, info windows and marker.###
            this._options.map.center = new window.google.maps.LatLng(
                this._options.startLocation.latitude
                this._options.startLocation.longitude)
            this.map = new window.google.maps.Map $('<div>').appendTo(
                this.$domNode
            )[0], this._options.map
            markerCluster = new window.MarkerClusterer(
                this.map, [], this._options.markerCluster)
            # Add a marker for each retrieved store.
            if $.isArray this._options.stores
                for store in this._options.stores
                    $.extend(
                        true, store, this._options.addtionalStoreProperties)
                    markerCluster.addMarker this.createMarker store
            else if $.type(this._options.stores) is 'string'
                $.getJSON this._options.stores, (stores) =>
                    for store in stores
                        $.extend(
                            true, store
                            this._options.addtionalStoreProperties)
                        markerCluster.addMarker this.createMarker store
            else
                southWest = new window.google.maps.LatLng(
                    this._options.stores.southWest.latitude
                    this._options.stores.southWest.longitude)
                northEast = new window.google.maps.LatLng(
                    this._options.stores.northEast.latitude
                    this._options.stores.northEast.longitude)
                for index in [0...this._options.stores.number]
                    store = $.extend {
                        latitude: southWest.lat() + (northEast.lat(
                        ) - southWest.lat()) * window.Math.random()
                        longitude: southWest.lng() + (northEast.lng(
                        ) - southWest.lng()) * window.Math.random()
                    }, this._options.addtionalStoreProperties
                    markerCluster.addMarker this.createMarker $.extend(
                        store, this._options.stores.generateProperties store)
            # Create the search box and link it to the UI element.
            this.map.controls[window.google.maps.ControlPosition.TOP_LEFT]
            .push this.$domNode.find('input')[0]
            if $.type(this._options.searchBox) is 'number'
                this.initializeGenericSearchBox()
            else
                window.google.maps.event.addListener this.map, 'click', =>
                    this.closeSearchResults()
                window.google.maps.event.addListener this.map, 'dragstart', =>
                    this.closeSearchResults()
                this._options.searchBox = $.extend true, {
                    maximumNumberOfResults: 50
                    numberOfAdditionalGenericPlaces: [2, 5]
                    maximalDistanceInMeter: 1000000
                    loadingContent: this._options.infoWindow.loadingContent
                    genericPlaceFilter: (place) ->
                        place.formatted_address.indexOf(
                            ' Deutschland'
                        ) isnt -1 or place.formatted_address.indexOf(
                            ' Germany'
                        ) isnt -1
                    prefereGenericResults: true
                    genericPlaceSearchOptions: radius: '50000', types: [
                        'locality', 'political', 'postal_code']
                }, this._options.searchBox
                this.initializeDataSourceSearchBox()
            # Close marker if zoom level is bigger than the aggregation.
            google.maps.event.addListener this.map, 'zoom_changed', =>
                if(
                    this.currentlyOpenWindow? and
                    this.currentlyOpenWindow.isOpen and
                    this.map.getZoom() <= this._options.markerCluster.maxZoom
                )
                    this.currentlyOpenWindow.close()
                    this.currentlyOpenWindow.isOpen = false
            this.fireEvent 'loaded'
            this
        initializeDataSourceSearchResultsBox: ->
            ###Position search results right below the search input field.###
            cssProperties = {}
            for propertyName in [
                'position', 'width', 'top', 'left', 'border'
            ]
                cssProperties[propertyName] = this.$domNode.find('input').css(
                    propertyName)
            cssProperties.marginTop = this.$domNode.find('input').outerHeight(
                true)
            # Prepare search result positioning.
            this.resultsDomNode = $('<div>').addClass(
                this.stringCamelCaseToDelimited(
                    "#{this.__name__}SearchResults")
            ).css cssProperties
            # Inject the final search results into the dom tree.
            this.$domNode.find('input').after this.resultsDomNode
        initializeDataSourceSearchBox: ->
            ###
                Initializes a data source based search box to open and focus
                them matching marker.
            ###
            this.on this.$domNode, 'keydown', (event) =>
                # NOTE: Events that doesn't occurs in search context are
                # handled by the native map implementation and won't be
                # propagated so we doesn't have to care about that.
                if this.currentSearchResults.length
                    if this.currentSearchResultRange
                        this.currentSearchResultRange = [
                            window.Math.max(
                                0, this.currentSearchResultRange[0])
                            window.Math.min(
                                this.currentSearchResults.length - 1
                                this.currentSearchResultRange[1])]
                    else
                        this.currentSearchResultRange = [
                            0, this.currentSearchResults.length - 1]
                    currentIndex = this.currentSearchResults.indexOf(
                        this.currentlyHighlightedMarker)
                    if event.keyCode is this.keyCode.DOWN
                        if(currentIndex is -1 or
                           this.currentSearchResultRange[1] < currentIndex + 1)
                            this.highlightMarker(
                                null, this.highlightMarker
                                this.currentSearchResults[this
                                .currentSearchResultRange[0]], event)
                        else
                            this.highlightMarker(
                                null, this.highlightMarker
                                this.currentSearchResults[currentIndex + 1]
                                event)
                    else if event.keyCode is this.keyCode.UP
                        if currentIndex in [
                            this.currentSearchResultRange[0], -1
                        ]
                            this.highlightMarker(
                                null, this.highlightMarker
                                this.currentSearchResults[this
                                .currentSearchResultRange[1]], event)
                        else
                            this.highlightMarker(
                                null, this.highlightMarker
                                this.currentSearchResults[currentIndex - 1]
                                event)
                    else if(event.keyCode is this.keyCode.ENTER and
                            this.currentlyHighlightedMarker)
                        event.stopPropagation()
                        if this.currentlyHighlightedMarker.infoWindow
                            this.openMarker(
                                null, this.openMarker
                                this.currentlyHighlightedMarker, event)
                        else
                            this.openPlace(
                                this.currentlyHighlightedMarker.data
                                this.openPlace, event)
            this.on this.$domNode.find('input'), 'focus', =>
                this.openSearchResults() if this.currentSearchText
            this.on this.$domNode.find('input'), 'keydown', (event) =>
                for name, keyCode of this.keyCode
                    return if event.keyCode is keyCode and name not in ['DOWN']
                this.openSearchResults() if this.currentSearchText
            this.on this.$domNode.find('input'), 'click', =>
                this.openSearchResults() if this.currentSearchText
            window.google.maps.event.addListener this.map, 'center_changed', =>
                # NOTE: Search results depends on current position.
                if this.currentSearchText and this.resultsDomNode?
                    this.searchResultsDirty = true
            this.on(
                this.$domNode.find('input'), 'keyup'
                this.getUpdateSearchResultsHandler())
            this
        getUpdateSearchResultsHandler: ->
            placesService = new google.maps.places.PlacesService this.map
            this.debounce ((event) =>
                for name, keyCode of this.keyCode
                    return if event?.keyCode is keyCode and name not in [
                        'DELETE', 'BACKSPACE']
                this.acquireLock "#{this.__name__}Search", =>
                    searchText = $.trim this.$domNode.find('input').val()
                    if(
                        this.currentSearchText is searchText and
                        not this.searchResultsDirty
                    )
                        return this.releaseLock "#{this.__name__}Search"
                    this.searchResultsDirty = false
                    if not this.resultsDomNode
                        this.initializeDataSourceSearchResultsBox()
                    if not searchText
                        this.currentSearchText = ''
                        this.currentSearchResults = []
                        this.resultsDomNode.html ''
                        this.currentSearchResultsDomNode = null
                        this.closeSearchResults()
                        return this.releaseLock "#{this.__name__}Search"
                    this.openSearchResults()
                    loadingDomNode = $ this._options.searchBox.loadingContent
                    if not this.fireEvent(
                        'addSearchResults', false, this, loadingDomNode
                        this.resultsDomNode
                        this.currentSearchResultsDomNode or []
                    )
                        this.resultsDomNode.html loadingDomNode
                    if this.currentSearchResultsDomNode?.length
                        this.fireEvent(
                            'removeSearchResults', false, this
                            this.currentSearchResultsDomNode)
                    this.currentSearchResultsDomNode = loadingDomNode
                    if this._options.searchBox.numberOfAdditionalGenericPlaces
                        # NOTE: Google searches for more items than exists in
                        # the specified radius. However the radius is a string
                        # in the examples provided by google.
                        placesService.textSearch $.extend({
                            query: searchText, location: this.map.getCenter()
                        }, this._options.searchBox.genericPlaceSearchOptions
                        ), (places) => if places
                            this.handleGenericSearchResults places, searchText
                    else
                        this.performLocalSearch searchText
            ), 1000
        handleGenericSearchResults: (places, searchText) ->
            ###Sorts and filters search results given by the google api.###
            searchResults = []
            # NOTE: Since google text search doesn't support sorting by
            # distance we have to sort by our own.
            index = 1
            for place in places.sort((firstPlace, secondPlace) =>
                window.google.maps.geometry.spherical.computeDistanceBetween(
                    this.map.getCenter(), firstPlace.geometry.location
                ) - window.google.maps.geometry.spherical\
                .computeDistanceBetween(
                    this.map.getCenter(), secondPlace.geometry.location)
            )
                index += 1
                distance = window.google.maps.geometry.spherical
                .computeDistanceBetween(
                    this.map.getCenter(), place.geometry.location)
                if distance > this._options.searchBox.maximalDistanceInMeter
                    break
                if this._options.searchBox.genericPlaceFilter place
                    result =
                        data: $.extend place, {
                            logoFilePath: place.icon.replace(
                                /^http:(\/\/)/
                                "#{document.location.protocol}$1")
                            address: place.formatted_address
                            distance: distance
                        }
                        position: place.geometry.location
                        open: do (place) => (event) =>
                            this.openPlace place, this.openPlace, event
                        highlight: (event, type) ->
                            this.isHighlighted = type isnt 'stop'
                    searchResults.push result
                    if this._options.searchBox
                    .numberOfAdditionalGenericPlaces[1] < index
                        break
            this.performLocalSearch searchText, searchResults
        performLocalSearch: (searchText, searchResults=[]) ->
            ###Performs a search on locally given store data.###
            numberOfGenericSearchResults = searchResults.length
            for marker in this.markers
                for key in this._options.searchBox.properties
                    if (
                        marker.data[key] or marker.data[key] is 0
                    ) and "#{marker.data[key]}".toLowerCase().replace(
                        /[-_&]+/g, ' '
                    ).indexOf(searchText.toLowerCase().replace(
                        /[-_&]+/g, ' '
                    )) isnt -1
                        do (marker) =>
                            marker.open = (event) =>
                                this.openMarker(
                                    null, this.openMarker, marker, event)
                            marker.highlight = (event, type) =>
                                this.highlightMarker(
                                    null, this.highlightMarker, marker, event
                                    type)
                        searchResults.push marker
                        break
            if this._options.searchBox.numberOfAdditionalGenericPlaces
                # Remove generic place results if there are enough local search
                # results.
                if(searchResults.length and numberOfGenericSearchResults >
                   this._options.searchBox.numberOfAdditionalGenericPlaces[0])
                    if searchResults.length >
                    this._options.searchBox.numberOfAdditionalGenericPlaces[1]
                        searchResults.splice(
                            this._options.searchBox
                                .numberOfAdditionalGenericPlaces[0]
                            numberOfGenericSearchResults - this._options
                                .searchBox.numberOfAdditionalGenericPlaces[0])
            # Slice additional unneeded local search results.
            limitReached = false
            if this._options.searchBox.maximumNumberOfResults <
            searchResults.length
                limitReached = true
                searchResults.splice(
                    this._options.searchBox.maximumNumberOfResults
                    searchResults.length)
            # Sort results by current map center form nearer to more fare away
            # results.
            searchResults.sort (first, second) =>
                return -1 if(this._options.searchBox.prefereGenericResults and
                             not first.infoWindow and second.infoWindow)
                return +1 if(this._options.searchBox.prefereGenericResults and
                             not second.infoWindow and first.infoWindow)
                window.google.maps.geometry.spherical.computeDistanceBetween(
                    this.map.getCenter(), first.position
                ) - window.google.maps.geometry.spherical\
                .computeDistanceBetween this.map.getCenter(), second.position
            # Compile search results markup.
            resultsRepresentation = this.makeSearchResults(
                searchResults, limitReached)
            if $.type(resultsRepresentation) is 'string'
                resultsRepresentationDomNode = $ resultsRepresentation
                if not this.fireEvent(
                    'addSearchResults', false, this
                    resultsRepresentationDomNode, this.resultsDomNode
                    this.currentSearchResultsDomNode or []
                )
                    this.resultsDomNode.html resultsRepresentationDomNode
                if this.currentSearchResultsDomNode?.length
                    this.fireEvent(
                        'removeSearchResults', false, this
                        this.currentSearchResultsDomNode)
                this.currentSearchResultsDomNode = resultsRepresentationDomNode
                window.setTimeout => this.releaseLock "#{this.__name__}Search"
            else
                resultsRepresentation.then (resultsRepresentation) =>
                    resultsRepresentationDomNode = $ resultsRepresentation
                    if not this.fireEvent(
                        'addSearchResults', false, this
                        resultsRepresentationDomNode, this.resultsDomNode
                        this.currentSearchResultsDomNode or []
                    )
                        this.resultsDomNode.html resultsRepresentationDomNode
                    if this.currentSearchResultsDomNode?.length
                        this.fireEvent(
                            'removeSearchResults', false, this
                            this.currentSearchResultsDomNode)
                    this.currentSearchResultsDomNode =
                        resultsRepresentationDomNode
                    this.releaseLock "#{this.__name__}Search"
            this.currentSearchText = searchText
            this.currentSearchResults = searchResults.slice()
            this
        openSearchResults: (event) ->
            ###Opens current search results.###
            event?.stopPropagation()
            this.getUpdateSearchResultsHandler() event
            if this.resultsDomNode? and not this.resultsDomNode.hasClass(
                'open'
            ) and not this.fireEvent(
                'openSearchResults', false, this, event, this.resultsDomNode
            )
                this.resultsDomNode.addClass 'open'
            this
        closeSearchResults: (event) ->
            ###Closes current search results.###
            event?.stopPropagation()
            if this.resultsDomNode? and this.resultsDomNode.hasClass(
                'open'
            ) and not this.fireEvent(
                'closeSearchResults', false, this, event, this.resultsDomNode
            )
                this.resultsDomNode.removeClass 'open'
            this
        initializeGenericSearchBox: ->
            ###
                Initializes googles generic search box and tries to match to
                open and focus them.
            ###
            searchBox = new window.google.maps.places.SearchBox(
                this.$domNode.find('input')[0])
            # Bias the search box results towards places that are within the
            # bounds of the current map's viewport.
            window.google.maps.event.addListener this.map, 'bounds_changed', =>
                searchBox.setBounds this.map.getBounds()
            # Listen for the event fired when the user selects an item from the
            # pick list. Retrieve the matching places for that item.
            window.google.maps.event.addListener(
                searchBox, 'places_changed', => this.ensurePlaceLocations(
                    searchBox.getPlaces(), (places) =>
                        foundPlace = this.determineBestSearchResult places
                        if foundPlace?
                            shortestDistanceInMeter = window.Number.MAX_VALUE
                            matchingMarker = null
                            for marker in this.markers
                                distanceInMeter = window.google.maps.geometry
                                .spherical.computeDistanceBetween(
                                    foundPlace.geometry.location
                                    marker.position)
                                if distanceInMeter < shortestDistanceInMeter
                                    shortestDistanceInMeter = distanceInMeter
                                    matchingMarker = marker
                            if(
                                matchingMarker and shortestDistanceInMeter <=
                                this._options.searchBox
                            )
                                if this._options.successfulSearchZoom?
                                    this.map.setZoom(
                                        this._options.successfulSearchZoom)
                                return this.openMarker(
                                    foundPlace, this.openMarker
                                    matchingMarker)
                            if this.currentlyOpenWindow?
                                this.currentlyOpenWindow.close()
                                this.currentlyOpenWindow.isOpen = false
                            this.map.setCenter foundPlace.geometry.location
                            if this._options.successfulSearchZoom?
                                this.map.setZoom(
                                    this._options.successfulSearchZoom)
                )
            )
            this
        ensurePlaceLocations: (places, onSuccess) ->
            ###Ensures that every given place have a location property.###
            runningGeocodes = 0
            for place in places
                if not place.geometry?.location?
                    this.warn(
                        'Found place "{1}" doesn\'t have a location. ' +
                        'Full object:', place.name)
                    this.warn place
                    this.info(
                        'Geocode will be determined separately. With ' +
                        'address "{1}".', place.name)
                    if not geocoder?
                        geocoder = new window.google.maps.Geocoder()
                    runningGeocodes += 1
                    geocoder.geocode {address: place.name}, (
                        results, status
                    ) ->
                        runningGeocodes -= 1
                        if status is window.google.maps.GeocoderStatus.OK
                            place.geometry = results[0].geometry
                        else
                            delete places[places.indexOf place]
                            this.warn(
                                'Found place "{1}" couldn\'t be geocoded by '
                                'google. Removing it from the places list.')
                        if runningGeocodes is 0
                            onSuccess places
            this
        determineBestSearchResult: (candidates) ->
            ###
                Determines the best search result from given list of
                candidates. Currently the nearest result to current viewport
                will be preferred.
            ###
            result = null
            if candidates.length
                shortestDistanceInMeter = window.Number.MAX_VALUE
                for candidate in candidates
                    distanceInMeter = window.google.maps.geometry
                    .spherical.computeDistanceBetween(
                        candidate.geometry.location, this.map.getCenter())
                    if distanceInMeter < shortestDistanceInMeter
                        result = candidate
                        shortestDistanceInMeter = distanceInMeter
            result
        onLoaded: ->
            ###Is triggered if the complete map ist loaded.###
            window.setTimeout (=>
                this.$domNode.find('input').fadeIn(
                    this._options.inputFadeInOption)
            ), this._options.showInputAfterLoadedDelayInMilliseconds
            this
        createMarker: (store) ->
            ###Registers given store to the google maps canvas.###
            index = 0
            while "#{store.latitude}-#{store.longitude}" in this.seenLocations
                if index % 2
                    store.latitude +=
                        this._options.distanceToMoveByDuplicatedEntries
                else
                    store.longitude +=
                        this._options.distanceToMoveByDuplicatedEntries
                index += 1
            this.seenLocations.push "#{store.latitude}-#{store.longitude}"
            marker =
                position: new window.google.maps.LatLng(
                    store.latitude, store.longitude)
                map: this.map
                data: store
            if store.markerIconFileName
                marker.icon = this._options.iconPath + store.markerIconFileName
            else if this._options.defaultMarkerIconFileName
                marker.icon = this._options.iconPath +
                    this._options.defaultMarkerIconFileName
            marker.title = store.title if store.title
            marker.infoWindow = new window.google.maps.InfoWindow content: ''
            marker.infoWindow.isOpen = false
            window.google.maps.event.addListener(
                marker.infoWindow, 'closeclick', ->
                    marker.infoWindow.isOpen = false
            )
            marker.nativeMarker = new window.google.maps.Marker marker
            window.google.maps.event.addListener(
                marker.nativeMarker, 'click', this.getMethod(
                    'openMarker', this, marker))
            this.markers.push marker
            marker.nativeMarker
        openMarker: (place, thisFunction, marker, event) ->
            ###
                Opens given marker info window. And closes a potential opened
                windows.
            ###
            event?.stopPropagation()
            this.highlightMarker(
                place, this.highlightMarker, marker, event, 'stop')
            # We have to ensure that the minimum zoom level has one more then
            # the clustering can appear. Since a cluster hides an open window.
            if(
                this._options.markerCluster?.maxZoom and
                this.map.getZoom() <= this._options.markerCluster.maxZoom
            )
                this.map.setZoom this._options.markerCluster.maxZoom + 1
            this.closeSearchResults event
            if(this.currentlyOpenWindow is marker.infoWindow and
               this.currentlyOpenWindow.isOpen)
                return this
            this.fireEvent 'infoWindowOpen', marker
            marker.refreshSize = ->
                ###
                    Simulates a content update to enforce info box size
                    adjusting.
                ###
                marker.infoWindow.setContent marker.infoWindow.getContent()
            infoWindow = this.makeInfoWindow marker
            if $.type(infoWindow) is 'string'
                marker.infoWindow.setContent infoWindow
            else
                marker.infoWindow.setContent(
                    this._options.infoWindow.loadingContent)
                infoWindow.then (infoWindow) ->
                    marker.infoWindow.setContent infoWindow
            if this.currentlyOpenWindow?
                this.currentlyOpenWindow.close()
                this.currentlyOpenWindow.isOpen = false
            this.currentlyOpenWindow = marker.infoWindow
            marker.infoWindow.isOpen = true
            marker.infoWindow.open this.map, marker.nativeMarker
            this.map.panTo marker.nativeMarker.position
            this.map.panBy(
                0, -this._options.infoWindow.additionalMoveToBottomInPixel)
            this.fireEvent 'infoWindowOpened', marker
            this
        openPlace: (place, thisFunction, event) ->
            ###Focuses given place on map.###
            event?.stopPropagation()
            this.closeSearchResults event
            if this.currentlyOpenWindow?
                this.currentlyOpenWindow.close()
                this.currentlyOpenWindow.isOpen = false
            this.map.setCenter place.geometry.location
            this.map.setZoom this._options.successfulSearchZoom
            this
        highlightMarker: (place, thisFunction, marker, event, type='bounce') ->
            ###
                Opens given marker info window. And closes a potential opened
                windows.
            ###
            event?.stopPropagation()
            if this.currentlyHighlightedMarker
                this.currentlyHighlightedMarker.nativeMarker?.setAnimation(
                    null)
                this.currentlyHighlightedMarker.isHighlighted = false
                this.currentlyHighlightedMarker = null
            if type is 'stop'
                marker.nativeMarker?.setAnimation null
            else
                # We have to ensure that the minimum zoom level has one more
                # then the clustering can appear. Since a cluster hides an open
                # window.
                if(
                    this._options.markerCluster?.maxZoom and
                    this.map.getZoom() <=
                    this._options.markerCluster.maxZoom and
                    marker.nativeMarker?.position? and
                    this.map.getBounds().contains marker.nativeMarker.position
                )
                    this.map.setCenter marker.nativeMarker.position
                    this.map.setZoom this._options.markerCluster.maxZoom + 1
                if marker isnt this.currentlyHighlightedMarker
                    marker.nativeMarker?.setAnimation(
                        window.google.maps.Animation[type.toUpperCase()])
                    marker.isHighlighted = true
                    this.currentlyHighlightedMarker = marker
                this.fireEvent 'markerHighlighted', marker
            this
        makeInfoWindow: (marker) ->
            ###
                Takes the marker for a store and creates the HTML content of
                the info window.
            ###
            if $.isFunction this._options.infoWindow.content
                return this._options.infoWindow.content.apply this, arguments
            if this._options.infoWindow.content?
                return this._options.infoWindow.content
            content = '<div>'
            for name, value of marker.data
                content += "#{name}: #{value}<br />"
            "#{content}</div>"
        makeSearchResults: (searchResults) ->
            ###
                Takes the search results and creates the HTML content of the
                search results.
            ###
            if $.isFunction this._options.searchBox.content
                return this._options.searchBox.content.apply this, arguments
            if this._options.searchBox.content?
                return this._options.searchBox.content
            content = ''
            for result in searchResults
                content += '<div>'
                for name, value of result.data
                    content += "#{name}: #{value}<br />"
                content += '</div>'
            content

    $.fn.StoreLocator = -> $.Tools().controller StoreLocator, arguments, this

# endregion

# region dependencies

if this.require?
    this.require.scopeIndicator = 'jQuery.fn.StoreLocator'
    this.require [['jQuery.Tools', 'jquery-tools-1.0.coffee']], main
else
    main this.jQuery

# endregion

# region vim modline

# vim: set tabstop=4 shiftwidth=4 expandtab:
# vim: foldmethod=marker foldmarker=region,endregion:

# endregion
