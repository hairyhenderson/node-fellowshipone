'use strict';
/*!
 * @copyright (c) 2014 Dave Henderson
 * @license MIT
 */
var request = require('request'),
  async = require('async'),
  JJV = require('jjv'),
  config_schema = require('../schemas/config.json'),
  oauth_schema = require('../schemas/oauth-credentials.json');

var jjv = new JJV();

/**
 * F1 utility class
 * @constructor
 * @param config The config option
 */
function F1(config) {
  var val_errors = jjv.validate(config_schema, config)
  if (val_errors && val_errors.validation)
    throw new Error('Validation errors: ' +
      JSON.stringify(val_errors.validation, null, 3))

  this.config = config
}

F1.prototype._hash_creds = function(username, password) {
  return new Buffer(username + ' ' + password).toString('base64')
}

/**
 * Pass in a config (with apiURL, username, password, and oauth_credentials properties),
 * and get back a filled-in oauth credentials object (suitable for use on the request.js
 * oauth param) and the logged-in user's URI.
 * @method
 * @param callback the callback
 */
F1.prototype.get_token = function(callback) {
  async.waterfall([
      request.post.bind(request, this.config.apiURL + '/PortalUser/AccessToken', {
        oauth: this.config.oauth_credentials,
        form: {
          ec: this._hash_creds(this.config.username, this.config.password)
        }
      }), (function(res, body, next) {
        if (res.statusCode === 200) {
          this.config.oauth_credentials.token = res.headers.oauth_token
          this.config.oauth_credentials.token_secret = res.headers.oauth_token_secret
          this.config.userURL = res.headers['content-location']
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
