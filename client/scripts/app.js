// YOUR CODE HERE:
var chatters;
var rooms = [];
var room = 'lobby';
var friends = {};

var refresh = function() {
	//resets chatters and all chats on screen;
	chatters = {};

	//makes a get request and save the data into chatters object;
	$.ajax({
	  url: 'https://api.parse.com/1/classes/messages?order=-createdAt',
	  type: 'GET',	  
	  success: function (data) {
	    chatters = data;
	  },
	  error: function (data) { console.error('could not retrieve messages', data);}
	});	
	
	//print lines after 1 second to make sure all data arrived;
	setTimeout(() => {
		erase();
		printLines();
	}, 1000);
}

var erase = function() {
	rooms = [];
	$('p').remove();
}

var printLines = function() {

	chatters.results.forEach(message => {
		//takes care of edge cases
		if(message.text === undefined || message.text.trim().length === 0) { return; }
		if (message.roomname === undefined || message.roomname === null) { message.roomname = 'lobby';}

		var $username = $('<span class="name"></span>');
		$username.attr('username', message.username);
		$username.text(message.username);

		var $msg = $('<span></span>');
		$msg.text(": " + message.text);
		
		var $line = $('<p></p>');
		$line.append($username);
		$line.append($msg);
		$line.addClass(message.roomname.split(" ").join(''));

		if(message.roomname && rooms.indexOf(message.roomname) === -1) {
			rooms.push(message.roomname);
		}

		$('#chats').append($line);

		if (friends[message.username]) {
			$line.toggleClass('friends');
		}

		$username.on('click', function() {
			friends[message.username] ?
				friends[message.username] = false :
				friends[message.username] = true;
			erase();
			printLines();
		})
	})

	createRooms();
}

//creates the dropdown menu to change rooms
var createRooms = function() {
	//remove old selectors that may not exist anymore
	$('.selector').remove();

	rooms.forEach(roomname => {
		//make HTML element for the selector and append to dropdown
		var $selector = $('<a href="#"></a>')
		$selector.text(roomname);
		$selector.addClass(roomname.split(" ").join(""));
		$selector.addClass('selector');
		$('.dropdown-content').append($selector);

		//when clicked on, show only messages in that room, and set self to that room
		$selector.on('click', () => {
			$('p').toggle(false);
			$('.' + roomname.split(" ").join("")).toggle(true);
			room = roomname;
		});
	})

	//default is lobby, show all message 
	$('.allrooms').on('click', () => {
		$('p').toggle(true);
		room = 'lobby';
	});

	//if we're not in lobby, when we refresh, show only messages in that room
	if (room !== 'lobby') {
		$('p').toggle(false);
			$('.' + room.split(" ").join("")).toggle(true);
	}
}

//make new room with given room name
var makeroom = function() {
	var newRoom = prompt('Enter the name of the new room');
	rooms.push(newRoom);
	room = newRoom;
	refresh();
}

//send messages to the server
var writing = function() {
	var txt = $('.message').val();
	$('.message').val('');

	var message = {};
	message.roomname = room;
	message.text = txt;
	message.username = window.location.search.slice(10);

	$.ajax({
	  url: 'https://api.parse.com/1/classes/messages',
	  type: 'POST',
	  data: JSON.stringify(message),
	  contentType: 'application/json',
	  success: function (data) {
	    console.log('chatterbox: Message sent');
	  },
	  error: function (data) {
	    console.error('chatterbox: Failed to send message', data);
	  }
	});
}

//refreshes every 5 seconds
$(document).ready(() => {
	refresh();
	setInterval(refresh, 10000);
});