'use strict';

var util = require('util')
var _ = require('lodash')
var request = require('request')
var async = require('async')
var F1Resource = require('./f1resource')

function HouseholdMemberTypes(f1) {
  F1Resource.call(this, f1)
}

util.inherits(HouseholdMemberTypes, F1Resource)

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
