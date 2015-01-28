'use strict';

// var util = require('util')
var _ = require('lodash')
var request = require('request')
var async = require('async')

function Statuses(f1) {
  this.f1 = f1
}

Statuses.MEDIA_TYPE = 'application/json'

/**
 * Generic HTTP GET for the resource
 *
 * @param  {String}   path      - the path (relative to the configured API URL)
 * of the resource
 * @param  {Object}   query    - optional query object
 * @param  {Function} callback - yields (err, response_body, headers)
 */
Statuses.prototype._get = function(path, query, callback) {
  var config = this.f1.config

  var opts = {
    oauth: config.oauth_credentials,
    headers: {
      accept: Statuses.MEDIA_TYPE,
      'content-type': Statuses.MEDIA_TYPE
    },
    json: true,
    qs: query
  }

  // query is optional...
  if (typeof query == 'function') {
    callback = query
    delete opts.qs
  }

  var handleErrorStatus = function(res, body, next) {
    if (res.statusCode > 299) {
      return next({
        statusCode: res.statusCode,
        headers: res.headers,
        message: body
      })
    } else return next(null, res, body)
  }

  async.waterfall([
    request.get.bind(request, config.apiURL + path, opts),
    handleErrorStatus
  ], function(err, res, body) {
    callback(err, body, res && res.headers ? res.headers : undefined)
  })
}

/**
 * See http://developer.fellowshipone.com/docs/v1/Statuses.help#list
 *
 * Lists all the statuses. Note - unlike the API, this yields
 * the actual array of Status objects.
 */
Statuses.prototype.list = function(callback) {
  var path = '/Statuses'
  this._get(path, function(err, body, headers) {
    if (err) return callback(err)

    if (body.statuses && body.statuses.status)
      callback(null, body.statuses.status)
    else {
      return callback({
        statusCode: 502,
        headers: headers,
        message: body
      })
    }
  }.bind(this))
}

/**
 * See http://developer.fellowshipone.com/docs/v1/Statuses.help#show
 *
 * Gets a status by ID. Note - unlike the API, this yields the unwrapped Status
 * object (i.e. the "status" property of the API's response)
 *
 * @param  {Number}   statusID - the ID of the Status
 */
Statuses.prototype.show = function(statusID, callback) {
  var path = '/Statuses/' + statusID
  this._get(path, function(err, body, headers) {
    if (err) return callback(err)

    if (body.status && body.status) return callback(null, body.status)
    else {
      return callback({
        statusCode: 502,
        headers: headers,
        message: body
      })
    }
  })
}

module.exports = Statuses
