import { API_BASE_URL } from "@/lib/api";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const chatService = {
	/**
	 * Initialize and return the socket connection
	 */
	getSocket() {
		if (!socket) {
			socket = io(API_BASE_URL, {
				transports: ['websocket', 'polling'],
				withCredentials: true
			});

			socket.on('connect', () => {
				console.log('Connected to socket server');
				// Join user-specific room for notifications
				const userId = localStorage.getItem("userId");
				if (userId) {
					socket?.emit('join-user', userId);
				}
			});
		}
		return socket;
	},

	/**
	 * Get all conversations for the current user
	 */
	async getMyConversations() {
		const token = localStorage.getItem("authToken");
		const response = await fetch(`${API_BASE_URL}/api/v1/chat/conversations`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.json();
	},

	/**
	 * Get messages for a conversation
	 */
	async getConversationMessages(conversationId: string, page = 1) {
		const token = localStorage.getItem("authToken");
		const response = await fetch(`${API_BASE_URL}/api/v1/chat/conversations/${conversationId}/messages?page=${page}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.json();
	},

	/**
	 * Send a new message
	 */
	async sendMessage(conversationId: string, text: string, type = 'TEXT') {
		const token = localStorage.getItem("authToken");
		const response = await fetch(`${API_BASE_URL}/api/v1/chat/conversations/${conversationId}/messages`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ text, type }),
		});
		return response.json();
	},

	/**
	 * Mark a conversation as read
	 */
	async markAsRead(conversationId: string) {
		const token = localStorage.getItem("authToken");
		const response = await fetch(`${API_BASE_URL}/api/v1/chat/conversations/${conversationId}/read`, {
			method: "PATCH",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.json();
	},

	/**
	 * Join a conversation's socket room
	 */
	joinConversation(conversationId: string) {
		const s = this.getSocket();
		s.emit('join-chat', conversationId);
	},

	/**
	 * Leave a conversation's socket room
	 */
	leaveConversation(conversationId: string) {
		const s = this.getSocket();
		s.emit('leave-chat', conversationId);
	},

	/**
	 * Emit typing indicator
	 */
	sendTyping(conversationId: string, userName: string, isTyping: boolean) {
		const s = this.getSocket();
		const userId = localStorage.getItem("userId");
		s.emit('typing', { conversationId, userId, userName, isTyping });
	}
};
