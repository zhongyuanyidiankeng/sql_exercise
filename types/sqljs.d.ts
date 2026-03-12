declare module 'sql.js' {
  interface InitSqlJsConfig {
    locateFile?: (file: string) => string;
  }

  const initSqlJs: (config?: InitSqlJsConfig) => Promise<any>;
  export default initSqlJs;
}
