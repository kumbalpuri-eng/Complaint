
import React from 'react';
import { BotIcon } from './Icons';

const LoadingBubble: React.FC = () => {
  return (
    <div className="flex justify-start items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-brand-secondary flex-shrink-0 flex items-center justify-center mt-1">
        <BotIcon />
      </div>
      <div className="bg-brand-secondary rounded-xl rounded-bl-none p-4 max-w-xs shadow">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-brand-subtle rounded-full animate-pulse [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-brand-subtle rounded-full animate-pulse [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-brand-subtle rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingBubble;
