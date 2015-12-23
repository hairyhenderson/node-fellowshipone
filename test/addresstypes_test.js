var F1 = require('../lib/f1')
var AddressTypes = require('../lib/addresstypes')
var F1Resource = require('../lib/f1resource')

describe('AddressTypes', function () {
  var addresstypes, f1, config

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
    addresstypes = new AddressTypes(f1)
  })

  it('inherits from F1Resource', function () {
    addresstypes.should.be.an.instanceof(F1Resource)
  })
})
