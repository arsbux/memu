import { useRef, useEffect, useState } from 'react';
import { Dish } from '@/types';
import DishOverlay from './DishOverlay';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoReelProps {
  dish: Dish;
  isMuted: boolean;
  onAddToCart: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

const VideoReel = ({
  dish,
  isMuted,
  onAddToCart,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}: VideoReelProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const holdTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.play();
    }
  }, [dish.id, isMuted]);

  const handleTap = () => {
    // Single tap handled by parent (mute toggle)
  };

  const handleHoldStart = () => {
    holdTimeoutRef.current = setTimeout(() => {
      setIsHolding(true);
      setIsPaused(true);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }, 200);
  };

  const handleHoldEnd = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
    }
    if (isHolding) {
      setIsHolding(false);
      setIsPaused(false);
      if (videoRef.current) {
        videoRef.current.play();
      }
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black">
      <video
        ref={videoRef}
        src={dish.video_url}
        className="h-full w-full object-cover"
        loop
        playsInline
        autoPlay
        muted={isMuted}
        onClick={handleTap}
        onTouchStart={handleHoldStart}
        onTouchEnd={handleHoldEnd}
        onMouseDown={handleHoldStart}
        onMouseUp={handleHoldEnd}
        onMouseLeave={handleHoldEnd}
      />

      <div className="absolute inset-0 gradient-overlay pointer-events-none" />

      <DishOverlay dish={dish} onAddToCart={onAddToCart} />

      {/* Minimal navigation dots */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        {hasPrev && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrev}
            className="glass rounded-full hover:bg-white/20 w-10 h-10"
          >
            <ChevronUp className="w-5 h-5" />
          </Button>
        )}
        {hasNext && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            className="glass rounded-full hover:bg-white/20 w-10 h-10"
          >
            <ChevronDown className="w-5 h-5" />
          </Button>
        )}
      </div>

      {isPaused && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-white border-b-[15px] border-b-transparent ml-2"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoReel;
