'use strict';

(function() {
	// Agreements Controller Spec
	describe('Agreements Controller Tests', function() {
		// Initialize global variables
		var AgreementsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Agreements controller.
			AgreementsController = $controller('AgreementsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Agreement object fetched from XHR', inject(function(Agreements) {
			// Create sample Agreement using the Agreements service
			var sampleAgreement = new Agreements({
				name: 'New Agreement'
			});

			// Create a sample Agreements array that includes the new Agreement
			var sampleAgreements = [sampleAgreement];

			// Set GET response
			$httpBackend.expectGET('agreements').respond(sampleAgreements);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.agreements).toEqualData(sampleAgreements);
		}));

		it('$scope.findOne() should create an array with one Agreement object fetched from XHR using a agreementId URL parameter', inject(function(Agreements) {
			// Define a sample Agreement object
			var sampleAgreement = new Agreements({
				name: 'New Agreement'
			});

			// Set the URL parameter
			$stateParams.agreementId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/agreements\/([0-9a-fA-F]{24})$/).respond(sampleAgreement);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.agreement).toEqualData(sampleAgreement);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Agreements) {
			// Create a sample Agreement object
			var sampleAgreementPostData = new Agreements({
				name: 'New Agreement'
			});

			// Create a sample Agreement response
			var sampleAgreementResponse = new Agreements({
				_id: '525cf20451979dea2c000001',
				name: 'New Agreement'
			});

			// Fixture mock form input values
			scope.name = 'New Agreement';

			// Set POST response
			$httpBackend.expectPOST('agreements', sampleAgreementPostData).respond(sampleAgreementResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Agreement was created
			expect($location.path()).toBe('/agreements/' + sampleAgreementResponse._id);
		}));

		it('$scope.update() should update a valid Agreement', inject(function(Agreements) {
			// Define a sample Agreement put data
			var sampleAgreementPutData = new Agreements({
				_id: '525cf20451979dea2c000001',
				name: 'New Agreement'
			});

			// Mock Agreement in scope
			scope.agreement = sampleAgreementPutData;

			// Set PUT response
			$httpBackend.expectPUT(/agreements\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/agreements/' + sampleAgreementPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid agreementId and remove the Agreement from the scope', inject(function(Agreements) {
			// Create new Agreement object
			var sampleAgreement = new Agreements({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Agreements array and include the Agreement
			scope.agreements = [sampleAgreement];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/agreements\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAgreement);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.agreements.length).toBe(0);
		}));
	});
}());