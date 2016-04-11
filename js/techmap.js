var techMapApp = angular.module('techMapApp', []);

techMapApp.controller('TechMapController', function ($scope) {

});

techMapApp.controller('TechMapFilterController', function ($scope, $rootScope) {
    var filters = {};
    $scope.filter = filters;

    var fullInitialFeatures = null;

    $scope.$on('DataAvailable', function (event, features) {
        fullInitialFeatures = features;
        var foundCategories = [];
        _.each(features, function (feature) {
            var categories = feature.properties.industrycategorytype;

            categories = categories.split(",");

            _.each(categories, function (element) {
                var category = {
                    id: '',
                    name: element.trim()
                };
                foundCategories.push(category);
            });

        });

        foundCategories = _.sortBy(foundCategories, function (category) {
            return category.name;
        });

        foundCategories = _.uniq(foundCategories, true, function (category) {
            return category.name;
        });

        console.log(_.map(foundCategories, function(category) {
            return category.name;
        }).join("\n"));
        
        $scope.categories = foundCategories;
        $scope.$apply();
    });

    $scope.$watch('filter.category', function (newValue, oldValue) {
        console.log(newValue);

        if (fullInitialFeatures == null) {
            return;
        }

        var features = _.filter(fullInitialFeatures, function (feature) {
            if (_.isEmpty(newValue)) {
                return true;
            }

            return feature.properties.industrycategorytype.indexOf(newValue) >= 0;
        });

        $rootScope.$broadcast('EntrySetAvailable', features);
    });
});

techMapApp.controller('TechMapSummaryController', function ($scope, $rootScope, $timeout) {

    $scope.$on('EntrySetAvailable', function (event, features) {

        var revenuesSum = _.reduce(features, function (memo, feature) {
            var number = feature.properties.revenues;
            return memo + number;
        }, 0);

        var employeesCount = _.reduce(features, function (memo, feature) {
            var number = feature.properties.headcount;
            return memo + number;
        }, 0);

        var fundingSum = _.reduce(features, function (memo, feature) {
            var number = feature.properties.fundingraised;
            return memo + number;
        }, 0);

        revenuesSum = Number(revenuesSum).toLocaleString('lt');
        employeesCount = Number(employeesCount).toLocaleString('lt');
        fundingSum = Number(fundingSum).toLocaleString('lt');

        $scope.summary = {
            revenues: revenuesSum,
            employees: employeesCount,
            funding: fundingSum,
        };
        $timeout(function () {
            $scope.$apply();
        }, 0);
    });
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

techMapApp.controller('TechMapStartUpOfTheDayController', function ($scope, $rootScope) {
    $scope.$on('DataAvailable', function (event, features) {
        var startupAmount = features.length;
        var currentDate = new Date();
        var randomIndex = currentDate.getMonth() + currentDate.getDate() + currentDate.getFullYear();
        while (randomIndex >= startupAmount)
            randomIndex -= startupAmount;
        $scope.startUpOfTheDayObject = features[randomIndex].properties;
    });
});
