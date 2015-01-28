'use strict';
var sinon = require('sinon')
var should = require('should')
var request = require('request')
var F1 = require('../lib/f1')
var F1Resource = require('../lib/f1resource')

var MEDIA_TYPE = 'text/plain'

describe('F1Resource', function() {
  var r, f1resource, f1, config, _f1resource;

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
    f1resource = new F1Resource(f1, MEDIA_TYPE)
    _f1resource = sinon.mock(f1resource)
  })

  function verifyAll() {
    r.verify()
    _f1resource.verify()
  }

  afterEach(function() {
    r.restore()
    _f1resource.restore()
  })

  describe('_get', function() {
    it('errors when request errors', function(done) {
      r.expects('get').yields('error')

      f1resource._get('/', function(err, result) {
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

      f1resource._get('/', function(err, result) {
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
          accept: MEDIA_TYPE,
          'content-type': MEDIA_TYPE
        },
        json: true
      }).yields(null, {
        statusCode: 200,
        headers: {}
      }, 'body')

      f1resource._get('/mypath', function(err, body, headers) {
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
          accept: MEDIA_TYPE,
          'content-type': MEDIA_TYPE
        },
        json: true,
        qs: {
          query: 42
        }
      }).yields(null, {
        statusCode: 200,
        headers: {}
      }, 'body')

      f1resource._get('/mypath', {
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

      f1resource._post('/', {}, function(err, result) {
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

      f1resource._post('/', {}, function(err, result) {
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
          accept: MEDIA_TYPE,
          'content-type': MEDIA_TYPE
        },
        json: {}
      }).yields(null, {
        statusCode: 200,
        headers: {}
      }, 'body')

      f1resource._post('/mypath', {}, function(err, body, headers) {
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
          accept: MEDIA_TYPE,
          'content-type': MEDIA_TYPE
        },
        json: body,
        qs: query
      }).yields(null, {
        statusCode: 200,
        headers: {}
      }, 'body')

      f1resource._post('/mypath', query, body, function(err, body, headers) {
        body.should.eql('body')
        headers.should.eql({})
        verifyAll()
        done()
      })
    })
  })
})
