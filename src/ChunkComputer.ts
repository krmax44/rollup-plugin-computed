import { Computer } from './Computer';
import type { BaseSetup, ComputerFn } from './Computer';
import Manager from './Manager';

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
	serializer?:
		| 'json'
		| 'json-collection'
		| false
		| ((computerFnOutput: any) => string);

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

	constructor(
		public name: string,
		options: ChunkSetup,
		public manager: Manager
	) {
		super(name, options, manager);

		this.options = {
			serializer: 'json',
			split: false,
			...options
		};
	}

	public async load(): Promise<string> {
		const { split } = this.options;
		const computed = await this.get();

		if (split) this.emit();

		return this.serialize(computed);
	}

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	public serialize(computed: any): string {
		const { serializer } = this.options;

		if (serializer === 'json') {
			return `export default ${JSON.stringify(computed)};`;
		} else if (serializer === 'json-collection') {
			const singles = Object.entries(computed as Record<string, any>).map(
				([key, value]) => {
					const name = `${this.name}|${key}`;
					const fn = () => value;

					const computer = new ChunkComputer(
						name,
						{ fn, split: true },
						this.manager
					);
					if (!this.manager.viteWatchMode) computer.emit();

					this.manager.computers.set(name, computer);

					return [key, `${name}.computed`].map(v => JSON.stringify(v));
				}
			);

			return `export default {
				${singles.map(
					([key, handle]) =>
						`${key}: async () => (await import(${handle})).default`
				)}
			};`;
		} else if (typeof serializer === 'function') {
			return serializer(computed);
		} else {
			return computed;
		}
	}

	public async emit(): Promise<string> {
		const { id, name } = this;
		return this.manager.rollup.emitFile({
			type: 'chunk',
			id,
			name,
			fileName: this.options.fileName
		});
	}
}
