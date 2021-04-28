import fs from 'fs/promises';
import path from 'path';
import type { ComputerSetups } from '..';
import { roll } from './utils';

describe('serializer', () => {
	const obj = { it: 'works' };
	const string = 'var foo = "it works!";\n\nexport default foo;\n';

	const outDir = path.join(__dirname, '.tmp', 'json-collection');

	it('serializes to json by default', async () => {
		expect.assertions(2);

		const computers: ComputerSetups = {
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

		const computers: ComputerSetups = {
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

		const computers: ComputerSetups = {
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

	it('handles collections', async () => {
		expect.assertions(5);

		const computers: ComputerSetups = {
			test: {
				/* split: true, */
				serializer: 'json-collection',
				fn() {
					return {
						first: 1,
						second: 2,
						third: 3
					};
				}
			}
		};

		const output = await roll('json-collection.js', computers, {
			cjs: true,
			outDir
		});
		const file: any = output.find(c => c.fileName === 'json-collection.js');

		expect(output.length).toBe(4);
		expect(file.code).toMatchSnapshot();

		const code = file.code.replace(
			/require\('\.\//gm,
			"require('./.tmp/json-collection/"
		);

		const mod = eval(code);
		const collection = mod();

		expect(await collection.first()).toBe(1);
		expect(await collection.second()).toBe(2);
		expect(await collection.third()).toBe(3);
	});

	beforeAll(async () => {
		await fs.rm(outDir, { recursive: true });
	});
});
