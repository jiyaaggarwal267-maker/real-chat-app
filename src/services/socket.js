import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
      off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  constructor() {
    this.socket = null;
  }

  connect(userId) {
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.socket.on('connect', () => {
      console.log('🔌 Socket connected');
      this.socket.emit('user:join', userId);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(data) {
    if (this.socket) {
      this.socket.emit('message:send', data);
    }
  }

  onMessageReceive(callback) {
    if (this.socket) {
      this.socket.on('message:receive', callback);
    }
  }

  onMessageSent(callback) {
    if (this.socket) {
      this.socket.on('message:sent', callback);
    }
  }

  onUserStatus(callback) {
    if (this.socket) {
      this.socket.on('user:status', callback);
    }
  }

  startTyping(receiverId) {
    if (this.socket) {
      this.socket.emit('typing:start', { receiverId });
    }
  }

  stopTyping(receiverId) {
    if (this.socket) {
      this.socket.emit('typing:stop', { receiverId });
    }
  }

  onTypingIndicator(callback) {
    if (this.socket) {
      this.socket.on('typing:indicator', callback);
    }
  }

  markAsRead(chatId, senderId) {
    if (this.socket) {
      this.socket.emit('message:read', { chatId, senderId });
    }
  }

  onMessagesRead(callback) {
    if (this.socket) {
      this.socket.on('messages:read', callback);
    }
  }
}

export default new SocketService();