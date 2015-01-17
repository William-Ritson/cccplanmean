'use strict';

// Agreements controller
angular.module('agreements').controller('AgreementsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Agreements',
	function($scope, $stateParams, $location, Authentication, Agreements) {
		$scope.authentication = Authentication;

		// Create new Agreement
		$scope.create = function() {
			// Create new Agreement object
			var agreement = new Agreements ({
				name: this.name
			});

			// Redirect after save
			agreement.$save(function(response) {
				$location.path('agreements/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Agreement
		$scope.remove = function(agreement) {
			if ( agreement ) { 
				agreement.$remove();

				for (var i in $scope.agreements) {
					if ($scope.agreements [i] === agreement) {
						$scope.agreements.splice(i, 1);
					}
				}
			} else {
				$scope.agreement.$remove(function() {
					$location.path('agreements');
				});
			}
		};

		// Update existing Agreement
		$scope.update = function() {
			var agreement = $scope.agreement;

			agreement.$update(function() {
				$location.path('agreements/' + agreement._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Agreements
		$scope.find = function() {
			$scope.agreements = Agreements.query();
		};

		// Find existing Agreement
		$scope.findOne = function() {
			$scope.agreement = Agreements.get({ 
				agreementId: $stateParams.agreementId
			});
		};
	}
]);