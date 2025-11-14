import { Volume2, VolumeX, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MenuHeaderProps {
  isMuted: boolean;
  onToggleMute: () => void;
  cartCount: number;
  onOpenCart: () => void;
}

const MenuHeader = ({ isMuted, onToggleMute, cartCount, onOpenCart }: MenuHeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 glass border-b border-white/10">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
            <span className="text-xl font-bold">R</span>
          </div>
          <h1 className="text-xl font-bold text-gradient">ReelMenu</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleMute}
            className="hover:bg-white/10"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenCart}
            className="relative hover:bg-white/10"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-bounce-in"
              >
                {cartCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default MenuHeader;
