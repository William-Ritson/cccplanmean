'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Agreement = mongoose.model('Agreement'),
    request = require('request'),
    _ = require('lodash');

/**
 * Create a Agreement
 */
exports.create = function (req, res) {
    var agreement = new Agreement(req.body);
    agreement.user = req.user;

    agreement.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(agreement);
        }
    });
};

/**
 * Show the current Agreement
 */
exports.read = function (req, res) {
    res.jsonp(req.agreement);
};

/**
 * Update a Agreement
 */
exports.update = function (req, res) {
    var agreement = req.agreement;

    agreement = _.extend(agreement, req.body);

    agreement.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(agreement);
        }
    });
};

/**
 * Delete an Agreement
 */
exports.delete = function (req, res) {
    var agreement = req.agreement;

    agreement.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(agreement);
        }
    });
};

/**
 * List of Agreements
 */
exports.list = function (req, res) {
    Agreement.find().sort('-created').populate('user', 'displayName').exec(function (err, agreements) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(agreements);
        }
    });
};

exports.listTo = function (req, res) {
    Agreement.distinct('to').exec(function (err, toSchools) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(toSchools);
        }
    });
};


var queryString = function (query) {
    var res = '?',
        first = true;

    query.forEach(function (item) {
        if (!first) {
            first = false;
        } else {
            res += '&';
        }
        res += item[0] + '=' + item[1];
    });

    return res;
};

var makeQuery = function (from, to, major, callback) {
    var options = [
        ['aay', '13-14'],
        ['dora', major],
        ['oia', to],
        ['ay', '14-15'],
        ['event', 19],
        ['ria', to],
        ['agreement', 'aa'],
        ['sia', from],
        ['ia', from],
        ['dir', '1&'],
        ['sidebar', false],
        ['rinst', 'left'],
        ['mver', 2],
        ['kind', 5],
        ['dt', 2]
    ],
        url = 'http://web1.assist.org/cgi-bin/REPORT_2/Rep2.pl' + queryString(options);

    console.log(to, from, major);
    request(url, function (error, response, body) {
        callback(error, body);
    });

};

var extractTable = function (html) {
    return _.map(html.split(/---+/).filter(function (section) {
        return section.indexOf('|') !== -1;
    }), function (section) {
        var sides = ['', ''],
            subs = section
            .split('\n').forEach(function (sub) {
                sides[0] += sub.split('|')[0] || '';
                sides[1] += sub.split('|')[1] || '';
            });
        return sides;
    });
};

exports.dynamicGet = function (req, res) {
    console.log(req.query);
    makeQuery(req.query.from, req.query.to, req.query.major, function (err, data) {
        if (err) {
            throw err;
        }
        console.log(data);
        res.send({
            table: extractTable(data),
            src: data
        });
    });
};
/**
 * Agreement middleware
 */
exports.agreementByID = function (req, res, next, id) {
    Agreement.findById(id).populate('user', 'displayName').exec(function (err, agreement) {
        if (err) return next(err);
        if (!agreement) return next(new Error('Failed to load Agreement ' + id));
        req.agreement = agreement;
        next();
    });
};

/**
 * Agreement authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.agreement.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};