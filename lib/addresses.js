'use strict';

var util = require('util')
var _ = require('lodash')
var F1Resource = require('./f1resource')

/**
 * This is Addresses in a non-household or person context. This means that
 * a household or person ID/object needs to be provided in the parameters for
 * all operations that need a context.
 *
 * @param {Object} f1 - the F1 object
 */
function Addresses(f1, options) {
  var opts = options || {
    resourceName: 'address',
    resourceNamePlural: 'addresses',
  }
  if (!opts.resourceName) {
    opts.resourceName = 'address'
  }
  F1Resource.call(this, f1, opts)
}

util.inherits(Addresses, F1Resource)

/**
 * This implementation of create will first remove any address.@generalType
 * property from the given params. This is because F1's API is too brittle to
 * handle it in a new Addresses object, despite providing @generalType as
 * part of the CommunicationType object returned by a "show" operation.
 *
 * @param  {Object} params - params to populate the resource with.
 * @param  {Function} callback - called with (err, result)
 */
// Addresses.prototype.create = function(orig_params, callback) {
//   var params = _.clone(orig_params)
//   if (!!params.communicationType && !!params.communicationType['@generalType'])
//     delete params.communicationType['@generalType']
//   F1Resource.prototype.create.call(this, params, callback)
// }

module.exports = Addresses
