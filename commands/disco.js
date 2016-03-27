var play = require("play");
var mqtt = require("mqtt");

// Connecting to MQTT broker
var mqttBroker = mqtt.connect("mqtt:test.mosquitto.org");
var brokeOutput = "flow-bb8-input";

module.exports = function (bb8) {
	mqttBroker.publish(brokeOutput, "Disco | Let's Party !!");
    console.log('Let\'s Party!!');

    bb8.randomColor();
    bb8.intervals.push(setInterval(function () {
        bb8.randomColor();
    }, 1000));
    console.log(__dirname);
    play.sound("./sounds/slashgear_bb8_owoweeewow.m4a");
};
