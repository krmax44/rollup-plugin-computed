import { name } from '../package.json';
import type { Plugin as VitePlugin } from 'vite';
import { PluginContext } from 'rollup';
import type { ComputerSetup, ComputerFn } from './Computer';
import { AssetComputer } from './AssetComputer';
import { ChunkComputer } from './ChunkComputer';

export type Computers = Record<string, ComputerFn | ComputerSetup>;
export interface Options {
	computers: Computers;
}

export default function computed(options: Options): VitePlugin {
	const computers = Object.keys(options.computers).reduce((obj, key) => {
		const setup = options.computers[key];

		if (typeof setup === 'function') {
			obj[key] = new ChunkComputer(key, { fn: setup });
		} else if (setup.type === 'asset') {
			obj[key] = new AssetComputer(key, setup);
		} else {
			obj[key] = new ChunkComputer(key, setup);
		}

		return obj;
	}, <Record<string, AssetComputer | ChunkComputer>>{});

	let isVite = false;
	let rollup: PluginContext;

	return {
		name,
		resolveId(source) {
			rollup = this;
			return source.endsWith('.computed') ? source : undefined;
		},
		async load(id) {
			rollup = this;
			const { watchMode } = this.meta;
			const [, name] = /(.*?)\.computed/.exec(id) ?? [];
			const computer = computers[name];
			if (!computer) return null;

			const env = { watchMode, isVite };

			return computer.load(rollup, env);
		},
		buildStart() {
			if (isVite) return;

			for (const computer of Object.values(computers)) {
				if (computer instanceof AssetComputer && computer.options.alwaysBuild) {
					computer.emit(this);
				}
			}
		},
		async configureServer(server) {
			isVite = true;

			server.middlewares.use(async (req, res, next) => {
				const [, name] = /\/@computed\/(.+)/.exec(req.url ?? '') ?? [];
				const computer = computers[name];

				if (name && computer && computer instanceof AssetComputer) {
					return computer.serve(rollup, req, res);
				}

				next();
			});
		}
	};
}
