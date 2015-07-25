enterSearchMsg = "Search...";
enterUrlMsg = "Paste URL Here...";
enterTimeMsg = "Type length of video... (ex. 2:49 or 2 49)";

pauseImgSrc = "//cdn.rawgit.com/iconic/open-iconic/master/png/media-pause-4x.png";
playImgSrc = "//cdn.rawgit.com/iconic/open-iconic/master/png/media-play-4x.png";

var search;
var url;
var time;

var videos = {};
var videoCounter = 0;
var videoIteration = 0;
var videoPaused;
var timer;

function Timer(callback, delay) {
  var timerId, start, remaining = delay;

  this.pause = function() {
      window.clearTimeout(timerId);
      remaining -= new Date() - start;
  };

  this.resume = function() {
      start = new Date();
      window.clearTimeout(timerId);
      timerId = window.setTimeout(callback, remaining);
  };
  
  this.resume();
}

function msConversion(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

function highlight(i) {
  $("tr:nth-child(" + i + ")").attr("id", "newSelected");
  $("tr.selected").removeClass("selected");
  $("#newSelected").addClass("selected");
  $("#newSelected").removeAttr("id");
}

function ucWords(str) {
  str = str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
    return letter.toUpperCase();
  });
  return str;
}

function playVideo() {
  highlight(videoIteration);
  document.title = "Streamly - " + ucWords(videos[videoIteration]["name"]);
  
  var embedUrl = videos[videoIteration]["url"].replace("/watch?v=", "/embed/") + "?autoplay=1";
  $("#youtube").attr("src", embedUrl);
  $("#pauseImg").attr("src", pauseImgSrc);
}

function loopVideo() {
  videoIteration++;
  playVideo();
  timer = new Timer(function() {
    if (videoIteration < videoCounter) {
      loopVideo();
    }
    else {
      timer.pause();
      timer = 0;
      $("#youtube").attr("src", "");
      document.title = "Streamly";
    }
  }, videos[videoIteration]["time"] + 2000);
}

function pauseVideo() {
  if (!videoPaused) {
    timer.pause();
    $("#pauseImg").attr("src", playImgSrc);
    videoPaused = true;
  }
  else {
    timer.resume();
    $("#pauseImg").attr("src", pauseImgSrc);
    videoPaused = false;
  }
}

function backVideo() {
  if (videoIteration - 2 > -1) {
    videoIteration = videoIteration - 2;
    if (timer != 0) {
      timer.pause();
    }
    timer = 0;
    loopVideo();
  }
}

function forwardVideo() {
  if (videoIteration + 1 <= videoCounter) {
    if (timer != 0) {
      timer.pause();
    }
    timer = 0;
    loopVideo();
  }
}

function Base64EncodeUrl(str){
  str = window.btoa(str);
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
}

function Base64DecodeUrl(str){
  str = (str + '===').slice(0, str.length + (str.length % 4));
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  return window.atob(str);
}

function setPlaylist() {
  var playlist = JSON.stringify(videos);
  playlist = Base64EncodeUrl(playlist);
  window.location.hash = playlist;
}

function getPlaylist() {
  if (window.location.hash.substr(1) !== "") {
    var playlist = window.location.hash.substr(1);
    playlist = Base64DecodeUrl(playlist);
    playlist = JSON.parse(playlist);
    videos = playlist;
    
    for (var key in videos) {
      videoCounter++;
      var printTime = msConversion(videos[videoCounter]["time"]);
      $("#videosTable").append("<tr><td>" + ucWords(videos[videoCounter]["name"]) + "</td><td>" + printTime + "</td></tr>");
    }
    loopVideo();
  }
}

function input() {
  switch ($("#inputBox").attr("placeholder")) {
    case enterSearchMsg:
      search = $("#inputBox").val();
      if (search.indexOf(";") === -1) {
        var queryUrl = "https://www.youtube.com/results?search_query=" + search.replace(/ /g, "+");
        window.open(queryUrl);
      }
      else {
        search = search.replace(/\;/g, "");
      }
      $("#inputBox").val("").attr("placeholder", enterUrlMsg);
      break;
    case enterUrlMsg:
      url = $("#inputBox").val();
      $("#inputBox").val("").attr("placeholder", enterTimeMsg);
      break;
    case enterTimeMsg:
      time = $("#inputBox").val();
      time = time.replace(/ /g, ":");
      time = time.split(":");
      time = (+time[0]) * 60 + (+time[1]);
      time = time * 1000;

      videoCounter++;
      videos[videoCounter] = {};
      videos[videoCounter]["name"] = search;
      videos[videoCounter]["time"] = time;
      videos[videoCounter]["url"] = url;

      var printName = ucWords(videos[videoCounter]["name"]);
      var printTime = msConversion(videos[videoCounter]["time"]);

      $("#videosTable").append("<tr><td>" + printName + "</td><td>" + printTime + "</td></tr>");
      
      setPlaylist();

      if (videoCounter == 1 || timer == 0) {
        loopVideo();
      }

      $("#inputBox").val("").attr("placeholder", enterSearchMsg);
      break;
  }
}
