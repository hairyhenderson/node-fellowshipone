'use strict';
var should = require('should')
var F1 = require('../lib/f1')
var PersonCommunications = require('../lib/person_communications')
var F1Resource = require('../lib/f1resource')

describe('PersonCommunications', function() {
  var person_comms, f1, config;

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
    person_comms = new PersonCommunications(f1, 123)
  })

  it('inherits from F1Resource', function() {
    person_comms.should.be.an.instanceof(F1Resource)
  })

  it('must be given a person ID', function() {
    (function() {
      new PersonCommunications(f1)
    }).should.throw(/requires a person ID/)
  })

  it('has a path beginning with /Person/{id}', function() {
    person_comms.path.should.startWith('/People/123')
  })
})
