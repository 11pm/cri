/* 
 @author: 11pm
 @role: Handle all interaction with server side stuff
 @Todo: everything
 */

var wsUri = "ws://" + document.location.host + document.location.pathname + "server";

var websocket = new WebSocket(wsUri);

websocket.onerror = function(response){
    console.log(response);
};

websocket.onopen = function(response){
	console.log(response)
};

websocket.onmessage = function(response){
	console.log(response)
};


var webClient = {
	sendJson: function(json){
		console.log('sending: ' + JSON.stringify(json)); 
		websocket.send(json);
	},


};