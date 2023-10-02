# Sub Hunt

Find your YouTube subscriptions(creators) on other platforms. Simply search a keyword(e.g. twitter, github), and get back channels that include the keyword in their about me links.

![gif](/public/app_gif.webm)

### Tech Stack

- **YouTube API** is needed to get your subscriptions. It dosen't provide the external links a channel has setup in their about section, so a thrid part API is being to used to extract the links. (Your data is **NOT** given to any third parties, only the channel Id of your subscription channels is given, which is public data) The third party API in use: [YouTube-operational-API](https://github.com/Benjamin-Loison/YouTube-operational-API)

### Getting Started

```bash
npm run dev
```
