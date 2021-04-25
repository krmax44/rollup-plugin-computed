import type { Computers } from '..';
import { roll } from './utils';

describe('basic tests', () => {
	it('builds a basic compute', async () => {
		expect.assertions(3);

		const computers: Computers = {
			test() {
				return { it: 'works' };
			}
		};

		const output = await roll('basic.js', computers);
		const file: any = output.find(c => c.fileName === 'test.js');

		expect(output.length).toBe(2);
		expect(file.code).toBe(
			'var test = {"it":"works"};\n\nexport default test;\n'
		);
		expect(file.fileName).toBe('test.js');
	});

	it('force builds computes', async () => {
		expect.assertions(2);

		const computers: Computers = {
			test: {
				alwaysBuild: true,
				type: 'asset',
				fileExt: 'json',
				fn() {
					return JSON.stringify({ it: 'works' });
				}
			}
		};

		const output = await roll('nothing.js', computers);
		const file: any = output.find(c => c.fileName === 'assets/test.json');

		expect(output.length).toBe(2);
		expect(file.source).toBe('{"it":"works"}');
	});
});
