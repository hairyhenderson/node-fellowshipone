'use strict';
var sinon = require('sinon')
var should = require('should')
var request = require('request')
var F1 = require('../lib/f1')
var Households = require('../lib/households')

describe('Households', function() {
  var r, households, f1, config, _households;

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
    households = new Households(f1)
    _households = sinon.mock(households)
  })

  function verifyAll() {
    r.verify()
    _households.verify()
  }

  afterEach(function() {
    r.restore()
    _households.restore()
  })

  describe('_get', function() {
    it('errors when request errors', function(done) {
      r.expects('get').yields('error')

      households._get('/', function(err, result) {
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

      households._get('/', function(err, result) {
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
          accept: Households.MEDIA_TYPE,
          'content-type': Households.MEDIA_TYPE
        },
        json: true
      }).yields(null, {
        statusCode: 200,
        headers: {}
      }, 'body')

      households._get('/mypath', function(err, body, headers) {
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
          accept: Households.MEDIA_TYPE,
          'content-type': Households.MEDIA_TYPE
        },
        json: true,
        qs: {
          query: 42
        }
      }).yields(null, {
        statusCode: 200,
        headers: {}
      }, 'body')

      households._get('/mypath', {
        query: 42
      }, function(err, body, headers) {
        body.should.eql('body')
        headers.should.eql({})
        verifyAll()
        done()
      })
    })
  })

  describe('_post', function() {
    it('errors when request errors', function(done) {
      r.expects('post').yields('error')

      households._post('/', {}, function(err, result) {
        err.should.eql('error')
        verifyAll()
        done()
      })
    })

    it('errors when request gives non-200 status', function(done) {
      r.expects('post').yields(null, {
        statusCode: 404,
        headers: {}
      }, 'foo')

      households._post('/', {}, function(err, result) {
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
      r.expects('post').withArgs({
        uri: 'http://example.com/mypath',
        oauth: {
          consumer_key: '123',
          consumer_secret: 'secret'
        },
        headers: {
          accept: Households.MEDIA_TYPE,
          'content-type': Households.MEDIA_TYPE
        },
        json: {}
      }).yields(null, {
        statusCode: 200,
        headers: {}
      }, 'body')

      households._post('/mypath', {}, function(err, body, headers) {
        body.should.eql('body')
        headers.should.eql({})
        verifyAll()
        done()
      })
    })

    it('yields the body and headers when successful with query', function(done) {
      var query = {
        query: 42
      }
      var body = {
        foo: true
      }
      r.expects('post').withArgs({
        uri: 'http://example.com/mypath',
        oauth: {
          consumer_key: '123',
          consumer_secret: 'secret'
        },
        headers: {
          accept: Households.MEDIA_TYPE,
          'content-type': Households.MEDIA_TYPE
        },
        json: body,
        qs: query
      }).yields(null, {
        statusCode: 200,
        headers: {}
      }, 'body')

      households._post('/mypath', query, body, function(err, body, headers) {
        body.should.eql('body')
        headers.should.eql({})
        verifyAll()
        done()
      })
    })
  })

  describe('show', function() {
    it('errors when request errors', function(done) {
      _households.expects('_get').yields('error')

      households.show(42, function(err, result) {
        err.should.eql('error')
        verifyAll()
        done()
      })
    })

    it('errors when request yields unexpected object', function(done) {
      _households.expects('_get').withArgs('/Households/42').yields(null, {
        foo: ''
      })

      households.show(42, function(err, result, headers) {
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

    it('returns the household object', function(done) {
      _households.expects('_get').withArgs('/Households/42').yields(null, {
        household: {
          firstName: 'Joe'
        }
      })

      households.show(42, function(err, household) {
        household.should.eql({
          firstName: 'Joe'
        })
        verifyAll()
        done()
      })
    })
  })

  describe('search', function() {
    it('errors when request errors', function(done) {
      _households.expects('_get').yields('error')

      households.search({}, function(err, result) {
        err.should.eql('error')
        verifyAll()
        done()
      })
    })

    it('returns the search results', function(done) {
      _households.expects('_get').yields(null, {
        results: 100
      })

      households.search({}, function(err, result) {
        result.should.eql({
          results: 100
        })
        verifyAll()
        done()
      })
    })

    it('uses given search parameters', function(done) {
      _households.expects('_get').withArgs('/Households/Search', {
        searchFor: 'foo'
      }).yields(null, {
        results: 100
      })

      households.search({
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
      _households.expects('_get').withArgs('/Households/New').yields('error')

      households.new(function(err, result) {
        err.should.eql('error')

        verifyAll()
        done()
      })
    })

    it('errors when request yields unexpected object', function(done) {
      _households.expects('_get').withArgs('/Households/New').yields(null, {
        foo: ''
      })

      households.new(function(err, result, headers) {
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
      _households.expects('_get').withArgs('/Households/New').yields(null, {
        household: {
          householdName: 'Joe'
        }
      })

      households.new(function(err, household) {
        household.should.eql({
          householdName: 'Joe'
        })
        verifyAll()
        done()
      })
    })
  })

  describe('create', function() {
    it('should yield error when call to new fails', function(done) {
      _households.expects('new').yields('error')

      households.create({}, function(err, result) {
        err.should.eql('error')
        verifyAll()
        done()
      })
    })

    it('should yield error when call to _post fails', function(done) {
      _households.expects('new').yields(null, {
        householdName: '',
        householdSortName: ''
      })
      _households.expects('_post').yields('error')

      households.create({}, function(err, result) {
        err.should.eql('error')
        verifyAll()
        done()
      })
    })

    it('posts merged body to /Households', function(done) {
      var household = {
        householdName: 'Jack and Jill Grimm'
      }
      var mergedHousehold = {
        householdName: household.householdName,
        householdSortName: ''
      }

      _households.expects('new').yields(null, {
        householdName: '',
        householdSortName: ''
      })
      _households.expects('_post').withArgs('/Households', mergedHousehold).yields(null, '')

      households.create(household, function(err, result) {
        should(err).not.exist
        result.should.eql('')
        verifyAll()
        done()
      })
    })
  })
})