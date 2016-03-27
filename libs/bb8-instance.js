var sphero = require("sphero"),
    config = require('home-config').load('.bb8config');

module.exports = function() {
  
  if(typeof(config.BB8_UUID) !== 'undefined') {
  	var bb8 = sphero(config.BB8_UUID);
  	bb8.intervals = [];
    return bb8;
  }

  return false;
}

module.exports.config = config;