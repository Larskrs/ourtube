import NextAuth from "next-auth"
import { SupabaseAdapter } from "@next-auth/supabase-adapter"
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken"

// For more information on each option (and a full list of options) go to
// https://authjs.dev/reference/configuration/auth-config

export const authOptions = {
    site: process.env.NEXTAUTH_URL,
    session: {
        strategy: 'jwt',
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                }
            }
        })
    ],
    adapter: SupabaseAdapter({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
      }),
      secret: process.env.SECRET,
      callbacks: {
          jwt: async ({ user, token }) => {
              if (user) {
                token.uid = user.id;
              }
              return token;
            },
            session: async ({ session, token, user }) => {
                if (session?.user) {
                  session.user.id = token.uid;
                
              // Expanding the session
              
          const signingSecret = process.env.SUPABASE_JWT_SECRET
          if (signingSecret) {
            const payload = {
              aud: "authenticated",
              exp: Math.floor(new Date(session.expires).getTime() / 1000),
              sub: user.id,
              email: user.email,
              role: "authenticated",
            }
            session.supabaseAccessToken = jwt.sign(payload, signingSecret)
          }
          
          
          return session
        }
        },
    }
}

export default NextAuth ( authOptions )