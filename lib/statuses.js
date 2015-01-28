'use strict';

var util = require('util')
var _ = require('lodash')
var request = require('request')
var async = require('async')
var F1Resource = require('./f1resource')

function Statuses(f1) {
  F1Resource.call(this, f1)
}

util.inherits(Statuses, F1Resource)

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
