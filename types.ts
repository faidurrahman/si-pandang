
export interface Requirement {
  id: string;
  label: string;
  isMandatory: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirements: Requirement[];
  category: 'Kepegawaian' | 'Kesejahteraan' | 'Mutasi' | 'Pensiun';
  estimatedTime: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}
