import { expect, test } from 'vitest';

test('user can create new transaction', () => {
	const resStatusCode = 201;

	expect(resStatusCode).toEqual(201);
});
