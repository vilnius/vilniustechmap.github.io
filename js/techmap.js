var techMapApp = angular.module('techMapApp', []);

techMapApp.controller('TechMapController', function ($scope) {
});

techMapApp.controller('TechMapSideMenuController', function ($scope, $rootScope) {
    $scope.$on('MarkerSelectedEvent', function (event, feature) {
        console.log(feature);
        $scope.selectedObject = feature.properties;
        $scope.$apply();
    });
});

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

    var markers = L.markerClusterGroup();

    L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';
//https://spreadsheets.google.com/feeds/list/1En1sAwGfvG8E8ruXShJfDviaBk5_n6nQPyY6rBymdPc/od6/public/basic?alt=json published url
    $.getJSON("https://spreadsheets.google.com/feeds/list/1En1sAwGfvG8E8ruXShJfDviaBk5_n6nQPyY6rBymdPc/od6/public/basic?alt=json", function (data) {

        function convertData() {
            var feedEntries = data.feed.entry;
            var features = [];

            function transformEntry(jsonEntry) {
                var currentPropertiesText = jsonEntry['content']['$t'];

                var propsArray = currentPropertiesText.split(", ");
                var props = {};

                for (var i = 0; i < propsArray.length; i++) {
                    var propPart = propsArray[i];
                    var nameCutIndex = propPart.indexOf(": ");
                    var propName = propPart.substring(0, nameCutIndex);
                    var propValue = propPart.substring(nameCutIndex + 2);

                    props[propName] = propValue;
                }

                if (!props['longitude'] || !props['latitude']) {
                    return false;
                }

                props['longitude'] = parseFloat(props['longitude'].replace(",","."));
                props['latitude'] = parseFloat(props['latitude'].replace(",","."));

                return {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            props['longitude'],
                            props['latitude']
                        ]
                    },
                    "properties": {
                        "title": jsonEntry['title']['$t'],
                        "address": props['address'],
                        "contactPerson": props['contactperson'],
                        "contactPhone": props['contactphone'],
                        "contactEmail": props['contactemail'],
                        "pictureUrl": props['logolink'],
                        "websiteUrl": props['website'],
                        "color": "blue",
                        "icon": "building"
                    }
                };
            }

            for (var i = 0; i < feedEntries.length; i++) {
                var geoEntry = transformEntry(feedEntries[i]);
                if (!geoEntry) {
                    continue;
                }
                features.push(geoEntry);
            }

            return {
                "type": "FeatureCollection",
                "features": features
            }
        }

        var geoJsonTransformed = convertData();

        console.log(geoJsonTransformed);

        L.geoJson(geoJsonTransformed, {
            style: function (feature) {
                return {color: feature.properties.color};
            },
            onEachFeature: function (feature, layer) {
                console.log(feature.properties.title);
                markers.addLayer(layer);
            },
            pointToLayer: function (feature, latlng) {
                var awesomeMarker = L.AwesomeMarkers.icon({
                    icon: feature.properties.icon,
                    markerColor: feature.properties.color
                });

                var marker = L.marker(latlng, {icon: awesomeMarker});
                marker.on('click', function () {
                    $rootScope.$broadcast('MarkerSelectedEvent', feature);
                });

                return marker;
            }
        }).addTo(map);
    });


    map.addLayer(markers);
});


