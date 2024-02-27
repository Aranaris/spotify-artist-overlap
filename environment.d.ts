declare global {
  namespace NodeJS {
    interface ProcessEnv {
			SPOTIFY_API_SECRET: string;
			SPOTIFY_API_CLIENTID: string;
			MONGODB_URI: string;
			JWT_SECRET_KEY: string;
    }
  }
}

export {};
