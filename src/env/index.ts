import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
	DATABASE_CLIENT: z.string(),
	DATABASE_URL: z.string(),
	PORT: z.coerce.number().default(3333),
	NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
	console.error('[ERROR] Invalid envs!', _env.error.format());

	throw new Error('Invalid envs');
}

export const env = _env.data;
