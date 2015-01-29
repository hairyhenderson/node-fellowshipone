'use strict';

var util = require('util')
var _ = require('lodash')
var request = require('request')
var async = require('async')
var F1Resource = require('./f1resource')

function Households(f1) {
  F1Resource.call(this, f1, {
    resourceName: 'household'
  })
}

util.inherits(Households, F1Resource)

module.exports = Households
