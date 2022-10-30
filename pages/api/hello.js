// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getToken } from "next-auth/jwt";
const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  const token = await getToken({ req, secret });
  const data2 = await fetch(
    `https://youtube.googleapis.com/youtube/v3/subscriptions?pageToken=${`CDIQAA`}part=snippet%2CcontentDetails&maxResults=50&mine=true&key=${
      process.env.GOOGLE_API
    }`,
    {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-type": "application/json;charset=UTF-8",
      },
    }
  );
  const response2 = await data2.json();

  const { items1, ...all1 } = response2;

  console.log(all1);
  res.status(200).json({ name: "John Doe" });
}
