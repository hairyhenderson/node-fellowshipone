require('should')
var F1 = require('../lib/f1')
var PersonCommunications = require('../lib/person_communications')
var Communications = require('../lib/communications')

describe('PersonCommunications', function () {
  var personComms, f1, config

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
    personComms = new PersonCommunications(f1, '123')
  })

  it('inherits from Communications', function () {
    personComms.should.be.an.instanceof(Communications)
  })

  it('must be given a person ID', function () {
    (function () {
      PersonCommunications(f1)
    }).should.throw(/requires a person ID/)
  })

  it('has a path beginning with /Person/{id}', function () {
    personComms.path.should.startWith('/People/123')
  })
})
