import React, { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatTimeOnly, isSameDay } from '../utils/helpers';

const ChatArea = ({ activeChat, messages, typingUsers }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const isTyping = typingUsers?.some(id => id === activeChat?.id);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg, idx) => {
        const isSender = msg.sender?._id === user?.id || msg.sender === user?.id;
        const showDateSeparator = idx === 0 || 
          !isSameDay(messages[idx - 1].createdAt, msg.createdAt);

        return (
          <React.Fragment key={msg._id || msg.id}>
            {showDateSeparator && (
              <div className="flex items-center justify-center my-4">
                <div className="px-4 py-1 bg-purple-500/20 rounded-full text-purple-300 text-xs">
                  {formatDate(msg.createdAt)}
                </div>
              </div>
            )}
            <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} message-bubble`}>
              <div className={`max-w-md ${isSender ? 'order-2' : 'order-1'}`}>
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    isSender
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-tr-none'
                      : 'glass text-black rounded-tl-none border border-purple-500/30'
                  }`}
                >
                  <p className="break-words">{msg.content}</p>
                </div>
                <div className={`flex items-center gap-2 mt-1 text-xs text-purple-300/60 ${isSender ? 'justify-end' : 'justify-start'}`}>
                  <span>{formatTimeOnly(msg.createdAt)}</span>
                  {isSender && (
                    <span>
                      {msg.status === 'sent' && '✓'}
                      {msg.status === 'delivered' && '✓✓'}
                      {msg.status === 'read' && <span className="text-blue-400">✓✓</span>}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
      
      {isTyping && (
        <div className="flex justify-start">
          <div className="px-4 py-3 glass rounded-2xl rounded-tl-none border border-purple-500/30">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full typing-dot"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full typing-dot"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full typing-dot"></div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatArea;