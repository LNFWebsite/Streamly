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

// Start Quick Search

function addSearchResult(name, id) {
  searchResultsNameStorage.push(name);
  $("#searchResultsWindow").append("<div class=\"searchResult\" onclick=\"loadSearchResult(this);\"><div class=\"left\"><p>" + name + "</p></div><div class=\"right\"><img src=\"https://i.ytimg.com/vi/" + id + "/default.jpg\" /></div></div>");
}

function loadSearchResult(element) {
  var iteration = $(".searchResult").index(element);
  var id = quickSearchVideos[iteration];
  console.log("i:" + iteration + ",id:" + id);

  //getVideoData function equivalent without reloading video names
  //videoId = id;
  //videoTime = 0;
  //videoName = searchResultsNameStorage[iteration];
  console.log("Loading search result");
  addVideo(searchResultsNameStorage[iteration], 0, id);

  if (searchClose) {
    toggleMenu("searchResults");
  }
}

// * This function loads the video for the Quick Search functionality

function quickSearch(query) {
  if (!inBoxSearch) {
    $("#inputBox").val("").attr("placeholder", loadingPlaceholder);
  }
  if (query !== "") {
    quickSearchQuery = query;
    var searchDataFrame = document.createElement("iframe");
    searchDataFrame.setAttribute("id", "searchDataFrame");
    searchDataFrame.setAttribute("src", "");
    document.getElementById("dataFramesContainer").appendChild(searchDataFrame);
    searchDataPlayer = new YT.Player('searchDataFrame', {
      events: {
        'onReady': onSearchDataPlayerReady,
        'onStateChange': onSearchDataPlayerStateChange
      }
    });
    searchDataFrame.setAttribute("src", "https://www.youtube.com/embed/?enablejsapi=1");
  }
  else if (quickSearchVideos[quickSearchVideosIteration] !== undefined &&
           quickSearchVideos[quickSearchVideosIteration] !== null &&
           quickSearchVideosIteration + 1 < quickSearchVideos.length) {
    quickSearchVideosIteration++;
    getVideoData(quickSearchVideos[quickSearchVideosIteration]);
  }
}

// * This function cues the search results for use in the next function

var searchDataPlayerErrors = 0;
function onSearchDataPlayerReady() {
  try {
    searchDataPlayer.cuePlaylist({listType: "search", list: quickSearchQuery});
  }
  catch(e) {
    searchDataPlayerErrors++;
    console.log(e);
    if (searchDataPlayerErrors <= 5) {
      try {
        searchDataPlayer.destroy();
      } catch(e) {};
      quickSearch(quickSearchQuery);
    }
  }
}

// * This function uses the search results to add the next video

function onSearchDataPlayerStateChange(event) {
  if (event.data === 5) {
    if (!inBoxSearch) {
      $("#inputBox").val("").attr("placeholder", placeholder).blur().focus();
    }
    quickSearchVideosIteration = 0;
    quickSearchVideos = searchDataPlayer.getPlaylist();
    var data = searchDataPlayer.getVideoUrl();
    var id = urlValidate(data)[1];

    getVideoName(id, function(name) {
      videoName = name;
      videoName = encodeURIComponent(videoName).replace(/%20/g, " ");
      videoTime = 0;
      searchDataPlayer.destroy();
      if (!inBoxSearch) {
        addVideo(videoName, videoTime, id);
      }
      else {
        $(".searchResult").remove();
        searchResultsIteration = 0;
        searchResultsNameStorage = [];
        addSearchResult(decodeURIComponent(videoName), id);
        quickSearch("");
        //as long as not open already (trying to search twice will close on second)
        if ($("#searchResultsWindow").css("display") !== "block") {
          toggleMenu("searchResults");
        }
      }
    });
  }
}

// End Quick Search
