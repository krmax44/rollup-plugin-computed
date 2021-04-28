import path from 'path';
import { rollup, RollupOutput, OutputOptions } from 'rollup';
import computed, { ComputerSetups } from '..';

export async function roll(
	input: string,
	computers: ComputerSetups,
	options: { noHash?: boolean; cjs?: boolean; outDir?: string } = {}
): Promise<RollupOutput['output']> {
	const plugins = [computed({ computers })];

	const bundler = await rollup({
		input: path.join(__dirname, 'fixtures', input),
		plugins,
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		onwarn() {}
	});

	const config: OutputOptions =
		options.noHash === undefined
			? {
					entryFileNames: '[name].js',
					assetFileNames: 'assets/[name].[ext]',
					chunkFileNames: '[name].js'
			  }
			: {};

	config.format = options.cjs ? 'cjs' : undefined;
	config.dir = options.outDir;

	const { output } = await bundler[options.outDir ? 'write' : 'generate'](
		config
	);

	return output;
}
