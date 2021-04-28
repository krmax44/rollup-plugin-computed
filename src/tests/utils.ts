import path from 'path';
import { rollup, RollupOutput } from 'rollup';
import computed, { ComputerSetups } from '..';

export async function roll(
	input: string,
	computers: ComputerSetups,
	noHash = true
): Promise<RollupOutput['output']> {
	const bundler = await rollup({
		input: path.join(__dirname, 'fixtures', input),
		plugins: [computed({ computers })]
	});

	const config = noHash
		? {
				entryFileNames: '[name].js',
				assetFileNames: 'assets/[name].[ext]',
				chunkFileNames: '[name].js'
		  }
		: {};

	const { output } = await bundler.generate(config);

	return output;
}
