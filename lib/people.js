'use strict';

// var util = require('util')
var _ = require('lodash')
var request = require('request')

function People(f1) {
  this.f1 = f1
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
  var config = this.f1.config
  var query = _.clone(params)
  query.include = 'addresses,communications,attributes,requirements'

  request.get(config.apiURL + '/People/Search', {
    oauth: config.oauth_credentials,
    headers: {
      accept: 'application/vnd.fellowshiponeapi.com.people.people.v2+json',
      'content-type': 'application/vnd.fellowshiponeapi.com.people.people.v2+json'
    },
    json: true,
    qs: query
  }, function(err, res, body) {
    if (err) return callback(err)

    if (res.statusCode > 399) {
      return callback({
        statusCode: res.statusCode,
        headers: res.headers,
        message: body
      })
    }

    // this probably won't (and shouldn't) return the raw response forever...
    callback(null, body)
  }.bind(this))
}

module.exports = People
