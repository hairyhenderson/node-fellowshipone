'use strict';

var util = require('util');
var _ = require('lodash');

var F1Object = require('./f1object');

function Communications(f1, uri) {
   F1Object.call(this, f1, 'communications', uri);
}

util.inherits(Communications, F1Object);

module.exports = Communications;
