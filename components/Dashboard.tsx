import React from 'react';
import { Complaint } from '../types';

interface DashboardProps {
  complaints: Complaint[];
  onSelectComplaint: (id: string) => void;
  isLoading: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ complaints, onSelectComplaint, isLoading }) => {
    
  const getStatusColor = (status: string) => {
    switch(status) {
        case 'New': return 'bg-blue-500';
        case 'Under_Investigation': return 'bg-yellow-500';
        case 'Resolved':
        case 'Closed':
            return 'bg-green-500';
        default: return 'bg-gray-500';
    }
  }

  return (
    <div className="bg-brand-secondary rounded-lg shadow-lg p-4 sm:p-6">
      <h2 className="text-2xl font-bold text-brand-text mb-4">Complaints Dashboard</h2>
      {isLoading && (
        <div className="text-center p-4 bg-slate-700/50 rounded-lg">
            <p className="text-brand-subtle animate-pulse">Starting new AI intake session...</p>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-slate-600 text-sm text-brand-subtle uppercase">
            <tr>
              <th className="p-3">Complaint ID</th>
              <th className="p-3">Status</th>
              <th className="p-3">Category</th>
              <th className="p-3">Customer Site</th>
              <th className="p-3">Date of Issue</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length > 0 ? complaints.map(c => (
              <tr 
                key={c.complaint.id} 
                className="border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer"
                onClick={() => onSelectComplaint(c.complaint.id)}
              >
                <td className="p-3 font-mono text-amber-400">{c.complaint.id}</td>
                <td className="p-3">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full text-white ${getStatusColor(c.status.state)}`}>
                        {c.status.state.replace(/_/g, ' ')}
                    </span>
                </td>
                <td className="p-3">{c.complaint.category || 'N/A'}</td>
                <td className="p-3">{c.complaint.customer.site_name || 'N/A'}</td>
                <td className="p-3">{c.complaint.date_of_issue ? new Date(c.complaint.date_of_issue).toLocaleDateString() : 'N/A'}</td>
              </tr>
            )) : (
                <tr>
                    <td colSpan={5} className="text-center p-6 text-brand-subtle">
                        No complaints found. Click "New Complaint" to get started.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
