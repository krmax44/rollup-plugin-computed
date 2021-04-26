import type { Computers } from '..';
import { roll } from './utils';

describe('split', () => {
	it('splits by default', async () => {
		expect.assertions(2);

		const computers: Computers = {
			test() {
				return { it: 'works' };
			}
		};

		const output = await roll('basic.js', computers);
		const file: any = output.find(c => c.fileName === 'test.js');

		expect(output.length).toBe(2);
		expect(file.code).toMatchSnapshot();
	});

	it("doesn't split when asked to", async () => {
		expect.assertions(2);

		const computers: Computers = {
			test: {
				split: false,
				fn() {
					return { it: 'works' };
				}
			}
		};

		const output = await roll('basic.js', computers);
		const file: any = output.find(c => c.fileName === 'basic.js');

		expect(output.length).toBe(1);
		expect(file.code).toMatchSnapshot();
	});
});
