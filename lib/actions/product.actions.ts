'use server';

// import { prisma } from '@/db/prisma';
 import { convertToPlainObject } from '../utils';
 import { LATEST_PRODUCTS_LIMIT } from '../constants';
// import { revalidatePath } from 'next/cache';
// import { insertProductSchema, updateProductSchema } from '../validators';
// import { z } from 'zod';
import { Prisma, PrismaClient } from '@prisma/client';

// Get latest products
export async function getLatestProducts() {
  const prisma = new PrismaClient();

  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT, 
    orderBy: { createdAt: 'desc' },

  });

    return convertToPlainObject(data);
}
