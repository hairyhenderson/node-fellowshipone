var util = require('util')
var F1Resource = require('./f1resource')

function HouseholdMemberTypes (f1) {
  F1Resource.call(this, f1, {
    resourceName: 'householdMemberType',
    path: '/People/HouseholdMemberTypes'
  })
}

util.inherits(HouseholdMemberTypes, F1Resource)

module.exports = HouseholdMemberTypes
