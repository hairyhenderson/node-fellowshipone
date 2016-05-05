var sinon = require('sinon')
var should = require('should')
var request = require('request')
var F1 = require('../lib/f1')
var F1Resource = require('../lib/f1resource')

var MEDIA_TYPE = 'text/plain'

describe('F1Resource', function () {
  var r, f1resource, f1, config, _f1resource

  beforeEach(function () {
    r = sinon.mock(request)
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
    f1resource = new F1Resource(f1, {
      mediaType: MEDIA_TYPE,
      resourceName: 'datum',
      resourceNamePlural: 'data',
      path: '/Data'
    })
    _f1resource = sinon.mock(f1resource)
  })

  function verifyAll () {
    r.verify()
    _f1resource.verify()
  }

  afterEach(function () {
    r.restore()
    _f1resource.restore()
  })

  describe('constructor', function () {
    var def
    beforeEach(function () {
      def = new F1Resource(f1, {
        resourceName: 'foo'
      })
    })
    it('defaults to empty options', function () {
      new F1Resource(f1).options.should.eql({})
    })
    it('mediaType defaults to application/json', function () {
      def.mediaType.should.eql('application/json')
    })
    it('resourceNamePlural makes a dumb guess', function () {
      def.resourceNamePlural.should.eql('foos')
    })
    it('path defaults to capitalized plural name', function () {
      def.path.should.eql('/Foos')
    })
    it('searchParams default to empty object', function () {
      def.searchParams.should.eql({})
    })
  })

  describe('_get', function () {
    it('errors when request errors', function (done) {
      r.expects('get').yields('error')

      f1resource._get('/', function (err, result) {
        err.should.eql('error')
        verifyAll()
        done()
      })
    })

    it('errors when request gives non-200 status', function (done) {
      r.expects('get').yields(null, {
        statusCode: 404,
        headers: {}
      }, 'foo')

      f1resource._get('/', function (err, result) {
        err.should.eql({
          statusCode: 404,
          headers: {},
          message: 'foo'
        })
        verifyAll()
        done()
      })
    })

    it('yields the body and headers when successful without query', function (done) {
      r.expects('get').withArgs({
        uri: 'http://example.com/mypath',
        oauth: {
          consumer_key: '123',
          consumer_secret: 'secret'
        },
        headers: {
          accept: MEDIA_TYPE,
          'content-type': MEDIA_TYPE
        },
        json: true
      }).yields(null, {
        statusCode: 200,
        headers: {}
      }, 'body')

      f1resource._get('/mypath', function (err, body, headers) {
        should(err).not.exist
        body.should.eql('body')
        headers.should.eql({})
        verifyAll()
        done()
      })
    })

    it('yields the body and headers when successful with query', function (done) {
      r.expects('get').withArgs({
        uri: 'http://example.com/mypath',
        oauth: {
          consumer_key: '123',
          consumer_secret: 'secret'
        },
        headers: {
          accept: MEDIA_TYPE,
          'content-type': MEDIA_TYPE
        },
        json: true,
        qs: {
          query: 42
        }
      }).yields(null, {
        statusCode: 200,
        headers: {}
      }, 'body')

      f1resource._get('/mypath', {
        query: 42
      }, function (err, body, headers) {
        should(err).not.exist
        body.should.eql('body')
        headers.should.eql({})
        verifyAll()
        done()
      })
    })
  })

  describe('_post', function () {
    it('errors when request errors', function (done) {
      r.expects('post').yields('error')

      f1resource._post('/', {}, function (err, result) {
        err.should.eql('error')
        verifyAll()
        done()
      })
    })

    it('errors when request gives non-200 status', function (done) {
      r.expects('post').yields(null, {
        statusCode: 404,
        headers: {}
      }, 'foo')

      f1resource._post('/', {}, function (err, result) {
        err.should.eql({
          statusCode: 404,
          headers: {},
          message: 'foo'
        })
        verifyAll()
        done()
      })
    })

    it('yields the body and headers when successful without query', function (done) {
      r.expects('post').withArgs({
        uri: 'http://example.com/mypath',
        oauth: {
          consumer_key: '123',
          consumer_secret: 'secret'
        },
        headers: {
          accept: MEDIA_TYPE,
          'content-type': MEDIA_TYPE
        },
        json: {}
      }).yields(null, {
        statusCode: 200,
        headers: {}
      }, 'body')

      f1resource._post('/mypath', {}, function (err, body, headers) {
        should(err).not.exist
        body.should.eql('body')
        headers.should.eql({})
        verifyAll()
        done()
      })
    })

    it('yields the body and headers when successful with query', function (done) {
      var query = {
        query: 42
      }
      var body = {
        foo: true
      }
      r.expects('post').withArgs({
        uri: 'http://example.com/mypath',
        oauth: {
          consumer_key: '123',
          consumer_secret: 'secret'
        },
        headers: {
          accept: MEDIA_TYPE,
          'content-type': MEDIA_TYPE
        },
        json: body,
        qs: query
      }).yields(null, {
        statusCode: 200,
        headers: {}
      }, 'body')

      f1resource._post('/mypath', query, body, function (err, body, headers) {
        should(err).not.exist
        body.should.eql('body')
        headers.should.eql({})
        verifyAll()
        done()
      })
    })
  })

  describe('list', function () {
    it('errors when request errors', function (done) {
      _f1resource.expects('_get').yields('error')

      f1resource.list(function (err, result) {
        err.should.eql('error')
        verifyAll()
        done()
      })
    })

    it('errors when request yields unexpected object', function (done) {
      _f1resource.expects('_get').yields(null, {
        foo: ''
      }, {})

      f1resource.list(function (err, results) {
        err.should.eql({
          statusCode: 502,
          headers: {},
          message: {
            foo: ''
          }
        })
        verifyAll()
        done()
      })
    })

    it('returns the list of resources', function (done) {
      _f1resource.expects('_get').withArgs('/Data').yields(null, {
        data: {
          datum: [{}, {}]
        }
      }, {})

      f1resource.list(function (err, result) {
        should(err).not.exist
        result.should.eql([{}, {}])
        verifyAll()
        done()
      })
    })
  })

  describe('show', function () {
    it('errors when request errors', function (done) {
      _f1resource.expects('_get').yields('error')

      f1resource.show(42, function (err, result) {
        err.should.eql('error')
        verifyAll()
        done()
      })
    })

    it('errors when request yields unexpected object', function (done) {
      _f1resource.expects('_get').withArgs('/Data/42').yields(null, {
        foo: ''
      })

      f1resource.show(42, function (err, result, headers) {
        err.should.eql({
          statusCode: 502,
          headers: headers,
          message: {
            foo: ''
          }
        })
        verifyAll()
        done()
      })
    })

    it('returns the object', function (done) {
      _f1resource.expects('_get').withArgs('/Data/42').yields(null, {
        datum: {
          foo: 'bar'
        }
      })

      f1resource.show(42, function (err, result) {
        should(err).not.exist
        result.should.eql({
          foo: 'bar'
        })
        verifyAll()
        done()
      })
    })
  })

  describe('show (with Promise)', function () {
    it('errors when request errors', function (done) {
      _f1resource.expects('_get').yields('error')

      f1resource.show(42).catch(function (err) {
        err.should.eql('error')
        verifyAll()
        done()
      })
    })

    it('errors when request yields unexpected object', function (done) {
      _f1resource.expects('_get').withArgs('/Data/42').yields(null, {
        foo: ''
      })

      f1resource.show(42).catch(function (err) {
        err.should.eql({
          statusCode: 502,
          headers: undefined,
          message: {
            foo: ''
          }
        })
        verifyAll()
        done()
      })
    })

    it('returns the object', function (done) {
      _f1resource.expects('_get').withArgs('/Data/42').yields(null, {
        datum: {
          foo: 'bar'
        }
      })

      f1resource.show(42).then(function (result) {
        result.should.eql({
          foo: 'bar'
        })
        verifyAll()
        done()
      })
    })
  })

  describe('new', function () {
    it('errors when request errors', function (done) {
      _f1resource.expects('_get').withArgs('/Data/New').yields('error')

      f1resource.new(function (err, result) {
        err.should.eql('error')

        verifyAll()
        done()
      })
    })

    it('errors when request yields unexpected object', function (done) {
      _f1resource.expects('_get').withArgs('/Data/New').yields(null, {
        foo: ''
      })

      f1resource.new(function (err, result, headers) {
        err.should.eql({
          statusCode: 502,
          headers: headers,
          message: {
            foo: ''
          }
        })
        verifyAll()
        done()
      })
    })

    it('returns the household template', function (done) {
      _f1resource.expects('_get').withArgs('/Data/New').yields(null, {
        datum: {
          firstName: 'Joe'
        }
      })

      f1resource.new(function (err, person) {
        should(err).not.exist
        person.should.eql({
          firstName: 'Joe'
        })
        verifyAll()
        done()
      })
    })
  })

  describe('new (with Promise)', function () {
    it('errors when request errors', function (done) {
      _f1resource.expects('_get').withArgs('/Data/New').yields('error')

      f1resource.new().catch(function (err) {
        err.should.eql('error')

        verifyAll()
        done()
      })
    })

    it('errors when request yields unexpected object', function (done) {
      _f1resource.expects('_get').withArgs('/Data/New').yields(null, {
        foo: ''
      })

      f1resource.new().catch(function (err) {
        err.should.eql({
          statusCode: 502,
          headers: undefined,
          message: {
            foo: ''
          }
        })
        verifyAll()
        done()
      })
    })

    it('returns the household template', function (done) {
      _f1resource.expects('_get').withArgs('/Data/New').yields(null, {
        datum: {
          firstName: 'Joe'
        }
      })

      f1resource.new().then(function (person) {
        person.should.eql({
          firstName: 'Joe'
        })
        verifyAll()
        done()
      })
    })
  })

  describe('create', function () {
    it('errors when call to new errors', function (done) {
      _f1resource.expects('new').yields('error')

      f1resource.create({}, function (err, result) {
        err.should.eql('error')
        verifyAll()
        done()
      })
    })

    it('should yield error when call to _post fails', function (done) {
      _f1resource.expects('new').yields(null, {
        firstName: '',
        lastName: ''
      })
      _f1resource.expects('_post').yields('error')

      f1resource.create({}, function (err, result) {
        should(err).not.exist
        err.should.eql('error')
        verifyAll()
        done()
      })
    })

    it('posts merged body to /Data', function (done) {
      var datum = {
        firstName: 'Jack'
      }
      var mergedDatum = {
        datum: {
          firstName: datum.firstName,
          lastName: ''
        }
      }

      _f1resource.expects('new').yields(null, {
        firstName: '',
        lastName: ''
      })
      _f1resource.expects('_post').withArgs('/Data', mergedDatum).yields(null, '')

      f1resource.create(datum, function (err, result) {
        should(err).not.exist
        result.should.eql('')
        verifyAll()
        done()
      })
    })
  })

  describe('create (with Promise)', function () {
    it('errors when call to new errors', function (done) {
      _f1resource.expects('new').yields('error')

      f1resource.create({}).catch(function (err) {
        err.should.eql('error')
        verifyAll()
        done()
      })
    })

    it('should yield error when call to _post fails', function (done) {
      _f1resource.expects('new').yields(null, {
        firstName: '',
        lastName: ''
      })
      _f1resource.expects('_post').yields('error')

      f1resource.create({}).then(function (result) {
        should(err).not.exist
        err.should.eql('error')
        verifyAll()
        done()
      })
    })

    it('posts merged body to /Data', function (done) {
      var datum = {
        firstName: 'Jack'
      }
      var mergedDatum = {
        datum: {
          firstName: datum.firstName,
          lastName: ''
        }
      }

      _f1resource.expects('new').yields(null, {
        firstName: '',
        lastName: ''
      })
      _f1resource.expects('_post').withArgs('/Data', mergedDatum).yields(null, '')

      f1resource.create(datum, function (err, result) {
        should(err).not.exist
        result.should.eql('')
        verifyAll()
        done()
      })
    })
  })


  describe('search', function () {
    it('errors when request errors', function (done) {
      _f1resource.expects('_get').yields('error')

      f1resource.search({}, function (err, result) {
        err.should.eql('error')
        verifyAll()
        done()
      })
    })

    it('returns the search results', function (done) {
      _f1resource.expects('_get').yields(null, {
        results: 100
      })

      f1resource.search({}, function (err, result) {
        should(err).not.exist
        result.should.eql({
          results: 100
        })
        verifyAll()
        done()
      })
    })

    it('uses given search parameters', function (done) {
      _f1resource.expects('_get').withArgs('/Data/Search', {
        searchFor: 'foo'
      }).yields(null, {
        results: 100
      })

      f1resource.search({
        searchFor: 'foo'
      }, function (err, result) {
        should(err).not.exist
        result.should.eql({
          results: 100
        })
        verifyAll()
        done()
      })
    })

    it('supports default search parameters', function (done) {
      _f1resource.expects('_get').withArgs('/Data/Search', {
        default: 'bar',
        searchFor: 'foo'
      }).yields(null, {
        results: 100
      })

      f1resource.searchParams = {
        default: 'bar'
      }

      f1resource.search({
        searchFor: 'foo'
      }, function (err, result) {
        should(err).not.exist
        result.should.eql({
          results: 100
        })
        verifyAll()
        done()
      })
    })
  })
})
