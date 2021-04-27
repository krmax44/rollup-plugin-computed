import type { PluginContext } from 'rollup';
import type { AssetSetup } from './AssetComputer';
import type { ChunkSetup } from './ChunkComputer';

export type ComputerFn = (this: PluginContext) => any | Promise<any>;

export interface BaseSetup {
	/**
	 * The computer function.
	 */
	fn: ComputerFn;

	/**
	 * Output filename. Generated by rollup by default, based on the computer's name.
	 */
	fileName?: string;
}

export type ComputerSetup = ChunkSetup | AssetSetup;

export interface Env {
	isVite: boolean;
	watchMode: boolean;
}

export abstract class Computer {
	public cache?: any | Buffer;

	constructor(public name: string, public options: BaseSetup) {}

	public async get(rollup: PluginContext): Promise<any> {
		if (this.cache) return this.cache;

		return Promise.resolve(this.options.fn.apply(rollup));
	}

	get id(): string {
		return `${this.name}.computed`;
	}
}
