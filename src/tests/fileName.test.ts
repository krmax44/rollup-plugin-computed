import type { Computers } from '..';
import { roll } from './utils';

describe('fileName', () => {
	it('respects custom file names', async () => {
		expect.assertions(2);

		const computers: Computers = {
			test: {
				fileName: 'bar.js',
				fn() {
					return { it: 'works' };
				}
			}
		};

		const output = await roll('basic.js', computers, false);
		const file: any = output.find(c => c.fileName === 'bar.js');

		expect(output.length).toBe(2);
		expect(file.code).toMatchSnapshot();
	});
});
