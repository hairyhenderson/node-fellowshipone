var sinon = require('sinon')
require('should')
var request = require('request')
var F1 = require('../lib/f1')
var Communications = require('../lib/communications')
var F1Resource = require('../lib/f1resource')
const TestUtils = require('./test_utils')

describe('Communications', function () {
  var communications, f1, r, config, _communications, t

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
    communications = new Communications(f1)
    _communications = sinon.mock(communications)
    t = new TestUtils(() => {
      r.verify()
      _communications.verify()
    })
  })

  afterEach(function () {
    r.restore()
    _communications.restore()
  })

  it('inherits from F1Resource', function () {
    communications.should.be.an.instanceof(F1Resource)
  })

  describe('create', function () {
    it('errors when call to new errors', function (done) {
      _communications.expects('new').yields('error')

      communications.create({}, t.verifyError('error', done))
    })

    it('should yield error when call to _post fails', function (done) {
      _communications.expects('new').yields(null, {
        firstName: '',
        lastName: ''
      })
      _communications.expects('_post').yields('error')

      communications.create({}, t.verifyError('error', done))
    })

    it('posts merged body to /Communications', function (done) {
      var item = {
        foo: 'Jack'
      }
      var mergedDatum = {
        communication: {
          foo: item.foo,
          lastName: ''
        }
      }

      _communications.expects('new').yields(null, {
        foo: '',
        lastName: ''
      })
      _communications.expects('_post').withArgs('/Communications', mergedDatum).yields(null, '')

      communications.create(item, t.verifyResult('', done))
    })

    it('strips communicationType.@generalType if supplied', function (done) {
      var item = {
        foo: 'Jack',
        communicationType: {
          '@id': '1',
          '@generalType': 'Telephone'
        }
      }
      var mergedDatum = {
        communication: {
          foo: item.foo,
          lastName: '',
          communicationType: {
            '@id': '1'
          }
        }
      }

      _communications.expects('new').yields(null, {
        foo: '',
        lastName: ''
      })
      _communications.expects('_post').withArgs('/Communications', mergedDatum).yields(null, '')

      communications.create(item, t.verifyResult('', done))
    })
  })
})
