import { createBrowserClient } from "@supabase/ssr";
import { environment } from "../environment";

export function createClient() {
  return createBrowserClient(
    environment.SUPABASE_URL,
    environment.PUBLIC_ANON_KEY,
  );
}
