'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { auth } from '@/auth';
import { formatError } from '../utils';
import { cartItemSchema, insertCartSchema } from '../validators';
import { prisma } from '@/db/prisma';
import { CartItem } from '@/types';
import { Prisma } from '@prisma/client';
import { convertToPlainObject } from '../utils';


export async function addItemToCart(data: CartItem) {
  try {
    // Check for session cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart Session not found');

    // Get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;
     

    // Get cart
    const cart = await getMyCart();

    // Parse and validate item
    const item = cartItemSchema.parse(data);

    // Find product in database
    const product = await prisma.product.findFirst({
        where: { id: item.productId }
    })
    
    // Testing
    console.log({
      'Session Cart ID': sessionCartId,
      'User ID': userId,
      'Item Reqested': item, 
      'Product Found': product,
    });

    return {
      success: true,
      message: 'Testing Cart',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export async function getMyCart() {
  // Check for cart cookie
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;
  if (!sessionCartId) throw new Error('Cart session not found');

  // Get session and user ID
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // Get user cart from prisma database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  // Convert decimals and return
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}