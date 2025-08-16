'use server';
import { prisma } from '@/db/prisma';
import { convertToPlainObject} from '../utils';
import { LATEST_PRODUCTS_LIMIT } from '../constants';

//create function that fetches products 
//returns prisma object and have to convert to javascript


//Get Latest Products
//4 is from the product-list component
export async function getLatestProducts() {
    

    const data = await prisma.product.findMany({
        take: LATEST_PRODUCTS_LIMIT, //get four objects to display
        orderBy: { createdAT: 'desc' },
    });

      return convertToPlainObject(data);

}



