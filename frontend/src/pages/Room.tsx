import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Receipt, MessageSquare, Upload } from "lucide-react";
import RoomHeader from "@/components/room/RoomHeader";
import MenuList from "@/components/room/MenuList";
import ChatWindow from "@/components/room/ChatWindow";
import PaymentProofList from "@/components/room/PaymentProofList";

const API_URL = "https://bill-splitter-backend-9b7b.onrender.com/api";

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("menu");
  const [room, setRoom] = useState<{
    id: number;
    title: string;
    menu: string[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch room data
  useEffect(() => {
    const fetchRoom = async () => {
      if (!roomId) return;

      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Unauthorized. Please log in.");
          navigate("/login");
          return;
        }

        const response = await fetch(`${API_URL}/rooms/${roomId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch room data");
        }

        const data = await response.json();
        setRoom(data.room);
      } catch (error) {
        console.error(error);
        alert("Unable to load room details.");
        navigate("/rooms");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoom();
  }, [roomId, navigate]);

  if (isLoading) {
    return <p className="text-center mt-8">Loading room...</p>;
  }

  if (!room) {
    return <p className="text-center mt-8 text-red-500">Room not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/rooms")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          {/* Pass room title to RoomHeader */}
          <RoomHeader />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid bg-card shadow-soft">
            <TabsTrigger value="menu" className="gap-2">
              <Receipt className="h-4 w-4" />
              <span className="hidden sm:inline">Menu</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="proofs" className="gap-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Payment Proofs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="menu">
            {/* Pass menu items to MenuList */}
            <MenuList  />
          </TabsContent>

          <TabsContent value="chat">
            <ChatWindow roomId={room.id} />
          </TabsContent>

          <TabsContent value="proofs">
            <PaymentProofList roomId={room.id} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Room;
