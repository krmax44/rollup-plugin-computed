import path from 'path';
import { rollup, RollupOutput } from 'rollup';
import computed, { Computers } from '..';

export async function roll(
	input: string,
	computers: Computers
): Promise<RollupOutput['output']> {
	const bundler = await rollup({
		input: path.join(__dirname, 'fixtures', input),
		plugins: [computed({ computers })]
	});

	const { output } = await bundler.generate({
		entryFileNames: '[name].js',
		assetFileNames: 'assets/[name].[ext]',
		chunkFileNames: '[name].js'
	});

	return output;
}
