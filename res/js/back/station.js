// * This function is for user identification in Streamly Station

function makeId() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i=0; i < 10; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

// Start Streamly Station

// * This function flashes the Streamly Station icon

function flashStationIcon() {
  $("#stationIcon").css("color", "red");
  setTimeout(function() {
    $("#stationIcon").css("color", "#00ff00");
  }, 300);
}

// * This function sends a command to the Streamly Station

function sendStation(what) {
  if (stationServer !== undefined && stationServer !== null) {
    if (!stationTxQuiet) {
      console.log("Station Tx: " + what);
      flashStationIcon();
      stationSocket.emit("msg", stationUserId + "," + what);
    }
    else {
      stationTxQuiet = false;
    }
  }
}

// * This function begins a connection with the Streamly Station and listens for commands

function loadStation() {
  stationSocket = io("http://" + stationServer);
  stationUserId = makeId();
  alert("Streamly Station \"" + stationServer + "\" connected!");

  $("#stationIcon").css("display", "initial");

  stationSocket.on("msg", function(msg) {
    console.log("Station Rx: " + msg);

    var msgData = msg.split(",");
    if (msgData[0] !== stationUserId) {
      stationTxQuiet = true;
      flashStationIcon();

      switch (msgData[1]) {
        case "addvideo":
          addVideo(msgData[2], msgData[3], msgData[4]);
          break;
        case "playerending":
          loopVideo();
          break;
        case "actionplayvideo":
          actionPlayVideo(+msgData[2]);
          break;
        case "actionremovevideo":
          actionRemoveVideo(+msgData[2]);
          break;
        case "forwardvideo":
          forwardVideo();
          break;
        case "backvideo":
          backVideo();
          break;
        case "videofunctionsplay":
          if (!stationRemote) {
            player.playVideo();
          }
          else {
            $("#remotePauseIcon").removeClass("fa-play").addClass("fa-pause");
          }
          break;
        case "videofunctionspause":
          if (!stationRemote) {
            player.pauseVideo();
          }
          else {
            $("#remotePauseIcon").removeClass("fa-pause").addClass("fa-play");
          }
          break;
        case "playlistfeaturesplaynext":
          playlistFeatures.playNext();
          break;
        case "playlistfeaturesrepeat":
          playlistFeatures.repeat();
          break;
        case "playlistfeaturesshuffle":
          playlistFeatures.shuffle();
          break;
        case "actionmovevideo":
          actionMoveVideo(+msgData[2], +msgData[3]);
          refreshVideoList();
          setPlaylist();
          makeSortable();
          videoPreviews();
          addAutoplayVideo();
          break;
        case "playlistnamechange":
          $("#playlistNameBox").val(msgData[2]);
          input(2);
      }
    }
  });
}

// * This function loads the Streamly Station client-side code and runs the loadStation function

function connectStation(server) {
  stationServer = server;
  $.ajax({
    url: "http://" + stationServer + "/socket.io/socket.io.js",
    dataType: "script",
    success: loadStation
  });
}

// * This function disconnects the station... duh.

function disconnectStation() {
  stationSocket.disconnect();
  $("#stationIcon").css("display", "none");
}

// * This function handles user input and runs connectStation on being called by user

var securityWarning = false;
function actionConnectStation() {
  var station = $("#connectStationBox").val();
  if (window.location.protocol === "https:" && securityWarning === false) {
    securityWarning = true;
    alert("Note: Due to security protections, scripts on secured pages with 'https://' cannot make unsecured connections. " +
          "Streamly Station runs without any onboard security, so this request will probably be blocked and you'll get a notification that the site requested unsecured scripts.\n\n" +
          "In order to use Streamly Station, either make an exception to 'Load unsafe scripts' or replace the 'https://' with 'http://' in the URL.");
  }
  connectStation(station);
}

// * This function blocks out the loading of videos when in Remote mode

function toggleRemote() {
  if (!stationRemote) {
    stationRemote = true;
    $("#remotePauseIcon").css("display", "block");
    $("#youtubeContainer").css("background", "black");
    $("#youtube").css("display", "none");
    $("#currentVideoTiming").css("opacity", "0");
  }
  else {
    stationRemote = false;
    $("#remotePauseIcon").css("display", "none");
    $("#youtubeContainer").css("background", "none");
    $("#youtube").css("display", "block");
    $("#currentVideoTiming").css("opacity", "1");
  }
}

// End Streamly Station
