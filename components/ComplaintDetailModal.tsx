import React, { useState } from 'react';
import { Complaint, UserMessage } from '../types';
import { continueComplaintChat } from '../services/geminiService';
import ChatWindow from './ChatWindow';
import UserInput from './UserInput';

interface ComplaintDetailModalProps {
    complaint: Complaint;
    onClose: () => void;
    onUpdate: (updatedComplaint: Complaint) => void;
}

const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({ complaint, onClose, onUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        
        // Optimistically add user message to history for better UX
        const optimisticUserMessage: UserMessage = { id: Date.now(), sender: 'user', text };
        const optimisticComplaint = { ...complaint, history: [...complaint.history, optimisticUserMessage] };
        onUpdate(optimisticComplaint);

        try {
            const updatedComplaint = await continueComplaintChat(complaint, text);
            onUpdate(updatedComplaint);
        } catch (e: any) {
            setError(e.message || 'Failed to get response.');
            // Revert optimistic update on error
            onUpdate(complaint);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-brand-primary rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col" 
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b border-brand-secondary flex justify-between items-center flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-semibold text-brand-text">
                            Complaint: <span className="font-mono text-brand-accent">{complaint.complaint.id}</span>
                        </h2>
                        <p className="text-sm text-brand-subtle">Status: {complaint.status.state.replace(/_/g, ' ')}</p>
                    </div>
                    <button onClick={onClose} className="text-brand-subtle hover:text-brand-text text-2xl font-bold leading-none">&times;</button>
                </div>
                
                <div className="flex-1 flex flex-col overflow-y-hidden">
                    <ChatWindow messages={complaint.history} isLoading={isLoading} />
                     {error && (
                        <div className="px-4 py-2 text-center text-red-400 bg-red-900/50">
                        <p>Error: {error}</p>
                        </div>
                    )}
                    <UserInput onSendMessage={handleSendMessage} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
};

export default ComplaintDetailModal;
