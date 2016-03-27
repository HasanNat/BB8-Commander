var _ = require('lodash');
var play = require("play");
var mqtt = require("mqtt");

// Connecting to MQTT broker
var mqttBroker = mqtt.connect("mqtt:test.mosquitto.org");
var brokeOutput = "flow-bb8-input";


var moveHead = function(bb8) {
  bb8.roll(0, Math.floor(Math.random() * 180));
  console.log(Math.floor(Math.random() * 180))
};

module.exports = function (bb8) {
	mqttBroker.publish(brokeOutput, "Exploring Around :)");
    
    console.log('Place me in my charging station');

    bb8.color('#000000');
    moveHead(bb8);

    var partiallyAppliedMoveHead = _.partial(moveHead, bb8);

	play.sound("./sounds/slashgear_bb8_clickity.m4a");

    bb8.intervals.push(setInterval(partiallyAppliedMoveHead, 2000));
};



