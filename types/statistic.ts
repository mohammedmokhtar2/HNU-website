// College type will be imported when needed

// Base Statistic interface
export interface Statistic {
  id: string;
  label: Record<string, any>; // { ar: "عدد الطلاب", en: "Students" }
  collageId?: string;
  collage?: any;
}

// Statistic creation input type
export interface CreateStatisticInput {
  label: Record<string, any>;
  collageId?: string;
}

// Statistic update input type
export interface UpdateStatisticInput {
  label?: Record<string, any>;
  collageId?: string;
}

// Statistic response type (for API responses)
export interface StatisticResponse {
  id: string;
  label: Record<string, any>;
  collageId?: string;
}

// Statistic with relations response type
export interface StatisticWithRelationsResponse extends StatisticResponse {
  collage?: any;
}
