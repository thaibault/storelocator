// Generated by CoffeeScript 1.7.1

/*
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
 */

(function() {
  var main,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  main = function($) {
    var StoreLocator;
    StoreLocator = (function(_super) {
      __extends(StoreLocator, _super);

      function StoreLocator() {
        return StoreLocator.__super__.constructor.apply(this, arguments);
      }


      /*
          A jQuery storelocator plugin.
      
          Expected store data format:
      
          {latitude: NUMBER, longitude: NUMBER, markerIconFileName: STRING}
       */

      StoreLocator.prototype.__name__ = 'StoreLocator';

      StoreLocator.prototype.initialize = function(options) {
        if (options == null) {
          options = {};
        }

        /*Entry point for object orientated jQuery plugin. */
        this.currentlyOpenWindow = null;
        this.seenLocations = [];
        this.markers = [];
        this._options = {
          stores: {
            northEast: {
              latitude: 85,
              longitude: 180
            },
            southWest: {
              latitude: -85,
              longitude: -180
            },
            number: 100
          },
          infoBox: null,
          iconPath: '/webAsset/image/storeLocator/',
          defaultMarkerIconFileName: null,
          startLocation: null,
          fallbackLocation: {
            latitude: 51.124213,
            longitude: 10.147705
          },
          ip: null,
          ipToLocationAPIURL: '{1}://freegeoip.net/json/{2}',
          map: {
            zoom: 3
          },
          showInputAfterLoadedDelayInMilliseconds: 500,
          inputFadeInOption: {
            duration: 'fast'
          },
          distanceToMoveByDuplicatedEntries: 0.0001,
          markerCluster: {
            gridSize: 100,
            maxZoom: 14
          },
          searchResultPrecisionTolerance: 2,
          successfulSearchZoom: 13,
          infoWindowAdditionalMoveToBottomInPixel: 100,
          onLoaded: $.noop,
          onInfoWindowOpen: $.noop,
          onInfoWindowOpened: $.noop
        };
        StoreLocator.__super__.initialize.call(this, options);
        this.$domNodes = this.grabDomNode(this._options.domNode);
        if (this._options.startLocation != null) {
          this.initializeMap();
        } else {
          this._options.startLocation = this._options.fallbackLocation;
          $.ajax({
            url: this.stringFormat(this._options.ipToLocationAPIURL, document.location.protocol.substring(0, document.location.protocol.length - 1), this._options.ip || ''),
            dataType: 'jsonp'
          }).done((function(_this) {
            return function(currentLocation) {
              return _this._options.startLocation = currentLocation;
            };
          })(this)).complete((function(_this) {
            return function() {
              return _this.initializeMap();
            };
          })(this));
        }
        return this.$domNode || this;
      };

      StoreLocator.prototype.initializeMap = function() {

        /*Initializes cluster, info windows and marker. */
        var index, markerCluster, northEast, searchBox, searchInputDomNode, southWest, store, _i, _j, _len, _ref, _ref1;
        this._options.map.center = new window.google.maps.LatLng(this._options.startLocation.latitude, this._options.startLocation.longitude);
        this.map = new window.google.maps.Map($('<div>').appendTo(this.$domNode)[0], this._options.map);
        markerCluster = new window.MarkerClusterer(this.map, [], this._options.markerCluster);
        if ($.isArray(this._options.stores)) {
          _ref = this._options.stores;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            store = _ref[_i];
            markerCluster.addMarker(this.createMarker(store));
          }
        } else if ($.type(this._options.stores) === 'string') {
          $.getJSON(this._options.stores, (function(_this) {
            return function(stores) {
              var _j, _len1, _results;
              _results = [];
              for (_j = 0, _len1 = stores.length; _j < _len1; _j++) {
                store = stores[_j];
                _results.push(markerCluster.addMarker(_this.createMarker(store)));
              }
              return _results;
            };
          })(this));
        } else {
          southWest = new window.google.maps.LatLng(this._options.stores.southWest.latitude, this._options.stores.southWest.longitude);
          northEast = new window.google.maps.LatLng(this._options.stores.northEast.latitude, this._options.stores.northEast.longitude);
          for (index = _j = 0, _ref1 = this._options.stores.number; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; index = 0 <= _ref1 ? ++_j : --_j) {
            markerCluster.addMarker(this.createMarker({
              latitude: southWest.lat() + (northEast.lat() - southWest.lat()) * window.Math.random(),
              longitude: southWest.lng() + (northEast.lng() - southWest.lng()) * window.Math.random()
            }));
          }
        }
        searchInputDomNode = this.$domNode.find('input')[0];
        this.map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(searchInputDomNode);
        searchBox = new window.google.maps.places.SearchBox(searchInputDomNode);
        window.google.maps.event.addListener(searchBox, 'places_changed', (function(_this) {
          return function() {
            var foundPlace, foundPlaces, marker, _k, _len1, _ref2;
            foundPlaces = searchBox.getPlaces();
            if (foundPlaces.length) {
              foundPlace = foundPlaces[0];
              _ref2 = _this.markers;
              for (_k = 0, _len1 = _ref2.length; _k < _len1; _k++) {
                marker = _ref2[_k];
                if (_this.round(marker.position.lat() * window.Math.pow(10, _this._options.searchResultPrecisionTolerance)) === _this.round(foundPlace.geometry.location.lat() * window.Math.pow(10, _this._options.searchResultPrecisionTolerance)) && _this.round(marker.position.lng() * window.Math.pow(10, _this._options.searchResultPrecisionTolerance)) === _this.round(foundPlace.geometry.location.lng() * window.Math.pow(10, _this._options.searchResultPrecisionTolerance))) {
                  if (_this._options.successfulSearchZoom != null) {
                    _this.map.setZoom(_this._options.successfulSearchZoom);
                  }
                  return _this.openMarker(foundPlace, _this.openMarker, marker);
                }
              }
              if (_this.currentlyOpenWindow != null) {
                _this.currentlyOpenWindow.close();
              }
              _this.map.setCenter(foundPlace.geometry.location);
              if (_this._options.successfulSearchZoom != null) {
                return _this.map.setZoom(_this._options.successfulSearchZoom);
              }
            }
          };
        })(this));
        window.google.maps.event.addListener(this.map, 'bounds_changed', (function(_this) {
          return function() {
            return searchBox.setBounds(_this.map.getBounds());
          };
        })(this));
        this.fireEvent('loaded');
        return this;
      };

      StoreLocator.prototype.onLoaded = function() {

        /*Is triggered if the complete map ist loaded. */
        window.setTimeout(((function(_this) {
          return function() {
            return _this.$domNode.find('input').fadeIn(_this._options.inputFadeInOption);
          };
        })(this)), this._options.showInputAfterLoadedDelayInMilliseconds);
        return this;
      };

      StoreLocator.prototype.createMarker = function(store) {

        /*Registers given store to the google maps canvas. */
        var index, marker, _ref;
        index = 0;
        while (_ref = "" + store.latitude + "-" + store.longitude, __indexOf.call(this.seenLocations, _ref) >= 0) {
          if (index % 2) {
            store.latitude += this._options.distanceToMoveByDuplicatedEntries;
          } else {
            store.longitude += this._options.distanceToMoveByDuplicatedEntries;
          }
          index += 1;
        }
        this.seenLocations.push("" + store.latitude + "-" + store.longitude);
        marker = {
          position: new window.google.maps.LatLng(store.latitude, store.longitude),
          map: this.map,
          data: store
        };
        if (store.markerIconFileName) {
          marker.icon = this._options.iconPath + store.markerIconFileName;
        } else if (this._options.defaultMarkerIconFileName) {
          marker.icon = this._options.iconPath + this._options.defaultMarkerIconFileName;
        }
        if (store.title) {
          marker.title = store.title;
        }
        marker.infoWindow = new window.google.maps.InfoWindow({
          content: ''
        });
        marker.googleMarker = new window.google.maps.Marker(marker);
        window.google.maps.event.addListener(marker.googleMarker, 'click', this.getMethod('openMarker', this, marker));
        this.markers.push(marker);
        return marker.googleMarker;
      };

      StoreLocator.prototype.openMarker = function(place, thisFunction, marker) {

        /*
            Opens given marker info window. And closes a potential opened
            windows.
         */
        var infoWindow;
        this.fireEvent('infoWindowOpen', marker);
        infoWindow = this.makeInfoWindow(marker.data);
        marker.infoWindow.setContent(infoWindow);
        if (this.currentlyOpenWindow != null) {
          this.currentlyOpenWindow.close();
        }
        this.currentlyOpenWindow = marker.infoWindow;
        marker.infoWindow.open(this.map, marker.googleMarker);
        this.map.panTo(marker.googleMarker.position);
        this.map.panBy(0, -this._options.infoWindowAdditionalMoveToBottomInPixel);
        this.fireEvent('infoWindowOpened', marker);
        return this;
      };

      StoreLocator.prototype.makeInfoWindow = function(store) {

        /*
            Takes the info window data for a store and creates the HTML
            content of the info window.
         */
        var content, name, value;
        if ($.isFunction(this._options.infoBox)) {
          return this._options.infoBox(store);
        }
        if (this._options.infoBox != null) {
          return this._options.infoBox;
        }
        content = '<div>';
        for (name in store) {
          value = store[name];
          content += "" + name + ": " + value + "<br />";
        }
        return "" + content + "</div>";
      };

      return StoreLocator;

    })($.Tools["class"]);
    return $.fn.StoreLocator = function() {
      return $.Tools().controller(StoreLocator, arguments, this);
    };
  };

  if (this.require != null) {
    this.require.scopeIndicator = 'jQuery.fn.StoreLocator';
    this.require('jquery-tools-1.0.coffee', main);
  } else {
    main(this.jQuery);
  }

}).call(this);
