import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Receipt, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JoinRoomResponse {
  room: {
    id: number;
    title: string;
    menu: string[];
  };
}
const API_URL = "https://bill-splitter-backend-9b7b.onrender.com/api";

const JoinRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState<string>("");
  const [passcode, setPasscode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleJoin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!roomId) {
      toast({
        title: "Error",
        description: "Invalid room ID.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token"); // Ensure user is authenticated

      const response = await fetch(`${API_URL}/rooms/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          roomId: Number(roomId),
          displayName,
          passcode: passcode || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to join room");
      }

      const data: JoinRoomResponse = await response.json();

      toast({
        title: "Joined successfully!",
        description: `Welcome to "${data.room.title}"`,
      });

      navigate(`/rooms/${data.room.id}`);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Could not join the room. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-md p-8 shadow-medium">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-md">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Join Room</h1>
          <p className="text-muted-foreground">
            Enter your details to join this bill splitting session
          </p>
          <div className="px-4 py-2 rounded-lg bg-muted inline-flex items-center gap-2 text-sm">
            <Receipt className="h-4 w-4" />
            <span className="font-mono">Room: {roomId}</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleJoin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              type="text"
              placeholder="John Doe"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="passcode">
              Passcode <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="passcode"
              type="text"
              placeholder="Enter room passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Joining..." : "Join Room"}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-sm text-muted-foreground"
          >
            ← Back to home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default JoinRoom;
