import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Receipt, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Room {
  id: number;
  title: string;
  menu: string[];
}

const Rooms: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);


const API_URL = "https://bill-splitter-backend-9b7b.onrender.com/api";



  // ✅ Fetch rooms on component mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast({
            title: "Unauthorized",
            description: "Please log in to view your rooms.",
          });
          navigate("/login");
          return;
        }

        const response = await fetch(`${API_URL}/rooms`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }

        const data = await response.json();
        setRooms(data.rooms);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Unable to load rooms. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, [navigate, toast]);

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
                <Receipt className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">My Rooms</h1>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-8">
        {/* Create / Join Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button
            className="gap-2"
            size="lg"
            onClick={() => navigate("/rooms/new")}
          >
            <Plus className="h-5 w-5" />
            Create Room
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            size="lg"
            onClick={() => navigate("/rooms/join")}
          >
            <Users className="h-5 w-5" />
            Join Room
          </Button>
        </div>

        {/* Room List */}
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading rooms...</p>
        ) : rooms.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <Card
                key={room.id}
                className="p-6 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate(`/rooms/${room.id}`)}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg">{room.title}</h3>
                    <Badge variant="default">ACTIVE</Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{room.menu.length} menu items</span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Room ID: {room.id}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No rooms yet</h3>
            <p className="text-muted-foreground mb-4">
              Create a room to start splitting bills with friends
            </p>
            <Button onClick={() => navigate("/rooms/new")}>
              Create Your First Room
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Rooms;
