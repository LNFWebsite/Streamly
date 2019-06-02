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

let tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// **BREAKTHROUGH THE GREATER!**
let player;
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
