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
}
