jQuery(function($){
	// Initialise a websocket connection to the server
	var socket = io();

	// Get the form on the page
	var $messageForm = $('#submit-message'); // The form the user submits
	var $messageBox = $('#message'); // The field containing the user's message
	var $chat = $('#chat'); // The list which contians received messages

	// Bind event function to form submission
	$messageForm.submit(function(e){
		// Stop the page from refreshing
		e.preventDefault();
		// Send the message to the server, it decides what to do with the data it receives
		socket.emit('message', $messageBox.val());
		// Clear the message box
		$messageBox.val('');
	});

	// Handle messages sent (or sent back) from the server
	socket.on('new-message', function(data){
		$chat.append('<li>' + data + '</li>');
	});
});
