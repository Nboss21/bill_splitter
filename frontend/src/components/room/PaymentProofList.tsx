import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentProof {
  id: string;
  sender: string;
  fileUrl: string;
  createdAt: string;
}

const PaymentProofList = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  // Mock data - will be replaced with API calls
  const [proofs, setProofs] = useState<PaymentProof[]>([
    {
      id: "1",
      sender: "John Doe",
      fileUrl: "/placeholder.svg",
      createdAt: new Date().toLocaleDateString(),
    },
  ]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Simulate upload
    setTimeout(() => {
      const newProof: PaymentProof = {
        id: Date.now().toString(),
        sender: "You",
        fileUrl: URL.createObjectURL(file),
        createdAt: new Date().toLocaleDateString(),
      };

      setProofs([...proofs, newProof]);
      setIsUploading(false);
      
      toast({
        title: "Payment proof uploaded",
        description: "Your payment proof has been uploaded successfully.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Upload Payment Proof</h2>
        <div className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Input
              id="proof-upload"
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              disabled={isUploading}
            />
            <Label htmlFor="proof-upload" className="cursor-pointer">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm font-medium">
                {isUploading ? "Uploading..." : "Click to upload payment screenshot"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG up to 10MB
              </p>
            </Label>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Proofs</h2>
        <div className="space-y-4">
          {proofs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No payment proofs uploaded yet
            </p>
          ) : (
            proofs.map((proof) => (
              <div
                key={proof.id}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <div className="h-16 w-16 bg-muted rounded flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{proof.sender}</p>
                  <p className="text-sm text-muted-foreground">
                    Uploaded on {proof.createdAt}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default PaymentProofList;
