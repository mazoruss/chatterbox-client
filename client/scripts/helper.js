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