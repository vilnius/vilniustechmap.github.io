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
