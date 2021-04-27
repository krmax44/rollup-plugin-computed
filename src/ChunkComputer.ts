import { PluginContext } from 'rollup';
import { Computer } from './Computer';
import type { BaseSetup, ComputerFn } from './Computer';

export interface ChunkSetup extends BaseSetup {
	type?: 'chunk';

	/**
	 * The computer function's return value needs to be serialized to an ES module.
	 * By default, it will be JSON.stringify'ed and set as the default ES export.
	 * You can disable serialization by returning a string in your compute function
	 * and setting serializer to false.
	 * You can also provide a custom serializer function.
	 * @default json
	 */
	serializer?: 'json' | false | ((computerFnOutput: any) => string);

	/**
	 * Split the computed data into a seperate chunk.
	 * @default true
	 */
	split?: boolean;
}

export type ChunkComputers = Record<string, ChunkComputer>;
export type ChunkSetups = Record<string, ChunkSetup | ComputerFn>;
export class ChunkComputer extends Computer {
	public options: ChunkSetup;

	constructor(public name: string, options: ChunkSetup) {
		super(name, options);

		this.options = {
			serializer: 'json',
			split: false,
			...options
		};
	}

	public async load(rollup: PluginContext): Promise<any> {
		const { serializer, split } = this.options;
		const computed = await this.get(rollup);

		if (split) this.emit(rollup);

		if (serializer === 'json') {
			return `export default ${JSON.stringify(computed)};`;
		} else if (typeof serializer === 'function') {
			return serializer(computed);
		} else {
			return computed;
		}
	}

	public async emit(rollup: PluginContext): Promise<string> {
		const { id, name } = this;
		return rollup.emitFile({
			type: 'chunk',
			id,
			name,
			fileName: this.options.fileName
		});
	}

	static fromSetup(setups: ChunkSetups): ChunkComputers {
		return Object.keys(setups).reduce((obj, key) => {
			const setup = setups[key];
			obj[key] =
				typeof setup === 'function'
					? new ChunkComputer(key, { fn: setup })
					: new ChunkComputer(key, setup);

			return obj;
		}, <ChunkComputers>{});
	}
}
