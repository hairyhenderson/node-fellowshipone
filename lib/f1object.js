'use strict';

var _ = require('lodash');
var request = require('request')
var jsvutil = require('jsvutil')
var util = require('util')

var oauth_schema = require('../schemas/oauth-credentials.json');

function F1Object(credentials, type, uri, options) {
   Object.defineProperties(this, {
      // type is hidden
      type: {
         value: type
      },
      // uri is hidden and 'final'
      uri: {
         value: uri
      },
      // @uri is an alias to uri - the setter is a no-op
      '@uri': {
         set: function(value) {},
         get: function() {
            return this.uri;
         },
         enumerable: true
      },
      id: {
         writable: true,
         enumerable: false
      },
      // @id is an alias to id
      '@id': {
         set: function(value) {
            this.id = value;
         },
         get: function() {
            return this.id;
         },
         enumerable: true
      },
      options: {
         value: options,
         writable: true
      },
      credentials: {
         set: (function(value) {
            if (value) {
               jsvutil.validate(value, oauth_schema)
               this.request = request.defaults({
                  oauth: value
               })
            }
         }).bind(this),
         enumerable: false
      },
      request: {
         writable: true,
         enumerable: false
      }
   })
   this.credentials = credentials
}

F1Object.prototype.get = function(callback) {
   var options = this.options || {
      json: true
   }
   this.request.get(this.uri, options, (function(err, res, body) {
      if (err) return callback(err)
      if (res.statusCode > 299) {
         console.error('status %s while getting %s %s: %s', res.statusCode, this.type, this.id, body)
         return callback({
            statusCode: res.statusCode,
            message: body
         })
      }

      if (body[this.type]) {
         _.each(body[this.type], (function(value, key) {
            if (!_.isEmpty(value)) this[key] = value
         }).bind(this))
         callback(null, this)
      } else {
         var msg = util.format('Expected object to have a \'%s\' property, but this is missing!\n%j', this.type, body)
         console.error(msg)
         callback(new Error(msg))
      }
   }).bind(this))
}

module.exports = F1Object;
