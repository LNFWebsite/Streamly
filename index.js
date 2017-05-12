//! License: MIT (as stated in the LICENSE file)

var placeholder = "Search, drag and drop video, or paste its URL...";
var loadingPlaceholder = "Loading video data from YouTube...";

var faviconPause = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAMAAAANmfvwAAAA/1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD64ociAAAAVHRSTlMAAQIDBAUGBwgJCgsPEBIUFxgbHh8iIyUrMDU/QEdKS09QUlZbXF5fYWZpb3F1e4aJmJ6go6WmqrK0tb7Aw8XHyM/R09XX2drg4unr7e/x8/X3+ftnm6MTAAABGklEQVQ4jYXTx1YCQRBG4TvCYKO2iglzxJwVA5gFs4LA//7P4mLIM9PeZfV3Tm26oC+vf9BTYu7wrib93hzMDkSCoaOG2tX2B0PA21FvjbU+YR4UquB3i5GPsJDK6Y4YjBTSU7JNbqOFdNkSG3FCWghEqhFPfhIA7EmSatYYY9JXUsYYY0wmMOsAXlWS9EbLN9cH5B1gRi6icWDbTVaACzc5AcpuUgQqblL6nzwDJTcpAOducgxsuskSMOUmY4D37SKvAAS/tj5hrbWjBSlrrbU2G5BlAPyaYvtsXstyPJlvbuU6Tpy2BP5LtLjvOsrh1yjxmKIrvxgW+QS9rdZ7QXWRUP5upQO+csmwALzprXy5Uimd5SYj3+P7A3jQxmKOfWTQAAAAAElFTkSuQmCC";
var faviconPlay = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAMAAAANmfvwAAABDlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABxUYW9AAAAWXRSTlMAAQIDBAUGCAkRFBUZGhscHiAhJyorLzI0ODo7PUZMTlBVVldYWVtcXV5hZHB1foKDiIuPlZiboKKlpqirr7CytcDDyMrMzs/R09Xa3N7g4ubp7e/x9/n7/Ud7aO4AAAE3SURBVBgZlcFpOxtRAIbhZ8YgltBaopZEHanamtKgtYaSklJ0xPL+/z8iGedMZq5MPrhv3mlgslzZ2aksT/aTbfpQsYMpun24UMr5OGneN3XZ9EjoO1KGA5+Yd6pMxx5OVT1sY31STwUifqg3jaF8TWn/fdo+y1oFCv+UUqLtXpahxSs/KeGOlrwcQ2TwhxJGgWU5Bit/ptgSsCfHEJu9l7ULXMkxdPgbL4r8AR7kGJLmFQmBphxD0pQiTeCvHEPC/IMiV8C+HENs7LesX8CaHIOVqyr2FZiQY4j4K8/q+Ah4TVmGtplbJYQeLRuyvgAjp0pZp63/SW/Ogtx3pT0GRErqqYh1oh6OcIKGMl0GxHKXylAfJCHYV5effaQthEoJ5+jiL94odl3yyTRc3KrV67Wt4jDv8wr7Zt73xzlZAQAAAABJRU5ErkJggg==";

var popup;

var videoId;

var videos = [];
var videoCounter = 0;
var videoIteration = 0;

var videoErrorIds = [];

var videosBeforeShuffle = [];
var addedVideosWhileShuffled = [];

var baseAutoplayVideoId;
var autoplayVideos = [];
var autoplayVideoIteration = 0;

var quickSearchQuery;
var quickSearchVideos = [];
var quickSearchVideosIteration = 0;

var stationServer;
var stationSocket;
var stationRxQuiet = false;
var stationTxQuiet = false;

var videoPaused;
//this var is for addVideo knowing whether to loop to next video or not
var videoPlaying;
var backRestart;

var progressTimer;

var playlistPlayNext;
var playlistRepeat;
var playlistShuffle;
var playlistAutoplay;

var dataPlayer;
var radioDataPlayer;
var searchDataPlayer;

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
  return (seconds == 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
}

function highlight(i, which) {
  $("tr:nth-child(" + i + ")").attr("id", "new-" + which);
  $("tr." + which).removeClass(which);
  $("#new-" + which).addClass(which);
  $("#new-" + which).removeAttr("id");
}

