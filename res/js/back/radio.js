/**
  Copyright 2018 LNFWebsite
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
      http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
**/

// Start Streamly Radio

// * This function loads the video for the Streamly Radio function

function loadAutoplayData(iteration) {
  autoplayVideos = [];
  autoplayVideoIteration = -1;

  if (autoplayList) {
    baseAutoplayVideoId = autoplayList[0];
  }
  else {
    highlight(iteration, "radio", false);
    baseAutoplayVideoId = videos[iteration][2];
  }
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
  if (autoplayList) {
    var autoplayUrl = autoplayList[1];
  }
  else {
    var autoplayUrl = "RD" + baseAutoplayVideoId;
  }
  radioDataPlayer.cuePlaylist({list:autoplayUrl});
}

// * This function compiles an array of videos for Streamly Radio
// * Making sure they aren't in the current playlist already

function onRadioDataPlayerStateChange(event) {
  if (event.data === 5) {
    var autoplayVideosSpare = [];
    autoplayVideos = radioDataPlayer.getPlaylist();

    for (var i = 0; i < autoplayVideos.length; i++) {
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
      if (autoplayList) {
        for (var i = 0; i < autoplayVideos.length; i++) {
          addAutoplayVideo();
        }
      }
      else {
        addAutoplayVideo();
      }
    }
  }
}

// * This function loads the latest Streamly Radio video into the playlist

function addAutoplayVideo() {
  if (playlistAutoplay && (videos.length > 0 || autoplayList)) {
    if (!autoplayVideos.length > 0) {
      loadAutoplayData(videoIteration);
    }
    else if (videoIteration === videoCounter || autoplayList) {
      if (autoplayVideoIteration < autoplayVideos.length - 1) {
        autoplayVideoIteration++;
        console.log("Getting new video: " + autoplayVideos[autoplayVideoIteration] + " data");
        getVideoData(autoplayVideos[autoplayVideoIteration]);
      }
      else if (!autoplayList) {
        loadAutoplayData(videoIteration);
      }
      else {
        //kill Streamly Radio after the playlist is loaded
        playlistFeatures.autoplay();
      }
    }
  }
}

// End Streamly Radio
