import type { Computers } from '..';
import { roll } from './utils';

describe('alwaysBuild', () => {
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
		expect(file.source).toMatchSnapshot();
	});
});
