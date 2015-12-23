var util = require('util')
var F1Resource = require('./f1resource')

function Households (f1) {
  F1Resource.call(this, f1, {
    resourceName: 'household'
  })
}

util.inherits(Households, F1Resource)

module.exports = Households
