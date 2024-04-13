import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from 'axios';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        try {
          const { data } = await axios.post('http://localhost:8000/api/users/login', {
            email: credentials.email,
            password: credentials.password
          });

          if (data.token) {
            return { email: credentials.email, token: data.token };
          } else {
            return null; 
          }
        } catch (error) {
            console.error('Login failed:', error.response.data.error);
            throw new Error(error.response.data.error || "Login failed");
  
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  jwt:{
    secret: 'HELLOMYNAMEISDERRICK'
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.accessToken = user.token;
      }
      return token;
    },
    session: async ({ session, token }) => {
      // Attach the access token to the session object
      session.accessToken = token.accessToken;
      return session;
    }
  },
  // Define other NextAuth configurations as required
});

export { handler as GET, handler as POST };
