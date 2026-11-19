import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../../worker/routers";

export const trpc = createTRPCReact<AppRouter>();
