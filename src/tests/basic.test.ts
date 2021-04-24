import { helloWorld } from '..';

describe('basic test', () => {
	it('works', () => {
		expect(helloWorld).toBe('Hello World!');
	});
});
