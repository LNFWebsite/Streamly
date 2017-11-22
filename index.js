//! License: MIT (as stated in the LICENSE file)

// * These are global variables that are utilized in the rest of the script
// * They exist for data that must persist for the script to work

var placeholder = "Search, drag and drop video, or paste its URL...";
var loadingPlaceholder = "Loading video data from YouTube...";

var faviconPause = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAMAAAANmfvwAAAA/1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD64ociAAAAVHRSTlMAAQIDBAUGBwgJCgsPEBIUFxgbHh8iIyUrMDU/QEdKS09QUlZbXF5fYWZpb3F1e4aJmJ6go6WmqrK0tb7Aw8XHyM/R09XX2drg4unr7e/x8/X3+ftnm6MTAAABGklEQVQ4jYXTx1YCQRBG4TvCYKO2iglzxJwVA5gFs4LA//7P4mLIM9PeZfV3Tm26oC+vf9BTYu7wrib93hzMDkSCoaOG2tX2B0PA21FvjbU+YR4UquB3i5GPsJDK6Y4YjBTSU7JNbqOFdNkSG3FCWghEqhFPfhIA7EmSatYYY9JXUsYYY0wmMOsAXlWS9EbLN9cH5B1gRi6icWDbTVaACzc5AcpuUgQqblL6nzwDJTcpAOducgxsuskSMOUmY4D37SKvAAS/tj5hrbWjBSlrrbU2G5BlAPyaYvtsXstyPJlvbuU6Tpy2BP5LtLjvOsrh1yjxmKIrvxgW+QS9rdZ7QXWRUP5upQO+csmwALzprXy5Uimd5SYj3+P7A3jQxmKOfWTQAAAAAElFTkSuQmCC";
var faviconPlay = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAMAAAANmfvwAAABDlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABxUYW9AAAAWXRSTlMAAQIDBAUGCAkRFBUZGhscHiAhJyorLzI0ODo7PUZMTlBVVldYWVtcXV5hZHB1foKDiIuPlZiboKKlpqirr7CytcDDyMrMzs/R09Xa3N7g4ubp7e/x9/n7/Ud7aO4AAAE3SURBVBgZlcFpOxtRAIbhZ8YgltBaopZEHanamtKgtYaSklJ0xPL+/z8iGedMZq5MPrhv3mlgslzZ2aksT/aTbfpQsYMpun24UMr5OGneN3XZ9EjoO1KGA5+Yd6pMxx5OVT1sY31STwUifqg3jaF8TWn/fdo+y1oFCv+UUqLtXpahxSs/KeGOlrwcQ2TwhxJGgWU5Bit/ptgSsCfHEJu9l7ULXMkxdPgbL4r8AR7kGJLmFQmBphxD0pQiTeCvHEPC/IMiV8C+HENs7LesX8CaHIOVqyr2FZiQY4j4K8/q+Ah4TVmGtplbJYQeLRuyvgAjp0pZp63/SW/Ogtx3pT0GRErqqYh1oh6OcIKGMl0GxHKXylAfJCHYV5effaQthEoJ5+jiL94odl3yyTRc3KrV67Wt4jDv8wr7Zt73xzlZAQAAAABJRU5ErkJggg==";

var popup;
var popupClose = false;
var hotkeyPopupClose = false;

var videoId;

var videos = [];
var videoCounter = 0;
var videoIteration = 0;

var videoErrorIds = [];

var videosBeforeShuffle = [];
var addedVideosWhileShuffled = [];

var baseAutoplayVideoId;
var autoplayVideos = [];
var autoplayVideoIteration = -1;

var quickSearchQuery;
var quickSearchVideos = [];
var quickSearchVideosIteration = 0;

var stationServer;
var stationSocket;
var stationRemote = false;
var stationTxQuiet = false;
var stationUserId;

var zenMode = false;
var sideBySide = false;

var videoPaused;
//this var is for addVideo knowing whether to loop to next video or not
var videoPlaying;
var backRestart;
var backRestartTimer;

var progressTimer;

var playlistPlayNext;
var playlistRepeat;
var playlistShuffle;
var playlistAutoplay;

var dataPlayer;
var radioDataPlayer;
var searchDataPlayer;

// * This function is for user identification in Streamly Station

function makeId() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
  for (var i=0; i < 10; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  
  return text;
}

// * This function is for iteration order changes such as playlistRepeat

function changeIteration(which) {
  var sum = videoIteration + which;
  if (playlistRepeat && sum > videoCounter) {
    return 1;
  }
  else if (playlistRepeat && sum < 0) {
    return videoCounter - 1;
  }
  else {
    return videoIteration + which;
  }
}

// * This function provides a mainframe timer for use in videoProgress
// * It used to be used for video change timing in Streamly w/o YouTube API

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

// * This is an added function to arrays for moving elements from one spot to another
// * It is primarily used for shuffling

Array.prototype.move = function(from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
};

// * This function converts milliseconds to "0:00" format
// * It is used primarily in the videoProgress timer

