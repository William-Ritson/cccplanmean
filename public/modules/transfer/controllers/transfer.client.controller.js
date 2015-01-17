'use strict';

angular.module('transfer').controller('TransferController', ['$scope', '$http', '$log',
 function ($scope, $http, $log) {

        $scope.toSchools = [];

        $scope.fromSchools = [];

        var init = function () {
            $http.get('/data/assist-index.json').
            success(function (data, status, headers, config) {
                $log.log(data);
                $scope.toSchools = data.to;
                $scope.fromSchools = data.from;
            }).
            error(function (data, status, headers, config) {
                $log.error(status);
            });
        };

        init();

        $scope.changeFrom = function () {
            if ($scope.major) {
                $scope.getAgreement();
            }
        };

        $scope.getAgreement = function () {
            var query = {
                to: $scope.to.id,
                from: $scope.from.id,
                major: $scope.major
            };
            $log.log(query);
            $http({
                url: 'dynAgreement',
                method: 'GET',
                params: query
            }).
            success(function (data, status, headers, config) {
                $log.log(data);
                $scope.rows = data.table;
                $scope.src = data.src;
            }).
            error(function (data, status, headers, config) {
                $log.error(status);
            });

        };
}
]);