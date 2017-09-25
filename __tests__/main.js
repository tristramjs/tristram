/* @flow */
import Main from '../src/main';

describe('Main module', () => {
	it('...', async () => {
		const main = new Main({
			fetchers: [],
			formatter: { format: () => 'foooo' },
		});

		const result = await main.run();

		expect(result).toBe('foooo');
	});
});
