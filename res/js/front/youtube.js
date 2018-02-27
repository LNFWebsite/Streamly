function startVideoProgress() {
  if (!videoPaused) {
    actionTimers.clear();
    videoProgress();
  }
  else {
    actionTimers.clear();
    videoProgress();
    actionTimers.pause();
  }
}

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// **BREAKTHROUGH THE GREATER!**
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('youtube', {
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange,
      'onError': onError
    }
  });
  console.log("Debug: Player loaded");
}
function onPlayerStateChange(event) {
  switch(event.data) {
    //unstarted
    case -1:
      console.log("unstarted");
      break;
    //ending
    case 0:
      console.log("ending");
      sendStation("playerending");
      loopVideo();
      break;
    //playing
    case 1:
      console.log("playing");
      videoFunctions.play();
      startVideoProgress();
      break;
    //paused
    case 2:
      console.log("paused");
      videoFunctions.pause();
      break;
    //buffering
    case 3:
      console.log("buffering");
      //this is here because video errors cause a 'paused' event
      //the same occurs when scrolling quickly through a playlist
      //don't move the videoFunctions.play() stuff here because this is NOT triggered on un-pausing
      //the 'buffering' event is never triggered on paused/pausing videos so this does not conflict with other things
      videoPaused = false;
      break;
    //cued
    case 5:
      console.log("cued");
      startVideoProgress();
      break;
  }
}
function onPlayerReady(event) {
  console.log("Debug: onPlayerReady");
  startVideoProgress();

  getPlaylist();
  makeSortable();
  videoPreviews();
}
function onError(event) {
  console.log(videoPaused);
  videoErrorIds.push(videos[videoIteration][2]);
  $("tr:nth-child(" + videoIteration + ")").addClass("videoError");
  forwardVideo();
}

//need to initialize per 6/2017 YT backend change
$("#youtube").attr("src", "https://www.youtube.com/embed/?enablejsapi=1");
