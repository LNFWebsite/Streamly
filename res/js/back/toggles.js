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

// * This is the Zen mode function that moves and hides elements

function toggleZen() {
  if (zenMode) {
    zenMode = false;
    $("header, #forkmeImage").removeClass("slideOutUp").addClass("slideInDown");
    $("footer").removeClass("slideOutDown").addClass("slideInUp");
    $("#links").off().css("display", "block").removeClass("fadeOut").addClass("fadeIn");
    $("#zenModeToggle").prop("checked", false);
  }
  else {
    zenMode = true;
    $("header, #forkmeImage").removeClass("slideInDown").addClass("slideOutUp");
    $("footer").removeClass("slideInUp").addClass("slideOutDown");
    $("#links").removeClass("fadeIn").addClass("fadeOut");
    $("#links").on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
      $(this).css("display", "none");
    });
    $("#zenModeToggle").prop("checked", true);
  }
}

function toggleSideBySide() {
  function changeSBS(which, add) {
    var className = which.replace("#", "");
    if (add) {
      $(which).addClass(className + "SBS");
    }
    else {
      $(which).removeClass(className + "SBS");
    }
  }
  var sbsElements = [
    "#main",
    "#playlistInterface",
    "#youtubeContainer",
    "#currentVideoTiming",
    "#progressContainer",
    "#settings",
    "#previousVideo",
    "#nextVideo",
    "footer"
  ];
  if (sideBySide) {
    sideBySide = false;
    sbsElements.forEach(function(element) {
      changeSBS(element, false);
    });
    $("#sideBySideToggle").prop("checked", false);
  }
  else {
    sideBySide = true;
    sbsElements.forEach(function(element) {
      changeSBS(element, true);
    });
    $("#sideBySideToggle").prop("checked", true);
  }
}

// * This is the function that is called for toggling the pop-up close user preference

function toggleSearchClose() {
  if (!searchClose) {
    searchClose = true;
  }
  else {
    searchClose = false;
  }
}

function toggleMenu(which) {
  var menu = "#" + which + "Window";
  var shadow = "#" + which + "Shadow";
  if ($(menu).css("display") !== "none") {
    state = "none";
  }
  else {
    state = "block";
  }
  $(menu).css("display", state);
  $(shadow).css("display", state);

  if (which === "searchResults" && state === "none") {
    $("#inputBox").val("").focus();
    if (hotkeySearchClose) {
      hotkeySearchClose = false;
      toggleSearchClose();
    }
  }
}

// * This object loads the drop overlay over Streamly
// * It is used primarily for when the settings window is toggled and when drag&drop searching is activated

var DropOverlay = function() {
  this.open = function() {
    $("#settingsShadow").css("display", "block");
    $("#dropOverlay").css("display", "block");
  }
  this.close = function() {
    $("#settingsShadow").css("display", "none");
    $("#dropOverlay").css("display", "none");
  }
}
var dropOverlay = new DropOverlay();
