// Require & server startup
var express = require('express');
var app = express();
var serv = require('http').Server(app);

// Serve the files to the client
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

// Listen for connections on port 2000, callback console.log() for verification
serv.listen(2000, console.log('Server ready'));

// Socket comms (client <--> server)
var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket) {
	// Run whenever a client connects
	console.log('Socket connected');

	// Listen for messages
	socket.on('message', function(data){
		// Messages of type 'new-message' are sent to all users
		io.sockets.emit('new-message', data);
		// Messaged of type 'new-message' are sent to all users except the user who submitted the message
		//socket.broadcast.emit('new-message', data);
	});
	
	// Run whenever a client disconnects
	socket.on('disconnect', function() {
		console.log('Socket disconnected');
	});
});