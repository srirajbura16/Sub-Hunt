import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function Component() {
  const [subscriptions, setSubscriptions] = useState([]);
  const { data: session } = useSession();
  let searchText;

  if (!session) {
    return (
      <>
        Not signed in <br />
        <button onClick={() => signIn("google")}>Sign in with google</button>
      </>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    searchText = e.target.searchText.value.trim().toLowerCase();
    const response = await fetch("/api/getSubscriptions");
    const data = await response.json();
    console.log(data);

    const subscriptionsWithReleventLinks = data.filter((sub) => {
      let relevantLinksIndex = [];
      sub.links.map((link, index) => {
        //check searchtext in channel links
        //populate relaventLinksIndex with exactly that
        //return true
        const searchTextExists =
          link["url"]?.toLowerCase().includes(searchText) ||
          link["title"]?.toLowerCase().includes(searchText);

        if (searchTextExists) {
          relevantLinksIndex.push(index);
        }
      });
      sub["relevantLinks"] = relevantLinksIndex;

      if (relevantLinksIndex.length > 0) {
        return true;
      }
      return false;
    });

    console.log(subscriptionsWithReleventLinks, "SUBSCRIPTIONS RELEVENT LINKS");
    setSubscriptions(subscriptionsWithReleventLinks);
  };

  return (
    <>
      <div>
        Signed in as {session.user.name} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </div>
      <br />

      <form onSubmit={submit}>
        <div className="mb-6">
          {/* <input
            type="text"
            name="searchText"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="twitter"
            required
          /> */}
          <input
            type="text"
            name="searchText"
            placeholder="Type Keyword of other sites"
            className="input input-bordered w-full max-w-lg"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {subscriptions.length > 0 ? (
        <div>
          {subscriptions.map((sub, i) => {
            const { title, links, relevantLinks } = sub;

            return (
              <div key={i}>
                <div>{title}</div>
                <ul>
                  {relevantLinks.map((RL, i) => {
                    return <li key={i}>{links[RL]["url"]}</li>;
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      ) : (
        ""
      )}
    </>
  );
}
// on submit
// get inputtext from input and get subscriptions links
// filter subs based on serchText
//sort links based on searchText inot relevant links array
