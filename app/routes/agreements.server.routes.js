'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var agreements = require('../../app/controllers/agreements.server.controller');

	// Agreements Routes
	app.route('/agreements')
		.get(agreements.list)
		.post(users.requiresLogin, agreements.create);
    
    app.route('/dynAgreement')
        .get(agreements.dynamicGet);
    
    app.route('/to')
        .get(agreements.listTo);

	app.route('/agreements/:agreementId')
		.get(agreements.read)
		.put(users.requiresLogin, agreements.hasAuthorization, agreements.update)
		.delete(users.requiresLogin, agreements.hasAuthorization, agreements.delete);

	// Finish by binding the Agreement middleware
	app.param('agreementId', agreements.agreementByID);
};
