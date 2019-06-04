![Streamly Logo](https://raw.githubusercontent.com/LNFWebsite/Streamly/master/res/img/logo/logo_streamly_color/logo_streamly_color_low_res.png)

Open-source, web-based, YouTube video queues.

Streamly on Desktop        | Streamly on Android
:-------------------------:|:-------------------------:
![](https://raw.githubusercontent.com/LNFWebsite/Streamly/master/examples/05302019/streamly.jpg)  |  ![](https://raw.githubusercontent.com/LNFWebsite/Streamly/master/examples/05302019/streamlymobile.jpg)

## What is Streamly?

Streamly is an open-source, web-based YouTube video queue.

Streamly can be used for a multitude of purposes, including queuing music videos, listening to lectures or audiobooks, or just simply creating a playlist of videos that can be accessed from any computer (or Android tablet/phone).

This differs from YouTube's normal playlist functionality by allowing you to manipulate the playlist while playing it (thus making it a queue).

Features:

- Puts you in charge of your playlist by saving all video information necessary to play (name, time, video id) with the playlist. To save your playlist, simply bookmark the open tab of Streamly or click "Save Playlist" to copy a link to your clipboard. Additionally, your playlists should be automatically saved within your browsing history.

- Runs independently from any server and requires no association with YouTube (API keys, etc...).
  
  <sub>Note: You may even use Streamly just stored on your computer, but likely YouTube will prevent many videos from playing. This is because those content creators have blocked their videos from being loaded on a non-website page. You may resolve this easily by placing Streamly on a file hosting service that allows you to access the file without downloading (ie. forking on GitHub), or your own web server.<sub>

- Works on all modern browsers (Firefox, Chrome, more...) as well as browsers on Android phones/tablets. (Latest Firefox is recommended on PC, Chrome is recommended on Android, IE is not supported)

### *[Subscribe to Streamly on Reddit for updates.](https://www.reddit.com/r/StreamlyReddit/)*

## How do I use Streamly?

Go to the website! <http://streamly.us.to> or <https://lnfwebsite.github.io/Streamly>
Or clone into your web server...

***Be sure to read the [Getting Started](https://github.com/LNFWebsite/Streamly/wiki/Getting-Started) page.***

## FAQ

- What makes this any different from a YouTube playlist?

  A normal YouTube playlist does not allow you to add videos while you are playing the list. It also does not allow you to do advanced playlist manipulation such as re-ordering while playing. Streamly exists more as a queue that you may mess with at any time while playing. This is why most other YouTube players exist as well.

- Will I lose videos that are removed from YouTube?

  No. The playlist will still contain all information on the videos which are broken or removed from YouTube. Streamly will skip the video and highlight it in red to let you know that you must find a replacement. I'm looking into a method that will automatically drop in replacement videos.

- Why is it so important not using a company key to access video metadata?

  This is important because it requires nothing special to operate Streamly. It is currently hosted on GitHub Pages, but may be cloned to any server and will still work the same. The safety of your playlist is achieved by knowing that you may easily run the script on your own without relying on me, GitHub, or anyone else.
  
- Does Streamly work on Mac/iPhone?

  Yes/Maybe. Streamly should work just fine on Mac; however, I'm not sure it will work on iOS devices. Back when Streamly started, iOS did not allow some functionalities of the YouTube iFrame API. I'm not sure whether they are compatible now as I don't have a newer iOS device to test on, so your mileage may vary. (If you have a newer iOS device, please let me know whether anything has changed)

Thanks for taking the time to read! I hope that you will find Streamly as useful as I have. Happy Streaming!

## What makes Streamly different?

Streamly is the first ever online YouTube video queue that prides itself in not using an API key.

## Why does that matter?

This matters greatly for reliability. Streamly incurs no operational cost here on Github, and requires nothing from YouTube or the original developer of it (me).

You, as either a user or a developer, may easily copy all of the Streamly files into your own server/repository and use Streamly out-of-the-box.

## How does Streamly do it?

Streamly essentially runs as a helper to the YouTube embed player. It retrieves public data about the video such as the title and time of the video readily accessible on the net. It then builds a playlist off of these values and plays each video in a native embed player.

The playlist you create is stored in the URL (or web address) of Streamly. This allows you to store it as a bookmark, create a short link from it by throwing it into a link shortener such as <https://tiny.cc> or <https://bit.ly>, throw it into a text file on your computer, or store it any way you like.

And, you don't have to worry about losing anything because Streamly requires nothing other than the playlist you create.

If you'd like to know why Streamly was made, head over to the [About](https://github.com/LNFWebsite/Streamly/wiki/About) page in the wiki!

[Dev-testing quick access link](https://raw.githack.com/LNFWebsite/Streamly/master/index.html)
[CDN purge for testing](https://purge.jsdelivr.net/LNFWebsite/Streamly@latest)

## License

```
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
```
