var wsUri = "ws://" + document.location.host + document.location.pathname + "test";
var websocket = new WebSocket(wsUri);

websocket.onerror = function(evt) { onError(evt) };

function onError(evt) {
    document.write('<span style="color: red;">ERROR:</span> ' + evt.data);
}