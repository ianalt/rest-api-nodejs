import { randomUUID } from 'node:crypto';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';
import { checkSessionIdExists } from '../midddlewares/check-session-id-exists';

export async function transactionRoutes(app: FastifyInstance) {
	app.get(
		'/',
		{
			preHandler: [checkSessionIdExists],
		},
		async (req, _res) => {
			const { sessionId } = req.cookies;

			const transactions = await knex('transactions')
				.where({ sessionId })
				.select();

			return {
				transactions,
			};
		},
	);

	app.get(
		'/:id',
		{
			preHandler: [checkSessionIdExists],
		},
		async (req) => {
			const { sessionId } = req.cookies;

			const getTransactionParamsSchema = z.object({
				id: z.string().uuid(),
			});

			const { id } = getTransactionParamsSchema.parse(req.params);

			const transaction = await knex('transactions')
				.where({ id, sessionId })
				.first();

			return {
				transaction,
			};
		},
	);

	app.get(
		'/summary',
		{
			preHandler: [checkSessionIdExists],
		},
		async (req) => {
			const { sessionId } = req.cookies;

			const summary = await knex('transactions')
				.where({ sessionId })
				.sum('amount', { as: 'amount' })
				.first();

			return {
				summary,
			};
		},
	);

	app.post('/', async (req, res) => {
		const createTransactionBodySchema = z.object({
			title: z.string(),
			amount: z.number(),
			type: z.enum(['credit', 'debit']),
		});

		const { title, amount, type } = createTransactionBodySchema.parse(req.body);

		let sessionId = req.cookies.sessionId;

		if (!sessionId) {
			sessionId = randomUUID();

			res.cookie('sessionId', sessionId, {
				path: '/',
				maxAge: 60 * 60 * 24 * 7, // 7 days
			});
		}

		await knex('transactions').insert({
			id: randomUUID(),
			title,
			amount: type === 'credit' ? amount : amount * -1,
			sessionId,
		});

		return res.status(201).send();
	});
}
