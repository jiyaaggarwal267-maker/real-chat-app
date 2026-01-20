import React, { useState, useRef } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';
import { debounce } from '../utils/helpers';

const MessageInput = ({ onSendMessage, onTyping, onStopTyping, onFileUpload }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);

  const emojis = ['😊', '😂', '❤️', '👍', '🎉', '🚀', '🌟', '⭐', '🌙', '🌌', '✨', '💫', '🪐', '🛸', '👋', '🔥'];

  const debouncedStopTyping = useRef(
    debounce(() => {
      onStopTyping?.();
    }, 1000)
  ).current;

  const handleChange = (e) => {
    setMessage(e.target.value);
    onTyping?.();
    debouncedStopTyping();
  };

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      onStopTyping?.();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload?.(file);
    }
  };

  return (
    <div className="p-4 border-t border-purple-500/30 glass">
      {showEmojiPicker && (
        <div className="mb-2 p-3 glass rounded-lg border border-purple-500/30 animate-slideUp">
          <div className="flex flex-wrap gap-2">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleEmojiClick(emoji)}
                className="text-2xl hover:scale-125 transition-transform p-1"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title="Add emoji"
        >
          <Smile className="w-5 h-5 text-purple-300" />
        </button>
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title="Attach file"
        >
          <Paperclip className="w-5 h-5 text-purple-300" />
        </button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
        />
        
        <input
          type="text"
          placeholder="Type a cosmic message..."
          value={message}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          className="flex-1 px-4 py-3 glass border border-purple-500/30 rounded-lg text-black placeholder-purple-300/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-purple-500/50"
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;