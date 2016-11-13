// YOUR CODE HERE:
var app = {
  escape: function(s) {
    return String(s).replace(/[&<>'"]/g, function(c) {
      return escapeObj[c];
    });
  },

  init: function() {
    escapeObj = {
      '&': '&amp',
      '<': '&lt',
      '>': '&gt',
      '/"': '&quot',
      "/'": '&#x27',
      '//': '&#x2F'
    };

    friends = {};
    userName = '';
    text = '';
    roomName = '';
    uniqRooms = {};

    $chats = $('#chats');
    $room = $('#roomSelect');    // getting id and setting it
    $main = $('#main');
    $userName = $('<span> </span>');
    $usernameStorage = $('<div class="userStorage"> </div>');
    $main.append($usernameStorage);

    $('#send').on('submit', function(event) {
      app.handleSubmit($('#message'));
      $('#message').val('');
      event.preventDefault();
    });

    $('#roomSelect').on('change', function(event) {
      var room = $('#roomSelect :selected').val();
      app.filterRoom(room);
    });

    $('#roomSend').on('submit', function(event) {
      app.renderRoom($('#roomCreate').val());
      $('#roomCreate').val('');

      event.preventDefault();
    });
  },

  send: function(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {

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
      contentType: 'json',
      // data: 'order=-createdAt & limit=1000',
      data: {order: '-createdAt',
             limit: 200},
      success: function (data) {
        data.results.sort(function(a, b) {
          return a.createdAt > b.createdAt ? -1 : 1;
        });
        _.each(data.results, (message) => {
          app.renderMessage(message);
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
    text = app.escape(message.text);
    roomName = message.roomname;

    $userName = $('<span class="username"></span>');
    $userName.text(userName + ': ');
    $message = $('<span class="tweet">: </span>');
    $message.text(text);
    $roomName = $('<option> </option>');
    $roomName.text(roomName);
    $messageDiv = $('<div class="messages"> </div>');

    $messageDiv.append($userName);
    $userName.append($message);

    if (!_.contains(uniqRooms, roomName)) {
      uniqRooms[roomName] = roomName;
      $('#roomSelect').append($roomName);
      var $divRoom = $('<div class="' + roomName + ' divRoom"' + '> </div>');
      $divRoom.fadeIn();
      $chats.append($divRoom);

    }

// $chats.children('.' + roomName).children().children()
    var truthy = false;
    _.each($(document.getElementsByClassName(roomName)).children().children(), function(tweet) {
      if (($userName.className === $(tweet).className) && 
        ($(tweet).children().text() === $userName.children().text())) {
        truthy = true;
      }  
    });

    if (!truthy) {
      $messageDiv.fadeIn();
      $(document.getElementsByClassName(roomName)).prepend($messageDiv);
    }

    

    var thisUser = userName;
    $userName.on('click', function() {
      app.handleUsernameClick(thisUser);

    });

  },

  renderRoom: function(roomName) {
    console.log(roomName);
    if (!_.contains(uniqRooms, roomName)) {
      uniqRooms[roomName] = roomName;
      var $newRoom = $('<option> ' + roomName + '</option>');
      $room.append($newRoom);
    }
  },

  handleUsernameClick: function(user) {
    var truthy = false;
    var $friendsHTML = $('#friends');

    if ($('#friends').children().length === 0) {
      var $newFriend = $('<li>' + user + '</br></li>');
      $friendsHTML.append($newFriend);
      truthy = true;
      $userName.addClass('friend');
      friends[user] = user;
    } else {
      if (_.contains(friends, user)) {
        truthy = true;
      }
      friends[user] = user;

      _.each($chats.children().children().children(), function(userSpan) {
        var text = $(userSpan.firstChild).text().replace(' ', '');
        if (_.contains(friends, text)) {
          $(userSpan).addClass('friend');
        }
      });
    }

    if (!truthy) {
      $friendsHTML.append('<li>' + user + '</li>');
    }
  },

  handleSubmit: function(submitValNode) {
    var message = {
      username: window.location.search.split('=')[1],
      text: submitValNode.val(),
      roomname: $('#roomSelect :selected').text()
    };
    app.send(message);
  },

  filterRoom: function(room) {
    _.each($chats.children(), function(divs) {
      if ($(divs).hasClass(room) || $(divs).hasClass('messageTitle')) {
        $(divs).fadeIn();
      } else {
        $(divs).fadeOut();
      }
    });
  }

};

