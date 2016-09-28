// YOUR CODE HERE:
var chatters;
var rooms = [];
var tabs = {};
var room = 'lobby';
var friends = {};
var prevMessage = '';
var myName = window.location.search.slice(10);

var refresh = function() {

  chatters = {};
  $('.loading').css({
    opacity: 1
  });
  $.ajax({
    url: 'https://api.parse.com/1/classes/messages',
    type: 'GET',  
    data: {
      order: '-createdAt',
      // where: '{"roomname":""}'
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
  writeChats();
  createRooms();

  $('p').toggle(false);
  $('.' + room.split(' ').join('')).toggle(true);
};

var writeChats = function() {
  chatters.results.forEach(message => {
    //takes care of spam and edge cases
    if (message.text === undefined || message.text === prevMessage || message.text.trim().length === 0) { return; }
    if (message.roomname === undefined || message.roomname === null) { message.roomname = 'lobby'; }
    prevMessage = message.text;

    var $line = nodifyMessage(message);
    if (message.text.match(myName)) {
      $line.toggleClass('friend');
    }
    if (message.roomname && rooms.indexOf(message.roomname) === -1) {
      rooms.push(message.roomname);
    }

    if (friends[message.username]) {
      $line.toggleClass('friends');
    }

    $('#chats').append($line);
  });
};

var writing = function(event) {
  if (event.keyCode !== 13 || txt === '') {
    return; 
  }

  var txt = $('.message').val();
  $('.message').val('');

  var message = {};
  message.roomname = room;
  message.text = txt;
  message.username = myName;

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

$(document).ready(() => {
  refresh();
  setInterval(refresh, 10000);
  $('.tab').on('click', tabfunction);
  $('.addTab').on('click', addTabFunction);
  $('.removeTab').on('click', removeTabFunction);
  $('#chats').on('click', '.name', addFriendHandler);
  $('.dropdown-content').on('click', '.selector', addRoomHandler);
  $('.message').keyup(writing);
  $('.createroom').on('click', writing);
});

$(document).ajaxComplete( () => { 
  erase(); 
  printLines(); 
  $('.loading').css({
    opacity: 0	
  });
});