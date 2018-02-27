# Contributing Guide

## Introduction

Hi! Welcome to my project Streamly.

Streamly is open to any and all pull requests with very few rules as I myself am not formally trained in the languages which it is written in.

Even as a beginner, I'd like to lay out a couple of formats that I follow. Following these in your PR will help Streamly to be more organized.

All indents should be two-spaces, following how the code is written now.

Functions should be formatted:

```
function myFunction() {
  //code here, indented two spaces
}
```

Global variables, though heavily used now in the code, should be kept at a minimum. Some applications require them though, so by all means don't drive yourself crazy avoiding them.

OOP would be great, even though not used much in the current code.

Comments are used prior to every function, or when a conditional or variable is used in an unexpected manner.

In the case of most Javascript functions that have JQuery counterparts (mostly frontend stuff), the JQuery is used over the raw Javascript.

## Code Layout

The code is now split into multiple files, making it easier to develop and build upon what's already done.

All non-html code is located in the `res` folder, split by language:

```
res/js
res/css
res/etc...
```

The Javascript code is separated into frontend (`front`) code and backend (`back`) code.

```
res/js/front
res/js/back
```

Frontend code is code that is run after the interface has loaded. Major components are the `youtube.js` file which handles the main YouTube window of Streamly, and `events.js` which handles the various frontend inputs such as `onKeydown` events.

Backend code is code that is the core of Streamly, handling all various inputs for searching, loading data, handling the `videos` array, and manipulating the interface for complicated tasks such as shuffling. The bulk of Streamly's code exists in here as most interface manipulation is critical in Streamly. The largest components are `base.js` which handles the actual cycling of videos, and `playlistFront.js` & `playlistBack.js` which handle the core loading of user's playlists (`front` for code that manipulates the DOM for playlists and `back` for code that handles the advanced parts of playlist creation/loading).

Thanks for contributing!