function addVideoToList(name, time, spot) {
  name = decodeURIComponent(name);
  var trElement = "<tr class=\"animated flipInX\"><td>" + name + "<button class=\"tableButton removeButton\" onclick=\"buttonRemoveVideo(this);\" title=\"Remove\"><span class=\"fa fa-times\"></span></button>" +
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

function resetTimer(which) {
  if (typeof which !== "undefined") {
    if (which != 0) {
      which.pause();
    }
    which = 0;
  }
}

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

function playVideo() {
  videoPlaying = true;
  highlight(videoIteration, "selected");
  videoPreviews();
  addAutoplayVideo();

  document.title = "Streamly - " + decodeURIComponent(videos[videoIteration][0]);
  
  $("#youtube").css("display", "block");
  
  if ($("#youtube").attr("src") === "") {
    var parameters = "?enablejsapi=1";
    if (!videoPaused) {
      parameters = "?enablejsapi=1&autoplay=1";
    }
    var embedUrl = "https://www.youtube.com/embed/" + videos[videoIteration][2] + parameters;
    $("#youtube").attr("src", embedUrl);
  }
  else {
    if (!videoPaused) {
      player.loadVideoById(videos[videoIteration][2]);
    }
    else {
      player.cueVideoById(videos[videoIteration][2]);
    }
    console.log("Debug: playVideo");
  }

  backRestart = false;
  window.setTimeout(function() {
    backRestart = true;
  }, 3000);
}

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

var VideoFunctions = function() {
  this.play = function() {
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

function forwardVideo() {
  sendStation("forwardvideo");
  if (changeIteration(1) <= videoCounter) {
    loopVideo();
  }
}

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
        addVideoToList(videos[videoCounter][0], printTime, videoCounter);
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

var dataPlayerRunning = false;
function getVideoData(id) {
  console.log("getVideoData dataPlayerRunning=" + dataPlayerRunning + " videoId=" + videoId + " id=" + id);
  if (!dataPlayerRunning) {
    dataPlayerRunning = true;
    videoId = id;
    var dataFrame = document.createElement("iframe");
    dataFrame.setAttribute("id", "dataFrame");
    dataFrame.setAttribute("src", "");
    document.getElementById("dataFramesContainer").appendChild(dataFrame);
    dataPlayer = new YT.Player('dataFrame', {
      events: {
        'onReady': onDataPlayerReady
      }
    });
    var embedUrl = "https://www.youtube.com/embed/" + id + "?enablejsapi=1";
    dataFrame.setAttribute("src", embedUrl);
  }
  else {
    setTimeout(function() {
      getVideoData(id);
    }, 500);
  }
}

var dataPlayerErrors = 0;
function onDataPlayerReady() {
  console.log("onDataPlayerReady");
  try {
    var data = dataPlayer.getVideoData();
    var videoName = dataPlayer.getVideoData()["title"];
    videoName = encodeURIComponent(videoName).replace(/%20/g, " ");
    var videoTime = Math.round(dataPlayer.getDuration());
    $("#inputBox").val("").attr("placeholder", placeholder);
    dataPlayer.destroy();
    dataPlayerErrors = 0;
    addVideo(videoName, videoTime, videoId);
    dataPlayerRunning = false;
  }
  catch(e) {
    dataPlayerErrors++;
    console.log(e);
    if (dataPlayerErrors <= 5) {
      try {
        dataPlayer.destroy();
      } catch(e) {};
      getVideoData();
    }
  }
}

// Start Quick Search

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

function onSearchDataPlayerStateChange(event) {
  if (event.data === 5) {
    $("#inputBox").val("").attr("placeholder", placeholder).blur().focus();
    quickSearchVideosIteration = 0;
    quickSearchVideos = searchDataPlayer.getPlaylist();
    var data = searchDataPlayer.getVideoData();
    var id = data["video_id"];
    var videoName = data["title"];
    videoName = encodeURIComponent(videoName).replace(/%20/g, " ");
    var videoTime = Math.round(searchDataPlayer.getDuration());
    searchDataPlayer.destroy();
    addVideo(videoName, videoTime, id);
  }
}

// End Quick Search

// Start Streamly Radio

function loadAutoplayData(iteration) {
  autoplayVideos = [];
  autoplayVideoIteration = 0;
  
  highlight(iteration, "radio");
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

function onRadioDataPlayerReady() {
  var autoplayUrl = "RD" + baseAutoplayVideoId;
  radioDataPlayer.cuePlaylist({list:autoplayUrl});
}

function onRadioDataPlayerStateChange(event) {
  if (event.data === 5) {
    var autoplayVideosSpare = [];
    autoplayVideos = radioDataPlayer.getPlaylist();
    for (var i = 1; i <= 25; i++) {
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

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

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
      videosBeforeShuffle.push(...addedVideosWhileShuffled);
      addedVideosWhileShuffled = [];
    }
    videos = JSON.parse(JSON.stringify(videosBeforeShuffle));
    videosBeforeShuffle = [];
    videos.splice(0, 1);
    videos.unshift(playlistName);
  }
  
  for (var i = 1; i < videos.length; i++) {
    removeVideoFromList(i, false);
    var printTime = msConversion(videos[i][1] * 1000);
    addVideoToList(videos[i][0], printTime, i);
    if (videos[i][2] === videoIterationId) {
      if (videoPaused && videoIteration === 1) {
        highlight(1, "selected");
      }
      else if (!playlistRepeat) {
        videoIteration = i;
        highlight(i, "selected");
      }
    }
    if (videos[i][2] === baseAutoplayVideoId) {
      highlight(i, "radio");
    }
    if (videoErrorIds.indexOf(videos[i][2]) > -1) {
      highlight(i, "videoError");
    }
  }
  
  setPlaylist();
  makeSortable();
  videoPreviews();
  addAutoplayVideo();
  
  if (videos[videoIteration][2] !== videoIterationId) {
    videoIteration = changeIteration(-1);
    loopVideo();
  }
}

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

  addVideoToList(name, printTime, iteration);

  setPlaylist();
  makeSortable();
  videoPreviews();
  
  if (videoCounter === 1 || (videoPlaying === false && !videoPaused && videoIteration === videoCounter - 1)) {
    loopVideo();
  }
}

function actionPlayVideo(iteration) {
  sendStation("actionplayvideo," + iteration);
  videoIteration = iteration;
  videoPaused = false;
  loopVideo();
  $("#favicon").attr("href", faviconPlay);
}

function actionRemoveVideo(iteration) {
  sendStation("actionremovevideo," + iteration);
  if (iteration === videoIteration) {
    if (videoIteration + 1 <= videoCounter) {
      forwardVideo();
      videoIteration = changeIteration(-1);
    }
    else {
      actionTimers.clear();
      player.stopVideo();
      $("#youtube").css("display", "none");
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

function buttonPlayVideo(element) {
  var index = $(".playButton").index(element);
  actionPlayVideo(index);
}
function buttonRemoveVideo(element) {
  var index = $(".removeButton").index(element) + 1;
  actionRemoveVideo(index);
}

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

function urlValidate(url) {
  var regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube.com\/embed\/)([^?&]+)/i;
  url = url.match(regex);
  if (url !== null && url[1] !== null) {
    return url[1];
  }
  else {
    return false;
  }
}

function input(type) {
  var inputBox = $("#inputBox").val();
  //if playlist input
  if (type === 2) {
    var playlistNameBox = $("#playlistNameBox").val();
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
        inputBox = isUrl;
        getVideoData(inputBox);
        $("#inputBox").val("").attr("placeholder", loadingPlaceholder);
        if (typeof popup !== "undefined") {
          popup.close();
        }
        $("#youtube").css("display", "block");
      }
      else if ($(window).width() > 600 && inputBox.indexOf("\\") === -1) {
        if (inputBox.slice(-2) === " l") {
          inputBox = inputBox + "yric";
        }
        popup = window.open("https://www.youtube.com/results?search_query=" + inputBox.replace(/ /g, "+"), "YouTube", "height=500,width=800");

        function checkIfClosed() {
            if (popup.closed) {
              $("#youtube").css("display", "block");
              clearInterval(checkIfClosedTimer);
            }
        }
        var checkIfClosedTimer = setInterval(checkIfClosed, 500);

        $("#inputBox").val("").attr("placeholder", placeholder);
        $("#youtube").css("display", "none");
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

function sendStation(what) {
  if (stationServer !== undefined && stationServer !== null) {
    if (!stationRxQuiet) {
      stationTxQuiet = true;
      console.log("Station Tx: " + what);
      stationSocket.emit("msg", what);
    }
    else {
      stationRxQuiet = false;
    }
  }
}

function loadStation() {
  stationSocket = io("http://" + stationServer);
  alert("Streamly Station \"" + stationServer + "\" connected!");
  
  stationSocket.on("msg", function(msg) {
    console.log("Station Rx: " + msg);
    
    var msgData = msg.split(",");
    if (!stationTxQuiet) {
      stationRxQuiet = true;
      switch (msgData[0]) {
        case "addvideo":
          addVideo(msgData[1], msgData[2], msgData[3]);
          break;
        case "playerending":
          loopVideo();
          break;
        case "actionplayvideo":
          actionPlayVideo(+msgData[1]);
          break;
        case "actionremovevideo":
          actionRemoveVideo(+msgData[1]);
          break;
        case "forwardvideo":
          forwardVideo();
          break;
        case "backvideo":
          backVideo();
          break;
        case "videofunctionsplay":
          player.playVideo();
          break;
        case "videofunctionspause":
          player.pauseVideo();
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
          $("#videosTable tr:nth-child(" + (msgData[3] - 1) + ")").after($("#videosTable tr:nth-child(" + msgData[2] + ")"));
          break;
      }
    }
    else {
      stationTxQuiet = false;
    }
  });
}

function connectStation(server) {
  stationServer = server;
  $.ajax({
    url: "https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.1/socket.io.js",
    dataType: "script",
    success: loadStation
  });
}

// End Streamly Station
