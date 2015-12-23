var util = require('util')
var Addresses = require('./addresses')

/**
 * The Addresses object, in a Household context.
 *
 * @param {Object} f1          - the F1 object
 * @param {Number} householdID - the Household ID, for context
 */
function HouseholdAddresses (f1, householdID) {
  if (!householdID) {
    throw new Error('HouseholdAddresses requires a household ID!')
  }
  Addresses.call(this, f1, {
    path: '/Households/' + householdID + '/Addresses'
  })
}

util.inherits(HouseholdAddresses, Addresses)

module.exports = HouseholdAddresses
