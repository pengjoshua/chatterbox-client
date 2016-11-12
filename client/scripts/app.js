// YOUR CODE HERE:
var app = {

  init: function() {
    friends = [];
    userName = '';
    text = '';
    roomName = '';
    uniqRooms = [];

    $chats = $('#chats');
    $room = $('#roomSelect');    // getting id and setting it
    $main = $('#main');
    $userName = $('<span> </span>');
    $usernameStorage = $('<div class="userStorage"> </div>');
    $main.append($usernameStorage);

    $('#send').on('submit', function(event) {
      app.handleSubmit($('#message'));
      event.preventDefault();
    });
  },

  send: function(message) {
    console.log('message submitted from submit button', message);
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent', data);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  fetch: function() {
    $.ajax({
      url: 'https://api.parse.com/1/classes/messages',
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message fetched', data);
        _.each(data.results, (message) => {
          setTimeout(app.renderMessage(message), 1000);
        });
      },
      error: function (data) {
        console.error('chatterbox: Failed to fetch message', data);
      }
    });
  },

  clearMessages: function() {
    _.each($chats.children(), (child) => {
      child.remove();
    });
  },

  renderMessage: function(message) {
    userName = message.username;
    text = message.text;
    roomName = message.roomname;

    $userName = $('<span class="username"> ' + userName + '</span>');
    $message = $('<span id="tweet">: ' + text + ' </span> </br>');
    $roomName = $('<option id="room"> ' + roomName + ' </option>');

    $message.attr('class', roomName);

    if (!_.contains(uniqRooms, roomName)) {
      uniqRooms.push(roomName);
      $('#roomSelect').append($roomName);
    }

    $userName.append($message);
    $chats.append($userName);
    // $usernameStorage.append($userName);
    var thisUser = userName;
    $userName.on('click', function() {
      app.handleUsernameClick(thisUser);

    });
    
  },

  renderRoom: function(roomName) {
    $room.append($roomName);
  },

  handleUsernameClick: function(user) {
    friends.push(user);
  },

  handleSubmit: function(submitValNode) {
    console.log("IM RUNNING");
    var message = {
      username: window.location.search.split('=')[1],
      text: submitValNode.val(),
      roomname: $('#roomSelect :selected').text()
    };
    app.send(message);

  }
};

