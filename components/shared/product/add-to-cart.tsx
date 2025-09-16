"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
//import { Plus } from "lucide-react";
import { CartItem } from "@/types";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { toast } from "sonner"; // <-- Changed this import
//import { useToast } from '@/hooks/use-toast';
//import { ToastAction } from '@/components/ui/toast';

const AddToCart = ({ item }: { item: CartItem }) => {
  const router = useRouter();

  //  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    const res = await addItemToCart(item);
    if (!res.success) {
      toast.error(res.message); // Changed to use toast.error (dot notation)
      return;
    }

    // Handling success state of adding items to cart
    toast.success(`${item.name} added to cart`, {
      // Changed to use toast.success (dot notation)

      action: {
        label: "Go to Cart",

        onClick: () => router.push("/cart"),
      },
    });
  };

  //not sure if needed
  return (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
    Add To Cart
    </Button>
  );
};

export default AddToCart;
