import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: string;
  name: string;
  price: string;
}

const CreateRoom = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: "1", name: "", price: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const addMenuItem = () => {
    setMenuItems([
      ...menuItems,
      { id: Date.now().toString(), name: "", price: "" },
    ]);
  };

  const removeMenuItem = (id: string) => {
    if (menuItems.length > 1) {
      setMenuItems(menuItems.filter((item) => item.id !== id));
    }
  };

  const updateMenuItem = (id: string, field: "name" | "price", value: string) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Room created!",
        description: "Your room has been created successfully.",
      });
      navigate("/rooms/1");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/rooms")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Create New Room</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Room Title</Label>
              <Input
                id="title"
                placeholder="e.g., Dinner at Italian Restaurant"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Menu Items</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addMenuItem}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-3">
                {menuItems.map((item) => (
                  <div key={item.id} className="flex gap-2">
                    <Input
                      placeholder="Item name"
                      value={item.name}
                      onChange={(e) =>
                        updateMenuItem(item.id, "name", e.target.value)
                      }
                      required
                    />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) =>
                        updateMenuItem(item.id, "price", e.target.value)
                      }
                      className="w-32"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMenuItem(item.id)}
                      disabled={menuItems.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/rooms")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Creating..." : "Create Room"}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default CreateRoom;
