import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategorySwiperProps {
  categories: Category[];
  currentCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategorySwiper = ({
  categories,
  currentCategoryId,
  onCategoryChange,
}: CategorySwiperProps) => {
  const currentIndex = categories.findIndex((cat) => cat.id === currentCategoryId);

  const handlePrev = () => {
    if (currentIndex > 0) {
      onCategoryChange(categories[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < categories.length - 1) {
      onCategoryChange(categories[currentIndex + 1].id);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 h-20 glass border-t border-white/10">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <div className="flex-1 flex items-center justify-center gap-4 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`px-6 py-2 rounded-full transition-all duration-300 whitespace-nowrap ${
                category.id === currentCategoryId
                  ? 'bg-gradient-to-r from-primary to-primary-glow text-white shadow-glow scale-110'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          disabled={currentIndex === categories.length - 1}
          className="hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default CategorySwiper;
