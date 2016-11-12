// YOUR CODE HERE:
var app = {

  init: function() {
    friends = [];
    userName = '';
    text = '';
    roomName = '';
    uniqRooms = [];

    messages = [];
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

    $('#roomSelect').on('change', function(event) {
      var room = $('#roomSelect :selected').val();
      app.filterRoom(room);
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
      data: 'order=-createdAt',
      success: function (data) {
        data.results.sort(function(a, b) {
          return a.createdAt > b.createdAt ? -1 : 1;
        });
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
    $message = $('<span class="tweet">: ' + text + ' </span> </br>');
    $roomName = $('<option> ' + roomName + ' </option>');

    if (!_.contains(uniqRooms, roomName)) {
      uniqRooms.push(roomName);
      $('#roomSelect').append($roomName);
      var $divRoom = $('<div class=' + roomName + '> </div>');
      $chats.append($divRoom);
    }

    $userName.append($message);

    var truthy = false;
    _.each($chats.children('.' + roomName).children(), function(tweet) {
      if (($userName.className === $(tweet).className) && 
        ($(tweet).children().text() === $userName.children().text())) {
        truthy = true;
      }  
    });

    if (!truthy) {
      $chats.children('.' + roomName).prepend($userName);
    }

    

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
    var message = {
      username: window.location.search.split('=')[1],
      text: submitValNode.val(),
      roomname: $('#roomSelect :selected').text().trim()
    };
    app.send(message);
  },

  filterRoom: function(room) {
    var $allChats = $('#chats');
    console.log('filtering with', room);
    _.each($allChats.children(), function(divs) {
      if ($(divs).hasClass(room)) {
        console.log('WORKING');
        $(divs).show();
      } else {
        $(divs).hide();
      }
    });
  }
    // _.each($chatNodes, (chat) => {
    //   if (chat.className !== room.text()) {
    //     $('.').toggle();
    //   }
    // });
};

