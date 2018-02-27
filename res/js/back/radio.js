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
