'use strict';

//Setting up route
angular.module('transfer').config(['$stateProvider',
	function($stateProvider) {
		// Transfer state routing
		$stateProvider.
		state('transfer', {
			url: '/transfer',
			templateUrl: 'modules/transfer/views/transfer.client.view.html'
		});
	}
]);