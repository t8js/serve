export type Config = {
  url?: string;
  path?: string;
  dirs?: string[];
  spa?: boolean;
  bundle?: {
    input?: string;
    output?: string;
  };
};
