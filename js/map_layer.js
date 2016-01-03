techMapApp.controller('TechMapLayerController', function ($scope, $rootScope) {

    var mapBoxTile = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.streets'
    });

    var cloudMatTile = L.tileLayer('http://{s}.tile.cloudmade.com/{key}/22677/256/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade. Font Awesome by Dave Gandy',
        key: 'BC9A493B41014CAABB98F0471D759707',
        detectRetina: true
    });

    var openStreetMapTile = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
    });

    var center = L.latLng(54.68547, 25.28739);
    var map = L.map('map', {
        center: center, zoom: 12, layers: [
        //        openStreetMapTile,
            mapBoxTile,
            //            cloudMatTile,
        ]
    });

    L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';
    //https://spreadsheets.google.com/feeds/list/1En1sAwGfvG8E8ruXShJfDviaBk5_n6nQPyY6rBymdPc/od6/public/basic?alt=json published url
    $.getJSON("https://spreadsheets.google.com/feeds/list/1En1sAwGfvG8E8ruXShJfDviaBk5_n6nQPyY6rBymdPc/od6/public/basic?alt=json", function (data) {
        var features = convertDataFromGoogleSpreadsheetsJson(data);
        $rootScope.$broadcast('DataAvailable', features);

        console.log(features);
    });

    var lastMarkerSet = null;

    $rootScope.$on('DataAvailable', function (event, features) {
        $rootScope.$broadcast('EntrySetAvailable', features);
    });

    $rootScope.$on('EntrySetAvailable', function (event, features) {
        console.log("New data available");
        
        if (lastMarkerSet != null) {
            map.removeLayer(lastMarkerSet);
        }

        var markers = L.markerClusterGroup();
        lastMarkerSet = markers;
        
        var data = {
            "type": "FeatureCollection",
            "features": features
        };

        var geoJsonLayer = L.geoJson(data, {
            style: function (feature) {
                return { color: feature.properties.color };
            },
            onEachFeature: function (feature, layer) {
                console.log(feature.properties.title);
                var popupText = "";
                if (feature.properties.color) {
                    popupText += feature.properties.title;
                }
                layer.bindPopup(popupText);
                layer.on('mouseover', function (e) {
                    this.openPopup();
                });
                layer.on('mouseout', function (e) {
                    // this.closePopup(); Works nicer without this
                });
            },
            pointToLayer: function (feature, latlng) {

                var awesomeMarker = L.AwesomeMarkers.icon({
                    icon: feature.properties.icon,
                    markerColor: feature.properties.color
                });

                var awesomeMarkeSelected = L.AwesomeMarkers.icon({
                    icon: feature.properties.icon,
                    markerColor: 'red'
                });

                var marker = L.marker(latlng, { icon: awesomeMarker });
                marker.selected = false;

                $rootScope.$on('MarkerSelectedEvent', function (event, featureReceived) {
                    if (feature.properties.title == featureReceived.properties.title) {
                        console.log("Return");
                        return;
                    }
                    marker.selected = false;
                    marker.setIcon(awesomeMarker);
                });

                marker.on('click', function () {
                    marker.selected = !marker.selected;
                    $rootScope.$broadcast('MarkerSelectedEvent', feature);
                    if (marker.selected) {
                        marker.setIcon(awesomeMarkeSelected);
                    } else {
                        marker.setIcon(awesomeMarker);
                    }
                });

                return marker;
            }
        });

        markers.addLayer(geoJsonLayer);
        map.addLayer(markers);
    });
});


