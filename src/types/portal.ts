export type LeadStatus = 'New' | 'Reviewing' | 'Won' | 'Lost' | 'Spam';

export type ProjectStatus = 'Active' | 'In Progress' | 'Completed' | 'Maintenance';

export type MilestoneStatus = 'To Do' | 'In Progress' | 'Done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  assigneeName?: string;
  assigneeAvatar?: string;
}

export interface DeliverableFile {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadDate: string;
  downloadUrl: string;
}

export interface MilestoneComment {
  id: string;
  authorName: string;
  authorRole: 'Client' | 'Admin';
  authorAvatar?: string;
  timestamp: string;
  content: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: MilestoneStatus;
  tasks: Task[];
  deliverables: DeliverableFile[];
  comments: MilestoneComment[];
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  serviceType: 'Web Development' | 'Mobile App' | 'UI/UX Design' | 'E-Commerce' | 'Custom Software';
  budgetEstimate: string;
  submittedDate: string;
  status: LeadStatus;
  notes: string;
  source: 'Website Form' | 'Referral' | 'LinkedIn' | 'Direct Email';
  message: string;
  timelineHistory: {
    id: string;
    status: LeadStatus;
    timestamp: string;
    author: string;
    note?: string;
  }[];
}

export interface Project {
  id: string;
  projectName: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  targetCompletion: string;
  budget: string;
  lastUpdated: string;
  nextMilestoneTitle: string;
  milestonesCount: {
    total: number;
    completed: number;
  };
  assignees: {
    name: string;
    avatar: string;
    role: string;
  }[];
  milestones: Milestone[];
}

export type ViewPage = 
  | 'admin-login'             // 1. Admin Login
  | 'admin-leads'             // 2. Admin Leads Kanban/List
  | 'admin-projects'          // 4. Admin Projects List
  | 'admin-project-detail'    // 5. Admin Project & Milestone Detail
  | 'client-activation'       // 6. Magic Link Activation
  | 'client-login'            // 7. Client Login (Password/Magic Link)
  | 'client-dashboard'        // 8. Client Projects Dashboard
  | 'client-project-detail';  // 9 & 10. Client Project Detail & Milestone Comments

export type ActiveNavSection = 
  | 'dashboard-leads' 
  | 'projects' 
  | 'clients-portal' 
  | 'file-management' 
  | 'calendar' 
  | 'team' 
  | 'settings';
