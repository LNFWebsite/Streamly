enterUrlMsg = "Drag-and-drop the video or paste its URL here...";

removeImgSrc = "//cdn.rawgit.com/iconic/open-iconic/master/png/x-4x.png";
pauseImgSrc = "//cdn.rawgit.com/iconic/open-iconic/master/png/media-pause-4x.png";
playImgSrc = "//cdn.rawgit.com/iconic/open-iconic/master/png/media-play-4x.png";

var videoUrl;
var videoName;
var videoTime = null;

var videos = [];
var videoCounter = -1;
var videoIteration = -1;
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
  i++;
  $("tr:nth-child(" + i + ")").attr("id", "newSelected");
  $("tr.selected").removeClass("selected");
  $("#newSelected").addClass("selected");
  $("#newSelected").removeAttr("id");
}

function addVideoToList(name, time) {
  $("#videosTable").append("<tr><td>" + name + "<button class=\"tableButton\" onclick=\"removeVideo(this);\"><img src=\"" + removeImgSrc + "\" /></button></td><td>" + time + "</td></tr>");
}

function playVideo() {
  highlight(videoIteration);
  document.title = "Streamly - " + videos[videoIteration]["name"];
  
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
  if (videoIteration - 2 > -2) {
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

function setPlaylist() {
  if (videos.length > 1) {
    var playlist = JSON.stringify(videos);
    playlist = window.btoa(playlist);
    playlist = encodeURIComponent(playlist);
    window.location.hash = playlist;
  }
  else {
    window.location.hash = "";
  }
}

function getPlaylist() {
  if (window.location.hash.substr(1) !== "") {
    var playlist = window.location.hash.substr(1);
    playlist = decodeURIComponent(playlist);
    playlist = window.atob(playlist);
    playlist = JSON.parse(playlist);
    videos = playlist;
    
    for (i = 1; i < videos.length; i++) {
      videoCounter = i;
      var printTime = msConversion(videos[videoCounter]["time"]);
      addVideoToList(videos[videoCounter]["name"], printTime);
    }
    loopVideo();
  }
}

function getVideoData() {
  $.ajax({
    url: videoUrl,
    type: 'GET',
    success: function(res) {
      var data = $(res.responseText);
      try {
        videoName = data.find("span#eow-title");
        videoName = videoName[0].textContent;
        videoName = videoName.trim();
      } catch(err) {
        videoName = prompt("Please enter the name of the video", "");
      }
      try {
        videoTime = null;
        for (iteration in data) {
          var str = data[iteration].innerHTML;
          if (videoTime == null && typeof str != "undefined") {
            videoTime = str.match(/,"length_seconds":"\d+",/g);
          }
        }
        videoTime = videoTime[0];
        videoTime = videoTime.replace(/,"length_seconds":"/g, "").replace(/",/g, "");
        videoTime = +videoTime * 1000;
      } catch(err) {
        videoTime = prompt("Please enter the length of the video", "3:00");
        videoTime = videoTime.split(":");
        videoTime = (+videoTime[0]) * 60 + (+videoTime[1]);
        videoTime = videoTime * 1000;
      }
    }
  });
}

function addVideo() {
  videoCounter++;
  var video = {};
  video["name"] = videoName;
  video["time"] = videoTime;
  video["url"] = videoUrl;
  videos[videoCounter] = video;
  
  var printTime = msConversion(videos[videoCounter]["time"]);
  
  addVideoToList(videoName, printTime);
  
  setPlaylist();
  
  if (videoCounter == 1 || timer == 0) {
    loopVideo();
  }
}

function removeVideo(element) {
  var index = $(".tableButton").index(element) + 1;
  if (index == videoIteration) {
    if (videoIteration + 1 <= videoCounter) {
      forwardVideo();
      videoIteration--;
    }
    else {
      if (timer != 0) {
        timer.pause();
      }
      timer = 0;
      $("#youtube").attr("src", "");
      document.title = "Streamly";
      videoIteration--;
    }
  }
  else if (index < videoIteration) {
    videoIteration--;
  }
  videoCounter--;
  videos.splice(index, 1);
  $("tr:nth-child(" + index + ")").remove();
  setPlaylist();
}

function input() {
  switch ($("#inputBox").attr("placeholder")) {
    case enterUrlMsg:
      if ($("#inputBox").val() != "") {
        videoUrl = $("#inputBox").val();
        videoUrl = videoUrl.trim();
        $("#inputBox").val("").attr("placeholder", "Loading video data from YouTube...");
        getVideoData();
      }
      else {
        window.open("https://www.youtube.com");
      }
      break;
  }
}

$(document).ajaxStop(function() {
  $("#inputBox").val("").attr("placeholder", enterUrlMsg);
  addVideo();
});

function onDrop(event) {
  var data = event.dataTransfer.getData("URL");
  event.target.textContent = data;
  $("#inputBox").val(data);
  input();
  event.preventDefault();
}
