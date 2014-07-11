'use strict'
var sinon = require('sinon')
var should = require('should')
var request = require('request')
var F1 = require('../lib/f1')

describe('F1', function() {
	var r
	before(function() {
		r = sinon.mock(request)
	})
	after(function() {
		r.restore()
	})
	describe('constructor', function() {
		it.skip('errors given a non-object', function(done) {
			should(function() {
				new F1("not an object")
			}).
			throw ()
			done()
		})
		it.skip('errors given non-schema-valid credentials', function(done) {
			should(function() {
				new F1({
					foo: true
				})
			}).
			throw ()
			done()
		})
		it.skip('sets the OAuth credentials as default request options', function(done) {
			var opts = {
				consumer_key: 'key',
				consumer_secret: 'secret',
				token: 'token',
				token_secret: 'secret'
			}
			var uri = 'http://example.com'
			r.expects('get').withArgs({
				uri: uri,
				oauth: opts
			}).yields()

			var f1 = new F1(opts)
			f1.request.get({ uri: uri }, function(err, res, body) {
				r.verify()
				done()
			})
		})
	})
})
