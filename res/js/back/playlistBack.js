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
    
    //don't splice off playlist[0] if videos array is uninitialized (use value from appended playlist)
    //and highlight & cue up the first video
    if (videos.length !== 0) {
      playlist.splice(0, 1);
      videos = videos.concat(playlist);
    }
    else {
      videos = videos.concat(playlist);
      for (var i = 1; i < videos.length; i++) {
        restoreHighlight(i);
      }
      videoPaused = true;
      loopVideo();
    }
    
    setPlaylist();
    makeSortable();
    videoPreviews();
    addAutoplayVideo();
  }
  catch(err) {
    alert("Uh oh... It looks like this playlist URL is broken, however, you may still be able to retrieve your data.\n\n" +
      "Make sure that you save the URL that you have now, and contact me (the administrator) by submitting an issue on Streamly's Github page.\n\n" +
      "I'm really sorry about this inconvenience.\n\nerr: " + err);
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

// * This is an added function to arrays for moving elements from one spot to another
// * It is primarily used for shuffling

Array.prototype.move = function(from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
};

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
