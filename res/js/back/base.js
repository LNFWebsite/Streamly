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

// * This function decodes URI encoded characters and escapes html characters in a string in order to prevent XSS attacks
function escape(what) {
  return $("<div>").text(decodeURIComponent(what)).html();
}

// * This function is for iteration order changes such as playlistRepeat

function changeIteration(which) {
  let sum = videoIteration + which;
  if (playlistRepeat && sum > videoCounter) {
    return 1;
  }
  else if (playlistRepeat && sum < 0) {
    return videoCounter - 1;
  }
  else {
    return sum;
  }
}

// * This function loads videos from the playlist into the YouTube iFrame

function playVideo() {
  videoPlaying = true;
  highlight(videoIteration, "selected", false);
  videoPreviews();
  //only load next radio video if not loading playlist (interferes)
  if (!autoplayList || autoplayListOverride) {
    addAutoplayVideo();
  }

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

let VideoFunctions = function() {
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
let videoFunctions = new VideoFunctions();

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

// * This function adds a video to the videos array
// * It also plays the video if it is the first video loaded

function addVideo(name, time, id) {
  videoCounter++;
  let iteration;
  if (playlistPlayNext) {
    iteration = videoIteration + 1;
  }
  else {
    iteration = videoCounter;
  }
  let video = [];
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

  let printTime = msConversion(time * 1000);

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
  removeVideoFromList(iteration, false);


  setPlaylist();
  makeSortable();
  videoPreviews();
  //if user removed the last video in playlist with autoplay on, load next one
  if ((iteration - 1) === videoCounter) {
    addAutoplayVideo();
  }
}

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
