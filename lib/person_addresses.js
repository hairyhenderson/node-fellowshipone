var util = require('util')
var Addresses = require('./addresses')

/**
 * The Addresses object, in a Person context.
 *
 * @param {Object} f1          - the F1 object
 * @param {Number} personID    - the Person ID, for context
 */
function PersonAddresses (f1, personID) {
  if (!personID) {
    throw new Error('PersonAddresses requires a person ID!')
  }
  Addresses.call(this, f1, {
    path: '/People/' + personID + '/Addresses'
  })
}

util.inherits(PersonAddresses, Addresses)

module.exports = PersonAddresses
