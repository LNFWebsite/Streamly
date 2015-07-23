var enterSearchMsg = "Search...";
var enterUrlMsg = "Paste URL Here...";
var enterTimeMsg = "Type length of video... (ex. 2:49 or 2 49)";

var pauseImgSrc = "//cdn.rawgit.com/iconic/open-iconic/master/png/media-pause-4x.png";
var playImgSrc = "//cdn.rawgit.com/iconic/open-iconic/master/png/media-play-4x.png";

var search;
var url;
var time;

var videos = [];
var videoCounter = 0;
var videoIteration;
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
function highlight(i) {
  $("tr:nth-child(" + i + ")").attr("id", "newSelected");
  $("tr.selected").removeClass("selected");
  $("#newSelected").addClass("selected");
  $("#newSelected").removeAttr("id");
}

function msConversion(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

function playVideo() {
  highlight(videoIteration);
  var embedUrl = videos[videoIteration]["url"].replace("/watch?v=", "/embed/") + "?autoplay=1";
  $("#youtube").attr("src", embedUrl);
  $("#pauseImg").attr("src", pauseImgSrc);
}

function loopVideo() {
  playVideo();
  timer = new Timer(function() {
    videoIteration++;
    playVideo();
    if (videoIteration < videoCounter) {
      loopVideo();
    }
    else {
      timer = 0;
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

function input() {
  switch ($("#inputBox").attr("placeholder")) {
    case enterSearchMsg:
      search = $("#inputBox").val();
      var queryUrl = "https://www.youtube.com/results?search_query=" + search.replace(/ /g, "+");
      window.open(queryUrl);
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
      videos[videoCounter] = [];
      videos[videoCounter]["name"] = search;
      videos[videoCounter]["time"] = time;
      videos[videoCounter]["url"] = url;

      var printTime = msConversion(videos[videoCounter]["time"]);

      $("#videosTable").append("<tr><td>" + videos[videoCounter]["name"] + "</td><td>" + printTime + "</td></tr>");

      if (videoCounter == 1) {
        videoIteration = 1;
        loopVideo();
      }
      else if (timer == 0) {
        loopVideo();
      }

      $("#inputBox").val("").attr("placeholder", enterSearchMsg);
      break;
  }
}
