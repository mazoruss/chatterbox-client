var nodifyMessage = function(message) {
  var $username = $('<span class="name"></span>');
  $username.attr('username', message.username);
  $username.text(message.username);

  var $msg = $('<span></span>');
  $msg.text(': ' + message.text);
  
  var $line = $('<p></p>');
  $line.append($username);
  $line.append($msg);
  $line.addClass(message.roomname.split(' ').join(''));
  return $line;
};

var nodifyRoom = function(roomname) {
  var $selector = $('<a href="#"></a>');
  $selector.text(roomname);
  $selector.addClass(roomname.split(' ').join(''));
  $selector.addClass('selector');
  return $selector;
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

var addRoomHandler = function(event) {
  var roomname = $(event.target).text();
  room = roomname;
  $('.activeTab').text(roomname);
  erase();
  printLines();
};

var addFriendHandler = function(event) {
  var name = $(event.target).attr('username');
  friends[name] ?
    friends[name] = false :
    friends[name] = true;
  erase();
  printLines();
};  

var createRooms = function() {
  $('.selector').remove();
  rooms.forEach(roomname => {
    $selector = nodifyRoom(roomname);
    $('.dropdown-content').append($selector);
  });
};

var makeroom = function() {
  var newRoom = prompt('Enter the name of the new room');
  rooms.push(newRoom);
  room = newRoom;
  refresh();
};