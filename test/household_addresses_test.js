require('should')
var F1 = require('../lib/f1')
var HouseholdAddresses = require('../lib/household_addresses')
var Addresses = require('../lib/addresses')

describe('HouseholdAddresses', function () {
  var householdAddrs, f1, config

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
    householdAddrs = new HouseholdAddresses(f1, '123')
  })

  it('inherits from Addresses', function () {
    householdAddrs.should.be.an.instanceof(Addresses)
  })

  it('must be given a household ID', function () {
    (function () {
      HouseholdAddresses(f1)
    }).should.throw(/requires a household ID/)
  })

  it('has a path beginning with /Households/{id}', function () {
    householdAddrs.path.should.startWith('/Households/123')
  })
})
