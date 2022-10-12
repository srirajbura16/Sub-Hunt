import React from "react";
import { useQuery } from "@tanstack/react-query";
import ChannelLinks from "../Components/ChannelLinks";

export default function Subscriptions() {
  const { isLoading, isError, data, error } = useQuery(
    ["subscriptions"],
    async () => {
      const response = await fetch("/api/getSubscriptions");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
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
      {data.map(({ title, description, channelId }, i) => (
        <ChannelLinks
          key={channelId}
          title={title}
          description={description}
          channelId={channelId}
        />
      ))}
    </div>
  );
}
