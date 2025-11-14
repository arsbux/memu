import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { toast } from 'sonner';
import { createOrder } from '@/lib/supabase/queries';
import { useState } from 'react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId: string;
  cart: {
    cart: Array<{
      dish_id: string;
      name: string;
      price: number;
      quantity: number;
      thumbnail_url: string;
    }>;
    updateQuantity: (dishId: string, quantity: number) => void;
    removeFromCart: (dishId: string) => void;
    getTotal: () => number;
    clearCart: () => void;
  };
}

const CartSidebar = ({ isOpen, onClose, restaurantId, cart }: CartSidebarProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = async () => {
    if (cart.cart.length === 0) return;

    try {
      setIsSubmitting(true);
      
      const orderItems = cart.cart.map(item => ({
        dish_id: item.dish_id,
        quantity: item.quantity,
        price: item.price,
        dish_name: item.name
      }));

      await createOrder({
        restaurant_id: restaurantId,
        total_amount: cart.getTotal(),
        items: orderItems
      });

      toast.success('Order sent to kitchen! 🎉', {
        description: 'Your delicious food will be ready soon.',
        duration: 3000,
      });
      
      cart.clearCart();
      onClose();
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg bg-card border-l border-white/10">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-2xl">
            <ShoppingBag className="w-6 h-6" />
            Your Cart
          </SheetTitle>
        </SheetHeader>

        {cart.cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <ShoppingBag className="w-20 h-20 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">Your cart is empty</p>
            <p className="text-sm text-muted-foreground mt-2">
              Add some delicious items to get started!
            </p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto py-6 space-y-4">
              {cart.cart.map((item) => (
                <div
                  key={item.dish_id}
                  className="glass rounded-lg p-4 flex gap-4 animate-fade-in"
                >
                  <img
                    src={item.thumbnail_url}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-accent font-bold">₹{item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          cart.updateQuantity(item.dish_id, item.quantity - 1)
                        }
                        className="h-8 w-8"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          cart.updateQuantity(item.dish_id, item.quantity + 1)
                        }
                        className="h-8 w-8"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => cart.removeFromCart(item.dish_id)}
                        className="ml-auto h-8 w-8 text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-4">
              <div className="flex items-center justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-accent">₹{cart.getTotal()}</span>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-all duration-300 text-lg py-6"
              >
                {isSubmitting ? 'Submitting...' : 'Checkout'}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;
