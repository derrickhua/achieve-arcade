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
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`, credentials, {
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
          } catch (error) {
            if (error.response) {
              console.error("Login error response:", error.response.data);
              throw new Error(error.response.data.error || "Login failed");
            } else {
              console.error("Login request error:", error.message);
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
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/register`, credentials, {
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
          } catch (error) {
            if (error.response) {
              console.error("Registration error response:", error.response.data);
              throw new Error(error.response.data.error || "Registration failed");
            } else {
              console.error("Registration request error:", error.message);
              throw new Error("Registration request failed");
            }
          }
        }
      })
    ],
    callbacks: {
      jwt: async ({ token, account, user }) => {

        if (user) {
          token.accessToken = user.accessToken;
          token.refreshToken = user.refreshToken;
          token.accessTokenExpires = user.accessTokenExpires;
          token.userId = user.userId;
        }
    
        if (token.accessTokenExpires && Date.now() > token.accessTokenExpires) {
          const refreshedToken = await refreshAccessToken(token.refreshToken);
          if (refreshedToken.accessToken) {
            token.accessToken = refreshedToken.accessToken;
            token.accessTokenExpires = refreshedToken.accessTokenExpires;
          } else {
            console.error("Token refresh failed:", refreshedToken.error);
            throw new Error("Refresh failed"); // Throw an error
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

  export const GET = async (req, res) => authHandler(req, res);
  export const POST = async (req, res) => authHandler(req, res);
