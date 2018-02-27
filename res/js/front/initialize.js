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
