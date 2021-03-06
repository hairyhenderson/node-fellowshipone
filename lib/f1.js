var request = require('request')
var async = require('async')
var _ = require('lodash')
var JJV = require('jjv')
var configSchema = require('../schemas/config.json')
var debug = require('debug')(require('../package.json').name + ':f1')
var jjv = new JJV()

/**
 * F1 utility class
 * @constructor
 * @param config The config option
 */
function F1 (config) {
  var valErrors = jjv.validate(configSchema, config)
  if (valErrors && valErrors.validation) {
    throw new Error('Validation errors: ' +
      JSON.stringify(valErrors.validation, null, 3))
  }

  this.config = config
}

F1.prototype._hash_creds = function (username, password) {
  return new Buffer(username + ' ' + password).toString('base64')
}

/**
 * Pass in a config (with apiURL, username, password, and oauth_credentials properties),
 * and get back a filled-in oauth credentials object (suitable for use on the request.js
 * oauth param) and the logged-in user's URI.
 * @method
 * @param callback the callback
 */
F1.prototype.get_token = function (callback) {
  async.waterfall([
    request.post.bind(request, this.config.apiURL + '/PortalUser/AccessToken', {
      oauth: _.omit(this.config.oauth_credentials, ['token', 'token_secret']),
      form: {
        ec: this._hash_creds(this.config.username, this.config.password)
      }
    }), function (res, body, next) {
      if (res.statusCode === 200) {
        this.config.oauth_credentials.token = res.headers.oauth_token
        this.config.oauth_credentials.token_secret = res.headers.oauth_token_secret
        this.config.userURL = res.headers['content-location']
        debug('Authed successfully as %s', this.config.username)
        next(null, this.config.oauth_credentials, res.headers['content-location'])
      } else {
        var err = {
          statusCode: res.statusCode,
          headers: res.headers,
          message: body
        }
        debug('Failed to authenticate: %j', err)
        next(err)
      }
    }.bind(this)
  ],
    callback)
}

/**
 * Authenticate with our config. creds and uri are available in the config object.
 */
F1.prototype.authenticate = function (callback) {
  this.get_token(function (err, creds, uri) {
    callback(err)
  })
}

module.exports = F1
