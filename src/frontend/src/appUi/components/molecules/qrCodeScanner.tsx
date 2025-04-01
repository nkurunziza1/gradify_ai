import React, { useState,useEffect, useRef } from "react";
import { Camera, Upload } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import jsQR from "jsqr";
import toast from "react-hot-toast";

interface QRData {
  token: string;
  number: string;
  isExpired: boolean;
}

interface QRScannerProps {
  onScanSuccess: (data: QRData) => void;
}

export const QRCodeScanner: React.FC<QRScannerProps> = ({ onScanSuccess }) => {
  const [activeTab, setActiveTab] = useState("camera");
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setScanning(true);
        requestAnimationFrame(scanQRCode);
      }
    } catch (err) {
      setError("Camera access denied or not available.");
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  const scanQRCode = () => {

    const video = videoRef.current;
    const canvas = canvasRef.current as any;
    const context = canvas?.getContext("2d");

    if (context && video?.readyState === video?.HAVE_ENOUGH_DATA) {
      canvas.height = video?.videoHeight;
      canvas.width = video?.videoWidth;
      context?.drawImage(video, 0, 0, canvas?.width, canvas?.height);

      const imageData = context.getImageData(0, 0, canvas?.width, canvas?.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code) {
        try {
          const qrData: QRData = JSON.parse(code.data);
          if (isValidQRData(qrData)) {
            stopCamera();
            onScanSuccess(qrData);
            return;
          }
        } catch (err) {
          toast.error(err instanceof Error ? err.message : String(err));
        }
      }
      requestAnimationFrame(scanQRCode);
    } else {
      requestAnimationFrame(scanQRCode);
    }
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          setError("Could not process image");
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);

        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          try {
            const qrData: QRData = JSON.parse(code.data);
            if (isValidQRData(qrData)) {
              onScanSuccess(qrData);
              return;
            }
            setError("Invalid QR code format");
          } catch (err) {
            setError("Invalid QR code content");
          }
        } else {
          setError("No QR code found in image");
        }
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  };

  const isValidQRData = (data: any): data is QRData => {
    return (
      typeof data === "object" &&
      typeof data.token === "string" &&
      typeof data.number === "string" &&
      typeof data.isExpired === "boolean"
    );
  };

  useEffect(() => {
    if (activeTab === "camera") {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [activeTab]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Scan QR Code</CardTitle>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="camera">
            <Camera className="mr-2 h-4 w-4" /> Camera
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Upload className="mr-2 h-4 w-4" /> Upload
          </TabsTrigger>
        </TabsList>

        <CardContent className="p-4">
          <TabsContent value="camera" className="mt-0">
            <div className="relative aspect-video bg-muted rounded overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
              />
              <canvas ref={canvasRef} className="hidden" />

              {scanning && (
                <div className="absolute inset-0 border-2 border-primary pointer-events-none">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-48 w-48 border-2 border-white border-dashed rounded-lg" />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="mt-0">
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-muted-foreground rounded-lg min-h-40">
              <Upload className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-center text-sm text-muted-foreground mb-2">
                Upload an image containing a QR code
              </p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="qr-file-input"
                onChange={handleFileUpload}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  document.getElementById("qr-file-input")?.click()
                }
              >
                Select File
              </Button>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>

      {error && (
        <CardFooter className="pt-0">
          <p className="text-sm text-destructive">{error}</p>
        </CardFooter>
      )}
    </Card>
  );
};
