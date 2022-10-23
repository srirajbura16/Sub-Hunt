import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Component() {
  const [subscriptions, setSubscriptions] = useState([]);
  const { data: session } = useSession();
  let searchText;

  if (!session) {
    return (
      <>
        Not signed in <br />
        <button onClick={() => signIn('google')}>Sign in with google</button>
      </>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    searchText = e.target.searchText.value;
    const response = await fetch('/api/getSubscriptions');
    const subscriptions = await response.json();
    console.log(subscriptions);
    setSubscriptions(subscriptions);
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
          <input
            type="text"
            name="searchText"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="twitter"
            required
          />
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Search
        </button>
      </form>

      {subscriptions ? (
        <div>
          {subscriptions.map((sub, i) => {
            const { title, links } = sub;
            return (
              <div key={i}>
                <div>{title}</div>
                <ul>
                  {links.map((link, ind) => {
                    return <li key={ind}>{link.url}</li>;
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      ) : (
        ''
      )}
    </>
  );
}
// on submit
// get inputtext from input and get subscriptions links
// search inputtext in links and filter array
// rendern based on input links
