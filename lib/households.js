'use strict';

// var util = require('util')
var _ = require('lodash')
var request = require('request')
var async = require('async')

function Households(f1) {
  this.f1 = f1
}

Households.MEDIA_TYPE = 'application/json'

/**
 * Generic HTTP GET for the resource
 *
 * @param  {String}   path      - the path (relative to the configured API URL)
 * of the resource
 * @param  {Object}   query    - optional query object
 * @param  {Function} callback - yields (err, response_body, headers)
 */
Households.prototype._get = function(path, query, callback) {
  var config = this.f1.config

  var opts = {
    oauth: config.oauth_credentials,
    headers: {
      accept: Households.MEDIA_TYPE,
      'content-type': Households.MEDIA_TYPE
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
 * Generic HTTP POST for the resource
 *
 * @param  {String}   path     - the path (relative to the configured API URL)
 * of the resource
 * @param  {Object}   query    - optional query object
 * @param  {Object}   body     - the JSON data to POST
 * @param  {Function} callback - yields (err, response_body, headers)
 */
Households.prototype._post = function(path, query, body, callback) {
  var config = this.f1.config

  var opts = {
    uri: config.apiURL + path,
    oauth: config.oauth_credentials,
    headers: {
      accept: Households.MEDIA_TYPE,
      'content-type': Households.MEDIA_TYPE
    },
    json: body,
    qs: query
  }

  // query is optional...
  if (typeof body == 'function') {
    callback = body
    opts.json = query
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
    request.post.bind(request, opts),
    handleErrorStatus
  ], function(err, res, body) {
    callback(err, body, res && res.headers ? res.headers : undefined)
  })
}

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
