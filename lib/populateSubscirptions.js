export default function populateSubscriptions(response, subscriptions) {
  response.items.map((sub) => {
    const channelId = sub.snippet.resourceId.channelId;
    const { title } = sub.snippet;

    subscriptions.push({
      channelId,
      title,
    });
  });
}
