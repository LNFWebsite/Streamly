// * This function loads the video name
// * Updated video data capture method because of deprecation of player.getVideoData() in API (11/15/2017)

function getVideoName(id, callback) {
  var url = "https://www.youtube.com/watch?v=" + id;
  var get = {
    url: url
  };

  $.ajax({
    dataType: "json",
    url: "https://noembed.com/embed",
    data: get,
    success: function(result) {
      callback(result.title);
    }
  });
}

// * This function utilizes function above to add videos with applicable data
// * It used to handle data gathering on it's own, but stands as a wrapper to the async ajax above

function getVideoData(id) {
  videoId = id;
  videoTime = 0;

  getVideoName(id, function(name) {
    videoName = name;
    videoName = encodeURIComponent(videoName).replace(/%20/g, " ");

    if (!inBoxSearch) {
      $("#inputBox").val("").attr("placeholder", placeholder);
      addVideo(videoName, videoTime, videoId);
    }
    else {
      addSearchResult(decodeURIComponent(videoName), id);
      searchResultsIteration++;
      if (searchResultsIteration < quickSearchVideos.length - 1) {
        quickSearch("");
      }
      else {
        inBoxSearch = false;
      }
    }
  });
}

// * This function sets the video time on video play
// * It is handled this way since YouTube does not set player.getDuration() until play. Screw you YouTube.

function setVideoTime() {
  if (videos[videoIteration][1] === 0) {
    var name = videos[videoIteration][0];
    var time = player.getDuration();
    time = Math.round(time);
    var printTime = msConversion(time * 1000);

    videos[videoIteration][1] = time;
    removeVideoFromList(videoIteration, false);
    addVideoToList(name, printTime, videoIteration, false);
    restoreHighlight(videoIteration);
    setPlaylist();
  }
}
