'use strict';

var sinon = require('sinon')
var should = require('should')
var request = require('request')
var F1 = require('../lib/f1')
var Communications = require('../lib/communications')
var F1Resource = require('../lib/f1resource')

describe('Communications', function() {
  var communications, f1, config

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
    communications = new Communications(f1)
  })

  it('inherits from F1Resource', function() {
    communications.should.be.an.instanceof(F1Resource)
  })
})
