'use strict';
var message = require('lambda-cfn').message;
var util = require('util');

module.exports.config = {
    name: 'gfb',
    sourcePath: 'rules/gfb.js',
    gatewayRule: {
        method: 'POST',
        apiKey: false
    }
};

module.exports.fn = function (event, callback) {
    console.log('event ', event);
    if (event.zen != undefined) {
        var ping = 'GitHub ping event received';
        return callback(null, ping);
    } else {
        if (event.labels){
            event.labels.forEach(function(item,index) {
                if (item.name === 'good-starter-bug') {
                    var notification = {
                             subject: (util.format('`good-starter-bug`: In %s by %s', event.repository.name, event.issue.user.login)).substring(0,100),
                             summary: util.format('%s applied `good-starter-bug` label on %s', event.issue.user.login, event.issue.html_url),
                             event: event
                    };
                    message(notification, function(err,result) {
                      if(err) console.log('error ', err);
                      console.log('result ', result);
                      return callback(err,result);
                    });
                }
            });
        } else {
            var badmsg = 'Error: unknown payload received';
            console.log(badmsg);
            return callback(badmsg);
        }
    }
};
