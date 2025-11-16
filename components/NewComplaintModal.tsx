import React, { useState, useEffect } from 'react';
import { Complaint } from '../types';
import { generateComplaintId } from '../utils';
import { BotIcon } from './Icons';

interface NewComplaintModalProps {
  onClose: () => void;
  onAddComplaint: (complaint: Complaint) => void;
  onStartAiIntake: () => void;
}

const NewComplaintModal: React.FC<NewComplaintModalProps> = ({ onClose, onAddComplaint, onStartAiIntake }) => {
  const [formState, setFormState] = useState({
    site_name: '',
    category: '',
    date_of_issue: '',
    safety_impact: 'None',
    description_user: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    validateForm();
  }, [formState]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formState.site_name.trim()) newErrors.site_name = 'Site name is required.';
    if (!formState.date_of_issue) newErrors.date_of_issue = 'Date of issue is required.';
    else if (new Date(formState.date_of_issue) > new Date()) newErrors.date_of_issue = 'Date cannot be in the future.';
    if (!formState.category) newErrors.category = 'Category must be selected.';
    if (!formState.safety_impact) newErrors.safety_impact = 'Safety impact must be selected.';
    if (!formState.description_user.trim()) newErrors.description_user = 'Description is required.';
    
    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
        // This is a safeguard, but the button should be disabled anyway
        return;
    }
    const newComplaint: Complaint = {
      complaint: {
        id: generateComplaintId(),
        created_at: new Date().toISOString(),
        channel: "text",
        reported_by_role: "Rep",
        customer: { name: null, contact: null, site_name: formState.site_name, site_code: null, region: null, country: "India" },
        category: formState.category as any,
        sub_category: null,
        product_sku: null,
        lot_batch: null,
        quantity_affected: null,
        date_of_issue: formState.date_of_issue,
        safety_impact: formState.safety_impact as any,
        operational_impact: null,
        description_user: formState.description_user,
        attachments: [],
        labels: []
      },
      triage: { severity: null, priority: null, initial_hypotheses: [], required_functions: [], sla: {"ack_hours": 4, "rca_days": 7, "closure_days": 30}, routing_suggestion: null },
      investigation: { data_requests: [], evidence_summary: null, missing_info: [] },
      rca: { method: null, why_chain: [], fishbone: null, root_cause_candidates: [], validated_root_cause: null },
      status: { state: "New", next_best_action: "Triage the complaint based on provided details.", owner: null, due_next: null },
      capa: { corrective_actions: [], preventive_actions: [], risk_assessment: null },
      sustenance: { monitoring_plan: null, effectiveness_checks: [] },
      audit: { "references": {}, "redactions": [], "explainability_note": null },
      history: []
    };
    onAddComplaint(newComplaint);
    onClose();
  };
  
  const getInputClasses = (fieldName: keyof typeof errors) => {
      const baseClasses = "w-full p-2 bg-brand-primary border rounded-lg text-brand-text focus:ring-2 focus:ring-brand-accent focus:outline-none";
      return `${baseClasses} ${errors[fieldName] ? 'border-red-500' : 'border-slate-600'}`;
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-brand-secondary rounded-lg shadow-xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-600 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-brand-text">Create New Complaint</h2>
          <button onClick={onClose} className="text-brand-subtle hover:text-brand-text text-2xl font-bold leading-none">&times;</button>
        </div>
        
        <div className="p-6 max-h-[85vh] overflow-y-auto">
            <button 
                onClick={onStartAiIntake}
                className="w-full bg-brand-accent text-brand-primary font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-3 hover:bg-amber-500 transition-colors mb-4"
            >
                <BotIcon />
                Create with AI Assistant
            </button>
            <div className="flex items-center text-center my-4">
                <div className="flex-grow border-t border-slate-600"></div>
                <span className="flex-shrink mx-4 text-brand-subtle text-sm">OR CREATE WITH FORM</span>
                <div className="flex-grow border-t border-slate-600"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="site_name" className="block text-sm font-medium text-brand-subtle mb-1">Customer Site Name</label>
                        <input type="text" name="site_name" id="site_name" value={formState.site_name} onChange={handleChange} className={getInputClasses('site_name')} />
                        {errors.site_name && <p className="text-red-400 text-xs mt-1">{errors.site_name}</p>}
                    </div>
                    <div>
                        <label htmlFor="date_of_issue" className="block text-sm font-medium text-brand-subtle mb-1">Date of Issue</label>
                        <input type="date" name="date_of_issue" id="date_of_issue" value={formState.date_of_issue} onChange={handleChange} className={getInputClasses('date_of_issue')} />
                        {errors.date_of_issue && <p className="text-red-400 text-xs mt-1">{errors.date_of_issue}</p>}
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-brand-subtle mb-1">Category</label>
                        <select name="category" id="category" value={formState.category} onChange={handleChange} className={getInputClasses('category')}>
                            <option value="">Select Category</option>
                            <option value="Explosive">Explosive</option>
                            <option value="Detonator">Detonator</option>
                            <option value="Bulk">Bulk</option>
                            <option value="Service">Service</option>
                        </select>
                        {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
                    </div>
                    <div>
                        <label htmlFor="safety_impact" className="block text-sm font-medium text-brand-subtle mb-1">Safety Impact</label>
                         <select name="safety_impact" id="safety_impact" value={formState.safety_impact} onChange={handleChange} className={getInputClasses('safety_impact')}>
                            <option value="None">None</option>
                            <option value="Minor">Minor</option>
                            <option value="Major">Major</option>
                            <option value="Critical">Critical</option>
                        </select>
                        {errors.safety_impact && <p className="text-red-400 text-xs mt-1">{errors.safety_impact}</p>}
                    </div>
                </div>
                <div>
                    <label htmlFor="description_user" className="block text-sm font-medium text-brand-subtle mb-1">Brief Description</label>
                    <textarea name="description_user" id="description_user" value={formState.description_user} onChange={handleChange} rows={3} className={`${getInputClasses('description_user')} resize-none`} />
                    {errors.description_user && <p className="text-red-400 text-xs mt-1">{errors.description_user}</p>}
                </div>
                 <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={onClose} className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">Cancel</button>
                    <button 
                        type="submit" 
                        disabled={!isFormValid}
                        className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed"
                    >
                        Create Complaint
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default NewComplaintModal;