// YOUR CODE HERE:
var chatters;
var rooms = [];
var room = 'lobby';
var friends = {};
var prevMessage = '';

var refresh = function() {
  //resets chatters and all chats on screen;
  chatters = {};

  //makes a get request and save the data into chatters object;
  $.ajax({
    url: 'https://api.parse.com/1/classes/messages',
    type: 'GET',  
    data: {
      order: '-createdAt',
      // where: '{"username":"Jace"}'
    },  
    success: function (data) {
      chatters = data;
    },
    error: function (data) { console.error('could not retrieve messages', data); }
  });		
};

var erase = function() {
  rooms = [];
  $('p').remove();
};

var printLines = function() {

  chatters.results.forEach(message => {
    //takes care of spam and edge cases
    if (message.text === undefined || message.text === prevMessage || message.text.trim().length === 0 /*|| (room !== message.roomname) && ( message.roomname !== undefined )*/) { return; }
    if (message.roomname === undefined || message.roomname === null) { message.roomname = 'lobby'; }
    prevMessage = message.text;
    
    var $line = nodifyMessage(message);

    if (message.roomname && rooms.indexOf(message.roomname) === -1) {
      rooms.push(message.roomname);
    }

    $('#chats').append($line);

    if (friends[message.username]) {
      $line.toggleClass('friends');
    }


  });
  createRooms();
};

//creates the dropdown menu to change rooms
var createRooms = function() {
  //remove old selectors that may not exist anymore
  $('.selector').remove();

  rooms.forEach(roomname => {
    //make HTML element for the selector and append to dropdown
    var $selector = $('<a href="#"></a>');
    $selector.text(roomname);
    $selector.addClass(roomname.split(' ').join(''));
    $selector.addClass('selector');
    $('.dropdown-content').append($selector);

    //when clicked on, show only messages in that room, and set self to that room
    $selector.on('click', () => {
      $('p').toggle(false);
      $('.' + roomname.split(' ').join('')).toggle(true);
      room = roomname;
      $('.activeTab').text(room);
    });
  });

  //default is lobby, show all message 
  $('.allrooms').on('click', () => {
    $('p').toggle(true);
    room = 'lobby';
  });

  //if we're not in lobby, when we refresh, show only messages in that room
  if (room !== 'lobby') {
    $('p').toggle(false);
    $('.' + room.split(' ').join('')).toggle(true);
  }
};

//make new room with given room name
var makeroom = function() {
  var newRoom = prompt('Enter the name of the new room');
  rooms.push(newRoom);
  room = newRoom;
  refresh();
};

//send messages to the server
var writing = function() {
  var txt = $('.message').val();
  $('.message').val('');

  if (txt === '') { return; }

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

  setTimeout(refresh, 800);
};

var tabfunction = function() {
  $('.activeTab').toggleClass('activeTab');
  $(this).toggleClass('activeTab');
  room = $(this).text();
  erase();
  printLines();
};

var addTabFunction = function() {
  if ($('.tab').length >= 3) { return; } 
  var $newSpan = $('<span class=\'tab\'></span>');
  $newSpan.text('lobby');
  $newSpan.appendTo('.tabs');
  $newSpan.on('click', tabfunction);
};

var removeTabFunction = function() {
  if ($('.tab').length <= 1) { return; } 
  $('.activeTab').remove();
  $('.tab').first().toggleClass('activeTab');
  room = $('.tab').first().text();

};

var addFriendHandler = function(event) {
  var name = $(event.target).attr('username');
  friends[name] ?
    friends[name] = false :
    friends[name] = true;
  erase();
  printLines();
};
//refreshes every 5 seconds
$(document).ready(() => {
  refresh();
  setInterval(refresh, 10000);
  $('.tab').on('click', tabfunction);
  $('.addTab').on('click', addTabFunction);
  $('.removeTab').on('click', removeTabFunction);
  $('.message').keyup(function(e) {
    if (e.keyCode === 13) {
      writing(); 
    }
  });
  $('#chats').on('click', '.name', addFriendHandler);
});

$(document).ajaxComplete( () => { erase(); printLines(); });