import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import socketService from './services/socket';
import { chatAPI, messageAPI } from './services/api';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import MessageInput from './components/MessageInput';
import StarField from './components/StarField';

const MainApp = () => {
  const { user, loading } = useAuth();
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    if (user) {
      setupSocketListeners();
    }

    return () => {
      socketService.removeAllListeners();
    };
  }, [user]);

  const setupSocketListeners = () => {
    // Listen for incoming messages
    socketService.onMessageReceive((message) => {
      if (message.chat === currentChatId) {
        setMessages(prev => [...prev, message]);
      }
    });

    // Listen for message sent confirmation
    socketService.onMessageSent((message) => {
      setMessages(prev => {
        const exists = prev.find(m => m._id === message._id);
        if (exists) return prev;
        return [...prev, message];
      });
    });

    // Listen for typing indicators
    socketService.onTypingIndicator((data) => {
      if (data.isTyping) {
        setTypingUsers(prev => [...new Set([...prev, data.userId])]);
      } else {
        setTypingUsers(prev => prev.filter(id => id !== data.userId));
      }
    });

    // Listen for user status changes
    socketService.onUserStatus((data) => {
      if (activeChat?.id === data.userId) {
        setActiveChat(prev => ({
          ...prev,
          status: data.status
        }));
      }
    });
  };

  const handleSelectChat = async (chatUser) => {
    setActiveChat(chatUser);
    setLoadingMessages(true);

    try {
      // Create or get chat
      const chatResponse = await chatAPI.createOrGetChat(chatUser._id);
      const chatId = chatResponse.data._id;
      setCurrentChatId(chatId);

      // Load messages
      const messagesResponse = await messageAPI.getMessages(chatId);
      setMessages(messagesResponse.data);
    } catch (error) {
      console.error('Error loading chat:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (content) => {
    if (!activeChat || !currentChatId) return;

    const tempMessage = {
      _id: 'temp-' + Date.now(),
      chat: currentChatId,
      sender: user.id,
      receiver: activeChat._id,
      content,
      createdAt: new Date(),
      status: 'sent',
      type: 'text'
    };

    setMessages(prev => [...prev, tempMessage]);

    // Send via socket
    socketService.sendMessage({
      chatId: currentChatId,
      receiverId: activeChat._id,
      content,
      type: 'text'
    });
  };

  const handleTyping = () => {
    if (activeChat) {
      socketService.startTyping(activeChat._id);
    }
  };

  const handleStopTyping = () => {
    if (activeChat) {
      socketService.stopTyping(activeChat._id);
    }
  };

  const handleFileUpload = async (file) => {
    if (!activeChat || !currentChatId) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await messageAPI.uploadFile(formData);
      
      socketService.sendMessage({
        chatId: currentChatId,
        receiverId: activeChat._id,
        content: `📎 ${uploadResponse.data.fileName}`,
        type: 'file'
      });
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black flex relative overflow-hidden">
      <StarField />

      <Sidebar onSelectChat={handleSelectChat} activeChat={activeChat} />

      <div className="flex-1 flex flex-col relative z-10">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-purple-500/30 glass">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xl">
                    {activeChat.avatar}
                  </div>
                  {activeChat.status === 'online' && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-black"></div>
                  )}
                </div>
                <div>
                  <h2 className="text-white font-semibold">{activeChat.username}</h2>
                  <p className={`text-xs ${activeChat.status === 'online' ? 'text-green-400' : 'text-purple-300/60'}`}>
                    {activeChat.status}
                  </p>
                </div>
              </div>
            </div>

            {loadingMessages ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <>
                <ChatArea 
                  activeChat={activeChat} 
                  messages={messages}
                  typingUsers={typingUsers}
                />
                <MessageInput 
                  onSendMessage={handleSendMessage}
                  onTyping={handleTyping}
                  onStopTyping={handleStopTyping}
                  onFileUpload={handleFileUpload}
                />
              </>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block p-6 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full mb-4 animate-pulse">
                <Star className="w-16 h-16 text-purple-300" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Welcome to the Cosmos</h3>
              <p className="text-purple-300/60">Select a chat to start your interstellar conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default App;