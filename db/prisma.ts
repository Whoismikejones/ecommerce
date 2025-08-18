// import { Pool, neonConfig } from '@neondatabase/serverless';
// import { PrismaNeon } from '@prisma/adapter-neon';
// import { PrismaClient } from '@prisma/client';
// import ws from 'ws';

// // Enable WebSocket connections (required for Neon serverless)
// neonConfig.webSocketConstructor = ws;

// // Use your DATABASE_URL from .env
// const connectionString = process.env.DATABASE_URL!;

// // Create a Neon connection pool
// const pool = new Pool({ connectionString });

// // Create the Prisma adapter with the pool
// const adapter = new PrismaNeon(pool);



// // Instantiate PrismaClient with the Neon adapter
// export const prisma = new PrismaClient({ adapter }).$extends({
//   result: {
//     product: {
//       price: {
//         compute(product) {
//           return product.price?.toString();
//         },
//       },
//       rating: {
//         compute(product) {
//           return product.rating?.toString();
//         },
//       },
//     },
//   },
// });


import {Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';
 
// Sets up WebSocket connections, which enables Neon to use WebSocket communication.
neonConfig.webSocketConstructor = ws;
const connectionString = `${process.env.DATABASE_URL}`;
 
// Creates a new connection pool using the provided connection string, allowing multiple concurrent connections.
const pool = new Pool({ connectionString });
 
// Instantiates the Prisma adapter using the Neon connection pool to handle the connection between Prisma and Neon.
const adapter = new PrismaNeon({connectionString});
 
// Extends the PrismaClient with a custom result transformer to convert the price and rating fields to strings.
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: connectionString,
    },
  },
}).$extends({
  result: {
    product: {
      price: {
        compute(product) {
          return product.price.toString();
        },
      },
      rating: {
        compute(product) {
          return product.rating.toString();
        },
      },
    },
  },
});
 