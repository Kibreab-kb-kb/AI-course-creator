import "server-only";

import { appRouter } from "@/server";
import { createContext } from "vm";

export const serverTrpc = appRouter.createCaller(await createContext());
