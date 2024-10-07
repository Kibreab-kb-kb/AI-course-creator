import { environment } from "@/lib/environment";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: environment.DATABASE_URL,
  },
});
