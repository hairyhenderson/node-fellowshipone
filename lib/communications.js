'use strict';

var util = require('util');
var _ = require('lodash');

var F1Object = require('./f1object');

function Communications(credentials, uri) {
   F1Object.call(this, credentials, 'communications', uri);
}

util.inherits(Communications, F1Object);

module.exports = Communications;
