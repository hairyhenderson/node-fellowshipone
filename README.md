[![Stories in Ready](https://badge.waffle.io/hairyhenderson/node-fellowshipone.png?label=ready&title=Ready)](https://waffle.io/hairyhenderson/node-fellowshipone)
[![Build Status][travis-image]][travis-url]
[![Code Coverage][coverage-image]][coverage-url]
[![Code Climate][climate-image]][climate-url]
[![Dependency Status][gemnasium-image]][gemnasium-url]
[![Current Version][npm-image]][npm-url]

# node-fellowshipone

A [Fellowship One](http://developer.fellowshipone.org) API wrapper for Node.js

**In very early stages.**

Allows you to:

- use a username/password to easily get OAuth tokens for dealing with Fellowship One (*i.e. 2nd-party credentials-based authentication*)
- *other functionality coming later...*

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
f1.get_token(function(err, oauth_credentials, userURL) {
  request.get(userURL, { oauth: oauth_credentials, json: true }, function(err, res, body) {
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
f1.authenticate(function(err) {
  console.log('got tokens: %s/%s', config.oauth_credentials.token,
    config.oauth_credentials.token_secret)
  console.log('user URL is %s', config.userURL)
})
```

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
