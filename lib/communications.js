'use strict';

var util = require('util')
var F1Resource = require('./f1resource')

/**
 * This is Communications in a non-household or person context. This means that
 * a household or person ID/object needs to be provided in the parameters for
 * all operations that need a context.
 *
 * @param {Object} f1 - the F1 object
 */
function Communications(f1) {
  F1Resource.call(this, f1, {
    resourceName: 'communication'
  })
}

util.inherits(Communications, F1Resource)

module.exports = Communications
