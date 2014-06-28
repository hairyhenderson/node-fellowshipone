'use strict';

var util = require('util');
var _ = require('lodash');

var F1Object = require('./f1object');

function Household(f1, uri) {
   F1Object.call(this, f1, 'household', uri);
}

util.inherits(Household, F1Object);

module.exports = Household;