function msConversion(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return (seconds == 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
}

// * This function highlights playlist elements

function highlight(i, which, persist) {
  $("tr:nth-child(" + i + ")").attr("id", "new-" + which);
  if (!persist) {
    $("tr." + which).removeClass(which);
  }
  $("#new-" + which).addClass(which);
  $("#new-" + which).removeAttr("id");
}

// * This function adds video elements to the playlist

function addVideoToList(name, time, spot, smooth) {
  name = decodeURIComponent(name);
  
  if (smooth) {
    smooth = " class=\"animated flipInX\"";
  }
  else {
    smooth = "";
  }
  
  var trElement = "<tr" + smooth + "><td>" + name + "<button class=\"tableButton removeButton\" onclick=\"buttonRemoveVideo(this);\" title=\"Remove\"><span class=\"fa fa-times\"></span></button>" +
  "<button class=\"tableButton playButton\" onclick=\"buttonPlayVideo(this);\" title=\"Play\"><span class=\"fa fa-play\"></span></button></td><td>" + time + "</td></tr>";
  if ($("#videosTable > tr").length > 0) {
    if (spot > 1) {
      $("#videosTable > tr").eq(spot-2).after(trElement);
    }
    else {
      $(trElement).insertBefore("#videosTable > tr:first");
    }
  }
  else {
    $("#videosTable").append(trElement);
  }
}

// * This function removes video elements from the playlist

function removeVideoFromList(index, smooth) {
  if (smooth === true) {
    $("tr:nth-child(" + index + ")").fadeOut(function() {
      $(this).remove();
    });
  }
  else {
    $("tr:nth-child(" + index + ")").remove();
  }
}

// * This function resets timers
// * It is primarily used for the progress bar and video time elements

function resetTimer(which) {
  if (typeof which !== "undefined") {
    if (which != 0) {
      which.pause();
    }
    which = 0;
  }
}

// * This object manipulates existing timers
// * It was primarily used in video timing before the YouTube API, but is also used in the progress bar

var ActionTimers = function() {
  this.pause = function() {
    progressTimer.pause();
  }
  this.resume = function() {
    progressTimer.resume();
  }
  this.clear = function() {
    resetTimer(progressTimer);
    $("#progress").css("width", "0%");
    $("#currentTime").text("0:00");
    $("#videoTime").text("0:00");
  }
}
var actionTimers = new ActionTimers();

// * This function updates the video progress bar with new data
// * It is run on an interval, using the YouTube API for video timing

function videoProgress() {
  if (videos[videoIteration] !== undefined && videos[videoIteration] !== null) {
    //initial load
    var time = videos[videoIteration][1];
    var currentTime = Math.round(player.getCurrentTime());
    var currentPercent = (currentTime / time) * 100;
    $("#videoTime").text(msConversion(time * 1000));
    $("#progress").css("width", currentPercent + "%");
    var currentTimeFormatted = msConversion(currentTime * 1000);
    if (currentTimeFormatted !== "NaN:NaN") {
      $("#currentTime").text(currentTimeFormatted);
    }
    //loop load
    function progressLoop() {
      currentTime = Math.round(player.getCurrentTime());
      currentPercent = (currentTime / time) * 100;
      progressTimer = new Timer(function() {
        $("#progress").css("width", currentPercent + "%");
        currentTimeFormatted = msConversion(currentTime * 1000);
        if (currentTimeFormatted !== "NaN:NaN") {
          $("#currentTime").text(currentTimeFormatted);
        }
        if (currentTime < time) {
          progressLoop();
        }
      }, 500);
    }
    progressLoop();
  }
}

// * This function loads videos from the playlist into the YouTube iFrame

function playVideo() {
  videoPlaying = true;
  highlight(videoIteration, "selected", false);
  videoPreviews();
  addAutoplayVideo();

  document.title = "Streamly - " + decodeURIComponent(videos[videoIteration][0]);
  
  if (!stationRemote) {
    $("#youtube").css("display", "block");
    
    if (!videoPaused) {
      player.loadVideoById(videos[videoIteration][2]);
    }
    else {
      player.cueVideoById(videos[videoIteration][2]);
    }
    console.log("Debug: playVideo");
  }
  backRestart = false;
  clearTimeout(backRestartTimer);
  backRestartTimer = window.setTimeout(function() {
    backRestart = true;
  }, 3000);
}

// * This function is run on video ending events, changing the current video to the next

function loopVideo() {
  if (videoIteration < videoCounter || playlistRepeat) {
    if (playlistShuffle && playlistRepeat && videoIteration === videoCounter) {
      shufflePlaylist();
    }
    videoIteration = changeIteration(1);
    playVideo();
  }
  else {
    videoPlaying = false;
    actionTimers.clear();
    $("#youtube").css("display", "none");
    if (videos[0] !== undefined && videos[0] !== null) {
      document.title = "Streamly - " + decodeURIComponent(videos[0]);
    }
    else {
      document.title = "Streamly";
    }
  }
}

// * This object does the extra stuff that occurs on pausing and playing videos
// * Such as pausing the progress bar loop

var VideoFunctions = function() {
  this.play = function() {
    setVideoTime();
    sendStation("videofunctionsplay");
    videoPaused = false;
    document.title = "Streamly - " + decodeURIComponent(videos[videoIteration][0]);
    $("#favicon").attr("href", faviconPlay);
  }
  this.pause = function() {
    sendStation("videofunctionspause");
    videoPaused = true;
    if (videos[0] !== undefined && videos[0] !== null) {
      document.title = "Streamly - " + decodeURIComponent(videos[0]);
    }
    $("#favicon").attr("href", faviconPause);
    actionTimers.pause();
  }
}
var videoFunctions = new VideoFunctions();

// * This function skips to the next video in the playlist

function forwardVideo() {
  sendStation("forwardvideo");
  if (changeIteration(1) <= videoCounter) {
    loopVideo();
  }
}

// * This function skips to the previous video in the playlist (or reloads the current video)

function backVideo() {
  sendStation("backvideo");
  if (!backRestart) {
    if (changeIteration(-2) > -1) {
      videoIteration = changeIteration(-2);
      loopVideo();
    }
  }
  else {
    videoIteration = changeIteration(-1);
    loopVideo();
  }
}

// * This function sets the playlist in the hash parameter of the URL

function setPlaylist() {
  if (videos.length > 1) {
    var playlist = JSON.stringify(videos);
    playlist = window.btoa(playlist);
    window.location.hash = playlist;
  }
  else {
    window.location.hash = "";
  }
  $("#saveButton").attr("data-clipboard-text", "https://lnfwebsite.github.io/Streamly/#" + playlist);
}

// * This function gets the playlist from the hash parameter of the URL
// * It loads videos into the videos array and the playlist viewer

function getPlaylist() {
  if (window.location.hash.substr(1) !== "") {
    var playlist = window.location.hash.substr(1);
    $("#saveButton").attr("data-clipboard-text", "https://lnfwebsite.github.io/Streamly/#" + playlist);
    try {
      playlist = window.atob(playlist);
      playlist = JSON.parse(playlist);
      videos = playlist;

      if (videos[0] !== undefined && videos[0] !== null) {
        $("#playlistNameBox").val(decodeURIComponent(videos[0]));
      }

      for (var i = 1; i < videos.length; i++) {
        videoCounter = i;
        var printTime = msConversion(videos[videoCounter][1] * 1000);
        addVideoToList(videos[videoCounter][0], printTime, videoCounter, true);
      }
      // -- Need to update the playlist with non-encoded stuff 10/04/2016
      setPlaylist();
      videoPaused = true;
      loopVideo();
    }
    catch(err) {
      alert("Uh oh... It looks like this playlist URL is broken, however, you may still be able to retrieve your data.\n\n" +
      "Make sure that you save the URL that you have now, and contact me (the administrator) by submitting an issue on Streamly's Github page.\n\n" +
      "I'm really sorry about this inconvenience.\n\nerr: " + err);
    }
  }
}

// * This function appends one playlist to another

function appendPlaylist(playlist) {
  try {
    playlist = window.atob(playlist);
    playlist = JSON.parse(playlist);

    if (playlist[0] !== undefined && playlist[0] !== null) {
      if (videos[0] === undefined || videos[0] === null) {
        $("#playlistNameBox").val(decodeURIComponent(playlist[0]));
        videos[0] = playlist[0];
      }
    }

    for (var i = 1; i < playlist.length; i++) {
      videoCounter++;
      var printTime = msConversion(playlist[i][1] * 1000);
      addVideoToList(playlist[i][0], printTime, videoCounter, true);
    }
    
    playlist.splice(0, 1);
    videos = videos.concat(playlist);

    setPlaylist();
  }
  catch(err) {
    alert("Uh oh... It looks like this playlist URL is broken, however, you may still be able to retrieve your data.\n\n" +
      "Make sure that you save the URL that you have now, and contact me (the administrator) by submitting an issue on Streamly's Github page.\n\n" +
      "I'm really sorry about this inconvenience.\n\nerr: " + err);
  }
}

// * This function loads the video name
// * Updated video data capture method because of deprecation of player.getVideoData() in API (11/15/2017)

function getVideoName(id, callback) {
  var url = "https://www.youtube.com/watch?v=" + id;
  var get = {
    url: url
  };
  
  $.ajax({
    dataType: "json",
    url: "https://noembed.com/embed",
    data: get,
    success: function(result) {
      callback(result.title);
    }
  });
}

// * This function utilizes function above to add videos with applicable data
// * It used to handle data gathering on it's own, but stands as a wrapper to the async ajax above

function getVideoData(id) {
  videoId = id;
  videoTime = 0;
  
  getVideoName(id, function(name) {
    videoName = name;
    videoName = encodeURIComponent(videoName).replace(/%20/g, " ");
    
    $("#inputBox").val("").attr("placeholder", placeholder);
    addVideo(videoName, videoTime, videoId);
  });
}

// * This function sets the video time on video play
// * It is handled this way since YouTube does not set player.getDuration() until play. Screw you YouTube.

function setVideoTime() {
  var name = videos[videoIteration][0];
  var time = player.getDuration();
  time = Math.round(time);
  var printTime = msConversion(time * 1000);
  
  videos[videoIteration][1] = time;
  removeVideoFromList(videoIteration, false);
  addVideoToList(name, printTime, videoIteration, false);
  restoreHighlight(videoIteration);
  setPlaylist();
}

// Start Quick Search

// * This function loads the video for the Quick Search functionality

function quickSearch(query) {
  $("#inputBox").val("").attr("placeholder", loadingPlaceholder);
  if (query !== "") {
    quickSearchQuery = query;
    var searchDataFrame = document.createElement("iframe");
    searchDataFrame.setAttribute("id", "searchDataFrame");
    searchDataFrame.setAttribute("src", "");
    document.getElementById("dataFramesContainer").appendChild(searchDataFrame);
    searchDataPlayer = new YT.Player('searchDataFrame', {
      events: {
        'onReady': onSearchDataPlayerReady,
        'onStateChange': onSearchDataPlayerStateChange
      }
    });
    searchDataFrame.setAttribute("src", "https://www.youtube.com/embed/?enablejsapi=1");
  }
  else if (quickSearchVideos[quickSearchVideosIteration] !== undefined &&
           quickSearchVideos[quickSearchVideosIteration] !== null &&
           quickSearchVideosIteration + 1 < quickSearchVideos.length) {
    quickSearchVideosIteration++;
    getVideoData(quickSearchVideos[quickSearchVideosIteration]);
  }
}

// * This function cues the search results for use in the next function

var searchDataPlayerErrors = 0;
function onSearchDataPlayerReady() {
  try {
    searchDataPlayer.cuePlaylist({listType: "search", list: quickSearchQuery});
  }
  catch(e) {
    searchDataPlayerErrors++;
    console.log(e);
    if (searchDataPlayerErrors <= 5) {
      try {
        searchDataPlayer.destroy();
      } catch(e) {};
      quickSearch(quickSearchQuery);
    }
  }
}

// * This function uses the search results to add the next video

function onSearchDataPlayerStateChange(event) {
  if (event.data === 5) {
    $("#inputBox").val("").attr("placeholder", placeholder).blur().focus();
    quickSearchVideosIteration = 0;
    quickSearchVideos = searchDataPlayer.getPlaylist();
    var data = searchDataPlayer.getVideoUrl();
    var id = urlValidate(data)[1];
    
    getVideoName(id, function(name) {
      videoName = name;
      videoName = encodeURIComponent(videoName).replace(/%20/g, " ");
      videoTime = 0;
      searchDataPlayer.destroy();
      addVideo(videoName, videoTime, id);
    });
  }
}

// End Quick Search

// Start Streamly Radio

// * This function loads the video for the Streamly Radio function

function loadAutoplayData(iteration) {
  autoplayVideos = [];
  autoplayVideoIteration = -1;
  
  highlight(iteration, "radio", false);
  baseAutoplayVideoId = videos[iteration][2];
  var dataFrame = document.createElement("iframe");
  dataFrame.setAttribute("id", "radioDataFrame");
  dataFrame.setAttribute("src", "");
  document.getElementById("dataFramesContainer").appendChild(dataFrame);
  radioDataPlayer = new YT.Player('radioDataFrame', {
    events: {
      'onReady': onRadioDataPlayerReady,
      'onStateChange': onRadioDataPlayerStateChange
    }
  });
  dataFrame.setAttribute("src", "https://www.youtube.com/embed/" + baseAutoplayVideoId + "?enablejsapi=1");
}

// * This function cues the playlist for use in the next function

function onRadioDataPlayerReady() {
  var autoplayUrl = "RD" + baseAutoplayVideoId;
  radioDataPlayer.cuePlaylist({list:autoplayUrl});
}

// * This function compiles an array of videos for Streamly Radio
// * Making sure they aren't in the current playlist already

function onRadioDataPlayerStateChange(event) {
  if (event.data === 5) {
    var autoplayVideosSpare = [];
    autoplayVideos = radioDataPlayer.getPlaylist();
    
    for (var i = 0; i <= 25; i++) {
      var notInPlaylist = true;
      var autoplayVideo = autoplayVideos[i];
      for (var x = 1; x < videos.length; x++) {
        if (videos[x][2] === autoplayVideo) {
          notInPlaylist = false;
        }
      }
      if (notInPlaylist) {
        autoplayVideosSpare.push(autoplayVideo);
      }
    }
    autoplayVideos = autoplayVideosSpare;
    
    radioDataPlayer.destroy();
    if (autoplayVideos.length > 1) {
      addAutoplayVideo();
    }
  }
}

// * This function loads the latest Streamly Radio video into the playlist

function addAutoplayVideo() {
  if (playlistAutoplay && videos.length > 0) {
    if (!autoplayVideos.length > 0) {
      loadAutoplayData(videoIteration);
    }
    else if (videoIteration === videoCounter) {
      if (autoplayVideoIteration < autoplayVideos.length - 1) {
        autoplayVideoIteration++;
        console.log("Getting new video: " + autoplayVideos[autoplayVideoIteration] + " data");
        getVideoData(autoplayVideos[autoplayVideoIteration]);
      }
      else {
        loadAutoplayData(videoIteration);
      }
    }
  }
}

// End Streamly Radio

// * This function restores the video list highlighting as applicable
// * It does not use stored values, but rather the state of the playlist

function restoreHighlight(which) {
  if (videos[which][2] === videos[videoIteration][2]) {
    if (videoPaused && videoIteration === 1) {
      highlight(1, "selected", false);
    }
    else if (!playlistRepeat) {
      videoIteration = which;
      highlight(which, "selected", false);
    }
  }
  if (videos[which][2] === baseAutoplayVideoId) {
    highlight(which, "radio", false);
  }
  if (videoErrorIds.indexOf(videos[which][2]) > -1) {
    highlight(which, "videoError", true);
  }
}

// * This function refreshes the playlist viewer with videos in the videos array
// * It's primary use is for playlist shuffling

function refreshVideoList() {
  for (var i = 1; i < videos.length; i++) {
    removeVideoFromList(i, false);
    var printTime = msConversion(videos[i][1] * 1000);
    addVideoToList(videos[i][0], printTime, i, false);
    restoreHighlight(i);
  }
}

// * This function shuffles the videos array for playlist shuffling

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

// * This function shuffles the playlist
// * It's primary use is adding videos that were added during shuffle to the original playlist when un-shuffling

function shufflePlaylist() {
  var playlistName = videos[0];
  var videoIterationId = videos[videoIteration][2];
  var videosBeforeThisShuffle = [];
  if (playlistShuffle) {
    if (videosBeforeShuffle.length < 1) {
      videosBeforeShuffle = JSON.parse(JSON.stringify(videos));
    }
    videos.splice(0, 1);
    shuffleArray(videos);
    videos.unshift(playlistName);
  }
  else {
    if (addedVideosWhileShuffled.length > 0) {
      videosBeforeShuffle.push.apply(videosBeforeShuffle, addedVideosWhileShuffled);
      addedVideosWhileShuffled = [];
    }
    videos = JSON.parse(JSON.stringify(videosBeforeShuffle));
    videosBeforeShuffle = [];
    videos.splice(0, 1);
    videos.unshift(playlistName);
  }
  
  refreshVideoList();
  setPlaylist();
  makeSortable();
  videoPreviews();
  addAutoplayVideo();
  
  if (videos[videoIteration][2] !== videoIterationId) {
    videoIteration = changeIteration(-1);
    loopVideo();
  }
}

// * This function adds a video to the videos array
// * It also plays the video if it is the first video loaded

function addVideo(name, time, id) {
  videoCounter++;
  var iteration;
  if (playlistPlayNext) {
    iteration = videoIteration + 1;
  }
  else {
    iteration = videoCounter;
  }
  var video = [];
  video[0] = name;
  video[1] = time;
  video[2] = id;
  if (videos.length > 0) {
    videos.splice(iteration, 0, video);
  }
  else {
    videos[iteration] = video;
  }
  
  sendStation("addvideo," + video);
  
  if (playlistShuffle) {
    addedVideosWhileShuffled.push(video);
  }

  var printTime = msConversion(time * 1000);

  addVideoToList(name, printTime, iteration, true);

  setPlaylist();
  makeSortable();
  videoPreviews();
  
  if (videoCounter === 1 || (videoPlaying === false && !videoPaused && videoIteration === videoCounter - 1)) {
    loopVideo();
  }
}

// * This function plays videos if the play button in the playlist viewer is clicked
// * Otherwise, videos are always played with the loopVideo function

function actionPlayVideo(iteration) {
  sendStation("actionplayvideo," + iteration);
  videoIteration = iteration;
  videoPaused = false;
  loopVideo();
  $("#favicon").attr("href", faviconPlay);
}

// * This function removes videos from the playlist, skipping to the next video if it is the one removed
// * It's primary use is the remove video button in the playlist viewer

function actionRemoveVideo(iteration) {
  sendStation("actionremovevideo," + iteration);
  if (iteration === videoIteration) {
    if (videoIteration + 1 <= videoCounter) {
      forwardVideo();
      videoIteration = changeIteration(-1);
    }
    else {
      if (!stationRemote) {
        actionTimers.clear();
        player.stopVideo();
        $("#youtube").css("display", "none");
      }
      document.title = "Streamly";
      videoIteration = changeIteration(-1);
    }
  }
  else if (iteration < videoIteration) {
    videoIteration = changeIteration(-1);
  }
  videoCounter--;
  videos.splice(iteration, 1);
  removeVideoFromList(iteration, true);
  
  setPlaylist();
  makeSortable();
  videoPreviews();
  addAutoplayVideo();
}

// * These functions are called when the play/remove video buttons in the playlist viewer are clicked

function buttonPlayVideo(element) {
  var index = $(".playButton").index(element);
  actionPlayVideo(index);
}
function buttonRemoveVideo(element) {
  var index = $(".removeButton").index(element) + 1;
  actionRemoveVideo(index);
}

// * This function is called to move a video from one place in the playlist to another
// * It is called from the sortable function below and calls the Array.move additional functionality

function actionMoveVideo(oldIndex, newIndex) {
  sendStation("actionmovevideo," + oldIndex + "," + newIndex);
  videos.move(oldIndex, newIndex);
  if (oldIndex == videoIteration) {
    videoIteration = newIndex;
  }
  else if (oldIndex < videoIteration && newIndex >= videoIteration) {
    videoIteration = changeIteration(-1);
  }
  else if (oldIndex > videoIteration && newIndex <= videoIteration) {
    videoIteration = changeIteration(1);
  }
  addAutoplayVideo();
}

// * This function makes the entire playlist viewer sortable by dragging&dropping
// * It calls the actionMoveVideo function above

function makeSortable() {
  $( "#videosTable" ).sortable({
    update: function(event, ui) {
      actionMoveVideo(oldIndex + 1, ui.item.index() + 1);
      setPlaylist();
      videoPreviews();
    },
    start: function(event, ui) {
      oldIndex = ui.item.index();
    }
  });
}

// * This function loads the previous and next video button's data in the playlist manipulation footer
// * It is called whenever anything changes in the playlist or the currently playing video changes

function videoPreviews() {
  function addData(which, iteration) {
    $("#" + which + "VideoName").text(decodeURIComponent(videos[iteration][0]));
    $("#" + which + "VideoTime").text(msConversion(videos[iteration][1] * 1000));
    $("#" + which + "VideoImage").attr("src", "https://i.ytimg.com/vi/" + videos[iteration][2] + "/default.jpg");
  }
  function changeOpacity(which, amount) {
    $("#" + which + "VideoName, #" + which + "VideoTime, #" + which + "VideoImage").css("opacity", amount);
  }
  function greyOut(which, color) {
    $("#" + which + "Video").css("background-color", color);
  }

  if (changeIteration(1) <= videoCounter) {
    changeOpacity("next", "1");
    greyOut("next", "white");
    addData("next", changeIteration(1));
  }
  else {
    changeOpacity("next", "0");
    greyOut("next", "grey");
  }

  if (changeIteration(-1) > 0 || (playlistRepeat && videoIteration == 1)) {
    changeOpacity("previous", "1");
    greyOut("previous", "white");
    addData("previous", (playlistRepeat && videoIteration == 1 ? changeIteration(-2) + 1 : changeIteration(-1)));
  }
  else {
    changeOpacity("previous", "0");
    greyOut("previous", "grey");
  }
}

// * This object is for the settings available in the playlist manipulation footer
// * Those buttons call their corresponding functionality here

var PlaylistFeatures = function() {
  this.playNext = function() {
    sendStation("playlistfeaturesplaynext");
    playlistPlayNext = (playlistPlayNext ? false : true);
    $(".fa-arrow-circle-right").css("color", (playlistPlayNext ? "#F77F00" : "grey"));
  }
  this.repeat = function() {
    sendStation("playlistfeaturesrepeat");
    playlistRepeat = (playlistRepeat ? false : true);
    videoPreviews();
    $(".fa-repeat").css("color", (playlistRepeat ? "#F77F00" : "grey"));
  }
  this.shuffle = function() {
    sendStation("playlistfeaturesshuffle");
    playlistShuffle = (playlistShuffle ? false : true);
    shufflePlaylist();
    $(".fa-random").css("color", (playlistShuffle ? "#F77F00" : "grey"));
  }
  this.autoplay = function() {
    playlistAutoplay = (playlistAutoplay ? false : true);
    if (playlistAutoplay === false) {
      autoplayVideos = [];
      autoplayVideoIteration = 0;
      baseAutoplayVideoId = null;
      $("tr").removeClass("radio");
    }
    else {
      addAutoplayVideo();
      videoPreviews();
    }
    $(".fa-rss").css("color", (playlistAutoplay ? "#F77F00" : "grey"));
  }
}
var playlistFeatures = new PlaylistFeatures;

// * This function interprets the type of URL (or whether it isn't a URL)
// * It then specifies how to interpret this URL in the function below

function urlValidate(url) {
  var youtubeRegex = /(?:youtube\.com\/watch.+?v=|youtu\.be\/|youtube.com\/embed\/)([^?&]+)/i;
  var streamlyRegex = /.*#(.+)/i;
  
  function checkMatch(url, regex) {
    var doesMatch = url.match(regex);
    if (doesMatch !== null && doesMatch[1] !== null) {
      return doesMatch[1];
    }
    else {
      return false;
    }
  }
  
  var checkoutYoutube = checkMatch(url, youtubeRegex);
  var checkoutStreamly = checkMatch(url, streamlyRegex);
  if (checkoutYoutube) {
    return ["youtube", checkoutYoutube];
  }
  else if (checkoutStreamly) {
    return ["streamly", checkoutStreamly];
  }
  else {
    return false;
  }
}

// * This function handles all user inputs
// * It has changed minimally throughout the history of Streamly
// * Its 'type' parameter specifies where the input is coming from (which I'm eventually going to change)
// * The playlist name box type number is 2

// * If a YouTube video URL load video to playlist, if a Streamly playlist append it to the current one, if none of the above load search

function input(type) {
  var inputBox = $("#inputBox").val();
  //if playlist input
  if (type === 2) {
    var playlistNameBox = $("#playlistNameBox").val();
    sendStation("playlistnamechange," + playlistNameBox);
    if (playlistNameBox !== "") {
      videos[0] = encodeURIComponent(playlistNameBox).replace(/%20/g, " ");
    }
    else {
      videos[0] = undefined;
    }
    setPlaylist();
  }
  else {
    if (inputBox !== "") {
      var isUrl = urlValidate(inputBox);
      var option = inputBox.match(/^-option (.+?)( .+?)?$/i);
      
      var ua = navigator.userAgent.toLowerCase();
      var isAndroid = ua.indexOf("android") > -1;
      
      if (option) {
        switch (option[1]) {
          case "hidevideo":
            $("#youtubeContainer").addClass("hideVideo");
            break;
          case "showvideo":
            $("#youtubeContainer").removeClass("hideVideo");
            break;
          case "background":
            if (typeof option[2] != 'undefined') {
              $("body, #blurBackground").css("background", option[2]);
            }
            else {
              alert("No background color or image specified");
            }
            break;
          default:
            alert("Sorry, but that option does not exist\n\nCheck with the list of Streamly options on GitHub");
        }
      }
      else if (isUrl) {
        if (isUrl[0] === "youtube") {
          inputBox = isUrl[1];
          getVideoData(inputBox);
          $("#inputBox").val("").attr("placeholder", loadingPlaceholder);
          if (typeof popup !== "undefined") {
            if (popupClose === true) {
              dropOverlay.close();
              popup.close();
              if (hotkeyPopupClose) {
                hotkeyPopupClose = false;
                togglePopupClose();
              }
            }
            else {
              popup.focus();
            }
          }
        }
        else if (isUrl[0] === "streamly") {
          appendPlaylist(isUrl[1]);
          $("#inputBox").val("").attr("placeholder", placeholder);
        }
      }
      else if (($(window).width() > 600 && !isAndroid) && inputBox.indexOf("\\") === -1) {
        if (inputBox.slice(-2) === " l") {
          inputBox = inputBox + "yric";
        }
        popup = window.open("https://www.youtube.com/results?search_query=" + inputBox.replace(/ /g, "+"), "YouTube", "height=500,width=800");
        dropOverlay.open();
        
        function checkIfClosed() {
            if (popup.closed) {
              dropOverlay.close();
              clearInterval(checkIfClosedTimer);
            }
        }
        var checkIfClosedTimer = setInterval(checkIfClosed, 500);

        $("#inputBox").val("").attr("placeholder", placeholder);
      }
      else {
        inputBox = inputBox.replace("\\", "");
        if (inputBox.slice(-2) === " l") {
          inputBox = inputBox + "yric";
        }
        quickSearch(inputBox);
      }
    }
  }
}

// * These are the event listeners for stuff that's dragged and dropped

document.addEventListener("drop", function(event) {
  event.preventDefault();
  var data = event.dataTransfer.getData("URL");

  $("#inputBox").val(data);
  input(1);
});
document.addEventListener("dragover", function(event) {
  event.preventDefault();
});

// Start Streamly Station

// * This function flashes the Streamly Station icon

function flashStationIcon() {
  $("#stationIcon").css("color", "red");
  setTimeout(function() {
    $("#stationIcon").css("color", "#00ff00");
  }, 300);
}

// * This function sends a command to the Streamly Station

function sendStation(what) {
  if (stationServer !== undefined && stationServer !== null) {
    if (!stationTxQuiet) {
      console.log("Station Tx: " + what);
      flashStationIcon();
      stationSocket.emit("msg", stationUserId + "," + what);
    }
    else {
      stationTxQuiet = false;
    }
  }
}

// * This function begins a connection with the Streamly Station and listens for commands

function loadStation() {
  stationSocket = io("http://" + stationServer);
  stationUserId = makeId();
  alert("Streamly Station \"" + stationServer + "\" connected!");
  
  $("#stationIcon").css("display", "initial");
  
  stationSocket.on("msg", function(msg) {
    console.log("Station Rx: " + msg);
    
    var msgData = msg.split(",");
    if (msgData[0] !== stationUserId) {
      stationTxQuiet = true;
      flashStationIcon();
      
      switch (msgData[1]) {
        case "addvideo":
          addVideo(msgData[2], msgData[3], msgData[4]);
          break;
        case "playerending":
          loopVideo();
          break;
        case "actionplayvideo":
          actionPlayVideo(+msgData[2]);
          break;
        case "actionremovevideo":
          actionRemoveVideo(+msgData[2]);
          break;
        case "forwardvideo":
          forwardVideo();
          break;
        case "backvideo":
          backVideo();
          break;
        case "videofunctionsplay":
          if (!stationRemote) {
            player.playVideo();
          }
          else {
            $("#remotePauseIcon").removeClass("fa-play").addClass("fa-pause");
          }
          break;
        case "videofunctionspause":
          if (!stationRemote) {
            player.pauseVideo();
          }
          else {
            $("#remotePauseIcon").removeClass("fa-pause").addClass("fa-play");
          }
          break;
        case "playlistfeaturesplaynext":
          playlistFeatures.playNext();
          break;
        case "playlistfeaturesrepeat":
          playlistFeatures.repeat();
          break;
        case "playlistfeaturesshuffle":
          playlistFeatures.shuffle();
          break;
        case "actionmovevideo":
          actionMoveVideo(+msgData[2], +msgData[3]);
          refreshVideoList();
          setPlaylist();
          makeSortable();
          videoPreviews();
          addAutoplayVideo();
          break;
        case "playlistnamechange":
          $("#playlistNameBox").val(msgData[2]);
          input(2);
      }
    }
  });
}

// * This function loads the Streamly Station client-side code and runs the loadStation function

function connectStation(server) {
  stationServer = server;
  $.ajax({
    url: "http://" + stationServer + "/socket.io/socket.io.js",
    dataType: "script",
    success: loadStation
  });
}

// * This function disconnects the station... duh.

function disconnectStation() {
  stationSocket.disconnect();
  $("#stationIcon").css("display", "none");
}

// * This function handles user input and runs connectStation on being called by user

var securityWarning = false;
function actionConnectStation() {
  var station = $("#connectStationBox").val();
  if (window.location.protocol === "https:" && securityWarning === false) {
    securityWarning = true;
    alert("Note: Due to security protections, scripts on secured pages with 'https://' cannot make unsecured connections. " + 
          "Streamly Station runs without any onboard security, so this request will probably be blocked and you'll get a notification that the site requested unsecured scripts.\n\n" +
          "In order to use Streamly Station, either make an exception to 'Load unsafe scripts' or replace the 'https://' with 'http://' in the URL.");
  }
  connectStation(station);
}

// * This function blocks out the loading of videos when in Remote mode

function toggleRemote() {
  if (!stationRemote) {
    stationRemote = true;
    $("#remotePauseIcon").css("display", "block");
    $("#youtubeContainer").css("background", "black");
    $("#youtube").css("display", "none");
    $("#currentVideoTiming").css("opacity", "0");
  }
  else {
    stationRemote = false;
    $("#remotePauseIcon").css("display", "none");
    $("#youtubeContainer").css("background", "none");
    $("#youtube").css("display", "block");
    $("#currentVideoTiming").css("opacity", "1");
  }
}

// End Streamly Station

// * This is the Zen mode function that moves and hides elements

function toggleZen() {
  if (zenMode) {
    zenMode = false;
    $("header, #forkmeImage").removeClass("slideOutUp").addClass("slideInDown");
    $("footer").removeClass("slideOutDown").addClass("slideInUp");
    $("#links").off().css("display", "block").removeClass("fadeOut").addClass("fadeIn");
    $("#zenModeToggle").prop("checked", false);
  }
  else {
    zenMode = true;
    $("header, #forkmeImage").removeClass("slideInDown").addClass("slideOutUp");
    $("footer").removeClass("slideInUp").addClass("slideOutDown");
    $("#links").removeClass("fadeIn").addClass("fadeOut");
    $("#links").on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
      $(this).css("display", "none");
    });
    $("#zenModeToggle").prop("checked", true);
  }
}

