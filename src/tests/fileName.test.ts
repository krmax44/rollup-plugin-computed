import type { ComputerSetups } from '..';
import { roll } from './utils';

describe('fileName', () => {
	it('respects custom file names', async () => {
		expect.assertions(2);

		const computers: ComputerSetups = {
			test: {
				split: true,
				fileName: 'bar.js',
				fn() {
					return { it: 'works' };
				}
			}
		};

		const output = await roll('basic.js', computers, { noHash: true });
		const file: any = output.find(c => c.fileName === 'bar.js');

		expect(output.length).toBe(2);
		expect(file.code).toMatchSnapshot();
	});
});
