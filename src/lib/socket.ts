import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: false,
    });
  }
  return socket;
};

export const connectSocket = (userId: string) => {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
    s.on("connect", () => {
      console.log("Connected to socket server");
      s.emit("join", `user_${userId}`);
    });
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
