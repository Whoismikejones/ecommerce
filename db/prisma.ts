import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

// Enable WebSocket connections (required for Neon serverless)
neonConfig.webSocketConstructor = ws;

// Use your DATABASE_URL from .env
const connectionString = process.env.DATABASE_URL!;

// Create a Neon connection pool
const pool = new Pool({ connectionString });

// Create the Prisma adapter with the pool
const adapter = new PrismaNeon(pool);

// Instantiate PrismaClient with the Neon adapter
export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        compute(product) {
          return product.price?.toString();
        },
      },
      rating: {
        compute(product) {
          return product.rating?.toString();
        },
      },
    },
  },
});