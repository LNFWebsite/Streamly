//! License: MIT Adapted (as stated in the LICENSE file)

var placeholder = "Search, drag and drop video, or paste its URL...";

var popup;

var videoUrl;
var videoName;
var videoTime = null;

var videos = [];
var videoCounter = 0;
var videoIteration = 0;
var bufferTime = 2000;
var waitEndTime = 1500;

var videoPaused;
var backRestart;

var loopTimer;
var progressTimer;

function Timer(callback, delay) {
  var id, started, remaining = delay, running;
  this.resume = function() {
    running = true;
    started = new Date();
    id = window.setTimeout(callback, remaining);
  }
  this.pause = function() {
    running = false;
    window.clearTimeout(id);
    remaining -= new Date() - started;
  }
  this.getTimeLeft = function() {
    if (running) {
      this.pause();
      this.resume();
    }
    return remaining;
  }
  this.getStateRunning = function() {
    return running;
  }
  this.resume();
}

Array.prototype.move = function(from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
};

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

function addVideoToList(name, time) {
  name = decodeURIComponent(name);
  $("#videosTable").append("<tr><td>" + name + "<button class=\"tableButton removeButton\" onclick=\"actionRemoveVideo(this);\"><span class=\"fa fa-times\"></span></button>" +
  "<button class=\"tableButton playButton\" onclick=\"actionPlayVideo(this);\"><span class=\"fa fa-play\"></span></button></td><td>" + time + "</td></tr>");
}

function resetTimer(which) {
  if (which != 0) {
      which.pause();
    }
    which = 0;
}

var ActionTimers = function() {
  this.pause = function() {
    loopTimer.pause();
    progressTimer.pause();
  }
  this.resume = function() {
    loopTimer.resume();
    progressTimer.resume();
  }
  this.clear = function() {
    resetTimer(loopTimer);
    resetTimer(progressTimer);
    $("#progress").css("width", "0%");
    $("#currentTime").text("0:00");
    $("#videoTime").text("0:00");
  }
}
var actionTimers = new ActionTimers();

function videoProgress() {
  var time = videos[videoIteration][1] * 1000;
  $("#videoTime").text(msConversion(time));
  function progressLoop() {
    var currentTime = (time + waitEndTime) - loopTimer.getTimeLeft();
    var currentPercent = (currentTime / time) * 100;
    progressTimer = new Timer(function() {
      if (currentTime > 0) {
        $("#progress").css("width", currentPercent + "%");
        $("#currentTime").text(msConversion(currentTime));
      }
      if (currentTime < time) {
        progressLoop();
      }
    }, 500);
  }
  progressLoop();
}

function playVideo() {
  highlight(videoIteration);
  document.title = "Streamly - " + decodeURIComponent(videos[videoIteration][0]);
  var embedUrl = videos[videoIteration][2];
  
  var autoplay = "";
  if (!videoPaused) {
    autoplay = "?autoplay=1";
  }
  
  embedUrl = "https://www.youtube.com/embed/" + videos[videoIteration][2] + autoplay;
  $("#youtube").attr("src", embedUrl);
  
  backRestart = false;
  window.setTimeout(function() {
    backRestart = true;
  }, 3000);
}

function loopVideo() {
  videoIteration++;
  playVideo();
  loopTimer = new Timer(function() {
    if (videoIteration < videoCounter) {
      actionTimers.clear();
      loopVideo();
    }
    else {
      actionTimers.clear();
      $("#youtube").attr("src", "");
      if (videos[0] !== undefined && videos[0] !== null) {
        document.title = "Streamly - " + decodeURIComponent(videos[0]);
      }
      else {
        document.title = "Streamly";
      }
    }
  }, (videos[videoIteration][1] * 1000) + bufferTime + waitEndTime);
  
  videoProgress();
  
  if (videoPaused) {
    actionTimers.pause();
  }
}

function pauseVideo() {
  if (!videoPaused) {
    actionTimers.pause();
    videoPaused = true;
    if (videos[0] !== undefined && videos[0] !== null) {
      document.title = "Streamly - " + decodeURIComponent(videos[0]);
    }
  }
  else {
    actionTimers.resume();
    videoPaused = false;
    document.title = "Streamly - " + decodeURIComponent(videos[videoIteration][0]);
  }
  $("#pauseOverlay").css("display", "none");
  setTimeout(function(){
    $("#pauseOverlay").css("display", "block");
    $("#youtube").blur();
  }, 500);
}

function forwardVideo() {
  if (videoIteration + 1 <= videoCounter) {
    actionTimers.clear();
    loopVideo();
  }
}

function backVideo() {
  if (!backRestart) {
    if (videoIteration - 2 > -1) {
      videoIteration = videoIteration - 2;
      actionTimers.clear();
      loopVideo();
    }
  }
  else {
    videoIteration = videoIteration - 1;
    actionTimers.clear();
    loopVideo();
  }
}

function setPlaylist() {
  if (videos.length > 1) {
    var playlist = JSON.stringify(videos);
    playlist = window.btoa(playlist);
    window.location.hash = playlist;
  }
  else {
    window.location.hash = "";
  }
  $("#shareButton").attr("data-clipboard-text", "https://lnfwebsite.github.io/Streamly/#" + playlist);
}

