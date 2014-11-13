/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var wsUri = "ws://" + document.location.host + document.location.pathname + "test";
var webSocket = new WebSocket(wsUri);

webSocket.onerror = onError;
webSocket.onopen = function(evt){ onOpen(evt) };

var onError = function(evt){
    
    document.write(evt.data);
    
};

var onOpen = function(){
    
    document.write("Connected to " + wsUri);
}
