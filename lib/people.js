'use strict';

// var util = require('util')
var _ = require('lodash')
var request = require('request')
var async = require('async')

function People(f1) {
  this.f1 = f1
}

People.MEDIA_TYPE = 'application/vnd.fellowshiponeapi.com.people.people.v2+json'

/**
 * Generic HTTP GET for the resource
 *
 * @param  {String}   path      - the path (relative to the configured API URL)
 * of the resource
 * @param  {Object}   query    - optional query object
 * @param  {Function} callback - yields (err, response_body, headers)
 */
People.prototype._get = function(path, query, callback) {
  var config = this.f1.config

  var opts = {
    oauth: config.oauth_credentials,
    headers: {
      accept: People.MEDIA_TYPE,
      'content-type': People.MEDIA_TYPE
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
People.prototype._post = function(path, query, body, callback) {
  var config = this.f1.config

  var opts = {
    uri: config.apiURL + path,
    oauth: config.oauth_credentials,
    headers: {
      accept: People.MEDIA_TYPE,
      'content-type': People.MEDIA_TYPE
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
 * See http://developer.fellowshipone.com/docs/v1/People.help#list
 *
 * Lists all the people in a given household. Note - unlike the API, this yields
 * the actual array of Person objects.
 *
 * @param  {Number}   householdID - the ID of the Household to list the people for.
 */
People.prototype.list = function(householdID, callback) {
  var path = '/Household/' + householdID + '/People'
  this._get(path, function(err, body, headers) {
    if (err) return callback(err)

    if (body.people && body.people.person)
      callback(null, body.people.person)
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
 * See http://developer.fellowshipone.com/docs/v1/People.help#show
 *
 * Gets a person by ID. Note - unlike the API, this yields the unwrapped Person
 * object (i.e. the "person" property of the API's response)
 *
 * @param  {Number}   personID - the ID of the Person
 */
People.prototype.show = function(personID, callback) {
  var path = '/People/' + personID
  this._get(path, function(err, body, headers) {
    if (err) return callback(err)

    if (body.person && body.person) return callback(null, body.person)
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
 *  See http://developer.fellowshipone.com/docs/v1/People.help#search
 *
 *  @param params -
 *  searchFor = Name of the person you are searching for
 *  address = all address values
 *  communication = all communication values
 *  dob = Date of birth for the person your searching for (format: yyyy-mm-dd)*
 *  status = status id
 *  subStatus = sub status id
 *  attribute = attribute id
 *  checkinTagCode = checkinTagCode*
 *  memberEnvNo = memberEnvNo*
 *  barCode = barCode*
 *  id = id*
 *  hsdid = hsdid*
 *  includeInactive = include in active people
 *  includeDeceased = include deceased people
 *  lastUpdatedDate = The date of the last time the person's information was updated (format: yyyy-mm-dd)**
 *  createdDate = The date when the person's information was created / inserted into the system (format: yyyy-mm-dd)*
 *  recordsPerPage = number of records to return for each query (default is 20)
 *  page = page number for the given result set
 */
People.prototype.search = function(params, callback) {
  var query = _.clone(params)
  query.include = 'addresses,communications,attributes,requirements'

  this._get('/People/Search', query, function(err, body) {
    if (err) return callback(err)

    // this probably won't (and shouldn't) return the raw response forever...
    callback(null, body)
  }.bind(this))
}

/**
 * See http://developer.fellowshipone.com/docs/v1/People.help#new
 *
 * Yields a valid (but empty) Person resource.
 *
 * @param  {Function} callback - called with (err, result)
 */
People.prototype.new = function(callback) {
  this._get('/People/New', function(err, body, headers) {
    if (err) return callback(err)

    if (body.person && body.person) return callback(null, body.person)
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
 * See http://developer.fellowshipone.com/docs/v1/People.help#create
 *
 * May need to call Household#search or Household#create first to get
 * the household ID.
 *
 * @param  {Object} params - params to populate the person with.
 *       Required:
 *       - @householdID
 *       - householdMemberType.@id
 *       - status.@id
 *       - lastName
 * @param  {Function} callback - called with (err, result)
 */
People.prototype.create = function(params, callback) {
  this.new(function(err, template) {
    if (err) return callback(err)

    var person = _.merge(template, params)

    this._post('/People', person, callback)
  }.bind(this))
}

module.exports = People
