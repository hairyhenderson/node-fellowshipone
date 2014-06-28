'use strict';

var request = require('request')
var jsvutil = require('jsvutil')

var oauth_schema = require('../schemas/oauth-credentials.json');

function F1(credentials) {
   Object.defineProperties(this, {
      credentials: {
         set: function(value) {
            if (value) {
               jsvutil.validate(value, oauth_schema)
               this.request = request.defaults({
                  oauth: value
               })
            }
         },
         enumerable: false
      },
      request: {
         writable: true,
         enumerable: false
      }
   })
   this.credentials = credentials
}

module.exports = F1;
module.exports.Person = require('./person')
module.exports.Communications = require('./communications')
module.exports.Household = require('./household')
