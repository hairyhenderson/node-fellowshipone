'use strict';

var util = require('util')
var _ = require('lodash')

var F1Object = require('./f1object')
var Communications = require('./communications');

function Person(credentials, uri) {
   F1Object.call(this, credentials, 'person', uri, {
      headers: {
         Accept: 'application/vnd.fellowshiponeapi.com.people.people.v2+json',
         'content-type': 'application/vnd.fellowshiponeapi.com.people.people.v2+json'
      },
      json: true
   })

   this.communications = new Communications(credentials, uri + '/Communications')
}

util.inherits(Person, F1Object)

module.exports = Person
