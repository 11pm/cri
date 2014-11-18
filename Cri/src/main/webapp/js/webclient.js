/* 
 @author: 11pm
 @role: Handle all interaction with server side stuff
 @Todo: everything
 */

var wsUri = "ws://" + document.location.host + document.location.pathname + "server";

var websocket = new WebSocket(wsUri);
var data;
var jsontest = {message: 'Hello'}
websocket.onerror = function(response){
    console.log(response);
};

websocket.onopen = function(response){
	console.log(response)
};

websocket.onmessage = function(response){
	var data = JSON.parse(response.data);
	$('.user').text(data.message);

};


var webClient = {
	send: function (message, callback) {
    	this.waitForConnection(function () {
        	websocket.send(JSON.stringify(message));
	        if (typeof callback !== 'undefined') {
	          callback();
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