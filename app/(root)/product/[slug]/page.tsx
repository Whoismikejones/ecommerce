
import { Card, CardContent } from '@/components/ui/card';
import { getProductBySlug } from '@/lib/actions/product.actions';
import { notFound } from 'next/navigation';
import ProductPrice from '@/components/shared/product/product-price';



const ProductDetailsPage = async (props: {
    params: Promise<{ slug: string }>;
}) => {
    const { slug } = await props.params;

    const product = await getProductBySlug(slug);
    if(!product) notFound();


    return <>{product.name}</>;
}
 
export default ProductDetailsPage;