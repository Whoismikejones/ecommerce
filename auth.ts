import { AuthError } from "next-auth";
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import { cookies } from "next/headers";
import { compareSync } from "bcrypt-ts-edge";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextResponse } from "next/server";

// Custom error class for invalid credentials
class InvalidCredentials extends AuthError {
  public readonly kind = "signIn";

  constructor() {
    super("Invalid credentials");
    this.type = "CredentialsSignin";
  }
}

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
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
      if (
        error.message.includes("Invalid credentials") ||
        error.name === "CredentialsSignin"
      ) {
        return;
      }
      console.error("[auth][error]", error);
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
      if (trigger === "update") {
        session.user.name = user.name;
      }
      return session;
    },

    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user, trigger, session }: any) {
      // Assign user fields to token
      if (user) {
        token.id = user.id;
        token.role = user.role;
 
        // If user has no name then use the email
        if (user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0];
 
          // Update database to reflect the token name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }
 
        if (trigger === 'signIn' || trigger === 'signUp') {
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get('sessionCartId')?.value;
 
          if (sessionCartId) {
            // Find both the session cart and user's existing cart
            const [sessionCart, userCart] = await Promise.all([
              prisma.cart.findFirst({
                where: { sessionCartId },
              }),
              prisma.cart.findFirst({
                where: { userId: user.id },
              })
            ]);
 
            if (sessionCart) {
              // If user has an existing cart, delete it
              if (userCart) {
                await prisma.cart.delete({
                  where: { id: userCart.id }
                });
              }
 
              // Use upsert to safely handle the cart update
              await prisma.cart.upsert({
                where: { id: sessionCart.id },
                update: { userId: user.id },
                create: {
                  id: sessionCart.id,
                  userId: user.id,
                  sessionCartId: sessionCartId,
                  // items: sessionCart.items as CartItem[],
                  itemsPrice: sessionCart.itemsPrice,
                  totalPrice: sessionCart.totalPrice,
                  shippingPrice: sessionCart.shippingPrice,
                  taxPrice: sessionCart.taxPrice,
                }
              });
            } else if (!userCart) {
              // If no session cart and no user cart, create a new cart
              await prisma.cart.create({
                data: {
                  userId: user.id,
                  sessionCartId: sessionCartId,
                  items: [],
                  itemsPrice: 0,
                  totalPrice: 0,
                  shippingPrice: 0,
                  taxPrice: 0,
                },
              });
            }
          }
        }
      }
 
      // Handle session updates
      if (session?.user.name && trigger === 'update') {
        token.name = session.user.name;
      }
 
      return token;
    },


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authorized({ request, auth }: any) {
      // ARRAY OF REGEX PATTERNS OF PATHS WE WANT TO PROTECT*****
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];
      //get path name from request URL object
     const { pathname } = request.nextUrl;

     //check if user is not authenticated and accessing a protected path
     if(!auth && protectedPaths.some((p) => p.test(pathname))) return false;




      //Check for session cart cookie.
      if (!request.cookies.get("sessionCartId")) {
        //generate new session cat id cookie
        const sessionCartId = crypto.randomUUID();

        //clone the request headers
        const newRequestHeaders = new Headers(request.headers);

        //Create new resposnse and add the new headers
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });

        // Set newly generated sessionCartId in the response cookies
        response.cookies.set("sessionCartId", sessionCartId);

        return response;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
