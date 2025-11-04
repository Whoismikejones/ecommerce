import { DollarSign, Headset, ShoppingBag, WalletCards } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";

const IconBoxes = () => {
  return (
    <div>
      <Card>
        <CardContent className="grid md:grid-cols-4 gap-4 p-4">
          <div className="space-y-2">
            <ShoppingBag />
            <div className="text-sm font-bold">Free Shipping</div>
            <div className="text-sm text-muted-foreground">
              Free shipping on orders above $100
            </div>
          </div>
          <div className="space-y-2">
            <DollarSign />
            <div className="text-sm font-bold">Money Back Guarantee</div>
            <div className="text-sm text-muted-foreground">
              Within 30 days of purchase
            </div>
          </div>
          <div className="space-y-2">
            <WalletCards />
            <div className="text-sm font-bold">Flexible Payment</div>
            <div className="text-sm text-muted-foreground">
              Pay with credit card or via PayPal
            </div>
          </div>
          <div className="space-y-2">
            <Headset />
            <div className="text-sm font-bold">Customer Support</div>
            <div className="text-sm">
              <Link
                href="/customer-service"
                className="text-primary hover:underline"
              >
                Contact Us!
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IconBoxes;
