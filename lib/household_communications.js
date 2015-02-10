'use strict';

var util = require('util')
var Communications = require('./communications')

/**
 * The Communications object, in a Household context.
 *
 * @param {Object} f1          - the F1 object
 * @param {Number} householdID - the Household ID, for context
 */
function HouseholdCommunications(f1, householdID) {
  if (!householdID) {
    throw new Error('HouseholdCommunications requires a household ID!')
  }
  Communications.call(this, f1, {
    path: '/Households/' + householdID + '/Communications'
  })
}

util.inherits(HouseholdCommunications, Communications)

module.exports = HouseholdCommunications
