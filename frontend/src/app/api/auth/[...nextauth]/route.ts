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
                    withCredentials: true  // Ensures cookies are sent along with the request
                });
                
                const user = response.data;
                if (response.status === 200 && user.accessToken) {
                    return {
                        ...user,
                        userId: user.userId, // Include the user's ID
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
                    withCredentials: true  // Ensures cookies are sent along with the request
                });
                const user = response.data;
                console.log('user in signin register',user)
                if (response.status === 201 && user.accessToken) {
                    // Use accessTokenExpires directly provided by the backend
                    return {
                        ...user,
                        userId: user.userId, // Include the user's ID
                        accessTokenExpires: user.accessTokenExpires,
                        refreshToken: user.refreshToken 
                    };
                } else {
                    console.error('Registration failed with status:', response.status, 'and message:', user.error);
                    throw new Error(user.error || "Registration failed");
                }
            } catch (error: any) {
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
    jwt: async ({ token, account, user }) => {
      // Initialize token at sign-in
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = user.accessTokenExpires; 
        token.userId = user.userId; // Include userId in the token
    }
      // Refresh token if it has expired
      if (token.accessTokenExpires && Date.now() > token.accessTokenExpires) {
        const refreshedToken = await refreshAccessToken(token.refreshToken); // Use the existing refresh token to obtain a new one
        if (refreshedToken.accessToken) {
          token.accessToken = refreshedToken.accessToken;
          token.accessTokenExpires = refreshedToken.accessTokenExpires; // Update the expiration time
        } else {
          console.error("Failed to refresh token");
          token.error = "Refresh failed"; // Handle refresh failures
        }
      }
      return token;
    },
    session: async ({ session, token }) => {
      // Include the necessary token information in the session
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.accessTokenExpires = token.accessTokenExpires;
      session.userId = token.userId; // Ensure userId is included in the session

      return session;
    }
  },  
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.JWT_SECRET,
  },
});

export const GET = async (req:any, res:any) => authHandler(req, res);
export const POST = async (req:any, res:any) => authHandler(req, res);