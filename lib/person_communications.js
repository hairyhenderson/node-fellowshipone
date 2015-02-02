'use strict';

var util = require('util')
var F1Resource = require('./f1resource')

/**
 * The Communications object, in a Person context.
 *
 * @param {Object} f1          - the F1 object
 * @param {Number} personID    - the Person ID, for context
 */
function PersonCommunications(f1, personID) {
  if (typeof(personID) !== 'number') {
    throw new Error('PersonCommunications requires a person ID!')
  }
  F1Resource.call(this, f1, {
    resourceName: 'communication',
    path: '/People/' + personID + '/Communications'
  })
}

util.inherits(PersonCommunications, F1Resource)

module.exports = PersonCommunications
