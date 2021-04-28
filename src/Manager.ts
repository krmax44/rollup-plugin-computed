import type { PluginContext } from 'rollup';
import { AssetComputer } from './AssetComputer';
import { ChunkComputer } from './ChunkComputer';
import { ComputerSetups } from './Computer';

export default class Manager {
	public isVite = false;
	public rollup: PluginContext = ({} as unknown) as PluginContext;

	public computers: Map<string, AssetComputer | ChunkComputer> = new Map();

	constructor(setups: ComputerSetups) {
		for (const [name, setup] of Object.entries(setups)) {
			let computer;

			if (typeof setup === 'function') {
				computer = new ChunkComputer(name, { fn: setup }, this);
			} else if (setup.type === 'asset') {
				computer = new AssetComputer(name, setup, this);
			} else {
				computer = new ChunkComputer(name, setup, this);
			}

			this.computers.set(name, computer);
		}
	}

	get assetComputers(): AssetComputer[] {
		const computers = [...this.computers.values()];
		return computers.filter(c => c instanceof AssetComputer) as AssetComputer[];
	}

	public getComputer = this.computers.get.bind(this.computers);

	get watchMode(): boolean {
		return this.rollup?.meta.watchMode ?? false;
	}

	get viteWatchMode(): boolean {
		return this.isVite && this.watchMode;
	}
}
