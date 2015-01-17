'use strict';

angular.module('transfer').filter('courseLink', [
	function() {
		return function(input) {
			// Course link directive logic
			// ...

			return 'courseLink filter: ' + input;
		};
	}
]);