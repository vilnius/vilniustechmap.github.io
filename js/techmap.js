var techMapApp = angular.module('techMapApp', []);

techMapApp.controller('TechMapController', function ($scope) {    var filters = {};

    $scope.$on('DataAvailable', function (event, data) {

        var revenuesSum = _.reduce(data.features, function (memo, feature) {
            var number = feature.properties.revenues;
            if (!number) {
                number = "0";
            }
            if (number.indexOf('-') > 0) {
                number = number.split('-');
                number = number[0].trim()
            }
            number = number.replace(/\D/g,'');
            number = number.trim();
            
            return memo + parseInt(number);
        }, 0);
        
        var employeesCount = _.reduce(data.features, function (memo, feature) {
            var number = feature.properties.headcount;
            if (!number) {
                number = "0";
            }
            
            number = number.replace(/\D/g,'');
            number = number.trim();
            
            return memo + parseInt(number);
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
            number = number.replace(/\D/g,'');
            number = number.trim();
            
            return memo + parseInt(number);
        }, 0);
        
        revenuesSum = Number(revenuesSum).toLocaleString('lt');
        employeesCount = Number(employeesCount).toLocaleString('lt');
        fundingSum = Number(fundingSum).toLocaleString('lt');
        
        $scope.summary = {
            revenues: revenuesSum,
            employees: employeesCount,
            funding: fundingSum,
        };
        $scope.$apply();
    });
});

techMapApp.controller('TechMapSummaryController', function ($scope) {

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
