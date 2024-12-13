export const ENV = {
  PORT: process.env.PORT || "3000",
  PROFILER_BASE_URL: process.env.NEXT_PUBLIC_PROFILER_URL || "http://localhost:3000",
  PROVIDER_BASE_URL: process.env.NEXT_PUBLIC_PROVIDER_URL || "http://localhost:3001",
  DATABASE_URL: process.env.DATABASE_URL || "",
  I18NEXUS_API_KEY: process.env.I18NEXUS_API_KEY || "",
  TEST_APP_ID: process.env.NEXT_PUBLIC_TEST_APP_ID,
  NEXT_PUBLIC_FE_URL: process.env.NEXT_PUBLIC_FE_URL,
  BUCKET_SERVICE: process.env.BUCKET_SERVICE,
  BUCKET_SERVICE_SECRET: process.env.BUCKET_SERVICE_SECRET || "",
};
