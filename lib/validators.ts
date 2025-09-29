import { uppercase, z } from 'zod';
import { formatNumberWithDecimal } from './utils';


const currency = z
    .string()
    .refine((value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),'Price must have exactly two decimal places');

// Schema for inserting products
export const insertProductSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  category: z.string().min(3, 'Category must be at least 3 characters'),
  brand: z.string().min(3, 'Brand must be at least 3 characters'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, 'Product must have at least one image'),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
 price: currency,
});

//Schema for signing users in
//z.string().email() is deprecated in favor of z.email(). This is a design decision to encourage the use of dedicated, top-level schemas for common types like email, URL, and datetime. While the old methods may still work at runtime, the JSDoc in TypeScript will flag them as deprecated.
export const signInFormSchema = z.object({
  email: z.email('Invalid email address').min(3, 'Email must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Schema for signing up a user
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm password must be at least 6 characters'),
  })
  //refine will comapre password and confirmPassword to ensure mathcing
  .refine((data) => data.password === data.confirmPassword, {
    //if error display
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

  // Cart Schemas
export const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  qty: z.number().int().nonnegative('Quantity must be a positive number'),
  image: z.string().min(1, 'Image is required'),
  price: currency,
});

//Vercel issue 
//Type error: Module '"@/lib/validators"' has no exported member 'insertCartSchema'.
export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, 'Session cart id is required'),
  userId: z.string().optional().nullable(),
});

// Schema for the shipping address
//lat,lng - able to utilize for a map
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters').optional(),
  streetAddress: z.string().min(3, 'Enter valid address'),
  secondaryAddress: z.string().trim().optional(),
  city: z.string().min(3, 'City must be at least 3 characters'),
  state: z.string().min(2, 'State must be at least 2 characters').toUpperCase(),
  postalCode: z.string().trim().regex(/^\d{5}(-\d{4})?$/, "Invalid postal code format"),
  country: z.string().min(3, 'Enter a valid shipping country'),
  lat: z.number().optional(),
  lng: z.number().optional(),
});
