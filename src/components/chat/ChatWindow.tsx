import React, { useEffect, useRef, useState } from "react";
import { chatService } from "@/services/chatService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, User, Loader2, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Message {
  _id: string;
  senderId: {
    _id: string;
    fullName: string;
    photo?: string;
  };
  text: string;
  type: 'TEXT' | 'SYSTEM' | 'PROPOSAL_UPDATE';
  createdAt: string;
}

interface ChatWindowProps {
  conversationId: string;
  orderNumber?: string;
  recipientName?: string;
  recipientPhoto?: string;
  recipientId?: string;
  className?: string;
  onBack?: () => void;
}

export function ChatWindow({ conversationId, orderNumber, recipientName, recipientPhoto, recipientId, className, onBack }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchMessages();
    
    const socket = chatService.getSocket();
    chatService.joinConversation(conversationId);

    const handleNewMessage = (message: Message) => {
      setMessages(prev => [...prev, message]);
      chatService.markAsRead(conversationId);
    };

    const handleTyping = (data: { userId: string, isTyping: boolean }) => {
      if (data.userId !== userId) {
        setOtherUserTyping(data.isTyping);
      }
    };

    socket.on('new-message', handleNewMessage);
    socket.on('typing', handleTyping);

    return () => {
      chatService.leaveConversation(conversationId);
      socket.off('new-message', handleNewMessage);
      socket.off('typing', handleTyping);
    };
  }, [conversationId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, otherUserTyping]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const response = await chatService.getConversationMessages(conversationId);
      if (response.status === 'success') {
        setMessages(response.data.messages);
        chatService.markAsRead(conversationId);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const response = await chatService.sendMessage(conversationId, newMessage.trim());
      if (response.status === 'success') {
        setNewMessage("");
        handleTypingStop();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleTypingStart = () => {
    if (!isTyping) {
      setIsTyping(true);
      const userName = localStorage.getItem("fullName") || "User";
      chatService.sendTyping(conversationId, userName, true);
    }
  };

  const handleTypingStop = () => {
    if (isTyping) {
      setIsTyping(false);
      const userName = localStorage.getItem("fullName") || "User";
      chatService.sendTyping(conversationId, userName, false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (e.target.value.length > 0) {
      handleTypingStart();
    } else {
      handleTypingStop();
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-card rounded-xl border border-border shadow-sm overflow-hidden", className)}>
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8 -ml-2" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-center gap-3 flex-1">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarImage src={recipientPhoto} />
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm leading-none">{recipientName || "Chat"}</h3>
            {orderNumber && (
              <p className="text-xs text-muted-foreground mt-1">Order: {orderNumber}</p>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 opacity-50">
              <Loader2 className="h-6 w-6 animate-spin mb-2" />
              <p className="text-xs">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-10 opacity-50">
              <p className="text-xs">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const senderId = typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId;
              const senderIdStr = String(senderId);
              const userIdStr = String(userId);
              
              let isMine = senderIdStr === userIdStr;
              
              // God Mode: If I'm a SuperAdmin and I didn't send the message, 
              // still try to separate the two participants by putting one on each side.
              const userRole = localStorage.getItem("userRole");
              if (userRole === 'SUPER_ADMIN' && !isMine && recipientId) {
                // If the sender is NOT the "recipient" we are focusing on, put them on the right
                if (senderIdStr !== String(recipientId)) {
                  isMine = true; 
                }
              }

              const isSystem = msg.type === 'SYSTEM';

              if (isSystem) {
                return (
                  <div key={msg._id} className="flex justify-center my-2">
                    <Badge variant="outline" className="bg-muted/50 text-[10px] font-normal px-2 py-0.5 rounded-full border-dashed">
                      {msg.text}
                    </Badge>
                  </div>
                );
              }

              return (
                <div key={msg._id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                    isMine 
                      ? "bg-primary text-primary-foreground rounded-tr-none" 
                      : "bg-muted text-foreground rounded-tl-none"
                  )}>
                    <p>{msg.text}</p>
                    <p className={cn(
                      "text-[10px] mt-1 text-right opacity-70",
                      isMine ? "text-primary-foreground" : "text-muted-foreground"
                    )}>
                      {format(new Date(msg.createdAt), 'HH:mm')}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          
          {otherUserTyping && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground rounded-2xl rounded-tl-none px-4 py-2 text-sm shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-background">
        <div className="flex gap-2">
          <Input 
            placeholder="Type your message..." 
            value={newMessage}
            onChange={onInputChange}
            onBlur={handleTypingStop}
            className="flex-1 rounded-full border-muted bg-muted/20 focus-visible:ring-primary h-10 px-4"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!newMessage.trim() || isSending}
            className="rounded-full h-10 w-10 shrink-0 shadow-lg shadow-primary/20"
          >
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </form>
    </div>
  );
}
