var enterSearchMsg = "Search...";
var enterUrlMsg = "Paste URL Here...";
var enterTimeMsg = "Type length of video... (ex. 2:49)";

var search;
var url;
var time;

var videos = [];
var videoCounter = 0;

function msConversion(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function playVideo(number) {
  var embedUrl = videos[number]["url"].replace("/watch?v=", "/embed/") + "?autoplay=1";
  $("#youtube").attr("src", embedUrl);
}

function loopVideo(i) {
  playVideo(i);
  function loop() {
    setTimeout(function() {
      i++;
      playVideo(i);
      if (i < videoCounter) {
        loop();
      }
    }, videos[i]["time"] + 2000);
  }
  loop();
}

function input() {
  var inputBox = $("#inputBox");
  var youtube = $("#youtube");
  var videosTable = $("#videosTable");

  switch (inputBox.attr("placeholder")) {
    case enterSearchMsg:
      search = inputBox.val();
      var queryUrl = "https://www.youtube.com/results?search_query=" + search.replace(" ", "+");
      window.open(queryUrl);
      inputBox.val("").attr("placeholder", enterUrlMsg);
      break;
    case enterUrlMsg:
      url = inputBox.val();
      inputBox.val("").attr("placeholder", enterTimeMsg);
      break;
    case enterTimeMsg:
      time = inputBox.val();
      time = time.split(":");
      time = (+time[0]) * 60 + (+time[1]);
      time = time * 1000;

      videoCounter++;
      videos[videoCounter] = [];
      videos[videoCounter]["name"] = search;
      videos[videoCounter]["time"] = time;
      videos[videoCounter]["url"] = url;

      var printTime = msConversion(videos[videoCounter]["time"]);

      videosTable.append("<tr><td>" + videos[videoCounter]["name"] + "</td><td>" + printTime + "</td></tr>");
      
      if (videoCounter == 1) {
        loopVideo(videoCounter);
      }

      inputBox.val("").attr("placeholder", enterSearchMsg);
      break;
  }
}
