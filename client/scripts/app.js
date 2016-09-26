// YOUR CODE HERE:
var chatters;
var refresh = function() {
	$.ajax({
	  url: 'https://api.parse.com/1/classes/messages?where={"username":"Jace"}',
	  type: 'GET',	  
	  // where: JSON.stringify({
	  // 	username: 'Jace'
	  // }),
	  success: function (data) {
	    chatters = data;
	  },
	  error: function (data) { console.error('could not retrieve messages', data);}
	});	
	setTimeout(printLines, 1000)
}

var printLines = function() {
	// console.log(chatters.results[0].text);
	chatters.results.forEach(message => {
		var text = `${message.username}: ${message.text}`;
		printLine(text);
	})
	
}

var printLine = function(string) {
	var $line = $('<p></p>');
	$line.text(string);
	$('#chats').append($line);
}

var writing = function() {
	var txt = $('.message').val();
	$('.message').val('');

	var message = {};
	message.roomname = 'lobby';
	message.text = txt;
	message.username = window.location.search.slice(10);
	console.log(message);
	// message.createdAt = new Date();
	// message.objectId = String(Math.floor(Math.random() * 10000000));
	// message.updatedAt = new Date();

	$.ajax({
	  url: 'https://api.parse.com/1/classes/messages',
	  type: 'POST',
	  data: JSON.stringify(message),
	  contentType: 'application/json',
	  success: function (data) {
	    console.log('chatterbox: Message sent');
	  },
	  error: function (data) {
	    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
	    console.error('chatterbox: Failed to send message', data);
	  }
	});

}