# Streamly
Open-source, web-based, YouTube video queues.

Streamly on Desktop        | Streamly on Android
:-------------------------:|:-------------------------:
![](https://raw.githubusercontent.com/LNFWebsite/Streamly/master/examples/streamly.jpg)  |  ![](https://raw.githubusercontent.com/LNFWebsite/Streamly/master/examples/streamlymobile.jpg)

## Quick Summary

Streamly is an open-source web-based YouTube video queue.

Streamly can be used for a multitude of purposes, including queuing music videos, listening to lectures or audiobooks, or just simply creating a playlist of videos that can be accessed from any computer (or Android tablet/phone).

This differs from YouTube's normal playlist functionality by allowing you to manipulate the playlist while playing it (thus making it a queue).

Features:

- Puts you in charge of your playlist by saving all video information necessarry to play (name, time, video_id) with the playlist. To save your playlist, simply bookmark the open tab of Streamly or click "Save Playlist" to copy a link to your clipboard.

- Runs independently from any server and requires no association with YouTube (API keys, etc...).
  
  <sub>Note: You may even use Streamly just stored on your computer, but likely YouTube will give you an error stating that the video creator did not allow the video to play on this site. The same will occur if you try to open a YouTube embed on your computer, as they don't recognize the `file://` site location as a valid website. You may resolve this easily by placing Streamly on a file hosting service that allows you to access the file without downloading (ie. forking on GitHub).<sub>

- Works on all <u>modern</u> browsers (Chrome, Firefox, more...) as well as browsers on Android phones/tablets. (Chrome is recommended, IE is not supported)

### *[Subscribe to Streamly on Reddit for updates!](https://www.reddit.com/r/StreamlyReddit/)*

## How do I use Streamly?

Go to the website! <http://streamly.us.to> or <https://lnfwebsite.github.io/Streamly>
Or clone into your web server...

***Be sure to read the [Getting Started](https://github.com/LNFWebsite/Streamly/wiki/Getting-Started) page if you're... well... just getting started...***

## What is Streamly? (In detail)

Streamly is a YouTube video queue that runs entirely in your browser.

That means that it builds upon YouTube's normal playlist features by allowing you to manipulate playlists on the fly while playing them.

If you've been burnt by losing your playlists to projects that promise the safety of your data, you've found the right solution. Instead of locking you into storing your playlists in a huge databank like other projects (or even YouTube themselves), Streamly lets you store your playlist on your own in the form of a simple hyperlink. When you want to access your playlist, just go to that link! It's that simple.

All of the data needed to play the playlist is in the link. That means that no other video information is requested, and the whole playlist may be easily stored with a link shortener, a bookmark on your browser, or even in a text file on your computer.

Streamly's motto is reliability which is why we do not use any API keys to manipulate YouTube's native HTML5 video frame, and we let you store the entirety of your playlist on your own.

This essentially means that Streamly is not a 'service' which ties into YouTube, but is rather a 'script' that runs in your browser, accessing only what is available to the general public on the web.

For any questions or comments, please leave an [issue](https://github.com/LNFWebsite/Streamly/issues).

## What makes Streamly different?

Streamly is the first ever online YouTube video queue that prides itself in not using a single API key! This essentially means that Streamly runs entirely in your browser and only accesses what is publicly available to anyone on the internet.

## Why does that matter?

This matters greatly for reliability. Streamly incurs no operational cost here on Github, and requires nothing from YouTube or the original developer of it (me).

You, as either a user or a developer, may easily copy all of the Streamly files into your own server/repository and use Streamly out-of-the-box.

Additionally, in the cases of other YouTube player projects that use a company key to access YouTube content, the product has been proven to be short-lived in that it is hard to upkeep with changing standards in the often-complicated world of specifications given by YouTube for doing simple tasks.

I have found it long overdue to find a project that, unlike a service, does not store any information of its own nor unnecessarily requires private parties to collect data from.

## So... How does Streamly do it?

Streamly essentially runs as a helper to the YouTube embed player. It retrieves public data about the video such as the title and time of the video readily accessible on the net. It then builds a playlist off of these values and plays each video in a native embed player.

Following our policy of not using proprietary keys or storing any data on our own, the playlist you create is stored in the URL (or web address) of Streamly. This allows you to store it as a bookmark, create a short link from it by throwing it into a link shortener such as <https://tiny.cc> or <https://bit.ly>, throw it into a text file on your computer, or hand copy it down to a piece of paper (nuts but I've tried it before).

And, you don't have to worry about losing anything because Streamly requires nothing other than the playlist you create.

## No, really... How does Streamly work?

*Since you asked for the geeky stuff...*

Streamly gets its video metadata and timing information through the [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference) which both feeds the basic data needed for the playlist, and monitors events from the YouTube embed frame. This API does not require an API key and may be operated by anyone. From Streamly's beginnings, it has used various unorthodox methods to monitor the user's interaction with the YouTube video player. This method of capture is an improvement in functionality, but is not a must-have, therefore, the [without-yt-api](https://github.com/LNFWebsite/Streamly/tree/without-yt-api) branch is maintained as an added backup for safety of your playlists.

Going from one video to another is controlled by cycling through a two-dimensional Javascript array containing the video's title, URL, and length (in seconds) for each in the playlist.

Saving playlists is done by creating a [JSON](https://json.org) string of the object containing video properties, then encoding it into [Base64](https://en.wikipedia.org/wiki/Base64), and finally running that into the hash parameter of the URL.

## License

Streamly is licensed under the MIT license (MIT).
