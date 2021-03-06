var bb8 = require('../libs/bb8-instance')(),
    config = require('../libs/bb8-instance').config,
    expressInstance = require('../libs/express'),
    executeCustomCommand = require('../libs/execute-command'),
    _ = require('lodash');

var callbackFactory = function(res){
    return function(err, data){
        if(!err) {
            res.send({data: data});
        } else {
            res.send({error: err});
        }
    };
};

var spheroCommandExecuter = function(bb8, requestBody, res) {

    if(_.isString(requestBody.value)) {

        bb8[requestBody.command](requestBody.value, callbackFactory(res));

    } else if(_.isArray(requestBody.value)) {

        requestBody.value.push(callbackFactory(res));

        bb8[requestBody.command].apply(this, requestBody.value);

    } else {

        bb8[requestBody.command](callbackFactory(res));

    }

};

var customCommandExecuter = function(bb8, requestBody, res){

    if(_.isString(requestBody.value) || _.isObject(requestBody.value)) {

        executeCustomCommand.alreadyConnectedSingleValue(bb8, requestBody.command, requestBody.value);

    } else if(_.isArray(requestBody.value)) {

        executeCustomCommand.alreadyConnectedMultipleValues(bb8, requestBody.command, requestBody.value);

    } else {

        executeCustomCommand.alreadyConnectedSingleValue(bb8, requestBody.command, {});

    }

    res.send('Command Executed - ' + requestBody.command);

};

module.exports = function(bb8, options) {

    expressInstance(function (req, res) {

        var requestBody = req.body;

        if(requestBody.command && requestBody.mode === 'sphero') {

            spheroCommandExecuter(bb8, req.body, res);

        } else if(requestBody.command && requestBody.mode === 'custom') {

            customCommandExecuter(bb8, req.body, res);

        } else {

            res.send('Command is invalid');

        }

    }, options);
};
