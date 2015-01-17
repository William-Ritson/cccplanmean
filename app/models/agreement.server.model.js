'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Agreement Schema
 */
var AgreementSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Agreement name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Agreement', AgreementSchema);