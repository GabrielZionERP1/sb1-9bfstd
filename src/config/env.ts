interface EnvConfig {
  DATABASE_URL: string;
}

export const env: EnvConfig = {
  DATABASE_URL: import.meta.env.VITE_DATABASE_URL || '',
};