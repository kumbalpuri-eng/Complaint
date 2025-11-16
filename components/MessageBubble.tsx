
import React from 'react';
import { Message } from '../types';
import JsonViewer from './JsonViewer';
import { UserIcon, BotIcon } from './Icons';
import { renderMarkdown } from '../utils';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end items-start gap-3">
        <div className="bg-brand-accent text-brand-primary rounded-xl rounded-br-none p-3 max-w-lg shadow">
          <p className="text-base">{message.text}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-brand-accent flex-shrink-0 flex items-center justify-center mt-1">
          <UserIcon />
        </div>
      </div>
    );
  }

  // Bot message
  return (
    <div className="flex justify-start items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-brand-secondary flex-shrink-0 flex items-center justify-center mt-1">
        <BotIcon />
      </div>
      <div className="bg-brand-secondary rounded-xl rounded-bl-none p-4 max-w-full md:max-w-2xl lg:max-w-4xl shadow space-y-4 w-full">
        <div className="prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: renderMarkdown(message.summary) }} />

        {message.complaintData && (
          <div>
            <h3 className="text-xs font-semibold uppercase text-brand-subtle mb-2 tracking-wider">Complaint Data</h3>
            <JsonViewer data={message.complaintData} />
          </div>
        )}

        {message.toolIntentData && (
          <div>
            <h3 className="text-xs font-semibold uppercase text-brand-subtle mb-2 tracking-wider">Suggested Action (Tool Intent)</h3>
            <JsonViewer data={message.toolIntentData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;