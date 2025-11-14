import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, UtensilsCrossed } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      <div className="text-center space-y-6 px-4">
        <div className="flex justify-center">
          <UtensilsCrossed className="w-24 h-24 text-primary animate-pulse" />
        </div>
        <h1 className="text-6xl font-bold text-gradient">404</h1>
        <div className="space-y-2">
          <p className="text-2xl font-semibold">Oops! Page not found</p>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <Button
          onClick={() => navigate('/')}
          className="bg-gradient-to-r from-primary to-primary-glow"
        >
          <Home className="w-4 h-4 mr-2" />
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
