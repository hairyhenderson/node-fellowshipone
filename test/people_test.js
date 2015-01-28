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

  describe('show', function() {
    it('errors when request errors', function(done) {
      _people.expects('_get').yields('error')

      people.show(42, function(err, person) {
        err.should.eql('error')
        verifyAll()
        done()
      })
    })

    it('errors when request yields unexpected object', function(done) {
      _people.expects('_get').withArgs('/People/42').yields(null, {
        foo: ''
      })

      people.show(42, function(err, person, headers) {
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

    it('returns the person object', function(done) {
      _people.expects('_get').withArgs('/People/42').yields(null, {
        person: {
          firstName: 'Joe'
        }
      })

      people.show(42, function(err, person) {
        person.should.eql({
          firstName: 'Joe'
        })
        verifyAll()
        done()
      })
    })
  })

  describe('search', function() {
    it('errors when request errors', function(done) {
      _people.expects('_get').yields('error')

      people.search({}, function(err, result) {
        err.should.eql('error')
        verifyAll()
        done()
      })
    })

    it('returns the search results', function(done) {
      _people.expects('_get').yields(null, {
        results: 100
      })

      people.search({}, function(err, result) {
        result.should.eql({
          results: 100
        })
        verifyAll()
        done()
      })
    })

    it('uses given search parameters', function(done) {
      _people.expects('_get').withArgs('/People/Search', {
        searchFor: 'foo',
        include: 'addresses,communications,attributes,requirements'
      }).yields(null, {
        results: 100
      })

      people.search({
        searchFor: 'foo'
      }, function(err, result) {
        result.should.eql({
          results: 100
        })
        verifyAll()
        done()
      })
    })
  })

  describe('new', function() {
    it('errors when request errors', function(done) {
      _people.expects('_get').withArgs('/People/New').yields('error')

      people.new(function(err, result) {
        err.should.eql('error')

        verifyAll()
        done()
      })
    })

    it('errors when request yields unexpected object', function(done) {
      _people.expects('_get').withArgs('/People/New').yields(null, {
        foo: ''
      })

      people.new(function(err, result, headers) {
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

    it('returns the household template', function(done) {
      _people.expects('_get').withArgs('/People/New').yields(null, {
        person: {
          firstName: 'Joe'
        }
      })

      people.new(function(err, person) {
        person.should.eql({
          firstName: 'Joe'
        })
        verifyAll()
        done()
      })
    })
  })

  describe('create', function() {
    it('errors when call to new errors', function(done) {
      _people.expects('new').yields('error')

      people.create({}, function(err, result) {
        err.should.eql('error')
        verifyAll()
        done()
      })
    })

    it('should yield error when call to _post fails', function(done) {
      _people.expects('new').yields(null, {
        firstName: '',
        lastName: ''
      })
      _people.expects('_post').yields('error')

      people.create({}, function(err, result) {
        err.should.eql('error')
        verifyAll()
        done()
      })
    })

    it('posts merged body to /People', function(done) {
      var household = {
        firstName: 'Jack'
      }
      var mergedHousehold = {
        firstName: household.firstName,
        lastName: ''
      }

      _people.expects('new').yields(null, {
        firstName: '',
        lastName: ''
      })
      _people.expects('_post').withArgs('/People', mergedHousehold).yields(null, '')

      people.create(household, function(err, result) {
        should(err).not.exist
        result.should.eql('')
        verifyAll()
        done()
      })
    })
  })
})
