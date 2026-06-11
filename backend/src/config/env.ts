// check jwt once here and import it everywhere instead of doing so in every file, need to do it becuase of typescript.
// Z The TypeScript error happens because process.env.ANY_KEY is always typed as string | undefined. TypeScript is trying to protect you from passing undefined into jwt.sign(), which expects a guaranteed string.

import {z} from 'zod';
import 'dotenv/config';

const envSchema = z.object({
    DATABASE_URL: z.string().min(1,"DATABASE_URL missing"),
    JWT_SECRET_KEY: z.string().min(1,"HWT_SECRET_KEY"),
    PORT: z.string().optional().default("8000"),
});

export const env = envSchema.parse(process.env);
