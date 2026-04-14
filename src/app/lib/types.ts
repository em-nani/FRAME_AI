export interface Project {
  id: string;
  name: string;
  prompt: string;
  attachments?: Attachment[];
  createdAt: string;
  lastSaved?: string;
  status: 'planning' | 'in-progress' | 'completed' | 'archived';
  moodBoard: MoodBoard;
  preProduction: PreProduction;
  callSheet: CallSheet;
  shotList: ShotListItem[];
  equipment: EquipmentItem[];
  budget: Budget;
  postProduction: PostProduction;
  deliverables: Deliverable[];
}

export interface Attachment {
  id: string;
  type: 'image' | 'file' | 'link';
  name: string;
  url: string;
  size?: number;
  uploadedAt: string;
}

export interface MoodBoard {
  images: string[];
  colorPalette: string[];
  keywords: string[];
  aesthetic: string;
}

export interface PreProduction {
  timeline: TimelineItem[];
}

export interface TimelineItem {
  id: string;
  phase: string;
  task: string;
  deadline: string;
  owner: string;
  status: 'not-started' | 'in-progress' | 'completed';
}

export interface CallSheet {
  shootDate: string;
  callTime: string;
  wrapTime: string;
  location: {
    name: string;
    address: string;
    parking: string;
    notes: string;
  };
  talent: TalentSlot[];
  crew: CrewMember[];
  schedule: ScheduleItem[];
  emergency: {
    hospital: string;
    police: string;
    contact: string;
  };
}

export interface TalentSlot {
  id: string;
  role: string;
  name: string;
  callTime: string;
  notes: string;
}

export interface CrewMember {
  id: string;
  role: string;
  name: string;
  contact: string;
  callTime: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  activity: string;
  location: string;
}

export interface ShotListItem {
  id: string;
  shotNumber: number;
  description: string;
  shotType: string;
  lens: string;
  notes: string;
  status: 'pending' | 'captured' | 'approved';
}

export interface EquipmentItem {
  id: string;
  category: string;
  item: string;
  quantity: number;
  notes: string;
  packed: boolean;
}

export interface Budget {
  totalEstimate: number;
  lineItems: BudgetLineItem[];
}

export interface BudgetLineItem {
  id: string;
  category: string;
  item: string;
  estimatedCost: number;
  actualCost?: number;
  notes: string;
}

export interface PostProduction {
  timeline: PostTimelineItem[];
}

export interface PostTimelineItem {
  id: string;
  phase: string;
  task: string;
  deadline: string;
  owner: string;
  status: 'not-started' | 'in-progress' | 'completed';
}

export interface Deliverable {
  id: string;
  type: string;
  dimensions: string;
  platform: string;
  quantity: number;
  status: 'pending' | 'in-progress' | 'delivered';
}