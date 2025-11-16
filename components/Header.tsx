import React from 'react';
import { PlusIcon } from './Icons';

interface HeaderProps {
  onNewComplaintClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewComplaintClick }) => {
  return (
    <header className="bg-brand-secondary p-4 shadow-md z-10 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-brand-accent rounded-full flex items-center justify-center font-bold text-brand-primary text-xl">
          C
        </div>
        <div>
          <h1 className="text-xl font-bold text-brand-text">Complaint Lifecycle Orchestrator</h1>
          <p className="text-sm text-brand-subtle">Powered by Gemini</p>
        </div>
      </div>
      <button
        onClick={onNewComplaintClick}
        className="bg-brand-accent text-brand-primary font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-amber-500 transition-colors"
      >
        <PlusIcon />
        New Complaint
      </button>
    </header>
  );
};

export default Header;
