'use strict';

angular.module('transfer').controller('TransferController', ['$scope', '$http', '$log',
 function ($scope, $http, $log) {

        $scope.toSchools = [];

        $scope.fromSchools = [];

        $scope.loading = false;

        var init = function () {
            $scope.loading = true;
            
            $http.get('/data/assist-index.json').            
            success(function (data, status, headers, config) {
                $log.log(data);
                $scope.toSchools = data.to;
                $scope.fromSchools = data.from;
                $scope.loading = false;
            }).
            error(function (data, status, headers, config) {
                $log.error(status);
                $scope.loading = false;
                $scope.error = 'Failed to load school list.';
                $scope.retry = init;
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
            $scope.loading = true;
            $http({
                url: 'dynAgreement',
                method: 'GET',
                params: query
            }).
            success(function (data, status, headers, config) {
                $scope.loading = false;
                $log.log(data);
                $scope.rows = data.table;
                $scope.src = data.src;
                if (data.src.match('ASSIST was not able to process your request.')) {
                    $scope.error = 'Assist.org returned an empty page.';
                    $scope.retry = $scope.getAgreement;
                } else {
                    $scope.error = false;
                }
            }).
            error(function (data, status, headers, config) {
                $log.error(status);
                $scope.loading = false;
                $scope.error = 'Error while loading agreement';
                $scope.retry = $scope.getAgreement;
            });

        };
}
]);