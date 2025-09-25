export type Config = {
  url?: string;
  path?: string;
  dirs?: string[];
  spa?: boolean;
  bundle?:
    | boolean
    | {
        input?: string;
        output?: string;
      };
};
