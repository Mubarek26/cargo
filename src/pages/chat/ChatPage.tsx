import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { chatService } from "@/services/chatService";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, User, MessageSquare, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useParams, useNavigate } from "react-router-dom";

interface Conversation {
  _id: string;
  orderId: {
    _id: string;
    orderNumber: string;
    title: string;
  };
  participants: Array<{
    _id: string;
    fullName: string;
    photo?: string;
    role: string;
  }>;
  lastMessage?: {
    text: string;
    senderId: string;
    sentAt: string;
  };
  unreadCount: Record<string, number>;
  updatedAt: string;
}

export default function ChatPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchConversations();
    
    const socket = chatService.getSocket();
    const handleNotification = () => {
      fetchConversations();
    };

    socket.on('chat-notification', handleNotification);
    socket.on('messages-read', handleNotification);

    return () => {
      socket.off('chat-notification', handleNotification);
      socket.off('messages-read', handleNotification);
    };
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await chatService.getMyConversations();
      if (response.status === 'success') {
        setConversations(response.data.conversations);
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const otherParticipant = conv.participants.find(p => p._id !== userId);
    return (
      otherParticipant?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.orderId.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.orderId.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const selectedConversation = conversations.find(c => c._id === conversationId);
  const otherParticipant = selectedConversation?.participants.find(p => p._id !== userId);

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-120px)] lg:h-[calc(100vh-140px)] gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Left: Conversation List */}
        <Card className={cn(
          "w-full lg:w-80 flex flex-col overflow-hidden border-border bg-card/50 backdrop-blur-sm",
          conversationId ? "hidden lg:flex" : "flex"
        )}>
          <div className="p-4 border-b border-border space-y-4">
            <h2 className="text-xl font-bold">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search chats..." 
                className="pl-9 rounded-full bg-muted/30 border-muted focus-visible:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="p-4 flex gap-3 animate-pulse">
                    <div className="h-12 w-12 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-24 bg-muted rounded" />
                      <div className="h-3 w-32 bg-muted rounded" />
                    </div>
                  </div>
                ))
              ) : filteredConversations.length === 0 ? (
                <div className="p-10 text-center text-muted-foreground text-sm">
                  {searchQuery ? "No conversations found" : "No messages yet"}
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const other = conv.participants.find(p => p._id !== userId);
                  const isSelected = conv._id === conversationId;
                  const unread = conv.unreadCount[userId || ""] || 0;

                  return (
                    <button
                      key={conv._id}
                      onClick={() => navigate(`/chat/${conv._id}`)}
                      className={cn(
                        "w-full p-4 flex gap-3 hover:bg-muted/50 transition-colors text-left relative group",
                        isSelected && "bg-primary/10 hover:bg-primary/15"
                      )}
                    >
                      {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                      <Avatar className="h-12 w-12 border border-border group-hover:scale-105 transition-transform">
                        <AvatarImage src={other?.photo} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-sm truncate">{other?.fullName || "Chat"}</span>
                          {conv.lastMessage && (
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                              {format(new Date(conv.lastMessage.sentAt), 'HH:mm')}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-primary font-medium truncate mb-1">
                          {conv.orderId.orderNumber}
                        </p>
                        <div className="flex justify-between items-center">
                          <p className={cn(
                            "text-xs truncate max-w-[140px]",
                            unread > 0 ? "font-bold text-foreground" : "text-muted-foreground"
                          )}>
                            {conv.lastMessage?.text || "Started a conversation"}
                          </p>
                          {unread > 0 && (
                            <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary text-white text-[10px] animate-in zoom-in">
                              {unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Right: Active Conversation */}
        <div className={cn(
          "flex-1 h-full",
          !conversationId ? "hidden lg:block" : "block"
        )}>
          {conversationId ? (
            <ChatWindow 
              conversationId={conversationId}
              orderNumber={selectedConversation?.orderId.orderNumber}
              recipientName={otherParticipant?.fullName}
              recipientPhoto={otherParticipant?.photo}
              recipientId={otherParticipant?._id}
              onBack={() => navigate('/chat')}
            />
          ) : (
            <Card className="h-full border-border bg-card/50 backdrop-blur-sm flex flex-col items-center justify-center text-center p-10">
              <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Select a Conversation</h3>
              <p className="text-muted-foreground max-w-xs">
                Pick a chat from the left to start messaging regarding your orders and proposals.
              </p>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
