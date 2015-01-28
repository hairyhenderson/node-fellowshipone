'use strict';

var util = require('util')
var _ = require('lodash')
var request = require('request')
var async = require('async')
var F1Resource = require('./f1resource')

function Households(f1) {
  F1Resource.call(this, f1)
}

util.inherits(Households, F1Resource)

/**
 * See http://developer.fellowshipone.com/docs/v1/Households.help#show
 *
 * Gets a household by ID. Note - unlike the API, this yields the unwrapped Household
 * object (i.e. the "household" property of the API's response)
 *
 * @param  {Number}   householdID - the ID of the Household
 */
Households.prototype.show = function(householdID, callback) {
  var path = '/Households/' + householdID
  this._get(path, function(err, body, headers) {
    if (err) return callback(err)

    if (body.household && body.household) return callback(null, body.household)
    else {
      return callback({
        statusCode: 502,
        headers: headers,
        message: body
      })
    }
  })
}

/**
 *  See http://developer.fellowshipone.com/docs/v1/Households.help#search
 *
 *  @param params -
 *  searchFor = Name of the household you are searching for
 *  lastActivityDate =
 *  lastUpdatedDate = The date of the last time the household's information was updated (format: yyyy-mm-dd)**
 *  createdDate = The date when the household's information was created / inserted into the system (format: yyyy-mm-dd)*
 *  recordsPerPage = number of records to return for each query (default is 20)
 *  page = page number for the given result set
 */
Households.prototype.search = function(params, callback) {
  this._get('/Households/Search', params, function(err, body) {
    if (err) return callback(err)

    // this probably won't (and shouldn't) return the raw response forever...
    callback(null, body)
  }.bind(this))
}

/**
 * See http://developer.fellowshipone.com/docs/v1/Households.help#new
 *
 * Yields a valid (but empty) Household resource.
 *
 * @param  {Function} callback - called with (err, result)
 */
Households.prototype.new = function(callback) {
  this._get('/Households/New', function(err, body, headers) {
    if (err) return callback(err)

    if (body.household && body.household) return callback(null, body.household)
    else {
      return callback({
        statusCode: 502,
        headers: headers,
        message: body
      })
    }
  })
}

/**
 * See http://developer.fellowshipone.com/docs/v1/Households.help#create
 *
 * @param  {Object} params - params to populate the household with.
 *       Required:
 *       - householdName
 * @param  {Function} callback - called with (err, result)
 */
Households.prototype.create = function(params, callback) {
  this.new(function(err, template) {
    if (err) return callback(err)

    var household = _.merge(template, params)

    this._post('/Households', household, callback)
  }.bind(this))
}

module.exports = Households
