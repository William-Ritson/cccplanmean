'use strict';

//Setting up route
angular.module('agreements').config(['$stateProvider',
	function($stateProvider) {
		// Agreements state routing
		$stateProvider.
		state('listAgreements', {
			url: '/agreements',
			templateUrl: 'modules/agreements/views/list-agreements.client.view.html'
		}).
		state('createAgreement', {
			url: '/agreements/create',
			templateUrl: 'modules/agreements/views/create-agreement.client.view.html'
		}).
		state('viewAgreement', {
			url: '/agreements/:agreementId',
			templateUrl: 'modules/agreements/views/view-agreement.client.view.html'
		}).
		state('editAgreement', {
			url: '/agreements/:agreementId/edit',
			templateUrl: 'modules/agreements/views/edit-agreement.client.view.html'
		});
	}
]);