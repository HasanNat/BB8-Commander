var play = require("play");
var mqtt = require("mqtt");

// Connecting to MQTT broker
var mqttBroker = mqtt.connect("mqtt:test.mosquitto.org");
var brokeOutput = "flow-bb8-input";


module.exports = function(bb8){
	
	if (bb8.intervals.length){
		bb8.intervals.forEach(function(value){
			console.log(value);
			clearTimeout(value);
		});

		bb8.intervals = [];
	}

	bb8.stop();
	mqttBroker.publish(brokeOutput, "I'm Stopping !!");
	play.sound("./sounds/slashgear_bb8_question.m4a");
};