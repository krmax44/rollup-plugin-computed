import type { Computers } from '..';
import { roll } from './utils';

describe('serializer', () => {
	const obj = { it: 'works' };
	const string = 'var foo = "it works!";\n\nexport default foo;\n';

	it('serializes to json by default', async () => {
		expect.assertions(2);

		const computers: Computers = {
			test: {
				split: true,
				fn() {
					return obj;
				}
			}
		};

		const output = await roll('basic.js', computers);
		const file: any = output.find(c => c.fileName === 'test.js');

		expect(output.length).toBe(2);
		expect(file.code).toBe(`var test = {"it":"works"};

export default test;
`);
	});

	it('can be disabled', async () => {
		expect.assertions(2);

		const computers: Computers = {
			test: {
				split: true,
				serializer: false,
				fn() {
					return string;
				}
			}
		};

		const output = await roll('basic.js', computers);
		const file: any = output.find(c => c.fileName === 'test.js');

		expect(output.length).toBe(2);
		expect(file.code).toBe(string);
	});

	it('calls the custom serializer', async () => {
		expect.assertions(2);

		const computers: Computers = {
			test: {
				split: true,
				serializer: input => input[0],
				fn() {
					return [string];
				}
			}
		};

		const output = await roll('basic.js', computers);
		const file: any = output.find(c => c.fileName === 'test.js');

		expect(output.length).toBe(2);
		expect(file.code).toBe(string);
	});
});
