import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		NEXTAUTH_SECRET: z.string().min(1),
		GITHUB_SECRET: z.string().min(1),
		GITHUB_ID: z.string().min(1),
	},
	client: {
		// no client env yet
	},
	experimental__runtimeEnv: {
		// destructure client variables here ...
	},
});
