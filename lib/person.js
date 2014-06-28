'use strict';

var util = require('util');
var _ = require('lodash');

var F1Object = require('./f1object');
var Communications = require('./communications')

function Person(f1, uri) {
   F1Object.call(this, f1, 'person', uri, {
      headers: {
         Accept: 'application/vnd.fellowshiponeapi.com.people.people.v2+json',
         'content-type': 'application/vnd.fellowshiponeapi.com.people.people.v2+json'
      }
   });

   this.communications = new Communications(f1, uri + '/Communications')
}

util.inherits(Person, F1Object);

module.exports = Person;
