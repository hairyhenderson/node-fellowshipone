'use strict';
var sinon = require('sinon')
var should = require('should')
var request = require('request')
var F1 = require('../lib/f1')
var HouseholdMemberTypes = require('../lib/householdmembertypes')

describe('HouseholdMemberTypes', function() {
  var r, householdmembertypes, f1, config, _householdmembertypes;

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
    householdmembertypes = new HouseholdMemberTypes(f1)
    _householdmembertypes = sinon.mock(householdmembertypes)
  })

  function verifyAll() {
    r.verify()
    _householdmembertypes.verify()
  }

  afterEach(function() {
    r.restore()
    _householdmembertypes.restore()
  })

  describe('_get', function() {
    it('errors when request errors', function(done) {
      r.expects('get').yields('error')

      householdmembertypes._get('/', function(err, result) {
        err.should.eql('error')
        verifyAll()
        done()
      })
    })

    it('errors when request gives non-200 status', function(done) {
      r.expects('get').yields(null, {
        statusCode: 404,
        headers: {}
      }, 'foo')

      householdmembertypes._get('/', function(err, result) {
        err.should.eql({
          statusCode: 404,
          headers: {},
          message: 'foo'
        })
        verifyAll()
        done()
      })
    })

    it('yields the body and headers when successful without query', function(done) {
      r.expects('get').withArgs('http://example.com/mypath', {
        oauth: {
          consumer_key: '123',
          consumer_secret: 'secret'
        },
        headers: {
          accept: HouseholdMemberTypes.MEDIA_TYPE,
          'content-type': HouseholdMemberTypes.MEDIA_TYPE
        },
        json: true
      }).yields(null, {
        statusCode: 200,
        headers: {}
      }, 'body')

      householdmembertypes._get('/mypath', function(err, body, headers) {
        body.should.eql('body')
        headers.should.eql({})
        verifyAll()
        done()
      })
    })

    it('yields the body and headers when successful with query', function(done) {
      r.expects('get').withArgs('http://example.com/mypath', {
        oauth: {
          consumer_key: '123',
          consumer_secret: 'secret'
        },
        headers: {
          accept: HouseholdMemberTypes.MEDIA_TYPE,
          'content-type': HouseholdMemberTypes.MEDIA_TYPE
        },
        json: true,
        qs: {
          query: 42
        }
      }).yields(null, {
        statusCode: 200,
        headers: {}
      }, 'body')

      householdmembertypes._get('/mypath', {
        query: 42
      }, function(err, body, headers) {
        body.should.eql('body')
        headers.should.eql({})
        verifyAll()
        done()
      })
    })
  })

  describe('list', function() {
    it('errors when request errors', function(done) {
      _householdmembertypes.expects('_get').yields('error')

      householdmembertypes.list(function(err, result) {
        err.should.eql('error')
        verifyAll()
        done()
      })
    })

    it('errors when request yields unexpected object', function(done) {
      _householdmembertypes.expects('_get').yields(null, {
        foo: ''
      }, {})

      householdmembertypes.list(function(err, results) {
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

    it('returns the list of householdmembertypes', function(done) {
      _householdmembertypes.expects('_get').withArgs('/People/HouseholdMemberTypes').yields(null, {
        householdmembertypes: {
          householdmembertype: [{}, {}]
        }
      }, {})

      householdmembertypes.list(function(err, result) {
        result.should.eql([{}, {}])
        verifyAll()
        done()
      })
    })
  })

  describe('show', function() {
    it('errors when request errors', function(done) {
      _householdmembertypes.expects('_get').yields('error')

      householdmembertypes.show(42, function(err, result) {
        err.should.eql('error')
        verifyAll()
        done()
      })
    })

    it('errors when request yields unexpected object', function(done) {
      _householdmembertypes.expects('_get').withArgs('/People/HouseholdMemberTypes/42').yields(null, {
        foo: ''
      })

      householdmembertypes.show(42, function(err, result, headers) {
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
      _householdmembertypes.expects('_get').withArgs('/People/HouseholdMemberTypes/42').yields(null, {
        householdmembertype: {
          foo: 'bar'
        }
      })

      householdmembertypes.show(42, function(err, result) {
        result.should.eql({
          foo: 'bar'
        })
        verifyAll()
        done()
      })
    })
  })
})
