'use strict';

var util = require('util')
var Communications = require('./communications')

/**
 * The Communications object, in a Person context.
 *
 * @param {Object} f1          - the F1 object
 * @param {Number} personID    - the Person ID, for context
 */
function PersonCommunications(f1, personID) {
  if (!personID) {
    throw new Error('PersonCommunications requires a person ID!')
  }
  Communications.call(this, f1, {
    path: '/People/' + personID + '/Communications'
  })
}

util.inherits(PersonCommunications, Communications)

module.exports = PersonCommunications
