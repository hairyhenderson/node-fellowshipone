'use strict';

var util = require('util')
var F1Resource = require('./f1resource')

/**
 * The Communications object, in a Household context.
 *
 * @param {Object} f1          - the F1 object
 * @param {Number} householdID - the Household ID, for context
 */
function HouseholdCommunications(f1, householdID) {
  if (typeof(householdID) !== 'number') {
    throw new Error('HouseholdCommunications requires a household ID!')
  }
  F1Resource.call(this, f1, {
    resourceName: 'communication',
    path: '/Households/' + householdID + '/Communications'
  })
}

util.inherits(HouseholdCommunications, F1Resource)

module.exports = HouseholdCommunications
