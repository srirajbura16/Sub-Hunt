import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
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
    <div className="mt-8 lg:w-3/5 md:w-4/5 w-full mx-auto">
      <div>
        <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
          Hello {session.user.name}! let your search begin!
        </h1>
        {/* Signed in as {session.user.name} <br /> */}
        <button onClick={() => signOut()}>Sign out</button>
      </div>
      <br />

      <form onSubmit={submit}>
        <div className="mb-2">
          <input
            type="text"
            name="searchText"
            placeholder="Type Keyword of other sites"
            className="input input-bordered w-full mb-2 "
            required
          />
          <button type="submit" className="btn btn-primary btn-block">
            Search
          </button>
        </div>
      </form>

      {subscriptions.length > 0 ? (
        <div>
          <button className="btn btn-info btn-block">
            Open All Relevant Links in New Tabs
          </button>
          <div class="fflex flex-wrap -m-4 mt-6">
            {subscriptions.map((sub, i) => {
              const { title, links, relevantLinks } = sub;

              return (
                <div class="xl:w-1/3 md:w-1/2 p-4 flex flex-wrap" key={i}>
                  <h2 class="text-lg text-gray-900 font-medium title-font mb-2">
                    {title}
                  </h2>

                  <ul>
                    {relevantLinks.map((RL, i) => {
                      const renderLink = links[RL]["url"];
                      const renderLinkTitle = links[RL]["title"];
                      return (
                        <li key={i}>
                          <Link href={renderLink}>
                            <a>{renderLink}</a>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
// on submit
// get inputtext from input and get subscriptions links
// filter subs based on serchText
//sort links based on searchText inot relevant links array
