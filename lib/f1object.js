'use strict';

var _ = require('lodash');

function F1Object(f1, type, uri, options) {
   Object.defineProperties(this, {
      // type is hidden
      type: {
         value: type
      },
      // f1 is a hidden 'final' object
      f1: {
         value: f1
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
      }
   });
}

F1Object.prototype.get = function(callback) {
   var options = this.options || { json: true }
   this.f1.request.get(this.uri, options, (function(err, res, body) {
      var re = /^application\/[a-z0-9.]*\+{0,1}json;?/
      if (res.headers['content-type'].match(re)) {
         body = JSON.parse(body)
      }
      if (err) return callback(err);
      if (res.statusCode > 299) {
         console.log('status %s while getting %s %s: %s', res.statusCode, this.type, this.id, body);
         return callback({
            statusCode: res.statusCode,
            message: body
         });
      }

      if (body[this.type]) {
         _.each(body[this.type], (function(value, key) {
            if (!_.isEmpty(value)) this[key] = value;
         }).bind(this));
         callback(null, this);
      } else {
         callback(new Error('Expected object to have a \'' + this.type + '\' property, but this is missing!'));
      }
   }).bind(this));
};

module.exports = F1Object;
