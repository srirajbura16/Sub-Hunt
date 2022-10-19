import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <>
        Not signed in <br />
        <button onClick={() => signIn("google")}>Sign in with google</button>
      </>
    );
  }

  return (
    <>
      <div>
        Signed in as {session.user.name} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </div>
      <br />

      <div class="mb-6">
        <label
          for="confirm_password"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Confirm password
        </label>
        <input
          type="text"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="twitter"
          required
        />
      </div>
    </>
  );
}
