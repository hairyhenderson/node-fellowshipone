:warning: **Unmaintained!** I no longer have need for this module, so will no longer be actively maintaining this. If you want to take over the module, please file an issue!

---

[![Build Status][travis-image]][travis-url]
[![Code Coverage][coverage-image]][coverage-url]
[![Code Climate][climate-image]][climate-url]
[![Dependency Status][gemnasium-image]][gemnasium-url]
[![Current Version][npm-image]][npm-url]

[![Stories in Ready][waffle-ready-image]][waffle-url]
[![Stories In Progress][waffle-progress-image]][waffle-url]

[![JS Standard Code Style][js-standard-image]][js-standard-url]

# node-fellowshipone

A [Fellowship One](http://developer.fellowshipone.org) API wrapper for Node.js

**In very early stages.**

Allows you to:

- use a username/password to easily get OAuth tokens for dealing with Fellowship One (*i.e. 2nd-party credentials-based authentication*)
- interface with the F1 API in a slightly-simplified way

See [passport-fellowshipone](https://github.com/hairyhenderson/passport-fellowshipone) for 3rd-party OAuth authentication.

## Install

```
$ npm install fellowshipone
```

## Usage

### Getting a token

```javascript
var f1 = new F1({
  apiURL: 'http://mychurch.staging.fellowshiponeapi.com/v1',
  username: 'joe',
  password: 'joespassword',
  oauth_credentials: {
    consumer_key: '123',
    consumer_secret: '456789'
  }
})
f1.get_token(function (err, oauth_credentials, userURL) {
  request.get(userURL, { oauth: oauth_credentials, json: true }, function (err, res, body) {
    console.log('hi there, %s %s', body.firstName, body.lastName)
  })
})
```

### Getting a token - alternate method

```javascript
var config = {
  apiURL: 'http://mychurch.staging.fellowshiponeapi.com/v1',
  username: 'joe',
  password: 'joespassword',
  oauth_credentials: {
    consumer_key: '123',
    consumer_secret: '456789'
  }
}
var f1 = new F1(config)
// this method is useful for integrating with other APIs
f1.authenticate(function (err) {
  console.log('got tokens: %s/%s', config.oauth_credentials.token,
    config.oauth_credentials.token_secret)
  console.log('user URL is %s', config.userURL)
})
```

### Searching for Households

```javascript
var f1 = new F1(config)
f1.authenticate(function (err) {
  var households = new F1.Households(f1)
  households.search({
    searchFor: 'Joe Smith'
  }, function (err, found) {
    var count = found.results['@count']
    console.log('Found %d households', count)
    if (count > 0) {
      console.log('Households: %j', found.results.household)
    }
  })
})
```

## API Support

We're aiming to support all of the F1 API by v1.0.0. The (more-or-less) current support state is:

- [ ] [Accounts](http://developer.fellowshipone.com/docs/v1/Util/accounts.help)
- [People API Realm](http://developer.fellowshipone.com/docs/v1/util/docs.help)
  - [x] Households
    - [x] HouseholdMemberTypes
  - [x] People
    - [ ] People Attributes
    - [ ] People Images
  - [x] Addresses
    - [x] AddressTypes
  - [ ] Attributes
    - [ ] AttributeGroups
  - [x] Communications
    - [x] CommunicationTypes
  - [ ] Denominations
  - [ ] Occupations
  - [ ] Schools
  - [x] Statuses
    - [ ] SubStatuses
  - [ ] Requirements
  - [ ] Requirement Statuses
  - [ ] Background Check Statuses
  - [ ] People Requirements
  - [ ] Requirement Documents
- [Giving API Realm](http://developer.fellowshipone.com/docs/giving/v1/util/docs.help)
  - _not yet_
- [Groups API Realm](http://developer.fellowshipone.com/docs/groups/v1/util/docs.help)
  - _not yet_
- [Events API Realm](http://developer.fellowshipone.com/docs/events/v1/util/docs.help)
  - _not yet_

## Tests

```
$ npm install --dev
$ make test
```

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2014-2015 Dave Henderson

[travis-image]: https://img.shields.io/travis/hairyhenderson/node-fellowshipone.svg?style=flat
[travis-url]: https://travis-ci.org/hairyhenderson/node-fellowshipone

[coverage-image]: https://img.shields.io/codeclimate/coverage/github/hairyhenderson/node-fellowshipone.svg?style=flat
[coverage-url]: https://codeclimate.com/github/hairyhenderson/node-fellowshipone

[climate-image]: https://img.shields.io/codeclimate/github/hairyhenderson/node-fellowshipone.svg?style=flat
[climate-url]: https://codeclimate.com/github/hairyhenderson/node-fellowshipone

[gemnasium-image]: https://img.shields.io/gemnasium/hairyhenderson/node-fellowshipone.svg?style=flat
[gemnasium-url]: https://gemnasium.com/hairyhenderson/node-fellowshipone

[npm-image]: https://img.shields.io/npm/v/fellowshipone.svg?style=flat
[npm-url]: https://npmjs.org/package/fellowshipone

[js-standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[js-standard-url]: http://standardjs.com/

[waffle-ready-image]: https://badge.waffle.io/hairyhenderson/node-fellowshipone.svg?label=ready&title=Ready
[waffle-progress-image]: https://badge.waffle.io/hairyhenderson/node-fellowshipone.svg?label=in+progress&title=In+Progress
[waffle-url]: https://waffle.io/hairyhenderson/node-fellowshipone
