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
            }
          });
          
          const user = response.data;
          
          if (response.status === 200 && user.accessToken) {
            return user;
          } else {
            throw new Error(user.error || "Login failed");
          }
        } catch (error) {
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
        timezone: { label: "Timezone", type: "text" }, 
      },
      authorize: async (credentials) => {
          try {
            const response = await axios.post("http://localhost:8000/api/users/register", credentials, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const user = response.data;
            
            if (response.status === 201 && user.accessToken) {
                // Ensure that the correct status code and presence of an accessToken are checked
                return user;
            } else {
                // Log for debugging
                console.error('Registration failed with status:', response.status, 'and message:', user.error);
                throw new Error(user.error || "Registration failed");
            }
        } catch (error) {
            // Handle errors more gracefully
            if (error.response) {
                console.error('Error in registration:', error.response.data);
                throw new Error(error.response.data.error || "Registration failed");
            } else {
                console.error('Network or other error:', error.message);
                throw new Error("Registration request failed");
            }
        }
      }
    })
  ],
callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      
      if (Date.now() / 1000 > token.accessTokenExpires) {
        const refreshedToken = await refreshAccessToken(token.refreshToken); // Pass only the refresh token
            
        if (refreshedToken.accessToken) {
          token.accessToken = refreshedToken.accessToken;
          token.accessTokenExpires = Date.now() + refreshedToken.expiresIn * 1000;
        }
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.accessToken = token.accessToken;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.JWT_SECRET,
  },
});

export const GET = async (req, res) => authHandler(req, res);
export const POST = async (req, res) => authHandler(req, res);