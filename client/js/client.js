// Load jQuery first. Always load jQuery first!
jQuery(function($){
	// Initialise a websocket connection to the server
	var socket = io();

	// Get the form elements for picking a nick
	var $nickForm = $('#submit-nickname'); // Input a nickname
	var $nickWrap = $('#nick-wrap'); // Hide on username success
	var $nickError = $('#nick-error'); // Show on duplicate username
	var $nickInput = $('#nickname'); // The field containing the nick

	// Get the form elements for sending messages
	var $messageForm = $('#submit-message'); // Input a message
	var $messageWrap = $('#message-wrap'); // Show on username success
	var $messageBox = $('#message'); // The field containing the user's message
	var $chat = $('#chat'); // The list which contians received messages

	// The list of users
	var $users = $('#users');

	// Bind event function to nick form submision
	$nickForm.submit(function(e){
		e.preventDefault();
		// Callback validates username as unique
		socket.emit('new-user', $nickInput.val(), function(data){
			if (data) { // == true
				// Hide the nick form and show the message form
				$nickWrap.hide();
				$messageWrap.show();
			} else {
				// Display an error message
				$nickError.show();
			}
		});
		$nickInput.val('');
	});

	// Bind event function to message form submission
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
		$chat.append('<li>' + '<b>' + data.nick + ': </b>' + data.msg + '</li>');
	});

	// Get the list of usernames
	socket.on('usernames', function(data){
		var html = '';
		for (i = 0; i < data.length; i++) {
			html += data[i] + '<br/>';
		}
		$users.html(html);
	});
});






