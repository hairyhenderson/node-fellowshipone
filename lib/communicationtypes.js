'use strict';

var util = require('util')
var F1Resource = require('./f1resource')

function CommunicationTypes(f1) {
  F1Resource.call(this, f1, {
    resourceName: 'communicationtype',
    path: '/Communications/CommunicationTypes'
  })
}

util.inherits(CommunicationTypes, F1Resource)

module.exports = CommunicationTypes
