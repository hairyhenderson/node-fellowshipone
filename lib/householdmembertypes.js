'use strict';

// var util = require('util')
var _ = require('lodash')
var request = require('request')
var async = require('async')

function HouseholdMemberTypes(f1) {
  this.f1 = f1
}

HouseholdMemberTypes.MEDIA_TYPE = 'application/json'

/**
* Generic HTTP GET for the resource
*
* @param  {String}   path      - the path (relative to the configured API URL)
* of the resource
* @param  {Object}   query    - optional query object
* @param  {Function} callback - yields (err, response_body, headers)
*/
HouseholdMemberTypes.prototype._get = function(path, query, callback) {
  var config = this.f1.config

  var opts = {
    oauth: config.oauth_credentials,
    headers: {
      accept: HouseholdMemberTypes.MEDIA_TYPE,
      'content-type': HouseholdMemberTypes.MEDIA_TYPE
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
  * See http://developer.fellowshipone.com/docs/v1/People/HouseholdMemberTypes.help#list
  *
  * Note - unlike the API, this yields the actual array of objects.
  */
  HouseholdMemberTypes.prototype.list = function(callback) {
    var path = '/People/HouseholdMemberTypes'
    this._get(path, function(err, body, headers) {
      if (err) return callback(err)

      if (body.householdmembertypes && body.householdmembertypes.householdmembertype)
      callback(null, body.householdmembertypes.householdmembertype)
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
  * See http://developer.fellowshipone.com/docs/v1/People/HouseholdMemberTypes.help#show
  *
  * Note - unlike the API, this yields the unwrapped object.
  *
  * @param  {Number}   id - the object's ID
  */
  HouseholdMemberTypes.prototype.show = function(id, callback) {
    var path = '/People/HouseholdMemberTypes/' + id
    this._get(path, function(err, body, headers) {
      if (err) return callback(err)

      if (body.householdmembertype && body.householdmembertype) return callback(null, body.householdmembertype)
      else {
        return callback({
          statusCode: 502,
          headers: headers,
          message: body
        })
      }
    })
  }

  module.exports = HouseholdMemberTypes
