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

// * This function interprets the type of URL (or whether it isn't a URL)
// * It then specifies how to interpret this URL in the function below

function urlValidate(url) {
  let output = false;
  
  let youtubeRegex = /(?:v=|youtu\.be\/|youtube\..+\/embed\/)([^?&]+)/i;
  let youtubeListRegex = /list=([^?&]+)/i;
  let streamlyRegex = /.*#(.+)/i;
  
  let youtubeMatch = url.match(youtubeRegex);
  let youtubeListMatch = url.match(youtubeListRegex);
  if (youtubeMatch && youtubeListMatch) {
    output = [youtubeMatch[1], youtubeListMatch[1]];
    output = ["playlist", output];
  }
  else if (youtubeMatch) {
    output = youtubeMatch[1];
    output = ["youtube", output];
  }
  
  let streamlyMatch = url.match(streamlyRegex);
  if (streamlyMatch && streamlyMatch[1]) {
    output = streamlyMatch[1];
    output = ["streamly", output];
  }
  
  return output;
}

// * This function handles all user inputs
// * It has changed minimally throughout the history of Streamly
// * Its 'type' parameter specifies where the input is coming from (which I'm eventually going to change)
// * The playlist name box type number is 2

// * If a YouTube video URL load video to playlist, if a Streamly playlist append it to the current one, if none of the above load search

function input(type) {
  //if playlist input
  if (type === 2) {
    let playlistNameBox = $("#playlistNameBox").val();
    $("#inputBox").focus();
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
    let inputBox = $("#inputBox").val();
    if (inputBox !== "") {
      let isUrl = urlValidate(inputBox);
      let option = inputBox.match(/^-option (.+?)( .+?)?$/i);

      //let ua = navigator.userAgent.toLowerCase();
      //let isAndroid = ua.indexOf("android") > -1;

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
          case "radio":
            autoplayListOverride = true;
            break;
          default:
            alert("Sorry, but that option does not exist\n\nCheck with the list of Streamly options on GitHub");
        }
        $("#inputBox").val("").attr("placeholder", placeholder);
      }
      else if (isUrl) {
        if (isUrl[0] === "youtube") {
          inputBox = isUrl[1];
          getVideoData(inputBox);
          $("#inputBox").val("").attr("placeholder", loadingPlaceholder);
          /***
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
          ***/
        }
        else if (isUrl[0] === "streamly") {
          appendPlaylist(isUrl[1]);
          $("#inputBox").val("").attr("placeholder", placeholder);
        }
        else if (isUrl[0] === "playlist") {
          //turn on pause so that getVideoData doesn't try to play each video while loop-loading
          videoPaused = true;
          if (playlistAutoplay) {
            playlistFeatures.autoplay();
          }
          autoplayList = isUrl[1];
          playlistFeatures.autoplay();
          $("#inputBox").val("").attr("placeholder", placeholder);
        }
      }
      else if (inputBox.indexOf("\\") === -1) {
        if (inputBox.slice(-2) === " l") {
          inputBox = inputBox + "yric";
        }
        /***
        popup = window.open("https://www.youtube.com/results?search_query=" + inputBox.replace(/ /g, "+"), "YouTube", "height=500,width=800");
        dropOverlay.open();

        function checkIfClosed() {
            if (popup.closed) {
              dropOverlay.close();
              clearInterval(checkIfClosedTimer);
            }
        }
        let checkIfClosedTimer = setInterval(checkIfClosed, 500);
        ***/
        inBoxSearch = true;
        quickSearch(inputBox);
        //$("#inputBox").val("").attr("placeholder", loadingPlaceholder).blur();
        $("#inputBox").blur().focus();
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
