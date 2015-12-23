require('should')
var F1 = require('../lib/f1')
var HouseholdCommunications = require('../lib/household_communications')
var Communications = require('../lib/communications')

describe('HouseholdCommunications', function () {
  var household_comms, f1, config

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
    household_comms = new HouseholdCommunications(f1, '123')
  })

  it('inherits from Communications', function () {
    household_comms.should.be.an.instanceof(Communications)
  })

  it('must be given a household ID', function () {
    (function () {
      HouseholdCommunications(f1)
    }).should.throw(/requires a household ID/)
  })

  it('has a path beginning with /Households/{id}', function () {
    household_comms.path.should.startWith('/Households/123')
  })
})
