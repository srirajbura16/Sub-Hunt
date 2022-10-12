import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function ChannelLinks({ title, description, channelId }) {
  const { isLoading, isError, data, error } = useQuery(
    [`${channelId}`],
    async () => {
      const response = await fetch(
        `https://yt.lemnoslife.com/channels?part=about&id=${channelId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const externalLinks = await response.json();
      return externalLinks.items[0].about.links;
    }
  );
  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  console.log(data);
  return (
    <div>
      <h3>
        <Link href={`https://www.youtube.com/channel/${channelId}`}>
          {title}
        </Link>
      </h3>
      <blockquote>{description}</blockquote>
      <ul>
        {data.length > 0
          ? data.map((link) => (
              <li>
                {link.title} -{" "}
                <Link href={link.url}>
                  <a>{link.url}</a>
                </Link>
              </li>
            ))
          : "No links in this channel :("}
      </ul>
    </div>
  );
}
