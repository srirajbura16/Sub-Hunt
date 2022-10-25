import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,

      authorization: {
        url: 'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
        params: {
          scope:
            'openid profile https://www.googleapis.com/auth/youtube.readonly',
        },
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  debug: true,
  session: {
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    // async session({ session, token, user }) {
    //   session.user.id = token.id;
    //   session.accessToken = token.accessToken;
    //   return session;
    // },

    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
};
export default NextAuth(authOptions);
