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

// * These are global variables that are utilized in the rest of the script
// * They exist for data that must persist for the script to work

let background = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Veil_Nebula_-_NGC6960.jpg/1280px-Veil_Nebula_-_NGC6960.jpg";
let placeholder, loadingPlaceholder;

if ($(window).width() <= 600) {
  placeholder = "Search, Paste link...";
  loadingPlaceholder = "Loading...";
  background = "none";
}
else {
  placeholder = "Search, drag/drop or paste link to video/playlist...";
  loadingPlaceholder = "Loading video data from YouTube...";
  let c = cookie.get("background");
  if (c !== "") {
    background = "url(\"" + c + "\") no-repeat center center fixed";
  }
  else {
    background = "url(\"" + background + "\") no-repeat center center fixed";
  }
  $("body, #blurBackground").css("background-size", "cover");
}
$("#inputBox").attr("placeholder", placeholder);
$("body, #blurBackground").css("background", background);

let radioMessage = "Clicking on this will start <a href=\"https://github.com/LNFWebsite/Streamly/wiki/Getting-Started#streamly-radio\" target=\"_blank\">Streamly Radio</a> based on this video. Suggestions will not be loaded until you reach the end of the playlist unless you'd like to manually load them by hitting the 'R' key";

let faviconPause = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAMAAAANmfvwAAAA/1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD64ociAAAAVHRSTlMAAQIDBAUGBwgJCgsPEBIUFxgbHh8iIyUrMDU/QEdKS09QUlZbXF5fYWZpb3F1e4aJmJ6go6WmqrK0tb7Aw8XHyM/R09XX2drg4unr7e/x8/X3+ftnm6MTAAABGklEQVQ4jYXTx1YCQRBG4TvCYKO2iglzxJwVA5gFs4LA//7P4mLIM9PeZfV3Tm26oC+vf9BTYu7wrib93hzMDkSCoaOG2tX2B0PA21FvjbU+YR4UquB3i5GPsJDK6Y4YjBTSU7JNbqOFdNkSG3FCWghEqhFPfhIA7EmSatYYY9JXUsYYY0wmMOsAXlWS9EbLN9cH5B1gRi6icWDbTVaACzc5AcpuUgQqblL6nzwDJTcpAOducgxsuskSMOUmY4D37SKvAAS/tj5hrbWjBSlrrbU2G5BlAPyaYvtsXstyPJlvbuU6Tpy2BP5LtLjvOsrh1yjxmKIrvxgW+QS9rdZ7QXWRUP5upQO+csmwALzprXy5Uimd5SYj3+P7A3jQxmKOfWTQAAAAAElFTkSuQmCC";
let faviconPlay = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAMAAAANmfvwAAABDlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABxUYW9AAAAWXRSTlMAAQIDBAUGCAkRFBUZGhscHiAhJyorLzI0ODo7PUZMTlBVVldYWVtcXV5hZHB1foKDiIuPlZiboKKlpqirr7CytcDDyMrMzs/R09Xa3N7g4ubp7e/x9/n7/Ud7aO4AAAE3SURBVBgZlcFpOxtRAIbhZ8YgltBaopZEHanamtKgtYaSklJ0xPL+/z8iGedMZq5MPrhv3mlgslzZ2aksT/aTbfpQsYMpun24UMr5OGneN3XZ9EjoO1KGA5+Yd6pMxx5OVT1sY31STwUifqg3jaF8TWn/fdo+y1oFCv+UUqLtXpahxSs/KeGOlrwcQ2TwhxJGgWU5Bit/ptgSsCfHEJu9l7ULXMkxdPgbL4r8AR7kGJLmFQmBphxD0pQiTeCvHEPC/IMiV8C+HENs7LesX8CaHIOVqyr2FZiQY4j4K8/q+Ah4TVmGtplbJYQeLRuyvgAjp0pZp63/SW/Ogtx3pT0GRErqqYh1oh6OcIKGMl0GxHKXylAfJCHYV5effaQthEoJ5+jiL94odl3yyTRc3KrV67Wt4jDv8wr7Zt73xzlZAQAAAABJRU5ErkJggg==";

let popup;
let searchClose = false;
let hotkeySearchClose = false;

let videos = [];
let videoCounter = 0;
let videoIteration = 0;

let videoErrorIds = [];

let videosBeforeShuffle = [];
let addedVideosWhileShuffled = [];

let baseAutoplayVideoId = false;
let autoplayList = false;
//override autoplayList for entering YouTube Mix stations (not to load all of them)
let autoplayListOverride = false;
let autoplayVideos = [];
let autoplayVideoIteration = -1;
//block repeated tasks while autoplay is still loading
let autoplayLoading = false;

let quickSearchQuery;
let quickSearchVideos = [];
let quickSearchVideosIteration = 0;

let inBoxSearch = false;
let searchResultsIteration = 0;
let searchResultsNameStorage = [];

let stationServer;
let stationSocket;
let stationRemote = false;
let stationTxQuiet = false;
let stationUserId;

let zenMode = false;
let sideBySide = false;

let videoPaused;
//this is for addVideo knowing whether to loop to next video or not
let videoPlaying;
let backRestart;
let backRestartTimer;

let progressTimer;

let playlistPlayNext;
let playlistRepeat;
let playlistShuffle;
let playlistAutoplay;

let dataPlayer;
let radioDataPlayer;
let searchDataPlayer;
