'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Agreement = mongoose.model('Agreement'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, agreement;

/**
 * Agreement routes tests
 */
describe('Agreement CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Agreement
		user.save(function() {
			agreement = {
				name: 'Agreement Name'
			};

			done();
		});
	});

	it('should be able to save Agreement instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Agreement
				agent.post('/agreements')
					.send(agreement)
					.expect(200)
					.end(function(agreementSaveErr, agreementSaveRes) {
						// Handle Agreement save error
						if (agreementSaveErr) done(agreementSaveErr);

						// Get a list of Agreements
						agent.get('/agreements')
							.end(function(agreementsGetErr, agreementsGetRes) {
								// Handle Agreement save error
								if (agreementsGetErr) done(agreementsGetErr);

								// Get Agreements list
								var agreements = agreementsGetRes.body;

								// Set assertions
								(agreements[0].user._id).should.equal(userId);
								(agreements[0].name).should.match('Agreement Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Agreement instance if not logged in', function(done) {
		agent.post('/agreements')
			.send(agreement)
			.expect(401)
			.end(function(agreementSaveErr, agreementSaveRes) {
				// Call the assertion callback
				done(agreementSaveErr);
			});
	});

	it('should not be able to save Agreement instance if no name is provided', function(done) {
		// Invalidate name field
		agreement.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Agreement
				agent.post('/agreements')
					.send(agreement)
					.expect(400)
					.end(function(agreementSaveErr, agreementSaveRes) {
						// Set message assertion
						(agreementSaveRes.body.message).should.match('Please fill Agreement name');
						
						// Handle Agreement save error
						done(agreementSaveErr);
					});
			});
	});

	it('should be able to update Agreement instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Agreement
				agent.post('/agreements')
					.send(agreement)
					.expect(200)
					.end(function(agreementSaveErr, agreementSaveRes) {
						// Handle Agreement save error
						if (agreementSaveErr) done(agreementSaveErr);

						// Update Agreement name
						agreement.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Agreement
						agent.put('/agreements/' + agreementSaveRes.body._id)
							.send(agreement)
							.expect(200)
							.end(function(agreementUpdateErr, agreementUpdateRes) {
								// Handle Agreement update error
								if (agreementUpdateErr) done(agreementUpdateErr);

								// Set assertions
								(agreementUpdateRes.body._id).should.equal(agreementSaveRes.body._id);
								(agreementUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Agreements if not signed in', function(done) {
		// Create new Agreement model instance
		var agreementObj = new Agreement(agreement);

		// Save the Agreement
		agreementObj.save(function() {
			// Request Agreements
			request(app).get('/agreements')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Agreement if not signed in', function(done) {
		// Create new Agreement model instance
		var agreementObj = new Agreement(agreement);

		// Save the Agreement
		agreementObj.save(function() {
			request(app).get('/agreements/' + agreementObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', agreement.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Agreement instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Agreement
				agent.post('/agreements')
					.send(agreement)
					.expect(200)
					.end(function(agreementSaveErr, agreementSaveRes) {
						// Handle Agreement save error
						if (agreementSaveErr) done(agreementSaveErr);

						// Delete existing Agreement
						agent.delete('/agreements/' + agreementSaveRes.body._id)
							.send(agreement)
							.expect(200)
							.end(function(agreementDeleteErr, agreementDeleteRes) {
								// Handle Agreement error error
								if (agreementDeleteErr) done(agreementDeleteErr);

								// Set assertions
								(agreementDeleteRes.body._id).should.equal(agreementSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Agreement instance if not signed in', function(done) {
		// Set Agreement user 
		agreement.user = user;

		// Create new Agreement model instance
		var agreementObj = new Agreement(agreement);

		// Save the Agreement
		agreementObj.save(function() {
			// Try deleting Agreement
			request(app).delete('/agreements/' + agreementObj._id)
			.expect(401)
			.end(function(agreementDeleteErr, agreementDeleteRes) {
				// Set message assertion
				(agreementDeleteRes.body.message).should.match('User is not logged in');

				// Handle Agreement error error
				done(agreementDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Agreement.remove().exec();
		done();
	});
});