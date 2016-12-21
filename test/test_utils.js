const should = require('should')

class TestUtils {
  constructor (verifyAll) {
    this.verifyAll = verifyAll
  }

  verifyError (error, callback) {
    return (err, result) => {
      err.should.eql(error)
      this.verifyAll()
      callback()
    }
  }

  verifyResult (result, callback) {
    return (err, res) => {
      should.not.exist(err)
      res.should.eql(result)
      this.verifyAll()
      callback()
    }
  }
}

module.exports = TestUtils
