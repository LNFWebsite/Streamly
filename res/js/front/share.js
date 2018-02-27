new Clipboard("#saveButton");
function saveButton() {
  $("#saveButton").text("Playlist copied!");
  setTimeout(function() {
    resetSaveButton();
  }, 2000);
}

function resetSaveButton() {
  if ($(window).width() <= 600) {
    $("#saveButton").text("Save");
  }
  else {
    $("#saveButton").text("Save playlist");
  }
}
resetSaveButton();

function shareOnRedditAd() {
  var i=0;
  var text = document.getElementById('ad');
  text.style.color = 'grey';
  function flash() {
    i++;
    text.style.color = (text.style.color=='grey') ? 'lightblue':'grey';
    if (i == 11) {
      clearInterval(clr);
    }
  }
  var clr = setInterval(flash, 300);
}

function shareOnReddit() {
  var playlistName = $("#playlistNameBox").val();
  if (playlistName === "") {
    playlistName = $("#playlistNameBox").attr("placeholder");
  }
  if (window.location.hash.substr(1).length <= 10000) {
    window.open("https://www.reddit.com/r/StreamlyReddit/submit?resubmit=true&title=Playlist%20-%20" + playlistName + "&url=https://lnfwebsite.github.io/Streamly/%23" + window.location.hash.substr(1), "_blank");
  }
  else {
    alert("The playlist you are sharing is too long to automatically post, so please copy your Streamly Playlist URL and paste it into the open Reddit tab (you can copy by clicking the \"Save Playlist\" button).\n\nSorry for this inconvenience.");
    window.open("https://www.reddit.com/r/StreamlyReddit/submit?resubmit=true&title=Playlist%20-%20" + playlistName + "&url=%5BPaste+shortened+link+here%5D", "_blank");
  }
}
