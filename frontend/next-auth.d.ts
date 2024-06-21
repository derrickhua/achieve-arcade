// next-auth.d.ts
import { JWT } from "next-auth/jwt";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    userId?: string;
  }

  interface Session {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    userId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    userId?: string;
  }
}
