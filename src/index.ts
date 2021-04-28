import { name } from '../package.json';
import type { Plugin as VitePlugin } from 'vite';
import type { ComputerSetups } from './Computer';
import { AssetComputer } from './AssetComputer';
import Manager from './Manager';

export interface Options {
	computers: ComputerSetups;
}

export default function computed(options: Options): VitePlugin {
	const manager = new Manager(options.computers);

	return {
		name,
		resolveId(source) {
			manager.rollup = this;

			return source.endsWith('.computed') ? source : undefined;
		},
		async load(id) {
			manager.rollup = this;

			const [, name] = /(.*?)\.computed/.exec(id) ?? [];
			const computer = manager.getComputer(name);
			if (!computer) return null;

			return computer.load();
		},
		buildStart() {
			if (manager.viteWatchMode) return;
			manager.rollup = this;

			for (const computer of manager.assetComputers) {
				if (computer.options.alwaysBuild) {
					computer.emit();
				}
			}
		},
		async configureServer(server) {
			manager.isVite = true;

			server.middlewares.use(async (req, res, next) => {
				const [, name] = /\/@computed\/(.+)/.exec(req.url ?? '') ?? [];
				const computer = manager.getComputer(name);

				if (name && computer && computer instanceof AssetComputer) {
					return computer.serve(req, res);
				}

				next();
			});
		}
	};
}

export { ComputerSetups };
