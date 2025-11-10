import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender: string;
  text: string;
  createdAt: string;
  isCurrentUser: boolean;
}

const ChatWindow = () => {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  
  // Mock data - will be replaced with API calls
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "John Doe",
      text: "Hey everyone! Ready to split this bill?",
      createdAt: "10:30 AM",
      isCurrentUser: false,
    },
    {
      id: "2",
      sender: "You",
      text: "Yes, I'm in!",
      createdAt: "10:32 AM",
      isCurrentUser: true,
    },
    {
      id: "3",
      sender: "Jane Smith",
      text: "Can someone help me with the payment?",
      createdAt: "10:35 AM",
      isCurrentUser: false,
    },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "You",
      text: message,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCurrentUser: true,
    };

    setMessages([...messages, newMessage]);
    setMessage("");
    
    toast({
      title: "Message sent",
      description: "Your message has been sent to the room.",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="p-6 h-[600px] flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Chat</h2>
      
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.isCurrentUser ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                msg.isCurrentUser
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {!msg.isCurrentUser && (
                <p className="text-xs font-semibold mb-1 opacity-70">
                  {msg.sender}
                </p>
              )}
              <p className="text-sm">{msg.text}</p>
            </div>
            <span className="text-xs text-muted-foreground mt-1">
              {msg.createdAt}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button onClick={handleSend} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default ChatWindow;
