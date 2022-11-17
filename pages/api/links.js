const cheerio = require("cheerio");

export default async function handler(req, res) {
  //return json of channel links based on channelID

  const response = await fetch(
    `https://youtube.com/channel/UCbRP3c757lWg9M-U7TyEkXA/about`
  );
  const htmlString = await response.text();
  const $ = cheerio.load(htmlString);
  //   console.log($);
  //   const searchContext = `a[class='ytd-channel-about-metadata-renderer']`;
  //   const searchContext = `a[class='ytd-channel-about-metadata-renderer']`;

  //   // const followerCountString = $(searchContext).text().match(/[0-9]/gi).join("");
  //   const links = $(searchContext).text();
  //   console.log(links, "LINKSLSINK");

  //   return { user: username, followerCount: Number(followerCountString) };

  //return [{title: atagtext, links: []}, ...]

  res.status(200).json({ html: htmlString });
}
