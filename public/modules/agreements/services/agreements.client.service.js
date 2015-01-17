'use strict';

//Agreements service used to communicate Agreements REST endpoints
angular.module('agreements').factory('Agreements', ['$resource',
	function($resource) {
		return $resource('agreements/:agreementId', { agreementId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);