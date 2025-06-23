namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;

    DATABASE_URL: string;

    APP_LISTEN_PORT: string;

    ACCESS_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRY_IN_SEC: string;

    REFRESH_TOKEN_SECRET: string;
    REFRESH_TOKEN_EXPIRY_IN_SEC: string;
  }
}
