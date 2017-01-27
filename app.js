// Require & server startup
var express = require('express');
var app = express();
var serv = require('http').Server(app);

// Keep track of users for unique nick validation
users = {};

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
	socket.on('new-user', function(data, callback){
		if (data in users) {
			// If it's already in the array, the new user can't have it
			callback(false);
		} else {
			// Otherwise they can
			callback(true);
			// Set arbitrary parameter "nickname" to the user's socket connection
 			socket.nickname = data;
 			// Add it to the users object
 			users[socket.nickname] = socket;
 			// Send the new array to all users
 			updateNicknames();
		}
	});

	// Send a list of all connected users' nicknames to all connected users
	function updateNicknames() {
		io.sockets.emit('usernames', Object.keys(users));
	}

	socket.on('message', function(data){
		var msg = data.trim();
		if (msg.substr(0, 3) === '/w ') { // Whisper (dm)
			console.log('Whisper!');
		} else { // Regular message
			// Messages of type 'new-message' are sent to all users
			io.sockets.emit('new-message', {msg: data, nick: socket.nickname});			
		}
		// Messaged of type 'new-message' are sent to all users except the user who submitted the message
		//socket.broadcast.emit('new-message', data);
	});
	
	// Run whenever a client disconnects
	socket.on('disconnect', function(data) {
		if (!socket.nickname) {
			console.log('Anonymous socket disconnected');
			return;
		} else {
			console.log('Socket of ' + socket.nickname + ' disconnected');
			delete users[socket.nickname];
			updateNicknames();
		}
	});
});