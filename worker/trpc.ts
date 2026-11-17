import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { WorkerContext } from "./context";

const t = initTRPC.context<WorkerContext>().create({ transformer: superjson });

export const router = t.router;
export const publicProcedure = t.procedure;
