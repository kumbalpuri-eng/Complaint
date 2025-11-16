
import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import MessageBubble from './MessageBubble';
import LoadingBubble from './LoadingBubble';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {isLoading && <LoadingBubble />}
      <div className="h-4" />
    </div>
  );
};

export default ChatWindow;
