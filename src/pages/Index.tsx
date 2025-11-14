import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to a default restaurant or show message
    // For now, just show a message that they need to scan a QR code
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">ReelMenu</h1>
        <p className="text-xl text-muted-foreground">Please scan a QR code to view the menu</p>
      </div>
    </div>
  );
};

export default Index;
