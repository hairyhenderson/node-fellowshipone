'use strict';

var util = require('util')
var _ = require('lodash')
var request = require('request')
var async = require('async')
var F1Resource = require('./f1resource')

function Statuses(f1) {
  F1Resource.call(this, f1, {
    resourceName: 'status',
    resourceNamePlural: 'statuses'
  })
}

util.inherits(Statuses, F1Resource)

module.exports = Statuses
