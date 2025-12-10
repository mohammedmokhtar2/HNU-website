export interface Config {
  id: string;
  config: {
    globalConfig: globalConfig;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface globalConfig {
  counter: number;
  lastVisit: string;
  newVisitors: number;
  returningVisitors: number;
  dailyStats: {
    [date: string]: {
      visitors: number;
      pageViews: number;
      sessions: number;
      newVisitors: number;
      returningVisitors: number;
    };
  };
  monthlyStats: {
    [month: string]: {
      visitors: number;
      pageViews: number;
      sessions: number;
      newVisitors: number;
      returningVisitors: number;
    };
  };
  hourlyStats: {
    [hour: string]: number;
  };
  deviceStats: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  browserStats: {
    [browser: string]: number;
  };
  countryStats: {
    [country: string]: number;
  };
}

export interface VisitorData {
  timestamp: string;
  isNewVisitor: boolean;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  country: string;
  pageViews: number;
  sessionId: string;
}
