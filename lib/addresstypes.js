'use strict';

var util = require('util')
var F1Resource = require('./f1resource')

function AddressTypes(f1) {
  F1Resource.call(this, f1, {
    resourceName: 'addressType',
    path: '/Addresses/AddressTypes'
  })
}

util.inherits(AddressTypes, F1Resource)

module.exports = AddressTypes
