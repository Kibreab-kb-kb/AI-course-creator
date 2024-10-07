import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { environment } from "./environment";
import * as user from "../../db/user";
import * as course from "../../db/course";

export const queryClient = postgres(environment.DATABASE_URL);
export const db = drizzle(queryClient, { schema: { ...user, ...course } });
