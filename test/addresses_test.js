'use strict';

var sinon = require('sinon')
var should = require('should')
var request = require('request')
var F1 = require('../lib/f1')
var Addresses = require('../lib/addresses')
var F1Resource = require('../lib/f1resource')

describe('Addresses', function() {
  var addresses, f1, r, config, _addresses

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
    addresses = new Addresses(f1)
    _addresses = sinon.mock(addresses)
  })

  function verifyAll() {
    r.verify()
    _addresses.verify()
  }

  afterEach(function() {
    r.restore()
    _addresses.restore()
  })

  it('inherits from F1Resource', function() {
    addresses.should.be.an.instanceof(F1Resource)
  })

  describe('create', function() {
    it('errors when call to new errors', function(done) {
      _addresses.expects('new').yields('error')

      addresses.create({}, function(err, result) {
        err.should.eql('error')
        verifyAll()
        done()
      })
    })

    it('should yield error when call to _post fails', function(done) {
      _addresses.expects('new').yields(null, {
        firstName: '',
        lastName: ''
      })
      _addresses.expects('_post').yields('error')

      addresses.create({}, function(err, result) {
        err.should.eql('error')
        verifyAll()
        done()
      })
    })

    it('posts merged body to /Addresses', function(done) {
      var item = {
        foo: 'Jack'
      }
      var mergedDatum = {
        address: {
          foo: item.foo,
          lastName: ''
        }
      }

      _addresses.expects('new').yields(null, {
        foo: '',
        lastName: ''
      })
      _addresses.expects('_post').withArgs('/Addresses', mergedDatum).yields(null, '')

      addresses.create(item, function(err, result) {
        should(err).not.exist
        result.should.eql('')
        verifyAll()
        done()
      })
    })
  })
})
