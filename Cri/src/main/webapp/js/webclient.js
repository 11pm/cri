/* 
 @author: 11pm
 @role: Handle all interaction with server side stuff
 @Todo: everything
 */

var wsUri = "ws://" + document.location.host + document.location.pathname + "server";

var websocket = new WebSocket(wsUri);
var wsMessage;

websocket.onerror = function(response){
    console.log(response);
};

websocket.onopen = function(response){
	console.log(response)
};




var webClient = {
	send: function (message, callback) {
		console.log('sending to server...')
    	this.waitForConnection(function () {
        	websocket.send(JSON.stringify(message));
	        if (typeof callback !== 'undefined') {
		        websocket.onmessage = function(response){
		        	callback(response);
				};
	        }
	    }, 1000);
	},

	waitForConnection: function (callback, interval) {
	    if (websocket.readyState === 1) {
	        callback();
	    } else {
	        var that = this;
	        setTimeout(function () {
	            that.waitForConnection(callback);
	        }, interval);
	    }
	}
};