'use strict';

var debug = require('debug')(require('../package.json').name + ':f1resource')
var _ = require('lodash')
var request = require('request')
var async = require('async')

function F1Resource(f1, options) {
  this.f1 = f1
  this.options = options || {}
  this.mediaType = this.options.mediaType || 'application/json'
  this.resourceName = this.options.resourceName
  this.resourceNamePlural = this.options.resourceNamePlural || this.resourceName + 's'
  this.path = this.options.path || '/' + _.capitalize(this.resourceNamePlural)
  this.searchParams = this.options.searchParams || {}
}

/**
 * Generic HTTP GET for the resource
 *
 * @param  {String}   path      - the path (relative to the configured API URL)
 * of the resource
 * @param  {Object}   query    - optional query object
 * @param  {Function} callback - yields (err, response_body, headers)
 */
F1Resource.prototype._get = function(path, query, callback) {
  var config = this.f1.config

  var opts = {
    uri: config.apiURL + path,
    oauth: config.oauth_credentials,
    headers: {
      accept: this.mediaType,
      'content-type': this.mediaType
    },
    json: true,
    qs: query
  }
  debug('GET opts: %j', opts)

  // query is optional...
  if (typeof query == 'function') {
    callback = query
    delete opts.qs
  }

  var handleErrorStatus = function(res, body, next) {
    if (res.statusCode > 299) {
      debug('%s %s: %s', (res.request && res.request.method) || '', path, res.statusCode)
      return next({
        statusCode: res.statusCode,
        headers: res.headers,
        message: body
      })
    } else return next(null, res, body)
  }

  async.waterfall([
    request.get.bind(request, opts),
    handleErrorStatus
  ], function(err, res, body) {
    callback(err, body, res && res.headers ? res.headers : undefined)
  })
}

/**
 * Generic HTTP POST for the resource
 *
 * @param  {String}   path     - the path (relative to the configured API URL)
 * of the resource
 * @param  {Object}   query    - optional query object
 * @param  {Object}   body     - the JSON data to POST
 * @param  {Function} callback - yields (err, response_body, headers)
 */
F1Resource.prototype._post = function(path, query, body, callback) {
  var config = this.f1.config

  var opts = {
    uri: config.apiURL + path,
    oauth: config.oauth_credentials,
    headers: {
      accept: this.mediaType,
      'content-type': this.mediaType
    },
    json: body,
    qs: query
  }
  debug('POST opts: %j', opts)

  // query is optional...
  if (typeof body == 'function') {
    callback = body
    opts.json = query
    delete opts.qs
  }

  var handleErrorStatus = function(res, body, next) {
    debug('%s %s: %s', (res.request && res.request.method) || '', path, res.statusCode)
    if (res.statusCode > 299) {
      return next({
        statusCode: res.statusCode,
        headers: res.headers,
        message: body
      })
    } else return next(null, res, body)
  }

  async.waterfall([
    request.post.bind(request, opts),
    handleErrorStatus
  ], function(err, res, body) {
    callback(err, body, res && res.headers ? res.headers : undefined)
  })
}

/**
 * Note - unlike the API, this yields the actual array of objects.
 */
F1Resource.prototype.list = function(callback) {
  this._get(this.path, function(err, body, headers) {
    if (err) return callback(err)

    if (body && body[this.resourceNamePlural] && body[this.resourceNamePlural][this.resourceName])
      callback(null, body[this.resourceNamePlural][this.resourceName])
    else {
      return callback({
        statusCode: 502,
        headers: headers,
        message: body
      })
    }
  }.bind(this))
}

/***
 * Note - unlike the API, this yields the unwrapped object.
 *
 * @param  {Number}   id - the object's ID
 */
F1Resource.prototype.show = function(id, callback) {
  var path = this.path + '/' + id
  this._get(path, function(err, body, headers) {
    if (err) return callback(err)

    if (body && body[this.resourceName]) return callback(null, body[this.resourceName])
    else {
      return callback({
        statusCode: 502,
        headers: headers,
        message: body
      })
    }
  }.bind(this))
}

/**
 * Yields a valid (but empty) resource.
 *
 * @param  {Function} callback - called with (err, result)
 */
F1Resource.prototype.new = function(callback) {
  this._get(this.path + '/New', function(err, body, headers) {
    if (err) return callback(err)

    if (body && body[this.resourceName]) return callback(null, body[this.resourceName])
    else {
      return callback({
        statusCode: 502,
        headers: headers,
        message: body
      })
    }
  }.bind(this))
}

/**
 * @param  {Object} params - params to populate the resource with.
 * @param  {Function} callback - called with (err, result)
 */
F1Resource.prototype.create = function(params, callback) {
  this.new(function(err, template) {
    if (err) return callback(err)

    var person = _.merge(template, params)

    this._post(this.path, person, callback)
  }.bind(this))
}

/**
 *  @param params - the search parameters. Will be merged with any resource defaults, if applicable.
 */
F1Resource.prototype.search = function(params, callback) {
  var query = _.merge(params, this.searchParams)

  this._get(this.path + '/Search', query, function(err, body) {
    if (err) return callback(err)

    // this probably won't (and shouldn't) return the raw response forever...
    callback(null, body)
  }.bind(this))
}

module.exports = F1Resource
