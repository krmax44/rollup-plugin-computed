import { defineConfig } from 'vite';
import computed, { ComputerSetups } from '..';

const computers: ComputerSetups = {
	test: {
		split: true,
		fn() {
			return { hello: 'world' };
		}
	},
	image: {
		alwaysBuild: true,
		type: 'asset',
		fileExt: 'svg',
		fn() {
			return `<svg version="1.1" baseProfile="full" width="100" height="50" xmlns="http://www.w3.org/2000/svg">
				<text x="30" y="30" font-size="20" fill="black">Hello!</text>
			</svg>`;
		}
	}
};

export default defineConfig({
	plugins: [computed({ computers })]
});
