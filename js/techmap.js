var techMapApp = angular.module('techMapApp', []);

techMapApp.controller('TechMapController', function ($scope) {
});

techMapApp.controller('TechMapSideMenuController', function ($scope, $rootScope) {
    $scope.$on('MarkerSelectedEvent', function (event, feature) {
        console.log(feature);
        if ($scope.selectedObject == feature.properties) {
            $scope.selectedObject = null;
        } else {
            $scope.selectedObject = feature.properties;
        }
        $scope.$apply();
    });
});
