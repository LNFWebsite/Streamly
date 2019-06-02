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
    $("header, #forkme").removeClass("slideOutUp").addClass("slideInDown");
    $("footer").removeClass("slideOutDown").addClass("slideInUp");
    $("#links").off().css("display", "block").removeClass("fadeOut").addClass("fadeIn");
    $("#main").removeClass("zen");
    $("#zenModeToggle").prop("checked", false);
  }
  else {
    zenMode = true;
    $("header, #forkme").removeClass("slideInDown").addClass("slideOutUp");
    $("footer").removeClass("slideInUp").addClass("slideOutDown");
    $("#links").removeClass("fadeIn").addClass("fadeOut");
    $("#links").on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
      $(this).css("display", "none");
    });
    $("#main").addClass("zen");
    $("#zenModeToggle").prop("checked", true);
  }
}

function toggleSideBySide() {
  function changeSBS(which, add) {
    let className = which.replace("#", "").replace(".", "");
    if (add) {
      $(which).addClass(className + "SBS");
    }
    else {
      $(which).removeClass(className + "SBS");
    }
  }
  let sbsElements = [
    "#main",
    "#playlistInterface",
    "#youtubeContainer",
    "#currentVideoTiming",
    "#settings",
    "#previousVideo",
    "#nextVideo",
    ".videoImageContainer",
    ".videoNameContainer",
    ".videoImage",
    ".videoTime",
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
  let menu = "#" + which + "Window";
  let shadow = "#" + which + "Shadow";
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

let DropOverlay = function() {
  this.open = function() {
    $("#settingsShadow").css("display", "block");
    $("#dropOverlay").css("display", "block");
  }
  this.close = function() {
    $("#settingsShadow").css("display", "none");
    $("#dropOverlay").css("display", "none");
  }
}
let dropOverlay = new DropOverlay();

function toggleAutoplayListOverride() {
  if (autoplayListOverride) {
    autoplayListOverride = false;
    $("#autoplayListOverrideToggle").prop("checked", false);
  }
  else {
    autoplayListOverride = true;
    $("#autoplayListOverrideToggle").prop("checked", true);
  }
}
