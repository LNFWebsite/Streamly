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

$("#inputBox").on("paste", function() {
  setTimeout(function() {
    input(1);
  }, 0);
});

$("#inputBox").on("focus", function() {
  $(this).attr("placeholder", "(End your search with \\ for Quick Search, add 'l' for lyric videos)");
  setTimeout(function() {
    $("#inputBox").attr("placeholder", placeholder);
  }, 4000);

  if ($(window).width() <= 600) {
    $("footer").css("display", "none");
  }
});

$("#inputBox").on("blur", function() {
  if ($(window).width() <= 600) {
    $("footer").css("display", "block");
  }
});

$("#playlistNameBox").on("blur", function() {
  input(2);
});

window.addEventListener("keydown", function(e) {
  if ((!$("#inputBox").is(":focus")
       || $("#inputBox").val() == ""
       || $("#inputBox").val() == " ")
      && !$("#playlistNameBox").is(":focus")) {
    switch (e.code) {
      case "ArrowLeft":
      case "MediaTrackPrevious":
        e.preventDefault();
        backVideo();
        break;
      case "ArrowRight":
      case "MediaTrackNext":
        e.preventDefault();
        forwardVideo();
        break;
      case "Space":
      case "MediaPlayPause":
        e.preventDefault();
        if ($("#inputBox").val() === " ") {
          $("#inputBox").val("");
        }
        if (videoPaused) {
          player.playVideo();
        }
        else {
          player.pauseVideo();
        }
        break;
    }
  }
  if ($("#inputBox").is(":focus")) {
    switch (e.code) {
      case "Backslash":
        e.preventDefault();
        if (e.key !== "|") {
          var query = $("#inputBox").val();
          query = query.replace("\\", "");
          if (query.slice(-2) === " l") {
            query = query + "yric";
          }
          quickSearch(query);
        }
        else {
          //added for | hotkey for popup (now search) thing requested
          hotkeySearchClose = true;
          toggleSearchClose();
          input(0);
        }
        break;
      //fixes having to double-hit enter when using autocomplete value
      case "Enter":
        e.preventDefault();
        input(0);
    }
  }
  if (!$("#inputBox").is(":focus") && !$("#playlistNameBox").is(":focus")) {
    switch (e.code) {
      case "KeyR":
        e.preventDefault();
        playlistFeatures.autoplay();
        break;
      case "KeyZ":
        e.preventDefault();
        toggleZen();
        break;
      case "KeyV":
        e.preventDefault();
        toggleSideBySide();
        break;
    }
  }
});

$("#youtubeContainer").click(function() {
  if (stationRemote) {
    if ($("#remotePauseIcon").hasClass("fa-play")) {
      $("#remotePauseIcon").removeClass("fa-play").addClass("fa-pause");
      sendStation("videofunctionsplay");
    }
    else {
      $("#remotePauseIcon").removeClass("fa-pause").addClass("fa-play");
      sendStation("videofunctionspause");
    }
  }
});

// * These are the event listeners for stuff that's dragged and dropped

document.addEventListener("drop", function(event) {
  event.preventDefault();
  var data = event.dataTransfer.getData("URL");

  $("#inputBox").val(data);
  input(1);
  
  $("#dropShadow, #dropOverlay").css("display", "none");
});
document.addEventListener("dragover", function(event) {
  event.preventDefault();
  $("#dropShadow, #dropOverlay").css("display", "initial");
  //auto-remove drop shadow after 5 seconds, if user dragged over and decided against dropping
  setTimeout(function() {
    $("#dropShadow, #dropOverlay").css("display", "none");
  }, 5000);
});
