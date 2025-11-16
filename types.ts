// types.ts

// --------------- MESSAGE TYPES ---------------

export interface UserMessage {
    id: number;
    sender: 'user';
    text: string;
}

export interface BotMessage {
    id: number;
    sender: 'bot';
    summary: string;
    complaintData: object | null;
    toolIntentData: object | null;
}

export type Message = UserMessage | BotMessage;


// --------------- COMPLAINT SCHEMA TYPES ---------------

interface Customer {
    name: string | null;
    contact: string | null;
    site_name: string | null;
    site_code: string | null;
    region: string | null;
    country: string | null;
}

interface ComplaintInfo {
    id: string;
    created_at: string;
    channel: 'voice' | 'text';
    reported_by_role: 'Rep' | 'Customer' | 'Technician';
    customer: Customer;
    category: 'Explosive' | 'Detonator' | 'Bulk' | 'Service' | null;
    sub_category: string | null;
    product_sku: string | null;
    lot_batch: string | null;
    quantity_affected: number | null;
    date_of_issue: string | null;
    safety_impact: 'None' | 'Minor' | 'Major' | 'Critical' | null;
    operational_impact: 'None' | 'Low' | 'Medium' | 'High' | null;
    description_user: string | null;
    attachments: any[]; // Define more strictly if needed
    labels: string[];
}

interface Triage {
    severity: 'S0' | 'S1' | 'S2' | 'S3' | null;
    priority: 'P1' | 'P2' | 'P3' | 'P4' | null;
    initial_hypotheses: string[];
    required_functions: string[];
    sla: object;
    routing_suggestion: object | null;
}

interface Investigation {
    data_requests: string[];
    evidence_summary: string | null;
    missing_info: string[];
}

interface Status {
    state: 'New' | 'Acknowledged' | 'Under_Investigation' | 'RCA_Complete' | 'CAPA_In_Progress' | 'Sustenance' | 'Resolved' | 'Closed' | 'On_Hold';
    next_best_action: string | null;
    owner: string | null;
    due_next: string | null;
}

// Main Complaint Interface
export interface Complaint {
    complaint: ComplaintInfo;
    triage: Triage;
    investigation: Investigation;
    rca: object; // Define more strictly if needed
    capa: object; // Define more strictly if needed
    sustenance: object; // Define more strictly if needed
    status: Status;
    audit: object; // Define more strictly if needed
    history: Message[];
}
