var play = require("play");
var mqtt = require("mqtt");

// Connecting to MQTT broker
var mqttBroker = mqtt.connect("mqtt:test.mosquitto.org");
var brokeOutput = "flow-bb8-input";


module.exports = function (bb8) {
	mqttBroker.publish(brokeOutput, "Let's Roll!!");
    
    console.log('Let\'s Roll!!');

    setInterval(function () {
        
        var direction = Math.floor(Math.random() * 360);
        bb8.roll(150, direction);
        
    }, 1000);
};



