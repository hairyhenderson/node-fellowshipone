'use strict';
var should = require('should')
var F1 = require('../lib/f1')
var Households = require('../lib/households')
var F1Resource = require('../lib/f1resource')

describe('Households', function() {
  var households, f1, config;

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
    households = new Households(f1)
  })

  it('inherits from F1Resource', function() {
    (households instanceof F1Resource).should.be.true
  })
})
