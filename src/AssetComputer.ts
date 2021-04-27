import { PluginContext } from 'rollup';
import { Computer } from './Computer';
import type { BaseSetup, Env } from './Computer';
import { contentType as getContentType } from 'mime-types';
import { Connect } from 'vite';
import type { ServerResponse } from 'http';

export interface AssetSetup extends BaseSetup {
	type: 'asset';

	/**
	 * File extension, without a dot.
	 * @example svg or json
	 */
	fileExt: string;

	/**
	 * Always include it during build, even if it's not imported anywhere in the app.
	 * @default false
	 */
	alwaysBuild?: boolean;
}
export type AssetSetups = Record<string, AssetSetup>;
export type AssetComputers = Record<string, AssetComputer>;
export class AssetComputer extends Computer {
	constructor(public name: string, public options: AssetSetup) {
		super(name, options);
	}

	public async load(rollup: PluginContext, env: Env): Promise<any> {
		if (!env.isVite) {
			const handle = await this.emit(rollup);
			return `export default import.meta.ROLLUP_FILE_URL_${handle};`;
		} else {
			return `export default '/@computed/${this.name}'`;
		}
	}

	public async emit(rollup: PluginContext): Promise<string> {
		const { fileName, fileExt } = this.options;
		const source = await this.get(rollup);

		return rollup.emitFile({
			type: 'asset',
			name: `${this.name}.${fileExt}`,
			fileName,
			source
		});
	}

	public async serve(
		rollup: PluginContext,
		req: Connect.IncomingMessage,
		res: ServerResponse
	): Promise<void> {
		const { fileExt } = this.options;
		if (!fileExt) return console.error(`No fileExt specified for ${name}.`);

		const contentType = getContentType(fileExt);
		if (!contentType) return console.error(`Unknown fileExt ${fileExt}`);

		res.setHeader('Content-Type', contentType);
		res.end(await this.get(rollup));
	}

	static fromSetup(setups: AssetSetups): AssetComputers {
		return Object.keys(setups).reduce((obj, key) => {
			obj[key] = new AssetComputer(key, setups[key]);
			return obj;
		}, <AssetComputers>{});
	}
}
