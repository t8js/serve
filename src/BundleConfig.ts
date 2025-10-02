export type BundleConfig = {
  /**
   * Output directory path relative to the server config `path`.
   * 
   * @defaultValue "dist"
   */
  dir?: string;
  /**
   * Input path relative to the server config `path`.
   * 
   * @defaultValue "index.ts"
   */
  input?: string;
  /**
   * Output path relative to the bundle config `dir`.
   * 
   * @defaultValue "index.js"
   */
  output?: string;
};
