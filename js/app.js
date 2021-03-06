const url = 'https://bb862337bf8d.au.ngrok.io/';
var fbuser;
var player;
var game;
var loadingProgress = { loaded: 0, count: 0 };
var poops = 5;
window.onload = function() {
  window.fbAsyncInit = function() {
    FB.init({
      appId: '924692011446928',
      xfbml: true,
      version: 'v11.0'
    });
    // ADD ADDITIONAL FACEBOOK CODE HERE
    FB.login(function(response) {
      statusChangeCallback(response); // handle the response
    });
  };
  (function(d, s, id) {
    var js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = 'https://connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
  })(document, 'script', 'facebook-jssdk');
  renderPoops();
  initialise();
};
function testAPI() {
  FB.api('/me', { fields: ['id', 'name', 'picture.type(large)'] }, function(
    response
  ) {
    fbuser = response;
    getUser(fbuser);
  });
}
function statusChangeCallback(response) {
  // Called with the results from FB.getLoginStatus().
  console.log('statusChangeCallback');
  console.log(response); // The current login status of the person.
  if (response.status === 'connected') {
    // Logged into your webpage and Facebook.
    testAPI();
  } else {
    // Not logged into your webpage or we are unable to tell.
    document.getElementById('status').innerHTML =
      'Please log ' + 'into this webpage.';
  }
}
function renderPoops() {
  for (i = 0; i < poops; i++) {
    $('.poops').append(
      '<div class="x" style="animation-delay: ' +
        i / 5 +
        's;"><div class="poop " style="animation-delay: 0.' +
        (i % 2).toString() +
        's;"><div class="poop' +
        (i % 2).toString() +
        '">💩</div></div></div>'
    );
  }
}
function loadImages() {
  var images = ['./img/header.png'];
  loadingProgress.count = images.length;
  for (var i = 0; i < images.length; i++) {
    var assetName = images[i];
    var image = asyncImageLoader(assetName);
    image.then(res => {
      loadingProgress.loaded++;
      updateLoadingScreen();
    });
  }
}
function asyncImageLoader(url) {
  return new Promise((resolve, reject) => {
    var image = new Image();
    image.src = url;
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('could not load image'));
  });
}

function getUser(fbuser) {
  $.post(url + 'getUser', fbuser).done(function(data) {
    handleUser(data);
  });
}

function handleUser(resp) {
  player = resp;
  $('.games-played .value').html(player.gamesPlayed);
  $('.games-lost .value').html(player.gamesLost);
  $('#menu').addClass('active');
}
function sendRequest(endpoint, data, aFunction) {
  $.post(url + endpoint, data).done(function(resp) {
    aFunction(resp);
  });
}
function handleNewGame(resp) {
  $('section#newGame').addClass('active');
  game = resp.game;
  player = resp.player;
  game.players.forEach(player => {
    asyncImageLoader(player.imgurl);
    $('.players-list')
      .html('')
      .append(
        '<div class="player"><div style="background-image: url(' +
          player.imgurl +
          ');" class="player-img"></div><div class="player-name">' +
          player.name +
          '</div></div>'
      );
  });
}
function initialise() {
  $('section')
    .on('transitionstart', function() {})
    .on('transitionend', function() {});
  $('.btn-new-game').click(function() {
    $('section#menu')
      .removeClass('active')
      .addClass('return');
    sendRequest('newGame', { id: fbuser.id }, handleNewGame);
  });
  $('.btn-back').click(function() {
    $('section.active').removeClass('active');
    $('section.return').removeClass('return');
    $('section#menu').addClass('active');
  });
  $('.btn-how-to-play').click(function() {
    $('section#menu')
      .removeClass('active')
      .addClass('return');
    $('section#howToPlay').addClass('active');
  });
  $('.btn-rules').click(function() {
    $('.instructions.rules')
      .addClass('active')
      .removeClass('return');
    $('.btn-rules').addClass('active');
    $('.instructions.cards').removeClass('active');
    $('.btn-cards').removeClass('active');
  });
  $('.btn-cards').click(function() {
    $('.instructions.cards').addClass('active');
    $('.btn-cards').addClass('active');
    $('.instructions.rules')
      .removeClass('active')
      .addClass('return');
    $('.btn-rules').removeClass('active');
  });
}
