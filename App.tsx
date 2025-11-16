import React, { useState, useEffect, useCallback } from 'react';
import { Complaint, Message, UserMessage, BotMessage } from './types';
import { continueComplaintChat, startNewComplaintChat } from './services/geminiService';
import { generateComplaintId } from './utils';

import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ComplaintDetailModal from './components/ComplaintDetailModal';
import NewComplaintModal from './components/NewComplaintModal';

const App: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const savedComplaints = localStorage.getItem('complaints');
      return savedComplaints ? JSON.parse(savedComplaints) : [];
    } catch (error) {
      console.error("Failed to parse complaints from localStorage", error);
      return [];
    }
  });
  
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [isNewComplaintModalOpen, setIsNewComplaintModalOpen] = useState<boolean>(false);
  const [isAiIntakeLoading, setIsAiIntakeLoading] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('complaints', JSON.stringify(complaints));
  }, [complaints]);

  const handleSelectComplaint = (id: string) => {
    setSelectedComplaintId(id);
  };

  const handleUpdateComplaint = (updatedComplaint: Complaint) => {
    setComplaints(prev => prev.map(c => c.complaint.id === updatedComplaint.complaint.id ? updatedComplaint : c));
  };
  
  const handleAddComplaint = (newComplaint: Complaint) => {
    setComplaints(prev => [newComplaint, ...prev]);
  };

  const handleStartAiIntake = async () => {
      setIsAiIntakeLoading(true);
      setIsNewComplaintModalOpen(false);
      try {
        const { response } = await startNewComplaintChat();
        
        const newComplaint: Complaint = {
          complaint: {
            id: generateComplaintId(),
            created_at: new Date().toISOString(),
            channel: "text",
            reported_by_role: "Rep",
            customer: { name: null, contact: null, site_name: null, site_code: null, region: null, country: "India" },
            category: null,
            sub_category: null,
            product_sku: null,
            lot_batch: null,
            quantity_affected: null,
            date_of_issue: null,
            safety_impact: null,
            operational_impact: null,
            description_user: "Initial intake via AI.",
            attachments: [],
            labels: []
          },
          triage: { severity: null, priority: null, initial_hypotheses: [], required_functions: [], sla: {"ack_hours": 4, "rca_days": 7, "closure_days": 30}, routing_suggestion: null },
          investigation: { data_requests: [], evidence_summary: null, missing_info: [] },
          rca: { method: null, why_chain: [], fishbone: null, root_cause_candidates: [], validated_root_cause: null },
          status: { state: "New", next_best_action: "Capture initial complaint details to enable triage.", owner: null, due_next: null },
          capa: { corrective_actions: [], preventive_actions: [], risk_assessment: null },
          sustenance: { monitoring_plan: null, effectiveness_checks: [] },
          audit: { "references": {}, "redactions": [], "explainability_note": null },
          history: [response]
        };

        handleAddComplaint(newComplaint);
        setSelectedComplaintId(newComplaint.complaint.id);

      } catch (error) {
        console.error("Failed to start AI intake", error);
        // Here you could add a user-facing error message
      } finally {
        setIsAiIntakeLoading(false);
      }
  };


  const selectedComplaint = complaints.find(c => c.complaint.id === selectedComplaintId);

  return (
    <div className="flex flex-col h-screen bg-brand-primary font-sans">
      <Header onNewComplaintClick={() => setIsNewComplaintModalOpen(true)} />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <Dashboard 
          complaints={complaints} 
          onSelectComplaint={handleSelectComplaint} 
          isLoading={isAiIntakeLoading}
        />
      </main>
      
      {isNewComplaintModalOpen && (
        <NewComplaintModal
          onClose={() => setIsNewComplaintModalOpen(false)}
          onAddComplaint={handleAddComplaint}
          onStartAiIntake={handleStartAiIntake}
        />
      )}

      {selectedComplaint && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaintId(null)}
          onUpdate={handleUpdateComplaint}
        />
      )}
    </div>
  );
};

export default App;
