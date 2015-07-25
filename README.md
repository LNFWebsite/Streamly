# Streamly
YouTube video streaming, extremely simple.

## What is Streamly?

Streamly is a client side YouTube video streaming page.

Our motto is simplicity which is why we do not use any external API's to manipulate YouTube's native HTML5 video frame.

Our goal is to create a simple way to consecutively play YouTube videos similar to YouTube's current playlist functionality with the difference of being able to add videos to the queue at any time.

For any questions or comments, please leave an Issue.

## How do I use Streamly?

Go to our website! <http://streamly.us.to>

Or clone us into your web server...

## How does Streamly work?

Streamly is written in Javascript. Every aspect of Streamly is controlled by the user (it does not and cannot get its information from anywhere else).

Pausing videos is operated by an external button. Going from one video to another is controlled by cycling through a Javascript object containing the user's original search, the video's URL, and the video's time.

Saving playlists is done by creating a [JSON](https://json.org) string of the object containing video properties, then encoding it into [Base64](https://en.wikipedia.org/wiki/Base64), and finally running that into the hash parameter of the URL.

## Why does Streamly require the video's length?

Due to the no-API nature of Streamly, it is a little different from other YouTube streamers. This means that it will not retrieve the video's length (needed for playlists). It also will not retrieve the exact name of the video you load.

But the good thing is that you control everything about the video you are playing! And there are no loose ties with YouTube's API...

## Why is there a pause button above the video?

Because of the [Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy) of Javascript, Streamly is unable to verify when or if you paused the video, and is unable to pause it for you. For this reason, there is a separate button to pause the timer that operates the playlist.

## License

Streamly is licensed under a modified version of the MIT license (MIT).
