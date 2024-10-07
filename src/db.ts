import postgres from "postgres";
import { environment } from "./lib/environment";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

const migrationClient = postgres(environment.DATABASE_URL, { max: 1 });

migrate(drizzle(migrationClient), {
  migrationsFolder: "drizzle",
});
export const queryClient = postgres(environment.DATABASE_URL);
export const db = drizzle(queryClient);

migrationClient.end();

process.exit(0);