function getPlaylist() {
  if (window.location.hash.substr(1) !== "") {
    var playlist = window.location.hash.substr(1);
    //leave the following decode for compatibility 10/10/2015
    playlist = decodeURIComponent(playlist);
    playlist = window.atob(playlist);
    playlist = JSON.parse(playlist);
    videos = playlist;
    
    if (videos[0] !== undefined && videos[0] !== null) {
      $("#playlistNameBox").val(decodeURIComponent(videos[0]));
    }
    
    for (i = 1; i < videos.length; i++) {
      videoCounter = i;
      var printTime = msConversion(videos[videoCounter][1] * 1000);
      addVideoToList(videos[videoCounter][0], printTime);
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
        videoName = $("<div/>").html(videoName).text();
        videoName = videoName.trim();
      } catch(err) {
        videoName = prompt("Please enter the name of the video", "");
      }
      videoName = encodeURIComponent(videoName).replace(/%20/g, " ");
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
    },
    complete: function(jqXHR, textStatus) {
      $("#inputBox").val("").attr("placeholder", placeholder);
      addVideo();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      videoName = prompt("Please enter the name of the video", "");
      
      videoTime = prompt("Please enter the length of the video", "3:00");
      videoTime = videoTime.split(":");
      videoTime = (+videoTime[0]) * 60 + (+videoTime[1]);
      videoTime = videoTime * 1000;
    }
  });
}

function addVideo() {
  videoCounter++;
  var video = [];
  video[0] = videoName;
  video[1] = videoTime / 1000;
  video[2] = videoUrl.replace(/^htt(p|ps):\/\/www\.youtube\.com\/watch\?v=/i, "");
  videos[videoCounter] = video;
  
  var printTime = msConversion(videoTime);
  
  addVideoToList(videoName, printTime);
  
  setPlaylist();
  makeSortable();
  
  if (videoCounter == 1 || (loopTimer.getStateRunning() === false && !videoPaused)) {
    loopVideo();
  }
}

function actionPlayVideo(element) {
  var index = $(".playButton").index(element);
  videoIteration = index;
  videoPaused = false;
  actionTimers.clear();
  loopVideo();
}

function actionRemoveVideo(element) {
  var index = $(".removeButton").index(element) + 1;
  if (index == videoIteration) {
    if (videoIteration + 1 <= videoCounter) {
      forwardVideo();
      videoIteration--;
    }
    else {
      actionTimers.clear();
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
  makeSortable();
}

function actionMoveVideo(oldIndex, newIndex) {
  videos.move(oldIndex, newIndex);
  if (oldIndex == videoIteration) {
    videoIteration = newIndex;
  }
  else if (oldIndex < videoIteration && newIndex >= videoIteration) {
    videoIteration--;
  }
  else if (oldIndex > videoIteration && newIndex <= videoIteration) {
    videoIteration++;
  }
}

function makeSortable() {
  $("#videosTable").sortable("destroy");
  var oldIndex;
  $("#videosTable").sortable({
    containerSelector: "table",
    itemPath: "> tbody",
    itemSelector: "tr",
    placeholder: "<tr class=\"placeholder\"/>",
    delay: 100,
    onDragStart: function ($item, container, _super) {
      oldIndex = $item.index();
    },
    onDrop: function ($item, container, _super) {
      actionMoveVideo(oldIndex + 1, $item.index() + 1);
      setPlaylist();
    }
  });
}

function urlValidate(url) {
  var regex = /^(http(|s):\/\/www\.youtube\.com\/watch\?v=|http(|s):\/\/youtu.be\/)[^&.*]+/i;
  
  url = url.trim();
  url = url.match(regex);
  
  if (url !== null) {
    url = url[0].replace(/http:\/\//i, "https://").replace(/https:\/\/youtu.be\//i, "https://www.youtube.com/watch?v=");
    return url;
  }
  else {
    return false;
  }
}

function input(type) {
  var inputBox = $("#inputBox").val();
  var playlistNameBox = $("#playlistNameBox").val();
  switch (type) {
    case 0:
      if (inputBox != "") {
        popup = window.open("https://www.youtube.com/results?search_query=" + inputBox.replace(/ /g, "+"), "YouTube", "height=500,width=800,chrome");
        $("#inputBox").val("").attr("placeholder", placeholder);
      }
      break;
    case 1:
      if (inputBox != "") {
        inputBox = urlValidate(inputBox);
        if (inputBox) {
          videoUrl = inputBox;
          $("#inputBox").val("").attr("placeholder", "Loading video data from YouTube...");
          popup.close();
          getVideoData();
        }
        else {
          alert("That video's URL seems broken\n\nTry copying it again, or drag and drop the video directly");
        }
      }
      break;
    case 2:
      if (playlistNameBox != "") {
        videos[0] = encodeURIComponent(playlistNameBox).replace(/%20/g, " ");
      }
      else {
        videos[0] = undefined;
      }
      setPlaylist();
      break;
  }
}

document.addEventListener("drop", function(event) {
  event.preventDefault();
  var data = event.dataTransfer.getData("URL");
  
  $("#inputBox").val(data);
  input(1);
});

document.addEventListener("dragover", function(event) {
  event.preventDefault();
});
