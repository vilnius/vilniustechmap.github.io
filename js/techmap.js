var techMapApp = angular.module('techMapApp', []);

techMapApp.controller('TechMapController', function ($scope) {

});

techMapApp.controller('TechMapFilterController', function ($scope, $rootScope) {
    var filters = {};
    $scope.filter = filters;

    var fullInitialData = null;

    $scope.$on('DataAvailable', function (event, data) {
        fullInitialData = data;
        var foundCategories = [];
        _.each(data.features, function (feature) {
            var categories = feature.properties.industrycategorytype;

            categories = categories.split(",");

            _.each(categories, function (element) {
                var category = {
                    id: '',
                    name: element
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

        console.log(foundCategories);
        $scope.categories = foundCategories;
        $scope.$apply();
    });

    $scope.$watch('filter.category', function (newValue, oldValue) {
        console.log(newValue);

        if (fullInitialData == null) {
            return;
        }

        var features = _.filter(fullInitialData.features, function (feature) {
            if (_.isEmpty(newValue)) {
                return true;
            }

            return feature.properties.industrycategorytype.indexOf(newValue) >= 0;
        });

        $rootScope.$broadcast('EntrySetAvailable',
            {
                "type": "FeatureCollection",
                "features": features
            });
    });
});

techMapApp.controller('TechMapSummaryController', function ($scope, $rootScope, $timeout) {

    $scope.$on('EntrySetAvailable', function (event, data) {

        var revenuesSum = _.reduce(data.features, function (memo, feature) {
            var number = feature.properties.revenues;
            if (!number) {
                number = "0";
            }
            if (number.indexOf('-') > 0) {
                number = number.split('-');
                number = number[0].trim()
            }
            number = number.replace(/\D/g, '');
            number = number.trim();
            number = parseInt(number);
            return memo + number;
        }, 0);

        var employeesCount = _.reduce(data.features, function (memo, feature) {
            var number = feature.properties.headcount;
            if (!number) {
                number = "0";
            }

            number = number.replace(/\D/g, '');
            number = number.trim();

            number = parseInt(number);
            return memo + number;
        }, 0);

        var fundingSum = _.reduce(data.features, function (memo, feature) {
            var number = feature.properties.fundingraised;
            if (!number) {
                number = "0";
            }
            if (number.indexOf('-') > 0) {
                number = number.split('-');
                number = number[0].trim()
            }
            number = number.replace(/\D/g, '');
            number = number.trim();

            number = parseInt(number);
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
