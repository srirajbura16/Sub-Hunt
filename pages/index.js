import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import GoogleButton from "react-google-button";

export default function Component() {
  const [subscriptions, setSubscriptions] = useState([]); //for caching
  const [loading, setLoading] = useState(false);
  const [resultError, setResultError] = useState(false);
  const { data: session } = useSession();
  let searchText;

  const submit = async (e) => {
    setResultError(false);
    setSubscriptions([]);
    setLoading(true);
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

    setLoading(false);
    console.log(subscriptionsWithReleventLinks, "SUBSCRIPTIONS RELEVENT LINKS");
    setSubscriptions(subscriptionsWithReleventLinks);
    setResultError(true);
  };

  return (
    <div className="">
      <div className="p-4 flex justify-end">
        {!session ? (
          <div className="">
            <GoogleButton
              onClick={() => {
                signIn("google");
              }}
              type="dark"
            />
          </div>
        ) : (
          <button className="btn btn-error " onClick={() => signOut()}>
            Sign out
          </button>
        )}
      </div>
      {!session ? (
        <p className="text-[12px] text-end pr-4">
          When signing in, go to advanced {">"} Go to
          find-youtube-creators.vercel.app (unsafe)
          <br />
          <br />
          Make sure to allow permissions for reading your YouTube aswell
        </p>
      ) : (
        ""
      )}
      <div className="mt-8 lg:w-3/5 md:w-4/5 p-4 w-full mx-auto">
        <div>
          <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
            {session
              ? `Hello ${session.user.name}! let your search begin!`
              : "Find YouTube Creators"}
          </h1>
          <p>
            Find your YouTube subscriptions(creators) on other platforms. Simply
            search a keyword(e.g. twitter, github), and get back channels that
            include the keyword in their about page links.
          </p>
        </div>

        <form onSubmit={submit} className="mt-4">
          <div className="mb-2">
            <input
              type="text"
              name="searchText"
              placeholder="Type Keyword (twitter, github, etc)"
              className="input input-bordered w-full min-w-3/5 mb-2 "
              required
            />{" "}
            {session ? (
              <button
                type="submit"
                className="btn btn-primary btn-block min-w-3/5"
              >
                Search
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary btn-block min-w-3/5"
                disabled
              >
                Sign In to search
              </button>
            )}
          </div>
        </form>

        {loading ? "Loading..." : ""}
        {resultError && subscriptions.length === 0 ? (
          <div className="text-center mt-8">
            No results found. Try searching for popular sites.
          </div>
        ) : (
          ""
        )}
        {subscriptions.length > 0 ? (
          <div>
            <div class="fflex flex-wrap -m-4 mt-6">
              {subscriptions.map((sub, i) => {
                const { title, links, relevantLinks } = sub;

                return (
                  <div class=" p-4 md:text-left text-center" key={i}>
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
                              <a class="mt-3 text-blue-700 hover:text-red-800 inline-flex items-center underline">
                                {renderLink}
                              </a>
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
    </div>
  );
}
// on submit
// get inputtext from input and get subscriptions links
// filter subs based on serchText
//sort links based on searchText inot relevant links array
