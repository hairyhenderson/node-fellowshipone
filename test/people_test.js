'use strict';
var sinon = require('sinon')
var should = require('should')
var request = require('request')
var F1 = require('../lib/f1')
var People = require('../lib/people')

describe('People', function() {
  var r, people, f1, config, _people;

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
    _people = sinon.mock(people)
  })

  function verifyAll() {
    r.verify()
    _people.verify()
  }

  afterEach(function() {
    r.restore()
    _people.restore()
  })

  describe('list', function() {
    it('errors when request errors', function(done) {
      _people.expects('_get').yields('error')

      people.list(0, function(err, result) {
        err.should.eql('error')
        verifyAll()
        done()
      })
    })

    it('errors when request yields unexpected object', function(done) {
      _people.expects('_get').yields(null, {
        foo: ''
      }, {})

      people.list(42, function(err, results) {
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

    it('returns the list of people', function(done) {
      _people.expects('_get').yields(null, {
        people: {
          person: [{}, {}]
        }
      }, {})

      people.list(42, function(err, result) {
        result.should.eql([{}, {}])
        verifyAll()
        done()
      })
    })
  })
})
