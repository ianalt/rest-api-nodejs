import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable('transactions', (table) => {
		table.renameColumn('session_id', 'sessionId');
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable('transactions', (table) => {
		table.renameColumn('sessionId', 'session_id');
	});
}
