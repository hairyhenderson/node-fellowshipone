var util = require('util')
var F1Resource = require('./f1resource')

function Statuses (f1) {
  F1Resource.call(this, f1, {
    resourceName: 'status',
    resourceNamePlural: 'statuses',
    path: '/People/Statuses'
  })
}

util.inherits(Statuses, F1Resource)

module.exports = Statuses
