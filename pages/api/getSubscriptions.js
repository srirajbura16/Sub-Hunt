import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  const token = await getToken({ req, secret });

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

  const response = await data.json();

  console.log(response);

  let subscriptions = [];
  //
  response.items.map((sub) => {
    subscriptions.push({
      title: sub.snippet.title,
      description: sub.snippet.description,
      channelId: sub.snippet.resourceId.channelId,
    });
  });

  res.status(200).json(subscriptions);
}
