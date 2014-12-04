/* 
 @author: 11pm
 @role: Handle all interaction with server side stuff
 */

var wsUri = "ws://" + document.location.host + document.location.pathname + "server";

var websocket = new WebSocket(wsUri);

websocket.onerror = function(response){
    
};

websocket.onopen = function(response){
	
};

var webClient = {

	//sends requests to the server and check if the server is ready
	send: function (message, callback) {
		
		//check every 1 second if websocket is ready for use
    	this.waitForConnection(function () {
        	
        	//send "fake" JSON string to server to do stuff with
        	websocket.send(JSON.stringify(message));
	        
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