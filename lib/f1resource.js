'use strict';

// var util = require('util')
var _ = require('lodash')
var request = require('request')
var async = require('async')

function F1Resource(f1, mediaType) {
  this.f1 = f1
  this.mediaType = mediaType || 'application/json'
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
    oauth: config.oauth_credentials,
    headers: {
      accept: this.mediaType,
      'content-type': this.mediaType
    },
    json: true,
    qs: query
  }

  // query is optional...
  if (typeof query == 'function') {
    callback = query
    delete opts.qs
  }

  var handleErrorStatus = function(res, body, next) {
    if (res.statusCode > 299) {
      return next({
        statusCode: res.statusCode,
        headers: res.headers,
        message: body
      })
    } else return next(null, res, body)
  }

  async.waterfall([
    request.get.bind(request, config.apiURL + path, opts),
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

  // query is optional...
  if (typeof body == 'function') {
    callback = body
    opts.json = query
    delete opts.qs
  }

  var handleErrorStatus = function(res, body, next) {
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

module.exports = F1Resource
