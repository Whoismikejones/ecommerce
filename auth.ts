import { AuthError } from 'next-auth';
import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/db/prisma';
import { cookies } from 'next/headers';
import { compareSync } from 'bcrypt-ts-edge';
import CredentialsProvider from 'next-auth/providers/credentials';

// Custom error class for invalid credentials
class InvalidCredentials extends AuthError {
  public readonly kind = 'signIn';
 
  constructor() {
    super('Invalid credentials');
    this.type = 'CredentialsSignin';
  }
}

export const config = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        // Find user in database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        // Check if user exists and if the password matches
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );

          // If password is correct, return user
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }        
        // If user does not exist or password does not match return null
        //return null;

        // If user does not exist or password does not match, throw custom error
            throw new InvalidCredentials();
      },
    }),
  ],

  logger: {
      error: (error: Error) => {
         // Don't log CredentialsSignin errors to avoid console spam
         if (error.message.includes('Invalid credentials') || error.name === 'CredentialsSignin') {
            return;
         }
         console.error('[auth][error]', error);
      },
  },

  callbacks: {
    //...authConfig.callbacks,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, user, trigger, token }: any) {
        //Set the user id from the token 
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.name = token.name; 

        //console.log(token);
        //if there is an update, set the user name 
        if(trigger === 'update'){
            session.user.name = user.name;
        }
        return session; 
    },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
       async jwt({ token, user, trigger, session }: any){
        // Assign user fields to token
        if (user){ 
          token.role = user.role;

          // If user has no name then use email 
          if(user.name === 'NO_NAME') {
            token.name = user.email!.split('@')[0];

            // Update database to reflect the token name
            await prisma.user.update({
              where: { id: user.id },
              data: {name: token.name}
            })
          }
        }
        return token;
       }
   },

}satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);