# Streamly
YouTube HTML5 playlists, extremely simple.

## How do I use Streamly?

Go to our website! <http://streamly.us.to>

Or clone us into your web server...

## What is Streamly?

Streamly is a YouTube video player that runs entirely in your browser.

That means that it builds upon YouTube's normal playlist features by allowing you to manipulate playlists on the fly while playing them.

If you've been burnt by losing your playlists to shifty developers that promise the safety of your data, you've found the right project. Instead of storing your playlists in a huge databank like other projects, Streamly lets you store your playlist yourself in the form of a simple hyperlink. When you want to access your playlist, just go to that link! It's that simple.

All of the data needed to play the playlist is in the link. That means that nothing else is requested, and the whole playlist may be easily stored with a link shortener, a bookmark on your browser, or even in a text file on your computer.

Our motto is reliability which is why we do not use any external API's to manipulate YouTube's native HTML5 video frame, and we let you store the entirety of your playlist on your own.

This essentially means that Streamly is not a 'service' which ties into YouTube, but is rather a 'script' that runs in your browser, accessing only what is available to the general public on the web.

Streamly can be used for a multitude of purposes, including queuing music videos, listening to lectures or audiobooks, or just simply creating a playlist of videos that can be accessed from any computer.

For any questions or comments, please leave an [issue](https://github.com/LNFWebsite/Streamly/issues).

## What makes Streamly different?

Streamly is the first ever YouTube video player that prides itself in not using a single proprietary API! This essentially means that Streamly runs entirely in your browser and only accesses what is publicly available to anyone on the internet.

## Why does that matter?

In the cases of other YouTube player projects that use a company key to access YouTube content, the product has been proven to be short-lived in that it is hard to upkeep with changing standards in the often-complicated world of specifications given by YouTube for doing simple tasks.

I have found it long overdue to find a project that, unlike a service, does not store any information of its own nor unnecessarily requires private parties to collect data from.

## So... How does Streamly do it?

Streamly essentially runs as a helper to the YouTube embed player. It retrieves public data about the video such as the title and time of the video readily accessible on the net. It then builds a playlist off of these values and plays each video in a native embed player.

Following our policy of not using proprietary systems or storing any data on our own, the playlist you create is stored in the URL (or web address) of Streamly. This allows you to store it as a bookmark, create a short link from it by throwing it into a link shortener such as <https://tiny.cc> or <https://bit.ly>, throw it into a text file on your computer, or hand copy it down to a piece of paper (nuts but I've tried it before).

And, you don't have to worry about losing anything because Streamly requires nothing other than the playlist you create.

## No, really... How does Streamly work?

*Since you asked for the geeky stuff...*

Streamly gets its video metadata by using the [YQL Console](https://developer.yahoo.com/yql/console/) developed by Yahoo to parse YouTube for the video's name and length. There is no interaction between Streamly and YouTube in this step.

Pausing videos is operated using an external div. Because of the [Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy) of Javascript, Streamly is unable to verify when or if you paused the video, and is unable to pause it for you. For this reason, there is an invisible div in front of the YouTube frame to pause the timer that operates the playlist.

Going from one video to another is controlled by cycling through a two-dimensional Javascript array containing the video's title, URL, and length (in seconds) for each in the playlist.

Saving playlists is done by creating a [JSON](https://json.org) string of the object containing video properties, then encoding it into [Base64](https://en.wikipedia.org/wiki/Base64), and finally running that into the hash parameter of the URL.

## License

Streamly is licensed under the MIT license (MIT).
