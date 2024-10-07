import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

const environment_schema = z.object({
  NODE_ENV: z.string().default("development").optional(),
  SUPABASE_URL: z.string(),
  PUBLIC_ANON_KEY: z.string(),
  DATABASE_URL: z.string(),
  BACKEND_URL: z.string(),
  OPENAI_API_KEY: z.string(),
  UNSPLASH_API_KEY: z.string(),
});

type environmentSchemaType = z.infer<typeof environment_schema>;

const env_files: Record<string, string> = {
  testing: ".test.env",
  development: ".dev.env",
  production: ".env",
};

export const load_env_variables = (): void => {
  const node_env: keyof typeof env_files = process.env[
    "NODE_ENV"
  ] as keyof typeof env_files;
  const envFile = env_files[node_env] ?? ".env";

  dotenv.config({
    path: path.resolve(process.cwd(), envFile),
  });
};

load_env_variables();

export const environment = {
  SUPABASE_URL: process.env["NEXT_PUBLIC_SUPABASE_URL"] as string,
  PUBLIC_ANON_KEY: process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] as string,
  DATABASE_URL: process.env["NEXT_PUBLIC_DATABASE_URL"] as string,
  NODE_ENV: process.env["NODE_ENV"] as string,
  BACKEND_URL: process.env["NEXT_PUBLIC_BACKEND_URL"] as string,
  OPENAI_API_KEY: process.env["OPENAI_API_KEY"] as string,
  UNSPLASH_API_KEY: process.env["UNSPLASH_API_KEY"] as string,
} satisfies environmentSchemaType;

export const validate_env_schema = (): void => {
  console.log("Validating environment schema...");
  const parsed = environment_schema.safeParse(environment);

  if (!parsed.success) {
    console.error(`Environment variables not valid: ${parsed.error}`);
    process.exit(1);
  }
};
