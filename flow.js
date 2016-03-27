// Node Modules
var mqtt = require("mqtt");
var bb8 = require('./libs/bb8-instance')();
var _ = require('lodash');
var executeCustomCommand = require('./libs/execute-command');
var play = require("play");

// Connecting to MQTT broker
var mqttBroker = mqtt.connect("mqtt:test.mosquitto.org");
var brokerInput = "flow-bb8-output";
var brokeOutput = "flow-bb8-input";

var callbackFactory = function(){
    return function(err, data){
        if(!err) {
            console.log(data);
        } else {
            console.log("factory", err);
            initConnection();
        }
    };
};

var spheroCommandExecuter = function(bb8, payload, res) {

    if(_.isString(payload.value)) {
        if (payload.command === "color"){
            mqttBroker.publish(brokeOutput, "I'm turning " + payload.value + " !!");
        }

        bb8[payload.command](payload.value, callbackFactory());

    } else if(_.isArray(payload.value)) {

        payload.value.push(callbackFactory());

        if (payload.command === "roll"){
        	play.sound("./sounds/slashgear_bb8_ewewew.m4a");
            mqttBroker.publish("flow-bb8-input", "Let's Roll !!")
        }

        bb8[payload.command].apply(this, payload.value);

    } else {

        bb8[payload.command](callbackFactory());

    }

};

var customCommandExecuter = function(bb8, payload){
    if(_.isString(payload.value) || _.isObject(payload.value)) {
    	console.log("single")
        executeCustomCommand.alreadyConnectedSingleValue(bb8, payload.command, payload.value);

    } else if(_.isArray(payload.value)) {

        executeCustomCommand.alreadyConnectedMultipleValues(bb8, payload.command, payload.value);

    } else {

        executeCustomCommand.alreadyConnectedSingleValue(bb8, payload.command, {});

    }

    console.log('Command Executed - ' + payload.command);

};

var onMessageAction = function(topic, message){
	var payload = message.toString();
	
	payload = JSON.parse(payload);
	console.log(payload);		

    if(payload.command && payload.mode === 'sphero') {
        spheroCommandExecuter(bb8, payload);

    } else if(payload.command && payload.mode === 'custom') {
        customCommandExecuter(bb8, payload);

    } else {
        console.log('Command is invalid');
    }
};

var initSetup = function(){
	var setup = require('./commands/setup');
	var config = require('home-config').load('.bb8config');

	if (!config.BB8_UUID.length){
		setup();
	}
};

var initConnection = function(){
	if (bb8){
		console.log("Connecting ...")
		bb8.connect(function(){
			console.log("BB8 Connected");
			maintainConnection();
			mqttBroker.on("message", onMessageAction);
		});
	}	
};

var maintainConnection = function(){
	var initialColor = "white";
	bb8.color(initialColor, callbackFactory());
};

mqttBroker.on("connect", function(){
        this.subscribe(brokerInput);
        initSetup();
        initConnection();
});