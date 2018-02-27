$("header, #forkmeImage").addClass("animated slideInDown");
$("footer").addClass("animated fadeIn");
$("#links").addClass("animated fadeIn");

$("#inputBox").autocomplete({
  delay: 100,
  source: function (request, response) {
    var suggestURL = "//suggestqueries.google.com/complete/search?hl=en&ds=yt&q=" + request.term + "&client=chrome";
    $.ajax({
      method: 'GET',
      dataType: 'jsonp',
      jsonpCallback: 'jsonCallback',
      url: suggestURL
    })
    .done(function(data){
      suggestions = data[1];
      if (suggestions.length > 10) {
        suggestions.length = 10;
      }
      for (var i = suggestions.length - 1; i > -1; i--) {
        if (suggestions[i].search(/htt(p|s):\/\//i) > -1) {
          suggestions.splice(i, 1);
        }
      }
      response(suggestions);
    });
  }
});
