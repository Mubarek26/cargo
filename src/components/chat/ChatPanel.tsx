import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ChatWindow } from "./ChatWindow";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/api";

interface ChatPanelProps {
  conversationId?: string;
  orderId: string;
  orderNumber: string;
  recipientName: string;
  recipientId?: string;
  trigger?: React.ReactNode;
}

export function ChatPanel({ conversationId, orderId, orderNumber, recipientName, recipientId, trigger }: ChatPanelProps) {
  const [activeConversationId, setActiveConversationId] = React.useState<string | undefined>(conversationId);
  const [isOpen, setIsOpen] = React.useState(false);

  // If we don't have a conversationId, we might need to fetch/create one
  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);
    if (open && !activeConversationId) {
      try {
        // Fetch conversation for this order
        const url = new URL(`${API_BASE_URL}/api/v1/chat/orders/${orderId}/conversation`);
        if (recipientId) url.searchParams.append('participantId', recipientId);
        
        const response = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        const data = await response.json();
        if (data.status === 'success' && data.data.conversation) {
          setActiveConversationId(data.data.conversation._id);
        }
      } catch (error) {
        console.error("Failed to fetch order conversation:", error);
      }
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="p-0 sm:max-w-md w-full h-full flex flex-col border-l border-border">
        <SheetHeader className="sr-only">
          <SheetTitle>Chat with {recipientName}</SheetTitle>
        </SheetHeader>
        {activeConversationId ? (
          <ChatWindow 
            conversationId={activeConversationId} 
            orderNumber={orderNumber}
            recipientName={recipientName}
            className="rounded-none border-0 h-full shadow-none"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-10 text-center space-y-4">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">No conversation found</h3>
              <p className="text-sm text-muted-foreground mt-2">
                A conversation is automatically created when a proposal is submitted or a direct order is placed.
              </p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
