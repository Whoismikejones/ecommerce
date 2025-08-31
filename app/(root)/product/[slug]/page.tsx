import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getProductBySlug } from '@/lib/actions/product.actions';
import { notFound } from 'next/navigation';
import ProductPrice from '@/components/shared/product/product-price';
// import ProductImages from '@/components/shared/product/product-images';
// import AddToCart from '@/components/shared/product/add-to-cart';
// import { getMyCart } from '@/lib/actions/cart.actions';
// import ReviewList from './review-list';
// import { auth } from '@/auth';
// import Rating from '@/components/shared/product/rating';

const ProductDetailsPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await props.params;

  const product = await getProductBySlug(slug);
  if (!product) notFound();

//   const session = await auth();
//   const userId = session?.user?.id;

//   const cart = await getMyCart();

  return <>{product.name}</>;

};

export default ProductDetailsPage;