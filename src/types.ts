export interface Pranayama {
  name: string;
  benefits: string;
  caution: string;
  steps?: string[];
}

export interface Asana {
  name: string;
  benefits: string;
  caution: string;
  steps?: string[];
}

export interface Diet {
  what_to_eat: string[];
  what_to_avoid: string[];
}

export interface HealthPlan {
  disease: string;
  pranayama: Pranayama[];
  asanas: Asana[];
  home_remedies: string[];
  diet: Diet;
  medical_advice: string;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  queryText: string;
  image?: string; // base64 representation of thumbnail if uploaded
  plan: HealthPlan;
}
