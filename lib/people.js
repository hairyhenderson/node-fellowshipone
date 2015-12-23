var util = require('util')
var F1Resource = require('./f1resource')

function People (f1) {
  F1Resource.call(this, f1, {
    mediaType: 'application/vnd.fellowshiponeapi.com.people.people.v2+json',
    resourceName: 'person',
    resourceNamePlural: 'people',
    searchParams: {
      include: 'addresses,communications,attributes,requirements'
    }
  })
}

util.inherits(People, F1Resource)

/**
 * See http://developer.fellowshipone.com/docs/v1/People.help#list
 *
 * Lists all the people in a given household. Note - unlike the API, this yields
 * the actual array of Person objects.
 *
 * @param  {Number}   householdID - the ID of the Household to list the people for.
 */
People.prototype.list = function (householdID, callback) {
  var path = '/Household/' + householdID + '/People'
  this._get(path, function (err, body, headers) {
    if (err) return callback(err)

    if (body.people && body.people.person) {
      callback(null, body.people.person)
    } else {
      return callback({
        statusCode: 502,
        headers: headers,
        message: body
      })
    }
  })
}

module.exports = People