function toggleSideBySide() {
  function changeSBS(which, add) {
    var className = which.replace("#", "");
    if (add) {
      $(which).addClass(className + "SBS");
    }
    else {
      $(which).removeClass(className + "SBS");
    }
  }
  var sbsElements = [
    "#main",
    "#playlistInterface",
    "#youtubeContainer",
    "#currentVideoTiming",
    "#progressContainer",
    "#settings",
    "footer"
  ];
  if (sideBySide) {
    sideBySide = false;
    sbsElements.forEach(function(element) {
      changeSBS(element, false);
    });
    $("#sideBySideToggle").prop("checked", false);
  }
  else {
    sideBySide = true;
    sbsElements.forEach(function(element) {
      changeSBS(element, true);
    });
    $("#sideBySideToggle").prop("checked", true);
  }
}

// * This is the function that is called for toggling the pop-up close user preference

function togglePopupClose() {
  if (!popupClose) {
    popupClose = true;
  }
  else {
    popupClose = false;
  }
}

// * This object loads the drop overlay over Streamly
// * It is used primarily for when the settings window is toggled and when drag&drop searching is activated

var DropOverlay = function() {
  this.open = function() {
    $("#settingsShadow").css("display", "block");
    $("#dropOverlay").css("display", "block");
  }
  this.close = function() {
    $("#settingsShadow").css("display", "none");
    $("#dropOverlay").css("display", "none");
  }
}
var dropOverlay = new DropOverlay();

// * Congrats! You've made it to the bottom of the code! While you're here I should mention that I'm an amateur
// * web developer with literally zero formal education on the subject. If you see how something could be better,
// * please change it! Fork and submit a pull request. This is your project as much as it is mine!
// *
// * Bonus, I've written an ad-lib 'poem' that is totally unrelated
// *
// * Stirring in the wisps of wind
// * Rings a song of thunder and rain
// * Many have seen the falling leaves
// * Draining summer's warmth in vain
// *
// * It's not in the hills and valleys
// * Not within the breath of doves
// * Shining brightly upon the shadows
// * Grey dim lighting from clouds above
// *
// * Longing for lightning from Heaven's alleys
// * Waiting for calm before a storm
// * Seeing the field reflecting the shield
// * Of winter's white colors, no dark skies of love
// *                      - LNFWebsite (9/23/2017)
