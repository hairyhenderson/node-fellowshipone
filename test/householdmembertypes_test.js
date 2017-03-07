var should = require('should')
var F1 = require('../lib/f1')
var HouseholdMemberTypes = require('../lib/householdmembertypes')
var F1Resource = require('../lib/f1resource')

describe('HouseholdMemberTypes', function () {
  var householdmembertypes, f1, config

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
    householdmembertypes = new HouseholdMemberTypes(f1)
  })

  it('inherits from F1Resource', function () {
    should(householdmembertypes instanceof F1Resource).be.true()
  })
})
