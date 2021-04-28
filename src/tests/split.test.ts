import type { ComputerSetups } from '..';
import { roll } from './utils';

describe('split', () => {
	it("doesn't split by default", async () => {
		expect.assertions(2);

		const computers: ComputerSetups = {
			test() {
				return { it: 'works' };
			}
		};

		const output = await roll('basic.js', computers);
		const file: any = output.find(c => c.fileName === 'basic.js');

		expect(output.length).toBe(1);
		expect(file.code).toMatchSnapshot();
	});

	it('splits when asked to', async () => {
		expect.assertions(2);

		const computers: ComputerSetups = {
			test: {
				split: true,
				fn() {
					return { it: 'works' };
				}
			}
		};

		const output = await roll('basic.js', computers);
		const file: any = output.find(c => c.fileName === 'test.js');

		expect(output.length).toBe(2);
		expect(file.code).toMatchSnapshot();
	});
});
