import { getToken } from "next-auth/jwt";
import populateSubscriptions from "../../lib/populateSubscirptions";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  const token = await getToken({ req, secret });
  let userSubscriptions = [];

  const data = await fetch(
    `https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet%2CcontentDetails&maxResults=50&mine=true&key=${process.env.GOOGLE_API}`,
    {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-type": "application/json;charset=UTF-8",
      },
    }
  );

  let NEXT_PAGE_TOKEN = "";

  const response = await data.json();
  populateSubscriptions(response, userSubscriptions);
  // console.log(all);

  if (response.nextPageToken) {
    NEXT_PAGE_TOKEN = response.nextPageToken;
  }

  // const NEXT_PAGE_TOKEN = (token) => (token ? true : false);

  while (NEXT_PAGE_TOKEN) {
    //call next page
    const data = await fetch(
      `https://youtube.googleapis.com/youtube/v3/subscriptions?pageToken=${NEXT_PAGE_TOKEN}&part=snippet%2CcontentDetails&maxResults=50&mine=true&key=${process.env.GOOGLE_API}`,
      {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-type": "application/json;charset=UTF-8",
        },
      }
    );
    const response = await data.json();
    //add subsciptions to USER_SUBSCRIPTIONSarray
    populateSubscriptions(response, userSubscriptions);

    // console.log(userSubscriptions, "FROM WHILE LOOP MF");

    //if NEXT_PAGE_TOKEN exists in current page {set NEXT_PAGE_TOKEN to the next page token}
    if (response.nextPageToken) {
      NEXT_PAGE_TOKEN = response.nextPageToken;
    } else {
      //else{set NEXT_PAGE_TOKEN to false}
      NEXT_PAGE_TOKEN = false;
    }
  }

  // console.log(userSubscriptions, "USER SUB");

  const subscriptions = await Promise.all(
    userSubscriptions.map(async (sub) => {
      const { title, channelId } = sub;

      const data = await fetch(
        `https://yt.lemnoslife.com/channels?part=about&id=${channelId}`
      );

      const response = await data.json();
      console.log(response, "FROM THIRD PARTY!!");
2
      return {
        title: title,
        links: response.items[0].about.links,
      };
    })
  );

  console.log(subscriptions, "ALL SUBSCRIPTIONS WITH TITLE AND LINKS");

  res.status(200).json(subscriptions);
  // res.status(200).json({ message: "Testing in terminal" });
}

//figure out how many request we need to make OR use while loop to check nextPageToken on each request.
// put initila and subsequent reqs in an array
//

//things: server side fetching vs client side fetchin?
//browser cache.
