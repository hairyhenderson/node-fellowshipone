'use strict';
var should = require('should')
var F1 = require('../lib/f1')
var CommunicationTypes = require('../lib/communicationtypes')
var F1Resource = require('../lib/f1resource')

describe('CommunicationTypes', function() {
  var communicationtypes, f1, config;

  beforeEach(function() {
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
    communicationtypes = new CommunicationTypes(f1)
  })

  it('inherits from F1Resource', function() {
    communicationtypes.should.be.an.instanceof(F1Resource)
  })
})
