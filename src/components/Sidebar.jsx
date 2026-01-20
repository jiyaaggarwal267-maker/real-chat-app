import React, { useState, useEffect } from 'react';
import { Search, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { chatAPI, userAPI } from '../services/api';
import { formatTime, truncateText } from '../utils/helpers';

const Sidebar = ({ onSelectChat, activeChat }) => {
  const { user, logout } = useAuth();
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showUserSearch, setShowUserSearch] = useState(false);

  useEffect(() => {
    loadChats();
    loadUsers();
  }, []);

  const loadChats = async () => {
    try {
      const response = await chatAPI.getAllChats();
      setChats(response.data);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await userAPI.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleUserSelect = async (selectedUser) => {
    try {
      const response = await chatAPI.createOrGetChat(selectedUser._id);
      const newChat = {
        id: response.data._id,
        user: selectedUser,
        lastMessage: null,
        unreadCount: 0
      };
      
      setChats(prev => {
        const exists = prev.find(c => c.id === newChat.id);
        if (exists) return prev;
        return [newChat, ...prev];
      });
      
      onSelectChat(selectedUser);
      setShowUserSearch(false);
      setSearchQuery('');
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 glass border-r border-purple-500/30 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-purple-500/30 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl">
                {user?.avatar || '👤'}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-black"></div>
            </div>
            <div>
              <h2 className="text-white font-semibold">{user?.username}</h2>
              <p className="text-green-400 text-xs">Online</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5 text-purple-300" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/40" />
          <input
            type="text"
            placeholder={showUserSearch ? "Search users..." : "Search chats..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowUserSearch(true)}
            className="w-full pl-10 pr-4 py-2 glass border border-purple-500/30 rounded-lg text-black placeholder-purple-300/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Chats/Users list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : showUserSearch && searchQuery ? (
          // Show users when searching
          filteredUsers.length > 0 ? (
            filteredUsers.map((u) => (
              <div
                key={u._id}
                onClick={() => handleUserSelect(u)}
                className="p-4 border-b border-purple-500/20 cursor-pointer transition-all hover:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl">
                      {u.avatar}
                    </div>
                    {u.status === 'online' && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-black"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-black font-semibold">{u.username}</h3>
                    <p className="text-purple-300/60 text-xs">{u.email}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-purple-300/60">
              No users found
            </div>
          )
        ) : (
          // Show chats
          filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => {
                  onSelectChat(chat.user);
                  setShowUserSearch(false);
                }}
                className={`p-4 border-b border-purple-500/20 cursor-pointer transition-all hover:bg-white/5 ${
                  activeChat?.id === chat.user?._id ? 'bg-purple-500/20 border-l-4 border-l-purple-500' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl">
                      {chat.user?.avatar || '👤'}
                    </div>
                    {chat.user?.status === 'online' && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-black"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold truncate">
                        {chat.user?.username || 'Unknown User'}
                      </h3>
                      {chat.lastMessage && (
                        <span className="text-purple-300/60 text-xs">
                          {formatTime(chat.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-purple-300/60 text-sm truncate">
                        {chat.lastMessage ? truncateText(chat.lastMessage.content, 30) : 'Start a conversation'}
                      </p>
                      {chat.unreadCount > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 px-4">
              <User className="w-12 h-12 text-purple-300/40 mx-auto mb-2" />
              <p className="text-purple-300/60 text-sm">
                No chats yet. Search for users to start chatting!
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Sidebar;