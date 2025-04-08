'use client';

import { ShoppingBag, X } from 'lucide-react';
import { useCart } from '@/store/cart';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function Cart() {
  const cart = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const handleCheckout = () => {
    if (!cart.items.length) {
      toast({
        title: 'Cart is empty',
        description: 'Add some items to your cart first',
        variant: 'destructive',
      });
      return;
    }
    router.push('/checkout');
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingBag className="h-5 w-5" />
          {cart.items.length > 0 && (
            <span className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
              {cart.items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-4">
          {cart.items.length === 0 ? (
            <p className="text-center text-muted-foreground">Your cart is empty</p>
          ) : (
            <>
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border-b pb-4"
                >
                  {item.image && (
                    <div className="relative h-16 w-16">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm">${item.price.toFixed(2)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => cart.removeItem(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="mt-4">
                <div className="flex justify-between text-lg font-medium">
                  <span>Total</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
                <Button
                  className="w-full mt-4"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => cart.clearCart()}
                >
                  Clear Cart
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
