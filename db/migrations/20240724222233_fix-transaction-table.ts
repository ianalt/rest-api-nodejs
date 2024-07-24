import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable('transactions', (table) => {
		table.decimal('amount', 10, 2).notNullable()
		table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable('transactions', (table) => {
		table.dropColumn('amount')
		table.dropColumn('created_at')
	})
}
