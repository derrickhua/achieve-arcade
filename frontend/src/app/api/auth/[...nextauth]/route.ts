import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from 'axios';
import { refreshAccessToken } from '../../../../lib/user';

const authHandler = NextAuth({
  providers: [
    CredentialsProvider({
      id: 'login',
      name: 'Login',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        try {
          const response = await axios.post("http://localhost:8000/api/users/login", credentials, {
            headers: {
              "Content-Type": "application/json"
            },
            withCredentials: true
          });

          const user = response.data;
          if (response.status === 200 && user.accessToken) {
            return {
              ...user,
              userId: user.userId,
              accessTokenExpires: user.accessTokenExpires,
              refreshToken: user.refreshToken
            };
          } else {
            throw new Error(user.error || "Login failed");
          }
        } catch (error: any) {
          if (error.response) {
            throw new Error(error.response.data.error || "Login failed");
          } else {
            throw new Error("Login request failed");
          }
        }
      }
    }),
    CredentialsProvider({
      id: 'register',
      name: 'Register',
      credentials: {
        username: { label: "Username", type: "text" },
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        timezone: { label: "Timezone", type: "text" }
      },
      authorize: async (credentials) => {
        try {
          const response = await axios.post("http://localhost:8000/api/users/register", credentials, {
            headers: {
              "Content-Type": "application/json"
            },
            withCredentials: true
          });
          const user = response.data;
          if (response.status === 201 && user.accessToken) {
            return {
              ...user,
              userId: user.userId,
              accessTokenExpires: user.accessTokenExpires,
              refreshToken: user.refreshToken
            };
          } else {
            throw new Error(user.error || "Registration failed");
          }
        } catch (error: any) {
          if (error.response) {
            throw new Error(error.response.data.error || "Registration failed");
          } else {
            throw new Error("Registration request failed");
          }
        }
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, account, user }) => {
      // Initialize token at sign-in
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = user.accessTokenExpires;
        token.userId = user.userId;
      }

      // Refresh token if it has expired
      if (token.accessTokenExpires && Date.now() > token.accessTokenExpires) {
        const refreshedToken = await refreshAccessToken(token.refreshToken);
        if (refreshedToken.accessToken) {
          token.accessToken = refreshedToken.accessToken;
          token.accessTokenExpires = refreshedToken.accessTokenExpires;
        } else {
          token.error = "Refresh failed";
        }
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.accessTokenExpires = token.accessTokenExpires;
      session.userId = token.userId;
      return session;
    }
  },
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXT_PUBLIC_JWT_SECRET,
  },
});

export const GET = async (req: any, res: any) => authHandler(req, res);
export const POST = async (req: any, res: any) => authHandler(req, res);
