var sinon = require('sinon')
var should = require('should')
var request = require('request')
var F1 = require('../lib/f1')

describe('F1', function () {
  var r, f1, config

  beforeEach(function () {
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
  })

  function verifyAll () {
    r.verify()
  }

  afterEach(function () {
    r.restore()
  })

  describe('config object', function () {
    it('must have an apiURL', function (done) {
      should(function () {
        F1({
          oauth_credentials: {
            consumer_key: '123',
            consumer_secret: 'abcd1234'
          }
        })
      }).throw(/.*apiURL.*/)
      done()
    })
    it('must have a username', function (done) {
      should(function () {
        F1({
          apiURL: 'http://example.com',
          oauth_credentials: {
            consumer_key: '123',
            consumer_secret: 'abcd1234'
          },
          password: 'swordfish'
        })
      }).throw(/.*username.*/)
      done()
    })
    it('must have oauth_credentials', function (done) {
      should(function () {
        F1({
          apiURL: 'http://example.com',
          username: 'joe',
          password: 'swordfish'
        })
      }).throw(/.*oauth_credentials.*/)
      done()
    })
    describe('oauth_credentials', function () {
      it('must have a consumer_key', function (done) {
        should(function () {
          F1({
            apiURL: 'http://example.com',
            oauth_credentials: {
              consumer_secret: 'abcd1234'
            }
          })
        }).throw(/.*consumer_key.*/)
        done()
      })
      it('must have a consumer_secret', function (done) {
        should(function () {
          F1({
            apiURL: 'http://example.com',
            oauth_credentials: {
              consumer_key: '123'
            }
          })
        }).throw(/.*consumer_secret.*/)
        done()
      })
    })
  })
  describe('get_token', function () {
    it('yields error from request', function (done) {
      r.expects('post').yields('ERROR')

      f1.get_token(function (err, creds, url) {
        err.should.eql('ERROR')
        verifyAll()
        done()
      })
    })

    it('yields error when non-OK response received', function (done) {
      r.expects('post').yields(null, {
        statusCode: 404
      }, 'not found')

      f1.get_token(function (err, creds, url) {
        err.should.have.property('statusCode', 404)
        verifyAll()
        done()
      })
    })

    it('yields updated credentials and user URL', function (done) {
      r.expects('post').withArgs('http://example.com/PortalUser/AccessToken', {
        oauth: config.oauth_credentials,
        form: {
          ec: f1._hash_creds('joe', 'swordfish')
        }
      }).yields(null, {
        statusCode: 200,
        headers: {
          'content-location': 'http://example.com/user/1234',
          oauth_token: '1234',
          oauth_token_secret: 'toksecret'
        }
      }, '')

      f1.get_token(function (err, creds, url) {
        should(err).not.exist
        creds.should.have.property('token', '1234')
        creds.should.have.property('token_secret', 'toksecret')
        url.should.eql('http://example.com/user/1234')
        verifyAll()
        done()
      })
    })

    it('adds token, secret, and URL to original config object', function (done) {
      r.expects('post').withArgs('http://example.com/PortalUser/AccessToken', {
        oauth: config.oauth_credentials,
        form: {
          ec: f1._hash_creds('joe', 'swordfish')
        }
      }).yields(null, {
        statusCode: 200,
        headers: {
          'content-location': 'http://example.com/user/1234',
          oauth_token: '1234',
          oauth_token_secret: 'toksecret'
        }
      }, '')

      f1.get_token(function (err, creds, url) {
        should(err).not.exist
        config.oauth_credentials.should.have.property('token', '1234')
        config.oauth_credentials.should.have.property('token_secret', 'toksecret')
        config.userURL.should.eql('http://example.com/user/1234')
        verifyAll()
        done()
      })
    })
  })

  describe('authenticate', function () {
    var f
    beforeEach(function () {
      f = sinon.mock(f1)
    })
    afterEach(function () {
      f.restore()
    })
    it('delegates to get_token', function (done) {
      f.expects('get_token').yields('err', 'creds', 'uri')

      f1.authenticate(function (err) {
        arguments.length.should.eql(1)
        err.should.eql('err')
        f.verify()
        done()
      })
    })
  })
})
