'use strict';

var request = require('request'),
   async = require('async');

/**
 * @constructor
 */

function F1(config) {
   this.config = config
}

/**
 * Pass in a config (with apiURL, username, password, and oauth_credentials properties),
 * and get back a filled-in oauth credentials object (suitable for use on the request.js
 * oauth param) and the logged-in user's URI.
 *
 * @param
 */
F1.prototype.get_token = function(callback) {
   async.waterfall([
         request.post.bind(request, this.config.apiURL + '/PortalUser/AccessToken', {
            oauth: this.config.oauth_credentials,
            form: {
               ec: new Buffer(this.config.username + ' ' + this.config.password).toString('base64')
            }
         }), (function(res, body, next) {
            if (res.statusCode === 200) {
               this.config.oauth_credentials.token = res.headers.oauth_token
               this.config.oauth_credentials.token_secret = res.headers.oauth_token_secret
               this.config.userURI = res.headers['content-location']
               next(null, this.config.oauth_credentials, res.headers['content-location'])
            } else {
               next({
                  statusCode: res.statusCode,
                  headers: res.headers,
                  message: body
               })
            }
         }).bind(this)
      ],
      callback)
}

/**
 * Authenticate with our config. creds and uri are available in the config object.
 */
F1.prototype.authenticate = function(callback) {
   this.get_token(function(err, creds, uri) {
      callback(err)
   })
}

module.exports = F1
