import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, Copy, Check } from 'lucide-react';
import { useRestaurant } from '@/hooks/useRestaurant';
import { toast } from 'sonner';

const AdminQRCode = () => {
  const navigate = useNavigate();
  const { currentRestaurant } = useRestaurant();
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth');
    if (!isAuth) {
      navigate('/');
    }
  }, [navigate]);

  const getMenuUrl = () => {
    if (!currentRestaurant) return '';
    const baseUrl = window.location.origin;
    return `${baseUrl}/menu/${currentRestaurant.slug}`;
  };

  const handleCopy = async () => {
    const url = getMenuUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('URL copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  const handleDownload = () => {
    if (!qrRef.current) return;
    
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `qr-code-${currentRestaurant?.slug || 'menu'}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      toast.success('QR code downloaded!');
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!currentRestaurant) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Please select a restaurant to generate QR code</p>
        </div>
      </AdminLayout>
    );
  }

  const menuUrl = getMenuUrl();

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-gradient">QR Code</h1>
          <p className="text-muted-foreground">Generate and download QR code for your restaurant menu</p>
        </div>

        <Card className="glass border-white/20">
          <CardHeader>
            <CardTitle>{currentRestaurant.name} Menu QR Code</CardTitle>
            <CardDescription>
              Customers can scan this QR code to view your menu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* QR Code Display */}
            <div className="flex justify-center">
              <div
                ref={qrRef}
                className="p-6 bg-white rounded-lg shadow-lg"
                style={{ width: 'fit-content' }}
              >
                <QRCodeSVG
                  value={menuUrl}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>

            {/* URL Display */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Menu URL</label>
              <div className="flex gap-2">
                <div className="flex-1 glass rounded-lg p-3 text-sm break-all">
                  {menuUrl}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleDownload}
                className="bg-gradient-to-r from-primary to-primary-glow"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PNG
              </Button>
              <Button
                variant="outline"
                onClick={handlePrint}
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>

            {/* Instructions */}
            <div className="glass rounded-lg p-4 space-y-2 text-sm">
              <h3 className="font-semibold">Instructions:</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Download the QR code as a PNG image</li>
                <li>Print it and place it on your tables</li>
                <li>Customers can scan with their phone camera</li>
                <li>The QR code links directly to your menu</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content, .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminQRCode;

