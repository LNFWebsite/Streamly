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
  name = escape(name);

  if (smooth) {
    smooth = " class=\"animated flipInX\"";
  }
  else {
    smooth = "";
  }

  //let trElement = "<tr" + smooth + "><td class=\"tableLeft\">" + name + "<div class=\"tableButtonDiv\"><button class=\"tableButton removeButton\" onclick=\"buttonRemoveVideo(this);\" title=\"Remove\"><span class=\"fa fa-times\"></span></button>" +
  //"<button class=\"tableButton playButton\" onclick=\"buttonPlayVideo(this);\" title=\"Play\"><span class=\"fa fa-play\"></span></button></div></td><td>" + time + "</td></tr>";

  let trElement = "<tr" + smooth + "><td class=\"tableLeft\">" + name +
  "<div class=\"tableButtons\">" +
  "<span class=\"fa fa-rss autoplayButton\" onclick=\"playlistButtons.autoplay(this);\" title=\"Start Radio\"></span>" +
  "<span class=\"fa fa-play playButton\" onclick=\"playlistButtons.play(this);\" title=\"Play\"></span>" +
  "<span class=\"fa fa-times removeButton\" onclick=\"playlistButtons.remove(this);\" title=\"Remove\"></span>" +
  "</div></td><td>" + time + "</td></tr>";
  
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

// * This function restores the video list highlighting as applicable
// * It does not use stored values, but rather the state of the playlist

function restoreHighlight(which) {
  if (which === videoIteration) {
    highlight(which, "selected", false);
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
  for (let i = 1; i < videos.length; i++) {
    removeVideoFromList(i, false);
    let printTime = msConversion(videos[i][1] * 1000);
    addVideoToList(videos[i][0], printTime, i, false);
    restoreHighlight(i);
  }
}

// * These functions are called when the play/remove video buttons in the playlist viewer are clicked

let PlaylistButtons = function() {
  this.play = function(element) {
    let index = $(".playButton").index(element);
    actionPlayVideo(index);
  }
  this.remove = function(element) {
    let index = $(".removeButton").index(element) + 1;
    actionRemoveVideo(index);
  }
  this.autoplay = function(element) {
    let index = $(".autoplayButton").index(element) + 1;
    console.log("here: " + index);
    playlistAutoplay = true;
    addAutoplayVideo(index, 'reset');
    playlistFeatures.toggleSelected(playlistAutoplay, ".fa-rss");
  }
}
let playlistButtons = new PlaylistButtons;

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
    },
    cancel: "span"
  });
}

// * This object is for the settings available in the playlist manipulation footer
// * Those buttons call their corresponding functionality here

let PlaylistFeatures = function() {
  let self = this;
  this.toggleSelected = function(doit, which) {
    if (doit) {
      $(which).addClass("selected");
    }
    else {
      $(which).removeClass("selected");
    }
  }
  this.playNext = function() {
    sendStation("playlistfeaturesplaynext");
    playlistPlayNext = (playlistPlayNext ? false : true);
    self.toggleSelected(playlistPlayNext, ".fa-arrow-circle-right");
  }
  this.repeat = function() {
    sendStation("playlistfeaturesrepeat");
    playlistRepeat = (playlistRepeat ? false : true);
    videoPreviews();
    self.toggleSelected(playlistRepeat, ".fa-redo-alt");
  }
  this.shuffle = function() {
    sendStation("playlistfeaturesshuffle");
    playlistShuffle = (playlistShuffle ? false : true);
    shufflePlaylist();
    self.toggleSelected(playlistShuffle, ".fa-random");
  }
  this.autoplay = function() {
    playlistAutoplay = (playlistAutoplay ? false : true);
    if (playlistAutoplay === false) {
      autoplayVideos = [];
      autoplayVideoIteration = 0;
      baseAutoplayVideoId = false;
      autoplayList = false;
      autoplayLoading = false;
      $("tr").removeClass("radio");
    }
    else {
      addAutoplayVideo();
    }
    self.toggleSelected(playlistAutoplay, ".fa-rss");
  }
}
let playlistFeatures = new PlaylistFeatures;

// * This function loads the previous and next video button's data in the playlist manipulation footer
// * It is called whenever anything changes in the playlist or the currently playing video changes

function videoPreviews() {
  if (!isMobile) {
    function addData(which, iteration) {
      $("#" + which + "Video .videoName").text(decodeURIComponent(videos[iteration][0]));
      $("#" + which + "Video .videoTime").text(msConversion(videos[iteration][1] * 1000));
      $("#" + which + "Video .videoImage").attr("src", "https://i.ytimg.com/vi/" + videos[iteration][2] + "/default.jpg");
    }
    function changeOpacity(which, amount) {
      $("#" + which + "Video .videoName, #" + which + "Video .videoImage, #" + which + "Video .videoTime").css("opacity", amount);
    }
    function greyOut(which, color) {
      $("#" + which + "Video").css("background-color", color);
      if (color === "white") {
        color = "black";
      }
      else {
        color = "inherit";
      }
      $("#" + which + "Video .videoImageContainer").css("background", color);
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
}
