declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production";
    MAIN_WINDOW_NAME: string; // 主窗口名称
    FRAME_WINDOW_NAME: string; // 框架窗口名称
  }
}
