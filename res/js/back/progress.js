// * This function provides a mainframe timer for use in videoProgress
// * It used to be used for video change timing in Streamly w/o YouTube API

function Timer(callback, delay) {
  var id, started, remaining = delay, running;
  this.resume = function() {
    running = true;
    started = new Date();
    id = window.setTimeout(callback, remaining);
  }
  this.pause = function() {
    running = false;
    window.clearTimeout(id);
    remaining -= new Date() - started;
  }
  this.getTimeLeft = function() {
    if (running) {
      this.pause();
      this.resume();
    }
    return remaining;
  }
  this.getStateRunning = function() {
    return running;
  }
  this.resume();
}

// * This function converts milliseconds to "0:00" format
// * It is used primarily in the videoProgress timer

function msConversion(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return (seconds == 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
}

// * This function resets timers
// * It is primarily used for the progress bar and video time elements

function resetTimer(which) {
  if (typeof which !== "undefined") {
    if (which != 0) {
      which.pause();
    }
    which = 0;
  }
}

// * This object manipulates existing timers
// * It was primarily used in video timing before the YouTube API, but is also used in the progress bar

var ActionTimers = function() {
  this.pause = function() {
    progressTimer.pause();
  }
  this.resume = function() {
    progressTimer.resume();
  }
  this.clear = function() {
    resetTimer(progressTimer);
    $("#progress").css("width", "0%");
    $("#currentTime").text("0:00");
    $("#videoTime").text("0:00");
  }
}
var actionTimers = new ActionTimers();

// * This function updates the video progress bar with new data
// * It is run on an interval, using the YouTube API for video timing

function videoProgress() {
  if (videos[videoIteration] !== undefined && videos[videoIteration] !== null) {
    //initial load
    var time = videos[videoIteration][1];
    var currentTime = Math.round(player.getCurrentTime());
    var currentPercent = (currentTime / time) * 100;
    $("#videoTime").text(msConversion(time * 1000));
    $("#progress").css("width", currentPercent + "%");
    var currentTimeFormatted = msConversion(currentTime * 1000);
    if (currentTimeFormatted !== "NaN:NaN") {
      $("#currentTime").text(currentTimeFormatted);
    }
    //loop load
    function progressLoop() {
      currentTime = Math.round(player.getCurrentTime());
      currentPercent = (currentTime / time) * 100;
      progressTimer = new Timer(function() {
        $("#progress").css("width", currentPercent + "%");
        currentTimeFormatted = msConversion(currentTime * 1000);
        if (currentTimeFormatted !== "NaN:NaN") {
          $("#currentTime").text(currentTimeFormatted);
        }
        if (currentTime < time) {
          progressLoop();
        }
      }, 500);
    }
    progressLoop();
  }
}
