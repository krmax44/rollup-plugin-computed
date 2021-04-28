import { Computer } from './Computer';
import type { BaseSetup } from './Computer';
import { contentType as getContentType } from 'mime-types';
import { Connect } from 'vite';
import type { ServerResponse } from 'http';
import Manager from './Manager';

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
	constructor(
		public name: string,
		public options: AssetSetup,
		public manager: Manager
	) {
		super(name, options, manager);
	}

	public async load(): Promise<any> {
		if (this.manager.viteWatchMode) {
			return `export default '/@computed/${this.name}'`;
		} else {
			const handle = await this.emit();
			return `export default import.meta.ROLLUP_FILE_URL_${handle};`;
		}
	}

	public async emit(): Promise<string> {
		const { fileName, fileExt } = this.options;
		const source = await this.get();

		return this.manager.rollup.emitFile({
			type: 'asset',
			name: `${this.name}.${fileExt}`,
			fileName,
			source
		});
	}

	public async serve(
		req: Connect.IncomingMessage,
		res: ServerResponse
	): Promise<void> {
		const { fileExt } = this.options;
		if (!fileExt) return console.error(`No fileExt specified for ${name}.`);

		const contentType = getContentType(fileExt);
		if (!contentType) return console.error(`Unknown fileExt ${fileExt}`);

		res.setHeader('Content-Type', contentType);
		res.end(await this.get());
	}
}
