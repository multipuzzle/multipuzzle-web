// Initialise a websocket connection to the server
var socket = io();

// Send a message
socket.emit('happy', {
	reason:'because why not'
});