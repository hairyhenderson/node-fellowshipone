'use strict';
var sinon = require('sinon')
var should = require('should')
var request = require('request')
var F1 = require('../lib/f1')
var People = require('../lib/people')

describe('People', function() {
  var r, people, f1, config;

  beforeEach(function() {
    r = sinon.mock(request)
    config = {
      apiURL: 'http://example.com',
      oauth_credentials: {
        consumer_key: '123',
        consumer_secret: 'secret'
      },
      username: 'joe',
      password: 'swordfish'
    }
    f1 = new F1(config)
    people = new People(f1)
  })

  function verifyAll() {
    r.verify()
  }

  afterEach(function() {
    r.restore()
  })

  describe('search', function() {
    it('errors when request errors', function(done) {
      r.expects('get').yields('error')

      people.search({}, function(err, result) {
        err.should.eql('error')
        done()
      })
    })

    it('errors when request gives non-200 status', function(done) {
      r.expects('get').yields(null, {
        statusCode: 404,
        headers: {}
      }, 'foo')

      people.search({}, function(err, result) {
        err.should.eql({
          statusCode: 404,
          headers: {},
          message: 'foo'
        })
        done()
      })
    })

    it('returns the search results', function(done) {
      r.expects('get').yields(null, {
        statusCode: 200
      }, {
        results: 100
      })

      people.search({}, function(err, result) {
        result.should.eql({
          results: 100
        })
        done()
      })
    })

    it('uses given search parameters', function(done) {
      r.expects('get').withArgs(config.apiURL + '/People/Search', {
        oauth: config.oauth_credentials,
        headers: {
          accept: 'application/vnd.fellowshiponeapi.com.people.people.v2+json',
          'content-type': 'application/vnd.fellowshiponeapi.com.people.people.v2+json'
        },
        json: true,
        qs: {
          searchFor: 'foo',
          include: 'addresses,communications,attributes,requirements'
        }
      }).yields(null, {
        statusCode: 200
      }, {
        results: 100
      })

      people.search({
        searchFor: 'foo'
      }, function(err, result) {
        result.should.eql({
          results: 100
        })
        done()
      })
    })
  })
})
