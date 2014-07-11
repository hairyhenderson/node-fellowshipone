'use strict';

var util = require('util')
var _ = require('lodash')

var F1Object = require('./f1object');

function Household(credentials, uri) {
   F1Object.call(this, credentials, 'household', uri)
}

util.inherits(Household, F1Object)

module.exports = Household
