import React, { useState } from 'react';
import { SendIcon } from './Icons';

interface UserInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const UserInput: React.FC<UserInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-brand-primary p-4 border-t border-brand-secondary flex-shrink-0">
      <form onSubmit={handleSubmit} className="flex items-center gap-3 max-w-4xl mx-auto">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter complaint details here..."
          className="flex-1 p-3 bg-brand-secondary border border-slate-600 rounded-lg text-brand-text placeholder-brand-subtle focus:ring-2 focus:ring-brand-accent focus:outline-none resize-none transition-shadow"
          rows={1}
          disabled={isLoading}
          autoFocus
        />
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="bg-brand-accent text-brand-primary h-12 w-12 rounded-full flex items-center justify-center transition-all duration-200 ease-in-out disabled:bg-brand-secondary disabled:text-brand-subtle disabled:cursor-not-allowed hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-primary focus:ring-brand-accent flex-shrink-0"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-brand-subtle border-t-brand-primary rounded-full animate-spin"></div>
          ) : (
            <SendIcon />
          )}
        </button>
      </form>
    </div>
  );
};

export default UserInput;
