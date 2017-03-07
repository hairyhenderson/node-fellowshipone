var should = require('should')
var F1 = require('../lib/f1')
var Statuses = require('../lib/statuses')
var F1Resource = require('../lib/f1resource')

describe('Statuses', function () {
  var statuses, f1, config

  beforeEach(function () {
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
  })

  it('inherits from F1Resource', function () {
    should(statuses instanceof F1Resource).be.true()
  })
})
