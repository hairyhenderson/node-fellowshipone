'use strict';
var sinon = require('sinon')
var should = require('should')
var request = require('request')
var F1 = require('../lib/f1')
var Statuses = require('../lib/statuses')

describe('Statuses', function() {
  var r, statuses, f1, config, _statuses;

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
    statuses = new Statuses(f1)
    _statuses = sinon.mock(statuses)
  })

  function verifyAll() {
    r.verify()
    _statuses.verify()
  }

  afterEach(function() {
    r.restore()
    _statuses.restore()
  })

  describe('list', function() {
    it('errors when request errors', function(done) {
      _statuses.expects('_get').yields('error')

      statuses.list(function(err, result) {
        err.should.eql('error')
        verifyAll()
        done()
      })
    })

    it('errors when request yields unexpected object', function(done) {
      _statuses.expects('_get').yields(null, {
        foo: ''
      }, {})

      statuses.list(function(err, results) {
        err.should.eql({
          statusCode: 502,
          headers: {},
          message: {
            foo: ''
          }
        })
        verifyAll()
        done()
      })
    })

    it('returns the list of statuses', function(done) {
      _statuses.expects('_get').withArgs('/Statuses').yields(null, {
        statuses: {
          status: [{}, {}]
        }
      }, {})

      statuses.list(function(err, result) {
        result.should.eql([{}, {}])
        verifyAll()
        done()
      })
    })
  })

  describe('show', function() {
    it('errors when request errors', function(done) {
      _statuses.expects('_get').yields('error')

      statuses.show(42, function(err, result) {
        err.should.eql('error')
        verifyAll()
        done()
      })
    })

    it('errors when request yields unexpected object', function(done) {
      _statuses.expects('_get').withArgs('/Statuses/42').yields(null, {
        foo: ''
      })

      statuses.show(42, function(err, result, headers) {
        err.should.eql({
          statusCode: 502,
          headers: headers,
          message: {
            foo: ''
          }
        })
        verifyAll()
        done()
      })
    })

    it('returns the status object', function(done) {
      _statuses.expects('_get').withArgs('/Statuses/42').yields(null, {
        status: {
          foo: 'bar'
        }
      })

      statuses.show(42, function(err, result) {
        result.should.eql({
          foo: 'bar'
        })
        verifyAll()
        done()
      })
    })
  })
})
