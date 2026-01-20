import React from 'react';

const StarField = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(100)].map((_, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full animate-pulse"
          style={{
            width: Math.random() * 3 + 'px',
            height: Math.random() * 3 + 'px',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            animationDelay: Math.random() * 3 + 's',
            animationDuration: (Math.random() * 2 + 1) + 's',
            opacity: Math.random() * 0.7 + 0.3
          }}
        />
      ))}
      
      {/* Floating planets */}
      <div 
        className="absolute top-20 left-20 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: '4s' }}
      />
      <div 
        className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse" 
        style={{ animationDelay: '1s', animationDuration: '5s' }}
      />
      <div 
        className="absolute top-1/2 right-1/3 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl animate-pulse"
        style={{ animationDelay: '2s', animationDuration: '3s' }}
      />
    </div>
  );
};

export default StarField;