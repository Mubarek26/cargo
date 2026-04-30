import { useEffect } from "react";
import { getSocket, connectSocket } from "@/lib/socket";
import { toast } from "sonner";

export const useNotifications = () => {
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;

    const user = JSON.parse(userStr);
    const userId = user._id || user.id;

    if (!userId) return;

    console.log(`[Socket] Connecting for user: ${userId}`);
    connectSocket(userId);
    const socket = getSocket();

    socket.on("notification", (notification: any) => {
      console.log("[Socket] New notification received:", notification);
      
      // Customize toast based on type
      if (notification.type === 'IDLE_ALERT') {
        toast.error(notification.title, {
          description: notification.message,
          duration: 10000, // Longer duration for critical alerts
          action: {
            label: "View Detail",
            onClick: () => {
                // Navigate to idle detection page if needed
                window.location.href = '/fleet/idle';
            }
          }
        });
      } else {
        toast.info(notification.title, {
          description: notification.message,
        });
      }
    });

    return () => {
      socket.off("notification");
    };
  }, []);
};
