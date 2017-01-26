// Server setup (serving files)
var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

serv.listen(2000, console.log('Server ready'));

// List of all connections to the server
var SOCKET_LIST = {};

// Socket comms (client <--> server)
var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket) {
	// Assign an id to the connection and add to the list
	socket.id = Math.random();
	SOCKET_LIST[socket.id] = socket;
	// Run whenever a client connects
	console.log('Socket connection: ' + socket.id);

	// Listen for messages
	socket.on('happy', function() {
		console.log("Bold always happy");
	});
	
	// Disconnect
	socket.on('disconnect', function() {
		delete SOCKET_LIST[socket.id];
	});
});